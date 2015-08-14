/**
 * Created by lespingal on 22/07/15.
 * pierre.lespingal@gmail.com
 */

/**
 *  Global namespace
 *  @namespace
 */
var SIMU = SIMU || {};

//TODO Both interface logic and data logic are mixed together, which is bad, but not as bad as nazi zombies. Anyway, it'll be good to fix that.

/**
 * @constructor
 *
 * @property {Array} scenes                             - Array of {@link SIMU.Scene} object, usually linked to one view
 *
 * @property {object} parameters                        - A bunch of parameters, to be used and changed with dat.GUI
 *      @property {number} parameters.t                 - Current Time relative to the data
 *      @property {number} parameters.speed             - Speed of the animation
 *      @property {number} parameters.idScript          - Id of the currently used script for parsing data
 *
 * @property {object} info                              - Information about the available data
 *      @property {number} info.nbSnapShot              - Number of available snapshot
 *      @property {number} info.nbData                  - Number of available data
 *
 * @property {Array} datas                              - Array of {@link SIMU.Data} object, available in each scene
 * @property {number} currentDataId                     - Current selected data id
 * @property {number} currentSnapshotId                 - Current selected snapshot id
 *
 * @property {THREE.PerspectiveCamera} globalCamera     - Global camera used to have the same point of views in different {@link SIMU.View} object
 * @property {THREE.PerspectiveCamera[]} fixedCamera    - Array of positioned camera to access different point of view quickly
 * @property {THREE.PerspectiveCamera} rotatingCamera - Camera rotating around the cubes
 *
 * @property {Array} scripts                            - Available scripts for parsing data
 * @property {Array} texture                            - Available texture for particle rendering
 *
 * @property {Array} views                              - Array of {@link SIMU.View} object, one for each scene
 * @property {SIMU.View} currentView                    - Current focused view
 *
 * @property {THREE.FirstPersonControls} controls       - Controls used with the global camera
 *
 * @property {SIMU.Menu} menu                           - The menu to switch between display mode
 * @property {SIMU.Timeline} timeline                   - The timeline to control animation
 *
 * @property {SIMU.DataUIManager} dataManager           - A UI element to load, organize & navigate through data
 *
 * @property {SIMU.LoadingBarSingleton} loadingBar      - A UI element to have a feedback on data processing evolution
 *
 * @property {Node} domElement                          - The dom element displaying the whole application
 * @property {Node} container                           - A dom element containing the canvas
 *
 * @property {number} width                             - Width of the application's display
 * @property {number} height                            - height of the application's display
 *
 * @property {function} lastFileEvent                   - The current loading data event
 * @property {function} windowResizeEvent               - The current resize window event
 *
 */
SIMU.Simu = function(){

    this.scenes                 = [];

    this.parameters             = {
        "t"                   : 0.00001,
        "speed"               : 0.5,
        "idScript"            : 0
    };

    this.info                   = {
        "nbSnapShot"          : 0,
        "nbData"              : 0
    };

    this.datas                  = [];
    this.currentDataId          = -1;
    this.currentSnapshotId      = -1;

    this.globalCamera           = null;
    this.fixedCamera            = [];
    this.rotatingCamera         = null;

    this.scripts                = [];
    this.texture                = [];

    this.views                  = [];
    this.currentView            = null;

    this.controls               = null;

    this.menu                   = null;
    this.timeline               = null;

    this.dataManager            = null;

    this.loadingBar             = null;

    this.domElement             = null;
    this.container              = null;

    this.width                  = 0;
    this.height                 = 0;

    this.lastFileEvent          = null;
    this.windowResizeEvent      = null;

};

/**
 * Set the dom element
 * @param {Node} el             - The dom element from which the application will be displayed
 */
SIMU.Simu.prototype.setDomElement = function(el){
    this.domElement = el;
};

/**
 * Add a script
 * @param {string} name         - Name of the script
 * @param {function} script     - The script logic
 * @param {boolean} binary      - Do the script work with binary file or string formatted file ?
 */
SIMU.Simu.prototype.addScript = function(name, script, binary){
    var newScript = new SIMU.Script();
    this.scripts.push(newScript);
    newScript.name = name;
    newScript.script = script;
    newScript.binary = binary;
};

/**
 * Setup the global camera and the available textures
 */
