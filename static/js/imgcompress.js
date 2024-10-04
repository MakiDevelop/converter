const imageUpload = document.getElementById('image-upload');
const compressionSlider = document.getElementById('compression');
const compressionValue = document.getElementById('compression-value');
const optimizeBtn = document.getElementById('optimize-btn');
const previewImage = document.getElementById('preview-image');
const downloadBtn = document.getElementById('download-btn');
const canvas = document.getElementById('canvas');

let originalImage;

// 更新壓縮比例顯示
compressionSlider.addEventListener('input', function () {
    compressionValue.textContent = `${compressionSlider.value}%`;
});

// 處理圖片上傳
imageUpload.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            originalImage = new Image();
            originalImage.src = e.target.result;
            originalImage.onload = function () {
                previewImage.src = originalImage.src;
            };
        };
        reader.readAsDataURL(file);
    }
});

// 優化圖片
optimizeBtn.addEventListener('click', function () {
    if (!originalImage) {
        alert('請先上傳一張圖片');
        return;
    }

    const compressionQuality = compressionSlider.value / 100;

    // 設置 canvas 尺寸
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(originalImage, 0, 0);

    // 壓縮圖片
    const optimizedDataUrl = canvas.toDataURL('image/jpeg', compressionQuality);

    // 預覽壓縮後的圖片
    previewImage.src = optimizedDataUrl;

    // 下載壓縮後的圖片
    downloadBtn.href = optimizedDataUrl;
    downloadBtn.download = `optimized_image_${compressionQuality * 100}.jpg`;
});