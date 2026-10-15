# Ryuu — premier pilote 3D rejeté artistiquement

**Retour utilisateur du 15 octobre 2026 : « Horrible mdr ».** Le pilote ci-dessous reste une preuve technique ; sa direction artistique est rejetée. Une [nouvelle cible visuelle](evidence/ryuu-design-target/index.html), produite avec Imagegen, a reçu le retour « c'est déjà vachement mieux ! ». Cette appréciation porte sur une image de recherche : le véritable modèle correspondant reste à construire et à valider. Les résultats techniques historiques ci-dessous ne valent pas approbation du rendu.

Le 15 octobre 2026, l’utilisateur a choisi explicitement **« Vraie 3D stylisée, avec validation du nouveau rendu »**. Cela autorise une nouvelle proposition de rendu en volume sur Ryuu, avant généralisation. Cette décision complète le verrou esthétique initial ; elle ne remplace pas les cinq fiches sources et n’autorise pas à déclarer une reconstruction identique aux dessins.

## Livré pour examen

Atelier local : <http://127.0.0.1:8765/tools/character-studio/3d/>.

Deux GLB et deux fichiers Blender éditables, générateur source, deux formes de visage et deux coiffures par base, cinq matériaux personnalisables, quatre groupes d’équipements indépendants, vue 360°, comparaison avec la source, sauvegarde et JSON, export PNG de l’aperçu. Aucun modèle d’une autre classe n’a été produit.

[Méthode de production et lancement](../../tools/character-studio/3d/README.md) · [Comparaisons exportées](evidence/ryuu-3d/index.html).

## Revue artistique à effectuer

- L’ensemble du modèle est une interprétation nouvelle. Les parties cachées, dos, nuque, volumes des mèches et dessous d’équipements sont reconstruits.
- La lecture des couleurs et des accessoires reprend Ryuu. Les proportions, l’expression, les plis, les mèches et les motifs sont simplifiés. La posture est neutre ; la fiche présente des poses plus expressives.
- Les deux visages sont des essais de forme de mâchoire et les deux coiffures des essais volumétriques. Ils ne sont pas des variantes déjà approuvées ni une conversion automatique des neuf études.
- La 3D est réelle, inspectable sous tous les angles. Il n’y a pas de squelette, d’animation ou de modèle de jeu final prêt à intégrer.
- Les rendus Blender de revue et le shader toon du navigateur utilisent des éclairages différents. Les comparaisons de l’application emploient les PNG exportés par son propre bouton.

La direction de cette première traduction 3D a été rejetée. La prochaine revue devra porter sur un nouveau modèle, guidé par la cible visuelle accueillie positivement et confronté à la fiche originale. Aucune approbation automatique des finitions ni des autres personnages n’en découle.

## Résultats techniques

- Assets et configurations : **51 PASS / 0 FAIL**, [rapport](../../tools/character-studio/3d/tests/asset-report.json).
- Navigateur : **89 PASS / 0 FAIL**, [rapport et périmètre](evidence/ryuu-3d/browser-report.json), dont sept contrôles du parcours réel de l’application et quatre contrôles à largeurs CSS 640/400.
- Exports PNG déclenchés depuis l’interface : deux bases canoniques et une apparence féminine personnalisée, 638 × 620 pixels, conservés avec leurs empreintes.
- Source : dix fichiers approuvés toujours identiques.

## ART-01 à ART-12 — périmètre de l’étude 3D

| Critère | État |
| --- | --- |
| ART-01 | Les dix fichiers approuvés sont inchangés, vérifiés par l’outil de passation. |
| ART-02 | Comparaison à la source fournie ; nouveau rendu **non validé artistiquement** et écarts documentés. |
| ART-03 | Deux vraies géométries de visage par base, changement visible testé ; qualité artistique à valider. |
| ART-04 | Deux vrais groupes de mèches par base, changement visible testé ; qualité artistique à valider. |
| ART-05 | Cinq matériaux de base indépendants, trois couleurs extrêmes testées sur chacun et sur chaque base. |
| ART-06 | Tous les meshes d’équipement emploient seulement des matériaux fixes. Invariance de leurs couleurs testée ; l’éclairage varie naturellement avec l’orientation. |
| ART-07 | Quatre groupes d’équipements retirables. Surfaces sous-jacentes reconstruites et documentées ; contrôle artistique des raccords encore nécessaire. |
| ART-08 | Deux bases Ryuu, huit autres bases absentes. Pas de généralisation avant validation. |
| ART-09 | État distinct par base, sauvegarde locale, validation stricte du JSON et remise à zéro ; contrôles techniques et parcours navigateur. |
| ART-10 | Export du canvas courant, égalité RGBA du PNG décodé testée ; imports invalides refusés. |
| ART-11 | Contrôles HTML au clavier, boutons/curseurs de rotation et zoom, mise en page adaptable ; pas d’audit exhaustif de tous les navigateurs. |
| ART-12 | Travail limité aux assets, atelier et documentation d’art. Aucun changement de combat ou CI. |

La PR reste en brouillon, l’issue #27 ouverte. Les tests ne constituent pas une validation esthétique utilisateur.
