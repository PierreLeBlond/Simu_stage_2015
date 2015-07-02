/**
 * Created by lespingal on 26/06/15.
 */

var name = "Deparis script";
var script = function(result){
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

    var index = new Float32Array(nbElements);
    for(var i = 0; i<nbElements;i++)
    {
        index[i] = array[8+i*10];
        position[i*3]=array[2+i*10];
        position[i*3+1]=array[3+i*10];
        position[i*3+2]=array[4+i*10];
    }

    array = null;

    return [{name : "index", value : index}, {name : "position", value : position}];
};

var name2 = "Schaaff script";
var script2 = function(result){

        var data = result.split('\n');

        var lines = data.length-3; //because of an empty line at the end of the data + two useless

        var vertices = new Float32Array(lines*3);
        var index = new Float32Array(lines);
        var colors = new Float32Array(lines*3);

        var oldest = -1;

        var i;
        var info;


        //Determine max age of the input stars
        //Need to be place directly in the files
        for (i = 0; i<lines;i++){
            info = data[i+2].trim().split('  ');

            //Determine max age of the input stars
            var compare = parseFloat(info[5]);

            if(oldest<compare)
            {
                oldest=compare;
            }
        }

        for (i = 0; i<lines;i++){
            //Separating the different informations in the
            info = data[i+2].trim().split('  ');

            index[i] = info[0];
            //Setting the position in the buffer
            vertices[i*3]=parseFloat(info[2]);      //x
            vertices[i*3+1]=parseFloat(info[3]);    //y
            vertices[i*3+2]=parseFloat(info[4]);    //z

            //Setting the color in the buffer
            colors[i*3]=1+Math.log10((oldest/10+parseFloat(info[5]))/(oldest/10+oldest));
            colors[i*3+1]=0;
            colors[i*3+2]=-Math.log10((oldest/10+parseFloat(info[5]))/(oldest/10+oldest));
        }

        return [{name:"index", value:index}, {name:"position", value:vertices}, {name:"color", value:colors}];

};