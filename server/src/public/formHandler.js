
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