# Banco de Dados - Schema Sonatta (Supabase / PostgreSQL)

Este documento atua como a fonte da verdade para a estrutura do banco de dados relacional do Sonatta. 
**Regra para Agentes de IA:** Todas as queries SQL devem utilizar estritamente os nomes de tabelas e colunas definidos aqui. Nunca presuma a existência de uma coluna que não esteja documentada.

---

## [TEMPLATE] Estrutura Padrão para Novas Tabelas
*Nota para Agentes de IA: Utilize este formato para catalogar novas tabelas e seus relacionamentos.*

### Tabela: `nome_da_tabela`
- **Descrição:** [Objetivo claro desta tabela no sistema]

| Coluna | Tipo (PostgreSQL) | Restrições (Constraints) | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único. |
| `campo_exemplo` | VARCHAR(255) | NOT NULL | Breve descrição da utilidade. |
| `criado_em` | TIMESTAMP | DEFAULT NOW() | Data de criação do registro. |

**Relacionamentos (Foreign Keys)**
- `coluna_fk` -> Referencia `outra_tabela(id)` (ON DELETE CASCADE)

**Índices (Indexes)**
- Index em `campo_exemplo` para otimizar buscas.

---

## 1. Tabelas de Entidades Principais

### Tabela: `instituicoes`
- **Descrição:** Armazena os dados centrais e o perfil público das instituições educacionais cadastradas na plataforma.

| Coluna | Tipo (PostgreSQL) | Restrições (Constraints) | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único da instituição. |
| `nome` | VARCHAR(255) | NOT NULL | Nome oficial ou razão social. |
| `descricao_longa` | TEXT | NULL | Texto descritivo sobre a metodologia e história. |
| `logo_url` | VARCHAR(500) | NULL | URL da imagem do logotipo. |
| `banner_url` | VARCHAR(500) | NULL | URL da imagem de capa/banner do perfil. |
| `website_url` | VARCHAR(255) | NULL | URL do site oficial da instituição. |
| `instagram_url` | VARCHAR(255) | NULL | Link para o perfil do Instagram. |
| `linkedin_url` | VARCHAR(255) | NULL | Link para o perfil do LinkedIn. |
| `facebook_url` | VARCHAR(255) | NULL | Link para a página do Facebook. |
| `criado_em` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Data e hora de registro no sistema. |
| `atualizado_em` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Data da última alteração no perfil. |

**Relacionamentos (Foreign Keys)**
- *(Sem chaves estrangeiras nesta entidade base)*

---

## 2. Tabelas de Relacionamento
*(Adicione aqui tabelas associativas, como `instituicao_professores` ou `alunos_turmas`, utilizando o template acima)*