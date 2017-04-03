<?php
$db = new PDO("sqlite:../examenes.db");
$sql = "UPDATE tag SET comprobado=1 WHERE comprobado=0 AND nom_doc=?";
$query = $db->prepare($sql);
$query->execute([ $_GET["nomdoc"] ]);
$results = $query->fetchAll(PDO::FETCH_ASSOC);
foreach ($results as $value) {
	$result[] = $value["nom_tag_id"];
}
echo json_encode($result);

?>