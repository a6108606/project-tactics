# Atelier V3 — reprise de l’issue #27

État au 15 octobre 2026 : **import partiel des sources vérifié ; V3 non réalisée**.

## Base et isolation

- Branche : `feat/art-character-studio-v3`.
- Point de départ : `d00661b35b2cf7a3a148c10732f45655df922070`, tête de la PR #26, encore ouverte lors de la reprise.
- Documents lus : `CHARACTER_DESIGN_LOCK.md`, `INTERACTIVE_ATELIER_HANDOFF.md`, `reference_bundle_manifest.json` et `IMPORT_VALIDATION.md`.
- La PR #25 (`feat/p0-isometric-exploration`) et les travaux sur `main` ne sont pas modifiés.

## Sources récupérées

Les cinq pièces jointes ont été récupérées depuis la conversation **Créer un atelier HTML Dofus** (`6ad09d71-9a84-83eb-8107-553dc6caa2ba`). Seules les pièces dont la taille et le SHA-256 correspondent exactement au manifeste approuvé ont été copiées. Les trois autres images accessibles ne correspondent pas au manifeste et n’ont pas été importées.

| Pièce jointe | Destination sous `content/art/characters/reference-v2/` | Octets | SHA-256 |
| --- | --- | ---: | --- |
| `image(8).png` | `references/lina.png` | 3226784 | `46f46393362d85d6a5735f5cd58bea7df628fcd9d36d837f24820a692a76bc0a` |
| `image(7).png` | `references/leo.png` | 3265443 | `0db3e6ecf23e6717961254f5117f14a2858cd673b7ef2f17a615f2bcce01bc71` |
| `image(6).png` | `references/kael.png` | 3170445 | `6e922784ee9d86a10cfc2e6ba117a2dc966edbd8c3bf2ba51461a62a1cb2b0c1` |
| `image(5).png` | `references/sela.png` | 3234933 | `6e99506974ef8eee9d26bb77e658aab7723f7e79b41000e36f36171e6eb3ebed` |
| `image(4).png` | `references/ryuu.png` | 3233335 | `8d7e17983eee6b29abea9e7f4a52b87eb32a8c74771442591ad846913a475c20` |

Ces fichiers sont copiés octet pour octet : aucun réencodage, détourage ou redimensionnement. L’import a utilisé les fonctions `check_bytes`, `target_path` et `verify` de l’outil fourni, sans modifier celui-ci. Les cinq images passent la vérification des tailles et empreintes.

## Blocage restant

Le ZIP n’est pas disponible dans les pièces jointes exposées des conversations consultées, ni dans les emplacements locaux recherchés. Les liens de fichiers générés apparaissent comme des références de contenu sans fichier téléchargeable dans la lecture de la conversation. L’ouverture de cette conversation dans le navigateur intégré renvoie également une erreur de chargement.

Il manque les fichiers suivants, tous attendus sous `content/art/characters/reference-v2/` :

- `README_FR.md`
- `appearance_reference_v2.schema.json`
- `atelier.html`
- `design_lock_v2.json`
- `validation_tests.json`

Exécution de `python3 tools/art/import_reference_bundle.py --verify-only` après copie : **code de sortie 1**, avec exactement ces cinq fichiers signalés `MISSING`. Cela ne valide pas ART-01 dans son ensemble. L’empreinte de l’archive n’a pas pu être vérifiée.

Le paquet requis est `project_tactics_atelier_v2_references.zip` (25457621 octets ; SHA-256 `952e92e34747c01dba3de26e2ff68f378338e77489f21a8b1d33137ebe66aeb3`) ou `project_tactics_chara_design_work_handoff.zip`, qui contient les sources sous `repository/`.

## État des critères

| Critère | État de cette reprise |
| --- | --- |
| ART-01 | Partiel : cinq PNG exacts ; HTML V2 et quatre annexes absents. |
| ART-02 | Non réalisé : aucune composition V3 ni comparaison au même cadrage. |
| ART-03 / ART-04 | Non réalisés : aucune variante de visage ou coiffure composable. |
| ART-05 / ART-06 | Non réalisés : aucun masque ni test de recolorisation ou de conservation des équipements. |
| ART-07 | Non réalisé : aucun calque d’équipement indépendant. |
| ART-08 | Non réalisé : les cinq fiches couvrent les dix bases, mais aucune base n’est interactive. |
| ART-09 / ART-10 | Non réalisés : aucun état V3, sauvegarde, import/export JSON ou export PNG personnalisé. |
| ART-11 | Non réalisé : aucune interface V3 à tester. |
| ART-12 | Respecté pour ce lot : ajout des cinq PNG et de ce compte rendu uniquement. |

Aucun asset dérivé ni reconstruction locale n’a été créé. L’inspection de la fiche Ryuu confirme que les grandes illustrations incluent déjà leurs équipements ; les petites études de visage et de coiffure ne sont pas des calques composables prêts à utiliser. La séparation des zones occultées reste à étudier sur le pilote masculin et féminin, puis à présenter si elle nécessite une reconstruction.

## Reprise après réception du paquet

1. Pour le ZIP de références, exécuter l’importateur : il doit conserver les cinq PNG identiques et importer les cinq fichiers manquants. Pour le paquet de passation, copier uniquement les fichiers manquants du dossier `repository/`, après vérification contre le manifeste.
2. Exécuter `python3 tools/art/import_reference_bundle.py --verify-only` : dix fichiers doivent passer, puis versionner les sources exactes.
3. Lire et ouvrir l’HTML V2, puis reprendre son interface dans `tools/character-studio/interactive/`.
4. Préparer Ryuu masculin et féminin avec provenance, cadrages, ancrages, cinq masques sémantiques, variantes et équipements indépendants. Montrer les comparaisons ; identifier toute reconstruction locale et obtenir la validation des modifications substantielles avant généralisation.
5. Étendre aux huit autres bases, ajouter état versionné et export issu du même assembleur que l’aperçu, puis vérifier ART-01 à ART-12. La quantité de variantes disponibles doit être explicite.

La PR reste en brouillon et l’issue #27 reste ouverte. Les tests de la livraison V2 ne valent pas validation de la future V3.
