# Méthode de production — personnages et monstres

Objectif : préparer chaque créature une seule fois, puis réutiliser ses zones, ses contrôles de fidélité et ses exports. Le moteur reste commun ; le dessin et sa définition de zones constituent le travail propre à chaque créature.

Le pilote Ryuu a reçu un premier retour utilisateur positif le 15 octobre 2026 (« pas mal pour un début »). Cela autorise son amélioration et la standardisation de la méthode. Cela ne valide pas automatiquement toutes ses bordures ni de nouveaux visages/coiffures.

## Les deux outils

- **Atelier** : `http://127.0.0.1:8765/tools/character-studio/interactive/` — essayer des palettes, annuler/rétablir, remettre une couleur au canon, comparer, sauvegarder et exporter.
- **Préparation** : `http://127.0.0.1:8765/tools/character-studio/prepare/` — créer ou corriger les zones, protéger des détails et exporter une fiche de préparation. L’original n’est jamais modifié. Chaque export est un brouillon.

Depuis la racine du dépôt : `python3 -m http.server 8765 --bind 127.0.0.1`. Aucun paquet ni service externe n’est requis.

## 1. Constituer la source une seule fois

Pour une référence existante, conserver le PNG exact, avec son empreinte. Ne pas redessiner ni réencoder la référence pour faciliter le traitement. Un PNG RGB/RGBA 8 bits, non entrelacé, est pris en charge par le générateur actuel ; les autres encodages sont refusés avec une explication. Toute copie technique nécessaire doit être séparée et documentée, l’original restant intact.

Pour les futurs dessins, demander les éléments séparés dès leur création :

| Élément | Contrat de préparation |
| --- | --- |
| Référence canonique | Rendu aplati approuvé, dimensions et palette de référence. |
| Base | Corps et surfaces réellement dessinés sous les éléments amovibles ; silhouettes, ombres, lumières et texture conservées. |
| Zones de couleur | Masques nommés par matière/surface, contours et ombres préservés. Cinq canaux pour les héros actuels ; une à huit zones libres pour les créatures. |
| Visage / expressions | Même cadrage et points de raccord, identifiants stables ; références d’origine et écarts documentés. |
| Cheveux / fourrure / crête | Parties avant et arrière séparées si une pièce portée les occulte. |
| Équipements | Éléments avant/arrière séparés, sans héritage automatique des couleurs du corps. |
| Occlusions | Règles explicites : ce qui passe devant, ce qui est masqué, ce qui doit être dessiné sous l’élément. |

Un master en calques peut contenir du vectoriel et des textures peintes. Le contrat de calques compte davantage que le format du master. Le moteur livré ici traite **les surfaces visibles d’une source aplatie** ; l’assemblage des variantes et équipements reste une phase distincte, pas une fonction déjà terminée.

Un monstre n’est pas obligé d’avoir des bases masculine/féminine : `base_id` peut être `default`, `juvenile`, `armored`, etc. Ne créer que les bases réellement dessinées. Les zones peuvent être `fur`, `shell`, `horns`, `markings`, etc. Le moteur ne déduit pas l’anatomie à partir du nom.

## 2. Ouvrir une fiche de préparation

Une fiche JSON correspond à **une créature × une base × une vue**. Les deux exemples réels sont dans `tools/character-studio/recipes/ryuu-*.json`. Les identifiants utilisent des lettres minuscules et des tirets ; conserver les identifiants une fois diffusés.

Pour une nouvelle source déjà déposée sous `content/`, Node 22 ou plus récent :

```sh
node tools/character-studio/pipeline/cli.mjs new <identifiant> <character|monster> <base> <content/...png>
```

Cette commande calcule l’empreinte, crée un brouillon sans contour, et refuse d’écraser une fiche existante. Elle ne dessine aucune créature. Ouvrir ensuite le JSON dans l’outil de préparation. Autre entrée possible : « Ouvrir un PNG » prépare un brouillon en mémoire ; placer ensuite une copie exacte de ce PNG au chemin indiqué dans la fiche exportée.

Le format est décrit par [asset_recipe.schema.json](../../tools/character-studio/pipeline/asset_recipe.schema.json), complété par les contrôles croisés de `recipe.js` : cadrage, ancrage, positions, ordre des canaux, identité et statut. Toutes les coordonnées désignent les pixels de la source ; le cadrage est `[gauche, haut, largeur, hauteur]`. L’ancrage se situe au sol, à l’intérieur du cadrage.

## 3. Délimiter et protéger

