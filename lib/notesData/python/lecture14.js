export const lecture14 = {
  slug: "lecture-14",
  number: 14,
  title: "Complete Python Course — Lecture 14: Building REST APIs with FastAPI",
  summary: "Learn to build production-ready REST APIs with FastAPI and Pydantic v2: path and query parameters, request and response models, HTTPException, dependency injection with Depends, async endpoints, SQLModel databases, OAuth2 JWT authentication, CORS for React/Next.js, TestClient tests and deployment.",
  readTime: "65 min read",
  difficulty: "Advanced",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. Introduction: What FastAPI Is and Why It Matters for Modern Python Backends",
      content: `Every mobile app, React dashboard or Next.js site you have ever used talks to a **backend API**: a server program that receives HTTP requests, reads or writes a database, and answers with JSON. In the Python world, **FastAPI** has become the default way to build those APIs. It was created by Sebastián Ramírez in 2018 and is now used by companies such as Netflix, Uber and Microsoft, and by thousands of Indian startups shipping fintech, ed-tech and logistics products.
FastAPI is a **web framework built on two libraries**: **Starlette** (which handles the ASGI web layer: routing, middleware, WebSockets, background tasks) and **Pydantic** (which handles data validation and serialization using Python type hints). The result is a framework where the type hints you already write become your validation rules, your documentation and your editor autocompletion, all at once.
Why developers choose FastAPI over Flask or Django REST Framework:
• **Type-hint driven validation** — declare \`price: float\` and FastAPI rejects "abc" with a clear 422 error before your code runs.
• **Automatic interactive docs** — every endpoint appears in Swagger UI at \`/docs\` and ReDoc at \`/redoc\` with zero extra work.
• **Async-native** — built on ASGI, so one worker can handle thousands of concurrent slow I/O requests (database, external APIs) using \`async def\`.
• **Dependency injection** — \`Depends\` lets you share database sessions, authentication and settings cleanly across endpoints.
• **Standards-based** — generates an OpenAPI 3.1 schema and uses JSON Schema, so frontend teams can generate TypeScript clients automatically.
This lecture assumes you know Python classes, type hints, decorators, \`async\`/\`await\` basics and pytest from the previous lectures. We use **Python 3.14** (the current stable series; everything also works on 3.12 and 3.13), **FastAPI 0.1xx with Pydantic v2** (FastAPI has required Pydantic v2 support since version 0.100 in 2023), and **SQLModel** for the database. By the end you will build, test and deploy a complete expense-tracker API with JWT login that a React or Next.js frontend can call.`
    },
    {
      heading: "2. Installing FastAPI with uv or pip, Running the fastapi CLI and Exploring the Automatic OpenAPI Docs",
      content: `The recommended install is \`fastapi[standard]\`, which pulls in FastAPI plus the pieces you need in practice: **uvicorn** (the ASGI server), **fastapi-cli** (the \`fastapi\` terminal command), **httpx** (used by TestClient), **python-multipart** (form and file uploads), **email-validator** and **jinja2**. Installing plain \`fastapi\` gives you only the library.
With **uv** (the fast, modern project manager we introduced earlier in the course), a new project takes four commands. With classic venv + pip it takes about the same. Both produce a \`pyproject.toml\` that records your dependencies.
The simplest FastAPI application is five lines: create an \`app\` object, decorate a function with \`@app.get("/")\`, and return a dict. FastAPI converts the dict to JSON, sets \`Content-Type: application/json\`, and returns status 200. Each decorator is called a **path operation**: the combination of an HTTP method (\`get\`, \`post\`, \`put\`, \`patch\`, \`delete\`) and a path.
Run it with \`fastapi dev main.py\`. The CLI finds the \`app\` variable, starts uvicorn on http://127.0.0.1:8000 with **auto-reload** (the server restarts whenever you save a file) and prints the docs URL. \`fastapi run main.py\` is the production equivalent: no reload, listens on 0.0.0.0, and enables proxy headers. If you prefer the raw server, \`uvicorn main:app --reload\` does the same thing (\`main\` is the module, \`app\` is the variable).
Open http://127.0.0.1:8000/docs and you will already see your endpoint in **Swagger UI**, with a "Try it out" button. That page is generated from the **OpenAPI schema** served at \`/openapi.json\` (OpenAPI 3.1 since FastAPI 0.99). A second UI, **ReDoc**, is at \`/redoc\` with a clean reference layout. Everything you declare in the coming sections — path types, query constraints, Pydantic models, response models, status codes, security schemes — flows into that schema automatically, and tools such as \`openapi-typescript\` or Orval can turn it into a fully typed TypeScript client for a Next.js frontend, so backend and frontend never disagree about field names.
You improve the docs by adding metadata rather than by writing documentation separately:
• \`FastAPI(title=..., version=..., description=...)\` sets the header; \`docs_url=None\` disables Swagger in production if you want.
• \`tags=["expenses"]\` on a route groups endpoints; \`openapi_tags\` on the app gives each tag a description.
• \`summary\` and \`description\` on a route, or simply the function's **docstring**, document the endpoint.
• \`Field(examples=[...])\` and \`Field(description=...)\` on models document request bodies.
• \`responses={404: {"description": "Expense not found"}}\` documents error cases.`,
      codeSnippet: `# --- Option A: uv (recommended) ---
# uv init expense-api
# cd expense-api
# uv add "fastapi[standard]"
# uv run fastapi dev main.py

# --- Option B: venv + pip ---
# python -m venv .venv
# .venv\\Scripts\\activate        (Windows)    |   source .venv/bin/activate  (macOS/Linux)
# pip install "fastapi[standard]"
# fastapi dev main.py

# main.py
from fastapi import FastAPI

app = FastAPI(
    title="Expense Tracker API",
    version="1.0.0",
    description="Lecture 14 demo API for the Complete Python Course",
    openapi_tags=[{"name": "system", "description": "Health and metadata endpoints."}],
    docs_url="/docs",        # set to None to hide Swagger UI in production
    redoc_url="/redoc",
)


@app.get("/", tags=["system"], summary="Welcome message")
def read_root():
    """Returns a greeting. The docstring becomes the endpoint description in /docs."""
    return {"message": "Namaste from FastAPI", "python": "3.14"}


@app.get("/health", tags=["system"])
def health_check():
    return {"status": "ok"}


# Terminal output of  fastapi dev main.py :
#   FastAPI   Starting development server
#   Serving at: http://127.0.0.1:8000
#   API docs:  http://127.0.0.1:8000/docs
#
# curl http://127.0.0.1:8000/
#   {"message":"Namaste from FastAPI","python":"3.14"}
#
# Browse: http://127.0.0.1:8000/docs            (Swagger UI, interactive)
#         http://127.0.0.1:8000/redoc           (ReDoc, reference layout)
#         http://127.0.0.1:8000/openapi.json    (raw schema for client generators)
# Generate a TS client:  npx openapi-typescript http://127.0.0.1:8000/openapi.json -o api.d.ts`
    },
    {
      heading: "3. Path Parameters and Query Parameters in FastAPI",
      content: `A REST URL carries data in two places. **Path parameters** are part of the path itself and identify a specific resource: \`/expenses/42\`. **Query parameters** come after the \`?\` and filter or page through a collection: \`/expenses?category=food&limit=20\`.
In FastAPI you declare a path parameter with curly braces in the route and a **function parameter of the same name**. The type hint does the conversion and validation: with \`expense_id: int\`, a request to \`/expenses/abc\` never reaches your function; FastAPI returns HTTP **422 Unprocessable Content** with a JSON body explaining that the value is not a valid integer. A request to \`/expenses/42\` gives you a real Python \`int\`, not the string "42".
Any function parameter that is **not** in the path becomes a query parameter automatically. Give it a default value and it becomes optional; use \`str | None = None\` (Python 3.10+ union syntax) for truly optional strings. Without a default it is required.
To add constraints (minimum, maximum, length, regex pattern, description) use \`Annotated\` from \`typing\` together with \`Query()\` or \`Path()\`. \`Annotated[int, Query(ge=1, le=100)] = 10\` reads as "an integer, at least 1, at most 100, default 10". The constraints show up in the docs and are enforced before your code runs. The \`Annotated\` style has been the recommended form since FastAPI 0.95 because it keeps the default value in the normal Python position and works with type checkers.
Order matters for fixed paths: declare \`/expenses/summary\` **before** \`/expenses/{expense_id}\`, otherwise "summary" is captured as an expense_id and fails integer validation. Use an \`Enum\` subclass as a parameter type to restrict values to a fixed set; the docs render it as a dropdown.`,
      codeSnippet: `# main.py (excerpt)
from enum import Enum
from typing import Annotated

from fastapi import FastAPI, Path, Query

app = FastAPI()


class Category(str, Enum):
    food = "food"
    travel = "travel"
    rent = "rent"


# Fixed path first, otherwise "summary" would be parsed as an expense_id
@app.get("/expenses/summary")
def expense_summary():
    return {"total": 18250.0, "count": 12}


@app.get("/expenses/{expense_id}")
def get_expense(
    expense_id: Annotated[int, Path(gt=0, description="Database id of the expense")],
):
    return {"expense_id": expense_id, "title": "Metro card recharge", "amount": 500.0}


@app.get("/expenses")
def list_expenses(
    category: Category | None = None,                            # optional enum filter
    q: Annotated[str | None, Query(max_length=50)] = None,       # optional search text
    limit: Annotated[int, Query(ge=1, le=100)] = 10,             # 1..100, default 10
    offset: Annotated[int, Query(ge=0)] = 0,
):
    return {"category": category, "q": q, "limit": limit, "offset": offset}


# GET /expenses/42                      -> {"expense_id": 42, ...}
# GET /expenses/abc                     -> 422, "Input should be a valid integer"
# GET /expenses?category=food&limit=5   -> {"category":"food","q":null,"limit":5,"offset":0}
# GET /expenses?limit=500               -> 422, "Input should be less than or equal to 100"`
    },
    {
      heading: "4. Request Bodies with Pydantic v2 Models",
      content: `When a client **creates or updates** data it sends a JSON body, usually with \`POST\`, \`PUT\` or \`PATCH\`. In FastAPI you describe that body with a **Pydantic model**: a class that inherits from \`BaseModel\` and lists fields with type hints. Declare a function parameter of that model type and FastAPI will read the JSON body, validate every field, convert types, and hand you a fully typed Python object with autocompletion in your editor.
Pydantic **v2** (the rewrite released in 2023 with a Rust core, 5–50x faster than v1) is what FastAPI uses today. The important v2 APIs to know:
• \`Field()\` adds constraints and metadata: \`Field(gt=0, le=1_000_000, description="Amount in rupees")\`.
• \`model_config = ConfigDict(...)\` replaces the old inner \`class Config\`. \`from_attributes=True\` (formerly \`orm_mode\`) lets a model be built from an ORM object.
• \`@field_validator("field")\` replaces \`@validator\`; \`@model_validator(mode="after")\` validates across fields.
• \`.model_dump()\` returns a dict (formerly \`.dict()\`); \`.model_dump_json()\` returns a JSON string; \`Model.model_validate(data)\` parses a dict.
Design tip used in every serious project: keep **separate models for input and output**. An \`ExpenseCreate\` model has only what the client may send (no \`id\`, no \`created_at\`, no \`owner_id\`). An \`ExpenseRead\` model adds the server-generated fields. A \`ExpenseUpdate\` model makes every field optional so \`PATCH\` can send partial data, and you apply it with \`model_dump(exclude_unset=True)\` so untouched fields keep their value. Sharing a base class avoids repeating fields.
If validation fails, FastAPI returns **422** with a \`detail\` list: each entry has \`loc\` (where the error is, e.g. \`["body", "amount"]\`), \`msg\` and \`type\`. Frontends can map these straight onto form fields.`,
      codeSnippet: `# schemas.py
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, field_validator


class ExpenseBase(BaseModel):
    title: str = Field(min_length=2, max_length=100, examples=["Chai at office"])
    amount: float = Field(gt=0, le=1_000_000, description="Amount in rupees")
    category: str = Field(default="misc", pattern=r"^[a-z]+$")

    @field_validator("title")
    @classmethod
    def strip_title(cls, value: str) -> str:
        return value.strip()


class ExpenseCreate(ExpenseBase):
    """What the client sends."""


class ExpenseUpdate(BaseModel):
    """PATCH body: every field optional."""
    title: str | None = Field(default=None, min_length=2, max_length=100)
    amount: float | None = Field(default=None, gt=0)
    category: str | None = None


class ExpenseRead(ExpenseBase):
    """What the server returns."""
    model_config = ConfigDict(from_attributes=True)   # allow building from ORM rows
    id: int
    created_at: datetime


# main.py (excerpt)
from fastapi import FastAPI
from schemas import ExpenseCreate, ExpenseUpdate

app = FastAPI()
fake_db: dict[int, dict] = {}


@app.post("/expenses")
def create_expense(expense: ExpenseCreate):
    new_id = len(fake_db) + 1
    fake_db[new_id] = {"id": new_id, **expense.model_dump(), "created_at": datetime.now()}
    return fake_db[new_id]


@app.patch("/expenses/{expense_id}")
def update_expense(expense_id: int, patch: ExpenseUpdate):
    stored = fake_db[expense_id]
    stored.update(patch.model_dump(exclude_unset=True))   # only fields the client sent
    return stored


# POST /expenses  {"title": "  Auto to Andheri ", "amount": 180}
#   -> 200 {"id": 1, "title": "Auto to Andheri", "amount": 180.0, "category": "misc", ...}
# POST /expenses  {"title": "x", "amount": -5}
#   -> 422 {"detail": [{"loc": ["body","title"], "msg": "String should have at least 2 characters", ...},
#                      {"loc": ["body","amount"], "msg": "Input should be greater than 0", ...}]}`
    },
    {
      heading: "5. Response Models, Status Codes and Error Handling with HTTPException",
      content: `A **response model** tells FastAPI what shape the response must have. Declare it as the function's **return type annotation** (\`-> ExpenseRead\`) or with \`response_model=ExpenseRead\` in the decorator. FastAPI then does three things: it **filters** the output to only the declared fields (so a \`hashed_password\` on your user object can never leak), it **validates** the data you return (catching bugs where you return the wrong shape), and it **documents** the response schema in Swagger. Return type annotations are preferred since FastAPI 0.89 because editors understand them; use \`response_model\` only when the annotation and the serialization shape must differ.
**Status codes** communicate the outcome. Set the success code with \`status_code=status.HTTP_201_CREATED\` on \`POST\` that creates a resource, and \`status.HTTP_204_NO_CONTENT\` on \`DELETE\` (return \`None\` and FastAPI sends an empty body). The \`status\` module from \`fastapi\` holds named constants so you never mistype a number. Conventions worth memorising: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized (not logged in), 403 Forbidden (logged in but not allowed), 404 Not Found, 409 Conflict (duplicate), 422 validation error, 500 server error.
For **errors**, raise \`HTTPException(status_code=..., detail=...)\`. Raising, rather than returning, means it works from any depth: inside a dependency, a helper function or a service class. The response body is \`{"detail": ...}\` and \`detail\` can be a string or any JSON-serializable object. You can also pass \`headers\`, which is how the \`WWW-Authenticate: Bearer\` header is sent on 401 responses.
When you want a **custom error format** across the whole app (for example \`{"error": {"code": "EXPENSE_NOT_FOUND", "message": ...}}\`), define your own exception class and register an \`@app.exception_handler(MyError)\` that returns a \`JSONResponse\`. You can override the built-in handlers too, e.g. for \`RequestValidationError\`, to reshape 422 responses to match what your frontend expects. Never let a raw Python exception escape: FastAPI turns it into a bare 500 with no detail, which is correct for security but useless for debugging, so log it in a handler.`,
      codeSnippet: `# main.py (excerpt)
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.responses import JSONResponse
from schemas import ExpenseCreate, ExpenseRead

app = FastAPI()
fake_db: dict[int, dict] = {}


class ExpenseNotFoundError(Exception):
    def __init__(self, expense_id: int):
        self.expense_id = expense_id


@app.exception_handler(ExpenseNotFoundError)
async def expense_not_found_handler(request: Request, exc: ExpenseNotFoundError):
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={"error": {"code": "EXPENSE_NOT_FOUND", "id": exc.expense_id}},
    )


@app.post("/expenses", response_model=ExpenseRead, status_code=status.HTTP_201_CREATED)
def create_expense(expense: ExpenseCreate):
    if any(e["title"] == expense.title for e in fake_db.values()):
        raise HTTPException(status.HTTP_409_CONFLICT, detail="Expense with this title exists")
    new_id = len(fake_db) + 1
    from datetime import datetime
    fake_db[new_id] = {"id": new_id, **expense.model_dump(), "created_at": datetime.now(),
                       "internal_note": "never shown"}        # filtered out by ExpenseRead
    return fake_db[new_id]


@app.get("/expenses/{expense_id}")
def get_expense(expense_id: int) -> ExpenseRead:            # return annotation = response model
    if expense_id not in fake_db:
        raise ExpenseNotFoundError(expense_id)               # handled by our custom handler
    return fake_db[expense_id]


@app.delete("/expenses/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(expense_id: int) -> None:
    if fake_db.pop(expense_id, None) is None:
        raise HTTPException(status_code=404, detail="Expense not found")


# GET /expenses/99  -> 404 {"error": {"code": "EXPENSE_NOT_FOUND", "id": 99}}
# DELETE /expenses/1 -> 204 (empty body)`
    },
    {
      heading: "6. Dependency Injection with Depends in FastAPI",
      content: `Almost every endpoint needs the same things: a database session, the currently logged-in user, pagination values, application settings. Copy-pasting that setup into every function is how bugs multiply. FastAPI solves this with **dependency injection**: you write the shared logic once as a function (the **dependency**), and declare it as a parameter with \`Depends()\`. FastAPI calls the dependency for each request, passes its return value into your endpoint, and, crucially, **the dependency itself can declare parameters** (query params, headers, other dependencies), which FastAPI also resolves. The docs show those parameters too.
With \`Annotated\` you can give a dependency a reusable alias: \`SessionDep = Annotated[Session, Depends(get_session)]\`. Now every endpoint simply writes \`session: SessionDep\`, which is both short and type-checked.
Dependencies written with \`yield\` get **cleanup**: code before \`yield\` runs before the endpoint, the value yielded is injected, and code after \`yield\` runs after the response is sent. This is exactly how database sessions are opened and closed per request, so a crash in the endpoint never leaks a connection. Use \`try/finally\` or a \`with\` block inside the dependency for guaranteed cleanup.
Other patterns you will use constantly:
• **Class dependencies** — a class whose \`__init__\` takes query params (\`PaginationParams(limit, offset)\`) groups related parameters.
• **Router or app-level dependencies** — \`APIRouter(dependencies=[Depends(require_admin)])\` protects every route in a router without touching each function.
• **Caching** — within a single request, a dependency used in several places runs **once** and its value is reused (pass \`use_cache=False\` to disable).
• **Overriding in tests** — \`app.dependency_overrides[get_session] = fake_session\` swaps a real database for an in-memory one. This is why DI makes FastAPI apps so testable (section 11).`,
      codeSnippet: `# deps.py
from typing import Annotated, Iterator

from fastapi import Depends, Header, HTTPException, Query
from sqlmodel import Session

from db import engine


def get_session() -> Iterator[Session]:
    with Session(engine) as session:     # opened before the endpoint...
        yield session                    # ...injected here...
    # ...and closed after the response, even if the endpoint raised


SessionDep = Annotated[Session, Depends(get_session)]


class PaginationParams:
    def __init__(
        self,
        limit: Annotated[int, Query(ge=1, le=100)] = 20,
        offset: Annotated[int, Query(ge=0)] = 0,
    ):
        self.limit = limit
        self.offset = offset


PaginationDep = Annotated[PaginationParams, Depends()]   # Depends() with no arg = use the class


def require_api_key(x_api_key: Annotated[str | None, Header()] = None) -> str:
    if x_api_key != "dev-key-123":
        raise HTTPException(status_code=401, detail="Invalid or missing X-API-Key header")
    return x_api_key


# main.py (excerpt)
from fastapi import APIRouter, Depends, FastAPI
from sqlmodel import select
from deps import PaginationDep, SessionDep, require_api_key
from models import Expense

app = FastAPI()
admin = APIRouter(prefix="/admin", dependencies=[Depends(require_api_key)])  # guards all routes


@app.get("/expenses")
def list_expenses(session: SessionDep, page: PaginationDep):
    stmt = select(Expense).offset(page.offset).limit(page.limit)
    return session.exec(stmt).all()


@admin.delete("/expenses")
def wipe_expenses(session: SessionDep):
    for row in session.exec(select(Expense)).all():
        session.delete(row)
    session.commit()
    return {"deleted": True}


app.include_router(admin)
# DELETE /admin/expenses without header -> 401 {"detail": "Invalid or missing X-API-Key header"}`
    },
    {
      heading: "7. Async Endpoints in FastAPI: async def vs def and When to Use Each",
      content: `FastAPI runs on an **ASGI** server (uvicorn), which means a single process can juggle many requests at once using Python's \`asyncio\` event loop. You opt into that concurrency per endpoint by writing \`async def\`. Inside an async endpoint you \`await\` I/O operations (an HTTP call with \`httpx.AsyncClient\`, an async database driver, \`asyncio.sleep\`) and, while waiting, the event loop serves other requests. For an API that mostly waits on databases and external services this is where FastAPI's famous performance comes from.
The rule that confuses most beginners: **what happens with a plain \`def\` endpoint?** FastAPI does not run it on the event loop; it runs it in a **threadpool** so that it cannot block other requests. So plain \`def\` is perfectly fine and is the right choice whenever you call **blocking** libraries: synchronous SQLAlchemy/SQLModel sessions, \`requests\`, \`time.sleep\`, pandas, file I/O. The same rule applies to dependencies.
The dangerous combination is **\`async def\` + a blocking call**. The call freezes the event loop, and every other request on that worker waits. With \`time.sleep(5)\` inside an \`async def\`, your whole API stalls for five seconds. The fix is either to make the endpoint \`def\`, or to use the async version of the library (\`await asyncio.sleep(5)\`, \`httpx.AsyncClient\`, async SQLAlchemy with \`aiosqlite\`/\`asyncpg\`), or to push the blocking call into a thread with \`await asyncio.to_thread(func, ...)\` (Python 3.9+).
Practical guidance for choosing:
• Calling external HTTP APIs, async database drivers, Redis with an async client → \`async def\`.
• Using sync SQLModel/SQLAlchemy sessions (what this lecture uses) → \`def\`.
• Pure CPU work (hashing passwords, resizing images) → \`def\`, or move it to a background worker such as Celery or an \`asyncio\` task queue.
• Fire-and-forget work after responding (sending an email, writing an audit log) → \`BackgroundTasks\`, which FastAPI runs after the response is sent.
Mixing both styles in one app is normal and expected.`,
      codeSnippet: `# main.py (excerpt)
import asyncio
import time

import httpx
from fastapi import BackgroundTasks, FastAPI

app = FastAPI()


@app.get("/rates/usd-inr")
async def usd_to_inr():
    # Non-blocking: while waiting for the network, other requests are served
    async with httpx.AsyncClient(timeout=5) as client:
        resp = await client.get("https://api.frankfurter.app/latest", params={"from": "USD", "to": "INR"})
    resp.raise_for_status()
    return {"usd_inr": resp.json()["rates"]["INR"]}


@app.get("/slow-good")
async def slow_good():
    await asyncio.sleep(2)            # yields to the event loop: OK
    return {"took": 2}


@app.get("/slow-bad")
async def slow_bad():
    time.sleep(2)                     # BLOCKS the event loop: every request waits. Do not do this.
    return {"took": 2}


@app.get("/slow-sync")
def slow_sync():
    time.sleep(2)                     # plain def -> runs in a threadpool, does not block others
    return {"took": 2}


def send_receipt_email(to: str, amount: float) -> None:
    time.sleep(1)                     # imagine an SMTP call
    print(f"Receipt for Rs.{amount:,.2f} sent to {to}")


@app.post("/expenses/{expense_id}/receipt")
async def email_receipt(expense_id: int, email: str, background: BackgroundTasks):
    background.add_task(send_receipt_email, email, 1250.0)
    return {"queued": True}           # response goes out immediately; task runs after`
    },
    {
      heading: "8. Database Access with SQLModel (SQLAlchemy Under the Hood)",
      content: `Real APIs persist data. The Python standard is **SQLAlchemy**, the mature ORM and SQL toolkit. **SQLModel**, written by FastAPI's author, is a thin layer that makes a single class work as **both** a Pydantic model and a SQLAlchemy table, so you do not maintain two parallel class hierarchies. Under the hood it is SQLAlchemy 2.x, so anything you learn transfers directly.
Install with \`uv add sqlmodel\` (pulls SQLAlchemy and Pydantic). A **table model** is a class with \`table=True\`; its \`Field(primary_key=True)\` column gets an auto-increment id; \`Field(index=True)\` adds a database index for columns you filter on. Classes without \`table=True\` are plain Pydantic schemas, which is how you reuse SQLModel for \`ExpenseCreate\`/\`ExpenseRead\` too.
The **engine** is created once per process. For development, SQLite is a single file (\`sqlite:///expenses.db\`) and needs \`connect_args={"check_same_thread": False}\` because FastAPI may use the same connection across threads. For production you point the same code at PostgreSQL (\`postgresql+psycopg://user:pass@host/db\`) with no other change. Create tables with \`SQLModel.metadata.create_all(engine)\` at startup, using the app's **lifespan** context manager (the modern replacement for the deprecated \`@app.on_event("startup")\`). In real projects you would run migrations with **Alembic** instead of \`create_all\`.
Each request gets its own **Session** from the \`get_session\` dependency in section 6. The core operations: \`session.add(obj)\` + \`session.commit()\` + \`session.refresh(obj)\` to insert and load the generated id; \`session.get(Expense, id)\` to fetch by primary key; \`session.exec(select(Expense).where(Expense.category == "food"))\` to query with \`.all()\`, \`.first()\` or \`.one()\`; and \`session.delete(obj)\` + \`commit()\` to remove. Updates are plain attribute assignment followed by \`add\`/\`commit\`. Because sync sessions are blocking, these endpoints use plain \`def\` (section 7).`,
      codeSnippet: `# app/models.py
from datetime import datetime
from sqlmodel import Field, SQLModel


class ExpenseBase(SQLModel):
    title: str = Field(min_length=2, max_length=100)
    amount: float = Field(gt=0)
    category: str = Field(default="misc", index=True)


class Expense(ExpenseBase, table=True):            # the actual database table
    id: int | None = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now)
    owner_id: int | None = Field(default=None, foreign_key="user.id", index=True)


class ExpenseCreate(ExpenseBase):                  # plain schema, no table
    pass


class ExpenseRead(ExpenseBase):
    id: int
    created_at: datetime


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str


# app/db.py
from contextlib import asynccontextmanager
from fastapi import FastAPI
from sqlmodel import SQLModel, create_engine

DATABASE_URL = "sqlite:///expenses.db"             # prod: postgresql+psycopg://user:pass@host/db
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})


@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)           # startup (use Alembic migrations in prod)
    yield
    engine.dispose()                               # shutdown


# app/main.py (excerpt)
from fastapi import FastAPI, HTTPException
from sqlmodel import select
from app.db import lifespan
from app.deps import SessionDep
from app.models import Expense, ExpenseCreate, ExpenseRead

app = FastAPI(lifespan=lifespan)


@app.post("/expenses", status_code=201)
def create_expense(payload: ExpenseCreate, session: SessionDep) -> ExpenseRead:
    expense = Expense.model_validate(payload)
    session.add(expense)
    session.commit()
    session.refresh(expense)                       # loads id and created_at from the DB
    return expense


@app.get("/expenses")
def list_expenses(session: SessionDep, category: str | None = None) -> list[ExpenseRead]:
    stmt = select(Expense)
    if category:
        stmt = stmt.where(Expense.category == category)
    return session.exec(stmt.order_by(Expense.created_at.desc())).all()


@app.put("/expenses/{expense_id}")
def replace_expense(expense_id: int, payload: ExpenseCreate, session: SessionDep) -> ExpenseRead:
    expense = session.get(Expense, expense_id)
    if not expense:
        raise HTTPException(404, "Expense not found")
    expense.sqlmodel_update(payload.model_dump())
    session.add(expense)
    session.commit()
    session.refresh(expense)
    return expense`
    },
    {
      heading: "9. Authentication in FastAPI with OAuth2 Password Flow and JWT Tokens",
      content: `Most APIs need to know **who** is calling. The standard approach FastAPI supports out of the box is the **OAuth2 password flow with Bearer tokens**: the client sends username and password **once** to a \`/token\` endpoint, receives a **JWT** (JSON Web Token), and then sends that token in the \`Authorization: Bearer <token>\` header on every later request. The server never stores sessions; it verifies the token's signature on each call.
A JWT has three Base64 parts: a header, a **payload** (claims such as \`sub\` = subject/username and \`exp\` = expiry), and a **signature** created with a secret key. Anyone can decode the payload (it is not encrypted), but nobody can alter it without invalidating the signature. Never put passwords or sensitive data inside a token, and always set an expiry.
The libraries the official FastAPI docs recommend today: **PyJWT** (\`uv add pyjwt\`) to sign and verify tokens, and **pwdlib** (\`uv add "pwdlib[argon2]"\`) to hash passwords with Argon2. (Older tutorials use \`python-jose\` and \`passlib\`; both are unmaintained and should be avoided in new code.) **Passwords are never stored in plain text**; you store \`hashed_password\` and compare using \`password_hash.verify()\`.
The pieces fit together through dependencies:
1. \`OAuth2PasswordBearer(tokenUrl="token")\` is a dependency that reads the \`Authorization\` header, returns the token string, or raises 401 if missing. It also tells Swagger UI where to log in, so the "Authorize" button works.
2. \`OAuth2PasswordRequestForm\` parses the form fields \`username\` and \`password\` sent to \`/token\` (form data, not JSON, per the OAuth2 spec; needs \`python-multipart\`, included in \`fastapi[standard]\`).
3. \`get_current_user\` decodes the token with \`jwt.decode\`, loads the user, and raises 401 on any \`jwt.InvalidTokenError\` (which covers expired tokens).
4. Endpoints declare \`user: CurrentUser\` and are automatically protected.
Keep the \`SECRET_KEY\` in an environment variable (generate one with \`openssl rand -hex 32\`), use short-lived access tokens (15–60 minutes) and, for real products, add refresh tokens and HTTPS. For third-party login (Google, GitHub) you would add an OAuth2 authorization-code flow, typically via a library such as Authlib.`,
      codeSnippet: `# app/auth.py
import os
from datetime import datetime, timedelta, timezone
from typing import Annotated

import jwt                                             # uv add pyjwt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pwdlib import PasswordHash                        # uv add "pwdlib[argon2]"
from sqlmodel import select

from app.deps import SessionDep
from app.models import User

SECRET_KEY = os.environ.get("SECRET_KEY", "dev-only-change-me")   # openssl rand -hex 32
ALGORITHM = "HS256"
ACCESS_TOKEN_MINUTES = 30

password_hash = PasswordHash.recommended()             # Argon2id
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
router = APIRouter(tags=["auth"])


def create_access_token(subject: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_MINUTES)
    return jwt.encode({"sub": subject, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], session: SessionDep) -> User:
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str | None = payload.get("sub")
    except jwt.InvalidTokenError:                      # bad signature, expired, malformed
        raise credentials_error
    user = session.exec(select(User).where(User.email == email)).first()
    if user is None:
        raise credentials_error
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


@router.post("/register", status_code=201)
def register(email: str, password: str, session: SessionDep):
    if session.exec(select(User).where(User.email == email)).first():
        raise HTTPException(409, "Email already registered")
    user = User(email=email, hashed_password=password_hash.hash(password))
    session.add(user)
    session.commit()
    return {"id": user.id, "email": user.email}


@router.post("/token")
def login(form: Annotated[OAuth2PasswordRequestForm, Depends()], session: SessionDep):
    user = session.exec(select(User).where(User.email == form.username)).first()
    if not user or not password_hash.verify(form.password, user.hashed_password):
        raise HTTPException(401, "Incorrect email or password", headers={"WWW-Authenticate": "Bearer"})
    return {"access_token": create_access_token(user.email), "token_type": "bearer"}


@router.get("/me")
def read_me(user: CurrentUser):
    return {"id": user.id, "email": user.email}


# curl -X POST http://127.0.0.1:8000/token -d "username=priya@example.com&password=secret123"
#   -> {"access_token": "eyJhbGciOi...", "token_type": "bearer"}
# curl http://127.0.0.1:8000/me -H "Authorization: Bearer eyJhbGciOi..."
#   -> {"id": 1, "email": "priya@example.com"}
# curl http://127.0.0.1:8000/me   -> 401 {"detail": "Not authenticated"}`
    },
    {
      heading: "10. CORS: Connecting a React or Next.js Frontend to Your FastAPI Backend",
      content: `The moment you call your API from a browser app running on a different origin — React on \`http://localhost:5173\` or Next.js on \`http://localhost:3000\` calling FastAPI on \`http://localhost:8000\` — the request fails with a console error mentioning **CORS**. **Cross-Origin Resource Sharing** is a browser security rule: a page may only read responses from another origin (scheme + host + port) if that server explicitly allows it via response headers such as \`Access-Control-Allow-Origin\`. Tools like curl, Postman and server-side code are not affected; only browsers enforce it.
FastAPI ships Starlette's \`CORSMiddleware\`. Add it with \`app.add_middleware(...)\` and list the **exact origins** of your frontends in \`allow_origins\`. For non-simple requests (JSON bodies, custom headers, \`Authorization\`), the browser first sends an **OPTIONS preflight** request; the middleware answers it automatically. Set \`allow_methods\` and \`allow_headers\` to \`["*"]\` during development; narrow them in production. If the frontend sends cookies or the \`Authorization\` header with \`credentials: "include"\`, you must set \`allow_credentials=True\`, and in that case browsers **reject** a wildcard \`"*"\` origin, so list real origins. \`allow_origin_regex\` is handy for preview deployments such as \`https://.*\\.vercel\\.app\`.
Where Next.js fits in:
• **Server Components, Route Handlers and Server Actions** run on the Next.js server, not in the browser, so their \`fetch\` calls to FastAPI are not subject to CORS at all. This is the cleanest pattern: the browser talks to Next.js, Next.js talks to FastAPI.
• **Client Components** (\`"use client"\`, \`useEffect\`, SWR, TanStack Query) run in the browser and need CORS, or you add a **rewrite** in \`next.config.js\` that proxies \`/api/:path*\` to \`http://localhost:8000/:path*\`, making the request same-origin.
For JWTs in a browser app, prefer sending the token in the \`Authorization\` header from memory or a Next.js Route Handler over storing it in \`localStorage\`, which is readable by any injected script.`,
      codeSnippet: `# app/main.py (excerpt)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",          # Next.js dev
        "http://localhost:5173",          # Vite/React dev
        "https://expenses.ravindra.dev",  # production frontend
    ],
    allow_origin_regex=r"https://.*\\.vercel\\.app",   # preview deployments
    allow_credentials=True,               # needed for cookies / Authorization header
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

# ---------------------------------------------------------------
# Next.js 16 app — app/expenses/page.js (Server Component: no CORS involved)
#
# export default async function ExpensesPage() {
#   const res = await fetch("http://localhost:8000/api/v1/expenses", { cache: "no-store" });
#   const expenses = await res.json();
#   return <ul>{expenses.map((e) => <li key={e.id}>{e.title} - Rs.{e.amount}</li>)}</ul>;
# }
#
# Client Component calling with a JWT (CORS applies):
#
# const res = await fetch("http://localhost:8000/me", {
#   headers: { Authorization: "Bearer " + token },
# });
#
# Alternative: proxy via next.config.js rewrites so the browser stays same-origin
# const nextConfig = {
#   async rewrites() {
#     return [{ source: "/api/:path*", destination: "http://localhost:8000/:path*" }];
#   },
# };`
    },
    {
      heading: "11. Testing FastAPI Applications with TestClient and pytest",
      content: `Because every FastAPI endpoint is a plain function fed by dependencies, testing is unusually pleasant. \`fastapi.testclient.TestClient\` (built on **httpx**, installed with \`fastapi[standard]\`) wraps your \`app\` and lets you send requests **in-process**, without starting a server. The API mirrors \`requests\`/\`httpx\`: \`client.get("/expenses")\`, \`client.post("/expenses", json={...})\`, \`client.get("/me", headers={"Authorization": "Bearer ..."})\`, and the response has \`.status_code\`, \`.json()\` and \`.headers\`. Test functions are ordinary \`def\` functions, even when the endpoints are \`async def\`, because TestClient drives the event loop for you.
The key to **isolated tests** is the dependency override system from section 6. Create an in-memory SQLite engine (\`sqlite://\` with \`StaticPool\` so all connections share one in-memory database), build the tables, and override \`get_session\` to yield a session from that engine. Each test gets a fresh database; your real \`expenses.db\` is never touched. Put the engine, session and client into **pytest fixtures** in \`conftest.py\` so test files stay short. Remember \`app.dependency_overrides.clear()\` after each test so overrides do not leak.
Using \`with TestClient(app) as client:\` (or a fixture that does so) runs the app's **lifespan** events, which matters if startup creates tables or connections. For authenticated endpoints, write a fixture that registers a user, logs in and returns headers with the token, then reuse it everywhere.
What to test, in priority order: the happy path for each endpoint (status code + body shape), validation failures (422 with the expected \`loc\`), authorisation failures (401/403), not-found cases (404), and business rules (e.g. a user can only see their own expenses). Run with \`uv run pytest -q\`; add \`pytest-cov\` for coverage. For async-only code paths you can also use \`httpx.AsyncClient(transport=ASGITransport(app=app), base_url="http://test")\` inside \`pytest-asyncio\` tests.`,
      codeSnippet: `# tests/conftest.py
import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from app.deps import get_session
from app.main import app


@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://",                                    # in-memory database
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,                           # one shared connection for the test
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session: Session):
    def override_get_session():
        yield session

    app.dependency_overrides[get_session] = override_get_session
    with TestClient(app) as client:                     # runs lifespan events
        yield client
    app.dependency_overrides.clear()


@pytest.fixture(name="auth_headers")
def auth_headers_fixture(client: TestClient):
    client.post("/register", params={"email": "priya@example.com", "password": "secret123"})
    token = client.post("/token", data={"username": "priya@example.com", "password": "secret123"})
    return {"Authorization": f"Bearer {token.json()['access_token']}"}


# tests/test_expenses.py
from fastapi.testclient import TestClient


def test_create_expense_returns_201(client: TestClient, auth_headers: dict):
    resp = client.post(
        "/api/v1/expenses",
        json={"title": "Ola to airport", "amount": 650, "category": "travel"},
        headers=auth_headers,
    )
    assert resp.status_code == 201
    body = resp.json()
    assert body["id"] == 1
    assert body["amount"] == 650.0
    assert "created_at" in body


def test_negative_amount_is_rejected(client: TestClient, auth_headers: dict):
    resp = client.post("/api/v1/expenses", json={"title": "Oops", "amount": -1}, headers=auth_headers)
    assert resp.status_code == 422
    assert resp.json()["detail"][0]["loc"] == ["body", "amount"]


def test_requires_token(client: TestClient):
    assert client.get("/api/v1/expenses").status_code == 401


def test_me_returns_logged_in_user(client: TestClient, auth_headers: dict):
    assert client.get("/me", headers=auth_headers).json()["email"] == "priya@example.com"


# $ uv run pytest -q
# ....                                                    [100%]
# 4 passed in 0.41s`
    },
    {
      heading: "12. Deploying FastAPI: fastapi run, Uvicorn Workers, Docker and Environment Variables",
      content: `Development uses \`fastapi dev\` with auto-reload and a single process. Production is different: no reload, multiple worker processes to use all CPU cores, binding to \`0.0.0.0\` so the container's port is reachable, HTTPS terminated by a reverse proxy or the platform, and configuration coming from **environment variables**.
The simplest production command is \`fastapi run app/main.py --port 8000 --workers 4\`, which runs uvicorn with four worker processes (a good starting point is one or two workers per CPU core). The equivalent direct command is \`uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4\`. In front of it sits a reverse proxy — Nginx, Caddy, or the load balancer of your cloud — that handles TLS and forwards \`X-Forwarded-*\` headers (\`fastapi run\` enables \`--proxy-headers\` by default so \`request.url\` reports https correctly).
**Configuration** should never be hard-coded. Use **pydantic-settings** (\`uv add pydantic-settings\`): a \`Settings(BaseSettings)\` class reads typed values from environment variables or a \`.env\` file, validates them at startup, and is injected with \`Depends\`. Keep \`.env\` out of git.
**Docker** is the universal packaging format. The image below uses the official slim Python 3.14 base, installs dependencies with uv from \`pyproject.toml\` and \`uv.lock\` for reproducible builds, copies the code, and starts \`fastapi run\`. Platforms that run such a container with a free or cheap tier include Render, Railway, Fly.io, Google Cloud Run, AWS App Runner and Azure Container Apps; all of them inject a \`PORT\` variable and give you HTTPS. For a traditional VPS (DigitalOcean, AWS EC2, Hetzner, or an Indian provider), run the container (or a systemd service) behind Nginx with a Let's Encrypt certificate.
A production checklist: set a real \`SECRET_KEY\`; switch SQLite to PostgreSQL (managed Postgres on Neon, Supabase or RDS) and run Alembic migrations in the deploy step; restrict CORS origins; hide \`/docs\` or protect it; add structured logging and a \`/health\` endpoint for the load balancer; pin dependency versions with a lock file; and run the test suite in CI (GitHub Actions) before every deploy.`,
      codeSnippet: `# app/settings.py           (uv add pydantic-settings)
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    app_name: str = "Expense Tracker API"
    database_url: str = "sqlite:///expenses.db"
    secret_key: str                       # required: startup fails if missing
    access_token_minutes: int = 30
    cors_origins: list[str] = ["http://localhost:3000"]


@lru_cache
def get_settings() -> Settings:          # read .env once, reuse everywhere via Depends(get_settings)
    return Settings()


# .env  (never commit this file)
# SECRET_KEY=4f9d...64-hex-chars...
# DATABASE_URL=postgresql+psycopg://app:pass@db.internal:5432/expenses
# CORS_ORIGINS=["https://expenses.ravindra.dev"]

# Dockerfile
# FROM python:3.14-slim
# COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/
# WORKDIR /code
# COPY pyproject.toml uv.lock ./
# RUN uv sync --frozen --no-dev --no-install-project
# COPY ./app ./app
# ENV PATH="/code/.venv/bin:$PATH"
# EXPOSE 8000
# CMD ["fastapi", "run", "app/main.py", "--port", "8000", "--workers", "2"]

# Build and run locally:
#   docker build -t expense-api .
#   docker run -p 8000:8000 --env-file .env expense-api
#
# Without Docker, on a VPS behind Nginx:
#   uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4 --proxy-headers --forwarded-allow-ips="*"`
    },
    {
      heading: "13. How FastAPI Is Used in Production: Project Structure with APIRouter and Real-World Use Cases",
      content: `A single \`main.py\` is fine for learning, but production code is split into **routers**. \`APIRouter(prefix="/expenses", tags=["expenses"])\` behaves like a mini-app: you decorate functions with \`@router.get(...)\`, then \`app.include_router(router)\` in \`main.py\`. A typical layout is \`app/main.py\` (app object, middleware, router registration), \`app/routers/expenses.py\`, \`app/routers/auth.py\`, \`app/models.py\` (SQLModel tables), \`app/schemas.py\` (request/response models), \`app/deps.py\` (dependencies), \`app/db.py\` (engine and lifespan), \`app/settings.py\`, and \`tests/\`. Routers can carry a shared dependency list and shared \`responses\`, and mounting them under a versioned prefix such as \`/api/v1\` gives you API versioning for free when a breaking change arrives later.
Beyond structure, FastAPI is not only for toy CRUD apps. Here is how teams actually use it, and which parts of this lecture each case relies on.
• **Backend for a React or Next.js product** — the most common case for Indian startups: a Next.js frontend on Vercel, a FastAPI service on Render or AWS, PostgreSQL via SQLModel, JWT auth, CORS configured for the Vercel domain. The OpenAPI schema is used to generate a TypeScript client so frontend and backend types stay in sync.
• **Serving machine-learning models** — FastAPI dominates ML deployment. A model (scikit-learn, PyTorch, an LLM wrapper) is loaded once in the **lifespan** function, and a \`POST /predict\` endpoint validates the input with a Pydantic model and returns scores. Pydantic catches malformed feature vectors before they reach the model. Hugging Face, OpenAI-compatible servers (vLLM) and LangServe are all built on it.
• **Microservices and internal APIs** — small services (payments, notifications, search) each with their own FastAPI app, talking over HTTP with \`httpx.AsyncClient\`. \`async def\` endpoints let one small container handle thousands of concurrent calls to other services.
• **Webhook receivers** — payment gateways such as Razorpay or Stripe, WhatsApp Business, GitHub: FastAPI verifies the signature in a dependency, acknowledges with 200 immediately, and processes the event with \`BackgroundTasks\` or a queue so the sender never times out.
• **Mobile app backends** — Flutter or React Native apps hit the same JWT-protected endpoints; the automatic docs double as the contract for the mobile team.
• **Data and automation APIs** — wrapping a pandas pipeline, a report generator or an internal script with an endpoint so non-developers can trigger it from a form. This is the bridge to the next lecture on NumPy and pandas.
• **WebSockets and real-time dashboards** — Starlette's WebSocket support (\`@app.websocket("/ws")\`) powers live order boards and chat features without extra infrastructure.
In all of these, the same four building blocks recur: Pydantic models for contracts, \`Depends\` for sessions and auth, \`async\` for I/O concurrency, and TestClient for confidence before deploying.`,
      codeSnippet: `# app/routers/expenses.py
from fastapi import APIRouter, HTTPException, status
from sqlmodel import select

from app.deps import SessionDep
from app.models import Expense
from app.schemas import ExpenseCreate, ExpenseRead

router = APIRouter(prefix="/expenses", tags=["expenses"])


@router.get(
    "",
    summary="List expenses",
    responses={401: {"description": "Not authenticated"}},
)
def list_expenses(session: SessionDep) -> list[ExpenseRead]:
    """Return all expenses, newest first."""
    return session.exec(select(Expense).order_by(Expense.id.desc())).all()


@router.post("", status_code=status.HTTP_201_CREATED)
def create_expense(payload: ExpenseCreate, session: SessionDep) -> ExpenseRead:
    expense = Expense.model_validate(payload)
    session.add(expense)
    session.commit()
    session.refresh(expense)
    return expense


@router.get("/{expense_id}")
def get_expense(expense_id: int, session: SessionDep) -> ExpenseRead:
    expense = session.get(Expense, expense_id)
    if not expense:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Expense not found")
    return expense


# app/main.py
from fastapi import FastAPI
from app.db import lifespan
from app.routers import auth, expenses

tags_metadata = [
    {"name": "expenses", "description": "Create, read, update and delete expenses."},
    {"name": "auth", "description": "Registration, login and token handling."},
]

app = FastAPI(title="Expense Tracker API", version="1.0.0", openapi_tags=tags_metadata, lifespan=lifespan)
app.include_router(auth.router)
app.include_router(expenses.router, prefix="/api/v1")     # GET /api/v1/expenses, GET /api/v1/expenses/7

# Project layout:
#   app/
#     main.py  db.py  deps.py  models.py  schemas.py  settings.py  auth.py
#     routers/  expenses.py  auth.py
#   tests/
#     conftest.py  test_expenses.py
#   pyproject.toml  uv.lock  Dockerfile  .env (not committed)`
    },
    {
      heading: "14. Common Mistakes with FastAPI and How to Fix Them",
      content: `**1. Blocking calls inside \`async def\`.** \`time.sleep\`, \`requests.get\`, a sync database session, or a heavy pandas operation inside an \`async def\` endpoint freezes the event loop for every user. Fix: use plain \`def\` for blocking code (FastAPI runs it in a threadpool), switch to an async library, or wrap with \`await asyncio.to_thread(...)\`.
**2. Returning ORM objects without a response model.** Your \`User\` row includes \`hashed_password\`; without \`-> UserRead\` it goes straight to the client. Fix: always declare a return type or \`response_model\` for anything that touches the database.
**3. One model for everything.** Using the table model as the request body lets clients set \`id\`, \`owner_id\` or \`created_at\`. Fix: separate \`Create\`, \`Update\` and \`Read\` schemas (section 4).
**4. Returning errors instead of raising.** \`return {"error": "not found"}\` gives status 200 and breaks every client's error handling. Fix: \`raise HTTPException(404, ...)\`.
**5. Wrong route order.** \`/expenses/{id}\` declared before \`/expenses/summary\` captures "summary" and returns 422. Fix: declare fixed paths first.
**6. CORS wildcard with credentials.** \`allow_origins=["*"]\` plus \`allow_credentials=True\` is rejected by browsers. Fix: list exact origins or use \`allow_origin_regex\`.
**7. Creating the engine or session per request / at import time wrongly.** A new \`create_engine\` in every call exhausts connections; a single global \`Session\` shared across requests corrupts state. Fix: one engine per process, one session per request via a \`yield\` dependency.
**8. Forgetting \`check_same_thread=False\` with SQLite.** Produces "SQLite objects created in a thread can only be used in that same thread". Fix: pass \`connect_args={"check_same_thread": False}\`.
**9. Secrets in code and tokens without expiry.** A hard-coded \`SECRET_KEY\` in git or a JWT with no \`exp\` is a breach waiting to happen. Fix: pydantic-settings + environment variables; always set \`exp\`; rotate keys.
**10. Using deprecated \`@app.on_event("startup")\` or Pydantic v1 syntax.** \`class Config\`, \`.dict()\`, \`@validator\` and \`orm_mode\` are v1-isms that emit warnings or break. Fix: \`lifespan=\`, \`model_config = ConfigDict(...)\`, \`.model_dump()\`, \`@field_validator\`, \`from_attributes=True\`.
**11. Leaking dependency overrides between tests.** Tests pass alone and fail together. Fix: \`app.dependency_overrides.clear()\` in fixture teardown.
**12. Running \`fastapi dev\` in production.** Reload mode is slow and single-process. Fix: \`fastapi run --workers N\` behind a reverse proxy.`
    },
    {
      heading: "15. Frequently Asked Questions about FastAPI REST APIs",
      content: `**What is FastAPI used for?**
FastAPI is a Python web framework for building HTTP APIs: backends for web and mobile apps, microservices, machine-learning model servers and webhook receivers. It uses type hints and Pydantic for validation, generates OpenAPI documentation automatically, and supports async for high concurrency.
**Is FastAPI better than Flask or Django for REST APIs?**
For pure APIs, FastAPI usually wins on validation, docs, async support and developer speed. Flask is simpler but needs extensions for the same features. Django (with Django REST Framework) is a full-stack framework with an admin panel and ORM batteries, better when you need those; many teams use Django for the admin and FastAPI for high-throughput services.
**What is the difference between async def and def in FastAPI?**
\`async def\` endpoints run on the event loop and must only await non-blocking code. Plain \`def\` endpoints run in a threadpool so blocking libraries do not stall other requests. Use \`async def\` with async libraries (httpx, async database drivers) and \`def\` with sync ones (requests, sync SQLAlchemy).
**How do I connect FastAPI to a database?**
Use SQLModel or SQLAlchemy: create one engine per process, open a Session per request through a \`yield\` dependency, and use \`select()\` statements. SQLite is fine for development; switch the connection URL to PostgreSQL for production and manage schema changes with Alembic.
**How does FastAPI handle authentication?**
FastAPI provides \`OAuth2PasswordBearer\` and \`OAuth2PasswordRequestForm\` for the OAuth2 password flow. You issue a JWT with PyJWT on login, hash passwords with pwdlib, and protect endpoints with a \`get_current_user\` dependency that validates the token. Swagger UI's Authorize button works with this setup.
**How do I fix a CORS error when calling FastAPI from React or Next.js?**
Add \`CORSMiddleware\` with your frontend's exact origin in \`allow_origins\`, enable \`allow_credentials=True\` if you send cookies or an Authorization header, and allow the methods and headers you use. Alternatively, call FastAPI from Next.js Server Components or a rewrite proxy so the browser never makes a cross-origin request.
**What is Pydantic v2 and why does FastAPI use it?**
Pydantic is the data-validation library behind FastAPI's request and response models. Version 2 (2023) rewrote the core in Rust for a large speed-up and changed the API: \`model_config\`, \`model_dump()\`, \`field_validator\`. FastAPI 0.100 and later support v2, and new projects should use v2 syntax exclusively.
**How do I deploy a FastAPI application?**
Package it in a Docker image, run \`fastapi run app/main.py --workers N\` (uvicorn under the hood) and deploy to a container platform such as Render, Railway, Cloud Run or a VPS behind Nginx. Supply configuration through environment variables and use a managed PostgreSQL database.`
    },
    {
      heading: "16. Interview Questions and Answers on FastAPI",
      content: `**Q1. What makes FastAPI "fast"?**
Two things: developer speed (type hints give validation, serialization and docs for free) and runtime speed (ASGI with uvicorn, async I/O, and Pydantic v2's Rust core). Its raw throughput is comparable to Node.js frameworks and far above WSGI-based Flask/Django for I/O-bound workloads.
**Q2. Explain how dependency injection works in FastAPI.**
A dependency is any callable declared with \`Depends()\`. Before running the endpoint, FastAPI resolves the dependency's own parameters (query, headers, other dependencies), calls it, caches the result for the request, and injects the value. \`yield\` dependencies add teardown after the response. Overrides via \`app.dependency_overrides\` enable testing.
**Q3. What is the difference between path, query and body parameters?**
Path parameters are declared in the route with braces and identify a resource; query parameters are plain function parameters with scalar types and filter or page; body parameters are Pydantic model parameters read from JSON. FastAPI infers which is which from the signature; \`Annotated\` with \`Path()\`, \`Query()\` or \`Body()\` adds constraints.
**Q4. How does FastAPI generate documentation?**
It builds an OpenAPI 3.1 schema from the routes, type hints, Pydantic models (as JSON Schema), status codes and metadata, serves it at \`/openapi.json\`, and renders it with Swagger UI at \`/docs\` and ReDoc at \`/redoc\`.
**Q5. What happens if you call a blocking function inside an async endpoint?**
It blocks the event loop; all other requests on that worker wait until it finishes. Fix by using a sync \`def\` endpoint, an async library, or \`asyncio.to_thread\`.
**Q6. How would you implement JWT authentication in FastAPI?**
A \`/token\` endpoint takes \`OAuth2PasswordRequestForm\`, verifies the password hash, and returns a signed JWT with \`sub\` and \`exp\` claims. A \`get_current_user\` dependency uses \`OAuth2PasswordBearer\` to read the Bearer header, decodes the token with PyJWT, loads the user, and raises 401 on failure. Endpoints depend on it.
**Q7. What is the purpose of response_model?**
It validates and filters the outgoing data to the declared schema, preventing leaks of internal fields, and documents the response. Since FastAPI 0.89 the return annotation serves the same purpose.
**Q8. How do you test a FastAPI app that uses a database?**
Use \`TestClient\` with \`app.dependency_overrides\` to replace the session dependency with one bound to an in-memory SQLite engine using \`StaticPool\`, wrapped in pytest fixtures. Each test gets a clean database and never touches production data.
**Q9. What is the difference between HTTPException and a custom exception handler?**
\`HTTPException\` is the built-in way to return an HTTP error with a \`detail\` body from anywhere. A custom handler registered with \`@app.exception_handler\` maps your own exception classes (or built-ins like \`RequestValidationError\`) to any response shape, centralising error formatting.
**Q10. Why use lifespan instead of startup events?**
\`@app.on_event\` is deprecated. A \`lifespan\` async context manager runs setup before \`yield\` and teardown after, in one place, and composes better with testing (\`with TestClient(app)\` triggers it).`
    },
    {
      heading: "17. Hands-On Exercise: Build and Test a Complete Expense Tracker API with FastAPI, SQLModel and JWT",
      content: `Put everything together in one runnable project. The API lets users register, log in, and manage **their own** expenses, with a monthly summary endpoint. It uses SQLModel with SQLite, JWT authentication with PyJWT and pwdlib, CORS for a Next.js frontend, a lifespan handler, dependency injection and a pytest suite.
**Setup:**
1. \`uv init expense-api && cd expense-api\`
2. \`uv add "fastapi[standard]" sqlmodel pyjwt "pwdlib[argon2]"\` and \`uv add --dev pytest\`
3. Save the code below as \`main.py\` and \`test_main.py\` in the project root.
4. Run \`uv run fastapi dev main.py\`, open http://127.0.0.1:8000/docs, click **Authorize**, register and log in, then create a few expenses.
5. Run \`uv run pytest -q\`; all tests should pass.
**Extend it (optional challenges):** add a \`PATCH /expenses/{id}\` with an \`ExpenseUpdate\` model; add \`limit\`/\`offset\` pagination with a class dependency; add a \`GET /expenses/export.csv\` that streams a CSV with \`StreamingResponse\`; replace SQLite with PostgreSQL via an environment variable; and build a Next.js page that lists the expenses from a Server Component.`,
      codeSnippet: `# main.py  — complete single-file Expense Tracker API
import os
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone
from typing import Annotated

import jwt
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pwdlib import PasswordHash
from sqlmodel import Field, Session, SQLModel, create_engine, func, select

# ---------- config ----------
SECRET_KEY = os.environ.get("SECRET_KEY", "dev-only-change-me")
ALGORITHM = "HS256"
TOKEN_MINUTES = 30
DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///expenses.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
password_hash = PasswordHash.recommended()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# ---------- models ----------
class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str


class ExpenseBase(SQLModel):
    title: str = Field(min_length=2, max_length=100)
    amount: float = Field(gt=0, le=1_000_000)
    category: str = Field(default="misc", max_length=30)


class Expense(ExpenseBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    owner_id: int = Field(foreign_key="user.id", index=True)
    created_at: datetime = Field(default_factory=datetime.now)


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseRead(ExpenseBase):
    id: int
    created_at: datetime


class UserCreate(SQLModel):
    email: str
    password: str = Field(min_length=8)


class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# ---------- dependencies ----------
def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]


def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], session: SessionDep) -> User:
    error = HTTPException(401, "Could not validate credentials", headers={"WWW-Authenticate": "Bearer"})
    try:
        email = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM]).get("sub")
    except jwt.InvalidTokenError:
        raise error
    user = session.exec(select(User).where(User.email == email)).first()
    if not user:
        raise error
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


# ---------- app ----------
@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield


app = FastAPI(title="Expense Tracker API", version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/register", status_code=201, tags=["auth"])
def register(payload: UserCreate, session: SessionDep):
    if session.exec(select(User).where(User.email == payload.email)).first():
        raise HTTPException(409, "Email already registered")
    user = User(email=payload.email, hashed_password=password_hash.hash(payload.password))
    session.add(user)
    session.commit()
    return {"id": user.id, "email": user.email}


@app.post("/token", tags=["auth"])
def login(form: Annotated[OAuth2PasswordRequestForm, Depends()], session: SessionDep) -> Token:
    user = session.exec(select(User).where(User.email == form.username)).first()
    if not user or not password_hash.verify(form.password, user.hashed_password):
        raise HTTPException(401, "Incorrect email or password", headers={"WWW-Authenticate": "Bearer"})
    expire = datetime.now(timezone.utc) + timedelta(minutes=TOKEN_MINUTES)
    return Token(access_token=jwt.encode({"sub": user.email, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM))


@app.post("/expenses", status_code=status.HTTP_201_CREATED, tags=["expenses"])
def create_expense(payload: ExpenseCreate, user: CurrentUser, session: SessionDep) -> ExpenseRead:
    expense = Expense.model_validate(payload, update={"owner_id": user.id})
    session.add(expense)
    session.commit()
    session.refresh(expense)
    return expense


@app.get("/expenses", tags=["expenses"])
def list_expenses(user: CurrentUser, session: SessionDep, category: str | None = None) -> list[ExpenseRead]:
    stmt = select(Expense).where(Expense.owner_id == user.id)
    if category:
        stmt = stmt.where(Expense.category == category)
    return session.exec(stmt.order_by(Expense.created_at.desc())).all()


@app.get("/expenses/summary", tags=["expenses"])
def summary(user: CurrentUser, session: SessionDep):
    stmt = (
        select(Expense.category, func.sum(Expense.amount), func.count(Expense.id))
        .where(Expense.owner_id == user.id)
        .group_by(Expense.category)
    )
    rows = session.exec(stmt).all()
    return {
        "total": round(sum(r[1] for r in rows), 2),
        "by_category": [{"category": r[0], "total": round(r[1], 2), "count": r[2]} for r in rows],
    }


@app.get("/expenses/{expense_id}", tags=["expenses"])
def get_expense(expense_id: int, user: CurrentUser, session: SessionDep) -> ExpenseRead:
    expense = session.get(Expense, expense_id)
    if not expense or expense.owner_id != user.id:
        raise HTTPException(404, "Expense not found")
    return expense


@app.delete("/expenses/{expense_id}", status_code=204, tags=["expenses"])
def delete_expense(expense_id: int, user: CurrentUser, session: SessionDep) -> None:
    expense = session.get(Expense, expense_id)
    if not expense or expense.owner_id != user.id:
        raise HTTPException(404, "Expense not found")
    session.delete(expense)
    session.commit()


# ======================================================================
# test_main.py  — run with:  uv run pytest -q
import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

import main


@pytest.fixture(name="client")
def client_fixture():
    test_engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
    SQLModel.metadata.create_all(test_engine)

    def override_session():
        with Session(test_engine) as session:
            yield session

    main.app.dependency_overrides[main.get_session] = override_session
    with TestClient(main.app) as client:
        yield client
    main.app.dependency_overrides.clear()


@pytest.fixture(name="headers")
def headers_fixture(client: TestClient):
    client.post("/register", json={"email": "arjun@example.com", "password": "strongpass1"})
    resp = client.post("/token", data={"username": "arjun@example.com", "password": "strongpass1"})
    return {"Authorization": f"Bearer {resp.json()['access_token']}"}


def test_register_duplicate_email(client: TestClient, headers: dict):
    resp = client.post("/register", json={"email": "arjun@example.com", "password": "strongpass1"})
    assert resp.status_code == 409


def test_create_and_list(client: TestClient, headers: dict):
    r = client.post("/expenses", json={"title": "Rent - Koramangala", "amount": 18000, "category": "rent"}, headers=headers)
    assert r.status_code == 201 and r.json()["id"] == 1
    client.post("/expenses", json={"title": "Dosa", "amount": 120, "category": "food"}, headers=headers)
    items = client.get("/expenses", headers=headers).json()
    assert [e["title"] for e in items] == ["Dosa", "Rent - Koramangala"]
    assert len(client.get("/expenses", params={"category": "food"}, headers=headers).json()) == 1


def test_summary(client: TestClient, headers: dict):
    for amt, cat in [(100, "food"), (250, "food"), (500, "travel")]:
        client.post("/expenses", json={"title": "Item", "amount": amt, "category": cat}, headers=headers)
    body = client.get("/expenses/summary", headers=headers).json()
    assert body["total"] == 850.0
    assert {"category": "food", "total": 350.0, "count": 2} in body["by_category"]


def test_other_users_expense_is_hidden(client: TestClient, headers: dict):
    client.post("/expenses", json={"title": "Private", "amount": 10}, headers=headers)
    client.post("/register", json={"email": "meera@example.com", "password": "anotherpass1"})
    tok = client.post("/token", data={"username": "meera@example.com", "password": "anotherpass1"}).json()
    other = {"Authorization": f"Bearer {tok['access_token']}"}
    assert client.get("/expenses/1", headers=other).status_code == 404


def test_validation_and_auth(client: TestClient, headers: dict):
    assert client.post("/expenses", json={"title": "x", "amount": 0}, headers=headers).status_code == 422
    assert client.get("/expenses").status_code == 401
    assert client.get("/expenses", headers={"Authorization": "Bearer not-a-token"}).status_code == 401


# Expected:
# $ uv run pytest -q
# .....                                                   [100%]
# 5 passed in 0.9s`
    },
    {
      heading: "18. Summary",
      content: `• **FastAPI** is a type-hint driven Python web framework built on Starlette (ASGI) and Pydantic v2; install \`fastapi[standard]\` with uv or pip and run with \`fastapi dev\` (development) or \`fastapi run\` / uvicorn (production).
• **Path parameters** come from braces in the route; other scalar parameters become **query parameters**; \`Annotated\` with \`Path()\`/\`Query()\` adds constraints that are validated before your code runs and documented automatically.
• **Request bodies** are Pydantic v2 models (\`Field\`, \`ConfigDict\`, \`field_validator\`, \`model_dump\`); keep separate Create, Update and Read schemas.
• **Response models** (return annotations) filter and validate output; use the \`status\` constants for success codes and raise \`HTTPException\` or custom exceptions with handlers for errors.
• **Depends** injects sessions, auth, pagination and settings; \`yield\` dependencies provide cleanup; \`dependency_overrides\` makes tests easy.
• Use \`async def\` only with non-blocking code; plain \`def\` runs in a threadpool and is correct for sync databases and libraries; \`BackgroundTasks\` for post-response work.
• Interactive **OpenAPI docs** live at \`/docs\` and \`/redoc\`; organise large apps with \`APIRouter\` and tags.
• **SQLModel** combines Pydantic and SQLAlchemy: one engine per process, one session per request, \`select()\` queries, tables created in \`lifespan\` (Alembic in production).
• **OAuth2 password flow + JWT** with PyJWT and pwdlib protects endpoints through a \`get_current_user\` dependency.
• **CORSMiddleware** with exact origins connects React/Next.js client code; Next.js Server Components and rewrites avoid CORS entirely.
• **TestClient** + pytest fixtures with an in-memory SQLite engine give fast, isolated tests; deploy with Docker and \`fastapi run --workers\` behind a reverse proxy, with configuration from pydantic-settings and environment variables.
**Next lecture:** Data Analysis with NumPy & pandas, Automation & Course Wrap-Up — loading and transforming real datasets, vectorised computation, automating reports, and where to go after this course.`
    }
  ]
};
