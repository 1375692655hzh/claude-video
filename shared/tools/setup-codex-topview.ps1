# 给 Codex 配 Topview（数字人 / 视频生成），在 PowerShell 里运行：
#   powershell -ExecutionPolicy Bypass -File E:\claude-video\shared\tools\setup-codex-topview.ps1
# 依据 Topview 官方说明 https://github.com/topviewai/plugins/blob/main/docs/codex.md
# 不需要也不会写入任何密码或 token；授权在浏览器里由你自己完成。

$ErrorActionPreference = "Stop"
Write-Host "== 1/5 检查 Codex ==" -ForegroundColor Cyan
codex --version

Write-Host "== 2/5 添加 Topview 官方插件市场 ==" -ForegroundColor Cyan
try { codex plugin marketplace add https://github.com/topviewai/plugins --ref main --json }
catch { Write-Host "（如果提示已存在，可以忽略）$_" -ForegroundColor Yellow }

Write-Host "== 3/5 安装 topview-browser 插件 ==" -ForegroundColor Cyan
try { codex plugin add topview-browser@topview --json }
catch { Write-Host "（如果提示已安装，可以忽略）$_" -ForegroundColor Yellow }

Write-Host "== 4/5 OAuth 登录：会打开浏览器，请用你的 Topview 账号授权 ==" -ForegroundColor Cyan
codex mcp login topview-browser

Write-Host "== 5/5 检查 MCP 列表 ==" -ForegroundColor Cyan
codex mcp list

Write-Host ""
Write-Host "完成。请彻底关闭 Codex 再重新打开，新开一个任务，先发一句只读请求验证：" -ForegroundColor Green
Write-Host "  列出 topview-browser 提供的全部工具，说明哪些能做数字人 / 对口型（avatar、lip sync、talking head），不要生成任何东西。" -ForegroundColor Green
