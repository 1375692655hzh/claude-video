# 生成 shared/style-library/：每套风格一个文件夹（style.json、README.md、samples/、preview.jpg），styles.json 总索引
import json, os, shutil, sys
from PIL import Image, ImageDraw, ImageFont
ROOT = sys.argv[1]
LIB = os.path.join(ROOT, "shared", "style-library")
SAMP = os.path.join(LIB, "_samples")
B = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"; R = "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"
F = lambda s, b=True: ImageFont.truetype(B if b else R, s, index=2)

STY = [
 dict(id="cards", name="cards · 浅色卡片", status="ready", theme="cards",
      look="浅灰底、白色大圆角卡片、顶栏 + 进度条 + 字幕条框架、实拍装进卡片，干净中性的“报告感”",
      fit="财报逐项拆解、数据密集、需要长时间阅读", avoid="情绪很重的大事件（显得平淡）", fonts="Inter",
      pal=[("#F3F5F9","底"),("#FFFFFF","卡片"),("#141B2D","文字"),("#3366E0","强调"),("#0F9F78","涨 / 好"),("#E0484E","跌 / 坏"),("#F2A516","提醒")],
      works=["2026-10-google-q3-cards"], photo=False),
 dict(id="navy", name="navy · 深海军蓝", status="ready", theme="navy",
      look="深蓝底加柔光、深蓝卡片、白色大数字、青色涨 / 红色跌，彭博终端式的专业感",
      fit="科技公司财报、宏观、市场大盘", avoid="轻松科普", fonts="Inter",
      pal=[("#06101F","底"),("#0E2242","卡片"),("#F4F8FF","文字"),("#5B9BFF","强调"),("#2EE6F0","涨 / 好"),("#FF5A4E","跌 / 坏"),("#FF9A3C","提醒")],
      works=["2026-10-google-q3", "caspa-ai-profit"], photo=True),
 dict(id="deco", name="deco · 金色装饰艺术（Gilded Deco）", status="ready", theme="deco",
      look="近黑底叠虚化实拍、宝石色卡片、香槟金双线框 + 角花 + 扇形纹、金色渐变大数字",
      fit="并购、大交易、高估值公司、重大事件", avoid="日常快讯（太隆重）", fonts="Montserrat + Cinzel",
      pal=[("#0B0C11","底"),("#262A5E","蓝宝石"),("#4A1E27","红宝石"),("#1D3D30","祖母绿"),("#C9A961","金线"),("#F3EAD0","文字"),("#8FD3A8","涨"),("#F08C7A","跌")],
      works=["2026-11-02-marvell-lumentum"], photo=True),
 dict(id="documentary", name="documentary · 暖色纪录片", status="ready", theme="documentary",
      look="满屏暖调实拍、上下黑边、胶片颗粒、暗角，衬线字直接压在画面上，克制的小卡片",
      fit="人物和公司故事、长篇叙事、行业史", avoid="没有实拍素材的期（会空）", fonts="Lora",
      pal=[("#120D08","底"),("#E3B66B","金棕强调"),("#FFF3DD","文字"),("#D9C4A0","次文字"),("#A8C98F","涨"),("#E07A5F","跌")],
      works=[], photo=True),
 dict(id="glass", name="glass · 玻璃拟态", status="ready", theme="glass",
      look="紫青粉渐变光斑底、半透明磨砂玻璃卡片、白色细描边、渐变色大数字",
      fit="AI、新产品、偏年轻的科技题材", avoid="严肃的财务风险、坏消息", fonts="Space Grotesk",
      pal=[("#120C2E","底"),("#7B5CFF","紫光"),("#22D3EE","青光"),("#F472B6","粉光"),("#FFFFFF","文字"),("#67E8F9","涨"),("#FB7185","跌")],
      works=[], photo=False),
 dict(id="terminal", name="terminal · 交易终端", status="ready", theme="terminal",
      look="黑底绿网格、顶部滚动行情条、等宽字体数据表、琥珀色提示、闪烁光标",
      fit="市场快讯、股价异动、盘前盘后、技术面", avoid="人物故事（太冷）", fonts="JetBrains Mono",
      pal=[("#030605","底"),("#3E6B52","网格线"),("#E8FFF2","文字"),("#FFB000","琥珀强调"),("#32F08C","涨"),("#FF4D5E","跌")],
      works=[], photo=False),
 dict(id="newspaper", name="newspaper · 报纸 / 财经杂志", status="ready", theme="newspaper",
      look="米白纸纹底、报头 + 双线、衬线大标题、分栏细线、红黑双色、网点印刷感配图",
      fit="深度分析、历史复盘、长文解读", avoid="节奏很快的短视频", fonts="Playfair Display + Lora",
      pal=[("#F1ECE1","纸"),("#1B1A17","墨"),("#4A463E","次文字"),("#B3261E","红"),("#2F6B3A","绿")],
      works=[], photo=False),
 dict(id="swiss", name="swiss · 极简黑白（瑞士风）", status="ready", theme="swiss",
      look="白底、超大粗体数字、严格网格、只用一个红色强调，信息极少",
      fit="观点类、“一个数字讲清一件事”、开场钩子", avoid="数据很多的页（留白会被挤掉）", fonts="Inter",
      pal=[("#FFFFFF","底"),("#000000","文字"),("#777777","次文字"),("#E30613","唯一强调")],
      works=[], photo=False),
 dict(id="blueprint", name="blueprint · 蓝图 / 工程图", status="candidate", theme=None,
      look="深蓝底双层网格、线框图、尺寸标注线、黄色手写批注", fit="半导体、产业链、产品拆解", avoid="", fonts="IBM Plex Mono + Caveat", pal=[], works=[], photo=False),
 dict(id="neon", name="neon · 赛博霓虹", status="candidate", theme=None,
      look="深紫底、透视网格地面、扫描线、品红 / 青色发光边框、标题色差错位", fit="加密货币、游戏（要节制）", avoid="", fonts="Orbitron + Space Grotesk", pal=[], works=[], photo=False),
 dict(id="journal", name="journal · 手账 / 便签", status="candidate", theme=None,
      look="点阵纸底、便利贴 + 胶带、手写字体、红笔圈注", fit="轻松科普、投资入门", avoid="", fonts="Caveat + Patrick Hand", pal=[], works=[], photo=False),
]
FR = [75, 165, 255, 345]
idx = []
for s in STY:
    d = os.path.join(LIB, s["id"]); os.makedirs(os.path.join(d, "samples"), exist_ok=True)
    if s["status"] == "ready":
        for i, f in enumerate(FR):
            src = os.path.join(SAMP, f"{s['id']}-{f}.png")
            Image.open(src).convert("RGB").save(os.path.join(d, "samples", f"0{i+1}.jpg"), quality=88)
        # 展示卡
        ims = [Image.open(os.path.join(d, "samples", f"0{i+1}.jpg")) for i in range(4)]
        c = Image.new("RGB", (1920, 1300), "#14161c"); dr = ImageDraw.Draw(c)
        dr.text((40, 24), s["name"], font=F(46), fill="#fff"); dr.text((40, 90), s["look"], font=F(24, False), fill="#c9ccd4")
        c.paste(ims[2].resize((1280, 720)), (40, 140))
        for j, k in enumerate([0, 1, 3]): c.paste(ims[k].resize((560, 315)), (1340, 140 + j * 335))
        y = 1000; x = 40
        dr.text((40, y - 40), "色板", font=F(24), fill="#9aa0ad")
        for hx, lab in s["pal"]:
            dr.rounded_rectangle((x, y, x + 140, y + 80), radius=10, fill=hx, outline="#444")
            dr.text((x, y + 88), lab, font=F(20, False), fill="#d0d3da"); dr.text((x, y + 116), hx, font=F(18, False), fill="#8a8f99"); x += 158
        dr.text((1380, y - 40), "字体", font=F(24), fill="#9aa0ad"); dr.text((1380, y), s["fonts"], font=F(32), fill="#fff")
        dr.multiline_text((1380, y + 56), f"适合：{s['fit']}\n慎用：{s['avoid']}\n代表作：{'、'.join(s['works']) or '（新风格，标准样张）'}", font=F(22, False), fill="#e8c66a", spacing=8)
        c.save(os.path.join(d, "preview.jpg"), quality=86)
    else:
        src = os.path.join(LIB, "_preview", "candidates", f"{s['id']}.jpg")
        if os.path.exists(src): shutil.copy(src, os.path.join(d, "preview.jpg")); shutil.copy(src, os.path.join(d, "samples", "01.jpg"))
    meta = {k: s[k] for k in ["id", "name", "status", "theme", "look", "fit", "avoid", "fonts", "works"]}
    meta["palette"] = [{"hex": h, "role": r} for h, r in s["pal"]]
    meta["kit"] = f"3-视频生成/effects/_shared/styles（STYLES.{s['id']}）" if s["status"] == "ready" else None
    meta["needsPhoto"] = s["photo"]
    json.dump(meta, open(os.path.join(d, "style.json"), "w", encoding="utf8"), ensure_ascii=False, indent=2)
    st = "可用" if s["status"] == "ready" else "待做（只有静态样张，还没有外观组件）"
    readme = f"""# {s['name']}

- 状态：{st}
- 样子：{s['look']}
- 适合：{s['fit']}
- 慎用：{s['avoid'] or '—'}
- 字体：{s['fonts']}（SIL OFL，文件在 `3-视频生成/public/library/fonts/`）
- 是否依赖实拍：{'是：底层要有实拍或官方照片，没有素材的期不要选' if s['photo'] else '否：纯图形也成立'}
- 代表作：{'、'.join(s['works']) or '—'}
- 展示卡：`preview.jpg`；标准样张：`samples/01–04.jpg`（章节开场 / 大数字 / 两年对比 / 动效库动作）
"""
    if s["status"] == "ready":
        readme += f"""
## 代码里怎么用

```tsx
import {{ getStyle, useStyleFonts }} from "@shared/styles";
import {{ MotionTheme, Motion }} from "@shared/motion";
const K = getStyle("{s['id']}");          // 外观组件：Backdrop / Panel / Title / BigNumber / Row / Chrome / ChapterBadge / Caption
// 整片最外层 useStyleFonts() 一次；动效库动作包 <MotionTheme theme="{s['theme']}"> 自动换成本风格配色
```

色板：{'、'.join(f'{r} {h}' for h, r in s['pal'])}
"""
    open(os.path.join(d, "README.md"), "w", encoding="utf8").write(readme)
    idx.append({"id": s["id"], "name": s["name"], "status": s["status"], "fit": s["fit"], "preview": f"{s['id']}/preview.jpg"})
json.dump(idx, open(os.path.join(LIB, "styles.json"), "w", encoding="utf8"), ensure_ascii=False, indent=2)
print(len(idx))
