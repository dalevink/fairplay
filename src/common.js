
import store from './store'

let KEY = 'teamV0100'
let t

export default {

  EDIT: 0,
  START: 1,
  PLAYING: 2,
  PAUSED: 3,
  END: 4,

  fetch (old) {
    if (t === undefined) {
      t = JSON.parse(localStorage.getItem(KEY)) || old
    }
    return t
  },
  save (current) {
    localStorage.setItem(KEY, JSON.stringify(current))
  },

  newPlayer: function (name, id) {
    return {
      id: id !== undefined ? id : store.data.uid ++,
      playerName: name,
      start: 0,
      secondsOn: 0,
      totalOn: 0,
      totalOff: 0,
      sessionOn: 0,
      sessionOff: 0,
      isOn: -1
    }
  }
}