SIMU.Simu.prototype.setupSimu = function(){
    this.globalCamera = new THREE.PerspectiveCamera(75, 1.0, 0.00001, 200);
    this.globalCamera.rotation.order  = 'ZYX';
    this.globalCamera.position.set(0.5, 0.5, 0.5);
    this.globalCamera.lookAt(new THREE.Vector3(0, 0, 0));

    this.globalCamera.frustum = new THREE.Frustum();

    this.rotatingCamera = new THREE.PerspectiveCamera(75, 1.0, 0.00001, 200);
    this.rotatingCamera.rotation.order  = 'ZYX';
    this.rotatingCamera.position.set(1.5, 0.5, 1.5);
    this.rotatingCamera.lookAt(new THREE.Vector3(0.5, 0.5, 0.5));

    this.rotatingCamera.frustum = new THREE.Frustum();

    var topCamera = new THREE.PerspectiveCamera(75, 1.0, 0.00001, 200);
    topCamera.position.set(0.5, 2, 0.5);
    topCamera.lookAt(new THREE.Vector3(0.5, 0, 0.5));

    topCamera.frustum = new THREE.Frustum();

    this.fixedCamera.push(topCamera);

    var leftCamera = new THREE.PerspectiveCamera(75, 1.0, 0.00001, 200);
    leftCamera.position.set(2, 0.5, 0.5);
    leftCamera.lookAt(new THREE.Vector3(0, 0.5, 0.5));

    leftCamera.frustum = new THREE.Frustum();

    this.fixedCamera.push(leftCamera);

    var rightCamera = new THREE.PerspectiveCamera(75, 1.0, 0.00001, 200);
    rightCamera.position.set(-1,0.5, 0.5);
    rightCamera.lookAt(new THREE.Vector3(0, 0.5, 0.5));

    rightCamera.frustum = new THREE.Frustum();

    this.fixedCamera.push(rightCamera);


    this.texture.push(THREE.ImageUtils.loadTexture("resources/textures/spark.png"));
    this.texture.push(THREE.ImageUtils.loadTexture("resources/textures/star.gif"));
    this.texture.push(THREE.ImageUtils.loadTexture("resources/textures/starburst.jpg"));
    this.texture.push(THREE.ImageUtils.loadTexture("resources/textures/flatstar.jpg"));
};

/**
 * Add a view to the application, while creating a new scene as well and liking the two together
 */
SIMU.Simu.prototype.addViewWithNewScene = function(){
    var view = new SIMU.View();

    var scene = new SIMU.Scene();
    this.scenes.push(scene);
    scene.setupScene();
    scene.texture = this.texture;
    for(var i = 0; i < this.datas.length;i++) {
        var renderableData = new SIMU.RenderableData();
        renderableData.setData(this.datas[i]);
        scene.addRenderableData(renderableData);
    }
    if(this.currentDataId >= 0) {
        scene.setCurrentRenderableData(this.currentDataId);
    }
    if(this.currentSnapshotId >= 0){
        scene.setCurrentRenderableSnapshot(this.currentSnapshotId);
    }

    view.setScene(scene);
    view.setFixedCameras(this.fixedCamera);
    view.setRotatingCamera(this.rotatingCamera);
    view.setupView(0, 0, this.width, this.height);
    view.setupGui();
    view.domElement.addEventListener('click', this.focus.bind(this), false);

    this.views.push(view);
};

/**
 * Add a view and linked it to the given scene
 * @param {SIMU.Scene} scene - The scene to be linked to the new view
 */
SIMU.Simu.prototype.addViewFromScene = function(scene){
    var view = new SIMU.View();

    view.setScene(scene);
    view.setFixedCameras(this.fixedCamera);
    view.setRotatingCamera(this.rotatingCamera);
    view.setupView(0, 0, this.width, this.height);
    view.setupGui();
    view.domElement.addEventListener('click', this.focus.bind(this), false);

    this.views.push(view);
};

/**
 * Enter simple view mode
 */
SIMU.Simu.prototype.switchToSingleview = function(){

    this.menu.hideMenu();

    this.container.innerHTML = "";

    this.globalCamera.aspect = this.width / this.height;
    this.globalCamera.updateProjectionMatrix();

    this.rotatingCamera.aspect = this.width / this.height;
    this.rotatingCamera.updateProjectionMatrix();

    for(var i = 0; i < this.fixedCamera.length;i++){
        this.fixedCamera[i].aspect = this.width/this.height;
        this.fixedCamera[i].updateProjectionMatrix();
    }

    if(this.views.length == 0){
        this.addViewWithNewScene();
    }
    this.currentView = this.views[0];
    this.currentView.domElement.id = 0;
    this.container.appendChild(this.currentView.domElement);
    this.currentView.isShown = true;
    this.currentView.resize(this.width, this.height, 0, 0);
    this.currentView.setGlobalCamera(this.globalCamera);
    this.currentView.currentRenderer = this.currentView.renderer;
    this.currentView.render();

    if(this.windowResizeEvent){
        window.removeEventListener('resize', this.windowResizeEvent, false);
    }
    this.windowResizeEvent = this.onSingleviewWindowResize.bind(this);
    window.addEventListener( 'resize',this.windowResizeEvent, false );

    this.showUI();
    this.animate();
};

/**
 * Enter oculus view mode
 * @detail Work best if full screen is enabled, as the resolution is fixed and will not adapt itself to the dom element
 */
