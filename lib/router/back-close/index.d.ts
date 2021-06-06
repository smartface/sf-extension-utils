import Image = require('@smartface/native/ui/image');
import Color = require('@smartface/native/ui/color');
/**
 * Back & close headerbar handling for router
 * @module router
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @copyright Smartface 2019
 */
declare namespace BackClose {
    /**
     * Changes the defult back icon of the StackRouter. This is replacing the constructor of the StackRouter. It should be called before creating any Router to be effective. Calling it after creation of the router has no effect.
     * @public
     * @method
     * @param {object} options - configuration object for setDefaultBackStyle
     * @param {UI.Image} [options.image] - Replaces back icon both iOS & Android
     * @param {boolean} [options.hideTitle=false] - iOS Specific feature. Shows the title of the previous page or not beside the back icon
     * @example
     * import { backClose } from 'sf-extension-utils/lib/router/back-close';
     * backClose.setDefaultBackStyle({image: backArrowImage, hideTitle: true});
     */
    export function setDefaultBackStyle({ image: Image, hideTitle: boolean }): void;

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
    export let dissmissBuilder: (match?: any, routeData?: any, router?: any, pageInstance?: any, pageProps?: any, route?: any) => { image: Image, position: string, color?: Color };
}

export default BackClose;