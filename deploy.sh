#!/usr/bin/env bash

# Dừng lại ngay lập tức nếu gặp bất kỳ lỗi nào
set -e

echo "======================================================"
echo "🚀 BẮT ĐẦU TRIỂN KHAI / CẬP NHẬT THEME TIKOVIA"
echo "======================================================"

# 1. Kiểm tra quyền root / sudo
if [ "$EUID" -ne 0 ]; then
  echo "⚠️ Script cần quyền root hoặc sudo. Đang chuyển sang sudo..."
  exec sudo bash "$0" "$@"
fi

# 2. Chuyển vào thư mục dự án (nơi chứa file deploy.sh)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
echo "📂 Thư mục làm việc: $SCRIPT_DIR"

# 3. Kéo code mới nhất từ GitHub
echo "📥 Đang kéo code mới từ Git..."
git fetch --all
git reset --hard origin/main || git pull origin main

# 4. Đảm bảo các thư mục lưu dữ liệu tồn tại và có quyền ghi
echo "🔒 Phân quyền thư mục lưu trữ (uploads & data)..."
mkdir -p public/uploads src/data
chmod -R 777 public/uploads src/data

# 5. Build và khởi động lại container bằng Docker Compose
echo "🐳 Đang build và chạy Docker container..."
if docker compose version >/dev/null 2>&1; then
  docker compose down || true
  docker compose up -d --build
elif which docker-compose >/dev/null 2>&1; then
  docker-compose down || true
  docker-compose up -d --build
else
  echo "❌ Lỗi: Máy chủ chưa cài Docker Compose!"
  exit 1
fi

# 6. Kiểm tra trạng thái container
echo "======================================================"
echo "📊 TRẠNG THÁI CONTAINER HIỆN TẠI:"
docker ps --filter "name=tikovia-theme-showcase"

echo "======================================================"
echo "✅ HOÀN TẤT TRIỂN KHAI THÀNH CÔNG!"
echo "👉 Web đang chạy nội bộ tại: http://192.168.1.200:4028 (hoặc http://localhost:4028)"
echo "👉 Hãy trỏ Cloudflare Tunnel 'themes.tikovia.vn' về: HTTP://192.168.1.200:4028"
echo "======================================================"
