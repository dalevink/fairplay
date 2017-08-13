<template>
  <div class="team">

      <ul class="players-ul">
        <li v-for="player in playersWithNew"
            class="players-li"
            :key="player.id"
            :class="{ 'player-editing': player == editingName || player.playerName === '' }">
          <div class="player-name">
                <span
                        @click="editPlayer(player)"
                        class="player-name-text">
                    {{ player.playerName }}
                </span>
                <span
                        @click="deletePlayer(player)"
                        class="player-delete"></span>
          </div>
          <input class="player-edit" type="text"
                 v-model="player.playerName"
                 v-player-focus="player == editingName"
                 :placeholder="newPlaceholder(player)"
                 @blur="doneEdit(player)"
                 @keyup="editPlayer(player)"
                 @click="editPlayer(player)"
                 @keyup.enter="doneEdit(player)"
                 @keyup.esc="cancelEdit(player)">
        </li>
      </ul>
      <footer class="footer">
          <strong>{{ players2.length }}</strong> {{ players2.length | pluralize }}
      </footer>
  </div>
</template>

<script>
// import naturalSort from 'javascript-natural-sort'
import localStore from '../localStore'
export default {
  // app initial state
  props: {
    players3: {
      default: function () {
        return []
      },
      type: Array
    }
  },

  data () {
    let common = localStore.fetch()
    return {
      players2: common.players2,
      newPlayer: localStore.newPlayer(''),
      editingName: false,
      uid: 0
    }
  },

  beforeCreate () {
  },

  // watch players change for localStorage persistence
  watch: {
    players2: {
      handler: function () {
        // todo move
        localStore.save(this.$data)
      },
      deep: true
    }
  },

  // computed properties
  // http://vuejs.org/guide/computed.html
  computed: {
    playersWithNew () {
      // if (this.players2.every((player) => player.playerName !== '')) {
      return this.players2.concat(this.newPlayer)
    }
  },

  filters: {
    pluralize: function (n) {
      return n === 1 ? 'Player' : 'Players'
    }
  },

  methods: {
    newPlaceholder (p) {
      // We only want a placeholder on the last input
      return this.players2.indexOf(p) === -1 ? 'Enter a New Players Name' : ''
    },

    editPlayer: function (player) {
      if (player !== this.editingName) {
        this.beforeEditCache = player.playerName
        this.editingName = player
      }
      this.checkNew(player)
    },

    checkNew (player) {
      if (player.playerName && this.players2.indexOf(player) === -1) {
        this.players2.push(player)
        this.newPlayer = localStore.newPlayer('')
      }
    },

    doneEdit: function (player) {
      if (!this.editingName) {
        this.checkNew(player)
        return
      }
      player.playerName = player.playerName.trim()
      if (player.playerName === '' && this.players2.indexOf(player) !== -1) {
        this.deletePlayer(player)
      }
      this.editingName = false
    },

    deletePlayer (player) {
      this.players2.splice(this.players2.indexOf(player), 1)
    },

    cancelEdit: function (player) {
      player.playerName = this.beforeEditCache
      this.editingName = false
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
.player-name {
  display: block;
  font-weight: 500;
  width: 100%;
  padding: 20px;
  border: 1px solid white;
  background: whitesmoke;
  line-height: 20px;
}
.player-name-text {
    cursor: pointer;
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
.player-editing .player-name {
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
.player-delete {
    color: @colorOff0;
    font-weight: 600;
    float: right;
    padding: 10px;
    margin-top: -8px;
    margin-right: -8px;
    border-radius: 25px;
    line-height: 1;
    min-width: 37px;
    text-align: center;
    cursor: pointer;
    background: whitesmoke;
    transition: .1s background-color,color ease;
    &::before {
        content: "×";
    }
    .no-touch & {
        &:hover {
           background: @colorPause2;
           color: white;
        }
    }
}
</style>