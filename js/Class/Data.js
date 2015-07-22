/**
 * Created by lespingal on 10/07/15.
 */
var SIMU = SIMU || {};

/**
 *
 * @constructor
 * @description Data, with all the snapshot related to it and the current used snapshot
 */
SIMU.Data = function(){
    this.isReady                    = false;

    this.nbSnapShot                 = 0;//Number of snapshot for this type of data
    this.currentSnapshotId          = -1;//Current position within the snapshots

    this.files                      = 0;
    this.nbFiles                    = 0;
    this.script                     = null;

    this.snapshots                  = [];
    this.currentDeparture           = null;
    this.currentPositionArray       = null;
    this.indexArray                 = null;
    this.currentDirection           = null;
    this.color                      = null;

    this.currentOctree              = null;
};

SIMU.Data.prototype.setScript = function(script){
    this.script = script;
};

SIMU.Data.prototype.setCurrentSnapshotId = function(id){
    this.currentSnapshotId = id;
};

SIMU.Data.prototype.addSnapshot = function(){
    var snapshot = new SIMU.Snapshot();
    this.snapshots.push(snapshot);
    this.nbSnapShot++;
};

/**
 * @description Compute the timed position within the currents snapshots
 */
SIMU.Data.prototype.computePositions = function(){
    document.body.style.cursor = 'progress';

    //linear interpolation between two snapshots
    var length = this.currentPositionArray.length / 3;
    var i;
    if(this.snapshots[this.currentSnapshotId].directionIsSet) {
        for (i = 0; i < length; i++) {
            this.currentPositionArray[i * 3] = this.currentDeparture[i * 3] + SIMU.parameters.t * this.currentDirection[i * 3];
            this.currentPositionArray[i * 3 + 1] = this.currentDeparture[i * 3 + 1] + SIMU.parameters.t * this.currentDirection[i * 3 + 1];
            this.currentPositionArray[i * 3 + 2] = this.currentDeparture[i * 3 + 2] + SIMU.parameters.t * this.currentDirection[i * 3 + 2];
        }
    }else{
        for (i = 0; i < length; i++) {
            this.currentPositionArray[i * 3] = this.currentDeparture[i * 3];
            this.currentPositionArray[i * 3 + 1] = this.currentDeparture[i * 3 + 1];
            this.currentPositionArray[i * 3 + 2] = this.currentDeparture[i * 3 + 2];
        }
    }

    document.body.style.cursor = 'crosshair';
};

/**
 * @description Set the current snapshot
 * @param snapshot
 */
SIMU.Data.prototype.changeSnapshot = function(snapshot){
    if(snapshot >= 0 && snapshot < this.nbSnapShot){
        this.currentSnapshotId = snapshot;
        if(this.snapshots[snapshot].isReady) {
            this.currentDeparture = this.snapshots[snapshot].position;
            if(this.snapshots[snapshot].directionIsSet) {
                this.currentDirection = this.snapshots[snapshot].direction;
            }
                this.computePositions();
            this.currentOctree = this.snapshots[snapshot].octree;
            console.log("Success : change to snapshot " + snapshot);
        }else{//For the moment, when the snapshot is empty, we let the previous snapshot as the current one
            console.log("Warning : this snapshot is empty.");
        }
    }else{
        console.log("Error : this snapshot doesn't exist.");
    }
};

/**
 * @author Arnaud Steinmetz
 * @description Sets a reader for each file selected
 * @param {FileList} files - List of the file selected.
 * @param {int} numFile - Number of the file that is read.
 */
SIMU.Data.prototype.readAdd = function(file, callback) {
    var that = this;
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
        document.getElementById('fileLoadingProgress').value += 50/that.nbFiles;
        //Checking if the file has correctly been read
        if (file.readyState == FileReader.DONE) {
            var data = that.script.script(file.result);
            callback(null, data);
        }else{
            callback(null, null);
        }
    };
    // Read in the file as a ArrayBuffer.
    if(this.script.binary) {
        reader.readAsArrayBuffer(file);
    }else{
        reader.readAsBinaryString(file);
    }
};

