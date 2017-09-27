import L from 'leaflet'

import StationManager from './station_manager.js'


export default class BysMap {
  constructor(mapId) {
    this.mapId = mapId

    this.map = null
    this.stations = null

    this.ready = this.init_()
  }

  init_() {
    this.initMap_()
    this.map.on('locationfound', this.locationFound_.bind(this))
    this.stations = new StationManager(this.onCreateStations_.bind(this))
    return this.stations.ready
  }

  initMap_() {
    this.map = L.map(this.mapId).setView([59.92, 10.75], 13)
    L.tileLayer(BysMap.MAP_URL, {
      maxZoom: 17,
      attribution: 'Map data © <a href="http://openstreetmap.org">' +
        'OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/"> ' +
        'CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    }).addTo(this.map);
    this.map.locate({setView: true, maxZoom: 15})
  }

  locationFound_(ev) {
    let radius = ev.accuracy / 2
    this.circle_ = L.circle(ev.latlng, {radius})
    this.circle_.addTo(this.map)

    navigator.geolocation.watchPosition(
      this.locationUpdate_.bind(this), null,
      {timeout: 10000, highAccuracy: true})
  }

  locationUpdate_(pos) {
    let radius = pos.coords.accuracy / 2
    let latlng = new L.LatLng(pos.coords.latitude, pos.coords.longitude)
    this.circle_.setRadius(radius)
    this.circle_.setLatLng(latlng)
  }

  onCreateStations_() {
    this.stations.forEach(station => {
      station.marker.addTo(this.map)
    })
  }
}
BysMap.MAP_URL =
  'https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png' +
  '?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYyc' +
  'XBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
