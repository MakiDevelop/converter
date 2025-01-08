document.addEventListener("DOMContentLoaded", function () {
    const imageUpload = document.getElementById("imageUpload");
    const inputImageElement = document.getElementById("inputImage");
    const outputCanvas = document.getElementById("outputCanvas");
    const processButton = document.getElementById("processButton");
    const downloadButton = document.getElementById("downloadButton");
    let uploadedFile = null;

    // 监听图片上传事件
    imageUpload.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (!file) {
            alert("請選擇圖片");
            return;
        }
        uploadedFile = file;

        // 预览图片
        const reader = new FileReader();
        reader.onload = (e) => {
            inputImageElement.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });

    // 点击“开始处理”按钮
    processButton.addEventListener("click", async () => {
        if (!uploadedFile) {
            alert("請先上傳圖片");
            return;
        }

        const formData = new FormData();
        formData.append("file", uploadedFile);

        try {
            // 调用后端 API
            const response = await fetch("/api/remove-bg", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("圖片處理失敗");
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            // 在 Canvas 上显示结果
            const img = new Image();
            img.src = url;
            img.onload = () => {
                const ctx = outputCanvas.getContext("2d");
                outputCanvas.width = img.width;
                outputCanvas.height = img.height;
                ctx.drawImage(img, 0, 0);
            };

            // 显示下载按钮
            downloadButton.style.display = "inline-block";
            downloadButton.onclick = () => {
                const link = document.createElement("a");
                link.href = url;
                link.download = "去背圖片.png";
                link.click();
            };
        } catch (error) {
            console.error("Error:", error);
            alert("處理圖片時出錯");
        }
    });
});