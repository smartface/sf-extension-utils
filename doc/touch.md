<a name="module_touch"></a>

## touch : <code>object</code>
Smartface touch effects module

**Author**: Alper Ozisik <alper.ozisik@smartface.io>  
**Copyright**: Smartface 2018  
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
