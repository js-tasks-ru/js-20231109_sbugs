import SortableTableV1 from "../../05-dom-document-loading/2-sortable-table-v1/index.js";
export default class SortableTable extends SortableTableV1 {
    constructor(headerConfig, { data = [], sorted = {} } = {}) {
        super(headerConfig, data);
        this.isSortLocally = true;
        this.defaultSortingField = "title";
        this.subElements = this.getSubElements();
        this.createListeners();
        this.setDefaultSorting();
    }
    headerPointerdownEvent = (e) => {
        const headEl = e.target.closest(".sortable-table__cell");
        const id = headEl.getAttribute("data-id");
        const order = headEl.getAttribute("data-order");
        const sortable = headEl.getAttribute("data-sortable");
        this.resetHeaderArrows(id);
        if (sortable) {
            if (!order || order === "asc") {
                this.sort(id, "desc");
                headEl.setAttribute("data-order", "desc");
            } else {
                this.sort(id, "asc");
                headEl.setAttribute("data-order", "asc");
            }
        }
    };
    createListeners() {
        const header = this.subElements.header;
        header.addEventListener("pointerdown", this.headerPointerdownEvent);
    }
    resetHeaderArrows(exceptId) {
        const headers = this.subElements.header.children;
        for (const headEl of headers) {
            const id = headEl.getAttribute("data-id");
            if (exceptId !== id) {
                headEl.setAttribute("data-order", "");
            }
        }
    }
    setDefaultSorting() {
        this.sort(this.defaultSortingField, "asc", this.isSortLocally);
        const headers = this.subElements.header.children;
        for (const headEl of headers) {
            const id = headEl.getAttribute("data-id");
            if (this.defaultSortingField === id) {
                headEl.setAttribute("data-order", "asc");
            }
        }
    }
    remove() {
        const header = this.subElements.header;
        header.removeEventListener("pointerdown", this.headerPointerdownEvent);
        this.element.remove();
    }
}
