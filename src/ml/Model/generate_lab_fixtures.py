"""
Ground truth for the RGB->Lab conversion used by extract_colors.py's
nearest() function (cv2.cvtColor(px, cv2.COLOR_RGB2LAB) on a uint8 pixel).
Covers every MST/HAIR palette entry plus a spread of other RGB values, so
the TypeScript port (src/ml/colorSpace.ts) can be checked against OpenCV's
actual 8-bit quantized output.
"""
import json
import cv2
import numpy as np

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

samples = {**{f"monk_{k}": v for k, v in MONK.items()},
           **{f"hair_{k}": v for k, v in HAIR.items()}}

rng = np.random.RandomState(42)
for i in range(40):
    r, g, b = rng.randint(0, 256, 3).tolist()
    samples[f"random_{i}"] = (r, g, b)

for name in ["black", "white", "red", "green", "blue", "grey128"]:
    samples[f"corner_{name}"] = {
        "black": (0, 0, 0), "white": (255, 255, 255), "red": (255, 0, 0),
        "green": (0, 255, 0), "blue": (0, 0, 255), "grey128": (128, 128, 128),
    }[name]

out = []
for name, rgb in samples.items():
    px = np.uint8([[list(rgb)]])
    lab = cv2.cvtColor(px, cv2.COLOR_RGB2LAB)[0][0]
    out.append({"name": name, "rgb": list(rgb), "lab": [int(v) for v in lab]})

json.dump({"fixtures": out}, open("lab_fixtures.json", "w"), indent=2)
print(f"wrote lab_fixtures.json ({len(out)} samples)")
for o in out[:5]:
    print(o)
