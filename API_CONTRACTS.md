# Contratos de API - Sonatta

Este documento define a estrutura estrita de comunicação entre o Frontend (`./client`) e o Backend (`./server`). Agentes de IA são estritamente obrigados a seguir os formatos JSON e métodos HTTP definidos aqui. 

**Regra Operacional:** Nenhuma rota ou requisição deve ser implementada no código sem antes ter sua estrutura catalogada e aprovada neste documento.

## Configurações Globais
- **Base URL Backend:** `http://localhost:5000` (ambiente local)
- **Autenticação:** O cabeçalho `Authorization: Bearer <token>` é obrigatório para rotas protegidas via JWT.

---

## [TEMPLATE] Estrutura Padrão para Novos Endpoints
*Nota para Agentes de IA: Copie a estrutura abaixo e preencha com dados precisos ao documentar uma nova funcionalidade.*

### [Módulo/Entidade] - [Nome da Ação]
- **Descrição:** [Análise descritiva e objetiva do objetivo da rota]
- **Método:** `[GET | POST | PUT | PATCH | DELETE]`
- **Rota:** `/api/[recurso]/[caminho_opcional]`
- **Autenticação:** [Ex: Não requerida | Requer token JWT | Requer role: 'super_admin']

#### Parâmetros (Path / Query)
*Remova esta seção se não houver parâmetros.*
- `[nome_do_parametro]` (Path/Query): [Tipo de dado e descrição do objetivo]

#### Request Body (application/json)
*Remova esta seção se o método não exigir envio de corpo (ex: GET).*
```json
{
  "campo_obrigatorio": "tipo_de_dado",
  "campo_opcional": "tipo_de_dado"
}
```

### Respostas Esperadas (Responses)
#### Sucesso ([Código HTTP - ex: 200 OK | 201 Created])

```json
{
  "message": "Mensagem padronizada de sucesso",
  "data": {
    "id": "uuid",
    "exemplo": "valor"
  }
}
```

#### Mapeamento de Erros Previstos

- **400 Bad Request:** [Descrever o critério de validação que aciona este erro. Ex: Campos obrigatórios ausentes].

- **401 Unauthorized:** Token ausente, jwt malformed ou expirado.

- **403 Forbidden:** O usuário autenticado não possui a role exigida para a ação.

- **404 Not Found:** [Descrever qual entidade não foi encontrada no banco de dados].

- **500 Internal Server Error:** Erro genérico de execução ou falha no banco de dados.


## Módulo de Instituições
(Adicione as rotas referentes às instituições aqui, utilizando o template acima)

## Módulo de Professores
(Adicione as rotas referentes aos professores aqui, utilizando o template acima)

## Módulo de Alunos
(Adicione as rotas referentes aos alunos aqui, utilizando o template acima)