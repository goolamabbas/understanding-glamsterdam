import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { Marked } from 'marked';
const root = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const out = new URL('_site/', root);
// Check publication inputs before rendering or copying them to the preview.
function checkPrivacy(text, name, prompt = false) {
  const localPath = /(?:\/Users\/|\/home\/|\/private\/|\/tmp\/|file:\/\/|[A-Za-z]:\\Users\\|~\/)/i;
  const promptIdentity = /(?:@[a-z0-9_]+|https?:\/\/(?:www\.)?(?:x|twitter)\.com\/|[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})/i;
  if (localPath.test(text) || (prompt && promptIdentity.test(text))) {
    throw new Error(`Privacy review required for ${name}; no identifying match is printed.`);
  }
}
for (const path of ['synthesis/glamsterdam-synthesis.md', 'search-via-codex/glamsterdam-codex-search.md', 'search-via-grokbuild/glamsterdam-grokbuild-search.md', 'search-via-codex/codex-prompt.txt', 'search-via-grokbuild/grokbuild-prompt.txt', 'site/home.html', 'site/method.html', 'synthesis/claude-synthesis-prompt.txt']) {
  checkPrivacy(await read(path), path, path.endsWith('-prompt.txt'));
}
await mkdir(new URL('downloads/', out), { recursive: true });
const escape = text => text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const slug = text => text.toLowerCase().replace(/<[^>]*>/g,'').replace(/[^\p{L}\p{N}\s_-]/gu,'').replace(/\s/g,'-');
const reports = [
  {key:'synthesis', name:'Claude synthesis', path:'synthesis/glamsterdam-synthesis.md', type:'THE COMPLETE SYNTHESIS'},
  {key:'codex', name:'Codex research', path:'search-via-codex/glamsterdam-codex-search.md', type:'ORIGINAL RESEARCH / CODEX'},
  {key:'grokbuild', name:'Grokbuild research', path:'search-via-grokbuild/glamsterdam-grokbuild-search.md', type:'RESEARCH / GROKBUILD · ACCOUNT IDENTIFIER REMOVED'}
];
function shell(title, body, active, description, page = active) {
  const canonical = `https://goolamabbas.github.io/understanding-glamsterdam/${page === "index" ? "" : `${page}.html`}`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(title)} · Understanding Glamsterdam</title><meta name="description" content="${escape(description)}"><link rel="canonical" href="${canonical}"><meta property="og:type" content="website"><meta property="og:title" content="${escape(title)} · Understanding Glamsterdam"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${canonical}"><meta name="twitter:card" content="summary"><link rel="icon" href="favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="styles.css"></head><body><a class="skip" href="#main">Skip to content</a><div class="preview-label">RESEARCH SNAPSHOT <span>Evidence: 30 September 2026 · Prepared 1 October 2026</span></div><header><a class="brand" href="index.html"><img src="favicon.svg" width="28" height="28" alt="">Understanding Glamsterdam</a><nav aria-label="Main navigation">${[['index','Overview'],['synthesis','Full synthesis'],['method','Case study']].map(([key,label])=>`<a href="${key}.html" ${active===key?'aria-current="page"':''}>${label}</a>`).join('')}</nav></header><main id="main">${body}</main><footer><span>Understanding Glamsterdam · Evidence snapshot: 30 Sep 2026</span><a href="method.html">Sources, method & limits →</a></footer></body></html>`;
}
for (const [key,title] of [['home','A practical guide to Ethereum’s upgrade'],['method','How this was researched']]) {
  await writeFile(new URL(key==='home'?'index.html':'method.html',out),shell(title,await read(`site/${key}.html`),key==='home'?'index':key,'A synthesis of two multi-provider research workflows, with original reports and evidence limits.'));
}
const manifest=[];
for (const report of reports) {
  const source=await read(report.path), headings=[], counts=new Map();
  const renderer = new Marked({gfm:true,renderer:{
    heading({tokens,depth}) {
      const text=this.parser.parseInline(tokens), base=slug(text), n=counts.get(base)||0; counts.set(base,n+1);
      const id=base+(n?`-${n}`:''); headings.push({depth,text,id});
      return `<h${depth} id="${id}">${text}</h${depth}>\n`;
    },
    html({text}) { return escape(text); }
  }});
  let body=renderer.parse(source).replace(/<table>/g,'<div class="table-wrap" role="region" aria-label="Report table; scroll horizontally for additional columns" tabindex="0"><table>').replace(/<\/table>/g,'</table></div>');
  const toc=headings.filter(h=>h.depth===2).map(h=>`<a href="#${h.id}">${h.text}</a>`).join('');
  const filename=report.path.split('/').pop();
  const intro=`<div class="report-meta"><p class="eyebrow">${report.type}</p><p>Evidence: 30 September 2026 · ${Math.ceil(source.split(/\s+/).length/220)} min read</p><p class="muted">${report.key === 'grokbuild' ? 'A personal X account identifier has been removed from this report and its download. ' : ''}Rendered from the supplied report. Its evidence labels describe the original research; website preparation did not independently verify the claims.</p><a href="downloads/${filename}" download>Download report Markdown ↓</a></div>`;
  body=`${intro}<div class="reading-layout"><aside class="toc"><details open><summary>IN THIS REPORT</summary><nav aria-label="Report chapters">${toc}</nav></details><a class="toc-bottom" href="method.html">Research & original reports →</a></aside><article class="prose">${body}<p class="end-link"><a href="#main">Back to top ↑</a></p></article></div>`;
  await writeFile(new URL(`${report.key}.html`,out),shell(report.name,body,report.key,'Original research dated 30 September 2026: Ethereum Glamsterdam changes, sources, expected benefits and uncertainties.'));
  await copyFile(new URL(report.path,root),new URL(`downloads/${filename}`,out));
  manifest.push({file:filename,source:report.path,sha256:createHash('sha256').update(source).digest('hex'),headings:headings.length});
}
for (const [key, label, ledger] of [['codex','Codex','provider-ledger-and-research-limits'], ['grokbuild','Grok Build','provider-ledger']]) {
  const promptPath = `search-via-${key}/${key}-prompt.txt`;
  const promptSource = await read(promptPath);
  const promptBody = `<div class="page-intro"><p class="eyebrow">RESEARCH PROMPT / ${label.toUpperCase()}</p><h1>The prompt sent to ${label}.</h1><p class="lead">Edited for publication.</p></div><div class="prose method-prose"><p>This is a publication copy of the instruction used for the ${label} research run. The local output path has been reduced to its filename, and the directory-creation instruction removed. It documents what was requested; the <a href="${key}.html#${ledger}">report’s provider ledger</a> describes the reported execution.</p><p><a href="downloads/${key}-prompt.txt" download>Download publication copy (.txt) ↓</a> · <a href="method.html#prompts">Research prompts and their differences →</a></p><pre class="original-prompt">${escape(promptSource)}</pre></div>`;
  await writeFile(new URL(`${key}-prompt.html`, out), shell(`${label} research prompt`, promptBody, 'method', `A privacy-reviewed publication copy of the prompt for the ${label} multi-provider Glamsterdam research run.`, `${key}-prompt`));
  await copyFile(new URL(promptPath, root), new URL(`downloads/${key}-prompt.txt`, out));
  manifest.push({file:`${key}-prompt.txt`, source:promptPath, sha256:createHash('sha256').update(promptSource).digest('hex')});
}
const synthesisPromptPath = 'synthesis/claude-synthesis-prompt.txt';
const synthesisPrompt = await read(synthesisPromptPath);
const synthesisPromptBody = `<div class="page-intro"><p class="eyebrow">SYNTHESIS PROMPT / CLAUDE</p><h1>Bringing the two reports together.</h1><p class="lead">An edited version of the original request.</p></div><div class="prose method-prose"><p>Yusuf identifies the synthesis model as <strong>Claude Opus 5.5</strong>. This model attribution is supplied by the requester; an execution log was not provided.</p><p>The prompt below consolidates the initial request and follow-up preferences. Wording, grammar and structure have been edited for readability, and the provider names standardized. It preserves the request’s intent but is not a verbatim transcript or evidence that this edited wording was used in the original run.</p><p><a href="downloads/claude-synthesis-prompt.txt" download>Download edited prompt (.txt) ↓</a> · <a href="method.html#prompts">Research and synthesis prompts →</a> · <a href="synthesis.html">Read the resulting synthesis →</a></p><pre class="original-prompt">${escape(synthesisPrompt)}</pre></div>`;
await writeFile(new URL('claude-prompt.html', out), shell('Edited Claude synthesis prompt', synthesisPromptBody, 'method', 'The synthesis request, edited for clarity while preserving intent. Model identified by the requester as Claude Opus 5.5.', 'claude-prompt'));
await copyFile(new URL(synthesisPromptPath, root), new URL('downloads/claude-synthesis-prompt.txt', out));
manifest.push({file:'claude-synthesis-prompt.txt', source:synthesisPromptPath, sha256:createHash('sha256').update(synthesisPrompt).digest('hex'), edition:'Edited for clarity; not the verbatim original request'});
for (const file of ['styles.css','favicon.svg']) await copyFile(new URL(`site/${file}`,root),new URL(file,out));
await writeFile(new URL('.nojekyll',out),'');
await writeFile(new URL('source-manifest.json',out),JSON.stringify(manifest,null,2)+'\n');
console.log(`Built 8 pages, 3 report downloads and 3 publication prompt downloads in _site/.`);
