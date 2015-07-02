/**
 * Created by lespingal on 12/06/15.
 */

Gui = {};

/**
 * @author Pierre Lespingal <pierre.lespingal@gmail.com>
 * Setup the GUI and useful add-ons
 */
function setupGUI(){

    document.getElementById('fileLoadingProgress').style.display = 'none';

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

    Gui.parameters = {
        "speed"             : App.parameters.speed,
        "nbPoint"           : App.parameters.nbPoint,
        "frustum culling"   : App.FRUSTUMCULLING,
        "raycasting"        : App.RAYCASTING,
        "CPUCalcul"         : App.CPUCALCUL,
        "colorPicking"      : App.COLORPICKING,
        "setfog"            : App.FOG,
        "nbDrawCalls"       : App.parameters.nbCalls,
        "idScript"          : App.idScript
    };

    //TODO remove listen() calls, cause we don't need to check for changing values every frames, and we know when, understood ?


    Gui.userFolder = Gui.gui.addFolder('User options');

    //camera speed of the firstPersonControls
    var pCameraSpeed = Gui.userFolder.add(Camera.fpControls, 'moveSpeed').min(0.0001).max(1.000).step(0.01).listen().name("camera speed");
    pCameraSpeed.onFinishChange(function(value){
        Camera.fpControls.moveSpeed = value;
    });

    //size of the points of the pointcloud
    Gui.userFolder.add(App.uniforms.size, 'value', 0.0001, 1).name("point size").listen();

    //time
    Gui.userFolder.add(App.uniforms.t, 'value', 0.00001, 1).name("time").listen().onFinishChange(function(){
        if(!App.PLAY){//If we jump in time while disabling animation, let's compute again the position !
            //timedChunckComputePositions();
            computePositions();
        }
    });

    //speed of the animation
    Gui.userFolder.add(Gui.parameters, 'speed', 0.00001, 1).name("speed").onFinishChange(function(value){
        App.parameters.speed = value;
    });

    //Script
    Gui.script =  Gui.userFolder.add(Gui.parameters, 'idScript', {Deparis : 0, Schaaff : 1}).name("script").onFinishChange(function(value){
        App.idScript = value;
    });


    Gui.devFolder = Gui.gui.addFolder('dev options');


    Gui.devFolder.add(Gui.parameters, 'nbDrawCalls', 1, 100).step(1).name("number of calls").onFinishChange(function(value){
        App.parameters.nbCalls = value;
        App.staticBufferGeometry.offsets = App.staticBufferGeometry.drawcalls = [];
        var v = App.parameters.nbPoint/App.parameters.nbCalls;
        for(var i =0;i < App.parameters.nbCalls;i++){
            App.staticBufferGeometry.addDrawCall(i*v, v, i*v);
        }
    });

    //TODO make removing element from gui working
    /*Gui.nbPoint =  Gui.devFolder.add(Gui.parameters, 'nbPoint', 0, 0).name("number of point").onFinishChange(function(value){
        App.parameters.nbPoint = value;
        App.staticBufferGeometry.offsets = App.staticBufferGeometry.drawcalls = [];
        var nbCalls = App.parameters.nbCalls;
        var v = App.parameters.nbPoint/nbCalls;
        for(var i = 0;i < nbCalls;i++){
            App.staticBufferGeometry.addDrawCall(i*v, v, i*v);
        }
    });*/

    //enable fog
    Gui.devFolder.add(Gui.parameters, 'setfog').name("Fog").onChange(function(value){
        App.FOG = value;
        if(value){
            if(App.PLAY){
                App.pointCloud.material = App.animatedFogShaderMaterial;
            }else{
                App.pointCloud.material = App.staticFogShaderMaterial;
            }
        }else{
            if(App.PLAY){
                App.pointCloud.material = App.animatedShaderMaterial;
            }else{
                App.pointCloud.material = App.staticShaderMaterial;
            }
        }
    });

    Gui.devFolder.add(App.uniforms.fog, 'value').min(0.1).max(10.0).step(0.1).name("fog").onChange(function(value){
        App.uniforms.fog.value=value;
    });

    Gui.devFolder.add(App.uniforms.fogDistance, 'value').min(0.1).max(10.0).step(0.1).name("fog distance").onChange(function(value){
        App.uniforms.fogDistance.value=value;
    });

    //enable raycasting
    Gui.devFolder.add(Gui.parameters, 'raycasting').name("Raycasting").onChange(function(value){
        if(!value)
            disableMouseEventHandling();
        else
            enableMouseEventHandling();
    }).listen();





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



    //enable frustum culling - useless when using one point cloud
    Gui.devFolder.add(Gui.parameters, 'frustum culling').onChange(function(value){
        App.pointCloud.frustumCulled = value;
    });
}

/**
 * @author Pierre Lespingal
 * @description Show some info about rendering
 */
function showDebugInfo(){
    var el = document.getElementById('debugInfo');
    var info = App.renderer.info.render;
    el.innerHTML = ["Call :", info.calls, " | vertices : ", info.vertices, " | faces : ", info.faces, " | points : ", info.points].join('');//More efficient than string concatenation
}