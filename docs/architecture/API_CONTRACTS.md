# Contratos de API — Sonatta

> **Fonte da verdade** para a comunicação entre o Frontend (`./client`) e o Backend (`./server`).
>
> **Regra para Agentes de IA:** Nunca implemente ou modifique rotas sem antes refletir a mudança aqui. Nunca invente endpoints — documente apenas o que existe no código.

## Configurações Globais

- **Base URL (local):** `http://localhost:5000`
- **Autenticação:** Header `Authorization: Bearer <token>` obrigatório em rotas protegidas
- **Formato:** Todas as respostas são `application/json`

---

## Legenda de Autenticação

| Símbolo | Significado |
|---|---|
| 🔓 Pública | Sem token — qualquer requisição é aceita |
| 🔒 JWT | Requer token JWT válido (`verifyToken`) |
| 🛡️ Role | Requer role específico além do JWT |

---

## [TEMPLATE] Estrutura Padrão para Novos Endpoints

*Nota para Agentes de IA: Copie a estrutura abaixo e preencha com dados precisos ao documentar uma nova funcionalidade.*

### [Módulo/Entidade] — [Nome da Ação]

- **Descrição:** [Análise descritiva e objetiva do objetivo da rota]
- **Método:** `[GET | POST | PUT | PATCH | DELETE]`
- **Rota:** `/api/[recurso]/[caminho_opcional]`
- **Autenticação:** [Ex: 🔓 Pública | 🔒 JWT | 🛡️ JWT + role `'super_admin'`]

#### Parâmetros (Path / Query)

*Remova esta seção se não houver parâmetros.*

- `[nome_do_parametro]` (Path/Query): [Tipo de dado e descrição]

#### Request Body (application/json)

*Remova esta seção se o método não exigir corpo (ex: GET).*

```json
{
  "campo_obrigatorio": "tipo_de_dado",
  "campo_opcional": "tipo_de_dado (opcional)"
}
```

#### Sucesso — [Código HTTP: 200 OK | 201 Created]

```json
{
  "message": "Mensagem padronizada de sucesso",
  "data": { "id": "number", "exemplo": "valor" }
}
```

#### Erros Previstos

| Status | Condição |
|---|---|
| 400 | Campos obrigatórios ausentes ou validação falhou |
| 401 | Token ausente, malformado ou expirado |
| 403 | Role insuficiente para a ação |
| 404 | Entidade não encontrada no banco |
| 500 | Erro genérico de banco ou execução |

---

## Módulo: Autenticação (`/api/auth`)

### POST /api/auth/login

- **Descrição:** Autentica um usuário via e-mail e senha. Bloqueia login se o e-mail não estiver verificado.
- **Autenticação:** 🔓 Pública

#### Request Body

```json
{
  "email": "string (obrigatório)",
  "password": "string (obrigatório)"
}
```

#### Sucesso — 200 OK

```json
{
  "token": "string (JWT)",
  "id": "number",
  "role": "string",
  "name": "string",
  "nickname": "string | null",
  "teacherType": "string"
}
```

#### Erros Previstos

| Status | Condição |
|---|---|
| 400 | `email` ou `password` ausentes |
| 401 | E-mail não encontrado ou senha incorreta (mensagem genérica) |
| 403 | Usuário encontrado, senha correta, mas `is_verified = false` |
| 500 | Falha de banco ou `JWT_SECRET` não configurado |

---

### POST /api/auth/send-code

- **Descrição:** Envia um código de verificação de 6 dígitos (válido por 15 minutos) para o e-mail do usuário.
- **Autenticação:** 🔓 Pública

#### Request Body

```json
{
  "email": "string (obrigatório)"
}
```

#### Sucesso — 200 OK

```json
{
  "message": "Código enviado com sucesso."
}
```

#### Erros Previstos

| Status | Condição |
|---|---|
| 400 | `email` ausente no body |
| 400 | E-mail já verificado (`is_verified = true`) |
| 404 | Nenhum usuário com este e-mail |
| 500 | Falha de banco ou falha ao enviar e-mail |

---

### POST /api/auth/verify-code

- **Descrição:** Valida o código de verificação. Se correto e não expirado, marca o usuário como verificado e limpa o código do banco.
- **Autenticação:** 🔓 Pública

#### Request Body

```json
{
  "email": "string (obrigatório)",
  "code": "string (obrigatório, 6 dígitos)"
}
```

#### Sucesso — 200 OK

```json
{
  "message": "E-mail verificado com sucesso!"
}
```

#### Erros Previstos

| Status | Condição |
|---|---|
| 400 | `email` ou `code` ausentes |
| 400 | Código incorreto |
| 400 | Código expirado (`verification_expires` no passado) |
| 404 | Nenhum usuário com este e-mail |
| 500 | Falha de banco |

---

### POST /api/auth/register-institution

- **Descrição:** Cadastro público de instituição via landing page. O status é fixado como `'pendente'` no SQL — payloads maliciosos com `status: 'ativo'` são ignorados.
- **Autenticação:** 🔓 Pública

#### Request Body

