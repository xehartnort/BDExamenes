<?php
if( $_GET["tag0"] !="" || $_GET["tag1"] !="" || $_GET["tag2"] !="" || $_GET["tag3"] !=""){
  $db = new PDO("sqlite:examenes.db");
  $result = [];
  $query_text = "";
  for($i=0; $i<4; ++$i) {
    $query_text .= "SELECT nom_doc, ruta_doc FROM examen WHERE nom_tag_id LIKE :tag".$i;
    if($i+1 < 4){ // if not last iteration
      $query_text .= " INTERSECT ";
    }
  }
  $query = $db->prepare($query_text);
  foreach ($_GET as $key => $value) {
    $query->bindValue(':'.$key, $value.'%', PDO::PARAM_STR);
  }
  $query->execute();
  $results = $query->fetchAll(PDO::FETCH_ASSOC);
  foreach ($results as $row) {
    $result[$row["nom_doc"]] = $row["ruta_doc"];
  }
  echo json_encode($result);
}
?>
