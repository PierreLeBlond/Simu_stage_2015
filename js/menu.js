/**
 * Created by buecher on 29/06/15.
 */

Menu = {};

Menu.simpleView = document.getElementById('simpleview');
Menu.multiView = document.getElementById('multiview');
Menu.oculus = document.getElementById('oculus');
Menu.cardboard = document.getElementById('cardboard');

Menu.simpleView.addEventListener('click', initSimpleView, false);
Menu.multiView.addEventListener('click', initMultiView, false);
Menu.oculus.addEventListener('click', initOculus, false);
Menu.cardboard.addEventListener('click', initCardboard, false);

function initSimpleView()
{

    if ( App.currentDisplay == App.DisplayType.SIMPLEVIEW )
    {

        /* Disparition du menu */

        document.getElementById('blocker').style.display = 'none';

        /* Activation des contrôles */

        App.controlsEnabled = true;

    }
    else
    {

        /* Interruption de la boucle de rendu en cours s'il y a lieu */

        if ( App.currentDisplay !== App.DisplayType.UNKNOWN )
        {
            cancelAnimationFrame( App.requestId );
            document.body.removeChild(App.renderer.domElement);
        }

        /* Enregistrement du choix */

        App.currentDisplay = App.DisplayType.SIMPLEVIEW;

        /* Disparition du menu */

        document.getElementById('blocker').style.display = 'none';

        /* Initialisation de la scène */

        setupScene();
        setupcamera();
        setupGUI();

        /* Activation des contrôles */

        App.controlsEnabled = true;

        /* Lancement de la boucle de rendu */

        render();

    }

}

function initMultiView()
{

    if ( App.currentDisplay == App.DisplayType.MULTIVIEW )
    {

        /* Disparition du menu */

        document.getElementById('blocker').style.display = 'none';

        /* Activation des contrôles */

        App.controlsEnabled = true;

    }
    else {

        /* Interruption de la boucle de rendu en cours s'il y a lieu */

        if (App.currentDisplay !== App.DisplayType.UNKNOWN) {
            cancelAnimationFrame(App.requestId);
            document.body.removeChild( App.renderer.domElement );
            document.body.removeChild( Gui.stats.domElement );
            document.getElementById('colorPickingTexture').removeChild(App.colorPickingRenderer.domElement);
            Gui.gui.destroy();
        }

        /* Enregistrement du choix */

        App.currentDisplay = App.DisplayType.MULTIVIEW;

        /* Disparition du menu */

        document.getElementById('blocker').style.display = 'none';

        /* Initialisation de la scène */

        setupScene();
        setupcamera();
        setupGUI();

        /* Activation des contrôles */

        App.controlsEnabled = true;

        /* Lancement de la boucle de rendu */

        render();

    }

}

function initOculus()
{

    if ( App.currentDisplay == App.OCULUS )
    {

        /* Disparition du menu */

        document.getElementById('blocker').style.display = 'none';

        /* Activation des contrôles */

        App.controlsEnabled = true;

    }
    else {

        /* Interruption de la boucle de rendu en cours s'il y a lieu */

        if (App.currentDisplay !== App.UNKNOWN) {
            cancelAnimationFrame(App.requestId);
            document.body.removeChild(App.renderer.domElement);
        }

        /* Enregistrement du choix */

        App.currentDisplay = App.OCULUS;

        /* Disparition du menu */

        document.getElementById('blocker').style.display = 'none';

        /* Initialisation de la scène */

        setupScene();
        setupcamera();
        setupGUI();

        /* Activation des contrôles */

        App.controlsEnabled = true;

        /* Lancement de la boucle de rendu */

        render();

    }

}

function initCardboard()
{

    if ( App.currentDisplay == App.CARDBOARD )
    {

        /* Disparition du menu */

        document.getElementById('blocker').style.display = 'none';

        /* Activation des contrôles */

        App.controlsEnabled = true;

    }
    else {

        /* Interruption de la boucle de rendu en cours s'il y a lieu */

        if (App.currentDisplay !== App.UNKNOWN) {
            cancelAnimationFrame(App.requestId);
            document.body.removeChild(App.renderer.domElement);
        }

        /* Enregistrement du choix */

        App.currentDisplay = App.CARDBOARD;

        /* Disparition du menu */

        document.getElementById('blocker').style.display = 'none';

        /* Initialisation de la scène */

        setupScene();
        setupcamera();
        setupGUI();

        /* Activation des contrôles */

        App.controlsEnabled = true;

        /* Lancement de la boucle de rendu */

        render();

    }

}