<?php
$db = new PDO("sqlite:../examenes.db");
$updir="../exámenes/sinClasificar";
$ds=DIRECTORY_SEPARATOR;
foreach($_FILES['file']['name'] as $index=>$filename){
	$sha1=sha1_file($_FILES["file"]["tmp_name"][$index]);
   	$query_text="SELECT COUNT(*) FROM Documento WHERE id_doc=:sha1";
   	$query = $db->prepare($query_text);
    $query->bindValue(':sha1',$sha1, PDO::PARAM_STR);
    $query->execute();
   	// Check if file is already uploaded and if it is already in the db
   	if(!file_exists($updir.$ds.$filename) and $query->fetchColumn()==0){
        move_uploaded_file($_FILES["file"]["tmp_name"][$index],$updir.$ds.$filename);       
    }           
} 
?> 