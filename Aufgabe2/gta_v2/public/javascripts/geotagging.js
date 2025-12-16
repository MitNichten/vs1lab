// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

/**
  * A class to help using the HTML5 Geolocation API.
  */


/**
 * A class to help using the Leaflet map service.
 */

const mapManager = new MapManager();
/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
function updateLocation() {
  // 1) Formularfelder auslesen
  const tagLat = document.getElementById("latitude");
  const tagLon = document.getElementById("longitude");

  // Hilfsfunktion: Tags aus data-tags lesen und in Array umwandeln
  const readTagsFromDom = () => {
    const mapDiv = document.getElementById("map");
    if (!mapDiv) return [];

    const tagsJson = mapDiv.dataset.tags; // liest data-tags="..."
    if (!tagsJson) return [];

    try {
      return JSON.parse(tagsJson);
    } catch (e) {
      console.error("Could not parse data-tags JSON:", e);
      return [];
    }
  };

  // Prüfen, ob Koordinaten schon vorhanden sind
  const latAlreadySet = tagLat && tagLat.value !== "";
  const lonAlreadySet = tagLon && tagLon.value !== "";

  // 2) FALL A: Koordinaten sind schon da → KEIN GeoLocation-Aufruf
  if (latAlreadySet && lonAlreadySet) {
    const latitude = tagLat.value;
    const longitude = tagLon.value;

    // Karte direkt initialisieren
    mapManager.initMap(latitude, longitude);
    mapManager.updateMarkers(latitude, longitude, tags);

    return; // wichtig: Funktion hier beenden
  }

  // 3) FALL B: Koordinaten fehlen → GeoLocation API verwenden
  try {
    LocationHelper.findLocation((helper) => {
      const latitude = helper.latitude;
      const longitude = helper.longitude;

      // Formulare füllen
      if (tagLat) tagLat.value = latitude;
      if (tagLon) tagLon.value = longitude;

      const discLat = document.getElementById("disc-latitude");
      const discLon = document.getElementById("disc-longitude");

      if (discLat) discLat.value = latitude;
      if (discLon) discLon.value = longitude;

      // Karte initialisieren
      mapManager.initMap(latitude, longitude);
      mapManager.updateMarkers(latitude, longitude, tags);

      // Platzhalter entfernen
      const mapContainer = document.getElementById("map");
      if (mapContainer) {
        const img = mapContainer.querySelector("img");
        const span = mapContainer.querySelector("span");
        if (img) img.remove();
        if (span) span.remove();
      }
    });
  } catch (err) {
    console.error("Geolocation API not available:", err);
  }
}


// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});
//updates location when document is loaded