```json
{
  "nome": "string (obrigatório)",
  "email": "string (obrigatório)",
  "telefone": "string (opcional)",
  "cidade": "string (opcional)"
}
```

#### Sucesso — 201 Created

```json
{
  "message": "Cadastro recebido com sucesso! Aguarde aprovação.",
  "institution": {
    "id": "number",
    "nome": "string",
    "email": "string",
    "status": "pendente"
  }
}
```

#### Erros Previstos

| Status | Condição |
|---|---|
| 400 | `nome` ou `email` ausentes |
| 400 | E-mail já em uso por outra instituição |
| 500 | Falha de banco |

---

## Módulo: Usuários (`/api/users`)

### POST /api/users/register

- **Descrição:** Cadastra um novo usuário. Se `inviteCode` for fornecido e válido, atribui role e `instituicao_id` correspondentes ao código.
- **Autenticação:** 🔓 Pública

#### Request Body

```json
{
  "name": "string (obrigatório)",
  "email": "string (obrigatório)",
  "password": "string (obrigatório)",
  "inviteCode": "string (opcional)"
}
```

#### Sucesso — 201 Created

```json
{
  "id": "number",
  "name": "string",
  "email": "string",
  "role": "string",
  "instituicao_id": "number | null",
  "token": "string (JWT)"
}
```

#### Erros Previstos

| Status | Condição |
|---|---|
| 400 | Campos obrigatórios ausentes |
| 400 | E-mail já cadastrado |
| 400 | `inviteCode` inválido |
| 500 | Falha de banco |

---

### POST /api/users/login

- **Descrição:** Autentica um usuário. Bloqueia login de instituições com `is_verified = false`.
- **Autenticação:** 🔓 Pública

#### Request Body

```json
{
  "email": "string (obrigatório)",
  "password": "string (obrigatório)"
}
```

#### Sucesso — 200 OK

```json
{
  "id": "number",
  "name": "string",
  "nickname": "string | null",
  "email": "string",
  "role": "string",
  "teacherType": "string | null",
  "token": "string (JWT)"
}
```

#### Erros Previstos

| Status | Condição |
|---|---|
| 401 | `email` ou `password` ausentes, e-mail não encontrado, ou senha incorreta |
| 403 | `role === 'instituicao'` e `is_verified = false` |
| 500 | Falha de banco |

---

### GET /api/users/profile

- **Descrição:** Retorna os dados do perfil do usuário autenticado.
- **Autenticação:** 🔒 JWT

#### Sucesso — 200 OK

```json
{
  "id": "number",
  "name": "string",
  "nickname": "string | null",
  "email": "string",
  "role": "string",
  "birth_date": "date | null",
  "avatar_url": "string | null"
}
```

#### Erros Previstos

| Status | Condição |
|---|---|
| 401 | Token ausente ou inválido |
| 404 | Usuário não encontrado no banco |
| 500 | Falha de banco |

---

### PUT /api/users/profile

- **Descrição:** Atualiza o perfil do usuário autenticado. Todos os campos são opcionais (COALESCE).
- **Autenticação:** 🔒 JWT

#### Request Body

```json
{
  "name": "string (opcional)",
  "nickname": "string (opcional)",
  "email": "string (opcional)",
  "avatar_url": "string (opcional)",
  "password": "string (opcional)"
}
```

#### Sucesso — 200 OK

```json
{
  "message": "Perfil atualizado com sucesso!",
  "user": {
    "id": "number",
    "name": "string",
    "nickname": "string",
    "email": "string",
    "role": "string",
    "avatar_url": "string | null"
  }
}
```

#### Erros Previstos

| Status | Condição |
|---|---|
| 400 | E-mail já em uso por outra conta (constraint `23505`) |
| 401 | Token ausente ou inválido |
| 404 | Usuário não encontrado |
| 500 | Falha de banco |

---

### PUT /api/users/complete/:id

- **Descrição:** Finaliza o cadastro do usuário com nickname e data de nascimento.
- **Autenticação:** 🔓 Pública

#### Parâmetros

- `id` (Path): ID numérico do usuário

#### Request Body

```json
{
  "nickname": "string",
  "birth_date": "date (YYYY-MM-DD)"
}
```

#### Sucesso — 200 OK

```json
{
  "message": "Cadastro finalizado com sucesso!",
  "user": { "...todos os campos do usuário..." }
}
```

#### Erros Previstos

| Status | Condição |
|---|---|
| 404 | Usuário não encontrado |
| 500 | Falha de banco |

---

### POST /api/users/preferences

- **Descrição:** Salva (ou atualiza via UPSERT) as preferências musicais do usuário.
- **Autenticação:** 🔓 Pública

#### Request Body

```json
{
  "userId": "number (obrigatório)",
  "nivel": "string",
  "instrumentos": "array",
  "generos": "array"
}
```

#### Sucesso — 200 OK

```json
{
  "message": "Preferências salvas com sucesso!",
  "data": { "...campos da tabela user_preferences..." }
}
```

---

### GET /api/users/public/:id

- **Descrição:** Retorna o perfil público de um professor (exibido na vitrine). Retorna apenas usuários com `role = 'professor'`.
- **Autenticação:** 🔓 Pública

