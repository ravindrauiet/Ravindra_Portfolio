export const lecture02 = {
  slug: "lecture-2",
  number: 2,
  title: "Complete Python Course — Lecture 2: Variables, Data Types, Operators & Strings",
  summary: "Learn Python variables and dynamic typing, core data types (int, float, bool, None), type conversion, arithmetic, comparison and logical operators, is vs ==, and Python strings: indexing, slicing, string methods, f-strings and format specifiers, escape sequences, raw strings and immutability.",
  readTime: "60 min read",
  difficulty: "Beginner",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. Introduction: Why Variables, Data Types and Strings Are the Foundation of Python",
      content: `Every Python program you will ever write — a Django backend, a pandas notebook, a FastAPI microservice, an automation script — is built from the same raw materials: **variables** that give names to data, **data types** that decide what that data can do, **operators** that combine values, and **strings** that carry text in and out of your program. In Lecture 1 you installed Python and printed your first line. In this lecture you learn how Python actually stores and manipulates data, which is the knowledge that separates someone who copies code from someone who can reason about it.
Why does this matter in real projects? Because most beginner bugs are type bugs. A form field arrives as the string \`"1,249.50"\` and you try to add GST to it. A division that used to return an integer in C now returns a float in Python. Two lists look equal but are actually the same object, so changing one silently changes the other. A Windows file path breaks because \`\\n\` inside it became a newline. Each of these is a direct consequence of how Python treats names, objects and types — and each one is easy to avoid once you understand the model.
This lecture is written for Python 3.10 and newer. At the time of writing, Python 3.14 is the current stable series and 3.13 is still widely installed on servers and laptops; where a feature was introduced in a specific version (for example the \`=\` debug specifier in f-strings from Python 3.8, or \`removeprefix\` from Python 3.9), it is labelled so you can check compatibility.
By the end you will be able to predict when two variables share an object, use every core type correctly (including the surprising cases such as \`0.1 + 0.2\` and \`True + True\`), convert between types safely, apply arithmetic, comparison and logical operators with the right precedence, choose \`is\` versus \`==\` deliberately, and slice, search, transform and format strings like a professional. Work through every code snippet in a file or the REPL — reading about Python is not learning Python; typing it is.`
    },
    {
      heading: "2. Variables in Python: Names, Objects and Dynamic Typing",
      content: `In languages like Java or C, a variable is a **box** with a fixed type: \`int age = 25;\` reserves memory that can only ever hold an integer. Python works differently. A variable is a **name** (a label) that points to an **object** living somewhere in memory. The object has a type; the name does not. This is what **dynamic typing** means: the same name can point to a string now and an integer a moment later, and Python determines the type at runtime by looking at the object, not the name.
Three rules follow from this model, and they explain almost every "weird" behaviour you will meet later:
1. **Assignment binds a name to an object; it never copies the object.** \`b = a\` makes \`b\` a second label on the same object. For mutable objects like lists this means changing through \`b\` is visible through \`a\`.
2. **Rebinding a name does not touch the object it used to point to.** \`y = y + 1\` creates a new integer object and moves the label \`y\` to it; \`x\` keeps pointing at the old object.
3. **Objects are garbage collected when no name refers to them.** You never free memory manually.
Python also has rules for **valid names**: letters, digits and underscores, not starting with a digit, case-sensitive (\`total\` and \`Total\` are different), and not a reserved keyword (\`class\`, \`def\`, \`if\`, \`None\` and about 30 others — see \`keyword.kwlist\`). The community style guide, **PEP 8**, asks for \`snake_case\` for variables and functions, \`UPPER_CASE\` for constants (Python has no real constants; it is a convention), and \`CapWords\` for classes. A leading underscore (\`_internal\`) signals "private by convention".
Since Python 3.6 you can write large numbers with underscores (\`85_000\`), which makes salaries and populations readable. You can also assign several names at once (\`price, qty = 499, 3\`) and swap values without a temporary variable (\`a, b = b, a\`) — this is tuple packing and unpacking, which the lecture on collections covers in depth.
**Type hints** (\`salary: int = 85_000\`, Python 3.5+) document the intended type and let tools like mypy, Pyright and your IDE catch mistakes, but the interpreter does **not** enforce them. Python stays dynamically typed; hints are for humans and tooling.`,
      codeSnippet: `# variables.py
city = "Pune"          # the name 'city' now refers to a str object
city = 411001          # same name, now refers to an int object — dynamic typing
print(type(city))      # <class 'int'>

# Two names, one object (no copy is made)
a = [10, 20]
b = a                  # b is NOT a copy; both names point to the same list
b.append(30)
print(a)               # [10, 20, 30]  <- a "changed" too, because it is the same list

# Rebinding does not affect the other name
x = 5
y = x
y = y + 1              # y now points to a NEW int object (6)
print(x, y)            # 5 6

# Multiple assignment and swapping
price, qty = 499, 3
price, qty = qty, price      # swap without a temp variable
print(price, qty)            # 3 499

# Naming (PEP 8): snake_case for variables, UPPER_CASE for constants
MAX_RETRIES = 3
monthly_salary_inr: int = 85_000   # type hint + readable underscores (3.6+)
# 2nd_try = 1   -> SyntaxError: a name cannot start with a digit
# class = "A"   -> SyntaxError: 'class' is a keyword

import keyword
print(keyword.iskeyword("lambda"), len(keyword.kwlist))   # True 35`
    },
    {
      heading: "3. Python Numeric Types: int, float, complex, bool and None",
      content: `Python has three built-in numeric types plus two special singletons you will use constantly.
**int** — whole numbers with **arbitrary precision**. Unlike Java's 32-bit \`int\` or 64-bit \`long\`, a Python integer grows as large as memory allows, so \`2 ** 100\` just works and there is no integer overflow. Literals can be written in decimal, binary (\`0b1010\`), octal (\`0o17\`) or hexadecimal (\`0xFF\`).
**float** — a 64-bit IEEE 754 double, the same as \`double\` in Java/C and \`number\` in JavaScript. It has about 15–17 significant decimal digits and cannot represent most decimal fractions exactly, which is why \`0.1 + 0.2\` prints \`0.30000000000000004\`. This is not a Python bug; it is binary floating point. Never compare floats with \`==\` for "closeness" — use \`math.isclose()\` (Python 3.5+) — and never store money in floats; use \`int\` paise or \`decimal.Decimal\`. Floats also support the special values \`inf\`, \`-inf\` and \`nan\` (\`float("nan")\` is not equal even to itself).
**complex** — numbers with a real and imaginary part, written with a \`j\` suffix: \`3 + 4j\`. You will rarely use them in web work, but engineers, data scientists and students of signal processing will. \`abs()\` returns the magnitude.
**bool** — \`True\` and \`False\`. In Python, \`bool\` is a **subclass of int**: \`True\` behaves as 1 and \`False\` as 0 in arithmetic, so \`sum([True, False, True])\` is 2. This is handy (\`count = sum(x > 50 for x in marks)\`) but also a trap when you check types. Every object has a **truth value**: \`0\`, \`0.0\`, \`""\`, \`[]\`, \`{}\`, \`None\` are **falsy**; everything else, including \`"0"\`, \`" "\` and \`-1\`, is **truthy**. \`bool(x)\` tells you which.
**None** — the single object of type \`NoneType\`, meaning "no value". Functions without a \`return\` statement return \`None\`, and it is the standard default for optional parameters. Always test it with \`is None\`, never \`== None\`.`,
      codeSnippet: `# numbers.py
population = 1_428_000_000        # int — arbitrary precision
print(2 ** 100)                   # 1267650600228229401496703205376 (no overflow)
print(0b1010, 0o17, 0xFF)         # 10 15 255  (binary, octal, hex literals)

pi = 3.14159                      # float — 64-bit IEEE 754 double
print(1e6, 2.5e-3)                # 1000000.0 0.0025
print(0.1 + 0.2)                  # 0.30000000000000004
print(0.1 + 0.2 == 0.3)           # False
import math
print(math.isclose(0.1 + 0.2, 0.3))                         # True
print(float("inf") > 10 ** 308, float("nan") == float("nan"))  # True False

z = 3 + 4j                        # complex
print(z.real, z.imag, abs(z))     # 3.0 4.0 5.0
print((-8) ** (1 / 3))            # (1.0000000000000002+1.7320508075688772j)

print(True + True, True * 10)     # 2 10  (bool is a subclass of int)
print(isinstance(True, int))      # True
print(bool(0), bool(""), bool([]), bool(None))   # False False False False
print(bool(-1), bool("0"), bool(" "))            # True True True
marks = [45, 72, 88, 39]
print(sum(m >= 40 for m in marks))               # 3 — counting with booleans

result = None
print(result is None, type(None))  # True <class 'NoneType'>`
    },
    {
      heading: "4. Checking Types with type() and isinstance()",
      content: `Because Python decides types at runtime, you often need to **ask** what type an object has. There are two tools and they answer slightly different questions.
\`type(obj)\` returns the **exact class** of an object. \`type(42)\` is \`int\`, \`type("x")\` is \`str\`, \`type(None)\` is \`NoneType\`. Comparing with \`type(x) == int\` (or \`type(x) is int\`) is strict: it is \`False\` for a subclass. In particular, \`type(True) == int\` is \`False\` because the exact class is \`bool\`.
\`isinstance(obj, cls)\` asks "is \`obj\` an instance of \`cls\` **or any subclass**?" This respects inheritance, which is almost always what you want in real code: a function that accepts an \`int\` should usually accept a subclass too. \`isinstance\` also accepts a **tuple** of types (\`isinstance(x, (int, float))\`) and, since Python 3.10, the union syntax \`isinstance(x, int | float)\`.
When should you check types at all? Python favours **duck typing** — "if it quacks like a duck, treat it as a duck" — so you often just call the method and let a \`TypeError\` surface. But at the **boundaries** of your program (parsing user input, reading JSON from an API, validating function arguments in a library) explicit checks give clearer error messages. The example below shows a typical guard: reject anything that is not a number, and explicitly reject \`bool\` because \`isinstance(True, int)\` is \`True\` and you rarely want to format \`True\` as ₹1.00.
Two related built-ins you will see: \`type(x).__name__\` gives the type name as a string (useful in error messages), and \`issubclass(bool, int)\` checks the class relationship itself.`,
      codeSnippet: `# type_checks.py
print(type(42), type(3.5), type("hi"), type(None))
# <class 'int'> <class 'float'> <class 'str'> <class 'NoneType'>
print(type(42) == int, type(42) is int)     # True True
print(type(True) == int)                    # False — exact class is bool
print(isinstance(True, int))                # True — bool inherits from int
print(issubclass(bool, int))                # True
print(isinstance(3.5, (int, float)))        # True — tuple of types
print(isinstance("5", int | str))           # True — union syntax (Python 3.10+)

def rupees(amount):
    """Format a number as Indian rupees, rejecting strings and booleans."""
    if not isinstance(amount, (int, float)) or isinstance(amount, bool):
        raise TypeError(f"amount must be a number, got {type(amount).__name__}")
    return f"₹{amount:,.2f}"

print(rupees(1250))        # ₹1,250.00
# print(rupees("1250"))    # TypeError: amount must be a number, got str
# print(rupees(True))      # TypeError: amount must be a number, got bool`
    },
    {
      heading: "5. Type Conversion in Python: Explicit and Implicit Casting",
      content: `Data rarely arrives in the type you need. \`input()\` always returns a string. Environment variables are strings. JSON numbers may come as floats when you expect integers. **Type conversion** (also called casting) is how you move between types, and Python makes the explicit kind very visible: you call the target type like a function.
**Explicit conversion** functions:
• \`int(x)\` — from a float it **truncates toward zero** (\`int(-12.9)\` is \`-12\`, not \`-13\`); from a string it parses an integer and raises \`ValueError\` if the text is not a valid integer, so \`int("12.5")\` fails even though \`int(12.5)\` works. Leading/trailing whitespace and underscores are allowed. A second argument gives the base: \`int("ff", 16)\`.
• \`float(x)\` — parses decimals and scientific notation (\`"1e3"\`) and the words \`"inf"\`, \`"nan"\`.
• \`str(x)\` — the human-readable text of any object (what \`print\` shows). \`repr(x)\` is the developer-oriented form, with quotes around strings.
• \`bool(x)\` — the truth value. Watch out: \`bool("False")\` is \`True\` because the string is non-empty. Parse booleans from text with \`text.lower() in ("true", "1", "yes")\`.
• \`round(x, n)\` — rounds a float to \`n\` decimals; with no \`n\` it returns an \`int\`. Python uses **banker's rounding** (round half to even), so \`round(12.5)\` is \`12\` and \`round(13.5)\` is \`14\`. Combined with binary representation this gives results like \`round(2.675, 2) == 2.67\`. For money use \`decimal.Decimal\` with \`ROUND_HALF_UP\`.
• \`bin()\`, \`hex()\`, \`oct()\` — integer to text in another base; \`chr()\` / \`ord()\` — between characters and code points.
**Implicit conversion** happens only inside the numeric family: \`int + float\` gives \`float\`, \`int / int\` gives \`float\`, \`bool + int\` gives \`int\`. Python never silently converts between strings and numbers — \`"Total: " + 500\` raises \`TypeError\`. This is deliberate (the Zen of Python says "explicit is better than implicit") and prevents the JavaScript-style \`"5" + 5 == "55"\` surprises.
The safe pattern for user input is: convert inside a \`try\` block, catch \`ValueError\`, and ask again. Lecture 3 covers the control flow; here is the shape.`,
      codeSnippet: `# conversions.py
print(int("42"), int("  42 "), int("1_000"))   # 42 42 1000
print(int(12.9), int(-12.9))                   # 12 -12  (truncates toward zero)
print(round(12.5), round(13.5), round(2.675, 2))  # 12 14 2.67 (half-to-even + binary float)
print(int("ff", 16), int("1010", 2))           # 255 10
print(bin(10), hex(255), oct(8))               # 0b1010 0xff 0o10
# int("12.5")  -> ValueError: invalid literal for int() with base 10: '12.5'
print(int(float("12.5")))                      # 12

print(float("3.14"), float("1e3"), float(7))   # 3.14 1000.0 7.0
print(str(99), str(3.0), str(None))            # 99 3.0 None
print(repr("hi"), str("hi"))                   # 'hi' hi
print(bool("False"), "False".lower() in ("true", "1", "yes"))   # True False

# Implicit (automatic) conversion only happens between numeric types
print(7 + 3.0, 7 / 2, True + 1)                # 10.0 3.5 2
# print("Total: " + 500)  -> TypeError: can only concatenate str (not "int") to str
print("Total: " + str(500), f"Total: {500}")   # Total: 500 Total: 500

# Money: avoid float drift with Decimal
from decimal import Decimal, ROUND_HALF_UP
price = Decimal("2.675")
print(price.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))   # 2.68

# Safe parsing of user input — input() ALWAYS returns a str
raw = input("Enter marks: ")        # e.g. the user types 87.5
try:
    marks = float(raw)
    print(f"Stored {marks} as {type(marks).__name__}")
except ValueError:
    print("Please enter a number, e.g. 87.5")`
    },
    {
      heading: "6. Arithmetic Operators in Python: /, //, %, ** and Operator Precedence",
      content: `Python's arithmetic operators look like every other language's, but four of them behave in ways that regularly trip up developers coming from C, Java or JavaScript.
**\`/\` true division always returns a float.** \`6 / 3\` is \`2.0\`, not \`2\`. This changed in Python 3 (Python 2 did integer division), and it is why old tutorials sometimes give different output.
**\`//\` floor division** rounds **down toward negative infinity**, not toward zero. \`7 // 2\` is \`3\` as expected, but \`-7 // 2\` is \`-4\` (C and Java give \`-3\`). With a float operand it returns a float: \`7.0 // 2\` is \`3.0\`.
**\`%\` modulo takes the sign of the divisor.** \`-7 % 3\` is \`2\` in Python but \`-1\` in C/Java/JavaScript. The guarantee Python keeps is \`a == (a // b) * b + a % b\`. This makes \`%\` ideal for wrap-around arithmetic (clock hours, circular buffers, day-of-week), because the result is always in \`0 .. b-1\` for positive \`b\`. \`divmod(a, b)\` returns both results in one call.
**\`**\` exponentiation is right-associative and binds tighter than unary minus.** \`2 ** 3 ** 2\` is \`2 ** 9 == 512\`, and \`-2 ** 2\` is \`-(2 ** 2) == -4\`. Write \`(-2) ** 2\` when you mean the square of -2. Negative and fractional exponents work: \`2 ** -1\` is \`0.5\`, \`9 ** 0.5\` is \`3.0\`. The three-argument \`pow(base, exp, mod)\` does fast modular exponentiation, the core of RSA and many interview problems.
**Precedence** from highest to lowest: parentheses, \`**\`, unary \`+ -\`, \`* / // %\`, binary \`+ -\`, comparisons, \`not\`, \`and\`, \`or\`. When in doubt, add parentheses — readability beats cleverness.
**Augmented assignment** (\`+=\`, \`-=\`, \`*=\`, \`/=\`, \`//=\`, \`%=\`, \`**=\`) rebinds the name to the result. Note that \`balance *= 1.05\` turns an \`int\` balance into a \`float\`.
Dividing by zero raises \`ZeroDivisionError\` for both ints and floats (Python does not return \`inf\` like JavaScript). For more maths, the \`math\` module provides \`sqrt\`, \`floor\`, \`ceil\`, \`pi\`, \`log\` and friends.`,
      codeSnippet: `# arithmetic.py
print(7 / 2, 6 / 3)            # 3.5 2.0   — true division ALWAYS returns float
print(7 // 2, 7.0 // 2)        # 3 3.0     — floor division
print(-7 // 2)                 # -4        — floors toward negative infinity, not toward zero
print(7 % 3, -7 % 3, 7 % -3)   # 1 2 -1    — result takes the sign of the divisor
print(divmod(17, 5))           # (3, 2)
print((23 + 5) % 24)           # 4 — 5 hours after 23:00 is 04:00 (wrap-around)
print(2 ** 10, 2 ** -1, 9 ** 0.5)   # 1024 0.5 3.0
print(2 ** 3 ** 2)             # 512 — ** is right-associative: 2 ** (3 ** 2)
print(-2 ** 2, (-2) ** 2)      # -4 4 — ** binds tighter than unary minus
print(10 - 2 * 3 ** 2)         # -8  — ** first, then *, then -
print(pow(2, 10, 1000))        # 24  — (2 ** 10) % 1000, computed efficiently

# Augmented assignment
balance = 10_000
balance -= 2_500       # same as balance = balance - 2500
balance *= 1.05        # now a float: 7875.0
print(balance)

# Practical: break 1870 rupees into notes of 500, 100 and 10
amount = 1870
for note in (500, 100, 10):
    count, amount = divmod(amount, note)
    print(f"{note}-rupee notes: {count}")
# 500-rupee notes: 3
# 100-rupee notes: 3
# 10-rupee notes: 7

import math
print(math.floor(-2.5), math.ceil(2.1), math.sqrt(144))   # -3 3 12.0
# print(1 / 0)   -> ZeroDivisionError: division by zero`
    },
    {
      heading: "7. Comparison and Logical Operators: ==, <, and, or, not, Chained Comparisons",
      content: `**Comparison operators** — \`==\`, \`!=\`, \`<\`, \`<=\`, \`>\`, \`>=\` — always return a \`bool\`. A few rules matter:
• Numbers compare by value across types: \`1 == 1.0\` and \`1 == True\` are \`True\`. But a number never equals a string: \`25 == "25"\` is \`False\`.
• Ordering between unrelated types raises \`TypeError\` (\`5 < "10"\`). Python 2 allowed this; Python 3 refuses because it was a silent source of bugs.
• Strings compare **lexicographically by Unicode code point**, so all uppercase letters sort before lowercase: \`"Zebra" < "apple"\` is \`True\`. For human-friendly sorting, compare \`s.casefold()\` or use \`sorted(words, key=str.lower)\`.
• **Chained comparisons** read like mathematics: \`60 <= marks < 75\` means \`60 <= marks and marks < 75\`, and \`marks\` is evaluated only once.
**Logical operators** — \`and\`, \`or\`, \`not\` — are words, not symbols (\`&&\`, \`||\` do not exist; \`&\` and \`|\` are bitwise). Two behaviours make them more powerful than they look:
1. **Short-circuit evaluation.** \`and\` stops at the first falsy operand; \`or\` stops at the first truthy one. The right side is not evaluated at all, which is why \`user is not None and user.upper()\` is safe.
2. **They return an operand, not necessarily \`True\`/\`False\`.** \`0 or "default"\` returns \`"default"\`; \`3 and 7\` returns \`7\`. This gives the idiom \`name = user_input or "guest"\`. Only \`not\` always returns a bool.
Precedence is \`not\` > \`and\` > \`or\`, so \`True or False and False\` is \`True\`. Parenthesise anything non-trivial.
Finally, the **walrus operator** \`:=\` (Python 3.8+) assigns a value inside an expression. It shines in \`while\` loops and conditions where you would otherwise compute the same thing twice.`,
      codeSnippet: `# comparisons.py
age = 25
print(age >= 18, age == 25.0, age == "25")   # True True False
print(1 == True, 0 == False)                 # True True
print("apple" < "banana", "Zebra" < "apple") # True True — compared by Unicode code point
print(sorted(["delhi", "Agra", "chennai"]))             # ['Agra', 'chennai', 'delhi']
print(sorted(["delhi", "Agra", "chennai"], key=str.lower))   # ['Agra', 'chennai', 'delhi']
# print(5 < "10")   -> TypeError: '<' not supported between instances of 'int' and 'str'

# Chained comparisons read like maths
marks = 72
print(60 <= marks < 75)        # True — same as (60 <= marks) and (marks < 75)

# and / or return one of their OPERANDS, not always True/False
print(0 or "default")          # default
print("" or "guest")           # guest
print(5 and 0)                 # 0
print(3 and 7)                 # 7
print(not 0, not "x")          # True False

# Short-circuit: the right side is never evaluated if not needed
user = None
print(user is not None and user.upper())   # False — user.upper() never runs

# Precedence: not  >  and  >  or
print(True or False and False)             # True  — 'and' is evaluated first
print((True or False) and False)           # False

# Walrus operator (Python 3.8+) assigns inside an expression
if (n := len("Hyderabad")) > 5:
    print(f"long name: {n} letters")       # long name: 9 letters`
    },
    {
      heading: "8. Identity vs Equality in Python: is vs ==",
      content: `This is one of the most common Python interview questions and one of the most common beginner bugs, so it gets its own section.
\`==\` tests **equality**: do two objects have the same **value**? It calls the object's \`__eq__\` method, so a class can define what "equal" means. Two separate lists \`[1, 2, 3]\` and \`[1, 2, 3]\` are equal.
\`is\` tests **identity**: are the two names pointing to the **same object** in memory? It compares \`id(a) == id(b)\` and cannot be overridden. The two separate lists above are **not** identical.
When is \`is\` correct? Only for **singletons** — objects of which exactly one exists: \`None\`, \`True\`, \`False\`, \`NotImplemented\`, \`Ellipsis\`, and sentinel objects you create yourself. PEP 8 explicitly says: compare with \`None\` using \`is\` / \`is not\`, never \`==\`. The reason is both correctness (\`__eq__\` could be overridden to return \`True\` for anything) and speed.
The trap: **\`is\` sometimes appears to work for numbers and strings.** CPython caches small integers from -5 to 256 and interns many short strings, so \`x = 100; y = 100; x is y\` is \`True\`. Even \`257 is 257\` can be \`True\` when both literals are compiled in the same unit. But this is an **implementation detail** — it varies between versions, between the REPL and script files, and between CPython and PyPy. Code that relies on it will break unpredictably. Since Python 3.8 the compiler emits a \`SyntaxWarning\` when you write \`x is 5\` or \`s is "abc"\`.
Rule of thumb: use \`==\` for values, \`is\` for \`None\` and other singletons, and if you are not sure, you want \`==\`.`,
      codeSnippet: `# identity.py
a = [1, 2, 3]
b = [1, 2, 3]
c = a
print(a == b, a is b)      # True False — equal values, different objects
print(a == c, a is c)      # True True  — same object
print(id(a) == id(c))      # True — 'is' is the same as comparing id()

# CPython caches small ints (-5 to 256) — an implementation detail, not a promise
x = 256
y = 256
print(x is y)              # True
x = 257
y = 257
print(x is y)              # True in a script (same compilation unit), may be False in the REPL
# Lesson: NEVER use 'is' for numbers or strings — the result is not guaranteed

# The right uses of 'is': singletons
value = None
print(value is None)       # True — PEP 8 style
print(value == None)       # Works, but discouraged: __eq__ can be overridden
flag = True
print(flag is True)        # fine for the singleton, but 'if flag:' is more Pythonic

# A sentinel: a unique object that means "no argument given"
_MISSING = object()
def fetch(key, default=_MISSING):
    if default is _MISSING:
        raise KeyError(key)
    return default
print(fetch("x", None))    # None — the caller really passed None, which is different from omitting it

# if x is 5:   -> SyntaxWarning: "is" with 'int' literal. Did you mean "=="?`
    },
    {
      heading: "9. Python Strings: Creating, Indexing, Slicing and Immutability",
      content: `A **string** (\`str\`) is an immutable sequence of Unicode characters. "Unicode" means Python 3 strings handle Hindi, Tamil, emoji and the rupee sign as naturally as ASCII — \`len("नमस्ते")\` counts code points, not bytes. You create strings with single quotes, double quotes (identical in meaning — pick one and be consistent; double quotes are the \`black\` formatter default) or **triple quotes** for multi-line text. Adjacent string literals are joined at compile time, which is a clean way to split a long string across lines inside parentheses.
**Indexing** uses square brackets and starts at **0**. Negative indexes count from the end: \`s[-1]\` is the last character. Indexing outside the range raises \`IndexError\`.
**Slicing** \`s[start:stop:step]\` returns a new string. \`start\` is inclusive, \`stop\` is **exclusive**, and all three parts are optional (defaults: 0, \`len(s)\`, 1). This design means \`s[:k] + s[k:] == s\` and \`len(s[a:b]) == b - a\`. A negative step walks backwards; \`s[::-1]\` is the idiomatic reverse. Unlike indexing, slices never raise \`IndexError\` — out-of-range bounds are clipped, and an empty range gives \`""\`. These rules apply identically to lists and tuples, so learn them well once.
Useful operators: \`+\` concatenates, \`*\` repeats, \`in\` tests substring membership, \`len()\` gives the length, and \`ord()\` / \`chr()\` convert between a character and its Unicode code point.
**Immutability** is the key property. Once created, a string's characters cannot change: \`s[0] = "H"\` raises \`TypeError\`. Every "modifying" method — \`upper()\`, \`replace()\`, \`strip()\` — returns a **new** string and leaves the original untouched. Forgetting to capture the return value (\`name.strip()\` on its own line) is a classic bug. Immutability is what makes strings safe as dictionary keys, safe to share between threads, and cheap to hash. The cost is that building a large string with repeated \`+=\` in a loop creates many intermediate objects; for that use \`"".join(parts)\` or \`io.StringIO\`.`,
      codeSnippet: `# strings_basics.py
name = "Bengaluru"
print(len(name))           # 9
print(name[0], name[-1])   # B u   — negative index counts from the end
# print(name[9])           -> IndexError: string index out of range

# Slicing: s[start:stop:step] — stop is EXCLUSIVE; defaults are 0, len(s), 1
print(name[0:4])           # Beng
print(name[4:])            # aluru
print(name[:4])            # Beng
print(name[-4:])           # luru
print(name[::2])           # Bnauu
print(name[::-1])          # urulagneB — reversed
print(name[3:100])         # galuru — slices never raise IndexError
print(name[5:2])           # '' (empty) — start is beyond stop

# Quote styles and multi-line strings
quote = 'He said "Python is easy"'
address = """Flat 402, Green Park,
Hinjewadi, Pune 411057"""
print(address.count("\\n"))   # 1 — one newline inside the triple-quoted string

# Operators on strings
print("Ha" * 3, "Py" + "thon")             # HaHaHa Python
print("gal" in name, "xyz" not in name)   # True True
print(ord("A"), chr(8377))                 # 65 ₹
print(len("नमस्ते"))                       # 6 — code points, not bytes
long_text = ("Adjacent string literals "
             "are joined at compile time")

# Immutability: strings cannot be changed in place
s = "hello"
# s[0] = "H"   -> TypeError: 'str' object does not support item assignment
s = "H" + s[1:]        # build a NEW string and rebind the name
print(s)               # Hello

# Efficient building: join a list instead of += in a loop
parts = [f"row{i}" for i in range(5)]
print(",".join(parts))   # row0,row1,row2,row3,row4`
    },
    {
      heading: "10. Essential Python String Methods Every Developer Should Know",
      content: `Strings come with more than 40 methods. You do not need to memorise all of them — \`dir(str)\` and \`help(str.split)\` are always available — but the ones below cover 95% of real work. Remember: every method **returns a new string** (or a list/bool) and never modifies the original.
**Cleaning and case**
• \`strip()\`, \`lstrip()\`, \`rstrip()\` — remove whitespace (or the characters you pass) from the ends. Essential for user input.
• \`lower()\`, \`upper()\`, \`title()\`, \`capitalize()\`, \`swapcase()\` — case changes. Use \`casefold()\` for case-insensitive **comparison**; it handles special cases like German "ß" that \`lower()\` misses.
**Searching**
• \`find(sub)\` returns the first index or **-1**; \`index(sub)\` does the same but **raises \`ValueError\`** when not found. \`rfind\` / \`rindex\` search from the right.
• \`count(sub)\`, \`startswith(prefix)\`, \`endswith(suffix)\` — the last two accept a **tuple** of alternatives.
• The \`in\` operator is the most readable way to ask "does it contain?".
**Splitting and joining**
• \`split(sep)\` returns a list; with no argument it splits on any whitespace run and drops empties. \`rsplit\`, \`splitlines()\` and \`partition(sep)\` (returns a 3-tuple: before, separator, after) are variants.
• \`sep.join(iterable)\` is the inverse. Note the slightly odd syntax: the separator comes first. All items must be strings.
**Transforming**
• \`replace(old, new, count=-1)\`, \`removeprefix(p)\` and \`removesuffix(s)\` (Python 3.9+; unlike \`strip\`, they remove a whole substring, not a set of characters).
• \`zfill(width)\`, \`center\`, \`ljust\`, \`rjust\` — padding (f-strings usually do this better).
**Validating**
• \`isdigit()\`, \`isalpha()\`, \`isalnum()\`, \`isspace()\`, \`isupper()\`, \`islower()\` — note \`"4.2".isdigit()\` and \`"-5".isdigit()\` are \`False\`; for real number validation, try \`float()\` in a \`try\` block.
**Encoding**
• \`encode("utf-8")\` turns a \`str\` into \`bytes\` for files, sockets and HTTP; \`bytes.decode()\` goes back. The file-handling lecture returns to this.`,
      codeSnippet: `# string_methods.py
email = "  Rahul.Sharma@Gmail.COM  "
clean = email.strip().lower()
print(clean)                          # rahul.sharma@gmail.com
print(clean.split("@"))               # ['rahul.sharma', 'gmail.com']
user, _, domain = clean.partition("@")
print(user, domain)                   # rahul.sharma gmail.com

title = "python for data science"
print(title.title(), "|", title.capitalize(), "|", title.upper())
# Python For Data Science | Python for data science | PYTHON FOR DATA SCIENCE
print(title.replace("data", "web"))   # python for web science
print(title.find("data"), title.find("java"))   # 11 -1
# title.index("java")   -> ValueError: substring not found
print(title.startswith(("py", "ja")), title.endswith("science"))  # True True
print(title.count("a"))               # 2

csv_line = "Mumbai, Delhi ,Chennai"
cities = [c.strip() for c in csv_line.split(",")]
print(cities)                         # ['Mumbai', 'Delhi', 'Chennai']
print(" | ".join(cities))             # Mumbai | Delhi | Chennai
print("  a   b  c ".split())          # ['a', 'b', 'c'] — no argument: any whitespace

print("42".isdigit(), "4.2".isdigit(), "abc".isalpha(), "ab12".isalnum())  # True False True True
print("7".zfill(3), "INV".ljust(6, ".") + "|", "x".center(5, "*"))      # 007 INV...| **x**
print("https://example.com".removeprefix("https://"))   # example.com (Python 3.9+)
print("report.pdf".removesuffix(".pdf"))                # report
print("straße".casefold() == "STRASSE".casefold())      # True — case-insensitive compare
print("line1\\nline2".splitlines())   # ['line1', 'line2']

data = "₹499".encode("utf-8")
print(data, type(data))               # b'\\xe2\\x82\\xb9499' <class 'bytes'>
print(data.decode("utf-8"))           # ₹499`
    },
    {
      heading: "11. f-strings and Format Specifiers: Professional Output Formatting in Python",
      content: `**f-strings** (formatted string literals, Python 3.6+) are the modern way to build strings from values. Prefix the literal with \`f\` and put any expression inside \`{}\`. They are faster than \`str.format()\` and the \`%\` operator, easier to read, and evaluated at runtime, so they can contain method calls, arithmetic and even function calls.
The real power is the **format specifier** after a colon: \`{value:spec}\`. The spec follows the pattern \`[fill][align][sign][#][0][width][,|_][.precision][type]\`. The pieces you will actually use:
• **Precision and type:** \`.2f\` fixed-point with 2 decimals; \`e\` scientific; \`%\` multiplies by 100 and adds a percent sign; \`d\` integer; \`b\`, \`o\`, \`x\`, \`X\` binary/octal/hex; \`#\` adds the \`0b\`/\`0x\` prefix.
• **Grouping:** \`,\` inserts thousands separators (\`125,000.50\`), \`_\` uses underscores. Python's \`,\` uses Western grouping, not the Indian lakh/crore system (\`1,25,000\`); for that use the \`locale\` module with \`en_IN\` or write a small helper.
• **Width and alignment:** \`<\` left, \`>\` right, \`^\` centre, optionally preceded by a fill character (\`{name:*^20}\`). \`0\` before the width zero-pads numbers. Width and precision can themselves be **nested fields** (\`{value:>{width}.{prec}f}\`), set at runtime.
• **Sign:** \`+\` always shows the sign, a space reserves room for it.
• **Conversion flags:** \`!r\` uses \`repr()\` (shows quotes around strings), \`!s\` uses \`str()\`, \`!a\` ASCII-escapes.
• **Debug form** \`{expr=}\` (Python 3.8+) prints \`expr=value\` — perfect for quick debugging and far better than \`print("x", x)\`.
• **Dates:** any object with a \`__format__\` method accepts its own spec, so \`{today:%d-%m-%Y}\` formats a \`date\` directly with strftime codes.
Python 3.12 (PEP 701) removed the old limits: you can now reuse the same quote type inside an f-string, write backslashes inside the expression, and nest f-strings arbitrarily.
You will still meet \`"{} {}".format(a, b)\` and \`"%s %d" % (a, b)\` in older codebases and in the logging module (which uses \`%\`-style lazily for performance). Read them, but write f-strings.`,
      codeSnippet: `# fstrings.py
from datetime import date
name, amount, rate = "Priya", 125000.5, 0.18

print(f"Hello {name}, total = {amount}")       # Hello Priya, total = 125000.5
print(f"{amount:.2f}")        # 125000.50   — 2 decimal places
print(f"{amount:,.2f}")       # 125,000.50  — thousands separator
print(f"{amount:_.0f}")       # 125_000     — underscore separator
print(f"{rate:.1%}")          # 18.0%       — percentage
print(f"{amount:e}")          # 1.250005e+05
print(f"{42:08.3f}")          # 0042.000    — zero-padded to width 8
print(f"{-7:+d} {7:+d}")      # -7 +7       — always show the sign
print(f"{255:b} {255:o} {255:x} {255:#X}")   # 11111111 377 ff 0XFF

# Alignment: < left, > right, ^ centre, with an optional fill character
print(f"|{name:<10}|{name:>10}|{name:^10}|")   # |Priya     |     Priya|  Priya   |
print(f"{name:*^15}")                          # *****Priya*****
print(f"{'Item':<12}{'Qty':>5}{'Price':>10}")
print(f"{'Masala Dosa':<12}{2:>5}{180:>10.2f}")
# Item          Qty     Price
# Masala Dosa     2    180.00

width, prec = 12, 1
print(f"{amount:>{width}.{prec}f}")   # '    125000.5' — nested fields set at runtime

# Conversions and debugging
print(f"{name!r}")            # 'Priya'  — repr instead of str
print(f"{amount=}")           # amount=125000.5  (Python 3.8+ debug form)
print(f"{amount * 2 = }")     # amount * 2 = 250001.0

# Expressions, method calls and dates
print(f"{name.upper()} has {len(name)} letters")   # PRIYA has 5 letters
print(f"Today: {date.today():%d-%m-%Y}")           # Today: 09-10-2026
print(f"{"same quotes inside":>22}")               # Python 3.12+ (PEP 701)

# Indian grouping (lakh/crore) is not built in — a small helper
def inr(n):
    s = f"{int(n):d}"
    if len(s) <= 3:
        return s
    head, tail = s[:-3], s[-3:]
    pairs = [head[max(i - 2, 0):i] for i in range(len(head), 0, -2)]
    return ",".join(reversed(pairs)) + "," + tail
print(inr(12500000))          # 1,25,00,000

# Older alternatives you will still see in codebases
print("{} scored {:.1f}%".format(name, 87.456))   # Priya scored 87.5%
print("%s scored %.1f%%" % (name, 87.456))        # Priya scored 87.5%`
    },
    {
      heading: "12. Escape Sequences and Raw Strings in Python",
      content: `Inside a normal string literal the backslash is an **escape character**: it gives the next character a special meaning. The escape sequences you will use most:
• \`\\n\` newline, \`\\t\` tab, \`\\r\` carriage return.
• \`\\\\\` a single literal backslash.
• \`\\'\` and \`\\"\` quotes inside a string delimited by the same quote (or just switch the outer quote type — it is cleaner).
• \`\\uXXXX\` and \`\\UXXXXXXXX\` Unicode code points, \`\\N{NAME}\` a character by its Unicode name (\`\\N{RUPEE SIGN}\`), \`\\xHH\` a byte-sized hex value.
• A backslash at the very end of a line continues the string on the next line without inserting a newline.
An unknown escape such as \`\\d\` or \`\\p\` is left as-is **with a \`SyntaxWarning\`** (Python 3.12+; a \`DeprecationWarning\` before that), and it may become an error in a future version — so never rely on it.
**Raw strings** (\`r"..."\`) switch escaping off: every backslash is kept literally. They exist for two jobs:
1. **Regular expressions**, which use backslashes heavily. \`r"\\d{3}-\\d{4}"\` is a 3-digit, dash, 4-digit pattern; without \`r\` you would need \`"\\\\d{3}-\\\\d{4}"\`.
2. **Windows paths** like \`C:\\Users\\ravi\\new_folder\`. In a normal string, \`\\n\` in \`\\new_folder\` becomes a newline and \`\\U\` in \`\\Users\` is an invalid Unicode escape that raises \`SyntaxError\`. With a raw string both are fine.
One limitation: a raw string **cannot end with an odd number of backslashes**, because the backslash would escape the closing quote. \`r"C:\\path\\"\` is a \`SyntaxError\`; write \`r"C:\\path" + "\\\\"\` or, better, stop building paths by hand. The modern approach is \`pathlib.Path\`, which joins segments with \`/\` and works on Windows, Linux and macOS without any backslashes at all.
Combining prefixes is allowed: \`rf"..."\` (or \`fr"..."\`) gives a raw f-string, useful for regex patterns that include a variable. Also note that \`print()\` interprets escapes when it outputs the string, while \`repr()\` (and the REPL's echo) shows them escaped — \`"a\\nb"\` is 3 characters, not 4.`,
      codeSnippet: `# escapes.py
print("Name:\\tRavi\\nCity:\\tPatna")
# Name:   Ravi
# City:   Patna
print("She said \\"hi\\"", 'It\\'s 5 o\\'clock')   # She said "hi" It's 5 o'clock
print("C:\\\\Users\\\\ravi")           # C:\\Users\\ravi — a literal backslash is written \\\\
print("\\u20b9 499", "\\N{RUPEE SIGN} 499", "\\x41")   # ₹ 499 ₹ 499 A
print(len("a\\nb"), len("\\\\"))        # 3 1
print(repr("a\\nb"))                 # 'a\\nb' — repr shows the escape, print would show a real newline
long_msg = "This string continues \\
on the next line"                  # backslash-newline: no newline is inserted
print(long_msg)                    # This string continues on the next line

# Raw strings: backslashes are kept as-is
path = r"C:\\Users\\ravi\\new_folder"     # without r: \\U is a SyntaxError and \\n a newline
print(path)                          # C:\\Users\\ravi\\new_folder
import re
pattern = r"\\d{3}-\\d{4}"               # regex: 3 digits, dash, 4 digits
print(re.search(pattern, "Call 022-4567 now").group())   # 022-4567
area = "022"
print(re.findall(rf"{area}-\\d{{4}}", "022-4567, 044-1234"))   # ['022-4567'] — raw f-string
# r"C:\\path\\"  -> SyntaxError: a raw string cannot end with an odd number of backslashes

# Modern alternative for file paths: pathlib (no backslashes at all)
from pathlib import Path
p = Path.home() / "Documents" / "report.txt"
print(p.name, p.suffix, p.stem)      # report.txt .txt report`
    },
    {
      heading: "13. Real-World Use Cases: How These Basics Are Used in Production",
      content: `Everything in this lecture shows up daily in production Python. Here is where you will meet it.
**Configuration and environment variables.** Every setting from the environment is a string. A web service reads \`PORT\`, \`DEBUG\` and \`DATABASE_URL\` with \`os.environ\`, then converts: \`int()\` for ports, a lowercase membership test for booleans, and \`or\` for defaults. Libraries like Pydantic Settings automate this, but under the hood it is the same type conversion.
**Validating and normalising user input.** Signup forms send \`"  Priya.Nair@Gmail.COM "\`. Before storing it you \`strip()\`, \`lower()\`, check \`"@" in email\` and split on \`@\` to validate the domain. Phone numbers get \`replace()\`d to digits and checked with \`isdigit()\` and \`len()\`. Doing this consistently at the boundary avoids duplicate accounts and broken SMS sends.
**Money and billing.** GST calculation, invoice totals and payment splits must not drift by a paisa. Teams either store amounts as integer paise (\`int\`) and use \`divmod\` to display rupees and paise, or use \`Decimal\` with explicit rounding. \`float\` is for analytics, not for ledgers.
**Reports, logs and CLI output.** Operations teams read aligned tables from cron jobs. f-string width and alignment specifiers (\`{name:<20}{amount:>12,.2f}\`) produce those tables without any third-party library. The \`{x=}\` debug form speeds up troubleshooting in a live shell.
**Regular expressions and file paths.** Log parsers, scrapers and ETL jobs use raw strings for patterns and \`pathlib\` for paths, so the same script runs on a developer's Windows laptop and a Linux server.
**Identity checks in frameworks.** Django and FastAPI code is full of \`if value is None\` and sentinel objects (\`_MISSING = object()\`) to distinguish "argument not provided" from "argument provided as None". Understanding \`is\` vs \`==\` is what lets you read and write that code correctly.
The snippet shows a realistic startup config block that uses conversion, defaults, string methods and f-strings together.`,
      codeSnippet: `# config.py — typical settings loader for a small web service
import os
from pathlib import Path

# Environment variables are ALWAYS strings (or missing)
PORT = int(os.environ.get("PORT", "8000"))
DEBUG = os.environ.get("DEBUG", "false").strip().lower() in ("1", "true", "yes")
DATABASE_URL = os.environ.get("DATABASE_URL") or "sqlite:///dev.db"
ALLOWED_HOSTS = [h.strip() for h in os.environ.get("ALLOWED_HOSTS", "localhost").split(",") if h.strip()]
LOG_DIR = Path(os.environ.get("LOG_DIR", "logs")).resolve()

# Derived values
WORKERS = max(1, (os.cpu_count() or 1) // 2)        # floor division: half the cores, at least 1
DB_KIND, _, _ = DATABASE_URL.partition("://")       # 'sqlite' / 'postgresql' / ...

def masked(url):
    """Hide the password in a DB URL before logging it."""
    if "@" not in url:
        return url
    creds, _, host = url.rpartition("@")
    scheme, _, user_pass = creds.partition("://")
    user = user_pass.split(":", 1)[0]
    return f"{scheme}://{user}:****@{host}"

print(f"{'Port':<14}{PORT}")
print(f"{'Debug':<14}{DEBUG}")
print(f"{'Database':<14}{masked(DATABASE_URL)}  ({DB_KIND})")
print(f"{'Workers':<14}{WORKERS}")
print(f"{'Hosts':<14}{', '.join(ALLOWED_HOSTS)}")
print(f"{'Log dir':<14}{LOG_DIR}")
# Example output with DATABASE_URL=postgresql://app:secret@db.internal:5432/shop
# Port          8000
# Debug         False
# Database      postgresql://app:****@db.internal:5432/shop  (postgresql)
# Workers       4
# Hosts         localhost
# Log dir       /srv/app/logs`
    },
    {
      heading: "14. Common Mistakes with Python Variables, Types and Strings — and How to Fix Them",
      content: `**1. Comparing floats with \`==\`.** \`0.1 + 0.2 == 0.3\` is \`False\`. Fix: \`math.isclose(a, b)\`, or round both to a fixed number of decimals, or use \`Decimal\` / integer paise for money.
**2. Using \`is\` for value comparison.** \`if count is 0:\` or \`if name is "admin":\` works by accident on small ints and interned strings and then fails mysteriously. Fix: \`==\` for values; \`is\` only for \`None\`, \`True\`, \`False\` and sentinels.
**3. Forgetting that string methods return new strings.** \`name.strip()\` on its own line does nothing visible. Fix: \`name = name.strip()\`.
**4. Concatenating a string and a number.** \`"Age: " + 25\` raises \`TypeError\`. Fix: \`f"Age: {25}"\` or \`str(25)\`.
**5. Assuming \`b = a\` copies a list.** Mutating \`b\` changes \`a\`. Fix: \`b = a.copy()\` (or \`list(a)\`, \`a[:]\`); for nested structures \`copy.deepcopy(a)\`. Strings and numbers are immutable, so this problem never arises with them.
**6. Expecting C-style integer division and modulo.** \`7 / 2\` is \`3.5\`; \`-7 // 2\` is \`-4\`; \`-7 % 3\` is \`2\`. Fix: use \`//\` when you want an integer; use \`int(a / b)\` or \`math.trunc\` if you specifically need truncation toward zero.
**7. \`-2 ** 2\` giving \`-4\`.** Exponentiation binds tighter than unary minus. Fix: \`(-2) ** 2\`.
**8. \`bool("False")\` being \`True\`.** Any non-empty string is truthy. Fix: \`value.lower() in ("true", "1", "yes")\`.
**9. \`isinstance(x, int)\` accepting \`True\`.** Because \`bool\` subclasses \`int\`. Fix: add \`and not isinstance(x, bool)\` when booleans must be rejected.
**10. Backslashes in Windows paths.** \`"C:\\new\\\\test"\` contains a newline and a tab. Fix: raw strings \`r"C:\\new\\test"\`, forward slashes (Windows accepts them), or \`pathlib.Path\`.
**11. Building large strings with \`+=\` in a loop.** Each iteration copies the whole string. Fix: collect parts in a list and \`"".join()\` them once.
**12. \`round()\` surprises.** \`round(2.5)\` is \`2\` (half-to-even) and \`round(2.675, 2)\` is \`2.67\` (binary float). Fix: \`Decimal\` with \`ROUND_HALF_UP\` for financial rounding.`,
      codeSnippet: `# mistakes_fixed.py — each pair shows the bug, then the fix
import math, copy
from decimal import Decimal, ROUND_HALF_UP

# 1. Float equality
print(0.1 + 0.2 == 0.3)                       # False  (bug)
print(math.isclose(0.1 + 0.2, 0.3))           # True   (fix)

# 3. Methods return new strings
name = "  Asha  "
name.strip()                                  # result thrown away (bug)
name = name.strip()                           # (fix)
print(repr(name))                             # 'Asha'

# 5. Aliasing vs copying
a = [1, 2]
b = a                                         # alias (bug if you expected a copy)
b.append(3)
print(a)                                      # [1, 2, 3]
c = copy.deepcopy(a)                          # independent copy (fix)
c.append(4)
print(a, c)                                   # [1, 2, 3] [1, 2, 3, 4]

# 6. Division semantics
print(-7 // 2, int(-7 / 2), math.trunc(-7 / 2))   # -4 -3 -3

# 8. Parsing booleans from text
flag = "False"
print(bool(flag))                                 # True   (bug)
print(flag.strip().lower() in ("true", "1", "yes"))   # False  (fix)

# 9. Rejecting bool when you want a real number
def is_number(x):
    return isinstance(x, (int, float)) and not isinstance(x, bool)
print(is_number(5), is_number(True))          # True False

# 11. Efficient string building
parts = []
for i in range(3):
    parts.append(f"item-{i}")
print(";".join(parts))                        # item-0;item-1;item-2

# 12. Financial rounding
print(round(2.675, 2))                                                   # 2.67
print(Decimal("2.675").quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))   # 2.68`
    },
    {
      heading: "15. Frequently Asked Questions about Python Variables, Data Types and Strings",
      content: `**What is dynamic typing in Python?**
Dynamic typing means the type belongs to the object, not to the variable name, and is checked at runtime. The same name can refer to a string now and an integer later. Python is also **strongly** typed: it never silently converts a string to a number, so \`"5" + 5\` is an error rather than \`"55"\`. Type hints such as \`def total(items: list[int]) -> int:\` are optional annotations for tools like mypy and your IDE; the interpreter ignores them.
**What is the difference between is and == in Python?**
\`==\` compares values (it calls \`__eq__\`), while \`is\` compares identity (whether both names point to the same object). Use \`==\` for values and \`is\` only for singletons like \`None\`. \`x is 5\` may appear to work because CPython caches small integers, but it is not guaranteed and Python 3.8+ warns about it.
**Why does 0.1 + 0.2 not equal 0.3 in Python?**
Floats are binary fractions, and 0.1 and 0.2 cannot be represented exactly in base 2, so tiny rounding errors accumulate and the sum is \`0.30000000000000004\`. Every language using IEEE 754 doubles has the same behaviour. Compare with \`math.isclose\` or use \`Decimal\` for exact decimal arithmetic.
**Are strings mutable or immutable in Python?**
Strings are immutable: you cannot change a character in place, and every method like \`upper()\` or \`replace()\` returns a new string. This makes strings hashable (usable as dict keys and set members) and safe to share. To "modify" a string, build a new one and rebind the name.
**What is the difference between / and // in Python?**
\`/\` is true division and always returns a float (\`7 / 2 == 3.5\`). \`//\` is floor division: it rounds the result down toward negative infinity and returns an int when both operands are ints (\`7 // 2 == 3\`, \`-7 // 2 == -4\`).
**What are f-strings in Python and why should I use them?**
f-strings (Python 3.6+) are string literals prefixed with \`f\` in which \`{expression}\` is evaluated and inserted at runtime, with an optional format spec like \`{amount:,.2f}\`. They are more readable and faster than \`str.format()\` and \`%\` formatting, support the \`{x=}\` debug form (3.8+), and since Python 3.12 can reuse quotes and nest freely.
**What is a raw string in Python and when should I use it?**
A raw string \`r"..."\` keeps backslashes literally instead of treating them as escapes. Use raw strings for regular expressions and for Windows paths. The one restriction is that a raw string cannot end with an odd number of backslashes; for paths, prefer \`pathlib.Path\` anyway.`
    },
    {
      heading: "16. Interview Questions and Answers on Python Data Types, Operators and Strings",
      content: `**Q1. Explain how variable assignment works in Python. Is a variable a container?**
No. A Python variable is a name bound to an object. Assignment creates or moves a label; it does not copy data. This is why \`b = a\` for a list makes both names refer to one list, while for immutable objects such as ints and strings aliasing is harmless because the object can never change.
**Q2. Is bool a subclass of int? What are the consequences?**
Yes. \`True == 1\`, \`False == 0\`, \`True + True == 2\` and \`isinstance(True, int)\` is \`True\`. Consequences: you can \`sum()\` a list of booleans to count matches, but type checks that mean "integer only" must explicitly exclude \`bool\`, and \`{1: "a", True: "b"}\` has a single key because \`1\` and \`True\` are equal and hash the same.
**Q3. What is the output of \`print(-7 // 2, -7 % 2)\` and why?**
\`-4 1\`. Floor division rounds toward negative infinity, and modulo takes the sign of the divisor so that \`a == (a // b) * b + a % b\` always holds: \`(-4) * 2 + 1 == -7\`.
**Q4. Why is \`x is 257\` unreliable, and why does \`None\` use \`is\`?**
CPython preallocates ints from -5 to 256 and may deduplicate other constants within one compilation unit, so identity comparisons on numbers depend on implementation details. \`None\` is a true singleton — there is exactly one \`None\` object in the process — so \`is None\` is both correct and faster than \`== None\`, which would invoke \`__eq__\`.
**Q5. What is the difference between \`type()\` and \`isinstance()\`?**
\`type(x)\` returns the exact class; comparing it is strict and ignores inheritance. \`isinstance(x, C)\` returns \`True\` for \`C\` and all its subclasses, accepts a tuple or (3.10+) a union of classes, and is the idiomatic choice.
**Q6. How does string slicing work, and what does \`s[::-1]\` do?**
\`s[start:stop:step]\` returns a new string from \`start\` (inclusive) to \`stop\` (exclusive) every \`step\` characters. Omitted values default to the beginning, the end and 1. A negative step walks backwards, so \`s[::-1]\` returns the reversed string. Slices clip out-of-range bounds instead of raising.
**Q7. Why is \`"".join(list)\` preferred over \`+=\` in a loop?**
Because strings are immutable, each \`+=\` allocates a new string and copies the old content, giving O(n²) behaviour for n pieces. \`join()\` computes the total size once and copies each piece once, which is O(n).
**Q8. What does \`f"{value:>10,.2f}"\` produce?**
A right-aligned field 10 characters wide, with thousands separators and two decimal places — for \`value = 1234.5\` it gives \`"  1,234.50"\`. The order inside the spec is fill, align, sign, width, grouping, precision, type.`
    },
    {
      heading: "17. Hands-On Exercise: Build a UPI Payment Receipt Formatter",
      content: `Time to put every concept from this lecture into one small, realistic program. A payment gateway hands you raw, messy fields — exactly as they would arrive from an HTML form or a webhook: a name with stray spaces and wrong capitalisation, a UPI ID in mixed case, a phone number with \`+91\` and dashes, an amount with a thousands separator, and a blank tip field. Your program must:
1. **Clean and convert** every field using string methods and explicit type conversion (\`strip\`, \`title\`, \`lower\`, \`replace\`, \`float\`, \`int\`, the \`or\` default idiom).
2. **Calculate** GST and the total with arithmetic operators, then split the total into rupees and paise with \`divmod\` on an integer so no paisa is lost to float drift.
3. **Validate** the UPI ID and phone number with comparison, membership and logical operators, and set a status.
4. **Print a receipt** using f-string alignment, width, grouping and precision specifiers, plus the \`{x=}\` debug form.
Save the file as \`upi_receipt.py\` and run \`python upi_receipt.py\`. Read the expected output in the comments and compare.
**Extend it yourself (recommended):**
• Replace the hard-coded raw values with \`input()\` calls and keep the program working when the user types \`1249.5\`, \`1,249.50\` or \`  1249  \`.
• Add an \`inr()\` helper (from Section 11) so the amount prints as \`1,249.50\` in Indian grouping for large values such as \`12,50,000.00\`.
• Reject a phone number that does not start with 6, 7, 8 or 9 (Indian mobile numbers) using \`startswith\` with a tuple.
• Mask the UPI ID as \`pr***@okaxis\` using slicing and \`partition\`.
• Store the amount in integer paise from the start and format rupees with \`divmod\` only at print time.`,
      codeSnippet: `# upi_receipt.py — Hands-on exercise: clean raw payment data and print a formatted receipt
# Run: python upi_receipt.py
from datetime import datetime

# 1. Raw data exactly as it might arrive from a form or an API (all strings, messy)
raw_name = "   priya NAIR "
raw_upi = "Priya.Nair@OKAXIS"
raw_phone = "+91-98765 43210"
raw_amount = "1,249.50"
raw_gst_rate = "18"
raw_tip_percent = ""            # the user left it blank

# 2. Clean and convert (string methods + explicit type conversion)
name = raw_name.strip().title()                        # 'Priya Nair'
upi_id = raw_upi.strip().lower()                       # 'priya.nair@okaxis'
digits = raw_phone.replace("+91", "").replace("-", "").replace(" ", "")   # '9876543210'
phone_masked = "X" * 6 + digits[-4:]                   # 'XXXXXX3210'  (repetition + slicing)
amount = float(raw_amount.replace(",", ""))            # 1249.5
gst_rate = int(raw_gst_rate) / 100                     # 0.18  (true division -> float)
tip_percent = float(raw_tip_percent or "0")            # '' is falsy, so 'or' supplies "0"

# 3. Arithmetic
gst = round(amount * gst_rate, 2)                      # 224.91
tip = round(amount * tip_percent / 100, 2)             # 0.0
total = amount + gst + tip                             # 1474.41
rupees, paise = divmod(round(total * 100), 100)        # (1474, 41) — integer split, no float drift

# 4. Validation with comparison, membership and logical operators
is_valid_upi = ("@" in upi_id) and upi_id.count("@") == 1 and not upi_id.startswith("@")
is_valid_phone = digits.isdigit() and len(digits) == 10 and digits.startswith(("6", "7", "8", "9"))
status = "OK" if is_valid_upi and is_valid_phone else "REVIEW"

# 5. Formatted receipt with f-strings and format specifiers
line = "-" * 40
now = datetime.now()
txn_id = f"TXN{now:%Y%m%d}{abs(hash(upi_id)) % 10_000:04d}"
date_str = f"{now:%d-%m-%Y %H:%M}"
gst_label = f"GST @ {gst_rate:.0%}"

print(line)
print(f"{'UPI PAYMENT RECEIPT':^40}")
print(line)
print(f"{'Payer':<12}{name:>28}")
print(f"{'UPI ID':<12}{upi_id:>28}")
print(f"{'Phone':<12}{phone_masked:>28}")
print(f"{'Txn ID':<12}{txn_id:>28}")
print(f"{'Date':<12}{date_str:>28}")
print(line)
print(f"{'Amount':<20}{'₹':>10}{amount:>10,.2f}")
print(f"{gst_label:<20}{'₹':>10}{gst:>10,.2f}")
print(f"{'Tip':<20}{'₹':>10}{tip:>10,.2f}")
print(line)
print(f"{'TOTAL':<20}{'₹':>10}{total:>10,.2f}")
print(f"{'(rupees / paise)':<20}{rupees:>14} / {paise:02d}")
print(f"{'Status':<20}{status:>20}")
print(line)
print(f"debug: {amount=}, {gst=}, {tip=}, {total=}")
print(f"types: {type(amount).__name__}, {type(rupees).__name__}, {type(status).__name__}")

# Expected output (date and Txn ID will differ on your machine):
# ----------------------------------------
#           UPI PAYMENT RECEIPT
# ----------------------------------------
# Payer                         Priya Nair
# UPI ID                 priya.nair@okaxis
# Phone                         XXXXXX3210
# Txn ID                   TXN202610091234
# Date                    09-10-2026 10:30
# ----------------------------------------
# Amount                       ₹  1,249.50
# GST @ 18%                    ₹    224.91
# Tip                          ₹      0.00
# ----------------------------------------
# TOTAL                        ₹  1,474.41
# (rupees / paise)                1474 / 41
# Status                                OK
# ----------------------------------------
# debug: amount=1249.5, gst=224.91, tip=0.0, total=1474.41
# types: float, int, str`
    },
    {
      heading: "18. Summary",
      content: `• A Python variable is a **name bound to an object**; the object carries the type. Python is **dynamically** typed (types checked at runtime) and **strongly** typed (no silent string-to-number conversion). Assignment never copies — \`b = a\` aliases mutable objects.
• Core types: \`int\` (arbitrary precision), \`float\` (IEEE 754 double — never compare with \`==\`, never use for money), \`complex\`, \`bool\` (a subclass of \`int\`) and the singleton \`None\`. Falsy values: \`0\`, \`0.0\`, \`""\`, \`[]\`, \`{}\`, \`None\`.
• \`type()\` gives the exact class; \`isinstance()\` respects inheritance and accepts tuples or \`int | float\` unions (3.10+).
• Explicit conversion with \`int()\`, \`float()\`, \`str()\`, \`bool()\`, \`round()\`; invalid text raises \`ValueError\`; \`input()\` and environment variables are always strings. Implicit conversion happens only between numeric types.
• \`/\` always returns a float; \`//\` floors toward negative infinity; \`%\` takes the sign of the divisor; \`**\` is right-associative and binds tighter than unary minus. Precedence: \`**\`, unary, \`* / // %\`, \`+ -\`, comparisons, \`not\`, \`and\`, \`or\`.
• Comparisons chain (\`60 <= m < 75\`); \`and\`/\`or\` short-circuit and return an operand; \`x := expr\` assigns inside expressions (3.8+).
• \`==\` compares values, \`is\` compares identity. Use \`is\` only for \`None\` and other singletons.
• Strings are immutable Unicode sequences: 0-based indexing, negative indexes, \`s[start:stop:step]\` slicing with exclusive stop, \`s[::-1]\` to reverse, \`"".join()\` to build.
• Key methods: \`strip\`, \`lower\`/\`casefold\`, \`split\`/\`join\`/\`partition\`, \`find\`/\`index\`, \`replace\`, \`startswith\`/\`endswith\`, \`removeprefix\`/\`removesuffix\` (3.9+), \`isdigit\`, \`encode\`/\`decode\`.
• f-strings (3.6+) with specifiers \`{v:,.2f}\`, \`{v:>10}\`, \`{v:08.3f}\`, \`{v:.1%}\`, \`{v!r}\`, \`{v=}\` (3.8+), \`{d:%d-%m-%Y}\`; same-quote reuse from 3.12.
• Escape sequences (\`\\n\`, \`\\t\`, \`\\\\\`, \`\\u20b9\`) versus raw strings \`r"..."\` for regex and Windows paths; prefer \`pathlib.Path\` for paths.
**Next lecture:** Control Flow — Conditionals, match, Loops & Comprehensions`
    }
  ]
};
