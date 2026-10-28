export function cleanStudent(value){
 const text=(v,max)=>String(v||'').replace(/[\u0000-\u001f\u007f]/g,'').trim().replace(/\s+/g,' ').slice(0,max);
 return{name:text(value?.name,80),group:text(value?.group,40),number:text(value?.number,6).replace(/[^0-9]/g,'')};
}
export function isIdentified(student){return Boolean(student?.name?.trim()&&student?.group?.trim());}
export function sameStudent(a,b){const normal=s=>String(s||'').normalize('NFKC').trim().toLocaleLowerCase('pt-PT');return normal(a?.name)===normal(b?.name)&&normal(a?.group)===normal(b?.group)&&normal(a?.number)===normal(b?.number);}
export function studentFileStem(student){const slug=(value,fallback)=>String(value||'').normalize('NFKD').replace(/\p{M}/gu,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,70)||fallback;return['reentrada',slug(student?.name,'aluno'),slug(student?.group,'turma'),student?.number?'n'+String(student.number).replace(/[^0-9]/g,''):''].filter(Boolean).join('-');}
export function studentInitials(student){const words=String(student?.name||'').trim().split(/\s+/).filter(Boolean);return words.length?(words[0][0]+(words.length>1?words.at(-1)[0]:words[0][1]||'')).toLocaleUpperCase('pt-PT'):'OP';}
