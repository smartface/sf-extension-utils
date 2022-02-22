/**
 * Smartface RTLSwipeView To Support RIGHT-TO-LEFT Languages
 * RTLSwipeView class is inherited from SwipeView. It manipulates the index/array
 * based functions/properties to support RTL languages. Such as, in case of app
 * direction is RTL, array & index values are reversed.
 *
 * Note: Returned indexes or arrays won't impact the logic.
 * @module RTLSwipeView
 * @type {Class}
 * @author Muhammed Yalcin Kuru <yalcin.kuru@smartface.io>
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @copyright Smartface 2019
 * @see {@link http://ref.smartface.io/#!/api/UI.SwipeView All supported arguments, properties & methods}
 * @example
 * ```
 * import RTLSwipeView from '@smartface/extension-utils/lib/components/rtl-swipeview';
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
 * ```
 */
import SwipeView from "@smartface/native/ui/swipeview";
import Application from "@smartface/native/application";
import System from "@smartface/native/device/system";
import AndroidUnitConverter from "@smartface/native/util/Android/unitconverter";
import Page from "@smartface/native/ui/page";

class RTLAndroidSwipeView extends SwipeView {
	private callbackOnPageSelected: SwipeView["onPageSelected"] = () => {};
	private callbackOnPageScrolled: SwipeView["onPageScrolled"] = () => {};
	private _pages: (typeof Page)[] = [];
	private isRTL = false;
	constructor(options: ConstructorParameters<typeof SwipeView>) {
		super(options);
		this.isRTL =
			//@ts-ignore
			Application.android.getLayoutDirection ===
			//@ts-ignore
			Application.LayoutDirection.RIGHTTOLEFT;

			Object.keys(options).forEach((key: any) => {
				//@ts-ignore
				this[key] = options[key];
			});
	}
	private getIndex(position: number) {
		return this.isRTL ? this.pages.length - 1 - position : position;
	}

	private getOffsetPixels(offsetPixels: number) {
		return this.isRTL
			? //@ts-ignore
			  AndroidUnitConverter.pixelToDp(this.nativeObject.getWidth()) -
					offsetPixels
			: offsetPixels;
	}
	//@ts-ignore
	get pages(): (typeof Page)[] {
		return this._pages;
	}
	//@ts-ignore
	set pages(currentPages: (typeof Page)[]) {
		if (currentPages instanceof Array) {
			if (currentPages.length === 0) {
				throw TypeError("Array parameter cannot be empty.");
			}
			this._pages = currentPages;
			//@ts-ignore
			this.pagerAdapter.notifyDataSetChanged();
			this.swipeToIndex(0, false);
		}
	}
	//@ts-ignore
	get currentIndex(): number {
		//@ts-ignore
		return this.getIndex(this.nativeObject.getCurrentItem());
	}

	swipeToIndex(index: number, animated = false) {
		//@ts-ignore
		return this.nativeObject.setCurrentItem(getIndex(index), animated);
	}

	//@ts-ignore
	get onPageScrolled(): SwipeView["onPageScrolled"] {
		return (position: number, offsetPixels: number) => {
			let rPosition = this.getIndex(position);
			//Re-look at here!
			let rOffsetPixels = this.getOffsetPixels(offsetPixels);
			this.callbackOnPageScrolled(rPosition, rOffsetPixels);
		};
	}
	set onPageScrolled(callback: SwipeView["onPageScrolled"]) {
		this.callbackOnPageScrolled = callback;
	}

	//@ts-ignore
	get onPageSelected(): SwipeView["onPageSelected"] {
		return (position: number, pageInstance: Page) => {
			let rPosition = this.getIndex(position);
			this.callbackOnPageSelected(rPosition, this.getPageInstance(position));
		};
	}
	set onPageSelected(callback: SwipeView["onPageSelected"]) {
		this.callbackOnPageSelected = callback;
	}

	getPageInstance(position: number): Page {
		let rPosition = this.getIndex(position);
		//@ts-ignore
		let pageInstance = this._pageInstances[position];
		//@ts-ignore
		if (this.onPageCreate) {
			//@ts-ignore
			pageInstance = this.onPageCreate(rPosition);
		} else if (pageInstance) {
			/** 
			 * ToDo: Remaining conditions are implemented for backward compatibility. Remove if no longer backward supported 
			 */
			return pageInstance.nativeObject;
		} else {
			const pageClass: typeof Page = this.pages[rPosition];
			pageInstance = new pageClass({
				skipDefaults: true,
			});
		}
		//@ts-ignore
		this._pageInstances[position] = pageInstance;
		//@ts-ignore
		this._bypassPageSpecificProperties(pageInstance);
		return pageInstance.nativeObject;
	}
}

/**
 * Disclaimer to developer:
 * Since the class is extended from SwipeView and has no extra properties for Android,
 * Just exporting it as a child class is enough.
 */

export = System.OS === System.OSType.IOS ? SwipeView : RTLAndroidSwipeView;
