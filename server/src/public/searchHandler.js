
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

    const query = document.getElementById("search").value;
    const selectedType = document.getElementById("slct-feld").value;

    // Bewegt das Suchformular nach oben
    const searchForm = document.getElementById("search-form");
    searchForm.style.transform = "translateY(-40vh)";

    //Anfrage mit parametern an die /search Route
    const response = await fetch (`/search?q=${query}&v=${selectedType}`);




})