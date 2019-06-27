import { assert } from 'chai';
import requestProp from '../src';

const exampleArray = [
  { id: 'f34ddva-gfghhvv-7775ffggcv', name: 'Jane', lastname: 'Doe', age: 26, favLanguage: 'JavaScript' },
  { id: 'f34ddva-gfghhvv-554fffdcca', name: 'Marry', lastname: 'Poppins', age: 19, favLanguage: 'Java' },
  { id: 'f34ddva-gfghhvv-6688ggggcc', name: 'John', lastname: 'Johnson', age: 35, favLanguage: 'Python' }
];

const exampleObject = {
  age: 26,
  name: 'Jane',
  lastname: 'Doe',
  favLanguage: 'JavaScript',
  id: 'f34ddva-gfghhvv-7775ffggcv'
};

describe('Retrieving objects', () => {
  it('returns requested props from object', () => {
    const newObjectWithRequestedProps = requestProp(
      exampleObject,
      ['age', 'lastname']
    );

    let didReturnProps = false;

    if (
      newObjectWithRequestedProps.hasOwnProperty('age') &&
      newObjectWithRequestedProps.hasOwnProperty('lastname')
    ) {
      didReturnProps = true;
    }

    assert(didReturnProps, 'failed to construct a new object with requested props');
  });

  it('returns requested props from objects within an array', () => {
    const newArrayWithObjectsWithRequestedKeys = requestProp(
      exampleArray,
      ['age', 'lastname']
    );

    let didReturnProps = true;

    for (const obj of newArrayWithObjectsWithRequestedKeys) {
      if (!obj.hasOwnProperty('age') || !obj.hasOwnProperty('lastname')) {
        didReturnProps = false;
      }
    }

    assert(didReturnProps, 'failed to construct a new array with objects with requested keys');
  });
});

describe('Renaming requested props', () => {
  it('renames requested props from object', () => {
    const newObject = requestProp(
      exampleObject,
      ['age: userAge']
    );

    assert(newObject.hasOwnProperty('userAge'), 'failed to rename prop retrieved from object');
  });

  it('renames requested props from array', () => {
    const newArray = requestProp(
      exampleArray,
      ['age: userAge']
    );

    let didRename = true;

    for (const obj of newArray) {
      if (!obj.hasOwnProperty('userAge')) {
        didRename = false;
      }
    }

    assert(didRename, 'failed to rename prop that is retrieved from an array');
  });
});

describe('Excluding props', () => {
  it('excludes unwanted props from object', () => {
    const newObject = requestProp(
      exampleObject,
      ['!age', 'lastname']
    );

    let didExcludeProps = false;

    if (newObject.hasOwnProperty('lastname') && !newObject.hasOwnProperty('age')) {
      didExcludeProps = true;
    }

    assert(didExcludeProps, 'failed to exclude unwanted property');
  });

  it('excludes unwanted props from array', () => {
    const newArray = requestProp(
      exampleArray,
      ['!age', 'lastname']
    );

    let didExcludeProps = true;

    for (const obj of newArray) {
      if (!obj.hasOwnProperty('lastname') && obj.hasOwnProperty('age')) {
        didExcludeProps = false;
      }
    }

    assert(didExcludeProps, 'failed to exclude props from array');
  });
});

describe('Applying modifications', () => {
  it('able to apply modifications using the object properties', () => {
    const newObject = requestProp(
      exampleObject,
      ['age'],
      [{ props: ['age'], operator: age => age + 10, computedName: 'myAgeInTenYears' }]
    );

    let doesApplyModification = false;

    if (
      newObject.hasOwnProperty('myAgeInTenYears') &&
      newObject.myAgeInTenYears === exampleObject.age + 10
    ) {
      doesApplyModification = true;
    }

    assert(doesApplyModification, 'failed to apply modification');
  });

  it('able to apply modificaitons using the objects that are inside arrays', () => {
    const newArray = requestProp(
      exampleArray,
      ['age'],
      [{ props: ['age'], operator: age => age + 10, computedName: 'myAgeInTenYears' }]
    );

      let doesApplyModification = true;

    for (let i = 0; i < newArray.length; i++) {
      if (
        !newArray[i].hasOwnProperty('myAgeInTenYears') &&
        newArray[i].myAgeInTenYears !== exampleArray.age + 10
      ) {
        doesApplyModification = false;
      }
    }

    assert(doesApplyModification, 'failed to apply modification to objects retrieved from arrays');
  });
});

describe('Adding additional properties', () => {
  it('adds new properties to returned object', () => {
    const newObject = requestProp(
      exampleObject,
      [],
      [],
      [{ key: 'socialSecurityNumber', value: 42 }]
    );

    let didAddNewProp = newObject.hasOwnProperty('socialSecurityNumber') &&
                        newObject.socialSecurityNumber === 42;

    assert(didAddNewProp, 'failed to add new property');
  });

  it('adds new props to objects that are returned from array', () => {
    const newArray = requestProp(
      exampleArray,
      [],
      [],
      [{ key: 'socialSecurityNumber', value: 42 }]
    );

    let didAdd = true;

    for (const obj of newArray) {
      if (
        !obj.hasOwnProperty('socialSecurityNumber') &&
        obj.socialSecurityNumber !== 42
      ) {
        didAdd = false;
      }
    }

    assert(
      didAdd,
      'failed to add new property to objects that are extracted from arrays'
    );
  });
});


describe('Error expectation', () => {
  it('throws error when prop-source object not provided', () => {
    let didThrowError = false;

    try {
      const newObject = requestProp(
        null,
        ['someProp']
      );
    } catch(e) {
      didThrowError = true;
    }

    assert(didThrowError, 'failed to throw error in the case of missing prop-source object');
  });

  it('throws error when requested object is not in the array form', () => {
    let didThrowError = false;

    try {
      const newObject = requestProp(
        exampleObject,
        {}
      );
    } catch(e) {
      didThrowError = true;
    }

    assert(didThrowError, 'failed to throw error when requestedProps isn\'t in the array form');
  });
});