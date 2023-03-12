//import sound from "audio/survival_game_intro.mp3";
//    the following in combination with the import above did not work
//      const gameLoadMusic = new Audio(sound);

let isBrowserOrNode = '';
const g = (function getGlobalObject() {
  if (typeof global !== 'undefined') {
    if (typeof module === 'object' && typeof module.exports === 'object') {
      if (typeof process === 'object') {
        if (typeof process.versions === 'object') {
          if (typeof process.versions.node !== 'undefined') {
            // this is running in NODE.JS
            isBrowserOrNode = 'node';
            return global;
          }
        }
      }
    }
  } else if (
    typeof window !== 'undefined' &&
    typeof window.document !== 'undefined'
  ) {
    // browser
    isBrowserOrNode = 'browser';
    return window;
  }
})();
g.isBrowserOrNode = isBrowserOrNode;

//============== START: Helpers ==============
//============================================
const logWriters = {
  checkLog: function checkLog(logTarget) {
    let log;
    if (logTarget && logTarget instanceof Element) {
      log = logTarget;
    } else {
      log = document.querySelector('#log');
      if (!log) {
        console.log(
          "You're missing/you need to specify an element with 'id=#log'"
        );
        return false;
      }
    }
    return log;
  },
  lw: function lw(msg, logTarget) {
    let log = logWriters.checkLog(logTarget);
    log.innerHTML += msg;
  },
  lwFormat: function lwFormat(msg, logTarget) {
    let log = logWriters.checkLog(logTarget);
    log.innerHTML += msg + '; ';
  },
  lwLn: function lwLn(msg, logTarget) {
    if (msg === undefined) msg = '';
    let log = logWriters.checkLog(logTarget);
    log.innerHTML += msg + '<br>\n';
  },
  lwReplace: function lwReplace(msg, logTarget) {
    if (msg === undefined) msg = '';
    let log = logWriters.checkLog(logTarget);
    log.innerHTML = msg;
  },
};

const e = function (msg) {
  console.error('**ERROR**: %s', msg);
};
const l = console.log;

lw = logWriters.lw;
lwf = logWriters.lwFormat;
lwln = logWriters.lwLn;
lwr = logWriters.lwReplace;

//const objectMap = (obj, fn) =>
function objectMap(obj, fn) {
  Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)]));
}
//============== End: Helpers ==============

g.t = {};
g.c = window.c;

/* const myModal = document.getElementsByName('flakModal')[0];*/
$(document).ready(function () {
  g.myInput = document.getElementById('myInput');
});
const gameLoadMusic = document.createElement('audio');

function initGameTimeDefaults() {
  g.t.todayStart = g.t.start = Date.now();
  g.t.tick = 0;
  g.t.totalTicks = 0;
  g.t.minute = 0;
  g.t.totalMinutes = 0;
  g.t.hour = 0;
  g.t.totalHours = 0;
  g.t.day = 0;
} // END: function initGameTimeDefaults

const CELESTIAL_RISING = 10;
const CELESTIAL_SETTING = 20;
const CELESTIAL_MOVING = 30;
const CELESTIAL_HIDDEN = 40;
const CELESTIAL_SHOWN = 50;
const CELESTIAL_SHOWN_MIDDLE = 60;

const CELESTIAL_OFFSET_X = -15;
const CELESTIAL_MAXHEIGHT = 0;
const CELESTIAL_MINHEIGHT = 100;
const CELESTIAL_PXPERTICK_MOD = 5;
const CELESTIAL_DIST_MOD_Y = 2.2;

const GAMELOOP_TIMER_INTERVAL = 10;
//const TICKS_PER_MINUTE = 10;
g.TICKS_PER_MINUTE = 5;

class Q {
  //these are the queue events
  _onStatusWritten = [];
  _onMessageWritten = [];
  _onOutputWritten = [];

  //these are the actual queues
  status = [];
  message = [];
  output = [];
  constructor() {}
  write(queue, text) {
    this[queue].push(text);
    this.triggerQueueWrittenEvent(queue);
  }
  triggerQueueWrittenEvent(queue) {
    let handlerStack = '';
    if (queue === 'status') handlerStack = '_onStatusWritten';
    if (queue === 'message') handlerStack = '_onMessageWritten';
    if (queue === 'output') handlerStack = '_onOutputWritten';
    for (let i = 0; i < this[handlerStack].length; i++) {
      this[handlerStack][i](this, this[handlerStack]);
    }
  }
  addQueueWrittenEventListener(queue, listenerFunc) {
    let handlerStack = '';
    if (queue === 'status') handlerStack = '_onStatusWritten';
    if (queue === 'message') handlerStack = '_onMessageWritten';
    if (queue === 'output') handlerStack = '_onOutputWritten';
    this[handlerStack].push(listenerFunc);
  }

  removeQueueWrittenEventListener(queue, listenerFunc) {
    let handlerStack = '';
    if (queue === 'status') handlerStack = '_onStatusWritten';
    if (queue === 'message') handlerStack = '_onMessageWritten';
    if (queue === 'output') handlerStack = '_onOutputWritten';
    var index = this[handlerStack].indexOf(listenerFunc);
    if (index >= 0) {
      this[handlerStack].splice(index, 1);
    }
  }
}
g.q = new Q();
g.msgQueue = [];
//g.q.addQueueWrittenEventListener('status', statusQueueWrittenHandler);
g.q.addQueueWrittenEventListener('message', messageQueueWrittenHandler);
g.q.addQueueWrittenEventListener('output', outputQueueWrittenHandler);

/* function statusQueueWrittenHandler(sender) {
  console.log(g.q.status.pop());
} */
function messageQueueWrittenHandler(sender) {
  console.log(g.q.message.pop());
}
function outputQueueWrittenHandler(sender) {
  console.log(g.q.output.pop());
}

g.q.write('status', 'testing status');
g.q.write('message', 'testing message');
g.q.write('output', 'testing output');
