<?php
  function getAllTags($db){
    $tags = array();
    $sql = "SELECT nom_tag FROM tag";
    $query = $db->prepare($sql);
    $query->execute();
    $results = $query->fetchAll(PDO::FETCH_ASSOC);
    foreach ($results as $row) {
      $tags[ $row["nom_tag"] ] = $row["nom_tag"];
    }
    return $tags;
  }
   // $_GET["tag0"]="Informática";
   // $_GET["tag1"]="tercero";
   // $_GET["tag2"]="";
   // $_GET["tag3"]="";
   // $_GET["page"]=1;
  $db = new PDO("sqlite:../examenes.db");
  $allTags=getAllTags($db);
  $tildes=array('á','é','í','ó','ú');
  $sin_tildes=array('_','_','_','_','_');
  $page = $_GET["page"]>=1 ? $_GET["page"] : 1;
  foreach ($_GET as $key => $value) {
    if($key!="page" && $value!=""){
      $tags[$key] = str_ireplace($tildes, $sin_tildes, $_GET[$key]);
    }
  }
  $sql = "";
  foreach ($tags as $key => $value) {
    $sql.="SELECT nom_doc, ruta_doc FROM examen WHERE nom_tag_id LIKE :".$key;
    if($value != end($tags)){ // if not last iteration
      $sql .= " INTERSECT ";
    }
  }
  $query = $db->prepare($sql);
  foreach ($tags as $key => $value) {
    $query->bindValue(":".$key, $value, PDO::PARAM_STR);    
  }
  $row_count = 20;
  $offset = ($page-1)*$row_count;
  $query->execute();
  $results = $query->fetchAll(PDO::FETCH_ASSOC);
  $result["num_r"] = count($results); // número de resultados de la consulta
  for($i=$offset; $i<$offset+$row_count; ++$i){
    if( isset($results[$i])){
      $row=$results[$i];
      $result[$row["nom_doc"]] = $row["ruta_doc"];
    }
  }
  $sql = "UPDATE tag SET preferencia = preferencia + 1 WHERE nom_tag = ?";
  $query = $db->prepare($sql);
  foreach ($_GET as $key => $value) {
    if( isset($allTags[$value]) ){
      $query->execute([$value]);
    }
  }
  echo json_encode($result);
?>