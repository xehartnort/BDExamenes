<?php
// $_GET["caller"]="asig";
$db = new PDO("sqlite:../examenes.db");
$query_text = "SELECT nom_tag_id FROM examen GROUP BY nom_tag_id ORDER BY LENGTH(nom_tag_id)";
$query = $db->prepare($query_text);
$query->execute();
$results = $query->fetchAll(PDO::FETCH_ASSOC);
foreach ($results as $row) {
	$result[] = $row["nom_tag_id"];
}
echo json_encode($result);
?>