SIMU.Data.prototype.onEveryLoadEnd = function(err, results){

    var that = this;

    if(this.currentSnapshotId < this.snapshots.length) {

        var snap = this.snapshots[this.currentSnapshotId];

        var size = 0;
        for (var i = 0; i < results.length; i++) {
            size += results[i][0].value.length;
        }

        snap.color = new Float32Array(size * 3);
        snap.position = new Float32Array(size * 3);
        snap.direction = new Float32Array(size * 3);
        snap.index = new Float32Array(size);

        //prepare info buffers
        for (i = 0; i < results[0].length; i++) {
            var name = results[0][i].name;
            if (name != "position" && name != "color" && name != "index") {
                snap.info.push({name: name, value: new Float32Array(size), min:0, max:0});
            }
        }

        var length = snap.color.length / 3;
        for (i = 0; i < length; i++) {
            snap.color[3 * i] = 1.0;
            snap.color[3 * i + 1] = 1.0;
            snap.color[3 * i + 2] = 1.0;
            snap.index[i] = i;
        }

        async.forEach(results, this.populateBuffer.bind(this), function () {

            if (typeof(w) == "undefined") {
                var w = new Worker("js/octreeWorker.js");
                w.postMessage({
                    position: snap.position,
                    index: snap.index
                });
                w.onmessage = function (event) {

                    snap.index = event.data.index;
                    snap.octree = event.data.octree;

                    //Index buffer according to new indexation
                    var position = new Float32Array(snap.position.length);

                    for(var j = 0; j < snap.info.length;j++){
                        snap.info[j].min = snap.info[j].value[0];
                        snap.info[j].max = snap.info[j].value[0];
                    }

                    for(var i = 0; i < position.length / 3; i++){
                        position[3*i] = snap.position[3*snap.index[i]];
                        position[3*i + 1] = snap.position[3*snap.index[i] + 1];
                        position[3*i + 2] = snap.position[3*snap.index[i] + 2];
                        for(j = 0; j < snap.info.length;j++){
                            if(snap.info[j].min > snap.info[j].value[i]){
                                snap.info[j].min = snap.info[j].value[i];
                            }
                            if(snap.info[j].max < snap.info[j].value[i]){
                                snap.info[j].max = snap.info[j].value[i];
                            }
                        }
                    }

                    that.currentPositionArray = new Float32Array(size*3);
                    for(i = 0; i < size*3;i++){
                        that.currentPositionArray[i] = position[i];
                    }

                    //If next snapshot is already available
                    if(that.currentSnapshotId + 1 < that.nbSnapShot && that.snapshots[that.currentSnapshotId + 1].isReady){
                        var nextSnapshot = that.snapshots[that.currentSnapshotId + 1];
                        console.log("coucou");
                        for(i = 0; i < size;i++) {
                            snap.direction[3*nextSnapshot.index[i]] = nextSnapshot.position[3*i] - snap.position[3*nextSnapshot.index[i]];
                            snap.direction[3*nextSnapshot.index[i]+1] = nextSnapshot.position[3*i+1] - snap.position[3*nextSnapshot.index[i]+1];
                            snap.direction[3*nextSnapshot.index[i]+2] = nextSnapshot.position[3*i+2] - snap.position[3*nextSnapshot.index[i]+2];
                        }
                        snap.directionIsSet = true;
                        that.currentDirection = snap.direction;
                    }
                    //If there is a previous snapshot
                    if(that.currentSnapshotId > 0 && that.snapshots[that.currentSnapshotId - 1].isReady){
                        var previousSnapshot = that.snapshots[that.currentSnapshotId - 1];
                        for(i = 0; i < size;i++) {
                            previousSnapshot.direction[3*i] = snap.position[3*previousSnapshot.index[i]] - previousSnapshot.position[3*i];
                            previousSnapshot.direction[3*i+1] = snap.position[3*previousSnapshot.index[i]+1] - previousSnapshot.position[3*i+1];
                            previousSnapshot.direction[3*i+2] = snap.position[3*previousSnapshot.index[i]+2] - previousSnapshot.position[3*i+2];
                        }
                        previousSnapshot.directionIsSet = true;
                    }
                    snap.position = position;

                    that.currentDeparture = snap.position;
                    that.color = snap.color;
                    that.currentOctree = snap.octree;

                    snap.isReady = true;
                    that.isReady = true;

                    document.getElementById('fileLoadingProgress').style.display = 'none';

                    w.terminate();
                    w = null;
                }
            }
        });
    }else{
        console.log("Error, snapshot doesn't exist, can't push data");
    }
};

