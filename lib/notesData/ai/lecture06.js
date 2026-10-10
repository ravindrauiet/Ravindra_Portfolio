export const lecture06 = {
  slug: "lecture-6",
  number: 6,
  title: "Complete AI & LLM Engineering Course — Lecture 6: NLP, Embeddings & the Transformer Architecture",
  summary: "Learn NLP from text preprocessing and tokenization (words, subwords, BPE) to bag-of-words, TF-IDF and word embeddings, RNN/LSTM limits, attention and self-attention, the transformer architecture (encoder, decoder, positional encoding, multi-head attention), BERT vs GPT, and Hugging Face pipelines.",
  readTime: "58 min read",
  difficulty: "Intermediate",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. Introduction: Why NLP, Embeddings and Transformers Are the Foundation of Modern AI Engineering",
      content: `Every large language model you will ever call — Claude, GPT-style models, Llama, Gemma, Mistral — is a **transformer** that reads **tokens**, turns them into **embeddings**, and uses **attention** to decide which parts of the input matter. Natural Language Processing (NLP) is the field that worked out each of those ideas, one by one, over about thirty years. If you understand this lecture, nothing an LLM does will feel like magic again: context windows, token pricing, why a model "forgets" the start of a long prompt, why RAG works with vector search, why fine-tuning BERT is different from prompting GPT — all of it follows from the mechanics here.
In the previous lecture you trained neural networks with PyTorch on numbers and images. Text is harder because it is **discrete, variable-length and ambiguous**. "Bank" means a riverbank or an ICICI branch depending on context; "not bad" is positive although it contains "bad"; a Hinglish review like "yeh phone mast hai but battery thodi weak" mixes two languages in one sentence. A model cannot do arithmetic on strings, so the whole pipeline is about converting text into vectors that preserve meaning, and then learning from those vectors.
We will build that pipeline progressively:
• **Preprocessing and tokenization** — how raw text becomes a sequence of integer IDs (word, subword and byte-pair encoding tokenizers).
• **Sparse representations** — bag-of-words and TF-IDF, which still power many production search and classification systems.
• **Dense embeddings** — Word2Vec-style vectors where meaning becomes geometry, the idea behind every vector database.
• **Sequence models** — RNNs and LSTMs, why they were the standard until 2017, and why they hit a wall.
• **Attention and self-attention** — the single idea that replaced recurrence.
• **The transformer** — encoder, decoder, positional encoding, multi-head attention, residual connections and layer normalization.
• **Encoder vs decoder families** — why BERT is for understanding and GPT-style models are for generation.
• **Hugging Face transformers** — using pretrained models in five lines, and what happens under the hood of a \`pipeline\`.
Every section has runnable Python (scikit-learn, NumPy, PyTorch, Hugging Face) so you can check each claim yourself. By the end you will implement scaled dot-product attention from scratch, build a transformer encoder block in PyTorch, and ship a semantic search plus sentiment service using pretrained models — the same building blocks used in production at Indian startups and global labs alike.`
    },
    {
      heading: "2. Text Preprocessing for NLP: Cleaning, Normalization, Stop Words, Stemming and Lemmatization",
      content: `**Preprocessing** is everything you do to raw text before a model sees it. The goal is to remove variation that carries no meaning for your task while keeping variation that does. Which steps are right depends entirely on the model you feed afterwards — this is the first place beginners go wrong, so we will be explicit.
Common steps for classical NLP (bag-of-words, TF-IDF, logistic regression):
• **Lowercasing** — "Mumbai", "mumbai" and "MUMBAI" become one feature. Risky for named-entity tasks where "Apple" vs "apple" matters.
• **Unicode normalization** — Indian text often arrives with mixed Unicode forms; \`unicodedata.normalize("NFKC", text)\` collapses visually identical characters (full-width digits, ligatures) into canonical ones.
• **Removing noise** — HTML tags, URLs, phone numbers, repeated punctuation ("sooooo good!!!!"). Use regular expressions carefully; do not strip emojis or Devanagari characters by accident with \`[^a-z]\`.
• **Stop-word removal** — dropping very frequent words such as "the", "is", "and". Helps bag-of-words models by shrinking the feature space, but destroys meaning for sentiment ("not good" becomes "good") and is never done for transformers.
• **Stemming** — chopping suffixes with rules: "running", "runs", "runner" → "run"; but also "university" → "univers". Fast, crude, language-specific (Porter stemmer for English).
• **Lemmatization** — mapping to the dictionary form using vocabulary and part of speech: "better" → "good", "was" → "be". Slower, more accurate; spaCy and NLTK provide it.
For **transformer models the rule is the opposite**: do almost nothing. BERT and GPT tokenizers were trained on raw, cased, punctuated text; the model learned that "!!!" and capital letters carry emotion. Lowercasing a cased model's input, removing stop words, or stemming before a transformer actively hurts accuracy because the input no longer looks like the training distribution. The only preprocessing you still do for transformers is removing genuine garbage (HTML, boilerplate), handling encoding errors, and **truncating or chunking** long documents to fit the context window.
The snippet below shows a reusable cleaning function for classical pipelines, a light cleaner for transformer pipelines, and a simple rule-based stemmer so you can see what stemming really does to words.`,
      codeSnippet: `# preprocess.py — text preprocessing for classical NLP vs transformers
import re
import unicodedata

STOP_WORDS = {"the", "a", "an", "is", "are", "was", "were", "and", "or", "of",
              "to", "in", "on", "for", "it", "this", "that", "with", "as", "at"}

def clean_classical(text: str) -> list[str]:
    """Aggressive cleaning for bag-of-words / TF-IDF models."""
    text = unicodedata.normalize("NFKC", text)
    text = text.lower()
    text = re.sub(r"<[^>]+>", " ", text)                 # strip HTML tags
    text = re.sub(r"https?://\\S+|www\\.\\S+", " ", text)   # strip URLs
    text = re.sub(r"[^a-z0-9\\u0900-\\u097F\\s]", " ", text)  # keep latin, digits, Devanagari
    tokens = text.split()
    return [t for t in tokens if t not in STOP_WORDS]

def clean_for_transformer(text: str) -> str:
    """Minimal cleaning: keep case, punctuation and emojis; remove real garbage only."""
    text = unicodedata.normalize("NFKC", text)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\\s+", " ", text).strip()
    return text

def porter_like_stem(word: str) -> str:
    """Tiny illustrative stemmer (real Porter stemmer has ~60 rules)."""
    for suffix in ("ingly", "edly", "ing", "ed", "ly", "es", "s"):
        if word.endswith(suffix) and len(word) - len(suffix) >= 3:
            return word[: -len(suffix)]
    return word

review = "<p>The delivery was NOT good!!! Reached Pune 2 days late. See https://x.in/abc</p>"
print(clean_classical(review))
# ['delivery', 'not', 'good', 'reached', 'pune', '2', 'days', 'late', 'see']
print(clean_for_transformer(review))
# The delivery was NOT good!!! Reached Pune 2 days late. See https://x.in/abc
print([porter_like_stem(w) for w in ["running", "delivered", "universities", "quickly"]])
# ['runn', 'deliver', 'universiti', 'quick']   <- note the crude 'runn' and 'universiti'

# Lemmatization with spaCy (pip install spacy && python -m spacy download en_core_web_sm)
# import spacy
# nlp = spacy.load("en_core_web_sm")
# print([t.lemma_ for t in nlp("The couriers were running late and delivered better boxes")])
# ['the', 'courier', 'be', 'run', 'late', 'and', 'deliver', 'well', 'box']`
    },
    {
      heading: "3. Tokenization: Word, Character, Subword and Byte-Pair Encoding (BPE) Tokenizers",
      content: `A **tokenizer** converts a string into a sequence of integer IDs from a fixed **vocabulary**. Everything downstream — embeddings, context windows, API pricing — is counted in these tokens, so the tokenizer design is a real engineering decision with three competing options.
**Word-level tokenization** splits on whitespace and punctuation. It is intuitive but has an **out-of-vocabulary (OOV)** problem: a vocabulary built from training text will never contain "Bengaluru-based", "GPT-5" or a typo like "recieved", so they all become a single \`<UNK>\` token and their meaning is lost. Vocabularies also balloon to hundreds of thousands of entries, each needing its own embedding row.
**Character-level tokenization** has a tiny vocabulary (a few hundred symbols) and no OOV problem, but sequences become very long ("transformer" is 11 tokens instead of 1), and each character carries almost no meaning on its own, so models must learn spelling before semantics.
**Subword tokenization** is the compromise every modern LLM uses: common words stay whole ("the", "delivery"), rare words split into meaningful pieces ("tokenization" → "token" + "##ization"), and anything can be represented as a fallback to characters or bytes. The three main algorithms are:
• **Byte-Pair Encoding (BPE)** — start with characters (or bytes), count the most frequent adjacent pair, merge it into a new symbol, repeat for N merges. GPT-2 introduced **byte-level BPE** with a 50,257-token vocabulary so any Unicode text, including emojis and Hindi, can be encoded with no \`<UNK>\`. The GPT family, Llama and most open LLMs use BPE variants.
• **WordPiece** — used by BERT (30,522 tokens). Similar to BPE but chooses merges that maximize training-data likelihood; continuation pieces are marked with "##".
• **Unigram / SentencePiece** — starts with a large vocabulary and prunes it; works directly on raw text without pre-splitting on spaces, which suits languages like Hindi, Japanese or Thai. Used by T5, ALBERT and many multilingual models.
Practical consequences you will meet as an AI engineer: English averages roughly 1.3 tokens per word on modern tokenizers, while Hindi in Devanagari can take three to five times more tokens for the same meaning because the vocabulary was dominated by English — so the same prompt costs more and fills the context window faster. Numbers are often split unpredictably ("2024" might be one token, "20241009" four), which is one reason LLMs struggle with arithmetic. Leading spaces are part of tokens in GPT-style tokenizers (" hello" and "hello" are different IDs), which is why prompts ending with a trailing space can degrade output.
The code trains a miniature BPE from scratch so you can watch merges happen, then compares real GPT-2 and BERT tokenizers from Hugging Face.`,
      codeSnippet: `# bpe_demo.py — a minimal byte-pair encoding trainer + real tokenizers
from collections import Counter

def train_bpe(corpus_words, num_merges):
    # each word is a tuple of symbols, ending with a special end-of-word marker
    vocab = Counter()
    for w in corpus_words:
        vocab[tuple(w) + ("</w>",)] += 1
    merges = []
    for step in range(num_merges):
        pairs = Counter()
        for symbols, freq in vocab.items():
            for a, b in zip(symbols, symbols[1:]):
                pairs[(a, b)] += freq
        if not pairs:
            break
        best = max(pairs, key=pairs.get)
        merges.append(best)
        new_vocab = Counter()
        for symbols, freq in vocab.items():
            out, i = [], 0
            while i < len(symbols):
                if i < len(symbols) - 1 and (symbols[i], symbols[i + 1]) == best:
                    out.append(symbols[i] + symbols[i + 1]); i += 2
                else:
                    out.append(symbols[i]); i += 1
            new_vocab[tuple(out)] += freq
        vocab = new_vocab
        print(f"merge {step + 1}: {best[0]!r} + {best[1]!r} -> {best[0] + best[1]!r}")
    return merges

corpus = ("low lower lowest newer newest wider slow slower " * 10).split()
merges = train_bpe(corpus, num_merges=6)
# merge 1: 'e' + 'r' -> 'er'
# merge 2: 'er' + '</w>' -> 'er</w>'
# merge 3: 'l' + 'o' -> 'lo'
# merge 4: 'lo' + 'w' -> 'low'
# merge 5: 'e' + 's' -> 'es'
# merge 6: 'es' + 't' -> 'est'
# ... "lowest" is now ['low', 'est', '</w>'] : a stem plus a suffix, learned from counts alone.

# Real tokenizers (pip install transformers)
from transformers import AutoTokenizer
gpt2 = AutoTokenizer.from_pretrained("openai-community/gpt2")       # byte-level BPE
bert = AutoTokenizer.from_pretrained("google-bert/bert-base-uncased")  # WordPiece

text = "Tokenization of embeddings in Bengaluru costs ₹499"
print(gpt2.tokenize(text))
# ['Token', 'ization', 'Ġof', 'Ġembed', 'dings', 'Ġin', 'ĠBeng', 'al', 'uru', 'Ġcosts', 'Ġâ', 'Ĥ', '¹', '499']
#  'Ġ' marks a leading space; the rupee sign is split into raw bytes.
print(bert.tokenize(text))
# ['token', '##ization', 'of', 'em', '##bed', '##ding', '##s', 'in', 'bengaluru', 'costs', '[UNK]', '499']
#  BERT lowercases, marks continuations with '##', and has no byte fallback -> [UNK] for ₹.
print(len(gpt2(text)["input_ids"]), "GPT-2 tokens;", len(bert(text)["input_ids"]), "BERT tokens (incl. [CLS]/[SEP])")`
    },
    {
      heading: "4. Bag-of-Words and TF-IDF: Turning Text into Sparse Vectors with scikit-learn",
      content: `Once text is tokenized, the oldest and still very useful representation is the **bag-of-words (BoW)**: a vector with one dimension per vocabulary word, where each entry counts how often that word appears in the document. Word order is thrown away — "dog bites man" and "man bites dog" get identical vectors — which is why it is a "bag". Despite that, for topic classification, spam filtering and keyword search, which words appear is most of the signal.
Raw counts have a problem: words like "phone" appear in every review of a phone store, so they dominate the vector while carrying no information about which review is positive or about a specific defect. **TF-IDF (term frequency – inverse document frequency)** fixes that by weighting each count by how rare the word is across the corpus:
• **TF** — how often term t appears in document d (often normalized by document length).
• **IDF** — log of (number of documents / number of documents containing t). A word in every document gets IDF near 0; a word in 1 of 10,000 documents gets a high weight. scikit-learn uses the smoothed form idf(t) = ln((1 + n) / (1 + df(t))) + 1 and then L2-normalizes each row, so document vectors have unit length and cosine similarity is just a dot product.
Two extensions make BoW surprisingly strong. **N-grams** add adjacent word pairs or triples as features, so "not good" becomes its own dimension and sentiment is partly recovered. **Character n-grams** (\`analyzer="char_wb"\`) handle typos, Hinglish spellings ("acha", "accha", "achha") and product codes that word tokenizers mangle.
Where TF-IDF still wins in 2026: it trains in seconds on a laptop, is fully interpretable (you can print the top weighted words per class), has no GPU cost, and is a hard baseline to beat on short, keyword-heavy text. Elasticsearch and OpenSearch's default BM25 ranking is a refined TF-IDF, and "hybrid search" in RAG systems combines exactly this sparse signal with dense embeddings because each catches what the other misses (exact product codes vs paraphrases).
Where it fails: no synonyms ("cheap" and "affordable" are orthogonal), no word order beyond small n-grams, vectors with tens of thousands of mostly-zero dimensions, and zero transfer — a model trained on restaurant reviews knows nothing about hotel reviews. Those failures are what embeddings fix in the next section.`,
      codeSnippet: `# tfidf_sentiment.py — bag-of-words vs TF-IDF for review classification (scikit-learn)
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import cross_val_score
import numpy as np

reviews = [
    "delivery was fast and the biryani was delicious", "not good, the food arrived cold",
    "excellent service, will order again", "worst experience, late and rude delivery boy",
    "fresh, hot and tasty, value for money", "packaging was bad and the curry leaked",
    "quick delivery and friendly staff", "terrible, never ordering from here again",
    "loved the paneer tikka, perfectly cooked", "cold rotis and not worth the price",
    "great food great price great service", "disappointing portion size for 450 rupees",
]
labels = np.array([1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0])  # 1 = positive

# 1) Plain bag-of-words
bow = CountVectorizer()
X = bow.fit_transform(reviews)
print("vocabulary size:", len(bow.vocabulary_), "| matrix shape:", X.shape)
# vocabulary size: 60 | matrix shape: (12, 60)   -> sparse: most entries are 0
print(X[0].toarray()[0][:12])  # counts for the first 12 vocabulary words

# 2) TF-IDF with unigrams + bigrams so "not good" becomes a feature
tfidf = TfidfVectorizer(ngram_range=(1, 2), min_df=1, sublinear_tf=True)
X_tfidf = tfidf.fit_transform(reviews)
print("tf-idf features:", X_tfidf.shape[1])

for name, vec in [("BoW", CountVectorizer()), ("TF-IDF 1-2gram", TfidfVectorizer(ngram_range=(1, 2)))]:
    clf = make_pipeline(vec, LogisticRegression(max_iter=1000))
    scores = cross_val_score(clf, reviews, labels, cv=3)
    print(f"{name:15s} accuracy: {scores.mean():.2f}")

# 3) Interpretability: most positive / negative n-grams
clf = make_pipeline(TfidfVectorizer(ngram_range=(1, 2)), LogisticRegression(max_iter=1000)).fit(reviews, labels)
feature_names = clf[0].get_feature_names_out()
weights = clf[1].coef_[0]
top_pos = [feature_names[i] for i in weights.argsort()[-5:][::-1]]
top_neg = [feature_names[i] for i in weights.argsort()[:5]]
print("positive signals:", top_pos)   # e.g. ['great', 'delivery', 'fast', 'service', 'tasty']
print("negative signals:", top_neg)   # e.g. ['not', 'cold', 'bad', 'never', 'late']
print(clf.predict(["food was not fresh and delivery was late"]))  # [0]`
    },
    {
      heading: "5. Word Embeddings: Word2Vec, GloVe and Why Meaning Becomes Geometry",
      content: `A **word embedding** is a dense vector — typically 50 to 1,024 floating-point numbers — learned so that words used in similar contexts end up close together. This is the **distributional hypothesis** (Firth, 1957: "you shall know a word by the company it keeps") turned into numbers. Instead of a 50,000-dimensional one-hot vector where every word is equally distant from every other, "cheap", "affordable" and "budget" cluster together, and arithmetic on vectors captures relations: the famous result vector("king") − vector("man") + vector("woman") lands nearest to vector("queen").
**Word2Vec** (Mikolov et al., 2013) learns embeddings with a tiny neural network and a self-supervised task that needs no labels — just text:
• **Skip-gram** — given a centre word, predict the words within a window around it. "paneer" should predict "tikka", "butter", "masala".
• **CBOW (continuous bag of words)** — given the context words, predict the centre word.
The trick is that the prediction task is thrown away; the learned weight matrix (one row per vocabulary word) is the product. To make training fast, **negative sampling** replaces the full softmax over the vocabulary with a handful of binary decisions: is this (word, context) pair real or randomly sampled?
**GloVe** (Stanford, 2014) gets to similar vectors by factorizing the global word co-occurrence matrix instead of streaming through windows. **fastText** (Facebook, 2016) represents each word as a bag of character n-grams, so it can build vectors for misspellings and unseen words — useful for Indian-language and social-media text.
Two properties make embeddings the backbone of modern AI engineering. First, **similarity is a dot product**: cosine similarity between vectors gives a semantic distance, which is exactly what a vector database (pgvector, Pinecone, Qdrant, Milvus) indexes for retrieval-augmented generation. Second, embeddings are **transferable**: vectors trained on Wikipedia carry meaning into your 500-row customer-support dataset, something TF-IDF can never do.
The limitation that motivated everything after 2017: a static embedding gives one vector per word regardless of context. "Bank" has a single vector that is a blurry average of riverbank and ICICI bank. Contextual embeddings from transformers (Section 10 onward) produce a different vector for each occurrence, conditioned on the whole sentence.
In PyTorch, an embedding table is just \`nn.Embedding(vocab_size, dim)\` — a lookup into a learnable matrix. The snippet trains skip-gram with negative sampling on a toy corpus so you can watch related words move together, then shows how to use pretrained vectors.`,
      codeSnippet: `# word2vec_skipgram.py — skip-gram with negative sampling in PyTorch (toy scale)
import random, torch, torch.nn as nn, torch.nn.functional as F

corpus = """
paneer tikka masala is a delicious north indian dish . butter chicken is a creamy north indian dish .
masala dosa is a crispy south indian dish . idli sambar is a soft south indian breakfast .
mumbai is a coastal city in maharashtra . pune is a city in maharashtra near mumbai .
chennai is a coastal city in tamil nadu . bengaluru is a city in karnataka .
""".split()
vocab = sorted(set(corpus)); w2i = {w: i for i, w in enumerate(vocab)}
ids = [w2i[w] for w in corpus]
WINDOW, DIM, NEG = 2, 32, 5

pairs = [(ids[i], ids[j]) for i in range(len(ids))
         for j in range(max(0, i - WINDOW), min(len(ids), i + WINDOW + 1)) if i != j]

class SkipGram(nn.Module):
    def __init__(self, V, D):
        super().__init__()
        self.center = nn.Embedding(V, D)   # the vectors we keep
        self.context = nn.Embedding(V, D)  # auxiliary vectors
    def forward(self, c, ctx, neg):
        vc = self.center(c)                                  # (B, D)
        pos = (vc * self.context(ctx)).sum(-1)               # (B,)
        negs = torch.bmm(self.context(neg), vc.unsqueeze(2)).squeeze(2)  # (B, NEG)
        return -(F.logsigmoid(pos) + F.logsigmoid(-negs).sum(1)).mean()

torch.manual_seed(0); random.seed(0)
model = SkipGram(len(vocab), DIM); opt = torch.optim.Adam(model.parameters(), lr=0.01)
for epoch in range(300):
    random.shuffle(pairs)
    c = torch.tensor([p[0] for p in pairs]); ctx = torch.tensor([p[1] for p in pairs])
    neg = torch.randint(0, len(vocab), (len(pairs), NEG))
    loss = model(c, ctx, neg); opt.zero_grad(); loss.backward(); opt.step()
    if epoch % 100 == 0: print(f"epoch {epoch} loss {loss.item():.3f}")

E = F.normalize(model.center.weight.detach(), dim=1)   # unit vectors -> cosine = dot
def nearest(word, k=3):
    sims = E @ E[w2i[word]]
    return [vocab[i] for i in sims.argsort(descending=True)[1:k + 1]]
print("near 'pune':", nearest("pune"))        # e.g. ['mumbai', 'chennai', 'bengaluru']
print("near 'dosa':", nearest("dosa"))        # e.g. ['idli', 'tikka', 'dish']

# Pretrained vectors (pip install gensim) — 300-d GloVe trained on 6B tokens, ~400k words
# import gensim.downloader as api
# glove = api.load("glove-wiki-gigaword-300")
# print(glove.most_similar(positive=["king", "woman"], negative=["man"], topn=1))  # [('queen', 0.69)]
# print(glove.similarity("cheap", "affordable"), glove.similarity("cheap", "mumbai"))  # ~0.6 vs ~0.1`
    },
    {
      heading: "6. Sequence Models Briefly: RNNs, LSTMs and Why They Hit a Wall",
      content: `Embeddings give each word a vector, but a sentence is a **sequence**. Before 2017 the standard way to read a sequence was the **recurrent neural network (RNN)**: process tokens one at a time, carrying a hidden state vector h that is updated at each step, h_t = tanh(W_x · x_t + W_h · h_{t−1} + b). The final hidden state is a summary of the whole sentence, which you feed to a classifier; or you emit an output at every step for tagging and translation.
Plain RNNs suffer from **vanishing and exploding gradients**: to learn that the word at position 3 affects the output at position 60, the gradient must flow back through 57 multiplications by W_h, and it either shrinks to nothing or blows up. In practice vanilla RNNs remember only about ten to twenty tokens.
The **Long Short-Term Memory (LSTM)** network (Hochreiter & Schmidhuber, 1997) adds a separate **cell state** that flows through time with only element-wise operations, plus three learned **gates** — forget, input and output — that decide what to erase, what to write and what to expose at each step. Gradients can travel along the cell state almost unchanged, so LSTMs reliably learn dependencies over hundreds of tokens. The **GRU** (2014) is a simplified two-gate variant that trains faster. Stacking layers and reading the sequence in both directions (**bidirectional LSTM**) gave the best NLP results from roughly 2014 to 2018: Google Translate's 2016 neural system was an 8-layer LSTM encoder-decoder.
Three limits of recurrence motivated the transformer:
• **No parallelism within a sequence** — step t cannot start until step t−1 finishes, so GPUs, which want thousands of independent operations, sit idle. Training on web-scale text was impractical.
• **An information bottleneck** — in encoder-decoder translation, the entire source sentence must be squeezed into one fixed-size vector before decoding starts. Quality fell sharply for sentences over about 30 words.
• **Distance still matters** — even with gates, interaction between two tokens 500 positions apart passes through 500 updates. There is no direct path.
Attention (next section) was first invented as a patch for the bottleneck inside LSTM translation models; the transformer then asked whether attention alone could replace recurrence entirely. You still meet LSTMs in production for time series, on-device keyboards and small-data tasks, and \`nn.LSTM\` is one line in PyTorch, so the snippet shows a complete sentiment classifier to make the mechanics concrete.`,
      codeSnippet: `# lstm_classifier.py — a bidirectional LSTM text classifier in PyTorch
import torch, torch.nn as nn

class LSTMClassifier(nn.Module):
    def __init__(self, vocab_size, embed_dim=64, hidden=128, num_classes=2, pad_id=0):
        super().__init__()
        self.embed = nn.Embedding(vocab_size, embed_dim, padding_idx=pad_id)
        self.lstm = nn.LSTM(embed_dim, hidden, num_layers=1,
                            batch_first=True, bidirectional=True)
        self.head = nn.Linear(2 * hidden, num_classes)   # forward + backward final states

    def forward(self, token_ids):                        # token_ids: (batch, seq_len)
        x = self.embed(token_ids)                        # (batch, seq_len, embed_dim)
        outputs, (h_n, c_n) = self.lstm(x)               # outputs: (batch, seq_len, 2*hidden)
        # h_n: (num_layers * 2, batch, hidden) -> concatenate last forward & backward states
        final = torch.cat([h_n[-2], h_n[-1]], dim=1)     # (batch, 2*hidden)
        return self.head(final)                          # logits (batch, num_classes)

# toy vocabulary + two padded sentences (0 = <pad>)
vocab = ["<pad>", "food", "was", "great", "not", "cold", "and", "late", "service"]
w2i = {w: i for i, w in enumerate(vocab)}
def encode(sent, max_len=6):
    ids = [w2i[w] for w in sent.split()][:max_len]
    return ids + [0] * (max_len - len(ids))
batch = torch.tensor([encode("food was great and service"), encode("food was not great cold")])
labels = torch.tensor([1, 0])

model = LSTMClassifier(len(vocab))
opt = torch.optim.Adam(model.parameters(), lr=0.01)
loss_fn = nn.CrossEntropyLoss()
for step in range(60):
    logits = model(batch)
    loss = loss_fn(logits, labels)
    opt.zero_grad(); loss.backward(); opt.step()
print("loss:", round(loss.item(), 4))                       # -> close to 0 on this toy batch
print("pred:", model(batch).argmax(1).tolist())             # [1, 0]

# Why recurrence is slow: time steps are sequential, so this loop is what nn.LSTM runs internally:
#   for t in range(seq_len): h, c = cell(x[:, t], (h, c))    <- no parallelism across t`
    },
    {
      heading: "7. Attention: Letting the Model Look Where It Matters (Scaled Dot-Product Attention from Scratch)",
      content: `**Attention** was introduced by Bahdanau et al. in 2014 to fix the translation bottleneck: instead of compressing the source sentence into one vector, let the decoder, at every output step, compute a **weighted average of all encoder states**, with weights that depend on what it is currently trying to produce. Translating "bank" into Hindi, the decoder can put 80% of its weight on the source words "river" and "bank" and ignore the rest.
The general mechanism is a **soft dictionary lookup**. A normal Python dict matches a query to exactly one key and returns its value. Attention matches a **query vector q** against every **key vector k_i** with a dot product, converts those scores into weights with softmax (so they are positive and sum to 1), and returns the weighted sum of the **value vectors v_i**. Every key contributes a little; the most similar keys contribute most. Written for a whole batch of queries as matrices:
Attention(Q, K, V) = softmax(Q · Kᵀ / √d_k) · V
Why the division by √d_k? Dot products of d_k-dimensional random vectors have variance proportional to d_k. With d_k = 64, raw scores would have standard deviation 8, pushing softmax into a region where one weight is ~1 and the rest ~0, and gradients vanish. Scaling keeps the scores at unit variance so the softmax stays "soft" and trainable. This is the **scaled dot-product attention** of the transformer paper.
Reading the output: for each query you get a vector that is a mixture of values, and an **attention weight matrix** of shape (queries × keys) that you can visualize. In translation models these weights line up source and target words almost like a dictionary; in language models they show, for example, the token "it" attending to "the animal" rather than "the street".
Key properties:
• **Permutation-invariant** — attention has no idea about order; if you shuffle the keys and values together, the output is identical. Order must be injected separately (positional encoding, Section 9).
• **Constant path length** — any query reaches any key in one step, regardless of distance. This is what RNNs lacked.
• **Quadratic cost** — the score matrix is n × n for n tokens. 4,000 tokens means 16 million scores per head per layer; this is why context length is expensive and why FlashAttention, sliding windows and other tricks exist.
The NumPy snippet implements the formula in a dozen lines and prints the weights so you can see one query concentrating on the keys most similar to it.`,
      codeSnippet: `# attention_numpy.py — scaled dot-product attention, from scratch
import numpy as np
np.set_printoptions(precision=2, suppress=True)

def softmax(x, axis=-1):
    x = x - x.max(axis=axis, keepdims=True)           # numerical stability
    e = np.exp(x)
    return e / e.sum(axis=axis, keepdims=True)

def scaled_dot_product_attention(Q, K, V, mask=None):
    d_k = K.shape[-1]
    scores = Q @ K.T / np.sqrt(d_k)                   # (n_q, n_k) similarity of each query to each key
    if mask is not None:
        scores = np.where(mask, scores, -1e9)         # masked positions get ~0 weight after softmax
    weights = softmax(scores, axis=-1)                # each row sums to 1
    return weights @ V, weights                       # (n_q, d_v), (n_q, n_k)

# 4 tokens, each with a 4-d key and a 3-d value (normally learned projections of embeddings)
tokens = ["the", "delivery", "was", "late"]
K = np.array([[1, 0, 0, 0],      # the
              [0, 1, 0, 0],      # delivery
              [0, 0, 1, 0],      # was
              [0, 0.9, 0, 1]])   # late   <- shares a direction with "delivery"
V = np.array([[0.1, 0.0, 0.0],
              [0.0, 1.0, 0.0],
              [0.0, 0.0, 0.2],
              [0.0, 0.5, 0.9]])
Q = np.array([[0, 2, 0, 2]])     # a query asking "what is being described as late?"

out, w = scaled_dot_product_attention(Q, K, V)
for t, weight in zip(tokens, w[0]):
    print(f"{t:9s} weight={weight:.2f}")
# the       weight=0.09
# delivery  weight=0.25
# was       weight=0.09
# late      weight=0.57      <- query concentrates on 'late' and 'delivery'
print("output:", out[0])      # a blend of the values of 'late' and 'delivery'

# Without scaling the same scores become sharp (near one-hot) in higher dimensions:
d = 512
q = np.random.randn(1, d); k = np.random.randn(8, d)
print("raw score std:", (q @ k.T).std().round(1), "| scaled std:", ((q @ k.T) / np.sqrt(d)).std().round(2))
# raw score std: ~22.6  | scaled std: ~1.0`
    },
    {
      heading: "8. Self-Attention Intuition: Queries, Keys and Values Computed from the Same Sentence",
      content: `In the translation setting, queries came from the decoder and keys/values from the encoder. **Self-attention** asks a simpler question: what if every token in a sentence attends to every other token in the *same* sentence? Then each word's representation can be rewritten in terms of the words around it — which is exactly the contextual embedding we wanted in Section 5.
Here is the intuition with the sentence "The courier said the parcel was damaged because it was wet." The token "it" starts as a static embedding that could refer to anything. In self-attention, "it" emits a **query** ("I am a pronoun looking for a singular inanimate noun"), every token emits a **key** ("I am a noun / I am a verb / ...") and a **value** (the information it would pass on). The dot product of "it"'s query with "parcel"'s key is high, with "courier"'s key lower (animate), with "said"'s key very low. After softmax, "it" becomes roughly 0.7 × value(parcel) + 0.2 × value(courier) + small bits of the rest. The output for "it" now encodes "parcel" — context has been mixed in, in a single parallel matrix operation for all tokens at once.
Where do Q, K and V come from? From three learned weight matrices applied to the same input embeddings: Q = X·W_Q, K = X·W_K, V = X·W_V. Separating them matters: a token's *query* ("what am I looking for") and its *key* ("what do I offer to others") need not be the same. "Damaged" might look for its subject but advertise itself as a state. The three matrices are the only learnable parameters in an attention layer, and they are shared across positions, so the layer works for any sequence length.
Three facts to internalize:
• Self-attention is a **set operation**: every token sees every other token in one step; there is no left-to-right loop, which is why it parallelizes on GPUs.
• The output has the **same shape as the input** (n tokens × d_model), so layers can be stacked and each layer refines the contextual representation further. Lower layers tend to learn syntax (adjacent words, agreement); higher layers learn semantics and coreference.
• Nothing prevents a token from attending to itself — and it usually does partially, keeping its own identity in the mix.
Vaswani et al. (2017) made this the whole model, hence the paper title "Attention Is All You Need". The PyTorch snippet implements single-head self-attention with learned projections and shows it operating on a batch of token embeddings.`,
      codeSnippet: `# self_attention.py — single-head self-attention with learned Q/K/V projections (PyTorch)
import torch, torch.nn as nn, torch.nn.functional as F

class SelfAttention(nn.Module):
    def __init__(self, d_model, d_head):
        super().__init__()
        self.W_q = nn.Linear(d_model, d_head, bias=False)
        self.W_k = nn.Linear(d_model, d_head, bias=False)
        self.W_v = nn.Linear(d_model, d_head, bias=False)
        self.scale = d_head ** 0.5

    def forward(self, x, mask=None):              # x: (batch, seq_len, d_model)
        Q, K, V = self.W_q(x), self.W_k(x), self.W_v(x)
        scores = Q @ K.transpose(-2, -1) / self.scale   # (batch, seq_len, seq_len)
        if mask is not None:
            scores = scores.masked_fill(~mask, float("-inf"))
        weights = F.softmax(scores, dim=-1)              # rows sum to 1
        return weights @ V, weights                      # (batch, seq_len, d_head)

torch.manual_seed(0)
tokens = ["the", "parcel", "was", "damaged", "because", "it", "was", "wet"]
vocab = {w: i for i, w in enumerate(dict.fromkeys(tokens))}
embed = nn.Embedding(len(vocab), 16)
x = embed(torch.tensor([[vocab[w] for w in tokens]]))   # (1, 8, 16)

attn = SelfAttention(d_model=16, d_head=8)
out, w = attn(x)
print("input :", tuple(x.shape), "-> output:", tuple(out.shape))   # (1, 8, 16) -> (1, 8, 8)
print("attention weights of token 'it' over all tokens (untrained, so roughly uniform):")
for t, weight in zip(tokens, w[0, 5]):
    print(f"  {t:8s} {weight.item():.2f}")
print("row sums:", w[0].sum(-1).tolist())  # all 1.0

# With padding: mask out pad positions so no token attends to them
pad_mask = torch.tensor([[True] * 6 + [False] * 2])      # last two tokens are padding
key_mask = pad_mask.unsqueeze(1).expand(-1, 8, -1)       # (batch, q_len, k_len)
out_masked, w_masked = attn(x, key_mask)
print("weights on padded keys:", w_masked[0, 0, 6:].tolist())   # [0.0, 0.0]`
    },
    {
      heading: "9. Multi-Head Attention and Positional Encoding: Giving the Transformer Multiple Views and a Sense of Order",
      content: `A single attention head computes one weighted average per token, so it can express only one kind of relationship at a time. **Multi-head attention** runs h independent heads in parallel, each with its own W_Q, W_K, W_V, each working in a lower-dimensional subspace (d_head = d_model / h), and concatenates their outputs before a final linear projection W_O. In the original transformer, d_model = 512 and h = 8, so each head works in 64 dimensions. The compute is about the same as one full-width head, but the model can now attend to syntax with one head, coreference with another, and the previous token with a third. Interpretability studies of BERT found heads specializing in exactly such roles — one head links verbs to their objects, another links closing brackets to opening ones.
Now the problem flagged in Section 7: attention is permutation-invariant. Feed "Pune beats Mumbai" and "Mumbai beats Pune" to a pure self-attention layer and the per-token outputs are identical sets. The transformer fixes this by **adding a positional encoding** vector to each token embedding before the first layer, so the embedding for "Mumbai" at position 1 differs from "Mumbai" at position 3.
The original paper used fixed **sinusoidal positional encodings**: for position pos and dimension i, PE(pos, 2i) = sin(pos / 10000^(2i/d_model)) and PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model)). Each dimension oscillates at a different frequency — low dimensions change fast, high dimensions slowly — so the vector is unique per position, bounded in [−1, 1], and the encoding of position pos + k is a linear function of the encoding of pos, letting the model learn relative offsets. Because nothing is learned, the scheme in principle extends to lengths not seen in training.
Alternatives you will meet in model cards: **learned absolute positions** (BERT, GPT-2 — a trainable table of 512 or 1,024 vectors, which hard-limits context length), **relative position biases** (T5), **RoPE / rotary embeddings** (Llama, Mistral, Qwen — rotate Q and K by an angle proportional to position so the dot product depends only on relative distance; this is what makes long-context extension tricks possible) and **ALiBi** (adds a distance penalty directly to attention scores). The design choice matters for how well a model generalizes beyond its training context length — a question you will revisit in the LLM lectures.
The snippet builds sinusoidal encodings, shows that nearby positions have higher similarity than distant ones, and uses PyTorch's built-in \`nn.MultiheadAttention\`.`,
      codeSnippet: `# positional_multihead.py — sinusoidal positional encoding + nn.MultiheadAttention
import math, torch, torch.nn as nn

def sinusoidal_positional_encoding(max_len, d_model):
    pe = torch.zeros(max_len, d_model)
    position = torch.arange(max_len).unsqueeze(1).float()                     # (max_len, 1)
    div_term = torch.exp(torch.arange(0, d_model, 2).float() * (-math.log(10000.0) / d_model))
    pe[:, 0::2] = torch.sin(position * div_term)                               # even dims
    pe[:, 1::2] = torch.cos(position * div_term)                               # odd dims
    return pe                                                                   # (max_len, d_model)

pe = sinusoidal_positional_encoding(max_len=64, d_model=32)
print("PE shape:", tuple(pe.shape), "| value range:", pe.min().item(), "to", pe.max().item())
pe_n = nn.functional.normalize(pe, dim=1)
print("sim(pos 10, pos 11) =", round((pe_n[10] @ pe_n[11]).item(), 3))   # high  (~0.9)
print("sim(pos 10, pos 40) =", round((pe_n[10] @ pe_n[40]).item(), 3))   # lower (~0.4)

# Add position information to token embeddings (this is the transformer's input layer)
d_model, seq_len, batch = 32, 8, 2
embed = nn.Embedding(100, d_model)
token_ids = torch.randint(0, 100, (batch, seq_len))
x = embed(token_ids) * math.sqrt(d_model) + pe[:seq_len]   # paper scales embeddings by sqrt(d_model)

# Multi-head attention: 4 heads, each in a 32/4 = 8-dimensional subspace
mha = nn.MultiheadAttention(embed_dim=d_model, num_heads=4, batch_first=True)
out, weights = mha(x, x, x, average_attn_weights=False)    # query=key=value=x -> self-attention
print("output:", tuple(out.shape))                         # (2, 8, 32)
print("per-head attention weights:", tuple(weights.shape)) # (2, 4, 8, 8) = (batch, heads, q, k)
params = sum(p.numel() for p in mha.parameters())
print("MHA parameters:", params)   # 4 * 32*32 (+ biases) = 4224  -> W_Q, W_K, W_V, W_O`
    },
    {
      heading: "10. The Transformer Architecture: Encoder, Decoder, Residual Connections and Layer Normalization",
      content: `The 2017 transformer is an **encoder-decoder** model for sequence-to-sequence tasks such as translation. Both halves are stacks of identical blocks (6 each in the base model) built from the pieces you now know.
**The encoder block** takes a sequence of vectors (n × d_model) and returns a sequence of the same shape:
1. **Multi-head self-attention** — every token gathers context from all other tokens (no mask: the encoder sees the whole input).
2. **Add & Norm** — the attention output is added to the block's input (a **residual connection**) and passed through **layer normalization**.
3. **Position-wise feed-forward network** — a two-layer MLP applied to each position independently: FFN(x) = max(0, x·W₁ + b₁)·W₂ + b₂, expanding to d_ff = 2048 and back to 512. Researchers now think of these layers as the model's key-value memory of facts; they hold roughly two-thirds of the parameters.
4. **Add & Norm** again.
**Residual connections** are what let you stack 6, 12 or 96 blocks: each block only has to learn a *correction* to its input, and gradients flow straight through the addition during backpropagation. **Layer normalization** standardizes each token's vector to zero mean and unit variance (with learned scale and shift), which keeps activations in a trainable range regardless of depth. The original paper applied norm after the residual add (**post-LN**); nearly all modern LLMs use **pre-LN** (normalize before attention and FFN), which trains more stably at scale, and many use RMSNorm, a cheaper variant.
**The decoder block** has three sub-layers: **masked** multi-head self-attention over the output generated so far (the causal mask stops position t from seeing t+1 onward, so training can run on whole target sentences in parallel while still matching generation-time conditions), **cross-attention** where queries come from the decoder and keys/values from the final encoder output (this is the Bahdanau attention from Section 7), and the same feed-forward network, each with Add & Norm. A final linear layer plus softmax over the vocabulary turns the last decoder vector into a next-token probability distribution.
Putting it together for translation: the encoder reads the full English sentence once; the decoder then generates Hindi one token at a time, at each step attending to its own previous tokens and to the encoder states, until it emits an end-of-sequence token. Training uses **teacher forcing** — feed the correct previous tokens, score the predicted next token with cross-entropy — so the whole target sequence is learned in one forward pass.
The base model had about 65 million parameters and trained on 8 GPUs in 12 hours for state-of-the-art English-German translation, an order of magnitude cheaper than the LSTM systems it replaced. The snippet builds a full encoder block from scratch so you see every tensor shape, then shows the equivalent PyTorch built-in.`,
      codeSnippet: `# transformer_encoder.py — one transformer encoder block from scratch (pre-LN style)
import torch, torch.nn as nn

class TransformerEncoderBlock(nn.Module):
    def __init__(self, d_model=512, num_heads=8, d_ff=2048, dropout=0.1):
        super().__init__()
        self.attn = nn.MultiheadAttention(d_model, num_heads, dropout=dropout, batch_first=True)
        self.ffn = nn.Sequential(
            nn.Linear(d_model, d_ff),
            nn.ReLU(),                     # modern LLMs use GELU or SwiGLU here
            nn.Dropout(dropout),
            nn.Linear(d_ff, d_model),
        )
        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)
        self.drop = nn.Dropout(dropout)

    def forward(self, x, key_padding_mask=None):    # x: (batch, seq_len, d_model)
        h = self.norm1(x)                                              # pre-LN
        attn_out, _ = self.attn(h, h, h, key_padding_mask=key_padding_mask)
        x = x + self.drop(attn_out)                                    # residual connection 1
        x = x + self.drop(self.ffn(self.norm2(x)))                     # residual connection 2
        return x                                                       # same shape as input

class TinyEncoder(nn.Module):
    """Embeddings + positions + N blocks: the 'encoder' half of the transformer."""
    def __init__(self, vocab_size, d_model=128, num_heads=4, d_ff=512, num_layers=2, max_len=256):
        super().__init__()
        self.tok = nn.Embedding(vocab_size, d_model)
        self.pos = nn.Embedding(max_len, d_model)                      # learned positions (BERT-style)
        self.blocks = nn.ModuleList([TransformerEncoderBlock(d_model, num_heads, d_ff) for _ in range(num_layers)])
        self.final_norm = nn.LayerNorm(d_model)

    def forward(self, ids, pad_id=0):
        positions = torch.arange(ids.size(1), device=ids.device)
        x = self.tok(ids) + self.pos(positions)
        pad_mask = ids == pad_id                                       # True where padding
        for block in self.blocks:
            x = block(x, key_padding_mask=pad_mask)
        return self.final_norm(x)                                      # contextual embeddings

enc = TinyEncoder(vocab_size=1000)
ids = torch.randint(1, 1000, (2, 10)); ids[1, 7:] = 0                 # second sentence padded
out = enc(ids)
print("contextual embeddings:", tuple(out.shape))                      # (2, 10, 128)
print("parameters:", sum(p.numel() for p in enc.parameters()))         # ~0.6M

# The same thing with PyTorch's built-in layers:
layer = nn.TransformerEncoderLayer(d_model=128, nhead=4, dim_feedforward=512, batch_first=True, norm_first=True)
builtin = nn.TransformerEncoder(layer, num_layers=2)
print("built-in output:", tuple(builtin(torch.randn(2, 10, 128)).shape))   # (2, 10, 128)`
    },
    {
      heading: "11. Encoder vs Decoder Models: BERT-Style, GPT-Style and Encoder-Decoder Transformers",
      content: `After 2017 the field split the transformer into three families, and knowing which family a model belongs to tells you what it is good at, how it was pretrained and how you should use it.
**Encoder-only models (BERT family, 2018)** keep just the encoder stack. Every token attends to every other token in both directions, so the representation of "bank" is conditioned on words before *and* after it. BERT was pretrained with **masked language modelling**: hide 15% of tokens, predict them from both sides ("The [MASK] arrived late" → "parcel"). Because they see the whole input at once, encoders produce excellent **contextual embeddings** but cannot generate text naturally. Use them for classification, named-entity recognition, extractive question answering, semantic similarity and as the embedding model in RAG pipelines. BERT-base: 12 layers, 768 hidden, 12 heads, 110M parameters. Popular descendants: RoBERTa, DistilBERT (40% smaller, 60% faster, 97% of the quality), DeBERTa, and sentence-transformers models such as all-MiniLM-L6-v2 (384-dimensional sentence embeddings, 22M parameters), plus multilingual models like XLM-R and MuRIL that cover Hindi, Tamil and Bengali.
**Decoder-only models (GPT family, 2018 onward)** keep just the decoder — without cross-attention, since there is no encoder. They use a **causal mask** so each position sees only earlier positions, and are pretrained on the simplest possible objective: **predict the next token**. That objective turns out to teach grammar, facts, reasoning patterns and code because predicting well requires modelling all of them. Decoders are natural generators: feed a prompt, sample a token, append it, repeat. GPT-2 (124M to 1.5B parameters), GPT-3, Llama, Mistral, Gemma, Qwen, DeepSeek and Claude are decoder-style models. They can also classify (just ask), but their embeddings of a token only see leftward context, which is why dedicated encoder models still dominate embedding benchmarks per parameter.
**Encoder-decoder models (T5, BART, mT5, Whisper, NLLB)** keep both halves. The encoder reads the input bidirectionally; the decoder generates the output with cross-attention. They are the natural fit for input-to-output transformations: translation, summarization, speech-to-text and grammar correction. IndicTrans2 for Indian-language translation is an encoder-decoder model.
Practical rules of thumb:
• Need a label, a score or an embedding, and have a few thousand labelled examples? Fine-tune an encoder — cheaper, faster at inference, and usually more accurate than prompting a decoder of similar size.
• Need generated text, open-ended reasoning or a chat interface? Use a decoder, either via API or an open model.
• Need translation or summarization at scale with a small model? Consider an encoder-decoder.
The snippet makes the causal mask concrete and shows the two pretraining objectives side by side using real Hugging Face models.`,
      codeSnippet: `# encoder_vs_decoder.py — causal mask + the two pretraining objectives (pip install transformers torch)
import torch
from transformers import pipeline

# 1) The causal mask used by decoder-only (GPT-style) models
seq_len = 5
causal = torch.tril(torch.ones(seq_len, seq_len, dtype=torch.bool))
print(causal.int())
# tensor([[1, 0, 0, 0, 0],      position 0 sees only itself
#         [1, 1, 0, 0, 0],
#         [1, 1, 1, 0, 0],
#         [1, 1, 1, 1, 0],
#         [1, 1, 1, 1, 1]])     position 4 sees everything before it (never the future)
# Encoder (BERT-style) models use an all-ones mask: every token sees every token.

# 2) Encoder objective: masked language modelling (bidirectional context)
fill = pipeline("fill-mask", model="distilbert/distilroberta-base")
for r in fill("The parcel from Bengaluru arrived two days <mask>.", top_k=3):
    print(f"{r['token_str']!r:12s} score={r['score']:.3f}")
# ' late'  score=0.6..   ' early'  score=0.2..   ' ago'  score=0.0..    (ranking may vary)

# 3) Decoder objective: next-token prediction (left-to-right generation)
gen = pipeline("text-generation", model="openai-community/gpt2")
out = gen("The parcel from Bengaluru arrived two days", max_new_tokens=12, do_sample=False)
print(out[0]["generated_text"])
# The parcel from Bengaluru arrived two days later, and the ... (greedy decoding; exact text may vary by version)

# 4) Same text, three kinds of model (shapes tell the story)
from transformers import AutoTokenizer, AutoModel
for name in ["google-bert/bert-base-uncased", "openai-community/gpt2"]:
    tok = AutoTokenizer.from_pretrained(name); model = AutoModel.from_pretrained(name)
    with torch.no_grad():
        hidden = model(**tok("Attention is all you need", return_tensors="pt")).last_hidden_state
    print(f"{name:35s} contextual embeddings: {tuple(hidden.shape)}  params: {sum(p.numel() for p in model.parameters())/1e6:.0f}M")
# google-bert/bert-base-uncased        contextual embeddings: (1, 7, 768)  params: 109M
# openai-community/gpt2                contextual embeddings: (1, 5, 768)  params: 124M`
    },
    {
      heading: "12. Hugging Face Transformers Pipelines: Using Pretrained Models in Five Lines and What Happens Under the Hood",
      content: `**Hugging Face** is the GitHub of models: the Hub hosts over a million pretrained checkpoints, and the \`transformers\` library gives every one of them the same Python interface. Install with \`pip install transformers torch\` (add \`sentencepiece\` for some tokenizers and \`accelerate\` for multi-GPU loading).
The highest-level API is \`pipeline(task, model=...)\`. A pipeline bundles three things you would otherwise wire by hand:
1. A **tokenizer** that matches the checkpoint exactly (same vocabulary, same special tokens such as [CLS]/[SEP] for BERT or <|endoftext|> for GPT-2, same truncation rules).
2. The **model** with a task-specific head (a classification layer on top of the encoder, or the language-modelling head on a decoder), weights downloaded once and cached in \`~/.cache/huggingface\`.
3. **Post-processing** that converts raw logits into human-readable output — softmax probabilities and label names for classification, span merging for NER, decoding token IDs back to text for generation.
Common tasks and typical models: \`sentiment-analysis\` (DistilBERT fine-tuned on SST-2), \`zero-shot-classification\` (BART-MNLI — classify into labels you invent at runtime, no training), \`ner\` (BERT fine-tuned on CoNLL-03), \`question-answering\` (extractive, RoBERTa on SQuAD), \`summarization\` (BART / T5), \`translation\` (Helsinki-NLP opus-mt or NLLB), \`fill-mask\`, \`text-generation\`, \`feature-extraction\` (raw embeddings), plus speech and vision tasks. Always pass \`model=\` explicitly in production: pipeline defaults can change between library versions, and your evaluation must be tied to a specific checkpoint (ideally pinned with \`revision=\`).
Going one level down with \`AutoTokenizer\` and \`AutoModel\` is essential when you need embeddings for search. A sentence embedding is produced by running the encoder and **pooling** the token vectors — usually a mean over non-padding tokens for sentence-transformers models, or the [CLS] vector for original BERT. The \`sentence-transformers\` library wraps this with \`SentenceTransformer("all-MiniLM-L6-v2").encode(texts)\`, but understanding the mean-pooling code below means you can debug why two "similar" sentences score 0.3 instead of 0.8 (hint: usually the wrong pooling or forgetting to normalize).
Performance basics: batch your inputs (lists, not loops), set \`device=0\` for GPU or \`device="mps"\` on Apple Silicon, use \`torch_dtype=torch.float16\` or bfloat16 on GPU to halve memory, and set \`truncation=True, max_length=512\` for encoders or you will get an index error on long inputs. For serving at scale look at Text Embeddings Inference, ONNX Runtime, or vLLM for decoders — later lectures cover deployment.`,
      codeSnippet: `# hf_pipelines.py — pretrained models in a few lines, then the manual tokenizer -> model -> pooling path
import torch
from transformers import pipeline, AutoTokenizer, AutoModel

# 1) Sentiment: DistilBERT fine-tuned on SST-2 (pin the model explicitly)
clf = pipeline("sentiment-analysis", model="distilbert/distilbert-base-uncased-finetuned-sst-2-english")
print(clf(["Delivery to Jaipur was quick and the packaging was neat.",
           "Three calls to support and still no refund."]))
# [{'label': 'POSITIVE', 'score': 0.9998}, {'label': 'NEGATIVE', 'score': 0.9995}]

# 2) Zero-shot classification: labels invented at runtime, no training data
zs = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
print(zs("My UPI payment failed but money was deducted from my account",
         candidate_labels=["payment issue", "delivery delay", "product quality", "account access"]))
# {'labels': ['payment issue', 'account access', ...], 'scores': [0.9.., 0.0.., ...]}

# 3) Named-entity recognition with grouped spans
ner = pipeline("ner", model="dslim/bert-base-NER", aggregation_strategy="simple")
print(ner("Priya Sharma from Infosys will visit the Hyderabad office on Monday."))
# [{'entity_group': 'PER', 'word': 'Priya Sharma', ...}, {'entity_group': 'ORG', 'word': 'Infosys', ...},
#  {'entity_group': 'LOC', 'word': 'Hyderabad', ...}]

# 4) Under the hood: tokenizer -> model -> mean pooling = sentence embeddings for semantic search
name = "sentence-transformers/all-MiniLM-L6-v2"           # 6-layer encoder, 384-d output, ~22M params
tok = AutoTokenizer.from_pretrained(name)
model = AutoModel.from_pretrained(name).eval()

def embed(texts):
    batch = tok(texts, padding=True, truncation=True, max_length=256, return_tensors="pt")
    with torch.no_grad():
        hidden = model(**batch).last_hidden_state                     # (B, T, 384)
    mask = batch["attention_mask"].unsqueeze(-1).float()               # ignore padding in the mean
    pooled = (hidden * mask).sum(1) / mask.sum(1)                      # (B, 384)
    return torch.nn.functional.normalize(pooled, dim=1)                # unit length -> cosine = dot

sentences = ["How do I reset my UPI PIN?", "Steps to change the PIN for UPI payments",
             "Best biryani places in Hyderabad"]
E = embed(sentences)
print("embedding shape:", tuple(E.shape))                              # (3, 384)
sims = E @ E.T
print(f"sim(q0, q1) = {sims[0, 1]:.2f}   sim(q0, q2) = {sims[0, 2]:.2f}")   # ~0.8 vs ~0.1
print("tokens seen by the model:", tok.convert_ids_to_tokens(tok(sentences[0])["input_ids"]))
# ['[CLS]', 'how', 'do', 'i', 'reset', 'my', 'up', '##i', 'pin', '?', '[SEP]']   (WordPiece splits the rare word 'UPI')`
    },
    {
      heading: "13. Real-World Use Cases: How NLP, Embeddings and Transformers Are Used in Production",
      content: `**Semantic search and RAG for support and documentation.** A fintech in Bengaluru indexes 40,000 help-centre articles and past tickets by embedding each chunk with a sentence-transformer (or a hosted embedding API) and storing the vectors in pgvector or Qdrant. A user query "money gone but transaction shows failed" retrieves the UPI reversal article even though no word overlaps, because the embeddings are close. The retrieved chunks are then placed in an LLM prompt — the retrieval-augmented generation pattern you will build in a later lecture. Teams usually run **hybrid search**: BM25 (TF-IDF's descendant) for exact codes and names plus dense vectors for paraphrases, merged with reciprocal rank fusion.
**Ticket and review classification at scale.** An e-commerce marketplace receives 200,000 reviews a day. A DistilBERT or XLM-R model fine-tuned on 20,000 labelled examples tags each review with sentiment and issue type (delivery, quality, counterfeit, sizing) in under 5 ms per review on a single GPU, at a fraction of the cost of calling a generative model per review. The TF-IDF + logistic regression baseline is still kept in the repository: it trains in seconds, explains itself, and catches regressions when the deep model drifts.
**Named-entity extraction from documents.** Lending companies extract names, PAN numbers, addresses and amounts from KYC forms and bank statements using an encoder model fine-tuned for token classification (often LayoutLM-style models that add page-layout features). Character-level tokenization robustness matters because OCR output is noisy.
**Machine translation and transliteration for Indian languages.** Encoder-decoder models such as IndicTrans2 and NLLB serve translation between English and 20+ Indian languages inside apps, customer chat and government portals. Byte-level or SentencePiece tokenizers are what make Devanagari, Tamil and Bengali scripts workable with a single vocabulary.
**Deduplication, clustering and recommendation.** News aggregators embed headlines to cluster the same story across outlets; job portals match CV embeddings against job-description embeddings; marketplaces detect duplicate listings. All of these are cosine similarity over embeddings, often with approximate nearest-neighbour indexes (HNSW, FAISS) to search millions of vectors in milliseconds.
**Pre-filtering and guardrails around LLMs.** Before an expensive generative call, a small encoder classifier routes the query (billing vs technical), detects prompt-injection patterns or personal data, and after the call checks the answer's toxicity. Small transformers wrapping big ones is a standard production architecture.
**Speech and multimodal pipelines.** Whisper (an encoder-decoder transformer) converts call-centre audio to text; the same embedding and classification stack then runs on the transcripts. Vision transformers apply the identical self-attention machinery to image patches, which is why the concepts in this lecture transfer directly to multimodal models.`
    },
    {
      heading: "14. Common Mistakes with Tokenization, Embeddings and Transformer Models — and How to Fix Them",
      content: `**Mistake 1: Using a different tokenizer than the model was trained with.** Loading \`bert-base-cased\` weights with the uncased tokenizer, or feeding a GPT-2 model BERT token IDs, produces garbage without any error. Fix: always load both from the same checkpoint name with \`AutoTokenizer\` and \`AutoModel\`, and pin the revision.
**Mistake 2: Over-preprocessing input to transformers.** Lowercasing, stop-word removal and stemming were good habits for TF-IDF and are harmful for pretrained transformers, whose tokenizers expect natural text. Fix: for transformers, only strip HTML and boilerplate, normalize Unicode and fix encoding; leave case, punctuation and emojis alone.
**Mistake 3: Silently truncating long documents.** Most encoders accept 512 tokens; the pipeline may truncate or crash. A 3,000-word contract loses 80% of its content and the model confidently classifies the first page. Fix: chunk documents with overlap, embed or classify each chunk, and aggregate (mean of embeddings, max of risk scores); or choose a long-context model.
**Mistake 4: Wrong pooling or no normalization for embeddings.** Taking the [CLS] vector from a sentence-transformers model, or averaging over padding tokens, produces embeddings whose similarities are meaningless. Fix: use the pooling the model card specifies (mean pooling with the attention mask for most sentence-transformers), L2-normalize, and sanity-check with a few known similar and dissimilar pairs.
**Mistake 5: Comparing embeddings from different models.** Vectors from all-MiniLM and from a hosted embedding API live in unrelated spaces; cosine similarity between them is noise. Fix: embed queries and documents with the same model and version, and re-embed the whole corpus when you upgrade the model.
**Mistake 6: Forgetting the attention mask and padding behaviour.** Padding a batch to equal length without passing \`attention_mask\` lets real tokens attend to [PAD], changing results depending on batch composition. Fix: always pass the mask the tokenizer returns; use \`padding=True\` and left-padding for decoder-only generation.
**Mistake 7: Measuring context and cost in words.** Budgeting prompts by word count underestimates tokens by 30% for English and by 3 to 5 times for Hindi or code. Fix: count tokens with the model's own tokenizer before sending, and design for the worst-case language in your user base.
**Mistake 8: Expecting a single attention head or a fixed embedding to resolve ambiguity.** Static Word2Vec vectors cannot separate "bank" the institution from "bank" the river; if your task depends on word sense, use contextual embeddings from a transformer. Conversely, do not fine-tune a 110M-parameter BERT on 200 labelled rows and expect it to beat TF-IDF; small data favours simple models or zero-shot approaches.
**Mistake 9: Running inference in training mode or without \`torch.no_grad()\`.** Dropout stays active (random outputs) and autograd stores activations (memory blow-up). Fix: call \`model.eval()\` and wrap inference in \`torch.no_grad()\` or \`torch.inference_mode()\`.
**Mistake 10: Trusting pipeline defaults in production.** Default models change across \`transformers\` versions, and the first call downloads hundreds of megabytes at request time. Fix: specify \`model=\` and \`revision=\`, pre-download weights in your Docker build, and load the pipeline once at startup, not per request.`
    },
    {
      heading: "15. Frequently Asked Questions about Tokenization, Embeddings, Attention and Transformers",
      content: `**What is the difference between tokenization and embedding?**
Tokenization converts a string into a sequence of integer IDs from a fixed vocabulary (for example "unhappiness" → ["un", "happiness"] → [4895, 12287]); it is a deterministic lookup with no learning involved. Embedding maps each ID to a dense vector of real numbers that is learned during training so that related tokens have similar vectors. Tokenization decides *what the units are*; embedding decides *what each unit means* to the model.
**What is byte-pair encoding (BPE) and why do LLMs use it?**
BPE builds a vocabulary by repeatedly merging the most frequent adjacent symbol pair, starting from characters or bytes. The result keeps common words whole while splitting rare words into reusable pieces, with no out-of-vocabulary tokens. LLMs use it because it gives a compact vocabulary (30k to 200k entries), short sequences for common text, and the ability to represent any string including code, emojis and new names.
**What is the difference between TF-IDF and word embeddings?**
TF-IDF produces sparse, high-dimensional vectors where each dimension is a specific word weighted by rarity; it captures exact word overlap and is fully interpretable but knows nothing about synonyms. Word embeddings are dense, low-dimensional learned vectors where similar meanings are nearby, so "affordable" and "cheap" match even with zero shared words. Production search systems often combine both as hybrid search.
**Why did transformers replace RNNs and LSTMs?**
Transformers process all tokens in parallel instead of one step at a time, so they train far faster on GPUs and scale to web-sized corpora. Self-attention gives every token a direct path to every other token, avoiding the vanishing-gradient and fixed-size-bottleneck problems that limited LSTMs on long inputs. The combination of parallelism and scale is what made pretraining on billions of tokens, and therefore modern LLMs, practical.
**What is self-attention in simple terms?**
Each word asks a question (its query) and every word in the sentence, including itself, offers an answer (its key and value). Words whose keys match the query strongly get high weight, and the word's new representation is the weighted mix of their values. For "it was wet", the pronoun "it" ends up mostly made of the vector for "parcel", so the model has resolved the reference in one parallel step.
**Why does the transformer need positional encoding?**
Attention is a weighted average over a set, so without extra information "Pune beats Mumbai" and "Mumbai beats Pune" would produce identical token representations. Positional encodings add a position-dependent vector to each token embedding (sinusoidal in the original paper, learned tables in BERT and GPT-2, rotary embeddings in Llama) so the model can tell order and relative distance apart.
**What is the difference between BERT and GPT?**
BERT is an encoder-only model that reads text bidirectionally and was pretrained to fill in masked words; it excels at understanding tasks such as classification, NER and producing embeddings but does not generate text. GPT is a decoder-only model with a causal mask, pretrained to predict the next token; it is built for generation and chat. Choose BERT-style models for labelling and search at low cost, GPT-style models for generation and reasoning.
**What does a Hugging Face pipeline do under the hood?**
It loads the tokenizer and model that match a checkpoint, converts your text to padded and masked token IDs, runs a forward pass, and post-processes the logits into labels, spans or decoded text. You can reproduce each step with AutoTokenizer and AutoModel, which you need to do for custom pooling, batching or exporting to ONNX.`
    },
    {
      heading: "16. Interview Questions and Answers on NLP, Embeddings and the Transformer Architecture",
      content: `**Q1. Explain scaled dot-product attention and why the scores are divided by √d_k.**
Attention computes softmax(Q·Kᵀ / √d_k)·V: each query is compared with all keys by dot product, the scores are turned into weights that sum to 1, and the output is the weighted sum of values. Dot products of d_k-dimensional vectors have variance that grows with d_k, so for d_k = 64 the raw scores would be large, saturating the softmax into near one-hot weights with tiny gradients. Dividing by √d_k keeps score variance near 1 and training stable.
**Q2. What are queries, keys and values, and why are they separate projections?**
They are three linear projections of the same input: the query represents what a token is looking for, the key what it offers for matching, and the value the information it passes on when selected. Keeping them separate lets a token search for one thing (a verb looking for its subject) while advertising itself as something else, and lets the content returned differ from the matching signal. With a single shared projection the attention matrix would be symmetric and much less expressive.
**Q3. Why is multi-head attention better than one wide head with the same compute?**
Each head learns its own Q/K/V projections in a lower-dimensional subspace, so different heads can capture different relations simultaneously — syntax, coreference, positional neighbours — and their outputs are concatenated and mixed by W_O. A single head produces one weighted average per token and can only express one relation at a time. Empirically, multiple heads improve quality at equal cost, though many heads can be pruned after training.
**Q4. What is the computational complexity of self-attention and what does it imply?**
For n tokens and model width d, the score matrix costs O(n²·d) time and O(n²) memory per head and layer, versus O(n·d²) for the feed-forward layers. Doubling the context length quadruples attention cost, which is why long contexts are expensive and why FlashAttention (IO-aware exact attention), sliding-window attention, grouped-query attention and KV caching exist. Interviewers expect you to mention that generation also caches keys and values so each new token costs O(n) rather than recomputing.
**Q5. Compare encoder-only, decoder-only and encoder-decoder transformers.**
Encoder-only (BERT) uses bidirectional attention and masked-language-model pretraining; best for classification, NER and embeddings. Decoder-only (GPT, Llama) uses causal attention and next-token prediction; best for generation and in-context learning, and is the architecture behind modern LLMs. Encoder-decoder (T5, BART, Whisper) encodes input bidirectionally and decodes with cross-attention; best for translation, summarization and speech-to-text.
**Q6. What is the purpose of residual connections and layer normalization in a transformer?**
Residual connections add each sub-layer's input to its output, so deep stacks learn incremental corrections and gradients flow directly through the additions, preventing degradation with depth. Layer normalization standardizes each token's activation vector, keeping scales consistent across layers. Pre-LN (normalizing before each sub-layer) is used in most modern LLMs because it trains stably without careful warm-up; the original paper used post-LN.
**Q7. How does BPE handle a word it has never seen, and what is the practical consequence?**
BPE applies its learned merge rules greedily to the characters or bytes of the new word, so it is represented as a sequence of known subword pieces, falling back to single bytes if necessary — there is never an unknown token. The consequence is that rare words, non-English scripts and random strings consume many more tokens, which raises cost, shortens effective context and can hurt quality for under-represented languages.
**Q8. What is the difference between static and contextual word embeddings?**
Static embeddings (Word2Vec, GloVe, fastText) assign one fixed vector per word type, so polysemous words get an averaged, blurry vector. Contextual embeddings (from ELMo, BERT, GPT) are produced by running the full sentence through the model, so the same word gets a different vector in each context. Contextual embeddings dominate for understanding tasks; static ones remain useful for fast lookups and interpretability.
**Q9. How would you build a sentence embedding from a BERT-style model, and how would you evaluate it?**
Run the encoder, then pool the token vectors — mean pooling over non-padding tokens (as sentence-transformers do) or the [CLS] vector if the model was trained that way — and L2-normalize. Plain BERT without fine-tuning gives poor sentence similarity; models trained with contrastive objectives on sentence pairs work far better. Evaluate on semantic textual similarity benchmarks or your own retrieval set with recall@k and MRR, and always compare against a BM25 baseline.
**Q10. When would you still choose TF-IDF with logistic regression over a fine-tuned transformer?**
When data is small and keyword-driven, when latency or cost constraints rule out a GPU, when interpretability is a regulatory requirement, or as the mandatory baseline before any deep model. TF-IDF trains in seconds, serves in microseconds on CPU, and in many short-text classification tasks lands within a few points of a transformer; if it does not, that gap justifies the transformer's cost.`
    },
    {
      heading: "17. Hands-On Exercise: Build a Semantic Search Engine with Sentiment Tagging Using Hugging Face Transformers",
      content: `You will build a small but complete NLP service of the kind that sits behind customer-support tools: a knowledge base of support articles, a **semantic search** function that finds the right article for a natural-language question even without keyword overlap, a **sparse TF-IDF baseline** to compare against, and a **sentiment tagger** that flags angry queries for priority routing. Everything runs on CPU in under a minute after the models download (about 350 MB total).
Setup: \`pip install transformers torch scikit-learn numpy\` (Python 3.10+). The first run downloads two checkpoints into the Hugging Face cache.
What to look for in the output:
1. The dense model finds "transaction failed but amount deducted" for the query "money gone, payment shows failed", while TF-IDF ranks it low because no words overlap — this is the embeddings advantage.
2. For the query containing the exact code "ERR-402", TF-IDF wins because it matches the literal token — this is why production systems use hybrid search; the final function combines both with a simple weighted score.
3. Sentiment scores sort queries so the angry one ("third time", "useless") goes to the top of the queue.
Extensions to try: swap in a multilingual embedding model (for example \`intfloat/multilingual-e5-small\`) and add Hindi or Hinglish queries; store the vectors in pgvector and query from a Next.js route handler; add the \`ner\` pipeline to extract order numbers; replace the heuristic hybrid weight with reciprocal rank fusion; and measure recall@3 on a labelled set of 30 queries so your choice of model is data-driven, not vibe-driven.`,
      codeSnippet: `# semantic_support_search.py — hybrid semantic + TF-IDF search with sentiment routing
# pip install transformers torch scikit-learn numpy
import numpy as np, torch
from transformers import AutoTokenizer, AutoModel, pipeline
from sklearn.feature_extraction.text import TfidfVectorizer

ARTICLES = [
    ("UPI transaction failed but amount was deducted",
     "If the payment shows failed but money left your account, the bank auto-reverses within 3-5 working days."),
    ("How to reset your UPI PIN", "Open the app, go to Bank Accounts, choose Reset UPI PIN and enter your debit card details."),
    ("Order delivered late or not delivered", "Track the order; if it is more than 2 days past the promised date, raise a delivery complaint."),
    ("Refund status and timelines", "Refunds are issued to the original payment method within 7 working days of pickup."),
    ("Error ERR-402 while adding a card", "ERR-402 means the card issuer declined tokenisation. Retry after enabling online transactions."),
    ("Change delivery address after ordering", "Addresses can be changed until the order is packed, from the Orders page."),
    ("Cancel a subscription plan", "Go to Subscriptions, pick the plan and tap Cancel; benefits continue until the billing date."),
    ("Wrong item received", "Request a replacement from the order page within 48 hours; pickup is free."),
]
titles = [t for t, _ in ARTICLES]
docs = [f"{t}. {b}" for t, b in ARTICLES]

# ---- dense embeddings (encoder transformer + mean pooling) ----
EMB = "sentence-transformers/all-MiniLM-L6-v2"
tok = AutoTokenizer.from_pretrained(EMB)
enc = AutoModel.from_pretrained(EMB).eval()

def embed(texts):
    batch = tok(texts, padding=True, truncation=True, max_length=256, return_tensors="pt")
    with torch.no_grad():
        hidden = enc(**batch).last_hidden_state
    mask = batch["attention_mask"].unsqueeze(-1).float()
    pooled = (hidden * mask).sum(1) / mask.sum(1)
    return torch.nn.functional.normalize(pooled, dim=1).numpy()

doc_vecs = embed(docs)                                     # (8, 384) — the "vector database"

# ---- sparse baseline (TF-IDF, word + bigram) ----
tfidf = TfidfVectorizer(ngram_range=(1, 2), sublinear_tf=True).fit(docs)
doc_tfidf = tfidf.transform(docs)                          # rows are L2-normalised -> cosine = dot

def dense_scores(query):  return doc_vecs @ embed([query])[0]
def sparse_scores(query): return (doc_tfidf @ tfidf.transform([query]).T).toarray().ravel()

def search(query, k=3, alpha=0.7):
    d, s = dense_scores(query), sparse_scores(query)
    hybrid = alpha * d + (1 - alpha) * s                   # simple weighted fusion
    for name, scores in [("dense", d), ("tfidf", s), ("hybrid", hybrid)]:
        top = np.argsort(-scores)[:k]
        print(f"  {name:6s}: " + " | ".join(f"{titles[i][:34]} ({scores[i]:.2f})" for i in top))
    return [titles[i] for i in np.argsort(-hybrid)[:k]]

# ---- sentiment tagger for priority routing ----
sentiment = pipeline("sentiment-analysis", model="distilbert/distilbert-base-uncased-finetuned-sst-2-english")

queries = [
    "money gone from my account but the app says payment failed",
    "getting ERR-402 when I try to save my card",
    "this is the third time my parcel is late, useless service",
    "can I update the flat number on an order I just placed?",
]
results = []
for q in queries:
    print(f"\\nQuery: {q}")
    best = search(q)
    s = sentiment(q)[0]
    anger = s["score"] if s["label"] == "NEGATIVE" else 1 - s["score"]
    results.append((anger, q, best[0]))

print("\\n=== Support queue (most negative first) ===")
for anger, q, article in sorted(results, reverse=True):
    print(f"anger={anger:.2f}  ->  '{article}'  <-  {q[:50]}")

# Expected (scores vary slightly by version):
#   dense ranks 'UPI transaction failed but amount was deducted' first for query 1 (no keyword overlap),
#   tfidf ranks 'Error ERR-402 while adding a card' first for query 2 (exact code match),
#   hybrid gets both right, and the 'third time ... useless' query tops the queue with anger ~0.99.`
    },
    {
      heading: "18. Summary",
      content: `• **Preprocessing** depends on the model: aggressive cleaning (lowercase, stop words, stemming or lemmatization) for bag-of-words pipelines; almost none for transformers, whose tokenizers expect natural text.
• **Tokenization** turns text into integer IDs. Word-level tokenizers suffer from out-of-vocabulary words, character-level ones produce long sequences; **subword tokenizers** (BPE, WordPiece, SentencePiece) are the compromise every modern LLM uses, and they explain token-based pricing, context limits and why Hindi costs more tokens than English.
• **Bag-of-words and TF-IDF** build sparse vectors from word counts weighted by rarity; they are fast, interpretable, and still the backbone of BM25 search and strong classification baselines, but they know nothing about synonyms or word order.
• **Word embeddings** (Word2Vec, GloVe, fastText) are dense vectors learned from context so that meaning becomes geometry; cosine similarity over embeddings powers vector databases and RAG. Static embeddings give one vector per word; transformers give **contextual** ones.
• **RNNs and LSTMs** read sequences step by step with gated memory, but cannot parallelize and still struggle with long-range dependencies.
• **Attention** is a soft dictionary lookup: softmax(Q·Kᵀ / √d_k)·V. **Self-attention** lets every token rewrite itself in terms of every other token in one parallel step; **multi-head attention** runs several such views at once; **positional encodings** restore word order.
• The **transformer** stacks self-attention and position-wise feed-forward layers with residual connections and layer normalization. The encoder reads bidirectionally; the decoder generates with a causal mask and cross-attention.
• **Encoder-only (BERT)** models excel at understanding, classification and embeddings; **decoder-only (GPT-style)** models generate text and are the architecture of modern LLMs; **encoder-decoder (T5, Whisper)** models transform input sequences into output sequences.
• **Hugging Face transformers** gives a uniform interface: \`pipeline()\` for quick wins, \`AutoTokenizer\` + \`AutoModel\` for control over pooling, batching and embeddings. Pin models, pass attention masks, chunk long inputs and use \`torch.no_grad()\` in inference.
**Next lecture:** How Large Language Models Work — scaling decoder-only transformers to billions of parameters, pretraining on web-scale data, instruction tuning and RLHF, sampling strategies, context windows, and what actually happens when you send a prompt to an LLM API.`
    }
  ]
};
