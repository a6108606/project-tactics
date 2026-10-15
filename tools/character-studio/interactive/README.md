# Atelier V3 — pilote Ryuu

**Suite choisie par l’utilisateur : [vraie 3D stylisée, pilote séparé](../3d/README.md).** Les limites décrites ci-dessous concernent ce pilote 2D conservé.

Preuve intermédiaire de recolorisation des **deux grandes illustrations originales** de Ryuu. L’interface organise les choix visuels à gauche et l’aperçu à droite, avec la palette parchemin, bleu nuit et doré. Les cinq héros, références et vues d’étude restent accessibles. L’archive HTML V2 est conservée à l’identique.

Ce pilote n’achève pas l’issue #27 : aucun visage/coiffure modulaire, aucun équipement démontable et aucune personnalisation des huit autres bases. Ces contrôles sont désactivés avec explication. Ne pas confondre neuf études consultables et neuf variantes disponibles.

## Ouvrir

Depuis la racine du dépôt, avec Python 3 :

```sh
python3 tools/art/import_reference_bundle.py --verify-only
python3 -m http.server 8765 --bind 127.0.0.1
```

Ouvrir <http://127.0.0.1:8765/tools/character-studio/interactive/>. Aucun téléchargement, paquet ou service externe n’est requis. Utiliser un serveur local : les modules et le chargement des PNG ne fonctionnent pas en ouvrant directement le fichier HTML.

## Essayer

- **Personnage** : choisir un héros par son portrait, puis une base par sa vignette. Les études de visages/coiffures restent explicitement non sélectionnables.
- **Couleurs** : modifier les cinq zones de Ryuu ; trois palettes visuelles permettent un essai immédiat. Les paramètres masculins et féminins sont indépendants. « Couleurs d’origine » rétablit le canon exact, avec un retour individuel sur chaque ligne.
- **Aperçu** : Annuler/Rétablir, comparaison côte à côte, duo, zoom et agrandissement. Ctrl/Cmd+Z fonctionne hors saisie ; l’historique reste propre à chaque base et limité à la session. Les vues iso/poses sont des études statiques, sans personnalisation.
- **Enregistrer**, puis **Mes apparences**, conserve et recharge une sélection. Les réglages courants se sauvegardent aussi localement. Un échec de stockage est signalé.
- **Exporter PNG**, sous l’aperçu, utilise directement ses pixels à la résolution originale, hors zoom CSS. En comparaison, affichage des zones ou vue d’étude, revenir à l’illustration seule pour exporter.
- **Fichiers**, dans l’en-tête, importe/exporte une apparence JSON ou télécharge la fiche originale. Les sauvegardes V3 précédentes restent compatibles.
- **Équipements** : consultation des sources, couleurs indépendantes, retrait désactivé tant que les vrais calques n’existent pas.
- **Références** : fiche complète, galerie des cinq héros, charte. Le volet secondaire **Outils de création** contient les zones de couleur, la préparation Ryuu et l’accès à l’éditeur de créatures.
- Les flèches/Home/End parcourent chaque groupe d’onglets ; 1 à 5 sélectionnent un héros hors saisie/fenêtre ; Échap ferme les dialogues et le menu.

L’organisation s’inspire de [skin.souff.fr](https://skin.souff.fr/) à la demande de l’utilisateur : sélections illustrées, onglets compacts, aperçu durable sur bureau et commandes directes. Aucun asset, code ou décor de ce site n’est réutilisé. Sur écran étroit, l’aperçu passe au-dessus des commandes. L’outil de préparation reste séparé du parcours de personnalisation.

## Provenance et limites

`assets/references.json` est le manifeste V2 conservant ses coordonnées normalisées. `geometry.js` produit les recadrages entiers identiques à V2 ; aucun rééchantillonnage dans le bitmap. `recipes/ryuu-*.json` (dans le dossier parent de cet atelier) décrit les régions sémantiques du PNG original : composantes de peau à partir de points manuels, régions limitées pour cheveux/pantalon. `pipeline/mask-engine.js` les applique ; `masks.js` conserve seulement l’adaptateur de la suite de tests initiale. Les filtres de matériau ne s’appliquent jamais globalement à la fiche. `render.js` conserve l’alpha et le dessin hors masque, ainsi que les ombres et lumières dans la zone recolorée.

`assets/manifest.json` répertorie dimensions, ancrage au sol, origine, cadrages, empreintes des masques et rendus, et statut **à examiner esthétiquement**. Les masques PNG sont des dérivés de contrôle ; l’application utilise leur définition déterministe. Ce ne sont pas des calques de corps complet. Les tests de sentinelles d’équipement et d’invariance hors masque ne remplacent pas une matte exhaustive de tous les équipements.

`appearance_v3.schema.json` décrit les configurations prises en charge. `state.js` applique aussi les vérifications d’identité et de compatibilité. La migration V2 signale le retour aux formes canoniques et aux trois textiles canoniques : un indice d’étude V2 ne devient jamais un identifiant de variante.

Aucune reconstruction n’entre dans le rendu livré. Les essais de tête ont été rejetés : l’essai génératif déplaçait visage/bandeau ; l’adaptation entre les deux grandes têtes produisait des contours résiduels et un raccord incohérent de l’attache. Les essais ne sont pas des assets disponibles. Les zones à reconstruire sont montrées dans Références → Outils de création → « Préparation de Ryuu ».

## Vérifier et régénérer les preuves

Node 22 ou plus récent, sans installation de dépendance :

```sh
node tools/character-studio/interactive/tests/run.mjs
```

Le test décode les vrais PNG, vérifie les empreintes, le canon exact, l’isolation des cinq canaux sous quatre couleurs extrêmes, l’alpha, les sentinelles d’équipement, les bases indépendantes, le JSON et les refus d’import. Il régénère les preuves et le manifeste sous `docs/art/evidence/ryuu-pilot/` et `assets/manifest.json`.

Ouvrir aussi <http://127.0.0.1:8765/tools/character-studio/interactive/tests/browser.html> : mêmes tests de rendu dans le navigateur, plus décodage du PNG exporté par Canvas et comparaison RGBA exacte. Voir les [comparaisons](../../../docs/art/evidence/ryuu-pilot/index.html) et le [suivi ART-01 à ART-12](../../../docs/art/ATELIER_V3_STATUS.md).

## Préparer les prochains personnages et monstres

Dans Références → Outils de création, le lien « Préparer une créature » ouvre l’éditeur de contours, exclusions, protections et points témoins. Il accepte des bases et zones libres, sauvegarde un brouillon local et exporte une fiche versionnée. Le générateur commun vérifie et produit masques, catalogue et comparaisons par lot.

Voir la [méthode de production](../../../docs/art/ASSET_PRODUCTION_METHOD.md) pour le contrat de sources, les calques à demander dès le dessin, les commandes de génération et la validation esthétique. Les sauvegardes V3 existantes restent compatibles ; la migration du moteur conserve exactement les deux rendus Ryuu du pilote testé.
