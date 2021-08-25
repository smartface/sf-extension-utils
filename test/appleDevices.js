const { expect } = require("chai");
const deviceMapping = require("../lib/appleDevices/deviceMapping.json");

const brandModelRegex = /^[a-zA-Z]+\d+$/;
const modelVersionNumRegex = /^\d+$/;

const devices = Object.keys(deviceMapping);
const deviceTypes = Object.values(deviceMapping);

describe("apple device type", function () {
    it('Is devices string', function () {
        devices.forEach((item) => expect(item).to.be.string);
        deviceTypes.forEach((item) => expect(item).to.be.string);
    })
});


describe("apple device positive cases", function () {
    devices.forEach((device, index) => {
        it(`${index}: ${device}`, function () {
            const isValidPrefix = device.startsWith("i");
            expect(isValidPrefix).to.be.equal(true);

            const splitted = device.split(",");
            if (splitted.length > 0) {
                splitted.forEach((item, index) => {
                    if (index === 0) {
                        expect(brandModelRegex.test(item)).to.be.equal(true);
                    }
                    else {
                        expect(modelVersionNumRegex.test(item)).to.be.equal(true);
                    }
                })
            }
            else {
                throw new Error();
            }
        })
    })
});

describe("apple device negative cases", function () {
    devices.forEach((device, index) => {
        it(`${index}: ${device}`, function () {
            const isValidPrefix = !device.startsWith("i");
            expect(isValidPrefix).to.be.equal(false);

            const splitted = device.split(",");
            if (splitted.length > 0) {
                splitted.forEach((item, index) => {
                    if (index === 0) {
                        expect(brandModelRegex.test(`${item}gibberish`)).to.be.equal(false);
                    }
                    else {
                        expect(modelVersionNumRegex.test(`,${item}`)).to.be.equal(false);
                    }
                })
            }
            else {
                throw new Error();
            }
        })
    })
});
