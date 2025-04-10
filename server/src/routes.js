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

// Route für die Hauptseite
router.get('/', (req, res) => {
    res.send(`
        <link rel="stylesheet" type="text/css" href="styles.css">
        <script src="searchHandler.js" defer ></script>
        <script src="formHandler.js" defer ></script>
        <script src="subelementHandler.js" defer ></script>
        
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
        
        
        <div id="metadata" class="metadata" style="display: none;"></div>
        <div id="results-container" class="results-container" style="display: none; width:90%">
            <div id="anwendungen-container" class="sub-container" style="display: none;"></div>
            <div id="dienste-container" class="sub-container" style="display: none;"></div>
            <div id="server-container" class="sub-container" style="display: none;"></div>
            <div id="datenbanken-container" class="sub-container" style="display: none;"></div>
            <div id="datensatz-container" class="sub-container" style="display: none;"></div>
        </div>
    `);
});

//route für Vorschlagliste
router.get("/recommended", async (req, res) => {

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
            `SELECT 
                * 
            FROM 
                public."${selectedValue}" 
            WHERE "Bezeichnung" ILIKE $1 LIMIT 10`, [`%${suchbegriff}%`]
        );

        res.json(result.rows);

    }catch(err){
        console.error(err);
    }
});

//route für Suche nach Datensatz
router.post("/search/Datensatz", async (req, res) => {


    //holt sich die Variablen aus dem Body
    const { query, type } = req.body;
    console.log("selectedValue Wert:  " + type);

    //schutz vor SQL-Injection
    const allowedTables = ['Datensatz', 'Dienst', 'Anwendung'];

    try {
        if (!allowedTables.includes(type)) {
            return res.status(400).json({error: 'Invalid table name'});
        }

        //Suche, wenn nach einem Datensatz gesucht wird
        if (type == 'Datensatz') {

            const resultDienste = await pool.query(
                `SELECT di."Bezeichnung" AS dienst_name -- Name des Dienstes
                 FROM "Datensatz" d
                          LEFT JOIN
                      "Datensatz_Dienst" dd ON d."DatensatzID" = dd."DatensatzID"
                          LEFT JOIN
                      "Dienst" di ON dd."DienstID" = di."MetadatenUUID"

                 WHERE d."Bezeichnung" ILIKE $1;`, [`%${query}%`]
            );

            const resultAnwendungen = await pool.query(`
                SELECT

                DISTINCT a."Bezeichnung" AS anwendung_name  -- Name der Anwendung
    
                FROM
                "Datensatz" d
                    
                LEFT JOIN
                "Datensatz_Dienst" dd ON d."DatensatzID" = dd."DatensatzID"
                LEFT JOIN
                "Dienst" di ON dd."DienstID" = di."MetadatenUUID"
                LEFT JOIN
                "Dienst_Anwendung" da ON di."MetadatenUUID" = da."DienstID"
                LEFT JOIN
                "Anwendung" a ON da."AnwendungID" = a."MetadatenUUID"
                LEFT JOIN
                "Server_Anwendung" sa ON a."MetadatenUUID" = sa."AnwendungID"
                LEFT JOIN
                "Server" s ON sa."ServerID" = s."ServerID"
                WHERE
                d."Bezeichnung" ILIKE $1;`, [`%${query}%`]

            );

            const resultDatensatz = await pool.query(`
                    
            SELECT 
                d.* AS metadata

            FROM 
                "Datensatz" d
            
            WHERE d."Bezeichnung" ILIKE $1;`, [`%${query}%`]
            );

            res.json({
                Dienste: resultDienste.rows,
                Anwendungen: resultAnwendungen.rows,
                metadata: resultDatensatz.rows
            });


        }
    } catch(err){
        console.error(err);
        res.status(500).send('Fehler bei der Suche nach Datensätzen');
    }
});

