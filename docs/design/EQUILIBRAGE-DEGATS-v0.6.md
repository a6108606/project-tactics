# Échelle de dégâts — calibration v0.6

Date : 2026-10-15. Demande utilisateur : obtenir la même échelle de dégâts que DOFUS. Les valeurs et coefficients ci-dessous sont des propositions testables, pas une équivalence certifiée d’équilibrage.

Cette version remplace les **bases offensives et l’héritage offensif** de v0.5. Les règles d’invocation, PV, soins, boucliers, 2/3/4/5/6 sorts, coûts 1/1/2/3/4, paliers et contrôle joueur restent ceux de [v0.5](INVOCATIONS-v0.5.md). Les valeurs offensives actuelles sont celles des catalogues v0.6.

## Sources et périmètre de comparaison

Sources consultées le 15/10/2026, OpenDofusDB, site communautaire non affilié à Ankama :

- [Pression](https://openddb.dev/spells/13106-pression) : au dernier rang publié, **26–30 de base, 3 PA**.
- [Épée de Iop](https://openddb.dev/spells/13125-epee-de-iop) : au dernier rang publié, **37–41 de base, 4 PA**.
- [Concentration](https://openddb.dev/spells/13123-concentration) : référence secondaire, dernier rang publié **20–24 de base, 2 PA**, hors effet spécifique contre les invocations.

Il s’agit de références modernes consultées, pas d’un relevé certifié de DOFUS Rétro. Leurs autres effets, critiques et synergies de classe ne sont pas inclus dans les comparaisons ci-dessous. Un héros de niveau 1 000 de Project Tactics n’est pas supposé égal à un personnage DOFUS de niveau 200 : on compare des coûts en PA, des caractéristiques et des attaques dans des conditions explicites.

Les 1 000 points de caractéristique ne donnent pas ×1 000 dégâts : ils donnent ×11 sur une base de sort, hors autres bonus. Les gros nombres dépendent aussi de la Puissance, des dommages fixes, des critiques, des dégâts finaux et des buffs. Le modèle garde cette distinction.

## Deux profils reproductibles

| Profil | Caractéristique de l’élément | Puissance | Dommages fixes | Bonus final héros | Résistance cible |
|---|---:|---:|---:|---:|---:|
| Sans bonus | 1 000 | 0 | 0 | 0 % | 0 % |
| Équipé de comparaison | 1 200 | 300 | 100 | +15 % | 0 %, puis 30 % |

Le second profil est **un repère de calcul proposé**, pas un équipement DOFUS vérifié ni une garantie de disponibilité d’objets dans Project Tactics. Les dégâts concernent un coup normal, sans critique, sans buff de classe, sans résistance fixe. Pour une invocation : niveau du propriétaire 1 000, rang V, héritage propre à la créature. Les bonus finaux du propriétaire ne sont pas hérités.

| Attaque | PA | Sans bonus | Équipé, 0 % résistance | Équipé, 30 % résistance |
|---|---:|---:|---:|---:|
| DOFUS — Pression, rang maximal publié | 3 | 286–330 | 593–667 | 415–466 |
| DOFUS — Épée de Iop, rang maximal publié | 4 | 407–451 | 795–869 | 556–608 |
| Leo — Frappe rocheuse V | 3 | 330–374 | 667–740 | 466–517 |
| Écuyer spectral V — Estoc spectral | 3 | 395 | 610 | 427 |
| Lame sanguine V — Morsure d’acier | 3 | 431 | 661 | 462 |

Ce tableau applique le calculateur Project Tactics aux bases publiées pour les deux sorts DOFUS : c’est une comparaison arithmétique avec hypothèses communes, pas une mesure en jeu. Les arrondis sont ceux du calculateur, étage par étage.

Les PA d’une créature lui appartiennent ; il faut en plus payer sa pose avec les PA du héros et immobiliser 1–4 points de capacité. Une invocation à 4 PA avec des actions à 3 PA fait une action spéciale par tour dans le modèle actuel. Les bases ne s’interprètent donc pas comme un simple sort supplémentaire gratuit du héros.

## Ajustement des héros

Frappe rocheuse devient, du rang I au V : **16–18 / 20–22 / 24–27 / 27–30 / 30–34**. Elle reste une frappe de contact sans effet annexe, à 3 PA, deux lancers par tour. Le rang V était auparavant fixé à 24, soit 264 dégâts avec 1 000 Force sans bonus.

Pour les autres sorts offensifs, le recalibrage conservateur utilise la moyenne de l’ancienne base du rang V, avec les repères suivants : 2 PA→22, 3 PA→32, 4 PA→40, 5 PA→60. Le facteur maximal est `max(1, min(1.4, repèrePA / ancienneMoyenneV))` : aucune diminution, hausse plafonnée à 40 %, et un sort déjà au-dessus du repère ne monte pas automatiquement. La moitié de cette hausse s’applique au rang I, puis augmente progressivement jusqu’au rang V. Ce sont des repères de migration, pas un plafond dur de dégâts.

Les bonus conditionnels de base suivent le facteur de leur attaque. Les bases de poison des héros augmentent de 10/15/20/25/30 % par rang, arrondies à l’entier le plus proche. Les dommages fixes restent appliqués par frappe ou déclenchement : tester spécialement leur effet sur les poisons. Les soins, PV, protections, déplacements et retraits ne sont pas augmentés par cette migration.

## Ajustement des invocations

Les bases des attaques et poisons sont multipliées, aux rangs I→V, par **1,15 / 1,25 / 1,40 / 1,50 / 1,60**, puis arrondies à l’entier le plus proche. Les bases des sorts de soin et bouclier sont conservées.

```text
G = 1 + 0.002 × (niveauPersonnage − 1)
héritageOffensif = 0.50 × coefficientCaractéristiqueCréature
fixesHérités = (dommagesFixesGénéraux + dommagesFixesÉlément) × 0.50 × coefficientCaractéristiqueCréature
brut = floor(baseDuRang × G × max(0, 1 + (caractéristiqueÉlément + Puissance) × héritageOffensif / 100) + fixesHérités)
aprèsFixe = max(0, brut − résistanceFixe)
dégâts = floor(aprèsFixe × max(0, 1 − résistancePourcent / 100))
```

Le coefficient propre à chaque créature est conservé (par exemple 1 pour l’Écuyer, 0,7 pour le Faucon). L’héritage offensif passe donc de 35 % à 50 % avant ce coefficient. Chaque tick de poison reçoit sa fraction de dommages fixes. Ni critiques ni dégâts finaux du propriétaire ne sont hérités.

**Soins** : héritage de l’Intelligence maintenu à 35 % × coefficient, sans Puissance ni dommages fixes. **Boucliers** : croissance par niveau seulement, inchangée. **PV** : formule de v0.5 inchangée, notamment Vitalité × 5 convertie une seule fois. Le coefficient défensif n’est pas celui des dommages.

Exemple à paramètres strictement constants : Écuyer V, niveau 1 000, Force 1 000, Puissance 0, aucun dommage fixe : **188 → 395**. Ses PV restent **1 470** si le personnage possède 200 Vitalité. Avec le profil équipé, l’Estoc passe à **610**.

## Livrables actuels

- [Atelier interactif](https://tactics-grimoire-atelier.a6108606.chatgpt.site?view=invocations) : préréglages communs, tableau comparatif et formulaires libres. Le preset d’invocation choisit un élément principal par classe ; les autres éléments restent modifiables. Le profil initial est équipé, rang V / propriétaire niveau 1 000.
- [Catalogue d’invocations v0.6](../../content/summons/catalog-v0.6.json) : dix créatures et leurs soixante sorts.
- [Catalogue des sorts de héros et repères v0.6](../../content/combat/calibration-v0.6.json) : profils numériques actuels, sources et résultats de comparaison.
- [Modèle exécutable v0.6](../../content/summons/model-v0.6.cjs).
- [Tests](../../tests/summons-model-v0.6.test.cjs), à lancer avec `node tests/summons-model-v0.6.test.cjs`.
- [Brief de chara design](../art/INVOCATIONS-CHARA-DESIGN.md), identités et animations conservées.

## Vérification et limites

Tests passés : formules d’héritage et de dommages fixes, résistances/faiblesses, PV et soins inchangés, préréglages, résultats comparatifs, 2/3/4/5/6 actions, géométrie de portée. Les 545 combinaisons sort/rang de l’atelier ont passé le rendu JavaScript simulé. Pas de contrôle visuel en navigateur cette session.

Même échelle de dégâts ne signifie pas même équilibre de combat. Il faut encore tester les PV des adversaires, les soins et boucliers, le nombre d’invocations simultanées, les poisons, le vol de vie et le nombre de tours nécessaires pour éliminer une cible. Ces paramètres ne sont pas gonflés automatiquement pour annuler l’effet des dégâts relevés. Aucune affirmation de parité globale avec les classes DOFUS.
