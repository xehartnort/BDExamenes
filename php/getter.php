<?php
  function getAllTags($db){
    $tags = array();
    $sql = "SELECT nom_tag FROM tag ";
    $query = $db->prepare($sql);
    $query->execute();
    $results = $query->fetchAll(PDO::FETCH_ASSOC);

    foreach ($results as $row) {
      $tags[] = $row["nom_tag"];
    }
    return $tags;
  }
  // Convert an UTF-8 encoded string to a single-byte string suitable for
  // functions such as levenshtein.
  //
  // The function simply uses (and updates) a tailored dynamic encoding
  // (in/out map parameter) where non-ascii characters are remapped to
  // the range [128-255] in order of appearance.
  //
  // Thus it supports up to 128 different multibyte code points max over
  // the whole set of strings sharing this encoding.
  //
  function utf8_to_extended_ascii ($str, &$map)
  {
      // find all multibyte characters (cf. utf-8 encoding specs)
      $matches = array();
      if (!preg_match_all ('/[\xC0-\xF7][\x80-\xBF]+/', $str, $matches))
          return $str; // plain ascii string
     
      // update the encoding map with the characters not already met
      foreach ($matches[0] as $mbc)
          if (!isset ($map[$mbc]))
              $map[$mbc] = chr (128 + count ($map));
     
      // finally remap non-ascii characters
      return strtr ($str, $map);
  }

  //$_GET["tag0"]="Cálculo";
  //$_GET["tag1"]="Informatica";
  // $_GET["tag2"]="Inf";
  // $_GET["tag3"]="Locura";
  //$_GET["tag3"]="2012";
  //$_GET["page"]="2";
  $db = new PDO("sqlite:../examenes.db");
  $allTags = getAllTags ($db);
  $page = $_GET["page"]>=1 ? $_GET["page"] : 1;
  $charMap = array();
  foreach ($_GET as $key => $value_i) {
    if ($key!="page" && $value_i!=""){
      $ratio = 5;
      $canditate = "";
      $s1 = utf8_to_extended_ascii ($value_i, $charMap);
      foreach ($allTags as $key => $value_j){
        $s2 = utf8_to_extended_ascii ($value_j, $charMap); 
        $dist = levenshtein ($s1, $s2);
        if ($dist < $ratio){
          $ratio = $dist;
          $canditate = $value_j;
        }
      }
      if ($canditate!=""){
        $tags[] = $canditate;
      }
    }
  }
  $sql = "";
  $tag_size = count($tags);
  foreach ($tags as $key => $value) {
    $sql.="SELECT nom_doc, ruta_doc, id_doc FROM examen WHERE nom_tag_id = :".$key;
    if ($key != $tag_size-1){ // if not last iteration
      $sql .= " INTERSECT ";
    }
  }
  $query = $db->prepare ($sql);
  foreach ($tags as $key => $value) {
    $query->bindValue (":".$key, $value, PDO::PARAM_STR);    
  }
  $row_count = 20;
  $offset = ($page-1)*$row_count;
  $query->execute();
  $results = $query->fetchAll (PDO::FETCH_ASSOC);
  $result["num_r"] = count($results);
  for ($i=$offset; $i<$offset+$row_count; ++$i){
    if (isset ($results[$i])){
      $row = $results[$i];
      if (file_exists ('../img/'.$row["id_doc"].'.jpg')){
        $result[$row["nom_doc"]] = array($row["ruta_doc"], $row["id_doc"]);
      }else{
        $result[$row["nom_doc"]] = array($row["ruta_doc"], 'default');
      }
    }
  }
  $sql = "UPDATE tag SET preferencia = preferencia + 1 WHERE nom_tag LIKE ?";
  $query = $db->prepare ($sql);
  foreach ($tags as $key => $value) {
      $query->execute([$value]);
  }
  echo json_encode ($result);
?>