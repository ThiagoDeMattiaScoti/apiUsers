import express from 'express'
import { Request, Response } from 'express'
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
    try{
        // Verificação da hash
        const adminQuery = await pool.query('SELECT * FROM admins WHERE name = $1', [nameAdmin])
        const admin = adminQuery.rows[0]
        const isPasswordValid = await bcrypt.compare(passwordAdmin, admin.password)
        if (!isPasswordValid) res.status(401).send('Invalid credencials')
        //

        const result = await pool.query('UPDATE users SET name = $2 WHERE id = $1', [id, name])
        res.status(200).json(result.rows[0])
    } catch (err){
        res.status(500).send(err)
    }
})

app.delete('/user/:id', async (req: Request, res: Response)=>{
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
    try{
        if (!nameAdmin || !passwordAdmin) res.status(400).send('Necessary say a admin name and password')
        const adminQuery = await pool.query('SELECT * FROM admins WHERE name = $1', [nameAdmin])
        const admin = adminQuery.rows[0]
        const isPasswordValid = await bcrypt.compare(passwordAdmin, admin.password)
        if (!isPasswordValid) res.status(401).send('Invalid admin Password')
        
        const hashForceCost = 10
        const hashedPassword = await bcrypt.hash(password, hashForceCost)
        const result = await pool.query('INSERT INTO admins (name, password) VALUES ($1, $2) RETURNING *', [name, hashedPassword])
        res.status(201).json(result.rows[0])
    } catch(err){
        res.status(500).send(err)
    }
})