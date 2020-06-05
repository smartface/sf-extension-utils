declare interface IBuildExtenderOptions {
    /**
     * Returns the class of the page. This used for lazy loading of a page file and helps the performance.
     */
    getPageClass: string;
    /**
     * Same instance of the page will be used again and again for the same route. It is advised to use a singleton page for each first Route of a StackRouter
     */
    singleton?: boolean;
    /**
     * Extends an onHide event for the page
     */
    onHide?: () => {};
    /**
     * Extends an onShow event for the page
     */
    onShow?: () => {};
    /**
     * Extends an onLoad event for the page
     */
    onLoad?: () => {};
    /**
     * iOS only feature. Assigns several properties to the headerBar; some of them the the controller of the StackRouter:Controller  (visible), some of them to the page.headerBar:NavigationItem (leftItemEnabled, largeTitleDisplayMode) at the onShow event of the page
     */
    headerBarStyle?: Object;
    /**
     * Event before the page instance is created. Useful when modifying route params before the instance is created. Callback function is called with the following arguments: match, routeData, router, view, pageProps, route
     */
    preProcessor?: () => {};
    /**
     * Event after the page instance is created. Useful when modifying page. Callback function is called with the following arguments: match, routeData, router, pageInstance, pageProps, route
     */
    postProcessor?: () => {};
    /**
     * Properties to be assigned to the page instance
     */
    pageProps?: {
        /**
         * When used with goBack, on that page Application.exit is called instead of goBack or dismiss
         */
        shouldExit?: boolean;
    };
}


/**
* Build extender for Router
* @module router
* @type {object}
* @author Alper Ozisik <alper.ozisik@smartface.io>
* @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
* @author Furkan Arabaci <furkan.arabaci@smartface.io>
* @copyright Smartface 2020
* @returns {function} build function for Route
* @example
* import buildExtender from 'sf-extension-utils/lib/router/buildExtender';
* 
* const mainRouter = StackRouter.of({
*     path: "/pages",
*     routes: [
*         Route.of({
*             path: "/pages/accountlist",
*             build: buildExtender({ getPageClass: () => require("pages/pgAccounts") })
* 
*         }),
*         Route.of({
*             path: "/pages/account",
*             build: buildExtender({ getPageClass: () => require("pages/pgAccount") })
*         })
*     ]
* });
* 
* const onboardingRouter = StackRouter.of({
*     path: "/onboarding",
*     routes: [
*         Route.of({
*             path: "/onboarding/login",
*             build: buildExtender({ getPageClass: () => require("pages/pgLogin") })
*         })
*     ]
* });
* 
* const router = Router.of({
*     path: "/",
*     isRoot: true,
*     routes: [
*         onboardingRouter,
*         mainRouter
*     ]
* });
*/
declare function buildExtender(options: IBuildExtenderOptions): () => {};

declare namespace buildExtender{
    /**
     * Gets or sets the list of preProcessors running for each page. Callback(s) are called with the following arguments: match, routeData, router, view, pageProps, route
     * @property {function[]} buildExtender.preProcessors
     * @example
     * import buildExtender from 'sf-extension-utils/lib/router/buildExtender';
     * buildExtender.preProcessors.push((match, routeData, router, view, pageProps, route) => {
     *  //
     * });
     */
    export const preProcessors: () => {}[];

    /**
     * Gets or sets the list of postProcessors running for each page. Callback(s) are called with the following arguments: match, routeData, router, pageInstance, pageProps, route
     * @property {function[]} buildExtender.postProcessors
     * @example
     * import buildExtender from 'sf-extension-utils/lib/router/buildExtender';
     * buildExtender.postProcessors.push((match, routeData, router, pageInstance, pageProps, route) => {
     *  //
     * });
     */
    export const postProcessors: () => {}[];
}

export default buildExtender;