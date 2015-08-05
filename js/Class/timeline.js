/**
 * Created by Nicolas Buecher on 22/07/15.
 */

/**
 * @namespace SIMU
 */
var SIMU = SIMU || {};

/**
 * Represents the timeline of the application
 *
 * @name Timeline
 * @class
 *
 * @property {number}   nbSnapshots         - Number of loaded snapshots and length of snapshots array
 * @property {array}    snapshots           - Array of SnapshotBreakpoint objects
 * @property {number}   currentSnapshot     - Index of the SnapshotBreakpoint currently picked
 * @property {HTML}     html                - HTML element of the timeline
 * @property {Cursor}   cursor              - Cursor object of the timeline
 * @property {number}   interval            - Number of pixels between each snapshot on the timeline (can be a float for computing)
 * @property {HTML}     playButton          - HTML element of the play button of the timeline
 *
 * @constructor
 */
SIMU.Timeline = function()
{
    this.nbSnapshots        = 0;
    this.snapshots          = [];
    this.currentSnapshot    = -1;
    this.html               = null;
    this.cursor             = null;
    this.interval           = 0;
    this.playButton         = null;
}

/**
 * Sets up the properties of Timeline creating the HTML & CSS elements
 *
 * @name Timeline#setup
 * @method
 */
SIMU.Timeline.prototype.setup = function()
{
    this.setCSS();

    this.html = document.createElement('ul');
    this.html.id = 'timeline';

    this.cursor = new SIMU.Cursor();
    this.cursor.setup();

    this.playButton = document.createElement('div');
    this.playButton.id = 'play-border';
    this.playButton.innerHTML = [
        '<div id=\"play-button\"></div>'
    ].join('');

    this.html.appendChild(this.cursor.html);
    this.html.appendChild(this.playButton);
}

/**
 * Creates and adds a snapshot breakpoint on the timeline and allows cursor dragging when the second breakpoint is created
 *
 * @name Timeline#addSnapshot
 * @method
 */
SIMU.Timeline.prototype.addSnapshot = function()
{
    /* Création d'un nouvel objet SnapshotBreakpoint */
    var snapshot = new SIMU.SnapshotBreakpoint(this.nbSnapshots);

    /* Ajout de l'élément HTML du snapshot au DOM */
    this.html.appendChild(snapshot.html);

    /* Stockage du snapshot dans le tableau snapshots */
    this.snapshots.push(snapshot);

    /* Stockage du nombre de snapshots chargés */
    this.nbSnapshots = this.snapshots.length;

    /* Repositionnement des snapshots sur la timeline */
    this.replaceSnapshots();

    // Repositionnement du curseur sur le nouveau snapshot automatiquement sélectionné */
    this.moveCursorOnSnapshot(snapshot);

    // Si on a plus d'un snapshot, on active la navigation sur la timeline */
    if ( this.nbSnapshots == 2 )
    {
        this.cursor.allowDragging();
    }
}

/**
 * Computes and sets the new position of all snapshots and updates interval property
 *
 * @name Timeline#replaceSnapshots
 * @method
 */
SIMU.Timeline.prototype.replaceSnapshots = function()
{
    switch (this.nbSnapshots)
    {
        case 0:             // Aucun snapshot, on ne fait rien
            break;
        case 1:             // Un snapshot, on le place au début de la timeline
            this.replaceSnapshot(0, 0);
            break;
        default:            // Au moins deux snapshots, on calcule le pas entre chaque snapshot et on appelle replaceSnapshot pour chacun d'entre eux.
            var step = 100 / (this.nbSnapshots - 1);
            this.setInterval(step);
            for (var i = 0; i < this.nbSnapshots; i++)
            {
                this.replaceSnapshot(i, step);
            }
            break;
    }
}

/**
 * Computes and sets the new position of the snapshot breakpoint of index 'i'
 *
 * @name Timeline#replaceSnapshot
 * @method
 *
 * @param {number}      i       - Index of the snapshot to replace
 * @param {number}      step    - Number of pixels between each snapshot breakpoint on the timeline (can be a float for computing)
 */
SIMU.Timeline.prototype.replaceSnapshot = function(i, step)
{
    this.snapshots[i].setOffset(i*step + '%');
}

