<a name="module_network"></a>

## network : <code>Object</code>
**Author**: Yunus Atmaca <yunus.atmaca@smartface.io>  
**Author**: Ozcan Ovunc <ozcan.ovunc@smartface.io>  
**Copyright**: Smartface 2019  
<a name="module_network..isConnected"></a>

### network~isConnected() ⇒ <code>Promise.&lt;Object&gt;</code>
**Kind**: inner method of [<code>network</code>](#module_network)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - - Resolves if the internet connectivity is available,
rejects o/w  
**Example**  
```js
const network = require("sf-extension-utils/lib/network");
network.isConnected()
    .then(() => {
        console.info("Connected to internet");
    })
    .catch(() => {
        console.error("Not connected to internet");
    });
```
