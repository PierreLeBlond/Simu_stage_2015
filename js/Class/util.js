/**
 * Created by lespingal on 20/07/15.
 */

var SIMU = SIMU || {};

SIMU.faceToOctan = [[5, 6, 7, 8], [1,2,3,4], [1,2,5,6], [3, 4, 7, 8], [2, 4, 6, 8], [1, 3, 5, 7]];
SIMU.octanToFace = [
    /*octan 1*/[
        /*face 1*/[{octan : 3, face : 3}, {octan : 2, face : 6}],
        /*face 2*/[{octan : 2, face :6}, {octan : 5, face : 2}, {octan : 3, face : 3}],
        /*face 3*/[{octan : 5, face : 2}, {octan : 2, face : 6}, {octan : 3, face : 3}],
        /*face 4*/[{octan : 2, face :6}, {octan : 5, face : 2}],
        /*face 5*/[{octan : 3, face : 3}, {octan : 3, face : 3}],
        /*face 6*/[{octan : 3, face : 3}, {octan : 2, face : 6}, {octan : 3, face : 3}]
    ],
    /*octan 2*/[
        /*face 1*/[{octan : 1, face :5}, {octan : 4, face : 3}],
        /*face 2*/[{octan : 1, face :5}, {octan : 6, face : 2}, {octan : 4, face : 3}],
        /*face 3*/[{octan : 1, face :5}, {octan : 6, face : 2}, {octan : 4, face : 3}],
        /*face 4*/[{octan : 1, face :5}, {octan : 6, face : 2}],
        /*face 5*/[{octan : 1, face :5}, {octan : 6, face : 2}, {octan : 4, face : 3}],
        /*face 6*/[{octan : 4, face : 3}, {octan : 6, face : 2}]
    ],
    /*octan 3*/[
        /*face 1*/[{octan : 4, face :6}, {octan : 1, face : 4}],
        /*face 2*/[{octan : 4, face :6}, {octan : 7, face : 2}, {octan : 1, face : 4}],
        /*face 3*/[{octan : 4, face :6}, {octan : 7, face : 2}],
        /*face 4*/[{octan : 4, face :6}, {octan : 7, face : 2}, {octan : 1, face : 4}],
        /*face 5*/[{octan : 7, face : 2}, {octan : 1, face : 4}],
        /*face 6*/[{octan : 4, face :6}, {octan : 7, face : 2}, {octan : 1, face : 4}]
    ],
    /*octan 4*/[
        /*face 1*/[{octan : 2, face :4}, {octan : 3, face : 5}],
        /*face 2*/[{octan : 2, face :4}, {octan : 3, face : 5}, {octan : 8, face : 2}],
        /*face 3*/[{octan : 3, face : 5}, {octan : 8, face : 2}],
        /*face 4*/[{octan : 2, face :4}, {octan : 3, face : 5}, {octan : 8, face : 2}],
        /*face 5*/[{octan : 2, face :4}, {octan : 3, face : 5}, {octan : 8, face : 2}],
        /*face 6*/[{octan : 8, face : 2}, {octan : 2, face :4}]
    ],
    /*octan 5*/[
        /*face 1*/[{octan : 1, face : 1}, {octan : 6, face :6}, {octan : 7, face : 3}],
        /*face 2*/[{octan : 6, face :6}, {octan : 7, face : 3}],
        /*face 3*/[{octan : 1, face : 1}, {octan : 6, face :6}, {octan : 7, face : 3}],
        /*face 4*/[{octan : 1, face : 1}, {octan : 6, face :6}],
        /*face 5*/[{octan : 7, face : 3}, {octan : 1, face : 1}],
        /*face 6*/[{octan : 1, face : 1}, {octan : 6, face :6}, {octan : 7, face : 3}]
    ],
    /*octan 6*/[
        /*face 1*/[{octan : 2, face : 1}, {octan : 5, face :5}, {octan : 8, face : 3}],
        /*face 2*/[{octan : 5, face :5}, {octan : 8, face : 3}],
        /*face 3*/[{octan : 2, face : 1}, {octan : 5, face :5}, {octan : 8, face : 3}],
        /*face 4*/[{octan : 2, face : 1}, {octan : 5, face :5}],
        /*face 5*/[{octan : 2, face : 1}, {octan : 5, face :5}, {octan : 8, face : 3}],
        /*face 6*/[{octan : 2, face : 1}, {octan : 8, face : 3}]
    ],
    /*octan 7*/[
        /*face 1*/[{octan : 3, face : 1}, {octan : 5, face :4}, {octan : 8, face : 6}],
        /*face 2*/[{octan : 5, face :4}, {octan : 8, face : 6}],
        /*face 3*/[{octan : 8, face : 6}, {octan : 3, face : 1}],
        /*face 4*/[{octan : 3, face : 1}, {octan : 5, face :4}, {octan : 8, face : 6}],
        /*face 5*/[{octan : 3, face : 1}, {octan : 5, face :4}],
        /*face 6*/[{octan : 3, face : 1}, {octan : 5, face :4}, {octan : 8, face : 6}]
    ],
    /*octan 8*/[
        /*face 1*/[{octan : 4, face : 1}, {octan : 6, face :4}, {octan : 7, face : 5}],
        /*face 2*/[{octan : 6, face :4}, {octan : 7, face : 5}],
        /*face 3*/[{octan : 7, face : 5}, {octan : 4, face : 1}],
        /*face 4*/[{octan : 4, face : 1}, {octan : 6, face :4}, {octan : 7, face : 5}],
        /*face 5*/[{octan : 4, face : 1}, {octan : 6, face :4}, {octan : 7, face : 5}],
        /*face 6*/[{octan : 4, face : 1}, {octan : 6, face :4}]
    ]];

function negate(color, index){
    color.array[index * 3] = 1 - color.array[index * 3];
    color.array[index * 3 + 1] = 1 - color.array[index * 3 + 1];
    color.array[index * 3 + 2] = 1 - color.array[index * 3 + 2];
    color.needsUpdate = true;
}

SIMU.LoadingBar = function(){
    this.domElement = null;
};

SIMU.LoadingBar.prototype.setupBar = function(){
    this.domElement = document.createElement('progress');
    this.domElement.style.position = 'absolute';
    this.domElement.style.width = '20%';
    this.domElement.style.height = '10px';
    this.domElement.style.left = '40%';
    this.domElement.style.bottom = '60px';
    this.domElement.style.zIndex = '1';

};

SIMU.LoadingBar.prototype.display = function(){
    this.domElement.style.display = 'block';
};

SIMU.LoadingBar.prototype.hide = function(){
    this.domElement.style.display = 'none';
};

SIMU.LoadingBar.prototype.setPercent = function(percent){
    this.domElement.value = percent;
};

SIMU.isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function() {
        return (SIMU.isMobile.Android() || SIMU.isMobile.BlackBerry() || SIMU.isMobile.iOS() || SIMU.isMobile.Opera() || SIMU.isMobile.Windows());
    }
};