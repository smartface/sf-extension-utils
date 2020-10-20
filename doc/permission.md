<a name="module_permission"></a>

## permission : <code>object</code>
Smartface Android & Partly iOS Permission module

**Author**: Ozcan Ovunc <ozcan.ovunc@smartface.io>  
**Author**: Alim Öncül <alim.oncul@smartface.io>  
**Copyright**: Smartface 2020  
<a name="module_permission.permission_getPermission"></a>

### permission.permission:getPermission(opts)
Run-time permission requests for Android if needed. iOS only supports camera, others automatically succeeds.Permission request numbers starts from 2000 and incremented on each requestPermission

**Kind**: static method of [<code>permission</code>](#module_permission)  
**Access**: public  
**See**

- [Permission Types](http://ref.smartface.io/#!/api/Application.android.Permissions)
- [Application Permission Management](https://developer.smartface.io/docs/application-permission-management)


| Param | Type | Description |
| --- | --- | --- |
| opts | <code>Object</code> | Options for the module |
| opts.androidPermission | <code>Application.android.Permissions</code> | Android permission to get |
| opts.iosPermission | <code>string</code> | [opts.iosPermission] - iOS permission to get |
| opts.permissionText | <code>string</code> | Text to show when permission cannot be granted |

**Example**  
```js
const permissionUtil = require('sf-extension-utils/lib/permission');permissionUtil.getPermission({        androidPermission: Application.Android.Permissions.CAMERA,        iosPermission: permissionUtil.IOS_PERMISSIONS.CAMERA,        permissionText: 'Please go to the settings and grant permission'    })    .then(() => {        console.info('Permission granted');    })    .catch((reason) => {        console.info('Permission rejected');    });
```
