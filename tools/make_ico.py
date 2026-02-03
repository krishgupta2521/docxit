from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
logo_candidates = [
    ROOT / "assets" / "docxit-logo.png",
    ROOT / "web" / "assets" / "docxit-logo.png",
]
logo_path = next((p for p in logo_candidates if p.exists()), None)
if not logo_path:
    raise FileNotFoundError("Logo not found in assets/docxit-logo.png or web/assets/docxit-logo.png")

icons_dir = ROOT / "src-tauri" / "icons"
icons_dir.mkdir(parents=True, exist_ok=True)

img = Image.open(logo_path).convert("RGBA")

sizes = [16, 24, 32, 48, 64, 128, 256]

# Save PNG icon
png_path = icons_dir / "icon.png"
img.resize((512, 512), Image.LANCZOS).save(png_path)

# Save ICO
ico_path = icons_dir / "icon.ico"
img.save(ico_path, sizes=[(s, s) for s in sizes])

print(f"Wrote {ico_path} and {png_path}")
