<?php
$db = new PDO("sqlite:../examenes.db");
$query_text = "SELECT nom_tag FROM etiqueta WHERE tipo_tag=:caller GROUP BY nom_tag";
$query = $db->prepare($query_text);
$query->bindValue(':caller', $_GET["caller"], PDO::PARAM_STR);
$query->execute();
$results = $query->fetchAll(PDO::FETCH_ASSOC);
//$result = [];
foreach ($results as $row) {
	$result[] = $row["nom_tag"];
}
echo json_encode($result);
?>