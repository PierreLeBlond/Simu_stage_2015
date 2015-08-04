/**
 * Created by buecher on 22/07/15.
 */

/* Espace de nom */
var SIMU = SIMU || {};

/* Classe Timeline
*
*  nbSnapshots              : entier correspondant au nombre de snapshots actuellement chargés, soit la taille du tableau snapshots
*  snapshots                : tableau contenant les références aux objets SnapshotBreakpoint actuellement chargés
*  currentSnapshot          : entier correspondant à l'id du snapshot actuellement sélectionné
*  html                     : élement HTML correspondant à la timeline qui englobe également le curseur, les différents snapshots et le bouton play/stop
*  cursor                   : objet correspondant au curseur de la timeline
*  interval                 : réel correspondant au nombre de pixels entre chaque snapshot sur la timeline
*  playButton               : élément HTML correspondant au bouton play/stop
*
*  La classe Timeline a pour but de gérer les différents événements menant à changer son aspect visuel :
*  - L'ajout d'un snapshot
*  - La suppression d'un snapshot
*  - Le positionnement proportionnel des snapshots
*  - La sélection d'un snapshot
*
*  Elle permet de gérer l'affectation des ids de snapshot, d'autoriser ou d'interdire le dragging du curseur
*  et en règle générale de superviser les actions apportées sur les snapshots et le curseur.
*
*  Note : Certains tests comme l'autorisation de dragging ne semblent pas être à leur place.
*  Note : Penser à calculer la position du curseur en fonction du nombre de snapshots afin que cette fonction soit réutilisée dans Simu pour binder avec le temps.
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

/* Fonction setup
 *
    * Paramètres : null
* Retourne : null
*
* Cette fonction a pour but d'initialiser les paramètres de Timeline et d'appliquer ses éléments HTML au DOM.
* Elle fait également appel à la fonction setCSS afin d'appliquer le CSS.
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

/* Fonction addSnapshot
*
*  Paramètres : null
*  Retourne : null
*
*  Cette fonction a pour but d'ajouter un snapshot sur la timeline.
*  Elle permettra également :
*  - d'ajouter le snapshot au tableau de snapshots
*  - de créer l'événement de suppression de snapshot relié au snapshot
*  - de tester l'autorisation de dragging du curseur
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

    /* Si un snapshot est actuellement sélectionné, on repositionne le curseur sur celui-ci
    if (this.currentSnapshot !== 'undefined')
    {
        this.cursor.setOffset(this.snapshots[this.currentSnapshot].getOffset() - 10);
    }
    */

    /* Ajout de l'événement de suppression de snapshot au clic droit de la souris sur un snapshot */
    var that = this;
    snapshot.html.addEventListener('contextmenu', function(e) { that.removeSnapshot(e, snapshot); }, false);

    // Repositionnement du curseur sur le nouveau snapshot automatiquement sélectionné */
    this.moveCursorOnSnapshot(snapshot);

    // Si on a plus d'un snapshot, on active la navigation sur la timeline */
    if ( this.nbSnapshots == 2 )
    {
        this.cursor.allowDragging();
    }
}

/* Fonction replaceSnapshots
*
*  Paramètres : null
*  Retourne : null
*
*  Cette fonction a pour but de calculer la nouvelle position des snapshots en fonction de leur nombre.
*  Elle s'occupera également de mettre à jour l'attribut intervald e la timeline.
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

/* Fonction replaceSnapshot
*
*  Paramètres :
*   i       : entier correspondant à l'id du snapshot à repositionner
*   step    : réel correspondant au pas entre chaque snapshot, en pourcentage
*
*  Retourne : null
*
*  Cette fonction a pour but de repositionner le snapshot identifié par i sur la timeline à l'aide du pas step renseigné.
 */
