import L from 'leaflet';
import * as epsg from './epsg';
import * as projection from './projection';
import * as resolution from './resolution';

function scaleFn(zoom) {
  return 1 / resolution.fromZoom(zoom);
}

function zoomFn(scale) {
  return resolution.toZoom(1 / scale);
}

function distance(latLng1, latLng2) {
  const point1 = this.project(latLng1);
  const point2 = this.project(latLng2);
  return point1.distanceTo(point2);
}

function makeCRS(options) {
  const origin = options.projection.bounds.getBottomLeft();
  const transformation = new L.Transformation(1, -origin.x, -1, origin.y);
  if (typeof L.CRS === 'object') {
    return L.Util.extend({}, L.CRS, {
      code: options.code,
      projection: options.projection,
      transformation,
      scale: scaleFn,
      zoom: zoomFn,
      distance,
    });
  }
  const CRS = class extends L.CRS {};
  CRS.code = options.code;
  CRS.projection = options.projection;
  CRS.transformation = transformation;
  CRS.scale = scaleFn;
  CRS.zoom = zoomFn;
  CRS.distance = distance;
  return CRS;
}

export const lv03 = makeCRS({
  code: epsg.lv03,
  projection: projection.lv03,
});

export const lv95 = makeCRS({
  code: epsg.lv95,
  projection: projection.lv95,
});
