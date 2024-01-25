import fetchJson from './utils/fetch-json.js';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
    constructor(data = {}) {
        const {
            url = "",
            label = "",
            link = "",
            formatHeading = (value) => value,
            range: { from = new Date(), to = new Date() } = {},
        } = data;
        this.chartHeight = 50;
        this.label = label;
        this.link = link;
        this.formatHeading = formatHeading;
        this.summ = 0;
        this.max = 0;
        this.url = url;
        this.data = data;
        this.from = from.toISOString();
        this.to = to.toISOString();
        this.renderTemplate();
        this.update(this.from, this.to);
        this.subElements = this.getSubElements();
    }
    renderTemplate() {
        const element = document.createElement("div");
        element.insertAdjacentHTML("afterbegin", this.getTemplate());
        this.element = element.firstElementChild;
    }
    getTemplate() {
        const skeleton = !this.data.length ? "column-chart_loading" : "";
        return `
            <div class="column-chart ${skeleton}" style="--chart-height: 50">
                <div class="column-chart__title">
                    Total ${this.label} ${this.getLink()}</div>
                <div class="column-chart__container">
                  <div data-element="header" class="column-chart__header"></div>
                  <div data-element="body" class="column-chart__chart" />
                </div>
              </div>
            `;
    }

    countTotal(data) {
        Object.keys(data).forEach((itm) => {
            this.summ += data[itm];
            this.max = (data[itm] > this.max) ? data[itm] : this.max;
        });
    }
    createColumnElements(serverData) {
        let out = '';
        let percent, val;
        Object.keys(serverData).forEach((itm) => {
            percent = ((serverData[itm] / this.max) * 100).toFixed(0);
            val = Math.floor((serverData[itm] * this.chartHeight) / this.max);
            out += `<div style="--value: ${val}" data-tooltip="${percent}%"></div>`;
        });
        return out;
    }

    async update(from, to) {
        const serverData = await this.fetchData(from, to);
        this.countTotal(serverData);
        this.updateElement();
        const cols = this.createColumnElements(serverData);
        this.element.querySelector('.column-chart__chart').innerHTML = cols;
        return serverData;
    }
    updateElement() {
        if (this.summ > 0) { this.element.classList.remove('column-chart_loading'); }
        this.element.querySelector('.column-chart__header').innerHTML = this.formatHeading(this.summ);
    }
    async fetchData(from, to) {
        const url = `${BACKEND_URL}/${this.url}?from=${from}&to=${to}`;
        return await fetchJson(url);
    }
    getLink() {
        return this.link
            ? `<a href="${this.link}" class="column-chart__link">View all</a>`
            : "";
    }
    getSubElements() {
        const subElements = {};
        const elements = this.element.querySelectorAll("[data-element]");
        for (const el of elements) {
            const name = el.dataset.element;
            subElements[name] = el;
        }
        return subElements;
    }
    remove() {
        this.element.remove();
    }
    destroy() {
        this.remove();
    }

}
