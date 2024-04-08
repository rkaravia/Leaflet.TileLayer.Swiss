---
filename: web-mercator
title: Comparison with Web Mercator projection
---

The first map shows the default base map layer in
[LV95 projection](https://www.swisstopo.admin.ch/en/knowledge-facts/surveying-geodesy/reference-frames/local/lv95.html),
which is the coordinate reference system (CRS) in which Swiss maps are produced, and is the default when using this plugin.

The second map shows the default base map layer in [Web Mercator projection](https://en.wikipedia.org/wiki/Web_Mercator_projection),
which is natively supported by Leaflet and used by many global online map services such as [OpenStreetMap](https://www.openstreetmap.org/).

Due to the distortion in scale and rotation that is introduced by reprojection,
I recommend using the original LV95 projection for Swisstopo maps whenever this is possible.
