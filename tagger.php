<?php
$result = [];
//$_GET["tipo"]="grado";
//$_GET["term"]="mat";
$db = new PDO("sqlite:examenes.db");
$query = $db->prepare("SELECT nom_tag FROM tag WHERE tipo_tag=:tipo and nom_tag LIKE :value");
//$value=$_GET["term"].'%';
$query->bindValue(':tipo',$_GET["tipo"],PDO::PARAM_STR);
$query->bindValue(':value',$_GET["term"].'%',PDO::PARAM_STR);
$query->execute();
$results = $query->fetchAll(PDO::FETCH_ASSOC);
foreach ($results as $row) {
	$result[] = $row["nom_tag"];
}
echo json_encode($result);
?>
