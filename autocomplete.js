function mostrarResultados(){
  /*var array_tags = split( $( "#query" ).val() );
  var args="";
  for (i = 0; i < array_tags.length; i++) {
    if(array_tags[i]!="")
      args += encodeURI("tag"+i+"="+array_tags[i]);
    if (i+1 < array_tags.length)// if not last iteration
      args += "&";
  }*/
  var args = "tag0="+encodeURI($("#grado").val())+
      "&tag1="+encodeURI($("#asig").val())+
      "&tag2="+encodeURI($("#anio").val())+
      "&tag3="+encodeURI($("#curso").val());
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
function split( val ) {
  return val.split( /,\s*/ );
}
function extractLast( term ) {
  return split( term ).pop();
}

function sugerencias( id_input ){
  var termTemplate = "<span class='ui-autocomplete-term'>%s</span>";
  $( "#"+id_input ).autocomplete({
    delay: 500,
    autoFocus: true,
    source: function( request, response ) {
      $.getJSON( "tagger.php",
        /*extractLast( */"term="+request.term+"&"+"tipo="+id_input
      , response );
    },
    search: function() {
      // custom minLength
      var term = extractLast( this.value );
      if ( term.length < 2 ) {
        return false;
      }
    },
    /*select: function( event, ui ) {
      var terms = split( this.value );
      // remove the current input
      terms.pop();
      // add the selected item
      terms.push( ui.item.value );
      // add placeholder to get the comma-and-space at the end
      terms.push( "" );
      this.value = terms.join( ", " );
      return false;
    },*/
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
  $('#grado').on('input', function() { mostrarResultados(); });
  $('#curso').val("");
  sugerencias("curso");
  $('#curso').on('input', function() { mostrarResultados(); });
  $('#asig').val("");
  sugerencias("asig");
  $('#asig').on('input', function() { mostrarResultados(); });
  $('#anio').val("");
  sugerencias("anio");
  $('#anio').on('input', function() { mostrarResultados(); });

});
