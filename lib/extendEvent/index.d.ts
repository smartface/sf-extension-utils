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
 * import extendEvent from 'sf-extension-utils/lib/extendEvent';
 * extendEvent(this, "onShow", (data) => {
 *  //no need to call the superOnShow, it is automatically handlled     
 * });
 * @example
 * import extendEvent from 'sf-extension-utils/lib/extendEvent';
 * this.extendEvent = extendEvent.bind(null, this);
 * this.extendEvent("onShow", (data) => {
 *  //same as previous example
 * });
 */
export default function(target: { [key: string]: any }, eventName: string, newEvent: () => {}): void;

