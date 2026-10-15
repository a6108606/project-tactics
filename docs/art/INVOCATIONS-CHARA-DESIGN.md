# Invocations — brief chara design et reprise

Date : 2026-10-15 · Version 0.5 · Statut : **directions visuelles proposées, aucune illustration validée dans ce dossier**.

## Point de départ

Lire [les règles et les dix fiches](../design/INVOCATIONS-v0.5.md) et [les données par rang](../../content/summons/catalog-v0.5.json). L’[atelier interactif](https://tactics-grimoire-atelier.a6108606.chatgpt.site?view=invocations) permet d’inspecter chaque fiche et sa portée vue du dessus.

Le joueur développe cinq classes : Leo (mêlée / percée), Lina (soin / protection), Sela (distance / contrôle des approches), Kael (tromperie / pièges), Ryuu (résistance / placement / riposte). Chaque classe possède deux invocations. Leurs noms restent provisoires.

Direction artistique de référence donnée dans les échanges du projet : chibi fantasy 2D isométrique, contours nets, cel-shading, costumes colorés, expressions lisibles, parenté avec les cinq héros. Les illustrations validées des héros ne sont pas présentes dans ce dossier : les récupérer auprès de l’utilisateur ou dans la source du projet avant de figer palettes et motifs. Ne pas prétendre avoir consulté les planches absentes.

## Contraintes communes

- Conserver une silhouette lisible à la taille d’une unité sur une grille ; une case logique à tous les rangs, même si le sprite déborde légèrement.
- Montrer le rôle par la silhouette, la posture et un accessoire distinctif. La couleur seule ne doit pas servir à identifier le type.
- Les cinq rangs appartiennent à la même créature. Le coût est 1 / 1 / 2 / 3 / 4 points ; ce ne sont pas quatre créatures différentes.
- Proposer des évolutions visuelles par rang, sans introduire d’actions ou de bonus non définis dans les fiches.
- Rang I : forme de base avec 2 sorts ; II : 3 sorts ; III : 4 sorts ; IV : forme avancée à 500/600, 5 sorts ; V : forme accomplie à 750/900, 6 sorts. Chaque nouveau rang ajoute un sort, dont la pose et les effets doivent être lisibles. Il ne s’agit pas d’une obligation d’agrandir le corps.
- Préserver une lecture claire au sol : les auras et particules ne doivent pas cacher les cases voisines.
- Les règles de personnalisation des héros (deux variantes et cinq couleurs) ne sont pas automatiquement étendues aux invocations. Personnalisation des créatures à décider.
- S’inspirer des fonctions tactiques des références, en créant des silhouettes, ornements et illustrations propres au projet.

## Pistes par créature

| Classe / créature | Lecture de silhouette proposée | Évolution visuelle IV–V à explorer | Geste signature et contrainte |
|---|---|---|---|
| Leo — Écuyer spectral | Petit garde animé, armure courte, heaume ouvert, arme de taille modeste ; silhouette compacte | Plastron articulé et insignes, cœur spectral plus net ; identité d’écuyer conservée | Estoc bref vers l’avant ; combattant de mêlée, pas un second Leo complet |
| Leo — Porte-étendard | Silhouette verticale dominée par une hampe et une bannière, porteur compact | Bannière à pans supplémentaires et emblème plus élaboré, sans occulter les alliés | Plante ou soulève la hampe pour le ralliement ; attaque de secours par coup de hampe |
| Lina — Luminou | Petit esprit arrondi, visage expressif, noyau lumineux et appendices en forme de feuilles | Noyau et couronne de pétales enrichis, expression toujours douce | Libère une lueur de soin vers un allié ; compagnon original, forme à comparer avant validation |
| Lina — Gardien des lucioles | Petit gardien en coque végétale, quelques lucioles comme points lumineux | Coque protectrice plus travaillée, orbites lumineuses structurées | Referme un cocon autour d’un allié ; c’est une seule unité, pas un essaim de cases |
| Sela — Faucon guetteur | Rapace compact, grands yeux, pattes clairement lisibles, ailes repliées | Plumage et crête plus distinctifs, motif de regard affiné | Redresse la tête et balaie la zone du regard ; déplacement au sol, aucun vol traversant les obstacles |
| Sela — Traqueur de ronces | Petit quadrupède de racines, centre de gravité bas, rameaux souples | Écorce plus marquée, ronces aux membres, sans devenir un arbre géant | Étire une racine pour gêner une cible ; garder le mouvement de marche lisible |
| Kael — Leurre | Écho de la silhouette de Kael, contours légèrement dédoublés, détails volontairement simplifiés | Reflets et décalages plus élaborés sans perte de lisibilité ; ressemblance avec Kael conservée | Apparition, déplacement et échange de place ; aucune animation d’attaque nécessaire |
| Kael — Araignée d’ombre | Petite araignée stylisée, abdomen marqué d’un motif propre, pattes contrastées | Motif de poison et carapace plus précis ; éviter une masse opaque de fumée | Morsure brève puis marque de poison ; pas de toile ou piège ajouté aux mécaniques |
| Ryuu — Lame sanguine | Arme animée à garde expressive, noyau ou liens d’énergie ; silhouette d’arme immédiatement identifiable | Garde et cœur plus élaborés, marques de rang ; longueur contenue | Frappe, retour de l’énergie vers la lame, échange de place ; le vol de vie soigne la lame, pas Ryuu |
| Ryuu — Sentinelle de sang | Petit rempart animé, buste large, pieds ancrés, cœur protégé | Plaques renforcées et lien protecteur plus lisible, toujours une case | Interception et transfert vers son cœur ; rester distincte de la lame offensive |

Ces pistes ne fixent pas les palettes des héros. Éviter de finaliser les couleurs avant comparaison avec la planche validée. Une arme qui flotte visuellement ou un halo n’accorde aucun déplacement spécial.

## Kit de sorts et animations — mise à jour v0.5

Les dix invocations sont contrôlées par le joueur. Elles disposent chacune de six sorts à terme, dont deux dès le rang I, puis un aux rangs II à V. Lire les 60 fiches dans le catalogue avant de préparer les animations. Les créatures de soutien peuvent désormais disposer d’une petite attaque de secours ; seul le Leurre conserve un kit sans dégâts.

Les dégâts évoluent selon niveau et caractéristiques du personnage ; les PV selon niveau et Vitalité. Cela ne nécessite pas de redimensionner physiquement le sprite : garder une case, une silhouette et des repères de rang stables. Les coefficients ne sont pas des consignes de taille visuelle.

Pour chaque sort : associer son nom exact et son rang de déblocage à une pose clé, une direction de ciblage et un effet visuel. Réutiliser le squelette et les poses quand cela reste lisible. Distinguer soin, bouclier, dégâts, poison, déplacement, retrait et dissipation. Le kit détaillé prévaut sur les pistes de la table ci-dessus.

## Planche à produire pour validation

Commencer par une classe et ses deux créatures, de préférence Lina pour différencier soin et bouclier. Pour chaque créature : deux propositions de silhouette au rang I, à échelle et pose comparables. Après choix : décliner les cinq rangs de la même silhouette, puis montrer face, profil, dos et vue de jeu isométrique. Préparer les animations d’attente, marche, action, impact, apparition et disparition uniquement après validation de la silhouette.

Les vues demandées sont des références de conception, pas une exigence de spritesheet déjà découpée. Livraison technique (taille, pivots, directions, nombre d’images) à définir avec le pipeline Godot ; ne pas présenter les concepts comme des assets prêts à jouer.

## Prompt à copier dans la prochaine discussion

> Nous poursuivons Project Tactics. Lis dans le dépôt `a6108606/project-tactics`, sur `main`, les fichiers `docs/art/INVOCATIONS-CHARA-DESIGN.md`, `docs/design/INVOCATIONS-v0.5.md` et `content/summons/catalog-v0.5.json`.
>
> Je veux concevoir les dix invocations des cinq classes, une classe à la fois. Il y a cinq rangs par invocation, coûtant 1/1/2/3/4 points d’invocation ; les rangs IV et V sont obtenus aux niveaux 500–900 selon le profil. Chaque créature dispose de 2 sorts au rang I puis +1 par rang, soit 6 au rang V, et elle est contrôlée par le joueur. Conserve les rôles tactiques, les actions du catalogue et l’occupation d’une seule case.
>
> Appuie-toi sur la planche validée des cinq héros pour le style chibi fantasy 2D isométrique, les contours, le cel-shading et les palettes. Si cette planche n’est pas accessible, demande-moi de la joindre. Commence par deux silhouettes comparables pour le Luminou et deux pour le Gardien des lucioles de Lina, au rang I. Après mon choix, décline leurs cinq rangs. Les descriptions visuelles du brief sont des pistes à explorer, pas des designs déjà approuvés.
>
> Ne modifie pas les règles de combat pour justifier une illustration. Nous validerons séparément silhouette, palette et évolution de rang avant de préparer les sprites.
