/**
 * Created by Nicolas Buecher on 22/07/15.
 */

/**
 * @namespace SIMU
 */
var SIMU = SIMU || {};

/**
 * Represents the menu of the application
 *
 * @class Menu
 *
 * @property {HTML}     simpleview      - HTML element of the simpleview div in DOM
 * @property {HTML}     multiview       - HTML element of the multiview div in DOM
 * @property {HTML}     oculus          - HTML element of the oculus div in DOM
 * @property {HTML}     cardboard       - HTML element of the cardboard div in DOM
 * @property {HTML}     blocker         - HTML element of the blocker div in DOM
 * @property {boolean}  isDisplayed     - If the menu is visible or not
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

/**
 * Sets up the properties of Menu creating the HTML & CSS elements
 *
 * @name Menu#setup
 * @method
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

/**
 * Displays menu if it's hidden or hides menu if it's displayed after escape key is pressed.
 *
 * @name Menu#switchMenu
 * @method
 *
 * @param {event} e - Event of type 'keydown'
 */
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

/**
 * Makes the blocker div visible
 *
 * @name Menu#displayMenu
 * @method
 */
SIMU.Menu.prototype.displayMenu = function()
{
    this.blocker.style.display = 'initial';
    this.isDisplayed = true;
};

/** Hides the blocker div
 *
 * @name Menu#hideMenu
 * @method
 */
SIMU.Menu.prototype.hideMenu = function()
{
    this.blocker.style.display = 'none';
    this.isDisplayed = false;
};

/** Creates CSS elements and appends them to DOM
 *
 * @name Menu#setCSS
 * @method
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