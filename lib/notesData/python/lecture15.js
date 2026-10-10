export const lecture15 = {
  slug: "lecture-15",
  number: 15,
  title: "Complete Python Course — Lecture 15: Data Analysis with NumPy & pandas, Automation & Course Wrap-Up",
  summary: "Learn data analysis in Python with NumPy arrays, vectorization and broadcasting, pandas Series and DataFrame, reading CSV and Excel, loc/iloc selection, filtering, groupby, merge, missing data and matplotlib charts, then build automation scripts with pathlib, httpx, scheduling and argparse CLIs.",
  readTime: "54 min read",
  difficulty: "Advanced",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. Introduction: Why Data Analysis and Automation Are the Final Step in Python",
      content: `You have spent fourteen lectures learning the Python language, its standard library, object-oriented design, async programming, testing with pytest and building REST APIs with FastAPI. This final lecture turns to the two things that make Python the most used language in the world outside of web browsers: **data analysis** and **automation**.
Every company in India sits on spreadsheets and CSV exports: sales by city, attendance logs, GST invoices, server metrics, exam results. Someone has to clean those files, join them, summarise them and turn them into a chart for a Monday meeting. Doing that by hand in Excel takes hours and is impossible to repeat exactly. Doing it in Python with **NumPy** and **pandas** takes a few lines, runs in seconds and can be re-run every day with one command.
Why these two libraries specifically?
• **NumPy** (Numerical Python) provides the \`ndarray\`: a fixed-type, contiguous block of memory on which operations run in compiled C code. A loop that takes 200 milliseconds in pure Python often takes 2 milliseconds in NumPy. Every scientific library in Python (pandas, scikit-learn, PyTorch, OpenCV) is built on NumPy arrays or copies their interface.
• **pandas** sits on top of NumPy and adds **labels**: column names, row indexes, dates. It knows how to read CSV, Excel, JSON, SQL and Parquet, how to group, join and pivot, and how to handle missing values honestly. pandas 2.x (2023–2025) and pandas 3.0 (early 2026) are the versions you will meet in production; pandas 3.0 made **Copy-on-Write** the default and switched text columns to a dedicated string dtype, and the code in this lecture works on both lines.
The second half of the lecture covers **automation**: renaming hundreds of files with \`pathlib\`, calling web APIs with \`httpx\`, running a job every morning with a scheduler, and wrapping all of it in a proper **command-line tool** with \`argparse\` so your teammates can run it without opening the code. We finish with a complete sales-report CLI as the hands-on exercise and a course wrap-up that maps out the web, data and AI learning paths on this site.
A note on versions: this lecture targets Python 3.13 and 3.14 (the current stable lines; 3.15 is scheduled for October 2026). Install the libraries with \`uv add numpy pandas matplotlib httpx openpyxl\` inside a project created by \`uv init\`, or with \`pip install\` in an activated \`venv\`.`,
      codeSnippet: `# Set up a project for this lecture (uv is the fast, modern option; pip + venv also works)
# Terminal:
#   uv init data-lab
#   cd data-lab
#   uv add numpy pandas matplotlib httpx openpyxl
#   uv run python check_env.py

# check_env.py
import sys
import numpy as np
import pandas as pd
import matplotlib
import httpx

print("Python     :", sys.version.split()[0])   # e.g. 3.14.x
print("NumPy      :", np.__version__)           # 2.x
print("pandas     :", pd.__version__)           # 2.2.x or 3.0.x
print("matplotlib :", matplotlib.__version__)
print("httpx      :", httpx.__version__)`
    },
    {
      heading: "2. NumPy Arrays: ndarray, dtype, shape and Creating Arrays",
      content: `The heart of NumPy is the **ndarray** (n-dimensional array). Unlike a Python list, which is an array of pointers to separately allocated objects, an ndarray stores all its elements in one contiguous block of memory with a single **dtype** (data type) such as \`int64\`, \`float64\` or \`bool\`. That design is what makes NumPy fast: the CPU can stream through the memory without chasing pointers, and the arithmetic runs in compiled code.
Three attributes describe any array:
• **\`shape\`** — a tuple of dimension sizes. A list of 1,000 marks has shape \`(1000,)\`; a table of 1,000 students with 5 subjects has shape \`(1000, 5)\`.
• **\`ndim\`** — the number of dimensions (1 for a vector, 2 for a matrix, 3 for an image stack).
• **\`dtype\`** — the element type. Mixing an integer and a float in \`np.array\` upcasts everything to float; mixing a string in upcasts everything to a Unicode string, which is almost never what you want.
Ways to create arrays you will use daily:
• \`np.array([...])\` from a Python list (or nested lists for 2-D).
• \`np.arange(start, stop, step)\` like \`range\` but returns an array and accepts floats.
• \`np.linspace(start, stop, num)\` gives \`num\` evenly spaced values including both ends — perfect for plotting.
• \`np.zeros(shape)\`, \`np.ones(shape)\`, \`np.full(shape, value)\` for pre-allocated buffers.
• \`np.random.default_rng(seed)\` returns a **Generator**; call \`.integers()\`, \`.normal()\`, \`.choice()\` on it. (The old \`np.random.seed\` / \`np.random.randint\` global API still works but the Generator API is the recommended one since NumPy 1.17.)
Indexing and slicing follow Python rules but extend to multiple axes: \`marks[0, 2]\` is row 0, column 2; \`marks[:, 2]\` is the whole third column; \`marks[::2]\` is every second row. Crucially, **slices are views, not copies**: modifying \`marks[:, 2]\` modifies \`marks\`. Call \`.copy()\` when you need independence. Use \`reshape\` to change shape without copying data (the total number of elements must stay the same) and \`-1\` to let NumPy infer one dimension.`,
      codeSnippet: `# numpy_basics.py
import numpy as np

# 1-D array of monthly sales (₹ lakh) for one store
sales = np.array([12.5, 14.0, 9.8, 16.2, 15.1, 18.4])
print(sales.shape, sales.ndim, sales.dtype)   # (6,) 1 float64

# 2-D array: 4 students x 3 subjects
marks = np.array([
    [78, 85, 92],
    [66, 70, 58],
    [90, 95, 88],
    [45, 60, 52],
])
print(marks.shape)          # (4, 3)
print(marks[2, 1])          # 95   -> row 2, column 1
print(marks[:, 0])          # [78 66 90 45] -> first subject for everyone
print(marks[1:3])           # rows 1 and 2

# Creation helpers
print(np.arange(0, 1, 0.25))        # [0.   0.25 0.5  0.75]
print(np.linspace(0, 100, 5))       # [  0.  25.  50.  75. 100.]
print(np.zeros((2, 3), dtype=np.int64))

# Modern random API: reproducible with a seed
rng = np.random.default_rng(42)
dice = rng.integers(1, 7, size=10)  # 10 dice rolls, 1..6 inclusive of 1, exclusive of 7
print(dice)

# Views vs copies
first_col = marks[:, 0]
first_col[0] = 0            # this CHANGES marks too!
print(marks[0])             # [ 0 85 92]
safe = marks[:, 0].copy()
safe[0] = 999               # marks is untouched

# reshape: same data, new shape (-1 means "work it out")
grid = np.arange(12).reshape(3, -1)
print(grid.shape)           # (3, 4)`
    },
    {
      heading: "3. Vectorization and Broadcasting in NumPy",
      content: `**Vectorization** means expressing a computation as whole-array operations instead of explicit Python loops. Write \`prices * 1.18\` and NumPy applies the GST multiplication to every element inside a single C loop. The code is shorter, reads like the maths, and is typically **50 to 200 times faster** than the equivalent \`for\` loop because Python's per-iteration overhead (type checks, reference counting, bytecode dispatch) disappears.
Every arithmetic operator, comparison operator and the **universal functions** (\`np.sqrt\`, \`np.exp\`, \`np.log\`, \`np.round\`, \`np.maximum\`) are vectorized. Reductions such as \`sum\`, \`mean\`, \`std\`, \`min\`, \`max\` and \`argmax\` take an \`axis\` argument: \`axis=0\` collapses rows (giving one value per column), \`axis=1\` collapses columns (one value per row). This trips up every beginner, so remember: **the axis you pass is the axis that disappears**.
**Broadcasting** is the rule set that lets NumPy combine arrays of different shapes. Shapes are compared from the right; two dimensions are compatible when they are equal or when one of them is 1. The size-1 dimension is stretched (virtually, with no copy) to match. So a \`(4, 3)\` matrix minus a \`(3,)\` vector subtracts the vector from every row, and a \`(4, 3)\` matrix minus a \`(4, 1)\` column subtracts a different value from each row. If the shapes are incompatible, for example \`(4, 3)\` with \`(4,)\`, NumPy raises \`ValueError: operands could not be broadcast together\`; the fix is usually \`vector[:, np.newaxis]\` or \`vector.reshape(-1, 1)\` to add the missing axis.
**Boolean masks** complete the toolkit. A comparison such as \`marks >= 40\` returns a boolean array of the same shape; use it to filter (\`marks[marks >= 40]\`), count (\`(marks >= 40).sum()\`), or assign (\`marks[marks < 0] = 0\`). \`np.where(condition, a, b)\` is the vectorized if-else. When you find yourself writing a Python loop over array elements, stop and ask whether a mask, a ufunc or broadcasting can express it; nearly always one can.`,
      codeSnippet: `# vectorization.py
import time
import numpy as np

# Loop vs vectorized: add 18% GST to one million prices
prices = np.random.default_rng(0).uniform(100, 5000, size=1_000_000)

t0 = time.perf_counter()
with_gst_loop = [p * 1.18 for p in prices]          # Python loop over 1M floats
t1 = time.perf_counter()
with_gst_vec = prices * 1.18                        # one vectorized multiply
t2 = time.perf_counter()
print(f"loop: {(t1 - t0) * 1000:.1f} ms, numpy: {(t2 - t1) * 1000:.2f} ms")
# typical laptop: loop ~ 120 ms, numpy ~ 1.5 ms

# Reductions along an axis
marks = np.array([[78, 85, 92], [66, 70, 58], [90, 95, 88], [45, 60, 52]])
print(marks.mean(axis=0))   # per subject  -> [69.75 77.5  72.5 ]
print(marks.mean(axis=1))   # per student  -> [85.   64.67 91.   52.33]
print(marks.max(), marks.argmax())   # 95, flat index 7

# Broadcasting: subtract each subject's average from every student's mark
centered = marks - marks.mean(axis=0)   # (4,3) - (3,) -> (4,3)
print(centered[0])          # [ 8.25  7.5  19.5 ]

# Scale each STUDENT by their own total: needs a column vector
weights = marks.sum(axis=1)             # shape (4,)
# marks / weights  -> ValueError: (4,3) vs (4,) not compatible
share = marks / weights[:, np.newaxis]  # (4,3) / (4,1) -> works
print(share[0].round(2))    # [0.31 0.33 0.36]

# Boolean masks and np.where
passed = marks >= 60
print(passed.sum(axis=1))   # subjects passed per student -> [3 2 3 1]
grade = np.where(marks >= 75, "A", np.where(marks >= 60, "B", "F"))
print(grade[3])             # ['F' 'B' 'F']`
    },
    {
      heading: "4. pandas Series and DataFrame: The Building Blocks",
      content: `pandas adds two labelled containers on top of NumPy.
A **Series** is a one-dimensional array with an **index**: think of it as a single column, or a dictionary whose keys are ordered and whose values share a dtype. Arithmetic between two Series aligns on the index labels, not on position, which is both a superpower and a common source of surprise (misaligned labels produce \`NaN\`).
A **DataFrame** is a two-dimensional table: an ordered dictionary of Series that share the same row index. Each column has its own dtype, so a DataFrame can hold integers, floats, strings and datetimes side by side, unlike a NumPy array. You can build one from a dict of lists, a list of dicts, a NumPy array, or (most often) by reading a file.
First things to do with any new DataFrame:
• \`df.head(n)\` / \`df.tail(n)\` — peek at rows.
• \`df.shape\` — \`(rows, columns)\`.
• \`df.info()\` — column names, non-null counts and dtypes in one screen; this is where you discover that a price column was read as text because of a stray ₹ symbol.
• \`df.describe()\` — count, mean, std, min, quartiles and max for numeric columns.
• \`df.columns\`, \`df.dtypes\`, \`df.index\`.
Access a column with \`df["city"]\` (returns a Series) and several columns with a list: \`df[["city", "amount"]]\` (returns a DataFrame). Create a derived column by assigning to a new name: \`df["total"] = df["qty"] * df["price"]\`. Column-wise methods such as \`.sum()\`, \`.mean()\`, \`.value_counts()\`, \`.unique()\`, \`.nunique()\` and \`.astype()\` cover most day-to-day questions.
pandas 3.0 defaults to **Copy-on-Write (CoW)**: every operation that returns a new DataFrame or Series behaves as a copy, and modifying it never affects the original. The practical rule for both 2.x and 3.x is: never use chained assignment like \`df["qty"][3] = 0\`; always write \`df.loc[3, "qty"] = 0\`. Also prefer returning new objects over \`inplace=True\`, which is discouraged and gains nothing under CoW.`,
      codeSnippet: `# pandas_basics.py
import pandas as pd

# Series: labelled 1-D data
population = pd.Series(
    [20.7, 16.8, 13.6, 11.5],
    index=["Mumbai", "Delhi", "Bengaluru", "Chennai"],
    name="population_million",
)
print(population["Delhi"])        # 16.8
print(population.idxmax())        # Mumbai

# Index alignment: labels match, not positions
growth = pd.Series({"Delhi": 1.02, "Mumbai": 1.01, "Pune": 1.04})
print(population * growth)
# Bengaluru      NaN   <- no match in growth
# Chennai        NaN
# Delhi       17.136
# Mumbai      20.907
# Pune           NaN   <- no match in population

# DataFrame from a dict of lists
orders = pd.DataFrame({
    "order_id": [101, 102, 103, 104, 105],
    "city": ["Mumbai", "Delhi", "Mumbai", "Pune", "Delhi"],
    "product": ["Laptop", "Phone", "Phone", "Monitor", "Laptop"],
    "qty": [1, 2, 1, 3, 1],
    "unit_price": [54999, 24999, 24999, 12999, 54999],
})
orders["revenue"] = orders["qty"] * orders["unit_price"]

print(orders.shape)               # (5, 6)
print(orders.dtypes)
orders.info()
print(orders.describe().round(1))
print(orders["city"].value_counts())
# city
# Mumbai    2
# Delhi     2
# Pune      1

# Correct way to change one cell (works on pandas 2.x and 3.x)
orders.loc[orders["order_id"] == 104, "qty"] = 2`
    },
    {
      heading: "5. Reading CSV and Excel Files into pandas",
      content: `Real data starts as a file. \`pd.read_csv(path)\` is the function you will call most in your career, and its keyword arguments solve nearly every messy-file problem:
• \`sep=";"\` or \`sep="\\t"\` for non-comma separators (many Indian bank exports use tabs or pipes).
• \`parse_dates=["date"]\` converts a column to \`datetime64\` on load so you can use \`.dt.month\`, \`.dt.day_name()\` and date arithmetic immediately. For unusual formats add \`date_format="%d-%m-%Y"\`; without it, pandas infers the format from the first value, and dd-mm-yyyy files can be misread as mm-dd-yyyy.
• \`dtype={"pincode": "string"}\` keeps leading zeros that would vanish if the column were parsed as an integer.
• \`usecols=[...]\` loads only the columns you need; \`nrows=1000\` is handy for a quick look at a 2 GB file.
• \`na_values=["-", "NA", "null"]\` tells pandas which placeholder strings mean missing.
• \`encoding="utf-8"\` is the default; older Windows exports may need \`"cp1252"\` or \`"latin-1"\`.
• \`thousands=","\` parses \`"1,25,000"\`-style numbers (note: Indian lakh grouping works because pandas simply strips the separator).
\`pd.read_excel(path, sheet_name="Sales")\` needs the **openpyxl** package for \`.xlsx\` files. Pass \`sheet_name=None\` to get a dict of every sheet, \`header=2\` when the real header is on the third row, and \`skiprows\` to jump over report titles. Writing is symmetrical: \`df.to_csv("out.csv", index=False)\` (almost always pass \`index=False\`, otherwise you get an unnamed column of row numbers next time you read it), and \`df.to_excel("report.xlsx", sheet_name="Summary", index=False)\`. To write several sheets, use \`pd.ExcelWriter\` as a context manager.
pandas can also read \`read_json\`, \`read_parquet\` (fast columnar format used in data engineering; needs \`pyarrow\`), \`read_sql\` (pass a SQLAlchemy engine or a \`sqlite3\` connection) and even \`read_html\` to scrape tables from a web page. The same \`df.to_*\` family writes them back.`,
      codeSnippet: `# read_files.py
from pathlib import Path
import pandas as pd

DATA = Path("data")
DATA.mkdir(exist_ok=True)

# Create a realistic, slightly messy CSV to practise on
csv_text = """order_id,date,city,product,qty,unit_price,pincode
1001,03-01-2026,Mumbai,Laptop,1,"54,999",400001
1002,05-01-2026,Delhi,Phone,2,"24,999",110001
1003,07-01-2026,Bengaluru,Headphones,-,"2,999",560001
1004,15-02-2026,Pune,Monitor,3,"12,999",411001
1005,20-02-2026,Delhi,Laptop,1,"54,999",110001
"""
(DATA / "orders.csv").write_text(csv_text, encoding="utf-8")

orders = pd.read_csv(
    DATA / "orders.csv",
    parse_dates=["date"],
    date_format="%d-%m-%Y",          # Indian dd-mm-yyyy
    thousands=",",                   # "54,999" -> 54999
    na_values=["-"],                 # "-" means missing
    dtype={"pincode": "string"},     # keep as text, never arithmetic
)
orders.info()
# order_id      5 non-null  int64
# date          5 non-null  datetime64[ns]
# qty           4 non-null  float64   <- one missing value made it float
# unit_price    5 non-null  int64
# pincode       5 non-null  string

print(orders["date"].dt.month_name().tolist())
# ['January', 'January', 'January', 'February', 'February']

# Excel round trip (requires: uv add openpyxl)
orders.to_excel(DATA / "orders.xlsx", sheet_name="Orders", index=False)
back = pd.read_excel(DATA / "orders.xlsx", sheet_name="Orders")
print(back.shape)                   # (5, 7)

# Several sheets in one workbook
with pd.ExcelWriter(DATA / "report.xlsx") as writer:
    orders.to_excel(writer, sheet_name="Raw", index=False)
    orders.groupby("city")["unit_price"].sum().to_excel(writer, sheet_name="ByCity")

# Save a clean CSV for the next steps
orders.to_csv(DATA / "orders_clean.csv", index=False)`
    },
    {
      heading: "6. Selecting Data with loc, iloc and Boolean Filtering",
      content: `pandas offers two indexers, and knowing which to use is the difference between clean code and subtle bugs.
• **\`df.loc[rows, cols]\`** selects by **label**. Rows are chosen by index label (which may be an integer, a string or a date) and columns by name. Slices with \`loc\` are **inclusive** of the end label: \`df.loc[2:4]\` returns rows labelled 2, 3 and 4.
• **\`df.iloc[rows, cols]\`** selects by **integer position**, exactly like NumPy or a Python list. Slices are **exclusive** of the end: \`df.iloc[2:4]\` returns positions 2 and 3.
Both accept a single value, a list, a slice or a boolean array in each dimension. \`df.loc[df["city"] == "Delhi", ["product", "revenue"]]\` reads as "rows where city is Delhi, these two columns", and that one pattern covers most selection needs. When the index is the default \`RangeIndex\` (0, 1, 2, ...), \`loc\` and \`iloc\` look identical, which is why people mix them up; the moment you \`sort_values\`, \`drop\` rows or \`set_index("order_id")\`, they diverge.
**Filtering** is boolean masking, just as in NumPy, with three rules:
1. Combine conditions with \`&\` (and), \`|\` (or) and \`~\` (not), never with the Python keywords \`and\`/\`or\`, which raise \`ValueError: The truth value of a Series is ambiguous\`.
2. Wrap every condition in parentheses because \`&\` binds tighter than \`==\`: \`(df["qty"] > 1) & (df["city"] == "Delhi")\`.
3. Use the helper methods for readable conditions: \`.isin([...])\`, \`.between(a, b)\`, \`.str.contains("Lap")\`, \`.str.startswith\`, \`.isna()\`, \`.dt.year == 2026\`.
\`df.query("qty > 1 and city == 'Delhi'")\` is a string-based alternative that many analysts find more readable, and it accepts local variables with an \`@\` prefix. Finally, \`df.sort_values(["city", "revenue"], ascending=[True, False])\`, \`df.nlargest(3, "revenue")\` and \`df.sample(5, random_state=0)\` are the selection-adjacent helpers you will reach for constantly.`,
      codeSnippet: `# selecting.py
import pandas as pd

df = pd.read_csv("data/orders_clean.csv", parse_dates=["date"])
df["revenue"] = df["qty"] * df["unit_price"]

# loc: by label (end inclusive)
print(df.loc[1:3, ["city", "product"]])
#         city     product
# 1      Delhi       Phone
# 2  Bengaluru  Headphones
# 3       Pune     Monitor

# iloc: by position (end exclusive)
print(df.iloc[0, 2])          # 'Mumbai'   -> row 0, column 2
print(df.iloc[-1])            # last row as a Series
print(df.iloc[:2, :3])        # first 2 rows, first 3 columns

# When the index is not 0..n-1, they differ
by_id = df.set_index("order_id")
print(by_id.loc[1004, "city"])   # 'Pune'  (label 1004)
print(by_id.iloc[3]["city"])     # 'Pune'  (position 3)

# Boolean filtering with & | ~ and parentheses
big_delhi = df[(df["revenue"] > 30000) & (df["city"] == "Delhi")]
print(big_delhi[["order_id", "revenue"]])
#    order_id  revenue
# 1      1002  49998.0
# 4      1005  54999.0

metros = df[df["city"].isin(["Mumbai", "Delhi", "Bengaluru"])]
jan = df[df["date"].dt.month == 1]
laptops = df[df["product"].str.contains("Lap", case=False)]
missing_qty = df[df["qty"].isna()]

# query(): readable string syntax, @ for local variables
threshold = 20000
print(df.query("revenue > @threshold and city != 'Delhi'")["order_id"].tolist())
# [1001, 1004]

# Assignment through loc with a mask
df.loc[df["qty"].isna(), "qty"] = 1
print(df.sort_values("revenue", ascending=False).head(2)[["order_id", "revenue"]])
print(df.nlargest(1, "revenue")["product"].item())   # 'Laptop'`
    },
    {
      heading: "7. groupby and Aggregation in pandas",
      content: `The question every manager asks — "total revenue **by city**", "average order value **by month**", "how many orders **per product per region**" — is answered with **groupby**. pandas implements the classic **split-apply-combine** pattern: split the rows into groups by one or more keys, apply an aggregation to each group, combine the results into a new table.
\`df.groupby("city")\` by itself does nothing visible; it returns a lazy \`DataFrameGroupBy\` object. You then pick columns and an aggregation:
• \`df.groupby("city")["revenue"].sum()\` — one Series indexed by city.
• \`df.groupby(["city", "product"])["revenue"].sum()\` — a Series with a two-level **MultiIndex**; call \`.reset_index()\` to turn the levels back into columns, or pass \`as_index=False\` to \`groupby\`.
• \`.agg(["sum", "mean", "count"])\` — several statistics at once, producing one column per function.
• **Named aggregation** \`.agg(total=("revenue", "sum"), orders=("order_id", "count"), avg_qty=("qty", "mean"))\` — the cleanest syntax: each keyword becomes an output column, each tuple is (input column, function). Functions can be strings, NumPy functions or your own lambdas.
Beyond aggregation, \`groupby\` supports **transform**, which returns a result the same length as the input (ideal for "each order's share of its city total": \`df["revenue"] / df.groupby("city")["revenue"].transform("sum")\`), and **filter**, which keeps whole groups meeting a condition (\`.filter(lambda g: g["revenue"].sum() > 50000)\`). \`.size()\` counts rows per group including missing values; \`.count()\` counts non-null values per column.
Two related reshaping tools: \`pd.pivot_table(df, values="revenue", index="city", columns="product", aggfunc="sum", fill_value=0)\` builds the Excel-style cross-tab people love, and \`pd.crosstab(df["city"], df["product"])\` counts occurrences. For time-based grouping use \`df.resample("ME")\` on a DatetimeIndex, or \`pd.Grouper(key="date", freq="ME")\` inside groupby ("ME" is month-end; the older "M" alias is deprecated in pandas 2.2+).`,
      codeSnippet: `# grouping.py
import pandas as pd

df = pd.DataFrame({
    "order_id": range(1, 9),
    "date": pd.to_datetime(["2026-01-03", "2026-01-10", "2026-01-21", "2026-02-02",
                            "2026-02-14", "2026-02-20", "2026-03-01", "2026-03-15"]),
    "city":    ["Mumbai", "Delhi", "Mumbai", "Pune", "Delhi", "Mumbai", "Pune", "Delhi"],
    "product": ["Laptop", "Phone", "Phone", "Monitor", "Laptop", "Laptop", "Phone", "Phone"],
    "qty":     [1, 2, 1, 3, 1, 2, 1, 1],
    "unit_price": [54999, 24999, 24999, 12999, 54999, 54999, 24999, 24999],
})
df["revenue"] = df["qty"] * df["unit_price"]

# Single key, single column
print(df.groupby("city")["revenue"].sum().sort_values(ascending=False))
# city
# Mumbai    189996
# Delhi     129997
# Pune       63996

# Named aggregation: the recommended style
summary = df.groupby("city").agg(
    orders=("order_id", "count"),
    revenue=("revenue", "sum"),
    avg_order=("revenue", "mean"),
    first_order=("date", "min"),
).round(0)
print(summary)

# Two keys -> MultiIndex; reset_index() flattens it
by_city_product = df.groupby(["city", "product"], as_index=False)["revenue"].sum()
print(by_city_product)

# transform: each order's share of its city's revenue
df["city_share"] = (df["revenue"] / df.groupby("city")["revenue"].transform("sum")).round(2)
print(df[["order_id", "city", "city_share"]].head(3))

# filter: keep only cities with 3+ orders
busy = df.groupby("city").filter(lambda g: len(g) >= 3)
print(busy["city"].unique())      # ['Mumbai' 'Delhi']

# Pivot table: cities down, products across
pivot = pd.pivot_table(df, values="revenue", index="city", columns="product",
                       aggfunc="sum", fill_value=0, margins=True)
print(pivot)

# Monthly totals with a time grouper ("ME" = month end)
monthly = df.groupby(pd.Grouper(key="date", freq="ME"))["revenue"].sum()
print(monthly)
# 2026-01-31    134997
# 2026-02-28    177997
# 2026-03-31     49998`
    },
    {
      heading: "8. Merging and Joining DataFrames with pd.merge and concat",
      content: `Data rarely lives in one table. Orders reference customers by ID; cities belong to regions; this month's file must be stacked under last month's. pandas gives you two operations for this, and they map directly onto SQL concepts you learned in the FastAPI lecture.
**\`pd.merge(left, right, on="key", how=...)\`** (also available as \`left.merge(right, ...)\`) is a SQL join:
• \`how="inner"\` (default) keeps only keys present in **both** tables. Silent data loss happens here: if a city in orders is misspelled, those orders simply vanish.
• \`how="left"\` keeps every row of the left table and fills unmatched right columns with \`NaN\`. This is the one to use when enriching a fact table (orders) with a lookup table (regions) — you never want to lose orders.
• \`how="right"\` and \`how="outer"\` mirror and union the above.
• Use \`left_on\` / \`right_on\` when the key columns have different names, \`suffixes=("_order", "_cust")\` to disambiguate same-named non-key columns, and \`validate="many_to_one"\` to make pandas raise an error if the lookup table unexpectedly has duplicate keys (a classic cause of row counts doubling after a merge).
• \`indicator=True\` adds a \`_merge\` column saying \`both\`, \`left_only\` or \`right_only\` — perfect for finding the unmatched rows.
**\`pd.concat([df1, df2])\`** stacks DataFrames. With the default \`axis=0\` it appends rows (same columns, more rows: month files); with \`axis=1\` it places tables side by side aligned on the index. Pass \`ignore_index=True\` to rebuild a clean 0..n index when stacking, otherwise duplicated index labels will haunt later \`loc\` calls. A common pattern reads every CSV in a folder: \`pd.concat([pd.read_csv(p) for p in Path("data").glob("sales_*.csv")], ignore_index=True)\`.
\`df.join(other)\` is a thin wrapper around merge that joins on the **index**; it is convenient after \`set_index\`, but \`merge\` with explicit \`on\` is clearer and is what most teams standardise on. Always check \`len(result)\` before and after a merge: an unexpected increase means duplicate keys on the right, an unexpected decrease means you used an inner join where a left join was intended.`,
      codeSnippet: `# merging.py
from pathlib import Path
import pandas as pd

orders = pd.DataFrame({
    "order_id": [1, 2, 3, 4, 5],
    "customer_id": [11, 12, 11, 13, 99],   # 99 has no customer record
    "city": ["Mumbai", "Delhi", "Mumbai", "Pune", "Jaipur"],
    "revenue": [54999, 49998, 24999, 38997, 24999],
})
customers = pd.DataFrame({
    "customer_id": [11, 12, 13, 14],
    "name": ["Priya", "Arjun", "Neha", "Rahul"],
    "city": ["Mumbai", "Delhi", "Pune", "Chennai"],   # same column name as orders
})
regions = pd.DataFrame({
    "city": ["Mumbai", "Delhi", "Pune", "Chennai", "Bengaluru"],
    "region": ["West", "North", "West", "South", "South"],
})

# Inner join silently drops order 5 (customer 99 unknown)
inner = orders.merge(customers, on="customer_id", how="inner", suffixes=("", "_cust"))
print(len(inner))                   # 4

# Left join keeps every order; name is NaN for the unknown customer
left = orders.merge(customers, on="customer_id", how="left",
                    suffixes=("", "_cust"), validate="many_to_one")
print(left[["order_id", "name", "city"]])
#    order_id   name    city
# 0         1  Priya  Mumbai
# 1         2  Arjun   Delhi
# 2         3  Priya  Mumbai
# 3         4   Neha    Pune
# 4         5    NaN  Jaipur

# indicator=True reveals unmatched rows (Jaipur is not in the regions table)
enriched = left.merge(regions, on="city", how="left", indicator=True)
print(enriched.loc[enriched["_merge"] == "left_only", ["order_id", "city"]])
#    order_id    city
# 4         5  Jaipur

# Revenue by region after the joins
print(enriched.groupby("region", dropna=False)["revenue"].sum())

# concat: stack monthly files
jan = pd.DataFrame({"order_id": [1, 2], "revenue": [100, 200]})
feb = pd.DataFrame({"order_id": [3, 4], "revenue": [300, 400]})
all_months = pd.concat([jan, feb], ignore_index=True)
print(all_months.index.tolist())    # [0, 1, 2, 3]

# Read every CSV in a folder into one frame
files = sorted(Path("data").glob("sales_*.csv"))
if files:
    combined = pd.concat([pd.read_csv(f).assign(source=f.name) for f in files],
                         ignore_index=True)`
    },
    {
      heading: "9. Handling Missing Data in pandas",
      content: `Missing values are the normal state of real data: a customer skipped the phone-number field, a sensor went offline for an hour, a join found no match. pandas represents them as \`NaN\` (float columns), \`NaT\` (datetime columns) and \`pd.NA\` (the newer nullable dtypes such as \`Int64\`, \`boolean\` and \`string\`). Most reductions **skip** missing values by default (\`mean\`, \`sum\`, \`max\` all ignore \`NaN\`), which is convenient but means a column average can look fine while half the data is missing.
Step one is always to **measure**: \`df.isna().sum()\` gives the missing count per column, and \`df.isna().mean().round(3)\` gives the fraction. Decide per column what the gap means. Then choose a strategy:
• **Drop** — \`df.dropna()\` removes any row with a missing value anywhere, which is usually too aggressive. Prefer \`df.dropna(subset=["order_id", "date"])\` to require only the critical columns, or \`df.dropna(thresh=5)\` to keep rows with at least 5 non-null values. \`df.dropna(axis=1, how="all")\` drops columns that are entirely empty.
• **Fill with a constant** — \`df["qty"].fillna(1)\` or \`df.fillna({"qty": 1, "discount": 0, "city": "Unknown"})\` with a dict for per-column values.
• **Fill statistically** — \`df["price"].fillna(df["price"].median())\` (median resists outliers better than mean), or group-aware: \`df["price"].fillna(df.groupby("product")["price"].transform("median"))\`.
• **Fill from neighbours** — \`.ffill()\` (carry the last valid value forward, right for daily balances or sensor readings) and \`.bfill()\`. The old \`fillna(method="ffill")\` form is deprecated.
• **Interpolate** — \`df["temperature"].interpolate()\` draws a straight line between known points; use \`method="time"\` on a DatetimeIndex for irregular spacing.
A column with one \`NaN\` becomes \`float64\` even if every other value is an integer, which is why you see \`2.0\` instead of \`2\`. Convert to the nullable \`Int64\` dtype (capital I) with \`.astype("Int64")\` to keep integers alongside \`pd.NA\`. Never compare with \`== np.nan\` (it is always False); use \`.isna()\` and \`.notna()\`. Document every fill decision in code comments; a silent \`fillna(0)\` on a revenue column is the kind of thing that produces a wrong board presentation.`,
      codeSnippet: `# missing_data.py
import numpy as np
import pandas as pd

df = pd.DataFrame({
    "order_id": [1, 2, 3, 4, 5, 6],
    "city": ["Mumbai", "Delhi", None, "Pune", "Delhi", "Mumbai"],
    "product": ["Laptop", "Phone", "Phone", "Monitor", "Laptop", "Phone"],
    "qty": [1, np.nan, 1, 3, np.nan, 2],
    "unit_price": [54999, 24999, np.nan, 12999, 54999, 24999],
    "delivered_on": pd.to_datetime(["2026-01-05", None, "2026-01-09", "2026-02-04", None, "2026-02-22"]),
})

# 1. Measure
print(df.isna().sum())
# city            1
# qty             2
# unit_price      1
# delivered_on    2
print(df.isna().mean().round(2))

# 2. Drop only when critical fields are missing
df = df.dropna(subset=["order_id"])

# 3. Fill per column with a dict
df = df.fillna({"city": "Unknown", "qty": 1})

# 4. Statistical, group-aware fill for price
df["unit_price"] = df["unit_price"].fillna(
    df.groupby("product")["unit_price"].transform("median")
)
print(df.loc[2, "unit_price"])     # 24999.0 (median Phone price)

# 5. Nullable integer dtype keeps whole numbers with missing values
df["qty"] = df["qty"].astype("Int64")
print(df["qty"].tolist())          # [1, 1, 1, 3, 1, 2]

# 6. Forward fill for time series
balance = pd.Series([1000, np.nan, np.nan, 1250, np.nan],
                    index=pd.date_range("2026-03-01", periods=5))
print(balance.ffill().tolist())    # [1000.0, 1000.0, 1000.0, 1250.0, 1250.0]
print(balance.interpolate().tolist())  # [1000.0, 1083.33, 1166.67, 1250.0, 1250.0]

# 7. Never compare with == np.nan
print((df["delivered_on"] == np.nan).sum())   # 0  (wrong)
print(df["delivered_on"].isna().sum())        # 2  (right)

# Flag undelivered orders instead of inventing a date
df["delivered"] = df["delivered_on"].notna()
print(df[["order_id", "delivered"]])`
    },
    {
      heading: "10. Plotting with matplotlib: Bar, Line and Histogram Charts",
      content: `A number nobody reads is wasted; a chart gets looked at. **matplotlib** is the foundational plotting library in Python; pandas' \`df.plot()\` and the statistical library seaborn are both built on it. Learn the **object-oriented API** (\`fig, ax = plt.subplots()\`) rather than the \`plt.plot()\` shortcuts: it scales to multiple panels and makes it explicit which axes you are drawing on.
The vocabulary: a **Figure** is the whole canvas (window or image file); an **Axes** is one plot with its own x and y axis, title and legend; a figure can hold several Axes in a grid via \`plt.subplots(nrows, ncols)\`. Draw with \`ax.bar\`, \`ax.plot\` (line), \`ax.scatter\`, \`ax.hist\`, \`ax.pie\`; label with \`ax.set_title\`, \`ax.set_xlabel\`, \`ax.set_ylabel\`; call \`ax.legend()\` when you have passed \`label=\` to the drawing calls; and finish with \`fig.tight_layout()\` so labels do not overlap. \`fig.savefig("chart.png", dpi=150)\` writes an image (also \`.svg\` and \`.pdf\`); \`plt.show()\` opens an interactive window. In a script that runs on a server or in a scheduled job, set \`matplotlib.use("Agg")\` before importing \`pyplot\` so it never tries to open a window.
pandas shortcuts: \`df.plot(x="month", y="revenue", kind="line")\`, \`series.plot.bar()\`, \`df.plot.hist(bins=20)\`. They accept an \`ax=\` argument, so you can mix pandas plotting with matplotlib customisation. Number formatting matters for Indian audiences: divide by \`1e5\` and label the axis "₹ lakh", or use a \`FuncFormatter\` to format ticks as \`12.5L\`.
Chart selection rule of thumb: **bar** for comparing categories (revenue by city), **line** for trends over time (monthly revenue), **histogram** for distributions (order values), **scatter** for relationships (price vs quantity). Keep one message per chart, start bar axes at zero, and prefer a sorted bar chart to a pie chart whenever there are more than three slices. The hands-on exercise at the end saves a bar chart automatically every time the report runs.`,
      codeSnippet: `# plotting.py
import matplotlib
matplotlib.use("Agg")            # headless: write files, never open windows
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter
import pandas as pd

df = pd.DataFrame({
    "month": pd.period_range("2026-01", "2026-06", freq="M").astype(str),
    "Mumbai": [12.5, 14.0, 9.8, 16.2, 15.1, 18.4],
    "Delhi":  [10.1, 11.4, 12.0, 11.8, 13.5, 14.9],
    "Pune":   [4.2, 4.8, 5.1, 6.0, 6.3, 7.1],
}).set_index("month")            # values in ₹ lakh

# Figure with two panels side by side
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4))

# Panel 1: trend lines, one per city
for city in df.columns:
    ax1.plot(df.index, df[city], marker="o", label=city)
ax1.set_title("Monthly revenue by city (H1 2026)")
ax1.set_ylabel("Revenue (₹ lakh)")
ax1.legend()
ax1.grid(alpha=0.3)
ax1.tick_params(axis="x", rotation=45)

# Panel 2: sorted bar chart of totals, via pandas on a matplotlib axes
totals = df.sum().sort_values(ascending=False)
totals.plot.bar(ax=ax2, color="#1e3a8a")
ax2.set_title("Total revenue, Jan-Jun 2026")
ax2.set_ylabel("₹ lakh")
ax2.yaxis.set_major_formatter(FuncFormatter(lambda v, _: f"{v:.0f}L"))
ax2.tick_params(axis="x", rotation=0)
for i, v in enumerate(totals):
    ax2.text(i, v + 0.5, f"{v:.1f}", ha="center")   # value labels on bars

fig.tight_layout()
fig.savefig("revenue_h1_2026.png", dpi=150)
print("saved revenue_h1_2026.png")

# A histogram of order values
orders = pd.Series([1499, 2999, 2999, 12999, 24999, 24999, 24999, 49998, 54999, 54999])
fig2, ax = plt.subplots(figsize=(6, 4))
ax.hist(orders / 1000, bins=6, color="#f97316", edgecolor="white")
ax.set_xlabel("Order value (₹ thousand)")
ax.set_ylabel("Number of orders")
ax.set_title("Distribution of order values")
fig2.tight_layout()
fig2.savefig("order_values.png", dpi=150)`
    },
    {
      heading: "11. Automation Scripts: Renaming Files with pathlib, Web Requests with httpx and Scheduling",
      content: `Automation is where Python pays for itself on day one. Three building blocks cover most office and DevOps tasks.
**File operations with \`pathlib\`.** \`Path.iterdir()\` lists a folder, \`Path.glob("*.jpg")\` filters by pattern and \`Path.rglob\` searches subfolders. Each \`Path\` exposes \`.stem\` (name without extension), \`.suffix\`, \`.parent\`, \`.stat().st_mtime\` (modification time) and \`.with_name()\` / \`.with_suffix()\` for computing the new name. Rename with \`path.rename(new_path)\` or, to move across drives, \`shutil.move\`. Two safety rules from painful experience: always support a **\`--dry-run\`** flag that prints what would happen without touching anything, and never overwrite silently: check \`new_path.exists()\` first. Python 3.14 added \`Path.copy()\` and \`Path.move()\` methods directly on \`pathlib\`; on 3.13 use \`shutil\`.
**HTTP with \`httpx\`.** \`httpx\` is the modern requests-compatible client with sync and async APIs, HTTP/2 and strict timeouts. Use a \`with httpx.Client(base_url=..., timeout=10.0) as client:\` block to reuse connections across many calls; call \`response.raise_for_status()\` so a 404 or 500 becomes an exception instead of silently returning an error page; read JSON with \`response.json()\`; send JSON with \`client.post(url, json={...})\`. Pass API keys through \`headers={"Authorization": f"Bearer {token}"}\` with the token loaded from an environment variable, never hard-coded. Wrap calls in \`try/except httpx.HTTPError\` and add a simple retry loop with exponential backoff for flaky networks. For hundreds of URLs use \`httpx.AsyncClient\` with \`asyncio.gather\` as you learned in the async lecture.
**Scheduling.** For a script that must run at 9:00 every morning you have three realistic options: the operating system's scheduler (**cron** on Linux/macOS: \`0 9 * * * /path/to/.venv/bin/python /path/to/job.py\`; **Task Scheduler** on Windows), which is the most robust because it survives reboots and needs no running Python process; the tiny \`schedule\` package (\`schedule.every().day.at("09:00").do(job)\` inside a \`while True: schedule.run_pending(); time.sleep(30)\` loop) for a long-running process; or **APScheduler** when you need cron-style expressions, persistence and multiple jobs inside a FastAPI app. In the cloud, GitHub Actions \`on: schedule\` with a cron expression runs a script for free on a timetable. Whichever you choose, **log** every run with the \`logging\` module to a file, because a scheduled job that fails silently at 3 a.m. is worse than no job at all.`,
      codeSnippet: `# automate.py — three everyday automation tasks
from __future__ import annotations

import logging
import os
import time
from datetime import datetime
from pathlib import Path

import httpx

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
    handlers=[logging.FileHandler("automate.log"), logging.StreamHandler()],
)
log = logging.getLogger(__name__)


# 1. Rename photos to  2026-03-14_001.jpg  using their modification date
def rename_photos(folder: Path, dry_run: bool = True) -> int:
    renamed = 0
    for i, path in enumerate(sorted(folder.glob("*.jp*g")), start=1):
        stamp = datetime.fromtimestamp(path.stat().st_mtime).strftime("%Y-%m-%d")
        new_path = path.with_name(f"{stamp}_{i:03d}{path.suffix.lower()}")
        if new_path.exists():
            log.warning("skip %s: %s already exists", path.name, new_path.name)
            continue
        log.info("%s -> %s", path.name, new_path.name)
        if not dry_run:
            path.rename(new_path)
        renamed += 1
    return renamed


# 2. Fetch exchange rates from a JSON API with timeouts, errors and retries
def fetch_json(url: str, retries: int = 3) -> dict:
    headers = {}
    if token := os.environ.get("API_TOKEN"):          # never hard-code secrets
        headers["Authorization"] = f"Bearer {token}"
    with httpx.Client(timeout=10.0, headers=headers) as client:
        for attempt in range(1, retries + 1):
            try:
                response = client.get(url)
                response.raise_for_status()           # 4xx/5xx -> HTTPStatusError
                return response.json()
            except httpx.HTTPError as exc:
                log.warning("attempt %d failed: %s", attempt, exc)
                time.sleep(2 ** attempt)                # 2s, 4s, 8s backoff
    raise RuntimeError(f"gave up after {retries} attempts: {url}")


def usd_to_inr() -> float:
    data = fetch_json("https://open.er-api.com/v6/latest/USD")  # free, no key needed
    return float(data["rates"]["INR"])


# 3. Schedule: run the job every day at 09:00 while this process is alive
#    (install: uv add schedule).  For production prefer cron / Task Scheduler.
def daily_job() -> None:
    rate = usd_to_inr()
    log.info("USD/INR today: %.2f", rate)
    Path("rates.csv").open("a", encoding="utf-8").write(f"{datetime.now():%Y-%m-%d},{rate:.2f}\\n")


if __name__ == "__main__":
    print("dry run:", rename_photos(Path("photos"), dry_run=True), "files would be renamed")
    daily_job()

    import schedule
    schedule.every().day.at("09:00").do(daily_job)
    log.info("scheduler started; press Ctrl+C to stop")
    while True:
        schedule.run_pending()
        time.sleep(30)

# Equivalent cron line (Linux/macOS), runs at 09:00 daily without a long-lived process:
# 0 9 * * * /home/ravi/data-lab/.venv/bin/python /home/ravi/data-lab/automate.py >> /home/ravi/cron.log 2>&1`
    },
    {
      heading: "12. Command-Line Tools with argparse: Subcommands, Types and Help",
      content: `A script that needs its code edited to change the input file is not a tool; a script that accepts \`python report.py sales.csv --top 5 --chart\` is. The standard library's **argparse** turns a function into a professional command-line interface with automatic \`--help\`, type conversion, validation and error messages.
The workflow is always the same:
1. Create \`parser = argparse.ArgumentParser(prog="report", description="...")\`. The description appears in \`--help\`.
2. Declare **positional** arguments (\`parser.add_argument("csv", type=Path)\`) for required inputs and **optional** flags (\`"--top"\`) for settings.
3. Give each argument a \`type\` (\`int\`, \`float\`, \`Path\`, or any one-argument function), a \`default\`, a \`help\` string, and where useful \`choices=["csv", "xlsx"]\` for enumerations. \`action="store_true"\` creates a boolean switch; \`nargs="+"\` collects one or more values into a list; \`required=True\` makes an option mandatory.
4. Call \`args = parser.parse_args()\` and read \`args.csv\`, \`args.top\`. Passing a list to \`parse_args\` instead of relying on \`sys.argv\` makes the parser testable with pytest.
For tools with several verbs (\`generate\`, \`report\`, \`clean\`), use **subparsers**: \`sub = parser.add_subparsers(dest="command", required=True)\` then \`sub.add_parser("report", help=...)\` with its own arguments. A \`match args.command:\` statement (Python 3.10+) dispatches cleanly. Exit with \`raise SystemExit(code)\` or \`parser.error("message")\`, which prints usage and exits with status 2, so shell scripts and CI pipelines can detect failure. Python 3.14 made argparse help output coloured by default in a terminal and added \`suggest_on_error=True\` so a typo like \`--tpo\` suggests \`--top\`.
When should you reach for a third-party library instead? **Typer** builds the CLI from type-hinted function signatures and **Click** uses decorators; both are excellent for large tools with many commands. But argparse ships with Python, needs no dependency, and is what you will find in most existing codebases and interview questions. Add a \`[project.scripts]\` entry in \`pyproject.toml\` (\`report = "sales_report:main"\`) and \`uv sync\` installs your tool as a real command.`,
      codeSnippet: `# cli_demo.py — run: python cli_demo.py --help
import argparse
from pathlib import Path


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="csvtool",
        description="Inspect and convert CSV files.",
        epilog="Example: csvtool convert sales.csv --to xlsx",
    )
    parser.add_argument("-v", "--verbose", action="store_true", help="print extra details")
    sub = parser.add_subparsers(dest="command", required=True, metavar="COMMAND")

    head = sub.add_parser("head", help="show the first rows of a CSV")
    head.add_argument("csv", type=Path, help="path to the CSV file")
    head.add_argument("-n", "--rows", type=int, default=5, help="rows to show (default: 5)")

    conv = sub.add_parser("convert", help="convert a CSV to another format")
    conv.add_argument("csv", type=Path)
    conv.add_argument("--to", choices=["xlsx", "json", "parquet"], required=True)
    conv.add_argument("--columns", nargs="+", metavar="COL", help="keep only these columns")
    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    if not args.csv.exists():
        parser.error(f"file not found: {args.csv}")   # prints usage, exits with code 2

    import pandas as pd
    df = pd.read_csv(args.csv)
    if args.verbose:
        print(f"loaded {len(df)} rows, {len(df.columns)} columns")

    match args.command:
        case "head":
            print(df.head(args.rows).to_string(index=False))
        case "convert":
            if args.columns:
                df = df[args.columns]
            out = args.csv.with_suffix("." + args.to)
            match args.to:
                case "xlsx":
                    df.to_excel(out, index=False)
                case "json":
                    df.to_json(out, orient="records", indent=2)
                case "parquet":
                    df.to_parquet(out)          # needs: uv add pyarrow
            print(f"wrote {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

# $ python cli_demo.py head data/orders_clean.csv -n 2
# $ python cli_demo.py convert data/orders_clean.csv --to xlsx --columns order_id city qty
# $ python cli_demo.py convert missing.csv --to json
# usage: csvtool [-h] [-v] COMMAND ...
# csvtool: error: file not found: missing.csv      (exit status 2)

# Test with pytest by passing argv explicitly:
# def test_head(tmp_path, capsys):
#     p = tmp_path / "x.csv"; p.write_text("a,b\\n1,2\\n3,4\\n")
#     assert main(["head", str(p), "-n", "1"]) == 0
#     assert "1" in capsys.readouterr().out`
    },
    {
      heading: "13. Real-World Use Cases: How NumPy, pandas and Automation Are Used in Production",
      content: `Here is how the techniques in this lecture appear in actual Indian workplaces, so you can picture where your new skills fit.
• **Finance and accounting reconciliation** — a fintech in Mumbai receives a daily settlement CSV from a payment gateway and a transactions export from its own database. A pandas script reads both (\`read_csv\` with \`dtype={"txn_id": "string"}\` to protect long IDs), merges with \`how="outer", indicator=True\`, and every \`left_only\` or \`right_only\` row becomes a ticket. What took an analyst four hours now runs in 20 seconds at 6 a.m. via cron.
• **E-commerce analytics** — a Bengaluru marketplace computes weekly category revenue, repeat-purchase rate and average order value per city with \`groupby\` and \`pivot_table\`, writes a multi-sheet Excel with \`ExcelWriter\`, renders charts with matplotlib and emails the file to category managers. The whole pipeline is an argparse CLI with \`--week\` and \`--dry-run\` flags, scheduled by GitHub Actions.
• **Data engineering pipelines** — pandas is the glue in ETL: read Parquet from S3, clean with \`fillna\`/\`astype\`/\`drop_duplicates\`, validate row counts, write to a warehouse with \`to_sql\`. Teams at larger scale move to Polars, Spark or DuckDB, but the DataFrame vocabulary (select, filter, groupby, join) transfers directly.
• **Machine learning preprocessing** — every scikit-learn or PyTorch project begins with a DataFrame: filtering outliers with boolean masks, encoding categories, filling missing values with group medians, then \`.to_numpy()\` to hand a NumPy array to the model. The AI track on this site builds on exactly these operations.
• **IoT and sensor monitoring** — a factory in Pune logs temperature every 10 seconds. NumPy computes rolling means and standard deviations on millions of readings via vectorized operations; pandas \`resample("5min")\` downsamples for dashboards; \`interpolate(method="time")\` patches short outages.
• **IT and DevOps automation** — renaming and archiving thousands of log files with \`pathlib\`, polling a health-check API with \`httpx\` and posting to Slack when it fails, rotating backups on a schedule, and small internal CLIs (\`deploytool status --env prod\`) that wrap cloud SDKs with argparse.
• **Education and HR** — colleges merge attendance and marks sheets from different Excel formats, compute per-student percentages with broadcasting, and generate per-department histograms. HR teams deduplicate applicant spreadsheets with \`drop_duplicates(subset=["email"])\` and \`str.lower().str.strip()\` normalisation.
The common thread: read, clean, join, summarise, visualise, schedule. Master that loop and you are productive in any of these domains within a week.`
    },
    {
      heading: "14. Common Mistakes with NumPy, pandas and Python Automation and How to Fix Them",
      content: `• **Looping over rows with \`iterrows()\`** — it is 100 to 1,000 times slower than vectorized code and returns each row as a Series with a single upcast dtype. Fix: express the logic with column arithmetic, \`np.where\`, \`.map\`, or \`groupby().transform\`. Reach for \`.apply(axis=1)\` only as a last resort, and \`itertuples()\` if you truly must iterate.
• **Chained assignment** such as \`df[df["qty"] > 1]["discount"] = 0.1\` — in pandas 2.x this triggers \`SettingWithCopyWarning\` and silently does nothing; under pandas 3.0 Copy-on-Write it does nothing without a warning. Fix: a single \`df.loc[mask, "discount"] = 0.1\`.
• **Using \`and\` / \`or\` between masks** — raises "The truth value of a Series is ambiguous". Fix: \`&\`, \`|\`, \`~\` with parentheses around each comparison.
• **Confusing \`loc\` and \`iloc\`** after sorting or dropping rows — \`df.loc[0]\` is the row labelled 0, which may now be anywhere, while \`df.iloc[0]\` is the first row. Fix: call \`reset_index(drop=True)\` after reordering, or be explicit about which indexer you want.
• **Wrong \`axis\`** — \`df.drop("city")\` fails because the default axis is rows; \`marks.mean(axis=1)\` when you wanted per-column. Fix: remember "the axis you pass is the one that collapses", and use \`columns=["city"]\` in \`drop\` instead of \`axis=1\`.
• **Row count silently changing after \`merge\`** — duplicate keys on the right side multiply rows; an inner join drops unmatched rows. Fix: \`validate="many_to_one"\`, \`how="left"\` for enrichment, and assert \`len(before) == len(after)\`.
• **Forgetting \`index=False\` in \`to_csv\`** — the next read produces an \`Unnamed: 0\` column. Fix: always pass \`index=False\` unless the index is meaningful.
• **Comparing with \`== np.nan\`** — always False. Fix: \`.isna()\` / \`.notna()\`; for nullable dtypes use \`pd.isna(value)\`.
• **Misparsed dates** — \`"03-04-2026"\` read as 4 March instead of 3 April. Fix: pass \`date_format="%d-%m-%Y"\` (or \`dayfirst=True\`) and spot-check \`df["date"].min()\` and \`.max()\`.
• **Lost leading zeros and precision** — pincodes, phone numbers and Aadhaar-like IDs parsed as integers. Fix: \`dtype={"pincode": "string"}\` at read time.
• **Modifying a NumPy view by accident** — a slice shares memory with the original. Fix: \`.copy()\` when you intend to mutate independently.
• **Broadcasting shape errors** — \`(n, 3)\` minus \`(n,)\`. Fix: \`vec[:, np.newaxis]\` so the trailing dimensions line up.
• **Automation without a dry run or logging** — a rename script that overwrote 400 photos. Fix: \`--dry-run\` flag, \`exists()\` checks, and \`logging\` to a file.
• **Hard-coded API keys and no timeouts** — a leaked key on GitHub, or a script that hangs forever on a dead endpoint. Fix: \`os.environ\`, \`timeout=10.0\`, \`raise_for_status()\`, bounded retries with backoff.
• **Using \`plt.plot\` globals in a multi-chart script** — charts bleed into each other. Fix: the object-oriented \`fig, ax = plt.subplots()\` API and \`matplotlib.use("Agg")\` for scripts.`
    },
    {
      heading: "15. Frequently Asked Questions about NumPy, pandas and Python Automation",
      content: `**What is the difference between a NumPy array and a Python list?**
A NumPy array stores elements of one dtype in a contiguous memory block and performs arithmetic in compiled C code, so it is far faster and more memory-efficient for numeric work and supports vectorized operations, broadcasting and multi-dimensional indexing. A Python list stores pointers to arbitrary objects, can mix types and grow dynamically, but every operation runs element by element in the interpreter.
**What is the difference between loc and iloc in pandas?**
\`loc\` selects by index and column labels and its slices include the end label; \`iloc\` selects by integer position like a Python list and its slices exclude the end. They look the same on a fresh DataFrame with a 0..n index but diverge after sorting, filtering or \`set_index\`.
**How do I handle missing values in a pandas DataFrame?**
First measure them with \`df.isna().sum()\`, then choose per column: \`dropna(subset=[...])\` for rows that are unusable, \`fillna\` with a constant, a median or a group median, \`ffill\` for time series, or \`interpolate\` for numeric gaps. Use the nullable \`Int64\` and \`string\` dtypes to keep integers and text alongside \`pd.NA\`.
**What is broadcasting in NumPy?**
Broadcasting is the set of rules that lets NumPy combine arrays of different shapes without copying data. Shapes are compared from the right; dimensions must be equal or one of them must be 1, and the size-1 dimension is stretched to match. That is how a \`(1000, 3)\` matrix can subtract a \`(3,)\` row vector of column means in one expression.
**How do I merge two DataFrames in pandas?**
Use \`pd.merge(left, right, on="key", how="left")\` or \`left.merge(right, ...)\`. \`how\` chooses inner, left, right or outer join semantics exactly like SQL; \`left_on\`/\`right_on\` handle differently named keys, \`suffixes\` disambiguate overlapping columns, \`validate\` guards against duplicate keys and \`indicator=True\` reveals unmatched rows.
**Is pandas 3.0 different from pandas 2.x? Will my code break?**
pandas 3.0 (early 2026) enables Copy-on-Write by default, so chained assignment never modifies the original, and text columns use a dedicated string dtype instead of \`object\`. Code that already uses \`df.loc[mask, col] = value\`, avoids \`inplace=True\` and does not rely on \`object\` dtype for strings runs unchanged; the pandas team recommends upgrading to 2.3 first and fixing its deprecation warnings.
**Should I use argparse, Click or Typer for a Python CLI?**
argparse is in the standard library, needs no installation and is enough for most scripts, including ones with subcommands. Typer (built on Click) generates the CLI from type hints with less boilerplate and better help output, and is a good choice for larger tools you distribute to others. Learn argparse first because it is everywhere.
**How do I schedule a Python script to run every day?**
On Linux and macOS use cron (\`0 9 * * * /path/.venv/bin/python /path/job.py\`), on Windows use Task Scheduler, and in the cloud use GitHub Actions \`on: schedule\` or a managed scheduler. Use the \`schedule\` or APScheduler packages only when the job must live inside an already long-running Python process, and always log each run to a file.`
    },
    {
      heading: "16. Interview Questions and Answers on NumPy, pandas and Automation",
      content: `**Q1. Why is NumPy faster than pure Python for numeric work?**
Because an ndarray stores homogeneous data contiguously and its operations are implemented in C, a single call like \`a * b\` runs one tight compiled loop with no per-element type checking, reference counting or bytecode dispatch. The interpreter is entered once instead of a million times, and contiguous memory lets the CPU use its cache and SIMD instructions efficiently.
**Q2. Explain the axis parameter in NumPy and pandas.**
\`axis=0\` runs down the rows (operating on each column), \`axis=1\` runs across the columns (operating on each row). The axis you pass is the one that is collapsed by a reduction: \`df.sum(axis=0)\` gives one value per column. In \`drop\` and \`concat\` the axis names what you are removing or stacking: rows (0) or columns (1).
**Q3. What is a view versus a copy in NumPy, and why does it matter?**
Basic slicing (\`a[2:5]\`, \`a[:, 0]\`) returns a view that shares memory with the original, so writing to the slice changes the original; fancy indexing with lists or boolean masks returns a copy. It matters because accidental mutation through a view is a silent bug, and unnecessary copies of large arrays waste memory. Use \`.copy()\` to be explicit, and \`np.shares_memory(a, b)\` to check.
**Q4. What does groupby do internally, and what is split-apply-combine?**
\`groupby\` computes the group each row belongs to (split), applies an aggregation, transformation or filter to each group independently (apply), and assembles the results into a new Series or DataFrame indexed by group key (combine). Aggregation returns one row per group, transform returns the original shape, and filter returns a subset of the original rows.
**Q5. What is the difference between merge, join and concat?**
\`merge\` performs SQL-style joins on one or more key columns with inner/left/right/outer semantics. \`join\` is a convenience wrapper that joins on the index. \`concat\` does not match keys at all; it stacks DataFrames vertically (new rows) or horizontally (new columns, aligned on index).
**Q6. How does pandas represent missing data, and what is the difference between NaN and pd.NA?**
\`NaN\` is a float value, so an integer column with a missing value becomes \`float64\`, and \`NaT\` is its datetime equivalent. \`pd.NA\` is a dtype-agnostic missing marker used by the nullable dtypes (\`Int64\`, \`boolean\`, \`string\`), which keep their type and propagate \`NA\` through comparisons instead of returning False. Always test with \`isna()\` rather than equality.
**Q7. What is the SettingWithCopyWarning and how does Copy-on-Write change things?**
In pandas 2.x, \`df[mask]["col"] = value\` first creates a possibly-temporary copy and then assigns into it, so the warning tells you the original may not have changed. pandas 3.0's Copy-on-Write makes the rule simple: any derived object is a logical copy and mutating it never affects the parent, so chained assignment is simply ineffective. The correct form in both versions is \`df.loc[mask, "col"] = value\`.
**Q8. How would you read a 10 GB CSV that does not fit in memory with pandas?**
Use \`pd.read_csv(path, chunksize=500_000)\` to iterate over chunks and aggregate incrementally, load only needed columns with \`usecols\`, downcast dtypes (\`category\` for repeated strings, \`float32\`), or convert the file once to Parquet and query it with \`pyarrow\`, DuckDB or Polars. Reading the whole file into a DataFrame is not the only option.
**Q9. How do you make an argparse CLI testable?**
Separate parser construction (\`build_parser()\`) from execution (\`main(argv=None)\`) and have \`main\` call \`parser.parse_args(argv)\`. Tests then call \`main(["report", "file.csv", "--top", "3"])\` directly and inspect the return code and captured output with pytest's \`capsys\`, without touching \`sys.argv\` or spawning a subprocess.
**Q10. How do you make an automation script that calls an external API robust?**
Set an explicit timeout, call \`raise_for_status()\`, catch \`httpx.HTTPError\`, retry a bounded number of times with exponential backoff, read credentials from environment variables, make the script idempotent so a rerun does no harm, log every run to a file, and provide a \`--dry-run\` mode for any destructive step.`
    },
    {
      heading: "17. Hands-On Exercise: Build a Sales Report CLI with pandas, matplotlib and argparse",
      content: `This exercise combines everything in the lecture into one tool a small business could actually use. \`sales_report.py\` has two subcommands:
• \`generate\` creates a realistic \`sales.csv\` with 500 orders across eight Indian cities, deliberately including missing quantities and duplicate rows, so you practise cleaning.
• \`report\` loads the CSV, removes duplicates, fills missing quantities, computes revenue, merges in a city-to-region lookup, prints revenue by city and region, month-on-month growth, the top products, and optionally saves a bar chart.
Set up and run it:
1. \`uv init sales-tool && cd sales-tool && uv add numpy pandas matplotlib\`
2. Save the code as \`sales_report.py\`.
3. \`uv run python sales_report.py generate\`
4. \`uv run python sales_report.py report sales.csv --top 3 --chart\`
5. \`uv run python sales_report.py report sales.csv --month 2026-03\`
Read the code top to bottom and notice the patterns: a fixed random seed for reproducibility, \`drop_duplicates(subset="order_id")\`, \`fillna\` with a documented reason, named aggregation, a left merge with \`validate\`, \`pct_change\` for growth, the object-oriented matplotlib API with a headless backend, \`match\` on the subcommand, and \`raise SystemExit(main())\` so the exit code reaches the shell.
Extension ideas once it works: add a \`--to xlsx\` option that writes every summary table to a multi-sheet workbook; add a \`--region\` filter; write pytest tests for \`load_and_clean\` using \`tmp_path\`; schedule the \`report\` command with cron and \`httpx.post\` the chart to a Slack webhook.`,
      codeSnippet: `# sales_report.py
# Usage:
#   python sales_report.py generate [--out sales.csv] [--rows 500]
#   python sales_report.py report sales.csv [--top 5] [--month 2026-03] [--chart]
from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
import pandas as pd

CITY_REGION = {
    "Mumbai": "West", "Pune": "West", "Delhi": "North", "Jaipur": "North",
    "Bengaluru": "South", "Chennai": "South", "Hyderabad": "South", "Kolkata": "East",
}
PRODUCTS = {"Laptop": 54999, "Phone": 24999, "Headphones": 2999, "Monitor": 12999, "Keyboard": 1499}


# ---------- generate ----------
def generate(path: Path, rows: int, seed: int = 42) -> None:
    rng = np.random.default_rng(seed)
    dates = pd.date_range("2026-01-01", "2026-06-30", freq="D").to_numpy()
    products = rng.choice(list(PRODUCTS), size=rows)
    df = pd.DataFrame({
        "order_id": np.arange(1, rows + 1),
        "date": rng.choice(dates, size=rows),
        "city": rng.choice(list(CITY_REGION), size=rows),
        "product": products,
        "quantity": rng.integers(1, 5, size=rows).astype(float),
        "unit_price": [PRODUCTS[p] for p in products],
    })
    # Realistic dirt: 3% missing quantities and 5 duplicated rows
    df.loc[rng.choice(rows, size=rows // 33, replace=False), "quantity"] = np.nan
    df = pd.concat([df, df.sample(5, random_state=seed)], ignore_index=True)
    df = df.sort_values("date").reset_index(drop=True)
    df.to_csv(path, index=False)
    print(f"Wrote {len(df)} rows to {path}")


# ---------- clean ----------
def load_and_clean(path: Path) -> pd.DataFrame:
    df = pd.read_csv(path, parse_dates=["date"])
    before = len(df)
    df = df.drop_duplicates(subset="order_id").reset_index(drop=True)
    missing = int(df["quantity"].isna().sum())
    # Business rule: an order with no recorded quantity is treated as a single unit
    df["quantity"] = df["quantity"].fillna(1).astype("Int64")
    df["revenue"] = df["quantity"] * df["unit_price"]
    df["month"] = df["date"].dt.to_period("M").astype(str)
    print(f"Loaded {before} rows -> {len(df)} unique orders; filled {missing} missing quantities")
    return df


# ---------- analyse ----------
def build_report(df: pd.DataFrame, top: int) -> dict[str, pd.DataFrame | pd.Series]:
    regions = pd.DataFrame({"city": list(CITY_REGION), "region": list(CITY_REGION.values())})
    merged = df.merge(regions, on="city", how="left", validate="many_to_one")
    assert len(merged) == len(df), "merge changed the row count"

    by_city = (
        merged.groupby("city")
        .agg(orders=("order_id", "count"), units=("quantity", "sum"), revenue=("revenue", "sum"))
        .sort_values("revenue", ascending=False)
    )
    by_region = merged.groupby("region")["revenue"].sum().sort_values(ascending=False)
    monthly = merged.groupby("month")["revenue"].sum()
    growth = pd.DataFrame({
        "revenue_lakh": (monthly / 1e5).round(2),
        "mom_growth_pct": (monthly.pct_change() * 100).round(1),
    })
    top_products = (
        merged.groupby("product")["revenue"].sum().sort_values(ascending=False).head(top)
    )
    return {"by_city": by_city, "by_region": by_region, "growth": growth, "top_products": top_products}


def print_report(result: dict, top: int) -> None:
    by_city = result["by_city"].copy()
    by_city["revenue"] = (by_city["revenue"] / 1e5).round(2)
    print(f"\\n== Top {top} cities by revenue (₹ lakh) ==")
    print(by_city.head(top).to_string())

    print("\\n== Revenue by region (₹ lakh) ==")
    print((result["by_region"] / 1e5).round(2).to_string())

    print("\\n== Month-on-month growth ==")
    print(result["growth"].to_string())

    print(f"\\n== Top {top} products (₹ lakh) ==")
    print((result["top_products"] / 1e5).round(2).to_string())


# ---------- chart ----------
def save_chart(by_city: pd.DataFrame, out: Path) -> None:
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    fig, ax = plt.subplots(figsize=(8, 4.5))
    values = by_city["revenue"] / 1e5
    ax.bar(by_city.index, values, color="#1e3a8a")
    ax.set_title("Revenue by city, Jan-Jun 2026")
    ax.set_ylabel("Revenue (₹ lakh)")
    ax.tick_params(axis="x", rotation=30)
    for i, v in enumerate(values):
        ax.text(i, v + 0.3, f"{v:.1f}", ha="center", fontsize=8)
    fig.tight_layout()
    fig.savefig(out, dpi=150)
    print(f"\\nChart saved to {out}")


# ---------- CLI ----------
def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="sales_report", description="Generate and analyse a sales CSV.")
    sub = parser.add_subparsers(dest="command", required=True)

    gen = sub.add_parser("generate", help="create a sample sales.csv")
    gen.add_argument("--out", type=Path, default=Path("sales.csv"))
    gen.add_argument("--rows", type=int, default=500)

    rep = sub.add_parser("report", help="analyse a sales CSV")
    rep.add_argument("csv", type=Path, help="path to the sales CSV")
    rep.add_argument("--top", type=int, default=5, help="how many cities/products to show")
    rep.add_argument("--month", help="restrict to one month, e.g. 2026-03")
    rep.add_argument("--chart", action="store_true", help="save revenue_by_city.png next to the CSV")
    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    match args.command:
        case "generate":
            generate(args.out, args.rows)
        case "report":
            if not args.csv.exists():
                parser.error(f"{args.csv} not found - run 'generate' first")
            df = load_and_clean(args.csv)
            if args.month:
                df = df[df["month"] == args.month]
                if df.empty:
                    print(f"No orders found for {args.month}")
                    return 1
            result = build_report(df, args.top)
            print_report(result, args.top)
            if args.chart:
                save_chart(result["by_city"], args.csv.with_name("revenue_by_city.png"))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

# Example session (figures are illustrative; the seed makes your run reproducible):
# $ python sales_report.py generate
# Wrote 505 rows to sales.csv
# $ python sales_report.py report sales.csv --top 3 --chart
# Loaded 505 rows -> 500 unique orders; filled 15 missing quantities
#
# == Top 3 cities by revenue (₹ lakh) ==
#            orders  units  revenue
# city
# Bengaluru      70    171    39.12
# Mumbai         66    168    37.85
# Delhi          63    155    35.40
# ...
# Chart saved to revenue_by_city.png`
    },
    {
      heading: "18. Summary and Course Wrap-Up: Your Python Learning Paths",
      content: `• **NumPy** gives Python a fast, fixed-dtype \`ndarray\`; think in \`shape\`, \`dtype\` and \`axis\`, remember that slices are views, and use \`default_rng\` for reproducible randomness.
• **Vectorization** replaces loops with whole-array expressions; **broadcasting** aligns shapes from the right (equal or 1); **boolean masks** and \`np.where\` express conditional logic.
• **pandas** adds labels: a \`Series\` is a labelled column, a \`DataFrame\` a table of them. Start every analysis with \`head\`, \`info\` and \`describe\`.
• \`read_csv\` / \`read_excel\` with \`parse_dates\`, \`dtype\`, \`na_values\` and \`thousands\` turn messy files into typed tables; write back with \`index=False\`.
• Select by label with \`loc\`, by position with \`iloc\`; filter with \`&\`, \`|\`, \`~\`, \`isin\`, \`between\`, \`str\` and \`dt\` accessors, or \`query\`.
• \`groupby\` is split-apply-combine; prefer **named aggregation**, use \`transform\` for same-shape results and \`pivot_table\` for cross-tabs.
• \`merge\` is a SQL join (use \`how="left"\`, \`validate\`, \`indicator\`); \`concat\` stacks tables; always check row counts.
• Missing data: measure with \`isna().sum()\`, then \`dropna(subset)\`, \`fillna\` (constant, median, group median), \`ffill\` or \`interpolate\`; use nullable \`Int64\` / \`string\` dtypes.
• **matplotlib**: \`fig, ax = plt.subplots()\`, label everything, \`savefig\` with the Agg backend in scripts.
• **Automation**: \`pathlib\` for files with \`--dry-run\` and existence checks; \`httpx\` with timeouts, \`raise_for_status\` and retries; cron / Task Scheduler / GitHub Actions for scheduling, with logging.
• **argparse** turns scripts into real tools: positional and optional arguments, types, choices, subparsers, \`parse_args(argv)\` for testability, \`match\` for dispatch.
**Course wrap-up.** You have now completed the Complete Python Course: from variables and control flow, through functions, data structures, OOP, error handling, files, modules and packaging, iterators and generators, decorators and context managers, async programming, testing with pytest and REST APIs with FastAPI, to data analysis and automation today. That is the full toolkit of a professional Python developer in 2026. The single most important next step is to **build something you will actually use**: a tool that reconciles your expenses, a scraper for job listings in your city, a FastAPI service with a pandas report endpoint, or a scheduled script that saves you one boring task every morning. Put it on GitHub with a README, tests and a \`pyproject.toml\`; that repository will do more for your interviews than any certificate.
**Where to go next on this site:**
• **Web track** — if you enjoyed FastAPI, continue with the Complete Next.js Course and the React notes to build full-stack products: a Next.js frontend talking to your FastAPI backend, with authentication, caching and deployment.
• **Data track** — go deeper into pandas with time series, window functions and performance (Polars, DuckDB, Parquet), then SQL for analysts and dashboarding; the groupby/merge/missing-data skills from this lecture are the foundation of every data analyst and data engineer role.
• **AI track** — the NumPy array operations you practised today are exactly what scikit-learn, PyTorch and the LLM tooling expect. Follow the AI notes on this site to go from DataFrames to machine learning models, embeddings and building agents with Python.
Thank you for completing the course. Keep writing Python every day, read the official documentation when something surprises you, and come back to these notes whenever you need a reference. Happy coding!
**Next lecture:** This is the final lecture of the Complete Python Course. Continue with the Next.js, React, Java or AI tracks on this site.`
    }
  ]
};
