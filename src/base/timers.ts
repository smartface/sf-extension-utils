/**
 * Smartface global timer replacer module
 * @module timer
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2018
 */

import Timer from "@smartface/native/global/timer";
const definedTimers: Timer[] = [];

module.exports = exports = {
  setTimeout: global.setTimeout,
  setInterval: global.setInterval,
  clearInterval: global.clearInterval,
  clearTimeout: global.clearTimeout,
};

function setTimeout(fn: () => unknown, duration: number): Timer {
  const timer = Timer.setTimeout({
    task: fn,
    delay: duration,
  });
  var timerID = definedTimers.push(timer) - 1;
  return timerID;
}

function setInterval(fn: () => unknown, duration: number): Timer {
  const timer = Timer.setInterval({
    task: fn,
    delay: duration,
  });
  const timerID = definedTimers.push(timer) - 1;
  return timerID;
}

function clearTimer(id: number): void {
  const timer = definedTimers[id];
  if (!timer) {
    return;
  }
  Timer.clearTimer(timer);
  definedTimers[id] = new Timer(); // Empty timer
}

//@ts-ignore
global.setTimeout = setTimeout;

//@ts-ignore
global.setInterval = setInterval;

//@ts-ignore
global.clearInterval = global.clearTimeout = clearTimer;
