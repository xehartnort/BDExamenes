<?php
$db = new PDO("sqlite:examenes.db");
$tipos = array("grado","curso","asig","anio");
foreach ($tipos as $value) {
	$query = $db->prepare("SELECT nom_tag FROM tag WHERE tipo_tag=:value GROUP BY nom_tag");
	$query->bindParam(':value',$value,PDO::PARAM_STR);
	$query->execute();
	$results = $query->fetchAll(PDO::FETCH_ASSOC);
	foreach ($results as $row) {
		$result[$row["nom_tag"]] = $value;
	}
}
echo json_encode($result);
?>
