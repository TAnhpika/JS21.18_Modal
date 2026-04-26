/** 
.bind(document) tạo function mới
Function mới này luôn có this === document
Khi gọi $('.modal'), this tự động là document
*/

// chỉ lấy đc phần tử đầu tiên với id --> cải thiện = lấy hết class
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const modal = $("#modal");

$("#open-modal").onclick = function () {
    modal.classList.add("show");
};

$("#modal-close").onclick = function () {
    modal.classList.remove("show");
};

modal.onclick = function (e) {
    // sai vì event-bubbling: click thẻ con sẽ nổi bọt ra thẻ cha -> click trong modal vẫn tắt
    // $('#modal').classList.remove('show')

    if (e.target === modal) {
        modal.classList.remove("show");
    }
};

// thoát khi nhấn Esc
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        modal.classList.remove("show");
    }
});
