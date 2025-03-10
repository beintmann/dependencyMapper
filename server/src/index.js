// Minimal Express server that connects to a PostgreSQL database and returns the rows of a table
const express = require('express')
const app = express()
const port = 3000

//erlaubt die Nutzung des src/public Ordners, damit die style.css geladen werden kann
app.use(express.static('src/public'));

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



// Route für die Hauptseite
app.get('/', (req, res) => {
    res.send(`
        <link rel="stylesheet" type="text/css" href="styles.css">
        <script src="searchHandler.js" defer ></script>
        <form id="search-form" action="/search" method="POST" class="search-container">
        
            <input type="text" id="search" autocomplete="off" placeholder="Suchbegriff" required>
            
            <select id="slct-feld" name="type">
                <option value="Datensatz">Datensatz</option>
                <option value="Anwendung">Anwendung</option>
                <option value="Dienst">Dienst</option>
            </select>
            
            <button id="submit-btn" type="submit">Suchen</button>
            <ul id="suggestions" class="suggestions-list"></ul>
        </form>
        
        <div id="results-container" class="results-container" style="display: none;"></div>
    `);
});

// app.get("/demo-table", async (req, res) => {
//     try{
//         const result = await pool.query("SELECT * FROM demo_table");
//         res.json(result.rows);
//     } catch (err) {
//         console.error(err);
//     }
//
//
//
// });

app.get('/tables', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
        `);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Fehler beim Abrufen der Tabellen');
    }
});


//route für Vorschlagliste
app.get("/recommended", async (req, res) => {

    //holt sich die Variablen aus der URL
    const suchbegriff = req.query.q;
    const selectedValue = req.query.v;

    //schutz vor SQL-Injection
    const allowedTables = ['Datensatz', 'Dienst', 'Anwendung'];

    if (!allowedTables.includes(selectedValue)) {
        return res.status(400).json({ error: 'Invalid table name' });
    }


    // Query an Datenbank mit Variablen aus der URL
    try {
        const result = await pool.query(
            `SELECT * FROM public."${selectedValue}" WHERE "Bezeichnung" ILIKE $1 LIMIT 10`, [`%${suchbegriff}%`]
        );
        console.log(selectedValue)
        console.log("suchbegriff: " + suchbegriff)
        console.log(result.rows)
        console.log("rowCount: " + result.rowCount)
        res.json(result.rows);

    }catch(err){
        console.error(err);
    }
})

//route für Suche
app.get("/search", async (req, res) => {

    //holt sich die Variablen aus der URL
    const suchbegriff = req.query.q;
    const selectedValue = req.query.v;

    //schutz vor SQL-Injection
    const allowedTables = ['Datensatz', 'Dienst', 'Anwendung'];

    if (!allowedTables.includes(selectedValue)) {
        return res.status(400).json({ error: 'Invalid table name' });
    }



})