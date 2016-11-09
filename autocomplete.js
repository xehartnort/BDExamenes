function mostrarResultados(){
  var args = "tag0="+encodeURI($("#grado").val())+
    "&tag1="+encodeURI($("#asig").val())+
    "&tag2="+encodeURI($("#anio").val())+
    "&tag3="+encodeURI($("#curso").val());
  $.getJSON( 'getter.php', args, function (data) { // success handler
    $('#lista').empty();
    if(data.length==0 || data==null){
      $('#lista').append('<li>'+'No se encontraron resultados'+'</li>');
    }else{
      $.each(data, function(key, value) {
        var path2file = encodeURI(value+"/"+key);
        $('#lista').append('<li><a href='+path2file+'>'+key+'</a></li>');
      });
    }
  });
}
function sugerencias( id_input ){
  var termTemplate = "<span class='ui-autocomplete-term'>%s</span>";
  $( "#"+id_input ).autocomplete({
    delay: 500,
    minLength: 2,
    source: function( request, response ) {
      var args = "term="+request.term+"&"+"tipo="+id_input;
      $.getJSON( "tagger.php", args, response );
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
  sugerencias("grado");
  $('#grado').on('input', function(){mostrarResultados();});
  $('#curso').val("");
  sugerencias("curso");
  $('#curso').on('input', function(){mostrarResultados();});
  $('#asig').val("");
  sugerencias("asig");
  $('#asig').on('input', function(){mostrarResultados();});
  $('#anio').val("");
  sugerencias("anio");
  $('#anio').on('input', function(){mostrarResultados();});
});
