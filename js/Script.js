/**
 * Created by lespingal on 15/07/15.
 * pierre.lespingal@gmail.com
 */

/**
 *  Global namespace
 *  @namespace
 */
SIMU = SIMU || {};

/**
 * Represent a script used to load data from files
 * @constructor
 *
 * @property {String} name                  - name of the script
 * @property {function} script              - the script itself /!\ The script will be given the result attribute of File object.
 * The script MUST return an array of object as followed : [{name:"index", value:<index buffer>}, {name:"position", value:<position buffer>}, {name:"color", value:<color buffer>}, {name:"additional data", value:<additional data buffer>}, ...]
 * where "index" & "position" are mandatory, the rest is optional
 * @property {boolean} binary               - True if the file should be read with the readAsArrayBuffer function, else readAsBinaryString will be used
 */
SIMU.Script = function(){
    this.name = "";
    this.script = function(file){console.log("default script, usage : function(file), return [{name:\"index\", value:X}, {name:\"position\", value:Y}, {name:\"color\", value:Z}, ...]")};
    this.binary = true;
};

/**
 * @description Add a new script for loading file
 * @detail for the moment, must be used before calling setGui method on SIMU object, or the new script won't be available in the menu
 * @param name
 * @param script
 * @param binary
 */
SIMU.addScript = function(name, script, binary){
    var myScript = new SIMU.Script();
    SIMU.scripts.push(myScript);
    myScript.name = name;
    myScript.script = script;
    myScript.binary = binary;
};

var part = "part";
var partScript = function(result){
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
    var array = new Float32Array(result);

    var nbElements = (array.length-2)/10;

    var position = new Float32Array(nbElements*3);

    var speed = new Float32Array(nbElements*3);

    var masse = new Float32Array(nbElements);

    var epot = new Float32Array(nbElements);

    var ekin = new Float32Array(nbElements);

    var index = new Float32Array(nbElements);

    for(var i = 0; i<nbElements;i++)
    {
        index[i] = array[8 + i * 10];
        position[i * 3] = array[2 + i * 10];
        position[i * 3 + 1] = array[3 + i * 10];
        position[i * 3 + 2] = array[4 + i * 10];
        speed[i * 3] = array[5 + i * 10];
        speed[i * 3 + 1] = array[6 + i * 10];
        speed[i * 3 + 2] = array[7 + i * 10];
        masse[i] = array[9 + i * 10];
        epot[i] = array[10 + i * 10];
        ekin[i] = array[11 + i * 10];

    }

    array = null;

    return [{name : "index", value : index}, {name : "position", value : position},
        //{name : "speed", value : speed},
        {name : "masse", value : masse},
        {name : "epot", value : epot},
        {name : "ekin", value : ekin}];
};

var star = "star";
var starScript = function(result){
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
    var array = new Float32Array(result);

    var nbElements = (array.length-2)/11;

    var position = new Float32Array(nbElements*3);

    var speed = new Float32Array(nbElements*3);

    var masse = new Float32Array(nbElements);

    var epot = new Float32Array(nbElements);

    var ekin = new Float32Array(nbElements);

    var age = new Float32Array(nbElements);

    var index = new Float32Array(nbElements);
    for(var i = 0; i<nbElements;i++)
    {
        index[i] = array[8+i*11];
        position[i*3]=array[2+i*11];
        position[i*3+1]=array[3+i*11];
        position[i*3+2]=array[4+i*11];
        speed[i*3]=array[5+i*11];
        speed[i*3+1]=array[6+i*11];
        speed[i*3+2]=array[7+i*11];
        masse[i]=array[9+i*11];
        epot[i]=array[10+i*11];
        ekin[i]=array[11+i*11];
        age[i]=array[12+i*11];
    }

    array = null;

    return [{name : "index", value : index}, {name : "position", value : position},
        //{name : "speed", value : speed},
        {name : "masse", value : masse},
        {name : "epot", value : epot},
        {name : "ekin", value : ekin},
        {name : "age", value : age}];
};

var schaaff = "Schaaff script";
var schaaffScript = function(result){

    var data = result.split('\n');

    var lines = data.length-3; //because of an empty line at the end of the data + two useless

    var vertices = new Float32Array(lines*3);
    var index = new Float32Array(lines);
    var colors = new Float32Array(lines*3);
    var masse = new Float32Array(lines);
    var age = new Float32Array(lines);

    var oldest = -1;

    var i;
    var info;


    //Determine max age of the input stars
    //Need to be place directly in the files
    for (i = 0; i<lines;i++){
        info = data[i+2].trim().split('  ');

        //Determine max age of the input stars
        var compare = age[i] = parseFloat(info[5]);

        if(oldest<compare)
        {
            oldest=compare;
        }
    }

    for (i = 0; i<lines;i++){
        //Separating the different informations in the
        info = data[i+2].trim().split('  ');

        index[i] = info[0];
        masse[i] = parseFloat(info[1]);
        //Setting the position in the buffer
        vertices[i*3]=parseFloat(info[2]);      //x
        vertices[i*3+1]=parseFloat(info[3]);    //y
        vertices[i*3+2]=parseFloat(info[4]);    //z

        //Setting the color in the buffer
        colors[i*3]=1+Math.log10((oldest/10+parseFloat(info[5]))/(oldest/10+oldest));
        colors[i*3+1]=0;
        colors[i*3+2]=-Math.log10((oldest/10+parseFloat(info[5]))/(oldest/10+oldest));
    }

    return [{name:"index", value:index}, {name:"position", value:vertices}, {name:"color", value:colors},
        {name:"age", value:age},
        {name:"masse", value:masse}];

};