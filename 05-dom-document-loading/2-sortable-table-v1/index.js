export default class SortableTable {
    constructor(headerConfig = [], data = []) {
        this.data = data;
        this.headerConfig = headerConfig;
        this.element = this.createProdContainerTemplate();
    }
    createProdContainerTemplate() {
        const element = document.createElement("div");
        element.innerHTML = `
            <div data-element="productsContainer" class="products-list__container">
                ${this.createTableTemplate()}
            </div>
        `;
        return element.firstElementChild;
    }
    createTableTemplate() {
        return `
            <div class="sortable-table">
                ${this.createTableHeaderTemplate()}
                <div data-element="body" class="sortable-table__body">
                    ${this.createProductTemplate()}
                </div>
                <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
                <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
                  <div>
                    <p>No products satisfies your filter criteria</p>
                    <button type="button" class="button-primary-outline">Reset all filters</button>
                  </div>
                </div>
            </div>
        `;
    }
    createTableHeaderTemplate() {
        const headers = this.headerConfig.map(
            (itm) => `
            <div class="sortable-table__cell" data-id="${itm.id}" data-sortable="${itm.sortable}" data-order="">
                <span>${itm.title}</span>
            </div>`
        );
        return `
            <div data-element="header" class="sortable-table__header sortable-table__row">
                ${headers.join("")}
            </div>
        `;
    }
    createProductTemplate() {
        let rows = this.data.map((dataRow) => {
            let headRows = this.headerConfig
                .map((itm) => {
                    if (itm.id === "images") {
                        return `<div class="sortable-table__cell">
                                        <img class="sortable-table-image" alt="Image" src="${
                                            dataRow[itm.id][0].url
                                        }" />
                                    </div>`;
                    }
                    return `<div class="sortable-table__cell">${
                        dataRow[itm.id]
                    }</div>`;
                })
                .join("");
            return `
                    <a href="/products/${dataRow.id}" class="sortable-table__row">
                        ${headRows}
                    </a>
                `;
        });
        return rows.join("");
    }
    sort(fieldValue, orderValue) {
        const headConf = this.getHeaderConfig(fieldValue);
        headConf.sortType === "string"
            ? this.sortStrings(headConf.id, orderValue)
            : this.sortNumbers(headConf.id, orderValue);
        this.updateTableElement();
    }
    updateTableElement() {
        const table = this.element.getElementsByClassName(
            "sortable-table__body"
        )[0];
        table.innerHTML = this.createProductTemplate();
        this.subElements = this.getSubElements();
    }
    getSubElements() {
        return { body: this.element.querySelector("[data-element=body]") };
    }
    getHeaderConfig(fieldValue) {
        return this.headerConfig.find((itm) => itm.id === fieldValue);
    }
    sortStrings(id, order) {
        this.data.sort((a, b) =>
            order === "asc"
                ? a[id].localeCompare(b[id], ["ru", "en"], {
                      caseFirst: "upper",
                  })
                : b[id].localeCompare(a[id], ["ru", "en"], {
                      caseFirst: "upper",
                  })
        );
    }
    sortNumbers(id, order) {
        this.data.sort((a, b) =>
            order === "asc" ? a[id] - b[id] : b[id] - a[id]
        );
    }
    remove() {
        this.element.remove();
    }
    destroy() {
        this.remove();
    }
}
