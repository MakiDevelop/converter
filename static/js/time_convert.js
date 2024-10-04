// Timestamp 與日期轉換
function convertToDate() {
    const timestampInput = document.getElementById('timestamp-input').value;
    const timestamp = parseInt(timestampInput, 10);
    if (!isNaN(timestamp)) {
        const date = new Date(timestamp * 1000);
        document.getElementById('date-output').innerText = date.toLocaleString();
    } else {
        document.getElementById('date-output').innerText = '無效的時間戳';
    }
}

function convertToTimestamp() {
    const dateInput = document.getElementById('date-input').value;
    const date = new Date(dateInput);
    if (!isNaN(date.getTime())) {
        const timestamp = Math.floor(date.getTime() / 1000);
        document.getElementById('timestamp-output').innerText = timestamp;
    } else {
        document.getElementById('timestamp-output').innerText = '無效的日期';
    }
}

// 時區轉換
function convertTimezone() {
    const dateInput = document.getElementById('timezone-date').value;
    const selectedTimezone = document.getElementById('timezone-select').value;
    if (dateInput) {
        const date = new Date(dateInput);
        const options = { timeZone: selectedTimezone, hour12: false };
        const formattedDate = date.toLocaleString('zh-Hant', options);
        document.getElementById('timezone-output').innerText = formattedDate;
    } else {
        document.getElementById('timezone-output').innerText = '請輸入有效的日期和時間';
    }
}

// 時間格式轉換
function convertToUSFormat() {
    const dateInput = document.getElementById('format-input').value;
    const date = new Date(dateInput);
    if (!isNaN(date.getTime())) {
        const usFormat = date.toLocaleDateString('en-US');
        document.getElementById('format-output').innerText = usFormat;
    } else {
        document.getElementById('format-output').innerText = '無效的日期';
    }
}

// ISO 8601 轉換
function convertISO() {
    const isoInput = document.getElementById('iso-input').value;
    const date = new Date(isoInput);
    if (!isNaN(date.getTime())) {
        document.getElementById('iso-output').innerText = date.toLocaleString();
    } else {
        document.getElementById('iso-output').innerText = '無效的 ISO 日期格式';
    }
}