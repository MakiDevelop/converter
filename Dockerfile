# 使用 python:3.9-alpine 作為基礎映像
FROM python:3.9-alpine

# 設定工作目錄
WORKDIR /app

# 複製 requirements.txt 並安裝依賴
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 複製應用程式
COPY . .

RUN pip install --upgrade pip 
# 安装 Python 依赖
RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

# 暴露端口 8000
EXPOSE 8000

# 啟動 FastAPI 伺服器
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload", "--log-level", "error"]