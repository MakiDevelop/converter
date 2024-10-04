// 動態加載 header 和 footer
document.getElementById('header').innerHTML = fetch('/static/html/header.html')
    .then(response => response.text())
    .then(data => document.getElementById('header').innerHTML = data);

document.getElementById('footer').innerHTML = fetch('/static/html/footer.html')
    .then(response => response.text())
    .then(data => document.getElementById('footer').innerHTML = data);

// 圖片轉換為Base64
document.getElementById('convert-btn').addEventListener('click', function () {
    const imageInput = document.getElementById('image-input').files[0];
    const base64Output = document.getElementById('base64-output');

    if (!imageInput) {
        alert('請選擇圖片文件！');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        base64Output.value = e.target.result;
    };
    reader.readAsDataURL(imageInput);
});

// Base64轉換為圖片
document.getElementById('decode-btn').addEventListener('click', function () {
    const base64Input = document.getElementById('base64-input').value.trim();
    const imageOutput = document.getElementById('image-output');
    const downloadBtn = document.getElementById('download-btn');

    if (!base64Input) {
        alert('請貼入Base64字串！');
        return;
    }

    const img = document.createElement('img');
    img.src = base64Input;
    img.alt = "轉換後的圖片";
    img.style.maxWidth = '100%';

    imageOutput.innerHTML = ''; // 清空之前的圖片
    imageOutput.appendChild(img); // 顯示新的圖片

    // 顯示下載按鈕
    downloadBtn.style.display = 'block';

    // 設置下載按鈕
    downloadBtn.addEventListener('click', function () {
        const a = document.createElement('a');
        a.href = base64Input;
        a.download = 'converted_image.png'; // 預設下載圖片名稱
        a.click(); // 觸發下載
    });
});