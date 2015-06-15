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
        "point size" : pointSize,
        "camera speed" : Camera.fpControls.moveSpeed,
        "timeOffset" : timeOffset,
        "fog" : fog,
        "fogDistance" : fogDistance,
        "frustum culling" : frustumCulling
    };

    //camera speed of the firstPersonControls
    var pCameraSpeed = Gui.gui.add(Camera.fpControls, 'moveSpeed').min(0.0001).max(1.000).step(0.01).listen().name("camera speed");
    pCameraSpeed.onFinishChange(function(value){
        Camera.fpControls.moveSpeed = value;
    });

    //size of the points of the pointcloud
    var pTime = Gui.gui.add(App.uniforms.t, 'value').min(0.0).max(1.0).step(0.001).name("time");
    pTime.onChange(function(value){
        App.uniforms.t.value=value;
    });

    //speed of the animation
    var pTimeOffset = Gui.gui.add(parameters, 'timeOffset').min(0.0).max(0.01).step(0.0001).name("timeOffset");
    pTimeOffset.onFinishChange(function(value){
        timeOffset=value;
    });

    //size of the points of the pointcloud
    var pPointSize = Gui.gui.add(App.uniforms.size, 'value').min(0.00001).max(1).step(0.0001).name("point size");
    pPointSize.onFinishChange(function(value){
        App.uniforms.size.value=value;
    });

    /*var pFog = Gui.gui.add(App.uniforms.fog, 'value').min(0.1).max(10.0).step(0.1).name("fog");
    pFog.onChange(function(value){
        App.uniforms.fog.value=value;
    });

    var pFogDistance = Gui.gui.add(App.uniforms.fogDistance, 'value').min(0.1).max(10.0).step(0.1).name("fog distance");
    pFogDistance.onChange(function(value){
        App.uniforms.fogDistance.value=value;
    });

    var pCullingSelector = Gui.gui.add(parameters, 'frustum culling');
    pCullingSelector.onChange(function(value){
        App.pointCloud.frustumCulled = value;
    });*/
}