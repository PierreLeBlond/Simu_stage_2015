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
    //Is the view shown to the user ?
    this.isShown                    = false;

    this.scene                      = null;
    this.renderer                   = null;

    //Store the id of rendering loop to cancel it whenever we want
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

    this.camera                     = null;
    this.globalCamera               = null;
    this.privateCamera              = null;

    this.parameters                 = {
        t                           : 0,
        active                      : false,
        pointsize                   : 0.5,
        fog                         : false,
        linkcamera                  : false,
        isStatic                    : true,
        synchrorendering            : false,
        color                       : [ 255, 255, 255],
        idInfo                      : -1,
        idTexture                   : -1,
        idBlending                  : -1
    };

    this.texture                    = [];
    this.blending                   = [THREE.NoBlending, THREE.NormalBlending, THREE.AdditiveBlending, THREE.SubtractiveBlending, THREE.MultiplyBlending];
    this.infoList                   = null;//Store the dat.gui element with all info within the current renderable data

    this.renderableDatas            = [];
    this.currentRenderableDataId    = -1;
    this.currentRenderableSnapshotId= -1;

    this.target           = null;

};

SIMU.View.prototype.setGlobalCamera = function(camera){
    this.globalCamera = camera;
};

SIMU.View.prototype.setupScene = function(){
    this.scene = new THREE.Scene();

    var axisHelper = new THREE.AxisHelper(1);
    this.scene.add( axisHelper );
    axisHelper.frustumCulled = true;

};

/**
 * @description Setup the scene, the renderer and the camera
 * @param width
 * @param height
 */
SIMU.View.prototype.setupView = function(left, top, width, height){

    if(this.domElement) {

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

        //CAMERA PROPERTIES
        //PerspectiveCamera(fov, aspect, near, far)
        this.privateCamera = new THREE.PerspectiveCamera( 75, this.width  / this.height, 0.00001, 200 );
        this.privateCamera.rotation.order = 'ZYX'; //to fit with FPScontrols
        this.privateCamera.position.set(0.5,0.5,0.5);
        this.privateCamera.lookAt(new THREE.Vector3(0, 0, 0));

        this.privateCamera.useFPSControls(this);
        this.camera = this.privateCamera;

        this.resize(width, height, left, top);

        //Events listener
        this.domElement.addEventListener('mousedown', this.getMouseIntersection.bind(this), false);
        this.domElement.addEventListener('dblclick', this.reachMouseFocus.bind(this), false);

        //window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
    }else{
        console.log("Error : View does not have a dom element")
    }
};

/**
 * @description setup a dat.GUI, stats and debug infos
 */
