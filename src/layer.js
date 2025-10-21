import L from 'leaflet';
import { tileBounds } from './bounds';
import { lv95 } from './crs';
import * as epsg from './epsg';
import flag from './flag';

const urlsByCrs = {
  [epsg.lv03]: 'https://wmts{s}.geo.admin.ch/1.0.0/{layer}/default/{timestamp}/21781/{z}/{y}/{x}.{format}',
  [epsg.lv95]: 'https://wmts{s}.geo.admin.ch/1.0.0/{layer}/default/{timestamp}/2056/{z}/{x}/{y}.{format}',
};

const pluginAttributionSuffix = ` <a href="https://leaflet-tilelayer-swiss.karavia.ch/" title="Plugin for displaying national maps of Switzerland">${flag}</a>`;

export default L.TileLayer.extend({
  options: {
    attribution: '© <a href="https://www.swisstopo.ch/">Swisstopo</a>',
    bounds: tileBounds,
    crs: lv95,
    format: 'jpeg',
    layer: 'ch.swisstopo.pixelkarte-farbe',
    minZoom: 14,
    maxNativeZoom: 27,
    maxZoom: 28,
    pluginAttribution: true,
    subdomains: '0123456789',
    timestamp: 'current',
  },
  initialize(options) {
    L.Util.setOptions(this, options);
    const url = this.options.url || urlsByCrs[this.options.crs.code];
    if (this.options.attribution && this.options.pluginAttribution) {
      this.options.attribution += pluginAttributionSuffix;
    }
    L.TileLayer.prototype.initialize.call(this, url, this.options);
  },
});
