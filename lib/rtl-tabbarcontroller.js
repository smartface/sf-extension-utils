/**
 * Smartface RTLTabBarController To Support RIGHT-TO-LEFT Languages
 * @module RTLTabBarController
 * @type {function}
 * @author Muhammed Yalcin Kuru <yalcin.kuru@smartface.io>
 * @copyright Smartface 2019
 */

const extend = require("js-base/core/extend");
const TabBarController = require('sf-core/ui/tabbarcontroller');
const System = require("sf-core/device/system");
const Application = require("sf-core/application");
const RTLAndroidSwipeView = require("./rtl-swipeview");


/**
 * RTLTabBarController class is inherited from TabBarController. It manipulates the index/array based functions/property to supports RTL languages. Such as, in case of app direction RTL, 
 * applyies array & index as reversed. So that enables the TabBarController component's swipe action & items orders looks like  RIGTH-TO-LEFT. 
 * 
 * Note: Returned indexes or arrays won't impact the logic.
 * 
 * @public
 * @class
 * @see {@link http://ref.smartface.io/#!/api/UI.TabBarController arguments, properties & functions}
 * @example
 * 
 * const Page = require('sf-core/ui/page');
 * const RTLTabBarController = require("sf-extension-utils/lib/rtl-tabbarcontroller");
 * const TabBarItem = require('sf-core/ui/tabbaritem');
 * 
 * const SamplePage = extend(Page)(
 *     function(_super, params) {
 *         _super(this, params);
 *         this.layout.backgroundColor = params.bgColor;
 *     }
 * );
 * 
 * var pgRecents = new SamplePage({ bgColor: Color.BLACK });
 * var pgFavorites = new SamplePage({ bgColor: Color.BLUE });
 * var pgContacts = new SamplePage({ bgColor: Color.WHITE });
 * var pgMessages = new SamplePage({ bgColor: Color.YELLOW });
 * 
 * var tabPages = [pgRecents, pgFavorites, pgContacts, pgMessages];
 * 
 * var TabBarController1 = extend(RTLTabBarController)(
 *     function(_super, params) {
 *         _super(this);
 *         this.onPageCreate = function(index) {
 *             console.log(" onPageCreate  index " + index);
 *             return tabPages[index];
 *         };
 *         this.onShow = function() {
 *             this.headerBar.visible = false;
 *         }.bind(this);
 *         this.onHide = function() {
 *             console.log("hidden");
 *         }.bind(this);
 *         this.onLoad = function() {
 *             this.scrollEnabled = true;
 *             this.indicatorColor = Color.BLACK;
 *             this.indicatorHeight = 3;
 *             this.barColor = Color.create("#F3F0F0");
 *             this.textColor = {
 *                 normal: Color.BLACK,
 *                 selected: Color.create("#00A1F1")
 *             };
 *             this.items = items;
 *             this.autoCapitalize = true;
 *         }.bind(this);
 *         this.onSelected = (index) => {
 *             console.log("Selected item index: " + index);
 *             console.log(" current index " + this.selectedIndex);
 *         };
 *     }
 * );
 * var recentsImage = Image.createFromFile("images://icon.png");
 * var favImage = Image.createFromFile("images://icon.png");
 * var contactImage = Image.createFromFile("images://icon.png");
 * var messageImage = Image.createFromFile("images://icon.png");
 * var recentItem = new TabBarItem({
 *     title: "Recent",
 *     icon: recentsImage
 * });
 * var favItem = new TabBarItem({
 *     title: "Favorite",
 *     icon: favImage
 * });
 * var contactItem = new TabBarItem({
 *     title: "Contact",
 *     icon: contactImage
 * });
 * var messageItem = new TabBarItem({
 *     title: "Message",
 *     icon: messageImage
 * });
 * var items = [recentItem, favItem, contactItem, messageItem];
 * 
 * 
 * 
 */
const RTLAndroidTabBarController = extend(TabBarController)(
	function(_super, options = {}) {

		this.swipeView = new RTLAndroidSwipeView({
			page: this,
			flexGrow: 1,
			onPageCreate: (position) => this.onPageCreate ? this.onPageCreate(position) : null
		});

		_super(this, options);

		let isRTL = () => Application.android.getLayoutDirection === Application.LayoutDirection.RIGHTTOLEFT;
		let getArray = (array) => isRTL() ? array.reverse() : array;
		let getIndex = (position) => isRTL() ? (this.items.length - 1) - position : position;

		let onSelectedCallback, items = [];
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
			}
		});

		// Assign parameters given in constructor
		Object.keys(options).forEach((key) => {
			this[key] = options[key];
		});
	}
);

module.exports = System.OS === "Android" ? RTLAndroidTabBarController : TabBarController;
