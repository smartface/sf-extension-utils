<a name="module_RTLTabBarController"></a>

## RTLTabBarController : <code>object</code>
Smartface RTLTabBarController To Support RIGHT-TO-LEFT Languages

**Author**: Muhammed Yalcin Kuru <yalcin.kuru@smartface.io>  
**Author**: Ozcan Ovunc <ozcan.ovunc@smartface.io>  
**Copyright**: Smartface 2019  

* [RTLTabBarController](#module_RTLTabBarController) : <code>object</code>
    * [~RTLAndroidTabBarController](#module_RTLTabBarController..RTLAndroidTabBarController)
        * [new RTLAndroidTabBarController()](#new_module_RTLTabBarController..RTLAndroidTabBarController_new)
    * [~items](#module_RTLTabBarController..items)
    * [~onSelected(index)](#module_RTLTabBarController..onSelected)

<a name="module_RTLTabBarController..RTLAndroidTabBarController"></a>

### RTLTabBarController~RTLAndroidTabBarController
**Kind**: inner class of [<code>RTLTabBarController</code>](#module_RTLTabBarController)  
**Access**: public  
**See**: [arguments, properties & methods](http://ref.smartface.io/#!/api/UI.TabBarController)  
<a name="new_module_RTLTabBarController..RTLAndroidTabBarController_new"></a>

#### new RTLAndroidTabBarController()
RTLTabBarController class is inherited from TabBarController. It manipulates
the index/array based functions/properties to support RTL languages. Such as,
in case of app direction is RTL, array & index values are reversed.

Note: Returned indexes or arrays won't impact the logic.

**Example**  
```js
import RTLTabBarController from "@smartface/extension-utils/lib/components/rtl-tabbarcontroller";

const MyTabBarController = extend(RTLTabBarController)(
    function(_super, params) {
        _super(this);
        this.onPageCreate = function(index) {};
    }
);
```
<a name="module_RTLTabBarController..items"></a>

### RTLTabBarController~items
Similar to [tabbarcontroller's items](http://ref.smartface.io/#!/api/UI.TabBarController-property-items). Given items will be reversed then applied in case of direction is RTL.

**Kind**: inner property of [<code>RTLTabBarController</code>](#module_RTLTabBarController)  
**Access**: public  
**Properties**

| Name | Description |
| --- | --- |
| {@link | http://ref.smartface.io/#!/api/UI.TabBarItem TabBarItem} |

<a name="module_RTLTabBarController..onSelected"></a>

### RTLTabBarController~onSelected(index)
Same as [tabbarcontroller's onSelected](http://ref.smartface.io/#!/api/UI.TabBarController-event-onSelected).

**Kind**: inner method of [<code>RTLTabBarController</code>](#module_RTLTabBarController)  
**Access**: public  

| Param | Type |
| --- | --- |
| index | <code>number</code> | 

