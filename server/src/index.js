// Minimal Express server that connects to a PostgreSQL database and returns the rows of a table
const express = require('express')
const app = express()
const port = 3000


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

const pg = require('pg');
const pool = new pg.Pool({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD
});

async function queryDB(name) {
    const client = await pool.connect();

    try {
        const res = await client.query('SELECT * FROM demo_table WHERE name = $1', [name]);
        return res.rows;
    } catch (err) {
        console.error(err);
    } finally {
        client.release();
    }

}

app.get('/', (req, res) => {
    queryDB(req.query.name).then(rows => (res.send(rows)));
});

