"""Copy existing portfolio images and pinned Simple Icons assets for the native build."""
from pathlib import Path
import shutil
import subprocess
import urllib.request

root = Path(__file__).parent
assets = root / "assets"
assets.mkdir(exist_ok=True)
repo = root.parent.parent
images = {
    "portrait.webp": repo / "public" / "bondeth.webp",
    "talent.png": root / "source-assets/v6/apsara-talent.png",
    "assistant.png": root / "source-assets/v6/apsara-assistant.png",
    "agentic.png": root / "source-assets/v6/apsara-agentic.png",
    "elearning.png": root / "source-assets/v6/apsara-elearning.png",
    "wallet.png": root / "source-assets/v6/apsara-wallet.png",
    "notch.png": root / "source-assets/v6/bondex-notch.png",
}
for filename, source in images.items():
    shutil.copy2(source, assets / filename)

# Simple Icons v16, the same icon family used by the portfolio's skill badges.
colors = {"react": "61DAFB", "nextdotjs": "141413", "typescript": "3178C6",
          "python": "3776AB", "fastapi": "009688", "nestjs": "E0234E",
          "postgresql": "4169E1", "flutter": "54C5F8", "docker": "2496ED", "swift": "F05138"}
for slug, color in colors.items():
    url = f"https://cdn.jsdelivr.net/npm/simple-icons@16/icons/{slug}.svg"
    svg = urllib.request.urlopen(url).read().decode().replace("<svg ", f'<svg fill="#{color}" ')
    source = assets / f"{slug}.svg"
    source.write_text(svg)
    subprocess.run(["sharp", "--input", str(source), "--output", str(assets / f"{slug}.png"),
                    "--density", "768", "--format", "png", "resize", "256", "256"], check=True)
print("Prepared hero portrait, six case-study previews, and ten technology icons.")
