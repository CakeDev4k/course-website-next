# Space Course - Front-end

Interface de usuário para a plataforma Space Course, desenvolvida com Next.js e React.

## 🚀 Tecnologias

- **Next.js**: Framework React com renderização do lado do servidor
- **React**: Biblioteca para construção de interfaces
- **TailwindCSS**: Framework CSS utilitário
- **React Hook Form**: Gerenciamento de formulários
- **Zod**: Validação de dados
- **Axios**: Cliente HTTP para requisições à API

## 🔧 Configuração do Ambiente

### Pré-requisitos
- Node.js (v18+)
- npm ou yarn
- Back-end da aplicação em execução

### Instalação

1. **Clone o repositório e acesse a pasta do front-end**
```bash
git clone https://github.com/seu-usuario/rocketseat-server.git
cd rocketseat-server/front-end
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

## 🚀 Executando a Aplicação

### Desenvolvimento
```bash
npm run dev
```

A aplicação estará disponível em: http://localhost:3000

### Produção
```bash
npm run build
npm start
```

## 📁 Estrutura do Projeto

```
front-end/
├── app/
│   ├── api/             # Rotas de API do Next.js
│   ├── componets/       # Componentes React reutilizáveis
│   ├── courses/         # Páginas de cursos
│   ├── favorites/       # Páginas de favoritos
│   ├── manager-course/  # Painel administrativo
│   ├── styles/          # Estilos CSS
│   ├── utils/           # Funções utilitárias
│   ├── layout.tsx       # Layout principal
│   └── page.tsx         # Página inicial
├── public/              # Arquivos estáticos
└── ...
```

## 📱 Páginas Principais

- **/** - Página inicial com login/registro
- **/courses** - Listagem de cursos disponíveis
- **/courses/[id]** - Detalhes de um curso específico
- **/favorites** - Cursos favoritos do usuário
- **/manager-course** - Painel administrativo para gerenciamento de cursos

## 🔒 Autenticação

A aplicação utiliza autenticação baseada em JWT com cookies. O middleware do Next.js gerencia o redirecionamento de rotas protegidas.

## 🧩 Componentes Principais

- **FormUser** - Formulário de login e registro
- **CourseCard** - Card para exibição de cursos
- **LessonList** - Lista de aulas de um curso
- **FavoriteButton** - Botão para adicionar/remover favoritos

## 🔄 Integração com o Back-end

A aplicação se comunica com o back-end através de requisições HTTP utilizando Axios. As principais integrações incluem:

- Autenticação de usuários
- Listagem e gerenciamento de cursos
- Marcação de aulas como assistidas
- Gerenciamento de favoritos

## 🌐 Rotas da API

O Next.js fornece rotas de API para operações do lado do servidor:

- **/api/auth** - Autenticação e gerenciamento de sessão
- **/api/courses** - Operações relacionadas a cursos
- **/api/favorites** - Gerenciamento de favoritos

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Faça commit das suas alterações
4. Faça push para a branch
5. Abra um Pull Request
