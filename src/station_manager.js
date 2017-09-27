import Station from './station.js'


export default class StationManager extends Map {
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