SIMU.Simu.prototype.switchToOculusview = function(){

    this.menu.hideMenu();

    this.container.innerHTML = "";

    this.globalCamera.aspect = this.width / this.height;
    this.globalCamera.updateProjectionMatrix();

    this.rotatingCamera.aspect = this.width / this.height;
    this.rotatingCamera.updateProjectionMatrix();

    for(var i = 0; i < this.fixedCamera.length;i++){
        this.fixedCamera[i].aspect = this.width/this.height;
        this.fixedCamera[i].updateProjectionMatrix();
    }

    if(this.views.length == 0){
        this.addViewWithNewScene();
    }
    this.currentView = this.views[0];
    this.currentView.domElement.id = 0;
    this.container.appendChild(this.currentView.domElement);
    this.currentView.isShown = true;
    this.currentView.resize(this.width, this.height, 0, 0);
    this.currentView.setGlobalCamera(this.globalCamera);
    this.currentView.currentRenderer = this.currentView.oculusRenderer;
    this.currentView.render();

    if(this.windowResizeEvent){
        window.removeEventListener('resize', this.windowResizeEvent, false);
    }
    this.windowResizeEvent = this.onSingleviewWindowResize.bind(this);
    window.addEventListener( 'resize',this.windowResizeEvent, false );

    this.showUI();
    this.animate();
};

/**
 * Enter cardboard view mode
 */
SIMU.Simu.prototype.switchToCardboardview = function(){

    this.menu.hideMenu();

    this.container.innerHTML = "";

    this.globalCamera.aspect = this.width / this.height;
    this.globalCamera.updateProjectionMatrix();

    this.rotatingCamera.aspect = this.width / this.height;
    this.rotatingCamera.updateProjectionMatrix();

    for(var i = 0; i < this.fixedCamera.length;i++){
        this.fixedCamera[i].aspect = this.width/this.height;
        this.fixedCamera[i].updateProjectionMatrix();
    }

    if(this.views.length == 0){
        this.addViewWithNewScene();
    }

    this.currentView = this.views[0];
    this.currentView.domElement.id = 0;
    this.container.appendChild(this.currentView.domElement);
    this.currentView.isShown = true;
    this.currentView.resize(this.width, this.height, 0, 0);
    this.currentView.setGlobalCamera(this.globalCamera);
    this.currentView.currentRenderer = this.currentView.cardboardRenderer;
    this.currentView.render();

    if(this.windowResizeEvent){
        window.removeEventListener('resize', this.windowResizeEvent, false);
    }
    this.windowResizeEvent = this.onSingleviewWindowResize.bind(this);
    window.addEventListener( 'resize',this.windowResizeEvent, false );

    this.showUI();
    this.animate();
};

/**
 * Enter multiple view mode, two view in this case and so far
 */
SIMU.Simu.prototype.switchToMultiview = function()
{

    this.menu.hideMenu();

    this.container.innerHTML = "";

    this.globalCamera.aspect = (this.width/2) / this.height;
    this.globalCamera.updateProjectionMatrix();

    this.rotatingCamera.aspect = (this.width/2) / this.height;
    this.rotatingCamera.updateProjectionMatrix();

    for(var i = 0; i < this.fixedCamera.length;i++){
        this.fixedCamera[i].aspect = (this.width/2)/this.height;
        this.fixedCamera[i].updateProjectionMatrix();
    }

    if(this.views.length == 0){
        this.addViewWithNewScene();
    }
    if(this.views.length == 1){
        this.addViewWithNewScene();
    }

    this.currentView = this.views[0];
    this.currentView.domElement.id = 0;
    this.container.appendChild(this.currentView.domElement);
    this.currentView.isShown = true;
    this.currentView.resize((this.width/2), this.height, 0, 0);
    this.currentView.setGlobalCamera(this.globalCamera);
    this.currentView.currentRenderer = this.currentView.renderer;
    this.currentView.render();

    this.currentView = this.views[1];
    this.currentView.domElement.id = 1;
    this.container.appendChild(this.currentView.domElement);
    this.currentView.isShown = true;
    this.currentView.resize((this.width/2), this.height, 0, 0);
    this.currentView.setGlobalCamera(this.globalCamera);
    this.currentView.currentRenderer = this.currentView.renderer;
    this.currentView.render();

    this.windowResizeEvent = this.onMultiviewWindowResize.bind(this);
    window.addEventListener( 'resize',this.windowResizeEvent, false );

    this.showUI();
    this.animate();

};

/**
 * Setup the User Interface
 */
