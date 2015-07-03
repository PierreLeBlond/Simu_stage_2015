/**
 * Created by lespingal on 30/06/15.
 */



App.faceToOctan = [[5, 6, 7, 8], [1,2,3,4], [1,2,5,6], [3, 4, 7, 8], [2, 4, 6, 8], [1, 3, 5, 7]];
App.octanToFace = [
    /*octan 1*/[
        /*face 1*/[{octan : 3, face : 3}, {octan : 2, face : 6}],
        /*face 2*/[{octan : 2, face :6}, {octan : 5, face : 2}, {octan : 3, face : 3}],
        /*face 3*/[{octan : 5, face : 2}, {octan : 2, face : 6}, {octan : 3, face : 3}],
        /*face 4*/[{octan : 2, face :6}, {octan : 5, face : 2}],
        /*face 5*/[{octan : 3, face : 3}, {octan : 3, face : 3}],
        /*face 6*/[{octan : 3, face : 3}, {octan : 2, face : 6}, {octan : 3, face : 3}]
    ],
    /*octan 2*/[
        /*face 1*/[{octan : 1, face :5}, {octan : 4, face : 3}],
        /*face 2*/[{octan : 1, face :5}, {octan : 6, face : 2}, {octan : 4, face : 3}],
        /*face 3*/[{octan : 1, face :5}, {octan : 6, face : 2}, {octan : 4, face : 3}],
        /*face 4*/[{octan : 1, face :5}, {octan : 6, face : 2}],
        /*face 5*/[{octan : 1, face :5}, {octan : 6, face : 2}, {octan : 4, face : 3}],
        /*face 6*/[{octan : 4, face : 3}, {octan : 6, face : 2}]
    ],
    /*octan 3*/[
        /*face 1*/[{octan : 4, face :6}, {octan : 1, face : 4}],
        /*face 2*/[{octan : 4, face :6}, {octan : 7, face : 2}, {octan : 1, face : 4}],
        /*face 3*/[{octan : 4, face :6}, {octan : 7, face : 2}],
        /*face 4*/[{octan : 4, face :6}, {octan : 7, face : 2}, {octan : 1, face : 4}],
        /*face 5*/[{octan : 7, face : 2}, {octan : 1, face : 4}],
        /*face 6*/[{octan : 4, face :6}, {octan : 7, face : 2}, {octan : 1, face : 4}]
    ],
    /*octan 4*/[
        /*face 1*/[{octan : 2, face :4}, {octan : 3, face : 5}],
        /*face 2*/[{octan : 2, face :4}, {octan : 3, face : 5}, {octan : 8, face : 2}],
        /*face 3*/[{octan : 3, face : 5}, {octan : 8, face : 2}],
        /*face 4*/[{octan : 2, face :4}, {octan : 3, face : 5}, {octan : 8, face : 2}],
        /*face 5*/[{octan : 2, face :4}, {octan : 3, face : 5}, {octan : 8, face : 2}],
        /*face 6*/[{octan : 8, face : 2}, {octan : 2, face :4}]
    ],
    /*octan 5*/[
        /*face 1*/[{octan : 1, face : 1}, {octan : 6, face :6}, {octan : 7, face : 3}],
        /*face 2*/[{octan : 6, face :6}, {octan : 7, face : 3}],
        /*face 3*/[{octan : 1, face : 1}, {octan : 6, face :6}, {octan : 7, face : 3}],
        /*face 4*/[{octan : 1, face : 1}, {octan : 6, face :6}],
        /*face 5*/[{octan : 7, face : 3}, {octan : 1, face : 1}],
        /*face 6*/[{octan : 1, face : 1}, {octan : 6, face :6}, {octan : 7, face : 3}]
    ],
    /*octan 6*/[
        /*face 1*/[{octan : 2, face : 1}, {octan : 5, face :5}, {octan : 8, face : 3}],
        /*face 2*/[{octan : 5, face :5}, {octan : 8, face : 3}],
        /*face 3*/[{octan : 2, face : 1}, {octan : 5, face :5}, {octan : 8, face : 3}],
        /*face 4*/[{octan : 2, face : 1}, {octan : 5, face :5}],
        /*face 5*/[{octan : 2, face : 1}, {octan : 5, face :5}, {octan : 8, face : 3}],
        /*face 6*/[{octan : 2, face : 1}, {octan : 8, face : 3}]
    ],
    /*octan 7*/[
        /*face 1*/[{octan : 3, face : 1}, {octan : 5, face :4}, {octan : 8, face : 6}],
        /*face 2*/[{octan : 5, face :4}, {octan : 8, face : 6}],
        /*face 3*/[{octan : 8, face : 6}, {octan : 3, face : 1}],
        /*face 4*/[{octan : 3, face : 1}, {octan : 5, face :4}, {octan : 8, face : 6}],
        /*face 5*/[{octan : 3, face : 1}, {octan : 5, face :4}],
        /*face 6*/[{octan : 3, face : 1}, {octan : 5, face :4}, {octan : 8, face : 6}]
    ],
    /*octan 8*/[
        /*face 1*/[{octan : 4, face : 1}, {octan : 6, face :4}, {octan : 7, face : 5}],
        /*face 2*/[{octan : 6, face :4}, {octan : 7, face : 5}],
        /*face 3*/[{octan : 7, face : 5}, {octan : 4, face : 1}],
        /*face 4*/[{octan : 4, face : 1}, {octan : 6, face :4}, {octan : 7, face : 5}],
        /*face 5*/[{octan : 4, face : 1}, {octan : 6, face :4}, {octan : 7, face : 5}],
        /*face 6*/[{octan : 4, face : 1}, {octan : 6, face :4}]
    ]];

