export default class NotificationMessage {
    constructor(msg = "", data = {
        duration: 10000,
        type: "success",
    }) {
        this.timerId = null;
        this.msg = msg;
        this.duration = data.duration;
        this.type = data.type;
        this.element = this.createElement();
    }
    createElement() {
        const element = document.createElement("div");
        element.innerHTML = this.createTemplate();
        return element.firstElementChild;
    }

    checkExistComponent() {
        return !!document.querySelector(".notification");
    }
    show(targetEl) {
        if (this.checkExistComponent()) {
            document.querySelector(".notification").remove();
        }
        if (targetEl) {
            targetEl.append(this.element);
        } else {
            document.querySelector("body").append(this.element);
        }
        this.timerId = setTimeout(() => {
            this.remove();
        }, this.duration);
    }
    createTemplate() {
        return `<div class="notification ${this.type}" style="--value: ${this.duration}ms">
                    <div class="timer"></div>
                    <div class="inner-wrapper">
                    <div class="notification-header">${this.type}</div>
                    <div class="notification-body">${this.msg}</div>
                    </div>
                </div>`;
    }
    remove() {
        this.element.remove();
    }
    destroy() {
        clearTimeout(this.timerId);
        this.remove();
    }
}
