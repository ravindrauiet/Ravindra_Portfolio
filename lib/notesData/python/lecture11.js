export const lecture11 = {
  slug: "lecture-11",
  number: 11,
  title: "Complete Python Course — Lecture 11: Type Hints, Dataclasses, Pydantic & Writing Clean Python",
  summary: "Learn Python type hints and annotations, built-in generics like list[int], Optional and union with |, TypedDict, Protocol, PEP 695 generics, mypy and pyright, dataclasses (frozen, field, slots), Pydantic v2 validation, PEP 8 and ruff, and how to write clean, idiomatic Python.",
  readTime: "70 min read",
  difficulty: "Intermediate",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. Introduction: Why Type Hints, Dataclasses, Pydantic and Clean Code Matter in Real Python Projects",
      content: `Python is dynamically typed: a variable can hold an integer now and a string a second later, and the interpreter will not complain until something actually breaks at runtime. This flexibility is wonderful for a 50-line script and dangerous for a 50,000-line codebase maintained by a team in Pune, Bengaluru and Hyderabad. **Type hints** are Python's answer: optional annotations that document what a function expects and returns, and that tools such as **mypy** and **pyright** can check before the code ever runs. Your editor uses the same hints to give you autocomplete, go-to-definition and instant red squiggles.
Type hints are only the first layer. **Dataclasses** remove the boilerplate of writing \`__init__\`, \`__repr__\` and \`__eq__\` for every class that just holds data. **Pydantic** goes one step further and actually **validates** data at runtime, which is why it powers FastAPI, LangChain and thousands of production APIs. Finally, **PEP 8** and **ruff** give you a shared definition of "clean" so that a pull request review is about logic, not about where the commas go.
Why does this matter for your career? Because the difference between a junior and a mid-level Python developer is rarely syntax. It is whether their code is readable by someone else six months later, whether a wrong argument is caught by a type checker in two seconds instead of in production at 2 a.m., and whether incoming JSON is validated at the boundary instead of crashing deep inside business logic. Interviewers ask about \`Optional\`, \`Protocol\`, \`frozen=True\` and Pydantic validators precisely because these reveal whether you have maintained real software.
This lecture is written for Python 3.11 and newer. At the time of writing, Python 3.14 is the current stable series and Python 3.15 is arriving in October 2026; where a feature depends on a specific version it is labelled. We use **Pydantic v2** (the 2.x line) throughout, because v1 is legacy and its API is different. By the end you will build a complete, type-checked order-processing program that combines every idea from this lecture.`
    },
    {
      heading: "2. Python Type Hints and Annotations: The Basics (PEP 484)",
      content: `A **type hint** (also called a type annotation) is a note attached to a variable, parameter or return value that says what type it is expected to hold. The syntax was standardised in **PEP 484** (Python 3.5) and uses a colon after a parameter name and an arrow before the return type: \`def greet(name: str) -> str:\`. Local variables can be annotated too: \`total: float = 0.0\`.
The single most important fact about type hints: **Python does not enforce them at runtime**. If you annotate \`age: int\` and pass \`"twenty"\`, the interpreter runs the function anyway. Hints are metadata. They are stored in the function's \`__annotations__\` dictionary (from Python 3.14, annotations are evaluated lazily and the recommended way to read them is \`annotationlib.get_annotations()\` or \`typing.get_type_hints()\`), and they are consumed by three kinds of tools: **static type checkers** (mypy, pyright) that read your code without running it, **editors** (VS Code's Pylance, PyCharm) that use them for autocomplete, and **runtime libraries** (Pydantic, FastAPI, dataclasses) that inspect them to generate validation or constructors.
Why bother if nothing is enforced? Three reasons. First, **documentation that cannot go stale**: a docstring saying "returns a list" can lie; an annotation \`-> list[str]\` is checked every time you run mypy. Second, **early bug detection**: a 2017 study of GitHub bugs found that roughly 15% of JavaScript bugs would have been caught by static types, and Python teams report similar numbers. Third, **refactoring confidence**: rename a field and the type checker shows every broken call site instantly.
The basic building blocks are the built-in types (\`int\`, \`float\`, \`str\`, \`bool\`, \`bytes\`, \`None\`), your own classes, and the composite types we cover next. A function that returns nothing is annotated \`-> None\`. Use \`object\` when truly anything is acceptable and \`typing.Any\` only as a deliberate escape hatch, because \`Any\` switches off checking for that value.`,
      codeSnippet: `# hints_basics.py
# Run: python hints_basics.py   (then: mypy hints_basics.py)

def calculate_gst(amount: float, rate: float = 0.18) -> float:
    """Return the GST payable on an amount in rupees."""
    return round(amount * rate, 2)


def format_invoice(customer: str, total: float) -> str:
    return f"Invoice for {customer}: Rs {total:,.2f}"


count: int = 0                     # annotated variable
cities: list = ["Mumbai", "Pune"]  # fine, but list[str] is more precise (next section)

print(calculate_gst(10_000))                # 1800.0
print(format_invoice("Asha Traders", 11_800))  # Invoice for Asha Traders: Rs 11,800.00

# Python does NOT stop this at runtime - only mypy/pyright will flag it:
print(calculate_gst("10000"))  # TypeError at runtime ("can't multiply sequence by non-int")
# mypy output:
#   hints_basics.py:17: error: Argument 1 to "calculate_gst" has incompatible type "str"; expected "float"`
    },
    {
      heading: "3. Built-in Generics (list[int], dict[str, float]), Optional and Union with |",
      content: `A **generic** type is a container type parameterised by the types it holds. \`list[int]\` means "a list whose elements are integers", \`dict[str, float]\` means "keys are strings, values are floats", \`tuple[int, str]\` is a two-element tuple with exactly those types, \`tuple[int, ...]\` is a tuple of any length of integers, and \`set[str]\` is a set of strings. Since **Python 3.9 (PEP 585)** you write these with the built-in classes directly. Older code imports \`List\`, \`Dict\` and \`Tuple\` from the \`typing\` module; those capitalised aliases still work but are deprecated, and ruff's \`UP006\` rule will rewrite them for you. For abstract containers, prefer \`collections.abc\` types in parameters: accept \`Sequence[int]\` or \`Iterable[int]\` when you only read, and return the concrete \`list[int]\`. This is the "be liberal in what you accept, precise in what you return" principle.
**Optional** describes a value that may be \`None\`. Before Python 3.10 you wrote \`Optional[str]\` or \`Union[str, None]\`. Since **Python 3.10 (PEP 604)** the idiomatic form is \`str | None\`, and \`int | str\` replaces \`Union[int, str]\`. Note that \`Optional[str]\` does **not** mean the parameter is optional in the sense of having a default; it means the value may be \`None\`. A parameter with a default value and no \`None\` is just \`name: str = "Guest"\`.
The real power of \`X | None\` comes from **type narrowing**. When mypy sees \`if user is None: return\`, it knows that after that line \`user\` is a \`User\`, so calling \`user.email\` is safe. Without the check it reports \`Item "None" of "User | None" has no attribute "email"\`. This single feature prevents the most common Python bug, \`AttributeError: 'NoneType' object has no attribute ...\`. Narrowing also works with \`isinstance()\`, \`match\` statements, truthiness checks on non-numeric types, and \`assert\`.
**Common search question: "list vs List in Python typing?"** They are the same for checkers; \`list[int]\` is the modern spelling, \`List[int]\` is legacy.`,
      codeSnippet: `# generics_optional.py  (Python 3.10+)
from collections.abc import Iterable, Sequence
from dataclasses import dataclass


@dataclass
class User:
    name: str
    email: str | None = None      # may be missing


def average(scores: Sequence[float]) -> float:
    return sum(scores) / len(scores) if scores else 0.0


def top_cities(sales: dict[str, float], limit: int = 3) -> list[tuple[str, float]]:
    return sorted(sales.items(), key=lambda kv: kv[1], reverse=True)[:limit]


def find_user(users: Iterable[User], name: str) -> User | None:
    for u in users:
        if u.name == name:
            return u
    return None                   # explicit None return


def email_domain(user: User | None) -> str:
    if user is None or user.email is None:
        return "unknown"
    return user.email.split("@")[1]   # narrowed: user and user.email are not None here


users = [User("Asha", "asha@tcs.com"), User("Rahul")]
print(average([88.5, 92.0, 79.5]))              # 86.66666666666667
print(top_cities({"Mumbai": 5.2, "Delhi": 4.1, "Pune": 2.9, "Surat": 1.1}, 2))
# [('Mumbai', 5.2), ('Delhi', 4.1)]
print(email_domain(find_user(users, "Asha")))   # tcs.com
print(email_domain(find_user(users, "Priya")))  # unknown`
    },
    {
      heading: "4. TypedDict, Literal, Final and the type Statement: Precise Types for Dictionaries and Constants",
      content: `Real programs are full of dictionaries that come from JSON: \`{"id": 42, "city": "Mumbai", "amount": 999.0}\`. Annotating them as \`dict[str, object]\` loses all information about which keys exist. **TypedDict** (Python 3.8, PEP 589) lets you describe the exact shape: a class whose body lists keys and their types, but which at runtime is still a plain \`dict\`. Type checkers then verify that you only access keys that exist and assign values of the right type. Keys are required by default; mark some optional with \`NotRequired[...]\` (Python 3.11) or set \`total=False\` on the class. Python 3.13 adds \`ReadOnly[...]\` for keys that must not be reassigned.
TypedDict is the right tool when you are **consuming** or **producing** JSON-like dictionaries and do not want the overhead or behaviour change of a class, for example API responses, configuration loaded from \`json.load\`, or rows returned by a database driver. It gives you editor autocomplete on dictionary keys, which is a surprisingly big productivity win. It does **not** validate anything at runtime; for that you need Pydantic (sections 9 and 10).
**Literal** (Python 3.8) restricts a value to specific constants: \`status: Literal["pending", "paid", "failed"]\`. Passing \`"PAID"\` is a type error. This is cheaper than an \`Enum\` when the values are just strings travelling through an API. **Final** (Python 3.8) marks a name that must not be reassigned: \`MAX_RETRIES: Final = 3\`. Checkers flag any later assignment.
Finally, long type expressions deserve names. Since **Python 3.12 (PEP 695)** the \`type\` statement creates a type alias: \`type Money = int | float\` and \`type Matrix = list[list[float]]\`. Before 3.12 you wrote \`Money: TypeAlias = int | float\` (3.10) or a bare assignment. Aliases make signatures readable and give you one place to change when the shape evolves.`,
      codeSnippet: `# typed_dict_literal.py  (Python 3.12+ for the "type" statement)
from typing import Final, Literal, NotRequired, TypedDict

type Paise = int                      # PEP 695 alias: store money as integer paise
type OrderStatus = Literal["pending", "paid", "failed"]

GST_RATE: Final = 0.18                # reassigning later is a type error


class OrderRow(TypedDict):
    order_id: str
    city: str
    amount_paise: Paise
    status: OrderStatus
    coupon: NotRequired[str]           # may be absent from the dict


def to_rupees(paise: Paise) -> str:
    return f"Rs {paise / 100:,.2f}"


def describe(row: OrderRow) -> str:
    coupon = row.get("coupon", "none")        # .get is safe for NotRequired keys
    return f"{row['order_id']} from {row['city']}: {to_rupees(row['amount_paise'])} [{row['status']}] coupon={coupon}"


rows: list[OrderRow] = [
    {"order_id": "ORD-1", "city": "Jaipur", "amount_paise": 249900, "status": "paid"},
    {"order_id": "ORD-2", "city": "Kochi", "amount_paise": 99900, "status": "pending", "coupon": "DIWALI10"},
]
for r in rows:
    print(describe(r))
# ORD-1 from Jaipur: Rs 2,499.00 [paid] coupon=none
# ORD-2 from Kochi: Rs 999.00 [pending] coupon=DIWALI10

# mypy catches all of these without running the code:
# bad: OrderRow = {"order_id": "X", "city": "Pune", "amount_paise": "100", "status": "shipped"}
#   -> "amount_paise" has incompatible type "str"; "status" has incompatible type "shipped"`
    },
    {
      heading: "5. Protocol: Structural Typing (Duck Typing with a Type Checker)",
      content: `Python has always favoured **duck typing**: if an object has a \`.read()\` method, you can treat it as a file, whatever its class. The problem is expressing that idea in a type hint. Annotating a parameter as \`io.TextIOWrapper\` rejects a perfectly good \`StringIO\`. Annotating it as \`object\` loses all checking. **Protocol** (Python 3.8, PEP 544) solves this with **structural typing**: you declare the methods and attributes an object must have, and any class that happens to have them satisfies the protocol, with no inheritance, registration or import of your module required.
Compare this with the **nominal** typing of abstract base classes: a class satisfies \`abc.ABC\` only if it explicitly inherits from it. With \`Protocol\` a third-party class you cannot modify, a built-in type, or a test double you wrote in two lines all qualify automatically as long as the shapes match. This is exactly how the standard library describes things like \`SupportsIndex\` and \`Iterable\`.
When should you use a Protocol? Whenever a function depends on **behaviour** rather than a specific class: a \`Notifier\` with a \`send(message: str) -> None\` method that could be email, SMS or a test fake; a \`Repository\` with \`get\`, \`add\` and \`list\` methods that could be backed by PostgreSQL, SQLite or an in-memory dict; a \`Serializer\` with \`dumps\`. Protocols make **dependency injection** and unit testing natural, because the test double does not need to inherit from anything.
Two practical notes. Protocol members are written with a body of \`...\` because they are never called directly. If you want to check an object against a protocol at **runtime** with \`isinstance()\`, decorate it with \`@runtime_checkable\`; be aware this only checks that the method names exist, not their signatures. In Python 3.11+ you can annotate a method that returns its own instance with \`typing.Self\`, which works well in protocols for fluent builders.`,
      codeSnippet: `# protocols.py
from typing import Protocol, runtime_checkable


@runtime_checkable
class Notifier(Protocol):
    def send(self, to: str, message: str) -> bool: ...


class EmailNotifier:                   # no inheritance from Notifier needed
    def send(self, to: str, message: str) -> bool:
        print(f"[EMAIL] to={to}: {message}")
        return True


class SmsNotifier:
    def __init__(self, sender_id: str) -> None:
        self.sender_id = sender_id

    def send(self, to: str, message: str) -> bool:
        print(f"[SMS from {self.sender_id}] to={to}: {message[:40]}")
        return True


class FakeNotifier:                    # perfect for unit tests
    def __init__(self) -> None:
        self.sent: list[tuple[str, str]] = []

    def send(self, to: str, message: str) -> bool:
        self.sent.append((to, message))
        return True


def notify_payment(notifier: Notifier, phone: str, amount: float) -> None:
    ok = notifier.send(phone, f"Payment of Rs {amount:,.0f} received. Thank you!")
    if not ok:
        raise RuntimeError("notification failed")


for n in (EmailNotifier(), SmsNotifier("RNJSHP"), FakeNotifier()):
    notify_payment(n, "+91-98xxxxxx21", 2499)
    print(isinstance(n, Notifier))     # True for all three (runtime_checkable)

# class Broken:
#     def send(self, to: str) -> bool: ...
# notify_payment(Broken(), "x", 1)   # mypy: Argument 1 has incompatible type "Broken"; expected "Notifier"`
    },
    {
      heading: "6. Generics in Python 3.12+: The PEP 695 Syntax for Generic Functions and Classes",
      content: `Sometimes a function's return type depends on its input type. \`first(items)\` returns an \`int\` when given \`list[int]\` and a \`str\` when given \`list[str]\`. Annotating it \`-> object\` throws away that information. The solution is a **type variable**: a placeholder type that the checker fills in at each call site. Before Python 3.12 you declared one with \`T = TypeVar("T")\` from \`typing\` and then used it in the signature. That worked but was verbose, easy to misuse (the variable leaked into module scope) and confusing for beginners.
**Python 3.12 (PEP 695)** introduced dedicated syntax. A generic function declares its type parameters in square brackets after the name: \`def first[T](items: list[T]) -> T\`. A generic class does the same: \`class Stack[T]:\`. The type parameter is scoped to that function or class, there is no \`TypeVar\` import, and the intent is obvious. You can constrain a parameter with a **bound**: \`def largest[T: (int, float)](values: list[T]) -> T\` restricts \`T\` to those types, while \`[T: Comparable]\` would require a protocol. **Python 3.13 (PEP 696)** adds defaults: \`class Box[T = str]\`. The old \`TypeVar\` form still works and is what you will see in libraries that support 3.11 and below.
Where are generics used in practice? Typed collections (\`Stack[T]\`, \`Cache[K, V]\`), repository patterns (\`Repository[User]\`, \`Repository[Order]\`), result wrappers (\`Result[T, E]\`), and decorators that must preserve the wrapped function's signature. For the decorator case you combine \`ParamSpec\` and \`Callable\`: \`def retry[**P, R](fn: Callable[P, R]) -> Callable[P, R]\`. That is what makes \`@retry\` keep autocomplete for the original parameters.
One rule of thumb: do not reach for generics until a concrete type stops working. Most application code never defines a generic; it only consumes generic library types like \`list[int]\` and \`dict[str, User]\`. Library and framework code is where \`[T]\` earns its keep.`,
      codeSnippet: `# generics_695.py  (Python 3.12+)
from collections.abc import Callable
from dataclasses import dataclass, field


def first[T](items: list[T]) -> T:
    if not items:
        raise ValueError("empty list")
    return items[0]


def largest[T: (int, float)](values: list[T]) -> T:   # constrained to numbers
    return max(values)


@dataclass
class Stack[T]:
    _items: list[T] = field(default_factory=list)

    def push(self, item: T) -> None:
        self._items.append(item)

    def pop(self) -> T:
        return self._items.pop()

    def __len__(self) -> int:
        return len(self._items)


def logged[**P, R](fn: Callable[P, R]) -> Callable[P, R]:
    """Decorator that keeps the wrapped function's exact signature for type checkers."""
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
        print(f"calling {fn.__name__}{args}")
        return fn(*args, **kwargs)
    return wrapper


@logged
def discount(price: float, pct: int) -> float:
    return price * (1 - pct / 100)


n: int = first([10, 20, 30])         # T is inferred as int
s: str = first(["Pune", "Goa"])      # T is inferred as str
print(n, s, largest([3.5, 9.25, 1.0]))   # 10 Pune 9.25

orders: Stack[str] = Stack()
orders.push("ORD-7")
# orders.push(42)     # mypy: Argument 1 to "push" of "Stack" has incompatible type "int"; expected "str"
print(orders.pop(), len(orders))      # ORD-7 0
print(discount(1000.0, 10))           # calling discount(1000.0, 10)  then 900.0`
    },
    {
      heading: "7. Static Type Checkers: Running mypy and pyright on a Python Project",
      content: `Type hints only pay off when something checks them. The two mainstream **static type checkers** are **mypy** (the original, maintained by the Python typing community) and **pyright** (written by Microsoft in TypeScript; it is the engine behind VS Code's Pylance extension). Both read your source without executing it and report mismatches. Newer Rust-based checkers such as Astral's \`ty\` are also gaining adoption, but mypy and pyright are what most interviewers and CI pipelines expect today.
**mypy**: install with \`uv add --dev mypy\` (or \`pip install mypy\`), run \`mypy src/\`. By default it is lenient: unannotated functions are skipped. Enabling \`strict = true\` in \`pyproject.toml\` turns on the full set of checks (every function must be annotated, no implicit \`Any\`, no untyped calls). For an existing codebase, enable strictness gradually, one package at a time, using per-module overrides. The debugging trick everyone should know is \`reveal_type(x)\`: mypy prints what it believes the type of \`x\` is, which is the fastest way to understand a narrowing problem.
**pyright**: install with \`uv add --dev pyright\` (it is published on PyPI as a wrapper around the Node package) and run \`pyright\`. It is faster than mypy, infers more without annotations, and its **strict** mode is enabled per file or via \`[tool.pyright]\`. Because Pylance uses pyright, what you see in VS Code matches what CI reports. Many teams run pyright in the editor and mypy in CI, or just one of them everywhere; the important thing is that **some** checker runs on every pull request.
Third-party packages need type information too. Modern libraries ship a \`py.typed\` marker and inline hints (Pydantic, httpx, FastAPI). Older ones rely on separate stub packages such as \`types-requests\`; mypy's \`--install-types\` can fetch them. When a library has no types at all, add a per-module \`ignore_missing_imports\` override rather than silencing the whole project. Put a \`# type: ignore[code]\` comment only on the exact line you cannot fix, always with the specific error code so it does not hide future problems.`,
      codeSnippet: `# pyproject.toml  (type-checker configuration lives next to your dependencies)
# [project]
# name = "orders"
# requires-python = ">=3.12"
# dependencies = ["pydantic>=2.11"]
#
# [dependency-groups]
# dev = ["mypy>=1.14", "pyright>=1.1", "ruff>=0.12", "pytest>=8"]
#
# [tool.mypy]
# python_version = "3.12"
# strict = true
# warn_unreachable = true
# plugins = ["pydantic.mypy"]          # better inference for Pydantic models
#
# [[tool.mypy.overrides]]
# module = ["legacy_sdk.*"]
# ignore_missing_imports = true
#
# [tool.pyright]
# pythonVersion = "3.12"
# typeCheckingMode = "strict"
# include = ["src", "tests"]

# --- demo.py: what the checkers report ---
def parse_pin(code: str) -> int:
    if code.isdigit():
        return int(code)
    return None          # <- bug: declared int, returns None


result = parse_pin("411001")
reveal_type(result)      # mypy prints: Revealed type is "builtins.int"

# $ uv run mypy demo.py
# demo.py:4: error: Incompatible return value type (got "None", expected "int")  [return-value]
# Found 1 error in 1 file (checked 1 source file)
#
# $ uv run pyright demo.py
# demo.py:4:12 - error: Type "None" is not assignable to return type "int"
# 1 error, 0 warnings`
    },
    {
      heading: "8. Python Dataclasses: @dataclass, field(), frozen=True, slots=True and __post_init__",
      content: `A huge share of classes exist only to hold related data: an \`Order\`, a \`Point\`, a \`Config\`. Writing \`__init__\`, \`__repr__\` and \`__eq__\` by hand for each one is 20 lines of boilerplate that can drift out of sync when you add a field. The **\`@dataclass\`** decorator (Python 3.7, PEP 557, in the standard library \`dataclasses\` module) generates all of that from the class's type annotations. Declare fields as annotated class attributes, optionally with defaults, and you get a constructor with keyword arguments, a readable \`repr\`, value-based equality and a \`__match_args__\` for \`match\` statements.
**Mutable defaults** are the first thing to learn. \`items: list[str] = []\` would share one list across every instance, so dataclasses reject it with a \`ValueError\`. Use \`field(default_factory=list)\` instead; the factory is called once per instance. \`field()\` also controls per-field behaviour: \`repr=False\` hides a password from logs, \`compare=False\` excludes a timestamp from equality, \`init=False\` for values computed later, and \`metadata={...}\` for your own tooling. The **\`__post_init__\`** method runs right after the generated \`__init__\` and is the place for validation or derived fields.
Decorator options shape the whole class. **\`frozen=True\`** makes instances immutable: assigning to a field raises \`FrozenInstanceError\`, and the instance becomes hashable, so it can be a dict key or set member. Immutability is what you want for value objects such as money or coordinates. **\`order=True\`** generates comparison operators based on field order. **\`slots=True\`** (Python 3.10) stores attributes in fixed slots instead of a per-instance \`__dict__\`, which cuts memory by roughly 30-40% for small objects and speeds up attribute access; use it when you create millions of instances. **\`kw_only=True\`** (Python 3.10) forces keyword arguments, which prevents positional mix-ups when a class has several fields of the same type.
Helper functions round things out: \`asdict()\` and \`astuple()\` convert to plain containers (recursively), \`replace(obj, field=value)\` returns a modified copy of a frozen instance, and \`fields()\` lists the field definitions for introspection. Dataclasses do **not** validate types at runtime: \`Order(amount="abc")\` is accepted. That is the gap Pydantic fills.`,
      codeSnippet: `# dataclasses_demo.py  (Python 3.10+)
from dataclasses import asdict, dataclass, field, replace
from datetime import datetime


@dataclass(frozen=True, slots=True)
class Money:
    paise: int
    currency: str = "INR"

    def __add__(self, other: "Money") -> "Money":
        if self.currency != other.currency:
            raise ValueError("currency mismatch")
        return Money(self.paise + other.paise, self.currency)

    def __str__(self) -> str:
        return f"{self.currency} {self.paise / 100:,.2f}"


@dataclass(kw_only=True)
class Order:
    order_id: str
    customer: str
    items: list[str] = field(default_factory=list)       # never items: list = []
    total: Money = Money(0)
    created_at: datetime = field(default_factory=datetime.now, compare=False)
    api_key: str = field(default="secret", repr=False)    # hidden from repr/logs
    item_count: int = field(init=False)                   # derived, not a constructor arg

    def __post_init__(self) -> None:
        if not self.order_id.startswith("ORD-"):
            raise ValueError(f"bad order id: {self.order_id}")
        self.item_count = len(self.items)


o = Order(order_id="ORD-101", customer="Meera", items=["Saree", "Dupatta"], total=Money(349900))
print(o)
# Order(order_id='ORD-101', customer='Meera', items=['Saree', 'Dupatta'], total=Money(paise=349900, currency='INR'), created_at=datetime(...), item_count=2)
print(o.total + Money(50100))          # INR 4,000.00
print(o == replace(o, created_at=datetime(2000, 1, 1)))   # True: created_at has compare=False
print(o == replace(o, api_key="other"))                   # False: api_key is still compared
print(asdict(o)["items"])              # ['Saree', 'Dupatta']

m = Money(100)
# m.paise = 200   # dataclasses.FrozenInstanceError: cannot assign to field 'paise'
print({m: "one rupee"}[Money(100)])    # frozen => hashable => usable as dict key: one rupee
# Order(order_id="X1", customer="A")   # ValueError: bad order id: X1`
    },
    {
      heading: "9. Pydantic v2 Models: Runtime Validation, Parsing and Serialisation",
      content: `Type hints and dataclasses help the developer, but they do nothing when a mobile app sends \`{"amount": "abc"}\` to your API at runtime. **Pydantic** is the library that turns annotations into **runtime validation**. You define a class that inherits from \`BaseModel\`, annotate its fields, and Pydantic generates a validator that checks every incoming value, converts compatible types, and raises a detailed \`ValidationError\` listing every problem at once. This is why FastAPI uses it for request bodies, why many teams use it for configuration, and why it is one of the most downloaded packages on PyPI.
**Pydantic v2** (released 2023; the current line is 2.1x) rewrote the core in Rust, making validation 5-50x faster than v1, and renamed the API: \`parse_obj\` became \`model_validate\`, \`dict()\` became \`model_dump\`, \`json()\` became \`model_dump_json\`, \`parse_raw\` became \`model_validate_json\`, and \`class Config\` became \`model_config = ConfigDict(...)\`. If a tutorial uses the old names it is teaching v1; avoid it.
By default Pydantic runs in **lax mode**: the string \`"42"\` is accepted for an \`int\` field and converted, \`"2026-10-09"\` becomes a \`date\`, and \`"true"\` becomes \`True\`. This is ideal at API boundaries where everything arrives as text. If you need exactness, set \`strict=True\` in the config or on a single field. Constraints are declared with **\`Field()\`**: \`Field(gt=0)\`, \`Field(min_length=3, max_length=50)\`, \`Field(pattern=r"^[A-Z]{3}-\\d+$")\`, \`Field(default_factory=list)\`, plus metadata like \`description\` that FastAPI turns into OpenAPI docs. The equivalent \`Annotated[int, Field(gt=0)]\` form is preferred when the same constraint is reused as a type alias.
When validation fails, catch \`ValidationError\` and call \`.errors()\` to get a list of dicts with \`loc\` (the field path), \`msg\` and \`type\`; \`.json()\` gives the same as JSON ready to return to the client. Models nest naturally: a field typed as another \`BaseModel\`, or \`list[Item]\`, validates recursively, so one \`model_validate\` call can check an entire order with twenty line items. Serialisation goes the other way: \`model_dump()\` produces a plain dict, \`model_dump(mode="json")\` converts dates and Decimals to JSON-safe values, and \`exclude\`, \`include\` and \`by_alias\` control the output shape.`,
      codeSnippet: `# pydantic_models.py   Install: uv add pydantic   (Pydantic 2.x)
from datetime import date
from decimal import Decimal
from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field, ValidationError

Rupees = Annotated[Decimal, Field(gt=0, max_digits=10, decimal_places=2)]


class Item(BaseModel):
    sku: str = Field(pattern=r"^[A-Z]{3}-\\d{4}$")
    name: str = Field(min_length=2, max_length=60)
    price: Rupees
    qty: int = Field(ge=1, le=100)


class Order(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    order_id: str
    customer_email: str = Field(pattern=r"^[^@\\s]+@[^@\\s]+\\.[a-z]{2,}$")
    order_date: date
    items: list[Item] = Field(min_length=1)

    @property
    def total(self) -> Decimal:
        return sum((i.price * i.qty for i in self.items), Decimal(0))


payload = {
    "order_id": "  ORD-2001 ",
    "customer_email": "asha@example.in",
    "order_date": "2026-10-09",                           # str -> date (lax mode)
    "items": [{"sku": "ELE-1042", "name": "Earbuds", "price": "1999.00", "qty": "2"}],
}
order = Order.model_validate(payload)
print(order.order_id, order.order_date, order.total)      # ORD-2001 2026-10-09 3998.00
print(order.model_dump(mode="json")["items"][0])
# {'sku': 'ELE-1042', 'name': 'Earbuds', 'price': '1999.00', 'qty': 2}

bad = {"order_id": "ORD-1", "customer_email": "nope", "order_date": "yesterday",
       "items": [{"sku": "bad", "name": "X", "price": -5, "qty": 0}], "note": "?"}
try:
    Order.model_validate(bad)
except ValidationError as exc:
    for err in exc.errors():
        print(".".join(str(p) for p in err["loc"]), "->", err["msg"])
# (wording as produced by Pydantic 2.x; minor differences between versions are normal)
# customer_email -> String should match pattern '^[^@\\s]+@[^@\\s]+\\.[a-z]{2,}$'
# order_date -> Input should be a valid date or datetime, invalid character in year
# items.0.sku -> String should match pattern '^[A-Z]{3}-\\d{4}$'
# items.0.name -> String should have at least 2 characters
# items.0.price -> Input should be greater than 0
# items.0.qty -> Input should be greater than or equal to 1
# note -> Extra inputs are not permitted`
    },
    {
      heading: "10. Pydantic Validators, Settings and Choosing Between TypedDict, Dataclass and Pydantic",
      content: `Constraints in \`Field()\` cover 80% of cases; the rest need custom logic. A **\`@field_validator("name")\`** is a classmethod that receives the value after basic type validation (\`mode="after"\`, the default) or the raw input before it (\`mode="before"\`). Return the cleaned value or raise \`ValueError\` with a helpful message; Pydantic wraps it in the standard error format. A **\`@model_validator(mode="after")\`** receives the whole model and is the place for cross-field rules such as "delivery date must be after order date" or "either phone or email must be present". Computed outputs use \`@computed_field\` so they appear in \`model_dump()\`.
Configuration is a model's second job. The separate **\`pydantic-settings\`** package provides \`BaseSettings\`, which reads fields from environment variables and \`.env\` files with the same validation: \`DATABASE_URL\`, \`REDIS_PORT: int\`, \`DEBUG: bool\`. A typo in an environment variable then fails at startup with a clear error instead of at the first request. \`TypeAdapter\` validates values that are not models at all, for example \`TypeAdapter(list[int]).validate_python(["1", "2"])\`.
**Which tool should you use?** This is a frequent interview question, so here is a clear rule.
• **TypedDict**: you are passing plain dictionaries (JSON, DB rows) and only want static checking. Zero runtime cost, no behaviour, no validation.
• **dataclass**: you are modelling internal domain objects created by **your own code**, which you trust. You want a constructor, repr, equality, immutability (\`frozen\`) and low memory (\`slots\`), with no dependency. Fast and simple.
• **Pydantic BaseModel**: data crosses a **trust boundary**: HTTP requests, message queues, files, user input, LLM output, environment variables. You need validation, coercion, JSON schema and clear error messages. Pydantic is slower than a dataclass to construct (validation is work) but that is the point.
Many production services use all three: Pydantic at the edge, dataclasses in the core, TypedDict for raw rows. Pydantic also offers \`pydantic.dataclasses.dataclass\`, a drop-in that adds validation to the dataclass syntax, useful when migrating.`,
      codeSnippet: `# pydantic_validators.py   (Pydantic 2.x; settings need: uv add pydantic-settings)
from datetime import date, timedelta
from typing import Self

from pydantic import BaseModel, Field, ValidationError, computed_field, field_validator, model_validator


class Delivery(BaseModel):
    pincode: str
    order_date: date
    delivery_date: date
    phone: str | None = None
    email: str | None = None
    weight_kg: float = Field(gt=0, le=30)

    @field_validator("pincode")
    @classmethod
    def check_pincode(cls, v: str) -> str:
        v = v.replace(" ", "")
        if len(v) != 6 or not v.isdigit() or v[0] == "0":
            raise ValueError("Indian PIN code must be 6 digits and not start with 0")
        return v

    @field_validator("phone", mode="before")
    @classmethod
    def normalise_phone(cls, v: object) -> object:
        if isinstance(v, str):
            digits = "".join(ch for ch in v if ch.isdigit())
            return "+91" + digits[-10:] if len(digits) >= 10 else v
        return v

    @model_validator(mode="after")
    def check_dates_and_contact(self) -> Self:
        if self.delivery_date <= self.order_date:
            raise ValueError("delivery_date must be after order_date")
        if self.phone is None and self.email is None:
            raise ValueError("provide at least one of phone or email")
        return self

    @computed_field
    @property
    def shipping_fee(self) -> int:
        base = 49 if self.weight_kg <= 2 else 99
        rush = 60 if (self.delivery_date - self.order_date) <= timedelta(days=1) else 0
        return base + rush


ok = Delivery.model_validate({
    "pincode": "560 001", "order_date": "2026-10-09", "delivery_date": "2026-10-10",
    "phone": "98765 43210", "weight_kg": 1.2,
})
print(ok.pincode, ok.phone, ok.shipping_fee)   # 560001 +919876543210 109
print(ok.model_dump())                          # includes 'shipping_fee': 109

try:
    Delivery.model_validate({"pincode": "0123", "order_date": "2026-10-09",
                             "delivery_date": "2026-10-09", "weight_kg": 5})
except ValidationError as exc:
    for e in exc.errors():
        print(e["loc"], e["msg"])
# ('pincode',) Value error, Indian PIN code must be 6 digits and not start with 0
# (model validator does not run because field validation already failed)

# settings.py (separate file)
# from pydantic_settings import BaseSettings, SettingsConfigDict
# class Settings(BaseSettings):
#     model_config = SettingsConfigDict(env_file=".env")
#     database_url: str
#     redis_port: int = 6379
#     debug: bool = False
# settings = Settings()   # reads DATABASE_URL, REDIS_PORT, DEBUG from the environment`
    },
    {
      heading: "11. PEP 8 and Writing Readable, Idiomatic Python",
      content: `**PEP 8** is the official style guide for Python code, written by Guido van Rossum and others in 2001 and still the baseline every team starts from. Its core rules are simple: indent with **4 spaces** (never tabs); keep lines to **79 characters** (most modern teams relax this to 88, which is ruff's and Black's default); name functions, variables and modules in \`snake_case\`, classes in \`PascalCase\`, constants in \`UPPER_SNAKE_CASE\`, and private members with a leading underscore; put two blank lines between top-level definitions and one between methods; group imports as standard library, third-party, then local, each group alphabetised; and compare to singletons with \`is None\`, never \`== None\`.
Style is only the surface. **Idiomatic Python** ("Pythonic" code) is about using the language the way it was designed to be used, which the \`import this\` Zen summarises: "Simple is better than complex", "Readability counts", "There should be one obvious way to do it". Concretely:
• Iterate directly: \`for item in items\`, not \`for i in range(len(items))\`. Need the index? \`enumerate(items, start=1)\`. Two sequences? \`zip(names, scores)\`.
• Use comprehensions for simple transforms: \`[o.total for o in orders if o.paid]\`. If a comprehension needs more than one condition and one expression, write a loop; nested comprehensions are rarely readable.
• Prefer **EAFP** ("easier to ask forgiveness than permission"): \`try: value = d[key] except KeyError:\` instead of checking first, or simply \`d.get(key, default)\`.
• Use \`with\` for anything that must be closed (files, locks, DB connections), \`pathlib.Path\` over \`os.path\` string juggling, and **f-strings** for formatting.
• Unpack instead of indexing: \`name, city = row\`; \`first, *rest = items\`.
• Return early to avoid deep nesting; a function that reads top to bottom with guard clauses is easier to review than one with four indentation levels.
• Keep functions short and single-purpose, name booleans as questions (\`is_active\`, \`has_stock\`), and do not abbreviate (\`customer\`, not \`cust\`). A good name removes the need for a comment.
• Write docstrings for public functions describing **what** and **why**, and use comments only for the non-obvious.
Readable code is not a luxury: developers spend far more time reading code than writing it, and in a code review the reader's time is the most expensive resource in the room.`,
      codeSnippet: `# readable.py - the same task written twice

# --- Before: works, but hard to read and review ---
def proc(d, t):
    r = []
    for i in range(len(d)):
        if d[i]["st"] == "paid":
            if d[i]["amt"] > t:
                r.append((d[i]["id"], d[i]["amt"] * 1.18))
    return r


# --- After: PEP 8 names, type hints, early return, comprehension, f-string ---
from dataclasses import dataclass
from decimal import Decimal

GST_MULTIPLIER = Decimal("1.18")


@dataclass(frozen=True, slots=True)
class Payment:
    payment_id: str
    amount: Decimal
    status: str

    @property
    def is_paid(self) -> bool:
        return self.status == "paid"


def paid_above_threshold(payments: list[Payment], threshold: Decimal) -> list[tuple[str, Decimal]]:
    """Return (payment_id, amount including GST) for paid payments above the threshold."""
    return [
        (p.payment_id, p.amount * GST_MULTIPLIER)
        for p in payments
        if p.is_paid and p.amount > threshold
    ]


payments = [
    Payment("PAY-1", Decimal("5000"), "paid"),
    Payment("PAY-2", Decimal("800"), "paid"),
    Payment("PAY-3", Decimal("9000"), "failed"),
]
for payment_id, gross in paid_above_threshold(payments, Decimal("1000")):
    print(f"{payment_id}: Rs {gross:,.2f}")
# PAY-1: Rs 5,900.00`
    },
    {
      heading: "12. ruff: Linting and Formatting Python at Rust Speed",
      content: `Nobody should enforce PEP 8 by hand in code review. **ruff**, created by Astral (the same team behind uv), is a linter **and** formatter written in Rust that replaces flake8, isort, pyupgrade, pydocstyle, large parts of pylint, and Black, while running 10-100x faster: a 100,000-line project is checked in well under a second. It has become the default choice for new Python projects and is used by FastAPI, pandas, Pydantic, Hugging Face and many other major projects.
Install it as a development dependency with \`uv add --dev ruff\` (or \`pip install ruff\`). Two commands matter. **\`ruff check .\`** runs the linter: it reports unused imports (\`F401\`), undefined names (\`F821\`), unused variables, bare \`except:\`, mutable default arguments (\`B006\`), outdated syntax such as \`List[int]\` instead of \`list[int]\` (\`UP006\`), and hundreds more. \`ruff check --fix\` applies the safe automatic fixes. **\`ruff format .\`** rewrites files in a Black-compatible style: consistent quotes, trailing commas, line wrapping at 88 characters. \`ruff format --check\` only reports, which is what CI runs.
Configuration lives in \`pyproject.toml\` under \`[tool.ruff]\`. Set \`line-length\` and \`target-version\` (so ruff knows which modern syntax it may suggest), then choose rule sets in \`[tool.ruff.lint] select\`. A sensible starting set is \`E\` and \`W\` (pycodestyle), \`F\` (pyflakes), \`I\` (import sorting), \`UP\` (pyupgrade), \`B\` (bugbear, catches real bugs), \`SIM\` (simplifications) and \`N\` (naming). Note that ruff's defaults have grown over time (version 0.16 expanded the default rule set substantially), so **pin the ruff version** in your dependency group and select rules explicitly to keep CI stable. Suppress a single false positive with a trailing \`# noqa: F401\` comment that names the rule.
To make it automatic, add ruff to **pre-commit** so every commit is linted and formatted before it leaves your machine, enable the ruff VS Code extension for format-on-save, and run \`ruff check\` plus \`ruff format --check\` in GitHub Actions. The result is a codebase where every file looks like it was written by the same person, and reviewers can focus on design.`,
      codeSnippet: `# pyproject.toml - ruff configuration
# [tool.ruff]
# line-length = 88
# target-version = "py312"
# src = ["src", "tests"]
#
# [tool.ruff.lint]
# select = ["E", "W", "F", "I", "UP", "B", "SIM", "N"]
# ignore = ["E501"]            # line length is handled by the formatter
#
# [tool.ruff.lint.per-file-ignores]
# "tests/*" = ["B011"]         # allow assert False in tests
#
# [tool.ruff.format]
# quote-style = "double"

# .pre-commit-config.yaml
# repos:
#   - repo: https://github.com/astral-sh/ruff-pre-commit
#     rev: v0.16.9             # pin the version used by your team
#     hooks:
#       - id: ruff-check
#         args: [--fix]
#       - id: ruff-format

# messy.py - what ruff finds and fixes
import os, sys                      # E401 multiple imports on one line; F401 unused
from typing import List, Optional   # UP035 / UP006 / UP045: use list[...] and X | None


def load(paths: List[str], default: Optional[str] = None, cache=[]):   # B006 mutable default
    for p in paths:
        try:
            cache.append(open(p).read())     # SIM115 use a context manager
        except:                              # E722 bare except
            pass
    return cache


# $ ruff check messy.py        (output abbreviated)
# messy.py:1:8: F401 [*] 'os' imported but unused
# messy.py:1:12: F401 [*] 'sys' imported but unused
# messy.py:2:1: UP035 [*] 'typing.List' is deprecated, use 'list' instead
# messy.py:5:10: UP006 [*] Use 'list' instead of 'List' for type annotation
# messy.py:5:31: UP045 [*] Use 'X | None' for type annotations
# messy.py:5:60: B006 Do not use mutable data structures for argument defaults
# messy.py:8:26: SIM115 Use a context manager for opening files
# messy.py:9:9: E722 Do not use bare 'except'
# Found 8 errors. [*] 5 fixable with the '--fix' option.`
    },
    {
      heading: "13. Real-World Use Cases: How Type Hints, Dataclasses and Pydantic Are Used in Production",
      content: `**FastAPI backends.** Every request body, query parameter and response in FastAPI is a Pydantic model or an annotated type. Declaring \`def create_order(order: OrderIn) -> OrderOut\` gives you validation, automatic 422 error responses with field-level messages, and a generated OpenAPI/Swagger page, all from type hints. Teams building payment, logistics and ed-tech APIs across India rely on this: the model **is** the contract between the mobile app and the server.
**Configuration and secrets.** \`pydantic-settings\` reads environment variables into a typed \`Settings\` object at startup. A missing \`DATABASE_URL\` or a non-integer \`WORKER_COUNT\` fails the deployment immediately with a clear message, instead of surfacing as a mysterious crash an hour later.
**Data pipelines and ETL.** Rows from CSV files, Kafka topics or vendor APIs are validated with Pydantic (or \`TypeAdapter(list[Row])\`) at the ingestion edge; invalid rows go to a dead-letter queue with the exact \`loc\` and \`msg\`. Once inside, the clean records are converted to \`slots=True\` dataclasses for memory-efficient processing of millions of items.
**Domain modelling.** Frozen dataclasses model value objects like \`Money\`, \`Address\` and \`DateRange\`. Because they are immutable and hashable they are safe to share across threads and to use as cache keys. \`Protocol\` interfaces (\`PaymentGateway\`, \`Notifier\`, \`Repository\`) let the core business logic be unit-tested with fakes while production wires in Razorpay, SES or PostgreSQL implementations.
**LLM and agent applications.** Structured output from language models is validated with Pydantic: you give the model a JSON schema generated by \`Model.model_json_schema()\`, then \`model_validate_json\` the response. If the model hallucinates a field or returns a string where a number is required, you catch it and retry rather than corrupting your database.
**Large codebases.** Companies such as Dropbox and Instagram type-check millions of lines of Python; Dropbox, where mypy was created, has written about how gradual typing caught \`None\`-related bugs and made large refactors safe. Their pattern, strict checking enforced in CI, ruff in pre-commit and Pydantic at boundaries, is the same one a three-person startup can adopt on day one.`,
      codeSnippet: `# app.py - FastAPI ties everything together (uv add fastapi uvicorn pydantic)
# Run: uv run uvicorn app:app --reload   then open http://127.0.0.1:8000/docs
from decimal import Decimal
from typing import Annotated

from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, Field

app = FastAPI(title="Orders API")


class OrderIn(BaseModel):
    customer: str = Field(min_length=2, examples=["Asha Verma"])
    city: str
    amount_inr: Decimal = Field(gt=0, decimal_places=2)


class OrderOut(OrderIn):
    order_id: int
    status: str = "pending"


_db: dict[int, OrderOut] = {}


@app.post("/orders", response_model=OrderOut, status_code=201)
def create_order(order: OrderIn) -> OrderOut:          # body validated by Pydantic
    order_id = len(_db) + 1
    created = OrderOut(order_id=order_id, **order.model_dump())
    _db[order_id] = created
    return created


@app.get("/orders")
def list_orders(
    city: Annotated[str | None, Query(max_length=40)] = None,
    min_amount: Annotated[Decimal, Query(ge=0)] = Decimal(0),
) -> list[OrderOut]:
    return [o for o in _db.values() if (city is None or o.city == city) and o.amount_inr >= min_amount]


@app.get("/orders/{order_id}")
def get_order(order_id: int) -> OrderOut:               # "abc" in the path -> automatic 422
    if order_id not in _db:
        raise HTTPException(status_code=404, detail="order not found")
    return _db[order_id]

# POST /orders with {"customer": "A", "city": "Pune", "amount_inr": -1} returns 422:
# {"detail": [{"loc": ["body", "customer"], "msg": "String should have at least 2 characters", ...},
#             {"loc": ["body", "amount_inr"], "msg": "Input should be greater than 0", ...}]}`
    },
    {
      heading: "14. Common Mistakes with Python Type Hints, Dataclasses and Pydantic and How to Fix Them",
      content: `**1. Believing type hints are enforced at runtime.** A function annotated \`def f(x: int)\` happily accepts \`"5"\`. Fix: run mypy or pyright in CI, and use Pydantic where data comes from outside.
**2. Using a mutable default argument or dataclass field.** \`def add(item, bucket=[])\` and \`items: list[str] = []\` share one object across calls or instances. Fix: default to \`None\` and create inside, or use \`field(default_factory=list)\`. ruff's \`B006\` flags the function case.
**3. Writing \`Optional[str]\` but forgetting to handle \`None\`.** Declaring that a value can be \`None\` and then calling \`.upper()\` on it directly is the number one source of \`AttributeError\`. Fix: narrow with \`if value is None: return ...\` before use; mypy will insist.
**4. Reaching for \`Any\` to silence errors.** Every \`Any\` is a hole in your safety net; \`dict[str, Any]\` everywhere means the checker is doing nothing. Fix: use \`object\` when you truly do not care, \`TypedDict\` for known shapes, or a Pydantic model.
**5. Using \`List\`, \`Dict\`, \`Optional\` and \`Union\` from typing in new code.** They work but are deprecated since 3.9/3.10 and clutter imports. Fix: \`list[int]\`, \`dict[str, int]\`, \`str | None\`; let ruff \`UP\` rules rewrite them.
**6. Making a dataclass \`frozen=True\` and then trying to mutate it in \`__post_init__\`.** Assignment raises \`FrozenInstanceError\`. Fix: compute derived values before construction, use \`object.__setattr__(self, "field", value)\` as a last resort, or do not freeze.
**7. Mixing Pydantic v1 and v2 APIs.** Calling \`.dict()\`, \`.parse_obj()\` or defining \`class Config\` on a v2 model produces deprecation warnings today and will break tomorrow; \`@validator\` behaves differently from \`@field_validator\`. Fix: use \`model_dump\`, \`model_validate\`, \`ConfigDict\` and the v2 validators consistently; check with \`pydantic.VERSION\`.
**8. Validating internal objects with Pydantic everywhere.** Constructing a \`BaseModel\` runs validation; doing that for every intermediate object in a hot loop can be 10x slower than a dataclass. Fix: validate once at the boundary, then convert to a dataclass or pass the already-validated model through.
**9. Forgetting \`@classmethod\` under \`@field_validator\`.** The decorator order must be \`@field_validator("x")\` on top and \`@classmethod\` below; otherwise Pydantic raises a confusing error at class creation.
**10. Suppressing the whole checker.** A bare \`# type: ignore\` or \`# noqa\` with no code hides every future error on that line too. Fix: always include the code (\`# type: ignore[arg-type]\`, \`# noqa: F401\`) and treat each one as technical debt.`,
      codeSnippet: `# mistakes_fixed.py
from dataclasses import dataclass, field
from pydantic import BaseModel, field_validator


# Mistake 2 -> fix: default_factory and None sentinel
@dataclass
class Cart:
    items: list[str] = field(default_factory=list)


def add_tag(tag: str, tags: list[str] | None = None) -> list[str]:
    tags = [] if tags is None else tags
    tags.append(tag)
    return tags


# Mistake 3 -> fix: narrow None before use
def initials(full_name: str | None) -> str:
    if full_name is None:
        return "?"
    return "".join(part[0].upper() for part in full_name.split())


# Mistake 6 -> fix: frozen dataclass with derived field set via object.__setattr__
@dataclass(frozen=True)
class Rect:
    width: float
    height: float
    area: float = field(init=False)

    def __post_init__(self) -> None:
        object.__setattr__(self, "area", self.width * self.height)


# Mistake 7 and 9 -> fix: v2 API with the correct decorator order
class Signup(BaseModel):
    username: str

    @field_validator("username")      # field_validator first...
    @classmethod                      # ...then classmethod
    def no_spaces(cls, v: str) -> str:
        if " " in v:
            raise ValueError("username cannot contain spaces")
        return v.lower()


print(Cart().items is Cart().items)                 # False: separate lists
print(add_tag("a"), add_tag("b"))                   # ['a'] ['b']
print(initials("ravindra nath jha"), initials(None))  # RNJ ?
print(Rect(3, 4).area)                              # 12.0
print(Signup(username="Asha_Verma").model_dump())   # {'username': 'asha_verma'}`
    },
    {
      heading: "15. Frequently Asked Questions about Python Type Hints, Dataclasses and Pydantic",
      content: `**Do Python type hints affect performance?**
No. Annotations are stored as metadata and ignored by the interpreter; from Python 3.14 they are not even evaluated until something asks for them (PEP 649/749). The only cost is at import time for complex expressions, which is negligible. Pydantic validation does have a runtime cost, but that is the validation you asked for, not the hints themselves.
**What is the difference between a dataclass and a Pydantic model?**
A dataclass generates boilerplate (\`__init__\`, \`__repr__\`, \`__eq__\`) and trusts whatever you pass in. A Pydantic \`BaseModel\` additionally validates and converts input at runtime and can serialise to and from JSON. Use dataclasses for trusted internal objects and Pydantic for data arriving from users, APIs, files or the environment.
**Should I use Optional[str] or str | None?**
Use \`str | None\`. It has been the recommended syntax since Python 3.10, needs no import, and reads naturally. \`Optional[str]\` is identical in meaning and still works, so you will see it in older code.
**Is mypy or pyright better?**
Both are excellent. pyright is faster, infers more and is what VS Code's Pylance uses, so editor feedback matches it exactly. mypy has the longest history, a plugin system (the Pydantic plugin, Django stubs) and is what most CI pipelines expect. Pick one, run it on every pull request and do not switch casually, because their strict modes disagree on edge cases.
**What does frozen=True do in a dataclass?**
It makes instances immutable: any assignment to a field raises \`FrozenInstanceError\`. Because the fields cannot change, Python also generates a \`__hash__\`, so frozen instances can be dictionary keys and set members. Use it for value objects like money, coordinates or configuration snapshots.
**What is a Protocol in Python and when should I use it?**
A \`Protocol\` is a class that describes a set of methods and attributes; any object that has them satisfies the protocol without inheriting from it (structural typing). Use it to type a dependency by its behaviour, for example a \`Notifier\` with a \`send\` method, so production classes and test fakes both fit without a shared base class.
**Does ruff replace Black and flake8?**
Yes. \`ruff format\` is a Black-compatible formatter and \`ruff check\` implements the rules of flake8, isort, pyupgrade, bugbear and many other plugins, in a single fast binary with one configuration block. Most new projects use only ruff.
**Is Pydantic v1 still supported?**
Pydantic v1 is in maintenance mode only; v2 is the actively developed line and the one FastAPI, LangChain and most libraries now require. New code should use v2 and the \`model_*\` method names. A \`pydantic.v1\` compatibility namespace exists inside v2 for migrating old code gradually.`
    },
    {
      heading: "16. Interview Questions and Answers on Python Type Hints, Dataclasses, Pydantic and Clean Code",
      content: `**Q1. Are type hints enforced by the Python interpreter? What are they for?**
No. CPython stores annotations but never checks them. They exist for static type checkers (mypy, pyright), editors (autocomplete, refactoring) and runtime libraries that introspect them (Pydantic, dataclasses, FastAPI). Enforcement at runtime only happens when a library such as Pydantic explicitly reads the hints and validates.
**Q2. What is the difference between list[int] and List[int]?**
They mean the same thing to a checker. \`list[int]\` uses the built-in class as a generic, available since Python 3.9 (PEP 585). \`typing.List\` is the older alias, now deprecated. Prefer the built-in form; ruff's \`UP006\` rule converts automatically.
**Q3. Explain type narrowing with an example.**
Narrowing is when a checker refines a union type based on control flow. Given \`user: User | None\`, after \`if user is None: return\` the checker knows \`user\` is a \`User\` for the rest of the function, so \`user.email\` is allowed. \`isinstance\`, \`match\`, \`assert\` and \`TypeIs\`/\`TypeGuard\` functions also narrow.
**Q4. When would you choose a Protocol over an abstract base class?**
Use a Protocol when you want structural typing: any object with the right methods qualifies, including classes from third-party libraries or test fakes that cannot inherit from your base. Use an ABC when you want to share implementation in the base class or force explicit subclassing and registration.
**Q5. What does the PEP 695 syntax def first[T](items: list[T]) -> T mean?**
It declares a generic function with a type parameter \`T\` scoped to that function (Python 3.12+). The checker binds \`T\` at each call: \`first([1, 2])\` returns \`int\`, \`first(["a"])\` returns \`str\`. Before 3.12 the same was written with \`T = TypeVar("T")\` at module level.
**Q6. Why does a dataclass reject items: list = [] as a default, and what is the fix?**
Because the single list object would be shared by every instance, so appending on one instance would change all of them. Dataclasses detect mutable defaults (list, dict, set) and raise \`ValueError\`. The fix is \`field(default_factory=list)\`, which calls the factory for each new instance.
**Q7. What do frozen=True and slots=True do, and can you combine them?**
\`frozen=True\` makes instances immutable and hashable; \`slots=True\` (3.10+) replaces the per-instance \`__dict__\` with fixed slots, reducing memory by about a third and speeding attribute access. They combine well: \`@dataclass(frozen=True, slots=True)\` is the standard recipe for small value objects.
**Q8. What is the difference between Pydantic's lax and strict mode?**
In lax mode (the default) Pydantic coerces compatible inputs: \`"42"\` becomes \`42\`, \`"2026-01-01"\` becomes a date. In strict mode (\`ConfigDict(strict=True)\` or \`Field(strict=True)\`) the input must already be the exact type, so \`"42"\` for an \`int\` field is an error. Lax is ideal at HTTP boundaries; strict is for internal data where silent conversion would hide bugs.
**Q9. How do field_validator and model_validator differ in Pydantic v2?**
\`@field_validator("name")\` validates or transforms one field (in \`before\` or \`after\` mode) and is a classmethod receiving the value. \`@model_validator(mode="after")\` receives the whole constructed model and is used for cross-field rules such as "end date after start date". Field validators run first; if they fail, the model validator does not run.
**Q10. What is ruff and why do teams prefer it over flake8 plus Black?**
ruff is a Rust-based linter and formatter that implements the rules of flake8, isort, pyupgrade, bugbear and others, plus a Black-compatible formatter, in one tool that runs 10-100x faster. One binary, one \`[tool.ruff]\` config block and automatic fixes make it simpler to adopt in pre-commit and CI.`
    },
    {
      heading: "17. Hands-On Exercise: A Type-Checked Order Pipeline with Pydantic, Dataclasses, Protocol and Generics",
      content: `Build a small but complete order-processing program that uses every idea from this lecture together. Incoming orders arrive as raw JSON (untrusted), so they are validated with a **Pydantic v2** model. Valid orders are converted to a **frozen, slotted dataclass** for the core logic. Storage is described by a **Protocol** so the in-memory implementation could later be swapped for a database. A **PEP 695 generic** helper groups any list by a key, and the final report rows are a **TypedDict**. The whole file should pass \`mypy --strict\` and \`ruff check\` without changes.
**Setup**
1. \`uv init order-pipeline\` then \`cd order-pipeline\` (or create a folder and a virtual environment).
2. \`uv add pydantic\` and \`uv add --dev mypy ruff\` (or \`pip install pydantic mypy ruff\`).
3. Save the code below as \`clean_orders.py\` and run \`python clean_orders.py\` (Python 3.12 or newer, because of the \`[K, V]\` generic syntax).
4. Run \`ruff check clean_orders.py\`, \`ruff format --check clean_orders.py\` and \`mypy --strict clean_orders.py\`. All three should report no problems.
**Expected output**
The program accepts three of the five orders, rejects one for an unsupported city and another for a negative amount and empty item list, uppercases a lowercase order id through a validator, and prints a per-city revenue report with a grand total of Rs 8,798.49.
**Extensions to try**
• Add a \`JsonFileStore\` class that satisfies \`OrderStore\` by writing to a file with \`pathlib\`; because of the Protocol, \`main()\` does not change.
• Add a \`@model_validator\` that rejects orders over Rs 50,000 unless \`customer\` contains a company name.
• Replace \`City\` with an \`Enum\` and observe how Pydantic's error message changes.
• Turn \`OrderIn\` into a FastAPI request body as shown in section 13 and test it from the Swagger page.`,
      codeSnippet: `# clean_orders.py  - requires Python 3.12+ and Pydantic 2.x (uv add pydantic)
# Run:   python clean_orders.py
# Check: ruff check clean_orders.py && mypy --strict clean_orders.py
from __future__ import annotations

import json
from collections.abc import Callable
from dataclasses import dataclass
from decimal import Decimal
from typing import Literal, Protocol, TypedDict

from pydantic import BaseModel, ConfigDict, Field, ValidationError, field_validator

# ---------- 1. Boundary layer: Pydantic validates untrusted JSON ----------
City = Literal["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Pune"]


class OrderIn(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    order_id: str = Field(min_length=6, max_length=12)
    customer: str = Field(min_length=2)
    city: City
    amount_inr: Decimal = Field(gt=0, max_digits=10, decimal_places=2)
    items: list[str] = Field(min_length=1)

    @field_validator("order_id")
    @classmethod
    def normalise_id(cls, value: str) -> str:
        return value.upper()


# ---------- 2. Core domain: immutable, memory-efficient dataclass ----------
@dataclass(frozen=True, slots=True)
class Order:
    order_id: str
    customer: str
    city: str
    amount_inr: Decimal
    items: tuple[str, ...]

    @classmethod
    def from_input(cls, data: OrderIn) -> Order:
        return cls(
            order_id=data.order_id,
            customer=data.customer,
            city=data.city,
            amount_inr=data.amount_inr,
            items=tuple(data.items),
        )


# ---------- 3. Behaviour contract: any class with these methods fits ----------
class OrderStore(Protocol):
    def add(self, order: Order) -> None: ...
    def all(self) -> list[Order]: ...


class InMemoryStore:
    def __init__(self) -> None:
        self._orders: list[Order] = []

    def add(self, order: Order) -> None:
        self._orders.append(order)

    def all(self) -> list[Order]:
        return list(self._orders)


# ---------- 4. Generic helper (PEP 695) and TypedDict report row ----------
def group_by[K, V](items: list[V], key: Callable[[V], K]) -> dict[K, list[V]]:
    groups: dict[K, list[V]] = {}
    for item in items:
        groups.setdefault(key(item), []).append(item)
    return groups


class CityReport(TypedDict):
    city: str
    orders: int
    revenue_inr: Decimal


def build_report(store: OrderStore) -> list[CityReport]:
    by_city = group_by(store.all(), key=lambda o: o.city)
    report: list[CityReport] = []
    for city, orders in by_city.items():
        revenue = sum((o.amount_inr for o in orders), Decimal(0))
        report.append({"city": city, "orders": len(orders), "revenue_inr": revenue})
    return sorted(report, key=lambda row: row["revenue_inr"], reverse=True)


# ---------- 5. Untrusted input (imagine this came from an HTTP request) ----------
RAW_PAYLOAD = """
[
  {"order_id": "ORD-1001", "customer": "Asha Verma", "city": "Mumbai",
   "amount_inr": "2499.00", "items": ["Headphones"]},
  {"order_id": "ORD-1002", "customer": "Rahul Nair", "city": "Bengaluru",
   "amount_inr": 1299.50, "items": ["Keyboard", "Mouse"]},
  {"order_id": "ORD-1003", "customer": "Priya Sen", "city": "Kolkata",
   "amount_inr": 999, "items": ["Book"]},
  {"order_id": "ORD-1004", "customer": "Neha Gupta", "city": "Mumbai",
   "amount_inr": -50, "items": []},
  {"order_id": "ord-1005", "customer": "Karan Mehta", "city": "Pune",
   "amount_inr": "4999.99", "items": ["Monitor"]}
]
"""


def describe_errors(exc: ValidationError) -> str:
    parts: list[str] = []
    for err in exc.errors():
        location = ".".join(str(p) for p in err["loc"])
        parts.append(f"{location}: {err['msg']}")
    return "; ".join(parts)


def main() -> None:
    store: OrderStore = InMemoryStore()   # could be swapped for a DB-backed store
    raw_orders: list[dict[str, object]] = json.loads(RAW_PAYLOAD)

    for raw in raw_orders:
        try:
            validated = OrderIn.model_validate(raw)
        except ValidationError as exc:
            print(f"REJECTED {raw.get('order_id')}: {describe_errors(exc)}")
            continue
        store.add(Order.from_input(validated))
        print(f"ACCEPTED {validated.order_id} ({validated.city})")

    print("\\nRevenue by city")
    print("-" * 40)
    total = Decimal(0)
    for row in build_report(store):
        total += row["revenue_inr"]
        city, count, revenue = row["city"], row["orders"], row["revenue_inr"]
        print(f"{city:<12}{count:>3} orders   Rs {revenue:>10,.2f}")
    print("-" * 40)
    print(f"{'TOTAL':<12}{len(store.all()):>3} orders   Rs {total:>10,.2f}")


if __name__ == "__main__":
    main()

# Expected output:
# ACCEPTED ORD-1001 (Mumbai)
# ACCEPTED ORD-1002 (Bengaluru)
# REJECTED ORD-1003: city: Input should be 'Mumbai', 'Delhi', 'Bengaluru',
#                    'Hyderabad' or 'Pune'
# REJECTED ORD-1004: amount_inr: Input should be greater than 0; items: List should
#                    have at least 1 item after validation, not 0
# (the two REJECTED lines are each printed on one line; wrapped here for width)
# ACCEPTED ORD-1005 (Pune)
#
# Revenue by city
# ----------------------------------------
# Pune          1 orders   Rs   4,999.99
# Mumbai        1 orders   Rs   2,499.00
# Bengaluru     1 orders   Rs   1,299.50
# ----------------------------------------
# TOTAL         3 orders   Rs   8,798.49`
    },
    {
      heading: "18. Summary",
      content: `• **Type hints** (PEP 484) document and enable checking of your code but are **not enforced** by the interpreter; mypy and pyright check them statically, editors use them for autocomplete, and libraries such as Pydantic read them at runtime.
• Use **built-in generics** \`list[int]\`, \`dict[str, float]\`, \`tuple[int, ...]\` (Python 3.9+) and **\`X | None\`** instead of \`Optional\` (3.10+). Always narrow \`None\` before use.
• **TypedDict** describes the shape of JSON-like dictionaries, **Literal** restricts values to constants, **Final** marks constants, and the **\`type\`** statement (3.12) names aliases.
• **Protocol** gives duck typing a static contract: any object with the right methods fits, which makes dependency injection and test fakes easy.
• **PEP 695** (3.12) generics: \`def first[T](items: list[T]) -> T\`, \`class Stack[T]\`, bounds with \`[T: Base]\`, and \`[**P, R]\` for signature-preserving decorators.
• Run **mypy** (\`strict = true\`) or **pyright** on every pull request; use \`reveal_type()\` to debug and \`# type: ignore[code]\` only with a specific code.
• **@dataclass** generates \`__init__\`, \`__repr__\` and \`__eq__\`; use \`field(default_factory=...)\` for mutable defaults, \`__post_init__\` for derived values, **\`frozen=True\`** for immutable hashable value objects, **\`slots=True\`** for memory, \`kw_only=True\` for safety.
• **Pydantic v2** validates and converts untrusted data with \`BaseModel\`, \`Field()\` constraints, \`field_validator\`, \`model_validator\`, \`model_validate\` and \`model_dump\`; it powers FastAPI and \`pydantic-settings\`.
• Choose **TypedDict** for raw dicts, **dataclass** for trusted internal objects, **Pydantic** at trust boundaries.
• Follow **PEP 8** naming and layout, write idiomatic code (direct iteration, comprehensions, EAFP, early returns, f-strings, pathlib), and let **ruff** lint and format automatically in pre-commit and CI.
**Next lecture:** Asynchronous Python — asyncio & Concurrency`
    }
  ]
};
