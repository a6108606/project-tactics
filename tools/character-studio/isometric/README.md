# Ryuu — pilote 2D isométrique

Décision utilisateur du 15 octobre 2026 : « dans ce cas là fait la version dofus 2 en isométrique ». Cette étude remplace la direction 3D pour la suite du chantier. Aucun asset de Dofus n’est utilisé.

Ouvrir `tools/character-studio/isometric/` depuis le serveur HTTP du dépôt. Exemple depuis sa racine : `python3 -m http.server 8765 --bind 127.0.0.1`, puis http://127.0.0.1:8765/tools/character-studio/isometric/.

## Livraison à examiner

Un sprite dessiné de **Ryuu masculin, pose de repos, vue sud-est**, avec cinq couleurs réellement actives, trois ambiances, sauvegarde locale, grille isométrique, mode détail, comparaison avec la fiche originale et export PNG transparent. `assets/ryuu-male-se.png` est le PNG exporté par le vrai bouton, palette initiale, 1254 × 1254. La grille et l’ombre au sol sont séparées du personnage.

Le sprite est une nouvelle interprétation 2D produite avec Imagegen à partir du Ryuu original et de la cible visuelle appréciée. Le volume des cheveux, le visage, les plis, les motifs et la pose sont redessinés ; aucune identité pixel à pixel avec la fiche n’est revendiquée. Le bouton Comparer montre le recadrage original sans retouche. Les deux prompts exacts et les empreintes sont dans `assets/`. La première génération avait un damier opaque ; la seconde a remplacé ce fond par un vert de détourage. `removeChroma` dans `sprite.js` normalise ensuite l’alpha de façon déterministe. Les contours fins restent à examiner sur fond sombre avant production.

**À valider artistiquement avant généralisation.** Pas encore de base féminine, autres directions, animations, changements de visage/coiffure ni équipements amovibles. Les équipements présents gardent leurs couleurs, mais ne constituent pas encore des calques amovibles. Le pilote n’achève donc pas ART-01 à ART-12. L’archive V2 et ses dix fichiers restent intacts.

## Méthode reproductible

1. Partir de la fiche canonique ; produire et faire approuver une seule pose de repos à la perspective du jeu. Conserver prompt, source et SHA-256 ; ne pas traiter les générations comme déjà validées.
2. Fixer toile, échelle et ancre au sol. Ici : 1254², ancre `[635,1205]`, vue sud-est, réduction douce pour ce dessin non pixel-art. Le contrôle « 160 px » désigne la hauteur de la toile dans le canvas interne ; l’affichage CSS s’adapte à l’écran.
3. Décrire chaque canal dans une recette JSON : polygones, exclusions, critères de matière et palette de référence. Les coordonnées et filtres sont propres à ce dessin ; ils ne doivent pas être copiés aveuglément vers un autre héros ou monstre. Le moteur commun `pipeline/mask-engine.js` résout la priorité et empêche le chevauchement des canaux.
4. Protéger yeux, dents et accessoires. Vérifier des points témoins d’équipement ainsi que les zones hors masque avec des palettes extrêmes ; examiner aussi les masques visuellement. Une couleur semblable ne suffit pas à identifier un matériau.
5. Employer la même fonction de recoloration pour l’aperçu et l’export. Garder les ombres du dessin, l’alpha et les zones fixes ; la palette initiale restitue exactement le sprite normalisé.
6. Après validation, produire les autres orientations avec une échelle et une ancre communes, puis les parties interchangeables. Les asymétries du costume interdisent de supposer qu’un miroir remplace une nouvelle vue. Valider Ryuu féminin avant d’étendre aux autres héros.

| Canal | Zone de ce sprite |
| --- | --- |
| skin | Peau visible, hors yeux/dents |
| hair | Mèches, hors bandeau |
| clothing1 | Jambe de pantalon à gauche de l’image, hors motifs dorés |
| clothing2 | Jambe de pantalon à droite de l’image, hors motifs dorés |
| clothing3 | Gilet et liens textiles violets, hors cuirs et ornements |

Le bandeau, ses rubans, l’écharpe rouge, les cuirs et les ornements gardent leurs couleurs. Cette cartographie spécifique n’est pas la cartographie définitive de tous les costumes.

## Vérification

Ouvrir `tests.html` via le même serveur. Les contrôles utilisent l’atelier réel : cinq changements via les champs couleur, noir/blanc/cyan avec points témoins fixes, alpha et pixels hors masque, yeux/dents protégés, export PNG décodé comparé pixel à pixel au rendu de recoloration même si la prévisualisation des masques est activée, sauvegarde, comparaison, taille de jeu et absence de débordement à 400/640/900 px. Le test restaure la sauvegarde locale initiale.

Le point témoin du bandeau est `[710,300]` ; le premier emplacement `[647,284]` tombait sur une mèche et a été corrigé après inspection du sprite. Cela n’a pas nécessité de changer le masque des cheveux.

Pour les sources : `python3 tools/art/import_reference_bundle.py --verify-only`. Les essais 3D antérieurs restent archivés à leur emplacement ; ils ne servent pas de dépendance à cet atelier.