/**
 * Moves the cursor on the snapshot breakpoint 'snap'
 *
 * @name Timeline#moveCursorOnSnapshot
 * @method
 *
 * @param {SnapshotBreakpoint}  snap    - References the snapshot breakpoint object on which move the cursor
 */
SIMU.Timeline.prototype.moveCursorOnSnapshot = function(snap)
{
    this.cursor.setOffset(snap.getOffset() - 10);
}

/**
 * Updates currentSnapshot property with 'id'
 *
 * @name Timeline#setCurrentSnapshotId
 * @method
 *
 * @param {number}     id      - Index of the new current snapshot breakpoint
 */
SIMU.Timeline.prototype.setCurrentSnapshotId = function(id)
{
    this.currentSnapshot = id;
}

/**
 * Updates the current snapshot and moves cursor on it
 *
 * @name Timeline#changeCurrentSnapshot
 * @method
 *
 * @param {number}     id      - Index of the new current snapshot breakpoint
 */
SIMU.Timeline.prototype.changeCurrentSnapshot = function(id)
{
    var snap = this.getSnapById(id);
    this.moveCursorOnSnapshot(snap);
    this.setCurrentSnapshotId(id);
}

/**
 * Returns the SnapshotBreakpoint object referenced by 'id'
 *
 * @name Timeline#getSnapById
 * @method
 *
 * @param   {number}        id      - Index of the snapshot breakpoint to get
 * @returns {SnapshotBreakpoint}
 */
SIMU.Timeline.prototype.getSnapById = function(id)
{
    return this.snapshots[id];
}

/**
 * Computes and updates cursor position during animation
 *
 * @name Timeline#animate
 * @method
 *
 * @param {number}       t       - Time which represents where is the animation between two snapshots
 */
SIMU.Timeline.prototype.animate = function(t)
{
    var position = t * this.interval;

    this.cursor.setOffset(this.getSnapById(this.currentSnapshot).getOffset() + position -10);
}

/**
 * Computes and updates the interval property with 'step' value
 *
 * @name Timeline#setInterval
 * @method
 *
 * @param {number}   step    - Distance in pixels between each snapshot breakpoint (can be a float for computing)
 */
SIMU.Timeline.prototype.setInterval = function(step)
{
    this.interval = ( step * this.html.offsetWidth ) / 100;
}

/**
 * Looks for the current snapshot breakpoint based on the position of the cursor and returns its index
 *
 * @name Timeline#lookForCurrentSnapshot
 * @method
 *
 * @returns {number}
 */
SIMU.Timeline.prototype.lookForCurrentSnapshot = function()
{
    /* Initialisation de la valeur de retour à son cas d'erreur */
    var result = -1;

    /* Position du curseur par rapport à la timeline */
    var cursorPosition = this.cursor.getOffset() + 10;

    /* Si le curseur se situe à la fin de la timeline, alors le snapshot courant est le dernier */
    if ( cursorPosition == this.html.offsetWidth )
    {
        result = this.nbSnapshots - 1;
    }
    /* Sinon, on boucle sur les positions des snapshots pour déterminer celui qui est le plus proche du curseur (sur sa gauche) */
    else
    {
        for (var i = 0; i < this.nbSnapshots - 1; i++)
        {
            var snapPosition = Math.floor(i*this.interval);

            if (cursorPosition >= snapPosition)
            {
                result = i;
            }
        }
    }

    return result;
}

/**
 * Updates id of playButton HTML element to display a play button
 *
 * @name Timeline#setPlayButton
 * @method
 */
SIMU.Timeline.prototype.setPlayButton = function()
{
    this.playButton.firstElementChild.id = 'play-button';
}

/**
 * Updates id of playButton HTML element to display a stop button
 *
 * @name Timeline#setStopButton
 * @method
 */
SIMU.Timeline.prototype.setStopButton = function()
{
    this.playButton.firstElementChild.id = 'stop-button';
}

