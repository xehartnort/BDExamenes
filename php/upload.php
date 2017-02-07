<?php
require 'TesseractOCR.php';

function getTags($tipo_tag, $db){
	$tags = array();
	$query_text = "SELECT nom_tag FROM Tag WHERE tipo_tag=:tipo GROUP BY nom_tag";
	$query = $db->prepare($query_text);
	$query->bindValue(':tipo', $tipo_tag, PDO::PARAM_STR);
	$query->execute();
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
				$siglas[$label] = '/'.$sigla.'/';
			}
		}
	}
	return $siglas;
}

$db = new PDO("sqlite:../examenes.db");
$asigs = getTags("asig", $db);
$asigSiglas = getSiglas($asigs);
$meses =  array("oct","nov","dic","ene","feb","mar","abr","may","jun","jul","sep");
for($i=2011; $i<2020; $i++) {
	$num = $i-2000;
	$anios[] = "/(".$i.")|(".$num.")/";
}
$patterns = array('/\s/','/á/','/é/','/í/','/ó/','/ú/');
$replacements = array('\s+','(a|á)','(e|é)','(i|í)','(o|ó)','(u|ú)');
$updir='../sinClasificar';
$ds=DIRECTORY_SEPARATOR;
foreach($_FILES['file']['name'] as $index=>$filename){
	$md5 = md5_file( file_get_contents($_FILES['file']['tmp_name'][$index]) );
   	$query_text='SELECT COUNT(*) FROM Documento WHERE id_doc=:md5';
   	$query = $db->prepare($query_text);
    $query->bindValue(':md5',$md5, PDO::PARAM_STR);
    $query->execute();
    $file = $updir.$ds.$filename;
   	// Check if file is not +uploaded and if it is not in the db
   	if(!file_exists($file) and $query->fetchColumn()==0){
        move_uploaded_file($_FILES['file']['tmp_name'][$index], $file);
	    if( mime_content_type($file) == 'application/pdf' ) {
	    	$file.='[0]';
	    }
	    $image = new Gmagick($file);//
	    $image = $image->cropimage($image->getimagewidth(), $image->getimageheight()/5, 0, 0);
	    fwrite($fp, $file.'.tif');
	    $image->write($file.'.tif');//
	    $txt = (new TesseractOCR($file.'.tif'))->lang('spa')->run();//
	    $thereIsAsig = FALSE;
	    $matchedAnio = array();
	    foreach ($asigs as $val) {
	    	$pattern = '/'.preg_replace($patterns, $replacements, $val).'/i';
	    	if( preg_match($pattern, $txt, $matches) ){
	    		$thereIsAsig = TRUE;
	    		$data['asig'][] = $val;
	    	}elseif( isset($asigSiglas[$val]) ){
		    	if(  preg_match($asigSiglas[$val], $txt, $matches) || preg_match($asigSiglas[$val], $filename, $matches) ){
		    		$thereIsAsig = TRUE;
		    		$data['asig'][] = $val;
		    	}
	    	}
	    	if( $thereIsAsig ){
	    		break;
	    	}
	    }
	    foreach ($anios as $val) {
	    	if(  preg_match($val, $txt, $matches) || preg_match($val, $filename, $matches) ){
	    		if( $matches[0]>2000 ){
	    			$matches[0] = $matches[0]-2000;
	    		}
	    		$matchedAnio[] = $matches[0];
	    	}
	    }
	    if( count($matchedAnio)>1 ){
	    	if( $matchedAnio[0]<$matchedAnio[1] ){
	    		$data['anio'][] = ( $matchedAnio[0] ).( $matchedAnio[0]+1 );
	    	}else{
	    		$data['anio'][] = ( $matchedAnio[0]-1 ).( $matchedAnio[0] );
	    	}
	    }elseif( count($matchedAnio)==1 ){
	    	foreach ($meses as $index => $val) {
	    		if( preg_match("/".$val."/i", $filename, $matches) or preg_match("/".$val."/i", $txt, $matches) ){
		    		if( $index<3 ){
		    			$data['anio'][] = ( $matchedAnio[0] ).( $matchedAnio[0]+1 );
		    		}else{
		    			$data['anio'][] = ( $matchedAnio[0]-1 ).( $matchedAnio[0] );
		    		}
		    	}
	    	}
	    }
	    if( isset($data[$asig]) && isset($data[$anio]) ){
		    $query_text = "SELECT B.nom_tag_id FROM examen AS A, examen AS B";
		    $query_text.= "WHERE A.nom_tag_id=:asig AND A.nom_doc=B.nom_doc AND A.ruta_doc=B.ruta_doc";
		    $query_text.= "AND B.tipo_tag=:tipo_tag GROUP BY B.nom_tag_id";
		    $query = $db->prepare($query_text);
		    $query->bindValue(':asig', $data[$asig], PDO::PARAM_STR);
		    $query->bindValue(':tipo_tag', 'grado', PDO::PARAM_STR);
		    $query->execute();
		    $results = $query->fetchAll(PDO::FETCH_ASSOC);
		    foreach ($results as $row) { // puede ser informática o informática y matemáticas
		    	$data['grado'][] = $row["nom_tag_id"];
		    }
		    $query->bindValue(':tipo_tag', 'curso', PDO::PARAM_STR);
		    $query->execute();
		    $results = $query->fetchAll(PDO::FETCH_ASSOC);
		    foreach ($results as $row) { // es el curso en letra y en número
		    	$data['curso'][] = $row["nom_tag_id"];
		    }
			$query_text = "INSERT INTO documento(id_doc, nom_doc, ruta_doc) VALUES(:id_doc, :nom_doc, :ruta_doc)"; 
			$query = $db->prepare($query_text);
			$query->bindValue(':id_doc', $md5, PDO::PARAM_STR);
			$query->bindValue(':nom_doc', $filename, PDO::PARAM_STR);
			foreach($data['curso'] as $index=>$val){
				if(strlen($val) == 1){
					if( count($data['grado'])>1 ){
						$ruta = 'exámenes'.$ds."Informática".$ds.$data['curso'][$index].$ds.$data['asig'].$ds.$data['anio'];
						$query->bindValue(':ruta_doc', $ruta, PDO::PARAM_STR);
						$query->execute();
					}else{
						$ruta = 'exámenes'.$ds.$data['grado'][0].$ds.$data['curso'][$index].$ds.$data['asig'].$ds.$data['anio'];
						$query->bindValue(':ruta_doc', $ruta, PDO::PARAM_STR);
						$query->execute();
					}
				}
			}
		    $query_text = "INSERT INTO doctag(id_doc_id, nom_tag_id, comprobado) VALUES(:id_doc_id, :nom_tag_id, :comprobado)"; 
		    $query = $db->prepare($query_text);
		    foreach ($data as $val) {
		    	foreach ($val as $i) {
				    $query->bindValue(':id_doc_id', $md5, PDO::PARAM_STR);
				    $query->bindValue(':nom_tag_id', $i, PDO::PARAM_STR);
				    $query->bindValue(':comprobado', 0, PDO::PARAM_INT);
				    $query->execute();
				}
		    }
	    }
	}
}
?>