/**
 * Smartface RTLTabBarController To Support RIGHT-TO-LEFT Languages
 * @module RTLTabBarController
 * @type {object}
 * @author Muhammed Yalcin Kuru <yalcin.kuru@smartface.io>
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @copyright Smartface 2019
 */

import TabBarController = require('sf-core/ui/tabbarcontroller');
import RTLAndroidSwipeView from '../rtl-swipeview';

/** 
 * RTLTabBarController class is inherited from TabBarController. It manipulates
 * the index/array based functions/properties to support RTL languages. Such as,
 * in case of app direction is RTL, array & index values are reversed.
 *
 * Note: Returned indexes or arrays won't impact the logic.
 * 
 * @public
 * @class
 * @see {@link http://ref.smartface.io/#!/api/UI.TabBarController arguments, properties & methods}
 * @example
 * 
 * import RTLTabBarController from 'sf-extension-utils/lib/components/rtl-tabbarcontroller';
 * 
 * class MyTabBarController extends RTLTabBarController {
 *     constructor() {
 *         super();
 *         this.onPageCreate = (index) => {}
 *     }
 * } 
 */
export default class extends TabBarController {
    constructor();
}

/**
 * Disclaimer to developer: 
 * Since the class is extended from SwipeView and has no extra properties for Android,
 * Just exporting it as a child class is enough. 
 */