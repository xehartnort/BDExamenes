function mostrarResultados(){
  var array_tags = split( $( "#query" ).val() );
  var args="";
  for (i = 0; i < array_tags.length; i++) {
    if(array_tags[i]!="")
      args += encodeURI("tag"+i+"="+array_tags[i]);
    if (i+1 < array_tags.length)// if not last iteration
      args += "&";
  }
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
$(document).ready(function() {
  var termTemplate = "<span class='ui-autocomplete-term'>%s</span>";
  $( "#query" ).val("");
  $( "#query" ).autocomplete({
    delay: 200,
    autoFocus: true,
    source: function( request, response ) {
      $.getJSON( "tagger.php", {
        term: extractLast( request.term )
      }, response );
    },
    search: function() {
      // custom minLength
      var term = extractLast( this.value );
      if ( term.length < 2 ) {
        return false;
      }
    },
    select: function( event, ui ) {
      var terms = split( this.value );
      // remove the current input
      terms.pop();
      // add the selected item
      terms.push( ui.item.value );
      // add placeholder to get the comma-and-space at the end
      terms.push( "" );
      this.value = terms.join( ", " );
      return false;
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
  $('#query').on("input", function() {
    mostrarResultados();
  });
});
