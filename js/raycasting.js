/**
 * Created by lespingal on 15/06/15.
 */

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
    //var magic_size = Gui.gui.__controllers[0].__min/2;//Why ? --> this value is small enough to be accurate - without intersecting too many particles, and big enough to catch something on screen.
    var size = App.uniforms.size.value/(2*400);//This one works, but is also a bit magical.
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
 * @author Pierre Lespingal
 * @description get screen position from world 3D position
 * @param position
 * @returns {*}
 */
function worldToScreen(position){
    var pos = position.clone();
    var result = pos.project(Camera.camera);
    result.x =  (result.x + 1) / 2 * App.width;
    result.y =  -(result.y - 1) / 2 * App.height;
    return result;
}