export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  authorAvatar: string;
  coverImage: string;
  publishedAt: string;
  readTime: number;
  featured: boolean;
  tags: string[];
}

export interface Founder {
  id: string;
  name: string;
  slug: string;
  title: string;
  company: string;
  industry: string;
  avatar: string;
  coverImage: string;
  bio: string;
  netWorth?: string;
  founded: string;
  location: string;
  achievements: string[];
  socialLinks: { twitter?: string; linkedin?: string; website?: string };
  rank?: number;
}

export interface Startup {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logo: string;
  industry: string;
  stage: string;
  founded: string;
  location: string;
  founders: string[];
  funding?: string;
  website: string;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  submittedBy: string;
  votes: number;
  month: string;
  winner: boolean;
  category: string;
}
