/**
 * Button & ActivityIndicator helper module
 * @module button-activity
 * @type {function}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2018
 */
 
const Button = require('sf-core/ui/button');
const ActivityIndicator = require('sf-core/ui/activityindicator');
// const expect = require('chai').expect;

module.exports = exports = setupButtonActivity;

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
 * const setupButtonActivity = require("sf-extension-utils/lib/button-activity");
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
function setupButtonActivity(button, activityIndicator, onPress) {
    // expect(button).to.be.an.instanceof(Button);
    // expect(activityIndicator).to.be.an.instanceof(ActivityIndicator);
    // expect(onPress).to.be.a("function");

    const showIndicator = () => {
        activityIndicator.android.zIndex = button.android.zIndex + 1;

        activityIndicator.dispatch({
            type: "updateUserStyle",
            userStyle: {
                visible: true
            }
        });

        button.dispatch({
            type: "updateUserStyle",
            userStyle: {
                enabled: false
            }
        });
    };

    const hideIndicator = () => {
        activityIndicator.dispatch({
            type: "updateUserStyle",
            userStyle: {
                visible: false
            }
        });

        button.dispatch({
            type: "updateUserStyle",
            userStyle: {
                enabled: true
            }
        });
    };


    const existingOnPress = button.onPress && button.onPress.bind(button);
    button.onPress = () => {
        existingOnPress && existingOnPress();
        onPress.call(button, showIndicator, hideIndicator);
    };

}