/**
 * Represents the cursor of the timeline
 *
 * @name Cursor
 * @class
 *
 * @property {HTML}    html                        - HTML element of the cursor
 * @property {number}  cursorOffsetOrigin          - Position (left offset in pixels) of the cursor before any drag
 * @property {boolean} isMoving                    - If the cursor is currently dragged or not
 * @property {number}  mouseOffsetOrigin           - Position (left offset in pixels) of the mouse click before any drag
 * @property {event}   dragCursorEvent             - Event of type 'mousedown'
 * @property {event}   stopDraggingEvent           - Event of type 'mouseup'
 * @property {boolean} positionHasToBeComputed     - If the cursor just moved and its position needs to be computed or not
 *
 * @constructor
 */
SIMU.Cursor = function()
{
    this.html                       = null;
    this.cursorOffsetOrigin         = 0;
    this.isMoving                   = false;
    this.mouseOffsetOrigin          = 0;
    this.dragCursorEvent            = null;
    this.stopDraggingEvent          = null;
    this.positionHasToBeComputed    = false;
}

/**
 * Sets up the properties of SnapshotBreakpoint creating the HTML & CSS elements
 *
 * @name Cursor#setup
 * @method
 */
SIMU.Cursor.prototype.setup = function()
{
    this.setCSS();

    this.html = document.createElement('div');
    this.html.id = 'cursor';
    this.html.innerHTML = [
        '<div id=\"cursor-head\">',
        '    <div id=\"cursor-hair-top-left\" class=\"cursor-hair\"></div>',
        '    <div id=\"cursor-hair-top-right\" class=\"cursor-hair\"></div>',
        '    <div id=\"cursor-hair-bottom-left\" class=\"cursor-hair\"></div>',
        '    <div id=\"cursor-hair-bottom-right\" class=\"cursor-hair\"></div>',
        '</div>',
    ].join('');
}

/**
 * Adds the event which controls the possibility to drag the cursor on the HTML element
 *
 * @name Cursor#allowDragging
 * @method
 */
SIMU.Cursor.prototype.allowDragging = function()
{
    this.dragCursorEvent = this.dragCursor.bind(this);
    this.html.addEventListener('mousedown', this.dragCursorEvent, false);
}

/**
 * Removes the event wich controls the possibility to drag the cursor on the HTML element
 *
 * @name Cursor#removeDragging
 * @method
 */
SIMU.Cursor.prototype.removeDragging = function()
{
    this.html.removeEventListener('mousedown', this.dragCursorEvent);
}

/**
 * Removes events used when the cursor is moving and updates the isMoving property
 *
 * @name Cursor#stopDragging
 * @method
 */
SIMU.Cursor.prototype.stopDragging = function()
{
    this.isMoving = false;
    document.removeEventListener('mousemove', this.moveCursor);
    document.removeEventListener('mouseup', this.stopDraggingEvent);
}

/**
 * Starts the cursor move initializing all the needed values, prevents default behaviour and adds events which control the move of the cursor
 *
 * @name Cursor#dragCursor
 * @method
 *
 * @param {event}   e       - Event of type 'mousedown'
 */
SIMU.Cursor.prototype.dragCursor = function(e)
{
    /* Récupération de l'événement avec compatibilité IE */
    var evtobj = window.event ? window.event : e;

    /* Désactivation de l'apparition du menu contextuel lors du clic droit */
    if ( evtobj.preventDefault )
    {
        evtobj.preventDefault();
    }

    /* Après déplacement, il faudra calculer la position du curseur */
    this.positionHasToBeComputed = true;

    /* Stockage de la position d'origine du curseur */
    this.cursorOffsetOrigin = this.html.offsetLeft;

    /* Activation du déplacement du curseur */
    this.isMoving = true;

    /* Stockage de la position d'origine de la souris */
    this.mouseOffsetOrigin = evtobj.clientX;

    /* Ajout de l'événement de déplacement du curseur au déplacement de la souris sur le DOM */
    document.addEventListener('mousemove', this.moveCursor.bind(this), false);

    /* Ajout de l'événement d'arrêt du daplacement du curseur lors du relaĉhement de la souris au DOM */
    this.stopDraggingEvent = this.stopDragging.bind(this);
    document.addEventListener('mouseup', this.stopDraggingEvent, false);
}

