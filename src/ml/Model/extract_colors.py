#!/usr/bin/env python3
"""
Skin tone + hair colour extraction WITHOUT machine learning.

These two attributes are direct measurements, not predictions. Training a
classifier for them makes them less accurate, not more. Measure the pixels,
snap to the nearest palette entry, done. Deterministic and defensible.

Usage:  python extract_colors.py photo.jpg
"""
import sys
import cv2
import numpy as np

# Monk Skin Tone Scale (Google, 10 tones) - sRGB
MONK = {
    "MST-1": (246, 237, 228), "MST-2": (243, 231, 219), "MST-3": (247, 234, 208),
    "MST-4": (234, 218, 186), "MST-5": (215, 189, 150), "MST-6": (160, 126, 86),
    "MST-7": (130, 92, 67),   "MST-8": (96, 65, 52),    "MST-9": (58, 49, 42),
    "MST-10": (41, 36, 32),
}

HAIR = {
    "black": (28, 24, 22), "dark-brown": (60, 44, 34), "brown": (94, 68, 48),
    "light-brown": (140, 102, 68), "blonde": (205, 170, 110),
    "red": (150, 70, 40), "grey": (150, 150, 150), "white": (225, 225, 225),
}


def nearest(rgb, palette):
    """Match in CIELAB - matches how human eyes judge colour distance."""
    px = np.uint8([[list(rgb)]])
    lab = cv2.cvtColor(px, cv2.COLOR_RGB2LAB)[0][0].astype(float)
    best, bestd = None, 1e9
    for name, ref in palette.items():
        rl = cv2.cvtColor(np.uint8([[list(ref)]]), cv2.COLOR_RGB2LAB)[0][0].astype(float)
        d = np.linalg.norm(lab - rl)
        if d < bestd:
            best, bestd = name, d
    return best, round(float(bestd), 2)


def dominant(region, k=3):
    """k-means on the region, return the largest cluster centre."""
    px = region.reshape(-1, 3).astype(np.float32)
    if len(px) < k:
        return tuple(int(v) for v in px.mean(0))
    crit = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 20, 0.5)
    _, lab, cen = cv2.kmeans(px, k, None, crit, 5, cv2.KMEANS_PP_CENTERS)
    biggest = np.argmax(np.bincount(lab.flatten()))
    return tuple(int(v) for v in cen[biggest])


def analyse(path):
    bgr = cv2.imread(path)
    if bgr is None:
        sys.exit(f"could not read {path}")
    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)

    cas = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    faces = cas.detectMultiScale(gray, 1.1, 5, minSize=(60, 60))
    if len(faces) == 0:
        sys.exit("no face detected - ask the parent for a clearer front-facing photo")
    x, y, w, h = max(faces, key=lambda b: b[2] * b[3])

    # Cheeks: reliably skin, avoids eyes/lips/nostrils/facial hair
    cheek_l = rgb[y + int(.55*h):y + int(.72*h), x + int(.12*w):x + int(.30*w)]
    cheek_r = rgb[y + int(.55*h):y + int(.72*h), x + int(.70*w):x + int(.88*w)]
    skin_rgb = dominant(np.vstack([cheek_l.reshape(-1, 3), cheek_r.reshape(-1, 3)]).reshape(-1, 1, 3))

    # Hair: band above the forehead, clipped to image bounds
    hy0 = max(0, y - int(.35 * h))
    hair_band = rgb[hy0:max(hy0 + 1, y - int(.05 * h)),
                    x + int(.20*w):x + int(.80*w)]
    hair_rgb = dominant(hair_band.reshape(-1, 1, 3)) if hair_band.size else (0, 0, 0)

    skin_name, sd = nearest(skin_rgb, MONK)
    hair_name, hd = nearest(hair_rgb, HAIR)

    return {
        "skinTone":  {"id": skin_name, "rgb": skin_rgb,
                      "hex": "#%02X%02X%02X" % skin_rgb, "distance": sd},
        "hairColor": {"id": hair_name, "rgb": hair_rgb,
                      "hex": "#%02X%02X%02X" % hair_rgb, "distance": hd},
        "faceBox": [int(x), int(y), int(w), int(h)],
        # High distance = unusual lighting. Flag it, let the parent pick.
        "lowConfidence": sd > 30 or hd > 45,
    }


if __name__ == "__main__":
    import json
    if len(sys.argv) < 2:
        sys.exit("usage: python extract_colors.py <photo.jpg>")
    print(json.dumps(analyse(sys.argv[1]), indent=2))
