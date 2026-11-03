#!/usr/bin/env bash
# Claude 的 Linux 环境里渲染 Remotion（Windows 的 node_modules 不动）。
# 用法：bash tools/linux-render.sh setup            # 每个新会话跑一次（约 30 秒）
#       bash tools/linux-render.sh <remotion 参数...>  # 例：render 2026-10-google-q3-cards out/x.mp4
# 浏览器用 npm 上的 @sparticuz/chromium（headless-shell）：remotion.media / Google 下载在该环境被挡。
# 后台渲染不需要网络，可以 nohup 后台跑；需要网络的步骤（npm 安装）必须在单次命令里跑完。
set -e
P="$(cd "$(dirname "$0")/.." && pwd)"; RL="$HOME/rl"; CHR="$HOME/chr"
if [ "$1" = setup ]; then
  mkdir -p "$RL" "$CHR/bin"; cp "$P/package.json" "$P/package-lock.json" "$RL/"
  (cd "$RL" && npm ci --no-audit --no-fund --ignore-scripts)
  for f in src effects public remotion.config.ts tsconfig.json; do ln -sfn "$P/$f" "$RL/$f"; done
  (cd "$CHR" && [ -f package.json ] || npm init -y >/dev/null; cd "$CHR" && npm i @sparticuz/chromium@143 --no-audit --no-fund)
  (cd "$CHR" && node -e "import('@sparticuz/chromium').then(async m=>console.log(await m.default.executablePath()))")
  cp -r "$TMPDIR"/chromium "$TMPDIR"/*.so* "$TMPDIR"/fonts "$CHR/bin/"
  echo "setup 完成"; exit 0
fi
cd "$RL"; export LD_LIBRARY_PATH="$CHR/bin"
args=("$@"); # 输出路径若是 out/ 开头，写回项目的 out/
for i in "${!args[@]}"; do [[ "${args[$i]}" == out/* ]] && args[$i]="$P/${args[$i]}"; done
exec npx remotion "${args[@]}" --browser-executable="$CHR/bin/chromium" --chrome-mode=headless-shell