router.post("/search/Anwendung", async (req, res) => {

    //holt sich die Variablen aus dem Body
    const { query, type } = req.body;
    console.log("selectedValue Wert:  " + type);

    //schutz vor SQL-Injection
    const allowedTables = ['Datensatz', 'Dienst', 'Anwendung'];

    try {
        if (!allowedTables.includes(type)) {
            return res.status(400).json({error: 'Invalid table name'});
        }

        const resultAnwendungen = await pool.query(`
                    
            SELECT 
                a.* AS metadata

            FROM 
                "Anwendung" a
            
            WHERE a."Bezeichnung" ILIKE $1;`, [`%${query}%`]
        );

        const resultDienste = await pool.query(
            `SELECT 
                Distinct d."Bezeichnung" AS dienst_name
            FROM 
                "Anwendung" a
            LEFT JOIN 
                "Dienst_Anwendung" da ON a."MetadatenUUID" = da."AnwendungID"
            LEFT JOIN 
                "Dienst" d ON da."DienstID" = d."MetadatenUUID"
            WHERE a."Bezeichnung" ILIKE $1;`, [`%${query}%`]
        );

        const resultServer = await pool.query(
            `SELECT 
                DISTINCT s."Name" AS server_name
            FROM 
                "Anwendung" a
            LEFT JOIN 
                "Server_Anwendung" sa ON a."MetadatenUUID" = sa."AnwendungID"
            LEFT JOIN 
                "Server" s ON sa."ServerID" = s."ServerID"
            WHERE a."Bezeichnung" ILIKE $1;`, [`%${query}%`]
        );

        const resultDatenbank = await pool.query(
            `SELECT 
                DISTINCT d."Name" as datenbank_name
            FROM 
                "Anwendung" a
            LEFT JOIN
                "Anwendung_Datenbank" ad on ad."AnwendungID" = a."MetadatenUUID"
            Left JOIN
                "Datenbank" d on d."Name" = ad.name_datenbank
            WHERE a."Bezeichnung" ILIKE $1;`, [`%${query}%`]


        );

        //TODO: Metadaten bei datensatz ergänzen DONE
        //TODO: Dienst muss noch gemacht werden (route + abfragen) DONE
        //TODO: SQL statements fixen bei autovervollständigung mit $1 und $2
        //TODO wenn feld null, notiz/benachrichtigung
        res.json({

            metadata: resultAnwendungen.rows,
            Dienste: resultDienste.rows,
            Server: resultServer.rows,
            Datenbanken: resultDatenbank.rows
        });


    }catch(err){
        console.error(err);
        res.status(500).send('Fehler bei der Suche nach Anwendungen');
    }
});

//Route wenn Dienst ausgewählt ist
router.post("/search/Dienst", async (req, res) => {

    //holt sich die Variablen aus dem Body
    const { query, type, dienstTyp } = req.body;
    console.log("selectedValue Wert:  " + type);
    console.log("dienstTyp= " + dienstTyp)

    //schutz vor SQL-Injection
    const allowedTables = ['Datensatz', 'Dienst', 'Anwendung'];

    try {
        if (!allowedTables.includes(type)) {
            return res.status(400).json({error: 'Invalid table name'});
        }


        //baut SQL-Query je nachdem ob der dienstTyp gesetzt ist oder nicht
        let sqlQuery = `
            SELECT 
                di.* AS metadata
            FROM 
                "Dienst" di
            WHERE 
                di."Bezeichnung" ILIKE $1`;

        // Parameter-Array für die Abfrage
        const params = [`%${query}%`];

        // Überprüft, ob dienstTyp gültig ist
        if (dienstTyp && (dienstTyp === 'WMS' || dienstTyp === 'WFS')) {
            sqlQuery += ` AND di."Typ" = $2`;
            params.push(dienstTyp); // Füge den dienstTyp zum Parameter-Array hinzu
        }
        const resultDienste = await pool.query(sqlQuery, params);



        //Datensatz infos
        let sqlDatensatzQuery = `
            SELECT 
                DISTINCT d."Bezeichnung" AS datensatz_name
            FROM 
                "Dienst" di
            LEFT JOIN
                "Datensatz_Dienst" dd on dd."DienstID" = di."MetadatenUUID"
            LEFT JOIN
                "Datensatz" d on d."DatensatzID" = dd."DatensatzID"
            WHERE 
                di."Bezeichnung" ILIKE $1`;
        let datensatzParams = [`%${query}%`];

        // Überprüft, ob dienstTyp gültig ist
        if (dienstTyp && (dienstTyp === 'WMS' || dienstTyp === 'WFS')) {
            sqlDatensatzQuery += ` AND di."Typ" = $2`;
            datensatzParams.push(dienstTyp); // Füge den dienstTyp zum Parameter-Array hinzu
        }

        const resultDatensatz = await pool.query(sqlDatensatzQuery, datensatzParams);


        // Anwendungen
        let sqlAnwendungenQuery = `
            SELECT
                DISTINCT a."Bezeichnung" as anwendung_name
            FROM
                "Dienst" di
            LEFT JOIN
                "Dienst_Anwendung" da on da."DienstID" = di."MetadatenUUID"
            LEFT JOIN
                "Anwendung" a on a."MetadatenUUID" = da."AnwendungID"
            WHERE 
                di."Bezeichnung" ILIKE $1`;
        let anwendungenParams = [`%${query}%`];

        // Überprüft, ob dienstTyp gültig ist
        if (dienstTyp && (dienstTyp === 'WMS' || dienstTyp === 'WFS')) {
            sqlAnwendungenQuery += ` AND di."Typ" = $2`;
            anwendungenParams.push(dienstTyp); // Füge den dienstTyp zum Parameter-Array hinzu
        }

        const resultsAnwendungen = await pool.query(sqlAnwendungenQuery, anwendungenParams);






        res.json({

            metadata: resultDienste.rows,
            Datensaetze: resultDatensatz.rows,
            Anwendungen: resultsAnwendungen.rows

        });


    }catch(err){
        console.error(err);
        res.status(500).send('Fehler bei der Suche nach Dienst');
    }
});

module.exports = router;