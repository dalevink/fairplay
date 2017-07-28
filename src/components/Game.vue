<template>
    <div class="game">
        <ul>
            <li>
                <router-link to="/add-team">Add Team</router-link>
            </li>
        </ul>
        <ul class="players">
            <li class="player"
                v-for="player in players"
                v-bind:class="{ 'player-on': player.isOn  }"
                @click="clickPlayer(player)"
            >

                <strong class="player-name">{{ player.name }}</strong>
                <span class="player-seconds">{{ player.secondsOn }}</span>
            </li>
        </ul>
    </div>
</template>

<script>
  export default {
    name: 'game',
    data () {
      return {
        players: [
        ]
      }
    },
    computed: {
    },
    methods: {
      updateData () {
        var now = new Date()
        this.players.forEach((v, i) => {
          let total = 0
          if (v.isOn) {
            total += this.secDif(v.start, now)
          }
          total += v.totalSecondsOn
          v.secondsOn = this.formatTime(total)
        })
      },
      formatTime (dif) {
        let min = Math.floor(dif / 60)
        let sec = dif - min * 60
        return min + ':' + this.padLeft(sec, '0', 2)
      },
      padLeft (string, pad, length) {
        return (new Array(length + 1).join(pad) + string).slice(-length)
      },
      secDif (start, end) {
        return Math.floor((end - start) / 1000)
      },
      clickPlayer (player) {
        if (player.isOn) {
          player.totalSecondsOn += this.secDif(player.start, new Date())
          player.start = 0
          player.isOn = false
        } else {
          player.start = new Date()
          player.isOn = true
        }
      }
    },
    beforeCreate () {
    },
    created () {
      [
        'Luca',
        'Liam',
        'Jai',
        'Zaid',
        'George',
        'Ben',
        'William',
        'Jackson'
      ].forEach((name) => {
        this.players.push({
          state: 'off',
          name: name,
          start: 0,
          secondsOn: 0,
          totalSecondsOn: 0,
          isOn: false
        })
      })
    },
    mounted () {
      window.setInterval(this.updateData, 100)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h1, h2 {
        font-weight: normal;
    }

    .players {
        list-style-type: none;
        padding: 0;
    }
    .player {
        padding: 20px;
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
