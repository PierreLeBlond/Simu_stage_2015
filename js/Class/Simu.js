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

    this.info                   = {
        "nbSnapShot"          : 0,
        "nbData"              : 0
    };

    this.datas                  = [];
    this.currentDataId          = -1;
    this.currentSnapshotId      = -1;

    this.views                  = [];
    this.currentView            = null;

    this.controls               = null;

//name space for file type
    this.FileType               = {
        SKYBOT : 0,
        BIN : 1,
        STRING : 2
    };

    /* List of different types of display, useful to remember the current display */
    this.DisplayType            = {
        UNKNOWN : 0,
        SIMPLEVIEW : 1,
        MULTIVIEW : 2,
        OCULUS : 3,
        CARDBOARD : 4
    };

    this.RaycastingType         = {
        NONE : 0,
        HOMEMADE : 1,
        THREEJS : 2
    };

    this.globalCamera           = null;

    this.RAYCASTINGTYPE         = this.RaycastingType.HOMEMADE;

    /* Used to remember the current display */
    this.currentDisplay         = this.DisplayType.UNKNOWN;

    /*Used to enable and disable controls out and in menu */
    this.controlsEnabled        = true;

    this.type                   = this.FileType.STRING;

    this.scripts                = [];

    this.lastFileEvent          = null;

};

SIMU.Simu.prototype.addScript = function(name, script, binary){
    var newScript = new SIMU.Script();
    this.scripts.push(newScript);
    newScript.name = name;
    newScript.script = script;
    newScript.binary = binary;
};

/**
 * @description Setup the different views, enable file reading
 */
SIMU.Simu.prototype.setupSimu = function(){
    document.getElementById('blocker').style.display = 'none';

    this.globalCamera = new THREE.PerspectiveCamera(75, (window.innerWidth/2) / window.innerHeight, 0.00001, 200);
    this.globalCamera.rotation.order  = 'ZYX';
    this.globalCamera.position.set(0.5, 0.5, 0.5);
    this.globalCamera.lookAt(new THREE.Vector3(0, 0, 0));

    this.views.push(new SIMU.View(window));
    this.views.push(new SIMU.View(window));
    this.currentView = this.views[0];
    this.currentView.domElement.id = 0;
    this.currentView.setupView(0, 0, window.innerWidth/2, window.innerHeight);
    this.currentView.setupGui();
    document.getElementById('container').appendChild(this.currentView.domElement);
    this.currentView.setGlobalCamera(this.globalCamera);
    this.currentView.render();

    this.currentView = this.views[1];
    this.currentView.domElement.id = 1;
    this.currentView.setupView(window.innerWidth/2, 0, window.innerWidth/2, window.innerHeight);
    this.currentView.setupGui();
    document.getElementById('container').appendChild(this.currentView.domElement);
    this.currentView.setGlobalCamera(this.globalCamera);
    this.currentView.render();

    this.globalCamera.controls = new THREE.FirstPersonControls(this.globalCamera, document.getElementById('container'));
    this.globalCamera.controls.moveSpeed = 0.5;
    this.globalCamera.controls.enabled = false;
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
};

/**
 * @description handle animation, i.e. move in time
 */
SIMU.Simu.prototype.animate = function(){
    if(this.parameters.play) {
        if (this.parameters.t < 1.0) {
            this.parameters.t += this.parameters.speed / 100;
        } else {
            if (this.currentSnapshotId > 0 && this.currentSnapshotId < this.info.nbSnapShot - 1) {//If next snap isn't the last one
                this.parameters.t = 0.0;
                this.currentSnapshotId++;

                //TODO this kind of code is redundant !
                document.getElementsByClassName("snap_head_active")[0].className = "snap_head";
                var array = document.getElementsByClassName("snap_head");
                array[this.currentSnapshotId].className = "snap_head_active";
                for (var i = 0; i < this.datas.length; i++) {
                    this.datas[i].changeSnapshot(this.currentSnapshotId);
                }
                for(i = 0; i < this.views.length;i++){
                    this.views[i].setCurrentRenderableSnapshotId(this.currentSnapshotId);
                }

            } else {//else let's jump to last snap and set t at 0
                this.parameters.play = false;
                this.parameters.t = 0.0;
                this.currentSnapshotId++;

                document.getElementsByClassName("snap_head_active")[0].className = "snap_head";
                array = document.getElementsByClassName("snap_head");
                array[this.currentSnapshotId].className = "snap_head_active";
                for (i = 0; i < this.datas.length; i++) {
                    this.datas[i].changeSnapshot(this.currentSnapshotId);
                    this.datas[i].computePositions();
                }
                for(i = 0; i < this.views.length;i++){
                    this.views[i].setCurrentRenderableSnapshotId(this.currentSnapshotId);
                }
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
    var event = document.getElementById('files').addEventListener('change', this.lastFileEvent, false);
    console.log(event);
};

SIMU.Simu.prototype.changeCurrentData = function(event){
    this.setUICurrentSnapshot(event.target.id);
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
    var id = event.target.parentElement.id;

    if(id != ""){
        for (var i = 0; i < this.views.length; i++) {
            if(!this.views[i].parameters.linkcamera) {
                this.views[i].camera.controls.enabled = false;
            }
        }
        this.views[id].camera.controls.enabled = true;
    }
};

SIMU.Simu.prototype.browse = function(event){
    //TODO disable event on browse to avoid conflict until data is load and push into buffers

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
    window.addEventListener( 'resize',this.onWindowResize.bind(this), false );

    document.getElementById('add_column_button').addEventListener('click', this.addColumn.bind(this), false);
    document.getElementById('add_row_button').addEventListener('click', this.addRow.bind(this), false);

    window.addEventListener('keydown', this.onKeyDown.bind(this), false);

    for (var i = 0; i < this.views.length; i++) {
        this.views[i].domElement.addEventListener('click', this.focus.bind(this), false);
    }
};

SIMU.Simu.prototype.onWindowResize = function(){
    var length = this.views.length;
    for(var i = 0; i < length;i++){
        this.views[i].resize(length > 1 ? window.innerWidth / 2: window.innerWidth,
            length > 2 ? window.innerHeight / 2: window.innerHeight,
            window.innerWidth / 2 * (i%2),
            window.innerHeight / 2 * Math.floor((i/2)));
    }
};

SIMU.Simu.prototype.onKeyDown = function(event){
    switch(event.keyCode){
        case 80 ://p
            if(this.currentSnapshotId > 0 && this.currentSnapshotId < this.nbSnapShot) {
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
        default:
            break;
    }
};