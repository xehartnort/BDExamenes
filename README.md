# BDExamenes
## Introducción
Este es un proyecto de la [Delegación de Estudiantes](http://deiit.ugr.es/) de la [ETSIIT](http://etsiit.ugr.es/) desarrollado por la Comisión de Información. Con este proyecto se pretende que todos los estudiantes tengan acceso al preciado tesoro de los exámenes de años anteriores. [Aquí](http://deiit.ugr.es/BDExamenes/) puedes acceder a la interfaz web del proyecto.

## BD
Vamos al lío. Primero comencemos explicando el modelo relacional que sostiene al nivel conceptual de la base de datos, sí, estoy hablando del diagrama entidad-relación:

La entidad *Documento* representa a todos los exámenes guardados:
  - id_doc : cada archivo se identifica univocamente por su hash sha1.
  - nom_doc : el correspondiente nombre del examen almacenado.
  - ruta_doc : la correspondiente ruta al examen en la *jungla de directorios*.

La entidad *Tag* representa una etiqueta que clasifica un elemento de la entidad *Documento*:
  - nom_tag : es el nombre o identificativo único de cada etiqueta.
  - tipo_tag : categoría en la que se sitúa la etiqueta, se consideran 5: año, curso, asignatura, grado y otro.
  ~~- preferencia : indica el uso de una etiqueta, a mayor preferencia, mayor uso de la etiqueta y por tanto más importancia tendrá en la clasificación.~~

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
Una vez añadidos nuevos archivos a la **jungla de directorios** es suficiente con desplazarse a la carpeta *dbtools* y ejecutar el script **updateDB.py**, así se añadirán automágicamente a la base de datos. De haber archivos duplicados en la *jungla de directorios* durante la ejecución del script anterior, se añaden las direcciones de dichos duplicados al script *rm_duplicated_files*. La ejecución de este script devenirá en el borrado de los duplicados de la *jungla de directorios*.
