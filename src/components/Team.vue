<template>
  <div class="team">

      <transition-group name="anim-list-slow" tag="ul" class="players-ul">
        <li v-for="player in players"
            class="players-li"
            :key="player.id"
            :class="{ 'player-editing': player == editingName || player.title === '' }">
          <div class="player-title">
            <label @click="editPlayer(player)">{{ player.title }}</label>
          </div>
          <input class="player-edit" type="text"
                 v-model="player.title"
                 v-player-focus="player == editingName"
                 :placeholder="newPlaceholder(player)"
                 @blur="doneEdit(player)"
                 @keyup="checkNew()"
                 @click="editPlayer(player)"
                 @keyup.enter="doneEdit(player)"
                 @keyup.esc="cancelEdit(player)">
        </li>
      </transition-group>
      <footer class="footer">
          <strong>{{ players.length - 1 }}</strong> {{ players.length - 1 | pluralize }}
      </footer>
  </div>
</template>

<script>
// import naturalSort from 'javascript-natural-sort'
import localStore from '../localStore'
export default {
  // app initial state
  props: {
    players2: {
      default: function () {
        return []
      },
      type: Array
    }
  },

  data () {
    return localStore.fetch()
  },

  beforeCreate () {
  },

  created () {
    this.checkNew()
  },

  // watch players change for localStorage persistence
  watch: {
    players: {
      handler: function (players) {
        console.log(this)
        localStore.save(this.$data)
      },
      deep: true
    }
  },

  // computed properties
  // http://vuejs.org/guide/computed.html
  computed: {
  },

  filters: {
    pluralize: function (n) {
      return n === 1 ? 'Player' : 'Players'
    }
  },

  methods: {
    newPlaceholder (p) {
      // We only want a placeholder on the last input
      return this.players.indexOf(p) === this.players.length - 1 ? 'Enter a New Players Name' : ''
    },

    addPlayer: function () {
      let value = this.newPlayer && this.newPlayer.trim()
      if (!value) {
        return
      }
      this.players.push({
        id: this.uid++,
        title: value
      })
      this.newPlayer = ''
    },

    checkNew: function () {
      if (this.players.every((player) => player.title !== '')) {
        this.players.push({
          id: this.uid++,
          title: ''
        })
      }
    },
    editPlayer: function (player) {
      if (player !== this.editingName) {
        this.beforeEditCache = player.title
        this.editingName = player
      }
    },

    doneEdit: function (player) {
      if (!this.editingName) {
        return
      }
      this.editingName = false
      player.title = player.title.trim()
      if (player.title === '' && this.beforeEditCache !== '') {
        this.players.splice(this.players.indexOf(player), 1)
      }
    },

    cancelEdit: function (player) {
      this.editingName = false
      player.title = this.beforeEditCache
    }

  },

  // a custom directive to wait for the DOM to be updated
  // before focusing on the input field.
  // http://vuejs.org/guide/custom-directive.html
  directives: {
    'player-focus': function (el, binding) {
      if (binding.value) {
        el.focus()
      }
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

@import "../assets/vars";

.players-ul {
  width: 100%;
  list-style-type: none;
  padding: 0;
}
.players-li {
  padding: 0;
}
.instructions {
  margin: 0;
}
.instructions li {
  color: #666;
  margin: 0;
  padding: 0;
}
.instructions:first-child {
  padding: 0;
}
.instructions > li {
  list-style: none;
  padding: 0;
}
section {
    margin: 0;
}
.footer {
    text-align: center;
}
.player-edit {
  display: none;
}
.player-title label {
  display: block;
  width: 100%;
  padding: 20px;
  border: 1px solid white;
  background: whitesmoke;
  line-height: 20px;
}
.new-player,
.player-editing .player-edit {
  display: block;
  width: 100%;
  padding: 20px;
  font-size: 100%;
  line-height: 20px;
  border: 1px solid #ccc;
}
.player-editing .player-title {
  display: none;
}
.add-hint {
    font-size: 90%;
    color: @colorOn3;
    text-align: right;
    opacity: 0;
    transition: 1s opacity ease;
    padding: 5px;
    margin-top: -20px;
    font-weight: 600;
}
.add-hint-show {
    opacity: 1;
}
</style>
