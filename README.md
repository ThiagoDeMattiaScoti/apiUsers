# CRUD Básico com Node.js, Express, TypeScript e PostgreSQL

Este projeto é uma API RESTful desenvolvida com **Node.js**, **Express** e **TypeScript**, agora integrada a um banco de dados **PostgreSQL**. A aplicação permite realizar operações de criação, leitura, atualização e exclusão (CRUD) de usuários, utilizando o PostgreSQL como sistema de armazenamento.

Agora, o projeto conta com um sistema de autenticação para **administradores**, garantindo maior segurança nas operações de atualização, exclusão de usuários e criação de novos administradores.

---

## Pré-requisitos

- **Node.js** (versão 14 ou superior)
- **npm** ou **yarn**
- **PostgreSQL** instalado e configurado

---

## Configuração do Banco de Dados

1. Certifique-se de que o PostgreSQL está instalado e rodando.
2. Crie um banco de dados chamado `crud_usuarios`:
   ```sql
   CREATE DATABASE crud_usuarios;
   ```
3. Crie a tabela `users` no banco:
   ```sql
   CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       name VARCHAR(255) NOT NULL
   );
   ```

4. Crie a tabela `admins` no banco:
   ```sql
   CREATE TABLE admins (
       id SERIAL PRIMARY KEY,
       name VARCHAR(255) NOT NULL UNIQUE,
       password TEXT NOT NULL
   );
   ```

5. Crie o **primeiro administrador** diretamente no banco de dados, pois a aplicação exige autenticação para criar novos administradores. Insira um hash de senha manualmente ou use uma ferramenta para gerá-lo. Exemplo:
   ```sql
   INSERT INTO admins (name, password)
   VALUES ('admin', '$2b$10$ExemploDeHashGeradoPeloBcrypt');
   ```

6. Atualize as credenciais de acesso ao banco no arquivo `database.ts`:
   ```typescript name=database.ts
   const pool = new Pool({
       user: 'seu_usuario',
       host: 'localhost',
       database: 'crud_usuarios',
       password: 'sua_senha',
       port: sua_porta
   });
   ```

---

## Instalação e Execução

1. Clone o repositório:
   ```bash
   git clone https://github.com/ThiagoDeMattiaScoti/apiUsers
   cd apiUsers
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Execute o servidor em modo de desenvolvimento:
   ```bash
   npm run dev
   ```

4. A API estará rodando em `http://localhost:8080`.

---

## Rotas da API

### **Usuários**

#### **Criar um usuário**
- **POST** `/user`
- **Descrição:** Adiciona um novo usuário ao banco de dados.
- **Body:**
  ```json
  {
    "name": "Nome do usuário"
  }
  ```
- **Respostas:**
  - `201 Created`: Retorna o usuário criado.
  - `500 Internal Server Error`: Erro ao criar o usuário.

#### **Listar todos os usuários**
- **GET** `/user`
- **Descrição:** Retorna uma lista de todos os usuários cadastrados.
- **Respostas:**
  - `200 OK`: Lista de usuários.
  - `400 Bad Request`: Erro ao consultar os dados.

#### **Consultar um usuário por ID**
- **GET** `/user/:id`
- **Descrição:** Retorna os dados de um usuário específico.
- **Parâmetros da URL:**
  - `id`: ID do usuário.
- **Respostas:**
  - `200 OK`: Dados do usuário.
  - `500 Internal Server Error`: Erro ao consultar o usuário.

#### **Atualizar um usuário**
- **PUT** `/user/:id`
- **Descrição:** Atualiza o nome de um usuário específico. Esta operação exige autenticação.
- **Parâmetros da URL:**
  - `id`: ID do usuário.
- **Body:**
  ```json
  {
    "nameAdmin": "Nome do administrador",
    "passwordAdmin": "Senha do administrador",
    "name": "Novo nome do usuário"
  }
  ```
- **Respostas:**
  - `200 OK`: Usuário atualizado.
  - `401 Unauthorized`: Credenciais inválidas.
  - `500 Internal Server Error`: Erro ao atualizar o usuário.

#### **Excluir um usuário**
- **DELETE** `/user/:id`
- **Descrição:** Remove um usuário do banco de dados. Esta operação exige autenticação.
- **Parâmetros da URL:**
  - `id`: ID do usuário.
- **Body:**
  ```json
  {
    "nameAdmin": "Nome do administrador",
    "passwordAdmin": "Senha do administrador"
  }
  ```
- **Respostas:**
  - `200 OK`: Usuário removido.
  - `401 Unauthorized`: Credenciais inválidas.
  - `500 Internal Server Error`: Erro ao excluir o usuário.

---

### **Administradores**

#### **Criar um administrador**
- **POST** `/admins`
- **Descrição:** Adiciona um novo administrador ao banco de dados. Esta operação exige autenticação.
- **Body:**
  ```json
  {
    "nameAdmin": "Nome do administrador existente",
    "passwordAdmin": "Senha do administrador existente",
    "name": "Nome do novo administrador",
    "password": "Senha do novo administrador"
  }
  ```
- **Respostas:**
  - `201 Created`: Administrador criado.
  - `400 Bad Request`: Nome e senha do administrador autenticado não foram informados.
  - `401 Unauthorized`: Credenciais inválidas do administrador autenticado.
  - `500 Internal Server Error`: Erro ao criar o administrador.

---

## Estrutura do Projeto

```
.
├── src/
│   ├── database.ts      # Configuração do banco de dados
│   ├── index.ts         # Código principal da API
├── dist/                # Pasta gerada pelo build (JavaScript compilado)
├── package.json         # Configurações do projeto e scripts
├── tsconfig.json        # Configurações do TypeScript
└── README.md            # Documentação
```

---

## Scripts Disponíveis

- **`npm run dev`**: Inicia o servidor em modo de desenvolvimento.
- **`npm run build`**: Compila o código TypeScript para JavaScript.
- **`npm start`**: Executa o código compilado.
