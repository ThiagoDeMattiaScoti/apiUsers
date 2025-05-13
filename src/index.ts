import express from 'express'
import { Request, Response } from 'express'
import { getAllUsers } from './metodos'
import pool from './database'

const app = express()
app.use(express.json())
app.listen(8080, ()=>{
    console.log("Servidor rodando na porta 8080")
})

app.get('/user', async (req: Request, res: Response)=>{
    try {
        const result = await pool.query('SELECT * FROM users ORDER BY ID')
        res.status(200).json(result.rows)
    } catch (err) {
        res.status(400).json({message: "Ocorreu um erro ao fazer a consulta", err
        })
    } finally {await pool.end()}
});

app.post('/user', async (req: Request, res: Response)=>{
    const {name} = req.body
    try{
        const query = 'INSERT INTO users (name) VALUES ($1) RETURNING *'
        const values = [name]
        const result = await pool.query(query, values)
        res.status(201).json(result.rows[0])
    } catch(err){
        res.status(500).json({message: "Deu erro"})
    }
});

app.get('/user/:id', async (req: Request, res: Response)=>{
    const { id } = req.params
    try{
       const query = 'SELECT * FROM users WHERE id = $1' 
       const values = [id]
       const result = await pool.query(query, values)
       res.status(200).json(result.rows[0])
    } catch (err){ res.status(500)}
});

app.put('/user/:id', async (req: Request, res: Response)=>{
    const { id } = req.params
    const { name } = req.body
    try{
        const query = 'UPDATE users SET name = $2 WHERE id = $1'
        const values = [id, name]
        const result = await pool.query(query, values)
        res.status(200).json(result.rows[0])
    } catch (err) {res.status(500)}
});

app.delete('/user/:id', async (req: Request, res: Response)=>{
    const { id } = req.params
    try{
        const query = 'DELETE FROM users WHERE id = $1'
        const values = [id]
        const result = await pool.query(query, values)
        res.status(200).json(result.rows[0])
    } catch (err){ res.status(500)}
});
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