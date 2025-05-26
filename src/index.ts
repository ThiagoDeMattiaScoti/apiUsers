import express, { Request, Response } from 'express'
import pool from './database'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { authenticateJWT } from './verifyToken'

const app = express()
app.use(express.json())
app.listen(8080, ()=>{
    console.log("Servidor rodando na porta 8080")
})

const JWT_SECRET = '327mo'
declare global { namespace Express {interface Request {user?: LoginPayload}}}

app.post('/user', async (req: Request, res: Response)=>{
    const {name, password} = req.body
    try{
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        const result = await pool.query('INSERT INTO users (name, password) VALUES ($1, $2) RETURNING *', [name, hashedPassword])
        res.status(201).json((result).rows[0])
    } catch (err){
        res.status(500).send(err)
    }
})

app.get('/user', async (req:Request, res: Response)=>{
    try{
        const result = await pool.query('SELECT id, name FROM users')
        res.status(200).json(result.rows)
    } catch(err){
        res.status(500).send(err)
    }
})

app.get('/user/:id', async (req: Request, res: Response)=>{
    const {id} = req.params
    try{
        const result = await pool.query('SELECT id, name FROM users WHERE id = $1', [id])
        res.status(200).json(result.rows[0])
    } catch(err) {
        res.status(500).send(err)
    }
})

app.put('/user/:id', authenticateJWT,async (req: Request, res: Response)=>{
    const loggedInUser = req.user as LoginPayload
    const {id} = req.params
    const {name} = req.body
    if (String(loggedInUser.userId) !== id){
        res.status(404).json({erro: 'Você só pode modificar seus dados'})
    }
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

app.post('/login', async (req: Request, res: Response)=>{
    const {name, password} = req.body
    const userQuery = await pool.query('SELECT * FROM users where name = $1', [name])
    const user = userQuery.rows[0]
    const isPasswordCorret = await bcrypt.compare(password, user.password)
    if (!isPasswordCorret) res.status(404).send('Senha incorreta')
    try{
        const payload: LoginPayload = {
            userId: user.id,
            userName: user.name,
            userPassword: user.password
        }

        const token = jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '3m'}
        )
        res.status(200).json({message: 'Login feito com sucesso', token})
    } catch (err){
        res.status(500).send(err)
    }
})