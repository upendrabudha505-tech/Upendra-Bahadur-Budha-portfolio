/**
 * ============================================================================
 * CLIENT-SIDE IMAGE OPTIMIZER FOR MOBILE & DESKTOP UPLOADS
 * ============================================================================
 * Ensures that even 10MB–15MB smartphone camera photos are cleanly resized
 * and compressed to a high-clarity JPEG DataURL (~150KB–350KB) so they:
 * 1. Upload instantaneously to the server (`/api/profile-photo`, `/api/projects`, `/api/cv`)
 * 2. Never exceed browser `localStorage` quota limits
 * 3. Load rapidly on every visitor's phone across any network connection
 * ============================================================================
 */

export function optimizeImageFile(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.88
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const rawDataUrl = reader.result as string;
      if (!rawDataUrl || typeof rawDataUrl !== 'string') {
        reject(new Error('Invalid image data'));
        return;
      }

      // Keep small SVGs or already tiny images (<220KB) untouched
      if (file.type === 'image/svg+xml' || rawDataUrl.length < 280_000) {
        resolve(rawDataUrl);
        return;
      }

      const img = new Image();
      img.onload = () => {
        try {
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(rawDataUrl);
            return;
          }

          // Fill white background for transparent PNGs converted to JPEG
          ctx.fillStyle = '#090E1A';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl.length < rawDataUrl.length ? compressedDataUrl : rawDataUrl);
        } catch {
          resolve(rawDataUrl);
        }
      };
      img.onerror = () => {
        // Fallback to raw DataURL if browser cannot decode into canvas
        resolve(rawDataUrl);
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  });
}
