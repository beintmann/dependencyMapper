const express = require('express');
const router = express.Router();

// Route für die Hauptseite
router.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <link rel="stylesheet" type="text/css" href="/styles.css">
        <script src="/searchHandler.js" defer ></script>
        <script src="/formHandler.js" defer ></script>
       
        
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

module.exports = router;