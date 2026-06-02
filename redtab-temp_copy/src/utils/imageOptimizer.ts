/**
 * Client-side image optimization utility
 * Resizes and compresses images before upload to reduce bandwidth and storage
 */
import { DEFAULT_CURRENCY_LOCALE } from '@/constants/currency';

export interface ImageOptimizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0-1 for JPEG/WebP
  format?: 'image/jpeg' | 'image/webp' | 'image/png';
}

const DEFAULT_OPTIONS: Required<ImageOptimizeOptions> = {
  maxWidth: 1024,
  maxHeight: 1024,
  quality: 0.85,
  format: 'image/webp',
};

/**
 * Optimize an image file by resizing and compressing
 * @param file - The original image file
 * @param options - Optimization options
 * @returns Promise<File> - Optimized image file
 */
export async function optimizeImage(
  file: File,
  options: ImageOptimizeOptions = {},
): Promise<File> {
  // Only process images
  if (!file.type.startsWith('image/')) {
    return file;
  }

  // Skip if already small enough (under 100KB)
  if (file.size < 100 * 1024) {
    return file;
  }

  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Check WebP support, fallback to JPEG
  if (opts.format === 'image/webp' && !supportsWebP()) {
    opts.format = 'image/jpeg';
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      try {
        // Calculate new dimensions maintaining aspect ratio
        let { width, height } = img;

        if (width > opts.maxWidth || height > opts.maxHeight) {
          const ratio = Math.min(
            opts.maxWidth / width,
            opts.maxHeight / height,
          );
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;

        if (!ctx) {
          resolve(file);
          return;
        }

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            // If optimized is larger, use original
            if (blob.size >= file.size) {
              resolve(file);
              return;
            }

            // Create new file with proper extension
            const ext = opts.format === 'image/webp' ? '.webp' :
                        opts.format === 'image/png' ? '.png' : '.jpg';
            const baseName = file.name.replace(/\.[^.]+$/, '');
            const newFile = new File([blob], `${baseName}${ext}`, {
              type: opts.format,
              lastModified: Date.now(),
            });

            resolve(newFile);
          },
          opts.format,
          opts.quality,
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      // If image fails to load, return original
      resolve(file);
    };

    // Create object URL and load image
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Optimize image specifically for avatar use (smaller dimensions)
 */
export async function optimizeAvatar(file: File): Promise<File> {
  return optimizeImage(file, {
    maxWidth: 512,
    maxHeight: 512,
    quality: 0.9,
    format: 'image/webp',
  });
}

/**
 * Optimize image for thumbnail use
 */
export async function optimizeThumbnail(file: File): Promise<File> {
  return optimizeImage(file, {
    maxWidth: 200,
    maxHeight: 200,
    quality: 0.8,
    format: 'image/webp',
  });
}

/**
 * Check if browser supports WebP
 */
function supportsWebP(): boolean {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').startsWith('data:image/webp');
}

/**
 * Get image dimensions without loading full image
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image'));
    };
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toLocaleString(DEFAULT_CURRENCY_LOCALE, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} KB`;
  return `${(bytes / (1024 * 1024)).toLocaleString(DEFAULT_CURRENCY_LOCALE, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MB`;
}
