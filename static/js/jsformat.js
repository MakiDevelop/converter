function formatJS() {
    const jsInput = document.getElementById("js-input").value;
    const formattedJS = js_beautify(jsInput);  // 使用 js-beautify 进行格式化
    document.getElementById("js-output").value = formattedJS;
}

async function minifyJS() {
    const jsInput = document.getElementById("js-input").value;  // 获取输入的 JavaScript 代码
    try {
        console.log("Original JS input:", jsInput);

        // 调用 Terser 进行压缩
        const minifiedJS = await Terser.minify(jsInput, {
            ecma: 2015,  // 使用 ES6 支持
            compress: {
                drop_console: false  // 保留 console.log
            },
            mangle: false  // 关闭变量混淆
        });

        if (minifiedJS.error) {
            console.error("Terser Error:", minifiedJS.error);
            throw minifiedJS.error;
        }

        // 显示压缩后的代码在输出框中
        document.getElementById("js-output").value = minifiedJS.code;
        console.log("Minified JS output:", minifiedJS.code);  // 打印压缩结果

    } catch (error) {
        console.error("Caught Error:", error);
        document.getElementById("js-output").value = "压缩错误: " + error.message;
    }
}

function copyToClipboard() {
    const cssOutput = document.getElementById("js-output");
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