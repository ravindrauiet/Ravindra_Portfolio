export const lecture05 = {
  slug: "lecture-5",
  number: 5,
  title: "Complete Python Course — Lecture 5: Data Structures — Lists, Tuples, Dictionaries, Sets & collections",
  summary: "Master Python data structures: lists and list methods, shallow vs deep copy, tuples and unpacking, dictionaries and dict ordering, sets and set operations, time complexity basics, and the collections module (Counter, defaultdict, deque, namedtuple) plus heapq and bisect with real examples.",
  readTime: "60 min read",
  difficulty: "Beginner",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. What Are Python Data Structures and Why They Matter",
      content: `A **data structure** is a way of organising data in memory so that a program can store, find and update it efficiently. Every real program is built on them: a food-delivery app keeps the cart as a list, the restaurant menu as a dictionary, the set of pin codes it serves as a set, and the GPS coordinates of a rider as a tuple. Pick the right structure and your code is short, readable and fast. Pick the wrong one and a feature that should take milliseconds takes minutes once real data arrives.
Python ships four **built-in** container types that you will use every single day:
• **list** — an ordered, mutable sequence. Think of a shopping list you can add to, reorder and cross items off.
• **tuple** — an ordered, immutable sequence. A fixed record such as (latitude, longitude) or (name, roll_number).
• **dict** — a mapping from unique keys to values, ordered by insertion since Python 3.7. The shape of every JSON response and every config file.
• **set** — an unordered collection of unique, hashable items with mathematical set operations (union, intersection, difference).
On top of these, the standard library's \`collections\` module adds specialised containers — \`Counter\`, \`defaultdict\`, \`deque\` and \`namedtuple\` — and the \`heapq\` and \`bisect\` modules give you priority queues and binary search without installing anything.
This lecture builds on Lecture 4 (functions, scope, lambdas and closures) — we will use lambdas as \`key=\` functions constantly. Everything here runs on Python 3.10 and newer; Python 3.14 is the current stable series as this is written (October 2026), with 3.15 arriving in the same month, and features introduced in a specific version are labelled. By the end you will know not just the syntax of each structure but **why** it behaves the way it does, **how fast** each operation is, and **which one to choose** in an interview or a production codebase.`
    },
    {
      heading: "2. Python Lists: Creation, Indexing, Slicing and List Methods",
      content: `A **list** is Python's workhorse sequence: ordered, mutable (changeable in place), allows duplicates, and can hold any type of object. Internally CPython stores a list as a dynamic array of pointers, which is why indexing by position is instant and why appending at the end is cheap but inserting at the front is not (more on that in Section 9).
You create a list with square brackets, \`list()\` on any iterable, or a list comprehension. Indexing starts at **0**; negative indexes count from the end, so \`cities[-1]\` is the last item. **Slicing** \`cities[start:stop:step]\` returns a **new list** containing items from \`start\` up to but **not including** \`stop\`. Slices never raise IndexError even if the bounds are too large, which makes them safe for "first N items" logic.
The list methods you must know:
• \`append(x)\` — add one item at the end. \`extend(iterable)\` — add every item from another iterable. Beginners confuse these: \`append([1, 2])\` adds one nested list; \`extend([1, 2])\` adds two numbers.
• \`insert(i, x)\` — insert before index \`i\`.
• \`remove(x)\` — delete the **first** matching value; raises \`ValueError\` if absent. \`pop(i=-1)\` — delete and **return** the item at index \`i\` (last by default). \`clear()\` — empty the list.
• \`index(x)\` and \`count(x)\` — search; \`in\` checks membership.
• \`sort()\`, \`reverse()\`, \`copy()\` — covered in the next two sections.
Slices can also be targets of assignment and \`del\`, which lets you replace or delete a whole range in one statement. Lists may mix types, but in production code keep each list **homogeneous** (all the same kind of thing) and reach for a tuple, dataclass or dict when you need a record with different fields.`,
      codeSnippet: `# lists_basics.py
cities = ["Mumbai", "Delhi", "Bengaluru", "Chennai"]
print(cities[0], cities[-1])          # Mumbai Chennai
print(cities[1:3])                    # ['Delhi', 'Bengaluru']
print(cities[::-1])                   # ['Chennai', 'Bengaluru', 'Delhi', 'Mumbai'] (reversed copy)
print(cities[:100])                   # safe: whole list, no IndexError

cities.append("Hyderabad")            # add at the end
cities.insert(1, "Pune")              # add before index 1
cities.extend(["Kolkata", "Jaipur"])  # add many items
print(cities)
# ['Mumbai', 'Pune', 'Delhi', 'Bengaluru', 'Chennai', 'Hyderabad', 'Kolkata', 'Jaipur']

cities.remove("Delhi")                # remove by value (first match only)
last = cities.pop()                   # remove and return the last item -> 'Jaipur'
second = cities.pop(1)                # remove and return index 1 -> 'Pune'
print(last, second)                   # Jaipur Pune

print(cities.index("Chennai"))        # 2
print(cities.count("Mumbai"))         # 1
print("Pune" in cities)               # False
print(len(cities))                    # 5

# append vs extend
basket = [1, 2]
basket.append([3, 4])                 # [1, 2, [3, 4]]  -> one nested item
basket.extend([5, 6])                 # [1, 2, [3, 4], 5, 6]
print(basket)

# Slice assignment and deletion
nums = [10, 20, 30, 40, 50]
nums[1:3] = [21, 31, 41]              # replace 2 items with 3
del nums[0]
print(nums)                           # [21, 31, 41, 40, 50]

# Building lists: comprehension (preferred) vs loop
squares = [n * n for n in range(1, 6)]
print(squares)                        # [1, 4, 9, 16, 25]`
    },
    {
      heading: "3. Sorting, Searching and Iterating Lists the Pythonic Way",
      content: `Sorting comes up in every data task — ranking students, ordering transactions by amount, showing the newest post first. Python gives you two tools and the difference matters: \`list.sort()\` sorts the list **in place** and returns \`None\`, while the built-in \`sorted(iterable)\` returns a **new sorted list** and works on any iterable (tuples, sets, dict keys, generators). Writing \`data = data.sort()\` silently sets \`data\` to \`None\` — one of the most common beginner bugs.
Both accept two keyword arguments. \`reverse=True\` sorts descending. \`key=function\` tells Python what to compare: pass \`len\` to sort strings by length, \`str.lower\` for case-insensitive order, or a \`lambda\` (from Lecture 4) to pull out one field of a tuple or dict. The key function is called **once per item**, so it is efficient.
Python's sort algorithm is **Timsort**, which is **stable**: items that compare equal keep their original relative order. Stability is what lets you sort by a secondary key first and the primary key second to get "marks descending, then name ascending" — or, more simply, return a tuple from the key function.
Other everyday helpers: \`min()\` and \`max()\` accept the same \`key=\`; \`reversed(seq)\` iterates backwards without copying; \`enumerate(seq, start=1)\` gives you index and value together instead of the C-style \`for i in range(len(seq))\`; \`zip(a, b)\` walks two lists in parallel and \`zip(a, b, strict=True)\` (Python 3.10+) raises if their lengths differ, catching data-alignment bugs early.`,
      codeSnippet: `# sorting_lists.py
marks = [78, 92, 65, 88, 92, 71]

sorted_marks = sorted(marks)            # returns a NEW list
print(sorted_marks)                     # [65, 71, 78, 88, 92, 92]
print(marks)                            # [78, 92, 65, 88, 92, 71]  -> original unchanged

marks.sort(reverse=True)                # in place, returns None
print(marks)                            # [92, 92, 88, 78, 71, 65]

students = [("Aarav", 88), ("Diya", 92), ("Kabir", 88), ("Meera", 75)]
# Marks descending, ties broken by name ascending, in a single key:
students.sort(key=lambda s: (-s[1], s[0]))
print(students)
# [('Diya', 92), ('Aarav', 88), ('Kabir', 88), ('Meera', 75)]

words = ["banana", "apple", "Cherry"]
print(sorted(words))                    # ['Cherry', 'apple', 'banana'] -> uppercase sorts first
print(sorted(words, key=str.lower))     # ['apple', 'banana', 'Cherry']
print(sorted(words, key=len))           # ['apple', 'banana', 'Cherry'] -> stable for equal lengths

topper = max(students, key=lambda s: s[1])
print(topper)                           # ('Diya', 92)

for rank, (name, score) in enumerate(students, start=1):
    print(f"{rank}. {name:<6} {score}")

names = ["Aarav", "Diya"]
cities = ["Pune", "Delhi"]
for name, city in zip(names, cities, strict=True):   # Python 3.10+
    print(name, "lives in", city)`
    },
    {
      heading: "4. Copying Lists: Shallow Copy vs Deep Copy",
      content: `Assignment in Python **never copies data** — it binds a name to an object. After \`b = a\`, both names refer to the **same** list, so changes made through \`b\` show up in \`a\`. This surprises people coming from languages where assignment copies values, and it is the root cause of a huge number of "my data changed by itself" bugs.
To get an independent list you need a **shallow copy**: \`a.copy()\`, \`a[:]\` or \`list(a)\` all produce a new outer list with the **same element objects** inside. For a list of numbers or strings (which are immutable) that is all you need. But if the list contains **mutable** objects — inner lists, dicts, custom objects — the copy and the original still **share** those inner objects. Modify \`shallow[0].append(...)\` and the original's first inner list changes too, because there is only one inner list.
A **deep copy** (\`copy.deepcopy(a)\`) recursively copies every nested object, giving you a fully independent structure. It is slower and uses more memory, so use it only when you genuinely need to mutate a nested structure without affecting the original — for example, generating "what-if" scenarios from a config, or snapshotting game state. \`deepcopy\` handles cycles correctly and you can customise it on your own classes with \`__deepcopy__\`.
The same rules apply to dicts (\`d.copy()\` is shallow) and to the \`*\` operator: \`[[0] * 3] * 3\` builds **three references to one inner list**, not a 3x3 grid. Use a comprehension so each row is created fresh. Python 3.13 also added \`copy.replace(obj, **changes)\` for making a modified copy of immutable records such as namedtuples and dataclasses.`,
      codeSnippet: `# copying.py
import copy

a = [1, 2, 3]
b = a                            # NOT a copy: both names point to the same list
b.append(4)
print(a)                         # [1, 2, 3, 4]
print(a is b)                    # True

# Shallow copies: three equivalent ways
c = a.copy()
d = a[:]
e = list(a)
c.append(99)
print(a, c)                      # [1, 2, 3, 4] [1, 2, 3, 4, 99]
print(a == c, a is c)            # False False

# The trap: nested objects are still shared
matrix = [[1, 2], [3, 4]]
shallow = matrix.copy()
shallow[0].append(100)
print(matrix)                    # [[1, 2, 100], [3, 4]]  <- original changed!
print(matrix[0] is shallow[0])   # True: same inner list

deep = copy.deepcopy(matrix)
deep[1].append(200)
print(matrix)                    # [[1, 2, 100], [3, 4]]       <- safe
print(deep)                      # [[1, 2, 100], [3, 4, 200]]

# Classic bug: multiplying a nested list
grid = [[0] * 3] * 3             # three references to the SAME inner list
grid[0][0] = 1
print(grid)                      # [[1, 0, 0], [1, 0, 0], [1, 0, 0]]

grid = [[0] * 3 for _ in range(3)]   # correct: a fresh inner list each time
grid[0][0] = 1
print(grid)                      # [[1, 0, 0], [0, 0, 0], [0, 0, 0]]`
    },
    {
      heading: "5. Tuples and Tuple Unpacking in Python",
      content: `A **tuple** is an ordered sequence like a list, but **immutable**: once created you cannot add, remove or replace items. That restriction is a feature. It tells readers "this is a fixed record", it lets Python allocate tuples more compactly than lists (an empty tuple is 40 bytes versus 56 for an empty list on 64-bit CPython), and most importantly it makes tuples **hashable** when their contents are hashable, so they can be dictionary keys and set members. A list can never be a dict key.
Tuples are written with commas — the parentheses are optional except for the empty tuple. The classic gotcha is the single-element tuple: \`(42)\` is just the integer 42, while \`(42,)\` is a tuple. \`x = 1, 2, 3\` is **tuple packing**.
**Unpacking** is the reverse: \`lat, lon = point\` assigns each element to a name, and the count must match or you get a \`ValueError\`. Unpacking powers several idioms you will see everywhere: swapping variables with \`a, b = b, a\`, returning multiple values from a function (the function really returns one tuple), looping over \`dict.items()\` with \`for key, value in ...\`, and unpacking inside \`enumerate\` and \`zip\` loops. **Extended unpacking** with a star (\`first, *rest = items\`, PEP 3132) collects the leftover items into a list, which is perfect for "head and tail" processing of command-line arguments or CSV rows.
Immutability is **shallow**: a tuple holding a list cannot be reassigned at that position, but the list inside can still be mutated. If you want a tuple with named fields instead of positions, use \`namedtuple\` or \`typing.NamedTuple\` (Section 11), and when you need a mutable record with defaults and methods, reach for a \`dataclass\` (next lecture, OOP).`,
      codeSnippet: `# tuples.py
point = (19.07, 72.87)            # Mumbai: latitude, longitude
single = (42,)                    # trailing comma makes a 1-tuple
not_a_tuple = (42)                # just the int 42
packed = 1, 2, 3                  # parentheses optional: tuple packing
print(type(single), type(not_a_tuple), packed)   # <class 'tuple'> <class 'int'> (1, 2, 3)

lat, lon = point                  # unpacking
print(lat, lon)                   # 19.07 72.87

# Swap without a temp variable
a, b = 10, 20
a, b = b, a
print(a, b)                       # 20 10

# Extended unpacking (PEP 3132)
first, *middle, last = [1, 2, 3, 4, 5]
print(first, middle, last)        # 1 [2, 3, 4] 5

head, *rest = "Ravindra Nath Jha".split()
print(head, rest)                 # Ravindra ['Nath', 'Jha']

# Functions returning several values really return one tuple
def min_max(values):
    return min(values), max(values)

lo, hi = min_max([34, 7, 89, 12])
print(lo, hi)                     # 7 89

# Tuples are hashable -> usable as dict keys and set members
pin_codes = {("Mumbai", "Maharashtra"): 400001, ("Patna", "Bihar"): 800001}
print(pin_codes[("Patna", "Bihar")])   # 800001

# Immutable container, but mutable contents can still change
record = ("Aarav", [88, 92])
record[1].append(75)
print(record)                     # ('Aarav', [88, 92, 75])
# record[0] = "Diya"  -> TypeError: 'tuple' object does not support item assignment

print(point.count(19.07), point.index(72.87))   # 1 1`
    },
    {
      heading: "6. Python Dictionaries: Creation, Access and Dict Methods",
      content: `A **dictionary** maps unique, hashable **keys** to arbitrary **values**. It is implemented as a hash table, so looking up, inserting or deleting by key takes constant time on average regardless of size — a dict with ten million entries answers \`d["key"]\` as fast as one with ten. That property makes dicts the backbone of caches, indexes, JSON handling, configuration and almost every Python object (instance attributes live in a dict).
Keys are usually strings, numbers or tuples; they must be **immutable and hashable**, so lists and dicts cannot be keys. Values can be anything, including other dicts and lists, which is how nested JSON from an API maps directly onto Python.
Access patterns, from strict to lenient: \`d[key]\` raises \`KeyError\` if the key is missing — good when a missing key is a bug. \`d.get(key, default)\` returns \`None\` or your default instead — good for optional fields. \`d.setdefault(key, default)\` returns the existing value or **inserts** the default and returns it, which turns "create the list if absent, then append" into one line. The \`in\` operator checks **keys only**; to test for a value use \`value in d.values()\`.
Essential methods: \`keys()\`, \`values()\` and \`items()\` return **live views** that reflect later changes to the dict; \`pop(key, default)\` removes and returns; \`popitem()\` removes the last inserted pair; \`update(other, **kwargs)\` merges in place; \`dict.fromkeys(iterable, value)\` initialises many keys with one value; \`clear()\` empties. **Dict comprehensions** \`{k: v for ...}\` build dicts from any iterable in one readable expression.`,
      codeSnippet: `# dict_basics.py
student = {"name": "Diya", "roll": 17, "marks": [88, 92, 79]}
print(student["name"])                 # Diya
print(student.get("email"))            # None (no KeyError)
print(student.get("email", "n/a"))     # n/a
# print(student["email"])              # KeyError: 'email'

student["city"] = "Jaipur"             # add a key
student["roll"] = 18                   # update a value
del student["marks"]                   # delete a key
print(student)                         # {'name': 'Diya', 'roll': 18, 'city': 'Jaipur'}

# Membership checks keys, not values
print("city" in student)               # True
print("Jaipur" in student)             # False
print("Jaipur" in student.values())    # True

# items() for key/value loops
for key, value in student.items():
    print(f"{key} -> {value}")

# setdefault: fetch the value, inserting a default if missing
groups = {}
groups.setdefault("A", []).append("Aarav")
groups.setdefault("A", []).append("Diya")
groups.setdefault("B", []).append("Kabir")
print(groups)                          # {'A': ['Aarav', 'Diya'], 'B': ['Kabir']}

# pop with default, update, fromkeys, comprehension
age = student.pop("age", 0)            # 0, no error
student.update({"email": "diya@example.com"}, phone="98xxxxxxxx")
attendance = dict.fromkeys(["Mon", "Tue", "Wed"], 0)   # {'Mon': 0, 'Tue': 0, 'Wed': 0}
squares = {n: n * n for n in range(1, 6)}
print(squares)                         # {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}

# Nested data: the shape of most JSON APIs
order = {
    "id": "ORD-1024",
    "items": [{"sku": "TSHIRT-M", "qty": 2, "price": 499.0}],
    "customer": {"name": "Kabir", "city": "Bengaluru"},
}
print(order["customer"]["city"])       # Bengaluru
total = sum(i["qty"] * i["price"] for i in order["items"])
print(f"Total: Rs {total:,.2f}")       # Total: Rs 998.00`
    },
    {
      heading: "7. Dict Ordering, Merging and Iteration Patterns",
      content: `Older tutorials say "dictionaries are unordered". That has not been true for years: since **Python 3.7** the language guarantees that a dict remembers **insertion order** (CPython 3.6 already behaved this way as an implementation detail). Iterating, printing, \`list(d)\`, \`json.dumps\` — all follow the order in which keys were first added. Updating the value of an existing key does **not** move it; deleting and re-inserting does. \`popitem()\` therefore removes the **most recently inserted** pair (LIFO), and since Python 3.8 \`reversed(d)\` iterates from newest to oldest.
Because of this guarantee, \`collections.OrderedDict\` is rarely needed any more. It still offers \`move_to_end(key)\` and order-sensitive equality, which is why it remains useful for hand-rolled LRU caches.
Dicts do not have a "sort" method; you sort the **items** and rebuild: \`dict(sorted(d.items(), key=lambda kv: kv[1]))\`. This is how you produce leaderboards, "top categories" reports and the like.
**Merging** two dicts: Python 3.9 added the union operators \`d1 | d2\` (new dict) and \`d1 |= d2\` (in place) from PEP 584. When both sides have a key, the **right-hand value wins**, which maps perfectly onto "defaults overridden by user settings". The older \`{**d1, **d2}\` (3.5+) and \`d1.update(d2)\` still work and you will see them in existing code.
The \`keys()\` and \`items()\` views support **set operations** (\`&\`, \`|\`, \`-\`), handy for "which keys changed between two config versions". Finally, never add or delete keys **while iterating** over a dict — Python raises \`RuntimeError: dictionary changed size during iteration\`. Iterate over a snapshot (\`list(d)\`) or build a new dict with a comprehension.`,
      codeSnippet: `# dict_ordering.py
prices = {"tea": 10, "coffee": 20, "samosa": 15}
prices["lassi"] = 30
print(list(prices))                   # ['tea', 'coffee', 'samosa', 'lassi'] -> insertion order kept

prices["tea"] = 12                    # updating a value does NOT move the key
print(list(prices))                   # ['tea', 'coffee', 'samosa', 'lassi']

del prices["tea"]
prices["tea"] = 12                    # delete + re-insert moves it to the end
print(list(prices))                   # ['coffee', 'samosa', 'lassi', 'tea']

print(prices.popitem())               # ('tea', 12) -> removes the LAST inserted pair
print(list(reversed(prices)))         # ['lassi', 'samosa', 'coffee']  (Python 3.8+)

# Sorting a dict by value (builds a new dict)
by_price = dict(sorted(prices.items(), key=lambda kv: kv[1], reverse=True))
print(by_price)                       # {'lassi': 30, 'coffee': 20, 'samosa': 15}

# Merging (Python 3.9+, PEP 584): right side wins on duplicate keys
defaults = {"theme": "light", "lang": "en", "page_size": 20}
user = {"theme": "dark", "page_size": 50}
settings = defaults | user
print(settings)                       # {'theme': 'dark', 'lang': 'en', 'page_size': 50}
defaults |= {"lang": "hi"}            # in-place update
# Older equivalents: {**defaults, **user}  or  defaults.update(user)

# Dict views behave like sets
old = {"x": 1, "y": 2, "z": 3}
new = {"y": 20, "z": 30, "w": 40}
print(sorted(old.keys() & new.keys()))        # ['y', 'z']  -> keys in both
print(sorted(old.keys() - new.keys()))        # ['x']       -> removed keys
changed = {k for k in old.keys() & new.keys() if old[k] != new[k]}
print(sorted(changed))                        # ['y', 'z']  -> keys whose value changed

# Never change size while iterating
scores = {"a": 1, "b": 0, "c": 3}
for k in list(scores):                # iterate over a snapshot copy
    if scores[k] == 0:
        del scores[k]
print(scores)                         # {'a': 1, 'c': 3}
# Or: scores = {k: v for k, v in scores.items() if v != 0}`
    },
    {
      heading: "8. Python Sets and Set Operations",
      content: `A **set** is an unordered collection of **unique** elements backed by a hash table, just like dict keys without values. Two things follow: membership tests (\`x in s\`) are constant time on average, and duplicates are impossible — adding an element that already exists does nothing. That makes sets the natural tool for deduplication, tagging, permissions, "have I seen this before?" checks and any problem that involves comparing groups of things.
Create one with curly braces \`{1, 2, 3}\` or \`set(iterable)\`. Note that \`{}\` creates an **empty dict**, so an empty set must be written \`set()\`. Elements must be hashable: numbers, strings, tuples and frozensets are fine; lists, dicts and sets are not. Sets are mutable (\`add\`, \`remove\`, \`discard\`, \`pop\`, \`clear\`), and the difference between \`remove\` (raises \`KeyError\` if missing) and \`discard\` (silent) matters in cleanup code.
The real power is in **set algebra**, available both as operators and as methods:
• **Union** \`a | b\` / \`a.union(b)\` — everything in either.
• **Intersection** \`a & b\` / \`a.intersection(b)\` — only items in both.
• **Difference** \`a - b\` / \`a.difference(b)\` — in \`a\` but not in \`b\`.
• **Symmetric difference** \`a ^ b\` — in exactly one of them.
• **Comparisons** \`a <= b\` (subset), \`a >= b\` (superset), \`a.isdisjoint(b)\`.
The operator forms require both operands to be sets; the method forms accept any iterable. Each has an in-place variant (\`|=\`, \`&=\`, \`-=\`, \`^=\`). A **frozenset** is an immutable set that can itself be a dict key or an element of another set.
Because sets are unordered, you cannot index them and their printed order is arbitrary. If you need to remove duplicates **while keeping the original order**, use \`list(dict.fromkeys(items))\`, which relies on dict insertion order.`,
      codeSnippet: `# sets.py
skills = {"python", "sql", "git", "python"}
print(len(skills))                    # 3 -> duplicates removed
print(sorted(skills))                 # ['git', 'python', 'sql'] (sets have no order; sort to print)

empty = set()                         # NOT {} -- that is an empty dict
from_list = set([3, 1, 2, 3, 1])      # {1, 2, 3}

skills.add("docker")
skills.discard("cobol")               # no error if missing
skills.remove("git")                  # KeyError if missing
print("python" in skills)             # True, O(1) on average

backend = {"python", "sql", "docker", "redis"}
data = {"python", "sql", "pandas", "excel"}

print(sorted(backend | data))         # union: ['docker', 'excel', 'pandas', 'python', 'redis', 'sql']
print(sorted(backend & data))         # intersection: ['python', 'sql']
print(sorted(backend - data))         # difference: ['docker', 'redis']
print(sorted(backend ^ data))         # symmetric difference: ['docker', 'excel', 'pandas', 'redis']
print({"python"} <= backend)          # subset -> True
print(backend.isdisjoint({"java"}))   # True

# Method forms accept any iterable; operators need sets on both sides
print(sorted(backend.union(["go", "rust"])))

# In-place variants
backend |= {"kafka"}
backend &= data                       # keep only the skills common to both
print(backend)                        # {'python', 'sql'} (order may vary)

# Elements must be hashable
# {[1, 2]}  -> TypeError: unhashable type: 'list'
coords = {(19.07, 72.87), (28.61, 77.20)}   # tuples are fine

# frozenset: immutable set, usable as a dict key
combo_price = {frozenset({"samosa", "chai"}): 25, frozenset({"vada", "chai"}): 30}
print(combo_price[frozenset({"chai", "samosa"})])   # 25 -> order inside does not matter

# Deduplicate while preserving original order
emails = ["a@x.com", "b@x.com", "a@x.com", "c@x.com"]
unique = list(dict.fromkeys(emails))
print(unique)                         # ['a@x.com', 'b@x.com', 'c@x.com']`
    },
    {
      heading: "9. Choosing the Right Data Structure and Time Complexity Basics",
      content: `Knowing **how long an operation takes as data grows** is what separates code that works on 100 rows from code that works on 10 million. We describe this with **Big-O notation**: O(1) means constant time regardless of size, O(log n) grows very slowly (binary search), O(n) grows in proportion to the size (scanning every item), and O(n log n) is the cost of a good sort. Here are the costs that matter for Python's containers (average case):
• **list** — index \`a[i]\`, \`append\`, \`pop()\` from the end: **O(1)**. \`insert(0, x)\`, \`pop(0)\`, \`remove\`, \`in\`, \`index\`: **O(n)** because every element after the position must be shifted or scanned. \`sort\`: O(n log n). Slicing a list of k items: O(k).
• **tuple** — same as list for reading; no mutation.
• **dict** — get, set, delete, \`in\` by key: **O(1)** average, O(n) only in pathological hash-collision cases. Iteration: O(n).
• **set** — add, remove, \`in\`: **O(1)** average. Union/intersection: O(len(a) + len(b)).
• **deque** — \`append\`, \`appendleft\`, \`pop\`, \`popleft\`: **O(1)**; indexing in the middle: O(n).
• **heapq** — push and pop: **O(log n)**; \`heapify\`: O(n); peek smallest \`h[0]\`: O(1).
• **bisect** — search in a sorted list: **O(log n)**; \`insort\` is O(n) because of the list shift.
Decision guide:
• Need **order and position**, duplicates allowed, mostly appending? — **list**.
• A fixed **record** or a value you want as a dict key? — **tuple** (or \`NamedTuple\` / \`dataclass\`).
• **Look things up by a key**, group, count or cache? — **dict** (or \`defaultdict\` / \`Counter\`).
• **Uniqueness** or fast membership, or comparing groups? — **set**.
• A **queue** processed from the front, or a sliding window of the last N items? — **deque**, never \`list.pop(0)\`.
• Repeatedly need the **smallest / highest-priority** item? — **heapq**.
• Repeated searches in data that is **already sorted**? — **bisect**.
The single most common performance fix in Python is replacing \`x in some_list\` inside a loop with a set. The demo below shows why: membership in a 100,000-element list is thousands of times slower than in a set of the same data.`,
      codeSnippet: `# complexity_demo.py
import timeit
from collections import deque

n = 100_000
numbers_list = list(range(n))
numbers_set = set(numbers_list)
target = n - 1                                   # worst case for the list: last element

list_time = timeit.timeit(lambda: target in numbers_list, number=1_000)
set_time = timeit.timeit(lambda: target in numbers_set, number=1_000)
print(f"list membership x1000: {list_time:.3f}s")   # roughly 0.5 - 1.5 s  (O(n) each)
print(f"set  membership x1000: {set_time:.6f}s")    # roughly 0.0001 s     (O(1) each)
print(f"set is ~{list_time / set_time:,.0f}x faster")

# Removing from the front: list.pop(0) shifts every element, deque.popleft() does not
as_list = list(range(n))
as_deque = deque(range(n))
print(timeit.timeit(lambda: as_list.pop(0), number=10_000))    # ~0.1 - 0.5 s
print(timeit.timeit(as_deque.popleft, number=10_000))          # ~0.001 s

# The classic O(n^2) anti-pattern and its O(n) fix
orders = [f"ORD-{i}" for i in range(20_000)]
refunded = [f"ORD-{i}" for i in range(0, 20_000, 7)]

def slow():                                     # list membership inside a loop: O(n * m)
    return [o for o in orders if o in refunded]

refunded_set = set(refunded)
def fast():                                     # set membership: O(n)
    return [o for o in orders if o in refunded_set]

print(timeit.timeit(slow, number=1))            # ~0.5 s or more
print(timeit.timeit(fast, number=1))            # ~0.001 s`
    },
    {
      heading: "10. collections Module: Counter and defaultdict",
      content: `The \`collections\` module provides containers that remove boilerplate from patterns you would otherwise write by hand with a plain dict.
\`Counter\` is a dict subclass for **counting hashable items**. Pass it any iterable and it tallies occurrences; pass it a mapping or keyword arguments to set counts directly. Missing keys return **0** instead of raising \`KeyError\`. Its \`most_common(n)\` method returns the top n (key, count) pairs sorted by count, with ties kept in first-seen order — the one-liner behind "top 10 products", word frequencies and log analysis. \`update(iterable)\` adds counts, \`subtract()\` lowers them, \`elements()\` expands the counts back into a stream of items, and \`total()\` (Python 3.10+) sums all counts. Counters support arithmetic: \`c1 + c2\` adds, \`c1 - c2\` subtracts and **drops** zero or negative results, \`&\` gives minimums and \`|\` maximums — inventory maths for free.
\`defaultdict(factory)\` is a dict that **creates a missing value on first access** by calling \`factory()\` with no arguments. \`defaultdict(list)\` is the standard way to group items (\`groups[key].append(item)\` with no existence check), \`defaultdict(int)\` counts, \`defaultdict(set)\` builds unique groups, and \`defaultdict(lambda: defaultdict(float))\` makes a two-level map. It is otherwise a normal dict: it serialises to JSON, supports every method, and you can convert it with \`dict(dd)\` for display.
The important caveat: **reading a missing key inserts it**. \`if dd["x"]:\` quietly adds \`"x"\` with the default value, which can inflate \`len(dd)\` or leak empty groups into reports. Use \`key in dd\` or \`dd.get(key)\` when you only want to check.`,
      codeSnippet: `# counter_defaultdict.py
from collections import Counter, defaultdict

text = "good food good service slow delivery good price"
words = Counter(text.split())
print(words)                          # Counter({'good': 3, 'food': 1, 'service': 1, 'slow': 1, 'delivery': 1, 'price': 1})
print(words.most_common(1))           # [('good', 3)]
print(words["excellent"])             # 0 -> missing keys return 0, no KeyError
words.update(["slow", "slow"])
print(words["slow"])                  # 3
print(words.total())                  # 10  (Python 3.10+)
print(list(words.elements())[:4])     # ['good', 'good', 'good', 'food']

# Counter arithmetic: inventory maths
stock = Counter(pen=10, notebook=5)
sold = Counter(pen=3, notebook=7)
print(stock - sold)                   # Counter({'pen': 7}) -> zero/negative counts are dropped
print(stock + sold)                   # Counter({'pen': 13, 'notebook': 12})
stock.subtract(sold)
print(stock)                          # Counter({'pen': 7, 'notebook': -2}) -> subtract() keeps negatives

# defaultdict: auto-create a default for missing keys
by_city = defaultdict(list)
employees = [("Aarav", "Pune"), ("Diya", "Pune"), ("Kabir", "Delhi")]
for name, city in employees:
    by_city[city].append(name)        # no 'if city not in by_city' needed
print(dict(by_city))                  # {'Pune': ['Aarav', 'Diya'], 'Delhi': ['Kabir']}

letters = defaultdict(int)            # int() -> 0
for ch in "mississippi":
    letters[ch] += 1
print(dict(letters))                  # {'m': 1, 'i': 4, 's': 4, 'p': 2}

# Nested defaultdict for two-level grouping
sales = defaultdict(lambda: defaultdict(float))
sales["Mumbai"]["Q1"] += 1_50_000
sales["Mumbai"]["Q2"] += 1_75_000
print(sales["Mumbai"]["Q2"])          # 175000.0

# Caution: reading a missing key CREATES it
print("Chennai" in by_city)           # False
_ = by_city["Chennai"]
print("Chennai" in by_city)           # True  (an empty list was inserted)`
    },
    {
      heading: "11. collections Module: deque and namedtuple",
      content: `\`deque\` (pronounced "deck", double-ended queue) is a sequence optimised for adding and removing at **both ends** in O(1). A plain list is terrible as a queue because \`pop(0)\` shifts every remaining element; a deque is implemented as a doubly linked list of fixed-size blocks, so \`popleft()\` and \`appendleft()\` are as cheap as \`append()\`. Use it for FIFO queues (customer service lines, task pipelines, breadth-first search), for undo stacks, and — with the \`maxlen\` argument — for **sliding windows**: a \`deque(maxlen=100)\` automatically discards the oldest item when the 101st arrives, which is exactly what you want for "last 100 log lines", moving averages and rate limiters. \`rotate(k)\` shifts items circularly, and deques are thread-safe for appends and pops, which is why they underpin \`queue.Queue\`. Avoid random access in the middle (\`dq[i]\`): that is O(n).
\`namedtuple(typename, fields)\` builds a lightweight **tuple subclass with named fields**. Instead of remembering that index 2 is the salary, you write \`emp.salary\`. Instances remain tuples: they are immutable, hashable, unpackable, indexable and use no more memory than a plain tuple. Helpful extras: \`_asdict()\` converts to a dict (for JSON), \`_replace(**changes)\` returns a modified copy, \`_fields\` lists the field names, and \`defaults=\` (Python 3.7+) assigns default values to the right-most fields.
In modern typed code prefer the class syntax \`class Point(typing.NamedTuple)\` with type hints and defaults — same behaviour, better editor support. When the record needs to be **mutable**, needs methods or validation, use a \`@dataclass\` (covered in the OOP lecture). The module also includes \`ChainMap\` (search several dicts as one — ideal for CLI args overriding env vars overriding defaults) and \`OrderedDict\` (see Section 7).`,
      codeSnippet: `# deque_namedtuple.py
from collections import deque, namedtuple, ChainMap
from typing import NamedTuple

# deque: O(1) appends and pops at both ends
queue = deque(["cust-1", "cust-2"])
queue.append("cust-3")              # join at the back
served = queue.popleft()            # serve from the front -> 'cust-1'
queue.appendleft("vip-0")           # jump the queue
print(served, queue)                # cust-1 deque(['vip-0', 'cust-2', 'cust-3'])

# maxlen: keep only the last N items (sliding window / recent history)
recent = deque(maxlen=3)
for page in ["/home", "/notes", "/python", "/contact"]:
    recent.append(page)
print(recent)                       # deque(['/notes', '/python', '/contact'], maxlen=3)

ring = deque([1, 2, 3, 4, 5])
ring.rotate(2)                      # deque([4, 5, 1, 2, 3])
ring.rotate(-1)                     # deque([5, 1, 2, 3, 4])
print(ring)

# namedtuple: tuple with named fields
Employee = namedtuple("Employee", ["name", "city", "salary"], defaults=[0.0])
e1 = Employee("Aarav", "Pune", 85_000)
e2 = Employee(name="Diya", city="Delhi")   # salary uses the default 0.0
print(e1.name, e1[1], e1.salary)    # Aarav Pune 85000
print(e2)                           # Employee(name='Diya', city='Delhi', salary=0.0)

name, city, salary = e1             # still a tuple: unpacking works
print(e1._asdict())                 # {'name': 'Aarav', 'city': 'Pune', 'salary': 85000}
e3 = e1._replace(salary=95_000)     # immutable, so get a modified copy
print(e3.salary, Employee._fields)  # 95000 ('name', 'city', 'salary')

# Typed version (preferred in modern code)
class Point(NamedTuple):
    x: float
    y: float
    label: str = "origin"

p = Point(1.5, 2.0)
print(p.x + p.y, p.label)           # 3.5 origin

# ChainMap: layered lookups, first match wins
cli_args = {"port": 8080}
env_vars = {"host": "0.0.0.0", "port": 9000}
defaults = {"host": "127.0.0.1", "port": 8000, "debug": False}
config = ChainMap(cli_args, env_vars, defaults)
print(config["port"], config["host"], config["debug"])   # 8080 0.0.0.0 False`
    },
    {
      heading: "12. heapq and bisect: Priority Queues and Binary Search",
      content: `\`heapq\` turns an ordinary list into a **binary min-heap**, a tree-shaped arrangement where the smallest element is always at index 0 and both push and pop cost only O(log n). Compare that with keeping a list sorted (O(n) per insert) or calling \`min()\` repeatedly (O(n) each time). Heaps are the engine behind **priority queues**: task schedulers, Dijkstra's shortest path, merging sorted streams and "top-k" queries over huge datasets.
The API operates on a plain list: \`heappush(h, item)\`, \`heappop(h)\`, \`heapify(list)\` (converts in place in O(n)), \`heappushpop\` and \`heapreplace\` for push-then-pop in one step, and \`merge(*sorted_iterables)\` for merging already-sorted inputs lazily. \`nlargest(k, iterable, key=...)\` and \`nsmallest\` answer top-k questions efficiently when k is small relative to the data — for k close to n just use \`sorted\`. To store a priority with a payload push tuples \`(priority, item)\`; tuples compare element by element, so add a tie-breaker counter if payloads may be incomparable. Python has no max-heap; **negate the priority** or wrap items in a class with a reversed \`__lt__\`.
\`bisect\` provides **binary search** on a list that is **already sorted**. \`bisect_left(a, x)\` returns the index where \`x\` would be inserted to keep order, placing it before any equal items; \`bisect_right\` (alias \`bisect\`) places it after. Both are O(log n). \`insort_left\` / \`insort_right\` insert while keeping the list sorted — the search is O(log n) but the insertion shifts elements, so it is O(n) overall. Since Python 3.10 all four accept a \`key=\` function so you can search a list of records by one field.
The elegant use of \`bisect\` is **numeric lookup tables**: grade boundaries, tax slabs, shipping-weight bands. One \`bisect_right\` call on the list of cutoffs gives you the index of the band, replacing a chain of \`if/elif\` comparisons.`,
      codeSnippet: `# heapq_bisect.py
import heapq
import bisect

# heapq implements a MIN-heap on a plain list
tasks = []
heapq.heappush(tasks, (2, "send invoice"))
heapq.heappush(tasks, (1, "fix prod bug"))
heapq.heappush(tasks, (3, "write docs"))
print(tasks[0])                        # (1, 'fix prod bug') -> smallest is always at index 0
print(heapq.heappop(tasks))            # (1, 'fix prod bug')
print(heapq.heappop(tasks))            # (2, 'send invoice')

# Turn an existing list into a heap in O(n)
prices = [499, 199, 999, 299, 149]
heapq.heapify(prices)
print(prices[0])                       # 149

# k largest / smallest without fully sorting
scores = [88, 92, 65, 99, 71, 95, 80]
print(heapq.nlargest(3, scores))       # [99, 95, 92]
print(heapq.nsmallest(2, scores))      # [65, 71]
top = heapq.nlargest(2, [("Aarav", 88), ("Diya", 92), ("Kabir", 95)], key=lambda s: s[1])
print(top)                             # [('Kabir', 95), ('Diya', 92)]

# Max-heap trick: negate the priority
max_heap = []
for v in [5, 1, 9]:
    heapq.heappush(max_heap, -v)
print(-heapq.heappop(max_heap))        # 9

# Merge sorted streams lazily
print(list(heapq.merge([1, 4, 9], [2, 3, 10])))   # [1, 2, 3, 4, 9, 10]

# bisect: binary search on an already SORTED list
sorted_marks = [45, 60, 72, 72, 88, 95]
print(bisect.bisect_left(sorted_marks, 72))    # 2 -> before the existing 72s
print(bisect.bisect_right(sorted_marks, 72))   # 4 -> after the existing 72s
bisect.insort(sorted_marks, 80)                # keeps the list sorted
print(sorted_marks)                            # [45, 60, 72, 72, 80, 88, 95]

# Lookup table: grade bands without if/elif chains
cutoffs = [40, 60, 75, 90]                     # boundaries
labels = ["F", "D", "B", "A", "A+"]

def grade(marks: int) -> str:
    return labels[bisect.bisect_right(cutoffs, marks)]

print(grade(39), grade(40), grade(74), grade(80), grade(90))   # F D B A A+

# key= parameter (Python 3.10+): search records by one field
people = [("Meera", 23), ("Aarav", 30), ("Kabir", 41)]        # sorted by age
print(bisect.bisect_left(people, 30, key=lambda p: p[1]))    # 1`
    },
    {
      heading: "13. Real-World Use Cases: How These Data Structures Are Used in Production",
      content: `Here is how the structures from this lecture show up in the systems you will build or maintain:
• **API responses and configs** — every JSON payload from FastAPI, Django REST or a third-party API becomes nested dicts and lists. Pydantic v2 models validate them, but the underlying \`.model_dump()\` is still a dict. Settings are merged with \`defaults | env | cli\` or a \`ChainMap\`.
• **Deduplication and reconciliation** — "which orders in today's export are not in the payment gateway's report?" is \`set(our_ids) - set(gateway_ids)\`. Analysts at fintechs and e-commerce companies write this daily.
• **Grouping and aggregation** — before reaching for pandas, \`defaultdict(list)\` groups transactions by customer and \`Counter\` finds the most-sold SKUs. In pandas itself, \`groupby\` results are often converted back to dicts for templating.
• **Caching** — a dict keyed by a tuple of arguments is the simplest memoisation; \`functools.lru_cache\` does the same with an \`OrderedDict\`-style eviction internally.
• **Queues and rate limiting** — background workers consume tasks from a deque or \`queue.Queue\`; a per-user \`deque\` of timestamps implements a sliding-window rate limiter in a few lines (code below).
• **Scheduling and leaderboards** — \`heapq\` powers job schedulers that always run the earliest-deadline task, and \`nlargest\` produces "top 10 scores" without sorting a million rows.
• **Lookup tables** — income-tax slabs, courier weight bands and exam grade boundaries use \`bisect\` on a sorted list of thresholds.
• **Immutable records** — \`NamedTuple\` rows returned from database drivers, coordinates, RGB colours, and dict keys built from composite identifiers like (tenant_id, user_id).
The example below is a sliding-window rate limiter — the kind of code that sits in an API middleware — combining \`defaultdict\`, \`deque\` and tuples with type hints.`,
      codeSnippet: `# rate_limiter.py -- sliding-window rate limiting with deque
import time
from collections import defaultdict, deque

WINDOW_SECONDS = 60
MAX_REQUESTS = 5
requests_by_user: defaultdict[str, deque[float]] = defaultdict(deque)

def allow_request(user_id: str, now: float | None = None) -> bool:
    """Return True if the user is within MAX_REQUESTS per WINDOW_SECONDS."""
    now = time.monotonic() if now is None else now
    window = requests_by_user[user_id]
    while window and now - window[0] > WINDOW_SECONDS:
        window.popleft()                       # drop timestamps outside the window: O(1) each
    if len(window) >= MAX_REQUESTS:
        return False
    window.append(now)
    return True

base = 1000.0
for i in range(7):
    print(i + 1, allow_request("user-42", base + i))
# 1 True ... 5 True, 6 False, 7 False
print(allow_request("user-42", base + 61))     # True: the oldest requests have expired
print(allow_request("user-99", base + 61))     # True: a different user has a fresh window`
    },
    {
      heading: "14. Common Mistakes with Python Data Structures and How to Fix Them",
      content: `These errors appear in almost every beginner's code review. Learn to recognise them on sight.
• **Mutable default arguments.** \`def add(item, basket=[])\` creates the list **once**, when the function is defined, so every call shares it and items accumulate across calls. Fix: default to \`None\` and create the list inside the function.
• **Modifying a list while iterating over it.** Removing items during a \`for\` loop skips elements because the indexes shift under the iterator. Fix: build a new list with a comprehension, or iterate over a copy (\`for x in list(items)\`). The same applies to adding or deleting dict keys during iteration, which raises \`RuntimeError\`.
• **Expecting \`sort()\` to return the list.** It sorts in place and returns \`None\`. Use \`sorted()\` when you need a value.
• **Using a list as a dict key or set element.** Lists are unhashable; convert to a tuple.
• **Writing \`{}\` for an empty set.** That is an empty dict. Use \`set()\`.
• **Shallow-copying nested data** and then being surprised the original changed. Use \`copy.deepcopy\`, and never build a grid with \`[[0] * n] * m\`.
• **Catching \`KeyError\` instead of using \`get\` / \`setdefault\` / \`defaultdict\`.** Exceptions are for exceptional cases; a missing optional field is routine.
• **Searching a list inside a loop.** \`if x in big_list\` repeated n times is O(n squared). Convert the list to a set once.
• **Using \`list.pop(0)\` as a queue.** Use \`deque.popleft()\`.
• **Forgetting the comma in a single-element tuple**, so \`("Mumbai")\` is a string and \`for city in ("Mumbai")\` iterates over characters.
• **Relying on set order.** Sets have no order; sort before displaying or use \`dict.fromkeys\` for ordered deduplication.`,
      codeSnippet: `# common_mistakes.py

# 1. Mutable default argument
def add_item(item, basket=[]):             # BAD: one shared list across calls
    basket.append(item)
    return basket
print(add_item("pen"), add_item("book"))   # ['pen', 'book'] ['pen', 'book']  <- same list!

def add_item_ok(item, basket=None):        # GOOD
    if basket is None:
        basket = []
    basket.append(item)
    return basket
print(add_item_ok("pen"), add_item_ok("book"))   # ['pen'] ['book']

# 2. Removing items while iterating
nums = [1, 2, 2, 3]
for n in nums:                             # BAD: indexes shift, the second 2 is skipped
    if n == 2:
        nums.remove(n)
print(nums)                                # [1, 2, 3]  <- a 2 survived
nums = [n for n in [1, 2, 2, 3] if n != 2] # GOOD: build a new list
print(nums)                                # [1, 3]

# 3. sort() returns None
data = [3, 1, 2]
result = data.sort()
print(result, data)                        # None [1, 2, 3]  -> use sorted(data) for a value

# 4. Unhashable keys
# cache = {[1, 2]: "x"}                    # TypeError: unhashable type: 'list'
cache = {(1, 2): "x"}                      # GOOD: tuple key

# 5. Empty set literal
s = {}
print(type(s))                             # <class 'dict'>  <- not a set!
s = set()

# 6. Single-element tuple
for city in ("Mumbai"):                    # BAD: iterates over characters
    print(city, end=" ")                   # M u m b a i
print()
for city in ("Mumbai",):                   # GOOD
    print(city)                            # Mumbai

# 7. Grid built with * shares rows
board = [[0] * 3] * 2
board[0][0] = "X"
print(board)                               # [['X', 0, 0], ['X', 0, 0]]
board = [[0] * 3 for _ in range(2)]        # GOOD`
    },
    {
      heading: "15. Frequently Asked Questions about Python Data Structures",
      content: `**What is the difference between a list and a tuple in Python?**
Both are ordered sequences, but a list is mutable (you can append, remove and reassign items) while a tuple is immutable. Tuples are slightly smaller and faster to create, can be used as dictionary keys and set members when their contents are hashable, and signal "fixed record" to readers. Use a list for a collection that grows or changes, a tuple for a record with a fixed number of fields.
**Are Python dictionaries ordered?**
Yes. Since Python 3.7 a dict preserves insertion order as a language guarantee, so iteration, printing and JSON serialisation follow the order in which keys were added. Updating an existing key keeps its position; deleting and re-inserting moves it to the end. \`OrderedDict\` is now only needed for \`move_to_end()\` and order-sensitive equality.
**What is the difference between shallow copy and deep copy in Python?**
A shallow copy (\`list.copy()\`, \`a[:]\`, \`dict.copy()\`) creates a new outer container but keeps references to the same inner objects, so nested lists or dicts are still shared. A deep copy (\`copy.deepcopy()\`) recursively copies every nested object, producing a completely independent structure. Use deep copy only when you will mutate nested data and must not affect the original.
**When should I use a set instead of a list in Python?**
Use a set when you need uniqueness, fast membership tests, or set algebra such as union, intersection and difference. Membership in a set is O(1) on average versus O(n) for a list, which matters enormously inside loops. Stick with a list when order or duplicates matter, or when you need to index by position.
**What is the time complexity of Python list, dict and set operations?**
List indexing and append are O(1); insert, delete and search by value are O(n); sorting is O(n log n). Dict and set lookups, inserts and deletes are O(1) on average because they are hash tables. \`deque\` gives O(1) at both ends, \`heapq\` gives O(log n) push and pop, and \`bisect\` gives O(log n) search on sorted lists.
**What is the difference between Counter and defaultdict(int)?**
Both let you increment counts without checking for the key first. \`Counter\` is purpose-built for counting: it offers \`most_common()\`, \`total()\`, \`elements()\` and arithmetic between counters, and reading a missing key returns 0 without inserting it. \`defaultdict(int)\` is a general dict that inserts a 0 on first access and has none of the counting helpers. Prefer \`Counter\` for tallies and \`defaultdict\` for grouping.
**When should I use deque instead of list in Python?**
Use \`deque\` whenever you add or remove from the front of a sequence — queues, breadth-first search, sliding windows with \`maxlen\`, and undo/redo history. \`list.pop(0)\` is O(n) because every element shifts, while \`deque.popleft()\` is O(1). Keep using a list when you need fast random access by index or slicing.
**Is namedtuple better than a dataclass?**
They solve different problems. A \`NamedTuple\` is an immutable, hashable, memory-light tuple with named fields — ideal for small value records and dict keys. A \`dataclass\` is a regular mutable class with generated \`__init__\`, \`__repr__\` and \`__eq__\`, supports defaults, methods and validation, and can be frozen if you want immutability. For data that behaves like a record with behaviour, choose a dataclass (next lecture).`
    },
    {
      heading: "16. Interview Questions and Answers on Python Data Structures",
      content: `**Q1. Why can a tuple be a dictionary key but a list cannot?**
Dict keys must be hashable, meaning they have a \`__hash__\` that never changes over the object's lifetime. Lists are mutable, so their contents — and therefore any hash — could change after insertion, which would corrupt the hash table; Python disables hashing for them. Tuples are immutable, so a tuple of hashable items has a stable hash. Note that a tuple containing a list is unhashable too.
**Q2. How does a Python dict achieve O(1) lookup?**
It is an open-addressing hash table. The key's hash determines a slot index; CPython probes nearby slots on collision and resizes the table (typically when two-thirds full) to keep probe sequences short. Since 3.6 the table stores indexes into a compact entries array, which is what gives insertion ordering and reduced memory. Worst case is O(n) if many keys collide, which is why hash functions for strings are randomised per process.
**Q3. What happens when you do \`b = a\` for lists, and how do you create an independent copy?**
Nothing is copied; \`b\` becomes another name for the same list object, and \`a is b\` is True. \`a.copy()\`, \`a[:]\` or \`list(a)\` make a shallow copy with a new outer list; \`copy.deepcopy(a)\` also copies nested mutable objects. Choose based on whether the elements themselves are mutable and will be changed.
**Q4. Explain the difference between \`remove()\`, \`pop()\` and \`del\` on a list.**
\`remove(value)\` deletes the first element equal to the value and raises \`ValueError\` if absent. \`pop(index=-1)\` deletes by position and returns the removed element, raising \`IndexError\` on an empty list or bad index. \`del a[i]\` or \`del a[i:j]\` deletes by index or slice without returning anything. All except \`pop()\` from the end are O(n).
**Q5. How would you find the top 5 most frequent words in a large log file?**
Stream the file line by line, split into words and feed them into \`collections.Counter\`, then call \`most_common(5)\`. This is O(n) to count and uses \`heapq.nlargest\` internally for the top-k, avoiding a full sort of the vocabulary. For files larger than memory you still only hold the unique-word counts, not the file.
**Q6. What is the difference between \`bisect_left\` and \`bisect_right\`?**
Both binary-search a sorted list for the insertion point of x in O(log n). \`bisect_left\` returns the position before any existing elements equal to x, so it is also "the index of the first x" if present; \`bisect_right\` returns the position after them. The difference matters for duplicates and for inclusive versus exclusive boundary lookups such as grade or tax slabs.
**Q7. Why is \`heapq\` a min-heap only, and how do you get a max-heap?**
The module keeps the smallest item at index 0 and all functions assume that ordering. For a max-heap, push negated priorities (\`-value\`) and negate again when popping, or push tuples \`(-priority, counter, item)\` where the counter guarantees a tie-break so items are never compared. Alternatively use \`heapq.nlargest\` for one-off top-k queries.
**Q8. What does "stable sort" mean and why does it matter?**
A stable sort preserves the relative order of elements that compare equal. Python's Timsort is stable, so sorting by a secondary key and then by the primary key yields a correct multi-level ordering, and sorting records by one field keeps the original order within ties. It is also why \`Counter.most_common\` lists tied counts in first-seen order.
**Q9. What is the mutable default argument problem?**
Default values are evaluated once at function definition time. A default like \`items=[]\` creates one list shared by every call that omits the argument, so mutations persist between calls and produce confusing results. The fix is \`items=None\` with \`if items is None: items = []\` inside the body.
**Q10. When would you choose \`defaultdict\` over \`dict.setdefault\`?**
\`setdefault\` works on a normal dict and is fine for one or two spots, but it evaluates the default expression on every call and reads awkwardly. \`defaultdict\` declares the intent once, creates defaults lazily only for missing keys, and keeps loop bodies to a single line. Use \`setdefault\` when the dict must stay a plain \`dict\` and you cannot change its type.`
    },
    {
      heading: "17. Hands-On Exercise: Coaching Institute Result Analyzer",
      content: `Build a complete result analyser for a coaching institute's mock test. The program must use every structure from this lecture:
1. Store each student as a \`namedtuple\` with roll number, name, city and a dict of subject marks, built by **tuple unpacking** raw rows.
2. Compute each student's total with a **dict comprehension** and the per-subject average using a **set** of subjects.
3. Find the top 3 students with \`heapq.nlargest\` instead of sorting everyone.
4. Assign grade bands with \`bisect\` on a sorted list of cutoffs and count them with \`Counter\`.
5. Group student names by city with \`defaultdict(list)\`.
6. Use **set operations** to find who scored 80+ in both Physics and Maths, and who did so in Physics only.
7. Keep the last three submissions in a \`deque(maxlen=3)\` for a live dashboard.
8. Print a report **sorted** by total descending, then name ascending, using a tuple key.
Save the file as \`result_analyzer.py\` and run \`python result_analyzer.py\`. Then extend it: load the rows from a CSV with the \`csv\` module, add a \`--city\` filter using \`argparse\`, and write the final report to a JSON file (hint: \`_asdict()\` on each namedtuple).`,
      codeSnippet: `# result_analyzer.py
# Hands-on: analyse mock-test results using lists, tuples, dicts, sets,
# Counter, defaultdict, deque, namedtuple, heapq and bisect.
import bisect
import heapq
from collections import Counter, defaultdict, deque, namedtuple

Student = namedtuple("Student", ["roll", "name", "city", "marks"])   # marks: dict[str, int]

# ---- raw data (in a real project this comes from a CSV, a database or an API) ----
raw = [
    (101, "Aarav", "Pune",   {"Physics": 72, "Chemistry": 65, "Maths": 91}),
    (102, "Diya",  "Delhi",  {"Physics": 88, "Chemistry": 92, "Maths": 79}),
    (103, "Kabir", "Pune",   {"Physics": 45, "Chemistry": 58, "Maths": 62}),
    (104, "Meera", "Patna",  {"Physics": 95, "Chemistry": 89, "Maths": 97}),
    (105, "Rohan", "Delhi",  {"Physics": 67, "Chemistry": 71, "Maths": 55}),
    (106, "Sana",  "Jaipur", {"Physics": 81, "Chemistry": 77, "Maths": 84}),
]
students: list[Student] = [Student(*row) for row in raw]     # tuple unpacking into the namedtuple

# ---- 1. totals and subject averages ----
totals: dict[int, int] = {s.roll: sum(s.marks.values()) for s in students}
subjects: set[str] = set().union(*(s.marks.keys() for s in students))
subject_avg = {
    sub: round(sum(s.marks[sub] for s in students) / len(students), 1)
    for sub in sorted(subjects)
}
print("Subject averages:", subject_avg)

# ---- 2. top 3 students with heapq (no full sort needed) ----
top3 = heapq.nlargest(3, students, key=lambda s: totals[s.roll])
print("Top 3:", [(s.name, totals[s.roll]) for s in top3])

# ---- 3. grade bands with bisect, counted with Counter ----
CUTOFFS = [150, 200, 240, 270]              # total marks out of 300
GRADES = ["C", "B", "A", "A+", "Topper"]

def grade_for(total: int) -> str:
    return GRADES[bisect.bisect_right(CUTOFFS, total)]

grade_of = {s.roll: grade_for(totals[s.roll]) for s in students}
grade_counts = Counter(grade_of.values())
print("Grade distribution:", dict(grade_counts.most_common()))

# ---- 4. group by city with defaultdict ----
by_city: defaultdict[str, list[str]] = defaultdict(list)
for s in students:
    by_city[s.city].append(s.name)
for city, names in sorted(by_city.items()):
    print(f"{city:<7} -> {', '.join(names)}")

# ---- 5. set operations: 80+ in Physics and/or Maths ----
phy_80 = {s.name for s in students if s.marks["Physics"] >= 80}
math_80 = {s.name for s in students if s.marks["Maths"] >= 80}
print("80+ in Physics AND Maths:", sorted(phy_80 & math_80))
print("80+ in Physics only     :", sorted(phy_80 - math_80))

# ---- 6. deque: last 3 submissions for the live dashboard ----
recent: deque[tuple[int, str]] = deque(maxlen=3)
for s in students:
    recent.append((s.roll, s.name))
print("Recent submissions:", list(recent))

# ---- 7. final report, sorted by total descending then name ascending ----
print()
print("Roll  Name    City    Total  Grade")
for s in sorted(students, key=lambda s: (-totals[s.roll], s.name)):
    print(f"{s.roll:<5} {s.name:<7} {s.city:<7} {totals[s.roll]:>5}  {grade_of[s.roll]}")

# Expected output:
# Subject averages: {'Chemistry': 75.3, 'Maths': 78.0, 'Physics': 74.7}
# Top 3: [('Meera', 281), ('Diya', 259), ('Sana', 242)]
# Grade distribution: {'A+': 2, 'B': 2, 'A': 1, 'Topper': 1}
# Delhi   -> Diya, Rohan
# Jaipur  -> Sana
# Patna   -> Meera
# Pune    -> Aarav, Kabir
# 80+ in Physics AND Maths: ['Meera', 'Sana']
# 80+ in Physics only     : ['Diya']
# Recent submissions: [(104, 'Meera'), (105, 'Rohan'), (106, 'Sana')]
#
# Roll  Name    City    Total  Grade
# 104   Meera   Patna     281  Topper
# 102   Diya    Delhi     259  A+
# 106   Sana    Jaipur    242  A+
# 101   Aarav   Pune      228  A
# 105   Rohan   Delhi     193  B
# 103   Kabir   Pune      165  B`
    },
    {
      heading: "18. Summary",
      content: `• **Lists** are ordered, mutable sequences: O(1) indexing and \`append\`, O(n) for \`insert(0)\`, \`pop(0)\`, \`remove\` and \`in\`. Know \`append\` vs \`extend\`, slicing, \`sort()\` (in place, returns \`None\`) vs \`sorted()\` (new list), and \`key=\` with lambdas.
• **Copying**: assignment never copies. \`copy()\`, \`[:]\` and \`list()\` are shallow; \`copy.deepcopy()\` copies nested objects. Never build grids with \`[[0] * n] * m\`.
• **Tuples** are immutable, hashable records; master packing, unpacking, \`*rest\`, swapping and multiple return values. \`(42,)\` is a tuple, \`(42)\` is not.
• **Dicts** are O(1) hash maps that keep insertion order (3.7+). Use \`get\`, \`setdefault\`, \`items()\`, comprehensions and the \`|\` merge operator (3.9+). Never change a dict's size while iterating.
• **Sets** give O(1) membership, uniqueness and set algebra (\`| & - ^\`). \`{}\` is a dict; use \`set()\`. Use \`dict.fromkeys\` for ordered deduplication.
• **Choose by operation**: position → list; record/key → tuple; lookup → dict; uniqueness → set; queue → deque; priority → heapq; sorted search → bisect.
• **collections**: \`Counter\` for tallies and \`most_common\`; \`defaultdict\` for grouping; \`deque\` for O(1) queues and sliding windows; \`namedtuple\` / \`NamedTuple\` for readable records; \`ChainMap\` for layered config.
• **heapq** is a min-heap with O(log n) push/pop and \`nlargest\` / \`nsmallest\`; **bisect** gives O(log n) search on sorted lists and clean lookup tables.
• Avoid the classics: mutable default arguments, modifying while iterating, list membership inside loops, and \`list.pop(0)\` as a queue.
**Next lecture:** Object-Oriented Programming in Python`
    }
  ]
};
