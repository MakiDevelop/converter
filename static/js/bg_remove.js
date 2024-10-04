document.addEventListener("DOMContentLoaded", function () {
    const imageUpload = document.getElementById('imageUpload');
    const inputImageElement = document.getElementById('inputImage');
    const outputCanvas = document.getElementById('outputCanvas');
    const processButton = document.getElementById('processButton');
    const downloadButton = document.getElementById('downloadButton');
    let uploadedImage = null;

    // 监听图片上传事件
    imageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            inputImageElement.src = e.target.result;
            uploadedImage = new Image();
            uploadedImage.src = e.target.result;
            console.log("图片预览已加载");

            // 缩小图片到更合适的尺寸（例如 800px 宽度），保持纵横比
            uploadedImage.onload = function () {
                const maxWidth = 800;
                const scaleFactor = maxWidth / uploadedImage.width;
                const canvas = document.createElement('canvas');
                canvas.width = maxWidth;
                canvas.height = uploadedImage.height * scaleFactor;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height);

                // 将缩放后的图片转换为 Image 对象，继续进行处理
                const resizedImage = new Image();
                resizedImage.src = canvas.toDataURL();
                uploadedImage = resizedImage;
            };
        };
        reader.readAsDataURL(file);
    });

    // 点击“开始处理”按钮，使用 BodyPix 处理图像
    processButton.addEventListener('click', async () => {
        if (uploadedImage) {
            console.log("开始处理图像");

            // 加载 BodyPix 模型，调整参数提高处理精度
            const net = await bodyPix.load({
                architecture: 'MobileNetV1', // 可以选择 'ResNet50' 提高精度
                outputStride: 16, // 越小越精确，处理时间稍长
                multiplier: 0.75, // 较小的 multiplier 会更快，但可能降低精度
                quantBytes: 2 // 量化字节数，影响模型大小
            });

            // 获取人体分割结果
            const segmentation = await net.segmentPerson(uploadedImage, {
                flipHorizontal: false,
                internalResolution: 'high',
                segmentationThreshold: 0.5 // 分割阈值
            });

            console.log(segmentation);  // 调试 segmentation 结果

            // 渲染结果到 Canvas
            const canvasContext = outputCanvas.getContext('2d');
            outputCanvas.width = uploadedImage.width;
            outputCanvas.height = uploadedImage.height;

            // 绘制原始图像到 Canvas 上
            canvasContext.drawImage(uploadedImage, 0, 0);

            // 获取 Canvas 上的图像数据
            const imageData = canvasContext.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
            const data = imageData.data;

            // 遍历 segmentation.data，去除背景，将背景像素透明化
            for (let i = 0; i < data.length; i += 4) {
                const x = (i / 4) % outputCanvas.width;
                const y = Math.floor(i / 4 / outputCanvas.width);
                const index = y * outputCanvas.width + x;

                // 如果 segmentation.data 为 0，表示背景像素
                if (!segmentation.data[index]) {
                    data[i + 3] = 0; // 将背景像素的 Alpha 通道设为 0，表示透明
                }
            }

            // 将处理后的图像数据放回 Canvas
            canvasContext.putImageData(imageData, 0, 0);

            // 显示下载按钮
            downloadButton.style.display = 'inline-block';

            console.log("图像处理完成");
        } else {
            alert("请先上传图片");
        }
    });

    // 点击下载按钮，将处理后的图像保存为 PNG
    downloadButton.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = outputCanvas.toDataURL('image/png');
        link.download = '去背圖片.png';
        link.click();
    });
});