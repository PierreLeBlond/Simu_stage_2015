/**
 * Created by lespingal on 12/06/15.
 */

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
    console.log("size : " + size);

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
        App.data.indexArray = new Float32Array(size);
        App.data.positionsArray.push(new Float32Array(size * 3));

        //prepare info buffers
        for(i = 0;i < results[0].length;i++){
            var name = results[0][i].name;
           if(name != "position" && name != "color" && name != "index"){
               App.data.info.push({"name":name, "value":new Float32Array(size)});
           }
        }


        var length = App.data.color.length / 3;
        for (i = 0; i < length; i++) {
            App.data.color[3 * i] = 1.0;
            App.data.color[3 * i + 1] = 1.0;
            App.data.color[3 * i + 2] = 1.0;
            App.data.indexArray[i] = i;
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

        if(App.parameters.nbSnapShot == 0) {

            if (typeof(w) == "undefined") {
                App.timer.start();
                var w = new Worker("js/octreeWorker.js");
                w.postMessage({
                    position: App.data.currentPositionArray,
                    index: App.data.indexArray
                });
                w.onmessage = function (event) {

                    App.timer.stop("finish octree");
                    App.data.indexArray = event.data.index;
                    App.octree = event.data.octree;

                    if (App.WIREFRAME) {
                        displayBox(App.octree);
                    }

                    App.timer.start();
                    loadData();
                    App.timer.stop("Load Data");
                    App.parameters.nbSnapShot++;
                    App.parameters.posSnapShot = 0;
                    document.getElementById('fileLoadingProgress').style.display = 'none';

                    w.terminate();
                    w = null;
                }
            }
        }else{
            App.timer.start();
            loadData();
            App.timer.stop("Load Data");
            App.parameters.nbSnapShot++;
            App.parameters.posSnapShot = 0;
            document.getElementById('fileLoadingProgress').style.display = 'none';
        }
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

        var data = null;

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

        }
        //Setting the event change on the file input to launch the function handleFileSelect
        document.getElementById('files').addEventListener('change', handleFileSelect, false);
        document.getElementById('browse_button').addEventListener('click', function(){
            document.getElementById('files').click();}, false);

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
        var value;
        var indexes = data[0].value;
        var length = indexes.length;
        switch(data[j].name){
            case "position" :
                var position = data[j].value;
                if(App.parameters.nbSnapShot == 0){
                    for(i = 0; i < length;i++)
                    {
                        index = indexes[i];
                        App.data.positionsArray[0][index*3]=App.data.currentPositionArray[index*3]=position[3*i];
                        App.data.positionsArray[0][index*3 + 1]=App.data.currentPositionArray[index*3 + 1]=position[3*i + 1];
                        App.data.positionsArray[0][index*3 + 2]=App.data.currentPositionArray[index*3 + 2]=position[3*i + 2];
                    }
                }
                else
                {
                    for(i = 0; i < length;i++)
                    {
                        index = indexes[i];

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
                        App.data.positionsArray[App.parameters.nbSnapShot][index*3+1]= y;
                        App.data.positionsArray[App.parameters.nbSnapShot][index*3+2]= z;
                    }
                }
                position = null;    //let's free some memory as fast as possible, shall we ?
                break;
            case "color" :
                if(App.parameters.nbSnapShot == 0) {
                    value = data[j].value;
                    var color = App.data.color;
                    for (i = 0; i < length; i++) {
                        index = data[0].value[i];
                        color[index*3] = value[i*3];
                        color[index*3 + 1] = value[i*3 + 1];
                        color[index*3 + 2] = value[i*3 + 2];
                    }
                    //App.staticBufferGeometryPointCloud.geometry.attributes.color.needsUpdate = true;
                    value = null;
                }
                break;
            default :
                if(App.parameters.nbSnapShot == 0){
                    value = data[j].value;
                    var name = data[j].name;
                    for(i = 0;i < App.data.info.length;i++){
                        if(name == App.data.info[i].name){
                            var info = App.data.info[i].value;
                        }
                    }
                    for(i = 0; i < length;i++){//TODO handle case with multiple value for only one index
                        index = indexes[i];
                        info[index] = value[i];
                    }
                }
                break;
        }
    }
    document.getElementById('fileLoadingProgress').value += 50/App.nbFiles;
    callback();
}

function loadBinaryFile(file, callback)
{

    App.timer.start();

    var result = undefined;

    var xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange', onReadyStateChange, false);

    function onReadyStateChange()
    {
        if(xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0))
        {
            if (xhr.response)
            {
                var ab = xhr.response;
                data = App.scripts[App.idScript].script(ab);
                callback(null, data);
            }
            else
            {
                console.log("Un fichier n'a pas été chargé correctement !");
                callback(null, null);
            }
        }
    }

    xhr.open("GET", file, true);

    xhr.responseType = 'arraybuffer';

    xhr.send(null);

}

function loadBinaryFiles(files)
{
    async.map(files, loadBinaryFile, onEveryLoadEnd);
}

App.startFiles = [];

for (var i = 0; i < 128; i++)
{
    if (i < 10)
        App.startFiles[i] = "data/Deparis_data_binaire/part_end/part.00010.p0000" + i;
    else if (i < 100)
        App.startFiles[i] = "data/Deparis_data_binaire/part_end/part.00010.p000" + i;
    else
        App.startFiles[i] = "data/Deparis_data_binaire/part_end/part.00010.p00" + i;
}
