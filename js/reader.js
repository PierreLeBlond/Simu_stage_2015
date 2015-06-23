/**
 * Created by lespingal on 12/06/15.
 */
/**
 * @author Arnaud Steinmetz <s.arnaud67@hotmail.fr>
 * @file In this example. The file is read by using the file API with ArrayBuffer which is a lot more effective than the precendent ways
 * @file Data that can be used is deparis files part
 * @file Data is rendered with a pointcloud with a BufferGeometry which is easier to understand for the GPU
 * @file This version renders the PointCloud and let the user modify time and speed of the animation
 *
 */

/**
 * @author Arnaud Steinmetz <s.arnaud67@hotmail.fr>
 *
 * @description Function that will define what to do when opening a file.
 * First it will each file in an asynchronous way.
 * endPosition reading a file, it creates the PointCloud with the given positions
 *
 */
function initFileReading() {
    // Checking for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        //var progress = document.getElementById('percent');
        /**
         * @author Arnaud Steinmetz <s.arnaud67@hotmail.fr>
         *
         * @description Function that will handle the loading of the given file
         * @param {Event} evt
         */
        function handleFileSelect(evt) {
            var files = evt.target.files;
            var nbFiles = files.length;

            App.clearPointCloud();

            App.timer.start();
            //Loop used to launch the reading of each file
            switch(App.type){
                case App.FileType.BIN :
                    for(var numFile = 0; numFile < nbFiles; numFile++)
                    {
                        readAdd(files, numFile);
                    }
                    break;
                case App.FileType.STRING :
                    break;
                case App.FileType.SKYBOT :
                    break;
                default :
                    break;
            }

            App.timer.stop("Chargement fichier");
        }
        //Setting the event change on the file input to launch the function handleFileSelect
        document.getElementById('files').addEventListener('change', handleFileSelect, false);

    } else {
        alert('The File APIs are not fully supported in this browser.');
    }
}

/**
 * @author Arnaud Steinmetz
 * @description Sets a reader for each file selected
 * @param {FileList} files - List of the file selected.
 * @param {int} numFile - Number of the file that is read.
 */
