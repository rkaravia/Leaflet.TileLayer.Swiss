import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import serve from "rollup-plugin-serve";
import { terser } from "rollup-plugin-terser";
import buble from "rollup-plugin-buble";
import pkg from "./package.json";

const production = !process.env.ROLLUP_WATCH;

const banner = `/*!
* Leaflet.TileLayer.Swiss v${pkg.version}
* Plugin for displaying Swiss map tiles
* © Roman Karavia | MIT License
* leaflet-tilelayer-swiss.karavia.ch
*/
`;

export default {
  input: "src/index.js",
  external: ["leaflet"],
  output: [
    {
      file: pkg.browser,
      format: "umd",
      name: "L.TileLayer.Swiss",
      globals: { leaflet: "L" },
      banner,
      sourcemap: true
    },
    { file: pkg.main, format: "cjs", banner, sourcemap: true },
    { file: pkg.module, format: "es", banner, sourcemap: true }
  ],
  plugins: [
    resolve(),
    commonjs(),

    !production && serve(),
    !production && livereload("dist"),

    production && buble(),
    production && terser()
  ]
};
