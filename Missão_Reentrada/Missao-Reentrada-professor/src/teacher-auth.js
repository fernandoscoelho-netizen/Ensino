const decode=value=>Uint8Array.from(atob(value),character=>character.charCodeAt(0));
export async function unlockTeacherVault(password,vault){
 if(!globalThis.crypto?.subtle)throw new Error('Este navegador não disponibiliza a proteção necessária. Utiliza uma versão atual do Chrome ou Edge.');
 if(vault?.version!==1||vault.algorithm!=='AES-GCM'||vault.kdf!=='PBKDF2'||vault.iterations<100000||vault.iterations>1000000)throw new Error('A configuração da área do professor não é válida.');
 const secret=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveKey']);
 const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:decode(vault.salt),iterations:vault.iterations,hash:'SHA-256'},secret,{name:'AES-GCM',length:256},false,['decrypt']);
 const decrypted=await crypto.subtle.decrypt({name:'AES-GCM',iv:decode(vault.iv),tagLength:128},key,decode(vault.data));
 const payload=JSON.parse(new TextDecoder().decode(decrypted));
 if(payload.version!==1||typeof payload.guide!=='string'||!payload.solutions)throw new Error('Os materiais do professor não puderam ser lidos.');
 return payload;
}
