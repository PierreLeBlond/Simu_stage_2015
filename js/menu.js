/**
 * Created by buecher on 29/06/15.
 */

Menu = {};

Menu.simpleView = document.getElementById('simpleview');
Menu.multiView = document.getElementById('multiview');
Menu.oculus = document.getElementById('oculus');
Menu.cardboard = document.getElementById('cardboard');

Menu.simpleView.addEventListener('click', initSimpleView, false);

function initSimpleView()
{

    if ( App.currentDisplay == App.SIMPLEVIEW )
    {

        /* Disparition du menu */

        document.getElementById('blocker').style.display = 'none';

        /* Activation des contrôles */

        App.controlsEnabled = true;

    }
    else
    {

        /* Interruption de la boucle de rendu en cours s'il y a lieu */

        if ( App.currentDisplay !== App.UNKNOWN ) // Erreur si on débute directement par SimpleView
        {
            cancelAnimationFrame( App.requestId );
            document.body.removeChild(App.renderer.domElement);
        }

        /* Enregistrement du choix */

        App.currentDisplay = App.SIMPLEVIEW;

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
