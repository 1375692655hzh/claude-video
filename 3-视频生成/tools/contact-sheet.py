# 把 tools/stills.mjs 出的静帧拼成带镜头号的总览表（每行一个镜头的 a/b/c 三帧，每张 6 行）。
# 用法：python -I tools/contact-sheet.py <frames.json> <静帧目录> <输出目录>
import json
import os
import sys

from PIL import Image, ImageDraw, ImageFont

frames, src, out = sys.argv[1:4]
items = json.load(open(frames, encoding="utf-8"))
shots = []
for it in items:
    s = it["name"].rsplit("_", 1)[0]
    if s not in shots:
        shots.append(s)
cols = sorted({it["name"].rsplit("_", 1)[1] for it in items})
font = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 26)
os.makedirs(out, exist_ok=True)
for k in range(0, len(shots), 6):
    sheet = Image.new("RGB", (480 * len(cols), 270 * 6), "white")
    d = ImageDraw.Draw(sheet)
    for r, s in enumerate(shots[k : k + 6]):
        for c, x in enumerate(cols):
            im = Image.open(os.path.join(src, f"{s}_{x}.png")).convert("RGB").resize((480, 270))
            sheet.paste(im, (c * 480, r * 270))
        d.rectangle([0, r * 270, 90, r * 270 + 34], fill="black")
        d.text((6, r * 270 + 3), s, fill="yellow", font=font)
    sheet.save(os.path.join(out, f"s{k // 6:02d}.png"))
print(len(shots), "shots")
