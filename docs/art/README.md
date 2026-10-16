# Art — Character design et atelier des héros

## Décisions et prochaine étape

- [Design approuvé, sans réinterprétation](CHARACTER_DESIGN_LOCK.md).
- [Passation Work : atelier V3 réellement personnalisable](INTERACTIVE_ATELIER_HANDOFF.md).
- [Manifeste des sources et empreintes SHA-256](reference_bundle_manifest.json).
- [Méthode commune de préparation des personnages et monstres](ASSET_PRODUCTION_METHOD.md).
- [État du pilote et critères ART-01 à ART-12](ATELIER_V3_STATUS.md).
- Outil : `python3 tools/art/import_reference_bundle.py --verify-only` depuis la racine.

Les cinq fiches individuelles et l'atelier HTML V2 ont été approuvés par l'utilisateur. La V2 est un atelier de références ; elle n'applique pas encore les variantes ou couleurs au dessin central. La V3 doit le faire, sans redesign.

## Livraison des sources

Les dix fichiers PNG/HTML et annexes ont été importés depuis l’archive originale, vérifiés et versionnés sous `content/art/characters/reference-v2/`. Le SHA-256 de chaque source reste celui du manifeste de la passation.

Après import seulement : ouvrir `content/art/characters/reference-v2/atelier.html`. Le manifeste seul ne prouve pas qu'un fichier a été transféré ; l'outil de vérification contrôle sa présence et ses octets.

Le périmètre est exclusivement esthétique. Les sorts, voies élémentaires et l'équilibrage sont traités en parallèle et ne doivent pas entraîner de changement de design.
