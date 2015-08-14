/**
 * Created by lespingal on 15/06/15.
 * pierre.lespingal@gmail.com
 */

/**
 *  Global namespace
 *  @namespace
 */
SIMU = SIMU || {};

/**
 * @description constructor SIMU.View
 * @constructor
 *
 * @property {boolean} isShown                                                  - True if the view is shown to the user
 *
 * @property {SIMU.Scene} scene                                                 - The scene to display on this view
 * @property {THREE.WebGLRenderer} renderer                                     - The default renderer
 * @property {THREE.OculusRiftEffect} oculusRenderer                            - The oculus renderer
 * @property {THREE.StereoEffect} cardboardRenderer                             - The cardboard renderer
 *
 * @property {*} currentRenderer                                                - The current used renderer
 *
 * @property {object} sceneParameters                                           - A bunch of parameters to control the scene with dat.GUI
 *      @property {number} sceneParameters.t                                    - The current time relative to the simulation
 *      @property {number} sceneParameters.deltaT                              - The current elapsed time relative to the computer
 *      @property {boolean} sceneParameters.active                              - True if the current point cloud ids displayed
 *      @property {number} sceneParameters.pointSize                            - Size of the particles within the current point cloud
 *      @property {boolean} sceneParameters.fog                                 - True if fog is enable
 *      @property {boolean} sceneParameters.blink                               - True if blinking effect is enable
 *      @property {boolean} sceneParameters.globalCamera                          - True if the current used camera is the global one
 *      @property {boolean} sceneParameters.isStatic                            - True if we are in static mode
 *      @property {number[]} sceneParameters.color                              - The default color of the current point cloud
 *      @property {number} sceneParameters.idInfo                               - The id of the current highlighting info in the current point cloud
 *      @property {number} sceneParameters.idTexture                            - The id of the currently used texture in the current point cloud
 *      @property {number} sceneParameters.idBlending                           - The id of the blending mode used in the current point cloud
 *      @property {boolean} sceneParameters.frustumCulling                      - True if view frustum culling is enabled
 *      @property {number} sceneParameters.levelOfDetail                        - Level of detail of the point cloud, i.e. fraction of the entire cloud being displayed
 *      @property {number} sceneParameters.idParam                              - Id of the parameters used to highlight information in the shader
 *      @property {boolean} sceneParameters.log                                  - True if we want log interpolation, else it's linear
 *
 * @property {THREE.PerspectiveCamera} camera                                   - the currently used camera
 * @property {THREE.PerspectiveCamera} globalCamera                             - the global camera
 * @property {THREE.PerspectiveCamera[]} fixedCameras                           - Array of positioned cameras
 * @property {THREE.PerspectiveCamera} rotatingCamera                           - Camera rotating around the cube
 *
 * @property {number} renderId                                                  - The id of the rendering loop, to cancel it if necessary
 *
 * @property {dat.GUI} gui                                                      - A GUI to control the scene
 * @property {Stats} stats                                                      - An element to display performance info, like fps
 *
 * @property {Node} info                                                        - An element to display information about selected point
 * @property {Node} debug                                                       - An element to display information abour rendering
 *
 * @property {Node} domElement                                                  - The element where we set the view
 *
 * @property {number} width                                                     - the view's width
 * @property {number} height                                                    - the view's height
 * @property {number} left                                                      - the view's left
 * @property {number} top                                                       - the view's top
 *
 * @property {THREE.Clock} clock                                                - A THREE.js clock
 *
 * @property {object} infoList                                                  - The dat.GUI element for the highlighting info choice
 */
