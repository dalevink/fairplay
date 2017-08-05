<template>
    <div class="game">

        <h3 class="crumb"><router-link to="/">&larr; Done</router-link></h3>
        <div class="clear"></div>

        <h1>Game</h1>

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
  const states = {
    '-1': 'On, Starts',
    '0': 'Off',
    '1': 'On'
  }
  var formatTime = function (secs) {
    let min = Math.floor(secs / 60)
    let sec = secs - min * 60
    return min + ':' + padLeft(sec, '0', 2)
  }

  export default {
    name: 'game',
    data () {
      return {
        timeSync: 0,
        logId: 0,
        logList: [],
        players: [
        ]
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
        return states[log[1]] + ' ' + howLong
      }
    },
    methods: {
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
        // Do not dif first sub
        let firstSub = player.isOn === -1
        dif = this.secDif(player.start, dateRounded(this.timeSync))
        if (player.isOn === 1) {
          player.totalSecondsOn += dif
          player.isOn = 0
        } else {
          player.isOn = 1
        }
        player.start = dateRounded(this.timeSync)
        if (firstSub || dif > 5) {
          this.logList.unshift([ this.logId++, firstSub ? -1 : player.isOn, player, dif ])
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
