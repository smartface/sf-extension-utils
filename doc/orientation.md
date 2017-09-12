<a name="module_orientation"></a>

## orientation : <code>object</code>
Smartface Location module

**Author**: Alper Ozisik <alper.ozisik@smartface.io>  
**Copyright**: Smartface 2017  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| PORTRAIT | <code>string</code> | <code>&quot;portrait&quot;</code> | enum value |
| LANDSCAPE | <code>string</code> | <code>&quot;landspace&quot;</code> | enum value |
| shortEdge | <code>number</code> |  | gives short edge of the screen |
| longEdge | <code>number</code> |  | gives long edge of the screen |


* [orientation](#module_orientation) : <code>object</code>
    * [.orientation:getOrientation()](#module_orientation.orientation_getOrientation) ⇒ <code>string</code>
    * [.orientation:rotate(orientation)](#module_orientation.orientation_rotate) ⇒ <code>string</code>
    * [.orientation:getOrientationOnchage()](#module_orientation.orientation_getOrientationOnchage) ⇒ <code>string</code>

<a name="module_orientation.orientation_getOrientation"></a>

### orientation.orientation:getOrientation() ⇒ <code>string</code>
gets current orientation of the device. Better to be called when the page is shown or later

**Kind**: static method of [<code>orientation</code>](#module_orientation)  
**Access**: public  
**Example**  
```js
const orientationLib = require(""sf-extension-utils").orientation;
page.onShow = function() {
    var orientation = orientationLib.getOrientation();
    console.log(orientation); // portrait
    arrangeLayout(this, orientation);
};
```
<a name="module_orientation.orientation_rotate"></a>

### orientation.orientation:rotate(orientation) ⇒ <code>string</code>
gives rotated value for the given orientation. Does not roates the screen!

**Kind**: static method of [<code>orientation</code>](#module_orientation)  
**Returns**: <code>string</code> - rotated value for the given orientation  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| orientation | <code>string</code> | value |

**Example**  
```js
const orientationLib = require(""sf-extension-utils").orientation;
var orientation = orientationLib.rotate(orientationLib.PORTRAIT);
console.log(String(orientation === orientationLib.LANDSCAPE); //true
```
<a name="module_orientation.orientation_getOrientationOnchage"></a>

### orientation.orientation:getOrientationOnchage() ⇒ <code>string</code>
gives new orientation value during {UI.Page.onOrientationChange} event.
Should be called only within that event. Handles iOS & Android differnces.

**Kind**: static method of [<code>orientation</code>](#module_orientation)  
**Returns**: <code>string</code> - target orientation value when the rotation completes  
**Access**: public  
**Example**  
```js
const orientationLib = require(""sf-extension-utils").orientation;
page.onOrientationChange = function() {
    var orientation = orientationLib.getOrientationOnchage();
    console.log(orientation); // landscape
    arrangeLayout(this, orientation);
};
```
