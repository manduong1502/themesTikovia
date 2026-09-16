import fs from 'fs/promises';
import path from 'path';

export interface ThemeItem {
  id: number;
  title: string;
  category: string;
  description: string;
  tag: string;
  year: string;
  image: string;
  images?: string[];
  alt: string;
  demoUrl: string;
  accentColor: string;
}

export interface HeroContent {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  titleLine3: string;
  description: string;
  ctaPrimaryText: string;
  ctaPrimaryLink: string;
  ctaSecondaryText: string;
  ctaSecondaryLink: string;
  trustedBy: string[];
  bgImage: string;
}

export interface SkillItem {
  name: string;
  level: number;
}

export interface AboutContent {
  badge: string;
  title: string;
  highlightText: string;
  paragraphs: string[];
  skills: SkillItem[];
  tools: string[];
  studioImage: string;
  studioBadge: string;
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
  description: string;
}

export interface StatsContent {
  badge: string;
  stats: StatItem[];
}

export interface ContactContent {
  badge: string;
  title: string;
  highlightText: string;
  description: string;
  email: string;
  status: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterContent {
  brandName: string;
  tagline: string;
  logoUrl: string;
  copyright: string;
  links: FooterLink[];
}

export interface SiteContent {
  hero: HeroContent;
  themes: ThemeItem[];
  about: AboutContent;
  stats: StatsContent;
  contact: ContactContent;
  footer: FooterContent;
}

const CONTENT_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'site-content.json');

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const fileData = await fs.readFile(CONTENT_FILE_PATH, 'utf-8');
    return JSON.parse(fileData) as SiteContent;
  } catch (error) {
    console.error('Error reading site-content.json:', error);
    // Fallback: dynamic import or return empty structure
    try {
      const fallback = await import('@/data/site-content.json');
      return fallback.default as unknown as SiteContent;
    } catch (e) {
      throw new Error('Failed to load site content');
    }
  }
}

export async function saveSiteContent(content: SiteContent): Promise<boolean> {
  try {
    const jsonString = JSON.stringify(content, null, 2);
    await fs.writeFile(CONTENT_FILE_PATH, jsonString, 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing to site-content.json:', error);
    return false;
  }
}
