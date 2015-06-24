/**
 * Created by lespingal on 12/06/15.
 */

Camera = {};
Camera.defaultSpeed = 0.1;

/**
 * @author arnaud steinmetz <s.arnaud67@hotmail.fr>
 * adapted from FirstPersonControls by
 * @author mschuetz <mschuetz@potree.org>
 *
 * @description initialize and set the FPSControls as controls
 */
function useFPSControls(){
    if(Camera.controls){
        Camera.controls.enabled = false;
    }
    if(!Camera.fpControls)
    {
        Camera.fpControls = new THREE.FirstPersonControls(Camera.camera, App.renderer.domElement);
        Camera.fpControls.moveSpeed =  Camera.defaultSpeed;
    }
    Camera.controls = Camera.fpControls;
    Camera.controls.enabled = true;
}

/**
 * @author arnaud steinmetz <s.arnaud67@hotmail.fr>
 * adapted from OrbitControls by
 * @author mschuetz <mschuetz@potree.org>
 *
 * @description initialize and set the OrbitControls as controls
 */
function useOrbitControls(){
    if(Camera.controls){
        Camera.controls.enabled = false;
    }
    if(!Camera.orbitControls)
    {
        Camera.orbitControls = new THREE.OrbitControls(Camera.camera, App.renderer.domElement);
    }
    Camera.controls = Camera.orbitControls;
    Camera.controls.enabled = true;
}

function setupcamera(){
    //choosing the controls that will be used
    useFPSControls(); //One call to create the object fpControl
    useOrbitControls();

    //debug for zoom test
    useFPSControls();
    Camera.controls.reset();
}