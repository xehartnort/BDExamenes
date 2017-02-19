var count=0;
Dropzone.options.drop = {
    url: "/BDExamenes/php/uploader.php",
    clickable: true,
    autoProcessQueue: false,
    uploadMultiple: true,
    parallelUploads: 10,
    maxFiles: 10,
    addRemoveLinks: true,
    acceptedFiles: "image/*,application/pdf",
    dictRemoveFile: "Eliminar",
    dictCancelUpload: "Cancelar",
  	dictDefaultMessage: "Arrastra y suelta, o haz click para añadir tus exámenes",
  	dictFileTooBig: "El tamaño máximo permitido es 10 MiB",
  	dictMaxFilesExceeded: "El número máximo de archivos está limitado a 10",
  	init: function(){
      var myDropzone = this;
   		// Upload images when submit button is clicked.
	   	$("button#submit-all").click(function (e) {
	      	e.preventDefault();
	       	e.stopPropagation();
	       	myDropzone.processQueue();
	    });
      $("button#delete-all").click(function (e) {
          myDropzone.removeAllFiles();
      });
      // Remove exceeded files
      myDropzone.on("maxfilesexceeded",function(file){
        myDropzone.removeFile(file);
      });
      myDropzone.on("error",function(file, errorMessage){
        console.log(errorMessage+file);
      });
	   	// Refresh page when all images are uploaded
 	    myDropzone.on("complete", function (file) {
	      if (myDropzone.getUploadingFiles().length === 0 && 
	      	  myDropzone.getQueuedFiles().length === 0) {
	        // window.location.reload();
	    	}
        if(file.status=="success"){
          var args ="nomdoc="+file.name;
          $.getJSON('./php/getClassif.php', args,
            function (data, status) {
              for(var i=0; i<data.length; i++){
                $("#upfiles").append("<li name="+count+">"+data[i]+"</li>");
                console.log(count);
              }
              $("#upfiles").append("<button type=\"submit\" class=\"inverted\" id=\""+count+"\">Haz click aquí si "+file.name+" está bien clasificado</button>");
              $('#'+count).click( function (){
                $('[name='+count+']').each(function(key,value){
                  this.remove();
                });
                this.remove();
              });
            }
          );
        }
        count++;
		  });
	  }
};

