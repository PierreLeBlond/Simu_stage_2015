/**
 * Created by lespingal on 30/07/15.
 */

/**
 *  Global namespace
 *  @namespace
 */
var SIMU = SIMU || {};

/**
 * Represent the data's point clouds and all the stuff to render them
 * @constructor
 *
 * @property {THREE.Scene} scene                        - The scene
 *
 * @property {THREE.PerspectiveCamera} privateCamera    - The private camera, will be used only for this scene
 *
 * @property {object} parameters                        - Bunch of parameters telling us how to render the scene
 *      @property {number} parameters.t                 - Relative time within the application
 *      @property {number} parameters.delta_t           - Current elapsed time
 *      @property {boolean} parameters.active           - True if the current point cloud is displayed
 *      @property {number} parameters.pointsize         - Size of the particle within the point cloud
 *      @property {boolean} parameters.fog              - True if the fog is enable
 *      @property {boolean} parameters.linkcamera       - True if the current used camera is the global one
 *      @property {number} parameters.shaderType        - One of {@link SIMU.ShaderType} value, the type of shader used to display the particles
 *      @property {number[]} parameters.color           - Default color of the current point cloud
 *      @property {number} parameters.idInfo            - Id of the current info of the current point cloud
 *      @property {number} parameters.idTexture         - id of the texture used in the current point cloud
 *      @property {number} parameters.idBlending        - Id of the blending mode used in the current point cloud
 *      @property {boolean} parameters.frustumculling   - True if view frustum culling is enabled
 *      @property {number} parameters.levelOfDetail     - level of detail of the point cloud
 *
 * @property {Array} texture                            - Array of available texture
 * @property {number[]} blending                        - Array of available blending mode
 *
 * @property {Array} renderableDatas                    - Array of point cloud
 * @property {number} currentRenderableDataId           - Id of current used point cloud
 * @property {number} currentRenderableSnapshotId       - Id of current snapshot
 *
 * @property {object} target                            - Current selected point
 *
 */
SIMU.Scene = function(){

    this.scene                      = null;

    this.privateCamera              = null;

    this.parameters                 = {
        t                           : 0,
        delta_t                     : 0,
        active                      : false,
        pointsize                   : 0.5,
        fog                         : false,
        linkcamera                  : false,
        shaderType                  : SIMU.ShaderType.STATIC,
        color                       : [ 255, 255, 255],
        idInfo                      : -1,
        idTexture                   : -1,
        idBlending                  : -1,
        frustumculling              : true,
        levelOfDetail               : 4
    };

    this.texture                    = [];
    this.blending                   = [
        THREE.NoBlending,
        THREE.NormalBlending,
        THREE.AdditiveBlending,
        THREE.SubtractiveBlending,
        THREE.MultiplyBlending
    ];

    this.renderableDatas            = [];
    this.currentRenderableDataId    = -1;
    this.currentRenderableSnapshotId= -1;

    this.target                     = null;

};

/**
 * Set time for the scene to t
 * @detail get called whenever time is changing within the application
 * @param {number} t - Current time relative to the simulation
 */
SIMU.Scene.prototype.setTime = function(t){
    for(var i = 0; i < this.renderableDatas.length;i++){
        this.renderableDatas[i].uniforms.t.value = t;
    }
};

/**
 * Set real time
 * @param {number} t - Real time
 */
SIMU.Scene.prototype.setCurrentTime = function(t){
    for(var i = 0; i < this.renderableDatas.length;i++){
        this.renderableDatas[i].uniforms.current_time.value = t;
    }
};

/**
 * Setup the scene
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
 * Activate the current {@link SIMU.renderableData} object, if this one wasn't ready, then create the point cloud
 */
SIMU.Scene.prototype.activateCurrentData = function(){
    var currentRenderableData = this.renderableDatas[this.currentRenderableDataId];
    currentRenderableData.resetData();
    this.enableCurrentDataShaderMode();
    currentRenderableData.isActive = true;
    this.scene.add(currentRenderableData.pointCloud);
};

/**
 * Enable the currently selected shader mode
 */
SIMU.Scene.prototype.enableCurrentDataShaderMode = function(){
    var currentRenderableData = this.renderableDatas[this.currentRenderableDataId];
    switch(this.parameters.shaderType){
        case SIMU.ShaderType.STATIC :
            currentRenderableData.enableStaticShaderMode();
            break;
        case SIMU.ShaderType.ANIMATED :
            currentRenderableData.enableAnimatedShaderMode();
            break;
        case SIMU.ShaderType.PARAMETRICSTATIC :
            currentRenderableData.enableStaticParametricShaderMode();
            break;
        case SIMU.ShaderType.PARAMETRICANIMATED :
            currentRenderableData.enableAnimatedParametricShaderMode();
            break;
        default:
            break;
    }
};

/**
 * Deactivate the current {@link SIMU.renderableData} object
 */
SIMU.Scene.prototype.deactivateCurrentData = function(){
    var currentRenderableData = this.renderableDatas[this.currentRenderableDataId];
    currentRenderableData.isActive = false;
    this.scene.remove(currentRenderableData.pointCloud);
};