#### Parâmetros

- `id` (Path): ID numérico do professor

#### Sucesso — 200 OK

```json
{
  "id": "number",
  "name": "string",
  "nickname": "string | null",
  "specialty": "string | null",
  "bio": "string | null",
  "youtube_intro_url": "string | null",
  "spotify_artist_url": "string | null",
  "offers_trial_lesson": "boolean"
}
```

#### Erros Previstos

| Status | Condição |
|---|---|
| 404 | Nenhum professor com este ID |
| 500 | Falha de banco |

---

## Módulo: Instituição (`/api/instituicao`)

> Todas as rotas exigem JWT. A maioria exige `role: 'instituicao'` (verificação no controller).

### PUT /api/instituicao/approve-user

- **Descrição:** Aprova um usuário pendente, alterando seu role para `'aluno'` ou `'professor'`. Não altera `super_admin`.
- **Autenticação:** 🛡️ JWT + role `instituicao`

#### Request Body

```json
{
  "email": "string (obrigatório)",
  "newRole": "'aluno' | 'professor' (obrigatório)"
}
```

#### Sucesso — 200 OK

```json
{
  "message": "Usuário aprovado e vinculado com sucesso!",
  "user": {
    "id": "number",
    "name": "string",
    "email": "string",
    "role": "string"
  }
}
```

#### Erros Previstos

| Status | Condição |
|---|---|
| 400 | `email` ou `newRole` ausentes |
| 400 | `newRole` diferente de `'aluno'` ou `'professor'` |
| 401 | Token ausente ou inválido |
| 403 | Role diferente de `'instituicao'` |
| 403 | Tentativa de alterar um `super_admin` |
| 404 | Nenhum usuário com este e-mail |
| 500 | Falha de banco |

---

### GET /api/instituicao/teachers

- **Descrição:** Lista todos os professores vinculados à instituição autenticada.
- **Autenticação:** 🛡️ JWT + role `instituicao`

#### Sucesso — 200 OK

```json
[
  {
    "id": "number",
    "name": "string",
    "email": "string",
    "teacher_type": "institucional",
    "is_verified": "boolean",
    "created_at": "timestamp"
  }
]
```

#### Erros Previstos

| Status | Condição |
|---|---|
| 401 | Token ausente ou inválido |
| 403 | Role diferente de `'instituicao'` |
| 500 | Falha de banco |

---

### POST /api/instituicao/teachers

- **Descrição:** Cadastra um novo professor vinculado à instituição autenticada. Role fixado como `'teacher'`, `teacher_type` como `'institucional'` e `is_verified = true` — valores não podem ser sobrescritos via payload.
- **Autenticação:** 🛡️ JWT + role `instituicao`

#### Request Body

```json
{
  "name": "string (obrigatório)",
  "email": "string (obrigatório)",
  "password": "string (obrigatório)"
}
```

#### Sucesso — 201 Created

```json
{
  "message": "Professor cadastrado com sucesso!",
  "teacher": {
    "id": "number",
    "name": "string",
    "email": "string",
    "role": "teacher",
    "teacher_type": "institucional"
  }
}
```

#### Erros Previstos

| Status | Condição |
|---|---|
| 400 | `name`, `email` ou `password` ausentes |
| 400 | E-mail já em uso |
| 401 | Token ausente ou inválido |
| 403 | Role diferente de `'instituicao'` |
| 500 | Falha de banco |

---

### PUT /api/instituicao/profile

- **Descrição:** Atualiza o perfil público da instituição autenticada (descrição, URLs). Todos os campos são opcionais.
- **Autenticação:** 🛡️ JWT + role `instituicao`

#### Request Body

```json
{
  "descricao_longa": "string (opcional)",
  "logo_url": "string URL (opcional)",
  "banner_url": "string URL (opcional)",
  "website_url": "string URL (opcional)",
  "instagram_url": "string URL (opcional)",
  "linkedin_url": "string URL (opcional)",
  "facebook_url": "string URL (opcional)"
}
```

#### Sucesso — 200 OK

```json
{
  "message": "Perfil público atualizado com sucesso!",
  "instituicao": { "...todos os campos da tabela instituicoes..." }
}
```

#### Erros Previstos

| Status | Condição |
|---|---|
| 400 | URL com formato inválido em qualquer campo de URL |
| 401 | Token ausente ou inválido |
| 403 | Role diferente de `'instituicao'` |
| 404 | Registro da instituição não encontrado |
| 500 | Falha de banco |

---

### PUT /api/instituicao/security

- **Descrição:** Altera a senha do usuário da conta institucional.
- **Autenticação:** 🔒 JWT

#### Request Body

```json
{
  "currentPassword": "string (obrigatório)",
  "newPassword": "string (obrigatório)"
}
```

#### Sucesso — 200 OK

```json
{
  "message": "Senha atualizada com sucesso!"
}
```

#### Erros Previstos

| Status | Condição |
|---|---|
| 401 | Token ausente ou inválido |
| 401 | `currentPassword` incorreta |
| 404 | Usuário não encontrado |
| 500 | Falha de banco |

---

### PUT /api/instituicao/preferences

