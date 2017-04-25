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
            $('.results').append('<li><a href='+path2file+' target="_blank"><img class="image" src="img/'+value[1]+'.jpg"><br>'+key+'</a></li>');
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

  if (window.history && window.history.pushState) {

    $(window).on('popstate', function() {
      var hashLocation = location.hash;
      var hashSplit = hashLocation.split("#!/");
      var hashName = hashSplit[1];
      if (hashName !== '') {
        var hash = window.location.hash;
        if (hash === '') {
          if( document.body.scrollTop === 0 ){ // reached top of the screen
            $('.container').css("marginTop", previous_values[0]); 
            $('.container').css("marginBottom", previous_values[1]); 
            $('.header').css("font-size", "40px"); 
            $('.hline_text').css("font-size", previous_values[3]); 
            $('.suggestions').css("display", previous_values[4]); 
          }

        }
      }
    });
    // window.history.pushState('forward', null, './#forward');
  }


  var previous_values = [ $('.container').css("marginTop"), $('.container').css("marginBottom"),
    $('.header').css("font-size"), $('.hline_text').css("font-size"),
    $(".suggestions").css("display") ];

  // SCROLLING FUN
  $('.search').on('focus', function(){ 
    window.history.pushState('forward', null, './#forward');
    $('.container').css("marginTop", "0"); 
    $('.container').css("marginBottom", "0"); 
    $('.header').css("font-size", "0"); 
    $('.hline_text').css("font-size", "0"); 
    $('.suggestions').css("display", "none"); 
    this.select(); 
  });
  // var lastScrollTop = 0;
  // $(window).scroll(function(){
  //   var st = window.pageYOffset || document.documentElement.scrollTop;
  //   if (st <= lastScrollTop){ // scroll top
  //     if( document.body.scrollTop === 0 ){ // reached top of the screen
  //       $('.container').css("marginTop", previous_values[0]); 
  //       $('.container').css("marginBottom", previous_values[1]); 
  //       $('.header').css("font-size", "40px"); 
  //       $('.hline_text').css("font-size", previous_values[3]); 
  //       $('.suggestions').css("display", previous_values[4]); 
  //     }
  //   }
  //   lastScrollTop = st;
  // });
  // END SCROLLING FUN

  $(".results").append("<li><a>Los resultados se mostrarán aquí</a></li>");

  $( '.search' ).keydown(function(event){
      if(event.keyCode == 13){
          mostrarResultados(1);
      }
  });
  $( '.icon' ).click(function(){
    mostrarResultados(1);
  });
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
              pag=1
              mostrarResultados(1);
            };
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
    $("html, body").animate({ scrollTop: 0 });
  });

  $(window).scroll(function(){
    if( ($(window).scrollTop()+$(window).height() > $(document).height() - 50 ) && pag < page_limit){
      // $(".buttom_up").css("display","block");
      mostrarResultados(++pag);
    }
  });
});
