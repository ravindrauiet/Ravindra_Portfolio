export const lecture01 = {
  slug: "lecture-1",
  number: 1,
  title: "Complete AI & LLM Engineering Course — Lecture 1: Introduction to AI, Machine Learning, Deep Learning & Generative AI",
  summary: "Start your AI engineering journey: what artificial intelligence is, AI vs machine learning vs deep learning vs generative AI, supervised, unsupervised, reinforcement and self-supervised learning, the modern AI engineer role, and setting up Python, Jupyter, VS Code and Google Colab.",
  readTime: "48 min read",
  difficulty: "Beginner",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. What Is Artificial Intelligence and Why Should a Developer Learn It?",
      content: `**Artificial Intelligence (AI)** is the field of building computer systems that perform tasks which normally need human intelligence: understanding language, recognising images, making decisions, planning, and learning from experience. The key word is **learning**. Traditional software is a set of rules you write by hand; an AI system discovers its own rules from data.
Here is the shift in one line. In classic programming you write: rules + data → answers. In machine learning you provide: data + answers → rules (a **model**), and then reuse that model on new data to get new answers.
Why does this matter to you as a React, Next.js or Python developer? Because in 2026 almost every product you will build or maintain has an AI feature: a chatbot that answers support tickets, a search box that understands meaning rather than keywords, a recommendation strip on an e-commerce page, fraud checks on a UPI payment, or a code assistant in your editor. Companies in Bengaluru, Hyderabad, Pune and across the world are hiring **AI engineers** — developers who know how to connect models to real applications — far faster than they are hiring pure researchers.
This course teaches you exactly that path. You already know how to build apps; we will add the ability to build **intelligent** apps. You do not need a PhD. You need curiosity, Python, and a willingness to look at data honestly.
In this first lecture we build the mental map: what AI is, where it came from, the difference between AI, ML, DL and Generative AI, the four ways machines learn, what an AI engineer actually does all day, and how to set up your laptop (or a free cloud notebook) so you can run every example in the course.`,
      codeSnippet: `# traditional_vs_ml.py
# Traditional programming: you write the rule.
def is_spam_rule_based(email_text: str) -> bool:
    keywords = ["lottery", "free money", "click here", "urgent"]
    return any(k in email_text.lower() for k in keywords)

print(is_spam_rule_based("Claim your FREE MONEY now"))   # True
print(is_spam_rule_based("Hi Priya, invoice attached"))   # False
print(is_spam_rule_based("Your KYC is expiring, verify"))  # False  <- a real scam slips through!

# Machine learning: you give examples, the computer learns the rule.
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

emails = [
    "Claim your free money now", "Urgent: click here to win lottery",
    "Your KYC is expiring, verify immediately", "Congratulations you won a prize",
    "Hi Priya, invoice attached", "Meeting moved to 4 pm",
    "Can you review my pull request", "Lunch at Saravana Bhavan?",
]
labels = [1, 1, 1, 1, 0, 0, 0, 0]   # 1 = spam, 0 = not spam

vectorizer = CountVectorizer()
X = vectorizer.fit_transform(emails)   # text -> numbers (word counts)
model = MultinomialNB().fit(X, labels) # learn from examples

test = ["Verify your account urgently to claim prize", "Sprint planning at 11 am"]
print(model.predict(vectorizer.transform(test)))   # [1 0]`
    },
    {
      heading: "2. A Brief History of AI: From Turing to Transformers",
      content: `Knowing the history helps you understand why today's tools look the way they do, and why hype cycles come and go.
• **1950 — The Turing Test.** Alan Turing asked "Can machines think?" and proposed a practical test: can a machine hold a text conversation indistinguishable from a human?
• **1956 — The Dartmouth workshop.** John McCarthy coined the term "artificial intelligence". Early researchers were optimistic that human-level AI was a few decades away.
• **1958 — The perceptron.** Frank Rosenblatt built the first trainable artificial neuron. It could learn simple patterns, but a single layer cannot solve even the XOR problem, which led to the first **AI winter** (funding cuts) in the 1970s.
• **1980s — Expert systems.** Hand-written rule bases ("if symptom A and B then disease C") were commercially popular but brittle and expensive to maintain, causing a second winter in the late 1980s.
• **1986–1990s — Backpropagation and statistical ML.** The backpropagation algorithm made multi-layer neural networks trainable. Meanwhile methods like decision trees, support vector machines and Bayesian models powered spam filters and search engines. In 1997 IBM's Deep Blue beat chess champion Garry Kasparov.
• **2012 — The deep learning breakthrough.** AlexNet, a deep convolutional network trained on GPUs, crushed the ImageNet image-recognition competition. Three ingredients had finally come together: **big data**, **GPUs**, and better **algorithms**.
• **2017 — The Transformer.** The paper "Attention Is All You Need" introduced the Transformer architecture, which processes whole sequences in parallel using **attention**. Every modern large language model (LLM) is built on it.
• **2018–2022 — Pre-trained language models.** BERT and the GPT series showed that training one huge model on internet text and then adapting it works better than training small models from scratch. In November 2022 ChatGPT made conversational AI mainstream.
• **2023–2026 — The generative and agentic era.** Models such as Claude, GPT, Gemini and open-weight families like Llama, Mistral and Qwen became multimodal (text, images, audio, code), gained very long context windows, learned to call tools, and are now used as **agents** that complete multi-step tasks. Exact capabilities and model names change every few months, so always check official provider documentation rather than memorised facts.
The lesson from history: progress is driven by data, compute and algorithms together, and the engineers who can apply the current generation of models to real problems are always in demand.`
    },
    {
      heading: "3. Narrow AI vs General AI: What Exists Today",
      content: `AI is often discussed as if it were one thing. It is useful to separate three ideas.
**Artificial Narrow Intelligence (ANI)** — systems that are excellent at one task or a bounded set of tasks. A fraud-detection model, Google Maps route planning, a face-unlock feature, a chess engine, a recommendation system. Every production AI system in the world today is narrow AI, including large language models. An LLM can write SQL, summarise a contract and translate Hindi to English, but it is still a system optimised for one job: predicting the next token in a sequence, and it fails in ways no human would, such as inventing a citation with full confidence.
**Artificial General Intelligence (AGI)** — a hypothetical system that could learn and perform **any** intellectual task a human can, transferring knowledge across completely different domains without retraining. There is no agreed test for AGI and no consensus that it exists. When you see "AGI" in a headline, treat it as a research goal and marketing term, not a product you can call from an API.
**Artificial Superintelligence (ASI)** — a system that would exceed human ability in essentially all areas. This is a topic of philosophy and safety research, not engineering practice.
Why this matters for an AI engineer: because everything you ship is narrow AI, you must design for its limitations. A model trained on last year's data does not know this year's tax rules. A model that scores 95% on a benchmark still fails 1 in 20 times, and you need a fallback. Understanding that models are powerful but narrow is the single most important mindset for building reliable AI products.
A related term you will meet is **weak vs strong AI**: weak AI simulates intelligent behaviour, strong AI would actually have understanding or mind. Engineering only ever deals with the weak kind.`
    },
    {
      heading: "4. AI vs Machine Learning vs Deep Learning vs Generative AI",
      content: `These four terms are nested like Russian dolls. Each one is a subset of the previous.
**Artificial Intelligence** is the broadest umbrella: any technique that makes software behave intelligently. This includes old-school rule-based systems, search algorithms (the A* algorithm that finds a route on a map), planning, and everything below.
**Machine Learning (ML)** is the subset of AI where the system learns patterns from data instead of being explicitly programmed. Classic ML algorithms include linear regression, logistic regression, decision trees, random forests, gradient boosting (XGBoost, LightGBM), k-means clustering and support vector machines. ML works wonderfully on **structured, tabular data** — a loan application with income, age and credit score — and is still the right choice for most business prediction problems.
**Deep Learning (DL)** is the subset of ML that uses **artificial neural networks with many layers**. The "deep" refers to depth of layers. Deep learning shines on **unstructured data**: images, audio, video and natural language, where hand-designing features is impossible. Convolutional neural networks (CNNs) handle images; recurrent networks (RNNs/LSTMs) handled sequences before Transformers replaced them. Deep learning needs more data and more compute (GPUs) than classic ML.
**Generative AI** is the subset of deep learning whose models **create new content** — text, images, code, audio, video — rather than only classifying or predicting a number. Large language models (LLMs) such as Claude, GPT and Gemini generate text; diffusion models generate images. Almost all generative text models are Transformers trained with self-supervised learning (Section 8) on enormous corpora.
A simple decision rule you will use throughout your career:
• Tabular data, need explanations, limited data → classic ML (scikit-learn, XGBoost).
• Images, audio, raw text, lots of data → deep learning (PyTorch).
• Need to generate or understand open-ended language → generative AI / LLMs (call an API or run an open-weight model).
The code snippet shows all three levels solving a tiny task so you can see how different the code looks.`,
      codeSnippet: `# ai_ml_dl_genai.py — the same idea at three levels of the pyramid
import numpy as np

# 1) Classic ML: predict a flat's price in Pune from its area (linear regression)
from sklearn.linear_model import LinearRegression
area_sqft = np.array([[600], [850], [1000], [1200], [1500]])
price_lakh = np.array([45, 62, 74, 88, 110])          # ₹ lakh
ml_model = LinearRegression().fit(area_sqft, price_lakh)
print("ML  -> 1100 sqft flat ≈ ₹%.1f lakh" % ml_model.predict([[1100]])[0])
# ML  -> 1100 sqft flat ≈ ₹81.2 lakh   (your number may differ slightly)

# 2) Deep learning: a tiny neural network in PyTorch learning the same mapping
import torch
import torch.nn as nn
X = torch.tensor(area_sqft / 1000, dtype=torch.float32)      # scale inputs
y = torch.tensor(price_lakh / 100, dtype=torch.float32).unsqueeze(1)
net = nn.Sequential(nn.Linear(1, 8), nn.ReLU(), nn.Linear(8, 1))
opt = torch.optim.Adam(net.parameters(), lr=0.05)
for epoch in range(500):
    opt.zero_grad()
    loss = nn.functional.mse_loss(net(X), y)
    loss.backward()
    opt.step()
pred = net(torch.tensor([[1.1]])).item() * 100
print("DL  -> 1100 sqft flat ≈ ₹%.1f lakh" % pred)
# DL  -> 1100 sqft flat ≈ ₹80.9 lakh   (close to the ML answer)

# 3) Generative AI: you do not train anything — you ask a pre-trained LLM.
# Pseudo-code only; real API calls (Anthropic SDK, streaming, tools) come in later lectures.
prompt = "A 1100 sqft 2BHK flat in Pune's Baner area. Write a 2-line listing description."
# response = llm.generate(prompt)   -> "Bright 2BHK in Baner with ... "
print("GenAI -> would generate free-form text from the prompt above")`
    },
    {
      heading: "5. Supervised Learning: Learning from Labelled Examples",
      content: `**Supervised learning** is the most common type of machine learning. You give the algorithm a dataset where every example comes with the correct answer (a **label**), and it learns a function from inputs (**features**) to outputs. The word "supervised" refers to the labels acting like a teacher.
There are two main flavours:
• **Classification** — the output is a category. Is this email spam or not? Is this transaction fraudulent? Which of 10 digits is in this image? Which disease does this X-ray show?
• **Regression** — the output is a continuous number. What will this flat sell for? How many orders will Swiggy receive tomorrow at 8 pm? How many days until this machine needs maintenance?
The workflow is always the same:
1. Collect labelled data (features X and targets y).
2. Split into a **training set** (the model learns from it) and a **test set** (held back to measure honest performance — usually 70–80% / 20–30%).
3. Choose an algorithm and **fit** it on the training set.
4. **Predict** on the test set and compute a metric: accuracy, precision, recall, F1 for classification; mean absolute error or RMSE for regression.
5. Tune and repeat until good enough, then deploy.
The biggest practical cost of supervised learning is **labelling**. Getting ten thousand correctly labelled X-rays requires radiologists; that is why self-supervised learning (Section 8) became so important.
The example uses the classic Iris flower dataset bundled with scikit-learn: 150 flowers, 4 measurements each, 3 species. Note how the model is evaluated only on data it never saw during training.`,
      codeSnippet: `# supervised_iris.py
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

iris = load_iris()
X, y = iris.data, iris.target            # X: 150 x 4 features, y: species 0/1/2
print(X.shape, y.shape)                  # (150, 4) (150,)

# Hold back 30% for honest evaluation
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42, stratify=y
)

clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)                # learning happens here

preds = clf.predict(X_test)
print("Accuracy:", round(accuracy_score(y_test, preds), 3))
# Accuracy: 0.911  (typical value is between 0.9 and 1.0 on this split)

print(classification_report(y_test, preds, target_names=iris.target_names))
# Shows precision / recall / f1 per species

# Predict a brand-new flower: sepal_len, sepal_wid, petal_len, petal_wid in cm
new_flower = [[5.9, 3.0, 5.1, 1.8]]
print("Predicted species:", iris.target_names[clf.predict(new_flower)[0]])
# Predicted species: virginica`
    },
    {
      heading: "6. Unsupervised Learning: Finding Structure Without Labels",
      content: `**Unsupervised learning** works on data that has **no labels**. There is no teacher and no "correct answer"; the algorithm's job is to discover hidden structure. This is extremely common in business because unlabelled data is cheap and plentiful — you have millions of customer records, but nobody has tagged which "segment" each customer belongs to.
The main families are:
• **Clustering** — group similar items together. **K-means** splits data into k groups by distance to a centre; **DBSCAN** finds dense regions and treats isolated points as noise; **hierarchical clustering** builds a tree of groups. Use cases: customer segmentation, grouping support tickets by topic, detecting communities in a social graph.
• **Dimensionality reduction** — compress many features into a few while keeping the important variation. **PCA** (principal component analysis) is the classic linear method; **t-SNE** and **UMAP** are used for visualising high-dimensional data such as word embeddings in 2D.
• **Anomaly detection** — learn what "normal" looks like and flag whatever deviates. **Isolation Forest** and autoencoders are widely used for fraud, server-monitoring and manufacturing-defect detection.
• **Association rules** — "people who buy X also buy Y", the logic behind "frequently bought together".
The hard part of unsupervised learning is **evaluation**. Without labels you cannot compute accuracy; you use internal scores (silhouette score, inertia) and, most importantly, a human looking at the clusters and asking whether they make business sense.
In the example we segment customers of an online store in Delhi by annual spend and visit frequency into three groups. Note that K-means gives arbitrary cluster numbers; naming them ("budget", "regular", "premium") is your job.`,
      codeSnippet: `# unsupervised_kmeans.py
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score

rng = np.random.default_rng(7)
# Synthetic customers: [annual_spend_in_rupees, visits_per_month]
budget  = rng.normal([ 8000, 1.5], [1500, 0.5], size=(60, 2))
regular = rng.normal([30000, 4.0], [5000, 1.0], size=(60, 2))
premium = rng.normal([90000, 9.0], [12000, 2.0], size=(30, 2))
customers = np.vstack([budget, regular, premium])     # 150 x 2, NO labels

# Always scale: spend is in tens of thousands, visits in single digits
scaled = StandardScaler().fit_transform(customers)

kmeans = KMeans(n_clusters=3, n_init=10, random_state=42).fit(scaled)
labels = kmeans.labels_
print("Silhouette score:", round(silhouette_score(scaled, labels), 3))
# Silhouette score: 0.69   (closer to 1 = well-separated clusters)

for c in range(3):
    members = customers[labels == c]
    print(f"Cluster {c}: {len(members):3d} customers, "
          f"avg spend ₹{members[:, 0].mean():,.0f}, "
          f"avg visits {members[:, 1].mean():.1f}/month")
# Cluster 0:  60 customers, avg spend ₹29,870, avg visits 4.0/month
# Cluster 1:  60 customers, avg spend ₹8,120,  avg visits 1.5/month
# Cluster 2:  30 customers, avg spend ₹89,640, avg visits 9.0/month
# (cluster numbers are arbitrary — you name them: regular / budget / premium)`
    },
    {
      heading: "7. Reinforcement Learning: Learning by Trial, Error and Reward",
      content: `**Reinforcement learning (RL)** is a different setup entirely. There is no dataset of examples. Instead an **agent** interacts with an **environment**: it observes a **state**, chooses an **action**, receives a **reward** (positive or negative), and moves to a new state. The agent's goal is to learn a **policy** — a strategy mapping states to actions — that maximises total reward over time.
Think of training a dog: you do not show it labelled examples of "sit"; you reward it when it sits. Or think of learning to ride a cycle: you fall (negative reward), adjust, and eventually balance.
Key ideas:
• **Exploration vs exploitation** — should the agent try something new (explore) or repeat what has worked (exploit)? Too little exploration and it gets stuck with a mediocre strategy.
• **Delayed reward** — in chess the reward (win/lose) comes only at the end, so the agent must learn which early moves led to it. This is the **credit assignment problem**.
• **Famous successes** — DeepMind's AlphaGo (2016) beat the world Go champion; RL controls data-centre cooling, robot arms and game-playing agents.
RL matters enormously for LLM engineers because of **RLHF (Reinforcement Learning from Human Feedback)**. After an LLM is pre-trained to predict text, humans rank its answers, a **reward model** is trained on those rankings, and RL fine-tunes the LLM to produce answers humans prefer. This step is what turned raw text predictors into helpful, polite assistants. You will meet RLHF and related techniques (DPO, RLAIF) later in the course.
The example is the simplest RL problem, the **multi-armed bandit**: a food-delivery app must choose which of three promotional banners to show. Each banner has an unknown click rate. The agent uses an **epsilon-greedy** policy: with probability epsilon it explores a random banner, otherwise it exploits the best known one. Watch how it discovers the best banner without ever being told the true rates.`,
      codeSnippet: `# reinforcement_bandit.py — epsilon-greedy multi-armed bandit
import numpy as np

rng = np.random.default_rng(0)
true_click_rates = [0.04, 0.09, 0.06]     # hidden from the agent: banner B is best
n_banners = len(true_click_rates)

counts  = np.zeros(n_banners)             # how often each banner was shown
rewards = np.zeros(n_banners)             # total clicks per banner
epsilon = 0.1                             # 10% exploration
total_clicks = 0

for step in range(10_000):                # 10,000 app opens
    if rng.random() < epsilon:
        action = rng.integers(n_banners)              # explore: random banner
    else:
        estimates = rewards / np.maximum(counts, 1)   # avoid divide-by-zero
        action = int(np.argmax(estimates))            # exploit: best so far

    clicked = rng.random() < true_click_rates[action] # environment responds
    counts[action]  += 1
    rewards[action] += clicked
    total_clicks    += clicked

for i, name in enumerate("ABC"):
    print(f"Banner {name}: shown {int(counts[i]):5d} times, "
          f"estimated CTR {rewards[i] / max(counts[i], 1):.3f}")
print("Total clicks:", total_clicks)
# Banner A: shown   356 times, estimated CTR 0.034
# Banner B: shown  9279 times, estimated CTR 0.091   <- learned the winner
# Banner C: shown   365 times, estimated CTR 0.060
# Total clicks: 880`
    },
    {
      heading: "8. Self-Supervised Learning: How Large Language Models Are Trained",
      content: `**Self-supervised learning** is the idea that made modern generative AI possible. It sits between supervised and unsupervised learning: the data has no human-written labels, but the algorithm **creates its own labels from the data itself**.
The trick is to hide part of the input and train the model to predict it:
• **Next-token prediction** (GPT-style, "causal" language modelling): show the model "The capital of Karnataka is" and train it to predict "Bengaluru". Every sentence on the internet becomes billions of free training examples.
• **Masked language modelling** (BERT-style): hide random words — "The [MASK] of Karnataka is Bengaluru" — and predict the missing word.
• **Contrastive learning** (CLIP, SimCLR): learn that an image and its caption belong together while other captions do not. This is how text-to-image models understand language.
Because no labelling is needed, a model can be trained on trillions of tokens — the entire public web, books, code repositories. To predict the next word well, the model is forced to learn grammar, facts, reasoning patterns and code structure as a side effect. This phase is called **pre-training** and produces a **foundation model**.
A foundation model is then adapted:
1. **Supervised fine-tuning (SFT)** on curated question-answer examples teaches it to follow instructions.
2. **RLHF / preference tuning** (Section 7) aligns it with what humans find helpful and safe.
3. **Prompting, retrieval (RAG) and tool use** at inference time let you specialise it for your app without any training at all — this is where most AI engineering happens.
The **token** is the unit of all of this: text is split into sub-word pieces (roughly 3–4 characters of English each) and each token becomes a number. The code shows next-token prediction at toy scale using a bigram count model so you see the mechanism with no neural network. Real LLMs replace the count table with a Transformer that has billions of parameters, but the objective is exactly the same: predict what comes next.`,
      codeSnippet: `# self_supervised_bigram.py — next-token prediction with a counting model
from collections import defaultdict, Counter
import random

corpus = """
mumbai is the financial capital of india . bengaluru is the tech capital of india .
delhi is the national capital of india . chennai is the automobile capital of india .
"""
tokens = corpus.split()                       # a real LLM uses sub-word tokens

# "Label" each token with the token that follows it — no human labelling needed
next_counts = defaultdict(Counter)
for current, nxt in zip(tokens, tokens[1:]):
    next_counts[current][nxt] += 1

print(next_counts["capital"])                 # Counter({'of': 4})
print(next_counts["the"])                     # Counter({'financial': 1, 'tech': 1, ...})

def generate(start: str, length: int = 8, seed: int = 1) -> str:
    random.seed(seed)
    out = [start]
    for _ in range(length):
        options = next_counts[out[-1]]
        if not options:
            break
        words, weights = zip(*options.items())
        out.append(random.choices(words, weights=weights)[0])   # sample next token
    return " ".join(out)

print(generate("bengaluru"))
# bengaluru is the automobile capital of india . chennai
# (Grammatical but factually wrong — a tiny model "hallucinates" too!)`
    },
    {
      heading: "9. Real-World Applications of AI and Machine Learning in Production",
      content: `AI is not a demo technology; it quietly runs a large part of daily life in India and worldwide. Mapping applications to the type of learning they use helps you pick the right tool when you design your own systems.
**Finance and payments** — UPI and card networks run **fraud detection** on every transaction in milliseconds (supervised classification plus anomaly detection). Lenders use **credit-risk models** (gradient boosting on tabular data) and LLMs to read bank statements and KYC documents.
**E-commerce and media** — Flipkart, Amazon, Netflix and YouTube **recommendation systems** combine collaborative filtering, embeddings and deep learning. **Semantic search** uses embedding models so "cheap phone with good camera" matches the right products. Generative AI writes product descriptions and answers "where is my order" chats.
**Healthcare** — deep learning reads X-rays, retinal scans and pathology slides (image classification); LLMs summarise clinical notes and help with discharge summaries. Drug discovery uses graph neural networks and protein-structure models.
**Transport and logistics** — Google Maps and Ola/Uber use regression for ETA prediction, RL and optimisation for routing and surge pricing, and computer vision in driver-assistance systems.
**Agriculture** — crop-disease detection from a phone photo (CNNs), yield prediction from satellite imagery, and chatbots in Indian languages that answer farmers' questions.
**Language and customer support** — speech-to-text (Whisper-style models), machine translation across Indian languages, **RAG chatbots** that answer from a company's own documents, and agents that can actually perform actions such as rebooking a ticket.
**Software engineering** — code completion, test generation, PR review and documentation agents are now standard parts of a developer's workflow; you are probably reading this because of one.
**Manufacturing and energy** — predictive maintenance (time-series regression and anomaly detection), visual defect inspection, and demand forecasting for power grids.
Notice the pattern: the newest, most visible applications are generative, but the majority of **revenue-generating** AI in companies is still classic supervised ML on tabular data. A good AI engineer is comfortable with both.`
    },
    {
      heading: "10. The Modern AI Engineer Role: Skills, Tools and Career Path",
      content: `The job title "AI engineer" became common around 2023 and describes a specific role that is different from a data scientist or an ML researcher. Understanding the difference helps you plan your learning.
**ML researcher / scientist** — invents new architectures and training methods, publishes papers, needs deep maths and a PhD-level background. Works at labs such as Anthropic, Google DeepMind, OpenAI, Meta, or university groups.
**Data scientist** — analyses business data, builds and evaluates classic ML models, communicates insights. Heavy on statistics, pandas and SQL.
**ML engineer / MLOps** — trains, deploys and monitors models at scale: pipelines, feature stores, GPU clusters, model serving, drift monitoring.
**AI engineer (the focus of this course)** — builds **products on top of foundation models**. Day-to-day work looks like this:
• Designing prompts and system instructions and evaluating outputs systematically (evals).
• Building **RAG** pipelines: chunking documents, generating embeddings, storing them in a vector database, retrieving the right context.
• Giving models **tools** (function calling) and orchestrating **agents** that take multi-step actions safely.
• Integrating LLM APIs into web apps: Next.js Route Handlers and Server Actions, streaming tokens to a React UI, handling rate limits, retries and cost.
• Fine-tuning smaller open-weight models when the API is too expensive or data cannot leave the premises.
• Measuring quality, latency and cost, and setting up guardrails against prompt injection and harmful outputs.
**Skills you need (in order of importance):** strong Python; solid software-engineering habits (Git, testing, APIs); an intuitive understanding of ML concepts (this course's early lectures); hands-on with one LLM provider SDK and one open-weight model; vector databases; evaluation discipline; and enough maths (linear algebra, probability, basic calculus) to read documentation and papers without fear.
**Tools you will use in this course:** Python 3.11+, NumPy, pandas, scikit-learn, PyTorch, Hugging Face Transformers, Jupyter, Google Colab, the Anthropic SDK (Python and TypeScript), a vector database, and Next.js for the web layer.
Your React/Next.js background is a real advantage: most AI products fail not at the model but at the product layer — latency, UX for streaming, error handling — exactly what you already know.`
    },
    {
      heading: "11. Course Roadmap: What You Will Learn in This AI & LLM Engineering Course",
      content: `This course is designed as a progression from foundations to production-grade LLM applications. Each lecture builds on the previous one and ends with a hands-on exercise.
**Part 1 — Foundations (Lectures 1–4)**
• Lecture 1 (this one): the AI landscape and your environment.
• Lecture 2: Math & data foundations — vectors, matrices, probability, gradients, and NumPy/pandas for loading and cleaning data.
• Lecture 3: Classic machine learning with scikit-learn — regression, classification, train/test splits, cross-validation, metrics, overfitting.
• Lecture 4: Feature engineering, model selection and an end-to-end ML project.
**Part 2 — Deep Learning (Lectures 5–8)**
• Neural networks from scratch and in PyTorch; backpropagation and optimisers.
• CNNs for images and sequence models for text.
• Transformers and attention explained from first principles.
• Transfer learning with Hugging Face.
**Part 3 — Large Language Models (Lectures 9–13)**
• How LLMs are trained: tokenisation, pre-training, fine-tuning, RLHF.
• Prompt engineering that actually works, plus structured outputs.
• Calling LLM APIs from Python and from Next.js (Route Handlers, Server Actions, streaming to the browser).
• Embeddings, vector databases and Retrieval-Augmented Generation (RAG).
• Tool use, function calling and the Model Context Protocol.
**Part 4 — Agents and Production (Lectures 14–18)**
• Building agents: planning, memory, multi-step tool loops, safety.
• Evaluation: building eval sets, LLM-as-judge, regression testing prompts.
• Fine-tuning open-weight models (LoRA/QLoRA) and when not to.
• Deployment, cost optimisation, caching, observability and guardrails.
• Capstone: a full-stack AI application in Next.js with a Python backend.
You do not need to finish everything to start building. By the end of Part 3 you will be able to ship a real RAG chatbot. Treat Parts 1 and 2 as the foundation that lets you debug when things go wrong, which they will.`
    },
    {
      heading: "12. Setting Up Python, Jupyter Notebook and VS Code for AI Development",
      content: `Let us get your machine ready. The goal is a clean, isolated Python environment so library versions never fight each other.
**Step 1 — Install Python.** Download Python 3.11 or newer from python.org (on Windows tick "Add python.exe to PATH" during installation). Verify with \`python --version\`. On macOS and Linux the command may be \`python3\`.
**Step 2 — Create a virtual environment.** A virtual environment is a private folder of packages for one project. Never install ML libraries globally; you will eventually break something.
**Step 3 — Install the core libraries.** NumPy and pandas for data, scikit-learn for classic ML, matplotlib for plots, Jupyter for notebooks, and PyTorch for deep learning. For PyTorch with GPU support, use the exact command generated on the official PyTorch "Get Started" page for your OS and CUDA version; the CPU-only build is fine for the first half of this course.
**Step 4 — Jupyter Notebook.** Notebooks let you run code in cells, see outputs inline (tables, plots) and keep notes next to code. They are the standard tool for exploration. Run \`jupyter notebook\` or \`jupyter lab\` and your browser opens at localhost:8888.
**Step 5 — VS Code.** Install the official **Python** and **Jupyter** extensions from Microsoft. VS Code can open \`.ipynb\` files directly, run cells, show variables, and debug — most engineers use it for both notebooks and production code. Select your virtual environment's interpreter with the "Python: Select Interpreter" command so the correct packages are found.
**Step 6 — Keep requirements.** Save your dependencies with \`pip freeze > requirements.txt\` so colleagues (and your future self) can recreate the environment.
Optional but recommended: **uv** (a very fast pip/venv replacement) or **conda/miniforge** if you need non-Python scientific libraries. Pick one tool and stick with it.
The snippet lists every command for Windows, macOS and Linux, followed by a verification script you should run before the next lecture.`,
      codeSnippet: `# ---------- Terminal commands (run one block for your OS) ----------
# Windows (PowerShell)
#   python -m venv .venv
#   .venv\\Scripts\\Activate.ps1
# macOS / Linux
#   python3 -m venv .venv
#   source .venv/bin/activate
#
# Then, in the activated environment:
#   python -m pip install --upgrade pip
#   pip install numpy pandas scikit-learn matplotlib jupyter ipykernel
#   pip install torch            # CPU build; see pytorch.org for GPU builds
#   jupyter notebook             # opens http://localhost:8888
#
# VS Code: install "Python" + "Jupyter" extensions, then
#   Ctrl+Shift+P -> "Python: Select Interpreter" -> choose .venv

# ---------- verify_setup.py : run this to confirm everything works ----------
import sys, platform

print("Python     :", sys.version.split()[0], "on", platform.system())

import numpy as np, pandas as pd, sklearn, matplotlib
print("NumPy      :", np.__version__)
print("pandas     :", pd.__version__)
print("scikit-learn:", sklearn.__version__)
print("matplotlib :", matplotlib.__version__)

try:
    import torch
    print("PyTorch    :", torch.__version__)
    print("CUDA GPU   :", torch.cuda.is_available())      # False is fine for now
except ImportError:
    print("PyTorch    : not installed (ok until Lecture 5)")

# A one-line sanity check that the ML stack really runs
from sklearn.linear_model import LogisticRegression
X = np.array([[0.0], [1.0], [2.0], [3.0]]); y = np.array([0, 0, 1, 1])
print("Sanity model:", LogisticRegression().fit(X, y).predict([[2.5]]))   # [1]
print("Setup OK ✔")`
    },
    {
      heading: "13. Using Google Colab for Free GPU Access",
      content: `Deep learning and LLM experiments eventually need a **GPU**. If your laptop does not have an NVIDIA GPU (most do not), **Google Colab** gives you a Jupyter notebook in the browser with a free GPU — no installation at all.
**How to start:** open colab.research.google.com, sign in with a Google account, and click "New notebook". Code cells run with Shift+Enter exactly like Jupyter. Lines beginning with \`!\` run shell commands (\`!pip install transformers\`), and lines beginning with \`%\` are notebook "magics".
**Turn on the GPU:** Runtime → Change runtime type → Hardware accelerator → GPU (a T4 is commonly offered on the free tier), then Save. Verify with \`!nvidia-smi\` or \`torch.cuda.is_available()\`.
**What you need to know about the free tier:**
• Sessions are **temporary**. If you are idle or exceed the session limit, the runtime resets and all files in \`/content\` are lost. Save results to Google Drive (\`drive.mount\`) or download them.
• GPU availability and limits **vary by demand and change over time**; Google documents the current rules on the Colab FAQ. Paid tiers (Colab Pro) offer faster GPUs and longer sessions — not needed for this course.
• Preinstalled libraries (NumPy, pandas, scikit-learn, PyTorch, Transformers) are already there, so most lectures work with zero setup.
• **Secrets:** never paste API keys into cells. Use the key icon in the left sidebar (Colab "Secrets") and read them with \`userdata.get("MY_KEY")\`.
**Alternatives:** Kaggle Notebooks (free GPU hours per week), Lightning Studios, and paid clouds (AWS, GCP, Azure, RunPod) when you need bigger GPUs. For the first half of the course your own CPU is enough; from the deep-learning lectures onward, Colab is the recommended default.
A good habit: develop and debug locally in VS Code on a tiny data sample, then run the full training in Colab.`,
      codeSnippet: `# colab_quickstart.ipynb — paste each block into its own cell

# Cell 1: check hardware (Runtime > Change runtime type > GPU first)
!nvidia-smi
import torch
print("GPU available:", torch.cuda.is_available())
print("Device       :", torch.cuda.get_device_name(0) if torch.cuda.is_available() else "CPU")

# Cell 2: install something extra (most libraries are preinstalled)
!pip -q install scikit-learn==1.5.2

# Cell 3: mount Google Drive so your work survives a runtime reset
from google.colab import drive
drive.mount("/content/drive")
save_dir = "/content/drive/MyDrive/ai-course"
import os; os.makedirs(save_dir, exist_ok=True)

# Cell 4: time a matrix multiply on CPU vs GPU to feel the difference
import time
a = torch.randn(4000, 4000)
t0 = time.time(); (a @ a); cpu_ms = (time.time() - t0) * 1000
print(f"CPU: {cpu_ms:.0f} ms")
if torch.cuda.is_available():
    a_gpu = a.cuda(); torch.cuda.synchronize()
    t0 = time.time(); (a_gpu @ a_gpu); torch.cuda.synchronize()
    print(f"GPU: {(time.time() - t0) * 1000:.0f} ms")
# CPU: ~900 ms   GPU: ~15 ms   (numbers vary by hardware)

# Cell 5: read an API key safely (set it via the key icon in the sidebar)
from google.colab import userdata
api_key = userdata.get("ANTHROPIC_API_KEY")   # never hard-code keys in cells`
    },
    {
      heading: "14. Common Mistakes Beginners Make When Starting AI and How to Fix Them",
      content: `These mistakes appear in almost every beginner project. Recognising them early will save you weeks.
**1. Jumping straight to deep learning and LLMs for every problem.** A 500-row spreadsheet of loan applications does not need a neural network; logistic regression or gradient boosting will be more accurate, faster and explainable. **Fix:** start with the simplest model that could work and only add complexity when the simple one measurably fails.
**2. Evaluating on the training data.** If you measure accuracy on the same rows the model learned from, you get a flattering number that means nothing. **Fix:** always hold out a test set (and use cross-validation on small data). Treat the test set as sacred: look at it once, at the end.
**3. Data leakage.** Including a feature that would not be available at prediction time — for example, "refund issued" when predicting "will the customer complain". The model looks brilliant offline and useless in production. **Fix:** ask for every feature, "would I know this value at the moment I make the prediction?"
**4. Not scaling features for distance-based algorithms.** K-means, k-nearest neighbours and neural networks are dominated by the feature with the largest numbers (rupees vs visits). **Fix:** use \`StandardScaler\` or \`MinMaxScaler\` inside a pipeline.
**5. Trusting LLM output as fact.** Language models produce fluent, confident text that can be completely wrong (hallucination). **Fix:** ground answers with retrieval (RAG), ask for citations, validate structured outputs, and keep a human in the loop for high-stakes decisions.
**6. Installing packages globally and ending up with version conflicts.** **Fix:** one virtual environment per project and a pinned \`requirements.txt\`.
**7. Hard-coding API keys in notebooks and pushing them to GitHub.** Keys get scraped within minutes. **Fix:** use environment variables, \`.env\` files that are git-ignored, or Colab Secrets.
**8. Ignoring the business metric.** 99% accuracy on fraud detection is useless if 99% of transactions are legitimate anyway — a model that says "never fraud" scores 99%. **Fix:** choose metrics that reflect cost: precision, recall, F1, or expected rupees saved.
**9. Treating the model as the whole product.** Latency, streaming UX, error handling, cost per request and monitoring decide whether users keep using the feature. **Fix:** apply the same engineering discipline you use for any web app.
The snippet demonstrates mistakes 2 and 3 concretely: the same model evaluated correctly and incorrectly, and a leaked feature producing an impossible score.`,
      codeSnippet: `# common_mistakes.py — see leakage and train-set evaluation with your own eyes
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

rng = np.random.default_rng(42)
n = 2000
income  = rng.normal(60_000, 20_000, n)            # monthly income (₹)
emi     = rng.normal(15_000,  6_000, n)            # existing EMIs (₹)
age     = rng.integers(21, 60, n)
risk    = (emi / income) + rng.normal(0, 0.1, n)   # hidden truth
default = (risk > 0.35).astype(int)                # 1 = loan defaulted

X_clean = np.column_stack([income, emi, age])

# MISTAKE 2: evaluating on training data
clf = RandomForestClassifier(random_state=0).fit(X_clean, default)
print("Train-set accuracy (misleading):", clf.score(X_clean, default))
# Train-set accuracy (misleading): 1.0   <- random forests memorise

X_tr, X_te, y_tr, y_te = train_test_split(X_clean, default, test_size=0.3, random_state=0)
clf = RandomForestClassifier(random_state=0).fit(X_tr, y_tr)
print("Honest test accuracy          :", round(clf.score(X_te, y_te), 3))
# Honest test accuracy          : 0.84   <- the real number

# MISTAKE 3: leakage — "collections_calls_made" only exists AFTER a default
collections_calls = default * rng.integers(1, 6, n)
X_leaky = np.column_stack([income, emi, age, collections_calls])
X_tr, X_te, y_tr, y_te = train_test_split(X_leaky, default, test_size=0.3, random_state=0)
leaky = RandomForestClassifier(random_state=0).fit(X_tr, y_tr)
print("Accuracy with leaked feature  :", round(leaky.score(X_te, y_te), 3))
# Accuracy with leaked feature  : 1.0   <- too good to be true = leakage`
    },
    {
      heading: "15. Frequently Asked Questions about AI, Machine Learning and Deep Learning",
      content: `**What is the difference between AI and machine learning?**
AI is the broad goal of making machines behave intelligently, by any technique, including hand-written rules. Machine learning is one way to achieve AI: the system learns patterns from data rather than being explicitly programmed. All ML is AI, but rule-based chess engines and route planners are AI without being ML.
**Is deep learning better than machine learning?**
Neither is universally better. Deep learning wins on unstructured data (images, audio, language) when you have lots of data and GPU compute. Classic ML such as gradient boosting usually wins on small or medium tabular datasets, trains in seconds, and is easier to explain to a regulator. Professionals pick based on the data, not the hype.
**Is generative AI the same as a large language model?**
No. Generative AI is any model that creates new content; LLMs are the text-generating subset. Image generators such as diffusion models, music generators and video models are generative AI but not LLMs. Many modern "multimodal" models combine both abilities in one system.
**Do I need strong maths to become an AI engineer?**
You need working intuition for linear algebra (vectors, matrices, dot products), probability (distributions, conditional probability) and basic calculus (what a gradient is). You do not need to derive algorithms by hand. Lecture 2 covers exactly the subset that matters, with code.
**Which programming language is best for AI: Python or JavaScript?**
Python is the standard for training, data work and research because of NumPy, pandas, scikit-learn, PyTorch and Hugging Face. JavaScript/TypeScript is excellent for the application layer: calling LLM APIs from Next.js, streaming to the UI, building agents in Node. This course uses both, Python for models and TypeScript for web integration.
**Can I learn AI without a GPU?**
Yes. Everything in Parts 1 and 2 runs on a normal laptop CPU, and Google Colab provides free GPU access for the deep-learning lectures. You only need your own GPU if you fine-tune large models regularly.
**What is the difference between supervised and unsupervised learning in simple words?**
Supervised learning is learning with an answer key: every example is labelled and the model learns to reproduce the labels. Unsupervised learning has no answer key: the model finds groups or structure on its own, and a human then interprets what it found.
**How long does it take to become an AI engineer?**
For a working developer who already codes, roughly 4–6 months of consistent part-time study is enough to build and deploy real RAG and agent applications. Depth in deep learning and fine-tuning takes longer, but you can be productive and employable before that.`
    },
    {
      heading: "16. Interview Questions and Answers on AI Fundamentals",
      content: `**Q1. Explain the relationship between AI, ML, DL and Generative AI.**
They are nested subsets. AI is the goal of intelligent behaviour in machines. ML is the subset that learns from data. DL is the subset of ML that uses multi-layer neural networks. Generative AI is the subset of DL whose models produce new content (text, images, code). An LLM such as Claude is generative AI, built with deep learning, which is machine learning, which is AI.
**Q2. What are the four types of machine learning? Give one example of each.**
Supervised (labelled data: spam classification), unsupervised (no labels: customer segmentation with k-means), reinforcement (reward signal: a game-playing agent or RLHF for LLMs), and self-supervised (labels generated from the data itself: next-token prediction used to pre-train LLMs).
**Q3. What is the difference between classification and regression?**
Both are supervised learning. Classification predicts a discrete category (fraud / not fraud, which digit), evaluated with accuracy, precision, recall and F1. Regression predicts a continuous value (price, temperature, demand), evaluated with MAE, MSE or RMSE.
**Q4. Why do we split data into training and test sets?**
To get an honest estimate of how the model will perform on unseen data. A model can memorise the training set (overfitting), so evaluating on it overstates quality. The test set simulates future data; a validation set or cross-validation is used for tuning so the test set remains untouched.
**Q5. What is overfitting and how do you detect it?**
Overfitting is when a model learns noise and specifics of the training data instead of general patterns. You detect it when training performance is much better than validation/test performance. Remedies include more data, simpler models, regularisation, early stopping, and for neural networks, dropout.
**Q6. What is self-supervised learning and why is it important for LLMs?**
It is learning where the supervision signal comes from the data itself, for example hiding the next word and predicting it. It removes the need for human labels, so models can train on trillions of tokens from the web. This is how foundation models are pre-trained before fine-tuning and RLHF.
**Q7. What is the difference between narrow AI and general AI?**
Narrow AI performs a specific task or bounded set of tasks; every deployed system today, including LLMs, is narrow. General AI (AGI) would learn and perform any intellectual task a human can, transferring knowledge across domains. AGI does not currently exist as an engineering artefact.
**Q8. What is a hallucination in a language model and how do engineers reduce it?**
A hallucination is fluent, confident output that is factually wrong or fabricated, because the model is optimising for plausible next tokens, not truth. Engineers reduce it with retrieval-augmented generation (grounding in real documents), requiring citations, constraining outputs to schemas, lowering temperature for factual tasks, and adding verification steps or human review.
**Q9. What does an AI engineer do that a data scientist does not?**
An AI engineer builds products on top of foundation models: prompt design, RAG, tool use, agents, API integration, streaming UIs, evaluation and guardrails, with a strong software-engineering focus. A data scientist focuses on analysing data and training classic models to produce insights and predictions.
**Q10. When would you choose classic ML over an LLM for a text task?**
When the task is a narrow, high-volume classification with plenty of labelled data (for example routing 1 million support tickets into 10 categories), a fine-tuned small model or even TF-IDF plus logistic regression is cheaper, faster, deterministic and easier to monitor. LLMs are preferred when the task is open-ended, labels are scarce, or outputs must be generated rather than selected.`
    },
    {
      heading: "17. Hands-On Exercise: Environment Check and Your First Three Models",
      content: `Time to put everything in this lecture into one runnable program. The exercise has four parts in a single script, which you can also paste cell by cell into Jupyter or Colab.
**Goal:** confirm your environment works, generate a realistic synthetic dataset of Indian online-store customers, and apply all three classic learning types to it:
1. **Supervised regression** — predict a customer's annual spend from their age, city tier and monthly visits.
2. **Supervised classification** — predict whether a customer will churn (stop buying) in the next 3 months.
3. **Unsupervised clustering** — segment customers without using any labels and compare the segments to the true hidden groups.
4. **Plot** the clusters and save the figure as a PNG so you have your first ML artefact.
**Instructions:**
• Create a folder \`ai-course/lecture01\`, activate your virtual environment and save the code as \`first_models.py\`.
• Run \`python first_models.py\`. Expected output is shown in the comments; your numbers will be close but not identical because of the random data.
• Open \`customer_segments.png\` and check that the three clusters are visually separated.
**Stretch tasks (optional):**
• Change \`test_size\` from 0.25 to 0.5 and observe how the test metrics change. Why?
• Add a leaked feature (for example \`days_since_last_order\` computed from the churn label) and watch the accuracy jump to 1.0 — then remove it.
• Try \`n_clusters=2\` and \`n_clusters=5\` and compare silhouette scores. Which k would you pick, and what business names would you give the segments?
Everything here is plain NumPy, pandas, scikit-learn and matplotlib — no GPU, no API key, no downloads.`,
      codeSnippet: `# first_models.py — Lecture 1 hands-on: regression, classification, clustering
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")                     # save plots to file (works without a display)
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.cluster import KMeans
from sklearn.metrics import (mean_absolute_error, r2_score,
                             accuracy_score, f1_score, silhouette_score)

# ---------- 0. Build a realistic synthetic dataset ----------
rng = np.random.default_rng(2026)
n = 1500
segment = rng.choice(["budget", "regular", "premium"], size=n, p=[0.5, 0.35, 0.15])
age = rng.integers(18, 65, size=n)
city_tier = rng.choice([1, 2, 3], size=n, p=[0.4, 0.35, 0.25])   # 1 = metro

base_visits = {"budget": 1.5, "regular": 4.0, "premium": 9.0}
base_spend  = {"budget": 8_000, "regular": 30_000, "premium": 90_000}
visits = np.array([rng.normal(base_visits[s], 0.8) for s in segment]).clip(0.2)
spend = np.array([
    base_spend[s] * (1 + 0.004 * (a - 40)) * (1.15 if t == 1 else 1.0)
    + rng.normal(0, base_spend[s] * 0.12)
    for s, a, t in zip(segment, age, city_tier)
]).clip(500)

# Churn is more likely for low-visit, low-spend customers
churn_prob = 1 / (1 + np.exp(0.9 * visits + spend / 40_000 - 4.5))
churn = (rng.random(n) < churn_prob).astype(int)

df = pd.DataFrame({"age": age, "city_tier": city_tier, "visits_per_month": visits,
                   "annual_spend": spend.round(0), "churned": churn, "true_segment": segment})
print(df.head())
print("\\nChurn rate:", round(df.churned.mean(), 3))        # ~0.3

# ---------- 1. Supervised regression: predict annual spend ----------
X_reg = df[["age", "city_tier", "visits_per_month"]]
y_reg = df["annual_spend"]
Xtr, Xte, ytr, yte = train_test_split(X_reg, y_reg, test_size=0.25, random_state=1)

reg = make_pipeline(StandardScaler(), LinearRegression()).fit(Xtr, ytr)
pred = reg.predict(Xte)
print("\\n[Regression] MAE: ₹{:,.0f}   R²: {:.3f}".format(
    mean_absolute_error(yte, pred), r2_score(yte, pred)))
# [Regression] MAE: ₹9,800   R²: 0.85   (visits is a strong predictor of spend)

# ---------- 2. Supervised classification: predict churn ----------
X_clf = df[["age", "city_tier", "visits_per_month", "annual_spend"]]
y_clf = df["churned"]
Xtr, Xte, ytr, yte = train_test_split(X_clf, y_clf, test_size=0.25,
                                      random_state=1, stratify=y_clf)
clf = make_pipeline(StandardScaler(), LogisticRegression()).fit(Xtr, ytr)
pred = clf.predict(Xte)
print("[Classification] accuracy: {:.3f}   F1: {:.3f}".format(
    accuracy_score(yte, pred), f1_score(yte, pred)))
# [Classification] accuracy: 0.86   F1: 0.74

new_customer = pd.DataFrame([{"age": 29, "city_tier": 1,
                              "visits_per_month": 1.0, "annual_spend": 6_000}])
print("New customer churn probability:",
      round(clf.predict_proba(new_customer)[0, 1], 2))      # e.g. 0.71

# ---------- 3. Unsupervised clustering: segment customers (no labels used) ----------
X_clu = df[["visits_per_month", "annual_spend"]]
scaler = StandardScaler().fit(X_clu)
Xs = scaler.transform(X_clu)
km = KMeans(n_clusters=3, n_init=10, random_state=1).fit(Xs)
df["cluster"] = km.labels_
print("\\n[Clustering] silhouette:", round(silhouette_score(Xs, km.labels_), 3))
# [Clustering] silhouette: 0.62

# Compare discovered clusters with the hidden true segments
print(pd.crosstab(df["cluster"], df["true_segment"]))
# true_segment  budget  premium  regular
# cluster
# 0                  0      221        9
# 1                738        0       47     <- each cluster maps mostly to one segment
# 2                 12        4      469

# ---------- 4. Plot and save ----------
fig, ax = plt.subplots(figsize=(7, 5))
scatter = ax.scatter(df["visits_per_month"], df["annual_spend"] / 1000,
                     c=df["cluster"], cmap="viridis", s=12, alpha=0.7)
centres = scaler.inverse_transform(km.cluster_centers_)
ax.scatter(centres[:, 0], centres[:, 1] / 1000, c="red", marker="X", s=150, label="centres")
ax.set_xlabel("Visits per month"); ax.set_ylabel("Annual spend (₹ thousand)")
ax.set_title("Customer segments discovered by K-means"); ax.legend()
fig.tight_layout(); fig.savefig("customer_segments.png", dpi=120)
print("\\nSaved customer_segments.png — open it to see your first ML result!")`
    },
    {
      heading: "18. Summary",
      content: `• **AI** is software that performs tasks needing human-like intelligence; **machine learning** achieves this by learning rules from data instead of hand-coding them.
• History moved from the Turing Test (1950) through two AI winters to the deep-learning breakthrough (2012), the Transformer (2017) and today's generative, agentic LLMs. Data, compute and algorithms advance together.
• Every production system today is **narrow AI**; **AGI** is a research goal, not a product. Design for model limitations.
• **AI ⊃ ML ⊃ DL ⊃ Generative AI.** Use classic ML for tabular data, deep learning for images/audio/text, and LLMs for open-ended language generation.
• Four ways machines learn: **supervised** (labelled examples → classification or regression), **unsupervised** (no labels → clustering, dimensionality reduction, anomaly detection), **reinforcement** (reward signal → policies; RLHF for LLMs) and **self-supervised** (labels from the data itself → how foundation models are pre-trained).
• AI already runs fraud detection, recommendations, maps, medical imaging, translation and code assistants; most revenue still comes from classic ML on tabular data.
• The **AI engineer** builds products on foundation models: prompts, RAG, tool use, agents, API integration, streaming UIs, evals and guardrails. Your web-development skills are an asset.
• Set up a **virtual environment** with NumPy, pandas, scikit-learn, matplotlib, Jupyter and PyTorch; use **VS Code** with the Python and Jupyter extensions; use **Google Colab** for free GPU access and keep API keys in Secrets, never in cells.
• Avoid the classic mistakes: evaluating on training data, data leakage, unscaled features, trusting LLM output blindly, and global package installs.
**Next lecture:** Math & Data Foundations for Machine Learning`
    }
  ]
};
