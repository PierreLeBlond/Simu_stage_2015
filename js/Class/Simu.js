/**
 * Created by lespingal on 22/07/15.
 * @description Welcome to class Simu ! this class set all stuff required to visualize data
 * - A main container to dispatch different views
 * - A few views to render data
 * - A bunch of data to be rendered
 */
var SIMU = SIMU || {};

/**
 * @description Constructor of class Simu
 * @constructor
 */
SIMU.Simu = function(){
    //Global parameters of the App
    this.parameters             = {
        "t"                   : 0.00001,
        "position"            : 0,
        "speed"               : 0.5,
        "idScript"            : 0,
        "raycasting"          : false,
        "frustumculling"      : false,
        "play"                : false,
        "octreeprecision"     : 0
    };

    //General info about data
    this.info                   = {
        "nbSnapShot"          : 0,
        "nbData"              : 0
    };

    this.datas                  = [];
    this.currentDataId          = -1;
    this.currentSnapshotId      = -1;

    //Views
    this.views                  = [];
    this.currentView            = null;

    this.controls               = null;

    /* List of different types of display, useful to remember the current display */
    this.DisplayType            = {
        UNKNOWN : 0,
        SIMPLEVIEW : 1,
        MULTIVIEW : 2,
        OCULUS : 3,
        CARDBOARD : 4
    };

    //This camera is used to have different views with the same point of view
    this.globalCamera           = null;

    /* Used to remember the current display */
    this.currentDisplay         = this.DisplayType.UNKNOWN;

    /*Used to enable and disable controls out and in menu */
    this.controlsEnabled        = true;

    this.scripts                = [];

    this.menu                   = null;

    //Store the reference one the last loading file function, for it will be remove if current data change
    this.lastFileEvent          = null;
    this.windowResizeEvent      = null;

};

/**
 * @description Add a script
 * @param {string} name Name of the script
 * @param {function} script The script logic
 * @param {boolean} binary Do the script work with binary file or string formatted file ?
 */
SIMU.Simu.prototype.addScript = function(name, script, binary){
    var newScript = new SIMU.Script();
    this.scripts.push(newScript);
    newScript.name = name;
    newScript.script = script;
    newScript.binary = binary;
};

/**
 * @description Setup the menu and the global camera
 */
SIMU.Simu.prototype.setupSimu = function(){
    this.menu = new SIMU.Menu();
    this.menu.initialize();

    this.menu.simpleView.addEventListener('click', this.switchToSingleview.bind(this), false);
    this.menu.multiView.addEventListener('click', this.switchToMultiview.bind(this), false);

    this.globalCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.00001, 200);
    this.globalCamera.rotation.order  = 'ZYX';
    this.globalCamera.position.set(0.5, 0.5, 0.5);
    this.globalCamera.lookAt(new THREE.Vector3(0, 0, 0));

    this.globalCamera.controls = new THREE.FirstPersonControls(this.globalCamera, document.getElementById('container'));
    this.globalCamera.controls.moveSpeed = 0.5;
    this.globalCamera.controls.enabled = false;

    this.menu.displayMenu();
};

/**
 * @description Enter simple view mode
 */
SIMU.Simu.prototype.switchToSingleview = function(){

    this.menu.hideMenu();

    document.getElementById('container').innerHTML = "";

    this.globalCamera.aspect = window.innerWidth / window.innerHeight;
    this.globalCamera.updateProjectionMatrix();

    if(this.views.length == 0){
        var view = new SIMU.View();
        view.setupView(0, 0, window.innerWidth, window.innerHeight);
        view.setupScene();
        view.setupGui();
        this.views.push(view);
    }
    this.currentView = this.views[0];
    this.currentView.domElement.id = 0;
    document.getElementById('container').appendChild(this.currentView.domElement);
    this.currentView.isShown = true;
    this.currentView.resize(window.innerWidth, window.innerHeight, 0, 0);
    this.currentView.setGlobalCamera(this.globalCamera);
    this.currentView.render();

    if(this.windowResizeEvent){
        window.removeEventListener('resize', this.windowResizeEvent, false);
    }
    this.windowResizeEvent = this.onSingleviewWindowResize.bind(this);
    window.addEventListener( 'resize',this.windowResizeEvent, false );

    this.showUI();
};

/**
 * @description Enter multiple view mode, two view in this case and so far
 */
