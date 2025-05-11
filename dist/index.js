"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.listen(8080, () => {
    console.log('Server funcionando na porta 8080');
});
const users = [];
app.post('/user', (req, res) => {
    const { nome } = req.body;
    users.push(nome);
    res.status(201).json({ message: "Usuário criado com sucesso", nome });
});
app.get('/user', (req, res) => {
    res.status(200).json(users);
});
