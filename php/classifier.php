<?php
$db = new PDO("sqlite:../examenes.db");
if( isset($_GET["get"]) ){
	$sql = "SELECT nom_tag_id FROM examen WHERE comprobado=0 AND nom_doc=?";
	$query = $db->prepare($sql);
	$query->execute( [ $_GET["nom_doc"] ] );
	$results = $query->fetchAll(PDO::FETCH_ASSOC);
	foreach ($results as $value) {
		$result[] = $value["nom_tag_id"];
	}
	echo json_encode($result);
}elseif( isset($_GET["set"]) ){
	$sql = "UPDATE doctag SET comprobado=1 WHERE comprobado=0 AND nom_doc=?";
	$query = $db->prepare($sql);
	$query->execute( [ $_GET["nom_doc"] ] );
}
?>