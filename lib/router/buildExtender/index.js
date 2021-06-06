/**
 * Build extender for Router
 * @module router
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @author Furkan Arabaci <furkan.arabaci@smartface.io>
 * @copyright Smartface 2019
 */

const View = require("@smartface/native/ui/view");
const System = require("@smartface/native/device/system");
const active = require("../active");
const extendEvent = require("../../extendEvent");
const StackRouter = require("@smartface/router/src/native/NativeStackRouter");

/**
 * Generates build method for Router - Route.
 * Page constructor is called with the following arguments in order: pageProps, match, routeData, router, route.
 * Page(s) created with this function will have additional several properties: match, routeData, router, pageName, route
 * 
 * @public
 * @method
 * @param {object} options - buildExtender configurator
 * @param {string} options.getPageClass - Returns the class of the page. This used for lazy loading of a page file and helps the performance.
 * @param {boolean} [options.singleton=false] - Same instance of the page will be used again and again for the same route. It is advised to use a singleton page for each first Route of a StackRouter
 * @param {function} [options.onHide] - Extends an onHide event for the page
 * @param {function} [options.onShow] - Extends an onShow event for the page
 * @param {function} [options.onLoad] - Extends an onLoad event for the page
 * @param {object} [options.headerBarStyle={}] - iOS only feature. Assigns several properties to the headerBar; some of them the the controller of the StackRouter:Controller  (visible), some of them to the page.headerBar:NavigationItem (leftItemEnabled, largeTitleDisplayMode) at the onShow event of the page
 * @param {function} [options.preProcessor] - Event before the page instance is created. Useful when modifying route params before the instance is created. Callback function is called with the following arguments: match, routeData, router, view, pageProps, route
 * @param {function} [options.postProcessor] - Event after the page instance is created. Useful when modifying page. Callback function is called with the following arguments: match, routeData, router, pageInstance, pageProps, route
 * @param {object} [options.pageProps={}] - Properties to be assigned to the page instance
 * @param {boolean} [options.pageProps.shouldExit] - When used with goBack, on that page Application.exit is called instead of goBack or dismiss
 * @returns {function} build function for Route
 * @example
 * import buildExtender from "sf-extension-utils/lib/router/buildExtender";
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
const buildExtender = ({
    getPageClass,
    pageName,
    singleton = false,
    onHide,
    onShow,
    onLoad,
    headerBarStyle = {},
    preProcessor,
    postProcessor,
    pageProps = {}
}) => {
    let builder = (router, route) => {
        let { routeData, match, view } = route.getState();
        if (routeData && routeData.routeData)
            routeData = routeData.routeData;
        routeData = routeData || {};

        preProcessor && preProcessor(match, routeData, router, view, pageProps, route);
        buildExtender.preProcessors.forEach(pp => pp(match, routeData, router, view, pageProps, route));
        let pageInstance;

        if (view && singleton) {
            pageInstance = view;
        }
        else {
            let PageClass = getPageClass ? getPageClass() : require("pages/" + pageName);
            pageInstance = new PageClass(pageProps, match, routeData, router, route);
            pageInstance.pageName = pageName;
        }
        if (!pageInstance.extendEvent) {
            pageInstance.extendEvent = extendEvent.bind(null, pageInstance);

            let originalDidEnter = route._routeDidEnter;
            route._routeDidEnter = (router, route) => {
                let returnValue = originalDidEnter ? originalDidEnter(router, route) : true;
                pageInstance &&
                    (active.page = pageInstance);
                return returnValue;
            };

            if (System.OS === "iOS") {
                let pageHeaderbarStyle = {};
                ["leftItemEnabled", "largeTitleDisplayMode"]
                .forEach(key => {
                    if (headerBarStyle.hasOwnProperty(key))
                        pageHeaderbarStyle[key] = headerBarStyle[key];
                });
                if (Object.keys(pageHeaderbarStyle).length) {
                    pageInstance.extendEvent("onLoad", () => {
                        pageInstance.headerBar.dispatch({
                            type: "updateUserStyle",
                            userStyle: pageHeaderbarStyle
                        });
                    });
                }

                let controllerHeaderbarStyle = {};
                ["visible"]
                .forEach(key => {
                    if (headerBarStyle.hasOwnProperty(key))
                        controllerHeaderbarStyle[key] = headerBarStyle[key];
                });
                if (Object.keys(controllerHeaderbarStyle).length && router.headerBar) {
                    pageInstance.extendEvent("onShow", () => {
                        Object.assign(router.headerBar, controllerHeaderbarStyle);
                    });
                }

            }

            onHide && pageInstance.extendEvent("onHide", onHide);
            onShow && pageInstance.extendEvent("onShow", onShow);
            onLoad && pageInstance.extendEvent("onLoad", onLoad);

            pageInstance.extendEvent("onLoad", () => {
                if (System.OS == "iOS") {
                    if (pageInstance.parentController && pageInstance.parentController.childControllers[0] === pageInstance) {
                        var view = pageInstance.parentController.nativeObject.valueForKey("view");
                        view && view.setValueForKey(View.ios.viewAppearanceSemanticContentAttribute, "semanticContentAttribute");
                    }
                }
            });
        }

        router instanceof StackRouter &&
            (pageInstance.setBackItem = (item) => {

            });

        Object.assign(pageInstance, { match, routeData, router, route }, pageProps);

        buildExtender.postProcessors.forEach(pp => pp(match, routeData, router, pageInstance, pageProps, route));
        postProcessor && postProcessor(match, routeData, router, pageInstance, pageProps, route);

        return pageInstance;
    };
    return builder;
};

module.exports = exports = buildExtender;

/**
 * Gets or sets the list of preProcessors running for each page. Callback(s) are called with the following arguments: match, routeData, router, view, pageProps, route
 * @property {function[]} buildExtender.preProcessors
 * @example
 * import buildExtender from "sf-extension-utils/lib/router/buildExtender";
 * buildExtender.preProcessors.push((match, routeData, router, view, pageProps, route) => {
 *  //
 * });
 */
buildExtender.preProcessors = [];

/**
 * Gets or sets the list of postProcessors running for each page. Callback(s) are called with the following arguments: match, routeData, router, pageInstance, pageProps, route
 * @property {function[]} buildExtender.postProcessors
 * @example
 * import buildExtender from "sf-extension-utils/lib/router/buildExtender";
 * buildExtender.postProcessors.push((match, routeData, router, pageInstance, pageProps, route) => {
 *  //
 * });
 */
buildExtender.postProcessors = [];
