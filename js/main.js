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

    if(App.play) {
        if (App.uniforms.t.value < 1.0) {
            App.uniforms.t.value += speed/100;
        } else {
            App.uniforms.t.value = 1.0;
        }
    }

    /*if(App.CPUCALCUL){
     for(var i = 0; i < endPositionArray.length / 3;i++){
     App.pointCloud.geometry.attributes.position.array[i*3] = positionArray[i*3] + App.uniforms.t*endPositionArray[i*3];
     App.pointCloud.geometry.attributes.position.array[i*3 + 1] = positionArray[i*3 + 1] + App.uniforms.t*endPositionArray[i*3 + 1];
     App.pointCloud.geometry.attributes.position.array[i*3 + 2] = positionArray[i*3 + 2] + App.uniforms.t*endPositionArray[i*3 + 2];
     currentPositionArray[i*3] = positionArray[i*3] + App.uniforms.t.value*endPositionArray[i*3];
     currentPositionArray[i*3 + 1] = positionArray[i*3 + 1] + App.uniforms.t.value*endPositionArray[i*3 + 1];
     currentPositionArray[i*3 + 2] = positionArray[i*3 + 2] + App.uniforms.t.value*endPositionArray[i*3 + 2];
     }

     App.pointCloud.geometry.attributes.position.needsUpdate = true;
     }*/

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
    App.renderer.render( App.scene, Camera.camera );
    Camera.controls.update(App.clock.getDelta());
}

/**
 * @author Pierre Lespingal
 * @description Display infos about the particle currently under the mouse
 * @param el
 */
function showSelectedInfo(el){
    var vec3 = new THREE.Vector3(el.object.geometry.attributes.position.array[el.index*3], el.object.geometry.attributes.position.array[el.index*3 + 1], el.object.geometry.attributes.position.array[el.index*3 + 2]);
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
    var vec3 = new THREE.Vector3(el.object.geometry.attributes.position.array[el.index*3], el.object.geometry.attributes.position.array[el.index*3 + 1], el.object.geometry.attributes.position.array[el.index*3 + 2]);
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
        //Beginning the loop at 1 to avoid deleting the AxisHelper and colorPicking sprite
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

    var i = 0;

    for(i = 0; i < color.length / 3;i++){
        color[3*i] = 1.0;
        color[3*i + 1] = 1.0;
        color[3*i + 2] = 1.0;
        colorIndex[3*i] = i;
        colorIndex[3*i + 1] = i >> 8;
        colorIndex[3*i + 2] = i >> 16;
    }

    //
    App.animationBufferGeometry = new THREE.BufferGeometry();

    App.animationBufferGeometry.addAttribute('position' , new THREE.BufferAttribute( positionArray, 3 ));
    App.animationBufferGeometry.addAttribute('endPosition' , new THREE.BufferAttribute( endPositionArray, 3 ));
    App.animationBufferGeometry.addAttribute('color' , new THREE.BufferAttribute( color, 3));

    App.animationBufferGeometryPointCloud = new THREE.PointCloud(App.animationBufferGeometry, App.animationShaderMaterial);

    //
    App.staticBufferGeometry = new THREE.BufferGeometry();

    App.staticBufferGeometry.addAttribute('position', new THREE.BufferAttribute(currentPositionArray, 3));
    App.staticBufferGeometry.addAttribute('color' , new THREE.BufferAttribute( color, 3));

    App.staticBufferGeometry.computeBoundingSphere();

    App.staticBufferGeometry.drawcalls.push({
        start: 0,
        count: 2097152,
        index: 0
    });

    App.staticBufferGeometryPointCloud = new THREE.PointCloud(App.staticBufferGeometry, App.staticShaderMaterial);

    computePositions();

    //
    App.colorPickerBufferGeometry = new THREE.BufferGeometry();

    App.colorPickerBufferGeometry.addAttribute('position', new THREE.BufferAttribute(positionArray, 3));
    App.colorPickerBufferGeometry.addAttribute('endPosition', new THREE.BufferAttribute(endPositionArray, 3));
    App.colorPickerBufferGeometry.addAttribute('colorIndex', new THREE.BufferAttribute(colorIndex, 3));

    App.colorPickerBufferGeometryPointCloud = new THREE.PointCloud(App.colorPickerBufferGeometry, App.colorPickerShaderMaterial);

    //
    /*var geometry = new THREE.Geometry();

    geometry.computeBoundingSphere();

    for(i = 0;i < positionArray.length / 3;i++ ){
        geometry.vertices.push(new THREE.Vector3(positionArray[3*i], positionArray[3*i + 1], positionArray[3*i + 2]));
        App.animationShaderMaterial.attributes.endPosition.value.push(new THREE.Vector3(endPositionArray[3*i], endPositionArray[3*i + 1], endPositionArray[3*i + 2]));
        App.animationShaderMaterial.attributes.color.value.push(new THREE.Vector3(color[3*i], color[3*i + 1], color[3*i + 2]));
        App.staticShaderMaterial.attributes.color.value.push(new THREE.Vector3(color[3*i], color[3*i + 1], color[3*i + 2]));

    }
    App.animationShaderMaterial.attributes.color.needsUpdate = true;
    App.animationShaderMaterial.attributes.endPosition.needsUpdate = true;
    App.staticShaderMaterial.attributes.color.needsUpdate = true;

    App.geometryPointCloud = new THREE.PointCloud(geometry, App.animationShaderMaterial);*/

    //
    App.pointCloud = App.staticBufferGeometryPointCloud;

    App.scene.add(App.pointCloud);
    App.colorPickerScene.add(App.colorPickerBufferGeometryPointCloud);
}

/**
 * @author Pierre Lespingal
 * @description Compute within the CPU the current position of each particle
 */
function computePositions(){
    App.timer.start();
    for(var i = 0; i < currentPositionArray.length / 3;i++) {
        currentPositionArray[i * 3] = positionArray[i * 3] + App.uniforms.t.value * endPositionArray[i * 3];
        currentPositionArray[i * 3 + 1] = positionArray[i * 3 + 1] + App.uniforms.t.value * endPositionArray[i * 3 + 1];
        currentPositionArray[i * 3 + 2] = positionArray[i * 3 + 2] + App.uniforms.t.value * endPositionArray[i * 3 + 2];
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
        for(;i < currentPositionArray.length / 3 && (new Date().getTime()) - start < 50;i++){
            currentPositionArray[i * 3] = positionArray[i * 3] + App.uniforms.t.value * endPositionArray[i * 3];
            currentPositionArray[i * 3 + 1] = positionArray[i * 3 + 1] + App.uniforms.t.value * endPositionArray[i * 3 + 1];
            currentPositionArray[i * 3 + 2] = positionArray[i * 3 + 2] + App.uniforms.t.value * endPositionArray[i * 3 + 2];
        }
        if(i < currentPositionArray.length / 3){
            App.staticBufferGeometry.attributes.position.needsUpdate = true;
            setTimeout(tick, 0);
        }else{
            App.staticBufferGeometry.attributes.position.needsUpdate = true;
            setStaticShaderMode();
            App.timer.stop("compute positions");
            //lastTime = t;
        }
    };
    setTimeout(tick, 25);
}

/**
 * @author Pierre Lespingal
 * @description set the pointCloud in a way the positions are computed within the shader, at each frame
 * @detail The raytracer is no longer effective
 */
function setAnimationShaderMode(){
    App.scene.remove(App.pointCloud);
    App.pointCloud = App.animationBufferGeometryPointCloud;
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
    App.scene.add(App.pointCloud);
}

setupScene();
setupcamera();
setupGUI();

initFileReading();
initEventhandling();

render();