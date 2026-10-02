"""Prepare the new portrait, local project previews, and technology marks."""

from pathlib import Path
import shutil
import subprocess
import urllib.request

root = Path(__file__).resolve().parent
repo = root.parents[1]
assets = root / "assets"
assets.mkdir(exist_ok=True)

shutil.copy2(root / "portrait-v7.png", assets / "portrait-v7.png")
previews = {
    "talent": "apsara-talet.png",
    "assistant": "apsara-assistant.png",
    "agentic": "apsara-agentic.png",
    "elearning": "apsara-elearning.png",
    "wallet": "apsara-wallet.png",
    "romlerk": "romlerk.png",
    "notch": "bondex-notch.png",
}
for name, filename in previews.items():
    shutil.copy2(repo / "public" / "project-preview" / filename, assets / f"{name}.png")

# Match the portfolio's icon family and colors. The version is pinned so a
# future Simple Icons release cannot silently change this project's artwork.
colors = {
    "react": "61DAFB",
    "nextdotjs": "141413",
    "typescript": "3178C6",
    "vuedotjs": "4FC08D",
    "nuxt": "00DC82",
    "tailwindcss": "06B6D4",
    "nodedotjs": "339933",
    "nestjs": "E0234E",
    "postgresql": "4169E1",
    "python": "3776AB",
    "fastapi": "009688",
    "openai": "141413",
    "flutter": "54C5F8",
    "dart": "0175C2",
    "swift": "F05138",
    "docker": "2496ED",
    "redis": "FF4438",
    "cloudflare": "F38020",
}
for slug, color in colors.items():
    url = f"https://cdn.jsdelivr.net/npm/simple-icons@16/icons/{slug}.svg"
    svg = urllib.request.urlopen(url).read().decode()
    svg = svg.replace("<svg ", f'<svg fill="#{color}" ')
    source = assets / f"{slug}.svg"
    source.write_text(svg)
    subprocess.run(
        [
            "sharp",
            "--input",
            str(source),
            "--output",
            str(assets / f"{slug}.png"),
            "--density",
            "768",
            "--format",
            "png",
            "resize",
            "256",
            "256",
        ],
        check=True,
    )

print("Prepared the new portrait, seven previews, and 18 technology icons.")
