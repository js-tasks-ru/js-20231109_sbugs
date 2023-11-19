/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    if (size === 0) return "";
    if (!size) return string;
    let prevSign,
        sameCount = 0;
    return string
        .split("")
        .filter(function (sign) {
            sign === prevSign ? sameCount++ : (sameCount = 0);
            prevSign = sign;
            return sameCount < size;
        })
        .join("");
}
