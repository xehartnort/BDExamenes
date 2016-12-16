function mostrarResultados(numpag){
  var args = "tag0="+encodeURI($("#grado").val())+
            "&tag1="+encodeURI($("#asig").val())+
            "&tag2="+encodeURI($("#anio").val())+
            "&tag3="+encodeURI($("#curso").val())+
            "&page="+numpag;
  $.getJSON( '/BDExamenes/php/getter.php', args, function (data) { // success handler
    if(numpag==1){
      $('#lista').empty();
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
      $("#lista").append("<li><a>No se encontraron resultados</a></li>");
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
    source: function( request, response ) {
      $.getJSON( "/BDExamenes/php/tagger.php", "term="+request.term+args, response );
    },
    select: function(){
      setTimeout(function(){mostrarResultados(1);},50); // sin timeout no toma el último valor
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
  $("button#up").hide();
  $("#lista").append("<li><a>Los resultados se mostrarán aquí</a></li>");

  $('#grado').val("");
  $('#grado').on( "autocompleteselect", function( event, ui ){});
  $('#grado').on('input', function(){
    autocompletar("grado");
    mostrarResultados(1);
  });

  $('#asig').val("");
  $('#asig').on( "autocompleteselect", function( event, ui ){});
  $('#asig').on('input', function(){
    autocompletar("asig");
    mostrarResultados(1);
  });

  $('#anio').val("");
  $('#anio').on( "autocompleteselect", function( event, ui ){});
  $('#anio').on('input', function(){
    autocompletar("anio");
    mostrarResultados(1);
  });

  $('#curso').val("");
  $('#curso').on( "autocompleteselect", function( event, ui ){});
  $('#curso').on('input', function(){
    autocompletar("curso");
    mostrarResultados(1);
  });

  $("button#up").on('click',function(){ 
    $("html, body").animate({ scrollTop: 0 }, "slow");
  });

  var pag = 1;
  $(window).scroll(function(){
    $("button#up").show();
    if( $(document).height() - $(window).height() == $(window).scrollTop() ){
      mostrarResultados(++pag);
    }
  });
});
