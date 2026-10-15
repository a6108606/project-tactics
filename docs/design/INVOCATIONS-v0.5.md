# Invocations — sorts propres et croissance v0.5

Date : 2026-10-15. Cette version remplace les profils à une seule action de [v0.4](INVOCATIONS-v0.4.md). Statut : conception et simulateur ; aucun moteur de combat Godot ajouté par cette modification.

- [Atelier interactif](https://tactics-grimoire-atelier.a6108606.chatgpt.site?view=invocations)
- [Catalogue des 10 créatures / 60 sorts](../../content/summons/catalog-v0.5.json)
- [Modèle de calcul exécutable](../../content/summons/model-v0.5.cjs)
- [Tests reproductibles](../../tests/summons-model-v0.5.test.cjs)
- [Brief chara design / reprise](../art/INVOCATIONS-CHARA-DESIGN.md)

## Règles utilisateur confirmées

1. Les invocations sont contrôlées par le joueur : déplacements, choix du sort et de la cible. Pas d’IA alliée imposée.
2. Deux sorts de base au rang I, puis un sort supplémentaire à chaque rang : **2 / 3 / 4 / 5 / 6** sorts aux rangs I / II / III / IV / V.
3. Les attaques dépendent du niveau du personnage et d’un pourcentage de ses caractéristiques multiplié par un coefficient.
4. Les PV dépendent du niveau du personnage et de sa Vitalité, avec des coefficients.
5. Capacité : 1 point au niveau 1, +1 aux niveaux 100, 200… soit 11 au niveau 1 000, plafond encore provisoire. Une créature occupe 1 à 4 points selon son rang ; disparition = restitution du coût exact.
6. Cinq rangs de sort, achetés pour 1, 2, 3, 4, 5 points de compétence supplémentaires (15 cumulés). Les rangs élevés d’invocation se situent à 500 et au-delà.

## Paliers proposés et acquisition des sorts propres

| Rang | Sorts disponibles | Points d’invocation | Compétence cumulée | Première créature : niveau requis | Seconde créature : niveau requis |
|---|---:|---:|---:|---:|---:|
| I | 2 | 1 | 1 | 18, Leurre : 6 | 150 |
| II | 3 | 1 | 3 | 100 | 250 |
| III | 4 | 2 | 6 | 250 | 400 |
| IV | 5 | 3 | 10 | 500 | 600 |
| V | 6 | 4 | 15 | 750 | 900 |

Les nouveaux sorts s’ajoutent aux précédents. Ils ne nécessitent pas un second budget de compétence : acheter le rang du sort d’invocation débloque le kit correspondant. C’est une convention proposée. Le rang de l’invocation ne correspond pas à une XP autonome de créature.

Le joueur peut lancer un rang inférieur déjà appris. Une créature active conserve son rang, son kit et son coût d’apparition. L’unicité par type s’applique tous rangs confondus. Exemple : deux Écuyers V (4+4) et un Porte-étendard IV (3) occupent les 11 points d’un personnage de niveau 1 000.

## Formules proposées — coefficients à équilibrer

Notations : `L` niveau du personnage (1–1 000), `r` rang de la créature, `B[r]` base du sort, `S` caractéristique totale du personnage correspondant à l’élément, `P` Puissance totale, `V` points de Vitalité du personnage (équipement compris). Terre→Force, Feu→Intelligence, Eau→Chance, Air→Agilité.

```text
croissance G = 1 + 0.002 × (L − 1)
héritage h = 0.35 × coefficientCaractéristiqueCréature
attaqueBrute = floor(B[r] × G × max(0, 1 + (S + P) × h / 100))
aprèsFixe = max(0, attaqueBrute − résistanceFixeCible)
dégâts = floor(aprèsFixe × max(0, 1 − résistancePourcentCible / 100))

PVmax = max(1, floor(basePV[r] + L × coefficientNiveauPV + V × 5 × coefficientVitalité))
```

L’héritage n’est appliqué qu’une fois : 35 % × coefficient 0,8 = 28 % de la caractéristique. La Vitalité est convertie une fois en bonus de vie : 200 Vitalité = 1 000 PV du personnage ; une part de 25 % ajoute 250 PV à l’invocation. On n’hérite pas séparément des PV max du personnage, ce qui compterait sa Vitalité deux fois.

La croissance vaut 1 au niveau 1, 1,198 au niveau 100, 1,998 au niveau 500 et 2,998 au niveau 1 000. Elle renforce les bases sans appliquer un multiplicateur ×1 000. Les résistances négatives sont des faiblesses ; le calculateur borne la résistance en pourcentage entre −100 et +100.

- **Poison** : même formule par déclenchement. Une base par tick ; deux ticks ne sont pas une attaque unique. Aucun critique. Les deux poisons de l’Araignée partagent un groupe non cumulable : conserver le plus fort et renouveler la durée.
- **Soin** : `floor(B[r] × G × max(0, 1 + Intelligence × h / 100))`, sans Puissance ni résistance, plafonné aux PV manquants en combat.
- **Bouclier** : `floor(B[r] × G)`, sans Intelligence ou autre caractéristique. Règle proposée pour garder une protection modérée.
- **Vol de vie de la lame** : 50 % des PV effectivement retirés, limité aux PV manquants de la lame. Le taux n’hérite pas d’un bonus Chance supplémentaire ; la Chance augmente déjà les dégâts Eau. Ne soigne pas Ryuu.
- Les pourcentages de protection, retraits tentés, bonus de Puissance/PO/PM, durées et déplacements suivent la valeur écrite dans le sort. Ne pas les multiplier par G ou la Force.
- Aucun dommage fixe ou critique du propriétaire hérité dans cette version. Résistances de la créature, tacle, fuite, esquive et probabilité de retrait PA/PM restent à concevoir ; un retrait indiqué est tenté, jamais garanti.

### Exemple de cohérence numérique

Écuyer spectral, rang V, personnage niveau 1 000, Force 1 000, Vitalité 200, Puissance 0 : base de l’Estoc 14, héritage 350 Force, G=2,998 → **188 dégâts bruts** ; **1 470 PV**. Avec résistance fixe 20 puis 25 %, les dégâts deviennent **126**. Avec −25 % au lieu de 25 %, ils deviennent **210**.

La Sentinelle de sang V atteint **2 430 PV** avec le même niveau et la même Vitalité ; son rôle défensif justifie des coefficients de PV supérieurs. Ces exemples vérifient les formules, pas l’équilibre global du jeu. Le choix entre plusieurs petites invocations et une forte demande des combats de test.

## Tours, contrôle et paramètres figés

**Contrôle manuel validé.** Chaque créature dispose actuellement de 4 PA et de ses PM propres ; chaque sort coûte 3 PA. Elle choisit donc une action spéciale par tour et peut se déplacer avec ses PM. Six sorts offrent six choix, pas six attaques. Cette économie de PA reste une proposition ; elle doit être revue si des bonus de PA deviennent accessibles aux invocations.

Proposition : figer niveau, caractéristiques et rang à l’apparition. Les buffs ultérieurs du propriétaire ne redimensionnent pas rétroactivement les PV ou attaques de ses invocations. Les effets directement reçus par une créature devront être appliqués séparément dans le moteur. Le simulateur ne joue pas ces buffs ; il calcule un profil hypothétique à partir des paramètres saisis. La composition enregistrée dans son test de capacité contient uniquement identifiant, rang et coût.

Les poisons conservent leur base offensive figée à l’application ; chaque tick applique les résistances actuelles de la cible. La cible commence ses N déclenchements aux N prochains débuts de son tour. Relance N : lancé au tour T de la créature, disponible au tour T+N. Réduction/protection d’un tour : jusqu’au prochain tour de la créature, sauf précision contraire.

Activation après le lanceur dès l’apparition, ordre choisi par le joueur, renvoi volontaire en fin de tour : toujours proposés, à arbitrer avec l’initiative individuelle du GDD. Les compagnons permanents du prototype restent distincts des invocations. Mort de l’invocateur : disparition de ses créatures. Pas d’invocation par une invocation. Traps, graines, balises et glyphes : pas de point d’invocation, limites propres conservées.

## Profils et 60 sorts proposés

Portées en distance de grille (Manhattan), sur terrain vide ; une case occupée par créature. Ligne de vue requise sauf mention contraire. La portée de pose de la créature et la portée de ses actions sont deux choses distinctes. Les cartes de l’atelier montrent chacune. Les valeurs ci-dessous sont les bases ou effets fixes **avant** formules ; les valeurs des rangs antérieurs au déblocage ne sont pas utilisables.

| Créature | Coefficient caractéristique | Héritage effectif | PV par niveau | Part du bonus de vie de Vitalité |
|---|---:|---:|---:|---:|
| Écuyer spectral | 1 | 35 % | 1.1 | 25 % |
| Porte-étendard | 0.8 | 28 % | 1.2 | 30 % |
| Luminou | 0.9 | 31.5 % | 0.7 | 20 % |
| Gardien des lucioles | 0.85 | 29.75 % | 1 | 30 % |
| Faucon guetteur | 0.7 | 24.5 % | 0.55 | 15 % |
| Traqueur de ronces | 0.85 | 29.75 % | 1.1 | 30 % |
| Leurre | 0.8 | 28 % | 1.4 | 35 % |
| Araignée d’ombre | 1 | 35 % | 0.65 | 20 % |
| Lame sanguine | 1 | 35 % | 0.95 | 25 % |
| Sentinelle de sang | 0.75 | 26.25 % | 1.8 | 45 % |

### Leo — Écuyer spectral

ID : `leo-ecuyer`. Invoque un écuyer mobile qui accompagne Leo au contact et exerce une pression sur une cible.

- Base PV I→V : 40 / 60 / 80 / 100 / 120. Créature : 4 PA, 3 PM.
- Pose : 3 PA, PO minimale 1 / maximale 1 / 2 / 2 / 3 / 3, relance 4 tours.
- Niveaux requis : 18 / 100 / 250 / 500 / 750. Coûts : 1 / 1 / 2 / 3 / 4.
- Plusieurs exemplaires possibles dans la capacité disponible. Durée : jusqu’à disparition ou fin du combat.

**Rang 1 — Estoc spectral** (`leo-ecuyer-action-1`)

- 3 PA ; PO 1 ; cible : Ennemi ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 0 tour(s).
- Type : damage / Terre. Bases ou valeurs fixes I→V : 6 / 8 / 10 / 12 / 14 dégâts.
- Frappe de mêlée sur une cible.

**Rang 1 — Parade** (`leo-ecuyer-action-2`)

- 3 PA ; PO 0 ; cible : Soi ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 0 tour(s).
- Type : fixed. Bases ou valeurs fixes I→V : 10 / 13 / 15 / 18 / 20 % de réduction.
- Réduction des dégâts subis de 10 à 20 % selon le rang, jusqu’au prochain tour. Non cumulable avec une autre Parade.

**Rang 2 — Ébranlement** (`leo-ecuyer-action-3`)

- 3 PA ; PO 1 ; cible : Ennemi ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 0 tour(s).
- Type : damage / Terre. Bases ou valeurs fixes I→V : 4 / 6 / 7 / 9 / 10 dégâts.
- Dégâts et poussée de 1 case. Arrêt sur obstacle ; dégâts de collision non calculés.

**Rang 3 — Couverture** (`leo-ecuyer-action-4`)

- 3 PA ; PO 1 ; cible : Allié ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 0 tour(s).
- Type : shield. Bases ou valeurs fixes I→V : 8 / 11 / 13 / 16 / 18 PV de bouclier.
- Bouclier pour un allié adjacent pendant 1 tour. Même bouclier non cumulable.

**Rang 4 — Fente spectrale** (`leo-ecuyer-action-5`)

- 3 PA ; PO 1–2 ; cible : Ennemi ; rayon 0 ; en ligne ; ligne de vue requise ; relance 0 tour(s).
- Type : damage / Terre. Bases ou valeurs fixes I→V : 7 / 9 / 12 / 14 / 16 dégâts.
- Frappe en ligne à courte portée, sans déplacement de l’écuyer.

**Rang 5 — Brèche du garde** (`leo-ecuyer-action-6`)

- 3 PA ; PO 1 ; cible : Ennemi ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 2 tour(s).
- Type : damage / Terre. Bases ou valeurs fixes I→V : 8 / 11 / 13 / 16 / 18 dégâts.
- Frappe et −5 points de résistance Terre pendant 1 tour. Le malus s’applique après la frappe, non cumulable.


### Leo — Porte-étendard

ID : `leo-etendard`. Invoque un porteur d’étendard qui renforce brièvement la Puissance des alliés proches.

- Base PV I→V : 50 / 75 / 100 / 125 / 150. Créature : 4 PA, 2 PM.
- Pose : 4 PA, PO minimale 1 / maximale 1 / 2 / 2 / 3 / 3, relance 5 tours.
- Niveaux requis : 150 / 250 / 400 / 600 / 900. Coûts : 1 / 1 / 2 / 3 / 4.
- Unique par propriétaire, tous rangs confondus. Durée : jusqu’à disparition ou fin du combat.

**Rang 1 — Ralliement** (`leo-etendard-action-1`)

- 3 PA ; PO 0 ; cible : Alliés dans la zone ; rayon 2 ; toutes directions ; ligne de vue requise ; relance 0 tour(s).
- Type : fixed. Bases ou valeurs fixes I→V : 20 / 30 / 40 / 50 / 60 Puissance.
- Augmente la Puissance des alliés, hors porteur, pendant 1 tour. Même bonus non cumulable.

**Rang 1 — Coup de hampe** (`leo-etendard-action-2`)

- 3 PA ; PO 1 ; cible : Ennemi ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 0 tour(s).
- Type : damage / Terre. Bases ou valeurs fixes I→V : 3 / 4 / 6 / 7 / 8 dégâts.
- Attaque de secours au contact.

**Rang 2 — Étendard protecteur** (`leo-etendard-action-3`)

- 3 PA ; PO 1–3 ; cible : Allié ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 0 tour(s).
- Type : shield. Bases ou valeurs fixes I→V : 6 / 8 / 11 / 13 / 15 PV de bouclier.
- Pose un bouclier de 1 tour sur un allié ; même bouclier non cumulable.

**Rang 3 — Signal de marche** (`leo-etendard-action-4`)

- 3 PA ; PO 1–3 ; cible : Allié ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 2 tour(s).
- Type : fixed. Bases ou valeurs fixes I→V : 1 / 1 / 1 / 1 / 1 PM.
- Accorde 1 PM pendant 1 tour. Même bonus non cumulable.

**Rang 4 — Recul du front** (`leo-etendard-action-5`)

- 3 PA ; PO 1 ; cible : Ennemi ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 0 tour(s).
- Type : damage / Terre. Bases ou valeurs fixes I→V : 4 / 6 / 7 / 9 / 10 dégâts.
- Coup de hampe et poussée de 2 cases. Arrêt sur obstacle.

**Rang 5 — Bannière tenace** (`leo-etendard-action-6`)

- 3 PA ; PO 0 ; cible : Alliés dans la zone ; rayon 2 ; toutes directions ; ligne de vue requise ; relance 3 tour(s).
- Type : fixed. Bases ou valeurs fixes I→V : 10 / 10 / 10 / 10 / 10 % de réduction.
- Réduit les dégâts subis des alliés, hors porteur, de 10 % pendant 1 tour. Même effet non cumulable.


### Lina — Luminou

ID : `lina-luminou`. Invoque un petit esprit lumineux qui suit les alliés et peut soigner une cible à son tour.

- Base PV I→V : 25 / 40 / 55 / 70 / 85. Créature : 4 PA, 3 PM.
- Pose : 3 PA, PO minimale 1 / maximale 1 / 2 / 2 / 3 / 3, relance 4 tours.
- Niveaux requis : 18 / 100 / 250 / 500 / 750. Coûts : 1 / 1 / 2 / 3 / 4.
- Plusieurs exemplaires possibles dans la capacité disponible. Durée : jusqu’à disparition ou fin du combat.

**Rang 1 — Lueur réparatrice** (`lina-luminou-action-1`)

- 3 PA ; PO 1–3 ; cible : Allié ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 0 tour(s).
- Type : heal. Bases ou valeurs fixes I→V : 6 / 9 / 12 / 15 / 18 PV soignés.
- Soin ciblé, ne peut pas se cibler lui-même. Limité aux PV manquants.

**Rang 1 — Petite garde** (`lina-luminou-action-2`)

- 3 PA ; PO 1–2 ; cible : Allié ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 0 tour(s).
- Type : shield. Bases ou valeurs fixes I→V : 4 / 6 / 7 / 9 / 10 PV de bouclier.
- Bouclier de 1 tour, même bouclier non cumulable.

**Rang 2 — Soin intérieur** (`lina-luminou-action-3`)

- 3 PA ; PO 0 ; cible : Soi ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 2 tour(s).
- Type : heal. Bases ou valeurs fixes I→V : 4 / 6 / 8 / 10 / 12 PV soignés.
- Se soigne lui-même, dans la limite de ses PV manquants.

**Rang 3 — Étincelle vive** (`lina-luminou-action-4`)

- 3 PA ; PO 1–3 ; cible : Ennemi ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 0 tour(s).
- Type : damage / Feu. Bases ou valeurs fixes I→V : 3 / 4 / 6 / 7 / 8 dégâts.
- Petite attaque Feu ; choisir entre attaquer et soutenir.

**Rang 4 — Souffle apaisant** (`lina-luminou-action-5`)

- 3 PA ; PO 0 ; cible : Alliés dans la zone ; rayon 1 ; toutes directions ; ligne de vue requise ; relance 2 tour(s).
- Type : heal. Bases ou valeurs fixes I→V : 4 / 6 / 8 / 9 / 11 PV soignés.
- Soigne les alliés dans un rayon de 1 case, y compris le Luminou. Valeur par cible.

**Rang 5 — Clarté** (`lina-luminou-action-6`)

- 3 PA ; PO 1–3 ; cible : Allié ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 3 tour(s).
- Type : cleanse. Bases ou valeurs fixes I→V : 1 / 1 / 1 / 1 / 1 poison dissipé.
- Retire un poison dissipable choisi par le joueur sur un allié. Aucun soin associé.


### Lina — Gardien des lucioles

ID : `lina-lucioles`. Invoque un gardien qui pose un bouclier court sur un allié et dispose de soins de secours aux rangs supérieurs.

- Base PV I→V : 40 / 60 / 80 / 100 / 120. Créature : 4 PA, 2 PM.
- Pose : 4 PA, PO minimale 1 / maximale 1 / 2 / 2 / 3 / 3, relance 5 tours.
- Niveaux requis : 150 / 250 / 400 / 600 / 900. Coûts : 1 / 1 / 2 / 3 / 4.
- Unique par propriétaire, tous rangs confondus. Durée : jusqu’à disparition ou fin du combat.

**Rang 1 — Cocon lumineux** (`lina-lucioles-action-1`)

- 3 PA ; PO 1–3 ; cible : Allié ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 0 tour(s).
- Type : shield. Bases ou valeurs fixes I→V : 15 / 26 / 38 / 49 / 60 PV de bouclier.
- Bouclier de 1 tour. Même bouclier non cumulable.

**Rang 1 — Piqûre lumineuse** (`lina-lucioles-action-2`)

- 3 PA ; PO 1–2 ; cible : Ennemi ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 0 tour(s).
- Type : damage / Feu. Bases ou valeurs fixes I→V : 3 / 4 / 5 / 6 / 7 dégâts.
- Petite attaque Feu sur une cible.

**Rang 2 — Lueur de secours** (`lina-lucioles-action-3`)

- 3 PA ; PO 1–2 ; cible : Allié ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 0 tour(s).
- Type : heal. Bases ou valeurs fixes I→V : 4 / 6 / 7 / 9 / 10 PV soignés.
- Soin de secours sur un allié, limité aux PV manquants.

**Rang 3 — Carapace de lumière** (`lina-lucioles-action-4`)

- 3 PA ; PO 0 ; cible : Soi ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 0 tour(s).
- Type : shield. Bases ou valeurs fixes I→V : 10 / 14 / 18 / 21 / 25 PV de bouclier.
- Bouclier personnel pendant 1 tour. Non cumulable avec lui-même.

**Rang 4 — Éclat aveuglant** (`lina-lucioles-action-5`)

- 3 PA ; PO 1–3 ; cible : Ennemi ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 2 tour(s).
- Type : damage / Feu. Bases ou valeurs fixes I→V : 4 / 5 / 7 / 8 / 9 dégâts.
- Frappe et −10 points de chance de critique pendant 1 tour, plancher 0 %. Même malus non cumulable.

**Rang 5 — Voûte des lucioles** (`lina-lucioles-action-6`)

- 3 PA ; PO 0 ; cible : Alliés dans la zone ; rayon 1 ; toutes directions ; ligne de vue requise ; relance 3 tour(s).
- Type : shield. Bases ou valeurs fixes I→V : 10 / 15 / 20 / 25 / 30 PV de bouclier.
- Bouclier de 1 tour par allié dans la zone, gardien inclus. Ne se cumule pas avec Cocon lumineux : conserver le plus fort.


### Sela — Faucon guetteur

ID : `sela-faucon`. Invoque un éclaireur rapide qui révèle les ennemis dissimulés et prépare les lignes de tir.

- Base PV I→V : 20 / 33 / 45 / 58 / 70. Créature : 4 PA, 5 PM.
- Pose : 3 PA, PO minimale 1 / maximale 1 / 2 / 2 / 3 / 3, relance 4 tours.
- Niveaux requis : 18 / 100 / 250 / 500 / 750. Coûts : 1 / 1 / 2 / 3 / 4.
- Plusieurs exemplaires possibles dans la capacité disponible. Durée : jusqu’à disparition ou fin du combat.

**Rang 1 — Regard perçant** (`sela-faucon-action-1`)

- 3 PA ; PO 0 ; cible : Ennemis dans la zone ; rayon 2 ; toutes directions ; sans ligne de vue ; relance 0 tour(s).
- Type : reveal. Bases ou valeurs fixes I→V : 1 / 1 / 1 / 1 / 1 tour.
- Révèle les ennemis dissimulés dans un rayon de 2 jusqu’au prochain tour du faucon.

**Rang 1 — Coup de bec** (`sela-faucon-action-2`)

- 3 PA ; PO 1 ; cible : Ennemi ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 0 tour(s).
- Type : damage / Air. Bases ou valeurs fixes I→V : 3 / 4 / 6 / 7 / 8 dégâts.
- Attaque au contact ; aucun déplacement aérien spécial.

**Rang 2 — Cri de guet** (`sela-faucon-action-3`)

- 3 PA ; PO 1–3 ; cible : Allié ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 2 tour(s).
- Type : fixed. Bases ou valeurs fixes I→V : 1 / 1 / 1 / 1 / 1 PO.
- Accorde +1 portée pendant 1 tour aux sorts à portée modifiable. Même bonus non cumulable.

**Rang 3 — Battement d’ailes** (`sela-faucon-action-4`)

- 3 PA ; PO 1 ; cible : Ennemi ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 0 tour(s).
- Type : push. Bases ou valeurs fixes I→V : 1 / 1 / 1 / 1 / 1 case.
- Repousse de 1 case sans dégâts. Arrêt sur obstacle.

**Rang 4 — Serres précises** (`sela-faucon-action-5`)

- 3 PA ; PO 1 ; cible : Ennemi ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 0 tour(s).
- Type : damage / Air. Bases ou valeurs fixes I→V : 5 / 7 / 9 / 10 / 12 dégâts.
- Frappe et −5 points de chance de critique pendant 1 tour, non cumulable.

**Rang 5 — Veille perçante** (`sela-faucon-action-6`)

- 3 PA ; PO 0 ; cible : Ennemis dans la zone ; rayon 3 ; toutes directions ; sans ligne de vue ; relance 3 tour(s).
- Type : reveal. Bases ou valeurs fixes I→V : 1 / 1 / 1 / 1 / 1 tour.
- Révèle les ennemis dissimulés dans un rayon de 3 jusqu’au prochain tour du faucon.


### Sela — Traqueur de ronces

ID : `sela-ronces`. Invoque un traqueur qui gêne l’approche d’un ennemi avec un retrait de PM ciblé.

- Base PV I→V : 45 / 66 / 88 / 109 / 130. Créature : 4 PA, 3 PM.
- Pose : 4 PA, PO minimale 1 / maximale 1 / 2 / 2 / 3 / 3, relance 5 tours.
- Niveaux requis : 150 / 250 / 400 / 600 / 900. Coûts : 1 / 1 / 2 / 3 / 4.
- Unique par propriétaire, tous rangs confondus. Durée : jusqu’à disparition ou fin du combat.

**Rang 1 — Entrave végétale** (`sela-ronces-action-1`)

- 3 PA ; PO 1–2 ; cible : Ennemi ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 0 tour(s).
- Type : removal. Bases ou valeurs fixes I→V : 1 / 1 / 1 / 1 / 1 PM tenté.
- Tente de retirer 1 PM, esquivable, pendant 1 tour. Même malus non cumulable ; probabilité non calculée.

**Rang 1 — Épine vive** (`sela-ronces-action-2`)

- 3 PA ; PO 1–3 ; cible : Ennemi ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 0 tour(s).
- Type : damage / Terre. Bases ou valeurs fixes I→V : 4 / 6 / 7 / 9 / 10 dégâts.
- Projectile Terre sur une cible.

**Rang 2 — Écorce** (`sela-ronces-action-3`)

- 3 PA ; PO 0 ; cible : Soi ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 0 tour(s).
- Type : shield. Bases ou valeurs fixes I→V : 8 / 11 / 14 / 17 / 20 PV de bouclier.
- Bouclier personnel de 1 tour, non cumulable avec lui-même.

**Rang 3 — Liane de rappel** (`sela-ronces-action-4`)

- 3 PA ; PO 1–3 ; cible : Ennemi ; rayon 0 ; en ligne ; ligne de vue requise ; relance 0 tour(s).
- Type : pull. Bases ou valeurs fixes I→V : 1 / 1 / 1 / 1 / 1 case.
- Attire de 1 case en ligne ; arrêt avant la case du traqueur ou un obstacle.

**Rang 4 — Épine engourdissante** (`sela-ronces-action-5`)

- 3 PA ; PO 1–3 ; cible : Ennemi ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 2 tour(s).
- Type : damage / Terre. Bases ou valeurs fixes I→V : 5 / 7 / 9 / 10 / 12 dégâts.
- Frappe et tente de retirer 1 PM pendant 1 tour. Retrait esquivable, non cumulable avec Entrave végétale.

**Rang 5 — Enracinement** (`sela-ronces-action-6`)

- 3 PA ; PO 1–3 ; cible : Ennemi ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 3 tour(s).
- Type : removal. Bases ou valeurs fixes I→V : 2 / 2 / 2 / 2 / 2 PM tentés.
- Tente de retirer 2 PM pendant 1 tour. Esquivable ; ne se cumule pas avec les autres retraits de cette créature, garder le plus fort.


### Kael — Leurre

ID : `kael-5`. Invoque un double mobile qui occupe une case et sert de relais à Permutation et Plan de fuite.

- Base PV I→V : 30 / 53 / 75 / 98 / 120. Créature : 4 PA, 3 PM.
- Pose : 3 PA, PO minimale 1 / maximale 1 / 2 / 2 / 3 / 3, relance 4 tours.
- Niveaux requis : 6 / 100 / 250 / 500 / 750. Coûts : 1 / 1 / 2 / 3 / 4.
- Unique par propriétaire, tous rangs confondus. Durée : 3 tours de la créature.

**Rang 1 — Miroir de garde** (`kael-5-action-1`)

- 3 PA ; PO 0 ; cible : Soi ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 0 tour(s).
- Type : fixed. Bases ou valeurs fixes I→V : 10 / 13 / 15 / 18 / 20 % de réduction.
- Réduit ses dégâts subis pendant 1 tour ; même réduction non cumulable. Le Leurre n’attaque pas.

**Rang 1 — Écho trompeur** (`kael-5-action-2`)

- 3 PA ; PO 1–2 ; cible : Ennemi ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 0 tour(s).
- Type : fixed. Bases ou valeurs fixes I→V : 5 / 6 / 8 / 9 / 10 points de critique retirés.
- Réduit la chance de critique de la cible de 5 à 10 points pendant 1 tour, plancher 0 %. Même malus non cumulable.

**Rang 2 — Repli miroir** (`kael-5-action-3`)

- 3 PA ; PO 1–3 ; cible : Kael propriétaire ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 2 tour(s).
- Type : swap. Bases ou valeurs fixes I→V : 1 / 1 / 1 / 1 / 1 échange.
- Échange sa position avec son invocateur si les deux unités peuvent être déplacées ; les cases restent valides.

**Rang 3 — Ombre protectrice** (`kael-5-action-4`)

- 3 PA ; PO 1–2 ; cible : Allié ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 0 tour(s).
- Type : shield. Bases ou valeurs fixes I→V : 6 / 9 / 11 / 14 / 16 PV de bouclier.
- Bouclier de 1 tour sur un allié ; même bouclier non cumulable.

**Rang 4 — Fausse menace** (`kael-5-action-5`)

- 3 PA ; PO 1–2 ; cible : Ennemi ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 2 tour(s).
- Type : removal. Bases ou valeurs fixes I→V : 1 / 1 / 1 / 1 / 1 PA tenté.
- Tente de retirer 1 PA pendant 1 tour, esquivable. Même malus non cumulable ; probabilité non calculée.

**Rang 5 — Dernier reflet** (`kael-5-action-6`)

- 3 PA ; PO 1–3 ; cible : Kael propriétaire ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 3 tour(s).
- Type : shield. Bases ou valeurs fixes I→V : 12 / 17 / 21 / 26 / 30 PV de bouclier.
- Protège Kael pendant 1 tour puis fait disparaître le Leurre, libérant son coût exact. Non cumulable avec Ombre protectrice.


### Kael — Araignée d’ombre

ID : `kael-araignee`. Invoque une araignée qui applique un poison bref au contact sans reproduire les pièges de Kael.

- Base PV I→V : 20 / 35 / 50 / 65 / 80. Créature : 4 PA, 4 PM.
- Pose : 4 PA, PO minimale 1 / maximale 1 / 2 / 2 / 3 / 3, relance 5 tours.
- Niveaux requis : 150 / 250 / 400 / 600 / 900. Coûts : 1 / 1 / 2 / 3 / 4.
- Unique par propriétaire, tous rangs confondus. Durée : jusqu’à disparition ou fin du combat.

**Rang 1 — Morsure insidieuse** (`kael-araignee-action-1`)

- 3 PA ; PO 1 ; cible : Ennemi ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 0 tour(s).
- Type : poison / Air. Bases ou valeurs fixes I→V : 2 / 3 / 4 / 4 / 5 dégâts / déclenchement.
- Poison aux deux prochains débuts de tour de la cible, sans dégât immédiat. Même poison non cumulable ; durée renouvelée.

**Rang 1 — Piqûre d’ombre** (`kael-araignee-action-2`)

- 3 PA ; PO 1 ; cible : Ennemi ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 0 tour(s).
- Type : damage / Air. Bases ou valeurs fixes I→V : 3 / 4 / 6 / 7 / 8 dégâts.
- Dégâts immédiats, sans poison.

**Rang 2 — Fil entravant** (`kael-araignee-action-3`)

- 3 PA ; PO 1–2 ; cible : Ennemi ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 0 tour(s).
- Type : removal. Bases ou valeurs fixes I→V : 1 / 1 / 1 / 1 / 1 PM tenté.
- Tente de retirer 1 PM pendant 1 tour, esquivable. Même malus non cumulable ; aucun piège posé.

**Rang 3 — Carapace nocturne** (`kael-araignee-action-4`)

- 3 PA ; PO 0 ; cible : Soi ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 0 tour(s).
- Type : shield. Bases ou valeurs fixes I→V : 6 / 8 / 11 / 13 / 15 PV de bouclier.
- Bouclier personnel pendant 1 tour, non cumulable avec lui-même.

**Rang 4 — Venin distant** (`kael-araignee-action-5`)

- 3 PA ; PO 1–3 ; cible : Ennemi ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 2 tour(s).
- Type : poison / Air. Bases ou valeurs fixes I→V : 2 / 3 / 3 / 4 / 4 dégâts / déclenchement.
- Poison pour deux débuts de tour, sans dégâts immédiats. Partage le groupe de poison de Morsure insidieuse : conserver la valeur la plus forte et renouveler la durée.

**Rang 5 — Crochet obscur** (`kael-araignee-action-6`)

- 3 PA ; PO 1 ; cible : Ennemi ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 2 tour(s).
- Type : damage / Air. Bases ou valeurs fixes I→V : 6 / 8 / 10 / 12 / 14 dégâts.
- Frappe et −10 points de chance de critique pendant 1 tour. Même malus non cumulable.


### Ryuu — Lame sanguine

ID : `ryuu-lame`. Invoque une lame animée qui frappe au contact, se régénère et peut échanger sa position avec Ryuu.

- Base PV I→V : 35 / 54 / 73 / 91 / 110. Créature : 4 PA, 3 PM.
- Pose : 4 PA, PO minimale 1 / maximale 1 / 2 / 2 / 3 / 3, relance 4 tours.
- Niveaux requis : 18 / 100 / 250 / 500 / 750. Coûts : 1 / 1 / 2 / 3 / 4.
- Plusieurs exemplaires possibles dans la capacité disponible. Durée : jusqu’à disparition ou fin du combat.

**Rang 1 — Morsure d’acier** (`ryuu-lame-action-1`)

- 3 PA ; PO 1 ; cible : Ennemi ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 0 tour(s).
- Type : damage / Eau. Bases ou valeurs fixes I→V : 6 / 8 / 11 / 13 / 15 dégâts.
- Rend à la lame 50 % des PV effectivement retirés, sans soigner Ryuu. Limité aux PV manquants ; pas de bonus Chance supplémentaire sur le taux.

**Rang 1 — Garde flottante** (`ryuu-lame-action-2`)

- 3 PA ; PO 0 ; cible : Soi ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 0 tour(s).
- Type : shield. Bases ou valeurs fixes I→V : 6 / 9 / 12 / 15 / 18 PV de bouclier.
- Bouclier personnel de 1 tour, non cumulable avec lui-même.

**Rang 2 — Entaille de rappel** (`ryuu-lame-action-3`)

- 3 PA ; PO 1–2 ; cible : Ennemi ; rayon 0 ; en ligne ; ligne de vue requise ; relance 0 tour(s).
- Type : damage / Eau. Bases ou valeurs fixes I→V : 4 / 6 / 7 / 9 / 10 dégâts.
- Frappe en ligne puis attire de 1 case si la destination est libre ; arrêt avant la lame.

**Rang 3 — Relais sanguin** (`ryuu-lame-action-4`)

- 3 PA ; PO 1–3 ; cible : Ryuu propriétaire ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 2 tour(s).
- Type : swap. Bases ou valeurs fixes I→V : 1 / 1 / 1 / 1 / 1 échange.
- Échange sa position avec Ryuu si les deux unités peuvent être déplacées.

**Rang 4 — Tranchant repoussoir** (`ryuu-lame-action-5`)

- 3 PA ; PO 1 ; cible : Ennemi ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 0 tour(s).
- Type : damage / Eau. Bases ou valeurs fixes I→V : 5 / 7 / 9 / 10 / 12 dégâts.
- Frappe et repousse de 2 cases ; arrêt sur obstacle.

**Rang 5 — Soif d’acier** (`ryuu-lame-action-6`)

- 3 PA ; PO 1 ; cible : Ennemi ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 3 tour(s).
- Type : damage / Eau. Bases ou valeurs fixes I→V : 8 / 11 / 13 / 16 / 18 dégâts.
- Rend à la lame 50 % des PV effectivement retirés. Aucun soin à Ryuu et aucune charge de douleur.


### Ryuu — Sentinelle de sang

ID : `ryuu-sentinelle`. Invoque une sentinelle qui occupe le terrain et prend une part limitée des dégâts d’un allié proche.

- Base PV I→V : 60 / 90 / 120 / 150 / 180. Créature : 4 PA, 2 PM.
- Pose : 4 PA, PO minimale 1 / maximale 1 / 1 / 2 / 2 / 2, relance 5 tours.
- Niveaux requis : 150 / 250 / 400 / 600 / 900. Coûts : 1 / 1 / 2 / 3 / 4.
- Unique par propriétaire, tous rangs confondus. Durée : jusqu’à disparition ou fin du combat.

**Rang 1 — Garde liée** (`ryuu-sentinelle-action-1`)

- 3 PA ; PO 1 ; cible : Allié ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 0 tour(s).
- Type : transfer. Bases ou valeurs fixes I→V : 10 / 13 / 15 / 18 / 20 % transférés.
- Transfère cette part des dégâts vers la sentinelle pendant 1 tour. Plafond par tour : 20 % de ses PV max calculés. Aucun transfert en chaîne ; avec Interposition ou Partage du fardeau, garder le taux le plus fort.

**Rang 1 — Heurt du rempart** (`ryuu-sentinelle-action-2`)

- 3 PA ; PO 1 ; cible : Ennemi ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 0 tour(s).
- Type : damage / Eau. Bases ou valeurs fixes I→V : 3 / 4 / 6 / 7 / 8 dégâts.
- Frappe de mêlée sur une cible.

**Rang 2 — Plaques vivantes** (`ryuu-sentinelle-action-3`)

- 3 PA ; PO 0 ; cible : Soi ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 0 tour(s).
- Type : shield. Bases ou valeurs fixes I→V : 10 / 14 / 18 / 21 / 25 PV de bouclier.
- Bouclier personnel de 1 tour, non cumulable avec lui-même.

**Rang 3 — Ancrage** (`ryuu-sentinelle-action-4`)

- 3 PA ; PO 0 ; cible : Soi ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 2 tour(s).
- Type : fixed. Bases ou valeurs fixes I→V : 1 / 1 / 1 / 1 / 1 tour.
- Immunité à la poussée et à l’attraction pendant 1 tour ; les échanges de position restent soumis à leurs règles.

**Rang 4 — Heurt de recul** (`ryuu-sentinelle-action-5`)

- 3 PA ; PO 1 ; cible : Ennemi ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 0 tour(s).
- Type : damage / Eau. Bases ou valeurs fixes I→V : 4 / 6 / 7 / 9 / 10 dégâts.
- Frappe et repousse de 1 case, arrêt sur obstacle.

**Rang 5 — Rempart fraternel** (`ryuu-sentinelle-action-6`)

- 3 PA ; PO 1–2 ; cible : Allié ; rayon 0 ; toutes directions ; ligne de vue requise ; relance 3 tour(s).
- Type : shield. Bases ou valeurs fixes I→V : 15 / 21 / 28 / 34 / 40 PV de bouclier.
- Bouclier de 1 tour sur un allié. Même bouclier non cumulable ; ne modifie pas le transfert de Garde liée.

## Vérification et limites

Exécuter `node tests/summons-model-v0.5.test.cjs` à la racine du dépôt. Vérifications : 60 identifiants d’actions distincts, 2/3/4/5/6 sorts, verrouillage par rang, héritage élémentaire, PV, croissance avec niveau, résistances fixes/%, faiblesses, soins indépendants de Puissance, boucliers indépendants d’Intelligence, géométrie de portée et zone. Les tests passent.

Dans l’atelier : 545 combinaisons sort/rang et les cartes des 60 actions ont passé un rendu JavaScript simulé. Contrôle visuel en navigateur non effectué. Les capacités, coûts et niveaux d’acquisition de v0.4 sont conservés ; aucun test d’équilibrage multijoueur n’est revendiqué.

Restent à tester : rendement des coûts 1–4, cumul entre différentes familles de boucliers, effets de six choix par tour, valeur de la dissipation, boucles de placement, impact du niveau 1 000, durée des tours. Le budget de compétence excédentaire à haut niveau reste à définir. Les anciennes fiches v0.3/v0.4 « sans attaque » de certaines créatures de soutien sont remplacées par ce catalogue ; seul le Leurre reste volontairement sans dégâts directs ou poison.
