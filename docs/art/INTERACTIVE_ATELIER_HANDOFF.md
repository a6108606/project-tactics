# Passation Work — Atelier V3 réellement personnalisable

## Mission

Reprendre l'atelier HTML V2 approuvé et produire un prototype de validation où **les changements de visage, de coiffure et de chacune des cinq couleurs modifient réellement l'illustration centrale**, pour les cinq héros et leurs deux bases. Le design est déjà validé : il ne faut ni refaire la direction artistique ni redessiner librement les personnages.

Lire d'abord `docs/art/CHARACTER_DESIGN_LOCK.md`, puis `docs/art/reference_bundle_manifest.json`. Ce chantier est esthétique uniquement, indépendant des travaux de combat et d'équilibrage.

## 0. Vérifier les fichiers avant de commencer

La première publication GitHub de cette passation contient le cadrage, le manifeste et l'outil d'import. **Elle ne constitue pas une livraison des gros PNG ni de l'HTML sur GitHub.** Ces fichiers sont dans le paquet approuvé `project_tactics_atelier_v2_references.zip`, joint à la conversation.

Dans un checkout de `a6108606/project-tactics` contenant cette passation :

```sh
python3 tools/art/import_reference_bundle.py --verify-only
# Seulement si des fichiers sont absents :
python3 tools/art/import_reference_bundle.py /chemin/project_tactics_atelier_v2_references.zip
python3 tools/art/import_reference_bundle.py --verify-only
```

L'outil valide le SHA-256 du ZIP et de chaque fichier, ne fait aucun téléchargement et refuse d'écraser une source différente. Après vérification, versionner le dossier importé dans une branche dédiée. Ne jamais publier une chaîne `sandbox:/...` comme lien de source exploitable par GitHub.

Un second paquet de passation peut contenir un dossier `repository/` déjà disposé selon les chemins du dépôt : copier ses fichiers manquants sans remplacer des changements parallèles, puis exécuter `--verify-only`. Si une source manque réellement, la demander ; **ne pas la remplacer par une nouvelle génération**.

## 1. Reprendre l'interface, pas seulement ses contrôles

Point de départ après import : `content/art/characters/reference-v2/atelier.html`.

Conserver la navigation Ryuu / Kael / Sela / Leo / Lina, le choix des deux bases, le zoom, l'accès aux fiches originales, la sauvegarde des sélections et la présentation parchemin / bleu nuit / doré. Créer la V3 dans `tools/character-studio/interactive/` ; ne pas modifier la V2 archivée.

À l'écran : **visage**, **coiffure**, **peau**, **couleur des cheveux**, **vêtement 1**, **vêtement 2**, **vêtement 3**. Une interaction validée doit modifier le rendu, pas seulement un JSON, une étiquette ou une pastille.

Prévoir un témoin « référence originale / rendu personnalisé », une remise à zéro canonique, et la visibilité des équipements lorsque leurs vrais calques existent. Tout contrôle non pris en charge doit être désactivé et expliqué, jamais simuler un résultat.

## 2. Produire les données visuelles nécessaires

Les sources sont des images aplaties. Elles ne contiennent pas déjà un corps complet sous les vêtements, des cheveux derrière un casque ou des calques d'équipement séparés.

Commencer par **Ryuu, bases masculine ET féminine**, dans une vue principale cohérente avec la fiche. Ce pilote sert à valider le procédé, pas à limiter le périmètre final. Après preuve visuelle, appliquer le même système à Kael, Sela, Leo et Lina : dix bases au total.

Livrables par base :

- Source et zone d'extraction tracées ; cadrage et point d'ancrage stables.
- Base, visage, cheveux arrière/avant et zones textiles séparés autant que nécessaire.
- Cinq masques sémantiques de recolorisation, préservant contours, lumière, ombres et texture.
- Variantes de visage et coiffure réellement composables, dérivées fidèlement des études approuvées et identifiées individuellement. Ne pas confondre une expression ou une couleur de peau avec une nouvelle forme de visage.
- Équipements indépendants, ordre de composition et règles d'occlusion par base et vue.
- Manifeste des assets : identifiant, personnage, base, vue, dimensions, ancrage, calque, origine, empreinte et statut de validation.

Les masques ne doivent pas être obtenus par une simple sélection globale d'une teinte : deux objets peuvent partager une couleur sans partager un canal. Une recolorisation localisée sur une image aplatie peut servir de preuve intermédiaire, mais ne suffit pas à annoncer les variantes ou équipements modulaires terminés.

