document.getElementById('parse-btn').addEventListener('click', function () {
    const ndjsonInput = document.getElementById('ndjson-input').value;
    const outputElement = document.getElementById('output');
    outputElement.innerHTML = ''; // 清空之前的內容

    try {
        // 將每一行 NDJSON 轉換為 JSON 對象
        const parsedLines = ndjsonInput.trim().split('\n').map(line => JSON.parse(line));

        // 使用 createJsonTree 函數來顯示可展開/收合的 JSON，預設展開
        createJsonTree(parsedLines, outputElement, true);

        // 保存解析后的 JSON 以供下載使用
        window.parsedJsonData = parsedLines;
    } catch (error) {
        // 捕獲解析錯誤
        outputElement.textContent = "錯誤的NDJSON格式！";
        window.parsedJsonData = null;  // 確保錯誤時不會保存錯誤數據
    }
});

// 新增展開/收合按鈕功能
document.getElementById('toggle-output-btn').addEventListener('click', function () {
    const outputElement = document.getElementById('output');
    const allValueSpans = outputElement.querySelectorAll('div'); // 查找所有 valueSpan 元素
    const isExpanded = this.textContent === '全部收合'; // 使用中文字符進行匹配

    allValueSpans.forEach(valueSpan => {
        valueSpan.style.display = isExpanded ? 'none' : 'block'; // 根據狀態展開或收合
    });

    // 切換按鈕文字
    this.textContent = isExpanded ? '全部展開' : '全部收合';
});


// 下載按鈕事件，將 parsedJsonData 轉換為 JSON 字符串並下載
document.getElementById('download-btn').addEventListener('click', () => {
    if (window.parsedJsonData) {
        const jsonStr = JSON.stringify(window.parsedJsonData, null, 2); // 格式化 JSON
        const blob = new Blob([jsonStr], { type: "application/json" });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = "data.json";
        link.click();
    } else {
        showModal("No valid JSON data to download.", 錯誤);
    }
});

// 動態設置左右框框等高
function setEqualHeight() {
    const outputHeight = document.getElementById('output').clientHeight;
    const textareaContainer = document.querySelector('.textarea-container');
    textareaContainer.style.height = outputHeight + 'px';
}

window.addEventListener('load', setEqualHeight);
window.addEventListener('resize', setEqualHeight);

// createJsonTree 函數，生成可展開/收合的 JSON 樹
function createJsonTree(data, container, expandAll = false) {
    if (Array.isArray(data)) {
        // 處理數組類型
        const ul = document.createElement('ul');
        data.forEach((item, index) => {
            const li = document.createElement('li');
            const toggleSpan = document.createElement('span');
            toggleSpan.style.cursor = 'pointer';
            toggleSpan.textContent = `${index}`;
            toggleSpan.style.fontWeight = 'bold'; // 加粗讓它看起來像可以展開的元素

            const valueSpan = document.createElement('div');
            valueSpan.style.display = expandAll ? 'block' : 'none'; // 默認展開或隱藏
            valueSpan.style.marginLeft = '10px';

            // 遞歸處理每個項目
            createJsonTree(item, valueSpan, expandAll);

            // 點擊事件，展開和收合項目
            toggleSpan.addEventListener('click', () => {
                valueSpan.style.display = valueSpan.style.display === 'none' ? 'block' : 'none';
            });

            li.appendChild(toggleSpan);
            li.appendChild(valueSpan);
            ul.appendChild(li);
        });
        container.appendChild(ul);
    } else if (typeof data === 'object' && data !== null) {
        // 處理對象類型
        const ul = document.createElement('ul');
        for (const key in data) {
            const li = document.createElement('li');
            
            const toggleSpan = document.createElement('span');
            toggleSpan.style.cursor = 'pointer';
            toggleSpan.textContent = key;
            toggleSpan.style.fontWeight = 'bold'; // 加粗鍵名

            const valueSpan = document.createElement('div');
            valueSpan.style.display = expandAll ? 'block' : 'none'; // 默認展開或隱藏
            valueSpan.style.marginLeft = '10px';

            if (typeof data[key] === 'object' && data[key] !== null) {
                // 如果是嵌套對象，遞歸處理
                createJsonTree(data[key], valueSpan, expandAll);
            } else {
                // 基本類型：顯示值
                valueSpan.textContent = ': ' + data[key];
            }

            // 點擊事件，展開和收合項目
            toggleSpan.addEventListener('click', () => {
                valueSpan.style.display = valueSpan.style.display === 'none' ? 'block' : 'none';
            });

            li.appendChild(toggleSpan);
            li.appendChild(valueSpan);
            ul.appendChild(li);
        }
        container.appendChild(ul);
    } else {
        // 基本數據類型（字符串、數字、布爾值等）
        const textNode = document.createTextNode(data);
        container.appendChild(textNode);
    }
}