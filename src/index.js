/**
 * If user wants to extract object props instead of objects that are
 * inside the array then this function should operate on the rawData
 * @param {object} rawObject
 * @param {array} requestedProps
 * @returns {object}
 */
function objectOperator(rawObject, requestedProps, modifications, renameIndication, paramSeparator) {
  const rawKeys = Object.keys(rawObject);
  const requestedKeys = Object.values(requestedProps);
  const keys = rawKeys.filter(rawKey => {
    return requestedKeys.find(el => el.split(renameIndication)[0] === rawKey);
  });
  const hasModifiers = modifications.length > 0;
  const newlyConstructedObject = {};
  const groupOfOperands = [];
  const cache = {};
  const lastKeyOfKeys = keys[keys.length - 1];
  let extractedMultiProps = false;
  let isLastKey = false;

  if (hasModifiers) {
    let hasMultiParam;
    let splittedFormOfElement;

    for (let i = 0; i < modifications.length; i++) {
      hasMultiParam = false;
      if (i % 2 === 0) { // Elements has to have the even index
        splittedFormOfElement = modifications[i].split(paramSeparator)
          .map(key => key.trim());
        // If the modifier is operating on multi prop
        hasMultiParam = splittedFormOfElement.length > 1;
      }

      if (hasMultiParam) {       // Refers to operands // Refers to operator function
        groupOfOperands.push([...splittedFormOfElement, modifications[i + 1]]);
      }
    }
  }

  for (const key of keys) {
    // Checking if the last element
    if (key === lastKeyOfKeys) {
      // Necessary because I need to cache all elements before
      // performing operations that operates on multiple prop
      isLastKey = true;
    }
    // Cache the props and values
    cache[key] = rawObject[key];
    let propName = key;
    let includeInTheReturnVal = false;
    const indexOfKeyInTheRequestedProps = requestedProps
      .findIndex(el => el.split(renameIndication)[0].trim() === key);

    // Means that the user has requested this prop
    //if (indexOfKeyInTheRequestedProps !== -1) {
      includeInTheReturnVal = true;
      const didUserRenamePropName = requestedProps[indexOfKeyInTheRequestedProps]
        .indexOf(renameIndication) !== -1;

      // If the prop in the requestedProps has a special character `renameIndication` in it
      // then user wants to rename the prop, so do it
      if (didUserRenamePropName) {
        // Get the new name for the prop
        propName = requestedProps[indexOfKeyInTheRequestedProps].split(renameIndication)[1].trim();
      }

      // If user wants to perform modifications on the retrieved prop val
      if (hasModifiers) {
        if (groupOfOperands.length > 0 && !extractedMultiProps && isLastKey) { // Data needs to be extracted
          // Last prop should be followed by new prop name
          for (const eachGroup of groupOfOperands) {
            const modifier = eachGroup[eachGroup.length - 1]; // The function
            const paramsToProvide = [];
            // Shouldn't interfere with the outer scope propName
            let propNameOfModifiedResult = eachGroup[eachGroup.length - 2].split(':')[1].trim();
            for (const cachedKey of Object.keys(cache)) {
              for (let i = 0; i < eachGroup.length; i++) {
                if (
                  typeof eachGroup[i] !== 'function' &&
                  eachGroup[i].split(':')[0] === cachedKey
                ) {
                  paramsToProvide.push({ arg: cache[cachedKey], index: i });
                }
              }
            }

            const operationResult = modifier(...paramsToProvide
              .sort((a, b) => a.index - b.index) // Sort them according to the way they are provided
              .map(el => el.arg)); // Retrun the arguments alone

            newlyConstructedObject[propNameOfModifiedResult.trim()] = operationResult;
          }

          extractedMultiProps = true;
        } else if (modifications.includes(key)) {
          // Get the key's index first and then find the function which
          // is expected receive
          const modifier = modifications[modifications.findIndex(el => el === key) + 1];
          if (!modifier || typeof modifier !== 'function') { // User has to provide a function as a following element
            throw new Error('Modifiers has to follow the element to operate on');
          }

          // Operate on data and store it
          newlyConstructedObject[propName.trim()] = modifier(rawObject[key]);
        }
      } else { // If user provided no modifier simply bind data
        newlyConstructedObject[propName.trim()] = rawObject[key];
      }

      if (includeInTheReturnVal) {

        if (!newlyConstructedObject.hasOwnProperty(propName)) {
          newlyConstructedObject[propName] = cache[key];
        }
      }
    //}
  }

  return newlyConstructedObject;
}

/**
 * Returns a new array from the given array of objects
 * with objects but only requested props
 * @param {object} rawData
 * @param {array} requestedProps
 * @param {array} modifications
 * an array that is made of keys and functions first key is given and
 * then the next element which is a function will be executed on this
 * element. Order of the elements matters! Key has to be followed by it's modifier
 * !__IMPORTANT__! -> You have to provide every requested key in the requestedProps
 *                    otherwise you won't get it. Specifying in the modifications
 *                    alone isn't enough.
 * @param {string} renameIndication
 * @param {string} paramSeparator Where to start parsing params received by modifiers
 * @returns {array} extracted data
 */
function requestProp(rawData, requestedProps, modifications = [], renameIndication = ':', paramSeparator = ',') {
  if (
    rawData === undefined ||
    !Array.isArray(requestedProps)
  ) {
    throw new Error('Raw data and required props have to be specified');
  }

  if (!Array.isArray(rawData)) {
    return objectOperator(rawData, requestedProps, modifications, renameIndication, paramSeparator);
  }

  const extractedData = [];

  for (const data of rawData) {
    const newlyConstructedObject = objectOperator(
      data,
      requestedProps,
      modifications,
      renameIndication,
      paramSeparator
    );

    extractedData.push(newlyConstructedObject);
  }

  return extractedData;
}

export default requestProp;
