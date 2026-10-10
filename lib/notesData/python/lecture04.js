export const lecture04 = {
  slug: "lecture-4",
  number: 4,
  title: "Complete Python Course — Lecture 4: Functions — Parameters, Scope, Lambdas & Closures",
  summary: "Master Python functions: def and return, default parameters and the mutable default trap, *args and **kwargs, keyword-only and positional-only parameters, docstrings, the LEGB scope rule, global and nonlocal, first-class functions, lambda, map, filter, sorted with key, closures and recursion.",
  readTime: "60 min read",
  difficulty: "Beginner",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. What Are Functions in Python and Why They Matter",
      content: `A **function** is a named, reusable block of code that takes some input (parameters), does a job, and optionally hands back a result (the return value). You have already used functions in the previous lectures without thinking about it: \`print()\`, \`len()\`, \`input()\` and \`range()\` are all functions that someone else wrote for you. In this lecture you learn to write your own.
Why do functions matter so much in real projects?
• **Don't Repeat Yourself (DRY)** — if the GST calculation for an invoice is written in five places and the rate changes, you must fix five places and will probably miss one. Put it in one function and the fix is one line.
• **Readability** — a 400-line script is unreadable; a script made of \`load_orders()\`, \`apply_discounts()\` and \`generate_report()\` reads like a story.
• **Testing** — small functions with clear inputs and outputs are easy to test with \`pytest\`. A giant script that mixes input, computation and printing is almost impossible to test.
• **Collaboration** — on a team, one developer writes \`validate_pan()\` and another calls it. Functions are the contract between them.
Python treats functions as **first-class objects**: a function is a value, just like a number or a string. You can store it in a variable, put it in a list, pass it to another function and return it from a function. This single idea unlocks lambdas, \`map\`/\`filter\`/\`sorted\` with \`key\`, closures and (in a later lecture) decorators. Everything in this lecture builds on it.
By the end you will know how to define functions, control exactly how arguments are passed (defaults, \`*args\`, \`**kwargs\`, \`/\` and \`*\` markers), document them, reason about where a variable lives (the LEGB rule), write small anonymous functions with \`lambda\`, build functions that remember state (closures) and solve problems with recursion. Each concept comes with runnable code; type it out and experiment.`
    },
    {
      heading: "2. Defining and Calling Functions: def, Parameters, Arguments and return",
      content: `A function is defined with the \`def\` keyword, a name, a parenthesised parameter list and a colon. The body is indented, exactly like an \`if\` block. Calling the function means writing its name followed by parentheses containing the **arguments**.
Terminology that interviewers love to check: **parameters** are the names in the definition (\`name\`, \`city\`); **arguments** are the actual values you pass at call time (\`"Priya"\`, \`"Pune"\`). Parameters are the placeholders, arguments fill them.
Arguments can be passed **positionally** (matched left to right) or by **keyword** (\`greet(city="Pune", name="Priya")\`). Keyword arguments make calls self-documenting and let you skip the order. Positional arguments must always come before keyword arguments in a call.
The \`return\` statement sends a value back to the caller and immediately ends the function. Three important rules:
• A function with no \`return\`, or a bare \`return\` with no value, returns **\`None\`**. Printing the result of \`print()\` shows \`None\` for exactly this reason.
• To return several values, separate them with commas: \`return gst, total\`. Python packs them into a **tuple**, and the caller can unpack them: \`gst, total = calculate_gst(1000)\`.
• Code after \`return\` in the same branch never runs. Use this for **early returns**: check invalid input at the top and return immediately, so the main logic is not nested inside an \`else\`.
Function names follow the same \`snake_case\` convention as variables and should be verbs or verb phrases: \`calculate_gst\`, \`send_otp\`, \`is_valid_pin\` (a boolean-returning function usually starts with \`is_\` or \`has_\`). A function must be defined before the line that calls it executes, which is why the \`main()\` call usually sits at the very bottom of a script.`,
      codeSnippet: `# functions_basics.py
def greet(name: str, city: str) -> str:
    """Return a greeting for a person from a city."""
    return f"Hello {name} from {city}!"


# Positional arguments: matched left to right
print(greet("Priya", "Pune"))               # Hello Priya from Pune!
# Keyword arguments: order does not matter
print(greet(city="Jaipur", name="Arjun"))   # Hello Arjun from Jaipur!


def calculate_gst(amount: float, rate: float = 18.0) -> tuple[float, float]:
    """Return (gst, total) for an amount; rate is a percentage."""
    if amount < 0:                 # early return for bad input
        return 0.0, 0.0
    gst = amount * rate / 100
    return gst, amount + gst       # packed into a tuple


gst, total = calculate_gst(1000)   # unpack the tuple
print(gst, total)                  # 180.0 1180.0
print(calculate_gst(500, rate=5))  # (25.0, 525.0)


def log(message: str) -> None:
    print(f"[LOG] {message}")


result = log("server started")     # [LOG] server started
print(result)                      # None  <- no return statement`
    },
    {
      heading: "3. Default Parameters and the Mutable Default Argument Trap",
      content: `A **default parameter** gives a parameter a value to use when the caller does not supply one: \`def calculate_gst(amount, rate=18.0)\`. Defaults make a function convenient for the common case and flexible for the rare case. Parameters with defaults must come after parameters without defaults; \`def f(a=1, b)\` is a \`SyntaxError\`.
Now the most famous Python gotcha. **Default values are evaluated exactly once, when the \`def\` statement runs, not every time the function is called.** For immutable defaults (numbers, strings, \`None\`, tuples) that is harmless. For **mutable** defaults (lists, dicts, sets) it is a bug waiting to happen: every call that relies on the default shares the **same** list object. The first call appends "pen"; the second call appends "book" to the same list and returns \`['pen', 'book']\` even though the caller expected a fresh cart.
You can prove it: \`add_item.__defaults__\` shows the stored default objects, and you will see the list growing between calls.
**The fix is the \`None\` sentinel idiom.** Use \`cart=None\` as the default and create the list inside the body with \`if cart is None: cart = []\`. Now every call that omits \`cart\` gets a brand-new list. This pattern appears in every serious codebase, and linters such as Ruff (rule B006) flag mutable defaults automatically.
The same "evaluated once" rule bites with \`datetime.now()\` as a default: \`def log(msg, when=datetime.now())\` records the time the module was imported, not the time of each call. Again, use \`when=None\` and compute inside.
When is a mutable default intentional? Very rarely, as a cheap cache. Even then, prefer \`functools.cache\` so the intent is obvious to readers.`,
      codeSnippet: `# mutable_default.py
from datetime import datetime


# BUG: the list is created once, at definition time
def add_item_buggy(item, cart=[]):
    cart.append(item)
    return cart


print(add_item_buggy("pen"))          # ['pen']
print(add_item_buggy("book"))         # ['pen', 'book']   <- shared list!
print(add_item_buggy.__defaults__)    # (['pen', 'book'],)


# FIX: use None as a sentinel and build the list inside
def add_item(item, cart=None):
    if cart is None:
        cart = []
    cart.append(item)
    return cart


print(add_item("pen"))                # ['pen']
print(add_item("book"))               # ['book']          <- fresh list each call


# Same trap with datetime: evaluated once at import time
def log_buggy(message, when=datetime.now()):
    return f"{when:%H:%M:%S} {message}"


def log(message, when=None):
    if when is None:
        when = datetime.now()      # evaluated on every call
    return f"{when:%H:%M:%S} {message}"`
    },
    {
      heading: "4. *args and **kwargs: Variable-Length Arguments and Unpacking",
      content: `Sometimes you do not know in advance how many arguments a function will receive. \`print()\` accepts any number of values; \`max()\` accepts two or two hundred numbers. Python gives you two tools for this.
**\`*args\`** collects any extra **positional** arguments into a **tuple**. The name \`args\` is only a convention; the star is what matters. Inside the function, \`args\` is an ordinary tuple you can loop over, index or pass to \`sum()\`.
**\`**kwargs\`** collects any extra **keyword** arguments into a **dict** whose keys are the argument names. It is the standard way to accept open-ended configuration: \`connect("db.local", port=5432, timeout=30)\`.
The order in a signature is fixed: normal parameters, then \`*args\`, then keyword-only parameters, then \`**kwargs\`.
The star syntax also works in the **opposite direction**, at the call site, which is called **unpacking**. \`total(*prices)\` spreads a list into separate positional arguments; \`connect(**config)\` spreads a dict into keyword arguments. You already use this when you write \`print(*row, sep=", ")\`.
The most important real-world use is **forwarding**: a wrapper function accepts \`*args, **kwargs\` and passes them unchanged to another function. This is how decorators, logging wrappers and retry helpers work without knowing the wrapped function's signature. Related idioms: \`first, *rest = [1, 2, 3]\` (extended unpacking, Python 3.0+) and merging dicts with \`{**defaults, **overrides}\` (3.5+) or \`defaults | overrides\` (3.9+).
Avoid over-using \`**kwargs\` in your own APIs: a function that accepts anything documents nothing. Prefer explicit parameters and reach for \`**kwargs\` when you are forwarding or genuinely accepting arbitrary options.`,
      codeSnippet: `# args_kwargs.py
def total_bill(*items: float, discount_pct: float = 0) -> float:
    """Sum any number of item prices, then apply a percentage discount."""
    print("items is a", type(items).__name__, "->", items)
    subtotal = sum(items)
    return round(subtotal * (1 - discount_pct / 100), 2)


print(total_bill(199, 349, 999))
# items is a tuple -> (199, 349, 999)
# 1547.0
print(total_bill(199, 349, 999, discount_pct=10))     # 1392.3


def connect(host: str, **options) -> None:
    print(f"Connecting to {host} with", options)


connect("db.local", port=5432, timeout=30)
# Connecting to db.local with {'port': 5432, 'timeout': 30}


# Unpacking at the call site
prices = [100, 250, 50]
print(total_bill(*prices))                 # same as total_bill(100, 250, 50)
config = {"port": 3306, "timeout": 5}
connect("mysql.internal", **config)


# Forwarding: a wrapper that works with ANY function
def timed(func, *args, **kwargs):
    import time
    start = time.perf_counter()
    result = func(*args, **kwargs)
    print(f"{func.__name__} took {time.perf_counter() - start:.6f}s")
    return result


timed(total_bill, 10, 20, discount_pct=5)

first, *rest = [1, 2, 3, 4]
print(first, rest)                         # 1 [2, 3, 4]`
    },
    {
      heading: "5. Keyword-Only and Positional-Only Parameters (* and /)",
      content: `Python lets you control **how** callers are allowed to pass each argument. Two special markers in the signature do this.
**Keyword-only parameters** come after a bare \`*\` (or after \`*args\`). The caller **must** name them: \`create_user("Asha", role="admin")\` works, \`create_user("Asha", "admin")\` raises a \`TypeError\`. This was introduced in Python 3.0 (PEP 3102). Use it for boolean flags and options whose meaning is unclear from position: \`open(path, encoding="utf-8")\` is readable, \`open(path, "r", -1, "utf-8")\` is not. Many standard-library functions are keyword-only for this reason: \`sorted(iterable, /, *, key=None, reverse=False)\`.
**Positional-only parameters** come before a \`/\` and the caller **cannot** name them (Python 3.8+, PEP 570). Why would you forbid keywords? Three reasons: the name is meaningless to the caller (\`len(obj, /)\`); you want freedom to rename the parameter later without breaking callers who used the keyword; or you accept \`**kwargs\` and do not want a clash between the first parameter's name and a key the caller might send. Most C-implemented builtins such as \`len\`, \`abs\` and \`pow\` are positional-only, and \`help(len)\` shows the \`/\`.
A full signature can combine everything, in this fixed order: positional-only, \`/\`, normal (positional-or-keyword), \`*args\` or \`*\`, keyword-only, \`**kwargs\`.
Practical advice for beginners: make the one or two "obvious" parameters positional, and make everything optional keyword-only. Your function will be easier to call correctly, easier to extend, and harder to misuse. When you read a traceback like "takes 2 positional arguments but 3 were given" or "got some positional-only arguments passed as keyword arguments", this section is the explanation.`,
      codeSnippet: `# param_kinds.py
def create_user(name, /, email, *, role="viewer", active=True):
    """
    name   -> positional-only  (before /)
    email  -> positional or keyword
    role, active -> keyword-only (after *)
    """
    return {"name": name, "email": email, "role": role, "active": active}


print(create_user("Asha", "asha@example.in"))
# {'name': 'Asha', 'email': 'asha@example.in', 'role': 'viewer', 'active': True}

print(create_user("Ravi", email="ravi@example.in", role="admin"))
# {'name': 'Ravi', 'email': 'ravi@example.in', 'role': 'admin', 'active': True}

try:
    create_user("Ravi", "ravi@example.in", "admin")       # role by position
except TypeError as err:
    print("TypeError:", err)
# TypeError: create_user() takes 2 positional arguments but 3 were given

try:
    create_user(name="Ravi", email="ravi@example.in")     # name by keyword
except TypeError as err:
    print("TypeError:", err)
# TypeError: create_user() got some positional-only arguments passed as keyword arguments: 'name'


# Why positional-only helps with **kwargs: no name clash
def tag(name, /, **attrs):
    attr_text = " ".join(f'{k}="{v}"' for k, v in attrs.items())
    return f"<{name} {attr_text}>"


print(tag("input", name="email", type="text"))
# <input name="email" type="text">   <- 'name' key is free for the caller`
    },
    {
      heading: "6. Docstrings, Type Hints and help()",
      content: `A **docstring** is a string literal placed as the very first statement in a function body (also in classes and modules). Python stores it in the function's \`__doc__\` attribute, and \`help(func)\` prints it. Unlike a \`#\` comment, a docstring is part of the program: IDEs show it on hover, \`pytest\` can run examples in it (doctest), and tools such as Sphinx and MkDocs turn it into documentation websites.
Conventions (PEP 257): use triple double quotes; the first line is a one-sentence summary ending with a full stop; a blank line; then details. Popular layouts are **Google style** (\`Args:\`, \`Returns:\`, \`Raises:\` sections), **NumPy style** and **reStructuredText**. Pick one per project and stay consistent. A good docstring explains **what** the function does and what it expects, not **how** it is implemented, since the code already shows that.
**Type hints** (PEP 484, Python 3.5+) annotate parameter and return types: \`def convert(amount: float, rate: float) -> float\`. Python itself does **not** enforce them at runtime; they are documentation that static checkers like **mypy** and **pyright** and editors use to catch bugs before you run the code. Since Python 3.9 you can use builtin generics such as \`list[int]\` and \`dict[str, float]\`; since 3.10 you can write unions as \`int | None\`. Python 3.14 (PEP 649/749) evaluates annotations lazily, so a function can reference a class defined later in the file without quoting the name.
Combined, a typed signature plus a docstring is the complete contract of a function. In the age of AI coding assistants this matters more than ever: tools read your signature and docstring to understand how to call your code.`,
      codeSnippet: `# docstrings.py
def convert_currency(amount: float, rate: float, *, round_to: int = 2) -> float:
    """Convert an amount using an exchange rate.

    Args:
        amount: The amount in the source currency, e.g. 100.0 (USD).
        rate: Units of target currency per unit of source, e.g. 83.5 (INR per USD).
        round_to: Decimal places in the result. Defaults to 2.

    Returns:
        The converted amount, rounded.

    Raises:
        ValueError: If amount or rate is negative.

    Example:
        >>> convert_currency(100, 83.5)
        8350.0
    """
    if amount < 0 or rate < 0:
        raise ValueError("amount and rate must be non-negative")
    return round(amount * rate, round_to)


print(convert_currency(100, 83.5))         # 8350.0
print(convert_currency.__doc__.splitlines()[0])
# Convert an amount using an exchange rate.
print(convert_currency.__name__)           # convert_currency

help(convert_currency)                     # prints the signature + docstring

# Run the embedded example as a test:
#   python -m doctest docstrings.py -v`
    },
    {
      heading: "7. Variable Scope in Python: The LEGB Rule, global and nonlocal",
      content: `**Scope** is the region of a program where a name is visible. When Python meets a name it searches four scopes in a fixed order, remembered by the acronym **LEGB**:
• **L — Local**: names assigned inside the current function.
• **E — Enclosing**: names in any outer function that wraps this one (relevant for nested functions and closures).
• **G — Global**: names defined at the top level of the module (the file).
• **B — Builtins**: \`print\`, \`len\`, \`range\` and everything in the \`builtins\` module.
The search stops at the first match. This is why a local \`x\` "shadows" a global \`x\`, and why naming a variable \`list\` or \`sum\` silently hides the builtin for the rest of that scope.
The crucial rule: **assignment inside a function makes a name local to that function for the whole function**, decided at compile time. So \`count += 1\` inside a function makes \`count\` local, and because it is read before it is assigned you get \`UnboundLocalError: cannot access local variable 'count' where it is not associated with a value\` (wording from Python 3.11+). Reading a global without assigning to it is fine.
To **rebind** a module-level name from inside a function, declare it with \`global count\`. To rebind a name from an enclosing function, use \`nonlocal count\` (Python 3.0+). Note that mutating a mutable object (\`cart.append(...)\`) is not rebinding, so it works without either keyword, which is a common source of confusion.
Treat \`global\` as a smell. Functions that silently change module state are hard to test and reason about; prefer returning values and letting the caller decide. \`nonlocal\` is more respectable because it is the mechanism behind stateful closures, which you will meet in section 12. Finally, remember that \`if\`, \`for\` and \`while\` blocks do **not** create a new scope in Python: a variable assigned inside a loop is still visible after it.`,
      codeSnippet: `# scope_legb.py
x = "global x"


def outer():
    x = "enclosing x"

    def inner():
        x = "local x"
        print("inner sees:", x)        # L

    inner()
    print("outer sees:", x)            # E (from inner's point of view)


outer()
print("module sees:", x)               # G
# inner sees: local x
# outer sees: enclosing x
# module sees: global x


count = 0


def increment_buggy():
    count += 1          # assignment makes 'count' local -> read before assign


try:
    increment_buggy()
except UnboundLocalError as err:
    print("UnboundLocalError:", err)


def increment():
    global count        # rebind the module-level name
    count += 1


increment()
increment()
print("count =", count)                # count = 2


def make_counter():
    total = 0

    def add(n):
        nonlocal total  # rebind the enclosing name
        total += n
        return total

    return add


add = make_counter()
print(add(5), add(10))                 # 5 15

for i in range(3):
    pass
print("i after loop:", i)              # 2  <- loops do not create a scope`
    },
    {
      heading: "8. First-Class Functions: Passing and Returning Functions",
      content: `In Python a function is an object of type \`function\`. Everything you can do with an integer, you can do with a function: assign it to a variable, store it in a list or dict, pass it as an argument, return it from another function, and inspect its attributes (\`__name__\`, \`__doc__\`, \`__defaults__\`).
The key distinction to internalise: \`greet\` (no parentheses) **is the function**; \`greet()\` **calls it** and gives you the result. Writing \`button.on_click(save)\` registers the function; writing \`button.on_click(save())\` calls \`save\` immediately and registers whatever it returned (usually \`None\`). Beginners make this mistake constantly in GUI, web and async code.
A function that takes another function as an argument, or returns one, is called a **higher-order function**. The standard library is full of them: \`sorted(key=...)\`, \`map\`, \`filter\`, \`functools.reduce\`, \`functools.partial\`, and every decorator.
Two production patterns built on first-class functions:
• **Dispatch tables** replace long \`if/elif\` chains with a dict that maps a string to a function: \`operations["add"](5, 3)\`. Adding a new operation is one dict entry, not another branch, and the \`operator\` module gives you ready-made functions like \`operator.add\`.
• **Strategy injection**: a function such as \`apply_discount(price, strategy)\` accepts the discount rule as a function, so the same code handles festival sales, student discounts and coupon codes without modification.
\`functools.partial\` deserves a mention: it "pre-fills" some arguments of a function and returns a new function. \`send_otp = partial(send_sms, gateway="msg91", sender="OTPSVC")\` creates a specialised function from a general one, which is often cleaner than a lambda.`,
      codeSnippet: `# first_class.py
import operator
from functools import partial


def festival_discount(price: float) -> float:
    return price * 0.80           # 20% off


def student_discount(price: float) -> float:
    return max(price - 500, 0)    # flat Rs 500 off


def apply_discount(price: float, strategy) -> float:
    """strategy is any function price -> price."""
    return round(strategy(price), 2)


print(apply_discount(2999, festival_discount))   # 2399.2
print(apply_discount(2999, student_discount))    # 2499

# Functions stored in a dict: a dispatch table
operations = {
    "add": operator.add,
    "sub": operator.sub,
    "mul": operator.mul,
    "div": lambda a, b: a / b if b else float("nan"),
}
print(operations["mul"](6, 7))                   # 42
print(operations["div"](10, 0))                  # nan

# Function vs call
print(festival_discount)        # <function festival_discount at 0x...>
print(festival_discount.__name__)                # festival_discount
print(type(festival_discount).__name__)          # function

# partial: pre-fill arguments to create a specialised function
def send_sms(gateway: str, sender: str, to: str, text: str) -> str:
    return f"[{gateway}/{sender}] -> {to}: {text}"


send_otp = partial(send_sms, "msg91", "OTPSVC")
print(send_otp("+91-98xxxxxx21", "Your OTP is 4821"))
# [msg91/OTPSVC] -> +91-98xxxxxx21: Your OTP is 4821`
    },
    {
      heading: "9. Lambda Functions in Python: Small Anonymous Functions",
      content: `A **lambda** is a tiny anonymous function written as a single expression: \`lambda x: x * 2\`. It has parameters before the colon and one expression after it, whose value is automatically returned. No \`def\`, no name, no \`return\` keyword.
Lambdas exist for one purpose: passing a short piece of logic to a higher-order function without the ceremony of a named \`def\`. \`sorted(students, key=lambda s: s["marks"])\` is the canonical example. If the logic needs a name, a docstring, more than one expression, or will be reused, write a \`def\`.
Lambdas are deliberately limited:
• The body must be a **single expression**: no \`if\` statements, loops, \`try\` or assignments (a conditional **expression** \`a if cond else b\` is allowed, and so is the walrus operator).
• No annotations on parameters or return value.
• Their \`__name__\` is the unhelpful string \`"<lambda>"\`, which makes tracebacks harder to read.
• Lambdas can take defaults, \`*args\` and \`**kwargs\`, exactly like \`def\`.
PEP 8 explicitly says **do not assign a lambda to a name** (\`square = lambda x: x * x\`). Use \`def square(x): return x * x\` instead: it is the same length, gets a real name and supports a docstring. Ruff flags this as rule E731.
One subtle trap: a lambda (like any function) looks up free variables **when it is called**, not when it is created. Creating lambdas in a loop that reference the loop variable gives every lambda the final value. The fix is to bind the value as a default: \`lambda i=i: i\`. Section 12 explains why in terms of closures.
Readability test: if you need more than a second to understand what a lambda does, it should be a \`def\`.`,
      codeSnippet: `# lambdas.py
students = [
    {"name": "Kavya", "marks": 91, "city": "Chennai"},
    {"name": "Rohan", "marks": 78, "city": "Lucknow"},
    {"name": "Meera", "marks": 85, "city": "Kochi"},
]

# The classic use: a key function for sorting
top = sorted(students, key=lambda s: s["marks"], reverse=True)
print([s["name"] for s in top])          # ['Kavya', 'Meera', 'Rohan']

# Conditional expression inside a lambda is fine
grade = lambda m: "A" if m >= 90 else "B" if m >= 80 else "C"   # noqa: E731 (demo only)
print(grade(91), grade(85), grade(78))   # A B C

# Lambdas accept defaults and *args
power = lambda base, exp=2: base ** exp
print(power(5), power(2, 10))            # 25 1024

print((lambda x: x).__name__)            # <lambda>

# The late-binding trap
callbacks = [lambda: i for i in range(3)]
print([f() for f in callbacks])          # [2, 2, 2]   <- all see the final i

callbacks = [lambda i=i: i for i in range(3)]
print([f() for f in callbacks])          # [0, 1, 2]   <- bound at creation

# Prefer def for anything with a name
def square(x: int) -> int:
    """Return x squared."""
    return x * x`
    },
    {
      heading: "10. map, filter and sorted with key: Functional Tools",
      content: `Once functions are values, a family of builtins becomes useful. All three below accept a function as the first (or \`key\`) argument.
**\`map(func, iterable)\`** applies \`func\` to each element and returns a lazy **iterator** (Python 3 changed this from a list). Wrap it in \`list()\` to see the values, or loop over it directly. With two iterables, \`map(func, a, b)\` calls \`func(a[i], b[i])\` pairwise and stops at the shorter one.
**\`filter(func, iterable)\`** keeps the elements for which \`func(element)\` is truthy, also lazily. \`filter(None, iterable)\` is a shortcut that removes falsy values (\`0\`, \`""\`, \`None\`, empty containers).
**\`sorted(iterable, key=func, reverse=False)\`** returns a **new** sorted list; \`list.sort()\` sorts in place and returns \`None\`. The \`key\` function is called once per element and its result is what gets compared. The same \`key\` parameter exists on \`min()\`, \`max()\`, \`heapq.nlargest\` and \`itertools.groupby\`. Python's sort is **stable**: equal keys keep their original order, so you can sort by a secondary key first, then by the primary, or simply return a **tuple** from \`key\` to sort by several fields at once. To reverse one field of a tuple key, negate it (\`-s["marks"]\`) for numbers.
The \`operator\` module provides fast, readable key functions: \`itemgetter("marks")\` for dicts and sequences, \`attrgetter("salary")\` for objects, \`methodcaller("lower")\` for method calls.
**map/filter vs comprehensions.** For most code, a list comprehension (\`[p * 1.18 for p in prices if p > 200]\`) is clearer than \`map\` + \`filter\` + \`lambda\`, and it is what experienced Python developers write. \`map\` wins when you already have a named function to apply (\`map(str, numbers)\`, \`map(int, input().split())\`, a very common competitive-programming idiom in India) or when you want laziness over a huge stream. \`functools.reduce\` folds a sequence into a single value but is rarely needed; \`sum\`, \`max\`, \`math.prod\` and \`"".join\` cover the common cases.`,
      codeSnippet: `# map_filter_sorted.py
from operator import itemgetter
from functools import reduce

prices = [100, 250, 999, 49, 1500]

with_gst = map(lambda p: round(p * 1.18, 2), prices)
print(with_gst)                              # <map object at 0x...>  (lazy)
print(list(with_gst))                        # [118.0, 295.0, 1178.82, 57.82, 1770.0]

expensive = list(filter(lambda p: p > 200, prices))
print(expensive)                             # [250, 999, 1500]

# Equivalent comprehension (usually preferred)
print([round(p * 1.18, 2) for p in prices if p > 200])

# map with a named function and multiple iterables
nums = list(map(int, "12 7 45 3".split()))    # [12, 7, 45, 3]
qty = [2, 1, 3]
unit = [50, 999, 10]
print(list(map(lambda q, u: q * u, qty, unit)))      # [100, 999, 30]

employees = [
    {"name": "Neha", "dept": "Sales", "salary": 72000},
    {"name": "Amit", "dept": "Tech", "salary": 95000},
    {"name": "Sara", "dept": "Sales", "salary": 81000},
    {"name": "Vikram", "dept": "Tech", "salary": 95000},
]

# Sort by dept ascending, then salary descending (tuple key, negate number)
ranked = sorted(employees, key=lambda e: (e["dept"], -e["salary"]))
for e in ranked:
    print(f"{e['dept']:<6} {e['name']:<7} {e['salary']}")
# Sales  Sara    81000
# Sales  Neha    72000
# Tech   Amit    95000
# Tech   Vikram  95000      <- stable: Amit stays before Vikram

print(max(employees, key=itemgetter("salary"))["name"])   # Amit
print(reduce(lambda acc, p: acc + p, prices, 0))           # 2898 (same as sum(prices))`
    },
    {
      heading: "11. Closures in Python: Functions That Remember",
      content: `A **closure** is an inner function that **remembers the variables of its enclosing function even after that enclosing function has finished running**. You create one whenever a nested function references a name from the enclosing scope and is then returned (or stored) for later use.
Consider \`make_multiplier(factor)\`, which defines \`multiply(n)\` inside it and returns it. When you call \`make_multiplier(2)\`, Python normally destroys the local variable \`factor\` as the call ends, but \`multiply\` still refers to it, so Python keeps \`factor\` alive in a **cell** attached to the returned function. You can see this in \`double.__closure__[0].cell_contents\`, which prints \`2\`. Each call to \`make_multiplier\` creates an independent cell, so \`double\` and \`triple\` do not interfere.
A closure captures **variables, not values**. The inner function sees the cell, so if the outer variable changes later, the inner function sees the new value. That is exactly the late-binding behaviour from the lambda section, and it is also what makes \`nonlocal\` useful: with \`nonlocal\` an inner function can **update** the captured variable, giving you a function with private, persistent state. \`make_counter()\` from section 7 is a closure-based counter: nobody outside can touch \`total\`, yet it survives between calls.
When should you use a closure instead of a class?
• Use a **closure** when you need one behaviour with a little state or configuration: a counter, a rate limiter, a formatter pre-configured with a currency symbol, a validator built from a regex, a callback that knows which row it belongs to.
• Use a **class** when you need several methods sharing state, or when the state should be inspectable and debuggable from outside.
Closures are the foundation of **decorators**: \`@timer\` is just a function that takes your function, wraps it in an inner closure, and returns the wrapper. When you reach the decorators lecture, everything there will feel familiar.`,
      codeSnippet: `# closures.py
def make_multiplier(factor: float):
    def multiply(n: float) -> float:
        return n * factor          # 'factor' is a free variable captured from outer
    return multiply


double = make_multiplier(2)
triple = make_multiplier(3)
print(double(21), triple(21))               # 42 63
print(double.__closure__[0].cell_contents)  # 2
# 'multiply' itself is not visible here: it only exists inside make_multiplier


# Closure with private, mutable state (needs nonlocal)
def make_rate_limiter(max_calls: int):
    calls = 0

    def allow() -> bool:
        nonlocal calls
        if calls < max_calls:
            calls += 1
            return True
        return False

    return allow


allow = make_rate_limiter(3)
print([allow() for _ in range(5)])          # [True, True, True, False, False]


# Closure as configuration: a pre-configured formatter
def make_formatter(symbol: str, places: int = 2):
    def fmt(amount: float) -> str:
        return f"{symbol}{amount:,.{places}f}"
    return fmt


inr = make_formatter("₹")
usd = make_formatter("$")
print(inr(1250000.5), usd(999.999))         # ₹1,250,000.50 $1,000.00


# Closures capture variables, not values
def make_greeters():
    greeters = []
    for word in ("Hi", "Namaste", "Hello"):
        greeters.append(lambda name, w=word: f"{w}, {name}!")   # bind now
    return greeters


print([g("Priya") for g in make_greeters()])
# ['Hi, Priya!', 'Namaste, Priya!', 'Hello, Priya!']`
    },
    {
      heading: "12. Recursion in Python: Functions That Call Themselves",
      content: `**Recursion** is when a function calls itself to solve a smaller version of the same problem. Every correct recursive function has two parts: a **base case** that returns an answer without recursing (\`factorial(0)\` is \`1\`), and a **recursive case** that moves towards the base case (\`n * factorial(n - 1)\`). Forget the base case, or fail to shrink the problem, and the function recurses forever.
Python stores each active call on the **call stack**. To protect the interpreter, CPython limits the depth to **1000** frames by default (\`sys.getrecursionlimit()\`), and raises \`RecursionError: maximum recursion depth exceeded\` beyond that. You can raise the limit with \`sys.setrecursionlimit(10_000)\`, but Python performs **no tail-call optimisation**, so deep recursion is still slower and riskier than a loop. Rule of thumb: for linear problems (sum a list, count down) use a loop; for naturally **tree-shaped** problems (directory trees, nested JSON, organisation charts, expression parsing, divide-and-conquer algorithms like merge sort and binary search) recursion is the clearest tool.
The classic Fibonacci example shows a second danger: naive recursion recomputes the same sub-problems exponentially many times (\`fib(35)\` makes about 30 million calls). The cure is **memoisation**, and Python ships it as a decorator: \`@functools.cache\` (Python 3.9+) or \`@functools.lru_cache(maxsize=...)\`. With the cache, \`fib(100)\` is instant.
Interviewers ask recursion questions to check that you can identify the base case, trust the recursive call to "just work" for the smaller input, and reason about complexity. Practise on factorial, Fibonacci, sum of digits, reversing a string, flattening a nested list, and walking a folder with \`pathlib\`, as shown in the code.`,
      codeSnippet: `# recursion.py
import sys
from functools import cache
from pathlib import Path


def factorial(n: int) -> int:
    if n < 0:
        raise ValueError("n must be >= 0")
    if n == 0:                    # base case
        return 1
    return n * factorial(n - 1)   # recursive case


print(factorial(5))               # 120
print(sys.getrecursionlimit())    # 1000


def fib_naive(n: int) -> int:
    return n if n < 2 else fib_naive(n - 1) + fib_naive(n - 2)


@cache                            # memoisation, Python 3.9+
def fib(n: int) -> int:
    return n if n < 2 else fib(n - 1) + fib(n - 2)


print(fib_naive(25))              # 75025 (takes a noticeable moment)
print(fib(90))                    # 2880067194370816120 (instant)


def flatten(items: list) -> list:
    """Flatten arbitrarily nested lists."""
    flat = []
    for item in items:
        if isinstance(item, list):
            flat.extend(flatten(item))     # recurse into sub-list
        else:
            flat.append(item)
    return flat


print(flatten([1, [2, [3, [4, 5]], 6]]))   # [1, 2, 3, 4, 5, 6]


def folder_size(path: Path) -> int:
    """Total bytes under a folder: a tree-shaped problem."""
    if path.is_file():
        return path.stat().st_size
    return sum(folder_size(child) for child in path.iterdir())


print(folder_size(Path(".")), "bytes in current folder")

try:
    factorial(5000)
except RecursionError as err:
    print("RecursionError:", err)
# RecursionError: maximum recursion depth exceeded`
    },
    {
      heading: "13. Real-World Use Cases: How Python Functions Are Used in Production",
      content: `Everything in this lecture appears daily in professional Python code. Some concrete places you will meet it:
• **Web APIs (FastAPI, Django, Flask)** — every route handler is a plain function. FastAPI reads the function's **type hints** and **default parameters** to validate the request and generate documentation: \`def list_orders(city: str, limit: int = 20)\` automatically becomes two validated query parameters. Keyword-only parameters keep the signatures unambiguous.
• **Data analysis (pandas)** — \`df["price"].apply(lambda p: p * 1.18)\`, \`df.sort_values(key=...)\` and \`groupby(...).agg(custom_function)\` all pass functions as arguments. Analysts write dozens of small lambdas and key functions every day.
• **Configuration and dependency injection** — closures and \`functools.partial\` build pre-configured functions: an SMS sender bound to a gateway, a database query bound to a connection, a logger bound to a request ID.
• **Callbacks and event handlers** — GUI toolkits, \`asyncio\`, and job schedulers accept functions to run later. Passing \`save\` instead of \`save()\` is the difference between a working app and a broken one.
• **Retry, timing and caching wrappers** — a function that accepts \`func, *args, **kwargs\` and forwards them is how retry logic, timing and logging are added without modifying the original function; decorators formalise this.
• **Tree-shaped data** — recursive functions walk directory trees, nested JSON from APIs, organisation hierarchies and category trees in e-commerce catalogues.
• **Scripts and automation** — a well-structured script is a set of small functions plus a \`main()\` guarded by \`if __name__ == "__main__":\`, so each function can be imported and tested separately.
The snippet shows a realistic pattern: a FastAPI-style handler with typed, defaulted parameters; a retry helper that forwards \`*args, **kwargs\`; and a closure that binds a request ID to a logger.`,
      codeSnippet: `# production_patterns.py
import random
import time
from functools import partial


# 1. A handler whose signature IS the API contract (FastAPI uses exactly this)
def list_orders(city: str, *, limit: int = 20, status: str | None = None) -> dict:
    return {"city": city, "limit": limit, "status": status}


print(list_orders("Hyderabad", status="shipped"))
# {'city': 'Hyderabad', 'limit': 20, 'status': 'shipped'}


# 2. A retry helper that forwards any arguments to any function
def retry(func, *args, attempts: int = 3, delay: float = 0.1, **kwargs):
    for attempt in range(1, attempts + 1):
        try:
            return func(*args, **kwargs)
        except ConnectionError as err:
            print(f"attempt {attempt} failed: {err}")
            if attempt == attempts:
                raise
            time.sleep(delay)


def flaky_payment(order_id: int, amount: float) -> str:
    if random.random() < 0.5:
        raise ConnectionError("gateway timeout")
    return f"order {order_id}: paid ₹{amount:,.2f}"


random.seed(7)
print(retry(flaky_payment, 1042, 2599.0, attempts=5))


# 3. A closure that binds context to a logger
def make_logger(request_id: str):
    def log(level: str, message: str) -> None:
        print(f"[{request_id}] {level.upper()}: {message}")
    return log


log = make_logger("req-8f3a")
log("info", "fetching cart")        # [req-8f3a] INFO: fetching cart
log("warning", "coupon expired")    # [req-8f3a] WARNING: coupon expired

# 4. partial for pre-configured helpers
to_inr = partial(round, ndigits=2)
print(to_inr(83.4567))              # 83.46`
    },
    {
      heading: "14. Common Mistakes with Python Functions and How to Fix Them",
      content: `**1. Mutable default arguments.** \`def add(item, cart=[])\` shares one list across calls. Fix: \`cart=None\` and create the list inside. (Section 3.)
**2. Forgetting \`return\`.** The function prints the answer but returns \`None\`, so \`total = calc()\` stores \`None\` and the next line crashes with \`TypeError: unsupported operand type(s) for +: 'NoneType' and 'int'\`. Fix: functions should **return** values; let the caller print.
**3. Calling vs referencing.** \`sorted(data, key=get_marks())\` calls \`get_marks\` with no arguments and passes its result. Fix: pass the function object, \`key=get_marks\`.
**4. \`UnboundLocalError\` from assigning to a global.** Any assignment makes the name local for the whole function. Fix: return the new value instead, or (rarely) declare \`global\`/\`nonlocal\`.
**5. Shadowing builtins.** Naming a parameter or variable \`list\`, \`str\`, \`sum\`, \`input\` or \`id\` hides the builtin, producing confusing errors like \`TypeError: 'list' object is not callable\` later. Fix: use \`items\`, \`text\`, \`total\`, \`user_id\`.
**6. Expecting pass-by-value.** Python passes **object references**. Mutating a list parameter (\`items.append(x)\`) changes the caller's list; rebinding it (\`items = []\`) does not. Fix: decide explicitly whether the function mutates or returns a new object, and document it. Copy with \`items[:]\` or \`list(items)\` when you need isolation.
**7. Late binding in loops.** Lambdas or closures created in a loop all see the final loop value. Fix: bind with a default parameter (\`lambda i=i: ...\`) or a factory function.
**8. Positional soup.** \`create_booking("Goa", 2, True, False, 3)\` is unreadable and easy to get wrong. Fix: keyword-only parameters after \`*\`.
**9. Recursion without a shrinking problem.** \`return count_down(n)\` instead of \`n - 1\` loops until \`RecursionError\`. Fix: write the base case first and make sure every recursive call moves towards it.
**10. Assigning lambdas to names.** \`square = lambda x: x * x\` loses the name in tracebacks. Fix: \`def\`.`,
      codeSnippet: `# common_mistakes.py

# Mistake 2: printing instead of returning
def average_buggy(values):
    print(sum(values) / len(values))

def average(values: list[float]) -> float:
    return sum(values) / len(values)

avg = average([80, 90, 100])          # 90.0, usable by the caller


# Mistake 6: pass-by-object-reference
def add_bonus(scores: list[int]) -> None:
    scores.append(5)                  # mutates the caller's list!

def with_bonus(scores: list[int]) -> list[int]:
    return [*scores, 5]               # returns a NEW list, caller untouched

marks = [70, 85]
add_bonus(marks)
print(marks)                          # [70, 85, 5]   <- surprise for the caller
print(with_bonus(marks), marks)       # [70, 85, 5, 5] [70, 85, 5]

def reset(scores: list[int]) -> None:
    scores = []                       # rebinds the LOCAL name only
reset(marks)
print(marks)                          # [70, 85, 5]   <- unchanged


# Mistake 5: shadowing a builtin
def demo_shadow():
    list = [1, 2, 3]                  # hides the builtin list()
    try:
        return list((4, 5))
    except TypeError as err:
        return f"TypeError: {err}"
print(demo_shadow())                  # TypeError: 'list' object is not callable


# Mistake 3: calling instead of referencing
def get_marks(s): return s["marks"]
students = [{"name": "A", "marks": 60}, {"name": "B", "marks": 95}]
print(sorted(students, key=get_marks)[-1]["name"])   # B   (correct)
# sorted(students, key=get_marks())  -> TypeError: missing 1 required positional argument`
    },
    {
      heading: "15. Frequently Asked Questions about Python Functions",
      content: `**What is the difference between parameters and arguments in Python?**
Parameters are the names listed in the function definition (\`def greet(name, city)\`), while arguments are the actual values supplied when the function is called (\`greet("Priya", "Pune")\`). People use the words interchangeably in conversation, but in error messages and documentation the distinction matters: "missing 1 required positional argument" refers to a value you failed to pass.
**What are *args and **kwargs in Python?**
\`*args\` collects extra positional arguments into a tuple, and \`**kwargs\` collects extra keyword arguments into a dict. They let a function accept any number of inputs and are essential for wrappers that forward arguments to another function. At a call site, the same stars unpack a list or dict into separate arguments.
**Is Python pass by value or pass by reference?**
Neither in the C++ sense; Python is "pass by object reference" (also called pass by assignment). The function receives a reference to the same object the caller has. Mutating a mutable object (appending to a list) is visible to the caller; rebinding the parameter name to a new object is not.
**What is the difference between lambda and def in Python?**
Both create function objects. \`lambda\` is limited to a single expression, has no name (\`__name__\` is \`"<lambda>"\`), and cannot contain statements or a docstring. Use lambda for throwaway key functions and callbacks; use \`def\` for anything named, reused, documented or longer than one line.
**What is a closure in Python?**
A closure is an inner function that retains access to variables from its enclosing function after that function has returned. The captured variables live in cells visible through \`func.__closure__\`. Closures give you functions with private state or baked-in configuration and are the mechanism behind decorators.
**What is the LEGB rule in Python?**
LEGB is the order in which Python resolves a name: Local scope, then Enclosing function scopes, then Global (module) scope, then Builtins. The first match wins, which is why a local variable can shadow a global or a builtin.
**Why is a mutable default argument a problem in Python?**
Default values are evaluated once when \`def\` runs, so a list or dict default is shared by every call that does not override it. Each call mutates the same object, producing data that leaks between calls. Use \`None\` as the default and create the object inside the function.
**What is the maximum recursion depth in Python?**
CPython's default limit is 1000 frames; exceeding it raises \`RecursionError\`. You can change it with \`sys.setrecursionlimit()\`, but because Python does not optimise tail calls, very deep recursion should usually be rewritten as a loop or an explicit stack.`
    },
    {
      heading: "16. Interview Questions and Answers on Python Functions",
      content: `**Q1. What does a function return if it has no return statement?**
It returns \`None\`. The same is true for a bare \`return\` with no expression. A function always produces a value; "no value" is spelled \`None\`.
**Q2. Explain the order of parameters in a Python function signature.**
Positional-only parameters, then \`/\`, then positional-or-keyword parameters, then \`*args\` (or a bare \`*\`), then keyword-only parameters, then \`**kwargs\`. Parameters with defaults must follow those without defaults within the same group.
**Q3. What is the output of this code and why?** \`def f(x, items=[]): items.append(x); return items\` followed by \`print(f(1)); print(f(2))\`.
\`[1]\` then \`[1, 2]\`. The default list is created once at definition time and reused, so the second call appends to the list that already contains 1.
**Q4. How do global and nonlocal differ?**
\`global\` declares that a name inside a function refers to the module-level variable, allowing the function to rebind it. \`nonlocal\` declares that a name refers to a variable in the nearest enclosing function scope (not global), which is how a closure updates captured state. Neither is needed to merely read a variable or mutate a mutable object in place.
**Q5. What are first-class functions and higher-order functions?**
First-class means functions are ordinary objects: they can be assigned, stored in containers, passed as arguments and returned. A higher-order function is one that takes a function as an argument or returns one, such as \`sorted\` with \`key\`, \`map\`, \`filter\`, \`functools.partial\` and all decorators.
**Q6. What is the difference between sorted() and list.sort()?**
\`sorted()\` works on any iterable and returns a new list, leaving the original untouched. \`list.sort()\` sorts the list in place and returns \`None\`, which is why \`data = data.sort()\` is a classic bug. Both accept \`key\` and \`reverse\` and both are stable.
**Q7. Why does \`[lambda: i for i in range(3)]\` return 2 from every lambda?**
Because closures capture variables, not values, and the lambda body looks up \`i\` only when called, after the loop has finished with \`i == 2\`. Bind the current value with a default argument (\`lambda i=i: i\`) or create each lambda through a factory function.
**Q8. When would you choose a closure over a class?**
A closure suits a single behaviour with small private state or configuration, such as a counter, a rate limiter or a formatter bound to a currency symbol; it is shorter and keeps state truly private. A class is better when several methods share state, when the state must be inspected or serialised, or when the object needs special methods.
**Q9. Why is naive recursive Fibonacci slow, and how do you fix it?**
Each call branches into two more, so the number of calls grows exponentially and the same sub-problems are recomputed millions of times. Memoisation with \`@functools.cache\` stores each result the first time it is computed, reducing the work to linear time; an iterative loop is equally good.
**Q10. Are Python type hints enforced at runtime?**
No. Annotations are stored metadata that static checkers (mypy, pyright), IDEs and frameworks such as FastAPI and Pydantic use. Python will happily run \`add("a", "b")\` even if \`add\` is annotated with \`int\`. Validation at runtime requires a library such as Pydantic.`
    },
    {
      heading: "17. Hands-On Exercise: Build a Mini Expense Tracker with Functions and Closures",
      content: `Time to put every concept to work in one runnable program. The exercise is a small **expense tracker** of the kind you might build for personal use or as a college project. Create a file named \`expense_tracker.py\`, type the code (do not copy-paste, you learn more by typing), run it with \`python expense_tracker.py\` and compare your output with the comments.
What the program demonstrates, mapped to the sections above:
1. \`add_expense\` uses a **positional-only** section (\`ledger, title, amount, /\`) and **keyword-only** options (\`category\`, \`city\`), validates input with an **early return** style \`raise\`, and has a Google-style **docstring** and **type hints**.
2. \`total\` accepts **\`*amounts\`** plus a keyword-only \`discount_pct\`, and is called with **unpacking** (\`total(*amounts)\`).
3. \`sorted\` with a **lambda key**, and \`filter\`/\`map\` with lambdas, produce a ranked list and a filtered view.
4. \`make_budget_tracker\` returns a **closure** that keeps \`spent\` private and updates it with **\`nonlocal\`**.
5. \`nested_total\` uses **recursion** to add up a category tree of arbitrary depth.
6. A \`main()\` function guarded by \`if __name__ == "__main__":\` ties everything together, the standard structure for scripts.
Extension challenges once it runs:
• Add a \`by_city(ledger, city)\` function using \`filter\` and compare it with a comprehension.
• Replace the per-category loop with \`collections.defaultdict(float)\` (next lecture previews this).
• Write a \`make_formatter(symbol)\` closure and use it for all currency output.
• Add \`@functools.cache\` to \`nested_total\` and think about why it cannot be cached as written (hint: dicts are unhashable, which the next lecture covers).
• Write three \`pytest\` tests: one for \`total\` with a discount, one that expects \`ValueError\` for a negative amount, and one for \`nested_total\`.`,
      codeSnippet: `# expense_tracker.py
"""Mini expense tracker demonstrating Python functions, closures,
lambdas, *args/**kwargs, keyword-only parameters and recursion."""


def add_expense(ledger: list[dict], title: str, amount: float, /, *,
                category: str = "misc", city: str = "Bengaluru") -> dict:
    """Append an expense to the ledger and return it.

    Args:
        ledger: The list that stores all expenses (mutated in place).
        title: Short description, e.g. "Metro pass".
        amount: Amount in rupees; must be positive.
        category: Spending category (keyword-only).
        city: City where the expense happened (keyword-only).

    Raises:
        ValueError: If amount is not positive.
    """
    if amount <= 0:
        raise ValueError(f"amount must be positive, got {amount}")
    expense = {"title": title, "amount": float(amount),
               "category": category, "city": city}
    ledger.append(expense)
    return expense


def total(*amounts: float, discount_pct: float = 0.0) -> float:
    """Sum any number of amounts, then apply an optional percentage discount."""
    subtotal = sum(amounts)
    return round(subtotal * (1 - discount_pct / 100), 2)


def make_budget_tracker(limit: float):
    """Return a closure that remembers how much has been spent."""
    spent = 0.0

    def record(amount: float) -> str:
        nonlocal spent
        spent += amount
        remaining = limit - spent
        status = "OK" if remaining >= 0 else "OVER BUDGET"
        return f"spent ₹{spent:,.2f}, remaining ₹{remaining:,.2f} [{status}]"

    return record


def nested_total(node: dict) -> float:
    """Recursively total a category tree.

    node = {"amount": float, "children": {name: node, ...}}
    """
    return node["amount"] + sum(nested_total(child)
                                for child in node["children"].values())


def main() -> None:
    ledger: list[dict] = []
    add_expense(ledger, "Metro pass", 1500, category="travel", city="Delhi")
    add_expense(ledger, "Groceries", 3200.50, category="food")
    add_expense(ledger, "Netflix", 649, category="entertainment")
    add_expense(ledger, "Auto fare", 180, category="travel", city="Delhi")

    try:
        add_expense(ledger, "Refund", -200)
    except ValueError as err:
        print("Rejected:", err)
    # Rejected: amount must be positive, got -200

    # *args with unpacking + keyword-only discount
    amounts = [e["amount"] for e in ledger]
    print("Total:", total(*amounts))                        # Total: 5529.5
    print("With 10% off:", total(*amounts, discount_pct=10))  # With 10% off: 4976.55

    # sorted with a lambda key
    print("\\nRanked by amount:")
    for e in sorted(ledger, key=lambda e: e["amount"], reverse=True):
        print(f"  {e['title']:<12} ₹{e['amount']:>9,.2f}  {e['category']}")
    #   Groceries    ₹ 3,200.50  food
    #   Metro pass   ₹ 1,500.00  travel
    #   Netflix      ₹   649.00  entertainment
    #   Auto fare    ₹   180.00  travel

    # filter + map with lambdas
    travel = filter(lambda e: e["category"] == "travel", ledger)
    print("\\nTravel items:", list(map(lambda e: e["title"], travel)))
    # Travel items: ['Metro pass', 'Auto fare']

    # Grouping with a plain dict
    per_category: dict[str, float] = {}
    for e in ledger:
        per_category[e["category"]] = per_category.get(e["category"], 0.0) + e["amount"]
    print("Per category:", per_category)
    # Per category: {'travel': 1680.0, 'food': 3200.5, 'entertainment': 649.0}

    # Closure with private state
    print("\\nBudget ₹5,000:")
    track = make_budget_tracker(5000)
    for e in ledger:
        print(" ", track(e["amount"]))
    #   spent ₹1,500.00, remaining ₹3,500.00 [OK]
    #   spent ₹4,700.50, remaining ₹299.50 [OK]
    #   spent ₹5,349.50, remaining ₹-349.50 [OVER BUDGET]
    #   spent ₹5,529.50, remaining ₹-529.50 [OVER BUDGET]

    # Recursion over a nested category tree
    tree = {"amount": 0.0, "children": {
        "travel": {"amount": 0.0, "children": {
            "metro": {"amount": 1500.0, "children": {}},
            "auto": {"amount": 180.0, "children": {}},
        }},
        "food": {"amount": 3200.5, "children": {}},
    }}
    print("\\nNested total:", nested_total(tree))             # Nested total: 4880.5


if __name__ == "__main__":
    main()`
    },
    {
      heading: "18. Summary",
      content: `• A function is defined with \`def\`, takes **parameters**, is called with **arguments**, and returns a value with \`return\` (or \`None\` if it does not).
• **Default parameters** are evaluated once at definition time; never use a mutable default, use \`None\` and create the object inside.
• \`*args\` gathers extra positional arguments into a tuple and \`**kwargs\` gathers extra keyword arguments into a dict; the same stars **unpack** sequences and dicts at the call site and let wrappers forward arguments.
• A bare \`*\` makes the following parameters **keyword-only**; \`/\` (Python 3.8+) makes the preceding parameters **positional-only**. Order: positional-only, \`/\`, normal, \`*\`, keyword-only, \`**kwargs\`.
• **Docstrings** live in \`__doc__\` and power \`help()\`; **type hints** document types for tools like mypy and FastAPI but are not enforced at runtime.
• Names are resolved by the **LEGB** rule: Local, Enclosing, Global, Builtins. Assignment makes a name local; use \`global\` or \`nonlocal\` only when you truly must rebind an outer name.
• Functions are **first-class objects**: pass them, store them in dicts, return them. Pass \`func\`, not \`func()\`.
• \`lambda\` creates a one-expression anonymous function; use it for \`key\` functions and short callbacks, otherwise prefer \`def\`.
• \`map\`, \`filter\` and \`sorted(key=...)\` take functions as arguments; comprehensions are usually clearer than \`map\`/\`filter\` with lambdas.
• A **closure** is an inner function that remembers variables from its enclosing scope; combine with \`nonlocal\` for private state. Closures capture variables, not values.
• **Recursion** needs a base case and a shrinking problem; CPython's default depth limit is 1000, and \`@functools.cache\` turns exponential recursion into linear.
**Next lecture:** Data Structures — Lists, Tuples, Dictionaries, Sets & collections`
    }
  ]
};
