# Atelier V3 — reprise de l’issue #27

État au 15 octobre 2026 : **sources V2 complètes et vérifiées ; direction active : 2D isométrique, Ryuu masculin dans huit directions, à valider artistiquement**. Le [nouvel atelier](../../tools/character-studio/isometric/index.html) dispose de cinq couleurs partagées entre huit directions, comparaison, grille, planche d’ensemble et exports PNG transparents (vue ou huit vues). [Méthode, provenance et limites](../../tools/character-studio/isometric/README.md).

L’utilisateur demande désormais une version dans l’esprit de Dofus 2 en isométrique après les essais de vraie 3D. Le [suivi 3D](RYUU_3D_REVIEW.md) est conservé comme historique. Les résultats du pilote 2D antérieur ci-dessous ne constituent pas la validation du nouveau sprite. ART-03, ART-04, ART-07 et ART-08 restent ouverts ; ni les dix bases ni les variantes de forme ne sont achevées.

## Base et isolation

- Branche : `feat/art-character-studio-v3`, PR #28 en brouillon.
- Départ : `d00661b35b2cf7a3a148c10732f45655df922070`, passation PR #26 `docs/art-design-lock-v2-handoff`.
- Documents de référence : `CHARACTER_DESIGN_LOCK.md`, `INTERACTIVE_ATELIER_HANDOFF.md`, `reference_bundle_manifest.json` et `IMPORT_VALIDATION.md`.
- Aucun changement de gameplay, combat, statistiques, voies, CI ou réglages du dépôt. PR #25 et travaux parallèles non modifiés.

## Import exact terminé

Archive fournie par l’utilisateur : `project_tactics_atelier_v2_references.zip`, 25 457 621 octets.

SHA-256 : `952e92e34747c01dba3de26e2ff68f378338e77489f21a8b1d33137ebe66aeb3`.

L’outil fourni `tools/art/import_reference_bundle.py` a vérifié l’archive et chacun des fichiers : **5 importés, 5 déjà présents et préservés**. Les cinq PNG avaient été récupérés dans la conversation « Créer un atelier HTML Dofus » puis vérifiés avec le même manifeste. L’archive a confirmé leur identité.

Les dix fichiers sont versionnés sous `content/art/characters/reference-v2/` : `atelier.html`, les cinq PNG de `references/`, `README_FR.md`, `appearance_reference_v2.schema.json`, `design_lock_v2.json` et `validation_tests.json`. Aucun réencodage, remplacement ou recréation du HTML V2. Les empreintes et tailles détaillées restent celles de `reference_bundle_manifest.json`.

Commande de contrôle : `python3 tools/art/import_reference_bundle.py --verify-only` → **PASS: 10 approved files, exact sizes and SHA-256**.

## Pilote 2D conservé

Ouvrir `tools/character-studio/interactive/` via le serveur local indiqué dans son [README](../../tools/character-studio/interactive/README.md).

- Interface V3 à deux panneaux : choix illustrés et aperçu, conservant les couleurs parchemin/bleu nuit/doré et les cinq héros. La V2 archivée reste immuable.
- Deux bases de Ryuu : cinq couleurs appliquées au dessin central, comparaison canon/personnalisé, visualisation des masques, remise au canon, sauvegardes, JSON versionné et PNG fidèle au rendu courant.
- Les dix bases sont consultables, mais seules les deux bases Ryuu sont recolorisables.
- Visages et coiffures : canon uniquement, **0 variante composable**. Les neuf études de chaque catégorie restent visibles et désactivées comme choix de production.
- Équipements intégrés au PNG, retrait désactivé avec explication. Vues iso et poses explicitement statiques.

Les trois zones textiles proposées sont les deux jambes du pantalon et le panneau central sous la ceinture. Les bandeaux, les cuirs, les pans rouges et les ornements sont exclus. Cette affectation est une proposition technique, pas une décision esthétique déjà approuvée.

Le [manifeste dérivé](../../tools/character-studio/interactive/assets/manifest.json) décrit source, recadrages entiers, dimensions, ancrages, masques, empreintes et statut. Les [comparaisons](evidence/ryuu-pilot/index.html) utilisent les mêmes cadrages et dimensions. Tous les dérivés peuvent être régénérés avec Node 22 sans paquet supplémentaire.

## Standardisation après le premier essai utilisateur

Le retour « pas mal pour un début » a été suivi d’une demande d’amélioration et de standardisation pour de nombreux personnages et monstres. Le procédé est désormais décrit dans [ASSET_PRODUCTION_METHOD.md](ASSET_PRODUCTION_METHOD.md).

