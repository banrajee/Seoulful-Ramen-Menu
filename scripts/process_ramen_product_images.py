from __future__ import annotations

import json
import math
import re
from collections import Counter, deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
DOWNLOADS = Path(r"C:\Users\B\Downloads\Ramen Images For Menu\downloaded")
TEMP = Path(r"C:\Users\B\AppData\Local\Temp")
OUT_DIR = ROOT / "public" / "ramen-products"
MANIFEST_PATH = OUT_DIR / "manifest.json"
CONTACT_SHEET_PATH = OUT_DIR / "_contact-sheet.png"

EXCLUDE_PATTERNS = ("qrcode",)
EXTRA_FILES = [
    TEMP / "codex-clipboard-aedee8cc-a903-4d02-855c-b828294deafb.webp",
]


def slugify(value: str) -> str:
    value = value.lower()
    value = value.replace("&", "and")
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-")


def load_sources() -> list[Path]:
    files = []
    for path in DOWNLOADS.iterdir():
        if not path.is_file():
            continue
        if any(pattern in path.name.lower() for pattern in EXCLUDE_PATTERNS):
            continue
        if path.suffix.lower() not in {".png", ".jpg", ".jpeg", ".webp", ".avif"}:
            continue
        if path.name == "Paldo seafood jumbo.avif":
            continue
        files.append(path)

    for path in EXTRA_FILES:
        if path.exists():
            files.append(path)

    return sorted(files, key=lambda item: item.name.lower())


def background_palette(rgb: np.ndarray) -> list[np.ndarray]:
    h, w, _ = rgb.shape
    patch = max(8, min(h, w) // 25)
    corner_patches = [
        rgb[:patch, :patch],
        rgb[:patch, -patch:],
        rgb[-patch:, :patch],
        rgb[-patch:, -patch:],
    ]

    colors: list[np.ndarray] = [np.median(p.reshape(-1, 3), axis=0) for p in corner_patches]

    border = np.concatenate(
        [
            rgb[:patch, :, :].reshape(-1, 3),
            rgb[-patch:, :, :].reshape(-1, 3),
            rgb[:, :patch, :].reshape(-1, 3),
            rgb[:, -patch:, :].reshape(-1, 3),
        ],
        axis=0,
    )
    quantized = (border // 16).astype(np.uint8)
    counts = Counter(map(tuple, quantized.tolist()))
    for bucket, _count in counts.most_common(5):
        colors.append(np.array(bucket, dtype=np.float32) * 16 + 8)

    deduped: list[np.ndarray] = []
    for color in colors:
        if not any(np.linalg.norm(color - existing) < 14 for existing in deduped):
            deduped.append(color.astype(np.float32))
    return deduped


def connected_background(candidate: np.ndarray) -> np.ndarray:
    h, w = candidate.shape
    bg = np.zeros((h, w), dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    def add(y: int, x: int) -> None:
        if candidate[y, x] and not bg[y, x]:
            bg[y, x] = True
            queue.append((y, x))

    for x in range(w):
        add(0, x)
        add(h - 1, x)
    for y in range(h):
        add(y, 0)
        add(y, w - 1)

    while queue:
        y, x = queue.popleft()
        if y > 0:
            add(y - 1, x)
        if y + 1 < h:
            add(y + 1, x)
        if x > 0:
            add(y, x - 1)
        if x + 1 < w:
            add(y, x + 1)

    return bg


def remove_edge_background(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    arr = np.array(rgba)
    rgb = arr[:, :, :3].astype(np.float32)
    alpha = arr[:, :, 3]

    has_transparency = np.count_nonzero(alpha < 245) > alpha.size * 0.02
    if has_transparency:
      alpha_mask = alpha
    else:
      palette = background_palette(rgb)
      distances = np.stack([np.linalg.norm(rgb - color, axis=2) for color in palette], axis=0)
      nearest = distances.min(axis=0)
      candidate = nearest < 54
      bg = connected_background(candidate)

      # If the conservative pass barely removed anything, retry with a wider
      # tolerance for soft studio-white or gradient edges.
      if np.count_nonzero(bg) < bg.size * 0.08:
          candidate = nearest < 78
          bg = connected_background(candidate)

      alpha_mask = np.where(bg, 0, 255).astype(np.uint8)
      alpha_mask = np.array(Image.fromarray(alpha_mask, mode="L").filter(ImageFilter.GaussianBlur(0.7)))
      alpha_mask = np.where(alpha_mask < 32, 0, alpha_mask).astype(np.uint8)

    arr[:, :, 3] = alpha_mask
    cutout = Image.fromarray(arr, mode="RGBA")
    bbox = cutout.getbbox()
    if not bbox:
        return rgba

    margin = max(8, min(cutout.size) // 60)
    left = max(0, bbox[0] - margin)
    top = max(0, bbox[1] - margin)
    right = min(cutout.width, bbox[2] + margin)
    bottom = min(cutout.height, bbox[3] + margin)
    return cutout.crop((left, top, right, bottom))


def fit_to_square(image: Image.Image, size: int = 900, product_fill: float = 0.88) -> Image.Image:
    target = int(size * product_fill)
    scale = min(target / image.width, target / image.height)
    new_size = (max(1, round(image.width * scale)), max(1, round(image.height * scale)))
    resized = image.resize(new_size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    canvas.alpha_composite(resized, ((size - new_size[0]) // 2, (size - new_size[1]) // 2))
    return canvas


def process(path: Path) -> dict[str, str | int]:
    source_stem = path.stem.strip()
    slug = slugify(source_stem)
    if path.parent == TEMP:
        slug = "samyang-jjajang-clipboard"

    with Image.open(path) as image:
        cutout = remove_edge_background(image)
        final = fit_to_square(cutout)

    out_path = OUT_DIR / f"{slug}.png"
    final.save(out_path, optimize=True)
    return {
        "source": str(path),
        "source_name": path.name,
        "slug": slug,
        "url": f"/ramen-products/{out_path.name}",
        "width": final.width,
        "height": final.height,
    }


def make_contact_sheet(records: list[dict[str, str | int]]) -> None:
    cell_w, cell_h = 220, 260
    columns = 5
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
    print(f"Processed {len(records)} images")
    print(MANIFEST_PATH)
    print(CONTACT_SHEET_PATH)


if __name__ == "__main__":
    main()