/**
 * Moves the cursor on each mouse move
 *
 * @name Cursor#moveCursor
 * @method
 *
 * @param {event}   e       - Event of type 'mousemove'
 */
SIMU.Cursor.prototype.moveCursor = function(e)
{
    /* Récupération de l'événement avec compatibilité IE */
    var evtobj = window.event ? window.event : e;

    /* Si le déplacement du curseur est activé */
    if (this.isMoving)
    {
        /* Calcul de la nouvelle position du curseur */
        var newPosition = this.cursorOffsetOrigin + evtobj.clientX - this.mouseOffsetOrigin;

        /* Si la nouvelle position du curseur se situe encore dans les limites de la timeline, on affecte cette nouvelle position */
        if ( newPosition >= -10 && newPosition <= document.getElementById('timeline').offsetWidth - 10)
        {
            this.setOffset(newPosition);
        }
    }
}

/**
 * Updates the cursor position
 *
 * @name Cursor#setOffset
 * @method
 *
 * @param {number}      offset      - Position (left offset in pixels) of the cursor to set
 */
SIMU.Cursor.prototype.setOffset = function(offset)
{
    this.html.style.left = offset + "px";
}

/**
 * Returns the position (left offset) of the cursor
 *
 * @name Cursor#getOffset
 * @method
 *
 * @returns {number}
 */
SIMU.Cursor.prototype.getOffset = function()
{
    return this.html.offsetLeft;
}

/**
 * Represents a snapshot breakpoint on the timeline. You need to provide an index to create it.
 *
 * @name SnapshotBreakpoint
 * @class
 *
 * @property {HTML}     html        - HTML element of the snapshot breakpoint
 *
 * @param {number}      id          - Index of the new snapshot
 *
 * @constructor
 */
SIMU.SnapshotBreakpoint = function(id)
{
    this.html = document.createElement('li');
    this.html.className = 'snapshot';

    var breakpoint = document.createElement('span');
    breakpoint.className = 'breakpoint';
    var label = document.createElement('span');
    label.className = 'label-snapshot';

    this.html.appendChild(breakpoint);
    this.html.appendChild(label);

    this.setId(id);
}

/**
 * Returns the id of the HTML element of the snapshot breakpoint. The id looks like 'snap-$id'
 *
 * @name SnapshotBreakpoint#getId
 * @method
 *
 * @returns {string}
 */
SIMU.SnapshotBreakpoint.prototype.getId = function()
{
    return this.html.id;
}

/**
 * Updates id of the HTML element of the snapshot breakpoint and updates id of the child with only the index
 *
 * @name SnapshotBreakpoint#setId
 * @method
 *
 * @param {number}      id      - Index to set to the snapshot breakpoint
 */
SIMU.SnapshotBreakpoint.prototype.setId = function(id)
{
    this.html.id = 'snap-' + id;
    this.html.firstElementChild.id = id;
}

/**
 * Returns the position (left offset) of the snapshot breakpoint
 *
 * @name SnapshotBreakpoint#getOffset
 * @method
 *
 * @returns {number}
 */
SIMU.SnapshotBreakpoint.prototype.getOffset = function()
{
    return this.html.offsetLeft;
}

/** Creates CSS elements and appends them to DOM
 *
 * @name Timeline#setCSS
 * @method
 */
