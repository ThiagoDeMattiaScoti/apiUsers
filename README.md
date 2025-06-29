# API de gerenciamento de usuários e administradores

API RESTful para gerenciamento de usuários e administradores, autenticação JWT, e controle de acesso. Desenvolvida em Node.js com Express, PostgreSQL, bcrypt e JWT.

## Funcionalidades

- Cadastro/listagem/edição/remoção de usuários
- Login de usuários (JWT)
- Cadastro e autenticação de administradores
- Rotas protegidas por autenticação e autorização

## Como rodar


1. **Clone o repositório**
   ```bash
   git clone https://github.com/ThiagoDeMattiaScoti/apiUsers
   cd apiUsers
   ```
2. **Instale as dependências:**  
   `npm install`
3. **Configure o banco PostgreSQL:**  
   Crie as tabelas `users` e `admins`:
   ```sql
   CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(100), password VARCHAR(200));
   CREATE TABLE admins (id SERIAL PRIMARY KEY, name VARCHAR(100), password VARCHAR(200));
   ```
4. **Configure a conexão em `database.ts`**
5. **Inicie o servidor:**  
   `npm run dev`  
   (porta 8080)

## Autenticação

- Login retorna token JWT (3 minutos de validade).
- Rotas protegidas exigem header:  
  `Authorization: Bearer <token>`

## Endpoints

- `POST /user` – Cria usuário `{name, password}`
- `GET /user` – Lista usuários (id, name)
- `GET /user/:id` – Busca usuário por id
- `PUT /user/:id` – Edita nome (autenticado)
- `DELETE /user/:id` – Remove usuário (admin)
- `POST /login` – Login `{name, password}`
- `POST /admin` – Cria admin (admin autenticado)

## Segurança

- Senhas são hashadas com bcrypt.
- Apenas admins autenticados podem cadastrar/remover admins e remover usuários.
- Nunca exponha seu JWT_SECRET em produção.

## Tecnologias

Node.js, Express, PostgreSQL, bcrypt, JWT

---
