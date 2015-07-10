/**
 * Created by lespingal on 10/07/15.
 */

/**
 *
 * @constructor
 * @description Data, with all the snapshot related to it and the current used snapshot
 */
App.Data = function(){
    this.nbSnapShot                 = 0;//Number of snapshot for this type of data
    this.posSnapShot                = 0;//Current position within the snapshots

    this.snapshots                  = [];
    this.departureArray             = null;
    this.currentPositionArray       = null;
    this.indexArray                 = null;
    this.directionArray             = null;
    this.color                      = null;

    this.currentOctree              = null;
};

/**
 * @description Compute the timed position within the currents snapshots
 */
App.Data.prototype.computePositions = function(){
    document.body.style.cursor = 'progress';
    App.timer.start();

    //linear interpolation between two snapshots
    var length = this.currentPositionArray.length / 3;
    var i;
    for(i = 0; i < length;i++) {
        this.currentPositionArray[i * 3] = this.departureArray[i * 3] + App.uniforms.t.value * this.directionArray[i * 3];
        this.currentPositionArray[i * 3 + 1] = this.departureArray[i * 3 + 1] + App.uniforms.t.value * this.directionArray[i * 3 + 1];
        this.currentPositionArray[i * 3 + 2] = this.departureArray[i * 3 + 2] + App.uniforms.t.value * this.directionArray[i * 3 + 2];
    }

    App.timer.stop("compute position");
    document.body.style.cursor = 'crosshair';
};

/**
 * @description Set the current snapshot
 * @param snapshot
 */
App.Data.prototype.changeSnapshot = function(snapshot){
    if(snapshot > 0 && snapshot < this.nbSnapShot){
        this.posSnapShot = snapshot;
        this.currentDeparture = this.snapshots[snapshot].position;
        this.currentDirection = this.snapshots[snapshot].direction;
        this.currentOctree = this.snapshots[snapshot].octree;
        this.computePositions();
    }else{
        console.log("Error : this snapshot doesn't exist.");
    }
};