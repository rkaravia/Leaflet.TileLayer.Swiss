[![npm version](https://img.shields.io/npm/v/leaflet-tilelayer-swiss.svg)](https://www.npmjs.com/package/leaflet-tilelayer-swiss)

# Leaflet.TileLayer.Swiss

Leaflet.TileLayer.Swiss is a [Leaflet](https://leafletjs.com/) plugin for
displaying national maps of Switzerland using map tiles from
[Swisstopo](https://www.swisstopo.ch/).
This plugin is not affiliated with or endorsed by Swisstopo.

## Demo

[<img src="examples/zoom-anim-map.svg" alt="Animation of Demo" width="640">](https://leaflet-tilelayer-swiss.karavia.ch/)

## Usage

### Quick start

Check out the [quick start documentation](https://leaflet-tilelayer-swiss.karavia.ch/#quick-start)
to get started.

### Examples

- Quick start ([preview](https://leaflet-tilelayer-swiss.karavia.ch/quick-start.html),
source [html](examples/quick-start.html)/[js](examples/quick-start.js))
- Using multiple layers ([preview](https://leaflet-tilelayer-swiss.karavia.ch/multiple-layers.html),
source [html](examples/multiple-layers.html)/[js](examples/multiple-layers.js))

### Options

Check out the
**[list of all available map layers](https://leaflet-tilelayer-swiss.karavia.ch/layers.html)**
to see recommended combinations of options.

All available options are listed below together with their default values.

```javascript
L.tileLayer.swiss({
  // Attribution. The required attribution to Swisstopo is added by default.
  attribution: '© <a href="https://www.swisstopo.ch/">Swisstopo</a>',
  // Coordinate reference system. EPSG2056 and EPSG21781 are available.
  crs: L.CRS.EPSG2056
  // Image format (jpeg or png). Only one format is available per layer.
  format: 'jpeg',
  // Layer name.
  layer: 'ch.swisstopo.pixelkarte-farbe',
  // Minimum zoom. Levels below 14 exist for technical reasons,
  // but you probably do not want to use them.
  minZoom: 14,
  // Maximum zoom. Availability of zoom levels depends on the layer.
  maxNativeZoom: 27,
  // Plugin attribution. Display a small Swiss flag with a link to this plugin. 🇨🇭
  // (Like the "🇺🇦 Leaflet" prefix, this is enabled by default but not required)
  pluginAttribution: true,
  // Timestamp. Most (but not all) layers have a 'current' timestamp.
  // Some layers have multiple versions with different timestamps.
  timestamp: 'current',
  // Map tile URL. Appropriate defaults are chosen based on the crs option.
  url: 'https://wmts{s}.geo.admin.ch/1.0.0/{layer}/default/{timestamp}/2056/{z}/{x}/{y}.{format}'
});
```

### Coordinate reference systems (CRS)

Two CRS are commonly used in Switzerland:

- New (default): [LV95 (EPSG:2056)](https://epsg.io/2056)
- Old: [LV03 (EPSG:21781)](https://epsg.io/21781)

In order to use EPSG:21781, both map and layer CRS have to be adapted:

```javascript
var map = L.map('map', { crs: L.CRS.EPSG21781 });
var swissLayer = L.tileLayer.swiss({ crs: L.CRS.EPSG21781 }).addTo(map);

map.setView(L.CRS.EPSG21781.unproject(L.point(600000, 200000)), 16);
```

## Swisstopo tile service

Since 2021-03-01, Swisstopo maps are available as Open Government Data (OGD), and
Swisstopo also provides a free tile service, for
which no registration is required.
In practice, this means that you can directly start using this plugin, and
with the default configuration, the map will be loaded directly from Swisstopo
servers.

## Attribution

Swisstopo, like most map tile providers, requires that you display a copyright attribution below the map.

This plugin adds a map attribution which links to
[Swisstopo](https://www.swisstopo.ch/).

## License

This plugin is licensed under the MIT license, see the LICENSE file.

## Acknowledgements

Thanks to [Swisstopo](https://www.swisstopo.ch/) and the
[Geoinformation Act](https://www.admin.ch/opc/en/classified-compilation/20050726/index.html)
for providing excellent geodata.

Thanks to [@procrastinatio](https://github.com/procrastinatio) whose
[blog post](https://www.procrastinatio.org/2014/11/16/native-wmts-leaflet/)
taught me how to use Swisstopo layers in Leaflet a few year ago.

## See also

- [Documentation](https://api3.geo.admin.ch/) and
  [source](https://github.com/geoadmin/ol3) of the official Swisstopo API based
  on OpenLayers 4

