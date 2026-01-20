// File origin: VS1LAB A4 (based on A2)

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console.
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

class GeoTag {
  constructor(name, latitude, longitude, hashtag) {
    this.name = name;
    this.latitude = Number(latitude);
    this.longitude = Number(longitude);
    this.hashtag = hashtag;
  }
}

const mapManager = new MapManager();

/**
 * TODO: 'updateDiscoveryWidget'
 * Update discovery results and map without reloading the page.
 */
function updateDiscoveryWidget(tags) {
  const ul = document.getElementById("discoveryResults");
  if (ul) {
    ul.innerHTML = "";
    (tags || []).forEach((t) => {
      const li = document.createElement("li");
      li.textContent = `${t.name} (${t.latitude},${t.longitude}) ${t.hashtag || ""}`;
      ul.appendChild(li);
    });
  }

  const lat =
    document.getElementById("disc-latitude")?.value ||
    document.getElementById("latitude")?.value;
  const lon =
    document.getElementById("disc-longitude")?.value ||
    document.getElementById("longitude")?.value;

  // Marker werden clientseitig aktualisiert (kein Server-Render mehr)
  if (lat && lon) {
    mapManager.updateMarkers(Number(lat), Number(lon), tags || []);
  }

  const mapDiv = document.getElementById("map");
  if (mapDiv) mapDiv.dataset.tags = JSON.stringify(tags || []);
}

/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
function updateLocation() {
  const tagLat = document.getElementById("latitude");
  const tagLon = document.getElementById("longitude");
  const discLat = document.getElementById("disc-latitude");
  const discLon = document.getElementById("disc-longitude");

  if (tagLat?.value && tagLon?.value) {
    if (discLat) discLat.value = tagLat.value;
    if (discLon) discLon.value = tagLon.value;
    mapManager.initMap(tagLat.value, tagLon.value);
    return;
  }

  LocationHelper.findLocation((helper) => {
    if (tagLat) tagLat.value = helper.latitude;
    if (tagLon) tagLon.value = helper.longitude;
    if (discLat) discLat.value = helper.latitude;
    if (discLon) discLon.value = helper.longitude;
    mapManager.initMap(helper.latitude, helper.longitude);
  });
}

/**
 * TODO: 'registerHandlers'
 * Register event listeners and prevent default form submission.
 */

// Zentrale Umstellung von Formular-Submit zu EventListener + AJAX
function registerHandlers() {
  const tagForm = document.getElementById("tag-form");
  const discoveryForm = document.getElementById("discoveryFilterForm");

  tagForm.addEventListener("submit", async (e) => {
    e.preventDefault(); //verhindert refresh
    if (!tagForm.checkValidity()) return tagForm.reportValidity(); //ob der neue tag regelkonform ist

    // GeoTag wird  erzeugt
    const tag = new GeoTag(
      document.getElementById("name").value,
      document.getElementById("latitude").value,
      document.getElementById("longitude").value,
      document.getElementById("hashtag").value
    );

     // AJAX POST mit JSON statt Form-Submit
    const resp = await fetch("/api/geotags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tag),
    });
    if (!resp.ok) return; //checkt obs geklappt hat, sonst return

    updateDiscoveryWidget(await searchGeoTags());
  });


  // Discovery-Formular = AJAX GET statt POST + Render
  discoveryForm.addEventListener("submit", async (e) => {
    e.preventDefault(); //refresh verhindern
    if (!discoveryForm.checkValidity()) return discoveryForm.reportValidity();
    updateDiscoveryWidget(await searchGeoTags());
  });
}

/**
 * TODO: 'searchGeoTags'
 * Perform an AJAX request to retrieve GeoTags from the server.
 */
async function searchGeoTags() {
  const lat = document.getElementById("disc-latitude")?.value ?? "";
  const lon = document.getElementById("disc-longitude")?.value ?? "";
  const searchterm = document.getElementById("searchterm")?.value ?? "";

  const qs = new URLSearchParams(); //
  if (lat) qs.set("latitude", lat);
  if (lon) qs.set("longitude", lon);
  if (searchterm) qs.set("searchterm", searchterm);

  const resp = await fetch(`/api/geotags?${qs.toString()}`); //
  if (!resp.ok) return [];
  return resp.json(); //
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", async () => {
  updateLocation();
  registerHandlers();
  try {
    updateDiscoveryWidget(await searchGeoTags());
  } catch (_) {}
});
