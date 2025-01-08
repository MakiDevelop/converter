document.getElementById("subtitle-converter-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const fileInput = document.getElementById("subtitle-file");
    const targetFormat = document.getElementById("target-format").value;

    if (!fileInput.files.length) {
        alert("請選擇字幕文件！");
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("target_format", targetFormat);

    const response = await fetch("/api/convert_subtitle", {
        method: "POST",
        body: formData,
    });

    if (response.ok) {
        const result = await response.json();
        document.getElementById("preview-content").textContent = result.preview;
        const downloadBtn = document.getElementById("download-btn");
        downloadBtn.style.display = "block";
        downloadBtn.onclick = () => {
            const blob = new Blob([result.file_content], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `converted.${targetFormat}`;
            a.click();
            URL.revokeObjectURL(url);
        };
    } else {
        alert("文件转换失败！");
    }
});
