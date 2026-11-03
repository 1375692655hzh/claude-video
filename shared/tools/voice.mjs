// 音色库工具：选音色、看各账号用过哪些音色、登记本期选择、生成本地试听页。
// 数据：shared/voice-library/voices.json（全部音色，voice-library-build.mjs 生成）、usage.json（使用历史）
// 用法（仓库根目录或任一执行文件夹）：
//   node shared/tools/voice.mjs list [--vendor ark] [--gender 女] [--lang 英语] [--q 关键词] [--limit 50]
//   node shared/tools/voice.mjs history [--account Andy]          各账号用过的音色（新的在前）
//   node shared/tools/voice.mjs use <项目ID> <试听文件名或调用ID> [--account Andy] [--status 选定|试做|成片] [--note "…"]
//   node shared/tools/voice.mjs page                              重新生成 shared/voice-library/试听.html（双击用浏览器打开）
// 账号默认取项目 project.json 的 persona；人设文件里有频道名时一并显示。
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const LIB = path.join(ROOT, "shared", "voice-library");
const VOICES = path.join(LIB, "voices.json");
const USAGE = path.join(LIB, "usage.json");
const fail = (m) => { console.error("✗ " + m); process.exit(1); };
const today = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" }).format(new Date());

function args(argv) {
  const pos = []; const flags = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) { const k = argv[i].slice(2); flags[k] = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : true; }
    else pos.push(argv[i]);
  }
  return { pos, flags };
}
const voices = () => { if (!fs.existsSync(VOICES)) fail("缺 shared/voice-library/voices.json"); return JSON.parse(fs.readFileSync(VOICES, "utf8")); };
const usage = () => (fs.existsSync(USAGE) ? JSON.parse(fs.readFileSync(USAGE, "utf8")) : { accounts: {}, records: [] });
const saveUsage = (u) => fs.writeFileSync(USAGE, JSON.stringify(u, null, 2) + "\n");
const findVoice = (key) => {
  const vs = voices();
  const k = key.replace(/\.mp3$/, "");
  return vs.find((v) => v.file.replace(/\.mp3$/, "") === k || `${v.vendor}/${v.file}`.replace(/\.mp3$/, "") === k || v.id === key)
    ?? fail(`音色库里没有 ${key}（用试听文件名，如 ark-Joanne-女-美式英语，或调用 ID）`);
};
function projectDir(id) {
  const m = /^(\d{4})-(\d{2})-\d{2}-/.exec(id);
  const dir = m ? path.join(ROOT, "projects", m[1], m[2], id) : null;
  return dir && fs.existsSync(path.join(dir, "project.json")) ? dir : null;
}

function cmdList(f) {
  let vs = voices();
  if (f.vendor) vs = vs.filter((v) => v.vendor === f.vendor);
  if (f.gender) vs = vs.filter((v) => v.gender === f.gender);
  if (f.lang) vs = vs.filter((v) => v.lang.includes(f.lang));
  if (f.q) { const q = String(f.q).toLowerCase(); vs = vs.filter((v) => [v.name, v.id, v.trait, v.scene].join(" ").toLowerCase().includes(q)); }
  const u = usage(); const used = new Map();
  for (const r of u.records) used.set(r.file, [...(used.get(r.file) ?? []), r.account]);
  const lim = Number(f.limit ?? 60);
  console.log(`共 ${vs.length} 个音色${vs.length > lim ? `（显示前 ${lim} 个，--limit 调整）` : ""}：`);
  for (const v of vs.slice(0, lim)) {
    const who = used.get(v.file);
    console.log(`  ${v.vendor}/${v.file.padEnd(36)} ${v.id}${who ? `   ★ 用过：${[...new Set(who)].join("、")}` : ""}`);
  }
  console.log(`\n试听：shared/voice-library/<厂商>/<文件名>；总表 shared/voice-library/音色总表.csv；网页 shared/voice-library/试听.html`);
}

function cmdHistory(f) {
  const u = usage();
  const recs = u.records.filter((r) => !f.account || r.account === f.account).sort((a, b) => b.date.localeCompare(a.date));
  if (!recs.length) { console.log(f.account ? `账号 ${f.account} 还没有音色记录` : "还没有任何音色记录"); return; }
  const accts = [...new Set(recs.map((r) => r.account))];
  for (const a of accts) {
    const info = u.accounts[a];
    console.log(`\n${a}${info ? `（${info}）` : ""}`);
    const rs = recs.filter((r) => r.account === a);
    const count = new Map(); rs.forEach((r) => count.set(r.file, (count.get(r.file) ?? 0) + 1));
    console.log(`  常用：${[...count].sort((x, y) => y[1] - x[1]).map(([f, n]) => `${f}×${n}`).join("、")}`);
    for (const r of rs) console.log(`  ${r.date}  ${r.project.padEnd(30)} ${r.vendor}/${r.file}  [${r.status}]${r.note ? "  " + r.note : ""}`);
  }
}

