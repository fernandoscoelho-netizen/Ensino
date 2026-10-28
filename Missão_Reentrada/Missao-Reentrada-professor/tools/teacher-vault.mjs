import {randomBytes,pbkdf2Sync,createCipheriv} from 'node:crypto';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
export async function prepareTeacherVault(challenges){
 await mkdir('private',{recursive:true});let access;
 try{access=JSON.parse(await readFile('private/teacher-access.json','utf8'));if(typeof access.password!=='string'||access.password.length<12)throw new Error('A palavra-passe do professor deve ter pelo menos 12 caracteres.');}
 catch(error){if(error.code!=='ENOENT')throw error;access={password:'Aurora-'+randomBytes(9).toString('base64url')};await writeFile('private/teacher-access.json',JSON.stringify(access,null,2));}
 const publicChallenges=challenges.map(({solution,...lesson})=>lesson);
 await mkdir('work/generated',{recursive:true});await writeFile('work/generated/challenges.js','export const challenges = '+JSON.stringify(publicChallenges)+';');
 const payload={version:1,solutions:Object.fromEntries(challenges.map(c=>[c.id,c.solution])),guide:await readFile('docs/guia-professor.html','utf8')};
 const salt=randomBytes(16),iv=randomBytes(12),iterations=210000,key=pbkdf2Sync(access.password,salt,iterations,32,'sha256');
 const cipher=createCipheriv('aes-256-gcm',key,iv);const data=Buffer.concat([cipher.update(JSON.stringify(payload),'utf8'),cipher.final(),cipher.getAuthTag()]);
 const vault={version:1,algorithm:'AES-GCM',kdf:'PBKDF2',iterations,salt:salt.toString('base64'),iv:iv.toString('base64'),data:data.toString('base64')};
 await mkdir('dist',{recursive:true});await writeFile('dist/teacher-config.js','globalThis.AURORA_TEACHER_VAULT='+JSON.stringify(vault)+';');
 return{publicChallenges};
}
