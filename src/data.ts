/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Idea, Profile, Comment, Match, Message, AppNotification } from './types';

export const INITIAL_PROFILES: Profile[] = [
  {
    username: 'skeedo',
    displayName: 'Skeedo',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
    tagline: 'Building Krostio, BDStack, and Coaching Center OS from Dhaka',
    bio: 'Solo founder and developer based in Dhaka. Passionate about building micro-utilities and custom workflows that solve real problems. Always learning, building-in-public, and looking for cool co-builders.',
    location: 'Dhaka, Bangladesh',
    primaryStack: ['Next.js', 'Supabase', 'React', 'Tailwind', 'Node.js'],
    lookingFor: ['collab', 'beta_test', 'feedback', 'connect'],
    website: 'https://skeedo.me',
    twitter: 'https://twitter.com/skeedo_builds',
    github: 'https://github.com/skeedo',
    isVerified: true,
    isBanned: false,
    plan: 'pro',
    onboardedAt: '2026-06-01T10:00:00Z',
    createdAt: '2026-06-01T10:00:00Z'
  },
  {
    username: 'dev_sarah',
    displayName: 'Sarah Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    tagline: 'Full-stack indie builder. Creating AI form wizards.',
    bio: 'Ex-Stripe engineer turned solo indie hacker. I build tools for creators and small dev teams. Powered by matcha, lo-fi beats, and clean code.',
    location: 'San Francisco, USA',
    primaryStack: ['React', 'Next.js', 'Tailwind CSS', 'OpenAI', 'PostgreSQL'],
    lookingFor: ['beta_test', 'connect', 'feedback'],
    website: 'https://sarahchen.dev',
    twitter: 'https://twitter.com/sarahcodes',
    github: 'https://github.com/sarahc',
    isVerified: true,
    isBanned: false,
    plan: 'pro',
    onboardedAt: '2026-05-15T08:30:00Z',
    createdAt: '2026-05-15T08:30:00Z'
  },
  {
    username: 'alex_growth',
    displayName: 'Alex Mercer',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    tagline: 'No-code marketer and SaaS micro-investor',
    bio: 'I help technical founders launch and scale. Have acquired 2 micro-SaaS products. Looking for the next gem to buy and scale!',
    location: 'London, UK',
    primaryStack: ['Figma', 'Webflow', 'Tailwind', 'Stripe', 'n8n'],
    lookingFor: ['acquire', 'invest', 'connect', 'collab'],
    website: 'https://mercergrowth.co',
    twitter: 'https://twitter.com/alex_growth',
    isVerified: false,
    isBanned: false,
    plan: 'pro',
    onboardedAt: '2026-06-10T14:20:00Z',
    createdAt: '2026-06-10T14:20:00Z'
  },
  {
    username: 'indie_dan',
    displayName: 'Dan Miller',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
    tagline: 'Frontend craftsman. Obsessed with micro-interactions.',
    bio: 'Building design utilities for developers. I make animations silky smooth. Open to selling my side projects to buy more coffee beans.',
    location: 'Berlin, Germany',
    primaryStack: ['Vue.js', 'Vite', 'Tailwind CSS', 'Framer Motion'],
    lookingFor: ['acquire', 'feedback', 'connect'],
    website: 'https://danmiller.io',
    github: 'https://github.com/danmiller-dev',
    isVerified: false,
    isBanned: false,
    plan: 'free',
    onboardedAt: '2026-04-20T11:15:00Z',
    createdAt: '2026-04-20T11:15:00Z'
  },
  {
    username: 'acquirer_rob',
    displayName: 'Robert Vance',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80',
    tagline: 'Buying micro-SaaS products ($2k - $30k range)',
    bio: 'Founder at MicroHoldings LLC. We acquire, optimize, and grow under-loved micro-SaaS apps. High speed, low friction acquisitions.',
    location: 'New York, USA',
    primaryStack: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe'],
    lookingFor: ['acquire', 'invest', 'connect'],
    website: 'https://microholdings.co',
    linkedin: 'https://linkedin.com/in/robert-vance-holdings',
    isVerified: true,
    isBanned: false,
    plan: 'pro',
    onboardedAt: '2026-05-01T09:00:00Z',
    createdAt: '2026-05-01T09:00:00Z'
  },
  {
    username: 'mona_builder',
    displayName: 'Mona El-Saeed',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80',
    tagline: 'Building privacy-first browser add-ons',
    bio: 'Cybersecurity advocate and browser extension developer. Always compiling, always testing. Looking for beta testers for a cookie blocker.',
    location: 'Cairo, Egypt',
    primaryStack: ['JavaScript', 'WebExtensions API', 'React', 'Tailwind'],
    lookingFor: ['beta_test', 'feedback', 'connect'],
    github: 'https://github.com/mona-sec',
    isVerified: false,
    isBanned: false,
    plan: 'free',
    onboardedAt: '2026-06-18T16:45:00Z',
    createdAt: '2026-06-18T16:45:00Z'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    name: 'Krostio',
    slug: 'krostio',
    tagline: 'Instant feedback widgets for micro-SaaS builders',
    description: `### Why Krostio?
Every solo founder knows getting initial feedback is a nightmare. Users land, stay for 10 seconds, and leave without telling you why. 

Krostio solves this by injecting an elegant, minimal, single-click feedback drawer directly into your webapp. 

### Features
* **Zero Performance Impact:** Hand-written minimal script (under 3KB).
* **AI Sentiment Categorization:** Automatically flags bugs, feature requests, or praise.
* **Supabase Integration:** Set up sync with your database in 1 minute.
* **Custom Styling:** Automatically adapts to your Tailwind theme colors.

Include Krostio with a simple snippet:
\`\`\`html
<script src="https://cdn.krostio.com/widget.js" data-id="YOUR_ID"></script>
\`\`\``,
    logoUrl: '⚡',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&h=450&q=80',
    status: 'live',
    primaryStack: ['React', 'Supabase', 'Tailwind CSS', 'Vercel'],
    demoUrl: 'https://krostio.com',
    repoUrl: 'https://github.com/skeedo/krostio',
    mrrRange: '$200–$500/mo',
    mrrExact: 340,
    targetMarket: 'Indie Hackers, Solo Founders',
    tags: ['developer-tools', 'feedback', 'analytics', 'productivity'],
    screenshots: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&h=400&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&h=400&q=80'
    ],
    upvotesCount: 42,
    viewsCount: 310,
    savesCount: 15,
    isBoosted: false,
    isFeatured: true,
    founderUsername: 'skeedo',
    createdAt: '2026-06-05T12:00:00Z',
    isPublished: true
  },
  {
    id: 'prod_2',
    name: 'FormFlow AI',
    slug: 'formflow-ai',
    tagline: 'Automate form building with AI schema validation',
    description: `### FormFlow: Form Generation on Autopilot

Stop writing form controllers and validation states. Just prompt FormFlow:

> "Create an onboarding form for a pet clinic that asks for owner info, pet breed, age, and vaccination records."

FormFlow generates the fully accessible React code, TypeScript schemas, and Zod validator file in 3 seconds.

### Key Benefits
- **Saves Hours:** No more endless copy-pasting of input validation rules.
- **Tailwind Ready:** Outputs clean Tailwind code that matches your existing design classes.
- **Next.js Server Actions friendly:** Integration out-of-the-box.`,
    logoUrl: '📝',
    coverUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&h=450&q=80',
    status: 'beta',
    primaryStack: ['Next.js', 'React', 'Zod', 'Tailwind', 'OpenAI'],
    demoUrl: 'https://formflow.ai',
    mrrRange: '$0/mo',
    targetMarket: 'React Developers, agencies',
    tags: ['developer-tools', 'ai', 'productivity'],
    screenshots: [
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&h=400&q=80'
    ],
    upvotesCount: 89,
    viewsCount: 540,
    savesCount: 34,
    isBoosted: true,
    isFeatured: false,
    founderUsername: 'dev_sarah',
    createdAt: '2026-06-12T09:00:00Z',
    isPublished: true
  },
  {
    id: 'prod_3',
    name: 'CSSGlow',
    slug: 'cssglow',
    tagline: 'Interactive custom shadow generator for Tailwind developers',
    description: `### Handcrafted Premium Shadows for Tailwind CSS

Default Tailwind shadows are too harsh and look like 2012 Web Design. 

CSSGlow lets you design buttery-smooth layered shadows using 3D ray-casting simulation inside a visual canvas, then copies standard Tailwind v4 theme extensions directly to your clipboard.

### Acquisition Opportunity
I am putting CSSGlow up for sale because I do not have time to market it properly.
- **Traffic:** ~3,000 unique visitors/mo (organic SEO, Twitter shares)
- **Tech Stack:** High quality Vue 3 code, Vite compile, zero complex databases. Extremely easy to host (costs $0 on Vercel).
- **Revenue:** Has earned ~$450 in one-time purchases for lifetime licenses.`,
    logoUrl: '✨',
    coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&h=450&q=80',
    status: 'for_sale',
    primaryStack: ['Vue.js', 'Vite', 'Tailwind CSS', 'Framer Motion'],
    demoUrl: 'https://cssglow.co',
    mrrRange: '$0–$200/mo',
    mrrExact: 25,
    askingPrice: 3500,
    acquisitionRationale: 'Selling this visual designer tool to focus fully on my primary B2B job. Great starter project for someone who wants to add a pro tier or monetize via premium UI packs.',
    targetMarket: 'Frontend Developers, UI Designers',
    tags: ['design-tools', 'developer-tools', 'for-sale'],
    screenshots: [
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&h=400&q=80'
    ],
    upvotesCount: 112,
    viewsCount: 1200,
    savesCount: 58,
    isBoosted: false,
    isFeatured: false,
    founderUsername: 'indie_dan',
    createdAt: '2026-05-10T14:00:00Z',
    isPublished: true
  },
  {
    id: 'prod_4',
    name: 'BDStack',
    slug: 'bdstack',
    tagline: 'Curated localized APIs and datasets for Bangladeshi developers',
    description: `### Simplify building local apps in BD

Need lists of Districts, Upazilas, post codes, local mobile operators, and popular local payment gateways but tired of scraping dirty PDF reports from government sites?

BDStack is a robust, cached, high-availability JSON endpoint suite covering local geographic, administrative, and economic datasets.

### Current Endpoints
1. \`/api/v1/districts\`
2. \`/api/v1/payment-gateways\` (bKash, Nagad, Rocket, SSLCommerz metadata)
3. \`/api/v1/banks-branches\``,
    logoUrl: '🇧🇩',
    coverUrl: 'https://images.unsplash.com/photo-1588681664899-f142ff225161?auto=format&fit=crop&w=800&h=450&q=80',
    status: 'live',
    primaryStack: ['Next.js', 'Node.js', 'Redis', 'Vercel'],
    demoUrl: 'https://bdstack.space',
    repoUrl: 'https://github.com/skeedo/bdstack',
    mrrRange: '$0/mo',
    targetMarket: 'Bangladeshi developers, local tech companies',
    tags: ['developer-tools', 'api', 'datasets'],
    screenshots: [],
    upvotesCount: 28,
    viewsCount: 150,
    savesCount: 6,
    isBoosted: false,
    isFeatured: false,
    founderUsername: 'skeedo',
    createdAt: '2026-06-18T10:00:00Z',
    isPublished: true
  },
  {
    id: 'prod_5',
    name: 'CookieShield',
    slug: 'cookieshield',
    tagline: 'A lightweight cookie consent banner that is actually GDPR safe',
    description: `### Tired of heavy, manipulative cookie popups?
CookieShield is an open-source, ultra-lightweight (1.2KB) consent manager that does not track users before consent, load blocklisted scripts, or use confusing dark patterns.

Designed specifically for clean micro-SaaS applications that care about user privacy.`,
    logoUrl: '🛡️',
    coverUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&h=450&q=80',
    status: 'live',
    primaryStack: ['JavaScript', 'Tailwind', 'Cloudflare Workers'],
    demoUrl: 'https://cookieshield.org',
    mrrRange: '$0/mo',
    targetMarket: 'SaaS founders, privacy conscious websites',
    tags: ['privacy', 'developer-tools'],
    screenshots: [],
    upvotesCount: 15,
    viewsCount: 88,
    savesCount: 3,
    isBoosted: false,
    isFeatured: false,
    founderUsername: 'mona_builder',
    createdAt: '2026-06-20T11:00:00Z',
    isPublished: true
  }
];

