// Minimal Express server that connects to a PostgreSQL database and returns the rows of a table
const express = require('express');
const app = express();
const port = 3000;

const dashboard = require('./routes/dashboard'); // Importiert die Routen
const recommended = require('./routes/recommended'); // Importiert die Routen
const search = require('./routes/search'); // Importiert die Routen

app.use(express.static('src/public'));
app.use(express.json());

app.use('/dashboard', dashboard);
app.use('/recommended', recommended);
app.use('/search/', search)

app.listen(port, () => {
    console.log(`Dependency Mapper listening on port ${port}`);
});
