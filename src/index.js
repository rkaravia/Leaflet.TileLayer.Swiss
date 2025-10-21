import L from 'leaflet';
import { switzerlandBounds, tileBounds } from './bounds';
import { lv03, lv95 } from './crs';
import SwissLayer from './layer';

L.CRS.EPSG21781 = lv03;
L.CRS.EPSG2056 = lv95;

L.TileLayer.Swiss = SwissLayer;
if (L.tileLayer) {
  L.tileLayer.swiss = (options) => new SwissLayer(options);
}

L.Map.addInitHook(function setMaxBounds() {
  if (!this.options.maxBounds) {
    if (this.options.crs === lv03 || this.options.crs === lv95) {
      // Limit map movement to area where tiles are available
      this.setMaxBounds(tileBounds);
    }
  }
});

L.Map.include({
  fitSwitzerland() {
    // Set the map view, such that the entire country is visible
    this.fitBounds(switzerlandBounds);
  },
});

export default SwissLayer;