function cmdUse(pos, f) {
  const [project, key] = pos;
  if (!project || !key) fail("用法：use <项目ID> <试听文件名或调用ID> [--account Andy] [--status 选定|试做|成片]");
  const v = findVoice(key);
  const dir = projectDir(project);
  const meta = dir ? JSON.parse(fs.readFileSync(path.join(dir, "project.json"), "utf8")) : null;
  const account = f.account ?? meta?.persona ?? fail("找不到账号：项目没有 persona，请加 --account");
  const u = usage();
  u.records = u.records.filter((r) => !(r.project === project && r.file === v.file));
  u.records.push({ date: today(), project, account, vendor: v.vendor, id: v.id, name: v.name, gender: v.gender, lang: v.lang, file: v.file, status: f.status ?? "选定", note: typeof f.note === "string" ? f.note : "" });
  saveUsage(u);
  if (meta) {
    meta.voice = { vendor: v.vendor, id: v.id, file: v.file, model: v.model ?? null };
    fs.writeFileSync(path.join(dir, "project.json"), JSON.stringify(meta, null, 2) + "\n");
  }
  console.log(`✓ ${project}（${account}）配音：${v.vendor} · ${v.name} · ${v.gender} · ${v.lang}\n  调用 ID：${v.id}${v.model ? `（模型 ${v.model}）` : ""}\n  试听：shared/voice-library/${v.vendor}/${v.file}`);
  if (meta) console.log("  已写入 project.json 的 voice；⑩ 用 node shared/tools/tts-shots.mjs <项目ID> 逐镜生成");
  buildPage(true);
}

