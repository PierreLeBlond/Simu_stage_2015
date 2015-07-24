/**
 * Created by lespingal on 10/07/15.
 */
var SIMU = SIMU || {};

SIMU.RenderableData = function(){
    this.data                               = null;
    this.pointCloud                         = null;

    this.isActive                           = false;
    this.isReady                            = false;//true if the buffer are populated and no error occurred

    this.drawCalls                          = [];

    this.defaultColor                       = [255, 255, 255];

    this.animatedAttributes                 = {
        endPosition:    {type: 'v3', value: []},
        color:          {type: 'v3', value: []}
    };

    this.staticAttributes                   = {
        color:          {type: 'v3', value: []}
    };

    this.uniforms                           = {
        t:              { type: 'f', value: 0.001},
        size:           { type: 'f', value: 0.5},
        fog:            { type: 'f', value: 1.1},
        fogDistance:    { type: 'f', value: 3.4},
        map:            { type: 't', value: THREE.ImageUtils.loadTexture("resources/textures/spark1.png")}
    };

    this.animatedShaderMaterial             = new THREE.ShaderMaterial( {
        attributes:     this.animatedAttributes,
        uniforms:       this.uniforms,
        vertexShader:   SIMU.shader.animated.nofog.vertex,
        fragmentShader: SIMU.shader.animated.nofog.fragment,
        blending:       THREE.AdditiveBlending,
        depthTest:      false,
        transparent:    true,
        fog:            false
    });

    this.animatedFogShaderMaterial          = new THREE.ShaderMaterial({
        attributes:     this.animatedAttributes,
        uniforms:       this.uniforms,
        vertexShader:   SIMU.shader.animated.fog.vertex,
        fragmentShader: SIMU.shader.animated.fog.fragment,
        blending:       THREE.AdditiveBlending,
        depthTest:      false,
        transparent:    true,
        fog:            false
    });

    this.staticShaderMaterial               = new THREE.ShaderMaterial({
        attributes:     this.staticAttributes,
        uniforms:       this.uniforms,
        vertexShader:   SIMU.shader.static.nofog.vertex,
        fragmentShader: SIMU.shader.static.nofog.fragment,

        blending:       THREE.AdditiveBlending,
        depthTest:      false,
        transparent:    true,
        fog:            false
    });

    this.staticFogShaderMaterial            = new THREE.ShaderMaterial({
        attributes:     this.staticAttributes,
        uniforms:       this.uniforms,
        vertexShader:   SIMU.shader.static.fog.vertex,
        fragmentShader: SIMU.shader.static.fog.fragment,

        blending:       THREE.AdditiveBlending,
        depthTest:      false,
        transparent:    true,
        fog:            false
    });

    this.staticBufferGeometry               = new THREE.BufferGeometry();


    this.animatedBufferGeometry             = new THREE.BufferGeometry();
    this.animatedBufferGeometry.addAttribute('position', null);
    this.animatedBufferGeometry.addAttribute('endPosition', null);
    this.animatedBufferGeometry.addAttribute('color', null);


};

SIMU.RenderableData.prototype.setData = function(data){
    this.data = data;

    this.staticBufferGeometry.addAttribute('position', new THREE.BufferAttribute(this.data.currentPositionArray, 3));
    this.staticBufferGeometry.addAttribute('color', new THREE.BufferAttribute(this.data.color, 3));

    this.staticBufferGeometry.attributes.position.needsUpdate = true;
    this.staticBufferGeometry.attributes.color.needsUpdate = true;

    this.animatedBufferGeometry.addAttribute('position', new THREE.BufferAttribute(this.data.currentDeparture, 3));
    this.animatedBufferGeometry.addAttribute('endPosition', new THREE.BufferAttribute(this.data.currentDirection, 3));
    this.animatedBufferGeometry.addAttribute('color', new THREE.BufferAttribute(this.data.color, 3));

    this.animatedBufferGeometry.attributes.position.needsUpdate = true;
    this.animatedBufferGeometry.attributes.endPosition.needsUpdate = true;
    this.animatedBufferGeometry.attributes.color.needsUpdate = true;

    if(data.isReady) {
        this.isReady = true;
    }else{
        console.log("Warning : data is set but not ready yet.");
    }
};

