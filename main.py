from fastapi import FastAPI, File, UploadFile, Form, Depends
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.requests import Request
from fastapi.responses import FileResponse, StreamingResponse, RedirectResponse, HTMLResponse, JSONResponse
import chardet
import codecs
import os
from sqlalchemy.orm import Session
from pydantic import BaseModel
from opencc import OpenCC

app = FastAPI()

class ConversionRequest(BaseModel):
    text: str
    type: str  # 's2t' (簡體轉繁體) or 't2s' (繁體轉簡體



# 設定模板目錄
templates = Jinja2Templates(directory="templates")

# 掛載靜態文件路徑
app.mount("/static", StaticFiles(directory="static"), name="static")

# 根路由渲染 index.html
@app.get("/")
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# 示例管理页面路由
@app.get("/admin")
async def admin_page(request: Request):
    return templates.TemplateResponse("admin.html", {"request": request})

@app.get("/ndjson2json")
async def ndjson_to_json(request: Request):
    return templates.TemplateResponse("ndjson2json.html", {"request": request})

@app.get("/json2ndjson")
async def json_to_ndjson(request: Request):
    return templates.TemplateResponse("json2ndjson.html", {"request": request})

@app.get("/dupremove")
async def duplicate_remove(request: Request):
    return templates.TemplateResponse("duplicate_remove.html", {"request": request})


@app.get("/encodeconverter", response_class=HTMLResponse)
async def show_encode_converter(request: Request):
    return templates.TemplateResponse("encode_convert.html", {"request": request})

@app.get("/imagebase64", response_class=HTMLResponse)
async def image_base64_converter(request: Request):
    return templates.TemplateResponse("imagebase64.html", {"request": request})

@app.get("/zhconverter", response_class=HTMLResponse)
async def get_zhconverter(request: Request):
    return templates.TemplateResponse("zhconverter.html", {"request": request})

@app.get("/bgremove", response_class=HTMLResponse)
async def background_remove(request: Request):
    return templates.TemplateResponse("background_remove.html", {"request": request})

@app.get("/hashconvert", response_class=HTMLResponse)
async def hash_convert(request: Request):
    return templates.TemplateResponse("hash_converter.html", {"request": request})

@app.get("/timeconvert", response_class=HTMLResponse)
async def time_convert(request: Request):
    return templates.TemplateResponse("time_convert.html", {"request": request})

@app.get("/qrcodegen", response_class=HTMLResponse)
async def qrcode_generate(request: Request):
    return templates.TemplateResponse("qrcode_generate.html", {"request": request})

@app.get("/stringtool", response_class=HTMLResponse)
async def string_tool(request: Request):
    return templates.TemplateResponse("string_convert.html", {"request": request})

@app.get("/colorcode", response_class=HTMLResponse)
async def color_code_tool(request: Request):
    return templates.TemplateResponse("color_code.html", {"request": request})

@app.get("/imgcompress", response_class=HTMLResponse)
async def img_compress(request: Request):
    return templates.TemplateResponse("image_compression.html", {"request": request})

@app.get("/passwdgen", response_class=HTMLResponse)
async def passwd_generate(request: Request):
    return templates.TemplateResponse("password_generate.html", {"request": request})

@app.get("/screenshot", response_class=HTMLResponse)
async def screenshot(request: Request):
    return templates.TemplateResponse("screen_shot.html", {"request": request})

@app.get("/htmlende", response_class=HTMLResponse)
async def htmlende(request: Request):
    return templates.TemplateResponse("html_encode_decode.html", {"request": request})

# 處理繁簡轉換的 POST 請求
@app.post("/convert_zh")
async def convert_zh(request: ConversionRequest):
    if request.type == 's2t':
        converter = OpenCC('s2t')  # 简体轉繁體
    else:
        converter = OpenCC('t2s')  # 繁體轉简体

    converted_text = converter.convert(request.text)
    return {"converted_text": converted_text}


