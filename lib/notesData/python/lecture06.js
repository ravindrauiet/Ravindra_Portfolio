export const lecture06 = {
  slug: "lecture-6",
  number: 6,
  title: "Complete Python Course — Lecture 6: Object-Oriented Programming in Python",
  summary: "Master object-oriented programming in Python: classes and objects, __init__ and self, instance vs class attributes, @classmethod and @staticmethod, inheritance, super() and MRO, dunder methods, @property, encapsulation, abstract base classes, composition and dataclasses, with runnable examples.",
  readTime: "65 min read",
  difficulty: "Intermediate",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. Introduction: What Is Object-Oriented Programming in Python and Why It Matters",
      content: `**Object-oriented programming (OOP)** is a way of organising code around **objects**: bundles of data (attributes) and the functions that operate on that data (methods). Instead of passing a dictionary of account details to a dozen loose functions, you create a \`BankAccount\` object that *knows* its balance and *knows how* to deposit, withdraw and print a statement.
In Python, everything you have used so far is already an object. The integer \`42\`, the string \`"Mumbai"\`, the list \`[1, 2, 3]\`, even functions and modules are objects with a type and attributes. Lecture 5 showed you \`list.append()\` and \`dict.items()\`: those are methods on built-in classes. This lecture teaches you to build your own.
Why OOP matters in real projects:
• **Modelling the domain** — an e-commerce backend has \`Customer\`, \`Order\`, \`Payment\` and \`Shipment\` objects. Code that mirrors the business is easier to read and discuss with non-programmers.
• **Encapsulation** — the rules for changing a balance live inside \`BankAccount\`, so nobody can accidentally set it to a negative number from somewhere else in the codebase.
• **Reuse through inheritance and composition** — Django models, FastAPI dependencies, pandas DataFrames, PyTorch modules and pytest fixtures are all built on classes. You cannot read framework source code, or write a plugin for it, without understanding OOP.
• **Testability** — small objects with clear responsibilities are easy to unit-test and mock.
Python's OOP is deliberately lightweight compared with Java or C++. There is no \`private\` keyword, no interfaces in the strict sense, and no requirement to put one class per file. The language trusts you ("we are all consenting adults") and gives you conventions instead of walls. By the end of this lecture you will be able to design a small class hierarchy, override the operators Python uses behind the scenes, protect data with properties, define contracts with abstract base classes and remove boilerplate with dataclasses.
This lecture targets Python 3.13/3.14 (Python 3.14 is the current stable series as of writing, with 3.15 scheduled for October 2026). Version-specific features are labelled as they appear.`
    },
    {
      heading: "2. Classes and Instances: Defining Your First Python Class with __init__ and self",
      content: `A **class** is a blueprint; an **instance** (or object) is a concrete thing built from that blueprint. \`class Student:\` defines the blueprint, and \`Student("Priya", 21)\` builds one student.
Key pieces of syntax:
• **\`class Name:\`** — class names use \`CapWords\` (PascalCase) by PEP 8. The body is indented like a function body.
• **\`__init__(self, ...)\`** — the **initialiser**. Python calls it automatically right after creating a new, empty object. Its job is to attach the starting attributes. It is often called the "constructor", though strictly the object is created by \`__new__\` and *initialised* by \`__init__\`.
• **\`self\`** — the first parameter of every instance method. It refers to the specific object the method is being called on. The name \`self\` is a convention, not a keyword, but every Python developer expects it.
• **Attribute assignment** — \`self.name = name\` creates an instance attribute. There is no declaration step; the attribute exists the moment you assign it.
When you write \`priya.greet()\`, Python translates it to \`Student.greet(priya)\`. That is exactly why \`self\` must be the first parameter and why forgetting it produces the famous "takes 0 positional arguments but 1 was given" error.
Every instance gets its own \`__dict__\`, a dictionary that stores its attributes. \`vars(priya)\` shows it. You can even add attributes after construction (\`priya.city = "Pune"\`), though in production you should set everything in \`__init__\` so readers know what an object contains.
Type hints on \`__init__\` parameters are strongly recommended. They cost nothing at runtime and let editors and tools such as mypy or pyright catch mistakes before you run the code.`,
      codeSnippet: `# student.py
class Student:
    """A student enrolled in a course."""

    def __init__(self, name: str, age: int, course: str = "Python") -> None:
        # Attach data to THIS object (self)
        self.name = name
        self.age = age
        self.course = course
        self.marks: list[int] = []        # starts empty for every student

    def add_marks(self, score: int) -> None:
        self.marks.append(score)

    def average(self) -> float:
        if not self.marks:
            return 0.0
        return sum(self.marks) / len(self.marks)

    def greet(self) -> str:
        return f"Hi, I am {self.name}, {self.age}, studying {self.course}."


priya = Student("Priya", 21)
rahul = Student("Rahul", 23, course="Data Science")

priya.add_marks(88)
priya.add_marks(92)

print(priya.greet())            # Hi, I am Priya, 21, studying Python.
print(priya.average())          # 90.0
print(rahul.average())          # 0.0  (separate marks list)
print(type(priya))              # <class '__main__.Student'>
print(vars(priya))              # {'name': 'Priya', 'age': 21, 'course': 'Python', 'marks': [88, 92]}
print(Student.greet(rahul))     # same as rahul.greet()
print(isinstance(priya, Student))   # True`
    },
    {
      heading: "3. Instance Attributes vs Class Attributes in Python",
      content: `There are two places an attribute can live:
• **Instance attributes** are stored in the object's own \`__dict__\`. They are created with \`self.x = ...\` and are different for every object. Name, balance, email: anything that varies per object.
• **Class attributes** are defined directly in the class body (not inside a method). They are stored once on the class and **shared by all instances**. Use them for constants, defaults and counters: an interest rate, a species name, a registry of created objects.
When you read \`obj.attr\`, Python looks in the instance \`__dict__\` first, then in the class, then in parent classes. This is the **attribute lookup chain**. When you *write* \`obj.attr = value\`, Python always writes to the instance, which creates a new instance attribute that *shadows* the class attribute for that one object. The class attribute itself is untouched.
This lookup rule produces the most famous OOP bug in Python: a **mutable class attribute** such as a list. If \`Student.marks = []\` is a class attribute and every student does \`self.marks.append(...)\`, all students share one list because \`append\` mutates the shared object in place rather than assigning a new one. The fix is to create mutable containers in \`__init__\`, exactly as the previous section did.
Legitimate uses of class attributes:
• Constants: \`GST_RATE = 0.18\`.
• A counter of how many objects exist (incremented via \`type(self).count += 1\` or \`ClassName.count += 1\`).
• Default configuration a subclass can override: \`timeout = 30\`.
Note that \`self.count += 1\` would **not** update the class counter: it reads the class value, adds one and writes an *instance* attribute. Always modify class attributes through the class.`,
      codeSnippet: `# attributes.py
class BankAccount:
    bank_name = "State Bank of Bharat"     # class attribute: shared
    interest_rate = 0.04                   # class attribute: shared
    total_accounts = 0                     # class attribute: counter

    def __init__(self, owner: str, balance: float = 0.0) -> None:
        self.owner = owner                 # instance attribute
        self.balance = balance             # instance attribute
        BankAccount.total_accounts += 1    # modify via the class, not self


a = BankAccount("Asha", 50_000)
b = BankAccount("Bilal", 12_000)

print(a.bank_name, b.bank_name)          # State Bank of Bharat State Bank of Bharat
print(BankAccount.total_accounts)        # 2

BankAccount.interest_rate = 0.05         # change for everyone
print(a.interest_rate, b.interest_rate)  # 0.05 0.05

a.interest_rate = 0.07                   # creates an INSTANCE attribute on a only
print(a.interest_rate, b.interest_rate)  # 0.07 0.05
print("interest_rate" in vars(a))        # True
print("interest_rate" in vars(b))        # False


# The classic bug: mutable class attribute
class BuggyCart:
    items = []                           # shared by ALL carts!

    def add(self, item: str) -> None:
        self.items.append(item)

c1, c2 = BuggyCart(), BuggyCart()
c1.add("laptop")
print(c2.items)                          # ['laptop']  <- c2 never added anything


class FixedCart:
    def __init__(self) -> None:
        self.items: list[str] = []       # one list per cart

    def add(self, item: str) -> None:
        self.items.append(item)

f1, f2 = FixedCart(), FixedCart()
f1.add("laptop")
print(f2.items)                          # []`
    },
    {
      heading: "4. Instance Methods, @classmethod and @staticmethod in Python",
      content: `Python classes support three kinds of methods, distinguished by what they receive as their first argument.
**Instance methods** receive \`self\`. They are the default and the most common. They read or change the state of one specific object.
**Class methods** are decorated with \`@classmethod\` and receive the **class** as the first argument, conventionally named \`cls\`. They cannot see any individual instance, but they can read class attributes and, crucially, **create new instances** with \`cls(...)\`. The dominant use case is **alternative constructors**: \`Date.from_iso("2026-10-09")\`, \`Config.from_env()\`, \`User.from_dict(payload)\`. Because they use \`cls\` rather than the hard-coded class name, they work correctly for subclasses: \`Employee.from_dict(d)\` returns an \`Employee\`, not a \`Person\`. Real examples: \`dict.fromkeys()\`, \`datetime.fromtimestamp()\`, \`int.from_bytes()\`.
**Static methods** are decorated with \`@staticmethod\` and receive **nothing** special: no \`self\`, no \`cls\`. They are ordinary functions that happen to live inside the class namespace because they logically belong with it. Use them for validators and helpers such as \`Account.is_valid_ifsc(code)\` or unit conversions. If a function never touches \`self\` or \`cls\`, make it static (or move it to module level). Linters such as pylint will warn about "method could be a function" otherwise.
Decision rule:
• Needs this object's data → instance method.
• Needs the class (to build an instance or read class config) → \`@classmethod\`.
• Needs neither, just belongs here conceptually → \`@staticmethod\`.
Version note: combining \`@classmethod\` with \`@property\` to make "class properties" was deprecated in Python 3.11 and **removed in Python 3.13**. Use a plain class method or a module-level constant instead.`,
      codeSnippet: `# methods.py
from datetime import date


class Employee:
    company = "Infosys"
    _next_id = 1001

    def __init__(self, name: str, salary: float, joined: date) -> None:
        self.name = name
        self.salary = salary
        self.joined = joined
        self.emp_id = Employee._next_id
        Employee._next_id += 1

    # --- instance method: needs self ---
    def years_of_service(self, today: date | None = None) -> int:
        today = today or date.today()
        return (today - self.joined).days // 365

    # --- class method: alternative constructor ---
    @classmethod
    def from_dict(cls, data: dict) -> "Employee":
        return cls(
            name=data["name"],
            salary=float(data["salary"]),
            joined=date.fromisoformat(data["joined"]),
        )

    @classmethod
    def intern(cls, name: str) -> "Employee":
        """Another alternative constructor with fixed defaults."""
        return cls(name, salary=15_000, joined=date.today())

    # --- static method: pure helper, no self/cls ---
    @staticmethod
    def is_valid_pan(pan: str) -> bool:
        return (
            len(pan) == 10
            and pan[:5].isalpha()
            and pan[5:9].isdigit()
            and pan[9].isalpha()
        )


payload = {"name": "Meera", "salary": "85000", "joined": "2021-06-15"}
meera = Employee.from_dict(payload)
print(meera.emp_id, meera.name, meera.salary)                 # 1001 Meera 85000.0
print(meera.years_of_service(date(2026, 10, 9)))              # 5

arjun = Employee.intern("Arjun")
print(arjun.emp_id, arjun.salary)                             # 1002 15000

print(Employee.is_valid_pan("ABCDE1234F"))                    # True
print(meera.is_valid_pan("1234"))                             # False (works on instances too)


class Manager(Employee):
    pass

boss = Manager.from_dict(payload)
print(type(boss).__name__)                                    # Manager  <- cls, not Employee`
    },
    {
      heading: "5. Inheritance and super() in Python",
      content: `**Inheritance** lets a new class (the **child** or **subclass**) reuse and extend an existing class (the **parent**, **base** or **superclass**). Write \`class Dog(Animal):\` and \`Dog\` automatically gets every attribute and method of \`Animal\`. The relationship should read as **"is-a"**: a Dog *is an* Animal, a SavingsAccount *is a* BankAccount.
Three things a subclass can do:
1. **Inherit** a method unchanged: it simply uses the parent's version.
2. **Override** a method: define a method with the same name, and the child's version wins when called on a child instance.
3. **Extend** a method: override it, but call the parent's version inside using \`super()\`, then add extra behaviour.
**\`super()\`** returns a proxy that lets you call methods of the parent class *without naming it*. In Python 3, the zero-argument form \`super().__init__(...)\` is all you need inside a method. The most common use is in \`__init__\`: the child accepts the parent's parameters plus its own, passes the parent's ones up with \`super().__init__(...)\`, and then sets its own attributes. If you forget to call \`super().__init__()\`, the parent's attributes are never created and you get \`AttributeError\` later.
Why \`super()\` rather than \`Animal.__init__(self, ...)\`? Two reasons: if you rename or re-parent the class, you change one line instead of many; and with multiple inheritance, \`super()\` follows the method resolution order (next section), which a hard-coded parent name cannot do.
Useful built-ins:
• \`isinstance(obj, Cls)\` — True for the class **or any subclass**. Prefer it over \`type(obj) == Cls\`.
• \`issubclass(Child, Parent)\`.
• \`Cls.__bases__\` — tuple of direct parents.
Every class in Python 3 implicitly inherits from \`object\`, which provides defaults for \`__init__\`, \`__repr__\`, \`__eq__\` and friends. Keep hierarchies shallow (two or three levels). Deep trees are hard to follow and usually signal that composition (section 11) would be better.`,
      codeSnippet: `# inheritance.py
class Vehicle:
    wheels = 4

    def __init__(self, brand: str, price: float) -> None:
        self.brand = brand
        self.price = price

    def describe(self) -> str:
        return f"{self.brand} ({self.wheels} wheels) - Rs {self.price:,.0f}"

    def road_tax(self) -> float:
        return self.price * 0.10


class Car(Vehicle):
    # inherits __init__, describe, road_tax unchanged
    pass


class Bike(Vehicle):
    wheels = 2                               # override a class attribute

    def road_tax(self) -> float:             # override a method
        return self.price * 0.06


class ElectricCar(Car):
    def __init__(self, brand: str, price: float, range_km: int) -> None:
        super().__init__(brand, price)       # let Vehicle set brand and price
        self.range_km = range_km             # then add our own attribute

    def describe(self) -> str:               # extend a method
        base = super().describe()
        return f"{base}, range {self.range_km} km"

    def road_tax(self) -> float:
        return 0.0                           # EV incentive


garage = [
    Car("Maruti Swift", 7_50_000),
    Bike("Royal Enfield", 2_10_000),
    ElectricCar("Tata Nexon EV", 15_00_000, range_km=465),
]

for v in garage:
    print(f"{v.describe():<55} tax: Rs {v.road_tax():,.0f}")
# Maruti Swift (4 wheels) - Rs 750,000                  tax: Rs 75,000
# Royal Enfield (2 wheels) - Rs 210,000                 tax: Rs 12,600
# Tata Nexon EV (4 wheels) - Rs 1,500,000, range 465 km tax: Rs 0

ev = garage[2]
print(isinstance(ev, Vehicle), isinstance(ev, Car), isinstance(ev, Bike))  # True True False
print(issubclass(ElectricCar, Vehicle))                                    # True
print(ElectricCar.__bases__)                                               # (<class '__main__.Car'>,)`
    },
    {
      heading: "6. Multiple Inheritance and Method Resolution Order (MRO) in Python",
      content: `Python allows a class to inherit from **more than one** parent: \`class Child(Mother, Father):\`. When several parents define the same method, which one runs? The answer is the **Method Resolution Order (MRO)**: a linear list of classes that Python searches, in order, until it finds the attribute.
Python computes the MRO using the **C3 linearisation** algorithm. The rules you need to remember:
• A class always comes before its parents.
• Parents are searched in the order listed in the class statement (left to right).
• Each class appears only once, and \`object\` is always last.
• If no consistent ordering exists, Python raises \`TypeError: Cannot create a consistent method resolution order\` at class creation time.
Inspect it with \`ClassName.__mro__\` or \`ClassName.mro()\`. The classic shape is the **diamond**: \`D(B, C)\` where both \`B\` and \`C\` inherit from \`A\`. The MRO is \`D → B → C → A → object\`. Notice that \`A\` appears *after* both B and C, not between them. This is what makes \`super()\` cooperative: when \`B.__init__\` calls \`super().__init__()\`, Python calls the **next class in the MRO of the actual instance**, which is \`C\`, not \`A\`. Every class in the chain runs exactly once. This only works if *every* class in the chain calls \`super()\`, which is why framework base classes always do.
The practical application of multiple inheritance in Python is the **mixin**: a small class that provides one piece of reusable behaviour (JSON serialisation, logging, timestamps) and is not meant to be instantiated alone. Django's class-based views (\`LoginRequiredMixin\`, \`ListView\`) are built entirely this way. Mixins should be listed **first** in the parent list so their methods take precedence over the main base class.
Rule of thumb: one real base class plus zero or more mixins. If you find yourself drawing a diamond on purpose, stop and consider composition.`,
      codeSnippet: `# mro.py
class A:
    def __init__(self) -> None:
        print("A.__init__")
        super().__init__()

    def who(self) -> str:
        return "A"


class B(A):
    def __init__(self) -> None:
        print("B.__init__")
        super().__init__()          # goes to the NEXT class in the MRO, not always A

    def who(self) -> str:
        return "B"


class C(A):
    def __init__(self) -> None:
        print("C.__init__")
        super().__init__()

    def who(self) -> str:
        return "C"


class D(B, C):
    def __init__(self) -> None:
        print("D.__init__")
        super().__init__()


d = D()
# D.__init__
# B.__init__
# C.__init__      <- B's super() reached C, because of the MRO
# A.__init__      <- A runs exactly once

print(d.who())                       # B   (first match in the MRO)
print([cls.__name__ for cls in D.__mro__])
# ['D', 'B', 'C', 'A', 'object']


# --- Mixin pattern ---
import json


class JSONMixin:
    def to_json(self) -> str:
        return json.dumps(vars(self), default=str)


class Product:
    def __init__(self, name: str, price: float) -> None:
        self.name = name
        self.price = price


class SerializableProduct(JSONMixin, Product):   # mixin first
    pass


p = SerializableProduct("Keyboard", 1499.0)
print(p.to_json())                   # {"name": "Keyboard", "price": 1499.0}`
    },
    {
      heading: "7. Dunder (Magic) Methods in Python: __str__, __repr__, __eq__, __len__ and __lt__",
      content: `Methods whose names start and end with double underscores are called **dunder methods** (from "double underscore") or **magic methods**. You never call them directly; Python calls them when you use an operator or a built-in function. \`len(obj)\` calls \`obj.__len__()\`, \`a == b\` calls \`a.__eq__(b)\`, \`print(obj)\` calls \`obj.__str__()\`. Implementing them makes your objects feel like built-in types. This is Python's version of operator overloading, and it is the mechanism behind pandas, NumPy and pathlib (\`Path("a") / "b"\` is just \`__truediv__\`).
The ones every class should consider:
• **\`__repr__\`** — the *developer* representation, shown in the REPL, in debuggers and inside lists. Convention: return something that looks like the constructor call, e.g. \`Money(1500, 'INR')\`. If you define only one of the two, define this one; \`__str__\` falls back to it.
• **\`__str__\`** — the *user-friendly* representation used by \`print()\`, \`str()\` and f-strings. Example: \`Rs 1,500.00\`.
• **\`__eq__\`** — defines \`==\`. By default, two objects are equal only if they are the *same* object. Override it to compare by value. Always check the type first and return \`NotImplemented\` (not \`False\`) for foreign types so Python can try the other operand's \`__eq__\`.
• **\`__hash__\`** — once you define \`__eq__\`, Python sets \`__hash__\` to \`None\`, so your objects can no longer be dict keys or set members. If you want that, define \`__hash__\` too, based on the same fields as \`__eq__\`, and keep those fields immutable.
• **\`__lt__\`** (and \`__le__\`, \`__gt__\`, \`__ge__\`) — ordering, which unlocks \`sorted()\`, \`min()\`, \`max()\`. Define \`__eq__\` and \`__lt__\`, then decorate the class with \`@functools.total_ordering\` and the remaining four are generated for you.
• **\`__len__\`** — makes \`len()\` work and also makes the object **falsy when empty**, because \`bool()\` falls back to \`__len__\` when \`__bool__\` is absent.
Others you will meet: \`__add__\` (\`+\`), \`__getitem__\` (indexing and iteration), \`__iter__\`, \`__contains__\` (\`in\`), \`__enter__\`/\`__exit__\` (\`with\`), \`__call__\` (makes an instance callable).`,
      codeSnippet: `# money.py
from functools import total_ordering


@total_ordering
class Money:
    def __init__(self, paise: int, currency: str = "INR") -> None:
        self.paise = paise              # store in smallest unit: no float errors
        self.currency = currency

    def __repr__(self) -> str:          # for developers
        return f"Money({self.paise}, {self.currency!r})"

    def __str__(self) -> str:           # for users
        return f"{self.currency} {self.paise / 100:,.2f}"

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Money):
            return NotImplemented       # let Python try the other side
        return (self.paise, self.currency) == (other.paise, other.currency)

    def __hash__(self) -> int:          # keep hashable since we defined __eq__
        return hash((self.paise, self.currency))

    def __lt__(self, other: "Money") -> bool:
        if not isinstance(other, Money) or other.currency != self.currency:
            return NotImplemented
        return self.paise < other.paise

    def __add__(self, other: "Money") -> "Money":
        if not isinstance(other, Money) or other.currency != self.currency:
            return NotImplemented
        return Money(self.paise + other.paise, self.currency)


class Wallet:
    def __init__(self) -> None:
        self._notes: list[Money] = []

    def add(self, m: Money) -> None:
        self._notes.append(m)

    def __len__(self) -> int:
        return len(self._notes)

    def __getitem__(self, index: int) -> Money:   # enables indexing AND for-loops
        return self._notes[index]


a = Money(150_000)                   # Rs 1,500.00
b = Money(150_000)
c = Money(99_900)

print(repr(a))                       # Money(150000, 'INR')
print(a)                             # INR 1,500.00
print(a == b, a is b)                # True False
print(a + c)                         # INR 2,499.00
print(sorted([a, c, Money(5)]))      # [Money(5, 'INR'), Money(99900, 'INR'), Money(150000, 'INR')]
print(a >= c, max(a, c))             # True Money(150000, 'INR')   (from total_ordering)
print(len({a, b}))                   # 1  (equal objects hash the same)

w = Wallet()
print(bool(w))                       # False  (empty -> __len__ == 0)
w.add(a); w.add(c)
print(len(w), bool(w))               # 2 True
for note in w:                       # works because of __getitem__
    print(" ", note)`
    },
    {
      heading: "8. Properties in Python: @property, Setters and Computed Attributes",
      content: `A **property** lets you expose a method as if it were a plain attribute. The caller writes \`account.balance\` with no parentheses, but behind the scenes a function runs. Properties solve two problems:
1. **Validation on assignment.** You want \`temp.celsius = -300\` to raise an error. A plain attribute cannot do that; a property with a **setter** can.
2. **Computed, read-only values.** \`rect.area\` should always equal \`width * height\` without you remembering to update a stored field. A property with only a getter is automatically read-only; assigning to it raises \`AttributeError: property 'area' of 'Rectangle' object has no setter\`.
Syntax: decorate the getter with \`@property\`. To add a setter, define a second function with the same name decorated with \`@<name>.setter\`. A \`@<name>.deleter\` exists too, but is rarely used. The backing data is usually stored in a single-underscore attribute such as \`self._celsius\`.
The big design win is that **properties let you start simple and add logic later without breaking callers**. In Java you write getters and setters for everything on day one "just in case". In Python you start with a plain attribute, and if validation becomes necessary in year two, you convert it to a property. Every \`obj.attr\` in the codebase keeps working. This is why PEP 8 says: do not write trivial \`get_x()\` / \`set_x()\` methods.
Guidelines:
• Property access should be **cheap and side-effect free**. If it hits the database or takes seconds, make it a method (\`fetch_orders()\`) so the cost is visible to the caller.
• Use \`functools.cached_property\` (Python 3.8+) for an expensive value that should be computed once per instance and then stored.
• In \`__init__\`, assign through the property (\`self.celsius = value\`) so the validation runs on construction too.`,
      codeSnippet: `# properties.py
from functools import cached_property


class Temperature:
    ABSOLUTE_ZERO_C = -273.15

    def __init__(self, celsius: float) -> None:
        self.celsius = celsius            # goes through the setter -> validated

    @property
    def celsius(self) -> float:
        return self._celsius

    @celsius.setter
    def celsius(self, value: float) -> None:
        if value < self.ABSOLUTE_ZERO_C:
            raise ValueError(f"{value} C is below absolute zero")
        self._celsius = float(value)

    @property
    def fahrenheit(self) -> float:        # computed from celsius
        return self._celsius * 9 / 5 + 32

    @fahrenheit.setter
    def fahrenheit(self, value: float) -> None:
        self.celsius = (value - 32) * 5 / 9   # reuse celsius validation


t = Temperature(37)
print(t.celsius, t.fahrenheit)        # 37.0 98.6
t.fahrenheit = 212
print(t.celsius)                      # 100.0

try:
    t.celsius = -500
except ValueError as e:
    print("Error:", e)                # Error: -500 C is below absolute zero


class Rectangle:
    def __init__(self, width: float, height: float) -> None:
        self.width = width
        self.height = height

    @property
    def area(self) -> float:          # read-only: no setter defined
        return self.width * self.height


r = Rectangle(4, 5)
print(r.area)                         # 20
r.width = 10
print(r.area)                         # 50  (always in sync)
try:
    r.area = 99
except AttributeError as e:
    print("Error:", e)                # Error: property 'area' of 'Rectangle' object has no setter


class Report:
    def __init__(self, rows: list[int]) -> None:
        self.rows = rows

    @cached_property
    def total(self) -> int:
        print("  computing total once...")
        return sum(self.rows)


rep = Report(list(range(1_000_000)))
print(rep.total)                      #   computing total once... / 499999500000
print(rep.total)                      # 499999500000   (cached, no recomputation)`
    },
    {
      heading: "9. Encapsulation Conventions in Python: Public, _protected, __private and Name Mangling",
      content: `**Encapsulation** means keeping an object's internal state hidden behind a well-defined interface, so that other code cannot depend on details that may change. Java enforces this with \`private\` and \`protected\` keywords. Python has **no access modifiers at all**; it uses naming conventions that every Python developer respects:
• **\`name\`** (no underscore) — **public**. Part of the official interface. Changing or removing it is a breaking change.
• **\`_name\`** (single leading underscore) — **"protected" / internal by convention**. The message is: "this is an implementation detail; use it only inside this class and its subclasses". Python does not stop you from accessing it from outside, but linters flag it, IDE autocomplete hides it, and \`from module import *\` skips it. This is the convention you will use 95% of the time for backing fields behind properties.
• **\`__name\`** (two leading underscores, no trailing underscores) — triggers **name mangling**. Inside class \`Account\`, Python rewrites \`self.__pin\` to \`self._Account__pin\`. This is **not** real privacy (you can still reach \`obj._Account__pin\`); its purpose is to **avoid accidental clashes in subclasses**. If a parent and child both define \`__cache\`, they get different mangled names and do not overwrite each other. Use it rarely and deliberately.
• **\`__name__\`** (two leading *and* trailing) — reserved for Python's dunder protocol. Never invent your own.
The Python philosophy is summarised as "we are all consenting adults here": the language trusts developers to respect the underscore. The practical benefits of encapsulation in Python come from **properties** (section 8), which validate changes, and from offering **methods** that express intent (\`account.withdraw(500)\`) instead of letting callers poke at \`account._balance\` directly.
A related tool is **\`__slots__\`**: declare \`__slots__ = ("owner", "_balance")\` and instances no longer get a \`__dict__\`. Attribute creation is restricted to the listed names, access is faster and memory use drops by roughly 30 to 40 percent per instance. It is used in performance-sensitive code that creates millions of small objects.`,
      codeSnippet: `# encapsulation.py
class Account:
    __slots__ = ("owner", "_balance", "__pin")   # optional: fixed attributes (__pin is mangled)

    def __init__(self, owner: str, pin: str, balance: float = 0) -> None:
        self.owner = owner            # public
        self._balance = balance       # internal by convention
        self.__pin = pin              # name-mangled to _Account__pin

    @property
    def balance(self) -> float:       # read-only view of internal state
        return self._balance

    def withdraw(self, amount: float, pin: str) -> None:
        if pin != self.__pin:
            raise PermissionError("Wrong PIN")
        if amount > self._balance:
            raise ValueError("Insufficient funds")
        self._balance -= amount


acc = Account("Kiran", pin="4321", balance=10_000)
acc.withdraw(2_500, pin="4321")
print(acc.balance)                   # 7500

try:
    acc.balance = 1_00_000           # no setter -> blocked
except AttributeError as e:
    print("Blocked:", e)

print(acc._balance)                  # 7500  -> works, but linters warn: internal!

try:
    print(acc.__pin)                 # AttributeError: no attribute '__pin'
except AttributeError as e:
    print("Mangled:", e)

print(acc._Account__pin)             # 4321  -> "private" is only a convention

try:
    acc.nickname = "KK"              # __slots__ forbids new attributes
except AttributeError as e:
    print("Slots:", e)


# Why name mangling exists: subclass does not clobber parent's __cache
class Base:
    def __init__(self) -> None:
        self.__cache = "base-cache"

    def base_cache(self) -> str:
        return self.__cache


class Child(Base):
    def __init__(self) -> None:
        super().__init__()
        self.__cache = "child-cache"   # becomes _Child__cache, separate


c = Child()
print(c.base_cache())                # base-cache   (untouched)
print(vars(c))                       # {'_Base__cache': 'base-cache', '_Child__cache': 'child-cache'}`
    },
    {
      heading: "10. Abstract Base Classes in Python with abc and typing.Protocol",
      content: `An **abstract base class (ABC)** defines a **contract**: a set of methods that every subclass *must* implement. It cannot be instantiated itself. Use it when you have several interchangeable implementations of the same idea: payment gateways (Razorpay, PayU, Stripe), storage backends (local disk, S3), notification channels (SMS, email, WhatsApp).
Python provides this through the \`abc\` module:
• Inherit from \`abc.ABC\` (or set \`metaclass=ABCMeta\`).
• Decorate required methods with \`@abstractmethod\`. The body can be \`...\`, \`pass\`, a docstring, or even a default implementation that subclasses call via \`super()\`.
• Trying to instantiate the ABC, or a subclass that has not implemented *every* abstract method, raises \`TypeError: Can't instantiate abstract class ... without an implementation for abstract method ...\`. The error happens at object-creation time, which is far earlier and clearer than a \`NotImplementedError\` buried deep in a request handler.
\`@abstractmethod\` can be stacked with \`@property\`, \`@classmethod\` and \`@staticmethod\` (put \`@abstractmethod\` innermost). ABCs can also contain concrete methods, so they double as a place for shared helper code.
The standard library uses ABCs heavily: \`collections.abc.Sequence\`, \`Mapping\`, \`Iterable\` describe what built-in containers do, and you can register or inherit from them to make your own class behave like a list or dict.
**Protocols (Python 3.8+)** are the structural alternative. \`typing.Protocol\` says "any object that *has* these methods counts", without requiring inheritance. This is duck typing made explicit for type checkers: a class that defines \`.area()\` satisfies a \`Shape\` protocol even if it never heard of it. Choose a Protocol when you cannot or do not want to modify the implementing classes (third-party objects, built-ins), and an ABC when you own the hierarchy and want runtime enforcement plus shared code.`,
      codeSnippet: `# payments.py
from abc import ABC, abstractmethod
from typing import Protocol, runtime_checkable


class PaymentGateway(ABC):
    """Contract every gateway must satisfy."""

    def __init__(self, merchant_id: str) -> None:
        self.merchant_id = merchant_id

    @property
    @abstractmethod
    def name(self) -> str: ...

    @abstractmethod
    def charge(self, amount_paise: int, upi_or_card: str) -> str:
        """Return a transaction id."""

    # Concrete helper shared by all gateways
    def receipt(self, txn_id: str, amount_paise: int) -> str:
        return f"[{self.name}] txn {txn_id}: Rs {amount_paise / 100:,.2f}"


class RazorpayGateway(PaymentGateway):
    @property
    def name(self) -> str:
        return "Razorpay"

    def charge(self, amount_paise: int, upi_or_card: str) -> str:
        return f"rzp_{abs(hash((amount_paise, upi_or_card))) % 10**8:08d}"


class BrokenGateway(PaymentGateway):     # forgot to implement charge()
    @property
    def name(self) -> str:
        return "Broken"


gw = RazorpayGateway("MERCHANT42")
txn = gw.charge(49_900, "kiran@upi")
print(gw.receipt(txn, 49_900))        # [Razorpay] txn rzp_xxxxxxxx: Rs 499.00

try:
    PaymentGateway("X")
except TypeError as e:
    print("ABC:", e)
# ABC: Can't instantiate abstract class PaymentGateway without an implementation
#      for abstract methods 'charge', 'name'

try:
    BrokenGateway("Y")
except TypeError as e:
    print("Incomplete:", str(e)[:60], "...")


# --- Protocol: structural typing, no inheritance needed ---
@runtime_checkable
class Shape(Protocol):
    def area(self) -> float: ...


class Circle:                         # never mentions Shape
    def __init__(self, r: float) -> None:
        self.r = r

    def area(self) -> float:
        return 3.14159 * self.r ** 2


def total_area(shapes: list[Shape]) -> float:
    return sum(s.area() for s in shapes)


print(round(total_area([Circle(1), Circle(2)]), 2))   # 15.71
print(isinstance(Circle(1), Shape))                   # True (runtime_checkable)`
    },
    {
      heading: "11. Composition vs Inheritance in Python: Has-a Beats Is-a",
      content: `**Composition** means building an object *out of* other objects: a \`Car\` **has an** \`Engine\`, an \`Order\` **has a** list of \`OrderLine\`s and **has a** \`Customer\`. The outer object stores the inner ones as attributes and delegates work to them.
Compare with inheritance, which is **is-a**. Beginners reach for inheritance because it feels like free code reuse, but it creates the tightest coupling in OOP: the child depends on the parent's internal details, and any change in the parent ripples down. Deep hierarchies such as \`Animal → Mammal → Pet → Dog → GuideDog\` become impossible to modify safely. The widely-quoted design principle is **"favour composition over inheritance"** (from the Gang of Four book).
When to use which:
• **Inheritance** fits when the subclass truly *is* a specialised version of the parent, needs most of its behaviour unchanged, and the hierarchy is shallow. Exceptions (\`class PaymentError(Exception)\`), ABC implementations, and framework base classes (\`class MyView(APIView)\`) are good examples.
• **Composition** fits when you are combining capabilities. A \`NotificationService\` that has an \`SMSSender\` and an \`EmailSender\` can swap either one at runtime, mock them in tests, or add a \`WhatsAppSender\` without touching any class hierarchy.
Composition also gives you **dependency injection** for free: pass the collaborators into \`__init__\` instead of creating them inside. Tests can then inject fakes. This is the pattern FastAPI's \`Depends()\` and most production services use.
A frequent middle ground is **delegation**: the outer class forwards a few methods to the inner object (\`def start(self): return self.engine.start()\`). If you need to forward *many* methods, implementing \`__getattr__\` to delegate unknown attributes is a known trick, but explicit forwarding is clearer.
Litmus test: if you would be embarrassed to say "a Car is an Engine" out loud, do not inherit.`,
      codeSnippet: `# composition.py
from dataclasses import dataclass, field


class Engine:
    def __init__(self, hp: int, fuel: str) -> None:
        self.hp = hp
        self.fuel = fuel
        self.running = False

    def start(self) -> str:
        self.running = True
        return f"{self.fuel} engine ({self.hp} hp) started"


class GPS:
    def locate(self) -> str:
        return "19.0760 N, 72.8777 E (Mumbai)"


class Car:
    """A Car HAS an Engine and HAS a GPS: composition."""

    def __init__(self, model: str, engine: Engine, gps: GPS | None = None) -> None:
        self.model = model
        self.engine = engine          # injected collaborator
        self.gps = gps or GPS()

    def start(self) -> str:           # delegation
        return f"{self.model}: {self.engine.start()}"

    def where_am_i(self) -> str:
        return self.gps.locate()


petrol = Engine(hp=90, fuel="Petrol")
swift = Car("Swift", petrol)
print(swift.start())                  # Swift: Petrol engine (90 hp) started
print(swift.where_am_i())             # 19.0760 N, 72.8777 E (Mumbai)

# Swap a part without touching the Car class
swift.engine = Engine(hp=150, fuel="Electric")
print(swift.start())                  # Swift: Electric engine (150 hp) started


# Composition in tests: inject a fake
class FakeGPS:
    def locate(self) -> str:
        return "TEST-LOCATION"

test_car = Car("TestCar", Engine(1, "Test"), gps=FakeGPS())
assert test_car.where_am_i() == "TEST-LOCATION"
print("test passed")


# A richer example: Order HAS lines and HAS a customer
@dataclass
class OrderLine:
    sku: str
    qty: int
    unit_price: float

    @property
    def total(self) -> float:
        return self.qty * self.unit_price


@dataclass
class Order:
    customer: str
    lines: list[OrderLine] = field(default_factory=list)

    def add(self, line: OrderLine) -> None:
        self.lines.append(line)

    @property
    def grand_total(self) -> float:
        return sum(l.total for l in self.lines)


o = Order("Deepa")
o.add(OrderLine("MOUSE-01", 2, 799))
o.add(OrderLine("PAD-03", 1, 349))
print(f"Rs {o.grand_total:,.2f}")     # Rs 1,947.00`
    },
    {
      heading: "12. Introduction to Python Dataclasses: Less Boilerplate, Same Classes",
      content: `Look back at \`Money\` in section 7: \`__init__\`, \`__repr__\`, \`__eq__\`, \`__hash__\`, \`__lt__\` were all written by hand just to store two fields. For classes whose main job is to **hold data**, Python 3.7 introduced **dataclasses** (PEP 557) to generate that boilerplate automatically.
Decorate a class with \`@dataclass\` and declare fields as **annotated class attributes**. The decorator reads the annotations and writes \`__init__\`, \`__repr__\` and \`__eq__\` for you. Fields with a default value become optional parameters; fields without one are required and must be listed first (unless you use \`kw_only\`).
Important options and features:
• **\`field(default_factory=list)\`** — for mutable defaults. Writing \`items: list = []\` directly raises \`ValueError: mutable default ... use default_factory\`, which is the dataclass module protecting you from the shared-list bug of section 3.
• **\`frozen=True\`** — makes instances immutable (assignment raises \`FrozenInstanceError\`) and automatically **hashable**, so they can be dict keys and set members. Ideal for value objects such as coordinates, money and config.
• **\`order=True\`** — generates \`__lt__\`, \`__le__\`, \`__gt__\`, \`__ge__\` comparing fields in declaration order, so \`sorted()\` works.
• **\`slots=True\`** (Python 3.10+) — generates \`__slots__\` for memory and speed.
• **\`kw_only=True\`** (Python 3.10+) — all fields must be passed by keyword; also lets fields with defaults precede fields without.
• **\`__post_init__\`** — runs after the generated \`__init__\`; use it for validation or derived fields.
• **\`dataclasses.asdict()\`**, **\`astuple()\`**, **\`replace()\`** — convert to a dict (handy for JSON), to a tuple, or create a modified copy of a frozen instance.
• Dataclasses automatically define \`__match_args__\`, so they work with positional patterns in \`match\` statements (Python 3.10+).
Dataclasses are still ordinary classes: you can add methods, properties, class methods and inheritance. They are the right default for DTOs, configuration, records read from CSV or an API, and test fixtures. When you also need **parsing and validation of external input** (JSON from an HTTP request), Pydantic v2's \`BaseModel\` is the production choice; its syntax is intentionally similar. For pure in-memory data, dataclasses have zero dependencies and are faster.`,
      codeSnippet: `# dataclasses_demo.py
from dataclasses import dataclass, field, asdict, replace


@dataclass(order=True)
class Student:
    roll_no: int
    name: str
    city: str = "Delhi"
    marks: list[int] = field(default_factory=list)   # never list = []

    def __post_init__(self) -> None:
        if self.roll_no <= 0:
            raise ValueError("roll_no must be positive")
        self.name = self.name.strip().title()

    @property
    def average(self) -> float:
        return sum(self.marks) / len(self.marks) if self.marks else 0.0


s1 = Student(7, "  anjali  ", marks=[90, 85])
s2 = Student(3, "Vikram", "Jaipur")
print(s1)                      # Student(roll_no=7, name='Anjali', city='Delhi', marks=[90, 85])
print(s1 == Student(7, "Anjali", "Delhi", [90, 85]))   # True  (generated __eq__)
print(sorted([s1, s2])[0].name)                        # Vikram (order=True, by roll_no)
print(s1.average)                                      # 87.5
print(asdict(s2))              # {'roll_no': 3, 'name': 'Vikram', 'city': 'Jaipur', 'marks': []}


@dataclass(frozen=True, slots=True)        # immutable value object
class Coordinate:
    lat: float
    lon: float


home = Coordinate(28.6139, 77.2090)
try:
    home.lat = 0.0
except Exception as e:
    print(type(e).__name__)    # FrozenInstanceError

visited = {home, Coordinate(28.6139, 77.2090)}
print(len(visited))            # 1   (frozen -> hashable, equal by value)
moved = replace(home, lon=77.3)
print(moved)                   # Coordinate(lat=28.6139, lon=77.3)


@dataclass(kw_only=True)       # Python 3.10+
class Config:
    debug: bool = False
    db_url: str               # allowed after a default because kw_only
    timeout: int = 30


cfg = Config(db_url="postgresql://localhost/app")
print(cfg)                     # Config(debug=False, db_url='postgresql://localhost/app', timeout=30)


# Pattern matching with dataclasses (Python 3.10+)
match home:
    case Coordinate(lat, lon) if lat > 20:
        print(f"Northern India: {lat}, {lon}")
    case _:
        print("elsewhere")`
    },
    {
      heading: "13. Real-World Use Cases: How Python OOP Is Used in Production",
      content: `Every major Python framework is a class hierarchy you plug into. Recognising the patterns from this lecture makes those frameworks far less mysterious.
• **Django and SQLAlchemy models** — \`class Order(models.Model):\` uses **inheritance** from a framework base class. Fields declared in the class body are **class attributes** that a metaclass turns into database columns. \`Order.objects.filter()\` is a **class-level** API; \`order.save()\` is an **instance method**. Custom \`@property\` methods such as \`order.total\` are everywhere in real Django code.
• **FastAPI and Pydantic v2** — request and response schemas are classes (\`class UserCreate(BaseModel):\`) that look exactly like dataclasses. Validation happens in generated \`__init__\` logic; \`@field_validator\` is the Pydantic cousin of \`__post_init__\`. Dependency injection via \`Depends()\` is composition in action.
• **PyTorch** — every neural network is \`class Net(nn.Module):\` with \`super().__init__()\` in its initialiser and an overridden \`forward()\`. Layers are composed as attributes; \`model(x)\` works because \`nn.Module\` implements \`__call__\`.
• **pandas and NumPy** — \`df["price"] * 1.18\` and \`df[df.city == "Pune"]\` work through \`__mul__\`, \`__getitem__\` and \`__eq__\`. \`len(df)\` is \`__len__\`.
• **pathlib** — \`Path("data") / "sales.csv"\` is \`__truediv__\`; \`Path\` objects compare and hash by value.
• **Exceptions** — custom exception hierarchies (\`class PaymentError(AppError)\`) let callers catch broad or narrow categories; this is inheritance used exactly as intended.
• **Context managers and iterators** — \`with open(...)\` relies on \`__enter__\`/\`__exit__\`; custom iterators implement \`__iter__\`/\`__next__\`.
• **Strategy pattern with ABCs** — a payments service that supports Razorpay, PayU and Cashfree defines a \`PaymentGateway\` ABC and selects a concrete class from configuration. New providers are added without modifying existing code (the Open/Closed principle).
• **Configuration objects** — a frozen dataclass or Pydantic \`BaseSettings\` loaded once at startup replaces a mess of global variables.
• **Testing** — pytest fixtures often return small objects or fakes that implement the same Protocol as a real dependency, which is only possible because the production code accepts collaborators through composition.
Interviewers at product companies routinely ask candidates to model something small (parking lot, library, splitwise) using exactly these building blocks. The hands-on exercise at the end of this lecture is a practice run.`
    },
    {
      heading: "14. Common Mistakes with Python Classes and How to Fix Them",
      content: `• **Forgetting \`self\`** — \`def greet():\` inside a class raises \`TypeError: greet() takes 0 positional arguments but 1 was given\`. Every instance method's first parameter is the instance. Fix: \`def greet(self):\`.
• **Mutable class attributes** — \`items = []\` in the class body is shared by every instance. Fix: create lists, dicts and sets inside \`__init__\` (\`self.items = []\`), or use \`field(default_factory=list)\` in dataclasses.
• **Not calling \`super().__init__()\`** — the child defines its own \`__init__\` and the parent's attributes are never created, causing \`AttributeError\` in inherited methods. Fix: call \`super().__init__(...)\` first, passing the parent's parameters.
• **Calling the class instead of creating an instance** — \`Student.greet()\` fails with a missing \`self\`. Fix: \`Student("Asha").greet()\`.
• **Comparing with \`type(obj) == Cls\`** — breaks for subclasses. Fix: \`isinstance(obj, Cls)\`.
• **Defining \`__eq__\` without \`__hash__\`** — objects silently become unhashable; putting them in a set raises \`TypeError: unhashable type\`. Fix: define \`__hash__\` on the same immutable fields, or use \`@dataclass(frozen=True)\`.
• **Returning \`False\` instead of \`NotImplemented\` from \`__eq__\`/\`__lt__\`** for unrelated types — prevents Python from trying the reflected operation on the other operand. Fix: \`return NotImplemented\`.
• **Writing Java-style getters and setters** — \`get_name()\` / \`set_name()\` everywhere is noise. Fix: plain attributes first; \`@property\` when validation is needed.
• **Infinite recursion in a property** — the getter does \`return self.balance\` instead of \`return self._balance\`, calling itself forever (\`RecursionError\`). Fix: store the backing value under a different (underscored) name.
• **Overusing \`__double_underscore\` "private" names** — name mangling makes subclasses and tests awkward and gives no real security. Fix: use a single underscore unless you specifically need clash protection.
• **Deep inheritance for code reuse** — five-level hierarchies that nobody can modify. Fix: compose objects; use mixins sparingly.
• **Side effects in \`__repr__\` or properties** — logging, I/O or network calls inside them make debugging print statements change behaviour. Keep them pure.
• **Abstract class without \`ABC\`** — decorating with \`@abstractmethod\` has no effect unless the class inherits from \`ABC\` (or uses \`ABCMeta\`). Fix: \`class Base(ABC):\`.
• **Mutable default argument in a method** (\`def add(self, tags=[])\`) — same shared-object bug as class attributes. Fix: \`tags=None\` then \`tags = tags or []\`.`,
      codeSnippet: `# mistakes_fixed.py
from dataclasses import dataclass, field


# 1. Property recursion -> fixed with a backing field
class Wallet:
    def __init__(self, balance: float) -> None:
        self._balance = balance            # NOT self.balance = ... inside getter

    @property
    def balance(self) -> float:
        return self._balance               # returning self.balance would recurse


# 2. Missing super().__init__() -> fixed
class Person:
    def __init__(self, name: str) -> None:
        self.name = name

class Employee(Person):
    def __init__(self, name: str, emp_id: int) -> None:
        super().__init__(name)             # without this, self.name never exists
        self.emp_id = emp_id

print(Employee("Neha", 7).name)            # Neha


# 3. __eq__ without __hash__ -> fixed with frozen dataclass
@dataclass(frozen=True)
class Point:
    x: int
    y: int

print(len({Point(1, 2), Point(1, 2)}))     # 1


# 4. Mutable default argument -> fixed
class Post:
    def __init__(self, title: str, tags: list[str] | None = None) -> None:
        self.title = title
        self.tags = tags if tags is not None else []

p1, p2 = Post("A"), Post("B")
p1.tags.append("python")
print(p2.tags)                             # []


# 5. isinstance instead of type() ==
class Base: ...
class Derived(Base): ...
d = Derived()
print(type(d) == Base, isinstance(d, Base))   # False True`
    },
    {
      heading: "15. Frequently Asked Questions about Object-Oriented Programming in Python",
      content: `**What is the difference between a class and an object in Python?**
A class is the blueprint: it defines what attributes and methods a type of thing has. An object (instance) is a concrete value created from that blueprint with its own attribute values. \`Student\` is a class; \`Student("Priya", 21)\` is an object. One class can produce any number of objects.
**What is self in Python and why is it needed?**
\`self\` is the first parameter of an instance method and refers to the specific object the method is operating on. Python passes it automatically when you call \`obj.method()\`, which is equivalent to \`Class.method(obj)\`. Without it, a method would have no way to know which object's data to read or modify. The name is a convention; the position is what matters.
**What is the difference between __init__ and __new__ in Python?**
\`__new__\` is the static method that actually allocates and returns a new instance; \`__init__\` then initialises that instance's attributes. You override \`__init__\` almost always and \`__new__\` almost never, except for immutable types (subclassing \`int\` or \`tuple\`), singletons or metaprogramming.
**What is the difference between @classmethod and @staticmethod in Python?**
A class method receives the class (\`cls\`) as its first argument and is typically used as an alternative constructor or to access class-level state; it respects subclassing. A static method receives no implicit first argument at all and is just a plain function stored in the class namespace for organisational reasons, such as a validator.
**Does Python support multiple inheritance?**
Yes. A class can list several parents, and Python resolves conflicts using the C3 method resolution order, viewable via \`ClassName.__mro__\`. In practice it is used mostly for mixins: small classes that add one capability. Diamond hierarchies work correctly as long as every class in the chain calls \`super()\`.
**How do you make a private variable in Python?**
Python has no true private variables. A single leading underscore (\`_balance\`) signals "internal, do not touch" by convention. A double leading underscore (\`__pin\`) triggers name mangling to \`_ClassName__pin\`, which prevents accidental clashes in subclasses but can still be accessed. Real protection comes from exposing properties and methods rather than raw attributes.
**What is the difference between __str__ and __repr__ in Python?**
\`__repr__\` is the unambiguous developer representation shown in the REPL and inside containers, ideally resembling the constructor call. \`__str__\` is the readable form used by \`print()\` and f-strings. If you define only \`__repr__\`, \`str()\` falls back to it, so define \`__repr__\` first.
**When should I use a dataclass instead of a regular class?**
Use a dataclass when the class's primary purpose is to hold data and you want \`__init__\`, \`__repr__\` and \`__eq__\` generated automatically: records, DTOs, configuration, value objects. Use a regular class when behaviour dominates and the constructor needs custom logic beyond what \`__post_init__\` can handle, or when you are inheriting from a framework base class. For validating external input, Pydantic models are the production choice.`
    },
    {
      heading: "16. Interview Questions and Answers on Python OOP",
      content: `**Q1. What are the four pillars of OOP, and how does Python implement each?**
Encapsulation: bundling data with methods and hiding internals through underscore conventions and properties. Abstraction: exposing only what callers need, enforced with abstract base classes and Protocols. Inheritance: \`class Child(Parent)\` with \`super()\` and the MRO. Polymorphism: the same method name behaving differently per class, achieved through method overriding and duck typing, and extended to operators through dunder methods.
**Q2. Explain method resolution order. What would \`D(B, C)\` with a shared base \`A\` print for \`D.__mro__\`?**
MRO is the ordered list of classes Python searches for an attribute, computed by C3 linearisation. For the diamond it is \`[D, B, C, A, object]\`. A class always precedes its parents, parents keep their declared order, and each class appears once, which guarantees \`super()\` visits every class exactly once.
**Q3. Why does defining \`__eq__\` make a class unhashable, and how do you fix it?**
Equal objects must have equal hashes. The default \`__hash__\` is identity-based, which would violate that rule once \`__eq__\` compares by value, so Python sets \`__hash__ = None\`. Fix it by defining \`__hash__\` over the same fields used in \`__eq__\` (which should be immutable), or use \`@dataclass(frozen=True)\`.
**Q4. What is the difference between composition and inheritance, and when do you prefer each?**
Inheritance models "is-a" and shares implementation through the class hierarchy; composition models "has-a" by storing collaborator objects as attributes. Prefer composition by default because it has looser coupling, supports swapping collaborators at runtime and simplifies testing through dependency injection. Use inheritance for genuine specialisation, exception hierarchies and framework base classes.
**Q5. How does \`super()\` work with multiple inheritance?**
\`super()\` does not mean "my parent"; it means "the next class after me in the MRO of the instance being used". In a diamond, \`B\`'s \`super().__init__()\` may call \`C.__init__\`, not \`A.__init__\`. This cooperative behaviour requires every class in the chain to call \`super()\` and to accept and forward arguments it does not use, usually with \`**kwargs\`.
**Q6. What does \`@property\` do and when is it better than a method?**
It turns a method into an attribute-style accessor, optionally with a setter for validation. Use it for cheap, side-effect-free values that conceptually are attributes (area, full name, formatted balance). Use a regular method when the operation is expensive, has side effects or takes arguments, so the cost is explicit to the caller.
**Q7. What is an abstract base class and what happens if a subclass does not implement all abstract methods?**
An ABC (from the \`abc\` module) declares methods that subclasses must implement with \`@abstractmethod\`. Python refuses to instantiate the ABC itself or any subclass that leaves an abstract method unimplemented, raising \`TypeError\` at construction time, which catches missing implementations early.
**Q8. What are \`__slots__\` and why would you use them?**
\`__slots__\` is a class attribute listing the allowed instance attribute names. Instances then have no \`__dict__\`, which lowers memory per object significantly and speeds up attribute access. Use it for classes instantiated in very large numbers, such as rows, nodes or events. Trade-offs: you cannot add attributes dynamically, and multiple inheritance with slots needs care.
**Q9. What is duck typing, and how does \`typing.Protocol\` relate to it?**
Duck typing means Python cares about what an object can do, not what class it belongs to: if it has \`.read()\`, it can be used as a file. \`Protocol\` makes this explicit for static type checkers: a class satisfies a Protocol by having the right methods, without inheriting from it. \`@runtime_checkable\` additionally allows \`isinstance()\` checks.
**Q10. How would you implement a singleton in Python, and should you?**
Override \`__new__\` to return a stored instance, or use a module-level object, which is the simplest and most Pythonic approach because modules are imported once. Singletons are often an anti-pattern because they hide dependencies and complicate testing; injecting a shared instance through composition is usually better.`
    },
    {
      heading: "17. Hands-On Exercise: Build a Library Management System with Python Classes",
      content: `Build a small library system that exercises everything from this lecture: an abstract \`LibraryItem\` base class with concrete \`Book\` and \`DVD\` subclasses, dunder methods for printing, equality and sorting, a \`@property\` with validation, a \`@classmethod\` alternative constructor, a \`@staticmethod\` validator, a frozen \`Member\` dataclass, and a \`Library\` class that uses **composition** to hold items and members and expose \`len()\` and \`in\`.
Requirements:
1. \`LibraryItem\` (ABC): fields \`item_id\`, \`title\`, \`year\`; abstract property \`loan_days\`; abstract method \`describe()\`; concrete methods \`checkout(member)\` and \`return_item()\`; \`__eq__\`/\`__hash__\` by \`item_id\`; \`__lt__\` by title so items sort alphabetically.
2. \`Book(LibraryItem)\`: adds \`author\` and \`isbn\`, validates the ISBN with a static method, \`loan_days = 14\`, and a \`from_csv_row()\` class method.
3. \`DVD(LibraryItem)\`: adds \`minutes\`, \`loan_days = 7\`.
4. \`Member\`: a frozen dataclass with \`member_id\`, \`name\`, \`city\`.
5. \`Library\`: stores items in a dict keyed by \`item_id\`; supports \`add()\`, \`find(item_id)\`, \`available()\`, \`len(library)\`, \`item in library\` and iteration in sorted order.
Run the file with \`python library.py\` and compare your output with the comments at the bottom. Then extend it: add an \`EBook\` class with unlimited copies, or a \`Fine\` calculation using \`datetime\`.`,
      codeSnippet: `# library.py  -- run: python library.py
from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import date, timedelta
from functools import total_ordering


@dataclass(frozen=True)
class Member:
    member_id: int
    name: str
    city: str = "Bengaluru"


@total_ordering
class LibraryItem(ABC):
    """Anything the library can lend. Subclasses decide the loan period."""

    def __init__(self, item_id: str, title: str, year: int) -> None:
        self.item_id = item_id
        self.title = title
        self.year = year                      # validated by the property setter
        self._borrower: Member | None = None
        self._due: date | None = None

    # ----- validated attribute -----
    @property
    def year(self) -> int:
        return self._year

    @year.setter
    def year(self, value: int) -> None:
        if not 1450 <= value <= date.today().year:
            raise ValueError(f"Invalid publication year: {value}")
        self._year = value

    # ----- contract for subclasses -----
    @property
    @abstractmethod
    def loan_days(self) -> int: ...

    @abstractmethod
    def describe(self) -> str: ...

    # ----- shared behaviour -----
    @property
    def is_available(self) -> bool:
        return self._borrower is None

    def checkout(self, member: Member, today: date | None = None) -> date:
        if not self.is_available:
            raise RuntimeError(f"'{self.title}' is already with {self._borrower.name}")
        today = today or date.today()
        self._borrower = member
        self._due = today + timedelta(days=self.loan_days)
        return self._due

    def return_item(self) -> None:
        self._borrower, self._due = None, None

    # ----- dunder methods -----
    def __repr__(self) -> str:
        return f"{type(self).__name__}({self.item_id!r}, {self.title!r}, {self.year})"

    def __str__(self) -> str:
        status = "available" if self.is_available else f"due {self._due}"
        return f"{self.describe()} [{status}]"

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, LibraryItem):
            return NotImplemented
        return self.item_id == other.item_id

    def __hash__(self) -> int:
        return hash(self.item_id)

    def __lt__(self, other: LibraryItem) -> bool:
        if not isinstance(other, LibraryItem):
            return NotImplemented
        return self.title.lower() < other.title.lower()


class Book(LibraryItem):
    def __init__(self, item_id: str, title: str, year: int, author: str, isbn: str) -> None:
        if not self.is_valid_isbn(isbn):
            raise ValueError(f"Invalid ISBN-13: {isbn}")
        super().__init__(item_id, title, year)
        self.author = author
        self.isbn = isbn

    @property
    def loan_days(self) -> int:
        return 14

    def describe(self) -> str:
        return f"Book: {self.title} by {self.author} ({self.year})"

    @staticmethod
    def is_valid_isbn(isbn: str) -> bool:
        digits = isbn.replace("-", "")
        if len(digits) != 13 or not digits.isdigit():
            return False
        total = sum(int(d) * (1 if i % 2 == 0 else 3) for i, d in enumerate(digits))
        return total % 10 == 0

    @classmethod
    def from_csv_row(cls, row: str) -> Book:
        item_id, title, year, author, isbn = (part.strip() for part in row.split(","))
        return cls(item_id, title, int(year), author, isbn)


class DVD(LibraryItem):
    def __init__(self, item_id: str, title: str, year: int, minutes: int) -> None:
        super().__init__(item_id, title, year)
        self.minutes = minutes

    @property
    def loan_days(self) -> int:
        return 7

    def describe(self) -> str:
        return f"DVD: {self.title} ({self.year}, {self.minutes} min)"


class Library:
    """Composition: a Library HAS items and HAS members."""

    def __init__(self, name: str) -> None:
        self.name = name
        self._items: dict[str, LibraryItem] = {}
        self._members: dict[int, Member] = {}

    def add(self, item: LibraryItem) -> None:
        if item.item_id in self._items:
            raise ValueError(f"Duplicate item id {item.item_id}")
        self._items[item.item_id] = item

    def register(self, member: Member) -> None:
        self._members[member.member_id] = member

    def find(self, item_id: str) -> LibraryItem:
        return self._items[item_id]

    def available(self) -> list[LibraryItem]:
        return sorted(i for i in self._items.values() if i.is_available)

    def __len__(self) -> int:
        return len(self._items)

    def __contains__(self, item: object) -> bool:
        return isinstance(item, LibraryItem) and item.item_id in self._items

    def __iter__(self):
        return iter(sorted(self._items.values()))


if __name__ == "__main__":
    lib = Library("Koramangala Public Library")

    lib.add(Book.from_csv_row("B1, Fluent Python, 2022, Luciano Ramalho, 978-1-4920-5635-5"))
    lib.add(Book("B2", "Automate the Boring Stuff", 2019, "Al Sweigart", "978-1-59327-992-9"))
    lib.add(DVD("D1", "3 Idiots", 2009, minutes=170))

    try:
        lib.add(Book("B3", "Fake", 2020, "Nobody", "123-4-56-789"))
    except ValueError as e:
        print("Rejected:", e)

    ananya = Member(1, "Ananya", "Mysuru")
    lib.register(ananya)

    due = lib.find("B1").checkout(ananya, today=date(2026, 10, 9))
    print("Due date:", due)

    try:
        lib.find("B1").checkout(Member(2, "Rohan"))
    except RuntimeError as e:
        print("Error:", e)

    print(f"{lib.name}: {len(lib)} items, {len(lib.available())} available")
    for item in lib:                       # sorted by title via __lt__
        print(" -", item)

    print(lib.find("D1") in lib, DVD("D9", "X", 2000, 1) in lib)   # True False
    print(repr(lib.find("D1")))
    print(lib.find("B2") == Book("B2", "Automate the Boring Stuff", 2019, "x", "978-1-59327-992-9"))

# Expected output:
# Rejected: Invalid ISBN-13: 123-4-56-789
# Due date: 2026-10-23
# Error: 'Fluent Python' is already with Ananya
# Koramangala Public Library: 3 items, 2 available
#  - DVD: 3 Idiots (2009, 170 min) [available]
#  - Book: Automate the Boring Stuff by Al Sweigart (2019) [available]
#  - Book: Fluent Python by Luciano Ramalho (2022) [due 2026-10-23]
# True False
# DVD('D1', '3 Idiots', 2009)
# True`
    },
    {
      heading: "18. Summary",
      content: `• A **class** is a blueprint; an **instance** is an object built from it. \`__init__\` initialises attributes and \`self\` is the instance being operated on.
• **Instance attributes** (\`self.x\`) are per object; **class attributes** are shared. Never use a mutable class attribute as a per-instance default.
• **Instance methods** take \`self\`; **\`@classmethod\`** takes \`cls\` and is ideal for alternative constructors; **\`@staticmethod\`** takes neither and holds helpers.
• **Inheritance** models "is-a"; \`super()\` calls the next class in the **MRO**, which Python computes with C3 linearisation and exposes via \`__mro__\`. Use mixins sparingly.
• **Dunder methods** (\`__repr__\`, \`__str__\`, \`__eq__\`, \`__hash__\`, \`__lt__\`, \`__len__\`, \`__add__\`, \`__getitem__\`) let your objects work with operators and built-ins; \`@total_ordering\` fills in comparison gaps.
• **\`@property\`** gives attribute syntax with validation and computed values; \`cached_property\` memoises expensive ones.
• **Encapsulation** in Python is by convention: \`_internal\`, \`__mangled\`, and \`__slots__\` for fixed, memory-efficient attributes.
• **Abstract base classes** (\`ABC\`, \`@abstractmethod\`) enforce contracts at instantiation time; **\`Protocol\`** does so structurally for type checkers.
• Prefer **composition** ("has-a") over deep inheritance; inject collaborators for flexibility and testability.
• **Dataclasses** (Python 3.7+) generate \`__init__\`, \`__repr__\` and \`__eq__\`; use \`field(default_factory=...)\`, \`frozen=True\`, \`order=True\`, \`slots=True\` and \`kw_only=True\` (3.10+) as needed.
**Next lecture:** Modules, Packages, Dependencies & Project Structure`
    }
  ]
};
