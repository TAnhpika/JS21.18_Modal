const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function Modal(options = {}) {
    const { templateId, closeMethods = ["button", "overlay", "escape"] } =
        options;
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
            console.log(
                "Trả về giá trị đã lưu(k tính lại): ",
                getScrollbarWidth.value,
            );

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

        console.log("1st cal: ", getScrollbarWidth.value);

        return scrollbarWidth;
    }

    this.open = () => {
        const content = template.content.cloneNode(true);

        // Create modal elements
        const backdrop = document.createElement("div");
        backdrop.className = "modal-backdrop";

        const container = document.createElement("div");
        container.className = "modal-container";

        if (this._allowButtonClose) {
            const closeBtn = document.createElement("button");
            closeBtn.className = "modal-close";
            closeBtn.innerHTML = "&times;";

            container.append(closeBtn);
            closeBtn.onclick = () => this.close(backdrop);
        }

        const modalContent = document.createElement("div");
        modalContent.className = "modal-content";

        // Append content and elements
        modalContent.append(content);
        container.append(modalContent);
        backdrop.append(container);
        document.body.append(backdrop);

        setTimeout(() => {
            backdrop.classList.add("show");
        }, 0);

        // Disable scrolling
        document.body.classList.add("no-scroll");
        document.body.style.paddingRight = getScrollbarWidth() + "px";

        // 2. Thêm tùy chọn bật/tắt cho phép click vào overlay để đóng modal. (form nhiều chỗ điền, out là mất)
        if (this._allowBackdropClose) {
            backdrop.onclick = (e) => {
                if (e.target === backdrop) {
                    this.close(backdrop);
                    // Enable scrolling
                    document.body.classList.remove("no-scroll");
                }
            };
        }

        if (this._allowEscapeClose) {
            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape") {
                    this.close(backdrop);
                    // Enable scrolling
                    document.body.classList.remove("no-scroll");
                }
            });
        }

        return backdrop;
    };

    this.close = (modalElement) => {
        modalElement.classList.remove("show");
        modalElement.ontransitionend = () => {
            modalElement.remove();
            // Enable scrolling
            document.body.classList.remove("no-scroll");
            document.body.style.paddingRight = "";
        };
    };
}

const modal1 = new Modal({
    templateId: "modal-1",
});

$("#open-modal-1").onclick = () => {
    const modalElement = modal1.open();

    // modal1.close()
};

const modal2 = new Modal({
    templateId: "modal-2",
    closeMethods: ['button', 'escape'],
    // footer: true,
    // cssClass: ['class1', 'class2', 'classN'],
    onOpen: () => {
        console.log("Modal opened");
    },
    onClose: () => {
        console.log("Modal closes");
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
