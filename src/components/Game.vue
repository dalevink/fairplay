<template>
    <div class="game">

        <h3 class="crumb">
            <router-link to="/">&larr; Done</router-link>
        </h3>
        <div class="clear"></div>

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

        <section>
        </section>
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
                    :key="logList[0]"
                >
                    <strong class="player-name">{{ log[2].name }} {{ log | what }}</strong>
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
  function dateRounded (syncWith) {
    let now = new Date().getTime()
    // Get time difference and round to nearest second
    let dif = Math.round((now - syncWith) / 1000) * 1000
    return new Date(syncWith + dif)
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
      },
      logMax () {
        return this.logList.splice(6)
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
        let howLong = log[3] > 10 ? formatTime(log[3]) : ''
        let what = ''
        if (log[1] < 1) {
          what = 'Starts'
        } else {
          what = log[1] === 0 ? 'On' : 'Off'
        }
        return what + ' ' + howLong
      }
    },
    methods: {
      // Start / End Game + Pause / Resume Play
      startGame () {
        this.gameState = 1
      },
      pausePlay () {
        this.gameState = 2
      },
      resumePlay () {
        this.gameState = 1
      },
      endGame () {
        this.gameState = 3
      },

      timeSort (a, b) {
        return a.secondsOn < b.secondsOn ? 1 : -1
      },
      updateData () {
        var now = dateRounded(this.timeSync)
        this.players.forEach((v, i) => {
          let total = 0
          if (v.isOn === 1) {
            total += this.secDif(v.start, now)
          }
          total += v.totalSecondsOn
          v.secondsOn = total
        })
      },
      secDif (start, end) {
        return Math.floor((end - start) / 1000)
      },
      clickPlayer (player) {
        let dif = 0
        let now = dateRounded(this.timeSync)
        dif = this.secDif(player.start, now)
        if (player.isOn === 1) {
          player.totalSecondsOn += dif
          player.isOn = 0
        } else {
          player.isOn = 1
        }
        player.start = now

        // We do not want multiple changes to the same Player logged
        // i.e. user made a mistake and quickly corrected (within 30 seconds)
        let lastI = this.getLastLog(player.id, now, 15)
        if (lastI > -1) {
            // ..when found, remove last log of this player and ignore this one
          this.logList.splice(lastI, 1)
        } else {
          this.logList.unshift([ this.logId++, player.totalSecondsOn, player, dif, now ])
        }
      },
      getLastLog (id, now, minSecs) {
        let last = this.logList.find(log => log[2].id === id)
        if (last && ((now.getTime() - last[4].getTime()) / 1000) < minSecs) {
          return this.logList.indexOf(last)
        } else {
          return -1
        }
      }
    },
    created () {
      let players = [
        'Luca',
        'Liam',
        'Jai',
        'Zaid',
        'George',
        'Ben',
        'William',
        'Jackson'
      ]
      players.sort(naturalSort)
      players.forEach((name, id) => {
        this.players.push({
          id: id,
          name: name,
          start: dateRounded(this.timeSync),
          secondsOn: 0,
          totalSecondsOn: 0,
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
