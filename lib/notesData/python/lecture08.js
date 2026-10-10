export const lecture08 = {
  slug: "lecture-8",
  number: 8,
  title: "Complete Python Course — Lecture 8: Errors, Exceptions, Debugging & Logging",
  summary: "Master Python exception handling: try/except/else/finally, catching specific exceptions, raise from, custom exception classes, ExceptionGroup and except*, assertions, debugging with breakpoint(), pdb and VS Code, and the logging module with levels, handlers and formatters.",
  readTime: "70 min read",
  difficulty: "Intermediate",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. Introduction: Why Error Handling, Debugging and Logging Matter in Real Python Projects",
      content: `Every program that talks to the outside world will eventually meet something it did not expect: a file that is missing, a network call that times out, a user who types "ten" instead of 10, a database row that is \`None\`. Beginners write code for the "happy path" only. Professionals write code that **expects failure**, handles it in a controlled way, and leaves enough evidence behind to understand what went wrong at 2 a.m. when the server was in Mumbai and the developer was asleep.
Python gives you three connected tools for this, and this lecture covers all of them:
• **Exceptions** — the language's mechanism for signalling that something went wrong, interrupting normal flow, and letting the right layer of your program decide what to do. You will learn \`try\`/\`except\`/\`else\`/\`finally\`, how to catch the right exception (and not the wrong one), how to \`raise\` your own, how to build a clean hierarchy of **custom exception classes**, how **exception chaining** with \`raise from\` preserves the root cause, and how Python 3.11's **ExceptionGroup** and \`except*\` handle several failures at once.
• **Debugging** — finding out why code misbehaves. We go beyond \`print()\` to \`breakpoint()\`, the built-in **pdb** debugger, and the **VS Code debugger** with breakpoints, watches and step-through execution.
• **Logging** — recording what the program did, at what time, with what severity, so you can diagnose production issues. The \`logging\` module (levels, handlers, formatters) replaces scattered \`print()\` calls with something you can filter, route to files, rotate, and ship to monitoring tools.
Why does this matter for your career? In interviews for Python developer roles, exception handling questions are almost guaranteed. In real jobs — whether you work on a FastAPI backend for a fintech startup in Bengaluru or a pandas pipeline for a bank — the difference between a junior and a mid-level developer is often exactly this: the junior's script crashes with a bare traceback; the mid-level developer's service logs a structured error, retries safely, and keeps serving other users.
This lecture assumes you know functions, classes and modules from Lectures 1–7. All examples run on **Python 3.12+**; features that need a newer version are labelled (for example, \`except*\` needs 3.11, and the latest stable line at the time of writing is Python 3.14, with 3.15 scheduled for October 2026 — check python.org/downloads for the current release).`
    },
    {
      heading: "2. Syntax Errors vs Exceptions in Python: Two Very Different Kinds of Error",
      content: `Python errors fall into two families, and confusing them is the first mistake beginners make.
A **syntax error** (\`SyntaxError\`, and its subclass \`IndentationError\`) happens **before your program runs**. The Python parser reads your file, finds something that is not valid Python — a missing colon, unbalanced brackets, a tab mixed with spaces — and refuses to execute a single line. You cannot catch a syntax error in the same file with \`try\`/\`except\`, because the file never got as far as running. The only fix is to correct the code. Since Python 3.10 the parser gives much better messages ("Did you mean ...?", "'(' was never closed"), so read them carefully.
An **exception** happens **while the program is running**. The syntax was fine, but something went wrong during execution: \`10 / 0\` raises \`ZeroDivisionError\`, \`int("abc")\` raises \`ValueError\`, \`open("missing.txt")\` raises \`FileNotFoundError\`, \`my_dict["nokey"]\` raises \`KeyError\`. When an exception is raised and nothing catches it, Python stops and prints a **traceback**: the chain of function calls that led to the error, with file names and line numbers, most recent call last. Since Python 3.11, tracebacks also underline the exact expression that failed with \`^^^^\` markers, which is a huge help when a single line contains several calls.
Learn to read tracebacks bottom-up: the **last line** names the exception type and message; the lines above show **where** it happened, with the innermost (most recent) call at the bottom. In a traceback of twenty frames, the first few frames you own (your project files, not \`site-packages\`) are where the fix usually belongs.
All exceptions are objects. They inherit from \`BaseException\`, and almost all of the ones you will ever handle inherit from its child \`Exception\`. The hierarchy matters because catching a parent class catches all of its children — we exploit that in Section 3.`,
      codeSnippet: `# syntax_vs_exception.py

# ---------- 1. A syntax error: caught by the parser, program never starts ----------
# def greet(name)          # <-- missing colon
#     print("Hello", name)
#
# Running this file prints:
#   File "syntax_vs_exception.py", line 4
#     def greet(name)
#                    ^
# SyntaxError: expected ':'

# ---------- 2. Exceptions: raised at runtime, catchable ----------
def average(values: list[float]) -> float:
    return sum(values) / len(values)

print(average([80, 90, 100]))   # 90.0

try:
    print(average([]))          # len([]) == 0 -> ZeroDivisionError
except ZeroDivisionError as err:
    print("Caught:", type(err).__name__, "-", err)
# Caught: ZeroDivisionError - division by zero

# ---------- 3. What an uncaught exception looks like (Python 3.11+) ----------
# prices = {"idli": 40, "dosa": 70}
# total = prices["idli"] + prices["vada"]
#
# Traceback (most recent call last):
#   File "syntax_vs_exception.py", line 24, in <module>
#     total = prices["idli"] + prices["vada"]
#                              ~~~~~~^^^^^^^^
# KeyError: 'vada'

# ---------- 4. Every exception is an object with a class and arguments ----------
err = ValueError("quantity must be positive", -3)
print(type(err), err.args)   # <class 'ValueError'> ('quantity must be positive', -3)
print(isinstance(err, Exception), isinstance(err, BaseException))  # True True`
    },
    {
      heading: "3. try / except / else / finally: The Complete Flow of Python Exception Handling",
      content: `The \`try\` statement has four optional parts, and understanding exactly when each one runs is the core skill of this lecture.
• **\`try\`** — the block that might fail. Keep it **small**: only the lines that can actually raise the exception you intend to handle. A 40-line \`try\` block is a sign you do not know where the error comes from.
• **\`except SomeError [as name]\`** — runs **only if** an exception of that type (or a subclass) was raised in the \`try\` block. You can have several \`except\` clauses; Python checks them **top to bottom** and runs the **first** that matches. The \`as name\` part binds the exception object so you can inspect its message, its \`args\`, or re-raise it. Note: that name is **deleted** when the \`except\` block ends, so copy it to another variable if you need it later.
• **\`else\`** — runs **only if no exception** was raised. Put the "success path" code here instead of inside \`try\`, so a bug in the success code is not accidentally caught by the \`except\` meant for the risky line.
• **\`finally\`** — **always** runs: after success, after a handled exception, after an unhandled exception, and even if the \`try\` block executes \`return\`. Use it for cleanup: closing files, releasing locks, rolling back transactions, stopping timers. (In practice, \`with\` statements — context managers — do this more elegantly for files and connections; \`finally\` is for everything else.)
**Order of execution:** try → (except if error) or (else if no error) → finally. If an \`except\` clause itself raises, \`finally\` still runs and then the new exception propagates.
A subtle trap: a \`return\`, \`break\` or \`continue\` inside \`finally\` **overrides** any exception or return value from the \`try\` block, silently swallowing errors. This is such a common bug that **Python 3.14 (PEP 765)** now emits a \`SyntaxWarning\` for it. Never do it.
Catching a **tuple of exceptions** — \`except (ValueError, TypeError):\` — handles several types with one block. **Python 3.14 (PEP 758)** also lets you drop the parentheses when there is no \`as\` clause: \`except ValueError, TypeError:\`. On 3.13 and earlier the parentheses are mandatory, so keep them in code that must run on older versions.`,
      codeSnippet: `# try_flow.py
from pathlib import Path


def load_marks(path: str) -> list[int]:
    """Read one integer per line from a marks file."""
    file = None
    try:
        file = open(path, encoding="utf-8")          # may raise FileNotFoundError
        marks = [int(line) for line in file]         # may raise ValueError
    except FileNotFoundError:
        print(f"[warn] {path} not found, using empty list")
        return []
    except ValueError as err:
        print(f"[error] bad number in {path}: {err}")
        raise                                         # re-raise to the caller
    else:
        print(f"[ok] loaded {len(marks)} marks")      # only when no exception
        return marks
    finally:
        if file is not None:
            file.close()                              # always runs, even on return/raise
            print("[cleanup] file closed")


# --- demo ---
Path("marks.txt").write_text("78\\n92\\n85\\n", encoding="utf-8")
print(load_marks("marks.txt"))
# [ok] loaded 3 marks
# [cleanup] file closed
# [78, 92, 85]

print(load_marks("nope.txt"))
# [warn] nope.txt not found, using empty list
# [cleanup] file closed   <- finally still runs (file was None, nothing to close)
# []

Path("bad.txt").write_text("78\\nabc\\n", encoding="utf-8")
try:
    load_marks("bad.txt")
except ValueError:
    print("caller handled the re-raised ValueError")
# [error] bad number in bad.txt: invalid literal for int() with base 10: 'abc'
# [cleanup] file closed
# caller handled the re-raised ValueError

# --- the same file logic, done the modern way with a context manager ---
def load_marks_v2(path: str) -> list[int]:
    try:
        with open(path, encoding="utf-8") as f:      # closes automatically
            return [int(line) for line in f]
    except FileNotFoundError:
        return []`
    },
    {
      heading: "4. Catching Specific Exceptions and the Python Exception Hierarchy",
      content: `The single most important rule of exception handling: **catch the narrowest exception you can actually handle, and let everything else propagate.** To do that you need to know the hierarchy, because \`except X\` catches \`X\` **and every subclass of X**.
The top of the tree is \`BaseException\`. Its direct children are \`Exception\` (almost everything you care about), \`KeyboardInterrupt\` (Ctrl+C), \`SystemExit\` (raised by \`sys.exit()\`), and \`GeneratorExit\`. The last three are deliberately **not** under \`Exception\`, so that \`except Exception:\` does not stop the user from killing the program.
Under \`Exception\`, the groups you will meet daily:
• \`ArithmeticError\` → \`ZeroDivisionError\`, \`OverflowError\`
• \`LookupError\` → \`IndexError\` (bad list index), \`KeyError\` (missing dict key)
• \`ValueError\` (right type, wrong value, e.g. \`int("x")\`) and \`TypeError\` (wrong type, e.g. \`"3" + 3\`)
• \`AttributeError\` (\`obj.missing\`), \`NameError\` (undefined variable), \`ImportError\` → \`ModuleNotFoundError\`
• \`OSError\` → \`FileNotFoundError\`, \`PermissionError\`, \`FileExistsError\`, \`TimeoutError\`, \`ConnectionError\`
• \`RuntimeError\` → \`RecursionError\`, \`NotImplementedError\`; \`StopIteration\`; \`AssertionError\`
Two consequences follow. First, **order your \`except\` clauses from most specific to most general**: if \`except LookupError\` comes before \`except KeyError\`, the \`KeyError\` branch is dead code (Python runs the first match). Second, a **bare \`except:\`** is equivalent to \`except BaseException:\` — it swallows Ctrl+C, \`SystemExit\`, and bugs like \`NameError\` that you want to see. Use \`except Exception:\` as the broadest reasonable catch, and only at the **top level** of a program (a request handler, a worker loop) where you log the error and move on.
When you are not sure which exception a call raises, do not guess: read the docs, or trigger it once in the REPL and look at the traceback. \`type(err).__mro__\` prints the full class chain of any exception object.`,
      codeSnippet: `# specific_exceptions.py
import json

ORDERS = {"ORD-101": {"customer": "Priya", "total_inr": 1499}}


def get_order_total(order_id: str, raw_json: str | None = None) -> int:
    try:
        order = ORDERS[order_id] if raw_json is None else json.loads(raw_json)
        total = order["total_inr"]
        return int(total)
    except KeyError as err:                     # specific: missing order or missing field
        print(f"missing key: {err}")
        return 0
    except json.JSONDecodeError as err:         # subclass of ValueError, so it must come first
        print(f"bad JSON at position {err.pos}: {err.msg}")
        return 0
    except (TypeError, ValueError) as err:      # tuple: several types, one handler
        print(f"bad total value: {err}")
        return 0


print(get_order_total("ORD-101"))                                 # 1499
print(get_order_total("ORD-999"))                                 # missing key: 'ORD-999'  -> 0
print(get_order_total("x", raw_json='{"total_inr": "abc"}'))      # bad total value: ...   -> 0
print(get_order_total("x", raw_json="{not json}"))                # bad JSON at position 1 ... -> 0

# The hierarchy in action: a parent class catches its children
for bad_call in (lambda: [1, 2][5], lambda: {}["k"]):
    try:
        bad_call()
    except LookupError as err:                  # catches IndexError AND KeyError
        print("LookupError caught:", type(err).__name__)
# LookupError caught: IndexError
# LookupError caught: KeyError

# Inspecting the chain of an exception class
print([cls.__name__ for cls in FileNotFoundError.__mro__])
# ['FileNotFoundError', 'OSError', 'Exception', 'BaseException', 'object']

# WRONG ORDER: the second clause can never run (Python warns about nothing here!)
# try: ...
# except Exception: ...
# except ValueError: ...   # dead code`
    },
    {
      heading: "5. Raising Exceptions with raise and Writing Custom Exception Classes",
      content: `Handling exceptions is half the story; a well-designed function also **raises** them. The \`raise\` statement takes an exception instance (preferred: \`raise ValueError("amount must be positive")\`) or a class (\`raise ValueError\`, which Python instantiates with no message — less helpful). Raise when your function **cannot fulfil its contract**: invalid arguments, impossible state, a dependency that failed. Do **not** return \`None\` or \`-1\` as an error code; callers forget to check, and the real failure surfaces three functions later with a confusing \`TypeError\`.
Inside an \`except\` block, a **bare \`raise\`** re-raises the current exception unchanged, preserving the original traceback. This is the right way to "log and propagate": catch, log, \`raise\`. Writing \`raise err\` instead works but adds an extra, misleading frame to the traceback.
**Custom exception classes** turn your application's failure modes into a vocabulary. Instead of callers catching a generic \`ValueError\` and guessing what it means, they catch \`InsufficientBalanceError\` or \`PaymentGatewayError\`. The pattern used in professional codebases:
1. Define **one base class** for your package: \`class BankError(Exception)\`. Callers who want "anything from this library" catch the base.
2. Derive specific classes from it, grouped by concern: \`class ValidationError(BankError)\`, \`class InsufficientBalanceError(BankError)\`.
3. Add **structured attributes** (account id, amount, error code) via \`__init__\`, and call \`super().__init__(message)\` so \`str(err)\` and \`err.args\` still work. These attributes let a FastAPI handler build a precise JSON error response without parsing message strings.
4. Keep the class body small. Exceptions are data carriers, not places for business logic.
Name the class with an \`Error\` suffix (PEP 8), inherit from \`Exception\` (never from \`BaseException\`), and put all of them in one module such as \`myapp/errors.py\` so they are easy to find and import. Libraries you use daily follow this exactly: \`requests.RequestException\` → \`ConnectionError\`, \`Timeout\`, \`HTTPError\`; \`pydantic.ValidationError\`; \`sqlalchemy.exc.SQLAlchemyError\`.`,
      codeSnippet: `# bank/errors.py
class BankError(Exception):
    """Base class for every error raised by the bank package."""


class ValidationError(BankError):
    """Input failed validation (bad amount, bad account id)."""


class AccountNotFoundError(BankError):
    def __init__(self, account_id: str) -> None:
        super().__init__(f"account {account_id!r} does not exist")
        self.account_id = account_id


class InsufficientBalanceError(BankError):
    def __init__(self, account_id: str, balance: float, requested: float) -> None:
        super().__init__(
            f"account {account_id}: balance ₹{balance:,.2f} < requested ₹{requested:,.2f}"
        )
        self.account_id = account_id
        self.balance = balance
        self.requested = requested
        self.shortfall = requested - balance


# bank/service.py
ACCOUNTS: dict[str, float] = {"SBI-001": 5_000.0, "HDFC-777": 120.5}


def withdraw(account_id: str, amount: float) -> float:
    if amount <= 0:
        raise ValidationError(f"amount must be positive, got {amount}")
    if account_id not in ACCOUNTS:
        raise AccountNotFoundError(account_id)
    balance = ACCOUNTS[account_id]
    if amount > balance:
        raise InsufficientBalanceError(account_id, balance, amount)
    ACCOUNTS[account_id] = balance - amount
    return ACCOUNTS[account_id]


# main.py
if __name__ == "__main__":
    for acc, amt in [("SBI-001", 1200), ("HDFC-777", 500), ("ICICI-9", 10), ("SBI-001", -5)]:
        try:
            print(f"{acc}: new balance ₹{withdraw(acc, amt):,.2f}")
        except InsufficientBalanceError as err:          # most specific first
            print(f"declined: short by ₹{err.shortfall:,.2f}")
        except BankError as err:                         # any other bank error
            print(f"{type(err).__name__}: {err}")
# SBI-001: new balance ₹3,800.00
# declined: short by ₹379.50
# AccountNotFoundError: account 'ICICI-9' does not exist
# ValidationError: amount must be positive, got -5

    # bare raise: log and propagate, traceback intact
    def audited_withdraw(acc: str, amt: float) -> float:
        try:
            return withdraw(acc, amt)
        except BankError as err:
            print(f"AUDIT: failed withdraw {acc} {amt}: {err}")
            raise                                        # not 'raise err'`
    },
    {
      heading: "6. Exception Chaining in Python: raise from, __cause__, __context__ and add_note()",
      content: `When you catch a low-level exception and raise a higher-level one, you must not lose the original. Python's **exception chaining** keeps both and prints both in the traceback.
There are two kinds of chaining:
• **Implicit chaining (\`__context__\`)** — if an exception is raised *while handling* another one (inside an \`except\` or \`finally\` block), Python automatically records the earlier one in \`new_exc.__context__\`. The traceback shows "During handling of the above exception, another exception occurred:". This is automatic and tells you "something failed, and then the error handler also failed".
• **Explicit chaining (\`raise ... from original\`)** — sets \`new_exc.__cause__\` and prints "The above exception was the direct cause of the following exception:". Use it when you are **deliberately translating** an exception: a \`KeyError\` from a config dict becomes a \`ConfigError("missing DATABASE_URL")\`; a \`socket.timeout\` becomes \`PaymentGatewayError\`. The reader sees the clean, meaningful error **and** the root cause.
• **\`raise ... from None\`** suppresses the context entirely. Use it only when the inner exception is genuinely noise — for example, your \`__getitem__\` catching an internal \`KeyError\` and raising a cleaner \`KeyError\` of its own, where showing the first one would just confuse users.
**\`add_note()\` (Python 3.11, PEP 678)** lets you attach extra lines of context to an existing exception without wrapping it: \`err.add_note(f"while processing order {order_id}")\`. The notes are printed after the message in the traceback. This is perfect for loops and retries: catch, add a note saying which item failed, re-raise with a bare \`raise\`. Libraries like pytest and Hypothesis use it to annotate failures.
Inspect chains programmatically with \`err.__cause__\`, \`err.__context__\`, \`err.__suppress_context__\` and \`err.__notes__\`; the \`traceback\` module (\`traceback.format_exception(err)\`) renders the full chain as a string — useful when you need to store a traceback in a database or send it to an alerting system.`,
      codeSnippet: `# chaining.py
import traceback


class ConfigError(Exception):
    pass


def read_setting(config: dict, key: str) -> str:
    try:
        return config[key]
    except KeyError as err:
        # explicit chaining: clean message for the caller, root cause preserved
        raise ConfigError(f"required setting {key!r} is missing") from err


try:
    read_setting({"DEBUG": "1"}, "DATABASE_URL")
except ConfigError as err:
    print("cause:", repr(err.__cause__))            # cause: KeyError('DATABASE_URL')
    print("".join(traceback.format_exception(err)))
# Traceback (most recent call last):
#   File "chaining.py", line 10, in read_setting
#     return config[key]
#            ~~~~~~^^^^^
# KeyError: 'DATABASE_URL'
#
# The above exception was the direct cause of the following exception:
#
# Traceback (most recent call last):
#   ...
# ConfigError: required setting 'DATABASE_URL' is missing


# implicit chaining: an error inside an error handler
def risky_cleanup():
    try:
        1 / 0
    except ZeroDivisionError:
        open("/no/such/dir/log.txt")        # FileNotFoundError, __context__ = ZeroDivisionError

try:
    risky_cleanup()
except FileNotFoundError as err:
    print("context:", repr(err.__context__))   # context: ZeroDivisionError('division by zero')


# 'from None' hides the internal detail on purpose
class Settings:
    def __init__(self, data: dict) -> None:
        self._data = data

    def __getitem__(self, key: str) -> str:
        try:
            return self._data[key.lower()]
        except KeyError:
            raise KeyError(f"no setting named {key}") from None   # single, clean traceback


# add_note() (Python 3.11+): enrich without wrapping
orders = [("ORD-1", "1499"), ("ORD-2", "12x9"), ("ORD-3", "999")]
for order_id, amount in orders:
    try:
        total = int(amount)
    except ValueError as err:
        err.add_note(f"while parsing amount for {order_id}")
        err.add_note("hint: amounts must be plain integers in paise or rupees")
        print(err.__notes__)   # ['while parsing amount for ORD-2', 'hint: ...']
        # raise            # would print the notes under the ValueError message`
    },
    {
      heading: "7. Exception Groups and except* in Python 3.11+",
      content: `Classic exception handling assumes **one** failure at a time. Modern code often has several: you launch ten concurrent HTTP requests with \`asyncio\` and three fail for different reasons; you validate a form and want to report *all* invalid fields, not just the first. **PEP 654 (Python 3.11)** added two things for this.
**\`ExceptionGroup(message, [exceptions])\`** is an exception that **contains a list of other exceptions** (and may nest other groups). It is raised like any exception. When unhandled, the traceback renders a tree showing every contained exception. There is also \`BaseExceptionGroup\` for groups that include \`KeyboardInterrupt\`-style exceptions; \`ExceptionGroup(...)\` automatically picks the right base class.
**\`except*\`** is a new clause that matches **against the contents of a group**. \`except* ValueError as eg:\` runs if the group contains *any* \`ValueError\`; \`eg\` is a **new ExceptionGroup holding only the matching ones**. Unlike normal \`except\`, **multiple \`except*\` clauses can all run** for the same raised group, each taking its own slice; whatever is left unmatched is re-raised automatically as a smaller group. \`except*\` also works when a plain (non-group) exception is raised — Python wraps it in a group for you.
Useful methods: \`eg.exceptions\` (tuple of members), \`eg.subgroup(predicate_or_type)\` (filter into a new group keeping the nesting), and \`eg.split(type)\` (returns \`(matching, rest)\`).
Where you will meet this in practice: \`asyncio.TaskGroup\` (3.11) raises an \`ExceptionGroup\` when more than one task fails; the \`trio\` library and newer versions of \`anyio\` do the same; \`pytest\` understands groups in assertion reports. You rarely *create* groups in simple scripts — but you will need to *handle* them as soon as you write concurrent code with task groups. Rules: never mix \`except\` and \`except*\` in the same \`try\`; \`break\`, \`continue\` and \`return\` are not allowed inside an \`except*\` block.`,
      codeSnippet: `# exception_groups.py  (Python 3.11+)

def validate_signup(form: dict) -> None:
    """Collect ALL validation problems instead of stopping at the first."""
    problems: list[Exception] = []
    if not form.get("name"):
        problems.append(ValueError("name is required"))
    if "@" not in form.get("email", ""):
        problems.append(ValueError("email looks invalid"))
    if not isinstance(form.get("age"), int):
        problems.append(TypeError("age must be an integer"))
    if form.get("pin") and len(str(form["pin"])) != 6:
        problems.append(ValueError("PIN code must be 6 digits"))
    if problems:
        raise ExceptionGroup("signup validation failed", problems)


form = {"name": "", "email": "ravi.example.com", "age": "27", "pin": 1100}

try:
    validate_signup(form)
except* ValueError as eg:                       # gets a group of ONLY the ValueErrors
    for err in eg.exceptions:
        print("value problem :", err)
except* TypeError as eg:                        # BOTH clauses run for the same group
    for err in eg.exceptions:
        print("type problem  :", err)
# value problem : name is required
# value problem : email looks invalid
# value problem : PIN code must be 6 digits
# type problem  : age must be an integer

# split() / subgroup() for manual handling
try:
    validate_signup(form)
except ExceptionGroup as eg:
    value_errs, rest = eg.split(ValueError)
    print(len(value_errs.exceptions), "ValueErrors;", "rest:", rest)
# 3 ValueErrors; rest: ExceptionGroup('signup validation failed', [TypeError('age must be an integer')])


# Where groups really show up: asyncio.TaskGroup (3.11+)
import asyncio

async def fetch(name: str, fail: bool) -> str:
    await asyncio.sleep(0.01)
    if fail:
        raise ConnectionError(f"{name}: upstream down")
    return f"{name}: ok"

async def main() -> None:
    try:
        async with asyncio.TaskGroup() as tg:
            tg.create_task(fetch("payments", fail=True))
            tg.create_task(fetch("inventory", fail=True))
            tg.create_task(fetch("catalog", fail=False))
    except* ConnectionError as eg:
        print(f"{len(eg.exceptions)} services failed:", [str(e) for e in eg.exceptions])

asyncio.run(main())
# 2 services failed: ['payments: upstream down', 'inventory: upstream down']`
    },
    {
      heading: "8. Assertions in Python: assert, the -O Flag and When Not to Use Them",
      content: `\`assert condition, "message"\` is a **debugging aid**: if \`condition\` is false, Python raises \`AssertionError\` with the optional message. It is shorthand for "I believe this is always true at this point; crash loudly if I am wrong". Use assertions to document and check **internal invariants** — things that can only be false if *your own code* has a bug: a list that should be sorted after your sort step, a balance that should never be negative after your own bookkeeping, a function that should never receive \`None\` from a private helper.
The crucial fact that separates assertions from \`if ... raise\`: **assertions can be switched off.** Running \`python -O script.py\` (optimise mode) sets \`__debug__\` to \`False\` and **removes every \`assert\` statement entirely** — the condition is not even evaluated. Many production deployments and some packaging tools run with \`-O\`. Therefore:
• **Never use \`assert\` to validate user input, API input, or function arguments from outside your module.** In \`-O\` mode, those checks silently vanish, and \`assert user.is_admin\` becomes a security hole. Use \`if not valid: raise ValueError(...)\` for real validation.
• **Never put side effects in an \`assert\`** (\`assert db.save(record)\`) — the save will not happen under \`-O\`.
• A classic bug: \`assert (condition, "message")\` with parentheses. That is a **non-empty tuple**, which is always truthy, so the assertion never fails. Python 3.x emits a \`SyntaxWarning: assertion is always true\` for this; take it seriously.
Where assertions shine: **tests**. \`pytest\` is built around plain \`assert\` and rewrites them to show detailed diffs on failure (\`assert total == 1499\` prints both values). Assertions are also good inside algorithms as executable comments, and in type-narrowing for static checkers (\`assert isinstance(x, int)\` tells mypy/pyright what \`x\` is from that point on).
Think of it this way: an \`if/raise\` protects against the **world** being wrong; an \`assert\` protects against **you** being wrong.`,
      codeSnippet: `# assertions.py
from dataclasses import dataclass


@dataclass
class Cart:
    items: dict[str, int]        # product -> quantity

    def total_qty(self) -> int:
        qty = sum(self.items.values())
        assert qty >= 0, f"quantities can never sum to negative: {self.items}"  # internal invariant
        return qty


def apply_discount(price: float, percent: float) -> float:
    # REAL validation of external input: use raise, NOT assert
    if not (0 <= percent <= 100):
        raise ValueError(f"percent must be between 0 and 100, got {percent}")
    discounted = price * (1 - percent / 100)
    assert 0 <= discounted <= price                     # our own maths invariant
    return discounted


print(apply_discount(2_000, 15))     # 1700.0
try:
    apply_discount(2_000, 150)
except ValueError as err:
    print("rejected:", err)          # rejected: percent must be between 0 and 100, got 150

# What -O does:
print("__debug__ =", __debug__)      # True normally, False under 'python -O assertions.py'
if __debug__:
    print("asserts are active")

# The tuple trap (SyntaxWarning: assertion is always true)
# assert (1 == 2, "this never fails")      # WRONG - a 2-tuple is always truthy
# assert 1 == 2, "this fails as expected"  # RIGHT

# pytest style (run with: pytest assertions.py)
def test_discount():
    assert apply_discount(1000, 10) == 900
    assert Cart({"pen": 2, "book": 1}).total_qty() == 3`
    },
    {
      heading: "9. Debugging Python with breakpoint() and pdb",
      content: `\`print()\` debugging works, but it is slow (edit, run, read, edit again) and it leaves litter in your code. Python ships a real debugger, **pdb** (Python DeBugger), and since **Python 3.7 (PEP 553)** the built-in **\`breakpoint()\`** function is the one-line way to enter it. Put \`breakpoint()\` anywhere; when execution reaches that line, the program **pauses** and you get a \`(Pdb)\` prompt in your terminal, *inside* the running program, with every local variable available.
The essential pdb commands (type \`h\` for the full list):
• \`p expr\` / \`pp expr\` — print (pretty-print) any expression; \`p locals()\` dumps everything.
• \`n\` (next) — run the current line, step **over** function calls.
• \`s\` (step) — step **into** the function called on this line.
• \`r\` (return) — run until the current function returns.
• \`c\` (continue) — resume until the next breakpoint or the end.
• \`l\` / \`ll\` — list code around the current line / the whole current function.
• \`w\` (where) — print the call stack; \`u\` / \`d\` move up/down the stack to inspect caller frames.
• \`b file.py:42\` / \`b func_name\` — set another breakpoint; \`b\` alone lists them; \`cl\` clears.
• \`a\` — print the arguments of the current function; \`q\` — quit the program.
• \`!statement\` — run a Python statement (use when its first word clashes with a pdb command, e.g. \`!n = 5\`).
Other ways in: \`python -m pdb script.py\` starts the script under the debugger from line one (and drops you into post-mortem mode when it crashes). After any uncaught exception in the REPL or a notebook, \`import pdb; pdb.pm()\` opens a **post-mortem** session at the frame that raised. **Python 3.14** adds \`python -m pdb -p PID\` to attach to an already-running Python process (PEP 768 remote debugging) — invaluable for a stuck worker you cannot restart.
Control \`breakpoint()\` with the \`PYTHONBREAKPOINT\` environment variable: \`PYTHONBREAKPOINT=0\` makes every \`breakpoint()\` a no-op (safe for CI), and \`PYTHONBREAKPOINT=ipdb.set_trace\` or \`pudb.set_trace\` swaps in a richer third-party debugger without changing code. Always delete \`breakpoint()\` calls before committing — a stray one will hang a production server. Many teams add a pre-commit hook (or Ruff rule \`T100\`) to block them.`,
      codeSnippet: `# debug_me.py
def gst_total(prices: list[float], gst_percent: float = 18) -> float:
    subtotal = 0
    for p in prices:
        subtotal += p
    breakpoint()                   # <-- execution pauses here; try: p subtotal, p prices, n, c
    gst = subtotal * gst_percent   # BUG: forgot "/ 100"
    return subtotal + gst


if __name__ == "__main__":
    print(gst_total([100, 250.5, 49.5]))

# A session looks like this (your input after the (Pdb) prompt):
#
# $ python debug_me.py
# > /work/debug_me.py(6)gst_total()
# -> gst = subtotal * gst_percent
# (Pdb) p subtotal, gst_percent
# (400.0, 18)
# (Pdb) n
# > /work/debug_me.py(7)gst_total()
# -> return subtotal + gst
# (Pdb) p gst
# 7200.0                      <- obviously wrong, should be 72.0: the bug is on the line above
# (Pdb) w                     <- call stack
#   /work/debug_me.py(11)<module>()
# -> print(gst_total([100, 250.5, 49.5]))
# > /work/debug_me.py(7)gst_total()
# (Pdb) c
# 7600.0
#
# Other entry points:
#   python -m pdb debug_me.py          # start under the debugger, stops at line 1
#   python -m pdb -c continue debug_me.py   # run, drop into pdb only on crash
#   PYTHONBREAKPOINT=0 python debug_me.py   # ignore every breakpoint()
#
# Post-mortem after a crash in the REPL:
#   >>> import pdb; pdb.pm()`
    },
    {
      heading: "10. Debugging Python in VS Code: Breakpoints, Watch, Call Stack and launch.json",
      content: `pdb is always available, but for day-to-day work most developers use a **graphical debugger**. In VS Code, install the official **Python** extension (which pulls in the **Python Debugger** extension, powered by **debugpy**). Then:
1. Open your \`.py\` file and click in the gutter to the left of a line number — a **red dot** marks a breakpoint.
2. Press **F5** (Run → Start Debugging). The first time, VS Code asks for a configuration; choose "Python File". Execution pauses at your breakpoint with the line highlighted.
3. The **Variables** panel shows every local and global, expandable for lists, dicts and objects. The **Watch** panel evaluates expressions you type (\`len(orders)\`, \`total / 1.18\`) and updates them at every pause. The **Call Stack** panel shows how you got here; click a frame to inspect its variables. The **Debug Console** is a live REPL inside the paused program.
4. Step controls (toolbar at the top): **Continue F5**, **Step Over F10** (next line), **Step Into F11** (enter the function), **Step Out Shift+F11**, **Restart**, **Stop**.
Features that save hours:
• **Conditional breakpoints** — right-click the red dot → Edit Breakpoint → an expression such as \`order_id == "ORD-2"\`. The debugger stops only on that iteration of a 10,000-item loop.
• **Hit count** — break on the 500th pass.
• **Logpoints** — a breakpoint that does not pause, just prints a message with \`{expressions}\` to the Debug Console. Non-invasive \`print()\` that never gets committed.
• **Exception breakpoints** — in the Breakpoints panel tick "Raised Exceptions" or "Uncaught Exceptions" to stop at the exact moment any exception is raised, before it is caught.
• **\`justMyCode: false\`** — by default the debugger steps over library code; disable this when the bug is inside a third-party package.
For a web app you debug the **module** instead of a file: FastAPI runs as \`uvicorn app.main:app --reload\`, so the launch configuration uses \`"module": "uvicorn"\` plus \`"args"\`. Keep these configurations in \`.vscode/launch.json\` and commit them so the whole team shares them. Set \`"env"\` or \`"envFile": ".env"\` there to inject environment variables. For Django use \`"program": "manage.py"\` with \`"args": ["runserver"]\`; for pytest, use the Testing sidebar's "Debug Test" button, which needs no configuration at all.`,
      codeSnippet: `// .vscode/launch.json  — commit this so your whole team debugs the same way
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: Current File",
      "type": "debugpy",
      "request": "launch",
      "program": "\${file}",
      "console": "integratedTerminal",
      "justMyCode": true
    },
    {
      "name": "FastAPI (uvicorn)",
      "type": "debugpy",
      "request": "launch",
      "module": "uvicorn",
      "args": ["app.main:app", "--reload", "--port", "8000"],
      "envFile": "\${workspaceFolder}/.env",
      "jinja": true,
      "justMyCode": false
    },
    {
      "name": "Pytest: current file",
      "type": "debugpy",
      "request": "launch",
      "module": "pytest",
      "args": ["\${file}", "-x", "-q"],
      "console": "integratedTerminal"
    }
  ]
}

// app/main.py — try it: put a breakpoint on the 'total' line, hit F5 with "FastAPI (uvicorn)",
// then open http://127.0.0.1:8000/invoice?amount=1000 in a browser.
//
// from fastapi import FastAPI
// app = FastAPI()
//
// @app.get("/invoice")
// def invoice(amount: float, gst: float = 18):
//     total = amount * (1 + gst / 100)      # <- breakpoint here; Watch: amount, gst, total
//     return {"amount": amount, "gst_percent": gst, "total": round(total, 2)}
//
// Conditional breakpoint example (right-click the red dot -> Edit Breakpoint):
//     amount > 50000
// Logpoint example (no pause, prints to Debug Console):
//     invoice for {amount} at {gst}% -> {total}`
    },
    {
      heading: "11. The Python logging Module: Levels, Loggers and basicConfig Instead of print",
      content: `\`print()\` is fine in a 20-line script. In anything larger it fails you: you cannot turn messages off without deleting them, you cannot tell a harmless note from a fatal error, there is no timestamp, no file/line information, and output goes only to the terminal. The standard-library **\`logging\`** module fixes all of this and is what every serious Python codebase uses.
**Levels** express severity. Each has a number, and a logger only emits records **at or above** its configured level:
• \`DEBUG\` (10) — detailed diagnostics for developers: variable values, SQL queries, cache hits.
• \`INFO\` (20) — normal operation milestones: "server started", "order ORD-7 paid ₹1,499".
• \`WARNING\` (30) — something unexpected but handled: retrying, deprecated config, disk 85% full. **This is the default level** of the root logger, which is why a bare \`logging.info("...")\` prints nothing until you configure logging.
• \`ERROR\` (40) — an operation failed: payment declined by gateway, file could not be written.
• \`CRITICAL\` (50) — the program cannot continue: database unreachable, out of disk.
**Loggers** are named, hierarchical objects. The convention is one per module: \`logger = logging.getLogger(__name__)\` at the top of every file, giving names like \`shop.payments.upi\`. Dots create a tree: configuring \`shop\` affects \`shop.payments\` and \`shop.payments.upi\` through **propagation**. Never configure handlers inside library modules; libraries only *create* loggers and *emit* records. The **application entry point** (\`main.py\`, the FastAPI startup, the CLI) decides where records go.
The simplest configuration is **\`logging.basicConfig(...)\`**: it sets the level and attaches one handler to the root logger. It does nothing if the root logger already has handlers (a classic "why is my config ignored?" moment) — pass \`force=True\` (3.8+) to replace them. Useful parameters: \`level\`, \`format\`, \`datefmt\`, \`filename\`, \`encoding\` (3.9+), \`handlers\`.
Two professional habits: use **\`logger.exception("...")\` inside an \`except\` block** — it logs at ERROR level *and* appends the full traceback automatically (equivalent to \`logger.error(..., exc_info=True)\`); and pass **arguments lazily** with \`%s\` placeholders — \`logger.debug("order %s total %.2f", oid, total)\` — rather than an f-string, so the string is only built if that level is enabled (and log-aggregation tools can group identical message templates).`,
      codeSnippet: `# logging_basics.py
import logging

# Configure ONCE, in the entry point of the program
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s %(levelname)-8s %(name)s:%(lineno)d  %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

logger = logging.getLogger(__name__)          # name: "__main__" here, "shop.payments" in a package


def charge_upi(vpa: str, amount_inr: float) -> bool:
    logger.debug("charging %s for ₹%.2f", vpa, amount_inr)     # lazy %-style args
    if "@" not in vpa:
        logger.warning("suspicious VPA %r, attempting anyway", vpa)
    try:
        if amount_inr > 1_00_000:
            raise PermissionError("UPI limit of ₹1,00,000 per transaction exceeded")
        logger.info("charged %s ₹%.2f successfully", vpa, amount_inr)
        return True
    except PermissionError:
        logger.exception("charge failed for %s", vpa)             # ERROR + traceback
        return False


charge_upi("priya@okaxis", 1_499)
charge_upi("broken-vpa", 10)
charge_upi("big@ybl", 2_50_000)
logger.critical("shutting down: payment gateway unreachable")

# Output:
# 2026-10-09 10:15:02 DEBUG    __main__:15  charging priya@okaxis for ₹1499.00
# 2026-10-09 10:15:02 INFO     __main__:21  charged priya@okaxis ₹1499.00 successfully
# 2026-10-09 10:15:02 DEBUG    __main__:15  charging broken-vpa for ₹10.00
# 2026-10-09 10:15:02 WARNING  __main__:17  suspicious VPA 'broken-vpa', attempting anyway
# 2026-10-09 10:15:02 INFO     __main__:21  charged broken-vpa ₹10.00 successfully
# 2026-10-09 10:15:02 DEBUG    __main__:15  charging big@ybl for ₹250000.00
# 2026-10-09 10:15:02 ERROR    __main__:24  charge failed for big@ybl
# Traceback (most recent call last):
#   File "logging_basics.py", line 20, in charge_upi
#     raise PermissionError("UPI limit of ₹1,00,000 per transaction exceeded")
# PermissionError: UPI limit of ₹1,00,000 per transaction exceeded
# 2026-10-09 10:15:02 CRITICAL __main__:31  shutting down: payment gateway unreachable

# Change ONE line to silence debug noise in production:
#   logging.basicConfig(level=logging.INFO, ...)
# Level names <-> numbers:
print(logging.getLevelName(30), logging.getLevelNamesMapping()["ERROR"])   # WARNING 40  (3.11+)`
    },
    {
      heading: "12. Logging Handlers, Formatters, Rotation and dictConfig for Production",
      content: `\`basicConfig\` is enough for scripts. Services need more control, and the logging module is built from four cooperating pieces:
• A **Logger** creates a \`LogRecord\` for each call and, if the level allows, passes it to its handlers — and then (if \`propagate\` is \`True\`, the default) up to its parent's handlers, all the way to the root.
• A **Handler** decides **where** a record goes. \`StreamHandler\` (stderr/stdout), \`FileHandler\` (one file forever), \`RotatingFileHandler(maxBytes, backupCount)\` (new file when the current one hits a size; keeps N backups), \`TimedRotatingFileHandler(when="midnight")\` (one file per day), \`SysLogHandler\`, \`SMTPHandler\` (email CRITICAL errors), \`QueueHandler\` (hand off to a background thread so logging never blocks a request). Each handler has its **own level**, so one logger can send DEBUG to a file and only WARNING and above to the console.
• A **Formatter** decides **what each line looks like**, using \`%(attribute)s\` fields from the record: \`%(asctime)s\`, \`%(levelname)s\`, \`%(name)s\`, \`%(module)s\`, \`%(funcName)s\`, \`%(lineno)d\`, \`%(process)d\`, \`%(threadName)s\`, \`%(message)s\`. For cloud platforms, log aggregators (ELK, Loki, Datadog, CloudWatch) prefer **JSON lines** — either a custom \`Formatter\` subclass or the popular \`python-json-logger\` package.
• A **Filter** can drop or enrich records (add a request id, a user id).
Assembling these by hand in code works, but the standard in production is **\`logging.config.dictConfig(...)\`**: one dictionary (often loaded from \`logging.yaml\` or \`pyproject.toml\`-adjacent config) that declares formatters, handlers and loggers declaratively. Call it once at startup. Frameworks follow this pattern — Django's \`LOGGING\` setting and Uvicorn's \`--log-config\` are \`dictConfig\` dictionaries.
A note on \`Formatter\` styles: the default is \`%\`-style; \`Formatter(fmt, style="{")\` lets you write \`{levelname}\` fields. Both are fine — just be consistent.
Checklist for a production service: logs go to **stdout/stderr** (containers and Kubernetes collect them), rotation is handled by the platform or a \`RotatingFileHandler\`, levels are set from an environment variable (\`LOG_LEVEL=INFO\`), secrets and card numbers are never logged, every record carries a correlation/request id, and \`logger.exception\` is used for every caught error you did not expect.`,
      codeSnippet: `# logging_config.py  — a production-style setup with dictConfig
import logging
import logging.config
import os

LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")

LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "console": {
            "format": "{asctime} {levelname:<8} {name}: {message}",
            "style": "{",
            "datefmt": "%H:%M:%S",
        },
        "detailed": {
            "format": "%(asctime)s | %(levelname)-8s | %(process)d | %(name)s | "
                      "%(funcName)s:%(lineno)d | %(message)s",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "level": LOG_LEVEL,
            "formatter": "console",
            "stream": "ext://sys.stdout",
        },
        "file": {
            "class": "logging.handlers.RotatingFileHandler",
            "level": "DEBUG",
            "formatter": "detailed",
            "filename": "logs/app.log",
            "maxBytes": 5 * 1024 * 1024,     # 5 MB per file
            "backupCount": 3,                # app.log, app.log.1, .2, .3
            "encoding": "utf-8",
        },
    },
    "loggers": {
        "shop": {"level": "DEBUG", "handlers": ["console", "file"], "propagate": False},
        "httpx": {"level": "WARNING"},       # quieten a chatty third-party library
    },
    "root": {"level": "WARNING", "handlers": ["console"]},
}


def setup_logging() -> None:
    os.makedirs("logs", exist_ok=True)
    logging.config.dictConfig(LOGGING_CONFIG)


# shop/payments.py  (a module: no configuration, just a named logger)
payments_log = logging.getLogger("shop.payments")

def refund(order_id: str, amount: float) -> None:
    payments_log.debug("refund requested order=%s amount=%.2f", order_id, amount)   # file only
    payments_log.info("refund issued order=%s amount=%.2f", order_id, amount)       # console + file


if __name__ == "__main__":
    setup_logging()
    refund("ORD-42", 999.0)
    logging.getLogger("httpx").info("this is hidden: httpx is at WARNING")
    # console:  10:22:41 INFO     shop.payments: refund issued order=ORD-42 amount=999.00
    # logs/app.log gets BOTH the debug and info lines in the 'detailed' format

# Equivalent manual wiring, if you prefer code over config:
#   handler = logging.handlers.RotatingFileHandler("logs/app.log", maxBytes=5_000_000, backupCount=3)
#   handler.setLevel(logging.DEBUG)
#   handler.setFormatter(logging.Formatter("%(asctime)s %(levelname)s %(name)s %(message)s"))
#   logging.getLogger("shop").addHandler(handler)`
    },
    {
      heading: "13. Real-World Use Cases: How Exceptions, Debugging and Logging Are Used in Production",
      content: `Here is how the pieces of this lecture combine in the kinds of systems Indian developers build every day.
**1. Web APIs (FastAPI / Django).** The service layer raises domain exceptions (\`InsufficientBalanceError\`, \`OrderNotFoundError\`). A single **exception handler** at the framework boundary translates each into the right HTTP status and JSON body — 404, 409, 422 — and logs it with the request id. Unexpected exceptions become a generic 500 with \`logger.exception\`, so the traceback is in the logs but **never** leaked to the client. Pydantic v2 raises \`ValidationError\` for bad input; FastAPI already converts it to a 422.
**2. Calling flaky external services.** A payment gateway or an SMS provider will time out sometimes. Wrap \`httpx\` calls in a **retry loop** that catches only transient errors (\`httpx.TimeoutException\`, \`httpx.ConnectError\`, HTTP 503), waits with exponential backoff, logs each attempt at WARNING, and after N attempts raises your own \`GatewayUnavailableError from err\`. A 4xx response is not retried — it is a bug or a bad request, and retrying it only hides the problem.
**3. Data pipelines and batch jobs.** A nightly job processes 50,000 records. One bad row must not kill the job. The loop catches \`Exception\` **per record**, logs the row id and error, counts failures, and at the end either reports "49,980 ok / 20 failed" or raises an \`ExceptionGroup\` so the scheduler marks the run red. \`finally\` writes the summary even when the job is interrupted.
**4. CLI tools and scripts.** Catch \`KeyboardInterrupt\` at the top level to exit cleanly with a message instead of a traceback; convert your domain errors into a short message plus \`sys.exit(1)\`; keep \`-v\`/\`--verbose\` to switch the log level to DEBUG.
**5. Observability.** Tools like Sentry install a \`sys.excepthook\` and a logging handler, so every \`logger.exception\` and every uncaught error becomes an alert with the full chain (\`__cause__\` included), local variables, and release version. Structured JSON logs with request ids let you search "all log lines for order ORD-7" across ten microservices in Grafana Loki or CloudWatch.
**6. Debugging in production.** You cannot attach VS Code to a live server, which is exactly why good logs matter: a DEBUG-level log you can switch on with an environment variable, plus post-mortem tracebacks with \`add_note\` context, is your remote debugger. For truly stuck processes, Python 3.14's \`python -m pdb -p PID\` lets you attach to the running interpreter.`,
      codeSnippet: `# app/main.py — FastAPI: domain exceptions -> clean HTTP errors, with logging and retries
import logging
import time

import httpx
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

logger = logging.getLogger("shop.api")
app = FastAPI()


class AppError(Exception):
    status_code = 500
    code = "internal_error"


class OrderNotFoundError(AppError):
    status_code = 404
    code = "order_not_found"


class GatewayUnavailableError(AppError):
    status_code = 503
    code = "gateway_unavailable"


@app.exception_handler(AppError)
async def handle_app_error(request: Request, exc: AppError) -> JSONResponse:
    logger.warning("%s %s -> %s: %s", request.method, request.url.path, exc.code, exc)
    return JSONResponse(status_code=exc.status_code, content={"error": exc.code, "detail": str(exc)})


@app.exception_handler(Exception)
async def handle_unexpected(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("unhandled error on %s %s", request.method, request.url.path)
    return JSONResponse(status_code=500, content={"error": "internal_error"})   # no traceback leaks


def call_gateway(payload: dict, attempts: int = 3) -> dict:
    """Retry only transient failures, with exponential backoff."""
    for attempt in range(1, attempts + 1):
        try:
            resp = httpx.post("https://gateway.example/charge", json=payload, timeout=3.0)
            if resp.status_code >= 500:
                raise httpx.HTTPStatusError("server error", request=resp.request, response=resp)
            resp.raise_for_status()                       # 4xx -> raises, NOT retried below
            return resp.json()
        except (httpx.TimeoutException, httpx.ConnectError, httpx.HTTPStatusError) as err:
            if isinstance(err, httpx.HTTPStatusError) and err.response.status_code < 500:
                raise                                     # client error: our bug, do not retry
            logger.warning("gateway attempt %d/%d failed: %s", attempt, attempts, err)
            if attempt == attempts:
                raise GatewayUnavailableError("payment gateway unreachable") from err
            time.sleep(0.5 * 2 ** (attempt - 1))          # 0.5s, 1s, 2s
    raise AssertionError("unreachable")


ORDERS = {"ORD-1": {"amount": 1499}}

@app.post("/orders/{order_id}/pay")
def pay(order_id: str) -> dict:
    if order_id not in ORDERS:
        raise OrderNotFoundError(f"order {order_id} not found")
    result = call_gateway({"order": order_id, "amount": ORDERS[order_id]["amount"]})
    logger.info("order %s paid, txn=%s", order_id, result.get("txn_id"))
    return {"status": "paid", "txn_id": result.get("txn_id")}

# run: uvicorn app.main:app --reload
# POST /orders/ORD-9/pay -> 404 {"error": "order_not_found", "detail": "order ORD-9 not found"}`
    },
    {
      heading: "14. Common Mistakes with Python Exception Handling, Debugging and Logging — and How to Fix Them",
      content: `**1. Bare \`except:\` or \`except Exception: pass\`.** This swallows everything, including \`KeyboardInterrupt\`, typos (\`NameError\`) and bugs you need to see. The program "works" while silently doing the wrong thing. **Fix:** catch the specific exception; if you must catch broadly at a top-level loop, log it with \`logger.exception\` and never \`pass\`.
**2. Catching too early.** A helper function catches \`FileNotFoundError\` and returns \`None\`; three layers up, the \`None\` causes an \`AttributeError\` far from the real cause. **Fix:** handle an exception at the layer that can do something meaningful about it (show a message, retry, use a default). Everywhere else, let it propagate — or translate it with \`raise ... from\`.
**3. Wrong \`except\` order.** \`except Exception\` before \`except ValueError\` makes the second clause dead code with no warning. **Fix:** most specific first; the broad catch last.
**4. \`raise err\` instead of bare \`raise\`.** It works, but it rewrites the traceback origin to the \`raise\` line. **Fix:** bare \`raise\` to re-raise unchanged; \`raise NewError(...) from err\` to translate.
**5. Losing the root cause.** \`except KeyError: raise ConfigError("bad config")\` without \`from\` still shows the context, but reads as "an accident happened while handling". Using \`from None\` where you did not mean to hides it completely. **Fix:** \`from err\` for intentional translation; \`from None\` only when the inner error is truly irrelevant.
**6. \`return\` / \`break\` inside \`finally\`.** It silently discards any in-flight exception. Python 3.14 warns about this (PEP 765). **Fix:** never control flow out of \`finally\`; do cleanup only.
**7. \`assert\` for input validation.** Vanishes under \`python -O\`; \`assert (cond, "msg")\` with a tuple is always true. **Fix:** \`if not cond: raise ValueError(...)\` for real checks; asserts only for internal invariants and tests.
**8. Using \`print()\` as logging.** No levels, no timestamps, cannot be turned off, goes only to stdout. **Fix:** \`logger = logging.getLogger(__name__)\`; configure once in the entry point.
**9. \`logging.basicConfig\` "does nothing".** The root logger already had a handler (a library or a previous call added one), so your call is ignored. **Fix:** configure first thing in \`main\`, or pass \`force=True\`.
**10. f-strings in log calls and logging inside libraries.** \`logger.debug(f"...{expensive()}")\` evaluates the call even when DEBUG is off. **Fix:** \`logger.debug("... %s", value)\`. And libraries must not call \`basicConfig\` or add handlers — the application owns configuration.
**11. \`logger.error\` without the traceback.** You get the message but not where it happened. **Fix:** \`logger.exception(...)\` inside the \`except\` block (or \`exc_info=True\`).
**12. Committing \`breakpoint()\`.** The service hangs waiting for \`(Pdb)\` input. **Fix:** set \`PYTHONBREAKPOINT=0\` in production, and add Ruff rule \`T100\` or a pre-commit hook.
**13. Logging sensitive data.** Card numbers, OTPs, passwords, Aadhaar numbers in log files are a compliance disaster. **Fix:** mask before logging (\`****1234\`), and add a logging \`Filter\` that redacts known patterns.`,
      codeSnippet: `# mistakes_fixed.py
import logging
logger = logging.getLogger(__name__)

# 1 & 11: broad catch at the top level, done right
def worker_loop(jobs):
    for job in jobs:
        try:
            job()
        except KeyboardInterrupt:
            raise                                   # let Ctrl+C stop the loop
        except Exception:
            logger.exception("job %r failed, continuing", job)   # traceback included, loop survives

# 3: order matters
def parse_amount(text: str) -> int:
    try:
        return int(text)
    except ValueError:                              # specific FIRST
        logger.warning("not an integer: %r", text)
        return 0
    except Exception:                               # broad LAST
        logger.exception("unexpected")
        raise

# 6: never return from finally
def bad():
    try:
        raise RuntimeError("real problem")
    finally:
        return "fine"            # RuntimeError vanishes! (SyntaxWarning on Python 3.14)

def good():
    try:
        raise RuntimeError("real problem")
    finally:
        logger.info("cleanup done")   # cleanup only; the exception still propagates

# 10: lazy args, not f-strings
def expensive_dump() -> str:
    return "..." * 10_000

order_id = "ORD-7"
# logger.debug(f"state for {order_id}: {expensive_dump()}")   # WRONG: always builds the string
logger.debug("state for %s: %s", order_id, "small value")     # RIGHT: formatted only if emitted
# When the argument itself is expensive to compute, guard the call:
if logger.isEnabledFor(logging.DEBUG):
    logger.debug("state for %s: %s", order_id, expensive_dump())

# 13: mask secrets
def mask_card(number: str) -> str:
    return "*" * (len(number) - 4) + number[-4:]

logger.info("charging card %s", mask_card("4111111111111111"))   # charging card ************1111`
    },
    {
      heading: "15. Frequently Asked Questions about Python Exceptions, Debugging and Logging",
      content: `**What is the difference between an error and an exception in Python?**
In everyday speech they overlap, but technically a \`SyntaxError\` is detected by the parser before execution and cannot be caught by the same file, while an *exception* is an object raised at runtime (\`ValueError\`, \`KeyError\`, \`FileNotFoundError\`) that you can catch with \`try\`/\`except\`. Classes whose names end in \`Error\` are simply exception classes by naming convention; \`StopIteration\` and \`KeyboardInterrupt\` are exceptions too.
**What is the difference between except Exception and a bare except in Python?**
A bare \`except:\` catches \`BaseException\`, which includes \`KeyboardInterrupt\` (Ctrl+C), \`SystemExit\` and \`GeneratorExit\`, so it can make a program impossible to stop. \`except Exception:\` catches every ordinary error but lets those three through. Use \`except Exception\` only at top-level boundaries, and prefer specific exception types everywhere else.
**When should I use else and finally in a try block?**
Put code that must run only when the \`try\` succeeded in \`else\`, so its own bugs are not caught by the \`except\` meant for the risky lines. Put cleanup that must run no matter what — closing files, releasing locks, rolling back a transaction — in \`finally\`. For files, sockets and database connections, prefer a \`with\` statement, which does the \`finally\` for you.
**Does Python have checked exceptions like Java?**
No. Python functions do not declare which exceptions they raise, and the compiler never forces you to catch anything. The culture is "easier to ask forgiveness than permission" (EAFP): try the operation and handle the exception, rather than checking every precondition first. Document the exceptions a public function raises in its docstring and keep them in a clear custom hierarchy.
**What does raise from do in Python?**
\`raise NewError(...) from original\` sets \`NewError.__cause__\` to the original exception and prints "The above exception was the direct cause of the following exception" in the traceback. It is how you translate a low-level error into a meaningful high-level one without losing the root cause. \`raise ... from None\` suppresses the chained context entirely.
**What is ExceptionGroup and except* in Python 3.11?**
\`ExceptionGroup\` is an exception that wraps a list of exceptions raised together, such as several failed tasks in \`asyncio.TaskGroup\` or several validation errors. \`except* SomeType\` catches the matching members of a group; multiple \`except*\` clauses can all run for one raised group, and unmatched members are re-raised automatically.
**How do I debug Python code without print statements?**
Insert \`breakpoint()\` where you want to pause and run the script: you get a \`(Pdb)\` prompt to print variables (\`p x\`), step (\`n\`, \`s\`) and continue (\`c\`). In VS Code, click the gutter to set a breakpoint and press F5; use Watch, Call Stack and conditional breakpoints. After a crash, \`import pdb; pdb.pm()\` opens a post-mortem session at the failing frame.
**Why is my logging.info() not printing anything?**
The root logger's default level is WARNING, so INFO and DEBUG records are discarded until you configure logging with \`logging.basicConfig(level=logging.INFO)\` (or \`dictConfig\`). If you did call \`basicConfig\` and it still does not work, a handler was already attached earlier (often by a library or a notebook); pass \`force=True\` or configure logging as the first thing in your entry point.`
    },
    {
      heading: "16. Interview Questions and Answers on Python Exception Handling, Debugging and Logging",
      content: `**Q1. Explain the flow of try, except, else and finally. When does each block run?**
\`try\` runs first. If it raises, the first matching \`except\` runs. If it does not raise, \`else\` runs. \`finally\` runs in every case — after success, after a handled exception, after an unhandled one, and even when \`try\` executes \`return\`. If \`finally\` itself executes \`return\` or \`break\`, it overrides any pending exception or return value, which is why that is considered a bug (and a \`SyntaxWarning\` in Python 3.14).
**Q2. What is the exception hierarchy, and why is \`KeyboardInterrupt\` not a subclass of \`Exception\`?**
Everything derives from \`BaseException\`. \`Exception\` is the base for ordinary errors (\`ValueError\`, \`LookupError\` → \`KeyError\`/\`IndexError\`, \`OSError\` → \`FileNotFoundError\`, and so on). \`KeyboardInterrupt\`, \`SystemExit\` and \`GeneratorExit\` derive directly from \`BaseException\` so that the common \`except Exception\` does not accidentally block Ctrl+C, \`sys.exit()\` or generator cleanup.
**Q3. What is the difference between \`raise\`, \`raise err\` and \`raise NewError from err\`?**
Bare \`raise\` inside an \`except\` re-raises the active exception with its traceback intact. \`raise err\` re-raises the same object but adds the current line as a new traceback frame, which is misleading. \`raise NewError(...) from err\` raises a different exception and records \`err\` as its \`__cause__\`, keeping both in the printed traceback.
**Q4. How do you design custom exceptions for a package?**
Create one base class (\`class MyLibError(Exception)\`), derive specific classes from it, add structured attributes through \`__init__\` while calling \`super().__init__(message)\`, suffix names with \`Error\`, and keep them in one module. Callers can then catch either the precise type or the whole family.
**Q5. What is implicit vs explicit exception chaining?**
Implicit chaining happens automatically when an exception is raised inside an \`except\`/\`finally\` block: the earlier exception is stored in \`__context__\` ("During handling of the above exception..."). Explicit chaining uses \`raise ... from\`, which sets \`__cause__\` ("...was the direct cause..."). \`from None\` sets \`__suppress_context__\` so nothing is shown.
**Q6. What are the dangers of \`assert\` in production code?**
Assertions are stripped when Python runs with \`-O\`, so any validation or side effect inside them disappears. They are meant for internal invariants and tests only. Also, \`assert (cond, "msg")\` is a tuple and is always true.
**Q7. What is the difference between \`logger.error()\` and \`logger.exception()\`?**
Both log at ERROR level, but \`logger.exception()\` automatically includes the current traceback (\`exc_info=True\`) and should be called only from inside an \`except\` block. \`logger.error()\` records just the message unless you pass \`exc_info=True\` yourself.
**Q8. Explain loggers, handlers, formatters and propagation.**
A logger (named hierarchically, usually \`__name__\`) creates records and filters them by level. Handlers attached to the logger decide the destination (console, rotating file, syslog, queue), each with its own level and formatter. A formatter turns the record into text using fields like \`%(asctime)s %(levelname)s %(name)s %(message)s\`. By default a record propagates up to parent loggers' handlers, so configuring the root or a package-level logger covers every module beneath it; set \`propagate=False\` to stop that.
**Q9. Why should log calls use \`%s\` arguments instead of f-strings?**
Because \`logger.debug("x=%s", x)\` defers string formatting until the record is actually emitted; if DEBUG is disabled, no formatting work happens. It also keeps the message template constant, which lets aggregation tools group identical events. An f-string is always built, even when the level is off.
**Q10. How would you handle multiple concurrent failures in asyncio?**
Use \`asyncio.TaskGroup\` (3.11+), which cancels sibling tasks on failure and raises an \`ExceptionGroup\` containing every exception. Handle it with \`except* SomeError\` clauses, or use \`group.split(Type)\` / \`group.subgroup(...)\` to separate the kinds you can recover from and re-raise the rest.`
    },
    {
      heading: "17. Hands-On Exercise: Build a Resilient UPI Transaction Processor with Custom Exceptions, Logging and Debugging Hooks",
      content: `Build a small batch processor that settles a day's UPI transactions for a kirana-store aggregator. It must use everything from this lecture:
1. A **custom exception hierarchy** (\`TxnError\` base; \`InvalidTxnError\`, \`InsufficientFundsError\`, \`GatewayError\`) with structured attributes.
2. A **per-transaction \`try\`/\`except\`/\`else\`/\`finally\`** so one bad record never stops the batch.
3. **Exception chaining**: a low-level \`KeyError\`/\`ValueError\` while parsing a record is translated into \`InvalidTxnError ... from err\`, and \`add_note\` records which transaction id failed.
4. A **simulated flaky gateway** with a retry loop that re-raises as \`GatewayError\` after 3 attempts.
5. At the end, failures are collected into an **\`ExceptionGroup\`** and handled with \`except*\` to produce a categorised report.
6. **Logging** configured with two handlers: console at INFO, a rotating file at DEBUG, using \`logger.exception\` for unexpected errors.
7. An **assertion** guarding an internal invariant (settled + failed == total).
8. A **debug hook**: when the environment variable \`TXN_DEBUG=1\` is set and a transaction fails, the script calls \`breakpoint()\` so you can inspect it in pdb (try it: \`TXN_DEBUG=1 python txn_processor.py\`, then type \`p txn\` and \`c\`).
Save the program as \`txn_processor.py\`, run it with \`python txn_processor.py\`, then open \`logs/txn.log\` to compare the DEBUG-level file output with the console. Then extend it: add a \`--level\` CLI flag using \`argparse\` to set the console log level, write a pytest test that asserts \`process_txn\` raises \`InsufficientFundsError\` for an overdrawn account, and set a conditional breakpoint in VS Code that stops only when \`txn["id"] == "T004"\`.`,
      codeSnippet: `# txn_processor.py  — run: python txn_processor.py        (Python 3.11+)
#                      debug a failure in pdb: TXN_DEBUG=1 python txn_processor.py
import logging
import logging.handlers
import os
import random
from dataclasses import dataclass, field

# ---------------------------------------------------------------- logging setup
def setup_logging() -> logging.Logger:
    os.makedirs("logs", exist_ok=True)
    fmt = logging.Formatter("%(asctime)s %(levelname)-8s %(name)s: %(message)s", "%H:%M:%S")

    console = logging.StreamHandler()
    console.setLevel(logging.INFO)
    console.setFormatter(fmt)

    file = logging.handlers.RotatingFileHandler("logs/txn.log", maxBytes=200_000, backupCount=2, encoding="utf-8")
    file.setLevel(logging.DEBUG)
    file.setFormatter(logging.Formatter("%(asctime)s | %(levelname)-8s | %(funcName)s:%(lineno)d | %(message)s"))

    log = logging.getLogger("upi")
    log.setLevel(logging.DEBUG)
    log.handlers.clear()                      # idempotent if called twice
    log.addHandler(console)
    log.addHandler(file)
    return log

logger = setup_logging()

# ---------------------------------------------------------------- custom exceptions
class TxnError(Exception):
    """Base for all transaction errors."""
    def __init__(self, txn_id: str, message: str) -> None:
        super().__init__(f"{txn_id}: {message}")
        self.txn_id = txn_id

class InvalidTxnError(TxnError):
    pass

class InsufficientFundsError(TxnError):
    def __init__(self, txn_id: str, balance: float, amount: float) -> None:
        super().__init__(txn_id, f"balance ₹{balance:,.2f} < ₹{amount:,.2f}")
        self.shortfall = amount - balance

class GatewayError(TxnError):
    pass

# ---------------------------------------------------------------- domain
@dataclass
class Ledger:
    balances: dict[str, float]
    settled: list[str] = field(default_factory=list)

def parse_txn(raw: dict) -> tuple[str, str, float]:
    txn_id = str(raw.get("id", "<no-id>"))
    try:
        vpa = raw["vpa"]
        amount = float(raw["amount"])
        if amount <= 0:
            raise ValueError(f"amount must be positive, got {amount}")
        return txn_id, vpa, amount
    except (KeyError, ValueError, TypeError) as err:
        raise InvalidTxnError(txn_id, f"bad record: {err}") from err     # explicit chaining

def call_gateway(txn_id: str, amount: float, attempts: int = 3) -> str:
    """Simulated flaky gateway: ~40% chance of a transient failure per call."""
    for attempt in range(1, attempts + 1):
        try:
            if random.random() < 0.4:
                raise TimeoutError("gateway timeout")
            return f"UTR{random.randint(100000, 999999)}"
        except TimeoutError as err:
            logger.warning("%s: gateway attempt %d/%d failed (%s)", txn_id, attempt, attempts, err)
            if attempt == attempts:
                raise GatewayError(txn_id, "gateway unavailable after retries") from err
    raise AssertionError("unreachable")

def process_txn(raw: dict, ledger: Ledger) -> str:
    txn_id, vpa, amount = parse_txn(raw)
    logger.debug("processing %s vpa=%s amount=%.2f", txn_id, vpa, amount)
    balance = ledger.balances.get(vpa, 0.0)
    if amount > balance:
        raise InsufficientFundsError(txn_id, balance, amount)
    utr = call_gateway(txn_id, amount)
    ledger.balances[vpa] = balance - amount
    ledger.settled.append(txn_id)
    return utr

# ---------------------------------------------------------------- batch runner
def run_batch(txns: list[dict], ledger: Ledger) -> None:
    failures: list[Exception] = []
    for raw in txns:
        txn_id = str(raw.get("id", "<no-id>"))
        try:
            utr = process_txn(raw, ledger)
        except TxnError as err:
            err.add_note(f"raw record: {raw}")
            failures.append(err)
            logger.error("%s", err)
            if os.getenv("TXN_DEBUG") == "1":
                txn = raw                         # inspect with: p txn, p err, p ledger ; then c
                breakpoint()
        except Exception as err:                  # unexpected: keep the batch alive, record it
            err.add_note(f"unexpected while processing {txn_id}")
            failures.append(err)
            logger.exception("%s: unexpected failure", txn_id)
        else:
            logger.info("%s settled, UTR=%s", txn_id, utr)
        finally:
            logger.debug("%s done; balances=%s", txn_id, ledger.balances)

    assert len(ledger.settled) + len(failures) == len(txns), "every txn must be settled or failed"
    logger.info("batch finished: %d settled, %d failed", len(ledger.settled), len(failures))
    if failures:
        raise ExceptionGroup("batch had failures", failures)

def main() -> None:
    random.seed(7)
    ledger = Ledger(balances={"ravi@okaxis": 5_000, "meena@ybl": 800, "store@paytm": 20_000})
    txns = [
        {"id": "T001", "vpa": "ravi@okaxis", "amount": 1_250},
        {"id": "T002", "vpa": "meena@ybl", "amount": 999},          # insufficient funds
        {"id": "T003", "vpa": "store@paytm", "amount": "12x0"},     # invalid amount
        {"id": "T004", "vpa": "store@paytm", "amount": 4_500},
        {"id": "T005", "amount": 300},                              # missing vpa
        {"id": "T006", "vpa": "ravi@okaxis", "amount": 2_000},
    ]
    try:
        run_batch(txns, ledger)
    except* InsufficientFundsError as eg:
        for e in eg.exceptions:
            logger.warning("REPORT funds   : %s (short by ₹%.2f)", e.txn_id, e.shortfall)
    except* InvalidTxnError as eg:
        for e in eg.exceptions:
            logger.warning("REPORT invalid : %s  cause=%r", e.txn_id, e.__cause__)
    except* GatewayError as eg:
        for e in eg.exceptions:
            logger.warning("REPORT gateway : %s", e.txn_id)
    finally:
        logger.info("final balances: %s", ledger.balances)

if __name__ == "__main__":
    main()

# Sample console output (exact gateway failures vary with the seed/random):
# 11:02:10 INFO     upi: T001 settled, UTR=UTR483921
# 11:02:10 ERROR    upi: T002: balance ₹800.00 < ₹999.00
# 11:02:10 ERROR    upi: T003: bad record: could not convert string to float: '12x0'
# 11:02:10 WARNING  upi: T004: gateway attempt 1/3 failed (gateway timeout)
# 11:02:10 INFO     upi: T004 settled, UTR=UTR217804
# 11:02:10 ERROR    upi: T005: bad record: 'vpa'
# 11:02:10 INFO     upi: T006 settled, UTR=UTR905512
# 11:02:10 INFO     upi: batch finished: 3 settled, 3 failed
# 11:02:10 WARNING  upi: REPORT funds   : T002 (short by ₹199.00)
# 11:02:10 WARNING  upi: REPORT invalid : T003  cause=ValueError("could not convert string to float: '12x0'")
# 11:02:10 WARNING  upi: REPORT invalid : T005  cause=KeyError('vpa')
# 11:02:10 INFO     upi: final balances: {'ravi@okaxis': 1750, 'meena@ybl': 800, 'store@paytm': 15500}
# logs/txn.log additionally contains every DEBUG line with function names and line numbers.`
    },
    {
      heading: "18. Summary",
      content: `• A **SyntaxError** is caught by the parser before the program runs; an **exception** is an object raised at runtime that you can handle. Read tracebacks bottom-up; Python 3.11+ underlines the failing expression.
• \`try\` runs the risky code, \`except\` handles a matching exception (first match wins, so order specific → general), \`else\` runs only on success, \`finally\` always runs — and must never \`return\`/\`break\` (SyntaxWarning in 3.14).
• Catch the **narrowest** exception you can handle. \`except Exception\` only at top-level boundaries; a bare \`except:\` also swallows Ctrl+C and \`SystemExit\`.
• \`raise SomeError("message")\` when a function cannot keep its contract; bare \`raise\` to re-raise unchanged; **custom exception classes** form a hierarchy under one base class with structured attributes.
• **Exception chaining**: \`raise New from err\` sets \`__cause__\`; raising inside an \`except\` sets \`__context__\` automatically; \`from None\` suppresses; \`add_note()\` (3.11) attaches context without wrapping.
• **ExceptionGroup** and \`except*\` (3.11) handle many simultaneous failures — essential with \`asyncio.TaskGroup\`; use \`split()\`/\`subgroup()\` for manual handling.
• \`assert\` checks internal invariants and powers pytest; it is removed by \`python -O\`, so never use it for input validation, and beware the always-true tuple form.
• Debug with \`breakpoint()\` → **pdb** (\`p\`, \`n\`, \`s\`, \`c\`, \`l\`, \`w\`, \`b\`, \`q\`), \`python -m pdb\`, post-mortem \`pdb.pm()\`, and \`PYTHONBREAKPOINT=0\` in CI; in **VS Code** use breakpoints, conditional breakpoints, logpoints, Watch, Call Stack and a committed \`launch.json\` (\`"type": "debugpy"\`).
• Replace \`print\` with **logging**: levels DEBUG < INFO < WARNING (default) < ERROR < CRITICAL; \`logging.getLogger(__name__)\` per module; configure once in the entry point with \`basicConfig\` or \`dictConfig\`; handlers choose destinations (console, rotating file, queue), formatters choose the line format; \`logger.exception\` captures tracebacks; use \`%s\` args, not f-strings; never log secrets.
**Next lecture:** Working with Files, JSON, CSV & pathlib`
    }
  ]
};
