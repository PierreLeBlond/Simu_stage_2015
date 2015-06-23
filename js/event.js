/**
 * Created by lespingal on 19/06/15.
 */

/**
 * @description All function to handle keyboard and mouse events
 */



var timeout = null;

function initEventhandling(){
    enableMouseEventHandling();

    window.addEventListener( 'keydown', onKeyboardDown, false );
    //adding a listener to resize the window when it changes
    window.addEventListener( 'resize', onWindowResize, false );
}

//No need to check for intersection if the mouse is moving, so let's wait until it isn't
function stopIntersectionSearch(event){
    if(timeout !== null){
        clearTimeout(timeout);
    }

    timeout = setTimeout(function(){
        checkForPointUnderMouse(event);
    }, 30);
}

function mouseIsDown(event){
    App.renderer.domElement.removeEventListener("mousemove", stopIntersectionSearch(), false);
    selectPoint(event);
}

function mouseIsUp(event){
    App.renderer.domElement.addEventListener("mousemove", stopIntersectionSearch(), false);
}

function enableMouseEventHandling() {
    App.renderer.domElement.addEventListener("mousemove", stopIntersectionSearch, false);
    App.renderer.domElement.addEventListener("mousedown", mouseIsDown, false);
    App.renderer.domElement.addEventListener("mouseup", mouseIsUp, false);
    App.renderer.domElement.addEventListener("dblclick", zoomMacro, false);
}

function disableMouseEventHandling(){
    App.renderer.domElement.removeEventListener("mousemove", stopIntersectionSearch, false);
    App.renderer.domElement.removeEventListener("mousedown", mouseIsDown, false);
    App.renderer.domElement.removeEventListener("mouseup", mouseIsUp, false);
    App.renderer.domElement.removeEventListener("dblclick", zoomMacro, false);
}

/**
 * @author Pierre Lespingal
 * @description Handle keyboard events
 * @param event
 */
function onKeyboardDown(event){
    switch(event.keyCode){
        case 80 ://p
            if(App.play){
                App.play = false;
                App.updated = false;
                enableMouseEventHandling();
                //timedChunckComputePositions();
                computePositions();
            }else{
                App.play = true;
                disableMouseEventHandling();
                setAnimationShaderMode();
            }
            break;
        default:
            break;
    }
}

/**
 * @author mrdoob
 * @description when resizing the windows, takes care that the ratio and aspect stays good
 */
function onWindowResize() {
    App.width = window.innerWidth;
    App.height = window.innerHeight;

    Camera.camera.aspect = App.width / App.height;
    Camera.camera.updateProjectionMatrix();

    App.renderer.setSize( App.width, App.height );
    App.colorPickingRenderer.setSize(App.width, App.height);

}



