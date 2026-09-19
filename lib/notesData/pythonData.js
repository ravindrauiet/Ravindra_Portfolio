export const pythonData = {
  id: "python",
  slug: "python",
  name: "Python",
  icon: "fab fa-python",
  iconColor: "#3776ab",
  badge: "Backend & Data Science",
  description: "Learn Python 3.12+, Data Structures, Decorators, Generators, Asyncio, FastAPIs, and Automation Scripts.",
  totalLectures: 1,
  lectures: [
    {
      slug: "lecture-1",
      number: 1,
      title: "Python Essentials, Data Structures & Object-Oriented Design",
      summary: "Master lists, dicts, tuples, sets, list comprehensions, decorators, context managers, and OOP design patterns.",
      readTime: "11 min read",
      difficulty: "Beginner",
      date: "2026-09-19",
      sections: [
        {
          heading: "1. Why Python for Modern Development?",
          content: `Python is a high-level, interpreted, dynamically typed programming language known for clean syntax, high readability, and a massive ecosystem of libraries (FastAPI, Django, NumPy, Pandas, PyTorch, Scikit-learn).`
        },
        {
          heading: "2. Built-in Data Structures & List Comprehensions",
          content: `Python provides 4 core built-in data structures:
• **List**: Ordered, mutable collection (\`[1, 2, 3]\`).
• **Tuple**: Ordered, immutable sequence (\`(10, 20)\`).
• **Dictionary**: Key-value pairs for O(1) average hash lookups (\`{"name": "Ravindra"}\`).
• **Set**: Unordered collection of unique elements (\`{1, 2, 3}\`).`,
          codeSnippet: `# Pythonic Code: List Comprehensions & Decorators
import time

def timer_decorator(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"[{func.__name__}] executed in {end - start:.4f}s")
        return result
    return wrapper

@timer_decorator
def process_data(numbers):
    # Filter even numbers and compute squares using list comprehension
    return [num ** 2 for num in numbers if num % 2 == 0]

data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
squares = process_data(data)
print("Squares:", squares)`
        },
        {
          heading: "3. Context Managers (\`with\` statement)",
          content: `Context managers guarantee resource cleanup (e.g. opening files, managing database connections, acquiring locks) even if exceptions are raised.`
        }
      ]
    }
  ]
};
