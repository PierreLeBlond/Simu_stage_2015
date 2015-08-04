/**
 * Created by lespingal on 15/06/15.
 */
SIMU = SIMU || {};

/**
 * @description Classe qui permet d'afficher dans un element du DOM un rendu WebGL
 * L'idée et de pouvoir afficher simultanément plusieurs vues des données dans des parties différents de l'écran :
 * - On souhaite comparer différents jeux de données
 * - On souhaite comparer des données à des temps différents
 * - On souhaite comparer des informations différentes sur les même données
 */

/**
 * @description constructor SIMU.View
 * @constructor
 */
SIMU.View = function () {

    this.isShown                    = false;                                /** True if the view is shown to the user **/

    this.scene                      = null;                                 /** The scene to display and bind to this view **/
    this.renderer                   = null;                                 /** The THREE.js renderer **/
    this.oculusRenderer             = null;
    this.cardboardRenderer          = null;

    this.currentRenderer            = null;

    this.sceneParameters            = {
        t                           : 0,                                    /** The snapshot time **/
        delta_t                     : 0,                                    /** The current elapsed time **/
        active                      : false,                                /** True if the current point cloud is displayed **/
        pointsize                   : 0.5,                                  /** Size of the particle within the point cloud **/
        fog                         : false,                                /** True if the fog is enable **/
        blink                       : false,                                /** True if blinking effect is enable **/
        linkcamera                  : false,                                /** True if the current used camera is the global one **/
        isStatic                    : true,                                 /** True if we are in static mode **/
        color                       : [ 255, 255, 255],                     /** Default color of the current point cloud **/
        idInfo                      : -1,                                   /** Id of the current info of the current point cloud **/
        idTexture                   : -1,                                   /** Id of the texture used in the current point cloud **/
        idBlending                  : -1,                                   /** Id of the blending mode used in the current point cloud **/
        frustumculling              : true,                                 /** True if view frustum culling is enabled **/
        levelOfDetail               : 4,                                    /** level of detail of the point cloud **/
        oculus                      : false,
        idParam                     : 0,
        paramEnabled                : false
    };

    this.camera                     = null;                                 /** Currently used camera **/
    this.globalCamera               = null;                                 /** Global camera, shared with other scene **/

    this.renderId                   = -1;                                   /** Id of rendering loop, to cancel it **/

    //UI elements
    this.gui                        = null;                                 /** dat.gui instance **/
    this.stats                      = null;                                 /** fps & spf indicator **/

    this.info                       = document.createElement("div");        /** Info element on selected point **/
    this.debug                      = document.createElement("div");        /** Info element on rendering information **/

    //Display parameters
    this.domElement                 = document.createElement("div");        /** The element where the view is set **/

    this.width                      = 0;                                    /** View's width **/
    this.height                     = 0;                                    /** View's height **/
    this.left                       = 0;                                    /** View's left space **/
    this.top                        = 0;                                    /** view's top space **/

    this.clock                      = new THREE.Clock();                    /** THREE.js clock **/

    this.infoList                   = null;                                 /** Store the dat.gui element with all info within the current renderable data **/
};

/**
 * @description Set the global camera
 * @param {THREE.Camera} camera - The global camera
 */
SIMU.View.prototype.setGlobalCamera = function(camera){
    this.globalCamera = camera;
};

/**
 * @description Set the scene attribute
 * @param {SIMU.Scene} scene
 */
SIMU.View.prototype.setScene = function(scene){
    this.scene = scene;
};

/**
 * @description Set the DomElement attribute
 * @param {Node} el
 */
SIMU.View.prototype.setDomElement = function(el){
    this.domElement = el;
};

