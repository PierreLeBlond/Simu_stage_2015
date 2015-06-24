/**
 * Created by lespingal on 12/06/15.
 */

App.scripts = [];

/**
 * @description Add a new script for loading file
 * @param name
 * @param script
 */
App.addScript = function(name, script){
    var myScript = new App.Script();
    App.scripts.push(myScript);
    myScript.name = name;
    myScript.script = script;
};

/**
 *
 * @constructor
 * @description Class managing a script with its name
 */
App.Script = function(){
    this.name = "";
    this.script = function(file, files, last){console.log("default script, usage : function(file, files, last)")};
};

/**
 * @author Arnaud Steinmetz <s.arnaud67@hotmail.fr>
 *
 * @description Function that will define what to do when opening a file.
 * First it will each file in an asynchronous way.
 * endPosition reading a file, it creates the PointCloud with the given positions
 *
 */
function initFileReading() {
    // Checking for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        /**
         * @author Arnaud Steinmetz <s.arnaud67@hotmail.fr>
         *
         * @description Function that will handle the loading of the given file
         * @param {Event} evt
         */
        function handleFileSelect(evt) {
            var files = evt.target.files;
            var nbFiles = files.length;

            App.clearPointCloud();

            App.timer.start();
            //Loop used to launch the reading of each file
            switch(App.type){
                case App.FileType.BIN :
                    for(var numFile = 0; numFile < nbFiles; numFile++)
                    {
                        readAdd(files, numFile, numFile == nbFiles - 1);
                    }
                    break;
                case App.FileType.STRING :
                    break;
                case App.FileType.SKYBOT :
                    break;
                default :
                    break;
            }

            App.timer.stop("Chargement fichier");
        }
        //Setting the event change on the file input to launch the function handleFileSelect
        document.getElementById('files').addEventListener('change', handleFileSelect, false);

    } else {
        alert('The File APIs are not fully supported in this browser.');
    }
}

/**
 * @author Arnaud Steinmetz
 * @description Sets a reader for each file selected
 * @param {FileList} files - List of the file selected.
 * @param {int} numFile - Number of the file that is read.
 */
function readAdd(files, numFile, last) {
    App.timer.start();
    var reader = new FileReader();
    var fileName = files[numFile].name;

    //
    reader.onerror = function (evt) {
        switch (evt.target.error.code) {
            case evt.target.error.NOT_FOUND_ERR:        //If the file isn't found
                alert('File Not Found!');
                break;
            case evt.target.error.NOT_READABLE_ERR:     //If the file isn't readable
                alert('File is not readable');
                break;
            case evt.target.error.ABORT_ERR:            //If something abort the file
                alert('Reading interrupted');
                break;
            default:
                alert('An error occurred reading this file.');
        }
    };

    //
    reader.onprogress = function (evt) {
    };

    //
    reader.onabort = function (e) {
        alert('File read cancelled');
    };

    //
    reader.onloadstart = function (e) {
    };

    //
    reader.onload = function (e) {
    };

    /**
     * @author Arnaud Steinmetz <s.arnaud67@hotmail.fr>
     *
     * @description Function that will be called at the end of the loading phase.
     * @description Reads the file by using arrayBuffer and fill the right array depending on the position
     * @description This part of the reading is blocking the other when it is running (running back on the main thread -> not asynchronous)
     * @param {loadend} evt
     *
     * /!\ TODO: check the file content before attempting to fill the array
     */
    reader.onloadend = function (evt) {
        var file = evt.target;
        //Checking if the file has correctly been read
        if (file.readyState == FileReader.DONE) {
            App.scripts[0].script(file, files, last);
        }
    };
    // Read in the file as a ArrayBuffer.
    reader.readAsArrayBuffer(files[numFile]);
}
