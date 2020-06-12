/**
 * Smartface RootDetection Module
 * @module rootdetection
 * @type {object}
 * @author Dogan Ekici <dogan.ekici@smartface.io>
 * @author Muhammed Yalcin Kuru <yalcin.kuru@smartface.io>
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @copyright Smartface 2019
 */

/**
 * Includes a few established methods to capture whether device is 
 * rooted or not. To know if device is rooted, looking for potentially dangerous 
 * app packages/paths, system folder accessibility, su binaries & schemas. The 
 * dangerous app packages/paths should be kept upto date by commuity.
 * 
 * @public
 * @class
 * 
 */
declare class RootDetection {
	constructor();

	private checkPathsForIOS(): boolean;
	private checkPathsForAndroid(): boolean;
	private checkSchemes(): boolean;
	private checkRootAccessGainedForIOS(): boolean;
	private checkRootAccessGainedForAndroid(): boolean;

	/**
	 * Checks the device either rooted or not.
	 * @method
	 * @return {boolean} - returns true in case of device rooted. Otherwise returns false.
	 * @public
	 * @instance
	 * @example
	 * 
	 * import RootDetection from 'sf-extension-utils/lib/security/rootdetection;
	 * 
	 * if (RootDetection.isRooted()) {
	 *     console.log("Attention your device is not trusted.");
	 * } else {
	 *     console.log("It seems you can trust your device");
	 * }
	 *
	 */
	isRooted(): boolean;

	private checkSuBinaryExistance(): boolean;
}

declare const rootDetection: RootDetection;

export default rootDetection;