/**
 * @description Setup the scene, the renderer and the camera
 * @param left
 * @param top
 * @param width
 * @param height
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
        this.renderer = new THREE.WebGLRenderer({ stencil: false, precision: "lowp", premultipliedAlpha: false});//Let's make thing easier for the renderer
        //App.renderer.autoClear = false; //TODO fix perf issue on firefox, profiler is pointing on renderer.clear, but it doesn't make any sense.
        this.renderer.setSize(this.width, this.height);
        this.domElement.appendChild( this.renderer.domElement );

        this.oculusRenderer = new THREE.OculusRiftEffect(this.renderer);
        this.cardboardRenderer = new THREE.StereoEffect(this.renderer);
        this.cardboardRenderer.eyeSeparation = 0.0001;
        this.cardboardRenderer.setSize(this.width, this.height);

        this.currentRenderer = this.renderer;


        this.camera = this.scene.privateCamera;
        this.camera.useFPSControls(this);


        this.resize(width, height, left, top);

        //Events listener
        this.domElement.addEventListener('mousedown', this.getMouseIntersection.bind(this), false);
        this.domElement.addEventListener('dblclick', this.reachMouseFocus.bind(this), false);

        //window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
    }
};

/**
 * @description setup a dat.GUI, stats and debug infos
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

        viewFolder.add(this.sceneParameters, 'linkcamera').name("Link Camera").onFinishChange(function () {
            //TODO Create function in class SIMU.Scene
            if (that.sceneParameters.linkcamera && that.globalCamera) {
                that.camera.controls.enabled = false;
                that.camera = that.globalCamera;
                that.camera.controls.enabled = true;
            } else {
                that.camera.controls.enabled = false;
                that.camera = that.scene.privateCamera;
                that.camera.controls.enabled = true;
            }
        });

        viewFolder.add(this.sceneParameters, 'frustumculling').name('Frustum Culling');

        viewFolder.add(this.sceneParameters, 'oculus').name('enable oculus view').onFinishChange(function(value){
            if(!value){
                that.currentRenderer = that.renderer;
            }else{
                that.currentRenderer = that.oculusRenderer;
            }
            that.currentRenderer.setSize(that.width, that.height);
        });

        var dataFolder = this.gui.addFolder('Data');

        dataFolder.add(this.sceneParameters, 'active').name("activate data").onFinishChange(function () {
            if (that.sceneParameters.active) {
                that.scene.activateCurrentData();
                that.updateUIinfoList();
            } else {
                that.scene.deactivateCurrentData();
            }
        });

        dataFolder.add(this.sceneParameters, 'fog').name("fog").onFinishChange(function (value) {
            that.scene.setCurrentDataFog(value);
        });

        dataFolder.add(this.sceneParameters, 'blink').name("blink").onFinishChange(function (value) {
            that.scene.setCurrentDataBlink(value);
        });

        dataFolder.add(this.sceneParameters, 'idTexture', {spark: 0, star: 1, starburst: 2, flatstar: 3}).name('texture').onFinishChange(function (value) {
            that.scene.setCurrentDataTexture(value);
        });

        dataFolder.add(this.sceneParameters, 'pointsize', 0.0001, 10).name("point size").onFinishChange(function (value) {
            that.scene.setCurrentDataPointSize(value);
        });

        dataFolder.addColor(this.sceneParameters, 'color').name("color").onChange(function (value) {
            that.scene.setCurrentDataColor(value);
        });

        dataFolder.add(this.sceneParameters, 'levelOfDetail', 0, 4).name("Level of Detail").onChange(function (value) {
            that.scene.setCurrentDataLevelOfDetail(value);
        });

        var blendingType = {
            none: 0,
            normal: 1,
            additive: 2,
            subtractive: 3,
            multiply: 4
        };

        dataFolder.add(this.sceneParameters, 'idBlending', blendingType).name('blending').onChange(function (value) {
            that.scene.setCurrentDataBlendingType(value);
        });

        dataFolder.add(this.sceneParameters, 'paramEnabled').name('enable param').onChange(function(value){

        });


        this.infoList = this.gui.__folders.Data.add(this.scene.parameters, 'idInfo', {none: 0}).name('info');

        var param = {
            none: 0,
            lightning: 1,
            blink: 2,
            color: 3,
            size: 4
        };

        dataFolder.add(this.sceneParameters, 'idParam', param).name('param').onChange(function(value){
            that.scene.setCurrentDataParam(value);
        });

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

SIMU.View.prototype.showGui = function(){
    this.gui.domElement.style.display = "block";
    this.stats.domElement.style.display = "block";
    this.info.style.display = "block";
    this.debug.style.display = "block";
};

SIMU.View.prototype.hideGui = function(){
    this.gui.domElement.style.display = "none";
    this.stats.domElement.style.display = "none";
    this.info.style.display = "none";
    this.debug.style.display = "none";
};

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

        this.infoList = this.gui.__folders.Data.add(this.sceneParameters, 'idInfo', info).name('info').onFinishChange(function (value) {
            var currentRenderableData = that.scene.renderableDatas[that.scene.currentRenderableDataId];
            if (value != 0 && snapInfo[value - 1].min <= snapInfo[value - 1].max) {
                var min = snapInfo[value - 1].min;
                var max = snapInfo[value - 1].max;
                currentRenderableData.uniforms.min_info.value = min;
                currentRenderableData.uniforms.max_info.value = max;
                currentRenderableData.idInfo = value - 1;

                currentRenderableData.data.currentInfo = snapInfo[value - 1].value;
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
            }



            /*if (value != 0 && snapInfo[value - 1].min < snapInfo[value - 1].max) {
                var min = snapInfo[value - 1].min;
                var max = snapInfo[value - 1].max;

                if (that.scene.currentRenderableDataId >= 0) {
                    var r, g, b;
                    var color = currentRenderableData.pointCloud.geometry.attributes.color;
                    for (var i = 0; i < color.length / 3; i++) {
                        r = Math.abs(snapInfo[value - 1].value[i] - min) / Math.abs(max - min);
                        g = 0;
                        b = 1 - r;

                        color.array[3 * i] = r;
                        color.array[3 * i + 1] = g;
                        color.array[3 * i + 2] = b;
                    }
                    color.needsUpdate = true;
                }
            } else {
                if (that.scene.currentRenderableDataId >= 0) {
                    r = currentRenderableData.defaultColor[0] / 255;
                    g = currentRenderableData.defaultColor[1] / 255;
                    b = currentRenderableData.defaultColor[2] / 255;
                    color = currentRenderableData.pointCloud.geometry.attributes.color;
                    for (i = 0; i < color.length / 3; i++) {
                        color.array[3 * i] = r;
                        color.array[3 * i + 1] = g;
                        color.array[3 * i + 2] = b;
                    }
                    color.needsUpdate = true;
                }
            }*/
        })
    }
};

