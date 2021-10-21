/**
 * Back & close headerbar handling for router
 * @module router
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @author Furkan Arabacı <furkan.arabaci@smartface.io>
 * @copyright Smartface 2021
 */

import Image from "@smartface/native/ui/image";
import Color from "@smartface/native/ui/color";
import HeaderBarItem from "@smartface/native/ui/headerbaritem";
import System from "@smartface/native/device/system";
import { NativeStackRouter } from "@smartface/router";
import buildExtender from "../buildExtender";

enum DismissPosition {
	LEFT,
	RIGHT,
};

let backArrowImage: Image = Image.createFromFile("images://arrow_back.png");
let hideBackBarButton = false;

type DismissBuilderOptions = {
	image?: Image;
	position: DismissPosition;
	color?: Color;
	skip?: boolean;
	text?: string;
	retrieveItem?: (...args: any) => void;
	doNotDisableLeftItem?: boolean;
};

let dissmissBuilder: (
	match?: any,
	routeData?: any,
	router?: any,
	pageInstance?: any,
	pageProps?: any,
	route?: any
) => DismissBuilderOptions = defaultDissmissBuilder;

function defaultDissmissBuilder(
	match: any,
	routeData: any,
	router: any,
	pageInstance: any,
	pageProps: any,
	route: any
): DismissBuilderOptions {
	return {
		//@ts-ignore
		text: global.lang.done || 'Done',
		position: System.OS === System.OSType.IOS ? DismissPosition.LEFT : DismissPosition.RIGHT,
	};
}

if (System.OS === System.OSType.IOS) {
	let original_StackRouter_of = NativeStackRouter.of;
	NativeStackRouter.of = (props: any) => {
		let stackRouter = original_StackRouter_of(props);
		//@ts-ignore
		if (backArrowImage && stackRouter.headerBar?.nativeObject) {
			//@ts-ignore
			Object.assign(stackRouter.headerBar.nativeObject, {
				//@ts-ignore
				backIndicatorImage: backArrowImage.nativeObject,
				//@ts-ignore
				backIndicatorTransitionMaskImage: backArrowImage.nativeObject,
			});
		}
		return stackRouter;
	};
}

function backClose(
	match?: any,
	routeData?: any,
	router?: any,
	pageInstance?: any,
	pageProps?: any,
	route?: any
) {
	if (pageInstance.__backCloseAdded) {
		return;
	}
	if (router instanceof NativeStackRouter) {
		const dismissConfig = (dissmissBuilder || defaultDissmissBuilder)(
			match,
			routeData,
			router,
			pageInstance,
			pageProps,
			route
		);
		if (dismissConfig.skip) {
			return;
		}
		if (System.OS === System.OSType.ANDROID) {
			if (router.getHistoryasArray()[0] === match.url) {
				// First item in the stack
				if (router.isModal()) {
					pageInstance.extendEvent("onLoad", () => {
						const hbi = new HeaderBarItem({
							color: dismissConfig.color || null,
							image: dismissConfig.image || null,
							title: dismissConfig.text || null,
							onPress: () => {
								if (pageInstance.goBack) {
									pageInstance.goBack();
								} else {
									router.dismiss && router.dismiss();
								}
							},
						});
						if (dismissConfig.position === DismissPosition.LEFT) {
							pageInstance.headerBar.setLeftItem(hbi);
							pageInstance.headerBar.leftItemEnabled = true;
						} else {
							pageInstance.headerBar.setItems([hbi]);
							pageInstance.headerBar.leftItemEnabled = false;
						}
						dismissConfig.retrieveItem && dismissConfig.retrieveItem(hbi);
					});
				} else if (!dismissConfig.doNotDisableLeftItem) {
					pageInstance.extendEvent("onLoad", () => {
						pageInstance.headerBar.leftItemEnabled = false;
					});
				}
			} else {
				pageInstance.extendEvent("onLoad", () => {
						let hbi = new HeaderBarItem({
							image: backArrowImage,
							onPress: () => {
								if (pageInstance.goBack) {
									pageInstance.goBack();
								} else {
									router.goBack();
								}
							},
						});
						pageInstance.headerBar.setLeftItem(hbi);
						pageInstance.headerBar.leftItemEnabled = true;
				});
			}
		} else if (System.OS === System.OSType.IOS) {
			if (router.getHistoryasArray()[0] === match.url) {
				// First item in the stack
				if (router.isModal()) {
					pageInstance.extendEvent("onLoad", () => {
						let hbi = new HeaderBarItem({
							color: dismissConfig.color || null,
							image: dismissConfig.image || null,
							title: dismissConfig.text || null,
							onPress: () => {
								if (pageInstance.goBack) {
									pageInstance.goBack();
								} else {
									router.dismiss && router.dismiss();
								}
							},
						});
						if (dismissConfig.position === DismissPosition.LEFT) {
							pageInstance.headerBar.setLeftItem(hbi);
							pageInstance.headerBar.leftItemEnabled = true;
						} else {
							pageInstance.headerBar.setItems([hbi]);
							pageInstance.headerBar.leftItemEnabled = true;
						}
						dismissConfig.retrieveItem && dismissConfig.retrieveItem(hbi);
					});
				}
			}
			if (hideBackBarButton) {
				let backBarButtonItem = new HeaderBarItem({
					title: "",
				});
				pageInstance.headerBar.ios.backBarButtonItem = backBarButtonItem;
			}
		}
	}
	pageInstance.__backCloseAdded = true;
}

buildExtender.postProcessors.push(backClose);

export default class BackClose {
	/**
	 * @public
	 *  * callback event function used to customise the default dissmiss behaviour for a modal & stack router.
	 * That build method takes match, routeData, router, pageInstance, pageProps, route.
	 * Arguments are used to shape the returning configuration object with image or text and position.
	 * Image and text should be used exclusively. Position is a string enumeration "left" or "right".
	 * This configurator is used to shape the HeaderbarItem.
	 * The returned object might have retrieveItem method; in that case retrieveItem is called after the headerbarItem is created and given as an argument.
	 * If this is not set, default configuration will be used: left side text = done
	 *
	 * @example
	 * ```
	 * import backClose from "@smartface/extension-utils/lib/router/back-close";
	 * backClose.dissmissBuilder = (match, routeData, router, pageInstance, pageProps, route) => {
	 *  if(System.OS === "iOS") {
	 *   if(match.url !== "specificPage")
	 *      return {text: global.lang.done, position: "right"};
	 *   else
	 *      return {image: closeImage, position: "left"};
	 *  }
	 *  else return {image: closeImage, position: "left", color: Color.WHITE};
	 * };
	 * ```
	 */
	static set dismissBuilder(value: typeof dissmissBuilder) {
		dissmissBuilder = value;
	}
	static get dismissBuilder(): typeof dissmissBuilder {
		return dissmissBuilder;
	}
	
	/**
	 * Changes the defult back icon of the StackRouter. This is replacing the constructor of the StackRouter. It should be called before creating any Router to be effective. Calling it after creation of the router has no effect.
	 * @public
	 * @example
	 * ```
	 * import { backClose } from '@smartface/extension-utils/lib/router/back-close';
	 * backClose.setDefaultBackStyle({image: backArrowImage, hideTitle: true});
	 * ```
	 */
	static setDefaultBackStyle(opts: {
		image?: Image;
		hideTitle: boolean;
	}): void {
		backArrowImage = opts.image || backArrowImage;
		hideBackBarButton = opts.hideTitle;
	}

	static DismissPosition = DismissPosition
}