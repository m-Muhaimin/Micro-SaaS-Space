/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Idea, Profile, Comment, Match, Message, AppNotification, DealRoomState } from '../types';
import {
  INITIAL_PROFILES,
  INITIAL_PRODUCTS,
  INITIAL_IDEAS,
  INITIAL_COMMENTS,
  INITIAL_MATCHES,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS
} from '../data';

interface AppContextType {
  currentUser: Profile | null;
  profiles: Profile[];
  products: Product[];
  ideas: Idea[];
  matches: Match[];
  messages: Message[];
  comments: Comment[];
  notifications: AppNotification[];
  savedProductIds: string[];
  savedIdeaIds: string[];
  swipedIds: { [deckName: string]: string[] };
  swipesCountToday: number;
  activeView: string;
  selectedMatchId: string | null;
  activeDealRoomMatchId: string | null;
  viewingProfileUsername: string | null;
  activeExploreTab: 'products' | 'ideas' | 'founders';
  searchOpen: boolean;
  
  // State Setters & Navigation
  setCurrentUser: (profile: Profile | null) => void;
  setActiveView: (view: string) => void;
  setSelectedMatchId: (id: string | null) => void;
  setActiveDealRoomMatchId: (id: string | null) => void;
  setViewingProfileUsername: (username: string | null) => void;
  setActiveExploreTab: (tab: 'products' | 'ideas' | 'founders') => void;
  setSearchOpen: (open: boolean) => void;
  
  // Actions
  loginWithGitHub: () => void;
  logout: () => void;
  completeOnboarding: (tagline: string, location: string, stack: string[], lookingFor: any[]) => void;
  recordSwipe: (deck: 'products' | 'ideas' | 'founders', targetId: string, direction: 'left' | 'right' | 'up') => { matched: boolean; matchId?: string };
  submitProduct: (productData: Partial<Product>) => void;
  submitIdea: (ideaData: Partial<Idea>) => void;
  claimIdea: (ideaId: string) => void;
  toggleSaveProduct: (productId: string) => void;
  toggleSaveIdea: (ideaId: string) => void;
  addComment: (targetId: string, targetType: 'product' | 'idea', content: string) => void;
  upvoteComment: (commentId: string) => void;
  upvoteProduct: (productId: string) => void;
  sendMessage: (conversationId: string, content: string) => void;
  markNotificationsAsRead: () => void;
  updateProfile: (profileData: Partial<Profile>) => void;
  upgradeToPro: () => void;
  purchaseBoost: (type: 'product' | 'idea' | 'founder', targetId: string) => void;
  
  // Deal Room Actions
  submitDealOffer: (matchId: string, amount: number) => void;
  updateDealStatus: (matchId: string, status: DealRoomState['status']) => void;
  toggleDealChecklist: (matchId: string, itemId: string) => void;
  payDealFee: (matchId: string) => void;
  getDealState: (matchId: string) => DealRoomState;

