/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */

export const omit = (obj, ...fields) => {
    for(let itm in fields) {
        obj[fields[itm]] && delete obj[fields[itm]];
    }
    return obj;
};
