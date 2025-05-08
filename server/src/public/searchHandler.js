const suggestionListElement = document.getElementById("suggestions");
document.getElementById("search").addEventListener("input", async function () {
    const query = this.value;
    const selectedType = document.getElementById("slct-feld").value;


    if (query.length <= 1) {
        suggestionListElement.innerHTML = ""
        const message = document.createElement("li")
        message.textContent = "Bitte mindestens zwei Buchstaben eingeben."
        suggestionListElement.appendChild(message)
        return;
    }

    // Erstellt eine Vorschlagliste bei einer Eingabe von 2 oder Mehr
    const suggestions = await fetch(`/recommended?q=${query}&v=${selectedType}`).then(r => r.json());

    //leert die liste jedes Mal, wenn etwas Neues eingegeben wird
    suggestionListElement.innerHTML = ""

    // erstellt Listenelemente in der suggestionListElement für jedes Objekt vom typ Bezeichnung, das in der JSON-Response zurückgegeben wurde
    suggestions.forEach(suggestion => {
        const li = document.createElement("li")
        li.textContent = suggestion.Bezeichnung;
        li.textContent += (`  |     ` + suggestion.Typ);
        suggestionListElement.appendChild(li);

        li.addEventListener("click", () => {
            document.getElementById("search").value = suggestion.Bezeichnung; //setzt den Wert des suchfeldes gleich mit dem geklickten Vorschlag
            window.suggestionType = suggestion.Typ;

            suggestionListElement.innerHTML = "" //leert die Vorschläge, wenn auf einen Vorschlag geklickt wurde
        });
    });

});

//on submit

