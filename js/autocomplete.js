var pag = 1;
var page_limit;

function split( val ) {
  return val.split( /,\s*/ );
}

function extractLast( term ) {
  return split( term ).pop();
}

function mostrarResultados(numpag) {
  var args="", array_tags = split( $(".search-input").val() );
  for (var i = 0; i < array_tags.length; i++) {
    args += "tag"+i+"="+encodeURI(array_tags[i])+"&";
  };
  args += "page="+numpag;
  console.log(args);
  $.getJSON( './php/getter.php', args, function (data, status) { // success handler
    if(status == "success"){
      if(numpag==1){
        $("#lista").empty();
      }
      page_limit = Math.floor(data["num_r"]/20) + 1;
      if( data["num_r"] > 0 ){
        $.each(data, function(key, value) {
          if(key!="num_r"){
            if(value != null){
              var path2file = encodeURI(value+"/"+key);
              $('#lista').append('<li><a href='+path2file+' target="_blank">'+key+'</a></li>');
            }
          }
        });
      }else{
        $("#lista").empty();
        $("#lista").append("<li><a>No se encontraron resultados</a></li>");
      }
    }
  });
}

$(document).ready(function() {
  $("button#up").hide();
  $("#lista").append("<li><a>Los resultados se mostrarán aquí</a></li>");

  $( '#input' ).autocomplete({
    autoFocus: true,
    minLength: 1,
    create: function( event, ui ) {
      $( '#input' ).val("");
      $.getJSON( "./php/tagger.php", 
        function(data, status){
          if(status=="success"){
            cache = data;
          }
        }
      );
    },
    source: function( request, response ) {
      var escapedString = $.ui.autocomplete.escapeRegex(extractLast( request.term ));
      var matcher = new RegExp( "^" + escapedString.replace(/[aeiouáéíóú]/gi, '[aeiouáéíóú]'), "i" );
      response( $.grep( cache, 
        function( item ){
          return matcher.test( item );
        })
      );
    },
    change: function() {
      pag=1;
      setTimeout(function(){mostrarResultados(pag);},50); // sin timeout no toma el último valor
    },
    select: function( event, ui) {
      var terms = split( this.value );
      // remove the current input
      terms.pop();
      // add the selected item
      terms.push(ui.item.value);
      // add placeholder to get the comma-and-space at the end
      terms.push( "" );
      $( '#input' ).val(terms.join( ", " ));
      pag=1;
      setTimeout(function(){mostrarResultados(pag);},50); // sin timeout no toma el último valor
      return false;
    }
  });

  $("button#up").on('click',function(){ 
    $("html, body").animate({ scrollTop: 0 }, "fast");
  });

  $(window).scroll(function(){
    if( ($(window).scrollTop()+$(window).height() > $(document).height() - 50 ) && pag < page_limit){
      $("button#up").show();
      mostrarResultados(++pag);
    }
  });
});
