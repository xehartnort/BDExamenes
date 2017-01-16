## BD

### BD - Estructuración lógica de la base de datos
Vamos al lío. Primero comencemos explicando el modelo relacional que sostiene al nivel conceptual de la base de datos, sí, estoy hablando del diagrama entidad-relación:

La entidad *Documento* representa a todos los exámenes guardados:
  - id_doc : cada archivo se identifica univocamente por su hash sha1.
  - nom_doc : el correspondiente nombre del examen almacenado.
  - ruta_doc : la correspondiente ruta al examen en la *jungla de directorios*.

La entidad *Tag* representa una etiqueta que clasifica un elemento de la entidad *Documento*:
  - nom_tag : es el nombre o identificativo único de cada etiqueta.
  - tipo_tag : categoría en la que se sitúa la etiqueta, se consideran 5: año, curso, asignatura, grado y otro.
  ~~- preferencia : indica el uso de una etiqueta, a mayor preferencia, mayor uso de la etiqueta y por tanto más importancia  tendrá en la clasificación.~~

La entidad *DocTag* representa en duplas la asociación de un *Documento* a un *Tag* y viceversa.

<a href="http://imgur.com/yNXJwKs"><img src="http://i.imgur.com/yNXJwKs.png" title="source: imgur.com" /></a>

En el nivel externo de la base de datos se encuentran las vistas *examen* y *etiqueta*. La primera es, en términos del [álgebra relacional](https://es.wikipedia.org/wiki/%C3%81lgebra_relacional), la únion natural de la tabla *Documento*, la tabla *DocTag* y la tabla *Tag*. La segundo es la unión natural de la tabla *DocTag* y la tabla *Documento*.

### BD - Implementación
El administrador de la base de datos es por simplicidad ~~y pereza~~ [SQlite](https://sqlite.org/). El código correspondiente a la creación de la base de datos se encuentra en el archivo *createDB.py* dentro de la carpeta *dbtools*

#### BD - Estructura de la **jungla de directorios**

Cada archivo de examen se encuentra almacenado en las profundidades de la *jungla de directorios* atendiendo a los siguientes criterios: grado al que pertenece el examen, curso de la asignatura del examen, asignatura del examen y año del curso en el que se realiza el examen. En caso de no poder determinar el año o ser este anterior a 2011-2012, el valor de año es UNKN (de Unknown, desconocido) o ANTE (de Anterior ~~al origen del mundo~~ al año 1112).

Por ejemplo, si tenemos un examen del *curso 1º*, *año 2013-2014*, asignatura *Héchizos y Pócimas* del grado en *Artes Oscuras* y un tipo test de dicha asígnatura que no sabemos de que año es ~~pero tienen hasta telarañas~~, sus rutas en la jungla sería:

- Artes Oscuras/1/Héchizos y Pócimas/1314/examen
- Artes Oscuras/1/Héchizos y Pócimas/UNKN/tipo_test

#### BD - Actualización
Una vez añadidos nuevos archivos a la *jungla de directorios* es suficiente con ejecutar el siguiente comando en la carpeta raiz del proyecto: `make db`. Este comando buscará y borrará automágicamente los archivos duplicados de la *jungla de directorios*, además de clasificar en el base de datos los nuevos archivos.

### BD - Interfaz web
La lógica del servidor, esto es, código destinado a ejecutarse en el servidor durante la interacción de un usuario con la interfaz web está implementado en php y se encuentra en el directorio *php*. La lógica de la interfaz se encuentra repartida en dos directorios: *css* y *js*. Como indican los títulos de los directorios en ellos se alberga fichero con código en CSS y Javascript. 
