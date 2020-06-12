/**
 * Smartface Copy helper module
 * @module copy
 * @type {function}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2018
 */

/**
 * Creates a deep high-performing copy of a variable
 * @public
 * @function copy
 * @params {*} source
 * @params {*} [destination]
 * @returns {*} copy of the source
 * @example
 * import copy from 'sf-extension-utils/lib/copy';
 * const src = {nested: {x: 4}}; //deep nested object
 * const cpy = copy(src);
 * 
 * console.log(src === cpy); //false
 * console.log(src.nested === cpy.nested); //false
 * @example
 * import copy from 'sf-extension-utils/lib/copy';
 * const src = {nested: {x: 4}}; //deep nested object
 * const cpy;
 * //targeting
 * copy(src, cpy);
 */
export default function(source: any, destination?: any): any;