SIMU.View = function () {

    this.isShown                    = false;

    this.scene                      = null;
    this.renderer                   = null;
    this.oculusRenderer             = null;
    this.cardboardRenderer          = null;

    this.currentRenderer            = null;

    this.sceneParameters            = {
        t                           : 0,
        deltaT                      : 0,
        active                      : false,
        pointSize                   : 0.5,
        fog                         : false,
        blink                       : false,
        globalCamera                : false,
        isStatic                    : true,
        color                       : [ 255, 255, 255],
        idInfo                      : -1,
        idTexture                   : -1,
        idBlending                  : -1,
        frustumCulling              : true,
        levelOfDetail               : 4,
        idParam                     : 0,
        log                         : false
    };

    this.camera                     = null;
    this.globalCamera               = null;
    this.fixedCameras               = [];
    this.rotatingCamera             = null;
    this.cameraState                = THREE.PerspectiveCamera.CameraState.FREE;

    this.renderId                   = -1;

    //UI elements
    this.gui                        = null;
    this.stats                      = null;

    this.info                       = document.createElement("div");
    this.debug                      = document.createElement("div");

    //Display parameters
    this.domElement                 = document.createElement("div");

    this.width                      = 0;
    this.height                     = 0;
    this.left                       = 0;
    this.top                        = 0;

    this.clock                      = new THREE.Clock();

    this.infoList                   = null;
};

/**
 * Set the global camera
 * @param {THREE.PerspectiveCamera} camera - The global camera
 */
SIMU.View.prototype.setGlobalCamera = function(camera){
    this.globalCamera = camera;
};

/**
 * Set the fixed cameras array
 * @param {THREE.PerspectiveCamera[]} cameras - The array of fixed cameras
 */
SIMU.View.prototype.setFixedCameras = function(cameras){
    this.fixedCameras = cameras;
};

SIMU.View.prototype.setRotatingCamera = function(camera){
    this.rotatingCamera = camera;
};

/**
 * Set the current camera as the fixed camera from the given id
 * @param {number} cameraId - The id of the wanted fixed camera
 */
SIMU.View.prototype.enableFixedCamera = function(cameraId){
    if(cameraId != 'undefined'){
        if(this.camera.controls) {
            this.camera.controls.enabled = false;
        }
        this.camera = this.fixedCameras[cameraId];
        this.cameraState = THREE.PerspectiveCamera.CameraState.FIXED;
    }
};

SIMU.View.prototype.disableFixedCamera = function(){
    if(this.sceneParameters.globalCamera){
        this.camera = this.globalCamera;
        this.camera.controls.enabled = true;
    }else{
        this.camera = this.scene.privateCamera;
        this.camera.controls.enabled = true;
    }
    this.cameraState = THREE.PerspectiveCamera.CameraState.FREE;
};

SIMU.View.prototype.switchRotatedCamera = function(){
    if(this.cameraState == THREE.PerspectiveCamera.CameraState.FREE){
        this.camera.controls.enabled = false;
        this.camera = this.rotatingCamera;
        this.cameraState = THREE.PerspectiveCamera.CameraState.ROTATING;
    }else if(this.cameraState == THREE.PerspectiveCamera.CameraState.ROTATING){
        if(this.sceneParameters.globalCamera){
            this.camera = this.globalCamera;
            this.camera.controls.enabled = true;
        }else{
            this.camera = this.scene.privateCamera;
            this.camera.controls.enabled = true;
        }
        this.cameraState = THREE.PerspectiveCamera.CameraState.FREE;
    }
};

/**
 * Set the scene attribute
 * @param {SIMU.Scene} scene - The scene
 */
SIMU.View.prototype.setScene = function(scene){
    this.scene = scene;
};

/**
 * Set the DomElement attribute
 * @param {Node} el - The dom element
 */
SIMU.View.prototype.setDomElement = function(el){
    this.domElement = el;
};

/**
 * @description Setup the scene, the renderer and the camera
 * @param {number} left                 - The left css attribute
 * @param {number} top                  - The top css attribute
 * @param {number} width                - The width css attribute
 * @param {number} height               - The height css attribute
 */
