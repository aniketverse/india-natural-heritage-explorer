# India Natural Heritage Explorer — V2

Static GitHub Pages site: interactive map, searchable/filterable directory, profile dialog, state/category controls and simple ecosystem insights.

## Deploy
Replace repository files with this release package, preserving `.github/workflows/pages.yml` if your existing workflow is already configured. Upload `index.html`, `styles.css`, `app.js`, and the `data/sites.json` file. Ensure Pages serves from the root of `main` (or your existing configured source).

## Dataset caveat
This is an editorial starter dataset, not a legally authoritative inventory. Records intentionally carry review notes. Area descriptions may refer to different boundary types (national park, sanctuary, tiger reserve, biosphere reserve, buffer/core); these must not be compared or aggregated until verified. Confirm coordinates, designation, area, seasons, species and reference links against current official sources before relying on them.
## Map
Leaflet 1.9.4 and OpenStreetMap tiles load from external CDNs. Internet connection is required. The site is responsive; on narrow screens map and results stack vertically.
