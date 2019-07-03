Promise.prototype.finally = Promise.prototype.finally || function finallyPolyfill(callback) {
    var constructor = this.constructor;
    return this.then(function(value) {
        return constructor.resolve(callback()).then(function() {
            return value;
        });
    }, function(reason) {
        return constructor.resolve(callback()).then(function() {
            throw reason;
        });
    });
};

if (!('toJSON' in Error.prototype))
    Object.defineProperty(Error.prototype, 'toJSON', {
        value: function() {
            var alt = {};

            Object.getOwnPropertyNames(this).forEach(function(key) {
                alt[key] = this[key];
            }, this);

            return alt;
        },
        configurable: true,
        writable: true
    });