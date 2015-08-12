/**
 * Created by lespingal on 17/06/15.
 */

/**
 * @description compute animation related to objects and camera
 */
function animate(){
    //Handle particules animation
    if(App.ANIMATION && App.PLAY) {
        if (App.uniforms.t.value < 1.0) {
            App.uniforms.t.value += App.parameters.speed/100;
        } else {
            if(App.parameters.posSnapShot + 2 < App.parameters.nbSnapShot) {
                App.uniforms.t.value = 0.0;
                App.parameters.posSnapShot++;
                App.data.departureArray = App.data.positionsArray[App.parameters.posSnapShot];
                App.data.directionArray = App.data.directionsArray[App.parameters.posSnapShot];
                App.animationBufferGeometry.attributes.position = new THREE.BufferAttribute(App.data.departureArray, 3);
                App.animationBufferGeometry.attributes.position.needsUpdate = true;
                App.animationBufferGeometry.attributes.direction = new THREE.BufferAttribute(App.data.directionArray, 3);
                App.animationBufferGeometryPointCloud.geometry.attributes.direction.needsUpdate = true;
            }else{
                App.uniforms.t.value = 1.0;
                computePositions();//Let's go back to static mode
                enableMouseEventHandling();
                App.PLAY = false;
            }
        }
    }

    //Display information about selected particles - take an average of 1ms
    if(App.selection != null){
        showSelectedInfo(App.selection);
    }

    /*if(App.intersection != null){
        showIntersectedInfo(App.intersection);
    }*/

    //update camera
    if(App.CAMERAISFREE) {
        Camera.controls.update(App.clock.getDelta());
    }else{
        Camera.time += 1/60;
        if(Camera.time < 1.0) {
            Camera.camera.position.set(Camera.origin.x + Camera.time * Camera.objectif.x,
                Camera.origin.y + Camera.time * Camera.objectif.y,
                Camera.origin.z + Camera.time * Camera.objectif.z);
        }else{
            console.log(Camera.camera.position);
            App.CAMERAISFREE = true;
        }
    }
}

/**
 * @author Arnaud Steinmetz <s.arnaud67@hotmail.fr>
 * @description Function that is used to refresh the renderer
 */
function render() {

    animate();

    App.requestId = requestAnimationFrame(function (){
        render();
    });

    //Update GUI & debug info
    Gui.stats.update();
    showDebugInfo();

    //App.colorPickingRenderer.render(App.colorPickerSprite, Camera.camera);
    //getColorPickingPointCloudIntersectionIndex();

    var Mat = Camera.camera.projectionMatrix.clone();
    Camera.frustum.setFromMatrix(Mat.multiply(Camera.camera.matrixWorldInverse));
    //Frustum culling
    if(App.FRUSTUMCULLING && App.pointCloud != null) {
        App.drawCalls = [];
        Camera.camera.updateProjectionMatrix();
        Camera.camera.updateMatrixWorld();

        cullFromFrustum(App.octree);
        App.staticBufferGeometry.offsets = App.staticBufferGeometry.drawcalls = [];
        for (var i = 0; i < App.drawCalls.length; i++) {
            App.staticBufferGeometry.addDrawCall(App.drawCalls[i].start, App.drawCalls[i].count, App.drawCalls[i].start);
        }
    }

    //render the scene
    App.renderer.render( App.scene, Camera.camera );


}



/**
 * @author Pierre lespingal
 * @description remove the pointCloud from the scene
 * @detail Care not to delete other object
 */
App.clearPointCloud = function(){
    if(App.scene.children.length != 1)
    {
        var nbChildToDelete = App.scene.children.length;
        var numChildToDelete = 1;
        //Beginning the loop at 1 to avoid deleting the AxisHelper
        for(var i = 1; i < nbChildToDelete;i++)
        {
            //Always deleting the second Object of the scene, because on each delete, it refreshes the children Array.
            if(App.scene.children[numChildToDelete].type == "PointCloud")
            {
                App.scene.remove(App.scene.children[numChildToDelete]);
            }
            else{
                numChildToDelete++;
            }

        }
    }
};

/**
 * @author Arnaud Steinmetz <s.arnaud67@hotmail.fr>
 * @description adds the attributes to the geometry and adds the PointCloud to the scene
 */
