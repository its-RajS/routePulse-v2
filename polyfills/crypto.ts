// polyfills/crypto.ts
const cryptoObj = global.crypto || {};

if (!cryptoObj.getRandomValues) {
  cryptoObj.getRandomValues = function (array) {
    if (array == null) {
      throw new TypeError(
        "The provided value is not of type 'ArrayBufferView'."
      );
    }

    // Check if the array is a TypedArray
    if (
      !(
        array instanceof Uint8Array ||
        array instanceof Int8Array ||
        array instanceof Uint16Array ||
        array instanceof Int16Array ||
        array instanceof Uint32Array ||
        array instanceof Int32Array ||
        array instanceof Float32Array ||
        array instanceof Float64Array
      )
    ) {
      throw new TypeError("The provided value is not a valid TypedArray.");
    }

    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256); // Generate random bytes
    }
    return array;
  };
}

global.crypto = cryptoObj;
