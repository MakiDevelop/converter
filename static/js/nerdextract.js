async function extractKeywords() {
    const text = document.getElementById("textInput").value;
    const response = await fetch("/api/extract_keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
    });

    const data = await response.json();
    displayKeywords(data.keywords || []); // 确保默认返回空数组以避免错误
}

function displayKeywords(keywords) {
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = ""; // 清空内容

    if (keywords.length === 0) {
        outputDiv.innerHTML = "<p class='text-danger'>未找到關鍵詞。</p>";
        return;
    }

    const keywordList = document.createElement("ul");
    keywordList.classList.add("list-group");

    keywords.forEach(keyword => {
        const keywordItem = document.createElement("li");
        keywordItem.classList.add("list-group-item");
        keywordItem.textContent = keyword;
        keywordList.appendChild(keywordItem);
    });

    outputDiv.appendChild(keywordList);
}