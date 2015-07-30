/**
 * Created by lespingal on 10/07/15.
 *
 * @description A Snapshot object represent the position and other information about some data cube at a fixed time
 */
var SIMU = SIMU || {};

/**
 * @constructor
 */
SIMU.Snapshot = function(){
    this.isReady        = false;        /** True if the buffers have been correctly populated with data, therefor they aren't null **/
    this.directionIsSet = false;        /** True if there is another Snapshot ready, which is the next snapshot in time. The direction between the two snapshot is then ensure to be set and not null **/

    this.position       = null;         /** Position buffer **/
    this.direction      = null;         /** Direction buffer **/
    this.index          = null;         /** Index buffer **/
    this.color          = null;         /** Color buffer **/

    this.octree         = null;         /** Octree set from the position & the index buffer **/

    this.info           = [];           /** Array of buffer, storing different data about the point **/
};