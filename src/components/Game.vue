<template>
    <div class="game">
        <div
                class="top-buttons"
                v-show="sharedStore.gameState == common.START"
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
                v-show="sharedStore.gameState == common.PLAYING"
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
                v-show="sharedStore.gameState == common.PAUSED"
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
                v-show="sharedStore.gameState == common.END"
        >
            End of Play
        </h1>

        <section
                v-if="sharedStore.gameState > common.START"
        >
            <section
                    :class="{ 'is-stopped': sharedStore.gameState != common.PLAYING, 'is-paused': sharedStore.gameState == common.PAUSED, 'is-end': sharedStore.gameState == common.END }"
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
                    :class="{ 'time-paused-paused': sharedStore.gameState == common.PAUSED, 'time-paused-paused-flash': sharedStore.gameState == common.PAUSED && currentPaused % 2 }"
                >
                    Play Stopped for {{ currentPaused | formatTime }}
                </div>
            </section>
        </section>

        <team
                v-if="sharedStore.gameState === common.EDIT"
        ></team>

        <section
                v-if="sharedStore.gameState >= common.START"
        >
            <transition-group name="anim-list" tag="ul" class="players">
                <li class="player"
                    v-for="player in playersFiltered"
                    :key="player.id"
                    :class="{ 'player-on': player.isOn === 1, 'player-time-stopped': sharedStore.gameState != common.PLAYING }"
                    @click="clickPlayer(player)"
                >
                    <strong class="left-col player-name">{{ player.playerName }}</strong>
                    <span class="right-col player-seconds">{{ player.secondsOn | formatTime }}</span>
                </li>
            </transition-group>

        </section>

        <div
                class="top-buttons"
                v-show="sharedStore.gameState == common.PAUSED"
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
                v-show="sharedStore.gameState == common.START"
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
                v-show="sharedStore.gameState == common.EDIT && sharedStore.players3.length > 0"
        >
            <button
                    class="button-large button-large-on"
                    @click="savePlayers()"
            >
                Done Editing,
                {{ sharedStore.players3.length }} Player{{ sharedStore.players3.length | pluralize }}…
            </button>
        </div>

        <div
                class="top-buttons"
                v-show="sharedStore.gameState == common.END"
        >
            <button
                    class="button-large button-large-min"
                    @click="clearGame()"
            >
                Clear Game and Start Over
            </button>
        </div>

        <section
                v-if="sharedStore.gameState >= common.START && sharedStore.logList.length"
        >
            <h4 class="sub-log-title">
                Substitution{{ sharedStore.logList.length | pluralize }}
                <span class="sub-log-title-right">Time On</span>
            </h4>
            <ul class="sub-log">
                <li class="sub-log-li"
                    v-for="log in sharedStore.logList"
                    :key="sharedStore.logList['id']"
                >
                    <strong class="left-col player-name">
                        {{ log['logTime'] | formatTime }} {{ log['logPlayer'].playerName }} {{ log | logFormatDesc }}
                    </strong>
                    <span class="right-col">
                        {{ log['logTotalOn'] | logFormatTime }}
                    </span>
                </li>
            </ul>
        </section>

    </div>
</template>

