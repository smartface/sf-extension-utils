<a name="module_BiometricLogin"></a>

## BiometricLogin : <code>Class</code>
Smartface biometric login module.
Provides an extendible class to handle most common biometric login quirks.
The account username-password will be encrypted on the device storage.

**Author**: Alper Ozışık <alper.ozisik@smartface.io>  
**Author**: Furkan Arabacı <furkan.arabaci@smartface.io>  
**Copyright**: Smartface 2019  

* [BiometricLogin](#module_BiometricLogin) : <code>Class</code>
    * _static_
        * [.validateFingerPrint()](#module_BiometricLogin.validateFingerPrint) ⇒ <code>Promise</code>
        * [.FIELDS](#module_BiometricLogin.FIELDS) : <code>Object</code>
    * _inner_
        * [~BiometricLogin](#module_BiometricLogin..BiometricLogin)
            * [new BiometricLogin(options)](#new_module_BiometricLogin..BiometricLogin_new)
        * [~getBooleanData(field)](#module_BiometricLogin..getBooleanData) ⇒ <code>boolean</code>
        * [~setBooleanData(field, value)](#module_BiometricLogin..setBooleanData)
        * [~getSecureData(field)](#module_BiometricLogin..getSecureData) ⇒ <code>SecureData</code>
        * [~getSecureData(loadParams)](#module_BiometricLogin..getSecureData)
        * [~loginWithFingerprint()](#module_BiometricLogin..loginWithFingerprint) ⇒ <code>Promise</code>
        * [~retrieveField(fieldName)](#module_BiometricLogin..retrieveField) ⇒ <code>string</code>
        * [~updateField(fieldName, value)](#module_BiometricLogin..updateField)
        * [~isFirstTime()](#module_BiometricLogin..isFirstTime) ⇒ <code>boolean</code>

<a name="module_BiometricLogin.validateFingerPrint"></a>

### BiometricLogin.validateFingerPrint() ⇒ <code>Promise</code>
Will prompt user to input their biometric information. Advanced use only.
This function is used internally, you do not need to call this on common cases.

**Kind**: static method of [<code>BiometricLogin</code>](#module_BiometricLogin)  
<a name="module_BiometricLogin.FIELDS"></a>

### BiometricLogin.FIELDS : <code>Object</code>
Fields that use Data variables to store contents, consider those as reserved keys.
Data will be written encrypted.

**Kind**: static typedef of [<code>BiometricLogin</code>](#module_BiometricLogin)  
**Read only**: true  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| USERNAME | <code>string</code> | <code>&quot;username&quot;</code> | 
| PASSWORD | <code>string</code> | <code>&quot;password&quot;</code> | 
| REMEMBER_ME | <code>string</code> | <code>&quot;rememberMe&quot;</code> | 
| USE_FINGERPRINT | <code>string</code> | <code>&quot;useFingerprint&quot;</code> | 

<a name="module_BiometricLogin..BiometricLogin"></a>

### BiometricLogin~BiometricLogin
**Kind**: inner class of [<code>BiometricLogin</code>](#module_BiometricLogin)  
<a name="new_module_BiometricLogin..BiometricLogin_new"></a>

#### new BiometricLogin(options)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>object</code> |  | Parameters to construct Fingerprint from |
| options.doNotAskOnFirstTime | <code>boolean</code> | <code>false</code> | Toggles the first time prompt |
| options.getField | <code>function</code> |  | Gets the stored field ( required ) |
| options.setField | <code>function</code> |  | Sets the stored field ( required ) |
| options.loginService | <code>function</code> |  | Service call to request on login ( required ) |
| options.dataPrefix | <code>string</code> | <code>&quot;fp&quot;</code> | Prefix to use on data store. E.g default on data will be fp-userName |
| options.serviceName | <code>string</code> | <code>&quot;Application.iOS.bundleIdentifier&quot;</code> | iOS only, defaults to bundleIdentifier. |
| options.confirmUseFingerprintOnFirstLogin | <code>boolean</code> | <code>true</code> | Specifies if biometric data is going to be prompted on first login |
| options.loginHandler | <code>function</code> |  | Post login actions, should return promise |

**Example**  
```js
const BiometricLogin = require("sf-extension-utils/lib/biometricLogin");
function onLoad(superOnLoad) {
    superOnLoad();
    const page = this;
    const { mtbEmail, mtbPassword } = page;
    const biometricLogin = new BiometricLogin({
        loginService: () => login(mtbEmail.materialTextBox.text, mtbPassword.materialTextBox.text),
        getField: getField.bind(page),
        setField: setField.bind(page)
    });
    page.biometricLogin = biometricLogin;
}
function onShow(superOnShow) {
    const page = this;
    page.biometricLogin && page.biometricLogin.load({
        doNotAutoAskLogin: false
    });
}

function setField(fieldName, value) {
    const page = this;
    const { mtbEmail, mtbPassword, switchRememberMe, switchFingerPrint } = page;
    switch (fieldName) {
        case BiometricLogin.FIELDS.USERNAME:
            return mtbEmail.materialTextBox.text = value;
        case BiometricLogin.FIELDS.PASSWORD:
            return mtbPassword.materialTextBox.text = value;
        case BiometricLogin.FIELDS.REMEMBER_ME:
            return switchRememberMe.toggle = true;
        case BiometricLogin.FIELDS.USE_FINGERPRINT:
            return switchFingerPrint.toggle = value;
        default:
            console.error("Invalid FIELDS");
            break;
    }
}

function getField(fieldName) {
    const page = this;
    const { mtbEmail, mtbPassword, switchRememberMe, switchFingerPrint } = page;
    switch (fieldName) {
        case BiometricLogin.FIELDS.USERNAME:
            return mtbEmail.materialTextBox.text;
        case BiometricLogin.FIELDS.PASSWORD:
            return mtbPassword.materialTextBox.text;
        case BiometricLogin.FIELDS.REMEMBER_ME:
            return switchRememberMe.toggle;
        case BiometricLogin.FIELDS.USE_FINGERPRINT:
            return switchFingerPrint.toggle;
        default:
            console.error("Invalid FIELDS");
            break;
    }
}

function login(username, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve({ token: "exampleToken" }), 1000);
    })
}
```
<a name="module_BiometricLogin..getBooleanData"></a>

### BiometricLogin~getBooleanData(field) ⇒ <code>boolean</code>
Fetchs given encrypted boolean field name. Advanced use only.

**Kind**: inner method of [<code>BiometricLogin</code>](#module_BiometricLogin)  

| Param | Type |
| --- | --- |
| field | <code>string</code> | 

<a name="module_BiometricLogin..setBooleanData"></a>

### BiometricLogin~setBooleanData(field, value)
Writes given boolean value to the device storage encrypted. Advanced use only.

**Kind**: inner method of [<code>BiometricLogin</code>](#module_BiometricLogin)  

| Param | Type |
| --- | --- |
| field | <code>string</code> | 
| value | <code>boolean</code> | 

<a name="module_BiometricLogin..getSecureData"></a>

### BiometricLogin~getSecureData(field) ⇒ <code>SecureData</code>
Returns relevant SecureData value. Advanced use only.

**Kind**: inner method of [<code>BiometricLogin</code>](#module_BiometricLogin)  

| Param | Type |
| --- | --- |
| field | <code>string</code> | 

<a name="module_BiometricLogin..getSecureData"></a>

### BiometricLogin~getSecureData(loadParams)
Main functionality of the module. Call this function at onShow method of the page for auto login handling.

**Kind**: inner method of [<code>BiometricLogin</code>](#module_BiometricLogin)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| loadParams | <code>Object</code> |  |  |
| loadParams.doNotAutoAskLogin | <code>boolean</code> | <code>false</code> | Toggles autologin on this function call |
| loadParams.rememberMeDisabledForTheFirstTime | <code>boolean</code> | <code>false</code> | Toggles disabling remember me functionality on first time |
| loadParams.useFingerprintDisabledForTheFirstTime | <code>boolean</code> | <code>false</code> | Will be logged in normally if set to false |

<a name="module_BiometricLogin..loginWithFingerprint"></a>

### BiometricLogin~loginWithFingerprint() ⇒ <code>Promise</code>
Tries to call 'loginService' Promise given on the constructor. Advanced use only.
This function is used internally, you do not need to call this on common cases.

**Kind**: inner method of [<code>BiometricLogin</code>](#module_BiometricLogin)  
<a name="module_BiometricLogin..retrieveField"></a>

### BiometricLogin~retrieveField(fieldName) ⇒ <code>string</code>
Returns given field. Advanced use only.

**Kind**: inner method of [<code>BiometricLogin</code>](#module_BiometricLogin)  

| Param | Type |
| --- | --- |
| fieldName | <code>string</code> | 

<a name="module_BiometricLogin..updateField"></a>

### BiometricLogin~updateField(fieldName, value)
Updates given field value. Advanced use only.

**Kind**: inner method of [<code>BiometricLogin</code>](#module_BiometricLogin)  

| Param | Type |
| --- | --- |
| fieldName | <code>string</code> | 
| value | <code>string</code> | 

<a name="module_BiometricLogin..isFirstTime"></a>

### BiometricLogin~isFirstTime() ⇒ <code>boolean</code>
Returns true if the device is not logged in fingerprint before.

**Kind**: inner method of [<code>BiometricLogin</code>](#module_BiometricLogin)  