- **Descrição:** Atualiza as preferências de notificação da instituição.
- **Autenticação:** 🔒 JWT

#### Request Body

```json
{
  "notif_email": "boolean",
  "notif_sms": "boolean",
  "notif_marketing": "boolean"
}
```

#### Sucesso — 200 OK

```json
{
  "message": "Preferências salvas!",
  "preferences": {
    "notif_email": "boolean",
    "notif_sms": "boolean",
    "notif_marketing": "boolean"
  }
}
```

#### Erros Previstos

| Status | Condição |
|---|---|
| 401 | Token ausente ou inválido |
| 500 | Falha de banco |

---

## Módulo: Super Admin (`/api/super-admin`)

> Todas as rotas exigem JWT + `role: 'super_admin'` (via `checkRole` no middleware).

### GET /api/super-admin/stats

- **Descrição:** Retorna estatísticas globais da plataforma.
- **Autenticação:** 🛡️ JWT + role `super_admin`

#### Sucesso — 200 OK

```json
{
  "totalInstitutions": "number",
  "totalTeachers": "number",
  "totalStudents": "number",
  "totalRevenue": "number"
}
```

---

### GET /api/super-admin/institutions

- **Descrição:** Lista todas as instituições cadastradas.
- **Autenticação:** 🛡️ JWT + role `super_admin`

#### Sucesso — 200 OK

```json
[
  {
    "id": "number",
    "nome": "string",
    "email": "string",
    "status": "string",
    "cidade": "string | null"
  }
]
```

---

### POST /api/super-admin/institutions

- **Descrição:** Cria uma nova instituição manualmente pelo super admin.
- **Autenticação:** 🛡️ JWT + role `super_admin`

#### Request Body

```json
{
  "nome": "string (obrigatório)",
  "email": "string (obrigatório)",
  "telefone": "string (opcional)",
  "cidade": "string (opcional)"
}
```

#### Sucesso — 201 Created

```json
{
  "message": "Instituição criada com sucesso!",
  "institution": { "id": "number", "nome": "string", "email": "string" }
}
```

---

### PUT /api/super-admin/institutions/:id/approve

- **Descrição:** Aprova uma instituição pendente (muda status para `'ativo'`) e cria a conta de usuário da instituição.
- **Autenticação:** 🛡️ JWT + role `super_admin`

#### Parâmetros

- `id` (Path): ID numérico da instituição

#### Sucesso — 200 OK

```json
{
  "message": "Instituição aprovada com sucesso!",
  "institution": { "...campos da instituição..." }
}
```

---

### DELETE /api/super-admin/institutions/:id/reject

- **Descrição:** Rejeita e remove uma instituição pendente.
- **Autenticação:** 🛡️ JWT + role `super_admin`

#### Parâmetros

- `id` (Path): ID numérico da instituição

#### Sucesso — 200 OK

```json
{
  "message": "Instituição rejeitada com sucesso."
}
```

---

### GET /api/super-admin/subscriptions

- **Descrição:** Lista todas as assinaturas da plataforma.
- **Autenticação:** 🛡️ JWT + role `super_admin`

---

### POST /api/super-admin/subscriptions

- **Descrição:** Cria uma assinatura manualmente para uma instituição.
- **Autenticação:** 🛡️ JWT + role `super_admin`

---

### PUT /api/super-admin/subscriptions/:id

- **Descrição:** Atualiza uma assinatura existente.
- **Autenticação:** 🛡️ JWT + role `super_admin`

#### Parâmetros

- `id` (Path): ID numérico da assinatura

---

### DELETE /api/super-admin/subscriptions/:id

- **Descrição:** Remove uma assinatura.
- **Autenticação:** 🛡️ JWT + role `super_admin`

#### Parâmetros

- `id` (Path): ID numérico da assinatura

---

### GET /api/super-admin/saas-plans

- **Descrição:** Lista os planos SaaS disponíveis na plataforma.
- **Autenticação:** 🛡️ JWT + role `super_admin`

---

### PUT /api/super-admin/saas-plans/:id

- **Descrição:** Atualiza um plano SaaS.
- **Autenticação:** 🛡️ JWT + role `super_admin`

#### Parâmetros

- `id` (Path): ID numérico do plano

---

### GET /api/super-admin/solo-teachers

- **Descrição:** Lista todos os professores solo cadastrados.
- **Autenticação:** 🛡️ JWT + role `super_admin`

---

### POST /api/super-admin/solo-teachers

- **Descrição:** Cria um novo professor solo. Role fixado como `'solo_teacher'` no SQL — não pode ser sobrescrito via payload.
- **Autenticação:** 🛡️ JWT + role `super_admin`

#### Request Body

```json
{
  "name": "string (obrigatório)",
  "email": "string (obrigatório)",
  "password": "string (obrigatório)"
}
```

#### Sucesso — 201 Created

```json
{
  "message": "Professor Solo criado com sucesso!",
  "teacher": {
    "id": "number",
    "name": "string",
    "email": "string",
    "role": "solo_teacher",
    "teacher_type": "solo"
  }
}
```

#### Erros Previstos