function loadData(){

    if(App.parameters.nbSnapShot == 0) {    //If it's the first time, let's set things up for static shadering
        var i;

        //
        App.staticBufferGeometry = new THREE.BufferGeometry();

        App.staticBufferGeometry.addAttribute('position', new THREE.BufferAttribute(App.data.currentPositionArray, 3));
        App.staticBufferGeometry.addAttribute('color' , new THREE.BufferAttribute( App.data.color, 3));

        App.staticBufferGeometry.computeBoundingSphere();

        //App.staticBufferGeometry.addDrawCall(0, App.parameters.nbPoint, 0);
        //App.staticBufferGeometry.addDrawCall(2097152/2, 2097152/2, 2097152/2);

        console.log(App.staticBufferGeometry.drawcalls);

        if(App.FOG){
            App.staticBufferGeometryPointCloud = new THREE.PointCloud(App.staticBufferGeometry, App.staticFogShaderMaterial);
        }else{
            App.staticBufferGeometryPointCloud = new THREE.PointCloud(App.staticBufferGeometry, App.staticShaderMaterial);
        }

        var j = 0;
        for (i = 0; i < App.parameters.nbPoint; i++) {
            if(j > 2000000) {
                App.staticBufferGeometry.addDrawCall(i - j, j, i - j);
                j = 0;
            }else{
                j++;
            }
        }
        App.staticBufferGeometry.addDrawCall(i - j, j, i - j);

        //computePositions();

        //
        /*App.colorPickerBufferGeometry = new THREE.BufferGeometry();

        App.departureArray = App.data.positionsArray[App.parameters.nbSnapShot - 1];
        App.colorPickerBufferGeometry.addAttribute('position', new THREE.BufferAttribute(App.data.departureArray, 3));
        App.departureArray = App.data.positionsArray[App.parameters.nbSnapShot - 1];
        App.colorPickerBufferGeometry.addAttribute('direction', new THREE.BufferAttribute(App.data.positionsArray[App.parameters.nbSnapShot], 3));
        App.colorPickerBufferGeometry.addAttribute('colorIndex', new THREE.BufferAttribute(App.data.colorIndex, 3));

        App.colorPickerBufferGeometryPointCloud = new THREE.PointCloud(App.colorPickerBufferGeometry, App.colorPickerShaderMaterial);*/

        //

        App.pointCloud = App.staticBufferGeometryPointCloud;

        App.scene.add(App.pointCloud);
        //App.colorPickerScene.add(App.colorPickerBufferGeometryPointCloud);

        //TODO disable all events related to animation


    }else if(App.parameters.nbSnapShot == 1){   //if it's just the second time, it's animated shadering turn

        //
        App.animationBufferGeometry = new THREE.BufferGeometry();

        App.data.departureArray = App.data.positionsArray[App.parameters.nbSnapShot - 1];
        App.data.directionArray = App.data.directionsArray[App.parameters.nbSnapShot - 1];

        App.animationBufferGeometry.addAttribute('position' , new THREE.BufferAttribute( App.data.departureArray, 3 ));
        App.animationBufferGeometry.addAttribute('direction' , new THREE.BufferAttribute( App.data.directionArray, 3 ));
        App.animationBufferGeometry.addAttribute('color' , new THREE.BufferAttribute( App.data.color, 3 ));

        App.animationBufferGeometry.drawcalls.push({
            start: 0,
            count: App.parameters.nbPoint,
            index: 0
        });

        if(App.fog){
            App.animationBufferGeometryPointCloud = new THREE.PointCloud(App.animationBufferGeometry, App.animatedFogShaderMaterial);
        }else{
            App.animationBufferGeometryPointCloud = new THREE.PointCloud(App.animationBufferGeometry, App.animatedShaderMaterial);
        }

        App.ANIMATION = true;

        //TODO enable events related to animation

    }else{  //if we're used to it, no big deal

    }


}

/**
 * @author Pierre Lespingal
 * @description Compute within the CPU the current position of each particle, and recompute the octree
 */
function computePositions(){
    document.body.style.cursor = 'progress';
    document.getElementById('fileLoadingProgress').value = 0;
    document.getElementById('fileLoadingProgress').style.display = 'block';


    App.timer.start();

    //linear interpolation between two snapshots
    var length = App.data.currentPositionArray.length / 3;
    var i;
    for(i = 0; i < length;i++) {
        App.data.currentPositionArray[i * 3] = App.data.departureArray[i * 3] + App.uniforms.t.value * App.data.directionArray[i * 3];
        App.data.currentPositionArray[i * 3 + 1] = App.data.departureArray[i * 3 + 1] + App.uniforms.t.value * App.data.directionArray[i * 3 + 1];
        App.data.currentPositionArray[i * 3 + 2] = App.data.departureArray[i * 3 + 2] + App.uniforms.t.value * App.data.directionArray[i * 3 + 2];
    }

    App.timer.stop("compute position");

    document.getElementById('fileLoadingProgress').value = 50;

    //Use of WW to compute the octree
    if(typeof(w) == "undefined"){
        App.timer.start();
        console.log("creating worker.js");
        var w = new Worker("js/octreeWorker.js");
        console.log("posting message");
        w.postMessage({position:App.data.currentPositionArray, index:App.data.indexArray});
        w.onmessage = function(event){

            //App.data.currentPosition = event.data.position;
            App.data.indexArray = event.data.index;
            App.octree = event.data.octree;

            w.terminate();
            w = null;

            App.timer.stop("Computing octree");
            document.getElementById('fileLoadingProgress').value = 90;

            onComputePositionsFinish();

        }
    }

}

