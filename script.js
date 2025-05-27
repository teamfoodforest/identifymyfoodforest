const database = firebase.database();

// Startbutton -> Intro ausblenden, Karte zeigen
document.getElementById("startButton").addEventListener("click", () => {
  document.getElementById("intro").classList.add("hidden");
  document.getElementById("mapContainer").classList.remove("hidden");
});

// Formular anzeigen bei Klick auf die Karte
document.getElementById("mapOverlay").addEventListener("click", () => {
  document.getElementById("formContainer").classList.remove("hidden");
});

// Kategorie-Auswahl → passendes Formular anzeigen
document.getElementById("categorySelect").addEventListener("change", (e) => {
  const selected = e.target.value;
  const area = document.getElementById("categoryFormArea");
  area.innerHTML = "";

  if (selected === "plant") {
    area.innerHTML = `
      <h3>Formular: Pflanze</h3>
      <form id="plantForm">
        <label>Lateinischer Name:<br><input type="text" name="latinName" required></label><br>
        <label>Pflanzenfamilie:<br><input type="text" name="family"></label><br>
        <label>Datum:<br><input type="date" name="date" required></label><br>
        <label>Name des Finders / der Finderin:<br><input type="text" name="finder"></label><br>
        <label>Bemerkung:<br><textarea name="notes"></textarea></label><br>
        <button type="submit">Eintrag speichern</button>
      </form>
    `;
  } else if (selected === "insect") {
    area.innerHTML = `
      <h3>Formular: Insekt</h3>
      <form id="insectForm">
        <label>Artname:<br><input type="text" name="insectName" required></label><br>
        <label>Datum:<br><input type="date" name="date" required></label><br>
        <label>Finder*in:<br><input type="text" name="finder"></label><br>
        <button type="submit">Eintrag speichern</button>
      </form>
    `;
  } else if (selected === "soil") {
    area.innerHTML = `
      <h3>Formular: Bodenprobe</h3>
      <form id="soilForm">
        <label>Probennummer:<br><input type="text" name="sampleId" required></label><br>
        <label>Tiefe (cm):<br><input type="number" name="depth"></label><br>
        <label>Datum:<br><input type="date" name="date"></label><br>
        <label>Finder*in:<br><input type="text" name="finder"></label><br>
        <button type="submit">Eintrag speichern</button>
      </form>
    `;
  } else if (selected === "other") {
    area.innerHTML = `
      <h3>Formular: Sonstiges</h3>
      <form id="otherForm">
        <label>Beschreibung:<br><input type="text" name="description" required></label><br>
        <label>Datum:<br><input type="date" name="date"></label><br>
        <button type="submit">Eintrag speichern</button>
      </form>
    `;
  }
});

// Formular speichern
document.addEventListener("submit", function (e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  data.timestamp = new Date().toISOString();

  database.ref("funde").push(data)
    .then(() => {
      alert("Fund wurde gespeichert!");
      form.reset();
      document.getElementById("formContainer").classList.add("hidden");
    })
    .catch((error) => {
      alert("Fehler beim Speichern: " + error.message);
    });
});

// 🌿 Leaflet-Karte mit deiner PNG
const map = L.map('mapOverlay', {
  crs: L.CRS.Simple,
  minZoom: -2,
  maxZoom: 2,
  zoomSnap: 0.5
});

const imageBounds = [[0, 0], [3508, 2480]]; // Höhe x Breite des Bildes
L.imageOverlay('waldgartenkarte.png', imageBounds).addTo(map);
map.fitBounds(imageBounds);
map.setMaxBounds(imageBounds);