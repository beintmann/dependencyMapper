//funktion um die Margin der Metadaten-div an die höhe der Such-div anzupassen
function adjustContentMargin() {
    const fixedDiv = document.getElementById('search-form');
    const metadataDiv = document.getElementById('metadata');

    // Ermitteln der Höhe der fixierten Div
    const fixedDivHeight = fixedDiv.offsetHeight;

    // Setzen der Margin-Top der metadatenDiv
    metadataDiv.style.marginTop = fixedDivHeight + 'px';
}

function adjustFontSize(){

    document.querySelectorAll(".sub-element").forEach(element => {
        const subelementText = element.textContent
        const textLength = element.textContent.length

        let newFontSize = '19px'

        if (textLength < 10) {
            newFontSize = "22px"
        }
        if (textLength > 20) {
            newFontSize = "16px"
        }

        element.style.fontSize = newFontSize;
    })

}

window.onload = adjustContentMargin;
window.onresize = adjustContentMargin;
