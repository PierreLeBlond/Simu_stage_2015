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
 * controlsEnabled      : booléen contrôlant l'activation des contrôles
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
    this.simpleView = null;
    this.multiView = null;
    this.oculus = null;
    this.cardboard = null;

    this.blocker = null;
    this.controlsEnabled = true;
    this.isDisplayed = false;
}

/* Fonction d'initialisation des paramètres du menu */

SIMU.Menu.prototype.initialize = function()
{
    this.simpleView = document.getElementById('simpleview');
    this.multiView = document.getElementById('multiview');
    this.oculus = document.getElementById('oculus');
    this.cardboard = document.getElementById('cardboard');

    this.simpleView.addEventListener('click', this.initSimpleView.bind(this), false);
    this.multiView.addEventListener('click', this.initMultiView.bind(this), false);
    this.oculus.addEventListener('click', this.initOculus.bind(this), false);
    this.cardboard.addEventListener('click', this.initCardboard.bind(this), false);

    this.blocker = document.getElementById('blocker');

    window.addEventListener('keydown', this.switchMenu.bind(this), false);
}

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
            if ( this.isDisplayed == true )
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
}

/* Fonction permettant d'afficher le menu et de mettre en pause le rendu */

SIMU.Menu.prototype.displayMenu = function()
{
    this.blocker.style.display = 'initial';
    this.controlsEnabled = false;
    this.isDisplayed = true;
}

/* Fonction permettant de cacher le menu et de reprendre le rendu */

SIMU.Menu.prototype.hideMenu = function()
{
    this.blocker.style.display = 'none';
    this.controlsEnabled = true;
    this.isDisplayed = false;
}

/* Fonction d'initialisation du mode SimpleView */

SIMU.Menu.prototype.initSimpleView = function()
{
    if ( simu.currentDisplay == simu.DisplayType.SIMPLEVIEW )
    {
        /* Disparition du menu */

        this.hideMenu();

    }
    else
    {
        /* Interruption de la boucle de rendu en cours s'il y a lieu */

        if ( simu.currentDisplay !== simu.DisplayType.UNKNOWN )
        {

            // TODO : Interruption de la boucle, destruction de la vue ( désallouement, etc.) & réinitialisation des variables qui seront réutilisées

            /*
            cancelAnimationFrame(App.requestId);
            document.body.removeChild( App.renderer.domElement );
            document.body.removeChild( Gui.stats.domElement );
            Gui.gui.destroy();
            Camera.fpControls = undefined;
            Camera.controls = undefined;
            */
        }

        /* Enregistrement du choix */

        simu.currentDisplay = simu.DisplayType.SIMPLEVIEW;

        /* Disparition du menu */

        this.hideMenu();

        /* Création d'un objet SimpleViewManager */

        this.simpleViewManager = new SimpleViewManager();

        this.simpleViewManager.initialize();

        /* Initialisation de la scène */

        // TODO : Initialisation de la scène

        /*
        setupScene();
        setupcamera();
        setupGUI();

        initEventhandling();
        */

        /* Chargement automatique des données */

        // TODO : A conserver ?

        /*
        if (App.autoLoadData)
        {
            loadBinaryFiles(App.startFiles);
        }
        */

        /* Lancement de la boucle de rendu */

        // TODO : Boucle de rendu générale, boucle spécifique, encapsulement, etc.

        /*
        render();
        */

    }
}

/* Fonction d'initialisation du mode MultiView */

SIMU.Menu.prototype.initMultiView = function()
{
    if ( simu.currentDisplay == simu.DisplayType.MULTIVIEW )
    {
        /* Disparition du menu */

        this.hideMenu();

    }
    else
    {
        /* Interruption de la boucle de rendu en cours s'il y a lieu */

        if ( simu.currentDisplay !== simu.DisplayType.UNKNOWN )
        {

            // TODO : Interruption de la boucle, destruction de la vue ( désallouement, etc.) & réinitialisation des variables qui seront réutilisées

            /*
             cancelAnimationFrame(App.requestId);
             document.body.removeChild( App.renderer.domElement );
             document.body.removeChild( Gui.stats.domElement );
             Gui.gui.destroy();
             Camera.fpControls = undefined;
             Camera.controls = undefined;
             */
        }

        /* Enregistrement du choix */

        simu.currentDisplay = simu.DisplayType.MULTIVIEW;

        /* Disparition du menu */

        this.hideMenu();

        /* Initialisation de la scène */

        // TODO : Initialisation de la scène

        /*
         setupScene();
         setupcamera();
         setupGUI();

         initEventhandling();
         */

        /* Chargement automatique des données */

        // TODO : A conserver ?

        /*
         if (App.autoLoadData)
         {
         loadBinaryFiles(App.startFiles);
         }
         */

        /* Lancement de la boucle de rendu */

        // TODO : Boucle de rendu générale, boucle spécifique, encapsulement, etc.

        /*
         render();
         */

    }
}

/* Fonction d'initialisation du mode Oculus */

SIMU.Menu.prototype.initOculus = function()
{
    // TODO : Un équivalent de initSimpleView pour le mode Oculus
}

/* Fonction d'initialisation du mode Cardboard */

SIMU.Menu.prototype.initCardboard = function()
{
    // TODO : Un équivalent de initSimpleView pour le mode Cardboard
}