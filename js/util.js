/**
 * Created by lespingal on 17/06/15.
 */

App.Timer = function () {
    this.time = Date.now();
    this.currentTime = 0.0;
};

App.Timer.prototype.start = function(){
    this.currentTime = Date.now();
};

App.Timer.prototype.stop = function(op){
    diff = Date.now() - this.currentTime;
    console.log("temps écoulé pour " +  op + " : " + diff + "ms");
};