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
 * @returns {array} extracted data
 */
function requestProps(rawData, requestedProps, modifications = [], renameIndication = ':') {
  if (
    rawData === undefined ||
    !Array.isArray(requestedProps)
  ) throw new Error('Raw data and required props have to be specified');

  if (!Array.isArray(rawData)) {
    return objectOperator(rawData, requestedProps, modifications, renameIndication);
  }

  const extractedData = [];

  for (const data of rawData) {
    const newlyConstructedObject = objectOperator(data, requestedProps, modifications, renameIndication);

    extractedData.push(newlyConstructedObject)
  }

  return extractedData;
}


/**
 * If user wants to extract object props instead of objects that are
 * inside the array then this function should operate on the rawData
 * @param {object} rawObject
 * @param {array} requestedProps
 * @return {object}
 */
function objectOperator(rawObject, requestedProps, modifications, renameIndication) {
  const keys = Object.keys(rawObject);
  const hasModifiers = modifications.length > 0;
  const newlyConstructedObject = {};

  for (const key of keys) {
    let propName = key;
    const indexOfKeyInTheRequestedProps = requestedProps.findIndex(el => el.split(renameIndication)[0] === key);

    // Means that the user has requested this prop
    if (indexOfKeyInTheRequestedProps !== -1) {
      const didUserRenamePropName = requestedProps[indexOfKeyInTheRequestedProps]
        .indexOf(renameIndication) !== -1;

      // If the prop in the requestedProps has a special character `renameIndication` in it
      // then user wants to rename the prop, so do it
      if (didUserRenamePropName) {
        // Get the new name for the prop
        propName = requestedProps[indexOfKeyInTheRequestedProps].split(renameIndication)[1];
      }

      // If user wants to perform modifications on the retrieved prop val
      if (hasModifiers && modifications.includes(key)) {
        // Get the key's index first and then find the function which
        // is expected receive
        const modifier = modifications[modifications.findIndex(el => el === key) + 1];
        if (!modifier || typeof modifier !== 'function') // User has to provide a function as a following element
          throw new Error('Modifiers has to follow the element to operate on');

        // Operate on data and store it
        newlyConstructedObject[propName] = modifier(rawObject[key]);
      } else { // If user provided no modifier simply bind data
        newlyConstructedObject[propName] = rawObject[key];
      }
    }
  }

  return newlyConstructedObject;
}

// export default requestProps;
