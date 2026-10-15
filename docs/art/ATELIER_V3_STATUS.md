# Atelier V3 — reprise de l’issue #27

État au 15 octobre 2026 : **sources V2 complètes et vérifiées ; pilote de recolorisation Ryuu disponible ; atelier modulaire complet non terminé**. Aucun élargissement aux autres héros sans validation du pilote.

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

## Pilote utilisable

Ouvrir `tools/character-studio/interactive/` via le serveur local indiqué dans son [README](../../tools/character-studio/interactive/README.md).

- Interface issue de V2, conservant couleurs, typographie système, organisation et navigation.
- Deux bases de Ryuu : cinq couleurs appliquées au dessin central, comparaison canon/personnalisé, visualisation des masques, remise au canon, sauvegardes, JSON versionné et PNG fidèle au rendu courant.
- Les dix bases sont consultables, mais seules les deux bases Ryuu sont recolorisables.
- Visages et coiffures : canon uniquement, **0 variante composable**. Les neuf études de chaque catégorie restent visibles et désactivées comme choix de production.
- Équipements intégrés au PNG, retrait désactivé avec explication. Vues iso et poses explicitement statiques.

Les trois zones textiles proposées sont les deux jambes du pantalon et le panneau central sous la ceinture. Les bandeaux, les cuirs, les pans rouges et les ornements sont exclus. Cette affectation est une proposition technique, pas une décision esthétique déjà approuvée.

Le [manifeste dérivé](../../tools/character-studio/interactive/assets/manifest.json) décrit source, recadrages entiers, dimensions, ancrages, masques, empreintes et statut. Les [comparaisons](evidence/ryuu-pilot/index.html) utilisent les mêmes cadrages et dimensions. Tous les dérivés peuvent être régénérés avec Node 22 sans paquet supplémentaire.

## Reconstructions et décision artistique

Aucune reconstruction n’est intégrée au rendu livré. Deux essais ont été rejetés pendant la préparation :

1. Une retouche générative limitée à la tête masculine a déplacé des détails du visage et du bandeau. Elle n’est pas devenue un asset de l’atelier.
2. Une adaptation de pixels entre les deux grandes têtes de Ryuu a conservé des contours parasites et rendu incohérent le raccord de l’attache. Elle n’est pas devenue une variante sélectionnable.

La suppression des mèches actuelles dévoile des régions absentes du PNG : front, raccord aux oreilles, arrière de tête et jonction avec le bandeau. Les petites études ne fournissent pas des calques complets à la résolution des grandes illustrations. Le dialogue « Préparation des variantes » localise ces régions. Le simple agrandissement d’une vignette ne convient pas.

La question d’un redessin en SVG a été soulevée par l’utilisateur. Un SVG entièrement reconstruit permettrait de séparer formes et couleurs, mais changerait potentiellement le rendu peint approuvé. Aucune bascule vers un redessin complet n’a été effectuée. Une approche hybride conserve les pixels du corps et des équipements, et limite la reconstruction aux variantes de tête. Toute solution doit encore produire des variantes locales fidèles et leur avant/après avant généralisation.

## Vérifications effectuées

- `node tools/character-studio/interactive/tests/run.mjs` : **83 PASS / 0 FAIL**, détail dans [test-report.json](evidence/ryuu-pilot/test-report.json).
- Page `tests/browser.html` : **74 PASS / 0 FAIL**, dont export Canvas PNG, décodage et égalité RGBA exacte sur les deux bases.
- Export déclenché depuis l’interface : `project-tactics-ryuu-feminine-v3.png`, 202 × 533 pixels ; décodage du fichier téléchargé et égalité RGBA exacte avec le rendu de preuve féminin.
- Parcours navigateur : couleurs, sauvegarde d’une apparence féminine, retour au canon, rechargement de la sélection, rechargement de page, conservation des valeurs, héros non pris en charge désactivés, navigation des onglets au clavier et comparaison à l’original.
- Mise en page observée à largeur CSS 480 et à 2560 pixels ; pas de débordement horizontal de la page à 480 pixels (hors carrousel voulu des héros). La vérification exhaustive des appareils et lecteurs d’écran reste à faire.
- Échec du stockage testé par injection d’accès interdit et de quota dépassé dans l’adaptateur utilisé par l’interface. Le message d’échec est explicite ; aucun test navigateur de quota réellement saturé.

Les sentinelles d’équipement sont des points choisis dans le bandeau, écharpe, cuir, ceinture, pan rouge et protection de jambe. Les tests vérifient également **tous** les pixels hors masque et l’alpha. Ils ne prouvent pas l’exhaustivité sémantique d’une matte d’équipement, qui n’existe pas encore. La revue visuelle reste nécessaire, notamment aux petites bordures.

## État ART-01 à ART-12

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

Le lot actuel est une preuve intermédiaire à examiner, pas une livraison finale de l’issue #27. La suite doit résoudre les variantes de forme et les occlusions sur Ryuu masculin/féminin, puis obtenir la validation esthétique avant les huit autres bases. Le choix éventuel d’une reconstruction SVG doit être éprouvé visuellement sur Ryuu, sans substituer silencieusement un autre style aux fiches approuvées. La PR reste en brouillon et l’issue ouverte.
