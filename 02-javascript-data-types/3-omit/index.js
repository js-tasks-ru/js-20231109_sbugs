/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
    let outObj = {};

    // Попробуйте использовать spread оператор, вместо Object.assign
    // https://github.com/js-tasks-ru/js-20231106_sbugs/pull/2
    t o d o
    Object.assign(outObj, obj);
    for(let itm in fields) {
        if(obj[fields[itm]]) {
            delete outObj[fields[itm]]
        }
    }
    return outObj;
};
