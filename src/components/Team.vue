<template>
  <div class="team">
    <h1>Manage Players</h1>
    <ul>
      <li><router-link to="/view-game">View Game</router-link></li>
    </ul>

    <section class="todoapp">
      <section class="main">
        <ul class="todo-list">
          <li v-for="todo in filteredTodos"
              class="todo"
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
      </section>
      <footer class="footer">
        <span class="todo-count">
          <strong>{{ playerCount }}</strong> {{ visibility == 'archived' ? 'Deleted' : '' }} {{ playerCount | pluralize }}
        </span>
        <ul class="filters">
          <li v-show="visibility != 'active'"><a href="#/add-team" :class="{ selected: visibility == 'active' }">&larr; Active Players</a></li>
          <li v-show="visibility == 'active' && archivedTodos.length"><a href="#/add-team/archived" :class="{ selected: visibility == 'archived' }">See Deleted Players</a></li>
        </ul>
      </footer>
    </section>

  </div>
</template>

<script>

// Full spec-compliant TodoMVC with localStorage persistence
// and hash-based routing in ~120 effective lines of JavaScript.

// localStorage persistence
var STORAGE_KEY = 'teamV001'
var todoStorage = {
  fetch: function () {
    var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    todos.forEach(function (todo, index) {
      todo.id = index
    })
    todoStorage.uid = todos.length
    return todos
  },
  save: function (todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}

// visibility filters
var filters = {
  all: function (todos) {
    return todos
  },
  active: function (todos) {
    return todos.filter(function (todo) {
      return !todo.archived
    })
  },
  archived: function (todos) {
    return todos.filter(function (todo) {
      return todo.archived
    })
  }
}

import naturalsort from 'naturalsort'
export default {
  // app initial state
  props: [ 'visibility' ],
  data () {
    return {
      todos: todoStorage.fetch(),
      newTodo: '',
      editedTodo: null
    }
  },

  beforeCreate () {
  },

  // watch todos change for localStorage persistence
  watch: {
    todos: {
      handler: function (todos) {
        todoStorage.save(todos)
      },
      deep: true
    }
  },

  // computed properties
  // http://vuejs.org/guide/computed.html
  computed: {
    filteredTodos: function () {
      return filters[this.visibility](this.todos)
    },
    archivedTodos: function () {
      return filters['archived'](this.todos)
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
      this.todos.push({
        id: todoStorage.uid++,
        title: value,
        archived: false
      })
      this.todos = this.todos.sort(function (a, b) {
        return [ a.title, b.title ].sort(naturalsort)[0] === a.title ? -1 : 1
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
      this.editedTodo = null
      todo.title = todo.title.trim()
      if (todo.title === '') {
        if (todo.archived) {
          this.todos.splice(this.todos.indexOf(todo), 1)
        } else {
          todo.title = this.beforeEditCache
          todo.archived = true
        }
      }
    },

    cancelEdit: function (todo) {
      this.editedTodo = null
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
ul {
  width: 100%;
  list-style-type: none;
  padding: 0;
}
li {
  padding: 0;
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
