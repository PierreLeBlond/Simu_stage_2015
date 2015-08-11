/**
 * Created by lespingal on 08/07/15.
 */

importScripts('../lib/async.js');
importScripts('Octree.js');

onmessage = function(e){
    console.log("message received");
    var position = e.data.position;
    var indexArray = e.data.index;
    var octree = new SIMU.Octree();
    var new_indexes = octree.createOctreeFromPos(position, indexArray);
    //We only return indexArray, as a buffer transfert. It's cheaper, but remember that while we are within the worker, the main thread has no longer access to the index buffer
    //The position is just read-only data. The fact is that writing into the position buffer is too expensive and time costing - the app crashed several time -. Better rearrange the buffer once we get back to the main thread.
    postMessage({octree:octree, index:new_indexes}, [new_indexes.buffer]);
};
