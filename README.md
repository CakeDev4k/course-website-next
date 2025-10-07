# Space Course - Plataforma de Cursos Online

![Logo](./front-end/public/rocket.png)

## 📋 Sobre o Projeto

Space Course é uma plataforma completa de cursos online inspirada na Rocketseat, focada em cursos sobre exploração espacial, foguetes e cosmologia. O projeto é composto por um back-end em Fastify/Node.js e um front-end em Next.js.

## 🚀 Funcionalidades

- **Autenticação de usuários**: Registro, login e controle de acesso
- **Gerenciamento de cursos**: Criação, edição e exclusão de cursos
- **Sistema de aulas**: Organização de aulas por curso com marcação de progresso
- **Favoritos**: Marcação de cursos favoritos
- **Categorias e tags**: Organização e filtragem de conteúdo
- **Painel administrativo**: Gerenciamento completo da plataforma

## 🛠️ Tecnologias Utilizadas

### Back-end
- **Fastify**: Framework web rápido e eficiente
- **TypeScript**: Tipagem estática para JavaScript
- **PostgreSQL**: Banco de dados relacional
- **Drizzle ORM**: ORM para interação com o banco de dados
- **JWT**: Autenticação baseada em tokens
- **Docker**: Containerização da aplicação
- **Vitest**: Framework de testes

### Front-end
- **Next.js**: Framework React com renderização do lado do servidor
- **React**: Biblioteca para construção de interfaces
- **TailwindCSS**: Framework CSS utilitário
- **React Hook Form**: Gerenciamento de formulários
- **Zod**: Validação de dados

## 🔧 Configuração do Ambiente de Desenvolvimento

### Pré-requisitos
- Node.js (v18+)
- npm ou yarn
- Docker e Docker Compose
- PostgreSQL (opcional, se não usar Docker)

### Instalação e Execução

#### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/rocketseat-server.git
cd rocketseat-server
```

#### 2. Back-end
```bash
# Acesse a pasta do back-end
cd back-end

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Inicie o banco de dados com Docker
docker-compose up -d

# Execute as migrações
npm run db:migrate

# Popule o banco com dados iniciais (opcional)
npm run db:seed

# Inicie o servidor em modo de desenvolvimento
npm run dev
```

#### 3. Front-end
```bash
# Em outro terminal, acesse a pasta do front-end
cd front-end

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Inicie o servidor de desenvolvimento
npm run dev
```

## 📚 Documentação da API

A documentação da API está disponível em:
- Swagger UI: http://localhost:3333/documentation
- Scalar API Reference: http://localhost:3333/reference

## 🧪 Testes

### Back-end
```bash
# Execute os testes
npm test

# Execute os testes com cobertura
npm test -- --coverage
```

## 📁 Estrutura do Projeto

### Back-end
```
back-end/
├── docker/              # Configurações do Docker
├── drizzle/             # Migrações do banco de dados
├── src/
│   ├── @types/          # Definições de tipos
│   ├── database/        # Configuração e modelos do banco
│   ├── routes/          # Rotas da API
│   ├── uploads/         # Arquivos enviados pelos usuários
│   ├── utils/           # Funções utilitárias
│   ├── app.ts           # Configuração da aplicação
│   └── server.ts        # Ponto de entrada
└── ...
```

### Front-end
```
front-end/
├── app/
│   ├── api/             # Rotas de API do Next.js
│   ├── components/      # Componentes React
│   ├── courses/         # Páginas de cursos
│   ├── favorites/       # Páginas de favoritos
│   ├── manager-course/  # Painel administrativo
│   ├── styles/          # Estilos CSS
│   ├── utils/           # Funções utilitárias
│   ├── layout.tsx       # Layout principal
│   └── page.tsx         # Página inicial
└── ...
```

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC. Veja o arquivo LICENSE para mais detalhes.

## 📧 Contato

Para dúvidas ou sugestões, entre em contato através de [seu-email@exemplo.com].