# 🎶 Sonatta

O **Sonatta** é uma plataforma de gestão e aprendizado musical que conecta alunos, professores particulares e instituições de ensino. O sistema centraliza a rotina educacional, oferecendo ferramentas para agendamento de aulas, acompanhamento de progresso, gestão financeira e comunicação direta.

---

## 🚀 Tecnologias Utilizadas

**Frontend:**
- React (com Vite)
- Tailwind CSS
- React Router DOM
- Axios
- Socket.io Client

**Backend:**
- Node.js com Express
- PostgreSQL (via Supabase)
- Socket.io (Comunicação em tempo real)
- Supabase Storage (Hospedagem de imagens e arquivos)
- Multer (Gerenciamento de uploads)
- Mercado Pago (Integração de pagamentos)
- JWT (Autenticação e controle de acesso)

**Testes e CI/CD:**
- Jest & Supertest (Testes unitários e de integração no backend)
- Playwright (Testes E2E)
- GitHub Actions (Pipelines automatizados)

---

## 👥 Arquitetura de Perfis (RBAC)

O Sonatta opera com controle de acesso baseado em papéis:

1. **Aluno:** Acesso a aulas, práticas, chat com professores e notificações.
2. **Professor Solo:** Gestão de alunos, agenda, upload de materiais didáticos e vitrine profissional.
3. **Instituição:** Gerenciamento de múltiplos professores e alunos, visão financeira e relatórios.
4. **Super Admin:** Torre de controle global, gestão de assinaturas SaaS e cadastro de instituições parceiras.

---

## 🛠️ Funcionalidades Principais

- **Autenticação Segura:** Login, registro e proteção de rotas via JWT com RBAC.
- **Chat em Tempo Real:** Comunicação direta entre alunos e professores via Socket.io.
- **Sistema de Notificações:** Alertas em tempo real integrados à barra lateral.
- **Agendamento de Aulas:** Sistema de reservas com validação de conflitos de horário.
- **Sistema de Avaliações:** Alunos avaliam professores após aulas concluídas.
- **Gestão de Arquivos:** Upload de fotos de perfil e partituras com drag and drop.
- **Vitrine do Professor Solo:** Página pública com iframes de YouTube e Spotify.
- **Gestão de Escolas:** Fluxo completo de cadastro e aprovação de instituições parceiras.
- **Integração de Pagamentos:** Checkout via Mercado Pago com webhook de confirmação.

---

## ⚙️ Como Executar o Projeto Localmente

### Pré-requisitos
- Node.js v20 ou superior
- Conta ativa no Supabase

### 1. Backend

```bash
cd server
npm install
```

Crie o arquivo `server/.env`:

```env
PORT=5000
DATABASE_URL=sua_string_de_conexao_postgresql
JWT_SECRET=seu_segredo_jwt
NODE_ENV=development
```

Inicie o servidor:

```bash
npm run dev
```

### 2. Frontend

```bash
cd client
npm install
```

Crie o arquivo `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Inicie a aplicação:

```bash
npm run dev
```

---

## 🧪 Testes Automatizados

**Backend (Jest):**
```bash
cd server
npm test
```

**E2E (Playwright):**
```bash
cd client
npx playwright test
```

---

## 👥 Autores

Projeto Integrador desenvolvido pelos alunos Felipe Cardoso, Kayo Muller, Guilherme Barros e João Roberto do **Centro Universitário de Brasília (CEUB)**.

*Todos os direitos reservados.*
