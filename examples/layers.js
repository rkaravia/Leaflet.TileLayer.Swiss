'use strict';

var WMTS_CAPABILITIES_URL = 'https://wmts.geo.admin.ch/EPSG/2056/1.0.0/WMTSCapabilities.xml';

var TABLE_COLUMNS = [
    {
        caption: 'Name',
        attribute: 'name'
    },
    {
        caption: 'Title',
        attribute: 'title'
    },
    {
        caption: 'Format',
        attribute: 'format'
    },
    {
        caption: 'Max Zoom',
        attribute: 'maxZoom'
    },
    {
        caption: 'Default Timestamp',
        attribute: 'timestamp'
    },
    {
        caption: 'Preview',
        attribute: 'preview'
    },
    {
        caption: 'Edit on CodePen',
        attribute: 'codepen'
    }
];

var layers;

xhrXMLRequest(WMTS_CAPABILITIES_URL, function (capabilities) {
    layers = parseWMTSCapabilities(capabilities);
    layers.forEach(addPreviewLink);
    layers.forEach(addCodepenLink);
    makeTable(layers, TABLE_COLUMNS);
});

// Adapted from: https://davidwalsh.name/convert-xml-json
function xmlToJson(xml) {

    var result = {};

    if (xml.nodeType == 1) {
        // Element
        if (xml.attributes.length > 0) {
            result['@attributes'] = {};
            // Attributes
            for (var i = 0; i < xml.attributes.length; i++) {
                var attribute = xml.attributes.item(i);
                result['@attributes'][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) {
        // Text
        result = xml.nodeValue;
    }

    if (xml.hasChildNodes()) {
        // Children
        for (var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof (result[nodeName]) == 'undefined') {
                result[nodeName] = xmlToJson(item);
            } else {
                if (typeof (result[nodeName].push) == 'undefined') {
                    var node = result[nodeName];
                    result[nodeName] = [];
                    result[nodeName].push(node);
                }
                result[nodeName].push(xmlToJson(item));
            }
        }
    }
    return result;
}

function xhrXMLRequest(url, onload) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        onload(xhr.responseXML.documentElement);
    }
    xhr.onerror = function () {
        console.error('Failed to load: ' + url);
    }
    xhr.open('GET', url);
    xhr.responseType = 'document';
    xhr.send();
}

function getAllTimestamps(values) {
    if (!Array.isArray(values)) {
        values = [values];
    }
    return values.map(function (value) {
        return value['#text'];
    });
}

function parseWMTSCapabilities(capabilitiesXML) {
    var capabilitiesJSON = xmlToJson(capabilitiesXML);
    var layers = capabilitiesJSON.Contents.Layer;
    return layers.map(function (layer) {
        return {
            description: layer['ows:Abstract']['#text'],
            format: layer.ResourceURL['@attributes'].template.split('.').pop(),
            maxZoom: layer.TileMatrixSetLink.TileMatrixSet['#text'].split('_').pop(),
            name: layer['ows:Identifier']['#text'],
            timestamp: layer.Dimension.Default['#text'],
            timestamps: getAllTimestamps(layer.Dimension.Value),
            title: layer['ows:Title']['#text']
        }
    });
}

function tileLayerOptions(layer) {
    return {
        format: layer.format,
        layer: layer.name,
        maxZoom: layer.maxZoom,
        timestamp: layer.timestamp
    };
}

function addPreviewLink(layer) {
    var encodedOptions = encodeURIComponent(JSON.stringify(tileLayerOptions(layer)));
    layer.preview = '<a href="preview.html?options=' + encodedOptions + '" target="_blank">Preview</a>';
}

function editOnCodepen(layerId) {
    var css = [
        'html,',
        'body,',
        '#map {',
        '    width: 100%;',
        '    height: 100%;',
        '    margin: 0;',
        '}'
    ].join('\n');

    var options = tileLayerOptions(layers[layerId]);

    var mapLayers = 'L.tileLayer.swiss(options)';
    if (options.format == 'png') {
        mapLayers = 'L.tileLayer.swiss(), ' + mapLayers;
        options.opacity = 0.5;
    }

    var js = [
        'var options = ' + JSON.stringify(options, null, 2) + ';',
        '',
        'var map = L.map("map", {',
        '    crs: L.TileLayer.Swiss.crs,',
        '    layers: [' + mapLayers + '],',
        '    maxBounds: L.TileLayer.Swiss.latLngBounds',
        '});',
        '',
        'map.setView(L.TileLayer.Swiss.unproject(L.point([2600000, 1200000])), 16);'
    ].join('\n');

    var codepenOptions = {
        css: css,
        css_external: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/leaflet.css',
        html: '<div id="map"></div>',
        js: js,
        js_external: [
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/leaflet.js',
            'https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.4.4/proj4.js',
            'https://cdnjs.cloudflare.com/ajax/libs/proj4leaflet/1.0.2/proj4leaflet.min.js',
            'https://rawgit.com/rzoller/Leaflet.TileLayer.Swiss/master/Leaflet.TileLayer.Swiss.js'
        ].join(';')
    };

    var form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://codepen.io/pen/define';
    form.target = '_blank';

    var codepenData = document.createElement('input');
    codepenData.name = 'data';
    codepenData.value = JSON.stringify(codepenOptions);
    form.appendChild(codepenData);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}

function addCodepenLink(layer, layerId) {
    layer.codepen = '<a title="Edit on CodePen" href="#" onclick="editOnCodepen(' + layerId + ')"><img src="img/edit-on-codepen.svg" class="edit-on-codepen"></a>';
}

function makeTable(data, columns) {
    var table = document.getElementById('table');

    var tHead = table.createTHead();
    var header = tHead.insertRow();
    columns.forEach(function (column) {
        var columnHeader = document.createElement('th');
        columnHeader.innerHTML = column.caption;
        header.appendChild(columnHeader);
    });

    var tBody = table.createTBody();
    data.forEach(function (datum) {
        var row = tBody.insertRow();
        columns.forEach(function (column) {
            row.insertCell().innerHTML = datum[column.attribute];
        });
    });

    var dataTableDom = [
        '<"row"<"col-sm-12"f>>',
        '<"row"<"col-sm-12"tr>>',
        '<"row"<"col-sm-5"i><"col-sm-7"p>>'
    ].join('\n');

   var dataTable = $(table).DataTable({
        dom: dataTableDom,
        language: {
            search: '_INPUT_',
            searchPlaceholder: "Search..."
        },
        paging: false
    });
    dataTable.table().container().classList.remove('container-fluid');
}
