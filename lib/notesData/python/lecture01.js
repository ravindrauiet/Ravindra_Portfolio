export const lecture01 = {
  slug: "lecture-1",
  number: 1,
  title: "Complete Python Course — Lecture 1: Introduction to Python, Installation & Your First Program",
  summary: "Learn what Python is, where it is used (web, data science, AI, automation), how interpreted CPython runs code, and how to install Python on Windows, macOS and Linux. Set up VS Code, use the REPL, write your first script, master indentation, print(), input(), venv and uv, and the Zen of Python.",
  readTime: "65 min read",
  difficulty: "Beginner",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. What Is Python and Where Is It Used?",
      content: `**Python** is a high-level, general-purpose programming language created by Guido van Rossum and first released in 1991. "High-level" means you write code that reads almost like English while the language handles memory and other low-level details. "General-purpose" means it is not tied to one job: the same language runs websites, trains machine-learning models, automates Excel reports and controls Raspberry Pi robots.
Python's design goals are readability and simplicity. A program that takes 40 lines in Java or C++ often takes 10 lines in Python. That is why it is the first language taught at IITs, NITs and most engineering colleges in India, and why it consistently sits at the top of the TIOBE index and the Stack Overflow Developer Survey.
Where Python is used in real projects:
• **Web development** — Django, Flask and FastAPI power backends at Instagram, Spotify, Zomato and countless Indian startups. FastAPI with Pydantic v2 is the default choice for new APIs.
• **Data science and analytics** — pandas 2.x, NumPy, Matplotlib and Jupyter notebooks are the standard toolkit for analysts at Flipkart, Swiggy, banks and consulting firms.
• **Artificial intelligence and machine learning** — PyTorch, TensorFlow, scikit-learn, Hugging Face Transformers and LangChain are all Python-first. Almost every LLM application built in the last three years uses Python somewhere.
• **Automation and scripting** — renaming 10,000 files, scraping prices, sending WhatsApp reminders, generating PDF invoices, DevOps tooling (Ansible is written in Python).
• **Testing and QA** — pytest, Selenium and Playwright automation frameworks.
In this lecture you will install Python, understand how it executes code, set up a professional editor, write and run your first program, and learn the one rule that confuses every beginner: indentation is part of the syntax.`,
      codeSnippet: `# hello.py — the whole program is one line
print("Namaste, Python!")

# Expected output when you run: python hello.py
# Namaste, Python!

# Compare with the equivalent Java program:
# public class Hello {
#     public static void main(String[] args) {
#         System.out.println("Namaste, Java!");
#     }
# }`
    },
    {
      heading: "2. Interpreted vs Compiled: How CPython Runs Your Code",
      content: `Every program must eventually become instructions a CPU understands. Languages differ in **when** that translation happens.
• **Compiled languages** (C, C++, Go, Rust) translate the whole source into machine code **before** you run it, producing a standalone binary. The upside is raw speed; the downside is a separate build step and platform-specific executables.
• **Interpreted languages** (Python, JavaScript, Ruby) use an interpreter that reads your source and executes it **at run time**. You save \`hello.py\` and run it immediately, which makes Python ideal for learning, scripting and rapid prototyping.
The real story is slightly more nuanced. When you run \`python hello.py\`, the interpreter first compiles your source into **bytecode** (compact, platform-independent instructions) and then the **Python Virtual Machine (PVM)** executes that bytecode. The bytecode of imported modules is cached in a \`__pycache__\` folder as \`.pyc\` files so later runs skip the compile step. So Python is "compiled to bytecode, then interpreted", similar in spirit to Java's JVM, but done transparently.
"Python" is really two things: the **language specification** and an **implementation** that runs it. The reference implementation you download from python.org is **CPython**, written in C, and every major library (pandas, PyTorch, Django) targets it first. Alternatives exist for special needs: **PyPy** (a JIT-compiling implementation that runs pure-Python code several times faster), **MicroPython** (for ESP32 and Raspberry Pi Pico microcontrollers) and **Pyodide** (CPython compiled to WebAssembly so Python runs in the browser).
CPython facts you will hear in interviews:
• It is **dynamically typed**: \`x = 10\` then \`x = "ten"\` is legal because the type lives with the value, not the variable. Optional **type hints** (\`def total(price: float) -> float\`) let tools like Pylance and mypy catch mistakes before you run.
• Memory is freed automatically by **reference counting** plus a cyclic garbage collector.
• The **Global Interpreter Lock (GIL)** lets only one thread run Python bytecode at a time. Python 3.13 added an experimental **free-threaded build** without the GIL, and Python 3.14 made it officially supported (still a separate build you opt into). This is why CPU-heavy parallel work traditionally uses \`multiprocessing\`, while I/O-heavy work uses threads or \`asyncio\`.
Why this matters: it explains the \`__pycache__\` folder you will see, why Python is slower than C for tight numeric loops (and why NumPy, written in C, is fast), and why you can type code line by line in the REPL.`,
      codeSnippet: `# which_python.py — inspect the interpreter and peek at bytecode
import dis
import platform
import sys

print(platform.python_implementation())   # CPython
print(sys.version_info[:2])               # (3, 14)
print(sys.executable)                     # full path of the interpreter binary

if hasattr(sys, "_is_gil_enabled"):       # Python 3.13+
    print("GIL enabled:", sys._is_gil_enabled())   # True on the standard build


def add_gst(amount, rate=0.18):
    return amount + amount * rate


dis.dis(add_gst)
# Partial output (exact opcodes vary by Python version):
#   LOAD_FAST                0 (amount)
#   LOAD_FAST                1 (rate)
#   BINARY_OP                5 (*)
#   BINARY_OP                0 (+)
#   RETURN_VALUE`
    },
    {
      heading: "3. Which Python Version Should You Install in 2026?",
      content: `Python follows an **annual release cycle**: a new minor version (3.12, 3.13, 3.14, ...) every October, with bug fixes for about two years and security fixes for five years in total.
• **Python 2** is dead. It reached end of life on 1 January 2020. If a tutorial starts with \`print "hello"\` (no parentheses), close it.
• **Python 3.9 and 3.10** are at or near end of life; do not start new projects on them.
• **Python 3.12 and 3.13** are mature, supported by every major library, and what most companies run in production today.
• **Python 3.14** (released October 2025) is the current stable series as this lecture is written. Highlights: template strings (t-strings, PEP 750), deferred evaluation of annotations (PEP 649/749), the officially supported free-threaded build, and a new \`compression.zstd\` module.
• **Python 3.15** is scheduled for early October 2026 per PEP 790, so by the time you read this it may already be out. Check python.org/downloads for the "Latest Python 3 Release" banner.
**For learners:** install the latest stable 3.x from python.org. Everything in this course works on Python 3.12 and above, and features that need a newer version are labelled (for example, "3.14+").
**For teams:** pin the version in \`pyproject.toml\` (\`requires-python = ">=3.12"\`) and in a \`.python-version\` file so every developer and CI server uses the same interpreter. Wait a month or two after a brand-new release before moving production to it, because some compiled libraries publish wheels for new versions a little late.
Version-aware features you will meet in this course: f-strings (3.6+), the walrus operator \`:=\` (3.8+), \`match\` statements (3.10+), \`tomllib\` and exception groups (3.11+), nested quotes inside f-strings (3.12+), the new colourful REPL (3.13+), t-strings (3.14+).`,
      codeSnippet: `# version_check.py — guard a script against old interpreters
import sys

MIN = (3, 12)
if sys.version_info < MIN:
    sys.exit(f"This script needs Python {MIN[0]}.{MIN[1]}+, you have {sys.version.split()[0]}")

print(f"Running on Python {sys.version_info.major}.{sys.version_info.minor} — all good.")

# Terminal checks without writing any code:
#   python --version        -> Python 3.14.0
#   python3 --version       -> on macOS/Linux
#   py --version            -> Windows launcher
#   py -0                   -> Windows: list every installed Python`
    },
    {
      heading: "4. Installing Python on Windows, macOS and Linux",
      content: `**Windows:**
1. Go to python.org/downloads and click the download button for the latest stable release (64-bit installer). The page also offers the newer **Python install manager**, which is fine too.
2. Run the installer. On the first screen **tick "Add python.exe to PATH"**. This is the single most common mistake; without it \`python\` will not be recognised in your terminal.
3. Click "Install Now". The installer also adds the **py launcher**, so \`py -3.14\` selects a specific version when several are installed.
4. Open a **new** terminal (PowerShell or Windows Terminal) and run \`python --version\`. If Windows opens the Microsoft Store instead, PATH was not set: re-run the installer, choose Modify and tick the PATH option, or disable the Store alias under Settings > Apps > Advanced app settings > App execution aliases.
**macOS:**
macOS no longer ships a Python 3 meant for development, so install your own. The cleanest option is **Homebrew**: \`brew install python@3.14\` gives you \`python3\` and \`pip3\`. The python.org \`.pkg\` installer also works well. Always type \`python3\` on macOS; plain \`python\` may not exist.
**Linux (Ubuntu/Debian):**
Most distributions ship Python 3 because the OS itself uses it, but it may be older and the \`venv\` and \`pip\` modules are packaged separately: \`sudo apt update && sudo apt install python3 python3-venv python3-pip\`. For the newest version on Ubuntu use the deadsnakes PPA (\`sudo add-apt-repository ppa:deadsnakes/ppa\`, then \`sudo apt install python3.14 python3.14-venv\`). Never delete or replace the system Python; install alongside it.
**The modern cross-platform option: uv.** \`uv\` (from Astral, the makers of Ruff) is a fast package and project manager that can also download Python itself: \`uv python install 3.14\`. Many developers now use uv as their only tool; section 11 covers it.
**Verify every installation** with the commands in the snippet. \`pip\`, Python's package installer, comes bundled with any modern install.`,
      codeSnippet: `# Verification commands — run in your terminal, not in Python

# Windows (PowerShell)
python --version
python -m pip --version
py -0                       # list installed versions, e.g. -V:3.14 *

# macOS / Linux (bash or zsh)
python3 --version
python3 -m pip --version
which python3               # /opt/homebrew/bin/python3 or /usr/bin/python3

# Upgrade pip the safe way (works everywhere)
python -m pip install --upgrade pip

# Install uv (optional but recommended)
#   Windows PowerShell:
#   powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
#   macOS / Linux:
#   curl -LsSf https://astral.sh/uv/install.sh | sh
#   Then:  uv python install 3.14   and   uv python list`
    },
    {
      heading: "5. The Python REPL: Your Interactive Playground",
      content: `Type \`python\` (or \`python3\`) with no file name and you enter the **REPL** — Read, Evaluate, Print, Loop. It reads one line, evaluates it, prints the result and waits for the next. The \`>>>\` prompt means "Python is listening".
The REPL is the fastest way to test an idea: check what \`10 / 3\` returns, explore a library, or confirm how a string method behaves before using it in a script. Experienced developers keep one open all day.
Python 3.13 shipped a **brand-new REPL** (PEP 762) that helps beginners a lot:
• Colourised prompts and tracebacks.
• **Multi-line editing** — use the arrow keys to go back and fix a line inside a function definition.
• Type \`exit\` or \`quit\` without parentheses to leave (older versions need \`exit()\`, or Ctrl+Z then Enter on Windows and Ctrl+D on macOS/Linux).
• **F1** opens interactive help, **F2** shows history, **F3** enters paste mode so indented code copied from a website pastes cleanly.
Useful built-ins to explore here: \`help(print)\` prints documentation, \`dir(str)\` lists every method a string has, \`type(3.5)\` tells you a value's type, and \`_\` holds the last printed result.
The REPL is not where you write real programs; anything longer than a few lines belongs in a \`.py\` file. It is the perfect place to **experiment**, and Jupyter notebooks and IPython are supercharged REPLs built on the same idea.`,
      codeSnippet: `# Start the REPL from your terminal:  python   (or python3)
# Python 3.14.0 (main, ...) [MSC v.1944 64 bit (AMD64)] on win32
# Type "help", "copyright", "credits" or "license" for more information.

>>> 2 + 3
5
>>> 10 / 3
3.3333333333333335
>>> 10 // 3            # floor division
3
>>> "chai " * 3
'chai chai chai '
>>> name = "Priya"
>>> f"Hello, {name}!"
'Hello, Priya!'
>>> type(name)
<class 'str'>
>>> _                  # the last result
<class 'str'>
>>> help(len)          # press q to leave the help screen
>>> exit               # 3.13+; use exit() on older versions`
    },
    {
      heading: "6. Setting Up VS Code for Python Development",
      content: `You can write Python in any text editor, but **Visual Studio Code** with the official Python extension is the most popular free setup for students and professionals alike. (PyCharm Community Edition is an excellent alternative if you prefer a full IDE.)
**Setup steps:**
1. Install VS Code from code.visualstudio.com.
2. Open the Extensions panel (Ctrl+Shift+X) and install **"Python"** by Microsoft (id \`ms-python.python\`). It pulls in **Pylance**, the language server that gives you autocomplete, hover documentation, go-to-definition and type checking, plus the Python Debugger extension.
3. Optionally install **Ruff** (\`charliermarsh.ruff\`) for very fast linting and formatting; it replaces flake8, isort and Black in one tool.
4. Create a project folder, for example \`C:\\Users\\you\\python-course\`, and open it with File > Open Folder. Always open a **folder**, not a single file, so VS Code can find your virtual environment.
5. Create \`hello.py\`, type a line of code, and press the Run button (the triangle at the top right) or Ctrl+F5. Output appears in the integrated terminal.
**Selecting the interpreter:** press Ctrl+Shift+P, type "Python: Select Interpreter", and choose the Python you installed (later, your project's \`.venv\`). The chosen version shows in the status bar. If VS Code picks the wrong Python, this is where you fix it.
**Debugging:** click in the gutter left of a line number to set a red breakpoint, then press F5. Execution pauses there and you can inspect every variable in the left panel. Learning the debugger early saves hundreds of \`print()\` statements.
The snippet shows recommended settings: format on save, 4-space indentation and a ruler at 88 columns (Ruff's default line length).`,
      codeSnippet: `// .vscode/settings.json — put this inside your project folder
{
  "editor.formatOnSave": true,
  "editor.tabSize": 4,
  "editor.insertSpaces": true,
  "editor.rulers": [88],
  "files.trimTrailingWhitespace": true,
  "python.analysis.typeCheckingMode": "basic",
  "[python]": {
    "editor.defaultFormatter": "charliermarsh.ruff",
    "editor.codeActionsOnSave": {
      "source.organizeImports": "explicit"
    }
  }
}

// Handy shortcuts:
//   Ctrl+Shift+P  -> Command Palette ("Python: Select Interpreter")
//   Ctrl+\`        -> toggle the integrated terminal
//   Ctrl+F5       -> run without debugging;  F5 -> run with debugger
//   Shift+Alt+F   -> format document`
    },
    {
      heading: "7. Your First Python Script: Writing and Running hello.py",
      content: `A Python **script** is simply a text file ending in \`.py\`. There is no \`main\` method requirement, no class wrapper, no semicolons: the interpreter runs the file from the first line to the last.
Create \`hello.py\` with the code in the snippet, save it, and run it from the terminal with \`python hello.py\` (Windows) or \`python3 hello.py\` (macOS/Linux). Your terminal must be **in the same folder** as the file; use \`cd\` to move there, or open the folder in VS Code so the integrated terminal starts in the right place.
What happens step by step:
1. The interpreter reads \`hello.py\`, compiles it to bytecode and executes statements top to bottom.
2. Each \`print()\` call writes a line to standard output (your terminal).
3. When the last line finishes, the process exits with status code 0 (success).
Two conventions you will see in almost every real script:
• **The \`if __name__ == "__main__":\` guard.** When you run a file directly, Python sets the special variable \`__name__\` to \`"__main__"\`. When the same file is imported as a module from another file, \`__name__\` is the module's name instead. Code under the guard runs only in the first case, so your file can be both a runnable script and a reusable library.
• **A \`main()\` function** holding the program logic, called from the guard. It keeps the global scope clean and makes testing easier.
Other ways to run code: \`python -c "print(2 ** 10)"\` executes a one-liner, and \`python -m module_name\` runs a module from the standard library or an installed package (\`python -m pip\`, \`python -m venv\`, \`python -m http.server\`). You will type \`python -m\` a lot.`,
      codeSnippet: `# hello.py — your first real Python script
"""A tiny greeting program.

Run it with:  python hello.py
"""


def main() -> None:
    name = "Ravindra"
    city = "Patna"
    year = 2026

    print("Hello, World!")
    print(f"My name is {name} and I live in {city}.")
    print(f"In {year + 4} I will have 4 more years of Python experience.")
    print("Python", "is", "fun", sep=" ... ")


if __name__ == "__main__":
    main()

# Expected output:
# Hello, World!
# My name is Ravindra and I live in Patna.
# In 2030 I will have 4 more years of Python experience.
# Python ... is ... fun`
    },
    {
      heading: "8. Indentation as Syntax: Python's Most Important Rule",
      content: `In C, Java and JavaScript, blocks are wrapped in curly braces and indentation is only for humans. In Python there are **no braces**: the **indentation itself defines the block**. A line ending with a colon (\`if\`, \`for\`, \`while\`, \`def\`, \`class\`, \`with\`, \`try\`) opens a block, every line indented under it belongs to that block, and the block ends when indentation returns to the previous level.
This is deliberate: because code **must** be indented to run, every Python program in the world is readable in the same way. The style guide **PEP 8** says to use **4 spaces** per level. Never mix tabs and spaces; Python 3 raises \`TabError\` on inconsistent mixing. Configure your editor to insert spaces when you press Tab (VS Code does this by default for Python).
Errors you will meet:
• \`IndentationError: expected an indented block\` — you wrote \`if x > 5:\` and forgot to indent the next line.
• \`IndentationError: unexpected indent\` — a line is indented for no reason, often a stray space at the start.
• \`IndentationError: unindent does not match any outer indentation level\` — 3 spaces in one place and 4 in another.
Beginner confusion often comes from copy-pasting code from a website or WhatsApp message, which strips or adds whitespace. Use the REPL's F3 paste mode or paste into a file instead.
Where a block needs no code yet, write \`pass\` as a placeholder. A long statement can be continued inside parentheses, brackets or braces without any special character; Python knows the statement is not finished until they close. PEP 8 prefers this implicit continuation over backslash line continuation.`,
      codeSnippet: `# indentation_demo.py
marks = 72

if marks >= 90:
    grade = "A"
    print("Outstanding")          # inside the if block (4 spaces)
elif marks >= 60:
    grade = "B"
    print("Good job")             # inside the elif block
else:
    grade = "C"

print(f"Grade: {grade}")          # back at column 0 -> outside every block


def total_fees(tuition, hostel, mess):
    # Implicit line continuation inside parentheses — no backslash needed
    return (
        tuition
        + hostel
        + mess
    )


def coming_soon():
    pass                          # placeholder so the function is valid


print(total_fees(80_000, 30_000, 24_000))   # 134000

# Output:
# Good job
# Grade: B
# 134000

# What NOT to do:
# if marks > 50:
# print("pass")      <- IndentationError: expected an indented block`
    },
    {
      heading: "9. Comments and Docstrings in Python",
      content: `A **comment** is text the interpreter ignores. In Python a comment starts with \`#\` and runs to the end of the line. There is no multi-line comment syntax like \`/* */\`; put \`#\` at the start of each line (VS Code toggles this with Ctrl+/).
Good comments explain **why**, not **what**. \`count += 1  # increment count\` is noise; \`count += 1  # GST is applied per line item, not per invoice\` is valuable. Write comments for the next developer, who is often you six months later.
A **docstring** is a string literal placed as the very first statement of a module, function, class or method, conventionally in triple double quotes \`"""..."""\`. Unlike a comment, a docstring is kept at run time: \`help(my_function)\` displays it, VS Code shows it on hover, and tools like Sphinx and MkDocs generate documentation websites from it. PEP 257 gives the conventions: a one-line summary in the imperative mood ("Return the total", not "Returns the total"), a blank line, then details about parameters and return values.
Triple-quoted strings are sometimes misused as "block comments" in the middle of a function. That works, but it creates a string object that is evaluated and thrown away; use \`#\` lines instead.
Two special comments you will see at the top of scripts: \`#!/usr/bin/env python3\`, a **shebang** line that lets Linux and macOS run the file directly after \`chmod +x\`, and directives such as \`# noqa\` or \`# type: ignore\` that tell linters and type checkers to skip a line (use sparingly).
Type hints such as \`def area(radius: float) -> float\` are not comments, but they document intent the same way and Pylance checks them. This course uses them throughout because every modern Python codebase does.`,
      codeSnippet: `#!/usr/bin/env python3
"""gst_calculator.py — utilities for Indian GST calculations.

This module-level docstring describes the whole file.
"""


def add_gst(amount: float, rate: float = 0.18) -> float:
    """Return the amount including GST.

    Args:
        amount: Base price in rupees.
        rate: GST rate as a fraction. Defaults to 18%.

    Returns:
        Final price rounded to 2 decimal places.
    """
    # Rate is a fraction (0.18), not a percentage (18) — a common source of bugs
    return round(amount + amount * rate, 2)


print(add_gst(1000))          # 1180.0
print(add_gst(1000, 0.05))    # 1050.0
print(add_gst.__doc__)        # prints the docstring
help(add_gst)                 # formatted help, press q to exit`
    },
    {
      heading: "10. print() and input(): Talking to the User",
      content: `\`print()\` writes text to the screen and \`input()\` reads a line typed by the user. Together they let you build interactive command-line programs on day one.
**print() in depth.** \`print\` accepts any number of positional arguments and joins them with a space: \`print("Total:", 450)\` prints \`Total: 450\`. It converts every argument to a string automatically. Keyword parameters control the formatting:
• \`sep=" | "\` — the separator between arguments (default is one space).
• \`end=""\` — what to print after the last argument (default is a newline \`"\\n"\`). Use \`end=""\` to keep the cursor on the same line.
• \`file=sys.stderr\` — send output to the error stream instead of standard output.
• \`flush=True\` — force the text to appear immediately instead of being buffered; important in long-running scripts and Docker logs.
**f-strings (3.6+)** are the modern way to build output: prefix the string with \`f\` and put expressions inside braces. Format specifiers go after a colon: \`{price:,.2f}\` gives thousands separators and two decimals, \`{name:>10}\` right-aligns in 10 characters, \`{ratio:.1%}\` prints a percentage. Since Python 3.12 you can reuse the same quote type inside the braces. The debugging form \`{x=}\` prints both the name and the value.
**input() in depth.** \`input("Enter your age: ")\` shows the prompt, waits for Enter, and returns what was typed **always as a string**, even if the user typed digits. To do arithmetic you must convert with \`int()\` or \`float()\`. If the text is not a valid number, \`int()\` raises \`ValueError\`; we handle that properly in the exceptions lecture. For now, call \`.strip()\` to remove stray spaces.
Escape sequences inside strings: \`\\n\` is a newline, \`\\t\` a tab, \`\\\\\` a literal backslash, \`\\"\` a quote inside a double-quoted string. Prefix a string with \`r\` (a raw string) to turn escapes off, which is what you want for Windows paths and regular expressions: \`r"C:\\Users\\ravin"\`.`,
      codeSnippet: `# io_demo.py
import sys

# --- print() features ---
print("Mumbai", "Delhi", "Bengaluru")              # Mumbai Delhi Bengaluru
print("Mumbai", "Delhi", "Bengaluru", sep=" -> ")  # Mumbai -> Delhi -> Bengaluru
print("Loading", end="")
print("...", end="\\n")                              # Loading...
print("Something went wrong", file=sys.stderr)     # goes to the error stream

price = 1249.5
qty = 3
print(f"Item price: ₹{price:,.2f}")                # Item price: ₹1,249.50
print(f"Total: ₹{price * qty:,.2f}")               # Total: ₹3,748.50
print(f"{qty=}")                                   # qty=3   (debug form, 3.8+)
print(f"{'Name':<10}{'Marks':>6}")                 # Name       Marks
print(f"{'Aarav':<10}{88:>6}")                     # Aarav         88

# --- input() always returns a string ---
name = input("What is your name? ").strip()
age_text = input("How old are you? ")
age = int(age_text)                                # convert before arithmetic
print(f"Hi {name}, next year you will be {age + 1}.")

# Raw string for Windows paths (no escape processing)
print(r"C:\\Users\\ravin\\python-course")

# Sample session:
# What is your name? Priya
# How old are you? 21
# Hi Priya, next year you will be 22.`
    },
    {
      heading: "11. Virtual Environments with venv and uv",
      content: `When you run \`pip install requests\` without a virtual environment, the package goes into the global **site-packages** folder of your Python installation. Two projects that need different versions of the same library (Django 4.2 for a client, Django 5.2 for your startup) then fight each other, and you can never be sure which packages a project actually needs. On Linux and macOS, installing into the system Python can even break OS tools; modern distributions refuse with an "externally-managed-environment" error.
A **virtual environment** is an isolated folder with its own Python interpreter link, its own \`pip\` and its own \`site-packages\`. One environment per project is the universal rule.
**venv (built into the standard library):**
1. Inside your project folder run \`python -m venv .venv\`. This creates a \`.venv\` directory (the leading dot is conventional, and VS Code auto-detects it).
2. **Activate** it: \`.venv\\Scripts\\activate\` on Windows (PowerShell may first need \`Set-ExecutionPolicy -Scope CurrentUser RemoteSigned\`), or \`source .venv/bin/activate\` on macOS/Linux. Your prompt now starts with \`(.venv)\`.
3. Install packages: \`python -m pip install requests\`. They go into \`.venv\` only.
4. Record them: \`pip freeze > requirements.txt\`; a teammate recreates the setup with \`pip install -r requirements.txt\`.
5. \`deactivate\` when done. Add \`.venv/\` to \`.gitignore\`; never commit it.
**uv (the modern alternative):** uv is a single binary that replaces pip, venv, pip-tools and pyenv, and it is 10 to 100 times faster because it is written in Rust and caches aggressively. The workflow is project-centric:
• \`uv init my-project\` creates a folder with \`pyproject.toml\`, a \`.python-version\` file and a sample \`main.py\`.
• \`uv add requests\` creates \`.venv\` if needed, installs the package, writes it under \`[project] dependencies\` in \`pyproject.toml\`, and records exact versions in \`uv.lock\`.
• \`uv run main.py\` runs your script inside the environment without manual activation; \`uv sync\` recreates the environment from the lockfile on any machine; \`uv add --dev pytest\` adds development-only tools.
Both approaches produce a standard \`.venv\`, so VS Code, pytest and every other tool work identically. Learn venv first because every tutorial and interview assumes it; adopt uv for your own projects because it saves time daily. You may still see older tools: \`virtualenv\`, \`pipenv\`, \`poetry\` and \`conda\` (common in data science).`,
      codeSnippet: `# --- Option A: venv + pip (standard library) ---
# Windows PowerShell
python -m venv .venv
.venv\\Scripts\\activate
python -m pip install --upgrade pip
python -m pip install requests
pip freeze > requirements.txt
deactivate

# macOS / Linux
python3 -m venv .venv
source .venv/bin/activate
python -m pip install requests

# --- Option B: uv (modern, fast) ---
uv init expense-tracker          # creates pyproject.toml, .python-version, main.py
cd expense-tracker
uv add requests                  # creates .venv, installs, updates pyproject.toml + uv.lock
uv add --dev pytest ruff         # dev-only tools
uv run main.py                   # runs inside the venv, no activation needed
uv sync                          # recreate env from uv.lock on another machine

# pyproject.toml generated by uv init (trimmed)
# [project]
# name = "expense-tracker"
# version = "0.1.0"
# requires-python = ">=3.14"
# dependencies = [
#     "requests>=2.32.0",
# ]

# .gitignore essentials
# .venv/
# __pycache__/`
    },
    {
      heading: "12. The Zen of Python: The Philosophy Behind the Language",
      content: `Type \`import this\` in the REPL and Python prints **The Zen of Python**, 19 guiding aphorisms written by Tim Peters in 1999 and recorded as PEP 20. It is an Easter egg, but it is also the most concise description of what "Pythonic" code means, and interviewers love to ask about it.
The lines that shape everyday decisions:
• **Explicit is better than implicit.** Prefer \`from math import sqrt\` over \`from math import *\`; name things clearly instead of relying on magic.
• **Simple is better than complex. Flat is better than nested.** Solve the problem in front of you; deeply nested \`if\` inside \`for\` inside \`if\` is a signal to extract a function or use early returns.
• **Readability counts.** This is the reason for mandatory indentation, PEP 8 and descriptive names like \`monthly_salary\` instead of \`ms\`.
• **Errors should never pass silently. Unless explicitly silenced.** Never write a bare \`except: pass\`; catch specific exceptions and handle or log them.
• **There should be one-- and preferably only one --obvious way to do it.** When you find yourself choosing between five approaches, pick the one the standard library documentation uses.
Why this matters in real projects: Python's community enforces these ideas through code review. A pull request that works but is "un-Pythonic" (a C-style index loop where \`for item in items\` would do) will be sent back at most companies. Read the Zen once now and again after a few months of coding; the lines will click.
Two more Easter eggs: \`import antigravity\` opens an xkcd comic in your browser, and \`from __future__ import braces\` responds with "not a chance", the language's official answer to people who miss curly braces.`,
      codeSnippet: `>>> import this
The Zen of Python, by Tim Peters

Beautiful is better than ugly.
Explicit is better than implicit.
Simple is better than complex.
Complex is better than complicated.
Flat is better than nested.
Sparse is better than dense.
Readability counts.
Special cases aren't special enough to break the rules.
Although practicality beats purity.
Errors should never pass silently.
Unless explicitly silenced.
In the face of ambiguity, refuse the temptation to guess.
There should be one-- and preferably only one --obvious way to do it.
Although that way may not be obvious at first unless you're Dutch.
Now is better than never.
Although never is often better than right now.
If the implementation is hard to explain, it's a bad idea.
If the implementation is easy to explain, it may be a good idea.
Namespaces are one honking great idea -- let's do more of those!

>>> from __future__ import braces
SyntaxError: not a chance`
    },
    {
      heading: "13. Real-World Use Cases: How Python Is Used in Production",
      content: `Everything in this lecture, from the interpreter to virtual environments, shows up on the first day of a real job. Here is how the pieces connect in practice.
**A backend API at a fintech startup.** The team pins \`requires-python = ">=3.12"\` in \`pyproject.toml\`, uses uv to lock dependencies, and runs FastAPI with Pydantic v2 for request validation. Every developer runs \`uv sync\` after cloning and has an identical environment within seconds. The Dockerfile installs from \`uv.lock\` so production matches development exactly, and logs are written with \`flush=True\` or the \`logging\` module so Kubernetes captures them in real time.
**A data analyst at an e-commerce company.** Daily work happens in a Jupyter notebook (a REPL with memory) where sales data is loaded into pandas 2.x, cleaned and charted. The notebook lives in its own environment so a pandas upgrade for one project does not break another. When an analysis becomes routine, it moves into a \`.py\` script with a \`main()\` function and is scheduled with Airflow or cron.
**An automation script in an IT team.** A 60-line script using \`pathlib\` renames and sorts thousands of scanned documents every night. It starts with a shebang line, has a module docstring explaining what it does, and prints a summary the on-call engineer can read in the log. Because it runs on a Linux server but was written on Windows, the author used \`pathlib\` instead of hard-coded backslashes.
**An ML engineer fine-tuning a model** cares deeply about the interpreter: PyTorch wheel availability for the exact Python version, CUDA compatibility and the free-threaded build. They typically stay one minor version behind the newest release for exactly this reason.
The common thread: a reproducible environment, a readable script with a docstring and a \`main()\` guard, and a clear understanding of how the interpreter runs the code. Master these basics and every later topic builds on them.`,
      codeSnippet: `# nightly_report.py — a realistic small automation script
"""Summarise today's order files and print a report.

Scheduled nightly via cron:  0 23 * * * /srv/app/.venv/bin/python nightly_report.py
"""
from datetime import date
from pathlib import Path


def main() -> None:
    orders_dir = Path("data") / "orders"
    today = date.today().isoformat()          # e.g. '2026-10-09'
    files = sorted(orders_dir.glob(f"{today}-*.csv"))

    print(f"Report for {today}", flush=True)
    print(f"Order files found: {len(files)}", flush=True)
    for f in files:
        size_kb = f.stat().st_size / 1024
        print(f"  {f.name:<32} {size_kb:>8.1f} KB", flush=True)

    if not files:
        print("WARNING: no order files for today", flush=True)


if __name__ == "__main__":
    main()

# Sample output:
# Report for 2026-10-09
# Order files found: 2
#   2026-10-09-mumbai.csv               412.7 KB
#   2026-10-09-pune.csv                 198.2 KB`
    },
    {
      heading: "14. Common Mistakes and How to Fix Them",
      content: `**1. "python is not recognized as an internal or external command" on Windows.** You skipped the "Add python.exe to PATH" checkbox. Re-run the installer, choose Modify and tick the option, or use the \`py\` launcher (\`py hello.py\`), which is registered regardless. Open a **new** terminal after changing PATH.
**2. "command not found" or Python 2 when typing \`python\` on macOS/Linux.** Use \`python3\` explicitly. Inside an activated virtual environment, \`python\` always points to the right interpreter, which is one more reason to use one.
**3. Typing terminal commands inside the Python REPL.** \`pip install requests\` at the \`>>>\` prompt gives \`SyntaxError\`. pip is a program you run in the shell, not Python code. Exit the REPL first, then run \`python -m pip install requests\`.
**4. Mixing tabs and spaces.** You get \`TabError: inconsistent use of tabs and spaces in indentation\`. Set your editor to insert 4 spaces per Tab press, and let Ruff auto-format.
**5. Forgetting the colon or the indentation after it.** \`if x > 5\` without \`:\` is a \`SyntaxError\`; with the colon but no indented line beneath it is an \`IndentationError\`. Every block opener ends with a colon and is followed by at least one indented statement (\`pass\` if you have nothing yet).
**6. Treating \`input()\` output as a number.** \`age = input("Age: ")\` then \`age + 1\` raises \`TypeError: can only concatenate str (not "int") to str\`. Convert with \`int()\` or \`float()\`.
**7. Naming your file after a module.** A file called \`random.py\` or \`json.py\` in your project shadows the standard library module, so \`import random\` imports your file and fails mysteriously. Never name scripts \`test.py\`, \`random.py\`, \`string.py\`, \`json.py\` or \`requests.py\`.
**8. Installing packages into the global Python.** Everything works until two projects disagree about versions. Create a \`.venv\` per project from day one and check that the VS Code status bar shows that environment.
**9. Committing \`.venv\` or \`__pycache__\` to Git.** They are large and machine-specific. Add both to \`.gitignore\` and share \`requirements.txt\` or \`pyproject.toml\` + \`uv.lock\` instead.
**10. Using \`print\` without parentheses from an old Python 2 tutorial.** \`print "hi"\` is a \`SyntaxError\` in Python 3. Any resource showing this syntax is more than six years out of date.`,
      codeSnippet: `# mistakes_fixed.py — the before/after of the most common beginner errors

# Mistake 6: input() returns a string
age = input("Age: ")
# print(age + 1)              # TypeError
print(int(age) + 1)           # correct

# Mistake 5: missing colon / indentation
score = 75
if score >= 60:               # colon required
    print("Pass")             # indented body required

# Mistake 7: shadowing a standard library module
# If this file were named random.py, the next line would break:
import random
print(random.randint(1, 6))   # works only when your file is NOT called random.py

# Mistake 10: Python 2 syntax
# print "hello"               # SyntaxError in Python 3
print("hello")                # Python 3

# Terminal, not REPL, for pip (Mistake 3):
#   >>> pip install requests           <- SyntaxError inside the REPL
#   $ python -m pip install requests   <- correct, in the shell`
    },
    {
      heading: "15. Frequently Asked Questions",
      content: `**Is Python an interpreted or compiled language?**
Both, in a sense. CPython compiles your source to bytecode automatically and then interprets that bytecode on the Python Virtual Machine. Because the compile step is invisible and there is no separate build command, Python is classified as an interpreted language. The \`.pyc\` files in \`__pycache__\` are the cached bytecode.
**Which Python version should a beginner install in 2026?**
Install the latest stable Python 3 release from python.org, which is the 3.14 series at the time of writing with 3.15 due in October 2026. Avoid anything below 3.12 for new learning, and never install Python 2.
**What is the difference between Python and CPython?**
Python is the language specification; CPython is the reference implementation written in C that you download from python.org. Alternatives such as PyPy, MicroPython and Pyodide implement the same language for different goals (speed, microcontrollers, browsers). Unless you have a specific reason, use CPython.
**Why does Python use indentation instead of curly braces?**
Guido van Rossum chose indentation to force consistent, readable code. Since the block structure must be indented correctly to run, every Python codebase looks structurally the same, and bugs caused by misleading indentation cannot happen. The cost is that you must be careful with tabs versus spaces and use 4 spaces as PEP 8 recommends.
**What is a virtual environment in Python and why do I need one?**
A virtual environment is an isolated folder with its own interpreter link and site-packages, so each project can have its own package versions. Without it, installing a package for one project can break another or even your operating system. Create one with \`python -m venv .venv\`, or let \`uv\` create it automatically.
**What is the difference between venv and uv?**
\`venv\` is the standard-library module that creates virtual environments; you then use pip and activate the environment manually. \`uv\` is a third-party tool that does the same job much faster and adds project management: it writes dependencies to \`pyproject.toml\`, keeps an exact \`uv.lock\`, runs scripts without activation and can install Python itself. Both produce a normal \`.venv\` folder.
**Is Python good for web development or only for data science?**
Python is excellent for both. Django and FastAPI run production backends at large companies, and FastAPI is one of the most popular frameworks for REST APIs and AI service endpoints. Data science and AI simply happen to be fields where Python has almost no competition.
**How long does it take to learn Python?**
With one to two hours of daily practice, most students write useful scripts within four to six weeks and are job-ready in a specific area (backend, data analysis, automation) within four to six months. Consistency matters more than speed; follow this course one lecture at a time and complete each hands-on exercise before moving on.`
    },
    {
      heading: "16. Interview Questions and Answers",
      content: `**Q1. What are the key features of Python?**
Python is high-level, interpreted, dynamically typed and garbage-collected. It has an indentation-based syntax, a huge standard library ("batteries included"), a vast third-party ecosystem via PyPI, supports procedural, object-oriented and functional styles, runs on every platform, and integrates easily with C for performance-critical code.
**Q2. Explain how Python code is executed.**
The CPython interpreter parses the source into an abstract syntax tree, compiles it into bytecode (cached as \`.pyc\` in \`__pycache__\`), and the Python Virtual Machine executes the bytecode instruction by instruction. This happens transparently when you run \`python file.py\`.
**Q3. What is the Global Interpreter Lock (GIL)?**
The GIL is a mutex in CPython that allows only one thread to execute Python bytecode at a time, simplifying memory management but limiting CPU-bound multithreading. I/O-bound threads still benefit because the GIL is released during blocking I/O. For CPU-bound parallelism, use \`multiprocessing\`, or the free-threaded build introduced experimentally in Python 3.13 and officially supported from 3.14.
**Q4. What is PEP 8 and why does it matter?**
PEP 8 is the official style guide: 4-space indentation, snake_case for functions and variables, PascalCase for classes, UPPER_CASE for constants, a maximum line length of 79 (many teams use 88), and conventions for imports and whitespace. Following it makes code consistent and reviewable; tools like Ruff enforce it automatically.
**Q5. What is the difference between a comment and a docstring?**
A comment (\`#\`) is discarded by the interpreter and exists only for readers. A docstring is a string literal that is the first statement in a module, class or function; it is stored in the \`__doc__\` attribute, shown by \`help()\` and used by documentation generators.
**Q6. What does \`if __name__ == "__main__":\` do?**
When a file is run directly, Python sets its \`__name__\` to \`"__main__"\`; when the file is imported, \`__name__\` is the module name. The guard therefore runs code only when the file is executed as a script, so the same file can be imported as a library without side effects.
**Q7. What does \`input()\` return, and how do you read a number?**
\`input()\` always returns a string. Convert it with \`int()\` or \`float()\`, and in production wrap the conversion in \`try/except ValueError\` to handle invalid input gracefully.
**Q8. Why are virtual environments important, and how do you create one?**
They isolate each project's dependencies so different projects can use different package versions without conflicts and without touching the system Python. Create one with \`python -m venv .venv\` and activate it, or use \`uv init\` and \`uv add\`, which manage the environment automatically and lock exact versions for reproducible deployments.
**Q9. Name some differences between Python 2 and Python 3.**
\`print\` is a function in Python 3, not a statement; \`/\` returns a float (use \`//\` for floor division); strings are Unicode by default; \`range()\` returns a lazy object instead of a list; \`input()\` always returns a string. Python 2 reached end of life in January 2020.
**Q10. What is the Zen of Python?**
A set of 19 aphorisms by Tim Peters (PEP 20), viewable with \`import this\`, that capture Python's design philosophy: readability counts, explicit is better than implicit, simple is better than complex, errors should never pass silently, and there should be one obvious way to do it.`
    },
    {
      heading: "17. Hands-On Exercise: Build a Canteen Bill Splitter",
      content: `Put everything together by building a small interactive command-line program that practises the exact skills from this lecture: a project with a virtual environment, a script with a docstring and \`main()\` guard, \`print()\` with f-string formatting, \`input()\` with conversion, and correct indentation.
**Task:** write \`bill_splitter.py\`. The program asks for the group leader's name, the city, the total canteen bill in rupees, the number of friends sharing it and the tip percentage. It then prints a neatly aligned receipt showing the bill, GST at 5% (the rate for restaurant food in India), the tip, the grand total and the per-person share.
**Steps:**
1. Create a folder \`python-course\`, open it in VS Code, and create the environment with \`python -m venv .venv\` (or \`uv init\` if you installed uv). Select the interpreter in VS Code.
2. Create \`bill_splitter.py\` and type the code in the snippet yourself rather than pasting it; typing builds muscle memory for indentation and colons.
3. Run it with \`python bill_splitter.py\` (or \`uv run bill_splitter.py\`). Test with a bill of 1,540 rupees shared by 4 friends with a 10% tip; the per-person amount should be ₹442.75.
4. Deliberately break the program: remove one indentation level, delete a colon, type letters instead of a number. Read each error message carefully; learning to read tracebacks is a core skill.
5. **Stretch goals:** print a dotted separator using \`sep\` and \`end\`; write the receipt to a file by passing \`file=\` to \`print\`; make the GST rate configurable through \`input()\` with a default of 5 when the user presses Enter without typing anything (hint: \`or\`).
Commit your work with Git and make sure \`.venv/\` is in \`.gitignore\`. From the next lecture onwards, every exercise assumes this project folder exists.`,
      codeSnippet: `# bill_splitter.py — Lecture 1 hands-on exercise
"""Split a canteen bill among friends, Indian style.

Run:  python bill_splitter.py
"""

GST_RATE = 0.05          # 5% GST on restaurant food in India


def main() -> None:
    print("=" * 40)
    print("   Canteen Bill Splitter")
    print("=" * 40)

    leader = input("Group leader's name: ").strip()
    city = input("City: ").strip()
    bill = float(input("Total bill (₹): "))
    friends = int(input("Number of friends sharing: "))
    tip_percent = float(input("Tip percentage (e.g. 10): "))

    gst = bill * GST_RATE
    tip = bill * tip_percent / 100
    grand_total = bill + gst + tip
    per_person = grand_total / friends

    print()
    print(f"Receipt for {leader}'s group in {city}")
    print("-" * 40)
    print(f"{'Bill amount':<24}₹{bill:>14,.2f}")
    print(f"{'GST @ 5%':<24}₹{gst:>14,.2f}")
    print(f"{f'Tip @ {tip_percent:g}%':<24}₹{tip:>14,.2f}")
    print("-" * 40)
    print(f"{'Grand total':<24}₹{grand_total:>14,.2f}")
    print(f"{'Friends':<24}{friends:>15}")
    print(f"{'Each person pays':<24}₹{per_person:>14,.2f}")
    print("=" * 40)
    print("Thank you, enjoy your chai!", end="\\n\\n")


if __name__ == "__main__":
    main()

# Sample session:
# ========================================
#    Canteen Bill Splitter
# ========================================
# Group leader's name: Aarav
# City: Pune
# Total bill (₹): 1540
# Number of friends sharing: 4
# Tip percentage (e.g. 10): 10
#
# Receipt for Aarav's group in Pune
# ----------------------------------------
# Bill amount             ₹      1,540.00
# GST @ 5%                ₹         77.00
# Tip @ 10%               ₹        154.00
# ----------------------------------------
# Grand total             ₹      1,771.00
# Friends                               4
# Each person pays        ₹        442.75
# ========================================
# Thank you, enjoy your chai!`
    },
    {
      heading: "18. Summary",
      content: `• **Python** is a high-level, general-purpose, dynamically typed language used for web backends (Django, FastAPI), data science (pandas, NumPy), AI/ML (PyTorch, Transformers), automation and testing.
• Python is **interpreted**: CPython compiles source to bytecode (cached in \`__pycache__\`) and the Python Virtual Machine executes it. CPython is the reference implementation; PyPy, MicroPython and Pyodide serve special needs.
• Install the **latest stable Python 3** from python.org (3.14 series now, 3.15 due October 2026). On Windows tick "Add python.exe to PATH"; on macOS use Homebrew or the official installer and type \`python3\`; on Linux use your package manager plus \`python3-venv\`. \`uv python install\` works everywhere.
• The **REPL** (\`>>>\`) is for experiments; Python 3.13+ has colours, multi-line editing and \`exit\` without parentheses. Real programs live in \`.py\` files run with \`python file.py\`.
• Set up **VS Code** with the Python extension (Pylance) and Ruff, open a folder, and choose your interpreter with "Python: Select Interpreter".
• **Indentation is syntax**: 4 spaces per level, a colon opens every block, never mix tabs and spaces.
• \`#\` starts a **comment**; a triple-quoted **docstring** as the first statement documents modules, classes and functions and is shown by \`help()\`.
• \`print()\` supports \`sep\`, \`end\`, \`file\` and \`flush\`; **f-strings** with format specs like \`{x:,.2f}\` are the modern way to format output. \`input()\` always returns a **string**; convert with \`int()\` or \`float()\`.
• Use one **virtual environment per project**: \`python -m venv .venv\` + pip + \`requirements.txt\`, or \`uv init\` / \`uv add\` / \`uv run\` with \`pyproject.toml\` and \`uv.lock\`. Never commit \`.venv\`.
• \`import this\` prints the **Zen of Python**; readability, explicitness and simplicity are the values your code will be reviewed against.
**Next lecture:** Variables, Data Types, Operators & Strings`
    }
  ]
};