SIMU.View.prototype.setupView = function(left, top, width, height){

    if(!this.domElement) {
        console.log("Error : View does not have a dom element");
    }else if(!this.scene) {
        console.log("Error : View does not have a scene");
    }else{
        this.domElement.class = 'view';
        this.domElement.style.position = 'relative';
        this.domElement.style.display = 'inline-block';

        this.width = width;
        this.height = height;

        //RENDERER PROPERTIES
        this.renderer = new THREE.WebGLRenderer({ stencil: false, precision: "lowp", premultipliedAlpha: false});
        this.renderer.setSize(this.width, this.height);
        this.domElement.appendChild( this.renderer.domElement );

        this.oculusRenderer = new THREE.OculusRiftEffect(this.renderer);
        this.cardboardRenderer = new THREE.StereoEffect(this.renderer);
        this.cardboardRenderer.eyeSeparation = 0.1;             // Here you can caliber the stereo effect for cardboard
        this.cardboardRenderer.setSize(this.width, this.height);

        this.currentRenderer = this.renderer;


        this.camera = this.scene.privateCamera;
        this.camera.useFPSControls(this);

        this.camera.controls.enabled = false;


        this.resize(width, height, left, top);

        //Events listener
        this.currentRenderer.domElement.addEventListener('mousedown', this.getMouseIntersection.bind(this), false);
        this.currentRenderer.domElement.addEventListener('dblclick', this.reachMouseFocus.bind(this), false);
    }
};

/**
 * Setup a dat.GUI, stats and debug infos
 */
SIMU.View.prototype.setupGui = function(){

    if(!this.scene){
        console.log("Error : View does not have a scene");
    }else {
        var that = this;

        this.stats = new Stats();
        this.stats.setMode(0);

        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.right = "0px";
        this.stats.domElement.style.bottom = "0px";

        this.domElement.appendChild(this.stats.domElement);


        this.gui = new dat.GUI({autoPlace: false});

        this.gui.domElement.style.position = 'absolute';
        this.gui.domElement.style.left = '0px';
        this.gui.domElement.style.bottom = '40px';


        var viewFolder = this.gui.addFolder('View');

        viewFolder.add(this.sceneParameters, 'globalCamera').name("Use global camera").onFinishChange(function () {
            if (that.sceneParameters.globalCamera && that.cameraState == THREE.PerspectiveCamera.CameraState.FREE) {
                that.camera.controls.enabled = false;
                that.camera = that.globalCamera;
                that.camera.controls.enabled = true;
            } else if (that.cameraState == THREE.PerspectiveCamera.CameraState.FREE){
                that.camera.controls.enabled = false;
                that.camera = that.scene.privateCamera;
                that.camera.controls.enabled = true;
            }
        });

        viewFolder.add(this.sceneParameters, 'frustumCulling').name('Enable culling');

        var dataFolder = this.gui.addFolder('Data');

        dataFolder.add(this.sceneParameters, 'active').name("Activate data").onFinishChange(function () {
            if (that.sceneParameters.active) {
                that.scene.activateCurrentData();
                that.updateUIinfoList();
            } else {
                that.scene.deactivateCurrentData();
            }
        });

        dataFolder.add(this.sceneParameters, 'fog').name("Enable fog").onFinishChange(function (value) {
            that.scene.setCurrentDataFog(value);
        });

        dataFolder.add(this.sceneParameters, 'blink').name("Enable blink effect").onFinishChange(function (value) {
            that.scene.setCurrentDataBlink(value);
        });

        dataFolder.add(this.sceneParameters, 'idTexture', {spark: 0, star: 1, starburst: 2, flatstar: 3}).name('Texture').onFinishChange(function (value) {
            that.scene.setCurrentDataTexture(value);
        });

        dataFolder.add(this.sceneParameters, 'pointSize', 0.0001, 10).name("Point size").onFinishChange(function (value) {
            that.scene.setCurrentDataPointSize(value);
        });

        dataFolder.addColor(this.sceneParameters, 'color').name("Color").onChange(function (value) {
            that.scene.setCurrentDataColor(value);
        });

        dataFolder.add(this.sceneParameters, 'levelOfDetail', 0, 4).name("Level of detail").onChange(function (value) {
            that.scene.setCurrentDataLevelOfDetail(value);
        });

        var blendingType = {
            none: 0,
            normal: 1,
            additive: 2,
            subtractive: 3,
            multiply: 4
        };

        dataFolder.add(this.sceneParameters, 'idBlending', blendingType).name('Blending type').onChange(function (value) {
            that.scene.setCurrentDataBlendingType(value);
        });

        dataFolder.add(this.sceneParameters, 'log').name('log interpolation').onChange(function (value) {
            that.scene.setCurrentDataLogInterpolation(value);
        });

        var param = {
            none: 0,
            lightning: 1,
            blink: 2,
            color: 3,
            size: 4
        };

        dataFolder.add(this.sceneParameters, 'idParam', param).name('How to highlight info').onChange(function(value){
            that.scene.setCurrentDataParam(value);
        });

        this.infoList = this.gui.__folders.Data.add(this.scene.parameters, 'idInfo', {none: 0}).name('Info to highlight');


        this.domElement.appendChild(this.gui.domElement);

        this.debug.style.position = 'absolute';
        this.debug.style.left = '0px';
        this.debug.style.bottom = '0px';
        this.debug.style.color = 'white';

        this.domElement.appendChild(this.debug);

        this.info.style.position = 'absolute';
        this.info.className = 'info';
        this.info.style.left = '30%';
        this.info.style.bottom = '20px';
        this.info.style.color = 'white';
        this.info.style.whiteSpace = 'pre-wrap';

        this.domElement.appendChild(this.info);
    }
};

