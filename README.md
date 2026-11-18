# India Natural Heritage Explorer

A responsive, static website for exploring India's protected areas and natural ecosystems. Built for GitHub Pages; no build step or paid hosting is required.

## Preview locally
Because the directory is loaded from `data/sites.json`, serve the folder over HTTP rather than opening `index.html` directly.

```bash
python -m http.server 8000
```
Then open http://localhost:8000.

## Publish with GitHub Pages
1. Create a public repository named `india-natural-heritage-explorer` in the GitHub account `aniketverse`.
2. Upload the contents of this folder to the repository root (not the enclosing folder).
3. In GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch `main`, folder `/ (root)`, and save.
6. GitHub Pages will publish the site at `https://aniketverse.github.io/india-natural-heritage-explorer/`.

A GitHub Actions workflow is also included at `.github/workflows/pages.yml` for the official Pages deployment flow. If you use that workflow, choose **GitHub Actions** as the Pages build source in repository settings.

## Update the directory
Edit `data/sites.json`. Each record uses:
- `id`: stable unique identifier
- `name`, `category`, `state`, `district`
- `year`, `area_km2`
- `ecosystem`, `species`, `summary`
- `coordinates`: `[latitude, longitude]`
- `source`: official or authoritative reference URL

The current dataset is a curated starter sample, not an exhaustive register. Some area figures are approximate or refer to a particular notified component; verify the applicable notification before using them for formal or legal purposes. Keep statutory categories separate from UNESCO/Ramsar designations, ecosystem types and biogeographic zones. Overlapping designations should remain separate records with cross-references rather than being added together.

## Data quality conventions
- Use official Gazette / state forest department / MoEFCC / WII / NTCA / Ramsar / UNESCO sources wherever possible.
- Record source publication or access date when expanding entries.
- Use `null` for unknown area or year rather than guessing.
- Clearly label proposed, notified, renamed, merged or de-notified sites.
- Do not treat an Important Bird Area, Ramsar Site or Biosphere Reserve as a National Park by default.

## License
Website code: MIT. Directory facts and source materials remain subject to their respective source terms. Please retain attribution and source links.
