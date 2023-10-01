import * as Label from "openstreetmap-americana/src/constants/label.js";
import * as Style from "openstreetmap-americana/src/js/style.js";
import * as Poi from "openstreetmap-americana/src/js/poi.js";

import { ShieldRenderer } from "@americana/maplibre-shield-generator";
import {
  shieldPredicate,
  networkPredicate,
  routeParser,
} from "openstreetmap-americana/src/js/shield_format.js";

import shields from "openstreetmap-americana/dist/shields.json";

const baseUrl = (
  window.location.protocol +
  "//" +
  window.location.host +
  window.location.pathname
)
  //Trim trailing slashes from URL
  .replace(/\/+$/, "");
const rootSpritePath = `${baseUrl}/sprites/sprite`;

export class Americana {
  constructor({
    fontUrl = "https://osm-americana.github.io/fontstack66/{fontstack}/{range}.pbf",
    spritePath = rootSpritePath,
    tileUrl = "https://pmtiles.trailstash.net/openmaptiles.json",
  }) {
    this.tileUrl = tileUrl;
    this.spritePath = spritePath;
    this.fontUrl = fontUrl;
    this.shieldRenderer = new ShieldRenderer(shields, routeParser)
      .filterImageID(shieldPredicate)
      .filterNetwork(networkPredicate);
  }
  build() {
    const style = Style.build(
      this.tileUrl,
      this.spritePath,
      this.fontUrl,
      Label.getLocales()
    );
    return style;
  }
  setupMap(map) {
    this.shieldRenderer.renderOnMaplibreGL(map);
    map.off("styleimagemissing", this.styleImageMissingHandler);
    this.shieldStyleImageMissingHandler =
      map._listeners.styleimagemissing.slice(-1)[0];
    map.on("styleimagemissing", (e) => {
      switch (e.id.split("\n")[0]) {
        case "shield":
          break;
        case "poi":
          Poi.missingIconHandler(this.shieldRenderer, map, e);
          break;
        default:
          console.warn("Image id not recognized:", JSON.stringify(e.id));
          break;
      }
    });
    this.poiStyleImageMissingHandler =
      map._listeners.styleimagemissing.slice(-1)[0];
  }
  teardown(map) {
    map.off("styleimagemissing", this.shieldStyleImageMissingHandler);
    map.off("styleimagemissing", this.poiStyleImageMissingHandler);
  }
}

export default Americana;
