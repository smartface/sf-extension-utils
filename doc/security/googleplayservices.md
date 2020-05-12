<a name="module_googleplayservcies"></a>

## googleplayservcies : <code>object</code>
Smartface GooglePlayServices Android Module

**Author**: Hasret Sariyer <hasret.sariyer@smartface.io>  
**Copyright**: Smartface 2020  

* [googleplayservcies](#module_googleplayservcies) : <code>object</code>
    * _static_
        * [.upgradeSecurityProvider()](#module_googleplayservcies.upgradeSecurityProvider) ⇒ <code>Promise</code>
    * _inner_
        * [~GooglePlayServices](#module_googleplayservcies..GooglePlayServices)

<a name="module_googleplayservcies.upgradeSecurityProvider"></a>

### googleplayservcies.upgradeSecurityProvider() ⇒ <code>Promise</code>
Asynchronously installs the dynamically updatable security provider, if it's not already installed. 
This method must be called on the UI thread.

**Kind**: static method of [<code>googleplayservcies</code>](#module_googleplayservcies)  
**Returns**: <code>Promise</code> - resolved and rejected with error code.  
**Access**: public  
**See**: [https://developers.google.com/android/reference/com/google/android/gms/common/ConnectionResult](https://developers.google.com/android/reference/com/google/android/gms/common/ConnectionResult)  
<a name="module_googleplayservcies..GooglePlayServices"></a>

### googleplayservcies~GooglePlayServices
Helper class for Google Play Services. Android relies on a security Provider to provide secure network communications. 
However, from time to time, vulnerabilities are found in the default security provider. 
To protect against these vulnerabilities, Google Play services provides a way to automatically 
update a device's security provider to protect against known exploits. By calling Google Play services methods, 
your app can ensure that it's running on a device that has the latest updates to protect against known exploits.

**Kind**: inner class of [<code>googleplayservcies</code>](#module_googleplayservcies)  
**Access**: public  
**See**: [https://developer.android.com/training/articles/security-gms-provider](https://developer.android.com/training/articles/security-gms-provider)  