- Définitions de Ryuu sorties du moteur vers deux fiches JSON versionnées. Le moteur commun accepte une à huit zones nommées librement, une base arbitraire et les types personnage/monstre. Les rendus de contrôle masculin et féminin restent identiques octet RGBA pour octet RGBA au pilote `e524227`.
- Éditeur visuel sous `tools/character-studio/prepare/` : contours, exclusions, protections globales, témoins d’équipement, ordre des zones, couleur canonique, ancrage, annuler/rétablir, saisie des points au clavier, export JSON/PNG et récupération du brouillon local.
- Vérificateur/générateur par lot : identité des sources, validité des définitions, détection des témoins recolorables, refus des zones vides pour les pilotes, empreintes du moteur, masques et comparaisons reproductibles. Les brouillons n’activent pas de nouvelle apparence de production.
- Atelier amélioré : trois palettes de départ, retour au canon par couleur, annuler/rétablir par base. Les empreintes PNG sont également contrôlées lors de l’ouverture dans le navigateur.
- 14 tests du procédé commun passent, en plus des 83 contrôles du pilote. Une fixture technique vérifie le cas d’un monstre avec une seule base et un canal arbitraire ; aucun monstre dessiné n’est ajouté.
- Parcours éditeur vérifié : une protection réduit la couverture des cheveux de 10 653 à 10 278 pixels ; Annuler retrouve 10 653. Ajout/retrait d’une sixième zone, export brouillon vérifié par le CLI et récupération après rechargement.

Les critères ART-03, ART-04, ART-07 et ART-08 restent ouverts : cette standardisation ne prétend pas fournir des variantes de forme ni dix bases modulaires. L’atelier des cinq héros conserve son contrat V3 à cinq canaux ; les nouvelles créatures peuvent être préparées et examinées dans le catalogue, leur intégration finale reste distincte.

## Interface inspirée du site proposé par l’utilisateur

