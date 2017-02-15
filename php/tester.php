<?php
require 'vendor/autoload.php';
ini_set('display_errors', 1);
$image = new Imagick();
$image->setResolution( 408, 392 ); 

	$file='../sinClasificar/test.jpg';
		    $image->readImage( $file );
	// 	    	->cropimage($image->getimagewidth(), $image->getimageheight()/5, 0, 0)
	// 	    	->write($file.'.tif');
	// $txt = (new TesseractOCR($file.'.tif'))->lang('spa')->run();
	echo($txt);
?>