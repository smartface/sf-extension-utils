<a name="module_appleDevices"></a>

## appleDevices : <code>object</code>
Apple Device utility

**Author**: Furkan Arabacı <furkan.arabaci@smartface.io>  
**Copyright**: Smartface 2020  
<a name="module_appleDevices..getModelName"></a>

### appleDevices~getModelName() ⇒ <code>string</code>
Gets the human readable modelname for iphone devies.
Returns empty string on Android devices.

**Kind**: inner method of [<code>appleDevices</code>](#module_appleDevices)  
**Returns**: <code>string</code> - Device model  
**Ios**:   
**Example**  
```js
import AppleDevices from "sf-extension-utils/lib/appleDevices";
AppleDevices.getModelName();
```
