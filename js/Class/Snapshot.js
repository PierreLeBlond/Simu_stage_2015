/**
 * Created by lespingal on 10/07/15.
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
 * @property {boolean} directionIsSet - True if there is another Snapshot ready, which is the next snapshot in time. The direction between the two snapshot is then ensure to be set and computed
 * @property {Float32Array} position - Position buffer
 * @property {Float32Array} direction - Direction buffer
 * @property {Float32Array} index - Index buffer
 * @property {Float32Array} color - Color buffer
 * @property {SIMU.Octree} octree - Octree set from the position & the index buffer
 * @property {Array} info - Array of buffer, storing different information about the point
 */
SIMU.Snapshot = function(){
    this.isReady        = false;        //** True if the buffers have been correctly populated with data, therefor they aren't null */

    this.position       = null;         //** Position buffer */
    this.positionIsSet  = false;
    this.direction      = null;         //** Direction buffer */
    this.directionIsSet = false;        //** True if there is another Snapshot ready, which is the next snapshot in time. The direction between the two snapshot is then ensure to be set and computed */
    this.index          = null;         //** Index buffer */
    this.color          = null;         //** Color buffer */

    this.octree         = null;         //** Octree set from the position & the index buffer */

    this.info           = [];           //** Array of buffer, storing different information about the point */
};