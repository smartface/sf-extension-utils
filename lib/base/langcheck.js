/* globals global*/
if (typeof global.lang === "undefined")
    throw Error("sf-extension-util: global.lang is not declared!");

module.exports = exports = LangChecker;

function LangChecker(moduleName) {
    if (!(this instanceof LangChecker))
        return new LangChecker(moduleName);

    var prefix = moduleName + "@sf-extension-utils: ";

    this.check = check;

    function check(item) {
        if (typeof item === "object" && item instanceof Array) {
            for (var i = 0; i < item.length; i++)
                check(item[i]);
            return;
        }

        if (typeof item !== "string")
            throw Error("item has to be string or string array");

            typeof global.lang[item] === "undefined" &&
                console.log(prefix + "lang." + item + " is not declared");
    }
}
