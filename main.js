const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function Modal(options = {}) {
    const {
        templateId,
        cssClass = [],
        destroyOnClose = true,
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

    function getScrollbarWidth() {
        if (getScrollbarWidth.value) {
            return getScrollbarWidth.value;
        }

        const div = document.createElement("div");
        Object.assign(div.style, {
            overflow: "scroll",
            position: "absolute",
            top: "-9999px",
        });

        document.body.appendChild(div);

        const scrollbarWidth = div.offsetWidth - div.clientWidth;

        document.body.removeChild(div);

        getScrollbarWidth.value = scrollbarWidth;

        return scrollbarWidth;
    }

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
            const closeBtn = document.createElement("button");
            closeBtn.className = "modal-close";
            closeBtn.innerHTML = "&times;";

            container.append(closeBtn);
            closeBtn.onclick = () => this.close();
        }

        const modalContent = document.createElement("div");
        modalContent.className = "modal-content";

        // Append content and elements
        modalContent.append(content);
        container.append(modalContent);
        this._backdrop.append(container);
        document.body.append(this._backdrop);
    };

    this.open = () => {
        // nếu k có trong DOM ms build, k sẽ sinh ra nhìu backdrop dư
        if (!this._backdrop) {
            this.build();
        }
        setTimeout(() => {
            this._backdrop.classList.add("show");
        }, 0);

        // Disable scrolling
        document.body.classList.add("no-scroll");
        document.body.style.paddingRight = getScrollbarWidth() + "px";

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
            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape") {
                    this.close();
                    // Enable scrolling
                    document.body.classList.remove("no-scroll");
                }
            });
        }

        this._backdrop.ontransitionend = (e) => {
            if (e.propertyName !== "transform") return;
            if (typeof onOpen === "function") onOpen();
        };
        return this._backdrop;
    };

    this.close = (destroy = destroyOnClose) => {
        this._backdrop.classList.remove("show");
        this._backdrop.ontransitionend = (e) => {
            if (e.propertyName !== "transform") return;

            if (this._backdrop && destroy) {
                // fix: transition gọi 3 lần nhưng khi set null sẽ văng lỗi
                this._backdrop.remove();
                this._backdrop = null;
            }
            // Enable scrolling
            document.body.classList.remove("no-scroll");
            document.body.style.paddingRight = "";

            if (typeof onClose === "function") onClose();
        };
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
    // footer: true,
    cssClass: ["class1", "class2", "classN"],
    onOpen: () => {
        console.log("Modal 2 opened");
    },
    onClose: () => {
        console.log("Modal 2 closed");
    },
});

// modal2.open()
// modal2.close(true) // chỉ ẩn class show, k gỡ để có thể đọc tiếp từ đoạn khi đóng
// modal2.setFooterContent('HTML string)
// modal2.addFooterButton('Cancel', 'class-1', 'class-2', (e) => {})
// modal2.addFooterButton('Agree', 'class-3', 'class-4', (e) => {})
// modal2.destroy() // gỡ hẳn khỏi DOM

$("#open-modal-2").onclick = () => {
    const modalElement = modal2.open();

    // modal2.close()

    // 1. Xử lý đc sự kiện submit form
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
