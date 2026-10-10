export const lecture12 = {
  slug: "lecture-12",
  number: 12,
  title: "Complete Python Course — Lecture 12: Asynchronous Python — asyncio & Concurrency",
  summary: "Master asynchronous Python: concurrency vs parallelism, the GIL and free-threaded builds, threading vs multiprocessing vs asyncio, async/await, the event loop, gather, TaskGroup, timeouts, async HTTP with httpx, concurrent.futures and choosing the right model for I/O-bound vs CPU-bound work.",
  readTime: "65 min read",
  difficulty: "Advanced",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. Introduction: What Asynchronous Python Is and Why Concurrency Matters in Real Projects",
      content: `Imagine a backend service at a Hyderabad fintech that must call three partner APIs — a KYC provider, a credit bureau and a bank — before approving a loan. Each call takes about 400 milliseconds. Written the ordinary way, the three calls run one after another and the user waits 1.2 seconds. Written **asynchronously**, all three calls are in flight at the same time and the user waits about 400 milliseconds. Nothing got faster; the program simply stopped sitting idle while the network did its work. That idea — **do not wait while you could be doing something else** — is the whole point of concurrency.
Python offers three ways to achieve it: **threads** (\`threading\`), **processes** (\`multiprocessing\`) and **coroutines** (\`asyncio\` with \`async\`/\`await\`). They look similar from a distance but solve different problems, and choosing the wrong one is the most common concurrency mistake in Python codebases. A developer who uses threads for a CPU-heavy image pipeline sees no speedup because of the **GIL**; a developer who puts a blocking \`time.sleep\` inside an \`async def\` freezes an entire FastAPI server; a developer who spawns a process per HTTP request runs out of memory.
This lecture builds the mental model first — concurrency vs parallelism, what the GIL actually guards, what changed with the **free-threaded builds** in Python 3.13 and 3.14 — and then goes deep into \`asyncio\`: the event loop, \`asyncio.run\`, tasks, \`gather\`, \`TaskGroup\`, timeouts, cancellation, async HTTP with \`httpx\`, and bridging to thread and process pools with \`concurrent.futures\`. By the end you will be able to look at any workload and say with confidence: "this is I/O-bound, use asyncio" or "this is CPU-bound, use processes", and write the code correctly.
At the time of writing, Python 3.14 is the current stable series and Python 3.15 is arriving in October 2026. Every example in this lecture runs on Python 3.11 and newer; features tied to a specific version are labelled.`,
      codeSnippet: `# sequential_vs_async.py — the problem concurrency solves
import asyncio
import time


async def call_partner(name: str, seconds: float) -> str:
    await asyncio.sleep(seconds)          # simulates network wait (non-blocking)
    return f"{name}: approved"


async def sequential() -> None:
    start = time.perf_counter()
    for name in ("KYC", "Credit Bureau", "Bank"):
        print(await call_partner(name, 0.4))
    print(f"sequential took {time.perf_counter() - start:.2f}s")


async def concurrent() -> None:
    start = time.perf_counter()
    results = await asyncio.gather(
        call_partner("KYC", 0.4),
        call_partner("Credit Bureau", 0.4),
        call_partner("Bank", 0.4),
    )
    print(*results, sep="\\n")
    print(f"concurrent took {time.perf_counter() - start:.2f}s")


asyncio.run(sequential())
asyncio.run(concurrent())

# Output:
# KYC: approved
# Credit Bureau: approved
# Bank: approved
# sequential took 1.20s
# KYC: approved
# Credit Bureau: approved
# Bank: approved
# concurrent took 0.40s`
    },
    {
      heading: "2. Concurrency vs Parallelism: The Difference Every Python Developer Must Know",
      content: `**Concurrency** means dealing with many tasks *in overlapping time periods*. **Parallelism** means literally executing many tasks *at the same instant* on different CPU cores. The classic analogy: one chef who keeps several dishes moving — stirring the dal while the rice boils — is concurrent. Four chefs each cooking one dish is parallel. The single chef is not doing two things at once; they are never idle while waiting, which is enough to finish dinner far sooner.
Why does this distinction matter so much in Python? Because the type of work decides which approach actually helps:
• **I/O-bound work** — waiting on the network, disk, a database or a subprocess. The CPU is idle most of the time. Here concurrency alone (one core, many waiting tasks) gives huge wins. Fetching 100 web pages that each take 300 ms drops from 30 seconds to under a second.
• **CPU-bound work** — hashing passwords, resizing images, running a pandas groupby over 50 million rows, training a model. The CPU is busy 100% of the time. Only true parallelism (more cores) helps; juggling tasks on a single core just adds overhead.
\`asyncio\` is a concurrency tool: a single thread, a single core, cooperatively switching between coroutines whenever one of them awaits. \`threading\` is also, in standard CPython, mostly a concurrency tool for Python code because of the GIL (next section), although C extensions and I/O release the GIL. \`multiprocessing\` and \`ProcessPoolExecutor\` give real parallelism by running separate interpreters on separate cores.
A useful measurement habit: run your function once, note the wall-clock time and the CPU time (\`time.process_time()\`). If CPU time is close to wall time, you are CPU-bound. If CPU time is tiny and wall time is large, you are I/O-bound and asyncio or threads will help.`,
      codeSnippet: `# classify_workload.py — measure before choosing a concurrency model
import hashlib
import time
import urllib.request


def cpu_bound() -> None:
    data = b"ravindra" * 1_000_000
    for _ in range(20):
        hashlib.sha256(data).hexdigest()      # pure computation


def io_bound() -> None:
    with urllib.request.urlopen("https://www.python.org", timeout=10) as r:
        r.read()                               # mostly waiting on the network


for fn in (cpu_bound, io_bound):
    wall0, cpu0 = time.perf_counter(), time.process_time()
    fn()
    wall, cpu = time.perf_counter() - wall0, time.process_time() - cpu0
    kind = "CPU-bound" if cpu / wall > 0.8 else "I/O-bound"
    print(f"{fn.__name__:10} wall={wall:.3f}s cpu={cpu:.3f}s -> {kind}")

# Typical output on a laptop:
# cpu_bound  wall=0.052s cpu=0.052s -> CPU-bound
# io_bound   wall=0.310s cpu=0.011s -> I/O-bound`
    },
    {
      heading: "3. The Python GIL Explained — and Free-Threaded Python in 3.13 and 3.14",
      content: `The **Global Interpreter Lock (GIL)** is a mutex inside CPython that allows only one thread to execute Python bytecode at a time. It exists because CPython's memory management uses reference counting, and updating reference counts from many threads simultaneously without a lock would corrupt memory. The GIL made the interpreter simple and single-threaded code fast, at the cost of making multi-threaded *CPU-bound* Python code no faster than single-threaded code — four threads hashing passwords on a four-core machine still take as long as one thread, because they take turns holding the lock.
Important nuance: the GIL is **released during blocking I/O** (socket reads, file reads, \`time.sleep\`) and by many C extensions (NumPy, hashlib on large inputs, zlib). That is why \`threading\` still works well for I/O-bound programs and some numeric code, and why the GIL is not a problem for the majority of web backends.
**Free-threaded Python (PEP 703):** Python 3.13 (October 2024) shipped an alternative build of CPython, often called \`python3.13t\`, compiled with \`--disable-gil\`. In 3.13 this build was explicitly labelled **experimental**. In Python 3.14 the Steering Council accepted **PEP 779** and the free-threaded build became **officially supported** — no longer experimental, but still **optional**: the default download is still the GIL build, you must install the free-threaded variant separately (for example via the python.org installer option, \`uv python install 3.14t\` or \`pyenv install 3.14t\`). Making free-threading the default (so-called Phase III) has not been decided as of the 3.14 and 3.15 cycles.
What this means in practice: on a free-threaded build, pure-Python threads do scale across cores for CPU-bound work. The cost is some single-threaded overhead (noticeable in 3.13, much reduced in 3.14) and the need for every C extension you use to declare free-threading support; packages that have not been updated cause the interpreter to re-enable the GIL at import time with a warning. You can check at runtime with \`sys._is_gil_enabled()\` (added in 3.13) and control the behaviour with the \`-X gil=0\` flag or the \`PYTHON_GIL=0\` environment variable on a free-threaded build.
Our advice for 2026: design for the standard build (asyncio for I/O, processes for CPU), treat free-threading as an opportunity to test on, and avoid relying on it in production until your entire dependency tree supports it.`,
      codeSnippet: `# gil_demo.py — threads do not speed up CPU-bound Python on the default build
import sys
import sysconfig
import threading
import time


def burn(n: int) -> None:
    total = 0
    for i in range(n):
        total += i * i


def run_threads(count: int, n: int) -> float:
    threads = [threading.Thread(target=burn, args=(n,)) for _ in range(count)]
    start = time.perf_counter()
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    return time.perf_counter() - start


free_threaded = bool(sysconfig.get_config_var("Py_GIL_DISABLED"))
gil_enabled = sys._is_gil_enabled() if hasattr(sys, "_is_gil_enabled") else True
print(f"Python {sys.version.split()[0]} free-threaded build: {free_threaded}, GIL active: {gil_enabled}")
print(f"1 thread  x 10M iterations: {run_threads(1, 10_000_000):.2f}s")
print(f"4 threads x 10M iterations: {run_threads(4, 10_000_000):.2f}s")

# Default (GIL) build on a 4-core laptop:
# Python 3.14.0 free-threaded build: False, GIL active: True
# 1 thread  x 10M iterations: 0.62s
# 4 threads x 10M iterations: 2.48s   <- no speedup: 4x the work, 4x the time
#
# Free-threaded build (python3.14t):
# Python 3.14.0 free-threaded build: True, GIL active: False
# 1 thread  x 10M iterations: 0.68s
# 4 threads x 10M iterations: 0.74s   <- real parallelism`
    },
    {
      heading: "4. Threading vs Multiprocessing vs asyncio: Three Python Concurrency Models Compared",
      content: `Python gives you three concurrency models, each with a different cost model and a different sweet spot.
• **threading** — multiple OS threads inside one process, sharing memory. Switching is **pre-emptive**: the OS (and the GIL's switch interval, 5 ms by default) decides when a thread is paused, so shared data needs \`threading.Lock\`. Threads are cheap-ish (roughly 8 MB of reserved stack each, a few hundred are fine), work with any blocking library, and are the right choice for I/O-bound code that uses libraries without async support (for example \`requests\`, old database drivers, \`boto3\`).
• **multiprocessing** — multiple OS processes, each with its own interpreter and its own GIL. True parallelism for CPU-bound code. Processes are expensive to start (tens to hundreds of milliseconds, more on Windows and on macOS where the default start method is \`spawn\`), and data passed between them is **pickled**, so sending a 2 GB DataFrame to a worker is slow. Best for batch computation: image processing, simulation, data crunching.
• **asyncio** — a single thread running an **event loop** that switches between coroutines **cooperatively**, only at \`await\` points. Tasks are extremely cheap (a few KB each; tens of thousands are routine), there is no lock contention because only one coroutine runs at a time, and you always know where a switch can happen. The price: every library in the call chain must be async-aware, and one blocking call freezes everything.
Think of it as a table. Memory per unit: thread ≈ MB, process ≈ tens of MB, task ≈ KB. Parallel CPU: threads no (unless free-threaded), processes yes, asyncio no. Shared state: threads yes (with locks), processes no (use queues or shared memory), asyncio yes (safe between awaits). Works with blocking libraries: threads yes, processes yes, asyncio no (wrap them, see section 10).
The example below runs the same I/O simulation with all three models so you can see the API differences side by side.`,
      codeSnippet: `# three_models.py — same job, three concurrency models
import asyncio
import time
from concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor

CITIES = ["Mumbai", "Delhi", "Bengaluru", "Chennai", "Kolkata", "Pune"]


def fetch_weather_blocking(city: str) -> str:
    time.sleep(0.5)                                  # blocking I/O stand-in
    return f"{city}: 31°C"


async def fetch_weather_async(city: str) -> str:
    await asyncio.sleep(0.5)                         # non-blocking I/O stand-in
    return f"{city}: 31°C"


def with_threads() -> list[str]:
    with ThreadPoolExecutor(max_workers=6) as pool:
        return list(pool.map(fetch_weather_blocking, CITIES))


def with_processes() -> list[str]:
    with ProcessPoolExecutor(max_workers=6) as pool:
        return list(pool.map(fetch_weather_blocking, CITIES))


async def with_asyncio() -> list[str]:
    return await asyncio.gather(*(fetch_weather_async(c) for c in CITIES))


if __name__ == "__main__":                           # required for processes on Windows/macOS
    for label, runner in (
        ("threads", with_threads),
        ("processes", with_processes),
        ("asyncio", lambda: asyncio.run(with_asyncio())),
    ):
        t0 = time.perf_counter()
        results = runner()
        print(f"{label:10} {len(results)} results in {time.perf_counter() - t0:.2f}s")

# threads     6 results in 0.50s
# processes   6 results in 0.71s   <- same waiting, plus process start-up cost
# asyncio     6 results in 0.50s`
    },
    {
      heading: "5. async/await Syntax: Coroutines, Awaitables and the Python Event Loop",
      content: `An \`async def\` function is a **coroutine function**. Calling it does not run it — it returns a **coroutine object**, a paused computation that the event loop can drive. This surprises beginners: \`fetch()\` by itself does nothing and Python prints a \`RuntimeWarning: coroutine 'fetch' was never awaited\`. The coroutine runs only when something **awaits** it or wraps it in a Task.
\`await expr\` does two things: it pauses the current coroutine until \`expr\` (an **awaitable**: a coroutine, a Task or a Future) completes, and it hands control back to the **event loop** so other coroutines can run in the meantime. That hand-off is the only place a switch can occur. Between two awaits, your code runs without interruption — which is why asyncio needs far fewer locks than threading.
The **event loop** is a scheduler: a \`while True\` loop that keeps a queue of ready callbacks, runs them one by one, and uses the operating system's I/O multiplexing (\`epoll\` on Linux, \`kqueue\` on macOS, IOCP on Windows) to learn which sockets became readable or writable. When a coroutine awaits a socket read, the loop registers interest in that socket, runs other work, and resumes the coroutine when data arrives. You rarely touch the loop directly; \`asyncio.run()\` creates it, runs your main coroutine, and closes it.
Three related constructs complete the syntax: \`async with\` for asynchronous context managers (\`httpx.AsyncClient\`, database connections), \`async for\` for asynchronous iterators (streaming responses, async generators defined with \`yield\` inside \`async def\`), and **async comprehensions** such as \`[x async for x in agen()]\`.
Mental model to remember: \`await\` is a *yield point*. If a function never awaits, it never yields, and it blocks the loop no matter how it is declared.`,
      codeSnippet: `# coroutines_basics.py
import asyncio


async def brew(item: str, seconds: float) -> str:
    print(f"start {item}")
    await asyncio.sleep(seconds)          # yield point: loop runs other coroutines here
    print(f"done  {item}")
    return item


async def ticket_stream(n: int):          # async generator
    for i in range(1, n + 1):
        await asyncio.sleep(0.1)
        yield f"TKT-{i:03d}"


class Counter:                             # async context manager
    async def __aenter__(self):
        print("open resource")
        return self

    async def __aexit__(self, exc_type, exc, tb):
        print("close resource")


async def main() -> None:
    coro = brew("chai", 0.3)
    print(type(coro).__name__)            # 'coroutine' — nothing has run yet
    print(await coro)                      # now it runs to completion

    async with Counter():
        tickets = [t async for t in ticket_stream(3)]
        print(tickets)


asyncio.run(main())

# coroutine
# start chai
# done  chai
# chai
# open resource
# ['TKT-001', 'TKT-002', 'TKT-003']
# close resource`
    },
    {
      heading: "6. asyncio.run, Tasks and Scheduling Work on the Event Loop",
      content: `\`asyncio.run(coro)\` (Python 3.7+) is the standard entry point. It creates a fresh event loop, runs the coroutine until it returns, cancels any leftover tasks, shuts down async generators and the default executor, and closes the loop. Call it exactly once per program, from synchronous code, and never from inside a running coroutine (that raises \`RuntimeError: asyncio.run() cannot be called from a running event loop\` — the classic Jupyter error; notebooks already run a loop, so there you simply \`await main()\`). Python 3.11 added \`asyncio.Runner\`, a context manager that lets you run several coroutines on the same loop from sync code, which is handy in test harnesses.
Awaiting a coroutine runs it *inline* — the caller waits. To run something **in the background** while you continue, wrap it in a **Task** with \`asyncio.create_task(coro, name="...")\`. A Task is a Future subclass that schedules the coroutine on the loop immediately and lets you await its result later, cancel it, or add a done-callback. Always keep a reference to tasks you create (store them in a list or set); the loop holds only a weak reference, and a task that nobody references can be garbage-collected mid-flight.
Useful introspection: \`asyncio.current_task()\`, \`asyncio.all_tasks()\`, \`task.get_name()\`, \`task.done()\`, \`task.cancelled()\`. Python 3.12 added \`asyncio.eager_task_factory\`, which starts a task synchronously up to its first await and can cut overhead for tasks that often finish without suspending. Python 3.14 added command-line tools, \`python -m asyncio ps <PID>\` and \`python -m asyncio pstree <PID>\`, that print the live task tree of another running process — enormously helpful when a production server appears to hang.
Keep the entry point tidy: one \`async def main()\`, one \`asyncio.run(main())\` inside \`if __name__ == "__main__":\`.`,
      codeSnippet: `# tasks_basics.py
import asyncio


async def send_otp(phone: str) -> str:
    await asyncio.sleep(0.5)
    return f"OTP sent to {phone}"


async def write_audit_log(event: str) -> None:
    await asyncio.sleep(0.2)
    print(f"audit: {event}")


async def main() -> None:
    # Schedule in the background immediately; keep references!
    tasks = [
        asyncio.create_task(send_otp("+91-98xxxxxx01"), name="otp-1"),
        asyncio.create_task(send_otp("+91-98xxxxxx02"), name="otp-2"),
    ]
    log_task = asyncio.create_task(write_audit_log("otp-batch-started"))

    print("tasks scheduled:", [t.get_name() for t in asyncio.all_tasks() if t is not asyncio.current_task()])

    await log_task                  # finishes first (0.2s)
    for t in tasks:                 # both OTPs complete at ~0.5s, not 1.0s
        print(await t)
    print("all done:", all(t.done() for t in tasks))


if __name__ == "__main__":
    asyncio.run(main())

# tasks scheduled: ['otp-1', 'otp-2', 'Task-4']
# audit: otp-batch-started
# OTP sent to +91-98xxxxxx01
# OTP sent to +91-98xxxxxx02
# all done: True`
    },
    {
      heading: "7. Running Coroutines Concurrently: asyncio.gather vs asyncio.TaskGroup",
      content: `Two APIs run several coroutines at once and collect their results. They differ in how they handle **failure**, which is exactly what matters in production.
**\`asyncio.gather(*aws, return_exceptions=False)\`** schedules every awaitable as a task and returns a list of results **in the same order** as the inputs. If one raises, \`gather\` propagates that first exception immediately — but the **other tasks keep running** in the background, unobserved. You often do not want that: a failed payment check should cancel the fraud check running alongside it. With \`return_exceptions=True\`, exceptions are returned in the result list instead of raised, so you can process partial success — useful for "fetch 50 product pages and report which ones failed".
**\`asyncio.TaskGroup\`** (Python 3.11+) is the modern, structured alternative. You open it with \`async with asyncio.TaskGroup() as tg:\`, create tasks with \`tg.create_task(coro)\`, and when the block exits it waits for all of them. If any task fails, the group **cancels all remaining tasks**, waits for them to finish cancelling, and then raises an \`ExceptionGroup\` containing every exception that occurred. You handle it with the \`except*\` syntax (also 3.11+). This is **structured concurrency**: tasks cannot outlive the block that created them, so nothing leaks and nothing runs unobserved.
Rule of thumb: use \`TaskGroup\` as the default for new code. Use \`gather(..., return_exceptions=True)\` when you deliberately want *every* task to run to completion regardless of failures and then inspect results. For the "first to finish wins" pattern, look at \`asyncio.wait(..., return_when=FIRST_COMPLETED)\` or \`asyncio.as_completed()\`, which yields results as they arrive rather than in input order.
The example shows the behavioural difference with one task that fails.`,
      codeSnippet: `# gather_vs_taskgroup.py  (Python 3.11+)
import asyncio


async def check(name: str, delay: float, fail: bool = False) -> str:
    try:
        await asyncio.sleep(delay)
        if fail:
            raise ValueError(f"{name} service returned 500")
        return f"{name} ok"
    except asyncio.CancelledError:
        print(f"  {name} was cancelled")
        raise                                   # always re-raise CancelledError


async def with_gather() -> None:
    print("gather with return_exceptions=True:")
    results = await asyncio.gather(
        check("kyc", 0.2),
        check("bureau", 0.1, fail=True),
        check("bank", 0.3),
        return_exceptions=True,
    )
    for r in results:
        print("  ", repr(r))


async def with_taskgroup() -> None:
    print("TaskGroup:")
    try:
        async with asyncio.TaskGroup() as tg:
            tg.create_task(check("kyc", 0.2))
            tg.create_task(check("bureau", 0.1, fail=True))
            tg.create_task(check("bank", 0.3))
    except* ValueError as eg:                   # ExceptionGroup handling
        for exc in eg.exceptions:
            print("  failed:", exc)


asyncio.run(with_gather())
asyncio.run(with_taskgroup())

# gather with return_exceptions=True:
#    'kyc ok'
#    ValueError('bureau service returned 500')
#    'bank ok'
# TaskGroup:
#   kyc was cancelled
#   bank was cancelled
#   failed: bureau service returned 500`
    },
    {
      heading: "8. Timeouts and Cancellation in asyncio: asyncio.timeout, wait_for and CancelledError",
      content: `A network call that never returns is worse than one that fails fast, because it silently holds a worker, a database connection and a user's patience. Every external await in production code should have a **timeout**.
**\`asyncio.timeout(seconds)\`** (Python 3.11+) is the preferred tool: an async context manager that cancels whatever is running inside the block when the deadline passes and converts the resulting \`CancelledError\` into a \`TimeoutError\` (since 3.11 \`asyncio.TimeoutError\` is an alias of the built-in \`TimeoutError\`). It can wrap several awaits at once, you can reschedule it with \`.reschedule()\`, and there is a sibling \`asyncio.timeout_at(deadline)\` for absolute deadlines. The older **\`asyncio.wait_for(aw, timeout)\`** still works and is fine for a single awaitable, but the context-manager form composes better.
**Cancellation** is how timeouts, \`TaskGroup\` failures and Ctrl+C are all implemented. Calling \`task.cancel()\` arranges for \`asyncio.CancelledError\` to be raised *inside* the task at its next \`await\`. The task then unwinds: \`finally\` blocks run, \`async with\` exits, and the exception propagates out. Three rules keep you safe:
1. Never swallow \`CancelledError\`. If you catch it to clean up, **re-raise** it. A bare \`except Exception\` does not catch it (since 3.8 it derives from \`BaseException\`), which is deliberate.
2. Do cleanup in \`finally\` — closing files, releasing locks, rolling back transactions.
3. If cleanup itself needs to await (for example sending a "goodbye" message), wrap it in \`asyncio.shield()\` or a fresh \`asyncio.timeout()\`; otherwise a second cancel could interrupt your cleanup.
\`asyncio.shield(aw)\` protects an inner awaitable from cancellation of the outer task — use it sparingly, for writes that must complete once started (a payment capture, an audit record).`,
      codeSnippet: `# timeouts_and_cancellation.py  (Python 3.11+)
import asyncio


async def slow_upi_call(seconds: float) -> str:
    try:
        await asyncio.sleep(seconds)
        return "UPI: SUCCESS"
    finally:
        print("  connection released")            # runs even when cancelled


async def main() -> None:
    # 1. Timeout around a single call
    try:
        async with asyncio.timeout(1.0):
            print(await slow_upi_call(3.0))
    except TimeoutError:
        print("UPI call timed out after 1s -> show retry button")

    # 2. Fast path still works
    async with asyncio.timeout(1.0):
        print(await slow_upi_call(0.2))

    # 3. Manual cancellation of a background task
    task = asyncio.create_task(slow_upi_call(5.0))
    await asyncio.sleep(0.1)
    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        print("background task cancelled:", task.cancelled())

    # 4. Shield a write that must not be interrupted
    critical = asyncio.create_task(asyncio.shield(slow_upi_call(0.3)))
    await asyncio.sleep(0.05)
    critical.cancel()                              # cancels the outer wrapper only
    await asyncio.sleep(0.4)                       # inner call still completes
    print("shielded inner call finished")


asyncio.run(main())

#   connection released
# UPI call timed out after 1s -> show retry button
#   connection released
# UPI: SUCCESS
#   connection released
# background task cancelled: True
#   connection released
# shielded inner call finished`
    },
    {
      heading: "9. Async HTTP Requests in Python with httpx.AsyncClient (and Rate Limiting with Semaphore)",
      content: `The most common reason to reach for asyncio is talking to HTTP APIs. The \`requests\` library is blocking and must not be awaited; the modern choice is **httpx**, which offers a \`requests\`-like API with both sync and async clients, HTTP/2 support and proper timeouts. Install it with \`uv add httpx\` or \`pip install httpx\`.
The pattern is always: create **one** \`httpx.AsyncClient\` per application (or per batch), reuse it for every request, and close it with \`async with\`. The client holds a **connection pool**, so reusing it avoids a new TCP and TLS handshake for every call — on a Mumbai-to-Singapore route that handshake alone is 100–150 ms. Creating a client per request is the number one httpx performance mistake.
Key client options: \`base_url\` (so you call \`client.get("/users")\`), \`timeout=httpx.Timeout(10.0, connect=3.0)\` (always set one; the default is 5 seconds), \`headers\` for auth tokens, \`limits=httpx.Limits(max_connections=50)\`, and \`transport\` for retries or mocking. Call \`response.raise_for_status()\` to turn 4xx/5xx into exceptions, then \`response.json()\`.
**Rate limiting with asyncio.Semaphore.** Firing 5,000 requests at once will get you throttled or banned. An \`asyncio.Semaphore(20)\` allows at most 20 coroutines inside its \`async with\` block at a time; the rest wait at the gate. Combine it with a \`TaskGroup\` and a timeout and you have a production-grade fetcher in twenty lines. For strict requests-per-second limits, add a small \`await asyncio.sleep()\` after acquiring the semaphore or use a token-bucket library such as \`aiolimiter\`.
The example fetches the first page of several public GitHub repositories concurrently, capped at 5 in flight, with a per-request timeout and error isolation so one failure does not sink the batch.`,
      codeSnippet: `# async_http_httpx.py  — pip install httpx  (or: uv add httpx)
import asyncio
import time

import httpx

REPOS = ["python/cpython", "encode/httpx", "fastapi/fastapi",
         "pydantic/pydantic", "pandas-dev/pandas", "astral-sh/uv", "does-not/exist-xyz"]


async def fetch_stars(client: httpx.AsyncClient, sem: asyncio.Semaphore, repo: str) -> tuple[str, int | str]:
    async with sem:                                   # at most 5 requests in flight
        try:
            async with asyncio.timeout(8):
                r = await client.get(f"/repos/{repo}")
                r.raise_for_status()
                return repo, r.json()["stargazers_count"]
        except httpx.HTTPStatusError as e:
            return repo, f"HTTP {e.response.status_code}"
        except (httpx.TransportError, TimeoutError) as e:
            return repo, f"error: {type(e).__name__}"


async def main() -> None:
    sem = asyncio.Semaphore(5)
    timeout = httpx.Timeout(10.0, connect=3.0)
    headers = {"Accept": "application/vnd.github+json", "User-Agent": "async-lecture-demo"}

    start = time.perf_counter()
    async with httpx.AsyncClient(base_url="https://api.github.com", timeout=timeout, headers=headers) as client:
        results = await asyncio.gather(*(fetch_stars(client, sem, r) for r in REPOS))

    for repo, stars in sorted(results, key=lambda x: (isinstance(x[1], str), x)):
        print(f"{repo:22} {stars}")
    print(f"{len(REPOS)} requests in {time.perf_counter() - start:.2f}s")


if __name__ == "__main__":
    asyncio.run(main())

# astral-sh/uv           71234
# encode/httpx           14561
# ...
# does-not/exist-xyz     HTTP 404
# 7 requests in 0.61s     <- sequential would take ~3s`
    },
    {
      heading: "10. Mixing Blocking Code into asyncio: asyncio.to_thread and run_in_executor",
      content: `Real projects are never 100% async. You will have a legacy \`requests\` call, a synchronous ORM query, a \`boto3\` upload, a PDF generator, or a CPU-heavy transform — and all of them **block the event loop** if called directly inside a coroutine. Blocking the loop for even 200 ms means every other request on your FastAPI server stalls for 200 ms. In a server handling 500 requests per second, one blocked second is 500 angry users.
The fix is to push blocking work to another thread or process and await its completion:
• **\`asyncio.to_thread(func, *args, **kwargs)\`** (Python 3.9+) runs \`func\` in the loop's default \`ThreadPoolExecutor\` and returns an awaitable. This is the right tool for **blocking I/O** (network, disk, sync database drivers) because the GIL is released while those wait. It is the simplest and should be your default.
• **\`loop.run_in_executor(executor, func, *args)\`** is the lower-level form. Pass \`None\` for the default thread pool or your own executor. Crucially, you can pass a **\`ProcessPoolExecutor\`**, which is how you run **CPU-bound** work (image resizing, report generation, ML inference) without blocking the loop *and* without the GIL limiting you. Note that it takes positional args only — use \`functools.partial\` for keyword arguments.
The reverse bridge also exists: from a thread that is *not* running the loop, schedule a coroutine onto the loop with \`asyncio.run_coroutine_threadsafe(coro, loop)\`, and call plain functions on the loop with \`loop.call_soon_threadsafe()\`. All other asyncio objects (\`Queue\`, \`Event\`, \`Future\`) are **not thread-safe** and must only be touched from the loop's thread.
How do you find hidden blocking calls? Run with \`PYTHONASYNCIODEBUG=1\` or \`asyncio.run(main(), debug=True)\`: asyncio then logs every callback that takes longer than 100 ms (\`loop.slow_callback_duration\`).`,
      codeSnippet: `# bridging_blocking_code.py
import asyncio
import functools
import hashlib
import time
from concurrent.futures import ProcessPoolExecutor


def legacy_sync_fetch(city: str) -> str:        # imagine: requests.get(...)
    time.sleep(0.5)                              # blocking I/O
    return f"{city}: fetched"


def hash_passwords(count: int, rounds: int = 200_000) -> int:   # CPU-bound
    for i in range(count):
        hashlib.pbkdf2_hmac("sha256", f"pw{i}".encode(), b"salt", rounds)
    return count


async def heartbeat() -> None:
    for _ in range(6):
        print("  loop alive")
        await asyncio.sleep(0.25)


async def main() -> None:
    loop = asyncio.get_running_loop()
    hb = asyncio.create_task(heartbeat())        # proves the loop is not blocked

    # Blocking I/O -> thread
    cities = await asyncio.gather(
        asyncio.to_thread(legacy_sync_fetch, "Jaipur"),
        asyncio.to_thread(legacy_sync_fetch, "Lucknow"),
    )
    print(cities)

    # CPU-bound -> process pool (bypasses the GIL)
    with ProcessPoolExecutor() as pool:
        job = functools.partial(hash_passwords, 4, rounds=100_000)
        done = await loop.run_in_executor(pool, job)
    print(f"hashed {done} passwords in a worker process")

    await hb


if __name__ == "__main__":
    asyncio.run(main(), debug=True)              # logs any callback > 100 ms

#   loop alive
#   loop alive
# ['Jaipur: fetched', 'Lucknow: fetched']
#   loop alive
#   ...
# hashed 4 passwords in a worker process`
    },
    {
      heading: "11. concurrent.futures: ThreadPoolExecutor, ProcessPoolExecutor and InterpreterPoolExecutor",
      content: `\`concurrent.futures\` is the high-level, synchronous-world API for running callables in a pool of workers. It is what you use when your program is *not* built on asyncio — a CLI tool, a Django view, a data script — but still needs concurrency. All executors share one interface: \`submit(fn, *args)\` returns a **Future**, \`map(fn, iterable)\` returns results in order, and \`with Executor() as pool:\` waits for everything on exit (\`shutdown(wait=True)\`).
• **\`ThreadPoolExecutor(max_workers=None)\`** — threads; default worker count is \`min(32, os.cpu_count() + 4)\`. Use for I/O-bound tasks with blocking libraries.
• **\`ProcessPoolExecutor(max_workers=None)\`** — processes; default is \`os.cpu_count()\`. Use for CPU-bound tasks. The callable and its arguments must be **picklable** (top-level functions, not lambdas or closures), and your script needs the \`if __name__ == "__main__":\` guard because child processes re-import the main module under the \`spawn\` start method (default on Windows and macOS, and the default on Linux as well from Python 3.14).
• **\`InterpreterPoolExecutor\`** (new in **Python 3.14**, PEP 734) — runs callables in a pool of **subinterpreters**, each with its own GIL, inside one process. It gives CPU parallelism like processes but with cheaper start-up and no OS process overhead. Objects crossing the boundary are still copied (pickled), and C extensions must support multiple interpreters, so treat it as a promising middle ground to experiment with rather than a drop-in replacement today.
**Working with Futures.** \`future.result(timeout=...)\` blocks until done; \`future.exception()\` returns the raised exception; \`as_completed(futures)\` yields futures as they finish, perfect for progress bars; \`wait(futures, return_when=FIRST_EXCEPTION)\` offers finer control. Python 3.14 also added a \`buffersize\` parameter to \`Executor.map()\` so a huge input iterable is consumed lazily instead of being submitted all at once.
A practical sizing note: for I/O-bound thread pools, 10–50 workers is typical; for CPU-bound process pools, never exceed the number of physical cores.`,
      codeSnippet: `# futures_demo.py
import hashlib
import os
import time
from concurrent.futures import (ProcessPoolExecutor, ThreadPoolExecutor,
                                as_completed)


def download(file_id: int) -> str:                    # I/O-bound stand-in
    time.sleep(0.4)
    return f"file-{file_id}.pdf"


def checksum(file_id: int) -> tuple[int, str]:        # CPU-bound (must be top-level for pickling)
    data = bytes([file_id % 256]) * 20_000_000
    return file_id, hashlib.sha256(data).hexdigest()[:12]


if __name__ == "__main__":
    print("cores:", os.cpu_count())

    t0 = time.perf_counter()
    with ThreadPoolExecutor(max_workers=8) as pool:
        futures = {pool.submit(download, i): i for i in range(8)}
        for fut in as_completed(futures):             # results as they finish
            print("downloaded", fut.result())
    print(f"8 downloads via threads: {time.perf_counter() - t0:.2f}s")

    t0 = time.perf_counter()
    with ProcessPoolExecutor() as pool:
        for file_id, digest in pool.map(checksum, range(8)):
            print(f"file-{file_id} sha256={digest}")
    print(f"8 checksums via processes: {time.perf_counter() - t0:.2f}s")

    # Python 3.14+: subinterpreters, one GIL each, inside a single process
    try:
        from concurrent.futures import InterpreterPoolExecutor
        with InterpreterPoolExecutor() as pool:
            print("interpreters:", list(pool.map(checksum, range(2)))[:1])
    except ImportError:
        print("InterpreterPoolExecutor needs Python 3.14+")

# cores: 8
# downloaded file-3.pdf ... (8 lines, order varies)
# 8 downloads via threads: 0.41s
# file-0 sha256=... (8 lines)
# 8 checksums via processes: 0.33s   (vs ~1.4s sequential)`
    },
    {
      heading: "12. Choosing the Right Concurrency Model for I/O-Bound vs CPU-Bound Work",
      content: `Here is the decision procedure experienced Python engineers apply, in order:
1. **Is it CPU-bound?** (CPU time ≈ wall time.) Use \`ProcessPoolExecutor\` or \`multiprocessing\`. Consider NumPy/pandas vectorisation first — a vectorised operation is often 50× faster than any parallel pure-Python loop, and many NumPy operations release the GIL so plain threads also help. On a free-threaded 3.14 build with compatible dependencies, threads become an option; \`InterpreterPoolExecutor\` is worth benchmarking.
2. **Is it I/O-bound and are async libraries available** for everything in the hot path (httpx, asyncpg, aiosqlite, aiofiles, aiokafka, motor, redis.asyncio)? Use \`asyncio\`. It scales to tens of thousands of concurrent connections with minimal memory, and frameworks like FastAPI, Starlette, aiohttp and Litestar are built on it.
3. **Is it I/O-bound but stuck with blocking libraries** (\`requests\`, \`psycopg2\` sync mode, \`boto3\`, legacy SDKs)? Use \`ThreadPoolExecutor\`, or asyncio with \`asyncio.to_thread\` if the rest of the app is async. Threads are also the pragmatic choice for small scripts where asyncio's "everything must be async" requirement is more trouble than it is worth.
4. **Mixed workload** (an API that fetches data, then crunches it)? asyncio for the I/O, with CPU parts offloaded through \`run_in_executor(ProcessPoolExecutor)\`. This is the standard architecture for ML inference services.
5. **Do you need concurrency at all?** Ten sequential database queries of 2 ms each cost 20 ms. Adding asyncio complexity to save 18 ms is not worth it. Measure first.
Two more factors: **debuggability** (sequential code is easiest, asyncio next because switches are explicit, threads hardest because of races) and **deployment** (process pools multiply memory usage; a 500 MB model loaded in 8 workers needs 4 GB — look at shared memory or a single worker with async batching).
The snippet below is a tiny self-check you can paste into any project to classify a function and suggest a model.`,
      codeSnippet: `# choose_model.py — tiny profiler that recommends a concurrency model
import time
from collections.abc import Callable


def recommend(fn: Callable[[], object], *, async_libs_available: bool = True) -> str:
    wall0, cpu0 = time.perf_counter(), time.process_time()
    fn()
    wall = time.perf_counter() - wall0
    cpu = time.process_time() - cpu0
    cpu_share = cpu / wall if wall else 1.0

    if wall < 0.01:
        return f"{fn.__name__}: {wall*1000:.1f} ms -> too fast to bother, keep it sequential"
    if cpu_share > 0.8:
        return (f"{fn.__name__}: CPU-bound ({cpu_share:.0%} CPU) -> ProcessPoolExecutor "
                "(or vectorise with NumPy/pandas)")
    if async_libs_available:
        return f"{fn.__name__}: I/O-bound ({cpu_share:.0%} CPU) -> asyncio + httpx/asyncpg"
    return f"{fn.__name__}: I/O-bound ({cpu_share:.0%} CPU) -> ThreadPoolExecutor / asyncio.to_thread"


def parse_csv_rows() -> None:
    sum(int(x) for x in ("42," * 300_000).split(",") if x)


def wait_for_db() -> None:
    time.sleep(0.3)


print(recommend(parse_csv_rows))
print(recommend(wait_for_db))
print(recommend(wait_for_db, async_libs_available=False))

# parse_csv_rows: CPU-bound (99% CPU) -> ProcessPoolExecutor (or vectorise with NumPy/pandas)
# wait_for_db: I/O-bound (0% CPU) -> asyncio + httpx/asyncpg
# wait_for_db: I/O-bound (0% CPU) -> ThreadPoolExecutor / asyncio.to_thread`
    },
    {
      heading: "13. Real-World Use Cases: How Async Python and Concurrency Are Used in Production",
      content: `**1. FastAPI and ASGI web services.** FastAPI runs on an asyncio event loop (via Uvicorn). An \`async def\` endpoint that awaits \`httpx\`, \`asyncpg\` or \`redis.asyncio\` can serve thousands of concurrent requests on one worker. FastAPI runs plain \`def\` endpoints in a thread pool automatically — so a sync endpoint is safe, but an \`async def\` endpoint that calls \`requests.get\` blocks the whole server. This single rule explains most "FastAPI is slow" complaints.
**2. Aggregator and BFF (backend-for-frontend) services.** A travel app's search page calls flight, hotel and cab providers. With \`TaskGroup\` and per-provider timeouts, the page returns in the time of the slowest provider (capped at, say, 2 seconds), not the sum of all of them, and a failing provider is reported as "unavailable" rather than breaking the page.
**3. Web scraping and bulk API ingestion.** Pulling 200,000 product listings or GST invoices from an API with a semaphore of 20–50 concurrent requests, retries with exponential backoff and a rate limiter. Async turns a 6-hour sequential job into 15 minutes without extra machines.
**4. Data pipelines and ETL.** Extract concurrently with asyncio or threads, transform with pandas in a \`ProcessPoolExecutor\` (one process per CSV partition), load with async database drivers. Airflow and Prefect tasks commonly use exactly this split.
**5. Chatbots, WebSockets and streaming LLM responses.** \`async for chunk in stream:\` over a WebSocket or SSE connection, where one process holds 10,000 open sockets — impossible with a thread per connection.
**6. Background workers and queues.** An \`asyncio.Queue\` with N consumer tasks implements a producer–consumer pipeline (notification sending, webhook delivery). Python 3.13 added \`Queue.shutdown()\` and \`QueueShutDown\` for clean termination of consumers.
**7. Test suites.** \`pytest-asyncio\` or \`anyio\` run async tests; \`httpx.ASGITransport\` lets you test a FastAPI app in-process with no network at all.
The example sketches a FastAPI aggregator endpoint with timeouts and graceful degradation — the pattern behind many real search pages.`,
      codeSnippet: `# app/main.py — FastAPI aggregator with TaskGroup, timeouts and graceful degradation
# uv add fastapi httpx uvicorn   |   run: uvicorn app.main:app --reload
import asyncio
from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI

PROVIDERS = {
    "flights": "https://flights.example.com/search",
    "hotels": "https://hotels.example.com/search",
    "cabs": "https://cabs.example.com/search",
}


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.http = httpx.AsyncClient(timeout=httpx.Timeout(5.0, connect=2.0))   # one shared client
    yield
    await app.state.http.aclose()


app = FastAPI(lifespan=lifespan)


async def query_provider(client: httpx.AsyncClient, name: str, city: str) -> tuple[str, dict]:
    try:
        async with asyncio.timeout(2.0):                      # per-provider budget
            r = await client.get(PROVIDERS[name], params={"city": city})
            r.raise_for_status()
            return name, {"status": "ok", "data": r.json()}
    except (TimeoutError, httpx.HTTPError) as e:
        return name, {"status": "unavailable", "reason": type(e).__name__}


@app.get("/search")
async def search(city: str = "Goa") -> dict:
    client: httpx.AsyncClient = app.state.http
    tasks = []
    async with asyncio.TaskGroup() as tg:
        for name in PROVIDERS:
            tasks.append(tg.create_task(query_provider(client, name, city)))
    return {"city": city, "results": dict(t.result() for t in tasks)}

# GET /search?city=Goa  ->  responds in ~max(provider latency), never more than ~2s:
# {"city": "Goa", "results": {"flights": {"status": "ok", ...},
#                             "hotels": {"status": "unavailable", "reason": "TimeoutError"},
#                             "cabs": {"status": "ok", ...}}}`
    },
    {
      heading: "14. Common Mistakes with asyncio and Python Concurrency and How to Fix Them",
      content: `**1. Blocking the event loop.** Calling \`time.sleep\`, \`requests.get\`, a sync DB driver, or a heavy loop inside \`async def\`. Symptom: everything else stalls; with debug mode on, asyncio logs "Executing <Task> took 2.3 seconds". Fix: use the async equivalent (\`asyncio.sleep\`, \`httpx\`), or offload with \`asyncio.to_thread\` / \`run_in_executor\`.
**2. Forgetting to await.** \`fetch_user()\` instead of \`await fetch_user()\` returns a coroutine object that never runs, and you get \`RuntimeWarning: coroutine was never awaited\`. Type checkers (mypy, pyright) flag this; enable them.
**3. Awaiting sequentially when you meant concurrently.** \`a = await f(); b = await g()\` runs f then g. Fix: \`a, b = await asyncio.gather(f(), g())\` or a \`TaskGroup\`.
**4. Creating a task and dropping the reference.** \`asyncio.create_task(job())\` with no variable can be garbage-collected mid-run. Fix: keep tasks in a set and discard on completion, or use a \`TaskGroup\`.
**5. Swallowing CancelledError.** \`except Exception\` does not catch it, but \`except BaseException\` and bare \`except:\` do — and then timeouts and shutdown silently break. Fix: re-raise, and clean up in \`finally\`.
**6. One httpx client per request.** Loses connection pooling and may exhaust sockets (\`TIME_WAIT\` pile-up). Fix: one client per app, created in the lifespan / startup hook.
**7. Unbounded concurrency.** \`gather(*[fetch(u) for u in 50_000_urls])\` opens 50,000 connections and gets you rate-limited or OOM-killed. Fix: \`asyncio.Semaphore\`, a bounded \`asyncio.Queue\`, or batch the input.
**8. Using threads for CPU-bound work on the default build.** No speedup because of the GIL. Fix: \`ProcessPoolExecutor\`, vectorisation, or a free-threaded build after verifying your dependencies.
**9. Missing the \`if __name__ == "__main__":\` guard with processes.** Under \`spawn\`, children re-import the main module and start their own pools — a fork bomb on Windows/macOS, and on Linux since 3.14. Fix: always guard the entry point.
**10. Sharing asyncio objects across threads.** \`asyncio.Queue\`, \`Event\` and \`Future\` are not thread-safe. Fix: \`loop.call_soon_threadsafe\` or \`asyncio.run_coroutine_threadsafe\` from the other thread, or use \`queue.Queue\` with \`to_thread\`.
**11. Calling \`asyncio.run()\` inside a running loop.** Common in Jupyter and inside frameworks. Fix: just \`await\` the coroutine; in sync-only libraries, accept a loop or use \`asyncio.Runner\`.
**12. No timeouts anywhere.** A hung upstream holds every worker forever. Fix: \`asyncio.timeout()\` around every external await and \`httpx.Timeout\` on the client.`,
      codeSnippet: `# mistakes_fixed.py — before/after for the three most frequent bugs
import asyncio
import time


# 1. Blocking the loop ---------------------------------------------------
async def bad_sleep() -> None:
    time.sleep(1)                 # WRONG: freezes every other coroutine


async def good_sleep() -> None:
    await asyncio.sleep(1)        # RIGHT: yields to the loop


# 2. Fire-and-forget task that may be garbage-collected -----------------
background: set[asyncio.Task] = set()


def fire_and_forget(coro) -> None:
    task = asyncio.create_task(coro)
    background.add(task)                   # keep a strong reference
    task.add_done_callback(background.discard)


# 3. Unbounded concurrency ------------------------------------------------
async def fetch(i: int, sem: asyncio.Semaphore) -> int:
    async with sem:                        # cap in-flight work
        await asyncio.sleep(0.05)
        return i


async def main() -> None:
    fire_and_forget(good_sleep())
    sem = asyncio.Semaphore(100)
    async with asyncio.TaskGroup() as tg:
        tasks = [tg.create_task(fetch(i, sem)) for i in range(2_000)]
    print("fetched:", sum(t.result() for t in tasks))     # 1999000
    await asyncio.gather(*background)                      # let the background task finish


asyncio.run(main())`
    },
    {
      heading: "15. Frequently Asked Questions about asyncio, the GIL and Python Concurrency",
      content: `**What is the difference between concurrency and parallelism in Python?**
Concurrency is managing many tasks in overlapping time on possibly one core — asyncio and (on the default build) threads do this. Parallelism is executing tasks at the same instant on multiple cores — multiprocessing, \`ProcessPoolExecutor\`, and threads on a free-threaded build do this. Concurrency speeds up I/O-bound work; parallelism speeds up CPU-bound work.
**Is the GIL removed in Python 3.13 or 3.14?**
Not from the default build. Python 3.13 introduced an optional, experimental free-threaded build without the GIL (PEP 703). Python 3.14 promoted that build to officially supported (PEP 779) but it remains a separate download, and the standard \`python\` you install still has the GIL. Whether free-threading ever becomes the default is undecided.
**When should I use asyncio instead of threads in Python?**
Use asyncio when the work is I/O-bound, you need many concurrent connections (hundreds to tens of thousands), and async libraries exist for your dependencies — typical for web services, scrapers and API clients. Use threads when the work is I/O-bound but your libraries are blocking, or for small scripts where asyncio adds more ceremony than value.
**Does asyncio make my code faster?**
Only when the code spends time waiting. Asyncio removes idle time; it does not add CPU. A CPU-bound loop inside asyncio is exactly as slow as outside it, and actually blocks every other task while it runs.
**What is the difference between asyncio.gather and asyncio.TaskGroup?**
\`gather\` returns results in input order and, on failure, raises the first exception while leaving the other tasks running (unless you pass \`return_exceptions=True\`). \`TaskGroup\` (3.11+) cancels all sibling tasks on the first failure and raises an \`ExceptionGroup\` — structured concurrency with no leaked tasks. Prefer \`TaskGroup\` for new code.
**Can I use the requests library with asyncio?**
Not directly — \`requests\` is blocking and would freeze the event loop. Either switch to \`httpx.AsyncClient\` (near-identical API) or wrap the call with \`await asyncio.to_thread(requests.get, url)\`.
**How many threads or processes should I use in Python?**
For I/O-bound thread pools, 10–50 workers is a sensible range; the default \`ThreadPoolExecutor\` size is \`min(32, cpu_count + 4)\`. For CPU-bound process pools, use at most the number of physical cores (\`os.cpu_count()\`, or \`os.process_cpu_count()\` on 3.13+ to respect container limits). For asyncio, bound in-flight work with a \`Semaphore\` sized to what the upstream service tolerates, often 10–100.
**How do I add a timeout to an async function in Python?**
Wrap the await in \`async with asyncio.timeout(seconds):\` (Python 3.11+) and catch \`TimeoutError\`. For a single awaitable on older versions, \`await asyncio.wait_for(coro, timeout=seconds)\` works the same way.`
    },
    {
      heading: "16. Interview Questions and Answers on asyncio, Threading, Multiprocessing and the GIL",
      content: `**Q1. What is the GIL and why does CPython have it?**
The Global Interpreter Lock is a mutex that lets only one thread run Python bytecode at a time. CPython uses reference counting for memory management, and the GIL protects those counts (and other interpreter state) from concurrent modification cheaply. It keeps single-threaded performance high and C extensions simple, at the cost of CPU-bound threads not running in parallel. It is released during blocking I/O and by many C extensions, which is why threads still help I/O-bound code.
**Q2. What happens when you call an async function without await?**
You get a coroutine object; the body does not execute. When that object is garbage-collected, Python emits \`RuntimeWarning: coroutine '...' was never awaited\`. The coroutine runs only when awaited, wrapped in a Task via \`asyncio.create_task\`, or passed to \`asyncio.run\`.
**Q3. Explain how the asyncio event loop works internally.**
It is a single-threaded scheduler. It keeps a ready queue of callbacks and a heap of timed callbacks, and on each iteration it asks the OS selector (epoll/kqueue/IOCP) which file descriptors are ready, with a timeout equal to the next scheduled timer. It then runs ready callbacks, each of which typically resumes a coroutine until its next \`await\`. Because switching happens only at awaits, the loop never pre-empts running code.
**Q4. Compare asyncio.gather, asyncio.wait and asyncio.as_completed.**
\`gather\` awaits all and returns ordered results (optionally collecting exceptions). \`wait\` returns \`(done, pending)\` sets and supports \`return_when=FIRST_COMPLETED / FIRST_EXCEPTION / ALL_COMPLETED\`, giving you manual control. \`as_completed\` yields awaitables in completion order so you can process results as they arrive. \`TaskGroup\` is the structured, cancel-on-failure alternative to \`gather\`.
**Q5. How does cancellation work in asyncio and what are the rules for handling CancelledError?**
\`task.cancel()\` schedules a \`CancelledError\` to be thrown into the coroutine at its next await. It derives from \`BaseException\` so \`except Exception\` does not catch it. If you catch it, re-raise after cleanup; put cleanup in \`finally\`; use \`asyncio.shield\` for operations that must complete once started; never block during cleanup.
**Q6. How would you run CPU-bound work from an async web server without blocking it?**
Use \`loop.run_in_executor\` with a \`ProcessPoolExecutor\` (created once at startup), awaiting the returned future. Threads would still be limited by the GIL on the default build. Keep the executor's worker count at or below the number of cores, and make arguments and return values picklable and small.
**Q7. Why is the \`if __name__ == "__main__"\` guard required with multiprocessing?**
With the \`spawn\` start method (default on Windows and macOS, and on Linux from Python 3.14), each child process starts a fresh interpreter and re-imports the main module to find the target function. Without the guard, the module-level code that creates the pool runs again in every child, recursively spawning processes until the system runs out of resources.
**Q8. What is structured concurrency and how does TaskGroup implement it?**
Structured concurrency means a concurrent task's lifetime is bounded by a lexical scope: it cannot outlive the block that created it. \`TaskGroup\` enforces this: the \`async with\` block does not exit until every task finishes, a failure cancels the siblings, and all errors surface together in an \`ExceptionGroup\` handled with \`except*\`. This eliminates leaked background tasks and unobserved exceptions.
**Q9. Threads in Python are 'useless' because of the GIL — true or false?**
False. Threads are excellent for I/O-bound work because the GIL is released while waiting on sockets, files and sleeps; many C extensions (NumPy, hashlib, zlib, image libraries) release it during heavy computation too. They are a poor fit only for pure-Python CPU-bound loops on the default build. On free-threaded builds (supported since 3.14) even that limitation goes away, subject to extension compatibility.
**Q10. What is the difference between asyncio.Semaphore and asyncio.Lock, and when would you use each?**
A \`Lock\` allows exactly one holder — use it to protect a critical section such as refreshing an auth token so that ten concurrent requests do not all refresh it. A \`Semaphore(n)\` allows up to n holders — use it to bound concurrency, for example at most 20 simultaneous HTTP requests to one upstream. Both are async context managers and neither is thread-safe; they only coordinate coroutines on the same loop.`
    },
    {
      heading: "17. Hands-On Exercise: Build an Async Price Monitor with httpx, TaskGroup, Timeouts and a Process Pool",
      content: `Build a small but production-shaped tool that watches the prices of several products across e-commerce APIs, exactly the kind of service a price-comparison startup runs every few minutes. Requirements:
1. Fetch each product's price from each store **concurrently**, with at most **4 requests in flight** (semaphore) and a **1.5 second per-request timeout**.
2. Use a single shared \`httpx.AsyncClient\`. One store is slow and one endpoint is broken — the run must still finish and report those as errors, not crash.
3. Use \`asyncio.TaskGroup\` and collect results into a list of \`PriceResult\` dataclasses.
4. After fetching, compute a CPU-heavy "deal score" for each product in a \`ProcessPoolExecutor\` via \`run_in_executor\`, so the event loop stays responsive (a heartbeat task proves it).
5. Print a report: cheapest store per product, the deal score, and a list of failures. Print total wall time.
To keep the exercise runnable offline and deterministic, the program uses \`httpx.MockTransport\`, which lets a function answer requests in-process without any network. Replace the transport with a real one (delete the \`transport=\` argument and point \`STORES\` at real URLs) to run it against live APIs — nothing else changes, which is the point of the design. Install httpx with \`uv add httpx\` or \`pip install httpx\`, then run \`python price_monitor.py\`.
Stretch goals once it works: add retry with exponential backoff for \`TransportError\`; replace the mock with the public \`https://dummyjson.com/products/{id}\` API; add a bounded \`asyncio.Queue\` so a producer discovers products while consumers fetch prices; write a \`pytest-asyncio\` test that asserts the slow store is reported as a timeout.`,
      codeSnippet: `# price_monitor.py — Python 3.11+, pip install httpx (or: uv add httpx)
from __future__ import annotations

import asyncio
import hashlib
import json
import time
from concurrent.futures import ProcessPoolExecutor
from dataclasses import dataclass

import httpx

PRODUCTS = {"P100": "Noise-cancelling headphones", "P200": "Mechanical keyboard", "P300": "27-inch monitor"}
STORES = {"flipkart": "https://flipkart.example/api", "amazon": "https://amazon.example/api",
          "croma": "https://croma.example/api"}
MAX_IN_FLIGHT = 4
PER_REQUEST_TIMEOUT = 1.5

# ---- fake stores (MockTransport answers in-process; remove for real APIs) ----
_PRICES = {"flipkart": {"P100": 7999, "P200": 4599, "P300": 15999},
           "amazon": {"P100": 7499, "P200": 4799, "P300": 15499},
           "croma": {"P100": 8299, "P200": 4499, "P300": 16999}}


async def fake_store(request: httpx.Request) -> httpx.Response:
    store = request.url.host.split(".")[0]
    product_id = request.url.path.rsplit("/", 1)[-1]
    if store == "croma" and product_id == "P300":
        await asyncio.sleep(3)                                  # slow endpoint -> timeout
    if store == "amazon" and product_id == "P200":
        return httpx.Response(500, json={"error": "upstream down"})
    await asyncio.sleep(0.4)                                    # normal latency
    return httpx.Response(200, json={"id": product_id, "price_inr": _PRICES[store][product_id]})


# ---- domain model ----
@dataclass(slots=True)
class PriceResult:
    product_id: str
    store: str
    price_inr: int | None = None
    error: str | None = None

    @property
    def ok(self) -> bool:
        return self.price_inr is not None


# ---- async fetching ----
async def fetch_price(client: httpx.AsyncClient, sem: asyncio.Semaphore,
                      store: str, product_id: str) -> PriceResult:
    async with sem:
        try:
            async with asyncio.timeout(PER_REQUEST_TIMEOUT):
                r = await client.get(f"{STORES[store]}/products/{product_id}")
                r.raise_for_status()
                return PriceResult(product_id, store, price_inr=r.json()["price_inr"])
        except TimeoutError:
            return PriceResult(product_id, store, error=f"timeout after {PER_REQUEST_TIMEOUT}s")
        except httpx.HTTPStatusError as e:
            return PriceResult(product_id, store, error=f"HTTP {e.response.status_code}")
        except httpx.TransportError as e:
            return PriceResult(product_id, store, error=type(e).__name__)


# ---- CPU-bound scoring (runs in a worker process; must be top-level + picklable) ----
def deal_score(product_id: str, prices: list[int]) -> tuple[str, float]:
    payload = json.dumps({"id": product_id, "prices": prices}).encode()
    digest = payload
    for _ in range(150_000):                                    # deliberately heavy
        digest = hashlib.sha256(digest).digest()
    spread = (max(prices) - min(prices)) / max(prices) if prices else 0.0
    return product_id, round(spread * 100 + digest[0] / 255, 2)


async def heartbeat(stop: asyncio.Event) -> None:
    ticks = 0
    while not stop.is_set():
        ticks += 1
        await asyncio.sleep(0.25)
    print(f"[heartbeat] loop stayed responsive ({ticks} ticks)")


async def main() -> None:
    start = time.perf_counter()
    stop = asyncio.Event()
    hb = asyncio.create_task(heartbeat(stop))
    sem = asyncio.Semaphore(MAX_IN_FLIGHT)

    async with httpx.AsyncClient(transport=httpx.MockTransport(fake_store),
                                 timeout=httpx.Timeout(5.0, connect=2.0)) as client:
        async with asyncio.TaskGroup() as tg:
            tasks = [tg.create_task(fetch_price(client, sem, store, pid))
                     for pid in PRODUCTS for store in STORES]
    results = [t.result() for t in tasks]
    print(f"fetched {len(results)} prices in {time.perf_counter() - start:.2f}s")

    loop = asyncio.get_running_loop()
    with ProcessPoolExecutor(max_workers=3) as pool:
        futures = [loop.run_in_executor(pool, deal_score, pid,
                                        [r.price_inr for r in results if r.product_id == pid and r.ok])
                   for pid in PRODUCTS]
        scores = dict(await asyncio.gather(*futures))

    stop.set()
    await hb

    print("\\n=== Price report ===")
    for pid, name in PRODUCTS.items():
        good = [r for r in results if r.product_id == pid and r.ok]
        if good:
            best = min(good, key=lambda r: r.price_inr)
            print(f"{name:28} cheapest at {best.store:9} ₹{best.price_inr:,}   deal score {scores[pid]}")
        else:
            print(f"{name:28} no prices available")
    failures = [r for r in results if not r.ok]
    print(f"\\n{len(failures)} failures:")
    for r in failures:
        print(f"  {r.store:9} {r.product_id}: {r.error}")
    print(f"\\ntotal wall time {time.perf_counter() - start:.2f}s")


if __name__ == "__main__":
    asyncio.run(main())

# Expected output (timings approximate):
# fetched 9 prices in 2.30s
# [heartbeat] loop stayed responsive (12 ticks)
#
# === Price report ===
# Noise-cancelling headphones  cheapest at amazon    ₹7,499   deal score 9.78
# Mechanical keyboard          cheapest at croma     ₹4,499   deal score 2.55
# 27-inch monitor              cheapest at amazon    ₹15,499  deal score 3.41
#
# 2 failures:
#   amazon    P200: HTTP 500
#   croma     P300: timeout after 1.5s
#
# total wall time 3.10s`
    },
    {
      heading: "18. Summary",
      content: `• **Concurrency** overlaps waiting; **parallelism** uses multiple cores. I/O-bound work needs concurrency; CPU-bound work needs parallelism.
• The **GIL** lets one thread run Python bytecode at a time but is released during I/O and in many C extensions. **Free-threaded builds** were experimental in 3.13 and are officially supported but still optional in 3.14 (PEP 779); the default interpreter keeps the GIL.
• **threading** suits I/O with blocking libraries; **multiprocessing / ProcessPoolExecutor** suits CPU-bound work (picklable functions, \`__main__\` guard); **asyncio** suits high-concurrency I/O with async libraries.
• \`async def\` creates coroutines; \`await\` is the only switch point; the **event loop** drives everything; \`asyncio.run()\` is the single entry point.
• \`asyncio.create_task\` runs work in the background — keep references. \`asyncio.gather\` collects ordered results; \`asyncio.TaskGroup\` (3.11+) gives structured concurrency with cancel-on-failure and \`except*\`.
• Always set **timeouts** (\`asyncio.timeout\`, \`httpx.Timeout\`). Never swallow \`CancelledError\`; clean up in \`finally\`; \`shield\` only what must complete.
• Use **httpx.AsyncClient** with one shared client, \`raise_for_status()\`, and an \`asyncio.Semaphore\` to bound concurrency.
• Bridge blocking code with \`asyncio.to_thread\` (I/O) and \`run_in_executor(ProcessPoolExecutor)\` (CPU). \`concurrent.futures\` gives the same pools to sync code, plus \`InterpreterPoolExecutor\` in Python 3.14.
• Measure CPU time vs wall time before choosing a model, and skip concurrency entirely when the gain is milliseconds.
**Next lecture:** Testing with pytest`
    }
  ]
};
