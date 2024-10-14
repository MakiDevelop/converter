document.getElementById('convert-btn').addEventListener('click', function () {
    const inputText = document.getElementById('url-input').value;
    const convertType = document.querySelector('input[name="convert-type"]:checked').value;
    let result = '';

    if (convertType === 'encode') {
        result = encodeURIComponent(inputText);
    } else if (convertType === 'decode') {
        result = decodeURIComponent(inputText);
    }

    document.getElementById('output-text').textContent = result;
});

document.getElementById('copy-btn').addEventListener('click', function () {
    const outputText = document.getElementById('output-text').textContent;
    navigator.clipboard.writeText(outputText);
    alert('結果已複製');
});