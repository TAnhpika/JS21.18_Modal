const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

Modal.elements = [];

function Modal(options = {}) {
    const {
        templateId,
        cssClass = [],
        destroyOnClose = true,
        footer = false,
        closeMethods = ["button", "overlay", "escape"],
        onOpen,
        onClose,
    } = options;
    const template = $(`#${templateId}`);

    if (!template) {
        console.error(`#${templateId} does not exist!`);
        return;
    }

    // khi dùng _varName để đặt tên biến thì quy ước (giữa các devs) biến đó chỉ đc dùng trong hàm tạo. K dùng đối tướng sau khi tạo để gọi
    this._allowButtonClose = closeMethods.includes("button");
    this._allowBackdropClose = closeMethods.includes("overlay");
    this._allowEscapeClose = closeMethods.includes("escape");

    this._getScrollbarWidth = () => {
        if (this._getScrollbarWidth) return this._getScrollbarWidth;

        const div = document.createElement("div");
        Object.assign(div.style, {
            overflow: "scroll",
            position: "absolute",
            top: "-9999px",
        });

        document.body.appendChild(div);
        this._getScrollbarWidth = div.offsetWidth - div.clientWidth;
        document.body.removeChild(div);

        return this._getScrollbarWidth;
    };

    this.build = () => {
        const content = template.content.cloneNode(true);

        // Create modal elements
        this._backdrop = document.createElement("div");
        this._backdrop.className = "modal-backdrop";

        const container = document.createElement("div");
        container.className = "modal-container";

        cssClass.forEach((className) => {
            if (typeof className === "string") {
                container.classList.add(className);
            }
        });

        if (this._allowButtonClose) {
            const closeBtn = this.createButton(
                "&times;",
                "modal-close",
                this.close,
            );

            container.append(closeBtn);
        }

        const modalContent = document.createElement("div");
        modalContent.className = "modal-content";

        // Append content and elements
        modalContent.append(content);
        container.append(modalContent);

        if (footer) {
            this._modalFooter = document.createElement("div");
            this._modalFooter.className = "modal-footer";

            this.renderFooterContent();
            this.renderFooterButtons();

            container.append(this._modalFooter);
        }

        this._backdrop.append(container);
        document.body.append(this._backdrop);
    };

    this.setFooterContent = (html) => {
        this._footerContent = html;
        this.renderFooterContent();
    };

    this._footerButtons = [];

    this.addFooterButton = (title, cssClass, callback) => {
        const button = this.createButton(title, cssClass, callback);

        this._footerButtons.push(button);

        this.renderFooterButtons();
    };

    this.renderFooterContent = () => {
        // hỗ trợ thay đổi footer kể cả sau khi mở - sau này nút thay đổi nội dung sẽ hiện đc
        if (this._modalFooter && this._footerContent) {
            this._modalFooter.innerHTML = this._footerContent;
        }
    };

    this.renderFooterButtons = () => {
        // append khi đã hiện footer
        if (this._modalFooter) {
            this._footerButtons.forEach((button) => {
                this._modalFooter.append(button);
            });
        }
    };

    this.createButton = (title, cssClass, callback) => {
        const button = document.createElement("button");
        button.innerHTML = title;
        button.className = cssClass;
        button.onclick = callback;

        return button;
    };

    this.open = () => {
        Modal.elements.push(this);

        if (!this._backdrop) {
            this.build();
        }
        setTimeout(() => {
            this._backdrop.classList.add("show");
        }, 0);

        // Disable scrolling
        document.body.classList.add("no-scroll");
        document.body.style.paddingRight = this._getScrollbarWidth() + "px";

        if (this._allowBackdropClose) {
            this._backdrop.onclick = (e) => {
                if (e.target === this._backdrop) {
                    this.close();
                    // Enable scrolling
                    document.body.classList.remove("no-scroll");
                }
            };
        }

        if (this._allowEscapeClose) {
            document.addEventListener("keydown", this._handleEscapeKey);
        }

        this._onTransitionEnd(onOpen);

        return this._backdrop;
    };

    this._handleEscapeKey = (e) => {
        // chỉ modal trên cùng mới đóng
        const lastModal = Modal.elements[Modal.elements.length - 1];
        if (e.key === "Escape" && this === lastModal) {
            this.close();
        }
    };

    this._onTransitionEnd = (callback) => {
        this._backdrop.ontransitionend = (e) => {
            if (e.propertyName !== "transform") return;
            if (typeof callback === "function") callback();
        };
    };

    this.close = (destroy = destroyOnClose) => {
        Modal.elements.pop();

        this._backdrop.classList.remove("show");

        if (this._allowEscapeClose) {
            document.removeEventListener("keydown", this._handleEscapeKey);
        }

        this._onTransitionEnd(() => {
            if (this._backdrop && destroy) {
                // fix: transition gọi 3 lần nhưng khi set null sẽ văng lỗi
                this._backdrop.remove();
                this._backdrop = null;
                this._modalFooter = null;
            }
            // Enable scrolling - khi đã đóng hết modal
            if (!Modal.elements.length) {
                document.body.classList.remove("no-scroll");
                document.body.style.paddingRight = "";
            }

            if (typeof onClose === "function") onClose();
        });
    };

    this.destroy = () => {
        this.close(true);
    };
}

const modal1 = new Modal({
    templateId: "modal-1",
    destroyOnClose: false,
    onOpen: () => {
        console.log("Modal 1 opened");
    },
    onClose: () => {
        console.log("Modal 1 closed");
    },
});

$("#open-modal-1").onclick = () => {
    const modalElement = modal1.open();
};

const modal2 = new Modal({
    templateId: "modal-2",
    closeMethods: ["button", "escape"],
    cssClass: ["class1", "class2", "classN"],
    onOpen: () => {
        console.log("Modal 2 opened");
    },
    onClose: () => {
        console.log("Modal 2 closed");
    },
});

$("#open-modal-2").onclick = () => {
    const modalElement = modal2.open();

    const form = modalElement.querySelector("#login-form");
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const formData = {
                email: $("#email").value.trim(),
                password: $("#password").value.trim(),
            };

            console.log(formData);
        };
    }
};

const modal3 = new Modal({
    templateId: "modal-3",
    closeMethods: ["escape"],
    footer: true,
    onOpen: () => {
        console.log("Modal 3 opened");
    },
    onClose: () => {
        console.log("Modal 3 closed");
    },
});

modal3.setFooterContent('<h2>Footer content</h2>')
modal3.addFooterButton("Danger", "modal-btn danger pull-left", (e) => {
    alert("Danger clicked!");
});

modal3.addFooterButton("Cancel", "modal-btn", (e) => {
    modal3.close();
});

modal3.addFooterButton("<span>Agree</span>", "modal-btn primary", (e) => {
    // Something ...
    modal3.close();
});

$("#open-modal-3").onclick = () => {
    modal3.open();
};

/**
 * Current Task:
 * function getScrollbarWidth() thành phương thức nội bộ
 * tạo this.createButton
 * add nút sau khi mở
 * làm _onTransitionEnd ngắn hơn

 * New Task:
 * chuyển phương thức nội bộ thành hết Prototype: khi new Modal chỉ cần gọi, k cần tạo lại
 */
