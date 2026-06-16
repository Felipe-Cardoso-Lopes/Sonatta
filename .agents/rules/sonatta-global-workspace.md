---
trigger: always_on
---

Este é o projeto Sonatta, um monorepo dividido em Frontend (React/Vite) e Backend (Node.js/Express).

Agentes operando no frontend estão restritos à pasta ./client.

Agentes operando no backend estão restritos à pasta ./server.

É estritamente obrigatório ler o arquivo API_CONTRACTS.md e o Documento de visão atualizado antes de criar ou modificar endpoints ou componentes. Nunca altere o formato JSON definido nos contratos.


1. Padrões de Qualidade e Clean Code

Exerça rigor analítico: todo código gerado deve respeitar o Princípio de Responsabilidade Única (SRP). É estritamente proibido introduzir código morto, dependências não utilizadas ou deixar console.log() perdidos em código de produção. Funções devem ser curtas, descritivas e tipadas quando possível.

2. Tratamento de Erros (Backend)

No diretório ./server, qualquer operação de banco de dados ou regra de negócio deve ser envolvida em blocos try/catch. Em caso de falha, o agente deve registrar o erro internamente e retornar ao cliente um status HTTP preciso (400, 401, 403, 404, 500) com um JSON descritivo ({ message: '...' }). Nunca exponha a stack trace crua na resposta da API.

3. Segurança e Banco de Dados

Todas as interações com o Supabase devem utilizar queries parametrizadas (ex: $1, $2) através do pacote pg para erradicar riscos de SQL Injection. O controle de acesso por cargos (roles) deve ser a primeira instrução validada dentro dos controllers. Consulte sempre o SCHEMA.md para garantir que as queries SQL utilizem os nomes exatos das colunas do Supabase.

4. Padrões de Interface (Frontend)

No diretório ./client, construa interfaces orientadas a alta performance. Utilize classes utilitárias do Tailwind CSS de forma coesa. Qualquer submissão de formulário ou mutação de dados deve fornecer feedback visual instantâneo e não obstrutivo utilizando a biblioteca react-hot-toast.

5. Ciclo de Resolução Baseado em Testes

O agente não deve considerar uma alteração como finalizada até ter certeza de sua estabilidade. Se o terminal do Watcher (Vitest ou Jest) apontar falhas, o agente deve analisar a stack trace de forma autônoma, aplicar a correção no escopo isolado e reavaliar. A entrega deve ser cirúrgica e passar em todos os testes.

6. Análise de testes

Toda nova funcionalidade deve ser analisada quanto à necessidade de testes unitários, integração ou E2E.

Ao implementar código novo, a IA deve informar:

* quais testes precisam ser criados;
* quais testes existentes devem ser atualizados;
* quais cenários de falha devem ser cobertos.

Não gerar funcionalidades sem considerar estratégia de testes.