# Catalogue isométrique — 53 formes, 424 vues

L’atelier comprend les cinq héros dans leurs deux bases, trente monstres, dix invocations de rang I et trois archétypes historiques. Chaque forme dispose de huit dessins de repos : dos, dos droite, droite, face droite, face, face gauche, gauche, dos gauche. Recherche et filtres, palette, comparaison, sauvegarde locale, affichage à taille de jeu et export PNG individuel ou en planche sont disponibles.

Les nouveaux dessins sont produits avec **Imagegen intégré**, depuis les cinq fiches originales ou les descriptions du dépôt, avec une inspiration Dofus 2 et bestiaires d’animation. Les 52 nouvelles planches source, les prompts effectivement utilisés, les empreintes et les recettes se trouvent dans `assets/catalog/`. L’étude Ryuu masculine déjà approuvée conserve ses sources et masques spécifiques dans `assets/`.

Les créations sans référence illustrée sont des **propositions artistiques**, pas des designs déjà validés individuellement. Les dos et faces cachées sont reconstruits. Des détails de costume, mèches et accessoires peuvent varier entre directions. Les PNG sont des dessins matriciels, pas des SVG ni des modèles 3D.

## Personnalisation et limites

Les cinq couleurs de Ryuu masculin disposent de masques détaillés. Les neuf nouvelles bases de héros ont cinq zones actives mais **provisoires** : leur séparation fine avec les accessoires n’est pas encore garantie. Les créatures proposent une à trois familles de teintes, selon leur dessin ; ce ne sont pas des calques anatomiques ou des équipements séparés. Le défaut restitue exactement les pixels normalisés et le PNG utilise la même recoloration que l’aperçu.

Ce lot livre les directions de repos du catalogue. Les animations, variantes de visage/coiffure et équipements amovibles ne sont pas réalisés. Il ne clôt pas tous les critères ART-01 à ART-12 de l’issue #27. L’archive V2 et ses dix fichiers demeurent exacts.

## Reproduire et vérifier

Depuis la racine du dépôt : `python3 -m http.server 8765 --bind 127.0.0.1`, puis ouvrir `http://127.0.0.1:8765/tools/character-studio/isometric/`.

- `build-catalog.mjs chemin-vers-sources.json` normalise les planches. Le JSON associe chaque identifiant au chemin de sa source. Aucune retouche artistique dans ce script : détourage, découpe et placement uniquement, sans agrandissement des sources.
- Les cellules finales font 384 × 640, ancrées en `[192,615]` ; les planches natives font 1536 × 1280. Deux planches utilisent `segmentation: components` pour préserver leurs silhouettes complètes lorsque leurs rectangles se croisent. Les découpes ambiguës sont rejetées.
- `node tools/character-studio/isometric/verify-catalog.mjs` contrôle inventaire, empreintes, transparence, marges, palettes et masques.
- `catalog-tests.html` teste les 53 sélections, recolorations, changements d’orientation, vrais exports PNG, sélection rapide, filtres, recherche, responsive et export d’une planche pendant un changement de personnage.
- `tests.html` conserve les vérifications approfondies du pilote Ryuu masculin.
- `python3 tools/art/import_reference_bundle.py --verify-only` vérifie les dix fichiers V2.

Voir [périmètre, influences et méthode](../../../docs/art/ISOMETRIC_CATALOG_PRODUCTION.md). Les sections ci-dessous conservent l’explication technique du pilote et de son premier lot de directions.

---

# Ryuu — pilote 2D isométrique

Décision utilisateur du 15 octobre 2026 : « dans ce cas là fait la version dofus 2 en isométrique ». Cette étude remplace la direction 3D pour la suite du chantier. Aucun asset de Dofus n’est utilisé.

Ouvrir `tools/character-studio/isometric/` depuis le serveur HTTP du dépôt. Exemple depuis sa racine : `python3 -m http.server 8765 --bind 127.0.0.1`, puis http://127.0.0.1:8765/tools/character-studio/isometric/.

