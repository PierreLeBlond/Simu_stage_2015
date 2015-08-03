/**
 * Created by lespingal on 30/07/15.
 */
var SIMU = SIMU || {};

SIMU.Scene = function(){

    this.scene                      = null;             /** The scene **/

    this.privateCamera              = null;             /** private camera **/

    this.parameters                 = {                 /** Scene parameters **/
        t                           : 0,                /** The snapshot time **/
        delta_t                     : 0,                /** The current elapsed time **/
        active                      : false,            /** True if the current point cloud is displayed **/
        pointsize                   : 0.5,              /** Size of the particle within the point cloud **/
        fog                         : false,            /** True if the fog is enable **/
        linkcamera                  : false,            /** True if the current used camera is the global one **/
        isStatic                    : true,             /** True if we are in static mode **/
        color                       : [ 255, 255, 255], /** Default color of the current point cloud **/
        idInfo                      : -1,               /** Id of the current info of the current point cloud **/
        idTexture                   : -1,               /** Id of the texture used in the current point cloud **/
        idBlending                  : -1,               /** Id of the blending mode used in the current point cloud **/
        frustumculling              : true,             /** True if view frustum culling is enabled **/
        levelOfDetail               : 4                 /** level of detail of the point cloud **/
    };

    this.texture                    = [];               /** Array of available texture **/
    this.blending                   = [                 /** Array of available blending mode **/
        THREE.NoBlending,
        THREE.NormalBlending,
        THREE.AdditiveBlending,
        THREE.SubtractiveBlending,
        THREE.MultiplyBlending
    ];

    this.renderableDatas            = [];               /** Array of point cloud **/
    this.currentRenderableDataId    = -1;               /** Id of current used point cloud **/
    this.currentRenderableSnapshotId= -1;               /** Id of current snapshot **/

    this.target                     = null;             /** Current point selected **/

};

/**
 * @description set time for the scene to t
 * @detail get called whenever time is changing within the application
 * @param t
 */
SIMU.Scene.prototype.setTime = function(t){
    for(var i = 0; i < this.renderableDatas.length;i++){
        this.renderableDatas[i].uniforms.t.value = t;
    }
};

SIMU.Scene.prototype.setDeltaT = function(t){
    for(var i = 0; i < this.renderableDatas.length;i++){
        this.renderableDatas[i].uniforms.current_time.value = t;
    }
};

/**
 * @description Setup the scene
 */
SIMU.Scene.prototype.setupScene = function(){
    this.scene = new THREE.Scene();

    var axisHelper = new THREE.AxisHelper(1);
    this.scene.add( axisHelper );
    axisHelper.frustumCulled = true;

    this.privateCamera = new THREE.PerspectiveCamera( 75, 1.0, 0.00001, 200 );
    this.privateCamera.rotation.order = 'ZYX'; //to fit with FPScontrols
    this.privateCamera.position.set(0.5,0.5,0.5);
    this.privateCamera.lookAt(new THREE.Vector3(0, 0, 0));

    this.privateCamera.frustum = new THREE.Frustum();
};

/**
 * @description Activate the current RenderableData object
 */
SIMU.Scene.prototype.activateCurrentData = function(){
    var currentRenderableData = this.renderableDatas[this.currentRenderableDataId];
    currentRenderableData.resetData();
    if(this.parameters.isStatic){
        currentRenderableData.enableStaticShaderMode();
    }else{
        currentRenderableData.enableAnimatedShaderMode();
    }
    currentRenderableData.isActive = true;
    this.scene.add(currentRenderableData.pointCloud);
};

/**
 * @description Deactivate the current Renderabledata object
 */
SIMU.Scene.prototype.deactivateCurrentData = function(){
    var currentRenderableData = this.renderableDatas[this.currentRenderableDataId];
    currentRenderableData.isActive = false;
    this.scene.remove(currentRenderableData.pointCloud);
};

/**
 * @description Set fog state
 * @param {boolean} bool - State of fog parameter
 */
SIMU.Scene.prototype.setCurrentDataFog = function(bool){
    if (this.currentRenderableDataId >= 0) {
        this.renderableDatas[this.currentRenderableDataId].uniforms.fog.value = bool ? 1 : 0;
    }
};

/**
 * @description Set fog state
 * @param {boolean} bool - State of fog parameter
 */
SIMU.Scene.prototype.setCurrentDataBlink = function(bool){
    if (this.currentRenderableDataId >= 0) {
        this.renderableDatas[this.currentRenderableDataId].uniforms.blink.value = bool ? 1 : 0;
    }
};

/**
 * @description Set texture for the current RenderableData object
 * @param {int} texture - Id of wanted texture
 */
SIMU.Scene.prototype.setCurrentDataTexture = function(texture){
    if (this.currentRenderableDataId >= 0) {
        this.renderableDatas[this.currentRenderableDataId].idTexture = texture;
        this.renderableDatas[this.currentRenderableDataId].uniforms.map.value = this.texture[texture];
    }
};