  // Admin Actions
  approveProduct: (productId: string) => void;
  featureProduct: (productId: string) => void;
  rejectProduct: (productId: string) => void;
  banUser: (username: string) => void;
  verifyUser: (username: string) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try loading from localStorage, otherwise use initials
  const [currentUser, setCurrentUserInternal] = useState<Profile | null>(() => {
    const saved = localStorage.getItem('mss_current_user');
    return saved ? JSON.parse(saved) : null; // null represents logged out/landing page
  });

  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const saved = localStorage.getItem('mss_profiles');
    return saved ? JSON.parse(saved) : INITIAL_PROFILES;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('mss_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [ideas, setIdeas] = useState<Idea[]>(() => {
    const saved = localStorage.getItem('mss_ideas');
    return saved ? JSON.parse(saved) : INITIAL_IDEAS;
  });

  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem('mss_matches');
    return saved ? JSON.parse(saved) : INITIAL_MATCHES;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('mss_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem('mss_comments');
    return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('mss_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [savedProductIds, setSavedProductIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('mss_saved_products');
    return saved ? JSON.parse(saved) : [];
  });

  const [savedIdeaIds, setSavedIdeaIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('mss_saved_ideas');
    return saved ? JSON.parse(saved) : [];
  });

  const [swipedIds, setSwipedIds] = useState<{ [deckName: string]: string[] }>(() => {
    const saved = localStorage.getItem('mss_swiped_ids');
    return saved ? JSON.parse(saved) : { products: [], ideas: [], founders: [] };
  });

  const [swipesCountToday, setSwipesCountToday] = useState<number>(() => {
    const saved = localStorage.getItem('mss_swipes_count');
    return saved ? Number(saved) : 0;
  });

  const [activeView, setActiveView] = useState<string>('landing');
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [activeDealRoomMatchId, setActiveDealRoomMatchId] = useState<string | null>(null);
  const [viewingProfileUsername, setViewingProfileUsername] = useState<string | null>(null);
  const [activeExploreTab, setActiveExploreTab] = useState<'products' | 'ideas' | 'founders'>('products');
  const [searchOpen, setSearchOpen] = useState<boolean>(false);

  // Deal Room States stored by matchId
  const [dealRooms, setDealRooms] = useState<{ [matchId: string]: DealRoomState }>(() => {
    const saved = localStorage.getItem('mss_deal_rooms');
    if (saved) return JSON.parse(saved);
    
    // Seed initial deal room for Robert Vance & Dan Miller (CSSGlow match_1)
    return {
      'match_1': {
        matchId: 'match_1',
        status: 'negotiating',
        askingPrice: 3500,
        currentOffer: 3200,
        checklist: [
          { id: '1', text: 'Revenue verified (MRR proof)', done: true },
          { id: '2', text: 'Tech stack walkthrough', done: false },
          { id: '3', text: 'DNS/domain transfer agreed', done: false },
          { id: '4', text: 'Customer list reviewed', done: false },
          { id: '5', text: 'Code repo access granted', done: false }
        ],
        paymentStatus: 'unpaid'
      }
    };
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('mss_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('mss_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('mss_ideas', JSON.stringify(ideas));
  }, [ideas]);

  useEffect(() => {
    localStorage.setItem('mss_matches', JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem('mss_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('mss_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('mss_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('mss_saved_products', JSON.stringify(savedProductIds));
  }, [savedProductIds]);

  useEffect(() => {
    localStorage.setItem('mss_saved_ideas', JSON.stringify(savedIdeaIds));
  }, [savedIdeaIds]);

  useEffect(() => {
    localStorage.setItem('mss_swiped_ids', JSON.stringify(swipedIds));
  }, [swipedIds]);

  useEffect(() => {
    localStorage.setItem('mss_swipes_count', swipesCountToday.toString());
  }, [swipesCountToday]);

  useEffect(() => {
    localStorage.setItem('mss_deal_rooms', JSON.stringify(dealRooms));
  }, [dealRooms]);

  const setCurrentUser = (profile: Profile | null) => {
    setCurrentUserInternal(profile);
    if (profile) {
      localStorage.setItem('mss_current_user', JSON.stringify(profile));
    } else {
      localStorage.removeItem('mss_current_user');
    }
  };

  // Actions
  const loginWithGitHub = () => {
    // Default mock user is skeedo
    const defaultUser = profiles.find(p => p.username === 'skeedo') || profiles[0];
    setCurrentUser(defaultUser);
    
    // Redirect based on onboarding
    if (!defaultUser.onboardedAt) {
      setActiveView('onboarding');
    } else {
      setActiveView('products');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveView('landing');
  };

  const completeOnboarding = (tagline: string, location: string, stack: string[], lookingFor: any[]) => {
    if (!currentUser) return;
    
    const updatedUser: Profile = {
      ...currentUser,
      tagline,
      location,
      primaryStack: stack,
      lookingFor,
      onboardedAt: new Date().toISOString()
    };
    
    // Update profiles and current user state
    setProfiles(prev => prev.map(p => p.username === currentUser.username ? updatedUser : p));
    setCurrentUser(updatedUser);
    setActiveView('products');
  };

  const recordSwipe = (deck: 'products' | 'ideas' | 'founders', targetId: string, direction: 'left' | 'right' | 'up') => {
    if (!currentUser) return { matched: false };

    // Update Swiped IDs
    const updatedSwipes = { ...swipedIds };
    if (!updatedSwipes[deck].includes(targetId)) {
      updatedSwipes[deck].push(targetId);
      setSwipedIds(updatedSwipes);
    }

    // Swipes Limit check for free users
    if (currentUser.plan === 'free') {
      setSwipesCountToday(prev => prev + 1);
    }

    // Right/Up swipe triggers action
    if (direction === 'right') {
      if (deck === 'products') {
        // Increment product upvote count
        setProducts(prev => prev.map(p => {
          if (p.id === targetId) {
            // Check milestone notifications
            const newUpvotes = p.upvotesCount + 1;
            if ([10, 50, 100].includes(newUpvotes) && p.founderUsername === currentUser.username) {
              const newNotif: AppNotification = {
                id: `notif_prod_milestone_${Date.now()}`,
                type: 'product_upvoted',
                userId: currentUser.username,
                title: '⚡ Product Upvote Milestone!',
                content: `Your product "${p.name}" reached ${newUpvotes} upvotes!`,
                targetId: p.slug,
                createdAt: new Date().toISOString(),
                isRead: false
              };
              setNotifications(notifs => [newNotif, ...notifs]);
            }
            return { ...p, upvotesCount: newUpvotes };
          }
          return p;
        }));
      } else if (deck === 'ideas') {
        // Increment swipe right count
        setIdeas(prev => prev.map(i => {
          if (i.id === targetId) {
            const newCount = i.swipeRightCount + 1;
            let newStatus = i.status;
            if (newCount >= 50 && i.status === 'open') {
              newStatus = 'validated';
              
              // Trigger notification for idea author
              const newNotif: AppNotification = {
                id: `notif_idea_val_${Date.now()}`,
                type: 'idea_validated',
                userId: i.authorUsername,
                title: '🎉 Idea Validated!',
                content: `Your idea "${i.title}" just reached 50+ right swipes! Builders agree it should exist.`,
                targetId: i.id,
                createdAt: new Date().toISOString(),
                isRead: false
              };
              setNotifications(notifs => [newNotif, ...notifs]);
            }
            return { ...i, swipeRightCount: newCount, status: newStatus };
          }
          return i;
        }));
      } else if (deck === 'founders') {
        // SWIPE RIGHT ON FOUNDER - Check if they swiped right on us!
        // Simulated mutual match: Since we are in mock mode, there's a 40% chance of a mutual match!
        const shouldMatch = Math.random() > 0.3;
        if (shouldMatch) {
          const matchId = `match_founder_${Date.now()}`;
          const newMatch: Match = {
            id: matchId,
            type: 'founder',
            user1: currentUser.username,
            user2: targetId, // which is the other founder's username
            status: 'active',
            createdAt: new Date().toISOString(),
            lastMessageAt: new Date().toISOString(),
            lastMessageText: 'Match created! Send a friendly message.'
          };

          const matchedProfile = profiles.find(p => p.username === targetId);

          const newNotif: AppNotification = {
            id: `notif_match_${Date.now()}`,
            type: 'new_match',
            userId: currentUser.username,
            title: '🤝 New Founder Match!',
            content: `You and @${targetId} (${matchedProfile?.displayName}) matched! Open DMs to chat.`,
            targetId: matchId,
            createdAt: new Date().toISOString(),
            isRead: false
          };

          setMatches(prev => [newMatch, ...prev]);
          setNotifications(prev => [newNotif, ...prev]);

          // Insert greeting message
          const welcomeMessage: Message = {
            id: `msg_welcome_${Date.now()}`,
            conversationId: matchId,
            senderUsername: targetId,
            content: `Hey! I saw we matched on microsaas.space. Great to connect! What are you building?`,
            sentAt: new Date().toISOString(),
            isRead: false
          };
          setMessages(prev => [...prev, welcomeMessage]);

          return { matched: true, matchId };
        }
      }
    } else if (direction === 'up') {
      // Watchlist saves
      if (deck === 'products') {
        toggleSaveProduct(targetId);
      } else if (deck === 'ideas') {
        toggleSaveIdea(targetId);
      }
    }

    return { matched: false };
  };

  const submitProduct = (productData: Partial<Product>) => {
    if (!currentUser) return;
    
    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      name: productData.name || 'Unnamed Product',
      slug: (productData.name || 'unnamed').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      tagline: productData.tagline || '',
      description: productData.description || '',
      logoUrl: productData.logoUrl || '🚀',
      coverUrl: productData.coverUrl,
      status: productData.status || 'beta',
      primaryStack: productData.primaryStack || [],
      demoUrl: productData.demoUrl,
      repoUrl: productData.repoUrl,
      mrrRange: productData.mrrRange || '$0/mo',
      mrrExact: productData.mrrExact,
      targetMarket: productData.targetMarket,
      tags: productData.tags || [],
      screenshots: productData.screenshots || [],
      askingPrice: productData.askingPrice,
      acquisitionRationale: productData.acquisitionRationale,
      upvotesCount: 1,
      viewsCount: 10,
      savesCount: 0,
      isBoosted: false,
      isFeatured: false,
      founderUsername: currentUser.username,
      createdAt: new Date().toISOString(),
      isPublished: productData.isPublished !== undefined ? productData.isPublished : true
    };

    setProducts(prev => [newProduct, ...prev]);
  };

  const submitIdea = (ideaData: Partial<Idea>) => {
    if (!currentUser) return;

    const newIdea: Idea = {
      id: `idea_${Date.now()}`,
      title: ideaData.title || 'Untitled Idea',
      problem: ideaData.problem || '',
      solution: ideaData.solution,
      targetAudience: ideaData.targetAudience || 'Indie founders',
      monetizationHint: ideaData.monetizationHint,
      inspirationUrl: ideaData.inspirationUrl,
      tags: ideaData.tags || [],
      authorUsername: currentUser.username,
      swipeRightCount: 0,
      swipeLeftCount: 0,
      status: 'open',
      isPublished: ideaData.isPublished !== undefined ? ideaData.isPublished : true,
      isBoosted: false,
      createdAt: new Date().toISOString()
    };

    setIdeas(prev => [newIdea, ...prev]);
  };

  const claimIdea = (ideaId: string) => {
    if (!currentUser) return;
    
    setIdeas(prev => prev.map(i => {
      if (i.id === ideaId) {
        // Send notification to author
        if (i.authorUsername !== currentUser.username) {
          const newNotif: AppNotification = {
            id: `notif_claim_${Date.now()}`,
            type: 'new_match',
            userId: i.authorUsername,
            title: '🔨 Your idea was claimed!',
            content: `@${currentUser.username} claimed your validated idea "${i.title}" and is building it!`,
            targetId: i.id,
            createdAt: new Date().toISOString(),
            isRead: false
          };
          setNotifications(prevNotifs => [newNotif, ...prevNotifs]);
        }
        return { ...i, claimedBy: currentUser.username, status: 'building' };
      }
      return i;
    }));
  };

  const toggleSaveProduct = (productId: string) => {
    setSavedProductIds(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const toggleSaveIdea = (ideaId: string) => {
    setSavedIdeaIds(prev => {
      const exists = prev.includes(ideaId);
      if (exists) {
        return prev.filter(id => id !== ideaId);
      } else {
        return [...prev, ideaId];
      }
    });
  };

  const addComment = (targetId: string, targetType: 'product' | 'idea', content: string) => {
    if (!currentUser) return;

    const newComment: Comment = {
      id: `comm_${Date.now()}`,
      targetId,
      targetType,
      authorUsername: currentUser.username,
      content,
      createdAt: new Date().toISOString(),
      upvotes: 0
    };

    setComments(prev => [...prev, newComment]);
  };

  const upvoteComment = (commentId: string) => {
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, upvotes: c.upvotes + 1 } : c));
  };

  const upvoteProduct = (productId: string) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, upvotesCount: p.upvotesCount + 1 } : p));
  };

  const sendMessage = (conversationId: string, content: string) => {
    if (!currentUser) return;

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderUsername: currentUser.username,
      content,
      sentAt: new Date().toISOString(),
      isRead: true
    };

    setMessages(prev => [...prev, newMsg]);

    // Update conversation last message and last message time
    setMatches(prev => prev.map(m => {
      if (m.id === conversationId) {
        return {
          ...m,
          lastMessageAt: newMsg.sentAt,
          lastMessageText: content
        };
      }
      return m;
    }));

    // Simulate response in founder deck chat
    const match = matches.find(m => m.id === conversationId);
    if (match && match.type === 'founder') {
      const partner = match.user1 === currentUser.username ? match.user2 : match.user1;
      setTimeout(() => {
        const replyMsg: Message = {
          id: `msg_reply_${Date.now()}`,
          conversationId,
          senderUsername: partner,
          content: `Wow, interesting! Let me look into that. I am actually quite excited about the microsaas.space project too! Let's schedule a call this week.`,
          sentAt: new Date().toISOString(),
          isRead: false
        };

        setMessages(mList => [...mList, replyMsg]);
        setMatches(mList => mList.map(m => {
          if (m.id === conversationId) {
            return {
              ...m,
              lastMessageAt: replyMsg.sentAt,
              lastMessageText: replyMsg.content,
              unreadCount: (m.unreadCount || 0) + 1
            };
          }
          return m;
        }));

        // Send Notification
        const partnerProfile = profiles.find(p => p.username === partner);
        const newNotif: AppNotification = {
          id: `notif_reply_${Date.now()}`,
          type: 'new_message',
          userId: currentUser.username,
          title: `New message from @${partner}`,
          content: replyMsg.content.substring(0, 60) + '...',
          targetId: conversationId,
          createdAt: new Date().toISOString(),
          isRead: false
        };
        setNotifications(prev => [newNotif, ...prev]);
      }, 3000);
    }
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const updateProfile = (profileData: Partial<Profile>) => {
    if (!currentUser) return;

    const updated = { ...currentUser, ...profileData };
    setProfiles(prev => prev.map(p => p.username === currentUser.username ? updated : p));
    setCurrentUser(updated);
  };

  const upgradeToPro = () => {
    if (!currentUser) return;
    const updated: Profile = { ...currentUser, plan: 'pro' };
    setProfiles(prev => prev.map(p => p.username === currentUser.username ? updated : p));
    setCurrentUser(updated);
  };

  const purchaseBoost = (type: 'product' | 'idea' | 'founder', targetId: string) => {
    if (type === 'product') {
      setProducts(prev => prev.map(p => p.id === targetId ? { ...p, isBoosted: true } : p));
    } else if (type === 'idea') {
      setIdeas(prev => prev.map(i => i.id === targetId ? { ...i, isBoosted: true } : i));
    }
  };

  // Deal Room
  const getDealState = (matchId: string) => {
    if (!dealRooms[matchId]) {
      // Create lazy initialized state
      const match = matches.find(m => m.id === matchId);
      const product = products.find(p => p.name === match?.productName);
      const askingPrice = product?.askingPrice || 3000;
      
      const newState: DealRoomState = {
        matchId,
        status: 'inquiry',
        askingPrice,
        currentOffer: askingPrice,
        checklist: [
          { id: '1', text: 'Revenue verified (MRR proof)', done: false },
          { id: '2', text: 'Tech stack walkthrough', done: false },
          { id: '3', text: 'DNS/domain transfer agreed', done: false },
          { id: '4', text: 'Customer list reviewed', done: false },
          { id: '5', text: 'Code repo access granted', done: false }
        ],
        paymentStatus: 'unpaid'
      };
      
      setDealRooms(prev => ({ ...prev, [matchId]: newState }));
      return newState;
    }
    return dealRooms[matchId];
  };

  const submitDealOffer = (matchId: string, amount: number) => {
    setDealRooms(prev => {
      const current = prev[matchId] || getDealState(matchId);
      const updated = {
        ...current,
        currentOffer: amount,
        status: 'negotiating' as const
      };
      return { ...prev, [matchId]: updated };
    });

    // Notify other party
    if (currentUser) {
      const match = matches.find(m => m.id === matchId);
      if (match) {
        const otherUser = match.user1 === currentUser.username ? match.user2 : match.user1;
        const newNotif: AppNotification = {
          id: `notif_deal_offer_${Date.now()}`,
          type: 'acquisition_inquiry',
          userId: otherUser,
          title: '💰 New Acquisition Offer',
          content: `@${currentUser.username} submitted an offer of $${amount.toLocaleString()} for ${match.productName || 'your SaaS'}.`,
          targetId: matchId,
          createdAt: new Date().toISOString(),
          isRead: false
        };
        setNotifications(prevNotifs => [newNotif, ...prevNotifs]);
      }
    }
  };

  const updateDealStatus = (matchId: string, status: DealRoomState['status']) => {
    setDealRooms(prev => {
      const current = prev[matchId] || getDealState(matchId);
      const agreedPrice = status === 'closed_won' ? current.currentOffer : current.agreedPrice;
      const updated = {
        ...current,
        status,
        agreedPrice
      };
      return { ...prev, [matchId]: updated };
    });
  };

  const toggleDealChecklist = (matchId: string, itemId: string) => {
    setDealRooms(prev => {
      const current = prev[matchId] || getDealState(matchId);
      const updated = {
        ...current,
        checklist: current.checklist.map(item => item.id === itemId ? { ...item, done: !item.done } : item)
      };
      return { ...prev, [matchId]: updated };
    });
  };

  const payDealFee = (matchId: string) => {
    setDealRooms(prev => {
      const current = prev[matchId] || getDealState(matchId);
      const updated = {
        ...current,
        paymentStatus: 'paid' as const
      };
      return { ...prev, [matchId]: updated };
    });
  };

  // Admin Actions
  const approveProduct = (productId: string) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, isPublished: true } : p));
  };

  const featureProduct = (productId: string) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, isFeatured: !p.isFeatured } : p));
  };

  const rejectProduct = (productId: string) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, isPublished: false } : p));
  };

  const banUser = (username: string) => {
    setProfiles(prev => prev.map(p => p.username === username ? { ...p, isBanned: !p.isBanned } : p));
  };

  const verifyUser = (username: string) => {
    setProfiles(prev => prev.map(p => p.username === username ? { ...p, isVerified: !p.isVerified } : p));
  };

  const resetAllData = () => {
    localStorage.clear();
    setProfiles(INITIAL_PROFILES);
    setProducts(INITIAL_PRODUCTS);
    setIdeas(INITIAL_IDEAS);
    setMatches(INITIAL_MATCHES);
    setMessages(INITIAL_MESSAGES);
    setComments(INITIAL_COMMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSavedProductIds([]);
    setSavedIdeaIds([]);
    setSwipedIds({ products: [], ideas: [], founders: [] });
    setSwipesCountToday(0);
    setDealRooms({});
    loginWithGitHub();
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      profiles,
      products,
      ideas,
      matches,
      messages,
      comments,
      notifications,
      savedProductIds,
      savedIdeaIds,
      swipedIds,
      swipesCountToday,
      activeView,
      selectedMatchId,
      activeDealRoomMatchId,
      viewingProfileUsername,
      activeExploreTab,
      searchOpen,
      
      setCurrentUser,
      setActiveView,
      setSelectedMatchId,
      setActiveDealRoomMatchId,
      setViewingProfileUsername,
      setActiveExploreTab,
      setSearchOpen,
      
      loginWithGitHub,
      logout,
      completeOnboarding,
      recordSwipe,
      submitProduct,
      submitIdea,
      claimIdea,
      toggleSaveProduct,
      toggleSaveIdea,
      addComment,
      upvoteComment,
      upvoteProduct,
      sendMessage,
      markNotificationsAsRead,
      updateProfile,
      upgradeToPro,
      purchaseBoost,
      
      submitDealOffer,
      updateDealStatus,
      toggleDealChecklist,
      payDealFee,
      getDealState,

      approveProduct,
      featureProduct,
      rejectProduct,
      banUser,
      verifyUser,
      resetAllData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
