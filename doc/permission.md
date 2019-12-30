<a name="module_permission"></a>

## permission : <code>object</code>
Smartface Android Permission module

**Author**: Ozcan Ovunc <ozcan.ovunc@smartface.io>  
**Copyright**: Smartface 2020  
<a name="module_permission.permission_getPermission"></a>

### permission.permission:getPermission(permission, permissionText)
Run-time permission requests for Android if needed. iOS automatically succeeds.
Permission request numbers starts from 2000 and incremented on each requestPermission

**Kind**: static method of [<code>permission</code>](#module_permission)  
**Access**: public  
**See**

- [Permission Types](http://ref.smartface.io/#!/api/Application.android.Permissions)
- [Application Permission Management](https://developer.smartface.io/docs/application-permission-management)


| Param | Type | Description |
| --- | --- | --- |
| permission | <code>Application.android.Permissions</code> | permission to get |
| permissionText | <code>string</code> | text to show when permission cannot be granted |

**Example**  
```js
const permissionUtil = require("sf-extension-utils/lib/permission");
permissionUtil.getPermission(Application.Android.Permissions.READ_CONTACTS, "Permission is required")
    .then(() => {
        console.info("Permission granted");
    })
    .then((reason) => {
        console.info("Permission rejected");
    });
```
