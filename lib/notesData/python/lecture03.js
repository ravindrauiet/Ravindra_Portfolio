export const lecture03 = {
  slug: "lecture-3",
  number: 3,
  title: "Complete Python Course — Lecture 3: Control Flow — Conditionals, match, Loops & Comprehensions",
  summary: "Master Python control flow: if/elif/else, truthiness, conditional expressions, match/case pattern matching, for loops and range, while, break/continue/else, enumerate and zip, list/dict/set comprehensions and the walrus operator — with real examples, common mistakes and interview questions.",
  readTime: "50 min read",
  difficulty: "Beginner",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. Introduction: What Is Control Flow in Python and Why It Matters",
      content: `A program that only runs top to bottom, one line after another, can do very little. Real software must **decide** ("is this payment above ₹2,00,000? then ask for OTP"), **repeat** ("send this reminder to every student in the batch"), and **stop or skip** ("if the file is empty, move on to the next one"). The set of language features that lets you decide, repeat, skip and stop is called **control flow**, and it is the subject of this lecture.
In Lecture 2 you learned about variables, data types, operators and strings — the raw materials. Control flow is where those materials become logic. Every Django view, every pandas cleaning script, every FastAPI endpoint and every automation job you will ever write is built from the handful of constructs covered here:
• **Conditionals** — \`if\`, \`elif\`, \`else\`, conditional expressions, and Python's idea of **truthiness**.
• **Structural pattern matching** — the \`match\`/\`case\` statement added in Python 3.10, which goes far beyond a C-style switch.
• **Loops** — \`for\` with \`range()\`, \`while\`, and the loop-control keywords \`break\`, \`continue\` and the rarely understood \`else\` clause on loops.
• **Looping helpers** — \`enumerate()\` and \`zip()\`, which replace clumsy index arithmetic.
• **Comprehensions** — list, dict and set comprehensions (plus generator expressions), the most "Pythonic" way to build collections, and the judgement to know when a nested comprehension has become unreadable.
• **The walrus operator** \`:=\` (Python 3.8+) — assignment inside an expression.
Why does it matter beyond passing exams? Because Python's control flow is where readability lives. Two developers can produce the same output; the one who uses \`for item in items\` instead of \`for i in range(len(items))\`, \`enumerate\` instead of a manual counter, and a comprehension instead of a four-line append loop writes code that reviewers approve faster and that survives in production longer. Interviewers at Indian product companies and service firms alike test exactly these idioms, because they reveal whether you *think* in Python or merely translate from C or Java.
Everything in this lecture runs on Python 3.12 and above. Python 3.14 is the current stable series as this lecture is written (Python 3.15 is scheduled for October 2026), and we label features with the version that introduced them, such as "3.10+" for \`match\`. Run \`python --version\` to confirm what you have.`,
      codeSnippet: `# control_flow_preview.py — every construct from this lecture in 20 lines
orders = [("Priya", 1250), ("Rahul", 0), ("Anjali", 4999), ("Dev", 180)]

for position, (name, amount) in enumerate(orders, start=1):   # enumerate + tuple unpacking
    if amount == 0:                                            # if / elif / else
        status = "cart abandoned"
    elif amount >= 2000:
        status = "free delivery"
    else:
        status = f"delivery charge ₹{49 if amount < 500 else 29}"   # conditional expression
    print(f"{position}. {name:<7} ₹{amount:>5}  -> {status}")

paid = [name for name, amount in orders if amount > 0]        # list comprehension
print("Paid customers:", paid)                                # ['Priya', 'Anjali', 'Dev']

while (total := sum(a for _, a in orders)) > 6300:            # walrus + generator expression
    orders.pop()                                              # drop the last order until total <= 6300
print("Total after trimming:", total)                         # 6429 -> 6249 after one pop

# Expected output:
# 1. Priya   ₹ 1250  -> delivery charge ₹29
# 2. Rahul   ₹    0  -> cart abandoned
# 3. Anjali  ₹ 4999  -> free delivery
# 4. Dev     ₹  180  -> delivery charge ₹49
# Paid customers: ['Priya', 'Anjali', 'Dev']
# Total after trimming: 6249`
    },
    {
      heading: "2. if, elif and else in Python: Making Decisions",
      content: `The \`if\` statement evaluates a condition; if the condition is true, the indented block runs. Python has no curly braces and no parentheses requirement around the condition — the colon and the **indentation** (4 spaces, per PEP 8) define the block. This is not cosmetic: wrong indentation is a syntax error or, worse, a silent logic bug.
The full form is \`if\` → zero or more \`elif\` ("else if") branches → an optional \`else\`. Python evaluates the conditions **top to bottom and stops at the first true one**. This has two practical consequences. First, order your conditions from most specific to most general: if you check \`marks >= 40\` before \`marks >= 90\`, a 95 will be graded as "pass" and never reach the "distinction" branch. Second, at most one branch runs, so \`elif\` is not the same as a series of separate \`if\` statements — separate \`if\`s can all fire, which is sometimes what you want (several independent discounts) and sometimes a bug (a customer getting both the "new user" and the "loyal user" message).
Python 3 has no limit on how many \`elif\` branches you may chain, but once you pass four or five, consider a dictionary lookup or a \`match\` statement (Section 5) instead — long \`elif\` ladders are a known readability smell.
Conditions can be any expression. Comparison operators (\`==\`, \`!=\`, \`<\`, \`<=\`, \`>\`, \`>=\`), membership tests (\`in\`, \`not in\`), identity tests (\`is\`, \`is not\`) and the logical operators \`and\`, \`or\`, \`not\` all return values Python can interpret as true or false. Chained comparisons such as \`18 <= age < 60\` are evaluated as \`18 <= age and age < 60\`, exactly as a mathematician would read them, and they are the preferred way to express a range.
A few conventions used by professional Python teams:
• Compare against \`None\` with \`is None\` / \`is not None\`, never \`== None\`.
• Do not write \`if flag == True:\` — write \`if flag:\`. Do not write \`if len(items) > 0:\` — write \`if items:\` (see Section 3 on truthiness).
• Prefer **early returns / guard clauses** inside functions over deeply nested \`if\` blocks; the "happy path" should sit at the lowest indentation level.
• Use \`pass\` as a placeholder when a branch intentionally does nothing, and leave a comment saying why.`,
      codeSnippet: `# grades.py — an if / elif / else ladder, ordered from most specific to most general
def grade_for(marks: int) -> str:
    if not 0 <= marks <= 100:          # guard clause first: reject bad input early
        raise ValueError(f"marks must be between 0 and 100, got {marks}")
    if marks >= 90:
        return "A+ (Distinction)"
    elif marks >= 75:
        return "A"
    elif marks >= 60:
        return "B"
    elif marks >= 40:
        return "C (Pass)"
    else:
        return "F (Fail)"

for m in (95, 75, 59, 40, 12):
    print(m, "->", grade_for(m))

# Membership, identity and chained comparisons as conditions
city = "Pune"
metro_cities = {"Mumbai", "Delhi", "Bengaluru", "Chennai", "Kolkata", "Hyderabad"}
user = None

if city in metro_cities:
    print(city, "is a metro city")
else:
    print(city, "is a non-metro city")        # <- this runs

if user is None:                               # correct way to test for None
    print("No user is logged in")

age = 34
if 18 <= age < 60:                             # chained comparison, reads like maths
    print("Working-age adult")

# Output:
# 95 -> A+ (Distinction)
# 75 -> A
# 59 -> C (Pass)
# 40 -> C (Pass)
# 12 -> F (Fail)
# Pune is a non-metro city
# No user is logged in
# Working-age adult`
    },
    {
      heading: "3. Truthiness and Conditional Expressions in Python",
      content: `Python does not force you to put a \`bool\` inside an \`if\`. **Any object** can be tested for truth. The rule is simple and worth memorising, because it is asked in nearly every Python interview:
• These values are **falsy**: \`None\`, \`False\`, every numeric zero (\`0\`, \`0.0\`, \`0j\`, \`Decimal(0)\`, \`Fraction(0, 1)\`), every empty sequence or collection (\`""\`, \`[]\`, \`()\`, \`{}\`, \`set()\`, \`range(0)\`), and any object whose \`__bool__()\` returns \`False\` or, failing that, whose \`__len__()\` returns \`0\`.
• **Everything else is truthy** — including the strings \`"0"\` and \`"False"\`, negative numbers, non-empty lists containing only falsy items (\`[0]\` is truthy because it has one element), and every function, class and module object.
Truthiness is why idiomatic Python says \`if items:\` instead of \`if len(items) > 0:\` and \`if not name:\` instead of \`if name == "":\`. It also powers the short-circuit tricks you will see in real code: \`display = nickname or full_name\` picks the first truthy value, and \`count = data and len(data)\` evaluates \`len\` only when \`data\` is non-empty. Note that \`and\` and \`or\` return one of their **operands**, not a bare \`True\`/\`False\` — \`"" or "guest"\` evaluates to \`"guest"\`.
There is one important trap: truthiness cannot distinguish "no value" from "zero". If a function may legitimately return \`0\` (a balance, a count, an index) and \`None\` means "not found", you must write \`if result is not None:\`, not \`if result:\`. A rupee balance of \`0\` is a real balance, not a missing one.
**Conditional expressions** (often called Python's ternary operator) let you choose between two values in a single expression: \`value_if_true if condition else value_if_false\`. The condition is in the middle, which surprises people coming from C or JavaScript (\`cond ? a : b\`). Use it when both outcomes are short, simple values — a label, a default, a number. Do not chain more than two of them together, and never put side effects (function calls that change state) inside the branches; at that point an \`if\` block is clearer. Conditional expressions are especially handy inside f-strings, function arguments and comprehensions, where a statement is not allowed.`,
      codeSnippet: `# truthiness.py
from decimal import Decimal

samples = [0, 0.0, "", "0", [], [0], {}, None, Decimal("0"), -1, "False", range(0)]
for value in samples:
    print(f"{value!r:<14} -> {'truthy' if value else 'falsy'}")   # conditional expression inside f-string

# Output:
# 0              -> falsy
# 0.0            -> falsy
# ''             -> falsy
# '0'            -> truthy      <- a non-empty string is always truthy
# []             -> falsy
# [0]            -> truthy      <- the list has one element
# {}             -> falsy
# None           -> falsy
# Decimal('0')   -> falsy
# -1             -> truthy
# 'False'        -> truthy
# range(0, 0)    -> falsy

# 'or' returns an operand, not True/False -> great for defaults
nickname = ""
full_name = "Ravindra Nath Jha"
display = nickname or full_name
print(display)                         # Ravindra Nath Jha

# The None-vs-zero trap
def find_balance(account_id: str) -> int | None:
    accounts = {"SB-101": 0, "SB-102": 5400}
    return accounts.get(account_id)    # None if the account does not exist

balance = find_balance("SB-101")
if balance:                            # WRONG: 0 is a real balance but it is falsy
    print("has account (wrong check)")
if balance is not None:                # RIGHT
    print(f"Account found, balance ₹{balance}")   # Account found, balance ₹0

# Conditional expression: good and bad usage
marks = 72
result = "PASS" if marks >= 40 else "FAIL"                    # good: two short values
fee = 0 if marks >= 90 else (500 if marks >= 60 else 1500)    # borderline: nested, still readable with parentheses
print(result, fee)                                            # PASS 500`
    },
    {
      heading: "4. match/case: Structural Pattern Matching in Python (3.10+)",
      content: `Python 3.10 introduced the \`match\` statement (PEP 634–636). Developers from Java or C often assume it is a \`switch\`, but it is much more powerful: it **destructures** data and binds variables as it matches, so it can look inside tuples, lists, dictionaries and even class instances. The subject after \`match\` is evaluated once, then each \`case\` pattern is tried from top to bottom, and the first pattern that fits runs its block. There is no fall-through and no \`break\` is needed.
The pattern types you will use most:
• **Literal patterns** — \`case 200:\`, \`case "quit":\`, \`case None:\`. Several alternatives are joined with \`|\`: \`case 401 | 403:\`.
• **Capture patterns** — a bare name such as \`case other:\` matches anything and binds it to \`other\`. This is the source of the most common \`match\` bug: writing \`case RED:\` to compare with a constant actually *captures* the value into a new variable named \`RED\` and matches everything. To compare with a constant, use a **dotted name** (\`case Color.RED:\`) which Python treats as a value, not a capture.
• **Wildcard** — \`case _:\` matches anything without binding; put it last as the default.
• **Sequence patterns** — \`case [x, y]:\` or \`case ("move", dx, dy):\` match lists and tuples of that length; \`case [first, *rest]:\` captures the remainder. Strings and bytes are deliberately *not* treated as sequences here.
• **Mapping patterns** — \`case {"type": "payment", "amount": amt}:\` matches a dict that has *at least* those keys (extra keys are ignored) and binds \`amt\`.
• **Class patterns** — \`case Point(x=0, y=0):\` matches an instance of \`Point\` with those attribute values; dataclasses support positional form too.
• **Guards** — \`case {"amount": amt} if amt > 200_000:\` adds an arbitrary condition after the pattern.
• **AS patterns** — \`case [int() as code, str() as msg]:\` binds a sub-pattern to a name.
When should you use \`match\` instead of \`if\`/\`elif\`? When you are branching on the **shape** of data (a parsed command, an event dict from a webhook, an AST node, a JSON message from a queue) or on one value with many fixed alternatives. For a single boolean condition or two numeric ranges, \`if\` is still clearer. Remember also that \`match\` is a statement, not an expression — it does not return a value.`,
      codeSnippet: `# pattern_matching.py — requires Python 3.10+
from dataclasses import dataclass
from enum import Enum


class Status(Enum):
    ACTIVE = "active"
    BLOCKED = "blocked"


@dataclass
class Point:
    x: int
    y: int


def describe(event):
    match event:
        case {"type": "payment", "amount": amount} if amount > 200_000:
            return f"High-value payment of ₹{amount:,} -> OTP required"
        case {"type": "payment", "amount": amount}:
            return f"Payment of ₹{amount:,} accepted"
        case ("move", dx, dy):                       # sequence pattern on a tuple
            return f"Move by ({dx}, {dy})"
        case [first, *rest]:                         # list with at least one element
            return f"Batch of {1 + len(rest)} items starting with {first!r}"
        case Point(x=0, y=0):                        # class pattern
            return "Origin"
        case Point(x=x, y=y):
            return f"Point at x={x}, y={y}"
        case Status.ACTIVE:                          # dotted name = value pattern, NOT capture
            return "Account is active"
        case "quit" | "exit" | "q":                  # OR pattern
            return "Bye!"
        case str() as text:                          # type check + bind
            return f"Unknown text command: {text!r}"
        case _:
            return "Unrecognised event"


events = [
    {"type": "payment", "amount": 250_000, "currency": "INR"},   # extra key is fine
    {"type": "payment", "amount": 1_999},
    ("move", 3, -1),
    ["invoice-1", "invoice-2", "invoice-3"],
    Point(0, 0),
    Point(4, 7),
    Status.ACTIVE,
    "exit",
    "hello",
    42,
]
for e in events:
    print(describe(e))

# Output:
# High-value payment of ₹250,000 -> OTP required
# Payment of ₹1,999 accepted
# Move by (3, -1)
# Batch of 3 items starting with 'invoice-1'
# Origin
# Point at x=4, y=7
# Account is active
# Bye!
# Unknown text command: 'hello'
# Unrecognised event`
    },
    {
      heading: "5. for Loops and range() in Python",
      content: `A Python \`for\` loop is not a counter loop like C's \`for (i = 0; i < n; i++)\`. It is a **for-each** loop: \`for item in iterable:\` asks the iterable for its elements one by one and assigns each to \`item\`. Anything iterable works — lists, tuples, strings (character by character), dictionaries (keys by default), sets, files (line by line), generators, and the result of functions like \`range()\`, \`enumerate()\`, \`zip()\`, \`sorted()\` and \`reversed()\`.
When you *do* need a sequence of numbers, use \`range()\`. It takes up to three integers: \`range(stop)\` counts from 0 up to but **not including** \`stop\`; \`range(start, stop)\` begins at \`start\`; \`range(start, stop, step)\` moves by \`step\`, which may be negative to count down. \`range(5)\` therefore yields 0, 1, 2, 3, 4 — five numbers, never 5 itself. This half-open convention matches slicing (\`items[0:5]\`) and makes \`range(len(items))\` always produce valid indices.
Three facts about \`range\` that beginners miss:
• It is **lazy**. \`range(10_000_000)\` does not allocate ten million integers; it stores just start, stop and step and produces values on demand. Wrap it in \`list()\` only if you really need a list.
• It is a full sequence type: \`len(range(0, 100, 7))\` works, \`5 in range(10)\` is an O(1) check, and \`range(10)[-1]\` returns 9.
• It only accepts integers. For floating-point steps (0.0, 0.1, 0.2 ...) use a loop with integer counts and divide, or \`numpy.arange\`/\`numpy.linspace\`.
The most important style rule: **loop over the collection directly**. \`for i in range(len(names)): print(names[i])\` is the number-one sign of a developer who has not yet learned Python. Write \`for name in names:\`. If you also need the index, use \`enumerate()\` (Section 8). When iterating a dictionary, use \`.items()\` to get key–value pairs, \`.values()\` for values only. Tuple unpacking in the loop header (\`for name, marks in students:\`) keeps loops flat and readable.
Finally, the loop variable survives after the loop ends — after \`for i in range(3): pass\`, \`i\` is \`2\`. Comprehensions (Section 9) do not leak their variable this way.`,
      codeSnippet: `# for_loops.py
# 1. Loop directly over a collection (preferred)
cities = ["Mumbai", "Jaipur", "Kochi"]
for city in cities:
    print(city.upper(), end=" ")       # MUMBAI JAIPUR KOCHI
print()

# 2. range() forms
print(list(range(5)))                  # [0, 1, 2, 3, 4]
print(list(range(2, 11, 3)))           # [2, 5, 8]
print(list(range(10, 0, -2)))          # [10, 8, 6, 4, 2]
print(len(range(0, 100, 7)), 98 in range(0, 100, 7))   # 15 True
print(range(10)[-1])                   # 9 -- range supports indexing

# 3. Iterating a dict: keys by default, .items() for pairs
fees = {"Physics": 1800, "Chemistry": 1700, "Maths": 2000}
for subject in fees:                   # same as fees.keys()
    print(subject, end=", ")           # Physics, Chemistry, Maths,
print()
for subject, amount in fees.items():
    print(f"{subject:<10} ₹{amount}")

# 4. Nested loops: a 3 x 3 multiplication grid
for row in range(1, 4):
    print(" ".join(f"{row * col:>2}" for col in range(1, 4)))
#  1  2  3
#  2  4  6
#  3  6  9

# 5. sum of an arithmetic series using range, no list built in memory
print(sum(range(1, 1_000_001)))        # 500000500000

# 6. The loop variable persists after the loop
for i in range(3):
    pass
print("i after loop:", i)              # i after loop: 2`
    },
    {
      heading: "6. while Loops in Python",
      content: `A \`while\` loop repeats **as long as its condition is true**, checking the condition *before* every iteration. Use it when you do not know in advance how many times to loop: reading user input until it is valid, polling an API until a job finishes, retrying a network call with back-off, running a game loop, or consuming a queue until it is empty. If you know the count or you are walking through a collection, a \`for\` loop is almost always the better tool.
The anatomy of a correct \`while\` loop has three parts: **initialise** a state variable before the loop, **test** it in the condition, and **update** it inside the body. Forget the update and you have an infinite loop — the most common \`while\` bug, and one that can freeze a server. Press Ctrl+C in the terminal to stop a runaway script (Python raises \`KeyboardInterrupt\`).
A deliberate infinite loop, \`while True:\`, is a legitimate and common pattern when the exit condition lives in the middle of the body rather than at the top; you leave it with \`break\` (Section 7) or \`return\`. Python has no \`do ... while\` statement; \`while True:\` with a \`break\` at the end of the body is the idiomatic substitute when the body must run at least once.
Good defensive habits for production \`while\` loops:
• Put a **maximum attempt count** or timeout in the condition for anything that waits on an external system: \`while not done and attempts < 5:\`.
• Use \`time.sleep()\` between polls so you do not hammer the API (and prefer exponential back-off: 1 s, 2 s, 4 s ...).
• Make the condition a clear boolean expression; if it needs three lines of logic, compute a named variable first.
The \`while\` statement also accepts an \`else\` clause, covered in the next section along with \`break\` and \`continue\`.`,
      codeSnippet: `# while_loops.py
import random
import time

# 1. Input validation (classic use) -- simulated inputs so the script runs unattended
inputs = iter(["abc", "-5", "42"])
while True:
    raw = next(inputs)                      # in a real program: raw = input("Enter age: ")
    if raw.isdigit() and 0 < int(raw) < 120:
        age = int(raw)
        break
    print(f"Invalid age {raw!r}, try again")
print("Age accepted:", age)                 # Age accepted: 42

# 2. Countdown with explicit init / test / update
n = 5
while n > 0:
    print(n, end=" ")                       # 5 4 3 2 1
    n -= 1                                  # forget this line -> infinite loop
print("Launch!")

# 3. Retry with exponential back-off and a hard cap
random.seed(7)
attempts, delay, done = 0, 0.01, False      # tiny delay so the demo is fast
while not done and attempts < 5:
    attempts += 1
    done = random.random() < 0.4            # pretend 40% of calls succeed
    print(f"attempt {attempts}: {'success' if done else 'failed, retrying in ' + str(delay) + 's'}")
    if not done:
        time.sleep(delay)
        delay *= 2
print("Gave up" if not done else f"Succeeded after {attempts} attempt(s)")

# 4. Draining a queue until empty
jobs = ["resize-img-1", "send-mail-7", "gen-report-3"]
while jobs:                                 # truthiness: empty list ends the loop
    job = jobs.pop(0)
    print("processing", job)`
    },
    {
      heading: "7. break, continue and the else Clause on Loops",
      content: `Both \`for\` and \`while\` loops accept three control keywords that change the normal flow.
**\`break\`** exits the innermost loop immediately; execution continues after the loop. Use it when you have found what you were looking for (searching a list for the first match), when a sentinel value arrives ("STOP" in a data stream), or to leave a \`while True:\` loop. Note that \`break\` only leaves **one** level of nesting. To exit nested loops, either put the loops in a function and \`return\`, raise an exception, use a flag variable, or restructure so the inner iteration is a single comprehension or \`any()\`/\`all()\` call.
**\`continue\`** skips the rest of the current iteration and jumps to the next one. It is ideal for filtering out items early ("if the row is a comment line, \`continue\`") so that the main body stays unindented — another form of the guard-clause style from Section 2. Over-using \`continue\` in long bodies hurts readability, so keep the skipped-case checks at the top of the loop.
**\`else\` on a loop** is a Python-specific feature that puzzles even experienced developers. The \`else\` block runs when the loop **finishes normally — that is, without hitting \`break\`**. For a \`for\` loop that means the iterable was exhausted; for a \`while\` loop that means the condition became false. If \`break\` fires, \`else\` is skipped. A helpful way to read it is "\`else\` = no break". The classic use case is a search: loop over candidates, \`break\` when you find one, and let \`else\` handle the "not found" case — without a separate \`found = False\` flag. Note that \`else\` *does* run when the loop body never executed at all (empty iterable), because no \`break\` happened.
Interviewers like this one: "What does \`for ... else\` do?" Most candidates guess that \`else\` runs when the loop did not execute. That is wrong, and the code below demonstrates the actual behaviour.`,
      codeSnippet: `# break_continue_else.py
# 1. break: stop at the first match
pincodes = ["110001", "400001", "560001", "700001"]
for pin in pincodes:
    if pin.startswith("56"):
        print("Found Bengaluru pincode:", pin)   # Found Bengaluru pincode: 560001
        break

# 2. continue: skip comment lines and blanks while parsing a config file
lines = ["# settings", "", "host=db.local", "port=5432", "  # trailing comment", "debug=false"]
for line in lines:
    line = line.strip()
    if not line or line.startswith("#"):
        continue                                # skip, go to next line
    key, value = line.split("=", 1)
    print(f"{key} -> {value}")
# host -> db.local
# port -> 5432
# debug -> false

# 3. for ... else: else runs only if the loop was NOT broken
def is_prime(n: int) -> bool:
    if n < 2:
        return False
    for divisor in range(2, int(n ** 0.5) + 1):
        if n % divisor == 0:
            break                               # found a factor -> not prime, else is skipped
    else:
        return True                             # loop exhausted without break -> prime
    return False

print([n for n in range(2, 30) if is_prime(n)])  # [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]

# 4. else also runs for an empty iterable (no break happened)
for item in []:
    print("never printed")
else:
    print("empty loop finished normally -> else ran")

# 5. Breaking out of nested loops: wrap in a function and return
def first_pair_with_sum(matrix, target):
    for r, row in enumerate(matrix):
        for c, value in enumerate(row):
            if value + row[0] == target:
                return (r, c)                   # leaves BOTH loops at once
    return None

print(first_pair_with_sum([[1, 5, 9], [2, 4, 6]], 10))   # (0, 2)`
    },
    {
      heading: "8. enumerate() and zip(): Looping Like a Professional",
      content: `Two built-in functions remove almost every reason to write index-based loops in Python.
**\`enumerate(iterable, start=0)\`** yields pairs of \`(index, item)\`. Use it whenever you need the position as well as the value — numbering output lines, locating the index of a match, or updating a list in place by index. The \`start\` argument lets you count from 1 for human-facing output ("1. Priya, 2. Rahul") without doing \`i + 1\` everywhere. Combined with tuple unpacking in the loop header, \`for rank, (name, score) in enumerate(leaderboard, start=1):\` reads naturally and avoids off-by-one mistakes.
**\`zip(*iterables)\`** walks through several iterables **in parallel**, yielding a tuple with one element from each. It is the clean way to iterate two related lists (names and marks, questions and answers, columns and values), to build a dictionary from two lists (\`dict(zip(keys, values))\`), and to transpose a matrix (\`list(zip(*rows))\`). By default \`zip\` stops silently at the **shortest** input — a notorious source of silent data loss when two lists are supposed to be the same length. Since **Python 3.10** you can pass \`strict=True\` to make \`zip\` raise a \`ValueError\` if the lengths differ; use it whenever the inputs are supposed to line up. When you intentionally want the longest length with fill values, \`itertools.zip_longest(a, b, fillvalue=None)\` does that.
Both functions return **lazy iterators**, not lists. They consume no extra memory even for huge inputs, but they can be iterated only once — if you need to loop twice, call them again or materialise with \`list()\`. You will also see \`enumerate\` and \`zip\` combined: \`for i, (a, b) in enumerate(zip(xs, ys)):\`.
Other iteration helpers worth knowing at this stage: \`reversed(seq)\` to iterate backwards without copying, \`sorted(iterable, key=..., reverse=...)\` to loop in a chosen order, and \`dict.items()\` for key–value pairs. Together with \`enumerate\` and \`zip\`, these are the "vocabulary" that makes Python loops short and self-explanatory.`,
      codeSnippet: `# enumerate_zip.py
students = ["Aarav", "Diya", "Kabir", "Meera"]
maths = [88, 95, 67, 79]
science = [91, 85, 72, 88]

# 1. enumerate with start=1 for human-friendly numbering
for rank, name in enumerate(students, start=1):
    print(f"{rank}. {name}")

# 2. zip: iterate parallel lists together
for name, m, s in zip(students, maths, science):
    print(f"{name:<6} maths={m:>3} science={s:>3} avg={(m + s) / 2:.1f}")

# 3. Build a dict from two lists
marks_by_student = dict(zip(students, maths))
print(marks_by_student)          # {'Aarav': 88, 'Diya': 95, 'Kabir': 67, 'Meera': 79}

# 4. Transpose a matrix with zip(*rows)
rows = [[1, 2, 3], [4, 5, 6]]
print(list(zip(*rows)))          # [(1, 4), (2, 5), (3, 6)]

# 5. zip stops at the shortest input -- silently!
print(list(zip([1, 2, 3], ["a", "b"])))        # [(1, 'a'), (2, 'b')]  -> 3 was dropped

# 6. strict=True (Python 3.10+) turns that into an error
try:
    list(zip([1, 2, 3], ["a", "b"], strict=True))
except ValueError as err:
    print("ValueError:", err)    # ValueError: zip() argument 2 is shorter than argument 1

# 7. enumerate + zip together, and updating a list in place by index
prices = [100, 250, 80]
for i, (old, pct) in enumerate(zip(prices, [10, 0, 25])):
    prices[i] = old * (100 - pct) // 100
print(prices)                    # [90, 250, 60]

# 8. Iterating backwards and in sorted order
for name in reversed(students):
    print(name, end=" ")         # Meera Kabir Diya Aarav
print()
for name, score in sorted(zip(students, maths), key=lambda pair: pair[1], reverse=True):
    print(f"{name}:{score}", end=" ")   # Diya:95 Aarav:88 Meera:79 Kabir:67
print()`
    },
    {
      heading: "9. List Comprehensions in Python: Building Lists in One Expression",
      content: `A **list comprehension** builds a new list from an iterable in a single expression. The general form is \`[expression for item in iterable if condition]\`, and it is exactly equivalent to creating an empty list, looping, optionally filtering with \`if\`, and appending the expression — but shorter, usually faster (CPython avoids the repeated \`.append()\` method lookup), and widely considered the most Pythonic way to transform or filter data.
Read a comprehension left to right as an English sentence: "give me \`name.title()\` **for** each \`name\` **in** \`names\` **if** \`name\` is not blank". The three parts are:
• The **output expression** — any expression using the loop variable: a method call, arithmetic, a tuple, an f-string, a conditional expression such as \`x if x > 0 else 0\`.
• The **for clause** — one or more loop variables; tuple unpacking works here too (\`for name, marks in students\`).
• An optional **filter** — \`if condition\` at the end; only items that pass are included. Note the difference between the filter \`if\` (at the end, no \`else\` allowed) and a conditional *expression* in the output position (which must have an \`else\`).
Since Python 3, comprehensions have their **own scope**: the loop variable does not leak into the surrounding function, unlike a plain \`for\` loop. That is a point of difference from Python 2 that interviewers still ask about.
When to use a comprehension: when the body of the loop is a single expression that produces one value per item, and you want the resulting list. When not to: when the loop has side effects (printing, writing to a file, calling an API), when you need \`break\`, when the logic needs multiple statements, or when you only want to iterate once and never need the whole list in memory — in that last case use a **generator expression** (Section 10). A comprehension written purely for side effects, such as \`[print(x) for x in xs]\`, is a well-known anti-pattern: it builds a useless list of \`None\` values. Use a plain loop instead.
Performance note: comprehensions are not magic; they are still O(n). Their benefit is clarity and a modest constant-factor speed-up, not an algorithmic one.`,
      codeSnippet: `# list_comprehensions.py
raw_names = ["  priya ", "RAHUL", "", "anjali", "   "]

# Loop version
cleaned_loop = []
for n in raw_names:
    n = n.strip()
    if n:
        cleaned_loop.append(n.title())

# Comprehension version -- same result, one expression
cleaned = [n.strip().title() for n in raw_names if n.strip()]
print(cleaned, cleaned == cleaned_loop)      # ['Priya', 'Rahul', 'Anjali'] True

# Transform only
squares = [x * x for x in range(1, 8)]
print(squares)                               # [1, 4, 9, 16, 25, 36, 49]

# Filter only
evens = [x for x in range(20) if x % 2 == 0]
print(evens)                                 # [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]

# Conditional EXPRESSION in the output position (needs else)
temps_c = [31.5, 42.0, 28.0, 38.5]
labels = [f"{t}°C {'HOT' if t >= 38 else 'ok'}" for t in temps_c]
print(labels)                                # ['31.5°C ok', '42.0°C HOT', '28.0°C ok', '38.5°C HOT']

# Tuple unpacking + filter: courses whose GST-inclusive fee is over ₹2,500
courses = [("Python", 1800), ("Django", 2500), ("Data Science", 4200)]
expensive = [name for name, fee in courses if fee * 1.18 > 2500]
print(expensive)                             # ['Django', 'Data Science']

# Comprehension variable does not leak (Python 3)
x = "outer"
_ = [x for x in range(3)]
print(x)                                     # outer

# Anti-pattern: comprehension for side effects
# [print(n) for n in cleaned]                # builds [None, None, None] -- don't
for n in cleaned:                            # do this instead
    print(n, end=" ")
print()`
    },
    {
      heading: "10. Dict and Set Comprehensions and Generator Expressions",
      content: `The comprehension syntax is not limited to lists. Python offers three more forms, each producing a different kind of object:
**Dict comprehensions**: \`{key_expr: value_expr for item in iterable if condition}\`. They are the natural way to build a lookup table — mapping a student ID to a record, inverting an existing dictionary (\`{v: k for k, v in d.items()}\`), filtering a dictionary (\`{k: v for k, v in prices.items() if v < 500}\`), or transforming values (\`{k: v * 1.18 for k, v in prices.items()}\`). If two items produce the same key, the **last one wins** silently, because dictionary keys are unique; be deliberate about that when inverting a dict with duplicate values.
**Set comprehensions**: \`{expr for item in iterable if condition}\` — the same braces as a dict comprehension but without the colon. They produce a set, so duplicates are removed automatically and order is not guaranteed. Use them for "the unique X in this data": unique cities in a list of orders, unique file extensions in a directory, unique words in a text. Remember that \`{}\` on its own is an empty **dict**, not an empty set; use \`set()\` for that.
**Generator expressions**: \`(expr for item in iterable if condition)\` — parentheses instead of brackets. A generator expression does **not** build a collection; it produces values lazily, one at a time, as something consumes them. That makes it the right choice when you are going to feed the result straight into \`sum()\`, \`max()\`, \`min()\`, \`any()\`, \`all()\`, \`sorted()\`, \`", ".join()\` or a \`for\` loop and never need the intermediate list. \`sum(x * x for x in range(10**7))\` runs in constant memory; the list-comprehension version would allocate a list of ten million integers first. When a generator expression is the only argument to a function call, you can drop the extra parentheses, as in \`sum(x for x in xs)\`. A generator can be consumed only once — after that it is empty.
A quick decision guide: need a list to index or reuse? List comprehension. Need key → value lookup? Dict comprehension. Need uniqueness or membership tests? Set comprehension. Only passing the values through once to another function? Generator expression. There is no tuple comprehension; \`tuple(x for x in xs)\` is the way to get a tuple.`,
      codeSnippet: `# dict_set_generator.py
orders = [
    {"id": 101, "city": "Mumbai",    "amount": 1250},
    {"id": 102, "city": "Delhi",     "amount": 4999},
    {"id": 103, "city": "Mumbai",    "amount": 180},
    {"id": 104, "city": "Bengaluru", "amount": 2200},
    {"id": 105, "city": "Delhi",     "amount": 760},
]

# Dict comprehension: id -> amount lookup table
amount_by_id = {o["id"]: o["amount"] for o in orders}
print(amount_by_id)                 # {101: 1250, 102: 4999, 103: 180, 104: 2200, 105: 760}

# Dict comprehension with filter and transformed value (18% GST)
big_with_gst = {o["id"]: round(o["amount"] * 1.18) for o in orders if o["amount"] >= 1000}
print(big_with_gst)                 # {101: 1475, 102: 5899, 104: 2596}

# Inverting a dict -- last duplicate wins
grade_of = {"Aarav": "A", "Diya": "A", "Kabir": "B"}
student_with = {g: s for s, g in grade_of.items()}
print(student_with)                 # {'A': 'Diya', 'B': 'Kabir'}

# Set comprehension: unique cities
cities = {o["city"] for o in orders}
print(sorted(cities))               # ['Bengaluru', 'Delhi', 'Mumbai']
print(type({}), type(set()))        # <class 'dict'> <class 'set'>

# Generator expressions: no intermediate list in memory
total = sum(o["amount"] for o in orders)
largest = max(o["amount"] for o in orders if o["city"] == "Delhi")
all_positive = all(o["amount"] > 0 for o in orders)
print(total, largest, all_positive) # 9389 4999 True

import sys
list_version = [x * x for x in range(1_000_000)]
gen_version = (x * x for x in range(1_000_000))
print(sys.getsizeof(list_version) > 8_000_000, sys.getsizeof(gen_version) < 300)   # True True

# A generator is single-use
g = (x for x in range(3))
print(list(g), list(g))             # [0, 1, 2] []`
    },
    {
      heading: "11. Nested Comprehensions and Readability: When to Stop",
      content: `Comprehensions may contain more than one \`for\` clause. Two patterns look similar but behave very differently, and confusing them is a classic interview trap.
**Multiple \`for\` clauses in one comprehension** produce a **flat** list. \`[(x, y) for x in range(3) for y in "ab"]\` yields six tuples — the clauses nest left to right exactly as if you had written the loops one inside the other, with the leftmost loop outermost. This is how you flatten a list of lists: \`[cell for row in matrix for cell in row]\` ("for each row, for each cell in that row"). A later \`for\` clause can refer to the variable of an earlier one, which is why the order matters: \`[cell for cell in row for row in matrix]\` raises \`NameError\` because \`row\` is not yet defined when the first clause runs.
**A comprehension inside the output expression** produces a **nested** list: \`[[row * col for col in range(1, 4)] for row in range(1, 4)]\` builds a list of three inner lists — a 2-D grid. This is the correct way to create a matrix of independent rows. The tempting shortcut \`[[0] * 3] * 3\` creates three references to the *same* inner list, so changing one cell changes every row; a nested comprehension avoids that bug.
Now the judgement call. Python's own style guide (PEP 8) and every senior reviewer agree: **a comprehension that needs more than about two clauses, or that no longer fits comfortably on one or two lines, should become a loop.** A triple-nested comprehension with two filters and a conditional expression is technically valid and technically shorter, but the next developer (often you, three months later) will have to mentally unroll it. Practical rules of thumb used in code review:
• At most two \`for\` clauses, at most one \`if\`, and one simple output expression. Beyond that, write a function or a plain loop.
• If you need to name an intermediate value to explain it, you need a loop (or the walrus operator for the simplest cases — see Section 12).
• Break long comprehensions across lines, one clause per line, inside the brackets; Python allows this freely.
• Prefer built-ins that say what you mean over clever comprehensions: \`sum(...)\`, \`any(...)\`, \`all(...)\`, \`sorted(...)\`, \`itertools.chain.from_iterable(...)\` for flattening.
Readability is a feature. A comprehension exists to make intent obvious; the moment it hides intent, it has failed at its only job.`,
      codeSnippet: `# nested_comprehensions.py
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

# 1. Flattening: two for-clauses -> FLAT list (outer loop first)
flat = [cell for row in matrix for cell in row]
print(flat)                                   # [1, 2, 3, 4, 5, 6, 7, 8, 9]

# Equivalent loop, to see the order of the clauses
flat_loop = []
for row in matrix:
    for cell in row:
        flat_loop.append(cell)
print(flat == flat_loop)                      # True

# 2. Comprehension inside the expression -> NESTED list (a new grid)
transposed = [[row[i] for row in matrix] for i in range(3)]
print(transposed)                             # [[1, 4, 7], [2, 5, 8], [3, 6, 9]]

# 3. The shared-row bug and its fix
bad_grid = [[0] * 3] * 3
bad_grid[0][0] = 9
print(bad_grid)                               # [[9, 0, 0], [9, 0, 0], [9, 0, 0]]  <- all rows changed!
good_grid = [[0] * 3 for _ in range(3)]
good_grid[0][0] = 9
print(good_grid)                              # [[9, 0, 0], [0, 0, 0], [0, 0, 0]]

# 4. Cartesian product with a filter, formatted across lines for readability
pairs = [
    (x, y)
    for x in range(1, 4)
    for y in range(1, 4)
    if x < y
]
print(pairs)                                  # [(1, 2), (1, 3), (2, 3)]

# 5. Too clever -- valid but hard to read:
hard = [w.upper() for s in ["ram is here", "sita went home"] for w in s.split() if len(w) > 2 if w[0] in "sh"]
print(hard)                                   # ['HERE', 'SITA', 'HOME']

# Same logic as a function: easier to test, name and extend
def interesting_words(sentences):
    result = []
    for sentence in sentences:
        for word in sentence.split():
            if len(word) > 2 and word[0] in "sh":
                result.append(word.upper())
    return result

print(interesting_words(["ram is here", "sita went home"]) == hard)   # True`
    },
    {
      heading: "12. The Walrus Operator := in Python (3.8+)",
      content: `Python 3.8 introduced **assignment expressions**, written with \`:=\` and nicknamed the **walrus operator** because the symbol looks like a walrus's eyes and tusks (PEP 572). A normal assignment (\`x = 5\`) is a *statement* — it cannot appear inside a condition or a comprehension. The walrus operator assigns **and** returns the value, so it can be used wherever an expression is allowed: inside an \`if\` or \`while\` condition, inside a comprehension, or inside a function call.
The operator exists to remove a specific kind of duplication. Before 3.8, "compute something, test it, and then use it" needed either two statements (assign, then \`if\`) or computing the same thing twice. Typical wins:
• **Read-and-test loops**: \`while (chunk := file.read(4096)):\` replaces the awkward \`while True: chunk = ...; if not chunk: break\` dance.
• **Regex matching**: \`if (m := pattern.search(line)): print(m.group(1))\` — bind the match object and test it in one step.
• **Comprehensions that reuse an expensive result**: \`[y for x in data if (y := transform(x)) is not None]\` calls \`transform\` once per item instead of twice. Note the variable \`y\` is bound in the *enclosing* scope (unlike the loop variable), and you cannot use the walrus to assign to the comprehension's own iteration variable.
• **Guarding on a length or a lookup**: \`if (n := len(items)) > 10: print(f"too many: {n}")\`.
Rules and restrictions that keep it from being abused:
• At the top level of an expression statement you **must** use parentheses: \`(y := 5)\` is allowed, bare \`y := 5\` is a \`SyntaxError\`. The same applies to keyword arguments and the right side of a normal assignment.
• It cannot assign to attributes or subscripts — only to a plain name.
• It is **not** a replacement for \`=\`. If the value is not reused inside the same expression, a normal assignment on its own line is clearer.
Use the walrus when it removes a repeated call or a clumsy extra statement, and only when the result reads naturally. Overuse makes code look clever rather than clear, and many teams limit it to the \`while\`-read and regex-match patterns.`,
      codeSnippet: `# walrus.py — requires Python 3.8+
import re

# 1. Read-and-test loop: consume a stream in chunks
stream = iter(["chunk-1", "chunk-2", "chunk-3", ""])      # "" acts like end-of-file
while (chunk := next(stream)):
    print("got", chunk)
# got chunk-1 / got chunk-2 / got chunk-3

# 2. Regex: bind the match object and test it in one line
log_lines = [
    "2026-10-09 10:15:02 ERROR payment-service: timeout after 30s",
    "2026-10-09 10:15:05 INFO  payment-service: retry ok",
]
pattern = re.compile(r"(ERROR|WARN)\\s+(\\S+): (.*)")
for line in log_lines:
    if (m := pattern.search(line)):
        level, service, message = m.groups()
        print(f"[{level}] {service} -> {message}")
# [ERROR] payment-service -> timeout after 30s

# 3. Comprehension: call the expensive function once, not twice
def parse_amount(text: str) -> int | None:
    text = text.replace("₹", "").replace(",", "").strip()
    return int(text) if text.isdigit() else None

raw = ["₹1,250", "free", "₹4,999", "N/A", "180"]
amounts = [amt for s in raw if (amt := parse_amount(s)) is not None]
print(amounts)                                            # [1250, 4999, 180]
print("amt still visible after comprehension:", amt)      # 180 (bound in enclosing scope)

# 4. Guard on a computed value and reuse it
items = list(range(14))
if (n := len(items)) > 10:
    print(f"Too many items ({n}); showing the first 10:", items[:10])

# 5. Syntax rules
(y := 42)                      # fine with parentheses
print(y)                       # 42
# y := 42                      # SyntaxError at statement level without parentheses
# obj.attr := 1                # SyntaxError: cannot assign to attribute with walrus`
    },
    {
      heading: "13. Real-World Use Cases: How Python Control Flow Is Used in Production",
      content: `The constructs from this lecture appear in every corner of professional Python. Recognising the pattern behind each one helps you choose the right tool quickly.
**Request routing and validation in web backends.** A FastAPI or Django handler begins with guard clauses: \`if not user.is_active: raise HTTPException(403)\`; \`if amount <= 0: return error\`. Webhook handlers from payment gateways (Razorpay, Stripe) receive JSON events of varying shape, and a \`match\` statement on \`{"event": "payment.captured", "payload": {...}}\` is the cleanest dispatcher — the mapping pattern pulls out exactly the keys needed and the guard enforces business rules.
**Data cleaning in pandas and ETL scripts.** Before data reaches a DataFrame, a Python loop with \`continue\` skips malformed rows, a dict comprehension renames columns (\`{col: col.strip().lower() for col in header}\`), a set comprehension finds unique categories, and \`zip(header, row, strict=True)\` turns CSV rows into records while catching ragged lines. Generator expressions stream gigabytes of log lines through \`sum()\` or \`max()\` without loading them into memory.
**Automation and DevOps scripts.** A deployment script polls a health endpoint with \`while not healthy and attempts < 10:\` plus exponential back-off; a backup job uses \`for path in Path("/data").rglob("*.csv"):\` with \`enumerate\` to report progress ("Processing file 37 of 212"); and \`for ... else\` decides whether any server in the fleet failed the check.
**Retry loops around network calls.** Every production HTTP client wraps \`httpx.get()\` in a bounded \`while\`/\`for\` loop with \`break\` on success and \`else\` to raise after the final attempt — exactly the pattern from Section 7.
**Reporting and dashboards.** Comprehensions aggregate: \`{city: sum(o.amount for o in orders if o.city == city) for city in cities}\` builds a per-city revenue summary in one readable line; \`sorted(..., key=...)\` plus \`enumerate(start=1)\` produces a ranked leaderboard.
**Command-line tools and bots.** A Telegram or Slack bot parses a command string into a tuple and dispatches with \`match ("remind", when, *text):\`, which is far more robust than a chain of \`startswith\` checks.
**Interview coding rounds.** Most "easy" and "medium" problems — two-sum, prime sieve, matrix transpose, grouping anagrams, parsing brackets — are solved with precisely these tools: \`for\` with \`enumerate\`, a \`while\` with two pointers, a dict comprehension, and early \`break\`. Fluency here is what lets you spend interview time on the algorithm instead of the syntax.`,
      codeSnippet: `# production_patterns.py — a webhook dispatcher + a bounded retry, as used in real services
import random
import time


def handle_webhook(event: dict) -> str:
    """Dispatch a payment-gateway event by its shape (mapping patterns + guards)."""
    match event:
        case {"event": "payment.captured", "payload": {"amount": amt, "order_id": oid}} if amt >= 100:
            return f"Mark order {oid} as PAID (₹{amt / 100:,.2f})"
        case {"event": "payment.captured", "payload": {"order_id": oid}}:
            return f"Suspicious tiny payment on {oid}, flag for review"
        case {"event": "payment.failed", "payload": {"order_id": oid, "error": {"reason": why}}}:
            return f"Order {oid} failed: {why}"
        case {"event": str(name)}:
            return f"Ignoring unhandled event type {name!r}"
        case _:
            return "Malformed event"


events = [
    {"event": "payment.captured", "payload": {"amount": 125_000, "order_id": "ORD-9", "method": "upi"}},
    {"event": "payment.captured", "payload": {"amount": 1, "order_id": "ORD-10"}},
    {"event": "payment.failed", "payload": {"order_id": "ORD-11", "error": {"reason": "insufficient funds"}}},
    {"event": "refund.created"},
    {"foo": "bar"},
]
for e in events:
    print(handle_webhook(e))


def fetch_with_retry(url: str, attempts: int = 4) -> str:
    """Bounded retry with back-off; for...else raises only if every attempt failed."""
    delay = 0.01
    for attempt in range(1, attempts + 1):
        ok = random.random() < 0.5                    # stand-in for httpx.get(url).is_success
        print(f"  attempt {attempt} on {url}: {'ok' if ok else 'failed'}")
        if ok:
            break
        time.sleep(delay)
        delay *= 2
    else:
        raise RuntimeError(f"{url} failed after {attempts} attempts")
    return "200 OK"


random.seed(3)
print(fetch_with_retry("https://api.example.com/health"))

# Per-city revenue summary with nested generator inside a dict comprehension
orders = [("Mumbai", 1250), ("Delhi", 4999), ("Mumbai", 180), ("Delhi", 760), ("Pune", 2200)]
revenue = {city: sum(a for c, a in orders if c == city) for city in {c for c, _ in orders}}
for rank, (city, total) in enumerate(sorted(revenue.items(), key=lambda kv: kv[1], reverse=True), 1):
    print(f"{rank}. {city:<7} ₹{total:>6,}")
# 1. Delhi   ₹ 5,759
# 2. Pune    ₹ 2,200
# 3. Mumbai  ₹ 1,430`
    },
    {
      heading: "14. Common Mistakes with Python Control Flow and How to Fix Them",
      content: `These are the errors that show up again and again in code reviews, student submissions and Stack Overflow questions. Each one has a simple fix.
**1. Using \`=\` instead of \`==\` in a condition.** \`if x = 5:\` is a \`SyntaxError\` in Python (a deliberate safety feature), but the confusion leads people to write \`if (x := 5):\` after learning the walrus, which *always* succeeds. Fix: use \`==\` for comparison; reserve \`:=\` for cases where you genuinely need the assigned value.
**2. Wrong \`elif\` order.** Checking \`marks >= 40\` before \`marks >= 90\` means nobody ever gets a distinction. Fix: order branches from most specific to most general, and write a test with a boundary value for each branch.
**3. Testing \`if value:\` when \`0\` or \`""\` is a valid value.** A balance of ₹0 or an empty search string is silently treated as "missing". Fix: \`if value is not None:\` when the sentinel is \`None\`.
**4. Modifying a list while iterating over it.** \`for x in items: if cond(x): items.remove(x)\` skips elements because the indices shift under the loop. Fix: build a new list with a comprehension (\`items = [x for x in items if not cond(x)]\`) or iterate over a copy (\`for x in items[:]\`). The same applies to adding or deleting dictionary keys during iteration, which raises \`RuntimeError: dictionary changed size during iteration\`.
**5. \`range(len(items))\` and manual counters.** Not a crash, but a readability failure. Fix: \`for item in items:\`, \`enumerate()\` when you need the index, \`zip()\` for parallel lists.
**6. Infinite \`while\` loops.** Forgetting to update the loop variable, or updating it in a branch that is skipped by \`continue\`. Fix: keep init/test/update visible, and add a maximum-iteration guard for loops that depend on external state.
**7. Misreading \`for ... else\`.** Assuming \`else\` runs when the loop body never executed. Fix: remember "\`else\` means no \`break\`"; if you want "ran zero times", test the collection before the loop.
**8. Capture pattern instead of value pattern in \`match\`.** \`case RED:\` captures anything into a new \`RED\` variable. If it is the last case it silently matches everything; if another case follows it, Python refuses to compile with "SyntaxError: name capture 'RED' makes remaining patterns unreachable". Fix: use a dotted name such as \`case Color.RED:\` or a literal.
**9. Confusing a filter \`if\` with a conditional expression in comprehensions.** \`[x if x > 0 for x in xs]\` is a \`SyntaxError\` because an output-position conditional needs \`else\`. Fix: either \`[x for x in xs if x > 0]\` (filter) or \`[x if x > 0 else 0 for x in xs]\` (transform).
**10. \`zip()\` silently truncating.** Two lists that should match but do not lose data without any error. Fix: \`zip(a, b, strict=True)\` on Python 3.10+.
**11. \`[[0] * n] * m\` for a grid.** All rows are the same object. Fix: \`[[0] * n for _ in range(m)]\`.
**12. Comprehensions for side effects.** \`[print(x) for x in xs]\` builds a list of \`None\`. Fix: a plain \`for\` loop.
**13. Mixing tabs and spaces / inconsistent indentation.** Python 3 raises \`TabError\` when tabs and spaces are mixed inconsistently in the same block. Fix: configure your editor to insert 4 spaces per Tab press (VS Code does this by default for Python) and never paste indented code from a browser without checking.`,
      codeSnippet: `# control_flow_mistakes.py — each bug followed by its fix

# Mistake 4: removing from a list while iterating over it
amounts = [100, 0, 250, 0, 0, 80]
for a in amounts:
    if a == 0:
        amounts.remove(a)          # shifts indices -> one zero is skipped
print(amounts)                     # [100, 250, 0, 80]   <- a 0 survived!

amounts = [100, 0, 250, 0, 0, 80]
amounts = [a for a in amounts if a != 0]        # fix: build a new list
print(amounts)                     # [100, 250, 80]

# Mistake 7: for...else misread
batch = []
for item in batch:
    print("processing", item)
else:
    print("else ran even though the body never executed")   # it does run

if not batch:
    print("fix: test emptiness explicitly before the loop")

# Mistake 9: filter if vs conditional expression
xs = [3, -1, 4, -5]
# positives = [x if x > 0 for x in xs]          # SyntaxError
positives = [x for x in xs if x > 0]            # filter: [3, 4]
clamped = [x if x > 0 else 0 for x in xs]       # transform: [3, 0, 4, 0]
print(positives, clamped)

# Mistake 10: zip truncation
names = ["Aarav", "Diya", "Kabir"]
scores = [88, 95]
print(dict(zip(names, scores)))                 # {'Aarav': 88, 'Diya': 95} -- Kabir silently lost
try:
    dict(zip(names, scores, strict=True))       # fix (3.10+)
except ValueError as e:
    print("caught:", e)

# Mistake 8: capture pattern where a constant was intended
RED = "red"
def colour_name(c):
    match c:
        case RED:                                # captures ANY value into a new local 'RED'
            return "it is red"
        # adding 'case _:' after this would be a SyntaxError: the capture makes it unreachable
    return "something else"
print(colour_name("blue"))                       # it is red  <- wrong

from enum import Enum
class Colour(Enum):
    RED = "red"
def colour_name_fixed(c):
    match c:
        case Colour.RED:                         # dotted name = value pattern
            return "it is red"
        case _:
            return "something else"
print(colour_name_fixed("blue"), colour_name_fixed(Colour.RED))   # something else it is red`
    },
    {
      heading: "15. Frequently Asked Questions about Python Conditionals, Loops and Comprehensions",
      content: `**What is the difference between if-elif-else and multiple if statements in Python?**
In an \`if\`/\`elif\`/\`else\` chain, Python stops at the first condition that is true, so exactly one branch runs. With separate \`if\` statements, every condition is tested independently and any number of them can run. Use \`elif\` for mutually exclusive choices (grade bands) and separate \`if\`s for independent checks (several discounts that can all apply).
**Does Python have a switch statement?**
Not a classic \`switch\`, but Python 3.10 added the \`match\`/\`case\` statement, which does everything a switch does and more: it matches on literals, sequences, dictionaries and class instances, binds variables, supports \`|\` alternatives and \`if\` guards, and never falls through. For a simple value-to-action mapping, a dictionary of functions is also a common idiom.
**What is the difference between a for loop and a while loop in Python?**
A \`for\` loop iterates over the items of an iterable (list, string, range, file, generator) and stops when the items run out. A \`while\` loop repeats while a condition is true and needs you to manage the state yourself. Use \`for\` when you have a collection or a known count; use \`while\` for "until something happens" situations such as polling, retrying or reading input.
**What does else do in a for loop in Python?**
The \`else\` block after a \`for\` or \`while\` loop runs only when the loop ends **without** a \`break\`. It is useful for search loops: \`break\` when found, and the \`else\` handles "not found". It also runs when the iterable was empty, because no \`break\` occurred.
**What is the difference between a list comprehension and a generator expression?**
A list comprehension (\`[...]\`) builds the whole list in memory immediately and can be reused, indexed and sliced. A generator expression (\`(...)\`) yields one value at a time on demand, uses almost no memory and can be consumed only once. Use a generator when you only need to pass the values to \`sum\`, \`max\`, \`any\`, \`join\` or a single loop.
**Are list comprehensions faster than for loops in Python?**
Usually, by a modest constant factor (often 20–40% for simple transforms) because the interpreter avoids repeated \`.append\` lookups and runs a tighter bytecode loop. They are not algorithmically faster — both are O(n) — so choose a comprehension for clarity first and speed second, and fall back to a loop when the logic needs several statements.
**What is the walrus operator in Python and when should I use it?**
\`:=\` (Python 3.8+) assigns a value and returns it in the same expression, so you can bind and test in one step: \`if (m := re.search(p, s)):\` or \`while (chunk := f.read(1024)):\`. Use it to avoid calling the same function twice or to remove an awkward extra statement; avoid it when a plain assignment on its own line is just as clear.
**Can I use break inside a list comprehension?**
No. Comprehensions have no \`break\` or \`continue\`. To stop early, use a generator with \`itertools.takewhile\`, a plain loop, or \`next(x for x in xs if cond(x))\` to fetch only the first match.`
    },
    {
      heading: "16. Interview Questions and Answers on Python Control Flow",
      content: `**Q1. Which values are falsy in Python? How does Python decide the truth value of a custom object?**
Falsy values are \`None\`, \`False\`, numeric zeros (\`0\`, \`0.0\`, \`0j\`, \`Decimal(0)\`), empty sequences and collections (\`""\`, \`[]\`, \`()\`, \`{}\`, \`set()\`, \`range(0)\`). For a custom object Python calls \`__bool__()\`; if that is not defined it calls \`__len__()\` and treats zero as false; if neither is defined, the object is truthy.
**Q2. What is the output of \`for i in range(3): pass; print(i)\` and of \`[i for i in range(3)]; print(i)\`?**
The first prints \`2\` because a plain \`for\` loop's variable remains in the enclosing scope after the loop. The second raises \`NameError\` (if \`i\` was not defined earlier) because comprehensions have their own scope in Python 3 and do not leak the loop variable.
**Q3. Explain \`for ... else\` with an example where it matters.**
\`else\` runs if the loop completed without \`break\`. Primality test: loop over possible divisors, \`break\` on finding one; the \`else\` returns \`True\` only if no divisor was found. It removes the need for a \`found\` flag variable.
**Q4. How does \`match\` differ from a switch statement in C or Java?**
\`match\` performs structural pattern matching: it can destructure sequences, mappings and objects, bind sub-parts to names, add guards with \`if\`, combine alternatives with \`|\`, and matches the first fitting case with no fall-through. A switch compares a single value against constants only. Also, a bare name in a \`case\` is a capture pattern, not a constant comparison — use dotted names for constants.
**Q5. What does \`zip\` do when the inputs have different lengths, and how do you make it safe?**
It stops at the shortest iterable and silently discards the extra elements. On Python 3.10+ pass \`strict=True\` to raise \`ValueError\` on a mismatch; use \`itertools.zip_longest\` with a \`fillvalue\` if you want to pad instead.
**Q6. What is wrong with \`grid = [[0] * 3] * 3\`?**
The outer \`* 3\` copies the *reference* to the same inner list three times, so \`grid[0][0] = 1\` changes all three rows. Use a comprehension: \`[[0] * 3 for _ in range(3)]\`, which creates three distinct inner lists.
**Q7. Convert this loop to a comprehension and explain the scope of the variable: \`result = []; for row in matrix: for v in row: if v % 2: result.append(v * v)\`.**
\`result = [v * v for row in matrix for v in row if v % 2]\`. The \`for\` clauses appear in the same order as the nested loops (outer first), the filter goes last, and \`row\`/\`v\` are local to the comprehension.
**Q8. When would you prefer a generator expression over a list comprehension?**
When the values are consumed once by a function such as \`sum()\`, \`max()\`, \`any()\`, \`all()\`, \`str.join()\` or a single \`for\` loop, especially for large or infinite data streams, because a generator produces items lazily in O(1) memory. Prefer a list when you need indexing, slicing, \`len()\`, or multiple passes.
**Q9. Why is \`if x == None\` discouraged, and what should be used instead?**
\`None\` is a singleton, so identity (\`is None\`) is both faster and semantically correct; \`==\` can be overridden by a class's \`__eq__\` and give surprising results (for example, NumPy arrays and pandas objects). PEP 8 mandates \`is None\` / \`is not None\`.
**Q10. Show a case where the walrus operator removes a double computation.**
\`[y for x in data if (y := expensive(x)) is not None]\` calls \`expensive\` once per element, whereas \`[expensive(x) for x in data if expensive(x) is not None]\` calls it twice. The walrus binds \`y\` in the enclosing scope, so it is also available after the comprehension.`
    },
    {
      heading: "17. Hands-On Exercise: Build a Coaching-Class Result Analyzer",
      content: `Time to combine everything from this lecture in one complete, runnable program. You are building a small result-analysis tool for a coaching institute in Patna. The program holds a list of students with their marks in Physics, Chemistry and Maths and answers a sequence of text commands — exactly the shape of a real CLI or chatbot, but with the commands pre-loaded so the script runs unattended and the output is predictable.
What the program must do:
1. Compute each student's total and percentage with a comprehension, and assign a grade with an \`if\`/\`elif\` ladder.
2. Dispatch commands using \`match\` with sequence patterns, OR-patterns and guards: \`"top N"\`, \`"subject <name>"\`, \`"find <student>"\`, \`"failed"\`, \`"stats"\`, and \`"quit"\`.
3. Use \`enumerate(start=1)\` for ranked output and \`zip(strict=True)\` to pair subject names with marks.
4. Use \`for ... else\` in the \`find\` command to report "not found" without a flag variable.
5. Use a \`while\` loop with the walrus operator to pull commands from the queue until \`"quit"\`.
6. Use a generator expression for averages, a set comprehension for the subjects in which anyone failed, and a dict comprehension for per-subject averages.
Copy the code into \`result_analyzer.py\` and run \`python result_analyzer.py\`. Then extend it on your own: add a \`"grade A"\` command that lists students with a given grade, make \`"subject"\` reject unknown subject names with a helpful message, and read the commands from \`input()\` instead of the queue so it becomes interactive. Try to break the program with odd commands (\`"top abc"\`, \`"find"\`) and make the \`match\` fallback handle them gracefully.`,
      codeSnippet: `# result_analyzer.py — Lecture 3 capstone (Python 3.10+)
SUBJECTS = ["Physics", "Chemistry", "Maths"]
PASS_MARK = 33

students = [
    {"name": "Aarav Sinha",   "marks": [88, 91, 95]},
    {"name": "Diya Kumari",   "marks": [95, 85, 99]},
    {"name": "Kabir Khan",    "marks": [67, 29, 72]},
    {"name": "Meera Jha",     "marks": [79, 88, 61]},
    {"name": "Rohan Verma",   "marks": [31, 35, 28]},
    {"name": "Sana Parveen",  "marks": [74, 77, 80]},
]


def grade_for(percent: float) -> str:
    if percent >= 90:
        return "A+"
    elif percent >= 75:
        return "A"
    elif percent >= 60:
        return "B"
    elif percent >= PASS_MARK:
        return "C"
    else:
        return "F"


# Enrich every record with total, percent and grade (dict + comprehension)
for s in students:
    s["total"] = sum(s["marks"])
    s["percent"] = round(s["total"] / (len(SUBJECTS) * 100) * 100, 1)
    s["grade"] = grade_for(s["percent"])
    s["failed_in"] = [sub for sub, m in zip(SUBJECTS, s["marks"], strict=True) if m < PASS_MARK]


def show_ranked(rows, limit=None):
    ordered = sorted(rows, key=lambda r: r["total"], reverse=True)
    for rank, r in enumerate(ordered[:limit], start=1):
        print(f"  {rank}. {r['name']:<14} total={r['total']:>3}  {r['percent']:>5}%  grade {r['grade']}")


def run(command: str) -> bool:
    """Execute one command; return False when the session should end."""
    match command.lower().split():
        case ["quit" | "exit" | "q"]:
            print("Bye!")
            return False
        case ["top", n] if n.isdigit() and int(n) > 0:
            print(f"Top {n} students:")
            show_ranked(students, int(n))
        case ["top"]:
            print("All students ranked:")
            show_ranked(students)
        case ["subject", name] if name.title() in SUBJECTS:
            idx = SUBJECTS.index(name.title())
            avg = sum(s["marks"][idx] for s in students) / len(students)
            best = max(students, key=lambda s: s["marks"][idx])
            print(f"{SUBJECTS[idx]}: average {avg:.1f}, topper {best['name']} with {best['marks'][idx]}")
        case ["find", *words] if words:
            query = " ".join(words)
            for s in students:
                if query in s["name"].lower():
                    print(f"{s['name']}: {dict(zip(SUBJECTS, s['marks']))} -> grade {s['grade']}")
                    break
            else:                                  # for...else: no break happened
                print(f"No student matching {query!r}")
        case ["failed"]:
            failed = [s for s in students if s["failed_in"]]
            subjects_hit = {sub for s in failed for sub in s["failed_in"]}   # set comprehension
            print(f"{len(failed)} student(s) failed; subjects with failures: {sorted(subjects_hit)}")
            for s in failed:
                print(f"  {s['name']}: failed in {', '.join(s['failed_in'])}")
        case ["stats"]:
            per_subject = {                        # dict comprehension with a generator inside
                sub: round(sum(s["marks"][i] for s in students) / len(students), 1)
                for i, sub in enumerate(SUBJECTS)
            }
            grade_counts = {g: sum(1 for s in students if s["grade"] == g) for g in ["A+", "A", "B", "C", "F"]}
            print("Subject averages:", per_subject)
            print("Grade distribution:", {g: c for g, c in grade_counts.items() if c})
        case []:
            print("(empty command ignored)")
        case _:
            print(f"Unknown command: {command!r}. Try: top N | subject NAME | find NAME | failed | stats | quit")
    return True


commands = ["top 3", "subject maths", "find jha", "find priya", "failed", "stats", "top abc", "", "quit", "top"]
queue = iter(commands)
while (cmd := next(queue, None)) is not None:     # walrus: pull the next command until the queue is empty
    print(f"\\n> {cmd}")
    if not run(cmd):
        break

# Expected output (abridged):
# > top 3
# Top 3 students:
#   1. Diya Kumari    total=279   93.0%  grade A+
#   2. Aarav Sinha    total=274   91.3%  grade A+
#   3. Sana Parveen   total=231   77.0%  grade A
# > subject maths
# Maths: average 72.5, topper Diya Kumari with 99
# > find jha
# Meera Jha: {'Physics': 79, 'Chemistry': 88, 'Maths': 61} -> grade A
# > find priya
# No student matching 'priya'
# > failed
# 2 student(s) failed; subjects with failures: ['Chemistry', 'Maths', 'Physics']
#   Kabir Khan: failed in Chemistry
#   Rohan Verma: failed in Physics, Maths
# > stats
# Subject averages: {'Physics': 72.3, 'Chemistry': 67.5, 'Maths': 72.5}
# Grade distribution: {'A+': 2, 'A': 2, 'C': 1, 'F': 1}
# > top abc
# Unknown command: 'top abc'. Try: ...
# >
# (empty command ignored)
# > quit
# Bye!`
    },
    {
      heading: "18. Summary",
      content: `• **Control flow** is how a program decides, repeats and stops; Python expresses it with \`if\`/\`elif\`/\`else\`, \`match\`/\`case\`, \`for\`, \`while\`, \`break\`, \`continue\`, loop \`else\`, and comprehensions.
• \`if\`/\`elif\`/\`else\` runs the **first** true branch only; order conditions from specific to general and use guard clauses to keep the happy path unindented.
• **Truthiness**: \`None\`, \`False\`, zeros and empty collections are falsy, everything else is truthy. Use \`is None\` when zero is a legitimate value. \`and\`/\`or\` return operands, which makes \`x or default\` a handy idiom.
• **Conditional expressions** (\`a if cond else b\`) are for choosing between two simple values; nest them at most once.
• \`match\`/\`case\` (Python 3.10+) is structural pattern matching: literals, captures, \`_\`, sequences, mappings, class patterns, \`|\`, guards and \`as\`. A bare name captures; use dotted names for constants.
• \`for\` iterates over any iterable; \`range(start, stop, step)\` is lazy and excludes \`stop\`. Loop over collections directly instead of over indices.
• \`while\` repeats while a condition holds; keep init/test/update visible, cap retries, and use \`while True\` + \`break\` for do-while behaviour.
• \`break\` leaves one loop level, \`continue\` skips to the next iteration, and loop \`else\` runs only when there was **no \`break\`**.
• \`enumerate(iterable, start)\` gives indices; \`zip(*iterables, strict=True)\` (3.10+) walks parallel sequences safely.
• **Comprehensions**: list \`[...]\`, dict \`{k: v ...}\`, set \`{...}\`, and generator expressions \`(...)\` for lazy, single-pass, memory-light pipelines. Comprehensions have their own scope.
• Multiple \`for\` clauses flatten; a comprehension inside the expression nests. Stop at two clauses and one filter — beyond that, write a loop or a function.
• The **walrus operator** \`:=\` (3.8+) assigns inside an expression; use it for read-and-test loops, regex matches and avoiding double computation, with parentheses at statement level.
**Next lecture:** Functions — Parameters, Scope, Lambdas & Closures`
    }
  ]
};
