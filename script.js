document.getElementById("startButton").addEventListener("click", () => {
  document.getElementById("intro").classList.add("hidden");
  document.getElementById("mapContainer").classList.remove("hidden");
});

document.getElementById("mapOverlay").addEventListener("click", () => {
  document.getElementById("formContainer").classList.remove("hidden");
});

document.getElementById("plantForm").addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Fund gespeichert! (wird später in Datenbank gespeichert)");
  e.target.reset();
  document.getElementById("formContainer").classList.add("hidden");
});