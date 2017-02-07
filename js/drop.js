Dropzone.options.drop = {
    url: "/BDExamenes/php/upload.php",
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
      // Max accepted files reached
      // this.on("maxfilesreached",function(file){
        
      // });
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
		  });
	  }
};

