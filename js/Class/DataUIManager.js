/**
 * Created by lespingal on 31/07/15.
 */

var SIMU = SIMU || {};

/**
 *
 * @constructor
 */
SIMU.DataUIManager = function(){
    this.domElement                = null;
    this.fileLoader                = null;
};

/**
 * @description Setup the dom element
 */
SIMU.DataUIManager.prototype.setupUI = function(){
    this.domElement = document.createElement('div');
    this.domElement.id = 'data_manager';
    this.domElement.style.position = 'absolute';
    this.domElement.style.left = '0';
    this.domElement.style.top = '0';
    this.domElement.style.background = 'black';
    this.domElement.style.padding = '2px';
    this.domElement.style.zIndex = '10';
    this.domElement.style.color = 'white';
    this.domElement.style.fontSize = 'small';

    this.fileLoader = document.createElement('input');
    this.fileLoader.type = "file";
    this.fileLoader.accept = "*";
    this.fileLoader.id = "files";
    this.fileLoader.name = "file";
    this.fileLoader.style.display = "none";
    this.fileLoader.multiple = true;

    this.domElement.innerHTML = [
        '<div id=\"loader\">\n',
        '</div>\n',
        '<table id=\"data_table\">\n',
        '   <thead>\n',
        '   <tr id=\"data_head\"\n>',
        '       <th></th>\n',
        '   <th><input id=\"add_column_button\" type=\"image\" alt=\"Add data\" src=\"resources/icons/Add_icon_16.png\"/></th>\n',
        '   </tr>\n',
        '   </thead>\n',
        '   <tr>\n',
        '       <td>\n',
        '           <input id=\"add_row_button\" type=\"image\" alt=\"Add data\" src=\"resources/icons/Add_icon_16.png\"/>\n',
        '       </td>\n',
        '       <td></td>\n',
        '   </tr>\n',
        '</table>\n'].join('');

    var css = [
        'tr.border {                            \n',
        '   height: 2px;                        \n',
        '   background: white;                  \n',
        '   border-spacing: 0;                  \n',
        '}                                      \n',
        '                                       \n',
        '.browse_button {                       \n',
        '   width: 16px;                        \n',
        '   margin-left: auto;                  \n',
        '   margin-right: auto;                 \n',
        '}                                      \n',
        '                                       \n',
        '.data_head_active {                    \n',
        '   border-bottom: white solid 1px;     \n',
        '   border-left: white solid 2px;       \n',
        '   border-right: white solid 1px;      \n',
        '   border-top: white solid 2px;        \n',
        '}                                      \n',
        '                                       \n',
        '.data_head {                           \n',
        '   border-bottom: black solid 1px;     \n',
        '   border-left: black solid 2px;       \n',
        '   border-right: black solid 1px;      \n',
        '   border-top: black solid 2px;        \n',
        '}                                      \n',
        '                                       \n',
        '.snap_head_active {                    \n',
        '   border-bottom: white solid 1px;     \n',
        '   border-left: white solid 2px;       \n',
        '   border-right: white solid 1px;      \n',
        '   border-top: white solid 2px;        \n',
        '}                                      \n',
        '                                       \n',
        '.snap_head {                           \n',
        '   border-bottom: black solid 1px;     \n',
        '   border-left: black solid 2px;       \n',
        '   border-right: black solid 1px;      \n',
        '   border-top: black solid 2px;        \n',
        '}                                      \n',
        '                                       \n',
        '#loader {                              \n',
        '   color: white;                       \n',
        '   width: 100%;                        \n',
        '}                                      \n'
    ].join('');


    var style = document.createElement('style');
    style.innerHTML = css;
    document.body.appendChild(style);

    this.domElement.firstElementChild.appendChild(this.fileLoader);

};

/**
 * @description Hide the dom element
 */
SIMU.DataUIManager.prototype.hide = function(){
    this.domElement.style.display = "none";
};

/**
 * @description Show the dom element
 */
SIMU.DataUIManager.prototype.show = function(){
    this.domElement.style.display = "block";
};