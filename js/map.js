/**
 * TEDUH DIGITAL PLATFORM
 * Berkas: js/map.js
 * Deskripsi: Mesin Spasial Peta Satelit Hybrid, Geolokasi, Analisis Titik Tanam & Misi Gotong Royong
 *
 * ==========================================================================
 * SUMBER KARYA & ATRIBUSI MEDIA / ASET:
 * 1. Aset Visual (assets/*): Dihasilkan via Generative AI (Banana AI).
 * 2. Desain Logo: Dibuat mandiri via Canva oleh tim pengembang.
 * 3. Mesin Peta Spasial: Teduh Spatial Canvas Engine (Native JS + jQuery).
 * 4. Peta Spasial: Google Hybrid Satellite Tile Server & CartoDB Dark Matter.
 * 5. Pustaka Eksternal: jQuery 3.7.1 CDN (MIT License).
 * ==========================================================================
 */
const L = (function ($) {
  "use strict";

  function project(lat, lng, zoom) {
    const d = Math.PI / 180;
    const max = 85.0511287798;
    const clampedLat = Math.max(Math.min(max, lat), -max);
    const sin = Math.sin(clampedLat * d);
    const scale = 256 * Math.pow(2, zoom);
    const x = (scale * (lng + 180)) / 360;
    const y = (scale * (1 - Math.log((1 + sin) / (1 - sin)) / (2 * Math.PI))) / 2;
    return { x, y };
  }

  function unproject(x, y, zoom) {
    const scale = 256 * Math.pow(2, zoom);
    const lng = (x / scale) * 360 - 180;
    const n = Math.PI - (2 * Math.PI * y) / scale;
    const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
    return { lat, lng };
  }

  function metersPerPixel(lat, zoom) {
    return (156543.03392 * Math.cos((lat * Math.PI) / 180)) / Math.pow(2, zoom);
  }

  class LatLng {
    constructor(lat, lng) {
      if (Array.isArray(lat)) {
        this.lat = Number(lat[0]);
        this.lng = Number(lat[1]);
      } else if (typeof lat === "object" && lat !== null) {
        this.lat = Number(lat.lat !== undefined ? lat.lat : lat[0]);
        this.lng = Number(lat.lng !== undefined ? lat.lng : lat[1]);
      } else {
        this.lat = Number(lat);
        this.lng = Number(lng);
      }
    }
    distanceTo(other) {
      const o = new LatLng(other);
      const R = 6371e3;
      const phi1 = (this.lat * Math.PI) / 180;
      const phi2 = (o.lat * Math.PI) / 180;
      const deltaPhi = ((o.lat - this.lat) * Math.PI) / 180;
      const deltaLambda = ((o.lng - this.lng) * Math.PI) / 180;
      const a =
        Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
        Math.cos(phi1) *
          Math.cos(phi2) *
          Math.sin(deltaLambda / 2) *
          Math.sin(deltaLambda / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    }
  }

  class LatLngBounds {
    constructor(sw, ne) {
      this.sw = new LatLng(sw);
      this.ne = new LatLng(ne);
    }
    contains(latlng) {
      const p = new LatLng(latlng);
      const minLat = Math.min(this.sw.lat, this.ne.lat);
      const maxLat = Math.max(this.sw.lat, this.ne.lat);
      const minLng = Math.min(this.sw.lng, this.ne.lng);
      const maxLng = Math.max(this.sw.lng, this.ne.lng);
      return (
        p.lat >= minLat && p.lat <= maxLat && p.lng >= minLng && p.lng <= maxLng
      );
    }
    getCenter() {
      return new LatLng(
        (this.sw.lat + this.ne.lat) / 2,
        (this.sw.lng + this.ne.lng) / 2,
      );
    }
  }

  class TileLayer {
    constructor(urlTemplate, options) {
      this.urlTemplate = urlTemplate;
      this.options = Object.assign(
        {
          maxZoom: 20,
          minZoom: 2,
          subdomains: ["mt0", "mt1", "mt2", "mt3"],
          attribution: "",
        },
        options,
      );
      this._map = null;
    }
    addTo(map) {
      this._map = map;
      map._setTileLayer(this);
      return this;
    }
    setUrl(newUrl) {
      this.urlTemplate = newUrl;
      if (this._map) this._map._renderTiles();
      return this;
    }
    getTileUrl(x, y, z) {
      const sub = this.options.subdomains
        ? this.options.subdomains[
            Math.abs(x + y) % this.options.subdomains.length
          ]
        : "mt0";
      return this.urlTemplate
        .replace("{s}", sub)
        .replace("{x}", x)
        .replace("{y}", y)
        .replace("{z}", z)
        .replace("{r}", "");
    }
  }

  class MapEngine {
    constructor(id, options) {
      this.$container = $("#" + id);
      this.options = Object.assign(
        {
          center: [-8.675, 115.215],
          zoom: 13,
          minZoom: 10,
          maxZoom: 20,
          attributionControl: true,
        },
        options,
      );

      this.center = new LatLng(this.options.center);
      this.zoom = this.options.zoom;
      this.maxBounds = null;
      this._layers = new Set();
      this._tileLayer = null;
      this._tiles = new Map();
      this._handlers = {};
      this._activePopup = null;
      this._activePopupMarker = null;

      this._setupDOM();
      this._bindEvents();
    }

    _setupDOM() {
      this.$container.addClass("leaflet-container leaflet-touch leaflet-fade-anim leaflet-grab leaflet-touch-drag leaflet-touch-zoom teduh-map-container");
      this.$container.css({ position: "relative", overflow: "hidden" });
      this.$container.empty();

      this.$pane = $(
        '<div class="leaflet-pane leaflet-map-pane teduh-map-pane" style="position:absolute;top:0;left:0;width:100%;height:100%;"></div>',
      ).appendTo(this.$container);
      this.$tilePane = $(
        '<div class="leaflet-pane leaflet-tile-pane teduh-map-tile-pane" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:200;"></div>',
      ).appendTo(this.$pane);
      this.$svgPane = $(
        '<svg class="leaflet-pane leaflet-overlay-pane leaflet-zoom-animated teduh-map-svg-pane" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:400;"></svg>',
      ).appendTo(this.$pane);
      this.$markerPane = $(
        '<div class="leaflet-pane leaflet-marker-pane teduh-map-marker-pane" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:600;"></div>',
      ).appendTo(this.$pane);
      this.$popupPane = $(
        '<div class="leaflet-pane leaflet-popup-pane teduh-map-popup-pane" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:700;"></div>',
      ).appendTo(this.$pane);
      this.$tooltipPane = $(
        '<div class="leaflet-pane leaflet-tooltip-pane teduh-map-tooltip-pane" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:800;"></div>',
      ).appendTo(this.$pane);

      this.$attribution = $(
        '<div class="leaflet-control-attribution leaflet-control teduh-control-attribution teduh-control" style="position:absolute;bottom:0;right:0;margin:0;padding:2px 8px;font-size:10px;background:rgba(14,17,22,0.7);color:rgba(255,255,255,0.6);border-top-left-radius:6px;z-index:900;">Citra Satelit &copy; Google Maps / Earth | Platform Teduh</div>',
      ).appendTo(this.$container);
    }

    _setTileLayer(tileLayer) {
      this._tileLayer = tileLayer;
      this._renderTiles();
    }

    _bindEvents() {
      const self = this;
      let isDragging = false;
      let startX, startY;
      let startCenterPoint;
      let hasDragged = false;
      let moveHistory = [];
      let momentumRaf = null;

      function stopMomentum() {
        if (momentumRaf) {
          cancelAnimationFrame(momentumRaf);
          momentumRaf = null;
        }
      }

      this.$container.on("mousedown", function (e) {
        if (
          $(e.target).closest(
            ".custom-marker-wrapper, .custom-spatial-marker, .community-map-pin, .teduh-popup-content-wrapper, .map-popup-btn, button, input, a, .teduh-control-zoom",
          ).length
        ) {
          return;
        }
        stopMomentum();
        isDragging = true;
        hasDragged = false;
        startX = e.clientX;
        startY = e.clientY;
        startCenterPoint = project(self.center.lat, self.center.lng, self.zoom);
        moveHistory = [{ time: performance.now(), x: e.clientX, y: e.clientY }];
        self.$container.css("cursor", "grabbing");
      });

      $(window).on("mousemove", function (e) {
        if (!isDragging) return;
        const now = performance.now();
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
          hasDragged = true;
        }

        moveHistory.push({ time: now, x: e.clientX, y: e.clientY });
        while (moveHistory.length > 1 && now - moveHistory[0].time > 90) {
          moveHistory.shift();
        }

        const newX = startCenterPoint.x - dx;
        const newY = startCenterPoint.y - dy;
        const newCenter = unproject(newX, newY, self.zoom);

        if (self.maxBounds && !self.maxBounds.contains(newCenter)) {
          return;
        }
        self.center = new LatLng(newCenter);
        self._updateView();
        self._renderTiles();
        self._fire("move");
      });

      $(window).on("mouseup", function (e) {
        if (!isDragging) return;
        isDragging = false;
        self.$container.css("cursor", "");

        const now = performance.now();
        const recent = moveHistory.filter((h) => now - h.time <= 80);
        if (recent.length >= 2 && hasDragged) {
          const first = recent[0];
          const last = recent[recent.length - 1];
          const dt = Math.max(16, last.time - first.time);
          let vx = (last.x - first.x) / dt;
          let vy = (last.y - first.y) / dt;
          const speed = Math.hypot(vx, vy);

          if (speed > 0.25) {
            let curP = project(self.center.lat, self.center.lng, self.zoom);
            const friction = 0.91;
            function glide() {
              vx *= friction;
              vy *= friction;
              if (Math.hypot(vx, vy) < 0.04) {
                self._renderTiles();
                self._fire("moveend");
                return;
              }
              curP.x -= vx * 16;
              curP.y -= vy * 16;
              const nextCenter = unproject(curP.x, curP.y, self.zoom);
              if (self.maxBounds && !self.maxBounds.contains(nextCenter)) {
                self._renderTiles();
                self._fire("moveend");
                return;
              }
              self.center = new LatLng(nextCenter);
              self._updateView();
              self._renderTiles();
              self._fire("move");
              momentumRaf = requestAnimationFrame(glide);
            }
            momentumRaf = requestAnimationFrame(glide);
          } else {
            self._renderTiles();
            self._fire("moveend");
          }
        } else {
          self._renderTiles();
          self._fire("moveend");
        }
      });

      let touchStartDist = 0;
      this.$container.on("touchstart", function (e) {
        if (
          $(e.target).closest(
            ".custom-marker-wrapper, .custom-spatial-marker, .community-map-pin, .teduh-popup-content-wrapper, .map-popup-btn, button, input, a, .teduh-control-zoom",
          ).length
        ) {
          return;
        }
        stopMomentum();
        const touches = e.originalEvent.touches;
        if (touches.length === 1) {
          isDragging = true;
          hasDragged = false;
          startX = touches[0].clientX;
          startY = touches[0].clientY;
          startCenterPoint = project(self.center.lat, self.center.lng, self.zoom);
          moveHistory = [
            { time: performance.now(), x: startX, y: startY },
          ];
        } else if (touches.length === 2) {
          isDragging = false;
          touchStartDist = Math.hypot(
            touches[0].clientX - touches[1].clientX,
            touches[0].clientY - touches[1].clientY,
          );
        }
      });

      this.$container.on("touchmove", function (e) {
        const touches = e.originalEvent.touches;
        if (isDragging && touches.length === 1) {
          const now = performance.now();
          const dx = touches[0].clientX - startX;
          const dy = touches[0].clientY - startY;
          if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasDragged = true;

          moveHistory.push({
            time: now,
            x: touches[0].clientX,
            y: touches[0].clientY,
          });
          while (moveHistory.length > 1 && now - moveHistory[0].time > 90) {
            moveHistory.shift();
          }

          const newX = startCenterPoint.x - dx;
          const newY = startCenterPoint.y - dy;
          const newCenter = unproject(newX, newY, self.zoom);
          if (self.maxBounds && !self.maxBounds.contains(newCenter)) return;

          self.center = new LatLng(newCenter);
          self._updateView();
          self._renderTiles();
          self._fire("move");
        } else if (touches.length === 2 && touchStartDist > 0) {
          const dist = Math.hypot(
            touches[0].clientX - touches[1].clientX,
            touches[0].clientY - touches[1].clientY,
          );
          if (dist - touchStartDist > 40) {
            self.setZoom(self.zoom + 1);
            touchStartDist = dist;
          } else if (touchStartDist - dist > 40) {
            self.setZoom(self.zoom - 1);
            touchStartDist = dist;
          }
        }
      });

      this.$container.on("touchend", function (e) {
        if (isDragging) {
          isDragging = false;
          self._renderTiles();
          self._fire("moveend");
        }
        touchStartDist = 0;
      });

      let wheelAccumulator = 0;
      let wheelTimer = null;
      this.$container.on("wheel", function (e) {
        e.preventDefault();
        wheelAccumulator += e.originalEvent.deltaY;
        clearTimeout(wheelTimer);
        wheelTimer = setTimeout(() => {
          if (wheelAccumulator < -25) {
            self.setZoom(self.zoom + 1);
          } else if (wheelAccumulator > 25) {
            self.setZoom(self.zoom - 1);
          }
          wheelAccumulator = 0;
        }, 35);
      });

      this.$container.on("dblclick", function (e) {
        if (
          $(e.target).closest(
            ".custom-marker-wrapper, .custom-spatial-marker, .community-map-pin, .teduh-popup-content-wrapper, .map-popup-btn, button, input, a, .teduh-control-zoom",
          ).length
        ) {
          return;
        }
        const offset = self.$container.offset();
        const clickPt = { x: e.pageX - offset.left, y: e.pageY - offset.top };
        const targetLatLng = self.containerPointToLatLng(clickPt);
        self.panTo(targetLatLng, { duration: 0.35 });
        self.setZoom(self.zoom + 1);
      });

      this.$container.on("click", function (e) {
        if (hasDragged) return;
        if (
          $(e.target).closest(
            ".custom-marker-wrapper, .custom-spatial-marker, .community-map-pin, .teduh-popup-content-wrapper, .map-popup-btn, button, input, a, .teduh-control-zoom",
          ).length
        ) {
          return;
        }
        const offset = self.$container.offset();
        const clickX = e.pageX - offset.left;
        const clickY = e.pageY - offset.top;
        const latlng = self.containerPointToLatLng({ x: clickX, y: clickY });
        self._fire("click", { latlng: latlng, originalEvent: e });
      });

      this.$container.on("mousemove", function (e) {
        const offset = self.$container.offset();
        const mouseX = e.pageX - offset.left;
        const mouseY = e.pageY - offset.top;
        const latlng = self.containerPointToLatLng({ x: mouseX, y: mouseY });
        self._fire("mousemove", { latlng: latlng, originalEvent: e });
      });

      $(window).on("resize", function () {
        self._updateView();
        self._renderTiles();
      });
    }

    latLngToContainerPoint(latlng) {
      const p = new LatLng(latlng);
      const centerP = project(this.center.lat, this.center.lng, this.zoom);
      const pointP = project(p.lat, p.lng, this.zoom);
      const width = this.$container.width() || window.innerWidth;
      const height = this.$container.height() || window.innerHeight;
      return {
        x: width / 2 + (pointP.x - centerP.x),
        y: height / 2 + (pointP.y - centerP.y),
      };
    }

    containerPointToLatLng(point) {
      const centerP = project(this.center.lat, this.center.lng, this.zoom);
      const width = this.$container.width() || window.innerWidth;
      const height = this.$container.height() || window.innerHeight;
      const targetX = centerP.x + (point.x - width / 2);
      const targetY = centerP.y + (point.y - height / 2);
      return new LatLng(unproject(targetX, targetY, this.zoom));
    }

    setView(center, zoom) {
      if (center) this.center = new LatLng(center);
      if (zoom !== undefined)
        this.zoom = Math.max(
          this.options.minZoom,
          Math.min(this.options.maxZoom, zoom),
        );
      this._updateView();
      this._renderTiles();
      this._fire("move");
      this._fire("moveend");
      this._fire("zoom");
      this._fire("zoomend");
      return this;
    }

    panTo(center, options) {
      const self = this;
      const targetCenter = new LatLng(center);
      const startCenter = self.center;
      const duration =
        options && options.duration ? options.duration * 1000 : 400;
      const startTime = performance.now();

      function step(now) {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        const ease =
          t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        self.center = new LatLng(
          startCenter.lat + (targetCenter.lat - startCenter.lat) * ease,
          startCenter.lng + (targetCenter.lng - startCenter.lng) * ease,
        );
        self._updateView();
        self._renderTiles();
        self._fire("move");

        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          self.center = targetCenter;
          self._updateView();
          self._renderTiles();
          self._fire("moveend");
        }
      }
      requestAnimationFrame(step);
      return this;
    }

    flyTo(center, zoom, options) {
      if (zoom === undefined || zoom === this.zoom) {
        return this.panTo(center, options);
      }
      const self = this;
      const targetCenter = new LatLng(center);
      const targetZoom = Math.max(
        self.options.minZoom,
        Math.min(self.options.maxZoom, zoom),
      );
      const startCenter = self.center;
      const startZoom = self.zoom;
      const duration =
        options && options.duration ? options.duration * 1000 : 650;
      const startTime = performance.now();

      function step(now) {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        const ease =
          t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        self.center = new LatLng(
          startCenter.lat + (targetCenter.lat - startCenter.lat) * ease,
          startCenter.lng + (targetCenter.lng - startCenter.lng) * ease,
        );
        const curZ = Math.round(startZoom + (targetZoom - startZoom) * ease);
        if (curZ !== self.zoom) {
          self.zoom = curZ;
          self._fire("zoom");
        }
        self._updateView();
        self._renderTiles();
        self._fire("move");

        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          self.center = targetCenter;
          self.zoom = targetZoom;
          self._updateView();
          self._renderTiles();
          self._fire("moveend");
          self._fire("zoomend");
        }
      }
      requestAnimationFrame(step);
      return this;
    }

    setZoom(zoom) {
      return this.setView(this.center, zoom);
    }
    getZoom() {
      return this.zoom;
    }
    getCenter() {
      return this.center;
    }
    getBounds() {
      const width = this.$container.width() || window.innerWidth;
      const height = this.$container.height() || window.innerHeight;
      return new LatLngBounds(
        this.containerPointToLatLng({ x: 0, y: height }),
        this.containerPointToLatLng({ x: width, y: 0 }),
      );
    }
    setMaxBounds(bounds) {
      this.maxBounds = bounds
        ? new LatLngBounds(bounds[0] || bounds.sw, bounds[1] || bounds.ne)
        : null;
      return this;
    }

    addLayer(layer) {
      this._layers.add(layer);
      layer._addToMap(this);
      return this;
    }

    removeLayer(layer) {
      if (layer) {
        this._layers.delete(layer);
        layer._removeFromMap(this);
      }
      return this;
    }

    closePopup() {
      if (this._activePopup) {
        this._activePopup.css({
          transform: "translate(-50%, -100%) scale(0.92)",
          opacity: 0,
        });
        const p = this._activePopup;
        setTimeout(() => p.remove(), 200);
        this._activePopup = null;
        this._activePopupMarker = null;
      }
      this.$popupPane.find(".teduh-popup").remove();
      return this;
    }

    on(event, fn) {
      if (!this._handlers[event]) this._handlers[event] = [];
      this._handlers[event].push(fn);
      return this;
    }

    off(event, fn) {
      if (this._handlers[event]) {
        this._handlers[event] = this._handlers[event].filter((h) => h !== fn);
      }
      return this;
    }

    _fire(event, data) {
      if (this._handlers[event]) {
        this._handlers[event].forEach((fn) => fn(data || {}));
      }
    }

    _updateView() {
      this._layers.forEach((layer) => {
        if (layer._update) layer._update();
      });

      if (this._activePopup && this._activePopupMarker) {
        const pt = this.latLngToContainerPoint(this._activePopupMarker.latlng);
        const offset =
          (this._activePopupMarker._popupOptions &&
            this._activePopupMarker._popupOptions.offset) || [0, 0];
        let anchorY = 0;
        if (
          this._activePopupMarker.options.icon &&
          this._activePopupMarker.options.icon.options &&
          this._activePopupMarker.options.icon.options.iconAnchor
        ) {
          anchorY = this._activePopupMarker.options.icon.options.iconAnchor[1];
        }
        this._activePopup.css({
          left: pt.x + offset[0] + "px",
          top: pt.y - anchorY + offset[1] + "px",
        });
      }
    }

    _renderTiles() {
      if (!this._tileLayer) return;
      const width = this.$container.width() || window.innerWidth;
      const height = this.$container.height() || window.innerHeight;
      const centerPoint = project(this.center.lat, this.center.lng, this.zoom);

      const minX = centerPoint.x - width / 2;
      const maxX = centerPoint.x + width / 2;
      const minY = centerPoint.y - height / 2;
      const maxY = centerPoint.y + height / 2;

      const numTiles = Math.pow(2, this.zoom);
      const minTileX = Math.floor(minX / 256) - 1;
      const maxTileX = Math.floor(maxX / 256) + 1;
      const minTileY = Math.floor(minY / 256) - 1;
      const maxTileY = Math.floor(maxY / 256) + 1;

      const activeKeys = new Set();

      for (let tx = minTileX; tx <= maxTileX; tx++) {
        for (let ty = minTileY; ty <= maxTileY; ty++) {
          if (ty < 0 || ty >= numTiles) continue;
          const wrappedX = ((tx % numTiles) + numTiles) % numTiles;
          const key = `${this.zoom}:${wrappedX}:${ty}`;
          activeKeys.add(key);

          const posX = Math.round(width / 2 + (tx * 256 - centerPoint.x));
          const posY = Math.round(height / 2 + (ty * 256 - centerPoint.y));

          if (this._tiles.has(key)) {
            const tileObj = this._tiles.get(key);
            tileObj.el.style.left = posX + "px";
            tileObj.el.style.top = posY + "px";
          } else {
            const tileUrl = this._tileLayer.getTileUrl(wrappedX, ty, this.zoom);
            const img = document.createElement("img");
            img.className = "teduh-tile";
            img.alt = "";
            img.style.position = "absolute";
            img.style.left = posX + "px";
            img.style.top = posY + "px";
            img.style.width = "256px";
            img.style.height = "256px";
            img.style.pointerEvents = "none";
            img.style.userSelect = "none";
            img.style.display = "block";
            img.style.opacity = "0";
            img.style.transition = "opacity 0.16s ease-in";
            img.onload = () => {
              img.style.opacity = "1";
            };
            img.onerror = () => {
              img.style.opacity = "0";
            };
            img.src = tileUrl;
            this.$tilePane[0].appendChild(img);
            this._tiles.set(key, { el: img, z: this.zoom, x: wrappedX, y: ty });
          }
        }
      }

      for (const [key, tileObj] of this._tiles.entries()) {
        if (!activeKeys.has(key)) {
          if (tileObj.z !== this.zoom || !tileObj.el.parentElement) {
            if (tileObj.el.parentElement) tileObj.el.remove();
            this._tiles.delete(key);
          }
        }
      }
    }
  }

  class Marker {
    constructor(latlng, options) {
      this.latlng = new LatLng(latlng);
      this.options = Object.assign({ icon: null, zIndexOffset: 0 }, options);
      this._map = null;
      this._popupContent = null;
      this._popupOptions = {};
      this._popupEl = null;
      this._popupInstance = null;
      this._tooltipText = null;
      this._handlers = {};
      this.$el = null;
    }

    addTo(map) {
      map.addLayer(this);
      return this;
    }

    _addToMap(map) {
      this._map = map;
      const self = this;
      let html = '<div class="teduh-default-pin"></div>';
      if (this.options.icon && this.options.icon.options) {
        html = this.options.icon.options.html || html;
      }
      const iconClass =
        (this.options.icon &&
          this.options.icon.options &&
          this.options.icon.options.className) ||
        "";
      this.$el = $(
        `<div class="leaflet-marker-icon leaflet-zoom-animated leaflet-interactive custom-marker-wrapper ${iconClass}" style="position:absolute;pointer-events:auto;cursor:pointer;z-index:${500 + (this.options.zIndexOffset || 0)};">${html}</div>`,
      );
      this.$el.appendTo(map.$markerPane);

      this.$el.on("click", function (e) {
        e.stopPropagation();
        if (
          self._popupContent &&
          (!self._handlers["click"] || self._handlers["click"].length === 0)
        ) {
          self.openPopup();
        }
        self._fire("click", { originalEvent: e, latlng: self.latlng });
      });

      this.$el.on("mouseenter mouseover", function (e) {
        self._fire("mouseover", { originalEvent: e, latlng: self.latlng });
      });

      this.$el.on("mouseleave mouseout", function (e) {
        self._fire("mouseout", { originalEvent: e, latlng: self.latlng });
      });

      this._update();
    }

    _removeFromMap(map) {
      if (this._popupEl) this._popupEl.remove();
      if (this.$el) this.$el.remove();
      this._map = null;
    }

    _update() {
      if (!this._map || !this.$el) return;
      const pt = this._map.latLngToContainerPoint(this.latlng);
      let anchorX = 0,
        anchorY = 0;
      if (
        this.options.icon &&
        this.options.icon.options &&
        this.options.icon.options.iconAnchor
      ) {
        anchorX = this.options.icon.options.iconAnchor[0];
        anchorY = this.options.icon.options.iconAnchor[1];
      }
      this.$el.css({
        left: pt.x - anchorX + "px",
        top: pt.y - anchorY + "px",
      });

      if (this._popupEl && this._popupEl.parent().length) {
        const offset =
          (this._popupOptions && this._popupOptions.offset) || [0, 0];
        let anchorY = 0;
        if (
          this.options.icon &&
          this.options.icon.options &&
          this.options.icon.options.iconAnchor
        ) {
          anchorY = this.options.icon.options.iconAnchor[1];
        }
        this._popupEl.css({
          left: pt.x + offset[0] + "px",
          top: pt.y - anchorY + offset[1] + "px",
        });
      }
    }

    setLatLng(latlng) {
      this.latlng = new LatLng(latlng);
      this._update();
      return this;
    }

    getLatLng() {
      return this.latlng;
    }

    setIcon(icon) {
      this.options.icon = icon;
      if (this.$el && icon && icon.options) {
        this.$el.html(icon.options.html);
      }
      this._update();
      return this;
    }

    bindPopup(content, options) {
      this._popupContent = content;
      this._popupOptions = options || {};
      return this;
    }

    openPopup() {
      if (!this._map || !this._popupContent) return this;
      this._map.closePopup();
      const pt = this._map.latLngToContainerPoint(this.latlng);
      const customClass =
        (this._popupOptions && this._popupOptions.className) || "";
      const offset =
        (this._popupOptions && this._popupOptions.offset) || [0, 0];
      let anchorY = 0;
      if (
        this.options.icon &&
        this.options.icon.options &&
        this.options.icon.options.iconAnchor
      ) {
        anchorY = this.options.icon.options.iconAnchor[1];
      }
      const posX = pt.x + offset[0];
      const posY = pt.y - anchorY + offset[1];

      const $popup = $(`
        <div class="leaflet-popup custom-leaflet-popup custom-teduh-popup ${customClass}" style="position:absolute;left:${posX}px;top:${posY}px;pointer-events:auto;z-index:900;">
          <div class="leaflet-popup-content-wrapper teduh-popup-content-wrapper">
            <div class="leaflet-popup-content teduh-popup-content">${this._popupContent}</div>
          </div>
          <div class="leaflet-popup-tip-container teduh-popup-tip-container"><div class="leaflet-popup-tip teduh-popup-tip"></div></div>
        </div>
      `).appendTo(this._map.$popupPane);

      this._popupEl = $popup;
      this._map._activePopup = $popup;
      this._map._activePopupMarker = this;

      const self = this;
      const popupObj = {
        getElement: () => $popup[0],
        isOpen: () => !!$popup.parent().length,
        remove: () => {
          $popup.addClass("is-sliding-out");
          setTimeout(() => $popup.remove(), 160);
        },
      };
      this._popupInstance = popupObj;

      this._fire("popupopen", { popup: popupObj });
      if (this._map) this._map._fire("popupopen", { popup: popupObj });
      return this;
    }

    closePopup() {
      if (this._popupEl) {
        this._popupEl.addClass("is-sliding-out");
        const p = this._popupEl;
        setTimeout(() => p.remove(), 160);
        this._popupEl = null;
        this._popupInstance = null;
        if (this._map && this._map._activePopupMarker === this) {
          this._map._activePopup = null;
          this._map._activePopupMarker = null;
        }
        this._fire("popupclose", {});
      }
      return this;
    }

    isPopupOpen() {
      return !!(
        this._popupEl &&
        this._popupEl.parent().length &&
        this._map &&
        this._map._activePopupMarker === this
      );
    }

    bindTooltip(text, options) {
      this._tooltipText = text;
      return this;
    }

    bringToFront() {
      if (this.$el) this.$el.css("z-index", 850);
      return this;
    }

    bringToBack() {
      if (this.$el) this.$el.css("z-index", 450);
      return this;
    }

    on(event, fn) {
      if (!this._handlers[event]) this._handlers[event] = [];
      this._handlers[event].push(fn);
      return this;
    }

    off(event, fn) {
      if (this._handlers[event]) {
        this._handlers[event] = this._handlers[event].filter((h) => h !== fn);
      }
      return this;
    }

    _fire(event, data) {
      if (this._handlers[event]) {
        this._handlers[event].forEach((fn) => fn(data || {}));
      }
    }

    getElement() {
      return this.$el ? this.$el[0] : null;
    }

    remove() {
      if (this._map) this._map.removeLayer(this);
    }
  }

  class Circle {
    constructor(latlng, options) {
      this.latlng = new LatLng(latlng);
      this.options = Object.assign(
        {
          radius: 10,
          color: "#1a382b",
          fillColor: "#1a382b",
          fillOpacity: 0.25,
          weight: 2,
          dashArray: null,
          interactive: false,
        },
        options,
      );
      this._map = null;
      this.$svgEl = null;
      this._path = null;
    }

    addTo(map) {
      map.addLayer(this);
      return this;
    }

    _addToMap(map) {
      this._map = map;
      this.$svgEl = $(
        document.createElementNS("http://www.w3.org/2000/svg", "circle"),
      );
      this._path = this.$svgEl[0];
      if (this.options.interactive) {
        this.$svgEl.css("pointer-events", "auto");
      } else {
        this.$svgEl.css("pointer-events", "none");
      }
      this.$svgEl.appendTo(map.$svgPane);
      this._applyStyle();
      this._update();
    }

    _removeFromMap(map) {
      if (this.$svgEl) this.$svgEl.remove();
      this._map = null;
      this._path = null;
    }

    _applyStyle() {
      if (!this.$svgEl) return;
      const strokeVal =
        this.options.stroke === false
          ? "none"
          : this.options.color || "none";
      const strokeWidth =
        this.options.stroke === false ? 0 : this.options.weight || 1;
      this.$svgEl.attr({
        stroke: strokeVal,
        "stroke-width": strokeWidth,
        "stroke-dasharray": this.options.dashArray || "none",
        fill: this.options.fillColor || "none",
        "fill-opacity":
          this.options.fillOpacity !== undefined
            ? this.options.fillOpacity
            : 0.2,
      });
      if (this.options.className) {
        this.$svgEl.attr("class", this.options.className);
      }
    }

    setStyle(opts) {
      Object.assign(this.options, opts);
      this._applyStyle();
      return this;
    }

    setRadius(r) {
      this.options.radius = r;
      this._update();
      return this;
    }

    getRadius() {
      return this.options.radius;
    }

    setLatLng(latlng) {
      this.latlng = new LatLng(latlng);
      this._update();
      return this;
    }

    getLatLng() {
      return this.latlng;
    }

    _update() {
      if (!this._map || !this.$svgEl) return;
      const pt = this._map.latLngToContainerPoint(this.latlng);
      const mpp = metersPerPixel(this.latlng.lat, this._map.zoom);
      const rPx = Math.max(3, this.options.radius / mpp);
      this.$svgEl.attr({
        cx: pt.x,
        cy: pt.y,
        r: rPx,
      });
    }

    remove() {
      if (this._map) this._map.removeLayer(this);
    }
  }

  class Polygon {
    constructor(latlngs, options) {
      this.latlngs = latlngs.map((pt) => new LatLng(pt));
      this.options = Object.assign(
        {
          color: "#ba4e2a",
          fillColor: "#ba4e2a",
          fillOpacity: 0.2,
          weight: 1,
          interactive: true,
        },
        options,
      );
      this._map = null;
      this.$svgEl = null;
      this._path = null;
      this._handlers = {};
      this._tooltipContent = null;
      this._tooltipOptions = {};
      this.$tooltipEl = null;
    }

    addTo(map) {
      map.addLayer(this);
      return this;
    }

    _addToMap(map) {
      this._map = map;
      const self = this;
      this.$svgEl = $(
        document.createElementNS("http://www.w3.org/2000/svg", "polygon"),
      );
      this._path = this.$svgEl[0];
      if (this.options.interactive) {
        this.$svgEl.css("pointer-events", "auto");
        this.$svgEl.css("cursor", "pointer");
      }
      this.$svgEl.appendTo(map.$svgPane);
      this._applyStyle();
      this._update();

      this.$svgEl.on("click", function (e) {
        e.stopPropagation();
        self._fire("click", { originalEvent: e });
      });

      this.$svgEl.on("mouseenter mouseover", function (e) {
        self._showTooltip(e);
        self._fire("mouseover", { originalEvent: e });
      });

      this.$svgEl.on("mousemove", function (e) {
        self._moveTooltip(e);
      });

      this.$svgEl.on("mouseleave mouseout", function (e) {
        self._hideTooltip();
        self._fire("mouseout", { originalEvent: e });
      });
    }

    _removeFromMap(map) {
      if (this.$tooltipEl) this.$tooltipEl.remove();
      if (this.$svgEl) this.$svgEl.remove();
      this._map = null;
      this._path = null;
    }

    _applyStyle() {
      if (!this.$svgEl) return;
      const strokeVal =
        this.options.stroke === false
          ? "none"
          : this.options.color || "none";
      const strokeWidth =
        this.options.stroke === false ? 0 : this.options.weight || 0;
      this.$svgEl.attr({
        stroke: strokeVal,
        "stroke-width": strokeWidth,
        fill: this.options.fillColor || "#BA4E2A",
        "fill-opacity":
          this.options.fillOpacity !== undefined
            ? this.options.fillOpacity
            : 0.001,
      });
      if (this.options.className) {
        this.$svgEl.attr("class", this.options.className);
      }
    }

    setStyle(opts) {
      Object.assign(this.options, opts);
      this._applyStyle();
      return this;
    }

    bindTooltip(content, options) {
      this._tooltipContent = content;
      this._tooltipOptions = options || {};
      return this;
    }

    getTooltip() {
      const self = this;
      return {
        getElement: () => (self.$tooltipEl ? self.$tooltipEl[0] : null),
      };
    }

    _showTooltip(e) {
      if (!this._map || !this._tooltipContent) return;
      if (!this.$tooltipEl) {
        const customClass =
          (this._tooltipOptions && this._tooltipOptions.className) || "";
        this.$tooltipEl = $(`
          <div class="teduh-tooltip ${customClass}" style="position:absolute;pointer-events:none;z-index:950;transition:opacity 0.2s ease, transform 0.2s cubic-bezier(0.16,1,0.3,1);">
            <div class="teduh-tooltip-inner">${this._tooltipContent}</div>
          </div>
        `).appendTo(this._map.$tooltipPane);
      }
      this._moveTooltip(e);
      this.$tooltipEl.css({ opacity: 1, transform: "scale(1)" });
      this._fire("tooltipopen", { tooltip: this.getTooltip() });
    }

    _moveTooltip(e) {
      if (!this._map || !this.$tooltipEl) return;
      const offset = this._map.$container.offset();
      const mouseX = e.pageX - offset.left;
      const mouseY = e.pageY - offset.top;
      this.$tooltipEl.css({
        left: mouseX + 12 + "px",
        top: mouseY + 12 + "px",
      });
    }

    _hideTooltip() {
      if (this.$tooltipEl) {
        this.$tooltipEl.css({ opacity: 0, transform: "scale(0.95)" });
        const t = this.$tooltipEl;
        setTimeout(() => t.remove(), 200);
        this.$tooltipEl = null;
      }
    }

    _update() {
      if (!this._map || !this.$svgEl) return;
      const points = this.latlngs
        .map((pt) => {
          const p = this._map.latLngToContainerPoint(pt);
          return `${p.x},${p.y}`;
        })
        .join(" ");
      this.$svgEl.attr("points", points);
    }

    on(event, fn) {
      if (!this._handlers[event]) this._handlers[event] = [];
      this._handlers[event].push(fn);
      return this;
    }

    off(event, fn) {
      if (this._handlers[event]) {
        this._handlers[event] = this._handlers[event].filter((h) => h !== fn);
      }
      return this;
    }

    _fire(event, data) {
      if (this._handlers[event]) {
        this._handlers[event].forEach((fn) => fn(data || {}));
      }
    }

    remove() {
      if (this._map) this._map.removeLayer(this);
    }
  }

  const DomEvent = {
    stopPropagation: function (e) {
      if (!e) return;
      if (e.stopPropagation) e.stopPropagation();
      if (e.originalEvent && e.originalEvent.stopPropagation) {
        e.originalEvent.stopPropagation();
      }
      if (e.preventDefault) e.preventDefault();
      if (e.cancelBubble !== undefined) e.cancelBubble = true;
    },
    disableClickPropagation: function (el) {
      if (!el) return;
      $(el).on(
        "click dblclick mousedown mouseup touchstart touchend pointerdown pointerup",
        function (e) {
          e.stopPropagation();
        },
      );
    },
    disableScrollPropagation: function (el) {
      if (!el) return;
      $(el).on("wheel scroll touchmove", function (e) {
        e.stopPropagation();
      });
    },
  };

  return {
    map: function (id, options) {
      return new MapEngine(id, options);
    },
    tileLayer: function (url, options) {
      return new TileLayer(url, options);
    },
    marker: function (latlng, options) {
      return new Marker(latlng, options);
    },
    circle: function (latlng, options) {
      return new Circle(latlng, options);
    },
    polygon: function (latlngs, options) {
      return new Polygon(latlngs, options);
    },
    divIcon: function (options) {
      return { options: options };
    },
    latLng: function (lat, lng) {
      return new LatLng(lat, lng);
    },
    latLngBounds: function (sw, ne) {
      return new LatLngBounds(sw, ne);
    },
    DomEvent: DomEvent,
    control: {
      zoom: function (options) {
        return {
          addTo: function (map) {
            const $ctrl = $(`
              <div class="teduh-control-zoom teduh-bar" style="position:absolute;bottom:24px;right:20px;z-index:500;display:flex;flex-direction:column;gap:5px;box-shadow:0 4px 18px rgba(0,0,0,0.15);">
                <button type="button" class="teduh-zoom-btn teduh-zoom-in" aria-label="Perbesar Peta" title="Perbesar Peta" style="width:38px;height:38px;border-radius:12px;background:rgba(255,255,255,0.96);backdrop-filter:blur(10px);border:1px solid rgba(228,228,231,0.9);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:20px;font-weight:700;color:#0e1116;transition:all 0.2s cubic-bezier(0.16,1,0.3,1);user-select:none;">+</button>
                <button type="button" class="teduh-zoom-btn teduh-zoom-out" aria-label="Perkecil Peta" title="Perkecil Peta" style="width:38px;height:38px;border-radius:12px;background:rgba(255,255,255,0.96);backdrop-filter:blur(10px);border:1px solid rgba(228,228,231,0.9);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:20px;font-weight:700;color:#0e1116;transition:all 0.2s cubic-bezier(0.16,1,0.3,1);user-select:none;">&minus;</button>
              </div>
            `).appendTo(map.$container);

            $ctrl.find(".teduh-zoom-in").on("click", (e) => {
              e.stopPropagation();
              map.setZoom(map.getZoom() + 1);
            });
            $ctrl.find(".teduh-zoom-out").on("click", (e) => {
              e.stopPropagation();
              map.setZoom(map.getZoom() - 1);
            });
            $ctrl.find(".teduh-zoom-btn").hover(
              function () {
                $(this).css({
                  transform: "scale(1.08)",
                  background: "#ffffff",
                  color: "#1a382b",
                  borderColor: "rgba(26,56,43,0.3)",
                });
              },
              function () {
                $(this).css({
                  transform: "scale(1)",
                  background: "rgba(255,255,255,0.96)",
                  color: "#0e1116",
                  borderColor: "rgba(228,228,231,0.9)",
                });
              },
            );
            return this;
          },
        };
      },
    },
  };
})(jQuery);

