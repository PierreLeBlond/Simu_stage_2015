/**
 * Created by lespingal on 10/07/15.
 */

/**
 *
 * @constructor
 */
App.Snapshot = function(){
    this.position       = null;
    this.direction      = null;
    this.index          = null;
    this.color          = null;

    this.octree         = null;

    this.info           = [];
};

/**
 * @description
 */
App.Snapshot.prototype.createOctree = function(){

    if (typeof(w) == "undefined") {
        App.timer.start();
        var w = new Worker("js/octreeWorker.js");
        w.postMessage({
            position: this.position,
            index: this.index
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
};