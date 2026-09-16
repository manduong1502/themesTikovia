import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

const MIME_MAP: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.pdf': 'application/pdf',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const pathSegments = resolvedParams.path || [];

    if (pathSegments.length === 0) {
      return new NextResponse('Not Found', { status: 404 });
    }

    // Decode URL components to handle special characters or spaces
    const safeSegments = pathSegments.map((segment) =>
      decodeURIComponent(segment).replace(/(\.\.[\/\\])+/g, '')
    );

    const relativePath = path.join(...safeSegments);
    const filePath = path.join(process.cwd(), 'public', 'uploads', relativePath);

    const fileBuffer = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_MAP[ext] || 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: any) {
    if (error?.code === 'ENOENT') {
      return new NextResponse('File Not Found', { status: 404 });
    }
    console.error('Lỗi khi đọc file upload:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
