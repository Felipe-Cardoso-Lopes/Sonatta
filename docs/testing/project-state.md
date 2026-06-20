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

17

### Testes

205 passando

### Falhas

0

## Sprint Atual

Security Sprint

### Concluído

* Super Admin Security (Cycle 1)
* Institution Security (Cycle 2)
* Teacher + Student Security (Cycle 3)
* Payment Security (Cycle 4)

### Em andamento

* Finalização do Security Sprint

## Próximos Passos

1. Payment Controller Security
2. Playwright E2E
