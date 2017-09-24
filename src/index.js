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
  window.m = new Map('map')
})

class Map {
  constructor(mapId) {
    this.mapId = mapId
    this.map = null

    this.init()

    this.gotLocBound_ = this.gotLoc.bind(this)
  }

  init() {
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
    this.map.locate({watch: true, setView:true})
    if ('geolocation' in navigator) {
      console.log('gl',this.gotLocBound_);
      navigator.geolocation.getCurrentPosition(this.gotLoc.bind(this));
    }
  }

  gotLoc(position) {
    console.log('yo', position);
    console.log(`pos ${position.coords.latitude}, ${position.coords.longitude}`);
  }
}
