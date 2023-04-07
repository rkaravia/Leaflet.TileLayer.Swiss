---
pagetitle: Leaflet.TileLayer.Swiss
document-css: false
lang: en
---

<h1 class="d-flex flex-wrap">
  Leaflet.TileLayer.Swiss
  <iframe
    class="ml-auto"
    src="https://ghbtns.com/github-btn.html?user=rkaravia&repo=Leaflet.TileLayer.Swiss&type=star&count=true&size=large"
    frameborder="0"
    scrolling="0"
    width="120"
    height="30"
    title="GitHub"
  ></iframe>
</h1>

<p class="example-wrapper mb-1">
  <iframe src="examples/quick-start.html"></iframe>
</p>

[Open example in new tab](examples/quick-start.html){.d-flex .flex-justify-center .mb-3 target="_blank"}

[Leaflet.TileLayer.Swiss](https://github.com/rkaravia/Leaflet.TileLayer.Swiss)
is a [Leaflet](https://leafletjs.com/) plugin for displaying national
maps of Switzerland using map tiles from
[Swisstopo](https://www.swisstopo.ch/). This plugin is not affiliated
with or endorsed by Swisstopo.

## Quick start

The following code explains all steps required to get started with
Leaflet.TileLayer.Swiss. It corresponds to the example at the top of the
page. In order to run it locally, copy the 2 files below into a folder
on your computer, then open `quick-start.html` in your browser.

<div class="d-flex flex-items-center mt-4">
  <h3 class="m-0 d-flex flex-items-baseline">quick-start.html</h3>
  <p class="m-0 ml-3">
    <a class="btn" download href="examples/quick-start.html">
      <img src="img/download.svg" alt="Download" class="octicon color-bg-transparent" width="16" height="16">
      Download
    </a>
  </p>
</div>

```html{examples/quick-start.html}
<!-- This will be replaced by content of quick-start.html -->
```

<div class="d-flex flex-items-center mt-4">
  <h3 class="m-0 d-flex flex-items-baseline">quick-start.js</h3>
  <p class="m-0 ml-3">
    <a class="btn" download href="examples/quick-start.js">
      <img src="img/download.svg" alt="Download" class="octicon color-bg-transparent" width="16" height="16">
      Download
    </a>
  </p>
</div>

```javascript{examples/quick-start.js}
// This will be replaced by content of quick-start.js
```

## Installation

You can either include this plugin from a Content Delivery Network (CDN) as shown above, or download the
[latest version of Leaflet.TileLayer.Swiss](https://cdn.jsdelivr.net/npm/leaflet-tilelayer-swiss@2.3.0/dist/Leaflet.TileLayer.Swiss.umd.js)
and host your own copy.

If you are using [npm](https://www.npmjs.com/), use this command to install:

```
npm install leaflet-tilelayer-swiss
```

## Usage

### Layer options

A map layer from this plugin is created like this:

```javascript
var swissLayer = L.tileLayer.swiss(/* options */);

// The layer also needs to be added to a map
swissLayer.addTo(map);
```

If you do not pass any options, you get the default base map layer:

```javascript
var baseMapLayer = L.tileLayer.swiss();
```

Swisstopo offers many other layers in addition to the default base map.

```javascript
// Satellite image layer
var satelliteLayer = L.tileLayer.swiss({
  layer: 'ch.swisstopo.swissimage',
  maxNativeZoom: 28
});

// Cycling route overlay
var cyclingOverlay = L.tileLayer.swiss({
  format: 'png',
  layer: 'ch.astra.veloland',
  maxNativeZoom: 26,
  opacity: 0.5
});

// Historic base map from the year 2010
var historicMap2010 = L.tileLayer.swiss({
  format: 'png',
  layer: 'ch.swisstopo.zeitreihen',
  maxNativeZoom: 26,
  timestamp: '20101231'
});
```

Note that options must correspond to what is available on Swisstopo servers, e.g.
if you specify `format: 'jpeg'` for the historic base map, it will not work.
See **[layer list](#layer-list)** below to find correct combinations of options.

Overview of all available **options with their default values**:

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

[LV95](https://www.swisstopo.admin.ch/en/knowledge-facts/surveying-geodesy/reference-frames/local/lv95.html)
is the new reference frame used in Switzerland since 2016.
LV95 coordinates are by convention designated by the letters `E` for the easting and `N` for the northing,
with origin at `E = 2 600 000 m` / `N = 1 200 000 m`. The origin is not at `0 / 0` to avoid confusion between
easting and northing, this is sometimes called "false easting" and "false northing".

**LV95** is the CRS in which Swiss maps are currently produced, and **is the default** for this plugin.
While it is technically possible to reproject maps to another CRS, this always involves changes in scale and/or rotation
and decreases the quality of the map.

Leaflet uses
[EPSG](https://en.wikipedia.org/wiki/EPSG_Geodetic_Parameter_Dataset) codes to refer to CRS.
This plugin adds LV95 as a Leaflet [CRS](https://leafletjs.com/reference.html#crs):

```javascript
L.CRS.EPSG2056;
```

Leaflet always uses [geographic coordinates](https://en.wikipedia.org/wiki/Geographic_coordinate_system),
aka latitude and longitude to refer to points on the map.

If you already know the geographic coordinates of your points, you can use them directly:

```javascript
// Add a marker in Zurich
L.marker([47.378, 8.538]).addTo(map);

// Center the map on Bern
map.setView([46.951, 7.439], 20);
```

If your points are in LV95, they have to be transformed to geographic coordinates first by
creating a Leaflet [Point](https://leafletjs.com/reference.html#point) and calling `unproject()`:

```javascript
// Add a marker in Zurich
L.marker(L.CRS.EPSG2056.unproject(L.point(2683000, 1248000))).addTo(map);

// Center the map on Bern
map.setView(L.CRS.EPSG2056.unproject(L.point(2600000, 1200000)), 20);
```

If you receive coordinates from Leaflet, e.g. from a click event, you will also get
geographic coordinates. Call `project()` to transform them to LV95.
Note that it returns a Leaflet [Point](https://leafletjs.com/reference.html#point),
so coordinates have to be accessed using the `x` and `y` attributes:

```javascript
map.on('click', function (event) {
  var latlng = event.latlng;
  var EN = L.CRS.EPSG2056.project(latlng);
  console.log('Clicked on (lat/lng): ' + latlng.lat + '/' + latlng.lng);
  console.log('Clicked on (E/N): ' + EN.x + '/' + EN.y);
});
```

The old Swiss CRS, **LV03** (EPSG code 21781), is also added by this plugin. You will probably not need this:

```javascript
L.CRS.EPSG21781;
```

### Utility functions

This plugin adds a convenience function to the Leaflet
[Map](https://leafletjs.com/reference.html#map)
interface to set the map view, such that the entire country is visible.

```javascript
map.fitSwitzerland();
```

## Layer list

The
**[list of all available map layers](layers.html)**
is currently available on a separate page.

## Examples

### Quick start

<p class="example-wrapper mb-1">
  <a href="examples/quick-start.html">
    <iframe src="examples/quick-start.html"></iframe>
  </a>
</p>

<div class="d-flex flex-column flex-items-center">
  <p class="my-2 text-center">Loads the default base map and adds a marker with a popup.</p>
  <p>
    <a class="btn btn-primary" href="examples/quick-start.html">
      View
    </a>
    <a class="btn" href="https://github.com/rkaravia/Leaflet.TileLayer.Swiss/blob/main/docs/examples/quick-start.html">
      <img src="img/code.svg" alt="HTML Source" class="octicon color-bg-transparent" width="16" height="16">
      <span>HTML</span>
    </a>
    <a class="btn" href="https://github.com/rkaravia/Leaflet.TileLayer.Swiss/blob/main/docs/examples/quick-start.js">
      <img src="img/code.svg" alt="JS Source" class="octicon color-bg-transparent" width="16" height="16">
      <span>JS</span>
    </a>
  </p>
</div>

### Multiple layers

<p class="example-wrapper mb-1">
  <a href="examples/multiple-layers.html">
    <iframe src="examples/multiple-layers.html"></iframe>
  </a>
</p>

<div class="d-flex flex-column flex-items-center">
  <p class="my-2 text-center">Configures multiple layers and adds a layer control to let the user choose.</p>
  <p>
    <a class="btn btn-primary" href="examples/multiple-layers.html">
      View
    </a>
    <a class="btn" href="https://github.com/rkaravia/Leaflet.TileLayer.Swiss/blob/main/docs/examples/multiple-layers.html">
      <img src="img/code.svg" alt="HTML Source" class="octicon color-bg-transparent" width="16" height="16">
      <span>HTML</span>
    </a>
    <a class="btn" href="https://github.com/rkaravia/Leaflet.TileLayer.Swiss/blob/main/docs/examples/multiple-layers.js">
      <img src="img/code.svg" alt="JS Source" class="octicon color-bg-transparent" width="16" height="16">
      <span>JS</span>
    </a>
  </p>
</div>

### Outdoor overlays

<p class="example-wrapper mb-1">
  <a href="examples/outdoor-overlays.html">
    <iframe src="examples/outdoor-overlays.html"></iframe>
  </a>
</p>

<div class="d-flex flex-column flex-items-center">
  <p class="my-2 text-center">
    Uses the <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode">mix-blend-mode</a> CSS property
    with value <code>multiply</code> to add outdoor route overlays without hiding map details underneath.
  </p>
  <p>
    <a class="btn btn-primary" href="examples/outdoor-overlays.html">
      View
    </a>
    <a class="btn" href="https://github.com/rkaravia/Leaflet.TileLayer.Swiss/blob/main/docs/examples/outdoor-overlays.html">
      <img src="img/code.svg" alt="HTML Source" class="octicon color-bg-transparent" width="16" height="16">
      <span>HTML</span>
    </a>
    <a class="btn" href="https://github.com/rkaravia/Leaflet.TileLayer.Swiss/blob/main/docs/examples/outdoor-overlays.js">
      <img src="img/code.svg" alt="JS Source" class="octicon color-bg-transparent" width="16" height="16">
      <span>JS</span>
    </a>
  </p>
</div>

### Coordinates

<p class="example-wrapper mb-1">
  <a href="examples/coordinates.html">
    <iframe src="examples/coordinates.html"></iframe>
  </a>
</p>

<div class="d-flex flex-column flex-items-center">
  <p class="my-2 text-center">
    Uses the <a href="https://github.com/mlevans/leaflet-hash">leaflet-hash</a> plugin to encode the current map view
    in the URL. Shows LV95 coordinates of current mouse position and opens a popup with projected and geographic coordinates
    when the user clicks on the map.
  </p>
  <p>
    <a class="btn btn-primary" href="examples/coordinates.html">
      View
    </a>
    <a class="btn" href="https://github.com/rkaravia/Leaflet.TileLayer.Swiss/blob/main/docs/examples/coordinates.html">
      <img src="img/code.svg" alt="HTML Source" class="octicon color-bg-transparent" width="16" height="16">
      <span>HTML</span>
    </a>
    <a class="btn" href="https://github.com/rkaravia/Leaflet.TileLayer.Swiss/blob/main/docs/examples/coordinates.js">
      <img src="img/code.svg" alt="JS Source" class="octicon color-bg-transparent" width="16" height="16">
      <span>JS</span>
    </a>
  </p>
</div>

## Map tile service and terms of use

This plugin uses Swisstopo base maps and other datasets available through Swisstopo's Web Map Tile Service (WMTS).

Technically, this means that small square images are loaded from Swisstopo servers. Careful observers will notice
requests to URLs starting with `https://wmts{n}.geo.admin.ch` in their browser developer tools.

Since 2021-03-01, this data is available for free under an open license as part of Swisstopo's
[Open Government Data (OGD)](https://www.swisstopo.admin.ch/en/swisstopo/free-geodata.html) strategy.
Please note that the following terms apply:

- [OGD terms of use](https://www.swisstopo.admin.ch/en/home/meta/conditions/geodata/ogd.html)
- [General terms of use](https://www.geo.admin.ch/en/geo-services/geo-services/terms-of-use.html), in particular "fair use" of _wmts.geo.admin.ch_

<code>© [Swisstopo](https://www.swisstopo.ch/)</code> is added below the map by this plugin by default in order to comply with the OGD terms of use.

## See also

- [Documentation](https://api3.geo.admin.ch/) of Swisstopo's GeoAdmin API, in particular the [Web Map Tile Service (WMTS)](https://api3.geo.admin.ch/services/sdiservices.html#wmts) used by this plugin.
- [GeoAdmin API mailing list](http://groups.google.com/group/geoadmin-api) for announcements about service updates and Q&A.
- [swissgrid](https://github.com/rkaravia/swissgrid): The library which powers the transformation of coordinates between the Swiss projected coordinate systems (LV95/LV03) and WGS 84 in this plugin.
- [swissgrid_reframe](https://github.com/rkaravia/swissgrid_reframe): Transform between the Swiss projected coordinate systems (LV03 and LV95) with higher precision.

## License

© Roman Karavia, [MIT license](https://github.com/rkaravia/Leaflet.TileLayer.Swiss/blob/main/LICENSE)

## Acknowledgements

Thanks to [Swisstopo](https://www.swisstopo.ch/), the
[Geoinformation Act](https://www.admin.ch/opc/en/classified-compilation/20050726/index.html), and the
[Ordinance on geoinformation](https://www.fedlex.admin.ch/eli/cc/2008/389/de)
for providing excellent geodata.

Thanks to [\@procrastinatio](https://github.com/procrastinatio) whose
[blog post](https://www.procrastinatio.org/2014/11/16/native-wmts-leaflet/)
taught me how to use Swisstopo layers in Leaflet a few year ago.
