export const lecture12 = {
  slug: "lecture-12",
  number: 12,
  title: "Complete Java Course — Lecture 12: File I/O, NIO.2 & Databases with JDBC",
  summary: "Learn Java file I/O and JDBC end to end: java.io vs java.nio.file, the Path and Files API, reading and writing files, walking directories, serialization caveats, JSON with Jackson, PreparedStatement against SQL injection, ResultSet, transactions, HikariCP connection pooling and the DAO pattern.",
  readTime: "54 min read",
  difficulty: "Intermediate",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. Introduction: Why File I/O, NIO.2 and JDBC Matter in Real Java Projects",
      content: `In the previous lecture you learned how Java runs many tasks at once with threads, executors and virtual threads. This lecture is about where the data of a program actually lives when the JVM stops: **files on disk** and **relational databases**. Almost every Java job you will ever do touches one or both. A payroll batch reads a CSV exported from Tally, a Spring Boot API stores orders in PostgreSQL, a log shipper tails files and pushes them to Elasticsearch, a bank's nightly job writes a reconciliation report. Even a "simple" CRUD application is, at its heart, file and database I/O wrapped in HTTP.
Java has three generations of I/O APIs and it is important to know which one to reach for:
• **java.io (Java 1.0)** — stream and reader/writer classes such as \`FileInputStream\`, \`BufferedReader\` and \`FileWriter\`. Still everywhere in legacy code and still the foundation underneath newer APIs.
• **java.nio (Java 1.4)** — buffers, channels and selectors for non-blocking network I/O. Mostly used by frameworks like Netty rather than by application developers.
• **java.nio.file, called NIO.2 (Java 7)** — the \`Path\` and \`Files\` API that replaced the old \`java.io.File\` class for everyday file work. This is what you should use in new code, and Java 11 made it even nicer with \`Files.readString\` and \`Files.writeString\`.
For databases, **JDBC (Java Database Connectivity)** is the standard API in the \`java.sql\` module. Every higher-level tool you will meet later in this course — Spring Data JPA, Hibernate, jOOQ, MyBatis — ultimately calls JDBC. If you understand \`Connection\`, \`PreparedStatement\`, \`ResultSet\` and transactions, you can debug any ORM problem; if you do not, Hibernate will feel like magic that randomly breaks.
Why interviewers care: "difference between java.io and java.nio", "how do you prevent SQL injection in Java", "what is connection pooling and why HikariCP", "what is the DAO pattern" and "explain transaction isolation levels" are standard questions for 1 to 8 years of experience. This lecture covers each one with runnable code, realistic outputs, the mistakes that take down production systems, and a hands-on project that ties files and databases together.`
    },
    {
      heading: "2. java.io vs java.nio.file: Streams, Readers, Writers and NIO.2 Explained",
      content: `**java.io** is built on two parallel hierarchies. **Byte streams** (\`InputStream\` / \`OutputStream\` and subclasses such as \`FileInputStream\`, \`BufferedInputStream\`, \`ObjectOutputStream\`) move raw bytes and are right for images, PDFs, ZIP files and anything binary. **Character streams** (\`Reader\` / \`Writer\` and subclasses such as \`FileReader\`, \`BufferedReader\`, \`InputStreamReader\`, \`PrintWriter\`) move text, decoding bytes into characters using a charset. The classes are designed as **decorators**: you wrap a raw stream in a buffered one for speed, then in a reader for text, giving \`new BufferedReader(new InputStreamReader(new FileInputStream(f), UTF_8))\`. That nesting is powerful but verbose, and forgetting the buffer makes reads thousands of times slower because every \`read()\` becomes a system call.
Two historical traps of java.io: the old \`File\` class returns \`false\` instead of throwing when a delete or rename fails, so you never learn why; and \`FileReader\` / \`FileWriter\` used the platform default charset until **Java 18 (JEP 400)** made UTF-8 the default everywhere. On Windows machines that meant Hindi or Tamil text written with \`FileWriter\` could be silently corrupted when read on Linux.
**java.nio.file (NIO.2, Java 7)** fixed these problems with three central types: \`Path\` (an immutable, platform-independent file location), \`Files\` (a utility class full of static methods for reading, writing, copying, moving, walking and querying attributes) and \`FileSystem\` (so the same API works for ZIP files and in-memory file systems like Jimfs). NIO.2 throws a specific \`IOException\` subtype — \`NoSuchFileException\`, \`AccessDeniedException\`, \`FileAlreadyExistsException\`, \`DirectoryNotEmptyException\` — telling you exactly what went wrong. It supports symbolic links, file attributes (owner, permissions, timestamps), atomic moves and directory watching.
Do not confuse NIO.2 with the older **java.nio** channel/buffer API (\`ByteBuffer\`, \`FileChannel\`, \`SocketChannel\`, \`Selector\`). That one is about non-blocking network servers and memory-mapped files; NIO.2 is about everyday file handling. The two interoperate (\`Files.newByteChannel\`), but as an application developer you will write \`Files.readString(path)\` far more often than you will touch a \`ByteBuffer\`.
**Rule of thumb:** new code uses \`Path\` and \`Files\`. You still need java.io streams and readers because \`Files\` hands them to you (\`Files.newBufferedReader\`, \`Files.newInputStream\`), and because every library that accepts input, from Jackson to JDBC's \`setBinaryStream\`, speaks \`InputStream\` / \`Reader\`.`,
      codeSnippet: `// IoVsNio.java — the same task written three ways
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.List;

public class IoVsNio {
    public static void main(String[] args) throws IOException {
        Path file = Path.of("cities.txt");
        Files.write(file, List.of("Mumbai", "Pune", "Jaipur"));   // NIO.2, UTF-8 by default

        // 1) Classic java.io: decorator chain, must specify charset explicitly
        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(new FileInputStream("cities.txt"), StandardCharsets.UTF_8))) {
            String line;
            while ((line = br.readLine()) != null) {
                System.out.println("io: " + line);
            }
        }

        // 2) NIO.2 giving you a java.io Reader (buffered, UTF-8 by default)
        try (BufferedReader br = Files.newBufferedReader(file)) {
            br.lines().forEach(l -> System.out.println("nio reader: " + l));
        }

        // 3) Pure NIO.2 (Java 11): the whole file in one call
        String all = Files.readString(file);
        System.out.println("readString: " + all.strip().replace(System.lineSeparator(), ", "));

        // Old java.io.File hides the reason for failure...
        File legacy = new File("does-not-exist.txt");
        System.out.println("legacy delete returned: " + legacy.delete());   // false, no reason

        // ...NIO.2 tells you exactly what went wrong
        try {
            Files.delete(Path.of("does-not-exist.txt"));
        } catch (NoSuchFileException e) {
            System.out.println("NIO.2: no such file -> " + e.getFile());
        }
    }
}
/* Output:
io: Mumbai
io: Pune
io: Jaipur
nio reader: Mumbai
nio reader: Pune
nio reader: Jaipur
readString: Mumbai, Pune, Jaipur
legacy delete returned: false
NIO.2: no such file -> does-not-exist.txt
*/`
    },
    {
      heading: "3. The Path and Files API in Java NIO.2: Creating, Resolving, Copying and Moving Files",
      content: `A \`Path\` is a **value object** describing a location; creating one does not touch the disk. Build it with \`Path.of("data", "reports", "q3.csv")\` (Java 11; \`Paths.get\` is the Java 7 equivalent) and the separators are chosen for the platform automatically, so the same code produces \`data\\reports\\q3.csv\` on Windows and \`data/reports/q3.csv\` on Linux. Never hard-code backslashes.
The most useful Path methods:
• \`resolve(other)\` — join paths: \`base.resolve("logs")\` gives \`base/logs\`. If \`other\` is absolute, it wins.
• \`resolveSibling(name)\` — same directory, different file name: handy for writing \`report.tmp\` next to \`report.csv\`.
• \`relativize(other)\` — the path from one to the other, used when building ZIP entries or printing nice relative names.
• \`normalize()\` — removes \`.\` and \`..\` segments. Always normalize user-supplied paths and then check \`startsWith(allowedRoot)\` to block directory-traversal attacks such as \`../../etc/passwd\`.
• \`toAbsolutePath()\`, \`toRealPath()\` (resolves symlinks, must exist), \`getFileName()\`, \`getParent()\`, \`getRoot()\`.
\`Files\` is the workhorse. Querying: \`exists\`, \`notExists\`, \`isDirectory\`, \`isRegularFile\`, \`isReadable\`, \`size\`, \`getLastModifiedTime\`, \`readAttributes(path, BasicFileAttributes.class)\`. Creating: \`createFile\`, \`createDirectory\`, \`createDirectories\` (like \`mkdir -p\`, no error if it exists), \`createTempFile\`, \`createTempDirectory\`. Copying and moving: \`copy(src, dst, REPLACE_EXISTING)\`, \`move(src, dst, ATOMIC_MOVE)\`. Deleting: \`delete\` (throws if missing or non-empty directory) and \`deleteIfExists\`.
Two production patterns worth memorising. First, **atomic write**: write to a temp file in the same directory, then \`Files.move(tmp, target, ATOMIC_MOVE, REPLACE_EXISTING)\`. Readers never see a half-written file, which matters for config files and reports that another process polls. Second, **copy with streams** when the source is not a file: \`Files.copy(inputStream, target)\` streams an HTTP upload straight to disk without holding it in memory.
Note that \`Files.exists\` followed by \`Files.createFile\` is a **race condition** (TOCTOU): another process can create the file in between. Prefer to just call \`createFile\` and catch \`FileAlreadyExistsException\`, or use \`createDirectories\` which is idempotent.`,
      codeSnippet: `// PathAndFilesDemo.java
import java.io.IOException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import static java.nio.file.StandardCopyOption.*;

public class PathAndFilesDemo {
    public static void main(String[] args) throws IOException {
        Path base = Path.of("invoices", "2026", "q3").toAbsolutePath();
        Files.createDirectories(base);                       // mkdir -p, idempotent

        Path invoice = base.resolve("INV-1042.txt");
        Files.writeString(invoice, "Customer: Priya Sharma\\nAmount: ₹18,500\\n");

        // Path arithmetic (nothing touches the disk here)
        System.out.println("file name : " + invoice.getFileName());
        System.out.println("parent    : " + invoice.getParent().getFileName());
        System.out.println("relative  : " + base.getParent().getParent().relativize(invoice));
        System.out.println("sibling   : " + invoice.resolveSibling("INV-1042.pdf").getFileName());

        // Blocking directory traversal from user input
        String userInput = "../../secret.txt";
        Path requested = base.resolve(userInput).normalize();
        System.out.println("safe?     : " + requested.startsWith(base));   // false -> reject

        // Attributes
        BasicFileAttributes attrs = Files.readAttributes(invoice, BasicFileAttributes.class);
        System.out.println("size      : " + attrs.size() + " bytes, dir=" + attrs.isDirectory());

        // Atomic write: temp file + atomic move so readers never see a partial file
        Path tmp = invoice.resolveSibling("INV-1042.txt.tmp");
        Files.writeString(tmp, "Customer: Priya Sharma\\nAmount: ₹19,000 (revised)\\n");
        Files.move(tmp, invoice, ATOMIC_MOVE, REPLACE_EXISTING);

        Path backup = Files.copy(invoice, base.resolve("INV-1042.bak"), REPLACE_EXISTING);
        System.out.println("copied    : " + Files.exists(backup));
        System.out.println("deleted   : " + Files.deleteIfExists(backup));
    }
}
/* Output (Windows):
file name : INV-1042.txt
parent    : q3
relative  : 2026\\q3\\INV-1042.txt
sibling   : INV-1042.pdf
safe?     : false
size      : 41 bytes, dir=false
copied    : true
deleted   : true
*/`
    },
    {
      heading: "4. Reading and Writing Text and Bytes in Java: Files.readString, Files.lines, Buffered Streams and Charsets",
      content: `\`Files\` gives you four levels of convenience, and choosing the right one is about **file size and memory**.
**Whole file at once.** \`Files.readString(path)\` and \`Files.readAllLines(path)\` (text) and \`Files.readAllBytes(path)\` (binary) load everything into memory. Perfect for config files, templates and anything under a few megabytes. Writing is symmetrical: \`Files.writeString(path, text)\`, \`Files.write(path, lines)\` and \`Files.write(path, bytes)\`. All of these default to **UTF-8** regardless of the operating system, which is exactly what you want. To append instead of overwrite, pass \`StandardOpenOption.APPEND\` (and \`CREATE\`).
**Streaming lines.** \`Files.lines(path)\` returns a lazy \`Stream<String>\` that reads one line at a time. A 4 GB server log can be filtered, counted or grouped with a tiny heap. Because the stream holds an open file handle, you **must** close it with try-with-resources; a forgotten \`Files.lines\` inside a loop will eventually exhaust file descriptors and crash with "Too many open files".
**Buffered readers and writers.** \`Files.newBufferedReader(path)\` and \`Files.newBufferedWriter(path)\` give you the classic line-oriented API with buffering already configured (8 KB by default). Use the writer for large generated reports: writing 1 million lines with a \`BufferedWriter\` takes about a second; doing it with unbuffered \`Files.writeString\` in a loop takes minutes because every call opens, writes and closes the file.
**Raw byte streams.** \`Files.newInputStream\` and \`Files.newOutputStream\` are for binary data and for passing to libraries. Since Java 9, \`InputStream.transferTo(OutputStream)\` copies a stream in one line and \`InputStream.readAllBytes()\` slurps it; both replace the hand-written 4 KB buffer loop from older tutorials.
**Charsets.** A charset is the mapping between bytes and characters. Always name it explicitly when you talk to the outside world: bank files from legacy systems are often \`ISO-8859-1\` or \`windows-1252\`, and reading them as UTF-8 produces replacement characters. \`Files.readString(path, Charset.forName("windows-1252"))\` handles that. Writing Indian-language text (Devanagari, Tamil, Bengali) only works reliably with UTF-8.
A practical gotcha: \`Files.writeString\` writes **no BOM** and Excel on Windows may then show UTF-8 CSV files with garbled ₹ symbols. If a report is meant for Excel, either write the three BOM bytes \`0xEF 0xBB 0xBF\` first or document that users should import the CSV as UTF-8.`,
      codeSnippet: `// TextAndBytesDemo.java
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import static java.nio.file.StandardOpenOption.*;

public class TextAndBytesDemo {
    public static void main(String[] args) throws IOException {
        Path log = Path.of("app.log");

        // Generate a realistic log file with a buffered writer (fast: one open/close)
        try (BufferedWriter w = Files.newBufferedWriter(log)) {
            String[] levels = {"INFO", "WARN", "ERROR", "INFO", "INFO"};
            for (int i = 1; i <= 100_000; i++) {
                w.write("2026-10-09T10:00:" + (i % 60) + " " + levels[i % 5]
                        + " order-service: processed order " + i);
                w.newLine();
            }
        }
        System.out.println("log size: " + Files.size(log) / 1024 + " KB");

        // Stream the file lazily: count by level without loading it all
        try (Stream<String> lines = Files.lines(log)) {
            Map<String, Long> byLevel = lines
                    .map(l -> l.split(" ")[1])
                    .collect(Collectors.groupingBy(s -> s, Collectors.counting()));
            System.out.println("by level: " + byLevel);
        }

        // Append a line (CREATE + APPEND) and read the whole small file
        Path note = Path.of("notes.txt");
        Files.writeString(note, "First line\\n", CREATE, TRUNCATE_EXISTING);
        Files.writeString(note, "Second line\\n", CREATE, APPEND);
        List<String> all = Files.readAllLines(note);
        System.out.println("lines: " + all);

        // Bytes: copy a stream with transferTo (Java 9+)
        Path copy = Path.of("app-copy.log");
        try (InputStream in = Files.newInputStream(log);
             OutputStream out = Files.newOutputStream(copy)) {
            long copied = in.transferTo(out);
            System.out.println("copied bytes: " + copied);
        }

        // Charset matters: legacy bank export in windows-1252
        Path legacy = Path.of("legacy.txt");
        Files.writeString(legacy, "Café ₹", StandardCharsets.UTF_8);
        byte[] raw = Files.readAllBytes(legacy);
        System.out.println("utf-8 bytes: " + raw.length);               // 9 bytes (é=2, ₹=3)
        System.out.println("read as latin-1: " + new String(raw, StandardCharsets.ISO_8859_1));
    }
}
/* Output (abridged):
log size: 6054 KB
by level: {ERROR=20000, INFO=60000, WARN=20000}
lines: [First line, Second line]
copied bytes: 6199780
utf-8 bytes: 9
read as latin-1: CafÃ© â\\u0082¹   <- mojibake: wrong charset
*/`
    },
    {
      heading: "5. Walking Directories in Java: Files.list, Files.walk, Files.find, DirectoryStream and WatchService",
      content: `Processing many files — "delete logs older than 30 days", "sum the size of every JPEG under /uploads", "find all pom.xml files in a monorepo" — needs directory traversal. NIO.2 offers four tools, each with a different trade-off.
**\`Files.list(dir)\`** returns a lazy \`Stream<Path>\` of the **direct children** only (no recursion). Like \`Files.lines\` it holds a directory handle, so wrap it in try-with-resources.
**\`Files.walk(start)\`** returns a depth-first \`Stream<Path>\` of the directory, its subdirectories and all files, including the start directory itself. Combine it with \`filter(Files::isRegularFile)\`, \`filter(p -> p.toString().endsWith(".log"))\` and the usual stream operations. The optional \`maxDepth\` argument prevents accidentally scanning an entire disk. By default symbolic links are **not** followed, which protects you from infinite loops; pass \`FileVisitOption.FOLLOW_LINKS\` only when you need it.
**\`Files.find(start, maxDepth, (path, attrs) -> ...)\`** is \`walk\` plus a filter that receives the \`BasicFileAttributes\` for free. Use it when your condition involves size or modification time, because \`walk\` + \`Files.size(p)\` would read the attributes a second time for every file — on a network share that doubles the run time.
**\`Files.walkFileTree(start, FileVisitor)\`** is the older callback API from Java 7. It is more verbose but it is the only one that lets you **react to errors per file** (\`visitFileFailed\`) and **skip subtrees** (\`SKIP_SUBTREE\`) — essential for deleting a directory tree, where you must delete files first and the directory after (\`postVisitDirectory\`). The stream versions throw an \`UncheckedIOException\` at the first unreadable file and stop.
**\`DirectoryStream<Path>\`** with a glob, \`Files.newDirectoryStream(dir, "*.{csv,xlsx}")\`, is a simple for-each over one directory and is still common in older codebases.
**\`WatchService\`** lets a program block until files are created, modified or deleted in a directory, which is how hot-reload tools and "drop a file here to import it" integrations work. Register a directory for \`ENTRY_CREATE\` and \`ENTRY_MODIFY\`, then loop on \`watchService.take()\`. Two caveats: events can arrive before the writer has finished writing the file (wait for the size to stabilise), and on macOS the default implementation polls rather than using native notifications, so events may lag by seconds.
Deleting trees deserves a warning: \`Files.delete\` on a non-empty directory throws \`DirectoryNotEmptyException\`. The idiom is \`walk\` sorted in **reverse** order (\`sorted(Comparator.reverseOrder())\`) so children are deleted before parents, as in the snippet.`,
      codeSnippet: `// DirectoryWalkDemo.java
import java.io.IOException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.stream.Stream;

public class DirectoryWalkDemo {
    public static void main(String[] args) throws IOException {
        Path root = Files.createTempDirectory("uploads");
        Files.createDirectories(root.resolve("2026/09"));
        Files.createDirectories(root.resolve("2026/10"));
        Files.write(root.resolve("2026/09/old.log"), new byte[2_000_000]);     // 2 MB
        Files.write(root.resolve("2026/10/fresh.log"), new byte[500_000]);     // 0.5 MB
        Files.writeString(root.resolve("2026/10/readme.txt"), "ignore me");
        Files.setLastModifiedTime(root.resolve("2026/09/old.log"),
                java.nio.file.attribute.FileTime.from(Instant.now().minus(45, ChronoUnit.DAYS)));

        // 1) Direct children only
        try (Stream<Path> kids = Files.list(root)) {
            System.out.println("children: " + kids.map(p -> p.getFileName().toString()).toList());
        }

        // 2) Recursive: total size of all .log files
        try (Stream<Path> s = Files.walk(root)) {
            long bytes = s.filter(Files::isRegularFile)
                          .filter(p -> p.toString().endsWith(".log"))
                          .mapToLong(p -> { try { return Files.size(p); } catch (IOException e) { throw new java.io.UncheckedIOException(e); } })
                          .sum();
            System.out.println("log bytes: " + bytes);
        }

        // 3) find: logs older than 30 days, using attributes passed in for free
        Instant cutoff = Instant.now().minus(30, ChronoUnit.DAYS);
        try (Stream<Path> old = Files.find(root, Integer.MAX_VALUE,
                (p, attrs) -> attrs.isRegularFile()
                        && p.toString().endsWith(".log")
                        && attrs.lastModifiedTime().toInstant().isBefore(cutoff))) {
            old.forEach(p -> System.out.println("stale: " + root.relativize(p)));
        }

        // 4) Delete the whole tree: children before parents (reverse order)
        try (Stream<Path> all = Files.walk(root)) {
            all.sorted(Comparator.reverseOrder()).forEach(p -> {
                try { Files.delete(p); } catch (IOException e) { throw new java.io.UncheckedIOException(e); }
            });
        }
        System.out.println("root still exists? " + Files.exists(root));
    }
}
/* Output:
children: [2026]
log bytes: 2500000
stale: 2026/09/old.log
root still exists? false
*/`
    },
    {
      heading: "6. Java Serialization and Its Caveats: Serializable, serialVersionUID, transient and Deserialization Attacks",
      content: `**Java serialization** converts an object graph into bytes with \`ObjectOutputStream.writeObject\` and rebuilds it with \`ObjectInputStream.readObject\`. A class opts in by implementing the marker interface \`Serializable\`; every non-transient, non-static field is written, recursively, and the class of every object in the graph must also be \`Serializable\` or you get a \`NotSerializableException\` at runtime. It was used for RMI, HTTP session replication in Tomcat clusters, Hibernate second-level caches and old-style message queues, and it still appears in interviews and legacy systems. For new designs, however, you should know why most teams avoid it.
The caveats, each of which has caused real outages:
• **\`serialVersionUID\`** — the JVM computes a hash of the class structure if you do not declare one. Add a field, recompile, and every previously stored object fails with \`InvalidClassException: local class incompatible\`. Always declare \`private static final long serialVersionUID = 1L;\` and bump it only on incompatible changes.
• **Constructors are not called** on deserialization for \`Serializable\` classes (only the no-arg constructor of the first non-serializable superclass runs). Any validation or invariant in your constructor is bypassed, so a deserialized object can hold state your code never allowed.
• **\`transient\` fields** are skipped and come back as \`null\` / 0 / false. Use it for passwords, open sockets, thread pools and caches, and reinitialise them in a custom \`readObject\` method if needed.
• **Format is tied to the class**, not to a schema. A Python or Node service cannot read it; it is Java-only and version-fragile, which is the opposite of what microservices need.
• **Security: deserialization of untrusted data is remote code execution.** The stream names the classes to instantiate, and attackers chain existing library classes ("gadget chains") into code that runs during \`readObject\`. Apache Commons Collections, Log4Shell-style attacks and many Java CVEs are rooted here. The Java team's own guidance: never deserialize data you did not produce.
Mitigations that Java added: **\`ObjectInputFilter\` (Java 9, JEP 290)** lets you allowlist classes and limit depth and array sizes, and **JEP 415 (Java 17)** added context-specific filter factories so a filter can be applied JVM-wide. Records (final in Java 16) are serialized through their **canonical constructor**, so their validation does run — a meaningful improvement. Still, the modern recommendation is: use serialization only between trusted Java components you control (and set a filter even then); for everything else use JSON, Protocol Buffers or Avro, which is the subject of the next section.`,
      codeSnippet: `// SerializationDemo.java
import java.io.*;
import java.nio.file.*;

public class SerializationDemo {
    static class BankAccount implements Serializable {
        private static final long serialVersionUID = 1L;       // declare it explicitly
        private final String accountNo;
        private double balance;
        private transient String sessionToken;                  // never written to disk

        BankAccount(String accountNo, double balance) {
            if (balance < 0) throw new IllegalArgumentException("negative balance");
            this.accountNo = accountNo;
            this.balance = balance;
            this.sessionToken = "tok-" + System.nanoTime();
            System.out.println("constructor ran");
        }
        @Override public String toString() {
            return accountNo + " balance=" + balance + " token=" + sessionToken;
        }
    }

    // Records are deserialized via the canonical constructor, so validation runs
    record Money(String currency, long paise) implements Serializable {
        Money { if (paise < 0) throw new IllegalArgumentException("negative"); }
    }

    public static void main(String[] args) throws Exception {
        Path file = Path.of("account.ser");
        BankAccount acc = new BankAccount("SBI-001", 25_000);
        System.out.println("before: " + acc);

        try (ObjectOutputStream out = new ObjectOutputStream(Files.newOutputStream(file))) {
            out.writeObject(acc);
            out.writeObject(new Money("INR", 150_000));
        }

        // Allowlist filter (Java 9+): only our classes, max depth 5; everything else rejected
        ObjectInputFilter filter = ObjectInputFilter.Config.createFilter(
                "SerializationDemo$*;java.base/*;!*;maxdepth=5");

        try (ObjectInputStream in = new ObjectInputStream(Files.newInputStream(file))) {
            in.setObjectInputFilter(filter);
            BankAccount back = (BankAccount) in.readObject();   // constructor does NOT run
            Money money = (Money) in.readObject();              // canonical constructor DOES run
            System.out.println("after : " + back);
            System.out.println("money : " + money);
        }
        Files.deleteIfExists(file);
    }
}
/* Output:
constructor ran
before: SBI-001 balance=25000.0 token=tok-1234567890
after : SBI-001 balance=25000.0 token=null      <- transient field lost, no "constructor ran"
money : Money[currency=INR, paise=150000]
*/`
    },
    {
      heading: "7. JSON in Java with Jackson: ObjectMapper, Records, Annotations and Jackson 2 vs Jackson 3",
      content: `**JSON** is the lingua franca of APIs, config files and message queues, and **Jackson** is the de facto Java library for it (Spring Boot, Quarkus and Micronaut all ship it). The central class is \`ObjectMapper\`: \`writeValueAsString(obj)\` serialises, \`readValue(json, Type.class)\` deserialises, and \`readTree(json)\` gives a \`JsonNode\` tree when you do not want a class at all. It is thread-safe once configured, so create one and share it.
How Jackson maps a class: for **POJOs** it uses getters/setters or public fields and needs a no-arg constructor; for **records** (supported since Jackson 2.12) it uses the canonical constructor and the component names — the cleanest option for DTOs. Dates from \`java.time\` need the \`jackson-datatype-jsr310\` module (\`JavaTimeModule\`), otherwise you get \`InvalidDefinitionException: Java 8 date/time type not supported by default\`, one of the most-searched Jackson errors.
Annotations you will use weekly:
• \`@JsonProperty("order_id")\` — map a snake_case JSON key to a camelCase field (or set \`PropertyNamingStrategies.SNAKE_CASE\` globally).
• \`@JsonIgnore\` — never serialise this field (password hashes, lazy Hibernate collections).
• \`@JsonInclude(Include.NON_NULL)\` — omit nulls.
• \`@JsonFormat(pattern = "dd-MM-yyyy")\` — date formatting.
• \`@JsonCreator\` + \`@JsonProperty\` on constructor parameters for immutable classes that are not records.
Configuration that saves production incidents: \`DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES\` is **true by default in Jackson 2**, so when a partner adds one new field to their payload your service starts throwing 400s; most teams disable it. Generic types are erased at runtime, so \`readValue(json, List.class)\` gives \`List<LinkedHashMap>\`; use \`new TypeReference<List<Order>>() {}\` instead. For very large payloads use the streaming \`JsonParser\` API rather than materialising the whole tree.
**Versions.** Jackson 2.x lives in the \`com.fasterxml.jackson\` packages and is what the vast majority of existing projects use. **Jackson 3.0 (released 2025)** moved the core and databind to the \`tools.jackson\` packages (annotations stay in \`com.fasterxml.jackson.annotation\` so both can coexist), made \`JsonMapper\` immutable and builder-based, turned its exceptions unchecked, and changed defaults such as writing dates as ISO-8601 strings and not failing on unknown properties. **Spring Boot 4** auto-configures Jackson 3 and marks Jackson 2 support as deprecated. The snippet shows Jackson 2 because that is what you will meet in most codebases, with a comment on the Jackson 3 equivalent — the concepts are identical.`,
      codeSnippet: `// JacksonDemo.java
// Maven (Jackson 2.x): com.fasterxml.jackson.core:jackson-databind
//                      com.fasterxml.jackson.datatype:jackson-datatype-jsr310
// Jackson 3.x: tools.jackson.core:jackson-databind; imports become tools.jackson.databind.*,
//              and the mapper is built with JsonMapper.builder()...build()
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class JacksonDemo {
    record Order(@JsonProperty("order_id") String orderId,
                 String customer,
                 LocalDate placedOn,
                 BigDecimal total,
                 @JsonIgnore String internalNote) {}

    public static void main(String[] args) throws Exception {
        ObjectMapper mapper = new ObjectMapper()
                .registerModule(new JavaTimeModule())
                .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)   // "2026-10-09" not [2026,10,9]
                .disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES); // tolerate new fields

        Order order = new Order("ORD-7781", "Rahul Verma", LocalDate.of(2026, 10, 9),
                new BigDecimal("2499.00"), "VIP customer");

        String json = mapper.writeValueAsString(order);
        System.out.println(json);

        // Round trip + an unknown field the partner added last week
        String incoming = """
            {"order_id":"ORD-7782","customer":"Anita Desai","placedOn":"2026-10-10",
             "total":999.50,"coupon":"DIWALI10"}""";
        Order parsed = mapper.readValue(incoming, Order.class);
        System.out.println(parsed);

        // Generic collections need TypeReference (type erasure)
        List<Order> orders = mapper.readValue("[" + json + "," + incoming + "]",
                new TypeReference<List<Order>>() {});
        System.out.println("orders: " + orders.size());

        // Tree model when you only need one field
        JsonNode node = mapper.readTree(incoming);
        System.out.println("coupon: " + node.path("coupon").asText("none"));
        System.out.println("missing: " + node.path("gst").asText("none"));
    }
}
/* Output:
{"order_id":"ORD-7781","customer":"Rahul Verma","placedOn":"2026-10-09","total":2499.00}
Order[orderId=ORD-7782, customer=Anita Desai, placedOn=2026-10-10, total=999.50, internalNote=null]
orders: 2
coupon: DIWALI10
missing: none
*/`
    },
    {
      heading: "8. JDBC Architecture in Java: DriverManager, DataSource, Connection and Connecting to MySQL and PostgreSQL",
      content: `**JDBC** is a set of interfaces in \`java.sql\` and \`javax.sql\` that your code programs against, plus a vendor **driver** JAR that implements them for a specific database. The layers are: your application → JDBC API (\`Connection\`, \`Statement\`, \`PreparedStatement\`, \`ResultSet\`) → JDBC driver (MySQL Connector/J, PostgreSQL JDBC, Oracle ojdbc, H2) → network protocol → database server. Because you only use the interfaces, switching from MySQL to PostgreSQL is mostly a change of driver dependency and URL, as long as your SQL is portable.
**Getting a connection.** The simplest way is \`DriverManager.getConnection(url, user, password)\`. Since JDBC 4.0 (Java 6) drivers register themselves through \`ServiceLoader\` the moment the JAR is on the classpath, so the \`Class.forName("com.mysql.jdbc.Driver")\` line in old tutorials is unnecessary. The **JDBC URL** identifies the driver and the database: \`jdbc:mysql://localhost:3306/shopdb\` for MySQL and \`jdbc:postgresql://localhost:5432/shopdb\` for PostgreSQL; options are appended as query parameters. The current driver coordinates are \`com.mysql:mysql-connector-j\` (the old \`mysql:mysql-connector-java\` artifact is retired) and \`org.postgresql:postgresql\`.
**DataSource** is the production alternative to \`DriverManager\`: an object that hands out connections and can be configured once, pooled (section 11) and injected. Application code should depend on \`DataSource\`, never on \`DriverManager\`, so that tests can swap in H2 and production can swap in a pool.
The core objects and their lifecycle:
1. \`Connection\` — a session with the database, holding the transaction state. Expensive to open (TCP handshake, authentication, ~5–50 ms), so it is pooled.
2. \`Statement\` — executes **static** SQL. Use only for DDL and admin commands you fully control.
3. \`PreparedStatement\` — precompiled SQL with \`?\` placeholders, the right choice for all application queries (section 9).
4. \`CallableStatement\` — invokes stored procedures.
5. \`ResultSet\` — a cursor over query results (section 9).
Every one of these is \`AutoCloseable\` and holds server-side resources, so **always** use try-with-resources in the order Connection → Statement → ResultSet; closing the connection closes everything beneath it. Errors surface as the checked \`SQLException\`, which carries \`getSQLState()\` (a standard five-character code such as \`23505\` for unique violation in PostgreSQL) and the vendor-specific \`getErrorCode()\`. Frameworks like Spring translate these into an unchecked \`DataAccessException\` hierarchy; in plain JDBC you usually wrap them in your own runtime exception at the DAO boundary.
The \`java.sql\` module is part of the JDK, but the driver is not: add it to Maven or Gradle. A \`No suitable driver found for jdbc:mysql://...\` error always means the driver JAR is missing from the runtime classpath.`,
      codeSnippet: `// JdbcConnectDemo.java
// Maven: com.mysql:mysql-connector-j:9.7.0   OR   org.postgresql:postgresql:42.7.10
import java.sql.*;
import java.util.Properties;

public class JdbcConnectDemo {
    // Pick one. Both drivers self-register via ServiceLoader (JDBC 4.0+), no Class.forName needed.
    static final String MYSQL_URL    = "jdbc:mysql://localhost:3306/shopdb";
    static final String POSTGRES_URL = "jdbc:postgresql://localhost:5432/shopdb";

    public static void main(String[] args) {
        String url  = System.getProperty("db.url", POSTGRES_URL);
        String user = System.getProperty("db.user", "shop_app");
        String pass = System.getenv().getOrDefault("DB_PASSWORD", "secret");   // never hard-code in real code

        Properties props = new Properties();
        props.setProperty("user", user);
        props.setProperty("password", pass);
        props.setProperty("ApplicationName", "jdbc-demo");   // shows up in pg_stat_activity

        try (Connection conn = DriverManager.getConnection(url, props)) {
            DatabaseMetaData meta = conn.getMetaData();
            System.out.println("Connected to " + meta.getDatabaseProductName()
                    + " " + meta.getDatabaseProductVersion());
            System.out.println("Driver: " + meta.getDriverName() + " " + meta.getDriverVersion());
            System.out.println("JDBC spec: " + meta.getJDBCMajorVersion() + "." + meta.getJDBCMinorVersion());
            System.out.println("Auto-commit: " + conn.getAutoCommit());
            System.out.println("Isolation: " + conn.getTransactionIsolation()
                    + " (READ_COMMITTED=" + Connection.TRANSACTION_READ_COMMITTED + ")");

            // Statement is fine for DDL that you fully control
            try (Statement st = conn.createStatement()) {
                st.execute("""
                    CREATE TABLE IF NOT EXISTS customers (
                        id    BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
                        name  VARCHAR(100) NOT NULL,
                        email VARCHAR(150) NOT NULL UNIQUE,
                        city  VARCHAR(60)
                    )""");   // MySQL: use BIGINT AUTO_INCREMENT PRIMARY KEY instead
            }
        } catch (SQLException e) {
            System.err.println("DB error: " + e.getMessage()
                    + " [SQLState=" + e.getSQLState() + ", code=" + e.getErrorCode() + "]");
        }
    }
}
/* Output (PostgreSQL 17):
Connected to PostgreSQL 17.2
Driver: PostgreSQL JDBC Driver 42.7.10
JDBC spec: 4.2
Auto-commit: true
Isolation: 2 (READ_COMMITTED=2)
*/`
    },
    {
      heading: "9. PreparedStatement to Prevent SQL Injection, and Reading Results with ResultSet",
      content: `**SQL injection** is still in the OWASP Top 10 and still the most common way Java applications are breached. It happens when user input is concatenated into SQL. If a login query is built as \`"SELECT * FROM users WHERE email = '" + email + "'"\` and the user types \`' OR '1'='1\`, the query becomes \`WHERE email = '' OR '1'='1'\`, which matches every row. A slightly cleverer input ends the statement and runs \`DROP TABLE users\` or exfiltrates the whole customer table through a \`UNION SELECT\`.
**\`PreparedStatement\` is the fix.** You write the SQL once with \`?\` placeholders, then bind values with \`setString\`, \`setLong\`, \`setBigDecimal\`, \`setObject\` and so on. The driver sends the SQL text and the parameter values **separately** to the database (or escapes them correctly on the client), so a parameter can never change the structure of the statement — the input \`' OR '1'='1\` is simply compared as a literal email address and matches nothing. Parameters are 1-indexed. Bonus benefits: the database can cache the execution plan for repeated statements, dates and decimals are converted correctly without string formatting, and batch execution with \`addBatch\` / \`executeBatch\` is far faster for bulk inserts (on MySQL add \`rewriteBatchedStatements=true\` to the URL to get a true multi-row insert).
What parameters **cannot** do: they bind values, not identifiers. You cannot write \`ORDER BY ?\` or \`FROM ?\`. For dynamic column names or table names, validate the input against a fixed allowlist (\`Set.of("name", "created_at")\`) and then concatenate the trusted value. For \`LIKE\` searches, put the wildcard in the **parameter value** (\`setString(1, "%" + term + "%")\`), not in the SQL.
Use \`executeQuery\` for SELECT (returns a \`ResultSet\`), \`executeUpdate\` for INSERT/UPDATE/DELETE (returns the affected row count) and \`Statement.RETURN_GENERATED_KEYS\` to read back auto-generated IDs.
**ResultSet** is a cursor positioned **before** the first row. Call \`next()\` to advance; it returns \`false\` when there are no more rows, so the idiom is \`while (rs.next())\` for lists and \`if (rs.next())\` for a single row. Read columns by **label** (\`rs.getString("email")\`) — it survives column reordering — or by index for a tiny speed gain in hot loops. Typed getters: \`getLong\`, \`getBigDecimal\` (use it for money, never \`getDouble\`), \`getBoolean\`, \`getTimestamp\`, and since JDBC 4.2 (Java 8) \`rs.getObject("spent_on", LocalDate.class)\` for \`java.time\` types. SQL \`NULL\` is a trap: \`getInt\` returns 0 for NULL, so call \`rs.wasNull()\` right after, or use \`getObject(col, Integer.class)\` which returns \`null\`. By default a ResultSet is \`TYPE_FORWARD_ONLY\` and \`CONCUR_READ_ONLY\`, which is what you want; scrollable and updatable result sets exist but are rarely worth their cost. \`ResultSetMetaData\` tells you column names and types, which is how generic tools like DBeaver render any query. For huge results, set \`setFetchSize(1000)\` so the driver streams rows instead of loading the entire table into memory (PostgreSQL needs auto-commit off for this to take effect).`,
      codeSnippet: `// PreparedStatementDemo.java  (assumes the customers table from section 8)
import java.sql.*;
import java.util.*;

public class PreparedStatementDemo {
    static final Set<String> SORTABLE = Set.of("name", "city", "id");   // allowlist for identifiers

    public static void main(String[] args) throws SQLException {
        String url = "jdbc:postgresql://localhost:5432/shopdb";
        try (Connection conn = DriverManager.getConnection(url, "shop_app", System.getenv("DB_PASSWORD"))) {

            // INSERT with generated key
            String insert = "INSERT INTO customers (name, email, city) VALUES (?, ?, ?)";
            try (PreparedStatement ps = conn.prepareStatement(insert, Statement.RETURN_GENERATED_KEYS)) {
                ps.setString(1, "Priya Sharma");
                ps.setString(2, "priya@example.in");
                ps.setString(3, "Pune");
                int rows = ps.executeUpdate();
                try (ResultSet keys = ps.getGeneratedKeys()) {
                    if (keys.next()) System.out.println("inserted " + rows + " row, id=" + keys.getLong(1));
                }
            } catch (SQLException e) {
                if ("23505".equals(e.getSQLState())) System.out.println("email already exists");
                else throw e;
            }

            // The attack string is harmless as a bound parameter
            String maliciousEmail = "' OR '1'='1";
            try (PreparedStatement ps = conn.prepareStatement("SELECT id, name FROM customers WHERE email = ?")) {
                ps.setString(1, maliciousEmail);
                try (ResultSet rs = ps.executeQuery()) {
                    System.out.println("rows for malicious input: " + (rs.next() ? "FOUND (bug!)" : "none"));
                }
            }

            // LIKE: wildcard goes in the VALUE; ORDER BY column via allowlist, not a parameter
            String term = "pri", sortBy = "name";
            if (!SORTABLE.contains(sortBy)) throw new IllegalArgumentException("bad sort column");
            String sql = "SELECT id, name, email, city FROM customers WHERE LOWER(name) LIKE ? ORDER BY " + sortBy;
            try (PreparedStatement ps = conn.prepareStatement(sql)) {
                ps.setString(1, "%" + term.toLowerCase() + "%");
                ps.setFetchSize(500);
                try (ResultSet rs = ps.executeQuery()) {
                    ResultSetMetaData md = rs.getMetaData();
                    System.out.println("columns: " + md.getColumnCount() + ", first=" + md.getColumnLabel(1));
                    while (rs.next()) {
                        String city = rs.getString("city");               // may be null
                        System.out.printf("%d | %s | %s | %s%n",
                                rs.getLong("id"), rs.getString("name"), rs.getString("email"),
                                city == null ? "(no city)" : city);
                    }
                }
            }
        }
    }
}
/* Output:
inserted 1 row, id=1
rows for malicious input: none
columns: 4, first=id
1 | Priya Sharma | priya@example.in | Pune
*/`
    },
    {
      heading: "10. JDBC Transactions in Java: Auto-Commit, commit, rollback, Savepoints and Isolation Levels",
      content: `A **transaction** is a group of SQL statements that either all succeed or all fail — the **A** (atomicity) in ACID. The classic example is a money transfer: debit account A, credit account B. If the credit fails after the debit succeeded, ₹10,000 vanishes. Transactions also give **consistency** (constraints hold at commit), **isolation** (concurrent transactions do not see each other's half-done work) and **durability** (a committed change survives a crash).
By default a JDBC \`Connection\` is in **auto-commit mode**: every statement is its own transaction, committed the instant it finishes. To group statements, call \`conn.setAutoCommit(false)\`, execute them, then \`conn.commit()\`; on any exception call \`conn.rollback()\`. Put the rollback in the \`catch\` and restore auto-commit in \`finally\` — a pooled connection returned with auto-commit off will silently break the next borrower (HikariCP resets it, but not every pool does). Never leave a transaction open while waiting on user input or a remote HTTP call: it holds row locks, and under load other requests queue behind it until the database reports lock-wait timeouts.
**Savepoints** (\`conn.setSavepoint("afterDebit")\`) let you roll back part of a transaction while keeping the rest — useful in batch imports where one bad row should be skipped without discarding the 999 good ones.
**Isolation levels** control what one transaction may see of another's uncommitted or concurrent work, trading correctness for throughput. JDBC exposes four constants on \`Connection\`:
• \`TRANSACTION_READ_UNCOMMITTED\` — can read uncommitted rows (dirty reads). Almost never appropriate.
• \`TRANSACTION_READ_COMMITTED\` — sees only committed data, but the same query may return different rows if re-run (non-repeatable reads). **PostgreSQL's default**, and what most web apps use.
• \`TRANSACTION_REPEATABLE_READ\` — a row read twice in one transaction is guaranteed identical. **MySQL InnoDB's default**.
• \`TRANSACTION_SERIALIZABLE\` — transactions behave as if run one after another; safest, slowest, and the database may abort one with a serialization failure that you must retry.
Set it per connection with \`conn.setTransactionIsolation(...)\` before starting the transaction. Note that isolation does not solve the **lost update** problem (two users read balance 100, both write 100 − 30 = 70). For that use \`SELECT ... FOR UPDATE\` (pessimistic lock), an atomic \`UPDATE accounts SET balance = balance - ? WHERE id = ? AND balance >= ?\` (the snippet), or a version column (optimistic locking, which JPA's \`@Version\` automates).
Spring's \`@Transactional\` wraps exactly this pattern — setAutoCommit(false), commit, rollback on RuntimeException — around a method, which is why you must understand it even if you never write \`conn.commit()\` by hand.`,
      codeSnippet: `// TransferService.java — atomic money transfer with rollback and a savepoint
import java.math.BigDecimal;
import java.sql.*;

public class TransferService {
    private final javax.sql.DataSource ds;
    public TransferService(javax.sql.DataSource ds) { this.ds = ds; }

    public void transfer(long fromId, long toId, BigDecimal amount) throws SQLException {
        String debit  = "UPDATE accounts SET balance = balance - ? WHERE id = ? AND balance >= ?";
        String credit = "UPDATE accounts SET balance = balance + ? WHERE id = ?";
        String audit  = "INSERT INTO transfer_log (from_id, to_id, amount) VALUES (?, ?, ?)";

        Connection conn = ds.getConnection();
        try {
            conn.setAutoCommit(false);
            conn.setTransactionIsolation(Connection.TRANSACTION_READ_COMMITTED);

            try (PreparedStatement ps = conn.prepareStatement(debit)) {
                ps.setBigDecimal(1, amount); ps.setLong(2, fromId); ps.setBigDecimal(3, amount);
                if (ps.executeUpdate() == 0) {
                    throw new SQLException("insufficient funds or unknown account " + fromId, "P0001");
                }
            }
            try (PreparedStatement ps = conn.prepareStatement(credit)) {
                ps.setBigDecimal(1, amount); ps.setLong(2, toId);
                if (ps.executeUpdate() == 0) throw new SQLException("unknown account " + toId, "P0001");
            }

            // Audit log is nice-to-have: if it fails, keep the transfer but drop the log row
            Savepoint beforeAudit = conn.setSavepoint("beforeAudit");
            try (PreparedStatement ps = conn.prepareStatement(audit)) {
                ps.setLong(1, fromId); ps.setLong(2, toId); ps.setBigDecimal(3, amount);
                ps.executeUpdate();
            } catch (SQLException e) {
                System.err.println("audit failed, continuing: " + e.getMessage());
                conn.rollback(beforeAudit);
            }

            conn.commit();
            System.out.println("transferred ₹" + amount + " from " + fromId + " to " + toId);
        } catch (SQLException e) {
            conn.rollback();                       // undo debit AND credit together
            System.err.println("rolled back: " + e.getMessage());
            throw e;
        } finally {
            conn.setAutoCommit(true);              // leave the pooled connection clean
            conn.close();                          // returns it to the pool
        }
    }
}
/* Example run:
transferred ₹5000.00 from 1 to 2
rolled back: insufficient funds or unknown account 1   <- second call with too-large amount
*/`
    },
    {
      heading: "11. Connection Pooling with HikariCP: Configuration, Pool Sizing and Leak Detection",
      content: `Opening a database connection is expensive: a TCP handshake, TLS negotiation, authentication, and server-side session setup, typically 5–50 ms and a few megabytes of memory on the database side. A web API doing \`DriverManager.getConnection\` per request would spend more time connecting than querying and would exhaust the server's \`max_connections\` (100 by default in PostgreSQL) the first time traffic spikes. A **connection pool** opens a fixed set of connections at startup and lends them out; \`dataSource.getConnection()\` takes microseconds, and \`connection.close()\` returns the connection to the pool instead of closing the socket.
**HikariCP** (Japanese for "light") is the fastest and most widely used JDBC pool and the **default in Spring Boot** since version 2.0. You configure a \`HikariConfig\` (or set properties on \`HikariDataSource\` directly) with the JDBC URL, credentials and pool settings, and it hands you a standard \`javax.sql.DataSource\`. The current release line is 7.x (Java 11+); the dependency is \`com.zaxxer:HikariCP\`.
The settings that matter, with defaults:
• \`maximumPoolSize\` (10) — the hard cap. Bigger is **not** better: the HikariCP wiki's formula is roughly \`cores × 2 + number of disks\` for the database server, so a 4-core Postgres is happiest with about 10 connections per application, not 200. More connections cause lock contention and context switching inside the database.
• \`minimumIdle\` (same as maximum) — leave it equal to \`maximumPoolSize\` for a fixed-size pool, which gives the most predictable latency.
• \`connectionTimeout\` (30,000 ms) — how long \`getConnection()\` waits for a free connection before throwing \`SQLTransientConnectionException\`. If you see this in logs, you are leaking connections or your queries are too slow — not a reason to raise the pool size.
• \`maxLifetime\` (1,800,000 ms = 30 min) — retire connections before the database or a firewall kills them; set it a minute shorter than MySQL's \`wait_timeout\`.
• \`idleTimeout\` (600,000 ms) — only applies when \`minimumIdle\` < \`maximumPoolSize\`.
• \`leakDetectionThreshold\` (0 = off) — log a stack trace when a connection is held longer than N ms. Set 60,000 in staging to find missing \`close()\` calls.
• \`poolName\` — shows up in metrics and thread names; always set it.
HikariCP exposes metrics (active, idle, waiting, total) through Micrometer or JMX, and Spring Boot publishes them as \`hikaricp.connections.*\` on \`/actuator/metrics\`. Watch \`pending\` (threads waiting for a connection): a non-zero value under normal load means your pool is saturated by slow queries.
In Spring Boot you rarely touch \`HikariConfig\`; you set \`spring.datasource.url\`, \`spring.datasource.hikari.maximum-pool-size=10\` and so on in \`application.properties\`, and the same \`DataSource\` is injected into JdbcTemplate, JPA and your DAOs. The snippet shows the plain-Java equivalent so you know what those properties actually do.`,
      codeSnippet: `// DataSourceFactory.java
// Maven: com.zaxxer:HikariCP:7.1.0 (+ your JDBC driver)
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

public class DataSourceFactory {
    public static HikariDataSource create() {
        HikariConfig cfg = new HikariConfig();
        cfg.setJdbcUrl(System.getProperty("db.url", "jdbc:postgresql://localhost:5432/shopdb"));
        cfg.setUsername(System.getProperty("db.user", "shop_app"));
        cfg.setPassword(System.getenv("DB_PASSWORD"));
        cfg.setPoolName("shop-pool");
        cfg.setMaximumPoolSize(10);                 // cores*2 + disks on the DB server, not 200
        cfg.setMinimumIdle(10);                     // fixed-size pool = predictable latency
        cfg.setConnectionTimeout(10_000);           // fail fast instead of the 30 s default
        cfg.setMaxLifetime(25 * 60 * 1000L);        // shorter than MySQL wait_timeout / LB idle timeout
        cfg.setLeakDetectionThreshold(60_000);      // log stack trace if held > 60 s
        cfg.setAutoCommit(true);
        cfg.addDataSourceProperty("ApplicationName", "shop-api");   // PostgreSQL-specific
        return new HikariDataSource(cfg);
    }

    public static void main(String[] args) throws Exception {
        try (HikariDataSource ds = create()) {                   // closing the pool at shutdown
            long t0 = System.nanoTime();
            for (int i = 0; i < 1000; i++) {
                try (Connection c = ds.getConnection();          // borrow (microseconds)
                     Statement st = c.createStatement();
                     ResultSet rs = st.executeQuery("SELECT 1")) {
                    rs.next();
                }                                                 // close() = return to pool
            }
            System.out.printf("1000 borrow/return cycles: %d ms%n", (System.nanoTime() - t0) / 1_000_000);
            System.out.println("active=" + ds.getHikariPoolMXBean().getActiveConnections()
                    + " idle=" + ds.getHikariPoolMXBean().getIdleConnections()
                    + " waiting=" + ds.getHikariPoolMXBean().getThreadsAwaitingConnection());
        }
    }
}
/* Output:
1000 borrow/return cycles: 148 ms        (vs ~15,000 ms with DriverManager per call)
active=0 idle=10 waiting=0

Spring Boot equivalent (application.properties):
spring.datasource.url=jdbc:postgresql://localhost:5432/shopdb
spring.datasource.username=shop_app
spring.datasource.password=\${DB_PASSWORD}
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.pool-name=shop-pool
spring.datasource.hikari.leak-detection-threshold=60000
*/`
    },
    {
      heading: "12. The DAO Pattern in Java: Separating Persistence from Business Logic",
      content: `A **DAO (Data Access Object)** is a class whose only job is to move one kind of entity between the database and Java objects. Everything JDBC — SQL strings, \`PreparedStatement\`, \`ResultSet\` mapping, \`SQLException\` — lives inside the DAO; the rest of the application calls plain methods like \`findById(42)\` or \`save(customer)\` and never sees a \`Connection\`. This is the pattern Spring Data JPA's **repositories** formalise, and interviewers ask about it to check whether you can structure a codebase.
The structure:
1. **An interface** (\`CustomerDao\`) declaring the operations: \`save\`, \`findById\` (returning \`Optional<Customer>\`), \`findAll\`, \`update\`, \`deleteById\`, plus domain-specific queries like \`findByCity\`.
2. **A JDBC implementation** (\`JdbcCustomerDao\`) that receives a \`DataSource\` through its constructor — never a \`Connection\`, which would tie it to one transaction and one thread.
3. **A domain type** (\`Customer\` record) that is independent of the database. A private \`mapRow(ResultSet)\` helper converts a row into it in exactly one place.
4. **An unchecked exception** (\`DataAccessException\`) wrapping \`SQLException\`, so callers are not forced to catch a checked exception they cannot handle meaningfully. Keep the original as the cause for logging.
Why the interface matters: the service layer can be unit-tested with a fake \`InMemoryCustomerDao\` (a \`HashMap\`) without a database, and you can swap the JDBC implementation for JPA or a REST client later. Mockito, which you will learn in the next lecture, makes faking an interface a one-liner.
Transaction boundaries are the subtle part. A DAO method should **not** call \`commit\` itself, because a business operation often spans several DAOs — "create order" touches orders, order_items and inventory. The usual solutions are: (a) the service obtains a connection, starts the transaction and passes the same \`Connection\` to each DAO method (explicit and simple); (b) a thread-local or scoped-value connection holder that DAOs read from (how Spring's \`DataSourceUtils\` works under \`@Transactional\`); or (c) let the framework do it. For small apps, option (a) is perfectly fine and keeps everything visible.
Avoid the "generic DAO" temptation — \`GenericDao<T, ID>\` with reflection-based mapping. It saves ten lines per entity and costs you clarity, type-safety and performance; if you want that level of abstraction, use JPA or jOOQ, which do it properly. Also keep DAOs free of business rules: "a customer cannot be deleted while they have open orders" belongs in the service, not in \`deleteById\`.`,
      codeSnippet: `// CustomerDao.java + JdbcCustomerDao.java (one file for brevity)
import javax.sql.DataSource;
import java.sql.*;
import java.util.*;

record Customer(Long id, String name, String email, String city) {}

class DataAccessException extends RuntimeException {
    DataAccessException(String msg, Throwable cause) { super(msg, cause); }
}

interface CustomerDao {
    Customer save(Customer c);
    Optional<Customer> findById(long id);
    List<Customer> findByCity(String city);
    boolean deleteById(long id);
}

class JdbcCustomerDao implements CustomerDao {
    private final DataSource ds;
    JdbcCustomerDao(DataSource ds) { this.ds = ds; }

    @Override public Customer save(Customer c) {
        String sql = "INSERT INTO customers (name, email, city) VALUES (?, ?, ?)";
        try (Connection conn = ds.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, c.name()); ps.setString(2, c.email()); ps.setString(3, c.city());
            ps.executeUpdate();
            try (ResultSet keys = ps.getGeneratedKeys()) {
                keys.next();
                return new Customer(keys.getLong(1), c.name(), c.email(), c.city());
            }
        } catch (SQLException e) {
            throw new DataAccessException("save failed for " + c.email(), e);
        }
    }

    @Override public Optional<Customer> findById(long id) {
        String sql = "SELECT id, name, email, city FROM customers WHERE id = ?";
        try (Connection conn = ds.getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? Optional.of(mapRow(rs)) : Optional.empty();
            }
        } catch (SQLException e) {
            throw new DataAccessException("findById failed for " + id, e);
        }
    }

    @Override public List<Customer> findByCity(String city) {
        String sql = "SELECT id, name, email, city FROM customers WHERE city = ? ORDER BY name";
        try (Connection conn = ds.getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, city);
            try (ResultSet rs = ps.executeQuery()) {
                List<Customer> out = new ArrayList<>();
                while (rs.next()) out.add(mapRow(rs));
                return out;
            }
        } catch (SQLException e) {
            throw new DataAccessException("findByCity failed for " + city, e);
        }
    }

    @Override public boolean deleteById(long id) {
        try (Connection conn = ds.getConnection();
             PreparedStatement ps = conn.prepareStatement("DELETE FROM customers WHERE id = ?")) {
            ps.setLong(1, id);
            return ps.executeUpdate() == 1;
        } catch (SQLException e) {
            throw new DataAccessException("delete failed for " + id, e);
        }
    }

    // Exactly one place that knows the column layout
    private static Customer mapRow(ResultSet rs) throws SQLException {
        return new Customer(rs.getLong("id"), rs.getString("name"),
                            rs.getString("email"), rs.getString("city"));
    }
}

// Usage from a service:
//   CustomerDao dao = new JdbcCustomerDao(DataSourceFactory.create());
//   Customer saved = dao.save(new Customer(null, "Arjun Mehta", "arjun@example.in", "Bengaluru"));
//   dao.findById(saved.id()).ifPresent(System.out::println);
//   -> Customer[id=7, name=Arjun Mehta, email=arjun@example.in, city=Bengaluru]`
    },
    {
      heading: "13. Real-World Use Cases: How Java File I/O and JDBC Are Used in Production",
      content: `**Batch file ingestion in banking and fintech.** NPCI settlement files, bank statements and mutual-fund feeds arrive as fixed-width or CSV files every night. A Spring Batch or plain Java job watches a directory with \`WatchService\`, streams each file with \`Files.lines\`, validates rows, and inserts them with \`PreparedStatement.addBatch\` in chunks of 1,000 inside one transaction per chunk. Processed files are moved with \`Files.move(..., ATOMIC_MOVE)\` into an \`archive/\` folder so a crash never double-processes a file.
**REST APIs on Spring Boot.** Every \`@RestController\` that returns JSON uses Jackson, and every \`@Repository\` ultimately runs \`PreparedStatement\`s on HikariCP-pooled connections. When a production API slows down, the first dashboards an SRE opens are the HikariCP metrics (\`pending\`, \`active\`) and the database's slow-query log — exactly the concepts in sections 9 to 11.
**Report generation.** E-commerce and ERP systems generate daily GST reports, invoices and reconciliation summaries: a query with \`setFetchSize\` streams rows, a \`BufferedWriter\` writes a CSV (with the UTF-8 BOM for Excel users), and the file is uploaded to S3 or emailed.
**Log processing and observability tooling.** Agents such as Filebeat-style shippers written in Java tail log files, parse JSON lines with Jackson's streaming parser, and buffer events to disk when the network is down.
**Configuration and caching.** Applications read \`application.yml\` / JSON config with \`Files.readString\` + Jackson at startup, and some cache expensive computed data as JSON files on local disk with atomic writes so a restart is instant.
**Data migrations and ETL.** Moving a legacy MySQL schema to PostgreSQL, or syncing an on-premise database to a data warehouse, is often a Java program with two \`DataSource\`s: read with a forward-only, streaming \`ResultSet\` from one, write with batched \`PreparedStatement\`s and explicit transactions to the other, logging progress to a file.
**Security-sensitive uploads.** File upload endpoints normalise the target \`Path\`, check it starts with the upload root, limit size while streaming with \`transferTo\`, and store metadata (owner, checksum, content type) in the database in the same transaction that records the upload — so the file and its row never disagree.
**Interview framing.** When asked "how would you design a file importer / an order service", walking through these layers — NIO.2 for files, DAO over PreparedStatement for persistence, transactions per unit of work, HikariCP for pooling, Jackson for JSON — demonstrates production awareness far better than reciting API names.`
    },
    {
      heading: "14. Common Mistakes with Java File I/O and JDBC and How to Fix Them",
      content: `**1. Leaking resources by not using try-with-resources.** A \`Files.lines\` stream, a \`BufferedReader\` or a \`ResultSet\` left open holds a file descriptor or a database cursor. Under load the process hits "Too many open files" or the pool runs dry with \`SQLTransientConnectionException: shop-pool - Connection is not available, request timed out after 30000ms\`. Fix: every \`AutoCloseable\` goes in a try-with-resources header; enable Hikari's \`leakDetectionThreshold\` in staging to find the culprits.
**2. Building SQL with string concatenation.** Even "internal" admin tools get exposed. Fix: \`PreparedStatement\` with \`?\` for every value; allowlists for identifiers; never trust \`ORDER BY\` from the request.
**3. Ignoring the charset.** \`new String(bytes)\` and \`new FileReader(path)\` on Java 17 use the platform default, which is still Cp1252 on many Windows machines. Fix: pass \`StandardCharsets.UTF_8\` explicitly, use NIO.2 \`Files\` methods (UTF-8 by default), and move to Java 21 or 25 where UTF-8 is the default everywhere (JEP 400).
**4. Loading huge files or result sets into memory.** \`Files.readAllLines\` on a 3 GB file or a \`SELECT *\` without a \`WHERE\` into an \`ArrayList\` throws \`OutOfMemoryError\` at 2 a.m. Fix: \`Files.lines\` and streaming \`ResultSet\` with \`setFetchSize\`, processing in chunks.
**5. Forgetting to commit or rollback.** With auto-commit off and no \`commit()\`, the work silently disappears when the connection closes; with no \`rollback()\` in the catch block, a pooled connection carries a half-done transaction to the next request. Fix: the commit/rollback/finally template from section 10, or \`@Transactional\`.
**6. Using double for money.** \`rs.getDouble("amount")\` turns ₹0.10 into 0.1000000000000000055. Fix: \`DECIMAL(12,2)\` columns and \`BigDecimal\` in Java, end to end.
**7. Creating a new ObjectMapper or DataSource per request.** Both are heavy; a new \`HikariDataSource\` per request creates a new pool of 10 connections each time and exhausts the database in seconds. Fix: one shared, thread-safe instance (a Spring bean or a static final field).
**8. Trusting deserialization.** Accepting a serialized Java object from a browser, queue or cache you do not control is remote code execution. Fix: JSON with Jackson, or at minimum an \`ObjectInputFilter\` allowlist.
**9. Oversizing the connection pool.** Setting \`maximumPoolSize=200\` because "we have 200 threads" makes the database slower, not faster. Fix: size for the database (cores × 2 + disks), make slow queries fast, and let requests queue briefly in Hikari.
**10. Checking existence before acting.** \`if (Files.exists(p)) Files.delete(p)\` and \`SELECT then INSERT\` both race with concurrent processes. Fix: \`deleteIfExists\`, \`createDirectories\`, unique constraints with \`23505\` handling, or \`INSERT ... ON CONFLICT\` / \`ON DUPLICATE KEY UPDATE\`.`,
      codeSnippet: `// MistakesFixed.java — before/after for the most common bugs
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.sql.*;
import java.util.stream.Stream;

public class MistakesFixed {
    // BAD: stream never closed -> file descriptor leak
    static long countBad(Path p) throws Exception {
        return Files.lines(p).count();
    }
    // GOOD
    static long countGood(Path p) throws Exception {
        try (Stream<String> lines = Files.lines(p)) { return lines.count(); }
    }

    // BAD: SQL injection + double for money + connection never closed
    static double balanceBad(Connection c, String accountNo) throws SQLException {
        ResultSet rs = c.createStatement().executeQuery(
                "SELECT balance FROM accounts WHERE account_no = '" + accountNo + "'");
        return rs.next() ? rs.getDouble(1) : 0;
    }
    // GOOD
    static BigDecimal balanceGood(javax.sql.DataSource ds, String accountNo) throws SQLException {
        try (Connection c = ds.getConnection();
             PreparedStatement ps = c.prepareStatement("SELECT balance FROM accounts WHERE account_no = ?")) {
            ps.setString(1, accountNo);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? rs.getBigDecimal(1) : BigDecimal.ZERO;
            }
        }
    }

    // BAD: platform default charset (Cp1252 on older Windows JDKs)
    static String readBad(Path p) throws Exception {
        return new String(Files.readAllBytes(p));
    }
    // GOOD: explicit UTF-8 (Files.readString also defaults to UTF-8)
    static String readGood(Path p) throws Exception {
        return Files.readString(p, StandardCharsets.UTF_8);
    }

    // BAD: race between exists() and delete()
    static void deleteBad(Path p) throws Exception {
        if (Files.exists(p)) Files.delete(p);   // NoSuchFileException if another process beat you
    }
    // GOOD
    static boolean deleteGood(Path p) throws Exception {
        return Files.deleteIfExists(p);
    }

    public static void main(String[] args) throws Exception {
        Path p = Files.writeString(Path.of("m.txt"), "a\\nb\\nc\\n");
        System.out.println("lines: " + countGood(p));
        System.out.println("text : " + readGood(p).strip().replace("\\n", ","));
        System.out.println("deleted: " + deleteGood(p) + ", again: " + deleteGood(p));
        System.out.println("0.1 as double*3 = " + (0.1 * 3) + ", as BigDecimal = "
                + new BigDecimal("0.10").multiply(BigDecimal.valueOf(3)));
    }
}
/* Output:
lines: 3
text : a,b,c
deleted: true, again: false
0.1 as double*3 = 0.30000000000000004, as BigDecimal = 0.30
*/`
    },
    {
      heading: "15. Frequently Asked Questions about Java File I/O, NIO.2 and JDBC",
      content: `**What is the difference between java.io and java.nio in Java?**
\`java.io\` (Java 1.0) is the stream-based, blocking API: \`InputStream\`, \`Reader\`, \`File\`. \`java.nio\` (Java 1.4) added buffers, channels and selectors for non-blocking network I/O, and \`java.nio.file\` (NIO.2, Java 7) added the \`Path\` and \`Files\` API that replaces \`java.io.File\` with better error reporting, attributes, symbolic links and directory walking. For everyday file work use NIO.2; you still use java.io streams and readers underneath because \`Files\` returns them and libraries accept them.
**How do I read a file line by line in Java?**
For small files, \`Files.readAllLines(path)\` returns a \`List<String>\`. For large files, \`try (Stream<String> lines = Files.lines(path)) { ... }\` streams lazily, or \`Files.newBufferedReader(path)\` with \`readLine()\` in a loop. All three default to UTF-8 and must be closed, which try-with-resources handles.
**What is the difference between Statement and PreparedStatement in JDBC?**
\`Statement\` executes a fixed SQL string and is vulnerable to SQL injection if you concatenate input. \`PreparedStatement\` precompiles SQL with \`?\` placeholders and sends parameter values separately, which prevents injection, handles type conversion and lets the database reuse the execution plan. Use \`Statement\` only for DDL you fully control.
**How do I prevent SQL injection in Java?**
Bind every user-supplied value with \`PreparedStatement\` setters, never concatenate it into SQL. For identifiers such as column names in \`ORDER BY\`, which cannot be parameters, validate against an allowlist. ORMs like JPA and query builders like jOOQ do the same thing underneath; native queries with string concatenation reintroduce the risk.
**What is connection pooling and why is HikariCP used?**
A connection pool keeps a fixed set of open database connections and lends them out, because opening a connection costs tens of milliseconds and database servers allow only a limited number. HikariCP is the fastest, lightest JDBC pool and Spring Boot's default; you configure the JDBC URL, \`maximumPoolSize\` (about 10 for most apps) and timeouts, and get a standard \`DataSource\`.
**What is the difference between commit and rollback in JDBC?**
After \`setAutoCommit(false)\`, \`commit()\` makes all statements since the last commit permanent and visible to other transactions, while \`rollback()\` discards them and restores the previous state. Call commit at the end of the try block and rollback in the catch block, then restore auto-commit in finally.
**Is Java serialization safe to use?**
Only between trusted Java components you control, and even then with an \`ObjectInputFilter\` allowlist (Java 9+). Deserializing untrusted bytes lets an attacker execute code through gadget chains, and the format breaks whenever the class changes unless you manage \`serialVersionUID\`. For APIs, queues and caches, JSON with Jackson (or Protobuf/Avro) is safer and language-neutral.
**What is the DAO pattern in Java?**
A Data Access Object encapsulates all database access for one entity behind an interface such as \`CustomerDao\` with methods like \`findById\` and \`save\`. The JDBC implementation receives a \`DataSource\`, maps \`ResultSet\` rows to domain objects in one place, and wraps \`SQLException\` in an unchecked exception. It keeps SQL out of business logic and makes the service layer testable with a fake DAO.`
    },
    {
      heading: "16. Interview Questions and Answers on Java File I/O, NIO.2 and JDBC",
      content: `**Q1. What are the advantages of NIO.2's Path and Files over java.io.File?**
Meaningful exceptions instead of boolean return values (\`NoSuchFileException\`, \`AccessDeniedException\`); one-line reads and writes (\`readString\`, \`writeString\`, \`lines\`); directory walking with streams; symbolic-link and attribute support; atomic moves; pluggable file systems such as ZIP; and UTF-8 defaults. \`Path\` is immutable and platform-independent, and \`File.toPath()\` / \`Path.toFile()\` bridge the two for legacy APIs.
**Q2. Explain the JDBC architecture and the steps to execute a query.**
Application code uses the \`java.sql\` interfaces; a vendor driver implements them. Steps: obtain a \`Connection\` from a \`DataSource\` (pooled) or \`DriverManager\`; create a \`PreparedStatement\` with placeholders; bind parameters; call \`executeQuery\` or \`executeUpdate\`; iterate the \`ResultSet\` with \`next()\` and typed getters; close everything with try-with-resources. Drivers self-register through \`ServiceLoader\` since JDBC 4.0.
**Q3. How does PreparedStatement prevent SQL injection, and what can it not protect?**
The SQL text is compiled with placeholders and the values are transmitted or escaped as data, so they can never alter the statement's structure. It cannot parameterise identifiers (table or column names) or keywords, so dynamic \`ORDER BY\` or table names must be validated against an allowlist before concatenation.
**Q4. What are the JDBC transaction isolation levels and which do MySQL and PostgreSQL use by default?**
READ_UNCOMMITTED (dirty reads allowed), READ_COMMITTED (no dirty reads, non-repeatable reads possible), REPEATABLE_READ (same row reads consistently, phantoms possible in theory), SERIALIZABLE (full isolation, possible serialization failures). PostgreSQL defaults to READ_COMMITTED and MySQL InnoDB to REPEATABLE_READ. Higher levels reduce anomalies at the cost of throughput and retries.
**Q5. Why should the connection pool not be sized equal to the number of application threads?**
A database server executes queries on its CPU cores and disks; beyond roughly \`cores × 2 + disks\` active connections, extra connections only compete for locks and CPU, increasing latency for everyone. A smaller pool with brief queueing in HikariCP delivers higher throughput. Slow queries, not pool size, are usually the real bottleneck.
**Q6. What happens if a pooled connection is not closed?**
It is never returned to the pool. After \`maximumPoolSize\` leaks, every \`getConnection()\` blocks for \`connectionTimeout\` and throws \`SQLTransientConnectionException\`, effectively taking the application down while the database looks idle. HikariCP's \`leakDetectionThreshold\` logs the stack trace of the borrower to locate the missing \`close()\`.
**Q7. What is serialVersionUID and what happens if you do not declare it?**
It is a version stamp stored in the serialized stream and checked on deserialization. If undeclared, the JVM derives it from the class structure, so any change to fields or methods (even across compilers) produces an \`InvalidClassException\` when reading old data. Declaring it explicitly gives you control over compatibility.
**Q8. How do you handle NULL columns with ResultSet?**
Primitive getters return 0 / false for SQL NULL, so check \`rs.wasNull()\` immediately after, or use object getters such as \`rs.getObject("qty", Integer.class)\` and \`rs.getBigDecimal\`, which return \`null\`. Map nulls deliberately into \`Optional\` or defaults in the DAO's row mapper.
**Q9. How would you insert 1 million rows efficiently with JDBC?**
Turn off auto-commit, use one \`PreparedStatement\` with \`addBatch()\` and call \`executeBatch()\` every 1,000 rows, committing per chunk; on MySQL add \`rewriteBatchedStatements=true\`, on PostgreSQL consider the driver's \`CopyManager\` for raw speed. Disable or defer indexes and constraints during the bulk load if the database allows it, and stream the source file with \`Files.lines\` so memory stays flat.
**Q10. Compare Java serialization, JSON (Jackson) and Protocol Buffers.**
Java serialization is built-in but Java-only, version-fragile and dangerous with untrusted input. JSON via Jackson is human-readable, language-neutral and schema-flexible, ideal for REST APIs and configuration, but verbose and slower. Protobuf is compact, fast and strongly schema-versioned, used for gRPC and high-volume messaging, at the cost of needing a schema and generated code. Most modern systems use JSON at the edges and Protobuf or Avro between internal services.`
    },
    {
      heading: "17. Hands-On Exercise: An Expense Importer with NIO.2, PreparedStatement Batches, Transactions, HikariCP and a DAO",
      content: `This exercise ties the whole lecture together in one runnable program. It generates a CSV of expenses on disk (NIO.2), streams and parses it (\`Files.lines\`), loads the rows into a database through a DAO using a batched \`PreparedStatement\` inside a single transaction, demonstrates that a bad batch is rolled back completely, queries totals per category with a \`GROUP BY\`, and writes a UTF-8 report file atomically.
It uses the **H2** in-memory database so you can run it with no server installed; switching to PostgreSQL or MySQL is a matter of changing the JDBC URL and driver dependency (the DDL comment shows the MySQL variant of the identity column). Create a Maven project with the dependencies in the header comment, put the file under \`src/main/java/com/example/expenses/\`, and run it.
What to verify when it runs:
1. The first import inserts 6 rows and commits.
2. The second import contains a negative amount that violates the \`CHECK\` constraint; the DAO rolls back and the row count stays 6 — not 7 or 8.
3. \`totalsByCategory\` prints realistic rupee totals using \`BigDecimal\`.
4. \`report.txt\` exists next to the CSV and contains the summary.
Extensions to try on your own: add a \`WatchService\` loop that imports any new CSV dropped into the \`inbox/\` folder; replace the CSV with a JSON array parsed by Jackson; add \`findById\` tests with an in-memory fake DAO; and switch the URL to a local PostgreSQL to see the same code work unchanged.`,
      codeSnippet: `// src/main/java/com/example/expenses/ExpenseApp.java
// Maven dependencies:
//   com.zaxxer:HikariCP:7.1.0
//   com.h2database:h2:2.3.232
//   (swap H2 for org.postgresql:postgresql:42.7.10 or com.mysql:mysql-connector-j:9.7.0 and change the URL)
// Run: mvn -q compile exec:java -Dexec.mainClass=com.example.expenses.ExpenseApp
package com.example.expenses;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import javax.sql.DataSource;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.*;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Stream;
import static java.nio.file.StandardCopyOption.*;

record Expense(Long id, LocalDate spentOn, String category, String description, BigDecimal amount) {}

class DataAccessException extends RuntimeException {
    DataAccessException(String msg, Throwable cause) { super(msg, cause); }
}

interface ExpenseDao {
    int saveAll(List<Expense> expenses);                 // one transaction, batched
    Optional<Expense> findById(long id);
    long count();
    Map<String, BigDecimal> totalsByCategory();
}

class JdbcExpenseDao implements ExpenseDao {
    private final DataSource ds;
    JdbcExpenseDao(DataSource ds) { this.ds = ds; }

    void createSchema() {
        String ddl = """
            CREATE TABLE IF NOT EXISTS expenses (
              id          BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
              spent_on    DATE          NOT NULL,
              category    VARCHAR(40)   NOT NULL,
              description VARCHAR(200)  NOT NULL,
              amount      DECIMAL(12,2) NOT NULL CHECK (amount > 0)
            )""";   // MySQL: id BIGINT AUTO_INCREMENT PRIMARY KEY
        try (Connection c = ds.getConnection(); Statement st = c.createStatement()) {
            st.execute(ddl);
        } catch (SQLException e) {
            throw new DataAccessException("schema creation failed", e);
        }
    }

    @Override public int saveAll(List<Expense> expenses) {
        String sql = "INSERT INTO expenses (spent_on, category, description, amount) VALUES (?, ?, ?, ?)";
        try (Connection c = ds.getConnection()) {
            c.setAutoCommit(false);
            try (PreparedStatement ps = c.prepareStatement(sql)) {
                for (Expense e : expenses) {
                    ps.setObject(1, e.spentOn());            // JDBC 4.2: java.time directly
                    ps.setString(2, e.category());
                    ps.setString(3, e.description());
                    ps.setBigDecimal(4, e.amount());
                    ps.addBatch();
                }
                int[] counts = ps.executeBatch();
                c.commit();
                return Arrays.stream(counts).sum();
            } catch (SQLException e) {
                c.rollback();                                 // all-or-nothing
                throw new DataAccessException("batch insert rolled back: " + e.getMessage(), e);
            } finally {
                c.setAutoCommit(true);                        // return the pooled connection clean
            }
        } catch (SQLException e) {
            throw new DataAccessException("could not obtain connection", e);
        }
    }

    @Override public Optional<Expense> findById(long id) {
        String sql = "SELECT id, spent_on, category, description, amount FROM expenses WHERE id = ?";
        try (Connection c = ds.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? Optional.of(mapRow(rs)) : Optional.empty();
            }
        } catch (SQLException e) {
            throw new DataAccessException("findById failed", e);
        }
    }

    @Override public long count() {
        try (Connection c = ds.getConnection(); Statement st = c.createStatement();
             ResultSet rs = st.executeQuery("SELECT COUNT(*) FROM expenses")) {
            rs.next();
            return rs.getLong(1);
        } catch (SQLException e) {
            throw new DataAccessException("count failed", e);
        }
    }

    @Override public Map<String, BigDecimal> totalsByCategory() {
        String sql = "SELECT category, SUM(amount) AS total FROM expenses GROUP BY category ORDER BY total DESC";
        try (Connection c = ds.getConnection(); PreparedStatement ps = c.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            Map<String, BigDecimal> totals = new LinkedHashMap<>();
            while (rs.next()) totals.put(rs.getString("category"), rs.getBigDecimal("total"));
            return totals;
        } catch (SQLException e) {
            throw new DataAccessException("totals failed", e);
        }
    }

    private static Expense mapRow(ResultSet rs) throws SQLException {
        return new Expense(rs.getLong("id"), rs.getObject("spent_on", LocalDate.class),
                rs.getString("category"), rs.getString("description"), rs.getBigDecimal("amount"));
    }
}

public class ExpenseApp {
    static HikariDataSource pool() {
        HikariConfig cfg = new HikariConfig();
        cfg.setJdbcUrl(System.getProperty("db.url", "jdbc:h2:mem:expenses;DB_CLOSE_DELAY=-1"));
        cfg.setUsername(System.getProperty("db.user", "sa"));
        cfg.setPassword(System.getProperty("db.pass", ""));
        cfg.setPoolName("expense-pool");
        cfg.setMaximumPoolSize(4);
        return new HikariDataSource(cfg);
    }

    // CSV line -> Expense, trusting only the shape we generated
    static Expense parse(String line) {
        String[] f = line.split(",");
        return new Expense(null, LocalDate.parse(f[0].trim()), f[1].trim(), f[2].trim(), new BigDecimal(f[3].trim()));
    }

    static List<Expense> readCsv(Path csv) throws IOException {
        try (Stream<String> lines = Files.lines(csv)) {
            return lines.skip(1)                                  // header
                        .filter(l -> !l.isBlank())
                        .map(ExpenseApp::parse)
                        .toList();
        }
    }

    public static void main(String[] args) throws IOException {
        Path dir = Files.createDirectories(Path.of("expense-data"));
        Path csv = dir.resolve("october.csv");
        Files.writeString(csv, """
            date,category,description,amount
            2026-10-01,Rent,Flat in Koramangala,22000.00
            2026-10-02,Food,Swiggy and groceries,3450.50
            2026-10-03,Travel,Metro card recharge,1000.00
            2026-10-05,Food,Team lunch,1200.00
            2026-10-07,Utilities,Electricity bill,1860.75
            2026-10-08,Travel,Cab to airport,850.00
            """);

        try (HikariDataSource ds = pool()) {
            JdbcExpenseDao dao = new JdbcExpenseDao(ds);
            dao.createSchema();

            // 1) Good import: 6 rows in one transaction
            List<Expense> october = readCsv(csv);
            int inserted = dao.saveAll(october);
            System.out.println("inserted: " + inserted + ", count now: " + dao.count());

            // 2) Bad batch: the second row violates CHECK (amount > 0) -> whole batch rolled back
            List<Expense> bad = List.of(
                    new Expense(null, LocalDate.of(2026, 10, 9), "Food", "Coffee", new BigDecimal("180.00")),
                    new Expense(null, LocalDate.of(2026, 10, 9), "Refund", "Wrong sign", new BigDecimal("-500.00")));
            try {
                dao.saveAll(bad);
            } catch (DataAccessException e) {
                System.out.println("rollback demo: " + e.getMessage().split(";")[0]);
            }
            System.out.println("count after failed batch: " + dao.count());   // still 6

            // 3) Query back
            dao.findById(1).ifPresent(e -> System.out.println("first: " + e));
            Map<String, BigDecimal> totals = dao.totalsByCategory();
            totals.forEach((cat, total) -> System.out.printf("  %-10s ₹%,12.2f%n", cat, total));

            // 4) Atomic report write (temp file + atomic move)
            Path report = dir.resolve("report.txt");
            Path tmp = report.resolveSibling("report.txt.tmp");
            List<String> lines = new ArrayList<>();
            lines.add("Expense report for October 2026 (" + dao.count() + " entries)");
            totals.forEach((cat, total) -> lines.add(String.format("%-10s ₹%,12.2f", cat, total)));
            BigDecimal grand = totals.values().stream().reduce(BigDecimal.ZERO, BigDecimal::add);
            lines.add(String.format("%-10s ₹%,12.2f", "TOTAL", grand));
            Files.write(tmp, lines);
            Files.move(tmp, report, ATOMIC_MOVE, REPLACE_EXISTING);
            System.out.println("report written: " + report.toAbsolutePath() + " (" + Files.size(report) + " bytes)");
        }
    }
}
/* Expected output:
inserted: 6, count now: 6
rollback demo: batch insert rolled back: Check constraint violation: "CONSTRAINT_... (AMOUNT > 0)"
count after failed batch: 6
first: Expense[id=1, spentOn=2026-10-01, category=Rent, description=Flat in Koramangala, amount=22000.00]
  Rent       ₹   22,000.00
  Food       ₹    4,650.50
  Utilities  ₹    1,860.75
  Travel     ₹    1,850.00
report written: ...\\expense-data\\report.txt (179 bytes)
*/`
    },
    {
      heading: "18. Summary",
      content: `• **java.io** provides byte streams and character readers/writers in a decorator style; **NIO.2 (java.nio.file, Java 7)** adds \`Path\` and \`Files\`, which you should use for all new file code. UTF-8 is the default for \`Files\` methods and, since Java 18, for the whole platform.
• \`Path\` is an immutable location: \`resolve\`, \`relativize\`, \`normalize\` (plus \`startsWith\` to block directory traversal). \`Files\` creates, copies, moves (atomically), deletes and queries files with precise exceptions.
• Read small files whole with \`readString\` / \`readAllLines\` / \`readAllBytes\`; stream large ones with \`Files.lines\`, buffered readers and \`transferTo\`. Always close streams with try-with-resources and name charsets when talking to other systems.
• Walk directories with \`Files.list\`, \`Files.walk\`, \`Files.find\` (attributes for free) and \`walkFileTree\` (per-file error handling); delete trees in reverse order; watch directories with \`WatchService\`.
• Java serialization is fragile (\`serialVersionUID\`, skipped constructors, transient fields) and dangerous with untrusted input; use \`ObjectInputFilter\` if you must, and prefer JSON. Records serialize through their canonical constructor.
• Jackson's \`ObjectMapper\` handles JSON; register \`JavaTimeModule\`, use records or annotations, \`TypeReference\` for generics. Jackson 3 (\`tools.jackson\`) is the default in Spring Boot 4; Jackson 2 remains common.
• JDBC: \`DataSource\` → \`Connection\` → \`PreparedStatement\` → \`ResultSet\`, all closed with try-with-resources. Drivers self-register; URLs look like \`jdbc:postgresql://host:5432/db\` and \`jdbc:mysql://host:3306/db\`.
• \`PreparedStatement\` with bound parameters prevents SQL injection; identifiers need allowlists. Read \`ResultSet\` with \`while (rs.next())\`, typed getters, \`getObject(col, LocalDate.class)\`, \`wasNull\`, and \`BigDecimal\` for money.
• Transactions: \`setAutoCommit(false)\`, \`commit\` in try, \`rollback\` in catch, restore auto-commit in finally; savepoints for partial rollback; know the four isolation levels and the MySQL/PostgreSQL defaults.
• HikariCP pools connections: ~10 connections sized for the database, short \`connectionTimeout\`, \`maxLifetime\` below server timeouts, \`leakDetectionThreshold\` to find leaks. It is Spring Boot's default pool.
• The DAO pattern isolates SQL behind an interface that takes a \`DataSource\`, maps rows in one place, returns \`Optional\` for single lookups and throws an unchecked \`DataAccessException\`.
**Next lecture:** Build Tools & Testing — Maven, Gradle, JUnit 5 & Mockito`
    }
  ]
};
