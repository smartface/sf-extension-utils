/**
 * Adds default goBack action on pages
 * Sets android onBackButtonPressed
 * If a pageInstance has shouldExit, exits the application
 * Handles router.goBack and router.dismiss automatically
 * Custome behaviour can be overwritten by setting pageInstance.goBack
 * @module router
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2019
 */

const Application = require("sf-core/application");
const active = require("./active");
const StackRouter = require("@smartface/router/src/native/NativeStackRouter");
const buildExtender = require("./buildExtender");

Application.android.onBackButtonPressed = () => {
    active &&
        active.page &&
        active.page.goBack &&
        active.page.goBack();
};

const defaultGoBack = () => {
    let { router, match, shouldExit } = active.page;
    if (shouldExit) {
        Application.exit();
        return;
    }
    if (router instanceof StackRouter) {
        let historyAsArray = router.getHistoryasArray();
        if (historyAsArray) {
            if (router.isModal() && historyAsArray[0] === match.url && router.dismiss) {
                router.dismiss();
            }

            else {
                active.page.router.canGoBack() && active.page.router.goBack();
            }
        }

    }
};

buildExtender.postProcessors.push((match, routeData, router, pageInstance, pageProps, route) => {
    pageInstance.goBack = defaultGoBack;
});