<script>
  import naturalSort from 'javascript-natural-sort'
  import Team from './Team.vue'
  import store from '../store'
  import common from '../common'

  let padLeft = function (string, pad, length) {
    return (new Array(length + 1).join(pad) + string).slice(-length)
  }
  function timeRounded (syncWith) {
    let now = new Date().getTime()
    // Get time difference and round to nearest second
    let dif = Math.round((now - syncWith) / 1000) * 1000
    return new Date(syncWith + dif).getTime()
  }
  let formatTime = function (secs) {
    let min = Math.floor(secs / 60)
    let sec = secs - min * 60
    return min + ':' + padLeft(sec, '0', 2)
  }

  export default {

    data () {
      let o = {
        currentGameTime: 0,
        currentPaused: 0,
        timeSync: 0
      }
      o.common = common
      o.sharedStore = store.data
      return o
    },
    components: {
      Team
    },
    beforeCreate () {
    },

    computed: {
      playersFiltered () {
        let off = this.sharedStore.players3.filter(function (p) {
          return p.isOn !== 1
        }).sort(this.timeSort)
        let on = this.sharedStore.players3.filter(function (p) {
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
        this.sharedStore.timeStart = timeRounded(this.sharedStore.timeSync)
        this.calcTime(common.PLAYING)
      },
      pausePlay () {
        this.calcTime(common.PAUSED)
      },
      resumePlay () {
        this.calcTime(common.PLAYING)
      },
      endGame () {
        this.calcTime(common.END)
      },
      savePlayers () {
        this.sharedStore.gameState = common.START
      },
      editPlayers () {
        this.sharedStore.gameState = common.EDIT
        // console.log(this.sharedStore.gameState)
      },
      clearGame () {
        this.sharedStore.gameState = common.START
        this.sharedStore.players3 = this.sharedStore.players3.map(player => common.newPlayer(player.playerName, player.id))
        this.sharedStore.logId = 0
        this.sharedStore.logList = []
        this.sharedStore.timeStart = 0
        this.sharedStore.totalGameTime = 0
        this.sharedStore.totalPaused = 0

        this.currentGameTime = 0
        this.currentPaused = 0
      },
      calcTime (state) {
        this.sharedStore.gameState = state
        let now = timeRounded(this.sharedStore.timeSync)
        let dif = this.secDif(this.sharedStore.timeStart, now)
        this.sharedStore.timeStart = timeRounded(this.sharedStore.timeSync)
        if (this.sharedStore.gameState === common.PLAYING || this.sharedStore.gameState === common.END) {
          this.sharedStore.totalPaused += dif
          let now = timeRounded(this.sharedStore.timeSync)
          this.sharedStore.players3.forEach((v, i) => {
            v.start = now
          })
        } else {
          this.sharedStore.totalGameTime += dif
          this.sharedStore.players3.forEach((v, i) => {
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
        let now = timeRounded(this.sharedStore.timeSync)
        this.sharedStore.players3.forEach((v, i) => {
          v.secondsOn = v.totalOn
          if (v.isOn === 1 && this.sharedStore.gameState === common.PLAYING) {
            v.secondsOn += this.secDif(v.start, now)
          }
        })
        this.currentGameTime = this.sharedStore.totalGameTime +
          (this.sharedStore.gameState === common.PLAYING ? this.secDif(this.sharedStore.timeStart, now) : 0)
        this.currentPaused = this.sharedStore.totalPaused +
          (this.sharedStore.gameState === common.PAUSED ? this.secDif(this.sharedStore.timeStart, now) : 0)
      },
      secDif (start, end) {
        return Math.floor((end - start) / 1000)
      },
      clickPlayer (player) {
        if (this.sharedStore.gameState === common.END) {
          return
        }

        let now = timeRounded(this.sharedStore.timeSync)

        // Only apply time when game on
        let dif = 0
        if (this.sharedStore.gameState === common.PLAYING) {
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

        this.sharedStore.logList.unshift({
          'id': this.sharedStore.logId++,
          'logPlayer': player,
          'logTime': this.currentGameTime,
          'logDesc': player.isOn === 1 ? 'On' : 'Off',
          'logTotalOn': player.totalOn
        })
      }
    },
    created () {
      this.sharedStore.players3.sort(naturalSort)
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
        overflow: hidden;
        width: 100%;
    }

    .right-col,
    .left-col {
        display: inline-block;

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        float: left;
        width: 75%;
    }
    .right-col {
        float: right;
        text-align: right;
        width: 25%;
    }

    .player-name {
        font-weight: 500;
    }

    .player-seconds {
        font-weight: 200;
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
        width: 100%;
        overflow: hidden;
    }
</style>
