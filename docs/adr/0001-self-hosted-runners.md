# ADR-0001 : GitHub Actions sur runners auto-hébergés exclusivement
Statut : **Accepté** · Date : 2026-10-15

## Contexte
Le développement est adossé à une infrastructure locale; le propriétaire souhaite que toute exécution de CI/CD se fasse sur des runners locaux.

## Décision
Tous les workflows sont manuels au départ (`workflow_dispatch`) et chaque job possède `runs-on: [self-hosted, linux, x64, project-tactics]` ou des labels spécifiques d'un autre OS auto-hébergé. **Aucun runner GitHub-hosted** et aucune solution de secours cloud. Installation des runners séparée du dépôt documentaire.

## Conséquences
Une exécution restera en attente sans runner correspondant. Les tests sont aussi exécutables manuellement. Les images et SDK devront être maintenus localement. Ne jamais exposer de secrets clients à des runners.
