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

/**
 *
 */
function showInfo(index){
    var el = document.getElementById('info');
    var infos = App.data.info;
    var result = [];
    result.push("position : x = ");
    result.push(App.data.currentPositionArray[index*3]);
    result.push(",y = ");
    result.push(App.data.currentPositionArray[index*3 + 1]);
    result.push(",z = ");
    result.push(App.data.currentPositionArray[index*3 + 2]);
    result.push("\n");
    for(var i = 0; i < infos.length;i++){
        result.push(infos[i].name);
        result.push(" : ");
        result.push(infos[i].value[index]);
        result.push("\n");
    }
    el.innerHTML = result.join('');
}

/**
 * @author Arnaud Steinmetz <s.arnaud67@hotmail.fr>, Modification by Pierre Lespingal
 * @description Change the color of the selected ( left mouse ) or deselected ( right mouse ) point
 * @param {event} event
 */
function selectPoint(event) {

    if(App.RAYCASTING) {
        if (App.pointCloud != null) {
            var mouse = new THREE.Vector2(
                ( event.clientX / App.renderer.domElement.clientWidth ) * 2 - 1,
                -( event.clientY / App.renderer.domElement.clientHeight ) * 2 + 1
            );

            if (App.RAYCASTINGTYPE == App.RaycastingType.HOMEMADE) {
                App.intersection = getIntersection(mouse);
            } else if (App.RAYCASTINGTYPE == App.RaycastingType.THREEJS) {
                App.intersection = getMousePointCloudIntersection(mouse);
            }

            if (App.intersection != null) {
                console.log("touché !");
                switch (event.button) {
                    case 0 :
                        if (App.selection != null) {
                            whitify(App.pointCloud.geometry.attributes.color, App.selection.index);
                        }

                        greenify(App.pointCloud.geometry.attributes.color, App.intersection.index);

                        showInfo(App.intersection.index);

                        App.selection = App.intersection;

                        break;
                    case 2 :
                        if (App.selection.index != null && App.intersection.index == App.selection.index) {
                            whitify(App.pointCloud.geometry.attributes.color, App.intersection.index);

                            App.selection = null;
                        }
                        break;
                    default :
                        break;
                }
            }
        }
    }
}

/**
 * @author Pierre Lespingal
 * @description highlight the point under the mouse
 * @param event
 */
function checkForPointUnderMouse(event){

    if(App.RAYCASTING) {

        if (App.pointCloud != null) {
            //event.preventDefault();
            var mouse = new THREE.Vector2(
                ( event.clientX / App.renderer.domElement.clientWidth ) * 2 - 1,
                -( event.clientY / App.renderer.domElement.clientHeight ) * 2 + 1
            );


            var intersection = null;
            if (App.RAYCASTINGTYPE == App.RaycastingType.HOMEMADE) {
                intersection = getIntersection(mouse);
            } else if (App.RAYCASTINGTYPE == App.RaycastingType.THREEJS) {
                intersection = getMousePointCloudIntersection(mouse);
            }

            if (App.intersection != null && (intersection == null || App.intersection != intersection) && (App.selection == null || App.intersection != App.selection)) {
                whitify(App.pointCloud.geometry.attributes.color, App.intersection.index);

            }
            if (intersection != null && (App.selection == null || intersection.index != App.selection.index)) {

                App.intersection = intersection;

                redify(App.pointCloud.geometry.attributes.color, App.intersection.index);

            }


        }
    }
}

/**
 * @author Arnaud Steinmetz <s.arnaud67@hotmail.fr> - modified by Pierre Lespingal
 * @description Zoom on the point that was clicked by the user and reduce the size of the points to see the positions with more accuracy.
 * TODO improve size of point, put offset on camera position
 */
function zoomMacro(event)
{
    if(App.pointCloud != null)
    {
        //event.preventDefault();
        var mouse = new THREE.Vector2(
            ( event.clientX / App.renderer.domElement.clientWidth ) * 2 - 1,
            - ( event.clientY / App.renderer.domElement.clientHeight ) * 2 + 1
        );
        if(App.RAYCASTINGTYPE == App.RaycastingType.HOMEMADE) {
            App.intersection = getIntersection(mouse);
        }else if(App.RAYCASTINGTYPE == App.RaycastingType.THREEJS){
            App.intersection = getMousePointCloudIntersection(mouse);
        }
        var size = App.uniforms.size;

        if(App.intersection != null)
        {
            var x = App.pointCloud.geometry.attributes.position.array[App.intersection.index*3];
            var y = App.pointCloud.geometry.attributes.position.array[App.intersection.index*3+1];
            var z = App.pointCloud.geometry.attributes.position.array[App.intersection.index*3+2];

            Camera.origin = new THREE.Vector3(Camera.camera.position.x, Camera.camera.position.y,Camera.camera.position.z);
            Camera.objectif = new THREE.Vector3(x - Camera.origin.x, y - Camera.origin.y, z - Camera.origin.z);
            console.log(Camera.objectif);
            Camera.time = 0.0;
            App.CAMERAISFREE = false;

            //Camera.controls.moveSpeed = padding * 10;
            //App.animatedShaderMaterial.size = padding;
            //App.uniforms.size = padding;

        }

    }
}

