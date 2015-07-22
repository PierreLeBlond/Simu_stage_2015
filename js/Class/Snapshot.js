/**
 * Created by lespingal on 10/07/15.
 */
var SIMU = SIMU || {};

/**
 *
 * @constructor
 */
SIMU.Snapshot = function(){
    this.isReady        = false;
    this.directionIsSet = false;

    this.position       = null;
    this.direction      = null;
    this.index          = null;
    this.color          = null;

    this.octree         = null;

    this.info           = [];
};

SIMU.Snapshot.prototype.showInfo = function(index){
    var el = document.getElementById('info');
    var infos = this.info;
    var result = [];
    result.push("position : x = ");
    result.push(this.position[index*3]);
    result.push(",y = ");
    result.push(this.position[index*3 + 1]);
    result.push(",z = ");
    result.push(this.position[index*3 + 2]);
    result.push("\n");
    for(var i = 0; i < infos.length;i++){
        result.push(infos[i].name);
        result.push(" : ");
        result.push(infos[i].value[index]);
        result.push("\n");
    }
    el.innerHTML = result.join('');
};