SIMU.Timeline.prototype.replaceSnapshot = function(i, step)
{
    this.snapshots[i].setOffset(i*step + '%');
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
 */
SIMU.Timeline.prototype.removeSnapshot = function(e, snap)
{
    /* Récupération de l'événement avec compatibilité IE */
    var evtobj = window.event ? window.event : e;

    /* Désactivation de l'apparition du menu contextuel lors du clic droit */
    if ( evtobj.preventDefault )
    {
        evtobj.preventDefault();
    }

    /* Récpération de l'id du snapshot */
    var id = snap.getIdNumber();

    /* Suppression de l'élément HTML du snapshot du DOM */
    this.html.removeChild(snap.html);

    /* Boucle sur le tableau de snapshots pour décaler les objets de un afin d'écraser le snapshot à supprimer et réattribution des ids */
    for ( var i = id; i < this.nbSnapshots - 1; i++ )
    {
        this.snapshots[i] = this.snapshots[i+1];
        this.snapshots[i].setId(i);
    }

    /* Elimination du dernier élément du tableau snapshots */
    this.snapshots.pop();

    /* Réaffectation du nombre de snapshots */
    this.nbSnapshots = this.snapshots.length;

    /* Repositionnement des snapshots sur la timeline */
    this.replaceSnapshots();

    /* Si le snapshot supprimé était celui sélectionné, on affecte 'undefined' à currentSnapshot */
    if (this.currentSnapshot == id)
    {
        this.currentSnapshot = 'undefined';
    }
    /* Sinon, s'il était à une position inférieure au snapshot sélectionné, on réttribue le bon id à currentSnapshot */
    else if (this.currentSnapshot > id)
    {
        this.currentSnapshot -= 1;
    }

    /* Si un snapshot est encore sélectionné, on repositionne le curseur sur celui-ci */
    if (this.currentSnapshot !== 'undefined')
    {
        this.cursor.setOffset(this.snapshots[this.currentSnapshot].getOffset() - 10);
    }

    /* S'il ne reste plus qu'un snapshot, on désactive la navigation sur la timeline et on replace le curseur sur le snapshot restant */
    if ( this.nbSnapshots == 1 )
    {
        this.cursor.removeDragging();
        this.moveCursorOnSnapshot(this.snapshots[this.nbSnapshots - 1]);
    }
}

/* Fonction moveCursorOnSnapshot
*
*  Paramètres :
*   snap    : objet SnapshotBreakpoint correspondant au snapshot sur lequel positionner le curseur
*
*  Retourne : null
*
*  Cette fonction a pour but de déplacer le curseur sur le snapshot renseigné.
 */
SIMU.Timeline.prototype.moveCursorOnSnapshot = function(snap)
{
    this.cursor.setOffset(snap.getOffset() - 10);
}

/* Fonction setCurrentSnapshotId
 *
 * Paramètres :
 *  id      : entier correspondant à l'identifiant du snapshot à sélectionner
 *
 * Retourne : null
 *
 * Cette fonction a pour but de mettre à jour le snapshot actuellement sélectionné.
 */
SIMU.Timeline.prototype.setCurrentSnapshotId = function(id)
{
    this.currentSnapshot = id;
}

/* Fonction changeCurrentSnapshot
 *
 * Paramètres :
 *  id      : entier correspondant à l'identifiant du snapshot à sélectionner.
 *
 * Retourne : null
 *
 * Cette fonction a pour but de mettre à jour le snapshot actuellement sélectionné tout en déplacant le curseur sur celui-ci.
 */
SIMU.Timeline.prototype.changeCurrentSnapshot = function(id)
{
    var snap = this.getSnapById(id);
    this.moveCursorOnSnapshot(snap);
    this.setCurrentSnapshotId(id);
}

/* Fonction getSnapById
 *
 * Paramètres :
 *  i       : id du snapshot à récupérer
 *
 * Retourne :   Un objet SnapshotBreakpoint correspondant à l'id renseigné.
 *
 * Cette fonction a pour but de renvoyer l'objet SnapshotBreakpoint d'id id.
 */
SIMU.Timeline.prototype.getSnapById = function(id)
{
    return this.snapshots[id];
}

/* Fonction animate
 *
 * Paramètres :
 *  t       : réel correspondant au temps écoulé entre deux snapshots.
 *
 * Retourne : null
 *
 * Cette fonction a pour but de calculer et de mettre à jour la position du curseur en fonction du temps lors de l'animation.
 */
SIMU.Timeline.prototype.animate = function(t)
{
    var position = t * this.interval;

    this.cursor.setOffset(this.getSnapById(this.currentSnapshot).getOffset() + position -10);
}

/* Fonction setInterval
 *
 * Paramètres :
 *  step    : réel correspondant au pourcentage de la timeline entre chaque snapshot
 *
 * Retourne : null
 *
 * Cette fonction a pour but de mettre à jour l'intervalle en pixels entre chaque snapshot en fonction du pas en pourcentage entre ceux-ci.
 */
SIMU.Timeline.prototype.setInterval = function(step)
{
    this.interval = ( step * this.html.offsetWidth ) / 100;
}

/* Fonction lookForCurrentSnapshot
 *
 * Paramètres :
 *
 * Retourne : un entier correspondant à l'identifiant du snapshot le plus proche du curseur (sur sa gauche).
 *
 * Cette fonction a pour but de rechercher le snapshot courant en fonction de la position du curseur afin, par exemple d'effectuer des calculs sur la position du curseur en fonction de l'intervalle dans le quel il se situe, et ce , sans modifier le snapshot actuellement sélectionné.
 * La fonction retourne -1 en cas d'erreur.
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

/* Fonction setPlayButton
 *
 * Paramètres : null
 * Retourne : null
 *
 * Cette fonction a pour but de modifier l'identifiant de l'élément HTML du bouton Play/Stop afin d'afficher un bouton Play.
 */
SIMU.Timeline.prototype.setPlayButton = function()
{
    this.playButton.firstElementChild.id = 'play-button';
}

/* Fonction setStopButton
 *
 * Paramètres : null
 * Retourne : null
 *
 * Cette fonction a pour but de modifier l'identifiant de l'élément HTML du bouton Play/Stop afin d'afficher un bouton Stop.
 */
SIMU.Timeline.prototype.setStopButton = function()
{
    this.playButton.firstElementChild.id = 'stop-button';
}

/* Classe Cursor
 *
 * html                     : élément HTML correspondant au curseur
 * cursorOffsetOrigin       : entier correspondant à l'offset du curseur avant déplacement
 * isMoving                 : booléen contrôlant la permission de dragger le curseur ou non
 * mouseOffsetOrigin        : entier correspondant à l'abscisse de la souris lors du premier clic
 * dragCursorEvent          : événement correspondant à l'appel de la fonction dragCursor après un événement de type mousedown
 * stopDraggingEvent        : événement correspondant à l'appel de la fonction stopDragging après un événement de type mouseup
 * positionHasToBeComputed  : booléen contrôlant si la position du curseur doit être calculée ou non après événement de la souris
 *
 * La classe Cursor a pour but de gérer l'élément HTML correspondant en fonction des différents événements de déplacement du curseur.
 *
 * Elle gère l'autorisation et l'interdiction de déplacement (dragging) du curseur.
 * Elle gère le dragging et l'arrêt du dragging.
 * Elle permet de récupérer des informations su rla position de l'élément HTML du curseur.
 */
SIMU.Cursor = function()
{
    this.html                       = null;//document.getElementById('cursor');
    this.cursorOffsetOrigin         = 0;//this.html.offsetLeft;
    this.isMoving                   = false;
    this.mouseOffsetOrigin          = 0;
    this.dragCursorEvent            = null;
    this.stopDraggingEvent          = null;
    this.positionHasToBeComputed    = false;
}

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

/* Fonction allowDragging
 *
 * Paramètres : null
 * Retourne : null
 *
 * Cette fonction a pour but d'ajouter à l'élément HTML du curseur l'événement qui permettra de le déplacer.
 */
SIMU.Cursor.prototype.allowDragging = function()
{
    this.dragCursorEvent = this.dragCursor.bind(this);
    this.html.addEventListener('mousedown', this.dragCursorEvent, false);
}

/* Fonction removeDragging
 *
 * Paramètres : null
 * Retourne : null
 *
 * Cette fonction a pour but de supprimer l'événement qui permet de déplacer le curseur.
 */
SIMU.Cursor.prototype.removeDragging = function()
{
    this.html.removeEventListener('mousedown', this.dragCursorEvent);
}

/* Fonction stopDragging
 *
 * Paramètres : null
 * Retourne : null
 *
 * Cette fonction a pour but de supprimer les événements actifs lors du déplacement du curseur afin qu'ils ne soient pas appelés inutilement.
 */
SIMU.Cursor.prototype.stopDragging = function()
{
    this.isMoving = false;
    document.removeEventListener('mousemove', this.moveCursor);
    document.removeEventListener('mouseup', this.stopDraggingEvent);
}

/* Fonction dragCursor
 *
 * Paramètres :
 *  e       : événement correspondant normalement à un événement de type mousedown
 *
 * Retourne : null
 *
 * Cette fonction a pour but de démarrer le déplacement du curseur en initialisant toutes les valeurs nécessaires.
 * Elle s'occupera également :
 * - D'empêcher un autre possible autre comportement de l'événement
 * - D'indiquer que la position du curseur aura besoin d'être calculée après déplacement.
 * - D'ajouter les événements permettant le déplacement du curseur
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

/* Fonction moveCursor
 *
 * Paramètres :
 *  e       : événement correspondant normalement à un événement de type mousemove
 *
 * Retourne : null
 *
 * Cette fonction a pour but de déplacer le curseur à chaque mouvement de la souris.
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

/* Fonction setOffset
 *
 * Paramètres :
 *  offset  : entier correspondant à la position en pixels par rapport au bord gauche de la timeline à appliquer
 *
 *  Retourne : null
 *
 *  Cette fonction a pour but d'affecter une nouvelle position à l'élément HTML du curseur.
 */
SIMU.Cursor.prototype.setOffset = function(offset)
{
    this.html.style.left = offset + "px";
}

/* Fonction getOffset
 *
 * Paramètres : null
 *
 * Retourne : La position de l'élément HTML du curseur par rapport au bord gauche de la timeline.
 *
 * Cette fonction a pour but de renvoyer la position de l'élément HTML du curseur.
 */
SIMU.Cursor.prototype.getOffset = function()
{
    return this.html.offsetLeft;
}

/* Classe SnapshotBreakpoint
 *
 * html     : élément HTML correspondant au snapshot de la timeline
 *
 * La classe SnapshotBreakpoint a pour but de gérer l'identifiant et la position de son élément HTML.
 *
 * Un objet SnapshotBreakpoint doit obligatoirement être créé à l'aide d'un entier id représentant l'identifiant du snapshot.
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

/* Fonction getId
 *
 * Paramètres : null
 *
 * Retourne : L'identifiant de l'élément HTML du snapshot de type 'snap-id'
 *
 * Cette fonction a pour but de renvoyer l'identifiant de l'élément HTML du snapshot.
 */
SIMU.SnapshotBreakpoint.prototype.getId = function()
{
    return this.html.id;
}

/* Fonction setId
 *
 * Paramètres :
 *  id      : entier correspondant à l'identifiant du snapshot à appliquer.
 *
 * Retourne : null
 *
 * Cette fonction a pour but de mettre à jour l'identifiant du snaphot à l'aide de l'id renseigné.
 * Elle permet également d'attribuer un identifiant purement numérique à l'élément HTML breakpoint associé au snapshot.
 * Ceci parce qu'un événement mouse sur le snapshot est généralement associé au breakpoint.
 */
SIMU.SnapshotBreakpoint.prototype.setId = function(id)
{
    this.html.id = 'snap-' + id;
    this.html.firstElementChild.id = id;
}

/* Fonction getIdNumber
 *
 * Paramètres : null
 *
 * Retourne : La valeur numérique de l'identifiant du snapshot. Renvoie -1 en cas d'erreur.
 *
 * Cette fonction a pour but de renvoyer uniquement le nombre contenu dans l'identifiant du snapshot.
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

/* Fonction getOffset
 *
 * Paramètres : null
 *
 * Retourne : La position de l'élément HTML en pixels en fonction du  bord gauche de la timeline.
 *
 * Cette fonction a pour but de renvoyer la position de l'élément HTML.
 */
SIMU.SnapshotBreakpoint.prototype.getOffset = function()
{
    return this.html.offsetLeft;
}

/* Fonction setOffset
 *
 * Paramètres :
 *  offset  : entier correspondant à la position en pixels par rapport au bord gauche de la timeline à appliquer.
 *
 * Retourne : null
 *
 * Cette fonction a pour but d'affecter une nouvelle position à l'élément HTML du snapshot.
 */
SIMU.SnapshotBreakpoint.prototype.setOffset = function(offset)
{
    this.html.style.left = offset;
}

/* Fonction setCSS
 *
 * Paramètres : null
 * Retourne : null
 *
 * Cette fonction a pour but d'appliquer le CSS en l'insérant dans le DOM dans une balise <style>
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

/* Fonction setCSS
 *
 * Paramètres : null
 * Retourne : null
 *
 * Cette fonction a pour but d'appliquer le CSS en l'insérant dans le DOM dans une balise <style>
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