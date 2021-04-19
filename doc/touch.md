<a name="module_touch"></a>

## touch : <code>object</code>
Smartface touch effects module

**Author**: Alper Ozisik <alper.ozisik@smartface.io>  
**Copyright**: Smartface 2018  

* [touch](#module_touch) : <code>object</code>
    * _static_
        * [.setDefaults()](#module_touch.setDefaults)
        * [.getDefaults()](#module_touch.getDefaults) ⇒ <code>touch~Defaults</code>
        * [.addPressEvent()](#module_touch.addPressEvent)
        * [.defaultAddPressEffect()](#module_touch.defaultAddPressEffect)
        * [.defaultClearPressEffect()](#module_touch.defaultClearPressEffect)
    * _inner_
        * [~Defaults](#module_touch..Defaults) : <code>Object</code>

<a name="module_touch.setDefaults"></a>

### touch.setDefaults()
Sets the default values for touch effects. This may not affect after press event is added

**Kind**: static method of [<code>touch</code>](#module_touch)  
**Access**: public  
**Params**: <code>touch~Defaults</code> options - Changes the default values for the given key  
<a name="module_touch.getDefaults"></a>

### touch.getDefaults() ⇒ <code>touch~Defaults</code>
Gets the default values for touch effects

**Kind**: static method of [<code>touch</code>](#module_touch)  
**Returns**: <code>touch~Defaults</code> - default values for touch effects  
**Access**: public  
**Example**  
```js
import touch from "sf-extension-utils/lib/touch";
console.log("Animation FPS = " + touch.getDefaults().fps);
```
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
**Params**: <code>function</code> [options.startTouchEffect=defaultAddPressEffect] - Function called when touch starts, to add UI effect to give pressed effects. If not provided, default effect will be used. It should be used with endTouchEffect  
**Params**: <code>function</code> [options.endTouchEffect=defaultClearPressEffect] - Function called when press effect ends; it is used to revert the effects in startTouchEffect. It should be used together with startTouchEffect. If not provided default effect reversing will be applied  
**Params**: <code>boolean</code> [options.consumeTouch] - If this option is set to true, touch events won't be passed through views  
**Params**: <code>boolean</code> [options.disableRippleEffect=false] - Enables the ripple effect on given target. This option specfic to Android  
**Params**: <code>number</code> [options.touchDelay=0] - Ripple effect requires duration before performing given event. This option specfic to Android  
**Params**: <code>boolean</code> [options.rippleUseBackground=false] - if this options is set to true, ripple effect added on background of the given target. If target contains child components, draw ripple effect below them. This option specfic to Android.  
**Params**: <code>UI.Color</code> [options.rippleColor=Color.create("#d8d8d8")] - Sets the color to ripple effect. This option specfic to Android  
**Params**: <code>UI.Color</code> [options.fadeColor=Color.create("#d8d8d8")] - Sets the color to fade effect. This option specfic to iOS  
**Params**: <code>number</code> [options.fadeDuration=200] - Sets duration to fade effect. This option specfic to iOS. Default 0.2  
**Params**: <code>number</code> [options.fadeMaxOpacity=0.3] - Sets maximum opacity to fade effect. This option specfic to iOS. Default 0.3  
**Example**  
```js
import touch from "sf-extension-utils/lib/touch";
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
import touch from "sf-extension-utils/lib/touch";
import System from 'sf-core/device/system';
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
import touch from "sf-extension-utils/lib/touch";
import System from 'sf-core/device/system';
//inside page.onLoad
const page = this;
touch.addPressEvent(page.flBtn, () => {
    alert("Pressed");
}, {
     startTouchEffect: System.OS === "iOS"? function addCustomIOSEffect(){ }: touch.defaultAddPressEffect,
     endTouchEffect: System.OS === "iOS"? function removeCustomIOSEffect(){ }: touch.defaultClearPressEffect,
 });
```
<a name="module_touch..Defaults"></a>

### touch~Defaults : <code>Object</code>
Defaults for touch effect animations

**Kind**: inner typedef of [<code>touch</code>](#module_touch)  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| darkenAmount | <code>number</code> | <code>22.74</code> | On iOS, if fade is not being used, target is darkened. By default |
| androidAnimationDuration | <code>number</code> | <code>100</code> | On android, elevation change animation duration in ms. |
| fps | <code>number</code> | <code>60</code> | Android animation change effect rendering FPS |
| elevationChange | <code>number</code> | <code>14</code> | Android increases the elevation of the target by the value set, after touch is cancelled, it is restored |
| androidTouchDelay | <code>number</code> | <code>0</code> | Android adds delay to trigger the touch. It is useful while viewing the ripple effect take place |
| fadeDuration | <code>number</code> | <code>200</code> | iOS fade effect duration in miliseconds |
| fadeMaxOpacity | <code>number</code> | <code>0.3</code> | iOS fade effect max opacity. Value between 0 and 1 |
| rippleColor | <code>UI.Color</code> | <code>Color.create(&quot;#d8d8d8&quot;)</code> | Android ripple effect color |
| fadeColor | <code>UI.Color</code> | <code>Color.create(&quot;#d8d8d8&quot;)</code> | iOS fade effect color |

