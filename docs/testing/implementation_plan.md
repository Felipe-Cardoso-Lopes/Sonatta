# Backend Test Implementation

Este plano apresenta a auditoria de cobertura de testes de todo o repositório do projeto Sonatta. O objetivo é identificar as lacunas atuais e traçar uma estratégia robusta contemplando testes unitários, de integração e ponta-a-ponta (E2E), alinhada com as diretrizes do `sonatta-global-workspace.md`.

## User Review Required

> [!IMPORTANT]
> Precisamos definir a ordem de priorização para a implementação dos testes. Quais áreas devemos focar primeiro:
> 1. Controladores do Backend (regras de negócio)?
> 2. Testes de Interface/Componentes no Frontend?
> 3. Fluxos Críticos E2E (como Pagamento e Criação de Cursos)?

## Open Questions

- Você prefere utilizar uma abordagem de TDD (Test-Driven Development) nas próximas entregas ou adicionar a cobertura após a implementação inicial (Fast Feedback)?
- Para o Backend, os testes atuais usam `Jest` e `Supertest`. Deseja manter essa stack e focar 100% em testes de integração das rotas, ou introduzir testes unitários puros para serviços de negócio isolados?

---

## Proposed Changes

### 1. Frontend (React / Vite)

Atualmente, apenas **4 das 42 páginas** possuem testes explícitos (`Login`, `InstituicaoDashboard`, `InstituicaoProfile`, `StudentLesson`) e apenas **2 dos 13 componentes** (`Button`, `Input`). Os testes E2E com Playwright cobrem alguns cenários de instituições e aprovação, mas a cobertura geral ainda é baixa.

#### Quais testes precisam ser criados:
- **Testes Unitários (Componentes):** 
  - `Header`, `NotificationBell`, `DropZone` e todos os componentes de `Sidebar` (`StudentSidebar`, `TeacherSidebar`, etc.).
- **Testes de Integração (Páginas):** 
  - Criação de testes vitais para os fluxos principais não cobertos: `SoloTeacherCourses.jsx`, `SoloTeacherDashboard.jsx`, `TeacherManagement.jsx`, `InstituicaoManagement.jsx`, e `StudentLessons.jsx`.
- **Testes E2E (Playwright):** 
  - Fluxo de criação e publicação de cursos por Professores Solo.
  - Fluxo completo do Aluno: matrícula, consumo de aulas e práticas.
  - Fluxo do Super Admin para gestão do sistema.

#### Quais testes existentes devem ser atualizados:
- **`InstituicaoProfile.test.jsx` e `InstituicaoDashboard.test.jsx`:** Atualizar para garantir que os testes não apenas renderizem os componentes, mas também simulem as ações do `react-hot-toast` para confirmar o feedback visual e o tratamento correto dos estados HTTP (200, 400, 500).

#### Quais cenários de falha devem ser cobertos:
- **Respostas de Erro da API (Backend Inacessível ou Erro 500):** Garantir que a UI apresente uma mensagem amigável (Toast) e não quebre a página.
- **Validação de Formulários:** Submissão de formulários com dados incompletos ou em formatos inválidos (ex: e-mail inválido, senhas curtas).
- **Acessos Não Autorizados:** Garantir que o componente redirecione o usuário de volta ao `/login` ou mostre página de erro (ex: aluno acessando dashboard de instituição).
- **Estados de Carregamento:** O botão de submit deve estar desabilitado (`loading state`) durante todas as mutações para evitar duplicação de requests.

---

### 2. Backend (Node.js / Express)

Atualmente, há uma boa estrutura inicial com `Jest` e `Supertest` focando em cenários específicos de autenticação e perfis (`authMiddleware`, `tc005_tc006`, `lesson`, `userLogin`, etc.), cobrindo cerca de 5 dos 16 controllers.

#### Quais testes precisam ser criados:
- **Testes de Integração de Controladores Principais:**
  - `courseController.js`: Criação, atualização, deleção e listagem de cursos.
  - `paymentController.js`: Fluxos financeiros essenciais.
  - `scheduleController.js`, `moduleController.js`, `reviewController.js`, `superAdminController.js`.
- **Testes Unitários de Utilities:** Se existirem funções auxiliares puras para cálculo de métricas (vistas no `reportController.js`), elas devem ter testes isolados.

#### Quais testes existentes devem ser atualizados:
- **`lesson.test.js`:** Expandir a cobertura para testar as regras de transição de status de aulas e progressão.
- **`tc005_tc006.test.js`:** Validar que as consultas mockadas via `pg` testam de fato se as queries estão parametrizadas e prevenindo Injeção de SQL.

#### Quais cenários de falha devem ser cobertos:
- **Violação de Roles (RBAC):** Garantir explicitamente que um usuário com cargo de `aluno` receba `403 Forbidden` ao tentar consumir uma rota de `instituicao` (como feito no TC-005, mas estendido a todos os endpoints restritos).
- **Falha de Conexão com Supabase/Banco de Dados:** Garantir que o controlador capture a falha e retorne HTTP 500 (sem vazar stack trace no body).
- **Body/Payload Inválido:** Casos onde chaves JSON obrigatórias estão faltando. O backend deve responder com HTTP 400 descritivo.
- **SQL Injection:** Testes mockando entradas maliciosas no req.body, assegurando que o DB retorne erro ou que o uso exclusivo de `$1, $2` neutralize a ameaça.

---

### 3. Teacher + Student Security Sprint (Atualização Recente)

Foco recente executado para sanar vazamentos de limites *Multi-Tenant* (isolamento entre instituições diferentes):

#### Findings (Descobertas)
- A consulta SQL de `getAllCoursesForStudent` (`courseController.js`) falhava em filtrar a `instituicao_id` correspondente.
- A matrícula `enrollStudent` (`courseController.js`) permitia inscrições em turmas de concorrentes.
- A busca global `getLessons` (`lessonController.js`) expunha todas as aulas sem filtrar quem a solicitava.

#### Implementation Plan Executado
- **Testes:** Criação da suíte `tests/teacherStudentSecurity.test.js` dedicada a falhas de RBAC e multi-tenancy.
- **Correções de Produção:** Modificações nos controladores para injetar filtros rígidos utilizando `instituicao_id = (SELECT instituicao_id FROM users WHERE id = $1)`.

---

## Verification Plan

### Automated Tests
- Executar `npm run test` no diretório `/server` para validar as implementações de backend.
- Executar `vitest run` e testes E2E do Playwright (`npx playwright test`) no diretório `/client` para confirmar a estabilidade do front-end.
- Configurar flags de `--coverage` em ambos os ecossistemas para metrificar o avanço de linhas, funções e ramificações cobertas em cada sprint.

### Manual Verification
- O agente verificará os logs do watcher do Vitest/Jest sempre que um novo teste for criado para certificar-se de que ele passa de forma independente, aplicando autocorreção (`sonatta-feature-flow`) caso necessário.
