// 风格库工具：列出风格、看各账号用过哪些风格、登记本期风格、生成本地预览页。
// 数据：shared/style-library/styles.json（索引）、<id>/style.json（每套详情）、usage.json（使用历史）
// 用法：
//   node shared/tools/style.mjs list [--all]                   可用 + 待确认风格（--all 含待做）
//   node shared/tools/style.mjs history [--account Andy]
//   node shared/tools/style.mjs use <项目ID> <风格ID> [--account Andy] [--status 选定|试做|成片] [--note "…"]
//   node shared/tools/style.mjs page                            重新生成 shared/style-library/预览.html（双击用浏览器打开）
// 新风格（用户给参考图）：按 shared/style-library/README.md「新增一套风格」做完后，在 build 脚本里登记再跑 page。
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const LIB = path.join(ROOT, "shared", "style-library");
const fail = (m) => { console.error("✗ " + m); process.exit(1); };
const today = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" }).format(new Date());
const argv = process.argv.slice(2); const cmd = argv[0]; const pos = []; const f = {};
for (let i = 1; i < argv.length; i++) { if (argv[i].startsWith("--")) { const k = argv[i].slice(2); f[k] = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : true; } else pos.push(argv[i]); }
const styles = () => JSON.parse(fs.readFileSync(path.join(LIB, "styles.json"), "utf8")).map((s) => ({ ...s, ...JSON.parse(fs.readFileSync(path.join(LIB, s.id, "style.json"), "utf8")) }));
const USAGE = path.join(LIB, "usage.json");
const usage = () => (fs.existsSync(USAGE) ? JSON.parse(fs.readFileSync(USAGE, "utf8")) : { accounts: {}, records: [] });
const projDir = (id) => { const m = /^(\d{4})-(\d{2})-\d{2}-/.exec(id); const d = m && path.join(ROOT, "projects", m[1], m[2], id); return d && fs.existsSync(path.join(d, "project.json")) ? d : null; };

