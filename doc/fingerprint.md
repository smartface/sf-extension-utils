<a name="module_fingerprint"></a>

## fingerprint : <code>object</code>
Smartface Fingerprint for login module

**Author**: Alper Ozisik <alper.ozisik@smartface.io>  
**Copyright**: Smartface 2018  

* [fingerprint](#module_fingerprint) : <code>object</code>
    * _static_
        * [.useFingerprintLogin](#module_fingerprint.useFingerprintLogin)
        * [.fingerprint:init(options)](#module_fingerprint.fingerprint_init)
        * [.fingerprint:loginWithFingerprint()](#module_fingerprint.fingerprint_loginWithFingerprint)
        * [.fingerprint:updateCredentials([username], [password])](#module_fingerprint.fingerprint_updateCredentials)
    * _inner_
        * [~fingerprint:CryptopgyFunction](#module_fingerprint..fingerprint_CryptopgyFunction) ⇒ <code>string</code>
        * [~fingerprint:loginWithFingerprintCallback](#module_fingerprint..fingerprint_loginWithFingerprintCallback) : <code>function</code>

<a name="module_fingerprint.useFingerprintLogin"></a>

### fingerprint.useFingerprintLogin
Gets or sets the login with fingerprint preference

**Kind**: static property of [<code>fingerprint</code>](#module_fingerprint)  
**Access**: public  
**Properties**

| Name | Type |
| --- | --- |
| fingerprint:useFingerprintLogin | <code>boolean</code> | 

**Example**  
```js
const Switch = require('sf-core/ui/switch');
const fingerprint = require("sf-extension-utils/fingerprint");
var swLoginWithFingerprint = new Switch({ //switch in app settings
 toggle: fingerprint.useFingerprintLogin //set the initial value
});
swLoginWithFingerprint.onToggleChanged = function() {
 //set the updated value
 fingerprint.useFingerprintLogin = swLoginWithFingerprint.toggle;
};
```
<a name="module_fingerprint.fingerprint_init"></a>

### fingerprint.fingerprint:init(options)
Configures fingerprint login. Call this during page show. It is recommended to call it onShow event of the page

**Kind**: static method of [<code>fingerprint</code>](#module_fingerprint)  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>object</code> |  | configuration options |
| options.userNameTextBox | <code>UI.TextBox</code> |  | to use textbox as username or email field. If fingerprint is being used, username is automaticaly set (Required) |
| options.passwordTextBox | <code>UI.TextBox</code> |  | to use textbox as password field (Required) |
| options.callback | <code>fingerprint:loginWithFingerprintCallback</code> |  | is called when fingerprint login is called (Required) This callback is used to obtain password. When the login challege is successful it is important to call the success method of the fingerprintResult argument for the callback |
| [options.autoLogin] | <code>boolean</code> | <code>false</code> | to attempt fingerprint login after init. Takes effect after user gives permission and enables the setting |
| [options.autoEvents] | <code>boolean</code> | <code>false</code> | sets events to textboxes and button, sets keyboard types |
| [options.encryptionFunction] | <code>fingerprint:CryptopgyFunction</code> |  | stored values are encrypted with the given function |
| [options.decryptionFunction] | <code>fingerprint:CryptopgyFunction</code> |  | stored values are decrypted with the given function |
| [options.dataKeys] | <code>object</code> |  | sets the data key values to store persistent login information |
| [options.dataKeys.useFingerprintLogin] | <code>string</code> | <code>&quot;useFingerprintLogin&quot;</code> | key to store fingerprint login preference |
| [options.dataKeys.username] | <code>string</code> | <code>&quot;username&quot;</code> | key to store username |
| [options.dataKeys.password] | <code>string</code> | <code>&quot;password&quot;</code> | key to store password |
| [options.dataKeys.firstLogin] | <code>string</code> | <code>&quot;firstLogin&quot;</code> | key to store firstLogin |

**Example**  
```js
const TextBox = require('sf-core/ui/textbox');
const fingerprint = require("sf-extension-utils/fingerprint");
const tbUsername = new TextBox();
const tbPassword = new TextBox({ isPassword: true });
const Http = require("sf-core/net/http");
const Router = require('sf-core/router');

fingerprint.init({
    userNameTextBox: tbUsername,
    passwordTextBox: tbPassword,
    button: btnLogin,
    autoEvents: true,
    callback: function(err, fingerprintResult) {
        var password;
        if (err)
            password = tbPassword.text;
        else
            password = fingerprintResult.password;
        if (!password)
            return alert("password is required");
        loginWithUserNameAndPassword(tbUsername.text, password, function(err) {
            if (err)
                return alert("Cannot login. Check user name and password. Or system is down");
            fingerprintResult && fingerprintResult.success(); //Important!
            Router.go('dashboard', {
                //some data
            });
        });
    }
});

function loginWithUserNameAndPassword(username, password, callback) {
    Http.request({
        url: getTokenUrl,
        method: "POST",
        body: JSON.stringify({
            username,
            password
        })
    }, function(response) {
        //handle response
        callback(null); //to call .success
    }, function(e) {
        //invalid credentials?
        callback(e);
    });
}
```
<a name="module_fingerprint.fingerprint_loginWithFingerprint"></a>

### fingerprint.fingerprint:loginWithFingerprint()
Triggers fingerprint logon, causes calling of the callback in the init method

**Kind**: static method of [<code>fingerprint</code>](#module_fingerprint)  
**Access**: public  
**Example**  
```js
const Button = require('sf-core/ui/button');
const Router = require('sf-core/router');
const Http = require("sf-core/net/http");
const fingerprint = require("sf-extension-utils/fingerprint");
const btnLogin = new Button({
    onPress: function() {
        if (!tbUsername.text) {
            return alert("Username should not be empty");
        }
        fingerprint.loginWithFingerprint();
    }
});
```
<a name="module_fingerprint.fingerprint_updateCredentials"></a>

### fingerprint.fingerprint:updateCredentials([username], [password])
Updates stored credentials for fingerprint database

**Kind**: static method of [<code>fingerprint</code>](#module_fingerprint)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [username] | <code>string</code> | User name to store |
| [password] | <code>string</code> | Password to store |

**Example**  
```js
const fingerprint = require("sf-extension-utils/fingerprint");

//updates both username and password
fingerprint.updateCredentials("newUsername", "newPassword");

//updates password only
fingerprint.updateCredentials(null, "newPassword");

//updates username only
fingerprint.updateCredentials("newUsername");
fingerprint.updateCredentials("newUsername", null);
```
<a name="module_fingerprint..fingerprint_CryptopgyFunction"></a>

### fingerprint~fingerprint:CryptopgyFunction ⇒ <code>string</code>
Encryption or decryption sync functions

**Kind**: inner typedef of [<code>fingerprint</code>](#module_fingerprint)  
**Returns**: <code>string</code> - proccessed value  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | raw value |

<a name="module_fingerprint..fingerprint_loginWithFingerprintCallback"></a>

### fingerprint~fingerprint:loginWithFingerprintCallback : <code>function</code>
Callback for loginWithFingerprint in error first pattern.

**Kind**: inner typedef of [<code>fingerprint</code>](#module_fingerprint)  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>object</code> \| <code>string</code> | is set when password cannot be retrieved. In that case continue with regular login. |
| fingerprintResult | <code>object</code> |  |
| fingerprintResult.password | <code>string</code> | read the password value from here |
| fingerprintResult.success | <code>function</code> | it is important to call after a successful login |

