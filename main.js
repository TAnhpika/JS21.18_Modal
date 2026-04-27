const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// <div class="modal-backdrop">
//     <div class="modal-container">
//         <button class="modal-close">&times;</button>
//         <div class="modal-content">
//              ...
//         </div>
//     </div>
// </div>;

function Modal() {
    this.openModal = (content) => {
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
        modalContent.innerHTML = content;
        container.append(closeBtn, modalContent);
        backdrop.append(container);
        document.body.append(backdrop);

        setTimeout(() => {
            backdrop.classList.add("show");
        }, 0); // tính bất đồng bộ - dù 0 nhưng vẫn chạy sau

        // Attach event listeners
        closeBtn.onclick = () => this.closeModal(backdrop);

        backdrop.onclick = (e) => {
            if (e.target === backdrop) {
                this.closeModal(backdrop);
            }
        };
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                this.closeModal(backdrop);
            }
        });
    };

    this.closeModal = (modalElement) => {
        modalElement.classList.remove("show");
        // thực hiện sau khi hoàn thành transition
        modalElement.ontransitionend = () => {
            // chạy 3 lần vì có 3 transition
            // từ lần 2 lỗi vì k thấy con để gỡ
            // document.body.removeChild(modalElement);

            // dù k có vẫn k báo lỗi
            modalElement.remove();
        };
    };
}

const modal = new Modal();

$("#open-modal-1").onclick = () => {
    modal.openModal($('#modal-1').innerHTML);
    /**
     * modal.openModal({
     * templateId: 'modal-1'
     * })
     */
};

$("#open-modal-2").onclick = () => {
    modal.openModal("<h1>Hellopika2</h1>");
};

$("#open-modal-3").onclick = () => {
    modal.openModal("<h1>Hellopika3</h1>");
};

console.log($('#modal-1').innerHTML);