SIMU.Simu.prototype.setupGui = function(){

    var that = this;

    this.loadingBar = SIMU.LoadingBarSingleton.getLoadingBarInstance();
    this.domElement.appendChild(this.loadingBar.domElement);

    this.dataManager = new SIMU.DataUIManager();
    this.dataManager.setupUI();

    this.domElement.appendChild(this.dataManager.domElement);
    this.domElement.style.overflow = 'hidden';

    this.container = document.createElement('div');
    this.container.style.position = 'absolute';
    this.container.id = 'container';
    this.container.style.cursor = 'crosshair';

    this.width = this.domElement.clientWidth;
    this.container.style.width = this.domElement.clientWidth + 'px';
    this.height = this.domElement.clientHeight;
    this.container.style.height = this.domElement.clientHeight + 'px';
    this.domElement.appendChild(this.container);

    this.globalCamera.controls = new THREE.FirstPersonControls(this.globalCamera, this.container);
    this.globalCamera.controls.moveSpeed = 0.5;
    this.globalCamera.controls.enabled = false;

    /*for(var i = 0; i < this.fixedCamera;i++){
        this.fixedCamera[i].controls = new THREE.FirstPersonControls(this.fixedCamera[i], this.container);
        this.fixedCamera[i].controls.moveSpeed = 0.5;
        this.fixedCamera[i].controls.enabled = false;
    }*/


    /* Création du menu et des événements associés */
    this.menu = new SIMU.Menu();
    this.menu.setup();
    this.domElement.appendChild(this.menu.blocker);

    this.menu.simpleView.addEventListener('click', this.switchToSingleview.bind(this), false);
    this.menu.oculus.addEventListener('click', this.switchToOculusview.bind(this), false);
    this.menu.cardboard.addEventListener('click', this.switchToCardboardview.bind(this), false);
    this.menu.multiView.addEventListener('click', this.switchToMultiview.bind(this), false);

    this.menu.displayMenu();


    /* Création de la timeline et des événements associés */
    this.timeline = new SIMU.Timeline();
    this.timeline.setup();
    this.domElement.appendChild(this.timeline.html);

    document.addEventListener('mousemove', this.updateTimeOnCursorMove.bind(this), false);
    document.addEventListener('mouseup', this.updateTimeOnCursorRelease.bind(this), false);
    this.timeline.playButton.addEventListener('click', this.onPlay.bind(this), false);


    this.gui = new dat.GUI({autoPlace: false});
    this.gui.domElement.style.zIndex = '1000';
    this.gui.domElement.style.position = 'absolute';
    this.gui.domElement.style.top = '0px';
    this.gui.domElement.style.right = '0px';

    this.domElement.appendChild(this.gui.domElement);

    var animationFolder = this.gui.addFolder('Animation');

    animationFolder.add(this.parameters, 't', 0.00001, 1).name("time").listen().onFinishChange(this.updateDataOnTimeChange.bind(this)).onChange(function(value) { that.timeline.animate(value); });
    animationFolder.add(this.parameters, 'speed', 0.00001, 1).name("speed");

    var scripts = {};

    for(var i = 0; i < this.scripts.length;i++){
        scripts[this.scripts[i].name] = i;
    }

    var scriptFolder = this.gui.addFolder('Script');
    scriptFolder.add(this.parameters, 'idScript', scripts).name("script").onFinishChange(function(value){
        for(var i = 0; i < that.datas.length;i++){
            that.datas[i].setScript(that.scripts[value]);
        }
    });

    this.setupEvents();
    this.hideUI();
};

/**
 * Hide the User Interface
 */
SIMU.Simu.prototype.hideUI = function(){
    document.getElementById('data_manager').style.display = "none";
    this.gui.domElement.style.display = "none";
    this.timeline.html.style.display = "none";
};

/**
 * Show the User Interface
 */
SIMU.Simu.prototype.showUI = function(){
    document.getElementById('data_manager').style.display = "block";
    this.gui.domElement.style.display = "block";
    this.timeline.html.style.display = "initial";
};

/**
 * Handle animation, i.e. movement in time
 */
SIMU.Simu.prototype.animate = function(){

    var that = this;

    this.requestId = requestAnimationFrame(function (){
        that.animate();
    });

    //Modify this value to change the animation
    var rotationSpeed = 1/800;
    var offset = 0.5;
    var ray = (3/Math.sqrt(2));
    this.rotatingCamera.position.set(ray*Math.cos(Date.now()*rotationSpeed) + offset, 0.5, ray*Math.sin(Date.now()*rotationSpeed) + offset);
    this.rotatingCamera.lookAt(new THREE.Vector3(0.5, 0.5, 0.5));

    if(this.parameters.play) {
        if (this.parameters.t < 1.0) {
            this.parameters.t += this.parameters.speed / 100;
        } else {
            this.parameters.t = 0.0001;
            this.currentSnapshotId++;

            this.setUICurrentSnapshot(this.currentSnapshotId);
            this.setCurrentSnapshot(this.currentSnapshotId);

            // Modifie la valeur du snapshot actuellement sélectionné dans l'objet Timeline
            this.timeline.handleCurrentSnapshotChangeEvent(this.currentSnapshotId);

            if (this.currentSnapshotId >= this.info.nbSnapShot - 1) {
                this.parameters.play = false;
                // Permet de modifier le CSS du bouton en fin d'animation.
                this.timeline.setPlayButton();
                for(var i = 0; i < this.scenes.length;i++){
                    if(this.scenes[i].parameters.shaderType == SIMU.ShaderType.ANIMATED){
                        this.scenes[i].setShaderType(SIMU.ShaderType.STATIC);
                    }else if(this.scenes[i].parameters.shaderType == SIMU.ShaderType.PARAMETRICANIMATED){
                        this.scenes[i].setShaderType(SIMU.ShaderType.PARAMETRICSTATIC);
                    }
                }
            }
        }

        for (i = 0; i < this.scenes.length; i++) {
            this.scenes[i].setTime(this.parameters.t);
        }
        for (i = 0; i < this.datas.length; i++) {
            this.datas[i].setTime(this.parameters.t);
        }

        // Déplace le curseur en fonction du temps
        this.timeline.animate(this.parameters.t);
    }
};

