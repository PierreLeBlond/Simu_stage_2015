/**
 * Created by lespingal on 15/06/15.
 */

/**
 * @description Classe qui permet d'afficher dans un element du DOM un rendu WebGL
 * L'idée et de pouvoir afficher simultanément plusieurs vues des données dans des parties différents de l'écran :
 * - On souhaite comparer différents jeux de données
 * - On souhaite comparer des données à des temps différents
 * - On souhaite comparer des informations différents sur les données
 */

/**
 * @description constructeur d'une vue, qui comporte une scene et de quoi l'afficher à l'écran
 * @constructor
 */
App.View = function () {

    this.domElement = null;
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({antialias:false});//disabling antialiasing for perf

    this.pointCloud = null;

};

App.View.prototype.getScene = function(){
    return this.scene;
};

App.View.prototype.getRenderer = function(){
    return this.renderer;
};

App.View.prototype.setElement = function(e){
    this.domElement = e;
};

App.View.prototype.setupScene = function(){
    if(this.domElement) {
        App.render.setSize(this.domElement.innerWidth, this.domElement.innerHeight);
        this.domElement.appendChild(this.renderer.domElement);
    }else{
        console.log("Error : Scene does not have a dom element")
    }
}
