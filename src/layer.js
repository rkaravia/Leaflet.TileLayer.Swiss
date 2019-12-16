import L from 'leaflet';
import { tileBounds } from './bounds';
import { lv95 } from './crs';
import * as epsg from './epsg';

const urlsByCrs = {
  [epsg.lv03]: 'https://wmts{s}.geo.admin.ch/1.0.0/{layer}/default/{timestamp}/21781/{z}/{y}/{x}.{format}',
  [epsg.lv95]: 'https://wmts{s}.geo.admin.ch/1.0.0/{layer}/default/{timestamp}/2056/{z}/{x}/{y}.{format}',
};

export default L.TileLayer.extend({
  options: {
    attribution: '© <a href="https://www.swisstopo.ch/" target="_blank">Swisstopo</a>',
    bounds: tileBounds,
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
    const url = this.options.url || urlsByCrs[this.options.crs.code];
    L.TileLayer.prototype.initialize.call(this, url, this.options);
  },
});
