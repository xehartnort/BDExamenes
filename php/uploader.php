<?php
function getTags($tipo_tag, $db){
	$tags = array();
	$sql = "SELECT nom_tag FROM Tag WHERE tipo_tag=? GROUP BY nom_tag";
	$query = $db->prepare($sql);
	$query->execute([$tipo_tag]);
	$results = $query->fetchAll(PDO::FETCH_ASSOC);
	foreach ($results as $row) {
		$tags[] = $row["nom_tag"]; 
	}
	return $tags;
}

$db = new PDO("sqlite:../examenes.db");
$grados = getTags("grado", $db);
$grados[] = "Informática y Doble Grado";
$asigs = getTags("asig", $db);
for($i=2011; $i<date("Y"); $i++) {
	$anios[] = $i;
}
$md5 = md5_file($_FILES['file']['tmp_name']);
$sql='SELECT COUNT(*) FROM Documento WHERE id_doc=?';
$query = $db->prepare($sql);
$query->execute([$md5]);
$file = '../sinClasificar/'.$_FILES['file']['name'];
// Check if file is not uploaded and if it is not in the db
if($query->fetchColumn()==0 and !file_exists($file)){
    move_uploaded_file($_FILES['file']['tmp_name'], $file);
	$data['asig'] = $asigs;
	$data['grado'] = $grados;
	foreach ($anios as $value) {
		$data['anio'][] = ($value-2000)*100 + $value-1999; // $value=2013, 1314
	}
}else{
	$data['duplicate'] = TRUE;
}

echo(json_encode($data));
?>
