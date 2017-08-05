<a name="module_rau"></a>

## rau : <code>object</code>
Smartface Remote App Update module

**Author**: Alper Ozisik <alper.ozisik@smartface.io>  
**Copyright**: Smartface 2017  
<a name="module_rau.rau_checkUpdate"></a>

### rau.rau:checkUpdate([options])
Checks RAU updates. If there is new update available, the update dialog will be shown to the user 
if silent parameter not given. This function will handle permission operations internally for Android.

**Kind**: static method of [<code>rau</code>](#module_rau)  
**Access**: public  
**See**: [Remote App Update Guide](https://developer.smartface.io/docs/remote-app-update)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>object</code> |  |  |
| [options.showProgressCheck] | <code>boolean</code> | <code>false</code> | Show dialog while checking updates. |
| [options.showProgressErrorAlert] | <code>boolean</code> | <code>false</code> | Show error dialog when error accurs. |
| [options.silent] | <code>boolean</code> | <code>false</code> | Update and restart without interacting with user. |
| [options.url] | <code>string</code> |  | to open for incompatible updates (optional) |

**Example**  
```js
const System = require("sf-core/device/system");
const rau = require("sf-extension-utils").rau;
rau.checkUpdate({
 showProgressCheck: true,
 showProgressErrorAlert: true,
 silent: false,
 url: System.OS === "Android"? androidURL: iOSURL
});
```