SIMU.View.prototype.updateGuiDisplay = function(gui) {
    for (var i in gui.__controllers) {
        gui.__controllers[i].updateDisplay();
    }
    for (var f in gui.__folders) {
        this.updateGuiDisplay(gui.__folders[f]);
    }
};


/**
 * @description set the id of the current renderable data
 * @detail update the ui to match the new current renderable data
 * @param id
 */
SIMU.View.prototype.setCurrentRenderableDataId = function(id) {
    var currentRenderableData           = this.scene.renderableDatas[id];
    this.sceneParameters.active         = currentRenderableData.isActive;
    this.sceneParameters.pointsize      = currentRenderableData.uniforms.size.value;
    this.sceneParameters.color          = currentRenderableData.defaultColor;
    this.sceneParameters.idTexture      = currentRenderableData.idTexture;
    this.sceneParameters.idBlending     = currentRenderableData.idBlending;
    this.sceneParameters.levelOfDetail  = currentRenderableData.levelOfDetail;
    this.sceneParameters.fog            = currentRenderableData.uniforms.fog.value == 1;
    this.sceneParameters.blink          = currentRenderableData.uniforms.blink.value == 1;
    this.sceneParameters.idParam        = currentRenderableData.uniforms.param_type.value;
    this.sceneParameters.idInfo         = currentRenderableData.idInfo;

    this.updateUIinfoList();

    this.updateGuiDisplay(this.gui);
};

/**
 * @description set the id of the current renderable snapshot
 * @detail Reset the data according to the new snapshot
 * @param id
 *
 */
SIMU.View.prototype.setCurrentRenderableSnapshotId = function(id){
};

/**
 * @description process all stuff related to animation
 */