App.drawCalls = [];

//Frustum culling
//TODO Transform box vertices to clip space, test against clip-space planes

function cullFromFrustum(octree){

    function testVertice(pos){
        var result = pos.project(Camera.camera);

        if(-1 <= result.x && result.x <= 1 && -1 <= result.y && result.y <= 1 && 0 <= result.z && result.z <= 1){
            return 1;
        }
        return 0;
    }

    var box = octree.box;
    var xMin = box.xMin;
    var yMin = box.yMin;
    var zMin = box.zMin;
    var xMax = box.xMax;
    var yMax = box.yMax;
    var zMax = box.zMax;

    var test = 0;

    test += testVertice(new THREE.Vector3(xMin, yMin, zMin));
    test += testVertice(new THREE.Vector3(xMax, yMin, zMax));
    test += testVertice(new THREE.Vector3(xMin, yMax, zMin));
    test += testVertice(new THREE.Vector3(xMax, yMax, zMax));
    test += testVertice(new THREE.Vector3(xMin, yMax, zMax));
    test += testVertice(new THREE.Vector3(xMax, yMin, zMin));
    test += testVertice(new THREE.Vector3(xMin, yMin, zMax));
    test += testVertice(new THREE.Vector3(xMax, yMax, zMin));


    if(test > 0 && test < 8){//partially inside
        if(octree.hasChild) {
            for (var i = 0; i < octree.child.length; i++) {
                cullFromFrustum(octree.child[i]);
            }
        }else{
            App.drawCalls.push({start : octree.start, count : octree.count});
        }
    }else if(test == 8){
        App.drawCalls.push({start : octree.start, count : octree.count});
    }

}

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


        getIntersectedOctans(Camera.camera.position, raycaster.ray.direction);



        var i;

        App.staticBufferGeometry.offsets = App.staticBufferGeometry.drawcalls = [];
        if(App.RAYCASTINGCULLING) {
            for (i = 0; i < App.drawCalls.length; i++) {
                App.staticBufferGeometry.addDrawCall(App.drawCalls[i].start / 3, App.drawCalls[i].count / 3, App.drawCalls[i].start / 3);
            }
        }

        var target = null;

        var j = 0;

        while(j < App.drawCalls.length && target == null){
            for(i = App.drawCalls[j].start/3; i < App.drawCalls[j].start/3 + App.drawCalls[j].count/3;i++){
                var x = App.data.currentPositionArray[3*i];
                var y = App.data.currentPositionArray[3*i + 1];
                var z = App.data.currentPositionArray[3*i + 2];
                var a = raycaster.ray.direction.x;
                var b = raycaster.ray.direction.y;
                var c = raycaster.ray.direction.z;

                var d = -a*x - b*y - c*z;

                var md = (Math.pow(a*Camera.camera.position.x + b*Camera.camera.position.y + c*Camera.camera.position.z + d, 2))/(a*a + b*b + c*c);
                var h = Math.abs((Camera.camera.position.x - x)*(Camera.camera.position.x - x) + (Camera.camera.position.y - y)*(Camera.camera.position.y - y) + (Camera.camera.position.z - z)*(Camera.camera.position.z - z));
                if(Math.sqrt(h - md) < App.uniforms.size.value/8000){ //It's a kind of magic, maaaaagic !
                    if(target == null){
                        target = {index : i, distance: Math.sqrt(h)};
                    }else if(Math.sqrt(h) < target.distance){
                        target.index = i;
                        target.distance = Math.sqrt(h);
                    }
                }
            }
            j++;
        }

        if(target != null) {
            redify(App.staticBufferGeometryPointCloud.geometry.attributes.color, target.index);
            /*console.log(target.distance);*/
        }
    }
}