SIMU.Timeline.prototype.setCSS = function()
{
    var css = document.createElement('style');

    css.innerHTML = [
        '/* Style de la timeline et des breakpoints*/\n',
        '\n',
        '#timeline {\n',
        '   display: table;\n',
        '   list-style: none;\n',
        '   position:absolute;\n',
        '   width: 20%;\n',
        '   left: 40%;\n',
        '   height: 8px;\n',
        '   top: 90%;\n',
        '   background-color: #eee;\n',
        '   border-radius: 4px 4px 4px 4px;\n',
        '}\n',
        '\n',
        '.snapshot {\n',
        '   display: table-cell;\n',
        '   position: absolute;\n',
        '   width: 10px;\n',
        '   height: 14px;\n',
        '   cursor: pointer;\n',
        '}\n',
        '\n',
        '.breakpoint {\n',
        '   display: block;\n',
        '   position: absolute;\n',
        '   width: 10px\n;',
        '   height: 10px;\n',
        '   left: -10px;\n',
        '   top: -6px;\n',
        '   border: 5px solid #eee;\n',
        '   border-radius: 50%;\n',
        '   background-color: green;\n',
        '}\n',
        '\n',
        '#play-border {\n',
        '   position: absolute;\n',
        '   width: 26px;\n',
        '   height: 26px;\n',
        '   left: -20%;\n',
        '   top: -11px;\n',
        '   background-color: #eee;\n',
        '   border: 2px solid rgba(0,0,0,0.7);\n',
        '   -webkit-border-radius: 100%;\n',
        '   -moz-border-radius: 100%;\n',
        '   border-radius: 100%;\n',
        '   -webkit-transition: all 0.5s ease;\n',
        '   -moz-transition: all 0.5s ease;\n',
        '   -o-transition: all 0.5s ease;\n',
        '   -ms-transition: all 0.5s ease;\n',
        '   transition: all 0.5s ease;\n',
        '   cursor: pointer;\n',
        '}\n',
        '\n',
        '#play-border:hover {\n',
        '   border-color: transparent;\n',
        '}\n',
        '\n',
        '#play-border:hover #play-button {\n',
        '   border-left: 8px solid rgba(0,0,0,0.5);\n',
        '}\n',
        '\n',
        '#play-border:hover #stop-button {\n',
        '   border-left: 4px solid rgba(0,0,0,0.5);\n',
        '   border-right: 4px solid rgba(0,0,0,0.5);\n',
        '}\n',
        '\n',
        '#play-button {\n',
        '   position:relative;\n',
        '   top: 5px;\n',
        '   left: 10px\n;',
        '   width: 0;\n',
        '   height: 0;\n',
        '   border-top: 8px solid transparent;\n',
        '   border-bottom: 8px solid transparent;\n',
        '   border-left: 8px solid rgba(0,0,0,0.8);\n',
        '}\n',
        '\n',
        '#stop-button {\n',
        '   position: relative;\n',
        '   top: 6px;\n',
        '   left: 7px;\n',
        '   width: 4px;\n',
        '   height: 14px;\n',
        '   border-left: 4px solid rgba(0,0,0,0.8);\n',
        '   border-right: 4px solid rgba(0,0,0,0.8);\n',
        '}\n'
    ].join('');

    document.head.appendChild(css);
}

/** Creates CSS elements and appends them to DOM
 *
 * @name Cursor#setCSS
 * @method
 */
SIMU.Cursor.prototype.setCSS = function()
{
    var css = document.createElement('style');

    css.innerHTML = [
        '/* Style du curseur */',
        '',
        '#cursor {',
        '   display: block;',
        '   position: absolute;',
        '   width: 20px;',
        '   left: -10px;',
        '   height: 20px;',
        '   top: -6px;',
        '   background-color: rgba(255,255,255,0);',
        '   cursor: move;',
        '   z-index: 1;',
        '}',
        '',
        '#cursor-head {',
        '   display: block;',
        '   position: absolute;',
        '   width: 10px;',
        '   height: 10px;',
        '   border: 5px solid #eee;',
        '   border-radius: 50%;',
        '   background-color: red;',
        '}',
        '',
        '.cursor-hair {',
        '   position: absolute;',
        '   width: 10px;',
        '   height: 5px;',
        '   border-radius: 50%;',
        '}',
        '',
        '#cursor-hair-top-left {',
        '   border-top: 3px solid #eee;',
        '   border-left: 3px solid #eee;',
        '   top: -10px;',
        '   left: -10px;',
        '}',
        '',
        '#cursor-hair-top-right {',
        '   border-top: 3px solid #eee;',
        '   border-right: 3px solid #eee;',
        '   top: -10px;',
        '   right: -10px;',
        '}',
        '',
        '#cursor-hair-bottom-left {',
        '   border-bottom: 3px solid #eee;',
        '   border-left: 3px solid #eee;',
        '   bottom: -10px;',
        '   left: -10px;',
        '}',
        '',
        '#cursor-hair-bottom-right {',
        '   border-bottom: 3px solid #eee;',
        '   border-right: 3px solid #eee;',
        '   bottom: -10px;',
        '   right: -10px;',
        '}'
    ].join('\n');

    document.head.appendChild(css);
}

