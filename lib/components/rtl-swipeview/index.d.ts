/**
 * Smartface RTLSwipeView To Support RIGHT-TO-LEFT Languages
 * @module RTLSwipeView
 * @type {object}
 * @author Muhammed Yalcin Kuru <yalcin.kuru@smartface.io>
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @copyright Smartface 2019
 */
import SwipeView = require("@smartface/native/ui/swipeview");

/**
 * RTLSwipeView class is inherited from SwipeView. It manipulates the index/array 
 * based functions/properties to support RTL languages. Such as, in case of app 
 * direction is RTL, array & index values are reversed.
 * 
 * Note: Returned indexes or arrays won't impact the logic.
 *
 * @public
 * @class
 * @see {@link http://ref.smartface.io/#!/api/UI.SwipeView All supported arguments, properties & methods}
 * @example
 * import RTLSwipeView from 'sf-extension-utils/lib/components/rtl-swipeview';
 * 
 * var swipeView = new RTLSwipeView({
 *     page: currentPage,
 *     width: 300,
 *     maxHeight: 300,
 *     pages: [Page1, Page2, Page3, Page4]
 * });
 * 
 * swipeView.onPageSelected = function(index, page) {
 *     console.info(`page index ${index}`);
 * };
 */

export default class extends SwipeView {
    constructor();
}

/**
 * Disclaimer to developer: 
 * Since the class is extended from SwipeView and has no extra properties for Android,
 * Just exporting it as a child class is enough. 
 */