import Page from '@smartface/native/ui/page';
/**
 * Active page reference for router
 * @module router
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2019
 */

interface ExternalPageParams {
    router: any;
    match: any;
    shouldExit: any;
    goBack: () => void;
    parentController: any;
    pageName?: string | undefined;
    extendEvent?: ((...args: any) => any) | undefined;
    setBackItem: any;
}

/**
 * Gets or sets the current page instance for the router util. 
 * This is managed by the router util. 
 * Setting this will not activly change the current page, it is just a reference.
 * @example
 * ```
 * import active from '@smartface/extension-utils/lib/router/active';
 * const currentPage = active.page;
 * currentPage.layout.applyLayout(); 
 * ```
 */
declare namespace active {
    export let page: Page & ExternalPageParams;
}

export default active;
