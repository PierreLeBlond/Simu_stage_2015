# Simu_stage_2015
Visualisation de données astronomiques en 3D avec WebGL

Lancer une demo :
- Ouvrir index.html dans un navigateur (chrome ou firefox).
- Dans l'onglet "User options", choisir le script correspondant au type de donnée voulu
    - DeParis pour les données binaires sur la matière noir
    - Schaaff pour les données sur les étoiles
- Appuyer sur le bouton "Sélect. fichiers" et selectionner les fichiers correspondant au snapshot
- Le cube de donnée est désormais visible à l'écran

- Si chargement de plusieurs autres snapshot de taille identique, on peut observer l'interpolation linéaire entre les deux positions.

/!\ Pour visualiser les données sur les étoiles, désactiver le raycasting ( Onglet Dev options ).


Commandes :
- Déplacement dans le plan XZ : touche zqsd et flèches directionnelles
- Orientation de la caméra : drag & drop à la souris
- Vitesse de déplacement : molette de la souris
- lancement et arrêt de l'animation : Touche p du clavier

Paramètres :
- Camera speed : Vitesse de la caméra
- Time : Temps relatif entre les deux cubes de données (interpolation linéaire)
- TimeOffset : Vitesse d'animation des particules ( vitesse d'interpolation entre les deux cubes de données )
- Point size : Taille des points à l'écran
- Script : Choix du script de chargement de fichier
- Number of point : Nombre de point à afficher à l'écran