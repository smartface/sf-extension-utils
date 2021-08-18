/**
 * Smartface RTLTabBarController To Support RIGHT-TO-LEFT Languages
 * @module RTLTabBarController
 * @type {object}
 * @author Muhammed Yalcin Kuru <yalcin.kuru@smartface.io>
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @copyright Smartface 2019
 */

import Application from "@smartface/native/application";
import System from "@smartface/native/device/system";
import TabBarController from "@smartface/native/ui/tabbarcontroller";
import RTLAndroidSwipeView from "components/rtl-swipeview";

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
 * import RTLTabBarController from '@smartface/extension-utils/lib/components/rtl-tabbarcontroller';
 *
 * class MyTabBarController extends RTLTabBarController {
 *     constructor() {
 *         super();
 *         this.onPageCreate = (index) => {}
 *     }
 * }
 */
class RTLAndroidTabBarController extends TabBarController {
	NativeRelativeLayout: any;
	private swipeView: InstanceType<typeof RTLAndroidSwipeView>;
	private isRTL: boolean;
	private onSelectedCallback: TabBarController["onSelected"] = () => {};
	private mScrollEnabled = false;
	private _items: any[] = [];
	constructor(options: ConstructorParameters<typeof TabBarController>) {
		//@ts-ignore
		super(options);
		//@ts-ignore
		this.NativeRelativeLayout = requireClass("android.widget.RelativeLayout");
		//@ts-ignore
		this.swipeView = new RTLAndroidSwipeView({
			//@ts-ignore
			page: this,
			flexGrow: 1,
			onPageCreate: (position: number) =>
				this.onPageCreate ? this.onPageCreate(position) : null,
		});
		//@ts-ignore
		this.isRTL =
			//@ts-ignore
			Application.android.getLayoutDirection ===
			//@ts-ignore
			Application.LayoutDirection.RIGHTTOLEFT;
	}
	private getArray(array: any[]): any[] {
		return this.isRTL ? array.reverse() : array;
	}
	private getIndex(position: number): number {
		return this.isRTL ? this.items.length - 1 - position : position;
	}

	get onSelected(): TabBarController["onSelected"] {
		return (position: number) => {
			const rPosition = this.getIndex(position);
			return this.onSelectedCallback(rPosition);
		};
	}

	set onSelected(value: TabBarController["onSelected"]) {
		this.onSelectedCallback = value;
	}

	set items(value: any[]) {
		this._items = value;
		const rItemArray = this.getArray(value);
			//@ts-ignore
		this.swipeView.pageCount = rItemArray.length;
			//@ts-ignore
		this.swipeView.pagerAdapter.notifyDataSetChanged();

		rItemArray.forEach((i) => {
			const itemTitle = rItemArray[i].title;
			const itemIcon = rItemArray[i].icon;
			//@ts-ignore
			const tabItem = this.tabLayout.nativeObject.getTabAt(i);
			itemTitle && (tabItem.setText(itemTitle));
			itemIcon && (tabItem.setIcon(itemIcon.nativeObject));
		});
		if (!this.autoCapitalize) {
			//@ts-ignore
			this.setAllCaps(rItemArray, this.tabLayout.nativeObject);
		}
		this.setSelectedIndex(0, false);
	}
	get items() {
		return this._items;
	}

	set scrollEnabled(value: boolean) {
		this.mScrollEnabled = value;
		if (value) {
			//@ts-ignore
			this.tabLayout.nativeObject.setTabMode(MODE_SCROLLABLE);
			//@ts-ignore
			this.tabLayout.nativeObject.setLayoutParams(new this.NativeRelativeLayout.LayoutParams(WRAP_CONTENT, WRAP_CONTENT));
			//@ts-ignore
			this.alignByDirection(this.divider);
		}
		else {
			//@ts-ignore
			this.tabLayout.nativeObject.setTabMode(MODE_FIXED);
			//@ts-ignore
			this.tabLayout.nativeObject.setLayoutParams(new this.NativeRelativeLayout.LayoutParams(MATCH_PARENT, WRAP_CONTENT));
		}
	}

	get scrollEnabled(): boolean {
		return this.mScrollEnabled;
	}

	alignByDirection(pmDivider: any) {
		if (pmDivider != null && this.isRTL){
			pmDivider.setGravity(GRAVITY_RIGHT);
		}
	}
}

/**
 * Disclaimer to developer:
 * Since the class is extended from SwipeView and has no extra properties for Android,
 * Just exporting it as a child class is enough.
 */

export = System.OS === System.OSType.ANDROID
	? RTLAndroidTabBarController
	: TabBarController;
