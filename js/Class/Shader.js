/**
 * Created by lespingal on 15/07/15.
 */
var SIMU = SIMU || {};



SIMU.shader = {
    animated : {
        fog : {
            vertex : null,
            fragment : null
        },
        nofog : {
            vertex : null,
            fragment : null
        }
    },
    static :    {
        fog : {
            vertex : null,
            fragment : null
        },
        nofog : {
            vertex : null,
            fragment : null
        }
    }
};

SIMU.shader.animated.fog.vertex =
    ["uniform float size;                             \n",
    "uniform float t;                                 \n",
    "                                                 \n",
    "attribute vec3 endPosition;                      \n",
    "attribute vec3 color;                            \n",
    "                                                 \n",
    "varying vec4 mvPosition;                         \n",
    "varying vec3 color_out;                          \n",
    "                                                 \n",
    "void main(){                                     \n",
    "   color_out = color;                            \n",
    "   vec3 pos = position+endPosition*t;            \n",
    "   mvPosition = modelViewMatrix*vec4(pos, 1.0);  \n",
    "   gl_PointSize = size/length(mvPosition.xyz);   \n",
    "   gl_Position = projectionMatrix*mvPosition;    \n",
    "}                                                \n"
    ].join('');

SIMU.shader.static.fog.vertex =
    ["uniform float size;                                 \n",
    "uniform float scale;                                 \n",
    "                                                     \n",
    "attribute vec3 color;                                \n",
    "                                                     \n",
    "varying vec4 mvPosition;                             \n",
    "varying vec3 color_out;                              \n",
    "                                                     \n",
    "void main() {                                        \n",
    "color_out = color;                                   \n",
    "mvPosition = modelViewMatrix * vec4( position, 1.0 );\n",
    "gl_PointSize = size / length( mvPosition.xyz );      \n",
    "gl_Position = projectionMatrix * mvPosition;         \n",
    "}                                                    \n"
    ].join('');

SIMU.shader.animated.nofog.vertex =
    ["uniform float size;                                 \n",
    "uniform float t;                                     \n",
    "                                                     \n",
    "attribute vec3 endPosition;                          \n",
    "attribute vec3 color;                                \n",
    "                                                     \n",
    "varying vec3 color_out;                              \n",
    "                                                     \n",
    "void main() {                                        \n",
    "color_out = color;                                   \n",
    "vec3 pos = position+endPosition*t;                   \n",
    "vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );\n",
    "gl_PointSize = size / length( mvPosition.xyz );      \n",
    "gl_Position = projectionMatrix * mvPosition;         \n",
    "}                                                    \n"
    ].join('');

SIMU.shader.static.nofog.vertex =
    ["uniform float size;                                         \n",
    "uniform float scale;                                         \n",
    "                                                             \n",
    "attribute vec3 color;                                        \n",
    "                                                             \n",
    "varying vec3 color_out;                                      \n",
    "                                                             \n",
    "void main() {                                                \n",
    "color_out = color;                                           \n",
    "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );   \n",
    "gl_PointSize = size / length( mvPosition.xyz );              \n",
    "gl_Position = projectionMatrix * mvPosition;                 \n",
    "}                                                            \n"
    ].join('');

SIMU.shader.animated.fog.fragment = SIMU.shader.static.fog.fragment =
    ["uniform float fog;                                                                                              \n",
    "uniform float fogDistance;                                                                                       \n",
    "uniform float scale;                                                                                             \n",
    "uniform sampler2D map;                                                                                           \n",
    "                                                                                                                 \n",
    "varying vec4 mvPosition;                                                                                         \n",
    "varying vec3 color_out;                                                                                          \n",
    "                                                                                                                 \n",
    "void main() {                                                                                                    \n",
    "vec4 diffuse = texture2D(map, gl_PointCoord);                                                                    \n",
    "vec4 color = mix(vec4(color_out, 1.0), vec4(0.0),1.0 - fogDistance*1.0/(exp(pow(length(mvPosition)*fog, 2.0)))); \n",
    "gl_FragColor = color * diffuse;                                                                                  \n",
    "}                                                                                                                \n"
    ].join('');

SIMU.shader.animated.nofog.fragment = SIMU.shader.static.nofog.fragment =
    ["uniform sampler2D map;                          \n",
    "                                                 \n",
    "varying vec3 color_out;                          \n",
    "                                                 \n",
    "void main() {                                    \n",
    "vec4 diffuse = texture2D(map, gl_PointCoord);    \n",
    "vec4 color = vec4(color_out, 1.0);               \n",
    "gl_FragColor = color * diffuse;                  \n",
    "}                                                \n"
    ].join('');

