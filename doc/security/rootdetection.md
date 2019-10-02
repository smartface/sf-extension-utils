<a name="module_rootdetection"></a>

## rootdetection : <code>object</code>
Smartface RootDetection Module

**Author**: Dogan Ekici <dogan.ekici@smartface.io>  
**Author**: Muhammed Yalcin Kuru <yalcin.kuru@smartface.io>  
**Author**: Ozcan Ovunc <ozcan.ovunc@smartface.io>  
**Copyright**: Smartface 2019  

* [rootdetection](#module_rootdetection) : <code>object</code>
    * [~RootDetection](#module_rootdetection..RootDetection)
        * [.isRooted()](#module_rootdetection..RootDetection+isRooted) ⇒ <code>boolean</code>

<a name="module_rootdetection..RootDetection"></a>

### rootdetection~RootDetection
Includes a few established methods to capture whether device is 
rooted or not. To know if device is rooted, looking for potentially dangerous 
app packages/paths, system folder accessibility, su binaries & schemas. The 
dangerous app packages/paths should be kept upto date by commuity.

**Kind**: inner class of [<code>rootdetection</code>](#module_rootdetection)  
**Access**: public  
<a name="module_rootdetection..RootDetection+isRooted"></a>

#### rootDetection.isRooted() ⇒ <code>boolean</code>
Checks the device either rooted or not.

**Kind**: instance method of [<code>RootDetection</code>](#module_rootdetection..RootDetection)  
**Returns**: <code>boolean</code> - - returns true in case of device rooted. Otherwise returns false.  
**Access**: public  
**Example**  
```js
const RootDetection = require("sf-extension-utils/lib/security/rootdetection");

if (RootDetection.isRooted()) {
    console.log("Attention your device is not trusted.");
} else {
    console.log("It seems you can trust your device");
}
```