Une région cachée ou trop petite peut exiger une reconstruction locale. Documenter le manque et montrer un avant/après limité à cette région. Ne pas inventer une nouvelle tenue, changer les proportions, substituer un personnage générique, utiliser un SVG approximatif ou générer une nouvelle planche complète. La validation esthétique appartient à l'utilisateur.

## 3. Rendu et état

Choisir une implémentation adaptée aux calques disponibles (Canvas, WebGL ou autre), sans imposer un framework lourd. Le rendu central et l'export doivent utiliser le même état et le même assembleur.

État minimal cible :

```text
character_id, body_variant_id,
face_variant_id, hair_variant_id,
colors: { skin, hair, clothing1, clothing2, clothing3 },
equipment: { IDs et visibilité indépendants },
view_id, asset_manifest_version, schema_version
```

Une variante indisponible dans une base ne doit pas être sélectionnable. Un changement de base doit appliquer une correspondance documentée ou un défaut signalé, sans mélanger des calques incompatibles. Les paramètres d'un personnage ne doivent pas contaminer les autres.

Le schéma V2 encode des indices d'études et `configuration_applied: false`. Il ne doit pas être présenté comme un schéma V3. Créer un schéma versionné et une migration explicite : un indice d'étude n'est pas automatiquement un identifiant d'asset. La chaîne d'export doit restituer les pixels effectivement affichés.

Pas d'appel réseau nécessaire au rendu normal ; servir les assets localement pendant le développement. Préserver un mode d'ouverture simple documenté. Aucun envoi des fichiers à un service tiers n'est requis par cette passation.

## 4. Critères d'acceptation

| ID | Vérification attendue |
| --- | --- |
| ART-01 | Les cinq PNG et la V2 archivée correspondent exactement aux empreintes du manifeste. |
| ART-02 | Le rendu canonique respecte le dessin approuvé ; fournir une comparaison au même cadrage, pas seulement une promesse de fidélité. Tout écart ou reconstruction est signalé. |
| ART-03 | Changer le visage remplace réellement sa forme et conserve coiffure, tenue, couleurs et équipements. |
| ART-04 | Changer la coiffure remplace réellement les mèches et leur silhouette ; pas un filtre, un miroir ou une vignette simplement agrandie sur le front. |
| ART-05 | Chacun des cinq canaux agit uniquement sur sa zone. Tester une couleur très contrastée par canal, peau sombre, cheveux clairs et foncés. Préserver le modelé et les contours. |
| ART-06 | Les textures RGBA et palettes des équipements restent identiques sous toutes les recolorisations. Comparer les zones opaques du rendu ; aux bords semi-transparents, distinguer le mélange alpha normal d'une fuite de masque. |
| ART-07 | Basculer les équipements utilise leurs vrais calques. Aucun trou, aucune zone cachée inventée sans signalement ; casque/coiffure et cape/corps restent cohérents. |
| ART-08 | Les dix bases sont prises en charge, avec choix de variantes disponibles réellement fonctionnels et indépendants. La quantité de variantes doit être annoncée, pas supposée. |
| ART-09 | La remise à zéro retrouve le rendu canonique ; sauvegarde, rechargement et export/import JSON reproduisent la même apparence. |
| ART-10 | L'export PNG correspond au rendu personnalisé courant, et non à la fiche d'origine. Rejeter proprement les imports JSON invalides. |
| ART-11 | Les commandes, menus et textes restent utilisables au clavier et sur écran étroit ; l'échec du stockage local est explicite. |
| ART-12 | Aucun sort, statistique, voie élémentaire, fichier de combat, workflow CI ou réglage de dépôt modifié. |

Une preuve intermédiaire ne valide que les fonctions réalisées. Ne pas présenter des huit directions approximatives comme un jeu de sprites fini, ni faire passer un déplacement CSS d'une image pour une animation de personnage. Les animations et vues supplémentaires sont un lot distinct, après le pilote de personnalisation.

## 5. Livraison et gestion Git

Créer une branche `feat/art-character-studio-v3` depuis la dernière base pertinente contenant cette passation. Examiner les branches/PR ouvertes avant de travailler. Ne pas réécrire les commits ou modifier la PR d'exploration Godot, ni les travaux parallèles de sorts.

Livrer les sources, assets dérivés, manifests, procédure d'ouverture, schéma d'apparence, tests automatisés possibles et captures avant/après. Les résultats doivent distinguer : extraction technique, reconstruction proposée, validé par tests, validé esthétiquement par l'utilisateur, non réalisé.

Ouvrir une PR dédiée avec les preuves Ryuu puis la couverture des autres personnages. Ne pas déclarer le prototype complet tant que les contrôles continuent à laisser l'illustration centrale inchangée.
