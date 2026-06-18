# Company Management

Aplicação frontend em Vue 3 para gerenciamento de empresas e usuários, desenvolvida como teste técnico para simular um cenário real de backoffice.

## Stack

- Vue 3
- Composition API
- Fetch
- Vue Router

## Funcionalidades

- Listagem de empresas
- Paginação
- Loading state
- Tratamento de erro da API
- Cadastro de empresa
- Edição de empresa
- Exclusão de empresa
- Detalhes da empresa
- Listagem de usuários vinculados
- Cadastro de usuário
- Remoção de usuário
- Validação de CNPJ

## Como rodar

### Instalar dependências

```bash
npm install
```

### Executar em ambiente de desenvolvimento

```bash
npm run dev
```

## Observações

- Os dados iniciais são carregados via `fetch` a partir de um JSON público em `public/mock/companies.json`.
- O CRUD é mantido em memória para simular uma API fake durante a navegação.
- O formulário de empresa possui validação de CNPJ e bloqueio de duplicidade.

## Estrutura principal

- `src/pages`: páginas da aplicação
- `src/services`: camada de acesso aos dados
- `src/utils`: utilitários e validações
- `public/mock`: dados iniciais em JSON
