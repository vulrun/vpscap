module.exports = {
  extendObj,
};

function extendObj(target, ...sources) {
  // Function to handle values in nested objects using dot notation
  const getDeepValue = (obj, path) => {
    const keys = path.split(".");

    return keys.reduce((acc, key) => {
      if (acc && acc.hasOwnProperty(key)) {
        return acc[key];
      }
      return undefined;
    }, obj);
  };

  const setDeepValue = (obj, path, value) => {
    const keys = path.split(".");
    let current = obj;

    // Traverse the path and create nested objects if needed
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }

    if (value === undefined) {
      // If the value is undefined, remove the property
      delete current[keys[keys.length - 1]];
    } else {
      current[keys[keys.length - 1]] = value;
    }
  };

  sources.forEach((source) => {
    Object.keys(source).forEach((key) => {
      const value = source[key];

      if (value === undefined) {
        // If the value is undefined, remove the property from the target path
        setDeepValue(target, key, value);
      } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        // If the value is an object, recurse and extend it
        // Initialize the key if it doesn't exist in target
        if (!target[key]) setDeepValue(target, key, {});
        extendObj(getDeepValue(target, key), value);
      } else if (key.includes(".")) {
        // If the key is a dot notation, set the value using setDeepValue
        setDeepValue(target, key, value);
      } else {
        // Regular assignment for non-nested keys
        target[key] = value;
      }
    });
  });

  return target;
}
