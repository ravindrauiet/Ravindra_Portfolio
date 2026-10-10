export const lecture11 = {
  slug: "lecture-11",
  number: 11,
  title: "Complete Java Course — Lecture 11: Concurrency & Multithreading",
  summary: "Master Java concurrency and multithreading: threads vs processes, Runnable and Callable, thread lifecycle, race conditions, synchronized, volatile, ReentrantLock, atomic classes, ExecutorService thread pools, CompletableFuture, concurrent collections, deadlocks and Java 21 virtual threads, with interview questions.",
  readTime: "52 min read",
  difficulty: "Advanced",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. Introduction: What Is Concurrency and Multithreading in Java, and Processes vs Threads",
      content: `In the previous lecture you learned the modern language features of Java 17 to 25: records, sealed types and pattern matching. This lecture moves from the language to the runtime and answers a question every backend developer eventually faces: how does one Java program do many things at the same time, safely?
**Concurrency** means dealing with multiple tasks whose lifetimes overlap: a web server handling 2,000 HTTP requests, a trading app receiving price ticks while users place orders, a batch job reading files while writing to a database. **Parallelism** is the narrower idea of literally executing tasks simultaneously on multiple CPU cores. Java gives you both through **threads**, and since Java 21 it also gives you **virtual threads** that make concurrency far cheaper.
Why does this matter in real projects?
• **Throughput** — a Spring Boot API that waits 50 ms for a database on one thread can serve only 20 requests per second per thread. Multithreading lets other requests proceed while one waits.
• **Responsiveness** — Android and desktop apps must keep the UI thread free while network calls happen in the background.
• **Correctness** — concurrency bugs (race conditions, deadlocks, visibility problems) are the hardest bugs to reproduce. An IRCTC-style booking system that double-sells a seat because two threads updated the same counter is a real and expensive failure.
• **Interviews** — "difference between process and thread", "synchronized vs volatile", "what is a deadlock", "virtual threads vs platform threads" are asked in nearly every Java interview from 1 to 10 years of experience.
**Processes vs threads.** A **process** is a running program with its own memory space, file handles and security context; two processes cannot read each other's variables without explicit inter-process communication (sockets, pipes, shared files). Your JVM is one process. A **thread** is an independent path of execution **inside** a process. All threads of a JVM share the same heap (objects), the same loaded classes and the same open files, but each thread has its own **stack** (local variables, method call frames) and its own **program counter**. Sharing the heap is what makes threads cheap to create and fast to communicate with, and it is also exactly what makes them dangerous: two threads touching the same object at the same time is where every concurrency bug begins.
Concrete numbers help. Creating a process on Linux costs milliseconds and megabytes; creating a platform thread costs roughly 50 to 100 microseconds and reserves about 1 MB of stack by default (the \`-Xss\` setting). A Java 21 virtual thread costs well under a microsecond and a few hundred bytes of heap to start, which is why a single JVM can run millions of them. Keep this comparison in mind for the whole lecture.`
    },
    {
      heading: "2. Creating Threads in Java: Thread, Runnable, Callable and Lambdas",
      content: `Java has had the \`java.lang.Thread\` class since version 1.0. There are three classic ways to create a unit of work and one modern builder API.
**1. Extend Thread** — override \`run()\`. Simple, but it wastes your single inheritance slot and couples the task to the thread. Rarely used in modern code.
**2. Implement Runnable** — \`Runnable\` is a functional interface with one method, \`void run()\`. You hand the Runnable to a \`Thread\` (or, better, to an executor). Because it is a functional interface, a lambda works: \`Runnable task = () -> System.out.println("hi");\`. A Runnable cannot return a value and cannot throw checked exceptions.
**3. Implement Callable** — \`Callable<V>\` (Java 5, in \`java.util.concurrent\`) has one method, \`V call() throws Exception\`. It **returns a result** and **may throw checked exceptions**. A Callable cannot be passed to \`new Thread(...)\`; it is submitted to an \`ExecutorService\`, which returns a \`Future<V>\` (section 8).
**4. Thread.Builder (Java 21)** — \`Thread.ofPlatform()\` and \`Thread.ofVirtual()\` give a fluent API to name threads, mark them daemon, and start them. This is the preferred way to create a thread directly in Java 21+.
Key \`Thread\` methods you must know:
• \`start()\` — asks the JVM to create a new OS thread and call \`run()\` on it. Calling \`run()\` directly just runs the method on the current thread (a very common beginner mistake).
• \`join()\` — the calling thread waits until this thread finishes. \`join(long millis)\` waits with a timeout.
• \`sleep(long millis)\` — static; pauses the **current** thread without releasing any locks it holds.
• \`interrupt()\`, \`isInterrupted()\`, \`Thread.interrupted()\` — cooperative cancellation (section 3).
• \`setDaemon(true)\` — a daemon thread does not keep the JVM alive; the JVM exits when only daemon threads remain. Loggers and housekeeping timers are typical daemons.
• \`currentThread()\`, \`getName()\`, \`setName()\`, \`getId()\` (deprecated in Java 19 in favour of \`threadId()\`).
**Deprecated and removed:** \`stop()\`, \`suspend()\` and \`resume()\` were deprecated in Java 1.2 because they corrupt data and cause deadlocks; since Java 20 they throw \`UnsupportedOperationException\` unconditionally. Never use them.`,
      codeSnippet: `// CreatingThreads.java  — compile and run with Java 21+
import java.util.concurrent.*;

public class CreatingThreads {

    // 1. Extending Thread (legacy style)
    static class Greeter extends Thread {
        @Override public void run() {
            System.out.println("Hello from " + getName());
        }
    }

    public static void main(String[] args) throws Exception {
        Thread t1 = new Greeter();
        t1.setName("greeter-thread");
        t1.start();                 // NOT t1.run()

        // 2. Runnable with a lambda
        Runnable printer = () -> {
            for (int i = 1; i <= 3; i++) {
                System.out.println(Thread.currentThread().getName() + " prints " + i);
            }
        };
        Thread t2 = new Thread(printer, "printer-thread");
        t2.start();

        // 3. Callable returns a value and may throw a checked exception
        Callable<Integer> sumTask = () -> {
            int sum = 0;
            for (int i = 1; i <= 100; i++) sum += i;
            return sum;
        };
        try (ExecutorService pool = Executors.newSingleThreadExecutor()) {
            Future<Integer> future = pool.submit(sumTask);
            System.out.println("Sum 1..100 = " + future.get());   // blocks until done
        }   // ExecutorService.close() (Java 19+) waits for tasks, then shuts down

        // 4. Thread.Builder (Java 21): named platform thread, daemon flag
        Thread t3 = Thread.ofPlatform()
                          .name("worker-", 1)   // worker-1, worker-2, ...
                          .daemon(false)
                          .start(() -> System.out.println("Builder thread: "
                                  + Thread.currentThread().getName()));

        t1.join(); t2.join(); t3.join();        // wait for all three
        System.out.println("main done");
    }
}
/* Possible output (thread order can vary between runs):
Hello from greeter-thread
printer-thread prints 1
printer-thread prints 2
printer-thread prints 3
Sum 1..100 = 5050
Builder thread: worker-1
main done
*/`
    },
    {
      heading: "3. Java Thread Lifecycle: Thread States, join, sleep, wait and Interruption",
      content: `Every Java thread passes through states defined in the \`Thread.State\` enum. You can read them at any time with \`thread.getState()\` and you will see them in thread dumps (\`jstack\` or \`jcmd <pid> Thread.print\`) when diagnosing a hung server.
• **NEW** — the \`Thread\` object exists but \`start()\` has not been called. No OS thread yet.
• **RUNNABLE** — \`start()\` was called. The thread is either executing on a CPU or waiting for the OS scheduler to give it a CPU. Java does not distinguish "running" from "ready"; both are RUNNABLE.
• **BLOCKED** — the thread wants to enter a \`synchronized\` block or method but another thread holds the monitor. Many threads BLOCKED on the same lock in a thread dump means lock contention.
• **WAITING** — the thread called \`Object.wait()\`, \`Thread.join()\` or \`LockSupport.park()\` with no timeout and is waiting for another thread to wake it (\`notify()\`, thread completion, \`unpark()\`).
• **TIMED_WAITING** — same, but with a timeout: \`Thread.sleep(ms)\`, \`wait(ms)\`, \`join(ms)\`, \`future.get(timeout)\`, \`lock.tryLock(timeout)\`.
• **TERMINATED** — \`run()\` returned normally or threw an uncaught exception. A terminated thread cannot be restarted; calling \`start()\` again throws \`IllegalThreadStateException\`.
**wait / notify / notifyAll** are methods of \`Object\`, not \`Thread\`, because every object has a monitor. They must be called while holding that object's lock, inside \`synchronized\`, otherwise you get \`IllegalMonitorStateException\`. \`wait()\` releases the lock and parks the thread; \`notify()\` wakes one waiting thread, \`notifyAll()\` wakes all. Always call \`wait()\` inside a \`while\` loop that re-checks the condition, because of **spurious wakeups** and because another thread may have consumed the condition first. In modern code you rarely use these directly; \`BlockingQueue\`, \`CountDownLatch\` and \`Condition\` objects are safer wrappers.
**Interruption** is Java's cooperative cancellation mechanism. \`thread.interrupt()\` does not kill the thread. It sets a flag, and if the thread is blocked in \`sleep()\`, \`wait()\`, \`join()\` or a blocking queue operation, that method throws \`InterruptedException\` and clears the flag. A long-running loop must check \`Thread.currentThread().isInterrupted()\` itself. The golden rule: when you catch \`InterruptedException\` and cannot handle it, call \`Thread.currentThread().interrupt()\` to restore the flag so callers higher up the stack know a cancellation was requested. Swallowing it with an empty catch block is one of the most common concurrency bugs in Indian enterprise codebases.`,
      codeSnippet: `// ThreadLifecycle.java
public class ThreadLifecycle {
    public static void main(String[] args) throws InterruptedException {
        Object lock = new Object();

        Thread worker = new Thread(() -> {
            try {
                Thread.sleep(300);                     // TIMED_WAITING
                synchronized (lock) {
                    lock.wait();                       // WAITING (releases lock)
                }
                // Simulated long loop that checks the interrupt flag
                while (!Thread.currentThread().isInterrupted()) {
                    // do a unit of work
                }
                System.out.println("worker saw interrupt flag, exiting loop");
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();   // restore the flag
                System.out.println("worker interrupted while blocked");
            }
        }, "worker");

        System.out.println("1: " + worker.getState());   // NEW
        worker.start();
        System.out.println("2: " + worker.getState());   // RUNNABLE
        Thread.sleep(100);
        System.out.println("3: " + worker.getState());   // TIMED_WAITING (sleep)
        Thread.sleep(300);
        System.out.println("4: " + worker.getState());   // WAITING (wait)

        synchronized (lock) { lock.notifyAll(); }        // wake it up
        Thread.sleep(100);
        System.out.println("5: " + worker.getState());   // RUNNABLE (busy loop)

        worker.interrupt();                              // cooperative cancel
        worker.join();
        System.out.println("6: " + worker.getState());   // TERMINATED
    }
}
/* Output:
1: NEW
2: RUNNABLE
3: TIMED_WAITING
4: WAITING
5: RUNNABLE
worker saw interrupt flag, exiting loop
6: TERMINATED
*/`
    },
    {
      heading: "4. Race Conditions, the Java Memory Model, synchronized and volatile",
      content: `A **race condition** occurs when the correctness of a program depends on the timing of threads. The textbook example is \`count++\`. It looks atomic but compiles to three steps: read \`count\`, add 1, write back. If two threads read the same value 41 at the same moment, both write 42, and one increment is lost. Run 10 threads doing 100,000 increments each and you will get far less than 1,000,000. This is a **lost update**, the simplest form of a **data race**.
There is a second, subtler problem: **visibility**. Each CPU core has its own cache and the JIT compiler may keep a variable in a register. A thread that spins on \`while (!stopped) {}\` may **never** see another thread setting \`stopped = true\`, because nothing forces the cores to synchronise memory. The **Java Memory Model (JMM)**, formalised in Java 5 (JSR-133), defines when a write by one thread is guaranteed visible to another through the **happens-before** relationship. The rules you must know: unlocking a monitor happens-before every subsequent lock of that monitor; a write to a \`volatile\` field happens-before every subsequent read of it; \`Thread.start()\` happens-before anything in the started thread; everything in a thread happens-before another thread's \`join()\` on it returns.
**synchronized** solves both problems. Every Java object has an intrinsic lock (monitor). A \`synchronized\` block acquires that lock on entry and releases it on exit, even if an exception is thrown. Only one thread can hold a given monitor at a time, so the three steps of \`count++\` become **atomic** with respect to other synchronized blocks on the same lock, and the lock release/acquire pair also flushes memory, giving **visibility**. A \`synchronized\` instance method locks \`this\`; a \`synchronized\` static method locks the \`Class\` object. Intrinsic locks are **reentrant**: a thread that already holds the lock can enter another synchronized block on the same object without deadlocking itself.
**volatile** is a lighter tool that gives **visibility and ordering but not atomicity**. Reads and writes of a volatile field go straight to main memory and cannot be reordered across other operations by the compiler. \`volatile boolean running\` is perfect for a stop flag, and \`volatile\` is what makes the double-checked locking singleton correct. But \`volatile int count; count++\` is still a race, because the read-modify-write is three operations. Use \`volatile\` when exactly one thread writes and others only read, or when the new value does not depend on the old value. Use \`synchronized\`, a lock or an atomic class when it does.
A rule of thumb for designing shared state: **immutable objects need no synchronisation at all** (records from Lecture 10 are ideal), **thread-confined** objects (created and used by one thread, like local variables) need none, and only genuinely **shared mutable** state needs locking. Minimise shared mutable state and most concurrency problems disappear before they start.`,
      codeSnippet: `// RaceConditionDemo.java
import java.util.ArrayList;
import java.util.List;

public class RaceConditionDemo {
    static int unsafeCount = 0;             // plain field: lost updates
    static int safeCount = 0;               // protected by LOCK
    static final Object LOCK = new Object();
    static volatile boolean running = true; // visibility flag, single writer

    static synchronized void incrementStatic() { /* locks RaceConditionDemo.class */ }

    public static void main(String[] args) throws InterruptedException {
        List<Thread> threads = new ArrayList<>();
        for (int t = 0; t < 10; t++) {
            Thread th = new Thread(() -> {
                for (int i = 0; i < 100_000; i++) {
                    unsafeCount++;                      // race condition
                    synchronized (LOCK) { safeCount++; } // atomic + visible
                }
            });
            threads.add(th);
            th.start();
        }
        for (Thread th : threads) th.join();

        System.out.println("unsafeCount = " + unsafeCount + " (expected 1000000)");
        System.out.println("safeCount   = " + safeCount);

        // volatile stop flag: without 'volatile' the reader may spin forever
        Thread spinner = new Thread(() -> {
            long spins = 0;
            while (running) { spins++; }
            System.out.println("spinner stopped after " + spins + " spins");
        });
        spinner.start();
        Thread.sleep(100);
        running = false;                                 // visible immediately
        spinner.join();
    }
}
/* Sample output (the unsafe number changes every run):
unsafeCount = 437219 (expected 1000000)
safeCount   = 1000000
spinner stopped after 51387320 spins
*/`
    },
    {
      heading: "5. Explicit Locks in Java: ReentrantLock, tryLock, Condition and ReadWriteLock",
      content: `\`synchronized\` is simple, but it has limits: you cannot time out while waiting for the lock, cannot interrupt a thread blocked on it, cannot try to acquire without blocking, and cannot have separate reader and writer modes. The \`java.util.concurrent.locks\` package (Java 5) provides explicit locks that fix all of these.
**ReentrantLock** behaves like a synchronized monitor (mutual exclusion, reentrancy, same memory visibility guarantees) with extra capabilities:
• \`lock()\` / \`unlock()\` — you **must** unlock in a \`finally\` block. Unlike \`synchronized\`, nothing releases the lock automatically if you forget or an exception occurs before \`finally\`.
• \`tryLock()\` — returns \`false\` immediately if the lock is busy, which lets you avoid deadlock by backing off. \`tryLock(1, TimeUnit.SECONDS)\` waits up to the timeout.
• \`lockInterruptibly()\` — the waiting thread can be interrupted.
• \`new ReentrantLock(true)\` — **fair** mode hands the lock to the longest-waiting thread. Fairness reduces throughput noticeably, so leave it off unless starvation is an actual problem.
• \`getQueueLength()\`, \`isLocked()\`, \`isHeldByCurrentThread()\` — diagnostics unavailable with monitors.
**Condition** objects replace \`wait()\`/\`notify()\`. One lock can have several conditions (for example \`notFull\` and \`notEmpty\` in a bounded buffer), so you wake exactly the threads that care. Use \`condition.await()\` inside a \`while\` loop and \`condition.signal()\` or \`signalAll()\` to wake waiters.
**ReentrantReadWriteLock** allows many concurrent readers **or** one writer. It shines for read-heavy caches, such as a configuration map read 10,000 times per second and updated once a minute. Be aware that it is slower than a plain lock under write-heavy load, and a writer can starve if readers keep arriving in non-fair mode.
**StampedLock** (Java 8) adds **optimistic reading**: \`tryOptimisticRead()\` returns a stamp without blocking; you read your fields and then call \`validate(stamp)\`. If no write happened, you avoided locking entirely. It is not reentrant and does not support conditions, so use it only in hot paths where measurement proves \`ReadWriteLock\` is the bottleneck.
**Which to choose?** Default to \`synchronized\` for simple critical sections; since Java 24 (JEP 491) it no longer pins virtual threads, which removed the main modern argument against it. Reach for \`ReentrantLock\` when you need \`tryLock\`, timeouts, interruptibility, fairness or multiple conditions. Reach for read-write locks only when profiling shows reader contention.`,
      codeSnippet: `// BankAccountWithLock.java
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.*;

public class BankAccountWithLock {
    private final ReentrantLock lock = new ReentrantLock();
    private final Condition sufficientFunds = lock.newCondition();
    private long balancePaise;            // store money in paise, never double

    public BankAccountWithLock(long initialPaise) { this.balancePaise = initialPaise; }

    public void deposit(long paise) {
        lock.lock();
        try {
            balancePaise += paise;
            sufficientFunds.signalAll();   // wake threads waiting to withdraw
        } finally {
            lock.unlock();                 // ALWAYS in finally
        }
    }

    // Waits up to 'timeout' for enough balance, then withdraws
    public boolean withdraw(long paise, long timeout, TimeUnit unit) throws InterruptedException {
        long nanosLeft = unit.toNanos(timeout);
        lock.lock();
        try {
            while (balancePaise < paise) {
                if (nanosLeft <= 0) return false;              // timed out
                nanosLeft = sufficientFunds.awaitNanos(nanosLeft); // releases lock while waiting
            }
            balancePaise -= paise;
            return true;
        } finally {
            lock.unlock();
        }
    }

    public long balance() {
        lock.lock();
        try { return balancePaise; } finally { lock.unlock(); }
    }

    public static void main(String[] args) throws Exception {
        BankAccountWithLock acct = new BankAccountWithLock(50_000);   // Rs 500.00

        Thread withdrawer = new Thread(() -> {
            try {
                boolean ok = acct.withdraw(120_000, 2, TimeUnit.SECONDS); // Rs 1200
                System.out.println("withdraw Rs 1200 -> " + ok);
            } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        });
        withdrawer.start();

        Thread.sleep(500);
        acct.deposit(100_000);                 // Rs 1000 arrives; waiter wakes up
        withdrawer.join();
        System.out.println("final balance = Rs " + acct.balance() / 100.0);

        // ReadWriteLock sketch for a read-heavy cache
        ReadWriteLock rw = new ReentrantReadWriteLock();
        rw.readLock().lock();  try { /* many readers at once */ } finally { rw.readLock().unlock(); }
        rw.writeLock().lock(); try { /* exclusive writer */ }    finally { rw.writeLock().unlock(); }
    }
}
/* Output:
withdraw Rs 1200 -> true
final balance = Rs 300.0
*/`
    },
    {
      heading: "6. Atomic Classes in Java: AtomicInteger, AtomicLong, AtomicReference, LongAdder and CAS",
      content: `Locks are heavyweight for a single counter. The \`java.util.concurrent.atomic\` package provides **lock-free** classes whose operations are atomic and visible without any \`synchronized\` block. They are built on a CPU instruction called **compare-and-swap (CAS)**: "if the value is still what I expect, replace it with my new value; otherwise tell me it changed". The JVM loops: read the current value, compute the new one, attempt CAS, retry on failure. Under low contention this is much faster than locking because no thread is ever parked by the OS.
The main classes:
• \`AtomicInteger\`, \`AtomicLong\`, \`AtomicBoolean\` — \`get()\`, \`set()\`, \`incrementAndGet()\`, \`getAndIncrement()\`, \`addAndGet(n)\`, \`compareAndSet(expected, newValue)\`, and since Java 8 \`updateAndGet(fn)\` and \`accumulateAndGet(x, fn)\` which apply a lambda atomically.
• \`AtomicReference<V>\` — atomic pointer swap, useful for lock-free immutable state updates: build a new record, CAS it in.
• \`AtomicIntegerArray\`, \`AtomicLongArray\` — atomic element access.
• \`LongAdder\` and \`LongAccumulator\` (Java 8) — for counters that are **written far more often than read** (request counters, metrics). Under heavy contention many threads CAS-ing one \`AtomicLong\` keep failing and retrying; \`LongAdder\` spreads the updates across several internal cells and sums them on \`sum()\`. In benchmarks with 16 threads hammering a counter, \`LongAdder\` is often 5 to 10 times faster than \`AtomicLong\`.
**The ABA problem.** CAS checks the value, not history. If a thread reads A, another thread changes it to B and back to A, the first thread's CAS succeeds though the state changed. For simple counters this is harmless; for lock-free data structures with pointers it is not, and \`AtomicStampedReference\` adds a version stamp to detect it.
**Limits of atomics.** They make **one** variable atomic. If an invariant spans two variables (for example \`balance\` and \`transactionCount\` must change together), atomics cannot help; you need a lock or an immutable snapshot object swapped with \`AtomicReference\`. Also, \`VarHandle\` (Java 9) exposes the same CAS operations for ordinary fields in performance-critical library code, replacing the unsupported \`sun.misc.Unsafe\`.`,
      codeSnippet: `// AtomicCountersDemo.java
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;

public class AtomicCountersDemo {
    record Stats(long requests, long errors) {
        Stats withRequest(boolean failed) {
            return new Stats(requests + 1, failed ? errors + 1 : errors);
        }
    }

    public static void main(String[] args) throws Exception {
        AtomicInteger atomicCount = new AtomicInteger();
        LongAdder adder = new LongAdder();
        AtomicReference<Stats> stats = new AtomicReference<>(new Stats(0, 0));

        try (ExecutorService pool = Executors.newFixedThreadPool(8)) {
            for (int t = 0; t < 8; t++) {
                final int threadNo = t;
                pool.submit(() -> {
                    for (int i = 0; i < 250_000; i++) {
                        atomicCount.incrementAndGet();          // CAS loop
                        adder.increment();                      // striped cells
                        boolean failed = (i % 100 == threadNo); // ~1% failures
                        stats.updateAndGet(s -> s.withRequest(failed)); // atomic swap of record
                    }
                });
            }
        }   // close() waits for all tasks

        System.out.println("AtomicInteger = " + atomicCount.get());
        System.out.println("LongAdder     = " + adder.sum());
        System.out.println("Stats         = " + stats.get());

        // compareAndSet in action
        AtomicInteger seat = new AtomicInteger(1);                 // 1 = available
        boolean bookedByA = seat.compareAndSet(1, 0);              // true
        boolean bookedByB = seat.compareAndSet(1, 0);              // false: already 0
        System.out.println("A booked: " + bookedByA + ", B booked: " + bookedByB);
    }
}
/* Output:
AtomicInteger = 2000000
LongAdder     = 2000000
Stats         = Stats[requests=2000000, errors=20000]
A booked: true, B booked: false
*/`
    },
    {
      heading: "7. ExecutorService and Thread Pools in Java: Fixed, Cached, Scheduled and Custom",
      content: `Creating a new \`Thread\` per task is wrong for servers: thread creation is expensive, unlimited threads exhaust memory (each platform thread reserves a stack), and you have no way to queue, limit, or monitor work. The **Executor framework** (Java 5) separates **task submission** from **task execution**. You submit \`Runnable\` or \`Callable\` objects to an \`ExecutorService\`; a **thread pool** behind it reuses a fixed set of worker threads.
Factory methods on \`Executors\`:
• \`newFixedThreadPool(n)\` — exactly \`n\` threads and an **unbounded** \`LinkedBlockingQueue\`. Good for CPU-bound work with \`n = Runtime.getRuntime().availableProcessors()\`. Danger: if tasks arrive faster than they finish, the queue grows until \`OutOfMemoryError\`.
• \`newCachedThreadPool()\` — creates threads on demand, reuses idle ones, kills threads idle for 60 seconds, and has **no upper limit**. Fine for short bursts; dangerous under sustained load (thousands of threads).
• \`newSingleThreadExecutor()\` — one worker, tasks run sequentially in submission order. Useful for serialising writes to a file or a non-thread-safe resource.
• \`newScheduledThreadPool(n)\` — \`schedule(task, 5, SECONDS)\`, \`scheduleAtFixedRate(...)\`, \`scheduleWithFixedDelay(...)\` for periodic jobs such as cache refresh or report generation.
• \`newWorkStealingPool()\` — a \`ForkJoinPool\` where idle workers steal tasks from busy ones; used internally by parallel streams and \`CompletableFuture\` defaults.
• \`newVirtualThreadPerTaskExecutor()\` (Java 21) — one virtual thread per task, no pooling needed (section 11).
In production, most teams construct **\`ThreadPoolExecutor\`** directly so they control every parameter: \`corePoolSize\` (threads kept alive), \`maximumPoolSize\` (upper limit), \`keepAliveTime\` (how long extra threads live idle), a **bounded** \`workQueue\` (for example \`ArrayBlockingQueue(500)\`), a \`ThreadFactory\` that names threads (vital for log readability and thread dumps), and a **\`RejectedExecutionHandler\`**. The behaviour when a task arrives: if fewer than core threads exist, create one; otherwise queue it; if the queue is full and fewer than max threads exist, create one; if the queue is full and max threads are busy, **reject**. Built-in policies: \`AbortPolicy\` (throw, the default), \`CallerRunsPolicy\` (run on the submitting thread, which applies back-pressure), \`DiscardPolicy\` and \`DiscardOldestPolicy\`.
Sizing: for CPU-bound tasks use roughly the number of cores; for I/O-bound tasks the classic formula is cores times (1 + wait time / compute time), so a service that waits 90 ms per 10 ms of CPU could use about 10 times the cores. With Java 21 virtual threads, I/O-bound pools largely disappear altogether.
Shutdown correctly: \`shutdown()\` stops accepting new tasks and lets queued tasks finish; \`shutdownNow()\` interrupts workers and returns the unstarted tasks; \`awaitTermination(timeout)\` waits. Since Java 19, \`ExecutorService\` implements \`AutoCloseable\` and \`close()\` calls \`shutdown()\` then waits, so try-with-resources is the cleanest pattern. Forgetting shutdown is why many Java programs "hang" at the end of \`main\`: the non-daemon worker threads keep the JVM alive.`,
      codeSnippet: `// ThreadPoolDemo.java
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

public class ThreadPoolDemo {
    public static void main(String[] args) throws Exception {
        // Named threads make logs and thread dumps readable
        ThreadFactory factory = new ThreadFactory() {
            private final AtomicInteger n = new AtomicInteger();
            @Override public Thread newThread(Runnable r) {
                Thread t = new Thread(r, "order-worker-" + n.incrementAndGet());
                t.setDaemon(false);
                return t;
            }
        };

        ThreadPoolExecutor pool = new ThreadPoolExecutor(
                4,                              // corePoolSize
                8,                              // maximumPoolSize
                30, TimeUnit.SECONDS,           // keepAlive for threads above core
                new ArrayBlockingQueue<>(100),  // bounded queue: back-pressure, no OOM
                factory,
                new ThreadPoolExecutor.CallerRunsPolicy()); // slow the caller instead of dropping

        List<Future<String>> results = new ArrayList<>();
        for (int i = 1; i <= 10; i++) {
            final int orderId = 1000 + i;
            results.add(pool.submit(() -> {
                Thread.sleep(200);                 // simulate payment gateway call
                return "order " + orderId + " processed by "
                        + Thread.currentThread().getName();
            }));
        }
        for (Future<String> f : results) System.out.println(f.get());

        System.out.println("largest pool size reached: " + pool.getLargestPoolSize());
        System.out.println("completed tasks: " + pool.getCompletedTaskCount());

        // Scheduled work: run every 5 s after an initial 1 s delay
        ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
        ScheduledFuture<?> job = scheduler.scheduleAtFixedRate(
                () -> System.out.println("refreshing exchange rates..."), 1, 5, TimeUnit.SECONDS);
        Thread.sleep(1500);
        job.cancel(false);

        pool.shutdown();
        pool.awaitTermination(5, TimeUnit.SECONDS);
        scheduler.shutdownNow();
        System.out.println("all pools shut down");
    }
}
/* Sample output (worker names vary):
order 1001 processed by order-worker-1
order 1002 processed by order-worker-2
...
order 1010 processed by order-worker-2
largest pool size reached: 4
completed tasks: 10
refreshing exchange rates...
all pools shut down
*/`
    },
    {
      heading: "8. Future and CompletableFuture in Java: Asynchronous Pipelines",
      content: `A \`Future<V>\` (Java 5) is a handle to a result that may not exist yet. \`get()\` blocks until the task finishes (use \`get(timeout, unit)\` to avoid waiting forever), \`isDone()\` polls, and \`cancel(mayInterrupt)\` tries to stop it. The limitation is that a plain \`Future\` is **passive**: you cannot attach a callback, chain a second step, or combine two futures without blocking a thread on \`get()\`.
**CompletableFuture<T>** (Java 8) implements both \`Future\` and \`CompletionStage\` and turns asynchronous work into a **pipeline**, much like Promises in JavaScript:
• **Start:** \`supplyAsync(supplier)\` (returns a value) or \`runAsync(runnable)\`. Without an executor argument they run on the common \`ForkJoinPool\`, which is sized to cores minus one and is shared with parallel streams; for I/O work **always pass your own executor** so blocking calls do not starve the common pool.
• **Transform:** \`thenApply(fn)\` maps the result; \`thenAccept(consumer)\` consumes it; \`thenRun(runnable)\` ignores it.
• **Chain dependent async calls:** \`thenCompose(fn)\` where \`fn\` returns another \`CompletableFuture\` (flatMap). Using \`thenApply\` here gives you a nested \`CompletableFuture<CompletableFuture<T>>\`, a classic mistake.
• **Combine independent calls:** \`thenCombine(other, biFn)\` waits for both; \`allOf(cf1, cf2, ...)\` waits for all (returns \`CompletableFuture<Void>\`, so you read each result afterwards with \`join()\`); \`anyOf(...)\` completes with the first.
• **Handle errors:** \`exceptionally(fn)\` provides a fallback; \`handle((result, ex) -> ...)\` sees both; \`whenComplete\` observes without changing the result. Exceptions in a stage are wrapped in \`CompletionException\` when read via \`join()\` and in \`ExecutionException\` via \`get()\`.
• **Timeouts (Java 9):** \`orTimeout(2, SECONDS)\` fails with \`TimeoutException\`; \`completeOnTimeout(default, 2, SECONDS)\` substitutes a default value. Before Java 9 people wrote their own scheduler-based timeouts.
• The \`...Async\` variants (\`thenApplyAsync\`) run the next stage on a pool thread rather than on whichever thread completed the previous stage.
A realistic use: a product page needs price, stock and reviews from three microservices that take 80 ms, 60 ms and 120 ms. Sequential calls take 260 ms; three parallel \`supplyAsync\` calls combined with \`allOf\` take about 120 ms. That is the kind of latency win interviewers want you to explain.
**When not to use it.** Deep \`CompletableFuture\` chains are hard to read, debug and profile (stack traces lose context). With Java 21 virtual threads, plain blocking code in a \`newVirtualThreadPerTaskExecutor\` is usually simpler and just as scalable. Use \`CompletableFuture\` when you need composition semantics such as "first of three responses wins" or callbacks into non-blocking frameworks.`,
      codeSnippet: `// ProductPageAggregator.java
import java.util.concurrent.*;

public class ProductPageAggregator {
    record Price(long paise) {}
    record Stock(int units) {}
    record Reviews(double rating, int count) {}
    record ProductView(Price price, Stock stock, Reviews reviews) {}

    static <T> T slowCall(String name, long ms, T value) {
        try { Thread.sleep(ms); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        System.out.println(name + " answered on " + Thread.currentThread().getName());
        return value;
    }

    public static void main(String[] args) {
        ExecutorService io = Executors.newFixedThreadPool(8);   // never the common pool for I/O
        long start = System.currentTimeMillis();

        CompletableFuture<Price> price =
                CompletableFuture.supplyAsync(() -> slowCall("pricing", 80, new Price(49_900)), io);
        CompletableFuture<Stock> stock =
                CompletableFuture.supplyAsync(() -> slowCall("inventory", 60, new Stock(12)), io);
        CompletableFuture<Reviews> reviews =
                CompletableFuture.supplyAsync(() -> slowCall("reviews", 120, new Reviews(4.3, 812)), io)
                        .orTimeout(500, TimeUnit.MILLISECONDS)              // Java 9+
                        .exceptionally(ex -> new Reviews(0.0, 0));         // fallback if reviews is down

        CompletableFuture<ProductView> page = price
                .thenCombine(stock, (p, s) -> new ProductView(p, s, null))
                .thenCombine(reviews, (pv, r) -> new ProductView(pv.price(), pv.stock(), r));

        // thenCompose: the second call depends on the first result
        CompletableFuture<String> deliveryEta = stock.thenCompose(s ->
                CompletableFuture.supplyAsync(
                        () -> slowCall("logistics", 50, s.units() > 0 ? "Tomorrow, Bengaluru" : "Out of stock"), io));

        ProductView view = page.join();                 // blocks here only once
        System.out.println(view);
        System.out.println("ETA: " + deliveryEta.join());
        System.out.println("total time ~ " + (System.currentTimeMillis() - start) + " ms");
        io.shutdown();
    }
}
/* Sample output:
inventory answered on pool-1-thread-2
pricing answered on pool-1-thread-1
logistics answered on pool-1-thread-4
reviews answered on pool-1-thread-3
ProductView[price=Price[paise=49900], stock=Stock[units=12], reviews=Reviews[rating=4.3, count=812]]
ETA: Tomorrow, Bengaluru
total time ~ 128 ms      <- not 310 ms
*/`
    },
    {
      heading: "9. Concurrent Collections in Java: ConcurrentHashMap, CopyOnWriteArrayList and BlockingQueue",
      content: `\`ArrayList\` and \`HashMap\` are **not thread-safe**: concurrent writes can lose data, throw \`ConcurrentModificationException\`, or (in old \`HashMap\` versions) even create an infinite loop during resize. The old fix, \`Collections.synchronizedMap(map)\` or \`Hashtable\`, wraps every method in one lock, so all threads queue behind each other. The \`java.util.concurrent\` package provides collections designed for concurrency.
**ConcurrentHashMap** is the workhorse. Reads never lock; writes lock only the single bucket (bin) being modified, so 32 threads can update 32 different keys in parallel. Important details: it **does not allow null keys or values**; \`size()\` and \`isEmpty()\` are estimates under concurrent modification; iterators are **weakly consistent** (they never throw \`ConcurrentModificationException\` and may or may not reflect updates made during iteration). The atomic compound operations are what make it powerful: \`putIfAbsent\`, \`computeIfAbsent(key, fn)\` (lazy cache population, the function runs at most once per key), \`compute\`, \`merge(key, 1, Integer::sum)\` (word counts and metrics), and bulk operations \`forEach\`, \`reduce\`, \`search\` with a parallelism threshold. Never do \`if (!map.containsKey(k)) map.put(k, v)\`; that check-then-act is a race even on a concurrent map.
**CopyOnWriteArrayList / CopyOnWriteArraySet** copy the entire underlying array on every write. That sounds wasteful, and it is for write-heavy use, but it makes reads completely lock-free and iteration safe from a snapshot. Perfect for listener lists, subscriber registries and configuration that is read millions of times and changed a few times per day.
**BlockingQueue** is the backbone of **producer-consumer** designs. \`put()\` blocks when the queue is full and \`take()\` blocks when it is empty, so producers and consumers coordinate without any explicit \`wait/notify\`. Implementations: \`ArrayBlockingQueue\` (bounded, array-backed), \`LinkedBlockingQueue\` (optionally bounded), \`PriorityBlockingQueue\` (ordered by comparator, unbounded), \`DelayQueue\` (elements become available after a delay, good for retry scheduling), \`SynchronousQueue\` (no capacity; each put waits for a take, used by cached thread pools). \`offer(e, timeout)\` and \`poll(timeout)\` give timed variants. Always prefer a **bounded** queue in servers; an unbounded queue just converts overload into an eventual \`OutOfMemoryError\`.
Other members worth knowing: \`ConcurrentLinkedQueue\` and \`ConcurrentLinkedDeque\` (non-blocking, lock-free), \`ConcurrentSkipListMap\` / \`ConcurrentSkipListSet\` (sorted concurrent map/set, the concurrent counterpart of \`TreeMap\`), and \`LinkedTransferQueue\`.
Synchronizers that usually travel with these collections: \`CountDownLatch\` (one-shot "wait until N events happen"), \`CyclicBarrier\` (N threads wait for each other, reusable), \`Semaphore\` (limit concurrent access to a resource, for example at most 10 simultaneous calls to a rate-limited payment API) and \`Phaser\` (a flexible multi-phase barrier).`,
      codeSnippet: `// ProducerConsumerDemo.java
import java.util.*;
import java.util.concurrent.*;

public class ProducerConsumerDemo {
    record Order(int id, String city, long amountPaise) {}

    public static void main(String[] args) throws Exception {
        BlockingQueue<Order> queue = new ArrayBlockingQueue<>(5);   // bounded: back-pressure
        ConcurrentHashMap<String, Long> revenueByCity = new ConcurrentHashMap<>();
        CopyOnWriteArrayList<String> auditLog = new CopyOnWriteArrayList<>();
        Semaphore paymentGatewaySlots = new Semaphore(2);           // max 2 concurrent gateway calls
        CountDownLatch consumersDone = new CountDownLatch(3);
        Order POISON = new Order(-1, "", 0);                         // shutdown signal

        Thread producer = new Thread(() -> {
            String[] cities = {"Mumbai", "Delhi", "Pune", "Chennai"};
            try {
                for (int i = 1; i <= 20; i++) {
                    queue.put(new Order(i, cities[i % 4], 10_000L * (i % 5 + 1))); // blocks if full
                }
                for (int c = 0; c < 3; c++) queue.put(POISON);   // one per consumer
            } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        }, "producer");

        Runnable consumer = () -> {
            try {
                while (true) {
                    Order o = queue.take();                        // blocks if empty
                    if (o == POISON) break;
                    paymentGatewaySlots.acquire();                 // throttle
                    try { Thread.sleep(20); } finally { paymentGatewaySlots.release(); }
                    revenueByCity.merge(o.city(), o.amountPaise(), Long::sum);   // atomic
                    auditLog.add(Thread.currentThread().getName() + " handled order " + o.id());
                }
            } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
            finally { consumersDone.countDown(); }
        };

        producer.start();
        for (int i = 1; i <= 3; i++) new Thread(consumer, "consumer-" + i).start();

        consumersDone.await();                                     // wait for all 3
        System.out.println("revenue by city (paise): " + new TreeMap<>(revenueByCity));
        System.out.println("audit entries: " + auditLog.size());

        // computeIfAbsent as a thread-safe lazy cache
        ConcurrentHashMap<Integer, String> pinCache = new ConcurrentHashMap<>();
        String city = pinCache.computeIfAbsent(560001, pin -> "Bengaluru (looked up once)");
        System.out.println(city);
    }
}
/* Output:
revenue by city (paise): {Chennai=150000, Delhi=150000, Mumbai=150000, Pune=150000}
audit entries: 20
Bengaluru (looked up once)
*/`
    },
    {
      heading: "10. Deadlocks, Livelocks and Starvation in Java: Detection and Prevention",
      content: `A **deadlock** is a cycle of threads each waiting for a lock held by the next. Thread A holds lock 1 and wants lock 2; thread B holds lock 2 and wants lock 1. Neither can proceed, forever. The four **Coffman conditions** must all hold for a deadlock: mutual exclusion (locks are exclusive), hold-and-wait (a thread holds one lock while waiting for another), no preemption (locks cannot be forcibly taken), and circular wait. Break any one condition and deadlock becomes impossible.
The classic Java example is a money transfer: \`transfer(from, to)\` locks \`from\` then \`to\`. If one thread transfers Ravi to Priya while another transfers Priya to Ravi, the locks are taken in opposite orders and the server hangs. Symptoms in production: CPU drops to near zero, request latency climbs to the timeout, thread pool threads are all BLOCKED.
**Detection.** Take a thread dump with \`jstack <pid>\` or \`jcmd <pid> Thread.print\`. The JVM detects monitor and \`ReentrantLock\` cycles and prints "Found one Java-level deadlock" with the exact stack traces. Programmatically, \`ThreadMXBean.findDeadlockedThreads()\` returns the thread IDs, which you can expose through a health check. Tools like VisualVM, JFR (Java Flight Recorder) and IntelliJ's debugger show the same.
**Prevention strategies, in order of preference:**
• **Lock ordering** — always acquire locks in a globally consistent order, for example by account ID or \`System.identityHashCode\`. This breaks circular wait and is the standard fix for the transfer problem.
• **Lock timeouts** — use \`tryLock(timeout)\` and back off (release everything, wait a random interval, retry). This breaks hold-and-wait.
• **Avoid nested locks** — hold one lock at a time; copy what you need out of the first critical section before entering the second.
• **Use higher-level tools** — \`ConcurrentHashMap.compute\`, atomics, \`BlockingQueue\`, immutable messages. No explicit locks, no deadlock.
• **Never call unknown code while holding a lock** — listeners, callbacks or user-supplied lambdas may take their own locks (an "open call" problem).
**Livelock** is deadlock's polite cousin: threads keep responding to each other and backing off, like two people in a corridor stepping the same way repeatedly. Each thread is RUNNABLE but no progress happens. The fix is randomised back-off, which is why \`tryLock\` retries should sleep for a random duration.
**Starvation** means a thread never gets CPU or a lock because others keep winning: a low-priority thread, a writer on a non-fair \`ReadWriteLock\` with constant readers, or a task behind an endless stream of higher-priority tasks in a \`PriorityBlockingQueue\`. Fair locks and bounded wait times are the usual remedies.`,
      codeSnippet: `// DeadlockDemo.java  — shows the bug, then the lock-ordering fix
import java.util.concurrent.*;

public class DeadlockDemo {
    static class Account {
        final int id; long balancePaise;
        Account(int id, long balance) { this.id = id; this.balancePaise = balance; }
    }

    // BUGGY: lock order depends on argument order -> circular wait possible
    static void transferBuggy(Account from, Account to, long paise) {
        synchronized (from) {
            try { Thread.sleep(50); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
            synchronized (to) {
                from.balancePaise -= paise;
                to.balancePaise += paise;
            }
        }
    }

    // FIXED: always lock the lower id first -> no circular wait
    static void transferSafe(Account from, Account to, long paise) {
        Account first  = from.id < to.id ? from : to;
        Account second = from.id < to.id ? to : from;
        synchronized (first) {
            synchronized (second) {
                from.balancePaise -= paise;
                to.balancePaise += paise;
            }
        }
    }

    public static void main(String[] args) throws Exception {
        Account ravi = new Account(1, 100_000), priya = new Account(2, 100_000);

        // Run the SAFE version concurrently in both directions, 1000 times each
        try (ExecutorService pool = Executors.newFixedThreadPool(2)) {
            pool.submit(() -> { for (int i = 0; i < 1000; i++) transferSafe(ravi, priya, 100); });
            pool.submit(() -> { for (int i = 0; i < 1000; i++) transferSafe(priya, ravi, 100); });
        }
        System.out.println("safe transfers done: ravi=" + ravi.balancePaise + " priya=" + priya.balancePaise);

        // Uncomment to see a real deadlock (program hangs; jstack shows the cycle):
        // Thread a = new Thread(() -> transferBuggy(ravi, priya, 100));
        // Thread b = new Thread(() -> transferBuggy(priya, ravi, 100));
        // a.start(); b.start(); a.join(); b.join();

        // Programmatic detection you can expose via a health endpoint
        var mx = java.lang.management.ManagementFactory.getThreadMXBean();
        long[] deadlocked = mx.findDeadlockedThreads();
        System.out.println("deadlocked threads: " + (deadlocked == null ? "none" : deadlocked.length));
    }
}
/* Output:
safe transfers done: ravi=100000 priya=100000
deadlocked threads: none
*/`
    },
    {
      heading: "11. Virtual Threads in Java 21: What They Are and When to Use Them",
      content: `**Virtual threads** are the biggest change to Java concurrency since Java 5. They were previewed in Java 19 (JEP 425) and Java 20 (JEP 436) and became **final in Java 21** (JEP 444, September 2023). Java 24 (JEP 491) removed their main remaining limitation, and they are fully production-ready in Java 25 LTS.
**The problem they solve.** A traditional **platform thread** is a thin wrapper over an OS thread. OS threads are expensive (about 1 MB reserved stack, slow context switches, limited to a few thousand per machine). So servers use pools of, say, 200 threads, and when every thread is blocked waiting for a database or an HTTP call, the server is "full" even though the CPU is idle. The workaround was reactive programming (WebFlux, RxJava), which scales but makes code hard to write and debug.
**How virtual threads work.** A virtual thread is a Java object scheduled by the JVM, not the OS. The JVM runs virtual threads on a small pool of **carrier threads** (a \`ForkJoinPool\`, one carrier per core by default). When a virtual thread blocks on I/O, \`sleep\`, a lock or a \`BlockingQueue\`, the JVM **unmounts** it from the carrier, stores its tiny stack on the heap, and mounts another virtual thread. When the I/O completes, it is mounted again. Blocking becomes nearly free. One JVM can comfortably run a million virtual threads doing I/O.
**API (all Java 21 final):**
• \`Thread.ofVirtual().start(runnable)\` or \`Thread.startVirtualThread(runnable)\`.
• \`Executors.newVirtualThreadPerTaskExecutor()\` — the normal way: one virtual thread per task, no pooling. Submit a Callable, get a Future, exactly like before.
• \`Thread.ofVirtual().name("req-", 0).factory()\` — a \`ThreadFactory\` for frameworks.
• \`thread.isVirtual()\` to check. Virtual threads are always daemon threads and have no meaningful priority.
**When to use them.** I/O-bound workloads with many concurrent tasks: web request handling, calling microservices, JDBC queries, message consumers. Spring Boot 3.2+ enables them for Tomcat and \`@Async\` with a single property, \`spring.threads.virtual.enabled=true\` (Spring Boot 4 keeps the same switch). Helidon, Quarkus and Jetty support them too.
**When not to use them.** CPU-bound work (image encoding, big sorts) gains nothing; there are still only as many cores. Do not **pool** virtual threads; they are meant to be created per task and thrown away. \`ThreadLocal\` still works but with a million threads it can hold a lot of memory, which is why Scoped Values (section 12) exist. And be careful with **pinning**: before Java 24, a virtual thread blocking inside a \`synchronized\` block stayed pinned to its carrier, reducing scalability; JEP 491 in Java 24 fixed this, so on Java 24 and 25 \`synchronized\` is fine. Pinning still occurs when a virtual thread blocks inside a native method (JNI or FFM) or during class initialisation. The diagnostic flag \`-Djdk.tracePinnedThreads\` was removed in Java 24; use JFR's \`jdk.VirtualThreadPinned\` event instead.
**Benchmark intuition:** 10,000 tasks that each sleep 1 second. A fixed pool of 200 platform threads needs about 50 seconds. 10,000 virtual threads finish in about 1 second with a few MB of memory. That demo is in the snippet; run it on Java 21+.`,
      codeSnippet: `// VirtualThreadsDemo.java  — Java 21+
import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.IntStream;

public class VirtualThreadsDemo {
    static int simulateIoCall(int id) {
        try { Thread.sleep(1000); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        return id * 2;
    }

    static long runWith(ExecutorService executor, int tasks) throws Exception {
        Instant start = Instant.now();
        try (executor) {
            List<Future<Integer>> futures = new ArrayList<>();
            for (int i = 0; i < tasks; i++) {
                final int id = i;
                futures.add(executor.submit(() -> simulateIoCall(id)));
            }
            long sum = 0;
            for (Future<Integer> f : futures) sum += f.get();
            System.out.println("checksum " + sum);
        }
        return Duration.between(start, Instant.now()).toMillis();
    }

    public static void main(String[] args) throws Exception {
        int tasks = 10_000;

        long platformMs = runWith(Executors.newFixedThreadPool(200), tasks);
        System.out.println("200 platform threads: " + platformMs + " ms");

        long virtualMs = runWith(Executors.newVirtualThreadPerTaskExecutor(), tasks);
        System.out.println("virtual threads:      " + virtualMs + " ms");

        // Creating one directly
        Thread vt = Thread.ofVirtual().name("hello-virtual").start(() ->
                System.out.println(Thread.currentThread() + " isVirtual=" + Thread.currentThread().isVirtual()));
        vt.join();

        // A ThreadFactory for frameworks that still want one
        ThreadFactory factory = Thread.ofVirtual().name("req-", 0).factory();
        Thread t = factory.newThread(() -> System.out.println("named: " + Thread.currentThread().getName()));
        t.start(); t.join();
    }
}
/* Typical output on an 8-core laptop:
checksum 99990000
200 platform threads: 50231 ms
checksum 99990000
virtual threads:      1087 ms
VirtualThread[#1234,hello-virtual]/runnable@ForkJoinPool-1-worker-3 isVirtual=true
named: req-0
*/`
    },
    {
      heading: "12. Structured Concurrency (Preview in Java 25) and Scoped Values (Final in Java 25)",
      content: `Virtual threads make it cheap to fork many subtasks, but \`ExecutorService\` gives them no shared lifetime: if one subtask fails, the others keep running; if the parent is cancelled, the children leak; thread dumps show no parent-child relationship. **Structured concurrency** applies the "a task and its subtasks form a unit" principle, like a try-with-resources block for threads.
**Status check (verify against the JEP before relying on it):** Structured Concurrency is **JEP 505, a fifth preview in Java 25**. It is **not final**. Its API changed significantly between the Java 21 preview (JEP 453, \`ShutdownOnFailure\` subclasses) and the Java 25 preview (\`StructuredTaskScope.open()\` with \`Joiner\` strategies). Using it requires \`--enable-preview\` at compile time and run time, and the API may still change in later releases. Do not ship it in production code that must survive JDK upgrades without edits.
The Java 25 shape: \`try (var scope = StructuredTaskScope.open())\` opens a scope; \`scope.fork(callable)\` starts a subtask on a new virtual thread and returns a \`Subtask<T>\`; \`scope.join()\` waits for the joiner's policy to be satisfied; then \`subtask.get()\` reads results. The default joiner fails fast: if any subtask throws, the others are cancelled and \`join()\` throws. \`StructuredTaskScope.open(Joiner.anySuccessfulResultOrThrow())\` returns the first successful result (useful for calling two replicas and taking the faster), and \`Joiner.allSuccessfulOrThrow()\` returns a stream of all subtasks. Leaving the try block always closes the scope and guarantees no subtask outlives it.
**Scoped Values** solve a different problem: passing context (current user, request ID, tenant) down a call chain without method parameters. Historically this was \`ThreadLocal\`, which is mutable, lives for the whole thread lifetime (a memory leak risk in pools), is expensive to inherit into child threads, and is awkward with a million virtual threads. **\`ScopedValue\` is final in Java 25 (JEP 506)** after an incubator in Java 20 and previews in Java 21 to 24. A scoped value is **immutable**, bound only for the dynamic extent of a \`ScopedValue.where(KEY, value).run(...)\` or \`.call(...)\` block, automatically inherited by subtasks forked inside a \`StructuredTaskScope\`, and automatically unbound when the block exits. Read it with \`KEY.get()\` (throws \`NoSuchElementException\` if unbound), check with \`KEY.isBound()\`, or use \`KEY.orElse(default)\`. Spring Framework 7 and Spring Boot 4 are adopting scoped values for request context on virtual threads, so expect to meet them in 2026 codebases.
The snippet below shows both. The scoped value part compiles on standard Java 25; the structured concurrency part requires the preview flag and may need adjustment on later JDKs.`,
      codeSnippet: `// StructuredConcurrencyDemo.java
// Compile: javac --enable-preview --release 25 StructuredConcurrencyDemo.java
// Run:     java  --enable-preview StructuredConcurrencyDemo
// ScopedValue (JEP 506) is FINAL in Java 25; StructuredTaskScope (JEP 505) is PREVIEW in Java 25.
import java.util.concurrent.StructuredTaskScope;
import java.util.concurrent.StructuredTaskScope.Subtask;

public class StructuredConcurrencyDemo {
    record User(String id, String city) {}
    record Weather(String summary) {}
    record Offers(int count) {}
    record Dashboard(User user, Weather weather, Offers offers) {}

    // Immutable per-request context, bound for a dynamic scope (no ThreadLocal)
    static final ScopedValue<String> REQUEST_ID = ScopedValue.newInstance();

    static User fetchUser(String id) throws InterruptedException {
        Thread.sleep(80);
        log("fetched user");
        return new User(id, "Hyderabad");
    }
    static Weather fetchWeather(String city) throws InterruptedException {
        Thread.sleep(120);
        log("fetched weather for " + city);
        return new Weather("31 C, humid");
    }
    static Offers fetchOffers(String userId) throws InterruptedException {
        Thread.sleep(60);
        log("fetched offers");
        return new Offers(3);
    }
    static void log(String msg) {
        // REQUEST_ID is visible here even inside forked subtasks
        System.out.println("[" + REQUEST_ID.orElse("no-request") + "] " + msg);
    }

    static Dashboard buildDashboard(String userId) throws Exception {
        try (var scope = StructuredTaskScope.open()) {          // default joiner: fail fast
            Subtask<User> user = scope.fork(() -> fetchUser(userId));
            Subtask<Offers> offers = scope.fork(() -> fetchOffers(userId));
            scope.join();                                        // waits; throws if any subtask failed
            // weather depends on the user's city, so fork it after the first join
            try (var scope2 = StructuredTaskScope.open()) {
                Subtask<Weather> weather = scope2.fork(() -> fetchWeather(user.get().city()));
                scope2.join();
                return new Dashboard(user.get(), weather.get(), offers.get());
            }
        }   // leaving the block guarantees no subtask is still running
    }

    public static void main(String[] args) throws Exception {
        Dashboard d = ScopedValue.where(REQUEST_ID, "req-7f3a")
                                 .call(() -> buildDashboard("U-1001"));
        System.out.println(d);
        System.out.println("bound outside the scope? " + REQUEST_ID.isBound());
    }
}
/* Output:
[req-7f3a] fetched offers
[req-7f3a] fetched user
[req-7f3a] fetched weather for Hyderabad
Dashboard[user=User[id=U-1001, city=Hyderabad], weather=Weather[summary=31 C, humid], offers=Offers[count=3]]
bound outside the scope? false
*/`
    },
    {
      heading: "13. Real-World Use Cases: How Java Concurrency Is Used in Production",
      content: `• **Web request handling (Spring Boot, Tomcat).** Every HTTP request runs on a thread from Tomcat's pool (default maximum 200). With \`spring.threads.virtual.enabled=true\` on Java 21+, each request gets a virtual thread, so a service that calls three downstream APIs no longer runs out of threads at 200 concurrent users. Controller code stays plain and blocking. The same flag applies to \`@Async\` and \`@Scheduled\` executors.
• **Payment and order processing.** A UPI or card payment flow must debit, call the gateway, and record the ledger entry. Teams use bounded \`ThreadPoolExecutor\` instances per concern (one for gateway calls, one for notifications) so a slow gateway cannot starve notification delivery. \`Semaphore\` enforces the gateway's rate limit, \`CompletableFuture.orTimeout\` enforces an SLA, and idempotency keys in a \`ConcurrentHashMap\` or Redis guard against duplicate submissions.
• **Inventory and ticketing (flash sales, IRCTC-style booking).** Oversold stock is the classic race. In a single JVM, \`AtomicInteger.compareAndSet\` or \`ConcurrentHashMap.compute\` decrements stock atomically. Across many JVM instances the same idea moves to the database (\`UPDATE ... WHERE stock > 0\`, optimistic locking with a \`@Version\` column in Spring Data JPA) or Redis atomic operations. In-JVM locks never protect you across servers; this is a common misunderstanding in interviews.
• **Batch jobs and ETL.** Reading a 10 GB CSV and writing to a database: one producer thread reads chunks into a bounded \`BlockingQueue\`, a pool of consumers inserts batches, a \`CountDownLatch\` signals completion. Parallel streams (\`list.parallelStream()\`) are an option for pure CPU work but share the common \`ForkJoinPool\`; never block inside them.
• **Caching.** \`ConcurrentHashMap.computeIfAbsent\` is the simplest thread-safe memoisation. Libraries such as Caffeine build on the same ideas with eviction and async loading. \`CopyOnWriteArrayList\` holds listener and interceptor chains.
• **Background scheduling.** \`ScheduledExecutorService\` or Spring's \`@Scheduled\` refreshes exchange rates every minute, cleans expired sessions, and sends reminder SMS. Always catch exceptions inside a scheduled task; an uncaught exception silently cancels all future executions of a \`scheduleAtFixedRate\` task.
• **Messaging consumers (Kafka, RabbitMQ).** Each partition consumer runs on its own thread; records are handed to worker pools, and offsets are committed only after the batch completes. Ordering guarantees usually force a single thread per partition, so thread-safe design is about the shared state the consumers touch.
• **Observability.** Named thread factories, \`ThreadMXBean\` deadlock checks in \`/actuator/health\`, JFR recordings of \`jdk.VirtualThreadPinned\` and lock contention events, and regular thread dumps are what separate teams that fix incidents in 10 minutes from teams that restart the server and hope.`
    },
    {
      heading: "14. Common Mistakes with Java Concurrency and How to Fix Them",
      content: `**1. Calling run() instead of start().** \`thread.run()\` executes on the current thread; nothing is concurrent. Fix: call \`start()\`, or better, submit to an executor.
**2. Treating count++ or check-then-act as atomic.** \`if (!map.containsKey(k)) map.put(k, v)\` and \`balance = balance - amount\` are races. Fix: \`putIfAbsent\` / \`computeIfAbsent\`, atomics, or a lock around the whole compound operation.
**3. Using volatile for compound updates.** \`volatile int count; count++\` still loses updates. Fix: \`AtomicInteger\` or \`synchronized\`. Use \`volatile\` only for flags and single-writer publication.
**4. Synchronising on the wrong object.** Locking on \`this\` in one method and on a different object in another protects nothing. Locking on a \`String\` literal or a boxed \`Integer\` is worse: those objects are interned or cached and shared across the whole JVM. Fix: a dedicated \`private final Object lock = new Object()\` or a single consistent lock.
**5. Forgetting unlock() in finally.** One exception path and the \`ReentrantLock\` is held forever. Fix: \`lock(); try { ... } finally { unlock(); }\` every single time.
**6. Swallowing InterruptedException.** \`catch (InterruptedException e) {}\` makes cancellation impossible and thread pools cannot shut down. Fix: restore the flag with \`Thread.currentThread().interrupt()\` or propagate the exception.
**7. Unbounded queues and unbounded pools.** \`newFixedThreadPool\` has an unbounded queue; \`newCachedThreadPool\` has unbounded threads. Both turn overload into \`OutOfMemoryError\`. Fix: construct \`ThreadPoolExecutor\` with a bounded queue and a rejection policy, or use virtual threads with a \`Semaphore\` to cap in-flight work.
**8. Not shutting down executors.** The JVM never exits because worker threads are non-daemon. Fix: try-with-resources (Java 19+) or \`shutdown()\` plus \`awaitTermination\`.
**9. Blocking I/O in the common ForkJoinPool.** \`CompletableFuture.supplyAsync(() -> httpCall())\` without an executor starves parallel streams and every other user of the common pool. Fix: pass a dedicated executor, or on Java 21+ a virtual-thread executor.
**10. thenApply where thenCompose was needed.** Produces \`CompletableFuture<CompletableFuture<T>>\`. Fix: \`thenCompose\` for dependent async calls.
**11. Pooling virtual threads or using them for CPU-bound work.** Pooling defeats the purpose; CPU work does not get faster. Fix: one virtual thread per I/O task; keep a sized platform pool for CPU work.
**12. Expecting in-JVM locks to protect shared data across servers.** A \`synchronized\` block on one pod does nothing for the other five pods behind the load balancer. Fix: database constraints, optimistic locking, or distributed locks.
**13. Using double for money inside concurrent code.** Not a concurrency bug but amplified by it; rounding errors compound across threads. Fix: \`long\` paise or \`BigDecimal\`.
**14. Relying on thread priorities or Thread.yield() for correctness.** Both are hints the OS may ignore. Fix: design with proper synchronisation.`,
      codeSnippet: `// MistakesFixed.java  — before/after for the most common ones
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

public class MistakesFixed {
    // WRONG: compound check-then-act on a concurrent map (still a race)
    static void registerWrong(ConcurrentHashMap<String, Integer> seen, String user) {
        if (!seen.containsKey(user)) seen.put(user, 1); else seen.put(user, seen.get(user) + 1);
    }
    // RIGHT: one atomic compound operation
    static void registerRight(ConcurrentHashMap<String, Integer> seen, String user) {
        seen.merge(user, 1, Integer::sum);
    }

    // WRONG: volatile does not make ++ atomic
    static volatile int hitsWrong = 0;
    // RIGHT
    static final AtomicInteger hitsRight = new AtomicInteger();

    // WRONG: locking on a String literal shared JVM-wide
    static void lockOnLiteralWrong() { synchronized ("LOCK") { /* ... */ } }
    // RIGHT: a private lock object
    private static final Object LOCK = new Object();
    static void lockOnObjectRight()  { synchronized (LOCK)   { /* ... */ } }

    public static void main(String[] args) throws Exception {
        ConcurrentHashMap<String, Integer> seen = new ConcurrentHashMap<>();
        try (ExecutorService pool = Executors.newVirtualThreadPerTaskExecutor()) {   // Java 21+
            for (int i = 0; i < 1000; i++) {
                pool.submit(() -> {
                    registerRight(seen, "ravi");
                    hitsRight.incrementAndGet();
                    hitsWrong++;                        // demonstrates the bug
                    try { Thread.sleep(1); } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();   // RIGHT: restore the flag
                    }
                });
            }
        }
        System.out.println("merge count = " + seen.get("ravi"));      // 1000
        System.out.println("atomic hits = " + hitsRight.get());       // 1000
        System.out.println("volatile++  = " + hitsWrong + " (often < 1000)");
    }
}`
    },
    {
      heading: "15. Frequently Asked Questions about Java Concurrency and Multithreading",
      content: `**What is the difference between a process and a thread in Java?**
A process is a running program with its own memory space; the JVM is a process. A thread is a lightweight path of execution inside a process that shares the heap with other threads but has its own stack and program counter. Threads are cheaper to create and communicate through shared memory, which is both their advantage and the source of race conditions.
**What is the difference between Runnable and Callable in Java?**
\`Runnable.run()\` returns nothing and cannot throw checked exceptions; it works with \`Thread\` and executors. \`Callable.call()\` returns a value and may throw checked exceptions; it can only be submitted to an \`ExecutorService\`, which returns a \`Future\` for the result. Use Callable whenever the task produces a result.
**What is the difference between synchronized and volatile in Java?**
\`synchronized\` provides mutual exclusion (only one thread in the block) plus memory visibility, so compound operations like \`count++\` become atomic. \`volatile\` provides only visibility and ordering of a single variable; reads and writes go to main memory but a read-modify-write is still a race. Use volatile for flags and single-writer publication, synchronized or atomics for updates that depend on the previous value.
**What is a race condition and how do you prevent it in Java?**
A race condition is a bug where the result depends on the timing of threads, typically when two threads read-modify-write shared data. Prevent it by making shared data immutable, confining it to one thread, or protecting every access with the same lock, an atomic class or a concurrent collection's atomic methods such as \`merge\` and \`computeIfAbsent\`.
**What is a deadlock in Java and how do you avoid it?**
A deadlock is a cycle of threads each waiting for a lock held by another, so none can proceed. Avoid it by acquiring locks in a consistent global order, using \`tryLock\` with timeouts, holding one lock at a time, and preferring high-level tools like \`ConcurrentHashMap\` and \`BlockingQueue\`. Detect it with \`jstack\` or \`ThreadMXBean.findDeadlockedThreads()\`.
**What are virtual threads in Java 21 and when should I use them?**
Virtual threads (JEP 444, final in Java 21) are lightweight threads scheduled by the JVM on a small pool of carrier threads; blocking on I/O unmounts them, so millions can exist at once. Use them for I/O-bound work with high concurrency, such as web requests and microservice calls, via \`Executors.newVirtualThreadPerTaskExecutor()\`. They do not speed up CPU-bound work and should not be pooled.
**What is the difference between ExecutorService submit and execute?**
\`execute(Runnable)\` comes from \`Executor\`, returns nothing, and an uncaught exception goes to the thread's uncaught exception handler. \`submit(Runnable or Callable)\` returns a \`Future\`; any exception is captured inside the Future and rethrown as \`ExecutionException\` when you call \`get()\`. If you forget to call \`get()\`, submit silently hides failures, so log or inspect the Future.
**Is structured concurrency final in Java 25?**
No. Structured concurrency (\`StructuredTaskScope\`) is JEP 505, a fifth preview in Java 25, and requires \`--enable-preview\`. Scoped Values (JEP 506) are final in Java 25. Check the JEP pages for the status in newer releases before using either in production.`
    },
    {
      heading: "16. Interview Questions and Answers on Java Concurrency and Multithreading",
      content: `**Q1. Explain the Java thread lifecycle.**
A thread is NEW after construction, RUNNABLE after \`start()\` (either running or waiting for a CPU), BLOCKED while waiting to enter a synchronized block held by another thread, WAITING after \`wait()\`, \`join()\` or \`park()\` with no timeout, TIMED_WAITING after \`sleep(ms)\`, \`wait(ms)\` or \`join(ms)\`, and TERMINATED when \`run()\` ends. A terminated thread cannot be restarted.
**Q2. What is the difference between wait() and sleep()?**
\`wait()\` is an \`Object\` method, must be called while holding the object's monitor, releases that monitor, and wakes on \`notify()\`/\`notifyAll()\` or timeout. \`sleep()\` is a static \`Thread\` method, does not need or release any lock, and wakes after the time elapses or on interrupt. Both throw \`InterruptedException\`.
**Q3. What does the Java Memory Model guarantee, and what is happens-before?**
The JMM defines when writes by one thread become visible to another. Happens-before is the ordering guarantee: unlock happens-before a later lock of the same monitor, a volatile write happens-before a later volatile read of the same field, \`Thread.start()\` happens-before actions in the new thread, and a thread's actions happen-before \`join()\` on it returns. Without a happens-before edge, a reader may see stale or reordered values.
**Q4. Why is double-checked locking broken without volatile, and how is it fixed?**
Without \`volatile\`, the JIT may reorder "allocate object" and "assign reference" so another thread sees a non-null but partially constructed singleton. Declaring the field \`volatile\` forbids that reordering. Modern alternatives: the initialisation-on-demand holder idiom (a nested static class) or an \`enum\` singleton, both of which rely on class loading guarantees.
**Q5. ReentrantLock vs synchronized: when would you choose each?**
\`synchronized\` is simpler, cannot be forgotten in \`finally\`, and since Java 24 (JEP 491) does not pin virtual threads. \`ReentrantLock\` adds \`tryLock\` with timeout, interruptible waiting, fairness, multiple \`Condition\` objects and monitoring methods. Choose synchronized by default; choose ReentrantLock when you need any of those features, for example timed lock acquisition to avoid deadlock.
**Q6. How does ConcurrentHashMap achieve thread safety without locking the whole map?**
Reads are lock-free using volatile semantics. Writes lock only the bin (bucket) being modified, using CAS to insert into empty bins and synchronized on the bin head otherwise, so different keys update in parallel. Size is maintained with a striped counter similar to \`LongAdder\`. It forbids null keys and values and offers atomic compound operations like \`compute\` and \`merge\`.
**Q7. Explain how ThreadPoolExecutor decides to create threads, queue tasks or reject.**
On submit: if running threads are fewer than \`corePoolSize\`, a new thread is created even if others are idle. Otherwise the task is queued. If the queue is full and threads are fewer than \`maximumPoolSize\`, a new thread is created. If the queue is full and the maximum is reached, the \`RejectedExecutionHandler\` runs (abort, caller-runs, discard, discard-oldest). With an unbounded queue, \`maximumPoolSize\` is never used, which is why \`newFixedThreadPool\` never grows.
**Q8. What is the difference between CompletableFuture.thenApply and thenCompose?**
\`thenApply\` transforms the result with a plain function and returns \`CompletableFuture<R>\`. \`thenCompose\` takes a function that itself returns a \`CompletableFuture\` and flattens it, so dependent asynchronous calls chain without nesting. The relationship is the same as \`map\` versus \`flatMap\` on streams or \`Optional\`.
**Q9. How are virtual threads different from platform threads internally?**
A platform thread maps one-to-one to an OS thread with a fixed, large stack. A virtual thread is a heap object whose stack frames are copied to and from a carrier platform thread by the JVM scheduler (a ForkJoinPool). When it blocks on I/O or a lock, the JVM unmounts it and the carrier runs another virtual thread. This gives the scalability of asynchronous code with the simplicity of blocking code. Limitations: pinning on native frames, no benefit for CPU-bound work, and they should not be pooled.
**Q10. How would you make a flash-sale stock decrement safe in a Spring Boot service running on multiple instances?**
In-JVM tools like \`AtomicInteger\` only protect one instance. Across instances, use the database: a conditional update \`UPDATE product SET stock = stock - 1 WHERE id = ? AND stock > 0\` and check the affected row count, or Spring Data JPA optimistic locking with a \`@Version\` field and retry on \`OptimisticLockException\`. For extreme traffic, move the counter to Redis with an atomic \`DECR\` and reconcile with the database asynchronously.`
    },
    {
      heading: "17. Hands-On Exercise: A Flash-Sale Order Processor with Thread Pools, Atomics, Concurrent Collections and Virtual Threads",
      content: `Build a complete simulation of a flash sale: 500 customers try to buy from a stock of 100 units of a phone priced at ₹12,999. The program must never oversell, must process payments concurrently with a cap of 10 simultaneous gateway calls, must record every successful order, and must report per-city revenue and timing. Implement it twice, once with a sized platform thread pool and once with Java 21 virtual threads, and compare.
Concepts used, mapped to the sections above:
• \`AtomicInteger.compareAndSet\` loop to reserve stock without oversell (section 6).
• \`Semaphore\` to cap concurrent payment calls (section 9).
• \`ConcurrentHashMap.merge\` for revenue per city and \`ConcurrentLinkedQueue\` for the order log (section 9).
• \`ExecutorService\` with try-with-resources, \`Future\` results and \`CompletableFuture.allOf\` for the summary (sections 7 and 8).
• A \`ReentrantLock\` protecting a two-field invariant (total orders and total revenue must change together) (section 5).
• \`Executors.newVirtualThreadPerTaskExecutor()\` for the second run (section 11).
Save the file as \`FlashSaleSimulation.java\`, compile with \`javac FlashSaleSimulation.java\` on Java 21 or later, and run with \`java FlashSaleSimulation\`. Then extend it: add a \`DelayQueue\` that retries failed payments after 200 ms, add a \`ScheduledExecutorService\` that prints progress every 100 ms, and detect deadlocks with \`ThreadMXBean\` in a watchdog thread. Finally, try removing the \`compareAndSet\` loop and replacing it with \`if (stock.get() > 0) stock.decrementAndGet()\` to watch the oversell bug appear.`,
      codeSnippet: `// FlashSaleSimulation.java  — Java 21+ (uses virtual threads and records)
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.locks.ReentrantLock;

public class FlashSaleSimulation {

    record Customer(int id, String city) {}
    record Order(int orderId, Customer customer, long amountPaise) {}
    sealed interface Result permits Success, SoldOut, PaymentFailed {}
    record Success(Order order) implements Result {}
    record SoldOut(Customer customer) implements Result {}
    record PaymentFailed(Customer customer, String reason) implements Result {}

    static final long PRICE_PAISE = 12_999_00L;   // Rs 12,999.00

    /** All shared state of the sale lives here; every member is thread-safe. */
    static class Sale {
        final AtomicInteger stock;
        final AtomicInteger orderSeq = new AtomicInteger();
        final Semaphore gatewaySlots = new Semaphore(10);                     // max 10 concurrent payments
        final ConcurrentHashMap<String, Long> revenueByCity = new ConcurrentHashMap<>();
        final ConcurrentLinkedQueue<Order> orderLog = new ConcurrentLinkedQueue<>();
        final ReentrantLock totalsLock = new ReentrantLock();
        long totalOrders;            // guarded by totalsLock
        long totalRevenuePaise;      // guarded by totalsLock (two fields = one invariant)

        Sale(int units) { this.stock = new AtomicInteger(units); }

        /** CAS loop: reserve one unit only if stock > 0. Never oversells. */
        boolean reserveUnit() {
            while (true) {
                int current = stock.get();
                if (current <= 0) return false;
                if (stock.compareAndSet(current, current - 1)) return true;
                // another thread won the race; loop and re-read
            }
        }

        void releaseUnit() { stock.incrementAndGet(); }

        /** Simulated payment gateway: 30 to 60 ms latency, 5% failures. */
        boolean chargeCard(Customer c) throws InterruptedException {
            gatewaySlots.acquire();
            try {
                Thread.sleep(ThreadLocalRandom.current().nextInt(30, 61));
                return ThreadLocalRandom.current().nextInt(100) >= 5;
            } finally {
                gatewaySlots.release();
            }
        }

        void recordSuccess(Order o) {
            revenueByCity.merge(o.customer().city(), o.amountPaise(), Long::sum);
            orderLog.add(o);
            totalsLock.lock();
            try {
                totalOrders++;
                totalRevenuePaise += o.amountPaise();   // both fields change atomically together
            } finally {
                totalsLock.unlock();
            }
        }

        Result attemptPurchase(Customer c) {
            if (!reserveUnit()) return new SoldOut(c);
            try {
                if (chargeCard(c)) {
                    Order order = new Order(orderSeq.incrementAndGet(), c, PRICE_PAISE);
                    recordSuccess(order);
                    return new Success(order);
                }
                releaseUnit();                                   // give the unit back
                return new PaymentFailed(c, "card declined");
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                releaseUnit();
                return new PaymentFailed(c, "interrupted");
            }
        }
    }

    static void runSale(String label, ExecutorService executor, int customers, int units) throws Exception {
        Sale sale = new Sale(units);
        String[] cities = {"Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai", "Kolkata", "Pune", "Jaipur"};
        long start = System.nanoTime();

        List<Future<Result>> futures = new ArrayList<>();
        try (executor) {
            for (int i = 1; i <= customers; i++) {
                Customer c = new Customer(i, cities[i % cities.length]);
                futures.add(executor.submit(() -> sale.attemptPurchase(c)));
            }
        }   // close(): waits for every task, then shuts down

        int success = 0, soldOut = 0, failed = 0;
        for (Future<Result> f : futures) {
            switch (f.get()) {                                   // pattern matching switch (Java 21)
                case Success s -> success++;
                case SoldOut s -> soldOut++;
                case PaymentFailed p -> failed++;
            }
        }
        long ms = (System.nanoTime() - start) / 1_000_000;

        // Summary built with CompletableFuture.allOf over the per-city totals
        List<CompletableFuture<String>> cityLines = new ArrayList<>();
        for (var e : new TreeMap<>(sale.revenueByCity).entrySet()) {
            cityLines.add(CompletableFuture.supplyAsync(
                    () -> String.format("   %-10s Rs %,d", e.getKey(), e.getValue() / 100)));
        }
        CompletableFuture.allOf(cityLines.toArray(new CompletableFuture[0])).join();

        sale.totalsLock.lock();
        long totalOrders, totalRevenue;
        try { totalOrders = sale.totalOrders; totalRevenue = sale.totalRevenuePaise; }
        finally { sale.totalsLock.unlock(); }

        System.out.println("=== " + label + " ===");
        System.out.println("customers=" + customers + " units=" + units + " time=" + ms + " ms");
        System.out.println("success=" + success + " soldOut=" + soldOut + " paymentFailed=" + failed);
        System.out.println("stock left=" + sale.stock.get() + " orders logged=" + sale.orderLog.size());
        System.out.println("totals: orders=" + totalOrders + " revenue=Rs " + String.format("%,d", totalRevenue / 100));
        cityLines.forEach(cf -> System.out.println(cf.join()));
        if (success != units - sale.stock.get() || sale.orderLog.size() != success) {
            throw new IllegalStateException("INVARIANT BROKEN: oversell or lost order");
        }
        System.out.println("invariants OK: no oversell, every success logged");
        System.out.println();
    }

    public static void main(String[] args) throws Exception {
        int customers = 500, units = 100;

        ExecutorService platformPool = new ThreadPoolExecutor(
                16, 16, 0, TimeUnit.SECONDS,
                new ArrayBlockingQueue<>(1000),
                r -> new Thread(r, "sale-worker"),
                new ThreadPoolExecutor.CallerRunsPolicy());
        runSale("Platform thread pool (16 threads)", platformPool, customers, units);

        runSale("Virtual threads (one per customer)",
                Executors.newVirtualThreadPerTaskExecutor(), customers, units);
    }
}
/* Sample output (numbers vary because payments fail randomly):
=== Platform thread pool (16 threads) ===
customers=500 units=100 time=612 ms
success=100 soldOut=395 paymentFailed=5
stock left=0 orders logged=100
totals: orders=100 revenue=Rs 1,299,900
   Bengaluru  Rs 155,988
   Chennai    Rs 168,987
   ...
invariants OK: no oversell, every success logged

=== Virtual threads (one per customer) ===
customers=500 units=100 time=498 ms
success=100 soldOut=394 paymentFailed=6
stock left=0 orders logged=100
totals: orders=100 revenue=Rs 1,299,900
   ...
invariants OK: no oversell, every success logged
*/`
    },
    {
      heading: "18. Summary",
      content: `• A **process** owns memory; **threads** share the process heap but have private stacks. Sharing is what makes threads fast and dangerous.
• Create work as \`Runnable\` (no result) or \`Callable\` (result, checked exceptions); start threads with \`Thread.ofPlatform()\` / \`Thread.ofVirtual()\` (Java 21) or, almost always, submit to an \`ExecutorService\`. Call \`start()\`, never \`run()\`.
• Thread states: NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, TERMINATED. Cancellation is cooperative through \`interrupt()\`; always restore the interrupt flag.
• **Race conditions** come from unsynchronised read-modify-write; **visibility** problems come from caches and reordering. \`synchronized\` gives atomicity plus visibility; \`volatile\` gives visibility only. Immutable and thread-confined data need no locks.
• \`ReentrantLock\` adds \`tryLock\`, timeouts, interruptibility, fairness and \`Condition\`; \`ReadWriteLock\` and \`StampedLock\` serve read-heavy data. Always unlock in \`finally\`.
• **Atomic classes** use CAS for lock-free single-variable updates; \`LongAdder\` wins for write-heavy counters; invariants across several fields still need a lock or an immutable snapshot.
• Size and bound your **thread pools** (\`ThreadPoolExecutor\` with a bounded queue and a rejection policy), name your threads, and shut pools down (try-with-resources since Java 19).
• \`CompletableFuture\` builds async pipelines with \`thenApply\`, \`thenCompose\`, \`thenCombine\`, \`allOf\`, \`exceptionally\` and \`orTimeout\`; pass your own executor for I/O.
• **Concurrent collections**: \`ConcurrentHashMap\` (atomic \`merge\`, \`computeIfAbsent\`), \`CopyOnWriteArrayList\` for read-mostly lists, \`BlockingQueue\` for producer-consumer, plus \`CountDownLatch\`, \`CyclicBarrier\` and \`Semaphore\`.
• **Deadlocks** need all four Coffman conditions; break circular wait with consistent lock ordering or hold-and-wait with \`tryLock\`. Detect with \`jstack\` or \`ThreadMXBean\`.
• **Virtual threads** (final in Java 21, JEP 444; synchronized pinning fixed in Java 24, JEP 491) make blocking I/O cheap: use \`newVirtualThreadPerTaskExecutor()\` for I/O-bound work, never pool them, and keep platform pools for CPU-bound work.
• **Scoped Values** are final in Java 25 (JEP 506) and replace \`ThreadLocal\` for immutable request context. **Structured Concurrency** is still a preview in Java 25 (JEP 505, fifth preview); label it as such and verify its status before adopting it.
**Next lecture:** File I/O, NIO.2 & Databases with JDBC`
    }
  ]
};
