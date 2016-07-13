<?php


// IDEA: para evitar las inyecciones de código sql, utilizar un usuario cuyos privilegios estén restringidos a lectura de la tabla exámenes

// | GRANT USAGE ON *.* TO 'bot'@'localhost' IDENTIFIED BY PASSWORD <secret> |
// | GRANT SELECT ON `pruebas`.`examenes` TO 'bot'@'localhost'|

$servername = "localhost";
$username = "bot";
$password = "H4cK3R"; // usar mysql hash de buena manera
$database = "pruebas";

//echo '<pre>';
//print_r($_GET); //var_dump();
//echo '</pre>';

// Conexión a la base de datos
$conn = new mysqli($servername, $username, $password, $database);

// Comprobar que todo fue bien
if (mysqli_connect_error()) {
    die("Database connection failed: " . mysqli_connect_error());
}

// necesario para consultas con tildes 
// http://stackoverflow.com/questions/7073401/problem-with-php-and-mysql-utf-8-special-character 
$conn->query("SET NAMES utf8");
//mysqli_set_charset('utf8');                      

$sql = "select * from examenes where";

if($_GET['grado']!="null")
  $sql .= " grado=\"".$_GET['grado']."\" and";
  
if($_GET['curso']!="null")
  $sql .= " curso=".$_GET['curso']." and";

if($_GET['asig']!="null")
  $sql .= " asignatura=\"".$_GET['asig']."\" and";

if($_GET['prof']!="null")
  $sql .= " profesor=\"".$_GET['prof']."\" and";

// si los tres últimos carácteres son un "and", los quitamos
if( substr($sql, -3) == "and" )
  $sql = substr($sql, 0, -3);

$result = $conn->query($sql);

while($row = $result->fetch_assoc()) {
  echo "<option>".$row[$_GET['caller']]."</option>";
}

// cerramos la conexión
$conn->close();

    
?>
