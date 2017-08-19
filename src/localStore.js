// localStorage persistence

let STORAGE_KEY = 'teamV00002'
let uid = 100
let t

export default {
  newData (players) {
    return {
      gameState: 0,

      totalGameTime: 0,
      currentGameTime: 0,
      totalPaused: 0,
      currentPaused: 0,

      timeStart: 0,

      timeSync: 0,
      logId: 0,
      logList: [],

      players2: players || []
    }
  },
  resetGame () {
    t = this.newData(t.players2.map(player => this.newPlayer(player.playerName, player.id)))
    return t
  },
  fetch () {
    if (t === undefined) {
      t = JSON.parse(localStorage.getItem(STORAGE_KEY)) || this.newData()
    }
    return t
  },
  newPlayer: function (name, id) {
    return {
      id: id !== undefined ? id : uid++,
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
  save () {
    if (t !== undefined) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(t))
    }
  }
}
