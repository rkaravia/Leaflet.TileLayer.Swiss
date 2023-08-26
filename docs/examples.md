---
title: Examples
layout: default
nav_order: 6
---

# Examples

{% for example in site.examples %}

  <h2 id="{{ example.filename }}">{{ example.title }}</h2>

  <div class="lts-example-wrapper">
    <a href="examples/{{ example.filename }}.html">
      <iframe src="examples/{{ example.filename }}.html"></iframe>
    </a>
  </div>

  <div class="lts-example-caption">
    <div class="my-2 text-center">{{ example.content }}</div>
    <div>
      <a class="btn btn-primary" href="examples/{{ example.filename }}.html">
        View
      </a>
      <a class="btn" href="https://github.com/rkaravia/Leaflet.TileLayer.Swiss/blob/main/docs/examples/{{ example.filename }}.html">
        <img src="img/code.svg" alt="HTML Source" class="lts-btn-icon" width="16" height="16">
        <span>HTML</span>
      </a>
      <a class="btn" href="https://github.com/rkaravia/Leaflet.TileLayer.Swiss/blob/main/docs/examples/{{ example.filename }}.js">
        <img src="img/code.svg" alt="JS Source" class="lts-btn-icon" width="16" height="16">
        <span>JS</span>
      </a>
    </div>
  </div>
{% endfor %}