SIMU.Simu.prototype.switchToMultiview = function()
{

    this.menu.hideMenu();

    document.getElementById('container').innerHTML = "";

    this.globalCamera.aspect = (window.innerWidth/2) / window.innerHeight;
    this.globalCamera.updateProjectionMatrix();

    if(this.views.length == 0){
        var view = new SIMU.View();
        view.setupView(0, 0, (window.innerWidth/2), window.innerHeight);
        view.setupScene();
        view.setupGui();
        this.views.push(view);
    }
    if(this.views.length == 1){
        view = new SIMU.View();
        view.setupView(0, 0, (window.innerWidth/2), window.innerHeight);
        view.setupScene();
        view.setupGui();
        this.views.push(view);
    }

    this.currentView = this.views[0];
    this.currentView.domElement.id = 0;
    document.getElementById('container').appendChild(this.currentView.domElement);
    this.currentView.isShown = true;
    this.currentView.resize((window.innerWidth/2), window.innerHeight, 0, 0);
    this.currentView.setGlobalCamera(this.globalCamera);
    this.currentView.render();

    this.currentView = this.views[1];
    this.currentView.domElement.id = 1;
    document.getElementById('container').appendChild(this.currentView.domElement);
    this.currentView.isShown = true;
    this.currentView.resize((window.innerWidth/2), window.innerHeight, 0, 0);
    this.currentView.setGlobalCamera(this.globalCamera);
    this.currentView.render();

    this.windowResizeEvent = this.onMultiviewWindowResize.bind(this);
    window.addEventListener( 'resize',this.windowResizeEvent, false );

    this.showUI();
};

/**
 * @description Setup the User Interface
 */
SIMU.Simu.prototype.setupGui = function(){

    var that = this;

    this.gui = new dat.GUI();

    //SIMU.gui.name('Global parameters');

    var animationFolder = this.gui.addFolder('Animation');

    animationFolder.add(this.parameters, 't', 0.00001, 1).name("time").listen().onFinishChange(function(value){
        var i;
        for (i = 0; i < that.views.length; i++) {
            that.views[i].setTime(value);
        }
        for (i = 0; i < that.datas.length; i++) {
            that.datas[i].setTime(value);
        }
        if(!that.parameters.play){
            for (i = 0; i < that.datas.length; i++) {
                that.datas[i].computePositions();
            }
            for (i = 0; i < that.views.length; i++) {
                that.views[i].dataHasChanged();
            }
        }
    });
    animationFolder.add(this.parameters, 'position', 0, 5).name("position").listen();
    animationFolder.add(this.parameters, 'speed', 0.00001, 1).name("speed").listen();

    var scriptFolder = this.gui.addFolder('Script');
    scriptFolder.add(this.parameters, 'idScript', {Deparis : 0, Schaaff : 1, DeparisStar : 2}).name("script").onFinishChange(function(value){
        for(var i = 0; i < that.datas.length;i++){
            that.datas[i].setScript(that.scripts[value]);
        }
    });

    var perfFolder = this.gui.addFolder('Perf');

    perfFolder.add(this.parameters, 'raycasting').name("Raycasting");
    perfFolder.add(this.parameters, 'frustumculling').name("Frustum Culling");
    perfFolder.add(this.parameters, 'octreeprecision', 0, 5).name("Octree Precision");

    this.setupEvents();

    document.getElementById('fileLoadingProgress').style.display = "none";

    this.hideUI();
};

/**
 * Hide the User Interface
 */
SIMU.Simu.prototype.hideUI = function(){
    document.getElementById('data_manager').style.display = "none";
    this.gui.domElement.style.display = "none";
};

/**
 * Show the User Interface
 */
SIMU.Simu.prototype.showUI = function(){
    document.getElementById('data_manager').style.display = "block";
    this.gui.domElement.style.display = "block";
};

/**
 * @description handle animation, i.e. move in time
 */
SIMU.Simu.prototype.animate = function(){
    if(this.parameters.play) {
        if (this.parameters.t < 1.0) {
            this.parameters.t += this.parameters.speed / 100;
        } else {
            this.parameters.t = 0.0001;
            this.currentSnapshotId++;

            this.setUICurrentSnapshot(this.currentSnapshotId);
            this.setCurrentSnapshotId(this.currentSnapshotId);

            if (this.currentSnapshotId >= this.info.nbSnapShot - 1) {
                this.parameters.play = false;
            }

        }

        for (i = 0; i < this.views.length; i++) {
            this.views[i].setTime(this.parameters.t);
        }
        for (i = 0; i < this.datas.length; i++) {
            this.datas[i].setTime(this.parameters.t);
        }
    }
};

