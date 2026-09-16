import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy tệp ảnh tải lên' },
        { status: 400 }
      );
    }

    // Check mime type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'image/avif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Định dạng tệp không hợp lệ. Vui lòng chọn ảnh JPG, PNG, WEBP, SVG hoặc GIF.' },
        { status: 400 }
      );
    }

    // Ensure uploads directory exists
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    // Sanitize filename
    const originalName = file.name || 'image.png';
    const ext = path.extname(originalName) || '.png';
    const baseName = path
      .basename(originalName, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${baseName}${ext}`;
    const targetFilePath = path.join(UPLOAD_DIR, uniqueFileName);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await fs.writeFile(targetFilePath, buffer);

    const publicUrl = `/uploads/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: uniqueFileName,
      size: file.size,
    });
  } catch (error) {
    console.error('Lỗi khi tải ảnh:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể lưu tệp ảnh lên máy chủ' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const dirEntries = await fs.readdir(UPLOAD_DIR, { withFileTypes: true });

    const files = await Promise.all(
      dirEntries
        .filter((entry) => entry.isFile() && !entry.name.startsWith('.'))
        .map(async (entry) => {
          const filePath = path.join(UPLOAD_DIR, entry.name);
          const stats = await fs.stat(filePath);
          return {
            name: entry.name,
            url: `/uploads/${entry.name}`,
            size: stats.size,
            updatedAt: stats.mtime.toISOString(),
          };
        })
    );

    // Sort newest first
    files.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    return NextResponse.json({ success: true, files });
  } catch (error) {
    console.error('Lỗi khi đọc thư mục uploads:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể đọc danh sách tệp tải lên' },
      { status: 500 }
    );
  }
}
