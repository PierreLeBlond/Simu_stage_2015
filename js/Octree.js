/**
 * Created by lespingal on 10/08/15.
 */

/**
 *  Global namespace
 *  @namespace
 */
var SIMU = SIMU || {};

/**
 * Represent an octree structure
 * The octree is bound to a index buffer, where the indexes are sorted in region as they are octant within the octree
 * The octree gives us the section of the index buffer to look for
 * @constructor
 *
 * @property {SIMU.Octree[]} child   - The eight octant, i.e. the child octree
 * @property {object} box       - An object giving the geometry of the octant
 * @property {boolean} hasChild - True if the octree has child octant
 * @property {number} start     - Starting index of the point within this octree
 * @property {number} count     - Number of point's index within this octree
 */
SIMU.Octree = function(){
    this.child = [];
    this.box = null;
    this.hasChild = false;
    this.start = 0;
    this.count = 0;
};

/**
 * Create the octree from the given position and modify the indexes buffer to match with it
 * @detail Only the indexes buffer is rearrange, so the other buffer no longer match with this indexation. You have to either using a correspondence map of indexes, or rearrange the buffer one by one
 * @param {Float32Array} positions  - The position buffer
 * @param {Float32Array} indexes    - The index buffer
 */
SIMU.Octree.prototype.createOctreeFromPos = function(positions, indexes){

    var new_indexes = new Float32Array(indexes.length);

    /**
     * @param  {Array} octant_indexes                                - Index within the current octant
     * @param {SIMU.Octree} octree                                  - The current octant
     * @param start position in parent's array
     * @param count position in parent's array
     * @param iter current iteration of the algorithm
     * @param box xmin, xmax, ymin, etc
     */
    function fillOctree(octant_indexes, octree, start, count, iter, box){

        octree.box = box;
        octree.start = start;
        octree.count = count;

        var i;

        if(octree.count > 1000 && iter < 5){ //Manage the condition to stop the construction
            octree.hasChild = true;


            for(i = 0; i < 8;i++){
                octree.child.push(new SIMU.Octree());
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

            //Let's sort the indexes between the different octant
            var j;
            for (i = 0; i < count; i++) {
                j = octant_indexes[i];
                x = positions[3 * j];
                y = positions[3 * j + 1];
                z = positions[3 * j + 2];
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

            for(i=1 ; i < 8;i++){
                offsets[i] = offsets[i-1] + index[i - 1].length;
            }

            for(i=0;i<8;i++){
                fillOctree(index[i], octree.child[i], offsets[i], index[i].length, iter+1, boxes[i]);
                index[i] = null;
            }

        }else{
            for(i = 0;i < octant_indexes.length;i++){
                new_indexes[i + start] = octant_indexes[i];
            }

            octant_indexes = null;
        }
    }

    /**
     * @description This one also compute the new position, but is too eavy on large chunk of data
     * @depreciate
     * @param array array of point
     * @param octree Octree object
     * @param start position in parent's array
     * @param iter current iteration of the algorithm
     * @param box xmin, xmax, ymin, etc
     */
    /*function fillOctreeFast(array, indexs, octree, start, iter, box){

        var length = array.length/3;

        octree.box = box;
        octree.start = start;
        octree.count = length;

        if(octree.count > 1000 && iter < 5){
            octree.hasChild = true;


            var i;


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

        }else{
            for(i = 0; i < length;i++){
                position[3*(i+start)] = array[3*i];
                position[3*(i+start) + 1] = array[3*i + 1];
                position[3*(i+start) + 2] = array[3*i + 2];
                indexArray[i + start] = indexs[i];
            }
        }
    }*/

    /**
     * Use this if the data is sure to be sorted already
     * @param octree
     * @param start
     * @param count
     * @param iter
     * @param box
     */
    /*function fillOctreeSorted(octree, start, count, iter, box){
        octree.box = box;
        octree.start = start;
        octree.count = count;
        console.log(octree.count);

        //if(iter < 3) {
        if(octree.count > 1000 && iter < 5){
            octree.hasChild = true;

            console.log(iter);

            var i;

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
    }*/

    fillOctree(indexes, this, 0, indexes.length, 0, {xMin:0.0, xMax:1.0, yMin:0.0, yMax:1.0,zMin:0.0, zMax:1.0});
    return new_indexes;

};