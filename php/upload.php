<?php
require 'vendor/autoload.php';
ini_set('display_errors', 1);

function getTags($tipo_tag, $db){
	$tags = array();
	$query_text = "SELECT nom_tag FROM Tag WHERE tipo_tag=? GROUP BY nom_tag";
	$query = $db->prepare($query_text);
	$query->execute([$tipo_tag]);
	$results = $query->fetchAll(PDO::FETCH_ASSOC);
	foreach ($results as $row) {
		$tags[] = $row["nom_tag"];
	}
	return $tags;
}

function getSiglas($tags){
	$pattern = '/[A-Z]|Á/';
	foreach($tags as $label){
		$sigla="";
		if( preg_match_all($pattern, $label, $matches) ){
			if( count($matches[0]) >1){
				foreach ($matches[0] as $val) {
					if($val == 'Á'){
						$sigla.='A';
					}else{
						$sigla.=$val;
					}
				}
				$siglas[$label] = $sigla;
			}
		}
	}
	return $siglas;
}

$db = new PDO("sqlite:../examenes.db");
$db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
$asigs = getTags("asig", $db);
$asigSiglas = getSiglas($asigs);
$meses =  array("oct","nov","dic","ene","feb","mar","abr","may","jun","jul","sep");
for($i=2011; $i<2020; $i++) {
	$anios[] = $i;
}
$patterns = array('/\s/','/á/','/é/','/í/','/ó/','/ú/');
$replacements = array('\s+','(a|á)','(e|é)','(i|í)','(o|ó)','(u|ú)');
$updir='../sinClasificar';
$ds=DIRECTORY_SEPARATOR;
$fp=fopen("./log.txt", 'a') or die();
$parser = new \Smalot\PdfParser\Parser();
$image = new Gmagick();
$image->setResolution( 204*2, 196*2 ); 

