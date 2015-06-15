/**
 * Created by lespingal on 12/06/15.
 */

var App = {};

App.FileType = {
    SKYBOT : 0,
    BIN : 1,
    STRING : 2
};

App.type = App.FileType.BIN;

/**
 * @author Arnaud Steinmetz <s.arnaud67@hotmail.fr>
 * @description Function that is used to refresh the renderer
 */
function render() {
    requestAnimationFrame(function (){
        render();
    });
    if(App.scene.children[1] != undefined)
    {
        if(App.uniforms.t.value <1)
        {
            App.uniforms.t.value +=timeOffset;
        }else{
            App.uniforms.t.value=1;
        }
    }

    Gui.stats.update();
    App.renderer.render( App.scene, Camera.camera );
    Camera.controls.update(App.clock.getDelta());
}

App.clearPointCloud = function(){
    if(App.scene.children.length != 1)
    {
        var nbChildToDelete = App.scene.children.length;
        var numChildToDelete = 1;
        //Beginning the loop at 1 to avoid deleting the AxisHelper
        for(var i = 1; i < nbChildToDelete;i++)
        {
            //Always deleting the second Object of the scene, because on each delete, it refreshes the children Arrauy.
            if(App.scene.children[numChildToDelete].type == "PointCloud")
            {
                App.scene.remove(App.scene.children[numChildToDelete]);
            }
            else{
                numChildToDelete++;
            }

        }
    }
};

/**
 * @author Arnaud Steinmetz <s.arnaud67@hotmail.fr>
 * @description adds the attributes to the geometry and adds the PointCloud to the scene
 */
function loadData(){
    var geometry = new THREE.BufferGeometry();

    geometry.addAttribute('position' , new THREE.BufferAttribute( positionArray, 3 ));
    geometry.addAttribute('endPosition' , new THREE.BufferAttribute( endPositionArray, 3 ));

    geometry.computeBoundingSphere();
    App.pointCloud = new THREE.PointCloud(geometry, App.shaderMaterial);
    pointCloudsPart.push(App.pointCloud);

    App.scene.add(App.pointCloud);
}

setupScene();
setupcamera();
setupGUI();

initFileReading();

render();
