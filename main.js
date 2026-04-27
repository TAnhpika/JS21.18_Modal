const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// const form = $("#modal-2").content.querySelector("#login-form");
// chỉ lấy form trong template, k phải ở modal
// form.onsubmit = (e) => {
//     e.preventDefault();
//     console.log("Submitted");
// };

function Modal() {
    this.openModal = (options = {}) => {
        const { templateId, allowBackdropClose = true } = options;
        const template = $(`#${templateId}`);

        if (!template) {
            console.error(`#${templateId} does not exist!`);
            return;
        }

        const content = template.content.cloneNode(true);

        // Create modal elements
        const backdrop = document.createElement("div");
        backdrop.className = "modal-backdrop";

        const container = document.createElement("div");
        container.className = "modal-container";

        const closeBtn = document.createElement("button");
        closeBtn.className = "modal-close";
        closeBtn.innerHTML = "&times;";

        const modalContent = document.createElement("div");
        modalContent.className = "modal-content";

        // Append content and elements
        modalContent.append(content);
        container.append(closeBtn, modalContent);
        backdrop.append(container);
        document.body.append(backdrop);

        setTimeout(() => {
            backdrop.classList.add("show");
        }, 0);

        // Attach event listeners
        closeBtn.onclick = () => this.closeModal(backdrop);

        // 2. Thêm tùy chọn bật/tắt cho phép click vào overlay để đóng modal. (form nhiều chỗ điền, out là mất)
        if (allowBackdropClose) {
            backdrop.onclick = (e) => {
                if (e.target === backdrop) {
                    this.closeModal(backdrop);
                    // Enable scrolling
                    document.body.classList.remove("no-scroll");
                }
            };
        }
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                this.closeModal(backdrop);
                // Enable scrolling
                document.body.classList.remove("no-scroll");
            }
        });

        // 3. Khóa cuộn trang khi modal đang bật: tránh người dùng mất tập trung vào nội dung modal
        // Disable scrolling
        document.body.classList.add("no-scroll");

        return backdrop;
    };

    this.closeModal = (modalElement) => {
        modalElement.classList.remove("show");
        modalElement.ontransitionend = () => {
            modalElement.remove();
            // Enable scrolling
            document.body.classList.remove("no-scroll");
        };
    };
}

const modal = new Modal();

$("#open-modal-1").onclick = () => {
    const modalElement = modal.openModal({
        templateId: "modal-1",
    });

    const title = modalElement.querySelector("h1");
    console.log(title);
};

$("#open-modal-2").onclick = () => {
    const modalElement = modal.openModal({
        templateId: "modal-2",
        allowBackdropClose: false,
    });

    // 1. Xử lý đc sự kiện submit form, lấy đc các giá trị của input khi submit
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

$("#open-modal-3").onclick = () => {
    modal.openModal("<h1>Hellopika3</h1>");
};
