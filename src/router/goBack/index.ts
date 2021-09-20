/**
 * Adds default goBack action on pages
 * Sets android onBackButtonPressed
 * If a pageInstance has shouldExit, exits the application
 * Handles router.goBack and router.dismiss automatically
 * Custome behaviour can be overwritten by setting pageInstance.goBack
 * @example
 * ```
 * import Page1Design from 'generated/pages/page1';
 * export default class Page1 extends Page1Design {
 * // You should add this function by manual
 *     goBack: () => void;
 *     constructor() {
 *         super();
 *         this.onShow = onShow.bind(this, this.onShow.bind(this));
 *         this.onLoad = onLoad.bind(this, this.onLoad.bind(this));
 *         this.button1.onPress = () => {
 *             this.goBack();
 *         };
 *     }
 * }
 * function onShow(this: Page1, superOnShow: () => void) {
 *     superOnShow();
 * }
 *
 * function onLoad(this: Page1, superOnLoad: () => void) {
 *     superOnLoad();
 * }
 * ``
 * @module router
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @author Berk Baski <berk.baski@smartface.io>
 * @author Furkan Arabacı <furkan.arabaci@smartface.io>
 * @copyright Smartface 2021
 */

import Application from "@smartface/native/application";
import active from "../active";
//@ts-ignore
import StackRouter from "@smartface/router/lib/native/NativeStackRouter";
//@ts-ignore
import BottomTabBarRouter from "@smartface/router/lib/native/BottomTabBarRouter";
import buildExtender from "../buildExtender";

Application.android.onBackButtonPressed = () => {
	active?.page?.goBack && active.page.goBack();
};

const defaultGoBack = () => {
	const { router, match, shouldExit } = active.page;
	if (shouldExit) {
		Application.exit();
		return;
	}
	if (router.constructor.name === 'BottomTabBarRouter') {
		return; // TODO: Find a way to go between BottomTabBarRouters
	}
	if (router.constructor.name === 'NativeStackRouter') {
		let historyAsArray = router.getHistoryasArray();
		if (historyAsArray) {
			if (
				router.isModal() &&
				historyAsArray[0] === match.url &&
				router.dismiss
			) {
				router.dismiss();
			} else {
				active.page.router.canGoBack() && active.page.router.goBack();
			}
		}
	}
};

buildExtender.postProcessors.push(
	(match, routeData, router, pageInstance, pageProps, route) => {
		pageInstance.goBack = defaultGoBack;
	}
);
