from fastapi import FastAPI, File, UploadFile, Form
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.requests import Request
from fastapi.responses import (
    FileResponse,
    StreamingResponse,
    HTMLResponse,
    JSONResponse,
)
import chardet
import os
import io
from sqlalchemy.orm import Session
from pydantic import BaseModel
from opencc import OpenCC
from PIL import Image
from pathlib import Path
import markdown
import html2text
import csv
import json
import xmltodict
import re
import difflib
from PyPDF2 import PdfMerger, PdfReader, PdfWriter
import requests

app = FastAPI()

MAX_UPLOAD_SIZE = 50 * 1024 * 1024  # 50MB


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


# 處理根目錄的 robots.txt 文件
@app.get("/robots.txt")
async def robots():
    file_path = os.path.join(
        os.getcwd(), "robots.txt"
    )  # 確認路徑指向專案根目錄的 robots.txt
    return FileResponse(file_path)


# 處理根目錄的 ads.txt 文件
@app.get("/ads.txt")
async def ads():
    file_path = os.path.join(os.getcwd(), "ads.txt")  # 確認路徑指向專案根目錄的 ads.txt
    return FileResponse(file_path)


# 處理根目錄的 favicon.ico 文件
@app.get("/favicon.ico")
async def favicon():
    file_path = os.path.join(
        os.getcwd(), "favicon.ico"
    )  # 確認路徑指向專案根目錄的 favicon.ico
    return FileResponse(file_path)


# 管理頁面路由
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


@app.get("/urlende", response_class=HTMLResponse)
async def htmlende(request: Request):
    return templates.TemplateResponse("url_encode_decode.html", {"request": request})


@app.get("/imgformat", response_class=HTMLResponse)
async def img_format(request: Request):
    return templates.TemplateResponse("image_format_convert.html", {"request": request})


@app.get("/cssformat", response_class=HTMLResponse)
async def css_format(request: Request):
    return templates.TemplateResponse("cssformat.html", {"request": request})


@app.get("/jsformat", response_class=HTMLResponse)
async def js_format(request: Request):
    return templates.TemplateResponse("jsformat.html", {"request": request})


@app.get("/md2html", response_class=HTMLResponse)
async def md2html(request: Request):
    return templates.TemplateResponse("md2html.html", {"request": request})


@app.get("/csv2json", response_class=HTMLResponse)
async def csv2json(request: Request):
    return templates.TemplateResponse("csv2json.html", {"request": request})


@app.get("/xml2json", response_class=HTMLResponse)
async def xml2json(request: Request):
    return templates.TemplateResponse("xml2json.html", {"request": request})


@app.get("/regexf2e", response_class=HTMLResponse)
async def regex_f2e(request: Request):
    return templates.TemplateResponse("regexf2e.html", {"request": request})


@app.get("/comparetexts", response_class=HTMLResponse)
async def comparetexts(request: Request):
    return templates.TemplateResponse("compare_texts.html", {"request": request})


@app.get("/convertimage", response_class=HTMLResponse)
async def convertimage(request: Request):
    return templates.TemplateResponse("convert_image.html", {"request": request})


@app.get("/formatjson", response_class=HTMLResponse)
async def formatjson(request: Request):
    return templates.TemplateResponse("formatjson.html", {"request": request})


@app.get("/pdfmergesplit", response_class=HTMLResponse)
async def pdfmergesplit(request: Request):
    return templates.TemplateResponse("pdfmergesplit.html", {"request": request})


@app.get("/nerdextract", response_class=HTMLResponse)
async def nerdextract(request: Request):
    return templates.TemplateResponse("nerd_extract.html", {"request": request})

@app.get("/screeninfo", response_class=HTMLResponse)
async def screeninfo(request: Request):
    return templates.TemplateResponse("screen.html", {"request": request})

@app.post("/api/extract_keywords")
async def extract_keywords(request: Request):
    data = await request.json()
    text = data.get("text")
    
    # 调用关键词提取 API 并传递 content 和 site_list
    api_response = requests.post(
        "https://nerdpoc.pixnet.cc/fastapi/api/extract_tags_by_list",
        json={
            "content": [text],
            "site_list": ["pixnet", "pixnet_extract", "mombaby", "mombaby_extract", "techbang", "techbang_extract"]
        }
    )
    
    # 解析 API 响应数据
    response_data = api_response.json().get("data", [])
    keywords = []

    # 提取关键词
    if response_data:
        keywords = list(response_data[0].keys())  # 获取关键词的key列表

    # 打印返回的数据以供调试
    print({"keywords": keywords})

    return {"keywords": keywords}


# 建立保存生成 PDF 文件的目錄
os.makedirs("processed_pdfs", exist_ok=True)

