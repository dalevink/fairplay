// localStorage persistence

let STORAGE_KEY = 'teamV057'
var uid = 100
var t

export default {
  fetch: function () {
    if (t === undefined) {
      t = JSON.parse(localStorage.getItem(STORAGE_KEY)) || { players2: [] }
    }
    return t
  },
  newPlayer: function (name) {
    return {
      id: uid++,
      playerName: name,
      start: 0,
      secondsOn: 0,
      totalOn: 0,
      totalOff: 0,
      sessionOn: 0,
      sessionOff: 0,
      isOn: -1
    }
  },
  save: function (data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }
}
