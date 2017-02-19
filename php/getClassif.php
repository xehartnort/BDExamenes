<?php
// $_GET["nomdoc"]="learning_agreement (1)MC_1819.pdf";
$db = new PDO("sqlite:../examenes.db");
$sql = "SELECT nom_tag_id FROM examen WHERE comprobado=0 AND nom_doc=?";
$query = $db->prepare($sql);
$query->execute([ $_GET["nomdoc"] ]);
$results = $query->fetchAll(PDO::FETCH_ASSOC);
foreach ($results as $value) {
	$result[] = $value["nom_tag_id"];
}
echo json_encode($result);

?>