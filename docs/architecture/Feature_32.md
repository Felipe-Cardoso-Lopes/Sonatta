# Feature 32 - Trilha de Exercício Prático

## Visão Geral (MVP)
A **Feature 32** implementa uma trilha gamificada e sequencial de exercícios para os alunos praticarem o conteúdo ministrado nos cursos. No MVP, a trilha foca em submissões textuais simples com desbloqueio sequencial, sem depender de correção complexa manual por parte do professor.

## 1. Banco de Dados (Persistência e Demonstração)
Foi criada a tabela de rastreio granular de exercícios, isolada do fluxo das aulas.
- **Tabela:** `student_exercise_progress`
- **Script da Tabela (Obrigatório):** `docs/database/student_exercise_progress.sql`
- **Script de Demonstração (Seed):** `docs/database/seed_exercises_demo.sql` (Insere 3 exercícios iniciais. Lembre-se de alterar o `course_id` dentro do arquivo para um curso que exista no seu banco local).

> [!IMPORTANT]
> Para testar visualmente a Feature 32 em um ambiente de desenvolvimento limpo, é estritamente necessário rodar os dois scripts acima (nesta ordem) de forma manual no PostgreSQL.

- **Regras de Negócio na Tabela:**
  - `UNIQUE(student_id, exercise_id)` para impedir que o aluno crie vários registros para o mesmo exercício.
  - Armazena a resposta textual enviada no campo `answer_text`.
  - As chaves estrangeiras garantem deleção em cascata (`ON DELETE CASCADE`) caso o usuário, curso ou exercício matriz sejam apagados.

## 2. Lógica Backend (`exerciseController.js`)
- **`GET /api/exercises/course/:courseId/progress`**:
  - Exclusivo para perfil `aluno`.
  - Valida se o aluno possui matrícula válida (tabela `enrollments`).
  - Busca todos os exercícios daquele curso ordenados por `order_index`.
  - Faz um merge com a tabela `student_exercise_progress` para retornar ao frontend quais exercícios o aluno já concluiu e qual foi a resposta enviada.
- **`POST /api/exercises/:exerciseId/submit`**:
  - Exclusivo para perfil `aluno`.
  - Valida a matrícula e certifica se o exercício em questão pertence realmente ao curso informado.
  - Insere ou atualiza (`ON CONFLICT DO UPDATE`) a resposta na tabela, permitindo edição. Marca automaticamente `completed = TRUE`.

## 3. Lógica Frontend (`StudentPractice.jsx`)
- **Integração Real:** A tela abandonou o array mockado e passou a consumir `GET /progress` quando um curso matriculado é selecionado.
- **Regra de Desbloqueio Visual:** A trilha renderiza verticalmente.
  - O exercício recebe a flag `status = 'completed'` se já estiver concluído no backend.
  - O **primeiro exercício não concluído** que o frontend encontrar no array (que vem ordenado) ganha a flag `status = 'current'`. Ele ganha destaque em roxo e o campo de texto `<textarea>` é revelado.
  - Todos os subsequentes ganham a flag `status = 'locked'` (ícone 🔒).
- Ao enviar a resposta (`handleSubmitExercise`), a API é acionada. Se bem-sucedida, o `GET` da trilha é chamado novamente, travando o exercício recém-feito como `completed`, revelando a resposta salva, e movendo a tag `current` (e a caixa de texto) para o próximo exercício automaticamente.

## Próximos Passos (Evolução Futura)
- Adicionar validações de nota e upload de vídeos para exercícios práticos complexos.
- Criar a visão do Professor para poder interagir/corrigir as submissões.
