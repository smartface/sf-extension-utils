/**
 * Smartface guid util
 * @module guid
 * @type {function}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2019
 */

const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
};

/**
 * Creates a UUID v4 string
 * @method
 * @public
 * @returns {string} Random generated uuid v4 string
 * @example
 * import guid from "@smartface/extension-utils/lib/guid";
 * const newItem = { id: guid() };
 */ 
const guid = () => s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();

module.exports = exports = guid;
