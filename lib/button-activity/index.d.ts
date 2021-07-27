/**
 * Button & ActivityIndicator helper module
 * @module button-activity
 * @type {function}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2018
 */
 
const Button = require('@smartface/native/ui/button');
const ActivityIndicator = require('@smartface/native/ui/activityindicator');

/**
 * Setups button and activity indicator for event. <br />
 * onPress event has two function arguments. Those functions controls 2 things: visiblity of the activityIndicator, enabled state of the button.
 * Also for android it makes sure that activityIndicator remains on top of the button.
 * @public
 * @method
 * @static
 * @param {Button} button - Button to setup onPress event
 * @param {ActivityIndicator} activityIndicator - to show on top of button
 * @param {function} onPress - event function for onPress of the button, has two arguments showIndicator & hideIndicator functions
 * @example
 * import setupButtonActivity from '@smartface/extension-utils/lib/button-activity';
 * setupButtonActivity(page.btnLogin, page.aiWait, (showIndicator, hideIndicator) => {
 *      showIndicator();
 *      userService.login(tbUsername.text, tbPassword.text).then(()=> {
 *          hideIndicator();
 *          Router.go("pgDashboard");
 *      }).catch(()=> {
 *          hideIndicator();
 *          alert("Cannot Login");
 *      });
 *  });
 * 
 */
export default function setupButtonActivity(button: Button, activityIndicator: ActivityIndicator, onPress: (showIndicator: () => {}, hideIndicator: () => {}) => {}): void;