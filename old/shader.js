/**
 * Created by lespingal on 23/06/15.
 */




App.shader = {
    animated : {
        fog : {
            vertex : document.getElementById( 'animatedfogvertexshader' ).textContent,
            fragment : document.getElementById( 'fogfragmentshader' ).textContent
        },
        nofog : {
            vertex : document.getElementById( 'animatedvertexshader' ).textContent,
            fragment : document.getElementById( 'fragmentshader' ).textContent
        }
    },
    static :    {
        fog : {
            vertex : document.getElementById( 'staticfogvertexshader' ).textContent,
            fragment : document.getElementById( 'fogfragmentshader' ).textContent
        },
        nofog : {
            vertex : document.getElementById( 'staticvertexshader' ).textContent,
            fragment : document.getElementById( 'fragmentshader' ).textContent
        }
    }
};
