# Vérification locale de la passation — 2026-10-15

Périmètre : conservation des sources et outil d'import, pas le rendu V3.

Les cinq PNG du paquet approuvé ont été comparés octet pour octet aux cinq fiches re-jointes par l'utilisateur. L'HTML du paquet correspond exactement à `project_tactics_atelier_html_v2.html`. Les tailles et SHA-256 des dix fichiers sont consignés dans `reference_bundle_manifest.json`.

Sept contrôles de l'outil Python ont été exécutés localement avec succès :

1. Les dix fichiers absents sont signalés et la vérification échoue.
2. Import du ZIP approuvé : dix fichiers importés, tailles et SHA-256 conformes.
3. Réimport : aucun fichier réécrit, dix fichiers identiques conservés.
4. Vérification après import : dix fichiers conformes.
5. Une référence locale modifiée bloque l'import et n'est pas écrasée.
6. Un ZIP dont un octet a été modifié est refusé.
7. Une destination passant par un lien symbolique est refusée.

Ces tests ont été effectués dans le conteneur de préparation, pas dans GitHub Actions. Ils ne prouvent ni que les PNG/HTML sont déjà présents dans GitHub, ni que la personnalisation visuelle V3 existe. L'import dans le dépôt doit être suivi de `python3 tools/art/import_reference_bundle.py --verify-only` et d'une vérification du commit publié.
