---
title: Usage
layout: default
nav_order: 4
---

# Usage
{: .no_toc }

- TOC
{:toc}

## Layer options

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
See [layer list]({% link layer_list.md %}) to find correct combinations of options.

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

## Coordinate reference systems (CRS)

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

## Utility functions

This plugin adds a convenience function to the Leaflet
[Map](https://leafletjs.com/reference.html#map)
interface to set the map view, such that the entire country is visible.

```javascript
map.fitSwitzerland();
```
