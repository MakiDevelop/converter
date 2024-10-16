$(document).ready(function() {
    console.log("文档已加载");

    $('#convert-btn').on('click', function () {
        console.log("開始轉換按鈕已被點擊");
        
        var fileInput = $('#image-upload')[0];
        var format = $('#format').val();
        var quality = $('#quality').val();
        var lossless = $('#lossless').is(':checked');

        console.log('選擇的圖片:', fileInput.files[0]);
        console.log('選擇的格式:', format);
        console.log('選擇的質量:', quality);
        console.log('無損壓縮:', lossless);

        if (fileInput.files.length === 0) {
            alert('請選擇一張圖片');
            return;
        }

        var formData = new FormData();
        formData.append('file', fileInput.files[0]);
        formData.append('format', format);
        formData.append('quality', quality);
        formData.append('lossless', lossless);

        $.ajax({
            url: '/imageformatconvert/',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            xhrFields: {
                responseType: 'blob'
            },
            success: function (response) {
                var blob = new Blob([response], { type: 'image/' + format });
                var url = window.URL.createObjectURL(blob);

                // 顯示預覽
                $('#preview-image').attr('src', url);

                // 設置下載鏈接
                $('#download-btn').attr('href', url);
                $('#download-btn').attr('download', 'converted_image.' + format);
            },
            error: function () {
                alert('圖片轉換失敗，請重試');
            }
        });
    });
});