export const lecture07 = {
  slug: "lecture-7",
  number: 7,
  title: "Complete Python Course — Lecture 7: Modules, Packages, Dependencies & Project Structure",
  summary: "Master Python modules and the import system, if __name__ == \"__main__\", packages and __init__.py, relative vs absolute imports, the standard library, pip and PyPI, virtual environments, requirements.txt, pyproject.toml, uv lockfiles, the src layout and publishing a package to PyPI.",
  readTime: "75 min read",
  difficulty: "Intermediate",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. Introduction: Why Modules, Packages and Dependency Management Matter in Real Python Projects",
      content: `Until now every program in this course lived in a single file. That is fine for learning syntax, but no real project looks like that. A FastAPI backend at a Bengaluru startup has dozens of files; a data pipeline at a bank imports pandas, SQLAlchemy and a company-internal library; an automation script you wrote last year must still run next year on a new laptop with the same versions of everything. **Modules**, **packages** and **dependency management** are the tools that make all of this possible.
A **module** is simply a \`.py\` file that you can import. A **package** is a folder of modules. The **import system** is the machinery that finds them. **pip**, **PyPI**, **virtual environments**, **requirements.txt**, **pyproject.toml** and **uv** are the tools that fetch other people's packages and freeze the exact versions so your project behaves identically on every machine. **Project structure** (in particular the **src layout**) is the convention that keeps a growing codebase testable and installable.
Why does this matter for your career? Because almost every production incident caused by "it works on my machine" traces back to one of these topics: a missing virtual environment, an unpinned dependency that updated overnight, a circular import nobody noticed, or a test that passed only because it accidentally imported a stale local file instead of the installed package. Interviewers ask about \`if __name__ == "__main__"\`, relative imports and lockfiles precisely because they reveal whether you have shipped real software.
This lecture is written for Python 3.11 and newer. At the time of writing, Python 3.14 is the current stable series and Python 3.15 is arriving in October 2026; where a feature depends on a specific version it is labelled. For tooling we teach both the classic **venv + pip** workflow (which you will meet on every server) and the modern **uv** workflow (which is quickly becoming the default for new projects). By the end you will build, test, run and package a complete command-line application using the src layout.`
    },
    {
      heading: "2. Python Modules and the Import System: How import Actually Works",
      content: `A **module** is any file ending in \`.py\`. The file \`taxes.py\` is the module \`taxes\`, and \`import taxes\` loads it. Every module gets its own **namespace**, so a function named \`calculate\` in \`taxes.py\` never collides with another \`calculate\` in \`shipping.py\`. This is the first and most important reason modules exist: they isolate names.
When Python executes \`import taxes\`, it performs a well-defined sequence of steps:
1. It checks **\`sys.modules\`**, a dictionary cache of every module already imported in this process. If \`taxes\` is there, Python returns the cached object immediately. This is why importing the same module from twenty files costs nothing and why module-level code runs only once.
2. If not cached, it searches each directory in **\`sys.path\`** in order. \`sys.path[0]\` is the directory of the script you ran (or an empty string meaning the current directory in the REPL), followed by any directories in the \`PYTHONPATH\` environment variable, then the standard library, then \`site-packages\` where pip and uv install third-party packages.
3. It compiles the source to bytecode, caches it in a \`__pycache__/taxes.cpython-314.pyc\` file so the next startup is faster, executes the module top to bottom, and stores the resulting module object in \`sys.modules\`.
There are four import forms you will use daily. \`import math\` binds the whole module. \`import numpy as np\` binds it under an alias. \`from pathlib import Path\` copies one name into your namespace. \`from os.path import join as path_join\` does both. Avoid \`from module import *\` in real code: it pulls in every public name, hides where things came from, and silently overwrites your own variables. A module can limit what the star form exports by defining a list named **\`__all__\`**.
Two practical details: the special variable \`__name__\` holds the module's import name, and \`__file__\` holds its path on disk. The function \`dir(module)\` lists its names, \`help(module)\` prints its docstring, and \`importlib.reload(module)\` re-executes it during interactive experiments. Finally, \`python -X importtime script.py\` prints how long each import took, which is the first thing to run when a CLI tool starts slowly.`,
      codeSnippet: `# taxes.py — a tiny module
"""GST helpers for Indian invoices."""

GST_RATES = {"essential": 0.05, "standard": 0.18, "luxury": 0.28}
__all__ = ["add_gst"]          # only this name is exported by "from taxes import *"

def add_gst(amount: float, category: str = "standard") -> float:
    """Return amount including GST for the given category."""
    return round(amount * (1 + GST_RATES[category]), 2)

def _secret_helper():          # leading underscore = private by convention
    return "not for export"

print(f"taxes module loaded as {__name__!r}")   # runs exactly once per process


# main.py — four ways to import
import sys
import taxes                                    # prints: taxes module loaded as 'taxes'
import taxes as t                               # cached: nothing printed the second time
from taxes import add_gst
from taxes import GST_RATES as RATES

print(add_gst(1000))                            # 1180.0
print(t.add_gst(1000, "essential"))             # 1050.0
print(RATES["luxury"])                          # 0.28
print("taxes" in sys.modules)                   # True — the module cache
print(taxes.__file__)                           # /home/ravi/project/taxes.py
print(sys.path[0])                              # directory containing main.py
print([n for n in dir(taxes) if not n.startswith("__")])
# ['GST_RATES', '_secret_helper', 'add_gst']`
    },
    {
      heading: "3. if __name__ == \"__main__\": Writing Modules That Are Both Importable and Runnable",
      content: `Open any serious Python file and you will find this block near the bottom. To understand it you need one fact: **Python sets \`__name__\` differently depending on how a file is loaded.** When you run \`python taxes.py\` directly, Python sets \`__name__\` to the string \`"__main__"\`. When another file does \`import taxes\`, Python sets \`__name__\` to \`"taxes"\`. The condition \`if __name__ == "__main__":\` is therefore true only in the first case.
This lets one file serve two purposes. As a **library**, it exposes functions for other modules to import without side effects. As a **script**, it runs a demo, a CLI, or a quick test when executed directly. Without the guard, every \`print\` and every \`input()\` call in the file would run the moment someone imported it, which is exactly the bug that makes \`import report\` unexpectedly start generating a 400-page PDF.
The idiomatic pattern is to put all script behaviour in a function called \`main()\` and keep the guard to a single line. This has three benefits: \`main()\` can be tested by calling it with arguments, the variables inside it do not leak into the module's global namespace, and the module stays importable. Returning an integer exit code from \`main()\` and passing it to \`sys.exit()\` or \`raise SystemExit(...)\` is the convention that shell scripts and CI pipelines rely on: 0 means success, anything else means failure.
Two related facts matter for the next sections. First, \`python -m module_name\` runs a module by its import name instead of its path; the module still sees \`__name__ == "__main__"\`, but \`sys.path[0]\` becomes the current directory, which makes relative imports inside packages work. Second, a package can define a file named **\`__main__.py\`**, and \`python -m package_name\` executes it. That is how \`python -m pip\`, \`python -m venv\`, \`python -m http.server\` and \`python -m json.tool\` work.`,
      codeSnippet: `# emi.py — importable library AND runnable script
import sys

def monthly_emi(principal: float, annual_rate: float, years: int) -> float:
    """Equated monthly instalment for a loan."""
    r = annual_rate / 12 / 100
    n = years * 12
    return principal * r * (1 + r) ** n / ((1 + r) ** n - 1)

def main(argv: list[str] | None = None) -> int:
    args = argv if argv is not None else sys.argv[1:]
    if len(args) != 3:
        print("usage: python emi.py PRINCIPAL ANNUAL_RATE YEARS", file=sys.stderr)
        return 2                                     # non-zero = error for the shell
    principal, rate, years = float(args[0]), float(args[1]), int(args[2])
    print(f"EMI: ₹{monthly_emi(principal, rate, years):,.2f} per month")
    return 0

print(f"__name__ is {__name__!r}")

if __name__ == "__main__":
    raise SystemExit(main())

# $ python emi.py 2500000 8.5 20
# __name__ is '__main__'
# EMI: ₹21,695.65 per month
#
# >>> import emi
# __name__ is 'emi'        <- main() did NOT run; only the function is available
# >>> emi.monthly_emi(500000, 9, 5)
# 10379.030...`
    },
    {
      heading: "4. Python Packages, __init__.py and __main__.py",
      content: `When a project grows past a handful of modules you group them into a **package**: a directory that contains an \`__init__.py\` file plus any number of modules and sub-packages. If the folder \`shop/\` contains \`__init__.py\`, \`cart.py\` and \`payments/upi.py\` (with its own \`__init__.py\`), then \`import shop.cart\` and \`from shop.payments import upi\` both work. Dotted names map directly to directories, which keeps large codebases navigable.
**\`__init__.py\`** is executed the first time the package or anything inside it is imported. It can be completely empty, and for most sub-packages it should be. In the top-level package it is commonly used for three things: defining \`__version__\`, re-exporting the public API so users can write \`from shop import Cart\` instead of \`from shop.cart import Cart\`, and defining \`__all__\`. Resist the temptation to put heavy logic in \`__init__.py\`; everything in it runs even when a user imports one tiny helper, slowing startup and inviting circular imports.
Since Python 3.3 (PEP 420) a directory without \`__init__.py\` is still importable as a **namespace package**. This is intended for a specific case: letting several separately installed distributions share one top-level name (for example several \`company_tools.*\` plugins). For ordinary application code always include \`__init__.py\`; it makes the package's identity explicit, lets tools such as pytest and type checkers find it reliably, and avoids surprises when two folders with the same name appear on \`sys.path\`.
**\`__main__.py\`** turns a package into a runnable program. \`python -m shop\` executes \`shop/__main__.py\` with \`__name__ == "__main__"\`. Keep it tiny: import the real entry point from a module such as \`cli.py\` and call it. That way the same \`main()\` function can also be wired to a console script in \`pyproject.toml\` (covered later) so users can type \`shop\` instead of \`python -m shop\`.
Two housekeeping notes. Python writes \`__pycache__\` folders next to your modules; add \`__pycache__/\` and \`*.pyc\` to \`.gitignore\`. And for package data such as templates or a default config file, use \`importlib.resources.files("shop") / "data.json"\` (Python 3.9+) rather than building paths from \`__file__\`, because the former still works when the package is installed as a zip or wheel.`,
      codeSnippet: `# Project layout
# shop/
# ├── __init__.py
# ├── __main__.py
# ├── cart.py
# └── payments/
#     ├── __init__.py
#     └── upi.py

# shop/__init__.py — public API of the package
"""shop: a tiny e-commerce toolkit."""
__version__ = "1.2.0"

from .cart import Cart                 # re-export so users can do: from shop import Cart
from .payments.upi import pay_with_upi

__all__ = ["Cart", "pay_with_upi", "__version__"]

# shop/cart.py
from dataclasses import dataclass, field

@dataclass
class Cart:
    items: dict[str, float] = field(default_factory=dict)

    def add(self, name: str, price: float) -> None:
        self.items[name] = price

    def total(self) -> float:
        return sum(self.items.values())

# shop/payments/__init__.py        (intentionally empty)

# shop/payments/upi.py
def pay_with_upi(amount: float, vpa: str) -> str:
    return f"Paid ₹{amount:,.2f} to {vpa} via UPI"

# shop/__main__.py — makes "python -m shop" work
from . import Cart, pay_with_upi, __version__

def main() -> None:
    cart = Cart()
    cart.add("Keyboard", 1499)
    cart.add("Mouse", 699)
    print(f"shop v{__version__}: total ₹{cart.total():,.2f}")
    print(pay_with_upi(cart.total(), "ravi@upi"))

if __name__ == "__main__":
    main()

# $ python -m shop
# shop v1.2.0: total ₹2,198.00
# Paid ₹2,198.00 to ravi@upi via UPI`
    },
    {
      heading: "5. Relative vs Absolute Imports in Python (and How to Avoid Circular Imports)",
      content: `Inside a package there are two ways to refer to a sibling module. An **absolute import** names the full path from the top-level package: \`from shop.payments.upi import pay_with_upi\`. A **relative import** uses leading dots: \`from .upi import pay_with_upi\` means "from the \`upi\` module in my own package", and \`from ..cart import Cart\` means "go up one package level". One dot is the current package, two dots the parent, three the grandparent.
Which should you use? PEP 8 recommends **absolute imports** as the default because they are explicit, searchable with grep, and unaffected by moving a file. Relative imports are acceptable inside a package for sibling modules, and they shine when the package may be renamed or vendored under a different name. Whichever you pick, be consistent across the project. Never rely on the Python 2 style implicit relative import (\`import upi\` meaning the sibling file); in Python 3 that looks for a top-level module called \`upi\` and fails.
The most common error students hit is \`ImportError: attempted relative import with no known parent package\`. It appears when you run a file inside a package directly, for example \`python shop/payments/upi.py\`. Python then treats \`upi.py\` as a standalone top-level script with \`__name__ == "__main__"\` and no \`__package__\`, so the dots have nothing to resolve against. The fix is to run it as a module from the project root: \`python -m shop.payments.upi\`. Equivalently, keep runnable code in \`__main__.py\` or a console script and keep library modules free of top-level execution.
The second classic problem is the **circular import**: \`models.py\` imports \`services.py\` and \`services.py\` imports \`models.py\`. Because the first module is only partially initialised when the second starts importing it, you get \`ImportError: cannot import name 'User' from partially initialized module\`. Fixes, in order of preference: restructure so shared types live in a third module both can import; import the module (\`import models\`) rather than names (\`from models import User\`) so the attribute lookup happens later at call time; move the import inside the function that needs it; or, for type hints only, put the import under \`if TYPE_CHECKING:\` and add \`from __future__ import annotations\`. Python 3.15 is adding an explicit \`lazy import\` statement (PEP 810) that defers loading until first use, which will make the function-level trick unnecessary in many cases.`,
      codeSnippet: `# shop/payments/upi.py — absolute vs relative imports side by side
from shop.cart import Cart          # absolute: full path from the top-level package
from ..cart import Cart             # relative: ".." = parent package "shop"
from . import limits                # relative: sibling module shop/payments/limits.py

# $ python shop/payments/upi.py
# ImportError: attempted relative import with no known parent package
# $ python -m shop.payments.upi     # correct: run as a module from the project root


# ---- Breaking a circular import with TYPE_CHECKING ----
# shop/models.py
from __future__ import annotations          # hints become strings, evaluated lazily
from typing import TYPE_CHECKING
from dataclasses import dataclass

if TYPE_CHECKING:                           # only the type checker runs this import
    from shop.services import OrderService

@dataclass
class Order:
    order_id: int
    amount: float

    def submit(self, service: OrderService) -> str:
        return service.place(self)          # the real object arrives at runtime

# shop/services.py
from shop.models import Order               # safe: models.py never imports services at runtime

class OrderService:
    def place(self, order: Order) -> str:
        return f"Order {order.order_id} for ₹{order.amount:,.2f} placed"`
    },
    {
      heading: "6. A Tour of the Python Standard Library: Batteries Included",
      content: `Python ships with more than two hundred modules, which is what "batteries included" means. Knowing what already exists saves you from installing a third-party package for every small job and from reinventing bug-prone code. Here is a map of the modules you will reach for most often, grouped by task.
• **Files and paths:** \`pathlib\` (object-oriented paths; prefer it over \`os.path\`), \`shutil\` (copy, move, delete trees), \`tempfile\`, \`glob\`, \`os\` (environment variables, process info).
• **Data formats:** \`json\`, \`csv\`, \`tomllib\` (read TOML, Python 3.11+, used for \`pyproject.toml\`), \`xml.etree\`, \`sqlite3\` (a full relational database with zero setup), \`pickle\` (Python-only serialisation; never load untrusted data), \`base64\`, \`zipfile\`.
• **Dates and time:** \`datetime\`, \`zoneinfo\` (IANA time zones such as \`Asia/Kolkata\`, Python 3.9+), \`time\`, \`calendar\`.
• **Text:** \`re\` (regular expressions), \`string\`, \`textwrap\`, \`difflib\`, \`unicodedata\`.
• **Data structures and algorithms:** \`collections\` (\`Counter\`, \`defaultdict\`, \`deque\`, \`namedtuple\`), \`itertools\`, \`functools\` (\`lru_cache\`, \`partial\`, \`reduce\`), \`heapq\`, \`bisect\`, \`enum\`, \`dataclasses\`, \`typing\`.
• **Maths and numbers:** \`math\`, \`statistics\`, \`random\`, \`secrets\` (cryptographically secure tokens), \`decimal\` (exact money arithmetic), \`fractions\`.
• **System and processes:** \`sys\`, \`argparse\` (command-line parsing), \`subprocess\`, \`logging\`, \`signal\`, \`platform\`.
• **Concurrency:** \`threading\`, \`multiprocessing\`, \`concurrent.futures\`, \`asyncio\`.
• **Networking and web:** \`urllib.request\`, \`http.server\`, \`socket\`, \`email\`, \`smtplib\`, \`ssl\`. (For real HTTP work most teams install \`httpx\` or \`requests\`, but the standard library is enough for scripts.)
• **Testing and tooling:** \`unittest\`, \`doctest\`, \`venv\`, \`timeit\`, \`cProfile\`, \`pdb\`, \`importlib\`.
A few modules deserve special mention because beginners overlook them. \`sqlite3\` lets you prototype a database-backed app without installing anything. \`decimal\` is the correct type for rupees and paise because binary floats cannot represent 0.1 exactly. \`secrets.token_urlsafe()\` is the right way to generate password-reset tokens; \`random\` is not. \`tomllib\` means you can read configuration files with no third-party dependency. The official documentation at docs.python.org has a "Library Reference" index; skimming the module names once is one of the highest-return hours in your Python education.`,
      codeSnippet: `# stdlib_tour.py — a quick tour of commonly used standard library modules
import json, re, sqlite3, statistics, tomllib
from collections import Counter, defaultdict
from datetime import datetime, timedelta
from decimal import Decimal
from functools import lru_cache
from pathlib import Path
from zoneinfo import ZoneInfo

# pathlib: write and read a file without os.path gymnastics
data_dir = Path("data"); data_dir.mkdir(exist_ok=True)
orders_file = data_dir / "orders.json"
orders_file.write_text(json.dumps([
    {"city": "Pune", "amount": 1299.0}, {"city": "Delhi", "amount": 450.0},
    {"city": "Pune", "amount": 2100.0}, {"city": "Chennai", "amount": 999.0},
]), encoding="utf-8")
orders = json.loads(orders_file.read_text(encoding="utf-8"))

# collections + statistics
by_city = Counter(o["city"] for o in orders)
totals = defaultdict(float)
for o in orders:
    totals[o["city"]] += o["amount"]
print(by_city.most_common(1))                    # [('Pune', 2)]
print(statistics.median(o["amount"] for o in orders))   # 1149.0

# decimal for money: floats drift, Decimal does not
print(0.1 + 0.2)                                 # 0.30000000000000004
print(Decimal("0.1") + Decimal("0.2"))           # 0.3

# datetime + zoneinfo (3.9+)
ist = ZoneInfo("Asia/Kolkata")
delivery = datetime.now(tz=ist) + timedelta(days=3)
print(delivery.strftime("%d %b %Y, %I:%M %p %Z"))   # 12 Oct 2026, 09:15 AM IST

# re: pull Indian PIN codes out of free text
print(re.findall(r"\\b[1-9][0-9]{5}\\b", "Ship to Pune 411001 or Delhi 110001"))
# ['411001', '110001']

# tomllib (3.11+): read pyproject-style config with zero dependencies
config = tomllib.loads('[app]\\nname = "shop"\\nworkers = 4')
print(config["app"]["workers"])                  # 4

# sqlite3: a real database in one line of setup
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE orders(city TEXT, amount REAL)")
conn.executemany("INSERT INTO orders VALUES (?, ?)", [(o["city"], o["amount"]) for o in orders])
print(conn.execute("SELECT city, SUM(amount) FROM orders GROUP BY city ORDER BY 2 DESC").fetchall())
# [('Pune', 3399.0), ('Chennai', 999.0), ('Delhi', 450.0)]

# functools.lru_cache: memoise an expensive pure function
@lru_cache(maxsize=None)
def fib(n: int) -> int:
    return n if n < 2 else fib(n - 1) + fib(n - 2)
print(fib(80))                                   # 23416728348467685 (instant)`
    },
    {
      heading: "7. pip and PyPI: Installing Third-Party Python Packages",
      content: `The **Python Package Index (PyPI)** at pypi.org hosts over half a million open-source packages: web frameworks such as FastAPI and Django, data tools such as pandas and NumPy, HTTP clients such as httpx, and countless small utilities. **pip** is the installer that ships with Python and downloads packages from PyPI into your environment's \`site-packages\` directory.
Always invoke pip as \`python -m pip\` rather than bare \`pip\`. On machines with several Python versions, bare \`pip\` may belong to a different interpreter than the \`python\` you are about to run, which produces the maddening "I installed it but ModuleNotFoundError" situation. \`python -m pip\` guarantees the two match.
Packages are published as **wheels** (\`.whl\` files, pre-built, fast to install) and **source distributions** (\`.tar.gz\`, built on your machine, which may require a C compiler). pip prefers wheels. Each package declares its own dependencies, and pip resolves the full graph: installing \`fastapi\` also pulls in \`starlette\`, \`pydantic\` and \`typing-extensions\`.
**Version specifiers** (defined in PEP 440) control which release pip may choose. \`httpx==0.28.1\` pins exactly; \`httpx>=0.27\` sets a floor; \`httpx>=0.27,<1.0\` sets a range; \`httpx~=0.28.0\` means "compatible release", equivalent to \`>=0.28.0,<0.29\`. Package names are case-insensitive and treat \`-\` and \`_\` as equal, so \`scikit-learn\` and \`scikit_learn\` refer to the same project, although the import name (\`sklearn\`) can differ from the distribution name.
The commands you need daily are \`install\`, \`uninstall\`, \`list\`, \`show\` (which prints a package's version, location and dependencies), \`list --outdated\` and \`install --upgrade\`. \`pip install -e .\` performs an **editable install** of your own project: it links \`site-packages\` to your source directory so edits take effect immediately without reinstalling. Modern Linux distributions block \`pip install\` into the system Python (PEP 668, "externally managed environment"); the correct response is to create a virtual environment, which is the next section. Never use \`sudo pip install\`.`,
      codeSnippet: `# Shell session (Windows PowerShell, macOS or Linux) — pip essentials

# Check which pip you are using (should match your python)
python -m pip --version
# pip 25.2 from .../site-packages/pip (python 3.14)

# Install packages with version specifiers
python -m pip install httpx                       # latest
python -m pip install "httpx>=0.27,<1.0"           # range (quote it in the shell)
python -m pip install "pandas~=2.2.0"              # compatible release: >=2.2.0,<2.3
python -m pip install "fastapi[standard]"          # with an optional "extra"

# Inspect what is installed
python -m pip list
python -m pip show httpx
# Name: httpx
# Version: 0.28.1
# Location: /home/ravi/.venv/lib/python3.14/site-packages
# Requires: anyio, certifi, httpcore, idna
python -m pip list --outdated

# Upgrade, uninstall, editable install of the current project
python -m pip install --upgrade httpx
python -m pip uninstall httpx
python -m pip install -e .                         # your own project, linked not copied

# Using it — distribution name vs import name can differ
python -c "import httpx; print(httpx.__version__)"
python -c "import sklearn"      # installed as scikit-learn, imported as sklearn`
    },
    {
      heading: "8. Virtual Environments (venv) and requirements.txt: Isolating and Reproducing Dependencies",
      content: `If you install every package into one global Python, projects soon fight each other: project A needs Django 4.2 while project B needs Django 5.1, and only one can win. A **virtual environment** is a self-contained folder with its own interpreter link and its own \`site-packages\`, so each project has exactly the packages it needs and nothing else. It is the single most important habit in this lecture: **one project, one virtual environment, never install into the system Python.**
The standard library module \`venv\` creates one with \`python -m venv .venv\`. The name \`.venv\` is a convention that editors such as VS Code and tools such as uv recognise automatically. **Activating** it (\`source .venv/bin/activate\` on macOS and Linux, \`.venv\\Scripts\\activate\` on Windows) puts its \`bin\` or \`Scripts\` folder first on your \`PATH\`, so \`python\` and \`pip\` now refer to the environment. Your prompt shows \`(.venv)\` as a reminder; \`deactivate\` restores the shell. Activation is a convenience, not a requirement: running \`.venv/bin/python script.py\` directly works just as well, which is how CI servers and Dockerfiles usually do it. Since Python 3.13, \`venv\` writes a \`.gitignore\` inside the environment so it is never committed by accident; on older versions add \`.venv/\` to your project's \`.gitignore\` yourself.
Isolation solves "which packages", but a teammate still needs to know which **versions**. The classic answer is a **requirements.txt** file: one specifier per line, installed with \`pip install -r requirements.txt\`. There are two styles. A loose file lists direct dependencies with ranges (\`fastapi>=0.115\`) and is easy to maintain but not reproducible. A **pinned** file produced by \`pip freeze > requirements.txt\` records the exact version of every installed package, including transitive ones, which is reproducible but mixes your real dependencies with their sub-dependencies and goes stale. Teams often keep both: \`requirements.in\` with intentions and a generated, fully pinned \`requirements.txt\` (the tool \`pip-tools\` provides \`pip-compile\` for this; uv provides \`uv pip compile\` as a drop-in). A separate \`requirements-dev.txt\` beginning with \`-r requirements.txt\` adds test and lint tools.
requirements.txt remains everywhere in deployment scripts, Dockerfiles and tutorials, so you must know it. But it has no standard place to record project metadata, Python version or build settings. That gap is what \`pyproject.toml\` and lockfiles fill in the next sections.`,
      codeSnippet: `# ---- Create and use a virtual environment ----
# macOS / Linux
python3 -m venv .venv
source .venv/bin/activate
(.venv) $ python -m pip install "fastapi[standard]" "httpx>=0.27"
(.venv) $ which python
/home/ravi/projects/shop/.venv/bin/python
(.venv) $ deactivate

# Windows PowerShell
py -m venv .venv
.venv\\Scripts\\activate
(.venv) PS> python -m pip install "fastapi[standard]" "httpx>=0.27"

# Without activating (CI, Docker, cron jobs)
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python main.py

# ---- requirements.in : what YOU depend on (hand-written) ----
fastapi[standard]>=0.115
httpx>=0.27,<1.0
pandas~=2.2

# ---- requirements.txt : fully pinned, generated, committed ----
# produced by:  pip freeze > requirements.txt   (or pip-compile / uv pip compile requirements.in)
anyio==4.11.0
fastapi==0.118.0
httpx==0.28.1
pandas==2.2.3
pydantic==2.11.9
starlette==0.48.0
# ...every transitive dependency, exact versions

# ---- requirements-dev.txt ----
-r requirements.txt
pytest>=8
ruff>=0.13

# Install everything on a fresh machine
python -m pip install -r requirements-dev.txt`
    },
    {
      heading: "9. pyproject.toml: The Modern Python Project Configuration File",
      content: `**pyproject.toml** is the single, standardised configuration file for a Python project. Introduced by PEP 518 and expanded by PEP 621, it replaced the old \`setup.py\`, \`setup.cfg\`, \`MANIFEST.in\` and a drawer full of tool-specific dotfiles. Every modern tool (pip, uv, Poetry, Hatch, pytest, Ruff, mypy, coverage) reads it. If you create a new project today, this file is where its identity lives.
It is written in **TOML**, a simple key-value format with sections in square brackets. The important tables are:
• **\`[project]\`** — metadata: \`name\`, \`version\`, \`description\`, \`readme\`, \`requires-python\`, \`license\`, \`authors\`, \`classifiers\`, and most importantly **\`dependencies\`**, a list of specifiers exactly like requirements lines. This is the authoritative list of what your code needs to run.
• **\`[project.optional-dependencies]\`** — named **extras** that users opt into, such as \`fastapi[standard]\`. Define \`pdf = ["reportlab>=4"]\` and users install \`your-package[pdf]\`.
• **\`[dependency-groups]\`** (PEP 735, 2024) — groups for developers rather than users, typically \`dev = ["pytest", "ruff"]\`. Unlike extras these are never published as part of your package. uv and recent pip understand them.
• **\`[project.scripts]\`** — console entry points. \`shop = "shop.cli:main"\` makes installing your package create an executable named \`shop\` that calls \`main()\` in \`shop/cli.py\`. This is how \`pytest\`, \`uvicorn\` and \`ruff\` become commands.
• **\`[build-system]\`** — which backend turns your source into a wheel. \`hatchling\` is a popular, simple choice; \`setuptools\`, \`flit-core\` and \`uv_build\` also work. Applications that are never packaged can omit this table.
• **\`[tool.*]\`** — settings for individual tools: \`[tool.pytest.ini_options]\`, \`[tool.ruff]\`, \`[tool.mypy]\`, \`[tool.uv]\`. One file, no clutter.
Two practical rules. Keep \`dependencies\` loose (ranges or minimums) in a library so it coexists with other packages; the exact versions belong in a lockfile. And read \`pyproject.toml\` at runtime with the standard library's \`tomllib\` when you need, for example, your own version string, or better, use \`importlib.metadata.version("shop")\` after installation.`,
      codeSnippet: `# pyproject.toml — a complete, realistic example
[project]
name = "shop"
version = "1.2.0"
description = "Order and payment helpers for a small Indian e-commerce store"
readme = "README.md"
requires-python = ">=3.11"
license = "MIT"
authors = [{ name = "Ravindra Nath Jha", email = "ravi@example.com" }]
keywords = ["ecommerce", "upi", "gst"]
classifiers = [
  "Programming Language :: Python :: 3",
  "Operating System :: OS Independent",
]
dependencies = [
  "httpx>=0.27,<1.0",
  "pydantic>=2.5,<3",
]

[project.optional-dependencies]
pdf = ["reportlab>=4"]                 # pip install "shop[pdf]"

[dependency-groups]                    # PEP 735: for developers only, never published
dev = ["pytest>=8", "ruff>=0.13", "mypy>=1.14"]

[project.scripts]
shop = "shop.cli:main"                 # creates a "shop" command on install

[project.urls]
Homepage = "https://github.com/ravindra/shop"

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.pytest.ini_options]
testpaths = ["tests"]
addopts = "-q"

[tool.ruff]
line-length = 100
target-version = "py311"


# Reading your own metadata at runtime (after "pip install -e ." or "uv sync")
# shop/cli.py
from importlib.metadata import version
print(version("shop"))                 # 1.2.0`
    },
    {
      heading: "10. uv: Fast Python Project Management, Lockfiles and Scripts",
      content: `**uv** is a Python package and project manager written in Rust by Astral, the makers of Ruff. It replaces \`venv\`, \`pip\`, \`pip-tools\`, \`pyenv\` and \`twine\` with one command, and it is 10 to 100 times faster than pip because it resolves in parallel and caches aggressively. Install it once (\`pip install uv\`, \`pipx install uv\`, or the standalone installer from docs.astral.sh) and it manages everything else, including downloading Python interpreters.
The project workflow has five commands. \`uv init shop\` creates a folder with \`pyproject.toml\`, a \`.python-version\` file, \`README.md\` and a starter \`main.py\`; add \`--package\` to get the src layout and a console script, or \`--lib\` for a library. \`uv add httpx\` writes the dependency into \`pyproject.toml\`, resolves the whole graph, updates **\`uv.lock\`** and installs into \`.venv\` in one step; \`uv add --dev pytest\` puts it in the \`dev\` dependency group. \`uv remove httpx\` reverses it. \`uv sync\` reads \`uv.lock\` and makes the environment match it exactly, creating \`.venv\` if needed. \`uv run pytest\` (or \`uv run python main.py\`) executes a command inside the environment, syncing first if anything changed, so you never need to activate it.
**uv.lock** is the key file. It records the exact version, source and hash of every package for every platform, so a teammate on Windows and a Linux container both install the identical set. Commit it for applications. In CI use \`uv sync --frozen\` (or \`--locked\`) so the build fails if the lock is out of date instead of silently re-resolving. \`uv lock --upgrade\` or \`uv lock --upgrade-package httpx\` updates deliberately. For deployment scripts that still expect pip, \`uv export --format requirements-txt > requirements.txt\` converts the lock; \`uv export --format pylock.toml\` produces the standardised lockfile format defined by PEP 751 (2025), which recent pip versions can install from directly.
uv also brings two features worth knowing. \`uv python install 3.13\` downloads and manages interpreters, and \`.python-version\` pins which one the project uses. And **inline script metadata** (PEP 723): a comment block at the top of a single-file script declares its dependencies, and \`uv run script.py\` creates a throwaway environment with exactly those packages. This is the best way to ship a one-off automation script to a colleague: one file, no setup instructions. For legacy workflows, \`uv venv\` and \`uv pip install\` are drop-in, much faster replacements for \`python -m venv\` and \`pip\`.`,
      codeSnippet: `# ---- uv project workflow ----
uv init shop --package          # src layout + console script
cd shop
uv add "httpx>=0.27" pydantic   # writes pyproject.toml, resolves, updates uv.lock, installs
uv add --dev pytest ruff        # [dependency-groups] dev = [...]
uv run pytest                   # runs inside .venv, syncing first if needed
uv run shop                     # the console script defined in [project.scripts]
uv sync --frozen                # CI: install exactly uv.lock, fail if it is stale
uv lock --upgrade-package httpx # deliberate upgrade
uv export --format requirements-txt > requirements.txt   # for pip-only deploy scripts
uv tree                         # print the dependency graph

# ---- managing Python itself ----
uv python install 3.14
uv python pin 3.14              # writes .python-version

# ---- a self-contained script (PEP 723 inline metadata) ----
# fetch_rates.py
# /// script
# requires-python = ">=3.12"
# dependencies = ["httpx>=0.27", "rich>=13"]
# ///
import httpx
from rich import print

resp = httpx.get("https://api.frankfurter.app/latest", params={"from": "USD", "to": "INR"})
resp.raise_for_status()
print(f"[bold green]1 USD = ₹{resp.json()['rates']['INR']}[/bold green]")

# $ uv run fetch_rates.py        # creates a cached, isolated env with httpx + rich, then runs
# 1 USD = ₹83.94

# ---- drop-in replacements for the classic tools ----
uv venv                          # like python -m venv .venv (much faster)
uv pip install -r requirements.txt
uv pip compile requirements.in -o requirements.txt`
    },
    {
      heading: "11. The src Layout and a Recommended Python Project Structure",
      content: `Where you put your package inside the repository matters more than it looks. There are two conventions. In the **flat layout** the package folder \`shop/\` sits directly in the repository root next to \`tests/\` and \`pyproject.toml\`. In the **src layout** it sits one level down, in \`src/shop/\`. The Python Packaging Authority, uv (\`uv init --package\`) and most mature projects now recommend the src layout, and the reason is subtle but important.
Remember that \`sys.path[0]\` is the directory of the script you run, and that pytest and \`python -m\` add the current directory. With a flat layout, running tests from the repository root means \`import shop\` silently picks up the **local source folder**, not the installed package. Your tests pass, you build a wheel, you publish it, and users report that a data file or a sub-package is missing, because the wheel never included it and nothing in your workflow ever tested the installed artefact. With the src layout, \`import shop\` can only succeed if the package is actually installed (editable installs via \`pip install -e .\` or \`uv sync\` do this for you), so your tests exercise exactly what users get. It also prevents accidental imports of stray top-level files such as a \`utils.py\` in the root.
A recommended structure for an application or library is: \`pyproject.toml\` and \`uv.lock\` (or \`requirements.txt\`) at the root; \`README.md\`, \`LICENSE\` and \`.gitignore\`; \`src/shop/\` with \`__init__.py\`, \`__main__.py\`, feature modules and sub-packages; \`tests/\` mirroring the package layout with \`test_*.py\` files and a \`conftest.py\` for shared fixtures; optionally \`docs/\`, \`scripts/\` for one-off maintenance tasks, and \`.github/workflows/\` for CI. Keep the package name in \`[project] name\` and the folder name consistent (hyphens in the distribution name, underscores in the import name, as in \`expense-tracker\` and \`expense_tracker\`).
Inside the package, organise by **feature** rather than by type once it grows: \`shop/orders/\`, \`shop/payments/\`, \`shop/users/\`, each with its own models, services and routes, rather than one giant \`models.py\` holding everything. Every module should have one clear responsibility and a short docstring at the top. Tests should import the public API (\`from shop import Cart\`) so that internal refactors do not break them.`,
      codeSnippet: `# Recommended src layout for an installable Python project
shop/                           # repository root (distribution name: "shop")
├── pyproject.toml              # metadata, dependencies, tool config
├── uv.lock                     # exact pinned versions (commit it for apps)
├── .python-version             # 3.14
├── .gitignore                  # .venv/ __pycache__/ dist/ *.egg-info/
├── README.md
├── LICENSE
├── src/
│   └── shop/                   # import name: "shop"
│       ├── __init__.py         # public API + __version__
│       ├── __main__.py         # python -m shop
│       ├── cli.py              # argparse entry point -> [project.scripts]
│       ├── config.py
│       ├── orders/
│       │   ├── __init__.py
│       │   ├── models.py
│       │   └── service.py
│       └── payments/
│           ├── __init__.py
│           └── upi.py
├── tests/
│   ├── conftest.py             # shared pytest fixtures
│   ├── test_orders.py
│   └── test_payments.py
└── .github/
    └── workflows/
        └── ci.yml

# Why src/ matters — flat layout trap:
#   repo/shop/__init__.py  +  "pytest" from repo/  ->  imports repo/shop directly,
#   so a broken wheel (missing files) still passes every test.
# src layout: "import shop" works only after installation (uv sync / pip install -e .),
#   so tests always exercise the real installed package.`
    },
    {
      heading: "12. Publishing a Python Package to PyPI: An Overview",
      content: `Publishing turns your project into something anyone can \`pip install\`. The flow has four steps: prepare metadata, build the distribution files, upload to the test index, then upload to the real index.
**Prepare.** Your \`pyproject.toml\` needs a \`[build-system]\` table and a complete \`[project]\` table. The \`name\` must be unique on PyPI; check pypi.org first, because \`shop\` is certainly taken while \`ravi-shop-tools\` probably is not. Write a \`README.md\` (it becomes the project page), choose a licence, and pick a version following **semantic versioning**: \`MAJOR.MINOR.PATCH\`, where breaking changes bump MAJOR, new features bump MINOR and fixes bump PATCH. PyPI never allows re-uploading the same version, so every release is a new number.
**Build.** \`uv build\` (or \`python -m build\` with the \`build\` package installed) creates a \`dist/\` folder containing a source distribution (\`shop-1.2.0.tar.gz\`) and a wheel (\`shop-1.2.0-py3-none-any.whl\`). The wheel file name encodes that it is pure Python (\`py3\`), has no ABI requirement (\`none\`) and runs on any platform (\`any\`). Inspect the wheel with \`unzip -l\` to confirm every module and data file is inside; this is the moment the src layout pays for itself.
**Test upload.** Create an account on test.pypi.org, generate an API token, and run \`uv publish --publish-url https://test.pypi.org/legacy/\` with the token (or \`twine upload --repository testpypi dist/*\`). Then install from TestPyPI into a fresh virtual environment and import it. Only when that works upload to the real index with \`uv publish\` or \`twine upload dist/*\`.
**Automate.** Mature projects never upload from a laptop. They use **trusted publishing**: PyPI trusts a specific GitHub Actions workflow in your repository via OpenID Connect, so no long-lived token exists anywhere. The workflow runs tests, builds on a tagged commit such as \`v1.2.0\`, and publishes. The \`pypa/gh-action-pypi-publish\` action and \`uv publish\` both support it. Private companies run the same flow against an internal index (Artifactory, AWS CodeArtifact, or a simple \`devpi\` server) and point pip or uv at it with an index URL.`,
      codeSnippet: `# ---- Build and publish with uv ----
uv build
# Building source distribution...
# Building wheel from source distribution...
# Successfully built dist/shop-1.2.0.tar.gz
# Successfully built dist/shop-1.2.0-py3-none-any.whl

unzip -l dist/shop-1.2.0-py3-none-any.whl       # verify every file is inside

# 1) TestPyPI first (token from https://test.pypi.org/manage/account/token/)
uv publish --publish-url https://test.pypi.org/legacy/ --token pypi-AgENdGVzdC5weXBpLm9yZw...

# 2) Try it in a clean environment
uv venv /tmp/try-shop
uv pip install --python /tmp/try-shop --index-url https://test.pypi.org/simple/ \\
    --extra-index-url https://pypi.org/simple/ shop
/tmp/try-shop/bin/python -c "import shop; print(shop.__version__)"   # 1.2.0

# 3) Real PyPI
uv publish --token pypi-AgEIcHlwaS5vcmc...

# ---- Classic equivalents ----
python -m pip install build twine
python -m build
python -m twine upload --repository testpypi dist/*
python -m twine upload dist/*

# ---- .github/workflows/publish.yml (trusted publishing, no tokens stored) ----
name: Publish
on:
  push:
    tags: ["v*"]
jobs:
  publish:
    runs-on: ubuntu-latest
    environment: pypi
    permissions:
      id-token: write          # OIDC: PyPI trusts this workflow
    steps:
      - uses: actions/checkout@v4
      - uses: astral-sh/setup-uv@v6
      - run: uv sync --frozen
      - run: uv run pytest
      - run: uv build
      - run: uv publish`
    },
    {
      heading: "13. Real-World Use Cases: How Teams Structure and Ship Python Projects",
      content: `**A FastAPI microservice at a fintech startup.** The repository uses the src layout with \`src/payments_api/\` split into \`routers/\`, \`services/\`, \`models/\` and \`db/\`. \`pyproject.toml\` lists \`fastapi\`, \`pydantic>=2\`, \`sqlalchemy\` and \`httpx\`; the \`dev\` group adds \`pytest\`, \`pytest-asyncio\`, \`ruff\` and \`mypy\`. \`uv.lock\` is committed. The Dockerfile copies \`pyproject.toml\` and \`uv.lock\` first, runs \`uv sync --frozen --no-dev\` so the layer is cached until a dependency changes, and only then copies the source. Every deployment installs byte-for-byte the same packages that passed CI.
**A data science team in Hyderabad.** Each analyst used to install pandas globally, so notebooks broke when one person upgraded. Now every analysis lives in its own folder with a \`pyproject.toml\`, and shared cleaning functions were extracted into an internal package \`acme-dataprep\` published to a private index. Notebooks begin with \`from acme_dataprep import load_sales\` instead of 80 lines of copy-pasted code. Reusable code in a package, exploration in notebooks.
**An automation script for a college admin office.** A single file \`send_reminders.py\` with PEP 723 inline metadata declaring \`httpx\` and \`openpyxl\`. The staff member runs \`uv run send_reminders.py\` on any machine with uv installed and gets the right environment automatically. No README full of setup steps, no stale global installs.
**A CLI tool published to PyPI.** An open-source developer packages a GST invoice generator as \`gst-invoice\`. \`[project.scripts]\` exposes the \`gst-invoice\` command; users install it with \`uv tool install gst-invoice\` or \`pipx install gst-invoice\`, which puts the command on their PATH in an isolated environment. GitHub Actions with trusted publishing releases a new version every time a \`v*\` tag is pushed.
**A Django monolith maintained for eight years.** It still uses \`venv\` and a pinned \`requirements.txt\`, regenerated monthly with \`pip-compile\` from \`requirements.in\`. The team is migrating to \`pyproject.toml\` plus \`uv\` incrementally: \`uv export\` keeps producing the \`requirements.txt\` that the existing deployment scripts expect, so the migration carries no risk. The lesson across all five cases is the same: explicit dependencies, an isolated environment per project, a lockfile for anything deployed, and a package structure that can be installed and tested as a unit.`,
      codeSnippet: `# Dockerfile — production image for a FastAPI service using uv and a lockfile
FROM python:3.14-slim

# 1. Install uv (single static binary)
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

WORKDIR /app

# 2. Install dependencies first so this layer is cached until the lock changes
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --no-install-project

# 3. Copy the source and install the project itself
COPY src ./src
RUN uv sync --frozen --no-dev

# 4. Run with the environment's interpreter — no activation needed
CMD ["/app/.venv/bin/uvicorn", "payments_api.main:app", "--host", "0.0.0.0", "--port", "8000"]

# Build and run:
#   docker build -t payments-api .
#   docker run -p 8000:8000 payments-api`
    },
    {
      heading: "14. Common Mistakes with Python Imports, Packages and Dependencies and How to Fix Them",
      content: `**Mistake 1: Naming your file after a module you import.** A file called \`random.py\` or \`json.py\` in your project shadows the standard library module because \`sys.path[0]\` is searched first. \`import random\` then imports your file, and you see errors such as \`AttributeError: module 'random' has no attribute 'randint'\`. Fix: never name files after standard library or installed modules; delete the stale \`__pycache__\` after renaming.
**Mistake 2: Installing into the wrong Python.** You run \`pip install pandas\`, then \`python script.py\` says \`ModuleNotFoundError\`. The \`pip\` on your PATH belongs to a different interpreter. Fix: always use \`python -m pip\`, work inside a virtual environment, and check with \`python -c "import sys; print(sys.executable)"\`.
**Mistake 3: Running a package module as a script.** \`python src/shop/cli.py\` raises \`ImportError: attempted relative import with no known parent package\`. Fix: run \`python -m shop.cli\` from the project root after installing the project, or use a console script.
**Mistake 4: Side effects at import time.** A module that opens a database connection, reads \`input()\` or starts a server at module level will do so whenever anything imports it, including the test runner. Fix: put work in functions, guard script behaviour with \`if __name__ == "__main__":\`, and create connections lazily.
**Mistake 5: Committing .venv or forgetting the lockfile.** Committing \`.venv/\` bloats the repository with thousands of files that do not work on another OS; forgetting \`uv.lock\` means every machine resolves differently. Fix: ignore \`.venv/\`, commit \`uv.lock\` (for applications), and install with \`uv sync --frozen\` in CI.
**Mistake 6: Unpinned dependencies in production.** A requirements file with \`requests\` and no version works for a year, then a major release changes behaviour and the 2 a.m. deploy fails. Fix: deploy only from a lockfile or a fully pinned requirements file; upgrade deliberately and run tests.
**Mistake 7: Circular imports from "from x import name".** Two modules importing names from each other fail during initialisation. Fix: move shared definitions to a third module, import the module instead of the name, or use \`TYPE_CHECKING\` for hint-only imports.
**Mistake 8: Using \`sys.path.append("../")\` hacks.** Appending parent directories to \`sys.path\` inside tests or scripts works on your laptop and nowhere else. Fix: make the project installable with \`pyproject.toml\`, use the src layout, and \`uv sync\` or \`pip install -e .\`.
**Mistake 9: Mixing up distribution and import names.** \`pip install beautifulsoup4\` but \`import bs4\`; \`pip install Pillow\` but \`import PIL\`. Fix: read the package's PyPI page; \`pip show -f package\` lists the files it installed, which reveals the import name.`,
      codeSnippet: `# Diagnosing "it imports the wrong thing" in 30 seconds
import sys, random

print(sys.executable)          # which interpreter is actually running?
# /home/ravi/projects/shop/.venv/bin/python   <- good, inside the project's venv

print(sys.path[:3])            # what gets searched first?
# ['/home/ravi/projects/shop', '/usr/lib/python314.zip', ...]

print(random.__file__)         # where did this module come from?
# /home/ravi/projects/shop/random.py          <- BUG: your own file shadows the stdlib
# /usr/lib/python3.14/random.py               <- correct

# Fix for shadowing: rename the file and clear stale bytecode
# $ mv random.py lucky_draw.py
# $ rm -rf __pycache__

# Find the import name for an installed distribution
# $ python -m pip show -f beautifulsoup4 | head
# Name: beautifulsoup4
# Files:
#   bs4/__init__.py            <- import bs4, not beautifulsoup4`
    },
    {
      heading: "15. Frequently Asked Questions about Python Modules, Packages and Virtual Environments",
      content: `**What is the difference between a module and a package in Python?**
A module is a single \`.py\` file that can be imported; a package is a directory containing an \`__init__.py\` file and one or more modules or sub-packages. Packages give you dotted names such as \`shop.payments.upi\` and let you organise a large codebase as a hierarchy. Every package is also a module object at runtime, which is why \`import shop\` works and \`shop.__file__\` points at its \`__init__.py\`.
**Why do we use if __name__ == "__main__" in Python?**
Python sets \`__name__\` to \`"__main__"\` only in the file that was executed directly; in imported files it holds the module's name. The guard lets a file act as a reusable library when imported and as a script when run, without the script part executing during import. It also prevents accidental re-execution in tools such as \`multiprocessing\` on Windows, which imports the main module in child processes.
**Is __init__.py still required in Python 3?**
Not strictly: since Python 3.3, a folder without it becomes a namespace package. But for normal application and library code you should always include \`__init__.py\`. It makes the package explicit, gives you a place for the public API and version, and avoids surprising behaviour when two directories with the same name are on \`sys.path\`. Namespace packages are a special tool for plugin systems.
**What is the difference between pip and uv?**
pip is the installer that ships with Python; it installs packages but does not manage environments, interpreters or lockfiles by itself. uv is an all-in-one project manager that creates environments, installs Python versions, resolves and locks dependencies in \`uv.lock\`, runs scripts and builds and publishes packages, and it is dramatically faster. uv can also act as a drop-in replacement for pip through \`uv pip\`.
**Should I commit uv.lock or requirements.txt to Git?**
For applications and services, yes: commit the lockfile so every deployment installs identical versions. For libraries published to PyPI, commit it for your own CI convenience, but remember that users never see it; they only receive the loose ranges in \`pyproject.toml\`. If your deployment tooling needs \`requirements.txt\`, generate it from the lock with \`uv export\` instead of maintaining two sources of truth.
**What is the difference between requirements.txt and pyproject.toml?**
\`requirements.txt\` is a plain list of packages to install, usually with pinned versions; it has no metadata and no standard structure beyond one specifier per line. \`pyproject.toml\` is the standardised project file that describes the project itself: name, version, Python requirement, dependencies, optional extras, entry points, build backend and tool settings. Modern projects declare dependencies in \`pyproject.toml\` and use a lockfile for exact versions; \`requirements.txt\` survives mainly as a deployment artefact.
**Why should I use a virtual environment for every Python project?**
Because different projects need different package versions, and a single global \`site-packages\` can hold only one version of each. A virtual environment gives each project its own isolated set, keeps the system Python clean, and makes your dependency list accurate: when you run \`pip freeze\` or \`uv export\` you see exactly what the project needs and nothing from unrelated work.
**What is the src layout and why is it recommended?**
The src layout places your package in \`src/your_package/\` instead of the repository root. Because \`src/\` itself is not on \`sys.path\`, tests can only import the package after it is installed (normally as an editable install), which guarantees that you are testing what users will receive and catches packaging mistakes such as missing files. It also stops stray root-level scripts from being importable by accident.`
    },
    {
      heading: "16. Interview Questions and Answers on Python Modules, Packages and Dependency Management",
      content: `**Q1. Explain what happens step by step when Python executes \`import requests\`.**
Python first checks the \`sys.modules\` cache; if present it returns the cached module. Otherwise it asks the import system's finders to locate \`requests\` by scanning \`sys.path\` in order (script directory, \`PYTHONPATH\`, standard library, \`site-packages\`). When found, it loads or compiles the bytecode (using \`__pycache__\` if up to date), creates a module object, inserts it into \`sys.modules\` before executing it (so circular imports see a partial module rather than recursing forever), executes the code top to bottom, and binds the name \`requests\` in the importing namespace.
**Q2. What is the difference between absolute and relative imports, and when would you use each?**
Absolute imports name the full dotted path from the top-level package (\`from shop.payments import upi\`); relative imports use leading dots relative to the current package (\`from . import upi\`). PEP 8 prefers absolute imports for clarity. Relative imports are convenient within a package and keep working if the package is renamed, but they fail when a module is run directly as a script, so they belong only in library modules.
**Q3. How does \`python -m package\` differ from \`python package/__main__.py\`?**
\`python -m package\` imports the package through the normal import system, runs \`package/__main__.py\` with \`__name__ == "__main__"\`, sets \`__package__\` correctly so relative imports work, and puts the current directory on \`sys.path\`. Running the file by path treats it as a standalone script with no parent package, so relative imports break and \`sys.path[0]\` becomes the \`package/\` directory, which can shadow other modules.
**Q4. What is a circular import and how do you resolve it?**
A circular import occurs when module A imports module B while B imports A; whichever module is still initialising will be only partially populated, so \`from A import name\` fails. Resolutions: move the shared code into a third module; import the module rather than specific names and access attributes at call time; defer the import to inside the function; or, for type hints only, import under \`if TYPE_CHECKING:\` with \`from __future__ import annotations\`.
**Q5. What problem does a lockfile solve that requirements.txt with pinned versions does not?**
A pinned \`requirements.txt\` records versions but not hashes, platform markers or the dependency graph, and it is maintained by hand or by \`pip freeze\`, which mixes direct and transitive dependencies. A lockfile such as \`uv.lock\` or the standard \`pylock.toml\` is generated from the declared dependencies, records every package with its exact version and hash for every supported platform, is verified against the declaration so staleness is detected, and is updated deliberately. The result is reproducible, verifiable installs across OSes.
**Q6. What is the difference between \`[project.optional-dependencies]\` and \`[dependency-groups]\`?**
Optional dependencies (extras) are part of the published package metadata and are installed by end users on request, as in \`pip install "fastapi[standard]"\`. Dependency groups (PEP 735) are for the people developing the project, such as test and lint tools; they are not published and are installed with \`uv sync\` (which includes the \`dev\` group by default) or \`pip install --group dev\`.
**Q7. Why is the src layout recommended over the flat layout?**
With a flat layout the package directory is on \`sys.path\` whenever you run tools from the repository root, so tests import the working copy directly and never verify that the built wheel is complete. The src layout removes the package from the default path, forcing an install (usually editable) and therefore testing the real installed artefact. It also prevents root-level files from being accidentally importable.
**Q8. What is an editable install and when would you use it?**
\`pip install -e .\` (or what \`uv sync\` does for your project) installs a link to your source directory into \`site-packages\` instead of copying files, so code changes are visible immediately without reinstalling. You use it during development of any installable project, especially with the src layout, so that tests and scripts import the package exactly as users will while you keep editing.
**Q9. How would you make a one-file Python script reproducible for a colleague without a project setup?**
Add PEP 723 inline script metadata at the top of the file: a comment block beginning \`# /// script\` that declares \`requires-python\` and \`dependencies\`. The colleague runs \`uv run script.py\` and uv creates an isolated, cached environment with exactly those packages. Alternatively, ship a \`pyproject.toml\` and lockfile, but inline metadata is lighter for single scripts.
**Q10. How does \`__all__\` affect imports?**
\`__all__\` is a list of strings in a module or \`__init__.py\` that defines the public names exported by \`from module import *\`. It does not restrict explicit imports such as \`from module import _private\`, but it documents the public API, drives tools such as linters and IDE autocompletion, and in \`__init__.py\` it signals which re-exported names are intentional.`
    },
    {
      heading: "17. Hands-On Exercise: Build, Test and Run an Installable Python Package with uv",
      content: `In this exercise you will create a complete command-line **expense tracker** as an installable package using every idea from this lecture: the src layout, a package with \`__init__.py\` and \`__main__.py\`, relative imports, \`dataclasses\`, \`pathlib\`, \`json\` and \`argparse\` from the standard library, \`pyproject.toml\` with a console script and a dev dependency group, \`uv.lock\`, and a pytest test that imports the installed package.
Steps:
1. Create the folder \`expense-tracker\` and inside it the files shown in the code snippet, keeping the exact paths (the \`src/expense_tracker/\` package and the \`tests/\` folder).
2. Run \`uv sync\`. It creates \`.venv\`, installs \`pytest\`, installs your package in editable mode, and writes \`uv.lock\`. (If you prefer the classic tools: \`python -m venv .venv\`, activate, then \`python -m pip install -e . pytest\`.)
3. Record a few expenses with \`uv run expense-tracker add 120 food --note "lunch"\` and \`uv run expense-tracker add 2500 rent\`, then run \`uv run expense-tracker list\` and \`uv run expense-tracker report\`. Data is saved to \`~/.expense_tracker.json\`.
4. Run the same program through the package with \`uv run python -m expense_tracker report\` to confirm \`__main__.py\` works.
5. Run \`uv run pytest\` and watch both tests pass. Then run \`uv build\` and inspect \`dist/\` to see the wheel.
6. Try to break it: run \`python src/expense_tracker/cli.py\` directly and explain the \`ImportError\` you get using what you learned about relative imports.
Extension ideas: add a \`--month\` filter to \`report\`, store the file path in an environment variable read via \`os.environ\`, add a \`csv\` export command, and publish the package to TestPyPI under a unique name such as \`yourname-expense-tracker\`.`,
      codeSnippet: `# Project layout — create these files exactly, then run the commands at the bottom
#
# expense-tracker/
# ├── pyproject.toml
# ├── src/
# │   └── expense_tracker/
# │       ├── __init__.py
# │       ├── __main__.py
# │       ├── models.py
# │       ├── storage.py
# │       └── cli.py
# └── tests/
#     └── test_models.py

# ---------- pyproject.toml ----------
[project]
name = "expense-tracker"
version = "0.1.0"
description = "A tiny command-line expense tracker in INR"
requires-python = ">=3.11"
dependencies = []

[project.scripts]
expense-tracker = "expense_tracker.cli:main"

[dependency-groups]
dev = ["pytest>=8"]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"


# ---------- src/expense_tracker/__init__.py ----------
"""expense_tracker: a small package demonstrating the src layout."""
from .models import Expense, total_by_category

__all__ = ["Expense", "total_by_category", "__version__"]
__version__ = "0.1.0"


# ---------- src/expense_tracker/models.py ----------
from __future__ import annotations

from collections import defaultdict
from dataclasses import asdict, dataclass, field
from datetime import date


@dataclass(frozen=True)
class Expense:
    amount: float
    category: str
    note: str = ""
    spent_on: date = field(default_factory=date.today)

    def to_dict(self) -> dict:
        data = asdict(self)
        data["spent_on"] = self.spent_on.isoformat()
        return data

    @classmethod
    def from_dict(cls, data: dict) -> Expense:
        return cls(
            amount=float(data["amount"]),
            category=data["category"],
            note=data.get("note", ""),
            spent_on=date.fromisoformat(data["spent_on"]),
        )


def total_by_category(expenses: list[Expense]) -> dict[str, float]:
    totals: defaultdict[str, float] = defaultdict(float)
    for expense in expenses:
        totals[expense.category] += expense.amount
    return dict(sorted(totals.items(), key=lambda kv: kv[1], reverse=True))


# ---------- src/expense_tracker/storage.py ----------
import json
from pathlib import Path

from .models import Expense                      # relative import inside the package

DEFAULT_FILE = Path.home() / ".expense_tracker.json"


def load(path: Path = DEFAULT_FILE) -> list[Expense]:
    if not path.exists():
        return []
    raw = json.loads(path.read_text(encoding="utf-8"))
    return [Expense.from_dict(item) for item in raw]


def save(expenses: list[Expense], path: Path = DEFAULT_FILE) -> None:
    payload = [expense.to_dict() for expense in expenses]
    path.write_text(json.dumps(payload, indent=2), encoding="utf-8")


# ---------- src/expense_tracker/cli.py ----------
import argparse

from . import __version__
from .models import Expense, total_by_category
from .storage import load, save


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="expense-tracker", description="Track daily expenses in INR")
    parser.add_argument("--version", action="version", version=f"%(prog)s {__version__}")
    sub = parser.add_subparsers(dest="command", required=True)

    add = sub.add_parser("add", help="record an expense")
    add.add_argument("amount", type=float)
    add.add_argument("category")
    add.add_argument("--note", default="")

    sub.add_parser("list", help="show all expenses")
    sub.add_parser("report", help="totals per category")
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    expenses = load()

    match args.command:
        case "add":
            expenses.append(Expense(args.amount, args.category, args.note))
            save(expenses)
            print(f"Added ₹{args.amount:,.2f} under {args.category}")
        case "list":
            if not expenses:
                print("No expenses yet.")
            for e in expenses:
                print(f"{e.spent_on}  ₹{e.amount:>10,.2f}  {e.category:<12} {e.note}")
        case "report":
            for category, total in total_by_category(expenses).items():
                print(f"{category:<12} ₹{total:,.2f}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())


# ---------- src/expense_tracker/__main__.py ----------
from .cli import main

raise SystemExit(main())


# ---------- tests/test_models.py ----------
from datetime import date

from expense_tracker import Expense, total_by_category   # imports the INSTALLED package


def test_total_by_category_sorts_descending():
    expenses = [
        Expense(120, "food", spent_on=date(2026, 10, 1)),
        Expense(2500, "rent", spent_on=date(2026, 10, 1)),
        Expense(80, "food", spent_on=date(2026, 10, 2)),
    ]
    assert total_by_category(expenses) == {"rent": 2500.0, "food": 200.0}


def test_expense_round_trips_through_dict():
    expense = Expense(49.5, "travel", "metro", date(2026, 10, 3))
    assert Expense.from_dict(expense.to_dict()) == expense


# ---------- Commands ----------
# $ uv sync                                   # .venv + editable install + pytest + uv.lock
# $ uv run expense-tracker add 120 food --note "lunch"
# Added ₹120.00 under food
# $ uv run expense-tracker add 2500 rent
# Added ₹2,500.00 under rent
# $ uv run expense-tracker report
# rent         ₹2,500.00
# food         ₹120.00
# $ uv run python -m expense_tracker list     # __main__.py makes the package runnable
# 2026-10-09  ₹    120.00  food         lunch
# 2026-10-09  ₹  2,500.00  rent
# $ uv run pytest
# 2 passed in 0.03s
# $ uv build
# Successfully built dist/expense_tracker-0.1.0-py3-none-any.whl`
    },
    {
      heading: "18. Summary",
      content: `• A **module** is a \`.py\` file; a **package** is a directory with \`__init__.py\`. Python finds them by searching \`sys.path\` in order and caches every loaded module in \`sys.modules\`, so module-level code runs once per process.
• \`if __name__ == "__main__":\` separates library behaviour from script behaviour; keep script logic in a \`main()\` that returns an exit code. \`python -m package\` runs \`__main__.py\` with the import system set up correctly.
• Prefer **absolute imports**; use relative imports only inside a package and never run package modules by file path. Break **circular imports** by restructuring, importing modules instead of names, or \`TYPE_CHECKING\`.
• The **standard library** covers files (\`pathlib\`), data (\`json\`, \`csv\`, \`sqlite3\`, \`tomllib\`), time (\`datetime\`, \`zoneinfo\`), text (\`re\`), structures (\`collections\`, \`itertools\`, \`functools\`), money (\`decimal\`), security (\`secrets\`) and CLIs (\`argparse\`). Check it before installing anything.
• **pip** installs from **PyPI** into \`site-packages\`; always run it as \`python -m pip\` inside a **virtual environment**. One project, one environment, never the system Python.
• **requirements.txt** is the legacy way to list dependencies; keep a loose \`.in\` file and a fully pinned generated file if you use it.
• **pyproject.toml** is the standard home for project metadata, \`dependencies\`, extras, \`[dependency-groups]\`, \`[project.scripts]\`, the build backend and tool settings.
• **uv** gives you \`uv init\`, \`uv add\`, \`uv sync\`, \`uv run\`, \`uv lock\`, \`uv build\` and \`uv publish\`, plus **uv.lock** for reproducible installs and PEP 723 inline metadata for single-file scripts.
• Use the **src layout** so tests exercise the installed package, organise code by feature, and keep \`tests/\` beside \`src/\`.
• **Publishing** means building a wheel and sdist, verifying on TestPyPI, then releasing to PyPI, ideally via trusted publishing from CI.
**Next lecture:** Errors, Exceptions, Debugging & Logging`
    }
  ]
};
