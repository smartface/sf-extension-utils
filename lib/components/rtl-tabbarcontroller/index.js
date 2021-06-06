/**
 * Smartface RTLTabBarController To Support RIGHT-TO-LEFT Languages
 * @module RTLTabBarController
 * @type {object}
 * @author Muhammed Yalcin Kuru <yalcin.kuru@smartface.io>
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @copyright Smartface 2019
 */

const extend = require("../../../extend");
const TabBarController = require('sf-core/ui/tabbarcontroller');
const System = require("sf-core/device/system");
const Application = require("sf-core/application");
const RTLAndroidSwipeView = require("../rtl-swipeview");

const GRAVITY_RIGHT = 5;
const MODE_SCROLLABLE = 0;
const MODE_FIXED = 1;
const WRAP_CONTENT = -2;
const MATCH_PARENT = -1;

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
 * import RTLTabBarController from "sf-extension-utils/lib/components/rtl-tabbarcontroller";
 *
 * const MyTabBarController = extend(RTLTabBarController)(
 *     function(_super, params) {
 *         _super(this);
 *         this.onPageCreate = function(index) {};
 *     }
 * );
 */
const RTLAndroidTabBarController = extend(TabBarController)(
	function(_super, options = {}) {

		const NativeRelativeLayout = requireClass("android.widget.RelativeLayout");


		this.swipeView = new RTLAndroidSwipeView({
			page: this,
			flexGrow: 1,
			onPageCreate: (position) => this.onPageCreate ? this.onPageCreate(position) : null
		});

		_super(this, options);

		let isRTL = Application.android.getLayoutDirection === Application.LayoutDirection.RIGHTTOLEFT;
		let getArray = (array) => isRTL ? array.reverse() : array;
		let getIndex = (position) => isRTL ? (this.items.length - 1) - position : position;

		let onSelectedCallback, items = [],
			mScrollEnabled = false;
		Object.defineProperties(this, {
			/**
			 * Same as {@link http://ref.smartface.io/#!/api/UI.TabBarController-event-onSelected tabbarcontroller's onSelected}.
			 * @method
			 * @param {number} index 
			 * @public
			 */
			"onSelected": {
				get: () => {
					return onSelectedCallback ?
						(position) => {
							let rPosition = getIndex(position);
							return onSelectedCallback(rPosition);
						} :
						undefined;
				},
				set: (callback) => {
					onSelectedCallback = callback;
				},
				enumerable: true,
				configurable: true
			},
			/**
			 * Similar to {@link http://ref.smartface.io/#!/api/UI.TabBarController-property-items tabbarcontroller's items}. Given items will be reversed then applied in case of direction is RTL.
			 * @property {@link http://ref.smartface.io/#!/api/UI.TabBarItem TabBarItem}
			 * @public
			 */
			"items": {
				get: () => items,
				set: (itemArray) => {
					items = itemArray;
					let rItemArray = getArray(itemArray);
					this.swipeView.pageCount = rItemArray.length;
					this.swipeView.pagerAdapter.notifyDataSetChanged();

					for (let i = 0; i < rItemArray.length; i++) {
						var itemTitle = rItemArray[i].title;
						var itemIcon = rItemArray[i].icon;
						var tabItem = this.tabLayout.nativeObject.getTabAt(i);
						itemTitle && (tabItem.setText(itemTitle));
						itemIcon && (tabItem.setIcon(itemIcon.nativeObject));
					}
					if (!this.autoCapitalize) {
						this.setAllCaps(rItemArray, this.tabLayout.nativeObject);
					}
					this.setSelectedIndex(0, false);
				},
				enumerable: true,
				configurable: true
			},
			"scrollEnabled": {
				get: () => mScrollEnabled,
				set: (value) => {
					mScrollEnabled = value;
					if (value) {
						this.tabLayout.nativeObject.setTabMode(MODE_SCROLLABLE);
						this.tabLayout.nativeObject.setLayoutParams(new NativeRelativeLayout.LayoutParams(WRAP_CONTENT, WRAP_CONTENT));
						alignByDirection(this.divider);
					}
					else {
						this.tabLayout.nativeObject.setTabMode(MODE_FIXED);
						this.tabLayout.nativeObject.setLayoutParams(new NativeRelativeLayout.LayoutParams(MATCH_PARENT, WRAP_CONTENT));
					}
				},
				enumerable: true,
				configurable: true
			}
		});

		function alignByDirection(pmDivirder) {
			if (pmDivirder != null && isRTL)
				pmDivirder.setGravity(GRAVITY_RIGHT);
		}
		alignByDirection(this.divider);

		// Assign parameters given in constructor
		Object.keys(options).forEach((key) => {
			this[key] = options[key];
		});
	}
);

module.exports = System.OS === "Android" ? RTLAndroidTabBarController : TabBarController;
