/**
 * Created by lespingal on 30/07/15.
 */
var SIMU = SIMU || {};

SIMU.Gui = function(){

    //Views
    this.views                  = [];
    this.currentView            = null;

    this.controls               = null;

    this.menu                   = null;
    this.timeline               = null;

    this.domElement             = null;

    this.width                  = 0;
    this.height                 = 0;

    //Store the reference one the last loading file function, for it will be remove if current data change
    this.lastFileEvent          = null;
    this.windowResizeEvent      = null;

};

SIMU.Gui.prototype.setDomElement = function(el){
    this.domElement = el;
};

SIMU.Gui.prototype.setWidth = function(width){
    this.width = width;
    this.domElement.style.width = width + 'px';
};

SIMU.Gui.prototype.setHeight = function(height){
    this.height = height;
    this.domElement.style.height = height + 'px';
};

SIMU.Gui.prototype.setupGui = function(){




    this.menu = new SIMU.Menu();
    this.menu.initialize();

    this.menu.simpleView.addEventListener('click', this.switchToSingleview.bind(this), false);
    this.menu.multiView.addEventListener('click', this.switchToMultiview.bind(this), false);

    this.menu.displayMenu();
};