## Livraison à examiner

Huit sprites dessinés de **Ryuu masculin, pose de repos : face, dos, droite, gauche et quatre diagonales**, avec cinq couleurs réellement actives, trois ambiances, sauvegarde locale, grille isométrique, mode détail, comparaison avec la fiche originale et export PNG transparent. `assets/ryuu-male-se.png` est le PNG exporté par le vrai bouton, palette initiale, 1254 × 1254. La grille et l’ombre au sol sont séparées du personnage.

Le sprite est une nouvelle interprétation 2D produite avec Imagegen à partir du Ryuu original et de la cible visuelle appréciée. Le volume des cheveux, le visage, les plis, les motifs et la pose sont redessinés ; aucune identité pixel à pixel avec la fiche n’est revendiquée. Le bouton Comparer montre le recadrage original sans retouche. Les deux prompts exacts et les empreintes sont dans `assets/`. La première génération avait un damier opaque ; la seconde a remplacé ce fond par un vert de détourage. `removeChroma` dans `sprite.js` normalise ensuite l’alpha de façon déterministe. Les contours fins restent à examiner sur fond sombre avant production.

**Historique du pilote, avant son approbation et la demande de généralisation.** Ce premier lot portait sur les huit orientations masculines ; la base féminine est désormais dans le catalogue. Les animations, changements de visage/coiffure et équipements amovibles restent absents. Les équipements présents gardent leurs couleurs, mais ne constituent pas encore des calques amovibles. Le pilote n’achève donc pas ART-01 à ART-12. L’archive V2 et ses dix fichiers restent intacts.

## Méthode reproductible

1. Partir de la fiche canonique ; produire et faire approuver une seule pose de repos à la perspective du jeu. Conserver prompt, source et SHA-256 ; ne pas traiter les générations comme déjà validées.
2. Fixer toile, échelle et ancre au sol. Ici : 1254², ancre `[635,1205]`, vue sud-est, réduction douce pour ce dessin non pixel-art. Le contrôle « 160 px » désigne la hauteur de la toile dans le canvas interne ; l’affichage CSS s’adapte à l’écran.
3. Décrire chaque canal dans une recette JSON : polygones, exclusions, critères de matière et palette de référence. Les coordonnées et filtres sont propres à ce dessin ; ils ne doivent pas être copiés aveuglément vers un autre héros ou monstre. Le moteur commun `pipeline/mask-engine.js` résout la priorité et empêche le chevauchement des canaux.
4. Protéger yeux, dents et accessoires. Vérifier des points témoins d’équipement ainsi que les zones hors masque avec des palettes extrêmes ; examiner aussi les masques visuellement. Une couleur semblable ne suffit pas à identifier un matériau.
5. Employer la même fonction de recoloration pour l’aperçu et l’export. Garder les ombres du dessin, l’alpha et les zones fixes ; la palette initiale restitue exactement le sprite normalisé.
6. Produire les orientations avec le même sprite de référence, une échelle commune et une ancre au sol par vue, puis examiner la famille dans son ensemble. Les huit dessins sont distincts ; aucun miroir logiciel. Les parties interchangeables restent une étape distincte ; les bases féminines et les autres héros ont ensuite été ajoutés au catalogue.

| Canal | Zone de ce sprite |
| --- | --- |
| skin | Peau visible, hors yeux/dents |
| hair | Mèches, hors bandeau |
| clothing1 | Jambe anatomique droite, hors motifs dorés |
| clothing2 | Jambe anatomique gauche, hors motifs dorés |
| clothing3 | Gilet et liens textiles violets, hors cuirs et ornements |

Le bandeau, ses rubans, l’écharpe rouge, les cuirs et les ornements gardent leurs couleurs. Cette cartographie spécifique n’est pas la cartographie définitive de tous les costumes.

## Vérification

