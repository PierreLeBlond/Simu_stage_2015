/**
 * Created by lespingal on 15/06/15.
 */

/**
 * @author Arnaud Steinmetz <s.arnaud67@hotmail.fr>, Modification by Pierre Lespingal
 * @description Change the color of the selected ( left mouse ) or deselected ( right mouse ) point
 * @param {event} event
 */
function selectPoint(event) {

    if (App.pointCloud != null) {
        event.preventDefault();
        var mouse = new THREE.Vector2(
            ( event.clientX / App.renderer.domElement.clientWidth ) * 2 - 1,
            -( event.clientY / App.renderer.domElement.clientHeight ) * 2 + 1
        );

        App.intersection = getMousePointCloudIntersection(mouse);

        if (App.intersection != null) {
            console.log("touché !");
            switch (event.button) {
                case 0 :
                    if(App.selection != null){
                        if(App.GEOMETRYBUFFER){
                            whitify(App.selection.object.geometry.attributes.color, App.selection.index);
                        }else{
                            whitify(App.selection.object.material.attributes.color, App.selection.index);
                        }
                    }

                    if(App.GEOMETRYBUFFER){
                        greenify(App.intersection.object.geometry.attributes.color, App.intersection.index);
                    }else{
                        greenify(App.intersection.object.material.attributes.color, App.intersection.index);
                    }

                    App.selection = App.intersection;

                    break;
                case 2 :
                    if(App.selection.index != null && App.intersection.index == App.selection.index){
                        if(App.GEOMETRYBUFFER){
                            whitify(App.intersection.object.geometry.attributes.color, App.intersection.index);
                        }else{
                            whitify(App.intersection.object.material.attributes.color, App.intersection.index);
                        }

                        App.selection = null;
                    }
                    break;
                default :
                    break;
            }
        }
    }
}

/**
 * @author Pierre Lespingal
 * @description highlight the point under the mouse
 * @param event
 */
function checkForPointUnderMouse(event){

    if(App.pointCloud != null) {
        event.preventDefault();
        var mouse = new THREE.Vector2(
            ( event.clientX / App.renderer.domElement.clientWidth ) * 2 - 1,
            -( event.clientY / App.renderer.domElement.clientHeight ) * 2 + 1
        );


        intersection = getMousePointCloudIntersection(mouse);

        if(App.intersection != null && (intersection == null || App.intersection != intersection) && (App.selection == null || App.intersection != App.selection)){
            if(App.GEOMETRYBUFFER){
                whitify(App.intersection.object.geometry.attributes.color, App.intersection.index);
            }else{
                whitify(App.intersection.object.material.attributes.color, App.intersection.index);
            }
        }
        if(intersection != null && (App.selection == null || intersection.index != App.selection.index)){

            App.intersection = intersection;

            if(App.GEOMETRYBUFFER){
                redify(App.intersection.object.geometry.attributes.color, App.intersection.index);
            }else{
                redify(App.intersection.object.material.attributes.color, App.intersection.index);
            }
        }


    }
}

function redify(color, index){
    color.array[index * 3] = 1.0;
    color.array[index * 3 + 1] = 0.0;
    color.array[index * 3 + 2] = 0.0;
    color.needsUpdate = true;
}

function greenify(color, index){
    color.array[index * 3] = 0.0;
    color.array[index * 3 + 1] = 1.0;
    color.array[index * 3 + 2] = 0.0;
    color.needsUpdate = true;
}

function whitify(color, index){
    color.array[index * 3] = 1.0;
    color.array[index * 3 + 1] = 1.0;
    color.array[index * 3 + 2] = 1.0;
    color.needsUpdate = true;
}

/**
 * @author Arnaud Steinmetz <s.arnaud67@hotmail.fr>
 * @description Show the infos about the point on the screen
 *
 */
