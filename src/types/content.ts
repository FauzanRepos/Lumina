export type AccentTone = "sky" | "mint" | "peach" | "lavender" | "amber";
export type InsightFormat = "article" | "podcast" | "guide" | "question";
export type InsightArtworkVariant = "wave" | "quote" | "journal";

export interface NavigationItem {
  href: string;
  label: string;
  matchPrefix?: string;
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
  icon: "home" | "sofa" | "time";
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  initials?: string;
  photo?: string;
}

export interface Insight {
  id: string;
  href: string;
  label: string;
  title: string;
  excerpt: string;
  format: InsightFormat;
}

export interface InsightArticle {
  id: string;
  slug: string;
  href: string;
  label: string;
  title: string;
  excerpt: string;
  format: InsightFormat;
  author: string;
  authorRole: string;
  category: string;
  publishedAt: string;
  readTime: string;
  accent: AccentTone;
  artworkVariant: InsightArtworkVariant;
  intro: string;
  highlightQuote?: string;
  highlightAttribution?: string;
  keyTakeaways: string[];
  featured: boolean;
  contentHtml: string;
}

export interface QuizOption {
  id: string;
  label: string;
  accent: AccentTone;
}

export interface QuizQuestion {
  id: string;
  label: string;
  title: string;
  options: QuizOption[];
}

export interface FooterContact {
  label: string;
  value: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface FocusArea {
  title: string;
  description: string;
}

export interface PsychologistJson {
  id: string;
  name?: string;
  fullName?: string;
  photo?: string;
  psikolog?: string;
  almamater?: string;
  bio?: string;
  bioParagraphs?: string[];
  tags?: string[];
  sessionTypes?: string[];
  sessionFee?: number;
  originalFee?: number;
  sessionDuration?: number;
  initials?: string;
  accent?: AccentTone;
  education?: string[];
  licenses?: string[];
  focusAreas?: FocusArea[];
  availability?: Record<string, string[]>;
  featured?: boolean;
  featuredOrder?: number;
}

export interface Psychologist {
  id: string;
  name: string;
  fullName?: string;
  title: string;
  university: string;
  shortBio: string;
  bio: string[];
  specialties: string[];
  sessionTypes: string[];
  sessionFee: number;
  originalFee?: number;
  sessionDuration: number;
  initials: string;
  accent: AccentTone;
  photo?: string;
  education: string[];
  licenses: string[];
  focusAreas: FocusArea[];
  availability: Record<string, string[]>;
  featured?: boolean;
  featuredOrder?: number;
}

export interface ServiceItem {
  id: string;
  title: string;
  shortLabel?: string;
  label?: string;
  description: string;
  features?: string[];
  highlights?: string[];
  image?: string;
  cta?: {
    label: string;
    target: string;
  };
}

export interface ServiceCategory {
  id: string;
  label: string;
  summary?: string;
  supportingNote?: string;
  note?: {
    title: string;
    text: string;
  };
  items: ServiceItem[];
}
