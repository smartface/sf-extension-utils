<a name="module_location"></a>

## location : <code>object</code>
Smartface Location module

**Author**: Alper Ozisik <alper.ozisik@smartface.io>  
**Copyright**: Smartface 2017  

* [location](#module_location) : <code>object</code>
    * _static_
        * [.location:getLocation(callback)](#module_location.location_getLocation)
    * _inner_
        * [~location:getLocationCallback](#module_location..location_getLocationCallback) : <code>function</code>

<a name="module_location.location_getLocation"></a>

### location.location:getLocation(callback)
Gets location latitude and logitude. For android it handles permissions by its self

**Kind**: static method of [<code>location</code>](#module_location)  
**Access**: public  
**See**: [Location Guide](https://developer.smartface.io/docs/location)  

| Param | Type |
| --- | --- |
| callback | <code>location:location:getLocationCallback</code> | 

**Example**  
```js
const location = require("sf-extension-utils").location;
location.getLocation(function(err, location) {
   if (err) return;
   requestOptions = {
       'url': 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + location.latitude + ',' + location.longitude + '&sensor=true',
       'method': 'GET'
   };
 });
```
<a name="module_location..location_getLocationCallback"></a>

### location~location:getLocationCallback : <code>function</code>
Error first pattern callback

**Kind**: inner typedef of [<code>location</code>](#module_location)  

| Param | Type |
| --- | --- |
| error | <code>object</code> \| <code>string</code> | 
| location | <code>object</code> | 
| location.longitude | <code>number</code> | 
| location.latitude | <code>number</code> | 

