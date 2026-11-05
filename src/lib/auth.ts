import crypto from 'crypto';
import { cookies } from 'next/headers';

export const ADMIN_COOKIE_NAME = 'tikovia_admin_token';

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || 'tikovia2026';
}

export function createExpectedToken(): string {
  const pwd = getAdminPassword();
  return crypto
    .createHmac('sha256', 'tikovia-cms-secret-key-2026')
    .update(pwd)
    .digest('hex');
}

export function checkPassword(inputPassword: string): boolean {
  return inputPassword === getAdminPassword();
}

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) return false;
    return token === createExpectedToken();
  } catch {
    return false;
  }
}
