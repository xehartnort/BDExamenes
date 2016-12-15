function mostrarResultados(numpag){
  var args = "tag0="+encodeURI($("#grado").val())+
            "&tag1="+encodeURI($("#asig").val())+
            "&tag2="+encodeURI($("#anio").val())+
            "&tag3="+encodeURI($("#curso").val())+
            "&page="+numpag;
  $.getJSON( '/BDExamenes/php/getter.php', args, function (data) { // success handler
    delay: 500,
    $('#lista').empty();
    $('#pages').empty();
    if( data["num_r"] > 0){
      $(".shape:has(ul)").show();
      $.each(data, function(key, value) {
        if(key!="num_r"){
          if(value != null){
            var path2file = encodeURI(value+"/"+key);
            $('#lista').append('<li><a href='+path2file+'>'+key+'</a></li>');
          }
        }else{ // add the number of posible pages
          var num_pages = Math.ceil(value/20);
          if(num_pages > 1){ // don't show pagination if only 1 page
            for (i=1; i<=num_pages; i++) {
              if(i == numpag){
                $('#pages').append(
                  "<li onclick='mostrarResultados("+i+")'><a class='active'>"+i+'</a></li>');
              }else{
                $('#pages').append(
                  "<li onclick='mostrarResultados("+i+")'><a>"+i+'</a></li>');
              }
            }
          }else{
            $(".shape:has(ul.pagination)").hide();
          }
        }
      });
    }else{ //sin
      $("#lista").append("<li><a>No se encontraron resultados</a></li>");
      $(".shape:has(ul.pagination)").hide();
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
  $("#lista").append("<li><a>Los resultados se mostrarán aquí</a></li>");
  $(".shape:has(ul.pagination)").hide();

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
});
