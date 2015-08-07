/**
 * Created by lespingal on 10/07/15.
 */
var SIMU = SIMU || {};

/**
 * Represent some data set which can be display on screen
 * @detail Each instance is linked to a {@link Data} object
 * @constructor
 *
 * @property {SIMU.Data} this.data                                      - The {@link Data} set we want to render
 * @property {THREE.PointCloud} this.pointCloud                         - The point-cloud used to render the data
 * @property {boolean} this.isActive                                    - True if we are displaying the point-cloud on screen
 * @property {boolean} this.isReady                                     - True if the data is ready itself
 * @property {Array} this.drawCalls                                     - Array of calls, enable us to perform occlusion
 * @property {int} this.levelOfDetail                                   - The higher it is, the more particle we are actually rendering
 * @property {Array} this.defaultColor                                  - The default color used for particle
 * @property {int} this.idTexture                                       - The id of the currently used texture
 * @property {int} this.idBlending                                      - The id of the currently used blending type
 * @property {int} this.idInfo                                          - The id of the currently used information for highlighting
 * @property {object} this.clock                                        - the clock used to get elapsed time between frame
 * @property {object} this.animatedAttributes                           - Shader attributes in animated mode
 * @property {object} this.staticAttributes                             - Shader attributes in static mode
 * @property {object} this.animatedParametricAttributes                 - Shader attributes in animated mode, with the use of aditionnal information
 * @property {object} this.staticParametricAttributes                   - Shader attributes in static mode, with the use of aditionnal information
 * @property {object} this.uniforms                                     - Shader uniforms variables
 */
SIMU.RenderableData = function(){
    this.data                               = null;                     //** - The {@link Data} set we want to render */
    this.pointCloud                         = null;                     //** - The point-cloud used to render the data */

    this.isActive                           = false;                    //** - True if we are displaying the point-cloud on screen */
    this.isReady                            = false;                    //** - True if the data is ready itself */

    this.drawCalls                          = [];                       //** - Array of calls, enable us to perform occlusion */
    this.levelOfDetail                      = 4;                        //** - The higher it is, the more particle we are actually rendering */

    this.defaultColor                       = [255, 255, 255];          //** - The default color used for particle */
    this.idTexture                          = 0;                        //** - The id of the currently used texture */
    this.idBlending                         = 1;                        //** - The id of the currently used blending type */
    this.idInfo                             = 0;                        //** - The id of the currently used information for highlighting */

    this.clock                              = new THREE.Clock();        //** - the clock used to get elapsed time between frame */

    this.animatedAttributes                 = {                         //** - Shader attributes in animated mode */
        departure:      {type: 'v3', value: []},
        endPosition:    {type: 'v3', value: []},
        color:          {type: 'v3', value: []}
    };

    this.staticAttributes                   = {                         //** Shader attributes in static mode */
        color:          {type: 'v3', value: []}
    };
//
    this.animatedParametricAttributes       = {                         //** Shader attributes in animated mode, with the use of aditionnal information */
        departure:      {type: 'v3', value: []},
        endPosition:    {type: 'v3', value: []},
        info:           {type: 'f', value: []},
        color:          {type: 'v3', value: []}
    };
//
    this.staticParametricAttributes         = {                         //** Shader attributes in static mode, with the use of aditionnal information */
        info:           {type: 'f', value: []},
        color:          {type: 'v3', value: []}
    };

    this.uniforms                           = {                         //** Shader uniforms variables */
        t:              { type: 'f', value: 0.001},                                                         /** relative time within the application */
        current_time:   { type: 'f', value: 60.0},                                                          /** Real time given by the computer clock */
        size:           { type: 'f', value: 0.5},                                                           /** Size of the particle */
        fogFactor:      { type: 'f', value: 0.9},                                                           /** Strength factor of the scene fog */
        fogDistance:    { type: 'f', value: 3.4},                                                           /** Attenuation Distance of the scene fog */
        map:            { type: 't', value: THREE.ImageUtils.loadTexture("resources/textures/spark.png")},  /** Texture map */
        fog:            { type: 'i', value: 0},                                                             /** 1 if fog is enabled, else 0 */
        blink:          { type: 'i', value: 0},                                                             /** 1 if blinking is enabled, else 0 */
        param_type:     { type: 'i', value: 0},                                                             /** Way of highlighting the info attribute */
        min_info:       { type: 'f', value: 0.0},                                                           /** Minimum value of the current info attribute */
        max_info:       { type: 'f', value: 0.0}                                                            /** Maximum value of the current info attribute */
    };

    this.animatedShaderMaterial             = new THREE.ShaderMaterial( {
        attributes:     this.animatedAttributes,
        uniforms:       this.uniforms,
        vertexShader:   SIMU.ShaderManagerSingleton.getInstance().shaders.default.animated.vertex,
        fragmentShader: SIMU.ShaderManagerSingleton.getInstance().shaders.default.animated.fragment,
        blending:       THREE.AdditiveBlending,
        depthTest:      false,
        transparent:    true,
        fog:            false
    });

    this.staticShaderMaterial               = new THREE.ShaderMaterial({
        attributes:     this.staticAttributes,
        uniforms:       this.uniforms,
        vertexShader:   SIMU.ShaderManagerSingleton.getInstance().shaders.default.static.vertex,
        fragmentShader: SIMU.ShaderManagerSingleton.getInstance().shaders.default.static.fragment,
        blending:       THREE.AdditiveBlending,
        depthTest:      false,
        transparent:    true,
        fog:            false
    });

    this.animatedParametricShaderMaterial           = new THREE.ShaderMaterial({
        attributes:     this.animatedParametricAttributes,
        uniforms:       this.uniforms,
        vertexShader:   SIMU.ShaderManagerSingleton.getInstance().shaders.parametric.animated.vertex,
        fragmentShader: SIMU.ShaderManagerSingleton.getInstance().shaders.parametric.animated.fragment,
        blending:       THREE.AdditiveBlending,
        depthTest:      false,
        transparent:    true,
        fog:            false
    });

    this.staticParametricShaderMaterial           = new THREE.ShaderMaterial({
        attributes:     this.staticParametricAttributes,
        uniforms:       this.uniforms,
        vertexShader:   SIMU.ShaderManagerSingleton.getInstance().shaders.parametric.static.vertex,
        fragmentShader: SIMU.ShaderManagerSingleton.getInstance().shaders.parametric.static.fragment,
        blending:       THREE.AdditiveBlending,
        depthTest:      false,
        transparent:    true,
        fog:            false
    });

    this.bufferGeometry                             = new THREE.BufferGeometry();
    //this.bufferGeometry.dynamic                     = true;

    this.pointCloud = new THREE.PointCloud(this.bufferGeometry, this.staticShaderMaterial);
};

