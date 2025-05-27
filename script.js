const database = firebase.database();

// Startseite -> Karte anzeigen
const startButton = document.getElementById("startButton");
const intro = document.getElementById("intro");
const mapContainer = document.getElementById("mapContainer");
startButton.addEventListener("click", () => {
  intro.classList.add("hidden");
  mapContainer.classList.remove("hidden");
});

// Karte initialisieren
const map = L.map('mapOverlay', {
  crs: L.CRS.Simple,
  minZoom: -2,
  maxZoom: 2,
  zoomSnap: 0.5,
  zoomControl: true,
  attributionControl: false,
});

const imageBounds = [[0, 0], [3508, 2480]];
L.imageOverlay('waldgartenkarte.png', imageBounds).addTo(map);
map.setMaxBounds(imageBounds);
map.options.maxBoundsViscosity = 1.0;
map.setView([1754, 1240], 0); // Bildmitte zentriert
// Marker-Icons
const icons = {
  plant: L.icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/2909/2909763.png', iconSize: [32, 32] }),
  insect: L.icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/616/616408.png', iconSize: [32, 32] }),
  soil: L.icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/3540/3540744.png', iconSize: [32, 32] }),
  other: L.icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/565/565547.png', iconSize: [32, 32] })
};

// Formular anzeigen beim Klick auf Karte
let lastLatLng;
map.on('click', (e) => {
  lastLatLng = e.latlng;
  const popupForm = document.getElementById("popupForm");
  popupForm.style.left = `${e.containerPoint.x}px`;
  popupForm.style.top = `${e.containerPoint.y}px`;
  popupForm.classList.remove("hidden");
  document.getElementById("popupDetails").innerHTML = "";
  document.getElementById("popupCategory").value = "";
});

// Formularfelder nach Auswahl anzeigen
const popupCategory = document.getElementById("popupCategory");
popupCategory.addEventListener("change", () => {
  const type = popupCategory.value;
  const container = document.getElementById("popupDetails");
  if (!type) return;
  let formHtml = `<form id="entryForm">
    <label>Datum:<br><input type="date" name="date" required></label><br>
    <label>Finder*in:<br><input type="text" name="finder" required></label><br>
  `;
  if (type === "plant") {
    formHtml += `<label>Lateinischer Name:<br><input type="text" name="latinName" required></label><br>
    <label>Pflanzenfamilie:<br><input type="text" name="family"></label><br>`;
  } else if (type === "insect") {
    formHtml += `<label>Artname:<br><input type="text" name="insectName" required></label><br>`;
  } else if (type === "soil") {
    formHtml += `<label>Probennummer:<br><input type="text" name="sampleId" required></label><br>
    <label>Tiefe (cm):<br><input type="number" name="depth"></label><br>`;
  } else {
    formHtml += `<label>Beschreibung:<br><input type="text" name="description" required></label><br>`;
  }
  formHtml += `<button type="submit">Speichern</button></form>`;
  container.innerHTML = formHtml;
});

// Formular absenden und Marker speichern
const popupForm = document.getElementById("popupForm");
document.addEventListener("submit", function (e) {
  e.preventDefault();
  const form = e.target;
  const data = {};
  const formData = new FormData(form);
  formData.forEach((value, key) => data[key] = value);
  data.timestamp = new Date().toISOString();
  data.lat = lastLatLng.lat;
  data.lng = lastLatLng.lng;
  data.type = popupCategory.value;

  database.ref("funde").push(data).then(() => {
    addMarker(data);
    popupForm.classList.add("hidden");
  });
});

// Marker setzen + Popup bei Klick
function addMarker(data) {
  const marker = L.marker([data.lat, data.lng], {
    icon: icons[data.type] || icons.other
  }).addTo(map);

  let content = `<strong>Typ:</strong> ${data.type}<br><strong>Datum:</strong> ${data.date}<br><strong>Finder*in:</strong> ${data.finder}<br>`;
  if (data.latinName) content += `<strong>Name:</strong> ${data.latinName}<br>`;
  if (data.insectName) content += `<strong>Insekt:</strong> ${data.insectName}<br>`;
  if (data.sampleId) content += `<strong>Probe:</strong> ${data.sampleId}, Tiefe: ${data.depth || '-'} cm<br>`;
  if (data.description) content += `<strong>Beschreibung:</strong> ${data.description}<br>`;
  if (data.family) content += `<strong>Familie:</strong> ${data.family}<br>`;

  marker.bindPopup(content);
}

// Bestehende Daten laden
database.ref("funde").once("value").then(snapshot => {
  snapshot.forEach(entry => addMarker(entry.val()));
});