# 上傳文件並轉換編碼的路由
@app.post("/upload_and_convert/")
async def upload_and_convert(file: UploadFile = File(...), target_encoding: str = Form('utf-8')):
    # 讀取上傳的文件內容
    file_content = await file.read()

    # 使用 chardet 檢測文件的編碼
    detected_encoding_info = chardet.detect(file_content)
    detected_encoding = detected_encoding_info.get('encoding', None)

    # 如果檢測到的編碼是 MacRoman 或無法檢測，強制使用 Shift JIS
    if detected_encoding == 'MacRoman' or detected_encoding is None:
        detected_encoding = 'shift_jis'
    
    try:
        # 使用檢測到的或指定的編碼解碼文件內容
        decoded_content = file_content.decode(detected_encoding)

        # 使用目標編碼重新編碼文件內容
        converted_content = decoded_content.encode(target_encoding)

        # 返回轉換後的內容進行預覽
        utf8_preview = converted_content.decode(target_encoding)

        # 保存文件以便下載
        output_filename = f"converted_{file.filename}"
        with open(output_filename, 'wb') as f:
            f.write(converted_content)

        # 回傳檔名和預覽內容到前端
        return JSONResponse({
            "original_encoding": detected_encoding,
            "preview_content": utf8_preview[:1000],  # 只顯示前 1000 字元的預覽
            "converted_file": output_filename
        })
    except UnicodeDecodeError as decode_error:
        return JSONResponse({
            "error": f"无法解码文件，使用编码 {detected_encoding}, 错误信息: {str(decode_error)}"
        }, status_code=500)
    except UnicodeEncodeError as encode_error:
        return JSONResponse({
            "error": f"无法将文件转换为 {target_encoding}, 错误信息: {str(encode_error)}"
        }, status_code=500)

# @app.get("/download/{filename}")
# async def download_file(filename: str):
#     file_path = os.path.join(os.getcwd(), filename)
#     if os.path.exists(file_path):
#         headers = {"Content-Disposition": f"attachment; filename={filename}"}
#         return FileResponse(path=file_path, filename=filename, media_type='application/octet-stream', headers=headers)
#     return JSONResponse(content={"error": "File not found"}, status_code=404)

# 提供下載文件的路由
@app.get("/download/{filename}")
async def download_file(filename: str):
    file_path = os.path.join(os.getcwd(), filename)
    if os.path.exists(file_path):
        return FileResponse(
            path=file_path, 
            filename=filename, 
            media_type='application/octet-stream',  # 保持通用的二進制串流類型
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    return JSONResponse(content={"error": "File not found"}, status_code=404)

# 圖片上傳並轉換爲Base64
@app.post("/image-to-base64/")
async def image_to_base64(file: UploadFile = File(...)):
    try:
        # 讀取圖片文件
        image_bytes = await file.read()

        # 將圖片編碼爲Base64
        encoded_string = base64.b64encode(image_bytes).decode('utf-8')

        return JSONResponse({"base64": encoded_string})
    except Exception as e:
        return JSONResponse({"error": f"文件转换失败: {str(e)}"}, status_code=500)

# Base64 轉換爲圖片
@app.post("/base64-to-image/")
async def base64_to_image(base64_string: str = Form(...)):
    try:
        # 將Base64字串解碼爲圖片數據
        image_data = base64.b64decode(base64_string)

        # 保存圖片
        output_filename = "converted_image.png"
        with open(output_filename, 'wb') as f:
            f.write(image_data)

        return JSONResponse({"converted_file": output_filename})
    except Exception as e:
        return JSONResponse({"error": f"Base64 转图片失败: {str(e)}"}, status_code=500)



# function定義區
# 檢測文件編碼的函數
def detect_encoding(file):
    rawdata = file.read(1024)  # 讀取文件的前1024字元
    result = chardet.detect(rawdata)
    file.seek(0)  # 重置文件指針，確保文件可以重新讀取
    return result['encoding']

# 轉換文件編碼的函數
def convert_encoding(file, target_encoding='utf-8'):
    source_encoding = detect_encoding(file)
    if source_encoding != target_encoding:
        # 將文件內容轉換爲目標編碼
        file_content = file.read().decode(source_encoding)
        converted_content = file_content.encode(target_encoding)
        return converted_content, source_encoding
    else:
        return file.read(), source_encoding