<?php
$servername = "localhost";
$username = "root";
$password = "root";
$database = "pruebas";

// Conexión a la base de datos
$conn = new mysqli($servername, $username, $password, $database);

// Comprobar que todo fue bien
if (mysqli_connect_error()) {
    die("Database connection failed: " . mysqli_connect_error());
}
                          
$sql = "select * from examenes where";

if($_GET['grado']!="Pordefecto")
  $sql .= " grado=\"".$_GET['grado']."\"";
  
if($_GET['curso']!="Pordefecto")
  $sql .= " curso=".$_GET['curso'];

if($_GET['asignatura']!="Pordefecto")
  $sql .= " asignatura=\"".$_GET['asignatura']."\"";

if($_GET['profesor']!="Pordefecto")
  $sql .= " profesor=\"".$_GET['profesor']."\"";

echo $sql;

$result = $conn->query($sql);

while($row = $result->fetch_assoc()) {
  echo "<option>".$row[$_GET['caller']]."</option>";
}
    
?>
