/**
 * Back & close headerbar handling for router
 * @module router
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @copyright Smartface 2019
 */

const HeaderBarItem = require("sf-core/ui/headerbaritem");
const System = require("sf-core/device/system");
const StackRouter = require("@smartface/router/src/native/NativeStackRouter");
var backArrowImage = null;
var dissmissBuilder = null;
var hideBackBarButton = false;
const buildExtender = require("../buildExtender");

const POSITION = {
    LEFT: "left",
    RIGHT: "right"
};


/**
 * Changes the defult back icon of the StackRouter. This is replacing the constructor of the StackRouter. It should be called before creating any Router to be effective. Calling it after creation of the router has no effect.
 * @public
 * @method
 * @param {object} options - configuration object for setDefaultBackStyle
 * @param {UI.Image} [options.image] - Replaces back icon both iOS & Android
 * @param {boolean} [options.hideTitle=false] - iOS Specific feature. Shows the title of the previous page or not beside the back icon
 * @example
 * const backClose = require("sf-extension-utils/lib/router/back-close");
 * backClose.setDefaultBackStyle({image: backArrowImage, hideTitle: true});
 */
const setDefaultBackStyle = ({
    image = null,
    hideTitle = false
}) => {
    backArrowImage = image;
    hideBackBarButton = hideTitle;
};

const defaultDissmissBuilder = (match, routeData, router, pageInstance, pageProps, route) => {
    let position = POSITION.RIGHT;
    if (System.OS === "iOS")
        position = POSITION.LEFT;
    return {
        //image: new Image(),
        text: global.lang.done,
        position
    };
};

if (System.OS === "iOS") {
    let original_StackRouter_of = StackRouter.of;
    StackRouter.of = (props) => {
        let stackRouter = original_StackRouter_of(props);
        backArrowImage && Object.assign(stackRouter.headerBar.nativeObject, {
            backIndicatorImage: backArrowImage.nativeObject,
            backIndicatorTransitionMaskImage: backArrowImage.nativeObject
        });
        return stackRouter;
    };
}

const backClose = (match, routeData, router, pageInstance, pageProps, route) => {
    if (pageInstance.__backCloseAdded) {
        return;
    }
    if (router instanceof StackRouter) {
        let dismissConfig = (dissmissBuilder || defaultDissmissBuilder)(match, routeData, router, pageInstance, pageProps, route);
        if (dismissConfig.skip)
            return;
        if (System.OS === "Android") {
            if (router.getHistoryasArray()[0] === match.url) { // First item in the stack
                if (router.isModal()) {
                    pageInstance.extendEvent("onLoad", () => {
                        let hbi = new HeaderBarItem({
                            color: dismissConfig.color || null,
                            image: dismissConfig.image || null,
                            title: dismissConfig.text || null,
                            onPress: () => {
                                if (pageInstance.goBack) {
                                    pageInstance.goBack();
                                }
                                else {
                                    router.dismiss && router.dismiss();
                                }
                            }
                        });
                        if (dismissConfig.position === POSITION.LEFT) {
                            pageInstance.headerBar.setLeftItem(hbi);
                            pageInstance.headerBar.leftItemEnabled = true;
                        }
                        else {
                            pageInstance.headerBar.setItems([hbi]);
                            pageInstance.headerBar.leftItemEnabled = false;
                        }
                        dismissConfig.retrieveItem &&
                            dismissConfig.retrieveItem(hbi);
                    });
                }
                else if (!dismissConfig.doNotDisableLeftItem) {
                    pageInstance.extendEvent("onLoad", () => {
                        pageInstance.headerBar.leftItemEnabled = false;
                    });
                }
            }
            else {
                pageInstance.extendEvent("onLoad", () => {
                    if (backArrowImage) {
                        let hbi = new HeaderBarItem({
                            image: backArrowImage,
                            onPress: () => {
                                if (pageInstance.goBack) {
                                    pageInstance.goBack();
                                }
                                else {
                                    router.goBack();
                                }
                            }
                        });
                        pageInstance.headerBar.setLeftItem(hbi);
                        pageInstance.headerBar.leftItemEnabled = true;
                    }
                });
            }
        }
        else if (System.OS === "iOS") {
            if ((router.getHistoryasArray()[0]) === match.url) { // First item in the stack
                if (router.isModal()) {
                    pageInstance.extendEvent("onLoad", () => {
                        let hbi = new HeaderBarItem({
                            color: dismissConfig.color || null,
                            image: dismissConfig.image || null,
                            title: dismissConfig.text || null,
                            onPress: () => {
                                if (pageInstance.goBack) {
                                    pageInstance.goBack();
                                }
                                else {
                                    router.dismiss && router.dismiss();
                                }
                            }
                        });
                        if (dismissConfig.position === POSITION.LEFT) {
                            pageInstance.headerBar.setLeftItem(hbi);
                            pageInstance.headerBar.leftItemEnabled = true;
                        }
                        else {
                            pageInstance.headerBar.setItems([hbi]);
                            pageInstance.headerBar.leftItemEnabled = true;
                        }
                        dismissConfig.retrieveItem &&
                            dismissConfig.retrieveItem(hbi);
                    });


                }

            }
            if (hideBackBarButton) {
                let backBarButtonItem = new HeaderBarItem({
                    title: ""
                });
                pageInstance.headerBar.ios.backBarButtonItem = backBarButtonItem;
            }

        }
    }
    pageInstance.__backCloseAdded = true;
};


buildExtender.postProcessors.push(backClose);


exports.setDefaultBackStyle = setDefaultBackStyle;

/**
 * @public
 * @static
 * @property {function} dissmissBuilder - callback event function used to customise the default dissmiss behaviour for a modal & stack router. That build method takes match, routeData, router, pageInstance, pageProps, route. Arguments are used to shape the returning configuration object with image or text and position. Image and text should be used exclusively. Position is a string enumeration "left" or "right". This configurator is used to shape the HeaderbarItem. The returned object might have retrieveItem method; in that case retrieveItem is called after the headerbarItem is created and given as an argument. If this is not set, default configuration will be used: left side text = done
 * @example
 * const backClose = require("sf-extension-utils/lib/router/back-close");
 * backClose.dissmissBuilder = (match, routeData, router, pageInstance, pageProps, route) => {
 *  if(System.OS === "iOS") {
 *   if(match.url !== "specificPage")
 *      return {text: global.lang.done, position: "right"};
 *   else
 *      return {image: closeImage, position: "left"};
 *  }
 *  else return {image: closeImage, position: "left", color: Color.WHITE};
 * };
 */
exports.dissmissBuilder = null;
Object.defineProperty(exports, "dissmissBuilder", {
    get: () => dissmissBuilder,
    set: value => dissmissBuilder = value,
    configurable: false,
    enumerable: true
});
