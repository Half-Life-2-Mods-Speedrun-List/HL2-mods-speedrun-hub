const { Pool } = require("pg")
require("dotenv").config()

// global database connection pool with connection details from environment variables
const pool = new Pool({
    user: process.env.POSTGRES_USER,     
    host: process.env.POSTGRES_HOST,     
    database: process.env.POSTGRES_DB,  
    password: process.env.POSTGRES_PASSWORD, 
    port: process.env.POSTGRES_PORT,     
  });
  
  // function to establish database connection
  async function connectDB() {
    try {
        await pool.connect();
        console.log('Connected to PostgreSQL');
    }   catch (error) {
        console.error('Connection error', error); 
        process.exit(1); // exit the process if the connection fails
    }
  }

  /* new Promise is unnecessary since async/await already returns a promise object*/
const query = async (sql, values = []) => {
        try {
            return await pool.query(sql, values)
        } catch(error) {
            throw new Error(error.message)
        }
    }

/* I don't think there's need for creating new connection every time

const openDb = () => {
    const pool = new Pool({
        user: process.env.POSTGRES_USER,
        host: process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: process.env.POSTGRES_PORT,
    })
    return pool;
}*/

module.exports = {
    query, connectDB,
}