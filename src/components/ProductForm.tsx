/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useApp } from '../context/AppContext';
import { uploadFileToBucket, isSupabaseConfigured } from '../lib/supabase';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Tag, 
  DollarSign, 
  Sparkles, 
  Upload, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  HelpCircle, 
  Laptop, 
  Globe, 
  Code, 
  Save, 
  AlertCircle, 
  Info, 
  Clock, 
  CheckCircle2, 
  Eye, 
  ArrowUpRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import MDEditor from '@uiw/react-md-editor';

// CSS imports for the markdown editor
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

// Zod validation schema for the multi-step form
const productFormSchema = z.object({
  name: z.string()
    .min(1, "Product name is required")
    .max(60, "Product name must be 60 characters or less"),
  tagline: z.string()
    .min(1, "Tagline is required")
    .max(120, "Tagline must be 120 characters or less"),
  status: z.enum(['stealth', 'beta', 'live', 'paused', 'for_sale']),
  logoUrl: z.string().min(1, "Logo upload is required"),
  description: z.string().min(10, "Detailed description must be at least 10 characters"),
  primary_stack: z.array(z.string()).min(1, "Please add at least one technology stack item"),
  demo_url: z.string().url("Must be a valid URL starting with http:// or https://").optional().or(z.literal('')),
  repo_url: z.string().url("Must be a valid URL starting with http:// or https://").optional().or(z.literal('')),
  mrr_range: z.enum(['$0', '$0–$200', '$200–$500', '$500–$1K', '$1K–$5K', '$5K+']),
  target_market: z.string().max(100, "Target market must be 100 characters or less").optional().or(z.literal('')),
  screenshots: z.array(z.string()).max(6, "Up to 6 screenshots only"),
  tags: z.array(z.string()).max(5, "You can select up to 5 category tags only"),
  cover_url: z.string().url("Must be a valid URL starting with http:// or https://").optional().or(z.literal('')),
  asking_price: z.number().positive("Asking price must be a positive number").optional(),
  acquisition_rationale: z.string().max(500, "Acquisition rationale must be 500 characters or less").optional(),
  save_as_draft: z.boolean().default(false)
});

type ProductFormValues = z.infer<typeof productFormSchema>;

const STACK_SUGGESTIONS = [
  'Next.js', 'Supabase', 'React', 'Node.js', 'Python', 'Stripe', 
  'Tailwind CSS', 'PostgreSQL', 'Prisma', 'TypeScript', 'Firebase', 
  'Express', 'Docker', 'SQLite', 'Cloudflare Workers', 'GraphQL', 'FastAPI'
];

const PREDEFINED_TAGS = [
  'developer-tools', 'feedback', 'analytics', 'productivity', 
  'privacy', 'ai', 'design-tools', 'api', 'datasets', 
  'fintech', 'marketing', 'legaltech'
];

