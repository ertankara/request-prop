/**
 * Returns requested property values from object
 * @param {Object} rawObject raw object to extract data from
 * @param {Array} requestedProps requested props from the raw object
 * @param {Array} modifications modifications array to operate on raw props
 * @param {Strings} renameIndication The character to determine returned prop rename indication
 * @returns {Object} An object that will contain the requested or modified keys
 */

const objectOperator = (rawObject, requestedProps, modifications, renameIndication) => {
  const newlyConstructedObject = {};
  const hasModifiers = modifications.length > 0;
  const lastRequestedKey = requestedProps[requestedProps.length - 1];
  const bucket = {};
  let isLastKey = false;

  for (const key of requestedProps) {
    if (key === lastRequestedKey) {
      isLastKey = true;
    }

    const propIndexPosition = key.indexOf('!') === -1 ? 0 : 1;

    // Remove configuration symbols from propname
    const propName = key
      .split('!')[propIndexPosition]
      .split(renameIndication)[0]
      .trim();

    // Throw into bucket for future use
    bucket[propName] = rawObject[propName];

    const didUserRenameProp = key
      .split('!')[propIndexPosition]
      .split(':')
      .length > 1;

    if (isLastKey && hasModifiers) {
      for (const modification of modifications) {
        const { props, computedName, operator } = modification
        const valueOfTargetProps = [];

        for (const prop of props) {
          valueOfTargetProps.push(bucket[prop.trim()]);
        }
        newlyConstructedObject[computedName.trim()] = operator(...valueOfTargetProps);
      }
    }

    // If the index is 0, then there was no `!` so user wanted
    // to have this prop in the return value
    const shouldIncludePropInReturnValue = propIndexPosition === 0;

    if (shouldIncludePropInReturnValue) {
      if (didUserRenameProp) {
        const newPropName = key
          .split('!')[propIndexPosition]
          .split(':')[1]
          .trim();

        newlyConstructedObject[newPropName] = bucket[propName];
      }
      else {
        newlyConstructedObject[propName] = bucket[propName];
      }
    }
  }

  return newlyConstructedObject;
}



/**
 * Returns a new array from the given array of objects
 * with objects but only requested props
 * @param {object} rawData raw data to extract props from
 * @param {array} requestedProps array of requested keys from object
 * @param {array} modifications an array to perform modifications on raw data
 * !__IMPORTANT__! -> You have to provide every requested key in the requestedProps
 *                    otherwise modifications won't have access to it.
 *                    Specifying in the modifications alone isn't enough!
 * @param {string} renameIndication renaming of prop indication
 * @returns {array | object} depends on input, if array is given hands
 *                           back a new array of objects with requested keys only or object
 */
const requestProp = (rawData, requestedProps, modifications = [], renameIndication = ':') => {
  if (
    rawData === undefined ||
    !Array.isArray(requestedProps)
  ) {
    throw new Error('Raw data and required props have to be specified');
  }

  if (!Array.isArray(rawData)) {
    return objectOperator(rawData, requestedProps, modifications, renameIndication);
  }

  const extractedData = [];

  for (const data of rawData) {
    const newlyConstructedObject = objectOperator(
      data,
      requestedProps,
      modifications,
      renameIndication
    );

    extractedData.push(newlyConstructedObject);
  }

  return extractedData;
}

export default requestProp;
