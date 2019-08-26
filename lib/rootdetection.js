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
 static isRooted(){
 	if(System.OS === "iOS"){
 		return checkPaths || checkSchemes || checkRootAccessGained
 	else 
 		return checkPaths || checkSuBinaryExistance || checkRootAccessGained
 }


 checkPaths(appPackageName){
 	return true || false;
 }

 checkSuBinaryExistance(){
 	return true || false;
 }

 checkRootAccessGained(){
 	return true || false;
 }

 checkSchemes(schemes){
 	return true || false;
 }
}