$db->beginTransaction(); 
foreach($_FILES['file']['name'] as $index=>$filename){
	$md5 = md5_file( $_FILES['file']['tmp_name'][$index] );
   	$query_text='SELECT COUNT(*) FROM Documento WHERE id_doc=?';
   	$query = $db->prepare($query_text);
    $query->execute([$md5]);
    $file = $updir.$ds.$filename;
   	// Check if file is not +uploaded and if it is not in the db
   	$txt="";
   	if($query->fetchColumn()==0){
   	// if(!file_exists($file) and $query->fetchColumn()==0){
   		fwrite($fp, PHP_EOL."BEGIN-file".PHP_EOL."name:".$filename.PHP_EOL);
        move_uploaded_file($_FILES['file']['tmp_name'][$index], $file);
	    if( mime_content_type($file) == 'application/pdf' ) {
	       	$pdf_pages = $parser->parseFile($file)->getPages();
	       	$txt= $pdf_pages[0]->getText();
	       	if(str_word_count($txt) < 10){ // if there is less than 10 words, discard the information
	       		$txt="";
	       	}
	       	$txt = mb_strimwidth($txt, 0, strlen($txt)/4); // only the first quarter of info is useful
	       	$file.='[0]';
	    }
	    if( $txt == "" ){
		    $image->readImage( $file );
		    $image = $image->cropimage($image->getimagewidth(), $image->getimageheight()/5, 0, 0);
		    $image->write($file.'.tif');
		    $txt = (new TesseractOCR($file.'.tif'))->lang('spa')->run();
	    }
	    $thereIsAsig = FALSE;
	    $matchedAnio = array();
	    foreach ($asigs as $val) {
	    	$pattern = '/'.preg_replace($patterns, $replacements, $val).'/i';
	    	if( preg_match($pattern, $txt, $matches) ){
	    		$data['asig'][0] = $val;
	    		$thereIsAsig = TRUE;
	    	}elseif( isset($asigSiglas[$val]) ){
	    		$pattern = $asigSiglas[$val];
		    	if(  preg_match('/\s'.$pattern.'\s/', $txt, $matches) || preg_match('/'.$pattern.'/', $filename, $matches) ){
		    		$data['asig'][0] = $val;
		    		$thereIsAsig = TRUE;
		    	}
	    	}
	    	if( $thereIsAsig ){
	    		break;
	    	}
	    }
	    foreach ($anios as $val) {
	    	$num = $val-2000;
	   		$pattern2 = "/".$val."|".$num."/";
	    	$pattern1 = '/'.$val.'/';
	    	if(  preg_match($pattern1, $txt, $matches) || preg_match($pattern2, $filename, $matches) ){
	    		if( $matches[0]>2000 ){
	    			$matches[0] -= 2000;
	    		}
	    		$matchedAnio[] = $matches[0];
	    	}
	    }
	    if( count($matchedAnio)>1 ){
	    	if( $matchedAnio[0]<$matchedAnio[1] ){
	    		$data['anio'][0] = ( $matchedAnio[0] ).( $matchedAnio[0]+1 );
	    	}else{
	    		$data['anio'][0] = ( $matchedAnio[0]-1 ).( $matchedAnio[0] );
	    	}
	    }elseif( count($matchedAnio)==1 ){
	    	foreach ($meses as $index => $val) {
	    		if( preg_match("/".$val."/i", $filename, $matches) or preg_match("/".$val."/i", $txt, $matches) ){
		    		if( $index<3 ){
		    			$data['anio'][0] = ( $matchedAnio[0] ).( $matchedAnio[0]+1 );
		    		}else{
		    			$data['anio'][0] = ( $matchedAnio[0]-1 ).( $matchedAnio[0] );
		    		}
		    	}
	    	}
	    }
	    fwrite($fp, 'tags:'.PHP_EOL);
	    foreach ($data as $key=>$val) {
	    	fwrite($fp, $key." ");
	    	foreach ($val as $tag) {
	    		fwrite($fp, $tag.PHP_EOL);
	    	}
	    }
	    if( isset($data['asig']) && isset($data['anio']) ){
		    $query_text = "SELECT B.nom_tag_id FROM examen AS A, examen AS B ";
		    $query_text.= "WHERE A.nom_tag_id=? AND A.nom_doc=B.nom_doc AND A.ruta_doc=B.ruta_doc ";
		    $query_text.= " AND B.tipo_tag=? GROUP BY B.nom_tag_id";
		    $query = $db->prepare($query_text);
		    $query->execute([$data['asig'][0], 'grado']);
		    $results = $query->fetchAll(PDO::FETCH_ASSOC);
		    foreach ($results as $row) { // puede ser informática o informática y matemáticas
		    	$data['grado'][] = $row["B.nom_tag_id"];
		    }
		    $query->execute([$data['asig'][0], 'curso']);
		    $results = $query->fetchAll(PDO::FETCH_ASSOC);
		    foreach ($results as $row) { // es el curso en letra y en número
				$data['curso'][] = $row["B.nom_tag_id"];
		    }
			$query_text = "INSERT INTO documento (id_doc, nom_doc, ruta_doc) VALUES(:md5, :nom, :ruta)"; 
			$query = $db->prepare($query_text);
			foreach ($db->errorInfo() as $val) {
				fwrite($fp, $val);
			}

			// $query->bindValue(':md5', $md5, PDO::PARAM_STR);
			// $query->bindValue(':nom', $filename, PDO::PARAM_STR);
			// $query->bindValue(':ruta', $updir, PDO::PARAM_STR);
			// fwrite($fp, 'doc:'.PHP_EOL.$md5." ".$filename." ".$updir);
			// EVERYTHING CRASH HERE!!!!!!!!!!!!!!!!!!!!!!!
			$query->execute([$md5, $filename, $updir]);
			// $query->execute();
			foreach ($query->errorInfo() as $val) {
				fwrite($fp, $val);
			}
		    $query_text = "INSERT INTO doctag(id_doc_id, nom_tag_id, comprobado) VALUES(?, ?, ?)"; 
		    // $query = $db->prepare($query_text);
		    fwrite($fp, 'tags:'.PHP_EOL);
		    foreach ($data as $val) {
		    	foreach ($val as $tag) {
		    		fwrite($fp, $tag.PHP_EOL);
				    // $query->execute([$md5, $tag, 0]);
				}
		    }
	    }
		fwrite($fp, "END-file");
	}
}
$db->commit();
$db=null;
fclose($fp);
?>