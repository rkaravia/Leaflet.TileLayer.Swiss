import L from 'leaflet';
import { lv03, lv95 } from './crs';
import * as epsg from './epsg';

const latLngBounds = L.latLngBounds(
  lv95.unproject(lv95.projection.bounds.min),
  lv95.unproject(lv95.projection.bounds.max),
);

const URLS = {
  [epsg.lv03]: 'https://wmts{s}.geo.admin.ch/1.0.0/{layer}/default/{timestamp}/21781/{z}/{y}/{x}.{format}',
  [epsg.lv95]: 'https://wmts{s}.geo.admin.ch/1.0.0/{layer}/default/{timestamp}/2056/{z}/{x}/{y}.{format}',
};

const Swiss = L.TileLayer.extend({
  options: {
    attribution: '<a href="https://www.swisstopo.admin.ch/en/home.html" target="_blank">swisstopo</a>',
    bounds: latLngBounds,
    crs: lv95,
    format: 'jpeg',
    layer: 'ch.swisstopo.pixelkarte-farbe',
    minZoom: 14,
    maxNativeZoom: 27,
    maxZoom: 28,
    subdomains: '0123456789',
    timestamp: 'current',
  },
  initialize(options) {
    L.setOptions(this, options);
    const url = URLS[this.options.crs.code];
    L.TileLayer.prototype.initialize.call(this, url, this.options);
  },
});

Swiss.latLngBounds = latLngBounds;
Swiss.lv03 = lv03;
Swiss.lv95 = lv95;

const padding = -50000;
Swiss.viewBounds = [
  lv95.projection.unproject(lv95.projection.bounds.min.subtract([padding, padding])),
  lv95.projection.unproject(lv95.projection.bounds.max.add([padding, padding])),
];

L.tileLayer.swiss = (options) => new Swiss(options);

export default Swiss;
