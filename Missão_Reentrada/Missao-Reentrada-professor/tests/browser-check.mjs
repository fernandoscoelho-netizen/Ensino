const {chromium}=await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
import {challenges} from '../src/challenges.js';
import {writeFile,mkdir} from 'node:fs/promises';
const base='http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--ignore-gpu-blocklist']});
const context=await browser.newContext({viewport:{width:1440,height:1100},acceptDownloads:true});
const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto(base);await page.waitForSelector('.cm-editor');
const report=[];
function seed(c,code){return {version:1,current:c.id,student:{name:'Aluno Teste',group:'TEAC TESTE',number:'1'},drafts:{[c.id]:code},completed:{},notes:{},hints:{},settings:{font:16,code:15,quality:'2d',reduced:true,sound:false,explore:true}};}
async function load(c,code){await page.evaluate(v=>localStorage.setItem('aurora-reentrada-v1',JSON.stringify(v)),seed(c,code));await page.reload();await page.waitForSelector('#enter-mission');await page.click('#enter-mission');await page.waitForSelector('.cm-editor');await page.waitForFunction(()=>!document.querySelector('#validate-btn').disabled);}
async function validate(){await page.click('#validate-btn');await page.waitForFunction(()=>!document.querySelector('#validate-btn').disabled);return page.locator('#results').innerText();}
for(const c of challenges){
 await load(c,c.starter);const first=await validate();if(first.startsWith('✓ Sistema recuperado'))throw Error('Starter passes unexpectedly: '+c.id);
 await load(c,c.solution);const result=await validate();const ok=result.startsWith('✓ Sistema recuperado');report.push({id:c.id,title:c.title,solutionPass:ok,result});console.log(c.id+': '+(ok?'PASS':'FAIL'));if(!ok)throw Error(result);
}
// Estado persistente e exportação real.
await page.reload();await page.waitForSelector('#enter-mission');await page.click('#enter-mission');await page.waitForSelector('.cm-editor');if(!await page.locator('.mission-step.done').count())throw Error('Validation was not persisted.');
await page.click('#export-btn');const dlPromise=page.waitForEvent('download');await page.click('#download-json');const dl=await dlPromise;await dl.saveAs('../../work/qa-progress.json');await page.click('#close-modal');
await page.click('#export-btn');const zipPromise=page.waitForEvent('download');await page.click('#download-zip');const zip=await zipPromise;await zip.saveAs('../../work/qa-work.zip');await page.click('#close-modal');
// Ciclo infinito acidental e isolamento.
const loop={...challenges[7].solution,js:'while (true) {}'};await load(challenges[7],loop);const loopResult=await validate();if(!loopResult.includes('demasiadas'))throw Error('Infinite loop guard failed.');
const isolation={...challenges[7].solution,js:'document.body.textContent = typeof parent.localStorage;'};await load(challenges[7],isolation);await page.click('#run-btn');await page.waitForFunction(()=>!document.querySelector('#run-btn').disabled);if(!(await page.locator('#preview-status').innerText()).includes('Erro'))throw Error('Sandbox storage isolation failed.');
// Estado vazio para capturas da apresentação e desafio de cartão.
await load(challenges[0],challenges[0].starter);await page.evaluate(()=>{localStorage.removeItem('aurora-reentrada-v1');});await page.reload();await page.waitForSelector('#student-input-name');await page.fill('#student-input-name','Aluno Teste');await page.fill('#student-input-group','TEAC TESTE');await page.click('#enter-mission');await page.waitForSelector('.cm-editor');await page.waitForTimeout(700);await page.screenshot({path:'../preview-desktop.png',fullPage:true});
for(const width of [390,768,1440]){await page.setViewportSize({width,height:1000});await page.waitForTimeout(150);const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1);if(overflow)throw Error('Page overflow at '+width);report.push({viewport:width,noHorizontalOverflow:true});if(width===390)await page.screenshot({path:'../preview-mobile.png',fullPage:true});}
await mkdir('docs',{recursive:true});await writeFile('docs/browser-results.json',JSON.stringify({report,appErrors:errors},null,2));
await browser.close();console.log('Browser checks complete.');
