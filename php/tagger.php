<?php
// $_GET["caller"]="asig"
$db = new PDO("sqlite:../examenes.db");
$query_text = "SELECT nom_tag_id FROM examen WHERE tipo_tag=:caller GROUP BY nom_tag_id";
$query = $db->prepare($query_text);
$query->bindValue(':caller', $_GET["caller"], PDO::PARAM_STR);
$query->execute();
$results = $query->fetchAll(PDO::FETCH_ASSOC);
//$result = [];
foreach ($results as $row) {
	$result[] = $row["nom_tag_id"];
}
echo json_encode($result);
?>