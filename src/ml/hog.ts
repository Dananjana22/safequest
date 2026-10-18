/**
 * TypeScript port of scikit-image's `skimage.feature.hog`, restricted to the
 * exact call shape used by the Python training pipeline (guardian_pipeline.py):
 *
 *   hog(face, orientations=9, pixels_per_cell=(8, 8),
 *       cells_per_block=(2, 2), block_norm="L2-Hys")
 *
 * on a square, single-channel image whose side length is an exact multiple
 * of pixelsPerCell (FACE_SIZE=64 -> 8x8 cells). That exact-multiple
 * assumption lets each cell's pixel window equal its own non-overlapping
 * 8x8 block, matching skimage's centered-window cell_hog without needing
 * its boundary-clamping logic for partial windows.
 *
 * Ported from skimage/feature/_hog.py (_hog_channel_gradient,
 * _hog_normalize_block) and the Cython _hoghistogram.hog_histograms /
 * cell_hog binning rule, both read from the installed skimage 0.26 source.
 * Verified bit-for-bit (within float tolerance) against skimage output in
 * hog.test.ts.
 */

export interface HogOptions {
  orientations: number;
  pixelsPerCell: [number, number];
  cellsPerBlock: [number, number];
}

export const DEFAULT_HOG_OPTIONS: HogOptions = {
  orientations: 9,
  pixelsPerCell: [8, 8],
  cellsPerBlock: [2, 2],
};

/** image[row][col], any numeric pixel values (typically 0-255 grayscale). */
export type GrayscaleImage = ArrayLike<ArrayLike<number>>;

/**
 * skimage's _hog_channel_gradient: central difference along each axis,
 * zero at the border rows/columns.
 */
function computeGradients(
  image: number[][],
  rows: number,
  cols: number
): { gRow: Float64Array; gCol: Float64Array } {
  const gRow = new Float64Array(rows * cols);
  const gCol = new Float64Array(rows * cols);

  for (let r = 1; r < rows - 1; r++) {
    const prev = image[r - 1];
    const next = image[r + 1];
    const base = r * cols;
    for (let c = 0; c < cols; c++) {
      gRow[base + c] = next[c] - prev[c];
    }
  }

  for (let r = 0; r < rows; r++) {
    const row = image[r];
    const base = r * cols;
    for (let c = 1; c < cols - 1; c++) {
      gCol[base + c] = row[c + 1] - row[c - 1];
    }
  }

  return { gRow, gCol };
}

/**
 * skimage's L2-Hys block normalization: L2 normalize, clip to 0.2,
 * renormalize L2. eps matches skimage's default (1e-5).
 */
function normalizeBlockL2Hys(block: Float64Array): Float64Array {
  const eps = 1e-5;
  let sumSq = 0;
  for (let i = 0; i < block.length; i++) sumSq += block[i] * block[i];
  const norm1 = Math.sqrt(sumSq + eps * eps);

  const out = new Float64Array(block.length);
  let clippedSumSq = 0;
  for (let i = 0; i < block.length; i++) {
    const v = Math.min(block[i] / norm1, 0.2);
    out[i] = v;
    clippedSumSq += v * v;
  }
  const norm2 = Math.sqrt(clippedSumSq + eps * eps);
  for (let i = 0; i < out.length; i++) out[i] /= norm2;
  return out;
}

/**
 * Computes the flattened HOG feature vector for a single-channel image.
 * Requires image.length and image[0].length to be exact multiples of
 * pixelsPerCell (true for the pipeline's 64x64 equalized face crops).
 */
export function hog(
  image: GrayscaleImage,
  options: HogOptions = DEFAULT_HOG_OPTIONS
): Float64Array {
  const { orientations, pixelsPerCell, cellsPerBlock } = options;
  const [cellRows, cellCols] = pixelsPerCell;
  const [blockRows, blockCols] = cellsPerBlock;

  const rows = image.length;
  const cols = image[0]?.length ?? 0;
  if (rows % cellRows !== 0 || cols % cellCols !== 0) {
    throw new Error(
      `hog: image size ${rows}x${cols} must be an exact multiple of ` +
        `pixelsPerCell ${cellRows}x${cellCols}`
    );
  }

  const imgArr: number[][] = new Array(rows);
  for (let r = 0; r < rows; r++) imgArr[r] = Array.from(image[r]);

  const { gRow, gCol } = computeGradients(imgArr, rows, cols);

  // magnitude = hypot(g_col, g_row); orientation = rad2deg(atan2(g_row, g_col)) % 180
  const magnitude = new Float64Array(rows * cols);
  const orientation = new Float64Array(rows * cols);
  const RAD2DEG = 180 / Math.PI;
  for (let i = 0; i < rows * cols; i++) {
    magnitude[i] = Math.hypot(gCol[i], gRow[i]);
    let deg = Math.atan2(gRow[i], gCol[i]) * RAD2DEG;
    deg = deg % 180;
    if (deg < 0) deg += 180;
    orientation[i] = deg;
  }

  const nCellsRow = Math.floor(rows / cellRows);
  const nCellsCol = Math.floor(cols / cellCols);
  const cellArea = cellRows * cellCols;
  const stepDeg = 180 / orientations;

  // orientationHistogram[cellR][cellC][bin], cells are non-overlapping since
  // image size is an exact multiple of pixelsPerCell.
  const orientationHistogram: Float64Array[][] = [];
  for (let cr = 0; cr < nCellsRow; cr++) {
    orientationHistogram.push([]);
    for (let cc = 0; cc < nCellsCol; cc++) {
      orientationHistogram[cr].push(new Float64Array(orientations));
    }
  }

  for (let cr = 0; cr < nCellsRow; cr++) {
    const rowStart = cr * cellRows;
    for (let cc = 0; cc < nCellsCol; cc++) {
      const colStart = cc * cellCols;
      const hist = orientationHistogram[cr][cc];
      for (let dr = 0; dr < cellRows; dr++) {
        const base = (rowStart + dr) * cols;
        for (let dc = 0; dc < cellCols; dc++) {
          const idx = base + colStart + dc;
          const ori = orientation[idx];
          // bin i covers [i*step, (i+1)*step); guard the dc=180 edge case
          let bin = Math.floor(ori / stepDeg);
          if (bin >= orientations) bin = orientations - 1;
          hist[bin] += magnitude[idx];
        }
      }
      for (let b = 0; b < orientations; b++) hist[b] /= cellArea;
    }
  }

  const nBlocksRow = nCellsRow - blockRows + 1;
  const nBlocksCol = nCellsCol - blockCols + 1;
  if (nBlocksRow <= 0 || nBlocksCol <= 0) {
    throw new Error('hog: image too small for given pixelsPerCell/cellsPerBlock');
  }

  const blockLen = blockRows * blockCols * orientations;
  const out = new Float64Array(nBlocksRow * nBlocksCol * blockLen);
  let outOffset = 0;

  for (let br = 0; br < nBlocksRow; br++) {
    for (let bc = 0; bc < nBlocksCol; bc++) {
      const block = new Float64Array(blockLen);
      let k = 0;
      for (let i = 0; i < blockRows; i++) {
        for (let j = 0; j < blockCols; j++) {
          const hist = orientationHistogram[br + i][bc + j];
          for (let o = 0; o < orientations; o++) block[k++] = hist[o];
        }
      }
      const normalized = normalizeBlockL2Hys(block);
      out.set(normalized, outOffset);
      outOffset += blockLen;
    }
  }

  return out;
}
