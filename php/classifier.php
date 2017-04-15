<?php
$db = new PDO("sqlite:../examenes.db");

if( isset($_GET['asig']) && isset($_GET['anio']) && isset($_GET['file']) ){
	$filename = '../sinClasificar/'.$_GET["file"];
    $md5 = md5_file($filename);
    // complete missing info
    $sql = "SELECT B.nom_tag_id FROM examen AS A, examen AS B ";
    $sql.= "WHERE A.nom_tag_id=? AND A.nom_doc=B.nom_doc AND A.ruta_doc=B.ruta_doc ";
    $sql.= " AND B.tipo_tag=? GROUP BY B.nom_tag_id";
    $query = $db->prepare($sql);
    $query->execute([$_GET['asig'], 'grado']);
    $results = $query->fetchAll(PDO::FETCH_ASSOC);
    foreach ($results as $row) { // puede ser informática o informática y matemáticas
    	$data['grado'][] = $row["B.nom_tag_id"];
    }
    $query->execute([$_GET['asig'], 'curso']);
    $results = $query->fetchAll(PDO::FETCH_ASSOC);
    foreach ($results as $row) { // es el curso en letra y en número
		$data['curso'][] = $row["B.nom_tag_id"];
    }
    $data['asig'][] = $_GET['asig'];
    $data['anio'][] = $_GET['anio'];
    //move file to its folder
    $path = 'exámenes/';
    // nos tenemos que quedar con el curso asociado a informática, que siempre es menor o igual que el de el doble
    if( count($data['grado'])==2 ){
    	$path .= (strlen($data['grado'][0]) < strlen($data['grado'][1]) ? $data['grado'][0] : $data['grado'][1]).'/';
    	$min=0;
    	foreach ($data['curso'] as $value) {
    		if( strlen($value) == 1 && $value>$min ){
    			$min = $value;
    		}
    	}
    	$path .= $min;
    }else{
    	$path .= $data['grado'][0].'/';
    	$path .= strlen($data['curso'][0]) == 1 ? $data['curso'][0] : $data['curso'][1];
    }
    $path .= '/'.$data['asig'][0];
    $path .= '/'.$data['anio'][0];
    try {
    	mkdir('../'.$path, 0755, true);
	} catch (Exception $e) {
	}
	rename($filename, '../'.$path.'/'.$_GET['file']);

	$sql = "INSERT INTO documento (id_doc, nom_doc, ruta_doc) VALUES(?, ?, ?)"; 
    $query = $db->prepare($sql);
	$query->execute([$md5, $_GET['file'], $path]);
    $sql = "INSERT INTO doctag(id_doc_id, nom_tag_id, comprobado) VALUES(?, ?, ?)"; 
    $query = $db->prepare($sql);
    foreach ($data as $val) {
    	foreach ($val as $tag) {
    		$query->execute([$md5, $tag, 0]);
    	}
    }
}
?>