function mostrarResultados(numpag){
  var args = "tag0="+encodeURI($("#grado").val())+
            "&tag1="+encodeURI($("#asig").val())+
            "&tag2="+encodeURI($("#anio").val())+
            "&tag3="+encodeURI($("#curso").val())+
            "&page="+numpag;
  $.getJSON( 'getter.php', args, function (data) { // success handler
    $('#lista').empty();
    if(data.length==0 || data==null){
      $('#lista').append('<li>'+'No se encontraron resultados'+'</li>');
    }else{
      $.each(data, function(key, value) {
        if(key!="num_r"){
          var path2file = encodeURI(value+"/"+key);
          $('#lista').append('<li><a href='+path2file+'>'+key+'</a></li>');
        }else{ // add the number of posible pages
          $('#pages').empty();
          var num_pages = Math.floor(value/20);
          for (i=1; i<=num_pages; i++) {
            if(i == numpag){
              $('#pages').append(
                "<li onclick='mostrarResultados("+i+")'><a class='active'>"+i+'</a></li>');
            }else{
              $('#pages').append(
                "<li onclick='mostrarResultados("+i+")'><a>"+i+'</a></li>');
            }
          }
        }
      });
    }
  });
}
function autocompletar( id_input ){
  var args = "&caller="+id_input;
  switch (id_input) {
    case "grado":
      args += "&tag0="+encodeURI($("#curso").val())+"&tag1="+encodeURI($("#asig").val())+
              "&tag2="+encodeURI($("#anio").val());
      break;
    case "asig":
      args += "&tag0="+encodeURI($("#curso").val())+"&tag1="+encodeURI($("#grado").val())+
              "&tag2="+encodeURI($("#anio").val());
      break;
    case "anio":
      args += "&tag0="+encodeURI($("#curso").val())+"&tag1="+encodeURI($("#asig").val())+
              "&tag2="+encodeURI($("#grado").val());
      break;
    case "curso":
      args += "&tag0="+encodeURI($("#grado").val())+"&tag1="+encodeURI($("#asig").val())+
              "&tag2="+encodeURI($("#anio").val());
      break;
  }
  $( "#"+id_input ).autocomplete({
    delay: 200,
    source: function( request, response ) {
      $.getJSON( "tagger.php", "term="+request.term+args, response );
    },
    open: function (e, ui) { // hace que la selección escrita sea en negrita
        var acData = $(this).data('ui-autocomplete');
        acData
        .menu
        .element
        .find('li')
        .each(function () {
            var me = $(this);
            var keywords = acData.term.split(' ').join('|');
            me.html(me.text().replace(new RegExp("(" + keywords + ")", "gi"), '<b>$1</b>'));
         });
     }
  });
}
$(document).ready(function() {
  $('#grado').val("");
  $('#grado').on('input', function(){autocompletar("grado")});
  $('#grado').on('input', function(){mostrarResultados(1);});

  $('#curso').val("");
  $('#curso').on('input', function(){mostrarResultados(1);});
  $('#curso').on('input', function(){autocompletar("curso");});

  $('#asig').val("");
  $('#asig').on('input', function(){mostrarResultados(1);});
  $('#asig').on('input', function(){autocompletar("asig");});

  $('#anio').val("");
  $('#anio').on('input', function(){mostrarResultados(1);});
  $('#anio').on('input', function(){autocompletar("anio");});
});
