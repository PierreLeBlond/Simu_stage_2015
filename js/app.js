/**
 * Created by lespingal on 12/06/15.
 */

var App = App || {};

App.FileType = {
    SKYBOT : 0,
    BIN : 1,
    STRING : 2
};

App.type = App.FileType.BIN;

App.RAYCASTING = true;//Enable raycasting for object picking
App.GEOMETRYBUFFER = true;//Enable GeometryBuffer against simple Geometry
App.CPUCALCUL = false;//Disable position computing on CPU side rather than within the shader
App.COLORPICKING = false;//Disable color picking for object picking
App.FOG = true;//Enable fog

App.play = false;//Disable animation mode
App.updated = true;//Enable the need to compute the position on CPU side, will be automatically disable right after


