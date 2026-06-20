# Walkthrough - Security Sprint

## Ciclo 1

### Super Admin

Problema identificado:

* Ausência de proteção RBAC nas rotas administrativas.

Correção:

* Aplicado checkRole(['super_admin'])

Resultado:

* 27 novos testes.
* 100% passando.

---

## Ciclo 2

### Institution Security

Problemas identificados:

* getTeachers sem validação de role.
* createTeacher sem validação de role.

Correções:

* Adicionada validação explícita de role.

Resultado:

* 19 novos testes.
* 91 testes totais passando.

---

## Ciclo 3

### Teacher + Student Security (Multi-Tenant Isolation)

Realizamos uma auditoria completa nos módulos de Professores e Alunos, com foco na validação de permissões (RBAC) e no isolamento *Multi-Tenant* (fronteiras entre instituições).

> [!CAUTION]
> As vulnerabilidades encontradas permitiam que alunos visualizassem cursos e se matriculassem em turmas de instituições concorrentes, além de expor as aulas de todos os professores globalmente.

#### Vulnerabilidades Encontradas
* **Vazamento de Cursos (`getAllCoursesForStudent`)**: O método retornava todos os cursos cadastrados no banco de dados, independentemente da instituição.
* **Matrícula Cruzada (`enrollStudent`)**: Um aluno vinculado à "Instituição A" poderia se matricular em um curso da "Instituição B", pois o sistema não cruzava os identificadores institucionais.
* **Exposição Global de Aulas (`getLessons`)**: A rota listava todas as aulas de todos os professores globalmente, sem filtro institucional.

#### Correções de Produção
* **Em `getAllCoursesForStudent`**: A consulta SQL foi alterada para realizar um `JOIN` com a tabela `users` e filtrar `u.instituicao_id = (SELECT instituicao_id FROM users WHERE id = $1)`.
* **Em `enrollStudent`**: Adicionada uma barreira estrita (`courseCheck`) para verificar se o `course_id` solicitado pertence a um professor da mesma `instituicao_id` do aluno (retornando HTTP 403 em caso negativo).
* **Em `getLessons`**: Inserido filtro de *Multi-Tenant* na consulta SQL para retornar estritamente as aulas atreladas à instituição do usuário autenticado.

#### Testes Criados
Criado o arquivo `server/tests/teacherStudentSecurity.test.js` com 7 testes:
* **Autenticação**: Validação de endpoints acessados sem token e com token inválido (esperado 401).
* **RBAC**: Tentativas de acessos cruzados de roles (Aluno acessando rota de Professor e vice-versa, esperado 403).
* **Multi-Tenant Isolation**: Validação rigorosa garantindo que as requisições respeitam a fronteira institucional.

#### Resultado Final
* A suíte de testes passou em 100% dos casos.
* Os limites e controles entre locatários (tenants) foram efetivamente consolidados.

---

## Ambiente de Testes

Melhorias:

* Criação do jest.setup.js
* Criação do jest.config.js
* Remoção de logs sensíveis
* Controle refinado de console.error

---

## Ciclo 4

### Payment Security

Realizamos auditoria focada no fluxo de pagamentos, assinaturas e webhooks da integração com Mercado Pago.

> [!WARNING]
> O painel financeiro das instituições e a rota de checkout estavam acessíveis por estudantes e professores, o que configurava uma violação grave de privilégios.

#### Vulnerabilidades Encontradas
* **Ausência de Controle de Acesso (RBAC)**: Rotas financeiras (`/api/payments/institution/summary`, `/api/payments/institution/transactions`, `/api/payments/checkout`) validavam apenas a presença do token, permitindo que alunos e professores acessassem métricas de negócio.

#### Correções de Produção
* **Restrição RBAC em Rotas**: Inserido o middleware `checkRole(['instituicao', 'super_admin'])` nas rotas do painel financeiro e na geração de checkout.

#### Testes Criados
Criado o arquivo `server/tests/paymentSecurity.test.js` cobrindo 17 cenários, dentre eles:
* **Autenticação e RBAC**: Rejeitando estudantes/professores com HTTP 403 nas áreas financeiras.
* **Multi-Tenant (IDOR Prevention)**: Garantia de que a `instituicao_id` injetada num possível ataque via `req.body` ou `req.query` é totalmente ignorada.
* **Checkout Sessions**: Bloqueio contra escalada ou pagamento forjado em nome de outras instituições.
* **Webhooks (Mercado Pago)**: Testes abrangentes de validação (`external_reference`), supressão de erro interno sem vazamento de stack traces e operação tolerante a falhas (eventos duplicados seguros via `ON CONFLICT` no PostgreSQL).

#### Resultado Final
* A suíte agora conta com 17 suítes e 205 testes passing.
* Integração de pagamentos totalmente blindada contra *Privilege Escalation* e acessos cruzados.