SIMU.Simu.prototype.render = function(){
    this.animate();

    var that = this;
    this.requestId = requestAnimationFrame(function (){
        that.render();
    });

    for(var i = 0; i < this.views.length; i++){
        if(this.views[i].parameters.synchrorendering) {
            this.views[i].render();
        }
    }
};

SIMU.Simu.prototype.stopRender = function(){
    cancelAnimationFrame(this.requestId);
};

SIMU.Simu.prototype.addData = function(){
    //TODO get id data & snap
    var i;
    var data = new SIMU.Data();
    for(i = 0; i < this.info.nbSnapShot;i++){
        data.addSnapshot();
    }
    this.datas.push(data);
    data.setScript(this.scripts[this.parameters.idScript]);
    this.info.nbData++;

    var renderableData;
    for(i = 0; i < this.views.length;i++){
        renderableData = new SIMU.RenderableData();
        renderableData.setData(data);
        this.views[i].addRenderableData(renderableData);
    }
};

SIMU.Simu.prototype.addSnapshot = function(){
    if(this.info.nbSnapShot == 1){
        this.info.currentSnapshotId = 1;
    }
    for(var i = 0; i < this.info.nbData;i++){
        this.datas[i].addSnapshot();
    }
    this.info.nbSnapShot++;
};

SIMU.Simu.prototype.setUICurrentSnapshot = function(id){
    var array = document.getElementsByClassName("snap_head_active");
    for(var i = 0; i < array.length;i++){
        array[i].className = "snap_head";
    }
    array = document.getElementsByClassName("snap_head");
    array[id].className = "snap_head_active";
};

SIMU.Simu.prototype.setCurrentDataId = function(id){
    var i;


    if(this.currentDataId != -1) {
        document.getElementById('files').removeEventListener('change', this.lastFileEvent, false);
    }

    this.currentDataId = id;
    for(i = 0; i < this.views.length;i++){
        this.views[i].setCurrentRenderableDataId(this.currentDataId);
    }

    this.lastFileEvent = this.datas[this.currentDataId].handleFileSelect.bind(this.datas[this.currentDataId]);
    document.getElementById('files').addEventListener('change', this.lastFileEvent, false);
};

SIMU.Simu.prototype.changeCurrentData = function(event){
    this.setUICurrentData(event.target.id);
    this.setCurrentDataId(event.target.id);
};

SIMU.Simu.prototype.setUICurrentData = function(id){
    var array = document.getElementsByClassName("data_head_active");
    for(var i = 0; i < array.length;i++){
        array[i].className = "data_head";
    }
    array = document.getElementsByClassName("data_head");
    array[id].className = "data_head_active";
};

SIMU.Simu.prototype.setCurrentSnapshotId = function(id){
    var i;
    this.currentSnapshotId = id;
    for(i = 0; i < this.datas.length;i++){
        this.datas[i].changeSnapshot(this.currentSnapshotId);
    }
    for(i = 0; i < this.views.length;i++){
        this.views[i].setCurrentRenderableSnapshotId(this.currentSnapshotId);
    }
};

SIMU.Simu.prototype.changeCurrentSnapshot = function(event){
    this.setUICurrentSnapshot(event.target.id);
    this.setCurrentSnapshotId(event.target.id);
};

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
    //this.currentDataId = this.info.nbData - 1;
    this.setUICurrentData(this.info.nbData - 1);
    this.setCurrentDataId(this.info.nbData - 1);

    for(i = 0; i < this.views.length;i++){
        this.views[i].setCurrentRenderableDataId(this.currentDataId);
    }

};

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
        node.addEventListener('click', this.changeCurrentSnapshot.bind(this), false);
        tr.insertBefore(node, tr.lastElementChild);
        for (var i = 1; i < this.info.nbData + 1; i++) {
            node = document.createElement("td");
            node.innerHTML = '<input class=\"browse_button\" id=\"' + id + '_' + i + '\" type=\"image\" alt=\"Select. File\" src=\"resources/icons/Download_button_16.png\"/>';
            node.addEventListener('click', this.browse.bind(this), false);
            tr.insertBefore(node, tr.lastElementChild);
        }

        //add Snap
        this.addSnapshot();

        //Set new Snap as current
        this.setUICurrentSnapshot(id - 1);
        this.setCurrentSnapshotId(id - 1);
        //this.currentSnapshotId = id - 1;
        for(i = 0; i < this.datas.length;i++){
            this.datas[i].changeSnapshot(this.currentSnapshotId);
        }
        for(i = 0; i < this.views.length;i++){
            this.views[i].setCurrentRenderableSnapshotId(this.currentSnapshotId);
        }
    }
};

