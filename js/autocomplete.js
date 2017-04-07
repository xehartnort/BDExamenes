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
  $.getJSON( './php/getter.php', args, function (data, status) { // success handler
    if(numpag==1){
      $("#lista").empty();
    }
    page_limit = Math.floor(data["num_r"]/20) + 1;
    if( data["num_r"] > 0 ){
      $.each(data, function(key, value) {
        if(key!="num_r"){
          if(value != null){
            var path2file = encodeURI(value[0]+"/"+key);
            $('#lista').append('<li><a href='+path2file+' target="_blank"><img class="image" src="./img/'+value[1]+'.png"><div class="imagetext">'+key+'</div></a></li>');
          }
        }
      });
    }else{
      $("#lista").empty();
      $("#lista").append("<li><a>No se encontraron resultados</a></li>");
    }
  });
}

$(document).ready(function() {

  $("button#up").hide();
  $("#lista").append("<li><a>Los resultados se mostrarán aquí</a></li>");

  $( '.search-input' ).autocomplete({
    autoFocus: true,
    create: function( event, ui ) {
      $( '.search-input' ).val("");
      $.getJSON( "./php/tagger.php", 
        function(data, status){
          cache = data;
          var max = 5;
          for(var i=0; i<max ; i++){
            var li = document.createElement('li');
            li.innerHTML = data[i];
            li.onclick = function(){
              var terms = split( $( '.search-input' ).val() );
              if(terms[terms.length-1]==""){
                terms.pop();
              }
              terms.push(this.innerHTML);
              terms.push("");
              $( '.search-input' ).val( terms.join( ", " ) );
              mostrarResultados(pag);
            }
            $('#suglist').append(li);
          }
        }
      );
    },
    source: function( request, response ) {
      var escapedString = $.ui.autocomplete.escapeRegex(extractLast( request.term ));
      escapedString = escapedString.replace(/[aá]/gi, '[aá]').replace(/[eé]/gi, '[eé]');
      escapedString = escapedString.replace(/[ií]/gi, '[ií]').replace(/[oó]/gi, '[oó]');
      var matcher = new RegExp( "^" + escapedString, "i" );
      response( $.grep( cache, 
        function( item ){
          return matcher.test( item );
        })
      );
    },
    search: function() {
      // custom minLength
      var term = extractLast( this.value );
      if ( term.length < 2 ) {
        return false;
      }
    },
    change: function() {
      pag=1;
      mostrarResultados(pag);
    },
    select: function( event, ui) {
      pag=1;
      var terms = split( this.value );
      // remove the current input
      terms.pop();
      // add the selected item
      terms.push(ui.item.value);
      // add placeholder to get the comma-and-space at the end
      terms.push( "" );
      $( '.search-input' ).val(terms.join( ", " ));
      mostrarResultados(pag);
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
