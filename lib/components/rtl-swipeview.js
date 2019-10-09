/**
 * Smartface RTLSwipeView To Support RIGHT-TO-LEFT Languages
 * @module RTLSwipeView
 * @type {object}
 * @author Muhammed Yalcin Kuru <yalcin.kuru@smartface.io>
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @copyright Smartface 2019
 */

const Application = require("sf-core/application");
const extend = require("js-base/core/extend");
const SwipeView = require("sf-core/ui/swipeview");
const System = require("sf-core/device/system");

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
 * const RTLSwipeView = require("sf-extension-utils/lib/components/rtl-swipeview");
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

const RTLAndroidSwipeView = extend(SwipeView)(
	function(_super, options = {}) {
		_super(this, options);

		const AndroidUnitConverter = require("sf-core/util/Android/unitconverter");

		let callbackOnPageSelected,
			_pages = [],
			callbackOnPageScrolled;

		let isRTL = () => Application.android.getLayoutDirection === Application.LayoutDirection.RIGHTTOLEFT;
		let getPageLength = () => this.pageCount ? this.pageCount : this.pages.length;
		let getOffsetPixels = (offsetPixels) => isRTL() ? AndroidUnitConverter.pixelToDp(this.nativeObject.getWidth()) - offsetPixels : offsetPixels;
		let getIndex = (position) => isRTL() ? (getPageLength() - 1) - position : position;


		Object.defineProperties(this, {
			/**
			 * Same as {@link http://ref.smartface.io/#!/api/UI.SwipeView-event-onPageSelected swipeview's onPageSelected}
			 * @method
			 * @param {number} index 
			 * @param {object} page
			 * @public
			 */
			"onPageSelected": {
				get: () => {
					return callbackOnPageSelected ?
						(position, pageInstance) => {
							let rPosition = getIndex(position);
							callbackOnPageSelected(rPosition, this.pageInstances[position]);
						} :
						undefined;
				},
				set: (callback) => {
					callbackOnPageSelected = callback;
				},
				enumerable: true,
				configurable: true
			},
			/**
			 * Similar to {@link http://ref.smartface.io/#!/api/UI.SwipeView-property-pages swipeview's pages}. In case of 
			 * app direction is RTL, given array will be reversed then applied and then swiped last index. Otherwise as it's.
			 * @property {array}
			 * @public
			 */
			"pages": {
				get: function() {
					return _pages;
				},
				set: (pages) => {
					if (pages instanceof Array) {
						if (pages.length < 1)
							throw new TypeError("Array parameter cannot be empty.");
						_pages = pages;
						this.pagerAdapter.notifyDataSetChanged();
						this.swipeToIndex(0, false); //Last index of swipe view
					}
				},
				enumerable: true,
				configurable: true
			},
			/**
			 * Same as {@link http://ref.smartface.io/#!/api/UI.SwipeView-property-currentIndex swipeview's currentIndex}
			 * @property {number}
			 * @public
			 */
			"currentIndex": {
				get: () => getIndex(this.nativeObject.getCurrentItem()),
				enumerable: true,
				configurable: true
			},
			/**
			 * Same as {@link http://ref.smartface.io/#!/api/UI.SwipeView-method-swipeToIndex swipeview's swipeToIndex}. To swipe, pages/pageCount properties must be assigned already.
			 * @method
			 * @param {number} index - Given index reversed in case of RTL. Otherwise as it is.
			 * @param {boolean} animated - Swipes either with animation or directly.
			 * @public
			 */
			"swipeToIndex": {
				value: (index, animated = false) => this.nativeObject.setCurrentItem(getIndex(index), animated)
			},
			/**
			 * Same as {@link http://ref.smartface.io/#!/api/UI.SwipeView-event-onPageScrolled swipeview's onPageScrolled}.
			 * @method
			 * @param {number} index
			 * @param {number} offset
			 * @public
			 */
			"onPageScrolled": {
				get: () => {
					return callbackOnPageScrolled ?
						(position, offsetPixels) => {
							let rPosition = getIndex(position);
							//Re-look at here!
							let rOffsetPixels = getOffsetPixels(offsetPixels);
							callbackOnPageScrolled(rPosition, rOffsetPixels);
						} :
						undefined;
				},
				set: (callback) => {
					callbackOnPageScrolled = callback;
				},
				enumerable: true,
				configurable: true
			}
		});

		let getPageInstanceFunc = this.getPageInstance.bind(this);
		this.getPageInstance = (position) => {
			let rPosition = getIndex(position);
			return getPageInstanceFunc(rPosition);
		};

		Object.keys(options).forEach((key) => {
			this[key] = options[key];
		});
	}
);

module.exports = System.OS === "Android" ? RTLAndroidSwipeView : SwipeView;
