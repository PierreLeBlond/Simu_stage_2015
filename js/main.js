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

    if(App.PLAY) {
        if (App.uniforms.t.value < 1.0) {
            App.uniforms.t.value += App.parameters.speed/100;
        } else {
            App.uniforms.t.value = 1.0;
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

    var i = 0;

    for(i = 0; i < App.data.color.length / 3;i++){
        App.data.color[3*i] = 1.0;
        App.data.color[3*i + 1] = 1.0;
        App.data.color[3*i + 2] = 1.0;
        App.data.colorIndex[3*i] = i;
        App.data.colorIndex[3*i + 1] = i >> 8;
        App.data.colorIndex[3*i + 2] = i >> 16;
    }

    //
    App.animationBufferGeometry = new THREE.BufferGeometry();

    App.animationBufferGeometry.addAttribute('position' , new THREE.BufferAttribute( App.data.positionArray, 3 ));
    App.animationBufferGeometry.addAttribute('endPosition' , new THREE.BufferAttribute( App.data.endPositionArray, 3 ));
    App.animationBufferGeometry.addAttribute('color' , new THREE.BufferAttribute( App.data.color, 3));

    App.animationBufferGeometryPointCloud = new THREE.PointCloud(App.animationBufferGeometry, App.animatedFogShaderMaterial);

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

    App.staticBufferGeometryPointCloud = new THREE.PointCloud(App.staticBufferGeometry, App.staticFogShaderMaterial);

    computePositions();

    //
    App.colorPickerBufferGeometry = new THREE.BufferGeometry();

    App.colorPickerBufferGeometry.addAttribute('position', new THREE.BufferAttribute(App.data.positionArray, 3));
    App.colorPickerBufferGeometry.addAttribute('endPosition', new THREE.BufferAttribute(App.data.endPositionArray, 3));
    App.colorPickerBufferGeometry.addAttribute('colorIndex', new THREE.BufferAttribute(App.data.colorIndex, 3));

    App.colorPickerBufferGeometryPointCloud = new THREE.PointCloud(App.colorPickerBufferGeometry, App.colorPickerShaderMaterial);

    //
    App.pointCloud = App.staticBufferGeometryPointCloud;

    App.scene.add(App.pointCloud);
    App.colorPickerScene.add(App.colorPickerBufferGeometryPointCloud);
}

/**
 * @author Pierre Lespingal
 * @description Compute within the CPU the current position of each particle - takes between 10 and 20 ms
 */
function computePositions(){
    App.timer.start();
    for(var i = 0; i < App.data.currentPositionArray.length / 3;i++) {
        App.data.currentPositionArray[i * 3] = App.data.positionArray[i * 3] + App.uniforms.t.value * App.data.endPositionArray[i * 3];
        App.data.currentPositionArray[i * 3 + 1] = App.data.positionArray[i * 3 + 1] + App.uniforms.t.value * App.data.endPositionArray[i * 3 + 1];
        App.data.currentPositionArray[i * 3 + 2] = App.data.positionArray[i * 3 + 2] + App.uniforms.t.value * App.data.endPositionArray[i * 3 + 2];
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
            App.data.currentPositionArray[i * 3] = App.data.positionArray[i * 3] + App.uniforms.t.value * App.data.endPositionArray[i * 3];
            App.data.currentPositionArray[i * 3 + 1] = App.data.positionArray[i * 3 + 1] + App.uniforms.t.value * App.data.endPositionArray[i * 3 + 1];
            App.data.currentPositionArray[i * 3 + 2] = App.data.positionArray[i * 3 + 2] + App.uniforms.t.value * App.data.endPositionArray[i * 3 + 2];
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

var name = "Deparis script";
var script = function(file, files, last){
    /*
     The data contains a header with two values.
     One Int : that is the number of elements of the file
     One float : I don't know what he stands for

     the data is stored as float following this pattern for each element
     pos 0 1 2
     vit 3 4 5
     ident 6
     masse 7
     epot 8
     ekin 9

     So if you wanna access this data don't forget to specify +2 to avoid picking the header infos
     */
    var array = new Float32Array(file.result);

    var nbElements = (array.length-2)/10;


    var index;
    if(App.parameters.nbSnapShot == 0){
        for(var i = 0; i<nbElements;i++)
        {
            index = array[8+i*10];
            App.data.positionArray[index*3]=App.data.currentPositionArray[index*3]=array[2+i*10];
            App.data.positionArray[index*3+1]=App.data.currentPositionArray[index*3+1]=array[3+i*10];
            App.data.positionArray[index*3+2]=App.data.currentPositionArray[index*3+2]=array[4+i*10];
        }
    }
    else
    {
        for(var i = 0; i<nbElements;i++)
        {
            index = array[8+i*10];
            var x = array[2+i*10];
            var y = array[3+i*10];
            var z = array[4+i*10];

            var dx = x-App.data.positionArray[index*3];
            var dy = y-App.data.positionArray[index*3+1];
            var dz = z-App.data.positionArray[index*3+2];

            //Correcting the vector direction for the elements going outside the box
            //To be exact, you can check in the shader if the position goes outside the box, then you change it. Instead of doing that here.
            if(dx > 0.5)
            {
                App.data.positionArray[index*3]+=1;
                dx = -(App.data.positionArray[index*3]-x);
            }
            else if(dx < -0.5)
            {
                App.data.positionArray[index*3]-=1;
                dx = -(App.data.positionArray[index*3]-x);
            }


            if(dy > 0.5)
            {
                App.data.positionArray[index*3+1]+=1;
                dy = -(App.data.positionArray[index*3+1]-y);
            }
            else if(dy < -0.5)
            {
                App.data.positionArray[index*3+1]-=1;
                dy = -(App.data.positionArray[index*3+1]-y);
            }


            if(dz > 0.5)
            {
                App.data.positionArray[index*3+2]+=1;
                dz = -(App.data.positionArray[index*3+2]-z);
            }
            else if(dz < -0.5)
            {
                App.data.positionArray[index*3+2]-=1;
                dz = -(App.data.positionArray[index*3+2]-z);
            }

            App.data.endPositionArray[index*3]= dx;
            App.data.endPositionArray[index*3+1]= dy;
            App.data.endPositionArray[index*3+2]= dz;
        }
    }

    //Checking if it's the last file reading
    if(last)
    {
        App.timer.stop("populating buffer");

        //If it's not the first part file reading, then call loadData that will add the elements to the scene
        if(App.parameters.nbSnapShot != 0)
        {
            App.timer.start();
            loadData();
            App.timer.stop("Load Data");
        }
        App.parameters.nbSnapShot++;

    }
    file = null;
};


App.addScript(name, script);

setupScene();
setupcamera();
setupGUI();

initFileReading();
initEventhandling();

render();