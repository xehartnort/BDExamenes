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
            $('.results')
              .append('<li><a href='+path2file+' target="_blank"><img class="image" src="img/'+value[1]+'.jpg"><br>'+key+'</a></li>');
          }
        }
      });
    }else{
      $(".results")
        .val("")
        .append("<li><a>No se encontraron resultados</a></li>");
    }
  });
}

$(document).ready(function() {

  var previous_values = [ $('.container').css("marginTop"), $('.container').css("marginBottom"),
    $('.header').css("font-size")];

  $(window)
    .on('popstate', function() {
      var hashLocation = location.hash;
      var hashSplit = hashLocation.split("#!/");
      var hashName = hashSplit[1];
      if (hashName !== '') {
        var hash = window.location.hash;
        if (hash === '') {
          if( document.body.scrollTop === 0 ){ // reached top of the screen
            $('.container')
              .css("marginTop", previous_values[0])
              .css("marginBottom", previous_values[1]); 
            $('.header').css("font-size", previous_values[2]); 
          }
        }
      }
    })
    .scroll(function(){
      if( ($(window).scrollTop()+$(window).height() > $(document).height() - 50 ) && pag < page_limit){
        mostrarResultados(++pag);
      }
    });

  $(".buttom_up").on('click',function(){ 
    $("html, body").animate({ scrollTop: 0 });
  });

  $( '.icon' ).click(function(){
    mostrarResultados(1);
  });

  $('.search')
    .one('input', function(){ 
      window.history.pushState('forward', null, '#forward');
      $('.container')
        .css("marginTop", "0")
        .css("marginBottom", parseInt(previous_values[1], 10)/2.0); 
      $('.header').css("font-size", "0"); 
    })
    .on('click', function(){
      this.select(); 
    })
    .keydown(function(event){
      if(event.keyCode == 13){ // press intro
          mostrarResultados(1);
      }
    })
    .focusout(function(){
      $('.container')
        .css("marginTop", previous_values[0]) 
        .css("marginBottom", previous_values[1]); 
      $('.header').css("font-size", previous_values[2]); 
      $('.search')
        .one('input', function(){ 
          window.history.pushState('forward', null, '#forward');
          $('.container')
            .css("marginTop", "0")
            .css("marginBottom", parseInt(previous_values[1], 10)/2.0); 
          $('.header').css("font-size", "0"); 
        });
    })
    .autocomplete({
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
});