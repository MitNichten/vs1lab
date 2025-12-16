// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore {
  #geotags = [];

  addGeoTag(geotag) {
    this.#geotags.push(geotag);
  }

  removeGeoTag(name) {
    this.#geotags = this.#geotags.filter(gt => gt.name !== name);
  }

  // proximity ca 0.5 damit es ungefähr in der selben straße liegt
  getNearbyGeoTags(location) {
    const lat = location.latitude;
    const lon = location.longitude;
    const PROXIMITY = 0.05; 

    return this.#geotags.filter(gt => {
      return (
        Math.abs(gt.latitude - lat) <= PROXIMITY &&
        Math.abs(gt.longitude - lon) <= PROXIMITY
      );
    });
  }

  searchNearbyGeoTags(location, keyword) {
    const kw = keyword.toLowerCase();

    return this.getNearbyGeoTags(location).filter(gt => {
      return (
        gt.name.toLowerCase().includes(kw) ||
        gt.hashtag.toLowerCase().includes(kw)
      );
    });
  }
}

module.exports = InMemoryGeoTagStore;

