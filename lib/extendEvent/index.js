/**
 * Adds event to a target object. If the event is already there, automatically wraps the old event. First calls the old event. Return the new event when fired.
 * @public
 * @module extendEvent
 * @type {function}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2018
 * @param {object} target - to add the event
 * @param {string} eventName - to set
 * @param {function} newEvent - event callback function
 * @example
 * const extendEvent = require("sf-extension-utils/lib/extendEvent");
 * extendEvent(this, "onShow", (data) => {
 *  //no need to call the superOnShow, it is automatically handlled     
 * });
 * @example
 * const extendEvent = require("sf-extension-utils/lib/extendEvent");
 * this.extendEvent = extendEvent.bind(null, this);
 * this.extendEvent("onShow", (data) => {
 *  //same as previous example
 * });
 */
module.exports = exports = (target, eventName, newEvent) => {
    if(!newEvent)
        return;
    let oldEvent = (target[eventName] && target[eventName].bind(target)) || null;
    let wrappedEvent = eventWrapper.bind(target, oldEvent, newEvent);
    target[eventName] = wrappedEvent;
};

function eventWrapper() {
    const target = this;
    const args = Array.prototype.slice.call(arguments);
    const oldEvent = args.shift();
    const newEvent = args.shift();
    const oldReturnValue = oldEvent && oldEvent.apply(target, args);
    const newReturnValue = newEvent.apply(target, args);
    return typeof newReturnValue === "undefined"? oldReturnValue: newReturnValue;
}