SIMU.Data.prototype.handleFileSelect = function(evt) {
    var files = evt.target.files;
    this.nbFiles = files.length;

    document.getElementById('fileLoadingProgress').value = 0;
    document.getElementById('fileLoadingProgress').style.display = 'block';

    async.map(files, this.readAdd.bind(this), this.onEveryLoadEnd.bind(this));
};

SIMU.Data.prototype.populateBuffer = function(data, callback){
    var i;
    var j;
    var snap = this.snapshots[this.currentSnapshotId]; //The new snapshot is already created, but nbSnapShot isn't up to date yet
    for(j = 1;j < data.length;j++){
        var index;
        var value;
        var indexes = data[0].value;
        var length = indexes.length;
        switch(data[j].name){
            case "position" :
                var position = data[j].value;
                //if(SIMU.currentSnapshotId == 0){
                    for(i = 0; i < length;i++)
                    {
                        index = indexes[i];
                        snap.position[index*3]=position[3*i];
                        snap.position[index*3 + 1]=position[3*i + 1];
                        snap.position[index*3 + 2]=position[3*i + 2];
                    }
               /* }
                else
                {
                    var previousSnap = this.snapshots[this.nbSnapShot - 1];
                    for(i = 0; i < length;i++)
                    {
                        index = indexes[i];

                        var x = position[3*i];
                        var y = position[3*i+1];
                        var z = position[3*i+2];

                        var dx = x-previousSnap.position[index*3];
                        var dy = y-previousSnap.position[index*3+1];
                        var dz = z-previousSnap.position[index*3+2];

                        //Correcting the vector direction for the elements going outside the box
                        //To be exact, you can check in the shader if the position goes outside the box, then you change it. Instead of doing that here.
                        if(dx > 0.5)
                        {
                            previousSnap.position[index*3]+=1;
                            dx = -(previousSnap.position[index*3]-x);
                        }
                        else if(dx < -0.5)
                        {
                            previousSnap.position[index*3]-=1;
                            dx = -(previousSnap.position[index*3]-x);
                        }


                        if(dy > 0.5)
                        {
                            previousSnap.position[index*3+1]+=1;
                            dy = -(previousSnap.position[index*3+1]-y);
                        }
                        else if(dy < -0.5)
                        {
                            previousSnap.position[index*3+1]-=1;
                            dy = -(previousSnap.position[index*3+1]-y);
                        }


                        if(dz > 0.5)
                        {
                            previousSnap.position[index*3+2]+=1;
                            dz = -(previousSnap.position[index*3+2]-z);
                        }
                        else if(dz < -0.5)
                        {
                            previousSnap.position[index*3+2]-=1;
                            dz = -(previousSnap.position[index*3+2]-z);
                        }

                        previousSnap.direction[index*3]= dx;
                        previousSnap.direction[index*3+1]= dy;
                        previousSnap.direction[index*3+2]= dz;

                        snap.position[index*3]= x;
                        snap.position[index*3+1]= y;
                        snap.position[index*3+2]= z;
                    }
                }*/
                position = null;    //let's free some memory as fast as possible, shall we ?
                break;
            case "color" : // Here we populate colors and infos buffer for each snapshot, but maybe we only need them once
                    value = data[j].value;
                    var color = snap.color;
                    for (i = 0; i < length; i++) {
                        index = data[0].value[i];
                        color[index*3] = value[i*3];
                        color[index*3 + 1] = value[i*3 + 1];
                        color[index*3 + 2] = value[i*3 + 2];
                    }
                    //App.staticBufferGeometryPointCloud.geometry.attributes.color.needsUpdate = true;
                    value = null;
                break;
            default :
                    value = data[j].value;
                    var name = data[j].name;
                    for(i = 0;i < snap.info.length;i++){
                        if(name == snap.info[i].name){
                            var info = snap.info[i].value;
                        }
                    }
                    for(i = 0; i < length;i++){//TODO handle case with multiple value for only one index
                        index = indexes[i];
                        info[index] = value[i];
                    }
                break;
        }
    }
    document.getElementById('fileLoadingProgress').value += 50/this.nbFiles;
    callback(); //Let's notify async that we are done here
};