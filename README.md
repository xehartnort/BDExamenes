# BDExamenes

El código está comentado a tope para que no sea muy difícil de entender, de todas maneras gran parte del mismo está sacado de los tutoriales [uno](http://www.w3schools.com/html/default.asp) y [dos](http://www.w3schools.com/php/default.asp). Los archivos adjuntos deben de colocarse en /var/www/html/ y es imprescindible tener un servidor apache instalado, en ejecución, y tener php5 instalado (LAMP). Además presuponen que se tiene instalado mysql-server, con usuario y constraseña "root", una base de datos que se llama "pruebas" que contiene una tabla llamada "prueba1" creada con la siguiente sentencia: " create table prueba1 (cad char(3), n int, x float); ", si la sentencia os da problemas (algo de no database selected) [aquí](http://stackoverflow.com/questions/4005409/error-1046-no-database-selected-how-to-resolve) está la solución.

# Cosas por hacer

* La estructuración de la base de datos:  se me ocurre que podría tener una sola tabla: "Examenes" con los campos: Grado(not null), Asignatura(not null), Profesor , Curso(<=1,>=5), Url(not null, clave primaria). El campo Url hace referencia al lugar de almacenamiento del archivo pdf con el examen.

* Crear algún script así chulo para realizar inserciones en la base de datos. (Aunque esto lo dejaría para cuando se solucionen los dos problemas anteriores)

* Hacer la interfaz más bonita (css y html supongo)

* Cuestionar lo existente

* Crear algo de documentación ?

# Hechas

* ¿Dónde almacenamos los exámenes? (en el servidor no hay mucho espacio, aunque inicialmente puede ser un lugar posible de almacenamiento) y no sé muy bien como dar acceso a través de una URL a dichos archivos. 
* Solución: por URL se entenderá el nombre del archivo que contiene el examen, para acceder a ellos desde el servidor es suficiente con añadirlos a /var/www/html/ o a alguna carpeta que tenga como raiz esa dirección
