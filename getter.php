<?php
// $_GET["tag0"]="";
// $_GET["tag1"]="";
// $_GET["tag2"]="";
// $_GET["tag3"]="";
// $_GET["page"]=1;
if( $_GET["tag0"] !="" || $_GET["tag1"] !="" || $_GET["tag2"] !="" || $_GET["tag3"] !=""){
  $db = new PDO("sqlite:examenes.db");
  $query_text = "";
  for($i=0; $i<4; ++$i) { # http://stackoverflow.com/questions/2621382/alternative-to-intersect-in-mysql
    $query_text.="SELECT nom_doc, ruta_doc FROM examen WHERE tipo_tag=:ttag".$i." and nom_tag_id LIKE :tag".$i;
    if($i+1 < 4){ // if not last iteration
      $query_text .= " INTERSECT ";
    }
  }
  $tipo_tags = array("grado", "asig", "anio", "curso");
  $tags = array("tag0", "tag1", "tag2", "tag3");
  $query = $db->prepare($query_text);
  for($i=0; $i<4; ++$i) {
    $query->bindValue(':tag'.$i, $_GET[$tags[$i]].'%', PDO::PARAM_STR);
    $query->bindValue(':ttag'.$i, $tipo_tags[$i], PDO::PARAM_STR);
  }
  $row_count = 20;
  $offset = ($_GET["page"]-1)*$row_count;
  $query->execute();
  $results = $query->fetchAll(PDO::FETCH_ASSOC);
  $result["num_r"] = count($results); // número de resultados de la consulta
  for($i=$offset; $i<$offset+$row_count; ++$i){
    $row=$results[$i];
    $result[$row["nom_doc"]] = $row["ruta_doc"];
  }
  echo json_encode($result);
}
?>
