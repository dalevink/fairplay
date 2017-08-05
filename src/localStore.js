// localStorage persistence
var STORAGE_KEY = 'teamV026'
export default {
  fetch: function () {
    var t = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return t || {
      players: [],
      newTodo: '',
      editedTodo: false,
      uid: 0
    }
  },
  save: function (data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }
}