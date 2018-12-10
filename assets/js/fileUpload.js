// Get all variables
var stlUpload = document.getElementById('stlUpload');

// Add a change listener to the file input to inspect the uploaded file.
stlUpload.addEventListener('change', function() {
    var file = this.files;
    // Create a file reader
    var fileReader = new FileReader();
        localStorage.setItem("stlFile", file);
    console.log(localStorage.stlFile);
});