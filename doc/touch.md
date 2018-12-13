<a name="module_touch"></a>

## touch : <code>object</code>
Smartface touch effects module

**Author**: Alper Ozisik <alper.ozisik@smartface.io>  
**Copyright**: Smartface 2018  

* [touch](#module_touch) : <code>object</code>
    * [.addPressEvent()](#module_touch.addPressEvent)
    * [.defaultAddPressEffect()](#module_touch.defaultAddPressEffect)
    * [.defaultClearPressEffect()](#module_touch.defaultClearPressEffect)

<a name="module_touch.addPressEvent"></a>

### touch.addPressEvent()
Adds press event to target object. It uses touch events to perform the action.
Useful with target FlexLayout components and proper handling in scrolling parents
This replaces existing touch events

**Kind**: static method of [<code>touch</code>](#module_touch)  
**Access**: public  
**Params**: <code>UI.View</code> target - target control to add press event  
**Params**: <code>function</code> event - event to be fired when press occurs  
**Params**: <code>object</code> [options] - Styling options  
**Params**: <code>function</code> [options.startTouchEffect] - Function called when touch starts, to add UI effect to give pressed effects. If not provided, default effect will be used. It should be used with endTouchEffect  
**Params**: <code>function</code> [options.endTouchEffect] - Function called when press effect ends; it is used to revert the effects in startTouchEffect. It should be used together with startTouchEffect. If not provided default effect reversing will be applied  
**Params**: <code>boolean</code> [options.consumeTouch] - If this option is set to true, touch events won't be passed through views. If not provided, default value is undefined.  
**Params**: <code>boolean</code> [options.enableRippleEffect] - Enables the ripple effect on given target. This option specfic to Android.  
**Params**: <code>number</code> [options.rippleDuration] - Ripple effect requires duration before performing given event. This option specfic to Android.  
**Params**: <code>boolean</code> [options.rippleUseForeground] - iff this options is set to true, ripple effect added on top of the given target. No matter what given target contains, draw ripple effect over them. This option specfic to Android. By default, ripple effect is given.  
**Params**: <code>UI.Color</code> [options.rippleColor] - Sets the color to ripple effect. This option specfic to Android.  
**Example**  
```js
const touch = require("sf-extension-utils/lib/touch");
//inside page.onLoad
const page = this;
touch.addPressEvent(page.flBtn, () => {
    alert("Pressed");
});
```
<a name="module_touch.defaultAddPressEffect"></a>

### touch.defaultAddPressEffect()
Default press effect function. Takes `this` as target. Darkens color for iOS, adds elevation for Android

**Kind**: static method of [<code>touch</code>](#module_touch)  
**Access**: public  
**Example**  
```js
const touch = require("sf-extension-utils/lib/touch");
const System = require('sf-core/device/system');
//inside page.onLoad
const page = this;
touch.addPressEvent(page.flBtn, () => {
    alert("Pressed");
}, {
     startTouchEffect: System.OS === "iOS"? function addCustomIOSEffect(){ }: touch.defaultAddPressEffect,
     endTouchEffect: System.OS === "iOS"? function removeCustomIOSEffect(){ }: touch.defaultClearPressEffect,
 });
```
<a name="module_touch.defaultClearPressEffect"></a>

### touch.defaultClearPressEffect()
Default remove press effect function. Takes `this` as target. Restores the color for iOS, resets elevation for Android

**Kind**: static method of [<code>touch</code>](#module_touch)  
**Access**: public  
**Example**  
```js
const touch = require("sf-extension-utils/lib/touch");
const System = require('sf-core/device/system');
//inside page.onLoad
const page = this;
touch.addPressEvent(page.flBtn, () => {
    alert("Pressed");
}, {
     startTouchEffect: System.OS === "iOS"? function addCustomIOSEffect(){ }: touch.defaultAddPressEffect,
     endTouchEffect: System.OS === "iOS"? function removeCustomIOSEffect(){ }: touch.defaultClearPressEffect,
 });
```
