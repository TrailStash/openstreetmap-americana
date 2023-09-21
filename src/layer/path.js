"use strict";

import * as Color from "../constants/color.js";

const pathClassSelect = ["==", ["get", "class"], "path"];
//const unpavedSelect = ["!=", ["get", "surface"], "paved"];
const unpavedSelect = [
  "case",
  ["==", ["get", "surface"], "unpaved"],
  true,
  ["==", ["get", "surface"], "paved"],
  false,
  [">=", ["to-number", ["get", "mtb_scale"]], 1],
  true,
  ["==", ["get", "subclass"], "path"],
  true,
  false,
]
const sidewalkSelect = [
  "case",
  ["==", ["get", "footway"], "sidewalk"],
  true,
  ["==", ["get", "footway"], "crossing"],
  true,
  false,
]
const informalSelect = ["==", ["get", "informal"], "yes"];
const notInformalSelect = ["!", informalSelect];
const cutSelect = ["all", informalSelect, ["!", sidewalkSelect]]
const trailSelect = ["all", unpavedSelect, ["!", sidewalkSelect], ["!", informalSelect]];
const pathSelect = ["all", ["!", unpavedSelect], ["!", sidewalkSelect], ["!", informalSelect]];
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
  filter: ["all", pathClassSelect, trailSelect],
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
  filter: ["all", pathClassSelect, pathSelect],
  minzoom: 12,
  paint: { ...path.paint },
};
pavedPath["paint"]["line-dasharray"] = [1, 0];

export const informalPath = {
  id: "highway-path-informal",
  type: "line",
  source: "openmaptiles",
  "source-layer": "transportation",
  filter: ["all", pathClassSelect, cutSelect],
  minzoom: 14,
  paint: { ...path.paint },
};
informalPath["paint"]["line-dasharray"] = [1.5, 1.5];

export const sidewalkPath = {
  id: "highway-path-sidewalk",
  type: "line",
  source: "openmaptiles",
  "source-layer": "transportation",
  filter: ["all", pathClassSelect, sidewalkSelect],
  minzoom: 15,
  paint: { ...path.paint },
};
sidewalkPath["paint"]["line-dasharray"] = [1, 0];

export const pathBridge = {
  id: "highway-path-bridge",
  type: "line",
  source: "openmaptiles",
  "source-layer": "transportation",
  filter: ["all", pathClassSelect, trailSelect, bridgeSelect],
  minzoom: 12,
  paint: { ...path.paint },
};

export const pavedPathBridge = {
  id: "highway-path-paved-bridge",
  type: "line",
  source: "openmaptiles",
  "source-layer": "transportation",
  filter: ["all", pathClassSelect, pathSelect, bridgeSelect],
  minzoom: 12,
  paint: { ...pavedPath.paint },
};

export const sidewalkBridge = {
  id: "highway-path-sidewalk-bridge",
  type: "line",
  source: "openmaptiles",
  "source-layer": "transportation",
  filter: ["all", pathClassSelect, sidewalkSelect, bridgeSelect],
  minzoom: 12,
  paint: { ...pavedPath.paint },
};

// Bridge casing layers
export const bridgeCasing = {
  id: "path-bridge-casing",
  type: "line",
  source: "openmaptiles",
  "source-layer": "transportation",
  filter: ["all", bridgeSelect, pathClassSelect, notInformalSelect],
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
  filter: ["all", bridgeSelect, pathClassSelect, notInformalSelect],
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
    description: "Path",
    layers: [pavedPath.id],
    filter: notFordSelect,
  },
  {
    description: "Path - ford",
    layers: [pavedPath.id],
    filter: fordSelect,
  },
  {
    description: "Trail",
    layers: [path.id],
    filter: notFordSelect,
  },
  {
    description: "Trail - ford",
    layers: [path.id],
    filter: fordSelect,
  },
  {
    description: "Informal trail",
    layers: [informalPath.id],
    filter: notFordSelect,
  },
  {
    description: "Informal trail - ford",
    layers: [informalPath.id],
    filter: fordSelect,
  },
];
