/**
 * Created by lespingal on 30/06/15.
 */


function getIntersection(node){
    if(intersectBox(Camera.camera, node.box)) {
        if (node.hasChild) {
            var idOfIntersectedChildren = 0;
            //TODO get intersected children
            return getIntersection(node.child[idOfIntersectedChildren])
        }else{
            return null;
        }
    }
}

function intersectBox(camera, box){

}

App.Octree = function(){
    this.child = [];
    this.box = null;
    this.hasChild = false;
    this.start = 0;
    this.count = 0;
};

function sortData(data){

}

function createOctreeFromPos(positions){
    var octree = new App.Octree;
    function fillOctree(octreeNode, start, count){

    }

}

