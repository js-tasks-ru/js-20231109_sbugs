export default class ColumnChart {
    constructor(data) {
        this.data = data?.data || [];
        this.label = data?.label || '';
        this.value = data?.value;
        this.link = data?.link || '';
        this.chartHeight = data?.chartHeight || 50;
        this.formatHeading = data?.formatHeading || function(val) { return `${val}`; };
        this.renderTemplate();
    }
    renderTemplate() {
        const element = document.createElement('div');
        element.insertAdjacentHTML('afterbegin', this.getTemplate() );
        this.element = element.firstElementChild;

    }
    createColumnsTemplate() {
        const max = Math.max(...this.data);
        let rows = '';
        this.data.forEach((i) => {
            const perc = (i / max * 100).toFixed(0);
            rows += `<div style="--value: ${Math.floor(i * 50 / max)}" data-tooltip="${perc}%"></div>`;
        });
        return rows;
    }
    getTemplate() {
        const skeleton = (!this.data.length) ? 'column-chart_loading' : '';
        return `
            <div class="column-chart ${skeleton}" style="--chart-height: 50">
                <div class="column-chart__title">
                    Total ${this.label} ${this.getLink()}</div>
                <div class="column-chart__container">
                  <div data-element="header" class="column-chart__header">${this.formatHeading(this.value)}</div>
                  <div data-element="body" class="column-chart__chart">
                    ${this.createColumnsTemplate()}
                  </div>
                </div>
              </div>
            `;
    }
    update(data) {
        if (data.length && !this.data.length) {
            this.element.classList.remove('column-chart_loading');
        } else if (!data.length && this.data.length) {
            this.element.classList.add('column-chart_loading');
        }
        this.data = data;
        this.element.querySelector(".column-chart__chart").innerHTML = this.createColumnsTemplate(this.data);
    }
    getLink() {
        return this.link ? `<a href="${this.link}" class="column-chart__link">View all</a>` : '';
    }
    remove() {
        this.element.remove();
    }
    destroy() {
        this.remove();
    }
}
