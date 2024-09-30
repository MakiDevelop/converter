// 去重複檢查
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('check-btn').addEventListener('click', function () {
        const inputText = document.getElementById('duplicate-input').value.trim();
        const outputElement = document.getElementById('output');
        outputElement.innerHTML = ''; // 清空之前的内容

        // 將輸入的文本按行分割並過濾空行
        const lines = inputText.split('\n').filter(line => line.trim() !== '');

        // 使用 Set 去除重複行
        const uniqueLines = [...new Set(lines)];

        // 將去重複後的結果顯示在輸出框中
        outputElement.textContent = uniqueLines.join('\n');  // 如果 output 是 div 或其他標籤
        console.log(uniqueLines.join('\n'));
    });
});