let mapInstance = null;
let activeZone = null;
let activeMarker = null;
let activeSimulationCircle = null;
let activeMissionCircle = null;
let userActiveMissionMarker = null;
let userActiveMissionCircle = null;
let citizenMissionMarkers = [];
let presetMarkers = [];
let pollutionPolygonLayers = [];
let macroThermalLayers = [];
let macroHitAreas = [];
let friendMarkers = [];
let selectedMissionFriends = [];
let isPollutionLayerActive = false;
let activeTreeSimCount = 1;
let completedActionSteps = new Set();
let currentDrawerStage = 1;
let activeFactorIndex = null;
let activeAnalysisTimeout = null;
let userLocationMarker = null;
let userLocationAccuracyCircle = null;
let isRequestingLocation = false;
let userLocationDetected = false;

document.addEventListener("DOMContentLoaded", () => {
  initMap();
  initSearchAutocomplete();
  initOnboarding();
  initDrawerTouchGestures();
  checkUrlParameters();
  syncUserProfile();
  initMapConsoleEntranceAnimation();
  initMapConsoleInteractions();
  initUserGeolocation();
});

function initMapConsoleEntranceAnimation() {
  $(".map-desktop-topbar, .map-mobile-search-capsule").addClass("animate-hero-down");
  $(".map-brand-logo-desktop, .map-mobile-brand-logo").addClass("animate-hero-scale");
  $(".map-statusbar, .map-status-pill, .map-floating-controls").addClass("animate-hero-up");
  $(".map-mobile-bottom-dock").addClass("animate-hero-up");

  const banner = document.getElementById("onboardingBanner");
  if (banner && !banner.classList.contains("hidden")) {
    $(banner).addClass("animate-hero-down");
  }
}

function initMap() {
  const mapElement = document.getElementById("map");
  if (!mapElement) return;

  mapInstance = L.map("map", {
    zoomControl: false,
    attributionControl: true,
  }).setView([-8.675, 115.215], 13);

  L.tileLayer("https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    attribution: "Citra Satelit &copy; Google Maps / Earth | Platform Teduh",
  }).addTo(mapInstance);

  const baliBounds = L.latLngBounds(
    L.latLng(-9.25, 114.2),
    L.latLng(-7.85, 115.95),
  );
  mapInstance.setMaxBounds(baliBounds);
  mapInstance.options.minZoom = 10;

  L.control
    .zoom({
      position: "bottomright",
    })
    .addTo(mapInstance);

  mapInstance.on("click", (e) => {
    handleMapFreeClick(e.latlng.lat, e.latlng.lng);
  });

  mapInstance.on("mousemove", (e) => {
    const coordsDisplay = document.getElementById("mapCoordinates");
    if (coordsDisplay) {
      coordsDisplay.textContent = `${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`;
    }
  });

  mapInstance.on("zoom", () => {
    updateThermalZoomState();
  });
  mapInstance.on("zoomend", () => {
    updateThermalZoomState();
  });

  renderPollutionLayers();

  renderCitizenMissions();

  renderUserActiveMissionPin();
}

function initUserGeolocation() {
  const gpsBtn = document.getElementById("mapGpsBtn");
  if (gpsBtn) {
    gpsBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      requestUserLocation(true);
    });
  }

  const urlParams = new URLSearchParams(window.location.search);
  const hasSpecificZone = urlParams.get("zone") || urlParams.get("analyze");

  if (!hasSpecificZone) {
    setTimeout(() => {
      requestUserLocation(false);
    }, 450);
  }
}

