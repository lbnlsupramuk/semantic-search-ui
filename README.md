# JGI Semantic Search UI

This private repository contains the shareable web interface for the JGI Semantic Search demonstration. It is intended to be copied into a local checkout of the semantic-search backend so team members can run the branded UI with their own CBorg credentials and database configuration.

## Included

- JGI-branded search page with GOLD attribution and institutional footer links
- Animated JGI-inspired DNA helix watermark
- Browser speech input using the built-in Speech Recognition API
- Responsive styles and accessibility improvements
- UI implementation instructions
- Provider-migration briefing in Markdown and PowerPoint formats

## Important

This repository contains UI files only. It does not contain the FastAPI backend, database code, prompts, `.env` files, API keys, database passwords, or GOLD data.

## Apply to a local semantic-search checkout

From the root of an existing, compatible semantic-search checkout:

```bash
cp /path/to/semantic-search-ui/web/templates/search.html web/templates/search.html
cp /path/to/semantic-search-ui/web/static/app.js web/static/app.js
cp /path/to/semantic-search-ui/web/static/styles.css web/static/styles.css
cp -R /path/to/semantic-search-ui/web/static/img/. web/static/img/
```

The UI expects the updated search API behavior from the current semantic-search `main` branch, including model metadata, diagnostics, clarification responses, and unsupported-query responses.

## Run locally

Use the backend repository's normal setup and start instructions. Configure the local `.env` with the team member's own credentials; never copy credentials into this repository.

```bash
uv sync
./start_api.sh
```

Then open `http://127.0.0.1:8000/`.

For the microphone control, use a browser with Speech Recognition support such as Chrome or Edge and allow microphone access. Speech is placed into the query box for review; the search is still submitted manually.

See [Team implementation guide](docs/TEAM_IMPLEMENTATION.md) for the file map, prerequisites, and troubleshooting notes.
