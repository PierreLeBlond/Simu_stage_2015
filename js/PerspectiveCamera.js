/**
 * Created by lespingal on 31/07/15.
 * pierre.lespingal@gmail.com
 */

/**
 *
 * @enum
 * @type {{FREE: number, FIXED: number, TARGETING: number, ROTATING: number}}
 * @property {number} FREE              - The camera is free, it respond to all user input
 */
THREE.PerspectiveCamera.CameraState = {
    FREE:0,
    FIXED:1,
    TARGETING:2,
    ROTATING:3
};


/**
 * Set the camera in order to control it as in a FPS
 * @param {SIMU.View} view - The view where the camera will be attach to get the user input
 */
THREE.PerspectiveCamera.prototype.useFPSControls = function(view){
    if(this.controls){
        this.controls.enabled = false;
    }
    if(!this.fpControls)
    {
        this.fpControls = new THREE.FirstPersonControls(this, view.renderer.domElement);
        this.fpControls.moveSpeed =  0.5;
    }
    this.controls = this.fpControls;
    this.controls.enabled = true;
};