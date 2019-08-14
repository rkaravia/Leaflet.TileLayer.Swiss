import L from 'leaflet';
import * as epsg from './epsg';
import * as projection from './projection';
import * as resolution from './resolution';

const CRS = L.Class.extend({
  includes: L.CRS,

  initialize(options) {
    this.code = options.code;
    this.projection = options.projection;

    const origin = this.projection.bounds.getBottomLeft();
    this.transformation = new L.Transformation(1, -origin.x, -1, origin.y);
    this.infinite = false;
  },

  scale(zoom) {
    return 1 / resolution.fromZoom(zoom);
  },

  zoom(scale) {
    return resolution.toZoom(1 / scale);
  },

  distance(latLng1, latLng2) {
    const point1 = this.project(latLng1);
    const point2 = this.project(latLng2);
    return point1.distanceTo(point2);
  },
});

export const lv03 = new CRS({
  code: epsg.lv03,
  projection: projection.lv03,
});

export const lv95 = new CRS({
  code: epsg.lv95,
  projection: projection.lv95,
});
