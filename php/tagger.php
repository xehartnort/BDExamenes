<?php
$db = new PDO("sqlite:../examenes.db");
$query_text = "SELECT nom_tag FROM tag WHERE tipo_tag!='curso' GROUP BY nom_tag ORDER BY preferencia DESC, LENGTH(nom_tag)";
$query = $db->prepare($query_text);
$query->execute();
$results = $query->fetchAll(PDO::FETCH_ASSOC);
foreach ($results as $row) {
	$result[] = $row["nom_tag"];
}
echo json_encode($result);
?>
