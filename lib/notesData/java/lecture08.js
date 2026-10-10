export const lecture08 = {
  slug: "lecture-8",
  number: 8,
  title: "Complete Java Course — Lecture 8: Collections Framework & Generics",
  summary: "Master the Java Collections Framework and Generics: ArrayList vs LinkedList, HashSet vs TreeSet, HashMap vs TreeMap, how HashMap works internally, Queue and Deque, Java 21 sequenced collections, List.of immutable factories, Comparable vs Comparator, bounded types, wildcards and type erasure.",
  readTime: "58 min read",
  difficulty: "Intermediate",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. What Is the Java Collections Framework and Why It Matters",
      content: `In Lecture 7 we learned how Java reports and recovers from failures with exceptions. In this lecture we move to the part of the standard library you will use in every single Java program you ever write: the **Java Collections Framework (JCF)** and **Generics**.
A **collection** is simply an object that holds a group of other objects. Arrays can do that too, but arrays have a fixed size, cannot grow, have no built-in search or sort behaviour, and cannot tell you whether an element is already present without a loop. The Collections Framework, introduced in Java 1.2 and heavily upgraded in Java 5 (generics), Java 8 (lambdas, default methods), Java 9 (immutable factories) and Java 21 (sequenced collections), gives you ready-made, battle-tested data structures: resizable lists, hash tables, sorted trees, queues, stacks and more.
Why does this matter in real projects?
• **Every backend API** returns a \`List\` of DTOs, caches lookups in a \`Map\`, de-duplicates IDs with a \`Set\`, and processes jobs from a \`Queue\`.
• **Performance** depends on choosing the right structure. A \`contains()\` check on an \`ArrayList\` of 1,00,000 user IDs scans every element (O(n)); the same check on a \`HashSet\` is effectively constant time (O(1)). Picking wrong can turn a 5 ms request into a 5 second one.
• **Interviews** at Indian service companies, product companies and startups alike almost always include "ArrayList vs LinkedList", "HashMap vs HashSet" and "how does HashMap work internally". This lecture answers all of those with the depth interviewers expect.
**Generics** are the second half of the story. Before Java 5, a \`List\` held plain \`Object\`s, so you had to cast on every \`get()\` and could accidentally put a \`String\` into a list of \`Integer\`s. Generics let you write \`List<Integer>\` so the compiler enforces the element type and the cast disappears. Understanding generics properly, including bounded types, wildcards and type erasure, is what separates developers who copy-paste collection code from developers who can design reusable libraries.
By the end of this lecture you will know which collection to pick for which job, how the most important ones are implemented, how to sort and iterate them safely, and how to write your own generic classes and methods.`,
      codeSnippet: `// WhyCollections.java — arrays vs collections in one glance
import java.util.*;

public class WhyCollections {
    public static void main(String[] args) {
        // Array: fixed size, manual bookkeeping
        String[] citiesArray = new String[3];
        citiesArray[0] = "Mumbai";
        citiesArray[1] = "Delhi";
        citiesArray[2] = "Pune";
        // citiesArray[3] = "Chennai";  // ArrayIndexOutOfBoundsException - cannot grow

        // ArrayList: grows automatically, rich API
        List<String> cities = new ArrayList<>();
        cities.add("Mumbai");
        cities.add("Delhi");
        cities.add("Pune");
        cities.add("Chennai");                 // no problem
        System.out.println(cities.contains("Pune"));   // true
        System.out.println(cities.size());             // 4
        Collections.sort(cities);
        System.out.println(cities);            // [Chennai, Delhi, Mumbai, Pune]

        // Generics: the compiler protects the element type
        List<Integer> marks = new ArrayList<>();
        marks.add(92);
        // marks.add("ninety");                // compile-time error - caught before running
        int first = marks.get(0);              // no cast needed (auto-unboxing)
        System.out.println(first + 8);         // 100
    }
}`
    },
    {
      heading: "2. The Java Collection Hierarchy: Iterable, Collection, List, Set, Queue and Map",
      content: `The framework is organised as a set of **interfaces** (what a structure can do) and **implementation classes** (how it does it). Learning the hierarchy once makes every API feel familiar.
At the top sits \`Iterable<T>\`, which only promises an \`iterator()\` method; it is what makes the for-each loop work. Below it is \`Collection<E>\`, the root of everything except maps. \`Collection\` declares the universal operations: \`add\`, \`remove\`, \`contains\`, \`size\`, \`isEmpty\`, \`clear\`, \`addAll\`, \`removeIf\`, \`stream\` and so on. From \`Collection\` hang three families:
• **\`List<E>\`** — an ordered sequence that allows duplicates and positional access by index. Implementations: \`ArrayList\`, \`LinkedList\`, and the legacy \`Vector\` and \`Stack\`.
• **\`Set<E>\`** — no duplicates. \`HashSet\` (unordered), \`LinkedHashSet\` (insertion order) and \`TreeSet\` (sorted, via \`SortedSet\`/\`NavigableSet\`).
• **\`Queue<E>\`** — elements processed in a particular order, usually FIFO. \`Deque<E>\` extends it for double-ended access. Implementations: \`ArrayDeque\`, \`LinkedList\`, \`PriorityQueue\`, and the concurrent \`ArrayBlockingQueue\`/\`LinkedBlockingQueue\`.
**\`Map<K, V>\`** is a separate root. A map is not a \`Collection\` because it stores pairs rather than single elements, but its views (\`keySet()\`, \`values()\`, \`entrySet()\`) are collections. Implementations: \`HashMap\`, \`LinkedHashMap\`, \`TreeMap\` (via \`SortedMap\`/\`NavigableMap\`), the legacy \`Hashtable\`, and \`ConcurrentHashMap\` for multi-threaded use.
Two utility classes complete the picture: \`Collections\` (static helpers such as \`sort\`, \`reverse\`, \`shuffle\`, \`unmodifiableList\`, \`synchronizedMap\`, \`emptyList\`) and \`Arrays\` (\`asList\`, \`sort\`, \`binarySearch\`, \`stream\`).
**Program to the interface.** Declare variables as \`List<String> names = new ArrayList<>();\` rather than \`ArrayList<String> names = ...\`. Your code then depends only on the contract, and you can swap the implementation (for example to \`LinkedList\` or \`CopyOnWriteArrayList\`) without touching the rest of the class. Method parameters and return types should almost always use the interface type too.`,
      codeSnippet: `// HierarchyDemo.java — the same variable type, different implementations
import java.util.*;

public class HierarchyDemo {
    // Accepts ANY Collection: ArrayList, HashSet, ArrayDeque, TreeSet ...
    static int countLongNames(Collection<String> names) {
        int count = 0;
        for (String n : names) {           // works because Collection extends Iterable
            if (n.length() > 6) count++;
        }
        return count;
    }

    public static void main(String[] args) {
        List<String> list = new ArrayList<>(List.of("Ravindra", "Amit", "Priyanka", "Amit"));
        Set<String> set = new HashSet<>(list);          // duplicates removed
        Queue<String> queue = new ArrayDeque<>(list);   // FIFO order
        Map<String, Integer> ages = new HashMap<>();
        ages.put("Ravindra", 24);
        ages.put("Amit", 29);

        System.out.println(countLongNames(list));   // 2  (Ravindra, Priyanka)
        System.out.println(countLongNames(set));    // 2
        System.out.println(countLongNames(queue));  // 2
        System.out.println(countLongNames(ages.keySet()));  // 1 - keySet() is a Set view

        System.out.println(list.size() + " " + set.size());  // 4 3
    }
}`
    },
    {
      heading: "3. List in Java: ArrayList vs LinkedList (Performance Explained)",
      content: `A \`List\` keeps elements in insertion order, allows duplicates and lets you access elements by index. The two implementations you must know are \`ArrayList\` and \`LinkedList\`; they have the same interface but very different internals.
**ArrayList** stores elements in a plain Java array behind the scenes. When you create one with the no-argument constructor, the internal array is empty and is allocated with a capacity of **10** on the first \`add\`. When the array fills up, \`ArrayList\` creates a new array **1.5 times** larger (\`oldCapacity + (oldCapacity >> 1)\`) and copies everything over. That copy is O(n), but it happens so rarely that \`add\` at the end is **amortised O(1)**. Reading by index (\`get(i)\`) is a direct array lookup: O(1). Inserting or removing in the middle shifts every element after it with \`System.arraycopy\`: O(n). \`contains\` and \`indexOf\` scan linearly: O(n).
**LinkedList** is a **doubly linked list**: each element lives in a \`Node\` object holding the value plus \`prev\` and \`next\` references. Adding or removing at either end is O(1) because only two pointers change. But \`get(i)\` has to walk from the nearest end, node by node, so it is O(n); a loop calling \`get(i)\` over a \`LinkedList\` of n elements is O(n²). Each node also costs roughly 24 extra bytes on a 64-bit JVM plus a pointer hop that defeats CPU caching, which is why \`ArrayList\` wins even in many "insert in the middle" benchmarks once you include the cost of finding the position.
**When to use which:**
• Default to \`ArrayList\`. It is faster for random access, iteration and memory, and is what 95 percent of production code uses.
• Consider \`LinkedList\` only when you repeatedly add and remove at the front and never index into the list. Even then, \`ArrayDeque\` is usually a better choice (Section 6).
• If you know the size in advance, pass it to the constructor (\`new ArrayList<>(1_00_000)\`) or call \`ensureCapacity\` to avoid repeated resizing.
Useful \`List\` methods beyond the basics: \`subList(from, to)\` (a live view, not a copy), \`indexOf\`, \`lastIndexOf\`, \`set(i, e)\`, \`sort(comparator)\`, \`replaceAll(unaryOp)\`, \`List.of(...)\` and \`List.copyOf(...)\`, and since Java 21 \`getFirst\`, \`getLast\`, \`removeFirst\`, \`removeLast\` and \`reversed()\`.`,
      codeSnippet: `// ListPerformance.java — measure the difference yourself
import java.util.*;

public class ListPerformance {
    public static void main(String[] args) {
        final int N = 100_000;
        List<Integer> arrayList = new ArrayList<>();
        List<Integer> linkedList = new LinkedList<>();
        for (int i = 0; i < N; i++) { arrayList.add(i); linkedList.add(i); }

        // Random access by index
        long t = System.nanoTime();
        long sum = 0;
        for (int i = 0; i < N; i++) sum += arrayList.get(i);
        System.out.printf("ArrayList  get(i): %d ms%n", (System.nanoTime() - t) / 1_000_000);

        t = System.nanoTime();
        sum = 0;
        for (int i = 0; i < N; i++) sum += linkedList.get(i);   // walks nodes every time
        System.out.printf("LinkedList get(i): %d ms%n", (System.nanoTime() - t) / 1_000_000);

        // Insert at the front
        t = System.nanoTime();
        for (int i = 0; i < 10_000; i++) arrayList.add(0, i);     // shifts everything
        System.out.printf("ArrayList  add(0): %d ms%n", (System.nanoTime() - t) / 1_000_000);

        t = System.nanoTime();
        for (int i = 0; i < 10_000; i++) linkedList.add(0, i);    // pointer change only
        System.out.printf("LinkedList add(0): %d ms%n", (System.nanoTime() - t) / 1_000_000);

        // Typical result on a laptop (your numbers will differ):
        // ArrayList  get(i): 1 ms
        // LinkedList get(i): 4500 ms    <- O(n^2) overall
        // ArrayList  add(0): 120 ms
        // LinkedList add(0): 1 ms

        // Other handy List operations
        List<String> langs = new ArrayList<>(List.of("Java", "Kotlin", "Go", "Java"));
        System.out.println(langs.indexOf("Java") + " " + langs.lastIndexOf("Java")); // 0 3
        langs.set(2, "Rust");
        langs.replaceAll(String::toUpperCase);
        System.out.println(langs);                       // [JAVA, KOTLIN, RUST, JAVA]
        System.out.println(langs.subList(1, 3));          // [KOTLIN, RUST]  (live view)
    }
}`
    },
    {
      heading: "4. Set in Java: HashSet vs LinkedHashSet vs TreeSet",
      content: `A \`Set\` is a collection with **no duplicate elements**. Calling \`add\` with an element that is already present returns \`false\` and leaves the set unchanged. Which element counts as "already present" depends on \`equals()\` and \`hashCode()\` for hash-based sets, and on \`compareTo()\`/\`Comparator\` for \`TreeSet\`. The three implementations differ only in ordering and performance.
**HashSet** is backed by a \`HashMap\` internally: every element you add becomes a key, and the value is a shared dummy object called \`PRESENT\`. That means \`add\`, \`remove\` and \`contains\` are O(1) on average, and everything you will learn about HashMap in Section 5 applies here. The iteration order is **unspecified** and can change when the set resizes, so never write code that depends on it.
**LinkedHashSet** extends \`HashSet\` but additionally threads a doubly linked list through the entries, so iteration follows **insertion order**. The cost is a little extra memory per element. This is the right choice when you want de-duplication but must preserve the order the user supplied, for example "remove duplicate rows but keep the first occurrence".
**TreeSet** is backed by a **red-black tree** (through \`TreeMap\`). Elements are kept **sorted**, either by their natural order (\`Comparable\`) or by a \`Comparator\` you pass to the constructor. Operations are O(log n). Because it implements \`NavigableSet\`, you get powerful range queries: \`first()\`, \`last()\`, \`floor(e)\` (greatest element ≤ e), \`ceiling(e)\` (least element ≥ e), \`lower\`, \`higher\`, \`headSet(to)\`, \`tailSet(from)\`, \`subSet(from, to)\`, \`pollFirst()\` and \`descendingSet()\`. Elements must be mutually comparable; adding a \`null\` to a \`TreeSet\` with natural ordering throws \`NullPointerException\`, while \`HashSet\` and \`LinkedHashSet\` allow exactly one \`null\`.
**Important subtlety:** \`TreeSet\` decides equality using \`compareTo\` (or the comparator), not \`equals\`. If your comparator compares only by salary, two different employees with the same salary are treated as duplicates and the second one is silently dropped.
Choose: \`HashSet\` for fast membership checks, \`LinkedHashSet\` when order matters, \`TreeSet\` when you need sorted data or range queries.`,
      codeSnippet: `// SetDemo.java
import java.util.*;

public class SetDemo {
    public static void main(String[] args) {
        List<String> visits = List.of("Delhi", "Mumbai", "Delhi", "Kolkata", "Mumbai", "Bengaluru");

        Set<String> hash = new HashSet<>(visits);
        Set<String> linked = new LinkedHashSet<>(visits);
        Set<String> tree = new TreeSet<>(visits);

        System.out.println(hash);     // e.g. [Delhi, Kolkata, Mumbai, Bengaluru]  (order not guaranteed)
        System.out.println(linked);   // [Delhi, Mumbai, Kolkata, Bengaluru]       (insertion order)
        System.out.println(tree);     // [Bengaluru, Delhi, Kolkata, Mumbai]       (sorted)

        System.out.println(hash.add("Delhi"));   // false - already present
        System.out.println(hash.size());         // 4

        // NavigableSet range queries on sorted data
        TreeSet<Integer> marks = new TreeSet<>(List.of(45, 67, 89, 92, 33, 78));
        System.out.println(marks.first() + " " + marks.last());   // 33 92
        System.out.println(marks.ceiling(70));                     // 78 (smallest >= 70)
        System.out.println(marks.floor(70));                       // 67 (largest  <= 70)
        System.out.println(marks.headSet(60));                     // [33, 45]   (< 60)
        System.out.println(marks.tailSet(80));                     // [89, 92]   (>= 80)
        System.out.println(marks.descendingSet());                 // [92, 89, 78, 67, 45, 33]

        // TreeSet uses the comparator for equality - be careful!
        record Emp(String name, int salary) {}
        Set<Emp> bySalary = new TreeSet<>(Comparator.comparingInt(Emp::salary));
        bySalary.add(new Emp("Asha", 50_000));
        bySalary.add(new Emp("Vikram", 50_000));   // dropped: same salary => "equal"
        System.out.println(bySalary.size());       // 1

        // Set algebra
        Set<Integer> a = new TreeSet<>(List.of(1, 2, 3, 4));
        Set<Integer> b = new TreeSet<>(List.of(3, 4, 5));
        Set<Integer> union = new TreeSet<>(a); union.addAll(b);
        Set<Integer> inter = new TreeSet<>(a); inter.retainAll(b);
        Set<Integer> diff  = new TreeSet<>(a); diff.removeAll(b);
        System.out.println(union + " " + inter + " " + diff);   // [1, 2, 3, 4, 5] [3, 4] [1, 2]
    }
}`
    },
    {
      heading: "5. Map in Java: HashMap vs LinkedHashMap vs TreeMap",
      content: `A \`Map<K, V>\` stores **key-value pairs** where each key appears at most once. It is the structure you reach for whenever you need to look something up by an identifier: user ID to profile, product code to price, word to frequency.
**HashMap** is the workhorse. \`put\`, \`get\`, \`remove\` and \`containsKey\` run in O(1) on average. It allows **one \`null\` key** and any number of \`null\` values, and makes **no ordering promise**. Internally it is an array of buckets indexed by the key's hash code; Section 6 dissects it.
**LinkedHashMap** adds a doubly linked list through its entries so iteration follows **insertion order** by default. Pass \`true\` as the third constructor argument (\`accessOrder\`) and it switches to **access order**, moving an entry to the end every time it is read. Combined with the protected \`removeEldestEntry\` hook, this gives you an **LRU cache** in five lines, a classic interview question.
**TreeMap** keeps keys **sorted** in a red-black tree, so every operation is O(log n), and it implements \`NavigableMap\`: \`firstKey\`, \`lastKey\`, \`floorKey\`, \`ceilingKey\`, \`headMap\`, \`tailMap\`, \`subMap\`, \`firstEntry\`, \`pollFirstEntry\` and \`descendingMap\`. Use it for anything that needs range lookups, such as "which tax slab does ₹8,50,000 fall into" or "the nearest scheduled train after 09:15". \`TreeMap\` does not allow a \`null\` key with natural ordering.
**Legacy and concurrent variants:** \`Hashtable\` is the Java 1.0 ancestor: synchronized on every method, no nulls, and slow; do not use it in new code. For multi-threaded access use \`ConcurrentHashMap\`, which locks per bucket and also forbids null keys and values.
**Java 8 convenience methods** you should use instead of the old \`if (map.containsKey(k))\` dance: \`getOrDefault(k, def)\`, \`putIfAbsent(k, v)\`, \`computeIfAbsent(k, fn)\` (perfect for building a map of lists), \`computeIfPresent\`, \`merge(k, v, fn)\` (perfect for counting), \`forEach((k, v) -> ...)\` and \`replaceAll\`. Iterate with \`entrySet()\` when you need both key and value; it avoids a second lookup per element.`,
      codeSnippet: `// MapDemo.java
import java.util.*;

public class MapDemo {
    // Simple LRU cache: keeps only the 3 most recently used entries
    static class LruCache<K, V> extends LinkedHashMap<K, V> {
        private final int capacity;
        LruCache(int capacity) {
            super(16, 0.75f, true);        // accessOrder = true
            this.capacity = capacity;
        }
        @Override
        protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
            return size() > capacity;      // evict when over capacity
        }
    }

    public static void main(String[] args) {
        // Word frequency with merge()
        String text = "java is fast java is safe java is everywhere";
        Map<String, Integer> freq = new HashMap<>();
        for (String w : text.split(" ")) freq.merge(w, 1, Integer::sum);
        System.out.println(freq);        // {java=3, is=3, fast=1, safe=1, everywhere=1} (any order)

        // Group with computeIfAbsent()
        Map<String, List<String>> byState = new TreeMap<>();
        byState.computeIfAbsent("Bihar", k -> new ArrayList<>()).add("Patna");
        byState.computeIfAbsent("Bihar", k -> new ArrayList<>()).add("Gaya");
        byState.computeIfAbsent("Karnataka", k -> new ArrayList<>()).add("Mysuru");
        System.out.println(byState);     // {Bihar=[Patna, Gaya], Karnataka=[Mysuru]} (sorted keys)

        // NavigableMap: income tax slab lookup (illustrative slabs)
        TreeMap<Integer, String> slabs = new TreeMap<>();
        slabs.put(0, "0%");
        slabs.put(4_00_000, "5%");
        slabs.put(8_00_000, "10%");
        slabs.put(12_00_000, "15%");
        int income = 8_50_000;
        System.out.println(slabs.floorEntry(income));   // 800000=10%
        System.out.println(slabs.headMap(8_00_000));    // {0=0%, 400000=5%}

        // Iterate with entrySet (one lookup per element)
        for (Map.Entry<String, Integer> e : freq.entrySet()) {
            if (e.getValue() > 1) System.out.print(e.getKey() + " ");
        }
        System.out.println();            // java is

        // LRU behaviour
        LruCache<String, String> cache = new LruCache<>(3);
        cache.put("a", "1"); cache.put("b", "2"); cache.put("c", "3");
        cache.get("a");                  // "a" becomes most recently used
        cache.put("d", "4");             // evicts "b" (least recently used)
        System.out.println(cache.keySet());   // [c, a, d]

        System.out.println(freq.getOrDefault("python", 0));   // 0
    }
}`
    },
    {
      heading: "6. How HashMap Works Internally in Java (Interview Favourite)",
      content: `"Explain the internal working of HashMap" is asked in almost every Java interview from 2 to 10 years of experience. Here is the complete answer for Java 8 and later.
**Storage.** A \`HashMap\` holds an array called \`table\` of type \`Node<K,V>[]\`. Each slot is a **bucket**. The default initial capacity is **16** and the default **load factor is 0.75**, so the **threshold** (the size at which the table grows) starts at 16 × 0.75 = **12** entries. Capacity is always a power of two.
**put(key, value) step by step:**
1. Compute \`key.hashCode()\`. For a \`null\` key the hash is 0, which is why one null key is allowed (bucket 0).
2. **Spread** the hash: \`hash = h ^ (h >>> 16)\`. This XORs the high 16 bits into the low 16 bits so that keys whose hash codes differ only in the upper bits still land in different buckets.
3. Compute the bucket index as \`(n - 1) & hash\`, where n is the table length. Because n is a power of two, this is a fast equivalent of \`hash % n\`.
4. If the bucket is empty, create a new \`Node(hash, key, value, next)\` and store it.
5. If the bucket already has nodes (a **collision**), walk them. For each node, first compare the stored \`hash\` (cheap int compare); only if the hashes match call \`equals()\`. If an equal key is found, **replace the value** and return the old one. Otherwise **append** a new node to the end of the chain.
6. Increment \`size\` and \`modCount\`. If \`size > threshold\`, **resize**.
**Resize.** The table doubles (16 → 32 → 64...) and every node is redistributed. Thanks to the power-of-two trick, each chain splits into exactly two: nodes stay at the same index or move to \`index + oldCapacity\`, decided by one bit of the hash. Resizing is O(n), so if you know you will insert 10,000 entries, construct with \`new HashMap<>(16_384)\` or, since Java 19, \`HashMap.newHashMap(10_000)\`, which computes the right capacity for you.
**Treeification (Java 8).** If a single bucket's chain grows to **8** nodes (\`TREEIFY_THRESHOLD\`) and the table has at least **64** buckets (\`MIN_TREEIFY_CAPACITY\`), the chain is converted into a **red-black tree**, turning worst-case lookup from O(n) to O(log n). If the table is smaller than 64, HashMap resizes instead. When a tree bucket shrinks to **6** nodes (\`UNTREEIFY_THRESHOLD\`) during resize, it turns back into a list. This change protects against hash-collision denial-of-service attacks where an attacker sends thousands of keys with identical hash codes.
**get(key)** repeats steps 1 to 3, then walks the bucket comparing hash and then \`equals\`, returning the value or \`null\`.
**The equals/hashCode contract.** If \`a.equals(b)\` then \`a.hashCode() == b.hashCode()\` must hold. Override one and you must override the other, otherwise equal keys land in different buckets and \`get\` returns \`null\` for a key you just stored. Records and IDEs generate both for you. Keys should also be **immutable**: if a key's hash changes after insertion, it is stranded in the wrong bucket forever. This is why \`String\`, \`Integer\` and records make ideal keys, and why \`String\` caches its hash code.
**Not thread-safe.** Concurrent \`put\` calls from multiple threads can lose entries; before Java 8 they could even create an infinite loop during resize. Use \`ConcurrentHashMap\` for shared maps.`,
      codeSnippet: `// HashMapInternals.java — see hashCode(), equals() and buckets interact
import java.util.*;

public class HashMapInternals {
    // GOOD key: immutable, equals and hashCode generated consistently by the record
    record Pincode(String city, int code) {}

    // BAD key: overrides equals but NOT hashCode
    static final class BrokenKey {
        final String value;
        BrokenKey(String value) { this.value = value; }
        @Override public boolean equals(Object o) {
            return o instanceof BrokenKey other && other.value.equals(value);
        }
        // hashCode() inherited from Object -> identity based!
    }

    // The same spreading function HashMap uses internally (Java 8+)
    static int spread(int h) { return h ^ (h >>> 16); }

    public static void main(String[] args) {
        Map<Pincode, String> offices = new HashMap<>();      // capacity 16, threshold 12
        offices.put(new Pincode("Patna", 800001), "GPO Patna");
        System.out.println(offices.get(new Pincode("Patna", 800001)));   // GPO Patna

        Map<BrokenKey, String> broken = new HashMap<>();
        broken.put(new BrokenKey("A"), "first");
        System.out.println(broken.get(new BrokenKey("A")));  // null  - different hashCode, different bucket
        broken.put(new BrokenKey("A"), "second");
        System.out.println(broken.size());                   // 2     - "duplicate" keys stored twice

        // Which bucket does a key land in for a 16-slot table?
        String key = "Bengaluru";
        int hash = spread(key.hashCode());
        int index = (16 - 1) & hash;
        System.out.println("hashCode=" + key.hashCode() + " spread=" + hash + " bucket=" + index);

        // Mutating a key after insertion strands it in the old bucket
        Map<List<Integer>, String> risky = new HashMap<>();
        List<Integer> k = new ArrayList<>(List.of(1, 2));
        risky.put(k, "value");
        k.add(3);                            // the list's hashCode changes
        System.out.println(risky.get(k));    // null - looked up in a different bucket
        System.out.println(risky.size());    // 1    - the entry is still there, just unreachable
    }
}`
    },
    {
      heading: "7. Queue, Deque, ArrayDeque and PriorityQueue in Java",
      content: `A **Queue** processes elements in a defined order, typically **first-in, first-out (FIFO)**: print jobs, HTTP requests waiting for a worker thread, customers at a counter. The \`Queue\` interface offers each operation in two flavours: one that **throws** an exception on failure and one that returns a **special value**.
• Insert: \`add(e)\` throws if the queue is full (bounded queues only); \`offer(e)\` returns \`false\`.
• Remove head: \`remove()\` throws \`NoSuchElementException\` when empty; \`poll()\` returns \`null\`.
• Inspect head: \`element()\` throws when empty; \`peek()\` returns \`null\`.
Prefer \`offer\`/\`poll\`/\`peek\` in application code and reserve the throwing versions for cases where emptiness is a real bug.
**Deque** (double-ended queue, pronounced "deck") extends \`Queue\` and lets you add and remove from **both ends**: \`addFirst\`/\`addLast\`, \`offerFirst\`/\`offerLast\`, \`pollFirst\`/\`pollLast\`, \`peekFirst\`/\`peekLast\`, plus the stack methods \`push\` (= addFirst) and \`pop\` (= removeFirst).
**ArrayDeque** is the implementation you should use for both queues and stacks. It is a circular, resizable array with O(1) operations at both ends, no per-element node objects and better cache behaviour than \`LinkedList\`. The old \`java.util.Stack\` class extends \`Vector\`, synchronizes every method and exposes index-based access that breaks the stack abstraction; the Javadoc itself recommends \`ArrayDeque\` instead. Note that \`ArrayDeque\` does **not** accept \`null\` elements, precisely because \`poll\` and \`peek\` use \`null\` to mean "empty".
**PriorityQueue** is different: it hands out elements by **priority**, not arrival order. It is a **binary min-heap** stored in an array; \`offer\` and \`poll\` are O(log n), \`peek\` is O(1). The head is the smallest element according to natural ordering or a supplied \`Comparator\`. Two things trip people up: iterating a \`PriorityQueue\` (or printing it) does **not** give sorted order, only \`poll()\` does; and it is not thread-safe (use \`PriorityBlockingQueue\`). Typical uses: Dijkstra's algorithm, task schedulers, "top K" problems, and merging sorted streams.
For producer-consumer work across threads use the \`BlockingQueue\` implementations (\`ArrayBlockingQueue\`, \`LinkedBlockingQueue\`), whose \`put\` and \`take\` methods block until space or an element is available.`,
      codeSnippet: `// QueueDemo.java
import java.util.*;

public class QueueDemo {
    record Ticket(String customer, int priority) {}   // 1 = highest priority

    public static void main(String[] args) {
        // FIFO queue: support tickets in arrival order
        Queue<String> fifo = new ArrayDeque<>();
        fifo.offer("Ticket-1"); fifo.offer("Ticket-2"); fifo.offer("Ticket-3");
        System.out.println(fifo.peek());   // Ticket-1
        System.out.println(fifo.poll());   // Ticket-1
        System.out.println(fifo);          // [Ticket-2, Ticket-3]

        // Stack (LIFO) with ArrayDeque: browser back button
        Deque<String> history = new ArrayDeque<>();
        history.push("/home"); history.push("/courses"); history.push("/courses/java");
        System.out.println(history.pop());   // /courses/java
        System.out.println(history.peek());  // /courses

        // Balanced brackets check - a classic stack problem
        System.out.println(isBalanced("{[()]}"));   // true
        System.out.println(isBalanced("{[(])}"));   // false

        // PriorityQueue: serve the most urgent ticket first
        PriorityQueue<Ticket> pq = new PriorityQueue<>(Comparator.comparingInt(Ticket::priority));
        pq.offer(new Ticket("Neha", 3));
        pq.offer(new Ticket("Rahul", 1));
        pq.offer(new Ticket("Farhan", 2));
        System.out.println(pq);             // heap order, NOT sorted: e.g. [Rahul/1, Neha/3, Farhan/2]
        while (!pq.isEmpty()) System.out.print(pq.poll().customer() + " ");
        System.out.println();               // Rahul Farhan Neha

        // Queue vs special-value methods on an empty queue
        Queue<Integer> empty = new ArrayDeque<>();
        System.out.println(empty.poll());   // null
        try { empty.remove(); } catch (NoSuchElementException e) { System.out.println("empty!"); }
    }

    static boolean isBalanced(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            switch (c) {
                case '(', '[', '{' -> stack.push(c);
                case ')' -> { if (stack.isEmpty() || stack.pop() != '(') return false; }
                case ']' -> { if (stack.isEmpty() || stack.pop() != '[') return false; }
                case '}' -> { if (stack.isEmpty() || stack.pop() != '{') return false; }
                default -> { }
            }
        }
        return stack.isEmpty();
    }
}`
    },
    {
      heading: "8. Sequenced Collections in Java 21: getFirst, getLast and reversed",
      content: `For twenty years the framework had an awkward gap. \`List\`, \`Deque\`, \`LinkedHashSet\` and \`LinkedHashMap\` all have a well-defined **encounter order**, yet there was no common type to express it. Getting the last element of a \`List\` meant \`list.get(list.size() - 1)\`; for a \`LinkedHashSet\` you had to iterate to the end or convert to a list; for a \`Deque\` it was \`getLast()\`. Every type spelled the same idea differently.
**JEP 431, Sequenced Collections, finalised in Java 21**, fixes this with three new interfaces retrofitted into the hierarchy:
• **\`SequencedCollection<E>\`** extends \`Collection\` and adds \`getFirst()\`, \`getLast()\`, \`addFirst(e)\`, \`addLast(e)\`, \`removeFirst()\`, \`removeLast()\` and \`reversed()\`. \`List\` and \`Deque\` now extend it.
• **\`SequencedSet<E>\`** extends both \`SequencedCollection\` and \`Set\`. \`LinkedHashSet\` and \`SortedSet\` (hence \`TreeSet\`) implement it. On a \`LinkedHashSet\`, \`addFirst\`/\`addLast\` move an existing element to that end; on a \`TreeSet\` they throw \`UnsupportedOperationException\` because the order is determined by sorting.
• **\`SequencedMap<K,V>\`** adds \`firstEntry()\`, \`lastEntry()\`, \`pollFirstEntry()\`, \`pollLastEntry()\`, \`putFirst(k,v)\`, \`putLast(k,v)\`, \`reversed()\`, and sequenced views \`sequencedKeySet()\`, \`sequencedValues()\` and \`sequencedEntrySet()\`. \`LinkedHashMap\` and \`SortedMap\` (hence \`TreeMap\`) implement it.
**\`reversed()\` returns a view, not a copy.** Changes made through the view affect the original and vice versa, and the view costs no extra memory. It is ideal for iterating backwards with a plain for-each loop, which previously required a \`ListIterator\` or an index loop.
\`getFirst()\`/\`getLast()\` throw \`NoSuchElementException\` on an empty collection, so guard with \`isEmpty()\` where emptiness is normal.
The \`Collections\` class also gained \`unmodifiableSequencedCollection\`, \`unmodifiableSequencedSet\` and \`unmodifiableSequencedMap\` in Java 21. Note that \`HashSet\` and \`HashMap\` are **not** sequenced because they have no defined order. If your project is still on Java 17 these methods do not exist; this is one of the most visible everyday improvements when upgrading to Java 21 or Java 25.`,
      codeSnippet: `// SequencedDemo.java — requires Java 21 or later
import java.util.*;

public class SequencedDemo {
    public static void main(String[] args) {
        List<String> stations = new ArrayList<>(List.of("Patna", "Mughalsarai", "Prayagraj", "Kanpur", "Delhi"));

        // Before Java 21:  stations.get(stations.size() - 1)
        System.out.println(stations.getFirst() + " -> " + stations.getLast());   // Patna -> Delhi

        // reversed() is a live view - no copying
        for (String s : stations.reversed()) System.out.print(s + " ");
        System.out.println();        // Delhi Kanpur Prayagraj Mughalsarai Patna

        stations.addFirst("Gaya");
        stations.removeLast();
        System.out.println(stations);   // [Gaya, Patna, Mughalsarai, Prayagraj, Kanpur]

        // SequencedSet: LinkedHashSet keeps insertion order, now with first/last access
        SequencedSet<String> recent = new LinkedHashSet<>();
        recent.add("file1.txt"); recent.add("file2.txt"); recent.add("file3.txt");
        recent.addFirst("file2.txt");            // moves existing element to the front
        System.out.println(recent);              // [file2.txt, file1.txt, file3.txt]
        System.out.println(recent.getLast());    // file3.txt

        // SequencedMap
        SequencedMap<String, Integer> scores = new LinkedHashMap<>();
        scores.put("Round1", 40); scores.put("Round2", 55); scores.put("Round3", 70);
        System.out.println(scores.firstEntry());             // Round1=40
        System.out.println(scores.lastEntry());              // Round3=70
        System.out.println(scores.reversed());               // {Round3=70, Round2=55, Round1=40}
        scores.putFirst("Round0", 10);
        System.out.println(scores.sequencedKeySet());        // [Round0, Round1, Round2, Round3]

        // TreeSet is sequenced too, but addFirst/addLast are unsupported (order is by sorting)
        SequencedSet<Integer> sorted = new TreeSet<>(List.of(5, 1, 3));
        System.out.println(sorted.getFirst() + " " + sorted.reversed());   // 1 [5, 3, 1]
    }
}`
    },
    {
      heading: "9. Immutable Collections: List.of, Set.of, Map.of and Collections.unmodifiableList",
      content: `Immutable collections cannot be changed after creation. They are safe to share between threads, safe to return from a method without defensive copying, safe to use as map keys, and they make bugs like "who cleared my list?" impossible. Modern Java gives you several ways to create them, and they are **not** interchangeable.
**Convenience factories (Java 9).** \`List.of(a, b, c)\`, \`Set.of(a, b, c)\` and \`Map.of(k1, v1, k2, v2, ...)\` create truly immutable collections. Rules you must remember:
• They **reject \`null\`** elements, keys and values with \`NullPointerException\`.
• \`Set.of\` and \`Map.of\` **reject duplicates** with \`IllegalArgumentException\` at creation time.
• \`Map.of\` accepts up to **10** key-value pairs; beyond that use \`Map.ofEntries(Map.entry(k, v), ...)\`.
• Any mutator (\`add\`, \`remove\`, \`set\`, \`put\`, \`clear\`, \`sort\`) throws \`UnsupportedOperationException\`.
• Iteration order of \`Set.of\` and \`Map.of\` is deliberately **randomised per JVM run** so you cannot accidentally depend on it.
**Copy factories (Java 10).** \`List.copyOf(collection)\`, \`Set.copyOf\` and \`Map.copyOf\` create an immutable **snapshot**. If the argument is already an immutable collection of the same kind, no copy is made.
**Unmodifiable views (Java 1.2).** \`Collections.unmodifiableList(list)\` returns a **view** that blocks modification through the view, but if someone still holds the original list and changes it, the view changes too. Use it when you want to expose read-only access to a collection that you keep mutating internally.
**Stream results.** \`Stream.toList()\` (Java 16) returns an unmodifiable list. \`Collectors.toList()\` returns a list whose mutability is **unspecified** (in practice an \`ArrayList\`, but do not rely on it); use \`Collectors.toCollection(ArrayList::new)\` when you need a guaranteed mutable list.
**\`Arrays.asList\`** is the odd one out: it returns a **fixed-size** list backed by the array. \`set\` works and writes through to the array; \`add\` and \`remove\` throw. It is not immutable and not resizable.
**Rule of thumb:** use \`List.of\`/\`Map.of\` for constants and small fixed data; use \`List.copyOf\` when returning internal state from a method; wrap with \`new ArrayList<>(...)\` when the caller legitimately needs to modify.`,
      codeSnippet: `// ImmutableDemo.java
import java.util.*;
import java.util.stream.*;

public class ImmutableDemo {
    private final List<String> enrolled = new ArrayList<>();

    // Safe accessor: caller cannot mutate our internal list
    public List<String> getEnrolled() { return List.copyOf(enrolled); }
    public void enroll(String name) { enrolled.add(name); }

    public static void main(String[] args) {
        List<String> metros = List.of("Delhi", "Mumbai", "Chennai", "Kolkata");
        try { metros.add("Hyderabad"); }
        catch (UnsupportedOperationException e) { System.out.println("List.of is immutable"); }

        try { List.of("a", null); }
        catch (NullPointerException e) { System.out.println("List.of rejects null"); }

        try { Set.of("a", "a"); }
        catch (IllegalArgumentException e) { System.out.println("Set.of rejects duplicates"); }

        Map<String, Integer> pin = Map.of("Patna", 800001, "Ranchi", 834001);
        Map<String, Integer> big = Map.ofEntries(
            Map.entry("Delhi", 110001), Map.entry("Mumbai", 400001), Map.entry("Pune", 411001));
        System.out.println(pin.get("Ranchi") + " " + big.size());   // 834001 3

        // Unmodifiable VIEW vs immutable COPY
        List<String> source = new ArrayList<>(List.of("x", "y"));
        List<String> view = Collections.unmodifiableList(source);
        List<String> copy = List.copyOf(source);
        source.add("z");
        System.out.println(view);   // [x, y, z]  - view reflects the change
        System.out.println(copy);   // [x, y]     - snapshot is unaffected

        // Arrays.asList: fixed size, write-through
        String[] arr = {"a", "b", "c"};
        List<String> fixed = Arrays.asList(arr);
        fixed.set(0, "A");
        System.out.println(arr[0]);   // A  - the array changed too
        try { fixed.add("d"); } catch (UnsupportedOperationException e) { System.out.println("fixed-size"); }

        // Stream.toList() is unmodifiable; toCollection gives a mutable list
        List<Integer> evens = IntStream.rangeClosed(1, 10).filter(i -> i % 2 == 0).boxed().toList();
        List<Integer> mutable = Stream.of(3, 1, 2).collect(Collectors.toCollection(ArrayList::new));
        mutable.add(4);
        System.out.println(evens + " " + mutable);   // [2, 4, 6, 8, 10] [3, 1, 2, 4]

        ImmutableDemo course = new ImmutableDemo();
        course.enroll("Sita");
        course.getEnrolled().clear();              // throws - our internal list stays safe
    }
}`
    },
    {
      heading: "10. Sorting Java Collections: Comparable vs Comparator",
      content: `Sorting needs a rule for deciding which of two elements comes first. Java offers two ways to express that rule.
**\`Comparable<T>\`** is implemented **by the class itself** and defines its **natural ordering** through a single method, \`int compareTo(T other)\`. Return a negative number if \`this\` comes before \`other\`, zero if they are equal in ordering, positive if after. \`String\`, \`Integer\`, \`LocalDate\`, \`BigDecimal\` and all enums are \`Comparable\`. A class can have only **one** natural order. \`Collections.sort(list)\`, \`TreeSet\`, \`TreeMap\` and \`Arrays.sort\` all use it when no comparator is given. Strongly recommended: keep \`compareTo\` **consistent with \`equals\`** (returns 0 exactly when \`equals\` is true), otherwise \`TreeSet\` and \`TreeMap\` behave strangely.
**\`Comparator<T>\`** is a **separate object** that defines an ordering **from outside** the class. You can have as many as you like: by name, by salary descending, by joining date then name. It has one abstract method, \`int compare(T a, T b)\`, so it is a functional interface and can be written as a lambda. Pass it to \`list.sort(cmp)\`, \`Collections.sort(list, cmp)\`, \`stream.sorted(cmp)\`, \`new TreeSet<>(cmp)\`, \`new TreeMap<>(cmp)\` or \`new PriorityQueue<>(cmp)\`.
**Since Java 8 you should almost never write a \`compare\` method by hand.** The static and default methods on \`Comparator\` compose readable, bug-free orderings:
• \`Comparator.comparing(Employee::getName)\` — by a key.
• \`Comparator.comparingInt(Employee::getAge)\` / \`comparingDouble\` / \`comparingLong\` — avoid boxing.
• \`.thenComparing(...)\` — tie-breaker.
• \`.reversed()\` — flip the order (apply it to the right part of the chain).
• \`Comparator.naturalOrder()\` / \`reverseOrder()\`.
• \`Comparator.nullsFirst(cmp)\` / \`nullsLast(cmp)\` — handle null elements instead of crashing.
• \`String.CASE_INSENSITIVE_ORDER\` — for case-insensitive text.
**Pitfalls.** Writing \`return a.salary - b.salary;\` overflows for large or negative numbers; use \`Integer.compare(a, b)\`. Sorting a \`List.of(...)\` result throws because it is immutable; copy it first. \`Collections.sort\` and \`List.sort\` are **stable** (equal elements keep their relative order), which matters when you sort by one field then another in separate passes.`,
      codeSnippet: `// SortingDemo.java
import java.util.*;

public class SortingDemo {
    // Natural ordering: by employee ID
    record Employee(int id, String name, String dept, double salary) implements Comparable<Employee> {
        @Override public int compareTo(Employee o) { return Integer.compare(this.id, o.id); }
    }

    public static void main(String[] args) {
        List<Employee> staff = new ArrayList<>(List.of(
            new Employee(103, "Kavya",  "Engineering", 95_000),
            new Employee(101, "Arjun",  "Sales",       60_000),
            new Employee(104, "Meera",  "Engineering", 95_000),
            new Employee(102, "Rohan",  "Sales",       72_000)));

        Collections.sort(staff);                       // uses compareTo -> by id
        System.out.println(names(staff));              // [Arjun, Rohan, Kavya, Meera]

        staff.sort(Comparator.comparing(Employee::name));
        System.out.println(names(staff));              // [Arjun, Kavya, Meera, Rohan]

        // Salary descending, ties broken by name ascending
        staff.sort(Comparator.comparingDouble(Employee::salary).reversed()
                             .thenComparing(Employee::name));
        System.out.println(names(staff));              // [Kavya, Meera, Rohan, Arjun]

        // Department ascending, then salary descending
        staff.sort(Comparator.comparing(Employee::dept)
                             .thenComparing(Employee::salary, Comparator.reverseOrder()));
        System.out.println(names(staff));              // [Kavya, Meera, Rohan, Arjun]

        // Handling nulls safely
        List<String> cities = new ArrayList<>(Arrays.asList("Pune", null, "Agra", "Goa"));
        cities.sort(Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER));
        System.out.println(cities);                    // [Agra, Goa, Pune, null]

        // Reusable comparator stored in a constant
        Comparator<Employee> BY_SALARY = Comparator.comparingDouble(Employee::salary);
        System.out.println(Collections.max(staff, BY_SALARY).name());   // Kavya (first max found)

        // Overflow trap: never subtract to compare
        int a = Integer.MAX_VALUE, b = -1;
        System.out.println(a - b);                     // -2147483648  (wrong sign!)
        System.out.println(Integer.compare(a, b));     // 1            (correct)
    }

    static List<String> names(List<Employee> list) {
        return list.stream().map(Employee::name).toList();
    }
}`
    },
    {
      heading: "11. Iterating and Removing Safely: ConcurrentModificationException and removeIf",
      content: `One of the first runtime surprises every Java developer hits is \`ConcurrentModificationException\` (CME). Despite the name, it has nothing to do with threads in most cases. It happens when you modify a collection **structurally** (add or remove, not \`set\`) while iterating it with a for-each loop or an iterator obtained earlier.
**Why it happens.** \`ArrayList\`, \`HashMap\` and friends keep an internal counter called \`modCount\`, incremented on every structural change. When you call \`iterator()\`, the iterator remembers the current \`modCount\`. On every \`next()\` it compares its copy with the live value; if they differ, it throws CME. This is called **fail-fast** behaviour, and it exists to surface bugs early rather than returning garbage. Note the check is best-effort: removing the second-to-last element sometimes ends the loop without throwing, which makes the bug intermittent and harder to find.
**Safe ways to remove while iterating:**
1. **\`Iterator.remove()\`** — the classic approach. Get an explicit \`Iterator\`, and call \`it.remove()\` after \`it.next()\`. The iterator updates its expected \`modCount\`, so no exception.
2. **\`Collection.removeIf(predicate)\`** (Java 8) — one line, fastest and clearest. \`ArrayList\` overrides it with an optimised single pass. Works on \`map.keySet()\`, \`map.values()\` and \`map.entrySet()\` too.
3. **\`ListIterator\`** — like \`Iterator\` but also supports \`add\`, \`set\` and backward traversal with \`hasPrevious\`/\`previous\`.
4. **Index loop running backwards** — \`for (int i = list.size() - 1; i >= 0; i--)\`; removing element i does not shift the elements you have yet to visit.
5. **Iterate over a copy** — \`for (String s : new ArrayList<>(list))\`; simple but O(n) extra memory.
6. **Concurrent collections** — \`CopyOnWriteArrayList\` and \`ConcurrentHashMap\` never throw CME. Their iterators are **weakly consistent**: they reflect the state at some point since creation and may or may not show later changes. \`CopyOnWriteArrayList\` copies the whole array on every write, so it is only suitable for read-mostly data such as listener lists.
For maps, do not call \`map.remove(key)\` inside a loop over \`map.keySet()\`; use \`map.entrySet().removeIf(e -> ...)\` or an explicit iterator on \`entrySet()\`. Updating **values** during iteration (\`entry.setValue(...)\`) is allowed because it is not a structural change.`,
      codeSnippet: `// SafeRemoval.java
import java.util.*;
import java.util.concurrent.*;

public class SafeRemoval {
    public static void main(String[] args) {
        // THE BUG: modifying while iterating with for-each
        List<Integer> nums = new ArrayList<>(List.of(1, 2, 3, 4, 5, 6));
        try {
            for (Integer n : nums) {
                if (n % 2 == 0) nums.remove(n);     // structural change inside for-each
            }
        } catch (ConcurrentModificationException e) {
            System.out.println("CME: " + nums);     // CME: [1, 3, 4, 5, 6] - partially modified!
        }

        // FIX 1: Iterator.remove()
        nums = new ArrayList<>(List.of(1, 2, 3, 4, 5, 6));
        Iterator<Integer> it = nums.iterator();
        while (it.hasNext()) {
            if (it.next() % 2 == 0) it.remove();
        }
        System.out.println(nums);                   // [1, 3, 5]

        // FIX 2: removeIf (preferred)
        nums = new ArrayList<>(List.of(1, 2, 3, 4, 5, 6));
        nums.removeIf(n -> n % 2 == 0);
        System.out.println(nums);                   // [1, 3, 5]

        // FIX 3: ListIterator can also add and replace
        List<String> words = new ArrayList<>(List.of("java", "c", "go"));
        ListIterator<String> li = words.listIterator();
        while (li.hasNext()) {
            String w = li.next();
            if (w.length() == 1) li.set(w + "++");  // replace in place
            if (w.equals("go")) li.add("rust");     // insert after current
        }
        System.out.println(words);                  // [java, c++, go, rust]

        // Maps: remove entries safely
        Map<String, Integer> stock = new HashMap<>(Map.of("pen", 0, "book", 12, "bag", 0));
        stock.entrySet().removeIf(e -> e.getValue() == 0);
        System.out.println(stock);                  // {book=12}

        // Updating values during iteration is fine (not structural)
        Map<String, Integer> prices = new HashMap<>(Map.of("tea", 10, "coffee", 20));
        for (Map.Entry<String, Integer> e : prices.entrySet()) e.setValue(e.getValue() * 2);
        System.out.println(prices);                 // {tea=20, coffee=40} (any order)

        // Concurrent collection: no CME, weakly consistent iteration
        List<String> listeners = new CopyOnWriteArrayList<>(List.of("a", "b", "c"));
        for (String s : listeners) {
            if (s.equals("b")) listeners.remove(s); // allowed
        }
        System.out.println(listeners);              // [a, c]
    }
}`
    },
    {
      heading: "12. Java Generics: Generic Classes, Generic Methods and Bounded Types",
      content: `**Generics** (Java 5) let you write classes, interfaces and methods that are **parameterised by type**. Instead of a \`Box\` that holds an \`Object\` and forces casts everywhere, you write \`Box<T>\` once and use it as \`Box<String>\`, \`Box<Integer>\` or \`Box<Employee>\` with full compile-time type checking.
**Why they matter:** without generics, \`List names = new ArrayList(); names.add(42);\` compiles and only blows up later with a \`ClassCastException\` when someone does \`(String) names.get(0)\`. With \`List<String>\`, the same mistake is a compile error on the line that is actually wrong. Generics turn runtime failures into compile-time failures and remove casting noise.
**Generic class.** Declare type parameters in angle brackets after the class name: \`class Pair<K, V> { ... }\`. Inside, \`K\` and \`V\` act like types. Conventional names: \`T\` (type), \`E\` (element), \`K\`/\`V\` (key/value), \`N\` (number), \`R\` (result). Since Java 7 the **diamond operator** \`new Pair<>(...)\` lets the compiler infer the arguments.
**Generic method.** Declare the type parameter **before the return type**: \`static <T> T firstOrDefault(List<T> list, T def)\`. The compiler infers \`T\` from the arguments at each call site, so you rarely write \`Util.<String>firstOrDefault(...)\` explicitly. A generic method can live in a non-generic class, and a static method cannot use the class's type parameter because there is no instance to tie it to.
**Bounded type parameters** restrict what \`T\` can be, which in turn lets you call methods on it. \`<T extends Number>\` means T must be \`Number\` or a subclass, so you can call \`t.doubleValue()\`. \`<T extends Comparable<T>>\` means you can call \`compareTo\`, which is exactly what a generic \`max\` method needs. Note that \`extends\` is used for both classes and interfaces in bounds. **Multiple bounds** are written with \`&\`: \`<T extends Number & Comparable<T>>\`; a class bound, if any, must come first.
The recursive-looking bound \`<T extends Comparable<? super T>>\` is the most flexible form for sorting utilities because it also accepts subclasses whose parent implements \`Comparable\`; it is what \`Collections.sort\` actually declares.
**Generic interfaces** work the same way: \`interface Repository<T, ID> { Optional<T> findById(ID id); }\` is exactly the pattern Spring Data uses for \`JpaRepository<Employee, Long>\`.`,
      codeSnippet: `// GenericsBasics.java
import java.util.*;

public class GenericsBasics {
    // Generic class with two type parameters
    static class Pair<K, V> {
        private final K key;
        private final V value;
        Pair(K key, V value) { this.key = key; this.value = value; }
        K getKey() { return key; }
        V getValue() { return value; }
        @Override public String toString() { return "(" + key + ", " + value + ")"; }
    }

    // Generic interface - the shape Spring Data repositories use
    interface Repository<T, ID> {
        void save(T entity);
        Optional<T> findById(ID id);
    }

    // Generic method: type parameter declared before the return type
    static <T> T firstOrDefault(List<T> list, T defaultValue) {
        return list.isEmpty() ? defaultValue : list.get(0);
    }

    // Bounded type: T must be Comparable so we can call compareTo
    static <T extends Comparable<T>> T max(List<T> items) {
        T best = items.get(0);
        for (T item : items) if (item.compareTo(best) > 0) best = item;
        return best;
    }

    // Multiple bounds: must be a Number AND Comparable
    static <T extends Number & Comparable<T>> double sumIfAscending(List<T> nums) {
        double sum = 0;
        for (int i = 0; i < nums.size(); i++) {
            if (i > 0 && nums.get(i).compareTo(nums.get(i - 1)) < 0) {
                throw new IllegalArgumentException("not ascending at index " + i);
            }
            sum += nums.get(i).doubleValue();     // available because T extends Number
        }
        return sum;
    }

    public static void main(String[] args) {
        Pair<String, Integer> p = new Pair<>("Lucknow", 226001);   // diamond operator
        System.out.println(p + " " + p.getKey().toUpperCase());    // (Lucknow, 226001) LUCKNOW

        System.out.println(firstOrDefault(List.of("a", "b"), "none"));   // a
        System.out.println(firstOrDefault(List.<String>of(), "none"));   // none (explicit witness)

        System.out.println(max(List.of(3, 9, 4)));              // 9
        System.out.println(max(List.of("pear", "apple")));      // pear
        // max(List.of(new Object()));   // compile error: Object is not Comparable

        System.out.println(sumIfAscending(List.of(1.5, 2.5, 3.0)));   // 7.0
        try { sumIfAscending(List.of(5, 3)); }
        catch (IllegalArgumentException e) { System.out.println(e.getMessage()); }

        // Raw type: compiles with a warning, fails at runtime - never do this
        List raw = new ArrayList<String>();
        raw.add(42);
        try { String s = (String) raw.get(0); }
        catch (ClassCastException e) { System.out.println("ClassCastException from raw type"); }
    }
}`
    },
    {
      heading: "13. Wildcards, PECS and Type Erasure in Java Generics",
      content: `**Generics are invariant.** Even though \`Integer\` is a subtype of \`Number\`, \`List<Integer>\` is **not** a subtype of \`List<Number>\`. If it were, you could write \`List<Number> nums = integers; nums.add(3.14);\` and corrupt the integer list. So a method declared as \`void printAll(List<Number> list)\` cannot accept a \`List<Integer>\`. Wildcards solve this.
**Three kinds of wildcard:**
• **\`List<?>\`** (unbounded) — a list of some unknown type. You can read elements as \`Object\` and call size/isEmpty, but you cannot \`add\` anything except \`null\`. Use it when the method only needs \`Collection\`-level operations.
• **\`List<? extends Number>\`** (upper bounded) — a list of \`Number\` or some subtype. You can safely **read** elements as \`Number\`, but you cannot **add** because the compiler does not know whether it is really a \`List<Integer>\` or \`List<Double>\`.
• **\`List<? super Integer>\`** (lower bounded) — a list of \`Integer\` or some supertype (\`Number\`, \`Object\`). You can safely **add** an \`Integer\`, but reading only gives you \`Object\`.
**PECS: Producer Extends, Consumer Super** (Joshua Bloch, Effective Java). If a parameter **produces** values for your method to read, use \`? extends T\`. If it **consumes** values your method writes, use \`? super T\`. If it does both, use the exact type \`T\`. The JDK's own \`Collections.copy(List<? super T> dest, List<? extends T> src)\` is the textbook example; so is \`Collections.sort(List<T>, Comparator<? super T>)\`, which lets a \`Comparator<Object>\` sort a \`List<String>\`.
**Type erasure.** Generics exist only at compile time. The compiler checks your types, inserts casts where needed, and then **erases** every type parameter: \`T\` becomes \`Object\` (or its first bound, e.g. \`Comparable\`), and \`List<String>\` becomes plain \`List\` in the bytecode. This was done so Java 5 code could run on older JVMs and interoperate with pre-generics libraries. Where a subclass overrides a generic method with a concrete type, the compiler generates a hidden **bridge method** to keep overriding working after erasure.
**Consequences you must know for interviews:**
• \`new ArrayList<String>().getClass() == new ArrayList<Integer>().getClass()\` is **true**.
• \`obj instanceof List<String>\` does not compile; only \`instanceof List<?>\` is allowed.
• You cannot write \`new T()\`, \`new T[10]\` or \`T.class\`. Pass a \`Class<T>\` token or an array factory instead.
• Primitive types cannot be type arguments: \`List<int>\` is illegal, use \`List<Integer>\` (autoboxing costs memory and time; streams offer \`IntStream\` to avoid it).
• A static field cannot have type \`T\`, because statics are shared across all parameterisations.
• Two methods \`void f(List<String> l)\` and \`void f(List<Integer> l)\` cannot coexist because they erase to the same signature.
• Generic arrays plus varargs can cause **heap pollution**; the compiler warns, and \`@SafeVarargs\` is how a library author promises the method is safe.`,
      codeSnippet: `// WildcardsAndErasure.java
import java.util.*;

public class WildcardsAndErasure {
    // ? extends : we only READ from the list (producer)
    static double total(List<? extends Number> nums) {
        double sum = 0;
        for (Number n : nums) sum += n.doubleValue();
        // nums.add(1);   // compile error: cannot add to List<? extends Number>
        return sum;
    }

    // ? super : we only WRITE into the list (consumer)
    static void fillWithSquares(List<? super Integer> target, int upto) {
        for (int i = 1; i <= upto; i++) target.add(i * i);
        // Integer x = target.get(0);   // compile error: reading gives Object
    }

    // PECS together: copy from a producer into a consumer
    static <T> void copy(List<? extends T> src, List<? super T> dest) {
        for (T t : src) dest.add(t);
    }

    // Unbounded wildcard: only Collection-level operations needed
    static boolean isNullOrEmpty(Collection<?> c) {
        return c == null || c.isEmpty();
    }

    // Erasure workaround: a Class token lets us create instances / arrays of T
    static <T> T[] newArray(Class<T> type, int size) {
        @SuppressWarnings("unchecked")
        T[] arr = (T[]) java.lang.reflect.Array.newInstance(type, size);
        return arr;
    }

    public static void main(String[] args) {
        List<Integer> ints = List.of(1, 2, 3);
        List<Double> doubles = List.of(1.5, 2.5);
        System.out.println(total(ints) + " " + total(doubles));   // 6.0 4.0

        List<Number> numbers = new ArrayList<>();
        List<Object> objects = new ArrayList<>();
        fillWithSquares(numbers, 3);           // List<Number> is a supertype of Integer: OK
        fillWithSquares(objects, 2);           // List<Object> too
        System.out.println(numbers + " " + objects);   // [1, 4, 9] [1, 4]

        copy(ints, numbers);                   // Integer -> Number
        System.out.println(numbers);           // [1, 4, 9, 1, 2, 3]

        System.out.println(isNullOrEmpty(List.of()) + " " + isNullOrEmpty(Set.of(1)));  // true false

        // Erasure in action
        List<String> a = new ArrayList<>();
        List<Integer> b = new ArrayList<>();
        System.out.println(a.getClass() == b.getClass());   // true - both are just ArrayList
        Object o = a;
        System.out.println(o instanceof List<?>);           // true (List<String> check is illegal)

        String[] names = newArray(String.class, 2);
        names[0] = "ok";
        System.out.println(names.length + " " + names[0]);  // 2 ok
    }
}`
    },
    {
      heading: "14. Real-World Use Cases: How Collections and Generics Are Used in Production",
      content: `Here is how the structures from this lecture show up in real Java systems, with the reasoning behind each choice.
**REST APIs with Spring Boot.** Controllers return \`List<OrderDto>\`; service layers build \`Map<Long, Customer>\` lookups so that a loop over 5,000 orders does not hit the database 5,000 times (the classic N+1 problem). Spring Data's \`JpaRepository<T, ID>\` is itself a generic interface, so understanding bounded types is what lets you read its source without fear.
**De-duplication and membership checks.** Payment gateways store processed transaction IDs in a \`HashSet<String>\` (or in Redis for distributed systems) so a retried webhook is ignored in O(1). An e-commerce "recently viewed" widget is a \`LinkedHashSet\` capped at 10 entries: duplicates collapse and insertion order is preserved.
**Caching.** A \`LinkedHashMap\` in access order with \`removeEldestEntry\` is a production-grade in-process LRU cache for small datasets such as pincode-to-city lookups. Libraries like Caffeine implement the same idea with concurrency and expiry on top.
**Scheduling and rate limiting.** A \`PriorityQueue<Job>\` ordered by \`runAt\` timestamp drives a simple scheduler: peek the head, sleep until its time, poll and execute. A sliding-window rate limiter keeps request timestamps in an \`ArrayDeque<Long>\` and polls expired ones from the front.
**Range lookups.** \`TreeMap<Integer, String>\` with \`floorEntry\` resolves tax slabs, shipping charges by weight, or the correct version of a config that was valid at a timestamp. Consistent-hashing load balancers use \`TreeMap<Integer, Node>\` with \`ceilingEntry\` to find the next node on the ring.
**Streaming and batching.** Kafka consumers collect records into an \`ArrayList\` with a known capacity and flush every 500 records; using \`new ArrayList<>(500)\` avoids four internal resizes per batch.
**Multi-threaded services.** Shared counters and registries use \`ConcurrentHashMap\` with \`merge\` and \`computeIfAbsent\`, which are atomic per key. Event listener lists use \`CopyOnWriteArrayList\` because reads vastly outnumber writes.
**Generic utilities.** Teams write \`ApiResponse<T>\`, \`Page<T>\`, \`Result<T, E>\` and \`Validator<T>\` once and reuse them across every endpoint. Wildcards appear whenever a utility accepts "any list of DTOs": \`void audit(List<? extends BaseEntity> changed)\`.
**Android and desktop UI.** A \`RecyclerView\` adapter holds a \`List<Item>\`; stable sorting with chained comparators keeps grouped sections in order when the user changes the sort key.`,
      codeSnippet: `// RateLimiter.java — sliding window using ArrayDeque, as used in API gateways
import java.util.*;

public class RateLimiter {
    private final int maxRequests;
    private final long windowMillis;
    private final Deque<Long> timestamps = new ArrayDeque<>();

    RateLimiter(int maxRequests, long windowMillis) {
        this.maxRequests = maxRequests;
        this.windowMillis = windowMillis;
    }

    // Returns true if the request is allowed, false if rate-limited
    synchronized boolean allow(long now) {
        // Drop timestamps that fell out of the window (oldest are at the front)
        while (!timestamps.isEmpty() && now - timestamps.peekFirst() >= windowMillis) {
            timestamps.pollFirst();
        }
        if (timestamps.size() < maxRequests) {
            timestamps.addLast(now);
            return true;
        }
        return false;
    }

    public static void main(String[] args) {
        RateLimiter limiter = new RateLimiter(3, 1000);   // 3 requests per second
        long t0 = 0;
        System.out.println(limiter.allow(t0));         // true
        System.out.println(limiter.allow(t0 + 100));   // true
        System.out.println(limiter.allow(t0 + 200));   // true
        System.out.println(limiter.allow(t0 + 300));   // false - 4th within 1 s
        System.out.println(limiter.allow(t0 + 1000));  // true  - first request expired
    }
}`
    },
    {
      heading: "15. Common Mistakes with Java Collections and Generics and How to Fix Them",
      content: `**1. Using \`==\` or forgetting \`equals\`/\`hashCode\` on map keys and set elements.** A custom \`Employee\` class without both methods means \`set.contains(new Employee("E1"))\` is always false and the map stores duplicates. Fix: generate both methods, or use a \`record\`, which does it for you.
**2. Mutating a key after inserting it.** The entry is stranded in the old bucket. Fix: use immutable keys (\`String\`, \`Integer\`, records with immutable fields) or remove and re-insert.
**3. Removing inside a for-each loop.** Causes \`ConcurrentModificationException\`, sometimes only on certain inputs. Fix: \`removeIf\` or \`Iterator.remove()\`.
**4. Using \`LinkedList\` "because insertions are fast".** The cost of finding the position dominates, and memory per element is three times higher. Fix: default to \`ArrayList\`; use \`ArrayDeque\` for queue or stack behaviour.
**5. Using \`list.contains()\` in a loop.** Checking 10,000 items against a 10,000-element list is 10⁸ comparisons. Fix: convert the lookup side to a \`HashSet\` first; the whole job becomes O(n).
**6. Depending on \`HashMap\`/\`HashSet\` iteration order.** It changes between JVM versions, on resize, and \`Set.of\`/\`Map.of\` randomise it on purpose. Fix: \`LinkedHashMap\` for insertion order, \`TreeMap\` for sorted order.
**7. Subtracting in \`compareTo\`.** \`return a.price - b.price;\` overflows for large values and does not work for doubles at all. Fix: \`Integer.compare\`, \`Double.compare\`, or \`Comparator.comparing\`.
**8. Comparator inconsistent with equals in \`TreeSet\`/\`TreeMap\`.** Elements that compare as 0 are treated as the same element. Fix: add a unique tie-breaker (\`.thenComparing(Employee::id)\`).
**9. Modifying a \`List.of\` result or the list returned by \`Stream.toList()\`.** Throws \`UnsupportedOperationException\`. Fix: wrap in \`new ArrayList<>(...)\` when mutation is needed.
**10. Putting \`null\` where it is not allowed.** \`List.of\`, \`Map.of\`, \`ArrayDeque\`, \`TreeMap\` keys, \`ConcurrentHashMap\` keys and values all reject it with \`NullPointerException\`. Fix: use \`Optional\` or a sentinel, or choose \`HashMap\`/\`ArrayList\` which allow nulls.
**11. Using raw types.** \`List list = new ArrayList();\` silently disables type checking and produces unchecked warnings. Fix: always supply type arguments; use \`List<?>\` when the element type is genuinely unknown.
**12. Returning internal collections directly from getters.** Callers can mutate your object's state. Fix: return \`List.copyOf(internal)\` or \`Collections.unmodifiableList(internal)\`.
**13. Autoboxing in hot loops.** \`Map<Integer, Integer>\` counting in a tight loop allocates millions of \`Integer\` objects. Fix: use primitive arrays or specialised libraries (Eclipse Collections, fastutil) when profiling shows it matters.
**14. Using \`Hashtable\`, \`Vector\` or \`Stack\`.** They are legacy and slow. Fix: \`HashMap\`/\`ConcurrentHashMap\`, \`ArrayList\`, \`ArrayDeque\`.`,
      codeSnippet: `// MistakesFixed.java — before and after for the most common bugs
import java.util.*;

public class MistakesFixed {
    // Mistake 1 fixed: record gives equals/hashCode for free
    record UserId(String value) {}

    public static void main(String[] args) {
        // Mistake 5: contains() in a loop  ->  use a HashSet
        List<Integer> activeIds = new ArrayList<>();
        for (int i = 0; i < 50_000; i++) activeIds.add(i * 2);
        List<Integer> toCheck = new ArrayList<>();
        for (int i = 0; i < 50_000; i++) toCheck.add(i * 3);

        long t = System.nanoTime();
        int slow = 0;
        for (Integer id : toCheck) if (activeIds.contains(id)) slow++;   // O(n*m)
        long slowMs = (System.nanoTime() - t) / 1_000_000;

        t = System.nanoTime();
        Set<Integer> activeSet = new HashSet<>(activeIds);
        int fast = 0;
        for (Integer id : toCheck) if (activeSet.contains(id)) fast++;   // O(n+m)
        long fastMs = (System.nanoTime() - t) / 1_000_000;
        System.out.printf("matches=%d  list: %d ms  set: %d ms%n", slow, slowMs, fastMs);
        // typical: matches=16667  list: 1500 ms  set: 5 ms

        // Mistake 8: TreeSet comparator must break ties
        record Emp(int id, String name, int salary) {}
        Set<Emp> ok = new TreeSet<>(Comparator.comparingInt(Emp::salary).thenComparingInt(Emp::id));
        ok.add(new Emp(1, "A", 100));
        ok.add(new Emp(2, "B", 100));
        System.out.println(ok.size());   // 2 (would be 1 without the tie-breaker)

        // Mistake 9: immutable results
        List<String> fixed = List.of("x");
        List<String> editable = new ArrayList<>(fixed);
        editable.add("y");
        System.out.println(editable);    // [x, y]

        // Mistake 12: defensive copies
        Map<UserId, String> internal = new HashMap<>();
        internal.put(new UserId("u1"), "Ravindra");
        Map<UserId, String> exposed = Map.copyOf(internal);
        System.out.println(exposed.get(new UserId("u1")));   // Ravindra - record equality works
    }
}`
    },
    {
      heading: "16. Frequently Asked Questions about Java Collections and Generics",
      content: `**What is the difference between ArrayList and LinkedList in Java?**
\`ArrayList\` stores elements in a resizable array, giving O(1) index access and compact memory; inserting in the middle is O(n) because elements shift. \`LinkedList\` stores each element in a node with prev/next pointers, giving O(1) insertion and removal at the ends but O(n) index access and much higher memory use. In practice \`ArrayList\` is faster for almost every workload, and \`ArrayDeque\` beats \`LinkedList\` for queue and stack use.
**What is the difference between HashMap and HashSet?**
\`HashMap\` stores key-value pairs; \`HashSet\` stores only unique elements. \`HashSet\` is actually implemented on top of a \`HashMap\`: each element becomes a key and the value is a shared dummy object. Both give O(1) average \`add\`/\`contains\`, both depend on correct \`equals\` and \`hashCode\`, and both allow one \`null\`.
**What is the difference between HashMap and Hashtable?**
\`Hashtable\` is a legacy class from Java 1.0 that synchronizes every method, forbids null keys and values, and is slower. \`HashMap\` is unsynchronized, allows one null key, and is the standard choice. For thread safety use \`ConcurrentHashMap\`, not \`Hashtable\`.
**How does HashMap work internally in Java?**
It keeps an array of buckets. A key's \`hashCode()\` is spread with \`h ^ (h >>> 16)\` and masked with \`(n - 1)\` to pick a bucket. Collisions form a linked list, which converts to a red-black tree at 8 nodes (when the table has at least 64 buckets). When size exceeds capacity × 0.75 the table doubles and entries are redistributed. Lookups compare the stored hash first and then call \`equals\`.
**What is the difference between Comparable and Comparator in Java?**
\`Comparable\` is implemented by the class itself (\`compareTo\`) and defines one natural order. \`Comparator\` is a separate object (\`compare\`) that defines an external order, so you can have many of them and build them with \`Comparator.comparing\` and \`thenComparing\`. Use \`Comparable\` for the obvious default order and \`Comparator\` for everything else.
**What are sequenced collections in Java 21?**
JEP 431 added \`SequencedCollection\`, \`SequencedSet\` and \`SequencedMap\` with uniform \`getFirst\`, \`getLast\`, \`addFirst\`, \`addLast\`, \`removeFirst\`, \`removeLast\` and \`reversed()\` methods. \`List\`, \`Deque\`, \`LinkedHashSet\`, \`TreeSet\`, \`LinkedHashMap\` and \`TreeMap\` all gained them. \`reversed()\` returns a live view.
**What is type erasure in Java generics?**
The compiler checks generic types and then removes them from the bytecode, replacing \`T\` with \`Object\` or its bound. That is why \`List<String>\` and \`List<Integer>\` have the same runtime class, why you cannot write \`new T()\` or \`instanceof List<String>\`, and why primitives cannot be type arguments. It was chosen for backward compatibility with pre-Java 5 code.
**When should I use List.of instead of new ArrayList?**
Use \`List.of\` (Java 9) for fixed data that should never change: constants, test fixtures, values returned from a method. It is compact, thread-safe and rejects nulls. Use \`new ArrayList<>()\` when the list will be modified. Use \`List.copyOf\` to return an immutable snapshot of internal state.`
    },
    {
      heading: "17. Interview Questions and Answers on Java Collections and Generics",
      content: `**Q1. Why is the load factor of HashMap 0.75 and what happens when it is exceeded?**
0.75 is a trade-off between memory and lookup time: higher values pack more entries per bucket (more collisions), lower values waste array slots. When \`size\` exceeds \`capacity × loadFactor\` (12 for the default 16), the table doubles and every entry is rehashed into the new array, an O(n) operation. Pre-sizing the map avoids repeated resizes.
**Q2. Why should HashMap keys be immutable?**
The bucket index is computed from the key's hash code at insertion time. If the key's state (and therefore its hash) changes afterwards, \`get\` computes a different index and cannot find the entry, while \`size\` still counts it. Immutable keys like \`String\`, \`Integer\` and records avoid this.
**Q3. What happens if two keys have the same hashCode in a HashMap?**
They land in the same bucket (a collision). \`HashMap\` walks the bucket and uses \`equals\` to distinguish them. Entries are chained in a linked list, converted to a red-black tree when the chain reaches 8 nodes and the table has at least 64 buckets, giving O(log n) worst-case instead of O(n).
**Q4. What is the difference between fail-fast and fail-safe iterators?**
Fail-fast iterators (\`ArrayList\`, \`HashMap\`) check a \`modCount\` on every \`next()\` and throw \`ConcurrentModificationException\` if the collection changed structurally. So-called fail-safe (more precisely weakly consistent) iterators in \`ConcurrentHashMap\` and \`CopyOnWriteArrayList\` work on a snapshot or tolerate concurrent changes and never throw, at the cost of possibly not seeing the latest updates.
**Q5. How would you implement an LRU cache in Java?**
Extend \`LinkedHashMap\` with \`accessOrder = true\` and override \`removeEldestEntry\` to return \`size() > capacity\`. Every \`get\` moves the entry to the tail; inserting beyond capacity evicts the head, which is the least recently used entry. All operations stay O(1).
**Q6. What is the difference between \`List<Object>\`, \`List<?>\` and a raw \`List\`?**
\`List<Object>\` is a list that may hold any object and you can add anything to it, but a \`List<String>\` cannot be passed where it is expected (invariance). \`List<?>\` accepts any parameterised list but only allows reading as \`Object\` and adding \`null\`. A raw \`List\` disables generic type checking completely and generates unchecked warnings; it exists only for legacy code.
**Q7. Explain PECS with an example.**
Producer Extends, Consumer Super. If a parameter supplies values you read, declare \`? extends T\` so any subtype list is accepted: \`double sum(List<? extends Number>)\`. If a parameter receives values you write, declare \`? super T\` so any supertype list is accepted: \`void addAll(List<? super Integer>)\`. \`Collections.copy(List<? super T> dest, List<? extends T> src)\` uses both.
**Q8. Why can you not create a generic array like \`new T[10]\`?**
Because of type erasure, \`T\` does not exist at runtime, so the JVM cannot know which array type to create. Arrays are reified and checked at runtime, generics are not. Workarounds are \`(T[]) new Object[10]\` with an unchecked warning (only safe if the array never escapes), or \`Array.newInstance(clazz, 10)\` with a \`Class<T>\` token.
**Q9. What is the difference between \`Iterator\` and \`ListIterator\`?**
\`Iterator\` works on any \`Collection\` and supports \`hasNext\`, \`next\` and \`remove\`. \`ListIterator\` works only on \`List\`, adds bidirectional traversal (\`hasPrevious\`, \`previous\`), index queries (\`nextIndex\`, \`previousIndex\`) and modification via \`set\` and \`add\`.
**Q10. Which collection would you use for each: unique sorted words, task scheduling by deadline, undo history, counting word frequency, and a thread-safe registry?**
\`TreeSet<String>\` for unique sorted words; \`PriorityQueue<Task>\` ordered by deadline; \`ArrayDeque<Action>\` used as a stack for undo; \`HashMap<String, Integer>\` with \`merge(word, 1, Integer::sum)\` for counting; \`ConcurrentHashMap\` for a registry shared across threads.`
    },
    {
      heading: "18. Hands-On Exercise: Generic In-Memory Inventory Manager",
      content: `Put everything together by building a small inventory system for an electronics and stationery shop. The program uses:
• A **generic repository** \`InMemoryRepository<T, ID>\` backed by a \`LinkedHashMap\`, returning immutable snapshots with \`List.copyOf\`.
• A \`Product\` **record** that implements \`Comparable\` (natural order by name).
• A **bounded generic method** \`maxOf\` and a **PECS** method \`copyAll\`.
• \`TreeMap\` for grouping by category and for price range queries with \`headMap\` and \`ceilingEntry\`.
• \`Comparator\` chaining for sorting by price descending then name.
• \`PriorityQueue\` for low-stock restock ordering.
• Java 21 **sequenced** methods \`getFirst\`/\`getLast\`.
• \`removeIf\` for safe deletion and \`LinkedHashSet\` for ordered unique categories.
Compile and run with Java 21 or later: \`javac InventoryApp.java\` then \`java InventoryApp\`. Compare your output with the expected output in the comment at the bottom.
**Extend it yourself:**
1. Add a \`findByCategory(String)\` method to the repository using a wildcard-friendly signature \`List<? extends T>\`.
2. Replace the \`PriorityQueue\` with a \`TreeSet\` using a comparator on stock then SKU, and observe the difference in iteration order.
3. Make \`Product\` prices \`BigDecimal\` and sort with \`Comparator.comparing(Product::price)\`.
4. Write an \`LruCache<K, V>\` from Section 5 and cache \`findById\` results.`,
      codeSnippet: `// InventoryApp.java  (Java 21+)   compile: javac InventoryApp.java   run: java InventoryApp
import java.util.*;
import java.util.function.Function;

// A generic in-memory repository: works for any entity type T with an id of type ID
class InMemoryRepository<T, ID> {
    private final Map<ID, T> store = new LinkedHashMap<>();   // keeps insertion order
    private final Function<T, ID> idExtractor;

    InMemoryRepository(Function<T, ID> idExtractor) {
        this.idExtractor = idExtractor;
    }

    public void save(T entity) { store.put(idExtractor.apply(entity), entity); }
    public Optional<T> findById(ID id) { return Optional.ofNullable(store.get(id)); }
    public boolean deleteById(ID id) { return store.remove(id) != null; }
    public List<T> findAll() { return List.copyOf(store.values()); }     // immutable snapshot
    public int count() { return store.size(); }
}

record Product(String sku, String name, String category, double price, int stock)
        implements Comparable<Product> {
    // natural order: by name, case-insensitive (note: not consistent with equals - fine for sorting)
    @Override
    public int compareTo(Product other) {
        return this.name.compareToIgnoreCase(other.name);
    }
}

public class InventoryApp {

    // Bounded generic method: works for any Comparable type
    static <T extends Comparable<T>> T maxOf(Collection<? extends T> items) {
        Iterator<? extends T> it = items.iterator();
        if (!it.hasNext()) throw new NoSuchElementException("empty collection");
        T best = it.next();
        while (it.hasNext()) {
            T next = it.next();
            if (next.compareTo(best) > 0) best = next;
        }
        return best;
    }

    // PECS: produce from src (? extends), consume into dst (? super)
    static <T> void copyAll(Collection<? extends T> src, Collection<? super T> dst) {
        for (T t : src) dst.add(t);
    }

    public static void main(String[] args) {
        InMemoryRepository<Product, String> repo = new InMemoryRepository<>(Product::sku);
        repo.save(new Product("SKU-101", "Wireless Mouse",      "Electronics",  799.0,  40));
        repo.save(new Product("SKU-102", "Mechanical Keyboard", "Electronics", 3499.0,   5));
        repo.save(new Product("SKU-103", "Notebook A5",         "Stationery",   120.0, 300));
        repo.save(new Product("SKU-104", "Gel Pen (Blue)",      "Stationery",    15.0,   2));
        repo.save(new Product("SKU-105", "USB-C Cable",         "Electronics",  299.0,   0));
        repo.save(new Product("SKU-106", "Desk Lamp",           "Home",        1299.0,  12));

        List<Product> all = repo.findAll();
        System.out.println("Total products: " + repo.count());

        // 1. Group by category - TreeMap keeps categories sorted alphabetically
        Map<String, List<Product>> byCategory = new TreeMap<>();
        for (Product p : all) {
            byCategory.computeIfAbsent(p.category(), k -> new ArrayList<>()).add(p);
        }
        byCategory.forEach((cat, list) -> System.out.println(cat + " -> " + list.size() + " items"));

        // 2. Sort by price descending, then by name (Comparator chaining)
        List<Product> byPrice = new ArrayList<>(all);
        byPrice.sort(Comparator.comparingDouble(Product::price).reversed()
                               .thenComparing(Product::name));
        System.out.println("Most expensive: " + byPrice.getFirst().name());   // Java 21 getFirst()
        System.out.println("Cheapest: " + byPrice.getLast().name());

        // 3. Natural ordering (Comparable) through a bounded generic method
        System.out.println("Alphabetically last: " + maxOf(all).name());

        // 4. Low-stock alerts with a PriorityQueue (lowest stock first)
        PriorityQueue<Product> lowStock = new PriorityQueue<>(Comparator.comparingInt(Product::stock));
        for (Product p : all) if (p.stock() < 10) lowStock.offer(p);
        System.out.print("Restock order: ");
        while (!lowStock.isEmpty()) {
            Product p = lowStock.poll();
            System.out.print(p.name() + "(" + p.stock() + ") ");
        }
        System.out.println();

        // 5. Price index with TreeMap: range queries
        TreeMap<Double, String> priceIndex = new TreeMap<>();
        for (Product p : all) priceIndex.put(p.price(), p.name());
        System.out.println("Under Rs.500: " + priceIndex.headMap(500.0, true).values());
        System.out.println("Nearest at/above Rs.1000: " + priceIndex.ceilingEntry(1000.0));

        // 6. Safe removal: drop out-of-stock products
        List<Product> working = new ArrayList<>(all);
        working.removeIf(p -> p.stock() == 0);
        System.out.println("After removing out-of-stock: " + working.size());

        // 7. Unique categories, insertion order preserved
        Set<String> categories = new LinkedHashSet<>();
        for (Product p : all) categories.add(p.category());
        System.out.println("Categories: " + categories);

        // 8. PECS in action: List<Product> -> List<Object>
        List<Object> sink = new ArrayList<>();
        copyAll(working, sink);
        System.out.println("Copied " + sink.size() + " products into List<Object>");

        // 9. The repository's snapshot is immutable
        try {
            all.add(null);
        } catch (UnsupportedOperationException e) {
            System.out.println("findAll() returns an immutable list - modification rejected");
        }

        // 10. Optional-based lookup
        System.out.println(repo.findById("SKU-103").map(Product::name).orElse("not found"));
        System.out.println(repo.findById("SKU-999").map(Product::name).orElse("not found"));
    }
}

/* Expected output:
Total products: 6
Electronics -> 3 items
Home -> 1 items
Stationery -> 2 items
Most expensive: Mechanical Keyboard
Cheapest: Gel Pen (Blue)
Alphabetically last: Wireless Mouse
Restock order: USB-C Cable(0) Gel Pen (Blue)(2) Mechanical Keyboard(5)
Under Rs.500: [Gel Pen (Blue), Notebook A5, USB-C Cable]
Nearest at/above Rs.1000: 1299.0=Desk Lamp
After removing out-of-stock: 5
Categories: [Electronics, Stationery, Home]
Copied 5 products into List<Object>
findAll() returns an immutable list - modification rejected
Notebook A5
not found
*/`
    },
    {
      heading: "19. Summary",
      content: `• The **Java Collections Framework** separates interfaces (\`List\`, \`Set\`, \`Queue\`, \`Deque\`, \`Map\`) from implementations; always program to the interface.
• **\`ArrayList\`** is the default list (array-backed, O(1) index access, grows by 1.5×); \`LinkedList\` rarely wins. Use **\`ArrayDeque\`** for stacks and queues, never \`Stack\` or \`Vector\`.
• **\`HashSet\`/\`HashMap\`** give O(1) average operations but no order; **\`LinkedHashSet\`/\`LinkedHashMap\`** keep insertion (or access) order; **\`TreeSet\`/\`TreeMap\`** keep elements sorted with O(log n) operations and range queries like \`floor\`, \`ceiling\`, \`headMap\`.
• **HashMap internals:** 16 buckets, load factor 0.75, hash spread with \`h ^ (h >>> 16)\`, index \`(n-1) & hash\`, chains treeify at 8 nodes when the table has 64+ buckets, table doubles on resize. Keys must honour the \`equals\`/\`hashCode\` contract and should be immutable.
• **\`PriorityQueue\`** is a binary heap: \`poll\` gives the smallest, iteration is not sorted.
• **Java 21 sequenced collections** add \`getFirst\`, \`getLast\`, \`addFirst\`, \`addLast\`, \`removeFirst\`, \`removeLast\` and the live \`reversed()\` view to lists, deques, linked and sorted sets and maps.
• **\`List.of\`/\`Set.of\`/\`Map.of\`** (Java 9) create immutable collections that reject nulls and duplicates; \`List.copyOf\` (Java 10) snapshots; \`Collections.unmodifiableList\` is a view; \`Stream.toList()\` (Java 16) is unmodifiable.
• **\`Comparable\`** defines one natural order inside the class; **\`Comparator\`** defines external orders, composed with \`comparing\`, \`thenComparing\`, \`reversed\`, \`nullsLast\`. Never subtract to compare.
• Never remove inside a for-each loop; use **\`removeIf\`** or **\`Iterator.remove()\`**. Concurrent collections have weakly consistent iterators.
• **Generics** give compile-time type safety: generic classes and methods, **bounded types** (\`<T extends Comparable<T>>\`), **wildcards** following **PECS** (\`? extends\` to read, \`? super\` to write), and **type erasure**, which explains why \`new T()\`, \`T[]\` and \`instanceof List<String>\` are impossible.
**Next lecture:** Lambdas, Functional Interfaces & the Streams API`
    }
  ]
};
