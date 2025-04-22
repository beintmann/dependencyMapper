//funktion um die Margin der Metadaten-div an die höhe der Such-div anzupassen
function adjustContentMargin() {
    const fixedDiv = document.getElementById('search-form');
    const metadataDiv = document.getElementById('metadata');

    // Ermitteln der Höhe der fixierten Div
    const fixedDivHeight = fixedDiv.offsetHeight;

    // Setzen der Margin-Top der metadatenDiv
    metadataDiv.style.marginTop = fixedDivHeight + 'px';
}

window.onload = adjustContentMargin;
window.onresize = adjustContentMargin;
