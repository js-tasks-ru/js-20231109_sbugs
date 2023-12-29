class Tooltip {
    constructor() {
        this.x = 10;
        this.y = 10;
        if (Tooltip.self) {
            return Tooltip.self;
        }
        Tooltip.self = this;
        this.element = this.createTooltipElement();
    }
    initialize() {
        document.addEventListener("pointerover", this.handlePointerover);
        document.addEventListener("pointerout", this.handlePointerout);
    }
    createTooltipElement() {
        const element = document.createElement("div");
        element.classList.add("tooltip");
        return element;
    }
    render(tooltip) {
        this.element.innerHTML = tooltip;
        document.body.append(this.element);
    }
    handlePointerover = (e) => {
        const tooltip = e.target.dataset.tooltip;
        if (!tooltip) {return;}
        document.addEventListener("pointermove", this.handleElementPointermove);
        this.render(tooltip);
    }
    handlePointerout = () => {
        document.removeEventListener("pointermove", this.handleElementPointermove);
        this.remove();
    }
    handleElementPointermove = (e) => {
        this.element.style.left = e.clientX + this.x + "px";
        this.element.style.top = e.clientY + this.y + "px";
    };
    remove() {
        this.element.remove();
    }
    destroy() {
        this.remove();
        document.removeEventListener("pointerover", this.handlePointerover);
        document.removeEventListener("pointerout", this.handlePointerout);
        Tooltip.self = null;
    }
}

export default Tooltip;
