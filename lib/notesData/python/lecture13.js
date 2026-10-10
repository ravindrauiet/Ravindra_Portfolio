export const lecture13 = {
  slug: "lecture-13",
  number: 13,
  title: "Complete Python Course — Lecture 13: Testing with pytest",
  summary: "Learn Python testing with pytest from scratch: test discovery, assertion introspection, fixtures and scopes, parametrize, pytest.raises, monkeypatch and unittest.mock, tmp_path, coverage with pytest-cov, testing async code, the TDD workflow and CI with GitHub Actions.",
  readTime: "65 min read",
  difficulty: "Intermediate",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. Introduction: Why Automated Testing Matters in Python Projects",
      content: `Every developer tests their code. The question is whether they do it by hand — running the script, eyeballing the output, clicking around — or whether a machine does it for them, the same way, every single time, in seconds. **Automated tests** are small programs that call your code with known inputs and check that the outputs are what you expect. When a test fails, you know exactly what broke and where, before a customer in Pune or a manager in Bengaluru finds out.
Why does this matter so much in real projects?
• **Regression protection** — the most common bug in a growing codebase is not a new feature that fails; it is an old feature that silently broke when someone changed a shared function. A test suite catches that in the pull request, not in production.
• **Confidence to refactor** — you cannot clean up a 400-line function you are afraid to touch. With tests, you change it, run \`pytest\`, and see green.
• **Executable documentation** — a test named \`test_gst_is_18_percent_on_electronics\` tells the next developer what the code is supposed to do more precisely than a comment ever could.
• **Faster feedback** — a 2,000-test suite that runs in 30 seconds replaces hours of manual clicking. On a team of five, that is the difference between shipping daily and shipping monthly.
Python ships with \`unittest\` in the standard library, but the overwhelming majority of modern Python projects — Django, FastAPI, pandas, NumPy, Home Assistant, and most companies hiring Python developers in India — use **pytest**. It needs no boilerplate classes, uses plain \`assert\`, has a powerful **fixture** system for setup and teardown, and a plugin ecosystem with over a thousand packages (\`pytest-cov\`, \`pytest-asyncio\`, \`pytest-django\`, \`pytest-xdist\`, and many more).
A quick vocabulary before we start, because interviewers love these terms:
• **Unit test** — tests one function or class in isolation, with external systems replaced by fakes. Fast, numerous.
• **Integration test** — tests several components together, for example your repository class against a real SQLite database.
• **End-to-end (E2E) test** — drives the whole application like a user would, for example sending real HTTP requests to a running FastAPI server.
The widely quoted **testing pyramid** says: many unit tests, fewer integration tests, very few E2E tests. This lecture focuses on unit and integration testing with pytest 9, the current major version, on Python 3.14 (Python 3.15 is the next release in line; everything here works on 3.12 and later).`
    },
    {
      heading: "2. pytest Basics: Installation, Your First Test and Test Discovery",
      content: `Install pytest into your project's virtual environment. If you use **uv** (recommended in this course), add it as a development dependency so it does not ship with your application. With plain pip, activate your \`venv\` and install it directly.
A pytest test is just a **function whose name starts with \`test_\`** inside a **file whose name starts with \`test_\` or ends with \`_test.py\`**. Inside it you use the ordinary Python \`assert\` statement. That is the entire API for a basic test — no base class, no \`self.assertEqual\`.
**How test discovery works.** When you run \`pytest\` with no arguments, it starts from the current directory (or the \`testpaths\` you configure) and recursively collects:
• files matching \`test_*.py\` or \`*_test.py\`;
• inside them, functions prefixed \`test\`;
• classes prefixed \`Test\` that have no \`__init__\` method, and \`test\`-prefixed methods inside them.
Everything else is ignored, so helper modules such as \`conftest.py\` or \`factories.py\` are never run as tests. You can also target a specific file (\`pytest tests/test_gst.py\`), a specific test (\`pytest tests/test_gst.py::test_electronics_rate\`), or a keyword expression (\`pytest -k "gst and not slow"\`).
**Reading the output.** A dot \`.\` means pass, \`F\` means fail, \`E\` means an error during setup, \`s\` means skipped, \`x\` means an expected failure. Useful flags you will use daily: \`-v\` for verbose names, \`-x\` to stop at the first failure, \`-q\` for quiet output, \`--lf\` to re-run only the tests that failed last time, and \`-s\` to show \`print()\` output (pytest captures stdout by default).
In the example below we test a tiny GST calculator. Note the layout: application code lives in \`src/shop/\`, tests live in \`tests/\`, and the project is installed in editable mode so that \`from shop.gst import ...\` works from anywhere.`,
      codeSnippet: `# Install (choose one)
#   uv add --dev pytest
#   pip install pytest

# src/shop/gst.py
from decimal import Decimal, ROUND_HALF_UP

GST_RATES = {"electronics": Decimal("0.18"), "food": Decimal("0.05"), "books": Decimal("0")}


def price_with_gst(base_price: Decimal, category: str) -> Decimal:
    """Return the final price including GST, rounded to 2 decimals."""
    if base_price < 0:
        raise ValueError("base_price cannot be negative")
    try:
        rate = GST_RATES[category]
    except KeyError:
        raise ValueError(f"unknown category: {category!r}") from None
    total = base_price * (1 + rate)
    return total.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


# tests/test_gst.py
from decimal import Decimal

from shop.gst import price_with_gst


def test_electronics_gets_18_percent():
    assert price_with_gst(Decimal("1000"), "electronics") == Decimal("1180.00")


def test_books_are_zero_rated():
    assert price_with_gst(Decimal("499"), "books") == Decimal("499.00")


# Run from the project root:
#   $ pytest -v
#   tests/test_gst.py::test_electronics_gets_18_percent PASSED
#   tests/test_gst.py::test_books_are_zero_rated PASSED
#   ======================= 2 passed in 0.02s =======================`
    },
    {
      heading: "3. Assertions and Assertion Introspection in pytest",
      content: `In \`unittest\` you must remember a dozen methods: \`assertEqual\`, \`assertIn\`, \`assertTrue\`, \`assertAlmostEqual\`, \`assertRaises\`. In pytest you write a plain \`assert\` and pytest does something clever called **assertion rewriting**: when it imports your test module, it rewrites the bytecode of every \`assert\` so that, on failure, it can show the **intermediate values** of the expression. This is called **assertion introspection**, and it is the single feature that converts most people to pytest.
Compare the two failure messages. With \`unittest\`, \`AssertionError: 1180 != 1181\` tells you the numbers. With pytest you also get the expression, the actual values of each variable, and for collections a line-by-line **diff**: which key is missing from a dict, which item differs in a list, where two long strings diverge. For large structures pytest truncates the output; add \`-vv\` to see everything.
Patterns worth knowing:
• **Floating point** — never \`assert 0.1 + 0.2 == 0.3\` (it is \`False\`). Use \`pytest.approx(0.3)\`, which compares with a relative tolerance of \`1e-6\` by default and also works on lists and dicts of floats.
• **Membership and containment** — \`assert "Mumbai" in cities\`, \`assert {"id": 1}.items() <= record.items()\` to check a subset of keys.
• **Custom message** — \`assert balance >= 0, f"balance went negative: {balance}"\`. The message is appended to pytest's own introspection, not replacing it.
• **Multiple assertions** — a test stops at the first failed \`assert\`. That is usually what you want (one reason to fail per test). If you need to see all failures at once, the \`pytest-check\` plugin provides soft assertions.
**Important:** assertion rewriting only applies to test modules and \`conftest.py\` files that pytest imports itself. If you put helper assertions in a separate module, register it with \`pytest.register_assert_rewrite("tests.helpers")\` in \`conftest.py\`, or you will lose the rich output.`,
      codeSnippet: `# tests/test_introspection.py
import pytest


def build_invoice(items: list[dict]) -> dict:
    subtotal = sum(i["price"] * i["qty"] for i in items)
    return {"subtotal": subtotal, "gst": subtotal * 0.18, "total": subtotal * 1.18}


def test_invoice_total():
    items = [{"name": "Keyboard", "price": 1500, "qty": 2}, {"name": "Mouse", "price": 700, "qty": 1}]
    invoice = build_invoice(items)
    # 3700 * 1.18 = 4366.0 — floats can be off by a tiny amount, so use approx
    assert invoice["total"] == pytest.approx(4366.0)
    assert invoice["subtotal"] == 3700


def test_dict_diff_is_readable():
    expected = {"city": "Pune", "pin": "411001", "state": "Maharashtra"}
    actual = {"city": "Pune", "pin": "411002", "state": "Maharashtra"}
    assert actual == expected


# Output of the second test (abridged):
#   FAILED tests/test_introspection.py::test_dict_diff_is_readable
#   AssertionError: assert {'city': 'Pune', 'pin': '411002', ...} == {'city': 'Pune', 'pin': '411001', ...}
#     Differing items:
#     {'pin': '411002'} != {'pin': '411001'}
#     Use -v to get more diff`
    },
    {
      heading: "4. pytest Fixtures: Setup, Teardown, Scopes and conftest.py",
      content: `Most tests need some **prepared state** before they run: a database connection, a sample customer object, a temporary directory, an HTTP client. In \`unittest\` you write \`setUp\` and \`tearDown\` methods on a class. pytest replaces this with **fixtures**: functions decorated with \`@pytest.fixture\` whose return value is injected into any test that names the fixture as a parameter. This is **dependency injection by argument name**, and it is why pytest tests read so cleanly.
**Teardown with yield.** If the fixture needs cleanup (close a connection, delete a file), write it as a generator: everything before \`yield\` is setup, the yielded value goes to the test, and everything after \`yield\` runs as teardown — even if the test failed.
**Scopes control how often a fixture runs.** The \`scope\` argument accepts:
• \`"function"\` (default) — fresh instance for every test. Safest; use for anything mutable.
• \`"class"\` — once per test class.
• \`"module"\` — once per test file.
• \`"package"\` — once per package directory.
• \`"session"\` — once for the whole \`pytest\` run. Use for expensive, read-only resources such as a Docker database container, a compiled model, or a parsed 50 MB fixture file.
A higher-scoped fixture must never depend on a lower-scoped one (a session fixture cannot request a function fixture) — pytest raises a \`ScopeMismatch\` error if you try.
**conftest.py** is a special file that pytest loads automatically. Fixtures defined there are available to every test in that directory and below, with no import statement. A \`tests/conftest.py\` typically holds your shared fixtures; a deeper \`tests/api/conftest.py\` can add or override fixtures for just that sub-folder.
**autouse=True** makes a fixture run for every test in scope without being requested — handy for resetting a global cache or freezing time, but use it sparingly because it hides dependencies.
**Fixtures can use other fixtures**, which lets you build layers: \`db_connection\` (session) → \`db_session\` (function, rolls back after each test) → \`sample_customer\` (function, inserts one row). Run \`pytest --fixtures\` to list every fixture available, including the built-in ones like \`tmp_path\`, \`monkeypatch\`, \`capsys\` and \`caplog\`.`,
      codeSnippet: `# tests/conftest.py
import sqlite3
from collections.abc import Iterator

import pytest


@pytest.fixture(scope="session")
def db_connection() -> Iterator[sqlite3.Connection]:
    """One in-memory SQLite database for the entire test session."""
    conn = sqlite3.connect(":memory:")
    conn.execute("CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, city TEXT)")
    yield conn            # <-- tests run here
    conn.close()          # teardown, runs once at the end of the session


@pytest.fixture
def db(db_connection: sqlite3.Connection) -> Iterator[sqlite3.Connection]:
    """Per-test transaction: whatever a test inserts is rolled back afterwards."""
    db_connection.execute("BEGIN")
    yield db_connection
    db_connection.rollback()


@pytest.fixture
def sample_customer(db: sqlite3.Connection) -> dict:
    db.execute("INSERT INTO customers (name, city) VALUES (?, ?)", ("Asha Verma", "Jaipur"))
    row_id = db.execute("SELECT last_insert_rowid()").fetchone()[0]
    return {"id": row_id, "name": "Asha Verma", "city": "Jaipur"}


# tests/test_customers.py
import sqlite3


def test_customer_is_saved(db: sqlite3.Connection, sample_customer: dict):
    row = db.execute("SELECT name, city FROM customers WHERE id = ?", (sample_customer["id"],)).fetchone()
    assert row == ("Asha Verma", "Jaipur")


def test_table_is_empty_again(db: sqlite3.Connection):
    # The previous test's insert was rolled back by the 'db' fixture
    count = db.execute("SELECT COUNT(*) FROM customers").fetchone()[0]
    assert count == 0`
    },
    {
      heading: "5. Parametrized Tests with @pytest.mark.parametrize",
      content: `Suppose you want to test \`price_with_gst\` for five categories. Copy-pasting five near-identical test functions is tedious and, worse, when the behaviour changes you must edit all five. **Parametrization** lets you write the test once and supply a table of inputs and expected outputs; pytest generates one independent test per row, each with its own pass/fail status and its own readable ID like \`test_gst[electronics-1180.00]\`.
The decorator takes two things: a string of comma-separated **argument names**, and a list of **tuples** (or single values when there is one argument). Use \`ids=[...]\` to give rows human-readable names, or wrap a row in \`pytest.param(..., id="negative-price")\` to name it inline. \`pytest.param\` also accepts \`marks=pytest.mark.xfail\` for rows that are known to fail — useful for documenting a bug you have not fixed yet.
**Stacking decorators** produces the cartesian product: two \`parametrize\` decorators with 3 and 4 values yield 12 tests. This is how you test every combination of, say, payment method and currency.
**Parametrizing fixtures.** A fixture itself can be parametrized with \`@pytest.fixture(params=[...])\`; every test that requests it then runs once per parameter. This is how you run the same repository tests against SQLite and PostgreSQL, or the same API tests against two client implementations. Inside the fixture, read the current value from \`request.param\`.
Good parametrization habits:
• Keep each row a distinct, meaningful case (boundary values, zero, negative, empty, Unicode), not random filler.
• Prefer explicit expected values over computing the expected value with the same logic as the code under test — otherwise a bug in the formula passes the test.
• When rows get long, move the table into a module-level constant so the decorator stays readable.`,
      codeSnippet: `# tests/test_gst_param.py
from decimal import Decimal

import pytest

from shop.gst import price_with_gst


@pytest.mark.parametrize(
    "base, category, expected",
    [
        (Decimal("1000"), "electronics", Decimal("1180.00")),
        (Decimal("200"), "food", Decimal("210.00")),
        (Decimal("499"), "books", Decimal("499.00")),
        (Decimal("0"), "electronics", Decimal("0.00")),
        pytest.param(Decimal("0.005"), "food", Decimal("0.01"), id="rounds-half-up"),
    ],
)
def test_price_with_gst(base: Decimal, category: str, expected: Decimal):
    assert price_with_gst(base, category) == expected


@pytest.mark.parametrize("category", ["electronics", "food", "books"])
@pytest.mark.parametrize("base", [Decimal("1"), Decimal("99999.99")])
def test_result_is_never_negative(base: Decimal, category: str):
    # 3 categories x 2 prices = 6 generated tests
    assert price_with_gst(base, category) >= 0


# Parametrized fixture: every test using 'storage' runs twice
@pytest.fixture(params=["memory", "file"], ids=["mem", "file"])
def storage(request, tmp_path):
    if request.param == "memory":
        return {}
    path = tmp_path / "store.txt"
    path.touch()
    return {"path": path}


def test_storage_fixture(storage):
    assert storage is not None


# $ pytest tests/test_gst_param.py -q
# ...........                                            [100%]
# 13 passed in 0.03s`
    },
    {
      heading: "6. Testing Exceptions with pytest.raises",
      content: `Correct code does not just produce correct results; it **fails correctly** — raising the right exception, with a useful message, when given bad input. Tests for this use the \`pytest.raises\` context manager. The block inside \`with pytest.raises(ValueError):\` must raise \`ValueError\` (or a subclass); if nothing is raised, or a different exception is raised, the test fails.
Three refinements make exception tests precise:
• **match=** takes a regular expression that is searched (\`re.search\`) against \`str(exception)\`. \`match="negative"\` passes for the message "base_price cannot be negative". Use \`re.escape\` when the message contains regex metacharacters like parentheses or dots.
• **as excinfo** captures an \`ExceptionInfo\` object so you can assert on attributes after the block: \`excinfo.value\` is the exception instance, \`excinfo.type\` is its class, and \`excinfo.value.__cause__\` lets you check **exception chaining** from \`raise ... from ...\`.
• **Keep the block small.** Only the line expected to raise should be inside \`with pytest.raises\`. If you wrap ten lines, an unrelated \`ValueError\` on line two would make the test pass for the wrong reason.
**Warnings** are tested the same way with \`pytest.warns(DeprecationWarning, match=...)\`. And for Python 3.11+ **exception groups** (which you met in the asyncio lecture, where a \`TaskGroup\` raises \`ExceptionGroup\`), pytest 8.4 and later provide \`pytest.RaisesGroup\`, which checks that a group contains the expected member exceptions.
A subtle but common requirement is testing that a function does **not** raise. You do not need a special construct — simply call it; any exception fails the test automatically.`,
      codeSnippet: `# tests/test_gst_errors.py
import re
from decimal import Decimal

import pytest

from shop.gst import price_with_gst


def test_negative_price_is_rejected():
    with pytest.raises(ValueError, match="cannot be negative"):
        price_with_gst(Decimal("-1"), "food")


def test_unknown_category_message_names_the_category():
    with pytest.raises(ValueError) as excinfo:
        price_with_gst(Decimal("10"), "gold")
    assert "gold" in str(excinfo.value)
    # 'raise ... from None' suppresses the KeyError chain
    assert excinfo.value.__cause__ is None


def test_match_with_special_characters():
    msg = "unknown category: 'gold'"
    with pytest.raises(ValueError, match=re.escape(msg)):
        price_with_gst(Decimal("10"), "gold")


def parse_pin(pin: str) -> int:
    if not re.fullmatch(r"\\d{6}", pin):
        raise ValueError(f"invalid PIN code: {pin}")
    return int(pin)


@pytest.mark.parametrize("bad", ["4110", "41100A", "", "411 001"])
def test_invalid_pins_raise(bad: str):
    with pytest.raises(ValueError, match=r"invalid PIN code"):
        parse_pin(bad)


def test_valid_pin_does_not_raise():
    assert parse_pin("411001") == 411001   # any exception here = test failure`
    },
    {
      heading: "7. Isolating Dependencies with monkeypatch and unittest.mock",
      content: `Real code talks to things you do not want in a unit test: the system clock, environment variables, the network, payment gateways, random numbers. A test that calls the live Razorpay API is slow, flaky, costs money, and cannot run offline. **Test doubles** replace those dependencies with controllable stand-ins. pytest gives you two tools, and knowing when to use which is an interview favourite.
**monkeypatch (pytest built-in fixture)** temporarily changes attributes, dictionary items, environment variables or the working directory, and **automatically undoes every change** when the test ends. Its methods are \`setattr\`, \`delattr\`, \`setitem\`, \`delitem\`, \`setenv\`, \`delenv\`, \`syspath_prepend\` and \`chdir\`. It is the simplest option when you just need to swap one function or variable for a plain replacement — for example replacing \`datetime.now\` with a function that returns a fixed date, or setting \`DATABASE_URL\` for the duration of a test.
**unittest.mock (standard library)** provides \`Mock\`, \`MagicMock\`, \`AsyncMock\` (for coroutines) and the \`patch\` helper. A mock object accepts any call and records it, so you can assert **how** your code interacted with the dependency: \`mock.assert_called_once_with(amount=500, currency="INR")\`. Use \`return_value\` to script the reply, \`side_effect\` to raise an exception or return different values on successive calls, and \`spec=SomeClass\` so that calling a method that does not exist on the real class fails instead of silently passing.
**The golden rule of patching: patch where the name is looked up, not where it is defined.** If \`shop/payments.py\` does \`from razorpay import Client\`, you must patch \`shop.payments.Client\`, not \`razorpay.Client\`, because the module already holds its own reference.
A cleaner alternative to patching is **dependency injection**: let the function accept the client as a parameter (with a sensible default) so tests can pass a fake directly. The example shows both approaches side by side. Prefer injection for your own code; reach for \`patch\` when testing code you cannot restructure.`,
      codeSnippet: `# src/shop/payments.py
import os
from datetime import datetime

import httpx


def gateway_url() -> str:
    return os.environ.get("PAYMENT_URL", "https://api.razorpay.com/v1")


def charge(amount_paise: int, client: httpx.Client | None = None) -> dict:
    client = client or httpx.Client(base_url=gateway_url(), timeout=5.0)
    response = client.post("/payments", json={"amount": amount_paise, "currency": "INR"})
    response.raise_for_status()
    return response.json()


def receipt_number() -> str:
    return "RCPT-" + datetime.now().strftime("%Y%m%d-%H%M%S")


# tests/test_payments.py
from datetime import datetime
from unittest.mock import MagicMock, patch

import httpx
import pytest

from shop import payments


def test_gateway_url_reads_env(monkeypatch):
    monkeypatch.setenv("PAYMENT_URL", "http://localhost:9000")
    assert payments.gateway_url() == "http://localhost:9000"
    # restored automatically after the test


def test_receipt_number_is_deterministic(monkeypatch):
    class FrozenDateTime(datetime):
        @classmethod
        def now(cls, tz=None):
            return cls(2026, 10, 9, 14, 30, 0)

    monkeypatch.setattr(payments, "datetime", FrozenDateTime)
    assert payments.receipt_number() == "RCPT-20261009-143000"


def test_charge_with_injected_fake_client():
    fake = MagicMock(spec=httpx.Client)
    fake.post.return_value = httpx.Response(200, json={"id": "pay_123", "status": "captured"})
    result = payments.charge(50_000, client=fake)
    assert result["status"] == "captured"
    fake.post.assert_called_once_with("/payments", json={"amount": 50_000, "currency": "INR"})


def test_charge_raises_on_gateway_error():
    fake = MagicMock(spec=httpx.Client)
    fake.post.side_effect = httpx.ConnectError("gateway down")
    with pytest.raises(httpx.ConnectError):
        payments.charge(100, client=fake)


@patch("shop.payments.httpx.Client")      # patch where it is looked up
def test_charge_builds_default_client(mock_client_cls):
    mock_client_cls.return_value.post.return_value = httpx.Response(200, json={"id": "pay_9"})
    payments.charge(100)
    mock_client_cls.assert_called_once()
    assert mock_client_cls.call_args.kwargs["timeout"] == 5.0`
    },
    {
      heading: "8. Working with Files Safely: tmp_path, tmp_path_factory, capsys and caplog",
      content: `Code that reads or writes files is awkward to test: you do not want tests to litter the project directory, collide with each other, or depend on files that exist only on your laptop. pytest's **\`tmp_path\`** fixture solves this by handing each test a brand-new, empty directory as a \`pathlib.Path\`. The directory lives under the system temp folder (for example \`/tmp/pytest-of-ravindra/pytest-42/test_export_csv0/\`), is unique per test, and pytest keeps only the last three runs so you can inspect files after a failure.
Because it is a \`Path\`, you use the \`pathlib\` API you learned earlier: \`tmp_path / "report.csv"\`, \`.write_text()\`, \`.read_text()\`, \`.mkdir()\`, \`.exists()\`. There is also **\`tmp_path_factory\`**, a session-scoped fixture, for when a large file should be generated once and shared read-only across many tests. (You may see \`tmpdir\` in older code; it returns a legacy \`py.path\` object — prefer \`tmp_path\`.)
Two more built-in fixtures round out the "capture" toolbox:
• **capsys** captures everything written to \`sys.stdout\` and \`sys.stderr\`. Call \`captured = capsys.readouterr()\` and assert on \`captured.out\`. This is how you test CLI tools and \`print\`-based reports.
• **caplog** captures log records emitted through the \`logging\` module. You can assert on \`caplog.records\`, \`caplog.text\`, or set the level with \`caplog.set_level(logging.DEBUG)\`. Testing that your code logs a warning when a payment is retried is a genuine production requirement — monitoring alerts depend on those messages.
Combined with \`monkeypatch.chdir(tmp_path)\`, you can test code that writes to "the current directory" without ever touching your real project files.`,
      codeSnippet: `# src/shop/export.py
import csv
import logging
from pathlib import Path

log = logging.getLogger(__name__)


def export_orders(orders: list[dict], out_dir: Path) -> Path:
    out_dir.mkdir(parents=True, exist_ok=True)
    target = out_dir / "orders.csv"
    with target.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["id", "customer", "amount"])
        writer.writeheader()
        writer.writerows(orders)
    if not orders:
        log.warning("exported an empty orders file to %s", target)
    print(f"Wrote {len(orders)} orders to {target.name}")
    return target


# tests/test_export.py
import logging
from pathlib import Path

from shop.export import export_orders


def test_export_writes_csv(tmp_path: Path, capsys):
    orders = [{"id": 1, "customer": "Rahul", "amount": 2499}, {"id": 2, "customer": "Meera", "amount": 999}]
    target = export_orders(orders, tmp_path / "reports")

    assert target.exists()
    lines = target.read_text(encoding="utf-8").splitlines()
    assert lines[0] == "id,customer,amount"
    assert lines[1] == "1,Rahul,2499"
    assert len(lines) == 3

    captured = capsys.readouterr()
    assert captured.out.strip() == "Wrote 2 orders to orders.csv"


def test_empty_export_logs_warning(tmp_path: Path, caplog):
    caplog.set_level(logging.WARNING, logger="shop.export")
    export_orders([], tmp_path)
    assert any("empty orders file" in rec.message for rec in caplog.records)
    assert caplog.records[0].levelname == "WARNING"`
    },
    {
      heading: "9. Measuring Code Coverage with pytest-cov",
      content: `Passing tests tell you that the code you exercised works. **Coverage** tells you which code you never exercised at all. The \`pytest-cov\` plugin wraps the \`coverage.py\` library and reports, per file, the percentage of lines (and optionally branches) that ran during the test session.
Install it with \`uv add --dev pytest-cov\` and run \`pytest --cov=shop --cov-report=term-missing\`. The \`--cov=shop\` argument names the package to measure (use your package name, not \`tests\`); \`term-missing\` prints the line numbers that were **not** executed, which is exactly the list you need to decide what to test next. Other report formats: \`html\` produces a browsable \`htmlcov/index.html\` with red/green highlighted source; \`xml\` produces the file that CI dashboards and tools such as Codecov or SonarQube ingest.
**Branch coverage** (\`--cov-branch\`) is stricter than line coverage: an \`if\` statement counts as fully covered only when both the true and false paths ran. A function with \`if discount: price -= discount\` can have 100% line coverage while the "no discount" branch was never tested.
**Enforce a floor** with \`--cov-fail-under=85\`: the run exits non-zero when coverage drops below 85%, which makes a CI pipeline fail. Put the number in \`pyproject.toml\` under \`[tool.coverage.report]\` so the whole team shares it.
**What coverage is not.** A line that ran is not a line that was *verified*. A test that calls \`price_with_gst\` and asserts nothing gives 100% coverage and catches zero bugs. Treat coverage as a map of the untested territory, not as a quality score; 80–90% with meaningful assertions beats 100% with hollow ones. Exclude genuinely untestable lines (\`if __name__ == "__main__":\`, abstract methods, \`TYPE_CHECKING\` blocks) with \`exclude_also\` patterns rather than writing fake tests for them.`,
      codeSnippet: `# Install:  uv add --dev pytest-cov      (or: pip install pytest-cov)

# pyproject.toml — coverage configuration shared by the whole team
[tool.coverage.run]
source = ["shop"]
branch = true
omit = ["*/__main__.py"]

[tool.coverage.report]
fail_under = 85
show_missing = true
exclude_also = [
    "if __name__ == .__main__.:",
    "if TYPE_CHECKING:",
    "raise NotImplementedError",
    "@abstractmethod",
]

# Run:
#   $ pytest --cov --cov-report=term-missing
#   ---------- coverage: platform linux, python 3.14 ----------
#   Name                   Stmts   Miss Branch BrPart  Cover   Missing
#   ------------------------------------------------------------------
#   src/shop/__init__.py       0      0      0      0   100%
#   src/shop/export.py        14      0      4      0   100%
#   src/shop/gst.py           10      0      2      0   100%
#   src/shop/payments.py      13      2      2      1    80%   22-23
#   ------------------------------------------------------------------
#   TOTAL                     37      2      8      1    93%
#
#   $ pytest --cov --cov-report=html      # then open htmlcov/index.html
#   $ pytest --cov --cov-fail-under=95    # exits with code 1 at 93%`
    },
    {
      heading: "10. Organizing Tests, Markers and pytest Configuration in pyproject.toml",
      content: `A test suite is code: it needs structure or it rots. The layout used throughout this lecture is the modern **src layout**, which most Python packaging guides recommend:
• \`src/shop/\` — the package. Because it is not on the path by default, tests can only import it after \`uv sync\` or \`pip install -e .\` installs it, which guarantees you test the installed package, exactly as users will.
• \`tests/\` — mirrors the package: \`tests/test_gst.py\` tests \`src/shop/gst.py\`. For bigger projects add sub-folders: \`tests/unit/\`, \`tests/integration/\`, \`tests/e2e/\`, each with its own \`conftest.py\`.
• \`tests/conftest.py\` — shared fixtures; no \`__init__.py\` is needed in \`tests/\` with the default \`importmode=prepend\`, but you must avoid two test files with the same basename in different folders unless you add \`__init__.py\` files or set \`--import-mode=importlib\`.
**Naming tests** is a skill. \`test_1\` is useless; \`test_refund_after_30_days_is_rejected\` tells a reader the rule being protected. A common pattern is **Arrange–Act–Assert**: set up data, call the function, check the result, separated by blank lines.
**Markers** label tests so you can select or skip them. Built-in markers: \`@pytest.mark.skip(reason=...)\`, \`@pytest.mark.skipif(sys.platform == "win32", reason=...)\`, \`@pytest.mark.xfail(raises=NotImplementedError)\`. Custom markers such as \`slow\`, \`integration\` or \`external\` must be **registered** in configuration, otherwise pytest warns about unknown marks (\`--strict-markers\` turns the warning into an error, which you want). Then run \`pytest -m "not slow"\` locally and the full suite in CI.
**Configuration** lives in \`pyproject.toml\` under \`[tool.pytest.ini_options]\`. The most useful keys: \`testpaths\` (where to look), \`addopts\` (flags applied to every run), \`markers\` (registrations), \`filterwarnings\` (turn deprecation warnings into errors so you notice them), and \`xfail_strict\` (an xfail test that unexpectedly passes becomes a failure, so you remove stale marks).
Finally, **speed**: install \`pytest-xdist\` and run \`pytest -n auto\` to spread tests across all CPU cores — a 4-minute suite often drops to under a minute. That only works if tests are independent, which is one more reason to avoid shared mutable state.`,
      codeSnippet: `# Project layout
# shop-project/
# ├── pyproject.toml
# ├── src/shop/
# │   ├── __init__.py
# │   ├── gst.py
# │   ├── payments.py
# │   └── export.py
# └── tests/
#     ├── conftest.py
#     ├── unit/
#     │   ├── test_gst.py
#     │   └── test_payments.py
#     └── integration/
#         ├── conftest.py
#         └── test_export.py

# pyproject.toml
[project]
name = "shop"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = ["httpx>=0.28"]

[dependency-groups]
dev = ["pytest>=9", "pytest-cov", "pytest-asyncio", "pytest-xdist"]

[tool.pytest.ini_options]
testpaths = ["tests"]
addopts = "-ra --strict-markers --strict-config"
xfail_strict = true
filterwarnings = ["error::DeprecationWarning"]
markers = [
    "slow: tests that take more than a second",
    "integration: tests that need a real database or network",
]

# tests/integration/test_export.py (excerpt)
import sys
import pytest


@pytest.mark.slow
@pytest.mark.integration
def test_export_ten_thousand_orders(tmp_path):
    ...


@pytest.mark.skipif(sys.platform == "win32", reason="symlinks need admin on Windows")
def test_symlinked_output(tmp_path):
    ...


@pytest.mark.xfail(reason="bug #142: unicode names break CSV header", strict=True)
def test_unicode_customer_name(tmp_path):
    ...

# $ pytest -m "not slow and not integration" -n auto   # fast local run
# $ pytest -m integration                               # only integration tests`
    },
    {
      heading: "11. Testing Async Code with pytest-asyncio",
      content: `In the previous lecture you wrote \`async def\` functions and ran them with \`asyncio.run()\`. A test function declared with \`async def\` is a coroutine; plain pytest does not know how to run it and will skip it with a warning ("async def functions are not natively supported"). You need a plugin that provides an event loop. The two popular choices are **pytest-asyncio** (the most widely used; install with \`uv add --dev pytest-asyncio\`) and **anyio** (which comes with pytest support and also works with Trio).
With pytest-asyncio there are two modes:
• **strict mode** (default) — every async test must be decorated with \`@pytest.mark.asyncio\`, and async fixtures with \`@pytest_asyncio.fixture\`. Explicit, but noisy.
• **auto mode** — set \`asyncio_mode = "auto"\` in \`[tool.pytest.ini_options]\` and every \`async def test_...\` is run automatically, with ordinary \`@pytest.fixture\` working for async fixtures too. Most projects choose this.
**Async fixtures** work like sync ones: \`async def\` with \`yield\` for teardown, so you can open an \`httpx.AsyncClient\` once and close it after the test. Note that the event loop is function-scoped by default; a session-scoped async fixture needs \`loop_scope="session"\` on the fixture and the tests, otherwise you get "attached to a different loop" errors.
**Mocking coroutines** uses \`unittest.mock.AsyncMock\` (Python 3.8+). Calling it returns an awaitable, so \`await fake.fetch()\` works and \`fake.fetch.assert_awaited_once_with(...)\` verifies the interaction. A plain \`MagicMock\` would return a non-awaitable and crash with "object MagicMock can't be used in 'await' expression" — a very common error.
**Testing timeouts and concurrency.** Use \`asyncio.timeout()\` inside tests to make a hung coroutine fail fast rather than hanging the whole suite, and when testing a function that uses \`asyncio.gather\`, inject fakes with different delays to verify that it really runs concurrently (total time close to the slowest call, not the sum). The example tests a price-aggregator that fetches rates from several suppliers concurrently.`,
      codeSnippet: `# Install:  uv add --dev pytest-asyncio
# pyproject.toml:
#   [tool.pytest.ini_options]
#   asyncio_mode = "auto"

# src/shop/rates.py
import asyncio
from collections.abc import Awaitable, Callable

Fetcher = Callable[[str], Awaitable[float]]


async def cheapest_rate(product: str, fetchers: list[Fetcher]) -> float:
    """Query every supplier concurrently and return the lowest price."""
    results = await asyncio.gather(*(f(product) for f in fetchers), return_exceptions=True)
    prices = [r for r in results if isinstance(r, (int, float))]
    if not prices:
        raise LookupError(f"no supplier returned a price for {product!r}")
    return min(prices)


# tests/test_rates.py
import asyncio
import time
from unittest.mock import AsyncMock

import pytest

from shop.rates import cheapest_rate


async def test_returns_lowest_price():
    fast = AsyncMock(return_value=120.0)
    slow = AsyncMock(return_value=99.5)
    assert await cheapest_rate("usb-cable", [fast, slow]) == 99.5
    fast.assert_awaited_once_with("usb-cable")


async def test_ignores_failing_supplier():
    broken = AsyncMock(side_effect=ConnectionError("supplier down"))
    good = AsyncMock(return_value=250.0)
    assert await cheapest_rate("charger", [broken, good]) == 250.0


async def test_raises_when_all_fail():
    broken = AsyncMock(side_effect=TimeoutError)
    with pytest.raises(LookupError, match="no supplier"):
        await cheapest_rate("charger", [broken, broken])


async def test_fetchers_run_concurrently():
    async def delayed(price: float, delay: float):
        async def fetch(_: str) -> float:
            await asyncio.sleep(delay)
            return price
        return fetch

    fetchers = [await delayed(100, 0.2), await delayed(90, 0.2), await delayed(95, 0.2)]
    start = time.perf_counter()
    async with asyncio.timeout(1):                # fail fast if something hangs
        result = await cheapest_rate("pen", fetchers)
    elapsed = time.perf_counter() - start
    assert result == 90
    assert elapsed < 0.4                          # ~0.2s, not 0.6s => concurrent`
    },
    {
      heading: "12. Continuous Integration: Running pytest in GitHub Actions",
      content: `Tests that run only on your laptop protect only your laptop. **Continuous Integration (CI)** runs the test suite automatically on every push and pull request, on a clean machine, so "it works on my machine" is never the final word. GitHub Actions is free for public repositories and included in private ones with generous limits, which makes it the default for most Indian startups and open-source projects.
A workflow is a YAML file in \`.github/workflows/\`. The one below does what a professional Python pipeline needs:
• **Triggers** on pushes to \`main\` and on every pull request.
• **Matrix** — runs the suite on Python 3.12, 3.13 and 3.14 in parallel, so you learn immediately if a new interpreter breaks something. Add \`os\` to the matrix to cover Windows and macOS as well.
• **Checkout and setup** — \`actions/checkout\` fetches the code; \`astral-sh/setup-uv\` installs uv and enables caching of the dependency download, which cuts a 60-second install to a few seconds on repeat runs.
• **Install** — \`uv sync\` creates the environment from \`uv.lock\`, so CI uses exactly the versions you tested locally. With pip you would run \`pip install -e ".[dev]"\` instead.
• **Test with coverage** — \`uv run pytest --cov --cov-report=xml\`; the \`fail_under\` in \`pyproject.toml\` makes the job fail if coverage regresses.
• **Upload the report** as an artifact (or to Codecov) so reviewers can see it on the pull request.
Once the workflow is green, enable **branch protection** on \`main\` so that a pull request cannot be merged until the "tests" check passes. That single setting is what turns a test suite from a good habit into an enforced quality gate. Add a linting step (\`ruff check .\` and \`ruff format --check .\`) in the same job; on larger projects split lint and test into separate jobs so they run in parallel.
Keep CI fast: cache dependencies, run \`pytest -n auto\`, mark genuinely slow integration tests and run them on a nightly schedule (\`on: schedule\`) rather than on every commit. A pipeline that takes 15 minutes gets ignored; one that takes 2 minutes gets trusted.`,
      codeSnippet: `# .github/workflows/tests.yml
name: tests

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        python-version: ["3.12", "3.13", "3.14"]

    steps:
      - uses: actions/checkout@v4

      - name: Install uv
        uses: astral-sh/setup-uv@v6
        with:
          enable-cache: true

      - name: Set up Python \${{ matrix.python-version }}
        run: uv python install \${{ matrix.python-version }}

      - name: Install dependencies
        run: uv sync --locked --all-groups

      - name: Lint
        run: |
          uv run ruff check .
          uv run ruff format --check .

      - name: Run tests with coverage
        run: uv run pytest -n auto --cov --cov-report=xml --cov-report=term-missing

      - name: Upload coverage report
        if: matrix.python-version == '3.14'
        uses: actions/upload-artifact@v4
        with:
          name: coverage-xml
          path: coverage.xml

# Equivalent local command before you push:
#   $ uv run pytest -n auto --cov`
    },
    {
      heading: "13. Real-World Use Cases: How pytest Is Used in Production Teams",
      content: `Here is how the pieces from this lecture combine in the kinds of projects you will actually work on.
**1. FastAPI backend (next lecture).** Every endpoint gets tests through \`httpx.AsyncClient\` with \`ASGITransport\`, so requests hit the app in-process without a running server. A \`client\` fixture builds the app with dependency overrides that swap the real PostgreSQL session for a SQLite or transactional test session. Parametrized tests cover validation errors (422), authentication (401/403) and the happy path. This is the standard pattern in fintech and SaaS teams across Bengaluru and Hyderabad.
**2. Data pipelines with pandas.** A fixture returns a small, hand-written \`DataFrame\` with the edge cases that matter (missing values, duplicate IDs, a negative amount). Transformations are tested with \`pandas.testing.assert_frame_equal\`, and the raw CSV is read from \`tmp_path\` so the test never depends on a file on someone's laptop. Coverage reveals the \`except\` branches that no sample data ever triggers.
**3. Scheduled jobs and notifications.** A nightly job that sends reminder SMS to customers is tested with \`monkeypatch\` to freeze "today", a \`MagicMock\` SMS client to capture what would have been sent, and \`caplog\` to assert that failures are logged with the customer ID for later retry.
**4. Library and SDK maintainers.** Open-source packages run a matrix across four Python versions and three operating systems in GitHub Actions, use \`xfail\` for known upstream bugs, and \`--strict-markers\` and \`filterwarnings = error\` to catch deprecations before users do.
**5. Legacy code rescue.** When a team inherits an untested 20,000-line Django monolith, the practical approach is **characterization tests**: write tests that capture the current behaviour (even the odd parts), get coverage up on the modules you need to change, then refactor safely. pytest's \`--lf\` and \`-x\` flags make this iterative loop fast.
**6. Interview take-home assignments.** Candidates who submit a solution with a \`tests/\` folder, a \`pyproject.toml\` with pytest configured, and a green CI badge stand out immediately — it signals professional habits more than any single algorithm answer.
In each of these, note the shared discipline: tests are fast and isolated, external systems are faked at the boundary, and CI enforces the result.`
    },
    {
      heading: "14. Common Mistakes with pytest and How to Fix Them",
      content: `**1. Tests that depend on each other.** Test A creates a record, test B assumes it exists. The suite passes in order and fails with \`-n auto\` or \`-p randomly\`. Fix: every test builds its own state through fixtures; use a transaction-rollback fixture for databases.
**2. Patching the wrong target.** \`patch("requests.get")\` has no effect because \`shop/api.py\` imported \`get\` directly. Fix: patch where it is used — \`patch("shop.api.get")\` — or inject the dependency.
**3. Using MagicMock for async code.** \`await fake.fetch()\` crashes with "can't be used in 'await' expression". Fix: use \`AsyncMock\`, and assert with \`assert_awaited_once_with\`.
**4. Mutable default or module-level fixture data.** A list returned by a \`session\`-scoped fixture is mutated by one test and poisons the rest. Fix: keep mutable fixtures \`function\`-scoped, or return a fresh copy.
**5. A huge \`with pytest.raises\` block.** The test passes because *some* line raised, not the one you meant. Fix: put only the single call inside the block, and use \`match=\`.
**6. Comparing floats with \`==\`.** \`assert total == 4366.0\` fails intermittently after a refactor changes the order of multiplication. Fix: \`pytest.approx\`, or use \`Decimal\` for money.
**7. Asserting nothing.** A test that only calls the function gives coverage but no protection. Fix: every test asserts on the return value, a side effect, or a raised exception.
**8. Forgetting to register custom markers.** \`PytestUnknownMarkWarning\` is ignored, then a typo like \`@pytest.mark.slwo\` silently stops a test from being excluded. Fix: register markers in \`pyproject.toml\` and enable \`--strict-markers\`.
**9. Unawaited coroutine in a test.** Writing \`cheapest_rate("pen", fetchers)\` without \`await\` means the function never runs and the assertion compares a coroutine object. Fix: watch for \`RuntimeWarning: coroutine ... was never awaited\` and turn warnings into errors.
**10. Tests that hit the real network or clock.** They are slow, fail offline and break at midnight or on month boundaries. Fix: fake the boundary with \`monkeypatch\`, \`AsyncMock\` or a fake client; test the real integration separately with an \`integration\` marker.
**11. ImportError: No module named 'shop'.** The src layout requires the package to be installed. Fix: \`uv sync\` or \`pip install -e .\`; do not hack \`sys.path\` in \`conftest.py\`.
**12. Leaving \`print\` debugging in tests and wondering why nothing shows.** pytest captures output. Fix: run with \`-s\`, or better, use \`capsys\` and assert on the output; use \`breakpoint()\` with \`--pdb\` for real debugging.`
    },
    {
      heading: "15. Frequently Asked Questions about Testing Python with pytest",
      content: `**What is the difference between pytest and unittest in Python?**
\`unittest\` is in the standard library and follows the classic xUnit style: test classes inheriting from \`TestCase\`, \`setUp\`/\`tearDown\` methods, and \`self.assertEqual\`-style methods. pytest uses plain functions and plain \`assert\` with automatic introspection, has a far more flexible fixture system with scopes and dependency injection, supports parametrization natively, and has a large plugin ecosystem. pytest can also run existing \`unittest\` test cases, so migration is gradual.
**How does pytest discover tests?**
It recursively scans the directories in \`testpaths\` (or the current directory) for files named \`test_*.py\` or \`*_test.py\`, then collects \`test\`-prefixed functions and \`test\`-prefixed methods inside \`Test\`-prefixed classes that have no \`__init__\`. You can change these rules with \`python_files\`, \`python_classes\` and \`python_functions\` in configuration.
**What is a fixture in pytest and when should I use one?**
A fixture is a function decorated with \`@pytest.fixture\` that provides setup (and, via \`yield\`, teardown) for tests. A test receives it by naming it as a parameter. Use fixtures for anything more than one test needs: sample data, database sessions, temporary directories, HTTP clients. Put shared fixtures in \`conftest.py\`.
**What is the difference between monkeypatch and unittest.mock?**
\`monkeypatch\` is a pytest fixture for temporarily replacing attributes, dict items, environment variables or the working directory, with automatic restoration. \`unittest.mock\` provides mock objects (\`Mock\`, \`MagicMock\`, \`AsyncMock\`) that record calls, and \`patch\` for replacing targets. Use \`monkeypatch\` to swap a simple value or function; use mocks when you need to assert how the dependency was called.
**How do I test that a function raises an exception in pytest?**
Wrap only the call in \`with pytest.raises(ExceptionType, match="regex"):\`. Capture the exception with \`as excinfo\` if you need to inspect \`excinfo.value\` or its \`__cause__\`.
**How do I test async functions with pytest?**
Install \`pytest-asyncio\` (or use anyio), set \`asyncio_mode = "auto"\`, and write \`async def test_...\` functions. Replace awaited dependencies with \`unittest.mock.AsyncMock\`.
**How much code coverage is good enough?**
There is no magic number. Most teams set \`fail_under\` between 80 and 90 percent and care more about covering the branches that carry business risk (money, authentication, data loss) than about reaching 100%. Coverage shows what is untested; it does not prove what is tested is correct.
**How do I run only one test or only failed tests in pytest?**
\`pytest path/to/test_file.py::test_name\` runs one test; \`pytest -k "keyword"\` selects by name; \`pytest --lf\` re-runs only the last failures; \`pytest -x\` stops at the first failure.`
    },
    {
      heading: "16. Interview Questions and Answers on pytest and Python Testing",
      content: `**Q1. Explain how pytest's assertion introspection works.**
pytest installs an import hook that rewrites the AST of test modules at import time, replacing each \`assert\` with code that evaluates sub-expressions and stores their values. When an assertion fails, pytest prints the expression together with the intermediate values and a diff for collections. It applies to test files and \`conftest.py\`; other modules need \`pytest.register_assert_rewrite\`.
**Q2. What are fixture scopes, and what is the risk of using session scope?**
Scopes (\`function\`, \`class\`, \`module\`, \`package\`, \`session\`) control how often a fixture is created and torn down. Session scope saves time for expensive resources but shares one instance across all tests, so any mutation leaks between tests and creates order-dependent failures. Use it only for immutable or externally reset resources, and never let a session fixture depend on a function-scoped one.
**Q3. What is the difference between a mock, a stub and a fake?**
A **stub** returns canned answers (\`return_value\`). A **mock** additionally records calls so you can assert on interactions (\`assert_called_once_with\`). A **fake** is a working lightweight implementation, such as an in-memory repository replacing a database. \`unittest.mock\` objects can act as stubs or mocks; fakes are classes you write yourself.
**Q4. Why must you patch "where the name is used" rather than "where it is defined"?**
\`from x import y\` copies the reference \`y\` into the importing module's namespace at import time. Patching \`x.y\` later changes only \`x\`'s attribute; the importing module still holds the original. You must patch the name in the module under test.
**Q5. How does \`@pytest.mark.parametrize\` differ from a loop inside a test?**
Parametrize generates separate test items, each reported independently with its own ID; one failing case does not hide the others, and you can rerun a single case. A loop inside one test stops at the first failed assertion and reports as one test.
**Q6. What is TDD, and what are its three steps?**
Test-Driven Development: write a failing test first (**Red**), write the minimum code to make it pass (**Green**), then improve the design while keeping tests green (**Refactor**). It forces small steps, testable design and a suite that reflects requirements.
**Q7. What does \`conftest.py\` do?**
It is a per-directory plugin file that pytest loads automatically. It holds shared fixtures, hooks (such as \`pytest_addoption\` or \`pytest_collection_modifyitems\`) and assertion-rewrite registrations, and its fixtures are visible to every test in the same directory tree without imports.
**Q8. How would you make a flaky test suite reliable?**
Find order dependence by shuffling (\`pytest-randomly\`) and running in parallel (\`-n auto\`); remove shared mutable state; fake time, randomness and network at the boundary; set explicit timeouts for async code; avoid \`sleep\`-based synchronization; and quarantine genuinely slow integration tests behind markers.
**Q9. What is the difference between \`xfail\` and \`skip\`?**
\`skip\` does not run the test at all (for example, platform-specific code). \`xfail\` runs it and expects it to fail, documenting a known bug; with \`strict=True\`, an unexpected pass is reported as a failure so you remember to remove the mark.
**Q10. How do you test code that uses the current time?**
Inject a clock function as a parameter, or use \`monkeypatch\` to replace \`datetime\` in the module under test with a subclass whose \`now()\` returns a fixed value. Libraries like \`freezegun\` or \`time-machine\` automate this across the whole process.`
    },
    {
      heading: "17. Hands-On Exercise: Build a Wallet Service with the TDD Workflow",
      content: `You will now build a small **prepaid wallet** module — the kind that powers a food-delivery app's credit balance — using **Test-Driven Development**. TDD is a loop of three steps, repeated every few minutes:
1. **Red** — write one small test for behaviour that does not exist yet. Run \`pytest\`; it must fail (if it passes, the test is not testing anything new).
2. **Green** — write the simplest code that makes that test pass. Resist the urge to build ahead.
3. **Refactor** — with the tests green, improve names, remove duplication, tighten types. Run \`pytest\` again.
Why work this way? You never write untested code, you design the API from the caller's point of view (the test is the first caller), and you get a regression suite for free. In practice, teams mix TDD with test-after; what matters is that the tests exist and are meaningful.
**Requirements for the wallet:**
• It starts with a zero balance in paise (integers avoid float money bugs).
• \`top_up(amount)\` adds money; amounts must be positive and at most ₹50,000 (5,000,000 paise) per transaction.
• \`pay(amount, note)\` deducts money; it must raise \`InsufficientBalance\` if the balance is too low, and record a transaction.
• Every transaction is stored with a timestamp obtained from an injectable clock so tests are deterministic.
• \`statement()\` returns the transactions in order, and \`export_statement(path)\` writes them as CSV.
**Your steps:**
1. Create the project: \`uv init shop-wallet && cd shop-wallet && uv add --dev pytest pytest-cov\`. Create \`src/wallet/__init__.py\` (the \`[tool.pytest.ini_options]\` block from section 10 goes in \`pyproject.toml\`).
2. Copy the test file below into \`tests/test_wallet.py\` and comment out all but the first test. Run \`pytest\` — Red.
3. Write just enough in \`src/wallet/core.py\` to pass it — Green. Uncomment the next test. Repeat.
4. When all tests pass, run \`pytest --cov=wallet --cov-report=term-missing\`. Aim for 100% on this small module, and add a test for any line reported as missing.
5. Add the GitHub Actions workflow from section 12, push to GitHub, and watch the green check appear.
The complete reference implementation is included after the tests so you can check your work — but only after you have tried the Red–Green–Refactor loop yourself.`,
      codeSnippet: `# tests/test_wallet.py
from datetime import datetime
from decimal import Decimal
from pathlib import Path

import pytest

from wallet.core import InsufficientBalance, Wallet

FIXED_TIME = datetime(2026, 10, 9, 10, 0, 0)


@pytest.fixture
def wallet() -> Wallet:
    """A wallet with a frozen clock so timestamps are predictable."""
    return Wallet(owner="Priya", clock=lambda: FIXED_TIME)


def test_new_wallet_has_zero_balance(wallet: Wallet):
    assert wallet.balance == 0


def test_top_up_increases_balance(wallet: Wallet):
    wallet.top_up(50_000)                    # ₹500
    assert wallet.balance == 50_000
    assert wallet.balance_rupees == Decimal("500.00")


@pytest.mark.parametrize("bad_amount", [0, -1, 5_000_001])
def test_top_up_rejects_invalid_amounts(wallet: Wallet, bad_amount: int):
    with pytest.raises(ValueError, match="amount"):
        wallet.top_up(bad_amount)
    assert wallet.balance == 0


def test_pay_deducts_and_records_transaction(wallet: Wallet):
    wallet.top_up(50_000)
    wallet.pay(12_500, note="Biryani Bowl")
    assert wallet.balance == 37_500
    kinds = [t.kind for t in wallet.statement()]
    assert kinds == ["top_up", "payment"]
    assert wallet.statement()[1].note == "Biryani Bowl"
    assert wallet.statement()[1].at == FIXED_TIME


def test_pay_more_than_balance_raises(wallet: Wallet):
    wallet.top_up(1_000)
    with pytest.raises(InsufficientBalance) as excinfo:
        wallet.pay(2_500, note="Pizza")
    assert excinfo.value.shortfall == 1_500
    assert wallet.balance == 1_000              # unchanged after failure


def test_export_statement_writes_csv(wallet: Wallet, tmp_path: Path):
    wallet.top_up(20_000)
    wallet.pay(7_000, note="Metro card")
    target = wallet.export_statement(tmp_path / "statement.csv")
    lines = target.read_text(encoding="utf-8").splitlines()
    assert lines[0] == "at,kind,amount_paise,note"
    assert lines[1] == "2026-10-09T10:00:00,top_up,20000,"
    assert lines[2] == "2026-10-09T10:00:00,payment,-7000,Metro card"


# ---------------------------------------------------------------
# src/wallet/core.py  — reference implementation (write yours first!)
# ---------------------------------------------------------------
import csv
from collections.abc import Callable
from dataclasses import dataclass, field
from datetime import datetime
from decimal import Decimal
from pathlib import Path

MAX_TOP_UP_PAISE = 5_000_000   # ₹50,000


class InsufficientBalance(Exception):
    def __init__(self, shortfall: int) -> None:
        super().__init__(f"insufficient balance, short by {shortfall} paise")
        self.shortfall = shortfall


@dataclass(frozen=True, slots=True)
class Transaction:
    at: datetime
    kind: str            # "top_up" | "payment"
    amount_paise: int    # positive for top_up, negative for payment
    note: str = ""


@dataclass
class Wallet:
    owner: str
    clock: Callable[[], datetime] = datetime.now
    _transactions: list[Transaction] = field(default_factory=list, repr=False)

    @property
    def balance(self) -> int:
        return sum(t.amount_paise for t in self._transactions)

    @property
    def balance_rupees(self) -> Decimal:
        return (Decimal(self.balance) / 100).quantize(Decimal("0.01"))

    def top_up(self, amount_paise: int) -> None:
        if not 0 < amount_paise <= MAX_TOP_UP_PAISE:
            raise ValueError(f"amount must be between 1 and {MAX_TOP_UP_PAISE} paise")
        self._transactions.append(Transaction(self.clock(), "top_up", amount_paise))

    def pay(self, amount_paise: int, note: str) -> None:
        if amount_paise <= 0:
            raise ValueError("amount must be positive")
        if amount_paise > self.balance:
            raise InsufficientBalance(amount_paise - self.balance)
        self._transactions.append(Transaction(self.clock(), "payment", -amount_paise, note))

    def statement(self) -> list[Transaction]:
        return list(self._transactions)

    def export_statement(self, path: Path) -> Path:
        with path.open("w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["at", "kind", "amount_paise", "note"])
            for t in self._transactions:
                writer.writerow([t.at.isoformat(), t.kind, t.amount_paise, t.note])
        return path


# $ uv run pytest --cov=wallet --cov-report=term-missing
# ........                                               [100%]
# Name                   Stmts   Miss  Cover   Missing
# ----------------------------------------------------
# src/wallet/core.py        38      0   100%
# 8 passed in 0.05s`
    },
    {
      heading: "18. Summary",
      content: `• **Automated tests** protect against regressions, enable fearless refactoring and document behaviour; pytest is the de-facto standard Python test framework.
• pytest **discovers** \`test_*.py\` files and \`test_\`-prefixed functions automatically; run one file, one test, or a \`-k\` expression; use \`-x\`, \`--lf\`, \`-v\` and \`-s\` daily.
• Plain \`assert\` plus **assertion rewriting** gives rich failure output; use \`pytest.approx\` for floats and \`Decimal\` for money.
• **Fixtures** inject setup via parameter names, tear down after \`yield\`, and come in \`function\`, \`class\`, \`module\`, \`package\` and \`session\` scopes; share them in \`conftest.py\`.
• **@pytest.mark.parametrize** turns a table of cases into independent tests; stacked decorators multiply; fixtures can be parametrized too.
• Test failures with **pytest.raises(..., match=)**, inspect the exception through \`excinfo\`, and keep the \`with\` block to a single call.
• Isolate external systems with **monkeypatch** (attributes, env vars, cwd) and **unittest.mock** (\`MagicMock\`, \`AsyncMock\`, \`patch\`); patch where the name is used; prefer dependency injection.
• Use **tmp_path** for file I/O, **capsys** for printed output and **caplog** for log records.
• **pytest-cov** measures line and branch coverage; enforce a floor with \`fail_under\`, read \`term-missing\` to find untested code, and remember that coverage is not correctness.
• Organise with the **src layout**, register **markers**, configure everything in \`pyproject.toml\`, and parallelise with \`pytest-xdist\`.
• Test **async code** with pytest-asyncio in auto mode and \`AsyncMock\`; guard against hangs with \`asyncio.timeout\`.
• **TDD**: Red → Green → Refactor in small steps.
• **GitHub Actions** runs the suite on every push across a Python version matrix; branch protection makes it a real quality gate.
**Next lecture:** Building REST APIs with FastAPI`
    }
  ]
};
