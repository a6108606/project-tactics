# Ryuu masculin — étude 3D de formes

**Revue intermédiaire, fidélité insuffisante.** La cible Imagegen a reçu un retour positif ; le modèle présenté ici n’a pas reçu de validation artistique. Il ne remplace pas les cinq fiches originales et n’est pas généralisé à la base féminine.

[Ouvrir la vue manipulable](index.html) · [Source Blender](CH_Ryuu_master.blend) · [GLB](exports/ryuu-forms.glb) · [Brief](asset-brief.md).

## Résultat et limites

Le modèle est constitué de vrais volumes : corps, visage, mèches courbes, pantalon, gilet, cuirs, rubans et ornements. Aucune illustration n’est plaquée sur un plan pour représenter le personnage. Le navigateur affiche les matériaux PBR exportés, propose cinq couleurs, trois groupes d’équipements, les angles de vue, la sauvegarde locale et le PNG du canvas.

La pose reste trop symétrique, le visage trop proche d’une figurine, les mèches trop régulières ; le gilet, les bracelets, les motifs et les plis ne reproduisent pas encore la qualité de la cible. Des raccords de vêtements restent à reprendre. Le dos, les profondeurs, le profil et les surfaces couvertes sont inférés. Pas de rig, d’animation, de variantes visage/coiffure ni de base féminine dans cette étude.

## Contrôles effectivement réalisés

- Référence contre rendu : [planche](review/comparison.png), [mesures](review/comparison.json), lecture également à 128 pixels.
- IoU de silhouette **0,677**, seuil de travail du skill **0,85** au blocage des volumes, puis **0,90** aux formes : **seuil non atteint**. Le masque extrait automatiquement du papier et l’ombre au sol rendent ce nombre approximatif ; aucune prétention à une mesure anatomique exacte. Aucune validation de formes acquise.
- Vues argile [face](review/clay/clay_front.png), [profil](review/clay/clay_side.png), [dos](review/clay/clay_back.png), [caméra de comparaison](review/clay/clay_ref.png).
- Géométrie évaluée : **99 278 triangles**, sous le plafond d’étude de 100 000. [Rapport](review/validate.json) sans échec bloquant dans ce périmètre, mais avec avertissements : UV absents, ngones, sommets proches aux extrémités et noms de données à nettoyer. Ce n’est pas une validation pour animation ou production.
- Réimportation du GLB dans une scène Blender vide : **1,8359 m**, écart inférieur à 1 % à la hauteur de travail de 1,85 m ; aucune erreur dans [le rapport](review/roundtrip/roundtrip.json). Le rendu Workbench du script du skill échouait sur EGL ; le contrôle a été effectué avec un rendu Cycles CPU.
- Navigateur : **24 vérifications réussies**, [rapport](review/browser-report.json), [page à relancer](tests.html). Chacune des cinq couleurs change les pixels sans modifier les matériaux fixes ; les trois groupes d’équipements et les quatre vues changent le rendu ; le PNG réellement produit par le bouton est identique pixel par pixel après décodage ; sauvegarde et largeur 400/640 vérifiées.
- Les dix fichiers sources ont été revérifiés par l’outil d’import, sans modification.

## Reproduction et suite du travail

Blender 4.5.14 LTS, CPU. Le master contient l’échelle, les collections et les références préparées par `blender-image-to-3d/scripts/init_master.py`. Les copies de références dans `ref/` restent distinctes des sources immuables.

Depuis la racine du dépôt :

```sh
blender --background --threads 8 --python tools/character-studio/3d/forms/build/03_forms.py
python3 -m http.server 8765 --bind 127.0.0.1
```

Le script reconstruit uniquement les objets portant son marqueur `phase:03_forms`, sauvegarde le master, exporte le GLB et met à jour les empreintes. L’option `-- --all` produit aussi les vues matérielles face/profil/dos. Les rendus argile et la comparaison utilisent les scripts du skill installé, révision source `f0ef29385a03de139957e6f700b801cdc00b7e29`.

Prochaine action de production : reprendre la silhouette, l’asymétrie de pose, l’anatomie du visage et la construction du vêtement. Comparer les vrais rendus à la cible à chaque reprise. La méthode de construction paramétrique employée ici n’a pas démontré qu’elle atteint la qualité artistique souhaitée ; ne pas la dupliquer en série sur les autres héros et monstres. Les variantes, retopologie, UV et rig viennent après ce contrôle.

Skill appliqué : [blender-image-to-3d](https://github.com/majidmanzarpour/blender-game-skills). Les instructions de contrôle aident à constater les écarts ; elles ne convertissent pas automatiquement l’image en modèle de qualité équivalente.
