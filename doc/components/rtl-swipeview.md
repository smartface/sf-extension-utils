<a name="module_RTLSwipeView"></a>

## RTLSwipeView : <code>object</code>
Smartface RTLSwipeView To Support RIGHT-TO-LEFT Languages

**Author**: Muhammed Yalcin Kuru <yalcin.kuru@smartface.io>  
**Author**: Ozcan Ovunc <ozcan.ovunc@smartface.io>  
**Copyright**: Smartface 2019  

* [RTLSwipeView](#module_RTLSwipeView) : <code>object</code>
    * [~RTLAndroidSwipeView](#module_RTLSwipeView..RTLAndroidSwipeView)
        * [new RTLAndroidSwipeView()](#new_module_RTLSwipeView..RTLAndroidSwipeView_new)
    * [~pages](#module_RTLSwipeView..pages)
    * [~currentIndex](#module_RTLSwipeView..currentIndex)
    * [~onPageSelected(index, page)](#module_RTLSwipeView..onPageSelected)
    * [~swipeToIndex(index, animated)](#module_RTLSwipeView..swipeToIndex)
    * [~onPageScrolled(index, offset)](#module_RTLSwipeView..onPageScrolled)

<a name="module_RTLSwipeView..RTLAndroidSwipeView"></a>

### RTLSwipeView~RTLAndroidSwipeView
**Kind**: inner class of [<code>RTLSwipeView</code>](#module_RTLSwipeView)  
**Access**: public  
**See**: [All supported arguments, properties & methods](http://ref.smartface.io/#!/api/UI.SwipeView)  
<a name="new_module_RTLSwipeView..RTLAndroidSwipeView_new"></a>

#### new RTLAndroidSwipeView()
RTLSwipeView class is inherited from SwipeView. It manipulates the index/array 
based functions/properties to support RTL languages. Such as, in case of app 
direction is RTL, array & index values are reversed.

Note: Returned indexes or arrays won't impact the logic.

**Example**  
```js
import RTLSwipeView from "@smartface/extension-utils/lib/components/rtl-swipeview";

const swipeView = new RTLSwipeView({
    page: currentPage,
    width: 300,
    maxHeight: 300,
    pages: [Page1, Page2, Page3, Page4]
});

swipeView.onPageSelected = function(index, page) {
    console.info(`page index ${index}`);
};
```
<a name="module_RTLSwipeView..pages"></a>

### RTLSwipeView~pages
Similar to [swipeview's pages](http://ref.smartface.io/#!/api/UI.SwipeView-property-pages). In case of 
app direction is RTL, given array will be reversed then applied and then swiped last index. Otherwise as it's.

**Kind**: inner property of [<code>RTLSwipeView</code>](#module_RTLSwipeView)  
**Access**: public  
**Properties**

| Type |
| --- |
| <code>array</code> | 

<a name="module_RTLSwipeView..currentIndex"></a>

### RTLSwipeView~currentIndex
Same as [swipeview's currentIndex](http://ref.smartface.io/#!/api/UI.SwipeView-property-currentIndex)

**Kind**: inner property of [<code>RTLSwipeView</code>](#module_RTLSwipeView)  
**Access**: public  
**Properties**

| Type |
| --- |
| <code>number</code> | 

<a name="module_RTLSwipeView..onPageSelected"></a>

### RTLSwipeView~onPageSelected(index, page)
Same as [swipeview's onPageSelected](http://ref.smartface.io/#!/api/UI.SwipeView-event-onPageSelected)

**Kind**: inner method of [<code>RTLSwipeView</code>](#module_RTLSwipeView)  
**Access**: public  

| Param | Type |
| --- | --- |
| index | <code>number</code> | 
| page | <code>object</code> | 

<a name="module_RTLSwipeView..swipeToIndex"></a>

### RTLSwipeView~swipeToIndex(index, animated)
Same as [swipeview's swipeToIndex](http://ref.smartface.io/#!/api/UI.SwipeView-method-swipeToIndex). To swipe, pages/pageCount properties must be assigned already.

**Kind**: inner method of [<code>RTLSwipeView</code>](#module_RTLSwipeView)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | Given index reversed in case of RTL. Otherwise as it is. |
| animated | <code>boolean</code> | Swipes either with animation or directly. |

<a name="module_RTLSwipeView..onPageScrolled"></a>

### RTLSwipeView~onPageScrolled(index, offset)
Same as [swipeview's onPageScrolled](http://ref.smartface.io/#!/api/UI.SwipeView-event-onPageScrolled).

**Kind**: inner method of [<code>RTLSwipeView</code>](#module_RTLSwipeView)  
**Access**: public  

| Param | Type |
| --- | --- |
| index | <code>number</code> | 
| offset | <code>number</code> | 