/**
 * Rendering phase
 * @depreciate All rendering occured within the views
 */
SIMU.Simu.prototype.render = function(){
    var that = this;
    this.requestId = requestAnimationFrame(function (){
        that.render();
    });
};

/**
 * Stop the rendering
 * @depreciate All rendering occured within the views
 */
SIMU.Simu.prototype.stopRender = function(){
    cancelAnimationFrame(this.requestId);
};

/**
 * @description Stop animation
 */
SIMU.Simu.prototype.stopAnimation = function(){
    cancelAnimationFrame(this.requestId);
};


/**
 * Add empty data object to the application
 * @detail for each scene an associated renderable data will be created
 */
SIMU.Simu.prototype.addData = function(){
    var i;
    var data = new SIMU.Data();
    for(i = 0; i < this.info.nbSnapShot;i++){
        data.addSnapshot();
    }
    this.datas.push(data);
    data.setScript(this.scripts[this.parameters.idScript]);
    this.info.nbData++;

    var renderableData;
    for(i = 0; i < this.scenes.length;i++){
        renderableData = new SIMU.RenderableData();
        renderableData.setData(data);
        this.scenes[i].addRenderableData(renderableData);
    }
};

/**
 * Update the UI to match the current data
 * @param {number} id - the current data id
 */
SIMU.Simu.prototype.setUICurrentData = function(id){
    if(this.currentDataId != -1) {
        this.dataManager.fileLoader.removeEventListener('change', this.lastFileEvent, false);
    }

    var array = document.getElementsByClassName("data_head_active");
    for(var i = 0; i < array.length;i++){
        array[i].className = "data_head";
    }
    array = document.getElementsByClassName("data_head");
    array[id].className = "data_head_active";

    this.lastFileEvent = this.datas[id].handleFileSelect.bind(this.datas[id]);
    this.dataManager.fileLoader.addEventListener('change', this.lastFileEvent, false);
};

/**
 * Set the current data within the application, i.e. for each views, by its id
 * @param {number} id - the current data id
 */
SIMU.Simu.prototype.setCurrentData = function(id){
    var i;
    this.currentDataId = id;
    for(i = 0; i < this.scenes.length;i++){
        this.scenes[i].setCurrentRenderableData(this.currentDataId);
    }
    for(i = 0; i < this.views.length;i++){
        this.views[i].setCurrentRenderableData(this.currentDataId);
    }
};

/**
 * Handle the event in which we change the current data
 * @param {Event} event - The event to blame for calling this function
 */
SIMU.Simu.prototype.changeCurrentData = function(event){
    this.setUICurrentData(event.target.id);
    this.setCurrentData(event.target.id);
};

/**
 * Add empty Snapshot for all available data
 */
SIMU.Simu.prototype.addSnapshot = function(){
    if(this.info.nbSnapShot == 1){
        this.info.currentSnapshotId = 1;
    }
    for(var i = 0; i < this.info.nbData;i++){
        this.datas[i].addSnapshot();
    }
    this.info.nbSnapShot++;
};

/**
 * Update the UI to match the current snapshot
 * @param {number} id - the current snapshot id
 */
SIMU.Simu.prototype.setUICurrentSnapshot = function(id){
    var array = document.getElementsByClassName("snap_head_active");
    for(var i = 0; i < array.length;i++){
        array[i].className = "snap_head";
    }
    array = document.getElementsByClassName("snap_head");
    array[id].className = "snap_head_active";
};

/**
 * Set the current snapshot within the application, i.e. for each views, by its id
 * @param {number} id - the current snapshot id
 */
SIMU.Simu.prototype.setCurrentSnapshot = function(id){
    var i;
    this.currentSnapshotId = id;
    for(i = 0; i < this.datas.length;i++){
        this.datas[i].setCurrentSnapshot(this.currentSnapshotId);
    }
    for(i = 0; i < this.scenes.length;i++){
        this.scenes[i].setCurrentRenderableSnapshot(this.currentSnapshotId);
    }
};

