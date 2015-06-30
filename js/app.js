/**
 * Created by lespingal on 12/06/15.
 */

var App = App || {};

App.FileType            = {
    SKYBOT : 0,
    BIN : 1,
    STRING : 2
};

/* List of different types of display, useful to remember the current display */
App.DisplayType = {
    UNKNOWN : 0,
    SIMPLEVIEW : 1,
    MULTIVIEW : 2,
    OCULUS : 3,
    CARDBOARD : 4
};

/* Used to remember the current display */
App.currentDisplay = App.SIMPLEVIEW;

/*Used to enable and disable controls out and in menu */
App.controlsEnabled = true;

App.type                = App.FileType.STRING;

App.RAYCASTING          = true;//Enable raycasting for object picking
App.CPUCALCUL           = false;//Disable position computing on CPU side rather than within the shader
App.COLORPICKING        = false;//Disable color picking for object picking
App.FOG                 = true;//Enable fog
App.FRUSTUMCULLING      = true;
App.PLAY                = false;//Disable animation mode
App.ANIMATION           = false;
App.CAMERAISFREE        = true;
//App.FIRST               = true;


