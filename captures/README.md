# Captures

No screenshot of the reference is kept: its pages carry its own photographs and product names.

- `pieces.json`, `hunt.py`: the search phrases for each design and the script that searches Wikimedia Commons for photographs under open licences (CC BY, CC BY-SA, CC0, public domain), at least 900 pixels on the short side; titles naming a poster, a drawing, a logo or a screenshot are skipped, and lays the candidates out on numbered sheets (`find/sheet-*.jpg`, not committed; the candidate lists `find/*.json` are).
- `picks.json`, `pick.py`: which candidate each photograph is, and its alt text; `pick.py` downloads them to `public/assets/` and writes `src/photos.json` (author, licence, page). A photograph of a person or a reproduction of another photograph is not picked.
- `avatars.json`, `avatars.py`: the square crop of each member's photograph for its avatar (`public/assets/s20-<key>-avatar.jpg`, 320px); `--sheet <file>` also draws a contact sheet with a 10% grid, for placing the eyes in `Member.eyes`.
- `scan.cjs`: overflow, fitted-line floor and axe, Chrome and WebKit, three widths, both schemes.
- `cells.cjs`: opens every expandable square at a phone width and checks that nothing widens the page and the opened head stays locked.
- `site-issue.cjs`: files the request to join the Golden Grids site's gallery.

```bash
NODE_PATH=<a node_modules with playwright> node captures/scan.cjs http://localhost:5196/ index profile "profile?u=avocado" edit settings "settings?s=account" assessments "assessments?a=botany"
NODE_PATH=<a node_modules with playwright> node captures/cells.cjs http://localhost:5196/ 390 webkit index "profile?u=avocado"
```