function list() {
  const u = usage();
  for (const s of styles().filter((x) => f.all || x.status === "ready" || x.status === "review")) {
    const who = [...new Set(u.records.filter((r) => r.style === s.id).map((r) => r.account))];
    console.log(`${s.status === "ready" ? "●" : s.status === "review" ? "◐" : "○"} ${s.id.padEnd(14)} ${s.name}${s.status === "review" ? "（待确认）" : ""}\n    适合：${s.fit}${s.avoid ? `；慎用：${s.avoid}` : ""}${who.length ? `\n    ★ 用过：${who.join("、")}` : ""}\n    展示卡：shared/style-library/${s.id}/preview.jpg`);
  }
  console.log("\n预览页：shared/style-library/预览.html");
}
function history() {
  const u = usage();
  const rs = u.records.filter((r) => !f.account || r.account === f.account).sort((a, b) => b.date.localeCompare(a.date));
  if (!rs.length) return console.log("还没有风格记录");
  for (const a of [...new Set(rs.map((r) => r.account))]) {
    console.log(`\n${a}${u.accounts[a] ? `（${u.accounts[a]}）` : ""}`);
    for (const r of rs.filter((x) => x.account === a)) console.log(`  ${r.date}  ${r.project.padEnd(30)} ${r.style}  [${r.status}]${r.note ? "  " + r.note : ""}`);
  }
}
function use() {
  const [project, id] = pos; if (!project || !id) fail("用法：use <项目ID> <风格ID>");
  const s = styles().find((x) => x.id === id) ?? fail(`风格库里没有 ${id}`);
  if (s.status === "review") fail(`${id} 待确认：先给用户看展示卡 shared/style-library/${id}/preview.jpg，用户确认后把 _build/build_library.py 里它的 status 改成 ready 并重跑`);
  if (s.status !== "ready") fail(`${id} 还是待做风格，先按 README「新增一套风格」做完再用`);
  const d = projDir(project); const meta = d ? JSON.parse(fs.readFileSync(path.join(d, "project.json"), "utf8")) : null;
  const account = f.account ?? meta?.persona ?? fail("找不到账号：加 --account");
  const u = usage(); u.records = u.records.filter((r) => !(r.project === project && r.style === id));
  u.records.push({ date: today(), project, account, style: id, status: f.status ?? "选定", note: typeof f.note === "string" ? f.note : "" });
  fs.writeFileSync(USAGE, JSON.stringify(u, null, 2) + "\n");
  if (meta) { meta.style = id; fs.writeFileSync(path.join(d, "project.json"), JSON.stringify(meta, null, 2) + "\n"); }
  console.log(`✓ ${project}（${account}）风格：${s.name}\n  外观组件：getStyle("${id}")；动效主题：<MotionTheme theme="${s.theme}">\n  展示卡：shared/style-library/${id}/preview.jpg`);
  page(true);
}
function page(quiet) {
  const ss = styles(); const u = usage();
  const data = JSON.stringify({ styles: ss, usage: u });
  const html = `<!doctype html><html lang="zh"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>视频风格库</title>
<style>:root{--bg:#0f1115;--card:#171a21;--line:#2a2f3a;--tx:#e9e6dd;--mu:#9a968b;--ac:#c9a961}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--tx);font:14px/1.55 -apple-system,"Segoe UI","Microsoft YaHei",sans-serif}
header{position:sticky;top:0;background:#0f1115ee;border-bottom:1px solid var(--line);padding:14px 20px;z-index:2}h1{margin:0 0 10px;font-size:18px}
select{background:var(--card);color:var(--tx);border:1px solid var(--line);border-radius:6px;padding:6px 8px;font:inherit}label{margin-left:10px}
#hist{padding:10px 20px;color:var(--mu)}#hist b{color:var(--tx)}main{padding:10px 20px 40px;display:grid;grid-template-columns:repeat(auto-fill,minmax(520px,1fr));gap:16px}
.c{background:var(--card);border:1px solid var(--line);border-radius:10px;overflow:hidden}.c.used{border-color:var(--ac)}.c.cand{opacity:.8}
.c img{width:100%;display:block;cursor:zoom-in}.b{padding:12px 14px}.n{font-weight:700;font-size:16px}.s{color:var(--mu);margin-top:4px}
.tag{display:inline-block;font-size:12px;border:1px solid #6d5a33;color:var(--ac);border-radius:999px;padding:0 8px;margin:6px 6px 0 0}.tag.g{border-color:#3a3f4a;color:var(--mu)}
.th{display:flex;gap:4px;padding:0 14px 12px}.th img{width:25%;border-radius:4px}
#zoom{position:fixed;inset:0;background:rgba(0,0,0,.9);display:none;align-items:center;justify-content:center;z-index:9}#zoom img{max-width:96vw;max-height:94vh}</style></head><body>
<header><h1>视频风格库</h1><select id="acc"><option value="">全部账号</option></select><label><input type="checkbox" id="cand"> 显示待做风格</label></header>
<div id="hist"></div><main id="list"></main><div id="zoom" onclick="this.style.display='none'"><img id="zi"></div>
<script>const D=${data};const $=s=>document.querySelector(s);
[...new Set(Object.keys(D.usage.accounts).concat(D.usage.records.map(r=>r.account)))].forEach(a=>$("#acc").add(new Option(a+(D.usage.accounts[a]?"（"+D.usage.accounts[a]+"）":""),a)));
try{const v=localStorage.getItem("slib-acc");if(v)$("#acc").value=v}catch(e){}
function z(src){$("#zi").src=src;$("#zoom").style.display="flex"}
function r(){const acc=$("#acc").value,cand=$("#cand").checked;try{localStorage.setItem("slib-acc",acc)}catch(e){}
const recs=D.usage.records.filter(x=>!acc||x.account===acc).sort((a,b)=>b.date.localeCompare(a.date));
$("#hist").innerHTML=recs.length?"<b>"+(acc||"全部账号")+" 的风格记录：</b> "+recs.map(x=>x.date+" "+x.project+" → "+x.style+"（"+x.status+"）").join("；"):"";
const used=new Set(recs.map(x=>x.style));
let ss=D.styles.filter(s=>cand||s.status!=="candidate");ss.sort((a,b)=>(used.has(b.id)?1:0)-(used.has(a.id)?1:0)||(a.status==="ready"?0:1)-(b.status==="ready"?0:1));
$("#list").innerHTML=ss.map(s=>'<div class="c'+(used.has(s.id)?' used':'')+(s.status==="candidate"?' cand':'')+'"><img src="'+s.id+'/preview.jpg" onclick="z(this.src)"><div class="b"><div class="n">'+s.name+'</div><div class="s">'+s.look+'</div><span class="tag">适合：'+s.fit+'</span>'+(s.avoid?'<span class="tag g">慎用：'+s.avoid+'</span>':'')+'<span class="tag g">字体：'+s.fonts+'</span>'+(s.status==="review"?'<span class="tag">待确认</span>':s.status!=="ready"?'<span class="tag g">待做</span>':'')+[...new Set(recs.filter(x=>x.style===s.id).map(x=>x.project))].map(p=>'<span class="tag">★ '+p+'</span>').join("")+'</div>'+(s.status!=="candidate"?'<div class="th">'+[1,2,3,4].map(i=>'<img src="'+s.id+'/samples/0'+i+'.jpg" onclick="z(this.src)">').join("")+'</div>':'')+'</div>').join("")}
$("#acc").onchange=r;$("#cand").onchange=r;r();</script></body></html>`;
  fs.writeFileSync(path.join(LIB, "预览.html"), html);
  if (!quiet) console.log(`✓ 已生成 shared/style-library/预览.html（${ss.length} 套风格，${u.records.length} 条记录）`);
}
switch (cmd) { case "list": list(); break; case "history": history(); break; case "use": use(); break; case "page": page(false); break; default: console.log("用法见文件头"); }