| Status | Condição |
|---|---|
| 400 | Campos obrigatórios ausentes ou e-mail duplicado |
| 401 | Token ausente ou inválido |
| 403 | Role diferente de `super_admin` |
| 500 | Falha de banco |

---

## Módulo: Cursos (`/api/courses`)

### POST /api/courses/teacher

- **Descrição:** Cria um novo curso pelo professor autenticado.
- **Autenticação:** 🛡️ JWT + role `professor`

#### Request Body

```json
{
  "title": "string (obrigatório)",
  "description": "string",
  "instrument": "string",
  "level": "string",
  "price": "number"
}
```

#### Sucesso — 201 Created

```json
{
  "message": "Curso criado com sucesso!",
  "course": { "id": "number", "title": "string", "...outros campos..." }
}
```

---

### GET /api/courses/teacher

- **Descrição:** Lista todos os cursos criados pelo professor autenticado.
- **Autenticação:** 🛡️ JWT + role `professor`

#### Sucesso — 200 OK

```json
[{ "id": "number", "title": "string", "...outros campos..." }]
```

---

### GET /api/courses/teacher/students

- **Descrição:** Lista todos os alunos matriculados nos cursos do professor autenticado.
- **Autenticação:** 🛡️ JWT + role `professor`

---

### PUT /api/courses/:id

- **Descrição:** Atualiza um curso do professor autenticado.
- **Autenticação:** 🛡️ JWT + role `professor`

#### Parâmetros

- `id` (Path): ID numérico do curso

---

### GET /api/courses/student

- **Descrição:** Lista todos os cursos disponíveis para o aluno.
- **Autenticação:** 🛡️ JWT + role `aluno`

---

### GET /api/courses/enrolled

- **Descrição:** Lista os cursos nos quais o aluno autenticado está matriculado.
- **Autenticação:** 🛡️ JWT + role `aluno`

---

### POST /api/courses/student/enroll

- **Descrição:** Matricula o aluno autenticado em um curso.
- **Autenticação:** 🛡️ JWT + role `aluno`

#### Request Body

```json
{
  "course_id": "number (obrigatório)"
}
```

---

### POST /api/courses/unenroll

- **Descrição:** Cancela a matrícula do aluno em um curso.
- **Autenticação:** 🛡️ JWT + role `aluno`

#### Request Body

```json
{
  "course_id": "number (obrigatório)"
}
```

---

## Módulo: Módulos de Curso (`/api/courses/:courseId/modules`)

> Prefixo completo: `/api/courses/:courseId/modules`

### GET /api/courses/:courseId/modules

- **Descrição:** Retorna todos os módulos de um curso com suas aulas e documentos aninhados.
- **Autenticação:** 🔒 JWT

#### Parâmetros

- `courseId` (Path): ID numérico do curso

#### Sucesso — 200 OK

```json
[
  {
    "id": "number",
    "title": "string",
    "order_index": "number",
    "classes": [
      {
        "id": "number",
        "title": "string",
        "video_url": "string | null",
        "documents": [{ "id": "number", "name": "string", "url": "string" }]
      }
    ]
  }
]
```

---

### POST /api/courses/:courseId/modules

- **Descrição:** Cria um novo módulo em um curso.
- **Autenticação:** 🔒 JWT

#### Request Body

```json
{
  "title": "string (obrigatório)",
  "order_index": "number (opcional, padrão: 0)"
}
```

#### Sucesso — 201 Created

```json
{ "id": "number", "course_id": "number", "title": "string", "order_index": "number" }
```

---

### PUT /api/courses/:courseId/modules/:moduleId

- **Descrição:** Atualiza o título de um módulo.
- **Autenticação:** 🔒 JWT

#### Request Body

```json
{ "title": "string" }
```

---

### DELETE /api/courses/:courseId/modules/:moduleId

- **Descrição:** Remove um módulo e seus dados dependentes.
- **Autenticação:** 🔒 JWT

#### Sucesso — 200 OK

```json
{ "message": "Módulo removido." }
```

---

### POST /api/courses/:courseId/modules/:moduleId/classes

- **Descrição:** Cria uma aula gravada dentro de um módulo.
- **Autenticação:** 🔒 JWT

#### Request Body

```json
{
  "title": "string (obrigatório)",
  "description": "string (opcional)",
  "video_url": "string (opcional)"
}
```

#### Sucesso — 201 Created

```json
{ "id": "number", "module_id": "number", "title": "string", "video_url": "string | null" }
```

---

### PUT /api/courses/:courseId/modules/classes/:classId

- **Descrição:** Atualiza uma aula gravada.
- **Autenticação:** 🔒 JWT

#### Request Body

```json
{
  "title": "string",
  "description": "string",
  "video_url": "string"
}
```

---

### DELETE /api/courses/:courseId/modules/classes/:classId

- **Descrição:** Remove uma aula gravada.
- **Autenticação:** 🔒 JWT

---

### POST /api/courses/:courseId/modules/classes/:classId/documents

- **Descrição:** Adiciona um documento de apoio a uma aula.
- **Autenticação:** 🔒 JWT

#### Request Body

```json
{
  "name": "string (obrigatório)",
  "url": "string (obrigatório)"
}
```

