import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

// Safely verify if credentials are set and not placeholder values
export const isSupabaseConfigured = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-anon-key')
);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

/**
 * Uploads a file to a specified Supabase storage bucket (product-logos or product-media).
 * Falls back gracefully to base64 Data URLs if Supabase is not configured or the upload fails.
 */
export async function uploadFileToBucket(
  file: File, 
  bucketName: 'product-logos' | 'product-media'
): Promise<string> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn(`[Supabase Storage] Config not detected or invalid. Falling back to local Base64/DataURL format for preview and storage.`);
    return convertFileToBase64(file);
  }

  const fileExt = file.name.split('.').pop() || 'png';
  const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`;
  
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(cleanFileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      // If error occurs (e.g. bucket doesn't exist), throw to catch block for fallback
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(cleanFileName);

    return publicUrl;
  } catch (err: any) {
    console.error(`[Supabase Storage] Upload failed for ${file.name}. Error:`, err.message || err);
    console.info('[Supabase Storage] Defaulting to Base64 dataURL fallback.');
    return convertFileToBase64(file);
  }
}

/**
 * Helper to convert file to Base64 String
 */
function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