/**
 * Set fog state
 * @param {boolean} bool - State of fog parameter
 */
SIMU.Scene.prototype.setCurrentDataFog = function(bool){
    if (this.currentRenderableDataId >= 0) {
        this.renderableDatas[this.currentRenderableDataId].uniforms.fog.value = bool ? 1 : 0;
    }
};

/**
 * Set fog state
 * @param {boolean} bool - State of fog parameter
 */
SIMU.Scene.prototype.setCurrentDataBlink = function(bool){
    if (this.currentRenderableDataId >= 0) {
        this.renderableDatas[this.currentRenderableDataId].uniforms.blink.value = bool ? 1 : 0;
    }
};

/**
 * Set texture for the current {@link SIMU.renderableData} object
 * @param {int} texture - Id of wanted texture
 */
SIMU.Scene.prototype.setCurrentDataTexture = function(texture){
    if (this.currentRenderableDataId >= 0) {
        this.renderableDatas[this.currentRenderableDataId].idTexture = texture;
        this.renderableDatas[this.currentRenderableDataId].uniforms.map.value = this.texture[texture];
    }
};

/**
 * et point's size for the current {@link SIMU.renderableData} object
 * @param {number} pointSize - Size of the rendered particles
 */
SIMU.Scene.prototype.setCurrentDataPointSize = function(pointSize){
    if (this.currentRenderableDataId >= 0) {
        this.renderableDatas[this.currentRenderableDataId].uniforms.size.value = pointSize;
    }
};

/**
 * Set default color for the current {@link SIMU.renderableData} object
 * @param {number[]} color - Default color
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

/**
 * Set the level of detail for the current {@link SIMU.renderableData} object
 * @param {number} levelOfDetail - The new level of detail
 */
SIMU.Scene.prototype.setCurrentDataLevelOfDetail = function(levelOfDetail){
    if (this.currentRenderableDataId >= 0) {
        this.renderableDatas[this.currentRenderableDataId].levelOfDetail = levelOfDetail;
    }
};

/**
 * Set the level of detail for the current {@link SIMU.renderableData} object
 * @param {number} blendingType - Id of the wanted blending type
 */
SIMU.Scene.prototype.setCurrentDataBlendingType = function(blendingType){
    if (this.currentRenderableDataId >= 0) {
        this.renderableDatas[this.currentRenderableDataId].animatedShaderMaterial.blending = this.blending[blendingType];
        this.renderableDatas[this.currentRenderableDataId].staticShaderMaterial.blending = this.blending[blendingType];
    }
};

/**
 * Set the way of highlighting information within the shader
 * @param {number} param - Id of the wanted way of highlighting information
 */
SIMU.Scene.prototype.setCurrentDataParam = function(param){
    if (this.currentRenderableDataId >= 0) {
        this.renderableDatas[this.currentRenderableDataId].uniforms.param_type.value = param;
    }
};

/**
 * Add RenderableData object
 * @param {SIMU.RenderableData} renderableData - The {@link RenderableData} object to add
 */
SIMU.Scene.prototype.addRenderableData = function(renderableData)
{
    this.renderableDatas.push(renderableData);
};

/**
 * Set the id of current RenderableData object
 * @param {int} id - The id of the current {@link RenderableData} object
 */
SIMU.Scene.prototype.setCurrentRenderableData = function(id){
    this.currentRenderableDataId = id;
};

/**
 * Set the id of the current snapshot
 * @detail Reset the data to refresh the display
 * @param {int} id - The id of the current snapshot
 */
SIMU.Scene.prototype.setCurrentRenderableSnapshot = function(id){
    this.currentRenderableSnapshotId = id;
    for(var i = 0; i < this.renderableDatas.length;i++){
        var renderableData = this.renderableDatas[i];
        if(renderableData.isActive) {
            renderableData.resetData();
            this.enableCurrentDataShaderMode();
        }
    }
};

/**
 * Update the renderable datas to fit with the current data
 * @detail get called when we jump to other snapshots
 */
SIMU.Scene.prototype.dataHasChanged = function(){
    for(var i = 0; i < this.renderableDatas.length;i++){
        var renderableData = this.renderableDatas[i];
        if(renderableData.isActive) {
            renderableData.resetData();
        }
    }
};

/**
 * Set shader type
 * @param {number} type - One of {SIMU.ShaderType} value
 */
SIMU.Scene.prototype.setShaderType = function(type){
    this.parameters.shaderType = type;
    for(var i = 0; i < this.renderableDatas.length;i++){
        var renderableData = this.renderableDatas[i];
        if(renderableData.isActive) {
            this.enableCurrentDataShaderMode();
        }
    }
};

/**
 * Compute the view frustum culling
 * @param {THREE.PerspectiveCamera} camera - The camera to compute from
 */
SIMU.Scene.prototype.computeCulling = function(camera){
    for(var i = 0; i < this.renderableDatas.length;i++){
        if(this.renderableDatas[i].isActive && this.renderableDatas[i].isReady) {
            if(this.parameters.frustumculling) {
                this.renderableDatas[i].computeCulling(camera);
            }
        }
    }
};