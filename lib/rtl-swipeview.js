/**
 * Smartface RTLSwipeView To Support RIGHT-TO-LEFT Languages
 * @module RTLSwipeView
 * @type {function}
 * @author Muhammed Yalcin Kuru <yalcin.kuru@smartface.io>
 * @copyright Smartface 2019
 */

const Application = require("sf-core/application");
const extend = require("js-base/core/extend");
const SwipeView = require("sf-core/ui/swipeview");
const System = require("sf-core/device/system");

/**
 * RTLSwipeView class is inherited from SwipeView. It manipulates the index/array based functions/property to supports RTL languages. Such as, in case of app direction RTL, 
 * applyies array & index as reversed. So that enables the SwipeView component looks like moving RIGTH-TO-LEFT. 
 * 
 * Note: Returned indexes or arrays won't impact the logic.
 * 
 * @public
 * @class
 * @see {@link http://ref.smartface.io/#!/api/UI.SwipeView All arguments, properties & functions}
 * @example
 * //Pages to apply swipeview
 * var Page1 = extend(Page)(
 *     function(_super, params) {
 *         _super(this, params);
 *         this.onLoad = function() {
 *             this.theName = "Page1";
 *             this.layout.backgroundColor = Color.RED;
 *         }.bind(this);
 *     }
 * );
 * var Page2 = extend(Page)(
 *     function(_super, params) {
 *         _super(this, params);
 *         this.onLoad = function() {
 *             this.theName = "Page2";
 *             this.layout.backgroundColor = Color.YELLOW;
 *         }.bind(this);
 *     }
 * );
 * var Page3 = extend(Page)(
 *     function(_super, params) {
 *         _super(this, params);
 *         this.onLoad = function() {
 *             this.theName = "Page3";
 *             this.layout.backgroundColor = Color.BLUE;
 *         }.bind(this);
 *     }
 * );
 * var Page4 = extend(Page)(
 *     function(_super, params) {
 *         _super(this, params);
 *         this.onLoad = function() {
 *             this.theName = "Page4";
 *             this.layout.backgroundColor = Color.GREEN;
 *         }.bind(this);
 *     }
 * );
 * 
 * const RTLSwipeView = require("sf-extension-utils/lib/rtl-swipeview");
 * 
 * var swipeView = new RTLSwipeView({
 *     page: YourCurrentPage,
 *     width: 400,
 *     maxHeight: 600,
 *     marginTop: 50,
 *     pages: [Page1, Page2, Page3, Page4]
 * });
 * swipeView.onPageSelected = function(position, pageInstance) {
 *     console.log("position " + position + " page instance " + pageInstance.theName);
 *     console.log("swipeView current index " + swipeView.currentIndex);
 * };
 * swipeView.onPageScrolled = (position, offsetPixels) => {
 *     console.log(" position  " + position + " offsetPixels " + offsetPixels);
 * };
 * 
 * 
 * 
 */
const RTLAndroidSwipeView = extend(SwipeView)(
	function(_super, options = {}) {
		_super(this, options);

		const AndroidUnitConverter = require("sf-core/util/Android/unitconverter");

		let callbackOnPageSelected,
			pages = [],
			onPageCreateCallback,
			callbackOnPageScrolled;

		let isRTL = () => Application.android.getLayoutDirection === Application.LayoutDirection.RIGHTTOLEFT;
		let getPageLength = () => this.pageCount ? this.pageCount : this.pages.length;
		let getArray = (array) => isRTL() ? array.reverse() : array;
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
				get: () => pages,
				set: (pages) => {
					if (pages instanceof Array) {
						if (pages.length < 1)
							throw new TypeError("Array parameter cannot be empty.");
						pages = getArray(pages);
						this.pagerAdapter.notifyDataSetChanged();
						this.swipeToIndex(0, false); //Last index of swipe view
					}
				},
				enumerable: true,
				configurable: true
			},
			/**
			 * Same as {@link http://ref.smartface.io/#!/api/UI.TabBarController-event-onPageCreate tabbarcontroller's onPageCreate}
			 * @method
			 * @param {number} index
			 * @public
			 */
			"onPageCreate": {
				get: () => {
					return onPageCreateCallback ?
						(position) => {
							let rPosition = getIndex(position);
							return onPageCreateCallback(rPosition);
						} :
						undefined;
				},
				set: (callback) => {
					onPageCreateCallback = callback;
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

		Object.keys(options).forEach((key) => {
			this[key] = options[key];
		});
	}
);

module.exports = System.OS === "Android" ? RTLAndroidSwipeView : SwipeView;