function readAdd(files, numFile)
{
    App.timer.start();
    var reader = new FileReader();
    var fileName = files[numFile].name;

    /**
     * @author Arnaud Steinmetz <s.arnaud67@hotmail.fr>
     * function that will manage the different kind of error that could happen when trying to read the file
     */
    reader.onerror = function (evt) {
        switch(evt.target.error.code) {
            case evt.target.error.NOT_FOUND_ERR:        //If the file isn't found
                alert('File Not Found!');
                break;
            case evt.target.error.NOT_READABLE_ERR:     //If the file isn't readable
                alert('File is not readable');
                break;
            case evt.target.error.ABORT_ERR:            //If something abort the file
                alert('Reading interrupted');
                break;
            default:
                alert('An error occurred reading this file.');
        };
    }
    /**
     * @author Arnaud Steinmetz <s.arnaud67@hotmail.fr>
     *
     * Function that will calculate the loading progression of our file
     * @param {ProgressEvent} evt
     */
    reader.onprogress = function(evt) {
        //console.log("Chargement du fichier " + fileName);

        /*if (evt.lengthComputable) {
         var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
         // Increase the progress bar length.
         if (percentLoaded < 100) {
         progress.style.width = percentLoaded + '%';
         progress.textContent = percentLoaded + '%';
         }
         }*/
    }

    /**
     * @author Arnaud Steinmetz <s.arnaud67@hotmail.fr>
     *
     * @description Function that will trigger if the reading mis aborted
     * @param {ProgressEvent} evt
     */
    reader.onabort = function(e) {
        alert('File read cancelled');
    };

    /**
     * @author Arnaud Steinmetz <s.arnaud67@hotmail.fr>
     *
     * @description Function that will be called when the reading begins
     * @param {loadstart} e
     */
    reader.onloadstart = function(e) {
        //Display the progression bar on the screen
        //document.getElementById('progress_bar').className = 'loading';
    };

    /**
     * @author Arnaud Steinmetz <s.arnaud67@hotmail.fr>
     *
     * @description Function that will be called if the file was loaded without any problem
     * @param {load} e
     */
    reader.onload = function(e) {

        //Ensure that the progress bar displays 100% at the end.
        /*progress.style.width = '100%';
         progress.textContent = '100%';
         setTimeout("document.getElementById('progress_bar').className='';", 2000);
         */
    };

    /**
     * @author Arnaud Steinmetz <s.arnaud67@hotmail.fr>
     *
     * @description Function that will be called at the end of the loading phase.
     * @description Reads the file by using arrayBuffer and fill the right array depending on the position
     * @description This part of the reading is blocking the other when it is running (running back on the main thread -> not asynchronous)
     * @param {loadend} evt
     *
     * /!\ TODO: check the file content before attempting to fill the array
     */
    reader.onloadend = function(evt) {
        var file = evt.target;
        var pointCloud;
        //Checking if the file has correctly been read
        if (file.readyState == FileReader.DONE) {
            /*
             The data contains a header with two values.
             One Int : that is the number of elements of the file
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


            if(first){
                for(var i = 0; i<nbElements;i++)
                {
                    var identifiant = array[8+i*10];
                    positionArray[identifiant*3]=currentPositionArray[identifiant*3]=array[2+i*10];
                    positionArray[identifiant*3+1]=currentPositionArray[identifiant*3+1]=array[3+i*10];
                    positionArray[identifiant*3+2]=currentPositionArray[identifiant*3+2]=array[4+i*10];
                }
            }
            else
            {
                for(var i = 0; i<nbElements;i++)
                {
                    var identifiant = array[8+i*10];
                    var x = array[2+i*10];
                    var y = array[3+i*10];
                    var z = array[4+i*10];

                    var dx = x-positionArray[identifiant*3];
                    var dy = y-positionArray[identifiant*3+1];
                    var dz = z-positionArray[identifiant*3+2];

                    //Correcting the vector direction for the elements going outside the box
                    //To be exact, you can check in the shader if the position goes outside the box, then you change it. Instead of doing that here.
                    if(dx > 0.5)
                    {
                        positionArray[identifiant*3]+=1;
                        dx = -(positionArray[identifiant*3]-x);
                    }
                    else if(dx < -0.5)
                    {
                        positionArray[identifiant*3]-=1;
                        dx = -(positionArray[identifiant*3]-x);
                    }


                    if(dy > 0.5)
                    {
                        positionArray[identifiant*3+1]+=1;
                        dy = -(positionArray[identifiant*3+1]-y);
                    }
                    else if(dy < -0.5)
                    {
                        positionArray[identifiant*3+1]-=1;
                        dy = -(positionArray[identifiant*3+1]-y);
                    }


                    if(dz > 0.5)
                    {
                        positionArray[identifiant*3+2]+=1;
                        dz = -(positionArray[identifiant*3+2]-z);
                    }
                    else if(dz < -0.5)
                    {
                        positionArray[identifiant*3+2]-=1;
                        dz = -(positionArray[identifiant*3+2]-z);
                    }

                    endPositionArray[identifiant*3]= dx;
                    endPositionArray[identifiant*3+1]= dy;
                    endPositionArray[identifiant*3+2]= dz;
                }
            }

            nbCloud++;

            //Checking if it's the last file reading
            if(nbCloud==files.length)
            {
                App.timer.stop("populating buffer");

                nbCloud = 0;

                //If it's not the first part file reading, then call loadData that will add the elements to the scene
                if(!first)
                {
                    App.timer.start();
                    loadData();
                    App.timer.stop("Load Data");
                }
                first = false;

            }


        }
        file = null;
    };
    // Read in the file as a ArrayBuffer.
    reader.readAsArrayBuffer(files[numFile]);
}

/**
 * @author Arnaud Steinmetz <s.arnaud67@hotmail.fr>
 *
 * @description Function that will define what to do when opening a file.
 * First it will each file in an asynchronous way.
 * After reading a file, it creates the PointCloud with the given positions
 *
 * /!\ TODO: check the file content before trying to create the PointCloud /!\
 */

function skybotReadAdd(files, numFile)
{
    var reader = new FileReader();
    var fileName = files[numFile].name;

    /**
     * @author Arnaud Steinmetz <s.arnaud67@hotmail.fr>
     * function that will manage the different kind of error that could happen when trying to read the file
     */
    reader.onerror = function (evt) {
        switch(evt.target.error.code) {
            case evt.target.error.NOT_FOUND_ERR:        //If the file isn't found
                alert('File Not Found!');
                break;
            case evt.target.error.NOT_READABLE_ERR:     //If the file isn't readable
                alert('File is not readable');
                break;
            case evt.target.error.ABORT_ERR:            //If something abort the file
                alert('Reading interrupted');
                break; // noop
            default:
                alert('An error occurred reading this file.');
        };
    }
    /**
     * @author Arnaud Steinmetz <s.arnaud67@hotmail.fr>
     *
     * Function that will calculate the loading progression of our file
     * @param {ProgressEvent} evt
     */
    reader.onprogress = function(evt) {
        //console.log("Chargement du fichier " + fileName);

        /*if (evt.lengthComputable) {
         var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
         // Increase the progress bar length.
         if (percentLoaded < 100) {
         progress.style.width = percentLoaded + '%';
         progress.textContent = percentLoaded + '%';
         }
         }*/
    }

    reader.onabort = function(e) {
        alert('File read cancelled');
    };

    reader.onloadstart = function(e) {
        d1 = Date.now();
        console.info("Déb de lecture de " + fileName +" à " + d1);
        //Display the progression bar on the screen
        //document.getElementById('progress_bar').className = 'loading';
    };
    reader.onload = function(e) {

        //Ensure that the progress bar displays 100% at the end.
        /*progress.style.width = '100%';
         progress.textContent = '100%';
         setTimeout("document.getElementById('progress_bar').className='';", 2000);
         */
    };

    reader.onloadend = function(evt) {
        var file = evt.target;
        var pointCloud;
        //Checking if the file has correctly been read
        if (file.readyState == FileReader.DONE) {
            var geometry = new THREE.BufferGeometry();

            var dataFile = file.result.split('\n');
            console.log(dataFile[1]);

            var lines = dataFile.length-1;

            var colors = new Float32Array(lines*3);
            var vertices = new Float32Array(lines*3);

            var info;
            for(var i = 1; i < lines;i++)
            {

                info = dataFile[i].split(',');

                //Setting the position in the buffer
                vertices[i*3]=parseFloat(info[1]);      //x
                vertices[i*3+1]=parseFloat(info[2]);    //y
                vertices[i*3+2]=parseFloat(info[3]);    //z*/

                colors[i*3]=1;
                colors[i*3+1]=0;
                colors[i*3+2]=1;

                /*if(info[10].includes("mb"))
                 {
                 colors[i*3]=1;
                 colors[i*3+1]=0;
                 colors[i*3+2]=0;
                 }else{
                 //Setting the color in the buffer

                 }*/

            }
            geometry.addAttribute('position' , new THREE.BufferAttribute( vertices, 3 ));
            geometry.addAttribute('color' , new THREE.BufferAttribute( colors, 3 ));


            pointCloud = new THREE.PointCloud(geometry, material);
            pointCloud.name = fileName;
            scene.add(pointCloud);

            pointClouds.push(pointCloud);

        }
    };
    // Read in the file as a binary string.
    // /!\ Possible better performance with Array buffer ?
    // /?\ Is it possible to directly use the buffer to create the PointCloud ?
    reader.readAsBinaryString(files[numFile]);
}