SIMU.View.prototype.setupGui = function(){

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

    viewFolder.add(this.parameters, 'fog').name("fog").onFinishChange(function(value){
        for (var i = 0; i < that.renderableDatas.length;i++){
            that.renderableDatas[i].fogIsEnabled = value;
            if(that.renderableDatas[i].isReady) {
                that.scene.remove(that.renderableDatas[i].pointCloud);
                if (that.parameters.isStatic) {
                    that.renderableDatas[i].enableStaticShaderMode();
                } else {
                    that.renderableDatas[i].enableAnimatedShaderMode();
                }
                that.scene.add(that.renderableDatas[i].pointCloud);
            }
        }

    });

    viewFolder.add(this.parameters, 'linkcamera').name("Link Camera").onFinishChange(function(value){
        if(value && that.globalCamera){
            that.camera.controls.enabled = false;
            that.camera = that.globalCamera;
            that.camera.controls.enabled = true;
        }else{
            that.camera.controls.enabled = false;
            that.camera = that.privateCamera;
            that.camera.controls.enabled = true;
        }
    });

    viewFolder.add(this.parameters, 'synchrorendering').name("Synchro Rendering").onFinishChange(function(value){
        if(value){
        }else{
            that.render();
        }
    });

    var dataFolder = this.gui.addFolder('Data');

    dataFolder.add(this.parameters, 'active').name("activate data").listen().onFinishChange(function(){
        if(that.parameters.active){
            that.renderableDatas[that.currentRenderableDataId].resetData();
            if(that.parameters.isStatic) {
                that.renderableDatas[that.currentRenderableDataId].enableStaticShaderMode();
            }else{
                that.renderableDatas[that.currentRenderableDataId].enableAnimatedShaderMode();
            }
            that.renderableDatas[that.currentRenderableDataId].isActive = true;
            that.scene.add(that.renderableDatas[that.currentRenderableDataId].pointCloud);
            that.updateUIinfoList();
        }else{
            that.scene.remove(that.renderableDatas[that.currentRenderableDataId].pointCloud);
            that.renderableDatas[that.currentRenderableDataId].isActive = false;
        }
    });

    dataFolder.add(this.parameters, 'idTexture', {spark:0, star:1}).listen().onFinishChange(function(value){
        if(that.currentRenderableDataId >= 0) {
            that.renderableDatas[that.currentRenderableDataId].idTexture = value;
            that.renderableDatas[that.currentRenderableDataId].uniforms.map.value = that.texture[value];
        }
    });

    dataFolder.add(this.parameters, 'pointsize', 0.0001, 3).name("point size").listen().onFinishChange(function(value){
        if(that.currentRenderableDataId >= 0) {
            that.renderableDatas[that.currentRenderableDataId].uniforms.size.value = value;
        }
    });

    dataFolder.addColor(this.parameters, 'color').name("color").listen().onChange(function(value){
        if(that.currentRenderableDataId >= 0) {
            that.renderableDatas[that.currentRenderableDataId].defaultColor = value;
            var r = value[0]/255;
            var g = value[1]/255;
            var b = value[2]/255;
            var color = that.renderableDatas[that.currentRenderableDataId].pointCloud.geometry.attributes.color;
            for(var i = 0; i < color.length/3;i++){
                color.array[3*i] = r;
                color.array[3*i + 1] = g;
                color.array[3*i + 2] = b;
            }
            color.needsUpdate = true;
        }
    });

    var blendingType = {none:0,
                        normal:1,
                        additive:2,
                        subtractive:3,
                        multiply:4};

    dataFolder.add(this.parameters, 'idBlending', blendingType).name('blending').listen().onChange(function(value){
        if(that.currentRenderableDataId >= 0) {
            that.renderableDatas[that.currentRenderableDataId].animatedFogShaderMaterial.blending = that.blending[value];
            that.renderableDatas[that.currentRenderableDataId].animatedShaderMaterial.blending = that.blending[value];
            that.renderableDatas[that.currentRenderableDataId].staticFogShaderMaterial.blending = that.blending[value];
            that.renderableDatas[that.currentRenderableDataId].staticShaderMaterial.blending = that.blending[value];
        }
    });


    this.infoList = this.gui.__folders.Data.add(this.parameters, 'idInfo', {none:0}).name('info');

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

    this.domElement.appendChild(this.info);
};

/**
 * @description push renderable datas
 * @param renderableData
 */
SIMU.View.prototype.addRenderableData = function(renderableData)
{
    this.renderableDatas.push(renderableData);
};

