/**
 * Created by lespingal on 08/07/15.
 */

importScripts('../../lib/async.js');

var octree = null;
var position = null;
var indexArray = null;

var Octree = function(){
    this.child = [];
    this.box = null;
    this.hasChild = false;
    this.start = 0;
    this.count = 0;
};

function createOctreeFromPos(positions, indexes){
    octree = new Octree();

    function coupeDecale(octant, offsets){

        if(octant < 8){
            coupeDecale(octant+1, offsets);
            offsets[octant].max++;
            positions[3*offsets[octant.max]] = positions[3*offsets[octant.min]];
            positions[3*offsets[octant.max] + 1] = positions[3*offsets[octant.min] + 1];
            positions[3*offsets[octant.max] + 2] = positions[3*offsets[octant.min] + 2];
            offsets[octant].min++;
        }
    }

    function swap(octant, offsets, index){
        var tmpX = positions[3*offsets[octant].min];
        var tmpY = positions[3*offsets[octant].min + 1];
        var tmpZ = positions[3*offsets[octant].min + 2];
        positions[3*offsets[octant].min] = positions[3*index];
        positions[3*offsets[octant].min + 1] = positions[3*index + 1];
        positions[3*offsets[octant].min + 2] = positions[3*index + 2];

        coupeDecale(octant + 1, offsets);

        offsets[octant].max++;
        positions[3*offsets[octant].max] = tmpX;
        positions[3*offsets[octant].max + 1] = tmpY;
        positions[3*offsets[octant].max + 2] = tmpZ;
    }


    function fillOctreeWithoutCopy(octree, start, count, iter, box){
        octree.box = box;
        octree.start = start;
        octree.count = count;

        if(octree.count/3 > 100000 && iter < 5){
            octree.hasChild = true;

            console.log(iter);

            var i;

            for(i = 0; i < 8;i++){
                octree.child.push(new Octree());
            }

            var offsets = [{min : start, max : start}, {min : start, max : start}, {min : start, max : start}, {min : start, max : start}, {min : start, max : start}, {min : start, max : start}, {min : start, max : start}, {min : start, max : start}];


            var xMin = box.xMin;
            var xMax = box.xMax;
            var yMin = box.yMin;
            var yMax = box.yMax;
            var zMin = box.zMin;
            var zMax = box.zMax;

            var xMid = (xMin + xMax) / 2;
            var yMid = (yMin + yMax) / 2;
            var zMid = (zMin + zMax) / 2;

            var x = 0;
            var y = 0;
            var z = 0;

            //    y
            //     |
            //     8----4
            // 7----3   |
            // |    |   |
            // |   6|- -2__x
            // 5----1
            ///
            //z

            for (i = start; i < start + count; i++) {
                x = position[3 * i];
                y = position[3 * i + 1];
                z = position[3 * i + 2];
                if (x < xMid) {
                    if (y < yMid) {
                        if (z < zMid) {
                            swap(5, offsets, i);
                        } else {
                            swap(4, offsets, i);
                        }
                    } else {
                        if (z < zMid) {
                            swap(7, offsets, i);
                        } else {
                            swap(8, offsets, i);
                        }
                    }
                } else {
                    if (y < yMid) {
                        if (z < zMid) {
                            swap(1, offsets, i);
                        } else {
                            swap(0, offsets, i);
                        }
                    } else {
                        if (z < zMid) {
                            swap(3, offsets, i);
                        } else {
                            swap(2, offsets, i);
                        }
                    }
                }
            }

            var boxes = [{xMin:xMid, xMax:xMax, yMin:yMin, yMax:yMid, zMin:zMid, zMax:zMax},
                {xMin:xMid, xMax:xMax, yMin:yMin, yMax:yMid, zMin:zMin, zMax:zMid},
                {xMin:xMid, xMax:xMax, yMin:yMid, yMax:yMax, zMin:zMid, zMax:zMax},
                {xMin:xMid, xMax:xMax, yMin:yMid, yMax:yMax, zMin:zMin, zMax:zMid},
                {xMin:xMin, xMax:xMid, yMin:yMin, yMax:yMid, zMin:zMid, zMax:zMax},
                {xMin:xMin, xMax:xMid, yMin:yMin, yMax:yMid, zMin:zMin, zMax:zMid},
                {xMin:xMin, xMax:xMid, yMin:yMid, yMax:yMax, zMin:zMid, zMax:zMax},
                {xMin:xMin, xMax:xMid, yMin:yMid, yMax:yMax, zMin:zMin, zMax:zMid}];

            for(i=0;i<8;i++){
                fillOctreeWithoutCopy(octree.child[i], offsets[i].min, offsets[i].max, iter+1, boxes[i]);
            }
        }
    }


    /**
     * @description
     * @param array array of point
     * @param octree Octree object
     * @param start position in parent's array
     * @param iter current iteration of the algorithm
     * @param box xmin, xmax, ymin, etc
     */
    function fillOctree(indexes, octree, start, count, iter, box){

        octree.box = box;
        octree.start = start;
        octree.count = count;

        var i;


        //if(iter < 3) {
        if(octree.count > 1000 && iter < 5){
            octree.hasChild = true;


            /*var positionArray = new Float32Array(array.length);
             for(i = 0;i < array.length;i++){
             positionArray[i] = array[i];
             }*/

            for(i = 0; i < 8;i++){
                octree.child.push(new Octree());
            }

            var index = [[], [], [], [], [], [], [], []];

            var xMin = box.xMin;
            var xMax = box.xMax;
            var yMin = box.yMin;
            var yMax = box.yMax;
            var zMin = box.zMin;
            var zMax = box.zMax;

            var xMid = (xMin + xMax) / 2;
            var yMid = (yMin + yMax) / 2;
            var zMid = (zMin + zMax) / 2;

            var x = 0;
            var y = 0;
            var z = 0;

            //    y
            //     |
            //     8----4
            // 7----3   |
            // |    |   |
            // |   6|- -2__x
            // 5----1
            ///
            //z
            //var stop = start + count;
            var j;
            for (i = 0; i < count; i++) {
                j = indexes[i];
                x = position[3 * j];
                y = position[3 * j + 1];
                z = position[3 * j + 2];
                if (x < xMid) {
                    if (y < yMid) {
                        if (z < zMid) {
                            index[5].push(j);
                        } else {
                            index[4].push(j);
                        }
                    } else {
                        if (z < zMid) {
                            index[7].push(j);
                        } else {
                            index[6].push(j);
                        }
                    }
                } else {
                    if (y < yMid) {
                        if (z < zMid) {
                            index[1].push(j);
                        } else {
                            index[0].push(j);
                        }
                    } else {
                        if (z < zMid) {
                            index[3].push(j);
                        } else {
                            index[2].push(j);
                        }
                    }
                }
            }


            var offsets = [start, 0, 0, 0, 0, 0, 0, 0];

            var boxes = [{xMin:xMid, xMax:xMax, yMin:yMin, yMax:yMid, zMin:zMid, zMax:zMax},
                {xMin:xMid, xMax:xMax, yMin:yMin, yMax:yMid, zMin:zMin, zMax:zMid},
                {xMin:xMid, xMax:xMax, yMin:yMid, yMax:yMax, zMin:zMid, zMax:zMax},
                {xMin:xMid, xMax:xMax, yMin:yMid, yMax:yMax, zMin:zMin, zMax:zMid},
                {xMin:xMin, xMax:xMid, yMin:yMin, yMax:yMid, zMin:zMid, zMax:zMax},
                {xMin:xMin, xMax:xMid, yMin:yMin, yMax:yMid, zMin:zMin, zMax:zMid},
                {xMin:xMin, xMax:xMid, yMin:yMid, yMax:yMax, zMin:zMid, zMax:zMax},
                {xMin:xMin, xMax:xMid, yMin:yMid, yMax:yMax, zMin:zMin, zMax:zMid}];

            /*offsets[5] = start;
            offsets[4] = offsets[5] + index[5].length;
            offsets[7] = offsets[4] + index[4].length;
            offsets[6] = offsets[7] + index[7].length;
            offsets[1] = offsets[6] + index[6].length;
            offsets[0] = offsets[1] + index[1].length;
            offsets[3] = offsets[0] + index[0].length;
            offsets[2] = offsets[3] + index[3].length;*/

            for(i=1 ; i < 8;i++){
                offsets[i] = offsets[i-1] + index[i - 1].length;
            }

            for(i=0;i<8;i++){
                fillOctree(index[i], octree.child[i], offsets[i], index[i].length, iter+1, boxes[i]);
                index[i] = null;
            }

            /*async.forEach([0, 1, 2, 3, 4, 5, 6, 7], function(i, callback){
                fillOctreeFast(index[i], octree.child[i], offsets[i], index[i].length, iter+1, boxes[i]);
                index[i] = null;
                callback();
            }, function(err){
            });*/

        }else{
            //var tmp = [];//new Float32Array((start + count)*3);
            /*for(i = 0; i < start + count;i++){
                tmp.push(position[3*i]);
                tmp.push(position[3*i + 1]);
                tmp.push(position[3*i + 2]);
            }*/
            for(i = 0;i < indexes.length;i++){
                //var id = indexes[i];
                /*position[3*(i + start)] = tmp[3*id];
                position[3*(i + start) + 1] = tmp[3*id + 1];
                position[3*(i + start) + 2] = tmp[3*id + 2];*/
                indexArray[i + start] = indexes[i];
            }

            indexes = null;
            //tmp = null;
        }
    }

    /**
     * @description
     * @param array array of point
     * @param octree Octree object
     * @param start position in parent's array
     * @param iter current iteration of the algorithm
     * @param box xmin, xmax, ymin, etc
     */
    function fillOctreeFast(array, indexs, octree, start, iter, box){

        var length = array.length/3;

        octree.box = box;
        octree.start = start;
        octree.count = length;

        //if(iter < 3) {
        if(octree.count > 1000 && iter < 5){
            octree.hasChild = true;


            var i;

            /*var positionArray = new Float32Array(array.length);
             for(i = 0;i < array.length;i++){
             positionArray[i] = array[i];
             }*/


            for(i = 0; i < 8;i++){
                octree.child.push(new Octree());
            }

            var part = [[], [], [], [], [], [], [], []];
            var index = [[], [], [], [], [], [], [], []];

            var xMin = box.xMin;
            var xMax = box.xMax;
            var yMin = box.yMin;
            var yMax = box.yMax;
            var zMin = box.zMin;
            var zMax = box.zMax;

            var xMid = (xMin + xMax) / 2;
            var yMid = (yMin + yMax) / 2;
            var zMid = (zMin + zMax) / 2;

            var x = 0;
            var y = 0;
            var z = 0;

            //    y
            //     |
            //     8----4
            // 7----3   |
            // |    |   |
            // |   6|- -2__x
            // 5----1
            ///
            //z
            for (i = 0; i < length; i++) {
                x = array[3 * i];
                y = array[3 * i + 1];
                z = array[3 * i + 2];
                if (x < xMid) {
                    if (y < yMid) {
                        if (z < zMid) {
                            part[5].push(x);
                            part[5].push(y);
                            part[5].push(z);
                            index[5].push(i);
                        } else {
                            part[4].push(x);
                            part[4].push(y);
                            part[4].push(z);
                            index[4].push(i);
                        }
                    } else {
                        if (z < zMid) {
                            part[7].push(x);
                            part[7].push(y);
                            part[7].push(z);
                            index[7].push(i);
                        } else {
                            part[6].push(x);
                            part[6].push(y);
                            part[6].push(z);
                            index[6].push(i);
                        }
                    }
                } else {
                    if (y < yMid) {
                        if (z < zMid) {
                            part[1].push(x);
                            part[1].push(y);
                            part[1].push(z);
                            index[1].push(i);
                        } else {
                            part[0].push(x);
                            part[0].push(y);
                            part[0].push(z);
                            index[0].push(i);
                        }
                    } else {
                        if (z < zMid) {
                            part[3].push(x);
                            part[3].push(y);
                            part[3].push(z);
                            index[3].push(i);
                        } else {
                            part[2].push(x);
                            part[2].push(y);
                            part[2].push(z);
                            index[2].push(i);
                        }
                    }
                }
            }

            var boxes = [{xMin:xMid, xMax:xMax, yMin:yMin, yMax:yMid, zMin:zMid, zMax:zMax},
                {xMin:xMid, xMax:xMax, yMin:yMin, yMax:yMid, zMin:zMin, zMax:zMid},
                {xMin:xMid, xMax:xMax, yMin:yMid, yMax:yMax, zMin:zMid, zMax:zMax},
                {xMin:xMid, xMax:xMax, yMin:yMid, yMax:yMax, zMin:zMin, zMax:zMid},
                {xMin:xMin, xMax:xMid, yMin:yMin, yMax:yMid, zMin:zMid, zMax:zMax},
                {xMin:xMin, xMax:xMid, yMin:yMin, yMax:yMid, zMin:zMin, zMax:zMid},
                {xMin:xMin, xMax:xMid, yMin:yMid, yMax:yMax, zMin:zMid, zMax:zMax},
                {xMin:xMin, xMax:xMid, yMin:yMid, yMax:yMax, zMin:zMin, zMax:zMid}];


            var offsets = [start, 0, 0, 0, 0, 0, 0, 0];

            for(i = 1; i < 8; i++){
                offsets[i] = offsets[i - 1] + part[i - 1].length/3;
            }


            async.forEach([0, 1, 2, 3, 4, 5, 6, 7], function(i, callback){
                fillOctreeFast(part[i], index[i], octree.child[i], offsets[i], iter+1, boxes[i]);
                callback();
            }, function(err){
            });

            /*for(i=0;i<8;i++){
             fillOctreeFast(part[i], index[i], octree.child[i], offsets[i], iter+1, boxes[i]);
             }*/

            /*var finish = false;

             async.forEach([0, 1, 2, 3, 4, 5, 6, 7], function(i, callback){
             fillOctree(part[i], index[i], octree.child[i], start + offsets[i], iter+1, boxes[i]);
             callback();
             }, function(err){
             //results = responses;
             finish = true;
             });

             //problem : updating the box wireframes doesn't work so well
             while(!finish){} //Does it work ?*/

        }else{
            for(i = 0; i < length;i++){
                position[3*(i+start)] = array[3*i];
                position[3*(i+start) + 1] = array[3*i + 1];
                position[3*(i+start) + 2] = array[3*i + 2];
                indexArray[i + start] = indexs[i];
            }
        }
    }

    //When the data are already sorted
    function fillOctreeSorted(octree, start, count, iter, box){
        octree.box = box;
        octree.start = start;
        octree.count = count;
        console.log(octree.count);

        //if(iter < 3) {
        if(octree.count > 1000 && iter < 5){
            octree.hasChild = true;

            console.log(iter);

            var i;

            /*var positionArray = new Float32Array(array.length);
             for(i = 0;i < array.length;i++){
             positionArray[i] = array[i];
             }*/

            console.log("coucou");

            for(i = 0; i < 8;i++){
                octree.child.push(new Octree());
            }

            //var part = [[], [], [], [], [], [], [], []];
            var index = [0, 0, 0, 0, 0, 0, 0, 0];

            var xMin = box.xMin;
            var xMax = box.xMax;
            var yMin = box.yMin;
            var yMax = box.yMax;
            var zMin = box.zMin;
            var zMax = box.zMax;

            var xMid = (xMin + xMax) / 2;
            var yMid = (yMin + yMax) / 2;
            var zMid = (zMin + zMax) / 2;

            //    y
            //     |
            //     8----4
            // 7----3   |
            // |    |   |
            // |   6|- -2__x
            // 5----1
            ///
            //z

            var j;

            for(i = start; i < count + start && position[3*i] < xMid && position[3*i + 1] < yMid && position[3 * i + 2] < zMid;i++);
            index[5] = i - start;
            j = i;
            for(; i < count + start && position[3*i] < xMid && position[3*i + 1] < yMid && position[3 * i + 2] > zMid;i++);
            index[4] = i - j;
            j = i;
            for(; i < count + start && position[3*i] < xMid && position[3*i + 1] > yMid && position[3 * i + 2] < zMid;i++);
            index[7] = i - j;
            j = i;
            for(i; i < count + start && position[3*i] < xMid && position[3*i + 1] > yMid && position[3 * i + 2] > zMid;i++);
            index[6] = i - j;
            j = i;
            for(; i < count + start && position[3*i] > xMid && position[3*i + 1] < yMid && position[3 * i + 2] < zMid;i++);
            index[1] = i - j;
            j = i;
            for(; i < count + start && position[3*i] > xMid && position[3*i + 1] < yMid && position[3 * i + 2] > zMid;i++);
            index[0] = i - j;
            j = i;
            for(; i < count + start && position[3*i] > xMid && position[3*i + 1] > yMid && position[3 * i + 2] < zMid;i++);
            index[3] = i - j;
            j = i;
            for(; i < count + start && position[3*i] > xMid && position[3*i + 1] > yMid && position[3 * i + 2] > zMid;i++);
            index[2] = i - j;

            var offsets = [0, 0, 0, 0, 0, 0, 0, 0];

            var boxes = [{xMin:xMid, xMax:xMax, yMin:yMin, yMax:yMid, zMin:zMid, zMax:zMax},
                {xMin:xMid, xMax:xMax, yMin:yMin, yMax:yMid, zMin:zMin, zMax:zMid},
                {xMin:xMid, xMax:xMax, yMin:yMid, yMax:yMax, zMin:zMid, zMax:zMax},
                {xMin:xMid, xMax:xMax, yMin:yMid, yMax:yMax, zMin:zMin, zMax:zMid},
                {xMin:xMin, xMax:xMid, yMin:yMin, yMax:yMid, zMin:zMid, zMax:zMax},
                {xMin:xMin, xMax:xMid, yMin:yMin, yMax:yMid, zMin:zMin, zMax:zMid},
                {xMin:xMin, xMax:xMid, yMin:yMid, yMax:yMax, zMin:zMid, zMax:zMax},
                {xMin:xMin, xMax:xMid, yMin:yMid, yMax:yMax, zMin:zMin, zMax:zMid}];

            for(i=1 ; i < 8;i++){
                offsets[i] = (offsets[i-1] + index[i - 1]);
            }

            for(i=0;i<8;i++){
                fillOctreeSorted(octree.child[i], offsets[i], index[i], iter+1, boxes[i]);
            }

        }
    }

    //fillOctreeFast(positions, indexes, octree, 0, 0, {xMin:0.0, xMax:1.0, yMin:0.0, yMax:1.0,zMin:0.0, zMax:1.0});
    fillOctree(indexes, octree, 0, indexArray.length, 0, {xMin:0.0, xMax:1.0, yMin:0.0, yMax:1.0,zMin:0.0, zMax:1.0});

}

onmessage = function(e){
    console.log("message received");
    position = e.data.position;
    indexArray = e.data.index;
    createOctreeFromPos(position, indexArray);
    postMessage({octree:octree, index:indexArray}, [indexArray.buffer]);
};