SIMU.View.prototype.animate = function(){
    if(!this.camera.isNotFree) {
        this.camera.controls.update(this.clock.getDelta());
    }else{
        this.time += 1/60;
        if(this.time < 1.0) {
            this.camera.position.set(this.origin.x + this.time * this.objectif.x,
                this.origin.y + this.time * this.objectif.y,
                this.origin.z + this.time * this.objectif.z);
        }else{
            this.camera.isNotFree = false;
        }
    }

    //TODO Update frustum only if camera has changed
    if(this.scene.parameters.frustumculling) {
        this.camera.updateMatrix();
        this.camera.updateMatrixWorld();
        this.camera.matrixWorldInverse.getInverse(this.camera.matrixWorld);

        this.camera.frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse));
    }
};

/**
 * @description render the view
 */
SIMU.View.prototype.render = function(){

    var that = this;
    this.renderId = requestAnimationFrame(function () {
        that.render();
    });

    this.animate();

    if(this.sceneParameters.frustumculling) {
        this.scene.computeCulling(this.camera);
    }

    this.scene.setDeltaT(this.clock.elapsedTime);

    this.currentRenderer.render(this.scene.scene, this.camera);

    this.showDebuginfo();
    this.stats.update();
};

/**
 * @description Stop the current rendering loop
 */
SIMU.View.prototype.stopRender = function(){
    cancelAnimationFrame(this.renderId);
};

/**
 * @author Pierre Lespingal
 * @description Show some info about rendering
 */
SIMU.View.prototype.showDebuginfo = function(){
    var info = this.renderer.info.render;
    this.debug.innerHTML = ["Call :", info.calls, " | vertices : ", info.vertices, " | faces : ", info.faces, " | points : ", info.points].join('');//More efficient than string concatenation
};

/**
 * @description resize and adjust the view in order to render the scene properly
 * @param width
 * @param height
 * @param left
 * @param top
 */
SIMU.View.prototype.resize = function(width, height, left, top){
    this.width = width;
    this.height = height;

    this.domElement.style.top = top + 'px';
    this.domElement.style.left = left + 'px';
    this.domElement.style.width = width + 'px';
    this.domElement.style.height = height + 'px';

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.currentRenderer.setSize( this.width, this.height );
};

/**
 * @description Try to get the particle which is pointed by the mouse
 * @detail If found, the point get colored, and information on it is displayed
 * @param event
 */
SIMU.View.prototype.getMouseIntersection = function(event){

    var mouse = new THREE.Vector2(
        ( event.clientX / this.renderer.domElement.clientWidth ) * 2 - 1,
        -( event.clientY / this.renderer.domElement.clientHeight ) * 2 + 1
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
        negate(target.renderableData.pointCloud.geometry.attributes.color, target.index);
        this.showInfo(target);
    }
    if(this.scene.target) {
        negate(this.scene.target.renderableData.pointCloud.geometry.attributes.color, this.scene.target.index);
    }
    this.scene.target = target;
};

/**
 * @description Start to move the camera to reach the selected point
 * @detail Takes an average of 1s, with no camera interaction enabled during this time
 */
SIMU.View.prototype.reachMouseFocus = function(){
    if(this.scene.target) {
        var x = this.scene.target.renderableData.pointCloud.geometry.attributes.position.array[this.scene.target.index * 3];
        var y = this.scene.target.renderableData.pointCloud.geometry.attributes.position.array[this.scene.target.index * 3 + 1];
        var z = this.scene.target.renderableData.pointCloud.geometry.attributes.position.array[this.scene.target.index * 3 + 2];

        this.origin = new THREE.Vector3(this.camera.position.x, this.camera.position.y, this.camera.position.z);
        this.objectif = new THREE.Vector3(x - this.origin.x, y - this.origin.y, z - this.origin.z);
        this.time = 0.0;
        this.camera.isNotFree = true;
    }
};

/**
 * @description display information about the selected point
 */
SIMU.View.prototype.showInfo = function(point){
    var infos = point.renderableData.data.snapshots[point.renderableData.data.currentSnapshotId].info;
    var result = [];
    result.push("position : x = ");
    result.push(point.renderableData.data.currentPositionArray[point.index*3]);
    result.push(",y = ");
    result.push(point.renderableData.data.currentPositionArray[point.index*3 + 1]);
    result.push(",z = ");
    result.push(point.renderableData.data.currentPositionArray[point.index*3 + 2]);
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
 * @description Set the camera in order to control it as in a FPS
 * @param view
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
