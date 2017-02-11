<?php
   //$_GET["tag0"]="Informática";
   // $_GET["tag1"]="tercero";
   // $_GET["tag2"]="";
   // $_GET["tag3"]="";
   //$_GET["page"]=1;
  $db = new PDO("sqlite:../examenes.db");
  $tildes=array('á','é','í','ó','ú');
  $sin_tildes=array('_','_','_','_','_');
  $page = $_GET["page"]>=1 ? $_GET["page"] : 1;
  unset($_GET["page"]);
  foreach ($_GET as $key => $value) {
    $_GET[$key] = str_ireplace($tildes, $sin_tildes, $_GET[$key]);
  }
  $query_text = "";
  foreach ($_GET as $key => $value) { # http://stackoverflow.com/questions/2621382/alternative-to-intersect-in-mysql
    $query_text.="SELECT nom_doc, ruta_doc FROM examen WHERE nom_tag_id LIKE :".$key;
    if($value != end($_GET)){ // if not last iteration
      $query_text .= " INTERSECT ";
    }
  }
  $query = $db->prepare($query_text);
  foreach ($_GET as $key => $value) {
    if($value == ""){
      $value = '%';
    }
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
  echo json_encode($result);
?>
