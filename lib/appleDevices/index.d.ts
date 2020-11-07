const Hardware = require('sf-core/device/hardware');
const System = require('sf-core/device/system');
const deviceMapping = require("./deviceMapping.json");

/**
 * Gets the human readable modelname for iphone devies.
 * Returns empty string on Android devices.
 * @ios
 * @returns {string} Device model
 */
export function getModelName(): string;