#### Sucesso — 201 Created

```json
{ "id": "number", "class_id": "number", "name": "string", "url": "string" }
```

---

### DELETE /api/courses/:courseId/modules/documents/:documentId

- **Descrição:** Remove um documento de apoio.
- **Autenticação:** 🔒 JWT

---

## Módulo: Aulas (`/api/lessons`)

### POST /api/lessons

- **Descrição:** Cria um registro de aula ao vivo. O `teacher_id` é extraído do token JWT.
- **Autenticação:** 🔒 JWT

#### Request Body

```json
{
  "title": "string",
  "description": "string",
  "instrument": "string",
  "lesson_date": "date (YYYY-MM-DD)"
}
```

#### Sucesso — 201 Created

```json
{
  "message": "Aula criada com sucesso!",
  "lesson": { "id": "number", "...campos da aula..." }
}
```

---

### GET /api/lessons

- **Descrição:** Lista todas as aulas com o nome do professor.
- **Autenticação:** 🔒 JWT

#### Sucesso — 200 OK

```json
[
  {
    "id": "number",
    "title": "string",
    "instrument": "string",
    "lesson_date": "date",
    "teacher_name": "string"
  }
]
```

---

### GET /api/lessons/completed/:teacherId

- **Descrição:** Lista as aulas concluídas do aluno autenticado com um professor específico, excluindo as que já foram avaliadas.
- **Autenticação:** 🔒 JWT

#### Parâmetros

- `teacherId` (Path): ID numérico do professor

#### Sucesso — 200 OK

```json
[{ "id": "number", "title": "string", "lesson_date": "date" }]
```

---

## Módulo: Agendamento (`/api/schedule`)

### POST /api/schedule/availability

- **Descrição:** Adiciona um bloco de disponibilidade semanal para o professor autenticado. Valida conflito de horário.
- **Autenticação:** 🔒 JWT

#### Request Body

```json
{
  "day_of_week": "number (0=Dom, 6=Sab)",
  "start_time": "string (HH:MM)",
  "end_time": "string (HH:MM)"
}
```

#### Sucesso — 201 Created

```json
{
  "id": "number",
  "teacher_id": "number",
  "day_of_week": "number",
  "start_time": "string",
  "end_time": "string"
}
```

#### Erros Previstos

| Status | Condição |
|---|---|
| 400 | Conflito com disponibilidade já cadastrada |
| 401 | Token ausente ou inválido |
| 500 | Falha de banco |

---

### GET /api/schedule/availability/:teacherId

- **Descrição:** Retorna os blocos de disponibilidade de um professor específico.
- **Autenticação:** 🔒 JWT

#### Parâmetros

- `teacherId` (Path): ID numérico do professor

#### Sucesso — 200 OK

```json
[
  { "id": "number", "day_of_week": "number", "start_time": "string", "end_time": "string" }
]
```

---

### DELETE /api/schedule/availability/:id

- **Descrição:** Remove um slot de disponibilidade. Só remove o slot do professor autenticado.
- **Autenticação:** 🔒 JWT

#### Parâmetros

- `id` (Path): ID numérico do slot

#### Sucesso — 200 OK

```json
{ "message": "Horário removido com sucesso." }
```

#### Erros Previstos

| Status | Condição |
|---|---|
| 404 | Slot não encontrado ou não pertence ao professor autenticado |

---

### POST /api/schedule/book

- **Descrição:** Agenda uma aula. O `student_id` é extraído do JWT. Valida double booking.
- **Autenticação:** 🔒 JWT

#### Request Body

```json
{
  "teacher_id": "number (obrigatório)",
  "course_id": "number (obrigatório)",
  "appointment_date": "date (YYYY-MM-DD, obrigatório)",
  "start_time": "string (HH:MM, obrigatório)",
  "end_time": "string (HH:MM, obrigatório)"
}
```

#### Sucesso — 201 Created

```json
{
  "id": "number",
  "student_id": "number",
  "teacher_id": "number",
  "appointment_date": "date",
  "start_time": "string",
  "end_time": "string",
  "status": "confirmed"
}
```

#### Erros Previstos

| Status | Condição |
|---|---|
| 400 | Professor já possui aula agendada no mesmo horário |
| 401 | Token ausente ou inválido |
| 500 | Falha de banco |

---

## Módulo: Pagamentos (`/api/payments`)

### POST /api/payments/checkout

- **Descrição:** Cria uma sessão de checkout no Mercado Pago para assinatura de plano.
- **Autenticação:** 🔒 JWT

#### Request Body

```json
{
  "plan_id": "number (obrigatório)"
}
```

#### Sucesso — 201 Created

```json
{
  "checkout_url": "string (URL de produção)",
  "sandbox_url": "string (URL de sandbox)",
  "preference_id": "string"
}
```

#### Erros Previstos

| Status | Condição |
|---|---|
| 400 | `plan_id` ausente |
| 401 | Token ausente ou inválido |
| 404 | Usuário ou plano não encontrado |
| 500 | Falha de banco ou erro na API do Mercado Pago |

---

### POST /api/payments/webhook

