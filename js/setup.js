

var pointSize = 0.025;
var defaultSpeed = 1.0;
var fog = 1.1;
var fogDistance = 3.4;
var frustumCulling = true;

var pointCloudsPart = [];



var nbCloud = 0;

var first = true;
var positionArray = new Float32Array(2097152*3);
var endPositionArray = new Float32Array(2097152*3);
var t = 0.0;
var timeOffset = 0.0;



/**
 * @author Arnaud Steinmetz <s.arnaud67@hotmail.fr>
 * Creation of the scene, renderer, camera.
 */
function setupScene()
{
    App.clock = new THREE.Clock();
    App.width = window.innerWidth;
    App.height = window.innerHeight;

    App.attributes = {
        endPosition: { type:'v3', value:null }
    };

    App.uniforms = {
        t:              { type: 'f', value: 0.0},
        size:           { type: 'f', value: 0.1 },
        color:          { type: "c", value: new THREE.Color( 0xffffff ) },
        fog:            { type: 'f', value: 1.1},
        fogDistance:    { type: 'f', value: 3.4}
    };

    App.shaderMaterial = new THREE.ShaderMaterial( {
        attributes:     App.attributes,
        uniforms:       App.uniforms,
        vertexShader:   document.getElementById( 'vertexshader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
    });

    App.scene = new THREE.Scene();

    //Adding an axis to the scene
    var axisHelper = new THREE.AxisHelper(1);
    App.scene.add( axisHelper );

    //RENDERER PROPERTIES
    App.renderer = new THREE.WebGLRenderer({ antialias: false });
    App.renderer.setSize(App.width, App.height);
    document.body.appendChild( App.renderer.domElement );

    //CAMERA PROPERTIES
    //PerspectiveCamera(fov, aspect, near, far)
    Camera.camera = new THREE.PerspectiveCamera( 75, App.width / App.height, 0.00001, 200 );
    Camera.camera.rotation.order = 'ZYX'; //to fit with FPScontrols
    Camera.camera.position.set(0.5,0.5,0.5);
}

/**
 * @author mrdoob
 * @description when resizing the windows, takes care that the ratio and aspect stays good
 */
function onWindowResize() {
    App.width = window.innerWidth;
    App.height = window.innerHeight;

    Camera.camera.aspect = App.width / App.height;
    Camera.camera.updateProjectionMatrix();

    App.renderer.setSize( App.width, App.height );

}
//adding a listener to resize the window when it changes
window.addEventListener( 'resize', onWindowResize, false );