function redify(color, index){
    color.array[index * 3] = 1.0;
    color.array[index * 3 + 1] = 0.0;
    color.array[index * 3 + 2] = 0.0;
    color.needsUpdate = true;
}

function greenify(color, index){
    color.array[index * 3] = 0.0;
    color.array[index * 3 + 1] = 1.0;
    color.array[index * 3 + 2] = 0.0;
    color.needsUpdate = true;
}

function whitify(color, index){
    color.array[index * 3] = 1.0;
    color.array[index * 3 + 1] = 1.0;
    color.array[index * 3 + 2] = 1.0;
    color.needsUpdate = true;
}


function testVertice(pos){
    var result = pos.project(Camera.camera);

    if(-1 <= result.x && result.x <= 1 && -1 <= result.y && result.y <= 1 && -1 <= result.z && result.z <= 1){
        return 1;
    }
    return 0;
}

//Frustum culling
//TODO improve algo
function cullFromFrustum(octree){

    var box = octree.box;
    var xMin = box.xMin;
    var yMin = box.yMin;
    var zMin = box.zMin;
    var xMax = box.xMax;
    var yMax = box.yMax;
    var zMax = box.zMax;

    var test = 0;

    /*for(var i = 0; i < 6; i++){



    }*/

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

function getIntersection(mouse){

    var target = null;

    //App.timer.start();
    /*if(App.pointCloud) {
     var mouse = new THREE.Vector2(
     ( event.clientX / App.renderer.domElement.clientWidth ) * 2 - 1,
     -( event.clientY / App.renderer.domElement.clientHeight ) * 2 + 1
     );*/


    var raycaster = new THREE.Raycaster();
    //raycaster.ray.origin.copy(Camera.camera.position);
    //raycaster.ray.direction.set( mouse.x, mouse.y, 0.5 ).unproject( Camera.camera ).sub( Camera.camera.position ).normalize();
    raycaster.setFromCamera(mouse, Camera.camera);


    App.scene.updateMatrixWorld();


    getIntersectedOctans(Camera.camera.position, raycaster.ray.direction);


    var i;

    App.staticBufferGeometry.offsets = App.staticBufferGeometry.drawcalls = [];
    if(App.RAYCASTINGCULLING) {
        for (i = 0; i < App.drawCalls.length; i++) {
            App.staticBufferGeometry.addDrawCall(App.drawCalls[i].start, App.drawCalls[i].count, App.drawCalls[i].start);
        }
    }


    var j = 0;

    while(j < App.drawCalls.length && target == null){
        var start = App.drawCalls[j].start/3;
        var end = App.drawCalls[j].count/3 + start;
        for(i = start; i < end;i++) {
            var x = App.data.currentPositionArray[3 * i];
            var y = App.data.currentPositionArray[3 * i + 1];
            var z = App.data.currentPositionArray[3 * i + 2];
            var a = raycaster.ray.direction.x;
            var b = raycaster.ray.direction.y;
            var c = raycaster.ray.direction.z;
            var cx = Camera.camera.position.x;
            var cy = Camera.camera.position.y;
            var cz = Camera.camera.position.z;

            if ((x - cx) * (a - cx) + (y - cy) * (b - cy) + (z - cz) * (c - cz) > 0) { //We don't want particles behind us, the sneaky ones

                var d = -a * x - b * y - c * z;

                var md = (Math.pow(a * cx + b * cy + c * cz + d, 2)) / (a * a + b * b + c * c);
                var h = Math.abs((cx - x) * (cx - x) + (cy - y) * (cy - y) + (cz - z) * (cz - z));
                if (Math.sqrt(h - md) < App.uniforms.size.value / 4000) { //It's a kind of magic, maaaaagic !
                    if (target == null) {
                        target = {index: i, distance: Math.sqrt(h)};
                    } else if (Math.sqrt(h) < target.distance) {
                        target.index = i;
                        target.distance = Math.sqrt(h);
                    }
                }
            }
        }
        j++;
    }
    return target;
}

//TODO When camera is inside the cube, we also pick the otans behind us
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

function displayBox(octree) {


    if(octree.hasChild){
        for(var i = 0; i < octree.child.length; i++){
            displayBox(octree.child[i]);
        }
    }else{
        var box = octree.box;

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
    }
}
