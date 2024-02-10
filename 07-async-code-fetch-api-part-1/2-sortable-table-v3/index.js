import fetchJson from "./utils/fetch-json.js";
import { sortStrings } from "../../02-javascript-data-types/1-sort-strings/index.js";
const BACKEND_URL = "https://course-js.javascript.ru";
export default class SortableTable {
    constructor(
        headerConfig = [],
        {
            data = [],
            url = "",
            isSortLocally = url === "",
            sorted: {
                id = headerConfig.find((item) => item.sortable).id,
                order = "asc",
            } = {},
        } = {}
    ) {
        this.LOADING_COUNT = 30;
        this.headerConfig = [...headerConfig];
        this.data = [...data];
        this.url = url;
        this.element = "";
        this.subElements = "";
        this.isSortLocally = isSortLocally;
        this.sortingField = id;
        this.sortingOrder = order;
        this.endLoadingLimit;
        this.render();
    }
    createElement() {
        const element = document.createElement("div");
        element.classList.add("sortable-table");
        return element;
    }
    createElementContentTemplate() {
        return `
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.createHeaderContentTemplate()}
      </div>
      ${this.createBodyTemplate()}
    `;
    }
    createHeaderContentTemplate() {
        return this.headerConfig
            .map(
                ({ id, sortable, title }) => `
          <div
            class="sortable-table__cell"
            data-id="${id}"
            data-sortable="${sortable}"
            data-order="${this.sortingField === id ? this.sortingOrder : ""}"
          >
            <span>${title}</span>
            <span data-element="arrow" class="sortable-table__sort-arrow">
              <span class="sort-arrow"></span>
            </span>
          </div>
        `
            )
            .join("");
    }
    createBodyTemplate() {
        return `
          <div data-element="body" class="sortable-table__body"></div>
          <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
          <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
                <div></div>
          </div>
    `;
    }
    createRowsTemplate() {
        return this.data
            .map(
                (item) => `
          <a href="/products/${item.id}" class="sortable-table__row">
            ${this.createBodyRowTemplate(item)}
          </a>`
            )
            .join("");
    }

    createBodyRowTemplate(item) {
        return this.headerConfig.reduce(
            (
                result,
                {
                    id,
                    template = (value) =>
                        `<div class="sortable-table__cell">${value}</div>`,
                }
            ) => result + template(item[id]),
            ""
        );
    }
    async render() {
        this.element = this.createElement();
        this.element.innerHTML = this.createElementContentTemplate();

        this.subElements = this.getSubElements();
        this.createSubElementsEvents();

        await this.sort(this.sortingField, this.sortingOrder);
        this.element.classList[this.data.length ? "remove" : "add"](
            "sortable-table_empty"
        );
        this.subElements.body.innerHTML = this.createRowsTemplate();
    }
    removeSubElementsEvents() {
        if (!this.subElements?.header) {
            return;
        }
        this.subElements.header.removeEventListener(
            "pointerdown",
            this.handleHeaderClick
        );
    }
    getSubElements() {
        const subElements = {};
        const elements = this.element.querySelectorAll("[data-element]");
        for (const element of elements) {
            const name = element.dataset.element;
            subElements[name] = element;
        }
        return subElements;
    }

    async sort(id, order) {
        if (this.isSortLocally) {
            this.sortOnClient(id, order);
        } else {
            this.endLoadingLimit = 0;
            this.data = [];
            await this.sortOnServer(id, order);
        }
    }

    sortingMethods = {
        number: (order, field) => (a, b) => order * (a[field] - b[field]),
        string: (order, field) => (a, b) =>
            order *
            a[field].localeCompare(b[field], ["ru", "en"], {
                caseFirst: "upper",
            }),
    };

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

    sortOnClient(id, order) {
        const sortType = this.headerConfig.find(
            (item) => item.id === id
        ).sortType;
        const sortingFunction = this.sortingMethods[sortType];
        if (!sortingFunction) {
            return;
        }
        order = order === "asc" ? 1 : -1;

        this.data.sort(sortingFunction(order, id));
    }

    async sortOnServer(id, order) {
        this.element.classList.add("sortable-table_loading");
        const data = await this.loadData(id, order);
        this.element.classList.remove("sortable-table_loading");

        if (!data.length) {
            return;
        }
        this.data.push(...data);
        window.addEventListener("scroll", this.handleWindowScroll);
    }
    async loadData(id, order) {
        const start = this.endLoadingLimit;
        const end = this.endLoadingLimit + this.LOADING_COUNT;
        this.endLoadingLimit = end;

        const data = await fetchJson(
            `${BACKEND_URL}/${this.url}?_embed=subcategory.category&_sort=${id}&_order=${order}&_start=${start}&_end=${end}`
        );
        return data;
    }

    createSubElementsEvents() {
        if (!this.subElements?.header) return;
        this.subElements.header.addEventListener(
            "pointerdown",
            this.handleHeaderClick
        );
    }
    handleHeaderClick = async (e) => {
        e.preventDefault();
        const column = e.target.closest(".sortable-table__cell");
        if (!column || column.dataset.sortable !== "true") {
            return;
        }
        const id = column.dataset.id;
        const order = column.dataset.order === "desc" ? "asc" : "desc";
        this.sortingField = id;
        this.sortingOrder = order;
        this.subElements.header.innerHTML = this.createHeaderContentTemplate();
        this.subElements.body.innerHTML = "";
        await this.sort(id, order);
        this.subElements.body.innerHTML = this.createRowsTemplate();
    };
    handleWindowScroll = async () => {
        const windowRelativeBottom =
            document.documentElement.getBoundingClientRect().bottom;
        if (windowRelativeBottom > document.documentElement.clientHeight + 10) {
            return;
        }
        window.removeEventListener("scroll", this.handleWindowScroll);

        await this.sortOnServer(this.sortingField, this.sortingOrder);
        this.subElements.body.innerHTML += this.createRowsTemplate();
    };

    remove() {
        this.element.remove();
    }
    destroy() {
        window.removeEventListener("scroll", this.handleWindowScroll);
        this.removeSubElementsEvents();
        this.remove();
    }

}

