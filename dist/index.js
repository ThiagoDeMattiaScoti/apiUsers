"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("./database"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.listen(8080, () => {
    console.log("Servidor rodando na porta 8080");
});
app.get('/user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield database_1.default.query('SELECT * FROM users ORDER BY ID');
        res.status(200).json(result.rows);
    }
    catch (err) {
        res.status(400).json({ message: "Ocorreu um erro ao fazer a consulta", err
        });
    }
    finally {
        yield database_1.default.end();
    }
}));
app.post('/user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    try {
        const query = 'INSERT INTO users (name) VALUES ($1) RETURNING *';
        const values = [name];
        const result = yield database_1.default.query(query, values);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        res.status(500).json({ message: "Deu erro" });
    }
}));
app.get('/user/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const query = 'SELECT * FROM users WHERE id = $1';
        const values = [id];
        const result = yield database_1.default.query(query, values);
        res.status(200).json(result.rows[0]);
    }
    catch (err) {
        res.status(500);
    }
}));
app.put('/user/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const query = 'UPDATE users SET name = $2 WHERE id = $1';
        const values = [id, name];
        const result = yield database_1.default.query(query, values);
        res.status(200).json(result.rows[0]);
    }
    catch (err) {
        res.status(500);
    }
}));
app.delete('/user/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM users WHERE id = $1';
        const values = [id];
        const result = yield database_1.default.query(query, values);
        res.status(200).json(result.rows[0]);
    }
    catch (err) {
        res.status(500);
    }
}));
//#region codigo antigo
// const users: {id: number, name: string}[] = []
// app.post('/user', (req: Request, res: Response)=>{
//     const { name } = req.body
//     if (!name) res.status(400).json({message: "Usuário precisa ter um nome para ser criado"})
//     const nextId = users.length > 0 ? users[users.length -1].id + 1 : 1
//     const newUser = {id: nextId, name}
//     res.status(201).json({message: "Usuário criado com sucesso", newUser})
// })
// app.get('/user', (req: Request, res: Response)=>{
//     if (users.length === 0) res.status(404).json({message: "Não existem usuários para consulta"})
//     res.status(200).json(users)
// })
// app.get('/user/:id', (req: Request, res: Response)=>{
//     if (users.length === 0) res.status(404).json({message: "Não existem usuários para consulta"})
//     const { id } = req.params
//     const indexUser = users.findIndex(u => u.id === parseInt(id))
//     if (indexUser < 0) res.status(404).json({message: "Não encontrado nenhum usuário com esse ID"})
//     const user = users[indexUser]
//     res.status(200).json(user)
// })
// app.post('/user/:id', (req: Request, res: Response)=>{
//     const { id } = req.params
//     const indexUser = users.findIndex(u => u.id === parseInt(id))
//     if (indexUser < 0) res.status(404).json({message: "Não encontrado nenhum usuário com esse ID"})
//     const { name } = req.body
//     if (!name) res.status(400).json({message: "Usuário precisa ter um nome para ser criado"})
//     users[indexUser].name = name
//     res.status(200).json({message: "Usuário alterado com sucesso", name})
// })
// app.delete('/user/:id', (req: Request, res: Response)=>{
//     const { id } = req.params
//     const indexUser = users.findIndex(u => u.id === parseInt(id))
//     if (indexUser < 0) res.status(404).json({message: "Não encontrado nenhum usuário com esse ID"})
//     users.splice(indexUser, 1)
//     res.status(200).json({message: "Usuário excluído com sucesso"})
// })
//#endregion