SIMU.RenderableData.prototype.resetData = function(){
    if(this.data.isReady) {
        this.staticBufferGeometry.attributes.position = new THREE.BufferAttribute(this.data.currentPositionArray, 3);
        this.staticBufferGeometry.attributes.color = new THREE.BufferAttribute(this.data.color, 3);

        this.staticBufferGeometry.attributes.position.needsUpdate = true;
        this.staticBufferGeometry.attributes.color.needsUpdate = true;

        this.animatedBufferGeometry.attributes.position = new THREE.BufferAttribute(this.data.currentDeparture, 3);
        this.animatedBufferGeometry.attributes.endPosition = new THREE.BufferAttribute(this.data.currentDirection, 3);
        this.animatedBufferGeometry.attributes.color = new THREE.BufferAttribute(this.data.color, 3);

        this.animatedBufferGeometry.attributes.position.needsUpdate = true;
        this.animatedBufferGeometry.attributes.endPosition.needsUpdate = true;
        this.animatedBufferGeometry.attributes.color.needsUpdate = true;

        this.isReady = true;
    }
};

SIMU.RenderableData.prototype.enableAnimatedShaderMode = function(){
    this.pointCloud = null;
    if(SIMU.FOG){
        this.pointCloud = new THREE.PointCloud(this.animatedBufferGeometry, this.animatedFogShaderMaterial);
    }else{
        this.pointCloud = new THREE.PointCloud(this.animatedBufferGeometry, this.animatedShaderMaterial);
    }
};

SIMU.RenderableData.prototype.enableStaticShaderMode = function(){
    this.pointCloud = null;
    if(SIMU.FOG){
        this.pointCloud = new THREE.PointCloud(this.staticBufferGeometry, this.staticFogShaderMaterial);
    }else{
        this.pointCloud = new THREE.PointCloud(this.staticBufferGeometry, this.staticShaderMaterial);
    }
};

SIMU.RenderableData.prototype.computeCulling = function(camera){

    this.drawCalls = [];

    var that = this;

    function cullFromFrustum(octree){

        var box = octree.box;
        var xMin = box.xMin;
        var yMin = box.yMin;
        var zMin = box.zMin;
        var xMax = box.xMax;
        var yMax = box.yMax;
        var zMax = box.zMax;

        var test = 0;
        var isInside = false;

        /*for(var i = 0; i < 6; i++){



         }*/
        function testVertice(pos){
            var result = pos.project(camera);

            if(-1 <= result.x && result.x <= 1 && -1 <= result.y && result.y <= 1 && -1 <= result.z && result.z <= 1){
                return 1;
            }
            return 0;
        }

        //First test if camera is inside the box
        if(camera.position.x > xMin && camera.position.x < xMax && camera.position.y > yMin && camera.position.y < yMin && camera.position.z > zMin && camera.position.z < zMax){
            isInside = true;
        }else{
            test += testVertice(new THREE.Vector3(xMin, yMin, zMin));
            test += testVertice(new THREE.Vector3(xMax, yMin, zMax));
            test += testVertice(new THREE.Vector3(xMin, yMax, zMin));
            test += testVertice(new THREE.Vector3(xMax, yMax, zMax));
            test += testVertice(new THREE.Vector3(xMin, yMax, zMax));
            test += testVertice(new THREE.Vector3(xMax, yMin, zMin));
            test += testVertice(new THREE.Vector3(xMin, yMin, zMax));
            test += testVertice(new THREE.Vector3(xMax, yMax, zMin));
        }



        if(isInside || (test > 0 && test < 8)){//partially inside
            if(octree.hasChild) {
                for (var i = 0; i < octree.child.length; i++) {
                    cullFromFrustum(octree.child[i]);
                }
            }else{
                that.drawCalls.push({start : octree.start, count : octree.count});
            }
        }else if(test == 8){
            that.drawCalls.push({start : octree.start, count : octree.count});
        }

    }

    cullFromFrustum(this.data.currentOctree);
    this.pointCloud.geometry.offsets = this.pointCloud.geometry.drawcalls = [];
    for(var i = 0; i < this.drawCalls.length;i++){
        this.pointCloud.geometry.addDrawCall(this.drawCalls[i].start, this.drawCalls[i].count, this.drawCalls[i].start);
    }

};

