/**
 * Smartface global timer replacer module
 * @module timer
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2018
 */

const Timer = require("@smartface/native/timer");
const definedTimers = [];


module.exports = exports = {
    setTimeout: global.setTimeout,
    setInterval: global.setInterval,
    clearInterval: global.clearInterval,
    clearTimeout: global.clearTimeout
};

global.setTimeout = function setTimeout(fn, duration) {
    var tmr = Timer.setTimeout({
        task: fn,
        delay: duration
    });
    var timerID = definedTimers.push(tmr) - 1;
    return timerID;
};

global.setInterval = function setInterval(fn, duration) {
    var tmr = Timer.setInterval({
        task: fn,
        delay: duration
    });
    var timerID = definedTimers.push(tmr) - 1;
    return timerID;
};

function clearTimer(id) {
    var tmr = definedTimers[id];
    if (!tmr)
        return;
    Timer.clearTimer(tmr);
    definedTimers[id] = null;
}


global.clearInterval = global.clearTimeout = clearTimer;
