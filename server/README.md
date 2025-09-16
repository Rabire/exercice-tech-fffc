# Backend (Bun)

Ce dossier contient l’API HTTP et le CLI pour convertir des fichiers à largeur fixe en CSV en s’appuyant sur un cœur commun (streaming + validation avec zod).

## Prérequis

- Bun v1.2+ (`curl -fsSL https://bun.sh/install | bash`)

## Installation

```bash
cd server
bun install
```

## Démarrer le serveur HTTP

```bash
# depuis ce dossier
bun run start
# ou en développement (hot reload)
bun run dev
```

- Port par défaut: `3001` (configurable via variable d’environnement `PORT`).

## API HTTP

### POST /convert

- Contenu: `multipart/form-data`
- Champs requis:
  - `data`: fichier de données à largeur fixe (UTF-8)
  - `metadata`: fichier CSV de métadonnées (UTF-8)
- Réponse: `text/csv; charset=utf-8` en streaming, avec en-tête:
  - `Content-Disposition: attachment; filename="output.csv"`

#### Exemple (depuis la racine du repo)

```bash
curl -X POST http://localhost:3001/convert \
  -F "data=@samples/data_fixed_width.txt" \
  -F "metadata=@samples/metadata.csv" \
  -o out.csv
```

### Règles de conversion

- En-tête CSV = noms des colonnes du fichier de métadonnées.
- Séparateur: `,` — Sauts de ligne: `\r\n` (CRLF).
- Dates: `YYYY-MM-DD` → `DD/MM/YYYY`.
- Chaînes: suppression des espaces de fin.
- CSV: valeurs contenant `"`, `,`, CR ou LF sont entourées de `"` (guillemets doublés à l’intérieur).

### Validation et erreurs (400)

- Métadonnées invalides: ligne ≠ 3 colonnes, longueur non positive, type inconnu (`date|numeric|string` et alias FR gérés).
- Numérique invalide: regex `^-?\d+(?:\.\d+)?$`.
- Date invalide: doit respecter `YYYY-MM-DD`.
- Ligne de données trop courte/longue vs somme des largeurs.
- Flux tronqué: restes non vides < longueur d’enregistrement attendue.

Codes: `400` (message texte explicite), `404` (route inconnue).

## CLI

Le CLI réutilise exactement le même cœur que l’API et traite en streaming (mémoire constante).

### Utilisation

```bash
cd server
bun run src/cli/index.ts --data <datafile> --metadata <metafile> [--output out.csv]
```

### Options

- `--data <path>`: chemin du fichier de données à largeur fixe (UTF-8)
- `--metadata <path>`: chemin du CSV de métadonnées (UTF-8)
- `--output <path>`: fichier CSV de sortie (stdout par défaut)
- `--help`: affiche l’aide

### Exemples

- Sortie vers un fichier:

```bash
bun run src/cli/index.ts \
  --data ../samples/data_fixed_width.txt \
  --metadata ../samples/metadata.csv \
  --output out.csv
```

- Sortie vers stdout (redirection):

```bash
bun run cli \
  --data ../samples/data_fixed_width.txt \
  --metadata ../samples/metadata.csv > out.csv
```

## Détails d’implémentation

- Traitement par blocs de longueur fixe (somme des largeurs définies par les métadonnées).
- Conversion et validation effectuées champ par champ via un parseur streaming.
- Les erreurs sont levées tôt avec des messages précis.

## Roadmap / TODO (backend)

- Locales/formatage configurables et policies de trim par colonne.
- Délimiteur CSV et stratégie de quoting configurables.
- Métadonnées: commentaires `#` et lignes vides.
- Diagnostics enrichis (numéro de ligne d’enregistrement dans les erreurs).
- CLI: support `stdin`/`stdout` piping, flags de perf et progression.
