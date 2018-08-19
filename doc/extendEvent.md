<a name="module_extendEvent"></a>

## extendEvent : <code>function</code>
Adds event to a target object. If the event is already there, automatically wraps the old event. First calls the old event. Return the new event when fired.

**Access**: public  
**Author**: Alper Ozisik <alper.ozisik@smartface.io>  
**Copyright**: Smartface 2018  

| Param | Type | Description |
| --- | --- | --- |
| target | <code>object</code> | to add the event |
| eventName | <code>string</code> | to set |
| newEvent | <code>function</code> | event callback function |

**Example**  
```js
const extendEvent = require("sf-extension-utils/lib/extendEvent");
extendEvent(page, "onShow", function(data) {
 //no need to call the superOnShow, it is automatically handlled     
});
```
**Example**  
```js
const extendEvent = require("sf-extension-utils/lib/extendEvent");
page.extendEvent = extendEvent.bind(null, page);
page.extendEvent("onShow", function(data) {
 //same as previous example
});
```
