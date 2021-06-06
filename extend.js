/**
 * Extend is the inheritance tool to create components, pages etc.
 * 
 * @verison 1.1.1
 * @params {function} _super Super class constructor which is interited by concrete class
 */
 
function inheritFrom(base, sub){
  const statics = Object.assign({}, base, sub);
  Object.assign(sub, statics);
  sub.prototype = Object.create(base.prototype);
  sub.prototype.constructor = sub;
}

const extend = function (_super) {
  return function createChildClass(f, proto) {
    if(this && this instanceof createChildClass){
      return new _super();
    }
    
    var __super = _super;
    
    if(_super.__map__){
      _super.__map__(function(fn){
        // if _super is bounded function, extract original function
        __super = fn;
        
        inheritFrom(fn, f);
      });
    } else {
      __super = _super;

      inheritFrom(_super, f);
    }
    
    // If exists user public methods helper
    if(proto) {
      // add methods to current class
      proto(f.prototype);
    }

    // original super class constructor
    const __origfn__ = function(_super){
      return function (_scope){
        //converts arguments array
        var args = Array.prototype.slice.call(arguments, 1);
        
        // creates super constructor chain for nested inheritance
        if(_super.__origfn__){
          args = [_super.__origfn__].concat(args);
        }
        
        // call super constructor with concrete scope
        __super.apply(_scope, args);
        return __super;
      };
    };
    
    // bounded child class definition
    return (function(bounded){
      bounded.__map__ = function(fn){
        fn(f);
      };
      
      bounded.__origfn__ = __origfn__(_super);
      return bounded;
    })(f.bind(null, __origfn__(_super)));
  };
};

module.exports = extend;
