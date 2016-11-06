<?php
$db = new PDO("sqlite:examenes.db");
$query = $db->prepare("SELECT nom_doc, ruta_doc FROM examen
                        WHERE nom_tag_id=:tag1
                      INTERSECT
                      SELECT nom_doc, ruta_doc FROM examen
                        WHERE nom_tag_id=:tag2
                      INTERSECT
                      SELECT nom_doc, ruta_doc FROM examen
                        WHERE nom_tag_id=:tag3
                      INTERSECT
                      SELECT nom_doc, ruta_doc FROM examen
                        WHERE nom_tag_id=:tag4");
$query->bindParam(':tag1',$_GET["tag1"],PDO::PARAM_STR);
$query->bindParam(':tag2',$_GET["tag2"],PDO::PARAM_STR);
$query->bindParam(':tag3',$_GET["tag3"],PDO::PARAM_STR);
$query->bindParam(':tag4',$_GET["tag4"],PDO::PARAM_STR);
$query->execute();
$results = $query->fetchAll(PDO::FETCH_ASSOC);
foreach ($results as $row) {
  $result[$row["nom_doc"]] = $row["ruta_doc"];
}
echo json_encode($result);
?>
