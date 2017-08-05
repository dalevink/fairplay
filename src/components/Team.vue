<template>
  <div class="team">

    <h3 class="crumb"><router-link to="/">&larr; Done Editing</router-link></h3>
    <div class="clear"></div>

    <h1>Manage Players</h1>

      <transition-group name="anim-list" tag="ul" class="players-ul">
        <li v-for="player in filteredPlayers"
            class="players-li"
            :key="player.id"
            :class="{ archived: player.archived, 'player-editing': player == editingName }">
          <div class="player-title">
            <label @click="editPlayer(player)">{{ player.title }}</label>
          </div>
          <input class="player-edit" type="text"
                 v-model="player.title"
                 v-player-focus="player == editingName"
                 @blur="doneEdit(player)"
                 @keyup.enter="doneEdit(player)"
                 @keyup.esc="cancelEdit(player)">
        </li>
        <li :key="'active'" v-show="visibility == 'active'">
          <input class="new-player"
                 autofocus autocomplete="off"
                 placeholder="Add a New Player"
                 @blur="addPlayer"
                 v-model="newPlayer"
                 @keyup.enter="addPlayer">
        </li>
      </transition-group>
      <footer class="footer">
          <strong>{{ playerCount }}</strong> {{ visibility == 'archived' ? 'Deleted' : '' }} {{ playerCount | pluralize }}
      </footer>
      <section>
          <h3 v-show="visibility != 'active'"><a href="#/edit-players" :class="{ selected: visibility == 'active' }">&larr; Active Players</a></h3>
          <h3 v-show="visibility == 'active' && archivedPlayers.length"><a href="#/edit-players/archived" :class="{ selected: visibility == 'archived' }">View Deleted Players</a></h3>
      </section>

  </div>
</template>

<script>

// visibility filters
var filters = {
  all: function (players) {
    return players
  },
  active: function (players) {
    return players.filter(function (player) {
      return !player.archived
    })
  },
  archived: function (players) {
    return players.filter(function (player) {
      return player.archived
    })
  }
}

import naturalSort from 'javascript-natural-sort'
import localStore from '../localStore'
export default {
  // app initial state
  props: [ 'visibility' ],
  data () {
    return localStore.fetch()
  },

  beforeCreate () {
  },

  // watch players change for localStorage persistence
  watch: {
    players: {
      handler: function (players) {
        localStore.save(this._data)
      },
      deep: true
    }
  },

  // computed properties
  // http://vuejs.org/guide/computed.html
  computed: {
    filteredPlayers: function () {
      return filters[this.visibility](this.players)
    },
    archivedPlayers: function () {
      return filters['archived'](this.players)
    },
    playerCount: function () {
      return this.filteredPlayers.length
    }
  },

  filters: {
    pluralize: function (n) {
      return n === 1 ? 'Player' : 'Players'
    }
  },

  // methods that implement data logic.
  // note there's no DOM manipulation here at all.
  methods: {
    addPlayer: function () {
      var value = this.newPlayer && this.newPlayer.trim()
      if (!value) {
        return
      }
      this.players.push({
        id: this.uid++,
        title: value,
        archived: false
      })
      this.players = this.players.sort(function (a, b) {
        return [ a.title, b.title ].sort(naturalSort)[0] === a.title ? -1 : 1
      })
      this.newPlayer = ''
    },

    editPlayer: function (player) {
      this.beforeEditCache = player.title
      this.editingName = player
    },

    doneEdit: function (player) {
      if (!this.editingName) {
        return
      }
      this.editingName = false
      player.title = player.title.trim()
      if (player.title === '') {
        if (player.archived) {
          this.players.splice(this.players.indexOf(player), 1)
        } else {
          player.title = this.beforeEditCache
          player.archived = true
        }
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
<style scoped>
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
    text-align: right;
}
.new-player {
  padding: 20px;
  border: 1px solid #ccc;
  display: inline-block;
  width: 100%;
  font-size: 100%;
  line-height: 20px;
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
.player-editing .player-edit {
  display: block;
  width: 100%;
  padding: 20px;
  border: 1px solid white;
  font-size: 100%;
  line-height: 20px;
}
.player-editing .player-title {
  display: none;
}
</style>
