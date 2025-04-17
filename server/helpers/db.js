const { Pool } = require("pg")

require("dotenv").config()

const query = (sql, values = []) => {
    return new Promise(async(resolve, reject) => {
        try {
            const pool = openDb()
            const result = await pool.query(sql, values)
            resolve(result)
        }catch(error) {
            reject(error.message)
        }
    })
}

const openDb = () => {
    const pool = new Pool({
        user: process.env.POSTGRES_USER,
        host: process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: process.env.POSTGRES_PORT,
        ssl: process.env.SSL
    })
    
    return pool;
}

module.exports = {
    query
}