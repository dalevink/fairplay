<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>

html {
  box-sizing: border-box;
  font-size: 16px;
  line-height: 1.5;
}
*, :after, :before {
  box-sizing: inherit;
}
a {
  text-decoration: none;
}

h1 {
  text-align: center;
}

.app-name-center {
  color: #999;
  text-align: center;
}
.crumb {
  float: left;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-top: 30px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 20px;
  padding-right: 20px;
  max-width: 400px;
}

.large-button {
  padding: 20px;
  border: 1px solid white;
  border-radius: 4px;
  cursor: pointer;
  background: whitesmoke;
  text-align: center;
  display: block;
  font-size: 130%;
}

.clear {
  clear: both;
  display: block;
  overflow: hidden;
  visibility: hidden;
  width: 0;
  height: 0;
}
.anim-list-move {
  transition: transform .2s;
}


</style>
