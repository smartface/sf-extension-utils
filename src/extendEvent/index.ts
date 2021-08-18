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
 * import extendEvent from '@smartface/extension-utils/lib/extendEvent';
 * extendEvent(page, "onShow", function(data) {
 *  //no need to call the superOnShow, it is automatically handlled
 * });
 * @example
 * import extendEvent from '@smartface/extension-utils/lib/extendEvent';
 * page.extendEvent = extendEvent.bind(null, page);
 * page.extendEvent("onShow", function(data) {
 *  //same as previous example
 * });
 */
export default function(
	target: { [key: string]: any },
	eventName: string,
	newEvent: () => {}
): void {
	if (!newEvent) return;
	let oldEvent = (target[eventName] && target[eventName].bind(target)) || null;
	let wrappedEvent = eventWrapper.bind(target, oldEvent, newEvent);
	target[eventName] = wrappedEvent;
}

function eventWrapper(this: any) {
	const target = this;
	const args = Array.prototype.slice.call(arguments);
	const oldEvent = args.shift();
	const newEvent = args.shift();
	const oldReturnValue = oldEvent && oldEvent.apply(target, args);
	const newReturnValue = newEvent.apply(target, args);
	return typeof newReturnValue === "undefined"
		? oldReturnValue
		: newReturnValue;
}
