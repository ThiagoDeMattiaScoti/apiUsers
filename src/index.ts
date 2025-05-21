import express, { Request, Response } from 'express'
import pool from './database'
import bcrypt from 'bcrypt'

const app = express()
app.use(express.json())
app.listen(8080, ()=>{
    console.log("Servidor rodando na porta 8080")
})

app.post('/user', async (req: Request, res: Response)=>{
    const {name} = req.body
    try{
        const result = await pool.query('INSERT INTO users (name) VALUES ($1) RETURNING *', [name])
        res.status(201).json((result).rows[0])
    } catch (err){
        res.status(500).send(err)
    }
})

app.get('/user', async (req:Request, res: Response)=>{
    try{
        const result = await pool.query('SELECT * FROM users')
        res.status(200).json(result.rows)
    } catch(err){
        res.status(500).send(err)
    }
})

app.get('/user/:id', async (req: Request, res: Response)=>{
    const {id} = req.params
    try{
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id])
        res.status(200).json(result.rows[0])
    } catch(err) {
        res.status(500).send(err)
    }
})

app.put('/user/:id', async (req: Request, res: Response)=>{
    const {id} = req.params
    const {name, nameAdmin, passwordAdmin} = req.body
    const adminQuery = await pool.query('SELECT * FROM admins WHERE name = $1', [nameAdmin])
    const admin = adminQuery.rows[0]
    const isPasswordCorret = await bcrypt.compare(passwordAdmin, admin.password)
    if (!isPasswordCorret) res.status(4040).send('Usuário sem permissão de administrador')
    try{
        const result = await pool.query('UPDATE users SET name = $2 WHERE id = $1', [id, name])
        res.status(200).json(result.rows[0])
    } catch (err){
        res.status(500).send(err)
    }
})

app.delete('/user/:id', async (req: Request, res: Response)=>{
    const {nameAdmin, passwordAdmin} = req.body
    const adminQuery = await pool.query('SELECT * FROM admins WHERE name = $1', [nameAdmin])
    const admin = adminQuery.rows[0]
    const isPasswordCorret = await bcrypt.compare(passwordAdmin, admin.password)
    if (!isPasswordCorret) res.status(404).send('Usuário sem permissão de administrador')
    try{
        const {id} = req.params
        const result = await pool.query('DELETE FROM users WHERE id = $1', [id])
        res.status(200).json(result.rows[0])
    } catch (err){
        res.status(500).send(err)
    }
})

app.post('/admin', async (req: Request, res: Response)=>{
    const {name, password, nameAdmin, passwordAdmin} = req.body
    const adminQuery = await pool.query('SELECT * FROM admins WHERE name = $1', [nameAdmin])
    const admin = adminQuery.rows[0]
    const isPasswordCorret = await bcrypt.compare(passwordAdmin, admin.password)
    if (!isPasswordCorret) res.status(404).send('Usuário sem permissão de administrador')
    try{
        const forceHash = 10
        const senhaHashada = bcrypt.hash(password, forceHash)
        const result = await pool.query('INSERT INTO admins (name, password) VALUES ($1, $2) RETURNING *', [name, senhaHashada])
        res.status(201).json(result.rows[0])
    } catch(err){
        res.status(500).send(err)
    }
})