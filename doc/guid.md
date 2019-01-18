<a name="module_guid"></a>

## guid : <code>function</code>
Smartface guid util

**Author**: Alper Ozisik <alper.ozisik@smartface.io>  
**Copyright**: Smartface 2019  
<a name="module_guid..guid"></a>

### guid~guid() ⇒ <code>string</code>
Creates a UUID v4 string

**Kind**: inner method of [<code>guid</code>](#module_guid)  
**Returns**: <code>string</code> - Random generated uuid v4 string  
**Access**: public  
**Example**  
```js
const guid = require("sf-extension-utils/lib/guid");
var newItem = { id: guid() };
```
