# Cible artistique du bestiaire — Bouftous et Tofus

Le 16 octobre 2026, le commanditaire précise : « pour les monstres j’aimerai vraiment que tu t’inspires du design des bouftou, tofu, etc. avec le même style artistique ».

Cette demande concerne le dessin des monstres. Une comparaison concrète porte sur Plumet des mousses et Bourlaine jeune, représentants des deux familles les plus directement concernées. Les nouvelles propositions sont séparées des 424 vues existantes ; les héros, leurs sources et le gameplay ne changent pas.

## Références observées

- [Tofu, guide Tofus](https://www.tofus.fr/donjons/tofu), vignette historique du monstre : silhouette compacte, yeux blancs simples, petites pupilles, bec et pieds lisibles.
- [Bouftou, guide Tofus](https://www.tofus.fr/donjons/bouftou), vignette historique du monstre : masse dominante de laine, membres courts, visage encastré, expression marquée.

Ces images ont été consultées comme références visuelles ; elles ne sont pas copiées dans les assets livrés. Les sprites proposés sont produits avec Imagegen intégré à partir des créatures Project Tactics existantes et d’une consigne de style explicite.

## Traitement retenu pour les essais

Grandes masses arrondies, contours foncés continus, surfaces de couleur simples, ombres larges, expressions cartoon. Réduire les mèches et plumes décoratives, les reflets d’iris et les petits détails de matière. Préserver les marqueurs de l’espèce : mousse/ivoire, huppe et queue en feuilles du Plumet ; laine crème, face sombre, oreilles-feuilles et bourgeons de cornes miel de la Bourlaine.

La nouvelle Bourlaine devient plus trapue et obstinée ; le nouveau Plumet privilégie un volume compact et un regard malicieux. Il s’agit de modifications substantielles de silhouette et de visage, présentées comme propositions. Les ombres issues de la génération peuvent encore comporter de légères variations de ton ; aucune palette strictement indexée n’est revendiquée.

## Revue et production

Ouvrir `tools/character-studio/isometric/style-study/` : avant/après à hauteur comparable, affichage en détail ou à 160/96 pixels, silhouettes seules et fonds clair/sombre. Sur petit écran, les cartes se superposent et le mode détail se réduit ; les modes 160 et 96 px gardent leur taille.

Le lot comprend deux poses sud-est, pas encore leurs huit orientations ni leurs masques de personnalisation. L’étape de revue porte sur la forme générale, le visage et la simplification avant déclinaison des familles. Sources, prompts exacts, révision du fond et empreintes sont conservés dans le dossier de l’étude. L’extraction technique utilise le même détourage que Ryuu et n’ajoute aucun trait au dessin.

Les premières générations ont dessiné un damier opaque malgré la demande d’alpha. Une édition dédiée remplace uniquement ce fond par un vert de détourage ; l’outil local normalise ensuite les PNG. Les deux générations sont conservées pour comparer les éventuels écarts de l’édition.
