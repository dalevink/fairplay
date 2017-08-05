<template>
  <div class="team">

    <h3 class="crumb"><router-link to="/">&larr; Done Editing</router-link></h3>
    <div class="clear"></div>

    <h1>Manage Players</h1>

      <ul class="players-ul">
        <li v-for="todo in filteredTodos"
            class="players-li"
            :key="todo.id"
            :class="{ archived: todo.archived, 'player-editing': todo == editedTodo }">
          <div class="player-title">
            <label @click="editTodo(todo)">{{ todo.title }}</label>
          </div>
          <input class="player-edit" type="text"
                 v-model="todo.title"
                 v-todo-focus="todo == editedTodo"
                 @blur="doneEdit(todo)"
                 @keyup.enter="doneEdit(todo)"
                 @keyup.esc="cancelEdit(todo)">
        </li>
        <li v-show="visibility == 'active'">
          <input class="new-todo"
                 autofocus autocomplete="off"
                 placeholder="Add a New Player"
                 @blur="addTodo"
                 v-model="newTodo"
                 @keyup.enter="addTodo">
        </li>
      </ul>
      <footer class="footer">
          <strong>{{ playerCount }}</strong> {{ visibility == 'archived' ? 'Deleted' : '' }} {{ playerCount | pluralize }}
      </footer>
      <section>
          <h3 v-show="visibility != 'active'"><a href="#/edit-players" :class="{ selected: visibility == 'active' }">&larr; Active Players</a></h3>
          <h3 v-show="visibility == 'active' && archivedTodos.length"><a href="#/edit-players/archived" :class="{ selected: visibility == 'archived' }">View Deleted Players</a></h3>
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
    return players.filter(function (todo) {
      return !todo.archived
    })
  },
  archived: function (players) {
    return players.filter(function (todo) {
      return todo.archived
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
    filteredTodos: function () {
      return filters[this.visibility](this.players)
    },
    archivedTodos: function () {
      return filters['archived'](this.players)
    },
    playerCount: function () {
      return this.filteredTodos.length
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
    addTodo: function () {
      var value = this.newTodo && this.newTodo.trim()
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
      this.newTodo = ''
    },

    editTodo: function (todo) {
      this.beforeEditCache = todo.title
      this.editedTodo = todo
    },

    doneEdit: function (todo) {
      if (!this.editedTodo) {
        return
      }
      this.editedTodo = false
      todo.title = todo.title.trim()
      if (todo.title === '') {
        if (todo.archived) {
          this.players.splice(this.players.indexOf(todo), 1)
        } else {
          todo.title = this.beforeEditCache
          todo.archived = true
        }
      }
    },

    cancelEdit: function (todo) {
      this.editedTodo = false
      todo.title = this.beforeEditCache
    }

  },

  // a custom directive to wait for the DOM to be updated
  // before focusing on the input field.
  // http://vuejs.org/guide/custom-directive.html
  directives: {
    'todo-focus': function (el, binding) {
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
.new-todo {
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