/**
 * @description Bind a Data object to this RenderableData
 * @detail data can be empty for the moment
 * @param data
 */
SIMU.RenderableData.prototype.setData = function(data){
    this.data = data;

    this.resetData();
};

/**
 * @description When the bind data is already loaded, reset the display attributes to see the new change on the screen
 */
SIMU.RenderableData.prototype.resetData = function(){
    if(this.data.isReady) {

        if(typeof this.bufferGeometry.attributes.departure == 'undefined' && this.data.currentDepartureIsSet){
            this.bufferGeometry.addAttribute('departure', new THREE.BufferAttribute(this.data.currentDeparture, 3));
        }else if(this.data.currentDepartureIsSet){
            this.pointCloud.geometry.attributes.departure.needsUpdate = true;
        }

        if(typeof this.bufferGeometry.attributes.info == 'undefined' && this.data.currentInfoIsSet){
            this.bufferGeometry.addAttribute('info', new THREE.BufferAttribute(this.data.currentInfo, 1));
        }else if(this.data.currentInfoIsSet){
            this.pointCloud.geometry.attributes.info.needsUpdate = true;
        }

        if(this.bufferGeometry.attributes.position == null && this.data.currentPositionIsSet){
            this.bufferGeometry.addAttribute('position', new THREE.BufferAttribute(this.data.currentPositionArray, 3));
        }else if(this.data.currentPositionIsSet){
            this.pointCloud.geometry.attributes.position.needsUpdate = true;
        }

        if(this.bufferGeometry.attributes.color == null && this.data.currentColorIsSet){
            this.bufferGeometry.addAttribute('color', new THREE.BufferAttribute(this.data.color, 3));
        }else if(this.data.currentColorIsSet){
            this.pointCloud.geometry.attributes.color.needsUpdate = true;
        }

        if(typeof this.bufferGeometry.attributes.endPosition == 'undefined' && this.data.currentDirectionIsSet){
            this.bufferGeometry.addAttribute('endPosition', new THREE.BufferAttribute(this.data.currentDirection, 3));
        }else if(this.data.currentDirectionIsSet){
            this.pointCloud.geometry.attributes.endPosition.needsUpdate = true;
        }

        this.isReady = true;
    }else{
        this.isReady = false;
        console.log("Warning : data is set but not ready yet.");
    }
};

