/**
 * Created by lespingal on 15/07/15.
 * pierre.lespingal@gmail.com
 */

/**
 *  Global namespace
 *  @namespace
 */
var SIMU = SIMU || {};

/**
 * @description Singleton used to access shader code
 * @type {{getInstance}}
 */
SIMU.ShaderManagerSingleton = (function() {
    var instance;

    /**
     * @description Shader code
     * @constructor
     */
    var ShaderManager = function () {
        this.shaders = {
            default: {
                animated: {
                    vertex: null,
                    fragment: null
                },
                static: {
                    vertex: null,
                    fragment: null
                }
            },
            parametric: {
                animated: {
                    vertex: null,
                    fragment: null
                },
                static: {
                    vertex: null,
                    fragment: null
                }
            }
        };


        this.shaders.parametric.static.vertex =
            [
                "uniform float size;                                                                    \n",
                "uniform float t;                                                                       \n",
                "uniform int paramType;                                                                 \n",
                "uniform float minInfo;                                                                 \n",
                "uniform float maxInfo;                                                                 \n",
                "uniform int logInterpolation;                                                          \n",
                "                                                                                       \n",
                "attribute vec3 color;                                                                  \n",
                "attribute float information;                                                           \n",
                "                                                                                       \n",
                "varying vec3 position_out;                                                             \n",
                "varying vec4 mvPosition;                                                               \n",
                "varying vec3 color_out;                                                                \n",
                "varying float blink_speed;                                                             \n",
                "                                                                                       \n",
                "void main(){                                                                           \n",
                "   position_out = position;                                                            \n",
                "   mvPosition = modelViewMatrix*vec4(position, 1.0);                                   \n",
                "   gl_Position = projectionMatrix*mvPosition;                                          \n",
                "   float factor = 0.0;                                                                 \n",
                "   if(logInterpolation == 0)                                                           \n",
                "       factor =  (minInfo - information)/(minInfo - maxInfo);                          \n",
                "   else                                                                                \n",
                "       factor = -log((maxInfo/10.0 + information)/(maxInfo/10.0 + maxInfo))/log(10.0); \n",
                "   if(paramType == 1){                                                                 \n",
                "       color_out = color*factor;                                                       \n",
                "       gl_PointSize = size/length(mvPosition.xyz);                                     \n",
                "       blink_speed = 4.0;                                                              \n",
                "   }else if(paramType == 2){                                                           \n",
                "       blink_speed = 2.0*factor;                                                       \n",
                "       color_out = color;                                                              \n",
                "       gl_PointSize = size/length(mvPosition.xyz);                                     \n",
                "   }else if(paramType == 3){                                                           \n",
                "       float r = factor;                                                               \n",
                "       color_out = vec3(r, 0.0, 1.0 - r);                                              \n",
                "       gl_PointSize = size/length(mvPosition.xyz);                                     \n",
                "       blink_speed = 4.0;                                                              \n",
                "   }else if(paramType == 4){                                                           \n",
                "       gl_PointSize = (size/length(mvPosition.xyz))*(1.0 + factor);                    \n",
                "       blink_speed = 4.0;                                                              \n",
                "       color_out = color;                                                              \n",
                "   }else{                                                                              \n",
                "       color_out = color;                                                              \n",
                "       gl_PointSize = size/length(mvPosition.xyz);                                     \n",
                "       blink_speed = 4.0;                                                              \n",
                "   }                                                                                   \n",
                "}                                                                                      \n"
            ].join('');

        this.shaders.parametric.static.fragment = this.shaders.parametric.animated.fragment =
            ["uniform float fogFactor;                                                                                                  \n",
                "uniform float fogDistance;                                                                                             \n",
                "uniform float scale;                                                                                                   \n",
                "uniform sampler2D map;                                                                                                 \n",
                "uniform float currentTime;                                                                                             \n",
                "uniform int fog;                                                                                                       \n",
                "uniform int blink;                                                                                                     \n",
                "                                                                                                                       \n",
                "varying vec3 position_out;                                                                                             \n",
                "varying vec4 mvPosition;                                                                                               \n",
                "varying vec3 color_out;                                                                                                \n",
                "varying float blink_speed;                                                                                             \n",
                "                                                                                                                       \n",
                //Will give random result based on the seed co, thanks to float approximation
                "float rand(vec3 co){                                                                                                   \n",
                "   return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);                                                  \n",
                "}                                                                                                                      \n",
                "                                                                                                                       \n",
                "void main() {                                                                                                          \n",
                "vec4 diffuse = texture2D(map, gl_PointCoord);                                                                          \n",
                "vec4 color = vec4(color_out, 1.0);                                                                                     \n",
                "if(fog == 1){                                                                                                          \n",
                "   color *= mix(color, vec4(0.0),1.0 - fogDistance*1.0/(exp(pow(length(mvPosition)*fogFactor, 2.0))));                 \n",
                "}                                                                                                                      \n",
                "if(blink == 1){                                                                                                        \n",
                "   float blindfactor = (cos(currentTime*2.0*3.14/blink_speed + mod(rand(position_out.xyz)*10.0, 2.0*3.14)) + 1.0)/2.0; \n",
                "   color *= blindfactor;                                                                                               \n",
                "}                                                                                                                      \n",
                "gl_FragColor = color * diffuse;                                                                                        \n",
                "}                                                                                                                      \n"
            ].join('');

        this.shaders.parametric.animated.vertex =
            [
                "uniform float size;                                                                                        \n",
                "uniform float t;                                                                                           \n",
                "uniform int paramType;                                                                                     \n",
                "uniform float minInfo;                                                                                     \n",
                "uniform float maxInfo;                                                                                     \n",
                "uniform int logInterpolation;                                                                              \n",
                "                                                                                                           \n",
                "attribute vec3 direction;                                                                                  \n",
                "attribute vec3 color;                                                                                      \n",
                "attribute vec3 departure;                                                                                  \n",
                "attribute float information;                                                                               \n",
                "                                                                                                           \n",
                "varying vec3 position_out;                                                                                 \n",
                "varying vec4 mvPosition;                                                                                   \n",
                "varying vec3 color_out;                                                                                    \n",
                "varying float blink_speed;                                                                                 \n",
                "                                                                                                           \n",
                "void main(){                                                                                               \n",
                "   position_out = departure;                                                                               \n",
                "   vec3 pos = departure+direction*t;                                                                       \n",
                "   mvPosition = modelViewMatrix*vec4(pos, 1.0);                                                            \n",
                "   gl_PointSize = size/length(mvPosition.xyz);                                                             \n",
                "   gl_Position = projectionMatrix*mvPosition;                                                              \n",
                "   float factor = 0.0;                                                                                     \n",
                "   if(logInterpolation == 0)                                                                               \n",
                "       factor =  (minInfo - information)/(minInfo - maxInfo);                                              \n",
                "   else                                                                                                    \n",
                "       factor = -log((maxInfo/10.0 + information)/(maxInfo/10.0 + maxInfo))/log(10.0);                     \n",
                "   if(paramType == 1){                                                                                     \n",
                "       color_out = color*factor;                                                                           \n",
                "       gl_PointSize = size/length(mvPosition.xyz);                                                         \n",
                "       blink_speed = 4.0;                                                                                  \n",
                "   }else if(paramType == 2){                                                                               \n",
                "       blink_speed = 2.0*factor;                                                                           \n",
                "       color_out = color;                                                                                  \n",
                "       gl_PointSize = size/length(mvPosition.xyz);                                                         \n",
                "   }else if(paramType == 3){                                                                               \n",
                "       float r = factor;                                                                                   \n",
                "       color_out = vec3(r, 0.0, 1.0 - r);                                                                  \n",
                "       gl_PointSize = size/length(mvPosition.xyz);                                                         \n",
                "       blink_speed = 4.0;                                                                                  \n",
                "   }else if(paramType == 4){                                                                               \n",
                "       gl_PointSize = (size/length(mvPosition.xyz))*(1.0 + factor);                                        \n",
                "       blink_speed = 4.0;                                                                                  \n",
                "       color_out = color;                                                                                  \n",
                "   }else{                                                                                                  \n",
                "       color_out = color;                                                                                  \n",
                "       gl_PointSize = size/length(mvPosition.xyz);                                                         \n",
                "       blink_speed = 4.0;                                                                                  \n",
                "   }                                                                                                       \n",
                "}                                                                                                          \n"
            ].join('');

        this.shaders.default.animated.vertex =
            ["uniform float size;                                 \n",
                "uniform float t;                                 \n",
                "                                                 \n",
                "attribute vec3 direction;                        \n",
                "attribute vec3 color;                            \n",
                "attribute vec3 departure;                        \n",
                "                                                 \n",
                "varying vec3 position_out;                       \n",
                "varying vec4 mvPosition;                         \n",
                "varying vec3 color_out;                          \n",
                "                                                 \n",
                "void main(){                                     \n",
                "   color_out = color;                            \n",
                "   vec3 pos = departure+direction*t;             \n",
                "   mvPosition = modelViewMatrix*vec4(pos, 1.0);  \n",
                "   gl_PointSize = size/length(mvPosition.xyz);   \n",
                "   gl_Position = projectionMatrix*mvPosition;    \n",
                "}                                                \n"
            ].join('');

        this.shaders.default.static.vertex =
            ["uniform float size;                                           \n",
                "uniform float scale;                                       \n",
                "                                                           \n",
                "attribute vec3 color;                                      \n",
                "                                                           \n",
                "varying vec3 position_out;                                 \n",
                "varying vec4 mvPosition;                                   \n",
                "varying vec3 color_out;                                    \n",
                "                                                           \n",
                "void main() {                                              \n",
                "   position_out = position;                                \n",
                "   color_out = color;                                      \n",
                "   mvPosition = modelViewMatrix * vec4( position, 1.0 );   \n",
                "   gl_PointSize = size / length( mvPosition.xyz );         \n",
                "   gl_Position = projectionMatrix * mvPosition;            \n",
                "}                                                          \n"
            ].join('');

        this.shaders.default.animated.fragment = this.shaders.default.static.fragment =
            ["uniform float fogFactor;                                                                                          \n",
                "uniform float fogDistance;                                                                                     \n",
                "uniform float scale;                                                                                           \n",
                "uniform sampler2D map;                                                                                         \n",
                "uniform float currentTime;                                                                                     \n",
                "uniform int fog;                                                                                               \n",
                "uniform int blink;                                                                                             \n",
                "                                                                                                               \n",
                "varying vec3 position_out;                                                                                     \n",
                "varying vec4 mvPosition;                                                                                       \n",
                "varying vec3 color_out;                                                                                        \n",
                "                                                                                                               \n",
                //Will give random result based on the seed co, thanks to float approximation
                "float rand(vec3 co){                                                                                           \n",
                "   return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);                                          \n",
                "}                                                                                                              \n",
                "                                                                                                               \n",
                "void main() {                                                                                                  \n",
                "vec4 diffuse = texture2D(map, gl_PointCoord);                                                                  \n",
                "vec4 color = vec4(color_out, 1.0);                                                                             \n",
                "if(fog == 1){                                                                                                  \n",
                "   color *= mix(color, vec4(0.0),1.0 - fogDistance*1.0/(exp(pow(length(mvPosition)*fogFactor, 2.0))));         \n",
                "}                                                                                                              \n",
                "if(blink == 1){                                                                                                \n",
                "   float blindfactor = (cos(currentTime*2.0*3.14/4.0 + mod(rand(position_out.xyz)*10.0, 2.0*3.14)) + 1.0)/2.0; \n",
                "   color *= clamp(blindfactor, 0.5, 2.0);                                                                      \n",
                "}                                                                                                              \n",
                "gl_FragColor = color * diffuse;                                                                                \n",
                "}                                                                                                              \n"
            ].join('');
    };

    /**
     * @description Create the instance
     * @returns {ShaderManager}
     */
    function createInstance(){
        var object = new ShaderManager();
        return object;
    }

    return {
        /**
         * @description If not, create the singleton, and return it
         * @returns {*} The singleton
         */
        getShaderManagerInstance: function(){
            if(!instance){
                instance = createInstance();
            }
            return instance;
        }
    }

})();