SIMU.RenderableData.prototype.getIntersection = function(mouse, camera){
    if(this.isReady) {
        var target = null;

        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        var intersectedOctants = this.getIntersectedOctans(camera.position, raycaster.ray.direction);
        console.log(intersectedOctants);

        var i;
        var j = 0;

        while (j < intersectedOctants.length && target == null) {
            var start = intersectedOctants[j].start;
            var end = intersectedOctants[j].count + start;
            for (i = start; i < end; i++) {
                var x = this.data.currentPositionArray[3 * i];
                var y = this.data.currentPositionArray[3 * i + 1];
                var z = this.data.currentPositionArray[3 * i + 2];
                var a = raycaster.ray.direction.x;
                var b = raycaster.ray.direction.y;
                var c = raycaster.ray.direction.z;
                var cx = camera.position.x;
                var cy = camera.position.y;
                var cz = camera.position.z;

                if ((x - cx) * (a - cx) + (y - cy) * (b - cy) + (z - cz) * (c - cz) > 0) { //We don't want particles behind us, the sneaky ones

                    var d = -a * x - b * y - c * z;

                    var md = (Math.pow(a * cx + b * cy + c * cz + d, 2)) / (a * a + b * b + c * c);
                    var h = Math.abs((cx - x) * (cx - x) + (cy - y) * (cy - y) + (cz - z) * (cz - z));
                    if (Math.sqrt(h - md) < this.uniforms.size.value / 4000) { //It's a kind of magic, maaaaagic !
                        if (target == null) {
                            target = {index: i, distance: Math.sqrt(h), renderableData: this};
                        } else if (Math.sqrt(h) < target.distance) {
                            target.index = i;
                            target.distance = Math.sqrt(h);
                        }
                    }
                }
            }
            j++;
        }
        console.log(target);
        return target;
    }else{
        return null;
    }
};


