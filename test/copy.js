const { expect } = require("chai");
const copy = require("../lib/copy");


const languages = ['TR', 'US', 'UK', 'NZ', 'AU'];

const person = {
  name: 'testName',
  car: undefined,
  address: {
    city: 'istanbul',
    doorNumber: 1,
  },
  languages,
  created: new Date()
};

const testObject = {
    name: "first",
    surname: "last",
    getFullName: function(){ return this.name + this.surname},
    regex: /\d+/,
    multiDimArray: [
        [1, null, "value"],
        [2, NaN, "heyyy"],
        [3]
    ]
}



describe("Person Object not Mutated Test", function() {
    const newObject = copy(person);

    it('should make a deep copy of the object', function() {
        expect(newObject !== person).to.be.equal(true);
        expect(newObject).to.be.not.equal(person);
    })

    it('should have same object values', function() {
        expect(newObject).to.deep.equal(person);
    })
    it('should copy single dimentional array', function() {
        expect(newObject.languages).to.be.an("array");
    })
  });


describe("Person Object Mutation Test", function() {
    const newObject = copy(person);

    it("shouldn't mutate copied object either at first level", function() {
        newObject.name = "NewName";
        newObject.car = "defined";
        newObject.created = "date";
        expect(newObject.name).to.not.equal(person.name);
        expect(newObject.car).to.not.equal(person.car);
        expect(newObject.created).to.not.equal(person.created);
    })

    it("shouldn't mutate copied object either for deeper values", function() {
        newObject.address.city = "bursa";
        newObject.address.doorNumber = 5;
        expect(newObject.address.city).to.not.equal(person.address.city);
        expect(newObject.address.doorNumber).to.not.equal(person.address.doorNumber);
    })
  });

  describe("testObject not Mutated Test", function() {
    const newObject = copy(testObject);

    it('should make a deep copy of the object', function() {
        expect(newObject !== testObject).to.be.equal(true);
        expect(newObject).to.be.not.equal(testObject);
    })

    it('should have same object values', function() {
        expect(newObject).to.deep.equal(testObject);
    })

    it('should copy function correctly', function() {
        expect(newObject.getFullName()).to.be.equal(newObject.name + newObject.surname);
    })

    it('should copy regex correctly', function() {
        expect(newObject.regex.test(100)).to.be.equal(true);
    })
    it('should copy multi dimentional array', function() {
        expect(newObject.multiDimArray).to.be.an("array");
        expect(newObject.multiDimArray.length).to.be.equal(3);
        expect(newObject.multiDimArray[0].length).to.be.equal(3);
    })
  });


  describe("testObject Mutation Test", function() {
    const newObject = copy(testObject);

    it("shouldn't mutate copied object either at first level", function() {
        newObject.name = "NewName";
        newObject.surname = "newSurname";
        newObject.regex= "date";
        expect(newObject.name).to.not.equal(testObject.name);
        expect(newObject.surname).to.not.equal(testObject.surname);
        expect(newObject.regex).to.not.equal(testObject.regex);
    })

    it("shouldn't mutate copied object either for deeper values", function() {
        newObject.multiDimArray[0].push("new Value");
        expect(newObject.multiDimArray).to.not.equal(testObject.multiDimArray);
    })
  });