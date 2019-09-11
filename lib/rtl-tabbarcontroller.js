const extend = require("js-base/core/extend");
const TabBarController = require('sf-core/ui/tabbarcontroller');
const System = require("sf-core/device/system");
const Application = require("sf-core/application");
const RTLAndroidSwipeView = require("./swipeViewExtended");


const RTLAndroidTabBarController = extend(TabBarController)(
    function(_super, options = {}) {

        let _onSelectedCallback, _items = [];
        this.swipeView = new RTLAndroidSwipeView({
            page: this,
            flexGrow: 1,
            onPageCreate: (position) => this.onPageCreate ? this.onPageCreate(position) : null,
            pageCount: this.items
        });

        _super(this, options);

        let isRTL = () => Application.android.getLayoutDirection === Application.LayoutDirection.RIGHTTOLEFT;
        let getIndex = (position) => isRTL() ? (this.items.length - 1) - position : position;

        Object.defineProperties(this, {
            "onSelected": {
                get: () => {
                    return _onSelectedCallback ?
                        (position) => {
                            let rPosition = getIndex(position);
                            return _onSelectedCallback(rPosition);
                        } :
                        undefined;
                },
                set: (callback) => {
                    _onSelectedCallback = callback;
                },
                enumerable: true,
                configurable: true
            },
            "items": {
                get: () => _items,
                set: (itemArray) => {
                    // TODO: We have updated UI.TabBarItem in Router v2.
                    // After it will merge, title and icon must be updated dynamically.
                    _items = itemArray;
                    let rItemArray = itemArray.reverse();

                    // TODO: Maybe later, swipeView pageCount can be set dynamically.
                    // After that, use refreshData method like listview.
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
