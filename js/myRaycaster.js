/**
 * Created by lespingal on 30/06/15.
 */

function getIntersection(event){

    //App.timer.start();
    if(App.pointCloud) {
        var mouse = new THREE.Vector2(
            ( event.clientX / App.renderer.domElement.clientWidth ) * 2 - 1,
            -( event.clientY / App.renderer.domElement.clientHeight ) * 2 + 1
        );


        var raycaster = new THREE.Raycaster();
        raycaster.ray.origin.copy(Camera.camera.position);
        raycaster.ray.direction.set( mouse.x, mouse.y, 0.5 ).unproject( Camera.camera ).sub( Camera.camera.position ).normalize();

        /*var ray_clip = new THREE.Vector4(mouse.x, mouse.y, 1.0, 1.0);


        var Iproj = new THREE.Matrix4();
        Iproj.getInverse(Camera.camera.projectionMatrix);
        var ray_eye = ray_clip.applyMatrix4(Iproj);

        ray_eye.z = 1.0;
        ray_eye.w = 1.0;

        var IWor = new THREE.Matrix4();
        IWor.getInverse(Camera.camera.matrixWorldInverse);
        var ray_wor = ray_eye.applyMatrix4(IWor);

        ray_wor = ray_wor.normalize();*/

        /*App.scene.remove(App.arrowHelper);
        App.arrowHelper = new THREE.ArrowHelper(raycaster.ray.direction, Camera.camera.position, 10, 0xffff00);
        App.scene.add(App.arrowHelper);*/


        var octans = getIntersectedOctans(Camera.camera.position, raycaster.ray.direction);

        App.staticBufferGeometry.offsets = App.staticBufferGeometry.drawcalls = [];
        if(octans) {
            App.staticBufferGeometry.addDrawCall(octans.start/3, octans.count/3, octans.start/3);
        }


        /*if(intersectBox(Camera.camera, node.box)) {
         if (node.hasChild) {
         var idOfIntersectedChildren = 0;
         //TODO get intersected children
         return getIntersection(node.child[idOfIntersectedChildren])
         }else{
         return null;
         }
         }*/
    }
    //App.timer.stop("compute raycasting");
}

function getIntersectedSiblings(){

}

//TODO don't only test the first octan, but the other one as well
//TODO don't test again all 6 faces, as we know which faces is met
function getIntersectedOctans(origin, ray){


    function getIntersectedOctan(octree, face){
        if(octree.hasChild){

            var xMin = octree.box.xMin;
            var xMax = octree.box.xMax;
            var yMin = octree.box.yMin;
            var yMax = octree.box.yMax;
            var zMin = octree.box.zMin;
            var zMax = octree.box.zMax;

            var xMid = (xMin + xMax) / 2;
            var yMid = (yMin + yMax) / 2;
            var zMid = (zMin + zMax) / 2;

            var octan = 0;
            var distance = 0;
            var x = 0;
            var y = 0;
            var z = 0;

            if(origin.x < xMid){
                //test face 1 (x = 0)
                distance = (xMin-origin.x)/ray.x;
                y = origin.y + distance*ray.y;
                z = origin.z + distance*ray.z;

                if(y > yMin && y < yMax && z > zMin && z < zMax){
                    if(y < yMid && z < zMid){
                        octan = 6;
                    }else if(y < yMid && z > zMid){
                        octan = 5;
                    }else if(z < zMid){
                        octan = 8;
                    }else{
                        octan = 7;
                    }
                }
            }else{
                //test face 2 (x = 1)
                distance = (xMax-origin.x)/ray.x;
                y = origin.y + distance*ray.y;
                z = origin.z + distance*ray.z;

                if(y > yMin && y < yMax && z > zMin && z < zMax) {
                    if(y < yMid && z < zMid){
                        octan = 2;
                    }else if(y < yMid && z > zMid){
                        octan = 1;
                    }else if(z < zMid){
                        octan = 4;
                    }else{
                        octan = 3;
                    }
                }
            }

            if(octan == 0 && origin.y < yMid){
                //test face 3 (y = 0)
                distance = (yMin-origin.y)/ray.y;
                x = origin.x + distance*ray.x;
                z = origin.z + distance*ray.z;

                if(x > xMin && x < xMax && z > zMin && z < zMax) {
                    if(x < xMid && z < zMid){
                        octan = 6;
                    }else if(x < xMid && z > zMid){
                        octan = 5;
                    }else if(z < zMid){
                        octan = 2;
                    }else{
                        octan = 1;
                    }
                }
            }else{
                //test face 4 (y = 1)
                distance = (yMax-origin.y)/ray.y;
                x = origin.x + distance*ray.x;
                z = origin.z + distance*ray.z;

                if(x > xMin && x < xMax && z > zMin && z < zMax) {
                    if(x < xMid && z < zMid){
                        octan = 8;
                    }else if(x < xMid && z > zMid){
                        octan = 7;
                    }else if(z < zMid){
                        octan = 4;
                    }else{
                        octan = 3;
                    }
                }
            }

            if(!octan && origin.z < zMid){
                //test face 5 (z = 0)
                distance = (zMin-origin.z)/ray.z;
                x = origin.x + distance*ray.x;
                y = origin.y + distance*ray.y;

                if(x > xMin && x < xMax && y > yMin && y < yMax) {
                    if(x < xMid && y < yMid){
                        octan = 6;
                    }else if(x < xMid && y > yMid){
                        octan = 8;
                    }else if(y < yMid){
                        octan = 2;
                    }else{
                        octan = 4;
                    }
                }
            }else{
                //test face 6 (z = 1)
                distance = (zMax-origin.z)/ray.z;
                x = origin.x + distance*ray.x;
                y = origin.y + distance*ray.y;

                if(x > xMin && x < xMax && y > yMin && y < yMax) {
                    if(x < xMid && y < yMid){
                        octan = 5;
                    }else if(x < xMid && y > yMid){
                        octan = 7;
                    }else if(y < yMid){
                        octan = 1;
                    }else{
                        octan = 3;
                    }
                }
            }

            if(octan != 0) {
                return getIntersectedOctan(octree.child[octan - 1]);
            }else{
                return null;
            }

        }else{
            return octree;
        }
    }

    return getIntersectedOctan(App.octree);
}