/**
 * Handle the event in which we change the current snapshot
 * @param {Event} event - The event to blame for calling this function
 */
SIMU.Simu.prototype.handleCurrentSnapshotChangeEvent = function(event){
    var i;

    this.parameters.t = 0.0001;

    for (i = 0; i < this.scenes.length; i++) {
        this.scenes[i].setTime(this.parameters.t);
    }
    for (i = 0; i < this.datas.length; i++) {
        this.datas[i].setTime(this.parameters.t);
    }

    this.setCurrentSnapshot(event.target.id);

    this.setUICurrentSnapshot(event.target.id);
    this.timeline.handleCurrentSnapshotChangeEvent(event.target.id);

};

/**
 * Add one column to the data tools, i.e. add one data to each of the views
 */
SIMU.Simu.prototype.addColumn = function(){
    var i;
    var table = document.getElementById('data_table');
    var head = document.getElementById('data_head');
    var trs = table.rows;

    var node;

    node = document.createElement("th");
    node.id = this.info.nbData;


    var id = parseInt(node.id, 10)+1;
    node.innerHTML = "Data " + id;
    node.className = "data_head";
    node.addEventListener('click', this.changeCurrentData.bind(this), false);
    head.insertBefore(node, head.lastElementChild);

    for(i = 1; i < this.info.nbSnapShot + 1; i++){
        node = document.createElement("td");
        node.innerHTML = '<input class=\"browse_button\" id=\"' + i + '_' + (this.info.nbData + 1) + '\" type=\"image\" alt=\"Select. File\" src=\"resources/icons/Download_button_16.png\"/>';
        node.addEventListener('click', this.browse.bind(this), false);
        trs[i].insertBefore(node, trs[i].lastElementChild);
    }

    //Set new data as current
    this.addData();
    this.setUICurrentData(this.info.nbData - 1);
    this.setCurrentData(this.info.nbData - 1);
};

/**
 * Add a row to the data tools, i.e. add one snapshot to each of the available data
 */
SIMU.Simu.prototype.addRow = function(){
    if(this.info.nbData > 0) {
        var table = document.getElementById('data_table');
        var id = table.rows.length - 1;

        //Modify DOM
        table.insertRow(id);
        var tr = table.rows[id];

        var node = document.createElement("td");
        tr.appendChild(node);
        node = document.createElement("td");
        node.innerHTML = "Snap " + id;
        node.id = id - 1;
        node.className = "snap_head";
        node.addEventListener('click', this.handleCurrentSnapshotChangeEvent.bind(this), false);
        tr.insertBefore(node, tr.lastElementChild);
        for (var i = 1; i < this.info.nbData + 1; i++) {
            node = document.createElement("td");
            node.innerHTML = '<input class=\"browse_button\" id=\"' + id + '_' + i + '\" type=\"image\" alt=\"Select. File\" src=\"resources/icons/Download_button_16.png\"/>';
            node.addEventListener('click', this.browse.bind(this), false);
            tr.insertBefore(node, tr.lastElementChild);
        }

        /* Ajout du snapshot à la timeline */
        this.timeline.addSnapshot();

        /* Ajout de l'événement de mise à jour du snapshot sélectionné au clic de souris sur le snapshot */
        this.timeline.snapshots[id-1].html.addEventListener('click', this.handleCurrentSnapshotChangeEvent.bind(this), false);



        //add Snap
        this.addSnapshot();

        //Set new Snap as current
        this.setUICurrentSnapshot(id - 1);
        this.setCurrentSnapshot(id - 1);
    }
};

/**
 * Handle the focus on the different views
 * @param {Event} event - The event to blame for calling this function
 */
SIMU.Simu.prototype.focus = function(event){
    //TODO find a better way of retreiving the id than looking for its parent
    var id = event.target.parentElement.id;

    if(id != ""){
        for (var i = 0; i < this.views.length; i++) {
            if(this.views[i].camera.controls) {
                this.views[i].camera.controls.enabled = false;
            }
        }
        this.currentView = this.views[id];
        if(this.currentView.camera.controls) {
            this.currentView.camera.controls.enabled = true;
        }
    }
};

/**
 * Browse file which will be loaded into the data's snapshot given by id of event target
 * @param {Event} event - The event to blame for calling this function
 */
SIMU.Simu.prototype.browse = function(event){
    document.body.style.cursor = 'progress';

    var el = event.target;

    var id = el.id.split("_");

    this.setUICurrentData(id[1] - 1);
    this.setCurrentData(id[1] - 1);

    this.setUICurrentSnapshot(id[0] - 1);
    this.setCurrentSnapshot(id[0] - 1);

    /* Mise à jour de la timeline */
    this.timeline.handleCurrentSnapshotChangeEvent(id[0] -1);

    document.getElementById('files').click(event);

    document.body.style.cursor = 'crosshair';
};

