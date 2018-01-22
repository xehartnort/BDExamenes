function newOption(text){
    var option = document.createElement("option");
    option.text = text;
    return option;
}

function uploadFile(file){
    var url = 'php/uploader.php';
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) { // ya se ha subido al servidor
            genThumbnail(file, JSON.parse(xhr.responseText));
        }
    };
    var fd = new FormData();
    fd.append("file", file);
    xhr.send(fd);
}

function showToast(msg) {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar")
    x.innerHTML = msg
    // Add the "show" class to DIV
    x.className = "show";
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
} 

function genThumbnail(file, data) {
    var gallery = document.querySelector(".gallery");
    var thumb = document.createElement("div");
    thumb.classList.add('thumbnail'); // Add the class thumbnail to the created div
    if( !data.duplicate ){
        var img = document.createElement("img");
        img.src="img/default.jpg";  
        
        img.classList.add('imgprop'); // Add the class thumbnail to the created div

        var x1 = document.createElement("div");
        x1.classList.add("div-image");

        x1.appendChild(img);
        x1.innerHTML = x1.innerHTML+"<br>"+file.name;
        thumb.appendChild(x1);
        var x2 = document.createElement("div");
        x2.classList.add("div-select");
        var x3 = document.createElement("div");
        x3.classList.add("div-buttons");
        
        var span_asig = document.createElement("span");
        span_asig.innerHTML = "Asignatura: ";
        var asig = document.createElement("select"); 
        for(var i in data.asig){
          asig.add( newOption(data.asig[i]) );
        }
        span_asig.appendChild(asig);
        x2.appendChild(span_asig);

        var span_anio = document.createElement("span");
        span_anio.innerHTML = "Año académico: ";
        var anio = document.createElement("select"); 
        for(var i in data.anio){
          anio.add( newOption(data.anio[i]) );
        }
        span_anio.appendChild(anio);
        x2.appendChild(span_anio);
        thumb.appendChild(x2);

        var accept = document.createElement("button");
        accept.innerHTML = "Subir";
        accept.id = file.name;
        accept.addEventListener('click', function(){
            var grandad = this.parentElement.parentElement;
            var one = grandad.children[1];
            var asig = one.children[0].children[0].value; // first selected value
            var anio = one.children[1].children[0].value; // first selected value
            var url = encodeURI('php/classifier.php?'+"asig="+asig+"&anio="+anio+"&file="+this.id);
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.send();
            showToast("El archivo se ha añadido con éxito, pronto será revisado");
            this.parentElement.parentElement.style.display = 'none';
        });
        x3.appendChild(accept);
        var delet = document.createElement("button");
        delet.innerHTML = "Eliminar";
        delet.addEventListener('click', function () {
          this.parentElement.parentElement.style.display = 'none';
        });
        x3.appendChild(delet);
        thumb.appendChild(x3);
        gallery.appendChild(thumb);
    }else{
        showToast("El archivo ya se encuentra en la base de datos o en estado de revisión");
        
        // thumb.innerHTML = thumb.innerHTML+file.name+" ya se encuentra clasificado en la base de datos<br>";
        // var delet = document.createElement("button");
        // delet.innerHTML = "Cerrar";
        // delet.addEventListener('click', function () {
        //   this.parentElement.parentElement.style.display = 'none';
        // });
        // thumb.appendChild(delet);
    }
}

document.addEventListener('DOMContentLoaded', function() {

  var uploadfiles = document.querySelector('#fileinput');
  
  uploadfiles.addEventListener('change', function () {
    document.querySelector(".loading").style.display = "block";
    if( document.querySelector(".gallery").innerHTML == "Aquí se previsualizarán los archivos"){
      document.querySelector(".gallery").innerHTML="";
    }
    for(var i=0; i<this.files.length; i++){
      uploadFile(this.files[i]);
    }
    document.querySelector(".loading").style.display = "none";
  }, false);

});