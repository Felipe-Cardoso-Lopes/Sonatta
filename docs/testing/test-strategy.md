# Estratégia de Qualidade e Testes - Projeto Sonatta

> [!IMPORTANT]
> Este documento centraliza a estratégia, priorização, governança de qualidade e análise de riscos do projeto Sonatta. O objetivo é maximizar a redução de riscos de negócio e segurança com o menor esforço de implementação possível.

## 1. Estado Atual da Qualidade
A auditoria de cobertura revelou que a base fundacional já foi iniciada:
- **Testes Backend (E2E / Integração):** Cobrem parcialmente a autenticação (`authMiddleware`, `userLogin`, `userRegister`), perfis institucionais e validação inicial de cursos e pagamentos.
- **Testes E2E (Frontend/Playwright):** Cobrem login, registro de instituições, aprovação de super administradores e gestão básica de perfis.
- **Lacunas Identificadas:** Apesar da base existente, a validação transversal de RBAC (Role-Based Access Control) e o isolamento multi-tenant carecem de cobertura abrangente em módulos pedagógicos e financeiros avançados.

## 2. Análise de Riscos

O Sonatta opera em um modelo SaaS Multi-tenant (Instituições isoladas) com perfis sensíveis (Super Admin, Admin/Gestor, Professor, Aluno). A análise de riscos foca nestas áreas sensíveis.

> [!WARNING]
> **Risco de Fuga de Dados (Multi-tenant):** Falha no isolamento de queries pode expor dados financeiros ou dados de alunos de uma instituição para outra.
> **Impacto de Segurança:** Vazamento de PII (Personally Identifiable Information) ferindo a LGPD.

* **Riscos Críticos de Segurança e RBAC:**
  * Escalada de privilégios (Ex: Aluno acessando rotas de Professor ou Gestor).
  * Acesso indevido de Super Admin ou falha na geração/validação de JWT.
* **Riscos de Negócio e Produção:**
  * Falhas no módulo Financeiro/Pagamentos (impede faturamento SaaS).
  * Indisponibilidade nos módulos de Curso e Trilhas (Core do valor entregue aos alunos).

## 3. Matriz de Priorização

A priorização segue a matriz P0-P3, cruzando o Impacto de Negócio, Impacto de Segurança, Risco em Produção, Frequência de Uso, Complexidade e Manutenibilidade.

| Módulo/Domínio | Nível | Frequência de Uso | Impacto (Negócio/Segurança) | Risco Produção | Complexidade |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Autenticação, JWT e RBAC (`auth`)** | **P0** | Alta | Crítico / Crítico | Alto | Média |
| **Multi-Tenancy e Instituição (`instituicao`)** | **P0** | Alta | Crítico / Crítico | Alto | Alta |
| **Pagamentos e Faturamento (`payment`)** | **P0** | Média | Crítico / Alto | Alto | Alta |
| **Super Admin e Aprovações (`superAdmin`)** | **P0** | Baixa | Alto / Crítico | Alto | Média |
| **Core Pedagógico (`course`, `lesson`)** | **P1** | Altíssima | Alto / Baixo | Médio | Alta |
| **Gestão de Utilizadores (`user`, `admin`)** | **P1** | Alta | Médio / Alto | Médio | Média |
| **Agendamento e Calendário (`schedule`)** | **P1** | Alta | Alto / Baixo | Médio | Alta |
| **Relatórios e Dashboards (`report`)** | **P2** | Média | Alto / Baixo | Baixo | Média |
| **Gestão de Uploads/Mídias (`upload`)** | **P2** | Média | Baixo / Médio | Médio | Baixo |
| **Mensageria e Suporte (`message`)** | **P2** | Alta | Médio / Baixo | Baixo | Média |
| **Notificações (`notification`)** | **P3** | Alta | Baixo / Baixo | Baixo | Baixo |
| **Avaliações/Reviews (`review`)** | **P3** | Média | Baixo / Baixo | Baixo | Baixo |

## 4. Backlog de Testes (Testing Backlog)

> [!TIP]
> O foco do Backlog é ampliar a cobertura de Testes de Integração no backend (isolando lógicas de banco via mocks ou transações de teste) e expandir os fluxos críticos (Happy/Unhappy paths) no Playwright (E2E Frontend).

### Sprint 1: Blindagem de Segurança e Finanças (P0)
- `[ ]` **Auth/RBAC:** Testar exaustivamente todas as rotas protegidas injetando tokens de Roles inválidas (403 Forbidden).
- `[ ]` **Instituições:** Garantir que o `$1` ou `$2` nas queries de BD limitam o retorno estritamente à `institution_id` do usuário logado.
- `[ ]` **Pagamentos:** Testar fluxos completos do `paymentController`, incluindo falhas de gateway e estornos, mockando provedor de pagamentos.
- `[ ]` **Super Admin:** Validar endpoints de aprovação e bloqueio de instituições, impedindo acesso de Admins locais.

### Sprint 2: Core Business e Pedagógico (P1)
- `[ ]` **Gestão de Cursos:** Implementar testes de criação, edição e exclusão de cursos garantindo validação de propriedades (título, descrição, carga horária).
- `[ ]` **Aulas/Módulos:** Verificar dependências estruturais (Ex: não permitir deletar um módulo que contém aulas sem tratamento adequado ou cascade).
- `[ ]` **Calendário/Agendamento:** Testar sobreposição de horários e limites de vagas nas aulas síncronas.
- `[ ]` **Usuários:** Fluxo de troca de senha, edição de perfil e inativação de conta de alunos pelos gestores.

### Sprint 3: Funcionalidades Secundárias (P2 e P3)
- `[ ]` **Relatórios:** Testes para agregação financeira e de retenção de alunos garantindo que o volume de dados não cause Timeout (Teste de Carga leve/Unitário).
- `[ ]` **Uploads:** Proteção contra envio de arquivos maliciosos (Extensões não permitidas) ou arquivos maiores que o limite (`400 Bad Request`).
- `[ ]` **Mensageria/Notificações:** Validar dispatch correto das mensagens no WebSocket/Polling e persistência de histórico de chat.

## 5. Roadmap de Cobertura (Coverage Roadmap)

O processo de governança de qualidade não requer alcançar 100% de *Line Coverage*, mas sim **100% de Cobertura de Riscos e Fluxos Críticos**.

* **Fase 1 (Mês 3 - Atual):**
  * Alcançar 90%+ de cobertura de Branches em *Controllers* P0 (`auth`, `instituicao`, `payment`, `superAdmin`).
  * Mapeamento E2E de "Caminho Feliz" dos fluxos: Criar conta Instituição -> Login -> Criar Curso -> Cobrar Assinatura.
* **Fase 2 (Mês 4):**
  * Integração de Testes Unitários de regras de negócio complexas isoladas.
  * Alcançar 80%+ em *Controllers* P1.
  * Expansão dos cenários de exceção E2E (Ex: Cartão recusado, Acesso negado).
* **Fase 3 (Futuro):**
  * Implementação contínua de CI/CD bloqueando Pull Requests que quebrem os contratos estipulados no `API_CONTRACTS.md` e regras de banco do `SCHEMA.md`.
  * Cobertura de P2 e P3.

---

> [!CAUTION]
> **Restrição Técnica e de Continuidade:** Nenhuma nova feature P0 ou P1 deverá ser promovida para *Main* sem que as camadas descritas na Fase 1 estejam resolvidas. Se os testes falharem, deve-se revisar as falhas nos logs do Watcher/CI e aplicar a correção antes do merge.
