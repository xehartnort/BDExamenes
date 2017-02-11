<?php
require 'vendor/autoload.php';
// ini_set('display_errors', 1);
// 	$file='../tmp/Cálculo 2016-17.jpg';
// 	$parser = new \Smalot\PdfParser\Parser();
// 		if( mime_content_type($file) == 'application/pdf' ) {
// 	    	$pdf_pages = $parser->parseFile($file)->getPages();
// 	    	$txt= $pdf_pages[0]->getText();
// 	    	if(str_word_count($txt) < 10){ // if there is less than 10 words, discard the information
// 	    		$txt="";
// 	    	}
// 	    	$txt = mb_strimwidth($txt, 0, strlen($txt)/4);
// 	    	$file.='[0]';
// 	    }
// 	    $image = new Gmagick($file);//
// 	    $image = $image->cropimage($image->getimagewidth(), $image->getimageheight()/5, 0, 0);
// 	    $image->write($file.'.tif');//
// 	    $txt = (new TesseractOCR($file.'.tif'))->lang('spa')->run();//
// 	    echo($txt);
// 	    // preg_match('/(2016|16)/', $txt, $matches);
// 	    preg_match('/16/', $file, $matches);
// 	    print_r($matches);
$db = new PDO("sqlite:../examenes.db");
// $db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );

$db->beginTransaction(); 
$updir = "...";
// $md5 = dcd53b110d566f47686ace0cc2b07e0f;
$filename='Cálculo 2016-17.jpg';
$md5 = md5_file( '../tmp/'.$filename );
$query_text = "INSERT INTO documento(id_doc, nom_doc, ruta_doc) VALUES(?, ?, ?)"; 
$query = $db->prepare($query_text);
echo('doc:'.PHP_EOL.$md5." ".$filename." ".$updir);
$query->execute([$md5, $filename, $updir]);
$db->commit(); 

// $ds=DIRECTORY_SEPARATOR;
// 	$db = new PDO("sqlite:../examenes.db");
// 	$db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
// 		    $query_text = "SELECT B.nom_tag_id FROM examen AS A, examen AS B ";
// 		    $query_text.= "WHERE A.nom_tag_id=? AND A.nom_doc=B.nom_doc AND A.ruta_doc=B.ruta_doc ";
// 		    $query_text.= " AND B.tipo_tag=? GROUP BY B.nom_tag_id";
// 		    $query = $db->prepare($query_text);
// 		    $query->execute(['Informática Gráfica', 'grado']);
// 		    $results = $query->fetchAll(PDO::FETCH_ASSOC);
// 		    foreach ($results as $row) { // puede ser informática o informática y matemáticas
// 		    	$data['grado'][] = $row["B.nom_tag_id"];
// 		    }
// 		    $query->execute(['Informática Gráfica', 'curso']);
// 		    $results = $query->fetchAll(PDO::FETCH_ASSOC);
// 		    foreach ($results as $row) { // es el curso en letra y en número
// 		    	$data['curso'][] = $row["B.nom_tag_id"];
// 		    }
// 			$query_text = "INSERT INTO documento(id_doc, nom_doc, ruta_doc) VALUES(?, ?, ?)"; 
// 			$query = $db->prepare($query_text);
// 			$ruta = '../sinClasificar';
// 			$query->execute([$md5, $filename, $ruta]);
// 		    $query_text = "INSERT INTO doctag(id_doc_id, nom_tag_id, comprobado) VALUES(?, ?, ?)"; 
// 		    $query = $db->prepare($query_text);
// 		    foreach ($data as $val) {
// 		    	foreach ($val as $tag) {
// 				    $query->execute([$md5, $tag, 0]);
// 				}
// 		    }
?>