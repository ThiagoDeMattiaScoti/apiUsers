import { Pool } from 'pg'

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'crud_usuarios',
    password: 'admin',
    port: 8888
})

async function testarConexao(){
    try{
        const client = await pool.connect()
        console.log('Conexão com o PostgreSQL estabelecida!')
        client.release()
    } catch (err) {
        console.log('Erro ao se conectar ao PostgreSQL:', err)
    }
}

testarConexao()

export default pool