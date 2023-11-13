/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
    const outObj = {};
    for(let itm in fields) {
        if(obj[fields[itm]]) {
            outObj[fields[itm]] = obj[fields[itm]];
        }
    }
    return outObj;
};
