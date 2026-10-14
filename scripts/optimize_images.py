"""Generate responsive WebP assets without replacing the source JPGs.

Run with Python + Pillow: python scripts/optimize_images.py
The manifest lets StudyImage optimize only assets that actually exist.
"""
import json
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
manifest = {}
original_bytes = 0
largest_bytes = 0
mobile_bytes = 0
for directory in ("visuals", "real-elements"):
    for path in sorted((ROOT / "public" / directory).glob("*.jpg")):
        if path.stem.endswith("-orig"):
            continue
        with Image.open(path) as source:
            image = ImageOps.exif_transpose(source).convert("RGB")
            width, height = image.size
            sizes = sorted(set(min(width, size) for size in (320, 640, 1200)))
            variants = []
            for size in sizes:
                output = path.with_name(f"{path.stem}-{size}.webp")
                resized = image.resize((size, round(height * size / width)), Image.Resampling.LANCZOS)
                resized.save(output, "WEBP", quality=82, method=6)
                variants.append({"src": f"/{directory}/{output.name}", "width": size})
            manifest[f"/{directory}/{path.name}"] = {"width": width, "height": height, "variants": variants}
            original_bytes += path.stat().st_size
            largest_bytes += (ROOT / "public" / variants[-1]["src"].lstrip("/")).stat().st_size
            mobile_bytes += (ROOT / "public" / variants[min(1, len(variants) - 1)]["src"].lstrip("/")).stat().st_size

(ROOT / "src" / "data" / "imageVariants.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"images": len(manifest), "original_bytes": original_bytes, "largest_webp_bytes": largest_bytes, "mobile_webp_bytes": mobile_bytes}))
