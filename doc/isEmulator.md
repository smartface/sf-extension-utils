<a name="module_isEmulator"></a>

## isEmulator : <code>function</code>
**Author**: Furkan Arabacı <furkan.arabaci@smartface.io>  
**Copyright**: Smartface 2021  
<a name="module_isEmulator..isEmulator"></a>

### isEmulator~isEmulator() ⇒ <code>boolean</code>
Determine if the current running platform is Smartface Emulator or published application

**Kind**: inner method of [<code>isEmulator</code>](#module_isEmulator)  
**Returns**: <code>boolean</code> - true if the current platform is Smartface Emulator  
**Access**: public  
**Example**  
```js
import isEmulator from 'sf-extension-utils/lib/isemulator';
if(isEmulator()) {
 console.info("Device is Smartface Emulator");
}
```
