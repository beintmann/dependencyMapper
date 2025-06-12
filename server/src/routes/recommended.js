const express = require('express');
const router = express.Router();

const pg = require('pg');
const pool = new pg.Pool({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD
});

// Route für empfehlungen der Autovervollständigung
router.get("/", async (req, res) => {

    //holt sich die Variablen aus der URL
    const suchbegriff = req.query.q;
    const selectedValue = req.query.v;

    //schutz vor SQL-Injection
    const allowedTables = ['Datensatz', 'Dienst', 'Anwendung'];

    if (!allowedTables.includes(selectedValue)) {
        return res.status(400).json({error: 'Invalid table name'});
    }


    // Query an Datenbank mit Variablen aus der URL
    try {
        const result = await pool.query(
            `SELECT *
             FROM public."${selectedValue}"
             WHERE "Bezeichnung" ILIKE $1
             LIMIT 10`, [`%${suchbegriff}%`]
        );

        res.json(result.rows);

    } catch (err) {
        console.error(err);
    }
});

module.exports = router;