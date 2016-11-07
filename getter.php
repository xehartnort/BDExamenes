<?php
$db = new PDO("sqlite:examenes.db");
$query_text = "";
$result = [];
$get_size = count($_GET);
if( $get_size > 1 ){
  for($i=0; $i<$get_size; ++$i) {
    $query_text .= "SELECT nom_doc, ruta_doc FROM examen WHERE nom_tag_id LIKE :tag".$i;
    if($i+1 < $get_size){ // if not last iteration
      $query_text .= " INTERSECT ";
    }
  }
}else{
  $query_text = "SELECT nom_doc, ruta_doc FROM examen WHERE nom_tag_id LIKE :tag0";
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
?>
