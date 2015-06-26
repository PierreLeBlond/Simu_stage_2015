/**
 * Created by lespingal on 26/06/15.
 */

var name = "Deparis script";
var script = function(file){
    /*
     The data contains a header with two values.
     One Int : that is the number of elements in the file
     One float : I don't know what he stands for

     the data is stored as float following this pattern for each element
     pos 0 1 2
     vit 3 4 5
     ident 6
     masse 7
     epot 8
     ekin 9

     So if you wanna access this data don't forget to specify +2 to avoid picking the header infos
     */
    var array = new Float32Array(file.result);

    var nbElements = (array.length-2)/10;

    var position = new Float32Array(nbElements*3);

    var index = new Float32Array(nbElements);
    for(var i = 0; i<nbElements;i++)
    {
        index[i] = array[8+i*10];
        position[i*3]=array[2+i*10];
        position[i*3+1]=array[3+i*10];
        position[i*3+2]=array[4+i*10];
    }

    file = null;
    array = null;

    return [{name : "index", value : index}, {name : "position", value : position}];
};

var name2 = "Schaaff script";
var script2 = function(file){
    if (file.readyState == FileReader.DONE) {

        var data = file.result.split('\n');

        var lines = data.length-3; //because of an empty line at the end of the data + two useless
        //var geometry = new THREE.BufferGeometry();

        var vertices = new Float32Array(lines*3);
        var index = new Float32Array(lines);
        var colors = new Float32Array(lines*3);

        var oldest = -1;

        //Determine max age of the input stars
        //Need to be place directly in the files
        for (var i = 0; i<lines;i++){
            var info = data[i+2].trim().split('  ');

            //Determine max age of the input stars
            var compare = parseFloat(info[5]);

            if(oldest<compare)
            {
                oldest=compare;
            }
        }

        //storedData[fileName] = []; //Cleaning the stored data

        var info;
        for (var i = 0; i<lines;i++){
            //Separating the different informations in the
            info = data[i+2].trim().split('  ');

            index[i] = parseInt(info[1]);
            //Setting the position in the buffer
            vertices[i*3]=parseFloat(info[2]);      //x
            vertices[i*3+1]=parseFloat(info[3]);    //y
            vertices[i*3+2]=parseFloat(info[4]);    //z

            //Should check if it would be more efficient if we read directly in the file instead of storing the data
            //storedData[fileName][i] = [info[0],info[1],info[5]];

            //Setting the color in the buffer
            colors[i*3]=1+Math.log10((oldest/10+parseFloat(info[5]))/(oldest/10+oldest));
            colors[i*3+1]=0;
            colors[i*3+2]=-Math.log10((oldest/10+parseFloat(info[5]))/(oldest/10+oldest));
        }

        return [{name:"index", value:index}, {name:"position", value:vertices}/*, {name:"color", value:colors}*/];

        /*geometry.addAttribute('position' , new THREE.BufferAttribute( vertices, 3 ));
        geometry.addAttribute('color' , new THREE.BufferAttribute( colors, 3 ));
        geometry.computeBoundingSphere();

        pointCloud = new THREE.PointCloud(geometry, material);
        pointCloud.name = fileName;
        scene.add(pointCloud);

        pointClouds.push(pointCloud);

        //Debug
        d3 = Date.now();
        console.info("Fin de l'ajout de " + fileName + " à " + d3)

        var nbCloud = pointClouds.length
        if(nbCloud==files.length)
        {
            //console.log(storedData["star_00012"][0]);
            var nbElementsRendered = 0;
            var iteration = nbCloud+1;
            for(var i = 1; i < iteration; i++)
            {
                //nbElementsRendered+= scene.children[i].geometry.vertices.length;
                nbElementsRendered+= scene.children[i].geometry.attributes.position.array.length/3;
            }
            console.log("Number if elements in the scene : "+ nbElementsRendered);
            var x = d3-d0;
            console.log("Temps écoulé " + x);
        }
    }*/
}
    file = null;

};