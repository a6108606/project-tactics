# Politique GitHub Actions — runners locaux uniquement

**Invariance : tous les jobs tournent exclusivement sur runner self-hosted géré localement.** Ne jamais utiliser `ubuntu-latest`, `windows-latest`, `macos-latest` ou n'importe quel runner GitHub-hosted, même en fallback.

## Configuration cible
VM Linux x64 dédiée sur Proxmox, utilisateur système non privilégié, dotnet SDK et outillage Godot installés localement. Ne pas utiliser le nœud hyperviseur, ni les machines ou réseaux contenant des données de clients. Label personnalisé GitHub : `project-tactics`.

GitHub → Repository → Settings → Actions → Runners → New self-hosted runner : utiliser **les instructions et le jeton éphémère affichés sur cette page**, jamais les commiter.

## Sécurité
- VM isolée du LAN privé/NAS, filtrage sortant, aucun secret client, aucun montage sensible.
- Déclenchement `workflow_dispatch` seulement en V0; review systématique des changements de workflows.
- `permissions: contents: read`; checkout sans persistance d'identifiants.
- Ne jamais exécuter du code non fiable de forks avec secrets; pas de `pull_request_target`.
- Surveiller logs, disque, RAM; nettoyer le workspace et traiter l'agent comme exposé au code du dépôt.
- Aucun fallback GitHub-hosted.
- Pour Windows : runner **self-hosted Windows** distinct si nécessaire, jamais `windows-latest`.

## État
La présence du workflow dans le dépôt **ne signifie pas qu'un runner a été installé**. Aucun job ne doit être lancé pendant la phase documentaire. Activation après revue de la VM et autorisation explicite.
