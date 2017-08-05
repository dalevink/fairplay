<template>
  <div id="app">
    <h3 class="app-name">FairPlay</h3>
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
.app-name {
  text-align: center;
  color: #999;
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
</style>