App.Octree = function(){
    this.child = [];
    this.box = null;
    this.hasChild = false;
    this.start = 0;
    this.count = 0;
};

function flatten(array){
    var flattened=[];
    for(var i = 0; i < array.length;++i){
        var current = array[i];
        for(var j = 0; j < current.length; ++j){
            flattened.push(current[j]);
        }
    }
    return flattened;
}

function createOctreeFromPos(positions){
    App.octree = null;
    App.octree = new App.Octree();

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

            var i;
            for(i = 0; i < 8;i++){
                octree.child.push(new App.Octree());
            }

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

       //    y
       //     |
       //     8----4
       // 7----3   |
       // |    |   |
       // |   6|- -2__x
       // 5----1
       ///
      //z
            var length = array.length / 3;
            for (i = 0; i < length; i++) {
                x = array[3 * i];
                y = array[3 * i + 1];
                z = array[3 * i + 2];
                if (x < xMid) {
                    if (y < yMid) {
                        if (z < zMid) {
                            tab6.push(x);
                            tab6.push(y);
                            tab6.push(z);
                        } else {
                            tab5.push(x);
                            tab5.push(y);
                            tab5.push(z);
                        }
                    } else {
                        if (z < zMid) {
                            tab8.push(x);
                            tab8.push(y);
                            tab8.push(z);
                        } else {
                            tab7.push(x);
                            tab7.push(y);
                            tab7.push(z);
                        }
                    }
                } else {
                    if (y < yMid) {
                        if (z < zMid) {
                            tab2.push(x);
                            tab2.push(y);
                            tab2.push(z);
                        } else {
                            tab1.push(x);
                            tab1.push(y);
                            tab1.push(z);
                        }
                    } else {
                        if (z < zMid) {
                            tab4.push(x);
                            tab4.push(y);
                            tab4.push(z);
                        } else {
                            tab3.push(x);
                            tab3.push(y);
                            tab3.push(z);
                        }
                    }
                }
            }

            //TODO we can do better than that, no ? Also, async is your friend
            var offset = 0;
            var result1 = fillOctree(tab1, octree.child[0], start + offset, iter+1, {xMin:xMid, xMax:xMax, yMin:yMin, yMax:yMid,zMin:zMid, zMax:zMax});
            offset += tab1.length;
            var result2 = fillOctree(tab2, octree.child[1], start + offset, iter+1, {xMin:xMid, xMax:xMax, yMin:yMin, yMax:yMid,zMin:zMin, zMax:zMid});
            offset += tab2.length;
            var result3 = fillOctree(tab3, octree.child[2], start + offset, iter+1, {xMin:xMid, xMax:xMax, yMin:yMid, yMax:yMax,zMin:zMid, zMax:zMax});
            offset += tab3.length;
            var result4 = fillOctree(tab4, octree.child[3], start + offset, iter+1, {xMin:xMid, xMax:xMax, yMin:yMid, yMax:yMax,zMin:zMin, zMax:zMid});
            offset += tab4.length;
            var result5 = fillOctree(tab5, octree.child[4], start + offset, iter+1, {xMin:xMin, xMax:xMid, yMin:yMin, yMax:yMid,zMin:zMid, zMax:zMax});
            offset += tab5.length;
            var result6 = fillOctree(tab6, octree.child[5], start + offset, iter+1, {xMin:xMin, xMax:xMid, yMin:yMin, yMax:yMid,zMin:zMin, zMax:zMid});
            offset += tab6.length;
            var result7 = fillOctree(tab7, octree.child[6], start + offset, iter+1, {xMin:xMin, xMax:xMid, yMin:yMid, yMax:yMax,zMin:zMid, zMax:zMax});
            offset += tab7.length;
            var result8 = fillOctree(tab8, octree.child[7], start + offset, iter+1, {xMin:xMin, xMax:xMid, yMin:yMid, yMax:yMax,zMin:zMin, zMax:zMid});

            //get tab and merge, return result
            return flatten([result1, result2,result3,result4,result5,result6,result7,result8]);

        }else{
            return array;
        }
    }

    return fillOctree(positions, App.octree, 0, 0, {xMin:0.0, xMax:1.0, yMin:0.0, yMax:1.0,zMin:0.0, zMax:1.0});

}

