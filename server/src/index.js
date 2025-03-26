// Minimal Express server that connects to a PostgreSQL database and returns the rows of a table
const express = require('express');
const app = express();
const port = 3000;
const routes = require('./routes'); // Importiere die Routen

app.use(express.static('src/public'));
app.use(express.json());
app.use('/', routes); // Verwende die Routen

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
