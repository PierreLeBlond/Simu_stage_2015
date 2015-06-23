/**
 * Created by lespingal on 18/06/15.
 */

function initColorPicker(){
    App.colorPickerTarget = new THREE.WebGLRenderTarget(App.width, App.height);
}

function getColorPickingPointCloudIntersectionIndex(){
    App.colorPickingRenderer.render(App.colorPickerScene, Camera.camera, App.colorPickerTarget);
    var gl = App.colorPickingRenderer.getContext();
    gl.readPixels(0, 0, App.width, App.height, gl.RGBA, gl.UNSIGNED_BYTE, App.colorPickerTexture.image.data);
    App.colorPickerTexture.needsUpdate = true;
}

/**
 * @author relicweb http://jsfiddle.net/EqLL9/3/
 * @description Custom RGBA data texture.
 * @param width
 * @param height
 * @param color
 * @returns {THREE.DataTexture}
 */
function generateDataTexture(width, height, color) {
    var size = width * height;
    var data = new Uint8Array(4 * size);

    var r = Math.floor(color.r * 255);
    var g = Math.floor(color.g * 255);
    var b = Math.floor(color.b * 255);
    //var a = Math.floor( color.a * 255 );

    for (var i = 0; i < size; i++) {
        if (i == size / 2 + width / 2) {
            data[i * 4] = 255;
            data[i * 4 + 1] = g;
            data[i * 4 + 2] = b;
            data[i * 4 + 3] = 255;
        } else {
            data[i * 4] = r;
            data[i * 4 + 1] = g;
            data[i * 4 + 2] = b;
            data[i * 4 + 3] = 255;
        }
    }

    var texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
    texture.needsUpdate = true;

    return texture;
}