/**
 * Created by Nicolas Buecher on 22/07/15.
 */

/* Espace de nom */

var SIMU = SIMU || {};

/* Classe Menu
 *
 * simpleView           : élément HTML correspondant à la div simpleview
 * multiView            : élément HTML correspondant à la div multiview
 * oculus               : élément HTML correspondant à la div oculus
 * cardboard            : élément HTML correspondant à la div cardboard
 *
 * blocker              : élément HTML correspondant à la div blocker
 * isDisplayed          : booléen contrôlant l'affichage du menu
 *
 * La classe menu a pour but de permettre de naviguer entre différents types d'affichage :
 * - SimpleView         : Une seule vue navigable pour toutes les plateformes
 * - MultiView          : Plusieurs vues indépendantes navigables pour desktop
 * - Oculus             : Vue en rélalité virtuelle navigable pour Oculus Rift
 * - Cardboard          : Vue stéréo navigable pour Google Cardboard
 *
 * Elle permet de gérer l'allouement et le désallouement des différents éléments en fonction du mode choisi.
 * Elle permet de limiter le nombre de modes d'affichages disponibles en fonction de l'appareil détecté.
 *
 * Note : Penser à la détection d'appareil, sa place est-elle vraiment dans Menu ?
 * Note : Une classe est-elle nécessaire pour chaque type d'affichage ?
 *
 */

SIMU.Menu = function()
{
    this.simpleView         = null;
    this.multiView          = null;
    this.oculus             = null;
    this.cardboard          = null;

    this.blocker            = null;
    this.isDisplayed        = false;
};

/* Fonction setup
 *
 * Paramètres : null
 * Retourne : null
 *
 * Cette fonction a pour but d'initialiser les paramètres de Menu et d'appliquer ses éléments HTML au DOM.
 * Elle fait également appel à la fonction setCSS afin d'appliquer le CSS.
 */
SIMU.Menu.prototype.setup = function()
{
    this.setCSS();

    this.blocker = document.createElement('div');
    this.blocker.id = 'blocker';

    this.simpleView = document.createElement('div');
    this.simpleView.id = 'simpleview';
    this.simpleView.className = 'choices';
    this.simpleView.innerHTML = [
        '<span>Simple View</span>\n'
    ].join('');

    this.multiView = document.createElement('div');
    this.multiView.id = 'multiview';
    this.multiView.className = 'choices';
    this.multiView.innerHTML = [
        '<span>Multiview</span>\n'
    ].join('');

    this.oculus = document.createElement('div');
    this.oculus.id = 'oculus';
    this.oculus.className = 'choices';
    this.oculus.innerHTML = [
        '<span>Oculus Rift</span>\n'
    ].join('');

    this.cardboard = document.createElement('div');
    this.cardboard.id = 'cardboard';
    this.cardboard.className = 'choices';
    this.cardboard.innerHTML = [
        '<span>Google Cardboard</span>\n'
    ].join('');

    this.blocker.innerHTML = [
        '<div id="instructions">',
        '<span style="font-size:50px">Choose display type</span>',
        '<br/>',
        '</div>'
    ].join('\n');

    this.blocker.firstElementChild.appendChild(this.simpleView);
    this.blocker.firstElementChild.appendChild(this.multiView);
    this.blocker.firstElementChild.appendChild(this.oculus);
    this.blocker.firstElementChild.appendChild(this.cardboard);
};

/* Fonction permettant d'alterner l'affichage du menu
*
* Elle est appelée suite à un événement de type keydown
*
* */

SIMU.Menu.prototype.switchMenu = function(e)
{
    var evt = window.event ? window.event : e;

    switch (evt.keyCode)
    {
        case 27:
            if ( this.isDisplayed )
            {
                this.hideMenu();
            }
            else
            {
                this.displayMenu();
            }
            break;
        default:
            break;
    }
};

/* Fonction permettant d'afficher le menu et de mettre en pause le rendu */

SIMU.Menu.prototype.displayMenu = function()
{
    this.blocker.style.display = 'initial';
    this.isDisplayed = true;
};

/* Fonction permettant de cacher le menu et de reprendre le rendu */

SIMU.Menu.prototype.hideMenu = function()
{
    this.blocker.style.display = 'none';
    this.isDisplayed = false;
};

/* Fonction setCSS
 *
 * Paramètres : null
 * Retourne : null
 *
 * Cette fonction a pour but d'appliquer le CSS en l'insérant dans le DOM dans une balise <style>
 */
SIMU.Menu.prototype.setCSS = function()
{
    var css = document.createElement('style');

    css.innerHTML = [
        '/* Style du menu (choix du type d\'affichage) */',
        '',
        '#blocker {',
        '   position: absolute;',
        '   display: none;',
        '   top: 0;',
        '   left: 0;',
        '   width: 100%;',
        '   height: 100%;',
        '   background-color: rgba(0,0,0,0.5);',
        '   font-family: Arial, sans-serif;',
        '   z-index: 100;',
        '}',
        '',
        '#instructions {',
        '   width: 100%;',
        '   height: 100%;',
        '   display: -webkit-box;',
        '   display: -moz-box;',
        '   display: box;',
        '   -webkit-box-orient: horizontal;',
        '   -moz-box-orient: horizontal;',
        '   box-orient: horizontal;',
        '   -webkit-box-pack: center;',
        '   -moz-box-pack: center;',
        '   box-pack: center;',
        '   -webkit-box-align: center;',
        '   -moz-box-align: center;',
        '   box-align: center;',
        '   color: #ffffff;',
        '   text-align: center;',
        '}',
        '',
        '.choices {',
        '   display: inline-block;',
        '   margin: 20px 20px;',
        '   font-size: 25px;',
        '   cursor: pointer;',
        '   transition-duration: .5s;',
        '}',
        '',
        '.choices:hover {',
        '   font-size: 30px;',
        '}'
    ].join('\n');

    document.head.appendChild(css);
}