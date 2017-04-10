var pag = 1;
var page_limit;

function split( val ) {
  return val.split( /,\s*/ );
}

function extractLast( term ) {
  return split( term ).pop();
}

function mostrarResultados(numpag) {
  var args="", array_tags = split( $(".search").val() );
  for (var i = 0; i < array_tags.length; i++) {
    args += "tag"+i+"="+encodeURI(array_tags[i])+"&";
  };
  args += "page="+numpag;
  $.getJSON( './php/getter.php', args, function (data, status) { // success handler
    if(numpag==1){
      $(".results").empty();
    }
    page_limit = Math.floor(data["num_r"]/20) + 1;
    if( data["num_r"] > 0 ){
      $.each(data, function(key, value) {
        if(key!="num_r"){
          if(value != null){
            var path2file = encodeURI(value[0]+"/"+key);
            $('.results').append('<li><a href='+path2file+' target="_blank"><img class="image" src="./img/'+value[1]+'.jpg"><br>'+key+'</a></li>');
          }
        }
      });
    }else{
      $(".results").val("");
      $(".results").append("<li><a>No se encontraron resultados</a></li>");
    }
  });
}

$(document).ready(function() {

  $('.search').on('focus', function(){ 
    $('.search').css("margin-top", "0"); 
    $('.search').css("margin-bottom", "1%"); 
    $('.header').css("font-size", "0"); 
    $('.header').css("height", "0"); 
    $('.logo').css("height", "0"); 
    this.select(); 
  });
  // SCROLLING FUN
  var previous_values = [ $('.search').css("margin-top"), $('.search').css("margin-bottom"),
    $('.header').css("font-size"), $('.header').css("height"),
    $('.logo').css("height") ];
  var lastScrollTop = 0;
  $(window).scroll(function(){
    var st = window.pageYOffset || document.documentElement.scrollTop;
    if (st <= lastScrollTop){ // scroll top
      if( document.body.scrollTop === 0 ){ // reached top of the screen
        $('.search').css("margin-top", previous_values[0]); 
        $('.search').css("margin-bottom", previous_values[1]); 
        $('.header').css("font-size", previous_values[2]); 
        $('.header').css("height", previous_values[3]); 
        $('.logo').css("height", previous_values[4]); 
      }
    }
    lastScrollTop = st;
  });
  // END SCROLLING FUN

  $(".button_up").hide();
  $(".results").append("<li><a>Los resultados se mostrarán aquí</a></li>");
  $('.clearable').clearSearch();

  $( '.search' ).autocomplete({
    autoFocus: true,
    create: function( event, ui ) {
      $( '.search' ).val("");
      $.getJSON( "./php/tagger.php", 
        function(data, status){
          cache = data;
          var max = 5;
          for(var i=0; i<max ; i++){
            var li = document.createElement('li');
            li.innerHTML = data[i];
            li.onclick = function(){
              var terms = split( $( '.search' ).val() );
              var pos = terms.indexOf(this.innerHTML);
              if(pos != -1){
                terms.splice(pos, 1);
              }else{
                if(terms[terms.length-1]==""){
                  terms.pop();
                }
                terms.push(this.innerHTML);
                terms.push("");
              }
              $( '.search' ).val( terms.join( ", " ) );
              mostrarResultados(pag);
            }
            $('.suggestions').append(li);
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
      $( '.search' ).val(terms.join( ", " ));
      mostrarResultados(pag);
      return false;
    }
  });

  $(".buttom_up").on('click',function(){ 
    $("html, body").animate({ scrollTop: 0 }, "slow");
  });

  $(window).scroll(function(){
    if( ($(window).scrollTop()+$(window).height() > $(document).height() - 50 ) && pag < page_limit){
      $(".buttom_up").show();
      mostrarResultados(++pag);
    }
  });
});
