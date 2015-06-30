/**
 * Created by lespingal on 12/06/15.
 */

App.scripts = [];
App.idScript = 0;
App.nbFiles = 1;
/**
 * @description Add a new script for loading file
 * @param name
 * @param script
 */
App.addScript = function(name, script, binary){
    var myScript = new App.Script();
    App.scripts.push(myScript);
    myScript.name = name;
    myScript.script = script;
    myScript.binary = binary;

};

/**
 *
 * @constructor
 * @description Class managing a script with its name
 */
App.Script = function(){
    this.name = "";
    this.script = function(file){console.log("default script, usage : function(file), return [{name:\"index\", value:X}, {name:\"position\", value:Y}, {name:\"color\", value:Z}, ...]")};
    this.binary = true;
};

/**
 * @description merge the results of loaded files and populate the buffers
 * @param err error
 * @param results array of all the results
 */
function onEveryLoadEnd(err, results){
    var size = 0;
    for(var i = 0;i < results.length;i++){
        size += results[i][0].value.length;
    }

    if(App.parameters.nbSnapShot == 0) {
        App.parameters.nbPoint = size;

        //Gui.devFolder.remove(Gui.nbPoint);

        Gui.nbPoint = Gui.userFolder.add(Gui.parameters, 'nbPoint', 0, size).name("number of point").onFinishChange(function(value){
            App.parameters.nbPoint = value;
            App.staticBufferGeometry.offsets = App.staticBufferGeometry.drawcalls = [];
            var nbCalls = App.parameters.nbCalls;
            var v = App.parameters.nbPoint/nbCalls;
            for(var i = 0;i < nbCalls;i++){
                App.staticBufferGeometry.addDrawCall(i*v, v, i*v);
            }
        });

        Gui.nbPoint.max(size).updateDisplay();

        App.data.color = new Float32Array(size * 3);
        App.data.currentPositionArray = new Float32Array(size * 3);
        App.data.positionsArray.push(new Float32Array(size * 3));

        var length = App.data.color.length / 3;
        for (var i = 0; i < length; i++) {
            App.data.color[3 * i] = 1.0;
            App.data.color[3 * i + 1] = 1.0;
            App.data.color[3 * i + 2] = 1.0;
            /*App.data.colorIndex[3 * i] = i;
             App.data.colorIndex[3 * i + 1] = i >> 8;
             App.data.colorIndex[3 * i + 2] = i >> 16;*/
        }
    }else{ //TODO test if the number of point is the same as before
        App.data.positionsArray.push(new Float32Array(size * 3));
        App.data.directionsArray.push(new Float32Array(size * 3));
    }

    async.forEach(results, populateBuffer, function(){
        App.timer.stop("populating buffer");

        App.timer.start();
        loadData();
        App.timer.stop("Load Data");
        App.parameters.nbSnapShot++;
        App.parameters.posSnapShot = 0;
        document.getElementById('fileLoadingProgress').style.display = 'none';
    });

}

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
            App.nbFiles = files.length;

            App.timer.start();
            document.getElementById('fileLoadingProgress').value = 0;
            document.getElementById('fileLoadingProgress').style.display = 'block';

                    async.map(files, readAdd, onEveryLoadEnd);


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
        document.getElementById('fileLoadingProgress').value += 50/App.nbFiles;
        //Checking if the file has correctly been read
        if (file.readyState == FileReader.DONE) {
            var data = App.scripts[App.idScript].script(file.result);
            callback(null, data);
        }else{
            callback(null, null);
        }
    };
    // Read in the file as a ArrayBuffer.
    if(App.scripts[App.idScript].binary) {
        reader.readAsArrayBuffer(file);
    }else{
        reader.readAsBinaryString(file);
    }
}

function populateBuffer(data, callback){
    var i;
    var j;
    for(j = 1;j < data.length;j++){
        var index;
        switch(data[j].name){
            case "position" :
                var position = data[j].value;
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
                    var color = data[j].value;
                    length = color.length/3;
                    for (i = 0; i < length; i++) {
                        index = data[0].value[i];
                        App.data.color[index*3] = color[i*3];
                        App.data.color[index*3 + 1] = color[i*3 + 1];
                        App.data.color[index*3 + 2] = color[i*3 + 2];
                    }
                    //App.staticBufferGeometryPointCloud.geometry.attributes.color.needsUpdate = true;
                    color = null;
                }
                break;
            default :
                break;
        }
    }
    document.getElementById('fileLoadingProgress').value += 50/App.nbFiles;
    callback();
}

function loadBinaryFile()
{

    var file = "data/Deparis_data_binaire/part_start/part.00000.p00000";

    var xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange', onReadyStateChange, false);

    function onReadyStateChange()
    {
        if(xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0))
        {
            if (xhr.response)
            {
                var ab = xhr.response;
                var data = App.scripts[App.idScript].script(ab);
                onEveryLoadEnd(null, [data]);
            }
        }
    }

    xhr.open("GET", file, true);

    xhr.responseType = 'arraybuffer';

    xhr.send(null);

}
