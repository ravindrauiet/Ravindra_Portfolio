export const lecture07 = {
  slug: "lecture-7",
  number: 7,
  title: "Complete AI & LLM Engineering Course — Lecture 7: How Large Language Models Work",
  summary: "Understand how large language models work: next-token prediction, pretraining, tokens and context windows, temperature, top-k and top-p sampling, instruction tuning, RLHF, hallucination, knowledge cutoff, extended thinking, open-weight vs API models, and when to fine-tune, prompt or use RAG.",
  readTime: "50 min read",
  difficulty: "Intermediate",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. Introduction: What a Large Language Model Really Is and Why Engineers Must Understand It",
      content: `In Lecture 6 you built the Transformer piece by piece: embeddings, self-attention, feed-forward blocks. A **large language model (LLM)** is simply a very large decoder-only Transformer that has been trained to do one job extremely well: given a sequence of tokens, predict the next one. Everything you see a chatbot do, from writing SQL and summarising a 200-page contract to planning a multi-step agent task, is built on that single mechanism, plus a few layers of training that turn a raw text predictor into a helpful assistant.
Why does an engineer who mostly calls an API need to know this? Because the internals explain the behaviour you will debug every week:
• Why a model confidently invents a library function that does not exist (hallucination).
• Why the same prompt gives different answers on two runs (sampling).
• Why a 40,000-word PDF "does not fit" (tokens and context windows).
• Why the model knows nothing about last month's release of your framework (knowledge cutoff).
• Why asking the model to "think step by step" improves maths answers (reasoning and extended thinking).
• Whether your startup in Pune should fine-tune an open-weight model, prompt an API model, or build a retrieval pipeline (fine-tuning vs prompting vs RAG).
This lecture is deliberately conceptual: no derivations, but precise mental models with runnable code. By the end you will be able to read a model card, explain a temperature setting to a product manager, and choose the right customisation strategy for a real project. The next lecture, Prompt Engineering for Developers, turns these models into day-to-day techniques.`
    },
    {
      heading: "2. Next-Token Prediction: The Single Trick Behind Every LLM",
      content: `An LLM is a function. Input: a list of token IDs. Output: a probability for every token in the vocabulary, describing how likely each one is to come next. That is all. Text generation is just this function run in a loop (autoregressive decoding):
1. Feed in the prompt tokens, for example "The capital of Maharashtra is".
2. The model outputs a distribution over the vocabulary: "Mumbai" 0.91, "Pune" 0.04, "Nagpur" 0.02, "the" 0.01, and tiny values for the other 100,000+ tokens.
3. Pick one token (greedily or by sampling, see section 5), append it to the sequence.
4. Repeat until the model emits a special end-of-sequence token or you hit a length limit.
There is no database lookup, no symbolic reasoning engine, and no notion of "truth" inside the loop. The model has compressed the statistical structure of trillions of words into its weights, and the distribution it outputs reflects which continuation was most common in similar contexts during training. "Mumbai" wins not because the model knows geography, but because, in the texts it saw, that pattern overwhelmingly completed this way. Remarkably, predicting the next token well enough forces the model to learn grammar, facts, code syntax, and even approximate reasoning, because all of those make the prediction more accurate.
The snippet below is the smallest possible "language model": a bigram table that counts which word followed which in a tiny corpus and converts counts to probabilities. Real LLMs replace the count table with a neural network that generalises to contexts it has never seen, but the interface (context in, next-token distribution out) is identical.`,
      codeSnippet: `# bigram_lm.py — the simplest possible next-token predictor
from collections import Counter, defaultdict

corpus = """the capital of maharashtra is mumbai . the capital of karnataka is bengaluru .
the capital of tamil nadu is chennai . mumbai is a coastal city . bengaluru is a tech hub ."""

tokens = corpus.split()
following = defaultdict(Counter)          # word -> Counter of next words
for prev, nxt in zip(tokens, tokens[1:]):
    following[prev][nxt] += 1

def next_token_distribution(word):
    counts = following[word]
    total = sum(counts.values())
    return {w: round(c / total, 2) for w, c in counts.most_common()}

print(next_token_distribution("is"))
# {'mumbai': 0.2, 'bengaluru': 0.2, 'chennai': 0.2, 'a': 0.4}

print(next_token_distribution("capital"))
# {'of': 1.0}

# Autoregressive generation = pick the most likely next word in a loop
word, out = "the", ["the"]
for _ in range(6):
    word = following[word].most_common(1)[0][0]
    out.append(word)
print(" ".join(out))
# the capital of maharashtra is mumbai .`
    },
    {
      heading: "3. Pretraining on Large Corpora: How an LLM Learns Language",
      content: `**Pretraining** is the phase where the model learns almost everything it knows. The recipe is conceptually simple and brutally expensive:
• **Data:** trillions of tokens of text scraped from the web, books, code repositories, scientific papers and licensed datasets, then heavily filtered and de-duplicated. Public reports describe modern open-weight models being trained on 15 trillion tokens or more.
• **Objective:** at every position in every document, predict the next token. The loss is **cross-entropy**: minus the log-probability the model assigned to the token that actually came next. If the model gave the correct token probability 0.59, the loss at that position is about 0.53; if it gave it 0.01, the loss is 4.6. Averaged over billions of positions, this one number drives all learning.
• **Optimisation:** backpropagation and an optimiser such as AdamW update billions of weights, thousands of GPUs run for weeks or months, and the training cost runs into crores of rupees for frontier models.
The output of pretraining is a **base model**. It is a brilliant autocomplete, not an assistant: ask it "What is the capital of Karnataka?" and it may continue with "What is the capital of Kerala? What is the capital of ..." because quiz-style lists are common on the web. Turning it into a chat model is the job of section 6.
Two practical ideas from pretraining research matter to engineers. **Scaling laws** (Kaplan et al., 2020; Hoffmann et al., 2022, the "Chinchilla" paper) showed that loss falls predictably as you increase parameters, data and compute together, and that many early models were under-trained on data relative to their size. **Data quality** matters as much as quantity: filtering, de-duplication and the ratio of code to prose visibly change downstream behaviour. When a model card says "trained on 15T tokens with a 128K vocabulary", you now know exactly what each number means.`,
      codeSnippet: `# pretraining_objective.py — the loss that trains every LLM, on one position
import torch
import torch.nn.functional as F

# Suppose the vocabulary has 8 tokens and the model, after reading
# "the capital of maharashtra is", outputs these raw scores (logits):
logits = torch.tensor([[2.0, 0.5, 0.1, 3.0, 0.0, -1.0, 0.2, 0.3]])
vocab  = ["the", "pune", "nagpur", "mumbai", "a", ".", "of", "is"]

probs = F.softmax(logits, dim=-1)
for tok, p in zip(vocab, probs[0]):
    print(f"{tok:>7}: {p:.3f}")
# mumbai gets ~0.588, the gets ~0.216, ...

target = torch.tensor([3])                   # the real next token was "mumbai"
loss = F.cross_entropy(logits, target)       # = -log(0.588)
print("loss:", round(loss.item(), 3))        # loss: 0.531

# Training = run this over billions of positions and nudge the weights so the
# loss falls:  loss.backward(); optimizer.step()
# A model that always puts probability 1.0 on the right token has loss 0.`
    },
    {
      heading: "4. Tokens, Tokenizers and Context Windows",
      content: `Models never see characters or words; they see **tokens**, integer IDs produced by a **tokenizer**. Modern tokenizers use **byte-pair encoding (BPE)** or similar sub-word schemes: frequent words like "the" become one token, rarer words are split ("tokenization" might become "token" + "ization"), and any byte sequence can be encoded, so no text is ever "unknown".
Rules of thumb that you will use constantly:
• In English prose, one token is roughly 4 characters or about three-quarters of a word; 1,000 tokens is roughly 750 words.
• Code, JSON with lots of punctuation, and non-Latin scripts such as Devanagari or Tamil usually need more tokens per word, sometimes two to three times more, which directly affects cost and latency for Indian-language products.
• Numbers are split in surprising ways, which is one reason LLMs are weak at arithmetic on long digit strings.
• Every provider has its own tokenizer, so counts differ between models; never reuse one model's token count for another.
The **context window** is the maximum number of tokens the model can attend to in a single request: system prompt plus conversation plus documents plus the generated answer, all together. Current Claude models offer context windows up to 1 million tokens (the exact figure per model is in the official model docs and changes between releases). Older or smaller models may offer 8K to 200K. Three practical consequences: the context window is a hard limit (overflow is an API error, not a graceful truncation); attention cost grows with sequence length, so long prompts cost more and respond slower; and models often use information from the middle of very long contexts less reliably than the beginning or end, which is why RAG (section 12) retrieves only the relevant passages instead of stuffing everything in.
The only reliable way to know how many tokens a prompt takes is to ask the provider's tokenizer. The Anthropic SDK exposes a token-counting endpoint for exactly this; the snippet compares it with the character-based guess.`,
      codeSnippet: `# count_tokens.py — never guess, measure (pip install anthropic)
import anthropic

client = anthropic.Anthropic()   # reads ANTHROPIC_API_KEY from the environment

samples = {
    "english": "Bengaluru is the technology capital of India and home to thousands of startups.",
    "hindi":   "बेंगलुरु भारत की प्रौद्योगिकी राजधानी है और हजारों स्टार्टअप का घर है।",
    "json":    '{"order_id": 48213, "amount_inr": 1299.50, "city": "Jaipur", "paid": true}',
}

for name, text in samples.items():
    resp = client.messages.count_tokens(
        model="claude-opus-5-5",
        messages=[{"role": "user", "content": text}],
    )
    print(f"{name:>8}: {len(text):>3} chars  ~{len(text)//4:>3} guessed  "
          f"{resp.input_tokens:>3} actual tokens")

# Typical shape of the output (exact numbers depend on the model's tokenizer):
#  english:  81 chars  ~ 20 guessed   24 actual tokens
#    hindi:  71 chars  ~ 17 guessed   60 actual tokens   <- Devanagari costs more
#     json:  80 chars  ~ 20 guessed   38 actual tokens   <- punctuation costs more`
    },
    {
      heading: "5. Temperature, Top-k and Top-p Sampling: Controlling Randomness",
      content: `Section 2 ended with "pick one token". How you pick is called the **decoding strategy**, and it is why two runs of the same prompt can differ.
**Greedy decoding** always takes the highest-probability token. It is deterministic but tends to produce repetitive, bland text and can get stuck in loops ("I am happy. I am happy. I am ...").
**Temperature** rescales the logits before the softmax: each logit is divided by T. With T below 1 the distribution becomes sharper (the top choice dominates), with T above 1 it flattens (unlikely tokens get a real chance). Example: if the model's raw probabilities are 0.50 / 0.25 / 0.15 / 0.10, temperature 0.5 turns them into roughly 0.72 / 0.18 / 0.07 / 0.03, while temperature 2.0 gives roughly 0.37 / 0.26 / 0.20 / 0.17. T = 0 is equivalent to greedy. Temperature does not make the model "smarter" or "more creative" in any deep sense; it only changes how often the less-likely continuations are chosen.
**Top-k sampling** keeps only the k most likely tokens, renormalises, and samples among them. It cuts off the long tail of nonsense tokens but uses a fixed k whether the distribution is sharp or flat.
**Top-p (nucleus) sampling** keeps the smallest set of tokens whose cumulative probability reaches p (for example 0.9). When the model is confident, that set might be one token; when it is unsure, it might be fifty. This adapts to the situation and is the most common default in open-weight inference stacks.
Guidance: use low temperature (0 to 0.3) for extraction, classification, code and anything where you want repeatability; higher values (0.7 to 1.0) for brainstorming and creative writing. Note an important current-API detail: Claude's current generation (Opus 5.5, Sonnet 5.5, Haiku 5.5 and the Fable 5 family) rejects non-default \`temperature\`, \`top_p\` and \`top_k\` values with a 400 error; quality and variability are instead controlled through adaptive thinking and \`effort\` (section 10). Sampling parameters remain essential whenever you run open-weight models with Hugging Face, vLLM or Ollama, so you must understand them either way. The snippet implements all three from scratch in NumPy.`,
      codeSnippet: `# sampling.py — temperature, top-k and top-p implemented in NumPy
import numpy as np

rng = np.random.default_rng(42)
vocab = ["mumbai", "pune", "nagpur", "nashik"]
probs = np.array([0.50, 0.25, 0.15, 0.10])      # model's raw next-token distribution
logits = np.log(probs)                           # logits are what the model really outputs

def softmax(x):
    x = x - x.max()
    e = np.exp(x)
    return e / e.sum()

def apply_temperature(logits, T):
    return softmax(logits / T)

def top_k(p, k):
    keep = np.argsort(p)[::-1][:k]
    out = np.zeros_like(p); out[keep] = p[keep]
    return out / out.sum()

def top_p(p, threshold):
    order = np.argsort(p)[::-1]
    cumulative = np.cumsum(p[order])
    # keep tokens until cumulative probability first reaches the threshold
    cutoff = np.searchsorted(cumulative, threshold) + 1
    keep = order[:cutoff]
    out = np.zeros_like(p); out[keep] = p[keep]
    return out / out.sum()

for T in (0.5, 1.0, 2.0):
    print(f"T={T}:", np.round(apply_temperature(logits, T), 2))
# T=0.5: [0.72 0.18 0.07 0.03]   sharper
# T=1.0: [0.5  0.25 0.15 0.1 ]   unchanged
# T=2.0: [0.37 0.26 0.2  0.17]   flatter

print("top_k=2:", np.round(top_k(probs, 2), 2))        # [0.67 0.33 0.   0.  ]
print("top_p=0.9:", np.round(top_p(probs, 0.9), 2))    # [0.56 0.28 0.17 0.  ]

samples = [vocab[rng.choice(4, p=apply_temperature(logits, 0.7))] for _ in range(10)]
print(samples)   # mostly 'mumbai', occasionally 'pune' or 'nagpur'`
    },
    {
      heading: "6. From Base Model to Assistant: Instruction Tuning, RLHF and Constitutional AI",
      content: `A base model predicts text; an assistant follows instructions, refuses harmful requests and answers in a helpful format. The gap is closed by **post-training**, typically in three stages.
**Stage 1: Supervised fine-tuning (SFT), also called instruction tuning.** The base model is further trained on tens of thousands of high-quality (instruction, ideal response) pairs written or curated by humans: "Summarise this email in two lines" paired with a good two-line summary. The objective is still next-token prediction, but now only on assistant-style conversations, so the model learns the format and the habit of answering rather than continuing. This is also where the chat template (system / user / assistant roles) is baked in.
**Stage 2: Reinforcement learning from human feedback (RLHF).** Humans compare pairs of model responses and pick the better one. These preferences train a **reward model** that scores any response. The LLM is then optimised with reinforcement learning (classically PPO; newer variants such as DPO skip the explicit reward model) to produce responses the reward model rates highly, while a penalty keeps it from drifting too far from the SFT model. This stage is what makes responses feel polite, well-structured and on-topic. It is also where some side effects originate, such as over-agreeable "sycophancy" or excessive hedging, because those traits sometimes get rewarded by raters.
**Stage 3: Constitutional AI and RLAIF.** Anthropic's **Constitutional AI** approach replaces much of the human labelling with a written set of principles (the "constitution"). The model critiques and revises its own drafts against those principles, and an AI model, rather than a human, produces the preference labels (reinforcement learning from AI feedback, RLAIF). The benefits are scale, consistency and transparency: the rules are explicit text that can be read and debated instead of being implicit in thousands of rater decisions.
For engineers the takeaway is: post-training shapes behaviour, not knowledge. A model's facts come from pretraining; its tone, refusals, formatting habits and willingness to say "I don't know" come from these stages. When you prompt, you are steering a model that has already been pulled strongly toward helpfulness, which is why short instructions work at all.`,
      codeSnippet: `# post_training_data.py — what the three stages' training data looks like
# (illustrative records, not a real dataset)

sft_example = {
    "messages": [
        {"role": "system", "content": "You are a concise assistant for an Indian fintech app."},
        {"role": "user", "content": "Explain UPI AutoPay in two sentences."},
        {"role": "assistant", "content": "UPI AutoPay lets you approve recurring payments "
            "such as SIPs or subscriptions once, after which they are debited automatically "
            "on the due date. You can pause or cancel the mandate anytime from your UPI app."},
    ]
}

rlhf_preference_pair = {
    "prompt": "My SIP of ₹5,000 failed this month. What should I do?",
    "chosen":   "Check that your bank balance covered ₹5,000 on the debit date, then confirm "
                "the AutoPay mandate is still active in your UPI app. If both are fine, "
                "contact your fund house; most retry the debit within a few days.",
    "rejected": "SIPs can fail for many reasons. Please consult the relevant documentation.",
}

constitutional_critique_step = {
    "principle": "Choose the response that is most helpful while never inventing "
                 "specific fees, dates or regulations you are not certain about.",
    "draft":    "SEBI charges a ₹250 penalty for every failed SIP.",   # invented fact
    "critique": "The draft states a specific penalty that is not supported; it should "
                "say that any charges depend on the bank and fund house.",
    "revision": "Some banks may charge a small fee for a failed auto-debit; check your "
                "bank's schedule of charges. Fund houses generally do not penalise a missed SIP.",
}

for name, record in [("SFT", sft_example), ("RLHF", rlhf_preference_pair),
                     ("Constitutional", constitutional_critique_step)]:
    print(name, "->", list(record.keys()))`
    },
    {
      heading: "7. Emergent Capabilities and Fundamental Limitations of LLMs",
      content: `**Emergent capabilities** are abilities that were not explicitly trained for and that appear, or sharply improve, once models pass a certain scale. Nobody wrote a "translate Hindi to English" loss or a "write a React component" objective; these fell out of predicting the next token on enough diverse data. The most important emergent behaviour for engineers is **in-context learning**: the model can learn a new task from a few examples placed in the prompt (few-shot prompting) without any weight updates. Others include multi-step arithmetic, following complex formatting instructions, and tool use (emitting structured calls to external functions). A 2022 paper by Wei et al. catalogued many such jumps; a 2023 follow-up argued that some "emergence" is an artefact of all-or-nothing metrics and that abilities grow more smoothly when measured continuously. Either way, the practical fact stands: larger, better-trained models do things smaller ones cannot, and model choice is a real engineering decision.
Equally important are the **limitations that do not go away with scale**:
• **No grounding in truth.** The model optimises plausibility, not correctness (section 8).
• **Frozen knowledge.** Weights are fixed after training; the model learns nothing from your conversation beyond the current context window (section 9).
• **Weak at exact computation.** Long multiplications, counting characters and precise date arithmetic fail because tokens, not digits, are the unit. The fix is tool use: let the model call a calculator or run code.
• **Prompt sensitivity.** Rewording a prompt can change the answer, and the model can be hijacked by instructions hidden in the content it reads (prompt injection), which matters whenever you feed it web pages, emails or user uploads.
• **Bias and stereotypes** inherited from the training distribution.
• **Non-determinism and limited self-knowledge.** The model cannot reliably report why it produced an answer or how confident it truly is; "Are you sure?" often just makes it flip.
Good LLM engineering is largely the art of putting these models in systems (retrieval, tools, validation, human review) that compensate for exactly these weaknesses. The snippet shows in-context learning: three examples in the prompt are enough to make the model perform a bespoke classification task it was never trained on.`,
      codeSnippet: `# in_context_learning.py — a task the model was never trained on, taught in the prompt
import anthropic

client = anthropic.Anthropic()

few_shot_prompt = """Classify each support ticket for a Hyderabad food-delivery app into exactly one
label from: LATE_DELIVERY, WRONG_ITEM, PAYMENT_ISSUE, OTHER. Reply with the label only.

Ticket: "Ordered biryani, got paneer tikka." -> WRONG_ITEM
Ticket: "Money deducted twice via UPI for one order." -> PAYMENT_ISSUE
Ticket: "Rider took 90 minutes, food was cold." -> LATE_DELIVERY

Ticket: "App shows order delivered but nothing arrived after two hours." ->"""

response = client.beta.messages.create(
    model="claude-opus-5-5",
    max_tokens=256,
    betas=["server-side-fallback-2026-07-01"],
    fallbacks="default",                 # if a safety classifier declines, retry server-side
    messages=[{"role": "user", "content": few_shot_prompt}],
)

if response.stop_reason == "refusal":
    print("declined:", response.stop_details)
else:
    label = "".join(b.text for b in response.content if b.type == "text").strip()
    print(label)   # LATE_DELIVERY`
    },
    {
      heading: "8. Hallucination: Why LLMs Make Things Up and How to Reduce It",
      content: `A **hallucination** is a fluent, confident output that is false or unsupported: a citation to a paper that does not exist, an npm package that was never published, a Supreme Court judgment with a plausible name and a wrong year. After sections 2 and 3 you can see why it happens. The model is rewarded for producing the most probable continuation. When it has strong evidence (a fact seen thousands of times), the probable continuation is also the true one. When it has weak or no evidence, there is still a most probable continuation, and the model emits it with the same fluency. There is no internal signal that says "I am guessing now"; post-training reduces this tendency but cannot eliminate it, because the underlying mechanism is the same.
Hallucinations cluster in predictable places: precise numbers and dates, niche or very recent topics, long tails of a popular topic (the fourth-most-famous paper by an author), anything the model is asked to recall verbatim (URLs, quotes, API signatures), and tasks where the prompt itself contains a false premise ("Why did Reliance acquire Infosys in 2023?").
Engineering mitigations, roughly in order of impact:
1. **Ground the model in retrieved sources (RAG).** Put the relevant document in the prompt and instruct the model to answer only from it, quoting or citing the passage. This converts a recall task into a reading-comprehension task, where models are far more reliable.
2. **Give it permission to abstain.** An explicit "If the context does not contain the answer, say you do not know" materially reduces fabrication.
3. **Verify with tools.** Let the model check a package registry, run the code, or query the database instead of recalling.
4. **Constrain the output.** Structured outputs and enums leave less room for free-form invention.
5. **Add a second pass.** A cheaper model (or the same model) checks each claim in the draft against the sources; disagreements are flagged for a human.
6. **Measure.** Keep an evaluation set with known answers and track the hallucination rate across prompt and model changes rather than trusting a demo.
The snippet shows the difference between an ungrounded question and the same question grounded in a document with an abstention rule.`,
      codeSnippet: `# grounding.py — reduce hallucination by grounding + permission to abstain
import anthropic

client = anthropic.Anthropic()

policy_doc = """Refund policy (v3, effective 1 April 2026):
- Cancellations within 10 minutes of ordering: full refund to the original payment method.
- Cancellations after food is prepared: no refund, except for wrong or missing items.
- Refunds are processed within 5 to 7 working days."""

system = ("You answer customer questions ONLY from the policy document provided. "
          "Quote the relevant line. If the document does not cover the question, reply exactly: "
          "'The policy document does not cover this; please contact support.'")

questions = [
    "I cancelled 3 minutes after ordering. Do I get a refund?",
    "Is there a cancellation fee if I pay by cash on delivery?",   # not in the document
]

for q in questions:
    response = client.beta.messages.create(
        model="claude-opus-5-5",
        max_tokens=1024,
        betas=["server-side-fallback-2026-07-01"],
        fallbacks="default",
        system=system,
        messages=[{"role": "user", "content": f"<policy>\\n{policy_doc}\\n</policy>\\n\\nQuestion: {q}"}],
    )
    if response.stop_reason == "refusal":
        print("declined:", response.stop_details); continue
    print("Q:", q)
    print("A:", "".join(b.text for b in response.content if b.type == "text"), "\\n")

# Expected shape of the answers:
# Q1 -> Yes: "Cancellations within 10 minutes of ordering: full refund ..." (quoted)
# Q2 -> "The policy document does not cover this; please contact support."`
    },
    {
      heading: "9. Knowledge Cutoff: Why the Model Does Not Know Last Month's News",
      content: `Every model has a **training data cutoff** (also called knowledge cutoff): the point after which no text was included in pretraining. Anything that happened later, a new Next.js release, a change in GST rules, your company's internal wiki, is simply absent from the weights. Model documentation usually lists both a training cutoff and a "reliable knowledge" date, because coverage of the last few months before the cutoff is thinner (the web had not yet written much about those events). Always check the official model page rather than asking the model itself; models are often unsure of their own cutoff, and the answer can itself be a hallucination.
Three behaviours follow from a frozen cutoff:
• The model may assume it is still the year of its cutoff. If your task depends on today's date (age calculations, "latest version", deadlines), put the current date in the system prompt.
• It will describe old APIs as current. For fast-moving libraries, paste the relevant section of the current docs into the prompt or use retrieval; this course's own repository note ("this is NOT the Next.js you know") exists for exactly this reason.
• It cannot know your private data. Internal documents, customer records and product catalogues must be supplied at request time.
The standard remedies are the same tools you will meet throughout the course: **RAG** for documents, **web search tools** for public recency (Claude offers a server-side web search tool; see the official docs for the current tool version), and **context injection** for small facts such as the date or the user's plan. The snippet is a Next.js Route Handler that injects the current date and a fresh changelog excerpt so the model answers about the present instead of its training-time world.`,
      codeSnippet: `// app/api/ask/route.js  (npm install @anthropic-ai/sdk)
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic(); // ANTHROPIC_API_KEY from .env.local, server-side only

export async function POST(request) {
  const { question } = await request.json();

  // Anything newer than the model's cutoff must be supplied in the prompt.
  const today = new Date().toISOString().slice(0, 10);
  const changelog = await fetch(process.env.CHANGELOG_URL).then((r) => r.text());

  const response = await client.beta.messages.create({
    model: "claude-opus-5-5",
    max_tokens: 2048,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system:
      "Today's date is " + today + ". Your training data has a cutoff, so for anything " +
      "about recent releases rely ONLY on the changelog below and say so if it is silent.\\n\\n" +
      "<changelog>\\n" + changelog + "\\n</changelog>",
    messages: [{ role: "user", content: question }],
  });

  if (response.stop_reason === "refusal") {
    return Response.json({ error: "Request declined", details: response.stop_details }, { status: 422 });
  }
  const answer = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");
  return Response.json({ answer, model: response.model, usage: response.usage });
}`
    },
    {
      heading: "10. Reasoning and Extended Thinking at a Conceptual Level",
      content: `Because the model produces one token at a time, it has a fixed amount of computation per token. A hard problem that needs many steps cannot be solved "in one token"; the model has to spread the work across many tokens. That is the whole intuition behind **chain-of-thought** prompting: when the model writes out intermediate steps before the final answer, each step conditions the next, and accuracy on maths, logic and multi-step planning rises sharply. Writing the steps is not decoration; it is where the computation happens.
**Extended thinking** (also called reasoning models or test-time compute) builds this into the model itself. Through additional post-training, often with reinforcement learning on problems with verifiable answers, the model learns to produce a long private reasoning phase before its visible reply: exploring approaches, checking its own arithmetic, backtracking when a plan fails. More thinking tokens generally buy more accuracy on hard tasks, at the cost of latency and money, so providers expose a control knob. In the current Claude API the model decides how much to think (**adaptive thinking**), and you steer the trade-off with \`output_config.effort\` (\`low\` to \`max\`). The raw chain of thought is never returned; you can request a readable summary with \`display: "summarized"\`, and by default the thinking block is returned empty. Older models used a fixed \`budget_tokens\` parameter, which current models reject; check the official docs when reading older tutorials.
Practical guidance:
• Use low effort for classification, extraction and chat, where thinking adds cost without changing the answer.
• Use high effort for coding, debugging, data analysis and anything with a verifiable right answer.
• Expect multi-minute responses at the top settings and use streaming so requests do not time out.
• Thinking reduces, but does not remove, hallucination: a model can reason carefully from a false premise.
The snippet asks a classic trick question with thinking summaries enabled and prints both the summary and the answer.`,
      codeSnippet: `# extended_thinking.py — adaptive thinking with a readable summary
import anthropic

client = anthropic.Anthropic()

problem = ("A train leaves Delhi at 6:00 PM and reaches Jaipur, 300 km away, at 10:30 PM "
           "after a 30-minute halt at Alwar. What was its average speed while moving? "
           "Give the answer in km/h.")

with client.beta.messages.stream(
    model="claude-opus-5-5",
    max_tokens=16000,
    betas=["server-side-fallback-2026-07-01"],
    fallbacks="default",
    thinking={"type": "adaptive", "display": "summarized"},   # default display is omitted
    output_config={"effort": "high"},                         # low | medium | high | xhigh | max
    messages=[{"role": "user", "content": problem}],
) as stream:
    response = stream.get_final_message()

if response.stop_reason == "refusal":
    print("declined:", response.stop_details)
else:
    for block in response.content:
        if block.type == "thinking":
            print("[thinking summary]", block.thinking[:300], "...")
        elif block.type == "text":
            print("[answer]", block.text)

print("output tokens:", response.usage.output_tokens)   # thinking tokens are billed as output

# [thinking summary] Total elapsed 4.5 h, minus 0.5 h halt = 4 h moving ...
# [answer] 300 km / 4 h = 75 km/h`
    },
    {
      heading: "11. Open-Weight vs API Models: Choosing Where Your Model Runs",
      content: `**API (hosted) models** such as Claude are accessed over HTTPS; the provider owns the weights, the GPUs and the serving stack. **Open-weight models** (Llama, Mistral, Qwen, Gemma, DeepSeek and many others) publish their trained weights so you can download and run them yourself with Hugging Face Transformers, vLLM, llama.cpp or Ollama. "Open-weight" is not always "open-source": licences differ in commercial restrictions, so read them. Neither option is universally better; this is a classic engineering trade-off.
Choose an **API model** when you want:
• The highest capability available, with no infrastructure to manage and new models on release day.
• Elastic scale: from one request a day to millions, billed per token (prices change often; always read the provider's pricing page rather than a blog post).
• Built-in features such as tool use, extended thinking, prompt caching, batch processing and server-side web search.
• A small team: a Next.js Route Handler plus the official SDK is a complete backend.
Choose an **open-weight model** when you need:
• **Data residency or air-gapped deployment**: a hospital in Chennai or a bank under RBI guidelines that cannot send records to a third party.
• **Full control of weights**: custom fine-tuning, no behaviour changes on model updates, deterministic serving.
• **Very high volume of simple tasks** where a small 1B to 8B model on your own GPU is cheaper per request than any API, after accounting for engineers, hardware and uptime.
• **Offline or edge** use: on-device assistants, a laptop demo, a rural kiosk with poor connectivity.
Hidden costs of self-hosting are real: GPU procurement, quantisation, serving optimisation, monitoring, security patches, and the fact that a well-tuned 70B model on your cluster still typically trails frontier API models on hard reasoning. Many teams combine both: an open-weight model for high-volume routing and classification, an API model for the hard, customer-facing step. The snippet runs a small open-weight model locally and uses the sampling parameters from section 5, which is where they still apply.`,
      codeSnippet: `# open_weight_demo.py — run an open-weight model locally
# pip install torch transformers   (downloads ~350 MB on first run)
from transformers import AutoTokenizer, AutoModelForCausalLM, set_seed

model_id = "distilgpt2"                       # tiny open-weight model, fine for a demo
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(model_id)

prompt = "The best way to learn machine learning is"
inputs = tokenizer(prompt, return_tensors="pt")
print("prompt tokens:", inputs["input_ids"][0].tolist())   # the integer IDs the model sees

set_seed(7)
for temperature in (0.3, 1.0):
    output = model.generate(
        **inputs,
        max_new_tokens=25,
        do_sample=True,            # sampling, not greedy
        temperature=temperature,   # the knobs from section 5 apply directly here
        top_k=50,
        top_p=0.9,
        pad_token_id=tokenizer.eos_token_id,
    )
    print(f"T={temperature}:", tokenizer.decode(output[0], skip_special_tokens=True))

# T=0.3 -> a safe, generic continuation ("...to start with the basics and ...")
# T=1.0 -> a more varied, sometimes odd continuation. A 2019-era 82M-parameter model
#          will not be factual; the point is that the whole pipeline runs on your laptop.`
    },
    {
      heading: "12. Fine-Tuning vs Prompting vs RAG: The Customisation Decision",
      content: `Every team eventually asks: "the model is not doing what we want; should we fine-tune it?" The answer is usually no, and the decision has a clear order.
**1. Prompting (start here, always).** A system prompt with the role, rules, format and a few examples solves the majority of "the model is not behaving" problems at zero training cost, and it is instantly editable. Combine with structured outputs for strict formats and tool use for actions. If the model has the knowledge and the capability but not the instructions, prompting is the fix.
**2. Retrieval-Augmented Generation (RAG).** When the problem is missing **knowledge** (your documents, recent data, private records), do not try to train it in. Store the documents as embeddings (Lecture 6), retrieve the few most relevant chunks per query, and place them in the prompt. RAG keeps knowledge current (update the index, not the model), lets you cite sources, and respects access control (retrieve only what this user may see). It is the default architecture for support bots, internal search and document Q&A.
**3. Fine-tuning.** When the problem is a **behaviour or style** that prompts cannot reliably produce, or you need a small model to match a big one on a narrow task, fine-tuning adjusts the weights on hundreds to thousands of curated examples. Parameter-efficient methods such as LoRA and QLoRA train only small adapter matrices, so an 8B open-weight model can be tuned on a single GPU. Typical wins: a consistent brand voice, a domain-specific output format, classification at very high volume with a cheap model, or latency reduction by removing long few-shot prompts. Fine-tuning is poor at adding facts (they get mixed into weights unreliably and go stale), it needs an evaluation set before you start, and hosted frontier models may not expose fine-tuning at all; check each provider's official docs.
Decision checklist:
• Is it a knowledge gap? RAG.
• Is it an instruction or format problem? Prompting (plus structured outputs).
• Is it a persistent style or narrow-task quality problem that survives good prompting and good retrieval, and do you have 500+ clean examples and an eval? Fine-tune, usually an open-weight model.
• Often the answer is all three: a fine-tuned small model for routing, RAG for grounding, and a prompted frontier model for the final answer.`,
      codeSnippet: `# customization_decision.py — encode the decision as a checklist you can run in a design review
def recommend(problem_type, has_clean_examples=0, has_eval_set=False,
              prompt_attempts=0, needs_fresh_data=False):
    """Returns the cheapest strategy that fits the symptoms."""
    if problem_type == "knowledge" or needs_fresh_data:
        return "RAG — missing or changing knowledge belongs in retrieval, not weights."
    if problem_type == "format" or problem_type == "instructions":
        return "Prompting — system prompt + few-shot examples + structured outputs."
    if problem_type in ("style", "narrow_task"):
        if prompt_attempts < 3:
            return "Prompting first — iterate at least 3 prompt versions against an eval."
        if has_clean_examples >= 500 and has_eval_set:
            return "Fine-tune (LoRA/QLoRA on an open-weight model) — behaviour, not knowledge."
        return "Collect 500+ examples and build an eval before fine-tuning."
    return "Clarify the problem type: knowledge, format, instructions, style or narrow_task."

cases = [
    dict(problem_type="knowledge", needs_fresh_data=True),                       # support bot on your docs
    dict(problem_type="format"),                                                 # wants strict JSON
    dict(problem_type="style", prompt_attempts=1),                               # brand voice, barely tried
    dict(problem_type="narrow_task", prompt_attempts=5, has_clean_examples=2000,
         has_eval_set=True),                                                     # ticket router, high volume
]
for c in cases:
    print(c["problem_type"], "->", recommend(**c))

# knowledge -> RAG — missing or changing knowledge belongs in retrieval, not weights.
# format -> Prompting — system prompt + few-shot examples + structured outputs.
# style -> Prompting first — iterate at least 3 prompt versions against an eval.
# narrow_task -> Fine-tune (LoRA/QLoRA on an open-weight model) — behaviour, not knowledge.`
    },
    {
      heading: "13. Real-World Use Cases: How LLM Internals Show Up in Production",
      content: `Each concept in this lecture maps to a decision in a production system. Some examples drawn from the kind of products Indian engineering teams ship today:
**Customer support for a fintech app.** Knowledge of policies lives in a RAG index that is re-built whenever the policy changes (knowledge cutoff, section 9); answers must quote the retrieved line and abstain when unsure (hallucination, section 8); extraction of order IDs uses low variability and structured outputs; the whole flow runs through a Next.js Route Handler with the official SDK.
**Code assistant inside an IDE.** The current file plus related files are selected to fit the context window by token count (section 4), the model is asked for a high-effort pass with thinking on hard refactors and a low-effort pass for autocomplete (section 10), and generated code is verified by actually running tests because the model cannot execute code in its head (limitations, section 7).
**Document processing for a logistics company.** Thousands of invoices a day are classified and extracted; a fine-tuned small open-weight model running on-premises handles the volume cheaply and keeps data in-country, while a frontier API model handles the ambiguous 5 percent that the small model flags (open-weight vs API, section 11; fine-tuning, section 12).
**Education app in Hindi and Tamil.** Token counts per sentence are two to three times higher than English, so cost estimates and context budgets are computed per language rather than copied from an English prototype (tokens, section 4).
**Content and marketing tools.** Brainstorming uses higher variability for diversity, while the final "polish this draft" step uses low variability for consistency; on API models where sampling parameters are fixed, the same effect comes from asking for several candidates in one call (sampling, section 5).
**Research and analysis agents.** Multi-step tasks run with extended thinking and tools, with explicit date and source injection, and every claim in the final report is checked against the retrieved sources by a second pass. The common thread: the system around the model does the grounding, verification and control that the model's next-token mechanism cannot do alone.`
    },
    {
      heading: "14. Common Mistakes with Large Language Models and How to Fix Them",
      content: `**Mistake 1: Treating the model as a database.** Asking for exact figures, citations or API signatures from memory and shipping them unverified. Fix: retrieve the source and make the model quote it, or let it call a tool; measure hallucination rate on an eval set.
**Mistake 2: Estimating tokens by word count.** An English estimate applied to Hindi content or JSON blows the budget. Fix: measure with the provider's token-counting endpoint for every language and format you serve.
**Mistake 3: Copying sampling parameters from old tutorials.** Sending \`temperature\`, \`top_p\` or \`budget_tokens\` to a current Claude model returns a 400 error. Fix: read the current docs; control current models through adaptive thinking and \`effort\`, and keep sampling knobs for open-weight inference.
**Mistake 4: Stuffing the entire knowledge base into the context window because it fits.** It fits, but it costs more, responds slower and is used less reliably than targeted retrieval. Fix: retrieve the top few relevant chunks; use prompt caching for a large stable prefix.
**Mistake 5: Forgetting the date and the cutoff.** The model reasons as if it were still its training year. Fix: inject today's date and any post-cutoff facts into the system prompt.
**Mistake 6: Fine-tuning to add knowledge.** Facts fine-tuned into weights are learned unevenly and go stale. Fix: RAG for knowledge; fine-tune only for behaviour, style or narrow-task quality after prompting has been exhausted.
**Mistake 7: Trusting the model's own confidence.** "Are you sure?" flips answers; "How confident are you?" produces a plausible-sounding number. Fix: verify with tools, use second-pass checking, and calibrate against evals.
**Mistake 8: Using maximum effort everywhere.** Extended thinking on simple classification multiplies latency and cost for no accuracy gain. Fix: sweep effort levels per route and pick the lowest that holds quality.
**Mistake 9: Feeding untrusted text without defences.** Web pages, emails and uploaded PDFs can contain instructions the model follows (prompt injection). Fix: separate data from instructions with clear delimiters, restrict tools, and never let retrieved content change the system prompt.
**Mistake 10: Reading only the first content block.** Responses with thinking enabled contain a thinking block before the text block, and a refusal has no answer at all. Fix: check \`stop_reason\`, then iterate over content and filter by \`type\`.`
    },
    {
      heading: "15. Frequently Asked Questions about How LLMs Work",
      content: `**How do large language models generate text?**
They predict a probability distribution over the next token given all previous tokens, pick one token (greedily or by sampling), append it, and repeat. The entire response is produced one token at a time by this loop; there is no planning module separate from the prediction itself, which is why writing intermediate steps improves reasoning.
**What is the difference between a token and a word?**
A token is a sub-word unit produced by the tokenizer. Common English words are one token, rare words split into several, and scripts like Devanagari or heavy punctuation need more tokens per word. Roughly 1,000 English tokens is about 750 words, but you should always measure with the provider's token counter.
**What does temperature do in an LLM?**
Temperature divides the logits before the softmax. Values below 1 sharpen the distribution toward the most likely token (more repeatable output), values above 1 flatten it (more varied, riskier output). Note that current Claude models fix sampling parameters and use adaptive thinking plus effort instead; temperature still applies when you run open-weight models.
**What is the difference between top-k and top-p sampling?**
Top-k keeps a fixed number of the most likely tokens; top-p (nucleus) keeps the smallest set whose cumulative probability reaches p, so the set shrinks when the model is confident and grows when it is unsure. Top-p adapts better and is the more common default.
**Why do LLMs hallucinate?**
Because they are trained to produce the most probable continuation, not the true one. When the model lacks evidence it still outputs a fluent best guess with no built-in "I am guessing" signal. Grounding with retrieved sources, explicit permission to abstain, tool verification and evaluation reduce it substantially.
**What is RLHF in simple terms?**
Reinforcement learning from human feedback: humans rank model responses, a reward model learns those preferences, and the LLM is optimised to produce highly rated responses. It is the stage that makes a raw text predictor polite, helpful and formatted; Constitutional AI replaces much of the human ranking with written principles and AI feedback.
**What is a knowledge cutoff and how do I work around it?**
It is the date after which no data was in the model's training set, so later events and your private data are unknown to it. Work around it by putting the current date and relevant up-to-date documents in the prompt, using retrieval (RAG) or a web search tool, and never asking the model to recall recent facts from memory.
**Should I fine-tune an LLM or use RAG?**
Use RAG when the problem is missing or changing knowledge; use prompting when it is instructions or format; fine-tune only for persistent style or narrow-task quality after prompting fails, when you have hundreds of clean examples and an evaluation set. Most production systems need RAG and good prompting long before they need fine-tuning.`
    },
    {
      heading: "16. Interview Questions and Answers on Large Language Models",
      content: `**Q1. Explain next-token prediction and why it leads to such broad capabilities.**
The model outputs a probability for every vocabulary token given the preceding tokens and is trained with cross-entropy to raise the probability of the true next token across trillions of positions. Predicting text well requires modelling grammar, facts, code structure and some reasoning, because all of these reduce the loss, so a single objective yields many skills, including in-context learning that emerges at scale.
**Q2. What is the difference between a base model and an instruction-tuned model?**
A base model is the direct result of pretraining and behaves like autocomplete. An instruction-tuned (chat) model has gone through supervised fine-tuning on instruction-response pairs and preference optimisation (RLHF, DPO or Constitutional AI), so it follows instructions, uses a chat template and applies safety behaviour. Knowledge comes mostly from pretraining; behaviour from post-training.
**Q3. How does temperature interact with top-p?**
Temperature is applied first, reshaping the distribution; top-p then truncates it to the nucleus of tokens whose cumulative probability reaches p and renormalises. High temperature with low top-p can still be fairly safe because the tail is cut; low temperature makes top-p nearly irrelevant because almost all mass sits on one token.
**Q4. Why can't you just put every document into a 1M-token context instead of building RAG?**
Cost and latency scale with input length, every request re-sends the documents (caching helps but does not remove the cost), relevant facts buried in the middle of very long contexts are used less reliably, and access control requires retrieving only what the user may see. Retrieval selects the few chunks that matter and keeps the index fresh without touching the model.
**Q5. What is a context window, and what happens when you exceed it?**
The maximum tokens the model can process in one request, counting system prompt, history, documents and the generated output. Exceeding it produces an API error; you must summarise, truncate, retrieve selectively or use the provider's compaction features. Output length also counts, so leave headroom for the answer.
**Q6. What causes hallucination and name three mitigations.**
Hallucination arises because the model optimises plausibility rather than truth and has no internal signal distinguishing knowledge from guesswork. Mitigations: ground answers in retrieved sources with citations, instruct the model to abstain when the context lacks the answer, verify claims with tools or a second checking pass, constrain output structure, and track hallucination rate on an evaluation set.
**Q7. How does extended thinking improve accuracy, and when should you not use it?**
Each generated token gets a fixed amount of computation, so hard problems need many tokens of intermediate reasoning; extended thinking trains the model to perform that reasoning privately before answering, and adaptive thinking with an effort setting controls how much. Avoid high effort for simple classification, extraction and latency-sensitive chat, where it adds cost and delay without improving results.
**Q8. Compare open-weight and API models for a healthcare company in India.**
Open-weight models allow on-premises deployment, data residency and full control, which suits regulated patient data, at the cost of GPUs, serving expertise and usually lower peak capability. API models give the strongest capability, elastic scale and built-in tools with no infrastructure, but data leaves the organisation under the provider's terms. A common design is open-weight for processing identifiable records and an API model for de-identified or non-sensitive reasoning tasks.
**Q9. When is fine-tuning the wrong choice?**
When the gap is missing knowledge (use RAG), when instructions or format are the issue (use prompting and structured outputs), when you have no evaluation set to measure improvement, or when you have fewer than a few hundred clean examples. Fine-tuning changes behaviour reliably but encodes facts unreliably and freezes them at training time.
**Q10. What is Constitutional AI and how does it differ from standard RLHF?**
Constitutional AI, developed by Anthropic, trains a model to critique and revise its own responses against an explicit written set of principles and uses AI-generated preference labels (RLAIF) instead of relying mainly on human rankings. It scales better, is more consistent, and makes the governing values inspectable text rather than implicit rater judgement.`
    },
    {
      heading: "17. Hands-On Exercise: Build a Mini Language Model with Temperature, Top-k and Top-p Sampling from Scratch",
      content: `In this exercise you will build a complete, runnable language model in pure NumPy and watch every concept from this lecture in action. The model is a word-level bigram model with add-k smoothing (so every transition has a non-zero probability, just like a neural LM over a full vocabulary). You will:
1. Tokenise a small corpus and build the vocabulary (section 4).
2. Train by counting and convert counts into logits, the same quantity a neural network outputs (sections 2 and 3).
3. Compute the training loss (cross-entropy) and the model's perplexity on held-out text.
4. Implement greedy decoding, temperature scaling, top-k and top-p sampling (section 5).
5. Generate text under each strategy and observe repetition under greedy decoding, more variety at high temperature, and the adaptive behaviour of top-p.
Run it with \`python mini_lm.py\` (requires only NumPy). Then try the extensions: replace the bigram with a trigram (condition on two previous words) and see perplexity drop; add a repetition penalty that halves the probability of any token already generated; and scale the corpus up with a few paragraphs of your own writing to see how the vocabulary size and the smoothing constant change the samples. Each extension mirrors a real technique used in production inference engines.`,
      codeSnippet: `# mini_lm.py — a complete from-scratch language model with modern sampling
import numpy as np

CORPUS = """
mumbai is the financial capital of india . bengaluru is the technology capital of india .
delhi is the political capital of india . chennai is a major port city on the east coast .
kolkata is a cultural capital with a rich history . hyderabad is a growing technology hub .
pune is an education hub near mumbai . many startups are based in bengaluru and pune .
the monsoon brings heavy rain to mumbai and chennai every year .
india has many large cities and each city has a different character .
"""
HELD_OUT = "bengaluru is a technology hub . mumbai is a major city ."

# 1. Tokenise and build the vocabulary -------------------------------------
def tokenize(text):
    return text.lower().split()

tokens = tokenize(CORPUS)
vocab = sorted(set(tokens))
stoi = {w: i for i, w in enumerate(vocab)}
V = len(vocab)
print(f"corpus tokens: {len(tokens)}   vocabulary size: {V}")

# 2. "Train" = count bigrams; add-k smoothing gives every token a tiny probability
k = 0.01
counts = np.full((V, V), k)
for a, b in zip(tokens, tokens[1:]):
    counts[stoi[a], stoi[b]] += 1
logits = np.log(counts)                 # one row of logits per context, like a neural LM

def softmax(x):
    x = x - x.max()
    e = np.exp(x)
    return e / e.sum()

# 3. Loss and perplexity ----------------------------------------------------
def cross_entropy(text):
    ids = [stoi.get(w) for w in tokenize(text)]
    losses = []
    for a, b in zip(ids, ids[1:]):
        if a is None or b is None:
            continue                     # unknown word: skip (a real tokenizer never has these)
        p = softmax(logits[a])[b]
        losses.append(-np.log(p))
    return float(np.mean(losses))

train_loss = cross_entropy(CORPUS)
test_loss = cross_entropy(HELD_OUT)
print(f"train loss {train_loss:.3f}  perplexity {np.exp(train_loss):.1f}")
print(f"test  loss {test_loss:.3f}  perplexity {np.exp(test_loss):.1f}")

# 4. Decoding strategies ----------------------------------------------------
rng = np.random.default_rng(0)

def sample_next(row_logits, temperature=1.0, top_k=None, top_p=None):
    if temperature == 0:
        return int(np.argmax(row_logits))                 # greedy
    probs = softmax(row_logits / temperature)
    if top_k is not None:
        keep = np.argsort(probs)[::-1][:top_k]
        mask = np.zeros_like(probs); mask[keep] = probs[keep]
        probs = mask / mask.sum()
    if top_p is not None:
        order = np.argsort(probs)[::-1]
        cumulative = np.cumsum(probs[order])
        cutoff = np.searchsorted(cumulative, top_p) + 1
        keep = order[:cutoff]
        mask = np.zeros_like(probs); mask[keep] = probs[keep]
        probs = mask / mask.sum()
    return int(rng.choice(V, p=probs))

def generate(start, max_new_tokens=14, **kw):
    ids = [stoi[start]]
    for _ in range(max_new_tokens):
        nxt = sample_next(logits[ids[-1]], **kw)
        ids.append(nxt)
        if vocab[nxt] == ".":
            break
    return " ".join(vocab[i] for i in ids)

# 5. Compare strategies -----------------------------------------------------
settings = [
    ("greedy (T=0)",          dict(temperature=0)),
    ("T=0.5",                 dict(temperature=0.5)),
    ("T=1.0",                 dict(temperature=1.0)),
    ("T=1.5",                 dict(temperature=1.5)),
    ("T=1.0 top_k=3",         dict(temperature=1.0, top_k=3)),
    ("T=1.0 top_p=0.9",       dict(temperature=1.0, top_p=0.9)),
]
for name, kw in settings:
    print(f"{name:>18}: {generate('mumbai', **kw)}")

# Show the actual distribution after "is" to see what temperature does
row = logits[stoi["is"]]
for T in (0.5, 1.0, 2.0):
    p = softmax(row / T)
    top = np.argsort(p)[::-1][:4]
    print(f"after 'is' at T={T}: " + ", ".join(f"{vocab[i]}={p[i]:.2f}" for i in top))

# Sample output (sampled lines vary from run to run):
# corpus tokens: 95   vocabulary size: 49
# train loss 0.912  perplexity 2.5
# test  loss 2.4..  perplexity 11..            <- higher: the model has not seen these pairs
#       greedy (T=0): mumbai is the financial capital of india .
#              T=0.5: mumbai is the technology capital of india .
#              T=1.0: mumbai and chennai every year .
#              T=1.5: mumbai is a growing technology hub .   (or occasionally nonsense)
#     T=1.0 top_k=3: mumbai is a major port city on the east coast .
#   T=1.0 top_p=0.9: mumbai is the political capital of india .
# after 'is' at T=0.5: the=0.63, a=0.34, an=0.02, ...
# after 'is' at T=1.0: the=0.50, a=0.38, an=0.10, ...
# after 'is' at T=2.0: the=0.22, a=0.19, an=0.10, ...`
    },
    {
      heading: "18. Summary",
      content: `• An LLM is a decoder-only Transformer that outputs a probability distribution over the next token; generation is that function run in a loop.
• **Pretraining** on trillions of tokens with cross-entropy loss gives the model its knowledge and skills; scaling laws tie quality to parameters, data and compute.
• Models see **tokens**, not words; counts differ by language and format, and the **context window** is a hard limit on prompt plus output.
• **Temperature**, **top-k** and **top-p** control how the next token is chosen; current Claude models fix these and use adaptive thinking plus \`effort\` instead, while open-weight inference still relies on them.
• **Instruction tuning**, **RLHF** and **Constitutional AI** turn a base model into an assistant; they shape behaviour, not knowledge.
• **Emergent capabilities** such as in-context learning appear with scale, but hallucination, frozen knowledge, weak arithmetic and prompt sensitivity are structural limits to design around.
• **Hallucination** is the most probable continuation in the absence of evidence; ground with RAG, allow abstention, verify with tools and measure on evals.
• The **knowledge cutoff** means recent and private facts must be injected at request time; always put the current date in the prompt when it matters.
• **Extended thinking** spends tokens on private reasoning before answering; use high effort for hard, verifiable tasks and low effort for simple ones.
• **Open-weight** models give control and data residency; **API** models give top capability and zero infrastructure; many systems use both.
• Customise in order: **prompting**, then **RAG** for knowledge, then **fine-tuning** only for behaviour or narrow-task quality with examples and an eval in hand.
**Next lecture:** Prompt Engineering for Developers`
    }
  ]
};
