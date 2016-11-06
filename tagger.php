<?php
$db = new PDO("sqlite:examenes.db");
$query = $db->prepare("SELECT nom_tag FROM tag WHERE nom_tag LIKE :value");
//if ($_GET["term"] != ""){
	$value=$_GET["term"].'%';
//}else{
//	$value="";
//}
$query->bindParam(':value',$value,PDO::PARAM_STR);
$query->execute();
$results = $query->fetchAll(PDO::FETCH_ASSOC);
foreach ($results as $row) {
	$result[] = $row["nom_tag"];
}
echo json_encode($result);
?>
