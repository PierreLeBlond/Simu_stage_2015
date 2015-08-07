/**
 * Created by lespingal on 10/07/15.
 */

/**
 *  Global namespace
 *  @namespace
 */
var SIMU = SIMU || {};

/**
 * Represent a whole data set, with all the snapshot related to it and the current used snapshot
 * @constructor
 *
 * @property {boolean} isReady - True if at least one snapshot is ready, and is the current one
 * @property {Array} snapshots - Array of Snapshot object
 * @property Number of snapshot
 * @property Index of the current snapshot
 * @property Last files used to populate a snapshot
 * @property Number of files used to create last snapshot
 * @property Current script used to load data from files
 * @property Current buffer of point's departure, used for point animation
 * @property Current position of the points
 * @property Current buffer of the point index
 * @property Current buffer of point's directions, used for point animation
 * @property Current buffer of point's color
 * @property Current buffer of other information, used for information highlighting
 * @property Current used Octree
 * @property Maximum fraction of particle we can render to improve performance
 * @property Current time relative to the application
 * @property Loading bar, used for user feedback about loading time
 */
SIMU.Data = function(){
    this.isReady                    = false;                                    //** True if at least one snapshot is ready, and is the current one */

    this.snapshots                  = [];                                       //** Array of Snapshot object */
    this.nbSnapShot                 = 0;                                        //** Number of snapshot */
    this.currentSnapshotId          = -1;                                       //** Index of the current snapshot */

    this.files                      = 0;                                        //** Last files used to populate a snapshot */
    this.nbFiles                    = 0;                                        //** Number of files used to create last snapshot */
    this.script                     = null;                                     //** Current script used to load data from files */

    this.currentDeparture           = null;                                     //** Current buffer of point's departure, used for point animation */
    this.currentDepartureIsSet      = false;
    this.currentPositionArray       = null;                                     //** Current position of the points */
    this.currentPositionIsSet       = false;
    this.indexArray                 = null;                                     //** Current buffer of the point index */
    this.currentIndexIsSet          = false;
    this.currentDirection           = null;                                     //** Current buffer of point's directions, used for point animation */
    this.currentDirectionIsSet      = false;
    this.color                      = null;                                     //** Current buffer of point's color */
    this.currentColorIsSet          = null;
    this.currentInfo                = null;                                     //** Current buffer of other information, used for information highlighting */
    this.currentInfoIsSet           = null;

    this.currentOctree              = null;                                     //** Current used Octree */
    this.levelOfDetailMax           = 4;                                        //** Maximum fraction of particle we can render to improve performance */

    this.t                          = 0;                                        //** Current time relative to the application **/

    //TODO Find a better way to use loading bar, for we don't want UI element in this class
    this.loadBar                    = SIMU.LoadingBarSingleton.getInstance();   //** Loading bar, used for user feedback about loading time */
};

/**
 * Set current time, relative to the application and used to compute particle position
 * @param {float} t - New relative time
 */
SIMU.Data.prototype.setTime = function(t){
    this.t = t;
};

/**
 * Set the current script used to load data
 * @param {SIMU.Script} script - Current loading script
 */
SIMU.Data.prototype.setScript = function(script){
    this.script = script;
};

/**
 * Set the current snapshot index
 * @param {int} id - Current snapshot index
 */
SIMU.Data.prototype.setCurrentSnapshotId = function(id){
    this.currentSnapshotId = id;
};

/**
 * Add an empty snapshot
 */
SIMU.Data.prototype.addSnapshot = function(){
    var snapshot = new SIMU.Snapshot();
    this.snapshots.push(snapshot);
    this.nbSnapShot++;
};

/**
 * Compute the particle position within the current snapshot
 * //TODO Fix memory leak, occurring when switching between static and animated mode
 */
SIMU.Data.prototype.computePositions = function(){
    //linear interpolation between two snapshots
    var length = this.currentPositionArray.length / 3;
    var i;
    if(this.currentSnapshotId < (this.nbSnapShot - 1) && this.currentPositionIsSet && this.currentDepartureIsSet && this.currentDirectionIsSet) {
        for (i = 0; i < length; i++) {
            this.currentPositionArray[i * 3] = this.color[i * 3] = this.currentDeparture[i * 3] + this.t * this.currentDirection[i * 3];
            this.currentPositionArray[i * 3 + 1] = this.color[i * 3 + 1] = this.currentDeparture[i * 3 + 1] + this.t * this.currentDirection[i * 3 + 1];
            this.currentPositionArray[i * 3 + 2] = this.color[i * 3 + 2] = this.currentDeparture[i * 3 + 2] + this.t * this.currentDirection[i * 3 + 2];
        }
    }else if(this.currentPositionIsSet && this.currentDepartureIsSet){
        for (i = 0; i < length; i++) {
            this.currentPositionArray[i * 3] = this.currentDeparture[i * 3];
            this.currentPositionArray[i * 3 + 1] = this.currentDeparture[i * 3 + 1];
            this.currentPositionArray[i * 3 + 2] = this.currentDeparture[i * 3 + 2];
        }
        console.log("Direction isn't set");
    }else if(this.currentSnapshotId >= (this.nbSnapShot - 1)){
        console.log("Current snapshot doesn't exist");
    }else{
        console.log("Current position isn't set");
    }
};

