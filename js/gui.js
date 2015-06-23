/**
 * Created by lespingal on 12/06/15.
 */

Gui = {};

/**
 * @author Pierre Lespingal <pierre.lespingal@gmail.com>
 * Setup the GUI and useful add-ons
 */
function setupGUI(){

    //Adding the fps displayer
    Gui.stats = new Stats();
    Gui.stats.setMode(0); // 0: fps, 1: ms
    // aligning the stats top-left and adding to the DOM
    Gui.stats.domElement.style.position = 'absolute';
    Gui.stats.domElement.style.left = '0px';
    Gui.stats.domElement.style.top = '0px';
    document.body.appendChild( Gui.stats.domElement );

    //Using dat-gui to give the user some tools to work with
    Gui.gui = new dat.GUI();

    var parameters = {
        "partSize" : App.uniforms.size.value,
        "speed" : speed,
        "fog" : fog,
        "fogDistance" : fogDistance,
        "frustum culling" : frustumCulling,
        "raycasting" : App.RAYCASTING,
        "geometryBuffer" : App.GEOMETRYBUFFER,
        "CPUCalcul" : App.CPUCALCUL,
        "colorPicking" : App.COLORPICKING,
        "nbPoint" : nbpoint,
        "setfog" : App.FOG
    };

    //TODO remove listen() calls, cause we don't need to check for changing values every frames, and we know when, understood ?
    //camera speed of the firstPersonControls
    var pCameraSpeed = Gui.gui.add(Camera.fpControls, 'moveSpeed').min(0.0001).max(1.000).step(0.01).listen().name("camera speed");
    pCameraSpeed.onFinishChange(function(value){
        Camera.fpControls.moveSpeed = value;
    });

    //size of the points of the pointcloud
    Gui.gui.add(App.uniforms.size, 'value', 0.0001, 1).name("point size").listen();


    Gui.gui.add(parameters, 'nbPoint', 1, 2097152).name("number of point").onFinishChange(function(value){
        App.staticBufferGeometry.drawcalls[0].count = value;
    });



    //time
    Gui.gui.add(App.uniforms.t, 'value', 0.00001, 1).name("time").listen().onFinishChange(function(){
       if(!App.play){//If we jump in time while disabling animation, let's compute again the position !
           //timedChunckComputePositions();
           computePositions();
       }
    });

    //speed of the animation
    Gui.gui.add(parameters, 'speed', 0.00001, 1).name("speed");


    //enable raycasting
    Gui.gui.add(parameters, 'raycasting').name("Raycasting").onChange(function(value){
        if(!value)
            disableMouseEventHandling();
        else
            enableMouseEventHandling();
    }).listen();

    //enable fog
    Gui.gui.add(parameters, 'setfog').name("Fog").onChange(function(value){
        if(value){
            if(App.play){
                App.pointCloud.material = App.animatedFogShaderMaterial;
            }else{
                App.pointCloud.material = App.staticFogShaderMaterial;
            }
        }else{
            if(App.play){
                App.pointCloud.material = App.animatedShaderMaterial;
            }else{
                App.pointCloud.material = App.staticShaderMaterial;
            }
        }
    });

    //enable CPU processing of positions at each frame - useless
    /*Gui.gui.add(parameters, 'CPUCalcul').name("CPU Time Calcul").onChange(function(value){
        App.CPUCALCUL = value;
        if(App.CPUCALCUL) {
            App.pointCloud.material = App.staticShaderMaterial;
            App.pointCloud.geometry = App.staticBufferGeometry;
        }else{
            App.pointCloud.material = App.animatedShaderMaterial;
            App.pointCloud.geometry = App.animationBufferGeometry;
        }
    });*/

    /*var pGeometryBuffer = Gui.gui.add(parameters, 'geometryBuffer').name("Geometry buffer");
    pGeometryBuffer.onChange(function(value){
        App.GEOMETRYBUFFER = value;
        if(App.GEOMETRYBUFFER){
            App.scene.remove(App.pointCloud);
            if(App.play) {
                App.pointCloud = App.animationBufferGeometryPointCloud;
            }else{
                App.pointCloud = App.staticBufferGeometryPointCloud;

            }
            App.scene.add(App.pointCloud);
        }else{
            App.scene.remove(App.pointCloud);
            App.pointCloud = App.geometryPointCloud;
            App.scene.add(App.pointCloud);
        }
    });*/

    /*var pColorPicking = Gui.gui.add(parameters, 'colorPicking').name("Color Picking");
    pColorPicking.onChange(function(value){
        App.COLORPICKING = value;
        if(App.COLORPICKING){
            App.renderer.domElement.addEventListener( "mousedown", getColorPickingPointCloudIntersectionIndex, false);
            App.renderer.domElement.addEventListener( "mousemove", getColorPickingPointCloudIntersectionIndex, false);
        }else{
            App.renderer.domElement.removeEventListener( "mousedown", getColorPickingPointCloudIntersectionIndex, false);
            App.renderer.domElement.removeEventListener( "mousemove", getColorPickingPointCloudIntersectionIndex, false);
        };
    });*/

    /*var pFog = Gui.gui.add(App.uniforms.fog, 'value').min(0.1).max(10.0).step(0.1).name("fog");
    pFog.onChange(function(value){
        App.uniforms.fog.value=value;
    });

    var pFogDistance = Gui.gui.add(App.uniforms.fogDistance, 'value').min(0.1).max(10.0).step(0.1).name("fog distance");
    pFogDistance.onChange(function(value){
        App.uniforms.fogDistance.value=value;
    });*/

    //enable frustum culling - useless when using one point cloud
    Gui.gui.add(parameters, 'frustum culling').onChange(function(value){
        App.pointCloud.frustumCulled = value;
    });
}

function showDebugInfo(){
    var el = document.getElementById('debugInfo');
    var info = App.renderer.info.render;
    el.innerHTML = ["Call :", info.calls, " | vertices : ", info.vertices, " | faces : ", info.faces, " | points : ", info.points].join('');//More efficient than string concatenation
}