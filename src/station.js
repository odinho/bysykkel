export default class Station {
  constructor(station, icon, mode) {
    this.data = station
    this.icon_ = icon
    this.mode_ = mode || 'bikes'

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

  setMode(mode) {
    this.mode_ = mode
    this.updated_(this.availability_)
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
    this.icon_.options.html = ''+now[this.mode_]
    this.icon_.options.className = now[this.mode_] == 1 ? 'bys-icon bys-low' :
        (now[this.mode_] == 0 ? 'bys-icon bys-empty' : 'bys-icon bys-ok')
    this.marker.setIcon(this.icon_)
  }
}
