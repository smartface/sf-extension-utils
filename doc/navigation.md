<a name="module_navigation"></a>

## navigation : <code>Object</code>
**Author**: Ozcan Ovunc <ozcan.ovunc@smartface.io>  
**Author**: Furkan Arabacı <furkan.arabaci@smartface.io>  
**Copyright**: Smartface 2018

GPS navigation utility to cover the most popular navigating applications on both platforms.
It will prompt a menu to choose apps from on iOS and works out of the box on Android.
For this utility to work correctly, you need to publish the application. 
You also need to add this key to your info.plist file, for the app to be able to decect them.
```
<dict>
...
	<key>LSApplicationQueriesSchemes</key>
	    <array>
		    <string>comgooglemaps</string>
		    <string>yandexnavi</string>
	    </array>
</dict>
```  
<a name="module_navigation.showNavigationMenu"></a>

### navigation.showNavigationMenu(page, transportType, location) ⇒ <code>Promise.&lt;string&gt;</code>
Prompts a menu to choose which navigation app to handle the location.
It sets the starting point to your current location, if the permission is granted.

**Kind**: static method of [<code>navigation</code>](#module_navigation)  
**Returns**: <code>Promise.&lt;string&gt;</code> - - returns the message of state  

| Param | Type | Description |
| --- | --- | --- |
| page | <code>Object</code> | The main object of current page. |
| transportType | <code>string</code> | Your way of travel, driving, walking or bicycling. Accepted parameters = "d", "w", "b" |
| location | <code>Object</code> | Destination location which contains latitude and longitude |

**Example**  
```js
const navigation = require("sf-extension-utils/lib/navigation");
navigation.showNavigationMenu({
     page,
     transportType: "d",
     location: {
         latitude: 37.4488259,
         longitude: -122.1600047
     }
 });
```
