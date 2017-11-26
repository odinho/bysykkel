export default class ModeSwitchButton {
  constructor(parent) {
    this.parent_ = parent

    this.mode = 'bikes'
    this.onmodeswitch = null
    this.elm = this.createElement_()
    this.parent_.appendChild(this.elm)
  }

  switchMode_() {
    this.mode = this.mode=='bikes' ? 'locks' : 'bikes'
    this.elm.textContent = `mode: ${this.mode}`
    if (this.onmodeswitch)
      this.onmodeswitch(this.mode)
  }

  createElement_() {
    let elm = document.createElement('div')
    elm.id = 'mode-switch'
    elm.textContent = `mode: ${this.mode}`
    elm.onclick = () => this.switchMode_()
    return elm
  }
}
