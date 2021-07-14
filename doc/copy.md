<a name="module_copy"></a>

## copy : <code>function</code>
Smartface Copy helper module

**Author**: Alper Ozisik <alper.ozisik@smartface.io>  
**Copyright**: Smartface 2018  
<a name="module_copy..copy"></a>

### copy~copy() ⇒ <code>\*</code>
Creates a deep high-performing copy of a variable

**Kind**: inner method of [<code>copy</code>](#module_copy)  
**Returns**: <code>\*</code> - copy of the source  
**Access**: public  
**Params**: <code>\*</code> source  
**Params**: <code>\*</code> [destination]  
**Example**  
```js
import copy from "@smartface/extension-utils/lib/copy";
const src = {nested: {x: 4}}; //deep nested object
const cpy = copy(src);

console.log(src === cpy); //false
console.log(src.nested === cpy.nested); //false
```
**Example**  
```js
import copy from "@smartface/extension-utils/lib/copy";
const src = {nested: {x: 4}}; //deep nested object
let cpy;
//targeting
copy(src, cpy);
```
