import fs from 'fs/promises';
import path from 'path';

export interface LeadItem {
  id: string;
  name: string;
  phone: string;
  email?: string;
  themeInterest?: string;
  message: string;
  status: 'new' | 'contacted';
  createdAt: string;
}

const LEADS_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'leads.json');

export async function getLeads(): Promise<LeadItem[]> {
  try {
    const raw = await fs.readFile(LEADS_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveLeads(leads: LeadItem[]): Promise<boolean> {
  try {
    await fs.mkdir(path.dirname(LEADS_FILE_PATH), { recursive: true });
    await fs.writeFile(LEADS_FILE_PATH, JSON.stringify(leads, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing leads.json:', err);
    return false;
  }
}
