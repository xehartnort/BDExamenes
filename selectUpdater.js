// ajax version
function mostrarResultados(){
  var args = encodeURI("tag1="+$("#grado").val()+"&"+
          "tag2="+$("#curso").val()+"&"+
          "tag3="+$("#asig").val()+"&"+
          "tag4="+$("#anio").val());
  $.getJSON( 'getter.php', args, function (data) { // success handler
    $('#lista').empty();
    if(data == null){
      $('#lista').append('<li>'+'No se encontraron resultados'+'</li>');
    }else{
      $.each(data, function(key, value) {
        var path2file = encodeURI(value+"/"+key);
        $('#lista').append('<li><a href='+path2file+'>'+key+'</a></li>');
      });
    }
  });
}
function rellenarSelects(){
  $.getJSON( 'tagger.php', function (data) {  // success handler
    $.each(data, function(index, element) {
      switch (element) {
        case 'grado':
          $('#grado').append(new Option(index, index));
          break;
        case 'curso':
          $('#curso').append(new Option(index, index));
          break;
        case 'asig':
          $('#asig').append(new Option(index, index));
          break;
        case 'anio':
          $('#anio').append(new Option(index, index));
          break;
      }
    });
  });
}
$(document).ready(function(){
  rellenarSelects();
  //mostrarResultados();
  $('#selects').change(function(){
    mostrarResultados();
  });
});
