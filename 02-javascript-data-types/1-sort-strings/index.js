/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */

const sortAsc = (newArr) =>
    newArr.sort((a, b) =>
        a.localeCompare(b, ["ru", "en"], { caseFirst: "upper" })
    );

const sortDesc = (newArr) =>
    newArr.sort((a, b) =>
        b.localeCompare(a, ["ru", "en"], { caseFirst: "upper" })
    );

export function sortStrings(arr, param = "asc") {
    const newArr = [...arr];
    return param === "asc" ? sortAsc(newArr) : sortDesc(newArr);
}
