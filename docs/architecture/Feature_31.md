# Feature 31 - Sistema de Tracking de Progresso

## Documentação Técnica Inicial (Task 31.1)

### Decisão de Arquitetura
Para a implementação da **Feature 31**, foi decidido não criar uma nova tabela (como `student_lesson_progress`) neste momento. A estrutura atual do banco de dados já suporta os requisitos iniciais de tracking, permitindo reutilização de tabelas e mantendo o banco coeso e sem redundâncias.

### Tracking de Progresso
O acompanhamento do progresso será dividido em duas frentes, aproveitando colunas existentes:

1. **Progresso Percentual Geral no Curso**
   - **Tabela:** `enrollments`
   - **Coluna:** `progress` (Tipo: `INTEGER`)
   - **Regras de Negócio:**
     - Possui valor padrão (`DEFAULT`) definido como `0`.
     - Possui uma constraint (`CHECK`) garantindo que o valor seja limitado ao intervalo entre `0` e `100`.
   - **Uso:** Utilizado nos endpoints como `/api/courses/enrolled` para listar os cursos matriculados do aluno e exibir a barra de progresso. (Endpoint listado em `courseController.js`).

2. **Histórico de Aulas Concluídas**
   - **Tabela:** `lessons`
   - **Coluna:** `status`
   - **Regras de Negócio:**
     - Aulas finalizadas devem receber o status de `'concluida'`.
   - **Uso:** A busca do histórico do aluno já é realizada no endpoint `/api/lessons/completed/:teacherId`, validando a relação `student_id`, `teacher_id` e `status = 'concluida'`.

### Script de Banco de Dados (Manual)
O projeto Sonatta não utiliza um sistema de migrations automatizadas. Foi confirmado através da estrutura de queries (`courseController.js`) que a coluna `progress` na tabela `enrollments` já existe no schema atual.

Caso o banco seja recriado ou implantado em um novo ambiente onde a coluna ainda não exista, o script SQL localizado em `docs/database/update_enrollments_progress.sql` deve ser executado **manualmente** no PostgreSQL. Ele garante a criação da coluna, seu tipo numérico (`INTEGER`), valor padrão `0` e limitação do intervalo (`CHECK (progress >= 0 AND progress <= 100)`).

### Endpoints (Confirmação)
Foi validado no backend (`courseController.js`) que os endpoints de retorno de cursos matriculados já buscam o campo `e.progress`. 
- **`/api/courses/enrolled`**: Retorna os cursos matriculados com o campo `progress` (usado para o Dashboard do Aluno).
- **`/api/courses/student`**: Apenas lista os cursos disponíveis e um booleano `is_enrolled` (usado na listagem de cursos globais). O progresso em si foca nos cursos já matriculados (`/enrolled`).

### Próximos Passos (Conclusão Task 31.1)
Esta documentação atende à **Task 31.1**, que está marcada como **concluída sem necessidade de alteração no banco** (já que as tabelas necessárias já existem).

---

## Documentação Técnica - Task 31.2 e 31.3 (Persistência Granular e Cálculo de Progresso)

### Solução de Tracking (Persistência Real)
Inicialmente tentou-se evitar a criação de novas tabelas, utilizando o `localStorage` no frontend como fonte primária para as aulas assistidas. Essa abordagem se provou insuficiente (perda de progresso ao limpar o cache/trocar de dispositivo).
- **Decisão Arquitetural Revisada:** Foi criada uma tabela manual **`student_class_progress`** para persistir granularmente cada aula concluída pelo aluno em um curso específico. 
- O script SQL dessa tabela encontra-se documentado e versionado em `docs/database/student_class_progress.sql`.

### Endpoints de Progresso
Foram criados dois novos endpoints dedicados para a gestão da persistência:
- **`GET /api/courses/:courseId/progress/classes`**: Retorna uma lista com os IDs das aulas concluídas pelo aluno no curso selecionado, servindo como a principal "fonte de verdade" para a renderização inicial no Frontend.
- **`POST /api/courses/:courseId/classes/:classId/complete`**: Rota responsável por marcar a aula específica como concluída.

#### Regras e Validações de Backend Aplicadas
1. **Verificação de Matrícula e Multi-Tenant:** O sistema garante que o aluno logado (`user_id` do Token) está matriculado no curso, e aplica isolamento caso a instituição do aluno difira da instituição do professor do curso.
2. **Validação de Hierarquia:** Garante que a aula (`class_id`) realmente pertence a um módulo atrelado ao `course_id` informado.
3. **Idempotência:** A inserção no banco usa a cláusula `ON CONFLICT DO NOTHING`, garantindo que múltiplas chamadas não gerem erro nem duplicação na tabela.
4. **Recálculo Seguro de Progresso:** A cada aula concluída, o backend automaticamente varre o total de aulas do curso (`COUNT` em `module_classes`) e o total concluído (`COUNT` em `student_class_progress`) para atualizar a coluna `progress` da tabela `enrollments` na mesma transação lógica.

### Frontend
No Frontend (`StudentLessons.jsx`), o `localStorage` atua **apenas como um fallback / cache opcional** em caso de falha de carregamento via GET. A reatividade foi mantida via atualizações de estado otimistas para evitar recarregamentos de página (garantindo que a UI se atualize instantaneamente, revertendo e emitindo alerta apenas caso o endpoint `POST` falhe).