# 建立保存生成 PDF 文件的目錄
os.makedirs("processed_pdfs", exist_ok=True)


# PDF 合並
@app.post("/merge_pdfs")
async def merge_pdfs(files: list[UploadFile] = File(...)):
    merger = PdfMerger()
    try:
        # 將每個上傳的 PDF 文件合併
        for file in files:
            merger.append(file.file)

        output_filename = "processed_pdfs/merged.pdf"
        with open(output_filename, "wb") as f_out:
            merger.write(f_out)

        # 回傳合併後的 PDF 文件
        return FileResponse(output_filename, media_type="application/pdf")
    except Exception as e:
        return {"error": f"PDF merge failed: {str(e)}"}


# PDF 分割
@app.post("/split_pdf")
async def split_pdf(
    file: UploadFile = File(...), start_page: int = Form(...), end_page: int = Form(...)
):
    try:
        # 讀取上傳的 PDF 文件
        pdf_reader = PdfReader(file.file)
        pdf_writer = PdfWriter()

        # 驗證頁碼範圍
        total_pages = len(pdf_reader.pages)
        if start_page < 1 or end_page > total_pages or start_page > end_page:
            return {"error": "Invalid page range."}

        # 分割指定範圍的页面
        for page_num in range(start_page - 1, end_page):
            pdf_writer.add_page(pdf_reader.pages[page_num])

        output_filename = "processed_pdfs/split.pdf"
        with open(output_filename, "wb") as f_out:
            pdf_writer.write(f_out)

        # 回傳分割後的 PDF 文件
        return FileResponse(output_filename, media_type="application/pdf")
    except Exception as e:
        return {"error": f"PDF split failed: {str(e)}"}


# JSON 結構格式化/美化工具
@app.post("/format_json")
async def format_json(content: str = Form(...), action: str = Form(...)):
    try:
        # 解析 JSON 數據
        json_data = json.loads(content)

        # 如果用戶選擇格式化（美化），使用 indent 參數
        if action == "pretty":
            formatted_json = json.dumps(json_data, indent=4, ensure_ascii=False)
        # 如果用戶選擇壓縮，去掉所有縮排
        elif action == "compact":
            formatted_json = json.dumps(
                json_data, separators=(",", ":"), ensure_ascii=False
            )
        else:
            return {"error": "Invalid action. Choose 'pretty' or 'compact'."}

        return JSONResponse(content={"formatted_json": formatted_json})
    except json.JSONDecodeError as e:
        return {"error": f"Invalid JSON format: {str(e)}"}


# 建立保存轉換後圖片的目录
os.makedirs("converted_images", exist_ok=True)


# 圖片格式轉換
@app.post("/convert_image")
async def convert_image(file: UploadFile = File(...), target_format: str = Form(...)):
    try:
        # 開啟上傳的圖片
        image = Image.open(file.file)

        # 如果目标格式是 WebP，處理透明度问题並强制轉換为标准模式
        if target_format.lower() == "webp":
            if features.check("webp"):
                # 强制轉換为 RGBA 或 RGB 模式以避免兼容性问题
                if image.mode in ("RGBA", "LA", "P"):
                    image = image.convert("RGBA")
                output_filename = "converted_images/converted_image.webp"
                image.save(output_filename, format="WEBP", lossless=True)
            else:
                return {
                    "error": "WebP format is not supported by the current environment."
                }

        # 如果目标格式是 BMP，不支持透明度，将其轉換为 RGB 模式
        elif target_format.lower() == "bmp":
            if image.mode in ("RGBA", "LA", "P"):
                image = image.convert("RGB")
            output_filename = "converted_images/converted_image.bmp"
            image.save(output_filename, format="BMP")

        # 處理 JPEG、PNG、GIF 格式
        else:
            target_format = target_format.lower()
            if target_format not in ["jpeg", "png", "gif"]:
                return {
                    "error": "Unsupported format. Please use JPEG, PNG, GIF, WebP, or BMP."
                }
            output_filename = f"converted_images/converted_image.{target_format}"
            image.save(output_filename, format=target_format.upper())

        # 回傳轉換後的圖片文件
        return FileResponse(output_filename, media_type=f"image/{target_format}")

    except Exception as e:
        # 捕获异常並輸出详细的错误信息
        error_message = f"Image conversion failed: {str(e)}\n{traceback.format_exc()}"
        return {"error": error_message}


