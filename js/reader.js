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
    this.script = function(file){console.log("default script, usage : function(file), return [{name:\"index\", value:X}, {name:\"position\", value:Y}, {name:\"color\", value:Z}, ...]")};
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

            App.timer.start();
            //Loop used to launch the reading of each file
            switch(App.type){
                case App.FileType.BIN :
                    App.data.positionsArray.push(new Float32Array(2097152*3));
                    if(App.parameters.nbSnapShot != 0){
                        App.data.directionsArray.push(new Float32Array(2097152*3));
                    }
                    async.forEach(files, readAdd, function(err){ //TODO use async.map instead to manage all data once they are load, hence an access to the exact number of point before even populating buffers.
                            App.timer.stop("populating buffer");

                            App.timer.start();
                            loadData();
                            App.timer.stop("Load Data");
                            App.parameters.nbSnapShot++;
                            App.parameters.posSnapShot = 0;
                        }
                    );

                    /*for(var numFile = 0; numFile < nbFiles; numFile++)
                    {
                        readAdd(files[numFile]);
                    }
                     App.timer.stop("populating buffer");

                     App.timer.start();
                     loadData();
                     App.timer.stop("Load Data");
                     App.parameters.nbSnapShot++;
                     App.parameters.posSnapShot = 0;*/

                    break;
                case App.FileType.STRING :
                    break;
                case App.FileType.SKYBOT :
                    break;
                default :
                    break;
            }

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
function readAdd(file, callback) {
    App.timer.start();
    var reader = new FileReader();
    //var fileName = files[numFile].name;

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
            var data = App.scripts[0].script(file);
            var i;
            for(i = 1;i < data.length;i++){
                var index;
                switch(data[i].name){
                    case "position" :
                        var position = data[i].value;
                        var length = data[0].value.length;
                        if(App.parameters.nbSnapShot == 0){
                            for(i = 0; i < length;i++)
                            {
                                index = data[0].value[i];
                                App.data.positionsArray[0][index*3]=App.data.currentPositionArray[index*3]=position[3*i];
                                App.data.positionsArray[0][index*3 + 1]=App.data.currentPositionArray[index*3 + 1]=position[3*i + 1];
                                App.data.positionsArray[0][index*3 + 2]=App.data.currentPositionArray[index*3 + 2]=position[3*i + 2];
                            }
                        }
                        else
                        {
                            for(i = 0; i < length;i++)
                            {
                                index = data[0].value[i];

                                var x = position[3*i];
                                var y = position[3*i+1];
                                var z = position[3*i+2];

                                var dx = x-App.data.positionsArray[App.parameters.nbSnapShot - 1][index*3];
                                var dy = y-App.data.positionsArray[App.parameters.nbSnapShot - 1][index*3+1];
                                var dz = z-App.data.positionsArray[App.parameters.nbSnapShot - 1][index*3+2];

                                //Correcting the vector direction for the elements going outside the box
                                //To be exact, you can check in the shader if the position goes outside the box, then you change it. Instead of doing that here.
                                if(dx > 0.5)
                                {
                                    App.data.positionsArray[App.parameters.nbSnapShot - 1][index*3]+=1;
                                    dx = -(App.data.positionsArray[App.parameters.nbSnapShot - 1][index*3]-x);
                                }
                                else if(dx < -0.5)
                                {
                                    App.data.positionsArray[App.parameters.nbSnapShot - 1][index*3]-=1;
                                    dx = -(App.data.positionsArray[App.parameters.nbSnapShot - 1][index*3]-x);
                                }


                                if(dy > 0.5)
                                {
                                    App.data.positionsArray[App.parameters.nbSnapShot - 1][index*3+1]+=1;
                                    dy = -(App.data.positionsArray[App.parameters.nbSnapShot - 1][index*3+1]-y);
                                }
                                else if(dy < -0.5)
                                {
                                    App.data.positionsArray[App.parameters.nbSnapShot - 1][index*3+1]-=1;
                                    dy = -(App.data.positionsArray[App.parameters.nbSnapShot - 1][index*3+1]-y);
                                }


                                if(dz > 0.5)
                                {
                                    App.data.positionsArray[App.parameters.nbSnapShot - 1][index*3+2]+=1;
                                    dz = -(App.data.positionsArray[App.parameters.nbSnapShot - 1][index*3+2]-z);
                                }
                                else if(dz < -0.5)
                                {
                                    App.data.positionsArray[App.parameters.nbSnapShot - 1][index*3+2]-=1;
                                    dz = -(App.data.positionsArray[App.parameters.nbSnapShot - 1][index*3+2]-z);
                                }

                                App.data.directionsArray[App.parameters.nbSnapShot - 1][index*3]= dx;
                                App.data.directionsArray[App.parameters.nbSnapShot - 1][index*3+1]= dy;
                                App.data.directionsArray[App.parameters.nbSnapShot - 1][index*3+2]= dz;

                                App.data.positionsArray[App.parameters.nbSnapShot][index*3]= x;
                                App.data.positionsArray[App.parameters.nbSnapShot][index*3 + 1]= y;
                                App.data.positionsArray[App.parameters.nbSnapShot][index*3 + 2]= z;
                            }
                        }
                        position = null;    //let's free some memory as fast as possible, shall we ?
                        break;
                    case "color" :
                        if(App.parameters.nbSnapShot == 0) {
                            var color = data[i].value;
                            length = color.length;
                            for (i = 0; i < length; i++) {
                                index = data[0].value[i];
                                App.data.color[index] = color[i]*255;
                            }
                            App.staticBufferGeometryPointCloud.geometry.attributes.color.needsUpdate = true;
                        color = null;
                        }
                        break;
                    default :
                        break;
                }
            }
        }
        callback();
    };
    // Read in the file as a ArrayBuffer.
    reader.readAsArrayBuffer(file);
    //reader.readAsBinaryString(file);
}

function loadBinaryFile()
{

    var file = "data/Deparis_data_binaire/part_start/part.00000.p00000";

    var xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange', onReadyStateChange, false);

    function onReadyStateChange()
    {
        if(xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0))
        {                                  // When the file content is received
            var str = xhr.responseText;                             // Store it as a string
            var ch, st, sh, bytes = [];

            for (var i = 0; i < str.length; i++)
            {
                ch = str.charCodeAt(i);                               // Read each character
                st = [];
                                                              // Initialize a stack
                do
                {
                    sh = (ch & 0xFFFF > 0x7F00) ? 16 : 8;
                    st.unshift(ch & 0xFF);                              // Stack the last byte of the character
                    ch = ch >> sh;                                      // And read the previous one (or the one before if ch > 128)
                }
                while (ch);                                           // As long as it's possible
                bytes = bytes.concat(st);                             // Add the stack to the bytes array
            }

            callback(bytes);                                        // Call the callback function with bytes as parameter
        }
    }

    xhr.open("GET", file, true);
    xhr.send(null);

}