/**
 * Setup and enabled the keyboard & mouse events
 */
SIMU.Simu.prototype.setupEvents = function(){
    document.getElementById('add_column_button').addEventListener('click', this.addColumn.bind(this), false);
    document.getElementById('add_row_button').addEventListener('click', this.addRow.bind(this), false);

    window.addEventListener('keydown', this.onKeyDown.bind(this), false);
};

/**
 * Handle window resizing in single view mode
 */
SIMU.Simu.prototype.onSingleviewWindowResize = function(){
    this.width = this.domElement.clientWidth;
    this.height = this.domElement.clientHeight;

    this.globalCamera.aspect = this.width/this.height;
    this.globalCamera.updateProjectionMatrix();

    this.rotatingCamera.aspect = this.width / this.height;
    this.rotatingCamera.updateProjectionMatrix();

    for(var i = 0; i < this.fixedCamera.length;i++){
        this.fixedCamera[i].aspect = this.width/this.height;
        this.fixedCamera[i].updateProjectionMatrix();
    }

    this.currentView.resize(this.width, this.height, 0, 0);
};

/**
 * Handle window resizing in multiple view mode
 */
SIMU.Simu.prototype.onMultiviewWindowResize = function(){
    var length = this.views.length;

    this.width = this.domElement.clientWidth;
    this.height = this.domElement.clientHeight;

    this.globalCamera.aspect = (this.width / 2)/this.height;
    this.globalCamera.updateProjectionMatrix();

    this.rotatingCamera.aspect = (this.width/2) / this.height;
    this.rotatingCamera.updateProjectionMatrix();

    for(var i = 0; i < this.fixedCamera.length;i++){
        this.fixedCamera[i].aspect = (this.width/2)/this.height;
        this.fixedCamera[i].updateProjectionMatrix();
    }

    for(var i = 0; i < length;i++){
        this.views[i].resize(length > 1 ? this.width / 2 : this.width,
            length > 2 ? this.width / 2 : this.height,
            0/*window.innerWidth / 2 * (i%2)*/,
            this.height / 2 * Math.floor((i/2)));
    }
};

/**
 * Handle keyboard event
 * @param {Event} event - The keyboard event who has call this function
 */
SIMU.Simu.prototype.onKeyDown = function(event){
    switch(event.keyCode){
        case 80 ://p
            this.onPlay();
            break;
        case 27 ://escape
            if(this.menu.isDisplayed){
                for(var i = 0; i < this.views.length;i++){
                    if(this.views[i].isShown){
                        this.views[i].render();
                    }
                }
                this.menu.hideMenu();
                this.animate();

            }else{
                for(i = 0; i < this.views.length;i++){
                    if(this.views[i].isShown){
                        this.views[i].stopRender();
                    }
                }
                this.stopAnimation();
                this.menu.displayMenu();

            }
            break;
        case 72 ://h
            for(i = 0; i < this.views.length;i++){
                this.views[i].hideGui();
            }
            this.hideUI();
            break;
        case 85 ://t
            for(i = 0; i < this.views.length;i++){
                this.views[i].showGui();
            }
            this.showUI();
            break;
        case 104 ://Pav num 8
            this.currentView.enableFixedCamera(0);
            break;
        case 100 ://Pav num 8
            this.currentView.enableFixedCamera(1);
            break;
        case 102 ://Pav num 8
            this.currentView.enableFixedCamera(2);
            break;
        case 101 ://Pav num 5
            this.currentView.disableFixedCamera();
            break;
        case 82 :
            this.currentView.switchRotatedCamera();
            break;
        default :
            console.log(" You just press " + event.keyCode);
            break;
    }
};

/**
 * Computes and updates time in parameters property based on the cursor position when it's released. Change current snapshot and updates datas too.
 *
 */
