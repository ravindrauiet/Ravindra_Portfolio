export const lecture02 = {
  slug: "lecture-2",
  number: 2,
  title: "Complete AI & LLM Engineering Course — Lecture 2: Math & Data Foundations for Machine Learning",
  summary: "Learn the math and data foundations for machine learning: vectors, dot products and matrices, derivatives and gradient descent, mean, variance, distributions and Bayes' theorem, plus train/validation/test splits, data cleaning, feature scaling and categorical encoding with NumPy, pandas and scikit-learn.",
  readTime: "52 min read",
  difficulty: "Beginner",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. Why Math and Data Foundations Matter for Machine Learning",
      content: `In Lecture 1 you learned what AI, machine learning, deep learning and generative AI are. This lecture builds the two foundations every model in the rest of the course stands on: a small amount of **math intuition** and a solid set of **data preparation skills**.
You do not need a mathematics degree to be an AI engineer. What you need is to understand four ideas well enough to reason about them: **vectors and matrices** (how data and model weights are stored), **derivatives and gradients** (how a model learns), **probability and statistics** (how we describe data and uncertainty), and **data preparation** (how raw, messy data becomes something a model can consume). Every neural network, every embedding model and every LLM is built from exactly these pieces.
Why does this matter in real projects? Because most machine learning failures are not caused by choosing the wrong algorithm. They are caused by **data problems**: a column with missing values that silently became zeros, a feature on a scale of 0 to 10,00,000 drowning out a feature on a scale of 0 to 1, a test set that leaked into training, or a categorical column encoded as meaningless integers. Practising data scientists often say 70–80% of their time goes into data preparation, and that estimate matches experience in Indian startups and enterprises alike.
The math side matters for a different reason: when training goes wrong (loss not decreasing, predictions all identical, NaN values appearing), you can only debug it if you understand what a gradient is and why feature scale affects it. When you later read about "cosine similarity between embeddings" in a RAG system, you will know it is just a normalized dot product.
This lecture is intuition-first. We explain every idea in words, then show it in NumPy or pandas with realistic numbers, and we connect each one to where it appears in machine learning. By the end you will write a complete, runnable data preparation pipeline that feeds a small model trained with gradient descent you implement yourself.`
    },
    {
      heading: "2. Linear Algebra Intuition: Vectors as the Language of Data",
      content: `A **vector** is simply an ordered list of numbers. In machine learning, one vector usually describes one example. A house in Pune might be the vector \`[1200, 3, 15]\` meaning 1200 sq ft, 3 bedrooms, 15 years old. A word in a language model is a vector of a few hundred or thousand numbers called an **embedding**. A 28×28 grayscale image is a vector of 784 pixel values. Everything a model sees is a vector.
Geometrically, a vector is a point (or an arrow from the origin) in a space with as many dimensions as it has numbers. A 2-number vector is a point on a flat plane; a 3-number vector is a point in a room; a 768-number vector lives in a 768-dimensional space you cannot picture, but all the same rules apply.
Three operations cover most of what you need:
• **Addition** combines vectors element by element: \`[1, 2] + [3, 4] = [4, 6]\`. Moving a point by another vector.
• **Scalar multiplication** stretches or shrinks: \`2 × [1, 2] = [2, 4]\`. Scaling without changing direction.
• **Norm (length)** measures how long the arrow is. The L2 norm of \`[3, 4]\` is \`sqrt(3² + 4²) = 5\`. Dividing a vector by its norm gives a **unit vector** of length 1, which is how embeddings are "normalized" before similarity search.
In NumPy a vector is a one-dimensional \`ndarray\`. The key property of NumPy is **vectorization**: operations apply to all elements at once in fast C code instead of a Python loop. On a million-element array, \`a + b\` in NumPy is typically 50–100 times faster than a Python \`for\` loop, which is why every ML library is built on this idea.
Note the \`shape\` attribute. A vector of 3 numbers has shape \`(3,)\`. Shapes are the first thing to check whenever a NumPy or PyTorch error appears; most bugs in ML code are shape mismatches.`,
      codeSnippet: `# vectors.py
import numpy as np

house = np.array([1200, 3, 15])        # sq ft, bedrooms, age in years
other = np.array([800, 2, 5])

print(house.shape)                     # (3,)
print(house + other)                   # [2000    5   20]
print(2 * house)                       # [2400    6   30]
print(house - other)                   # [400   1  10]  -> difference per feature

v = np.array([3.0, 4.0])
length = np.linalg.norm(v)             # sqrt(3^2 + 4^2)
print(length)                          # 5.0
unit = v / length
print(unit, np.linalg.norm(unit))      # [0.6 0.8] 1.0

# Vectorization: one line instead of a loop, and far faster
prices_lakh = np.array([85, 60, 120, 45])
with_gst = prices_lakh * 1.05
print(with_gst)                        # [ 89.25  63.   126.    47.25]`
    },
    {
      heading: "3. The Dot Product and Cosine Similarity",
      content: `The **dot product** of two vectors multiplies matching elements and adds the results: \`[1, 2, 3] · [4, 5, 6] = 1×4 + 2×5 + 3×6 = 32\`. It is the single most important operation in machine learning, for two reasons.
**Reason 1: it is a weighted sum.** A linear model predicts \`y = w · x + b\`. If \`x = [1200, 3]\` (sq ft, bedrooms) and the learned weights are \`w = [0.05, 10]\` with bias \`b = 5\`, the prediction is \`0.05×1200 + 10×3 + 5 = 95\` lakh. Every neuron in a neural network computes exactly this: a dot product of its inputs with its weights, plus a bias, followed by an activation function.
**Reason 2: it measures similarity.** Geometrically, \`a · b = |a| × |b| × cos(θ)\`, where θ is the angle between the vectors. If both vectors point the same way, cos(θ) = 1 and the dot product is large; if they are perpendicular it is 0; if they point in opposite directions it is negative. Dividing by the lengths gives **cosine similarity**, a number between −1 and 1 that depends only on direction, not magnitude.
Cosine similarity is how semantic search and RAG systems work: a sentence is turned into an embedding vector, and the documents whose embeddings have the highest cosine similarity to the query are returned. For \`a = [1, 2, 3]\` and \`b = [4, 5, 6]\`, cosine similarity is \`32 / (3.742 × 8.775) ≈ 0.975\`, which says the vectors point in almost the same direction even though \`b\` is much longer.
When the vectors are already unit length (normalized), cosine similarity is just the dot product. That is why embedding APIs often return normalized vectors: it makes similarity search a single fast matrix multiplication.`,
      codeSnippet: `# dot_product.py
import numpy as np

a = np.array([1, 2, 3])
b = np.array([4, 5, 6])
print(np.dot(a, b))                    # 32
print(a @ b)                           # 32  (the @ operator is matrix/dot product)

# 1) Dot product as a weighted sum: a linear model's prediction
x = np.array([1200, 3])                # sq ft, bedrooms
w = np.array([0.05, 10])               # learned weights
b_bias = 5
print(w @ x + b_bias)                  # 95.0  -> predicted price in lakh

# 2) Dot product as similarity
def cosine_similarity(u, v):
    return u @ v / (np.linalg.norm(u) * np.linalg.norm(v))

print(round(cosine_similarity(a, b), 4))                 # 0.9746
print(cosine_similarity(np.array([1, 0]), np.array([0, 1])))   # 0.0  (perpendicular)
print(cosine_similarity(np.array([1, 1]), np.array([-1, -1]))) # -1.0 (opposite)

# Tiny "semantic search": which document is closest to the query?
query = np.array([0.9, 0.1, 0.4])
docs = np.array([[0.8, 0.2, 0.5],      # doc 0
                 [0.1, 0.9, 0.0],      # doc 1
                 [0.7, 0.0, 0.7]])     # doc 2
scores = [cosine_similarity(query, d) for d in docs]
print(np.round(scores, 3))             # [0.977 0.179 0.919]
print("best doc:", int(np.argmax(scores)))   # best doc: 0`
    },
    {
      heading: "4. Matrices and Matrix Multiplication: How Models Process Batches",
      content: `A **matrix** is a grid of numbers: rows and columns. In machine learning the standard layout is **one row per example, one column per feature**. Three houses with two features each form a 3×2 matrix, written as shape \`(3, 2)\`. A pandas DataFrame is essentially a labelled matrix; \`df.to_numpy()\` gives you the raw one.
**Matrix multiplication** is the dot product applied many times at once. If \`X\` has shape \`(3, 2)\` and the weight vector \`w\` has shape \`(2,)\`, then \`X @ w\` computes the dot product of every row with \`w\` and returns 3 predictions in one operation. This is why GPUs make deep learning fast: they are built to multiply huge matrices in parallel.
The one rule you must remember: to multiply \`A @ B\`, the number of **columns of A must equal the number of rows of B**. A \`(m, n)\` matrix times an \`(n, p)\` matrix gives an \`(m, p)\` result. The inner dimensions must match and then disappear. If you get the error "shapes (3,2) and (3,) not aligned", this rule is what you violated.
A single layer of a neural network is literally \`X @ W + b\`: with a batch of 32 examples and 10 features, \`X\` is \`(32, 10)\`; a layer with 64 neurons has \`W\` of shape \`(10, 64)\` and bias \`(64,)\`; the output is \`(32, 64)\`. A GPT-style model is dozens of these layers, with attention in between, each one a matrix multiplication.
Two more operations appear constantly. The **transpose** \`A.T\` swaps rows and columns, which you use to make shapes line up (for example in the gradient formula later in this lecture). **Broadcasting** lets NumPy add a \`(64,)\` bias to a \`(32, 64)\` matrix by automatically repeating it across rows. Broadcasting is convenient but also a common source of silent bugs: adding a \`(3,)\` vector to a \`(3, 1)\` column produces a \`(3, 3)\` matrix rather than an error.`,
      codeSnippet: `# matrices.py
import numpy as np

# 3 houses (rows) x 2 features (columns): sq ft, bedrooms
X = np.array([[1200, 3],
              [ 800, 2],
              [1500, 4]])
w = np.array([0.05, 10])
b = 5

print(X.shape)                 # (3, 2)
predictions = X @ w + b        # dot product of every row with w, all at once
print(predictions)             # [ 95.  65. 120.]

# Matrix x matrix: (3,2) @ (2,4) -> (3,4)  -- like one neural-network layer with 4 neurons
W = np.array([[0.01, 0.02, 0.00, 0.05],
              [1.00, 0.50, 2.00, 0.00]])
bias = np.array([0.1, 0.2, 0.3, 0.4])
hidden = X @ W + bias          # bias (4,) is broadcast across all 3 rows
print(hidden.shape)            # (3, 4)
print(hidden[0])               # [15.1 25.7  6.3 60.4]

print(X.T.shape)               # (2, 3) -- transpose
try:
    X @ np.array([1, 2, 3])    # (3,2) @ (3,)  -> inner dimensions 2 and 3 do not match
except ValueError as err:
    print("Shape error:", err)`
    },
    {
      heading: "5. Calculus Intuition: Derivatives as Slopes and Gradient Descent",
      content: `A model "learns" by adjusting its weights to make a **loss** (a number measuring how wrong its predictions are) as small as possible. Calculus answers one question: **if I nudge a weight slightly, does the loss go up or down, and how fast?** That rate of change is the **derivative**, and for a curve it is simply the **slope** at a point.
Take \`f(x) = x²\`. Its derivative is \`2x\`. At \`x = 3\` the slope is 6: increasing \`x\` a little increases \`f\` about 6 times as fast. At \`x = −2\` the slope is −4: increasing \`x\` decreases \`f\`. At \`x = 0\` the slope is 0, which is the minimum. You do not need to memorize derivative rules; frameworks like PyTorch compute them automatically (**autograd**). You need the intuition that the derivative tells you which direction is downhill.
When the loss depends on many weights, the **gradient** is the vector of all the partial derivatives, one per weight. It points in the direction of **steepest increase** of the loss. So to reduce loss, you step in the **opposite** direction. That algorithm is **gradient descent**: \`w_new = w_old − learning_rate × gradient\`. Repeat until the loss stops improving.
The **learning rate** controls step size. Too small and training crawls; too large and you overshoot the minimum and the loss bounces or explodes to NaN. For \`f(x) = x²\` starting at \`x = 3\` with learning rate 0.1, the steps are 3 → 2.4 → 1.92 → 1.536 → … converging to 0. With learning rate 1.1 the values would alternate and grow: 3 → −3.6 → 4.32 → …, a classic divergence.
The code below trains a one-weight linear model \`y = w × x\` on data where the true answer is \`w = 2\`. The loss is **mean squared error (MSE)**, the gradient is derived by the chain rule (\`dL/dw = mean(2 × (w×x − y) × x)\`), and plain gradient descent finds \`w ≈ 2.0\` in under 100 steps. Every neural network in this course trains with a more elaborate version of this exact loop.`,
      codeSnippet: `# gradient_descent.py
import numpy as np

# --- Derivative as slope: f(x) = x^2, f'(x) = 2x ---
def f(x):
    return x ** 2

def numeric_derivative(func, x, h=1e-5):
    return (func(x + h) - func(x - h)) / (2 * h)   # slope between two nearby points

print(round(numeric_derivative(f, 3.0), 4))   # 6.0  (matches 2*3)
print(round(numeric_derivative(f, -2.0), 4))  # -4.0

# --- Gradient descent on f(x) = x^2 ---
x, lr = 3.0, 0.1
for step in range(5):
    x = x - lr * 2 * x                         # move against the slope
    print(f"step {step + 1}: x = {x:.4f}")
# step 1: x = 2.4000 ... step 5: x = 0.9830 -> heading towards the minimum at 0

# --- Gradient descent to learn w in y = w * x ---
xs = np.array([1.0, 2.0, 3.0, 4.0])
ys = np.array([2.0, 4.0, 6.0, 8.0])            # true relationship: y = 2x

w, lr = 0.0, 0.01
for step in range(100):
    pred = w * xs
    loss = np.mean((pred - ys) ** 2)           # mean squared error
    grad = np.mean(2 * (pred - ys) * xs)       # dL/dw by the chain rule
    w = w - lr * grad
    if step in (0, 10, 50, 99):
        print(f"step {step:3d}  w = {w:.4f}  loss = {loss:.4f}")
# step   0  w = 0.3000  loss = 30.0000
# step  10  w = 1.6734  loss = 1.0129
# step  50  w = 1.9994  loss = 0.0000
# step  99  w = 2.0000  loss = 0.0000`
    },
    {
      heading: "6. Probability and Statistics Basics: Mean, Variance and Distributions",
      content: `Statistics gives you the vocabulary to describe a dataset and to notice when something is wrong with it. Four numbers do most of the work.
The **mean** is the average: add everything and divide by the count. The **median** is the middle value when sorted. Consider six monthly salaries in lakh: \`[4, 5, 6, 7, 8, 30]\`. The mean is 10, but the median is 6.5. One high earner dragged the mean far from what a "typical" person earns. That is why the median is preferred for skewed data such as income, house prices or request latency, and why we will impute missing numeric values with the median, not the mean.
The **variance** measures spread: the average of the squared distances from the mean. The **standard deviation** is its square root, expressed in the same units as the data. For the salaries above, the population standard deviation is about 9.04 lakh; remove the 30 and it drops to about 1.41. Standard deviation is the basis of **standardization** (z-scores), covered in Section 11.
You will see two versions of variance. **Population variance** divides by \`n\`; **sample variance** divides by \`n − 1\` (Bessel's correction, because a sample slightly underestimates the spread of the full population). NumPy's \`np.var\` and \`np.std\` use \`n\` by default; pandas' \`.var()\` and \`.std()\` use \`n − 1\` by default. The difference is small for large datasets but has confused many interview candidates.
A **distribution** describes how values are spread across their range. The ones you must recognize: the **normal (Gaussian)** bell curve, where about 68% of values fall within one standard deviation of the mean and 95% within two (heights, measurement noise, model errors); the **uniform** distribution, where every value is equally likely (random initialization, dice); the **Bernoulli** distribution for yes/no outcomes (click or not, spam or not); and **skewed** distributions with a long tail (income, page views), which often benefit from a log transform before modelling.
Finally, **correlation** (−1 to 1) measures how strongly two variables move together. Highly correlated input features (age and years of experience, for example) carry redundant information and can make linear models unstable, which is worth checking with \`df.corr()\` before training.`,
      codeSnippet: `# statistics_basics.py
import numpy as np
import pandas as pd

salaries = np.array([4, 5, 6, 7, 8, 30])        # lakh per annum

print(np.mean(salaries))                        # 10.0   (pulled up by the outlier)
print(np.median(salaries))                      # 6.5    (robust to the outlier)
print(round(np.var(salaries), 2))               # 81.67  population variance (divide by n)
print(round(np.std(salaries), 2))               # 9.04   population std
print(round(np.std(salaries, ddof=1), 2))       # 9.9    sample std (divide by n-1)
print(round(pd.Series(salaries).std(), 2))      # 9.9    pandas uses n-1 by default

# Simulating distributions with NumPy's random generator
rng = np.random.default_rng(42)
heights = rng.normal(loc=165, scale=7, size=10_000)        # normal: mean 165 cm, std 7
within_1_std = np.mean(np.abs(heights - 165) < 7)
print(round(within_1_std, 3))                              # ~0.683  (the 68% rule)

dice = rng.integers(1, 7, size=10_000)                     # uniform over 1..6
print(np.round(np.bincount(dice)[1:] / len(dice), 3))      # each ~0.167

clicks = rng.random(10_000) < 0.03                         # Bernoulli: 3% click rate
print(round(clicks.mean(), 4))                             # ~0.03

# Correlation between two features
df = pd.DataFrame({"age": [25, 30, 35, 40, 45], "experience": [2, 7, 11, 18, 22],
                   "shoe_size": [8, 10, 7, 9, 8]})
print(df.corr().round(2))
#              age  experience  shoe_size
# age         1.00        0.99       0.00
# experience  0.99        1.00      -0.04
# shoe_size   0.00       -0.04       1.00`
    },
    {
      heading: "7. Bayes' Theorem Intuition: Updating Beliefs with Evidence",
      content: `**Conditional probability** is the probability of one event given that another has happened, written \`P(A | B)\`. "The probability an email is spam given that it contains the word FREE" is a conditional probability. Bayes' theorem tells you how to flip a conditional around: it turns "how often do spam emails contain FREE" (easy to count from data) into "how likely is an email to be spam if it contains FREE" (what you actually want to predict).
The formula is \`P(A | B) = P(B | A) × P(A) / P(B)\`. In words: **posterior = likelihood × prior / evidence**. The **prior** \`P(A)\` is what you believed before seeing the evidence; the **likelihood** \`P(B | A)\` is how probable the evidence is if A is true; the **posterior** \`P(A | B)\` is your updated belief.
Work through a spam filter. Suppose 20% of all email is spam (prior). 60% of spam contains "free", but only 5% of legitimate email does. An email arrives containing "free". How likely is it spam? \`P(free) = 0.6×0.2 + 0.05×0.8 = 0.12 + 0.04 = 0.16\`. Then \`P(spam | free) = 0.12 / 0.16 = 0.75\`. One word moved our belief from 20% to 75%. A **Naive Bayes classifier** does exactly this for every word in the email and multiplies the evidence together, which is why it was the standard spam filter for years and is still a strong text baseline.
The famous counter-intuitive case is medical testing: a disease affects 1 in 1,000 people and a test is 99% accurate. If you test positive, the probability you actually have the disease is only about 9%, because the 1% false positives among the 999 healthy people (about 10 people) outnumber the 1 true positive. The prior matters enormously, and this is why class imbalance in datasets (fraud is 0.1% of transactions) must be handled carefully.
Where this appears in modern AI: a language model's output is a **probability distribution over the next token** given the previous tokens, \`P(next | context)\`; classification models output \`P(class | features)\` through a **softmax**; and evaluation metrics such as precision and recall are conditional probabilities (\`P(actually positive | predicted positive)\`). Thinking in conditional probabilities is a core AI-engineering skill.`,
      codeSnippet: `# bayes.py
def bayes(prior_a, likelihood_b_given_a, likelihood_b_given_not_a):
    """Return P(A | B) using Bayes' theorem."""
    evidence = likelihood_b_given_a * prior_a + likelihood_b_given_not_a * (1 - prior_a)
    return likelihood_b_given_a * prior_a / evidence

# Spam filter: P(spam) = 0.2, P("free" | spam) = 0.6, P("free" | not spam) = 0.05
print(round(bayes(0.2, 0.6, 0.05), 3))        # 0.75

# Medical test: disease in 1 of 1000, test sensitivity 99%, false positive rate 1%
print(round(bayes(0.001, 0.99, 0.01), 3))     # 0.09  -> only ~9% despite a "99% accurate" test

# Fraud detection: fraud is 0.2% of transactions; rule flags 90% of fraud and 2% of good ones
print(round(bayes(0.002, 0.90, 0.02), 3))     # 0.083 -> most flagged transactions are still legitimate

# Check it against brute-force counting with simulated emails
import numpy as np
rng = np.random.default_rng(0)
n = 1_000_000
is_spam = rng.random(n) < 0.2
has_free = np.where(is_spam, rng.random(n) < 0.6, rng.random(n) < 0.05)
print(round(is_spam[has_free].mean(), 3))     # ~0.75`
    },
    {
      heading: "8. Data Types and Datasets: Features, Targets and pandas DataFrames",
      content: `A machine learning **dataset** is a collection of examples (rows) with **features** (input columns, conventionally called \`X\`) and, for supervised learning, a **target** or label (the column you want to predict, called \`y\`). The job of data preparation is to turn whatever raw form the data arrives in into a clean numeric matrix \`X\` and vector \`y\`.
Datasets come in a few shapes. **Tabular** data (CSV files, SQL tables, Excel exports) is the most common in business: each row is a customer, transaction or house. **Text** is sequences of tokens; **images** are grids of pixels; **time series** are values indexed by time; and **multimodal** datasets mix them. This course starts with tabular data because the ideas transfer everywhere, and even LLM applications end up with tabular evaluation logs.
Inside a table, each column has a **data type**, and the type determines how you must handle it:
• **Numeric continuous** (price, temperature, salary): any real number. Usually scaled.
• **Numeric discrete** (number of bedrooms, visit count): whole numbers; treated as numeric unless the range is tiny.
• **Categorical nominal** (city, product category, colour): labels with **no order**. Must be encoded, usually one-hot.
• **Categorical ordinal** (education level, T-shirt size, rating "poor/ok/good"): labels **with an order**. Encoded as ordered integers.
• **Boolean** (is_premium): already 0/1.
• **Datetime**: never fed raw; extract useful parts such as hour, day of week, month, or "days since signup".
• **Free text** (reviews, support tickets): converted to numbers with TF-IDF, embeddings or a tokenizer (later lectures).
• **Identifiers** (customer_id, name, email): carry no predictive signal and should be dropped. A model that uses \`customer_id\` memorizes instead of learning.
**pandas** is the tool for this stage. A \`DataFrame\` is a table with named columns and typed data. The first five commands you run on any new dataset are \`df.head()\`, \`df.shape\`, \`df.info()\`, \`df.describe()\` and \`df["column"].value_counts()\`. Together they reveal row counts, column types, missing values, suspicious ranges and rare categories before you write a single line of modelling code. Make this a habit; it catches most problems in minutes.`,
      codeSnippet: `# explore_dataset.py
import numpy as np
import pandas as pd

df = pd.DataFrame({
    "customer_id":  [101, 102, 103, 104, 105, 106],
    "city":         ["Bengaluru", "Pune", "Delhi", "Pune", "Mumbai", "Delhi"],
    "plan":         ["basic", "pro", "pro", "basic", "enterprise", "pro"],
    "age":          [28, 35, np.nan, 42, 31, 26],
    "monthly_spend": [499, 1499, 1499, 499, 4999, 1499],
    "signup_date":  pd.to_datetime(["2025-01-10", "2025-03-22", "2025-06-05",
                                    "2025-06-30", "2025-09-14", "2026-01-02"]),
    "churned":      [0, 0, 1, 0, 0, 1],      # target
})

print(df.shape)                                  # (6, 7)
print(df.dtypes)
# customer_id               int64
# city                     object
# plan                     object
# age                     float64
# monthly_spend             int64
# signup_date      datetime64[ns]
# churned                   int64

print(df.describe().round(1))                    # count, mean, std, min, quartiles, max for numeric cols
print(df["city"].value_counts())                 # Pune 2, Delhi 2, Bengaluru 1, Mumbai 1
print(df.isna().sum())                           # age has 1 missing value

# Datetime -> useful numeric features
df["signup_month"] = df["signup_date"].dt.month
df["days_since_signup"] = (pd.Timestamp("2026-10-09") - df["signup_date"]).dt.days

# Separate features (X) from target (y); drop identifiers and raw datetimes
X = df.drop(columns=["customer_id", "signup_date", "churned"])
y = df["churned"]
print(X.columns.tolist())
# ['city', 'plan', 'age', 'monthly_spend', 'signup_month', 'days_since_signup']`
    },
    {
      heading: "9. Train, Validation and Test Splits: Measuring Honestly",
      content: `A model that scores 99% on the data it was trained on has told you nothing. It may have **memorized** the examples rather than learned a pattern that generalizes. The only honest measurement is performance on data the model has **never seen**. That is why every dataset is split before training.
The standard split has three parts:
• **Training set** (typically 60–80%): the model learns its weights from this data only.
• **Validation set** (10–20%): used while developing to compare models, tune hyperparameters (learning rate, tree depth, regularization) and decide when to stop training. Because you make decisions based on it, it slowly becomes "seen" too.
• **Test set** (10–20%): touched **once**, at the very end, to report the final number. If you go back and tweak the model after looking at test results, your test score is no longer trustworthy.
Three details matter in practice. First, **shuffle** before splitting (scikit-learn does this by default), because files are often sorted by date or category. Second, set \`random_state\` so the split is reproducible and colleagues can get the same result. Third, for classification use \`stratify=y\` so each split keeps the same class proportions; with 3% fraud cases, a random split could easily leave the validation set with almost none.
The exception is **time series**. If you predict next month's sales, you must train on the past and validate on the future, so split chronologically and never shuffle. Shuffling time data lets the model peek into the future, which is a form of **data leakage** and produces results that look wonderful and fail in production.
When data is scarce, **k-fold cross-validation** rotates which fold acts as validation (5 folds means 5 trainings, each validated on a different 20%) and averages the scores. It is slower but far more reliable than a single small validation set. You still keep a separate test set outside the cross-validation loop.
The most important rule of this whole lecture: **split first, then fit everything else (imputers, scalers, encoders) on the training set only.** Section 14 shows what goes wrong otherwise.`,
      codeSnippet: `# splits.py
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, StratifiedKFold

rng = np.random.default_rng(1)
n = 1000
X = pd.DataFrame({"f1": rng.normal(size=n), "f2": rng.normal(size=n)})
y = (rng.random(n) < 0.05).astype(int)      # 5% positive class, like fraud

# 70% train, 15% validation, 15% test, stratified so class ratio is preserved
X_train, X_temp, y_train, y_temp = train_test_split(
    X, y, test_size=0.30, random_state=42, stratify=y)
X_val, X_test, y_val, y_test = train_test_split(
    X_temp, y_temp, test_size=0.50, random_state=42, stratify=y_temp)

print(len(X_train), len(X_val), len(X_test))          # 700 150 150
print(y_train.mean().round(3), y_val.mean().round(3), y_test.mean().round(3))
# 0.05 0.047 0.053  -> roughly the same class ratio in every split

# Time series: chronological split, never shuffled
sales = pd.DataFrame({"day": pd.date_range("2026-01-01", periods=365), "units": rng.integers(50, 150, 365)})
cutoff = int(len(sales) * 0.8)
train_ts, test_ts = sales.iloc[:cutoff], sales.iloc[cutoff:]
print(train_ts["day"].max().date(), "->", test_ts["day"].min().date())   # 2026-10-19 -> 2026-10-20

# 5-fold stratified cross-validation (train+val data only; test set stays untouched)
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
for fold, (tr_idx, va_idx) in enumerate(skf.split(X_train, y_train)):
    print(f"fold {fold}: train {len(tr_idx)}  val {len(va_idx)}")   # 560 / 140 each time`
    },
    {
      heading: "10. Data Cleaning with pandas: Missing Values, Duplicates and Outliers",
      content: `Real data is messy. HR exports have "n/a" typed into numeric columns; city names appear as "Pune", "pune" and "Pune "; the same order is logged twice; a salary of ₹5 crore sits among entries of ₹5 lakh because someone entered rupees instead of lakh. Models cannot tell the difference between a real pattern and a data-entry error, so cleaning is where you protect model quality.
**Missing values** are the first thing to find (\`df.isna().sum()\`). You have three options. **Drop rows** when the missing count is tiny or the missing column is the target (never invent labels). **Drop the column** when most of it is missing and it is not critical. **Impute** otherwise: fill numeric gaps with the **median** (robust to outliers) and categorical gaps with the **mode** or a dedicated "Unknown" category. Often the fact that a value is missing is itself informative (people who skip "income" on a loan form), so adding an \`income_missing\` indicator column can help.
Imputation must be done with scikit-learn's \`SimpleImputer\` fitted on the training set, not with \`df.fillna(df.median())\` on the whole dataset, so the same training statistics are reused at prediction time and no test information leaks in.
**Wrong types** show up as \`object\` columns that should be numeric. \`pd.to_numeric(col, errors="coerce")\` converts what it can and turns the rest ("n/a", "-", "unknown") into \`NaN\`, which you then handle as a missing value. **Inconsistent text** is fixed with the \`.str\` accessor: \`.str.strip().str.title()\` collapses "pune " and "PUNE" into "Pune".
**Duplicates** inflate the importance of repeated rows and can place the same row in both train and test. \`df.drop_duplicates()\` removes exact repeats; pass \`subset=["order_id"]\` to deduplicate by key.
**Outliers** are extreme values. Some are errors (age 250), some are real but rare (a genuine ₹50 crore house). The **IQR rule** flags values below \`Q1 − 1.5×IQR\` or above \`Q3 + 1.5×IQR\`; the **z-score rule** flags values more than 3 standard deviations from the mean. Investigate before deleting: if it is an error, fix or drop it; if it is real, keep it and consider a robust scaler or log transform so it does not dominate training. Deleting inconvenient real data is a way of lying to yourself about model performance.`,
      codeSnippet: `# cleaning.py
import numpy as np
import pandas as pd
from sklearn.impute import SimpleImputer

df = pd.DataFrame({
    "order_id": [1, 2, 2, 3, 4, 5, 6],
    "city":     ["Pune", "pune ", "pune ", "DELHI", "Mumbai", "Delhi", None],
    "amount":   ["1200", "850", "850", "n/a", "2500", "99000", "640"],
    "age":      [31, np.nan, np.nan, 45, 27, 38, 250],
})

# 1) Duplicates
df = df.drop_duplicates(subset=["order_id"])
print(len(df))                                          # 6

# 2) Wrong types: coerce bad strings to NaN
df["amount"] = pd.to_numeric(df["amount"], errors="coerce")
print(df["amount"].isna().sum())                        # 1  ("n/a" became NaN)

# 3) Inconsistent text
df["city"] = df["city"].str.strip().str.title()
print(df["city"].value_counts(dropna=False))            # Pune 2, Delhi 2, Mumbai 1, NaN 1

# 4) Impossible values -> treat as missing
df.loc[df["age"] > 120, "age"] = np.nan

# 5) Outliers with the IQR rule
q1, q3 = df["amount"].quantile([0.25, 0.75])
iqr = q3 - q1
mask = (df["amount"] < q1 - 1.5 * iqr) | (df["amount"] > q3 + 1.5 * iqr)
print(df.loc[mask, ["order_id", "amount"]])             # order 5, amount 99000 -> investigate
print("Missing per column:")
print(df.isna().sum())                                  # city 1, amount 1, age 3

# 6) Imputation the scikit-learn way (fit on training rows only in a real project)
num_imputer = SimpleImputer(strategy="median")
cat_imputer = SimpleImputer(strategy="most_frequent")
df[["age", "amount"]] = num_imputer.fit_transform(df[["age", "amount"]])
df[["city"]] = cat_imputer.fit_transform(df[["city"]])
print(num_imputer.statistics_)                          # medians that will be reused at prediction time
print(df)`
    },
    {
      heading: "11. Feature Scaling: Standardization and Normalization",
      content: `Imagine a model with two features: \`monthly_spend\` ranging from 499 to 4999 and \`age\` ranging from 18 to 60. In a distance-based or gradient-based model, spend dominates simply because its numbers are bigger. The distance between two customers is almost entirely spend; the gradient with respect to the spend weight is hundreds of times larger than the gradient for age, so gradient descent either crawls on age or explodes on spend. **Feature scaling** puts every feature on a comparable range so the model can weigh them on merit.
**Standardization** (z-score scaling) subtracts the mean and divides by the standard deviation: \`z = (x − mean) / std\`. The result has mean 0 and standard deviation 1. Ages \`[25, 35, 45]\` become \`[−1.22, 0, 1.22]\`. Use \`StandardScaler\`. This is the default choice for linear models, logistic regression, SVMs, neural networks and PCA.
**Min-max normalization** rescales to a fixed range, usually 0 to 1: \`x' = (x − min) / (max − min)\`. Use \`MinMaxScaler\`. It is common for image pixels (0–255 → 0–1) and when the algorithm expects bounded inputs. Its weakness is sensitivity to outliers: one age of 250 squashes everyone else into a tiny sliver near 0.
**Robust scaling** uses the median and the interquartile range instead of mean and std, so outliers have little effect. Use \`RobustScaler\` when the data has heavy tails you have decided to keep.
Which models need scaling? **Yes**: anything using distances or gradient descent — k-nearest neighbours, k-means, SVM, logistic and linear regression (for stable training and comparable coefficients), neural networks. **No**: tree-based models — decision trees, random forests, gradient boosting (XGBoost, LightGBM) — because they split on thresholds and a threshold at 35 years or at 0.42 standardized units gives identical splits.
Two rules that are non-negotiable. First, **fit the scaler on the training set only**, then apply the same transformation (\`transform\`, not \`fit_transform\`) to validation and test data. If you fit on everything, the test set's mean and std leak into training. Second, **save the fitted scaler** with the model; at prediction time the same means and stds must be used, otherwise a live age of 30 would be scaled with different numbers than during training and every prediction would be wrong. Scikit-learn pipelines handle both rules automatically.`,
      codeSnippet: `# scaling.py
import numpy as np
from sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler

X_train = np.array([[25,  499],
                    [35, 1499],
                    [45, 4999]], dtype=float)       # age, monthly_spend
X_test = np.array([[30, 2500]], dtype=float)

# Standardization: mean 0, std 1 per column (StandardScaler divides by population std)
scaler = StandardScaler().fit(X_train)             # learns means and stds from TRAIN only
print(scaler.mean_)                                 # [  35.         2332.33333333]
print(np.round(scaler.scale_, 2))                   # [   8.16 1922.3 ]
print(np.round(scaler.transform(X_train), 2))
# [[-1.22 -0.95]
#  [ 0.    -0.43]
#  [ 1.22  1.39]]
print(np.round(scaler.transform(X_test), 2))        # [[-0.61  0.09]]  same mean/std reused

# Min-max to [0, 1]
mm = MinMaxScaler().fit(X_train)
print(np.round(mm.transform(X_train), 2))
# [[0.   0.  ]
#  [0.5  0.22]
#  [1.   1.  ]]
print(np.round(mm.transform(X_test), 2))            # [[0.25 0.44]]

# Why outliers hurt min-max: one bad age squashes the rest
ages = np.array([[25], [35], [45], [250]], dtype=float)
print(np.round(MinMaxScaler().fit_transform(ages).ravel(), 3))   # [0.    0.044 0.089 1.   ]
print(np.round(RobustScaler().fit_transform(ages).ravel(), 2))   # [-0.26 -0.09  0.09  3.72] -> normal ages stay spread out`
    },
    {
      heading: "12. Encoding Categorical Variables: One-Hot, Ordinal and Label Encoding",
      content: `Models compute with numbers, so a column like \`city = "Pune"\` must become numeric. How you do it matters more than beginners expect, because a careless encoding invents relationships that do not exist.
The tempting mistake is to map categories to integers: Bengaluru = 0, Delhi = 1, Mumbai = 2, Pune = 3. A linear model or neural network would then believe Pune is "three times" Bengaluru and that Mumbai lies "between" Delhi and Pune. For **nominal** categories (no natural order) this is nonsense.
**One-hot encoding** is the correct choice for nominal data: create one binary column per category, with a 1 in the column of the row's category and 0 elsewhere. "Pune" becomes \`[0, 0, 0, 1]\`. No order is implied and every category is equidistant. Use scikit-learn's \`OneHotEncoder\` inside a pipeline rather than \`pd.get_dummies\`, for two reasons: the encoder remembers the training categories so that production data produces columns in the same order, and \`handle_unknown="ignore"\` makes an unseen category (a new city) encode as all zeros instead of crashing. \`pd.get_dummies\` is still handy for quick exploration.
**Ordinal encoding** is for categories with a genuine order: education \`High School < Bachelor < Master < PhD\` becomes \`0, 1, 2, 3\`. Here the integer distance is meaningful. Always pass the \`categories\` list explicitly to \`OrdinalEncoder\`; otherwise it sorts alphabetically, which would rank "Bachelor" above "PhD" by accident.
**Label encoding** (\`LabelEncoder\`) is only for the **target** column in classification ("cat/dog/bird" → 0/1/2). Scikit-learn classifiers handle such integer labels correctly because they treat them as class IDs, not quantities.
**High-cardinality** columns (PIN code with 19,000 values, product SKU with 1,00,000) make one-hot encoding impractical: the matrix becomes huge and mostly zeros. Options include grouping rare categories into "Other", **target encoding** (replace each category by the mean target value in training data, with care to avoid leakage), **frequency encoding**, or learned **embeddings** in neural networks, which is exactly how LLMs represent tokens: a vocabulary of 1,00,000+ tokens, each mapped to a dense vector.
One detail for linear regression specifically: with an intercept, the full set of one-hot columns is perfectly collinear (the **dummy variable trap**), so \`drop="first"\` is sometimes used. Regularized models, trees and neural networks do not care, and \`handle_unknown="ignore"\` cannot be combined with dropping, so the default in modern pipelines is to keep all columns.`,
      codeSnippet: `# encoding.py
import numpy as np
import pandas as pd
from sklearn.preprocessing import OneHotEncoder, OrdinalEncoder, LabelEncoder

train = pd.DataFrame({
    "city":      ["Pune", "Delhi", "Bengaluru", "Pune"],
    "education": ["Bachelor", "PhD", "Master", "High School"],
})
new_data = pd.DataFrame({"city": ["Mumbai"], "education": ["Master"]})   # Mumbai never seen in training

# One-hot for nominal categories
ohe = OneHotEncoder(handle_unknown="ignore", sparse_output=False)
ohe.fit(train[["city"]])
print(ohe.categories_)                               # [array(['Bengaluru', 'Delhi', 'Pune'], dtype=object)]
print(ohe.transform(train[["city"]]))
# [[0. 0. 1.]
#  [0. 1. 0.]
#  [1. 0. 0.]
#  [0. 0. 1.]]
print(ohe.transform(new_data[["city"]]))             # [[0. 0. 0.]] -> unknown city, no crash
print(ohe.get_feature_names_out())                   # ['city_Bengaluru' 'city_Delhi' 'city_Pune']

# Ordinal for ordered categories: pass the order explicitly!
order = [["High School", "Bachelor", "Master", "PhD"]]
oe = OrdinalEncoder(categories=order)
print(oe.fit_transform(train[["education"]]).ravel())   # [1. 3. 2. 0.]

# Quick exploration alternative (not for production pipelines)
print(pd.get_dummies(train, columns=["city"], dtype=int))
#      education  city_Bengaluru  city_Delhi  city_Pune
# 0     Bachelor               0           0          1
# 1          PhD               0           1          0
# 2       Master               1           0          0
# 3  High School               0           0          1

# Label encoding is for the TARGET only
le = LabelEncoder()
print(le.fit_transform(["cat", "dog", "bird", "dog"]))   # [1 2 0 2]
print(le.classes_)                                       # ['bird' 'cat' 'dog']`
    },
    {
      heading: "13. Real-World Use Cases: How These Foundations Are Used in Production",
      content: `Each idea in this lecture maps directly onto something AI engineers ship.
**Semantic search and RAG.** A document store holds embedding vectors for thousands of support articles. A user question is embedded, and cosine similarity (Section 3) ranks the articles. Because embeddings are normalized, the ranking is one matrix–vector multiplication: \`doc_matrix @ query\`. Vector databases such as pgvector, Pinecone or Qdrant are optimized versions of exactly this operation.
**Recommendations.** Flipkart-style "customers also bought" systems represent users and products as vectors learned from purchase history. A user's predicted interest in a product is the dot product of the two vectors; higher means more likely to buy. The user and product vectors are trained with gradient descent on a loss over observed purchases (Section 5).
**Credit risk and churn scoring.** A bank's loan model receives a tabular row: income, city, employment type, credit history length. Before the model sees it, a saved preprocessing pipeline imputes missing income with the training median, one-hot encodes city, ordinal-encodes employment grade and standardizes numeric columns (Sections 10–12). The same fitted pipeline object is loaded in the serving API so that training and production use identical transformations.
**Fraud and anomaly detection.** A transaction with a z-score above 4 on "amount relative to this customer's history" is flagged for review (Section 6). Many production anomaly systems start as nothing more than rolling means, standard deviations and thresholds, and only graduate to models once that baseline is measured.
**A/B testing and LLM evaluation.** When comparing two prompts or two model versions, the question "is 72% vs 69% a real improvement or noise?" is answered with statistics: sample sizes, variance and confidence intervals. Teams that skip this ship regressions. The same applies to evaluation sets: an eval set is a held-out test set (Section 9), and "fixing" the prompt until the eval passes is the same leakage as tuning on test data.
**Training any neural network or fine-tuning an LLM.** Everything is matrices (Section 4), the loss is minimized by gradient descent with autograd computing the gradients (Section 5), the inputs are scaled or normalized (Section 11), and tokens are categorical variables encoded as embeddings (Section 12). The pattern below, a scikit-learn \`ColumnTransformer\` plus \`Pipeline\`, is the production-standard way to package tabular preprocessing so it can be fitted once and reused safely.`,
      codeSnippet: `# production_preprocessing.py
# The reusable pattern: one fitted object that cleans, encodes and scales, saved with the model.
import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder, OrdinalEncoder

numeric = ["income_lpa", "credit_history_years"]
nominal = ["city", "employment_type"]
ordinal = ["credit_grade"]
grade_order = [["D", "C", "B", "A"]]

preprocess = ColumnTransformer([
    ("num", Pipeline([("impute", SimpleImputer(strategy="median")),
                      ("scale", StandardScaler())]), numeric),
    ("cat", Pipeline([("impute", SimpleImputer(strategy="most_frequent")),
                      ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False))]), nominal),
    ("ord", OrdinalEncoder(categories=grade_order), ordinal),
])

train = pd.DataFrame({
    "income_lpa": [6.5, 12.0, None, 25.0, 9.0],
    "credit_history_years": [2, 8, 5, 15, 3],
    "city": ["Pune", "Delhi", "Pune", "Mumbai", None],
    "employment_type": ["salaried", "self-employed", "salaried", "salaried", "salaried"],
    "credit_grade": ["B", "A", "C", "A", "B"],
})

X_train = preprocess.fit_transform(train)          # fit ONCE on training data
print(X_train.shape)                                # (5, 8)
joblib.dump(preprocess, "preprocess.joblib")        # ship this file with the model

# --- later, inside the serving API ---
preprocess = joblib.load("preprocess.joblib")
live_request = pd.DataFrame([{"income_lpa": 10.0, "credit_history_years": 4,
                              "city": "Kochi", "employment_type": "salaried", "credit_grade": "B"}])
print(preprocess.transform(live_request).round(2))  # Kochi was never seen -> all-zero city columns, no crash`
    },
    {
      heading: "14. Common Mistakes and How to Fix Them",
      content: `**Mistake 1: Fitting the scaler, imputer or encoder on the full dataset before splitting.** This is **data leakage**: the test set's statistics influence training, and your reported accuracy is optimistic. Fix: split first; call \`fit\` or \`fit_transform\` only on training data; call \`transform\` on validation and test. Pipelines enforce this for you.
**Mistake 2: Calling \`fit_transform\` on the test set.** It silently recomputes means and categories from the test data, so test rows are scaled differently from training rows. Fix: \`transform\` only.
**Mistake 3: Integer-encoding nominal categories.** City = 0, 1, 2, 3 makes a linear model believe in an order that does not exist. Fix: one-hot for nominal, ordinal with an explicit order only for truly ordered categories.
**Mistake 4: Imputing with the mean on skewed data.** A few huge salaries drag the mean up, and every missing salary is filled with an unrealistic value. Fix: median for numeric, mode or "Unknown" for categorical, plus a missing-indicator column when the absence itself is informative.
**Mistake 5: Dropping every row with any missing value.** On a dataset with 20 columns, "dropna on everything" can delete 60% of your rows and bias the remainder toward complete, well-documented customers. Fix: inspect \`isna().sum()\`, drop only rows missing the target, impute the rest.
**Mistake 6: Shuffling time-series data.** The model trains on March and is validated on February, learning from the future. Fix: chronological split; use \`TimeSeriesSplit\` for cross-validation.
**Mistake 7: Forgetting \`stratify\` on imbalanced classification.** A 2% positive class may be nearly absent from a small validation set, and the metric becomes meaningless. Fix: \`stratify=y\` in \`train_test_split\` and \`StratifiedKFold\`.
**Mistake 8: Scaling features for tree models and worrying about it.** Trees ignore scale; the time is better spent elsewhere. Conversely, **not** scaling before k-NN, SVM, logistic regression or a neural network and then wondering why the loss does not decrease.
**Mistake 9: Confusing \`np.std\` (divides by n) with \`pandas.std\` (divides by n−1).** Results differ slightly and surprise people when numbers do not match across tools. Fix: be explicit with \`ddof\`.
**Mistake 10: Ignoring shapes.** Multiplying \`(3, 2)\` by \`(3,)\`, or broadcasting a \`(3,)\` against a \`(3, 1)\` to accidentally get \`(3, 3)\`. Fix: print \`.shape\` at each step while developing; \`reshape(-1, 1)\` turns a vector into a column.
**Mistake 11: Letting the learning rate be too large.** Loss goes to \`inf\` or \`nan\` within a few steps. Fix: reduce the learning rate by 10× and make sure features are scaled; unscaled features are the most common cause of exploding gradients in simple models.
The snippet below shows the leakage mistake and the correct version side by side.`,
      codeSnippet: `# leakage_wrong_vs_right.py
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

rng = np.random.default_rng(7)
X = rng.normal(loc=50, scale=10, size=(100, 1))
X[-5:] += 200                                    # a few extreme rows

# WRONG: scaler sees ALL rows (including the test rows) before the split
scaler_wrong = StandardScaler().fit(X)
X_scaled_all = scaler_wrong.transform(X)
Xtr_w, Xte_w = train_test_split(X_scaled_all, test_size=0.2, random_state=0)

# RIGHT: split first, fit on train only, transform both
Xtr, Xte = train_test_split(X, test_size=0.2, random_state=0)
scaler_right = StandardScaler().fit(Xtr)
Xtr_r = scaler_right.transform(Xtr)
Xte_r = scaler_right.transform(Xte)             # transform, NOT fit_transform

print("wrong scaler mean:", round(float(scaler_wrong.mean_[0]), 2))   # influenced by test rows
print("right scaler mean:", round(float(scaler_right.mean_[0]), 2))   # training rows only
print("train mean after right scaling:", round(float(Xtr_r.mean()), 4))   # ~0.0 (exactly on train)
print("test  mean after right scaling:", round(float(Xte_r.mean()), 4))   # not 0 -- and that is correct

# Learning-rate sanity check: too large diverges
x = 3.0
for lr in (0.1, 1.1):
    val = x
    for _ in range(20):
        val = val - lr * 2 * val
    print(f"lr={lr}: x after 20 steps = {val:.3g}")
# lr=0.1: x after 20 steps = 0.0346
# lr=1.1: x after 20 steps = -1.15e+02   (diverging)`
    },
    {
      heading: "15. Frequently Asked Questions about ML Math and Data Preparation",
      content: `**How much math do I need to learn machine learning and AI engineering?**
Enough to reason about four things: vectors and matrix multiplication, derivatives and gradient descent, basic probability and statistics, and what a loss function is. You do not need to derive backpropagation by hand; PyTorch does that. You do need to understand shapes, why scaling matters, and what a gradient tells you, because that is what you use when debugging.
**What is the difference between a vector, a matrix and a tensor?**
A vector is a 1-D list of numbers (shape \`(n,)\`), a matrix is a 2-D grid (shape \`(rows, cols)\`), and a tensor is the general term for any number of dimensions. A batch of 32 colour images of 224×224 pixels is a 4-D tensor of shape \`(32, 3, 224, 224)\` in PyTorch. NumPy calls them all \`ndarray\`.
**What is the difference between normalization and standardization?**
Standardization (\`StandardScaler\`) subtracts the mean and divides by the standard deviation, giving mean 0 and std 1 with no fixed bounds. Normalization usually means min-max scaling (\`MinMaxScaler\`) to a fixed range such as 0 to 1. Standardization is the safer default for most models; min-max is common for pixel data and bounded inputs but is sensitive to outliers.
**Why do we need a validation set if we already have a test set?**
Because you make decisions (which model, which hyperparameters, when to stop) by looking at validation results, and every decision slightly overfits to that data. The test set is kept untouched so the final number is an honest estimate of real-world performance. Using the test set for tuning is the most common way to get a surprise in production.
**When should I use one-hot encoding versus label encoding?**
One-hot encoding is for nominal input features with no order (city, colour). Ordinal encoding is for input features with a real order (education level), with the order passed explicitly. Label encoding (\`LabelEncoder\`) is only for the target column in classification. Integer-encoding a nominal input feature is a bug in linear models and neural networks.
**Do decision trees and random forests need feature scaling?**
No. Trees split on thresholds, and a threshold works the same on raw or scaled values. Gradient boosting libraries like XGBoost and LightGBM also do not need scaling. Distance-based models (k-NN, k-means, SVM) and gradient-descent models (linear and logistic regression, neural networks) do need it.
**What is the difference between population and sample variance?**
Population variance divides the sum of squared deviations by \`n\` and describes a complete set of data. Sample variance divides by \`n − 1\` to correct for the fact that a sample underestimates spread. \`np.var\` uses \`n\` by default (\`ddof=0\`), while pandas uses \`n − 1\` (\`ddof=1\`). For datasets of thousands of rows the difference is negligible, but know which one your tool uses.
**What is data leakage in machine learning?**
Data leakage is when information that would not be available at prediction time influences training, making evaluation scores unrealistically high. Common forms: fitting scalers or imputers on the full dataset, duplicates shared across train and test, shuffling time series, or including a feature derived from the target (such as "refund issued" when predicting "complaint"). The fix is to split first and build every transformation inside a pipeline fitted on the training set only.`
    },
    {
      heading: "16. Interview Questions and Answers on ML Math and Data Foundations",
      content: `**Q1. Explain the dot product and give two places it appears in machine learning.**
The dot product multiplies corresponding elements of two vectors and sums them. It appears as the weighted sum in every linear model and every neuron (\`w · x + b\`), and as a similarity measure between vectors; normalized, it becomes cosine similarity, which powers embedding search and recommendation systems.
**Q2. What is a gradient, and why do we subtract it during training?**
The gradient is the vector of partial derivatives of the loss with respect to each parameter; it points in the direction in which the loss increases fastest. Subtracting a fraction of it (the learning rate) moves the parameters in the direction that reduces loss. Repeating this is gradient descent.
**Q3. What happens if the learning rate is too high or too low?**
Too high: the update overshoots the minimum, the loss oscillates or grows to infinity or NaN. Too low: training converges very slowly and may stop in a flat region. Unscaled features make this worse because the loss surface is stretched, so a learning rate that is right for one feature is wrong for another.
**Q4. Why is the median often preferred to the mean for imputing missing values?**
The mean is pulled toward extreme values, so on skewed data (income, prices) it does not represent a typical row. The median is the middle value and is robust to outliers, so the imputed value is more realistic and does not distort the distribution.
**Q5. Explain Bayes' theorem with an example.**
\`P(A|B) = P(B|A) × P(A) / P(B)\`: it updates a prior belief with evidence. If 20% of email is spam, 60% of spam contains "free" and 5% of normal email does, then an email with "free" is spam with probability \`0.12 / 0.16 = 0.75\`. Naive Bayes classifiers apply this across many features assuming independence.
**Q6. What is the difference between train, validation and test sets?**
The training set is used to fit model parameters. The validation set is used to compare models and tune hyperparameters during development. The test set is held out until the end and used once to report final performance. Tuning on the test set invalidates it as an unbiased estimate.
**Q7. Why must a scaler be fitted on the training data only?**
Fitting on all data lets test-set statistics (mean, std, min, max) influence the transformation applied to training data, which is leakage and inflates evaluation scores. It also fails to simulate production, where future data is unknown when the model is trained. The fitted scaler is then saved and reused so live inputs are transformed identically.
**Q8. How would you handle a categorical feature with 50,000 unique values?**
One-hot encoding would create 50,000 sparse columns, so instead I would group rare values into "Other", use frequency or target encoding (computed on training folds only to avoid leakage), or in a neural network learn an embedding vector per category. The choice depends on the model and on whether the categories have semantic structure.
**Q9. What is the shape rule for matrix multiplication, and what shape does a neural-network layer produce?**
For \`A @ B\`, the number of columns of A must equal the number of rows of B; \`(m, n) @ (n, p)\` gives \`(m, p)\`. A layer with input \`X\` of shape \`(batch, in_features)\` and weights \`W\` of shape \`(in_features, out_features)\` produces \`(batch, out_features)\`, plus a broadcast bias of shape \`(out_features,)\`.
**Q10. Why are duplicate rows dangerous beyond wasting space?**
Duplicates overweight those examples during training, and if a duplicate ends up in both the training and test sets, the model is evaluated on data it has memorized, which inflates the test score. Deduplicate before splitting, ideally by a business key such as an order or customer ID.`
    },
    {
      heading: "17. Hands-On Exercise: Build an End-to-End Data Preparation Pipeline and Train with Gradient Descent",
      content: `This exercise ties every section together. You will generate a realistic but messy HR salary dataset for Indian cities, clean it with pandas, split it correctly, build a scikit-learn \`ColumnTransformer\` that imputes, scales and encodes, and then train a linear regression model with **your own NumPy gradient descent** on the transformed matrix, finishing with an honest validation score.
Requirements: Python 3.10+, and \`pip install numpy pandas scikit-learn\`. Save the code as \`data_prep_pipeline.py\` and run it with \`python data_prep_pipeline.py\`.
What to observe as it runs:
1. The raw shape is \`(208, 5)\` and the clean shape is \`(195, 5)\`: 8 duplicates and 5 rows with an unusable target were removed. Missing ages remain and are imputed inside the pipeline, not before the split.
2. The split sizes are 136 / 29 / 30 for train, validation and test.
3. The transformed training matrix has 8 columns: 2 standardized numeric features, 5 one-hot city columns and 1 ordinal education column.
4. The training MSE starts in the hundreds (predictions of zero are far from salaries averaging around ₹28 lakh) and falls steadily; the validation RMSE ends close to the noise we injected (about 2 lakh), which is the best any model could do on this data. Your exact figures depend on the random seed but will be in that range.
Extensions to try on your own:
• Replace the median imputer with the mean and compare validation RMSE.
• Remove the \`StandardScaler\` step and watch gradient descent with the same learning rate diverge or stall; then lower the learning rate until it works. This demonstrates why scaling matters for gradient-based models.
• Set \`handle_unknown\` to \`"error"\` and pass a row with city "Kochi" to see the failure mode you are protecting against.
• Compute the test RMSE exactly once, at the end, and resist the urge to tune afterwards.`,
      codeSnippet: `# data_prep_pipeline.py
# pip install numpy pandas scikit-learn
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder, OrdinalEncoder

rng = np.random.default_rng(42)
N = 200

# ---------- 1. Generate a realistic HR dataset (salary in lakh per annum) ----------
cities = rng.choice(["Bengaluru", "Pune", "Delhi", "Hyderabad", "Mumbai"], size=N)
education = rng.choice(["High School", "Bachelor", "Master", "PhD"], size=N, p=[0.1, 0.5, 0.3, 0.1])
experience = rng.integers(0, 25, size=N)
age = 22 + experience + rng.integers(0, 6, size=N)

edu_bonus = pd.Series(education).map({"High School": 0, "Bachelor": 2, "Master": 4, "PhD": 7}).to_numpy()
city_bonus = pd.Series(cities).map({"Bengaluru": 3, "Mumbai": 3, "Pune": 1, "Delhi": 2, "Hyderabad": 1}).to_numpy()
salary = 4 + 1.6 * experience + edu_bonus + city_bonus + rng.normal(0, 2, size=N)

df = pd.DataFrame({
    "age": age.astype(float),
    "city": cities,
    "education": education,
    "experience_years": experience,
    "salary_lpa": np.round(salary, 1).astype(str),
})

# ---------- 2. Inject the kind of mess real exports contain ----------
df.loc[rng.choice(N, 12, replace=False), "age"] = np.nan                 # missing ages
df.loc[rng.choice(N, 5, replace=False), "salary_lpa"] = "n/a"            # unusable target values
messy_idx = rng.choice(N, 20, replace=False)
df.loc[messy_idx, "city"] = df.loc[messy_idx, "city"].str.lower() + " "   # "pune " style typos
df = pd.concat([df, df.iloc[:8]], ignore_index=True)                     # duplicated rows
print("Raw shape:", df.shape)                                            # Raw shape: (208, 5)

# ---------- 3. Clean with pandas ----------
df = df.drop_duplicates()
df["city"] = df["city"].str.strip().str.title()
df["salary_lpa"] = pd.to_numeric(df["salary_lpa"], errors="coerce")
df = df.dropna(subset=["salary_lpa"])                                    # never impute the target
print("Clean shape:", df.shape)                                          # Clean shape: (195, 5)
print(df["city"].value_counts().to_dict())
print("Missing per column:", df.isna().sum().to_dict())                  # only 'age' has NaNs

# ---------- 4. Split BEFORE fitting anything ----------
X = df.drop(columns=["salary_lpa"])
y = df["salary_lpa"].to_numpy()
X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.3, random_state=42)
X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42)
print("Split sizes:", len(X_train), len(X_val), len(X_test))             # Split sizes: 136 29 30

# ---------- 5. Preprocessing pipeline: impute + scale + encode ----------
numeric_features = ["age", "experience_years"]
nominal_features = ["city"]
ordinal_features = ["education"]
edu_order = [["High School", "Bachelor", "Master", "PhD"]]

numeric_pipe = Pipeline([
    ("impute", SimpleImputer(strategy="median")),
    ("scale", StandardScaler()),
])
preprocess = ColumnTransformer([
    ("num", numeric_pipe, numeric_features),
    ("city", OneHotEncoder(handle_unknown="ignore", sparse_output=False), nominal_features),
    ("edu", OrdinalEncoder(categories=edu_order), ordinal_features),
])

Xtr = preprocess.fit_transform(X_train)        # fit ONLY on training data
Xva = preprocess.transform(X_val)              # transform, never fit
Xte = preprocess.transform(X_test)
print("Transformed train shape:", Xtr.shape)   # Transformed train shape: (136, 8)
print(list(preprocess.get_feature_names_out()))
# ['num__age', 'num__experience_years', 'city__city_Bengaluru', 'city__city_Delhi',
#  'city__city_Hyderabad', 'city__city_Mumbai', 'city__city_Pune', 'edu__education']

# ---------- 6. Linear regression trained with our own gradient descent ----------
def add_bias(M):
    return np.hstack([np.ones((M.shape[0], 1)), M])   # a column of 1s acts as the intercept

A_tr, A_va, A_te = add_bias(Xtr), add_bias(Xva), add_bias(Xte)
w = np.zeros(A_tr.shape[1])                    # one weight per column, including the bias
lr, steps = 0.05, 2000

for step in range(steps):
    pred = A_tr @ w                                            # matrix-vector product (Section 4)
    grad = (2 / len(y_train)) * A_tr.T @ (pred - y_train)      # gradient of MSE (Section 5)
    w -= lr * grad                                             # step against the gradient
    if step % 500 == 0 or step == steps - 1:
        mse = np.mean((pred - y_train) ** 2)
        print(f"step {step:4d}  train MSE = {mse:8.2f}")
# step    0  train MSE ~  900   (predicting 0 lakh for everyone)
# step 1999  train MSE ~    4   (close to the injected noise variance of 2^2 = 4)

def rmse(A, y_true):
    return float(np.sqrt(np.mean((A @ w - y_true) ** 2)))

print("Validation RMSE (lakh):", round(rmse(A_va, y_val), 2))   # roughly 2 lakh
print("Test RMSE (lakh):      ", round(rmse(A_te, y_test), 2))  # computed ONCE, at the very end

# ---------- 7. Inspect what the model learned ----------
names = ["bias"] + list(preprocess.get_feature_names_out())
for name, weight in zip(names, w):
    print(f"{name:28s} {weight:7.2f}")
# experience should get the largest positive weight; Bengaluru/Mumbai city columns
# should sit above Pune/Hyderabad; education weight should be clearly positive.`
    },
    {
      heading: "18. Summary",
      content: `• A **vector** is a list of numbers describing one example; a **matrix** is one row per example and one column per feature. Shapes are the first thing to check when code fails.
• The **dot product** is both a weighted sum (what every neuron computes) and a similarity measure; normalized, it is **cosine similarity**, the engine of embedding search and RAG.
• **Matrix multiplication** processes a whole batch at once; the inner dimensions must match (\`(m, n) @ (n, p) → (m, p)\`). A neural-network layer is \`X @ W + b\`.
• A **derivative** is a slope; the **gradient** is the vector of slopes with respect to every weight. **Gradient descent** repeatedly steps against the gradient, with the **learning rate** controlling step size.
• **Mean** vs **median**, **variance** and **standard deviation** describe data; the median is robust to outliers. Know the normal, uniform, Bernoulli and skewed distributions, and the \`n\` vs \`n − 1\` variance convention.
• **Bayes' theorem** updates a prior belief with evidence; the prior matters hugely for rare events, which is why class imbalance needs care.
• Identify each column's **data type** (numeric, nominal, ordinal, boolean, datetime, text, identifier) because the type decides the treatment.
• **Split first** into train, validation and test (stratified for classification, chronological for time series), then fit every transformation on the training set only.
• **Clean** with pandas: coerce types, strip and normalize text, deduplicate, treat impossible values as missing, impute with median/mode, investigate outliers before removing them.
• **Scale** features for distance- and gradient-based models (\`StandardScaler\` by default); trees do not need it. Save the fitted scaler with the model.
• **Encode** nominal categories with one-hot (\`handle_unknown="ignore"\`), ordinal categories with an explicit order, and the target with \`LabelEncoder\`; use embeddings or target encoding for high cardinality.
• Package everything in a \`ColumnTransformer\` + \`Pipeline\` so training and production apply identical transformations and leakage is impossible by construction.
**Next lecture:** Supervised Learning with scikit-learn — Regression & Classification`
    }
  ]
};