Ouvrir `tests.html` via le même serveur. Les contrôles utilisent l’atelier réel : cinq changements via les champs couleur, noir/blanc/cyan avec points témoins fixes, alpha et pixels hors masque, yeux/dents protégés, export PNG décodé comparé pixel à pixel au rendu de recoloration même si la prévisualisation des masques est activée, sauvegarde, comparaison, taille de jeu et absence de débordement à 400/640/900 px. Le test restaure la sauvegarde locale initiale.

Le point témoin du bandeau est `[710,300]` ; le premier emplacement `[647,284]` tombait sur une mèche et a été corrigé après inspection du sprite. Cela n’a pas nécessité de changer le masque des cheveux.

Pour les sources : `python3 tools/art/import_reference_bundle.py --verify-only`. Les essais 3D antérieurs restent archivés à leur emplacement ; ils ne servent pas de dépendance à cet atelier.

## Huit orientations — lot complémentaire

Demande utilisateur : « plusieurs orientations : face, dos, droite, gauche, etc ». Sept nouveaux dessins ont été produits par **Imagegen intégré**, chacun référencé au PNG sud-est conservé. Les prompts exacts sont dans `assets/direction-prompts.json` ; sources et SHA-256, ordre, taille visible et état de validation dans `assets/directions.json`. Les PNG sur fond vert et les sept recettes propres aux vues sont dans `assets/directions/`. Les sources générées sont conservées sans réécriture.

- Boussole de huit boutons ; flèches gauche/droite au clavier pour parcourir les orientations.
- Palette commune conservée en tournant. La sauvegarde mémorise aussi la direction ; l’ancienne sauvegarde reste lisible et n’est pas écrasée.
- « 8 vues » affiche la famille avec la palette courante. « Vue PNG » exporte la direction sélectionnée ; « 8 vues PNG » exporte une planche transparente 3072 × 2560, quatre colonnes et deux lignes, cellules 768 × 1280. Ordre : Dos, Dos droite, Droite, Face droite / Face, Face gauche, Gauche, Dos gauche.
- Chaque dessin conserve sa source 1254². Le champ `displayHeight` égalise la hauteur visible ; l’ancre de chaque recette place les pieds sur le sol. La planche exportée emploie une hauteur visible de 1100 px, ancre de destination `[384,1160]` dans chaque cellule. Aucun texte ni ombre au sol dans les PNG.
- Préparation des masques dans un Worker, chargement à la demande et cache par vue : le sélecteur reste réactif. Les réponses obsolètes ne remplacent pas la dernière direction demandée.

### Reconstructions et limites artistiques

Les faces cachées sont reconstruites, et non extraites de la fiche. En particulier le dos du gilet, les attaches arrière et la disposition arrière des motifs sont des propositions. Des variations de plis, de volume des cheveux, de position des rubans et de petits ornements persistent entre dessins ; la vue dos gauche comporte notamment un petit ornement dorsal qui n’est pas établi par la face. Cette famille est une **étude de directions**, pas un tour complet géométriquement exact ni une animation validée. La planche permet d’examiner ces écarts avant harmonisation et généralisation. Les silhouettes ne sont pas des rendus d’un modèle 3D.

Les canaux de pantalon suivent les jambes anatomiques et non le côté de l’écran. Les zones masquées par une main, une écharpe ou une autre jambe ne sont pas inventées dans le masque. Les témoins techniques de couleur ne remplacent pas l’inspection visuelle des bordures.

La planche de la palette initiale, exportée par le bouton réel, est conservée dans `assets/ryuu-8-directions.png` avec son empreinte dans le manifeste. Le script de contrôle parcourt maintenant les huit vues et leurs cinq canaux, les palettes extrêmes, les commandes réelles, chaque export PNG, la planche, les changements rapides de direction, le clavier et les largeurs mobiles. Les résultats du premier lot à une seule vue restent dans `verification.json` ; ceux de ce lot sont consignés séparément.
