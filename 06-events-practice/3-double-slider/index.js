export default class DoubleSlider {
    constructor({
        min = 0,
        max = 100,
        formatValue = (value) => "$" + value,
        selected = {
            from: min,
            to: max,
        },
    } = {}) {
        this.min = min;
        this.max = max;
        this.formatValue = formatValue;
        this.selected = selected;
        this.element = this.renderElement();
        this.elems = {};
        this.createEvents();
        this.setStartParams();
    }
    renderElement() {
        const el = document.createElement("div");
        el.innerHTML = `
          <div class="range-slider">
            <span data-element="from">${this.formatValue(this.selected.from)}</span>
            <div class="range-slider__inner">
              <span class="range-slider__progress"></span>
              <span class="range-slider__thumb-left"></span>
              <span class="range-slider__thumb-right"></span>
            </div>
            <span data-element="to">${this.formatValue(this.selected.to)}</span>
          </div>`;
        return el.firstElementChild;
    }
    createEvents() {
        this.elems.from = this.element.querySelector("[data-element=from]");
        this.elems.to = this.element.querySelector("[data-element=to]");
        this.elems.left = this.element.querySelector(".range-slider__thumb-left");
        this.elems.right = this.element.querySelector(".range-slider__thumb-right");
        this.elems.progress = this.element.querySelector(".range-slider__progress");
        this.elems.inner = this.element.querySelector(".range-slider__inner");

        this.elems.left.addEventListener("pointerdown", this.onPointerDown);
        this.elems.right.addEventListener("pointerdown", this.onPointerDown);
        document.addEventListener("pointerup", this.onPointerUp);
        document.addEventListener("pointermove", this.onPointerMove);
    }
    setStartParams() {
        const diff = this.max - this.min;
        const left = Math.floor(((this.selected.from - this.min) / diff) * 100) + "%";
        const right = Math.floor(((this.max - this.selected.to) / diff) * 100) + "%";
        this.elems.progress.style.left = left;
        this.elems.progress.style.right = right;
        this.elems.left.style.left = left;
        this.elems.right.style.right = right;
    }
    onPointerDown = (e) => {
        e.preventDefault();
        const { left, right } = e.target.getBoundingClientRect();
        if (e.target.getAttribute('class') === 'range-slider__thumb-left') {
            this.shiftX = right - e.clientX;
            this.thumbDown = 'left';
        } else {
            this.shiftX = left - e.clientX;
            this.thumbDown = 'right';
        }
    };
    onPointerUp = (e) => {
        this.thumbDown = null;
        this.element.dispatchEvent(
            new CustomEvent("range-select", {
                detail: this.getValue(),
                bubbles: true,
            })
        );
    };
    onPointerMove = (e) => {
        e.preventDefault();
        const {
            left: innerLeft,
            right: innerRight,
            width,
        } = this.elems.inner.getBoundingClientRect();
        if (this.thumbDown === "left") {
            let newLeft = (e.clientX - innerLeft + this.shiftX) / width;
            const right = parseFloat(this.elems.right.style.right);
            if (newLeft < 0) {
                newLeft = 0;
            }
            newLeft *= 100;
            if (newLeft + right > 100) {
                newLeft = 100 - right;
            }
            this.elems.left.style.left =
            this.elems.progress.style.left = newLeft + "%";
            this.elems.from.innerHTML = this.formatValue(
                this.getValue().from
            );
        }
        if (this.thumbDown === "right") {
            let newRight = (innerRight - e.clientX - this.shiftX) / width;
            if (newRight < 0) {
                newRight = 0;
            }
            newRight *= 100;
            const left = parseFloat(this.elems.left.style.left);
            if (left + newRight > 100) {
                newRight = 100 - left;
            }
            this.elems.right.style.right =
                this.elems.progress.style.right =
                newRight + "%";
            this.elems.to.innerHTML = this.formatValue(
                this.getValue().to
            );
        }
    }
    getValue() {
        const diff = this.max - this.min;
        const { left } = this.elems.left.style;
        const { right } = this.elems.right.style;
        const from = Math.round(this.min + parseFloat(left) * 0.01 * diff);
        const to = Math.round(this.max - parseFloat(right) * 0.01 * diff);
        return { from, to };
    }
    remove() {
        this.element.remove();
    }
    destroy() {
        document.removeEventListener("pointerdown", this.onPointerDown);
        document.removeEventListener("pointerup", this.onPointerUp);
        document.removeEventListener("pointermove", this.onPointerMove);
        this.remove();
    }
}
