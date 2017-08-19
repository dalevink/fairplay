<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
window.addEventListener('touchstart', function onFirstTouch () {
  let d = document.documentElement
  d.className = d.className.replace(/\bno-touch\b/, '')
  // or set some global variable
  window.user_touched = true
  // we only need to know once that a human touched the screen, so we can stop listening now
  window.removeEventListener('touchstart', onFirstTouch, false)
}, false)

export default {
  name: 'app'
}
</script>

<style lang="less">

@import "./assets/vars";

html {
  box-sizing: border-box;
  font-size: 18px;
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

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 30px auto;
  padding-left: 20px;
  padding-right: 20px;
  max-width: 400px;
}

.heading {
  line-height: 1;
  font-size: 120%;
  width: 100%;
  padding: 20px;
  text-align: center;
  display: block;
  color: @colorOff4;
}
.button-large {
  line-height: 1;
  font-size: 100%;
  width: 100%;
  padding: 20px;
  border: 1px solid white;
  border-radius: 4px;
  cursor: pointer;
  background: whitesmoke;
  text-align: center;
  display: block;
  color: @colorOn3;
}
.button-large-on {
  background: @colorOn3;
  color: white;
}
.button-large-disabled {
  background: white;
  color: @colorOff2;
  cursor: default;
}
.button-large-off {
  background: @colorOff2;
  color: white;
}
.button-large-end {
  background: @colorPause3;
  color: white;
}
.button-large-min {
  background: white;
  font-size: 100%;
  color: @colorOn3;
  border: 1px solid @colorOn1;
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
.hidden {
  visibility: hidden;
}

</style>
