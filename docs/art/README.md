# Art — Character design et atelier des héros

## Décisions et prochaine étape

- [Design approuvé, sans réinterprétation](CHARACTER_DESIGN_LOCK.md).
- [Passation Work : atelier V3 réellement personnalisable](INTERACTIVE_ATELIER_HANDOFF.md).
- [Manifeste des sources et empreintes SHA-256](reference_bundle_manifest.json).
- Outil : `python3 tools/art/import_reference_bundle.py --verify-only` depuis la racine.

Les cinq fiches individuelles et l'atelier HTML V2 ont été approuvés par l'utilisateur. La V2 est un atelier de références ; elle n'applique pas encore les variantes ou couleurs au dessin central. La V3 doit le faire, sans redesign.

## Livraison des sources

La publication initiale de ces documents sur GitHub **n'inclut pas les fichiers PNG/HTML volumineux**. Ils restent dans l'archive approuvée jointe à la conversation, identifiée par le manifeste. La passation décrit leur import vérifié dans `content/art/characters/reference-v2/`.

Après import seulement : ouvrir `content/art/characters/reference-v2/atelier.html`. Le manifeste seul ne prouve pas qu'un fichier a été transféré ; l'outil de vérification contrôle sa présence et ses octets.

Le périmètre est exclusivement esthétique. Les sorts, voies élémentaires et l'équilibrage sont traités en parallèle et ne doivent pas entraîner de changement de design.
