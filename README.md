# Simu_stage_2015
Visualisation de données astronomiques en 3D avec WebGL




Commandes :
- ouvrir/fermer le menu :                   touche echap
- Afficher/cacher l'interface :             touche u / touche h
- plein écran :                             touche f11
- Déplacement dans le plan XZ :             touche zqsd ou flèches directionnelles
- Orientation de la caméra :                drag & drop à la souris clic gauche
- Pan de la caméra :                        drag & drop à la souris clic droit
- Vitesse de déplacement :                  molette de la souris
- lancement et arrêt de l'animation :       touche p du clavier

Paramètres Global - menu en haut à gauche :
- Time :                                    Temps relatif entre les deux cubes de données (interpolation linéaire)
- speed :                                   Vitesse d'animation des particules

- Script :                                  Choix du script de chargement de fichier

Paramètres Vues - menu en bas à gauche :
- link Camera :                             Switch entre la caméra local et la caméra commune à toutes les vues
- Frustum culling :                         Active/Desactive le calcul d'occlusion de camera

- activate data :                           Active/désactive le rendu du jeu de donnée courant
- fog :                                     Active/désactive l'effet de brouillard sur le jeu de données courant
- blink :                                   Active/désactive l'effet de clignotement sur le jeu de données courant
- texture :                                 Choix de la texture à appliquer sur les particules du jeu de données courant
- point size :                              Taille des particules du jeu de données courant
- color :                                   Couleur par défaut des particules du jeu de données courant
- Level Of Detail :                         Modifie le nombre de particules à afficher : Pour M la valeur max, une valeur x permettra d'afficher x/M de l'ensemble des particules
- blending :                                Choix du mode de blending. Seul none, normal et additive permettront un rendu visible
- info :                                    Parmis les données supplémentaires sur les particules, permet d'en choisir une et de la mettre en valeur via le paramétre suivant :
- param :                                   Choisit la façon de mettre en valeur les données selectionné. Il s'agit d'une interpolation entre le minimum et le maximum de cette données parmis l'ensemble des particules