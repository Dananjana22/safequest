"""
SafeQuest Guardian - pipeline + visualisation module.
Every function here is used by the Colab notebook.
"""
import os, re, json, time, warnings
from collections import Counter
from pathlib import Path

import cv2
import numpy as np
import matplotlib.pyplot as plt
from skimage.feature import hog
from sklearn.base import clone
from sklearn.dummy import DummyClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (accuracy_score, classification_report,
                             confusion_matrix, precision_recall_curve,
                             precision_recall_fscore_support, roc_auc_score,
                             roc_curve, average_precision_score)
from sklearn.model_selection import (StratifiedKFold, learning_curve,
                                     train_test_split)
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

warnings.filterwarnings("ignore")

FACE_SIZE = 64
CLASS_NAMES = ["masculine", "feminine"]
SEED = 42
IMG_EXTS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}

# consistent report styling
C0, C1, CACC = "#4C72B0", "#DD8452", "#55A868"
plt.rcParams.update({"figure.dpi": 110, "font.size": 10,
                     "axes.spines.top": False, "axes.spines.right": False})


# ======================================================================
# 1. LOADING - auto-detects the common Kaggle layouts
# ======================================================================
UTK_RE = re.compile(r"^(\d+)_([01])_(\d+)_")
UTK_LOOSE = re.compile(r"^(\d+)_([01])_")
MASC = {"male", "man", "men", "m", "masculine", "0"}
FEM = {"female", "woman", "women", "f", "feminine", "1"}
CELEBA_ATTR_NAMES = {"list_attr_celeba.txt", "list_attr_celeba.csv"}


def scan(root):
    """Recursively list every image under root."""
    out = []
    for dp, _, fns in os.walk(root):
        for fn in fns:
            if Path(fn).suffix.lower() in IMG_EXTS:
                out.append(Path(dp) / fn)
    return sorted(out)


def find_celeba_attr_file(root):
    """Looks for CelebA's attributes file anywhere under root."""
    for dp, _, fns in os.walk(root):
        for fn in fns:
            if fn.lower() in CELEBA_ATTR_NAMES:
                return Path(dp) / fn
    return None


def parse_celeba_attr(attr_path):
    """
    Returns {filename: is_male} from either CelebA release format:
      .txt - line 1 is the image count, line 2 is space-separated attribute
             names, then "000001.jpg  -1  1  1 ..." (values are 1 or -1)
      .csv - Kaggle format: header row "image_id,5_o_Clock_Shadow,...,Male,..."
    """
    attr_path = Path(attr_path)
    lines = [ln for ln in
             attr_path.read_text(encoding="utf-8", errors="ignore").splitlines()
             if ln.strip()]
    if not lines:
        raise SystemExit(f"'{attr_path}' is empty.")

    if attr_path.suffix.lower() == ".csv" or "," in lines[0]:
        header = [h.strip() for h in lines[0].split(",")]
        data_lines, sep = lines[1:], ","
    else:
        header = ["image_id"] + lines[1].split()
        data_lines, sep = lines[2:], None

    try:
        male_idx = header.index("Male")
    except ValueError:
        raise SystemExit(
            f"'{attr_path}' has no 'Male' column.\nColumns found: {header}")

    out = {}
    for ln in data_lines:
        parts = [p for p in (ln.split(sep) if sep else ln.split()) if p != ""]
        if len(parts) <= male_idx:
            continue
        try:
            out[parts[0].strip()] = int(parts[male_idx]) == 1
        except ValueError:
            continue
    return out


def detect_layout(paths, root=None):
    """Figure out how the dataset is labelled before trying to parse it."""
    if not paths:
        return "empty"
    if root is not None and find_celeba_attr_file(root):
        return "celeba_attr"
    utk = sum(1 for p in paths[:300] if UTK_LOOSE.match(p.name))
    if utk > 0.6 * min(300, len(paths)):
        return "utkface"
    parents = {p.parent.name.lower() for p in paths}
    if any(x in MASC for x in parents) and any(x in FEM for x in parents):
        return "folders"
    return "unknown"


