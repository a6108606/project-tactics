# Project Tactics — Atelier esthétique V2

## Ouvrir l’atelier

Ouvrir `atelier.html` dans un navigateur. Le fichier est autonome : les cinq fiches sont intégrées, sans appel réseau, sans bibliothèque externe et sans installation.

Les références sont **exclusivement les cinq fiches originales re-jointes et confirmées par l’utilisateur** : Ryuu, Kael, Sela, Leo et Lina, avec leurs bases masculine et féminine. Aucune illustration nouvelle n’a été générée pour cette livraison.

## Fonctionnalités de cette version

- Navigation entre les cinq personnages et les deux bases ; vue du duo.
- Vue principale, études isométriques, poses statiques et fiche complète.
- Zoom et ouverture des références en grand.
- Sélection des études de visage et de coiffure présentes dans les fiches.
- Préparation des cinq couleurs : peau, cheveux, vêtement 1, vêtement 2, vêtement 3.
- Sauvegarde locale des projets d’apparence ; reprise depuis « Mes sélections ».
- Export et import d’un projet d’apparence en JSON, avec vérification de la référence source.
- Export PNG de l’aperçu de référence ou de la fiche entière.
- Consultation et export du manifeste de direction artistique.

Raccourcis : `1` à `5` sélectionnent un personnage ; les flèches gauche/droite parcourent les études de direction en mode « Vues iso ». Échap ferme les fenêtres de consultation.

## Limite à ne pas masquer

Cette V2 est un **atelier de références et de préparation**, pas encore un moteur d’assemblage de sprites.

Les fiches sont des images aplaties. Les choix de visage, de coiffure et de couleur sont enregistrés dans le projet d’apparence, mais **ne modifient pas le dessin central**. Les exports PNG restent donc les références canoniques, non recolorées.

Les neuf vignettes de visage et les neuf vignettes de coiffure par fiche sont des **études illustratives extraites**, pas neuf variantes modulaires validées. Le nombre final de variantes de production n’est pas fixé. Les palettes HEX sont des valeurs de travail proches de l’identité canonique ; les fiches originales restent l’autorité visuelle.

Les orientations et poses ne sont pas présentées comme des sprites cohérents déjà vérifiés ou des animations jouables. Aucun faux assemblage de tête, aucune recolorisation globale de l’image et aucune suppression artificielle des équipements n’ont été utilisés.

La sauvegarde locale dépend du navigateur et de son contexte d’ouverture. Si l’atelier indique « Stockage indisponible », exporter le JSON pour conserver les choix. Les données locales ne sont pas un remplacement d’une sauvegarde exportée.

## Règles esthétiques verrouillées

1. Conserver les silhouettes, proportions, expressions, coiffures canoniques, costumes, détails, accessoires, palettes par défaut et style de rendu des cinq fiches approuvées.
2. Ne pas réinterpréter les personnages en fonction de leurs parallèles de gameplay. Kael conserve notamment sa tenue violette et dorée et ses cheveux blonds ; un parallèle avec un Sram n’autorise pas un nouveau design.
3. Deux bases par personnage : masculine et féminine.
4. Deux types de variantes : visage et coiffure.
5. Exactement cinq canaux de couleur de base : peau, cheveux, vêtement 1, vêtement 2, vêtement 3.
6. Armes, armures, casques, capes et accessoires équipés indépendants : ils ne reçoivent jamais les couleurs de la base. Ils peuvent occulter celle-ci, et leurs parties peuvent passer devant ou derrière suivant la pose et la direction.
7. La production de calques doit partir de ces références. Toute modification substantielle du design demande une validation explicite de l’utilisateur.
8. Les sorts, caractéristiques, voies élémentaires et l’équilibrage sont hors périmètre de cet atelier.

## Prochain lot de production

Le prochain lot concerne le **découpage et la préparation des calques**, sans nouvelle direction artistique : base, visage, cheveux avant/arrière, trois zones textiles de base, équipements distincts, points d’ancrage et ordre d’affichage. Les masques doivent préserver les contours et ombrages ; la recolorisation de la base ne doit jamais modifier les pixels des équipements. Les références de directions et les animations devront ensuite faire l’objet d’une production et d’une vérification dédiées.

## Contenu du dossier

- `atelier.html` : l’atelier autonome.
- `references/` : les cinq PNG originaux, non modifiés.
- `design_lock_v2.json` : charte, coordonnées d’extraction et SHA-256 des sources.
- `appearance_reference_v2.schema.json` : schéma du JSON des projets d’apparence.
- `validation_tests.json` : contrôles réalisés et précision sur leur environnement.
- `README_FR.md` : ce document.

Les images intégrées à l’HTML sont encodées en WebP sans perte, avec égalité des pixels RGB vérifiée contre les sources. Les PNG originaux de `references/` sont conservés octet pour octet. La compression ne doit pas être confondue avec un nouveau dessin.
