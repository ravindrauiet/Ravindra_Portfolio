export const lecture04 = {
  slug: "lecture-4",
  number: 4,
  title: "Complete AI & LLM Engineering Course — Lecture 4: Unsupervised Learning, Feature Engineering & Model Evaluation",
  summary: "Learn unsupervised learning with k-means, DBSCAN and PCA, anomaly detection, feature engineering, the bias-variance trade-off, regularization, cross-validation, GridSearchCV and RandomizedSearchCV hyperparameter tuning, and how to avoid data leakage in scikit-learn.",
  readTime: "52 min read",
  difficulty: "Intermediate",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. Introduction: Beyond Labels — Why Unsupervised Learning and Honest Evaluation Matter",
      content: `In Lecture 3 you trained regression and classification models where every training row came with a correct answer. Real projects are rarely that generous. A fintech startup in Bengaluru has millions of UPI transactions but no column that says "fraud = yes". An e-commerce team has customer behaviour logs but no pre-defined customer segments. This is the world of **unsupervised learning**: finding structure in data without labels. The three big families are **clustering** (grouping similar rows), **dimensionality reduction** (compressing many features into a few meaningful ones) and **anomaly detection** (finding rows that do not look like the rest).
The second half of this lecture is about something even more important: **trusting your model**. A model that scores 97% accuracy in a notebook and 71% in production is a very common story, and the cause is almost always one of three things — **overfitting**, **data leakage**, or an evaluation that measured the wrong thing. We will build the mental toolkit to catch all three: the **bias-variance trade-off**, **regularization**, **cross-validation**, **hyperparameter tuning** with \`GridSearchCV\` and \`RandomizedSearchCV\`, and a checklist for **responsible evaluation**.
Why does this matter for an AI engineer who will mostly work with LLMs? Because every production LLM system still has classical ML around it: embeddings are clustered to discover topics, PCA is used to visualise embedding spaces, anomaly detection flags abusive prompts, and every evaluation harness you build for a RAG pipeline reuses exactly the cross-validation and leakage discipline taught here. Learn it once, use it everywhere.
We use scikit-learn 1.5+ throughout. Install the dependencies with \`pip install scikit-learn pandas numpy scipy\` and you can run every snippet in this lecture.`
    },
    {
      heading: "2. K-Means Clustering: Intuition, Inertia and Choosing k",
      content: `**K-means** is the most widely used clustering algorithm. The intuition: pick \`k\` points called **centroids**, assign every row to its nearest centroid, move each centroid to the mean of its assigned rows, and repeat until nothing changes. The result is \`k\` groups where rows inside a group are close to each other.
Mathematically, k-means minimises **inertia** — the sum of squared distances from every point to its centroid. Lower inertia means tighter clusters, but inertia always decreases as \`k\` grows (with \`k\` equal to the number of rows, inertia is zero), so you cannot simply pick the \`k\` with the lowest inertia. Two practical methods help:
• **Elbow method** — plot inertia against \`k\` and look for the "elbow" where the curve stops dropping sharply.
• **Silhouette score** — ranges from -1 to 1; measures how much closer a point is to its own cluster than to the nearest other cluster. Values above 0.5 usually indicate well-separated clusters.
**Critical rules for k-means:**
• Always **scale features first** (\`StandardScaler\`). K-means uses Euclidean distance, so a feature measured in rupees (0–50,000) would dominate one measured in years (0–70).
• K-means assumes **roughly spherical, similar-sized clusters**. It fails on crescent or ring shapes — that is where DBSCAN comes in.
• Results depend on the random initial centroids. scikit-learn uses the smart **k-means++** initialisation and, since version 1.4, \`n_init="auto"\` runs the best of several starts. Set \`random_state\` for reproducibility.
The snippet below generates 600 points in 4 blobs, runs the elbow and silhouette analysis, and shows the final centroids converted back to original units with \`inverse_transform\`.`,
      codeSnippet: `# kmeans_demo.py
import numpy as np
from sklearn.datasets import make_blobs
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

X, _ = make_blobs(n_samples=600, centers=4, cluster_std=1.1, random_state=42)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 1) Elbow + silhouette analysis for k = 2..8
for k in range(2, 9):
    km = KMeans(n_clusters=k, n_init="auto", random_state=42).fit(X_scaled)
    sil = silhouette_score(X_scaled, km.labels_)
    print(f"k={k}  inertia={km.inertia_:8.1f}  silhouette={sil:.3f}")
# Expected (approx.):
# k=2  inertia=   525.3  silhouette=0.581
# k=3  inertia=   270.1  silhouette=0.597
# k=4  inertia=   141.8  silhouette=0.651   <- elbow and best silhouette
# k=5  inertia=   127.4  silhouette=0.556
# ...

# 2) Fit the chosen model
km = KMeans(n_clusters=4, n_init="auto", random_state=42).fit(X_scaled)
print("Cluster sizes:", np.bincount(km.labels_))        # e.g. [150 150 150 150]
print("Centroids (original units):")
print(scaler.inverse_transform(km.cluster_centers_).round(2))

# 3) Assign a brand-new point
new_point = scaler.transform([[2.0, 4.5]])
print("New point belongs to cluster", km.predict(new_point)[0])`
    },
    {
      heading: "3. DBSCAN: Density-Based Clustering for Arbitrary Shapes and Noise",
      content: `**DBSCAN** (Density-Based Spatial Clustering of Applications with Noise) takes a completely different view: a cluster is a **dense region** of points, and anything sitting in a sparse region is **noise**. You do not tell it how many clusters to find — it discovers that from the data. It has two hyperparameters:
• **\`eps\`** — the radius of the neighbourhood around each point.
• **\`min_samples\`** — the minimum number of points (including itself) inside that radius for a point to count as a **core point**.
The algorithm labels each point as a core point, a **border point** (within \`eps\` of a core point but not dense itself) or **noise** (label \`-1\`). Core points that are within \`eps\` of each other are chained into the same cluster, which is why DBSCAN can trace crescents, rings and other shapes that k-means cannot.
**When DBSCAN shines:** geographic data (delivery hotspots in Hyderabad), fraud rings, spatial sensor data, and any time you want outliers surfaced automatically rather than forced into a cluster.
**When it struggles:** clusters of very different densities (one \`eps\` cannot fit both), and high-dimensional data where distances become less meaningful (reduce with PCA first). It is also sensitive to \`eps\` — too small and everything becomes noise; too large and everything merges.
**Choosing eps — the k-distance trick:** compute the distance from each point to its \`min_samples\`-th nearest neighbour, sort these distances, and look for the knee of the curve. The knee is a good \`eps\`. The snippet does exactly that on the two-moons dataset, where k-means with \`k=2\` would cut each crescent in half.`,
      codeSnippet: `# dbscan_demo.py
import numpy as np
from sklearn.datasets import make_moons
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import DBSCAN, KMeans
from sklearn.neighbors import NearestNeighbors
from sklearn.metrics import adjusted_rand_score

X, y_true = make_moons(n_samples=500, noise=0.08, random_state=42)
X = StandardScaler().fit_transform(X)

# k-distance plot data: distance to the 5th nearest neighbour, sorted
nn = NearestNeighbors(n_neighbors=5).fit(X)
distances, _ = nn.kneighbors(X)
k_dist = np.sort(distances[:, -1])
print("k-distance percentiles (50/90/95/99):", np.percentile(k_dist, [50, 90, 95, 99]).round(3))
# The knee usually sits near the 90-95th percentile -> eps ~ 0.25-0.30

db = DBSCAN(eps=0.3, min_samples=5).fit(X)
labels = db.labels_
n_clusters = len(set(labels)) - (1 if -1 in labels else 0)
n_noise = int((labels == -1).sum())
print(f"DBSCAN found {n_clusters} clusters and {n_noise} noise points")
# Expected: DBSCAN found 2 clusters and ~3 noise points

# Compare against k-means on the same data (ARI = 1.0 is a perfect match with y_true)
km = KMeans(n_clusters=2, n_init="auto", random_state=42).fit(X)
print("ARI  k-means :", round(adjusted_rand_score(y_true, km.labels_), 3))   # ~0.25
print("ARI  DBSCAN  :", round(adjusted_rand_score(y_true, labels), 3))       # ~0.98`
    },
    {
      heading: "4. Dimensionality Reduction with PCA (Principal Component Analysis)",
      content: `Datasets with hundreds of features cause three problems: models train slowly, distance-based algorithms degrade (the "curse of dimensionality"), and you cannot plot anything. **PCA** solves all three by finding new axes — **principal components** — that capture the maximum variance in the data, then keeping only the top few.
**Intuition:** imagine a cloud of points shaped like a flattened rugby ball in 3D. Most of the spread is along its long axis, a little along its width, and almost none along its thickness. PCA rotates the coordinate system so that axis 1 points along the long direction, axis 2 along the width, and so on. Dropping the thin direction loses almost no information.
**Mechanics:** PCA computes the covariance matrix of the (centred) data and its eigenvectors. Each component is a weighted combination of the original features; the weights are stored in \`pca.components_\` and are called **loadings**. The fraction of variance each component captures is \`pca.explained_variance_ratio_\`.
**Rules:**
• **Scale first.** PCA chases variance, so an unscaled feature with large units hijacks the first component.
• Pass \`n_components=0.95\` to keep enough components to explain 95% of the variance — this is the most common production setting.
• PCA is **linear**. For visualising non-linear structure (like LLM embeddings) consider \`TSNE\` or UMAP, but use PCA for anything that feeds another model, because it is fast, deterministic and has \`inverse_transform\`.
• Components are harder to explain to stakeholders than raw features. Inspect the loadings to give each component a human name.
The snippet uses the classic Wine dataset (178 wines, 13 chemical features). After scaling, the first two components explain about 55% of the variance, and 10 components reach 95%.`,
      codeSnippet: `# pca_demo.py
import numpy as np
import pandas as pd
from sklearn.datasets import load_wine
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

wine = load_wine()
X = StandardScaler().fit_transform(wine.data)      # 178 rows x 13 features

pca_full = PCA().fit(X)
ratio = pca_full.explained_variance_ratio_
print("Variance per component:", ratio.round(3))
# [0.362 0.192 0.111 0.071 0.066 0.049 0.042 0.027 0.022 0.019 0.017 0.013 0.008]
print("Cumulative:", np.cumsum(ratio).round(3))
# ... 0.924 0.943 0.960 ... -> 10 components cross 95%

# Keep enough components for 95% variance
pca = PCA(n_components=0.95).fit(X)
X_reduced = pca.transform(X)
print("Shape after PCA:", X_reduced.shape)          # (178, 10)

# Interpret component 1 through its loadings
loadings = pd.Series(pca.components_[0], index=wine.feature_names)
print(loadings.sort_values(key=abs, ascending=False).head(5).round(3))
# flavanoids, total_phenols, od280/od315..., proanthocyanins, hue dominate PC1
# -> PC1 is essentially a "phenolic richness" axis

# Reconstruct and measure information lost
X_back = pca.inverse_transform(X_reduced)
print("Reconstruction RMSE:", np.sqrt(((X - X_back) ** 2).mean()).round(3))   # ~0.2`
    },
    {
      heading: "5. Anomaly Detection: Isolation Forest, Local Outlier Factor and Statistical Baselines",
      content: `**Anomaly detection** (outlier detection) finds rows that are rare and different: a ₹4,80,000 transaction on an account that normally spends ₹2,000, a server whose latency jumps 20x, a sensor reading physically impossible values. Labels are usually missing or extremely imbalanced, so unsupervised methods dominate.
Three approaches, from simplest to most powerful:
• **Statistical z-score / IQR** — flag values more than 3 standard deviations from the mean, or outside 1.5x the interquartile range. Works per feature, assumes roughly normal data, and is a great first baseline.
• **Local Outlier Factor (LOF)** — compares the density around a point with the density around its neighbours. A point in a sparse region surrounded by dense regions gets a high LOF score. Good for local anomalies; expensive on very large data.
• **Isolation Forest** — builds random trees that split features at random thresholds. Anomalies are isolated in very few splits because they sit far from the crowd, so **short average path length = anomaly**. It is fast, handles many features, and is the default choice in production.
Important details:
• \`IsolationForest\` and \`LocalOutlierFactor\` return \`1\` for inliers and \`-1\` for outliers from \`predict\`. Use \`decision_function\` or \`score_samples\` to get a continuous score and set your own threshold.
• The \`contamination\` parameter is your prior belief about the fraction of anomalies. If unknown, leave it as \`"auto"\` and rank by score instead.
• DBSCAN's noise label \`-1\` is itself a free anomaly detector.
• Always **validate with domain experts**: look at the top 20 flagged rows and ask whether they make sense before deploying.`,
      codeSnippet: `# anomaly_demo.py
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.neighbors import LocalOutlierFactor

rng = np.random.default_rng(7)
# 2,000 normal UPI transactions: amount (rupees) and hour of day
normal = np.column_stack([
    rng.gamma(shape=2.0, scale=800, size=2000),       # typical amounts ~ 1,600
    rng.normal(loc=14, scale=4, size=2000).clip(0, 23) # daytime activity
])
# 20 anomalies: huge amounts at 3 am
anomalies = np.column_stack([rng.uniform(80000, 150000, 20), rng.uniform(1, 4, 20)])
X = np.vstack([normal, anomalies])
truth = np.r_[np.zeros(2000), np.ones(20)]

# Baseline: z-score on amount only
z = (X[:, 0] - X[:, 0].mean()) / X[:, 0].std()
print("z-score flags:", int((np.abs(z) > 3).sum()), "rows")

iso = IsolationForest(n_estimators=300, contamination=0.01, random_state=42).fit(X)
iso_pred = iso.predict(X)                   # 1 = inlier, -1 = outlier
flagged = iso_pred == -1
print("IsolationForest flagged:", int(flagged.sum()), "| true anomalies caught:", int(truth[flagged].sum()))
# Expected: flagged ~20, caught 20 / 20

lof = LocalOutlierFactor(n_neighbors=20, contamination=0.01)
lof_pred = lof.fit_predict(X)
print("LOF flagged:", int((lof_pred == -1).sum()))

# Rank rows by anomaly score for an analyst queue (lower = more anomalous)
scores = iso.decision_function(X)
top = pd.DataFrame(X, columns=["amount", "hour"]).assign(score=scores).nsmallest(5, "score")
print(top.round(2))`
    },
    {
      heading: "6. Feature Engineering: Turning Raw Columns into Signals Models Can Learn",
      content: `**Feature engineering** is the craft of transforming raw data into inputs that make patterns easier for a model to find. In most tabular projects it moves accuracy more than the choice of algorithm. The core techniques:
• **Scaling** — \`StandardScaler\` (mean 0, std 1) for linear models, SVMs, k-means and PCA; \`MinMaxScaler\` for neural networks; \`RobustScaler\` when outliers are present. Tree models do not need scaling.
• **Encoding categories** — \`OneHotEncoder(handle_unknown="ignore")\` for nominal values like city; \`OrdinalEncoder\` for ordered values like "small < medium < large". For high-cardinality columns (pin codes), consider target encoding, but only inside cross-validation to avoid leakage.
• **Handling missing values** — \`SimpleImputer\` with median (numeric) or most frequent (categorical); add a "was missing" indicator column with \`add_indicator=True\` because missingness is often itself a signal.
• **Transforming skewed numbers** — income, transaction amounts and page views are usually long-tailed; \`np.log1p\` or \`PowerTransformer\` makes them friendlier for linear models.
• **Binning** — \`KBinsDiscretizer\` turns age into age bands; useful when the relationship is non-monotonic.
• **Date/time features** — day of week, hour, month, days since last purchase, "is festival season".
• **Domain ratios and interactions** — spend per visit, debt-to-income ratio, \`PolynomialFeatures\` for pairwise products.
The single most important engineering rule: every transformation must be **fit on training data only** and applied to validation/test data with the same fitted parameters. \`ColumnTransformer\` + \`Pipeline\` make this automatic and are the house style for the rest of this course.`,
      codeSnippet: `# feature_engineering.py
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder, FunctionTransformer

df = pd.DataFrame({
    "city": ["Mumbai", "Delhi", "Pune", "Mumbai", "Jaipur", None],
    "plan": ["postpaid", "prepaid", "prepaid", "postpaid", "prepaid", "prepaid"],
    "monthly_spend": [1200.0, 450.0, np.nan, 8800.0, 300.0, 650.0],
    "signup_date": pd.to_datetime(["2024-01-15", "2025-06-01", "2025-09-20",
                                   "2023-11-05", "2025-10-01", "2025-03-12"]),
    "visits": [10, 2, 4, 35, 1, 3],
})

# Hand-crafted features (pure pandas, stateless -> safe before the split)
today = pd.Timestamp("2026-10-09")
df["tenure_days"] = (today - df["signup_date"]).dt.days
df["signup_month"] = df["signup_date"].dt.month
df["spend_per_visit"] = df["monthly_spend"] / df["visits"].clip(lower=1)
df = df.drop(columns=["signup_date"])

numeric = ["monthly_spend", "visits", "tenure_days", "spend_per_visit"]
categorical = ["city", "plan"]

numeric_pipe = Pipeline([
    ("impute", SimpleImputer(strategy="median", add_indicator=True)),
    ("log", FunctionTransformer(np.log1p, feature_names_out="one-to-one")),
    ("scale", StandardScaler()),
])
categorical_pipe = Pipeline([
    ("impute", SimpleImputer(strategy="most_frequent")),
    ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
])
preprocess = ColumnTransformer([
    ("num", numeric_pipe, numeric),
    ("cat", categorical_pipe, categorical),
])

X = preprocess.fit_transform(df)          # in a real project: fit on TRAIN rows only
print(X.shape)                              # (6, 12): 4 numeric + 1 missing flag + 7 one-hot columns
print(preprocess.get_feature_names_out())
# ['num__monthly_spend' 'num__visits' 'num__tenure_days' 'num__spend_per_visit'
#  'num__missingindicator_monthly_spend' 'cat__city_Delhi' 'cat__city_Jaipur' ...]`
    },
    {
      heading: "7. The Bias-Variance Trade-off, Overfitting and Underfitting",
      content: `Every prediction error can be decomposed into three parts: **bias**, **variance** and irreducible noise.
• **Bias** is error from wrong assumptions. A straight line fitted to a curved relationship has high bias: it is too simple to capture the pattern. The symptom is **underfitting** — poor scores on both training and test data.
• **Variance** is error from sensitivity to the particular training sample. A degree-15 polynomial or an unpruned decision tree can wiggle through every training point, including noise. The symptom is **overfitting** — excellent training score, much worse test score, and predictions that change wildly if you resample the data.
• **Noise** is randomness in the labels that no model can learn.
The **trade-off**: as model complexity grows, bias falls but variance rises. The sweet spot is the complexity where their sum — the test error — is lowest. This single picture explains almost every tuning decision in machine learning: tree depth, polynomial degree, number of neighbours in k-NN, regularization strength, number of epochs in a neural network.
**How to diagnose in practice:**
• Compare **training score vs validation score**. A gap of 2–3 points is normal; 15+ points means overfitting.
• Plot a **validation curve** (score vs one hyperparameter) with \`validation_curve\` to see where the test curve peaks.
• Plot a **learning curve** (score vs training-set size) with \`learning_curve\`. If both curves converge at a low score, you are underfitting and need a richer model or better features; if they stay far apart, you are overfitting and need more data, regularization or a simpler model.
**Fixes for overfitting:** more data, regularization, fewer/better features, ensembling, early stopping. **Fixes for underfitting:** more expressive model, better features, less regularization, train longer.`,
      codeSnippet: `# bias_variance_demo.py
import numpy as np
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import PolynomialFeatures, StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split, validation_curve
from sklearn.metrics import mean_squared_error

rng = np.random.default_rng(0)
X = np.sort(rng.uniform(0, 6, 120))[:, None]
y = np.sin(X).ravel() + rng.normal(0, 0.25, 120)       # true curve + noise
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=0)

for degree in [1, 4, 15]:
    model = make_pipeline(PolynomialFeatures(degree), StandardScaler(), LinearRegression())
    model.fit(X_tr, y_tr)
    tr = mean_squared_error(y_tr, model.predict(X_tr))
    te = mean_squared_error(y_te, model.predict(X_te))
    print(f"degree={degree:2d}  train MSE={tr:.3f}  test MSE={te:.3f}")
# degree= 1  train MSE=0.42  test MSE=0.45   <- underfit (high bias)
# degree= 4  train MSE=0.06  test MSE=0.07   <- sweet spot
# degree=15  train MSE=0.04  test MSE=0.31   <- overfit (high variance)

# Validation curve across degrees using 5-fold CV
degrees = np.arange(1, 13)
train_scores, val_scores = validation_curve(
    make_pipeline(PolynomialFeatures(), StandardScaler(), LinearRegression()),
    X, y, param_name="polynomialfeatures__degree", param_range=degrees,
    cv=5, scoring="neg_mean_squared_error")
for d, t, v in zip(degrees, -train_scores.mean(1), -val_scores.mean(1)):
    print(f"degree={d:2d}  train={t:.3f}  cv={v:.3f}")
best = degrees[np.argmin(-val_scores.mean(1))]
print("Best degree by CV:", best)          # typically 3-5`
    },
    {
      heading: "8. Regularization: Ridge, Lasso, ElasticNet and the C Parameter",
      content: `**Regularization** is the standard cure for overfitting: add a penalty to the loss function that punishes large coefficients, so the model is discouraged from fitting noise. A linear model minimises squared error plus the penalty; the strength of the penalty is controlled by **alpha** (larger alpha = stronger regularization = simpler model).
• **Ridge (L2)** — penalty is the sum of squared coefficients. It shrinks all coefficients smoothly toward zero but never exactly to zero. Best when many features each contribute a little and when features are correlated (it spreads weight among them).
• **Lasso (L1)** — penalty is the sum of absolute coefficients. Its geometry pushes weak coefficients to exactly zero, so Lasso performs **automatic feature selection**. Best when you believe only a few features matter or you need an interpretable sparse model.
• **ElasticNet** — a mix of both, controlled by \`l1_ratio\` (0 = pure Ridge, 1 = pure Lasso). The practical default when you are unsure.
**For classifiers:** \`LogisticRegression\` and \`SVC\` use **C**, which is the *inverse* of regularization strength. Small \`C\` (0.01) = strong regularization; large \`C\` (100) = weak regularization. This inversion trips up many beginners.
**Essential rules:**
• Regularized models require **scaled features**; otherwise the penalty hits features with small units hardest.
• Tune alpha/C with cross-validation, never on the test set. \`RidgeCV\`, \`LassoCV\` and \`LogisticRegressionCV\` do this efficiently with built-in paths.
• Regularization also exists outside linear models: \`max_depth\` and \`min_samples_leaf\` for trees, dropout and weight decay for neural networks (next lecture).
The snippet fits all three on the diabetes dataset with 10 features plus 20 pure-noise features, showing how Lasso drops the noise.`,
      codeSnippet: `# regularization_demo.py
import numpy as np
from sklearn.datasets import load_diabetes
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.linear_model import LinearRegression, Ridge, Lasso, ElasticNet, LassoCV
from sklearn.model_selection import train_test_split, cross_val_score

X, y = load_diabetes(return_X_y=True)                  # 442 rows x 10 features
rng = np.random.default_rng(1)
X = np.hstack([X, rng.normal(size=(X.shape[0], 20))])   # add 20 noise features -> 30 total
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.25, random_state=1)

models = {
    "OLS":        LinearRegression(),
    "Ridge":      Ridge(alpha=10),
    "Lasso":      Lasso(alpha=1.0),
    "ElasticNet": ElasticNet(alpha=1.0, l1_ratio=0.5),
}
for name, est in models.items():
    pipe = make_pipeline(StandardScaler(), est).fit(X_tr, y_tr)
    coefs = pipe[-1].coef_
    cv_r2 = cross_val_score(pipe, X_tr, y_tr, cv=5, scoring="r2").mean()
    print(f"{name:10s} test R2={pipe.score(X_te, y_te):.3f}  cv R2={cv_r2:.3f}  "
          f"non-zero coefs={int((np.abs(coefs) > 1e-6).sum())}/30")
# OLS        test R2~0.41  non-zero 30/30   (fits the noise features too)
# Ridge      test R2~0.44  non-zero 30/30   (shrunk, but none dropped)
# Lasso      test R2~0.47  non-zero ~8/30   (noise features removed)
# ElasticNet test R2~0.45  non-zero ~14/30

# Let CV pick alpha automatically
lcv = make_pipeline(StandardScaler(), LassoCV(cv=5, random_state=1)).fit(X_tr, y_tr)
print("LassoCV chose alpha =", round(lcv[-1].alpha_, 3), "| test R2 =", round(lcv.score(X_te, y_te), 3))`
    },
    {
      heading: "9. Cross-Validation: KFold, StratifiedKFold, GroupKFold and TimeSeriesSplit",
      content: `A single train/test split gives one noisy estimate of performance. If your test set happens to contain the easy rows, you overestimate; if it contains the hard ones, you underestimate. **Cross-validation (CV)** fixes this by splitting the data into \`k\` folds, training on \`k-1\` folds and validating on the remaining one, rotating through all folds and averaging the scores. You get both a **mean** and a **standard deviation**, which tells you how stable the model is.
The main splitters in \`sklearn.model_selection\`:
• **\`KFold\`** — plain rotation; always set \`shuffle=True\` and \`random_state\` unless rows are time-ordered.
• **\`StratifiedKFold\`** — keeps the class ratio identical in every fold. Default for classification and essential for imbalanced targets (3% fraud).
• **\`GroupKFold\` / \`StratifiedGroupKFold\`** — keeps all rows of the same group (same patient, same customer, same device) in one fold. Without it, the model sees a customer's Monday data in training and Tuesday data in validation and the score is a lie.
• **\`TimeSeriesSplit\`** — training folds always precede validation folds in time. Mandatory for forecasting, demand prediction and any data where "the future" must not leak into training.
• **\`RepeatedStratifiedKFold\`** — repeats CV with different shuffles for an even tighter estimate on small datasets.
How many folds? **5 or 10** is standard. More folds give less biased estimates but cost more compute; 5 is the common production default.
Use \`cross_validate\` rather than \`cross_val_score\` when you want multiple metrics, training scores (to spot overfitting) and timing in one call. The final workflow is: hold out a **test set once**, run CV on the remaining data for all model selection, then touch the test set exactly once at the end.`,
      codeSnippet: `# cross_validation_demo.py
import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import (train_test_split, cross_validate, StratifiedKFold,
                                     GroupKFold, TimeSeriesSplit)

X, y = load_breast_cancer(return_X_y=True)             # 569 rows, 30 features, 2 classes
X_trainval, X_test, y_trainval, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42)  # test set is locked away

pipe = make_pipeline(StandardScaler(), LogisticRegression(max_iter=2000))
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
res = cross_validate(pipe, X_trainval, y_trainval, cv=cv,
                     scoring=["accuracy", "f1", "roc_auc"], return_train_score=True)
for m in ["accuracy", "f1", "roc_auc"]:
    print(f"{m:9s} train={res['train_' + m].mean():.3f}  "
          f"val={res['test_' + m].mean():.3f} +/- {res['test_' + m].std():.3f}")
# accuracy  train=0.989  val=0.976 +/- 0.012   <- small gap = healthy
# f1        train=0.991  val=0.981 +/- 0.009
# roc_auc   train=0.999  val=0.995 +/- 0.004

# Group-aware split: pretend every 3 consecutive rows belong to the same patient
groups = np.arange(len(X_trainval)) // 3
gkf = GroupKFold(n_splits=5)
for i, (tr, va) in enumerate(gkf.split(X_trainval, y_trainval, groups)):
    overlap = set(groups[tr]) & set(groups[va])
    print(f"fold {i}: train={len(tr)} val={len(va)} shared groups={len(overlap)}")   # always 0

# Time-ordered split: training window always precedes validation window
tss = TimeSeriesSplit(n_splits=4)
for tr, va in tss.split(X_trainval):
    print(f"train idx {tr[0]:3d}-{tr[-1]:3d}  ->  val idx {va[0]:3d}-{va[-1]:3d}")

# Final, one-time evaluation on the untouched test set
pipe.fit(X_trainval, y_trainval)
print("Test accuracy:", round(pipe.score(X_test, y_test), 3))`
    },
    {
      heading: "10. Hyperparameter Tuning with GridSearchCV and RandomizedSearchCV",
      content: `**Parameters** are learned from data (coefficients, tree splits). **Hyperparameters** are set by you before training (tree depth, alpha, number of estimators, learning rate). Choosing them well can be worth several points of accuracy, and scikit-learn automates the search:
• **\`GridSearchCV\`** tries **every combination** in a \`param_grid\` and evaluates each with cross-validation. Exhaustive and reproducible, but the cost multiplies: 4 values x 5 values x 3 values x 5 folds = 300 model fits.
• **\`RandomizedSearchCV\`** samples \`n_iter\` random combinations from distributions. Research by Bergstra and Bengio showed that random search usually finds equally good settings in a fraction of the fits, because typically only a couple of hyperparameters really matter. Use \`scipy.stats\` distributions such as \`randint\` and \`loguniform\` (log-uniform is correct for scale-like parameters such as \`C\` or \`alpha\` that span 0.001 to 100).
• **\`HalvingGridSearchCV\` / \`HalvingRandomSearchCV\`** (successive halving) start with many candidates on small data and keep only the best as the budget grows. They need \`from sklearn.experimental import enable_halving_search_cv\` and are a strong choice for large datasets.
Key practices:
• Always search over a **Pipeline** so preprocessing is refit inside every fold (no leakage). Reference nested parameters with double underscores: \`"clf__max_depth"\`.
• Choose \`scoring\` that matches the business goal — \`"f1"\`, \`"roc_auc"\`, \`"recall"\`, \`"neg_mean_absolute_error"\` — not the default.
• Set \`n_jobs=-1\` to use all cores and \`refit=True\` (default) so \`best_estimator_\` is retrained on the full training set.
• Inspect \`cv_results_\` as a DataFrame; look at \`std_test_score\` as well as the mean. A configuration that is 0.2 points better but twice as unstable is not better.
• Start with a coarse random search, then a fine grid around the winner.
The snippet tunes a random forest on the breast cancer data with both searchers and shows the fit-count difference.`,
      codeSnippet: `# tuning_demo.py
import pandas as pd
from scipy.stats import randint, loguniform
from sklearn.datasets import load_breast_cancer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split, GridSearchCV, RandomizedSearchCV, StratifiedKFold

X, y = load_breast_cancer(return_X_y=True)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

# --- GridSearchCV: exhaustive, 3 x 3 x 2 = 18 combos x 5 folds = 90 fits
rf_pipe = Pipeline([("clf", RandomForestClassifier(random_state=42))])
grid = {
    "clf__n_estimators": [100, 300, 500],
    "clf__max_depth": [4, 8, None],
    "clf__min_samples_leaf": [1, 4],
}
gs = GridSearchCV(rf_pipe, grid, cv=cv, scoring="roc_auc", n_jobs=-1, return_train_score=True)
gs.fit(X_tr, y_tr)
print("Grid best params:", gs.best_params_)
print("Grid best CV AUC:", round(gs.best_score_, 4))
# e.g. {'clf__max_depth': None, 'clf__min_samples_leaf': 1, 'clf__n_estimators': 300} AUC ~0.991

# --- RandomizedSearchCV: 20 random combos x 5 folds = 100 fits over a MUCH larger space
lr_pipe = Pipeline([("scale", StandardScaler()), ("clf", LogisticRegression(max_iter=5000))])
dist = {
    "clf__C": loguniform(1e-3, 1e2),                   # scale-like -> log-uniform
    "clf__penalty": ["l1", "l2"],
    "clf__solver": ["liblinear", "saga"],
}
rs = RandomizedSearchCV(lr_pipe, dist, n_iter=20, cv=cv, scoring="roc_auc",
                        n_jobs=-1, random_state=42)
rs.fit(X_tr, y_tr)
print("Random best params:", {k: (round(v, 4) if isinstance(v, float) else v)
                               for k, v in rs.best_params_.items()})
print("Random best CV AUC:", round(rs.best_score_, 4))     # ~0.995

# Inspect the search, not just the winner
results = pd.DataFrame(rs.cv_results_)[["param_clf__C", "param_clf__penalty",
                                         "mean_test_score", "std_test_score", "rank_test_score"]]
print(results.sort_values("rank_test_score").head(5).to_string(index=False))

# Evaluate the refit winner ONCE on the held-out test set
print("Test AUC (best LR):", round(rs.score(X_te, y_te), 4))`
    },
    {
      heading: "11. Data Leakage: The Silent Model Killer and How Pipelines Prevent It",
      content: `**Data leakage** happens when information that would not be available at prediction time sneaks into training. The model learns a shortcut, scores brilliantly offline and collapses in production. It is the most common reason "97% in the notebook" becomes "71% live". There are two major forms:
**1. Train-test contamination (preprocessing leakage).** Fitting a scaler, imputer, PCA, target encoder or feature selector on the **whole dataset** before splitting lets statistics from the test rows (their mean, their variance, their category frequencies) influence training. The effect is subtle for a scaler and catastrophic for target encoding or feature selection. **Fix:** put every fitted transformation inside a \`Pipeline\` and let \`cross_validate\` / \`GridSearchCV\` refit it per fold.
**2. Target leakage (feature leakage).** A feature that is a proxy for the label or was recorded *after* the outcome. Classic examples: "account_closed_date" when predicting churn; "amount_refunded" when predicting fraud; "doctor_prescribed_antibiotic" when predicting infection; the ID column that was sorted by label. **Fix:** for every feature ask "would I know this value at the exact moment I need the prediction?" If not, drop it. Build features with a strict **time cut-off**: only data before the prediction timestamp.
Other leaks to watch:
• **Duplicate rows** spread across train and test (common after oversampling — oversample *inside* the training fold only, for example with imbalanced-learn's pipeline).
• **Group leakage** — the same customer in both sets (use \`GroupKFold\`).
• **Temporal leakage** — random splits on time-series (use \`TimeSeriesSplit\`).
• **Tuning on the test set** — every time you look at the test score and change something, the test set leaks into your decisions. Keep a final test set that you evaluate exactly once.
**Red flags that you have leakage:** a score that is "too good" (AUC 0.99 on a hard business problem), a single feature with overwhelming importance, or a big gap between offline and online metrics. The snippet shows a feature-selection leak that produces a fake 0.85 AUC on pure random noise, and the pipeline version that reports the honest 0.50.`,
      codeSnippet: `# leakage_demo.py
import numpy as np
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import cross_val_score, StratifiedKFold

# 200 rows, 5,000 PURE NOISE features, random labels -> any honest score should be ~0.50
rng = np.random.default_rng(0)
X = rng.normal(size=(200, 5000))
y = rng.integers(0, 2, size=200)
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)

# WRONG: select the 20 "best" features using ALL rows, then cross-validate
X_leaky = SelectKBest(f_classif, k=20).fit_transform(X, y)
leaky_auc = cross_val_score(LogisticRegression(), X_leaky, y, cv=cv, scoring="roc_auc").mean()
print(f"Leaky AUC on random noise: {leaky_auc:.3f}")        # ~0.80-0.90  (a lie)

# RIGHT: selection happens inside the pipeline, refit on each training fold only
pipe = make_pipeline(SelectKBest(f_classif, k=20), LogisticRegression())
honest_auc = cross_val_score(pipe, X, y, cv=cv, scoring="roc_auc").mean()
print(f"Honest AUC on random noise: {honest_auc:.3f}")      # ~0.45-0.55 (the truth)

# Target-leakage checklist helper: flag features suspiciously correlated with the label
def leakage_report(df, target, threshold=0.9):
    corr = df.corrwith(df[target]).drop(target).abs().sort_values(ascending=False)
    suspects = corr[corr > threshold]
    return suspects if len(suspects) else "no single feature above threshold"

import pandas as pd
demo = pd.DataFrame({"churned": y, "support_calls": rng.poisson(1, 200)})
demo["account_closed"] = demo["churned"]          # recorded AFTER churn -> leak
print(leakage_report(demo, "churned"))             # account_closed  1.0`
    },
    {
      heading: "12. Responsible Evaluation: Baselines, Right Metrics, Slices and Uncertainty",
      content: `A model is only as trustworthy as its evaluation. **Responsible evaluation** means designing the measurement before training, so that you cannot fool yourself or your stakeholders. The checklist:
• **Always beat a baseline.** \`DummyClassifier(strategy="most_frequent")\` scores 97% accuracy on a 3%-fraud dataset. If your model scores 97.5%, it has barely learned anything. For regression, \`DummyRegressor\` (predict the mean) is the floor.
• **Pick the metric that matches the cost of mistakes.** Accuracy hides imbalance. Use **recall** when missing a positive is expensive (cancer screening, fraud), **precision** when false alarms are expensive (blocking a legitimate payment), **F1** for balance, **ROC-AUC** or **PR-AUC** for ranking quality, and report a **confusion matrix** so people can see the trade-off. For regression, prefer **MAE** in business units (₹) over RMSE when outliers exist.
• **Evaluate on slices.** A churn model with 88% recall overall may have 60% recall for customers from Tier-2 cities or for a particular language. Report metrics per city, gender, age band, device type — any attribute where unequal performance would harm people or revenue. This is the practical core of **fairness** work.
• **Quantify uncertainty.** A single number from one split is not evidence. Report the CV mean and standard deviation, or a **bootstrap confidence interval** on the test set. Two models whose intervals overlap are not meaningfully different.
• **Calibration.** If you show a "73% likely to churn" score to a sales team, check that among all customers scored 70–80%, roughly 75% actually churn (\`calibration_curve\`, \`CalibratedClassifierCV\`).
• **Document.** Record data version, feature list, training window, metric choice and known limitations (a lightweight "model card"). When the model later misbehaves, this document is what saves the investigation.
• **Monitor after deployment.** Offline evaluation is a hypothesis; live performance and data drift are the test.`,
      codeSnippet: `# responsible_eval.py
import numpy as np
import pandas as pd
from sklearn.datasets import make_classification
from sklearn.dummy import DummyClassifier
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import (classification_report, confusion_matrix, roc_auc_score,
                             recall_score, average_precision_score)

# Imbalanced problem: 4% positives (e.g., loan default)
X, y = make_classification(n_samples=6000, n_features=20, n_informative=8,
                           weights=[0.96, 0.04], random_state=3)
rng = np.random.default_rng(3)
city = rng.choice(["Mumbai", "Lucknow", "Patna"], size=len(y), p=[0.6, 0.25, 0.15])
X_tr, X_te, y_tr, y_te, city_tr, city_te = train_test_split(
    X, y, city, test_size=0.3, stratify=y, random_state=3)

base = DummyClassifier(strategy="most_frequent").fit(X_tr, y_tr)
model = GradientBoostingClassifier(random_state=3).fit(X_tr, y_tr)
print("Baseline accuracy:", round(base.score(X_te, y_te), 3))      # ~0.96  (useless but "high")
print("Model accuracy   :", round(model.score(X_te, y_te), 3))     # ~0.97

proba = model.predict_proba(X_te)[:, 1]
pred = (proba >= 0.5).astype(int)
print("ROC-AUC:", round(roc_auc_score(y_te, proba), 3), "| PR-AUC:", round(average_precision_score(y_te, proba), 3))
print(confusion_matrix(y_te, pred))
print(classification_report(y_te, pred, digits=3))

# Slice evaluation: recall per city
df = pd.DataFrame({"city": city_te, "y": y_te, "pred": pred})
for c, g in df.groupby("city"):
    print(f"{c:8s} n={len(g):4d}  recall={recall_score(g['y'], g['pred'], zero_division=0):.3f}")

# Bootstrap 95% CI for AUC on the test set
aucs = []
idx = np.arange(len(y_te))
for _ in range(500):
    s = rng.choice(idx, size=len(idx), replace=True)
    if len(np.unique(y_te[s])) == 2:
        aucs.append(roc_auc_score(y_te[s], proba[s]))
print("AUC 95% CI:", np.percentile(aucs, [2.5, 97.5]).round(3))`
    },
    {
      heading: "13. Real-World Use Cases: How Unsupervised Learning and Evaluation Discipline Are Used in Production",
      content: `• **Customer segmentation (k-means).** A D2C fashion brand clusters customers on recency, frequency, monetary value and category mix, then designs a separate WhatsApp campaign for each segment. The segments are refreshed monthly, and a stable silhouette score is tracked as a health metric.
• **Fraud and abuse detection (Isolation Forest + DBSCAN).** Payment gateways score every transaction with an Isolation Forest trained on the last 30 days and route the lowest-scored 0.5% to a manual review queue. DBSCAN on device fingerprints and IP ranges exposes rings of fake accounts that sit in dense little clusters.
• **Embedding exploration for LLM apps (PCA).** Before building a RAG system, engineers embed all documents, reduce with PCA to 50 dimensions and cluster with k-means to discover topic groups, find duplicate content and spot gaps in the knowledge base. The same PCA projection is used to visualise where user queries land relative to the documents.
• **Log and metrics anomaly detection (LOF / z-score).** SRE teams flag unusual latency, error-rate and CPU patterns to catch incidents before alerts fire.
• **Feature stores and pipelines.** Companies like Flipkart, Swiggy and Razorpay maintain feature pipelines with explicit time cut-offs so that training features are computed exactly as they will be at serving time — the industrial answer to data leakage.
• **AutoML and tuning at scale.** \`RandomizedSearchCV\` and successive halving, or libraries such as Optuna, run nightly to re-tune models as data drifts; the winning configuration is promoted only if it beats the current champion on a locked holdout with a bootstrap confidence interval.
• **LLM evaluation harnesses.** When you judge a RAG pipeline or fine-tuned model, you hold out an evaluation set that was never used for prompt iteration (exactly the "touch the test set once" rule), stratify by question type, and report per-slice scores. The discipline from this lecture transfers one-to-one.`
    },
    {
      heading: "14. Common Mistakes with Unsupervised Learning and Model Evaluation — and How to Fix Them",
      content: `• **Running k-means or PCA on unscaled data.** The feature with the largest units dominates. **Fix:** \`StandardScaler\` inside a pipeline, every time.
• **Picking k by lowest inertia.** Inertia always falls as k grows. **Fix:** use the elbow plus silhouette score and, above all, whether the segments make business sense.
• **Using k-means on non-spherical clusters.** Crescents and rings get sliced. **Fix:** try DBSCAN or Gaussian mixtures; visualise with PCA first.
• **Treating DBSCAN noise as a bug.** Noise points are information. **Fix:** inspect them; they are often your most interesting outliers.
• **Interpreting PCA components as original features.** PC1 is a blend. **Fix:** read \`components_\` loadings and name each component.
• **Fitting the scaler/imputer/encoder before the train-test split.** Preprocessing leakage. **Fix:** \`Pipeline\` + \`ColumnTransformer\`; fit on train only.
• **Confusing C with alpha.** Large \`C\` means *less* regularization. **Fix:** remember C = 1/alpha for \`LogisticRegression\` and \`SVC\`.
• **Reporting accuracy on imbalanced data.** 96% accuracy can be a model that predicts "no fraud" for everyone. **Fix:** baseline with \`DummyClassifier\`; report recall, precision, F1, PR-AUC.
• **Random CV on time-series or grouped data.** Future or same-customer rows leak. **Fix:** \`TimeSeriesSplit\`, \`GroupKFold\`.
• **Tuning hyperparameters against the test set.** The test set becomes a validation set and its score becomes optimistic. **Fix:** CV on train, one final evaluation on test; for a publishable number, use nested CV.
• **Trusting GridSearchCV's best score as the production estimate.** It is biased upward because you selected the maximum over many trials. **Fix:** evaluate the refit model on the untouched test set.
• **Oversampling (SMOTE) before splitting.** Synthetic copies of test-like rows end up in training. **Fix:** oversample inside the training fold only.
• **Ignoring the standard deviation across folds.** A 0.3-point improvement with +/- 2.0 noise is not an improvement. **Fix:** compare mean and std; use repeated CV for small data.`
    },
    {
      heading: "15. Frequently Asked Questions about Clustering, PCA, Regularization and Cross-Validation",
      content: `**What is the difference between supervised and unsupervised learning?**
Supervised learning trains on inputs paired with known outputs (labels) and learns to predict those outputs for new inputs — regression and classification. Unsupervised learning has no labels; it discovers structure such as clusters, low-dimensional representations or anomalies. In practice the two are combined: cluster labels or PCA components from unsupervised methods often become features for a supervised model.
**How do I choose the number of clusters in k-means?**
Compute inertia and silhouette score for a range of k, look for the elbow in inertia and the peak in silhouette, then sanity-check the segments with domain knowledge. If business needs exactly five segments for five campaigns, that constraint wins. For data where k is genuinely unknown, DBSCAN or a Gaussian mixture with BIC can estimate it.
**When should I use DBSCAN instead of k-means?**
Use DBSCAN when clusters have irregular shapes, when you do not know how many there are, or when you want outliers flagged as noise automatically. Use k-means when clusters are roughly round and similar in size, when the dataset is very large (k-means scales better), or when you need to assign new points quickly with \`predict\`.
**What does PCA actually do and when should I use it?**
PCA rotates the feature space so the new axes (principal components) capture the maximum variance, then keeps the top few. Use it to speed up training on wide data, to remove multicollinearity before linear models, to denoise, and to visualise high-dimensional data such as embeddings in 2D. Do not use it when you need the original features to stay interpretable or when the relationships are strongly non-linear.
**What is the difference between L1 and L2 regularization?**
L2 (Ridge) adds the sum of squared coefficients to the loss, shrinking all weights smoothly but never to zero. L1 (Lasso) adds the sum of absolute coefficients, which drives weak weights exactly to zero and so performs feature selection. ElasticNet mixes both. Ridge handles correlated features more gracefully; Lasso gives sparser, more interpretable models.
**How do I know if my model is overfitting?**
Compare training and validation scores: a large gap (for example 99% train vs 82% validation) signals overfitting. Plot learning curves — if the validation curve keeps improving with more data while the gap stays wide, you need more data or regularization. In cross-validation, high variance of scores across folds is another warning sign.
**What is data leakage in machine learning and how do I prevent it?**
Leakage is any situation where training uses information that will not be available at prediction time — statistics from the test rows, features recorded after the outcome, or the same entity in both train and test. Prevent it by putting all preprocessing in a Pipeline, auditing features for "would I know this at prediction time?", using group- or time-aware splitters, and touching the final test set only once.
**GridSearchCV vs RandomizedSearchCV — which should I use?**
Use GridSearchCV when the search space is small (under a few hundred combinations) and you want exhaustive, reproducible coverage. Use RandomizedSearchCV when the space is large or continuous, when some hyperparameters matter much more than others (almost always), or when compute is limited — it usually finds equally good settings in far fewer fits. A common pattern is a broad random search followed by a narrow grid around the winner.`
    },
    {
      heading: "16. Interview Questions and Answers on Unsupervised Learning, Feature Engineering and Model Evaluation",
      content: `**Q1. Explain the bias-variance trade-off with an example.**
Bias is error from a model being too simple to capture the true pattern (a line fitted to a curve); variance is error from a model being so flexible it fits noise in the specific training sample (a degree-15 polynomial). As complexity rises, bias falls and variance rises; total error is minimised in between. Tuning tree depth, polynomial degree or regularization strength is navigating this trade-off.
**Q2. Why must features be scaled before k-means and PCA but not before random forests?**
K-means and PCA rely on Euclidean distance and variance, so a feature with large units dominates the result. Tree-based models split each feature on its own thresholds, so monotonic rescaling changes nothing.
**Q3. What does the silhouette score measure and what is a good value?**
For each point it compares the mean distance to its own cluster (a) with the mean distance to the nearest other cluster (b): (b - a) / max(a, b). It ranges from -1 to 1; above about 0.5 indicates reasonably separated clusters, near 0 means overlapping clusters, and negative values mean points are probably in the wrong cluster.
**Q4. How does DBSCAN decide what is noise?**
A point is a core point if at least \`min_samples\` points lie within radius \`eps\`. Points within \`eps\` of a core point but not core themselves are border points. Anything that is neither is labelled noise (-1). Clusters are formed by chaining core points that are within \`eps\` of each other.
**Q5. What is the difference between parameters and hyperparameters?**
Parameters are learned from data during \`fit\` (linear coefficients, tree split thresholds, neural-network weights). Hyperparameters are configuration chosen before training (alpha, C, max_depth, n_estimators, learning rate) and are selected using cross-validation, typically with GridSearchCV or RandomizedSearchCV.
**Q6. Why is the best score from GridSearchCV an optimistic estimate of production performance?**
Because you selected the maximum over many candidate configurations evaluated on the same folds; the winner partly won by chance. The unbiased estimate comes from evaluating the refit best model on a held-out test set that played no role in selection, or from nested cross-validation.
**Q7. Give three examples of data leakage and how to prevent each.**
(1) Fitting a StandardScaler on the full dataset before splitting — fix with a Pipeline. (2) A feature such as "refund_amount" when predicting fraud, recorded after the outcome — fix by enforcing a prediction-time cut-off on features. (3) The same customer appearing in train and test — fix with GroupKFold. A fourth: random splits on time-series — fix with TimeSeriesSplit.
**Q8. When would you choose Lasso over Ridge?**
When you suspect only a subset of features matters, when you need an interpretable sparse model, or when the number of features is large relative to rows. Ridge is preferred when features are highly correlated or when all features are believed to contribute, as it shares weight among correlated features rather than arbitrarily zeroing some.
**Q9. How does Isolation Forest detect anomalies?**
It builds many random trees that split on random features at random thresholds. Anomalous points are far from the mass of the data, so they are isolated after very few splits; their average path length across trees is short. The anomaly score is a function of this average path length, and \`contamination\` sets the threshold.
**Q10. How would you evaluate a churn model responsibly for a telecom company?**
Hold out a time-based test set; compare against a DummyClassifier baseline; choose recall at a fixed precision (or PR-AUC) because the cost of missing a churner is high; report confusion matrix and calibration; slice metrics by circle/city, plan type and tenure to detect unequal performance; give a bootstrap confidence interval; document data windows and features; and monitor live precision/recall after deployment.`
    },
    {
      heading: "17. Hands-On Exercise: Customer Segmentation and a Leak-Free, Tuned Churn Model",
      content: `This exercise ties the whole lecture together on a synthetic telecom dataset of 1,200 customers from five Indian cities. It is fully self-contained — no downloads, runs in under a minute.
**Part A — Unsupervised:** impute and scale usage features, choose k with the silhouette score, fit k-means, project the clusters to 2D with PCA, and print a business profile of each segment (average spend, tenure, support calls).
**Part B — Supervised with discipline:** hold out a stratified test set, build a \`ColumnTransformer\` + \`RandomForestClassifier\` pipeline, tune it with \`GridSearchCV\` on ROC-AUC, compare with a \`DummyClassifier\` baseline and a regularized logistic regression, evaluate once on the test set, and report recall per city.
Run it with \`python customer_intelligence.py\`. Then try the extension tasks:
1. Replace \`GridSearchCV\` with \`RandomizedSearchCV\` using \`randint\` and \`loguniform\`, and compare fit counts and scores.
2. Add the k-means segment as a categorical feature to the churn model (hint: fit the clustering inside the training data only — can you make it part of the pipeline?).
3. Deliberately introduce leakage by adding a column \`account_closed = churned\` and watch the AUC jump to 1.0 — then remove it.
4. Replace the random split with a tenure-based time split and see how the metrics change.`,
      codeSnippet: `# customer_intelligence.py
# Part A: customer segmentation (k-means + PCA)   Part B: leak-free, tuned churn classifier
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split, StratifiedKFold, GridSearchCV, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.dummy import DummyClassifier
from sklearn.metrics import silhouette_score, classification_report, roc_auc_score, recall_score

# ---------- 0. Synthetic telecom data ----------
rng = np.random.default_rng(42)
n = 1200
df = pd.DataFrame({
    "city": rng.choice(["Mumbai", "Delhi", "Bengaluru", "Pune", "Jaipur"], size=n),
    "plan": rng.choice(["prepaid", "postpaid"], size=n, p=[0.6, 0.4]),
    "tenure_months": rng.integers(1, 72, size=n),
    "monthly_spend": np.round(rng.gamma(shape=2.0, scale=400, size=n)),   # rupees
    "support_calls": rng.poisson(1.2, size=n),
    "data_gb": np.round(rng.gamma(2.5, 6, size=n), 1),
})
df.loc[rng.choice(n, 60, replace=False), "data_gb"] = np.nan            # some missing values
logit = (-1.2 + 0.55 * df["support_calls"] - 0.035 * df["tenure_months"]
         - 0.0004 * df["monthly_spend"] + 0.4 * (df["plan"] == "prepaid"))
df["churned"] = (rng.random(n) < 1 / (1 + np.exp(-logit))).astype(int)
print("Churn rate:", df["churned"].mean().round(3))                      # ~0.25

# ---------- Part A: segmentation ----------
usage_cols = ["tenure_months", "monthly_spend", "support_calls", "data_gb"]
seg_prep = Pipeline([("impute", SimpleImputer(strategy="median")), ("scale", StandardScaler())])
Z = seg_prep.fit_transform(df[usage_cols])

best_k, best_sil = None, -1
for k in range(2, 7):
    labels = KMeans(n_clusters=k, n_init="auto", random_state=42).fit_predict(Z)
    sil = silhouette_score(Z, labels)
    print(f"k={k} silhouette={sil:.3f}")
    if sil > best_sil:
        best_k, best_sil = k, sil
print("Chosen k:", best_k)

km = KMeans(n_clusters=best_k, n_init="auto", random_state=42).fit(Z)
df["segment"] = km.labels_
coords = PCA(n_components=2, random_state=42).fit_transform(Z)
df["pc1"], df["pc2"] = coords[:, 0], coords[:, 1]
profile = df.groupby("segment")[usage_cols + ["churned"]].mean().round(2)
profile["size"] = df["segment"].value_counts().sort_index()
print("Segment profiles:")
print(profile)
# Example reading: one segment with high support_calls + low tenure will show the highest churn

# ---------- Part B: tuned, leak-free churn model ----------
features = ["city", "plan"] + usage_cols
X, y = df[features], df["churned"]
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.25, stratify=y, random_state=42)

preprocess = ColumnTransformer([
    ("num", Pipeline([("impute", SimpleImputer(strategy="median", add_indicator=True)),
                      ("scale", StandardScaler())]), usage_cols),
    ("cat", OneHotEncoder(handle_unknown="ignore"), ["city", "plan"]),
])
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

baseline = DummyClassifier(strategy="most_frequent").fit(X_tr, y_tr)
print("Baseline accuracy:", round(baseline.score(X_te, y_te), 3))

lr = Pipeline([("prep", preprocess), ("clf", LogisticRegression(C=0.5, max_iter=2000))])
print("LogReg CV AUC:", round(cross_val_score(lr, X_tr, y_tr, cv=cv, scoring="roc_auc").mean(), 3))

rf = Pipeline([("prep", preprocess), ("clf", RandomForestClassifier(random_state=42))])
grid = {"clf__n_estimators": [200, 400],
        "clf__max_depth": [4, 8, None],
        "clf__min_samples_leaf": [1, 5, 20]}
gs = GridSearchCV(rf, grid, cv=cv, scoring="roc_auc", n_jobs=-1)
gs.fit(X_tr, y_tr)
print("RF best params:", gs.best_params_)
print("RF best CV AUC:", round(gs.best_score_, 3))

# One-time evaluation on the untouched test set
best = gs.best_estimator_
proba = best.predict_proba(X_te)[:, 1]
pred = (proba >= 0.5).astype(int)
print("Test AUC:", round(roc_auc_score(y_te, proba), 3))
print(classification_report(y_te, pred, digits=3))

# Slice check: recall per city
slices = pd.DataFrame({"city": X_te["city"].values, "y": y_te.values, "pred": pred})
for c, g in slices.groupby("city"):
    print(f"{c:10s} n={len(g):3d} recall={recall_score(g['y'], g['pred'], zero_division=0):.3f}")

# Expected shape of output (numbers vary slightly by scikit-learn version):
# Chosen k: 2-4 | segment with high support_calls shows churn ~0.5+
# Baseline accuracy ~0.75 | LogReg CV AUC ~0.78 | RF best CV AUC ~0.76-0.80 | Test AUC ~0.78`
    },
    {
      heading: "18. Summary",
      content: `• **Unsupervised learning** finds structure without labels: **k-means** for round, similar-sized clusters (choose k with elbow + silhouette), **DBSCAN** for arbitrary shapes and automatic noise detection (tune \`eps\` with the k-distance plot).
• **PCA** rotates features onto variance-maximising components; use \`n_components=0.95\`, always scale first, and read the loadings to interpret components.
• **Anomaly detection**: start with z-scores, use **Isolation Forest** in production, LOF for local density anomalies; \`-1\` means outlier.
• **Feature engineering** (scaling, encoding, imputation with indicators, log transforms, date and ratio features) often matters more than the algorithm — and must live inside a \`ColumnTransformer\` + \`Pipeline\`.
• The **bias-variance trade-off** explains overfitting (high variance) and underfitting (high bias); diagnose with train-vs-validation gaps, validation curves and learning curves.
• **Regularization**: Ridge (L2) shrinks, Lasso (L1) selects, ElasticNet mixes; \`C\` is the inverse of alpha in classifiers.
• **Cross-validation** gives a mean and a standard deviation; use \`StratifiedKFold\` for classification, \`GroupKFold\` for grouped entities, \`TimeSeriesSplit\` for time-ordered data.
• **GridSearchCV** is exhaustive; **RandomizedSearchCV** with \`loguniform\`/\`randint\` is usually more efficient; always search over a pipeline and evaluate the refit winner once on the test set.
• **Data leakage** is the number-one cause of production disappointment: fit preprocessing on training folds only, enforce prediction-time feature cut-offs, use group/time-aware splits, never tune on the test set.
• **Responsible evaluation**: beat a dummy baseline, pick cost-aware metrics, report slices, confidence intervals and calibration, document the model, and monitor it live.
**Next lecture:** Neural Networks & Deep Learning with PyTorch`
    }
  ]
};
