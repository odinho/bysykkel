export default class ModeSwitchButton {
  constructor(parent, onModeSwitch) {
    this.parent_ = parent
    this.onModeSwitch_ = onModeSwitch

    this.mode = 'bikes'
    this.elm = null
    this.init_()
  }

  init_() {
    this.elm = this.createElement_()
    this.parent_.appendChild(this.elm)
  }

  switchMode() {
    this.mode = this.mode=='bikes' ? 'locks' : 'bikes'
    this.elm.textContent = `mode: ${this.mode}`
    if (this.onModeSwitch_)
      this.onModeSwitch_(this.mode)
  }

  createElement_() {
    let elm = document.createElement('div')
    elm.id = 'mode-switch'
    elm.textContent = `mode: ${this.mode}`
    elm.onclick = () => this.switchMode()
    return elm
  }
}
