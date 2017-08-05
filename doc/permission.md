<a name="module_permission"></a>

## permission : <code>object</code>
Smartface Android Permission module

**Author**: Alper Ozisik <alper.ozisik@smartface.io>  
**Copyright**: Smartface 2017  
<a name="module_permission.permission_getPermission"></a>

### permission.permission:getPermission(permissions, [rationaleDisplay], callback)
Run-time permission requests for Android if needed. iOS automatically succeeds.
Permission request numbers starts from 2000 and incremented on each requestPermission

**Kind**: static method of [<code>permission</code>](#module_permission)  
**Access**: public  
**See**

- [Permission Types](http://ref.smartface.io/#!/api/Application.android.Permissions)
- [Application Permission Management](https://developer.smartface.io/docs/application-permission-management)


| Param | Type | Description |
| --- | --- | --- |
| permissions | <code>Application.android.Permissions</code> \| <code>Array.&lt;Application.android.Permissions&gt;</code> | permission(s) to get |
| [rationaleDisplay] | <code>string</code> | optional parameter for rationale text |
| callback | <code>function</code> | error first pattern fired when permissions are requested if needed |

**Example**  
```js
const permission = require("sf-extension-utils").permission
const Application = require("sf-core/application");
permission.getPermission(Application.android.Permissions.ACCESS_FINE_LOCATION,
 function(err) {
     if (err) return callback(err);
         getLocationAction();
 });
```
