<a name="module_getCombinedStyle"></a>

## getCombinedStyle : <code>function</code>
Smartface combilned style util

**Author**: Ozcan Ovunc <ozcan.ovunc@smartface.io>  
**Author**: Alper Ozisik <alper.ozisik@smartface.io>  
**Copyright**: Smartface 2019  

* [getCombinedStyle](#module_getCombinedStyle) : <code>function</code>
    * [~getCombinedStyle()](#module_getCombinedStyle..getCombinedStyle) ⇒ <code>object</code>
    * [~clearCache()](#module_getCombinedStyle..clearCache)

<a name="module_getCombinedStyle..getCombinedStyle"></a>

### getCombinedStyle~getCombinedStyle() ⇒ <code>object</code>
Creates a style object from a context class. Results are cached. If same className is matched, result is given from a cache. Cache not cleared on context change!

**Kind**: inner method of [<code>getCombinedStyle</code>](#module_getCombinedStyle)  
**Returns**: <code>object</code> - Style object generated from cache  
**Access**: public  
**Params**: <code>string</code> className - One or more class names seperated with space  
**Example**  
```js
import { getCombinedStyle } from "@smartface/extension-utils/lib/getCombinedStyle";
const buttonStyle = getCombinedStyle(".button");
Object.assign(btn, buttonStyle);
```
<a name="module_getCombinedStyle..clearCache"></a>

### getCombinedStyle~clearCache()
Removes all items from cache

**Kind**: inner method of [<code>getCombinedStyle</code>](#module_getCombinedStyle)  
**Access**: public  
**Example**  
```js
import { clearCache } from "@smartface/extension-utils/lib/getCombinedStyle";
function onContextChangeEvent() {
 clearCache();
}
```