SIMU.RenderableData.prototype.getIntersectedOctans = function(origin, ray){
    function getIntersectedOctanWithFace(octree, octan, face){

        var octreeChild = octree.child[octan - 1];
        var xMin = octreeChild.box.xMin;
        var xMax = octreeChild.box.xMax;
        var yMin = octreeChild.box.yMin;
        var yMax = octreeChild.box.yMax;
        var zMin = octreeChild.box.zMin;
        var zMax = octreeChild.box.zMax;

        var x = 0;
        var y = 0;
        var z = 0;

        var inter = false;
        var distance = 0;
        //test if intersection really occur
        switch(face){
            case 1:
                distance = (xMin-origin.x)/ray.x;
                y = origin.y + distance*ray.y;
                z = origin.z + distance*ray.z;
                inter = y > yMin && y < yMax && z > zMin && z < zMax;
                break;
            case 2:
                distance = (xMax-origin.x)/ray.x;
                y = origin.y + distance*ray.y;
                z = origin.z + distance*ray.z;
                inter = y > yMin && y < yMax && z > zMin && z < zMax;
                break;
            case 3:
                distance = (yMin-origin.y)/ray.y;
                x = origin.x + distance*ray.x;
                z = origin.z + distance*ray.z;
                inter = x > xMin && x < xMax && z > zMin && z < zMax;
                break;
            case 4:
                distance = (yMax-origin.y)/ray.y;
                x = origin.x + distance*ray.x;
                z = origin.z + distance*ray.z;
                inter = x > xMin && x < xMax && z > zMin && z < zMax;
                break;
            case 5:
                distance = (zMin-origin.z)/ray.z;
                x = origin.x + distance*ray.x;
                y = origin.y + distance*ray.y;
                inter = x > xMin && x < xMax && y > yMin && y < yMax;
                break;
            case 6:
                distance = (zMax-origin.z)/ray.z;
                x = origin.x + distance*ray.x;
                y = origin.y + distance*ray.y;
                inter = x > xMin && x < xMax && y > yMin && y < yMax;
                break;
        }


        //if yes, continue
        if(inter) {
            var i;
            if(octreeChild.hasChild){
                var faceToOctan = SIMU.faceToOctan[face - 1];
                for(i = 0; i < faceToOctan.length;i++){
                    getIntersectedOctanWithFace(octreeChild, faceToOctan[i], face);
                }
            }else{
                intersectedOctan.push({start : octreeChild.start, count : octreeChild.count});
            }
            var octanToFace = SIMU.octanToFace[octan - 1][face - 1];
            for (i = 0; i < octanToFace.length; i++) {
                getIntersectedOctanWithFace(octree, octanToFace[i].octan, octanToFace[i].face);
            }
        }
    }


    function getIntersectedOctan(octree){

        if(octree.hasChild){

            var xMin = octree.box.xMin;
            var xMax = octree.box.xMax;
            var yMin = octree.box.yMin;
            var yMax = octree.box.yMax;
            var zMin = octree.box.zMin;
            var zMax = octree.box.zMax;

            var xMid = (xMin + xMax) / 2;
            var yMid = (yMin + yMax) / 2;
            var zMid = (zMin + zMax) / 2;

            var inter = false;
            var distance = 0;
            var x = 0;
            var y = 0;
            var z = 0;

            var faceToOctan = null;

            var i;

            if(origin.x < xMid){
                //test face 1 (x = 0)
                distance = (xMin-origin.x)/ray.x;
                y = origin.y + distance*ray.y;
                z = origin.z + distance*ray.z;

                if(y > yMin && y < yMax && z > zMin && z < zMax){

                    //face 1 intersected
                    inter = true;
                    faceToOctan = SIMU.faceToOctan[0];
                    for(i = 0; i < faceToOctan.length;i++){
                        getIntersectedOctanWithFace(octree, faceToOctan[i], 1);
                    }
                }
            }else{
                //test face 2 (x = 1)
                distance = (xMax-origin.x)/ray.x;
                y = origin.y + distance*ray.y;
                z = origin.z + distance*ray.z;

                if(y > yMin && y < yMax && z > zMin && z < zMax) {

                    //face 2 intersected
                    inter = true;

                    faceToOctan = SIMU.faceToOctan[1];
                    for(i = 0; i < faceToOctan.length;i++){
                        getIntersectedOctanWithFace(octree, faceToOctan[i], 2);
                    }
                }
            }

            if(!inter && origin.y < yMid){
                //test face 3 (y = 0)
                distance = (yMin-origin.y)/ray.y;
                x = origin.x + distance*ray.x;
                z = origin.z + distance*ray.z;

                if(x > xMin && x < xMax && z > zMin && z < zMax) {
                    //face 3 intersected
                    inter = true;

                    faceToOctan = SIMU.faceToOctan[2];
                    for(i = 0; i < faceToOctan.length;i++){
                        getIntersectedOctanWithFace(octree, faceToOctan[i], 3);
                    }
                }
            }else if(!inter){
                //test face 4 (y = 1)
                distance = (yMax-origin.y)/ray.y;
                x = origin.x + distance*ray.x;
                z = origin.z + distance*ray.z;

                if(x > xMin && x < xMax && z > zMin && z < zMax) {
                    //face 4 intersected
                    inter = true;

                    faceToOctan = SIMU.faceToOctan[3];
                    for(i = 0; i < faceToOctan.length;i++){
                        getIntersectedOctanWithFace(octree, faceToOctan[i], 4);
                    }
                }
            }

            if(!inter && origin.z < zMid){
                //test face 5 (z = 0)
                distance = (zMin-origin.z)/ray.z;
                x = origin.x + distance*ray.x;
                y = origin.y + distance*ray.y;

                if(x > xMin && x < xMax && y > yMin && y < yMax) {
                    //face 5 intersected
                    faceToOctan = SIMU.faceToOctan[4];
                    for(i = 0; i < faceToOctan.length;i++){
                        getIntersectedOctanWithFace(octree, faceToOctan[i], 5);
                    }
                }
            }else if(!inter){
                //test face 6 (z = 1)
                distance = (zMax-origin.z)/ray.z;
                x = origin.x + distance*ray.x;
                y = origin.y + distance*ray.y;

                if(x > xMin && x < xMax && y > yMin && y < yMax) {
                    //face 6 intersected
                    faceToOctan = SIMU.faceToOctan[5];
                    for(i = 0; i < faceToOctan.length;i++){
                        getIntersectedOctanWithFace(octree, faceToOctan[i], 6);
                    }
                }
            }
        }
    }

    var intersectedOctan = [];
    getIntersectedOctan(this.data.currentOctree);
    return intersectedOctan;
};



