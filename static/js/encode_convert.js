document.getElementById('upload-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const fileInput = document.getElementById('file-input').files[0];
    const targetEncoding = document.getElementById('encoding-select').value;

    const formData = new FormData();
    formData.append('file', fileInput);
    formData.append('target_encoding', targetEncoding);

    const response = await fetch('/upload_and_convert/', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();

    if (response.ok) {
        document.getElementById('original-encoding').textContent = result.original_encoding;
        document.getElementById('preview-content').textContent = result.preview_content;

        // 顯示下載按鈕
        const downloadBtn = document.getElementById('download-btn');
        downloadBtn.style.display = 'block';

        // 設定下載連結
        downloadBtn.addEventListener('click', function () {
            window.location.href = `/download/${result.converted_file}`;
        });
    } else {
        alert(result.error || '發生錯誤，請重試。');
    }
});