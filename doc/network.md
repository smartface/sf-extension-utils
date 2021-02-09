<a name="module_network"></a>

## network : <code>Object</code>
**Author**: Alim Oncul <alim.oncul@smartface.io>  
**Author**: Yunus Atmaca <yunus.atmaca@smartface.io>  
**Author**: Ozcan Ovunc <ozcan.ovunc@smartface.io>  
**Copyright**: Smartface 2020  

* [network](#module_network) : <code>Object</code>
    * [~isConnected()](#module_network..isConnected) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [~getIpAddress()](#module_network..getIpAddress) ⇒ <code>Promise.&lt;string&gt;</code>

<a name="module_network..isConnected"></a>

### network~isConnected() ⇒ <code>Promise.&lt;Object&gt;</code>
**Kind**: inner method of [<code>network</code>](#module_network)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - - Resolves if the internet connectivity is available,
rejects o/w  
**Example**  
```js
import network from "sf-extension-utils/lib/network";
network.isConnected()
    .then(() => {
        console.info("Connected to internet");
    })
    .catch(() => {
        console.error("Not connected to internet");
    });
```
<a name="module_network..getIpAddress"></a>

### network~getIpAddress() ⇒ <code>Promise.&lt;string&gt;</code>
**Kind**: inner method of [<code>network</code>](#module_network)  
**Returns**: <code>Promise.&lt;string&gt;</code> - - Resolves current IP address of the device  
**Example**  
```js
import network from "sf-extension-utils/lib/network";
network.getIpAddress()
    .then((ip) => {
        console.info(`Retrieved device IP ${ip}`);
    })
    .catch(() => {
        console.error("Cannot retrieve device IP");
    });
```
