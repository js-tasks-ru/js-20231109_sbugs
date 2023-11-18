/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
    let out = {};
    if (!obj) return undefined;
    Object.keys(obj).forEach((itm) => {
        out[obj[itm]] = itm;
    });
    return out;
}
