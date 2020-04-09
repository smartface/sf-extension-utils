/**
 * Smartface combilned style util
 * @module getCombinedStyle
 * @type {function}
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2019
 */

const componentContextPatch = require("@smartface/contx/lib/smartface/componentContextPatch");
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
        return cache[className];

    let dummyComponent = {
        ios: {},
        android: {},
        layout: {},
        layoutManager: {}
    };
    componentContextPatch(dummyComponent, "GETCOMBINESTYLE_DUMMY_COMPONENT");
    dummyComponent.dispatch({
        type: "pushClassNames",
        classNames: [className]
    });
    Object.assign(dummyComponent, dummyComponent.layout);
    return cache[className] = dummyComponent;
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
