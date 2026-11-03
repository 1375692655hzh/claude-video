#!/bin/bash
# ⑩ 长片分段渲染（Claude 的 Linux 环境：单条命令 ≤ 3 分钟、后台进程会被杀，所以一次只跑一段，可反复调用）。
# 用法（仓库根目录）：
#   bash shared/tools/render-chunks.sh <项目ID> bundle            打包一次（改了代码要重新打包）
#   bash shared/tools/render-chunks.sh <项目ID> next [--size 1000]  渲染下一段缺失的帧段（约 2.5 分钟一段，重复调用直到提示全部完成）
#   bash shared/tools/render-chunks.sh <项目ID> redo <起始帧>      删掉某段重渲（改了某个场景后只重渲受影响的段）
#   bash shared/tools/render-chunks.sh <项目ID> join [--audio 04-音频/mix/mix.m4a] [--out 05-制作/cache/preview/film.mp4]
# 合成 id 默认等于项目 ID（--comp 改）；总帧数取 04-音频/timeline.json 的 frames。
set -e
ID=$1; CMD=$2; shift 2 || true
ROOT=$(cd "$(dirname "$0")/../.." && pwd)
Y=${ID:0:4}; M=${ID:5:2}; P=$ROOT/projects/$Y/$M/$ID
[ -f "$P/project.json" ] || { echo "✗ 找不到项目 $ID"; exit 1; }
SIZE=1000; COMP=$ID; AUDIO=$P/04-音频/mix/mix.m4a; OUT=$P/05-制作/cache/preview/film.mp4
while [ $# -gt 0 ]; do case $1 in --size) SIZE=$2; shift;; --comp) COMP=$2; shift;; --audio) AUDIO=$P/$2; shift;; --out) OUT=$P/$2; shift;; *) ARG=$1;; esac; shift; done
W=$HOME/.cv-render/$ID; mkdir -p "$W/parts"
RL=$HOME/rl; CHR=$HOME/chr/bin
[ -d "$RL/node_modules/@remotion/cli" ] || { echo "✗ 先运行 bash 3-视频生成/tools/linux-render.sh setup"; exit 1; }
export CV_PROJECT_DIR=$P CV_PUBLIC_DIR=$HOME/.cv-public/$ID LD_LIBRARY_PATH=$CHR${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}
CLI="node $RL/node_modules/@remotion/cli/remotion-cli.js"
FRAMES=$(python3 -c "import json;print(json.load(open('$P/04-音频/timeline.json'))['frames'])")
case $CMD in
  bundle)
    [ -d "$CV_PUBLIC_DIR" ] || node "$ROOT/shared/tools/project.mjs" render "$ID" --preview _probe.mp4 -- --frames=0-0 >/dev/null 2>&1 || true
    cd "$RL" && timeout 170 $CLI bundle src/project-entry.ts --out-dir="$W/bundle" | tail -1
    echo "✓ 已打包（$FRAMES 帧）；接着反复运行 next";;
  next)
    [ -d "$W/bundle" ] || { echo "✗ 先运行 bundle"; exit 1; }
    for ((s=0; s<FRAMES; s+=SIZE)); do
      e=$((s+SIZE-1)); [ $e -ge $FRAMES ] && e=$((FRAMES-1))
      o=$W/parts/p$(printf %06d $s).mp4
      [ -f "$o" ] && continue
      cd "$RL"; T=$(date +%s)
      if timeout 172 $CLI render "$W/bundle" "$COMP" "$o.tmp.mp4" --frames=$s-$e --muted --concurrency=2 --crf=20 --browser-executable=$CHR/chromium --chrome-mode=headless-shell >/dev/null 2>&1; then
        mv "$o.tmp.mp4" "$o"; n=$(ls "$W"/parts/p*.mp4 | wc -l); echo "✓ 帧 $s–$e 完成（$(( $(date +%s)-T )) 秒）；已完成 $n 段，共 $(( (FRAMES+SIZE-1)/SIZE )) 段"
      else
        rm -f "$o.tmp.mp4"; echo "✗ 帧 $s–$e 超时：改小 --size（例如 600）再跑 next"; exit 1
      fi
      exit 0
    done
    echo "✓ 全部帧段已完成，运行 join";;
  redo) rm -f "$W/parts/p$(printf %06d ${ARG:-0}).mp4"; echo "✓ 已删除起始帧 ${ARG:-0} 的分段，运行 next 重渲";;
  join)
    ls "$W"/parts/p*.mp4 | grep -v tmp | sort | sed 's/^/file /' > "$W/list.txt"
    mkdir -p "$(dirname "$OUT")"
    if [ -f "$AUDIO" ]; then ffmpeg -v error -y -f concat -safe 0 -i "$W/list.txt" -i "$AUDIO" -map 0:v -map 1:a -c copy -shortest -movflags +faststart "$OUT"
    else ffmpeg -v error -y -f concat -safe 0 -i "$W/list.txt" -c copy -movflags +faststart "$OUT"; echo "! 没有音轨 $AUDIO，输出无声版"; fi
    echo "✓ $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT") 秒 → ${OUT#$ROOT/}";;
  *) sed -n 2,9p "$0";;
esac
