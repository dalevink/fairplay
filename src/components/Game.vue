<template>
    <div class="game">

        <div
                class="top-buttons"
                v-show="gameState == 0"
        >
            <button
                    class="button-large button-large-on"
                    @click="startGame()"
            >
                Start a New Match
            </button>
        </div>

        <div
                class="top-buttons"
                v-show="gameState == 1"
        >
            <button
                    class="button-large button-large-min"
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
                    class="button-large button-large-min"
                    @click="resumePlay()"
            >
                Start Play
            </button>
        </div>

        <h1
                class="top-buttons heading"
                v-show="gameState == 3"
        >
            End of Play
        </h1>

        <section
                v-if="gameState > 0"
        >
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
                    :class="{ 'time-paused-paused': gameState == 2, 'time-paused-paused-flash': gameState == 2 && currentPaused % 2 }"
                >
                    Play Stopped for {{ currentPaused | formatTime }}
                </div>
            </section>
        </section>

        <team
                v-if="gameState === -2"
        ></team>

        <section
                v-if="gameState > -1"
        >
            <transition-group name="anim-list" tag="ul" class="players">
                <li class="player"
                    v-for="player in playersFiltered"
                    :key="player.id"
                    :class="{ 'player-on': player.isOn === 1, 'player-time-stopped': gameState != 1 }"
                    @click="clickPlayer(player)"
                >
                    <strong class="player-name">{{ player.playerName }}</strong>
                    <span class="player-seconds">{{ player.secondsOn | formatTime }}</span>
                </li>
            </transition-group>

        </section>

        <div
                class="top-buttons"
                v-show="gameState == 2"
        >
            <button
                    class="button-large button-large-off"
                    @click="endGame()"
            >
                End Game
            </button>
        </div>

        <div
                class="top-buttons"
                v-show="gameState == 0"
        >
            <button
                    class="button-large button-large-min"
                    @click="editPlayers()"
            >
                Add or Change Players
            </button>
        </div>
        <div
                class=""
                v-show="gameState == -2 && players2.length > 0"
        >
            <button
                    class="button-large button-large-on"
                    @click="savePlayers()"
            >
                Done Editing,
                {{ players2.length }} Player{{ players2.length | pluralize }}…
            </button>
        </div>

        <div
                class="top-buttons"
                v-show="gameState == 3"
        >
            <button
                    class="button-large button-large-min"
                    @click="clearGame()"
            >
                Clear Game and Start Over
            </button>
        </div>

        <section
                v-if="gameState > -1 && logList.length"
        >
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
                        {{ log['logTime'] | formatTime }} {{ log['logPlayer'].playerName }} {{ log | logFormatDesc }}
                        <span class="sub-log-right">
                            {{ log['logTotalOn'] | logFormatTime }}
                        </span>
                    </strong>
                </li>
            </ul>
        </section>

    </div>
</template>

<script>
  import naturalSort from 'javascript-natural-sort'
  import Team from './Team.vue'
  import localStore from '../localStore'

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

  let newGame = function () {
    let d = localStore.fetch()
    // console.log(d)
    return d
  }

  export default {
    data () {
      let o = newGame()
      o.gameState = o.players2.length > 1 ? 0 : -2
      return o
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
        let off = this.players2.filter(function (p) {
          return p.isOn !== 1
        }).sort(this.timeSort)
        let on = this.players2.filter(function (p) {
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
      savePlayers () {
        this.gameState = 0
      },
      editPlayers () {
        this.gameState = -2
        // console.log(this.gameState)
      },
      clearGame () {
        Object.assign(this.$data, localStore.resetGame())
      },
      calcTime (state) {
        this.gameState = state
        let now = timeRounded(this.timeSync)
        let dif = this.secDif(this.timeStart, now)
        this.timeStart = timeRounded(this.timeSync)
        if (state === 1 || state === 3) {
          this.totalPaused += dif
          let now = timeRounded(this.timeSync)
          this.players2.forEach((v, i) => {
            v.start = now
          })
        } else {
          this.totalGameTime += dif
          this.players2.forEach((v, i) => {
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
        this.players2.forEach((v, i) => {
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
      this.players2.sort(naturalSort)
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
        padding: @grid3;
        border: 1px solid white;
        border-radius: 2px;
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
        background: mix(whitesmoke, @colorOff1, 30%);
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
        color: @colorOff4;
        transition: .5s ease color;
    }
    .time-paused-paused-flash {
        color: @colorPause3;
        transition: .5s ease color;
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
