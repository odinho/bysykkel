export default class Station {
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
