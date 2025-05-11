import express from 'express'
import { Request, Response } from 'express'

const app = express()
app.use(express.json())
app.listen(8080, ()=>{
    console.log("Servidor rodando na porta 8080")
})
const users: {id: number, name: string}[] = []

app.post('/user', (req: Request, res: Response)=>{
    const { name } = req.body
    if (!name) res.status(400).json({message: "Usuário precisa ter um nome para ser criado"})
    const nextId = users.length > 0 ? users[users.length -1].id + 1 : 1
    const newUser = {id: nextId, name}

    res.status(201).json({message: "Usuário criado com sucesso", newUser})
})