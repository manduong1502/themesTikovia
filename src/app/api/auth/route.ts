import { NextResponse } from 'next/server';
import {
  ADMIN_COOKIE_NAME,
  checkPassword,
  createExpectedToken,
  isAdminAuthenticated,
} from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  return NextResponse.json({ success: true, authenticated });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const password = (body?.password || '').trim();

    if (!checkPassword(password)) {
      return NextResponse.json(
        { success: false, error: 'Mật khẩu quản trị không chính xác!' },
        { status: 401 }
      );
    }

    const token = createExpectedToken();
    const response = NextResponse.json({
      success: true,
      message: 'Đăng nhập thành công!',
    });

    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax',
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: 'Lỗi xử lý đăng nhập' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(ADMIN_COOKIE_NAME);
  return response;
}