SIMU.Simu.prototype.updateTimeOnCursorRelease = function()
{
    /* Si l'événement est bien appelé après le déplacement du curseur, on met à jour */
    if (this.timeline.cursor.positionHasToBeComputed)
    {
        /* Stockage de l'identifiant du snapshot courant */
        var id = this.timeline.lookForCurrentSnapshot();

        /* Mise à jour du snapshot sélectionné */
        this.setUICurrentSnapshot(id);
        this.setCurrentSnapshot(id);
        this.timeline.setCurrentSnapshotId(id);

        /* Calcul du temps en fonction de la position du curseur */
        this.parameters.t = (this.timeline.cursor.getOffset() + 10 - Math.floor(id * this.timeline.interval)) / this.timeline.interval;

        /* Si le curseur se situe sur un snapshot, on passe le temps à 0.0001 par défaut */
        if (this.parameters.t == 0)
        {
            this.parameters.t = 0.0001;
        }

        /* Mise à jour des données */
        this.updateDataOnTimeChange();

        /* Il n'est plus nécessaire de mettre à jour avant le prochain déplacement du curseur */
        this.timeline.cursor.positionHasToBeComputed = false;

        /* @todo : keep it, it can be useful to improve the application. But it's not absolutely necessary.
         // Fonction catch qui permet d'attraper le curseur lorsque celui-ci est très proche d'un snapshot.
         // Peut toujours être utile, à conserver si nécessaire.
         // Exemple : En général, il est très compliqué de drag & drop le curseur pile sur un snapshot, on sera toujours à un pixel à côté. Cette fonctionnalité serait indispensable pour l'expérience utilisateur si un clic ne permettait pas de positionner le curseur sur un snapshot.

         /* Boucle sur les objets Snapshot2 du tableau snapshots
         for (var i = 0; i < this.timeline.nbSnapshots; i++)
         {
         /* Si le curseur se situe dans un intervalle ]-10, +10[ autour du snapshot, on sélectionne ce snapshot
         if (this.timeline.cursor.getOffset() + 10 > this.timeline.snapshots[i].getOffset() - 10
         && this.timeline.cursor.getOffset() + 10 < this.timeline.snapshots[i].getOffset() + 10)
         {
         //Set new Snap as current
         this.setUICurrentSnapshot(i);
         this.setCurrentSnapshotId(i);

         /* Mise à jour de la timeline
         this.timeline.handleCurrentSnapshotChangeEvent(i);
         }
         }
         */
    }
};

/**
 * Updates datas based on time in parameters property
 *
 */
SIMU.Simu.prototype.updateDataOnTimeChange = function()
{
    var i;
    for (i = 0; i < this.scenes.length; i++) {
        this.scenes[i].setTime(this.parameters.t);
    }
    for (i = 0; i < this.datas.length; i++) {
        this.datas[i].setTime(this.parameters.t);
    }
    if(!this.parameters.play){
        for (i = 0; i < this.datas.length; i++) {
            if(this.datas[i].isReady) {
                this.datas[i].computePositions();
            }
        }
        for (i = 0; i < this.scenes.length; i++) {
            this.scenes[i].dataHasChanged();
        }
    }
};

/**
 * Computes and updates time in parameters property based on the cursor position when the cursor is moving. Dynamically change the current snapshot too.
 *
 */
SIMU.Simu.prototype.updateTimeOnCursorMove = function()
{
    /* Si on bien dans le cas du curseur en mouvement */
    if (this.timeline.cursor.isMoving)
    {
        /* Stockage de l'identifiant du snapshot courant */
        var id = this.timeline.lookForCurrentSnapshot();

        /* Mise à jour visuelle de l'interface */
        this.setUICurrentSnapshot(id);

        /* Calcul du temps en fonction de la position du curseur */
        this.parameters.t = (this.timeline.cursor.getOffset() + 10 - Math.floor(id * this.timeline.interval)) / this.timeline.interval;

        /* Si le curseur se situe sur un snapshot, on passe le temps à 0.0001 par défaut */
        if (this.parameters.t == 0)
        {
            this.parameters.t = 0.0001;
        }
    }
};

/**
 * Initilalizes or interrumpts the animation when play event is fired
 *
 */
SIMU.Simu.prototype.onPlay = function()
{
    if(this.currentSnapshotId >= 0 && this.currentSnapshotId < this.info.nbSnapShot - 1) {
        if (this.parameters.play) {
            this.parameters.play = false;
            this.timeline.setPlayButton();
            var i;
            for (i = 0; i < this.datas.length; i++) {
                if (this.datas[i].isReady) {
                    this.datas[i].computePositions();
                }
            }
            for (i = 0; i < this.scenes.length; i++) {
                this.scenes[i].dataHasChanged();
                if(this.scenes[i].parameters.shaderType == SIMU.ShaderType.ANIMATED){
                    this.scenes[i].setShaderType(SIMU.ShaderType.STATIC);
                }else if(this.scenes[i].parameters.shaderType == SIMU.ShaderType.PARAMETRICANIMATED){
                    this.scenes[i].setShaderType(SIMU.ShaderType.PARAMETRICSTATIC);
                }
            }
        } else {
            this.parameters.play = true;
            this.timeline.setStopButton();
            for (i = 0; i < this.scenes.length; i++) {
                this.scenes[i].dataHasChanged();
                if(this.scenes[i].parameters.shaderType == SIMU.ShaderType.STATIC){
                    this.scenes[i].setShaderType(SIMU.ShaderType.ANIMATED);
                }else if(this.scenes[i].parameters.shaderType == SIMU.ShaderType.PARAMETRICSTATIC){
                    this.scenes[i].setShaderType(SIMU.ShaderType.PARAMETRICANIMATED);
                }

            }
        }
    }
};