/**
 * @description Set point's size for the current RenderableData object
 * @param pointSize
 */
SIMU.Scene.prototype.setCurrentDataPointSize = function(pointSize){
    if (this.currentRenderableDataId >= 0) {
        this.renderableDatas[this.currentRenderableDataId].uniforms.size.value = pointSize;
    }
};

/**
 * @description Set default color for the current RenderableData object
 * @param color
 */
SIMU.Scene.prototype.setCurrentDataColor = function(color){
    if (this.currentRenderableDataId >= 0) {
        this.renderableDatas[this.currentRenderableDataId].defaultColor = color;
        var r = color[0] / 255;
        var g = color[1] / 255;
        var b = color[2] / 255;
        var colorArray = this.renderableDatas[this.currentRenderableDataId].pointCloud.geometry.attributes.color;
        for (var i = 0; i < colorArray.length / 3; i++) {
            colorArray.array[3 * i] = r;
            colorArray.array[3 * i + 1] = g;
            colorArray.array[3 * i + 2] = b;
        }
        colorArray.needsUpdate = true;
    }
};

SIMU.Scene.prototype.setCurrentDataLevelOfDetail = function(levelOfDetail){
    if (this.currentRenderableDataId >= 0) {
        this.renderableDatas[this.currentRenderableDataId].levelOfDetail = levelOfDetail;
    }
};

SIMU.Scene.prototype.setCurrentDataBlendingType = function(blendingType){
    if (this.currentRenderableDataId >= 0) {
        this.renderableDatas[this.currentRenderableDataId].animatedShaderMaterial.blending = this.blending[blendingType];
        this.renderableDatas[this.currentRenderableDataId].staticShaderMaterial.blending = this.blending[blendingType];
    }
};



/**
 * @description Add RenderableData object
 * @param {SIMU.RenderableData} renderableData
 */
SIMU.Scene.prototype.addRenderableData = function(renderableData)
{
    this.renderableDatas.push(renderableData);
};

/**
 * @description Set id of current RenderableData object
 * @param {int} id - The id of the current RenderableData object
 */
SIMU.Scene.prototype.setCurrentRenderableDataId = function(id){
    this.currentRenderableDataId = id;
};

/**
 * @description Set the id of the current Snapshot object
 * @detail Reset the data to refresh the display
 * @param id
 */
SIMU.Scene.prototype.setCurrentRenderableSnapshotId = function(id){
    this.currentRenderableSnapshotId = id;
    for(var i = 0; i < this.renderableDatas.length;i++){
        var renderableData = this.renderableDatas[i];
        if(renderableData.isActive) {
            this.scene.remove(renderableData.pointCloud);
            renderableData.resetData();
            if(this.parameters.isStatic) {
                renderableData.enableStaticShaderMode();
            }else{
                renderableData.enableAnimatedShaderMode();
            }
            if(renderableData.isReady) {
                this.scene.add(renderableData.pointCloud);
            }
        }
    }
};

/**
 * @description update the renderable datas to fit with the current data
 * @detail get called when we jump to other snapshots
 */
SIMU.Scene.prototype.dataHasChanged = function(){
    for(var i = 0; i < this.renderableDatas.length;i++){
        var renderableData = this.renderableDatas[i];
        this.scene.remove(renderableData.pointCloud);
        renderableData.resetData();
        if(renderableData.isReady){
            this.scene.add(renderableData.pointCloud);
        }
    }
};

/**
 * @description Set shader mode to animated
 */
SIMU.Scene.prototype.setAnimatedShaderMode = function(){
    this.parameters.isStatic = false;
    for(var i = 0; i < this.renderableDatas.length;i++){
        var renderableData = this.renderableDatas[i];
        if(renderableData.isActive) {
            //First remove element from the scene, in order to take the modification in account when we'll put it back
            this.scene.remove(renderableData.pointCloud);
            renderableData.enableAnimatedShaderMode();
            if(renderableData.isReady) {
                this.scene.add(renderableData.pointCloud);
            }
        }
    }
};

/**
 * @description Set shader mode to static
 */
SIMU.Scene.prototype.setStaticShaderMode = function(){
    this.parameters.isStatic = true;
    for(var i = 0; i < this.renderableDatas.length;i++){
        var renderableData = this.renderableDatas[i];
        if(renderableData.isActive) {
            this.scene.remove(renderableData.pointCloud);
            renderableData.enableStaticShaderMode();
            if(renderableData.isReady) {
                this.scene.add(renderableData.pointCloud);
            }
        }
    }
};

SIMU.Scene.prototype.computeCulling = function(camera){
    for(var i = 0; i < this.renderableDatas.length;i++){
        if(this.renderableDatas[i].isActive && this.renderableDatas[i].isReady) {
            if(this.parameters.frustumculling) {
                this.renderableDatas[i].computeCulling(camera);
            }
        }
    }
};