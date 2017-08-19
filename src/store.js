
let KEY = 'teamV00004'
let uid = 100
let t

export default {
  EDIT: 0,
  START: 1,
  PLAYING: 2,
  PAUSED: 3,
  END: 4,

  newData (players) {
    return {
      gameState: this.START,

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
      t = JSON.parse(localStorage.getItem(KEY)) || this.newData()
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
      localStorage.setItem(KEY, JSON.stringify(t))
    }
  }
}
