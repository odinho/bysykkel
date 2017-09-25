import L from 'leaflet'

document.addEventListener('DOMContentLoaded', ()=>{
  window.m = new BysMap('map')
})

class BysMap {
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
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      maxZoom: 17,
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    	  '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    	id: 'mapbox.streets',
    	accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
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

class StationManager extends Map {
  constructor(createStations, updateStations) {
    super()
    this.onCreateStations = createStations
    this.onUpdateStations = updateStations
    this.marker_ = null

    this.ready = this.init_()
  }

  init_() {
    return this.getStations_()
      .then(stations => this.addStations_(stations))
      .then(() => {
        this.onCreateStations(this)
        return this.updateAvailability_()
      })
  }

  getStations_() {
    return fetch('https://cors-anywhere.herokuapp.com/https://oslobysykkel.no/api/v1/stations', {
        headers: {'Client-Identifier': 'b71ab9ce8b790201981ff173e951966d'},
      })
      .then(response => response.json())
      .then(json => {
        console.log('stations reply', json)
        if (json.stations)
          return json.stations
      })
  }

  addStations_(stations) {
    let icon = L.divIcon({html: '-', className: 'bys-icon'})
    stations.forEach(station => {
      this.set(station.id, new Station(station, icon))
    })
  }

  updateAvailability_() {
    return fetch('https://cors-anywhere.herokuapp.com/https://oslobysykkel.no/api/v1/stations/availability', {
        headers: {'Client-Identifier': 'b71ab9ce8b790201981ff173e951966d'},
      })
      .then(response => response.json())
      .then(json => {
        console.log('avail reply', json)
        json.stations.forEach(station => {
          var s = this.get(station.id)
          if (s)
            s.updateAvailability(station.availability)
        })
      })
  }
}

class Station {
  constructor(station, icon) {
    this.data = station
    this.icon_ = icon

    this.availability_ = null
    this.marker_ = null
  }

  get marker() {
    if (!this.marker_)
      this.marker_ = L.marker(this.latlong, {icon: this.icon_});
    return this.marker_
  }

  get latlong() {
    return [this.data.center.latitude, this.data.center.longitude]
  }

  updateAvailability(a) {
    let org = this.availability_
    this.availability_ = a
    if (!org)
      this.updated_(a)
    else {
      if (org.bikes != a.bikes || org.locks != a.locks)
        this.updated_(a, org)
    }
  }

  updated_(now, before) {
    let m = this.marker
    this.icon_.options.html = ''+now.bikes
    this.icon_.options.className = now.bikes == 1 ? 'bys-icon bys-low' :
        (now.bikes == 0 ? 'bys-icon bys-empty' : 'bys-icon bys-ok')
    this.marker.setIcon(this.icon_)
  }
}
