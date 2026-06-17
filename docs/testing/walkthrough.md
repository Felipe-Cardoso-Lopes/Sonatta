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

## Ambiente de Testes

Melhorias:

* Criação do jest.setup.js
* Criação do jest.config.js
* Remoção de logs sensíveis
* Controle refinado de console.error