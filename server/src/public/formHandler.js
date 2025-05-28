
//funktion um die Margin der Metadaten-div an die höhe der Such-div anzupassen
function adjustContentMargin() {
    const fixedDiv = document.getElementById('search-form');
    const metadataDiv = document.getElementById('metadata');

    // Ermitteln der Höhe der fixierten Div
    const fixedDivHeight = fixedDiv.offsetHeight;

    // Setzen der Margin-Top der metadatenDiv
    metadataDiv.style.marginTop = fixedDivHeight + 'px';
}

// Passt die schriftgröße an die menge an Text in den subelementen an
function adjustFontSize(){

    document.querySelectorAll(".sub-element").forEach(element => {
        const textLength = element.textContent.length

        let newFontSize = '19px'


        if (textLength > 20) {
            newFontSize = "16px"
        }

        element.style.fontSize = newFontSize;
    })

}

function createAndFillSubelement(container, containerTitel, queryErgebnisItems, itemName, elementTag){
    if (queryErgebnisItems && queryErgebnisItems.length > 0) {
        container.style.display = "flex";
        const header = document.createElement("h3");
        header.textContent = containerTitel;
        container.appendChild(header);

        // schleife um Kategorie-Container mit subelementen zu füllen
        queryErgebnisItems.forEach(item => {
            const subelement =document.createElement(elementTag);
            subelement.className = "sub-element";
            if (containerTitel === "Dienste:"){
                subelement.textContent = item[itemName] + " | " + item.dienst_typ;
                container.appendChild(subelement);
            }
            else{
                subelement.textContent = item[itemName];
                container.appendChild(subelement);
            }

        });

    }
}

window.onload = adjustContentMargin;
window.onresize = adjustContentMargin;
