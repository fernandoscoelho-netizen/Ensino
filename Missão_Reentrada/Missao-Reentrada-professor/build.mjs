import {build} from 'esbuild';
import {mkdir,copyFile,readFile,writeFile,readdir,unlink} from 'node:fs/promises';
import {challenges} from './src/challenges.js';
import {prepareTeacherVault} from './tools/teacher-vault.mjs';
await mkdir('dist/assets',{recursive:true});await mkdir('dist/docs',{recursive:true});
const {publicChallenges}=await prepareTeacherVault(challenges);
for(const file of await readdir('dist/assets'))if(/\.(?:js|map|txt)$/.test(file))await unlink('dist/assets/'+file);
for(const file of ['dist/docs/guia-professor.html','dist/docs/banco-perguntas.json'])try{await unlink(file);}catch(error){if(error.code!=='ENOENT')throw error;}
await build({entryPoints:['src/app.js','src/space.js'],outdir:'dist/assets',bundle:true,format:'esm',splitting:true,minify:true,target:'es2022',legalComments:'linked'});
const localBuild=await build({metafile:true,entryPoints:['src/app.js'],outfile:'dist/assets/local.js',bundle:true,format:'iife',splitting:false,minify:true,target:'es2022',legalComments:'linked'});
if(Object.values(localBuild.metafile.outputs).some(output=>output.imports?.length))throw new Error('A versão direta ainda contém imports externos.');
for(const f of ['index.html','style.css','runner.html','runner.js','lesson-checks.js'])await copyFile('src/'+f,'dist/'+f);
await writeFile('dist/challenges.js','export const challenges='+JSON.stringify(publicChallenges)+';');
for(const f of ['LICENCAS.txt','VERIFICACAO.md'])await copyFile('docs/'+f,'dist/docs/'+f);
await copyFile('src/rubric.json','dist/docs/rubrica.json');
const html=await readFile('src/index.html','utf8');
const local=html.replace('<html lang="pt-PT">','<html lang="pt-PT" data-resource-base="./dist/">').replace('href="style.css"','href="dist/style.css"').replace('src="teacher-config.js"','src="dist/teacher-config.js"').replace('<script type="module" src="assets/app.js"></script>','<script src="dist/assets/local.js"></script>');
await writeFile('index.html',local);
console.log('Preparado: abertura direta, materiais docentes cifrados e zero imports externos.');
