import Page = require('@smartface/native/ui/page');
/**
 * Active page reference for router
 * @module router
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2019
 */

/**
 * Gets or sets the current page instance for the router util. This is managed by the router util. Setting this will not activly change the current page, it is just a reference

 * @example
 * import active from 'sf-extension-utils/lib/router/active';
 * const currentPage = active.page;
 * currentPage.layout.applyLayout(); 
 */
declare namespace active {
    export const page: Page
}

export default active;