1. Choisir le cadrage et l’ancrage. Éviter de changer ces coordonnées entre variantes d’une même base.
2. Ajouter les zones nécessaires, avec un libellé parlant et leur couleur canonique. Utiliser « Prélever la couleur canonique » sur une surface représentative, hors ombre profonde et reflet.
3. Tracer les contours à recolorer. Les exclusions sont propres à la zone ; les protections globales priment sur **toutes** les zones, y compris la peau sélectionnée par composantes.
4. Pour les anciens PNG à texture complexe, une sélection par points peut utiliser un filtre de matériau **à l’intérieur d’une région limitée**. Les paramètres sont explicites dans la fiche. L’éditeur permet de déplacer/ajouter les points d’une telle zone ; la conception du filtre reste dans le JSON. Ne pas dupliquer les filtres de Ryuu sur une autre matière sans les examiner.
5. Placer des témoins sur les équipements : pixels qui doivent rester inchangés. Examiner aussi leurs contours : quelques témoins ne prouvent pas l’intégralité d’un équipement.
6. Comparer l’original, les zones et une couleur très contrastée. Annuler/rétablir les corrections. Les tracés peuvent aussi être entrés par coordonnées au clavier.

Le brouillon est sauvegardé localement après chaque modification et peut être repris. Pour un PNG local qui n’est pas encore dans le dépôt, il faut rouvrir le PNG correspondant à son empreinte. **Exporter la fiche** pour la transmettre : le stockage du navigateur ne remplace pas le versionnement.

La fiche enregistre ordre des zones, sources et empreintes, cadrage, ancrage, filtres locaux, exclusions, protections, témoins d’équipement et statut. Aucun algorithme n’invente les parties cachées du dessin.

## 4. Vérifier et générer par lot

Remettre la fiche exportée sous `tools/character-studio/recipes/`, puis :

```sh
node tools/character-studio/pipeline/cli.mjs check
node tools/character-studio/pipeline/cli.mjs build
node tools/character-studio/pipeline/cli.mjs build --check
```

- `check` vérifie toutes les fiches ; des chemins JSON peuvent être fournis pour un lot ciblé. Erreurs : mauvais SHA-256, dimensions/cadrage incompatibles, identifiants en double, témoin d’équipement recolorable. Une zone vide est un avertissement en brouillon et une erreur pour un pilote ou un asset approuvé.
- `build` génère le catalogue lu par les outils, les masques PNG, trois preuves par fiche (canon, couleurs contrastées, zones) et leurs empreintes.
- `build --check` vérifie que les dérivés versionnés sont exactement reproductibles ; ne modifie aucun fichier.

Les comparaisons sont dans [evidence/catalog/index.html](evidence/catalog/index.html). Les brouillons y restent clairement identifiés ; ils ne sont pas activés dans le sélecteur des fiches utilisables par l’atelier. La préparation peut les ouvrir pour les poursuivre.

Les outils n’effacent pas automatiquement d’anciens dossiers de preuves : retirer explicitement les dérivés d’une créature supprimée dans sa PR, après vérification.

## 5. Valider et réutiliser

| Statut | Signification |
| --- | --- |
| `draft` | Préparation incomplète ou modifiée ; non activée comme apparence de production. |
| `pilot` | Propre à être examinée ; pas de validation esthétique finale implicite. |
| `approved` | Validation esthétique explicite, avec auteur et date dans `review`. Les tests seuls ne donnent jamais ce statut. |

Avant promotion : original canonique pixel-identique, zones cohérentes sous couleurs extrêmes, équipements et alpha conservés, mêmes dimensions/ancrage, export fidèle et reconstruction signalée. La validation des reconstructions appartient à l’utilisateur avant leur généralisation. Incrémenter `revision` quand une modification change le rendu ou la correspondance des zones ; ne pas réinterpréter silencieusement d’anciennes apparences sauvegardées.

Le catalogue et l’outil de préparation acceptent les nouveaux personnages et monstres sans modification du moteur. **L’atelier des héros actuel conserve ses cinq références V2 et son contrat d’apparence à cinq canaux.** L’ajout d’une créature à son interface de jeu/catalogue final demandera ses métadonnées de présentation et, si nécessaire, une évolution explicite du schéma d’apparence ; ajouter une fiche ne prétend pas terminer cette intégration.

## Vérifications du procédé

```sh
python3 tools/art/import_reference_bundle.py --verify-only
node tools/character-studio/interactive/tests/run.mjs
node tools/character-studio/pipeline/tests.mjs
```

La suite initiale vérifie les vrais pixels de Ryuu. La suite commune couvre une base de monstre et des zones arbitraires sur une petite fixture technique (aucun nouveau dessin), la priorité des protections, les erreurs de définition, les empreintes, les fuites sur équipements, le PNG, l’historique et la reproductibilité du catalogue. La page `interactive/tests/browser.html` vérifie aussi le PNG produit par Canvas.

La migration du pilote Ryuu vers les fiches de préparation a produit **zéro octet RGBA différent** sur les deux rendus personnalisés de preuve. Les sources V2 restent intégralement identiques.
