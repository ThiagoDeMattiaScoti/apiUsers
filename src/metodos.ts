import pool from './database'

export async function getAllUsers(){
    try {
        const result = await pool.query('SELECT * FROM users ORDER BY id')
        console.log(result.rows)
    } catch (err) {
        return err
    } finally {
        await pool.end()
    }
}