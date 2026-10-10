export const lecture10 = {
  slug: "lecture-10",
  number: 10,
  title: "Complete Python Course — Lecture 10: Iterators, Generators, Decorators & Context Managers",
  summary: "Learn Python iterators and the iteration protocol (__iter__, __next__), generators and yield, generator expressions and lazy evaluation, itertools, decorators with arguments and functools.wraps, lru_cache and cache, and context managers with __enter__/__exit__ and contextlib.",
  readTime: "55 min read",
  difficulty: "Intermediate",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. Introduction: Why Iterators, Generators, Decorators and Context Managers Matter",
      content: `Every Python programmer uses \`for\` loops, \`with open(...)\` and the \`@\` symbol in front of functions. Very few understand what actually happens underneath. This lecture opens the hood on four of the most important protocols in the language: the **iteration protocol** (how \`for\` works), **generators** (functions that produce values lazily with \`yield\`), **decorators** (functions that wrap other functions) and **context managers** (the machinery behind \`with\`).
These are not academic topics. Consider a few situations from real Indian engineering teams:
• A data engineer in Hyderabad needs to process a 40 GB NSE trades file on a laptop with 16 GB RAM. Loading it into a list is impossible; a generator pipeline reads one line at a time and finishes with a few megabytes of memory.
• A backend developer in Pune must add request timing, retry-on-failure and authentication checks to 80 FastAPI endpoints. Copying the same ten lines into each function is a maintenance nightmare; three decorators solve it in one place.
• A fintech team in Mumbai repeatedly fetches the same IFSC-code lookup from an external API. One line, \`@functools.lru_cache\`, cuts the API bill by 90 percent.
• A script that writes to a database must release the connection even when an exception is raised halfway. A context manager guarantees the cleanup.
All four features share a common idea: **Python lets ordinary objects plug into language syntax by implementing special (dunder) methods**. Implement \`__iter__\` and \`__next__\` and your object works in a \`for\` loop. Implement \`__enter__\` and \`__exit__\` and it works with \`with\`. Decorators are simply higher-order functions, and generators are the compiler writing iterator classes for you.
This lecture targets Python 3.11 and newer. At the time of writing, Python 3.14 is the current stable series and Python 3.15 is scheduled for October 2026; features that depend on a specific version are labelled, for example \`itertools.batched\` (3.12) and parenthesised context managers (3.10). By the end you will build a complete log-analysis tool that combines a lazy generator pipeline, decorators with arguments, caching and a custom context manager.`
    },
    {
      heading: "2. The Python Iteration Protocol: Iterables vs Iterators, __iter__ and __next__",
      content: `When you write \`for item in collection:\`, Python does not use indexes. It calls two functions behind the scenes. First, \`iter(collection)\` asks the collection for an **iterator** by calling its \`__iter__()\` method. Second, the loop repeatedly calls \`next(iterator)\`, which calls the iterator's \`__next__()\` method, until that method raises the \`StopIteration\` exception. That exception is the signal that the data is finished; the \`for\` loop catches it silently and exits.
This gives us two precise terms that are often confused:
• An **iterable** is any object with an \`__iter__()\` method that returns an iterator (or, for old-style sequences, a \`__getitem__\` that accepts integer indexes from 0). Lists, tuples, strings, dicts, sets, files, ranges and generators are all iterables.
• An **iterator** is an object with a \`__next__()\` method that produces the next value and an \`__iter__()\` method that returns itself. Every iterator is an iterable, but most iterables (such as a list) are **not** iterators; they are factories that hand out a fresh iterator each time.
The distinction matters in practice. A list can be looped over many times because each \`for\` loop calls \`iter()\` and receives a brand-new iterator starting from position 0. An iterator, on the other hand, is a **one-shot stream with internal state**: once it raises \`StopIteration\`, it is exhausted forever. A file object, a \`zip\` object, a \`map\` object and a generator are all iterators, which is why looping over them twice silently gives nothing the second time.
Python exposes this machinery directly. \`iter(obj)\` and \`next(it)\` are the built-in functions; \`next(it, default)\` returns a default instead of raising at the end. The abstract base classes \`collections.abc.Iterable\` and \`collections.abc.Iterator\` let you check which protocol an object supports with \`isinstance\`. The snippet below desugars a \`for\` loop by hand so you can see exactly what the interpreter does.`,
      codeSnippet: `# iteration_protocol.py
from collections.abc import Iterable, Iterator

cities = ["Delhi", "Mumbai", "Chennai"]

# What "for city in cities" really does
it = iter(cities)            # calls cities.__iter__()
while True:
    try:
        city = next(it)      # calls it.__next__()
    except StopIteration:    # the "no more data" signal
        break
    print(city)

# A list is iterable but NOT an iterator
print(isinstance(cities, Iterable))   # True
print(isinstance(cities, Iterator))   # False
print(isinstance(it, Iterator))       # True
print(iter(it) is it)                 # True: an iterator's __iter__ returns itself

# Iterators are one-shot
nums = iter([10, 20, 30])
print(list(nums))   # [10, 20, 30]
print(list(nums))   # []  <- exhausted, nothing left

# next() with a default avoids the exception
print(next(nums, "finished"))   # finished

# Objects that support the protocol: files, zip, map, enumerate ...
pairs = zip(["a", "b"], [1, 2])
print(next(pairs))    # ('a', 1)
print(list(pairs))    # [('b', 2)]  <- only what was not consumed yet`
    },
    {
      heading: "3. Writing a Custom Iterator Class in Python",
      content: `To make your own class usable in a \`for\` loop, implement the two methods yourself. A classic example is a countdown or a range-like object. The important design decision is **where the state lives**. If the same object is both the iterable and the iterator (its \`__iter__\` returns \`self\`), it can be looped over only once. If you want a reusable container, \`__iter__\` should return a **separate** iterator object each time, exactly as \`list\` does.
Notice in the example that \`EMICalendar\` keeps the loan data and returns a new \`_EMIIterator\` on every \`iter()\` call. That is the pattern used by every well-behaved collection class. The iterator holds the position (\`self._month\`) and raises \`StopIteration\` when the loan is paid off.
Writing iterator classes by hand is verbose, and you rarely do it in modern Python because generators (next section) produce the same behaviour in a fraction of the code. But understanding the class form explains **why** generators behave as they do: a generator object is simply an iterator whose \`__next__\` runs your function until the next \`yield\`.
One more detail worth knowing: Python also supports the older **sequence protocol**. If a class defines \`__getitem__\` and \`__len__\` and the indexes start at 0, \`iter()\` will build an iterator that calls \`obj[0]\`, \`obj[1]\`, ... until \`IndexError\`. This is why custom sequence classes work in \`for\` loops even without \`__iter__\`, but you should still implement \`__iter__\` explicitly for clarity and speed.`,
      codeSnippet: `# emi_iterator.py
class _EMIIterator:
    """Iterator that yields (month, emi, remaining_balance) tuples."""

    def __init__(self, principal: float, emi: float, annual_rate: float):
        self._balance = principal
        self._emi = emi
        self._monthly_rate = annual_rate / 12 / 100
        self._month = 0

    def __iter__(self):
        return self                      # an iterator returns itself

    def __next__(self):
        if self._balance <= 0.005:       # loan fully repaid
            raise StopIteration
        self._month += 1
        interest = self._balance * self._monthly_rate
        payment = min(self._emi, self._balance + interest)
        self._balance = self._balance + interest - payment
        return self._month, round(payment, 2), round(max(self._balance, 0), 2)


class EMICalendar:
    """Reusable iterable: a fresh iterator is created on every for loop."""

    def __init__(self, principal: float, emi: float, annual_rate: float):
        self.principal, self.emi, self.annual_rate = principal, emi, annual_rate

    def __iter__(self):
        return _EMIIterator(self.principal, self.emi, self.annual_rate)


loan = EMICalendar(principal=50_000, emi=10_500, annual_rate=12)

for month, paid, left in loan:
    print(f"Month {month}: paid Rs {paid:,.2f}, remaining Rs {left:,.2f}")
# Month 1: paid Rs 10,500.00, remaining Rs 40,000.00
# Month 2: paid Rs 10,500.00, remaining Rs 29,900.00
# ...
# Month 5: paid Rs 9,489.95, remaining Rs 0.00

print(round(sum(paid for _, paid, _ in loan), 2))   # works again: 51489.95 (new iterator)`
    },
    {
      heading: "4. Python Generators and the yield Keyword",
      content: `A **generator function** is any function that contains the keyword \`yield\`. Calling it does **not** run the body. Instead it immediately returns a **generator object**, which is an iterator. Each call to \`next()\` runs the function until it reaches a \`yield\`, hands the yielded value to the caller and then **pauses**, remembering all local variables and the exact line where it stopped. The next \`next()\` resumes from that point. When the function returns (explicitly or by falling off the end), the generator raises \`StopIteration\` automatically.
Compare the 30-line iterator class from the previous section with the generator version below: the same EMI schedule in eight lines, and the state (\`balance\`, \`month\`) lives in ordinary local variables instead of \`self._\` attributes. This is why experienced Python developers almost never write \`__next__\` by hand.
Generators have three properties you must internalise:
• **Lazy**: no value is computed until requested. A generator over a billion numbers costs nothing until you start pulling from it.
• **One-shot**: like all iterators, a generator object is exhausted after a single pass. Call the generator function again to get a fresh one.
• **Stateful and resumable**: the function's frame is kept alive between \`next()\` calls, which is what makes pipelines and coroutines possible.
A \`return value\` inside a generator ends it; the value becomes \`StopIteration.value\` and is mostly useful with \`yield from\` (section 6). Note also PEP 479 (Python 3.7+): if a \`StopIteration\` is raised **inside** a generator body it is converted into a \`RuntimeError\`, so never raise \`StopIteration\` manually; just \`return\`.
Type hints: annotate a generator as \`Iterator[int]\` when callers only read from it, or \`Generator[YieldType, SendType, ReturnType]\` from \`collections.abc\` when you use \`send\` or \`return\`.`,
      codeSnippet: `# generators_basics.py
from collections.abc import Iterator

def emi_schedule(principal: float, emi: float, annual_rate: float) -> Iterator[tuple[int, float, float]]:
    balance, month = principal, 0
    monthly_rate = annual_rate / 12 / 100
    while balance > 0.005:
        month += 1
        interest = balance * monthly_rate
        payment = min(emi, balance + interest)
        balance = balance + interest - payment
        yield month, round(payment, 2), round(max(balance, 0), 2)   # pause here

gen = emi_schedule(50_000, 10_500, 12)
print(type(gen))        # <class 'generator'>
print(next(gen))        # (1, 10500.0, 40000.0)
print(next(gen))        # (2, 10500.0, 29900.0)
print(list(gen))        # remaining months, then exhausted

# Watching the pause/resume behaviour
def chatty():
    print("  start")
    yield 1
    print("  between 1 and 2")
    yield 2
    print("  end")

g = chatty()
print("created, nothing printed yet")
print(next(g))   # prints "  start" then 1
print(next(g))   # prints "  between 1 and 2" then 2
try:
    next(g)      # prints "  end" then raises StopIteration
except StopIteration:
    print("exhausted")

# Infinite generators are fine because they are lazy
def fibonacci() -> Iterator[int]:
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

for n in fibonacci():
    if n > 100:
        break
    print(n, end=" ")   # 0 1 1 2 3 5 8 13 21 34 55 89`
    },
    {
      heading: "5. Generator Expressions, Lazy Evaluation and Memory Usage",
      content: `A **generator expression** looks like a list comprehension with round brackets instead of square ones: \`(x * x for x in range(10))\`. The difference is fundamental. A list comprehension builds the entire list in memory immediately; a generator expression builds a tiny generator object and computes each value only when something asks for it. When a generator expression is the only argument to a function, you can drop the extra parentheses: \`sum(x * x for x in range(10))\`.
The memory difference is dramatic and easy to measure with \`sys.getsizeof\`. A list of one million integers created with \`list(range(1_000_000))\` takes about 8 MB just for the list's pointer array (each slot is 8 bytes on a 64-bit machine), plus the integer objects themselves. The equivalent generator expression takes a couple of hundred bytes no matter whether it represents a thousand values or a trillion, because it stores only the current state, not the results.
**Lazy evaluation** has consequences beyond memory:
• **Early exit saves work.** \`any(is_fraud(txn) for txn in transactions)\` stops at the first match; the list version would check every transaction first and only then scan the list.
• **Pipelines stream.** Reading a 40 GB file with \`(parse(line) for line in open(path))\` processes it line by line; nothing is ever fully loaded. This is the single most useful pattern in data engineering.
• **Values are computed at consumption time, not creation time.** If the underlying data changes between creating and consuming the generator, you see the new data. This surprises people (see Common Mistakes).
• **You cannot ask for \`len()\`, index with \`[i]\` or iterate twice.** If you need those, you want a list.
Use a list when the data is small, must be reused, needs random access or must be sorted; use a generator when the data is large, streamed, infinite or consumed exactly once. The same rule applies to the built-ins \`map\`, \`filter\`, \`zip\`, \`enumerate\` and \`reversed\`, which all return lazy iterators in Python 3.`,
      codeSnippet: `# lazy_memory.py
import sys
import tracemalloc

squares_list = [n * n for n in range(1_000_000)]
squares_gen = (n * n for n in range(1_000_000))

print(sys.getsizeof(squares_list))   # 8448728  (about 8 MB, list container only)
print(sys.getsizeof(squares_gen))    # 200      (roughly; tiny and constant)

# Peak memory of a full computation: list vs generator
tracemalloc.start()
total = sum([n * n for n in range(1_000_000)])
_, peak_list = tracemalloc.get_traced_memory()
tracemalloc.stop()

tracemalloc.start()
total = sum(n * n for n in range(1_000_000))
_, peak_gen = tracemalloc.get_traced_memory()
tracemalloc.stop()

print(f"list peak: {peak_list / 1e6:.1f} MB, generator peak: {peak_gen / 1e6:.3f} MB")
# list peak: ~43 MB, generator peak: ~0.001 MB  (numbers vary by platform)

# Early exit: only as many values as needed are produced
def is_fraud(amount: int) -> bool:
    print(f"checking {amount}")
    return amount > 2_00_000

amounts = [500, 1_200, 3_50_000, 90, 4_00_000]
print(any(is_fraud(a) for a in amounts))
# checking 500 / checking 1200 / checking 350000 / True  <- stops early

# Streaming a file: constant memory regardless of file size
def total_sales(path: str) -> float:
    with open(path, encoding="utf-8") as f:
        next(f)                                  # skip header
        return sum(float(line.split(",")[2]) for line in f)`
    },
    {
      heading: "6. Advanced Generators: send(), close(), yield from and Generator Pipelines",
      content: `Generators are more than lazy lists; they are **coroutines** in disguise. Besides \`next()\`, a generator object has three more methods. \`gen.send(value)\` resumes the generator and makes the paused \`yield\` expression **evaluate to** \`value\`, so a generator can receive data as well as produce it. \`gen.throw(exc)\` raises an exception at the paused \`yield\`. \`gen.close()\` raises \`GeneratorExit\` at the \`yield\` so the generator can run its \`finally\` blocks; Python calls this automatically when the generator is garbage-collected, but calling it explicitly is good practice when the generator holds a file or socket.
A generator must be **primed** with one \`next()\` call before you can \`send\` into it, because execution has to reach the first \`yield\` first. Forgetting this raises \`TypeError: can't send non-None value to a just-started generator\`.
\`yield from iterable\` (Python 3.3+) delegates to another iterable: every value it produces is passed straight through, \`send\` and \`throw\` are forwarded to the inner generator, and the inner generator's \`return\` value becomes the value of the \`yield from\` expression. It is both a convenience (\`yield from items\` instead of \`for x in items: yield x\`) and the foundation on which \`async\`/\`await\` was originally built. It is also the natural way to walk recursive structures such as directory trees or nested JSON.
The most practical pattern is the **generator pipeline**: a chain of small generators where each consumes the previous one's output. Each stage is independently testable, memory stays flat, and adding a new stage (deduplication, rate limiting, enrichment) is one function. The example below reads log lines, parses them, filters errors and groups them, all lazily. Unix pipes (\`cat log | grep ERROR | sort\`) are exactly this idea.`,
      codeSnippet: `# advanced_generators.py
from collections.abc import Generator, Iterator, Iterable

# 1) send(): a running average that receives values
def running_average() -> Generator[float, float, None]:
    total, count = 0.0, 0
    average = 0.0
    while True:
        value = yield average        # pause; resumes with the value from send()
        total += value
        count += 1
        average = total / count

avg = running_average()
next(avg)                 # prime: run to the first yield
print(avg.send(100))      # 100.0
print(avg.send(50))       # 75.0
print(avg.send(150))      # 100.0
avg.close()

# 2) close() and finally: cleanup of resources held by a generator
def read_records(path: str) -> Iterator[str]:
    f = open(path, encoding="utf-8")
    try:
        for line in f:
            yield line.rstrip("\\n")
    finally:
        print("closing file")
        f.close()

# 3) yield from: delegation and recursion
def flatten(items: Iterable) -> Iterator:
    for item in items:
        if isinstance(item, (list, tuple)):
            yield from flatten(item)     # recurse into nested lists
        else:
            yield item

print(list(flatten([1, [2, [3, 4]], (5, [6])])))   # [1, 2, 3, 4, 5, 6]

# 4) A generator pipeline: each stage is lazy
LOG = """2026-10-09 10:01:02 INFO  user=amit action=login
2026-10-09 10:01:09 ERROR user=priya action=payment code=502
2026-10-09 10:02:11 INFO  user=amit action=logout
2026-10-09 10:03:45 ERROR user=rahul action=payment code=504
"""

def lines(text: str) -> Iterator[str]:
    yield from text.splitlines()

def parse(rows: Iterable[str]) -> Iterator[dict]:
    for row in rows:
        date, time, level, *fields = row.split()
        record = {"time": f"{date} {time}", "level": level}
        record.update(f.split("=", 1) for f in fields)
        yield record

def only_errors(records: Iterable[dict]) -> Iterator[dict]:
    return (r for r in records if r["level"] == "ERROR")

pipeline = only_errors(parse(lines(LOG)))     # nothing has run yet
for rec in pipeline:
    print(rec["time"], rec["user"], rec["code"])
# 2026-10-09 10:01:09 priya 502
# 2026-10-09 10:03:45 rahul 504`
    },
    {
      heading: "7. The itertools Module: Building Blocks for Efficient Iteration",
      content: `The standard-library module \`itertools\` is a collection of fast, memory-efficient iterator building blocks written in C. Learning it means writing less code and fewer bugs. The functions fall into three groups.
**Infinite iterators** (always combine them with \`islice\`, \`takewhile\`, \`zip\` or a \`break\`):
• \`count(start, step)\` counts forever; \`cycle(iterable)\` repeats a sequence endlessly; \`repeat(value, n)\` repeats one value.
**Iterators that terminate on the shortest input:**
• \`chain(a, b, c)\` joins iterables end to end; \`chain.from_iterable(list_of_lists)\` flattens one level.
• \`islice(it, start, stop, step)\` slices any iterator lazily, which is the only way to "take the first 10" of a generator.
• \`takewhile(pred, it)\` and \`dropwhile(pred, it)\` cut a stream at the first point the predicate changes.
• \`accumulate(it, func)\` produces running totals (or running max, running product).
• \`groupby(it, key)\` groups **consecutive** items with the same key; sort first if the data is not already grouped, otherwise you get fragmented groups.
• \`pairwise(it)\` (Python 3.10) yields overlapping pairs (a, b), (b, c); perfect for computing differences between consecutive readings.
• \`batched(it, n)\` (Python 3.12) yields tuples of n items at a time, ideal for bulk-inserting rows in chunks of 500. Python 3.13 added a \`strict=True\` flag that raises if the last batch is short.
• \`zip_longest\`, \`starmap\`, \`compress\`, \`filterfalse\` and \`tee\` round out the group.
**Combinatoric iterators:** \`product\` (cartesian product, nested loops in one call), \`permutations\`, \`combinations\` and \`combinations_with_replacement\`.
A practical rule: whenever you find yourself writing an index-juggling loop with a manual counter, a "previous item" variable or a chunking helper, check whether \`itertools\` already has it. The recipes section of the official \`itertools\` documentation, and the third-party \`more-itertools\` package, contain dozens more.`,
      codeSnippet: `# itertools_tour.py
from itertools import (count, cycle, islice, chain, accumulate, groupby,
                       pairwise, batched, product, combinations, takewhile)
from operator import itemgetter

# Infinite + islice
invoice_numbers = (f"INV-{n:04d}" for n in count(1))
print(list(islice(invoice_numbers, 3)))      # ['INV-0001', 'INV-0002', 'INV-0003']

# cycle: round-robin assignment of support tickets
agents = cycle(["Asha", "Vikram", "Neha"])
print([next(agents) for _ in range(5)])      # ['Asha', 'Vikram', 'Neha', 'Asha', 'Vikram']

# chain: iterate several sources as one
north = ["Delhi", "Jaipur"]; south = ["Chennai", "Kochi"]
print(list(chain(north, south)))             # ['Delhi', 'Jaipur', 'Chennai', 'Kochi']

# accumulate: running balance of a bank account
txns = [5000, -1200, -800, 3000]
print(list(accumulate(txns)))                # [5000, 3800, 3000, 6000]

# pairwise (3.10): month-on-month change
sales = [120, 135, 128, 150]
print([b - a for a, b in pairwise(sales)])   # [15, -7, 22]

# batched (3.12): bulk inserts in chunks
rows = range(1, 11)
for chunk in batched(rows, 4):
    print(chunk)                             # (1, 2, 3, 4) (5, 6, 7, 8) (9, 10)

# groupby: MUST be sorted by the same key first
orders = [("Mumbai", 900), ("Delhi", 450), ("Mumbai", 300), ("Delhi", 700)]
orders.sort(key=itemgetter(0))
for city, group in groupby(orders, key=itemgetter(0)):
    print(city, sum(amount for _, amount in group))   # Delhi 1150 / Mumbai 1200

# takewhile: stop at the first value that breaks the condition
temps = [31, 33, 35, 29, 36]
print(list(takewhile(lambda t: t >= 30, temps)))      # [31, 33, 35]

# Combinatorics
print(list(product("AB", [1, 2])))           # [('A', 1), ('A', 2), ('B', 1), ('B', 2)]
print(list(combinations(["Ravi", "Sita", "Arjun"], 2)))
# [('Ravi', 'Sita'), ('Ravi', 'Arjun'), ('Sita', 'Arjun')]`
    },
    {
      heading: "8. Python Decorators Explained: Functions as Objects and functools.wraps",
      content: `In Python, functions are **first-class objects**: you can store them in variables, pass them as arguments, return them from other functions and attach attributes to them. A **decorator** is simply a function that takes a function and returns a (usually new) function. The \`@decorator\` line above a \`def\` is pure syntactic sugar for \`func = decorator(func)\`; nothing magical happens.
The typical decorator defines an inner \`wrapper\` function that does something before and/or after calling the original, then returns that wrapper. The wrapper accepts \`*args, **kwargs\` so it can wrap any signature, and it must \`return\` the original's result or the decorated function silently starts returning \`None\` (one of the most common decorator bugs).
Because the wrapper replaces the original, the decorated function's **metadata** is lost: \`__name__\` becomes \`"wrapper"\`, the docstring disappears and tools like \`help()\`, debuggers, Sphinx and pytest show the wrong information. \`functools.wraps(func)\` fixes this: applied to the wrapper, it copies \`__name__\`, \`__qualname__\`, \`__doc__\`, \`__module__\`, \`__annotations__\` and \`__dict__\` from the original and stores a reference to it in \`__wrapped__\`. Always use it; it is a one-line habit that saves hours of confusion.
Where are decorators used in real projects? Everywhere: \`@app.get("/users")\` in FastAPI registers a route, \`@pytest.fixture\` registers test setup, \`@property\`, \`@staticmethod\` and \`@classmethod\` are built-in decorators, \`@dataclass\` generates methods, \`@login_required\` in Django checks authentication, and \`@retry\` from the tenacity library re-runs flaky network calls. Understanding the pattern lets you read all of these and write your own cross-cutting concerns: logging, timing, caching, validation, rate limiting, permission checks.
The example implements a timing decorator and shows the before/after effect of \`functools.wraps\`.`,
      codeSnippet: `# decorators_basic.py
import time
import functools

# A decorator is just a function that takes a function and returns a function
def timer(func):
    @functools.wraps(func)                      # keep name, docstring, etc.
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)          # call the original
        elapsed = (time.perf_counter() - start) * 1000
        print(f"{func.__name__} took {elapsed:.2f} ms")
        return result                           # do not forget to return!
    return wrapper

@timer
def compute_gst(amounts: list[float], rate: float = 0.18) -> float:
    """Return total GST payable on a list of invoice amounts."""
    return sum(a * rate for a in amounts)

# The @ line above is identical to:
# compute_gst = timer(compute_gst)

print(compute_gst([1000, 2500, 400]))
# compute_gst took 0.01 ms
# 702.0

print(compute_gst.__name__)      # compute_gst   (thanks to wraps; else "wrapper")
print(compute_gst.__doc__)       # Return total GST payable ...
print(compute_gst.__wrapped__)   # <function compute_gst ...>  original, undecorated

# Without functools.wraps, for comparison
def naive_logger(func):
    def wrapper(*args, **kwargs):
        print("calling", func.__name__)
        return func(*args, **kwargs)
    return wrapper

@naive_logger
def greet(name: str) -> str:
    """Say hello."""
    return f"Namaste, {name}!"

print(greet("Ravindra"))     # calling greet / Namaste, Ravindra!
print(greet.__name__)        # wrapper   <- metadata lost
print(greet.__doc__)         # None`
    },
    {
      heading: "9. Decorators with Arguments, Stacking Decorators and Class-Based Decorators",
      content: `Sometimes a decorator needs configuration: \`@retry(times=3)\`, \`@rate_limit(calls=100, per=60)\`, \`@app.get("/path")\`. Since \`@retry(times=3)\` first **calls** \`retry(times=3)\` and then applies whatever it returns to the function, a parameterised decorator is a **decorator factory**: a function that accepts the configuration and returns the actual decorator. That means three nested levels: the factory, the decorator and the wrapper. It looks intimidating the first time, but the structure is always the same; copy the template in the snippet.
**Stacking** several decorators applies them from the bottom up: with \`@a\` above \`@b\` above \`def f\`, Python computes \`f = a(b(f))\`. So the decorator closest to the function wraps it first and runs **innermost**. Order matters when decorators interact; for example a \`@timer\` placed above \`@lru_cache\` measures the cache hit time, while placed below it measures only the uncached calls.
A decorator does not have to be a function. Any **callable** works, so a class with a \`__call__\` method can decorate functions, which is handy when the decorator needs to keep state such as a call counter or when you want to expose methods on the decorated object. Use \`functools.update_wrapper(self, func)\` in \`__init__\` to copy the metadata, the class-based equivalent of \`@wraps\`.
Decorators can also be applied to **classes** (\`@dataclass\`, \`@functools.total_ordering\`), and a function can be decorated with a decorator that returns something other than a function (for example a registry decorator that stores the function in a dict and returns it unchanged). The example shows a \`retry\` factory with exponential backoff, a stacking demonstration and a class-based call counter.`,
      codeSnippet: `# decorators_advanced.py
import functools
import time

# 1) Decorator with arguments = a factory that returns a decorator
def retry(times: int = 3, delay: float = 0.5, exceptions: tuple = (Exception,)):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            last_error = None
            for attempt in range(1, times + 1):
                try:
                    return func(*args, **kwargs)
                except exceptions as exc:
                    last_error = exc
                    wait = delay * 2 ** (attempt - 1)        # exponential backoff
                    print(f"{func.__name__} attempt {attempt} failed: {exc}; retrying in {wait}s")
                    time.sleep(wait)
            raise RuntimeError(f"{func.__name__} failed after {times} attempts") from last_error
        return wrapper
    return decorator

_attempts = []                                   # simulate an API that fails twice, then works

@retry(times=3, delay=0.1, exceptions=(ConnectionError,))
def fetch_ifsc(code: str) -> dict:
    _attempts.append(code)
    if len(_attempts) < 3:
        raise ConnectionError("bank API timeout")
    return {"ifsc": code, "bank": "State Bank of India", "branch": "Patna Main"}

print(fetch_ifsc("SBIN0000001"))
# fetch_ifsc attempt 1 failed: bank API timeout; retrying in 0.1s
# fetch_ifsc attempt 2 failed: bank API timeout; retrying in 0.2s
# {'ifsc': 'SBIN0000001', 'bank': 'State Bank of India', 'branch': 'Patna Main'}

# 2) Stacking: decorators apply bottom-up, run top-down
def announce(label):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            print(f"enter {label}")
            result = func(*args, **kwargs)
            print(f"exit {label}")
            return result
        return wrapper
    return decorator

@announce("outer")
@announce("inner")
def work():
    print("working")

work()
# enter outer / enter inner / working / exit inner / exit outer

# 3) Class-based decorator with state
class CountCalls:
    def __init__(self, func):
        functools.update_wrapper(self, func)
        self.func = func
        self.calls = 0

    def __call__(self, *args, **kwargs):
        self.calls += 1
        return self.func(*args, **kwargs)

@CountCalls
def send_otp(phone: str) -> str:
    return f"OTP sent to {phone}"

send_otp("98765xxxxx"); send_otp("91234xxxxx")
print(send_otp.calls)        # 2
print(send_otp.__name__)     # send_otp`
    },
    {
      heading: "10. Memoization with functools.lru_cache, functools.cache and cached_property",
      content: `**Memoization** means remembering the result of a function call so that repeating the same call returns instantly. Python ships it as a decorator: \`functools.lru_cache(maxsize=128)\` stores up to 128 most recent argument-to-result pairs and evicts the **least recently used** entry when full. \`functools.cache\` (Python 3.9+) is the same thing with no size limit, slightly faster, and the right choice when the number of distinct inputs is small and bounded. \`functools.cached_property\` (3.8+) caches a computed attribute on an instance so it is calculated only on first access.
The cache key is built from the positional and keyword arguments, so **every argument must be hashable**. Passing a list or dict raises \`TypeError: unhashable type\`; convert to a tuple or frozenset first. Note also that \`f(1)\` and \`f(x=1)\` are different keys, and \`f(1)\` and \`f(1.0)\` are the same key because \`1 == 1.0\` and they hash equally.
Every cached function gains two helper methods: \`cache_info()\` returns hits, misses, maxsize and current size (useful to prove the cache is actually helping) and \`cache_clear()\` empties it, which is essential in tests. The undecorated function is still available as \`__wrapped__\`.
When should you **not** cache?
• Functions with side effects (sending email, writing to a database): the second call would silently do nothing.
• Functions whose result depends on something other than their arguments (current time, random numbers, global config).
• Methods on instances, when the cache is on the class: \`lru_cache\` keeps a reference to \`self\` in its key, so instances are never garbage-collected (a memory leak). Prefer \`cached_property\`, or cache a module-level helper.
• Data that must be fresh. Neither decorator supports time-based expiry; for a TTL cache use the \`cachetools\` package or build one with a timestamp.
The classic demonstration is recursive Fibonacci: the naive version makes about 2.7 billion calls for n=50 and takes minutes; with \`@cache\` it makes 51 calls and takes microseconds.`,
      codeSnippet: `# caching.py
import functools
import time

@functools.cache                       # Python 3.9+; unbounded
def fib(n: int) -> int:
    return n if n < 2 else fib(n - 1) + fib(n - 2)

start = time.perf_counter()
print(fib(90))                         # 2880067194370816120
print(f"{(time.perf_counter() - start) * 1000:.3f} ms")   # well under 1 ms
print(fib.cache_info())                # CacheInfo(hits=88, misses=91, maxsize=None, currsize=91)

# lru_cache with a bounded size: ideal for lookups against an external API
@functools.lru_cache(maxsize=1024)
def pincode_to_city(pincode: str) -> str:
    print(f"  (calling the slow postal API for {pincode})")
    time.sleep(0.2)                    # simulate network latency
    return {"110001": "New Delhi", "400001": "Mumbai", "560001": "Bengaluru"}.get(pincode, "Unknown")

for pin in ["110001", "400001", "110001", "110001", "560001", "400001"]:
    print(pin, "->", pincode_to_city(pin))
print(pincode_to_city.cache_info())    # hits=3, misses=3 : only 3 real API calls
pincode_to_city.cache_clear()          # useful in tests

# Unhashable arguments fail: convert to a tuple first
@functools.cache
def total(amounts: tuple[int, ...]) -> int:
    return sum(amounts)

print(total(tuple([100, 200, 300])))   # 600
# total([100, 200]) -> TypeError: unhashable type: 'list'

# cached_property: compute an expensive attribute once per instance
class Portfolio:
    def __init__(self, holdings: dict[str, float]):
        self.holdings = holdings

    @functools.cached_property
    def total_value(self) -> float:
        print("  computing total value...")
        return sum(self.holdings.values())

p = Portfolio({"TCS": 1_25_000, "INFY": 80_000})
print(p.total_value)    # computing total value... 205000
print(p.total_value)    # 205000  (no recomputation)`
    },
    {
      heading: "11. Context Managers in Python: the with Statement, __enter__ and __exit__",
      content: `A **context manager** is an object that defines what happens when you enter and leave a block of code. The \`with\` statement calls its \`__enter__()\` method at the start and its \`__exit__()\` method at the end, and crucially, \`__exit__\` runs **no matter how the block ends**: normal completion, \`return\`, \`break\` or an exception. That makes \`with\` the correct tool for anything that must be cleaned up: files, database connections, locks, network sockets, temporary directories, timers and transactions.
The protocol is small:
• \`__enter__(self)\` runs setup and its return value is bound to the \`as\` target. Many managers return \`self\`; a file object does; a transaction manager might return a cursor.
• \`__exit__(self, exc_type, exc_value, traceback)\` runs teardown. If the block raised, the three arguments describe the exception; otherwise all three are \`None\`. If \`__exit__\` returns a truthy value, the exception is **suppressed**; if it returns \`None\` or \`False\` (the normal case), the exception continues to propagate after cleanup.
Writing the with statement by hand with \`try/finally\` works, but \`with\` is shorter, cannot be forgotten and documents intent. The classic bug it prevents: \`f = open(path); data = f.read(); f.close()\` leaks the file handle if \`read()\` raises, and on Windows a leaked handle can block the file from being deleted or renamed later.
Since Python 3.10 you can wrap multiple context managers in parentheses over several lines, and \`with a() as x, b() as y:\` has always been allowed. Managers in one statement are exited in reverse order. Related protocols: \`async with\` uses \`__aenter__\`/\`__aexit__\` for asynchronous resources like \`httpx.AsyncClient\`, which you will meet in the FastAPI lectures.
The example builds a \`Timer\` context manager and a \`Transaction\` manager that commits on success and rolls back on error, the exact pattern used by SQLAlchemy sessions.`,
      codeSnippet: `# context_managers.py
import time

class Timer:
    """Measure the wall-clock time of a block: with Timer("label") as t: ..."""

    def __init__(self, label: str = "block"):
        self.label = label

    def __enter__(self):
        self.start = time.perf_counter()
        return self                                  # bound to the "as" target

    def __exit__(self, exc_type, exc_value, traceback):
        self.elapsed_ms = (time.perf_counter() - self.start) * 1000
        status = "failed" if exc_type else "ok"
        print(f"{self.label}: {self.elapsed_ms:.2f} ms ({status})")
        return False                                 # do NOT swallow exceptions

with Timer("sum of squares") as t:
    total = sum(i * i for i in range(500_000))
print(t.elapsed_ms > 0)        # True: the object is still usable after the block


class FakeConnection:
    def __init__(self): self.log = []
    def execute(self, sql): self.log.append(sql)
    def commit(self): self.log.append("COMMIT")
    def rollback(self): self.log.append("ROLLBACK")


class Transaction:
    """Commit on success, roll back on any exception, then re-raise it."""

    def __init__(self, conn: FakeConnection):
        self.conn = conn

    def __enter__(self):
        self.conn.execute("BEGIN")
        return self.conn

    def __exit__(self, exc_type, exc_value, traceback):
        if exc_type is None:
            self.conn.commit()
        else:
            self.conn.rollback()
        return False     # propagate the error to the caller


conn = FakeConnection()
with Transaction(conn) as c:
    c.execute("UPDATE accounts SET balance = balance - 5000 WHERE id = 1")
    c.execute("UPDATE accounts SET balance = balance + 5000 WHERE id = 2")
print(conn.log)   # ['BEGIN', 'UPDATE ...', 'UPDATE ...', 'COMMIT']

conn = FakeConnection()
try:
    with Transaction(conn) as c:
        c.execute("UPDATE accounts SET balance = balance - 5000 WHERE id = 1")
        raise ValueError("insufficient funds")
except ValueError as e:
    print("caught:", e)
print(conn.log)   # ['BEGIN', 'UPDATE ...', 'ROLLBACK']

# Python 3.10+: parenthesised multi-line context managers
with (
    Timer("outer") as outer,
    Timer("inner") as inner,
):
    pass    # exits in reverse order: inner first, then outer`
    },
    {
      heading: "12. contextlib: @contextmanager, suppress, closing, ExitStack and nullcontext",
      content: `Writing a class with \`__enter__\` and \`__exit__\` for every small cleanup task is heavy. The \`contextlib\` module provides \`@contextmanager\`, which turns a **generator function with exactly one \`yield\`** into a context manager. Everything before the \`yield\` is the setup (\`__enter__\`), the yielded value is bound to \`as\`, and everything after the \`yield\` is the teardown (\`__exit__\`). If the \`with\` block raises, the exception is **thrown into the generator at the \`yield\`** line, so you must wrap the \`yield\` in \`try/finally\` (or \`try/except\`) to guarantee cleanup; without it, an exception skips the code after the \`yield\` entirely. To suppress an exception, catch it inside the generator and do not re-raise.
The rest of \`contextlib\` is a toolbox of ready-made managers you should know:
• \`suppress(*exceptions)\` ignores the listed exceptions inside the block: \`with suppress(FileNotFoundError): os.remove(path)\` replaces a four-line try/except.
• \`closing(obj)\` calls \`obj.close()\` on exit, for objects that have \`close()\` but no context-manager support.
• \`redirect_stdout(file)\` and \`redirect_stderr\` temporarily send prints elsewhere, handy for capturing output in tests.
• \`nullcontext(value)\` (3.7+) is a do-nothing manager used when a resource is optional: \`with (open(path) if path else nullcontext(sys.stdin)) as f:\`.
• \`chdir(path)\` (3.11+) changes the working directory and restores it afterwards.
• \`ExitStack\` manages a **dynamic number** of context managers, for example opening a list of files whose length is unknown until runtime, and guarantees all of them are closed even if opening the fifth one fails. It also accepts arbitrary cleanup callbacks via \`stack.callback(func)\`.
• \`asynccontextmanager\`, \`AsyncExitStack\` and \`aclosing\` are the async equivalents; FastAPI's \`lifespan\` handler is written with \`@asynccontextmanager\`.
A context manager built with \`@contextmanager\` can also be used as a **decorator** (the class inherits from \`ContextDecorator\`), so \`@timed("report")\` on a function times every call.`,
      codeSnippet: `# contextlib_tour.py
import os
import sys
import time
from contextlib import contextmanager, suppress, closing, ExitStack, nullcontext, redirect_stdout
from io import StringIO
from pathlib import Path
import tempfile

@contextmanager
def timed(label: str):
    start = time.perf_counter()
    try:
        yield                                    # the with-block runs here
    finally:                                     # runs even if the block raised
        print(f"{label}: {(time.perf_counter() - start) * 1000:.2f} ms")

with timed("build report"):
    sum(range(1_000_000))

@timed("decorated call")                         # also usable as a decorator
def heavy():
    return [i for i in range(100_000)]
heavy()

@contextmanager
def temporary_file(content: str):
    """Create a temp file, yield its Path, delete it afterwards."""
    tmp = Path(tempfile.gettempdir()) / "lecture10_demo.txt"
    tmp.write_text(content, encoding="utf-8")
    try:
        yield tmp
    finally:
        tmp.unlink(missing_ok=True)
        print("temp file removed")

with temporary_file("hello\\nworld\\n") as p:
    print(p.read_text(encoding="utf-8").split())    # ['hello', 'world']

# suppress: ignore specific exceptions
with suppress(FileNotFoundError):
    os.remove("does_not_exist.txt")
print("still running")

# redirect_stdout: capture prints
buffer = StringIO()
with redirect_stdout(buffer):
    print("captured line")
print(repr(buffer.getvalue()))                   # 'captured line\\n'

# nullcontext: optional resource
def read_source(path: str | None):
    with (open(path, encoding="utf-8") if path else nullcontext(sys.stdin)) as f:
        return f.readline()

# ExitStack: a dynamic number of managers, all closed safely
paths = ["a.txt", "b.txt", "c.txt"]
for name in paths:
    Path(name).write_text(f"data from {name}\\n", encoding="utf-8")

with ExitStack() as stack:
    files = [stack.enter_context(open(p, encoding="utf-8")) for p in paths]
    stack.callback(lambda: print("all files closed"))
    for f in files:
        print(f.read().strip())
# data from a.txt / data from b.txt / data from c.txt / all files closed

for name in paths:
    Path(name).unlink()`
    },
    {
      heading: "13. Real-World Use Cases: How Iterators, Generators, Decorators and Context Managers Are Used in Production",
      content: `These four features are not isolated tricks; production Python code combines them constantly. Here is how they show up in jobs you are likely to hold.
**Data engineering and ETL.** A pipeline that reads a 20 GB CSV of UPI transactions, cleans each row, enriches it with a merchant lookup and writes it to Parquet is a chain of generators. \`itertools.batched\` groups rows into chunks of 5,000 for bulk inserts; \`lru_cache\` on the merchant lookup avoids hitting the database for the same merchant twice; a \`@contextmanager\` opens the output file and writes a footer on exit. pandas' \`read_csv(chunksize=...)\` returns an iterator of DataFrames for the same reason.
**Web backends (FastAPI, Django, Flask).** Routes are registered with decorators (\`@app.get\`). Authentication, rate limiting and audit logging are decorators or dependency functions. Database sessions are context managers (\`with Session(engine) as session:\`). FastAPI dependencies that use \`yield\` are literally \`@contextmanager\`-style generators: the code before \`yield\` runs before the request, the code after runs when the response is sent. Streaming responses (\`StreamingResponse(generate_csv())\`) send gigabytes to the client from a generator without buffering.
**Testing.** \`@pytest.fixture\` turns a generator into setup/teardown: \`yield\` the resource, clean up after. \`unittest.mock.patch\` is both a decorator and a context manager. \`pytest.raises\` is a context manager that asserts an exception occurs.
**Scientific and ML code.** \`torch.no_grad()\` is a context manager that disables gradient tracking. Data loaders are iterators that yield batches. \`@torch.compile\` and \`@numba.jit\` are decorators that replace a function with an optimised version. \`@functools.cache\` memoises expensive feature computations.
**Infrastructure and scripting.** \`tempfile.TemporaryDirectory()\`, \`threading.Lock()\`, \`socket.create_connection()\` and \`zipfile.ZipFile\` are all context managers. Click and Typer build command-line interfaces from decorated functions. Retry-with-backoff decorators (tenacity) wrap every call to a flaky cloud API.
The snippet shows a compact FastAPI-style example that uses all four: a lifespan context manager, a dependency generator, a cached lookup and a streaming CSV endpoint. It is illustrative of the shape used in real services.`,
      codeSnippet: `# app.py  (illustrative FastAPI service; run with: uv run uvicorn app:app)
# pip install fastapi uvicorn   (or: uv add fastapi uvicorn)
import csv
import functools
import io
from collections.abc import Iterator
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI
from fastapi.responses import StreamingResponse

ORDERS = [
    {"id": 1, "city": "Pune", "amount": 1250.0},
    {"id": 2, "city": "Kolkata", "amount": 480.0},
    {"id": 3, "city": "Pune", "amount": 2210.0},
]

@asynccontextmanager                         # context manager for app startup/shutdown
async def lifespan(app: FastAPI):
    print("connecting to database...")      # runs before the app starts serving
    yield
    print("closing database pool...")       # runs on shutdown

app = FastAPI(lifespan=lifespan)

def get_db() -> Iterator[list[dict]]:        # dependency with yield = per-request setup/teardown
    print("open session")
    try:
        yield ORDERS
    finally:
        print("close session")

@functools.lru_cache(maxsize=256)            # memoised lookup
def city_to_state(city: str) -> str:
    return {"Pune": "Maharashtra", "Kolkata": "West Bengal"}.get(city, "Unknown")

def generate_csv(rows: list[dict]) -> Iterator[str]:   # generator feeding a streaming response
    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(["id", "city", "state", "amount"])
    yield buf.getvalue(); buf.seek(0); buf.truncate()
    for r in rows:
        writer.writerow([r["id"], r["city"], city_to_state(r["city"]), r["amount"]])
        yield buf.getvalue(); buf.seek(0); buf.truncate()

@app.get("/orders.csv")                      # decorator registers the route
def export_orders(db: list[dict] = Depends(get_db)):
    return StreamingResponse(generate_csv(db), media_type="text/csv")`
    },
    {
      heading: "14. Common Mistakes with Python Iterators, Generators, Decorators and Context Managers (and How to Fix Them)",
      content: `**1. Iterating an exhausted generator and getting nothing.** \`rows = (parse(l) for l in f)\`; \`count = sum(1 for _ in rows)\`; then \`for r in rows: ...\` runs zero times. Fix: if you need two passes, materialise with \`list()\`, or recreate the generator by calling the function again. Never rely on \`itertools.tee\` for large data; it buffers everything the slower consumer has not read.
**2. Calling the generator function and expecting it to run.** \`send_reports()\` does nothing if it contains \`yield\`; it only returns a generator object. Fix: consume it (\`for _ in send_reports(): ...\`) or restructure so side-effect code is a normal function.
**3. Late binding in generator expressions.** \`gen = (x * factor for x in data)\`; \`factor = 10\`; \`list(gen)\` uses 10, not the earlier value, because the body runs at consumption time. Only the outermost iterable (\`data\`) is evaluated immediately. Fix: consume promptly, or bind the value in a function parameter.
**4. Forgetting \`return result\` in the wrapper.** The decorated function silently returns \`None\`. Fix: always \`return func(*args, **kwargs)\`. Linters such as ruff and pylint catch this.
**5. Omitting \`functools.wraps\`.** \`help()\`, \`__name__\`, pytest test discovery and pickling all break. Fix: \`@functools.wraps(func)\` on every wrapper, \`functools.update_wrapper\` in class-based decorators.
**6. Writing \`@retry\` instead of \`@retry()\` for a factory decorator.** Python passes the function as the \`times\` argument and returns the inner decorator instead of a wrapper; the function then fails on first call with a confusing \`TypeError\`. Fix: always include parentheses for factory decorators, or write the decorator to detect being called without arguments.
**7. Caching a function with unhashable arguments or side effects.** \`@cache\` on \`f(items: list)\` raises \`TypeError\`; on \`send_sms()\` it silently stops sending after the first call. Fix: pass tuples/frozensets, cache only pure functions.
**8. \`lru_cache\` on instance methods.** The cache holds \`self\`, so instances live forever and the cache is shared across all instances. Fix: use \`cached_property\`, or cache a module-level function that takes plain data.
**9. \`@contextmanager\` without try/finally.** If the block raises, the code after \`yield\` never runs and the resource leaks. Fix: \`try: yield resource finally: cleanup()\`.
**10. Returning \`True\` from \`__exit__\` by accident.** Any truthy return suppresses the exception; writing \`return self.conn.close()\` where \`close()\` returns a truthy status swallows every error. Fix: return nothing (\`None\`) unless suppression is intentional.
**11. groupby on unsorted data.** You get the same key several times with partial groups. Fix: \`sorted(data, key=k)\` first, with the **same** key function.
**12. Raising \`StopIteration\` inside a generator.** Since Python 3.7 it becomes \`RuntimeError: generator raised StopIteration\`. Fix: use \`return\`.`,
      codeSnippet: `# common_mistakes.py
import functools

# Mistake 3: late binding in a generator expression
factor = 2
doubled = (x * factor for x in [1, 2, 3])
factor = 100
print(list(doubled))            # [100, 200, 300]  <- surprise! not [2, 4, 6]

def scale(items, factor):       # fix: capture the value as a parameter
    return (x * factor for x in items)
factor = 2
safe = scale([1, 2, 3], factor)
factor = 100
print(list(safe))               # [2, 4, 6]

# Mistake 4 and 5: missing return and missing wraps
def bad_logger(func):
    def wrapper(*args, **kwargs):
        print("calling", func.__name__)
        func(*args, **kwargs)                 # BUG: result thrown away
    return wrapper

def good_logger(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print("calling", func.__name__)
        return func(*args, **kwargs)
    return wrapper

@bad_logger
def add(a, b): return a + b
print(add(2, 3))                # calling add / None

@good_logger
def add2(a, b): return a + b
print(add2(2, 3))               # calling add2 / 5

# Mistake 6: factory decorator used without parentheses
def repeat(times=2):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*a, **kw):
            for _ in range(times):
                func(*a, **kw)
        return wrapper
    return decorator

@repeat(times=3)                # correct
def ping(): print("ping")
ping()                          # ping ping ping

# @repeat            <- WRONG: "times" would receive the function itself
# def pong(): ...     pong() -> TypeError: decorator() missing 1 required argument

# Mistake 10: an __exit__ that accidentally swallows errors
class Swallows:
    def __enter__(self): return self
    def __exit__(self, *exc): return True     # suppresses EVERYTHING - dangerous

with Swallows():
    raise ValueError("this error disappears silently")
print("you will never see the ValueError above")`
    },
    {
      heading: "15. Frequently Asked Questions about Python Iterators, Generators, Decorators and Context Managers",
      content: `**What is the difference between an iterator and an iterable in Python?**
An iterable is any object you can get an iterator from; it has an \`__iter__\` method (lists, strings, dicts, files). An iterator is the object that actually produces values; it has \`__next__\` and its \`__iter__\` returns itself. A list is iterable but not an iterator; \`iter(list)\` returns a fresh list_iterator each time, which is why lists can be looped repeatedly while iterators are single-use.
**What is the difference between yield and return in Python?**
\`return\` ends a function and sends back one value. \`yield\` pauses the function, sends back one value, and keeps the function's local state alive so it can resume on the next \`next()\` call. A function containing \`yield\` becomes a generator function, and calling it returns a generator object rather than executing the body.
**When should I use a generator instead of a list?**
Use a generator when the data is large or unbounded, produced from a stream (file, network, database cursor), consumed exactly once, or when you want early termination without computing everything. Use a list when you need \`len()\`, indexing, slicing, sorting, multiple passes or when the data is small enough that memory does not matter.
**What is the difference between a generator expression and a list comprehension?**
A list comprehension \`[f(x) for x in data]\` builds the whole list immediately. A generator expression \`(f(x) for x in data)\` builds a lazy iterator that computes each value on demand. Same syntax, different brackets, very different memory profile.
**What does functools.wraps do in a decorator?**
It copies the original function's \`__name__\`, \`__doc__\`, \`__module__\`, \`__qualname__\`, \`__annotations__\` and \`__dict__\` onto the wrapper, and sets \`wrapper.__wrapped__\` to the original. Without it the decorated function reports its name as \`wrapper\`, loses its docstring, and tools like \`help()\`, pytest and Sphinx become confused.
**What is the difference between lru_cache and cache in Python?**
\`functools.cache\` (3.9+) is an unbounded cache: it never evicts, is slightly faster and is ideal for small, bounded input spaces like recursive algorithms. \`functools.lru_cache(maxsize=128)\` keeps only the most recently used entries and evicts the oldest when full, which bounds memory for lookups with many distinct inputs.
**How do I create a context manager in Python?**
Either write a class with \`__enter__\` (setup, returns the \`as\` value) and \`__exit__(exc_type, exc_value, tb)\` (teardown, return \`False\` to propagate exceptions), or decorate a generator function with \`@contextlib.contextmanager\` and put setup before \`yield\` and cleanup in a \`finally\` after it. The generator form is shorter; the class form is clearer when the manager has several methods or reusable state.
**Can a decorator take arguments?**
Yes. Write a decorator factory: an outer function that receives the arguments and returns the real decorator. \`@retry(times=3)\` first calls \`retry(times=3)\`, gets a decorator back, and applies it to the function. Remember the parentheses even when all arguments have defaults.`
    },
    {
      heading: "16. Interview Questions and Answers on Iterators, Generators, Decorators and Context Managers",
      content: `**Q1. Explain the iteration protocol. What happens when a for loop runs?**
Python calls \`iter(obj)\` to obtain an iterator via \`__iter__\`, then repeatedly calls \`next(it)\`, which invokes \`__next__\`, until \`StopIteration\` is raised. The loop catches that exception and exits. Any object implementing these methods works with \`for\`, \`list()\`, \`sum()\`, unpacking and comprehensions.
**Q2. How does a generator save memory compared to a list?**
A list stores every element at once (8 bytes per pointer plus each object). A generator stores only its current frame: a few local variables and the instruction pointer. Values are produced one at a time on demand, so memory usage is constant regardless of how many values will be produced, and work stops as soon as the consumer stops asking.
**Q3. What does \`yield from\` do and why was it introduced?**
It delegates to a sub-iterator: all its values are yielded through, \`send()\` and \`throw()\` are forwarded, and the sub-generator's \`return\` value becomes the result of the expression. It removes the boilerplate of \`for x in sub: yield x\`, handles the forwarding correctly, and was the stepping stone to \`async\`/\`await\` (PEP 380, Python 3.3).
**Q4. Write a decorator that counts how many times a function is called.**
Either a closure with a \`nonlocal count\` variable in the wrapper, or a class with \`__call__\` that increments \`self.calls\`. In both cases use \`functools.wraps\` or \`update_wrapper\` to preserve metadata, and expose the count as an attribute on the wrapper so callers can read it.
**Q5. In what order are stacked decorators applied and executed?**
They are applied bottom-up: \`@a @b def f\` means \`f = a(b(f))\`. At call time the outermost wrapper (\`a\`) runs first, then \`b\`, then the original function, and the return path unwinds in reverse. This matters when combining caching, logging and timing decorators.
**Q6. What is memoization and what restrictions does \`lru_cache\` impose?**
Memoization caches a function's results keyed by its arguments. \`lru_cache\` requires all arguments to be hashable, treats positional and keyword forms as different keys, holds references to arguments (including \`self\` on methods), and should only wrap pure functions with no side effects. \`cache_info()\` reports hits and misses; \`cache_clear()\` resets it.
**Q7. What are the arguments to \`__exit__\` and what does its return value mean?**
\`__exit__(self, exc_type, exc_value, traceback)\` receives the exception details if the block raised, otherwise three \`None\` values. Returning a truthy value suppresses the exception; returning \`None\`/\`False\` lets it propagate after cleanup. Suppressing should be rare and deliberate.
**Q8. How does \`@contextlib.contextmanager\` work internally?**
It wraps a generator function in a class whose \`__enter__\` calls \`next()\` on the generator (running setup until the \`yield\`) and whose \`__exit__\` either calls \`next()\` again to run teardown, or uses \`gen.throw()\` to raise the block's exception at the \`yield\` so the generator's \`except\`/\`finally\` can handle it.
**Q9. Why does \`groupby\` sometimes return the same key more than once?**
Because \`itertools.groupby\` groups only consecutive items with equal keys; it does not sort. If the input is not sorted by the same key, each run of equal keys becomes a separate group. Sort first with the same key function.
**Q10. How would you process a 50 GB log file on a machine with 8 GB RAM?**
Stream it: iterate the file object line by line (files are lazy iterators), chain generator functions for parsing and filtering, aggregate with running totals or \`collections.Counter\`, and use \`itertools.islice\`/\`batched\` to chunk work. Never call \`read()\` or \`readlines()\`; memory stays at a few megabytes regardless of file size.`
    },
    {
      heading: "17. Hands-On Exercise: Build a Lazy Log Analyser with Generators, Decorators and Context Managers",
      content: `Build a complete command-line tool that analyses a web-server access log using everything from this lecture. The program must:
1. Generate a sample log of 20,000 requests inside a temporary directory using a custom \`@contextmanager\` called \`sample_log\` that deletes the file afterwards (even on error).
2. Read the file lazily with a generator pipeline: \`read_lines\` -> \`parse_entries\` -> \`only_status(5xx)\`. No stage may load the whole file into memory.
3. Use \`@functools.lru_cache\` on \`classify_endpoint\` to avoid re-parsing repeated URL patterns, and print \`cache_info()\` at the end to prove it helped.
4. Decorate the analysis functions with a \`@timed(label)\` decorator **with arguments** that uses \`functools.wraps\`.
5. Use \`itertools\` (\`batched\`, \`groupby\`, \`islice\`, \`accumulate\`) to compute: errors per endpoint, the top 3 slowest requests, and a running count of errors in batches of 1,000 lines.
6. Wrap the entire run in a \`Timer\` class-based context manager.
Run it with \`python log_analyser.py\`. Expected output (numbers vary because the data is random): the batch-by-batch running error count, a table of 5xx errors per endpoint category, the three slowest requests, the cache statistics showing far more hits than misses, and the total elapsed time. As an extension, add a \`--path\` argument with \`argparse\` to analyse a real Nginx log, and a \`@retry\` decorator around a function that uploads the summary to an API.`,
      codeSnippet: `# log_analyser.py
"""Lazy log analyser: generators + itertools + decorators + context managers."""
from __future__ import annotations

import functools
import random
import tempfile
import time
from collections import Counter
from collections.abc import Iterable, Iterator
from contextlib import contextmanager
from itertools import accumulate, batched, groupby, islice
from pathlib import Path

ENDPOINTS = ["/api/orders", "/api/orders/42", "/api/users/7", "/api/payments",
             "/api/payments/verify", "/static/logo.png", "/health"]
STATUSES = [200] * 85 + [404] * 5 + [500] * 6 + [502] * 2 + [503] * 2

# ---------- decorators ----------
def timed(label: str):
    """Decorator WITH arguments: prints how long the call took."""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            start = time.perf_counter()
            result = func(*args, **kwargs)
            print(f"[timed] {label}: {(time.perf_counter() - start) * 1000:.1f} ms")
            return result
        return wrapper
    return decorator

@functools.lru_cache(maxsize=256)
def classify_endpoint(path: str) -> str:
    """Collapse /api/orders/42 -> /api/orders/{id}. Cached because paths repeat."""
    parts = path.strip("/").split("/")
    return "/" + "/".join("{id}" if p.isdigit() else p for p in parts)

# ---------- context managers ----------
class Timer:
    def __init__(self, label: str): self.label = label
    def __enter__(self):
        self.start = time.perf_counter(); return self
    def __exit__(self, exc_type, exc, tb):
        print(f"[Timer] {self.label}: {time.perf_counter() - self.start:.3f} s")
        return False

@contextmanager
def sample_log(n_lines: int) -> Iterator[Path]:
    """Write a random access log to a temp dir; always delete it afterwards."""
    tmpdir = Path(tempfile.mkdtemp())
    path = tmpdir / "access.log"
    random.seed(42)
    with path.open("w", encoding="utf-8") as f:
        for i in range(n_lines):
            ms = random.randint(5, 900) if random.random() > 0.02 else random.randint(2000, 9000)
            f.write(f"2026-10-09T10:{i // 60000:02d}:{(i // 1000) % 60:02d} "
                    f"{random.choice(ENDPOINTS)} {random.choice(STATUSES)} {ms}\\n")
    try:
        yield path
    finally:
        path.unlink(missing_ok=True)
        tmpdir.rmdir()
        print("[sample_log] temp log deleted")

# ---------- generator pipeline ----------
def read_lines(path: Path) -> Iterator[str]:
    with path.open(encoding="utf-8") as f:       # file is itself a lazy iterator
        for line in f:
            yield line.rstrip("\\n")

def parse_entries(lines: Iterable[str]) -> Iterator[dict]:
    for line in lines:
        ts, path, status, ms = line.split()
        yield {"ts": ts, "path": path, "status": int(status), "ms": int(ms)}

def only_status(entries: Iterable[dict], low: int, high: int) -> Iterator[dict]:
    return (e for e in entries if low <= e["status"] <= high)

# ---------- analyses ----------
@timed("running error count per 1000 lines")
def running_errors(path: Path) -> list[int]:
    per_batch = (sum(1 for e in batch if e["status"] >= 500)
                 for batch in batched(parse_entries(read_lines(path)), 1000))
    return list(accumulate(per_batch))

@timed("5xx errors per endpoint")
def errors_per_endpoint(path: Path) -> list[tuple[str, int]]:
    errors = only_status(parse_entries(read_lines(path)), 500, 599)
    keyed = sorted(((classify_endpoint(e["path"]), e) for e in errors), key=lambda t: t[0])
    return [(ep, sum(1 for _ in grp)) for ep, grp in groupby(keyed, key=lambda t: t[0])]

@timed("top 3 slowest requests")
def slowest(path: Path, n: int = 3) -> list[dict]:
    # keep only a small sorted window instead of sorting the whole file
    top: list[dict] = []
    for e in parse_entries(read_lines(path)):
        top.append(e)
        top.sort(key=lambda e: -e["ms"])
        del top[n:]
    return top

def main() -> None:
    with Timer("whole analysis"), sample_log(20_000) as log_path:
        running = running_errors(log_path)
        print("  running 5xx count:", running[:5], "...", running[-1])

        print("  5xx errors by endpoint:")
        for endpoint, count in errors_per_endpoint(log_path):
            print(f"    {endpoint:<24} {count:>5}")

        print("  slowest requests:")
        for e in slowest(log_path):
            print(f"    {e['ts']}  {e['path']:<22} {e['status']}  {e['ms']} ms")

        print("  first 2 entries (islice on a generator):",
              list(islice(parse_entries(read_lines(log_path)), 2)))
        print("  status mix:", Counter(e["status"] for e in parse_entries(read_lines(log_path))).most_common(3))
        print("  classify_endpoint cache:", classify_endpoint.cache_info())

if __name__ == "__main__":
    main()

# Expected shape of output (values vary):
# [timed] running error count per 1000 lines: 45.2 ms
#   running 5xx count: [103, 201, 304, 398, 497] ... 2010
# [timed] 5xx errors per endpoint: 31.8 ms
#   5xx errors by endpoint:
#     /api/orders                286
#     /api/orders/{id}           301
#     ...
# [timed] top 3 slowest requests: 38.0 ms
#   slowest requests:
#     2026-10-09T10:00:12  /api/payments          200  8997 ms
#     ...
#   classify_endpoint cache: CacheInfo(hits=2003, misses=7, maxsize=256, currsize=7)
# [sample_log] temp log deleted
# [Timer] whole analysis: 0.210 s`
    },
    {
      heading: "18. Summary",
      content: `• The **iteration protocol** is two methods: \`__iter__\` returns an iterator, \`__next__\` returns the next value or raises \`StopIteration\`. A \`for\` loop is \`iter()\` plus repeated \`next()\`.
• An **iterable** can be looped over many times; an **iterator** is a one-shot stream with state. Files, \`zip\`, \`map\` and generators are iterators.
• A **generator function** contains \`yield\`; calling it returns a lazy generator object. \`send()\`, \`throw()\`, \`close()\` and \`yield from\` turn generators into coroutines and delegating pipelines.
• **Generator expressions** \`(f(x) for x in data)\` compute on demand and use constant memory; list comprehensions build everything up front. Choose generators for large, streamed or once-only data.
• **itertools** provides fast building blocks: \`count\`, \`cycle\`, \`chain\`, \`islice\`, \`accumulate\`, \`groupby\` (sort first), \`pairwise\` (3.10), \`batched\` (3.12), \`product\`, \`combinations\`.
• A **decorator** is a function that takes a function and returns a wrapper; \`@dec\` is \`f = dec(f)\`. Always use \`functools.wraps\` and always return the wrapped result. Decorators with arguments are factories that return decorators; stacked decorators apply bottom-up.
• \`functools.lru_cache\` and \`functools.cache\` (3.9+) memoise pure functions with hashable arguments; \`cached_property\` caches per-instance attributes. Inspect with \`cache_info()\`, reset with \`cache_clear()\`.
• A **context manager** implements \`__enter__\` and \`__exit__\`; \`__exit__\` always runs and returns \`False\` to propagate exceptions. \`@contextlib.contextmanager\` builds one from a generator with \`try: yield finally: cleanup\`. Know \`suppress\`, \`closing\`, \`nullcontext\`, \`redirect_stdout\` and \`ExitStack\`.
• In production these combine constantly: streaming ETL pipelines, FastAPI dependencies and lifespans, pytest fixtures, database transactions and retry/caching layers.
**Next lecture:** Type Hints, Dataclasses, Pydantic & Writing Clean Python`
    }
  ]
};
