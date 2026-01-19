// File origin: VS1LAB A3, A4

/**
 * This module provides an in-memory store for GeoTag objects.
 * It is used to add, remove and query GeoTags.
 */

class InMemoryGeoTagStore {

  /**
   * Creates a new in-memory store.
   */
  constructor() {
    this.geotags = [];
    this.nextId = 1;
  }

  /**
   * Adds a GeoTag to the store.
   *
   * @param {GeoTag} geotag
   * @returns {GeoTag} the added GeoTag
   */
  addGeoTag(geotag) {
    geotag.id = this.nextId++;
    this.geotags.push(geotag);
    return geotag;
  }

  /**
   * Removes a GeoTag from the store.
   *
   * @param {string} name
   */
  removeGeoTag(name) {
    this.geotags = this.geotags.filter(gt => gt.name !== name);
  }

  /**
   * Returns all GeoTags.
   *
   * @returns {Array<GeoTag>}
   */
  getAllGeoTags() {
    return this.geotags;
  }

  /**
   * Returns a GeoTag by its ID.
   *
   * @param {number} id
   * @returns {GeoTag|undefined}
   */
  getGeoTagById(id) {
    return this.geotags.find(gt => gt.id === Number(id));
  }

  /**
   * Updates a GeoTag with the given ID.
   *
   * @param {number} id
   * @param {GeoTag} geotag
   * @returns {GeoTag|null}
   */
  updateGeoTagById(id, geotag) {
    const index = this.geotags.findIndex(gt => gt.id === Number(id));
    if (index === -1) {
      return null;
    }

    geotag.id = Number(id);
    this.geotags[index] = geotag;
    return geotag;
  }

  /**
   * Deletes a GeoTag with the given ID.
   *
   * @param {number} id
   * @returns {GeoTag|null}
   */
  deleteGeoTagById(id) {
    const index = this.geotags.findIndex(gt => gt.id === Number(id));
    if (index === -1) {
      return null;
    }

    return this.geotags.splice(index, 1)[0];
  }

  /**
   * Returns all GeoTags near the given location.
   *
   * @param {{latitude:number, longitude:number}} location
   * @param {number} radius
   * @returns {Array<GeoTag>}
   */
  getNearbyGeoTags(location, radius = 0.01) {
    return this.geotags.filter(gt =>
      Math.abs(gt.latitude - location.latitude) <= radius &&
      Math.abs(gt.longitude - location.longitude) <= radius
    );
  }

  /**
   * Returns all GeoTags near the given location that match the search term.
   *
   * @param {{latitude:number, longitude:number}} location
   * @param {string} searchterm
   * @param {number} radius
   * @returns {Array<GeoTag>}
   */
  searchNearbyGeoTags(location, searchterm, radius = 0.01) {
    return this.getNearbyGeoTags(location, radius).filter(gt =>
      gt.name.includes(searchterm) || gt.hashtag.includes(searchterm)
    );
  }
}

module.exports = InMemoryGeoTagStore;
