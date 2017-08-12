<template>
    <div class="game">

        <div
                class="top-buttons"
                v-show="gameState == 0"
        >
            <button
                    class="large-button large-button-off"
                    @click="startGame()"
            >
                Start Match
            </button>
        </div>

        <div
                class="top-buttons"
                v-show="gameState == 1"
        >
            <button
                    class="large-button large-button-on"
                    @click="pausePlay()"
            >
                Stop Play
            </button>
        </div>

        <div
                class="top-buttons"
                v-show="gameState == 2"
        >
            <button
                    class="large-button large-button-off"
                    @click="resumePlay()"
            >
                Start Play
            </button>
        </div>

        <div
                class="top-buttons"
                v-show="gameState == 3"
        >
            <div class="large-button large-button-disabled">
                End of Play
            </div>
        </div>

        <section
                :class="{ 'is-stopped': gameState != 1, 'is-paused': gameState == 2, 'is-end': gameState == 3 }"
        >
            <div class="time-desc">
                Game Time
            </div>
            <div class="time-large">
                {{ currentGameTime | formatTime }}
            </div>
        </section>
        <section
            :class="{ 'hidden': currentPaused < 1 }"
        >
            <div class="time-paused"
                :class="{ 'time-paused-paused': gameState == 2 && currentPaused % 2 }"
            >
                {{ currentPaused | formatTime }}
                Time Paused
            </div>
        </section>

        <team></team>

        <transition-group name="anim-list" tag="ul" class="players">
            <li class="player"
                v-for="player in playersFiltered"
                :key="player.id"
                :class="{ 'player-on': player.isOn === 1, 'player-time-stopped': gameState != 1 }"
                @click="clickPlayer(player)"
            >
                <strong class="player-name">{{ player.name }}</strong>
                <span class="player-seconds">{{ player.secondsOn | formatTime }}</span>
            </li>
        </transition-group>

        <div
                class="top-buttons"
                v-show="gameState == 2"
        >
            <button
                    class="large-button large-button-end"
                    @click="endGame()"
            >
                End Game
            </button>
        </div>

        <section v-show="logList.length">
            <h4 class="sub-log-title">
                Substitution{{ logList.length | pluralize }}
                <span class="sub-log-title-right">Time On</span>
            </h4>
            <ul class="sub-log">
                <li class="sub-log-li"
                    v-for="log in logList"
                    :key="logList['id']"
                >
                    <strong class="player-name">
                        {{ log['logTime'] | formatTime }} {{ log['logPlayer'].name }} {{ log | logFormatDesc }}
                        <span class="sub-log-right">
                            {{ log['logTotalOn'] | logFormatTime }}
                        </span>
                    </strong>
                </li>
            </ul>
        </section>

        <div
                v-show="gameState == 3"
        >
            <h3 class="crumb">
                <router-link to="/">&larr; Done</router-link>
            </h3>
            <div class="clear"></div>
        </div>
        <div
                v-show="gameState == 0"
        >
            <h3 class="crumb">
                <router-link to="/">&larr; Cancel</router-link>
            </h3>
            <div class="clear"></div>
        </div>

    </div>
</template>

<script>
  import naturalSort from 'javascript-natural-sort'
  import Team from './Team.vue'

  let padLeft = function (string, pad, length) {
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

  let formatTime = function (secs) {
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
    components: {
      Team
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
      logFormatTime: function (secs) {
        return secs > 0 ? formatTime(secs) + '' : 'Starts'
      },
      logFormatDesc: function (log) {
        return log['logTotalOn'] > 0 ? log['logDesc'] : ''
      },
      pluralize: function (n) {
        return n === 1 ? '' : 's'
      }
    },
    methods: {
      // Start / End Game + Pause / Resume Play
      startGame () {
        this.timeStart = timeRounded(this.timeSync)
        this.calcTime(1)
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
          let now = timeRounded(this.timeSync)
          this.players.forEach((v, i) => {
            v.start = now
          })
        } else {
          this.totalGameTime += dif
          this.players.forEach((v, i) => {
            if (v.isOn === 1) {
              v.totalOn += this.secDif(v.start, now)
            } else {
              v.totalOff += this.secDif(v.start, now)
            }
          })
        }
      },
      timeSort (a, b) {
        return a.secondsOn < b.secondsOn ? 1 : -1
      },
      updateData () {
        let now = timeRounded(this.timeSync)
        this.players.forEach((v, i) => {
          v.secondsOn = v.totalOn
          if (v.isOn === 1 && this.gameState === 1) {
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
        if (this.gameState === 3) {
          return
        }

        let now = timeRounded(this.timeSync)

        // Only apply time when game on
        let dif = 0
        if (this.gameState === 1) {
          dif = this.secDif(player.start, now)
        }
        player.start = now

        if (player.isOn === 1) {
          player.isOn = 0
          player.totalOn += dif
        } else {
          player.isOn = 1
          player.totalOff += dif
        }

        this.logList.unshift({
          'id': this.logId++,
          'logPlayer': player,
          'logTime': this.currentGameTime,
          'logDesc': player.isOn === 1 ? 'On' : 'Off',
          'logTotalOn': player.totalOn
        })
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
          sessionOn: 0,
          sessionOff: 0,
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
<style scoped lang="less">

    @import "../assets/vars";

    .top-buttons {
        margin-top: 25px;
        margin-bottom: 20px;
    }
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
        background: @colorOn3;
        font-weight: 500;
        color: white;
    }
    .player-on.player-time-stopped {
        background: @colorOff1;
    }

    .time-large {
        color: @colorOn3;
        font-weight: 200;
        font-size: 350%;
        width: 100%;
        text-align: center;
        line-height: 1;
        transition: .5s ease color;
    }
    .time-desc {
        color: mix(@colorOn3, black, 80%);
        font-size: 90%;
        line-height: 1;
        width: 100%;
        text-align: center;
        transition: .5s ease color;
    }
    .time-paused {
        color: @colorOff1;
        font-size: 90%;
        line-height: 1;
        width: 100%;
        text-align: center;
        transition: .2s ease color;
    }
    .is-stopped {
        .time-desc,
        .time-large {
            color: @colorOff1;
        }
    }
    .is-paused {
        .time-desc,
        .time-large {
            color: @colorPause3;
        }
    }
    .is-end {
        .time-desc,
        .time-large {
            color: black;
        }
    }
    .time-paused-paused {
        color: @colorPause3;
        transition: .5s ease color;
    }

    .large-button-on {
        background: @colorOn3;
        color: white;
    }
    .large-button-disabled {
        background: white;
        color: @colorOff1;
    }
    .large-button-off {
        background: @colorOff2;
        color: white;
    }
    .large-button-end {
        background: @colorPause3;
        color: white;
    }

    .sub-log {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }
    .sub-log-title {
        margin-bottom: 10px;
        padding-left: 9px;
        font-weight: 400;
    }
    .sub-log-title-right {
        margin-bottom: 10px;
        padding-right: 9px;
        font-weight: 400;
        float: right;
        font-size: 87%;
        line-height: 2;
    }
    .sub-log-li {
        padding: 6px 10px;
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        margin-top: -1px;
        font-size: 87%;
        color: @colorOff2;
    }
    .sub-log-right {
        float: right;
    }
</style>
