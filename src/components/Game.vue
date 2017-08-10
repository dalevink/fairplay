<template>
    <div class="game">

        <h3 class="crumb">
            <router-link to="/">&larr; Done</router-link>
        </h3>
        <div class="clear"></div>

        <span>
            {{ currentGameTime | formatTime }}
            Game Time
        </span>
        <span v-show="currentPaused > 0">
            {{ currentPaused | formatTime }}
            Time Paused
        </span>
        <div
                v-show="gameState == 0"
        >
            <h1>New Game</h1>
            <button
                    class=""
                    @click="startGame()"
            >
                Start Game</button>
        </div>

        <div
                v-show="gameState == 1"
        >
            <h1>Game On!</h1>
            <button
                    @click="pausePlay()"
            >
                Stop Play</button>
        </div>

        <div
                v-show="gameState == 2"
        >
            <h1>Time Stopped</h1>
            <button
                    @click="resumePlay()"
            >
                Start Play</button>
            <button
                    @click="endGame()"
            >
                End Game</button>
        </div>

        <div
                v-show="gameState == 3"
        >
            <h1>End of Game</h1>
        </div>

        <transition-group name="anim-list" tag="ul" class="players">
            <li class="player"
                v-for="player in playersFiltered"
                :key="player.id"
                :class="{ 'player-on': player.isOn === 1  }"
                @click="clickPlayer(player)"
            >
                <strong class="player-name">{{ player.name }}</strong>
                <span class="player-seconds">{{ player.secondsOn | formatTime }}</span>
            </li>
        </transition-group>

        <section v-show="logList.length">
            <h3>Recent Sub{{ logList.length | pluralize }}</h3>
            <ul class="sub-log">
                <li class="log"
                    v-for="log in logList"
                    :key="logList['id']"
                >
                    <strong class="player-name">{{ log['player'].name }} {{ log | what }}</strong>
                </li>
            </ul>
        </section>
    </div>
</template>

<script>
  import naturalSort from 'javascript-natural-sort'

  var padLeft = function (string, pad, length) {
    return (new Array(length + 1).join(pad) + string).slice(-length)
  }
  function timeRounded (syncWith) {
    let now = new Date().getTime()
    // Get time difference and round to nearest second
    let dif = Math.round((now - syncWith) / 1000) * 1000
    return new Date(syncWith + dif).getTime()
  }
  const gameStates = {
    0: 'New Game',
    1: 'Play Started',
    2: 'Play Started',
    3: 'Game Ended'
  }
  console.log(gameStates)

  var formatTime = function (secs) {
    let min = Math.floor(secs / 60)
    let sec = secs - min * 60
    return min + ':' + padLeft(sec, '0', 2)
  }

  export default {
    name: 'game',
    data () {
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
        players: []
      }
    },
    beforeCreate () {
      if (this.timeSync === 0) {
        this.timeSync = new Date().getTime()
      }
    },

    computed: {
      playersFiltered () {
        let off = this.players.filter(function (p) {
          return p.isOn !== 1
        }).sort(this.timeSort)
        let on = this.players.filter(function (p) {
          return p.isOn === 1
        }).sort(this.timeSort)
        return off.concat(on)
      }
    },
    filters: {
      formatTime: function (secs) {
        return formatTime(secs)
      },
      pluralize: function (n) {
        return n === 1 ? '' : 's'
      },
      what: function (log) {
        let howLong = log['logDif'] > 10 ? formatTime(log['logDif']) : ''
        let what = log['logIsOn'] === 1 ? 'On' : 'Off'
        return what + ' ' + howLong
      }
    },
    methods: {
      // Start / End Game + Pause / Resume Play
      startGame () {
        this.gameState = 1
        this.timeStart = timeRounded(this.timeSync)
      },
      pausePlay () {
        this.calcTime(2)
      },
      resumePlay () {
        this.calcTime(1)
      },
      endGame () {
        this.calcTime(3)
      },
      calcTime (state) {
        this.gameState = state
        let now = timeRounded(this.timeSync)
        let dif = this.secDif(this.timeStart, now)
        this.timeStart = timeRounded(this.timeSync)
        if (state === 1 || state === 3) {
          this.totalPaused += dif
        } else {
          this.totalGameTime += dif
        }
      },
      timeSort (a, b) {
        return a.secondsOn < b.secondsOn ? 1 : -1
      },
      updateData () {
        var now = timeRounded(this.timeSync)
        this.players.forEach((v, i) => {
          v.secondsOn = v.totalOn
          if (v.isOn === 1) {
            v.secondsOn += this.secDif(v.start, now)
          }
        })
        this.currentGameTime = this.totalGameTime +
          (this.gameState === 1 ? this.secDif(this.timeStart, now) : 0)
        this.currentPaused = this.totalPaused +
          (this.gameState === 2 ? this.secDif(this.timeStart, now) : 0)
      },
      secDif (start, end) {
        return Math.floor((end - start) / 1000)
      },
      clickPlayer (player) {
        let now = timeRounded(this.timeSync)
        let dif = this.secDif(player.start, now)

        player.start = now

        if (player.isOn === 1) {
          player.totalOn += dif
          player.isOn = 0
        } else {
          player.totalOff += dif
          player.isOn = 1
        }

        this.logList.unshift({
          'id': this.logId++,
          'player': player,
          'logTime': now,
          'logIsOn': player.isOn,
          'logDif': dif
        })
      },
      cleanLog (logList, last, now, minSecs) {
        // todo ::
        // We do not want multiple changes to the same Player logged
        // i.e. user made a mistake and quickly corrected (within 30 seconds)
        // ..when found, remove last log of this player and ignore this one
        // let last = this.logList.find(log => log.player === player)
        // if (!last || this.cleanLog(this.logList, last, now, 15)) {
        if (last && ((now - last['logTime']) / 1000) < minSecs) {
          logList.splice(logList.indexOf(last), 1)
          return false
        } else {
          return true
        }
      }
    },
    created () {
      let players = [
        'Luca',
        'Zaid',
        'Ben',
        'Jackson'
      ]
      players.sort(naturalSort)
      players.forEach((name, id) => {
        this.players.push({
          id: id,
          name: name,
          start: timeRounded(this.timeSync),
          secondsOn: 0,
          totalOn: 0,
          totalOff: 0,
          isOn: -1
        })
      })
      this.updateData()
    },
    mounted () {
      window.setInterval(this.updateData, 100)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    .players {
        list-style-type: none;
        padding: 0;
    }

    .player {
        padding: 17px 20px;
        border: 1px solid white;
        border-radius: 4px;
        cursor: pointer;
        background: whitesmoke;
    }

    .player-name {
        font-weight: 500;
        text-align: left;
        min-width: 200px;
    }

    .player-seconds {
        min-width: 200px;
        font-weight: 200;
        text-align: right;
        float: right;
    }

    .player-on {
        border-radius: 2px;
        background: #40a2d9;
        font-weight: 500;
        color: white;
    }
</style>