# 文本对比
@app.post("/compare_texts")
async def compare_texts(text1: str = Form(...), text2: str = Form(...)):
    try:
        # 使用 difflib 比较文本
        diff = difflib.ndiff(text1.splitlines(), text2.splitlines())
        diff_output = []
        for line in diff:
            if line.startswith("-"):
                # 红色表示被删除的行
                diff_output.append(f'<span style="color: red;">{line}</span>')
            elif line.startswith("+"):
                # 绿色表示被添加的行
                diff_output.append(f'<span style="color: green;">{line}</span>')
            else:
                # 原样显示相同的行
                diff_output.append(line)
        # 使用 HTML 格式回傳
        return JSONResponse(content={"diff": "\n".join(diff_output)})
    except Exception as e:
        return JSONResponse(content={"error": f"An error occurred: {str(e)}"})


# 正则表达式匹配测试
@app.post("/regex")
async def regex(pattern: str = Form(...), text: str = Form(...)):
    try:
        # 编译正则表达式
        regex = re.compile(pattern)
        # 查找所有匹配
        matches = regex.findall(text)
        if matches:
            return JSONResponse(content={"matches": matches})
        else:
            return JSONResponse(content={"matches": [], "message": "No matches found"})
    except re.error as e:
        return JSONResponse(content={"error": f"Invalid regular expression: {str(e)}"})


# XML 轉 JSON
@app.post("/xml2json")
async def xml_to_json(content: str = Form(...)):
    try:
        # 直接回傳字典，FastAPI 会自动處理 JSON 格式
        return xmltodict.parse(content)
    except Exception as e:
        return {"error": f"Invalid XML format: {str(e)}"}


# JSON 轉 XML
@app.post("/json2xml")
async def json_to_xml(content: str = Form(...)):
    try:
        # 将 JSON 轉換为字典格式
        json_data = json.loads(content)
        # 将字典轉換为 XML 字符串
        xml_output = xmltodict.unparse(json_data, pretty=True)
        return HTMLResponse(content=xml_output, media_type="application/xml")
    except Exception as e:
        return {"error": f"Invalid JSON format: {str(e)}"}


# Markdown 轉 HTML
@app.post("/md2html", response_class=HTMLResponse)
async def markdown_to_html(content: str = Form(...)):
    html_content = markdown.markdown(content)
    return f"<div>{html_content}</div>"


# HTML 轉 Markdown
@app.post("/html2md", response_class=HTMLResponse)
async def html_to_markdown(content: str = Form(...)):
    text_maker = html2text.HTML2Text()
    text_maker.ignore_links = True
    markdown_content = text_maker.handle(content)
    return f"<pre>{markdown_content}</pre>"


# CSV 轉 JSON
@app.post("/csv2json")
async def csv_to_json(file: UploadFile = File(...)):
    content = await file.read()
    # 解析 CSV 文件
    csv_data = content.decode("utf-8").splitlines()
    reader = csv.DictReader(csv_data)
    json_output = [row for row in reader]
    return JSONResponse(content=json_output)


# JSON 轉 CSV
@app.post("/json2csv")
async def json_to_csv(content: str = Form(...)):
    json_data = json.loads(content)

    # 取出 CSV 的字段名
    if isinstance(json_data, list) and len(json_data) > 0:
        keys = json_data[0].keys()
    else:
        return {"error": "Invalid JSON format"}

    # 建立 CSV
    output = []
    output.append(",".join(keys))  # CSV 欄位名稱

    for entry in json_data:
        row = [str(entry[key]) for key in keys]
        output.append(",".join(row))

    csv_content = "\n".join(output)
    return HTMLResponse(content=csv_content, media_type="text/plain")


# 處理繁簡轉換的 POST 請求
@app.post("/convert_zh")
async def convert_zh(request: ConversionRequest):
    if request.type == "s2t":
        converter = OpenCC("s2t")  # 简体轉繁體
    else:
        converter = OpenCC("t2s")  # 繁體轉简体

    converted_text = converter.convert(request.text)
    return {"converted_text": converted_text}