def load_dataset(root, limit=None):
    """Returns (rows, audit) where audit records what happened at each stage."""
    root = Path(root)
    paths = scan(root)
    audit = {"files_found": len(paths)}
    layout = detect_layout(paths, root)
    audit["layout"] = layout

    rows, bad_name = [], 0
    if layout == "utkface":
        for p in paths:
            m = UTK_RE.match(p.name) or UTK_LOOSE.match(p.name)
            if not m:
                bad_name += 1
                continue
            g = int(m.group(2))
            grp = int(m.group(3)) if m.re is UTK_RE else -1
            rows.append({"path": p, "label": g, "group": f"race_{grp}",
                         "age": int(m.group(1))})
    elif layout == "folders":
        for p in paths:
            d = p.parent.name.lower()
            if d in MASC:
                lab = 0
            elif d in FEM:
                lab = 1
            else:
                bad_name += 1
                continue
            rows.append({"path": p, "label": lab, "group": "all", "age": -1})
    elif layout == "celeba_attr":
        attr_path = find_celeba_attr_file(root)
        attrs = parse_celeba_attr(attr_path)
        audit["attr_file"] = str(attr_path)
        for p in paths:
            is_male = attrs.get(p.name)
            if is_male is None:
                bad_name += 1
                continue
            rows.append({"path": p, "label": 0 if is_male else 1,
                         "group": "all", "age": -1})
    else:
        raise SystemExit(
            f"Could not work out the labelling scheme.\n"
            f"Found {len(paths)} images under {root}.\n"
            f"Expected UTKFace filenames (25_0_1_xxx.jpg), folders named "
            f"male/ and female/, or a CelebA list_attr_celeba.txt/.csv "
            f"file with a 'Male' column somewhere under {root}.\n"
            f"Sample names: {[p.name for p in paths[:5]]}")

    audit["unlabelled_skipped"] = bad_name
    audit["labelled"] = len(rows)
    if limit:
        rows = rows[:limit]
        audit["after_limit"] = len(rows)
    return rows, audit


