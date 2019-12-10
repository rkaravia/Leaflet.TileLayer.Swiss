[![npm version](https://img.shields.io/npm/v/leaflet-tilelayer-swiss.svg)](https://www.npmjs.com/package/leaflet-tilelayer-swiss)

# Leaflet.TileLayer.Swiss

Leaflet.TileLayer.Swiss is a [Leaflet](https://leafletjs.com/) plugin for
displaying national maps of Switzerland using WMTS services of
[swisstopo](https://www.swisstopo.admin.ch/en/home.html).
This plugin is not affiliated with or endorsed by swisstopo.

_Requires [Leaflet](https://leafletjs.com/), [Proj4js](http://proj4js.org/),
[Proj4Leaflet](https://kartena.github.io/Proj4Leaflet/). Tested with the
versions listed as peerDependencies in
[package.json](https://github.com/rkaravia/Leaflet.TileLayer.Swiss/blob/master/package.json)._

## Demo

- [Basic example](https://leaflet-tilelayer-swiss.karavia.ch/examples/basic.html)
  with one map layer
- [Advanced example](https://leaflet-tilelayer-swiss.karavia.ch/examples/advanced.html)
  with multiple map layers
- [List of all available layers](https://leaflet-tilelayer-swiss.karavia.ch/examples/layers.html)

## Usage

### swisstopo web access

Most of the base map layers come with some usage restriction which is enforced
by checking the [HTTP Referer](https://en.wikipedia.org/wiki/HTTP_referer) of
map tile requests.

- `localhost` is always accepted as as a Referer.
- In order to include a map on a website hosted at example.com, a
  [swisstopo web access](https://shop.swisstopo.admin.ch/en/products/geoservice/swisstopo_geoservices/WMTS_info)
  account for example.com is required. There is a free tier (no credit
  card required) limited to 25 gigapixels per year.

Most overlay layers are freely accessible, see
[list of layers and their accessiblity](https://api3.geo.admin.ch/api/faq/index.html#which-layers-are-available).

### Basic example

```javascript
// Create a map with LV95 (EPSG:2056) CRS and default base map layer
var map = L.map('map', {
  crs: L.TileLayer.Swiss.EPSG_2056,
  layers: [L.tileLayer.swiss()],
  maxBounds: L.TileLayer.Swiss.latLngBounds
});

// Center on EPSG:2056 coordinates [2600000, 1200000]
map.setView(L.TileLayer.Swiss.unproject_2056(L.point(2600000, 1200000)), 16);
```

### Options

Options are shown with their default values.

```javascript
L.tileLayer.swiss({
  // Coordinate reference system. EPSG_2056 and EPSG_21871 are available.
  crs: L.TileLayer.Swiss.EPSG_2056
  // Image format (jpeg or png). Only one format is available per layer.
  format: 'jpeg',
  // Layer name.
  layer: 'ch.swisstopo.pixelkarte-farbe',
  // Maximum zoom. Availability of zoom levels depends on the layer.
  maxZoom: 27,
  // Timestamp. Most (but not all) layers have a 'current' timestamp.
  // Some layers have multiple timestamps.
  timestamp: 'current'
});
```

A list with all available layers and corresponding options is available
[here](https://leaflet-tilelayer-swiss.karavia.ch/examples/layers.html).


### Coordinate reference systems (CRS)

Two CRS are commonly used in Switzerland:

- New (default): [CH1903+ / LV95 (EPSG:2056)](https://epsg.io/2056)
- Old: [CH1903 / LV03 (EPSG:21781)](https://epsg.io/21781)

In order to use EPSG:21781, both map and layer CRS have to be adapted:

```javascript
var map = L.map('map', {
  crs: L.TileLayer.Swiss.EPSG_21781,
  layers: [L.tileLayer.swiss({
    crs: L.TileLayer.Swiss.EPSG_21781
  })],
  maxBounds: L.TileLayer.Swiss.latLngBounds
});

map.setView(L.TileLayer.Swiss.unproject_21781(L.point(600000, 200000)), 16);
```

## Attribution

This plugin adds a map attribution which links to
[swisstopo](https://www.swisstopo.admin.ch/en/home.html), the same as it is done
by the [official swisstopo API](https://api3.geo.admin.ch/).

The
[terms of service](https://www.swisstopo.admin.ch/en/home/meta/conditions/geoservices/free-geoservice-license.html)
suggest the phrase "Source: Federal Topographical Office (agreement no.)", which
you may want to use if you have an agreement number from swisstopo.

## License

This plugin is licensed under the MIT license, see the LICENSE file.

## Acknowledgements

Thanks to [swisstopo](https://www.swisstopo.admin.ch/en/home.html) and the
[Geoinformation Act](https://www.admin.ch/opc/en/classified-compilation/20050726/index.html)
for providing excellent geodata.

Thanks to [@procrastinatio](https://github.com/procrastinatio) whose
[blog post](https://www.procrastinatio.org/2014/11/16/native-wmts-leaflet/)
taught me how to use swisstopo layers in Leaflet a few year ago.

## See also

- [Documentation](https://api3.geo.admin.ch/) and
  [source](https://github.com/geoadmin/ol3) of the official swisstopo API based
  on OpenLayers 3
- Terms of service for the
  [free](https://www.swisstopo.admin.ch/en/home/meta/conditions/geoservices/free-geoservice-license.html)
  and
  [paid](https://www.swisstopo.admin.ch/en/home/meta/conditions/geoservices/geoservice-license.html)
  tiers of swisstopo
