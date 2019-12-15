[![npm version](https://img.shields.io/npm/v/leaflet-tilelayer-swiss.svg)](https://www.npmjs.com/package/leaflet-tilelayer-swiss)

# Leaflet.TileLayer.Swiss

Leaflet.TileLayer.Swiss is a [Leaflet](https://leafletjs.com/) plugin for
displaying national maps of Switzerland using map tiles from
[Swisstopo](https://www.swisstopo.ch/).
This plugin is not affiliated with or endorsed by Swisstopo.

_Requires [Leaflet](https://leafletjs.com/) version 1.x_

## Demo

The [quick start example](https://leaflet-tilelayer-swiss.karavia.ch/)
is a good place to start.

There is also a [list of all available map layers](https://leaflet-tilelayer-swiss.karavia.ch/layers.html)
and a [slighly more advanced example](https://leaflet-tilelayer-swiss.karavia.ch/advanced.html).

## Usage

### Prerequisites

- Leaflet library, see [Leaflet quick start guide](https://leafletjs.com/examples/quick-start/)
- [Swisstopo web access](#swisstopo-web-access) if you want to publish your application

### Quick start

Include this plugin after the Leaflet JavaScript file:

```html
<script src="https://unpkg.com/leaflet-tilelayer-swiss@2.0.3/dist/Leaflet.TileLayer.Swiss.umd.js" crossorigin
        integrity="sha384-bHBj6G7VG9PdK9RKiYRLB6PRJMpw8sRhZks+TGHAO3zgz8c9Z+lAaDmbv/zsQI3j"></script>
```

Put a div element with a certain id where you want your map to be:

```html
<div id="mapid"></div>
```

Make sure the map container has a defined height, for example by setting it in CSS:

```css
#mapid { height: 400px; }
```

Set up the Swiss map:

```javascript
// Create map
var map = L.map('mapid', {
  // Use LV95 (EPSG:2056) projection
  crs: L.CRS.EPSG2056,
});

// Add Swiss layer with default options
var swissLayer = L.tileLayer.swiss().addTo(map);

// Limit map movement to layer bounds
map.setMaxBounds(swissLayer.options.bounds)

// Center the map on Switzerland
map.fitBounds(swissLayer.options.switzerlandBounds);

// Add a marker with a popup in Bern
L.marker(L.CRS.EPSG2056.unproject(L.point(2600000, 1200000))).addTo(map)
  .bindPopup('The old observatory')
  .openPopup();
```

### Options

Options are shown with their default values.

```javascript
L.tileLayer.swiss({
  // Coordinate reference system. EPSG2056 and EPSG21871 are available.
  crs: L.CRS.EPSG2056
  // Image format (jpeg or png). Only one format is available per layer.
  format: 'jpeg',
  // Layer name.
  layer: 'ch.swisstopo.pixelkarte-farbe',
  // Maximum zoom. Availability of zoom levels depends on the layer.
  maxNativeZoom: 27,
  // Timestamp. Most (but not all) layers have a 'current' timestamp.
  // Some layers have multiple versions with different timestamps.
  timestamp: 'current',
  // Map tile URL. Appropriate defaults are chosen based on the crs option.
  url: 'https://wmts{s}.geo.admin.ch/1.0.0/{layer}/default/{timestamp}/2056/{z}/{x}/{y}.{format}'
});
```

A list with all available layers and corresponding options is available
[here](https://leaflet-tilelayer-swiss.karavia.ch/layers.html).

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

## Swisstopo web access

You will need to register with Swisstopo if you want to publish an application that
displays base map layers from Swisstopo.

If you have your own domain (e.g. example.com), you can
[sign up for Swisstopo web access](https://www.swisstopo.ch/webaccess). There is a free tier (no credit card required) limited to 25 gigapixels of map tiles per year, and there are paid options if you need more.

If you do not have your own domain, sadly you are out of luck, as Swisstopo currently does not provide
any other way to sign up for access to the map tiles.

The usage restriction is enforced by checking the [HTTP Referer](https://en.wikipedia.org/wiki/HTTP_referer)
header, so your application will automatically work once you have signed up.

You will probably also want to test your application locally before publishing it. `localhost` is also accepted
as a Referer, so if you
[run a local web server](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/set_up_a_local_testing_server#Running_a_simple_local_HTTP_server), you should be able to access the map tiles.

Swisstopo also provides some overlay layers which are freely accessible, see
[list of layers and their accessiblity](https://api3.geo.admin.ch/api/faq/index.html#which-layers-are-available).

## Attribution

Swisstopo, like most map tile providers, requires that you display a copyright attribution below the map.

This plugin adds a map attribution which links to
[Swisstopo](https://www.swisstopo.ch/), the same as it is done
by the [official Swisstopo API](https://api3.geo.admin.ch/).

The
[terms of service](https://www.swisstopo.admin.ch/en/home/meta/conditions/geoservices/free-geoservice-license.html)
suggest using the phrase "Source: Federal Topographical Office (agreement no.)", which
you may want to use if you have an agreement number from Swisstopo. You will probably
get such a number if you sign up for paid access to the map tiles.

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
- Terms of service for the
  [free](https://www.swisstopo.admin.ch/en/home/meta/conditions/geoservices/free-geoservice-license.html)
  and
  [paid](https://www.swisstopo.admin.ch/en/home/meta/conditions/geoservices/geoservice-license.html)
  tiers of Swisstopo
