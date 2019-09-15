/*globals requireClass, __SF_RootDetection, array */

/**
 * Smartface RootDetection Module
 * @module rootdetection
 * @type {object}
 * @author Dogan Ekici <dogan.ekici@smartface.io>
 * @author Muhammed Yalcin Kuru <yalcin.kuru@smartface.io>
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @copyright Smartface 2019
 */

const System = require("sf-core/device/system");

/**
 * RootDetection includes a few established methods to capture whether device is 
 * rooted or not. To know if device is rooted, looking for potentially dangerous 
 * app packages/paths, system folder accessibility, su binaries & schemas. The 
 * dangerous app packages/paths should be kept upto date by commuity.
 * 
 * @public
 * @class
 * @example
 * 
 * const RootDetection = require("sf-extension-utils/lib/security/rootdetection");
 * 
 * if (RootDetection.isRooted()) {
 *     console.log("Attention your device is not trusted.");
 * } else {
 *     console.log("It seems you can trust your device");
 * }
 * 
 */
class RootDetection {
	constructor() {
		if (System.OS === "iOS") {
			this.rootDetection = new __SF_RootDetection();
		}
		else {
			const RootDetectionUtil = requireClass(
				"io.smartface.android.utils.RootDetectionUtil");
			this.rootDetection = new RootDetectionUtil();
		}
	}

	checkPathsForIOS() {
		this.rootDetection.pathsToCheck = [
			"/Applications/Cydia.app",
			"/Library/MobileSubstrate/MobileSubstrate.dylib",
			"/bin/bash",
			"/usr/sbin/sshd",
			"/etc/apt",
			"/private/var/lib/apt",
			"/usr/sbin/frida-server",
			"/usr/bin/cycript",
			"/usr/local/bin/cycript",
			"/usr/lib/libcycript.dylib",
			"/Applications/FakeCarrier.app",
			"/Applications/Icy.app",
			"/Applications/IntelliScreen.app",
			"/Applications/MxTube.app",
			"/Applications/RockApp.app",
			"/Applications/SBSettings.app",
			"/Applications/WinterBoard.app",
			"/Applications/blackra1n.app",
			"/Library/MobileSubstrate/DynamicLibraries/LiveClock.plist",
			"/Library/MobileSubstrate/DynamicLibraries/Veency.plist",
			"/System/Library/LaunchDaemons/com.ikey.bbot.plist",
			"/System/Library/LaunchDaemons/com.saurik.Cydia.Startup.plist",
			"/bin/sh",
			"/etc/ssh/sshd_config",
			"/private/var/lib/cydia",
			"/private/var/mobile/Library/SBSettings/Themes",
			"/private/var/stash",
			"/private/var/tmp/cydia.log",
			"/usr/bin/sshd",
			"/usr/libexec/sftp-server",
			"/usr/libexec/ssh-keysign",
			"/var/cache/apt",
			"/var/lib/apt",
			"/var/lib/cydia",
		];
		return this.rootDetection.checkPaths();
	}

	checkPathsForAndroid() {
		let knownRootAppPackages = [
			"com.noshufou.android.su",
			"com.noshufou.android.su.elite",
			"eu.chainfire.supersu",
			"com.koushikdutta.superuser",
			"com.thirdparty.superuser",
			"com.yellowes.su",
			"com.topjohnwu.magisk",
			"kingoroot.supersu"
		];
		let isDetected = this.rootDetection.checkAppPackages(array(knownRootAppPackages, "java.lang.String"));
		return isDetected;
	}

	checkSchemes() {
		this.rootDetection.schemesToCheck = [
			"cydia://package/com.example.package"
		];
		return this.rootDetection.checkSchemes();
	}

	checkRootAccessGainedForIOS() {
		return this.rootDetection.canViolateSandbox();
	}

	checkRootAccessGainedForAndroid() {
		let pathThatShouldNotWritable = [
			"/system",
			"/system/bin",
			"/system/sbin",
			"/system/xbin",
			"/vendor/bin",
			"/sbin",
			"/etc"
		];
		let isWritable = this.rootDetection.checkRootAccessGained(array(pathThatShouldNotWritable, "java.lang.String"));
		return isWritable;
	}

	/**
	 * Checks the device either rooted or not.
	 * @method
	 * @return {boolean} - returns true in case of device rooted. Otherwise returns false.
	 * @public
	 * @instance
	 * @example
	 * 
	 * if (RootDetection.isRooted()) {
	 *     console.log("Attention your device is not trusted.");
	 * } else {
	 *     console.log("It seems you can trust your device");
	 * }
	 *
	 */
	isRooted() {
		if (System.OS === "iOS")
			return this.checkPathsForIOS() || this.checkSchemes() || this.checkRootAccessGainedForIOS();
		else
			return this.checkPathsForAndroid() || this.checkSuBinaryExistance() || this.checkRootAccessGainedForAndroid();
	}

	checkSuBinaryExistance() {
		let suBinaryPaths = [
			"/data/local/",
			"/data/local/bin/",
			"/data/local/xbin/",
			"/sbin/",
			"/su/bin/",
			"/system/bin/",
			"/system/bin/.ext/",
			"/system/bin/failsafe/",
			"/system/sd/xbin/",
			"/system/usr/we-need-root/",
			"/system/xbin/",
			"/cache/",
			"/data/",
			"/dev/"
		];
		let isThereSuBinaries = this.rootDetection.checkSuBinaryExistance(
			array(suBinaryPaths, "java.lang.String"));
		return isThereSuBinaries;
	}
}

const instance = new RootDetection();
Object.freeze(instance);

module.exports = exports = instance;