/**
 * Change the current snapshot to the one with the given index
 * @param {int} snapshotId - wanted snapshot's index
 */
SIMU.Data.prototype.setCurrentSnapshot = function(snapshotId){
    if(snapshotId >= 0 && snapshotId < this.nbSnapShot){
        this.currentSnapshotId = snapshotId;
        if(this.snapshots[snapshotId].isReady) {
            this.isReady = true;

            this.currentDeparture = this.snapshots[snapshotId].position;
            this.currentDepartureIsSet = true;

            if(this.snapshots[snapshotId].directionIsSet) {
                this.currentDirectionIsSet = true;
                this.currentDirection = this.snapshots[snapshotId].direction;
            }else{
                this.currentDirectionIsSet = false;
            }

            this.computePositions();

            this.currentOctree = this.snapshots[snapshotId].octree;
            console.log("Success : change to snapshot " + snapshotId);
        }else{
            console.log("Warning : this snapshot is empty.");
            this.isReady = false;
        }
    }else{
        console.log("Error : this snapshot doesn't exist.");
    }
};

/**
 * @author Arnaud Steinmetz
 * Set a reader for a file and process data once FileReader has done his job.
 * @param {File} file - The file to read in
 * @param {function} callback - The function to call when all the data is read, to notify async "Hey ! We are done here !"
 */
SIMU.Data.prototype.readAdd = function(file, callback) {

    var that = this;
    var reader = new FileReader();

    reader.onerror = function (evt) {
        switch (evt.target.error.code) {
            case evt.target.error.NOT_FOUND_ERR:
                alert('File Not Found!');
                break;
            case evt.target.error.NOT_READABLE_ERR:
                alert('File is not readable');
                break;
            case evt.target.error.ABORT_ERR:
                alert('Reading interrupted');
                break;
            default:
                alert('An error occurred reading this file.');
        }
    };

    reader.onprogress = function (evt) {
    };

    reader.onabort = function (e) {
        alert('File read cancelled');
    };

    reader.onloadstart = function (e) {
    };

    reader.onload = function (e) {
    };

    /**
     * @author Arnaud Steinmetz <s.arnaud67@hotmail.fr>
     *
     * @description Function that will be called at the end of the loading phase.
     * @description Reads the file by using arrayBuffer and fill the right array depending on the position
     * @description This part of the reading is blocking the other when it is running (running back on the main thread -> not asynchronous)
     * @param {event} evt
     *
     */
    reader.onloadend = function (evt) {
        var file = evt.target;
        that.loadBar.domElement.value += 80/that.nbFiles;
        if (file.readyState == FileReader.DONE) {
            var data = that.script.script(file.result);
            callback(null, data);
        }else{
            callback(null, null);
        }
    };

    if(this.script.binary) {
        reader.readAsArrayBuffer(file);
    }else{
        reader.readAsBinaryString(file);
    }
};