document.getElementById("search-form").addEventListener("submit", async function (event) {
    event.preventDefault(); //verhindert das standart submit-verhalten des formulars

    clearSubContainers();
    suggestionListElement.innerHTML = "";

    const query = document.getElementById("search").value;
    const selectedType = document.getElementById("slct-feld").value;


    //Anfrage mit parametern an die /search Route als POST
    const response = await fetch(`/search/${selectedType}`, {
        method: 'POST', headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify({query, type: selectedType, dienstTyp: window.suggestionType})
    });


    const results = await response.json();

    if (results.metadata.length > 1) {
        alert("Der Suchbegriff scheint fehlerhaft zu sein. Bitte überprüfen Sie Ihre Eingaben.")
    } else {


        // Bewegt das Suchformular nach oben
        const searchForm = document.getElementById("search-form");
        searchForm.style.position = "sticky"
        searchForm.style.top = "0";
        adjustContentMargin();

        // Zeige die metadata-div an
        const metadataDiv = document.getElementById("metadata");
        metadataDiv.style.display = "block";
        metadataDiv.innerHTML = "<h3 id='metadaten_header'><strong><u>Metadaten:</u></strong></h3>"


        //Logik für Befüllung der Container mit den Daten aus der Response
        const resultContainer = document.getElementById("results-container");
        resultContainer.style.display = "flex"

        const anwendungContainer = document.getElementById("anwendungen-container");
        anwendungContainer.className = "sub-container"

        const dienstContainer = document.getElementById("dienste-container");
        dienstContainer.className = "sub-container"

        const serverContainer = document.getElementById("server-container");
        serverContainer.className = "sub-container"

        const datenbankenContainer = document.getElementById("datenbanken-container");

        const datensatzContainer = document.getElementById("datensatz-container");


        //logik um metadaten auszulesen
        if (results.metadata) {
            results.metadata.forEach(properties => {

                for (const value in properties) {

                    //neuer Paragraph um die Werte aus dem Rückgabeobjekt auszulesen und zu printen
                    const newParagraph = document.createElement('p');

                    // Sorgt dafür dass die property fettgedruckt ist
                    const strongElement = document.createElement('strong');
                    strongElement.textContent = `${value}: `;
                    newParagraph.appendChild(strongElement);

                    // Füge den Wert der property als Textknoten hinzu
                    newParagraph.appendChild(document.createTextNode(properties[value]));

                    // Füge den Paragraphen zum metadataDiv hinzu
                    metadataDiv.appendChild(newParagraph);
                }
            });
        }


        if (results.Dienste) {
            dienstContainer.style.display = "flex"
            dienstContainer.innerHTML = '<h3>Dienste:</h3>'


            //füllt container mit Dienst-elementen
            results.Dienste.forEach(dienst => {
                const dienstElement = document.createElement("dienst-element")
                dienstElement.className = "sub-element"
                dienstElement.textContent = dienst.dienst_name + " | " + dienst.dienst_typ
                dienstContainer.appendChild(dienstElement);
            });
        }

        if (results.Anwendungen) {
            anwendungContainer.style.display = "flex"
            anwendungContainer.innerHTML = '<h3>Anwendungen:</h3>'

            // füllt container mit anwendungs-elementen
            results.Anwendungen.forEach(anwendung => {
                const anwendungElement = document.createElement("anwendung-element")
                anwendungElement.className = "sub-element"
                anwendungElement.textContent = anwendung.anwendung_name
                anwendungContainer.appendChild(anwendungElement);
            });

        }
        if (results.Server) {
            serverContainer.style.display = "flex"
            serverContainer.innerHTML = '<h3>Server:</h3>'

            // füllt container mit server-elementen
            results.Server.forEach(server => {
                const serverElement = document.createElement("server-element")
                serverElement.className = "sub-element"
                serverElement.textContent = server.server_name
                serverContainer.appendChild(serverElement);
            });

        }

        if (results.Datenbanken) {
            datenbankenContainer.style.display = "flex";
            datenbankenContainer.innerHTML = '<h3>Datenbanken:</h3>'

            // füllt container mit datenbank-elementen
            results.Datenbanken.forEach(datenbank => {
                const datenbankElement = document.createElement("datenbank-element")
                datenbankElement.className = "sub-element"
                datenbankElement.textContent = datenbank.datenbank_name
                datenbankenContainer.appendChild(datenbankElement);
            });
        }

        if (results.Datensaetze) {
            datensatzContainer.style.display = "flex"
            datensatzContainer.innerHTML = '<h3>Datensätze</h3>'

            results.Datensaetze.forEach(datensatz => {
                const datensatzElement = document.createElement("datensatz-element")
                datensatzElement.className = "sub-element"
                datensatzElement.textContent = datensatz.datensatz_name
                datensatzContainer.appendChild(datensatzElement);
            });
        }

        // Füge Event-Listener für alle sub-elemente hinzu
        //TODO: check ob wms/WFS
        document.querySelectorAll(".sub-element").forEach(element => {
            element.addEventListener("click", function () {
                document.getElementById("search").value = element.textContent.split(" | ")[0];
                const elementTyp = element.tagName.toLowerCase().split('-')[0].charAt(0).toUpperCase() + element.tagName.toLowerCase().split('-')[0].slice(1);

                const slctFeld = document.getElementById('slct-feld');
                for (let option of slctFeld.options) {

                    if (option.value == elementTyp) {
                        option.selected = true;

                        if (option.value == "Dienst") {
                            window.suggestionType = element.textContent.split(" | ")[1]
                        }
                    break;
                    }
                }


                document.getElementById("submit-btn").click(); // Simuliere einen Klick auf den Suchbutton
            });
        });
    }
});


function clearSubContainers() {
    // Wählt alle divs mit der Klasse 'sub-container'
    const subContainers = document.querySelectorAll('.sub-container');

    // Iteriert über die ausgewählten Elemente und setzt den textContent auf einen leeren String
    subContainers.forEach(container => {
        container.textContent = ''; // Leere den Inhalt
        container.style.display = "none" //macht ihn wieder unsichtbar falls in der nächsten suche ein anderer typ gesucht wird
    });
}

