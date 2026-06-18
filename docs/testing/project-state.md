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

16

### Testes

188 passando

### Falhas

0

## Sprint Atual

Security Sprint

### Concluído

* Super Admin Security (Cycle 1)
* Auth Controller — login (Cycle 3A)
* User/Admin Public Routes — IDOR + auth bypass (Cycle 3B)
* Auth Controller — send-code, verify-code, register-institution (Cycle 3C)
* Institution Security

### Em andamento

* Finalização do Security Sprint

## Próximos Passos

1. Teacher Controller
2. Student Controller
3. Payment Controller
4. Playwright E2E