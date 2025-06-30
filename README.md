# API de Gerenciamento de Usuários e Administradores

API RESTful robusta para gerenciamento de usuários e administradores, com foco em autenticação JWT e controle de acesso. Desenvolvida em Node.js, utilizando Express para o framework web, PostgreSQL como banco de dados, bcrypt para hashing de senhas e JSON Web Tokens (JWT) para autenticação.

## Funcionalidades

-   **Gerenciamento de Usuários:** Cadastro, listagem, edição e remoção de usuários.
-   **Autenticação de Usuários:** Login seguro com geração de JWT.
-   **Gerenciamento de Administradores:** Cadastro e autenticação de administradores.
-   **Controle de Acesso:** Rotas protegidas por autenticação e autorização baseada em perfis (usuário/administrador).

## Tecnologias Utilizadas

-   **Node.js:** Ambiente de execução JavaScript.
-   **Express.js:** Framework web para Node.js.
-   **PostgreSQL:** Sistema de gerenciamento de banco de dados relacional.
-   **bcrypt:** Biblioteca para hashing de senhas, garantindo segurança.
-   **jsonwebtoken (JWT):** Para criação e verificação de tokens de autenticação.
-   **TypeScript:** Linguagem de programação que adiciona tipagem estática ao JavaScript.
-   **ts-node-dev:** Para desenvolvimento com recarregamento automático.
-   **dotenv:** Para gerenciamento de variáveis de ambiente.

## Configuração e Execução

Você pode rodar a aplicação de duas formas: diretamente com Node.js/npm ou utilizando Docker.

### Pré-requisitos

-   Node.js (versão 14 ou superior) e npm
-   PostgreSQL
-   Docker e Docker Compose (opcional, para execução via Docker)

### 1. Execução Local (sem Docker)

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/ThiagoDeMattiaScoti/apiUsers.git
    cd apiUsers
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configuração do Banco de Dados PostgreSQL:**
    Crie um banco de dados PostgreSQL e as tabelas `users` e `admins`. Você pode usar os seguintes comandos SQL:
    ```sql
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(200) NOT NULL
    );

    CREATE TABLE admins (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(200) NOT NULL
    );
    ```

4.  **Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
    ```
    DB_USER=seu_usuario_postgres
    DB_HOST=localhost
    DB_DATABASE=seu_banco_de_dados
    DB_PASSWORD=sua_senha_postgres
    DB_PORT=5432
    JWT_SECRET=seu_segredo_jwt_muito_seguro
    ```
    **Importante:** `JWT_SECRET` deve ser uma string longa e complexa. Nunca exponha este segredo em produção.

5.  **Inicie o servidor em modo de desenvolvimento:**
    ```bash
    npm run dev
    ```
    O servidor estará disponível em `http://localhost:8080`.

### 2. Execução com Docker e Docker Compose

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/ThiagoDeMattiaScoti/apiUsers.git
    cd apiUsers
    ```

2.  **Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis. Note que `DB_HOST` será o nome do serviço do banco de dados no `docker-compose.yml` (geralmente `db` ou `postgres`).
    ```
    DB_USER=seu_usuario_postgres
    DB_HOST=db # ou o nome do serviço do seu banco de dados no docker-compose
    DB_DATABASE=seu_banco_de_dados
    DB_PASSWORD=sua_senha_postgres
    DB_PORT=5432
    JWT_SECRET=seu_segredo_jwt_muito_seguro
    ```

3.  **Construa e inicie os serviços:**
    ```bash
    docker-compose up --build
    ```
    Este comando irá construir a imagem Docker da aplicação, criar um contêiner para o banco de dados PostgreSQL e iniciar ambos os serviços. O servidor da API estará acessível em `http://localhost:8080`.

    Para rodar em segundo plano:
    ```bash
    docker-compose up -d --build
    ```

## Autenticação

Para acessar as rotas protegidas, você precisará de um JSON Web Token (JWT) válido. Após o login bem-sucedido, a API retornará um token com validade de 3 minutos.

Inclua o token no cabeçalho `Authorization` de suas requisições, no formato `Bearer <token>`:

```
Authorization: Bearer seu_token_jwt_aqui
```

## Endpoints da API

Todos os endpoints baseiam-se em `http://localhost:8080` (ou a porta configurada).

### Usuários

-   `POST /user`
    -   **Descrição:** Cria um novo usuário.
    -   **Corpo da Requisição:** `{ "name": "string", "password": "string" }`
    -   **Acesso:** Público

-   `GET /user`
    -   **Descrição:** Lista todos os usuários (apenas `id` e `name`).
    -   **Acesso:** Autenticado (usuário ou administrador)

-   `GET /user/:id`
    -   **Descrição:** Busca um usuário específico pelo ID.
    -   **Acesso:** Autenticado (usuário ou administrador)

-   `PUT /user/:id`
    -   **Descrição:** Edita o nome de um usuário. Requer autenticação.
    -   **Corpo da Requisição:** `{ "name": "string" }`
    -   **Acesso:** Autenticado (usuário ou administrador). Um usuário só pode editar seu próprio perfil.

-   `DELETE /user/:id`
    -   **Descrição:** Remove um usuário pelo ID.
    -   **Acesso:** Autenticado (apenas administrador)

### Autenticação

-   `POST /login`
    -   **Descrição:** Realiza o login de um usuário ou administrador e retorna um JWT.
    -   **Corpo da Requisição:** `{ "name": "string", "password": "string" }`
    -   **Acesso:** Público

### Administradores

-   `POST /admin`
    -   **Descrição:** Cria um novo administrador.
    -   **Corpo da Requisição:** `{ "name": "string", "password": "string" }`
    -   **Acesso:** Autenticado (apenas administrador)

## Segurança

-   **Hashing de Senhas:** Todas as senhas são armazenadas no banco de dados após serem hashadas com `bcrypt`, impedindo o acesso direto às senhas originais.
-   **Controle de Acesso Baseado em Papéis:** Apenas administradores autenticados podem criar novos administradores e remover usuários.
-   **Variáveis de Ambiente:** Informações sensíveis como credenciais do banco de dados e o segredo JWT são gerenciadas via variáveis de ambiente (`.env`), não sendo expostas diretamente no código-fonte.
-   **Tokens JWT:** Os tokens têm um tempo de expiração limitado (3 minutos) para reduzir o risco de uso indevido em caso de comprometimento.

## Licença

Este projeto está licenciado sob a licença ISC. Veja o arquivo `LICENSE` para mais detalhes. (Assumindo que há um arquivo LICENSE ou que a licença ISC é a padrão, como indicado no `package.json`)