/**
 * Created by lespingal on 30/06/15.
 */


function getIntersection(node){
    if(intersectBox(Camera.camera, node.box)) {
        if (node.hasChild) {
            var idOfIntersectedChildren = 0;
            //TODO get intersected children
            return getIntersection(node.child[idOfIntersectedChildren])
        }else{
            return null;
        }
    }
}

function intersectBox(camera, box){

}

App.Octree = function(){
    this.child = new Array[8];
    this.box = null;
    this.hasChild = false;
    this.start = 0;
    this.count = 0;
};


function compare(){

};


function mergeSort(data){

}

function createOctreeFromPos(positions){
    var octree = new App.Octree;

    /**
     * @description
     * @param array array of point
     * @param octree Octree object
     * @param start position in parent's array
     * @param iter current iteration of the algorithm
     * @param box xmin, xmax, ymin, etc
     */
    function fillOctree(array, octree, start, iter, box){

        octree.box = box;
        octree.start = start;
        octree.count = array.length;

        if(iter < App.nbIter) {
            octree.hasChild = true;

            var tab1 = [];
            var tab2 = [];
            var tab3 = [];
            var tab4 = [];
            var tab5 = [];
            var tab6 = [];
            var tab7 = [];
            var tab8 = []; //TODO get rid of this insanity

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

            var i;

            var length = array.length / 3;
            for (i = 0; i < length; i++) {
                x = array[3 * i];
                y = array[3 * i + 1];
                z = array[3 * i + 2];
                if (x < xMid) {
                    if (y < yMid) {
                        if (z < zMid) {
                            tab1.push(x);
                            tab1.push(y);
                            tab1.push(z);
                        } else {
                            tab2.push(x);
                            tab2.push(y);
                            tab2.push(z);
                        }
                    } else {
                        if (z < zMid) {
                            tab3.push(x);
                            tab3.push(y);
                            tab3.push(z);
                        } else {
                            tab4.push(x);
                            tab4.push(y);
                            tab4.push(z);
                        }
                    }
                } else {
                    if (y < yMid) {
                        if (z < zMid) {
                            tab5.push(x);
                            tab5.push(y);
                            tab5.push(z);
                        } else {
                            tab6.push(x);
                            tab6.push(y);
                            tab6.push(z);
                        }
                    } else {
                        if (z < zMid) {
                            tab7.push(x);
                            tab7.push(y);
                            tab7.push(z);
                        } else {
                            tab8.push(x);
                            tab8.push(y);
                            tab8.push(z);
                        }
                    }
                }
            }

            //TODO we can do better than that, no ? Also, async is your friend
            var offset = 0;
            var result1 = fillOctree(tab1, octree.child[1], start + offset, iter+1, {xMin:xMin, xMax:xMid, yMin:yMin, yMax:yMid,zMin:zMin, zMax:zMid});
            offset += tab1.length;
            var result2 = fillOctree(tab2, octree.child[2], start + offset, iter+1, {xMin:xMid, xMax:xMax, yMin:yMin, yMax:yMid,zMin:zMin, zMax:zMid});
            offset += tab2.length;
            var result3 = fillOctree(tab3, octree.child[3], start + offset, iter+1, {xMin:xMin, xMax:xMid, yMin:yMid, yMax:yMax,zMin:zMin, zMax:zMid});
            offset += tab3.length;
            var result4 = fillOctree(tab4, octree.child[4], start + offset, iter+1, {xMin:xMid, xMax:xMax, yMin:yMid, yMax:yMax,zMin:zMin, zMax:zMid});
            offset += tab4.length;
            var result5 = fillOctree(tab5, octree.child[5], start + offset, iter+1, {xMin:xMin, xMax:xMid, yMin:yMin, yMax:yMid,zMin:zMid, zMax:zMax});
            offset += tab5.length;
            var result6 = fillOctree(tab6, octree.child[6], start + offset, iter+1, {xMin:xMid, xMax:xMax, yMin:yMin, yMax:yMid,zMin:zMid, zMax:zMax});
            offset += tab6.length;
            var result7 = fillOctree(tab7, octree.child[7], start + offset, iter+1, {xMin:xMin, xMax:xMid, yMin:yMid, yMax:yMax,zMin:zMid, zMax:zMax});
            offset += tab7.length;
            var result8 = fillOctree(tab8, octree.child[8], start + offset, iter+1, {xMin:xMid, xMax:xMax, yMin:yMid, yMax:yMax,zMin:zMid, zMax:zMax});

            //TODO get tab and merge, return result
            return merge([result1, result2,result3,result4,result5,result6,result7,result8]);

        }else{
            return array;
        }
    }

    return fillOctree(positions, octree, 0, 0, {xMin:0.0, xMax:1.0, yMin:0.0, yMax:1.0,zMin:0.0, zMax:1.0});

}

