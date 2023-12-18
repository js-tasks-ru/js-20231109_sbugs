import { SortableTable as PrimarySortableTable } from "./primaryTable.js";
export default class SortableTable extends PrimarySortableTable {
    constructor(headersConfig, { data = [], sorted = {} } = {}) {
        super(headersConfig, data);
        this.isSortLocally = true;
        this.defaultSortingField = "title";
        this.subElements = this.getSubElements();
        this.createListeners();
        this.setDefaultSorting();
    }
    createListeners() {
        const headers = this.subElements.headerCols;
        headers.forEach((headEl) => {
            const sortable = headEl.getAttribute("data-sortable");
            if (sortable !== "false") {
                headEl.addEventListener("pointerdown", (e) => {
                    const id = headEl.getAttribute("data-id");
                    const order = headEl.getAttribute("data-order");
                    this.resetHeaderArrows(id);
                    if (order === "" || order === "asc") {
                        this.sort(id, "desc");
                        headEl.setAttribute("data-order", "desc");
                    } else {
                        this.sort(id, "asc");
                        headEl.setAttribute("data-order", "asc");
                    }
                });
            }
        });
    }
    resetHeaderArrows(exceptId) {
        const headers = this.subElements.headerCols;
        headers.forEach((headEl) => {
            const id = headEl.getAttribute("data-id");
            if (exceptId !== id) {
                headEl.setAttribute("data-order", "");
            }
        });
    }
    setDefaultSorting() {
        this.sort(this.defaultSortingField, "asc", this.isSortLocally);
        const headers = this.subElements.headerCols;
        headers.forEach((headEl) => {
            const id = headEl.getAttribute("data-id");
            if (this.defaultSortingField === id) {
                headEl.setAttribute("data-order", "asc");
            }
        });
    }
}
