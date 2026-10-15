# Invocations — règles et catalogue v0.4

> Archive : les actions et la croissance sont remplacées par [Invocations v0.5](INVOCATIONS-v0.5.md). Les règles de capacité et paliers restent applicables.

Date : 2026-10-15. Document de conception ; pas une implémentation du moteur de combat.

- [Atelier interactif](https://tactics-grimoire-atelier.a6108606.chatgpt.site?view=invocations)
- [Catalogue structuré](../../content/summons/catalog-v0.4.json)
- [Brief chara design et reprise de discussion](../art/INVOCATIONS-CHARA-DESIGN.md)

## Décisions utilisateur

- Un personnage possède 1 point d’invocation au niveau 1, puis +1 par tranche de 100 niveaux. Le plafond envisagé est 1 000, encore provisoire.
- Une invocation peut coûter entre 1 et 4 points selon son niveau. Les niveaux les plus élevés arrivent autour de 500 et au-delà.
- Chaque sort conserve 5 rangs. Acheter les rangs I à V coûte successivement 1, 2, 3, 4, 5 points de compétence, soit 15 cumulés.
- S’inspirer du rôle du Lapino, du Double et de l’Épée ; concevoir nos propres créatures et visuels.

## Traduction proposée dans l’atelier

« Niveau de l’invocation » désigne ici son rang de sort, I à V. Il n’y a pas encore de système d’XP autonome pour une créature. Cette interprétation et les paliers exacts ci-dessous sont des propositions, pas des décisions d’équilibrage validées.

| Rang | Points d’invocation occupés | Points de compétence cumulés | Niveau personnage : première invocation | Niveau personnage : seconde invocation |
|---|---:|---:|---:|---:|
| I | 1 | 1 | 18, sauf Leurre : 6 | 150 |
| II | 1 | 3 | 100 | 250 |
| III | 2 | 6 | 250 | 400 |
| IV | 3 | 10 | 500 | 600 |
| V | 4 | 15 | 750 | 900 |

Capacité = `1 + floor(niveauPersonnage / 100)` pour des niveaux 1 à 1 000 : 1 au niveau 1, 2 au niveau 100, 6 au niveau 500, 11 au niveau 1 000. Les rangs exigent à la fois le niveau requis et l’investissement de compétence ; le test de capacité suppose l’investissement réalisé.

Les points d’invocation sont une capacité occupée, distincte des PA et des points de compétence. Ils sont libérés à la mort, à l’expiration, au renvoi ou à la fin du combat. Toutes les créatures disparaissent avec leur invocateur. Un rang inférieur déjà appris reste utilisable. Le rang et le coût sont fixés à l’apparition : changer le rang sélectionné ne transforme pas une invocation active. Aucun remboursement de PA ni réinitialisation de relance lors d’un renvoi.

Exemple au niveau 1 000 : Écuyer spectral V (4) + Écuyer spectral V (4) + Porte-étendard IV (3) = 11 points. Un quatrième Écuyer est refusé ; renvoyer un Écuyer V libère 4 points. L’unicité d’un type s’applique entre tous les rangs : on ne contourne pas la limite en invoquant deux rangs différents.

## Fonctionnement proposé, à valider

- Créatures contrôlées manuellement, 4 PA par activation, PM propres à chaque profil ; une action spéciale de 3 PA par tour.
- Une case libre, une ligne de vue et la portée du rang sont nécessaires au lancement. Une créature occupe une case logique à tous les rangs.
- Dans l’atelier, activation après l’invocateur dès l’apparition, ordre choisi par celui-ci. **À arbitrer avec le GDD**, qui fixe une initiative individuelle pour héros, compagnons et monstres. Ne pas généraliser cette proposition aux compagnons permanents.
- Renvoi volontaire en fin de tour de l’invocateur ; pas d’invocation par une invocation.
- Pièges, glyphes, graines et balises : 0 point, avec leurs propres limites. Les compagnons permanents du prototype ne sont pas assimilés automatiquement aux invocations.
- Même soutien non cumulable entre exemplaires : valeur la plus élevée. Les limites propres aux actions restent applicables.
- Le simulateur vérifie capacité, déblocage et unicité. Il ne simule pas le combat, les PA, la relance, l’initiative ou les achats de compétences.

## Catalogue

Les dix profils, leurs identifiants stables, les valeurs de chaque rang, PA, PM, portées, relances et actions sont dans le JSON lié ci-dessus. Le Leurre existant `kael-5` est conservé, pas ajouté une seconde fois. L’atelier contient 109 sorts au total.

### Écuyer spectral — Leo

Identifiant : `leo-ecuyer`. Rôle : Pression de mêlée.

Invoque un écuyer mobile qui accompagne Leo au contact et exerce une pression sur une cible.

- Niveaux requis : 18 / 100 / 250 / 500 / 750. Coûts d’invocation : 1 / 1 / 2 / 3 / 4.
- Lancement : 3 PA ; portée minimale 1, maximale 1 / 2 / 2 / 3 / 3 ; relance 4 tours.
- Créature : 4 PA, 3 PM ; PV de base par rang : 40 / 60 / 80 / 100 / 120.
- Limite : plusieurs exemplaires dans la capacité disponible. Durée : jusqu’à disparition ou fin du combat.
- **Estoc spectral** : 6 / 8 / 10 / 12 / 14 dégâts Terre de base, portée 1 case. Une frappe de mêlée par tour. Ne copie pas les sorts de Leo.

### Porte-étendard — Leo

Identifiant : `leo-etendard`. Rôle : Soutien offensif.

Invoque un porteur d’étendard qui renforce brièvement la Puissance des alliés proches.

- Niveaux requis : 150 / 250 / 400 / 600 / 900. Coûts d’invocation : 1 / 1 / 2 / 3 / 4.
- Lancement : 4 PA ; portée minimale 1, maximale 1 / 2 / 2 / 3 / 3 ; relance 5 tours.
- Créature : 4 PA, 2 PM ; PV de base par rang : 50 / 75 / 100 / 125 / 150.
- Limite : un exemplaire par invocateur, tous rangs confondus. Durée : jusqu’à disparition ou fin du combat.
- **Ralliement** : 20 / 30 / 40 / 50 / 60 Puissance pendant 1 tour, portée Alliés à 2 cases. Une impulsion par tour. Bonus du même sort non cumulable : seule la valeur la plus forte s’applique. Aucune attaque.

### Luminou — Lina

Identifiant : `lina-luminou`. Rôle : Petit soigneur mobile.

Invoque un petit esprit lumineux qui suit les alliés et soigne une cible à chaque tour.

- Niveaux requis : 18 / 100 / 250 / 500 / 750. Coûts d’invocation : 1 / 1 / 2 / 3 / 4.
- Lancement : 3 PA ; portée minimale 1, maximale 1 / 2 / 2 / 3 / 3 ; relance 4 tours.
- Créature : 4 PA, 3 PM ; PV de base par rang : 25 / 40 / 55 / 70 / 85.
- Limite : plusieurs exemplaires dans la capacité disponible. Durée : jusqu’à disparition ou fin du combat.
- **Lueur réparatrice** : 6 / 9 / 12 / 15 / 18 soins de base, portée 1 à 3 cases. Un soin sur un allié blessé, autre que lui-même, par tour. Aucune attaque.

### Gardien des lucioles — Lina

Identifiant : `lina-lucioles`. Rôle : Protection ciblée.

Invoque un gardien qui pose un bouclier court sur un allié plutôt que de lui rendre de la vie.

- Niveaux requis : 150 / 250 / 400 / 600 / 900. Coûts d’invocation : 1 / 1 / 2 / 3 / 4.
- Lancement : 4 PA ; portée minimale 1, maximale 1 / 2 / 2 / 3 / 3 ; relance 5 tours.
- Créature : 4 PA, 2 PM ; PV de base par rang : 40 / 60 / 80 / 100 / 120.
- Limite : un exemplaire par invocateur, tous rangs confondus. Durée : jusqu’à disparition ou fin du combat.
- **Cocon lumineux** : 15 / 26 / 38 / 49 / 60 PV de bouclier pendant 1 tour, portée 1 à 3 cases. Protège un allié par tour. Les boucliers de Cocon lumineux se remplacent ; pas de cumul entre plusieurs gardiens.

### Faucon guetteur — Sela

Identifiant : `sela-faucon`. Rôle : Reconnaissance mobile.

Invoque un éclaireur rapide qui révèle les ennemis dissimulés et prépare les lignes de tir.

- Niveaux requis : 18 / 100 / 250 / 500 / 750. Coûts d’invocation : 1 / 1 / 2 / 3 / 4.
- Lancement : 3 PA ; portée minimale 1, maximale 1 / 2 / 2 / 3 / 3 ; relance 4 tours.
- Créature : 4 PA, 5 PM ; PV de base par rang : 20 / 33 / 45 / 58 / 70.
- Limite : plusieurs exemplaires dans la capacité disponible. Durée : jusqu’à disparition ou fin du combat.
- **Regard perçant** : 1 / 1 / 2 / 2 / 2 cases de rayon, portée Autour du faucon. Révèle les ennemis dissimulés dans la zone jusqu’au prochain tour du faucon. Aucune attaque. Se déplace au sol selon les règles ordinaires ; ne traverse pas les obstacles.

### Traqueur de ronces — Sela

Identifiant : `sela-ronces`. Rôle : Entrave des approches.

Invoque un traqueur qui gêne l’approche d’un ennemi avec un retrait de PM ciblé.

- Niveaux requis : 150 / 250 / 400 / 600 / 900. Coûts d’invocation : 1 / 1 / 2 / 3 / 4.
- Lancement : 4 PA ; portée minimale 1, maximale 1 / 2 / 2 / 3 / 3 ; relance 5 tours.
- Créature : 4 PA, 3 PM ; PV de base par rang : 45 / 66 / 88 / 109 / 130.
- Limite : un exemplaire par invocateur, tous rangs confondus. Durée : jusqu’à disparition ou fin du combat.
- **Entrave végétale** : 1 / 1 / 1 / 1 / 1 PM tenté pendant 1 tour, portée 1 à 2 cases. Une tentative de retrait esquivable par tour sur un ennemi. Formule d’esquive et caractéristiques de retrait de l’invocation à définir ; aucune garantie de retrait.

### Leurre — Kael

Identifiant : `kael-5`. Rôle : Double de placement.

Invoque un double mobile qui occupe une case et sert de relais à Permutation et Plan de fuite.

- Niveaux requis : 6 / 100 / 250 / 500 / 750. Coûts d’invocation : 1 / 1 / 2 / 3 / 4.
- Lancement : 3 PA ; portée minimale 1, maximale 1 / 2 / 2 / 3 / 3 ; relance 4 tours.
- Créature : 4 PA, 3 PM ; PV de base par rang : 30 / 53 / 75 / 98 / 120.
- Limite : un exemplaire par invocateur, tous rangs confondus. Durée : 3 tours de la créature.
- **Présence trompeuse** : 0 / 0 / 0 / 0 / 0 dégât, portée Sa propre case. Se déplace et occupe une case, sans attaque. Compatible avec Permutation et Plan de fuite. Héritage éventuel du tacle de Kael à définir.

### Araignée d’ombre — Kael

Identifiant : `kael-araignee`. Rôle : Poison de proximité.

Invoque une araignée qui applique un poison bref au contact sans reproduire les pièges de Kael.

- Niveaux requis : 150 / 250 / 400 / 600 / 900. Coûts d’invocation : 1 / 1 / 2 / 3 / 4.
- Lancement : 4 PA ; portée minimale 1, maximale 1 / 2 / 2 / 3 / 3 ; relance 5 tours.
- Créature : 4 PA, 4 PM ; PV de base par rang : 20 / 35 / 50 / 65 / 80.
- Limite : un exemplaire par invocateur, tous rangs confondus. Durée : jusqu’à disparition ou fin du combat.
- **Morsure insidieuse** : 2 / 3 / 4 / 4 / 5 dégâts Air de base par déclenchement, portée 1 case. Pose un poison pour les deux prochains débuts de tour de la cible, sans dégâts immédiats. Un lancer par tour ; même poison non cumulable, durée renouvelée.

### Lame sanguine — Ryuu

Identifiant : `ryuu-lame`. Rôle : Mêlée et point de transposition.

Invoque une lame animée qui frappe au contact, se régénère et peut échanger sa position avec Ryuu.

- Niveaux requis : 18 / 100 / 250 / 500 / 750. Coûts d’invocation : 1 / 1 / 2 / 3 / 4.
- Lancement : 4 PA ; portée minimale 1, maximale 1 / 2 / 2 / 3 / 3 ; relance 4 tours.
- Créature : 4 PA, 3 PM ; PV de base par rang : 35 / 54 / 73 / 91 / 110.
- Limite : plusieurs exemplaires dans la capacité disponible. Durée : jusqu’à disparition ou fin du combat.
- **Morsure d’acier** : 6 / 8 / 11 / 13 / 15 dégâts Eau de base, portée 1 case. Une attaque par tour ; rend à la lame 50 % des PV effectivement retirés, sans soigner Ryuu. Compatible avec Transposition. Ne charge pas la douleur de Ryuu.

### Sentinelle de sang — Ryuu

Identifiant : `ryuu-sentinelle`. Rôle : Protection et occupation.

Invoque une sentinelle qui occupe le terrain et prend une part limitée des dégâts d’un allié proche.

- Niveaux requis : 150 / 250 / 400 / 600 / 900. Coûts d’invocation : 1 / 1 / 2 / 3 / 4.
- Lancement : 4 PA ; portée minimale 1, maximale 1 / 1 / 2 / 2 / 2 ; relance 5 tours.
- Créature : 4 PA, 2 PM ; PV de base par rang : 60 / 90 / 120 / 150 / 180.
- Limite : un exemplaire par invocateur, tous rangs confondus. Durée : jusqu’à disparition ou fin du combat.
- **Garde liée** : 10 / 13 / 15 / 18 / 20 % des dégâts transférés, portée Un allié adjacent. Protège un allié jusqu’au prochain tour de la sentinelle. Plafond transféré : 20 % des PV max de la sentinelle par tour. Aucun transfert en chaîne ; non cumulable avec Interposition ou Partage du fardeau (seul le taux le plus élevé s’applique).

## Équilibrage restant ouvert

Les PV, soins, dégâts et boucliers sont des **bases provisoires**, conservées de v0.3. Ils ne représentent pas des valeurs de combat finales aux niveaux 500–1 000. La croissance liée au niveau, les caractéristiques héritées, les résistances, le tacle et l’esquive restent à définir. Ne pas les brancher au moteur comme des valeurs finalisées.

Le rang améliore actuellement les bases sans ajouter automatiquement de nouvelles actions. Le coût 1/1/2/3/4 et l’utilisation de rangs inférieurs devront être testés : plusieurs petites créatures peuvent être trop rentables par rapport à une forte. Les effets à valeur presque fixe, notamment le retrait de PM et le Leurre, nécessitent un équilibrage particulier avant validation.

Avec quatre joueurs au niveau 1 000, 44 points sont possibles ; 44 petites créatures constituent un plafond théorique avant unicité et autres contraintes. Mesurer durée des tours et encombrement. Un point de compétence par niveau est encore une proposition : le catalogue coûte 315 points pour Kael, 330 pour chacune des autres classes, mais les rangs des invocations restent bloqués jusqu’aux niveaux requis. Usage des points excédentaires à concevoir.

## Vérification de l’atelier v0.4

Coûts des cinq rangs, 50 paires de limites avant/au déblocage, composition 4+4+3, refus de dépassement, restitution du coût exact, unicité entre rangs, conservation du rang d’une créature active et refus de baisse de niveau incompatible vérifiés. Les 545 combinaisons sort/rang ont passé le rendu JavaScript simulé. Contrôle visuel en navigateur non effectué dans cette session. Ces contrôles ne valident pas l’équilibrage.