/**
 * Set the PointCloud in animated mode, i.e. with the position being compute within the shader (GPU)
 */
SIMU.RenderableData.prototype.enableAnimatedShaderMode = function(){
    if(this.data.currentDepartureIsSet && this.data.currentDirectionIsSet) {
        this.pointCloud.material = this.animatedShaderMaterial;
        this.pointCloud.material.needsUpdate = true;
    }
    else
        console.log("No direction set");
};

/**
 * Set the PointCloud in static mode, i.e. with the position being compute within the CPU
 */
SIMU.RenderableData.prototype.enableStaticShaderMode = function(){
    this.pointCloud.material = this.staticShaderMaterial;
    this.pointCloud.material.needsUpdate = true;

};

/**
 * Set the PointCloud in parametric mode, where the interpolate information within the shader, while computing position on CPU side
 */
SIMU.RenderableData.prototype.enableStaticParametricShaderMode = function(){
    this.pointCloud.material = this.staticParametricShaderMaterial;
    this.pointCloud.material.needsUpdate = true;

};

/**
 * Set the PointCloud in parametric mode, where the interpolate information within the shader, while computing position on GPU side
 */
SIMU.RenderableData.prototype.enableAnimatedParametricShaderMode = function(){
    this.pointCloud.material = this.animatedParametricShaderMaterial;
    this.pointCloud.material.needsUpdate = true;
};

/**
 * Compute the frustum culling, by change the PointCloud draw-calls
 * @param {THREE.Camera} camera
 */
