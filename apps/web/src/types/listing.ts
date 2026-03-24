export interface Category {
  id: string;
  name: string;
  count: number;
}

export interface Host {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  responseRate: number;
  responseTime: string;
  verified: boolean;
  joinedYear: number;
  bio: string;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  pricePerDay: number;
  deposit: number;
  location: string;
  district: string;
  city: string;
  rating: number;
  reviewCount: number;
  host: Host;
  reviews: Review[];
  specs: Record<string, string>;
  available: boolean;
  verified: boolean;
  minDays: number;
  maxDays: number;
  rules: string[];
}
