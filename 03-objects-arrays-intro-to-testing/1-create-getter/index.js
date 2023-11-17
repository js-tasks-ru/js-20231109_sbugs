/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
    const a = path.split(".");
    return function (o) {
        return a.reduce((o, k) => (o && k ? o[k] : undefined), o);
    };
}
