from __future__ import annotations

import json
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps

from process_ramen_product_images import fit_to_square, remove_edge_background, slugify


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = Path(r"C:\Users\B\Downloads\Ramen Images For Menu\downloaded\K snacks")
OUT_DIR = ROOT / "public" / "snack-products"
MANIFEST_PATH = OUT_DIR / "manifest.json"
CONTACT_SHEET_PATH = OUT_DIR / "_contact-sheet.png"

SLUG_OVERRIDES = {
    "Big Sheet.jpg": "big-sheet",
    "Noriko Braised Lotus Root Snack.jpg": "noriko-braised-lotus-root-snack",
    "Noriko Braised Tofu Stick Snack.png": "noriko-braised-tofu-stick-snack",
    "Noriko Fermented Tofu.jpg": "noriko-fermented-tofu",
    "Noriko Fried Squid (Spicy Flavoured Snack).jpg": "noriko-fried-squid-spicy-flavoured-snack",
    "Noriko Tofu Curd Skewer Snack.png": "noriko-tofu-curd-skewer-snack",
    "Rosted Fried Fish (Mala Flavoured Snack).jpg": "roasted-fried-fish-mala-flavoured-snack",
    "Rosted Fried Fish (Spicy Flavoured Snack).jpg": "roasted-fried-fish-spicy-flavoured-snack",
    "Stir-Fried Kimchi.jpg": "stir-fried-kimchi",
}

CROP_BOXES = {
    "Noriko Braised Lotus Root Snack.jpg": (110, 155, 640, 1010),
    "Stir-Fried Kimchi.jpg": (685, 95, 1265, 845),
}


def load_sources() -> list[Path]:
    return sorted(
        [
            path
            for path in SOURCE_DIR.iterdir()
            if path.is_file() and path.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp", ".avif"}
        ],
        key=lambda item: item.name.lower(),
    )


def process(path: Path) -> dict[str, str | int]:
    slug = SLUG_OVERRIDES.get(path.name, slugify(path.stem))

    with Image.open(path) as image:
        image = ImageOps.exif_transpose(image)
        crop_box = CROP_BOXES.get(path.name)
        if crop_box:
            image = image.crop(crop_box)
        cutout = remove_edge_background(image)
        final = fit_to_square(cutout, product_fill=0.9)

    out_path = OUT_DIR / f"{slug}.png"
    final.save(out_path, optimize=True)
    return {
        "source": str(path),
        "source_name": path.name,
        "slug": slug,
        "url": f"/snack-products/{out_path.name}",
        "width": final.width,
        "height": final.height,
    }


def make_contact_sheet(records: list[dict[str, str | int]]) -> None:
    cell_w, cell_h = 220, 260
    columns = 3
    rows = math.ceil(len(records) / columns)
    sheet = Image.new("RGBA", (columns * cell_w, rows * cell_h), (247, 239, 219, 255))
    draw = ImageDraw.Draw(sheet)

    for index, record in enumerate(records):
        x = (index % columns) * cell_w
        y = (index // columns) * cell_h
        with Image.open(OUT_DIR / f"{record['slug']}.png") as image:
            preview = image.resize((160, 160), Image.Resampling.LANCZOS)
        sheet.alpha_composite(preview, (x + 30, y + 12))
        label = str(record["slug"])[:30]
        draw.text((x + 12, y + 184), label, fill=(9, 38, 42, 255))

    sheet.convert("RGB").save(CONTACT_SHEET_PATH, optimize=True)


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    records = [process(path) for path in load_sources()]
    MANIFEST_PATH.write_text(json.dumps(records, indent=2), encoding="utf-8")
    make_contact_sheet(records)
    print(f"Processed {len(records)} snack images")
    print(MANIFEST_PATH)
    print(CONTACT_SHEET_PATH)


if __name__ == "__main__":
    main()
