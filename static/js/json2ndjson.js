document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('convert-btn').addEventListener('click', function () {
        const jsonInput = document.getElementById('json-input').value.trim();
        const outputElement = document.getElementById('output');
        outputElement.innerHTML = ''; // 清空之前的内容

        try {
            // 解析 JSON 字符串
            const jsonArray = JSON.parse(jsonInput);
            
            if (!Array.isArray(jsonArray)) {
                outputElement.textContent = "輸入的 JSON 格式必須是一個數組！";
                return;
            }

            // 將每個 JSON 物件轉換成 NDJSON
            const ndjsonLines = jsonArray.map(obj => JSON.stringify(obj));
            outputElement.textContent = ndjsonLines.join('\n'); // 每個物件單獨一行

        } catch (error) {
            outputElement.textContent = "無效的 JSON 格式！";
        }
    });

    // 複製內容功能
    document.getElementById('copy-btn').addEventListener('click', function () {
        const outputText = document.getElementById('output').textContent;  // 获取 div 的文本内容
        
        if (navigator.clipboard) {
            // 使用現代API
            navigator.clipboard.writeText(outputText).then(function() {
                showModal('NDJSON 內容已複製到剪貼簿', "成功");
            }).catch(function(err) {
                console.error('複製失敗: ', err);
            });
        } else {
            // 傳統回退方案
            const tempTextarea = document.createElement('textarea');
            tempTextarea.value = outputText;
            document.body.appendChild(tempTextarea);
            tempTextarea.select();
            document.execCommand('copy');
            document.body.removeChild(tempTextarea);
            showModal('NDJSON 內容已複製到剪貼簿', "成功");
        }
    });

    // 下載 NDJSON 檔功能
    document.getElementById('download-btn').addEventListener('click', function () {
        const outputText = document.getElementById('output').textContent;
        const blob = new Blob([outputText], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'output.ndjson';  // 設置下載文件名
        link.click();  // 觸發下載
    });
});