<?php 
// http://www.w3schools.com/php/php_mysql_prepared_statements.asp

// $_POST['Pelo'] nos permite recoger información del selector que se llama "Pelo" en el .html
echo "hola"." ".$_POST['Grado']."<br>"; // el "." es el operador de concatenación
echo $_POST['Pelo']."<br>"; // <br> es el \n de html  

$servername = "localhost";
$username = "root";
$password = "root";

 // esto evita que tengamos que enviar la consulta "use pruebas"
 // para que tenga éxito este comando hay que entrar en mysql y hacer "create database pruebas"
 // sacado de http://stackoverflow.com/questions/4005409/error-1046-no-database-selected-how-to-resolve
$database = "pruebas";

// Conexión a la base de datos
$conn = new mysqli($servername, $username, $password, $database);

// Comprobar que todo fue bien
if (mysqli_connect_error()) {
    die("Database connection failed: " . mysqli_connect_error());
}
//echo "Connected successfully";


// Intentamos una consulta chorra
$sql = "select * from prueba1";
if ($conn->query($sql) === FALSE) {
    echo "Failed query" . $conn->error;
}
// la guardamos en una variable
$result = $conn->query($sql);

// Si la consulta tuvo resultado:
if ($result->num_rows > 0) {
    // muestra la información de cada registro de la base de datos obtenido
    while($row = $result->fetch_assoc()) {
        echo "<br> Primera columna: ".$row["cad"]."<br> Segunda columna: ".$row["x"]."<br> Tercera columna: ".$row["n"];
    }
} else {
    echo "0 results";
}

// cerramos la conexión
$conn->close();

?>