/**
 * Display the UI
 */
SIMU.View.prototype.showGui = function(){
    this.gui.domElement.style.display = "block";
    this.stats.domElement.style.display = "block";
    this.info.style.display = "block";
    this.debug.style.display = "block";
};

/**
 * Hide the UI
 */
SIMU.View.prototype.hideGui = function(){
    this.gui.domElement.style.display = "none";
    this.stats.domElement.style.display = "none";
    this.info.style.display = "none";
    this.debug.style.display = "none";
};

/**
 * Update the infoList dat.GUI element, to match with the news data and its information
 */
SIMU.View.prototype.updateUIinfoList = function(){
    var that = this;

    var currentRenderableData = this.scene.renderableDatas[this.scene.currentRenderableDataId];
    if (currentRenderableData.isReady) {
        var info = {none: 0};
        var snapInfo = currentRenderableData.data.snapshots[currentRenderableData.data.currentSnapshotId].info;
        for (var i = 0; i < snapInfo.length; i++) {
            info[snapInfo[i].name] = i + 1;
        }

        this.gui.__folders.Data.remove(this.infoList);

        this.infoList = this.gui.__folders.Data.add(this.sceneParameters, 'idInfo', info).name('Info to highlight').onFinishChange(function (value) {
            var currentRenderableData = that.scene.renderableDatas[that.scene.currentRenderableDataId];
            if (value != 0 && snapInfo[value - 1].min <= snapInfo[value - 1].max) {
                var min = snapInfo[value - 1].min;
                var max = snapInfo[value - 1].max;
                currentRenderableData.uniforms.minInfo.value = min;
                currentRenderableData.uniforms.maxInfo.value = max;
                currentRenderableData.idInfo = value - 1;

                currentRenderableData.data.currentInfo = snapInfo[value - 1].value;
                currentRenderableData.data.currentInfoIsSet = true;
                currentRenderableData.resetData();

                if(that.scene.parameters.shaderType == SIMU.ShaderType.STATIC){
                    that.scene.setShaderType(SIMU.ShaderType.PARAMETRICSTATIC);
                }else if(that.scene.parameters.shaderType == SIMU.ShaderType.ANIMATED){
                    that.scene.setShaderType(SIMU.ShaderType.PARAMETRICANIMATED);
                }
            }else{
                if(that.scene.parameters.shaderType == SIMU.ShaderType.PARAMETRICSTATIC){
                    that.scene.setShaderType(SIMU.ShaderType.STATIC);
                }else if(that.scene.parameters.shaderType == SIMU.ShaderType.PARAMETRICANIMATED){
                    that.scene.setShaderType(SIMU.ShaderType.ANIMATED);
                }
                currentRenderableData.data.currentInfoIsSet = false;
            }
        })
    }
};

