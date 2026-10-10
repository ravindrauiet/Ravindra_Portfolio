export const lecture05 = {
  slug: "lecture-5",
  number: 5,
  title: "Complete AI & LLM Engineering Course — Lecture 5: Neural Networks & Deep Learning with PyTorch",
  summary: "Learn neural networks and deep learning with PyTorch from scratch: neurons, activation functions, loss functions, backpropagation, SGD and Adam optimizers, tensors, autograd, nn.Module, DataLoader, a full GPU training loop, CNNs for images, transfer learning with pretrained ResNet, and saving and loading models.",
  readTime: "52 min read",
  difficulty: "Intermediate",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. Introduction: From scikit-learn to Deep Learning — Why Neural Networks and PyTorch Matter",
      content: `In Lectures 3 and 4 you trained models with scikit-learn: logistic regression, random forests, k-means, PCA. Those models work beautifully on tabular data with a few hundred hand-crafted features. They fall apart on raw images, audio and text, where the useful features (edges, shapes, word meanings) are not in the columns — they have to be **learned** from the data. That is exactly what a **neural network** does: it stacks many simple computations (layers) and tunes millions of parameters so the network discovers its own features. When the stack is deep, we call it **deep learning**.
**PyTorch** is the library almost every modern AI team uses to build these networks. Hugging Face Transformers, Stable Diffusion, Llama, Whisper and most research papers are written in PyTorch. If you want to fine-tune an LLM, write a custom loss, or understand what a "tensor of shape (batch, seq_len, hidden)" means in a Transformer, PyTorch fluency is non-negotiable. The good news for a JavaScript or Python developer: PyTorch code reads like ordinary Python. There is no graph-compilation ceremony; you write a function, it runs, you can print any intermediate value, and \`pdb\` works.
This lecture is the bridge between classical ML and the Transformer lecture that follows. By the end you will be able to: explain what a neuron, a layer and an activation function do; describe backpropagation and gradient descent in plain words and then in code; build a model with \`nn.Module\`; feed it data with \`DataLoader\`; run a correct training loop on a GPU; build a convolutional network for images; adapt a pretrained ResNet to your own dataset with transfer learning; and save and reload a trained model for production.
**Setup:** install PyTorch 2.x with \`pip install torch torchvision\`. If you have an NVIDIA GPU, use the install command generator on the official PyTorch website (pytorch.org, "Get Started") to pick the matching CUDA build — the exact command changes with each release, so do not copy one from an old blog post. Apple Silicon Macs get GPU acceleration automatically through the \`mps\` backend. Every snippet in this lecture also runs on a plain CPU, just slower.`,
      codeSnippet: `# check_setup.py — verify the installation
import torch, torchvision

print("PyTorch:", torch.__version__)          # e.g. 2.x.y
print("torchvision:", torchvision.__version__)
print("CUDA available:", torch.cuda.is_available())
print("MPS (Apple) available:", torch.backends.mps.is_available())

if torch.cuda.is_available():
    print("GPU:", torch.cuda.get_device_name(0))

# Pick the best device once and reuse it everywhere
device = (
    "cuda" if torch.cuda.is_available()
    else "mps" if torch.backends.mps.is_available()
    else "cpu"
)
print("Using device:", device)`
    },
    {
      heading: "2. Neurons, Layers and the Forward Pass: How a Neural Network Computes",
      content: `Start with one **neuron**. It takes a list of inputs \`x = [x1, x2, ..., xn]\`, multiplies each by a **weight** \`w\`, adds everything up with a **bias** \`b\`, and passes the sum through an **activation function** \`f\`: \`output = f(w1*x1 + w2*x2 + ... + wn*xn + b)\`. That is literally logistic regression when \`f\` is the sigmoid. A neuron is a tiny linear model with a non-linear squash at the end.
A **layer** is just many neurons that all look at the same inputs. If a layer has 64 neurons and 10 inputs, it owns a weight matrix \`W\` of shape (10, 64) and a bias vector of length 64, and computes \`f(x @ W + b)\` in one matrix multiplication. PyTorch calls this \`nn.Linear(10, 64)\` (a "fully connected" or "dense" layer). Stacking layers makes a **multi-layer perceptron (MLP)**: the output of layer 1 becomes the input of layer 2, and so on, until the final layer produces the prediction.
The **forward pass** is the act of pushing data through the layers from input to output. For a house-price model it might be: 8 input features → hidden layer of 64 → hidden layer of 32 → 1 output (the price). For a 10-class image classifier the last layer has 10 outputs, one score (called a **logit**) per class.
Why does stacking help? One linear layer can only draw straight decision boundaries. With a non-linear activation between layers, the first layer can learn simple patterns (in images: edges), the next combines them into more abstract patterns (corners, textures), and deeper layers combine those into objects. This hierarchy of learned features is the whole reason deep learning beats manual feature engineering on perception tasks.
The code below builds a 2-layer network by hand in NumPy so you can see that there is nothing magical: it is matrix multiplication, addition and an elementwise function. Keep an eye on the **shapes** — shape errors are the most common bug in deep learning, and reasoning about them is a core skill.`,
      codeSnippet: `# forward_pass_numpy.py — a 2-layer network with no framework at all
import numpy as np

rng = np.random.default_rng(42)

# A batch of 4 examples, each with 3 features (e.g. area, bedrooms, age)
X = rng.normal(size=(4, 3))              # shape (4, 3)

# Layer 1: 3 inputs -> 5 hidden neurons
W1 = rng.normal(size=(3, 5)) * 0.1       # shape (3, 5)
b1 = np.zeros(5)                         # shape (5,)

# Layer 2: 5 hidden -> 1 output (a regression value)
W2 = rng.normal(size=(5, 1)) * 0.1       # shape (5, 1)
b2 = np.zeros(1)

def relu(z):
    return np.maximum(0, z)

# Forward pass
z1 = X @ W1 + b1                         # (4, 3) @ (3, 5) -> (4, 5)
h1 = relu(z1)                            # activation keeps shape (4, 5)
y_hat = h1 @ W2 + b2                     # (4, 5) @ (5, 1) -> (4, 1)

print("hidden shape:", h1.shape)         # (4, 5)
print("output shape:", y_hat.shape)      # (4, 1)
print("predictions:", y_hat.ravel())     # 4 numbers, one per example

# Total trainable parameters: 3*5 + 5 + 5*1 + 1 = 26
n_params = W1.size + b1.size + W2.size + b2.size
print("parameters:", n_params)           # 26`
    },
    {
      heading: "3. Activation Functions: ReLU, Sigmoid, Tanh, Softmax and GELU Explained",
      content: `Without an activation function, stacking linear layers is pointless: a linear function of a linear function is still linear, so a 100-layer network would collapse into one straight line. **Activation functions** inject non-linearity between layers, and choosing the right one for the right place is part of every architecture.
• **ReLU** (\`max(0, z)\`) — the default for hidden layers. It is cheap, does not saturate for positive inputs, and trains fast. Its one flaw is the "dying ReLU" problem: a neuron whose input is always negative outputs 0 forever and stops learning. Variants like **LeakyReLU** (a small slope for negative inputs) fix this.
• **Sigmoid** (squashes to 0–1) — used only at the **output** of a binary classifier to produce a probability. Avoid it in hidden layers: its gradient is at most 0.25, so gradients shrink layer after layer (the **vanishing gradient** problem) and deep networks stop learning.
• **Tanh** (squashes to −1 to 1) — zero-centred, historically used in RNNs/LSTMs; still saturates at the extremes.
• **Softmax** — turns a vector of logits into probabilities that sum to 1. Used at the output of a multi-class classifier. In PyTorch you usually do not apply it yourself, because \`nn.CrossEntropyLoss\` applies log-softmax internally and expects raw logits.
• **GELU** — a smooth cousin of ReLU used in BERT, GPT and nearly every modern Transformer. You will meet it again in Lecture 6.
Rule of thumb: ReLU (or GELU) in hidden layers; nothing or sigmoid/softmax at the output depending on the task; never put sigmoid in the middle of a deep network.`,
      codeSnippet: `# activations.py
import torch
import torch.nn.functional as F

z = torch.tensor([-2.0, -0.5, 0.0, 0.5, 2.0])

print("ReLU   :", F.relu(z))
# tensor([0.0000, 0.0000, 0.0000, 0.5000, 2.0000])
print("Leaky  :", F.leaky_relu(z, negative_slope=0.1))
# tensor([-0.2000, -0.0500, 0.0000, 0.5000, 2.0000])
print("Sigmoid:", torch.sigmoid(z))
# tensor([0.1192, 0.3775, 0.5000, 0.6225, 0.8808])
print("Tanh   :", torch.tanh(z))
# tensor([-0.9640, -0.4621, 0.0000, 0.4621, 0.9640])
print("GELU   :", F.gelu(z))
# tensor([-0.0455, -0.1543, 0.0000, 0.3457, 1.9545])

# Softmax over a vector of class logits -> probabilities summing to 1
logits = torch.tensor([2.0, 1.0, 0.1])
probs = torch.softmax(logits, dim=0)
print("Softmax:", probs, "sum =", probs.sum().item())
# tensor([0.6590, 0.2424, 0.0986]) sum = 1.0`
    },
    {
      heading: "4. Loss Functions: MSE, Cross-Entropy and BCEWithLogits — Measuring How Wrong the Network Is",
      content: `A **loss function** turns "how wrong were the predictions?" into a single number the network can minimise. Training is nothing more than repeatedly nudging the weights so this number goes down. Pick the loss by task:
• **Regression → \`nn.MSELoss\`** (mean squared error). Predicting a flat price of ₹85 lakh when the truth is ₹80 lakh gives an error of 5, squared to 25. Squaring punishes big mistakes heavily; if your data has outliers, \`nn.L1Loss\` (absolute error) or \`nn.HuberLoss\` is more robust.
• **Binary classification → \`nn.BCEWithLogitsLoss\`**. It combines a sigmoid and binary cross-entropy in one numerically stable step. Feed it the **raw logit** (one number per example), not a probability. Cross-entropy heavily penalises confident wrong answers: predicting 0.01 for a positive example costs about 4.6, while predicting 0.9 costs only 0.1.
• **Multi-class classification → \`nn.CrossEntropyLoss\`**. Expects logits of shape (batch, num_classes) and integer labels of shape (batch,) with values 0 to num_classes−1. Internally it applies log-softmax, so **do not add a softmax layer yourself** — doing so makes the loss flat and the model trains terribly.
• **Multi-label classification** (one image can be both "beach" and "sunset") → \`nn.BCEWithLogitsLoss\` with a float target vector of 0s and 1s.
Class imbalance: both BCE and cross-entropy accept a \`weight\` (or \`pos_weight\`) argument to up-weight rare classes, the deep-learning equivalent of \`class_weight="balanced"\` from Lecture 3.
The loss value is averaged over the batch by default (\`reduction="mean"\`), so the number you print is comparable regardless of batch size.`,
      codeSnippet: `# losses.py
import torch
import torch.nn as nn

# Regression: 3 flat prices in lakh rupees
pred = torch.tensor([85.0, 42.0, 120.0])
true = torch.tensor([80.0, 45.0, 118.0])
print("MSE:", nn.MSELoss()(pred, true).item())        # (25 + 9 + 4) / 3 = 12.67
print("L1 :", nn.L1Loss()(pred, true).item())         # (5 + 3 + 2) / 3 = 3.33

# Binary classification: raw logits, float targets
logits = torch.tensor([2.0, -1.0, 0.3])
labels = torch.tensor([1.0, 0.0, 1.0])
print("BCEWithLogits:", nn.BCEWithLogitsLoss()(logits, labels).item())  # ~0.33

# Multi-class: logits (batch=2, classes=3), integer targets
logits = torch.tensor([[2.0, 0.5, 0.1],     # confident & right (class 0)
                       [0.2, 0.3, 2.5]])    # confident & wrong (true class 0)
labels = torch.tensor([0, 0])
ce = nn.CrossEntropyLoss(reduction="none")(logits, labels)
print("per-example CE:", ce)                 # tensor([0.2395, 2.5128])
print("mean CE:", ce.mean().item())          # ~1.38

# Up-weight a rare positive class (e.g. fraud = 1 in 50)
pos_weight = torch.tensor([49.0])
bce_w = nn.BCEWithLogitsLoss(pos_weight=pos_weight)`
    },
    {
      heading: "5. Backpropagation, Gradient Descent and Optimizers (SGD, Momentum, Adam)",
      content: `Now the core idea of all deep learning. You have a loss number and millions of weights. Which weight should change, in which direction, and by how much? The answer is the **gradient**: for each weight, the derivative of the loss with respect to that weight tells you "if I increase this weight slightly, the loss goes up by this much". Move every weight a small step **against** its gradient and the loss falls. Repeat thousands of times. That is **gradient descent**. The step size is the **learning rate** — too big and you overshoot and diverge; too small and training takes forever.
**Backpropagation** is simply the efficient way to compute all those gradients at once. Because the network is a chain of functions (layer 1 → activation → layer 2 → loss), the chain rule of calculus lets us compute the gradient of the loss with respect to the last layer first, then pass that "blame" backwards to the previous layer, and so on. One forward pass plus one backward pass gives every gradient, with roughly twice the cost of the forward pass. You never write this by hand — PyTorch's **autograd** does it — but you must understand it to debug vanishing/exploding gradients.
**Optimizers** decide how to use the gradient:
• **SGD** (stochastic gradient descent) — \`w = w - lr * grad\`, computed on a mini-batch rather than the whole dataset. "Stochastic" means the batch gives a noisy estimate of the true gradient, which is fine and even helps escape bad regions.
• **SGD with momentum** — keeps a running average of past gradients, like a ball rolling downhill. It smooths the noise and accelerates through flat regions. \`momentum=0.9\` is the standard value for vision models.
• **Adam** — adapts the learning rate per parameter using running averages of the gradient (first moment) and the squared gradient (second moment). It is forgiving about the learning rate and is the default choice for Transformers and most new projects. \`lr=1e-3\` is the usual starting point; \`AdamW\` is the variant with correct weight decay (regularization) that LLM training uses.
Together with a **learning-rate scheduler** (reduce the lr over time, e.g. \`CosineAnnealingLR\` or \`OneCycleLR\`), these are the knobs you will tune most often.`,
      codeSnippet: `# gradient_descent.py — fit y = 3x + 2 three ways
import torch

torch.manual_seed(0)
x = torch.linspace(-1, 1, 100).unsqueeze(1)         # (100, 1)
y = 3 * x + 2 + 0.1 * torch.randn(100, 1)           # noisy line

# ---- 1. Manual gradient descent (what every optimizer does inside) ----
w = torch.zeros(1, requires_grad=True)
b = torch.zeros(1, requires_grad=True)
lr = 0.1
for step in range(200):
    y_hat = x * w + b
    loss = ((y_hat - y) ** 2).mean()                # MSE
    loss.backward()                                 # backprop: fills w.grad, b.grad
    with torch.no_grad():                           # don't track this update
        w -= lr * w.grad
        b -= lr * b.grad
    w.grad.zero_(); b.grad.zero_()                  # gradients accumulate otherwise!
print(f"manual   : w={w.item():.3f} b={b.item():.3f} loss={loss.item():.4f}")
# manual   : w=2.994 b=1.999 loss=0.0096

# ---- 2. Same thing with torch.optim.SGD ----
w = torch.zeros(1, requires_grad=True); b = torch.zeros(1, requires_grad=True)
opt = torch.optim.SGD([w, b], lr=0.1, momentum=0.9)
for step in range(200):
    loss = ((x * w + b - y) ** 2).mean()
    opt.zero_grad()
    loss.backward()
    opt.step()
print(f"SGD+mom  : w={w.item():.3f} b={b.item():.3f}")

# ---- 3. Adam: adaptive per-parameter learning rates ----
w = torch.zeros(1, requires_grad=True); b = torch.zeros(1, requires_grad=True)
opt = torch.optim.Adam([w, b], lr=0.05)
for step in range(200):
    loss = ((x * w + b - y) ** 2).mean()
    opt.zero_grad(); loss.backward(); opt.step()
print(f"Adam     : w={w.item():.3f} b={b.item():.3f}")`
    },
    {
      heading: "6. PyTorch Tensors and Autograd: The Two Building Blocks of Every Model",
      content: `A **tensor** is PyTorch's n-dimensional array: a 0-d tensor is a scalar, 1-d a vector, 2-d a matrix, and a batch of RGB images is a 4-d tensor of shape (batch, channels, height, width). If you know NumPy you already know 90% of the tensor API: indexing, broadcasting, \`.reshape\`, \`.sum(dim=...)\`, \`@\` for matrix multiply. Tensors add three things NumPy lacks: they can live on a **GPU** (\`.to("cuda")\`), they carry a **dtype** you must manage (\`float32\` for most work, \`int64\` for class labels, \`float16\`/\`bfloat16\` for mixed precision), and they can record the operations performed on them for **autograd**.
Shape manipulation you will use daily: \`.view\` / \`.reshape\` (change shape without copying), \`.unsqueeze(dim)\` (add a dimension of size 1, e.g. turn one image into a batch of one), \`.squeeze()\` (remove size-1 dims), \`.permute\` (reorder axes, e.g. HWC image to CHW), and \`.flatten(1)\` (keep the batch dim, flatten the rest — needed before a Linear layer after convolutions).
**Autograd** is the engine behind backpropagation. Create a tensor with \`requires_grad=True\` and PyTorch builds a dynamic computation graph as you compute with it. Call \`.backward()\` on a scalar result and every leaf tensor in the graph gets a \`.grad\` attribute holding the derivative. Three rules keep you out of trouble: gradients **accumulate** across calls, so zero them before each backward pass; wrap inference in \`torch.no_grad()\` (or the faster \`torch.inference_mode()\`) so the graph is not built; and call \`.detach()\` or \`.item()\` when you want a plain value for logging, otherwise you keep the whole graph alive in memory and leak GPU RAM.
Conversions: \`torch.from_numpy(arr)\` shares memory with the NumPy array; \`tensor.cpu().numpy()\` goes back (the tensor must be on CPU and detached).`,
      codeSnippet: `# tensors_autograd.py
import torch
import numpy as np

# --- Creating tensors ---
a = torch.tensor([[1.0, 2.0], [3.0, 4.0]])      # from data, dtype float32
z = torch.zeros(2, 3); o = torch.ones(3); r = torch.randn(2, 2)
labels = torch.tensor([0, 2, 1])                # int64 -> right dtype for CrossEntropyLoss
print(a.shape, a.dtype, labels.dtype)           # torch.Size([2, 2]) torch.float32 torch.int64

# --- Shapes ---
img = torch.randn(28, 28)                       # one grayscale image
batch = img.unsqueeze(0).unsqueeze(0)           # (1, 1, 28, 28): batch of one, 1 channel
print(batch.shape)
flat = batch.flatten(1)                         # (1, 784) -> ready for nn.Linear(784, ...)
hwc = torch.randn(224, 224, 3)                  # image as loaded by PIL/NumPy
chw = hwc.permute(2, 0, 1)                      # (3, 224, 224) as PyTorch expects
print(flat.shape, chw.shape)

# --- NumPy interop & devices ---
arr = np.arange(6, dtype=np.float32).reshape(2, 3)
t = torch.from_numpy(arr)                        # shares memory
device = "cuda" if torch.cuda.is_available() else "cpu"
t = t.to(device)                                 # move to GPU if present
back = t.cpu().numpy()

# --- Autograd: d/dx of y = x^2 + 3x at x = 2 is 2x + 3 = 7 ---
x = torch.tensor(2.0, requires_grad=True)
y = x ** 2 + 3 * x
y.backward()
print("dy/dx:", x.grad)                          # tensor(7.)

# Gradients accumulate: a second backward adds another 7
y = x ** 2 + 3 * x
y.backward()
print("after 2nd backward:", x.grad)             # tensor(14.)  <- why we zero grads
x.grad.zero_()

# No graph during inference
with torch.inference_mode():
    out = x ** 2
print(out.requires_grad)                         # False`
    },
    {
      heading: "7. Building Models with nn.Module and nn.Sequential",
      content: `\`nn.Module\` is the base class for every model, layer and loss in PyTorch. You subclass it, create layers in \`__init__\`, and describe the forward pass in \`forward()\`. That is the entire contract. Because \`forward\` is plain Python you can use \`if\` statements, loops, print statements and any shape logic you like — this "define by run" style is why researchers love PyTorch.
What \`nn.Module\` gives you for free:
• **Parameter tracking** — every \`nn.Linear\`, \`nn.Conv2d\` etc. assigned as an attribute registers its weights, so \`model.parameters()\` returns all of them for the optimizer and \`model.state_dict()\` returns them for saving.
• **Device moves** — \`model.to(device)\` moves every parameter at once.
• **Train / eval modes** — \`model.train()\` and \`model.eval()\` toggle behaviour of layers like \`nn.Dropout\` (randomly zeroes activations during training to regularize) and \`nn.BatchNorm\` (uses batch statistics in training, running averages in eval). Forgetting \`model.eval()\` before validation is one of the most common bugs in PyTorch.
• **Composition** — modules nest. A ResNet is a Module made of block Modules made of Conv Modules.
For simple feed-forward stacks, \`nn.Sequential\` lets you list layers without writing a class. For anything with branches, skip connections or multiple inputs, write a class.
Never call \`model.forward(x)\` directly; call \`model(x)\`. The \`__call__\` wrapper runs hooks and is what the rest of the ecosystem expects. Use \`sum(p.numel() for p in model.parameters())\` to count parameters — a useful sanity check against the architecture you think you built.`,
      codeSnippet: `# model.py — an MLP for tabular churn prediction
import torch
import torch.nn as nn

class ChurnMLP(nn.Module):
    def __init__(self, n_features: int, hidden: int = 64, dropout: float = 0.2):
        super().__init__()                              # ALWAYS call this first
        self.fc1 = nn.Linear(n_features, hidden)
        self.bn1 = nn.BatchNorm1d(hidden)
        self.fc2 = nn.Linear(hidden, hidden // 2)
        self.drop = nn.Dropout(dropout)
        self.out = nn.Linear(hidden // 2, 1)            # 1 logit for binary classification

    def forward(self, x):
        x = torch.relu(self.bn1(self.fc1(x)))
        x = self.drop(torch.relu(self.fc2(x)))
        return self.out(x).squeeze(1)                   # shape (batch,) to match labels

# Same idea with nn.Sequential (no custom class needed)
mlp = nn.Sequential(
    nn.Linear(20, 64), nn.ReLU(),
    nn.Linear(64, 32), nn.ReLU(),
    nn.Dropout(0.2),
    nn.Linear(32, 1),
)

model = ChurnMLP(n_features=20)
print(model)                                            # prints the layer tree
n_params = sum(p.numel() for p in model.parameters())
print("trainable parameters:", n_params)                # 3585

x = torch.randn(8, 20)                                  # batch of 8 customers
logits = model(x)                                       # call model(x), not model.forward(x)
print(logits.shape)                                     # torch.Size([8])
print("probabilities:", torch.sigmoid(logits).detach())`
    },
    {
      heading: "8. Datasets and DataLoader: Batching, Shuffling and Loading Data Efficiently",
      content: `Deep learning models train on **mini-batches**, not the whole dataset, because the dataset rarely fits in GPU memory and because noisy mini-batch gradients generalise better. PyTorch splits data handling into two classes:
• **\`Dataset\`** — answers two questions: \`__len__\` (how many examples?) and \`__getitem__(i)\` (give me example i as a tensor pair). You write this once per data source. For data already in memory, \`TensorDataset(X, y)\` does it for you. For images in folders, \`torchvision.datasets.ImageFolder\` reads a directory layout like \`data/train/cat/*.jpg\`, \`data/train/dog/*.jpg\` and assigns labels from folder names.
• **\`DataLoader\`** — wraps a Dataset and handles batching (\`batch_size\`), shuffling each epoch (\`shuffle=True\` for training, \`False\` for validation), parallel loading in background processes (\`num_workers\`), and speeding up CPU-to-GPU copies (\`pin_memory=True\` when using CUDA). Iterating over it yields \`(X_batch, y_batch)\` tensors.
Practical details that save hours of debugging: on **Windows** (and macOS), \`num_workers > 0\` requires your training code to be inside an \`if __name__ == "__main__":\` guard, because worker processes re-import your script. A \`transform\` passed to a Dataset runs per example on the fly — this is where **data augmentation** (random crops, flips, colour jitter) lives, and it is the cheapest way to improve an image model. Normalise inputs: scaling pixel values to roughly zero mean and unit variance makes optimization dramatically easier, exactly as \`StandardScaler\` did in Lecture 3, and the scaler statistics must come from the training set only.
Batch size: 32–256 is typical. Larger batches use the GPU better but can generalise slightly worse and need a higher learning rate. If you get a CUDA out-of-memory error, the batch size is the first thing to reduce.`,
      codeSnippet: `# data.py — a custom Dataset + DataLoader for tabular data
import torch
from torch.utils.data import Dataset, DataLoader, TensorDataset
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

class CustomerDataset(Dataset):
    """Each item is (features float32, label float32)."""
    def __init__(self, X, y):
        self.X = torch.tensor(X, dtype=torch.float32)
        self.y = torch.tensor(y, dtype=torch.float32)

    def __len__(self):
        return len(self.X)

    def __getitem__(self, idx):
        return self.X[idx], self.y[idx]

if __name__ == "__main__":
    X, y = make_classification(n_samples=5000, n_features=20, weights=[0.8, 0.2], random_state=42)
    X_tr, X_val, y_tr, y_val = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

    scaler = StandardScaler().fit(X_tr)              # fit on train ONLY (no leakage)
    X_tr, X_val = scaler.transform(X_tr), scaler.transform(X_val)

    train_ds = CustomerDataset(X_tr, y_tr)
    val_ds = CustomerDataset(X_val, y_val)
    # Shortcut for in-memory tensors: TensorDataset(torch.tensor(X_tr), torch.tensor(y_tr))

    train_loader = DataLoader(train_ds, batch_size=64, shuffle=True, num_workers=2, pin_memory=True)
    val_loader = DataLoader(val_ds, batch_size=256, shuffle=False)

    print(len(train_ds), "train rows,", len(train_loader), "batches per epoch")
    # 4000 train rows, 63 batches per epoch
    xb, yb = next(iter(train_loader))
    print(xb.shape, yb.shape, xb.dtype)              # torch.Size([64, 20]) torch.Size([64]) torch.float32`
    },
    {
      heading: "9. The Full PyTorch Training Loop with GPU Usage, Validation and Mixed Precision",
      content: `Every PyTorch training script, from a toy MLP to a billion-parameter LLM, has the same five-line heartbeat inside the batch loop: **move the batch to the device → forward pass → compute loss → \`optimizer.zero_grad()\` + \`loss.backward()\` → \`optimizer.step()\`**. Around that heartbeat sit an epoch loop, a validation pass, metric logging and checkpointing. Write it once as reusable \`train_one_epoch\` and \`evaluate\` functions and you will reuse them for the rest of your career.
**GPU usage** comes down to one discipline: the model and every batch must be on the same device. \`model.to(device)\` once; \`X.to(device), y.to(device)\` for each batch. Mixing devices raises the familiar "Expected all tensors to be on the same device" error. With CUDA, pass \`non_blocking=True\` to overlap the copy with computation when the loader uses \`pin_memory\`.
**Validation** runs under \`torch.inference_mode()\` with \`model.eval()\` so Dropout is off, BatchNorm uses its running statistics, and no computation graph is built. Switch back with \`model.train()\` before the next epoch. Track both training and validation loss: training loss falling while validation loss rises is overfitting (Lecture 4), and the fix is more data augmentation, more dropout, weight decay, or early stopping (keep the checkpoint with the best validation metric).
**Mixed precision** (\`torch.autocast\` plus \`torch.amp.GradScaler\`) runs most matrix multiplications in float16/bfloat16, giving 2–3x speed-ups and halving memory on modern NVIDIA GPUs with almost no accuracy change. It is the norm for training Transformers. The snippet shows it as an optional block; on CPU the code simply runs in float32.
Finally, **\`torch.compile(model)\`** (PyTorch 2.x) can fuse operations for an additional speed-up on supported hardware after the first slow "warm-up" iteration; treat it as an optimization to try once the plain loop works.`,
      codeSnippet: `# train.py — reusable training & evaluation functions (continues data.py + model.py)
import torch
import torch.nn as nn

device = "cuda" if torch.cuda.is_available() else "cpu"
use_amp = device == "cuda"                              # mixed precision only on CUDA

def train_one_epoch(model, loader, loss_fn, optimizer, scaler=None):
    model.train()
    total_loss, n = 0.0, 0
    for X, y in loader:
        X, y = X.to(device, non_blocking=True), y.to(device, non_blocking=True)
        optimizer.zero_grad(set_to_none=True)
        with torch.autocast(device_type=device, dtype=torch.float16, enabled=use_amp):
            logits = model(X)
            loss = loss_fn(logits, y)
        if scaler is not None:                          # AMP path
            scaler.scale(loss).backward()
            scaler.unscale_(optimizer)
            torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
            scaler.step(optimizer); scaler.update()
        else:                                           # plain fp32 path
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
            optimizer.step()
        total_loss += loss.item() * len(y); n += len(y)
    return total_loss / n

@torch.inference_mode()
def evaluate(model, loader, loss_fn):
    model.eval()
    total_loss, correct, n = 0.0, 0, 0
    for X, y in loader:
        X, y = X.to(device), y.to(device)
        logits = model(X)
        total_loss += loss_fn(logits, y).item() * len(y)
        correct += ((logits > 0).float() == y).sum().item()   # sigmoid(logit) > 0.5
        n += len(y)
    return total_loss / n, correct / n

if __name__ == "__main__":
    from data import CustomerDataset          # reuse the pieces above (or paste them here)
    from model import ChurnMLP
    # ... build train_loader / val_loader exactly as in data.py ...

    model = ChurnMLP(n_features=20).to(device)
    loss_fn = nn.BCEWithLogitsLoss(pos_weight=torch.tensor([4.0], device=device))
    optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-2)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=20)
    scaler = torch.amp.GradScaler("cuda") if use_amp else None

    best_acc = 0.0
    for epoch in range(1, 21):
        tr_loss = train_one_epoch(model, train_loader, loss_fn, optimizer, scaler)
        val_loss, val_acc = evaluate(model, val_loader, loss_fn)
        scheduler.step()
        if val_acc > best_acc:                           # early-stopping style checkpoint
            best_acc = val_acc
            torch.save(model.state_dict(), "churn_best.pt")
        print(f"epoch {epoch:2d}  train {tr_loss:.4f}  val {val_loss:.4f}  acc {val_acc:.3f}")
    # epoch  1  train 0.6212  val 0.4871  acc 0.861
    # ...
    # epoch 20  train 0.2904  val 0.3115  acc 0.912   (numbers vary with the seed)`
    },
    {
      heading: "10. Convolutional Neural Networks (CNNs) for Images: Convolutions, Pooling and a Simple Classifier",
      content: `An MLP on a 224×224 colour image would need 150,528 inputs; a first hidden layer of 512 neurons alone would carry 77 million weights, and it would treat the pixel at (10,10) and the pixel at (11,10) as unrelated. **Convolutional neural networks** fix both problems with one idea: slide a small **filter** (kernel), say 3×3, across the image and compute a dot product at each position. The same 9 weights are reused everywhere (**weight sharing**), so a layer that detects a vertical edge in the corner also detects it in the centre (**translation invariance**). Each filter produces a **feature map**; a conv layer with 32 filters produces 32 feature maps, i.e. an output of shape (32, H, W).
\`nn.Conv2d(in_channels, out_channels, kernel_size, stride, padding)\`: \`padding=1\` with a 3×3 kernel keeps the spatial size unchanged; \`stride=2\` halves it. The output size formula is \`(W − K + 2P) / S + 1\`. **Pooling** (\`nn.MaxPool2d(2)\`) halves height and width by keeping the maximum in each 2×2 window, making the representation smaller and slightly more robust to small shifts. Modern architectures often replace pooling with strided convolutions and add \`nn.BatchNorm2d\` after every conv to stabilise training.
A classic CNN is a stack of [Conv → BatchNorm → ReLU → Pool] blocks that progressively reduce spatial size while increasing channel count (3 → 32 → 64 → 128), followed by \`nn.AdaptiveAvgPool2d(1)\` or \`flatten\` and one or two Linear layers that produce the class logits. **Data augmentation** (random crops, horizontal flips) from \`torchvision.transforms.v2\` is essential because CNNs overfit small datasets quickly.
CNNs power far more than cat-vs-dog demos: Aadhaar-style document OCR, defect detection on factory lines, retinal scans in diagnostics, satellite crop monitoring, and the image encoder in multimodal LLMs. Even where Vision Transformers now lead benchmarks, CNNs remain the pragmatic choice for small datasets and edge devices.`,
      codeSnippet: `# cnn.py — a small CNN for 28x28 grayscale images (e.g. FashionMNIST, 10 classes)
import torch
import torch.nn as nn

class SimpleCNN(nn.Module):
    def __init__(self, num_classes: int = 10):
        super().__init__()
        self.features = nn.Sequential(
            # input (B, 1, 28, 28)
            nn.Conv2d(1, 32, kernel_size=3, padding=1),  # -> (B, 32, 28, 28)
            nn.BatchNorm2d(32), nn.ReLU(),
            nn.MaxPool2d(2),                             # -> (B, 32, 14, 14)
            nn.Conv2d(32, 64, kernel_size=3, padding=1), # -> (B, 64, 14, 14)
            nn.BatchNorm2d(64), nn.ReLU(),
            nn.MaxPool2d(2),                             # -> (B, 64, 7, 7)
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),                                # -> (B, 64*7*7 = 3136)
            nn.Dropout(0.3),
            nn.Linear(64 * 7 * 7, 128), nn.ReLU(),
            nn.Linear(128, num_classes),                 # -> (B, 10) logits
        )

    def forward(self, x):
        return self.classifier(self.features(x))

model = SimpleCNN()
x = torch.randn(16, 1, 28, 28)                           # batch of 16 images
print(model(x).shape)                                    # torch.Size([16, 10])
print("params:", sum(p.numel() for p in model.parameters()))   # 421,834

# Output-size sanity check for one conv: (28 - 3 + 2*1) / 1 + 1 = 28
conv = nn.Conv2d(1, 32, 3, stride=1, padding=1)
print(conv(x).shape)                                     # torch.Size([16, 32, 28, 28])
print("one 3x3 filter has", 3 * 3 * 1 + 1, "weights")     # 10, shared across all positions`
    },
    {
      heading: "11. Transfer Learning with Pretrained Models: Fine-Tuning a ResNet on Your Own Images",
      content: `Training a CNN from scratch needs hundreds of thousands of labelled images. Most real projects have a few hundred. **Transfer learning** solves this: take a network already trained on ImageNet (1.2 million images, 1,000 classes), keep its learned feature extractor (edges, textures, shapes are universal), and only train a new final layer for your classes. With 200 images per class you can reach 90%+ accuracy in minutes on a laptop — this is the single most practical technique in applied computer vision, and it is exactly the same idea that makes fine-tuning an LLM feasible in Lecture 7.
\`torchvision.models\` ships dozens of architectures with pretrained weights. The modern API is \`models.resnet18(weights=models.ResNet18_Weights.DEFAULT)\`; the \`weights\` enum also exposes \`.transforms()\`, the exact resize/crop/normalisation the model was trained with, which you must reuse on your data or accuracy collapses. Two strategies:
• **Feature extraction** — freeze every pretrained parameter (\`requires_grad = False\`), replace the final \`fc\` layer with \`nn.Linear(in_features, num_classes)\`, and train only that layer. Fast, needs little data, hard to overfit.
• **Fine-tuning** — after the new head is trained, unfreeze some or all layers and continue training with a **much smaller learning rate** (1e-4 or lower) so the pretrained weights move gently. Gives the best accuracy when you have a few thousand images or your domain (X-rays, satellite tiles) differs from ImageNet photos.
Pass only the trainable parameters to the optimizer. One subtlety: \`model.train()\` still lets the frozen backbone's BatchNorm layers update their running statistics on your data; with very small datasets, some practitioners keep the backbone in eval mode during training — try both and compare validation accuracy. The example below expects an \`ImageFolder\` layout: \`data/train/<class>/*.jpg\` and \`data/val/<class>/*.jpg\`. Larger models (ResNet50, EfficientNet, ConvNeXt, ViT) swap in with one line; check the torchvision docs for each model's accuracy and size before choosing.`,
      codeSnippet: `# transfer_learning.py — ResNet18 feature extraction on a custom image folder
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import datasets, models

device = "cuda" if torch.cuda.is_available() else "cpu"

# 1. Pretrained backbone + the exact preprocessing it was trained with
weights = models.ResNet18_Weights.DEFAULT
model = models.resnet18(weights=weights)
preprocess = weights.transforms()            # resize 256 -> center-crop 224 -> normalize

# 2. Freeze everything, then replace the head
for p in model.parameters():
    p.requires_grad = False
num_classes = 3                              # e.g. "saree", "kurta", "lehenga"
model.fc = nn.Linear(model.fc.in_features, num_classes)   # new layer: requires_grad=True
model = model.to(device)

# 3. Data: data/train/<class>/*.jpg and data/val/<class>/*.jpg
train_ds = datasets.ImageFolder("data/train", transform=preprocess)
val_ds = datasets.ImageFolder("data/val", transform=preprocess)
print(train_ds.classes)                      # ['kurta', 'lehenga', 'saree'] (alphabetical)

if __name__ == "__main__":
    train_loader = DataLoader(train_ds, batch_size=32, shuffle=True, num_workers=2)
    val_loader = DataLoader(val_ds, batch_size=64)

    # 4. Optimize ONLY the trainable parameters
    trainable = [p for p in model.parameters() if p.requires_grad]
    optimizer = torch.optim.Adam(trainable, lr=1e-3)
    loss_fn = nn.CrossEntropyLoss()

    for epoch in range(5):
        model.train()
        for X, y in train_loader:
            X, y = X.to(device), y.to(device)
            optimizer.zero_grad()
            loss_fn(model(X), y).backward()
            optimizer.step()
        model.eval(); correct = n = 0
        with torch.inference_mode():
            for X, y in val_loader:
                X, y = X.to(device), y.to(device)
                correct += (model(X).argmax(1) == y).sum().item(); n += len(y)
        print(f"epoch {epoch+1}: val acc {correct/n:.3f}")

    # 5. Optional fine-tuning: unfreeze the last block with a tiny learning rate
    for p in model.layer4.parameters():
        p.requires_grad = True
    optimizer = torch.optim.Adam(
        [{"params": model.layer4.parameters(), "lr": 1e-5},
         {"params": model.fc.parameters(), "lr": 1e-4}]
    )
    # ... run a few more epochs with the same loop ...`
    },
    {
      heading: "12. Saving, Loading and Checkpointing PyTorch Models for Production",
      content: `A trained model is worthless if you cannot reload it next week. PyTorch has one recommended way: save the **\`state_dict\`**, a plain dictionary mapping parameter names (\`"fc1.weight"\`, \`"fc1.bias"\`, ...) to tensors. \`torch.save(model.state_dict(), "model.pt")\` writes it; to load, re-create the architecture in code, then \`model.load_state_dict(torch.load("model.pt"))\`. This decouples weights from code, survives refactors, and is what Hugging Face, torchvision and every serious codebase do. Saving the entire model object (\`torch.save(model)\`) pickles the class path too, which breaks the moment you rename a file — avoid it.
Important details:
• **\`weights_only\`** — since PyTorch 2.6, \`torch.load\` defaults to \`weights_only=True\`, which refuses to unpickle arbitrary objects. This is a security feature (a malicious \`.pt\` file could otherwise execute code). State dicts load fine; if a checkpoint contains custom objects you trust, pass \`weights_only=False\` explicitly.
• **\`map_location\`** — a model saved on a GPU will fail to load on a CPU-only server unless you pass \`map_location="cpu"\` (or the target device).
• **\`model.eval()\`** after loading, always, before inference.
• **Checkpoints for resuming** — save a dict with the model state, optimizer state, scheduler state, epoch number and best metric, so a crashed 10-hour training run resumes exactly where it stopped. Save every epoch and keep the best one separately.
• **Hugging Face safetensors** is a popular alternative format for weights that cannot execute code and loads faster; you will see it in Lecture 7.
For deployment beyond Python, \`torch.onnx.export\` produces an ONNX file runnable in ONNX Runtime (including from Node.js — handy for a Next.js API route) and in browsers. Keep the preprocessing (scaler statistics, image normalisation) versioned alongside the weights; a mismatched scaler silently ruins predictions.`,
      codeSnippet: `# save_load.py
import torch
from model import ChurnMLP                      # the architecture from section 7

device = "cuda" if torch.cuda.is_available() else "cpu"
model = ChurnMLP(n_features=20).to(device)
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3)

# --- 1. Save only the weights (recommended) ---
torch.save(model.state_dict(), "churn_model.pt")

# --- 2. Load into a fresh instance of the same architecture ---
model2 = ChurnMLP(n_features=20)
state = torch.load("churn_model.pt", map_location="cpu")   # weights_only=True by default (PyTorch >= 2.6)
model2.load_state_dict(state)
model2.eval()                                               # Dropout/BatchNorm into inference mode
with torch.inference_mode():
    probs = torch.sigmoid(model2(torch.randn(3, 20)))
print(probs)

# --- 3. Full checkpoint for resuming training ---
checkpoint = {
    "epoch": 7,
    "model_state": model.state_dict(),
    "optimizer_state": optimizer.state_dict(),
    "best_val_acc": 0.912,
}
torch.save(checkpoint, "checkpoint_epoch7.pt")

ckpt = torch.load("checkpoint_epoch7.pt", map_location=device)
model.load_state_dict(ckpt["model_state"])
optimizer.load_state_dict(ckpt["optimizer_state"])
start_epoch = ckpt["epoch"] + 1
print("resuming from epoch", start_epoch)

# --- 4. Export to ONNX for non-Python runtimes (ONNX Runtime, browsers, Node.js) ---
model.eval()
dummy = torch.randn(1, 20, device=device)
torch.onnx.export(model, dummy, "churn_model.onnx",
                  input_names=["features"], output_names=["logit"],
                  dynamic_axes={"features": {0: "batch"}, "logit": {0: "batch"}})
print("exported churn_model.onnx")`
    },
    {
      heading: "13. Real-World Use Cases: How Deep Learning with PyTorch Is Used in Production",
      content: `Here is how the pieces from this lecture show up in real engineering teams, so you can connect each API to a job it does.
• **Document and KYC processing (fintech, banks)** — a CNN or a pretrained vision backbone classifies uploaded documents (PAN card, Aadhaar, bank statement) and flags blurry or tampered scans before OCR. Transfer learning from ImageNet with a few thousand labelled scans is the standard starting point; the model is exported to ONNX and served behind a FastAPI or Next.js route.
• **Quality inspection on manufacturing lines** — cameras photograph every part; a CNN trained with heavy augmentation detects scratches, missing components or misalignment in milliseconds. \`BCEWithLogitsLoss\` with \`pos_weight\` handles the extreme defect/non-defect imbalance.
• **Medical imaging** — retinal fundus photographs, chest X-rays and dermatology images are classified or segmented with fine-tuned CNNs or Vision Transformers; the training loop, mixed precision and checkpointing patterns here are what those pipelines use, with stricter cross-validation from Lecture 4.
• **Recommendation and ranking** — e-commerce and OTT platforms train MLPs on user and item features (often with embedding layers for categorical IDs) using exactly the \`Dataset\`/\`DataLoader\`/\`nn.Module\` loop above, at a scale of billions of rows, with the model refreshed daily.
• **Tabular deep learning for fraud and credit** — when there are tens of millions of rows and rich interactions, an MLP with BatchNorm and dropout can edge out gradient boosting; teams run both and ensemble.
• **The foundation for LLM work** — every fine-tuning script for a Transformer (full fine-tuning, LoRA, RLHF) is a PyTorch training loop: \`model.train()\`, forward, \`CrossEntropyLoss\` over tokens, \`AdamW\`, gradient clipping, cosine schedule, checkpoints. Learning the loop on a 400k-parameter CNN means you will read a 7-billion-parameter fine-tuning script without fear.
• **Edge and mobile** — pruned/quantised CNNs run on phones and Raspberry Pis for offline crop-disease detection used by agritech startups across rural India; \`torch.export\`, ONNX and ExecuTorch are the deployment paths.`
    },
    {
      heading: "14. Common Mistakes in PyTorch Neural Network Training and How to Fix Them",
      content: `These are the bugs that cost beginners (and experienced engineers) the most hours. Each one is silent — the code runs, the numbers are just wrong.
• **Forgetting \`optimizer.zero_grad()\`** — gradients accumulate across batches, so updates grow larger each step and the loss explodes or oscillates. Fix: zero before every \`backward()\`. (Deliberate accumulation over several batches is a valid technique for simulating a larger batch size — but then you divide the loss accordingly.)
• **Applying softmax before \`nn.CrossEntropyLoss\`** — the loss already includes log-softmax; a double softmax squashes the logits and training crawls. Fix: output raw logits, apply softmax only when you need probabilities for display.
• **Wrong label dtype or shape** — \`CrossEntropyLoss\` wants \`int64\` class indices of shape (batch,), not one-hot floats; \`BCEWithLogitsLoss\` wants \`float32\` targets with the same shape as the logits. The error messages are cryptic ("expected scalar type Long") — check dtypes first.
• **Forgetting \`model.eval()\` for validation** (or \`model.train()\` afterwards) — Dropout stays active and BatchNorm keeps updating its statistics, so validation accuracy is noisy and lower than it should be, and reloaded models behave differently.
• **Device mismatch** — "Expected all tensors to be on the same device". Fix: move the model once and every batch inside the loop; create new tensors with \`device=device\`.
• **Memory leak from storing loss tensors** — \`losses.append(loss)\` keeps the whole computation graph alive. Fix: \`loss.item()\` or \`loss.detach()\`.
• **Learning rate far too high or too low** — loss becomes NaN (too high) or barely moves (too low). Fix: start with Adam at 1e-3 (1e-4 to 1e-5 when fine-tuning pretrained weights), use gradient clipping, and try a short LR range test.
• **Not normalising inputs** — raw pixel values 0–255 or rupee amounts in lakhs make optimization unstable. Fix: scale inputs; reuse the pretrained model's transforms for transfer learning.
• **Data leakage into validation** — fitting the scaler on all data, or augmenting before splitting. Fix: split first, fit transforms on train only (Lecture 4).
• **No seed, no reproducibility** — set \`torch.manual_seed\`, and know that GPU kernels can still be non-deterministic unless \`torch.use_deterministic_algorithms(True)\` is set (at a speed cost).`,
      codeSnippet: `# mistakes.py — wrong vs right, side by side
import torch, torch.nn as nn

model = nn.Linear(10, 3)
X, y = torch.randn(8, 10), torch.randint(0, 3, (8,))
loss_fn = nn.CrossEntropyLoss()
opt = torch.optim.Adam(model.parameters(), lr=1e-3)

# WRONG: softmax before CrossEntropyLoss
# loss = loss_fn(torch.softmax(model(X), dim=1), y)
# RIGHT: raw logits
loss = loss_fn(model(X), y)

# WRONG: one-hot float labels for CrossEntropyLoss
# y_bad = torch.nn.functional.one_hot(y, 3).float()
# RIGHT: int64 class indices (y above)

# WRONG: no zero_grad -> gradients pile up
# loss.backward(); opt.step()
# RIGHT:
opt.zero_grad(); loss.backward(); opt.step()

# WRONG: keeps the graph alive every step (GPU memory grows)
# history = []; history.append(loss)
# RIGHT:
history = []; history.append(loss.item())

# WRONG: validating in train mode (dropout on, BN updating)
# val_out = model(X)
# RIGHT:
model.eval()
with torch.inference_mode():
    val_out = model(X)
model.train()

# Reproducibility
torch.manual_seed(42)
if torch.cuda.is_available():
    torch.cuda.manual_seed_all(42)
print("ok")`
    },
    {
      heading: "15. Frequently Asked Questions about Neural Networks, Deep Learning and PyTorch",
      content: `**What is the difference between PyTorch and TensorFlow, and which should I learn in 2026?**
Both are complete deep-learning frameworks, but PyTorch dominates research, Hugging Face, and LLM tooling, and its eager, Pythonic style is easier to debug. TensorFlow/Keras remains common in some older production systems and mobile pipelines. For an AI engineer targeting LLM work, learn PyTorch first; the concepts transfer directly if you later need Keras.
**Do I need a GPU to learn deep learning with PyTorch?**
No. Every example in this lecture runs on a CPU; small CNNs train on FashionMNIST in a few minutes. For bigger models use free GPU time on Google Colab or Kaggle, or rent cloud GPUs by the hour. A GPU becomes essential only when you fine-tune large vision models or Transformers.
**What is the difference between an epoch, a batch and an iteration?**
An **epoch** is one full pass over the training set. A **batch** is the subset of examples processed in one forward/backward pass (e.g. 64 rows). An **iteration** is one optimizer step on one batch. With 4,000 rows and batch size 64, an epoch is 63 iterations.
**How do I choose the learning rate and optimizer?**
Start with Adam or AdamW at 1e-3 for training from scratch and 1e-4 to 1e-5 when fine-tuning pretrained weights. If loss is NaN, lower it by 10x; if loss barely moves after a few epochs, raise it. Add a cosine or one-cycle scheduler once the basic run works. SGD with momentum 0.9 and a higher lr (0.01–0.1) can beat Adam on large image datasets but needs more tuning.
**Why is my validation accuracy higher than training accuracy?**
Usually because Dropout and data augmentation are active during training and switched off during validation, which makes training batches artificially harder. A small gap in that direction is normal; a large one may mean validation data is easier or has leaked into training.
**What is the vanishing gradient problem and how is it solved?**
In deep networks with saturating activations (sigmoid/tanh), gradients shrink layer by layer during backpropagation until early layers stop learning. Solutions: ReLU-family activations, careful weight initialisation, BatchNorm/LayerNorm, and residual (skip) connections as in ResNet and Transformers.
**When should I use a CNN versus a Vision Transformer?**
CNNs are the better choice for small or medium datasets, edge devices and fast iteration; their built-in translation invariance is a strong prior. Vision Transformers need large pretraining datasets to shine but are now the backbone of most multimodal models. In practice, start with a pretrained CNN via transfer learning, then evaluate a pretrained ViT if accuracy plateaus.
**How many hidden layers and neurons should my network have?**
There is no formula. For tabular data, 2–3 hidden layers of 64–256 neurons with dropout is a strong baseline. For images, use a proven architecture (ResNet, EfficientNet) rather than inventing one. Scale up only when the model underfits (training loss stays high) and scale down or regularise when it overfits.`
    },
    {
      heading: "16. Interview Questions and Answers on Neural Networks, Backpropagation and PyTorch",
      content: `**Q1. Explain backpropagation in plain language.**
Backpropagation computes how much each weight contributed to the loss by applying the chain rule backwards through the network: it starts from the loss, computes the gradient for the output layer, then passes the gradient to the previous layer and so on. One forward pass plus one backward pass yields the gradient for every parameter, which the optimizer then uses to update the weights.
**Q2. Why do we need non-linear activation functions?**
A composition of linear functions is linear, so without activations a deep network could only represent a single linear map regardless of depth. Non-linearities such as ReLU let each layer bend the input space, allowing the network to approximate arbitrary complex functions.
**Q3. What is the difference between SGD and Adam?**
SGD updates every parameter with the same learning rate scaled by its gradient (optionally with momentum). Adam maintains per-parameter running averages of the gradient and squared gradient and uses them to adapt the step size for each parameter, which makes it robust to the choice of learning rate and sparse gradients. AdamW additionally decouples weight decay from the gradient update and is the standard for Transformers.
**Q4. What does \`optimizer.zero_grad()\` do and why is it necessary?**
It resets the \`.grad\` attribute of every parameter. PyTorch accumulates gradients by default (useful for gradient accumulation and RNNs), so without zeroing, each backward pass adds to the previous one and the update direction becomes wrong.
**Q5. What is the role of \`model.train()\` and \`model.eval()\`?**
They set a flag that changes the behaviour of certain layers. Dropout randomly zeroes activations only in train mode; BatchNorm uses batch statistics in train mode and stored running statistics in eval mode. Forgetting \`eval()\` during validation or inference gives inconsistent predictions.
**Q6. Why does \`nn.CrossEntropyLoss\` take logits instead of probabilities?**
It fuses log-softmax and negative log-likelihood into one numerically stable operation, avoiding log(0) and overflow problems that arise when you compute softmax separately in float32. Supplying probabilities would apply softmax twice and flatten the loss landscape.
**Q7. What is a convolution and why is it well suited to images?**
A convolution slides a small learnable filter across the input and computes a dot product at each location. Weight sharing drastically reduces parameters compared with a fully connected layer, and the same filter responds to a pattern wherever it appears, giving translation invariance. Stacking convolutions builds a hierarchy from edges to textures to objects.
**Q8. What is transfer learning and when would you fine-tune versus freeze the backbone?**
Transfer learning reuses a model pretrained on a large dataset as a feature extractor for a new task. Freeze the backbone and train only a new head when data is scarce or the domain is similar to the pretraining data; unfreeze some or all layers with a small learning rate when you have more data or a different domain (medical, satellite) and want higher accuracy.
**Q9. How do you save and load a PyTorch model correctly?**
Save \`model.state_dict()\` with \`torch.save\`, re-instantiate the architecture in code, call \`load_state_dict\` with \`torch.load(path, map_location=device)\`, then \`model.eval()\`. For resuming training also save the optimizer and scheduler state and the epoch. Avoid pickling the whole model object because it ties the file to the class import path.
**Q10. What is mixed-precision training and what is GradScaler for?**
Mixed precision runs most operations in float16/bfloat16 for speed and memory while keeping master weights in float32. Because float16 has a small range, tiny gradients can underflow to zero; \`GradScaler\` multiplies the loss by a large factor before backward and divides the gradients afterwards so they survive, adjusting the factor dynamically.`
    },
    {
      heading: "17. Hands-On Exercise: Build, Train, Evaluate and Save a CNN Image Classifier on FashionMNIST",
      content: `Put the whole lecture together in one complete, runnable script. **FashionMNIST** is a drop-in replacement for the classic digits dataset: 70,000 grayscale 28×28 images of clothing in 10 classes (T-shirt, trouser, pullover, dress, coat, sandal, shirt, sneaker, bag, ankle boot). \`torchvision\` downloads it automatically (about 30 MB).
The program:
1. Loads the data with \`torchvision.datasets.FashionMNIST\`, normalises pixels, and applies light augmentation (random horizontal flip) to the training set only.
2. Builds the \`SimpleCNN\` from section 10.
3. Trains for 5 epochs with \`AdamW\`, a one-cycle learning-rate schedule and gradient clipping, on GPU if available.
4. Evaluates on the 10,000-image test set after every epoch and keeps the best checkpoint.
5. Reloads the best weights, prints per-class accuracy, and runs a prediction on a single image the way an API route would.
Expected result: roughly **91–92% test accuracy** after 5 epochs (a few minutes on CPU, under a minute on a GPU). Exact numbers vary with the seed and hardware.
**Stretch goals:** (a) replace \`SimpleCNN\` with a third conv block and see whether accuracy improves; (b) swap the dataset for \`CIFAR10\` (colour, 3 channels, 32×32) and adapt the first conv layer and the flatten size; (c) load a pretrained ResNet18, change \`conv1\` to accept 1 channel, and compare; (d) export the trained model to ONNX and call it from a Next.js Route Handler with \`onnxruntime-node\`.`,
      codeSnippet: `# fashion_cnn.py — complete end-to-end image classifier
# Run: python fashion_cnn.py   (needs: pip install torch torchvision)
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import datasets
from torchvision.transforms import v2

CLASSES = ["T-shirt/top", "Trouser", "Pullover", "Dress", "Coat",
           "Sandal", "Shirt", "Sneaker", "Bag", "Ankle boot"]

class SimpleCNN(nn.Module):
    def __init__(self, num_classes=10):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(1, 32, 3, padding=1), nn.BatchNorm2d(32), nn.ReLU(), nn.MaxPool2d(2),
            nn.Conv2d(32, 64, 3, padding=1), nn.BatchNorm2d(64), nn.ReLU(), nn.MaxPool2d(2),
        )
        self.classifier = nn.Sequential(
            nn.Flatten(), nn.Dropout(0.3),
            nn.Linear(64 * 7 * 7, 128), nn.ReLU(),
            nn.Linear(128, num_classes),
        )

    def forward(self, x):
        return self.classifier(self.features(x))

def get_loaders(batch_size=128):
    norm = v2.Normalize(mean=[0.2860], std=[0.3530])          # FashionMNIST statistics
    train_tf = v2.Compose([v2.ToImage(), v2.ToDtype(torch.float32, scale=True),
                           v2.RandomHorizontalFlip(), norm])
    test_tf = v2.Compose([v2.ToImage(), v2.ToDtype(torch.float32, scale=True), norm])
    train_ds = datasets.FashionMNIST("data", train=True, download=True, transform=train_tf)
    test_ds = datasets.FashionMNIST("data", train=False, download=True, transform=test_tf)
    train_loader = DataLoader(train_ds, batch_size=batch_size, shuffle=True, num_workers=2)
    test_loader = DataLoader(test_ds, batch_size=512, shuffle=False, num_workers=2)
    return train_loader, test_loader

def train_one_epoch(model, loader, loss_fn, optimizer, scheduler, device):
    model.train()
    total, n = 0.0, 0
    for X, y in loader:
        X, y = X.to(device), y.to(device)
        optimizer.zero_grad(set_to_none=True)
        loss = loss_fn(model(X), y)
        loss.backward()
        nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        optimizer.step()
        scheduler.step()                                       # OneCycle steps per batch
        total += loss.item() * len(y); n += len(y)
    return total / n

@torch.inference_mode()
def evaluate(model, loader, device):
    model.eval()
    correct = torch.zeros(10); counts = torch.zeros(10)
    for X, y in loader:
        X, y = X.to(device), y.to(device)
        pred = model(X).argmax(1)
        for c in range(10):
            mask = y == c
            counts[c] += mask.sum().item()
            correct[c] += (pred[mask] == c).sum().item()
    return (correct.sum() / counts.sum()).item(), (correct / counts)

def main():
    torch.manual_seed(42)
    device = "cuda" if torch.cuda.is_available() else "mps" if torch.backends.mps.is_available() else "cpu"
    print("device:", device)

    train_loader, test_loader = get_loaders()
    model = SimpleCNN().to(device)
    loss_fn = nn.CrossEntropyLoss()
    epochs = 5
    optimizer = torch.optim.AdamW(model.parameters(), lr=3e-3, weight_decay=1e-2)
    scheduler = torch.optim.lr_scheduler.OneCycleLR(
        optimizer, max_lr=3e-3, epochs=epochs, steps_per_epoch=len(train_loader))

    best_acc = 0.0
    for epoch in range(1, epochs + 1):
        tr_loss = train_one_epoch(model, train_loader, loss_fn, optimizer, scheduler, device)
        acc, _ = evaluate(model, test_loader, device)
        if acc > best_acc:
            best_acc = acc
            torch.save(model.state_dict(), "fashion_cnn_best.pt")
        print(f"epoch {epoch}  train loss {tr_loss:.4f}  test acc {acc:.4f}")
    # epoch 1  train loss 0.5108  test acc 0.8812
    # epoch 2  train loss 0.3366  test acc 0.8989
    # ...
    # epoch 5  train loss 0.2212  test acc 0.9185   (approximate; varies by seed/hardware)

    # Reload the best checkpoint and report per-class accuracy
    model.load_state_dict(torch.load("fashion_cnn_best.pt", map_location=device))
    acc, per_class = evaluate(model, test_loader, device)
    print(f"best test accuracy: {acc:.4f}")
    for name, a in zip(CLASSES, per_class.tolist()):
        print(f"  {name:12s} {a:.3f}")      # "Shirt" is usually the hardest class (~0.75-0.80)

    # Single-image prediction, the way an API endpoint would do it
    model.eval()
    img, label = test_loader.dataset[0]            # already transformed: (1, 28, 28)
    with torch.inference_mode():
        logits = model(img.unsqueeze(0).to(device))   # add batch dim -> (1, 1, 28, 28)
        probs = torch.softmax(logits, dim=1)[0]
    top = probs.argmax().item()
    print(f"predicted: {CLASSES[top]} ({probs[top]:.2%})  actual: {CLASSES[label]}")
    # predicted: Ankle boot (99.87%)  actual: Ankle boot

if __name__ == "__main__":      # required for num_workers > 0 on Windows/macOS
    main()`
    },
    {
      heading: "18. Summary",
      content: `• A **neuron** computes a weighted sum plus bias through an activation; a **layer** is many neurons as one matrix multiply; a **forward pass** pushes data through stacked layers to produce logits.
• **Activation functions** add non-linearity: ReLU/GELU in hidden layers, sigmoid or softmax only at the output, and usually folded into the loss.
• **Loss functions** map task to objective: \`MSELoss\` for regression, \`BCEWithLogitsLoss\` for binary and multi-label, \`CrossEntropyLoss\` (raw logits, int64 labels) for multi-class.
• **Backpropagation** applies the chain rule backwards to get every gradient; **gradient descent** steps against it; **SGD with momentum** and **Adam/AdamW** are the optimizers you will use, with a learning-rate scheduler.
• **Tensors** are GPU-capable NumPy arrays with dtypes; **autograd** records operations and \`.backward()\` fills \`.grad\`; zero grads each step, use \`inference_mode\` for evaluation and \`.item()\` for logging.
• **\`nn.Module\`** holds layers in \`__init__\` and logic in \`forward\`; \`nn.Sequential\` for simple stacks; \`model.train()\` / \`model.eval()\` control Dropout and BatchNorm.
• **\`Dataset\` + \`DataLoader\`** deliver shuffled, batched, parallel-loaded tensors; augment and normalise there; guard \`num_workers\` with \`if __name__ == "__main__"\` on Windows.
• The **training loop** heartbeat is: to(device) → forward → loss → zero_grad + backward → step, wrapped in epochs with validation, checkpointing, optional mixed precision and gradient clipping.
• **CNNs** use shared 3×3 filters, pooling and BatchNorm to learn edge-to-object feature hierarchies; **transfer learning** with a pretrained ResNet and its own \`weights.transforms()\` gets high accuracy from small datasets.
• **Save \`state_dict\`**, not the model object; load with \`map_location\`, call \`eval()\`, keep full checkpoints for resuming, and export to ONNX for non-Python runtimes.
**Next lecture:** NLP, Embeddings & the Transformer Architecture — tokenization, word and sentence embeddings, attention, and how the training loop you built here scales up to language models.`
    }
  ]
};
