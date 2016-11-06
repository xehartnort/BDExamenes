// ajax version
$(document).ready(function(){
  $.ajax({
    type: 'GET',
    url: 'tagger.php',
    data: '',
    dataType: 'json',
    success: function (data) {
      $.each(data, function(index, element) {
        switch (element) {
          case 'grado':
            $('#grado').append(new Option(index, index));
            break;
          case 'curso':
            $('#curso').append(new Option(index, index));
            break;
          case 'asig':
            $('#asig').append(new Option(index, index));
            break;
          case 'anio':
            $('#anio').append(new Option(index, index));
            break;
        }
      });
    }
  });
  $('#selects').change(function(){
    var args = encodeURI("tag1="+$("#grado").val()+"&"+
            "tag2="+$("#curso").val()+"&"+
            "tag3="+$("#asig").val()+"&"+
            "tag4="+$("#anio").val());
    $.ajax({
       type: 'GET',
       url: 'getter.php',
       data: args,
       dataType: 'json',
       success: function (data) {
         $('#lista').empty();
         //console.log(data);
         if(data == null){
           $('#lista').append('<li>'+'No se encontraron resultados'+'</li>');
         }else{
           $.each(data, function(key, value) {
             var path2file = encodeURI(value+"/"+key);
             $('#lista').append('<li><a href='+path2file+'>'+key+'</a></li>');
           });
         }
       }
    });
  });
});
