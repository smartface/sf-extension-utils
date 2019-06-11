/**
 * Returns true if network connectivity is available
 * @author Yunus ATMACA <yunus.atmaca@smartface.io>
 * @module network
 * @static
 * @public
 * @example
 * const network = require("sf-extension-utils/lib/network");
 * net.isConnectivityAvailable()
 *      .then(available =>{
 *          console.log(available);
 *      })
 *      .catch(e =>{
 *          console.log(e);
 *      })
 */     

const Http = require("sf-core/net/http");

function isConnectivityAvailable(params){
    return new Promise((resolve, reject) => {
        var http = new Http();
        http.request({
            url : 'http://www.google.com',
            onLoad : function(e) {
                resolve(true);
    	    },
            onError : function(e) {
                if(e.statusCode === undefined){
                    resolve(false);
                }else{
                    reject(true);
                }
            }
        });
    });
}

exports.isConnectivityAvailable = isConnectivityAvailable;