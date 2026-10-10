export const lecture03 = {
  slug: "lecture-3",
  number: 3,
  title: "Complete AI & LLM Engineering Course — Lecture 3: Supervised Learning with scikit-learn — Regression & Classification",
  summary: "Learn supervised machine learning with scikit-learn: the ML workflow, linear and logistic regression, KNN, decision trees, random forests and gradient boosting, pipelines, metrics like RMSE, R2, precision, recall, F1 and ROC-AUC, class imbalance, and saving models with joblib.",
  readTime: "52 min read",
  difficulty: "Intermediate",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. What Is Supervised Learning and Why scikit-learn Matters",
      content: `**Supervised learning** is machine learning where every training example comes with the correct answer (a **label**). You show the algorithm thousands of (input, answer) pairs and it learns a function that maps new inputs to answers. It is called "supervised" because the labels act like a teacher correcting the model during training.
There are two families of supervised problems, and almost every business ML system you will build belongs to one of them:
• **Regression** — the answer is a continuous number. Predict the price of a 2BHK flat in Pune, tomorrow's electricity demand in megawatts, or how many days a shipment will take to reach Guwahati.
• **Classification** — the answer is a category. Will this loan default (yes/no)? Is this email spam? Which of 10 product categories does this listing belong to?
In the previous lecture you learned the math and data foundations: vectors, matrices, gradients, probability, and pandas/NumPy. This lecture turns those foundations into working models. Even if your end goal is building LLM applications, supervised learning is not optional: you will use it to build classifiers that route user queries, to evaluate RAG systems, to train reward models, and to fine-tune embeddings. Interviewers for AI engineering roles routinely ask about precision/recall and overfitting before they ask anything about transformers.
**Why scikit-learn?** scikit-learn (imported as \`sklearn\`) is the standard Python library for classical machine learning. It has three qualities that make it the right starting point:
• A **uniform API** — every model is trained with \`fit()\` and used with \`predict()\`, so you can swap a linear model for a random forest by changing one line.
• **Batteries included** — preprocessing, cross-validation, metrics, pipelines and dozens of algorithms live in one well-tested package.
• **Production-proven** — companies from Flipkart to Zomato run scikit-learn models in production for pricing, fraud detection and recommendation ranking.
This lecture assumes Python 3.10+ and scikit-learn 1.4 or newer. Install everything with the command in the snippet and verify the version, because a few function names (like \`root_mean_squared_error\`) were added in 1.4.`,
      codeSnippet: `# Install the libraries used in this lecture (run in your terminal)
# pip install scikit-learn pandas numpy matplotlib joblib

# check_env.py
import sklearn, numpy, pandas
print("scikit-learn:", sklearn.__version__)   # expect 1.4.x or newer
print("numpy:", numpy.__version__)
print("pandas:", pandas.__version__)

# Quick sanity check: the smallest possible supervised model
from sklearn.linear_model import LinearRegression
X = [[1], [2], [3], [4]]        # feature: hours studied
y = [52, 58, 64, 70]            # label: marks scored
model = LinearRegression().fit(X, y)
print(model.predict([[5]]))     # [76.]  -> learned "6 marks per hour + 46"`
    },
    {
      heading: "2. The Supervised Machine Learning Workflow End to End",
      content: `Beginners think ML is "pick an algorithm and call fit". In practice the algorithm is about 10% of the work. A real supervised learning project follows a repeatable **ML workflow**, and scikit-learn has a tool for each stage:
1. **Define the problem and the metric.** Is it regression or classification? What does success look like in business terms? "Reduce false fraud alerts by 30% while catching 95% of real fraud" is a metric; "build a good model" is not.
2. **Collect and load data.** Usually a CSV, a SQL query or a Parquet file loaded into a pandas DataFrame.
3. **Explore and clean.** Check missing values, outliers, data types, and the distribution of the label. A classification dataset where 99% of rows are one class needs different handling (section 12).
4. **Split the data.** Hold out a **test set** (typically 20%) that the model never sees during training. This is the only honest estimate of real-world performance. Use \`train_test_split\`; for classification pass \`stratify=y\` so both splits have the same class proportions.
5. **Preprocess.** Scale numeric columns, one-hot encode categorical columns, impute missing values. These steps must be learned from the training set only.
6. **Train a baseline.** Start with the simplest model (a \`DummyRegressor\` or \`LogisticRegression\`). Every fancier model must beat the baseline or it is not worth its complexity.
7. **Evaluate with cross-validation.** Compare models on the training data using k-fold cross-validation, not on the test set.
8. **Tune hyperparameters.** Use \`GridSearchCV\` or \`RandomizedSearchCV\` to pick settings like tree depth.
9. **Evaluate once on the test set.** Report the final metrics.
10. **Save, deploy and monitor.** Serialize with joblib, serve behind an API, and watch for data drift.
The golden rule running through every stage is **never let information from the test set leak into training**. If you scale using the mean of the full dataset, or pick features by looking at test labels, your test score becomes a lie, and you discover the truth only in production.
The snippet shows the skeleton of this workflow on a tiny dataset so you can see every stage in one place. Later sections zoom into each piece.`,
      codeSnippet: `# workflow_skeleton.py
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.dummy import DummyClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.metrics import accuracy_score

# 1-2. Load data (a toy "will the customer churn?" table)
df = pd.DataFrame({
    "monthly_bill": [399, 1299, 799, 249, 1599, 499, 999, 299, 1199, 699],
    "tenure_months": [2, 36, 12, 1, 48, 6, 24, 3, 30, 9],
    "complaints":    [3, 0, 1, 4, 0, 2, 0, 5, 1, 2],
    "churned":       [1, 0, 0, 1, 0, 1, 0, 1, 0, 1],   # label
})
X = df.drop(columns="churned")
y = df["churned"]

# 4. Split: 20% test set, stratified so both splits keep the 50/50 ratio
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 6. Baseline: always predict the most frequent class
baseline = DummyClassifier(strategy="most_frequent").fit(X_train, y_train)
print("baseline accuracy:", accuracy_score(y_test, baseline.predict(X_test)))

# 5+7. Preprocessing + model in a pipeline, evaluated with cross-validation
model = make_pipeline(StandardScaler(), LogisticRegression())
scores = cross_val_score(model, X_train, y_train, cv=4, scoring="accuracy")
print("cv accuracy: %.2f +/- %.2f" % (scores.mean(), scores.std()))

# 9. Final fit on all training data, single evaluation on the test set
model.fit(X_train, y_train)
print("test accuracy:", accuracy_score(y_test, model.predict(X_test)))`
    },
    {
      heading: "3. The scikit-learn API: Estimators, fit, predict and transform",
      content: `The reason scikit-learn is so pleasant is that everything follows one design. Once you understand four method names, you can use any of its 100+ classes.
**Estimator** is the base concept: any object that learns from data. You create it with its hyperparameters (settings you choose, like \`n_neighbors=5\`), then call **\`fit(X, y)\`** to learn parameters from data. Learned attributes always end with an underscore, for example \`coef_\` and \`intercept_\` on a linear model, or \`feature_importances_\` on a tree. This naming tells you at a glance what was learned versus what you configured.
**Predictor** adds **\`predict(X)\`** which returns labels or numbers. Classifiers usually also offer **\`predict_proba(X)\`** (class probabilities, one column per class) and sometimes **\`decision_function(X)\`** (a raw score). You will use \`predict_proba\` constantly, because business decisions depend on thresholds, not on a hard yes/no.
**Transformer** adds **\`transform(X)\`**, used by preprocessing steps such as \`StandardScaler\` (which learns mean and standard deviation in \`fit\`, then subtracts and divides in \`transform\`). \`fit_transform(X)\` does both in one call and is what you use on training data; on test data you call only \`transform\`, reusing what was learned.
**Data shapes.** \`X\` is always 2-D: (n_samples, n_features). Even a single feature must be shaped as a column, which is why the first snippet used \`[[1], [2], [3]]\` rather than \`[1, 2, 3]\`. \`y\` is 1-D with length n_samples. pandas DataFrames, NumPy arrays and lists are all accepted; DataFrames are preferred because column names flow through to error messages and feature-importance reports.
**Scoring.** Every estimator has a \`score(X, y)\` method returning a default metric (R2 for regressors, accuracy for classifiers). It is convenient but rarely the metric you actually care about, so treat it as a quick check and use \`sklearn.metrics\` for real evaluation.
**Reproducibility.** Many estimators have randomness (random forests, train/test splits, SGD). Always pass \`random_state=42\` (any fixed integer) so your experiments are repeatable and a colleague can reproduce your numbers.`,
      codeSnippet: `# api_tour.py
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier

X_train = np.array([[150, 50], [160, 60], [170, 70], [180, 80], [190, 95]])  # height cm, weight kg
y_train = np.array([0, 0, 0, 1, 1])                                         # 0 = plays cricket, 1 = basketball
X_new   = np.array([[175, 72]])

# Transformer: learns mean/std on TRAIN, applies same numbers to NEW data
scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)   # fit + transform
X_new_s   = scaler.transform(X_new)         # transform only (no refitting!)
print("learned means:", scaler.mean_)       # [170. 71.]  <- trailing underscore = learned

# Predictor: hyperparameter chosen by you, parameters learned by fit
clf = KNeighborsClassifier(n_neighbors=3)
clf.fit(X_train_s, y_train)
print("predict:", clf.predict(X_new_s))             # [0]
print("predict_proba:", clf.predict_proba(X_new_s)) # [[0.667 0.333]] -> 2 of 3 neighbours play cricket
print("classes:", clf.classes_)                     # [0 1] -> column order of predict_proba
print("default score:", clf.score(X_train_s, y_train))  # accuracy on training data = 1.0 (not meaningful!)`
    },
    {
      heading: "4. Linear Regression and Regression Metrics (MAE, RMSE, R2)",
      content: `**Linear regression** is the simplest and most interpretable regression model, and surprisingly often the one that ships. The intuition: draw the straight line (or, with many features, the flat hyperplane) that passes as close as possible to all the training points. For a flat price in lakhs you might learn: price = 45 + 0.08 x area_sqft + 12 x is_near_metro - 1.5 x age_years. Each **coefficient** tells you how much the prediction changes when that feature increases by one unit, holding the others fixed. That interpretability is why banks and insurers love linear models.
**How it learns.** The model finds coefficients that minimize the **mean squared error** between predictions and true values. For plain \`LinearRegression\` scikit-learn solves this exactly with linear algebra (the "normal equation"), so there is no learning rate to tune. When you have many features or want to prevent overfitting, use its regularized cousins: \`Ridge\` (L2 penalty, shrinks coefficients toward zero), \`Lasso\` (L1 penalty, can set coefficients exactly to zero, acting as feature selection) and \`ElasticNet\` (both). Regularized models need **scaled features**, because the penalty treats all coefficients equally.
**When linear regression fails:** relationships that are strongly non-linear (price vs. area is roughly linear; demand vs. temperature is U-shaped), heavy interactions between features, and outliers (squared error lets one bizarre row drag the whole line).
Now the question you must answer for every regression model: **how wrong is it?** Three metrics, all computed on the held-out test set:
• **MAE (Mean Absolute Error)** — the average of |actual - predicted|. In the same units as the target, so "MAE of 3.2 lakh" is immediately meaningful to a business user. Robust to outliers.
• **RMSE (Root Mean Squared Error)** — square the errors, average, take the square root. Also in target units, but it punishes large errors much more heavily. If missing by 10 lakh on one flat is far worse than missing by 1 lakh on ten flats, optimize RMSE. RMSE is always greater than or equal to MAE; a big gap between them means a few predictions are badly off.
• **R2 (coefficient of determination)** — the fraction of the variance in the target that your model explains. 1.0 is perfect, 0.0 means you are no better than predicting the mean, and it can go negative when the model is worse than the mean. R2 is unit-free, which makes it good for comparing problems but useless for telling a stakeholder how much money an error costs.
The snippet trains on the classic California Housing dataset (20,640 districts, target is median house value in units of 100,000 USD). Expect roughly R2 = 0.58, RMSE = 0.73 and MAE = 0.53: the model explains about 58% of the variance and is off by about 53,000 USD on a typical district. That mediocre score is the point: it is the baseline that the tree ensembles in section 9 will crush.`,
      codeSnippet: `# linear_regression_housing.py
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.metrics import mean_absolute_error, root_mean_squared_error, r2_score

data = fetch_california_housing(as_frame=True)   # downloads ~400 KB on first run
X, y = data.data, data.target                    # 8 numeric features, target in $100k units
print(X.columns.tolist())
# ['MedInc', 'HouseAge', 'AveRooms', 'AveBedrms', 'Population', 'AveOccup', 'Latitude', 'Longitude']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

def evaluate(name, model):
    model.fit(X_train, y_train)
    pred = model.predict(X_test)
    print(f"{name:18s} MAE={mean_absolute_error(y_test, pred):.3f}  "
          f"RMSE={root_mean_squared_error(y_test, pred):.3f}  "
          f"R2={r2_score(y_test, pred):.3f}")
    return model

lin = evaluate("LinearRegression", LinearRegression())
# LinearRegression   MAE=0.533  RMSE=0.746  R2=0.576   (approximately)

ridge = evaluate("Ridge(alpha=1)", make_pipeline(StandardScaler(), Ridge(alpha=1.0)))
# Ridge(alpha=1)     MAE=0.533  RMSE=0.746  R2=0.576   (almost identical: little overfitting to fix)

# Interpret the coefficients: effect of +1 unit of each feature on price (in $100k)
for name, coef in zip(X.columns, lin.coef_):
    print(f"{name:12s} {coef:+.3f}")
# MedInc  +0.449  -> each extra $10k of median income adds ~$45k to house value
# Latitude -0.419 -> further north = cheaper, holding everything else fixed`
    },
    {
      heading: "5. Logistic Regression: Classification with Probabilities",
      content: `Despite its name, **logistic regression** is a classification algorithm, and it is the first model you should try on any binary classification problem. The intuition: compute a weighted sum of the features exactly as linear regression does, then squash that number through the **sigmoid function** so the output lands between 0 and 1 and can be read as a probability. A score of 0 maps to 0.5, large positive scores approach 1.0, large negative scores approach 0.0.
For a loan-default model it might learn: z = -2.1 + 1.8 x (EMI / income) - 0.9 x credit_score_scaled + 0.6 x past_late_payments, and P(default) = sigmoid(z). If z = 0.8, the probability is about 0.69, and with the default **threshold of 0.5** the model predicts "default".
**How it learns.** There is no closed-form solution, so scikit-learn minimizes the **log loss** (cross-entropy) with an iterative optimizer. You may see a \`ConvergenceWarning\`; the fix is almost always to scale the features (the optimizer converges far faster on standardized inputs) and, if needed, to raise \`max_iter\` from the default 100 to 1000.
**Regularization is on by default.** The \`C\` hyperparameter is the inverse of regularization strength: \`C=1.0\` is the default, smaller C means stronger shrinkage of the coefficients (less overfitting, possibly underfitting), larger C means weaker. Because of this default, unscaled features silently get penalized differently, which is another reason to always use \`StandardScaler\` in a pipeline before logistic regression.
**Multi-class** works out of the box: for three or more classes scikit-learn fits a multinomial (softmax) model, and \`predict_proba\` returns one column per class in the order of \`classes_\`.
**Why it is used so much in production:** it trains in seconds on millions of rows, the coefficients are explainable to a compliance officer, the probabilities are usually well calibrated (a predicted 0.3 really does default about 30% of the time), and it is a hard baseline to beat on tabular data with mostly linear signal. When it loses, it loses to tree ensembles on datasets with strong feature interactions.
The snippet uses the Breast Cancer Wisconsin dataset bundled with scikit-learn (569 tumours, 30 numeric features, label malignant/benign). A scaled logistic regression reaches around 97-98% accuracy, which already shows why "which algorithm" matters less than "did you preprocess correctly".`,
      codeSnippet: `# logistic_regression_cancer.py
import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

data = load_breast_cancer(as_frame=True)
X, y = data.data, data.target          # target: 0 = malignant, 1 = benign
print(data.target_names, np.bincount(y))   # ['malignant' 'benign'] [212 357]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Without scaling: ConvergenceWarning and slightly worse results
raw = LogisticRegression(max_iter=1000).fit(X_train, y_train)
print("unscaled accuracy:", round(accuracy_score(y_test, raw.predict(X_test)), 3))   # ~0.956

# With scaling: converges quickly, better accuracy
clf = make_pipeline(StandardScaler(), LogisticRegression(C=1.0, max_iter=1000))
clf.fit(X_train, y_train)
print("scaled accuracy:", round(accuracy_score(y_test, clf.predict(X_test)), 3))     # ~0.982

# Probabilities, not just labels
proba = clf.predict_proba(X_test[:3])
print(np.round(proba, 3))
# [[0.    1.   ]   -> 100% benign
#  [0.999 0.001]   -> 99.9% malignant
#  [0.002 0.998]]

# Custom threshold: for cancer screening we prefer to flag borderline cases
p_malignant = clf.predict_proba(X_test)[:, 0]
flag = (p_malignant > 0.2).astype(int)     # 1 = send for biopsy
print("flagged for follow-up:", flag.sum(), "of", len(flag))`
    },
    {
      heading: "6. Classification Metrics: Accuracy, Precision, Recall, F1, Confusion Matrix and ROC-AUC",
      content: `Accuracy is the first metric everyone learns and the one that most often misleads. If 2% of UPI transactions are fraud, a model that says "not fraud" to everything is 98% accurate and completely useless. To evaluate classifiers honestly you need the **confusion matrix** and the metrics derived from it.
For a binary problem, call the class you care about the **positive** class (fraud, default, disease). Every prediction falls into one of four cells:
• **True Positive (TP)** — fraud, predicted fraud. Correct.
• **False Positive (FP)** — genuine, predicted fraud. A false alarm (customer's card blocked wrongly).
• **False Negative (FN)** — fraud, predicted genuine. A miss (money lost).
• **True Negative (TN)** — genuine, predicted genuine. Correct.
scikit-learn's \`confusion_matrix(y_true, y_pred)\` returns rows = actual class, columns = predicted class, in the order of \`classes_\`, so for labels [0, 1] it is [[TN, FP], [FN, TP]]. Memorize that layout; it is a favourite interview trap.
From these four counts:
• **Accuracy** = (TP + TN) / total. Fine when classes are balanced and both errors cost the same.
• **Precision** = TP / (TP + FP). Of everything we flagged, how much was real? Optimize precision when false alarms are expensive: spam filters (do not bury a job offer), fraud blocks that annoy customers.
• **Recall** (sensitivity, true positive rate) = TP / (TP + FN). Of all the real positives, how many did we catch? Optimize recall when misses are expensive: cancer screening, detecting a failing turbine.
• **F1 score** = harmonic mean of precision and recall = 2PR / (P + R). Use it when you need one number and both errors matter. The harmonic mean punishes imbalance: precision 1.0 with recall 0.1 gives F1 of 0.18, not 0.55.
• **Specificity** = TN / (TN + FP), the recall of the negative class.
**The precision-recall trade-off.** Every classifier that outputs a probability lets you choose the threshold. Lower it from 0.5 to 0.2 and you catch more positives (recall up) but flag more innocents (precision down). The threshold is a business decision, not a modeling one.
**ROC-AUC** measures the model independently of any threshold. The ROC curve plots true positive rate against false positive rate for every possible threshold; the **area under it (AUC)** is the probability that a randomly chosen positive example gets a higher score than a randomly chosen negative one. 0.5 is random guessing, 1.0 is perfect, and anything above 0.9 is usually strong. ROC-AUC is the standard metric for comparing models on imbalanced data, though when positives are extremely rare (below 1%) the **precision-recall AUC** (\`average_precision_score\`) is more informative because it ignores the huge number of easy true negatives.
For multi-class problems, \`classification_report\` prints precision, recall and F1 per class plus **macro** (unweighted mean across classes, good for imbalance) and **weighted** averages.`,
      codeSnippet: `# classification_metrics.py
import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (confusion_matrix, accuracy_score, precision_score,
                             recall_score, f1_score, roc_auc_score,
                             classification_report, average_precision_score)

# Synthetic fraud-like data: 5% positives
X, y = make_classification(n_samples=5000, n_features=12, n_informative=6,
                           weights=[0.95, 0.05], random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3,
                                                    random_state=42, stratify=y)

clf = LogisticRegression(max_iter=1000).fit(X_train, y_train)
proba = clf.predict_proba(X_test)[:, 1]          # P(fraud)
pred  = (proba >= 0.5).astype(int)               # same as clf.predict(X_test)

tn, fp, fn, tp = confusion_matrix(y_test, pred).ravel()
print(f"TN={tn} FP={fp} FN={fn} TP={tp}")
# e.g. TN=1416 FP=9 FN=38 TP=37  -> catches only ~half the fraud at threshold 0.5

print("accuracy :", round(accuracy_score(y_test, pred), 3))   # ~0.969 (looks great, isn't)
print("precision:", round(precision_score(y_test, pred), 3))  # ~0.80
print("recall   :", round(recall_score(y_test, pred), 3))     # ~0.49
print("f1       :", round(f1_score(y_test, pred), 3))         # ~0.61
print("roc_auc  :", round(roc_auc_score(y_test, proba), 3))   # ~0.93 (threshold-free)
print("pr_auc   :", round(average_precision_score(y_test, proba), 3))

# Lower the threshold to trade precision for recall
for t in (0.5, 0.3, 0.15):
    p = (proba >= t).astype(int)
    print(f"threshold={t:.2f}  precision={precision_score(y_test, p):.2f}  "
          f"recall={recall_score(y_test, p):.2f}  f1={f1_score(y_test, p):.2f}")

print(classification_report(y_test, pred, target_names=["genuine", "fraud"], digits=3))`
    },
    {
      heading: "7. k-Nearest Neighbors (KNN): Learning by Similarity",
      content: `**k-Nearest Neighbors** is the most intuitive algorithm in machine learning: to classify a new point, find the k training points closest to it and take a vote (for classification) or an average (for regression). A flat's price is roughly the average price of the five most similar flats nearby. There is no "training" in the usual sense; \`fit()\` simply stores the data, and all the work happens at prediction time. This is called a **lazy learner**.
**Key hyperparameters:**
• **\`n_neighbors\` (k)** — small k (1-3) follows the training data too closely and overfits to noise; large k (50+) smooths everything into the majority class and underfits. Odd values avoid ties in binary problems. Tune it with cross-validation; 5 to 15 is a common range.
• **\`weights\`** — \`"uniform"\` gives every neighbour one vote; \`"distance"\` lets closer neighbours count more, which often helps.
• **\`metric\`** — Euclidean by default; Manhattan or cosine can suit specific data (cosine is the standard for text embeddings).
**Scaling is mandatory.** Distance is computed across all features at once. If income is in rupees (0-5,000,000) and age is in years (18-80), income completely dominates the distance and age is ignored. Always put \`StandardScaler\` before KNN in a pipeline. This is the single most common KNN mistake.
**Strengths:** no assumptions about the shape of the decision boundary, naturally handles multi-class, works surprisingly well on small, low-dimensional data, and the "show me the similar cases" explanation is easy for users to trust.
**Weaknesses:** prediction cost grows with the training set (every prediction scans all rows unless you use tree-based indexes, which scikit-learn does automatically for low dimensions), memory holds the full dataset, and it suffers from the **curse of dimensionality**: in hundreds of dimensions all points become roughly equidistant and "nearest" stops meaning anything. It is rarely the best model for tabular business data, but the idea of nearest-neighbour search over vectors is exactly how retrieval in RAG systems works (you will meet it again with FAISS and vector databases later in this course), so understanding it well pays off.`,
      codeSnippet: `# knn_scaling_matters.py
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

X, y = load_breast_cancer(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2,
                                                    random_state=42, stratify=y)

# Unscaled: the 'area' and 'perimeter' columns (hundreds to thousands) dominate distance
knn_raw = KNeighborsClassifier(n_neighbors=5).fit(X_train, y_train)
print("unscaled KNN accuracy:", round(knn_raw.score(X_test, y_test), 3))   # ~0.947

# Scaled + tuned k with cross-validation
pipe = Pipeline([("scale", StandardScaler()), ("knn", KNeighborsClassifier())])
grid = GridSearchCV(
    pipe,
    param_grid={"knn__n_neighbors": [3, 5, 7, 9, 11, 15],
                "knn__weights": ["uniform", "distance"]},
    cv=5, scoring="accuracy", n_jobs=-1,
)
grid.fit(X_train, y_train)
print("best params:", grid.best_params_)              # e.g. {'knn__n_neighbors': 9, 'knn__weights': 'uniform'}
print("cv accuracy :", round(grid.best_score_, 3))   # ~0.97
print("test accuracy:", round(grid.score(X_test, y_test), 3))   # ~0.97

# Which training rows influenced one prediction? (the "explain by example" feature)
best = grid.best_estimator_
dist, idx = best.named_steps["knn"].kneighbors(
    best.named_steps["scale"].transform(X_test[:1]), n_neighbors=3
)
print("3 nearest training rows:", idx[0], "labels:", y_train[idx[0]])`
    },
    {
      heading: "8. Decision Trees: Learnable If-Else Rules",
      content: `A **decision tree** learns a flowchart of yes/no questions: "Is annual income below 6 lakh? If yes, is the EMI-to-income ratio above 0.4? ..." Each internal node is a test on one feature, each branch is an outcome, and each leaf holds a prediction (the majority class, or the mean target for regression). Trees are the model developers find most natural because the result literally is nested if-else code.
**How it learns.** The algorithm (CART in scikit-learn) starts with all rows at the root and greedily picks the single feature and threshold that best separates the classes, measured by **Gini impurity** (default) or **entropy** for classification, and by variance reduction (squared error) for regression. It then repeats inside each child node, recursively, until a stopping condition is reached. A Gini of 0 means a node is pure (one class only); the split that lowers impurity the most wins.
**Why trees overfit by default.** With no limits, the tree keeps splitting until every leaf is pure, which often means one training row per leaf. It then scores 100% on training data and poorly on test data because it memorized noise. You must constrain it with hyperparameters:
• **\`max_depth\`** — the maximum number of questions on any path. 3-8 is typical for an interpretable tree.
• **\`min_samples_leaf\`** — a leaf must contain at least this many rows (try 5-50). This is the most effective single regularizer.
• **\`min_samples_split\`**, **\`max_leaf_nodes\`**, and **\`ccp_alpha\`** (cost-complexity pruning) are further knobs.
**What makes trees great:** no scaling needed (splits are threshold comparisons, so units do not matter), they handle non-linear relationships and feature interactions automatically, they work with mixed numeric and categorical data, and \`feature_importances_\` tells you which columns mattered. You can print the tree as text or plot it, which is gold for explaining a model to a non-technical stakeholder.
**What makes single trees weak:** high variance. Change a few training rows and you can get a completely different tree. They also produce step-like predictions for regression and cannot extrapolate beyond the range of the training target. The fix for variance is to grow many trees and combine them, which is exactly what the next section does.`,
      codeSnippet: `# decision_tree_loans.py
import numpy as np, pandas as pd
from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.model_selection import train_test_split

rng = np.random.default_rng(42)
n = 2000
df = pd.DataFrame({
    "income_lakh":   rng.uniform(2, 30, n).round(1),
    "emi_ratio":     rng.uniform(0.05, 0.8, n).round(2),   # EMI / monthly income
    "credit_score":  rng.integers(300, 900, n),
    "late_payments": rng.integers(0, 6, n),
})
# Ground-truth rule with noise: high EMI burden or low score + late payments => default
risk = (df.emi_ratio > 0.45) | ((df.credit_score < 600) & (df.late_payments >= 2))
df["default"] = (risk & (rng.random(n) > 0.15)) | (~risk & (rng.random(n) < 0.05))
df["default"] = df["default"].astype(int)

X, y = df.drop(columns="default"), df["default"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25,
                                                    random_state=42, stratify=y)

# Unconstrained tree: memorizes training data
full = DecisionTreeClassifier(random_state=42).fit(X_train, y_train)
print("depth:", full.get_depth(), " train acc:", round(full.score(X_train, y_train), 3),
      " test acc:", round(full.score(X_test, y_test), 3))
# depth: ~20  train acc: 1.0  test acc: ~0.84   <- overfitting

# Constrained tree: generalizes better AND is readable
tree = DecisionTreeClassifier(max_depth=3, min_samples_leaf=25, random_state=42)
tree.fit(X_train, y_train)
print("train acc:", round(tree.score(X_train, y_train), 3),
      " test acc:", round(tree.score(X_test, y_test), 3))     # ~0.89 / ~0.88

print(export_text(tree, feature_names=list(X.columns), decimals=2))
# |--- emi_ratio <= 0.45
# |   |--- credit_score <= 599.50
# |   |   |--- late_payments <= 1.50  -> class: 0
# |   |   |--- late_payments >  1.50  -> class: 1
# ...
for name, imp in sorted(zip(X.columns, tree.feature_importances_), key=lambda t: -t[1]):
    print(f"{name:14s} {imp:.3f}")`
    },
    {
      heading: "9. Random Forests and Gradient Boosting: Ensembles That Win on Tabular Data",
      content: `An **ensemble** combines many weak-ish models into one strong model. On structured, tabular data (the kind in every SQL database), tree ensembles are the state of the art and have been for a decade; deep learning rarely beats them there. Two families dominate.
**Random Forest: many independent trees, averaged.** Train hundreds of decision trees, each on a random **bootstrap sample** of the rows (sampling with replacement) and, at each split, consider only a random subset of the features (\`max_features\`, by default sqrt(n_features) for classification). Then average their predictions (or vote). The randomness makes the trees different from each other, and averaging many different overfit trees cancels out their individual noise. This is **bagging** (bootstrap aggregating). The result: much lower variance than a single tree, almost no tuning required, strong defaults, and \`n_estimators=100-500\` is usually enough. Random forests are hard to overfit badly, train in parallel (\`n_jobs=-1\`), and give **out-of-bag** error estimates for free (\`oob_score=True\`). Their weaknesses are size (hundreds of deep trees can be hundreds of megabytes) and slower prediction.
**Gradient Boosting: many sequential trees, each fixing the last one's mistakes.** Start with a simple prediction (the mean), compute the errors (**residuals**), fit a small tree to predict those residuals, add a fraction of it (the **learning rate**, e.g. 0.1) to the running prediction, and repeat for hundreds of rounds. Each new tree focuses on the rows the ensemble is still getting wrong. Boosting typically squeezes out more accuracy than a random forest, but it has more knobs that interact: \`learning_rate\` (lower is better but needs more trees), \`n_estimators\` / \`max_iter\`, \`max_depth\` (shallow, 3-8), and regularization like \`l2_regularization\`. Too many rounds with too high a learning rate will overfit, so use early stopping on a validation set.
In scikit-learn use **\`HistGradientBoostingClassifier\` / \`HistGradientBoostingRegressor\`**: they bin features into 255 buckets, train orders of magnitude faster than the older \`GradientBoostingClassifier\` on large data, natively handle missing values (NaN), support categorical features, and have early stopping built in. Outside scikit-learn, **XGBoost**, **LightGBM** and **CatBoost** are the production-grade boosting libraries that win most Kaggle tabular competitions; they follow the same \`fit\`/\`predict\` API and plug into scikit-learn pipelines.
**Which to pick?** Start with a random forest for a robust, low-effort strong baseline; move to histogram gradient boosting when you need the last few points of accuracy and can afford to tune. On the California Housing problem, linear regression gave R2 around 0.58; the snippet shows a random forest reaching around 0.80 and histogram gradient boosting around 0.83 with no tuning at all. That gap is why you learn ensembles.`,
      codeSnippet: `# ensembles_housing.py
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, HistGradientBoostingRegressor
from sklearn.inspection import permutation_importance
from sklearn.metrics import root_mean_squared_error, r2_score
import time

X, y = fetch_california_housing(return_X_y=True, as_frame=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

models = {
    "RandomForest": RandomForestRegressor(n_estimators=300, min_samples_leaf=2,
                                          n_jobs=-1, random_state=42),
    "HistGradientBoosting": HistGradientBoostingRegressor(
        learning_rate=0.1, max_iter=500, max_depth=None,
        early_stopping=True, validation_fraction=0.1, random_state=42),
}
for name, model in models.items():
    t0 = time.time()
    model.fit(X_train, y_train)
    pred = model.predict(X_test)
    print(f"{name:20s} RMSE={root_mean_squared_error(y_test, pred):.3f}  "
          f"R2={r2_score(y_test, pred):.3f}  ({time.time() - t0:.1f}s)")
# RandomForest         RMSE=0.505  R2=0.806  (~15s)     (approximately)
# HistGradientBoosting RMSE=0.470  R2=0.832  (~2s)      (approximately)

hgb = models["HistGradientBoosting"]
print("boosting rounds actually used:", hgb.n_iter_)   # early stopping picked this

# Permutation importance: how much does RMSE worsen when we shuffle each column?
# (more reliable than impurity-based feature_importances_)
imp = permutation_importance(hgb, X_test, y_test, n_repeats=5, random_state=42,
                             scoring="neg_root_mean_squared_error")
for name, score in sorted(zip(X.columns, imp.importances_mean), key=lambda t: -t[1]):
    print(f"{name:12s} {score:.3f}")
# MedInc, Latitude, Longitude dominate -> location and income drive house prices`
    },
    {
      heading: "10. scikit-learn Pipelines, ColumnTransformer and Cross-Validation",
      content: `Real datasets have numeric columns that need scaling, categorical columns that need encoding, and missing values that need imputing. Doing these steps by hand, separately for train and test, is where most **data leakage** bugs are born. scikit-learn's answer is the **Pipeline**: a chain of transformers ending in a model, which behaves like a single estimator.
When you call \`pipeline.fit(X_train, y_train)\`, each transformer is fit on the training data and the transformed output flows to the next step. When you call \`pipeline.predict(X_test)\`, each step only transforms, using what it learned. Leakage becomes structurally impossible, you cannot forget to scale test data, and the whole thing serializes as one object for deployment.
**ColumnTransformer** applies different preprocessing to different columns: \`StandardScaler\` to the numeric ones, \`OneHotEncoder(handle_unknown="ignore")\` to the categorical ones (so an unseen city at prediction time becomes all zeros instead of crashing), \`SimpleImputer\` to fill missing values. Columns can be selected by name, by index, or with \`make_column_selector(dtype_include="object")\`.
**Cross-validation** solves a different problem: a single train/test split gives one noisy number. **k-fold cross-validation** splits the training data into k folds (5 or 10), trains k times each holding out a different fold, and reports the mean and standard deviation of the scores. That standard deviation tells you whether a 0.5% difference between two models is real. Use \`StratifiedKFold\` for classification (the default in \`cross_val_score\` when y is categorical), \`KFold\` with shuffle for regression, and \`TimeSeriesSplit\` when rows are ordered in time (never let the model train on the future and test on the past).
**Hyperparameter tuning** combines both ideas. \`GridSearchCV\` tries every combination in a grid, \`RandomizedSearchCV\` samples a fixed number of random combinations (far better when you have more than three or four hyperparameters), and \`HalvingRandomSearchCV\` is a faster successive-halving variant. Pipeline step parameters are addressed with double underscores: \`"model__max_depth"\`. After the search, \`best_estimator_\` is already refit on all training data and ready to evaluate on the test set.
**Cross-validate the whole pipeline, never just the model.** If you scale or select features before cross-validation, every fold's "held-out" data has already influenced preprocessing, and your CV score is optimistic. Put the preprocessing inside the pipeline and pass the pipeline to \`cross_val_score\`.`,
      codeSnippet: `# pipeline_mixed_data.py
import numpy as np, pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score, RandomizedSearchCV, StratifiedKFold

rng = np.random.default_rng(7)
n = 3000
df = pd.DataFrame({
    "age":          rng.integers(21, 60, n),
    "income_lakh":  rng.normal(8, 3, n).round(1),
    "city":         rng.choice(["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Pune"], n),
    "employment":   rng.choice(["salaried", "self-employed", "student"], n, p=[0.6, 0.3, 0.1]),
})
df.loc[rng.random(n) < 0.08, "income_lakh"] = np.nan        # 8% missing incomes
logit = -3 + 0.25 * df.income_lakh.fillna(8) - 0.02 * df.age + (df.employment == "salaried") * 0.8
df["approved"] = (rng.random(n) < 1 / (1 + np.exp(-logit))).astype(int)

X, y = df.drop(columns="approved"), df["approved"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2,
                                                    random_state=42, stratify=y)

numeric = ["age", "income_lakh"]
categorical = ["city", "employment"]

preprocess = ColumnTransformer([
    ("num", Pipeline([("impute", SimpleImputer(strategy="median")),
                      ("scale", StandardScaler())]), numeric),
    ("cat", OneHotEncoder(handle_unknown="ignore"), categorical),
])

pipe = Pipeline([
    ("prep", preprocess),
    ("model", RandomForestClassifier(n_estimators=200, n_jobs=-1, random_state=42)),
])

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(pipe, X_train, y_train, cv=cv, scoring="roc_auc")
print("CV ROC-AUC: %.3f +/- %.3f" % (scores.mean(), scores.std()))

search = RandomizedSearchCV(
    pipe,
    param_distributions={
        "model__max_depth": [None, 4, 6, 8, 12],
        "model__min_samples_leaf": [1, 2, 5, 10, 20],
        "model__max_features": ["sqrt", 0.5, None],
    },
    n_iter=12, cv=cv, scoring="roc_auc", n_jobs=-1, random_state=42,
)
search.fit(X_train, y_train)
print("best params:", search.best_params_)
print("best CV ROC-AUC:", round(search.best_score_, 3))
print("test ROC-AUC   :", round(search.score(X_test, y_test), 3))

# Names of the engineered features that reach the model
print(search.best_estimator_.named_steps["prep"].get_feature_names_out()[:6])
# ['num__age' 'num__income_lakh' 'cat__city_Bengaluru' 'cat__city_Delhi' ...]`
    },
    {
      heading: "11. Handling Class Imbalance in Classification",
      content: `**Class imbalance** means one class is far rarer than the other: 0.1% of transactions are fraud, 3% of patients have the disease, 5% of users churn this month. It is the normal case for the most valuable classification problems, and it breaks naive training in two ways. First, the model is rewarded for predicting the majority class (log loss and Gini both improve if you mostly say "no"), so it learns to ignore the minority. Second, accuracy becomes meaningless, as section 6 showed.
Here is the toolbox, roughly in the order you should try things:
**1. Use the right metric and a stratified split.** Evaluate with ROC-AUC, precision-recall AUC, F1 or recall at a fixed precision. Pass \`stratify=y\` to \`train_test_split\` and use \`StratifiedKFold\`, so a fold does not end up with zero positives.
**2. Tune the decision threshold.** Often the model already ranks positives well (high ROC-AUC) and only the 0.5 cut-off is wrong. Pick the threshold from the precision-recall curve on validation data to meet the business constraint ("at least 90% recall"). scikit-learn 1.5+ has \`TunedThresholdClassifierCV\`, which wraps any classifier and learns the threshold via cross-validation.
**3. Reweight the loss: \`class_weight="balanced"\`.** Supported by \`LogisticRegression\`, \`DecisionTreeClassifier\`, \`RandomForestClassifier\`, \`SVC\` and others. Each minority example counts as much as (n_majority / n_minority) majority examples, so the optimizer cannot ignore them. For \`HistGradientBoostingClassifier\` use \`class_weight="balanced"\` (1.2+) or pass \`sample_weight\` to \`fit\`. This is cheap, principled and usually the first thing that works.
**4. Resample the training data.** **Undersampling** throws away majority rows (fast, loses information); **oversampling** duplicates minority rows; **SMOTE** synthesizes new minority points by interpolating between neighbours. These live in the companion library **imbalanced-learn** (\`pip install imbalanced-learn\`), whose \`imblearn.pipeline.Pipeline\` makes sure resampling happens only on the training folds inside cross-validation. Resampling the test set, or resampling before the split, is a classic leakage bug that produces fantastic fake scores.
**5. Collect more minority data or better features.** Boring, but often the real fix.
Two warnings. Reweighting and resampling distort the predicted probabilities: a model trained with balanced weights will say 0.6 for cases that are really 10% likely. If you need calibrated probabilities (for pricing risk, for example), either tune the threshold instead or recalibrate afterwards with \`CalibratedClassifierCV\`. And never report accuracy on an imbalanced problem without also reporting what the majority-class baseline achieves.`,
      codeSnippet: `# class_imbalance.py
import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.metrics import precision_score, recall_score, f1_score, roc_auc_score, precision_recall_curve

X, y = make_classification(n_samples=20000, n_features=20, n_informative=8,
                           weights=[0.98, 0.02], flip_y=0.01, random_state=42)
print("positives:", y.sum(), "of", len(y))           # ~400 of 20000 (2%)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3,
                                                    random_state=42, stratify=y)

def report(name, model, threshold=0.5):
    proba = model.predict_proba(X_test)[:, 1]
    pred = (proba >= threshold).astype(int)
    print(f"{name:34s} P={precision_score(y_test, pred, zero_division=0):.2f} "
          f"R={recall_score(y_test, pred):.2f} F1={f1_score(y_test, pred):.2f} "
          f"AUC={roc_auc_score(y_test, proba):.3f}")

# 1. Naive: good AUC, terrible recall at the default threshold
naive = LogisticRegression(max_iter=1000).fit(X_train, y_train)
report("logreg (default)", naive)                    # e.g. P=0.75 R=0.25 ...

# 2. Same model, threshold chosen for >= 80% recall on training data
proba_tr = naive.predict_proba(X_train)[:, 1]
prec, rec, thr = precision_recall_curve(y_train, proba_tr)
t = thr[np.argmax(rec[:-1] <= 0.80)]                 # last threshold with recall >= 0.80
report(f"logreg (threshold={t:.2f})", naive, threshold=t)

# 3. Class weights: minority rows count ~49x more in the loss
weighted = LogisticRegression(max_iter=1000, class_weight="balanced").fit(X_train, y_train)
report("logreg (class_weight=balanced)", weighted)   # recall jumps, precision drops

# 4. Boosting with class weights (strong default for imbalanced tabular data)
hgb = HistGradientBoostingClassifier(class_weight="balanced", random_state=42).fit(X_train, y_train)
report("HGB (class_weight=balanced)", hgb)

# 5. SMOTE oversampling, correctly placed INSIDE a pipeline so it only touches training folds
#    pip install imbalanced-learn
# from imblearn.over_sampling import SMOTE
# from imblearn.pipeline import Pipeline as ImbPipeline
# smote_pipe = ImbPipeline([("smote", SMOTE(random_state=42)),
#                           ("model", LogisticRegression(max_iter=1000))]).fit(X_train, y_train)
# report("logreg + SMOTE", smote_pipe)`
    },
    {
      heading: "12. Saving and Loading scikit-learn Models with joblib",
      content: `A trained model is just a Python object holding learned arrays. To use it from a web API, a batch job or a colleague's notebook you need to **serialize** it to disk. The standard tool for scikit-learn is **joblib**, which is pickle optimized for objects containing large NumPy arrays (it stores them efficiently and can compress them). \`joblib.dump(obj, path)\` writes, \`joblib.load(path)\` reads.
**Save the whole pipeline, not just the model.** If you saved only the \`RandomForestClassifier\`, the API would have to reproduce the exact scaler means, one-hot column order and imputation medians by hand, and any mismatch silently produces garbage predictions. A pipeline captures preprocessing and model as one object, so \`loaded.predict(raw_dataframe)\` just works.
**Version everything.** Pickled objects are tied to the library versions that created them; loading a model saved with scikit-learn 1.3 in 1.6 may warn or fail. Save a small metadata JSON next to the model with the scikit-learn, NumPy and Python versions, the training date, the feature names in order, the metrics on the test set and the git commit. Pin the same scikit-learn version in the serving environment's \`requirements.txt\`. For a more formal setup, tools like MLflow do this registry work for you, but the JSON-next-to-the-file habit is enough to start.
**Security.** joblib and pickle execute arbitrary code on load. Only load model files you created or trust completely; never load a \`.joblib\` uploaded by a user. This is the same warning you see on Hugging Face for \`.bin\` PyTorch files, and it is why the ecosystem is moving toward safetensors and ONNX for sharing weights.
**Alternatives:** \`skops\` offers a safer, inspectable format for scikit-learn models; **ONNX** (via \`skl2onnx\`) exports the model to a language-neutral graph you can run from JavaScript, C# or Java with ONNX Runtime, which is the route if your Next.js backend needs to run the model without a Python service. For most teams, though, the pattern is: joblib file in object storage, loaded once at startup by a FastAPI service, called over HTTP from the Next.js app.`,
      codeSnippet: `# save_and_load.py
import json, sys, datetime
import joblib, sklearn, numpy as np, pandas as pd
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score

data = load_breast_cancer(as_frame=True)
X_train, X_test, y_train, y_test = train_test_split(data.data, data.target,
                                                    test_size=0.2, random_state=42, stratify=data.target)
pipe = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000)).fit(X_train, y_train)
auc = roc_auc_score(y_test, pipe.predict_proba(X_test)[:, 1])

# 1. Save the ENTIRE pipeline (scaler + model), compressed
joblib.dump(pipe, "cancer_model_v1.joblib", compress=3)

# 2. Save metadata next to it so the serving side can validate inputs and versions
meta = {
    "model_file": "cancer_model_v1.joblib",
    "trained_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    "sklearn_version": sklearn.__version__,
    "numpy_version": np.__version__,
    "python_version": sys.version.split()[0],
    "feature_names": list(X_train.columns),
    "classes": [int(c) for c in pipe.classes_],
    "test_roc_auc": round(float(auc), 4),
}
with open("cancer_model_v1.json", "w") as f:
    json.dump(meta, f, indent=2)

# 3. Later, in a different process (e.g. a FastAPI service at startup)
loaded = joblib.load("cancer_model_v1.joblib")
with open("cancer_model_v1.json") as f:
    meta = json.load(f)
if meta["sklearn_version"] != sklearn.__version__:
    print("WARNING: model trained with sklearn", meta["sklearn_version"])

# Validate incoming request columns, then predict on a raw DataFrame
row = X_test.iloc[[0]]                                   # pretend this came from an HTTP request
assert list(row.columns) == meta["feature_names"], "feature mismatch"
p_benign = loaded.predict_proba(row)[0, 1]
print(f"P(benign) = {p_benign:.3f}")

# Sanity check: loaded model gives identical predictions
assert np.allclose(loaded.predict_proba(X_test), pipe.predict_proba(X_test))
print("round-trip OK")`
    },
    {
      heading: "13. Real-World Use Cases: How Supervised Learning Is Used in Production",
      content: `Supervised learning with scikit-learn is not a teaching toy; it runs quietly inside products you use every day. Here is how the models from this lecture map to real systems, including how an AI engineer combines them with LLMs.
**Credit scoring and loan approval (classification).** An NBFC trains logistic regression or gradient boosting on applicant income, bureau score, EMI ratio, employment type and repayment history to predict default probability. Logistic regression often ships because regulators (RBI guidelines on model risk) demand explainable decisions, and the coefficients map directly to a reason code: "declined because EMI-to-income ratio above 50%". The threshold is tuned to the lender's risk appetite, not left at 0.5.
**Dynamic pricing and demand forecasting (regression).** A quick-commerce app predicts next-hour order volume per dark store from day-of-week, weather, past demand and local events using HistGradientBoostingRegressor, then uses the prediction to position riders. A hotel aggregator predicts room price elasticity. The metric reported to management is MAE in orders or rupees because it is interpretable.
**Fraud and anomaly detection (imbalanced classification).** UPI and card networks score every transaction in under 50 ms. Gradient boosting with class weights plus a tuned threshold is a standard architecture; the precision-recall trade-off is literally a trade-off between lost money and annoyed customers whose cards get blocked.
**Churn prediction (classification).** Telecom and SaaS companies predict which customers will leave next month so retention teams can intervene. Recall matters most (missing a churner is costly; a wasted retention call is cheap), and the feature importances tell the product team what drives churn.
**Lead scoring and ticket routing (multi-class classification).** A support desk classifies incoming tickets into "billing", "bug", "feature request", "abuse" with a model trained on historical tickets. Today the features are often sentence embeddings from a transformer model, and the classifier on top is plain logistic regression from scikit-learn: fast, cheap, and accurate.
**Inside LLM systems.** Supervised learning is everywhere in the LLM stack: a lightweight classifier decides whether a user query needs retrieval or can be answered directly (saving tokens); a regression model trained on human ratings scores candidate answers (a reward model, conceptually); a logistic regression on embeddings routes requests between a small cheap model and a large expensive one; and evaluation harnesses use precision, recall and F1 to measure whether an LLM-based extractor pulled the right fields from invoices. Knowing this lecture is what lets you measure LLM features instead of guessing.`,
      codeSnippet: `# ticket_router.py — classical ML on top of text, the way modern support desks do it
# Uses a TF-IDF bag-of-words here; in production swap the vectorizer for sentence embeddings
# (e.g. from sentence-transformers) and keep the same LogisticRegression on top.
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import cross_val_score

tickets = [
    ("I was charged twice for my Pro plan this month", "billing"),
    ("Refund not received after cancellation", "billing"),
    ("Invoice shows wrong GST number", "billing"),
    ("App crashes when I open the reports tab", "bug"),
    ("Export to PDF gives a blank file", "bug"),
    ("Login button does nothing on Safari", "bug"),
    ("Please add dark mode to the dashboard", "feature"),
    ("Would love WhatsApp notifications for new orders", "feature"),
    ("Can you support UPI autopay for subscriptions?", "feature"),
    ("Payment failed but money deducted from my account", "billing"),
    ("Search results are empty after the latest update", "bug"),
    ("It would help to bulk-upload products via CSV", "feature"),
]
texts, labels = zip(*tickets)

router = make_pipeline(
    TfidfVectorizer(ngram_range=(1, 2), min_df=1),
    LogisticRegression(max_iter=1000, C=5.0),
)
print("CV accuracy:", cross_val_score(router, texts, labels, cv=3).mean().round(2))
router.fit(texts, labels)

new = ["Money got deducted but order shows unpaid", "Add a dark theme please",
       "Dashboard shows 500 error since morning"]
for t, label, proba in zip(new, router.predict(new), router.predict_proba(new).max(axis=1)):
    print(f"{label:8s} ({proba:.2f})  {t}")
# billing  (0.5x)  Money got deducted but order shows unpaid
# feature  (0.4x)  Add a dark theme please
# bug      (0.4x)  Dashboard shows 500 error since morning
# Low-confidence predictions (< 0.5) can be escalated to an LLM or a human.`
    },
    {
      heading: "14. Common Mistakes in Supervised Learning and How to Fix Them",
      content: `These are the errors that show up in code reviews, Kaggle notebooks and production incidents again and again. Each one has a simple fix.
**1. Data leakage through preprocessing.** Calling \`scaler.fit_transform(X)\` on the full dataset before splitting, or fitting an imputer on all rows. The test score is inflated and the production model underperforms. **Fix:** split first, then put every preprocessing step inside a \`Pipeline\` so it is fit only on training folds.
**2. Target leakage through features.** Including a column that is only known after the label, such as "amount recovered by collections" in a default model, or "days until cancellation" in a churn model. The model scores 99% and is useless. **Fix:** for each feature ask "would this value be available at the moment of prediction?" and drop anything that would not.
**3. Evaluating on the training set.** \`model.score(X_train, y_train)\` reports near-perfect numbers for trees and KNN. **Fix:** report cross-validation scores on training data and one final score on the untouched test set.
**4. Using the test set repeatedly.** Tuning hyperparameters while watching the test score turns it into a validation set and your "test" estimate becomes optimistic. **Fix:** tune with \`GridSearchCV\` on the training set; touch the test set once at the end.
**5. Trusting accuracy on imbalanced data.** 97% accuracy with 3% positives is the no-skill baseline. **Fix:** always print the \`DummyClassifier\` baseline and report precision, recall, F1 and ROC-AUC.
**6. Forgetting to scale distance- and gradient-based models.** KNN, logistic regression, SVM, Ridge and Lasso all need \`StandardScaler\`; trees and forests do not. **Fix:** make scaling the first step of the pipeline for those models.
**7. One-hot encoding without \`handle_unknown="ignore"\`.** A new city appears in production and the service crashes with a ValueError. **Fix:** set \`handle_unknown="ignore"\` and log unknown categories.
**8. Passing a 1-D array as X.** \`model.fit([1, 2, 3], y)\` raises "Expected 2D array, got 1D array instead". **Fix:** reshape with \`X.reshape(-1, 1)\` or keep X as a DataFrame with one column.
**9. Fitting the transformer again on test data.** Calling \`scaler.fit_transform(X_test)\` instead of \`scaler.transform(X_test)\` shifts the test data to a different scale than the model learned. **Fix:** fit on train only, transform everywhere else; or just use a pipeline and let it handle this.
**10. Random train/test split on time-series data.** Shuffling rows means training on March to predict February. **Fix:** split by time (train on older rows, test on newer) and use \`TimeSeriesSplit\` for cross-validation.
**11. Unbounded decision trees and boosting without early stopping.** Both overfit. **Fix:** set \`max_depth\` / \`min_samples_leaf\`, and enable \`early_stopping=True\` with a validation fraction for gradient boosting.
**12. Saving only the model, not the pipeline, and not pinning versions.** The API silently applies different preprocessing or fails to unpickle after an upgrade. **Fix:** \`joblib.dump\` the full pipeline, store a metadata JSON, pin \`scikit-learn==x.y.z\` in the serving environment.`,
      codeSnippet: `# leakage_demo.py — the most expensive mistake, shown side by side
import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline

# 100 rows, 5000 random features, labels unrelated to features => true accuracy is 50%
rng = np.random.default_rng(0)
X = rng.normal(size=(100, 5000))
y = rng.integers(0, 2, 100)
cv = StratifiedKFold(5, shuffle=True, random_state=0)

# WRONG: select the 20 "best" features using ALL rows (test folds included), then cross-validate
X_sel = SelectKBest(f_classif, k=20).fit_transform(X, y)
wrong = cross_val_score(LogisticRegression(), X_sel, y, cv=cv).mean()
print(f"leaky CV accuracy : {wrong:.2f}")     # ~0.80-0.95  <- impossible on random data

# RIGHT: feature selection inside the pipeline, re-fit on every training fold
pipe = make_pipeline(SelectKBest(f_classif, k=20), LogisticRegression())
right = cross_val_score(pipe, X, y, cv=cv).mean()
print(f"honest CV accuracy: {right:.2f}")     # ~0.45-0.55  <- the truth`
    },
    {
      heading: "15. Frequently Asked Questions about Supervised Learning and scikit-learn",
      content: `**What is the difference between regression and classification in machine learning?**
Regression predicts a continuous number (price, temperature, delivery time) and is evaluated with error metrics like MAE, RMSE and R2. Classification predicts a discrete category (spam/not spam, which of five product types) and is evaluated with accuracy, precision, recall, F1 and ROC-AUC. Many algorithms have both flavours in scikit-learn, for example \`RandomForestRegressor\` and \`RandomForestClassifier\`.
**Is logistic regression a regression or classification algorithm?**
It is a classification algorithm. The name comes from its history: it fits a linear model to the log-odds of the positive class, then applies the sigmoid to produce a probability. You use \`predict_proba\` to get that probability and \`predict\` to get the class at a 0.5 threshold.
**When should I use precision vs recall?**
Use precision when false positives are costly (blocking a legitimate card, marking a real email as spam). Use recall when false negatives are costly (missing cancer, missing fraud). When both matter, use F1 or choose a threshold that satisfies a constraint such as "recall at least 90%, then maximize precision".
**What is the difference between random forest and gradient boosting?**
A random forest trains many deep trees independently on random subsets of rows and features and averages them, which reduces variance; it is robust and needs little tuning. Gradient boosting trains shallow trees one after another, each correcting the previous ensemble's residual errors; it usually achieves higher accuracy but is more sensitive to learning rate and number of rounds and needs early stopping.
**Do I need to scale features for decision trees and random forests?**
No. Tree splits compare a feature against a threshold, so multiplying a column by 1000 produces the same tree. Scaling is required for distance-based (KNN, SVM) and gradient-based linear models (logistic regression, Ridge, Lasso, neural networks).
**How do I choose between MAE and RMSE?**
Choose MAE when every unit of error costs the same and you want robustness to outliers. Choose RMSE when large errors are disproportionately bad, because squaring amplifies them. Report both; a large gap between RMSE and MAE indicates a few very large errors worth investigating.
**What does ROC-AUC of 0.5 mean?**
The model ranks positives and negatives no better than random guessing. 1.0 means every positive is scored higher than every negative. ROC-AUC does not depend on a threshold, which makes it a good metric for comparing models before you decide the operating point.
**Should I use pickle or joblib to save a scikit-learn model?**
Use joblib: it handles large NumPy arrays more efficiently and supports compression. Both execute code on load, so only load files you trust, and record the scikit-learn version the model was trained with because pickles are not guaranteed to be compatible across versions.`
    },
    {
      heading: "16. Interview Questions and Answers on scikit-learn and Supervised Learning",
      content: `**Q1. Explain the bias-variance trade-off with examples from this lecture.**
Bias is error from a model being too simple to capture the pattern (linear regression on a U-shaped relationship underfits, high bias). Variance is error from a model being too sensitive to the specific training rows (an unconstrained decision tree memorizes noise, high variance). Regularization (Ridge's alpha, tree depth limits) trades a little bias for a big drop in variance. Ensembles like random forests reduce variance by averaging many high-variance trees.
**Q2. What is data leakage and how does a Pipeline prevent it?**
Leakage is when information that would not be available at prediction time influences training, most commonly by fitting preprocessing (scaler, imputer, feature selector) on data that includes the test rows. A Pipeline fits every transformer only on the training data passed to \`fit\`, and cross-validation re-fits the whole pipeline on each training fold, so held-out rows never influence preprocessing.
**Q3. Walk me through the confusion matrix and derive precision, recall and F1.**
Rows are actual classes, columns are predicted. For labels [0, 1] scikit-learn returns [[TN, FP], [FN, TP]]. Precision = TP / (TP + FP), the purity of positive predictions. Recall = TP / (TP + FN), the share of real positives found. F1 = 2 x precision x recall / (precision + recall), the harmonic mean, which stays low if either one is low.
**Q4. Your fraud model has 99.5% accuracy. Is it good?**
Not necessarily. If 0.5% of transactions are fraud, predicting "genuine" for every row gives 99.5% accuracy with zero fraud caught. I would check the majority-class baseline, then look at recall and precision on the fraud class, ROC-AUC and precision-recall AUC, and choose a threshold based on the cost of missed fraud versus blocked customers.
**Q5. How does a decision tree decide where to split?**
At each node it evaluates candidate (feature, threshold) pairs and picks the one that most reduces impurity: Gini impurity or entropy for classification, mean squared error for regression. It is greedy (locally optimal at each step), which is why single trees are unstable and why ensembles help.
**Q6. Why does KNN need feature scaling but random forest does not?**
KNN computes Euclidean distances across all features, so a feature with a larger numeric range dominates the distance. Standardizing puts every feature on the same scale. A tree only asks "is feature j less than threshold t?", which is invariant to monotonic rescaling of feature j.
**Q7. What is the difference between \`fit\`, \`transform\`, \`fit_transform\` and \`predict\`?**
\`fit\` learns parameters from data (means for a scaler, coefficients for a model). \`transform\` applies a learned transformation to data and is used on test data with a transformer that was fit on training data. \`fit_transform\` does both on training data. \`predict\` produces outputs from a fitted model; \`predict_proba\` gives class probabilities.
**Q8. How would you handle a dataset with 1% positive class?**
Stratified splitting and cross-validation; metrics that ignore the easy negatives (PR-AUC, recall, F1); \`class_weight="balanced"\` or sample weights so the loss pays attention to positives; threshold tuning on a validation set; optionally SMOTE or undersampling inside an imbalanced-learn pipeline; and recalibrating probabilities if downstream systems need them to be accurate.
**Q9. What are the hyperparameters you would tune for gradient boosting, and how?**
Learning rate (0.01-0.3), number of boosting rounds (with early stopping), max depth or max leaf nodes (shallow, 3-8 levels), minimum samples per leaf, L2 regularization, and subsampling fraction. I would use \`RandomizedSearchCV\` or a Bayesian optimizer over a pipeline with stratified k-fold cross-validation on a metric aligned with the business goal.
**Q10. Why save the entire pipeline with joblib rather than only the model?**
The model's inputs are the outputs of the preprocessing steps: scaled numeric columns in a specific order plus one-hot columns for specific categories. If only the model is saved, serving code must reproduce that preprocessing exactly, and any mismatch (a different category order, a different median for imputation) produces wrong predictions without errors. Saving the pipeline makes the artifact self-contained; versions should still be pinned and recorded.`
    },
    {
      heading: "17. Hands-On Exercise: Build, Compare and Ship a Loan Default Classifier",
      content: `Time to put the whole lecture together in one runnable script. You will build an end-to-end supervised learning project on a synthetic but realistic loan-application dataset with numeric, categorical and missing values, and you will do it the way a production team does: baseline first, pipeline for preprocessing, cross-validated comparison of three model families, threshold tuning for a business constraint, a single final test evaluation, and a saved artifact with metadata.
**Your tasks:**
1. Run the script as-is and read every printed line. Make sure you can explain why the baseline accuracy is high but its recall is zero.
2. The business rule is "catch at least 75% of defaults". Observe which threshold the script picks and what precision that costs.
3. Add a fourth model, \`KNeighborsClassifier\`, to the \`candidates\` dictionary. It needs the scaled pipeline. Does it beat logistic regression on ROC-AUC?
4. Replace \`class_weight="balanced"\` on the random forest with \`class_weight=None\` and rerun. Note how recall at the default threshold changes and why threshold tuning still rescues it.
5. Write a tiny second script that loads \`loan_model.joblib\`, builds a one-row DataFrame for a new applicant (for example a 29-year-old self-employed applicant from Pune earning 6.5 lakh with an EMI ratio of 0.52) and prints the default probability and decision.
**Stretch goal:** wrap the loaded model in a FastAPI endpoint (\`POST /score\`) and call it from a Next.js Route Handler with \`fetch\`. That is exactly the architecture you will use in later lectures when scikit-learn models and LLM calls live side by side in one product.
The script needs only scikit-learn, pandas, NumPy and joblib. It generates its own data, so there is nothing to download, and it runs in under a minute on a laptop.`,
      codeSnippet: `# loan_default_project.py
# End-to-end supervised learning: baseline -> pipeline -> model comparison -> threshold -> save
import json, sys
import numpy as np, pandas as pd, joblib, sklearn
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_validate
from sklearn.dummy import DummyClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, HistGradientBoostingClassifier
from sklearn.metrics import (roc_auc_score, precision_score, recall_score, f1_score,
                             confusion_matrix, precision_recall_curve, classification_report)

# ---------- 1. Generate a realistic loan dataset (12% default rate) ----------
rng = np.random.default_rng(2026)
n = 8000
df = pd.DataFrame({
    "age":            rng.integers(21, 65, n),
    "income_lakh":    np.clip(rng.lognormal(mean=2.0, sigma=0.5, n=n), 1.5, 60).round(1),
    "loan_amount_lakh": np.clip(rng.lognormal(mean=1.8, sigma=0.6, n=n), 0.5, 80).round(1),
    "emi_ratio":      np.clip(rng.beta(2, 5, n), 0.02, 0.95).round(2),
    "credit_score":   np.clip(rng.normal(700, 80, n), 300, 900).astype(int),
    "late_payments":  rng.poisson(0.7, n),
    "city":           rng.choice(["Mumbai", "Delhi", "Bengaluru", "Chennai", "Pune", "Jaipur"], n),
    "employment":     rng.choice(["salaried", "self-employed", "business", "student"], n,
                                 p=[0.55, 0.25, 0.15, 0.05]),
})
df.loc[rng.random(n) < 0.06, "credit_score"] = np.nan      # missing bureau score
df.loc[rng.random(n) < 0.04, "income_lakh"] = np.nan       # undeclared income

cs = df.credit_score.fillna(650)
logit = (-4.2 + 4.0 * df.emi_ratio - 0.006 * (cs - 700) + 0.45 * df.late_payments
         + 0.6 * (df.employment == "student") + 0.3 * (df.employment == "self-employed")
         - 0.02 * df.income_lakh.fillna(7))
df["default"] = (rng.random(n) < 1 / (1 + np.exp(-logit))).astype(int)
print("default rate:", round(df.default.mean(), 3))

X, y = df.drop(columns="default"), df["default"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2,
                                                    random_state=42, stratify=y)

# ---------- 2. Preprocessing ----------
numeric = ["age", "income_lakh", "loan_amount_lakh", "emi_ratio", "credit_score", "late_payments"]
categorical = ["city", "employment"]
scaled_prep = ColumnTransformer([
    ("num", Pipeline([("impute", SimpleImputer(strategy="median")), ("scale", StandardScaler())]), numeric),
    ("cat", OneHotEncoder(handle_unknown="ignore"), categorical),
])
tree_prep = ColumnTransformer([              # trees do not need scaling
    ("num", SimpleImputer(strategy="median"), numeric),
    ("cat", OneHotEncoder(handle_unknown="ignore"), categorical),
])

# ---------- 3. Baseline ----------
dummy = DummyClassifier(strategy="most_frequent").fit(X_train, y_train)
d_pred = dummy.predict(X_test)
print(f"baseline  accuracy={np.mean(d_pred == y_test):.3f}  recall={recall_score(y_test, d_pred):.2f}")

# ---------- 4. Candidate pipelines, compared with 5-fold stratified CV ----------
candidates = {
    "logreg": Pipeline([("prep", scaled_prep),
                        ("model", LogisticRegression(max_iter=2000, class_weight="balanced"))]),
    "random_forest": Pipeline([("prep", tree_prep),
                               ("model", RandomForestClassifier(n_estimators=300, min_samples_leaf=5,
                                                                class_weight="balanced",
                                                                n_jobs=-1, random_state=42))]),
    "hist_gb": Pipeline([("prep", tree_prep),
                         ("model", HistGradientBoostingClassifier(learning_rate=0.05, max_iter=400,
                                                                  early_stopping=True,
                                                                  class_weight="balanced",
                                                                  random_state=42))]),
}
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
results = {}
for name, pipe in candidates.items():
    r = cross_validate(pipe, X_train, y_train, cv=cv,
                       scoring=["roc_auc", "average_precision", "f1"], n_jobs=-1)
    results[name] = r["test_roc_auc"].mean()
    print(f"{name:14s} ROC-AUC={r['test_roc_auc'].mean():.3f}+/-{r['test_roc_auc'].std():.3f}  "
          f"PR-AUC={r['test_average_precision'].mean():.3f}  F1={r['test_f1'].mean():.3f}")

best_name = max(results, key=results.get)
best = candidates[best_name].fit(X_train, y_train)
print("selected model:", best_name)

# ---------- 5. Threshold for the business rule: recall >= 0.75 ----------
# Use out-of-fold probabilities on TRAIN so the threshold is not tuned on the test set
from sklearn.model_selection import cross_val_predict
oof = cross_val_predict(candidates[best_name], X_train, y_train, cv=cv, method="predict_proba")[:, 1]
prec, rec, thr = precision_recall_curve(y_train, oof)
ok = np.where(rec[:-1] >= 0.75)[0]
threshold = float(thr[ok[-1]])                 # highest threshold that still gives recall >= 0.75
print(f"threshold={threshold:.3f}  (train OOF precision={prec[ok[-1]]:.2f}, recall={rec[ok[-1]]:.2f})")

# ---------- 6. Single, final evaluation on the untouched test set ----------
proba = best.predict_proba(X_test)[:, 1]
pred = (proba >= threshold).astype(int)
tn, fp, fn, tp = confusion_matrix(y_test, pred).ravel()
print(f"TEST  ROC-AUC={roc_auc_score(y_test, proba):.3f}  precision={precision_score(y_test, pred):.2f}  "
      f"recall={recall_score(y_test, pred):.2f}  F1={f1_score(y_test, pred):.2f}")
print(f"      TN={tn} FP={fp} FN={fn} TP={tp}")
print(classification_report(y_test, pred, target_names=["repaid", "default"], digits=3))

# ---------- 7. Save the artifact + metadata ----------
joblib.dump(best, "loan_model.joblib", compress=3)
meta = {
    "model": best_name,
    "threshold": threshold,
    "feature_names": list(X.columns),
    "sklearn_version": sklearn.__version__,
    "python_version": sys.version.split()[0],
    "test_roc_auc": round(float(roc_auc_score(y_test, proba)), 4),
}
json.dump(meta, open("loan_model.json", "w"), indent=2)

# ---------- 8. Round trip: load and score one new applicant ----------
loaded = joblib.load("loan_model.joblib")
applicant = pd.DataFrame([{
    "age": 29, "income_lakh": 6.5, "loan_amount_lakh": 4.0, "emi_ratio": 0.52,
    "credit_score": 640, "late_payments": 2, "city": "Pune", "employment": "self-employed",
}])
p = loaded.predict_proba(applicant)[0, 1]
print(f"applicant P(default)={p:.3f} -> {'REVIEW' if p >= threshold else 'APPROVE'}")

# Expected (approximately; numbers vary slightly by machine):
# default rate: 0.12
# baseline  accuracy=0.88  recall=0.00
# logreg         ROC-AUC=0.84+/-0.01 ...
# random_forest  ROC-AUC=0.83+/-0.01 ...
# hist_gb        ROC-AUC=0.84+/-0.01 ...
# TEST  ROC-AUC=0.84  precision=0.3x  recall=0.7x  F1=0.4x
# applicant P(default)=0.6x -> REVIEW`
    },
    {
      heading: "18. Summary",
      content: `This lecture took you from "what is supervised learning" to a saved, deployable classifier with honest metrics. The key points to carry forward:
• **Supervised learning** learns a mapping from features to labels; **regression** predicts numbers, **classification** predicts categories.
• The **ML workflow** is: define the metric, split data, preprocess inside a pipeline, baseline, cross-validate, tune, evaluate once on the test set, save, monitor. The algorithm is a small part of it.
• scikit-learn's uniform API: **\`fit\`** learns, **\`predict\`** / **\`predict_proba\`** answer, **\`transform\`** preprocesses; learned attributes end in an underscore; X is always 2-D.
• **Linear regression** is interpretable and fast; evaluate it with **MAE** (robust, in target units), **RMSE** (punishes big errors) and **R2** (fraction of variance explained).
• **Logistic regression** outputs calibrated probabilities through the sigmoid; scale its inputs, tune \`C\`, and choose the threshold deliberately.
• **Accuracy lies on imbalanced data.** Read the **confusion matrix**, then **precision** (cost of false alarms), **recall** (cost of misses), **F1** (their harmonic mean) and **ROC-AUC** (threshold-free ranking quality).
• **KNN** predicts by similarity and must be scaled; it is the ancestor of vector search in RAG.
• **Decision trees** are readable if-else rules that overfit unless constrained with \`max_depth\` and \`min_samples_leaf\`.
• **Random forests** average many independent trees (low variance, little tuning); **gradient boosting** adds sequential trees that fix residuals (highest accuracy on tabular data, needs early stopping). Prefer \`HistGradientBoosting*\` in scikit-learn.
• **Pipelines** and **ColumnTransformer** make leakage structurally impossible and give you one object to deploy; **cross-validation** gives you a score with error bars; \`GridSearchCV\` / \`RandomizedSearchCV\` tune the whole pipeline.
• For **class imbalance**: stratify, use the right metric, tune the threshold, use \`class_weight="balanced"\`, and resample only inside an imbalanced-learn pipeline.
• Save the **entire pipeline** with **joblib**, store metadata with versions and feature names, pin library versions in serving, and never load untrusted pickles.
**Next lecture:** Unsupervised Learning, Feature Engineering & Model Evaluation`
    }
  ]
};