/**
 * Update recursively the gui
 * @param {dat.GUI} gui - The gui or part of the gui to update
 */
SIMU.View.prototype.updateGuiDisplay = function(gui) {
    for (var i in gui.__controllers) {
        gui.__controllers[i].updateDisplay();
    }
    for (var f in gui.__folders) {
        this.updateGuiDisplay(gui.__folders[f]);
    }
};


/**
 * Set the id of the current renderable data
 * @detail Update the ui to match the new current renderable data
 * @param {number} id - The new id
 */
SIMU.View.prototype.setCurrentRenderableData = function(id) {
    var currentRenderableData           = this.scene.renderableDatas[id];
    this.sceneParameters.active         = currentRenderableData.isActive;
    this.sceneParameters.pointSize      = currentRenderableData.uniforms.size.value;
    this.sceneParameters.color          = currentRenderableData.defaultColor;
    this.sceneParameters.idTexture      = currentRenderableData.idTexture;
    this.sceneParameters.idBlending     = currentRenderableData.idBlending;
    this.sceneParameters.levelOfDetail  = currentRenderableData.levelOfDetail;
    this.sceneParameters.fog            = currentRenderableData.uniforms.fog.value == 1;
    this.sceneParameters.blink          = currentRenderableData.uniforms.blink.value == 1;
    this.sceneParameters.idParam        = currentRenderableData.uniforms.paramType.value;
    this.sceneParameters.idInfo         = currentRenderableData.idInfo;
    this.sceneParameters.log            = currentRenderableData.uniforms.logInterpolation.value == 1;

    this.updateUIinfoList();

    this.updateGuiDisplay(this.gui);
};

/**
 * Process all stuff related to animation
 */
SIMU.View.prototype.animate = function(){
    //If the camera is free, i.e. not moving toward a particle
    if (this.cameraState == THREE.PerspectiveCamera.CameraState.FREE) {
        this.camera.controls.update(this.clock.getDelta());
    } else if (this.cameraState == THREE.PerspectiveCamera.CameraState.TARGETING){
        this.time += 1 / 60;
        if (this.time < 1.0) {
            this.camera.position.set(this.origin.x + this.time * this.objectif.x,
                this.origin.y + this.time * this.objectif.y,
                this.origin.z + this.time * this.objectif.z);
        } else {
            this.cameraState = THREE.PerspectiveCamera.CameraState.FREE;
        }
    } else if (this.cameraState == THREE.PerspectiveCamera.CameraState.ROTATING){

    }

    //TODO Update frustum only if camera has changed
    if(this.scene.parameters.frustumCulling) {
        this.camera.updateMatrix();
        this.camera.updateMatrixWorld();
        this.camera.matrixWorldInverse.getInverse(this.camera.matrixWorld);

        this.camera.frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse));
    }
};

/**
 * Render the view
 */
SIMU.View.prototype.render = function(){

    var that = this;
    this.renderId = requestAnimationFrame(function () {
        that.render();
    });

    this.animate();

    if(this.sceneParameters.frustumCulling) {
        this.scene.computeCulling(this.camera);
    }

    this.scene.setCurrentTime(this.clock.elapsedTime);

    this.currentRenderer.render(this.scene.scene, this.camera);

    this.showDebuginfo();
    this.stats.update();
};

/**
 * Stop the current rendering loop
 */
SIMU.View.prototype.stopRender = function(){
    cancelAnimationFrame(this.renderId);
};

/**
 * Show some info about rendering
 */
SIMU.View.prototype.showDebuginfo = function(){
    var info = this.renderer.info.render;
    this.debug.innerHTML = ["Call :", info.calls, " | vertices : ", info.vertices, " | faces : ", info.faces, " | points : ", info.points].join('');//More efficient than string concatenation
};

/**
 * @description resize and adjust the view in order to render the scene properly
 * @param {number} width                        - The width's css property
 * @param {number} height                       - The height's css property
 * @param {number} left                         - The left's css property
 * @param {number} top                          - The top's css property
 */
