function gradoUpdater(){    
  var args = encodeURI("grado=" + $("#Grado").val() + "&" +
            "curso=" + $("#Curso").val() + "&" +
            "asig=" + $("#Asignatura").val() + "&" +
            "prof=" + $("#Profesor").val());
  $("#Curso").load("getter.php?caller=curso&"+args);
  $("#Asignatura").load("getter.php?caller=asignatura&"+args);
  $("#Profesor").load("getter.php?caller=profesor&"+args);
}

$(document).ready(function(){
//selección de grado, ajusta los cursos, las asignaturas y los profesores
  $("#Grado").change(function() {
    gradoUpdater();
  });
//selección de curso, ajusta las asignaturas y los profesores
  $("#Curso").change(function() {
    var args = encodeURI("grado=" + $("#Grado").val() + "&" +
              "curso=" + $("#Curso").val() + "&" +
              "asig=" + $("#Asignatura").val() + "&" +
              "prof=" + $("#Profesor").val());
    $("#Asignatura").load("getter.php?caller=asignatura&"+args);
    $("#Profesor").load("getter.php?caller=profesor&"+args);
  });
//selección de asignatura, ajusta los profesores
  $("#Asignatura").change(function() {
    var args = encodeURI("grado=" + $("#Grado").val() + "&" +
              "curso=" + $("#Curso").val() + "&" +
              "asig=" + $("#Asignatura").val() + "&" +
              "prof=" + $("#Profesor").val());
    $("#Profesor").load("getter.php?caller=profesor&"+args);
  });
});
