/**
 * @typedef {Object} RootDetection
 */

const System = require("sf-core/device/system");


class RootDetection {
	/**
	 * Checks the device either rooted or not.
	 * @function RootDetection:isRooted
	 * @return {boolean} - returns true in case of device rooted. Otherwise returns false.
	 * @public
	 * @static
	 * @example
	 * const RootDetection = require("sf-extension-utils/lib/rootdetection");
	 * 
	 * let rootDetection = new RootDetection();
	 * if (rootDetection.isRooted()){
	 * 	console.log("Attention your device is unsecure and not trusted.");
	 * }else {
	 * 	console.log("Trust is gained");
	 * }
	 *
	 */
	constructor() {
		if (System.OS === "iOS") {
			this.rootDetection = new __SF_RootDetection();
		}
		else {

		}
	}

	checkPaths() {
		return System.OS === "iOS" ? this.checkPathsForIOS() : this.checkPathsForAndroid();
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
		return;
	}

	checkSchemes() {
		this.rootDetection.schemesToCheck = [
			"cydia://package/com.example.package"
		];
		return this.rootDetection.checkSchemes();
	}

	checkRootAccessGained() {
		return System.OS === "iOS" ? this.checkRootAccessGainedForIOS() : this.checkRootAccessGainedForAndroid();
	}

	checkRootAccessGainedForIOS() {
		return this.rootDetection.canViolateSandbox();
	}

	checkRootAccessGainedForAndroid() {
		return;
	}

	isRooted() {
		if (System.OS === "iOS")
			return this.checkPaths() || this.checkSchemes() || this.checkRootAccessGained()
		else
			// return checkPaths || checkSuBinaryExistance || checkRootAccessGained
			return;
	}

	//checkSuBinaryExistance(){
	//	return true || false;
	//}
}

const instance = new RootDetection();
Object.freeze(instance);

module.exports = exports = instance;
