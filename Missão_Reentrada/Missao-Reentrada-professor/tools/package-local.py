from pathlib import Path
import json, os, shutil, zipfile

root = Path(__file__).resolve().parents[1]
out = root.parent
secret = json.loads((root / 'private/teacher-access.json').read_text(encoding='utf-8'))['password'].encode()
public = [root / p for p in ['index.html', 'Iniciar-Missao.cmd', 'LEIA-ME.html', 'LEIA-ME-ALUNOS.txt', 'VERSAO.txt']]
public += sorted(p for p in (root / 'dist').rglob('*') if p.is_file())
student = out / 'missao-reentrada-alunos-painel.zip'
with zipfile.ZipFile(student, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
    for p in public:
        data = p.read_bytes()
        assert secret not in data, f'Credencial em {p.name}'
        assert b'Usei Grid para controlar as colunas e Flexbox para alinhar comandos.' not in data, f'Solucao em {p.name}'
        assert p.name not in ['guia-professor.html', 'teacher-access.json', 'banco-perguntas.json']
        archive.writestr('missao-reentrada-alunos/' + p.relative_to(root).as_posix(), data)
with zipfile.ZipFile(student) as archive:
    assert archive.testzip() is None
    assert not any('/' + part + '/' in name for name in archive.namelist() for part in ['src','private','work','node_modules'])
    student_count = len(archive.namelist())

teacher = out / 'missao-reentrada-professor-painel.zip'
excluded = {'node_modules', '.git', '.openai', '.sites', '.sites-runtime', '.runtime', 'work', '__pycache__'}
with zipfile.ZipFile(teacher, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
    for base, dirs, files in os.walk(root):
        dirs[:] = sorted(d for d in dirs if d not in excluded)
        for name in sorted(files):
            p = Path(base) / name
            if p.suffix.lower() in {'.zip','.log'}: continue
            archive.write(p, 'missao-reentrada-professor/' + p.relative_to(root).as_posix())
    archive.write(out / 'Acesso-Professor.txt', 'missao-reentrada-professor/ACESSO-PROFESSOR.txt')
with zipfile.ZipFile(teacher) as archive:
    assert archive.testzip() is None
    assert 'missao-reentrada-professor/private/teacher-access.json' in archive.namelist()
    teacher_count = len(archive.namelist())
for name in ['missao-reentrada-alunos.zip', 'missao-reentrada-local.zip', 'missao-reentrada.zip']:
    shutil.copyfile(student, out / name)
shutil.copyfile(teacher, out / 'missao-reentrada-professor.zip')
print(json.dumps({'alunos': {'ficheiros': student_count, 'bytes': student.stat().st_size}, 'professor': {'ficheiros': teacher_count, 'bytes': teacher.stat().st_size}, 'verificacao': 'ZIP integros; pacote alunos sem senha, fontes docentes ou solucoes abertas'}, ensure_ascii=False))
