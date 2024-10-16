function formatCSS() {
    const cssInput = document.getElementById("css-input").value;
    const formattedCSS = cssbeautify(cssInput, { indent: '  ' });
    document.getElementById("css-output").value = formattedCSS;
}

function minifyCSS() {
    const cssInput = document.getElementById("css-input").value;
    const minifiedCSS = csso.minify(cssInput).css;  // 使用 csso 来进行 CSS 压缩
    document.getElementById("css-output").value = minifiedCSS;
}

function copyToClipboard() {
    const cssOutput = document.getElementById("css-output");
    cssOutput.select();
    cssOutput.setSelectionRange(0, 99999);  // 选中内容

    // 执行复制命令
    document.execCommand("copy");

    // 显示模态框提示
    showModal("已复制内容到剪贴板！");
}

function showModal(message) {
    // 设置提示消息
    document.getElementById("modalMessage").textContent = message;

    // 使用 Bootstrap 的 modal 方法显示模态框
    const myModal = new bootstrap.Modal(document.getElementById('infoModal'));
    myModal.show();
}