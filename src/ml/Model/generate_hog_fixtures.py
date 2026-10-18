"""
Generates ground-truth HOG feature vectors using the exact same call as
guardian_pipeline.clean_and_featurise():

    hog(face, orientations=9, pixels_per_cell=(8, 8),
        cells_per_block=(2, 2), block_norm="L2-Hys")

on FACE_SIZE=64 uint8 grayscale images. Output feeds the TypeScript port's
fixture test (SafeQuest app: src/ml/hog.test.ts) so the JS implementation
can be checked against scikit-image bit-for-bit (within float tolerance).
"""
import json
import numpy as np
from skimage.feature import hog

FACE_SIZE = 64
HOG_KW = dict(orientations=9, pixels_per_cell=(8, 8),
              cells_per_block=(2, 2), block_norm="L2-Hys")


def make_images():
    imgs = {}

    imgs["zeros"] = np.zeros((FACE_SIZE, FACE_SIZE), dtype=np.uint8)
    imgs["constant_128"] = np.full((FACE_SIZE, FACE_SIZE), 128, dtype=np.uint8)

    rng = np.random.RandomState(42)
    imgs["random_seed42"] = rng.randint(0, 256, (FACE_SIZE, FACE_SIZE), dtype=np.uint8)

    rng2 = np.random.RandomState(7)
    imgs["random_seed7"] = rng2.randint(0, 256, (FACE_SIZE, FACE_SIZE), dtype=np.uint8)

    # Horizontal ramp -> strong vertical edges (dominant g_col)
    ramp_h = np.tile(np.linspace(0, 255, FACE_SIZE, dtype=np.uint8), (FACE_SIZE, 1))
    imgs["horizontal_ramp"] = ramp_h

    # Vertical ramp -> strong horizontal edges (dominant g_row)
    ramp_v = np.tile(np.linspace(0, 255, FACE_SIZE, dtype=np.uint8), (FACE_SIZE, 1)).T
    imgs["vertical_ramp"] = np.ascontiguousarray(ramp_v)

    # Diagonal checkerboard -> stresses multiple orientation bins, block clipping
    xx, yy = np.meshgrid(np.arange(FACE_SIZE), np.arange(FACE_SIZE))
    checker = (((xx // 8) + (yy // 8)) % 2) * 255
    imgs["checkerboard_8"] = checker.astype(np.uint8)

    # Realistic-ish: ramp + noise, like an equalized face crop
    rng3 = np.random.RandomState(123)
    noisy_ramp = ramp_h.astype(np.int16) + rng3.randint(-20, 20, (FACE_SIZE, FACE_SIZE))
    imgs["ramp_plus_noise"] = np.clip(noisy_ramp, 0, 255).astype(np.uint8)

    return imgs


def main():
    fixtures = []
    for name, img in make_images().items():
        feat = hog(img, **HOG_KW)
        fixtures.append({
            "name": name,
            "image": img.tolist(),
            "features": [round(float(v), 10) for v in feat],
        })
        print(f"{name:20s} -> {feat.shape[0]} features")

    out = {
        "params": {
            "faceSize": FACE_SIZE,
            "orientations": HOG_KW["orientations"],
            "pixelsPerCell": list(HOG_KW["pixels_per_cell"]),
            "cellsPerBlock": list(HOG_KW["cells_per_block"]),
            "blockNorm": HOG_KW["block_norm"],
        },
        "fixtures": fixtures,
    }
    path = "hog_fixtures.json"
    with open(path, "w") as f:
        json.dump(out, f)
    print(f"\nwrote {path}")


if __name__ == "__main__":
    main()
