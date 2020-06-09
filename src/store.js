
import common from './common'

export default {
  data: {
    uid: 1000,
    gameState: common.EDIT,
    endGameWarning: false,
    timeStart: 0,
    timeSync: new Date().getTime(),
    totalGameTime: 0,
    totalPaused: 0,

    players3: [],

    logList: [],
    logId: 0
  }
}
