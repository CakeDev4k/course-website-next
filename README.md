# Rocketseat API - Desafio Node.js

Este projeto é uma API RESTful desenvolvida com Fastify, Drizzle ORM e PostgreSQL, criada como desafio para o curso da Rocketseat.

## Tecnologias Utilizadas
- [Fastify](https://www.fastify.io/) - Framework web rápido para Node.js
- [Drizzle ORM](https://orm.drizzle.team/) - ORM moderno para TypeScript
- [PostgreSQL](https://www.postgresql.org/) - Banco de dados relacional
- [Zod](https://zod.dev/) - Validação de dados
- [Vitest](https://vitest.dev/) - Testes unitários
- [Swagger](https://swagger.io/) - Documentação automática da API

## Funcionalidades
- Cadastro de usuários
- Autenticação (login)
- Cadastro, listagem, atualização e remoção de cursos
- Proteção de rotas com JWT
- Documentação interativa via Swagger e Scalar

## Como rodar o projeto

### 1. Clone o repositório
```sh
git clone <url-do-repositorio>
cd rocketseat-server
```

### 2. Instale as dependências
```sh
npm install
```

### 3. Configure o banco de dados
Utilize o Docker para subir o PostgreSQL:
```sh
docker-compose up -d
```

Crie um arquivo `.env` na raiz com:
```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/desafio
NODE_ENV=development
```

### 4. Execute as migrações
```sh
npm run db:migrate
```

### 5. Rode o projeto
```sh
npm run dev
```

Acesse a API em: [http://localhost:3333](http://localhost:3333)

### 6. Documentação
Acesse a documentação interativa em: [http://localhost:3333/docs](http://localhost:3333/docs)

## Testes
Para rodar os testes:
```sh
npm test
```

## Estrutura de Pastas
- `src/` - Código fonte da aplicação
  - `routes/` - Rotas da API
  - `database/` - Configuração e schema do banco
  - `utils/` - Funções utilitárias
  - `tests/` - Fábricas e testes
- `drizzle.config.ts` - Configuração do Drizzle ORM
- `docker-compose.yml` - Configuração do banco via Docker

## Licença
Este projeto está sob licença ISC.
