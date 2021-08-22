import System from "@smartface/native/device/system";
import Page from "@smartface/native/ui/page";
import View from "@smartface/native/ui/view";
//@ts-ignore
import StackRouter from "@smartface/router/src/native/NativeStackRouter";
import extendEvent from "extendEvent";
import active from "router/active";

interface ProcessorOptions {
	(
		match: any,
		routeData: { [key: string]: any },
		router: any,
		view: any,
		pageProps: { [key: string]: any },
		route: any
	): void;
}

interface IBuildExtenderOptions {
	/**
	 * Returns the class of the page. This used for lazy loading of a page file and helps the performance.
	 */
	getPageClass: () => typeof Page;
	/**
	 * Same instance of the page will be used again and again for the same route.
	 * It is advised to use a singleton page for each first Route of a StackRouter
	 */
	singleton?: boolean;
	/**
	 * Extends an onHide event for the page
	 */
	onHide?: () => void;
	/**
	 * Extends an onShow event for the page
	 */
	onShow?: () => void;
	/**
	 * Extends an onLoad event for the page
	 */
	onLoad?: () => void;
	/**
	 * iOS only feature.
	 * Assigns several properties to the headerBar; some of them the the controller of the StackRouter:Controller  (visible), some of them to the page.headerBar:NavigationItem (leftItemEnabled, largeTitleDisplayMode) at the onShow event of the page
	 */
	headerBarStyle?: { [key: string]: any };
	/**
	 * Event before the page instance is created.
	 * Useful when modifying route params before the instance is created.
	 * Callback function is called with the following arguments: match, routeData, router, view, pageProps, route
	 */
	preProcessor?: ProcessorOptions;
	/**
	 * Event after the page instance is created. Useful when modifying page. Callback function is called with the following arguments: match, routeData, router, pageInstance, pageProps, route
	 */
	postProcessor?: ProcessorOptions;
	/**
	 * Properties to be assigned to the page instance
	 * When property shouldExit is used with goBack, on that page Application.exit is called instead of goBack or dismiss
	 */
	pageProps?: { [key: string]: any };
	/**
	 * Pagename to be passed on the components and the page on constructor.
	 * Should be defined while building test automation process
	 */
	pageName?: string;
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
 * ```
 * import buildExtender from '@smartface/extension-utils/lib/router/buildExtender';
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
 * ```
 */
function buildExtender(
	options: IBuildExtenderOptions
): (router: any, route: any) => Page {
	function builder(router: any, route: any) {
		let { routeData, match, view } = route.getState();
		const pageProps = options.pageProps || {};
		if (routeData && routeData.routeData) routeData = routeData.routeData;
		routeData = routeData || {};

		options.preProcessor &&
			options.preProcessor(match, routeData, router, view, pageProps, route);
		buildExtender.preProcessors.forEach((pp) =>
			pp(match, routeData, router, view, pageProps, route)
		);
		let pageInstance: typeof active.page

		if (view && options.singleton) {
			pageInstance = view;
		} else {
			let PageClass = options.getPageClass
				? options.getPageClass()
				: require("pages/" + options.pageName);
			pageInstance = new PageClass(
				options.pageProps,
				match,
				routeData,
				router,
				route
			);
			pageInstance.pageName = options.pageName;
		}
		if (!pageInstance.extendEvent) {
			pageInstance.extendEvent = extendEvent.bind(null, pageInstance);

			let originalDidEnter = route._routeDidEnter;
			route._routeDidEnter = (router: any, route: any) => {
				let returnValue = originalDidEnter
					? originalDidEnter(router, route)
					: true;
				pageInstance && (active.page = pageInstance);
				return returnValue;
			};

			if (System.OS === System.OSType.IOS) {
				let pageHeaderbarStyle = {};
				["leftItemEnabled", "largeTitleDisplayMode"].forEach((key) => {
					if (options?.headerBarStyle?.hasOwnProperty(key))
						//@ts-ignore
						pageHeaderbarStyle[key] = headerBarStyle[key];
				});
				if (Object.keys(pageHeaderbarStyle).length) {
					pageInstance.extendEvent("onLoad", () => {
						//@ts-ignore
						pageInstance.headerBar.dispatch({
							type: "updateUserStyle",
							userStyle: pageHeaderbarStyle,
						});
					});
				}

				let controllerHeaderbarStyle = {};
				["visible"].forEach((key) => {
					if (options?.headerBarStyle?.hasOwnProperty(key))
						//@ts-ignore
						controllerHeaderbarStyle[key] = headerBarStyle[key];
				});
				if (Object.keys(controllerHeaderbarStyle).length && router.headerBar) {
					pageInstance.extendEvent("onShow", () => {
						Object.assign(router.headerBar, controllerHeaderbarStyle);
					});
				}
			}

			options.onHide && pageInstance.extendEvent("onHide", options.onHide);
			options.onShow && pageInstance.extendEvent("onShow", options.onShow);
			options.onLoad && pageInstance.extendEvent("onLoad", options.onLoad);

			pageInstance.extendEvent("onLoad", () => {
				if (System.OS == System.OSType.IOS) {
					if (
						pageInstance.parentController?.childControllers[0] === pageInstance
					) {
						const view = pageInstance.parentController.nativeObject.valueForKey(
							"view"
						);
						view &&
							view.setValueForKey(
								View.ios.viewAppearanceSemanticContentAttribute,
								"semanticContentAttribute"
							);
					}
				}
			});
		}

		router instanceof StackRouter && (pageInstance.setBackItem = (item: any) => {});

		Object.assign(pageInstance, { match, routeData, router, route }, pageProps);

		buildExtender.postProcessors.forEach((pp) =>
			pp(match, routeData, router, pageInstance, pageProps, route)
		);
		options.postProcessor &&
			options.postProcessor(match, routeData, router, pageInstance, pageProps, route);

		return pageInstance;
	}
	return builder;
}

namespace buildExtender {
	/**
	 * Gets or sets the list of preProcessors running for each page. Callback(s) are called with the following arguments: match, routeData, router, view, pageProps, route
	 * @property {function[]} buildExtender.preProcessors
	 * @example
	 * ```
	 * import buildExtender from '@smartface/extension-utils/lib/router/buildExtender';
	 * buildExtender.preProcessors.push((match, routeData, router, view, pageProps, route) => {
	 *  //
	 * });
	 * ```
	 */
	export const preProcessors: ProcessorOptions[] = [];

	/**
	 * Gets or sets the list of postProcessors running for each page. Callback(s) are called with the following arguments: match, routeData, router, pageInstance, pageProps, route
	 * @property {function[]} buildExtender.postProcessors
	 * @example
	 * ```
	 * import buildExtender from '@smartface/extension-utils/lib/router/buildExtender';
	 * buildExtender.postProcessors.push((match, routeData, router, pageInstance, pageProps, route) => {
	 *  //
	 * });
	 * ```
	 */
	export const postProcessors: ProcessorOptions[] = [];
}

export default buildExtender;