SIMU.View.prototype.resize = function(width, height, left, top){
    this.width = width;
    this.height = height;

    this.top = top;
    this.left = left;

    this.domElement.style.top = top + 'px';
    this.domElement.style.left = left + 'px';
    this.domElement.style.width = width + 'px';
    this.domElement.style.height = height + 'px';

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.currentRenderer.setSize( this.width, this.height );
};

/**
 * Try to get the particle which is pointed by the mouse
 * @detail If found, the point get colored, and information on it is displayed
 * @param event
 */
SIMU.View.prototype.getMouseIntersection = function(event){

    var mouse = new THREE.Vector2(
        ( (event.clientX - this.domElement.getBoundingClientRect().left) / this.width ) * 2 - 1,
        -( (event.clientY - this.domElement.getBoundingClientRect().top) /  this.height) * 2 + 1
    );

    var target = null;
    var newTarget = null;

    for(var i = 0; i < this.scene.renderableDatas.length;i++){
        if(this.scene.renderableDatas[i].isActive) {
            newTarget = this.scene.renderableDatas[i].getIntersection(mouse, this.camera);
            if (newTarget && (!target || newTarget.distance < target.distance)) {
                target = newTarget;
            }
        }
    }
    if(target){
        negate(target.renderableData.data.currentColor, target.index);
        this.showInfo(target);
        target.renderableData.pointCloud.geometry.attributes.color.needsUpdate = true;
    }
    if(this.scene.target) {
        negate(this.scene.target.renderableData.data.currentColor, this.scene.target.index);
        this.scene.target.renderableData.pointCloud.geometry.attributes.color.needsUpdate = true;

    }
    this.scene.target = target;
};

/**
 * Start to move the camera to reach the selected point
 * @detail Takes an average of 1s, with no camera interaction enabled during this time
 */
SIMU.View.prototype.reachMouseFocus = function(){
    if(this.scene.target && this.cameraState == THREE.PerspectiveCamera.CameraState.FREE) {
        var x = this.scene.target.renderableData.pointCloud.geometry.attributes.position.array[this.scene.target.index * 3];
        var y = this.scene.target.renderableData.pointCloud.geometry.attributes.position.array[this.scene.target.index * 3 + 1];
        var z = this.scene.target.renderableData.pointCloud.geometry.attributes.position.array[this.scene.target.index * 3 + 2];

        this.origin = new THREE.Vector3(this.camera.position.x, this.camera.position.y, this.camera.position.z);
        this.objectif = new THREE.Vector3(x - this.origin.x, y - this.origin.y, z - this.origin.z);
        this.time = 0.0;
        this.cameraState = THREE.PerspectiveCamera.CameraState.TARGETING;
    }
};

/**
 * Display information about the selected point
 * @param {object} point                    - the selected point
 */
SIMU.View.prototype.showInfo = function(point){
    var infos = point.renderableData.data.snapshots[point.renderableData.data.currentSnapshotId].info;
    var result = [];
    result.push("position : x = ");
    result.push(point.renderableData.data.currentPosition[point.index*3]);
    result.push(",y = ");
    result.push(point.renderableData.data.currentPosition[point.index*3 + 1]);
    result.push(",z = ");
    result.push(point.renderableData.data.currentPosition[point.index*3 + 2]);
    result.push("\n");
    for(var i = 0; i < infos.length;i++){
        result.push(infos[i].name);
        result.push(" : ");
        result.push(infos[i].value[point.index]);
        result.push("\n");
    }
    this.info.innerHTML = result.join('');
};

/**
 * Set the camera in order to control it as in a FPS
 * @param {object} view - The view to attach the camera to
 */
THREE.PerspectiveCamera.prototype.useFPSControls = function(view){
    if(this.controls){
        this.controls.enabled = false;
    }
    if(!this.fpControls)
    {
        this.fpControls = new THREE.FirstPersonControls(this, view.renderer.domElement);
        this.fpControls.moveSpeed =  0.5;
    }
    this.controls = this.fpControls;
    this.controls.enabled = true;
};