/*function showInfo(pointInfo)
 {
 if(pointInfo)
 {
 document.getElementById("lblInfoIdSpan").innerHTML = storedData[pointInfo.object.name][pointInfo.index][0];
 document.getElementById("lblInfoMasseSpan").innerHTML = storedData[pointInfo.object.name][pointInfo.index][1];
 document.getElementById("lblInfoAgeSpan").innerHTML = storedData[pointInfo.object.name][pointInfo.index][2];
 }
 else
 {
 document.getElementById("lblInfoIdSpan").innerHTML = "";
 document.getElementById("lblInfoMasseSpan").innerHTML = "";
 document.getElementById("lblInfoAgeSpan").innerHTML = "";
 }
 }*/

/**
 * Checking if the user clicked on a point of the screen.
 *
 * @param {THREE.Vector2} mouse - Point where the user clicked.
 * @return {[ { distance, distanceToRay, face, index, object, point } ]} point - Informations about the intersected point
 */
function getMousePointCloudIntersection(mouse)
{
    var magic_size = Gui.gui.__controllers[0].__min/2;//Why ? --> this value is small enough to be accurate - without intersecting too many particles, and big enough to catch something on screen.
    var size = App.uniforms.size.value/(2*400);//This one works, but is a bit too big. There is a risk of catching off-screen particles.
    var point = null;
    if(App.pointCloud != null)
    {
        var raycaster = new THREE.Raycaster();
        raycaster.params.PointCloud.threshold = size; //used by threeJS to know distance from center of the object to consider it as clicked
        raycaster.setFromCamera( mouse, Camera.camera );



        App.scene.updateMatrixWorld();

        var intersection  = null;

        var intersections = raycaster.intersectObject( App.pointCloud );
        var i = 0;
        //We have to check again due to the size attenuation.
        while(i < intersections.length && ( intersections[i].distance == 0 || intersections[i].distanceToRay > size/intersections[i].distance)){
            i++;
        }
        if(i < intersections.length){
            intersection = intersections[i];
        }

        if(intersection != null)
        {
            point = intersection;
        }
    }
    return point;
}

/**
 * @author Arnaud Steinmetz <s.arnaud67@hotmail.fr>
 * @description Zoom on the point that was clicked by the user and reduce the size of the points to see the positions with more accuracy.
 *
 */
function zoomMacro(event)
{
    if(App.pointCloud != null)
    {
        event.preventDefault();
        var mouse = new THREE.Vector2(
            ( event.clientX / App.renderer.domElement.clientWidth ) * 2 - 1,
            - ( event.clientY / App.renderer.domElement.clientHeight ) * 2 + 1
        );
        App.intersection = getMousePointCloudIntersection(mouse);
        var size = App.uniforms.size;

        if(App.intersection != null)
        {
            var x = App.intersection.object.geometry.attributes.position.array[App.intersection.index*3];
            var y = App.intersection.object.geometry.attributes.position.array[App.intersection.index*3+1];
            var z = App.intersection.object.geometry.attributes.position.array[App.intersection.index*3+2];

            Camera.camera.position.set(x+size,y+size,z+size);

            //Camera.controls.moveSpeed = padding * 10;
            //App.animationShaderMaterial.size = padding;
            //App.uniforms.size = padding;

        }

    }
}

/**
 * @author Pierre Lespingal
 * @description get screen position from world 3D position
 * @param position
 * @returns {*}
 */
function worldToScreen(position){
    //console.log(position);
    var pos = position.clone();
    //var projScreenMat = new THREE.Matrix4();
    //projScreenMat.multiplyMatrices(Camera.camera.projectionMatrix, Camera.camera.matrixWorldInverse);
    //pos.applyMatrix4(projScreenMat);
    //Camera.camera.updateMatrixWorld;
    var result = pos.project(Camera.camera);
    result.x =  (result.x + 1) / 2 * App.width;
    result.y =  -(result.y - 1) / 2 * App.height;
    return result;
}