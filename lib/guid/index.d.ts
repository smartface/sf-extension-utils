/**
 * Smartface guid util
 * @module guid
 * @type {function}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2019
 */

/**
 * Creates a UUID v4 string
 * @method
 * @public
 * @returns {string} Random generated uuid v4 string
 * @example
 * import guid from 'sf-extension-utils/lib/guid';
 * var newItem = { id: guid() };
 */ 
export default function(): string;