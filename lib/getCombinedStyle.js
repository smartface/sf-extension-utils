/**
 * Smartface combilned style util
 * @module getCombinedStyle
 * @type {function}
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2019
 */

const guid = require("./guid");
const componentContextPatch = require("@smartface/contx/lib/smartface/componentContextPatch");
const copy = require("./copy");
var cache = {};

/**
 * Creates a style object from a context class. Results are cached. If same className is matched, result is given from a cache. Cache not cleared on context change!
 * @public
 * @method
 * @params {string} className - One or more class names seperated with space
 * @returns {object} Style object generated from cache
 * @example
 * const { getCombinedStyle } = require("sf-extension-utils/lib/getCombinedStyle");
 * var buttonStyle = getCombinedStyle(".button");
 * Object.assign(btn, buttonStyle);
 */
const getCombinedStyle = className => {
    if (cache[className])
        return copy(cache[className]);

    let dummyComponent = {
        ios: {},
        android: {},
        layout: {}
    };
    componentContextPatch(dummyComponent, guid());
    dummyComponent.dispatch({
        type: "pushClassNames",
        classNames: [className]
    });
    Object.assign(dummyComponent, dummyComponent.layout);
    cache[className] = dummyComponent;
    return copy(cache[className]);
};

/**
 * Removes all items from cache
 * @public
 * @method
 * @example
 * const { clearCache } = require("sf-extension-utils/lib/getCombinedStyle");
 * function onContextChangeEvent() {
 *  clearCache();
 * }
 */
const clearCache = () => {
    cache = {};
};

Object.assign(exports, {
    getCombinedStyle,
    clearCache
});
