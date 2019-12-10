import L from 'leaflet';
import { lv03, lv95 } from './crs';
import * as epsg from './epsg';

const tileBounds = L.latLngBounds(
  lv95.unproject(lv95.projection.bounds.min),
  lv95.unproject(lv95.projection.bounds.max),
);

const switzerlandBounds = L.latLngBounds(
  lv95.unproject(L.point(2485000, 1075000)),
  lv95.unproject(L.point(2835000, 1295000)),
);

const urlsByCrs = {
  [epsg.lv03]: 'https://wmts{s}.geo.admin.ch/1.0.0/{layer}/default/{timestamp}/21781/{z}/{y}/{x}.{format}',
  [epsg.lv95]: 'https://wmts{s}.geo.admin.ch/1.0.0/{layer}/default/{timestamp}/2056/{z}/{x}/{y}.{format}',
};

L.CRS.EPSG21781 = lv03;
L.CRS.EPSG2056 = lv95;

const Swiss = L.TileLayer.extend({
  options: {
    attribution: '<a href="https://www.swisstopo.ch/" target="_blank">swisstopo</a>',
    bounds: tileBounds,
    crs: lv95,
    format: 'jpeg',
    layer: 'ch.swisstopo.pixelkarte-farbe',
    minZoom: 14,
    maxNativeZoom: 27,
    maxZoom: 28,
    subdomains: '0123456789',
    switzerlandBounds,
    timestamp: 'current',
  },
  initialize(options) {
    L.setOptions(this, options);
    const url = urlsByCrs[this.options.crs.code];
    L.TileLayer.prototype.initialize.call(this, url, this.options);
  },
});

L.tileLayer.swiss = (options) => new Swiss(options);

export default Swiss;
