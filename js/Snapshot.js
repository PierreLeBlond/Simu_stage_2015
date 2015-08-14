/**
 * Created by lespingal on 10/07/15.
 * pierre.lespingal@gmail.com
 */

/**
 *  Global namespace
 *  @namespace
 */
var SIMU = SIMU || {};

/**
 * Represent some data snapshot, i.e. fixed data at a certain time
 * @constructor
 *
 * @property {boolean} isReady - True if the buffers have been correctly populated with data, therefor they aren't null
 * @property {Float32Array} position - Position buffer
 * @property {Float32Array} direction - Direction buffer
 * @property {boolean} directionIsSet - True if there is another Snapshot ready, which is the next snapshot in time. The direction between the two snapshot is then ensure to be set and computed
 * @property {Float32Array} index - Index buffer
 * @property {Float32Array} color - Color buffer
 * @property {@link SIMU.Octree} octree - Octree set from the position & the index buffer
 * @property {Array} info - Array of buffer, storing different information about the point
 */
SIMU.Snapshot = function(){
    this.isReady        = false;        //** True if the buffers have been correctly populated with data, therefor they aren't null */

    this.position       = null;         //** Position buffer */
    this.direction      = null;         //** Direction buffer */
    this.directionIsSet = false;        //** True if there is another Snapshot ready, which is the next snapshot in time. The direction between the two snapshot is then ensure to be set and computed */
    this.index          = null;         //** Index buffer */
    this.color          = null;         //** Color buffer */

    this.octree         = null;         //** Octree set from the position & the index buffer */

    this.info           = [];           //** Array of buffer, storing different information about the point */
};


/**
 * Some data cube are cyclic, so we have to adjust position and direction to avoid weird displacement of some particles
 */
SIMU.Snapshot.prototype.fixedCyclicPosition = function(){
    if(this.position && this.directionIsSet){
        var length = this.position.length;
        for(var i = 0; i < length;i++){
            var dx = this.direction[i];

            if(dx > 0.5){
                this.position[i] += 1;
                this.direction[i] -=1;
            }else if(dx < -0.5){
                this.position[i] -= 1;
                this.direction[i] += 1;
            }
        }
    }
};