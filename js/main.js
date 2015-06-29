/**
 * Created by lespingal on 17/06/15.
 */

/**
 * @author Arnaud Steinmetz <s.arnaud67@hotmail.fr>
 * @description Function that is used to refresh the renderer
 */
function render() {
    requestAnimationFrame(function (){
        render();
    });

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
                App.animationBufferGeometry.attributes.endPosition = new THREE.BufferAttribute(App.data.directionArray, 3);
                App.animationBufferGeometryPointCloud.geometry.attributes.endPosition.needsUpdate = true;

            }else{
                App.uniforms.t.value = 1.0;//TODO go back to static mode ?
                computePositions();
                App.PLAY = false;
            }
        }
    }

    //Display information about selected particles - take an average of 1ms
    if(App.selection != null){
        showSelectedInfo(App.selection);
    }
    if(App.intersection != null){
        showIntersectedInfo(App.intersection);
    }

    Gui.stats.update();
    showDebugInfo();

    //App.colorPickingRenderer.render(App.colorPickerSprite, Camera.camera);
    //getColorPickingPointCloudIntersectionIndex();

    App.requestId = App.renderer.render( App.scene, Camera.camera );
    Camera.controls.update(App.clock.getDelta());
}

/**
 * @author Pierre Lespingal
 * @description Display infos about the particle currently under the mouse
 * @param el
 */
function showSelectedInfo(el){
    var vec3 = new THREE.Vector3(App.data.currentPositionArray[el.index*3], App.data.currentPositionArray[el.index*3 + 1], App.data.currentPositionArray[el.index*3 + 2]);
    var vec2 = worldToScreen(vec3);
    var div = document.getElementById('info_selected');
    div.style.top = vec2.y + 'px';
    div.style.left = vec2.x + 'px';
    div.innerHTML = vec3.distanceTo(Camera.camera.position);
}

/**
 * @author Pierre Lespingal
 * @description Display infos about the selected particle
 * @param el
 */
function showIntersectedInfo(el){
    var vec3 = new THREE.Vector3(App.data.currentPositionArray[el.index*3], App.data.currentPositionArray[el.index*3 + 1], App.data.currentPositionArray[el.index*3 + 2]);
    var vec2 = worldToScreen(vec3);
    var div = document.getElementById('info_intersected');
    div.style.top = vec2.y + 'px';
    div.style.left = vec2.x + 'px';
    div.innerHTML = vec3.distanceTo(Camera.camera.position);
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
        var i = 0;

        //
        App.staticBufferGeometry = new THREE.BufferGeometry();

        App.staticBufferGeometry.addAttribute('position', new THREE.BufferAttribute(App.data.currentPositionArray, 3));
        App.staticBufferGeometry.addAttribute('color' , new THREE.BufferAttribute( App.data.color, 3));

        App.staticBufferGeometry.computeBoundingSphere();

        App.staticBufferGeometry.drawcalls.push({
            start: 0,
            count: 2097152,
            index: 0
        });

        if(App.FOG){
            App.staticBufferGeometryPointCloud = new THREE.PointCloud(App.staticBufferGeometry, App.staticFogShaderMaterial);
        }else{
            App.staticBufferGeometryPointCloud = new THREE.PointCloud(App.staticBufferGeometry, App.staticShaderMaterial);
        }

        //computePositions();

        //
        /*App.colorPickerBufferGeometry = new THREE.BufferGeometry();

        App.departureArray = App.data.positionsArray[App.parameters.nbSnapShot - 1];
        App.colorPickerBufferGeometry.addAttribute('position', new THREE.BufferAttribute(App.data.departureArray, 3));
        App.departureArray = App.data.positionsArray[App.parameters.nbSnapShot - 1];
        App.colorPickerBufferGeometry.addAttribute('endPosition', new THREE.BufferAttribute(App.data.positionsArray[App.parameters.nbSnapShot], 3));
        App.colorPickerBufferGeometry.addAttribute('colorIndex', new THREE.BufferAttribute(App.data.colorIndex, 3));

        App.colorPickerBufferGeometryPointCloud = new THREE.PointCloud(App.colorPickerBufferGeometry, App.colorPickerShaderMaterial);*/

        //

        App.pointCloud = App.staticBufferGeometryPointCloud;

        App.scene.add(App.pointCloud);
        //App.colorPickerScene.add(App.colorPickerBufferGeometryPointCloud);

        //TODO disable all event related to animation


    }else if(App.parameters.nbSnapShot == 1){   //if it's just the second time, it's animated shadering turn

        //
        App.animationBufferGeometry = new THREE.BufferGeometry();

        App.data.departureArray = App.data.positionsArray[App.parameters.nbSnapShot - 1];
        App.data.directionArray = App.data.directionsArray[App.parameters.nbSnapShot - 1];

        App.animationBufferGeometry.addAttribute('position' , new THREE.BufferAttribute( App.data.departureArray, 3 ));
        App.animationBufferGeometry.addAttribute('endPosition' , new THREE.BufferAttribute( App.data.directionArray, 3 ));
        App.animationBufferGeometry.addAttribute('color' , new THREE.BufferAttribute( App.data.color, 3 ));

        App.animationBufferGeometry.drawcalls.push({
            start: 0,
            count: 2097152,
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
 * @description Compute within the CPU the current position of each particle - takes between 10 and 20 ms
 */
function computePositions(){
    App.timer.start();
    var length = App.data.currentPositionArray.length / 3;
    for(var i = 0; i < length;i++) {
        App.data.currentPositionArray[i * 3] = App.data.departureArray[i * 3] + App.uniforms.t.value * App.data.directionArray[i * 3];
        App.data.currentPositionArray[i * 3 + 1] = App.data.departureArray[i * 3 + 1] + App.uniforms.t.value * App.data.directionArray[i * 3 + 1];
        App.data.currentPositionArray[i * 3 + 2] = App.data.departureArray[i * 3 + 2] + App.uniforms.t.value * App.data.directionArray[i * 3 + 2];
    }
    App.staticBufferGeometry.attributes.position.needsUpdate = true;
    setStaticShaderMode();
    App.timer.stop("recomputing position");
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
        //var time = App.uniforms.t.value - lastTime;
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

document.getElementById('blocker').style.display = 'none';

App.addScript(name, script);
App.addScript(name2, script2);

setupScene();
setupcamera();
setupGUI();

initFileReading();
initEventhandling();

render();