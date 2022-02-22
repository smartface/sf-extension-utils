/**
 * Smartface RootDetection Module
 * @module rootdetection
 * @type {object}
 * @author Dogan Ekici <dogan.ekici@smartface.io>
 * @author Muhammed Yalcin Kuru <yalcin.kuru@smartface.io>
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @copyright Smartface 2019
 */

import System from "@smartface/native/device/system";
import AndroidRootConfig from './androidRoot.json';
import iOSJailBreakConfig from './iOSJailBreak.json';

let rootDetectionNative: any;

if (System.OS === System.OSType.IOS) {
	//@ts-ignore
	rootDetectionNative = new __SF_RootDetection();
} else {
	//@ts-ignore
	const RootDetectionUtil = requireClass(
		"io.smartface.android.utils.RootDetectionUtil"
	);
	rootDetectionNative = new RootDetectionUtil();
}

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
export default abstract class RootDetection {
	rootDetection: any;

	private static checkPathsForIOS(): boolean {
		rootDetectionNative.pathsToCheck = iOSJailBreakConfig.pathsToCheck;
		return rootDetectionNative.checkPaths();
	}
	private static checkPathsForAndroid(): boolean {
		const knownRootAppPackages = AndroidRootConfig.knownRootAppPackages;
		const isDetected = rootDetectionNative.checkAppPackages(
			//@ts-ignore
			array(knownRootAppPackages, "java.lang.String")
		);
		return isDetected;
	}
	private static checkSchemes(): boolean {
		rootDetectionNative.schemesToCheck = iOSJailBreakConfig.schemesToCheck;
		return rootDetectionNative.checkSchemes();
	}
	private static checkRootAccessGainedForIOS(): boolean {
		return rootDetectionNative.canViolateSandbox();
	}
	private static checkRootAccessGainedForAndroid(): boolean {
		const pathThatShouldNotWritable =  AndroidRootConfig.knownRootAppPackages;
		const isWritable = rootDetectionNative.checkRootAccessGained(
			//@ts-ignore
			array(pathThatShouldNotWritable, "java.lang.String")
		);
		return isWritable;
	}

	/**
	 * Checks the device either rooted or not.
	 * @method
	 * @return {boolean} - returns true in case of device rooted. Otherwise returns false.
	 * @public
	 * @static
	 * @example
	 *```
	 * import RootDetection from '@smartface/extension-utils/lib/security/rootdetection;
	 *
	 * if (RootDetection.isRooted()) {
	 *     console.log("Attention your device is not trusted.");
	 * } else {
	 *     console.log("It seems you can trust your device");
	 * }
	 *```
	 */
	static isRooted(): boolean {
		if (System.OS === System.OSType.IOS){
			return RootDetection.checkPathsForIOS() || RootDetection.checkSchemes() || RootDetection.checkRootAccessGainedForIOS();
		}
		else {
			return RootDetection.checkPathsForAndroid() || RootDetection.checkSuBinaryExistance() || RootDetection.checkRootAccessGainedForAndroid();
		}
	}

	private static checkSuBinaryExistance(): boolean {
		const suBinaryPaths = AndroidRootConfig.suBinaryPaths;
		const isThereSuBinaries = rootDetectionNative.checkSuBinaryExistance(
			//@ts-ignore
			array(suBinaryPaths, "java.lang.String"));
		return isThereSuBinaries;
	}
}
