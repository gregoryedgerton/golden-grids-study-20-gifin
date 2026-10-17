"""Square crops of the members' photographs, for their avatars.

Each entry in avatars.json is [cx, cy, side]: the crop's centre as fractions
of the photograph's width and height, and its side as a fraction of the
photograph's shorter side. Reads public/assets/s20-<key>-1600.jpg and writes
public/assets/s20-<key>-avatar.jpg at 320px, twice the largest avatar.

    python3 captures/avatars.py [--sheet out.jpg]

--sheet also writes a contact sheet with a 10% grid, for placing the eyes.
"""
import json, sys
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
SPEC = json.loads((ROOT / "captures/avatars.json").read_text())
SIZE = 320

def crop(key, cx, cy, side):
    im = Image.open(ROOT / f"public/assets/s20-{key}-1600.jpg").convert("RGB")
    w, h = im.size
    s = min(w, h) * side
    x = min(max(cx * w - s / 2, 0), w - s)
    y = min(max(cy * h - s / 2, 0), h - s)
    return im.crop((round(x), round(y), round(x + s), round(y + s))).resize((SIZE, SIZE), Image.LANCZOS)

out = {}
for key, (cx, cy, side) in SPEC.items():
    im = crop(key, cx, cy, side)
    im.save(ROOT / f"public/assets/s20-{key}-avatar.jpg", quality=84, optimize=True, progressive=True)
    out[key] = im

if "--sheet" in sys.argv:
    path = sys.argv[sys.argv.index("--sheet") + 1]
    cols = 6
    rows = (len(out) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * SIZE, rows * (SIZE + 20)), "white")
    d = ImageDraw.Draw(sheet)
    for i, (key, im) in enumerate(out.items()):
        x, y = (i % cols) * SIZE, (i // cols) * (SIZE + 20)
        sheet.paste(im, (x, y + 20))
        d.text((x + 4, y + 4), key, fill="black")
        for g in range(1, 10):
            d.line([(x + g * 32, y + 20), (x + g * 32, y + 20 + SIZE)], fill=(255, 255, 255) if g != 5 else (255, 0, 0), width=1)
            d.line([(x, y + 20 + g * 32), (x + SIZE, y + 20 + g * 32)], fill=(255, 255, 255) if g != 5 else (255, 0, 0), width=1)
        d.ellipse([x, y + 20, x + SIZE, y + 20 + SIZE], outline=(0, 120, 255), width=2)
    sheet.save(path, quality=80)