SIMU.View.prototype.updateUIinfoList = function(){
    var that = this;

    if (this.renderableDatas[this.currentRenderableDataId].isReady) {
        var info = {none: 0};
        var snapInfo = this.renderableDatas[this.currentRenderableDataId].data.snapshots[this.renderableDatas[this.currentRenderableDataId].data.currentSnapshotId].info;
        for (var i = 0; i < snapInfo.length; i++) {
            info[snapInfo[i].name] = i + 1;
        }

        this.gui.__folders.Data.remove(this.infoList);

        this.infoList = this.gui.__folders.Data.add(this.parameters, 'idInfo', info).name('info').onFinishChange(function (value) {
            if (value != 0 && snapInfo[value - 1].min < snapInfo[value - 1].max) {
                var min = snapInfo[value - 1].min;
                var max = snapInfo[value - 1].max;

                if (that.currentRenderableDataId >= 0) {
                    var r, g, b;
                    var color = that.renderableDatas[that.currentRenderableDataId].pointCloud.geometry.attributes.color;
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
                if (that.currentRenderableDataId >= 0) {
                    r = that.renderableDatas[that.currentRenderableDataId].defaultColor[0] / 255;
                    g = that.renderableDatas[that.currentRenderableDataId].defaultColor[1] / 255;
                    b = that.renderableDatas[that.currentRenderableDataId].defaultColor[2] / 255;
                    color = that.renderableDatas[that.currentRenderableDataId].pointCloud.geometry.attributes.color;
                    for (i = 0; i < color.length / 3; i++) {
                        color.array[3 * i] = r;
                        color.array[3 * i + 1] = g;
                        color.array[3 * i + 2] = b;
                    }
                    color.needsUpdate = true;
                }
            }
        })
    }
};
/**
 * @description set the id of the current renderable data
 * @detail update the ui to match the new current renderable data
 * @param id
 */
SIMU.View.prototype.setCurrentRenderableDataId = function(id) {
    this.currentRenderableDataId = id;
    this.parameters.active = this.renderableDatas[this.currentRenderableDataId].isActive;
    this.parameters.pointsize = this.renderableDatas[this.currentRenderableDataId].uniforms.size.value;
    this.parameters.color = this.renderableDatas[this.currentRenderableDataId].defaultColor;
    this.parameters.idTexture = this.renderableDatas[this.currentRenderableDataId].idTexture;
    this.parameters.idBlending = this.renderableDatas[this.currentRenderableDataId].idBlending;

    this.updateUIinfoList();
};

/**
 * @description set the id of the current renderable snapshot
 * @detail Reset the data according to the new snapshot
 * @param id
 */
SIMU.View.prototype.setCurrentRenderableSnapshotId = function(id){
    this.currentRenderableSnapshotId = id;
    for(var i = 0; i < this.renderableDatas.length;i++){
        if(this.renderableDatas[i].isActive) {
            this.scene.remove(this.renderableDatas[i].pointCloud);
            this.renderableDatas[i].resetData();
            if(this.parameters.isStatic) {
                this.renderableDatas[i].enableStaticShaderMode();
            }else{
                this.renderableDatas[i].enableAnimatedShaderMode();
            }
            this.scene.add(this.renderableDatas[i].pointCloud);
        }
    }
};

SIMU.View.prototype.setAnimatedShaderMode = function(){
    this.parameters.isStatic = false;
    for(var i = 0; i < this.renderableDatas.length;i++){
        if(this.renderableDatas[i].isActive) {
            //First remove element from the scene, in order to take the modification in account when we'll put it back
            this.scene.remove(this.renderableDatas[i].pointCloud);
            this.renderableDatas[i].enableAnimatedShaderMode();
            this.scene.add(this.renderableDatas[i].pointCloud);
        }
    }
};

SIMU.View.prototype.setStaticShaderMode = function(){
    this.parameters.isStatic = true;
    for(var i = 0; i < this.renderableDatas.length;i++){
        if(this.renderableDatas[i].isActive) {
            this.scene.remove(this.renderableDatas[i].pointCloud);
            this.renderableDatas[i].enableStaticShaderMode();
            this.scene.add(this.renderableDatas[i].pointCloud);
        }
    }
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
};

/**
 * @description render the view
 */
SIMU.View.prototype.render = function(){

    var that = this;
    if(!this.parameters.synchrorendering) {
        this.renderId = requestAnimationFrame(function () {
            that.render();
        });
    }

    this.animate();

    for(var i = 0; i < this.renderableDatas.length;i++){
        if(this.renderableDatas[i].isActive && this.renderableDatas[i].isReady) {
            this.renderableDatas[i].computeCulling(this.camera);
        }
    }

    this.renderer.render(this.scene, this.camera);

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
 * @description set time for the whole view to t
 * @detail get called whenever time is changing within the application
 * @param t
 */
SIMU.View.prototype.setTime = function(t){
    for(var i = 0; i < this.renderableDatas.length;i++){
        this.renderableDatas[i].uniforms.t.value = t;
    }
};


/**
 * @description update the renderable datas to fit with the current data
 * @detail get called when we jump to other snapshots
 */
SIMU.View.prototype.dataHasChanged = function(){
    for(var i = 0; i < this.renderableDatas.length;i++){
        this.renderableDatas[i].resetData();
    }
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
 * @author mrdoob
 * @description when resizing the windows, takes care that the ratio and aspect stays good
 */
SIMU.View.prototype.onWindowResize = function(){
    this.width = window.innerWidth/2;
    this.height = window.innerHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( this.width, this.height );
    /*if ( this.currentDisplay == this.DisplayType.CARDBOARD )
    {
        this.effect.setSize( this.width, this.height );
    }*/
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

    this.privateCamera.aspect = this.width / this.height;
    this.privateCamera.updateProjectionMatrix();

    this.renderer.setSize( this.width, this.height );
    /*if ( this.currentDisplay == this.DisplayType.CARDBOARD )
    {
        this.effect.setSize( this.width, this.height );
    }*/
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

    for(var i = 0; i < this.renderableDatas.length;i++){
        if(this.renderableDatas[i].isActive) {
            newTarget = this.renderableDatas[i].getIntersection(mouse, this.camera);
            if (newTarget && (!target || newTarget.distance < target.distance)) {
                target = newTarget;
            }
        }
    }
    if(target){
        negate(target.renderableData.pointCloud.geometry.attributes.color, target.index);
        this.showInfo(target);
    }
    if(this.target) {
        negate(this.target.renderableData.pointCloud.geometry.attributes.color, this.target.index);
    }
    this.target = target;
};

/**
 * @description Start to move the camera to reach the selected point
 * @detail Takes an average of 1s, with no camera interaction enabled during this time
 */
SIMU.View.prototype.reachMouseFocus = function(){
    if(this.target) {
        var x = this.target.renderableData.pointCloud.geometry.attributes.position.array[this.target.index * 3];
        var y = this.target.renderableData.pointCloud.geometry.attributes.position.array[this.target.index * 3 + 1];
        var z = this.target.renderableData.pointCloud.geometry.attributes.position.array[this.target.index * 3 + 2];

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



