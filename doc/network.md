<a name="module_network"></a>

## network
Returns true if network connectivity is available

**Access**: public  
**Author**: Yunus ATMACA <yunus.atmaca@smartface.io>  
**Example**  
```js
const network = require("sf-extension-utils/lib/network");
net.isConnectivityAvailable()
     .then(available =>{
         console.log(available);
     })
     .catch(e =>{
         console.log(e);
     })
```
