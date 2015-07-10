/**
 * Created by lespingal on 10/07/15.
 */

App.RenderableData = function(){
    this.data = new App.Data();
    this.pointCloud = null;
};

App.RenderableData.prototype.enableStaticShaderMode = function(){
    App.scene.remove(App.pointCloud);
    this.pointCloud.geometry = App.staticBufferGeometry;
    if(App.FOG){
        App.pointCloud.material = App.staticFogShaderMaterial;
    }else{
        App.pointCloud.material = App.staticShaderMaterial;
    }
    App.scene.add(App.pointCloud);
};

