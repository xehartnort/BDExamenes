<?php
require 'vendor/autoload.php';

function getTags($tipo_tag, $db){
	$tags = array();
	$sql = "SELECT nom_tag FROM Tag WHERE tipo_tag=? GROUP BY nom_tag";
	$query = $db->prepare($sql);
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
$asigs = getTags("asig", $db);
$asigSiglas = getSiglas($asigs);
for($i=2011; $i<date("Y"); $i++) {
	$anios[] = $i;
}
$patterns = array('/\s/','/á/','/é/','/í/','/ó/','/ú/');
$replacements = array('\s+','(a|á)','(e|é)','(i|í)','(o|ó)','(u|ú)');
$updir='../sinClasificar';
$ds=DIRECTORY_SEPARATOR;

// print_r($_FILES);
$filename = $_FILES['file']['name'];
// foreach($_FILES['file']['name'] as $index=>$filename){
$md5 = md5_file($_FILES['file']['tmp_name']);
$sql='SELECT COUNT(*) FROM Documento WHERE id_doc=?';
$query = $db->prepare($sql);
$query->execute([$md5]);
$file = $updir.$ds.$filename;
$txt="";
// Check if file is not uploaded and if it is not in the db
if($query->fetchColumn()==0){
	// if(!file_exists($file) and $query->fetchColumn()==0){
    move_uploaded_file($_FILES['file']['tmp_name'], $file);
    if( mime_content_type($file) == 'application/pdf' ) {
    	$parser = new \Smalot\PdfParser\Parser();
       	$pdf_pages = $parser->parseFile($file)->getPages();
       	$txt= $pdf_pages[0]->getText();
       	if(str_word_count($txt) < 10){ // if there is less than 10 words, discard the information
       		$txt="";
       	}
       	$txt = mb_strimwidth($txt, 0, strlen($txt)/4); // only the first quarter of info is useful
       	$file.='[0]';
    }else{
    	$image = new Imagick();
    	$image->setResolution( 408, 392 );
    	echo($file);
	    $image->readImage( $file );
	    $image->cropimage($image->getimagewidth(), $image->getimageheight()/5, 0, 0);
	    $image->writeimage($file.'.tif');
	    $txt = (new TesseractOCR($file.'.tif'))->lang('spa')->run();
		array_map( "unlink", glob( $updir."/*.tif" ) );
    }
    foreach ($asigs as $val) {
    	$pattern = '/'.preg_replace($patterns, $replacements, $val).'/i';
    	if( preg_match($pattern, $txt, $matches) ){
    		$data['asig'][] = $val;
    	}elseif( isset($asigSiglas[$val]) ){
    		$pattern = $asigSiglas[$val];
	    	if(  preg_match('/'.$pattern.'/', $txt, $matches) || preg_match('/'.$pattern.'/', $filename, $matches) ){
	    		$data['asig'][] = $val;
	    	}
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
    		$data['anio'][] = $matches[0];
    	}
    }          
	if(! isset($data['asig']) ){
		$data['asig'] = $asigs;
	}
	if(! isset($data['anio']) ){
		foreach ($anios as $value) {
			$data['anio'][] = $value-2000;
		}
	}
}else{
	$data['duplicate'] = TRUE;
}

echo(json_encode($data));
?>
