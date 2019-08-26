/**
 * Helper class for Google's SafetyNet API.
 * @public
 * @example
 * 
 */
class GoogleSafetyNet{
	/**
     * Creates a GoogleSafetyNet class with given configurations.
     * @param {object} options - Cofiguration of GoogleSafetyNet helper object (required)
     * @param {string} options.apiKey - API key from Google APIs 
     * @example
     * const GoogleSafetyNet = require("sf-extension-utils/lib/googlesafetynet");
     * const googleSafetyNet = new GoogleSafetyNet({
     *     apiKey: "***********"
     * });
     * if(googleSafetyNet.isPlayServicesAvailable()){
     * 	let nonce = googleSafetyNet.generateNonce();
     * 	googleSafetyNet.sendAttestationRequest(nonce);
     * 	..................
     * 	..................
     * }else {
     * 	console.log("Google Play services are not available. You cannot proceed further");
     * }
     */
	constructor(options){
		//options.apiKey
	}

	sendAttestationRequest(nonce){
		return new Promise;
	}

	generateNonce(){
		return Number;
	}

	isPlayServicesAvailable(){
		return Boolean;
	}
}

module.exports = exports = GoogleSafetyNet;