export const INITIAL_IDEAS: Idea[] = [
  {
    id: 'idea_1',
    title: 'Multi-wallet freelance income log optimized for Bangladeshi gig workers',
    problem: 'Freelancers in BD receive earnings through split pipelines: Payoneer, Upwork direct deposit, Wise, and bKash remittances. Keeping track of actual revenue, transaction fees, local bank withdrawal exchange rates, and tax declarations is extremely tedious and manual.',
    solution: 'A simple mobile-friendly web dashboard where they link email reports or manually log payments. Displays total net income, average exchange rates, withdrawal history, and auto-generates a clean PDF tax declaration sheet for local tax filing.',
    targetAudience: 'Freelance developers, designers, and writers in Bangladesh.',
    monetizationHint: 'Free up to 5 logged transactions per month. Pro tier at $3/mo for unlimited logs, tax document exports, and CSV export.',
    tags: ['fintech', 'gig-economy', 'freelance'],
    authorUsername: 'skeedo',
    swipeRightCount: 38,
    swipeLeftCount: 12,
    status: 'open',
    isPublished: true,
    isBoosted: false,
    createdAt: '2026-06-25T08:00:00Z'
  },
  {
    id: 'idea_2',
    title: 'Automated privacy policy generator that scans codebases for tracking pixels',
    problem: 'Indie builders hate writing legal copy. Standard privacy policy generators ask general questions, but founders often forget tracking scripts or cookies they are loading (e.g. Google Analytics, Hotjar, Facebook Pixel, Stripe checkout). This makes their terms legally incomplete.',
    solution: 'A simple command line interface (CLI) tool or GitHub Action that parses your index.html and codebase for tracking domains, lists discovered cookies/pixels, and outputs a customized, accurate privacy policy markdown file matching exactly what you use.',
    targetAudience: 'Micro-SaaS builders, indie developers on GitHub.',
    monetizationHint: 'Free for open source. $15 per single site scan + premium cookie banner script injection.',
    inspirationUrl: 'https://gdpr.info',
    tags: ['legaltech', 'developer-tools', 'privacy'],
    authorUsername: 'dev_sarah',
    swipeRightCount: 52,
    swipeLeftCount: 5,
    status: 'validated',
    isPublished: true,
    isBoosted: true,
    createdAt: '2026-06-10T11:00:00Z'
  },
  {
    id: 'idea_3',
    title: 'Terminal-based local Figma to Tailwind CSS utility class converter',
    problem: 'Importing styles from Figma usually means opening the web inspector, copying absolute CSS pixel coordinates, and translating them manually into utility classes. It breaks the flow of coding.',
    solution: 'An active CLI utility that connects to Figma\'s developer API, watches a specified file or frame, and transpiles design systems directly into Tailwind v4 theme variables and components.',
    targetAudience: 'Frontend developers, UI/UX engineers',
    monetizationHint: 'Pay once, run forever ($29 desktop license). Free for personal side projects.',
    tags: ['devtools', 'tailwind', 'design-to-code'],
    authorUsername: 'alex_growth',
    swipeRightCount: 74,
    swipeLeftCount: 14,
    status: 'building',
    claimedBy: 'indie_dan',
    isPublished: true,
    isBoosted: false,
    createdAt: '2026-06-02T15:00:00Z'
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'comm_1',
    targetId: 'prod_1',
    targetType: 'product',
    authorUsername: 'dev_sarah',
    content: 'This feedback widget looks awesome! I am definitely installing this on FormFlow for my beta launch. Is there a way to forward notifications to Slack?',
    createdAt: '2026-06-06T14:30:00Z',
    upvotes: 8
  },
  {
    id: 'comm_2',
    targetId: 'prod_1',
    targetType: 'product',
    authorUsername: 'skeedo',
    content: 'Hey Sarah! Yes, absolutely! Slack and Discord webhooks are already built-in under the settings tab. Let me know if you run into any issues during installation.',
    createdAt: '2026-06-06T15:10:00Z',
    upvotes: 4
  },
  {
    id: 'comm_3',
    targetId: 'prod_3',
    targetType: 'product',
    authorUsername: 'acquirer_rob',
    content: 'Very clean product Dan. What are the margins on host/processing? Do you have proof of the stripe lifetime sales? Open to starting a conversation in the DMs.',
    createdAt: '2026-05-15T09:20:00Z',
    upvotes: 5
  }
];