# ======================================================================
# 2. CLEANING - each rejection reason is counted so you can chart it
# ======================================================================
_casc = None
def cascade():
    global _casc
    if _casc is None:
        _casc = cv2.CascadeClassifier(
            cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    return _casc


def clean_and_featurise(rows, detect=True, min_size=32, blur_thresh=12.0,
                        verbose=True):
    """
    Cleaning stages, each counted:
      unreadable -> too small -> too blurry -> duplicate -> no face -> kept
    """
    X, y, groups, kept = [], [], [], []
    reasons = Counter()
    seen_hashes = set()
    t0 = time.time()

    for i, r in enumerate(rows):
        img = cv2.imread(str(r["path"]), cv2.IMREAD_GRAYSCALE)
        if img is None:
            reasons["unreadable"] += 1; continue
        if min(img.shape[:2]) < min_size:
            reasons["too_small"] += 1; continue
        if cv2.Laplacian(img, cv2.CV_64F).var() < blur_thresh:
            reasons["too_blurry"] += 1; continue

        # 16x16 difference hash (256 bits). An 8x8 average hash is far too
        # coarse for faces - it flags unrelated people as duplicates.
        h = cv2.resize(img, (17, 16), interpolation=cv2.INTER_AREA).astype(np.int16)
        hsh = (h[:, 1:] > h[:, :-1]).tobytes()
        if hsh in seen_hashes:
            reasons["duplicate"] += 1; continue
        seen_hashes.add(hsh)

        face = None
        if detect:
            fs = cascade().detectMultiScale(img, 1.1, 4, minSize=(30, 30))
            if len(fs) == 0:
                reasons["no_face_detected"] += 1; continue
            x, yy, w, hh = max(fs, key=lambda b: b[2] * b[3])
            pad = int(0.15 * w)
            face = img[max(0, yy-pad):yy+hh+pad, max(0, x-pad):x+w+pad]
        else:
            face = img

        face = cv2.resize(face, (FACE_SIZE, FACE_SIZE), cv2.INTER_AREA)
        face = cv2.equalizeHist(face)
        X.append(hog(face, orientations=9, pixels_per_cell=(8, 8),
                     cells_per_block=(2, 2), block_norm="L2-Hys"))
        y.append(r["label"]); groups.append(r["group"])
        kept.append({**r, "face": face})
        reasons["kept"] += 1

        if verbose and (i+1) % 500 == 0:
            print(f"   {i+1}/{len(rows)}  ({time.time()-t0:.0f}s)")

    return (np.asarray(X, np.float32), np.asarray(y),
            np.asarray(groups, object), kept, dict(reasons))


# ======================================================================
# 3. CHARTS
# ======================================================================
def plot_class_balance(before, after, path="01_class_balance.png"):
    fig, ax = plt.subplots(1, 2, figsize=(9, 3.6))
    for a, d, t in zip(ax, [before, after], ["Before cleaning", "After cleaning"]):
        v = [d.get(0, 0), d.get(1, 0)]
        b = a.bar(CLASS_NAMES, v, color=[C0, C1], width=.6)
        a.bar_label(b, fmt="%d", padding=2)
        tot = sum(v) or 1
        a.set_title(f"{t}  (n={tot}, {min(v)/tot:.0%} minority)")
        a.set_ylabel("images"); a.set_ylim(0, max(v)*1.18 if max(v) else 1)
    fig.suptitle("Class balance", fontweight="bold")
    fig.tight_layout(); fig.savefig(path, bbox_inches="tight"); return fig


def plot_cleaning_funnel(audit, reasons, path="02_cleaning_funnel.png"):
    order = ["unreadable", "too_small", "too_blurry", "duplicate",
             "no_face_detected"]
    labels = ["Files found", "Labelled"]
    vals = [audit["files_found"], audit["labelled"]]
    run = audit["labelled"]
    for k in order:
        if reasons.get(k):
            run -= reasons[k]
            labels.append(f"- {k.replace('_',' ')}\n({reasons[k]})")
            vals.append(run)
    labels.append("KEPT"); vals.append(reasons.get("kept", run))

    fig, a = plt.subplots(figsize=(max(7, len(labels)*1.25), 4))
    cols = [C0]*(len(vals)-1) + [CACC]
    b = a.bar(range(len(vals)), vals, color=cols, width=.65)
    a.bar_label(b, fmt="%d", padding=2)
    a.set_xticks(range(len(labels)))
    a.set_xticklabels(labels, rotation=30, ha="right", fontsize=8)
    a.set_ylabel("images remaining")
    pct = 100*vals[-1]/max(1, vals[0])
    a.set_title(f"Data cleaning funnel - {pct:.1f}% of files survived",
                fontweight="bold")
    fig.tight_layout(); fig.savefig(path, bbox_inches="tight"); return fig


def _balanced(kept, n):
    """Pick n examples alternating between classes so charts show both."""
    per = {0: [k for k in kept if k["label"] == 0],
           1: [k for k in kept if k["label"] == 1]}
    out = []
    for i in range(n):
        pool = per[i % 2] or per[(i + 1) % 2]
        if pool:
            out.append(pool.pop(0))
    return out


def plot_samples(kept, n=8, path="03_preprocessing.png"):
    """Original vs cleaned crop - the visual proof preprocessing works."""
    sel = _balanced(kept, n)
    fig, ax = plt.subplots(2, len(sel), figsize=(1.5*len(sel), 3.6))
    if len(sel) == 1: ax = ax.reshape(2, 1)
    for j, r in enumerate(sel):
        orig = cv2.imread(str(r["path"]), cv2.IMREAD_GRAYSCALE)
        ax[0, j].imshow(orig, cmap="gray"); ax[0, j].axis("off")
        ax[0, j].set_title(CLASS_NAMES[r["label"]], fontsize=8)
        ax[1, j].imshow(r["face"], cmap="gray"); ax[1, j].axis("off")
    ax[0, 0].set_ylabel("raw"); ax[1, 0].set_ylabel("processed")
    fig.suptitle("Preprocessing: raw input (top) -> 64x64 equalised face crop (bottom)",
                 fontweight="bold", fontsize=10)
    fig.tight_layout(); fig.savefig(path, bbox_inches="tight"); return fig


def plot_hog(kept, path="04_hog_features.png"):
    """Shows what the model actually sees. Strong demo visual."""
    sel = _balanced(kept, 4)
    fig, ax = plt.subplots(2, len(sel), figsize=(2.1*len(sel), 4.4))
    if len(sel) == 1: ax = ax.reshape(2, 1)
    for j, r in enumerate(sel):
        _, vis = hog(r["face"], orientations=9, pixels_per_cell=(8, 8),
                     cells_per_block=(2, 2), block_norm="L2-Hys", visualize=True)
        ax[0, j].imshow(r["face"], cmap="gray"); ax[0, j].axis("off")
        ax[0, j].set_title(CLASS_NAMES[r["label"]], fontsize=9)
        ax[1, j].imshow(vis, cmap="magma"); ax[1, j].axis("off")
    fig.suptitle("HOG feature extraction - gradient orientations the model learns from",
                 fontweight="bold", fontsize=10)
    fig.tight_layout(); fig.savefig(path, bbox_inches="tight"); return fig


def plot_baselines(results, path="05_before_after.png"):
    """THE before/after chart: untrained baselines vs the trained model."""
    names = list(results.keys())
    accs = [results[n]["accuracy"] for n in names]
    f1s = [results[n]["macro_f1"] for n in names]
    x = np.arange(len(names)); w = .36
    fig, a = plt.subplots(figsize=(1.9*len(names)+2, 4.2))
    b1 = a.bar(x-w/2, accs, w, label="Accuracy", color=C0)
    b2 = a.bar(x+w/2, f1s, w, label="Macro F1", color=CACC)
    a.bar_label(b1, fmt="%.3f", fontsize=8, padding=2)
    a.bar_label(b2, fmt="%.3f", fontsize=8, padding=2)
    a.axhline(.5, ls="--", c="grey", lw=1)
    a.text(len(names)-.4, .515, "chance", fontsize=8, color="grey")
    a.set_xticks(x); a.set_xticklabels(names, fontsize=9)
    a.set_ylim(0, 1.12); a.set_ylabel("score"); a.legend(loc="upper left")
    a.set_title("Before vs after training - baselines compared to trained model",
                fontweight="bold")
    fig.tight_layout(); fig.savefig(path, bbox_inches="tight"); return fig


def plot_confusion(y_true, y_pred, path="06_confusion.png"):
    cm = confusion_matrix(y_true, y_pred)
    cmn = cm / cm.sum(1, keepdims=True)
    fig, a = plt.subplots(figsize=(4.6, 4))
    im = a.imshow(cmn, cmap="Blues", vmin=0, vmax=1)
    for i in range(2):
        for j in range(2):
            a.text(j, i, f"{cm[i,j]}\n({cmn[i,j]:.1%})", ha="center", va="center",
                   color="white" if cmn[i, j] > .5 else "black", fontsize=11)
    a.set_xticks([0, 1], CLASS_NAMES); a.set_yticks([0, 1], CLASS_NAMES)
    a.set_xlabel("predicted"); a.set_ylabel("true")
    a.set_title("Confusion matrix (test set)", fontweight="bold")
    fig.colorbar(im, fraction=.046)
    fig.tight_layout(); fig.savefig(path, bbox_inches="tight"); return fig


def plot_roc_pr(y_true, y_prob, path="07_roc_pr.png"):
    fig, ax = plt.subplots(1, 2, figsize=(9, 4))
    fpr, tpr, _ = roc_curve(y_true, y_prob)
    auc = roc_auc_score(y_true, y_prob)
    ax[0].plot(fpr, tpr, c=C0, lw=2, label=f"AUC = {auc:.3f}")
    ax[0].plot([0, 1], [0, 1], "--", c="grey", lw=1, label="chance")
    ax[0].set_xlabel("false positive rate"); ax[0].set_ylabel("true positive rate")
    ax[0].set_title("ROC curve"); ax[0].legend()

    pr, rc, _ = precision_recall_curve(y_true, y_prob)
    ap = average_precision_score(y_true, y_prob)
    ax[1].plot(rc, pr, c=C1, lw=2, label=f"AP = {ap:.3f}")
    ax[1].axhline(y_true.mean(), ls="--", c="grey", lw=1, label="baseline")
    ax[1].set_xlabel("recall"); ax[1].set_ylabel("precision")
    ax[1].set_title("Precision-Recall curve"); ax[1].legend()
    fig.suptitle("Discrimination performance", fontweight="bold")
    fig.tight_layout(); fig.savefig(path, bbox_inches="tight")
    return fig, auc, ap


def plot_learning_curve(model, X, y, path="08_learning_curve.png", cv=5):
    """Answers: would MORE than 1000 images help? Key chart for a small dataset."""
    sizes = np.linspace(.15, 1.0, 7)
    ts, tr, te = learning_curve(model, X, y, train_sizes=sizes, cv=cv,
                               scoring="f1_macro", n_jobs=-1, random_state=SEED,
                               shuffle=True)
    fig, a = plt.subplots(figsize=(6.4, 4.2))
    for sc, c, lab in [(tr, C0, "training"), (te, C1, "validation (CV)")]:
        m, s = sc.mean(1), sc.std(1)
        a.plot(ts, m, "o-", c=c, label=lab)
        a.fill_between(ts, m-s, m+s, alpha=.15, color=c)
    a.set_xlabel("training set size"); a.set_ylabel("macro F1")
    a.set_title("Learning curve - is the dataset big enough?", fontweight="bold")
    a.legend(); a.grid(alpha=.3)
    fig.tight_layout(); fig.savefig(path, bbox_inches="tight")
    return fig, ts, tr.mean(1), te.mean(1)


def plot_cv(scores, path="09_cross_validation.png"):
    fig, a = plt.subplots(figsize=(5.6, 4))
    x = np.arange(1, len(scores)+1)
    b = a.bar(x, scores, color=C0, width=.6)
    a.bar_label(b, fmt="%.3f", fontsize=8, padding=2)
    m, s = np.mean(scores), np.std(scores)
    a.axhline(m, c=CACC, lw=2, label=f"mean = {m:.4f}")
    a.fill_between([.4, len(scores)+.6], m-s, m+s, color=CACC, alpha=.15,
                   label=f"+/- 1 sd = {s:.4f}")
    a.set_xticks(x); a.set_xlabel("fold"); a.set_ylabel("macro F1")
    a.set_ylim(0, 1.1); a.legend(loc="lower right")
    a.set_title("5-fold cross-validation", fontweight="bold")
    fig.tight_layout(); fig.savefig(path, bbox_inches="tight"); return fig


def plot_groups(y_true, y_pred, groups, path="10_fairness.png", min_n=15):
    gs, accs, ns = [], [], []
    for g in sorted(set(groups), key=str):
        m = groups == g
        if m.sum() < min_n: continue
        gs.append(str(g)); accs.append(accuracy_score(y_true[m], y_pred[m]))
        ns.append(int(m.sum()))
    if not gs: return None
    overall = accuracy_score(y_true, y_pred)
    fig, a = plt.subplots(figsize=(max(5.5, 1.3*len(gs)), 4.2))
    cols = [C1 if v < overall-.05 else C0 for v in accs]
    b = a.bar(gs, accs, color=cols, width=.6)
    a.bar_label(b, labels=[f"{v:.3f}\nn={n}" for v, n in zip(accs, ns)], fontsize=8)
    a.axhline(overall, c=CACC, lw=2, ls="--", label=f"overall = {overall:.3f}")
    a.set_ylim(0, 1.15); a.set_ylabel("accuracy"); a.legend()
    a.set_title("Accuracy by subgroup - bias check", fontweight="bold")
    plt.xticks(rotation=20, ha="right")
    fig.tight_layout(); fig.savefig(path, bbox_inches="tight"); return fig


def plot_confidence(y_true, y_pred, y_prob, path="11_confidence.png"):
    conf = np.maximum(y_prob, 1-y_prob)
    correct = (y_true == y_pred)
    fig, ax = plt.subplots(1, 2, figsize=(9.5, 4))
    ax[0].hist([conf[correct], conf[~correct]], bins=14, stacked=True,
               color=[CACC, C1], label=["correct", "wrong"])
    ax[0].set_xlabel("model confidence"); ax[0].set_ylabel("count")
    ax[0].set_title("Confidence distribution"); ax[0].legend()

    ts = np.linspace(.5, .99, 30); cov, acc = [], []
    for t in ts:
        m = conf >= t
        cov.append(m.mean())
        acc.append(accuracy_score(y_true[m], y_pred[m]) if m.sum() > 5 else np.nan)
    ax[1].plot(ts, cov, "o-", c=C0, ms=3, label="coverage (auto-filled)")
    ax[1].plot(ts, acc, "s-", c=CACC, ms=3, label="accuracy when auto-filled")
    ax[1].set_xlabel("confidence threshold"); ax[1].set_ylabel("proportion")
    ax[1].set_title("Auto-fill vs ask-the-parent trade-off")
    ax[1].legend(); ax[1].grid(alpha=.3)
    fig.suptitle("Confidence gating", fontweight="bold")
    fig.tight_layout(); fig.savefig(path, bbox_inches="tight"); return fig


# ======================================================================
# 4. EVALUATION
# ======================================================================
def evaluate(model, X, y):
    yp = model.predict(X)
    acc = accuracy_score(y, yp)
    _, _, f1, _ = precision_recall_fscore_support(y, yp, average="macro",
                                                  zero_division=0)
    return {"accuracy": float(acc), "macro_f1": float(f1)}


def run_baselines(X_tr, y_tr, X_te, y_te):
    """'Before training' evidence: what do untrained/trivial models score?"""
    out = {}
    for name, est in [
        ("Random\nguess", DummyClassifier(strategy="uniform", random_state=SEED)),
        ("Majority\nclass", DummyClassifier(strategy="most_frequent")),
    ]:
        est.fit(X_tr, y_tr)
        out[name] = evaluate(est, X_te, y_te)
    # untrained logistic regression = random weights
    lr = LogisticRegression(max_iter=1)
    lr.fit(X_tr[:2], y_tr[:2] if len(set(y_tr[:2])) == 2 else [0, 1])
    lr.coef_ = np.random.RandomState(SEED).normal(0, .01, lr.coef_.shape)
    out["Untrained\nweights"] = evaluate(lr, X_te, y_te)
    return out


def make_model(C=1.0):
    return Pipeline([("scale", StandardScaler()),
                     ("clf", LogisticRegression(C=C, max_iter=3000,
                                                class_weight="balanced",
                                                random_state=SEED))])


C_GRID = [3e-4, 1e-3, 3e-3, 1e-2, 3e-2, 1e-1, 1.0]


def tune_C(X, y, grid=C_GRID, folds=5):
    """
    With ~1000 images and 1764 HOG features the model overfits badly at the
    default C=1.0. Tuning regularisation strength is the single biggest win
    available on a small dataset.
    """
    means, stds = [], []
    for C in grid:
        s = cv_scores(make_model(C), X, y, folds)
        means.append(s.mean()); stds.append(s.std())
        print(f"   C={C:<8} macro F1 = {s.mean():.4f} +/- {s.std():.4f}")
    best = grid[int(np.argmax(means))]
    print(f"   -> best C = {best}  (macro F1 = {max(means):.4f})")
    return best, np.array(means), np.array(stds)


def plot_validation_curve(grid, means, stds, path="12_regularisation.png"):
    fig, a = plt.subplots(figsize=(6.4, 4.2))
    means, stds = np.array(means), np.array(stds)
    a.plot(grid, means, "o-", c=C0)
    a.fill_between(grid, means-stds, means+stds, alpha=.18, color=C0)
    b = grid[int(np.argmax(means))]
    a.axvline(b, ls="--", c=CACC, lw=2, label=f"best C = {b}")
    a.set_xscale("log"); a.set_xlabel("C  (lower = stronger regularisation)")
    a.set_ylabel("cross-validated macro F1")
    a.set_title("Regularisation tuning", fontweight="bold")
    a.legend(); a.grid(alpha=.3)
    fig.tight_layout(); fig.savefig(path, bbox_inches="tight"); return fig


def cv_scores(model, X, y, folds=5):
    skf = StratifiedKFold(folds, shuffle=True, random_state=SEED)
    out = []
    for tr, te in skf.split(X, y):
        m = clone(model).fit(X[tr], y[tr])
        _, _, f1, _ = precision_recall_fscore_support(
            y[te], m.predict(X[te]), average="macro", zero_division=0)
        out.append(f1)
    return np.array(out)
