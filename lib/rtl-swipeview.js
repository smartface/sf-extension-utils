const extend = require("js-base/core/extend");
const SwipeView = require("sf-core/ui/swipeview");
const System = require("sf-core/device/system");


const RTLAndroidSwipeView = extend(SwipeView)(
    function(_super, options = {}) {
        _super(this, options);

        let _callbackOnPageSelected,
            _rPages,
            _onPageCreateCallback,
            _callbackOnPageScrolled;

        let getPageLength = () => this.pageCount ? this.pageCount : this.pages.length;

        //check the Layout Direction
        let getOffsetPixels = (offsetPixels) => {
            const AndroidUnitConverter = require("sf-core/util/Android/unitconverter");
            return AndroidUnitConverter.pixelToDp(this.nativeObject.getWidth()) - offsetPixels;
        };
        //check the Layout Direction
        let getIndex = (position) => (getPageLength() - 1) - position;

        Object.defineProperties(this, {
            "onPageSelected": {
                get: () => {
                    return _callbackOnPageSelected ?
                        (position, pageInstance) => {
                            let rPosition = getIndex(position);
                            _callbackOnPageSelected(rPosition, this.pageInstances[position]);
                        } :
                        undefined;
                },
                set: (callback) => {
                    _callbackOnPageSelected = callback;
                },
                enumerable: true,
                configurable: true
            },
            "pages": {
                get: () => _rPages,
                set: (pages) => {
                    if (pages instanceof Array) {
                        if (pages.length < 1) {
                            throw new TypeError("Array parameter cannot be empty.");
                        }
                        _rPages = pages.reverse();
                        this.pagerAdapter.notifyDataSetChanged();
                        this.swipeToIndex(0, false); //Last index of swipe view
                    }
                },
                enumerable: true,
                configurable: true
            },
            "onPageCreate": {
                get: () => {
                    console.log(" GEt IN SWIPE VIEW  " + _onPageCreateCallback);
                    return _onPageCreateCallback ?
                        (position) => {
                            let rPosition = getIndex(position);
                            return _onPageCreateCallback(rPosition);
                        } :
                        undefined;
                },
                set: (callback) => {
                    _onPageCreateCallback = callback;
                },
                enumerable: true,
                configurable: true
            },
            "currentIndex": {
                get: () => getIndex(this.nativeObject.getCurrentItem()),
                enumerable: true,
                configurable: true
            },
            //Pages OR pageCount must be assigned !!!
            "swipeToIndex": {
                value: (index, animated = false) => this.nativeObject.setCurrentItem(getIndex(index), animated)
            },
            "onPageScrolled": {
                get: () => {
                    return _callbackOnPageScrolled ?
                        (position, offsetPixels) => {
                            let rPosition = getIndex(position);
                            //Re-look at here!
                            let rOffsetPixels = getOffsetPixels(offsetPixels);
                            _callbackOnPageScrolled(rPosition, rOffsetPixels);
                        } :
                        undefined;
                },
                set: (callback) => {
                    _callbackOnPageScrolled = callback;
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

module.exports = System.OS === "Android" ? RTLAndroidSwipeView : SwipeView;
