const extendEvent = require("../lib/extendEvent");
const { expect } = require("chai");

describe("extendEvent assertion", function() {
    const targetObject = {};
    const eventFunc = () => {
        return "Triggered on target click";
    }
    it('should add new event to target object', function() {
      extendEvent(targetObject, "onClick", eventFunc);
      expect(targetObject["onClick"]()).to.be.equal("Triggered on target click");
    })

    it('should return immediately when newEvent argument not passed to extendEvent', function() {
        extendEvent(targetObject, "onTouch");
        expect(targetObject["onTouch"]).to.be.undefined;
    })

    it('should add new event to target object even though there is an old event with same event name', function() {
        const newEventFunc = () => {
            return "Triggered new on target click event";
        }
        extendEvent(targetObject, "onClick", eventFunc);
        extendEvent(targetObject, "onClick", newEventFunc);
        expect(targetObject["onClick"]()).to.be.equal("Triggered new on target click event");
    })
    
  });