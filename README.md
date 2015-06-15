# Simu_stage_2015
Visualisation de données astronomiques en 3D avec WebGL

Lancer une demo :
- Ouvrir index.html dans un navigateur (chrome ou firefox).
- Appuyer sur le bouton "Sélect. fichiers" et selectionner tous les fichiers binaires présent dans data/Deparis_data_binaire/part_start.
- Faire de même avec les fichiers présent dans data/Deparis_data_binaire/part_end.
- Le cube de donnée est désormais visible à l'écran

Commandes :
- Déplacement dans le plan XZ : touche zqsd et flèches directionnelles
- Orientation de la caméra : drag & drop à la souris
- Vitesse de déplacement : molette de la souris

Paramètres :
- Camera speed : Vitesse de la caméra
- Time : Temps relatif entre les deux cubes de données (interpolation linéaire)
- TimeOffset : Vitesse d'animation des particules ( vitesse d'interpolation entre les deux cube de données )
- Point size : Taille des points à l'écran
