# Team implementation guide

## File map

| File or directory | Purpose |
| --- | --- |
| `web/templates/search.html` | Branded page structure, header, search form, footer, and microphone control |
| `web/static/styles.css` | JGI visual system, responsive layout, footer, helix animation, and voice-control styling |
| `web/static/app.js` | Search requests, result rendering, diagnostics, model summary, clarification handling, and browser speech recognition |
| `web/static/img/jgi-helix-watermark.svg` | Lightweight animated decorative helix |
| `web/static/img/gold-logo.png` | GOLD attribution logo in the header |
| `web/static/img/lbnl-jgi-logo.png` | Berkeley Lab footer logo |
| `web/static/img/doe-office-of-science-logo.png` | DOE Office of Science footer logo |
| `web/static/img/jgi-icon.png` | Browser favicon |
| `web/Semantic_UI_instructions.md` | Original UI requirements and design decisions |
| `docs/semantic-search-provider-migration.md` | Provider and embedding migration explanation |
| `docs/semantic-search-provider-migration.pptx` | Editable presentation slide for team discussion |

## Backend compatibility

The UI is designed for the updated semantic-search backend that exposes:

- `GET /api/metadata`
- `POST /api/search`
- Search diagnostics and timing fields
- Clarification-required and unsupported-query outcomes
- Query-plan and provider error diagnostics

The UI does not replace or modify the planner, embedding, PostgreSQL, or pgvector code.

## Credentials and data access

Each team member must use their own backend `.env` file with authorized CBorg and PostgreSQL credentials. Do not commit `.env`, API tokens, database passwords, logs containing secrets, or generated data to this repository.

The current search makes separate planner and embedding calls. The team member's CBorg budget and embedding destination must support both calls. See the provider-migration briefing if the planner or embedding provider will be changed.

## Browser speech input

The **Speak** button uses the browser's built-in Speech Recognition API. It does not add a backend transcription route and does not consume CBorg credits. The transcript is inserted into the query box and is not submitted automatically.

If speech input is unavailable, the button is hidden and the normal typed-query workflow remains available. Microphone permission and browser support can vary; Chrome and Edge are recommended for the demo.

## Basic verification

After copying the UI files into the backend checkout:

```bash
node --check web/static/app.js
git diff --check
uv run pytest -q
```

Then start the API and verify:

1. The branded search page loads.
2. The model summary appears.
3. The Speak button can populate the query box.
4. A typed or spoken query reaches `/api/search`.
5. Results, clarification messages, or provider diagnostics render correctly.