/**
 * Updates the position (left offset) of the snapshot breakpoint
 *
 * @name SnapshotBreakpoint#setOffset
 * @method
 *
 * @param {string}      offset      - Position (left offset) of the snapshot breakpoint to set (should be in %)
 * @todo Useless method : to delete ? (Position of snapshot is in %, not in pixels)
 */
SIMU.SnapshotBreakpoint.prototype.setOffset = function(offset)
{
    this.html.style.left = offset;
}

/**
 * Returns the index included in the id of the HTML element of the snapshot breakpoint
 *
 * @name SnapshotBreakpoint#getIdNumber
 * @method
 *
 * @returns {number}
 * @todo : This method is not used : to delete ?
 */
SIMU.SnapshotBreakpoint.prototype.getIdNumber = function()
{
    var result = -1;

    if ( !isNaN( parseInt( this.getId().substr( 5 ) ) ) )
    {
        result = parseInt( this.getId().substr( 5 ) );
    }

    return result;
}

/* Fonction removeSnapshot
 *
 *  Paramètres :
 *   e       : événement correspondant normalement à un événement de type contextmenu
 *   snap    : objet SnapshotBreakpoint correspondant au snapshot à supprimer
 *
 *  Retourne : null
 *
 *  Cette fonction a pour but de supprimer un snapshot de la timeline.
 *  Elle permettra également :
 *  - D'empêcher le menu contextuel d'apparaître lors du clic droit
 *  - De réattribuer les ids des snapshots
 *  - De mettre à jour le tableau snapshots
 *  - De tester l'interdiction de dragging du curseur
 *
 *  TODO : Le test de current Snapshot est-il toujours pertinent ?
 *  TODO : Est-ce que chaque partie de cette fonction ne devrait pas être une fonction en soi ?
 *  TODO : Suppression de cette fonction si jamais utilisée.
 *
 SIMU.Timeline.prototype.removeSnapshot = function(e, snap)
 {
 /* Récupération de l'événement avec compatibilité IE
 var evtobj = window.event ? window.event : e;

 /* Désactivation de l'apparition du menu contextuel lors du clic droit
 if ( evtobj.preventDefault )
 {
 evtobj.preventDefault();
 }

 /* Récpération de l'id du snapshot
 var id = snap.getIdNumber();

 /* Suppression de l'élément HTML du snapshot du DOM
 this.html.removeChild(snap.html);

 /* Boucle sur le tableau de snapshots pour décaler les objets de un afin d'écraser le snapshot à supprimer et réattribution des ids
 for ( var i = id; i < this.nbSnapshots - 1; i++ )
 {
 this.snapshots[i] = this.snapshots[i+1];
 this.snapshots[i].setId(i);
 }

 /* Elimination du dernier élément du tableau snapshots
 this.snapshots.pop();

 /* Réaffectation du nombre de snapshots
 this.nbSnapshots = this.snapshots.length;

 /* Repositionnement des snapshots sur la timeline
 this.replaceSnapshots();

 /* Si le snapshot supprimé était celui sélectionné, on affecte 'undefined' à currentSnapshot
 if (this.currentSnapshot == id)
 {
 this.currentSnapshot = 'undefined';
 }
 /* Sinon, s'il était à une position inférieure au snapshot sélectionné, on réttribue le bon id à currentSnapshot
 else if (this.currentSnapshot > id)
 {
 this.currentSnapshot -= 1;
 }

 /* Si un snapshot est encore sélectionné, on repositionne le curseur sur celui-ci
 if (this.currentSnapshot !== 'undefined')
 {
 this.cursor.setOffset(this.snapshots[this.currentSnapshot].getOffset() - 10);
 }

 /* S'il ne reste plus qu'un snapshot, on désactive la navigation sur la timeline et on replace le curseur sur le snapshot restant
 if ( this.nbSnapshots == 1 )
 {
 this.cursor.removeDragging();
 this.moveCursorOnSnapshot(this.snapshots[this.nbSnapshots - 1]);
 }
 }*/