- **Descrição:** Recebe notificações de pagamento do Mercado Pago e atualiza o status da assinatura da instituição. **Rota pública** — não requer JWT (chamada pelo serviço externo).
- **Autenticação:** 🔓 Pública (webhook externo)

#### Request Body (enviado pelo Mercado Pago)

```json
{
  "type": "payment",
  "data": { "id": "string (ID do pagamento no MP)" }
}
```

#### Sucesso — 200

Responde sempre com `200` (incluindo casos de erro processado) para evitar reenvios do Mercado Pago.

#### Mapeamento de Status

| Status MP | Status interno |
|---|---|
| `approved` | `ativo` |
| `pending` | `pendente` |
| `rejected` | `inadimplente` |
| `cancelled` | `cancelado` |

---

### GET /api/payments/institution/summary

- **Descrição:** Retorna o resumo financeiro da instituição autenticada (faturamento do mês atual e repasses pendentes).
- **Autenticação:** 🔒 JWT

#### Sucesso — 200 OK

```json
{
  "currentMonthRevenue": "number",
  "pendingTransfers": "number"
}
```

---

### GET /api/payments/institution/transactions

- **Descrição:** Lista as transações financeiras da instituição autenticada (limite de 100 registros, ordem decrescente).
- **Autenticação:** 🔒 JWT

#### Query Params (opcionais)

- `startDate` (string, YYYY-MM-DD): Filtra a partir desta data
- `endDate` (string, YYYY-MM-DD): Filtra até esta data
- `status` (string): Filtra por status (`paid`, `pending`, etc.) — ignorado se `'all'`

#### Sucesso — 200 OK

```json
[{ "...todos os campos de institution_transactions..." }]
```

---

## Módulo: Avaliações (`/api/reviews`)

### POST /api/reviews

- **Descrição:** Cria uma avaliação de aula. Só é possível avaliar aulas com `status = 'concluida'` que pertençam ao aluno. Recalcula automaticamente a média do professor.
- **Autenticação:** 🔒 JWT

#### Request Body

```json
{
  "lesson_id": "number (obrigatório)",
  "rating": "number (1–5, obrigatório)",
  "comment": "string (opcional)"
}
```

#### Sucesso — 201 Created

```json
{
  "message": "Avaliação enviada com sucesso!",
  "review": {
    "id": "number",
    "student_id": "number",
    "teacher_id": "number",
    "lesson_id": "number",
    "rating": "number",
    "comment": "string | null"
  }
}
```

#### Erros Previstos

| Status | Condição |
|---|---|
| 400 | `lesson_id` ou `rating` ausentes |
| 400 | `rating` fora do intervalo 1–5 |
| 400 | Aula com status diferente de `'concluida'` |
| 401 | Token ausente ou inválido |
| 403 | Aula não pertence ao aluno autenticado |
| 404 | Aula não encontrada |
| 409 | Avaliação duplicada (aluno já avaliou esta aula) |
| 500 | Falha de banco |

---

### GET /api/reviews/teacher/:teacherId

- **Descrição:** Retorna as avaliações públicas de um professor, a média atual e o total de avaliações.
- **Autenticação:** 🔓 Pública

#### Parâmetros

- `teacherId` (Path): ID numérico do professor

#### Sucesso — 200 OK

```json
{
  "average_rating": "number | null",
  "total_reviews": "number",
  "reviews": [
    {
      "id": "number",
      "rating": "number",
      "comment": "string | null",
      "created_at": "timestamp",
      "student_name": "string",
      "student_nickname": "string | null"
    }
  ]
}
```

---

## Módulo: Mensagens (`/api/messages`)

### POST /api/messages

- **Descrição:** Envia uma mensagem para outro usuário. Notifica o destinatário em tempo real via Socket.io se estiver online.
- **Autenticação:** 🔒 JWT

#### Request Body

```json
{
  "receiver_id": "number (obrigatório)",
  "message": "string (obrigatório)"
}
```

#### Sucesso — 201 Created

```json
{
  "id": "number",
  "sender_id": "number",
  "receiver_id": "number",
  "message": "string",
  "is_read": "false",
  "time": "HH:MM",
  "isMine": "true"
}
```

---

### GET /api/messages/unread-counts

- **Descrição:** Retorna a contagem de mensagens não lidas por remetente para o usuário autenticado.
- **Autenticação:** 🔒 JWT

#### Sucesso — 200 OK

```json
[{ "sender_id": "number", "unread_count": "number" }]
```

---

### GET /api/messages/:otherUserId

- **Descrição:** Retorna o histórico de mensagens entre o usuário autenticado e outro usuário. Marca as mensagens recebidas como lidas automaticamente.
- **Autenticação:** 🔒 JWT

#### Parâmetros

- `otherUserId` (Path): ID numérico do outro participante do chat

#### Sucesso — 200 OK

```json
[
  {
    "id": "number",
    "sender_id": "number",
    "receiver_id": "number",
    "message": "string",
    "is_read": "boolean",
    "time": "HH:MM",
    "isMine": "boolean"
  }
]
```

---

## Módulo: Notificações (`/api/notifications`)

### GET /api/notifications/unread

