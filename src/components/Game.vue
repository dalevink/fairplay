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
          v.secondsOn = this.difTime(v.start, now)
        })
      },
      difTime (start, end) {
        let dif = Math.floor((end.getTime() - start.getTime()) / 1000)
        let min = Math.floor(dif / 60)
        let sec = dif - min * 60
        return min + ':' + this.padLeft(sec, '0', 2)
      },
      padLeft (string, pad, length) {
        return (new Array(length + 1).join(pad) + string).slice(-length)
      },
      clickPlayer (player) {
        player.isOn = !player.isOn
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
          start: new Date(),
          secondsOn: 0,
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
        background: #40a2d9;
        font-weight: 500;
        color: white;
    }
</style>
