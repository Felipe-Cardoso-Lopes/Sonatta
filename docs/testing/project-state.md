# Estado Atual do Projeto Sonatta

## Objetivo

Plataforma SaaS para gestão de escolas de música.

## Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express

### Banco de Dados

* PostgreSQL
* Supabase

## Ambiente de Testes

### Backend

* Jest
* Supertest

### Frontend

* Playwright (planejado)
* Vitest (planejado)

## Cobertura Atual

### Controllers Cobertos

* Course Controller
* Super Admin Controller
* Auth Controller (login)
* User Security (complete/:id, preferences, admin/stats)
* Institution Security

### Segurança

* JWT (sem fallback inseguro)
* RBAC (checkRole)
* IDOR (ownership guards)
* Multi-Tenant
* Proteção de Role Escalation
* Rotas públicas protegidas

## Estado Atual

### Test Suites

15

### Testes

170 passando

### Falhas

0

## Sprint Atual

Security Sprint

### Concluído

* Super Admin Security (Cycle 1)
* Auth Controller — login (Cycle 3A)
* User/Admin Public Routes — IDOR + auth bypass (Cycle 3B)
* Institution Security

### Em andamento

* Auth Controller — send-code, verify-code (Cycle 3C)

## Próximos Passos

1. Auth Controller — send-code / verify-code
2. Teacher Controller
3. Student Controller
4. Payment Controller
5. Playwright E2E