//UI related action
/**
 * @description Handle the focus on the different views
 * @param event
 */
SIMU.Simu.prototype.focus = function(event){
    console.log(event.target);
    //TODO find a better way of retreiving the id than looking for its parent
    var id = event.target.parentElement.id;

    if(id != ""){
        for (var i = 0; i < this.views.length; i++) {
                this.views[i].camera.controls.enabled = false;
        }
        this.currentView = this.views[id];
        this.currentView = this.views[id].camera.controls.enabled = true;
    }
};

SIMU.Simu.prototype.browse = function(event){
    document.body.style.cursor = 'progress';

    var el = event.target;

    var id = el.id.split("_");

    this.setUICurrentData(id[1] - 1);
    this.setCurrentDataId(id[1] - 1);

    this.setUICurrentSnapshot(id[0] - 1);
    this.setCurrentSnapshotId(id[0] - 1);

    document.getElementById('files').click(event);

    document.body.style.cursor = 'crosshair';
};


//Events
SIMU.Simu.prototype.setupEvents = function(){

    document.getElementById('add_column_button').addEventListener('click', this.addColumn.bind(this), false);
    document.getElementById('add_row_button').addEventListener('click', this.addRow.bind(this), false);

    window.addEventListener('keydown', this.onKeyDown.bind(this), false);

    for (var i = 0; i < this.views.length; i++) {
        this.views[i].domElement.addEventListener('click', this.focus.bind(this), false);
    }
};

SIMU.Simu.prototype.onSingleviewWindowResize = function(){
    /*document.getElementById('container').style.width = window.innerWidth + "px";
    document.getElementById('container').style.height = window.innerHeight + "px";*/
    this.globalCamera.aspect = window.innerWidth/window.innerHeight;
    this.globalCamera.updateProjectionMatrix();
    this.currentView.resize(window.innerWidth, window.innerHeight, 0, 0);
};

SIMU.Simu.prototype.onMultiviewWindowResize = function(){
    var length = this.views.length;
    /*document.getElementById('container').style.width = window.innerWidth + "px";
    document.getElementById('container').style.height = window.innerHeight + "px";*/
    this.globalCamera.aspect = (window.innerWidth / 2)/window.innerHeight;
    this.globalCamera.updateProjectionMatrix();
    for(var i = 0; i < length;i++){
        this.views[i].resize(length > 1 ? window.innerWidth / 2: window.innerWidth,
            length > 2 ? window.innerHeight / 2: window.innerHeight,
            0/*window.innerWidth / 2 * (i%2)*/,
            window.innerHeight / 2 * Math.floor((i/2)));
    }
};

SIMU.Simu.prototype.onKeyDown = function(event){
    switch(event.keyCode){
        case 80 ://p
            if(this.currentSnapshotId >= 0 && this.currentSnapshotId < this.info.nbSnapShot - 1) {
                if (this.parameters.play) {
                    this.parameters.play = false;
                    var i;
                    for (i = 0; i < this.datas.length; i++) {
                        this.datas[i].computePositions();
                    }
                    for (i = 0; i < this.views.length; i++) {
                        this.views[i].dataHasChanged();
                        this.views[i].setStaticShaderMode();
                    }
                } else {
                    this.parameters.play = true;
                    for (i = 0; i < this.views.length; i++) {
                        this.views[i].dataHasChanged();
                        this.views[i].setAnimatedShaderMode();
                    }
                }
            }
            break;
        case 27 :
            if(this.menu.isDisplayed){
                for(i = 0; i < this.views.length;i++){
                    if(this.views[i].isShown){
                        this.views[i].render();
                    }
                }
                this.menu.hideMenu();
                this.render();

            }else{
                for(i = 0; i < this.views.length;i++){
                    if(this.views[i].isShown){
                        this.views[i].stopRender();
                    }
                }
                this.stopRender();
                this.menu.displayMenu();

            }
            break;
        default:
            break;
    }
};