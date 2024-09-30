document.addEventListener('DOMContentLoaded', function() {
    const convertBtn = document.getElementById('convert-btn');
    if (convertBtn) {
        convertBtn.addEventListener('click', function (event) {
            event.preventDefault();  // 阻止預設的表單提交行動
            
            // 獲取輸入框中的內容
            const inputText = document.getElementById('zh-input').value;
            const convertType = document.querySelector('input[name="convert-type"]:checked').value;

            // 構造請求
            fetch('/convert_zh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: inputText,
                    type: convertType
                }),
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById('output-text').innerText = data.converted_text;
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }
});

// 增加複製功能
document.getElementById('copy-btn').addEventListener('click', function () {
    const outputText = document.getElementById('output-text').innerText;
    if (outputText) {
        const tempInput = document.createElement('textarea');
        tempInput.value = outputText;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showModal('已成功複製轉換結果！', "成功");
    } else {
        showModal('沒有可複製的轉換結果！', "錯誤");
    }
});