# Atelier V3 — pilote Ryuu

Preuve intermédiaire de recolorisation des **deux grandes illustrations originales** de Ryuu. Interface dérivée du HTML V2 vérifié : parchemin, bleu nuit et doré, navigation des cinq héros, références et vues d’étude.

Ce pilote n’achève pas l’issue #27 : aucun visage/coiffure modulaire, aucun équipement démontable et aucune personnalisation des huit autres bases. Ces contrôles sont désactivés avec explication. Ne pas confondre neuf études consultables et neuf variantes disponibles.

## Ouvrir

Depuis la racine du dépôt, avec Python 3 :

```sh
python3 tools/art/import_reference_bundle.py --verify-only
python3 -m http.server 8765 --bind 127.0.0.1
```

Ouvrir <http://127.0.0.1:8765/tools/character-studio/interactive/>. Aucun téléchargement, paquet ou service externe n’est requis. Utiliser un serveur local : les modules et le chargement des PNG ne fonctionnent pas en ouvrant directement le fichier HTML.

## Essayer

- Ryuu → Masculine/Féminine → modifier les cinq couleurs. Les paramètres des deux bases sont indépendants.
- « Comparer à l’original » garde le même cadrage ; « Voir les cinq zones » affiche les masques. Les trois textiles proposés sont les deux jambes du pantalon et son panneau central. Bandeau, cuir, pans rouges et ornements sont exclus.
- « Palette canon » restitue exactement les pixels de la source recadrée.
- « Enregistrer cette apparence », puis « Mes sélections » pour recharger. Le navigateur conserve aussi les configurations courantes. Un échec de stockage est signalé ; le JSON permet de conserver l’apparence.
- Exporter → Apparence JSON / Rendu personnalisé PNG. Le PNG est issu directement du canvas affiché, à la résolution originale, sans le zoom CSS. Les vues d’étude sont explicitement statiques. En comparaison ou affichage des masques, revenir au rendu pour exporter le PNG personnalisé.
- Les touches fléchées/Home/End parcourent les onglets ; 1 à 5 sélectionnent un héros hors d’un champ ou d’une fenêtre ; Échap ferme les fenêtres et le menu.

## Provenance et limites

`assets/references.json` est le manifeste V2 conservant ses coordonnées normalisées. `geometry.js` produit les recadrages entiers identiques à V2 ; aucun rééchantillonnage dans le bitmap. `masks.js` trace des régions sémantiques dans le PNG original (composantes de peau à partir de points manuels, régions limitées pour cheveux/pantalon). Les filtres de matériau ne s’appliquent jamais globalement à la fiche. `render.js` conserve l’alpha et le dessin hors masque, ainsi que les ombres et lumières dans la zone recolorée.

`assets/manifest.json` répertorie dimensions, ancrage au sol, origine, cadrages, empreintes des masques et rendus, et statut **à examiner esthétiquement**. Les masques PNG sont des dérivés de contrôle ; l’application utilise leur définition déterministe. Ce ne sont pas des calques de corps complet. Les tests de sentinelles d’équipement et d’invariance hors masque ne remplacent pas une matte exhaustive de tous les équipements.

`appearance_v3.schema.json` décrit les configurations prises en charge. `state.js` applique aussi les vérifications d’identité et de compatibilité. La migration V2 signale le retour aux formes canoniques et aux trois textiles canoniques : un indice d’étude V2 ne devient jamais un identifiant de variante.

Aucune reconstruction n’entre dans le rendu livré. Les essais de tête ont été rejetés : l’essai génératif déplaçait visage/bandeau ; l’adaptation entre les deux grandes têtes produisait des contours résiduels et un raccord incohérent de l’attache. Les essais ne sont pas des assets disponibles. Les zones à reconstruire sont montrées dans « Préparation des variantes ».

## Vérifier et régénérer les preuves

Node 22 ou plus récent, sans installation de dépendance :

```sh
node tools/character-studio/interactive/tests/run.mjs
```

Le test décode les vrais PNG, vérifie les empreintes, le canon exact, l’isolation des cinq canaux sous quatre couleurs extrêmes, l’alpha, les sentinelles d’équipement, les bases indépendantes, le JSON et les refus d’import. Il régénère les preuves et le manifeste sous `docs/art/evidence/ryuu-pilot/` et `assets/manifest.json`.

Ouvrir aussi <http://127.0.0.1:8765/tools/character-studio/interactive/tests/browser.html> : mêmes tests de rendu dans le navigateur, plus décodage du PNG exporté par Canvas et comparaison RGBA exacte. Voir les [comparaisons](../../../docs/art/evidence/ryuu-pilot/index.html) et le [suivi ART-01 à ART-12](../../../docs/art/ATELIER_V3_STATUS.md).
