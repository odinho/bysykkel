import _ from 'lodash'
import L from 'leaflet'

function component() {
  let element = document.createElement('div')
  element.innerHTML = _.join(['Hello', 'webpack'])
  return element
}

let locks = _.range(30).map(n=>L.divIcon({html: ''+n, className: 'bys-locks'}))
let bikes = _.range(30).map(n=>L.divIcon({html: ''+n, className: 'bys-bikes'}))
bikes[0].options.className += ' bys-empty'
locks[0].options.className += ' bys-empty'

document.addEventListener('DOMContentLoaded', ()=>{
  document.body.appendChild(component())
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
    this.stations = new StationManager(this.onCreateStations_.bind(this))
    return this.stations.ready
  }

  initMap_() {
    this.map = L.map(this.mapId).setView([51.505, -0.1], 13)
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    	  '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    	id: 'mapbox.streets',
    	accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
    }).addTo(this.map);
    let marker = L.marker([51.5, -0.09], {icon: bikes[1]}).addTo(this.map);
    window.marker = marker
    this.map.locate({watch: true, setView:true})
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(this.gotLoc_.bind(this));
    }
  }

  onCreateStations_() {
    this.stations.forEach(station => {
      station.marker.addTo(this.map)
      window.marker2 = station.marker
    })
  }

  gotLoc_(position) {
    console.log('yo', position);
    console.log(`pos ${position.coords.latitude}, ${position.coords.longitude}`);
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
      .then(() => this.onCreateStations(this))
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
    stations.forEach(station => {
      this.set(station.id, new Station(station))
    })
  }
}

class Station {
  constructor(station) {
    this.data = station

    this.marker_ = null
  }

  get marker() {
    if (!this.marker_)
      this.marker_ = L.marker(this.latlong, {icon: bikes[1]});
    return this.marker_
  }

  get latlong() {
    return [this.data.center.latitude, this.data.center.longitude]
  }
}