Après le retour « J’aime pas », l’atelier a été réorganisé selon les interactions observées sur [skin.souff.fr](https://skin.souff.fr/) : sélection visuelle à gauche, personnage à droite et commandes compactes. Aucun code ni asset de ce site n’est importé.

- Quatre onglets : Personnage, Couleurs, Équipements, Références. Portraits des cinq héros, vignettes des deux bases, études regroupées et états disponibles/indisponibles explicites.
- Palettes de départ visibles avant application, retour à l’origine par couleur, historique près de l’aperçu, comparaison et bouton PNG direct.
- Fiches, charte et outils de préparation restent accessibles dans Références. Les explications de production ne remplissent plus le parcours de personnalisation.
- Nouvel habillage autonome dans `studio.css`, sans changement des sources, recettes, masques, pixels de rendu ou format des sauvegardes.
- Vérification du parcours : palette Ivoire, annulation, rétablissement, comparaison (426 × 563 pour Ryuu féminin), export désactivé en comparaison, bases indépendantes après palettes distinctes, Kael non personnalisable correctement désactivé, onglets au clavier et ouverture/fermeture de fiche.
- Largeurs CSS observées : 480, 1280 et 2560 pixels ; pas de débordement horizontal à 480. Sur mobile les panneaux s’empilent ; l’aperçu reste fixe dans la colonne droite sur bureau.
- Export depuis le nouveau bouton : PNG féminin 202 × 533, empreinte RGBA `7e059d5a651eea4dcd1c9d4a9dc9e44124d1c0761559d87fa879942b09676611`, identique au témoin Nuit & jade. 83 contrôles pilote, 14 tests du procédé, 74 contrôles navigateur et contrôle du catalogue passent. Les dix sources gardent leurs empreintes.

Cette refonte d’interface n’ajoute pas de variante de forme ni de nouvelle approbation artistique. ART-03, ART-04, ART-07 et ART-08 restent ouverts.

## Disponibilité explicite des couleurs

Sur Kael, Sela, Leo et Lina, l’onglet Couleurs affiche désormais « Référence uniquement », une palette non interactive et un accès explicite au pilote Ryuu. Les champs et palettes d’essai indisponibles sont masqués ; le texte ne promet plus une modification du dessin. Le parcours Sela → Ryuu est vérifié dans le navigateur. Les liens du script et de la feuille de style sont versionnés pour éviter le mélange avec une ancienne interface en cache.

Le choix d’une vraie 3D stylisée a ensuite été confirmé par l’utilisateur. Deux modèles Ryuu sont maintenant disponibles dans l’atelier séparé `tools/character-studio/3d/`, avec validation du rendu encore en attente. Voir [la revue 3D](RYUU_3D_REVIEW.md).

## Reconstructions et décision artistique

Aucune reconstruction n’est intégrée au rendu **2D** livré. Le pilote 3D séparé reconstruit l’ensemble du modèle et le signale explicitement. Deux essais ont été rejetés pendant la préparation :

1. Une retouche générative limitée à la tête masculine a déplacé des détails du visage et du bandeau. Elle n’est pas devenue un asset de l’atelier.
2. Une adaptation de pixels entre les deux grandes têtes de Ryuu a conservé des contours parasites et rendu incohérent le raccord de l’attache. Elle n’est pas devenue une variante sélectionnable.

La suppression des mèches actuelles dévoile des régions absentes du PNG : front, raccord aux oreilles, arrière de tête et jonction avec le bandeau. Les petites études ne fournissent pas des calques complets à la résolution des grandes illustrations. Références → Outils de création → « Préparation de Ryuu » localise ces régions. Le simple agrandissement d’une vignette ne convient pas.

La question d’un redessin en SVG a été soulevée par l’utilisateur. Un SVG entièrement reconstruit permettrait de séparer formes et couleurs, mais changerait potentiellement le rendu peint approuvé. Aucune bascule vers un redessin complet n’a été effectuée. Une approche hybride conserve les pixels du corps et des équipements, et limite la reconstruction aux variantes de tête. Toute solution doit encore produire des variantes locales fidèles et leur avant/après avant généralisation.

## Vérifications effectuées

- `node tools/character-studio/interactive/tests/run.mjs` : **83 PASS / 0 FAIL**, détail dans [test-report.json](evidence/ryuu-pilot/test-report.json).
- Page `tests/browser.html` : **74 PASS / 0 FAIL**, dont export Canvas PNG, décodage et égalité RGBA exacte sur les deux bases.
- Export déclenché depuis l’interface : `project-tactics-ryuu-feminine-v3.png`, 202 × 533 pixels ; décodage du fichier téléchargé et égalité RGBA exacte avec le rendu de preuve féminin.
- Parcours navigateur : couleurs, sauvegarde d’une apparence féminine, retour au canon, rechargement de la sélection, rechargement de page, conservation des valeurs, héros non pris en charge désactivés, navigation des onglets au clavier et comparaison à l’original.
- Mise en page observée à largeur CSS 480 et à 2560 pixels ; pas de débordement horizontal de la page à 480 pixels. La vérification exhaustive des appareils et lecteurs d’écran reste à faire.
- Échec du stockage testé par injection d’accès interdit et de quota dépassé dans l’adaptateur utilisé par l’interface. Le message d’échec est explicite ; aucun test navigateur de quota réellement saturé.

Les sentinelles d’équipement sont des points choisis dans le bandeau, écharpe, cuir, ceinture, pan rouge et protection de jambe. Les tests vérifient également **tous** les pixels hors masque et l’alpha. Ils ne prouvent pas l’exhaustivité sémantique d’une matte d’équipement, qui n’existe pas encore. La revue visuelle reste nécessaire, notamment aux petites bordures.

## État ART-01 à ART-12 du pilote 2D

| Critère | État et preuve |
| --- | --- |
| ART-01 | **Validé techniquement** : archive et dix fichiers exacts ; sources versionnées. |
| ART-02 | **Validé techniquement pour le canon Ryuu** : égalité RGBA au recadrage V2 ; comparaisons fournies. Aucun nouveau design approuvé par l’utilisateur. |
| ART-03 | **Non réalisé** : aucun visage modulaire accepté ; contrôle désactivé. |
| ART-04 | **Non réalisé** : aucune coiffure modulaire acceptée ; contrôle désactivé. |
| ART-05 | **Partiel** : cinq canaux sur les deux Ryuu, quatre couleurs extrêmes testées par canal ; affectation et finition des masques à examiner. |
| ART-06 | **Partiel** : invariance des sentinelles d’équipement, des pixels hors masque et de l’alpha ; matte exhaustive et équipements indépendants absents. |
| ART-07 | **Non réalisé** : pas de retrait d’équipement ; aucun remplissage caché inventé. |
| ART-08 | **Non réalisé dans son ensemble** : 2 bases recolorisables, 10 consultables, 0 variante de forme ; pas de généralisation. |
| ART-09 | **Validé pour le périmètre du pilote** : canon exact, états indépendants, sauvegarde/rechargement et JSON reproduisent le rendu. |
| ART-10 | **Validé pour le périmètre du pilote** : PNG identique au rendu personnalisé, y compris fichier téléchargé ; imports invalides refusés. |
| ART-11 | **Partiel** : clavier, petite largeur et erreurs de stockage vérifiés dans les limites ci-dessus ; audit complet restant. |
| ART-12 | **Respecté** : seuls sources exactes, outil esthétique, preuves et documentation ajoutés/modifiés. |

## Suite

Le pilote 3D Ryuu masculin/féminin doit maintenant être examiné artistiquement. Les formes et le rendu proposés ne sont pas encore validés. Après retours et corrections sur Ryuu, appliquer la méthode aux autres bases uniquement avec validation de la direction. La PR reste en brouillon et l’issue ouverte.
