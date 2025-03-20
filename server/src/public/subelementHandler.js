// async function subelementFetch() {
//     const dienstElement = document.getElementById('dienst-element');
//
//     dienstElement.addEventListener('click', async () => {
//         const selectedType = 'Dienst';
//         const query = dienstElement.textContent;
//
//         try {
//             const response = await fetch(`/search/${selectedType}`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ query, type: selectedType })
//             });
//
//             const data = await response.json();
//             console.log("subelement fetch war: " + data);
//         }catch(err){
//             console.error(err);
//         }
//     });
// }

// async function subelementFetch() {
//
//
//     const elements = document.querySelectorAll('.sub-element');
//     console.log(elements)
//
//     elements.forEach(element => {
//
//         const selectedType = element.tagName.toLowerCase().split('-')[0].charAt(0).toUpperCase() + element.tagName.toLowerCase().split('-')[0].slice(1);
//         console.log("Typ = " + selectedType)
//         //ändert die ausgewählte option auf den gewählten typ
//         const slctFeld = document.getElementById('slct-feld');
//         for (let option of slctFeld.options) {
//
//             if (option.value == selectedType) {
//                 option.selected = true;
//                 break;
//             }
//         }
//
//         element.addEventListener('click', async () => {
//             const query = element.textContent;
//
//             try {
//                 const response = await fetch(`/search/${selectedType}`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify({ query, type: selectedType })
//                 });
//
//                 const results = await response.json();
//                 console.log(`${selectedType} fetch war: `)
//                 console.log( results);
//
//                 updateResults(results);
//             } catch (err) {
//                 console.error(err);
//             }
//         });
//     });
// }
//
// function removeSubElementListeners() {
//     const subElements = document.querySelectorAll('.sub-element');
//
//     subElements.forEach(element => {
//         const newElement = element.cloneNode(true); // Klonen des Elements, um den Event-Listener zu entfernen
//         element.parentNode.replaceChild(newElement, element); // Ersetzen des alten Elements durch das neue
//     });
// }
//
// function updateResults(results) {
//
//     clearSubContainers();
//     if(results.metadata.length > 1) {
//         alert("Etwas stimmt nicht mit dem Suchbegriff. Bitte überprüfen Sie Ihre Eingaben.")
//     }else {
//
//
//         // Bewegt das Suchformular nach oben
//         const searchForm = document.getElementById("search-form");
//         searchForm.style.position = "fixed"
//         searchForm.style.top = "0";
//         adjustContentMargin();
//
//         // Zeige die metadata-div an
//         const metadataDiv = document.getElementById("metadata");
//         metadataDiv.style.display = "block";
//         metadataDiv.innerHTML = "<h3 id='metadaten_header'><strong><u>Metadaten:</u></strong></h3>"
//
//         //Logik für Befüllung der Container mit den Daten aus der Response
//
//         const resultContainer = document.getElementById("results-container");
//         resultContainer.style.display = "flex"
//
//         const anwendungContainer = document.getElementById("anwendungen-container");
//         anwendungContainer.className = "sub-container"
//
//         const dienstContainer = document.getElementById("dienste-container");
//         dienstContainer.className = "sub-container"
//
//         const serverContainer = document.getElementById("server-container");
//         serverContainer.className = "sub-container"
//
//         const datenbankenContainer = document.getElementById("datenbanken-container");
//
//         const datensatzContainer = document.getElementById("datensatz-container");
//
//         //logik um metadaten auszulesen
//         if (results.metadata) {
//             results.metadata.forEach(properties => {
//
//                 for (const value in properties) {
//
//                     const newParagraph = document.createElement('p');
//
//                     // Sorgt dafür dass die property fettgedruckt ist
//                     const strongElement = document.createElement('strong');
//                     strongElement.textContent = `${value}: `;
//                     newParagraph.appendChild(strongElement);
//
//                     // Füge den Wert der property als Textknoten hinzu
//                     newParagraph.appendChild(document.createTextNode(properties[value]));
//
//                     // Füge den Paragraphen zum metadataDiv hinzu
//                     metadataDiv.appendChild(newParagraph);
//                 }
//             });
//         }
//
//
//         if (results.Dienste) {
//             dienstContainer.style.display = "flex"
//             dienstContainer.innerHTML = '<h3>Dienste:</h3>'
//
//
//             //füllt container mit Dienst-elementen
//             results.Dienste.forEach(dienst => {
//                 const dienstElement = document.createElement("dienst-element")
//                 dienstElement.className = "sub-element"
//                 dienstElement.textContent = dienst.dienst_name
//                 dienstContainer.appendChild(dienstElement);
//             });
//         }
//
//         if (results.Anwendungen) {
//             anwendungContainer.style.display = "flex"
//             anwendungContainer.innerHTML = '<h3>Anwendungen:</h3>'
//
//             // füllt container mit anwendungs-elementen
//             results.Anwendungen.forEach(anwendung => {
//                 const anwendungElement = document.createElement("anwendung-element")
//                 anwendungElement.className = "sub-element"
//                 anwendungElement.textContent = anwendung.anwendung_name
//                 anwendungContainer.appendChild(anwendungElement);
//             });
//
//         }
//         if (results.Server) {
//             serverContainer.style.display = "flex"
//             serverContainer.innerHTML = '<h3>Server:</h3>'
//
//             // füllt container mit server-elementen
//             results.Server.forEach(server => {
//                 const serverElement = document.createElement("server-element")
//                 serverElement.className = "sub-element"
//                 serverElement.textContent = server.server_name
//                 serverContainer.appendChild(serverElement);
//             });
//
//         }
//
//         if (results.Datenbanken) {
//             datenbankenContainer.style.display = "flex";
//             datenbankenContainer.innerHTML = '<h3>Datenbanken:</h3>'
//
//             // füllt container mit datenbank-elementen
//             results.Datenbanken.forEach(datenbank => {
//                 const datenbankElement = document.createElement("datenbank-element")
//                 datenbankElement.className = "sub-element"
//                 datenbankElement.textContent = datenbank.datenbank_name
//                 datenbankenContainer.appendChild(datenbankElement);
//             });
//         }
//
//         if (results.Datensaetze) {
//             datensatzContainer.style.display = "flex"
//             datensatzContainer.innerHTML = '<h3>Datensätze</h3>'
//
//             results.Datensaetze.forEach(datensatz => {
//                 const datensatzElement = document.createElement("datensatz-element")
//                 datensatzElement.className = "sub-element"
//                 datensatzElement.textContent = datensatz.datensatz_name
//                 datensatzContainer.appendChild(datensatzElement);
//             });
//         }
//     }
// }

