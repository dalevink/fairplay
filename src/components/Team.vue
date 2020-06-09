<template>
  <div class="team">
      <div
              class="top-buttons"
      >
          <h1 class="heading">
              <span v-if="isStart">
                Add Players to Start.
              </span>
              <span v-if="!isStart">
                Add or Change Players
              </span>
          </h1>
      </div>

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
                 @keyup.enter="doneEdit(player, true)"
                 @keyup.esc="cancelEdit(player)">
        </li>
      </ul>
  </div>
</template>

<script>
import store from '../store'
import common from '../common'

export default {
  // app initial state
  props: {
  },

  data () {
    let newPlayerEnt = this.newPlayer('')
    return {
      newPlayerEnt: newPlayerEnt,
      editingName: false,
      sharedStore: store.data
    }
  },

  beforeCreate () {
  },

  // watch players change for localStorage persistence
  watch: {
  },

  // computed properties
  // http://vuejs.org/guide/computed.html
  computed: {
    playersWithNew () {
      // if (this.sharedStore.players3.every((player) => player.playerName !== '')) {
      return this.sharedStore.players3.concat(this.newPlayerEnt)
    }
  },

  filters: {
  },

  methods: {

    newPlayer: function (name, id) {
      return common.newPlayer(name, id)
    },

    newPlaceholder (p) {
      // We only want a placeholder on the last input
      return this.sharedStore.players3.indexOf(p) === -1 ? 'Enter a New Players Name' : ''
    },

    isStart: function () {
      return this.sharedStore.players3.length === 0
    },

    editPlayer: function (player) {
      if (player !== this.editingName) {
        this.beforeEditCache = player.playerName
        this.editingName = player
      }
      this.checkNew(player)
    },

    checkNew (player) {
      if (player.playerName && this.sharedStore.players3.indexOf(player) === -1) {
        this.sharedStore.players3.push(player)
        this.newPlayerEnt = this.newPlayer('')
      }
    },

    doneEdit: function (player, enter) {
      if (this.editingName !== player) {
        this.checkNew(player)
        return
      }
      player.playerName = player.playerName.trim()
      if (player.playerName === '' && this.sharedStore.players3.indexOf(player) !== -1) {
        this.deletePlayer(player)
      }
      // If on last Player then focus New Player
      if (enter === true && this.sharedStore.players3.indexOf(player) === this.sharedStore.players3.length - 1) {
        this.editingName = this.newPlayerEnt
      } else {
        this.editingName = false
      }
    },

    deletePlayer (player) {
      this.sharedStore.players3.splice(this.sharedStore.players3.indexOf(player), 1)
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
.player-edit {
  display: none;
}
.player-name {
  display: block;
  font-weight: 500;
  width: 100%;
  padding: @grid3;
  border: 1px solid #ccc;
  margin-bottom: 2px;
  background: whitesmoke;
  line-height: 1.4;
  color: mix(@colorOn3, @colorOff4, 85%);
}
.player-name-text {
    cursor: pointer;
}
.new-player,
.player-editing .player-edit {
  display: block;
  width: 100%;
  padding: @grid3;
  font-size: 100%;
  line-height: 1.4;
  margin-bottom: 2px;
  border: 1px solid #ccc;
    &:focus {
        border-color: @colorOn2;
        outline: 0;
        box-shadow: 0 0 2px 2px rgba(red(@colorOn2),green(@colorOn2),blue(@colorOn2),.4);
    }
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
    color: @colorOff1;
    font-weight: 600;
    float: right;
    padding: 7px;
    margin-top: -4px;
    border-radius: 30px;
    border: 1px solid mix(white, @colorOff0, 50%);
    line-height: 1;
    min-width: 35px;
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
