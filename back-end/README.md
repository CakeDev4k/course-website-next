# Space Course - Back-end

API RESTful para a plataforma Space Course, desenvolvida com Fastify, TypeScript e PostgreSQL.

## 🚀 Tecnologias

- **Fastify**: Framework web rápido e eficiente
- **TypeScript**: Tipagem estática para JavaScript
- **PostgreSQL**: Banco de dados relacional
- **Drizzle ORM**: ORM para interação com o banco de dados
- **JWT**: Autenticação baseada em tokens
- **Docker**: Containerização da aplicação
- **Vitest**: Framework de testes

## 🔧 Configuração do Ambiente

### Pré-requisitos
- Node.js (v18+)
- npm ou yarn
- Docker e Docker Compose (recomendado)
- PostgreSQL (se não usar Docker)

### Instalação

1. **Clone o repositório e acesse a pasta do back-end**
```bash
git clone https://github.com/seu-usuario/rocketseat-server.git
cd rocketseat-server/back-end
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. **Inicie o banco de dados com Docker**
```bash
docker-compose up -d
```

5. **Execute as migrações**
```bash
npm run db:migrate
```

6. **Popule o banco com dados iniciais (opcional)**
```bash
npm run db:seed
```

## 🚀 Executando a Aplicação

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

## 🧪 Testes

```bash
# Execute os testes
npm test

# Execute os testes com cobertura
npm test -- --coverage
```

## 📚 Documentação da API

A documentação da API está disponível em:
- Swagger UI: http://localhost:3333/documentation
- Scalar API Reference: http://localhost:3333/reference

## 📋 Scripts Disponíveis

- `npm run dev`: Inicia o servidor em modo de desenvolvimento
- `npm run db:generate`: Gera migrações com base nas alterações do schema
- `npm run db:migrate`: Executa as migrações pendentes
- `npm run db:studio`: Inicia o Drizzle Studio para visualização do banco
- `npm run db:seed`: Popula o banco com dados iniciais
- `npm test`: Executa os testes

## 📁 Estrutura do Projeto

```
back-end/
├── docker/              # Configurações do Docker
├── drizzle/             # Migrações do banco de dados
├── src/
│   ├── @types/          # Definições de tipos
│   ├── database/        # Configuração e modelos do banco
│   ├── routes/          # Rotas da API
│   │   ├── auth/        # Rotas de autenticação
│   │   ├── courses/     # Rotas de cursos
│   │   ├── lessons/     # Rotas de aulas
│   │   ├── favorites/   # Rotas de favoritos
│   │   └── tags/        # Rotas de tags
│   ├── uploads/         # Arquivos enviados pelos usuários
│   ├── utils/           # Funções utilitárias
│   ├── app.ts           # Configuração da aplicação
│   └── server.ts        # Ponto de entrada
└── ...
```

## 🔒 Autenticação

A API utiliza autenticação JWT. Para acessar rotas protegidas, inclua o token no header:

```
Authorization: Bearer seu_token_jwt
```

## 📝 Endpoints Principais

### Autenticação
- `POST /auth/register`: Registro de usuário
- `POST /auth/login`: Login de usuário

### Cursos
- `GET /courses`: Lista todos os cursos
- `GET /courses/:id`: Obtém um curso específico
- `POST /courses`: Cria um novo curso
- `PUT /courses/:id`: Atualiza um curso
- `DELETE /courses/:id`: Remove um curso

### Aulas
- `GET /lessons`: Lista todas as aulas
- `POST /lessons`: Cria uma nova aula
- `PUT /lessons/:id`: Atualiza uma aula
- `DELETE /lessons/:id`: Remove uma aula
- `POST /lessons/:id/watched`: Marca uma aula como assistida

### Favoritos
- `GET /favorites`: Lista cursos favoritos do usuário
- `POST /favorites`: Adiciona um curso aos favoritos
- `DELETE /favorites/:id`: Remove um curso dos favoritos

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Faça commit das suas alterações
4. Faça push para a branch
5. Abra um Pull Request
