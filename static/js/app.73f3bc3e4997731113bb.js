webpackJsonp([0],[function(e,t,a){"use strict";var s=a(12),r=a.n(s),n=a(1),i=void 0;t.a={EDIT:0,START:1,PLAYING:2,PAUSED:3,END:4,fetch:function(e){return void 0===i&&(i=JSON.parse(localStorage.getItem("teamV0100"))||e),i},save:function(e){localStorage.setItem("teamV0100",r()(e))},newPlayer:function(e,t){return{id:void 0!==t?t:n.a.data.uid++,playerName:e,start:0,secondsOn:0,totalOn:0,totalOff:0,sessionOn:0,sessionOff:0,isOn:-1}}}},function(e,t,a){"use strict";var s=a(0);t.a={data:{uid:1e3,gameState:s.a.EDIT,timeStart:0,timeSync:(new Date).getTime(),totalGameTime:0,totalPaused:0,players3:[],logList:[],logId:0}}},,,,function(e,t,a){function s(e){a(17)}var r=a(2)(a(11),a(26),s,"data-v-72ef3002",null);e.exports=r.exports},function(e,t,a){"use strict";var s=a(4),r=a(27),n=a(5),i=a.n(n),o=a(23),l=a.n(o);s.a.use(r.a),t.a=new r.a({routes:[{path:"/",component:l.a,name:"FairPlay"},{path:"/edit-players",component:i.a,props:{visibility:"active"}}]})},function(e,t,a){function s(e){a(15)}var r=a(2)(a(9),a(24),s,null,null);e.exports=r.exports},function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=a(4),r=a(7),n=a.n(r),i=a(6);s.a.config.productionTip=!1,new s.a({el:"#app",router:i.a,template:"<App/>",components:{App:n.a}})},function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=a(1),r=a(0);window.addEventListener("touchstart",function e(){var t=document.documentElement;t.className=t.className.replace(/\bno-touch\b/,""),window.user_touched=!0,window.removeEventListener("touchstart",e,!1)},!1),s.a.data=r.a.fetch(s.a.data),setInterval(function(){return r.a.save(s.a.data)},1e3),t.default={name:"app"}},function(e,t,a){"use strict";function s(e){var t=(new Date).getTime(),a=1e3*Math.round((t-e)/1e3);return new Date(e+a).getTime()}Object.defineProperty(t,"__esModule",{value:!0});var r=a(19),n=a.n(r),i=a(5),o=a.n(i),l=a(1),c=a(0),d=function(e,t,a){return(new Array(a+1).join(t)+e).slice(-a)},m=function(e){var t=Math.floor(e/60);return t+":"+d(e-60*t,"0",2)};t.default={data:function(){var e={currentGameTime:0,currentPaused:0,timeSync:0};return e.common=c.a,e.sharedStore=l.a.data,e},components:{Team:o.a},beforeCreate:function(){},computed:{playersFiltered:function(){var e=this.sharedStore.players3.filter(function(e){return 1!==e.isOn}).sort(this.timeSort),t=this.sharedStore.players3.filter(function(e){return 1===e.isOn}).sort(this.timeSort);return e.concat(t)}},filters:{formatTime:function(e){return m(e)},logFormatTime:function(e){return e>0?m(e)+"":"Starts"},logFormatDesc:function(e){return e.logTotalOn>0?e.logDesc:""},pluralize:function(e){return 1===e?"":"s"}},methods:{startGame:function(){this.sharedStore.timeStart=s(this.sharedStore.timeSync),this.calcTime(c.a.PLAYING)},pausePlay:function(){this.calcTime(c.a.PAUSED)},resumePlay:function(){this.calcTime(c.a.PLAYING)},endGame:function(){this.calcTime(c.a.END)},savePlayers:function(){this.sharedStore.gameState=c.a.START},editPlayers:function(){this.sharedStore.gameState=c.a.EDIT},clearGame:function(){this.sharedStore.gameState=c.a.START,this.sharedStore.players3=this.sharedStore.players3.map(function(e){return c.a.newPlayer(e.playerName,e.id)}),this.sharedStore.logId=0,this.sharedStore.logList=[],this.sharedStore.timeStart=0,this.sharedStore.totalGameTime=0,this.sharedStore.totalPaused=0,this.currentGameTime=0,this.currentPaused=0},calcTime:function(e){var t=this;this.sharedStore.gameState=e;var a=s(this.sharedStore.timeSync),r=this.secDif(this.sharedStore.timeStart,a);if(this.sharedStore.timeStart=s(this.sharedStore.timeSync),this.sharedStore.gameState===c.a.PLAYING||this.sharedStore.gameState===c.a.END){this.sharedStore.totalPaused+=r;var n=s(this.sharedStore.timeSync);this.sharedStore.players3.forEach(function(e,t){e.start=n})}else this.sharedStore.totalGameTime+=r,this.sharedStore.players3.forEach(function(e,s){1===e.isOn?e.totalOn+=t.secDif(e.start,a):e.totalOff+=t.secDif(e.start,a)})},timeSort:function(e,t){return e.secondsOn<t.secondsOn?1:-1},updateData:function(){var e=this,t=s(this.sharedStore.timeSync);this.sharedStore.players3.forEach(function(a,s){a.secondsOn=a.totalOn,1===a.isOn&&e.sharedStore.gameState===c.a.PLAYING&&(a.secondsOn+=e.secDif(a.start,t))}),this.currentGameTime=this.sharedStore.totalGameTime+(this.sharedStore.gameState===c.a.PLAYING?this.secDif(this.sharedStore.timeStart,t):0),this.currentPaused=this.sharedStore.totalPaused+(this.sharedStore.gameState===c.a.PAUSED?this.secDif(this.sharedStore.timeStart,t):0)},secDif:function(e,t){return Math.floor((t-e)/1e3)},clickPlayer:function(e){if(this.sharedStore.gameState!==c.a.END){var t=s(this.sharedStore.timeSync),a=0;this.sharedStore.gameState===c.a.PLAYING&&(a=this.secDif(e.start,t)),e.start=t,1===e.isOn?(e.isOn=0,e.totalOn+=a):(e.isOn=1,e.totalOff+=a),this.sharedStore.logList.unshift({id:this.sharedStore.logId++,logPlayer:e,logTime:this.currentGameTime,logDesc:1===e.isOn?"On":"Off",logTotalOn:e.totalOn})}}},created:function(){this.sharedStore.players3.sort(n.a),this.updateData()},mounted:function(){window.setInterval(this.updateData,100)}}},function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=a(1),r=a(0);t.default={props:{},data:function(){return{newPlayerEnt:this.newPlayer(""),editingName:!1,sharedStore:s.a.data}},beforeCreate:function(){},watch:{},computed:{playersWithNew:function(){return this.sharedStore.players3.concat(this.newPlayerEnt)}},filters:{},methods:{newPlayer:function(e,t){return r.a.newPlayer(e,t)},newPlaceholder:function(e){return-1===this.sharedStore.players3.indexOf(e)?"Enter a New Players Name":""},isStart:function(){return 0===this.sharedStore.players3.length},editPlayer:function(e){e!==this.editingName&&(this.beforeEditCache=e.playerName,this.editingName=e),this.checkNew(e)},checkNew:function(e){e.playerName&&-1===this.sharedStore.players3.indexOf(e)&&(this.sharedStore.players3.push(e),this.newPlayerEnt=this.newPlayer(""))},doneEdit:function(e,t){if(this.editingName!==e)return void this.checkNew(e);e.playerName=e.playerName.trim(),""===e.playerName&&-1!==this.sharedStore.players3.indexOf(e)&&this.deletePlayer(e),!0===t&&this.sharedStore.players3.indexOf(e)===this.sharedStore.players3.length-1?this.editingName=this.newPlayerEnt:this.editingName=!1},deletePlayer:function(e){this.sharedStore.players3.splice(this.sharedStore.players3.indexOf(e),1)},cancelEdit:function(e){e.playerName=this.beforeEditCache,this.editingName=!1}},directives:{"player-focus":function(e,t){t.value&&e.focus()}}}},,,,function(e,t){},function(e,t){},function(e,t){},,,,,,function(e,t,a){function s(e){a(16)}var r=a(2)(a(10),a(25),s,"data-v-6cf06717",null);e.exports=r.exports},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{attrs:{id:"app"}},[a("router-view")],1)},staticRenderFns:[]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"game"},[a("div",{directives:[{name:"show",rawName:"v-show",value:e.sharedStore.gameState==e.common.START,expression:"sharedStore.gameState == common.START"}],staticClass:"top-buttons"},[a("button",{staticClass:"button-large button-large-on",on:{click:function(t){e.startGame()}}},[e._v("\n            Start a New Match\n        ")])]),e._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:e.sharedStore.gameState==e.common.PLAYING,expression:"sharedStore.gameState == common.PLAYING"}],staticClass:"top-buttons"},[a("button",{staticClass:"button-large button-large-min",on:{click:function(t){e.pausePlay()}}},[e._v("\n            Stop Play\n        ")])]),e._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:e.sharedStore.gameState==e.common.PAUSED,expression:"sharedStore.gameState == common.PAUSED"}],staticClass:"top-buttons"},[a("button",{staticClass:"button-large button-large-min",on:{click:function(t){e.resumePlay()}}},[e._v("\n            Start Play\n        ")])]),e._v(" "),a("h1",{directives:[{name:"show",rawName:"v-show",value:e.sharedStore.gameState==e.common.END,expression:"sharedStore.gameState == common.END"}],staticClass:"top-buttons heading"},[e._v("\n        End of Play\n    ")]),e._v(" "),e.sharedStore.gameState>e.common.START?a("section",[a("section",{class:{"is-stopped":e.sharedStore.gameState!=e.common.PLAYING,"is-paused":e.sharedStore.gameState==e.common.PAUSED,"is-end":e.sharedStore.gameState==e.common.END}},[a("div",{staticClass:"time-desc"},[e._v("\n                Game Time\n            ")]),e._v(" "),a("div",{staticClass:"time-large"},[e._v("\n                "+e._s(e._f("formatTime")(e.currentGameTime))+"\n            ")])]),e._v(" "),a("section",{class:{hidden:e.currentPaused<1}},[a("div",{staticClass:"time-paused",class:{"time-paused-paused":e.sharedStore.gameState==e.common.PAUSED,"time-paused-paused-flash":e.sharedStore.gameState==e.common.PAUSED&&e.currentPaused%2}},[e._v("\n                Play Stopped for "+e._s(e._f("formatTime")(e.currentPaused))+"\n            ")])])]):e._e(),e._v(" "),e.sharedStore.gameState===e.common.EDIT?a("team"):e._e(),e._v(" "),e.sharedStore.gameState>=e.common.START?a("section",[a("transition-group",{staticClass:"players",attrs:{name:"anim-list",tag:"ul"}},e._l(e.playersFiltered,function(t){return a("li",{key:t.id,staticClass:"player",class:{"player-on":1===t.isOn,"player-time-stopped":e.sharedStore.gameState!=e.common.PLAYING},on:{click:function(a){e.clickPlayer(t)}}},[a("strong",{staticClass:"left-col player-name"},[e._v(e._s(t.playerName))]),e._v(" "),a("span",{staticClass:"right-col player-seconds"},[e._v(e._s(e._f("formatTime")(t.secondsOn)))])])}))],1):e._e(),e._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:e.sharedStore.gameState==e.common.PAUSED,expression:"sharedStore.gameState == common.PAUSED"}],staticClass:"top-buttons"},[a("button",{staticClass:"button-large button-large-off",on:{click:function(t){e.endGame()}}},[e._v("\n            End Game\n        ")])]),e._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:e.sharedStore.gameState==e.common.START,expression:"sharedStore.gameState == common.START"}],staticClass:"top-buttons"},[a("button",{staticClass:"button-large button-large-min",on:{click:function(t){e.editPlayers()}}},[e._v("\n            Add or Change Players\n        ")])]),e._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:e.sharedStore.gameState==e.common.EDIT&&e.sharedStore.players3.length>0,expression:"sharedStore.gameState == common.EDIT && sharedStore.players3.length > 0"}]},[a("button",{staticClass:"button-large button-large-on",on:{click:function(t){e.savePlayers()}}},[e._v("\n            Done Editing,\n            "+e._s(e.sharedStore.players3.length)+" Player"+e._s(e._f("pluralize")(e.sharedStore.players3.length))+"…\n        ")])]),e._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:e.sharedStore.gameState==e.common.END,expression:"sharedStore.gameState == common.END"}],staticClass:"top-buttons"},[a("button",{staticClass:"button-large button-large-min",on:{click:function(t){e.clearGame()}}},[e._v("\n            Clear Game and Start Over\n        ")])]),e._v(" "),e.sharedStore.gameState>=e.common.START&&e.sharedStore.logList.length?a("section",[a("h4",{staticClass:"sub-log-title"},[e._v("\n            Substitution"+e._s(e._f("pluralize")(e.sharedStore.logList.length))+"\n            "),a("span",{staticClass:"sub-log-title-right"},[e._v("Time On")])]),e._v(" "),a("ul",{staticClass:"sub-log"},e._l(e.sharedStore.logList,function(t){return a("li",{key:e.sharedStore.logList.id,staticClass:"sub-log-li"},[a("strong",{staticClass:"left-col player-name"},[e._v("\n                    "+e._s(e._f("formatTime")(t.logTime))+" "+e._s(t.logPlayer.playerName)+" "+e._s(e._f("logFormatDesc")(t))+"\n                ")]),e._v(" "),a("span",{staticClass:"right-col"},[e._v("\n                    "+e._s(e._f("logFormatTime")(t.logTotalOn))+"\n                ")])])}))]):e._e()],1)},staticRenderFns:[]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"team"},[a("div",{staticClass:"top-buttons"},[a("h1",{staticClass:"heading"},[e.isStart?a("span",[e._v("\n              Add Players to Start\n            ")]):e._e(),e._v(" "),e.isStart?e._e():a("span",[e._v("\n              Add or Change Players\n            ")])])]),e._v(" "),a("ul",{staticClass:"players-ul"},e._l(e.playersWithNew,function(t){return a("li",{key:t.id,staticClass:"players-li",class:{"player-editing":t==e.editingName||""===t.playerName}},[a("div",{staticClass:"player-name"},[a("span",{staticClass:"player-name-text",on:{click:function(a){e.editPlayer(t)}}},[e._v("\n                  "+e._s(t.playerName)+"\n              ")]),e._v(" "),a("span",{staticClass:"player-delete",on:{click:function(a){e.deletePlayer(t)}}})]),e._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:t.playerName,expression:"player.playerName"},{name:"player-focus",rawName:"v-player-focus",value:t==e.editingName,expression:"player == editingName"}],staticClass:"player-edit",attrs:{type:"text",placeholder:e.newPlaceholder(t)},domProps:{value:t.playerName},on:{blur:function(a){e.doneEdit(t)},keyup:[function(a){e.editPlayer(t)},function(a){if(!("button"in a)&&e._k(a.keyCode,"enter",13,a.key,"Enter"))return null;e.doneEdit(t,!0)},function(a){if(!("button"in a)&&e._k(a.keyCode,"esc",27,a.key,"Escape"))return null;e.cancelEdit(t)}],click:function(a){e.editPlayer(t)},input:function(a){a.target.composing||e.$set(t,"playerName",a.target.value)}}})])}))])},staticRenderFns:[]}}],[8]);
//# sourceMappingURL=app.73f3bc3e4997731113bb.js.map