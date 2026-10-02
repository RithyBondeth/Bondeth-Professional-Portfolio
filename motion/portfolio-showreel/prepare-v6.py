"""Fetch existing portfolio images and pinned Simple Icons assets for the native build."""
from pathlib import Path
import subprocess
import urllib.request

root = Path(__file__).parent
assets = root / "assets"
assets.mkdir(exist_ok=True)
images = {
    "portrait.webp": "https://bondeth.dev/bondeth.webp",
    "talent.png": "https://bondeth.dev/previews/apsara-talent.png",
    "assistant.png": "https://bondeth.dev/previews/apsara-assistant.png",
    "agentic.png": "https://bondeth.dev/previews/apsara-agentic.png",
    "elearning.png": "https://bondeth.dev/previews/apsara-elearning.png",
    "wallet.png": "https://bondeth.dev/previews/apsara-wallet.png",
    "notch.png": "https://bondeth.dev/previews/bondex-notch.png",
}
for filename, url in images.items():
    urllib.request.urlretrieve(url, assets / filename)

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
