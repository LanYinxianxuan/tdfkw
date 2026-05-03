#!/bin/bash
# Generate a styled git graph PNG for this repo.
# Requires: git, aha, chromium, python3 (Pillow + numpy)
# Usage: ./generate-git-graph.sh [output.png]

set -e

OUTPUT="${1:-git-graph.png}"
BODY_HTML="/tmp/git-graph-body.html"
FULL_HTML="/tmp/git-graph-gen.html"
RAW_PNG="/tmp/git-graph-raw.png"

REPO_NAME=$(basename "$(git rev-parse --show-toplevel 2>/dev/null || pwd)")

echo "==> Generating git log graph..."

# Step 1: git log with ANSI colors -> aha -> HTML
git log --graph --all --decorate --color=always \
  --pretty=format:"%C(yellow)%h%Creset %C(cyan)%ad%Creset %s %C(green)(%an)%Creset %C(auto)%d" \
  --date=short | aha --black > "$BODY_HTML"

# Step 2: Wrap in styled HTML
export REPO_NAME FULL_HTML BODY_HTML
python3 -c '
import re, os

with open(os.environ["BODY_HTML"]) as f:
    aha_html = f.read()

m = re.search(r"<body[^>]*>(.*?)</body>", aha_html, re.DOTALL)
body = m.group(1) if m else aha_html

html = f"""<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<style>
  * {{ margin: 0; padding: 0; }}
  body {{
    background: #1a1b26; color: #c0caf5;
    font-family: "Courier New", monospace;
    font-size: 14px; line-height: 1.5;
    padding: 40px; width: 1520px; box-sizing: border-box;
  }}
  .header {{ color: #7aa2f7; margin-bottom: 24px; font-size: 16px; font-weight: bold; }}
  .header span {{ color: #9ece6a; }}
  pre {{ white-space: pre; margin: 0; }}
</style>
</head>
<body>
<div class="header">{os.environ["REPO_NAME"]} / <span>git log --graph --all</span></div>
{body}
</body>
</html>"""

with open(os.environ["FULL_HTML"], "w") as f:
    f.write(html)
'

echo "==> Rendering with Chromium..."

# Step 3: Render -> PNG (extra tall to avoid clipping)
chromium --headless --no-sandbox --disable-gpu \
  --screenshot="$RAW_PNG" --window-size=1600,5000 \
  "file://$FULL_HTML" 2>&1 | grep -v "ERROR:" || true

# Step 4: Crop bottom whitespace
export RAW_PNG OUTPUT
python3 -c '
from PIL import Image
import numpy as np
import os

img = Image.open(os.environ["RAW_PNG"])
arr = np.array(img)
bg = np.array([26, 27, 38])

mask = np.any(np.abs(arr[:, :, :3].astype(int) - bg) > 10, axis=(1, 2))
non_bg = np.where(mask)[0]
crop_h = min(non_bg[-1] + 40, img.height) if len(non_bg) > 0 else img.height

img.crop((0, 0, img.width, crop_h)).save(os.environ["OUTPUT"], optimize=True)
out = os.environ["OUTPUT"]
print(f"==> Done: {out} ({img.width}x{crop_h})")
'

rm -f "$BODY_HTML" "$FULL_HTML" "$RAW_PNG"
