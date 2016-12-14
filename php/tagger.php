<?php
 $_GET["tag0"]="";
 $_GET["tag1"]="";
 $_GET["tag2"]="";
 $_GET["term"]="algoritmica";
 $_GET["caller"]="asig";
$db = new PDO("sqlite:../examenes.db");
$tildes=array('a','e','i','o','u');
$sin_tildes=array('_','_','_','_','_');
$_GET["term"]=str_replace($tildes, $sin_tildes, $_GET["term"]);
$query_text = "select nom_tag from etiqueta where nom_tag like :term and tipo_tag=:caller and id_doc_id in (";
for($i=0; $i<3; $i++){
   $query_text .= "select id_doc_id from doctag where nom_tag_id like :tag".$i;
   if($i+1 < 3){ // if not last iteration
     $query_text .= " INTERSECT ";
   }else{
     $query_text .= ") group by nom_tag";
   }
}
$query = $db->prepare($query_text);
for($i=0; $i<3; ++$i) {
  $query->bindValue(':tag'.$i, $_GET["tag".$i].'%', PDO::PARAM_STR);
}
$query->bindValue(':term', $_GET["term"].'%', PDO::PARAM_STR);
$query->bindValue(':caller', $_GET["caller"], PDO::PARAM_STR);
$query->execute();
$results = $query->fetchAll(PDO::FETCH_ASSOC);
$result = [];
foreach ($results as $row) {
	$result[] = $row["nom_tag"];
}
echo json_encode($result);
?>
