function mostrarResultados(numpag){
  var args = "tag0="+encodeURI($("#grado").val())+
            "&tag1="+encodeURI($("#asig").val())+
            "&tag2="+encodeURI($("#anio").val())+
            "&tag3="+encodeURI($("#curso").val())+
            "&page="+numpag;
  $.getJSON( './php/getter.php', args, function (data, status) { // success handler
    if(status == "success"){
      if(numpag==1){
        $("#lista").empty();
      }
      if( data["num_r"] > 0){
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

function autocompletar( id_input, lcache ){
  $( "#"+id_input ).autocomplete({
    autoFocus: true,
    minLength: 0,
    create: function( event, ui ) {
      $( '#'+id_input ).val("");
      $.getJSON( "./php/tagger.php", "caller="+id_input, 
        function(data, status){
          if(status=="success"){
            lcache = data;
          }
        }
      );
    },
    source: function( request, response ) {
      cache = lcache;
      var escapedString = $.ui.autocomplete.escapeRegex( request.term );
      var matcher = new RegExp( "^" + escapedString.replace(/[aeiouáéíóú]/gi, '[aeiouáéíóú]'), "i" );
      response( $.grep( cache, function( item ){
          return matcher.test( item );
        })
      );
    },
    change: function(){
      setTimeout(function(){mostrarResultados(1);},50); // sin timeout no toma el último valor
    },
    select: function(){
      setTimeout(function(){mostrarResultados(1);},50); // sin timeout no toma el último valor
    }
  });
}

$(document).ready(function() {
  $("button#up").hide();
  $("#lista").append("<li><a>Los resultados se mostrarán aquí</a></li>");

  var cache_grado;
  var cache_asig;
  var cache_anio;
  var cache_curso;
  autocompletar("grado", cache_grado);
  autocompletar("asig", cache_asig);
  autocompletar("anio", cache_anio);
  autocompletar("curso", cache_curso);

  $("button#up").on('click',function(){ 
    $("html, body").animate({ scrollTop: 0 }, "slow");
  });

  var pag = 1;
  $(window).scroll(function(){
    if($(window).scrollTop() >= $(document).height() - $(window).height() - 10){
      $("button#up").show();
      mostrarResultados(++pag);
    }
  });
});