function requestUserLocation(isUserInitiated = false) {
  if (!navigator.geolocation) {
    if (isUserInitiated) {
      showToast("Peramban Anda tidak mendukung fitur lokasi GPS.");
    }
    return;
  }

  const gpsBtn = document.getElementById("mapGpsBtn");
  if (gpsBtn) gpsBtn.classList.add("is-locating");
  isRequestingLocation = true;

  if (isUserInitiated) {
    showToast("Mendeteksi titik lokasi GPS Anda...");
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      isRequestingLocation = false;
      userLocationDetected = true;
      if (gpsBtn) gpsBtn.classList.remove("is-locating");

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const accuracy = position.coords.accuracy || 20;

      window.userCurrentLocation = { lat, lng, accuracy };

      renderUserLocationMarker(lat, lng, accuracy);

      if (!mapInstance) return;

      const inBali = isWithinBali(lat, lng);

      if (inBali) {
        mapInstance.panTo([lat, lng], { duration: 0.5 });

        showToast(
          "📍 Lokasi Anda terdeteksi. Memindai iklim pekarangan Anda...",
        );

        setTimeout(() => {
          if (userLocationMarker) {
            userLocationMarker.openPopup();
          }
          handleMapFreeClick(lat, lng);
        }, 500);
      } else {
        mapInstance.setMaxBounds(null);
        mapInstance.panTo([lat, lng], { duration: 0.5 });
        showToast(
          `📍 Lokasi Anda terdeteksi (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        );
        setTimeout(() => {
          if (userLocationMarker) {
            userLocationMarker.openPopup();
          }
        }, 500);
      }
    },
    (error) => {
      isRequestingLocation = false;
      if (gpsBtn) gpsBtn.classList.remove("is-locating");

      if (isUserInitiated) {
        if (error.code === error.PERMISSION_DENIED) {
          showToast(
            "Akses lokasi ditolak. Silakan izinkan akses lokasi pada pengaturan peramban.",
          );
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          showToast("Informasi lokasi GPS tidak tersedia.");
        } else {
          showToast(
            "Waktu permintaan lokasi habis. Menampilkan peta Denpasar.",
          );
        }
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 15000,
    },
  );
}

function renderUserLocationMarker(lat, lng, accuracy) {
  if (!mapInstance) return;

  if (userLocationMarker) {
    mapInstance.removeLayer(userLocationMarker);
    userLocationMarker = null;
  }
  if (userLocationAccuracyCircle) {
    mapInstance.removeLayer(userLocationAccuracyCircle);
    userLocationAccuracyCircle = null;
  }

  userLocationAccuracyCircle = L.circle([lat, lng], {
    radius: Math.min(accuracy, 120),
    color: "#5C8437",
    fillColor: "#5C8437",
    fillOpacity: 0.12,
    weight: 1.5,
    dashArray: "4, 6",
  }).addTo(mapInstance);

  const userIcon = L.divIcon({
    className: "user-gps-marker-container",
    html: `
      <div class="user-location-pin" title="Lokasi Anda Saat Ini">
        <div class="user-location-pulse"></div>
        <div class="user-location-core"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  userLocationMarker = L.marker([lat, lng], {
    icon: userIcon,
    zIndexOffset: 1200,
    title: "Lokasi Anda Saat Ini",
  }).addTo(mapInstance);

  const popupContent = `
    <div class="map-popup-card">
      <div class="map-popup-header">
        <span class="map-popup-badge cool">📍 Lokasi Anda</span>
        <span class="map-popup-location">Akurasi ±${Math.round(accuracy)}m</span>
      </div>
      <h4 class="map-popup-title" style="margin-top: 4px;">Pekarangan Anda</h4>
      <p style="font-size: 11.5px; color: #4B5563; margin: 4px 0 8px 0; line-height: 1.4;">
        Koordinat GPS: <strong>${lat.toFixed(5)}, ${lng.toFixed(5)}</strong>
      </p>
      <button type="button" class="map-popup-btn" onclick="handleMapFreeClick(${lat}, ${lng})">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <span>Pindai Suhu &amp; Pohon Pekarangan</span>
      </button>
    </div>
  `;

  userLocationMarker.bindPopup(popupContent, {
    className: "custom-teduh-popup",
    offset: [0, -10],
    closeButton: false,
  });
}

function isWithinBali(lat, lng) {
  if (lat < -8.92 || lat > -8.05 || lng < 114.4 || lng > 115.75) {
    return false;
  }
  if (lat >= -8.85 && lat <= -8.65 && lng >= 115.42 && lng <= 115.65) {
    return true;
  }

  const baliPolygon = [
    [-8.1, 114.43], 
    [-8.05, 114.7], 
    [-8.07, 115.1], 
    [-8.12, 115.35], 
    [-8.25, 115.6], 
    [-8.35, 115.72], 
    [-8.48, 115.68], 
    [-8.55, 115.54], 
    [-8.58, 115.44], 
    [-8.6, 115.35], 
    [-8.68, 115.28], 
    [-8.75, 115.25], 
    [-8.8, 115.24], 
    [-8.85, 115.23], 
    [-8.88, 115.18], 
    [-8.85, 115.08], 
    [-8.78, 115.15], 
    [-8.72, 115.15], 
    [-8.64, 115.12], 
    [-8.58, 115.08], 
    [-8.5, 114.95], 
    [-8.42, 114.75], 
    [-8.38, 114.58], 
    [-8.25, 114.43], 
    [-8.15, 114.42], 
  ];

  let inside = false;
  for (let i = 0, j = baliPolygon.length - 1; i < baliPolygon.length; j = i++) {
    const xi = baliPolygon[i][0],
      yi = baliPolygon[i][1];
    const xj = baliPolygon[j][0],
      yj = baliPolygon[j][1];
    const intersect =
      yi > lng !== yj > lng && lat < ((xj - xi) * (lng - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function renderPresetMarkers() {
  presetMarkers.forEach((m) => mapInstance.removeLayer(m));
  presetMarkers = [];

  if (typeof TEDUH_DATA === "undefined" || !TEDUH_DATA.zones) return;

  TEDUH_DATA.zones.forEach((zone) => {
    const isHot = zone.isHotspot !== false;
    const dotColor = isHot ? "#BA4E2A" : "#1A382B";
    const tempText = zone.surfaceTemp || "36.5°C";

    const markerHtml = `
      <div class="custom-spatial-marker group" data-zone-id="${zone.id}" title="${formatZoneTitle(zone.name)}">
        <div class="marker-pulse-ring" style="background: ${isHot ? "rgba(186, 78, 42, 0.4)" : "rgba(26, 56, 43, 0.35)"};"></div>
        <div class="marker-inner-circle" style="box-shadow: 0 3px 12px rgba(14, 17, 22, 0.25);">
          <div class="marker-core-dot ${isHot ? "hot" : "cool"}" style="background-color: ${dotColor};"></div>
        </div>
        <div class="marker-hover-label">${formatZoneTitle(zone.name)} • ${tempText}</div>
      </div>
    `;

    const customIcon = L.divIcon({
      className: "teduh-zone-marker-wrapper",
      html: markerHtml,
      iconAnchor: [14, 14],
    });

    const marker = L.marker([zone.lat, zone.lng], {
      icon: customIcon,
      zIndexOffset: 350,
    }).addTo(mapInstance);

    marker._teduhZoneId = zone.id;

    const locationLabel = zone.village
      ? `${zone.village}, ${zone.city || "Denpasar"}`
      : zone.district
        ? `${zone.district}, ${zone.city || "Denpasar"}`
        : zone.address || zone.city || "Denpasar";
    const shortAqiStatus = zone.aqiStatus
      ? zone.aqiStatus.split("&")[0].split("/")[0].trim()
      : "Berdebu";

    const popupContent = `
      <div class="map-popup-card" data-zone-id="${zone.id}" onclick="handleMapPopupCardClick(event, '${zone.id}')" style="cursor: pointer;">
        <div class="map-popup-header">
          <span class="map-popup-badge ${isHot ? "hot" : "cool"}">${zone.surfaceTemp}</span>
          <span class="map-popup-location">${locationLabel}</span>
        </div>
        <h4 class="map-popup-title">${zone.name}</h4>
        <div class="map-popup-grid">
          <div class="map-popup-mini-stat">
            <span>Kondisi Udara</span>
            <strong>${shortAqiStatus}</strong>
          </div>
          <div class="map-popup-mini-stat">
            <span>Penghijauan</span>
            <strong>${zone.canopyCover}</strong>
          </div>
          <div class="map-popup-mini-stat">
            <span>Suhu Udara</span>
            <strong>${zone.airTemp || "33.5°C"}</strong>
          </div>
          <div class="map-popup-mini-stat">
            <span>Tingkat Panas</span>
            <strong>${zone.heatLevel || (isHot ? "Sangat Panas" : "Sejuk")}</strong>
          </div>
        </div>
        <div class="map-popup-cta-btn" aria-hidden="true">
          <span class="map-popup-cta-text">Ketuk untuk Analisa Lengkap</span>
          <span class="map-popup-cta-icon">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </span>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent, {
      offset: [0, -14],
      closeButton: false,
      className: "custom-teduh-popup",
      autoPan: true,
    });

    bindHoverPopup(marker);

    marker.on("click", (e) => {
      L.DomEvent.stopPropagation(e);
      if (currentDrawerStage === 2 && activeZone) {
        dismissNearbyFriendsNotice();
        if (mapInstance) mapInstance.closePopup();
        return;
      }
      const isMobile = window.innerWidth <= 860;
      selectZone(zone, false, null, !isMobile);
    });

    presetMarkers.push(marker);
  });
}

function handleMapFreeClick(lat, lng) {
  if (currentDrawerStage === 2 && activeZone) {
    dismissNearbyFriendsNotice();
    if (mapInstance) {
      mapInstance.closePopup();
    }
    return;
  }

  if (!isWithinBali(lat, lng)) {
    showToast(
      "Titik berada di luar wilayah pemantauan. Silakan klik area daratan pemukiman.",
    );
    return;
  }

  const simulatedZone = TEDUH_DATA.generateDynamicAnalysis(lat, lng);
  const isMobile = window.innerWidth <= 860;
  selectZone(simulatedZone, true, null, !isMobile);
}

let activeCitizenMission = null;
let selectedCitizenMissionMarker = null;

function getUserActiveMissionForZone(zone) {
  if (typeof localStorage === "undefined" || !zone) return null;
  try {
    const savedStr = localStorage.getItem("teduh_active_mission");
    if (!savedStr) return null;
    const saved = JSON.parse(savedStr);
    if (!saved || saved.isCompleted) return null;

    if (saved.zoneId && (saved.zoneId === zone.id || saved.id === zone.id)) {
      return saved;
    }
    if (zone.id && saved.id === zone.id) {
      return saved;
    }

    if (saved.zoneName && zone.name) {
      const sName = saved.zoneName.toLowerCase().trim();
      const zName = zone.name.toLowerCase().trim();
      if (sName === zName || sName.includes(zName) || zName.includes(sName)) {
        return saved;
      }
    }

    if (
      saved.lat != null &&
      saved.lng != null &&
      zone.lat != null &&
      zone.lng != null
    ) {
      const dLat = Math.abs(parseFloat(saved.lat) - parseFloat(zone.lat));
      const dLng = Math.abs(parseFloat(saved.lng) - parseFloat(zone.lng));
      if (dLat < 0.0035 && dLng < 0.0035) {
        return saved;
      }
    }
  } catch (e) {}
  return null;
}

function formatZoneTitle(name) {
  if (!name) return "Kawasan Pilihan";
  let clean = name.replace(/\s*\([^)]*\)/g, "").trim();
  clean = clean.replace(/^Kawasan Wisata\s+/i, "");
  return clean;
}

function formatShortLocation(loc) {
  if (!loc) return "Denpasar";
  const parts = loc
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]}, ${parts[1]}`;
  }
  return loc;
}

function selectZone(
  zone,
  isDynamic = false,
  citizenMission = null,
  shouldOpenDrawer = null,
) {
  if (!zone || !mapInstance) return;

  const activeMissionObj = !citizenMission
    ? getUserActiveMissionForZone(zone)
    : null;
  const isUserActiveZone = !!activeMissionObj;

  if (isUserActiveZone && activeMissionObj) {
    zone = {
      ...zone,
      id: activeMissionObj.zoneId || zone.id,
      name: activeMissionObj.zoneName || zone.name,
      district: activeMissionObj.district || zone.district || "Denpasar",
      lat: activeMissionObj.lat != null ? activeMissionObj.lat : zone.lat,
      lng: activeMissionObj.lng != null ? activeMissionObj.lng : zone.lng,
      fullAddress: zone.fullAddress || activeMissionObj.zoneName || zone.name,
    };
  }

  const drawer = document.getElementById("spatialDrawer");
  const isDrawerOpen = drawer && drawer.classList.contains("is-open");

  const isSameCitizenMission =
    citizenMission &&
    activeCitizenMission &&
    activeCitizenMission.id === citizenMission.id;
  const isSameUserActiveMission =
    isUserActiveZone &&
    activeZone &&
    getUserActiveMissionForZone(activeZone) !== null;
  const isSameStandardZone =
    !citizenMission &&
    !activeCitizenMission &&
    !isUserActiveZone &&
    activeZone &&
    activeZone.id === zone.id;

  if (
    isDrawerOpen &&
    (isSameCitizenMission || isSameUserActiveMission || isSameStandardZone)
  ) {
    if (citizenMission) {
      const targetMarker = citizenMissionMarkers.find(
        (m) => m._teduhMissionId === citizenMission.id,
      );
      if (targetMarker) {
        selectedCitizenMissionMarker = targetMarker;
        if (!targetMarker.isPopupOpen()) {
          targetMarker.openPopup();
        }
      }
    } else if (isUserActiveZone && userActiveMissionMarker) {
      if (!userActiveMissionMarker.isPopupOpen()) {
        userActiveMissionMarker.openPopup();
      }
    } else if (activeMarker && !activeMarker.isPopupOpen()) {
      activeMarker.openPopup();
    }
    return;
  }

  activeZone = zone;
  activeCitizenMission = citizenMission;

  if (activeAnalysisTimeout) {
    clearTimeout(activeAnalysisTimeout);
    activeAnalysisTimeout = null;
  }

  clearCommunityFriends();
  dismissNearbyFriendsNotice();

  if (activeSimulationCircle) {
    mapInstance.removeLayer(activeSimulationCircle);
    activeSimulationCircle = null;
  }
  if (activeMissionCircle) {
    mapInstance.removeLayer(activeMissionCircle);
    activeMissionCircle = null;
  }

  if (activeMarker) {
    mapInstance.removeLayer(activeMarker);
    activeMarker = null;
  }

  if (!citizenMission && !isUserActiveZone) {
    selectedCitizenMissionMarker = null;
    const isHot = zone.isHotspot;
    const dotColor = isHot ? "#BA4E2A" : "#1A382B";

    const activeIcon = L.divIcon({
      className: "active-inspect-marker",
      html: `
        <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: ${dotColor}; opacity: 0.22; animation: pulse-ring 2.2s cubic-bezier(0.2, 0.8, 0.4, 1) infinite;"></div>
          <div style="width: 24px; height: 24px; border-radius: 50%; background: #FFFFFF; box-shadow: 0 3px 10px rgba(14, 17, 22, 0.2); display: flex; align-items: center; justify-content: center;">
            <div style="width: 12px; height: 12px; border-radius: 50%; background: ${dotColor};"></div>
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    activeMarker = L.marker([zone.lat, zone.lng], { icon: activeIcon }).addTo(
      mapInstance,
    );

    const locationLabel = zone.village
      ? `${zone.village}, ${zone.city || "Denpasar"}`
      : zone.district
        ? `${zone.district}, ${zone.city || "Denpasar"}`
        : zone.address || zone.city || "Denpasar";
    const shortAqiStatus = zone.aqiStatus
      ? zone.aqiStatus.split("&")[0].split("/")[0].trim()
      : "Berdebu";
    const popupContent = `
      <div class="map-popup-card" data-zone-id="${zone.id}" onclick="handleMapPopupCardClick(event, '${zone.id}')" style="cursor: pointer;">
        <div class="map-popup-header">
          <span class="map-popup-badge ${isHot ? "hot" : "cool"}">${zone.surfaceTemp}</span>
          <span class="map-popup-location">${locationLabel}</span>
        </div>
        <h4 class="map-popup-title">${zone.name}</h4>
        <div class="map-popup-grid">
          <div class="map-popup-mini-stat">
            <span>Kondisi Udara</span>
            <strong>${shortAqiStatus}</strong>
          </div>
          <div class="map-popup-mini-stat">
            <span>Penghijauan</span>
            <strong>${zone.canopyCover}</strong>
          </div>
          <div class="map-popup-mini-stat">
            <span>Suhu Udara</span>
            <strong>${zone.airTemp || "33.5°C"}</strong>
          </div>
          <div class="map-popup-mini-stat">
            <span>Tingkat Panas</span>
            <strong>${zone.heatLevel || (isHot ? "Sangat Panas" : "Sejuk")}</strong>
          </div>
        </div>
        <div class="map-popup-cta-btn" aria-hidden="true">
          <span class="map-popup-cta-text">Ketuk untuk Analisa Lengkap</span>
          <span class="map-popup-cta-icon">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </span>
        </div>
      </div>
    `;

    mapInstance.closePopup();

    activeMarker.bindPopup(popupContent, {
      offset: [0, -12],
      closeButton: false,
      className: "custom-teduh-popup",
      autoPan: true,
      autoPanPaddingTopLeft: [20, 75],
      autoPanPaddingBottomRight: [20, 75],
    });

    activeMarker.openPopup();

    activeMarker.on("click", (e) => {
      L.DomEvent.stopPropagation(e);
      const isMobile = window.innerWidth <= 860;
      if (isMobile) {
        activeMarker.openPopup();
      } else {
        openDrawer();
      }
    });
  } else if (isUserActiveZone) {
    selectedCitizenMissionMarker = null;
    if (userActiveMissionMarker && !userActiveMissionMarker.isPopupOpen()) {
      userActiveMissionMarker.openPopup();
    }
  } else {
    const targetMarker = citizenMissionMarkers.find(
      (m) => m._teduhMissionId === citizenMission.id,
    );
    if (targetMarker) {
      selectedCitizenMissionMarker = targetMarker;
      if (!targetMarker.isPopupOpen()) {
        targetMarker.openPopup();
      }
    }
  }

  const citizenBadge = document.getElementById("drawerCitizenProfileBadge");
  const standardTitleGroup = document.getElementById(
    "drawerStandardTitleGroup",
  );
  const avatarEl = document.getElementById("drawerHeaderAvatar");
  const authorNameEl = document.getElementById("drawerHeaderAuthorName");
  const headerLocEl = document.getElementById("drawerHeaderLocation");

  const nameEl = document.getElementById("zoneName");

  if (citizenMission) {
    if (citizenBadge) citizenBadge.classList.remove("hidden");
    if (standardTitleGroup) standardTitleGroup.classList.add("hidden");

    if (avatarEl) {
      const avatarImgSrc =
        citizenMission.authorAvatarImg ||
        (typeof TEDUH_DATA !== "undefined" && TEDUH_DATA.friendsDirectory
          ? TEDUH_DATA.friendsDirectory.find(
              (f) => f.name === citizenMission.authorName,
            )?.avatarImg
          : null) ||
        "../assets/avatars/dewi-lestari.jpg";
      avatarEl.innerHTML = `<img src="${avatarImgSrc}" alt="${escapeHtml(citizenMission.authorName || "Penggagas")}" class="w-full h-full object-cover rounded-full" onerror="this.src='../assets/avatars/dewi-lestari.jpg'">`;
    }
    if (authorNameEl) {
      authorNameEl.textContent = citizenMission.authorName || "Penggagas Warga";
    }
    if (headerLocEl) {
      const loc =
        citizenMission.location ||
        citizenMission.zoneName ||
        zone.name ||
        "Denpasar";
      headerLocEl.textContent = formatShortLocation(loc);
    }
  } else {
    if (citizenBadge) citizenBadge.classList.add("hidden");
    if (standardTitleGroup) standardTitleGroup.classList.remove("hidden");

    if (nameEl) nameEl.textContent = formatZoneTitle(zone.name);
  }

  const drawerHeader = document.getElementById("drawerHeader");
  const drawerBody = document.getElementById("drawerBody");
  const loadingEl = document.getElementById("drawerLoadingState");
  const stageAnalysis = document.getElementById("drawerStageAnalysis");
  const stageActions = document.getElementById("drawerStageActions");

  const isMobile = window.innerWidth <= 860;
  const shouldOpenNow =
    shouldOpenDrawer !== null ? shouldOpenDrawer : !isMobile;

  populateDrawer(zone);

  if (drawerHeader) {
    drawerHeader.style.display = "flex";
    drawerHeader.classList.remove("hidden");
  }
  if (drawerBody) {
    drawerBody.style.display = "flex";
    drawerBody.classList.remove("hidden");
  }
  if (stageAnalysis) stageAnalysis.classList.remove("hidden");
  if (stageActions) stageActions.classList.add("hidden");

  if (shouldOpenNow) {
    if (loadingEl) {
      loadingEl.classList.remove("is-fading-out", "hidden");
      loadingEl.style.display = "flex";
      loadingEl.style.opacity = "1";
    }

    openDrawer();

    activeAnalysisTimeout = setTimeout(() => {
      if (loadingEl) {
        loadingEl.classList.add("is-fading-out");
        setTimeout(() => {
          loadingEl.style.display = "none";
          loadingEl.classList.remove("is-fading-out");
        }, 280);
      }

      animateAnalysis(zone);

      if (!isMobile) {
        if (isUserActiveZone && userActiveMissionMarker) {
          if (!userActiveMissionMarker.isPopupOpen()) {
            userActiveMissionMarker.openPopup();
          }
        } else if (activeMarker) {
          if (!activeMarker.isPopupOpen()) {
            activeMarker.openPopup();
          }
        }
      }
    }, 700);
  } else {
    if (loadingEl) {
      loadingEl.style.display = "none";
      loadingEl.classList.remove("is-fading-out");
    }

    setTimeout(() => {
      if (isUserActiveZone && userActiveMissionMarker) {
        if (!userActiveMissionMarker.isPopupOpen()) {
          userActiveMissionMarker.openPopup();
        }
      } else if (activeMarker) {
        if (!activeMarker.isPopupOpen()) {
          activeMarker.openPopup();
        }
      } else if (citizenMission) {
        const targetMarker = citizenMissionMarkers.find(
          (m) => m._teduhMissionId === citizenMission.id,
        );
        if (targetMarker && !targetMarker.isPopupOpen()) {
          targetMarker.openPopup();
        }
      }
    }, 100);
  }
}

function openZoneDrawerFromPopup(
  zoneId = null,
  missionId = null,
  customCallback = null,
) {
  const isMobile = window.innerWidth <= 860;
  if (isMobile) {
    const openPopupEl = document.querySelector(".custom-teduh-popup, .teduh-popup");
    if (openPopupEl) {
      openPopupEl.classList.add("is-sliding-out");
    }
    setTimeout(() => {
      if (mapInstance) {
        mapInstance.closePopup();
      }
      if (typeof customCallback === "function") {
        customCallback();
      } else if (missionId) {
        selectCitizenMission(missionId, true);
      } else if (zoneId && (!activeZone || activeZone.id !== zoneId)) {
        const found =
          typeof TEDUH_DATA !== "undefined" && TEDUH_DATA.zones
            ? TEDUH_DATA.zones.find((z) => z.id === zoneId)
            : null;
        if (found) {
          selectZone(found, false, null, true);
        } else {
          openDrawer();
          if (activeZone) animateAnalysis(activeZone);
        }
      } else {
        openDrawer();
        if (activeZone) animateAnalysis(activeZone);
      }
    }, 140);
  } else {
    if (typeof customCallback === "function") {
      customCallback();
    } else {
      openDrawer();
    }
  }
}

function handleMapPopupCardClick(
  e,
  zoneId = null,
  missionId = null,
  customCallback = null,
) {
  if (e) {
    e.stopPropagation();
  }
  openZoneDrawerFromPopup(zoneId, missionId, customCallback);
}

function animateAnalysis(zone) {
  const tempNum = parseFloat(zone.surfaceTemp) || 35.0;
  const pinPercent = Math.min(
    Math.max(((tempNum - 24.0) / (42.0 - 24.0)) * 100, 4),
    96,
  );
  const dominant = zone.dominantFactor || {
    percentage: 40,
    label: "Minim Pohon",
  };

  const startVal = Math.max(20.0, tempNum - 10.0);
  const surfaceEl = document.getElementById("metricSurfaceTemp");
  if (surfaceEl) {
    const startTime = performance.now();
    const duration = 750;
    function countTemp(now) {
      const p = Math.min(1, (now - startTime) / duration);
      const ease = 1 - Math.pow(1 - p, 3);
      const current = startVal + (tempNum - startVal) * ease;
      surfaceEl.textContent = `${current.toFixed(1)}°C`;
      if (p < 1) requestAnimationFrame(countTemp);
      else surfaceEl.textContent = `${tempNum.toFixed(1)}°C`;
    }
    requestAnimationFrame(countTemp);
  }

  const $pin = $("#spectrumPin");
  $pin.css({
    transition: "none",
    left: "0%",
    transform: "scale(0.85)",
  });
  requestAnimationFrame(() => {
    $pin.css({
      transition: "left 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
      left: `${pinPercent}%`,
      transform: "scale(1)",
    });
  });

  const $donut = $("#donutSvgChart");
  $donut.css({
    transition: "none",
    transform: "rotate(-25deg) scale(0.95)",
    opacity: 0.85,
  });
  requestAnimationFrame(() => {
    $donut.css({
      transition: "all 0.75s cubic-bezier(0.34, 1.25, 0.64, 1)",
      transform: "rotate(0deg) scale(1)",
      opacity: 1,
    });
  });

  const centerScoreEl = document.getElementById("donutCenterScore");
  if (centerScoreEl) {
    const target = dominant.percentage || 40;
    const startTime = performance.now();
    const duration = 700;
    function countScore(now) {
      const p = Math.min(1, (now - startTime) / duration);
      const ease = 1 - Math.pow(1 - p, 3);
      centerScoreEl.textContent = `${Math.round(target * ease)}%`;
      if (p < 1) requestAnimationFrame(countScore);
      else centerScoreEl.textContent = `${target}%`;
    }
    requestAnimationFrame(countScore);
  }
}

function populateDrawer(zone) {
  switchDrawerStage(1, false);

  completedActionSteps.clear();
  updateActionChecklistUI();

  activeTreeSimCount = 1;
  updateTreeSimUI();

  activeFactorIndex = null;

  let isUserActiveMission = false;
  let isMissionExpired = false;
  let userActiveMissionDate = "";
  let activeMissionObj = null;

  if (!activeCitizenMission) {
    activeMissionObj = getUserActiveMissionForZone(zone);
    if (activeMissionObj) {
      isUserActiveMission = true;
      userActiveMissionDate = activeMissionObj.scheduledDate || "";
      if (activeMissionObj.scheduledDate) {
        const targetTime = new Date(
          activeMissionObj.scheduledDate + "T23:59:59",
        ).getTime();
        if (!isNaN(targetTime) && Date.now() > targetTime) {
          isMissionExpired = true;
        }
      }
    }
  }

  const citizenBadge = document.getElementById("drawerCitizenProfileBadge");
  const standardTitleGroup = document.getElementById(
    "drawerStandardTitleGroup",
  );
  const userMissionTag = document.getElementById("drawerUserMissionTag");
  const avatarEl = document.getElementById("drawerHeaderAvatar");
  const authorNameEl = document.getElementById("drawerHeaderAuthorName");
  const headerLocEl = document.getElementById("drawerHeaderLocation");

  const nameEl = document.getElementById("zoneName");

  if (activeCitizenMission) {
    if (citizenBadge) citizenBadge.classList.remove("hidden");
    if (standardTitleGroup) standardTitleGroup.classList.add("hidden");
    if (userMissionTag) userMissionTag.classList.add("hidden");

    if (avatarEl) {
      const avatarImgSrc =
        activeCitizenMission.authorAvatarImg ||
        (typeof TEDUH_DATA !== "undefined" && TEDUH_DATA.friendsDirectory
          ? TEDUH_DATA.friendsDirectory.find(
              (f) => f.name === activeCitizenMission.authorName,
            )?.avatarImg
          : null) ||
        "../assets/avatars/dewi-lestari.jpg";
      avatarEl.innerHTML = `<img src="${avatarImgSrc}" alt="${escapeHtml(activeCitizenMission.authorName || "Penggagas")}" class="w-full h-full object-cover rounded-full" onerror="this.src='../assets/avatars/dewi-lestari.jpg'">`;
    }
    if (authorNameEl) {
      authorNameEl.textContent =
        activeCitizenMission.authorName || "Penggagas Warga";
    }
    if (headerLocEl) {
      const loc =
        activeCitizenMission.location ||
        activeCitizenMission.zoneName ||
        zone.name ||
        "Denpasar";
      headerLocEl.textContent = formatShortLocation(loc);
    }
  } else {
    if (citizenBadge) citizenBadge.classList.add("hidden");
    if (standardTitleGroup) standardTitleGroup.classList.remove("hidden");

    if (userMissionTag) {
      if (isUserActiveMission) {
        userMissionTag.classList.remove("hidden");
        if (isMissionExpired) {
          userMissionTag.textContent = "Misi Hangus (Perlu Diatur Ulang)";
          userMissionTag.classList.add("expired");
        } else {
          userMissionTag.textContent = "Misi Aktif Saya";
          userMissionTag.classList.remove("expired");
        }
      } else {
        userMissionTag.classList.add("hidden");
      }
    }

    if (nameEl) nameEl.textContent = formatZoneTitle(zone.name);
  }

  const surfaceEl = document.getElementById("metricSurfaceTemp");
  if (surfaceEl) surfaceEl.textContent = zone.surfaceTemp;

  const tempNum = parseFloat(zone.surfaceTemp) || 35.0;
  const minTemp = 24.0;
  const maxTemp = 42.0;
  const pinPercent = Math.min(
    Math.max(((tempNum - minTemp) / (maxTemp - minTemp)) * 100, 4),
    96,
  );
  const pinEl = document.getElementById("spectrumPin");
  if (pinEl) pinEl.style.left = `${pinPercent}%`;

  const currentLabelEl = document.getElementById("spectrumCurrentLabel");
  if (currentLabelEl) {
    currentLabelEl.textContent = `${zone.surfaceTemp} ${zone.heatLevel || "Terik"}`;
  }

  renderDonutChartAndLegend(zone);

  const diagEl = document.getElementById("zoneDiagnosisText");
  if (diagEl) diagEl.textContent = zone.problemDiagnosis;
  const diagBadge = document.getElementById("narrativeFactorBadge");
  if (diagBadge) diagBadge.classList.add("hidden");
  const diagTitle = document.getElementById("narrativeTitleLabel");
  if (diagTitle) diagTitle.textContent = "Dampak ke Pemukiman:";

  const tree = zone.recommendedTree;
  if (tree) {
    const treeImgEl = document.getElementById("treeImage");
    const treeNameEl = document.getElementById("treeName");
    const treeBenefitEl = document.getElementById("treeBenefit");
    const rootBadge = document.getElementById("treeRootBadge");
    const safetyBadge = document.getElementById("treeSafetyBadge");

    if (treeImgEl) {
      treeImgEl.src = tree.image || "../assets/trees/pohon-tanjung.jpg";
      treeImgEl.alt = tree.name;
    }
    if (treeNameEl) treeNameEl.textContent = tree.name;
    if (treeBenefitEl) treeBenefitEl.textContent = tree.benefit;
    if (rootBadge)
      rootBadge.textContent = tree.rootType || "Akar Tunggang Dalam";
    if (safetyBadge)
      safetyBadge.textContent = tree.pipeSafety
        ? "Aman Saluran Got"
        : "Aman Pipa & Fondasi";
  }

  const treeScheduleBox = document.getElementById("drawerTreeScheduleBox");
  const treeScheduleDateEl = document.getElementById("drawerTreeScheduleDate");

  if (treeScheduleBox && treeScheduleDateEl) {
    if (activeCitizenMission && activeCitizenMission.scheduledDate) {
      const formattedDate =
        typeof TEDUH_DATA !== "undefined" && TEDUH_DATA.formatDateIndo
          ? TEDUH_DATA.formatDateIndo(activeCitizenMission.scheduledDate)
          : activeCitizenMission.scheduledDate;
      treeScheduleDateEl.textContent = formattedDate;
      treeScheduleDateEl.classList.remove("text-terracotta");
      treeScheduleBox.classList.remove("hidden");
    } else if (isUserActiveMission && userActiveMissionDate) {
      const formattedDate =
        typeof TEDUH_DATA !== "undefined" && TEDUH_DATA.formatDateIndo
          ? TEDUH_DATA.formatDateIndo(userActiveMissionDate)
          : userActiveMissionDate;
      if (isMissionExpired) {
        treeScheduleDateEl.textContent = `${formattedDate} (Hangus)`;
        treeScheduleDateEl.classList.add("text-terracotta");
      } else {
        treeScheduleDateEl.textContent = formattedDate;
        treeScheduleDateEl.classList.remove("text-terracotta");
      }
      treeScheduleBox.classList.remove("hidden");
    } else {
      treeScheduleBox.classList.add("hidden");
    }
  }

  const actionPlan = zone.actionPlan || {
    now: {
      title: "Tentukan Titik Tanam Aman",
      desc: "Pilih pekarangan berjarak minimal 1.5 meter dari dinding rumah dan saluran air.",
    },
    thisWeek: {
      title: "Gali Lubang & Beri Kompos",
      desc: "Gali lubang 60x60 cm dan campurkan kompos alami untuk nutrisi awal bibit.",
    },
    longTerm: {
      title: `Tanam Bibit ${tree ? tree.name : "Pohon Tanjung"}`,
      desc: "Tanam bibit tegak lurus, padatkan tanah sekitar, dan siram secukupnya.",
    },
  };

  const step1TitleEl = document.getElementById("step1Title");
  const step1DescEl = document.getElementById("step1Desc");
  const step2TitleEl = document.getElementById("step2Title");
  const step2DescEl = document.getElementById("step2Desc");
  const step3TitleEl = document.getElementById("step3Title");
  const step3DescEl = document.getElementById("step3Desc");

  if (step1TitleEl && actionPlan.now)
    step1TitleEl.textContent = actionPlan.now.title;
  if (step1DescEl && actionPlan.now)
    step1DescEl.textContent = actionPlan.now.desc;
  if (step2TitleEl && actionPlan.thisWeek)
    step2TitleEl.textContent = actionPlan.thisWeek.title;
  if (step2DescEl && actionPlan.thisWeek)
    step2DescEl.textContent = actionPlan.thisWeek.desc;
  if (step3TitleEl && actionPlan.longTerm)
    step3TitleEl.textContent = actionPlan.longTerm.title;
  if (step3DescEl && actionPlan.longTerm)
    step3DescEl.textContent = actionPlan.longTerm.desc;

  const activeStepsCard = document.getElementById(
    "drawerActiveMissionStepsSection",
  );
  const activeStep1Title = document.getElementById("activeStep1Title");
  const activeStep1Desc = document.getElementById("activeStep1Desc");
  const activeStep2Title = document.getElementById("activeStep2Title");
  const activeStep2Desc = document.getElementById("activeStep2Desc");
  const activeStep3Title = document.getElementById("activeStep3Title");
  const activeStep3Desc = document.getElementById("activeStep3Desc");

  if (activeStepsCard) {
    if (
      isUserActiveMission ||
      (activeCitizenMission && activeCitizenMission.isJoined)
    ) {
      if (activeStep1Title && actionPlan.now)
        activeStep1Title.textContent = actionPlan.now.title;
      if (activeStep1Desc && actionPlan.now)
        activeStep1Desc.textContent = actionPlan.now.desc;
      if (activeStep2Title && actionPlan.thisWeek)
        activeStep2Title.textContent = actionPlan.thisWeek.title;
      if (activeStep2Desc && actionPlan.thisWeek)
        activeStep2Desc.textContent = actionPlan.thisWeek.desc;
      if (activeStep3Title && actionPlan.longTerm)
        activeStep3Title.textContent = actionPlan.longTerm.title;
      if (activeStep3Desc && actionPlan.longTerm)
        activeStep3Desc.textContent = actionPlan.longTerm.desc;
      activeStepsCard.classList.remove("hidden");
    } else {
      activeStepsCard.classList.add("hidden");
    }
  }

  if (!isUserActiveMission) {
    selectedMissionFriends = [];
    renderSelectedMissionFriendsChips();
  }

  const missionTitleEl = document.getElementById("missionActionTitle");
  const missionTreeEl = document.getElementById("missionTreeName");
  const missionTargetEl = document.getElementById("missionCoolingTarget");
  const takeBtn = document.getElementById("takeMissionBtn");
  const takeLabel = document.getElementById("takeMissionBtnLabel");

  if (missionTitleEl) missionTitleEl.textContent = `Aksi Tanam: ${zone.name}`;
  if (missionTreeEl && tree) missionTreeEl.textContent = tree.name;
  if (missionTargetEl) {
    const rawDrop =
      zone.simulationImpact && zone.simulationImpact.tempReduction
        ? zone.simulationImpact.tempReduction.replace("-", "")
        : "4.0°C";
    missionTargetEl.textContent = `Turunkan Suhu s.d ${rawDrop}`;
  }
  if (takeLabel && takeBtn) {
    if (isUserActiveMission) {
      takeBtn.classList.add("is-active-mission");
      if (isMissionExpired) {
        takeLabel.textContent = "Misi Hangus (Atur Ulang)";
      } else {
        const formattedDate =
          typeof TEDUH_DATA !== "undefined" && TEDUH_DATA.formatDateIndo
            ? TEDUH_DATA.formatDateIndo(userActiveMissionDate)
            : userActiveMissionDate;
        takeLabel.textContent = formattedDate
          ? `Misi Berjalan (${formattedDate})`
          : "Misi Sedang Berjalan";
      }
    } else {
      takeBtn.classList.remove("is-active-mission");
      takeLabel.textContent = "Ambil Misi Tanam";
    }
  }

  renderDrawerVolunteers(activeCitizenMission);

  const myCollabSection = document.getElementById("drawerMyCollabSection");
  const myCollabList = document.getElementById("drawerMyCollabList");
  const myCollabBadge = document.getElementById("drawerMyCollabCountBadge");
  if (myCollabSection && myCollabList) {
    if (
      isUserActiveMission &&
      activeMissionObj &&
      activeMissionObj.collaborators &&
      activeMissionObj.collaborators.length > 0
    ) {
      myCollabSection.classList.remove("hidden");
      if (myCollabBadge)
        myCollabBadge.textContent = `${activeMissionObj.collaborators.length} Warga`;
      myCollabList.innerHTML = activeMissionObj.collaborators
        .map((c) => {
          const friendObj =
            typeof TEDUH_DATA !== "undefined" && TEDUH_DATA.friendsDirectory
              ? TEDUH_DATA.friendsDirectory.find(
                  (f) => f.name === c.name || f.username === c.username,
                )
              : null;
          const avatarImgSrc =
            c.avatarImg ||
            (friendObj
              ? friendObj.avatarImg
              : "../assets/avatars/dewi-lestari.jpg");
          return `
          <div class="drawer-volunteer-item">
            <div class="drawer-volunteer-avatar"><img src="${avatarImgSrc}" alt="${escapeHtml(c.name)}" class="w-full h-full object-cover rounded-full" onerror="this.src='../assets/avatars/dewi-lestari.jpg'"></div>
            <div class="drawer-volunteer-info">
              <span class="drawer-volunteer-name">${escapeHtml(c.name)}</span>
            </div>
          </div>
        `;
        })
        .join("");
    } else {
      myCollabSection.classList.add("hidden");
      myCollabList.innerHTML = "";
    }
  }

  const userActiveActionsWrap = document.getElementById(
    "drawerUserActiveMissionActions",
  );
  const btnActiveGoCommunity = document.getElementById(
    "btnDrawerActiveGoCommunity",
  );
  const btnActiveRescheduleLabel = document.getElementById(
    "btnDrawerRescheduleLabel",
  );
  const btnJoinDrawer = document.getElementById("btnJoinCitizenMissionDrawer");
  const btnJoinDrawerLabel = document.getElementById(
    "btnJoinCitizenMissionDrawerLabel",
  );
  const joinedActionsWrap = document.getElementById(
    "drawerCitizenJoinedActions",
  );
  const btnCitizenGoComm = document.getElementById(
    "btnCitizenJoinedGoCommunity",
  );
  const btnViewZoneActions = document.getElementById("btnViewZoneActions");

  if (isUserActiveMission) {
    if (userActiveActionsWrap) userActiveActionsWrap.classList.remove("hidden");
    if (btnActiveGoCommunity) {
      const encodedZone = encodeURIComponent(zone.name);
      const encodedTree = encodeURIComponent(
        tree ? tree.name : "Pohon Tanjung",
      );
      btnActiveGoCommunity.href = `community.html?action=complete-mission&zone=${encodedZone}&tree=${encodedTree}`;
    }
    if (btnActiveRescheduleLabel) {
      btnActiveRescheduleLabel.textContent = isMissionExpired
        ? "Atur Ulang Jadwal (Misi Hangus)"
        : "Atur Ulang Jadwal";
    }
    if (btnJoinDrawer) btnJoinDrawer.classList.add("hidden");
    if (joinedActionsWrap) joinedActionsWrap.classList.add("hidden");
    if (btnViewZoneActions) btnViewZoneActions.classList.add("hidden");
  } else if (activeCitizenMission) {
    if (userActiveActionsWrap) userActiveActionsWrap.classList.add("hidden");
    if (btnViewZoneActions) btnViewZoneActions.classList.add("hidden");
    const isJoined = activeCitizenMission.isJoined;
    if (isJoined) {
      if (btnJoinDrawer) btnJoinDrawer.classList.add("hidden");
      if (joinedActionsWrap) joinedActionsWrap.classList.remove("hidden");
      if (btnCitizenGoComm) {
        const encodedZone = encodeURIComponent(
          activeCitizenMission.location || zone.name,
        );
        const encodedTree = encodeURIComponent(
          activeCitizenMission.treeName ||
            (tree ? tree.name : "Pohon Tabebuya"),
        );
        btnCitizenGoComm.href = `community.html?action=complete-mission&zone=${encodedZone}&tree=${encodedTree}`;
      }
    } else {
      if (btnJoinDrawer) {
        btnJoinDrawer.classList.remove("hidden");
        const safeId = escapeHtml(activeCitizenMission.id).replace(/'/g, "\\'");
        btnJoinDrawer.setAttribute(
          "onclick",
          `promptJoinCitizenMission('${safeId}')`,
        );
        if (btnJoinDrawerLabel)
          btnJoinDrawerLabel.textContent = "Ikut Tanam Bersama (+100 Poin)";
      }
      if (joinedActionsWrap) joinedActionsWrap.classList.add("hidden");
    }
  } else {
    if (userActiveActionsWrap) userActiveActionsWrap.classList.add("hidden");
    if (btnJoinDrawer) btnJoinDrawer.classList.add("hidden");
    if (joinedActionsWrap) joinedActionsWrap.classList.add("hidden");
    if (btnViewZoneActions) btnViewZoneActions.classList.remove("hidden");
  }
}

function renderDrawerVolunteers(mission) {
  const section = document.getElementById("drawerVolunteersSection");
  const listEl = document.getElementById("drawerVolunteersList");
  const countBadge = document.getElementById("drawerVolunteersCountBadge");

  if (!section || !listEl) return;

  if (mission && mission.volunteers && mission.volunteers.length > 0) {
    section.classList.remove("hidden");
    if (countBadge) {
      countBadge.textContent = `${mission.currentVolunteers} Warga`;
    }

    const html = mission.volunteers
      .map((v) => {
        const friendObj =
          typeof TEDUH_DATA !== "undefined" && TEDUH_DATA.friendsDirectory
            ? TEDUH_DATA.friendsDirectory.find((f) => f.name === v.name)
            : null;
        const avatarImgSrc =
          v.avatarImg ||
          (friendObj
            ? friendObj.avatarImg
            : v.isSelf
              ? "../assets/avatars/john-doe.jpg"
              : "../assets/avatars/dewi-lestari.jpg");
        const nameText = escapeHtml(v.name || "Warga");
        const isSelfClass = v.isSelf ? "is-self" : "";

        return `
        <div class="drawer-volunteer-item ${isSelfClass}">
          <div class="drawer-volunteer-avatar"><img src="${avatarImgSrc}" alt="${nameText}" class="w-full h-full object-cover rounded-full" onerror="this.src='../assets/avatars/dewi-lestari.jpg'"></div>
          <div class="drawer-volunteer-info">
            <span class="drawer-volunteer-name">${nameText}</span>
          </div>
        </div>
      `;
      })
      .join("");

    listEl.innerHTML = html;
  } else {
    section.classList.add("hidden");
    listEl.innerHTML = "";
  }
}

function renderDonutChartAndLegend(zone) {
  const segmentsGroup = document.getElementById("donutSegmentsGroup");
  const legendList = document.getElementById("donutLegendList");
  const centerScore = document.getElementById("donutCenterScore");
  const centerLabel = document.getElementById("donutCenterLabel");

  const factors = zone.primaryFactors || [
    { label: "Minimnya Pohon Peneduh", percentage: 40, color: "#1A382B" },
    { label: "Polusi Kendaraan Bermotor", percentage: 30, color: "#0E1116" },
    { label: "Padatnya Bangunan", percentage: 20, color: "#64748B" },
    { label: "Asap Pembakaran Sampah", percentage: 10, color: "#BA4E2A" },
  ];
  const dominant = zone.dominantFactor || {
    percentage: 40,
    label: "Minim Pohon",
  };

  if (centerScore) centerScore.textContent = `${dominant.percentage}%`;
  if (centerLabel) centerLabel.textContent = dominant.label;

  if (segmentsGroup && legendList) {
    let currentOffset = 0;
    let circlesHtml = "";
    let legendHtml = "";

    factors.forEach((factor, idx) => {
      const dashArray = `${factor.percentage} ${100 - factor.percentage}`;
      const dashOffset = -currentOffset;
      circlesHtml += `<circle id="donutCircle${idx}" cx="21" cy="21" r="15.91549430918954" fill="none" stroke="${factor.color}" stroke-width="3.6" stroke-dasharray="${dashArray}" stroke-dashoffset="${dashOffset}" style="cursor: pointer;" onclick="focusDonutFactor(${idx})"></circle>`;
      currentOffset += factor.percentage;

      legendHtml += `
        <div class="legend-item" id="legendItem${idx}" onclick="focusDonutFactor(${idx})" role="button" tabindex="0" aria-label="Lihat faktor ${factor.label}">
          <div class="legend-left">
            <span class="legend-dot" style="background: ${factor.color};"></span>
            <span>${factor.label}</span>
          </div>
          <span class="legend-val">${factor.percentage}%</span>
        </div>
      `;
    });

    segmentsGroup.innerHTML = circlesHtml;
    legendList.innerHTML = legendHtml;
  }
}

function focusDonutFactor(idx) {
  if (!activeZone) return;
  const factors = activeZone.primaryFactors || [
    { label: "Minimnya Pohon Peneduh", percentage: 40, color: "#1A382B" },
    { label: "Polusi Kendaraan Bermotor", percentage: 30, color: "#0E1116" },
    { label: "Padatnya Bangunan", percentage: 20, color: "#64748B" },
    { label: "Asap Pembakaran Sampah", percentage: 10, color: "#BA4E2A" },
  ];

  if (activeFactorIndex === idx) {
    activeFactorIndex = null;
    const dominant = activeZone.dominantFactor || {
      percentage: 40,
      label: "Minim Pohon",
    };
    const centerScore = document.getElementById("donutCenterScore");
    const centerLabel = document.getElementById("donutCenterLabel");

    if (centerScore) {
      const targetVal = dominant.percentage;
      let cur = parseInt(centerScore.textContent) || targetVal;
      const step = () => {
        cur += (targetVal - cur) * 0.2;
        if (Math.abs(targetVal - cur) < 0.5) {
          centerScore.textContent = `${targetVal}%`;
        } else {
          centerScore.textContent = `${Math.round(cur)}%`;
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);

      centerScore.style.transform = "scale(1.12)";
      centerScore.style.transition = "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)";
      setTimeout(() => {
        centerScore.style.transform = "scale(1)";
      }, 250);
    }
    if (centerLabel) centerLabel.textContent = dominant.label;

    document
      .querySelectorAll(".legend-item")
      .forEach((el) => el.classList.remove("is-active"));
    document.querySelectorAll("#donutSegmentsGroup circle").forEach((c) => {
      c.setAttribute("stroke-width", "3.6");
      c.style.opacity = "1";
    });

    const diagEl = document.getElementById("zoneDiagnosisText");
    if (diagEl) {
      diagEl.textContent = activeZone.problemDiagnosis;
      diagEl.style.opacity = "0.4";
      diagEl.style.transform = "translateY(4px)";
      diagEl.style.transition = "opacity 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)";
      requestAnimationFrame(() => {
        diagEl.style.opacity = "1";
        diagEl.style.transform = "translateY(0)";
      });
    }
    const diagBadge = document.getElementById("narrativeFactorBadge");
    if (diagBadge) diagBadge.classList.add("hidden");
    const diagTitle = document.getElementById("narrativeTitleLabel");
    if (diagTitle) diagTitle.textContent = "Dampak ke Pemukiman:";
    return;
  }

  activeFactorIndex = idx;
  const factor = factors[idx];
  if (!factor) return;

  const centerScore = document.getElementById("donutCenterScore");
  const centerLabel = document.getElementById("donutCenterLabel");

  if (centerScore) {
    const targetVal = factor.percentage;
    let cur = parseInt(centerScore.textContent) || 0;
    const step = () => {
      cur += (targetVal - cur) * 0.2;
      if (Math.abs(targetVal - cur) < 0.5) {
        centerScore.textContent = `${targetVal}%`;
      } else {
        centerScore.textContent = `${Math.round(cur)}%`;
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);

    centerScore.style.transform = "scale(1.2)";
    centerScore.style.transition = "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)";
    setTimeout(() => {
      centerScore.style.transform = "scale(1)";
    }, 250);
  }

  if (centerLabel) {
    centerLabel.textContent =
      factor.label.length > 14
        ? factor.label.slice(0, 14) + "..."
        : factor.label;
    centerLabel.style.opacity = "0.5";
    centerLabel.style.transform = "translateY(-2px)";
    centerLabel.style.transition = "opacity 0.25s ease, transform 0.25s ease";
    requestAnimationFrame(() => {
      centerLabel.style.opacity = "1";
      centerLabel.style.transform = "translateY(0)";
    });
  }

  document.querySelectorAll(".legend-item").forEach((el, i) => {
    const isActive = i === idx;
    el.classList.toggle("is-active", isActive);
    if (isActive) {
      el.style.transform = "scale(0.96)";
      el.style.transition = "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)";
      setTimeout(() => {
        el.style.transform = "scale(1)";
      }, 250);
    }
  });

  document.querySelectorAll("#donutSegmentsGroup circle").forEach((c, i) => {
    if (i === idx) {
      c.setAttribute("stroke-width", "5.2");
      c.style.opacity = "1";
    } else {
      c.setAttribute("stroke-width", "3.2");
      c.style.opacity = "0.45";
    }
  });

  const factorInsights = {
    0: "Minimnya naungan pohon membuat radiasi panas matahari terperangkap pada semen dan aspal, meningkatkan suhu pekarangan hingga di atas batas nyaman warga.",
    1: "Konsentrasi kendaraan bermotor menyumbang akumulasi panas knalpot dan partikel debu mikro yang memperburuk kenyamanan bernapas di koridor ini.",
    2: "Kerapatan bangunan dan dinding beton membatasi pergerakan angin alami, menciptakan efek perangkap panas lokal di siang hari.",
    3: "Sisa asap dan pembakaran sampah sporadis memicu peningkatan indeks polusi serta menurunkan kualitas udara pekarangan sekitar.",
  };

  const diagEl = document.getElementById("zoneDiagnosisText");
  if (diagEl) {
    diagEl.textContent = factorInsights[idx] || activeZone.problemDiagnosis;
    diagEl.style.opacity = "0.4";
    diagEl.style.transform = "translateY(5px)";
    diagEl.style.transition = "opacity 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)";
    requestAnimationFrame(() => {
      diagEl.style.opacity = "1";
      diagEl.style.transform = "translateY(0)";
    });
  }

  const diagBadge = document.getElementById("narrativeFactorBadge");
  if (diagBadge) {
    diagBadge.textContent = `${factor.percentage}% ${factor.label}`;
    diagBadge.classList.remove("hidden");
    diagBadge.style.transform = "scale(0.8)";
    diagBadge.style.opacity = "0";
    diagBadge.style.transition = "opacity 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)";
    requestAnimationFrame(() => {
      diagBadge.style.transform = "scale(1)";
      diagBadge.style.opacity = "1";
    });
  }

  const diagTitle = document.getElementById("narrativeTitleLabel");
  if (diagTitle) diagTitle.textContent = "Diagnosa Faktor Pemicu:";
}

function copyZoneCoords() {
  if (!activeZone) return;
  const coordsText = `${activeZone.lat.toFixed(6)}, ${activeZone.lng.toFixed(6)}`;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(coordsText)
      .then(() => {
        const btn = document.getElementById("copyCoordsBtn");
        const label = document.getElementById("copyCoordsLabel");
        if (btn) btn.classList.add("is-copied");
        if (label) label.textContent = "Tersalin!";
        showToast(`Koordinat kawasan (${coordsText}) berhasil disalin.`);

        setTimeout(() => {
          if (btn) btn.classList.remove("is-copied");
          if (label) label.textContent = "Salin";
        }, 2000);
      })
      .catch(() => {
        showToast(`Koordinat: ${coordsText}`);
      });
  } else {
    showToast(`Koordinat: ${coordsText}`);
  }
}

function switchDrawerStage(stageNum, animate = true) {
  currentDrawerStage = stageNum;
  const stageAnalysis = document.getElementById("drawerStageAnalysis");
  const stageActions = document.getElementById("drawerStageActions");
  const tab1 = document.getElementById("tabStage1");
  const tab2 = document.getElementById("tabStage2");

  if (stageNum === 2) {
    if (stageAnalysis) stageAnalysis.classList.add("hidden");
    if (stageActions) stageActions.classList.remove("hidden");
    if (tab1) {
      tab1.classList.remove("is-active");
      tab1.setAttribute("aria-selected", "false");
    }
    if (tab2) {
      tab2.classList.add("is-active");
      tab2.setAttribute("aria-selected", "true");
    }

    const drawerBody = document.querySelector(".drawer-body");
    if (drawerBody) drawerBody.scrollTop = 0;

    if (animate) {
      $("#drawerStageActions .volunteer-hero-card, #drawerStageActions .planting-steps-card, #drawerStageActions .volunteer-collab-card, #drawerStageActions .drawer-actions-group")
        .css({ opacity: 0, transform: "translateY(12px)" })
        .each(function (i) {
          const el = this;
          setTimeout(() => {
            $(el).css({
              opacity: 1,
              transform: "translateY(0)",
              transition: "opacity 0.35s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
            });
          }, i * 60);
        });
    }

    if (activeZone) {
      renderNearbyFriendsForZone(activeZone);
      showNearbyFriendsNotice();

      if (activeMissionCircle) {
        mapInstance.removeLayer(activeMissionCircle);
      }
      activeMissionCircle = L.circle([activeZone.lat, activeZone.lng], {
        color: "#1A382B",
        fillColor: "#1A382B",
        fillOpacity: 0.18,
        dashArray: "4, 4",
        radius: activeTreeSimCount === 2 ? 65 : 40,
        weight: 1.8,
      }).addTo(mapInstance);
    }
  } else {
    if (stageAnalysis) stageAnalysis.classList.remove("hidden");
    if (stageActions) stageActions.classList.add("hidden");
    if (tab1) {
      tab1.classList.add("is-active");
      tab1.setAttribute("aria-selected", "true");
    }
    if (tab2) {
      tab2.classList.remove("is-active");
      tab2.setAttribute("aria-selected", "false");
    }

    const drawerBody = document.querySelector(".drawer-body");
    if (drawerBody) drawerBody.scrollTop = 0;

    if (animate) {
      $("#drawerStageAnalysis .drawer-analysis-card, #drawerStageAnalysis .drawer-tree-card, #drawerStageAnalysis .drawer-actions-group")
        .css({ opacity: 0, transform: "translateY(10px)" })
        .each(function (i) {
          const el = this;
          setTimeout(() => {
            $(el).css({
              opacity: 1,
              transform: "translateY(0)",
              transition: "opacity 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            });
          }, i * 50);
        });
    }

    dismissNearbyFriendsNotice();

    clearCommunityFriends();
    if (activeMissionCircle) {
      mapInstance.removeLayer(activeMissionCircle);
      activeMissionCircle = null;
    }
  }
}

function handlePopupMissionAction() {
  if (!activeZone) return;
  openDrawer();
  switchDrawerStage(2);
  if (mapInstance) {
    mapInstance.closePopup();
  }
}

function showZoneActions() {
  switchDrawerStage(2);
}

function backToAnalysis() {
  switchDrawerStage(1);
}

function setTreeSimulationCount(count) {
  activeTreeSimCount = count;
  updateTreeSimUI();
}

function updateTreeSimUI() {
  if (!activeZone) return;

  const sim = activeZone.simulationImpact || {
    tempReduction: "-4.3°C",
    newSurfaceTemp: "34.5°C",
    newCanopy: "25%",
    coolingScore: "86/100",
    summary:
      "Beban panas dinding berkurang drastis, hemat konsumsi listrik AC s.d 28%.",
  };

  const btn1 = document.getElementById("simBtn1Tree");
  const btn2 = document.getElementById("simBtn2Tree");
  if (btn1) btn1.classList.toggle("is-active", activeTreeSimCount === 1);
  if (btn2) btn2.classList.toggle("is-active", activeTreeSimCount === 2);

  const currTempEl = document.getElementById("impactCurrentTemp");
  const targetTempEl = document.getElementById("impactTargetTemp");
  const dropPillEl = document.getElementById("impactTempDrop");
  const currCanopyEl = document.getElementById("impactCurrentCanopy");
  const targetCanopyEl = document.getElementById("impactTargetCanopy");
  const gainPillEl = document.getElementById("impactCanopyGain");
  const impactScoreEl = document.getElementById("impactScore");
  const impactSummaryEl = document.getElementById("impactSummaryText");

  if (currTempEl) currTempEl.textContent = activeZone.surfaceTemp || "38.8°C";

  if (activeTreeSimCount === 1) {
    if (targetTempEl) targetTempEl.textContent = sim.newSurfaceTemp || "34.5°C";
    if (dropPillEl) {
      const rawDrop = sim.tempReduction
        ? sim.tempReduction.replace("-", "")
        : "4.3°C";
      dropPillEl.textContent = `Turun ${rawDrop}`;
    }
    if (currCanopyEl) currCanopyEl.textContent = activeZone.canopyCover || "5%";
    if (targetCanopyEl) targetCanopyEl.textContent = sim.newCanopy || "25%";
    if (gainPillEl) {
      const currCanopyVal = parseInt(activeZone.canopyCover) || 5;
      const targetCanopyVal = parseInt(sim.newCanopy) || 25;
      gainPillEl.textContent = `+${Math.max(1, targetCanopyVal - currCanopyVal)}% Rimbun`;
    }
    if (impactScoreEl)
      impactScoreEl.textContent = `${sim.coolingScore || "86/100"} Sejuk`;
    if (impactSummaryEl)
      impactSummaryEl.textContent =
        sim.summary ||
        "Beban panas dinding berkurang, hemat konsumsi listrik AC s.d 28%.";

    if (activeMissionCircle && mapInstance) {
      activeMissionCircle.setRadius(40);
    }
  } else {
    const currTempNum = parseFloat(activeZone.surfaceTemp) || 38.8;
    const enhancedTarget = (currTempNum - 6.5).toFixed(1) + "°C";
    if (targetTempEl) targetTempEl.textContent = enhancedTarget;
    if (dropPillEl) dropPillEl.textContent = "Turun 6.5°C";
    if (currCanopyEl) currCanopyEl.textContent = activeZone.canopyCover || "5%";
    if (targetCanopyEl) targetCanopyEl.textContent = "45%";
    if (gainPillEl) {
      const currCanopyVal = parseInt(activeZone.canopyCover) || 5;
      gainPillEl.textContent = `+${Math.max(1, 45 - currCanopyVal)}% Rimbun`;
    }
    if (impactScoreEl) impactScoreEl.textContent = "94/100 Sejuk Maksimal";
    if (impactSummaryEl)
      impactSummaryEl.textContent =
        "Kombinasi 2 kanopi peneduh memotong radiasi panas hingga 6.5°C dan menciptakan mikroklimat pemukiman yang sejuk.";

    if (activeMissionCircle && mapInstance) {
      activeMissionCircle.setRadius(65);
    }
  }
}

function toggleActionStep(stepNum) {
  if (completedActionSteps.has(stepNum)) {
    completedActionSteps.delete(stepNum);
  } else {
    completedActionSteps.add(stepNum);
  }
  updateActionChecklistUI();
}

function updateActionChecklistUI() {
  for (let i = 1; i <= 3; i++) {
    const node = document.getElementById(`actionNode${i}`);
    const check = document.getElementById(`actionCheckBox${i}`);
    const isDone = completedActionSteps.has(i);

    if (node) node.classList.toggle("is-completed", isDone);
    if (check) check.classList.toggle("is-checked", isDone);
  }

  const badge = document.getElementById("actionProgressBadge");
  if (badge) {
    const count = completedActionSteps.size;
    if (count === 3) {
      badge.textContent = "3/3 Lengkap!";
      badge.style.background = "#1A382B";
      badge.style.color = "#FFFFFF";
    } else {
      badge.textContent = `${count}/3 Selesai`;
      badge.style.background = "#E8EFEA";
      badge.style.color = "#1A382B";
    }
  }
}

function toggleDrawerMobile() {
  const drawer = document.getElementById("spatialDrawer");
  if (!drawer) return;
  if (!drawer.classList.contains("is-open")) {
    openDrawer();
  } else if (drawer.classList.contains("is-expanded")) {
    drawer.classList.remove("is-expanded");
  } else {
    drawer.classList.add("is-expanded");
  }
}

function openMissionConfirmModal() {
  if (!activeZone) return;
  const modal = document.getElementById("missionConfirmModal");
  const modalTitleEl = document.getElementById("modalConfirmTitle");
  const modalDescEl = modal ? modal.querySelector(".mission-modal-desc") : null;
  const zoneNameEl = document.getElementById("modalConfirmZoneName");
  const treeNameEl = document.getElementById("modalConfirmTreeName");
  const friendsCountEl = document.getElementById("modalConfirmFriendsCount");
  const dateInput = document.getElementById("missionConfirmDateInput");
  const submitBtnLabel = document.getElementById("modalConfirmSubmitBtnLabel");

  const tree = activeZone.recommendedTree;
  if (zoneNameEl) zoneNameEl.textContent = activeZone.name;
  if (treeNameEl) treeNameEl.textContent = tree ? tree.name : "Pohon Tanjung";

  let existingMission = getUserActiveMissionForZone(activeZone);

  if (existingMission) {
    if (modalTitleEl) modalTitleEl.textContent = "Atur Ulang Jadwal Aksi";
    if (modalDescEl)
      modalDescEl.textContent =
        "Pilih tanggal target penanaman baru untuk pekarangan ini agar status aksi tetap aktif.";
    if (submitBtnLabel) submitBtnLabel.textContent = "Simpan Jadwal Baru";
    if (friendsCountEl) {
      const collabsCount =
        existingMission.collaborators &&
        existingMission.collaborators.length > 0
          ? existingMission.collaborators.length
          : selectedMissionFriends.length;
      friendsCountEl.textContent =
        collabsCount > 0
          ? `${collabsCount} Warga Terpilih`
          : "Tanpa Kolaborator";
    }
  } else {
    if (modalTitleEl) modalTitleEl.textContent = "Ambil Misi Tanam";
    if (modalDescEl)
      modalDescEl.textContent =
        "Tentukan jadwal aksi tanam bibit peneduh. Unggah bukti foto aksi sebelum tanggal ini berakhir agar misi tidak hangus.";
    if (submitBtnLabel)
      submitBtnLabel.textContent = "Konfirmasi Jadwal & Ambil Misi";
    if (friendsCountEl) {
      const count = selectedMissionFriends.length;
      friendsCountEl.textContent =
        count > 0 ? `${count} Warga Terpilih` : "Tanpa Kolaborator";
    }
  }

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const minDateStr = `${yyyy}-${mm}-${dd}`;

  if (dateInput) {
    dateInput.min = minDateStr;
    if (
      existingMission &&
      existingMission.scheduledDate &&
      existingMission.scheduledDate >= minDateStr
    ) {
      dateInput.value = existingMission.scheduledDate;
    } else {
      const defaultDate = new Date(today);
      defaultDate.setDate(defaultDate.getDate() + 2);
      const tmY = defaultDate.getFullYear();
      const tmM = String(defaultDate.getMonth() + 1).padStart(2, "0");
      const tmD = String(defaultDate.getDate()).padStart(2, "0");
      dateInput.value = `${tmY}-${tmM}-${tmD}`;
    }
  }

  if (modal) {
    modal.classList.remove("hidden");
    void modal.offsetWidth;
    modal.classList.add("is-open");

    const modalCard = modal.querySelector(".mission-modal-card");
    if (modalCard) {
      modalCard.style.transform = "scale(0.92) translateY(14px)";
      modalCard.style.opacity = "0";
      modalCard.style.transition = "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease";
      requestAnimationFrame(() => {
        modalCard.style.transform = "scale(1) translateY(0)";
        modalCard.style.opacity = "1";
      });
    }
  }
}

function closeMissionConfirmModal() {
  const modal = document.getElementById("missionConfirmModal");
  if (modal) {
    const modalCard = modal.querySelector(".mission-modal-card");
    if (modalCard) {
      modalCard.style.transform = "scale(0.93) translateY(10px)";
      modalCard.style.opacity = "0";
      modalCard.style.transition = "transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease";
      setTimeout(() => {
        modal.classList.remove("is-open");
        modal.classList.add("hidden");
        modalCard.style.transform = "";
        modalCard.style.opacity = "";
        modalCard.style.transition = "";
      }, 220);
    } else {
      modal.classList.remove("is-open");
      modal.classList.add("hidden");
    }
  }
}

function confirmTakeZoneMission() {
  const dateInput = document.getElementById("missionConfirmDateInput");
  const selectedDate =
    dateInput && dateInput.value
      ? dateInput.value
      : new Date().toISOString().split("T")[0];

  closeMissionConfirmModal();
  takeZoneMission(selectedDate);
}

function takeZoneMission(scheduledDate) {
  if (!activeZone) return;

  const validDate = scheduledDate || new Date().toISOString().split("T")[0];

  if (activeMissionCircle) {
    mapInstance.removeLayer(activeMissionCircle);
  }

  activeMissionCircle = L.circle([activeZone.lat, activeZone.lng], {
    color: "#5c8437",
    fillColor: "#5c8437",
    fillOpacity: 0.22,
    dashArray: "5, 5",
    radius: 30, // 30 meter radius zona penanaman aman
    weight: 2,
  }).addTo(mapInstance);

  const encodedZone = encodeURIComponent(activeZone.name);
  const tree = activeZone.recommendedTree;
  const encodedTree = encodeURIComponent(tree ? tree.name : "Pohon Tanjung");
  const communityUrl = `community.html?action=complete-mission&zone=${encodedZone}&tree=${encodedTree}`;

  const formattedDate =
    typeof TEDUH_DATA !== "undefined" && TEDUH_DATA.formatDateIndo
      ? TEDUH_DATA.formatDateIndo(validDate)
      : validDate;

  let isReschedule = false;
  let existingCollabs = [];
  const existingActiveMission = getUserActiveMissionForZone(activeZone);
  if (existingActiveMission) {
    isReschedule = true;
    existingCollabs = existingActiveMission.collaborators || [];
  }

  if (typeof localStorage !== "undefined") {
    const collabs =
      selectedMissionFriends.length > 0
        ? selectedMissionFriends.map((f) => ({
            id: f.id,
            name: f.name,
            avatar: f.avatar || f.name.slice(0, 2).toUpperCase(),
          }))
        : existingCollabs;

    localStorage.setItem(
      "teduh_active_mission",
      JSON.stringify({
        id: "mission-" + Date.now(),
        zoneId: activeZone.id,
        zoneName: activeZone.name,
        district: activeZone.district || "Denpasar",
        lat: activeZone.lat,
        lng: activeZone.lng,
        treeName: tree ? tree.name : "Pohon Tanjung",
        scheduledDate: validDate,
        collaborators: collabs,
        isCompleted: false,
        takenAt: Date.now(),
      }),
    );
  }

  renderUserActiveMissionPin();

  populateDrawer(activeZone);

  if (isReschedule) {
    showToast(`Jadwal aksi tanam berhasil diatur ke ${formattedDate}`);
  } else {
    const modal = document.getElementById("missionSuccessModal");
    const modalZoneEl = document.getElementById("modalSuccessZoneName");
    const modalTreeEl = document.getElementById("modalSuccessTreeName");
    const modalScheduleEl = document.getElementById("modalSuccessScheduleDate");
    const modalBtn = document.getElementById("modalGoToCommunityBtn");

    if (modalZoneEl) modalZoneEl.textContent = activeZone.name;
    if (modalTreeEl && tree) modalTreeEl.textContent = tree.name;
    if (modalScheduleEl) modalScheduleEl.textContent = formattedDate;
    if (modalBtn) modalBtn.href = communityUrl;

    if (modal) {
      modal.classList.remove("hidden");
      void modal.offsetWidth;
      modal.classList.add("is-open");

      const modalCard = modal.querySelector(".mission-modal-card");
      if (modalCard) {
        modalCard.style.transform = "scale(0.9) translateY(16px)";
        modalCard.style.opacity = "0";
        modalCard.style.transition = "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease";
        requestAnimationFrame(() => {
          modalCard.style.transform = "scale(1) translateY(0)";
          modalCard.style.opacity = "1";
        });
      }
    }
  }
}

function closeMissionSuccessModal() {
  const modal = document.getElementById("missionSuccessModal");
  if (modal) {
    const modalCard = modal.querySelector(".mission-modal-card");
    if (modalCard) {
      modalCard.style.transform = "scale(0.92) translateY(10px)";
      modalCard.style.opacity = "0";
      modalCard.style.transition = "transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease";
      setTimeout(() => {
        modal.classList.remove("is-open");
        modal.classList.add("hidden");
        modalCard.style.transform = "";
        modalCard.style.opacity = "";
        modalCard.style.transition = "";
      }, 220);
    } else {
      modal.classList.remove("is-open");
      modal.classList.add("hidden");
    }
  }

  if (activeZone) {
    populateDrawer(activeZone);
    openDrawer();
    if (userActiveMissionMarker) {
      userActiveMissionMarker.openPopup();
    }
  } else {
    selectUserActiveMission();
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const joinConfirmModal = document.getElementById(
      "joinCitizenMissionConfirmModal",
    );
    if (joinConfirmModal && !joinConfirmModal.classList.contains("hidden")) {
      closeJoinConfirmModal();
      return;
    }
    const confirmModal = document.getElementById("missionConfirmModal");
    if (confirmModal && !confirmModal.classList.contains("hidden")) {
      closeMissionConfirmModal();
      return;
    }
    const successModal = document.getElementById("missionSuccessModal");
    if (successModal && !successModal.classList.contains("hidden")) {
      closeMissionSuccessModal();
      return;
    }
    const friendsModal = document.getElementById("friendsPickerModal");
    if (friendsModal && !friendsModal.classList.contains("hidden")) {
      closeFriendsPickerModal();
      return;
    }
  }
});

function renderPollutionLayers() {
  macroThermalLayers.forEach((layer) => mapInstance.removeLayer(layer));
  macroHitAreas.forEach((layer) => mapInstance.removeLayer(layer));
  pollutionPolygonLayers.forEach((layer) => mapInstance.removeLayer(layer));

  macroThermalLayers = [];
  macroHitAreas = [];
  pollutionPolygonLayers = [];

  if (typeof TEDUH_DATA === "undefined" || !TEDUH_DATA.pollutionZones) return;

  TEDUH_DATA.pollutionZones.forEach((pZone) => {
    if (pZone.thermalNodes && pZone.thermalNodes.length > 0) {
      pZone.thermalNodes.forEach((node) => {
        const outerAura = L.circle([node.lat, node.lng], {
          radius: node.radius * 1.45,
          stroke: false,
          fillColor: "#FFAE00",
          fillOpacity: 0.14,
          interactive: false,
          className: "thermal-heat-outer",
        }).addTo(mapInstance);
        outerAura._baseOpacity = 0.14;
        macroThermalLayers.push(outerAura);
        pollutionPolygonLayers.push(outerAura);

        const midAura = L.circle([node.lat, node.lng], {
          radius: node.radius * 0.9,
          stroke: false,
          fillColor: "#BA4E2A",
          fillOpacity: 0.24,
          interactive: false,
          className: "thermal-heat-mid",
        }).addTo(mapInstance);
        midAura._baseOpacity = 0.24;
        macroThermalLayers.push(midAura);
        pollutionPolygonLayers.push(midAura);

        const coreNode = L.circle([node.lat, node.lng], {
          radius: node.radius * 0.45,
          stroke: false,
          fillColor: "#BA4E2A",
          fillOpacity: 0.35,
          interactive: false,
          className: "thermal-heat-core",
        }).addTo(mapInstance);
        coreNode._baseOpacity = 0.35;
        macroThermalLayers.push(coreNode);
        pollutionPolygonLayers.push(coreNode);
      });
    }

    const hitArea = L.polygon(pZone.coordinates, {
      stroke: false,
      weight: 0,
      fillColor: "#BA4E2A",
      fillOpacity: 0.001,
      interactive: true,
      className: "thermal-click-target",
    }).addTo(mapInstance);

    hitArea.on("click", (e) => {
      L.DomEvent.stopPropagation(e);
      if (currentDrawerStage === 2 && activeZone) {
        dismissNearbyFriendsNotice();
        if (mapInstance) mapInstance.closePopup();
        return;
      }
      const targetZone = TEDUH_DATA.zones.find((z) => z.id === pZone.zoneId);
      if (targetZone) {
        const isMobile = window.innerWidth <= 860;
        selectZone(targetZone, false, null, !isMobile);
      }
    });

    macroHitAreas.push(hitArea);
    pollutionPolygonLayers.push(hitArea);
  });

  updateThermalZoomState();
}

function updateThermalZoomState() {
  if (!mapInstance) return;
  const zoom = mapInstance.getZoom();

  let macroOpacityMult = 1.0;

  if (zoom <= 14.0) {
    macroOpacityMult = 1.0;
  } else if (zoom >= 16.0) {
    macroOpacityMult = 0.25;
  } else {
    const t = (zoom - 14.0) / 2.0;
    const smoothT = t * t * (3 - 2 * t);
    macroOpacityMult = 1.0 - smoothT * 0.75;
  }

  macroThermalLayers.forEach((layer) => {
    const base = layer._baseOpacity || 0.2;
    layer.setStyle({ fillOpacity: base * macroOpacityMult });
  });

  macroHitAreas.forEach((layer) => {
    const pathEl = layer._path;
    if (pathEl) {
      if (macroOpacityMult < 0.4) {
        pathEl.style.display = "none";
        pathEl.style.pointerEvents = "none";
      } else {
        pathEl.style.display = "";
        pathEl.style.pointerEvents = "auto";
      }
    }
  });
}

function clearCommunityFriends() {
  friendMarkers.forEach((m) => mapInstance.removeLayer(m));
  friendMarkers = [];
}

function renderNearbyFriendsForZone(zone) {
  clearCommunityFriends();

  if (
    !zone ||
    typeof TEDUH_DATA === "undefined" ||
    !TEDUH_DATA.friendsDirectory
  )
    return;

  const friendsWithDistance = TEDUH_DATA.friendsDirectory
    .filter((f) => f.lat && f.lng)
    .map((f) => {
      const dLat = f.lat - zone.lat;
      const dLng = f.lng - zone.lng;
      const dist = Math.sqrt(dLat * dLat + dLng * dLng);
      return { ...f, dist };
    })
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 3);

  friendsWithDistance.forEach((friend) => {
    const isInvited = selectedMissionFriends.some(
      (f) => f.username === friend.username || f.name === friend.name,
    );

    const avatarImgSrc = friend.avatarImg || "../assets/avatars/dewi-lestari.jpg";

    const iconHtml = `
      <div class="community-map-pin contextual ${isInvited ? "is-invited" : ""}" title="${escapeHtml(friend.name)} • ${escapeHtml(friend.districtLocation)}">
        <div class="community-pin-avatar">
          <img src="${avatarImgSrc}" alt="${escapeHtml(friend.name)}" onerror="this.src='../assets/avatars/dewi-lestari.jpg'">
        </div>
      </div>
    `;

    const customIcon = L.divIcon({
      html: iconHtml,
      className: "community-div-icon",
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -16],
    });

    const marker = L.marker([friend.lat, friend.lng], {
      icon: customIcon,
      riseOnHover: true,
    }).addTo(mapInstance);

    marker.bindTooltip(
      `<strong>${escapeHtml(friend.name)}</strong> • ${escapeHtml(friend.districtLocation)}`,
      {
        direction: "top",
        offset: [0, -14],
        opacity: 0.95,
      },
    );

    const safeName = escapeHtml(friend.name).replace(/'/g, "\\'");
    const safeLoc = escapeHtml(friend.districtLocation).replace(/'/g, "\\'");
    const safeUser = escapeHtml(friend.username).replace(/'/g, "\\'");

    const cleanDistrictLoc = (friend.districtLocation || "Denpasar").replace(
      /,\s*(?:Pulau\s*)?Bali$/i,
      "",
    );

    const popupHtml = `
      <div class="community-friend-popup">
        <div class="friend-popup-header">
          <div class="friend-popup-avatar">
            <img src="${avatarImgSrc}" alt="${escapeHtml(friend.name)}" onerror="this.src='../assets/avatars/dewi-lestari.jpg'">
          </div>
          <div class="friend-popup-info">
            <h4 class="friend-popup-name">${escapeHtml(friend.name)}</h4>
            <div class="friend-popup-location">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>${escapeHtml(cleanDistrictLoc)}</span>
            </div>
          </div>
        </div>
        <button type="button" class="btn-invite-friend-quick ${isInvited ? "is-invited" : ""}" onclick="toggleMissionFriend('${safeName}', '${safeLoc}', '${safeUser}')">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            ${isInvited ? '<polyline points="20 6 9 17 4 12"></polyline>' : '<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>'}
          </svg>
          <span>${isInvited ? "Terpilih" : "Ajak Gotong Royong"}</span>
        </button>
      </div>
    `;

    marker._friendName = friend.name;
    marker._friendUsername = friend.username;
    marker.on("click", function (e) {
      if (e && e.stopPropagation) e.stopPropagation();
      dismissNearbyFriendsNotice();
      if (marker.isPopupOpen && marker.isPopupOpen()) {
        marker.closePopup();
      } else {
        marker.openPopup();
      }
    });

    marker.bindPopup(popupHtml, {
      className: "community-teduh-popup",
      closeButton: false,
      maxWidth: 240,
    });

    friendMarkers.push(marker);
  });
}

function toggleMissionFriend(friendName, location, username = "") {
  const existingIdx = selectedMissionFriends.findIndex(
    (f) => (username && f.username === username) || f.name === friendName,
  );

  if (existingIdx !== -1) {
    selectedMissionFriends.splice(existingIdx, 1);
  } else {
    const friendData =
      typeof TEDUH_DATA !== "undefined" && TEDUH_DATA.friendsDirectory
        ? TEDUH_DATA.friendsDirectory.find(
            (f) => f.username === username || f.name === friendName,
          )
        : null;

    const avatar = friendData
      ? friendData.avatar
      : friendName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase() || "W";
    const avatarImg = friendData
      ? friendData.avatarImg
      : "../assets/avatars/dewi-lestari.jpg";

    selectedMissionFriends.push({
      name: friendName,
      location: location,
      username: username || `@${friendName.toLowerCase().replace(/\s+/g, "_")}`,
      avatar: avatar,
      avatarImg: avatarImg,
    });
  }

  renderSelectedMissionFriendsChips();

  if (activeZone) {
    renderNearbyFriendsForZone(activeZone);

    const targetMarker = friendMarkers.find(
      (m) =>
        m._friendName === friendName ||
        (username && m._friendUsername === username),
    );
    if (targetMarker) {
      targetMarker.openPopup();
    }
  }

  const searchInput = document.getElementById("friendsModalSearchInput");
  filterFriendsModalList(searchInput ? searchInput.value : "");
}

function renderSelectedMissionFriendsChips() {
  const container = document.getElementById("mapCollabChipsList");
  const rewardBadge = document.getElementById("missionRewardBadge");
  const takeLabel = document.getElementById("takeMissionBtnLabel");
  const countBadge = document.getElementById("collabSelectedCountBadge");
  const btnText = document.getElementById("btnOpenFriendsModalText");

  const count = selectedMissionFriends.length;
  const bonus = count * 50;
  const total = 250 + bonus;

  if (rewardBadge) {
    rewardBadge.textContent = `+${total} Poin Kesejukan`;
  }

  if (takeLabel) {
    takeLabel.textContent = "Ambil Misi Tanam";
  }

  if (countBadge) {
    if (count > 0) {
      countBadge.textContent = `${count} Warga Terpilih`;
      countBadge.classList.remove("hidden");
    } else {
      countBadge.classList.add("hidden");
    }
  }

  if (btnText) {
    btnText.textContent =
      count > 0 ? "+ Tambah Warga Lainnya" : "Pilih Warga dari Daftar";
  }

  if (!container) return;

  if (count === 0) {
    container.innerHTML = `
      <div class="collab-empty-state">
        <div class="collab-empty-icon-wrap" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A382B" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div class="collab-empty-texts">
          <span class="collab-empty-title">Belum Ada Warga Terpilih</span>
          <p class="collab-empty-sub">Ajak warga sekitar untuk gotong royong menanam bibit bersama di pekarangan kawasan ini.</p>
        </div>
      </div>
    `;
    return;
  }

  let html = "";
  selectedMissionFriends.forEach((f) => {
    const safeName = escapeHtml(f.name).replace(/'/g, "\\'");
    const safeLoc = escapeHtml(f.location).replace(/'/g, "\\'");
    const safeUser = escapeHtml(f.username).replace(/'/g, "\\'");
    const cleanLoc = (f.location || "Denpasar").replace(
      /,\s*(?:Pulau\s*)?Bali$/i,
      "",
    );
    const friendObj =
      typeof TEDUH_DATA !== "undefined" && TEDUH_DATA.friendsDirectory
        ? TEDUH_DATA.friendsDirectory.find(
            (fd) => fd.name === f.name || fd.username === f.username,
          )
        : null;
    const avatarImgSrc =
      f.avatarImg ||
      (friendObj ? friendObj.avatarImg : "../assets/avatars/dewi-lestari.jpg");

    html += `
      <div class="invited-resident-card">
        <div class="invited-resident-left">
          <div class="invited-resident-avatar"><img src="${avatarImgSrc}" alt="${escapeHtml(f.name)}" onerror="this.src='../assets/avatars/dewi-lestari.jpg'"></div>
          <div class="invited-resident-info">
            <div class="invited-resident-name">${escapeHtml(f.name)}</div>
            <div class="invited-resident-meta">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>${escapeHtml(cleanLoc)}</span>
            </div>
          </div>
        </div>
        <button type="button" class="btn-remove-resident" onclick="toggleMissionFriend('${safeName}', '${safeLoc}', '${safeUser}')" title="Batalkan ajakan ${escapeHtml(f.name)}" aria-label="Batalkan ajakan ${escapeHtml(f.name)}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          <span>Batal</span>
        </button>
      </div>
    `;
  });

  container.innerHTML = html;
}

function showNearbyFriendsNotice() {
  const notice = document.getElementById("mapNearbyFriendsSideHint");
  if (!notice) return;
  notice.classList.remove("hidden", "is-closing");
  document.body.classList.add("has-nearby-notice");
}

function dismissNearbyFriendsNotice() {
  document.body.classList.remove("has-nearby-notice");
  const notice = document.getElementById("mapNearbyFriendsSideHint");
  if (!notice || notice.classList.contains("hidden")) return;
  notice.classList.add("is-closing");
  setTimeout(() => {
    notice.classList.add("hidden");
    notice.classList.remove("is-closing");
  }, 250);
}

let currentModalFriendsList = [];

function openFriendsPickerModal() {
  dismissNearbyFriendsNotice();
  const modal = document.getElementById("friendsPickerModal");
  const searchInput = document.getElementById("friendsModalSearchInput");
  if (!modal) return;

  if (searchInput) searchInput.value = "";

  let friends =
    typeof TEDUH_DATA !== "undefined" && TEDUH_DATA.friendsDirectory
      ? [...TEDUH_DATA.friendsDirectory]
      : [];

  if (activeZone) {
    friends = friends
      .map((f) => {
        const dLat = f.lat - activeZone.lat;
        const dLng = f.lng - activeZone.lng;
        const dist = Math.sqrt(dLat * dLat + dLng * dLng);
        return { ...f, dist };
      })
      .sort((a, b) => a.dist - b.dist);
  }

  currentModalFriendsList = friends;
  renderFriendsModalList(friends);

  modal.classList.remove("hidden");
  void modal.offsetWidth;
  modal.classList.add("is-open");

  const card = modal.querySelector(".friends-modal-card");
  if (card) {
    card.style.transform = "scale(0.9) translateY(16px)";
    card.style.opacity = "0";
    card.style.transition = "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease";
    requestAnimationFrame(() => {
      card.style.transform = "scale(1) translateY(0)";
      card.style.opacity = "1";
    });
  }
}

function closeFriendsPickerModal() {
  const modal = document.getElementById("friendsPickerModal");
  if (!modal) return;
  const card = modal.querySelector(".friends-modal-card");
  if (card) {
    card.style.transform = "scale(0.92) translateY(10px)";
    card.style.opacity = "0";
    card.style.transition = "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease";
    setTimeout(() => {
      modal.classList.remove("is-open");
      modal.classList.add("hidden");
      card.style.transform = "";
      card.style.opacity = "";
      card.style.transition = "";
    }, 200);
  } else {
    modal.classList.remove("is-open");
    modal.classList.add("hidden");
  }
}

function filterFriendsModalList(query) {
  const q = (query || "").toLowerCase().trim().replace(/^@/, "");
  if (!q) {
    renderFriendsModalList(currentModalFriendsList);
    return;
  }
  const filtered = currentModalFriendsList.filter(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      f.username.toLowerCase().replace(/^@/, "").includes(q) ||
      (f.districtLocation && f.districtLocation.toLowerCase().includes(q)),
  );
  renderFriendsModalList(filtered);
}

function renderFriendsModalList(friendsList) {
  const container = document.getElementById("friendsModalListContainer");
  const selectedCountEl = document.getElementById("friendsModalSelectedCount");

  const count = selectedMissionFriends.length;

  if (selectedCountEl) {
    selectedCountEl.textContent = `${count} Warga Dipilih`;
    selectedCountEl.style.transform = "scale(1.2)";
    selectedCountEl.style.transition = "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)";
    setTimeout(() => {
      selectedCountEl.style.transform = "scale(1)";
    }, 250);
  }

  if (!container) return;

  if (!friendsList || friendsList.length === 0) {
    container.innerHTML = `
      <div style="padding: 24px 16px; text-align: center; color: #71717A; font-size: 12px;">
        Tidak ada warga yang cocok dengan pencarian.
      </div>
    `;
    return;
  }

  container.innerHTML = friendsList
    .map((friend) => {
      const isInvited = selectedMissionFriends.some(
        (f) => f.username === friend.username || f.name === friend.name,
      );
      const safeName = escapeHtml(friend.name).replace(/'/g, "\\'");
      const safeLoc = escapeHtml(friend.districtLocation).replace(/'/g, "\\'");
      const safeUser = escapeHtml(friend.username).replace(/'/g, "\\'");
      const cleanDistrictLoc = (friend.districtLocation || "Denpasar").replace(
        /,\s*(?:Pulau\s*)?Bali$/i,
        "",
      );

      const avatarImgSrc =
        friend.avatarImg || "../assets/avatars/dewi-lestari.jpg";

      return `
      <div class="friend-item-row ${isInvited ? "is-invited" : ""}">
        <div class="friend-item-left">
          <div class="friend-item-avatar"><img src="${avatarImgSrc}" alt="${escapeHtml(friend.name)}" onerror="this.src='../assets/avatars/dewi-lestari.jpg'"></div>
          <div class="friend-item-info">
            <span class="friend-item-name">${escapeHtml(friend.name)}</span>
            <span class="friend-item-sub">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>${escapeHtml(cleanDistrictLoc)}</span>
            </span>
          </div>
        </div>
        <button type="button" class="btn-friend-item-toggle ${isInvited ? "is-selected" : ""}" onclick="toggleMissionFriend('${safeName}', '${safeLoc}', '${safeUser}')">
          ${
            isInvited
              ? `
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Terpilih</span>
          `
              : `
            <span>+ Ajak</span>
          `
          }
        </button>
      </div>
    `;
    })
    .join("");

  container.querySelectorAll(".friend-item-row").forEach((row, i) => {
    row.style.opacity = "0";
    row.style.transform = "translateY(8px)";
    row.style.transition = "opacity 0.25s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)";
    setTimeout(() => {
      row.style.opacity = "1";
      row.style.transform = "translateY(0)";
    }, i * 30);
  });
}

function runThermalSimulation() {
  if (!activeZone) return;

  const sim = activeZone.simulationImpact;
  const simBtn = document.getElementById("runSimulationBtn");
  if (!sim || !simBtn) return;

  simBtn.disabled = true;
  simBtn.innerHTML = `
    <svg style="animation: spin 1s linear infinite; margin-right: 8px;" width="16" height="16" fill="none" viewBox="0 0 24 24"><circle style="opacity: 0.25;" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path style="opacity: 0.75;" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
    <span>Menghitung Proyeksi Kesejukan...</span>
  `;

  setTimeout(() => {
    if (activeSimulationCircle) {
      mapInstance.removeLayer(activeSimulationCircle);
    }

    activeSimulationCircle = L.circle([activeZone.lat, activeZone.lng], {
      color: "#1A382B",
      fillColor: "#1A382B",
      fillOpacity: 0.35,
      radius: 45, // radius 45 meter simulasi naungan pohon
      weight: 2,
    }).addTo(mapInstance);

    const canopyMarker = L.divIcon({
      className: "canopy-pulse-container",
      html: '<div class="canopy-pulse-ring"></div>',
      iconSize: [80, 80],
      iconAnchor: [40, 40],
    });
    L.marker([activeZone.lat, activeZone.lng], { icon: canopyMarker }).addTo(
      mapInstance,
    );

    const surfaceEl = document.getElementById("metricSurfaceTemp");
    if (surfaceEl) {
      surfaceEl.textContent = sim.newSurfaceTemp;
      surfaceEl.className = "metric-value cool";
    }

    const canopyEl = document.getElementById("metricCanopy");
    if (canopyEl) {
      canopyEl.textContent = sim.newCanopy;
    }

    const impactBox = document.getElementById("simulationImpactBox");
    if (impactBox) {
      impactBox.classList.remove("hidden");
      const tempDropEl = document.getElementById("impactTempDrop");
      const scoreEl = document.getElementById("impactScore");
      const summaryEl = document.getElementById("impactSummaryText");

      if (tempDropEl) tempDropEl.textContent = sim.tempReduction;
      if (scoreEl) scoreEl.textContent = sim.coolingScore;
      if (summaryEl) summaryEl.textContent = sim.summary;
    }

    simBtn.innerHTML = `
      <svg width="15" height="15" fill="none" stroke="#2E7D32" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"></path></svg>
      <span>Simulasi Aktif: Suhu Turun ${sim.tempReduction}</span>
    `;
  }, 500);
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(
    /[&<>"']/g,
    (m) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[m],
  );
}

function getRecentSearches() {
  if (typeof localStorage === "undefined") {
    return TEDUH_DATA.zones.slice(0, 3);
  }
  const saved = localStorage.getItem("teduh_recent_searches");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const mapped = parsed
          .map((id) => TEDUH_DATA.zones.find((z) => z.id === id))
          .filter(Boolean);
        if (mapped.length > 0) return mapped;
      }
    } catch (e) {}
  }
  return [
    TEDUH_DATA.zones.find((z) => z.id === "zone-teuku-umar"),
    TEDUH_DATA.zones.find((z) => z.id === "zone-sesetan"),
    TEDUH_DATA.zones.find((z) => z.id === "zone-gatot-subroto"),
  ].filter(Boolean);
}

function saveRecentSearch(zoneId) {
  if (!zoneId || typeof localStorage === "undefined") return;
  try {
    let ids = [];
    const saved = localStorage.getItem("teduh_recent_searches");
    if (saved) {
      ids = JSON.parse(saved) || [];
    } else {
      ids = ["zone-teuku-umar", "zone-sesetan", "zone-gatot-subroto"];
    }
    ids = ids.filter((id) => id !== zoneId);
    ids.unshift(zoneId);
    if (ids.length > 6) ids = ids.slice(0, 6);
    localStorage.setItem("teduh_recent_searches", JSON.stringify(ids));
  } catch (e) {}
}

function isMarkerSelected(marker) {
  if (!marker) return false;
  if (typeof selectedCitizenMissionMarker !== "undefined" && selectedCitizenMissionMarker === marker) return true;
  if (
    typeof activeCitizenMission !== "undefined" &&
    activeCitizenMission &&
    marker._teduhMissionId &&
    marker._teduhMissionId === activeCitizenMission.id
  ) {
    return true;
  }
  if (
    typeof userActiveMissionMarker !== "undefined" &&
    userActiveMissionMarker === marker &&
    typeof activeZone !== "undefined" &&
    activeZone &&
    typeof getUserActiveMissionForZone === "function" &&
    getUserActiveMissionForZone(activeZone) !== null
  ) {
    return true;
  }
  if (typeof activeMarker !== "undefined" && activeMarker === marker) return true;
  return false;
}

function bindHoverPopup(marker) {
  let hoverTimeout = null;
  let isMouseOverPopup = false;
  let isMouseOverMarker = false;

  function isDesktopView() {
    return (
      window.innerWidth > 860 &&
      (!window.matchMedia ||
        window.matchMedia("(hover: hover) and (pointer: fine)").matches)
    );
  }

  marker.on("mouseover", function () {
    if (!isDesktopView()) return;
    if (currentDrawerStage === 2 && activeZone) return;

    isMouseOverMarker = true;
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      hoverTimeout = null;
    }

    if (!marker.isPopupOpen()) {
      marker.openPopup();
    }
  });

  marker.on("mouseout", function () {
    if (!isDesktopView()) return;
    isMouseOverMarker = false;

    if (hoverTimeout) clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(function () {
      if (!isMouseOverMarker && !isMouseOverPopup) {
        if (isMarkerSelected(marker)) return;

        if (marker.isPopupOpen()) {
          marker.closePopup();
        }
      }
    }, 220);
  });

  marker.on("click", function () {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      hoverTimeout = null;
    }
  });

  marker.on("popupopen", function (e) {
    const popupEl = e.popup.getElement();
    if (popupEl) {
      L.DomEvent.disableClickPropagation(popupEl);
      L.DomEvent.disableScrollPropagation(popupEl);

      if (isDesktopView()) {
        popupEl.onmouseenter = function () {
          isMouseOverPopup = true;
          if (hoverTimeout) {
            clearTimeout(hoverTimeout);
            hoverTimeout = null;
          }
        };

        popupEl.onmouseleave = function () {
          isMouseOverPopup = false;
          if (hoverTimeout) clearTimeout(hoverTimeout);
          hoverTimeout = setTimeout(function () {
            if (!isMouseOverMarker && !isMouseOverPopup) {
              if (isMarkerSelected(marker)) return;

              if (marker.isPopupOpen()) {
                marker.closePopup();
              }
            }
          }, 220);
        };
      }

      const card = popupEl.querySelector(".citizen-mission-popup-card");
      if (card && marker._teduhMissionId) {
        card.style.cursor = "pointer";
        card.onclick = function (ev) {
          if (ev) {
            ev.stopPropagation();
            ev.preventDefault();
          }
          openZoneDrawerFromPopup(null, marker._teduhMissionId);
        };
      }
    }
  });

  marker.on("popupclose", function () {
    isMouseOverPopup = false;
    isMouseOverMarker = false;
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      hoverTimeout = null;
    }
  });
}

if (typeof document !== "undefined") {
  document.addEventListener(
    "click",
    function (e) {
      if (
        e.target &&
        e.target.closest &&
        (e.target.closest("a") || e.target.closest("button"))
      ) {
        return;
      }

      const card =
        e.target &&
        e.target.closest &&
        e.target.closest(".citizen-mission-popup-card");
      if (card) {
        if (e.stopPropagation) e.stopPropagation();
        const missionId = card.getAttribute("data-mission-id");
        if (missionId && typeof selectCitizenMission === "function") {
          openZoneDrawerFromPopup(null, missionId);
        }
        return;
      }

      const userCard =
        e.target &&
        e.target.closest &&
        e.target.closest(".user-active-mission-popup");
      if (userCard) {
        if (e.stopPropagation) e.stopPropagation();
        if (typeof selectUserActiveMission === "function") {
          openZoneDrawerFromPopup(null, null, function () {
            selectUserActiveMission(true);
          });
        }
        return;
      }

      const standardCard =
        e.target && e.target.closest && e.target.closest(".map-popup-card");
      if (
        standardCard &&
        !standardCard.classList.contains("citizen-mission-popup-card") &&
        !standardCard.classList.contains("user-active-mission-popup")
      ) {
        if (e.stopPropagation) e.stopPropagation();
        const zoneId =
          standardCard.getAttribute("data-zone-id") ||
          (activeZone ? activeZone.id : null);
        openZoneDrawerFromPopup(zoneId);
        return;
      }
    },
    true,
  );
}

function renderCitizenMissions() {
  if (
    !mapInstance ||
    typeof TEDUH_DATA === "undefined" ||
    !TEDUH_DATA.getCitizenMissions
  )
    return;

  citizenMissionMarkers.forEach((m) => mapInstance.removeLayer(m));
  citizenMissionMarkers = [];

  const missions = TEDUH_DATA.getCitizenMissions();

  missions.forEach((mission) => {
    const isJoined = mission.isJoined;
    const authorName = escapeHtml(mission.authorName);
    const location = escapeHtml(mission.location);
    const treeName = escapeHtml(mission.treeName);
    const safeMissionId = escapeHtml(mission.id).replace(/'/g, "\\'");
    const pinColor = isJoined ? "#5c8437" : "#BA4E2A";

    const customIcon = L.divIcon({
      className: "citizen-location-pin-container",
      html: `
        <div class="standard-location-pin ${isJoined ? "is-joined is-my-mission" : "is-citizen"}" title="${isJoined ? "Misi Aktif Saya Bersama: " : "Titik Tanam: "}${authorName}">
          ${isJoined ? '<div class="pin-pulse-halo"></div>' : ""}
          <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2C9.37258 2 4 7.37258 4 14C4 23 16 34 16 34C16 34 28 23 28 14C28 7.37258 22.6274 2 16 2Z" class="pin-outer-body" fill="${pinColor}" stroke="#FFFFFF" stroke-width="1.8"/>
            <circle cx="16" cy="14" r="5.5" fill="#FFFFFF"/>
          </svg>
        </div>
      `,
      iconSize: [32, 40],
      iconAnchor: [16, 34],
      popupAnchor: [0, -34],
    });

    const marker = L.marker([mission.lat, mission.lng], {
      icon: customIcon,
      riseOnHover: true,
    }).addTo(mapInstance);
    marker._teduhMissionId = mission.id;

    const popupContent = `
      <div class="map-popup-card citizen-mission-popup-card" data-mission-id="${safeMissionId}" onclick="handleMapPopupCardClick(event, null, '${safeMissionId}')" style="cursor: pointer;">
        <div class="map-popup-header">
          <span class="map-popup-badge ${isJoined ? "cool" : "hot"}">${isJoined ? "✓ Terdaftar" : `+${mission.bonusPoints || 100} Poin`}</span>
          <span class="map-popup-location">${location}</span>
        </div>
        <h4 class="map-popup-title">${mission.authorName ? `Titik Tanam ${authorName}` : "Titik Tanam Warga"}</h4>
        <div class="map-popup-grid">
          <div class="map-popup-mini-stat">
            <span>Bibit Pilihan</span>
            <strong>${treeName}</strong>
          </div>
          <div class="map-popup-mini-stat">
            <span>Warga yang Ikut</span>
            <strong id="cm-volunteers-${mission.id}">${mission.currentVolunteers} Warga</strong>
          </div>
        </div>
        <div class="map-popup-cta-btn" aria-hidden="true">
          <span class="map-popup-cta-text">Ketuk untuk Detail &amp; Analisa</span>
          <span class="map-popup-cta-icon">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </span>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent, {
      offset: [0, -8],
      closeButton: false,
      className: "custom-teduh-popup",
      autoPan: true,
      autoPanPaddingTopLeft: [20, 75],
      autoPanPaddingBottomRight: [20, 75],
    });

    bindHoverPopup(marker);

    marker.on("click", function (e) {
      L.DomEvent.stopPropagation(e);
      if (currentDrawerStage === 2 && activeZone) {
        dismissNearbyFriendsNotice();
        if (mapInstance) mapInstance.closePopup();
        return;
      }
      const isMobile = window.innerWidth <= 860;
      if (isMobile) {
        selectCitizenMission(mission.id, false);
        if (!marker.isPopupOpen()) {
          marker.openPopup();
        }
      } else {
        selectCitizenMission(mission.id, true);
      }
    });

    citizenMissionMarkers.push(marker);
  });
}

function selectCitizenMission(missionId, shouldOpenDrawer = null) {
  if (typeof TEDUH_DATA === "undefined" || !TEDUH_DATA.getCitizenMissions)
    return;

  const missions = TEDUH_DATA.getCitizenMissions();
  const mission = missions.find((m) => m.id === missionId);
  if (!mission) return;

  const drawer = document.getElementById("spatialDrawer");
  const isDrawerOpen = drawer && drawer.classList.contains("is-open");

  if (
    isDrawerOpen &&
    activeCitizenMission &&
    activeCitizenMission.id === missionId
  ) {
    const targetMarker = citizenMissionMarkers.find(
      (m) => m._teduhMissionId === missionId,
    );
    if (targetMarker) {
      selectedCitizenMissionMarker = targetMarker;
      if (!targetMarker.isPopupOpen()) {
        targetMarker.openPopup();
      }
    }
    return;
  }

  let zone = null;
  if (mission.zoneId && TEDUH_DATA.zones) {
    zone = TEDUH_DATA.zones.find((z) => z.id === mission.zoneId);
  }
  if (!zone && TEDUH_DATA.zones && TEDUH_DATA.zones.length > 0) {
    zone = TEDUH_DATA.zones[0];
  }

  if (zone) {
    const missionZone = {
      ...zone,
      name: `Titik Tanam ${mission.authorName} (${mission.location.split(",")[0]})`,
      fullAddress: `${mission.location}`,
      lat: mission.lat,
      lng: mission.lng,
    };
    selectZone(missionZone, false, mission, shouldOpenDrawer);
  }
}

let pendingJoinMissionId = null;

function promptJoinCitizenMission(missionId) {
  pendingJoinMissionId = missionId;
  openJoinConfirmModal(missionId);
}

function openJoinConfirmModal(missionId) {
  if (typeof TEDUH_DATA === "undefined" || !TEDUH_DATA.getCitizenMissions)
    return;

  const missions = TEDUH_DATA.getCitizenMissions();
  const mission = missions.find((m) => m.id === missionId);
  if (!mission) return;

  pendingJoinMissionId = missionId;

  const authorEl = document.getElementById("joinConfirmAuthor");
  const locEl = document.getElementById("joinConfirmLocation");
  const treeEl = document.getElementById("joinConfirmTree");
  const executeBtn = document.getElementById("btnConfirmJoinExecute");

  if (authorEl) authorEl.textContent = mission.authorName;
  if (locEl) locEl.textContent = mission.location;
  if (treeEl) treeEl.textContent = mission.treeName;

  if (executeBtn) {
    const safeId = escapeHtml(mission.id).replace(/'/g, "\\'");
    executeBtn.setAttribute(
      "onclick",
      `confirmJoinCitizenMission('${safeId}')`,
    );
  }

  const modal = document.getElementById("joinCitizenMissionConfirmModal");
  if (modal) {
    modal.classList.remove("hidden");
    void modal.offsetWidth;
    modal.classList.add("is-open");
    const card = modal.querySelector(".mission-modal-card");
    if (card) {
      card.style.transform = "scale(0.9) translateY(16px)";
      card.style.opacity = "0";
      card.style.transition = "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease";
      requestAnimationFrame(() => {
        card.style.transform = "scale(1) translateY(0)";
        card.style.opacity = "1";
      });
    }
  }
}

function closeJoinConfirmModal() {
  const modal = document.getElementById("joinCitizenMissionConfirmModal");
  if (modal) {
    const card = modal.querySelector(".mission-modal-card");
    if (card) {
      card.style.transform = "scale(0.92) translateY(10px)";
      card.style.opacity = "0";
      card.style.transition = "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease";
      setTimeout(() => {
        modal.classList.remove("is-open");
        modal.classList.add("hidden");
        card.style.transform = "";
        card.style.opacity = "";
        card.style.transition = "";
      }, 200);
    } else {
      modal.classList.remove("is-open");
      modal.classList.add("hidden");
    }
  }
  pendingJoinMissionId = null;
}

function confirmJoinCitizenMission(missionId) {
  if (typeof TEDUH_DATA === "undefined" || !TEDUH_DATA.joinCitizenMission)
    return;

  const result = TEDUH_DATA.joinCitizenMission(missionId);
  if (!result.success) {
    showToast(result.message || "Anda sudah terdaftar di titik ini.");
    closeJoinConfirmModal();
    return;
  }

  syncUserProfile();

  showToast(
    `Berhasil mendaftar tanam bersama ${result.mission.authorName}! +${result.bonusPoints} poin diperoleh.`,
  );

  closeJoinConfirmModal();

  renderCitizenMissions();

  if (activeCitizenMission && activeCitizenMission.id === missionId) {
    const freshMissions = TEDUH_DATA.getCitizenMissions();
    const fresh = freshMissions.find((m) => m.id === missionId);
    if (fresh) {
      activeCitizenMission = fresh;
    }
    if (activeZone) {
      populateDrawer(activeZone);
    }
  }
}

function joinCitizenMission(missionId) {
  promptJoinCitizenMission(missionId);
}

let pendingLeaveMissionId = null;

function promptLeaveCitizenMission(missionId) {
  const id =
    missionId || (activeCitizenMission ? activeCitizenMission.id : null);
  if (!id) return;
  pendingLeaveMissionId = id;
  openLeaveConfirmModal(id);
}

function openLeaveConfirmModal(missionId) {
  if (typeof TEDUH_DATA === "undefined" || !TEDUH_DATA.getCitizenMissions)
    return;
  const missions = TEDUH_DATA.getCitizenMissions();
  const mission = missions.find((m) => m.id === missionId);
  if (!mission) return;

  pendingLeaveMissionId = missionId;

  const authorEl = document.getElementById("leaveConfirmAuthor");
  const locEl = document.getElementById("leaveConfirmLocation");
  const executeBtn = document.getElementById("btnConfirmLeaveExecute");

  if (authorEl) authorEl.textContent = mission.authorName;
  if (locEl) locEl.textContent = mission.location;

  if (executeBtn) {
    const safeId = escapeHtml(mission.id).replace(/'/g, "\\'");
    executeBtn.setAttribute(
      "onclick",
      `confirmLeaveCitizenMission('${safeId}')`,
    );
  }

  const modal = document.getElementById("leaveCitizenMissionConfirmModal");
  if (modal) {
    modal.classList.remove("hidden");
    void modal.offsetWidth;
    modal.classList.add("is-open");
    const card = modal.querySelector(".mission-modal-card");
    if (card) {
      card.style.transform = "scale(0.9) translateY(16px)";
      card.style.opacity = "0";
      card.style.transition = "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease";
      requestAnimationFrame(() => {
        card.style.transform = "scale(1) translateY(0)";
        card.style.opacity = "1";
      });
    }
  }
}

function closeLeaveConfirmModal() {
  const modal = document.getElementById("leaveCitizenMissionConfirmModal");
  if (modal) {
    const card = modal.querySelector(".mission-modal-card");
    if (card) {
      card.style.transform = "scale(0.92) translateY(10px)";
      card.style.opacity = "0";
      card.style.transition = "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease";
      setTimeout(() => {
        modal.classList.remove("is-open");
        modal.classList.add("hidden");
        card.style.transform = "";
        card.style.opacity = "";
        card.style.transition = "";
      }, 200);
    } else {
      modal.classList.remove("is-open");
      modal.classList.add("hidden");
    }
  }
  pendingLeaveMissionId = null;
}

function confirmLeaveCitizenMission(missionId) {
  if (typeof TEDUH_DATA === "undefined" || !TEDUH_DATA.leaveCitizenMission)
    return;

  const result = TEDUH_DATA.leaveCitizenMission(missionId);
  if (!result.success) {
    showToast(result.message || "Gagal membatalkan pendaftaran.");
    closeLeaveConfirmModal();
    return;
  }

  syncUserProfile();
  showToast(
    `Pendaftaran tanam bersama ${result.mission.authorName} dibatalkan.`,
  );
  closeLeaveConfirmModal();

  renderCitizenMissions();

  if (activeCitizenMission && activeCitizenMission.id === missionId) {
    const freshMissions = TEDUH_DATA.getCitizenMissions();
    const fresh = freshMissions.find((m) => m.id === missionId);
    if (fresh) {
      activeCitizenMission = fresh;
    }
    if (activeZone) {
      populateDrawer(activeZone);
    }
  }
}

function leaveCitizenMission(missionId) {
  promptLeaveCitizenMission(missionId);
}

function renderUserActiveMissionPin() {
  if (!mapInstance || typeof localStorage === "undefined") return;

  if (userActiveMissionMarker) {
    mapInstance.removeLayer(userActiveMissionMarker);
    userActiveMissionMarker = null;
  }
  if (userActiveMissionCircle) {
    mapInstance.removeLayer(userActiveMissionCircle);
    userActiveMissionCircle = null;
  }

  const saved = localStorage.getItem("teduh_active_mission");
  if (!saved) return;

  try {
    const mission = JSON.parse(saved);
    if (!mission) return;

    if (!mission.lat || !mission.lng) {
      if (
        mission.zoneId &&
        typeof TEDUH_DATA !== "undefined" &&
        TEDUH_DATA.zones
      ) {
        const zone = TEDUH_DATA.zones.find((z) => z.id === mission.zoneId);
        if (zone) {
          mission.lat = zone.lat;
          mission.lng = zone.lng;
        }
      }
    }

    if (!mission.lat || !mission.lng) return;

    userActiveMissionCircle = L.circle([mission.lat, mission.lng], {
      color: "#5c8437",
      fillColor: "#5c8437",
      fillOpacity: 0.22,
      dashArray: "5, 5",
      radius: 35,
      weight: 2,
    }).addTo(mapInstance);

    const myMissionIcon = L.divIcon({
      className: "user-active-location-pin-container",
      html: `
        <div class="standard-location-pin is-my-mission" title="Misi Aktif Saya: ${escapeHtml(mission.treeName || "Pohon Tanjung")}">
          <div class="pin-pulse-halo"></div>
          <svg width="36" height="44" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2C9.37258 2 4 7.37258 4 14C4 23 16 34 16 34C16 34 28 23 28 14C28 7.37258 22.6274 2 16 2Z" fill="#5c8437" stroke="#FFFFFF" stroke-width="1.8"/>
            <circle cx="16" cy="14" r="5.5" fill="#FFFFFF"/>
          </svg>
        </div>
      `,
      iconSize: [36, 44],
      iconAnchor: [18, 38],
      popupAnchor: [0, -38],
    });

    userActiveMissionMarker = L.marker([mission.lat, mission.lng], {
      icon: myMissionIcon,
      riseOnHover: true,
    }).addTo(mapInstance);

    const encodedZone = encodeURIComponent(mission.zoneName || "Kawasan");
    const treeName = mission.treeName || "Pohon Tanjung";
    const encodedTree = encodeURIComponent(treeName);
    const communityUrl = `community.html?action=complete-mission&zone=${encodedZone}&tree=${encodedTree}`;

    let isExpired = false;
    let formattedDate = "Segera";
    if (mission.scheduledDate) {
      formattedDate =
        typeof TEDUH_DATA !== "undefined" && TEDUH_DATA.formatDateIndo
          ? TEDUH_DATA.formatDateIndo(mission.scheduledDate)
          : mission.scheduledDate;

      try {
        const targetTime = new Date(
          mission.scheduledDate + "T23:59:59",
        ).getTime();
        if (
          !isNaN(targetTime) &&
          !mission.isCompleted &&
          Date.now() > targetTime
        ) {
          isExpired = true;
        }
      } catch (err) {}
    }

    const popupHtml = `
      <div class="map-popup-card user-active-mission-popup" onclick="handleMapPopupCardClick(event, '${escapeHtml(mission.zoneId || "")}', null, function() { window.selectUserActiveMission(true); })" style="cursor: pointer;">
        <div class="map-popup-header">
          <span class="map-popup-badge cool">Misi Aktif Saya</span>
          <span class="map-popup-location">${escapeHtml(mission.district || "Denpasar")}</span>
        </div>
        <h4 class="map-popup-title">${escapeHtml(mission.zoneName || "Kawasan Aksi")}</h4>
        <div class="map-popup-grid">
          <div class="map-popup-mini-stat">
            <span>Bibit Ditanam</span>
            <strong>${escapeHtml(treeName)}</strong>
          </div>
          <div class="map-popup-mini-stat">
            <span>Status Aksi</span>
            <strong style="color: #1A382B;">Sedang Berjalan</strong>
          </div>
        </div>
        <div class="map-popup-cta-btn" aria-hidden="true">
          <span class="map-popup-cta-text">Ketuk untuk Analisa &amp; Jadwal</span>
          <span class="map-popup-cta-icon">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </span>
        </div>
        <a href="${communityUrl}" onclick="event.stopPropagation();" class="map-popup-btn" style="color: #FFFFFF !important; text-decoration: none !important; text-align: center;">
          <span style="color: #FFFFFF !important;">Bagikan di Komunitas</span>
        </a>
      </div>
    `;

    userActiveMissionMarker.bindPopup(popupHtml, {
      offset: [0, -8],
      closeButton: false,
      autoPan: true,
      autoPanPaddingTopLeft: [20, 75],
      autoPanPaddingBottomRight: [20, 75],
      className: "custom-teduh-popup",
      maxWidth: 240,
      minWidth: 220,
    });

    userActiveMissionMarker.on("click", function (e) {
      L.DomEvent.stopPropagation(e);
      if (currentDrawerStage === 2 && activeZone) {
        dismissNearbyFriendsNotice();
        if (mapInstance) mapInstance.closePopup();
        return;
      }
      const isMobile = window.innerWidth <= 860;
      if (isMobile) {
        selectUserActiveMission(false);
        if (!userActiveMissionMarker.isPopupOpen()) {
          userActiveMissionMarker.openPopup();
        }
      } else {
        selectUserActiveMission(true);
      }
    });

    bindHoverPopup(userActiveMissionMarker);
  } catch (e) {}
}

function selectUserActiveMission(shouldOpenDrawer = null) {
  if (typeof localStorage === "undefined") return;
  const saved = localStorage.getItem("teduh_active_mission");
  if (!saved) return;

  try {
    const mission = JSON.parse(saved);
    if (!mission || mission.isCompleted) return;

    let zone = null;
    if (
      mission.zoneId &&
      typeof TEDUH_DATA !== "undefined" &&
      TEDUH_DATA.zones
    ) {
      zone = TEDUH_DATA.zones.find((z) => z.id === mission.zoneId);
    }
    if (
      !zone &&
      mission.zoneName &&
      typeof TEDUH_DATA !== "undefined" &&
      TEDUH_DATA.zones
    ) {
      zone = TEDUH_DATA.zones.find(
        (z) =>
          z.name &&
          z.name.toLowerCase().includes(mission.zoneName.toLowerCase()),
      );
    }
    if (
      !zone &&
      typeof TEDUH_DATA !== "undefined" &&
      TEDUH_DATA.generateDynamicAnalysis &&
      mission.lat &&
      mission.lng
    ) {
      zone = TEDUH_DATA.generateDynamicAnalysis(mission.lat, mission.lng);
    }
    if (
      !zone &&
      typeof TEDUH_DATA !== "undefined" &&
      TEDUH_DATA.zones &&
      TEDUH_DATA.zones.length > 0
    ) {
      zone = TEDUH_DATA.zones[0];
    }

    if (zone) {
      const activeMissionZone = {
        ...zone,
        id: mission.zoneId || zone.id,
        name: mission.zoneName || zone.name,
        district: mission.district || zone.district || "Denpasar",
        lat: mission.lat != null ? mission.lat : zone.lat,
        lng: mission.lng != null ? mission.lng : zone.lng,
        fullAddress: zone.fullAddress || mission.zoneName || zone.name,
      };
      if (mission.treeName) {
        activeMissionZone.recommendedTree = {
          ...(zone.recommendedTree || {}),
          name: mission.treeName,
        };
      }
      selectZone(activeMissionZone, false, null, shouldOpenDrawer);
      if (userActiveMissionMarker && !userActiveMissionMarker.isPopupOpen()) {
        userActiveMissionMarker.openPopup();
      }
    }
  } catch (e) {}
}

function initSearchAutocomplete() {
  const searchPairs = [
    {
      input: document.getElementById("zoneSearchInput"),
      dropdown: document.getElementById("searchResultsDropdown"),
    },
    {
      input: document.getElementById("zoneSearchInputMobile"),
      dropdown: document.getElementById("searchResultsDropdownMobile"),
    },
  ];

  function filterZones(query) {
    if (!query) return getRecentSearches();
    const q = query.toLowerCase().trim();
    return TEDUH_DATA.zones.filter(
      (z) =>
        (z.name && z.name.toLowerCase().includes(q)) ||
        (z.fullAddress && z.fullAddress.toLowerCase().includes(q)) ||
        (z.address && z.address.toLowerCase().includes(q)) ||
        (z.village && z.village.toLowerCase().includes(q)) ||
        (z.district && z.district.toLowerCase().includes(q)) ||
        (z.city && z.city.toLowerCase().includes(q)) ||
        (z.category && z.category.toLowerCase().includes(q)),
    );
  }

  searchPairs.forEach(({ input, dropdown }) => {
    if (!input || !dropdown) return;

    function renderSearchResults(matches, query = "") {
      const isHistoryMode = !query.trim();

      if (matches.length === 0) {
        dropdown.innerHTML = `
          <div class="map-search-empty">
            <div class="map-search-empty-text">
              Tidak ada kawasan atau jalan yang cocok dengan "<strong>${escapeHtml(query)}</strong>".
            </div>
            <div class="map-search-empty-hint">
              Klik sembarang titik pekarangan pada peta satelit untuk menganalisis suhu secara langsung.
            </div>
          </div>
        `;
        dropdown.classList.remove("hidden");
        return;
      }

      dropdown.innerHTML = "";

      const displayedItems = isHistoryMode ? matches.slice(0, 4) : matches;

      displayedItems.forEach((match) => {
        const isHot = match.isHotspot;
        const item = document.createElement("button");
        item.type = "button";
        item.className = "map-search-item";

        const addressText =
          match.fullAddress ||
          `${match.address || ""}, ${match.district || ""}, ${match.city || ""}`;

        item.innerHTML = `
          <div class="map-search-item-left">
            <div class="map-search-clock-circle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div class="map-search-item-info">
              <div class="map-search-item-name">${match.name}</div>
              <div class="map-search-item-address">${addressText}</div>
              <div class="map-search-item-status ${isHot ? "hot" : "cool"}">
                ${isHot ? "Sangat Terik" : "Sejuk Nyaman"} · Suhu ${match.surfaceTemp}
              </div>
            </div>
          </div>
        `;

        item.addEventListener("click", () => {
          saveRecentSearch(match.id);
          input.value = match.name;
          searchPairs.forEach((p) => {
            if (p.input) p.input.value = match.name;
          });
          dropdown.classList.add("hidden");
          selectZone(match, false);
        });

        dropdown.appendChild(item);
      });

      if (isHistoryMode && matches.length > 0) {
        const bottomAction = document.createElement("div");
        bottomAction.className = "map-search-bottom-action";
        bottomAction.innerHTML = `
          <span class="map-search-more-link">
            Lihat riwayat pencarian lainnya
          </span>
        `;
        dropdown.appendChild(bottomAction);
      }

      dropdown.classList.remove("hidden");
    }

    input.addEventListener("focus", () => {
      const matches = filterZones(input.value);
      renderSearchResults(matches, input.value);
    });

    input.addEventListener("input", (e) => {
      const q = e.target.value;
      const matches = filterZones(q);
      renderSearchResults(matches, q);
    });

    document.addEventListener("click", (e) => {
      if (
        input &&
        dropdown &&
        !input.contains(e.target) &&
        !dropdown.contains(e.target)
      ) {
        dropdown.classList.add("hidden");
      }
    });
  });
}

function openDrawer() {
  const drawer = document.getElementById("spatialDrawer");
  const backdrop = document.getElementById("drawerBackdrop");
  document.body.classList.add("drawer-open");
  if (drawer) {
    drawer.style.transform = "";
    drawer.style.transition = "";
    drawer.classList.add("is-open");
    drawer.classList.remove("is-expanded");
  }
  if (backdrop) {
    backdrop.style.opacity = "";
    backdrop.style.transition = "";
    backdrop.classList.add("is-visible");
  }
}

function closeDrawer() {
  currentDrawerStage = 1;
  dismissNearbyFriendsNotice();
  document.body.classList.remove("drawer-open");
  if (activeAnalysisTimeout) {
    clearTimeout(activeAnalysisTimeout);
    activeAnalysisTimeout = null;
  }

  const drawer = document.getElementById("spatialDrawer");
  const backdrop = document.getElementById("drawerBackdrop");
  if (drawer) {
    drawer.style.transform = "";
    drawer.style.transition = "";
    drawer.classList.remove("is-open", "is-expanded");
  }
  if (backdrop) {
    backdrop.style.opacity = "";
    backdrop.style.transition = "";
    backdrop.classList.remove("is-visible");
  }

  const loadingEl = document.getElementById("drawerLoadingState");
  const drawerHeader = document.getElementById("drawerHeader");
  const drawerBody = document.getElementById("drawerBody");
  if (loadingEl) loadingEl.style.display = "none";
  if (drawerHeader) drawerHeader.classList.remove("hidden");
  if (drawerBody) drawerBody.classList.remove("hidden");

  dismissNearbyFriendsNotice();
  closeFriendsPickerModal();

  clearCommunityFriends();

  if (activeMarker) {
    mapInstance.removeLayer(activeMarker);
    activeMarker = null;
  }
  if (activeSimulationCircle) {
    mapInstance.removeLayer(activeSimulationCircle);
    activeSimulationCircle = null;
  }
  if (activeMissionCircle) {
    mapInstance.removeLayer(activeMissionCircle);
    activeMissionCircle = null;
  }
  if (mapInstance) {
    mapInstance.closePopup();
  }
  activeCitizenMission = null;
  selectedCitizenMissionMarker = null;
  activeZone = null;
  selectedMissionFriends = [];
  renderSelectedMissionFriendsChips();
}

function toggleDrawerMobile() {
  const drawer = document.getElementById("spatialDrawer");
  if (!drawer) return;
  drawer.style.transform = "";
  drawer.style.transition = "";
  if (!drawer.classList.contains("is-open")) {
    openDrawer();
  } else {
    drawer.classList.toggle("is-expanded");
  }
}

function initDrawerTouchGestures() {
  const drawer = document.getElementById("spatialDrawer");
  const backdrop = document.getElementById("drawerBackdrop");
  if (!drawer) return;

  const dragPill = drawer.querySelector(".drawer-drag-pill");
  const header = drawer.querySelector(".drawer-header");

  let startY = 0;
  let currentY = 0;
  let startTime = 0;
  let isDragging = false;

  const handleTouchStart = (e) => {
    if (window.innerWidth > 860) return;
    if (!drawer.classList.contains("is-open")) return;
    startY = e.touches[0].clientY;
    currentY = startY;
    startTime = Date.now();
    isDragging = true;
    drawer.style.transition = "none";
    if (backdrop) backdrop.style.transition = "none";
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    currentY = e.touches[0].clientY;
    const deltaY = currentY - startY;
    const isExpanded = drawer.classList.contains("is-expanded");

    if (deltaY > 0) {
      drawer.style.transform = `translateY(${deltaY}px)`;
      if (backdrop) {
        const factor = Math.max(0, 1 - deltaY / 320);
        backdrop.style.opacity = factor.toString();
      }
    } else if (deltaY < 0) {
      if (!isExpanded) {
        drawer.style.transform = `translateY(${deltaY}px)`;
      } else {
        drawer.style.transform = `translateY(${deltaY * 0.25}px)`;
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    const deltaY = currentY - startY;
    const elapsed = Date.now() - startTime;
    const velocity = deltaY / (elapsed || 1);
    const isExpanded = drawer.classList.contains("is-expanded");

    drawer.style.transition = "";
    drawer.style.transform = "";
    if (backdrop) {
      backdrop.style.transition = "";
      backdrop.style.opacity = "";
    }

    if (!isExpanded) {
      if (velocity > 0.45 || deltaY > 80) {
        closeDrawer();
      } else if (velocity < -0.35 || deltaY < -50) {
        drawer.classList.add("is-expanded");
      }
    } else {
      if (velocity > 0.6 || deltaY > 200) {
        closeDrawer();
      } else if (velocity > 0.3 || deltaY > 60) {
        drawer.classList.remove("is-expanded");
      }
    }

    startY = 0;
    currentY = 0;
  };

  [dragPill, header].filter(Boolean).forEach((el) => {
    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });
    el.addEventListener("touchcancel", handleTouchEnd, { passive: true });
  });
}

function initOnboarding() {
  const banner = document.getElementById("onboardingBanner");
  const dismissBtn = document.getElementById("dismissOnboardingBtn");
  if (!banner || !dismissBtn) return;

  const isDismissed = localStorage.getItem("teduh_onboarding_dismissed");
  if (isDismissed === "true") {
    banner.classList.add("hidden");
  }

  dismissBtn.addEventListener("click", () => {
    banner.classList.add("hidden");
    localStorage.setItem("teduh_onboarding_dismissed", "true");
  });
}

function syncUserProfile() {
  if (typeof TEDUH_DATA === "undefined" || !TEDUH_DATA.getUserData) return;
  const user = TEDUH_DATA.getUserData();
  document.querySelectorAll(".nav-popup-points-value").forEach((el) => {
    el.textContent = `${user.points} Poin`;
  });
  const pointsEl = document.getElementById("userPointsValue");
  if (pointsEl) {
    pointsEl.textContent = `${user.points} Poin`;
  }
}

function checkUrlParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  const zoneParam = urlParams.get("zone");
  const actionParam = urlParams.get("action");

  if (zoneParam) {
    const targetZone = TEDUH_DATA.zones.find(
      (z) =>
        z.id === zoneParam ||
        z.name.toLowerCase().includes(zoneParam.toLowerCase()),
    );
    if (targetZone) {
      setTimeout(() => {
        selectZone(targetZone, false);
        if (actionParam === "mission") {
          takeZoneMission();
        }
      }, 600);
    }
  }

  if (urlParams.get("analyze") === "true" && !zoneParam) {
    const firstHotspot = TEDUH_DATA.zones.find((z) => z.isHotspot);
    if (firstHotspot) {
      setTimeout(() => {
        selectZone(firstHotspot, false);
      }, 400);
    }
  }
}

let mapToastTimeout = null;
function showToast(message) {
  let toast = document.getElementById("teduhToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "teduhToast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }

  clearTimeout(mapToastTimeout);
  toast.textContent = message;
  toast.classList.add("is-visible");

  mapToastTimeout = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2500);
}

function initMapConsoleInteractions() {
  function applyTactilePop(el, scale = 0.94, duration = 160) {
    if (!el) return;
    el.style.transition = `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`;
    el.style.transform = `scale(${scale})`;
    setTimeout(() => {
      el.style.transform = "";
    }, duration);
  }

  const coordsPill = document.querySelector(".map-status-pill.coords");
  if (coordsPill) {
    coordsPill.style.cursor = "pointer";
    coordsPill.setAttribute("title", "Ketuk untuk menyalin koordinat kursor");
    coordsPill.addEventListener("click", () => {
      applyTactilePop(coordsPill, 0.92);
      const dot = coordsPill.querySelector(".map-brand-dot");
      if (dot) {
        dot.style.transition = "transform 220ms cubic-bezier(0.16, 1, 0.3, 1)";
        dot.style.transform = "scale(1.6)";
        setTimeout(() => {
          dot.style.transform = "";
        }, 220);
      }
      const coordsText =
        document.getElementById("mapCoordinates")?.textContent ||
        "-8.6750, 115.2150";
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(coordsText)
          .then(() => {
            showToast(`Koordinat ${coordsText} berhasil disalin ke clipboard.`);
          })
          .catch(() => {
            showToast(`Koordinat: ${coordsText}`);
          });
      } else {
        showToast(`Koordinat: ${coordsText}`);
      }
    });
  }

  const closeDrawerBtn = document.getElementById("closeDrawerBtn");
  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener("click", () => {
      closeDrawerBtn.style.transition = "transform 220ms cubic-bezier(0.16, 1, 0.3, 1)";
      closeDrawerBtn.style.transform = "scale(0.85) rotate(90deg)";
      setTimeout(() => {
        closeDrawerBtn.style.transform = "";
      }, 220);
    });
  }

  const dragPill = document.querySelector(".drawer-drag-pill");
  if (dragPill) {
    dragPill.addEventListener("click", () => {
      dragPill.style.transition = "transform 180ms cubic-bezier(0.16, 1, 0.3, 1)";
      dragPill.style.transform = "scaleY(1.4) scaleX(0.92)";
      setTimeout(() => {
        dragPill.style.transform = "";
      }, 180);
    });
  }

  const dismissBtn = document.getElementById("dismissOnboardingBtn");
  if (dismissBtn) {
    dismissBtn.addEventListener("click", () => {
      const banner = document.getElementById("onboardingBanner");
      if (banner) {
        banner.style.transition = "transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.28s ease";
        banner.style.transform = "translateY(-18px)";
        banner.style.opacity = "0";
        setTimeout(() => {
          banner.classList.add("hidden");
        }, 280);
      }
    });
  }

  const treeCard = document.querySelector(".drawer-tree-card");
  if (treeCard) {
    treeCard.style.cursor = "pointer";
    treeCard.addEventListener("click", (e) => {
      if (e.target.closest("button, a")) return;
      applyTactilePop(treeCard, 0.97);
      const img = treeCard.querySelector("#treeImage");
      if (img) {
        img.style.transition = "transform 350ms cubic-bezier(0.16, 1, 0.3, 1)";
        img.style.transform = "scale(1.06)";
        setTimeout(() => {
          img.style.transform = "";
        }, 350);
      }
    });
  }

  document.querySelectorAll(".planting-step-row").forEach((row) => {
    row.style.cursor = "pointer";
    row.addEventListener("click", () => {
      applyTactilePop(row, 0.97);
      const num = row.querySelector(".planting-step-num");
      if (num) {
        num.style.transition = "transform 250ms cubic-bezier(0.16, 1, 0.3, 1)";
        num.style.transform = "scale(1.25) rotate(-6deg)";
        setTimeout(() => {
          num.style.transform = "";
        }, 250);
      }
    });
  });

  const actionSelectors = [
    ".btn-primary-action",
    ".btn-secondary-action",
    ".btn-modal-primary-capsule",
    ".btn-modal-ghost-cancel",
    ".btn-confirm-join-solid",
    ".btn-confirm-leave-solid",
    ".btn-confirm-leave-ghost",
    ".btn-open-friends-modal",
    ".btn-side-notice-cta",
    ".btn-side-notice-dismiss",
    ".side-notice-close-btn",
    ".btn-friends-modal-done",
    ".mission-modal-close-btn",
    ".friends-modal-close-btn",
  ];

  document.querySelectorAll(actionSelectors.join(", ")).forEach((btn) => {
    btn.addEventListener("click", () => {
      applyTactilePop(btn, 0.94);
    });
  });

  document.querySelectorAll(".map-dock-item").forEach((item) => {
    item.addEventListener("click", () => {
      const icon = item.querySelector("svg");
      if (icon) {
        icon.style.transition = "transform 220ms cubic-bezier(0.16, 1, 0.3, 1)";
        icon.style.transform = "scale(1.25) translateY(-3px)";
        setTimeout(() => {
          icon.style.transform = "";
        }, 220);
      }
    });
  });

  const notifTriggers = document.querySelectorAll(".nav-notif-trigger");
  notifTriggers.forEach((t) => {
    t.addEventListener("click", () => {
      const svg = t.querySelector("svg");
      if (svg) {
        svg.style.transition = "transform 250ms cubic-bezier(0.16, 1, 0.3, 1)";
        svg.style.transform = "rotate(-12deg)";
        setTimeout(() => {
          svg.style.transform = "rotate(12deg)";
          setTimeout(() => {
            svg.style.transform = "";
          }, 120);
        }, 120);
      }
      const popup = t
        .closest(".nav-notif-wrapper")
        ?.querySelector(".nav-notif-popup");
      if (popup && popup.classList.contains("is-open")) {
        popup.style.transition = "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease";
        popup.style.opacity = "1";
        popup.style.transform = "translateY(0) scale(1)";
      }
    });
  });

  const profileTriggers = document.querySelectorAll(".nav-profile-trigger");
  profileTriggers.forEach((t) => {
    t.addEventListener("click", () => {
      const avatar = t.querySelector(".nav-profile-avatar");
      if (avatar) {
        applyTactilePop(avatar, 1.12);
      }
      const popup = t
        .closest(".nav-profile-wrapper")
        ?.querySelector(".nav-profile-popup");
      if (popup && popup.classList.contains("is-open")) {
        popup.style.transition = "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease";
        popup.style.opacity = "1";
        popup.style.transform = "translateY(0) scale(1)";
      }
    });
  });
}

window.selectZone = selectZone;
window.openDrawer = openDrawer;
window.closeDrawer = closeDrawer;
window.switchDrawerStage = switchDrawerStage;
window.handlePopupMissionAction = handlePopupMissionAction;
window.showZoneActions = showZoneActions;
window.backToAnalysis = backToAnalysis;
window.copyZoneCoords = copyZoneCoords;
window.focusDonutFactor = focusDonutFactor;
window.setTreeSimulationCount = setTreeSimulationCount;
window.toggleActionStep = toggleActionStep;
window.toggleDrawerMobile = toggleDrawerMobile;
window.runThermalSimulation = runThermalSimulation;
window.takeZoneMission = takeZoneMission;
window.openMissionConfirmModal = openMissionConfirmModal;
window.closeMissionConfirmModal = closeMissionConfirmModal;
window.confirmTakeZoneMission = confirmTakeZoneMission;
window.renderPollutionLayers = renderPollutionLayers;
window.renderPresetMarkers = renderPresetMarkers;
window.syncUserProfile = syncUserProfile;
window.toggleMissionFriend = toggleMissionFriend;
window.renderSelectedMissionFriendsChips = renderSelectedMissionFriendsChips;
window.updateThermalZoomState = updateThermalZoomState;
window.showNearbyFriendsNotice = showNearbyFriendsNotice;
window.dismissNearbyFriendsNotice = dismissNearbyFriendsNotice;
window.openFriendsPickerModal = openFriendsPickerModal;
window.closeFriendsPickerModal = closeFriendsPickerModal;
window.filterFriendsModalList = filterFriendsModalList;
window.renderFriendsModalList = renderFriendsModalList;
window.renderCitizenMissions = renderCitizenMissions;
window.selectCitizenMission = selectCitizenMission;
window.joinCitizenMission = joinCitizenMission;
window.promptJoinCitizenMission = promptJoinCitizenMission;
window.openJoinConfirmModal = openJoinConfirmModal;
window.closeJoinConfirmModal = closeJoinConfirmModal;
window.confirmJoinCitizenMission = confirmJoinCitizenMission;
window.promptLeaveCitizenMission = promptLeaveCitizenMission;
window.openLeaveConfirmModal = openLeaveConfirmModal;
window.closeLeaveConfirmModal = closeLeaveConfirmModal;
window.confirmLeaveCitizenMission = confirmLeaveCitizenMission;
window.leaveCitizenMission = leaveCitizenMission;
window.renderUserActiveMissionPin = renderUserActiveMissionPin;
window.selectUserActiveMission = selectUserActiveMission;
window.getUserActiveMissionForZone = getUserActiveMissionForZone;
window.openZoneDrawerFromPopup = openZoneDrawerFromPopup;
window.handleMapPopupCardClick = handleMapPopupCardClick;
window.initMapConsoleInteractions = initMapConsoleInteractions;
