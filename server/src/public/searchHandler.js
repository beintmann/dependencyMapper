
//on Input
document.getElementById("search").addEventListener("input", async function(){
    const query = this.value;
    const selectedType = document.getElementById("slct-feld").value;

    // Erstellt eine Vorschlagliste bei einer Eingabe von 2 oder Mehr
    if (query.length > 2){
        const response = await fetch(`/recommended?q=${query}&v=${selectedType}`);
        const suggestions = await response.json();
        console.log(suggestions)
        const SuggestionList = document.getElementById("suggestions")

        //leert die liste jedes Mal wenn etwas neues eingegeben wird
        SuggestionList.innerHTML = ""


        // erstellt Listenelemente in der SuggestionList für jedes Objekt vom typ Bezeichnung, das in der JSON-Response zurückgegeben wurde
        suggestions.forEach(suggestion => {
            const li = document.createElement("li")
            li.textContent = suggestion.Bezeichnung;
            SuggestionList.appendChild(li);

            li.addEventListener("click", () => {
                document.getElementById("search").value = suggestion.Bezeichnung; //setzt den Wert des suchfeldes gleich mit dem geklickten Vorschlag

                SuggestionList.innerHTML = "" //leert die Vorschläge wenn auf einen Vorschlag geklcikt wurde
            });


        });
    }else {
        document.getElementById("suggestions").innerHTML = ""; //wenn Eingabe kürzer als 2 wird die Vorschlagliste wieder geleert
    }
});

//on sumbit

document.getElementById("search-form").addEventListener("submit", async function(event){
    event.preventDefault(); //verhindert das standart submit-verhalten des formulars

    clearSubContainers();

    const query = document.getElementById("search").value;
    const selectedType = document.getElementById("slct-feld").value;

    // Bewegt das Suchformular nach oben
    const searchForm = document.getElementById("search-form");
    searchForm.style.position = "fixed"
    searchForm.style.top = "0";


    // Zeige die Metadaten-Div an
    const metadataDiv = document.getElementById("metadata");
    metadataDiv.style.display = "block";
    metadataDiv.textContent = "Hier Könnten Ihre Metadaten Stehen"

    //Anfrage mit parametern an die /search Route als POST
    const response = await fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, type: selectedType })
    });

    // zum testen ausgabe der ergebnisse in der konsole
    const results = await response.json();
    console.log(results);



    //Logik für Befüllung der Container mit den Daten aus der Response

    const resultContainer = document.getElementById("results-container");
    resultContainer.style.display = "flex"

    const anwendungContainer = document.getElementById("anwendungen-container");
    anwendungContainer.className = "sub-container"

    const dienstContainer = document.getElementById("dienste-container");
    dienstContainer.className = "sub-container"

    if (results.Dienste) {
        dienstContainer.style.display = "flex"
        //füllt rechte liste mit diensten
        results.Dienste.forEach(dienst => {
            const dienstElement = document.createElement("dienst-element")
            dienstElement.className = "sub-element"
            dienstElement.textContent = dienst.dienst_name
            dienstContainer.appendChild(dienstElement);
        });
    }

    if (results.Anwendungen) {
        anwendungContainer.style.display = "flex"

        // füllt linke liste mit Anwendungen
        results.Anwendungen.forEach(anwendung => {
            const anwendungElement = document.createElement("anwendung-element")
            anwendungElement.className = "sub-element"
            anwendungElement.textContent = anwendung.anwendung_name
            anwendungContainer.appendChild(anwendungElement);
        })

    }
})


function clearSubContainers() {
    // Wähle alle divs mit der Klasse 'sub-container'
    const subContainers = document.querySelectorAll('.sub-container');

    // Iteriere über die ausgewählten Elemente und setze den textContent auf einen leeren String
    subContainers.forEach(container => {
        container.textContent = ''; // Leere den Inhalt
        container.style.display = "none" //macht ihn wieder unsichtbar falls in der nächsten suche ein anderer typ gesucht wird
    });
}