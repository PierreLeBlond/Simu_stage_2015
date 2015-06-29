/**
 * Created by lespingal on 12/06/15.
 */

var App = App || {};

App.FileType            = {
    SKYBOT : 0,
    BIN : 1,
    STRING : 2
};

App.type                = App.FileType.BIN;

App.RAYCASTING          = true;//Enable raycasting for object picking
App.CPUCALCUL           = false;//Disable position computing on CPU side rather than within the shader
App.COLORPICKING        = false;//Disable color picking for object picking
App.FOG                 = true;//Enable fog
App.FRUSTUMCULLING      = true;
App.PLAY                = false;//Disable animation mode
App.ANIMATION           = false;
App.CAMERAISFREE        = true;
//App.FIRST               = true;


