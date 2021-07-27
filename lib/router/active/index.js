/**
 * Active page reference for router
 * @module router
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2019
 */

/**
 * Gets or sets the current page instance for the router util. This is managed by the router util. Setting this will not activly change the current page, it is just a reference
 * @prop {UI.Page} page
 * @example
 * import active from "@smartface/extension-utils/lib/router/active";
 * const currentPage = active.page;
 * currentPage.layout.applyLayout();
 */
exports.page = null;
