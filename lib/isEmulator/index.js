const Application = require('sf-core/application');
const System = require('sf-core/device/system');

function isEmulator() {
    if (System.OS === 'iOS') {
        return Application.ios.bundleIdentifier === "io.smartface.SmartfaceEnterpriseApp";
    }
    const AndroidConfig = require('sf-core/util/Android/androidconfig');
    return AndroidConfig.isEmulator;
}

module.exports = exports = isEmulator;