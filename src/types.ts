/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logoUrl: string;
  coverUrl?: string;
  status: 'stealth' | 'beta' | 'live' | 'paused' | 'for_sale';
  primaryStack: string[];
  demoUrl?: string;
  repoUrl?: string;
  mrrRange: string;
  mrrExact?: number;
  targetMarket?: string;
  tags: string[];
  screenshots: string[];
  askingPrice?: number;
  acquisitionRationale?: string;
  upvotesCount: number;
  viewsCount: number;
  savesCount: number;
  isBoosted: boolean;
  isFeatured: boolean;
  founderUsername: string;
  createdAt: string;
  isPublished: boolean;
}

export interface Idea {
  id: string;
  title: string;
  problem: string;
  solution?: string;
  targetAudience: string;
  monetizationHint?: string;
  inspirationUrl?: string;
  tags: string[];
  authorUsername: string;
  swipeRightCount: number;
  swipeLeftCount: number;
  status: 'open' | 'validated' | 'building';
  claimedBy?: string;
  isPublished: boolean;
  isBoosted: boolean;
  createdAt: string;
}

export interface Profile {
  username: string;
  displayName: string;
  avatarUrl: string;
  tagline: string;
  bio?: string;
  location: string;
  primaryStack: string[];
  lookingFor: ('collab' | 'beta_test' | 'acquire' | 'invest' | 'feedback' | 'connect')[];
  website?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
  isVerified: boolean; // Admin/verified badge
  isBanned: boolean;
  plan: 'free' | 'pro';
  onboardedAt?: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  targetId: string;
  targetType: 'product' | 'idea';
  authorUsername: string;
  content: string;
  createdAt: string;
  upvotes: number;
}

export interface Match {
  id: string;
  type: 'founder' | 'acquisition';
  productName?: string; // If matched on a product for acquisition
  user1: string; // username
  user2: string; // username
  status: 'pending' | 'active' | 'closed';
  createdAt: string;
  lastMessageAt: string;
  lastMessageText?: string;
  unreadCount?: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderUsername: string;
  content: string;
  sentAt: string;
  isRead: boolean;
}

export interface DealRoomState {
  matchId: string;
  status: 'inquiry' | 'negotiating' | 'due_diligence' | 'closed_won' | 'closed_lost';
  askingPrice: number;
  currentOffer: number;
  agreedPrice?: number;
  checklist: { id: string; text: string; done: boolean }[];
  paymentStatus?: 'unpaid' | 'paid';
}

export interface AppNotification {
  id: string;
  type: 'new_match' | 'new_message' | 'idea_validated' | 'product_upvoted' | 'acquisition_inquiry' | 'boost_expired';
  userId: string;
  title: string;
  content: string;
  targetId?: string; // product, idea, or chat id
  createdAt: string;
  isRead: boolean;
}
