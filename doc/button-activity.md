<a name="module_button-activity"></a>

## button-activity : <code>function</code>
Button & ActivityIndicator helper module

**Author**: Alper Ozisik <alper.ozisik@smartface.io>  
**Copyright**: Smartface 2018  
<a name="module_button-activity.setupButtonActivity"></a>

### button-activity.setupButtonActivity(button, activityIndicator, onPress)
Setups button and activity indicator for event. <br />
onPress event has two function arguments. Those functions controls 2 things: visiblity of the activityIndicator, enabled state of the button.
Also for android it makes sure that activityIndicator remains on top of the button.

**Kind**: static method of [<code>button-activity</code>](#module_button-activity)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| button | <code>Button</code> | Button to setup onPress event |
| activityIndicator | <code>ActivityIndicator</code> | to show on top of button |
| onPress | <code>function</code> | event function for onPress of the button, has two arguments showIndicator & hideIndicator functions |

**Example**  
```js
import setupButtonActivity from "@smartface/extension-utils/lib/button-activity";
setupButtonActivity(page.btnLogin, page.aiWait, (showIndicator, hideIndicator) => {
     showIndicator();
     userService.login(tbUsername.text, tbPassword.text).then(()=> {
         hideIndicator();
         Router.go("pgDashboard");
     }).catch(()=> {
         hideIndicator();
         alert("Cannot Login");
     });
 });
```
