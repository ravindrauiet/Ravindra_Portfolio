export const lecture09 = {
  slug: "lecture-9",
  number: 9,
  title: "Complete Python Course — Lecture 9: Working with Files, JSON, CSV & pathlib",
  summary: "Learn modern Python file handling: open() with context managers, text vs binary modes, UTF-8 encoding, reading and writing line by line, pathlib.Path, glob, os and shutil, JSON with json.load and json.dump, CSV with DictReader and DictWriter, .env files and processing large files efficiently.",
  readTime: "55 min read",
  difficulty: "Intermediate",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. Introduction: Why File Handling, JSON and CSV Matter in Real Python Projects",
      content: `Almost every real program reads or writes data that lives outside its own memory: a configuration file, a log, a CSV export from Tally or an ERP, a JSON response saved from an API, images uploaded by users, or a 5 GB server log that must be scanned for errors. **File handling** is the bridge between your Python code and that outside world, and it is one of the first things a working developer is asked to do on day one of a job.
Python makes this unusually pleasant. The built-in \`open()\` function, the \`with\` statement, the \`pathlib\` module for paths, and the \`json\` and \`csv\` modules in the standard library mean you can parse a 50,000-row spreadsheet export or persist application settings without installing anything. Yet the same simplicity hides traps: forgetting to close a file, reading a whole 8 GB file into memory, writing a Hindi or Tamil string with the wrong encoding and getting garbage, or building paths with string concatenation that break on Windows.
In this lecture you will learn, in order:
• How to open files safely with context managers and understand text versus binary modes.
• Why **encoding="utf-8"** should be in nearly every \`open()\` call you write.
• Reading and writing line by line, so memory stays flat no matter how large the file is.
• The object-oriented \`pathlib.Path\` API, globbing for files, and the older \`os\` and \`shutil\` helpers you still need.
• Serialising Python data to **JSON** with \`json.dump\` and reading it back with \`json.load\`.
• Processing **CSV** files correctly with \`csv.DictReader\` and \`csv.DictWriter\`, including the famous \`newline=""\` rule.
• Keeping secrets such as API keys out of code with **environment variables and .env files**.
• Techniques for **large files**: streaming, chunked reads, generators and atomic writes.
Lecture 8 taught you exceptions and logging; here you will see \`FileNotFoundError\`, \`PermissionError\`, \`UnicodeDecodeError\` and \`json.JSONDecodeError\` in their natural habitat. Lecture 10 will go deeper into iterators, generators and writing your own context managers, which is exactly the machinery that makes \`with open(...)\` work.
This lecture targets Python 3.13/3.14 (Python 3.14 is the current stable series as of writing, with 3.15 scheduled for release in October 2026). Features are labelled with the version that introduced them where it matters.`,
      codeSnippet: `# quick_tour.py — the four tools you will use most in this lecture
import json
import csv
from pathlib import Path

data_dir = Path("data")
data_dir.mkdir(exist_ok=True)              # create folder if it does not exist

# 1. Write a text file safely
with open(data_dir / "hello.txt", "w", encoding="utf-8") as f:
    f.write("Namaste from Patna!\\n")

# 2. Save a Python dict as JSON
settings = {"city": "Bengaluru", "currency": "INR", "max_items": 50}
with open(data_dir / "settings.json", "w", encoding="utf-8") as f:
    json.dump(settings, f, indent=2, ensure_ascii=False)

# 3. Write a CSV with a header row
rows = [{"name": "Asha", "amount": 1250.50}, {"name": "Rahul", "amount": 980.00}]
with open(data_dir / "sales.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["name", "amount"])
    writer.writeheader()
    writer.writerows(rows)

# 4. List what we created
for path in sorted(data_dir.iterdir()):
    print(path.name, path.stat().st_size, "bytes")
# hello.txt 20 bytes
# sales.csv 39 bytes
# settings.json 65 bytes`
    },
    {
      heading: "2. Opening Files with open() and the with Context Manager",
      content: `The built-in \`open(file, mode="r", encoding=None, newline=None, ...)\` returns a **file object**. Reading and writing go through that object, and when you are done the file must be **closed** so the operating system can release the file handle and flush any buffered data to disk. Every process has a limit on open handles (often 1,024 on Linux by default), and buffered writes that are never flushed simply disappear if the program crashes.
The old way was \`f = open(...)\`, work, then \`f.close()\`. The problem is exceptions: if an error is raised between \`open\` and \`close\`, the \`close()\` line never runs. You could wrap everything in \`try/finally\`, but Python gives you a cleaner tool: the **\`with\` statement**, also called a **context manager**. \`with open(...) as f:\` guarantees that \`f.close()\` is called when the block ends, whether it ends normally, via \`return\`, or because of an exception. This is the single most important habit in Python file handling: **always open files with \`with\`**.
A file object supports several reading methods:
• \`f.read()\` — the entire remaining content as one string (or bytes). Fine for small files, dangerous for large ones.
• \`f.read(n)\` — at most \`n\` characters (text mode) or bytes (binary mode).
• \`f.readline()\` — one line including its trailing newline, or an empty string at end of file.
• \`f.readlines()\` — a list of all lines; same memory concern as \`read()\`.
• Iterating with \`for line in f:\` — one line at a time, lazily. This is the preferred way.
For writing you have \`f.write(string)\`, which returns the number of characters written and does **not** add a newline, and \`f.writelines(iterable)\`, which also adds nothing between items. You can open several files in one \`with\` statement by separating them with commas, and since Python 3.10 you can wrap that list in parentheses across multiple lines.
A file object also remembers its position. \`f.tell()\` returns the current offset and \`f.seek(0)\` jumps back to the start, which is how you re-read a file without reopening it.`,
      codeSnippet: `# open_basics.py
from pathlib import Path

Path("notes.txt").write_text("line one\\nline two\\nline three\\n", encoding="utf-8")

# The safe pattern: the file is closed automatically, even if an error occurs
with open("notes.txt", "r", encoding="utf-8") as f:
    first = f.readline()          # 'line one\\n'
    rest = f.read()               # 'line two\\nline three\\n'
    print(repr(first), repr(rest))

print(f.closed)                   # True - closed by the with block

# What the with statement is doing for you (do NOT write this by hand)
f = open("notes.txt", encoding="utf-8")
try:
    content = f.read()
finally:
    f.close()

# Reading and writing two files in one with statement (parentheses: Python 3.10+)
with (
    open("notes.txt", encoding="utf-8") as src,
    open("notes_upper.txt", "w", encoding="utf-8") as dst,
):
    for line in src:
        dst.write(line.upper())

# seek/tell let you move around inside the file
with open("notes.txt", encoding="utf-8") as f:
    f.readline()
    print(f.tell())               # 9  (bytes consumed so far)
    f.seek(0)                     # back to the beginning
    print(f.readline().strip())   # line one`
    },
    {
      heading: "3. File Modes Explained: Text vs Binary, Read, Write and Append",
      content: `The \`mode\` string tells Python two things: **what you intend to do** and **whether the data is text or bytes**.
The intent characters:
• \`"r"\` — read (default). The file must exist or you get \`FileNotFoundError\`.
• \`"w"\` — write. **Creates the file if missing and truncates it to zero length if it exists.** This silently destroys existing content, which is the most common cause of "my data vanished" bugs.
• \`"a"\` — append. Creates if missing, otherwise writes go to the end. Ideal for logs.
• \`"x"\` — exclusive create. Fails with \`FileExistsError\` if the file already exists, which is safer than \`"w"\` when you must never overwrite.
• Adding \`"+"\` enables both reading and writing: \`"r+"\` (read and write, no truncation), \`"w+"\` (truncate then read/write), \`"a+"\`.
The data-type character:
• **Text mode** (default, or explicit \`"t"\`): Python decodes bytes into \`str\` using an encoding, and translates platform newlines (\`\\r\\n\` on Windows) into \`\\n\` when reading. You get strings in, strings out.
• **Binary mode** (\`"b"\`, as in \`"rb"\`, \`"wb"\`, \`"ab"\`): no decoding and no newline translation. You get \`bytes\` objects. Use it for images, PDFs, ZIP files, audio, pickles, and anything you download from the internet whose format you are not parsing as text.
Why does this distinction matter? If you open a JPEG in text mode, the decoder will hit byte sequences that are not valid UTF-8 and raise \`UnicodeDecodeError\`, or worse, on Windows the newline translation will corrupt the data. Conversely, if you open a text file in binary mode, you must call \`.decode("utf-8")\` yourself and remember to handle line endings.
A practical rule: **"what would I see if I opened this in Notepad?"** If it is readable text, use text mode with an explicit encoding. If it is gibberish, use binary mode.`,
      codeSnippet: `# modes_demo.py
from pathlib import Path

# "w" truncates - the first write wipes anything that was there before
with open("report.txt", "w", encoding="utf-8") as f:
    f.write("Total sales: 1,20,000\\n")

# "a" appends - safe for logs
with open("report.txt", "a", encoding="utf-8") as f:
    f.write("Generated on 2026-10-09\\n")

# "x" refuses to overwrite
try:
    with open("report.txt", "x", encoding="utf-8") as f:
        f.write("never written")
except FileExistsError:
    print("report.txt already exists - not overwriting")

# Binary mode: copy an image byte for byte
logo = Path("logo.png")
if logo.exists():
    with open(logo, "rb") as src, open("logo_copy.png", "wb") as dst:
        dst.write(src.read())

# Inspect the first bytes of a file to detect its real type (magic numbers)
with open("report.txt", "rb") as f:
    head = f.read(4)
print(head)                 # b'Tota'
print(head.decode("utf-8")) # Tota
# A PNG would start with b'\\x89PNG', a PDF with b'%PDF', a ZIP with b'PK'`
    },
    {
      heading: "4. Encodings in Python: Why You Should Always Pass encoding=\"utf-8\"",
      content: `A file on disk is just bytes. An **encoding** is the rule that maps characters to bytes and back. ASCII covers only 128 English characters; Latin-1 and Windows-1252 cover Western European languages; **UTF-8** covers every character in Unicode, including Devanagari, Tamil, Bengali, the rupee sign ₹ (U+20B9, stored as the three bytes E2 82 B9) and emoji. UTF-8 is backwards compatible with ASCII, is the standard on the web and in Linux, and is what JSON, Git, GitHub and practically every modern tool expect.
The catch is that \`open()\` in text mode, when you do not pass \`encoding\`, uses the **locale's preferred encoding**. On macOS and most Linux systems that is UTF-8. On many Windows machines in India it is still \`cp1252\`. So code that works on your Ubuntu laptop can crash on a colleague's Windows desktop with \`UnicodeEncodeError: 'charmap' codec can't encode character '\\u20b9'\` when it tries to write a rupee sign, or produce "mojibake" like \`à¤¨à¤®à¤¸à¥à¤¤à¥‡\` instead of नमस्ते when reading.
The fix is a habit: **always pass \`encoding="utf-8"\` to \`open()\`, \`Path.read_text()\` and \`Path.write_text()\`**. Note the version story:
• Python 3.7 added **UTF-8 Mode**: run with \`python -X utf8\` or set \`PYTHONUTF8=1\` to make UTF-8 the default everywhere.
• Python 3.10 added \`EncodingWarning\`, emitted when you run \`python -X warn_default_encoding\` and call \`open()\` without an encoding, so you can find the missing arguments in a large codebase.
• Python 3.11 added \`locale.getencoding()\`.
• **PEP 686** schedules UTF-8 as the default file encoding in **Python 3.15**, finally ending the problem. Until every machine you deploy to runs 3.15, keep passing it explicitly.
When you must read a file of unknown or dirty encoding, \`open()\` accepts an \`errors\` argument: \`errors="replace"\` substitutes undecodable bytes with the U+FFFD replacement character, \`errors="ignore"\` drops them, and \`errors="surrogateescape"\` lets you round-trip bad bytes unchanged. Use these deliberately for salvage jobs, never as a way to hide a bug. If a file comes from Excel on Windows it is often \`cp1252\` or \`utf-8-sig\` (UTF-8 with a byte-order mark); opening with \`encoding="utf-8-sig"\` strips the invisible BOM that would otherwise appear glued to your first column name.`,
      codeSnippet: `# encodings_demo.py
text = "Invoice total: ₹1,250 — धन्यवाद"

# The same string becomes different bytes under different encodings
print(text.encode("utf-8"))        # b'Invoice total: \\xe2\\x82\\xb91,250 \\xe2\\x80\\x94 \\xe0\\xa4\\xa7...'
print(len(text), len(text.encode("utf-8")))   # 31 characters, 49 bytes

try:
    text.encode("cp1252")
except UnicodeEncodeError as e:
    print("cp1252 cannot store this:", e.reason)   # character maps to <undefined>

# Correct: explicit UTF-8 on write AND read - works identically on every OS
with open("invoice.txt", "w", encoding="utf-8") as f:
    f.write(text)
with open("invoice.txt", encoding="utf-8") as f:
    print(f.read() == text)        # True

# Wrong decoding produces mojibake instead of crashing - hard to notice!
with open("invoice.txt", encoding="latin-1") as f:
    print(f.read()[15:21])         # 'â\\x82¹1,2'  (garbage)

# Salvage a file with unknown bytes without crashing
with open("invoice.txt", encoding="ascii", errors="replace") as f:
    print(f.read()[:24])           # 'Invoice total: ���1,250 '

# Excel CSV exports often carry a BOM: utf-8-sig removes it
with open("from_excel.csv", "w", encoding="utf-8-sig") as f:
    f.write("name,amount\\nAsha,100\\n")
with open("from_excel.csv", encoding="utf-8") as f:
    print(repr(f.readline()))      # '\\ufeffname,amount\\n'  <- BOM leaked into the header
with open("from_excel.csv", encoding="utf-8-sig") as f:
    print(repr(f.readline()))      # 'name,amount\\n'         <- clean`
    },
    {
      heading: "5. Reading and Writing Files Line by Line",
      content: `A text file object is an **iterator over lines**. Writing \`for line in f:\` asks the operating system for a buffered chunk (8 KB by default), hands you one line at a time, and only fetches more when needed. Memory usage stays roughly constant whether the file is 2 KB or 20 GB. Compare that with \`f.read()\` or \`f.readlines()\`, which must hold the entire file as one Python object: a 3 GB log needs more than 3 GB of RAM (Python strings have overhead), and your process gets killed.
Each line you receive **keeps its trailing newline** (\`"\\n"\`). Almost every line-processing loop therefore starts with \`line.rstrip("\\n")\` or \`line.strip()\`. Use \`rstrip("\\n")\` when leading spaces matter (indented data, fixed-width records) and \`strip()\` when you want everything trimmed. Also be aware that the last line of a file may or may not end with a newline, so never assume it does.
Writing line by line is symmetrical. \`f.write()\` does not add a newline, so you add it yourself, usually with an f-string: \`f.write(f"{name},{amount}\\n")\`. Another idiom is \`print(name, amount, sep=",", file=f)\`, which adds the newline for you and is handy for quick reports. For large outputs, do not accumulate a giant string and write it once; write as you go and let Python's buffer batch the disk writes efficiently.
Common line-oriented tasks you will meet in practice:
• Counting lines (\`sum(1 for _ in f)\`) without loading the file.
• Filtering: copy only lines containing \`"ERROR"\` to another file.
• Transforming: convert every line to a record and yield it from a generator (next lecture).
• Reading the first N lines with \`itertools.islice(f, N)\`.
• Reading the last few lines of a huge file efficiently by seeking from the end in binary mode, as a tail command does.
Because the file object is an iterator, you can also pass it straight to functions that accept iterables: \`csv.reader(f)\`, \`max(f, key=len)\`, \`enumerate(f, start=1)\` for line numbers, and so on.`,
      codeSnippet: `# lines_demo.py — scan a log for errors without loading it fully
from itertools import islice
from pathlib import Path

log = Path("app.log")
log.write_text(
    "2026-10-09 10:01:02 INFO  server started on port 8000\\n"
    "2026-10-09 10:03:15 ERROR payment gateway timeout order=A-1021\\n"
    "2026-10-09 10:03:20 INFO  retry succeeded order=A-1021\\n"
    "2026-10-09 10:07:44 ERROR database connection refused\\n",
    encoding="utf-8",
)

# 1. Line by line, memory stays flat regardless of file size
error_count = 0
with open(log, encoding="utf-8") as src, open("errors_only.log", "w", encoding="utf-8") as dst:
    for line_no, line in enumerate(src, start=1):
        if " ERROR " in line:
            error_count += 1
            dst.write(f"{line_no}: {line}")       # line already ends with \\n
print("errors found:", error_count)              # errors found: 2

# 2. First two lines only
with open(log, encoding="utf-8") as f:
    for line in islice(f, 2):
        print(line.rstrip("\\n"))

# 3. Count lines cheaply
with open(log, encoding="utf-8") as f:
    print("total lines:", sum(1 for _ in f))      # total lines: 4

# 4. print() with file= adds the newline for you
with open("summary.txt", "w", encoding="utf-8") as f:
    print("Log:", log.name, file=f)
    print("Errors:", error_count, file=f)
print(Path("summary.txt").read_text(encoding="utf-8"))`
    },
    {
      heading: "6. pathlib.Path: The Modern Way to Work with File Paths in Python",
      content: `Before Python 3.4, paths were plain strings glued together with \`os.path.join()\`, and every operation lived in a different module. **\`pathlib\`** replaced that with one object, \`Path\`, that understands what a path is. A \`Path\` knows its parts, can be joined with the \`/\` operator, and can create, read, rename, inspect and delete the thing it points to. In modern Python, \`pathlib\` is the default choice; you reach for \`os\` and \`shutil\` only for the few things \`Path\` does not do.
Building paths:
• \`Path("data") / "raw" / "sales.csv"\` — join with \`/\`; the right separator is used on every OS.
• \`Path.cwd()\` — current working directory; \`Path.home()\` — the user's home folder.
• \`Path(__file__).parent\` — the folder containing the current script. This is the correct base for files that ship with your project, because the current working directory depends on where the user ran \`python\` from.
Reading parts of a path (pure operations, no disk access): \`.name\` (\`"sales.csv"\`), \`.stem\` (\`"sales"\`), \`.suffix\` (\`".csv"\`), \`.suffixes\`, \`.parent\`, \`.parents[1]\`, \`.parts\`, \`.anchor\`, \`.with_suffix(".json")\`, \`.with_name("other.csv")\`, \`.with_stem("sales_2026")\` (3.9+), \`.is_absolute()\`, \`.relative_to(base)\`.
Touching the disk: \`.exists()\`, \`.is_file()\`, \`.is_dir()\`, \`.stat().st_size\`, \`.stat().st_mtime\`, \`.resolve()\` (absolute path with symlinks resolved), \`.mkdir(parents=True, exist_ok=True)\`, \`.touch()\`, \`.rename(target)\`, \`.replace(target)\` (overwrites), \`.unlink(missing_ok=True)\` (delete a file, 3.8+ for the flag), \`.rmdir()\` (empty directory only), \`.iterdir()\`.
Convenience I/O: \`.read_text(encoding="utf-8")\`, \`.write_text(text, encoding="utf-8")\`, \`.read_bytes()\`, \`.write_bytes()\`, and \`.open(mode, encoding=...)\` which behaves exactly like the built-in \`open()\`. The convenience methods are perfect for small files; for large files use \`.open()\` and iterate.
Recent additions worth labelling: \`Path.walk()\` (3.12) mirrors \`os.walk\`; \`Path.from_uri()\` and \`Path.full_match()\` (3.13); and Python 3.14 added \`Path.copy()\`, \`Path.copy_into()\`, \`Path.move()\` and \`Path.move_into()\` so copying and moving no longer require \`shutil\`. If your code must also run on 3.13, keep using \`shutil\` for those two operations.
Finally, \`Path\` objects are accepted anywhere a path string is accepted in the standard library (\`open\`, \`os\`, \`shutil\`, \`json\`, \`subprocess\`) thanks to the \`os.PathLike\` protocol. Some third-party libraries still want a string; call \`str(path)\` for them.`,
      codeSnippet: `# pathlib_demo.py
from pathlib import Path
from datetime import datetime

BASE_DIR = Path(__file__).resolve().parent     # folder of this script, not the cwd
raw = BASE_DIR / "data" / "raw" / "sales_mumbai.csv"

# Pure path operations - no disk access
print(raw.name)                 # sales_mumbai.csv
print(raw.stem, raw.suffix)     # sales_mumbai .csv
print(raw.parent.name)          # raw
print(raw.with_suffix(".json")) # .../data/raw/sales_mumbai.json
print(raw.with_stem("sales_pune").name)   # sales_pune.csv   (3.9+)
print(raw.relative_to(BASE_DIR))          # data/raw/sales_mumbai.csv

# Create the folder tree and a file
raw.parent.mkdir(parents=True, exist_ok=True)
raw.write_text("city,amount\\nMumbai,1200\\nMumbai,800\\n", encoding="utf-8")

# Inspect it
print(raw.exists(), raw.is_file(), raw.stat().st_size)   # True True 35
modified = datetime.fromtimestamp(raw.stat().st_mtime)
print("modified:", modified.strftime("%d %b %Y %H:%M"))

# Read it back and move it to a processed folder
print(raw.read_text(encoding="utf-8").splitlines()[0])   # city,amount
processed = BASE_DIR / "data" / "processed"
processed.mkdir(exist_ok=True)
target = raw.replace(processed / raw.name)   # rename/move, overwrite if exists
print(target)                                # .../data/processed/sales_mumbai.csv

# Delete safely
target.unlink(missing_ok=True)
print(target.exists())                       # False`
    },
    {
      heading: "7. Finding Files with glob, rglob and Pattern Matching",
      content: `Real projects rarely deal with one file. You get a folder of daily exports (\`sales_2026-10-01.csv\`, \`sales_2026-10-02.csv\`...) or a photo dump of mixed \`.jpg\` and \`.png\` files, and you need to find the right ones. **Globbing** is pattern matching for file names, using shell-style wildcards rather than regular expressions:
• \`*\` — any sequence of characters within one path segment (does not cross \`/\`).
• \`?\` — exactly one character.
• \`[abc]\` and \`[0-9]\` — one character from the set.
• \`**\` — any number of nested directories (recursive).
With \`pathlib\`, \`Path("data").glob("*.csv")\` yields matching paths in the \`data\` folder only, and \`Path("data").rglob("*.csv")\` (equivalent to \`glob("**/*.csv")\`) searches every subfolder. Both return **generators**, so results arrive lazily and in no guaranteed order; wrap them in \`sorted()\` when order matters, which it usually does for reproducible scripts. Python 3.12 added a \`case_sensitive\` keyword to \`glob\`/\`rglob\`, and 3.13 added \`recurse_symlinks\`.
Globbing matches names, not content, so combine it with path properties for finer filtering: \`p.suffix.lower() in {".jpg", ".png"}\` handles both upper- and lower-case extensions; \`p.stat().st_size > 10_000_000\` finds files above 10 MB; \`p.stat().st_mtime\` finds files modified in the last 24 hours. For truly complex name rules, fall back to \`re\` on \`p.name\`.
Two related tools: \`Path.iterdir()\` lists direct children (files and folders) without any pattern, and \`Path.match("*.csv")\` tests a single path against a pattern. The older \`glob\` module (\`glob.glob("data/**/*.csv", recursive=True)\`) returns a list of strings and is still common in tutorials; prefer the \`pathlib\` version in new code.
Be careful with \`**\` on huge trees such as \`node_modules\` or a home directory: the walk itself takes time, and a pattern typo can silently return nothing. Print the count before processing.`,
      codeSnippet: `# glob_demo.py
from pathlib import Path
import time

root = Path("exports")
for city in ("mumbai", "delhi", "pune"):
    (root / city / "2026").mkdir(parents=True, exist_ok=True)
    (root / city / "2026" / f"sales_{city}_oct.csv").write_text("x", encoding="utf-8")
    (root / city / "readme.TXT").write_text("notes", encoding="utf-8")
(root / "mumbai" / "2026" / "photo.JPG").write_bytes(b"\\xff\\xd8" + b"0" * 5000)

# Only direct children of exports/
print([p.name for p in sorted(root.glob("*"))])          # ['delhi', 'mumbai', 'pune']

# Every CSV anywhere below exports/
csv_files = sorted(root.rglob("*.csv"))
print(len(csv_files), "csv files")                       # 3 csv files
for p in csv_files:
    print(p.relative_to(root).as_posix())
# delhi/2026/sales_delhi_oct.csv
# mumbai/2026/sales_mumbai_oct.csv
# pune/2026/sales_pune_oct.csv

# Character class: only mumbai or pune
print([p.name for p in root.rglob("sales_[mp]*.csv")])

# Case-insensitive extension matching, done by hand (portable to every version)
images = [p for p in root.rglob("*") if p.suffix.lower() in {".jpg", ".png"}]
print(images)                                            # [.../photo.JPG]

# Files larger than 4 KB modified in the last hour
cutoff = time.time() - 3600
big_recent = [
    p for p in root.rglob("*")
    if p.is_file() and p.stat().st_size > 4096 and p.stat().st_mtime > cutoff
]
print([p.name for p in big_recent])                      # ['photo.JPG']

# Path.walk (3.12+): directory-by-directory traversal like os.walk
for dirpath, dirnames, filenames in root.walk():
    print(dirpath.relative_to(root).as_posix() or ".", "->", filenames)`
    },
    {
      heading: "8. os and shutil Basics: Directories, Copying, Moving and Deleting",
      content: `\`pathlib\` covers most path work, but two older modules remain essential. **\`os\`** exposes operating-system services: the current directory, environment variables, process IDs and low-level file operations. **\`shutil\`** ("shell utilities") provides the high-level copy, move and delete operations you would do with \`cp\`, \`mv\` and \`rm -r\` in a terminal.
From \`os\` you will regularly use:
• \`os.getcwd()\` and \`os.chdir(path)\` — read or change the working directory (avoid \`chdir\` in libraries; it is global state).
• \`os.environ\` — a mapping of environment variables (Section 11).
• \`os.makedirs(path, exist_ok=True)\` — create nested folders; same as \`Path.mkdir(parents=True, exist_ok=True)\`.
• \`os.listdir(path)\` — names only, as strings; \`os.scandir(path)\` — faster, yields entries with cached \`is_file()\`/\`stat()\` information.
• \`os.remove()\`, \`os.rename()\`, \`os.replace()\` — delete and rename; \`os.replace\` is atomic on the same filesystem and overwrites on Windows too.
• \`os.walk(top)\` — yields \`(dirpath, dirnames, filenames)\` for every folder; \`os.path.getsize()\`, \`os.path.exists()\`, \`os.path.join()\` for code that still uses strings.
From \`shutil\`:
• \`shutil.copy(src, dst)\` copies content and permission bits; \`shutil.copy2()\` also preserves timestamps; \`shutil.copyfile()\` copies content only. If \`dst\` is a directory, the file is placed inside it.
• \`shutil.copytree(src, dst, dirs_exist_ok=True)\` — copy a whole folder (the flag, added in 3.8, allows merging into an existing target).
• \`shutil.move(src, dst)\` — move or rename; works across drives, where a plain rename would fail.
• \`shutil.rmtree(path)\` — delete a folder and everything inside it. **There is no undo.** Guard it with a check that the path is where you expect, and never build it from unvalidated user input.
• \`shutil.disk_usage(path)\` — total, used and free bytes; \`shutil.make_archive("backup", "zip", folder)\` — create a ZIP; \`shutil.which("ffmpeg")\` — locate an executable on PATH.
Python 3.14's \`Path.copy()\`, \`Path.copy_into()\`, \`Path.move()\` and \`Path.move_into()\` wrap the common \`shutil\` cases on a \`Path\` object; on 3.13 and earlier, \`shutil\` is still the only way.`,
      codeSnippet: `# os_shutil_demo.py — nightly backup of a project folder
import os
import shutil
from datetime import date
from pathlib import Path

project = Path("myapp")
(project / "src").mkdir(parents=True, exist_ok=True)
(project / "src" / "main.py").write_text("print('hi')\\n", encoding="utf-8")
(project / "config.json").write_text("{}", encoding="utf-8")

# 1. Where am I? Which disk space is left?
print("cwd:", os.getcwd())
usage = shutil.disk_usage(".")
print(f"free: {usage.free / 1024**3:.1f} GB of {usage.total / 1024**3:.1f} GB")

# 2. Copy a single file into a folder (keeps timestamps with copy2)
backups = Path("backups")
backups.mkdir(exist_ok=True)
shutil.copy2(project / "config.json", backups)       # -> backups/config.json

# 3. Copy the whole tree, merging into an existing folder (3.8+)
snapshot = backups / f"myapp_{date.today():%Y%m%d}"
shutil.copytree(project, snapshot, dirs_exist_ok=True)

# 4. Zip it: creates backups/myapp_20261009.zip
archive = shutil.make_archive(str(snapshot), "zip", root_dir=snapshot)
print("archive:", archive, os.path.getsize(archive), "bytes")

# 5. os.walk to report sizes per folder
for dirpath, dirnames, filenames in os.walk(project):
    total = sum(os.path.getsize(os.path.join(dirpath, f)) for f in filenames)
    print(f"{dirpath}: {len(filenames)} files, {total} bytes")

# 6. Clean up the snapshot folder - guarded, because rmtree is irreversible
if snapshot.is_dir() and snapshot.parent == backups:
    shutil.rmtree(snapshot)

# 7. Move the zip to an archive folder (works across drives, unlike rename)
archive_dir = Path("archive")
archive_dir.mkdir(exist_ok=True)
shutil.move(archive, archive_dir / Path(archive).name)
print(sorted(p.name for p in archive_dir.iterdir()))`
    },
    {
      heading: "9. Working with JSON in Python: json.load, json.dump, json.loads and json.dumps",
      content: `**JSON** (JavaScript Object Notation) is the universal format for APIs, configuration and data exchange: a text format with objects (\`{}\`), arrays (\`[]\`), strings, numbers, \`true\`/\`false\` and \`null\`. Python's \`json\` module converts between JSON text and Python objects with four functions. Remember the naming: the ones ending in **s** work with **s**trings, the others with **files**.
• \`json.dumps(obj)\` — Python object to JSON **string**.
• \`json.loads(text)\` — JSON string to Python object.
• \`json.dump(obj, file)\` — write JSON to an open file object.
• \`json.load(file)\` — read JSON from an open file object.
The type mapping is: \`dict\` ↔ object, \`list\` and \`tuple\` → array (arrays always come back as \`list\`), \`str\` ↔ string, \`int\`/\`float\` ↔ number, \`True\`/\`False\` ↔ \`true\`/\`false\`, \`None\` ↔ \`null\`. Anything else, such as \`datetime\`, \`Decimal\`, \`set\`, \`Path\` or your own classes, raises \`TypeError: Object of type datetime is not JSON serializable\`. The simplest fix is the \`default=\` argument: a function that converts unknown objects, commonly \`default=str\`. For dataclasses, \`dataclasses.asdict()\` turns them into dicts first. Dictionary keys are always converted to strings, so \`{1: "a"}\` becomes \`{"1": "a"}\` and the integer key is lost on the way back.
Useful \`dump\`/\`dumps\` options: \`indent=2\` for human-readable files, \`sort_keys=True\` for stable diffs in Git, \`ensure_ascii=False\` so that Hindi text and ₹ are stored as real UTF-8 characters instead of \`\\u20b9\` escapes (pair it with \`encoding="utf-8"\` on the file), and \`separators=(",", ":")\` for the most compact output when sending over a network.
Reading: invalid JSON raises \`json.JSONDecodeError\`, a subclass of \`ValueError\`, with \`.lineno\`, \`.colno\` and \`.msg\` attributes that tell you exactly where the file is broken. Catch it specifically and log those details. Note that JSON does not allow trailing commas, single quotes or comments; if a hand-edited config file "looks fine" but fails to parse, those are the usual suspects.
When saving application state, write the JSON to a temporary file and then \`os.replace()\` it over the real one. If the program crashes halfway through \`json.dump\`, the old file stays intact instead of being left as a truncated, unparseable fragment.`,
      codeSnippet: `# json_demo.py
import json
import os
from dataclasses import dataclass, asdict
from datetime import datetime
from pathlib import Path

@dataclass
class Order:
    order_id: str
    customer: str
    city: str
    amount_inr: float
    placed_at: datetime

order = Order("A-1021", "Priya Sharma", "Jaipur", 2499.0, datetime(2026, 10, 9, 14, 30))

# Python -> JSON string. default=str handles datetime; ensure_ascii=False keeps ₹ readable
text = json.dumps(asdict(order) | {"note": "COD ₹50 extra"}, indent=2, default=str, ensure_ascii=False)
print(text)
# {
#   "order_id": "A-1021",
#   ...
#   "placed_at": "2026-10-09 14:30:00",
#   "note": "COD ₹50 extra"
# }

# JSON string -> Python
data = json.loads(text)
print(type(data), data["amount_inr"], type(data["placed_at"]))   # <class 'dict'> 2499.0 <class 'str'>

# Files: json.dump / json.load - always open with encoding="utf-8"
path = Path("orders.json")
orders = [asdict(order) for _ in range(2)]
with open(path, "w", encoding="utf-8") as f:
    json.dump(orders, f, indent=2, default=str, ensure_ascii=False)
with open(path, encoding="utf-8") as f:
    loaded = json.load(f)
print(len(loaded), loaded[0]["customer"])                         # 2 Priya Sharma

# Handling broken JSON precisely
try:
    json.loads('{"city": "Pune", }')      # trailing comma is NOT allowed in JSON
except json.JSONDecodeError as e:
    print(f"Invalid JSON at line {e.lineno} col {e.colno}: {e.msg}")
    # Invalid JSON at line 1 col 18: Expecting property name enclosed in double quotes

# Atomic save: never leave a half-written settings file behind
def save_json_atomic(obj, target: Path) -> None:
    tmp = target.with_suffix(target.suffix + ".tmp")
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(obj, f, indent=2, ensure_ascii=False)
    os.replace(tmp, target)          # atomic on the same filesystem

save_json_atomic({"theme": "dark", "lang": "hi"}, Path("settings.json"))
print(Path("settings.json").read_text(encoding="utf-8"))`
    },
    {
      heading: "10. Reading and Writing CSV Files with csv.DictReader and csv.DictWriter",
      content: `**CSV** (comma-separated values) is the lingua franca of spreadsheets, banks, government portals and every "Export" button. It looks trivial, one record per line with commas between fields, but the details bite: fields that contain commas must be quoted (\`"Sharma, Priya"\`), quotes inside quoted fields are doubled, some exports use semicolons or tabs, and Excel on Windows writes \`\\r\\n\` line endings. Never parse CSV with \`line.split(",")\`; use the **\`csv\`** module, which handles all of these rules.
The module offers two reader styles. \`csv.reader(f)\` yields each row as a **list** of strings, and you index by position (\`row[2]\`), which is fragile when a column is added. \`csv.DictReader(f)\` reads the first row as the header and yields each subsequent row as a **dict** keyed by column name, so your code says \`row["amount"]\` and survives column reordering. Likewise \`csv.writer\` takes lists, while \`csv.DictWriter(f, fieldnames=[...])\` takes dicts, writes a header with \`.writeheader()\`, and refuses unexpected keys unless you pass \`extrasaction="ignore"\`.
Three rules you must remember:
1. **Open the file with \`newline=""\`** for both reading and writing. The \`csv\` module does its own newline handling; without this, on Windows you get a blank line after every record when writing, and embedded newlines inside quoted fields are corrupted when reading. This is documented, not a bug, and it is the number one CSV question on Stack Overflow.
2. **Everything is a string.** \`row["amount"]\` is \`"1250.50"\`, not a float; \`row["qty"]\` is \`"3"\`. Convert explicitly with \`float()\`, \`int()\`, \`Decimal()\` or \`datetime.strptime()\`, and expect empty strings for missing values.
3. **Pass \`encoding="utf-8"\`** (or \`"utf-8-sig"\` for Excel exports with a BOM; see Section 4).
Dialects and delimiters: pass \`delimiter=";"\` or \`delimiter="\\t"\` for semicolon- or tab-separated files, \`quoting=csv.QUOTE_MINIMAL\` (default) or \`csv.QUOTE_ALL\`, and \`csv.Sniffer().sniff(sample)\` to guess the format of an unknown file. For large CSVs, \`DictReader\` is itself an iterator, so a \`for row in reader:\` loop streams the file without loading it.
When should you use **pandas** instead? When you need joins, group-bys, pivot tables or statistics over the data: \`pd.read_csv()\` parses types automatically and handles millions of rows. For a simple ETL step, validation or a script with no other dependencies, the standard \`csv\` module is lighter and faster to start.`,
      codeSnippet: `# csv_demo.py
import csv
from collections import defaultdict
from pathlib import Path

src = Path("orders.csv")
src.write_text(
    'order_id,customer,city,amount,status\\n'
    'A-1001,"Sharma, Priya",Jaipur,2499.00,delivered\\n'
    'A-1002,Rahul Verma,Mumbai,799.50,delivered\\n'
    "A-1003,Anita D'Souza,Mumbai,1500.00,returned\\n"
    'A-1004,Vikram Singh,Jaipur,,pending\\n',       # missing amount
    encoding="utf-8",
)

# Read as dicts - note newline="" and the explicit encoding
totals: dict[str, float] = defaultdict(float)
with open(src, newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    print(reader.fieldnames)            # ['order_id', 'customer', 'city', 'amount', 'status']
    for row in reader:
        amount = float(row["amount"] or 0)         # "" -> 0.0, "2499.00" -> 2499.0
        if row["status"] == "delivered":
            totals[row["city"]] += amount
print(dict(totals))                     # {'Jaipur': 2499.0, 'Mumbai': 799.5}

# Write a summary CSV with DictWriter
out = Path("city_totals.csv")
with open(out, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["city", "delivered_total_inr"])
    writer.writeheader()
    for city, total in sorted(totals.items()):
        writer.writerow({"city": city, "delivered_total_inr": f"{total:.2f}"})
print(out.read_text(encoding="utf-8"))
# city,delivered_total_inr
# Jaipur,2499.00
# Mumbai,799.50

# Tab-separated input and quoting of tricky fields
with open("contacts.tsv", "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f, delimiter="\\t", quoting=csv.QUOTE_MINIMAL)
    w.writerow(["name", "address"])
    w.writerow(["Asha", "12, MG Road\\nBengaluru"])        # embedded newline is quoted safely
with open("contacts.tsv", newline="", encoding="utf-8") as f:
    for row in csv.reader(f, delimiter="\\t"):
        print(row)
# ['name', 'address']
# ['Asha', '12, MG Road\\nBengaluru']`
    },
    {
      heading: "11. Environment Variables and .env Files: Keeping Secrets Out of Your Code",
      content: `A database password, a Razorpay API key or an AWS secret must never be typed into a \`.py\` file. The moment that file is committed to Git, the secret is in the history forever, and public GitHub repositories are scanned by bots within minutes. The standard solution is **environment variables**: named values the operating system passes to a process when it starts. Your code reads them at runtime; the actual values live in the deployment environment (Docker, systemd, GitHub Actions secrets, Render, Railway, AWS), not in the repository. This is item III of the "Twelve-Factor App" methodology and every hosting platform supports it.
In Python, \`os.environ\` is a dictionary-like view of these variables. \`os.environ["DATABASE_URL"]\` raises \`KeyError\` if the variable is missing, which is often what you want for a required secret (fail fast at startup rather than deep inside a request). \`os.environ.get("LOG_LEVEL", "INFO")\` and \`os.getenv("LOG_LEVEL", "INFO")\` return a default instead. Every value is a **string**: convert \`"8000"\` with \`int()\` and treat \`"true"\`/\`"1"\` carefully for booleans, since \`bool("false")\` is \`True\`.
During local development, exporting ten variables by hand before every run is tedious, so the community convention is a **\`.env\` file** in the project root with one \`KEY=value\` per line. The third-party package \`python-dotenv\` (install with \`uv add python-dotenv\` or \`pip install python-dotenv\`) provides \`load_dotenv()\`, which reads that file and inserts its entries into \`os.environ\` without overriding variables that are already set, so production values always win. Then:
• Add \`.env\` to \`.gitignore\` immediately. Commit a \`.env.example\` with placeholder values so teammates know which variables exist.
• Keep \`.env\` for development only. In production, set real environment variables through the platform.
• Call \`load_dotenv()\` once, at the top of your entry point, before importing modules that read settings.
For larger applications, **pydantic-settings** (part of the Pydantic v2 family) defines a \`BaseSettings\` class with typed fields; it reads from the environment and \`.env\`, converts types, validates, and gives you a single \`settings\` object with autocomplete. FastAPI projects almost universally use this pattern.
Finally, environment variables are inherited by child processes and can appear in crash dumps and logs. Never log \`os.environ\` wholesale, and mask secrets when printing configuration.`,
      codeSnippet: `# .env  (in the project root — add this file to .gitignore!)
# DATABASE_URL=postgresql://app:secret@localhost:5432/shop
# RAZORPAY_KEY_ID=rzp_test_abc123
# RAZORPAY_KEY_SECRET=do_not_commit_me
# DEBUG=true
# PORT=8000

# config.py
import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv          # uv add python-dotenv  /  pip install python-dotenv

# Load .env from the project root regardless of the current working directory
load_dotenv(Path(__file__).resolve().parent / ".env")

def env_bool(name: str, default: bool = False) -> bool:
    return os.environ.get(name, str(default)).strip().lower() in {"1", "true", "yes", "on"}

@dataclass(frozen=True)
class Settings:
    database_url: str
    razorpay_key_id: str
    razorpay_key_secret: str
    debug: bool
    port: int

def load_settings() -> Settings:
    try:
        return Settings(
            database_url=os.environ["DATABASE_URL"],            # required -> KeyError if missing
            razorpay_key_id=os.environ["RAZORPAY_KEY_ID"],
            razorpay_key_secret=os.environ["RAZORPAY_KEY_SECRET"],
            debug=env_bool("DEBUG"),
            port=int(os.environ.get("PORT", "8000")),          # optional with default
        )
    except KeyError as e:
        raise SystemExit(f"Missing required environment variable: {e.args[0]}") from e

settings = load_settings()

def masked(secret: str) -> str:
    return secret[:4] + "*" * max(0, len(secret) - 4)

if __name__ == "__main__":
    print("port:", settings.port, "debug:", settings.debug)
    print("razorpay key:", masked(settings.razorpay_key_secret))   # do_n************

# Equivalent with pydantic-settings (uv add pydantic-settings):
# from pydantic_settings import BaseSettings, SettingsConfigDict
# class Settings(BaseSettings):
#     model_config = SettingsConfigDict(env_file=".env")
#     database_url: str
#     debug: bool = False
#     port: int = 8000
# settings = Settings()      # reads, converts and validates automatically`
    },
    {
      heading: "12. Handling Large Files Efficiently in Python",
      content: `A "large" file is one that does not comfortably fit in RAM: a 4 GB Apache log, a 20 GB CSV dump from a data warehouse, or a video upload. The techniques below keep memory usage flat and are all standard library.
**1. Stream lines, never \`read()\`.** \`for line in f:\` (Section 5) reads one buffered line at a time. The same applies to \`csv.DictReader\` and to \`json\` only if the file is **JSON Lines** (one JSON object per line, \`.jsonl\`), which is why logging systems and ML datasets prefer JSONL over one giant array. A single huge JSON array cannot be streamed by the standard \`json\` module; use the third-party \`ijson\` package for that or split the file.
**2. Read binary data in chunks.** For hashing, uploading or copying, loop with \`while chunk := f.read(1024 * 1024):\` (the walrus operator, Python 3.8+) and process each 1 MB block. \`hashlib.file_digest(f, "sha256")\` (3.11+) does exactly this internally. \`shutil.copyfileobj(src, dst, length=1024*1024)\` copies with a chunk size you choose.
**3. Wrap the stream in generators.** A function that \`yield\`s parsed records from a file lets you compose filters and transformations as a pipeline, each stage holding one record. Lecture 10 covers generators in depth; you will see a preview in the snippet.
**4. Avoid repeated \`stat\` and \`open\` calls in loops.** Opening a file is expensive (a system call plus buffer allocation). Open once, process everything, close once. Appending to a log inside a loop of 100,000 iterations by reopening each time can be 50x slower than keeping the file open.
**5. Use \`mmap\` for random access.** \`mmap.mmap\` maps the file into virtual memory so you can slice it like a \`bytes\` object; the OS pages in only the parts you touch. Great for searching a large binary file or jumping to offsets.
**6. Tune the buffer when it matters.** \`open(..., buffering=1024*1024)\` increases the buffer for sequential throughput on fast disks; \`buffering=1\` gives line buffering for logs you tail in real time.
**7. Write atomically and in one pass.** Write to a temporary file and \`os.replace()\` it into place (Section 9). For a multi-GB output, flush progress periodically and log it so operators can see it is alive.
**8. Measure before optimising.** Use \`tracemalloc\` or \`resource\` to check peak memory, and \`time.perf_counter()\` for timing. On a laptop SSD, streaming a 2 GB text file line by line takes about 10-20 seconds in pure Python and uses under 50 MB of RAM; \`readlines()\` on the same file needs more than 2 GB and may be killed.
For truly heavy analytics (aggregations over hundreds of millions of rows), move to \`pandas.read_csv(chunksize=...)\`, Polars, DuckDB or a database, all of which stream or use multiple cores.`,
      codeSnippet: `# large_files.py
import hashlib
import shutil
import tracemalloc
from pathlib import Path
from typing import Iterator

big = Path("big.log")
if not big.exists():                      # create ~60 MB of sample log lines once
    with open(big, "w", encoding="utf-8") as f:
        for i in range(1_000_000):
            level = "ERROR" if i % 97 == 0 else "INFO"
            f.write(f"2026-10-09 10:{i % 60:02d}:00 {level} request_id={i} took={i % 500}ms\\n")
print(f"size: {big.stat().st_size / 1024**2:.1f} MB")

# 1. Generator pipeline: parse -> filter -> aggregate, one line in memory at a time
def read_records(path: Path) -> Iterator[dict]:
    with open(path, encoding="utf-8") as f:
        for line in f:
            date, time_, level, *fields = line.split()
            kv = dict(field.split("=", 1) for field in fields)
            yield {"time": time_, "level": level, **kv}

def slow_errors(records: Iterator[dict], threshold_ms: int) -> Iterator[dict]:
    for r in records:
        if r["level"] == "ERROR" and int(r["took"].rstrip("ms")) > threshold_ms:
            yield r

tracemalloc.start()
count = sum(1 for _ in slow_errors(read_records(big), threshold_ms=400))
current, peak = tracemalloc.get_traced_memory()
tracemalloc.stop()
print(f"slow errors: {count}, peak memory: {peak / 1024**2:.1f} MB")   # ~2,000 errors, <1 MB

# 2. Hash a big file in 1 MB chunks (constant memory)
sha = hashlib.sha256()
with open(big, "rb") as f:
    while chunk := f.read(1024 * 1024):
        sha.update(chunk)
print("sha256:", sha.hexdigest()[:16], "...")
with open(big, "rb") as f:                                 # same thing, Python 3.11+
    print("file_digest:", hashlib.file_digest(f, "sha256").hexdigest()[:16], "...")

# 3. Chunked copy with a chosen buffer size
with open(big, "rb") as src, open("big_copy.log", "wb") as dst:
    shutil.copyfileobj(src, dst, length=4 * 1024 * 1024)

# 4. Tail: read only the last 2 KB instead of the whole file
with open(big, "rb") as f:
    f.seek(0, 2)                     # 2 = from end of file
    size = f.tell()
    f.seek(max(0, size - 2048))
    last_lines = f.read().decode("utf-8", errors="replace").splitlines()[-3:]
print(*last_lines, sep="\\n")`
    },
    {
      heading: "13. Real-World Use Cases: How File, JSON and CSV Handling Is Used in Production",
      content: `The techniques in this lecture are not academic; they are the daily bread of backend, data and DevOps work. Some concrete patterns you will meet in Indian product companies and services firms alike:
• **ETL and reconciliation scripts.** A payments team receives a daily settlement CSV from a bank or from Razorpay, reads it with \`csv.DictReader\`, matches each row against orders in the database, and writes a mismatch report as another CSV plus a JSON summary posted to Slack. \`newline=""\`, \`utf-8-sig\` for the bank's Excel export and \`Decimal\` for amounts are all non-negotiable here.
• **Configuration management.** Services load settings from environment variables and \`.env\` (development) with defaults in code, while feature flags and static lookup tables (GST slabs, pin-code to city maps) ship as JSON files read once at startup with \`json.load\` and cached in a module-level variable.
• **Log processing and incident analysis.** When an outage happens, an engineer streams a multi-GB Nginx or application log line by line, filters by request ID or status code, and aggregates counts per minute. The generator pipeline from Section 12 is exactly this job.
• **Data engineering pipelines.** Airflow or cron jobs glob \`rglob("*.parquet")\` or \`rglob("*.csv.gz")\` in a landing folder, process new files, move them to \`processed/\` with \`Path.replace\`, and write a manifest JSON. Idempotency is achieved by checking the manifest before reprocessing.
• **Machine learning.** Training scripts read JSONL datasets line by line, write checkpoints and metrics as JSON, and use \`Path(__file__).parent\` so they work from any working directory on the GPU server.
• **Web backends.** A FastAPI endpoint accepts an uploaded file (\`UploadFile\`), streams it to disk in chunks under a safe generated name (never the user-supplied filename), validates the magic bytes, and stores metadata as JSON in the database. Downloads use \`FileResponse\` which streams from a \`Path\`.
• **CLI tools and automation.** Internal tools rename thousands of files by pattern, generate reports to \`~/reports/2026-10/\`, back up folders with \`shutil.make_archive\`, and clean temporary directories older than seven days using \`stat().st_mtime\`.
• **Testing.** pytest's \`tmp_path\` fixture gives every test a fresh \`Path\` in a temporary directory, so file-handling code is tested against real files without touching the project folder. The standard library's \`tempfile.TemporaryDirectory()\` does the same outside pytest.
In every one of these, the same hygiene applies: explicit encodings, context managers, \`pathlib\`, streaming for anything large, and secrets in the environment.`,
      codeSnippet: `# process_settlements.py — a realistic daily job (standard library only)
import csv
import json
import logging
from datetime import date
from decimal import Decimal
from pathlib import Path

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("settlements")

BASE = Path(__file__).resolve().parent
LANDING, PROCESSED, REPORTS = BASE / "landing", BASE / "processed", BASE / "reports"
for d in (LANDING, PROCESSED, REPORTS):
    d.mkdir(exist_ok=True)

# Simulate a bank file arriving (Excel export: utf-8-sig, CRLF line endings)
sample = LANDING / "settlement_2026-10-09.csv"
sample.write_text("utr,amount,status\\r\\nUTR001,2499.00,SUCCESS\\r\\nUTR002,799.50,FAILED\\r\\n",
                  encoding="utf-8-sig", newline="")      # newline="" keeps \\r\\n as-is (3.10+)

manifest_path = REPORTS / "manifest.json"
manifest = json.loads(manifest_path.read_text(encoding="utf-8")) if manifest_path.exists() else {"done": []}

for file in sorted(LANDING.glob("settlement_*.csv")):
    if file.name in manifest["done"]:
        log.info("skip %s (already processed)", file.name)
        continue

    success_total, failed = Decimal("0"), []
    with open(file, newline="", encoding="utf-8-sig") as f:
        for row in csv.DictReader(f):
            if row["status"] == "SUCCESS":
                success_total += Decimal(row["amount"])
            else:
                failed.append(row["utr"])

    report = {"file": file.name, "date": str(date.today()),
              "success_total_inr": str(success_total), "failed_utrs": failed}
    (REPORTS / file.with_suffix(".json").name).write_text(
        json.dumps(report, indent=2), encoding="utf-8")

    file.replace(PROCESSED / file.name)          # move out of landing
    manifest["done"].append(file.name)
    log.info("processed %s: total=%s failed=%d", file.name, success_total, len(failed))

manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
# 2026-10-09 ... INFO processed settlement_2026-10-09.csv: total=2499.00 failed=1`
    },
    {
      heading: "14. Common Mistakes with Python File Handling and How to Fix Them",
      content: `**1. Not using \`with\`.** \`f = open(...)\` followed by work and no guaranteed \`close()\` leaks file handles and loses buffered writes on a crash. Fix: always \`with open(...) as f:\`. If you need the file open across several functions, pass the file object in, or use \`contextlib.ExitStack\`.
**2. Omitting \`encoding="utf-8"\`.** Works on your Mac, breaks on a Windows server with \`UnicodeEncodeError\` or produces mojibake. Fix: pass the encoding to every \`open()\`, \`read_text()\` and \`write_text()\` until Python 3.15 makes it the default.
**3. Using \`"w"\` when you meant \`"a"\`.** The log file has only the last line, or the data file is empty after a second run. Fix: \`"a"\` for appending; \`"x"\` when you must never overwrite.
**4. Reading a huge file with \`read()\` or \`readlines()\`.** \`MemoryError\` or the OOM killer. Fix: iterate line by line or in chunks (Section 12).
**5. Forgetting \`newline=""\` with the \`csv\` module.** Blank lines between rows on Windows, broken multi-line fields. Fix: \`open(path, newline="", encoding="utf-8")\` for every CSV read and write.
**6. Treating CSV values as numbers.** \`row["amount"] > 1000\` raises \`TypeError\` because \`row["amount"]\` is a string. Fix: convert explicitly, and handle empty strings.
**7. Relative paths that depend on the working directory.** The script works from the project folder but fails from cron or from VS Code's debugger with \`FileNotFoundError\`. Fix: anchor on \`Path(__file__).resolve().parent\` for bundled files, or accept the path as a command-line argument.
**8. Building paths with string concatenation.** \`folder + "/" + name\` or hard-coded backslashes break across operating systems and with trailing slashes. Fix: \`Path(folder) / name\`.
**9. Checking \`exists()\` before \`open()\` (race condition).** The file can be deleted between the check and the open; the check also doubles the system calls. Fix: just open it and catch \`FileNotFoundError\` (EAFP, "easier to ask forgiveness than permission"), as Lecture 8 taught.
**10. \`json.dump\` of \`datetime\`, \`Decimal\`, \`set\` or dataclass instances.** \`TypeError: not JSON serializable\`. Fix: \`default=str\`, \`asdict()\`, or convert to ISO strings before dumping; use \`parse_float=Decimal\` in \`json.loads\` for money.
**11. Naming your own file \`csv.py\`, \`json.py\` or \`pathlib.py\`.** Your script shadows the standard module and you get \`AttributeError: module 'csv' has no attribute 'DictReader'\`. Fix: rename the file and delete the stale \`__pycache__\`.
**12. Writing while iterating the same file**, or opening the same path for reading and writing simultaneously, produces corrupted or empty output. Fix: write to a temporary file and \`os.replace()\` it over the original.
**13. Hard-coding secrets or committing \`.env\`.** Fix: \`.gitignore\` the \`.env\`, commit \`.env.example\`, rotate any key that was ever pushed.
**14. \`shutil.rmtree\` on a path built from user input.** One stray \`..\` or an empty string and you delete the wrong directory. Fix: resolve the path and assert it is inside the folder you own before deleting.`,
      codeSnippet: `# mistakes_fixed.py — before/after for the most frequent bugs
import csv
import json
import os
import shutil
from decimal import Decimal
from pathlib import Path

BASE = Path(__file__).resolve().parent

# 2 + 7 + 8: explicit encoding, path anchored to the script, joined with /
config_path = BASE / "config" / "app.json"

# 9: EAFP instead of exists() + open()
try:
    with open(config_path, encoding="utf-8") as f:
        config = json.load(f)
except FileNotFoundError:
    config = {"currency": "INR"}             # sensible default
    config_path.parent.mkdir(parents=True, exist_ok=True)
    config_path.write_text(json.dumps(config, indent=2), encoding="utf-8")

# 5 + 6: newline="" and explicit numeric conversion with Decimal for money
rows_path = BASE / "payments.csv"
rows_path.write_text("id,amount\\n1,199.99\\n2,\\n3,50\\n", encoding="utf-8")
total = Decimal("0")
with open(rows_path, newline="", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        total += Decimal(row["amount"] or "0")
print("total:", total)                       # total: 249.99

# 12: rewrite a file safely via a temp file + atomic replace
def strip_blank_lines(path: Path) -> None:
    tmp = path.with_suffix(".tmp")
    with open(path, encoding="utf-8") as src, open(tmp, "w", encoding="utf-8") as dst:
        for line in src:
            if line.strip():
                dst.write(line)
    os.replace(tmp, path)

strip_blank_lines(rows_path)

# 14: guard destructive operations
def safe_delete_tree(target: Path, sandbox: Path) -> None:
    target, sandbox = target.resolve(), sandbox.resolve()
    if sandbox not in target.parents:
        raise ValueError(f"refusing to delete {target}: outside {sandbox}")
    shutil.rmtree(target)

try:
    safe_delete_tree(Path("/"), BASE)
except ValueError as e:
    print(e)`
    },
    {
      heading: "15. Frequently Asked Questions about Python File Handling, JSON and CSV",
      content: `**What is the difference between json.load and json.loads in Python?**
\`json.load(f)\` reads JSON from an open file object; \`json.loads(s)\` parses JSON from a string that is already in memory (the trailing "s" stands for string). The same relationship holds for \`json.dump(obj, f)\` and \`json.dumps(obj)\`. Use \`loads\`/\`dumps\` for API responses and messages, and \`load\`/\`dump\` for files.
**Why do I get a blank line after every row when writing CSV in Python on Windows?**
Because the file was opened without \`newline=""\`. The \`csv\` module writes \`\\r\\n\` as the row terminator, and text mode on Windows translates that \`\\n\` into another \`\\r\\n\`, producing \`\\r\\r\\n\`. Opening with \`newline=""\` disables the translation and the module handles line endings itself, as the documentation requires.
**How do I read a file line by line in Python without loading it into memory?**
Iterate over the file object: \`with open(path, encoding="utf-8") as f: for line in f: ...\`. Python reads buffered chunks and yields one line at a time, so memory stays constant for files of any size. Avoid \`f.read()\` and \`f.readlines()\` for large files.
**Should I use pathlib or os.path in Python?**
Use \`pathlib.Path\` for new code: it is object-oriented, joins paths with \`/\`, and includes reading, writing, globbing and metadata in one API. \`os.path\` is not deprecated and is still fine in older codebases, but mixing both in a new project adds confusion. Keep \`os\` for environment variables and \`shutil\` for copy, move and recursive delete on Python 3.13 and earlier.
**How do I write Hindi or the rupee symbol to a file in Python without UnicodeEncodeError?**
Open the file with \`encoding="utf-8"\`. The error happens when Python falls back to the system encoding (often \`cp1252\` on Windows), which cannot represent those characters. For JSON, also pass \`ensure_ascii=False\` to \`json.dump\` so the characters are stored directly rather than as \`\\uXXXX\` escapes.
**How do I store API keys securely in a Python project?**
Put them in environment variables and read them with \`os.environ\`. For local development, keep them in a \`.env\` file loaded with \`python-dotenv\` and add \`.env\` to \`.gitignore\`. In production, set the variables through your hosting platform or a secrets manager. Never commit real keys, and rotate any key that was ever pushed to a repository.
**What is the difference between text mode and binary mode in Python open()?**
Text mode (the default) decodes bytes into \`str\` using an encoding and normalises newlines; you work with strings. Binary mode (\`"rb"\`, \`"wb"\`) gives raw \`bytes\` with no decoding or newline translation; use it for images, PDFs, archives and any non-text data. Opening binary data in text mode raises \`UnicodeDecodeError\` or silently corrupts it.
**How can I process a CSV file that is bigger than my RAM in Python?**
Stream it: \`csv.DictReader\` yields one row at a time, so a \`for row in reader\` loop handles a 20 GB file with a few MB of memory, as long as you aggregate as you go rather than appending rows to a list. For heavy analytics, \`pandas.read_csv(path, chunksize=100_000)\` returns DataFrame chunks, and Polars or DuckDB can query the file directly.`
    },
    {
      heading: "16. Interview Questions and Answers on Python Files, JSON, CSV and pathlib",
      content: `**Q1. Why should you use the \`with\` statement when opening files?**
\`with\` invokes the file object's context manager protocol: \`__enter__\` returns the file, and \`__exit__\` closes it when the block ends, even if an exception is raised or the function returns early. This guarantees the file handle is released and buffered data is flushed, which a bare \`open()\`/\`close()\` pair cannot guarantee without \`try/finally\`.
**Q2. What does \`open()\` use as the encoding when you do not specify one, and why is that a problem?**
It uses \`locale.getencoding()\`, the platform's preferred encoding: typically UTF-8 on Linux and macOS but often \`cp1252\` on Windows. The same code therefore behaves differently across machines and can raise \`UnicodeEncodeError\` or decode text incorrectly. Python 3.7 added UTF-8 mode (\`PYTHONUTF8=1\`), 3.10 added \`EncodingWarning\` to detect the omission, and PEP 686 makes UTF-8 the default in Python 3.15.
**Q3. Explain the file modes \`r\`, \`w\`, \`a\`, \`x\`, \`r+\` and the \`b\` flag.**
\`r\` reads an existing file; \`w\` creates or truncates for writing; \`a\` appends, creating if needed; \`x\` creates exclusively and raises \`FileExistsError\` if the file exists; \`r+\` opens for reading and writing without truncating. Adding \`b\` switches to binary mode, which returns \`bytes\` and disables encoding and newline translation.
**Q4. What is the difference between \`csv.reader\` and \`csv.DictReader\`?**
\`csv.reader\` yields each row as a list of strings indexed by position. \`csv.DictReader\` uses the first row (or a supplied \`fieldnames\` list) as keys and yields each row as a dictionary, so code refers to columns by name and keeps working when columns are reordered. \`DictWriter\` is the writing counterpart and requires \`fieldnames\` plus a \`writeheader()\` call.
**Q5. How does Python's \`json\` module handle a \`datetime\` or a \`Decimal\`, and how do you fix it?**
Neither type has a JSON equivalent, so \`json.dumps\` raises \`TypeError: Object of type datetime is not JSON serializable\`. Supply \`default=\` with a function that converts unknown objects, for example \`default=str\` or one that calls \`.isoformat()\`, or convert values before dumping. For reading money precisely, pass \`parse_float=Decimal\` to \`json.loads\`.
**Q6. How would you read the last 10 lines of a 10 GB log file efficiently?**
Do not read from the start. Open the file in binary mode, \`seek()\` to a position near the end (\`f.seek(0, 2)\` then \`f.seek(size - block)\`), read that block, decode it, and split into lines; if fewer than 10 lines were found, step back another block and repeat. This touches only a few kilobytes regardless of file size, which is how the Unix \`tail\` command works.
**Q7. What does \`Path(__file__).resolve().parent\` give you and when do you need it?**
\`__file__\` is the path of the current module; \`resolve()\` makes it absolute and resolves symlinks; \`.parent\` is the directory containing it. Use it to locate files that ship with your code (templates, data, \`.env\`) so the script works regardless of the current working directory, which differs when launched from cron, Docker, a test runner or an IDE.
**Q8. What is an atomic file write and why does it matter?**
Writing directly to the target file leaves it truncated or half-written if the process crashes or the disk fills midway. An atomic write writes the complete content to a temporary file in the same directory and then calls \`os.replace(tmp, target)\`, which the OS performs as a single rename operation. Readers see either the complete old file or the complete new file, never a partial one. This is standard practice for configuration, state and checkpoint files.
**Q9. What is the difference between \`shutil.copy\`, \`shutil.copy2\` and \`shutil.copyfile\`?**
\`copyfile\` copies only the content and requires a file path as destination. \`copy\` copies content and permission bits and accepts a directory as destination. \`copy2\` is \`copy\` plus metadata such as modification time. In Python 3.14, \`Path.copy()\` and \`Path.copy_into()\` provide the same capability on \`Path\` objects.
**Q10. How do \`os.environ.get\`, \`os.environ[]\` and \`load_dotenv\` differ?**
\`os.environ["KEY"]\` raises \`KeyError\` when the variable is absent, which is appropriate for required secrets. \`os.environ.get("KEY", default)\` returns a fallback for optional settings. \`load_dotenv()\` from \`python-dotenv\` reads a \`.env\` file and populates \`os.environ\` for development, without overriding variables already set, so production environment values take precedence.`
    },
    {
      heading: "17. Hands-On Exercise: Build a Sales Report Generator (CSV to JSON with pathlib)",
      content: `Put everything together in one small tool that a store chain might actually run. The program:
1. Reads settings from environment variables (\`SALES_DATA_DIR\`, \`REPORT_DIR\`, \`MIN_ORDER_INR\`) with sensible defaults, using a tiny built-in \`.env\` loader so it needs **no third-party packages**.
2. Creates realistic sample CSV files for three cities the first time it runs, including a BOM, a quoted name with a comma, an empty amount and a bad number, so the parsing code is exercised properly.
3. Globs all \`sales_*.csv\` files under the data folder with \`rglob\`, streams each with \`csv.DictReader\` using \`newline=""\` and \`utf-8-sig\`, validates rows and collects bad ones into a separate CSV instead of crashing.
4. Aggregates revenue, order count and top product per city with plain dictionaries and \`Decimal\`.
5. Writes \`summary.json\` atomically (temporary file plus \`os.replace\`), writes \`city_summary.csv\` with \`DictWriter\`, and moves processed inputs into a \`processed/\` folder.
6. Logs progress with the \`logging\` module from Lecture 8.
Run it with \`python sales_report.py\`, then open the \`reports\` folder. Then try these extensions on your own:
• Add a \`--since 2026-10-01\` command-line argument using \`argparse\` and filter rows by date.
• Write the per-city totals as JSON Lines (one city per line) and read them back with a generator.
• Replace the hand-written \`.env\` loader with \`python-dotenv\` and the settings dictionary with a \`dataclass\`.
• Write a pytest test that uses \`tmp_path\` to create a two-row CSV and asserts the summary numbers.
Expected console output ends with \`INFO processed 3 files, 12 valid rows, 2 rejected\` and a printed table of city totals.`,
      codeSnippet: `# sales_report.py — complete, runnable, standard library only
import csv
import json
import logging
import os
from collections import Counter, defaultdict
from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation
from pathlib import Path

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
log = logging.getLogger("sales_report")

BASE_DIR = Path(__file__).resolve().parent


# ---------- 1. Settings from environment / .env ----------
def load_dotenv_minimal(path: Path) -> None:
    """Tiny .env loader: KEY=value lines, '#' comments, never overrides real env vars."""
    if not path.is_file():
        return
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, value = line.partition("=")
            os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


load_dotenv_minimal(BASE_DIR / ".env")
DATA_DIR = Path(os.environ.get("SALES_DATA_DIR", BASE_DIR / "data"))
REPORT_DIR = Path(os.environ.get("REPORT_DIR", BASE_DIR / "reports"))
MIN_ORDER = Decimal(os.environ.get("MIN_ORDER_INR", "1"))


# ---------- 2. Sample data (created only when no input files exist) ----------
SAMPLE = {
    "mumbai": [
        ("M-1", "2026-10-07", "Rahul Verma", "Headphones", "1999.00"),
        ("M-2", "2026-10-07", '"Sharma, Priya"', "Keyboard", "2499.50"),
        ("M-3", "2026-10-08", "Anita D'Souza", "Headphones", ""),          # missing amount
        ("M-4", "2026-10-08", "Vikram Singh", "Mouse", "699.00"),
    ],
    "delhi": [
        ("D-1", "2026-10-07", "Neha Gupta", "Monitor", "11499.00"),
        ("D-2", "2026-10-08", "Arjun Mehta", "Monitor", "11499.00"),
        ("D-3", "2026-10-08", "Kabir Khan", "Mouse", "abc"),               # bad number
        ("D-4", "2026-10-09", "Sana Ali", "Keyboard", "2499.50"),
    ],
    "pune": [
        ("P-1", "2026-10-08", "Omkar Patil", "Headphones", "1999.00"),
        ("P-2", "2026-10-08", "Sneha Kulkarni", "Mouse", "699.00"),
        ("P-3", "2026-10-09", "Rohan Joshi", "Mouse", "699.00"),
        ("P-4", "2026-10-09", "Isha Deshmukh", "Monitor", "11499.00"),
        ("P-5", "2026-10-09", "Aditya Rao", "Keyboard", "2499.50"),
        ("P-6", "2026-10-09", "Meera Nair", "Mouse", "699.00"),
    ],
}


def create_sample_data() -> None:
    for city, rows in SAMPLE.items():
        folder = DATA_DIR / city
        folder.mkdir(parents=True, exist_ok=True)
        path = folder / f"sales_{city}_oct.csv"
        with open(path, "w", newline="", encoding="utf-8-sig") as f:   # BOM, like Excel
            f.write("order_id,date,customer,product,amount\\n")
            for row in rows:
                f.write(",".join(row) + "\\n")
    log.info("sample data created under %s", DATA_DIR)


# ---------- 3. Streaming parse + validation ----------
def parse_sales_file(path: Path, rejects: csv.DictWriter, stats: Counter):
    """Yield valid rows one at a time; write invalid rows to the rejects CSV."""
    with open(path, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for line_no, row in enumerate(reader, start=2):      # header is line 1
            try:
                amount = Decimal(row["amount"])
                if amount < MIN_ORDER:
                    raise ValueError(f"amount below minimum {MIN_ORDER}")
                datetime.strptime(row["date"], "%Y-%m-%d")
            except (InvalidOperation, ValueError, KeyError) as e:
                rejects.writerow({"file": path.name, "line": line_no,
                                  "order_id": row.get("order_id", ""), "reason": str(e) or type(e).__name__})
                stats["rejected"] += 1
                continue
            stats["valid"] += 1
            yield {"city": path.parent.name, "product": row["product"],
                   "amount": amount, "date": row["date"]}


# ---------- 4. Aggregate ----------
def build_summary(files: list[Path]) -> tuple[dict, Counter]:
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    revenue: dict[str, Decimal] = defaultdict(Decimal)
    orders: Counter = Counter()
    products: dict[str, Counter] = defaultdict(Counter)
    stats: Counter = Counter()

    with open(REPORT_DIR / "rejected_rows.csv", "w", newline="", encoding="utf-8") as rf:
        rejects = csv.DictWriter(rf, fieldnames=["file", "line", "order_id", "reason"])
        rejects.writeheader()
        for path in files:
            before = stats["valid"]
            for rec in parse_sales_file(path, rejects, stats):
                revenue[rec["city"]] += rec["amount"]
                orders[rec["city"]] += 1
                products[rec["city"]][rec["product"]] += 1
            log.info("read %s: %d valid rows", path.relative_to(DATA_DIR).as_posix(), stats["valid"] - before)

    summary = {
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "cities": {
            city: {
                "orders": orders[city],
                "revenue_inr": str(revenue[city]),
                "average_order_inr": str((revenue[city] / orders[city]).quantize(Decimal("0.01"))),
                "top_product": products[city].most_common(1)[0][0],
            }
            for city in sorted(revenue)
        },
        "grand_total_inr": str(sum(revenue.values(), Decimal("0"))),
    }
    return summary, stats


# ---------- 5. Write outputs ----------
def write_json_atomic(obj: dict, target: Path) -> None:
    tmp = target.with_suffix(".json.tmp")
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(obj, f, indent=2, ensure_ascii=False)
    os.replace(tmp, target)


def write_city_csv(summary: dict, target: Path) -> None:
    with open(target, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["city", "orders", "revenue_inr", "average_order_inr", "top_product"])
        writer.writeheader()
        for city, city_stats in summary["cities"].items():
            writer.writerow({"city": city, **city_stats})


def main() -> None:
    files = sorted(p for p in DATA_DIR.rglob("sales_*.csv") if p.parent.name != "processed")
    if not files:
        create_sample_data()
        files = sorted(p for p in DATA_DIR.rglob("sales_*.csv") if p.parent.name != "processed")

    summary, stats = build_summary(files)
    write_json_atomic(summary, REPORT_DIR / "summary.json")
    write_city_csv(summary, REPORT_DIR / "city_summary.csv")

    processed = DATA_DIR / "processed"
    processed.mkdir(exist_ok=True)
    for path in files:
        path.replace(processed / path.name)

    log.info("processed %d files, %d valid rows, %d rejected", len(files), stats["valid"], stats["rejected"])
    print(f"\\n{'City':<10}{'Orders':>8}{'Revenue (₹)':>16}  Top product")
    for city, s in summary["cities"].items():
        print(f"{city:<10}{s['orders']:>8}{s['revenue_inr']:>16}  {s['top_product']}")
    print(f"{'TOTAL':<10}{stats['valid']:>8}{summary['grand_total_inr']:>16}")
    print(f"\\nReports written to {REPORT_DIR}")


if __name__ == "__main__":
    main()

# Expected output (first run):
# INFO sample data created under .../data
# INFO read delhi/sales_delhi_oct.csv: 3 valid rows
# INFO read mumbai/sales_mumbai_oct.csv: 3 valid rows
# INFO read pune/sales_pune_oct.csv: 6 valid rows
# INFO processed 3 files, 12 valid rows, 2 rejected
#
# City        Orders     Revenue (₹)  Top product
# delhi            3        25497.50  Monitor
# mumbai           3         5197.50  Headphones
# pune             6        18094.50  Mouse
# TOTAL           12        48789.50`
    },
    {
      heading: "18. Summary",
      content: `• Always open files with \`with open(path, mode, encoding="utf-8") as f:\`; the context manager closes the file even when exceptions occur.
• Modes: \`r\` read, \`w\` truncate and write, \`a\` append, \`x\` create exclusively, \`+\` for read and write; add \`b\` for binary data such as images and archives.
• The default encoding is locale-dependent until Python 3.15 (PEP 686). Pass \`encoding="utf-8"\` explicitly; use \`utf-8-sig\` for Excel exports with a BOM and \`errors="replace"\` only for salvage jobs.
• Iterate files line by line (\`for line in f\`) or in chunks (\`f.read(1024*1024)\`) so memory stays flat; \`read()\` and \`readlines()\` are for small files only.
• \`pathlib.Path\` is the modern path API: join with \`/\`, inspect with \`.name\`, \`.stem\`, \`.suffix\`, \`.parent\`, create with \`mkdir(parents=True, exist_ok=True)\`, read and write with \`read_text\`/\`write_text\`, find files with \`glob\` and \`rglob\`, anchor project files on \`Path(__file__).resolve().parent\`.
• Use \`os\` for the environment and low-level operations and \`shutil\` for \`copy2\`, \`copytree\`, \`move\`, \`rmtree\` and \`make_archive\`; Python 3.14 adds \`Path.copy\` and \`Path.move\`.
• JSON: \`json.dump\`/\`json.load\` for files, \`json.dumps\`/\`json.loads\` for strings; use \`indent\`, \`ensure_ascii=False\`, \`default=str\` for unsupported types, catch \`json.JSONDecodeError\`, and write atomically with a temp file plus \`os.replace\`.
• CSV: \`csv.DictReader\` and \`csv.DictWriter\` with \`newline=""\`; every value is a string, so convert with \`int\`, \`float\` or \`Decimal\`; pass \`delimiter\` for TSV and semicolon files.
• Keep secrets in environment variables; load a git-ignored \`.env\` with \`python-dotenv\` in development and use \`pydantic-settings\` for typed configuration in larger apps.
• For large files, stream with generators, hash and copy in chunks, seek from the end for tail-style reads, and measure memory with \`tracemalloc\`.
**Next lecture:** Iterators, Generators, Decorators & Context Managers`
    }
  ]
};