- **Descrição:** Retorna as 20 notificações mais recentes não lidas do usuário autenticado.
- **Autenticação:** 🔒 JWT

#### Sucesso — 200 OK

```json
[{ "id": "number", "...campos da tabela notifications..." }]
```

---

### PUT /api/notifications/:id/read

- **Descrição:** Marca uma notificação como lida. Só atualiza notificações do próprio usuário.
- **Autenticação:** 🔒 JWT

#### Parâmetros

- `id` (Path): ID numérico da notificação

#### Sucesso — 200 OK

```json
{ "message": "Notificação marcada como lida com sucesso." }
```

#### Erros Previstos

| Status | Condição |
|---|---|
| 404 | Notificação não encontrada ou não pertence ao usuário autenticado |

---

## Módulo: Exercícios (`/api/exercises`)

### POST /api/exercises

- **Descrição:** Cria um exercício vinculado a um curso.
- **Autenticação:** 🔒 JWT

#### Request Body

```json
{
  "course_id": "number (obrigatório)",
  "title": "string (obrigatório)",
  "type": "string (opcional, padrão: 'Prática')",
  "description": "string (opcional)",
  "order_index": "number (opcional, padrão: 0)"
}
```

#### Sucesso — 201 Created

```json
{
  "message": "Exercício criado com sucesso!",
  "exercise": { "id": "number", "course_id": "number", "title": "string", "type": "string" }
}
```

---

### GET /api/exercises/course/:courseId

- **Descrição:** Lista os exercícios de um curso específico, ordenados por `order_index`.
- **Autenticação:** 🔒 JWT

#### Parâmetros

- `courseId` (Path): ID numérico do curso

#### Sucesso — 200 OK

```json
[{ "id": "number", "title": "string", "type": "string", "order_index": "number" }]
```

---

## Módulo: Upload (`/api/upload`)

### POST /api/upload

- **Descrição:** Faz upload de um arquivo para o Supabase Storage (bucket `sonatta-storage`). Retorna a URL pública do arquivo. Aceita `multipart/form-data`.
- **Autenticação:** 🔒 JWT

#### Request Body (multipart/form-data)

- `file`: arquivo binário (qualquer tipo suportado pelo bucket)

#### Sucesso — 200 OK

```json
{
  "message": "Upload concluído!",
  "url": "string (URL pública do Supabase Storage)"
}
```

#### Erros Previstos

| Status | Condição |
|---|---|
| 400 | Nenhum arquivo recebido |
| 401 | Token ausente ou inválido |
| 500 | Falha no upload ao Supabase ou erro interno |

---

## Módulo: Relatórios (`/api/reports`)

> Todas as rotas exigem JWT + `role: 'super_admin'`.

### GET /api/reports/revenue

- **Descrição:** Relatório consolidado de receita da plataforma.
- **Autenticação:** 🛡️ JWT + role `super_admin`

---

### GET /api/reports/teachers

- **Descrição:** Relatório de performance dos professores.
- **Autenticação:** 🛡️ JWT + role `super_admin`

---

### GET /api/reports/export/invoice

- **Descrição:** Gera e faz download de um PDF com a fatura da plataforma.
- **Autenticação:** 🛡️ JWT + role `super_admin`

---

### GET /api/reports/export/students

- **Descrição:** Gera e faz download de uma planilha CSV com dados dos alunos.
- **Autenticação:** 🛡️ JWT + role `super_admin`

---

## Módulo: Admin Legado (`/api/admin`)

### GET /api/admin/stats

- **Descrição:** Retorna contagens globais de alunos, professores e aulas. **Sem autenticação** — rota legada.
- **Autenticação:** 🔓 Pública

#### Sucesso — 200 OK

```json
{
  "totalStudents": "number",
  "totalTeachers": "number",
  "totalLessons": "number"
}
```

---

## WebSocket — Eventos em Tempo Real

O servidor utiliza **Socket.io** para comunicação bidirecional em tempo real.

| Evento (Client → Server) | Payload | Descrição |
|---|---|---|
| `user_connected` | `userId: number` | Registra o usuário como online |
| `check_online` | `userId: number` | Consulta se um usuário está online |
| `typing` | `{ senderId, receiverId }` | Notifica que o usuário está digitando |
| `stop_typing` | `{ senderId, receiverId }` | Notifica que o usuário parou de digitar |
| `leave_room` | `userId` | Remove o usuário da sala Socket |

| Evento (Server → Client) | Payload | Descrição |
|---|---|---|
| `user_status_changed` | `{ userId, status: 'online' | 'offline' }` | Broadcast de status de conexão |
| `online_status` | `{ userId, isOnline: boolean }` | Resposta ao `check_online` |
| `receive_message` | `{ ...mensagem, isMine: false }` | Entrega de nova mensagem ao destinatário |
| `message_notification` | `{ sender_id, message }` | Notificação de nova mensagem |
| `user_typing` | `{ senderId }` | Notificação de digitação ao destinatário |
| `user_stop_typing` | `{ senderId }` | Fim de digitação ao destinatário |
| `new_appointment` | `{ title, message, data }` | Notificação de novo agendamento ao professor |