export const ProductForm: React.FC = () => {
  const { submitProduct, setActiveView } = useApp();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionData, setSubmissionData] = useState<any>(null);

  // Loading States for Uploads
  const [isLogoUploading, setIsLogoUploading] = useState(false);
  const [isCoverUploading, setIsCoverUploading] = useState(false);
  const [isScreenshotsUploading, setIsScreenshotsUploading] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  // Drag states
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [isLogoDragOver, setIsLogoDragOver] = useState(false);
  const [isCoverDragOver, setIsCoverDragOver] = useState(false);
  const [isScreenshotsDragOver, setIsScreenshotsDragOver] = useState(false);

  // Tech stack manual input state
  const [stackInputValue, setStackInputValue] = useState('');
  const [showStackPresets, setShowStackPresets] = useState(false);

  // Set up React Hook Form
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    trigger,
    formState,
    reset
  } = useForm<any>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      tagline: '',
      status: 'live',
      logoUrl: '',
      description: '',
      primary_stack: [],
      demo_url: '',
      repo_url: '',
      mrr_range: '$0',
      target_market: '',
      screenshots: [],
      tags: [],
      cover_url: '',
      asking_price: undefined,
      acquisition_rationale: '',
      save_as_draft: false
    }
  });

  const errors = formState.errors as any;

  // Watch critical state to trigger form flow updates dynamically
  const statusField = watch('status');
  const nameField = watch('name');
  const taglineField = watch('tagline');
  const logoUrlField = watch('logoUrl');
  const descriptionField = watch('description');
  const primaryStackField = watch('primary_stack') || [];
  const screenshotsField = watch('screenshots') || [];
  const tagsField = watch('tags') || [];
  const coverUrlField = watch('cover_url');
  const askingPriceField = watch('asking_price');
  const acquisitionRationaleField = watch('acquisition_rationale');
  const mrrRangeField = watch('mrr_range');
  const targetMarketField = watch('target_market');
  const demoUrlField = watch('demo_url');
  const repoUrlField = watch('repo_url');

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('mss_product_form_draft');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        // Map any old structure to make sure it loads perfectly
        reset({
          name: parsed.name || '',
          tagline: parsed.tagline || '',
          status: parsed.status || 'live',
          logoUrl: parsed.logoUrl || parsed.logo_url || '',
          description: parsed.description || '',
          primary_stack: parsed.primary_stack || parsed.primaryStack || [],
          demo_url: parsed.demo_url || parsed.demoUrl || '',
          repo_url: parsed.repo_url || parsed.repoUrl || '',
          mrr_range: parsed.mrr_range || parsed.mrrRange || '$0',
          target_market: parsed.target_market || parsed.targetMarket || '',
          screenshots: parsed.screenshots || [],
          tags: parsed.tags || [],
          cover_url: parsed.cover_url || parsed.coverUrl || '',
          asking_price: parsed.asking_price || parsed.askingPrice || undefined,
          acquisition_rationale: parsed.acquisition_rationale || parsed.acquisitionRationale || '',
          save_as_draft: parsed.save_as_draft || false
        });
        
        // Find saved step in localStorage to restore state
        const savedStep = localStorage.getItem('mss_product_form_step');
        if (savedStep) {
          const stepNum = parseInt(savedStep, 10);
          if (stepNum >= 1 && stepNum <= 5) {
            setStep(stepNum);
          }
        }
      } catch (e) {
        console.error("Failed to parse saved product submission draft", e);
      }
    }
  }, [reset]);

  // Auto-save draft to localStorage on values change
  useEffect(() => {
    const values = getValues();
    // Only save draft if form is not submitted and is at least partially filled
    if (!isSubmitted && (values.name || values.tagline || values.description || values.primary_stack?.length)) {
      localStorage.setItem('mss_product_form_draft', JSON.stringify(values));
      localStorage.setItem('mss_product_form_step', step.toString());
    }
  }, [
    step, 
    nameField, 
    taglineField, 
    statusField, 
    logoUrlField, 
    descriptionField, 
    primaryStackField, 
    screenshotsField, 
    tagsField, 
    coverUrlField, 
    askingPriceField, 
    acquisitionRationaleField, 
    mrrRangeField, 
    targetMarketField, 
    demoUrlField, 
    repoUrlField, 
    isSubmitted, 
    getValues
  ]);

  // Handle Logo file uploads (Max 2MB)
  const uploadLogoFile = async (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      alert("Logo file size exceeds the 2MB limit.");
      return;
    }
    setIsLogoUploading(true);
    try {
      const publicUrl = await uploadFileToBucket(file, 'product-logos');
      setValue('logoUrl', publicUrl, { shouldValidate: true });
    } catch (err: any) {
      alert("Failed to upload logo: " + (err.message || err));
    } finally {
      setIsLogoUploading(false);
    }
  };

  // Handle Cover Image file uploads (Max 5MB)
  const uploadCoverFile = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("Cover image size exceeds the 5MB limit.");
      return;
    }
    setIsCoverUploading(true);
    try {
      const publicUrl = await uploadFileToBucket(file, 'product-media');
      setValue('cover_url', publicUrl, { shouldValidate: true });
    } catch (err: any) {
      alert("Failed to upload cover: " + (err.message || err));
    } finally {
      setIsCoverUploading(false);
    }
  };

  // Handle screenshots batch uploads (Max 5MB each, total up to 6)
  const uploadScreenshotFiles = async (files: FileList) => {
    const currentScreenshots = getValues('screenshots') || [];
    if (currentScreenshots.length + files.length > 6) {
      alert("You can upload a maximum of 6 screenshots only.");
      return;
    }

    setIsScreenshotsUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 5 * 1024 * 1024) {
          alert(`File "${file.name}" exceeds the 5MB size limit. Skipping.`);
          continue;
        }
        const url = await uploadFileToBucket(file, 'product-media');
        uploadedUrls.push(url);
      }
      setValue('screenshots', [...currentScreenshots, ...uploadedUrls], { shouldValidate: true });
    } catch (err: any) {
      alert("Failed to upload one or more screenshots: " + (err.message || err));
    } finally {
      setIsScreenshotsUploading(false);
    }
  };

  // Stack tag chip helper actions
  const handleAddStackChip = (tech: string) => {
    const trimmed = tech.trim();
    if (!trimmed) return;
    const current = getValues('primary_stack') || [];
    if (!current.includes(trimmed)) {
      setValue('primary_stack', [...current, trimmed], { shouldValidate: true });
    }
    setStackInputValue('');
  };

  const handleRemoveStackChip = (indexToRemove: number) => {
    const current = getValues('primary_stack') || [];
    setValue('primary_stack', current.filter((_, idx) => idx !== indexToRemove), { shouldValidate: true });
  };

  // Custom keyboard listeners for technology stack tags input
  const handleStackInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddStackChip(stackInputValue);
    } else if (e.key === 'Backspace' && !stackInputValue) {
      const current = getValues('primary_stack') || [];
      if (current.length > 0) {
        handleRemoveStackChip(current.length - 1);
      }
    }
  };

  // Screenshot native HTML5 drag-to-reorder actions
  const handleScreenshotDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleScreenshotDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleScreenshotDrop = (index: number) => {
    if (dragIndex === null || dragIndex === index) return;
    const list = [...screenshotsField];
    const draggedItem = list[dragIndex];
    list.splice(dragIndex, 1);
    list.splice(index, 0, draggedItem);
    setValue('screenshots', list, { shouldValidate: true });
    setDragIndex(null);
  };

  // Horizontal touch/button based reordering (Move left/right)
  const moveScreenshot = (currentIndex: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= screenshotsField.length) return;
    
    const list = [...screenshotsField];
    const temp = list[currentIndex];
    list[currentIndex] = list[targetIndex];
    list[targetIndex] = temp;
    
    setValue('screenshots', list, { shouldValidate: true });
  };

  // Category tags toggle multi-select helper
  const handleToggleTag = (tag: string) => {
    const current = getValues('tags') || [];
    if (current.includes(tag)) {
      setValue('tags', current.filter(t => t !== tag), { shouldValidate: true });
    } else {
      if (current.length >= 5) {
        alert("You can select a maximum of 5 categories.");
        return;
      }
      setValue('tags', [...current, tag], { shouldValidate: true });
    }
  };

  // Multi-step validation progression
  const handleNextStep = async () => {
    let isValid = false;

    if (step === 1) {
      isValid = await trigger(['name', 'tagline', 'status', 'logoUrl']);
    } else if (step === 2) {
      isValid = await trigger(['description', 'primary_stack', 'demo_url', 'repo_url', 'mrr_range', 'target_market']);
    } else if (step === 3) {
      isValid = await trigger(['screenshots', 'tags', 'cover_url']);
    } else if (step === 4) {
      if (statusField === 'for_sale') {
        isValid = await trigger(['asking_price', 'acquisition_rationale']);
      } else {
        isValid = true; // Skip validation since step 4 is bypassed
      }
    }

    if (isValid) {
      // If we are at step 3 and status is NOT "for_sale", jump directly to step 5 (Review)
      if (step === 3 && statusField !== 'for_sale') {
        setStep(5);
      } else {
        setStep(prev => Math.min(prev + 1, 5));
      }
    }
  };

  const handlePrevStep = () => {
    // If we are at step 5 and status is NOT "for_sale", jump directly back to step 3
    if (step === 5 && statusField !== 'for_sale') {
      setStep(3);
    } else {
      setStep(prev => Math.max(prev - 1, 1));
    }
  };

  // Reset/Clear Draft to start fresh
  const handleClearDraft = () => {
    if (confirm("Are you sure you want to discard your current draft and start fresh?")) {
      localStorage.removeItem('mss_product_form_draft');
      localStorage.removeItem('mss_product_form_step');
      reset({
        name: '',
        tagline: '',
        status: 'live',
        logoUrl: '',
        description: '',
        primary_stack: [],
        demo_url: '',
        repo_url: '',
        mrr_range: '$0',
        target_market: '',
        screenshots: [],
        tags: [],
        cover_url: '',
        asking_price: undefined,
        acquisition_rationale: '',
        save_as_draft: false
      });
      setStep(1);
    }
  };

  // Final Form Submit handler
  const onSubmit = async (data: any) => {
    setIsSubmittingForm(true);
    try {
      console.log("[SUBMITTING FORM] sending fields to API:", data);

      // 1. Submit to server-side API POST /api/products
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          tagline: data.tagline,
          description: data.description,
          logoUrl: data.logoUrl,
          coverUrl: data.cover_url || undefined,
          status: data.status,
          primaryStack: data.primary_stack,
          demoUrl: data.demo_url || undefined,
          repoUrl: data.repo_url || undefined,
          mrrRange: data.mrr_range + "/mo",
          targetMarket: data.target_market || undefined,
          tags: data.tags,
          screenshots: data.screenshots,
          askingPrice: data.asking_price,
          acquisitionRationale: data.acquisition_rationale,
          isPublished: !data.save_as_draft,
        }),
      });

      const result = await response.json();
      console.log("[SERVER RESPONSE] received:", result);

      // 2. Feed back to local client state context (so they immediately see their product in the feed/explorer)
      submitProduct({
        name: data.name,
        tagline: data.tagline,
        description: data.description,
        logoUrl: data.logoUrl,
        coverUrl: data.cover_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&h=450&q=80',
        status: data.status,
        primaryStack: data.primary_stack,
        demoUrl: data.demo_url || undefined,
        repoUrl: data.repo_url || undefined,
        mrrRange: data.mrr_range + "/mo",
        targetMarket: data.target_market || undefined,
        tags: data.tags,
        screenshots: data.screenshots.length > 0 ? data.screenshots : [data.cover_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&h=450&q=80'],
        askingPrice: data.status === 'for_sale' ? data.asking_price : undefined,
        acquisitionRationale: data.status === 'for_sale' ? data.acquisition_rationale : undefined,
        isPublished: !data.save_as_draft
      });

      setSubmissionData(result.product || data);
      setIsSubmitted(true);
      
      // Clear draft storage
      localStorage.removeItem('mss_product_form_draft');
      localStorage.removeItem('mss_product_form_step');
    } catch (err: any) {
      console.error("Form submission failed:", err);
      alert("Submission API request failed, syncing locally to memory instead. Details: " + err.message);
      
      // Fallback submission to local AppContext so user workflow is unbroken
      submitProduct({
        name: data.name,
        tagline: data.tagline,
        description: data.description,
        logoUrl: data.logoUrl,
        coverUrl: data.cover_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&h=450&q=80',
        status: data.status,
        primaryStack: data.primary_stack,
        demoUrl: data.demo_url || undefined,
        repoUrl: data.repo_url || undefined,
        mrrRange: data.mrr_range + "/mo",
        targetMarket: data.target_market || undefined,
        tags: data.tags,
        screenshots: data.screenshots.length > 0 ? data.screenshots : [data.cover_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&h=450&q=80'],
        askingPrice: data.status === 'for_sale' ? data.asking_price : undefined,
        acquisitionRationale: data.status === 'for_sale' ? data.acquisition_rationale : undefined,
        isPublished: !data.save_as_draft
      });
      setIsSubmitted(true);
      localStorage.removeItem('mss_product_form_draft');
      localStorage.removeItem('mss_product_form_step');
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Quick helper to determine visual status badges on previews
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'stealth': return 'Stealth';
      case 'beta': return 'Beta';
      case 'live': return 'Live';
      case 'paused': return 'Paused';
      case 'for_sale': return '💰 For Sale';
      default: return status;
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-950 border border-slate-800 rounded-2xl p-8 md:p-12 space-y-6 shadow-2xl relative"
        >
          <div className="w-16 h-16 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Product Submission Successful!
            </h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
              Your micro-SaaS <strong className="text-white">"{submissionData?.name || nameField}"</strong> has been indexed. It is now spinning inside the global swipe card cycle for our builders.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-900 rounded-xl p-4 text-left text-xs space-y-2.5 max-w-md mx-auto font-mono">
            <div className="flex justify-between border-b border-slate-800/60 pb-1.5 text-slate-500">
              <span>METRIC SUMMARY</span>
              <span className="text-indigo-400">STATUS: SUCCESS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Product slug:</span>
              <span className="text-white">{(submissionData?.name || nameField).toLowerCase().replace(/[^a-z0-9]+/g, '-')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">MRR Tier:</span>
              <span className="text-emerald-400">{mrrRangeField}/mo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Listed as:</span>
              <span className="text-white">{watch('save_as_draft') ? 'Draft (Private)' : 'Published Live'}</span>
            </div>
          </div>

          <div className="pt-4 flex justify-center gap-4">
            <button
              onClick={() => setActiveView('explore')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-indigo-600/10 transition active:scale-95 cursor-pointer"
            >
              Explore Products Deck
            </button>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setSubmissionData(null);
                setStep(1);
                reset();
              }}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-mono text-xs font-bold px-5 py-3.5 rounded-xl transition cursor-pointer"
            >
              Submit Another Product
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 text-left">
      
      {/* Alert if Supabase storage is unconfigured as a helpful informational guide */}
      {!isSupabaseConfigured && (
        <div className="mb-6 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3 text-xs text-amber-300">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold">Sandbox Environment File Upload Mode</h4>
            <p className="leading-relaxed opacity-90">
              No custom Supabase API variables detected in <code className="bg-amber-950 px-1 py-0.5 rounded text-amber-200">.env.local</code>. Logos and screenshots will fall back to local high-fidelity Base64 Data-URLs instantly so you can build, preview, and test the form deck cycle flawlessly!
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Progress Navigation Header Card */}
        <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 md:p-6 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono text-indigo-400 tracking-widest font-black uppercase">
                Step {step} of 5
              </span>
              <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                {step === 1 && "Basic Product Identity"}
                {step === 2 && "SaaS Core Details"}
                {step === 3 && "Media & Visual Identity"}
                {step === 4 && "💰 Acquisition Pricing Terms"}
                {step === 5 && "Review and SHIP!"}
              </h2>
            </div>

            {/* Clear draft option if draft exists in fields */}
            {(nameField || taglineField) && (
              <button
                type="button"
                onClick={handleClearDraft}
                className="self-start sm:self-center bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white text-[10px] font-mono px-3 py-1.5 rounded-lg transition"
              >
                Reset Form
              </button>
            )}
          </div>

          {/* Graphical Progress Bar Indicator */}
          <div className="mt-5 space-y-2">
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="bg-indigo-500 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(99,102,241,0.6)]" 
                style={{ width: `${(step / 5) * 100}%` }} 
              />
            </div>
            
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
              <span className={step >= 1 ? "text-indigo-400 font-bold" : ""}>1. Basic</span>
              <span className={step >= 2 ? "text-indigo-400 font-bold" : ""}>2. Details</span>
              <span className={step >= 3 ? "text-indigo-400 font-bold" : ""}>3. Media</span>
              <span className={step >= 4 ? "text-indigo-400 font-bold" : ""}>4. Sale {statusField !== 'for_sale' && <span className="text-slate-600">(Skip)</span>}</span>
              <span className={step >= 5 ? "text-indigo-400 font-bold" : ""}>5. Review</span>
            </div>
          </div>
        </div>

        {/* Form Steps container card */}
        <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 md:p-8 shadow-2xl min-h-[380px] relative">
          
          <AnimatePresence mode="wait">
            {/* STEP 1: BASIC INFO */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="border-b border-slate-900 pb-3 mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-400 fill-indigo-400/10" />
                    <span>Basic Information</span>
                  </h3>
                  <p className="text-xs text-slate-500">Establish the initial elevator pitch card parameters for the solo community.</p>
                </div>

                <div className="grid md:grid-cols-12 gap-5">
                  {/* Name field */}
                  <div className="md:col-span-8 space-y-1.5">
                    <label className="text-xs font-mono text-slate-400 flex justify-between">
                      <span>Product Name <span className="text-indigo-400">*</span></span>
                      <span className="text-[10px] text-slate-600">Max 60</span>
                    </label>
                    <input
                      type="text"
                      {...register('name')}
                      placeholder="e.g. Krostio"
                      className="w-full bg-[#030712] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                    {errors.name && (
                      <p className="text-[11px] font-mono text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Status Selection */}
                  <div className="md:col-span-4 space-y-1.5">
                    <label className="text-xs font-mono text-slate-400">
                      Product Status
                    </label>
                    <select
                      {...register('status')}
                      className="w-full bg-[#030712] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none cursor-pointer"
                    >
                      <option value="beta">Beta / Sandbox</option>
                      <option value="live">Live / Active</option>
                      <option value="stealth">Stealth Mode</option>
                      <option value="paused">Paused</option>
                      <option value="for_sale">💰 For Sale / Acquisition</option>
                    </select>
                  </div>
                </div>

                {/* Tagline / One-liner with char counter */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400 flex justify-between">
                    <span>One-Liner / Tagline <span className="text-indigo-400">*</span></span>
                    <span className={`text-[10px] font-mono ${taglineField?.length > 120 ? 'text-rose-400' : 'text-slate-500'}`}>
                      {taglineField?.length || 0} / 120 chars
                    </span>
                  </label>
                  <input
                    type="text"
                    {...register('tagline')}
                    placeholder="e.g. Elegant single-click feedback widgets you can drop into any SaaS project"
                    className="w-full bg-[#030712] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                  {errors.tagline && (
                    <p className="text-[11px] font-mono text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.tagline.message}
                    </p>
                  )}
                </div>

                {/* Logo Upload Drag and Drop zone with Preview */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-400">
                    SaaS Logo / Avatar (Image or high-quality Icon, Max 2MB) <span className="text-indigo-400">*</span>
                  </label>
                  
                  <div className="grid sm:grid-cols-12 gap-4 items-center">
                    
                    {/* Visual Preview panel */}
                    <div className="sm:col-span-4 flex justify-center p-4 bg-slate-900/40 border border-slate-800 rounded-2xl h-28 items-center relative overflow-hidden group">
                      {logoUrlField ? (
                        <div className="text-center">
                          {logoUrlField.length < 5 ? (
                            <span className="text-4xl">{logoUrlField}</span>
                          ) : (
                            <img src={logoUrlField} alt="Logo preview" className="w-16 h-16 rounded-xl object-cover ring-2 ring-indigo-500/30" />
                          )}
                          <button
                            type="button"
                            onClick={() => setValue('logoUrl', '')}
                            className="absolute top-1.5 right-1.5 w-5 h-5 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white rounded-full flex items-center justify-center text-xs"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-slate-600 flex flex-col items-center">
                          <Code className="w-8 h-8 opacity-40 mb-1" />
                          <span className="text-[10px] font-mono">No Logo</span>
                        </div>
                      )}
                    </div>

                    {/* Drag Zone */}
                    <div 
                      onDragOver={(e) => { e.preventDefault(); setIsLogoDragOver(true); }}
                      onDragLeave={() => setIsLogoDragOver(false)}
                      onDrop={async (e) => {
                        e.preventDefault();
                        setIsLogoDragOver(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) await uploadLogoFile(file);
                      }}
                      className={`sm:col-span-8 border-2 border-dashed rounded-2xl p-5 text-center transition cursor-pointer relative h-28 flex flex-col justify-center items-center ${
                        isLogoDragOver 
                          ? 'border-indigo-500 bg-indigo-500/5' 
                          : 'border-slate-800 bg-slate-900/10 hover:border-slate-700'
                      }`}
                      onClick={() => document.getElementById('logo_input_field')?.click()}
                    >
                      <input 
                        type="file" 
                        id="logo_input_field" 
                        className="hidden" 
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) await uploadLogoFile(file);
                        }}
                      />
                      
                      {isLogoUploading ? (
                        <div className="space-y-1.5 flex flex-col items-center">
                          <Clock className="w-5 h-5 text-indigo-400 animate-spin" />
                          <span className="text-xs font-mono text-indigo-300">Uploading to product-logos/ bucket...</span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <Upload className="w-5 h-5 text-slate-500 mx-auto" />
                          <p className="text-xs text-slate-300">
                            <span className="text-indigo-400 font-bold">Click to upload</span> or drag logo here
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono">JPG, PNG, WebP or SVG up to 2MB</p>
                        </div>
                      )}
                    </div>

                  </div>

                  {errors.logoUrl && (
                    <p className="text-[11px] font-mono text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.logoUrl.message}
                    </p>
                  )}

                  {/* Quick preset symbols block as a creative convenience */}
                  <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] font-mono text-slate-500">Or pick a symbol:</span>
                    {['⚡', '🚀', '🤖', '💰', '🔑', '🎨', '🔥', '📦', '🌍', '📊'].map(sym => (
                      <button
                        key={sym}
                        type="button"
                        onClick={() => setValue('logoUrl', sym, { shouldValidate: true })}
                        className={`w-7 h-7 rounded bg-slate-900 hover:bg-slate-800 border text-sm flex items-center justify-center transition ${
                          logoUrlField === sym ? 'border-indigo-500 text-white' : 'border-slate-800 text-slate-400'
                        }`}
                      >
                        {sym}
                      </button>
                    ))}
                  </div>

                </div>

              </motion.div>
            )}

            {/* STEP 2: DETAILS */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="border-b border-slate-900 pb-3 mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Laptop className="w-5 h-5 text-indigo-400" />
                    <span>SaaS Core Details</span>
                  </h3>
                  <p className="text-xs text-slate-500">Describe your product's value proposition, stack, monetization targets, and target audience.</p>
                </div>

                {/* Markdown Editor */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400 flex justify-between">
                    <span>Full Markdown Pitch Description <span className="text-indigo-400">*</span></span>
                    <span className="text-[10px] text-slate-500">HTML tags are stripped for security</span>
                  </label>
                  
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <div data-color-mode="dark" className="overflow-hidden rounded-xl border border-slate-800">
                        <MDEditor
                          value={field.value}
                          onChange={(val) => field.onChange(val || '')}
                          preview="edit"
                          height={200}
                          style={{ background: '#030712' }}
                        />
                      </div>
                    )}
                  />
                  {errors.description && (
                    <p className="text-[11px] font-mono text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Custom Technology Stack Input with preset chips */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-400 flex justify-between">
                    <span>Primary Tech Stack <span className="text-indigo-400">*</span></span>
                    <span className="text-[10px] text-slate-500">Press Enter or Comma to add</span>
                  </label>

                  {/* Active tags container */}
                  <div className="flex flex-wrap gap-1.5 p-2.5 bg-[#030712] border border-slate-800 rounded-xl min-h-[44px]">
                    {primaryStackField.length === 0 ? (
                      <span className="text-xs text-slate-600 font-mono self-center px-1">No items added. Add some below.</span>
                    ) : (
                      primaryStackField.map((tech, idx) => (
                        <span key={tech} className="px-2 py-1 bg-indigo-950/40 border border-indigo-900/40 rounded-lg text-xs text-indigo-300 flex items-center gap-1.5">
                          <span>{tech}</span>
                          <button 
                            type="button" 
                            onClick={() => handleRemoveStackChip(idx)} 
                            className="hover:text-red-400 font-bold transition text-[11px]"
                          >
                            ×
                          </button>
                        </span>
                      ))
                    )}
                  </div>

                  {/* Input field with presets trigger */}
                  <div className="relative">
                    <input
                      type="text"
                      value={stackInputValue}
                      onChange={(e) => setStackInputValue(e.target.value)}
                      onKeyDown={handleStackInputKeyDown}
                      onFocus={() => setShowStackPresets(true)}
                      onBlur={() => setTimeout(() => setShowStackPresets(false), 250)}
                      placeholder="Add stack item (e.g. Next.js, FastAPI)"
                      className="w-full bg-[#030712] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />

                    {/* Presets float panel */}
                    {showStackPresets && (
                      <div className="absolute top-11 left-0 right-0 bg-slate-950 border border-slate-800 rounded-xl p-3 shadow-2xl z-30 space-y-2 max-h-[140px] overflow-y-auto">
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Suggested stacks:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {STACK_SUGGESTIONS.map(tech => {
                            const isAdded = primaryStackField.includes(tech);
                            return (
                              <button
                                key={tech}
                                type="button"
                                onMouseDown={() => handleAddStackChip(tech)}
                                disabled={isAdded}
                                className={`px-2 py-0.5 rounded text-[10px] font-mono transition border ${
                                  isAdded 
                                    ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed' 
                                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white'
                                }`}
                              >
                                + {tech}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.primary_stack && (
                    <p className="text-[11px] font-mono text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.primary_stack.message}
                    </p>
                  )}
                </div>

                {/* Demo and Github repo URL Row */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-slate-500" />
                      <span>Live Demo URL <span className="text-[10px] text-slate-500">(Optional)</span></span>
                    </label>
                    <input
                      type="url"
                      {...register('demo_url')}
                      placeholder="https://krostio.com"
                      className="w-full bg-[#030712] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                    {errors.demo_url && (
                      <p className="text-[11px] font-mono text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.demo_url.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Code className="w-3.5 h-3.5 text-slate-500" />
                      <span>Repository URL <span className="text-[10px] text-slate-500">(Optional)</span></span>
                    </label>
                    <input
                      type="url"
                      {...register('repo_url')}
                      placeholder="https://github.com/skeedo/krostio"
                      className="w-full bg-[#030712] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                    {errors.repo_url && (
                      <p className="text-[11px] font-mono text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.repo_url.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* MRR Range Select and Target Market input */}
                <div className="grid sm:grid-cols-12 gap-4">
                  
                  <div className="sm:col-span-4 space-y-1.5">
                    <label className="text-xs font-mono text-slate-400">MRR Range Estimate</label>
                    <select
                      {...register('mrr_range')}
                      className="w-full bg-[#030712] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none cursor-pointer"
                    >
                      <option value="$0">$0 / month</option>
                      <option value="$0–$200">$0–$200 / month</option>
                      <option value="$200–$500">$200–$500 / month</option>
                      <option value="$500–$1K">$500–$1K / month</option>
                      <option value="$1K–$5K">$1K–$5K / month</option>
                      <option value="$5K+">$5K+ / month</option>
                    </select>
                  </div>

                  <div className="sm:col-span-8 space-y-1.5">
                    <label className="text-xs font-mono text-slate-400 flex justify-between">
                      <span>Target Market <span className="text-[10px] text-slate-500">(Optional)</span></span>
                      <span className="text-[10px] text-slate-600">Max 100</span>
                    </label>
                    <input
                      type="text"
                      {...register('target_market')}
                      placeholder="e.g. Solo developers, creators, marketing teams"
                      className="w-full bg-[#030712] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                    {errors.target_market && (
                      <p className="text-[11px] font-mono text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.target_market.message}
                      </p>
                    )}
                  </div>

                </div>

              </motion.div>
            )}

            {/* STEP 3: MEDIA & TAGS */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="border-b border-slate-900 pb-3 mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Tag className="w-5 h-5 text-indigo-400" />
                    <span>Media & Categories</span>
                  </h3>
                  <p className="text-xs text-slate-500">Provide screenshots, configure tags, and upload a beautiful deck cover image background.</p>
                </div>

                {/* Predefined Categories Multi-select with badge list */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-400 flex justify-between">
                    <span>Select category tags (Max 5, current: {tagsField.length}) <span className="text-indigo-400">*</span></span>
                    <span className="text-[10px] text-slate-500">Click to toggle</span>
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {PREDEFINED_TAGS.map(t => {
                      const selected = tagsField.includes(t);
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => handleToggleTag(t)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition flex items-center gap-1 ${
                            selected 
                              ? 'bg-indigo-500/10 border-indigo-500 text-white shadow-[0_0_8px_rgba(99,102,241,0.2)]' 
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <span>#{t}</span>
                          {selected && <Check className="w-3 h-3 text-indigo-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                  {errors.tags && (
                    <p className="text-[11px] font-mono text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.tags.message}
                    </p>
                  )}
                </div>

                {/* Cover Image Upload drag and drop */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400">
                    Background Cover Image URL <span className="text-[10px] text-slate-500">(Optional background for swipe cards)</span>
                  </label>
                  
                  <div className="grid sm:grid-cols-12 gap-4">
                    {/* Visual Preview */}
                    <div className="sm:col-span-5 h-24 bg-slate-900/40 border border-slate-800 rounded-xl relative overflow-hidden group flex items-center justify-center">
                      {coverUrlField ? (
                        <>
                          <img src={coverUrlField} alt="Cover Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setValue('cover_url', '')}
                            className="absolute top-1 right-1 w-5 h-5 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white rounded-full flex items-center justify-center text-xs"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </>
                      ) : (
                        <div className="text-center text-slate-600 text-[10px] font-mono">
                          No cover image uploaded
                        </div>
                      )}
                    </div>

                    {/* Drag drop zone */}
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsCoverDragOver(true); }}
                      onDragLeave={() => setIsCoverDragOver(false)}
                      onDrop={async (e) => {
                        e.preventDefault();
                        setIsCoverDragOver(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) await uploadCoverFile(file);
                      }}
                      onClick={() => document.getElementById('cover_file_field')?.click()}
                      className={`sm:col-span-7 border-2 border-dashed rounded-xl text-center flex flex-col justify-center items-center h-24 cursor-pointer transition ${
                        isCoverDragOver 
                          ? 'border-indigo-500 bg-indigo-500/5' 
                          : 'border-slate-800 bg-slate-900/10 hover:border-slate-700'
                      }`}
                    >
                      <input 
                        type="file" 
                        id="cover_file_field" 
                        className="hidden" 
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) await uploadCoverFile(file);
                        }}
                      />

                      {isCoverUploading ? (
                        <Clock className="w-5 h-5 text-indigo-400 animate-spin" />
                      ) : (
                        <div className="space-y-0.5">
                          <Upload className="w-4 h-4 text-slate-500 mx-auto" />
                          <p className="text-[11px] text-slate-300">
                            <span className="text-indigo-400 font-bold">Upload Cover</span> or drag here
                          </p>
                          <p className="text-[9px] text-slate-500 font-mono">Max 5MB</p>
                        </div>
                      )}
                    </div>
                  </div>
                  {errors.cover_url && (
                    <p className="text-[11px] font-mono text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.cover_url.message}
                    </p>
                  )}
                </div>

                {/* Screenshots Batch Upload Drag and Drop zone with horizontal drag to reorder and indicators */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-400 flex justify-between">
                    <span>Screenshots Portfolio (Up to 6 images, each Max 5MB)</span>
                    <span className="text-[10px] text-indigo-400">Drag items or use arrows to reorder!</span>
                  </label>

                  <div 
                    onDragOver={(e) => { e.preventDefault(); setIsScreenshotsDragOver(true); }}
                    onDragLeave={() => setIsScreenshotsDragOver(false)}
                    onDrop={async (e) => {
                      e.preventDefault();
                      setIsScreenshotsDragOver(false);
                      const files = e.dataTransfer.files;
                      if (files && files.length > 0) await uploadScreenshotFiles(files);
                    }}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition min-h-[90px] flex flex-col justify-center items-center ${
                      isScreenshotsDragOver 
                        ? 'border-indigo-500 bg-indigo-500/5' 
                        : 'border-slate-800 bg-slate-900/10 hover:border-slate-700'
                    }`}
                    onClick={() => document.getElementById('screenshots_input_field')?.click()}
                  >
                    <input 
                      type="file" 
                      id="screenshots_input_field" 
                      className="hidden" 
                      multiple 
                      accept="image/*"
                      onChange={async (e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) await uploadScreenshotFiles(files);
                      }}
                    />

                    {isScreenshotsUploading ? (
                      <div className="space-y-1">
                        <Clock className="w-5 h-5 text-indigo-400 animate-spin" />
                        <span className="text-xs font-mono text-indigo-300">Uploading multiple assets to product-media/...</span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Upload className="w-5 h-5 text-slate-500 mx-auto" />
                        <p className="text-xs text-slate-300">
                          <span className="text-indigo-400 font-bold">Add screenshot(s)</span> or drag them here
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono">Select multiple images up to 5MB each (limit 6)</p>
                      </div>
                    )}
                  </div>

                  {/* Screenshots reordering list layout */}
                  {screenshotsField.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-3">
                      {screenshotsField.map((url, idx) => (
                        <div
                          key={idx}
                          draggable
                          onDragStart={() => handleScreenshotDragStart(idx)}
                          onDragOver={(e) => handleScreenshotDragOver(e, idx)}
                          onDrop={() => handleScreenshotDrop(idx)}
                          className={`relative aspect-video rounded-lg border border-slate-800 overflow-hidden bg-slate-900 select-none group cursor-grab active:cursor-grabbing transition-transform ${
                            dragIndex === idx ? 'opacity-40 scale-95 border-indigo-500' : 'hover:border-slate-600'
                          }`}
                        >
                          <img src={url} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                          
                          {/* Badge Number */}
                          <div className="absolute top-1 left-1 bg-slate-950/80 border border-slate-800 text-[9px] font-mono font-black text-indigo-400 px-1 rounded">
                            {idx + 1}
                          </div>

                          {/* Close button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setValue('screenshots', screenshotsField.filter((_, i) => i !== idx), { shouldValidate: true });
                            }}
                            className="absolute top-1 right-1 w-4 h-4 bg-rose-950/90 hover:bg-rose-600 text-rose-300 hover:text-white rounded-full flex items-center justify-center text-[10px] transition opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>

                          {/* Reordering buttons overlay for mobile/touch usability */}
                          <div className="absolute bottom-1 left-1 right-1 flex justify-between bg-slate-950/70 border border-slate-800/40 rounded px-1 py-0.5 opacity-0 group-hover:opacity-100 transition duration-150">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={(e) => { e.stopPropagation(); moveScreenshot(idx, 'left'); }}
                              className="text-slate-400 hover:text-indigo-400 disabled:opacity-30 disabled:hover:text-slate-400"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === screenshotsField.length - 1}
                              onClick={(e) => { e.stopPropagation(); moveScreenshot(idx, 'right'); }}
                              className="text-slate-400 hover:text-indigo-400 disabled:opacity-30 disabled:hover:text-slate-400"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.screenshots && (
                    <p className="text-[11px] font-mono text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.screenshots.message}
                    </p>
                  )}
                </div>

              </motion.div>
            )}

            {/* STEP 4: ACQUISITION TERMS (ONLY IF STATUS = FOR_SALE) */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                {statusField !== 'for_sale' ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                      <Info className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">Acquisition Details Bypassed</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        This product is not currently listed as "For Sale". You can safely skip this step using the buttons below.
                      </p>
                    </div>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(5)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold px-4 py-2 rounded-lg"
                      >
                        Proceed to Review (Step 5)
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="border-b border-slate-900 pb-3 mb-4">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-amber-500" />
                        <span>Acquisition Pricing & Rationale</span>
                      </h3>
                      <p className="text-xs text-slate-500">Provide asking price structures and acquisition details for prospective buyers.</p>
                    </div>

                    {/* Asking price input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400">Asking Price (USD) <span className="text-indigo-400">*</span></label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 font-mono text-sm">
                          $
                        </div>
                        <Controller
                          name="asking_price"
                          control={control}
                          render={({ field }) => (
                            <input
                              type="number"
                              value={field.value || ''}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                              placeholder="e.g. 3500"
                              className="w-full bg-[#030712] border border-slate-800 rounded-xl pl-8 pr-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                          )}
                        />
                      </div>
                      {errors.asking_price && (
                        <p className="text-[11px] font-mono text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.asking_price.message}
                        </p>
                      )}
                    </div>

                    {/* Rationale Textarea with Char Counter */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 flex justify-between">
                        <span>Acquisition Rationale & Terms <span className="text-indigo-400">*</span></span>
                        <span className={`text-[10px] font-mono ${acquisitionRationaleField?.length > 500 ? 'text-rose-400' : 'text-slate-500'}`}>
                          {acquisitionRationaleField?.length || 0} / 500 chars
                        </span>
                      </label>
                      <textarea
                        {...register('acquisition_rationale')}
                        rows={5}
                        placeholder="Explain why you are selling, what assets are included (IP, code repository, database, domain, customer list, custom support), and expansion or potential revenue trajectories."
                        className="w-full bg-[#030712] border border-slate-800 rounded-xl p-4 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                      {errors.acquisition_rationale && (
                        <p className="text-[11px] font-mono text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.acquisition_rationale.message}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* STEP 5: REVIEW & PUBLISH */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="border-b border-slate-900 pb-3 mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                    <span>Review and SHIP!</span>
                  </h3>
                  <p className="text-xs text-slate-500">Look over your entries to ensure accuracy before introducing your SaaS to the community.</p>
                </div>

                {/* High Fidelity Card Preview of the swipe-first item */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">SWIPE CARD PREVIEW:</span>
                  
                  <div className="max-w-[340px] mx-auto aspect-[4/5] bg-[#070b19] border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col justify-between relative overflow-hidden text-left ring-1 ring-indigo-500/20">
                    
                    {/* Background cover image preview */}
                    {coverUrlField && (
                      <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
                        <img src={coverUrlField} alt="Cover Bg preview" className="w-full h-full object-cover filter blur-[2px]" />
                      </div>
                    )}

                    <div className="space-y-3.5 z-10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-lg">
                            {logoUrlField ? (
                              logoUrlField.length < 5 ? logoUrlField : <img src={logoUrlField} className="w-7 h-7 rounded-lg object-cover" />
                            ) : '🚀'}
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-100 font-mono tracking-tight flex items-center gap-1">
                              {nameField || 'Unnamed Product'}
                            </h4>
                            <p className="text-[8px] text-slate-500 font-mono">by @you</p>
                          </div>
                        </div>

                        <span className="bg-indigo-950/85 text-indigo-400 border border-indigo-900/40 text-[8px] font-mono px-2 py-0.5 rounded-md uppercase tracking-wider font-bold">
                          {statusField === 'for_sale' ? `💰 FOR SALE` : getStatusLabel(statusField)}
                        </span>
                      </div>

                      {/* Pitch tagline */}
                      <p className="text-[11px] text-slate-300 leading-normal min-h-[50px] italic">
                        &ldquo;{taglineField || 'A stunning single-click SaaS startup platform waiting for validation.'}&rdquo;
                      </p>

                      {/* Primary Stack */}
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {primaryStackField.length === 0 ? (
                            <span className="text-[9px] font-mono text-slate-600">No stack specified</span>
                          ) : (
                            primaryStackField.map(t => (
                              <span key={t} className="bg-slate-900/80 border border-slate-800 text-[8px] font-mono px-1.5 py-0.5 rounded text-slate-400">
                                {t}
                              </span>
                            ))
                          )}
                        </div>

                        {/* Extra indicators */}
                        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                          <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-500/10">
                            <DollarSign className="w-3 h-3" />
                            <span>MRR: {mrrRangeField}/mo</span>
                          </div>
                          {targetMarketField && (
                            <div className="truncate text-slate-400 max-w-[130px]">
                              target: {targetMarketField}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-900 pt-3 mt-1 text-[9px] font-mono text-slate-500 z-10">
                      <div className="flex gap-2">
                        <span>❤️ Upvotes: 1</span>
                        <span>💬 Chats: 0</span>
                      </div>
                      <span className="text-indigo-400 flex items-center gap-0.5">
                        Swipe Right <ChevronRight className="w-2.5 h-2.5" />
                      </span>
                    </div>

                  </div>
                </div>

                {/* Grid checklist summary of other fields */}
                <div className="bg-slate-900/30 border border-slate-900 rounded-xl p-4 md:p-5 space-y-4 text-xs font-mono text-slate-400">
                  <div className="flex justify-between border-b border-slate-800/60 pb-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    <span>Summary Review Checklist</span>
                    <span className="text-indigo-400">Step 5 validation passed</span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="text-slate-500 block">DEMO & CODE WORKSPACE:</span>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="text-slate-300 truncate">{demoUrlField || 'No demo provided'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Code className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="text-slate-300 truncate">{repoUrlField || 'No repo URL provided'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-slate-500 block">PORTFOLIO & CATEGORIES:</span>
                      <div className="space-y-1">
                        <div>
                          <span className="text-slate-300 font-bold">{screenshotsField.length}</span> screenshots uploaded
                        </div>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {tagsField.map(tag => (
                            <span key={tag} className="text-[10px] bg-indigo-950/30 text-indigo-400 px-1 rounded">#{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {statusField === 'for_sale' && (
                    <div className="border-t border-slate-800/60 pt-3 space-y-1 bg-yellow-500/5 p-3 rounded-lg border border-yellow-500/10">
                      <div className="flex justify-between text-yellow-500 font-bold text-[10px]">
                        <span>💰 ACQUISITION TERMS</span>
                        <span>ASKING PRICE: ${askingPriceField?.toLocaleString()} USD</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed italic line-clamp-2">
                        &ldquo;{acquisitionRationaleField}&rdquo;
                      </p>
                    </div>
                  )}
                </div>

                {/* Save Draft Toggle slider */}
                <div className="flex items-center justify-between p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold font-mono text-white flex items-center gap-1.5">
                      <span>Draft Mode Status</span>
                      <Save className="w-3.5 h-3.5 text-slate-400" />
                    </h4>
                    <p className="text-[11px] text-slate-500">If checked, product remains in draft and isn't published to the swipe deck instantly.</p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      {...register('save_as_draft')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 peer-checked:after:bg-white" />
                  </label>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

          {/* Error alerts container inside body */}
          {Object.keys(errors).length > 0 && (
            <div className="mt-4 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl space-y-1 text-xs">
              <span className="font-bold flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Form Submission Errors:</span>
              </span>
              <ul className="list-disc pl-5 font-mono text-[11px] space-y-0.5 opacity-90">
                {errors.name && <li>Name: {errors.name.message}</li>}
                {errors.tagline && <li>Tagline: {errors.tagline.message}</li>}
                {errors.logoUrl && <li>Logo: {errors.logoUrl.message}</li>}
                {errors.description && <li>Description: {errors.description.message}</li>}
                {errors.primary_stack && <li>Stack: {errors.primary_stack.message}</li>}
                {errors.demo_url && <li>Demo URL: {errors.demo_url.message}</li>}
                {errors.repo_url && <li>Repo URL: {errors.repo_url.message}</li>}
                {errors.tags && <li>Tags: {errors.tags.message}</li>}
                {errors.asking_price && <li>Asking Price: {errors.asking_price.message}</li>}
                {errors.acquisition_rationale && <li>Rationale: {errors.acquisition_rationale.message}</li>}
              </ul>
            </div>
          )}

        </div>

        {/* Dynamic actions navigation bar */}
        <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-900 rounded-2xl">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1.5 transition active:scale-95 hover:bg-slate-900/50 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setActiveView('explore')}
              className="px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-mono text-slate-500 hover:text-slate-300 transition active:scale-95 cursor-pointer"
            >
              Cancel
            </button>
          )}

          {/* Logic to either proceed to next step or submit */}
          {step < 5 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition active:scale-95 shadow-lg shadow-indigo-600/10 cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmittingForm}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-mono text-xs font-black px-6 py-3 rounded-xl flex items-center gap-1.5 transition active:scale-95 shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              {isSubmittingForm ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>PUBLISHING...</span>
                </>
              ) : (
                <>
                  <span>{watch('save_as_draft') ? 'SAVE AS DRAFT' : 'SHIP PRODUCT NOW'}</span>
                  <Check className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>

      </form>
    </div>
  );
};
