import Station from './station.js'


export default class StationManager extends Map {
  constructor(createStations, modeSwitch) {
    super()
    this.onCreateStations = createStations
    this.modeSwitch = modeSwitch
    this.marker_ = null

    modeSwitch.onmodeswitch = this.setMode_.bind(this)
    this.updateAvailabilityBound_ = this.updateAvailability_.bind(this);
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

  setMode_(mode) { this.forEach(s => s.setMode(mode)) }

  getStations_() {
    return StationManager.apiFetch('/stations')
      .then(json => {
        console.log('stations reply', json)
        if (json.stations)
          return json.stations
      })
  }

  addStations_(stations) {
    let icon = L.divIcon({html: '-', className: 'bys-icon'})
    stations.forEach(station => {
      this.set(station.id, new Station(station, icon, this.modeSwitch.mode))
    })
  }

  updateAvailability_() {
    return StationManager.apiFetch('/stations/availability')
      .then(json => {
        json.stations.forEach(station => {
          var s = this.get(station.id)
          if (s)
            s.updateAvailability(station.availability)
        })
        let refresh_in = (json.refresh_rate||20) * 1000
        setTimeout(this.updateAvailabilityBound_, refresh_in)
      })
  }

  static apiFetch(url) {
    return fetch('https://cors-anywhere.herokuapp.com/https://oslobysykkel.no/api/v1'+url, {
      headers: {'Client-Identifier': 'b71ab9ce8b790201981ff173e951966d'},
    })
    .then(response => response.json())
  }
}
