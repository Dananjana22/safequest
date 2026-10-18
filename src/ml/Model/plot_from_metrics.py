"""
Regenerates the figures that can be rebuilt from metrics.json alone - no
dataset needed. The other figures in guardian_pipeline.py (preprocessing
samples, HOG visualisation, confusion matrix, ROC/PR, learning curve,
fairness, confidence, regularisation) need the images or the per-sample
predictions, so they only come out of a Colab run.

    python plot_from_metrics.py
"""
import json
from pathlib import Path

import matplotlib
matplotlib.use("Agg")

import guardian_pipeline as gp

HERE = Path(__file__).parent
m = json.loads((HERE / "metrics.json").read_text())

# 01 - class balance. metrics.json keys are JSON strings; the plotter wants ints.
before = {int(k): v for k, v in m["dataset"]["balance_before"].items()}
after = {int(k): v for k, v in m["dataset"]["balance_after"].items()}
gp.plot_class_balance(before, after, path=str(HERE / "01_class_balance.png"))

# 02 - cleaning funnel.
audit = {"files_found": m["dataset"]["files_found"], "labelled": m["dataset"]["labelled"]}
gp.plot_cleaning_funnel(audit, m["dataset"]["cleaning"],
                        path=str(HERE / "02_cleaning_funnel.png"))

# 05 - baselines against the trained model.
results = dict(m["baselines"])
results["Trained model"] = m["trained"]
gp.plot_baselines(results, path=str(HERE / "05_before_after.png"))

# 09 - cross-validation folds.
gp.plot_cv(m["cross_validation"]["folds"], path=str(HERE / "09_cross_validation.png"))

print("wrote 01_class_balance.png, 02_cleaning_funnel.png, "
      "05_before_after.png, 09_cross_validation.png")
