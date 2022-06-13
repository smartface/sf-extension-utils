const { expect } = require("chai");
const deviceMapping = require("../lib/appleDevices/deviceMapping.json");

const brandModelRegex = /^[a-zA-Z]+\d+$/;
const modelVersionNumRegex = /^\d+$/;

const devices = Object.keys(deviceMapping);
const deviceTypes = Object.values(deviceMapping);

const simulators = ["i386", "x86_64", "arm64"];
const IPHONE_SIMULATOR_VALUE = "iPhone Simulator";

describe("apple device type", function () {
  it('Is devices string', function () {
    devices.forEach((item) => expect(item).to.be.string);
    deviceTypes.forEach((item) => expect(item).to.be.string);
  });
});


describe("apple device test cases", function () {
  devices.forEach((device, index) => {
    it(`${index}: ${device}`, function () {
      const isValidPrefix = device.startsWith("i") || device.startsWith("W"); // For Apple Watch
      const splitted = device.split(",");
      const isSimulator = simulators.some((simulator) => simulator === device);

      if (splitted.length === 0) {
        throw new Error("Invalid Key on JSON");
      }
      if (isSimulator) {
        expect(deviceTypes[index]).to.be.equal(IPHONE_SIMULATOR_VALUE);
      }
      else {
        expect(isValidPrefix).to.be.equal(true);
        splitted.forEach((item, index) => {
          const regexPositiveTest = index === 0 ? brandModelRegex.test(item) : modelVersionNumRegex.test(item);
          const regexNegativeTest = index === 0 ? brandModelRegex.test(`${item}gibberish`) : modelVersionNumRegex.test(`,${item}`);
          expect(regexPositiveTest, "Positive Case Failed").to.be.equal(true);
          expect(regexNegativeTest, "Negative Case Failed").to.be.equal(false);
        })
      }
    })
  })
});