function buildPage(quiet) {
  const vs = voices(); const u = usage();
  const data = JSON.stringify({ voices: vs.map(({ vendor, id, name, gender, lang, file, trait, scene, age, model }) => ({ vendor, id, name, gender, lang, file, trait, scene, age, model })), usage: u });
  const html = `<!doctype html><html lang="zh"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>音色试听库</title>
<style>
:root{--bg:#0f1115;--card:#171a21;--line:#2a2f3a;--tx:#e9e6dd;--mu:#9a968b;--ac:#c9a961;--ok:#8fd3a8}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--tx);font:14px/1.5 -apple-system,"Segoe UI","Microsoft YaHei",sans-serif}
header{position:sticky;top:0;background:#0f1115ee;backdrop-filter:blur(6px);border-bottom:1px solid var(--line);padding:14px 20px;z-index:2}
h1{margin:0 0 10px;font-size:18px}h1 small{color:var(--mu);font-weight:400;margin-left:8px}
.bar{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
select,input{background:var(--card);color:var(--tx);border:1px solid var(--line);border-radius:6px;padding:6px 8px;font:inherit}
input[type=search]{min-width:220px}
main{padding:16px 20px;display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:10px}
.c{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:10px 12px}
.c.used{border-color:var(--ac)}
.t{display:flex;justify-content:space-between;gap:8px}.n{font-weight:600}.v{color:var(--mu);font-size:12px}
.id{color:var(--mu);font-size:12px;word-break:break-all;margin:2px 0 6px;cursor:copy}
.tag{display:inline-block;font-size:12px;color:var(--ac);border:1px solid #6d5a33;border-radius:999px;padding:0 8px;margin:2px 4px 0 0}
audio{width:100%;height:32px;margin-top:6px}
#hist{padding:0 20px 8px;color:var(--mu)}#hist b{color:var(--tx)}
.empty{padding:40px;color:var(--mu)}
</style></head><body>
<header><h1>音色试听库<small id="cnt"></small></h1>
<div class="bar">
<select id="acc"><option value="">全部账号</option></select>
<label><input type="checkbox" id="onlyUsed"> 只看该账号用过的</label>
<select id="ven"><option value="">全部厂商</option></select>
<select id="gen"><option value="">全部性别</option><option>女</option><option>男</option></select>
<select id="lang"><option value="">全部语种</option></select>
<input type="search" id="q" placeholder="搜索名称 / 调用 ID / 特质">
</div></header>
<div id="hist"></div>
<main id="list"></main>
<script>
const D=${data};
const $=s=>document.querySelector(s);
const uniq=a=>[...new Set(a)].sort();
uniq(D.voices.map(v=>v.vendor)).forEach(x=>$("#ven").add(new Option(x,x)));
uniq(D.voices.map(v=>v.lang)).forEach(x=>$("#lang").add(new Option(x,x)));
Object.keys(D.usage.accounts).concat(D.usage.records.map(r=>r.account)).filter((x,i,a)=>a.indexOf(x)===i).forEach(x=>$("#acc").add(new Option(x+(D.usage.accounts[x]?"（"+D.usage.accounts[x]+"）":""),x)));
let saved={};try{saved=JSON.parse(localStorage.getItem("vlib")||"{}")}catch(e){}
["acc","ven","gen","lang"].forEach(k=>{if(saved[k])$("#"+k).value=saved[k]});
function render(){
  const acc=$("#acc").value,ven=$("#ven").value,gen=$("#gen").value,lang=$("#lang").value,q=$("#q").value.toLowerCase(),only=$("#onlyUsed").checked;
  try{localStorage.setItem("vlib",JSON.stringify({acc,ven,gen,lang}))}catch(e){}
  const recs=D.usage.records.filter(r=>!acc||r.account===acc);
  const used=new Map();recs.forEach(r=>used.set(r.file,(used.get(r.file)||[]).concat(r)));
  $("#hist").innerHTML=recs.length?"<b>"+(acc||"全部账号")+" 的音色记录：</b> "+recs.sort((a,b)=>b.date.localeCompare(a.date)).map(r=>r.date+" "+r.project+" → "+r.vendor+"/"+r.name+"（"+r.status+"）").join("；"):(acc?"该账号还没有音色记录":"");
  let vs=D.voices.filter(v=>(!ven||v.vendor===ven)&&(!gen||v.gender===gen)&&(!lang||v.lang===lang)&&(!q||[v.name,v.id,v.trait,v.scene].join(" ").toLowerCase().includes(q))&&(!only||used.has(v.file)));
  vs.sort((a,b)=>(used.has(b.file)?1:0)-(used.has(a.file)?1:0));
  $("#cnt").textContent=vs.length+" / "+D.voices.length;
  const show=vs.slice(0,300);
  $("#list").innerHTML=show.length?show.map(v=>{const u=used.get(v.file);return '<div class="c'+(u?' used':'')+'"><div class="t"><span class="n">'+v.name+'</span><span class="v">'+v.vendor+' · '+v.gender+' · '+v.lang+'</span></div><div class="id" title="点击复制调用 ID" data-id="'+v.id+'">'+v.id+'</div>'+(v.trait?'<span class="tag">'+v.trait+'</span>':'')+(v.scene?'<span class="tag">'+v.scene+'</span>':'')+(u?u.map(r=>'<span class="tag">★ '+r.account+' · '+r.project+'</span>').join(''):'')+'<audio controls preload="none" src="'+v.vendor+'/'+encodeURIComponent(v.file)+'"></audio></div>'}).join(""):'<div class="empty">没有符合条件的音色</div>';
  if(vs.length>300)$("#list").insertAdjacentHTML("beforeend",'<div class="empty">还有 '+(vs.length-300)+' 个，请加筛选条件</div>');
}
document.addEventListener("play",e=>{document.querySelectorAll("audio").forEach(a=>{if(a!==e.target)a.pause()})},true);
$("#list").addEventListener("click",e=>{const id=e.target.dataset&&e.target.dataset.id;if(id&&navigator.clipboard)navigator.clipboard.writeText(id).then(()=>{e.target.textContent="已复制："+id;setTimeout(()=>e.target.textContent=id,1200)})});
["acc","ven","gen","lang","onlyUsed"].forEach(k=>$("#"+k).addEventListener("change",render));$("#q").addEventListener("input",render);
render();
</script></body></html>`;
  fs.writeFileSync(path.join(LIB, "试听.html"), html);
  if (!quiet) console.log(`✓ 已生成 shared/voice-library/试听.html（${vs.length} 个音色，${u.records.length} 条使用记录）。在资源管理器里双击用浏览器打开`);
}

const [cmd, ...rest] = process.argv.slice(2);
const a = args(rest);
switch (cmd) {
  case "list": cmdList(a.flags); break;
  case "history": cmdHistory(a.flags); break;
  case "use": cmdUse(a.pos, a.flags); break;
  case "page": buildPage(false); break;
  default: console.log("用法：voice.mjs list | history | use <项目ID> <音色> | page（见文件头注释）");
}
