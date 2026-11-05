import { NextResponse } from 'next/server';
import { getSiteContent, saveSiteContent, SiteContent } from '@/lib/content';
import { isAdminAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getSiteContent();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Không thể đọc nội dung file JSON' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json(
        { success: false, error: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!' },
        { status: 401 }
      );
    }

    const body: SiteContent = await request.json();
    if (!body || !body.themes || !body.hero) {
      return NextResponse.json(
        { success: false, error: 'Dữ liệu không hợp lệ' },
        { status: 400 }
      );
    }

    const success = await saveSiteContent(body);
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Không thể lưu file JSON' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Đã lưu nội dung thành công!' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Lỗi trong quá trình xử lý yêu cầu' },
      { status: 500 }
    );
  }
}
