<a name="module_location"></a>

## location : <code>object</code>
Smartface Location module

**Author**: Ozcan Ovunc <ozcan.ovunc@smartface.io>  
**Author**: Furkan Arabacı <furkan.arabaci@smartface.io>  
**Author**: Alim Öncül <alim.oncul@smartface.io>  
**Copyright**: Smartface 2021  

* [location](#module_location) : <code>object</code>
    * _static_
        * [.location:getLocation()](#module_location.location_getLocation) ⇒ <code>Promise.&lt;Location&gt;</code>
    * _inner_
        * [~Location](#module_location..Location) : <code>Object</code>

<a name="module_location.location_getLocation"></a>

### location.location:getLocation() ⇒ <code>Promise.&lt;Location&gt;</code>
Gets location latitude and longitude. Handles permissions by itself.

**Kind**: static method of [<code>location</code>](#module_location)  
**Returns**: <code>Promise.&lt;Location&gt;</code> - - returns the location  
**Access**: public  
**See**: [Location Guide](https://developer.smartface.io/docs/location)  
**Example**  
```js
import location from "sf-extension-utils/lib/location";

location.getLocation()
    .then(location => {
        let requestOptions = {
            'url': 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + location.latitude + ',' + location.longitude + '&sensor=true',
            'method': 'GET'
        };
    })
    .catch(e => {
        // e parameter can be one of these values:
        // "RESTRICTED" / iOS specific, this is returned if authorization status is Location.iOS.AuthorizationStatus.RESTRICTED
        // "OTHER" / Android specific, this is returned if the operation failed with no more detailed information
        // "DENIED" / Returned for all other cases
        console.log("Location cannot be retrieved");
    });
```
<a name="module_location..Location"></a>

### location~Location : <code>Object</code>
**Kind**: inner typedef of [<code>location</code>](#module_location)  
**Properties**

| Name | Type |
| --- | --- |
| location.longitude | <code>number</code> | 
| location.latitude | <code>number</code> | 

