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

//Schutz vor SQL-Injection -- erlaubte Tabellennamen in der Anfrage
const allowedTables = ['Datensatz', 'Dienst', 'Anwendung'];

//Route für Suche nach Datensatz
router.post("/Datensatz", async (req, res) => {

    //holt sich die Variablen aus dem Body
    const {query, type} = req.body;

    try {
        if (!allowedTables.includes(type)) {
            return res.status(400).json({error: 'Invalid table name'});
        }

        //Suche, wenn nach einem Datensatz gesucht wird
        if (type == 'Datensatz') {

            const resultDienste = await pool.query(
                `SELECT dienst."Bezeichnung" AS dienst_name, dienst."Typ" AS dienst_typ
                 FROM "Datensatz" data
                          LEFT JOIN
                      "Datensatz_Dienst" dd ON data."DatensatzID" = dd."DatensatzID"
                          LEFT JOIN
                      "Dienst" dienst ON dd."DienstID" = dienst."MetadatenUUID"

                 WHERE data."Bezeichnung" ILIKE $1;`, [`%${query}%`]
            );

            const resultAnwendungen = await pool.query(
                `SELECT DISTINCT anwendung."Bezeichnung" AS anwendung_name -- Name der Anwendung

                 FROM "Datensatz" d

                          LEFT JOIN
                      "Datensatz_Dienst" dd ON d."DatensatzID" = dd."DatensatzID"
                          LEFT JOIN
                      "Dienst" di ON dd."DienstID" = di."MetadatenUUID"
                          LEFT JOIN
                      "Dienst_Anwendung" relDienstAnw ON di."MetadatenUUID" = relDienstAnw."DienstID"
                          LEFT JOIN
                      "Anwendung" anwendung ON relDienstAnw."AnwendungID" = anwendung."MetadatenUUID"
                          LEFT JOIN
                      "Server_Anwendung" sa ON anwendung."MetadatenUUID" = sa."AnwendungID"
                          LEFT JOIN
                      "Server" s ON sa."ServerID" = s."ServerID"
                 WHERE d."Bezeichnung" ILIKE $1;`, [`%${query}%`]
            );

            const resultDatensatz = await pool.query(`

                SELECT d.* AS metadata

                FROM "Datensatz" d

                WHERE d."Bezeichnung" ILIKE $1;`, [`%${query}%`]
            );

            res.json({
                Dienste: resultDienste.rows,
                Anwendungen: resultAnwendungen.rows,
                metadata: resultDatensatz.rows
            });


        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Fehler bei der Suche nach Datensätzen');
    }
});

router.post("/Anwendung", async (req, res) => {

    //holt sich die Variablen aus dem Body
    const {query, type} = req.body;

    try {
        if (!allowedTables.includes(type)) {
            return res.status(400).json({error: 'Invalid table name'});
        }

        const resultAnwendungen = await pool.query(`

            SELECT a.* AS metadata

            FROM "Anwendung" a

            WHERE a."Bezeichnung" ILIKE $1;`, [`%${query}%`]
        );

        const resultDienste = await pool.query(
            `SELECT Distinct d."Bezeichnung" AS dienst_name, d."Typ" AS dienst_typ
             FROM "Anwendung" a
                      LEFT JOIN
                  "Dienst_Anwendung" da ON a."MetadatenUUID" = da."AnwendungID"
                      LEFT JOIN
                  "Dienst" d ON da."DienstID" = d."MetadatenUUID"
             WHERE a."Bezeichnung" ILIKE $1;`, [`%${query}%`]
        );

        const resultServer = await pool.query(
            `SELECT DISTINCT s."Name" AS server_name
             FROM "Anwendung" a
                      LEFT JOIN
                  "Server_Anwendung" sa ON a."MetadatenUUID" = sa."AnwendungID"
                      LEFT JOIN
                  "Server" s ON sa."ServerID" = s."ServerID"
             WHERE a."Bezeichnung" ILIKE $1;`, [`%${query}%`]
        );

        const resultDatenbank = await pool.query(
            `SELECT DISTINCT d."Name" as datenbank_name
             FROM "Anwendung" a
                      LEFT JOIN
                  "Anwendung_Datenbank" ad on ad."AnwendungID" = a."MetadatenUUID"
                      Left JOIN
                  "Datenbank" d on d."Name" = ad.name_datenbank
             WHERE a."Bezeichnung" ILIKE $1;`, [`%${query}%`]
        );

        res.json({

            metadata: resultAnwendungen.rows,
            Dienste: resultDienste.rows,
            Server: resultServer.rows,
            Datenbanken: resultDatenbank.rows
        });


    } catch (err) {
        console.error(err);
        res.status(500).send('Fehler bei der Suche nach Anwendungen');
    }
});

//Route wenn Dienst ausgewählt ist
router.post("/Dienst", async (req, res) => {

    //holt sich die Variablen aus dem Body
    const {query, type, dienstTyp} = req.body;

    try {
        if (!allowedTables.includes(type)) {
            return res.status(400).json({error: 'Invalid table name'});
        }


        //baut SQL-Query je nachdem ob der dienstTyp gesetzt ist oder nicht
        let sqlQuery = `
            SELECT di.* AS metadata
            FROM "Dienst" di
            WHERE di."Bezeichnung" ILIKE $1`;

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
            SELECT DISTINCT d."Bezeichnung" AS datensatz_name
            FROM "Dienst" di
                     LEFT JOIN
                 "Datensatz_Dienst" dd on dd."DienstID" = di."MetadatenUUID"
                     LEFT JOIN
                 "Datensatz" d on d."DatensatzID" = dd."DatensatzID"
            WHERE di."Bezeichnung" ILIKE $1`;
        let datensatzParams = [`%${query}%`];

        // Überprüft, ob dienstTyp gültig ist
        if (dienstTyp && (dienstTyp === 'WMS' || dienstTyp === 'WFS')) {
            sqlDatensatzQuery += ` AND di."Typ" = $2`;
            datensatzParams.push(dienstTyp); // Füge den dienstTyp zum Parameter-Array hinzu
        }

        const resultDatensatz = await pool.query(sqlDatensatzQuery, datensatzParams);


        // Anwendungen
        let sqlAnwendungenQuery = `
            SELECT DISTINCT a."Bezeichnung" as anwendung_name
            FROM "Dienst" di
                     LEFT JOIN
                 "Dienst_Anwendung" da on da."DienstID" = di."MetadatenUUID"
                     LEFT JOIN
                 "Anwendung" a on a."MetadatenUUID" = da."AnwendungID"
            WHERE di."Bezeichnung" ILIKE $1`;
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


    } catch (err) {
        console.error(err);
        res.status(500).send('Fehler bei der Suche nach Dienst');
    }
});

router.post("/Server", async (req, res) => {

    //holt sich die Variablen aus dem Body
    const {query, type} = req.body;

    try {
        if (!allowedTables.includes(type)) {
            return res.status(400).json({error: 'Invalid table name'});
        }

        const queryResultServer = await pool.query(
            `SELECT se.* as metadata
            FROM
            "Server" se
            WHERE se."Name" ILIKE $1`, [`%${query}%`]
        );

        const queryResultDatenbank = await pool.query(
            `
                SELECT dab."Name" as db_name
                FROM "Server" se
                         JOIN "DB_Instanz" as dbi
                              ON se."ServerID" = dbi."ServerID"
                         JOIN "Datenbank" as dab
                              ON dbi."Instanz" = dab."DB_Instanz"
                WHERE se."Name" ILIKE $1`, [`%${query}%`]
        );

        const queryResult





    }   catch (err) {
        console.error(err);
        res.status(500).send('Fehler bei der Suche nach Server');
    }
});

module.exports = router;