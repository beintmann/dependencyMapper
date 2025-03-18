
//ändert die action passend zum im select ausgewählten wert
document.getElementById('slct-feld').addEventListener('change', function() {
    const selectedValue = this.value;
    const form = document.getElementById('search-form');

    // Setze die action basierend auf der Auswahl
    if (selectedValue === 'Datensatz') {
        form.action = '/search';
    } else if (selectedValue === 'Anwendung') {
        form.action = '/search/anwendung';
    } else if (selectedValue === 'Dienst') {
        form.action = '/search/dienst';
    }
});

//funktion um die Margin der Metadaten-div an die höhe der Such-div anzupassen
function adjustContentMargin() {
    const fixedDiv = document.getElementById('search-form');
    const metadataDiv = document.getElementById('metadata');

    // Ermitteln der Höhe der fixierten Div
    const fixedDivHeight = fixedDiv.offsetHeight;

    // Setzen der Margin-Top der metadatenDiv
    metadataDiv.style.marginTop = fixedDivHeight + 'px';
}

// Aufruf der Funktion beim Laden der Seite
window.onload = adjustContentMargin;

//Aufruf der Funktion, wenn die Fenstergröße geändert wird
window.onresize = adjustContentMargin;