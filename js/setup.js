/**
 * @author Arnaud Steinmetz <s.arnaud67@hotmail.fr>
 * Creation of the scene, renderer, camera.
 */
function setupScene()
{
    App.timer = new App.Timer();
    App.clock = new THREE.Clock();
    App.width = window.innerWidth;
    App.height = window.innerHeight;

    App.attributes = {
        endPosition:    {type: 'v3', value: []},
        color:          {type: 'v3', value: []}
    };

    App.simpleAttributes = {
        color:          {type: 'v3', value: []}
    };

    /*App.colorPickerAttributes = {
        endPosition:    {type: 'v3', value: []},
        colorIndex:     {type: 'v3', value: []}
    };*/

    App.data = {
        positionsArray:             [],
        directionsArray:            [],
        departureArray:             null,
        currentPositionArray:       new Float32Array(2097152*3),
        directionArray:             null,
        color:                      new Float32Array(2097152*3),
        colorIndex:                 new Float32Array(2097152*3)
    };

    var length = App.data.color.length / 3;
    for (var i = 0; i < length; i++) {
        App.data.color[3 * i] = 1.0;
        App.data.color[3 * i + 1] = 1.0;
        App.data.color[3 * i + 2] = 1.0;
        App.data.colorIndex[3 * i] = i;
        App.data.colorIndex[3 * i + 1] = i >> 8;
        App.data.colorIndex[3 * i + 2] = i >> 16;
    }

    App.parameters = {
        speed:          0.1,
        nbPoint:        2097152,
        nbSnapShot:     0,
        posSnapShot:    -1,   //Give a hint about which and which snapshot we are currently between. -1 stand for only one snapshot
        nbCalls:        1
    };

    App.uniforms = {
        t:              { type: 'f', value: 0.001},
        size:           { type: 'f', value: 0.1},
        fog:            { type: 'f', value: 1.1},
        fogDistance:    { type: 'f', value: 3.4},
        map:            { type: 't', value: THREE.ImageUtils.loadTexture("resources/textures/spark1.png")}
    };

    App.animatedShaderMaterial = new THREE.ShaderMaterial( {
        attributes:     App.attributes,
        uniforms:       App.uniforms,
        vertexShader:   App.shader.animated.nofog.vertex,
        fragmentShader: App.shader.animated.nofog.fragment,
        blending:       THREE.AdditiveBlending,
        depthTest:      false,
        transparent:    true,
        fog:            false
    });

    App.animatedFogShaderMaterial = new THREE.ShaderMaterial({
        attributes:     App.attributes,
        uniforms:       App.uniforms,
        vertexShader:   App.shader.animated.fog.vertex,
        fragmentShader: App.shader.animated.fog.fragment,
        blending:       THREE.AdditiveBlending,
        depthTest:      false,
        transparent:    true,
        fog:            false
    });

    App.staticShaderMaterial = new THREE.ShaderMaterial({
        attributes:     App.simpleAttributes,
        uniforms:       App.uniforms,
        vertexShader:   App.shader.static.nofog.vertex,
        fragmentShader: App.shader.static.nofog.fragment,

        blending:       THREE.AdditiveBlending,
        depthTest:      false,
        transparent:    true,
        fog:            false
    });

    App.staticFogShaderMaterial = new THREE.ShaderMaterial({
        attributes:     App.simpleAttributes,
        uniforms:       App.uniforms,
        vertexShader:   App.shader.static.fog.vertex,
        fragmentShader: App.shader.static.fog.fragment,

        blending:       THREE.AdditiveBlending,
        depthTest:      false,
        transparent:    true,
        fog:            false
    });

    /*App.colorPickerShaderMaterial = new THREE.ShaderMaterial({
        attributes:     App.colorPickerAttributes,
        uniforms:       App.uniforms,
        vertexShader:   document.getElementById( 'colorpickingvertexshader' ).textContent,
        fragmentShader: document.getElementById( 'colorpickingfragmentshader' ).textContent
    });*/

    App.scene = new THREE.Scene();
    //App.colorPickerScene = new THREE.Scene();

    //Adding an axis to the scene
    var axisHelper = new THREE.AxisHelper(1);
    App.scene.add( axisHelper );
    axisHelper.frustumCulled = true;

    //Adding colorPicker info on top of window
    /*App.colorPickingRenderer = new THREE.WebGLRenderer({premultipliedAlpha: false});
    App.colorPickingRenderer.setSize(App.width/10, App.height/10);
    document.getElementById('colorPickingTexture').appendChild(App.colorPickingRenderer.domElement);

    App.colorPickerTexture = generateDataTexture(App.width, App.height, new THREE.Color(0x000000));
    App.colorPickerTexture.minFilter = THREE.NearestFilter;
    var colorPickerMaterial = new THREE.SpriteMaterial({map : App.colorPickerTexture, color: 0xffffff, fog : false});
    App.colorPickerSprite = new THREE.Sprite(colorPickerMaterial);*/

    //RENDERER PROPERTIES
    App.renderer = new THREE.WebGLRenderer({ stencil: false, precision: "lowp", premultipliedAlpha: false});//Let's make thing easier for the renderer
    //App.renderer.autoClear = false; //TODO fix perf issue on firefox, profiler is pointing on renderer.clear, but it doesn't make any sense.
    App.renderer.setSize(App.width, App.height);
    document.body.appendChild( App.renderer.domElement );

    //CAMERA PROPERTIES
    //PerspectiveCamera(fov, aspect, near, far)
    Camera.camera = new THREE.PerspectiveCamera( 75, App.width / App.height, 0.00001, 200 );
    Camera.camera.rotation.order = 'ZYX'; //to fit with FPScontrols - But doesn't fit with raycaster !
    Camera.camera.position.set(0.5,0.5,0.5);

    //
    /*App.colorPickerTarget = new THREE.WebGLRenderTarget(App.width, App.height);
    App.colorPickerTarget.generateMipmaps = false;*/
}
