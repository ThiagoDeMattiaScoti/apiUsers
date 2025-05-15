import { Pool } from "pg";

const pool = new Pool({
    database: 'crud_usuarios',
    user: 'postgres',
    password: 'admin',
    port: 8888
})

export default pool