/**
 * @description Called when the new position and the octree are both computed
 * @detail redo the scene and display the new elements
 */
function onComputePositionsFinish(){
    App.timer.start();

    if(App.WIREFRAME){
        for(var i = 0; i < App.scene.children.length; i++)
            App.scene.remove(App.scene.children[i]);
        var axisHelper = new THREE.AxisHelper(1);
        App.scene.add( axisHelper );
        App.scene.add(App.pointCloud);
        displayBox(App.octree);
    }

    App.timer.stop("display wireframe");

    //App.staticBufferGeometryPointCloud.geometry.attributes.position = new THREE.BufferAttribute(App.data.currentPosition, 3);
    App.staticBufferGeometryPointCloud.geometry.attributes.position.needsUpdate = true;
    App.pointCloud.geometry.attributes.position.needsUpdate = true;
    setStaticShaderMode();

    document.getElementById('fileLoadingProgress').value = 100;
    document.getElementById('fileLoadingProgress').style.display = 'none';
    document.body.style.cursor = 'crosshair';

}

/**
 * @author Pierre Lespingal, based on Ian Webster work on timed array processing, based on a Nicholas Zakas article
 * @description compute position while let the UI update himself often enough
 * @detail only usefull if the computing is very long, timed array processing is longer than without timout, only smoother to the user
 */
function timedChunckComputePositions(){
    var i = 0;
    App.timer.start();
    var tick = function(){
        var start = new Date().getTime();
        for(;i < App.data.currentPositionArray.length / 3 && (new Date().getTime()) - start < 50;i++){
            App.data.currentPositionArray[i * 3] = App.data.positionsArray[App.parameters.posSnapShot][i * 3] + App.uniforms.t.value * App.data.directionsArray[App.parameters.posSnapShot][i * 3];
            App.data.currentPositionArray[i * 3 + 1] = App.data.positionsArray[App.parameters.posSnapShot][i * 3 + 1] + App.uniforms.t.value * App.data.directionsArray[App.parameters.posSnapShot][i * 3 + 1];
            App.data.currentPositionArray[i * 3 + 2] = App.data.positionsArray[App.parameters.posSnapShot][i * 3 + 2] + App.uniforms.t.value * App.data.directionsArray[App.parameters.posSnapShot][i * 3 + 2];
        }
        if(i < App.data.currentPositionArray.length / 3){
            App.staticBufferGeometry.attributes.position.needsUpdate = true;
            setTimeout(tick, 1);
        }else{
            App.staticBufferGeometry.attributes.position.needsUpdate = true;
            setStaticShaderMode();
            App.timer.stop("compute positions");
            //lastTime = t;
        }
    };
    setTimeout(tick, 1);
}

/**
 * @author Pierre Lespingal
 * @description set the pointCloud in a way the positions are computed within the shader, at each frame
 * @detail The raytracer is no longer effective
 */
function setAnimationShaderMode(){
    App.scene.remove(App.pointCloud);
    App.pointCloud = App.animationBufferGeometryPointCloud;
    if(App.FOG){
        App.pointCloud.material = App.animatedFogShaderMaterial;
    }else{
        App.pointCloud.material = App.animatedShaderMaterial;
    }
    App.animationBufferGeometry.attributes.color.needsUpdate = true;
    App.scene.add(App.pointCloud);
}

/**
 * @author Pierre Lespingal
 * @description set the pointCloud in a way the positions have been already computed once within the CPU, then the current position is sent to the graphic pipeline
 * @detail Since the position aren't computed again, the animation of the particle won't be rendered
 */
function setStaticShaderMode(){
    App.scene.remove(App.pointCloud);
    App.pointCloud = App.staticBufferGeometryPointCloud;
    if(App.FOG){
        App.pointCloud.material = App.staticFogShaderMaterial;
    }else{
        App.pointCloud.material = App.staticShaderMaterial;
    }
    App.scene.add(App.pointCloud);
}

App.addScript(name, script, true);
App.addScript(name2, script2, false);
App.addScript(nameBis, scriptBis, true);

initFileReading();

if (isMobile.any())
{
    initCardboard();
}
else
{
    initSimpleView();
}