/**
 * Get called when all the files have been loaded
 * @detail Populate the snapshot and modify other closed snapshot, and compute the octree & the right indexation
 * @param err - Errors that might have occurred
 * @param {Array} results - Array of all results retrieved from each loaded files
 */
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

        //prepare info buffer
        for (i = 0; i < results[0].length; i++) {
            var name = results[0][i].name;
            if (name != "position" && name != "color" && name != "index") {
                snap.info.push({name: name, value: new Float32Array(size), min:0, max:0});
            }
        }

        //prepare default color & index buffer
        var length = snap.color.length / 3;
        for (i = 0; i < length; i++) {
            snap.color[3 * i] = 1.0;
            snap.color[3 * i + 1] = 1.0;
            snap.color[3 * i + 2] = 1.0;
            snap.index[i] = i;
        }

        async.forEach(results, this.populateBuffer.bind(this), function () {

            //First compute the octree
            if ("undefined" == typeof(w)) {
                var w = new Worker("js/Class/octreeWorker.js");
                w.postMessage({
                    position: snap.position,
                    index: snap.index
                });
                w.onmessage = function (event) {

                    snap.index = event.data.index;
                    snap.octree = event.data.octree;

                    //Get new indexation according to LevelOfDetail
                    snap.index = that.computeLevelOfDetail(that.levelOfDetailMax, snap.index);
                    that.currentIndexIsSet = true;
                    that.indexArray = snap.index;

                    var position = new Float32Array(snap.position.length);

                    for(var j = 0; j < snap.info.length;j++){
                        snap.info[j].min = snap.info[j].value[0];
                        snap.info[j].max = snap.info[j].value[0];
                    }

                    //Then get the right indexation to match the octree, & search for the bounds of additional data
                    for(var i = 0; i < size; i++){
                        position[3*i] = snap.position[3*snap.index[i]];
                        position[3*i + 1] = snap.position[3*snap.index[i] + 1];
                        position[3*i + 2] = snap.position[3*snap.index[i] + 2];

                        //TODO index info buffer as well
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
                    that.currentPositionIsSet = true;

                    //If next snapshot is already available, compute the direction
                    if(that.currentSnapshotId + 1 < that.nbSnapShot && that.snapshots[that.currentSnapshotId + 1].isReady){
                        var nextSnapshot = that.snapshots[that.currentSnapshotId + 1];
                        for(i = 0; i < size;i++) {
                            snap.direction[3*nextSnapshot.index[i]] = nextSnapshot.position[3*i] - snap.position[3*nextSnapshot.index[i]];
                            snap.direction[3*nextSnapshot.index[i]+1] = nextSnapshot.position[3*i+1] - snap.position[3*nextSnapshot.index[i]+1];
                            snap.direction[3*nextSnapshot.index[i]+2] = nextSnapshot.position[3*i+2] - snap.position[3*nextSnapshot.index[i]+2];
                        }
                        snap.directionIsSet = true;
                        that.currentDirection = snap.direction;
                        that.currentDirectionIsSet = true;
                    }
                    //If there is a previous snapshot, compute its direction
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
                    snap.positionIsSet = true;

                    that.currentDeparture = snap.position;
                    that.currentDepartureIsSet = true;

                    that.color = snap.color;
                    that.currentColorIsSet = true;

                    that.currentOctree = snap.octree;

                    snap.isReady = true;
                    that.isReady = true;

                    that.loadBar.domElement.style.display = 'none';

                    w.terminate();
                    w = null;
                }
            }
        });
    }else{
        console.log("Error, snapshot doesn't exist, can't push data");
    }
};

/**
 * @description Handle file selection and start loading phase
 * @param evt
 */
SIMU.Data.prototype.handleFileSelect = function(evt) {
    var files = evt.target.files;
    this.nbFiles = files.length;

    this.loadBar.domElement.value = 0;
    this.loadBar.domElement.style.display = 'block';

    async.map(files, this.readAdd.bind(this), this.onEveryLoadEnd.bind(this));
};

/**
 * @description Populate the already created buffer with a part of the data providing by one of the file
 * @detail this function will be called for each of the loaded file
 * @param data Result from a reading file
 * @param {function} callback - Function to call when populating buffer is done, to notify async that, like, you know, it's done
 */
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
                    for(i = 0; i < length;i++)
                    {
                        index = indexes[i];
                        snap.position[index*3]=position[3*i];
                        snap.position[index*3 + 1]=position[3*i + 1];
                        snap.position[index*3 + 2]=position[3*i + 2];
                    }
                position = null;    //let's free some memory as fast as possible, shall we ?
                break;
            case "color" :
                    value = data[j].value;
                    var color = snap.color;
                    for (i = 0; i < length; i++) {
                        index = data[0].value[i];
                        color[index*3] = value[i*3];
                        color[index*3 + 1] = value[i*3 + 1];
                        color[index*3 + 2] = value[i*3 + 2];
                    }
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
                    for(i = 0; i < length;i++){
                        index = indexes[i];
                        info[index] = value[i];
                    }
                value = null;
                break;
        }
    }
    this.loadBar.domElement.value += 20/this.nbFiles;
    callback(); //Let's notify async that we are done here
};

/**
 * Change an index array to a structure easily usable for level of detail rendering
 * @detail Makes different part of the array, for example, with a level of detail of 2 : [1, 2, 3, 4, 5, 6, 7, 8] -> [1, 3, 5, 7, 2, 4, 6, 8]
 * With that, we can render one point of two with a draw call to the four first elements, while keeping the order and a certain homogeneity.
 * @param {int} levelOfDetail - The wanted lod, the more it is, the more we will be able to diminish the number of point rendered on screen
 * @param {Float32Array} indexArray - The index array to change
 * @returns {Float32Array} - The new index array
 */
SIMU.Data.prototype.computeLevelOfDetail = function(levelOfDetail, indexArray){
    var length = indexArray.length;
    var index = new Float32Array(length);

    var loop = length/levelOfDetail;
    for(var i = 0; i < loop;i++){
        for(var j = 0; j < levelOfDetail;j++){
            index[i + j*loop] = indexArray[i*levelOfDetail + j];
        }
    }
    return index;
};