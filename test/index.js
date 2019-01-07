import { assert } from 'chai';
import RequestProps from '../src';

const exampleArray = [
  { id: 'f34ddva-gfghhvv-7775ffggcv', name: 'Jane', lastname: 'Doe', age: 26, favLanguage: 'JavaScript' },
  { id: 'f34ddva-gfghhvv-554fffdcca', name: 'Marry', lastname: 'Poppins', age: 19, favLanguage: 'Java' },
  { id: 'f34ddva-gfghhvv-6688ggggcc', name: 'John', lastname: 'Johnson', age: 35, favLanguage: 'Python' }
];

describe('Main function behaviour', () => {
  it('should return the requested props', () => {
    let expectedVal = true;

    const complexObjectWhichHasMorePropsThanINeed = {
      id: 'f34ddva-gfghhvv-7775ffggcv',
      name: 'Jane',
      lastname: 'Doe',
      age: 26,
      favLanguage: 'JavaScript'
    };

    const retrievedVal = RequestProps(
      complexObjectWhichHasMorePropsThanINeed,
      ['name', 'lastname']
    )

    for (const key of Object.keys(retrievedVal)) {
      const expectedKeys = ['name', 'lastname'];
      if (!expectedKeys.includes(key)) {
        expectedVal = false;
      }
    }


    assert(expectedVal, 'Failed to return requested props');
  });


  it('shouldn\'t alter the value of the props while returning the object', () => {
    let expectedVal = true;

    const complexObjectWhichHasMorePropsThanINeed = {
      id: 'f34ddva-gfghhvv-7775ffggcv',
      name: 'Jane',
      lastname: 'Doe',
      age: 26,
      favLanguage: 'JavaScript'
    };

    const retrievedVal = RequestProps(
      complexObjectWhichHasMorePropsThanINeed,
      ['name', 'lastname']
    )

    for (const key of Object.keys(retrievedVal)) {
      const expectedKeys = ['name', 'lastname'];
      if (
        !expectedKeys.includes(key) &&
        retrievedVal[key] !== complexObjectWhichHasMorePropsThanINeed[key]
      ) {
        expectedVal = false;
      }
    }

    assert(expectedVal, 'The keys are retrieved but values don\'t match');
  });


  it('should be able to extract objects out of array with requested props', () => {
    let expectedVal = true;

    const retrievedVal = RequestProps(exampleArray, ['name']);

    for (const obj of retrievedVal) {
      if (!obj.name) expectedVal = false;
      else if (obj.name.favLanguage) expectedVal = false;
    }

    assert(expectedVal, 'The objects returned from arrays contains expected props')
  });

  it('should be able to extract objects out of array with requested props without altering the value', () => {
    const retrievedVal = RequestProps(exampleArray, ['name', 'id']);

    let expectedVal = false;

    for (const val of retrievedVal) {
      for (const obj of exampleArray) {
        if (val.id === obj.id) {
          expectedVal = val.name === obj.name;
        }
      }
    }

    assert(expectedVal, 'The objects returned from arrays contains expected props and values match')
  });
});


describe('Altering prop name', () => {
  it('should be able to alter prop name', () => {
    let expectedVal = true;
    const retrievedVal = RequestProps(exampleArray, ['name:userName', 'id:userId']);

    for (const val of retrievedVal) {
      if (!val.hasOwnProperty('userName')) expectedVal = false;
      else if (!val.hasOwnProperty('userId')) expectedVal = false;
    }

    assert(expectedVal, 'Failed to alter the name of the retrieved prop');
  });

  it('should be able to handle spaces while renaming props', () => {
    let expectedVal = true;

    const retrievedVal = RequestProps(
      {id: 'HHWE-1256'},
      ['id: Id']
    );

    if (!retrievedVal.hasOwnProperty('Id')) expectedVal = false;

    assert(expectedVal, 'Fails to handle space in prop names')
  })
});


describe('Applying modifications', () => {
  it('should apply modificaitions successfully', () => {
    let expectedVal = true;

    const retrievedVal = RequestProps(
      exampleArray,
      ['age', 'id'],
      ['age', function tenYearsLater(age) { return age + 10 }]
    );

    for (const val of retrievedVal) {
      for (const obj of exampleArray) {
        if (val.id === obj.id) {
          if (!(val.age === obj.age + 10)) {
            expectedVal = false;
          }
        }
      }
    }

    assert(expectedVal, 'Failed to apply modifications on retrieved props');
  });

  it('should apply modifications on multiple props', () => {
    let expectedVal = true;

    const retrievedVal = RequestProps(
      {name: 'Jane', greetMessage: 'Hello'},
      ['name', 'greetMessage'],
      ['name, greetMessage:myGreetMessage', (name, greetMessage) => `${greetMessage} ${name}`],
    )

    if (!retrievedVal.hasOwnProperty('myGreetMessage')) expectedVal = false;
    else if (retrievedVal['myGreetMessage'] !== 'Hello Jane') expectedVal = false;

    assert(expectedVal, 'Fails to modify on multiple props');
  });
});

describe('Throws error', () => {
  it('should throw error when one of the first two arguments are missing', () => {
    let expectedVal = false;
    try {
      RequestProps();
    } catch(e) {
      expectedVal = true;
    }

    assert(expectedVal, 'Failed to throw Error when arguments are missing');
  });

  it('should throw error when operand is given but no operator is given', () => {
    let expectedVal = false;

    try {
      RequestProps(exampleArray, ['name:Name'], ['name']);
    } catch(e) {
      expectedVal = true;
    }

    assert(expectedVal, 'Failed to throw an error when modifier is not given');
  })
});
