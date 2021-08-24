const { expect } = require("chai");
const guid = require("../lib/guid");

const guidRegex = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;

describe("guid assertion", function() {
  it('Is guid string', function() {
    expect(guid()).to.be.string;
  })
});

describe("guid positive cases", function() {
	const guidArray = new Array(5).fill().map(() => guid());

  guidArray.forEach((guid, index) => {
    it(`${index}: ${guid}`, function() {
      expect(guidRegex.test(guid)).to.be.equal(true);
    });
  });
});

describe("guid negative cases", function() {
	const guidArray = [`3${guid()}5`];
  guidArray.push(undefined);
  guidArray.push("1");
  guidArray.push(NaN);
  guidArray.push("3-3-3-3-3");

  guidArray.forEach((guid, index) => {
    it(`${index}: ${guid}`, function() {
      expect(guidRegex.test(guid)).to.be.equal(false);
    });
  });
});