"use strict";

import * as Color from "../constants/color.js";

const pathSelect = ["==", ["get", "class"], "path"];
//const unpavedSelect = ["!=", ["get", "surface"], "paved"];
const unpavedSelect = [
  "case",
  ["==", ["get", "surface"], "unpaved"],
  true,
  ["==", ["get", "surface"], "paved"],
  false,
  [">=", ["to-number", ["get", "mtb_scale"]], 1],
  true,
  false,
]
//const pavedSelect = ["==", ["get", "surface"], "paved"];
const pavedSelect = ["!", unpavedSelect];
const bridgeSelect = ["==", ["get", "brunnel"], "bridge"];
const fordSelect = ["==", ["get", "brunnel"], "ford"];
const notFordSelect = ["!=", ["get", "brunnel"], "ford"];
const opacity = ["interpolate", ["exponential", 1.2], ["zoom"], 12, 0, 13, 1];
const getBrunnel = ["get", "brunnel"];

export const path = {
  id: "highway-path",
  type: "line",
  source: "openmaptiles",
  "source-layer": "transportation",
  filter: ["all", pathSelect, unpavedSelect],
  minzoom: 12,
  paint: {
    "line-color": ["match", getBrunnel, "ford", Color.waterLine, "rgb(0.1,0.1,0.1)"],
    "line-opacity": opacity,
    "line-blur": 0.75,
    "line-width": 1,
    "line-dasharray": [6, 1.5],
    "line-offset": 0,
  },
};

export const pavedPath = {
  id: "highway-path-paved",
  type: "line",
  source: "openmaptiles",
  "source-layer": "transportation",
  filter: ["all", pathSelect, pavedSelect],
  minzoom: 12,
  paint: { ...path.paint },
};
pavedPath["paint"]["line-dasharray"] = [1, 0];

export const pathBridge = {
  id: "highway-path-bridge",
  type: "line",
  source: "openmaptiles",
  "source-layer": "transportation",
  filter: ["all", pathSelect, unpavedSelect, bridgeSelect],
  minzoom: 12,
  paint: { ...path.paint },
};

export const pavedPathBridge = {
  id: "highway-path-paved-bridge",
  type: "line",
  source: "openmaptiles",
  "source-layer": "transportation",
  filter: ["all", pathSelect, pavedSelect, bridgeSelect],
  minzoom: 12,
  paint: { ...pavedPath.paint },
};

// Bridge casing layers
export const bridgeCasing = {
  id: "path-bridge-casing",
  type: "line",
  source: "openmaptiles",
  "source-layer": "transportation",
  filter: ["all", bridgeSelect, pathSelect],
  minzoom: 13,
  layout: {
    "line-cap": "butt",
    "line-join": "bevel",
    visibility: "visible",
  },
  paint: {
    "line-color": "black",
    "line-opacity": opacity,
    "line-width": [
      "interpolate",
      ["exponential", 1.2],
      ["zoom"],
      13,
      1.1,
      20,
      11,
    ],
  },
};
// Bridge casing layers
export const bridgeFill = {
  id: "path-bridge-fill",
  type: "line",
  source: "openmaptiles",
  "source-layer": "transportation",
  filter: ["all", bridgeSelect, pathSelect],
  minzoom: 13,
  layout: {
    "line-cap": "butt",
    "line-join": "bevel",
    visibility: "visible",
  },
  paint: {
    "line-color": Color.backgroundFill,
    "line-opacity": opacity,
    "line-width": [
      "interpolate",
      ["exponential", 1.2],
      ["zoom"],
      13,
      1.0,
      20,
      10,
    ],
  },
};

export const legendEntries = [
  {
    description: "Unpaved path",
    layers: [path.id],
    filter: notFordSelect,
  },
  {
    description: "Unpaved path - ford",
    layers: [path.id],
    filter: fordSelect,
  },
  {
    description: "Paved path",
    layers: [pavedPath.id],
    filter: notFordSelect,
  },
  {
    description: "Paved path - ford",
    layers: [pavedPath.id],
    filter: fordSelect,
  },
];
