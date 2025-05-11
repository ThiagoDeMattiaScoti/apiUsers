"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.listen(8080, () => {
    console.log("Servidor rodando na porta 8080");
});
const users = [];
app.post('/user', (req, res) => {
    const { name } = req.body;
    if (!name)
        res.status(400).json({ message: "Usuário precisa ter um nome para ser criado" });
    const nextId = users.length > 0 ? users[users.length - 1].id + 1 : 1;
    const newUser = { id: nextId, name };
    res.status(201).json({ message: "Usuário criado com sucesso", newUser });
});
app.get('/user', (req, res) => {
    if (users.length === 0)
        res.status(404).json({ message: "Não existem usuários para consulta" });
    res.status(200).json(users);
});
app.get('/user/:id', (req, res) => {
    if (users.length === 0)
        res.status(404).json({ message: "Não existem usuários para consulta" });
    const { id } = req.params;
    const indexUser = users.findIndex(u => u.id === parseInt(id));
    if (indexUser < 0)
        res.status(404).json({ message: "Não encontrado nenhum usuário com esse ID" });
    const user = users[indexUser];
    res.status(200).json(user);
});
app.post('/user/:id', (req, res) => {
    const { id } = req.params;
    const indexUser = users.findIndex(u => u.id === parseInt(id));
    if (indexUser < 0)
        res.status(404).json({ message: "Não encontrado nenhum usuário com esse ID" });
    const { name } = req.body;
    if (!name)
        res.status(400).json({ message: "Usuário precisa ter um nome para ser criado" });
    users[indexUser].name = name;
    res.status(200).json({ message: "Usuário alterado com sucesso", name });
});
app.delete('/user/:id', (req, res) => {
    const { id } = req.params;
    const indexUser = users.findIndex(u => u.id === parseInt(id));
    if (indexUser < 0)
        res.status(404).json({ message: "Não encontrado nenhum usuário com esse ID" });
    users.splice(indexUser, 1);
    res.status(200).json({ message: "Usuário excluído com sucesso" });
});
