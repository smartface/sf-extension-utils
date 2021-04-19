<a name="module_map"></a>

## map : <code>Object</code>
**Author**: Furkan Arabacı <furkan.arabaci@smartface.io>  
**Copyright**: Smartface 2021

Map utility to cover the most popular map applications on both platforms.
It will zoom in to the given location in the chosen map app
It will prompt a menu to choose apps from on iOS and works out of the box on Android.
For this utility to work correctly, you need to publish the application. 
You also need to add this key to your info.plist file, for the app to be able to decect them.
```
<dict>
...
	<key>LSApplicationQueriesSchemes</key>
	    <array>
		    <string>comgooglemaps</string>
		    <string>yandexmaps</string>
	    </array>
</dict>
```  
<a name="module_map..showMapsMenu"></a>

### map~showMapsMenu(options) ⇒ <code>Promise.&lt;string&gt;</code>
Prompts a menu to choose which maps app to handle the location.
It sets the starting point to your current location, if the permission is granted.

**Kind**: inner method of [<code>map</code>](#module_map)  
**Returns**: <code>Promise.&lt;string&gt;</code> - - returns the message of state  

| Param | Type | Description |
| --- | --- | --- |
| options |  |  |
| options.page | <code>Object</code> | The main object of current page. |
| options.transportType | <code>string</code> | Your way of travel, driving, walking or bicycling. Accepted parameters = "d", "w", "b" |
| options.location | <code>Object</code> | Destination location which contains latitude and longitude |

**Example**  
```js
import { showMapsMenu } from "sf-extension-utils/lib/maps";
showMapsMenu({
     page,
     location: {
         latitude: 37.4488259,
         longitude: -122.1600047
     }
 });
```
