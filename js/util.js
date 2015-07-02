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

var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};