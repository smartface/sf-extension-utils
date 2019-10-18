/*globals requireClass */

/**
 * Smartface GoogleSafetyNet Android Module
 * @module googlesafetynet
 * @type {object}
 * @author Muhammed Yalcin Kuru <yalcin.kuru@smartface.io>
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @copyright Smartface 2019
 */

/**
 * Helper class for Google's SafetyNet. SafetyNet provides a set of services and 
 * APIs that help protect your app against security threats, including device 
 * tampering, bad URLs, potentially harmful apps, and fake users.
 * @public
 * @class
 * @see {@link https://developer.android.com/training/safetynet/attestation.html}
 * @example
 *
 * const GoogleSafetyNet = require("sf-extension-utils/lib/security/googlesafetynet");
 * if (System.OS === "Android") {
 *     const googleSafetyNet = new GoogleSafetyNet({
 *         apiKey: "***********"
 *     });
 *     if (googleSafetyNet.isPlayServicesAvailable()) {
 *         let nonce = googleSafetyNet.generateNonce();
 *         // Nonce should be at least 16 bytes length
 *         googleSafetyNet.sendAttestationRequest(nonce)
 *             .then(jws => {
 *                 console.info(`JWS ${jws}`);
 *             })
 *             .catch(e => {
 *                 console.error(e);
 *             });
 *     }
 *     else {
 *         console.info("Google Play services are not available. You cannot proceed further");
 *     }
 * }
 *
 */
class GoogleSafetyNet {
	/**
	 * Creates a GoogleSafetyNet class with given configurations.
	 * @param {object} options - Cofiguration of GoogleSafetyNet helper object (required)
	 * @param {string} options.apiKey - API key from Google APIs (required). 
	 * <a href="https://developer.android.com/training/safetynet/attestation#obtain-api-key">See here</a> 
	 */
	constructor(options = {}) {
		this.apiKey = options.apiKey || "";
		const SafetyNetUtil = requireClass("io.smartface.android.utils.SafetyNetUtil");
		this.safetyNet = new SafetyNetUtil(this.apiKey);
	}

	/**
	 * Sends the runtime environment and request a signed attestation of the 
	 * assessment results from Google's servers and then resolves the returned 
	 * assessment result as JWS string. In case of Google backend services 
	 * are not available reject the request. 
	 * 
	 * <pre>
	 * //JWS example
	 * <code>
	 * {
	 *    "timestampMs": 9860437986543,
	 *    "nonce": "R2Rra24fVm5xa2Mg",
	 *    "apkPackageName": "com.package.name.of.requesting.app",
	 *    "apkCertificateDigestSha256": ["base64 encoded, SHA-256 hash of the
	 *                                    certificate used to sign requesting app"],
	 *    "ctsProfileMatch": true,
	 *    "basicIntegrity": true,
	 *  }
	 * </code>
	 * A signed attestation's payload typically contains the following fields:
	 * 
	 * <b>apkCertificateDigestSha256</b>: Base-64 encoded representation(s) of 
	 * the SHA-256 hash of the calling app's signing certificate(s)
	 * <b>apkPackageName</b>: The calling app's package name.
	 * <b>nonce</b>: The single-use token that the calling app passes to the API.
	 * <b>timestampMs</b>: Milliseconds past the UNIX epoch when the JWS response 
	 * message was generated by Google's servers.
	 * <b>ctsProfileMatch</b>: A stricter verdict of device integrity. If the value 
	 * of ctsProfileMatch is true, then the profile of the device running your app 
	 * matches the profile of a device that has passed Android compatibility testing.
	 * <b>basicIntegrity</b>: A more lenient verdict of device integrity. If only 
	 * the value of basicIntegrity is true, then the device running your app likely 
	 * wasn't tampered with. However, the device hasn't necessarily passed Android 
	 * compatibility testing.
	 * 
	 * You should trust the APK information only if the value of ctsProfileMatch 
	 * is true. So to validate device is trusted, check JWS's ctsProfileMatch & 
	 * basicIntegrity boolean variables. Google has a table
	 * to show how device status could affect the values of basicIntegrity and 
	 * ctsProfileMatch. <a href="https://developer.android.com/training/safetynet/attestation#potential-integrity-verdicts">See here</a> 
	 * 
	 * Note: Do not validate these two variables in source code if the code can 
	 * be accessed by reverse-engineering 
	 * 
	 * </pre>
	 * 
	 * @method
	 * @param {string} nonce - Unique identifier for validation of returned JWS.
	 * @returns {Promise} resolved with JWS and rejected with error message.
	 * @public
	 * @instance
	 * @see {@link https://developer.android.com/training/safetynet/attestation.html}
	 * @example
	 * 
	 * if (System.OS === "Android") {
	 *     sendAttestationRequest("a2d0sa1@3sqwe123f12sww")
	 *         .then(jws => {
	 *             console.log(`JWS ${jws}`);
	 *         })
	 *         .catch(e => {
	 *             console.error(e);
	 *         });
	 * }
	 *
	 */
	sendAttestationRequest(nonce) {
		return new Promise((resolve, reject) => {
			this.safetyNet.sendAttestationRequest(nonce, {
				onSuccess: function(jws) {
					resolve(jws);
				},
				onFailure: function(errorMsg) {
					reject(errorMsg);
				}
			});
		});
	}

	/**
	 * Generates random strings.
	 * @method generateNonce
	 * @return {string} - returns converted UTF-8 string from random generated 16 bytes.
	 * @public
	 * @instance
	 * @example
	 * 
	 * let nonce = googleSafetyNet.generateNonce();
	 */
	generateNonce() {
		let nonce = this.safetyNet.generateNonce();
		return nonce;
	}

	/**
	 * Checks google play services availability.
	 * @method isPlayServicesAvailable
	 * @return {boolean} - returns either google play services available currently or not.
	 * @public
	 * @instance
	 * @example
	 * 
	 * let isPlayServicesAvailable = googleSafetyNet.isPlayServicesAvailable();
	 */
	isPlayServicesAvailable() {
		let isPlayServicesAvailable = this.safetyNet.isPlayServicesAvailable();
		return isPlayServicesAvailable;
	}
}

module.exports = exports = GoogleSafetyNet;