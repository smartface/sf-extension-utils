<a name="module_navigation"></a>

## navigation : <code>Object</code>
Navigation utility to cover the most popular navigating applications on iOS
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

**Author**: Ozcan Ovunc <ozcan.ovunc@smartface.io>  
**Copyright**: Smartface 2018  
<a name="module_navigation.showNavigationMenu"></a>

### navigation.showNavigationMenu(page, transportType, location)
Prompts a menu to choose which navigation app to handle the location.
It sets the starting point to your current location, if the permission is granted.

**Kind**: static method of [<code>navigation</code>](#module_navigation)  

| Param | Type | Description |
| --- | --- | --- |
| page | <code>Object</code> | The main object of current page. |
| transportType | <code>string</code> | Your way of travel, driving or walking. Accepted paramters = "d", "w" |
| location | <code>Object</code> | Destination location which contains latitude and longitude |

**Example**  
```js
const navigation = require("sf-extension-utils/lib/navigation");
navigation.showNavigationMenu({
     page,
     transportType: "d",
     location: {
         latitude: 55.758192,
         longitude: 37.642817
     }
 });
```
