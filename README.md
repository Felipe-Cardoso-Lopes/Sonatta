# 🎶 Sonatta

**A revolução no ensino musical potencializada por Inteligência Artificial.**

O **Sonatta** é uma plataforma educacional de ponta desenvolvida para transformar a forma como as pessoas aprendem e ensinam música. Projetado sob o modelo SaaS (*Software as a Service*), o sistema permite que instituições de ensino musical gerenciem suas operações de forma independente, profissional e escalável.

---

## 🚀 Modernização e Diferenciais
Recentemente, o projeto passou por uma refatoração focada em competitividade e experiência do usuário (UX):
* **Arquitetura Multi-Tenancy:** Preparado para suportar múltiplas escolas com gestões isoladas.
* **Onboarding Moderno:** Substituição de formulários estáticos por um modal de seleção de tags interativo para definição de perfil musical.
* **Responsividade Nativa:** Interface 100% adaptada para smartphones, tablets e desktops, garantindo aprendizado em qualquer lugar.

---

## ✨ Funcionalidades do Produto

### 🏫 Painel da Instituição (Gestão da Escola)
*Nível de acesso master destinado aos proprietários e gestores das escolas parceiras.*
* **Gestão Administrativa:** Controle total sobre o corpo docente, turmas e matrículas.
* **Saúde Financeira:** Monitoramento de faturamento, relatórios de receitas e gestão de mensalidades.
* **Configurações da Unidade:** Customização de métricas e controle de acessos da instituição.

### 🧑‍🏫 Painel do Professor
* **Gestão Pedagógica:** Ferramentas para criação e organização de cursos, módulos e materiais didáticos.
* **Interação em Tempo Real:** Canal de comunicação direta e chat com os alunos.
* **Acompanhamento:** Visão geral do progresso dos estudantes e feedbacks de atividades.

### 🎓 Área do Aluno
* **Trilhas de Aprendizado:** Dashboard intuitivo com acesso rápido às aulas e histórico.
* **Perfil Personalizado:** Sistema de tags (instrumentos e gêneros) que adapta a experiência às preferências do músico.
* **Ambiente de Prática:** Espaço dedicado para exercícios e evolução técnica.

---

## 🛠️ Informações Técnicas e Autoria

### 🔐 Gestão do Ecossistema (Uso Exclusivo dos Autores)
Para garantir a sustentação e o suporte de alto nível, o grupo de desenvolvimento dispõe de uma camada de **Super Administração** interna (não disponível para clientes finais), que permite:
* Manutenção da infraestrutura e monitoramento global de estabilidade.
* Gestão de licenciamento e ativação de novas instituições.
* Suporte técnico avançado e governança de dados.

### Stack Tecnológica
* **Frontend:** React 19, Vite, Tailwind CSS.
* **Backend:** Node.js, Express, PostgreSQL.
* **Segurança:** Autenticação via JWT com controle de acesso baseado em funções (RBAC).
* **Ambiente:** Configuração centralizada via variáveis de ambiente (`.env`).

---

## 🗺️ Roadmap de Evolução (Priorizado via Matriz GUT)

1.  **Integração de Dados (G:5 U:5 T:5):** Finalização da conexão de todos os dashboards com dados reais do banco de dados.
2.  **Módulo de IA Musical (G:5 U:2 T:3):** Implementação de análise de áudio para feedback de afinação e ritmo em tempo real.
3.  **Gamificação (G:3 U:2 T:2):** Sistema de conquistas, badges e ranking para engajamento dos alunos.

---

## 📦 Como Executar o Projeto

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/sonatta.git](https://github.com/seu-usuario/sonatta.git)
    ```

2.  **Configuração do Backend:**
    ```bash
    cd server
    npm install
    # Configure o seu .env com as credenciais do Postgres e JWT_SECRET
    npm run dev
    ```

3.  **Configuração do Frontend:**
    ```bash
    cd client
    npm install
    # Crie um arquivo .env com VITE_API_URL=http://localhost:5000
    npm run dev
    ```

---

## 👥 Autores
Projeto Integrador desenvolvido por alunos do **Centro Universitário de Brasília (CEUB)**.
*Todos os direitos reservados.*
