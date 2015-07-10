/**
 * Created by lespingal on 10/07/15.
 */



/**
 * @description compute octree based on current position and indexes
 * @detail use WebWorker, therefore access at current position and indexes won't be available during the process
 * TODO switch to no WebWorker to ensure browser compatibility
 */
function computeOctree(){
    if(typeof(w) == "undefined"){
        App.timer.start();
        var w = new Worker("js/octreeWorker.js");
        w.postMessage({position:App.data.currentPositionArray, index:App.data.indexArray}, [App.data.currentPositionArray.buffer, App.data.indexArray.buffer]);//TODO improve with use of transferable
        w.onmessage = function(event){

            App.timer.stop("finish octree");
            App.data.currentPositionArray = event.data[0];
            App.data.indexArray = event.data[1];
            App.octree = event.data[2];

            w.terminate();
        }
    }
    App.timer.stop("Computing octree");
}