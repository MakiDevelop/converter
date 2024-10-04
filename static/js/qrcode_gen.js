let qrCode;

function handleTypeChange() {
    const inputType = document.getElementById('input-type').value;
    const inputFields = document.getElementById('input-fields');
    inputFields.innerHTML = ''; // 清除之前的輸入框

    switch (inputType) {
        case 'text':
            inputFields.innerHTML = '<label>輸入純文字:</label><textarea id="input-value" rows="4" cols="50"></textarea>';
            break;
        case 'url':
            inputFields.innerHTML = '<label>輸入 URL:</label><input id="input-value" type="text" style="width: 80%;" placeholder="https://example.com">';
            break;
        case 'phone':
            inputFields.innerHTML = '<label>輸入電話號碼:</label><input id="input-value" type="tel" style="width: 80%;" placeholder="+123456789">';
            break;
        case 'email':
            inputFields.innerHTML = '<label>輸入電子郵件:</label><input id="input-value" type="email" style="width: 80%;" placeholder="example@example.com">';
            break;
        case 'wifi':
            inputFields.innerHTML = `
<label>Wi-Fi 名稱 (SSID):</label><input id="wifi-ssid" type="text">
<label>Wi-Fi 密碼:</label><input id="wifi-password" type="password">
<label>加密類型:</label>
<select id="wifi-encryption">
<option value="WPA">WPA/WPA2</option>
<option value="WEP">WEP</option>
<option value="nopass">無密碼</option>
</select>`;
            break;
        case 'geo':
            inputFields.innerHTML = `
<label>緯度:</label><input id="geo-latitude" type="text" placeholder="37.7749">
<label>經度:</label><input id="geo-longitude" type="text" placeholder="-122.4194">`;
            break;
        case 'event':
            inputFields.innerHTML = `
<label>事件標題:</label><input id="event-title" type="text">
<label>事件位置:</label><input id="event-location" type="text">
<label>開始時間:</label><input id="event-start" type="datetime-local">
<label>結束時間:</label><input id="event-end" type="datetime-local">`;
            break;
        case 'vcard':
            inputFields.innerHTML = `
<label>姓名:</label><input id="vcard-name" type="text">
<label>電話:</label><input id="vcard-phone" type="tel">
<label>電子郵件:</label><input id="vcard-email" type="email">
<label>公司:</label><input id="vcard-company" type="text">`;
            break;
        case 'sms':
            inputFields.innerHTML = '<label>輸入簡訊號碼:</label><input id="input-value" type="tel" placeholder="+123456789"><label>輸入簡訊內容:</label><textarea id="sms-body" rows="4" cols="50"></textarea>';
            break;
    }
}

function generateQRCode() {
    const inputType = document.getElementById('input-type').value;
    let qrData = '';

    switch (inputType) {
        case 'text':
        case 'url':
        case 'phone':
        case 'email':
            qrData = document.getElementById('input-value').value;
            break;
        case 'wifi':
            const ssid = document.getElementById('wifi-ssid').value;
            const password = document.getElementById('wifi-password').value;
            const encryption = document.getElementById('wifi-encryption').value;
            qrData = `WIFI:S:${ssid};T:${encryption};P:${password};;`;
            break;
        case 'geo':
            const latitude = document.getElementById('geo-latitude').value;
            const longitude = document.getElementById('geo-longitude').value;
            qrData = `geo:${latitude},${longitude}`;
            break;
        case 'event':
            const title = document.getElementById('event-title').value;
            const location = document.getElementById('event-location').value;
            const start = document.getElementById('event-start').value.replace(/-/g, '').replace(/:/g, '');
            const end = document.getElementById('event-end').value.replace(/-/g, '').replace(/:/g, '');
            qrData = `BEGIN:VEVENT\nSUMMARY:${title}\nLOCATION:${location}\nDTSTART:${start}\nDTEND:${end}\nEND:VEVENT`;
            break;
        case 'vcard':
            const name = document.getElementById('vcard-name').value;
            const phone = document.getElementById('vcard-phone').value;
            const email = document.getElementById('vcard-email').value;
            const company = document.getElementById('vcard-company').value;
            qrData = `BEGIN:VCARD\nVERSION:3.0\nN:${name}\nTEL:${phone}\nEMAIL:${email}\nORG:${company}\nEND:VCARD`;
            break;
        case 'sms':
            const smsNumber = document.getElementById('input-value').value;
            const smsBody = document.getElementById('sms-body').value;
            qrData = `sms:${smsNumber}?body=${smsBody}`;
            break;
    }

    if (qrCode) {
        qrCode.clear();
    }

    qrCode = new QRCode(document.getElementById("qrcode"), {
        text: qrData,
        width: 256,
        height: 256
    });

    document.getElementById('download-section').style.display = 'block';
}

function downloadQRCode() {
    const downloadType = document.getElementById('download-type').value;
    const canvas = document.querySelector('#qrcode canvas');

    if (downloadType === 'png' || downloadType === 'jpeg' || downloadType === 'bmp') {
        const dataURL = canvas.toDataURL(`image/${downloadType}`);
        const a = document.createElement('a');
        a.href = dataURL;
        a.download = `qrcode.${downloadType}`;
        a.click();
    } else if (downloadType === 'svg') {
        alert("SVG 下載暫時不支援，請選擇其他格式。");
    }
}