# 上傳文件並轉換編碼的路由
@app.post("/upload_and_convert/")
async def upload_and_convert(
    file: UploadFile = File(...), target_encoding: str = Form("utf-8")
):
    # 讀取上傳的文件內容
    file_content = await file.read()

    # 使用 chardet 檢測文件的編碼
    detected_encoding_info = chardet.detect(file_content)
    detected_encoding = detected_encoding_info.get("encoding", None)

    # 如果檢測到的編碼是 MacRoman 或無法檢測，強制使用 Shift JIS
    if detected_encoding == "MacRoman" or detected_encoding is None:
        detected_encoding = "shift_jis"

    try:
        # 使用檢測到的或指定的編碼解碼文件內容
        decoded_content = file_content.decode(detected_encoding)

        # 使用目標編碼重新編碼文件內容
        converted_content = decoded_content.encode(target_encoding)

        # 回傳轉換後的內容進行預覽
        utf8_preview = converted_content.decode(target_encoding)

        # 保存文件以便下載
        output_filename = f"converted_{file.filename}"
        with open(output_filename, "wb") as f:
            f.write(converted_content)

        # 回傳檔名和預覽內容到前端
        return JSONResponse(
            {
                "original_encoding": detected_encoding,
                "preview_content": utf8_preview[:1000],  # 只顯示前 1000 字元的預覽
                "converted_file": output_filename,
            }
        )
    except UnicodeDecodeError as decode_error:
        return JSONResponse(
            {
                "error": f"无法解码文件，使用编码 {detected_encoding}, 错误信息: {str(decode_error)}"
            },
            status_code=500,
        )
    except UnicodeEncodeError as encode_error:
        return JSONResponse(
            {
                "error": f"无法将文件轉換为 {target_encoding}, 错误信息: {str(encode_error)}"
            },
            status_code=500,
        )


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
            media_type="application/octet-stream",  # 保持通用的二進制串流類型
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )
    return JSONResponse(content={"error": "File not found"}, status_code=404)


# 圖片上傳並轉換爲Base64
@app.post("/image-to-base64/")
async def image_to_base64(file: UploadFile = File(...)):
    try:
        # 讀取圖片文件
        image_bytes = await file.read()

        # 將圖片編碼爲Base64
        encoded_string = base64.b64encode(image_bytes).decode("utf-8")

        return JSONResponse({"base64": encoded_string})
    except Exception as e:
        return JSONResponse({"error": f"文件轉換失败: {str(e)}"}, status_code=500)


# Base64 轉換爲圖片
@app.post("/base64-to-image/")
async def base64_to_image(base64_string: str = Form(...)):
    try:
        # 將Base64字串解碼爲圖片數據
        image_data = base64.b64decode(base64_string)

        # 保存圖片
        output_filename = "converted_image.png"
        with open(output_filename, "wb") as f:
            f.write(image_data)

        return JSONResponse({"converted_file": output_filename})
    except Exception as e:
        return JSONResponse({"error": f"Base64 轉圖片失败: {str(e)}"}, status_code=500)


@app.get("/", response_class=HTMLResponse)
async def get_image_converter():
    html_path = Path("templates/converter.html")  # 你的HTML文件路徑
    return HTMLResponse(content=html_path.read_text(), status_code=200)


# 圖片格式轉換
@app.post("/imageformatconvert/")
async def convert_image(
    file: UploadFile = File(...),
    format: str = Form(...),
    quality: int = Form(80),
    lossless: bool = Form(False),
):
    # 檢查文件大小
    file_content = await file.read()
    if len(file_content) > MAX_UPLOAD_SIZE:
        raise HTTPException(
            status_code=413, detail="File size exceeds the limit of 50MB"
        )

    # 保存臨時上傳的文件
    temp_file_path = Path(f"temp_{file.filename}")
    with open(temp_file_path, "wb") as buffer:
        buffer.write(file_content)  # 寫入文件内容

    # 呼叫圖片轉換函數
    output_path = convert_image_to_format(
        str(temp_file_path), format, quality, lossless
    )

    # 讀取轉換後的文件内容
    with open(output_path, "rb") as output_file:
        converted_image = output_file.read()

    # 删除臨時文件
    temp_file_path.unlink()
    Path(output_path).unlink()

    # 回傳圖片的二進制串流
    return StreamingResponse(io.BytesIO(converted_image), media_type=f"image/{format}")


# function定義區
# 檢測文件編碼的函數
def detect_encoding(file):
    rawdata = file.read(1024)  # 讀取文件的前1024字元
    result = chardet.detect(rawdata)
    file.seek(0)  # 重置文件指針，確保文件可以重新讀取
    return result["encoding"]


# 轉換文件編碼的函數
def convert_encoding(file, target_encoding="utf-8"):
    source_encoding = detect_encoding(file)
    if source_encoding != target_encoding:
        # 將文件內容轉換爲目標編碼
        file_content = file.read().decode(source_encoding)
        converted_content = file_content.encode(target_encoding)
        return converted_content, source_encoding
    else:
        return file.read(), source_encoding


# 轉換圖片
def convert_image_to_format(
    input_path: str, output_format: str, quality: int = 80, lossless: bool = False
) -> str:
    valid_formats = ["webp"]
    if output_format not in valid_formats:
        raise ValueError(
            f"Unsupported format: {output_format}. Please choose from {valid_formats}."
        )

    # 開啟圖片
    img = Image.open(input_path)

    # 生成輸出文件路徑
    output_path = os.path.splitext(input_path)[0] + f".{output_format}"

    # 轉換並保存圖片
    img.save(
        output_path, format=output_format.upper(), quality=quality, lossless=lossless
    )

    return output_path
