import { NextResponse } from 'next/server';
import { getLeads, saveLeads, LeadItem } from '@/lib/leads';
import { isAdminAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json(
      { success: false, error: 'Chưa đăng nhập quản trị' },
      { status: 401 }
    );
  }

  const leads = await getLeads();
  return NextResponse.json({ success: true, leads });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = (body?.name || '').trim();
    const phone = (body?.phone || '').trim();
    const email = (body?.email || '').trim();
    const themeInterest = (body?.themeInterest || '').trim();
    const message = (body?.message || '').trim();

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng nhập Họ tên và Số điện thoại / Zalo' },
        { status: 400 }
      );
    }

    const leads = await getLeads();
    const newLead: LeadItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name,
      phone,
      email: email || undefined,
      themeInterest: themeInterest || undefined,
      message: message || 'Yêu cầu tư vấn thiết kế website',
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    const updated = [newLead, ...leads];
    await saveLeads(updated);

    return NextResponse.json({
      success: true,
      message: 'Đã gửi yêu cầu tư vấn thành công!',
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Không thể lưu thông tin liên hệ' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json(
      { success: false, error: 'Chưa đăng nhập quản trị' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { id, status } = body;
    const leads = await getLeads();
    const updated = leads.map((item) =>
      item.id === id ? { ...item, status: status === 'contacted' ? 'contacted' : 'new' } : item
    ) as LeadItem[];
    await saveLeads(updated);
    return NextResponse.json({ success: true, leads: updated });
  } catch {
    return NextResponse.json({ success: false, error: 'Lỗi cập nhật trạng thái' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json(
      { success: false, error: 'Chưa đăng nhập quản trị' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const leads = await getLeads();
    const updated = leads.filter((item) => item.id !== id);
    await saveLeads(updated);
    return NextResponse.json({ success: true, leads: updated });
  } catch {
    return NextResponse.json({ success: false, error: 'Lỗi xóa liên hệ' }, { status: 500 });
  }
}
