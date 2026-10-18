/**
 * Phone-camera photos routinely come in at 3000-4000px on the long edge.
 * Running OpenCV's Haar cascade (detectMultiScale) or the k-means color
 * sampling in colorExtraction.ts on a canvas that large blocks the main
 * thread for tens of seconds to minutes - long enough to trigger the
 * browser's "Page Unresponsive" dialog. Neither face detection nor cheek/
 * hair color averaging needs full resolution, so every analysis entry
 * point should draw through this capped-size canvas instead of the
 * image's native dimensions.
 */
const MAX_ANALYSIS_DIMENSION = 800;

export function getScaledImageData(
  image: HTMLImageElement | HTMLCanvasElement,
  maxDimension = MAX_ANALYSIS_DIMENSION
): ImageData {
  const naturalWidth = 'naturalWidth' in image ? image.naturalWidth : image.width;
  const naturalHeight = 'naturalHeight' in image ? image.naturalHeight : image.height;

  const scale = Math.min(1, maxDimension / Math.max(naturalWidth, naturalHeight));
  const width = Math.max(1, Math.round(naturalWidth * scale));
  const height = Math.max(1, Math.round(naturalHeight * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D canvas context unavailable');
  ctx.drawImage(image, 0, 0, width, height);
  return ctx.getImageData(0, 0, width, height);
}
