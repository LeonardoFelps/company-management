# Company Management

Aplicação frontend em Vue 3 para gerenciamento de empresas e usuários, desenvolvida como teste técnico para simular um cenário real de backoffice.

## Stack

- Vue 3
- Composition API
- Fetch
- Vue Router

## Funcionalidades

- Listagem de empresas
- Filtro por nome, CNPJ e status
- Paginação na listagem
- Exibição e ocultação de CNPJ por card
- Cadastro de empresa
- Edição de empresa
- Exclusão de empresa com confirmação
- Detalhes da empresa
- Listagem de usuários vinculados
- Filtro de usuários
- Paginação de usuários
- Cadastro de usuário
- Remoção de usuário
- Validação de CNPJ
- Tratamento de erros
- Feedback de carregamento e sucesso

## Como rodar

### Instalar dependências

```bash
npm install
```

### Executar em desenvolvimento

```bash
npm run dev
```

### Gerar build de produção

```bash
npm run build
```

### Pré-visualizar o build

```bash
npm run preview
```

## Estrutura principal

- `src/pages`: telas da aplicação
- `src/services`: camada de acesso aos dados fake
- `src/utils`: utilitários e validações
- `public/mock`: dados iniciais em JSON

## Observações

- Os dados iniciais são carregados via `fetch` a partir de `public/mock/companies.json`.
- O CRUD é mantido em memória para simular uma API fake durante a navegação.
- O formulário de empresa possui validação de CNPJ e bloqueio de duplicidade.
- As telas foram construídas com Vue 3 e Composition API, sem dependência de backend real.