export const INITIAL_MATCHES: Match[] = [
  {
    id: 'match_1',
    type: 'acquisition',
    productName: 'CSSGlow',
    user1: 'acquirer_rob',
    user2: 'indie_dan',
    status: 'active',
    createdAt: '2026-06-20T10:00:00Z',
    lastMessageAt: '2026-06-26T18:30:00Z',
    lastMessageText: 'Thanks for the details. I will draft a formal term sheet.',
    unreadCount: 0
  },
  {
    id: 'match_2',
    type: 'founder',
    user1: 'skeedo',
    user2: 'dev_sarah',
    status: 'active',
    createdAt: '2026-06-22T14:00:00Z',
    lastMessageAt: '2026-06-25T11:45:00Z',
    lastMessageText: 'Hey Skeedo, I reviewed your feedback widget! Awesome work.',
    unreadCount: 1
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg_1',
    conversationId: 'match_1',
    senderUsername: 'acquirer_rob',
    content: 'Hi Dan, I saw CSSGlow is for sale on microsaas.space. Really clean design. What is your minimum asking price and can you share some basic traffic stats?',
    sentAt: '2026-06-20T10:15:00Z',
    isRead: true
  },
  {
    id: 'msg_2',
    conversationId: 'match_1',
    senderUsername: 'indie_dan',
    content: 'Hey Robert! Thanks for reaching out. Asking price is $3,500. Hosting is $0 on Vercel, and processing costs are just the standard Stripe transaction fees. Traffic is completely organic from Twitter and developer bookmarks. Here is a screenshot of my Plausible dashboard: ~3k uniques per month.',
    sentAt: '2026-06-20T11:30:00Z',
    isRead: true
  },
  {
    id: 'msg_3',
    conversationId: 'match_1',
    senderUsername: 'acquirer_rob',
    content: 'Thanks for the details. I will draft a formal term sheet.',
    sentAt: '2026-06-26T18:30:00Z',
    isRead: true
  },
  {
    id: 'msg_4',
    conversationId: 'match_2',
    senderUsername: 'skeedo',
    content: 'Hey Sarah! Saw we matched on the Founders Deck. Your AI Form builder sounds super helpful, I would love to try it out when you launch the beta!',
    sentAt: '2026-06-22T14:10:00Z',
    isRead: true
  },
  {
    id: 'msg_5',
    conversationId: 'match_2',
    senderUsername: 'dev_sarah',
    content: 'Hey Skeedo, I reviewed your feedback widget! Awesome work.',
    sentAt: '2026-06-25T11:45:00Z',
    isRead: false
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    type: 'new_match',
    userId: 'skeedo',
    title: 'New Founder Match!',
    content: 'You and @dev_sarah swiped right on each other. Say hello!',
    targetId: 'match_2',
    createdAt: '2026-06-22T14:00:00Z',
    isRead: false
  },
  {
    id: 'notif_2',
    type: 'idea_validated',
    userId: 'dev_sarah',
    title: '🎉 Idea Validated!',
    content: 'Your privacy policy generator idea has hit 50+ validation swipes!',
    targetId: 'idea_2',
    createdAt: '2026-06-20T15:00:00Z',
    isRead: true
  }
];