//TODO Test when camera is inside the cube
//TODO Try to sort callback
function getIntersectedOctans(origin, ray){

    function getIntersectedOctanWithFace(octree, octan, face){

        var octreeChild = octree.child[octan - 1];
        var xMin = octreeChild.box.xMin;
        var xMax = octreeChild.box.xMax;
        var yMin = octreeChild.box.yMin;
        var yMax = octreeChild.box.yMax;
        var zMin = octreeChild.box.zMin;
        var zMax = octreeChild.box.zMax;

        var x = 0;
        var y = 0;
        var z = 0;

        var inter = false;
        var distance = 0;
        //test if intersection really occur
        switch(face){
            case 1:
                distance = (xMin-origin.x)/ray.x;
                y = origin.y + distance*ray.y;
                z = origin.z + distance*ray.z;
                inter = y > yMin && y < yMax && z > zMin && z < zMax;
                break;
            case 2:
                distance = (xMax-origin.x)/ray.x;
                y = origin.y + distance*ray.y;
                z = origin.z + distance*ray.z;
                inter = y > yMin && y < yMax && z > zMin && z < zMax;
                break;
            case 3:
                distance = (yMin-origin.y)/ray.y;
                x = origin.x + distance*ray.x;
                z = origin.z + distance*ray.z;
                inter = x > xMin && x < xMax && z > zMin && z < zMax;
                break;
            case 4:
                distance = (yMax-origin.y)/ray.y;
                x = origin.x + distance*ray.x;
                z = origin.z + distance*ray.z;
                inter = x > xMin && x < xMax && z > zMin && z < zMax;
                break;
            case 5:
                distance = (zMin-origin.z)/ray.z;
                x = origin.x + distance*ray.x;
                y = origin.y + distance*ray.y;
                inter = x > xMin && x < xMax && y > yMin && y < yMax;
                break;
            case 6:
                distance = (zMax-origin.z)/ray.z;
                x = origin.x + distance*ray.x;
                y = origin.y + distance*ray.y;
                inter = x > xMin && x < xMax && y > yMin && y < yMax;
                break;
        }


        //if yes, continue
        if(inter) {
            var i;
            if(octreeChild.hasChild){
                var faceToOctan = App.faceToOctan[face - 1];
                for(i = 0; i < faceToOctan.length;i++){
                    getIntersectedOctanWithFace(octreeChild, faceToOctan[i], face);
                }
            }else{
                App.drawCalls.push({start : octreeChild.start, count : octreeChild.count});
            }
            var octanToFace = App.octanToFace[octan - 1][face - 1];
            for (i = 0; i < octanToFace.length; i++) {
                getIntersectedOctanWithFace(octree, octanToFace[i].octan, octanToFace[i].face);
            }
        }
    }


    function getIntersectedOctan(octree){

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

            var inter = false;
            var distance = 0;
            var x = 0;
            var y = 0;
            var z = 0;

            var faceToOctan = null;

            var i;

            if(origin.x < xMid){
                //test face 1 (x = 0)
                distance = (xMin-origin.x)/ray.x;
                y = origin.y + distance*ray.y;
                z = origin.z + distance*ray.z;

                if(y > yMin && y < yMax && z > zMin && z < zMax){

                    //face 1 intersected
                    inter = true;
                    faceToOctan = App.faceToOctan[0];
                    for(i = 0; i < faceToOctan.length;i++){
                        getIntersectedOctanWithFace(octree, faceToOctan[i], 1);
                    }
                }
            }else{
                //test face 2 (x = 1)
                distance = (xMax-origin.x)/ray.x;
                y = origin.y + distance*ray.y;
                z = origin.z + distance*ray.z;

                if(y > yMin && y < yMax && z > zMin && z < zMax) {

                    //face 2 intersected
                    inter = true;

                    faceToOctan = App.faceToOctan[1];
                    for(i = 0; i < faceToOctan.length;i++){
                        getIntersectedOctanWithFace(octree, faceToOctan[i], 2);
                    }
                }
            }

            if(!inter && origin.y < yMid){
                //test face 3 (y = 0)
                distance = (yMin-origin.y)/ray.y;
                x = origin.x + distance*ray.x;
                z = origin.z + distance*ray.z;

                if(x > xMin && x < xMax && z > zMin && z < zMax) {
                    //face 3 intersected
                    inter = true;

                    faceToOctan = App.faceToOctan[2];
                    for(i = 0; i < faceToOctan.length;i++){
                        getIntersectedOctanWithFace(octree, faceToOctan[i], 3);
                    }
                }
            }else if(!inter){
                //test face 4 (y = 1)
                distance = (yMax-origin.y)/ray.y;
                x = origin.x + distance*ray.x;
                z = origin.z + distance*ray.z;

                if(x > xMin && x < xMax && z > zMin && z < zMax) {
                    //face 4 intersected
                    inter = true;

                    faceToOctan = App.faceToOctan[3];
                    for(i = 0; i < faceToOctan.length;i++){
                        getIntersectedOctanWithFace(octree, faceToOctan[i], 4);
                    }
                }
            }

            if(!inter && origin.z < zMid){
                //test face 5 (z = 0)
                distance = (zMin-origin.z)/ray.z;
                x = origin.x + distance*ray.x;
                y = origin.y + distance*ray.y;

                if(x > xMin && x < xMax && y > yMin && y < yMax) {
                    //face 5 intersected
                    faceToOctan = App.faceToOctan[4];
                    for(i = 0; i < faceToOctan.length;i++){
                        getIntersectedOctanWithFace(octree, faceToOctan[i], 5);
                    }
                }
            }else if(!inter){
                //test face 6 (z = 1)
                distance = (zMax-origin.z)/ray.z;
                x = origin.x + distance*ray.x;
                y = origin.y + distance*ray.y;

                if(x > xMin && x < xMax && y > yMin && y < yMax) {
                    //face 6 intersected
                    faceToOctan = App.faceToOctan[5];
                    for(i = 0; i < faceToOctan.length;i++){
                        getIntersectedOctanWithFace(octree, faceToOctan[i], 6);
                    }
                }
            }
        }
    }

    App.drawCalls = [];
    getIntersectedOctan(App.octree);
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

        //if(iter < App.nbIter) {
        if(octree.count/3 > 10000){
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

function displayBox(octree) {
    box = octree.box;

    var xMin = box.xMin;
    var xMax = box.xMax;
    var yMin = box.yMin;
    var yMax = box.yMax;
    var zMin = box.zMin;
    var zMax = box.zMax;

    var xMid = (xMin + xMax) / 2;
    var yMid = (yMin + yMax) / 2;
    var zMid = (zMin + zMax) / 2;

    var geometry = new THREE.BoxGeometry(xMax - xMin, yMax - yMin, zMax - zMin);
    var material = new THREE.MeshBasicMaterial({color: 0xff0000});
    var cube = new THREE.Mesh(geometry, material);


    var boxHelper = new THREE.BoxHelper(cube);
    boxHelper.position.x = xMid;
    boxHelper.position.y = yMid;
    boxHelper.position.z = zMid;
    boxHelper.updateMatrix();

    App.scene.add(boxHelper);

    if(octree.hasChild){
        for(var i = 0; i < octree.child.length; i++){
            displayBox(octree.child[i]);
        }
    }
}