SIMU.RenderableData.prototype.computeCulling = function(camera){

    this.drawCalls = [];

    var that = this;

    /**
     * Compute frustum culling based on the given octree
     * @param {SIMU.Octree} octree
     */
    function cullFromFrustum(octree){

        var box = octree.box;
        var xMin = box.xMin;
        var yMin = box.yMin;
        var zMin = box.zMin;
        var xMax = box.xMax;
        var yMax = box.yMax;
        var zMax = box.zMax;

        var center = new THREE.Vector3(xMax - xMin, yMax - yMin, zMax - zMin);

        var points = [new THREE.Vector3(xMin, yMin, zMin),
            new THREE.Vector3(xMin, yMin, zMax),
            new THREE.Vector3(xMin, yMax, zMin),
            new THREE.Vector3(xMin, yMax, zMax),
            new THREE.Vector3(xMax, yMin, zMin),
            new THREE.Vector3(xMax, yMin, zMax),
            new THREE.Vector3(xMax, yMax, zMin),
            new THREE.Vector3(xMax, yMax, zMax)
        ];

        /**
         * @depreciate
         * old function, was testing each point in clip coordinate against frustum
         * @param {THREE.Vector3} pos - Position of the tested point
         * @returns {int} - 1 if point is inside, else 0
         */
        function testVertice(pos){
            var result = pos.project(camera);

            if(-1 <= result.x && result.x <= 1 && -1 <= result.y && result.y <= 1 && -1 <= result.z && result.z <= 1){
                return 1;
            }
            return 0;
        }

        /**
         * Test the box against one of the frustum plane
         * @detail Use n-vertex & p-vertex optimisation : see {@link http://www.cescg.org/CESCG-2002/DSykoraJJelinek/}
         *
         * @param {THREE.Plane} p - The frustum plane to test against
         * @returns {int} - Number of point outside the plane ( i.e. on his front side )
         */
        function testBoxVsPlaneFast(p){
            //TODO just test n-vertex & p-vertex
            var nb = 0;
            var id = (p.normal.x > 0 ? 0 : 1)*4 + (p.normal.y > 0 ? 0 : 1)*2 + (p.normal.z > 0 ? 0 : 1);
            var n_vertex = points[id];
            var p_vertex = points[7 - id];
            var m = p.normal.dot(n_vertex);
            if(m <= -p.constant){
                nb++;
            }
            m = p.normal.dot(p_vertex);
            if(m <= -p.constant){
                nb++;
            }
            return nb;
        }

        /**
         * Test the box against frustum
         *
         * @returns {int} - 0 if outside, 1 if partially inside, 2 if completely inside
         */
        function testBoxVsFrustumFast(){
            var nb = 0;
            var partial = false;
            var i = 0;
            //TODO use plane coherency
            while(i < 6 && nb != 2){
                nb = testBoxVsPlaneFast(camera.frustum.planes[i]);
                if(nb > 0 && nb < 2){
                    partial = true;
                }
                i++;
            }
            if(i == 6){
                if(partial){
                    return 1;//partial
                }else{
                    return 2;//inside
                }
            }else{
                return 0;//outside
            }
        }

        test = testBoxVsFrustumFast();
        if(test == 1){
            if(octree.hasChild) {
                for (var i = 0; i < octree.child.length; i++) {
                    cullFromFrustum(octree.child[i]);
                }
            }else{
                /*var levelOfdetailMax = that.data.levelOfDetailMax;

                var diff = new THREE.Vector3(camera.position.x - center.x, camera.position.y - center.y,camera.position.z - center.z);
                var distance = 0.1;
                if(diff.length() > 1.0)
                    distance = 1.0;
                else if(diff.length() < 0.1)
                    distance = 0.1;
                else
                    distance = diff.length();
                var levelOfDetail = distance*(1 - levelOfdetailMax) + levelOfdetailMax;

                for (var j = 0; j < levelOfDetail; j++) {
                    var start = octree.start / levelOfdetailMax + j * that.data.snapshots[that.data.currentSnapshotId].index.length / levelOfdetailMax;
                    var count = octree.count / levelOfdetailMax;
                    that.drawCalls.push({start: start, count: count});
                }*/
                that.drawCalls.push({start: octree.start, count: octree.count});
            }
        }else if(test == 2){
            /*var levelOfdetailMax = that.data.levelOfDetailMax;

            var diff = new THREE.Vector3(camera.position.x - center.x, camera.position.y - center.y,camera.position.z - center.z);
            var distance = 0.1;
            if(diff.length() > 1.0)
                distance = 1.0;
            else if(diff.length() < 0.1)
                distance = 0.1;
            else
                distance = diff.length();
            var levelOfDetail = distance*(1 - levelOfdetailMax) + levelOfdetailMax;

            for (var j = 0; j < levelOfDetail; j++) {
                var start = octree.start / levelOfdetailMax + j * that.data.snapshots[that.data.currentSnapshotId].index.length / levelOfdetailMax;
                var count = octree.count / levelOfdetailMax;
                that.drawCalls.push({start: start, count: count});
            }*/
            that.drawCalls.push({start: octree.start, count: octree.count});

        }
    }

    if(this.isReady) {



        cullFromFrustum(this.data.currentOctree);





        var levelOfdetailMax = this.data.levelOfDetailMax;
        this.pointCloud.geometry.offsets = this.pointCloud.geometry.drawcalls = [{start: 0, count: 0}];
        for (var i = 0; i < this.drawCalls.length; i++) {
            //this.pointCloud.geometry.addDrawCall(this.drawCalls[i].start, this.drawCalls[i].count, this.drawCalls[i].start);
            for (var j = 0; j < this.levelOfDetail; j++) {
                var start = this.drawCalls[i].start / levelOfdetailMax + j * this.data.snapshots[this.data.currentSnapshotId].index.length / levelOfdetailMax;
                var count = this.drawCalls[i].count / levelOfdetailMax;
                this.pointCloud.geometry.addDrawCall(start, count, start);
            }
        }
    }

    this.drawCalls = null;

};

/**
 * Search for intersection between the mouse and the PointCloud
 * @param {THREE.Vector2} mouse - mouse coordinate in normalized screen space
 * @param {THREE.PerspectiveCamera} camera
 * @returns {*} An object with info about the intersected point
 */
SIMU.RenderableData.prototype.getIntersection = function(mouse, camera){
    if(this.isReady) {
        var target = null;

        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        var intersectedOctants = this.getIntersectedOctans(camera.position, raycaster.ray.direction);

        var i;
        var j = 0;

        this.pointCloud.geometry.offsets.length = this.pointCloud.geometry.drawcalls.length = 0;
        var levelOfdetailMax = this.data.levelOfDetailMax;


        while (j < intersectedOctants.length && target == null) {
            for (var k = 0; k < this.levelOfDetail; k++) {
                var start = Math.floor(intersectedOctants[j].start/levelOfdetailMax + k*this.data.snapshots[this.data.currentSnapshotId].index.length / levelOfdetailMax);
                var end = start + Math.ceil(intersectedOctants[j].count/levelOfdetailMax);

                this.pointCloud.geometry.addDrawCall(start, end - start, start);
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
            }
            j++;
        }
        return target;
    }else{
        return null;
    }
};

/**
 * Search for all the Octree's octant intersecting with the mouse, in order to help the global research for point intersection
 * @param origin
 * @param ray
 * @returns {Array} Array of all the intersected octant
 */
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



