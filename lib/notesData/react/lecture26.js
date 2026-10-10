export const lecture26 = {
  slug: "lecture-26",
  number: 26,
  title: "Complete React Course — Module 9: Lecture 26: Testing React Applications — Vitest, React Testing Library & MSW",
  summary: "A complete guide to testing React applications: the testing pyramid, Vitest setup with jsdom in a Vite project, React Testing Library queries (getByRole first), user-event, async tests with findBy and waitFor, renderHook, mocking APIs with MSW, snapshot caveats, accessibility tests and Playwright E2E.",
  readTime: "52 min read",
  difficulty: "Advanced",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. Why Testing React Applications Matters and the Testing Pyramid",
      content: `In the previous lecture you learned to manage global state with Zustand and Redux Toolkit. Your apps are now big enough that a change in one file can silently break a screen three folders away. **Automated tests** are how professional teams change code with confidence: you describe the behaviour you expect once, and the computer re-checks it in seconds on every commit.
Testing a React application is not about proving the code has no bugs. It is about three practical outcomes:
• **Fast feedback** — a test suite tells you in 10 seconds what manual clicking would take 20 minutes to find.
• **Safe refactoring** — when you rename a component, switch from Redux to Zustand or upgrade React, green tests tell you nothing visible changed.
• **Living documentation** — a test named "shows an error when the OTP is wrong" explains the feature better than most comments.
The **testing pyramid** is the classic way to think about which tests to write and how many:
• **Unit tests (base, many)** — test one function or hook in isolation: a price formatter, a \`useDebounce\` hook, a reducer. They run in about 1–5 ms each.
• **Integration tests (middle)** — render a real component tree with React Testing Library, click buttons, type into inputs and assert what the user sees. The network is mocked with MSW. Each takes roughly 50–300 ms.
• **End-to-end tests (top, few)** — drive a real browser with Playwright against the real app: log in, add to cart, pay. Each takes 2–10 seconds and depends on servers being up, so you keep only a handful of critical journeys.
For React specifically, the community (following Kent C. Dodds' "testing trophy") leans heavily on the **integration layer**: tests that render components the way a user experiences them give the best confidence per minute of effort. That is why most of this lecture is about React Testing Library.
**Guiding principle for the whole lecture:** "The more your tests resemble the way your software is used, the more confidence they can give you." Test behaviour the user can see, not implementation details like state variables or method names.`
    },
    {
      heading: "2. Setting Up Vitest with jsdom in a Vite Project",
      content: `**Vitest** is the test runner built for Vite. It reuses your \`vite.config.js\` (same plugins, aliases and JSX transform), supports ES modules natively, runs tests in parallel workers and has a Jest-compatible API (\`describe\`, \`it\`, \`expect\`, \`vi.fn\`). If you have used Jest, 95% of what you know transfers directly. Create React App shipped Jest, but CRA is deprecated; in a Vite project Vitest is the standard choice.
Install the test stack as dev dependencies:
• \`vitest\` — the runner.
• \`jsdom\` — a JavaScript implementation of the browser DOM so \`document\` and \`window\` exist in Node. (\`happy-dom\` is a faster alternative with slightly less browser fidelity.)
• \`@testing-library/react\` and \`@testing-library/dom\` — render components and query them like a user. RTL 16 requires \`@testing-library/dom\` as a peer dependency, so install both.
• \`@testing-library/jest-dom\` — custom matchers such as \`toBeInTheDocument()\` and \`toBeDisabled()\`.
• \`@testing-library/user-event\` — realistic user interactions.
Configuration lives in the \`test\` block of \`vite.config.js\`. Three settings matter most:
• \`environment: "jsdom"\` — gives every test file a DOM.
• \`globals: true\` — makes \`describe\`, \`it\`, \`expect\`, \`vi\` available without imports. It also lets React Testing Library register its automatic \`afterEach(cleanup)\`, so each test starts with an empty DOM. Without globals you must call \`cleanup\` yourself.
• \`setupFiles\` — a file that runs before every test file; this is where you import the jest-dom matchers and later start the MSW server.
Run \`npx vitest\` for watch mode (it reruns only the tests affected by the file you just saved) or \`npx vitest run\` for a single pass in CI. Add \`--coverage\` after installing \`@vitest/coverage-v8\` to get a line/branch coverage report. Newer Vitest versions also offer a Browser Mode that runs the same tests in a real Chromium instead of jsdom; jsdom remains the simplest, fastest default for component tests.`,
      codeSnippet: `# terminal — inside a Vite + React project
npm install -D vitest jsdom @testing-library/react @testing-library/dom \\
  @testing-library/jest-dom @testing-library/user-event @vitest/coverage-v8

// vite.config.js
import { defineConfig } from "vitest/config";   // Vite's defineConfig + "test" typings
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",          // document, window, localStorage exist in tests
    globals: true,                 // describe / it / expect / vi without imports
    setupFiles: "./src/test/setup.js",
    css: false,                    // skip CSS processing; tests run faster
    coverage: { reporter: ["text", "html"], include: ["src/**/*.{js,jsx}"] },
  },
});

// src/test/setup.js — runs before every test file
import "@testing-library/jest-dom/vitest";  // adds toBeInTheDocument(), toHaveTextContent(), ...

// package.json
// "scripts": {
//   "test": "vitest",              // watch mode while developing
//   "test:run": "vitest run",      // single pass for CI
//   "coverage": "vitest run --coverage"
// }

// Expected output of "npm run test:run" once you add tests:
//  ✓ src/components/Counter.test.jsx (3 tests) 42ms
//  Test Files  1 passed (1)
//       Tests  3 passed (3)`
    },
    {
      heading: "3. Your First Component Test with React Testing Library",
      content: `**React Testing Library (RTL)** gives you two things: a \`render()\` function that mounts a component into the jsdom \`document\`, and the \`screen\` object whose query methods find elements the way a user would — by visible text, by label, by accessible role. It deliberately does **not** expose component state, props or instance methods, which is exactly what keeps tests honest.
A test file sits next to the component it tests (\`Counter.jsx\` and \`Counter.test.jsx\`) and follows the **Arrange – Act – Assert** pattern:
1. **Arrange** — \`render(<Counter />)\`.
2. **Act** — the user does something (we will use \`user-event\` in a later section).
3. **Assert** — \`expect(screen.getByText("Count: 1")).toBeInTheDocument()\`.
A few conventions to adopt from day one:
• Name tests as behaviour: \`it("increments when the + button is clicked")\`, not \`it("calls setCount")\`.
• One behaviour per test. Three short tests fail with three clear messages; one long test fails with one vague message.
• Use \`screen\` instead of destructuring queries from \`render()\`; it reads better and always targets the full document.
• When a query fails, RTL prints the current DOM in the error, so you can see what actually rendered. You can also call \`screen.debug()\` anywhere to print it.
jest-dom matchers make assertions read like English: \`toBeInTheDocument()\`, \`toHaveTextContent("Count: 1")\`, \`toBeDisabled()\`, \`toBeVisible()\`, \`toHaveAttribute("href", "/cart")\`, \`toHaveClass("active")\`, \`toHaveValue("Ravindra")\`.`,
      codeSnippet: `// src/components/Counter.jsx
import { useState } from "react";

export default function Counter({ start = 0, max = 10 }) {
  const [count, setCount] = useState(start);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)} disabled={count >= max}>
        Increment
      </button>
      <button onClick={() => setCount(start)}>Reset</button>
    </div>
  );
}

// src/components/Counter.test.jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Counter from "./Counter";

describe("Counter", () => {
  it("renders the starting count", () => {
    render(<Counter start={5} />);                              // Arrange
    expect(screen.getByText("Count: 5")).toBeInTheDocument();   // Assert
  });

  it("increments when the Increment button is clicked", async () => {
    const user = userEvent.setup();
    render(<Counter />);
    await user.click(screen.getByRole("button", { name: "Increment" }));  // Act
    expect(screen.getByText("Count: 1")).toBeInTheDocument();
  });

  it("disables Increment at the maximum", async () => {
    const user = userEvent.setup();
    render(<Counter start={9} max={10} />);
    const button = screen.getByRole("button", { name: "Increment" });
    await user.click(button);
    expect(screen.getByText("Count: 10")).toBeInTheDocument();
    expect(button).toBeDisabled();
  });
});

// Output:
//  ✓ Counter > renders the starting count
//  ✓ Counter > increments when the Increment button is clicked
//  ✓ Counter > disables Increment at the maximum`
    },
    {
      heading: "4. React Testing Library Queries: getByRole Priority and When to Use Each",
      content: `Every RTL query has three forms, and choosing the right one is half of writing a good test:
• **\`getBy...\`** — returns the element or **throws immediately** if it is missing (or if more than one matches). Use when the element must be there right now.
• **\`queryBy...\`** — returns the element or **\`null\`**. Use only to assert that something is **absent**: \`expect(screen.queryByText("Error")).not.toBeInTheDocument()\`.
• **\`findBy...\`** — returns a **Promise** that resolves when the element appears (polling for up to 1000 ms by default). Use for anything that shows up after an async operation.
Each has an \`...AllBy\` variant that returns an array (\`getAllByRole("listitem")\`).
The second choice is **which selector**. RTL publishes a **priority order** that mirrors how real users and assistive technology find things:
1. **\`getByRole\`** — by ARIA role plus accessible name: \`getByRole("button", { name: /add to cart/i })\`. This is the default choice for almost everything: buttons, links, headings, textboxes, checkboxes, comboboxes, dialogs, tables. If \`getByRole\` cannot find your element, that is usually a sign the element is not accessible to screen readers either.
2. **\`getByLabelText\`** — form fields by their \`<label>\` or \`aria-label\`.
3. **\`getByPlaceholderText\`** — acceptable when a field has no label (but it should have one).
4. **\`getByText\`** — non-interactive content such as paragraphs and status messages.
5. **\`getByDisplayValue\`** — inputs by their current value.
6. **\`getByAltText\`** — images.
7. **\`getByTitle\`** — rarely useful.
8. **\`getByTestId\`** — last resort via \`data-testid\`; it says nothing about what the user sees.
Useful \`getByRole\` options: \`name\` (string or regex), \`level\` for headings (\`{ level: 2 }\` is an \`<h2>\`), \`checked\`, \`pressed\`, \`expanded\`, \`selected\`, and \`hidden: true\` to include elements hidden from the accessibility tree.
When you are unsure what role an element has, call \`screen.logRoles(container)\` or paste the DOM into the Testing Playground browser extension, which suggests the best query for any element you click.`,
      codeSnippet: `// src/components/LoginForm.jsx
export default function LoginForm({ onSubmit, error }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(new FormData(e.currentTarget)); }}>
      <h2>Sign in to PayKart</h2>
      <label htmlFor="mobile">Mobile number</label>
      <input id="mobile" name="mobile" type="tel" placeholder="98xxxxxxxx" />
      <label>
        <input type="checkbox" name="remember" /> Remember me
      </label>
      {error && <p role="alert">{error}</p>}
      <button type="submit">Send OTP</button>
      <a href="/help">Need help?</a>
    </form>
  );
}

// src/components/LoginForm.queries.test.jsx — one query of each kind
import { render, screen } from "@testing-library/react";
import LoginForm from "./LoginForm";

it("exposes every element through accessible queries", () => {
  render(<LoginForm onSubmit={() => {}} error="Invalid number" />);

  screen.getByRole("heading", { level: 2, name: "Sign in to PayKart" });
  screen.getByRole("textbox", { name: "Mobile number" });     // type="tel" has role textbox
  screen.getByLabelText("Mobile number");                      // same element, by label
  screen.getByRole("checkbox", { name: "Remember me" });
  screen.getByRole("button", { name: /send otp/i });           // regex: case-insensitive
  screen.getByRole("link", { name: "Need help?" });
  screen.getByRole("alert");                                   // the error paragraph
  screen.getByText("Invalid number");

  expect(screen.queryByText("Welcome back")).not.toBeInTheDocument(); // absence check
  expect(screen.getAllByRole("textbox")).toHaveLength(1);
});

// Typical failure message when a query misses — RTL prints the DOM:
// TestingLibraryElementError: Unable to find an accessible element with the role "button"
// and name "Login"
// Here are the accessible roles:
//   button: Name "Send OTP"  <button type="submit" />`
    },
    {
      heading: "5. Simulating Real Users with user-event",
      content: `RTL ships a low-level \`fireEvent\` that dispatches a single DOM event. Real users do not dispatch single events: a click is \`pointerdown\`, \`mousedown\`, \`focus\`, \`pointerup\`, \`mouseup\`, \`click\`; typing "Ravi" fires \`keydown\`, \`keypress\`, \`input\` and \`keyup\` four times and moves the selection. The **\`@testing-library/user-event\`** package reproduces that full sequence, which means it catches bugs \`fireEvent\` misses, such as a button that is \`disabled\` (user-event refuses to click it, exactly like a browser) or an input that blocks certain keys.
Version 14 of user-event has one rule: **call \`userEvent.setup()\` once per test and \`await\` every interaction.** The returned \`user\` object keeps track of keyboard state and the pointer position between calls, so a \`Shift+Tab\` after a click behaves correctly.
The methods you will use daily:
• \`user.click(el)\`, \`user.dblClick(el)\`, \`user.hover(el)\` / \`user.unhover(el)\`.
• \`user.type(input, "hello")\` — types character by character (appending to any existing value); \`user.clear(input)\` first if needed.
• \`user.keyboard("{Enter}")\` and \`user.keyboard("{Control>}a{/Control}")\` for special keys and chords.
• \`user.tab()\` — move focus like a keyboard user; essential for accessibility tests.
• \`user.selectOptions(select, "mumbai")\` for \`<select>\`; \`user.upload(input, file)\` for file inputs; \`user.paste("text")\`.
If your component uses \`setTimeout\` or debouncing and you switch Vitest to fake timers, user-event's internal delays would hang. Wire them together with \`userEvent.setup({ advanceTimers: vi.advanceTimersByTime })\`.
Use \`fireEvent\` only for events user-event does not model, such as \`fireEvent.scroll\` or a raw \`fireEvent.change\` on a hidden input.`,
      codeSnippet: `// src/components/AddressForm.test.jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddressForm from "./AddressForm";   // fields: Full name, City (select), PIN code, Save

it("submits the address the user typed", async () => {
  const user = userEvent.setup();
  const onSave = vi.fn();                             // Vitest mock function
  render(<AddressForm onSave={onSave} />);

  await user.type(screen.getByLabelText("Full name"), "Priya Sharma");
  await user.selectOptions(screen.getByLabelText("City"), "pune");
  const pin = screen.getByLabelText("PIN code");
  await user.type(pin, "4110");
  await user.clear(pin);                              // user changes their mind
  await user.type(pin, "411001");
  await user.keyboard("{Enter}");                     // submit with the keyboard

  expect(onSave).toHaveBeenCalledTimes(1);
  expect(onSave).toHaveBeenCalledWith({
    fullName: "Priya Sharma",
    city: "pune",
    pin: "411001",
  });
});

it("moves focus in a sensible order for keyboard users", async () => {
  const user = userEvent.setup();
  render(<AddressForm onSave={() => {}} />);

  await user.tab();
  expect(screen.getByLabelText("Full name")).toHaveFocus();
  await user.tab();
  expect(screen.getByLabelText("City")).toHaveFocus();
});

it("does not call onSave when the button is disabled", async () => {
  const user = userEvent.setup();
  const onSave = vi.fn();
  render(<AddressForm onSave={onSave} />);          // empty form => Save is disabled
  await user.click(screen.getByRole("button", { name: "Save" }));
  expect(onSave).not.toHaveBeenCalled();             // fireEvent.click would have fired it
});`
    },
    {
      heading: "6. Testing Async Behaviour: findBy, waitFor and Mocking Modules",
      content: `Most interesting components do something asynchronous: fetch data, debounce a search, show a toast that disappears. Three RTL tools cover these cases:
• **\`findBy...\`** — the combination of \`getBy\` and \`waitFor\`. \`await screen.findByText("Ravindra")\` keeps checking the DOM every 50 ms until the text appears or 1000 ms pass, then fails with a readable message. It is the right tool for "something will appear".
• **\`waitFor(callback)\`** — retries any assertion until it passes: \`await waitFor(() => expect(onSave).toHaveBeenCalled())\`. Use it for assertions that are not about a DOM element. Keep exactly one assertion inside the callback; multiple assertions make failures harder to read, and side effects inside \`waitFor\` run many times.
• **\`waitForElementToBeRemoved(() => screen.queryByText("Loading…"))\`** — for "something will disappear".
Both \`findBy\` and \`waitFor\` accept \`{ timeout: 3000 }\` if an operation is genuinely slow, but a well-mocked test rarely needs more than the default.
What about the **\`act()\` warning**? RTL wraps \`render\`, user-event and \`findBy\` in \`act()\` for you. If you see "An update to X was not wrapped in act(...)", it almost always means a state update happened **after** your test finished, and the fix is to await the final UI state with \`findBy\` rather than wrapping things in \`act\` manually.
For data that comes from a module rather than the network, Vitest's **\`vi.mock("./path")\`** replaces every export of that module with mock functions, hoisted above the imports. Combine it with \`vi.mocked(fn).mockResolvedValue(...)\` for success and \`mockRejectedValue(new Error("Network"))\` for failure. For network calls themselves, prefer MSW (section 8), which tests your real fetch code.
For timers, \`vi.useFakeTimers()\` lets you jump ahead with \`vi.advanceTimersByTime(500)\` instead of waiting half a second. Always restore with \`vi.useRealTimers()\` in \`afterEach\`.`,
      codeSnippet: `// src/components/UserBadge.jsx
import { useEffect, useState } from "react";
import { getUser } from "../api/users";

export default function UserBadge({ id }) {
  const [state, setState] = useState({ status: "loading" });
  useEffect(() => {
    let cancelled = false;
    getUser(id)
      .then((user) => !cancelled && setState({ status: "ok", user }))
      .catch((err) => !cancelled && setState({ status: "error", message: err.message }));
    return () => { cancelled = true; };
  }, [id]);

  if (state.status === "loading") return <p>Loading…</p>;
  if (state.status === "error") return <p role="alert">Could not load user: {state.message}</p>;
  return <p>Hello, {state.user.name} from {state.user.city}</p>;
}

// src/components/UserBadge.test.jsx
import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import UserBadge from "./UserBadge";
import { getUser } from "../api/users";

vi.mock("../api/users");                 // every export becomes vi.fn() (hoisted)

afterEach(() => vi.resetAllMocks());

it("shows the user after loading", async () => {
  vi.mocked(getUser).mockResolvedValue({ name: "Ravindra", city: "Delhi" });
  render(<UserBadge id={7} />);

  expect(screen.getByText("Loading…")).toBeInTheDocument();           // sync: present now
  expect(await screen.findByText(/hello, ravindra/i)).toBeInTheDocument(); // async: appears later
  expect(screen.queryByText("Loading…")).not.toBeInTheDocument();
  expect(getUser).toHaveBeenCalledWith(7);
});

it("shows an error message when the request fails", async () => {
  vi.mocked(getUser).mockRejectedValue(new Error("Network down"));
  render(<UserBadge id={7} />);

  await waitForElementToBeRemoved(() => screen.queryByText("Loading…"));
  expect(screen.getByRole("alert")).toHaveTextContent("Could not load user: Network down");
});`
    },
    {
      heading: "7. Testing Custom Hooks with renderHook",
      content: `A custom hook cannot be called outside a component, so you cannot unit-test it like a plain function. RTL's **\`renderHook\`** (exported from \`@testing-library/react\` since v13.1) creates a tiny invisible component that calls your hook and gives you back \`result.current\` — the latest return value.
The pattern:
1. \`const { result, rerender, unmount } = renderHook(() => useCounter(5))\`.
2. Read values through \`result.current\` (never destructure once at the top; the object is replaced on every render, and a stale copy would hide updates).
3. Trigger updates inside \`act(() => result.current.increment())\` so React flushes the state change before you assert.
4. \`rerender(newProps)\` re-runs the hook with different arguments; \`unmount()\` runs cleanup effects.
Hooks that depend on context (a router, a store, TanStack Query) take a \`wrapper\` option: \`renderHook(() => useCart(), { wrapper: ({ children }) => <CartProvider>{children}</CartProvider> })\`.
Hooks with timers, like \`useDebounce\`, pair naturally with Vitest's fake timers: advance 300 ms inside \`act\` and assert the debounced value changed.
**When should you test a hook directly?** When it is reused by several components or holds non-trivial logic (pagination maths, retry rules, form validation). When a hook is used by exactly one component, test the component instead; its behaviour is what matters and the hook gets covered on the way.`,
      codeSnippet: `// src/hooks/useCounter.js
import { useCallback, useState } from "react";
export function useCounter(initial = 0, step = 1) {
  const [count, setCount] = useState(initial);
  const increment = useCallback(() => setCount((c) => c + step), [step]);
  const reset = useCallback(() => setCount(initial), [initial]);
  return { count, increment, reset };
}

// src/hooks/useDebounce.js
import { useEffect, useState } from "react";
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

// src/hooks/hooks.test.js
import { renderHook, act } from "@testing-library/react";
import { useCounter } from "./useCounter";
import { useDebounce } from "./useDebounce";

describe("useCounter", () => {
  it("increments by the given step", () => {
    const { result } = renderHook(() => useCounter(10, 5));
    expect(result.current.count).toBe(10);
    act(() => result.current.increment());
    act(() => result.current.increment());
    expect(result.current.count).toBe(20);
  });

  it("uses the new initial value after rerender + reset", () => {
    const { result, rerender } = renderHook(({ initial }) => useCounter(initial), {
      initialProps: { initial: 1 },
    });
    rerender({ initial: 100 });
    act(() => result.current.reset());
    expect(result.current.count).toBe(100);
  });
});

describe("useDebounce", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("updates only after the delay", () => {
    const { result, rerender } = renderHook(({ v }) => useDebounce(v, 300), {
      initialProps: { v: "r" },
    });
    rerender({ v: "ra" });
    rerender({ v: "rav" });
    expect(result.current).toBe("r");            // still the old value
    act(() => vi.advanceTimersByTime(299));
    expect(result.current).toBe("r");
    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe("rav");          // settled 300 ms after the last change
  });
});`
    },
    {
      heading: "8. Mocking Network Requests with MSW (Mock Service Worker)",
      content: `Mocking \`fetch\` or axios with \`vi.fn\` works, but it tests a fake: your real request code (URL building, headers, JSON parsing, error branches) never runs. **Mock Service Worker (MSW)** fixes this by intercepting requests at the network layer. Your component calls the real \`fetch\`; MSW answers with the response you defined. The same handlers also run in the browser (as a Service Worker) during development and in Storybook, so one set of mocks serves three purposes.
MSW 2 API, the parts you need:
• **Handlers** — \`http.get("https://api.paykart.in/products", () => HttpResponse.json([...]))\`. \`http.post\` handlers can read the body with \`await request.json()\`; path params come from \`params\`; query strings from \`new URL(request.url).searchParams\`.
• **Server for Node/jsdom** — \`setupServer(...handlers)\` from \`msw/node\`. In \`setup.js\`: \`beforeAll(() => server.listen({ onUnhandledRequest: "error" }))\`, \`afterEach(() => server.resetHandlers())\`, \`afterAll(() => server.close())\`. The \`"error"\` option makes any request you forgot to mock fail the test loudly instead of hanging.
• **Per-test overrides** — \`server.use(http.get(url, () => HttpResponse.json({ message: "Server error" }, { status: 500 })))\` inside a test; \`resetHandlers()\` in \`afterEach\` removes it afterwards so tests stay independent.
• **Realism helpers** — \`delay(200)\` to simulate latency (good for testing loading states), \`HttpResponse.error()\` for a network failure, \`passthrough()\` to let a request hit the real server.
One practical gotcha: in a Node test environment, \`fetch("/api/products")\` with a **relative URL throws "Invalid URL"** because there is no page origin. Build URLs from a base such as \`import.meta.env.VITE_API_URL\` (set in \`.env.test\`), or write handlers like \`http.get("*/api/products", ...)\` and give your fetch helper an absolute base in tests.
Keep the default handlers in \`src/mocks/handlers.js\` describing the **happy path**, and override only the failure cases inside the tests that need them.`,
      codeSnippet: `# terminal
npm install -D msw

// src/mocks/handlers.js — shared by tests, dev server and Storybook
import { http, HttpResponse, delay } from "msw";

export const API = "https://api.paykart.in";

export const products = [
  { id: 1, name: "Wireless Mouse", price: 899, city: "Delhi" },
  { id: 2, name: "Mechanical Keyboard", price: 3499, city: "Pune" },
];

export const handlers = [
  http.get(API + "/products", ({ request }) => {
    const q = new URL(request.url).searchParams.get("q") ?? "";
    return HttpResponse.json(products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase())));
  }),
  http.get(API + "/products/:id", ({ params }) => {
    const product = products.find((p) => p.id === Number(params.id));
    return product ? HttpResponse.json(product) : HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),
  http.post(API + "/cart", async ({ request }) => {
    const body = await request.json();
    await delay(100);                                   // simulate latency
    return HttpResponse.json({ ok: true, items: [body] }, { status: 201 });
  }),
];

// src/mocks/server.js
import { setupServer } from "msw/node";
import { handlers } from "./handlers";
export const server = setupServer(...handlers);

// src/test/setup.js — add MSW lifecycle
import "@testing-library/jest-dom/vitest";
import { server } from "../mocks/server";
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());               // drop per-test overrides
afterAll(() => server.close());

// src/components/ProductDetail.test.jsx — override for the error case
import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/server";
import { API } from "../mocks/handlers";
import ProductDetail from "./ProductDetail";   // fetches API + "/products/" + id

it("renders a product from the API", async () => {
  render(<ProductDetail id={2} />);
  expect(await screen.findByRole("heading", { name: "Mechanical Keyboard" })).toBeInTheDocument();
  expect(screen.getByText("₹3,499")).toBeInTheDocument();
});

it("shows an error when the server fails", async () => {
  server.use(
    http.get(API + "/products/:id", () =>
      HttpResponse.json({ message: "Server error" }, { status: 500 })
    )
  );
  render(<ProductDetail id={2} />);
  expect(await screen.findByRole("alert")).toHaveTextContent(/server error/i);
});`
    },
    {
      heading: "9. Testing Components That Need Providers: Router, TanStack Query and Zustand",
      content: `Real components rarely render in a vacuum. A page uses \`useNavigate\` from React Router, \`useQuery\` from TanStack Query, a Zustand store and maybe a theme context. Rendering such a component bare throws errors like "useNavigate() may be used only in the context of a <Router>". The fix is a **custom render** function in \`src/test/test-utils.jsx\` that wraps the component in every provider the app uses, then re-exports everything from RTL so tests import from one place.
Provider-specific rules:
• **React Router v7** — wrap in \`<MemoryRouter initialEntries={["/products/2"]}>\` (imported from \`react-router\`). Memory history needs no browser URL bar. If the app uses a data router (\`createBrowserRouter\`), create a \`createMemoryRouter\` with the same routes in tests and render \`<RouterProvider router={router} />\`.
• **TanStack Query v5** — create a **fresh \`QueryClient\` per test** so cached data from one test never leaks into the next, and set \`retry: false\` so a failing request fails immediately instead of retrying three times with exponential backoff (which would blow past the 1000 ms \`findBy\` timeout).
• **Zustand v5** — stores are module singletons, so state survives between tests. Capture \`useStore.getInitialState()\` or the initial object and reset it in \`afterEach\` with \`useStore.setState(initialState, true)\`. Test store logic directly with \`useStore.getState().addItem(...)\` when you want a pure unit test.
• **Redux Toolkit 2** — build a fresh \`configureStore({ reducer, preloadedState })\` inside the custom render and pass it through \`<Provider>\`; accept \`preloadedState\` as a render option so tests can start from any state.
This wrapper is also the place to pass \`route\` or \`user\` options that most tests need. Returning \`user: userEvent.setup()\` from the custom render saves one line in every test.`,
      codeSnippet: `// src/test/test-utils.jsx
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCartStore } from "../store/cartStore";   // Zustand store

const initialCart = useCartStore.getState();          // snapshot of initial store state

export function renderWithProviders(ui, { route = "/", preloadedCart } = {}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  if (preloadedCart) useCartStore.setState(preloadedCart);

  function Wrapper({ children }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </QueryClientProvider>
    );
  }
  return { user: userEvent.setup(), ...render(ui, { wrapper: Wrapper }) };
}

export function resetStores() {
  useCartStore.setState(initialCart, true);           // true = replace, not merge
}

export * from "@testing-library/react";              // screen, within, waitFor, ...

// src/pages/CartPage.test.jsx
import { screen } from "../test/test-utils";
import { renderWithProviders, resetStores } from "../test/test-utils";
import CartPage from "./CartPage";

afterEach(resetStores);

it("shows the total for items already in the cart", () => {
  renderWithProviders(<CartPage />, {
    route: "/cart",
    preloadedCart: { items: [{ id: 1, name: "Wireless Mouse", price: 899, qty: 2 }] },
  });
  expect(screen.getByText("Total: ₹1,798")).toBeInTheDocument();
});

it("navigates to checkout", async () => {
  const { user } = renderWithProviders(<CartPage />, { route: "/cart" });
  await user.click(screen.getByRole("link", { name: /checkout/i }));
  expect(await screen.findByRole("heading", { name: /checkout/i })).toBeInTheDocument();
});`
    },
    {
      heading: "10. Snapshot Testing in React: When It Helps and Its Caveats",
      content: `A **snapshot test** serialises a rendered component to a string and stores it in a \`__snapshots__\` folder (or inline in the test with \`toMatchInlineSnapshot()\`). On the next run the output is compared character by character; any difference fails the test and \`vitest -u\` rewrites the snapshot.
It sounds like free coverage, and that is exactly the problem. In practice snapshot tests have well-known caveats:
• **They test "did anything change?", not "is it correct?"** The first snapshot is recorded without anyone verifying it; a bug present on day one is locked in as the expected output.
• **They break on every unrelated change.** Add a CSS class, change the wrapper \`div\`, upgrade a UI library — dozens of snapshots fail with no information about whether behaviour changed.
• **Developers stop reading them.** When \`-u\` is pressed reflexively, the test protects nothing. A snapshot of 400 lines of markup is not something anyone reviews in a pull request.
• **They couple tests to markup**, the exact implementation detail RTL tries to avoid.
Where snapshots **do** earn their place:
• Small, stable, data-driven output: the string a formatter returns, a generated email subject, a serialised Redux state after a sequence of actions.
• \`toMatchInlineSnapshot()\` for short values, so the expected output sits right in the test and is reviewed like any assertion.
• Error messages and accessibility trees (\`prettyDOM\` of a small element) where you want to catch any regression.
Rule of thumb: if the snapshot is longer than about 20 lines, replace it with explicit assertions on the things that matter (\`getByRole\`, \`toHaveTextContent\`). Prefer behaviour assertions for components and reserve snapshots for serialisable values.`,
      codeSnippet: `// src/utils/formatPrice.test.js — a GOOD snapshot: short, stable, reviewed inline
import { formatPrice } from "./formatPrice";

it("formats rupees with Indian digit grouping", () => {
  expect(formatPrice(1234567.5)).toMatchInlineSnapshot('"₹12,34,567.50"');
  expect([0, 999, 100000].map(formatPrice)).toMatchInlineSnapshot(\`
    [
      "₹0.00",
      "₹999.00",
      "₹1,00,000.00",
    ]
  \`);
});

// src/components/PriceTag.test.jsx — a QUESTIONABLE snapshot: whole markup
import { render } from "@testing-library/react";
import PriceTag from "./PriceTag";

it("matches the stored snapshot", () => {
  const { container } = render(<PriceTag amount={899} discount={10} />);
  expect(container.firstChild).toMatchSnapshot();   // breaks on any class/markup edit
});

// Better: assert the behaviour the user cares about
import { screen } from "@testing-library/react";
it("shows the discounted price and the original struck through", () => {
  render(<PriceTag amount={899} discount={10} />);
  expect(screen.getByText("₹809.10")).toBeInTheDocument();
  expect(screen.getByText("₹899.00")).toHaveStyle({ textDecoration: "line-through" });
});

// Update stale snapshots on purpose (after reviewing the diff):
//   npx vitest run -u`
    },
    {
      heading: "11. Accessibility-Driven Tests with vitest-axe and Keyboard Checks",
      content: `Because RTL queries work through the accessibility tree, writing tests with \`getByRole\` and \`getByLabelText\` already pushes you towards accessible markup: an icon-only button with no accessible name is impossible to query, so you add \`aria-label\`, and the fix helps screen-reader users too. You can go one step further and make **accessibility (a11y) an explicit test target**.
Three layers of accessibility-driven testing:
1. **Automated rule checks with axe-core.** The \`vitest-axe\` package (a port of \`jest-axe\`) runs the axe engine over a rendered container and reports violations such as missing form labels, images without \`alt\`, insufficient colour contrast (when styles are available) and invalid ARIA attributes. One \`expect(await axe(container)).toHaveNoViolations()\` per page component catches roughly 30–40% of WCAG issues automatically. Import its matchers in \`setup.js\` with \`import * as matchers from "vitest-axe/matchers"; expect.extend(matchers);\`.
2. **Accessible-name and state assertions.** jest-dom gives \`toHaveAccessibleName("Close dialog")\`, \`toHaveAccessibleDescription()\`, \`toBeRequired()\`, \`toHaveAttribute("aria-expanded", "true")\`. Use them for custom widgets like dropdowns and tabs where the ARIA state is the behaviour.
3. **Keyboard journeys.** Everything a mouse user can do must be possible with a keyboard. Test with \`user.tab()\`, \`user.keyboard("{Escape}")\` and \`toHaveFocus()\`: a modal must trap focus and return it to the trigger when closed; a menu must open with Enter and close with Escape.
Automated checks do not replace manual testing with a screen reader, but they stop regressions: once the "Buy now" button has a name, no future refactor can silently remove it.`,
      codeSnippet: `# terminal
npm install -D vitest-axe axe-core

// src/test/setup.js — add the axe matchers
import "@testing-library/jest-dom/vitest";
import * as axeMatchers from "vitest-axe/matchers";
expect.extend(axeMatchers);

// src/components/ProductCard.a11y.test.jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import ProductCard from "./ProductCard";

const product = { id: 1, name: "Wireless Mouse", price: 899, image: "/mouse.jpg" };

it("has no detectable accessibility violations", async () => {
  const { container } = render(<ProductCard product={product} onAdd={() => {}} />);
  expect(await axe(container)).toHaveNoViolations();
});

it("gives the icon-only wishlist button an accessible name", () => {
  render(<ProductCard product={product} onAdd={() => {}} />);
  expect(screen.getByRole("button", { name: "Add Wireless Mouse to wishlist" })).toBeInTheDocument();
  expect(screen.getByRole("img")).toHaveAccessibleName("Wireless Mouse");
});

it("can be operated entirely with the keyboard", async () => {
  const user = userEvent.setup();
  const onAdd = vi.fn();
  render(<ProductCard product={product} onAdd={onAdd} />);

  await user.tab();                                   // focus the wishlist button
  await user.tab();                                   // focus "Add to cart"
  expect(screen.getByRole("button", { name: /add to cart/i })).toHaveFocus();
  await user.keyboard("{Enter}");
  expect(onAdd).toHaveBeenCalledWith(1);
});

// Example violation report when alt text is missing:
// Expected the HTML found at $('img') to have no violations:
//   "Images must have alternative text (image-alt)"
//   Fix any of the following: Element does not have an alt attribute`
    },
    {
      heading: "12. End-to-End Testing Overview with Playwright",
      content: `Component tests run against jsdom, which has no layout engine, no real network and no browser quirks. For the handful of journeys where a failure costs real money — sign-up, checkout, payment confirmation — you want a **real browser** against the **real app**. **Playwright** is the modern tool for this: it automates Chromium, Firefox and WebKit with one API, auto-waits for elements to be ready (no manual sleeps) and records traces and videos of failures.
Set it up with \`npm init playwright@latest\`, which creates \`playwright.config.js\` and a \`tests/\` or \`e2e/\` folder. The \`webServer\` option starts your Vite dev server (or a production preview) before the tests and reuses it locally.
Playwright's locators mirror RTL on purpose: \`page.getByRole("button", { name: "Pay ₹1,798" })\`, \`page.getByLabel("UPI ID")\`, \`page.getByText(...)\`, \`page.getByTestId(...)\`. Assertions are **web-first**: \`await expect(page.getByRole("heading")).toHaveText("Order placed")\` retries until it passes or the timeout (5 s by default) expires.
Commands you will use: \`npx playwright test\` (headless, all browsers in the config), \`--ui\` for an interactive runner with time travel, \`--headed\` to watch, \`--debug\` to step through, and \`npx playwright show-report\` to open the HTML report with screenshots and traces of failed runs. \`npx playwright codegen http://localhost:5173\` records your clicks and generates a starting script.
Keep E2E suites small and deterministic: seed a known test account, intercept third-party calls with \`page.route()\` (Playwright's own network mocking) so a payment gateway sandbox outage does not fail your build, and run them in CI on every pull request but with retries set to 1 or 2 to absorb genuine network flakiness. Ten solid E2E tests over ten critical flows beat two hundred fragile ones.`,
      codeSnippet: `# terminal
npm init playwright@latest        # choose JavaScript, folder "e2e", add GitHub Actions workflow

// playwright.config.js
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  retries: process.env.CI ? 2 : 0,
  use: { baseURL: "http://localhost:5173", trace: "on-first-retry" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: { command: "npm run dev", url: "http://localhost:5173", reuseExistingServer: !process.env.CI },
});

// e2e/checkout.spec.js
import { test, expect } from "@playwright/test";

test("a shopper can buy a product with UPI", async ({ page }) => {
  // stub the payment gateway so the test never depends on a sandbox
  await page.route("**/api/payments", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ status: "SUCCESS", orderId: "PK-1001" }) })
  );

  await page.goto("/");
  await page.getByRole("searchbox", { name: "Search products" }).fill("mouse");
  await page.getByRole("link", { name: "Wireless Mouse" }).click();
  await page.getByRole("button", { name: "Add to cart" }).click();
  await page.getByRole("link", { name: "Cart (1)" }).click();
  await page.getByRole("link", { name: "Checkout" }).click();

  await page.getByLabel("UPI ID").fill("priya@okaxis");
  await page.getByRole("button", { name: "Pay ₹899" }).click();

  await expect(page.getByRole("heading", { name: "Order placed" })).toBeVisible();
  await expect(page.getByText("Order ID: PK-1001")).toBeVisible();
});

// Run:  npx playwright test            -> 2 passed (chromium, mobile) in 9.4s
//       npx playwright test --ui       -> interactive runner with time travel`
    },
    {
      heading: "13. How React Testing Is Used in Production",
      content: `Here is how a typical product team at a fintech or e-commerce company in Bengaluru or Hyderabad actually uses the tools from this lecture:
• **Pull-request gate.** GitHub Actions runs \`vitest run --coverage\` on every push. A PR cannot merge if a test fails or if coverage of changed files drops below a threshold (80% lines is common; some teams enforce it only on new code). A suite of 1,500 component tests typically finishes in 1–2 minutes on a 4-core runner thanks to Vitest's parallel workers.
• **Test-driven bug fixes.** A bug report ("discount not applied for PIN 400001") first becomes a failing test reproducing it, then the fix. The test stays forever, so the bug cannot return.
• **Shared mocks.** The MSW handlers in \`src/mocks\` also run in the browser during development (via \`setupWorker\`) so the front-end team can build the checkout page while the backend endpoint is still in progress, and in Storybook so designers review real states (loading, empty, error).
• **Design-system components** get accessibility tests with axe plus keyboard tests, because a broken \`Dialog\` breaks every page that uses it.
• **Critical paths** — login, search, add to cart, payment — get Playwright E2E tests that run against a staging environment after every deploy, with alerts to the on-call channel when they fail.
• **Flaky-test hygiene.** Tests that fail intermittently are quarantined (skipped with a ticket) within a day, because one flaky test teaches the team to ignore red builds.
• **Test naming as documentation.** \`vitest run --reporter=verbose\` prints a readable specification of the app, which new team members read to understand features.
The workflow file below is a realistic starting point. Note the separate E2E job that only runs after unit and component tests pass, keeping the fast feedback loop fast.`,
      codeSnippet: `# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  unit-and-component:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npx vitest run --coverage --reporter=verbose
      - uses: actions/upload-artifact@v4
        with: { name: coverage, path: coverage }

  e2e:
    needs: unit-and-component          # only when fast tests are green
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test
        env: { CI: true }
      - uses: actions/upload-artifact@v4
        if: failure()
        with: { name: playwright-report, path: playwright-report }

# vite.config.js — fail the build when coverage drops
#   test: { coverage: { thresholds: { lines: 80, branches: 70 } } }`
    },
    {
      heading: "14. Common Mistakes in React Testing and How to Fix Them",
      content: `1. **Testing implementation details.** Asserting on state variables, checking that \`setCount\` was called, or reaching into \`container.querySelector(".btn-primary")\`. These tests break on harmless refactors and pass on real bugs. **Fix:** query by role, label or text, and assert what the user sees.
2. **Forgetting to \`await\` user-event.** \`user.click(button)\` without \`await\` returns a promise; the assertion on the next line runs before the click finishes, so the test fails randomly. **Fix:** \`await\` every \`user.*\` call and make the test function \`async\`.
3. **Using \`getBy\` for async content.** \`screen.getByText("Ravindra")\` right after \`render\` throws because the fetch has not resolved. **Fix:** \`await screen.findByText(...)\` or \`waitFor\`.
4. **Using \`getBy\` to assert absence.** \`expect(screen.getByText("Error")).not.toBeInTheDocument()\` can never pass; \`getBy\` throws before \`expect\` runs. **Fix:** use \`queryBy\` for absence checks only.
5. **Several assertions or side effects inside \`waitFor\`.** The callback retries many times, so a \`user.click\` inside it fires repeatedly. **Fix:** one assertion per \`waitFor\`; do actions outside it.
6. **Shared state leaking between tests.** A Zustand store or a module-level cache keeps data from the previous test, so tests pass alone and fail together. **Fix:** reset stores in \`afterEach\`, create a new \`QueryClient\` per test, call \`server.resetHandlers()\`.
7. **Hiding missing mocks.** With MSW's default \`onUnhandledRequest: "warn"\`, an unmocked request quietly fails and the test waits for a timeout. **Fix:** \`server.listen({ onUnhandledRequest: "error" })\`.
8. **Wrapping everything in \`act()\` to silence warnings.** The warning means a state update happened after the test ended. **Fix:** await the final state with \`findBy\` so the test waits for the component to settle.
9. **Mocking too much.** Mocking child components, hooks and the store leaves a test that proves nothing. **Fix:** mock only the boundary (network, timers, browser APIs like \`matchMedia\` or \`IntersectionObserver\`) and render the real tree.
10. **Relying on \`data-testid\` by default.** It bypasses accessibility and says nothing about UX. **Fix:** reserve it for elements with no semantic role, such as a loading spinner container.
11. **Giant snapshots approved with \`-u\`.** **Fix:** replace with targeted assertions; keep inline snapshots for short, stable values.
12. **Chasing 100% coverage.** Coverage measures lines executed, not behaviour verified. A suite at 100% can miss the bug that ships. **Fix:** target the risky paths — forms, money calculations, permissions — and treat coverage as a smoke signal, not a goal.`,
      codeSnippet: `// Before: brittle, implementation-focused, racy
it("adds item", () => {
  const { container } = render(<Cart />);
  const btn = container.querySelector(".btn-primary");   // tied to a CSS class
  fireEvent.click(btn);
  expect(container.querySelector(".count").textContent).toBe("1");
});

// After: behaviour-focused, accessible, deterministic
it("shows one item in the cart after clicking Add", async () => {
  const user = userEvent.setup();
  render(<Cart />);
  await user.click(screen.getByRole("button", { name: /add to cart/i }));
  expect(await screen.findByText("Cart (1)")).toBeInTheDocument();
  expect(screen.queryByText("Your cart is empty")).not.toBeInTheDocument(); // queryBy for absence
});

// Browser APIs jsdom lacks — stub them once in setup.js instead of in every test
// src/test/setup.js
window.matchMedia = window.matchMedia || ((query) => ({
  matches: false, media: query, addEventListener() {}, removeEventListener() {},
}));
class IO { observe() {} unobserve() {} disconnect() {} }
window.IntersectionObserver = window.IntersectionObserver || IO;`
    },
    {
      heading: "15. Frequently Asked Questions about Testing React Applications",
      content: `**What is the difference between Vitest and Jest for React testing?**
Both offer the same test API (\`describe\`, \`it\`, \`expect\`, mocks, snapshots), so test files look almost identical. Vitest reuses your Vite configuration, supports ES modules and JSX without extra transform setup, and starts faster in watch mode because it uses Vite's transform pipeline. Jest needs Babel or SWC configuration for JSX and ESM. In a Vite project, Vitest is the natural choice; in a Create React App or older Webpack project you will usually find Jest.
**Should I use jsdom or happy-dom with Vitest?**
jsdom is the more complete and battle-tested DOM implementation and is what most React Testing Library documentation assumes. happy-dom is noticeably faster (often 2–3x on large suites) but implements fewer browser features. Start with jsdom; switch to happy-dom only if test speed becomes a problem and your suite still passes.
**Why does React Testing Library recommend getByRole over getByTestId?**
\`getByRole\` finds elements the way assistive technology does, so the test verifies that the element is accessible and labelled correctly. \`getByTestId\` finds an element by a hidden attribute that has no meaning to users, so a test can pass while the button has no visible or accessible name. Use test IDs only for elements with no natural role.
**How do I test a component that uses fetch or axios?**
Use Mock Service Worker. Define handlers for your API endpoints, start the MSW server in your Vitest setup file, and let the component make its real request; MSW intercepts it and returns your mock response. This tests your actual request code, headers and error handling instead of a stubbed function.
**How do I test a custom hook in React?**
Use \`renderHook\` from \`@testing-library/react\`. It calls your hook inside a test component and exposes the latest return value on \`result.current\`. Wrap state updates in \`act()\`, and pass a \`wrapper\` option for hooks that need a provider such as a router or TanStack Query client.
**Are snapshot tests bad practice in React?**
Not inherently, but large snapshots of component markup are a poor fit: they fail on unrelated changes, get updated without review and test nothing about behaviour. Snapshots work well for small, stable, serialisable output such as formatted strings or reducer state, especially as inline snapshots.
**Do I still need end-to-end tests if I have good component tests?**
Yes, but only a few. Component tests cannot verify real routing in a browser, real backend integration, CSS layout, cookies or third-party widgets. Write Playwright tests for the critical flows that must never break (login, checkout, payment) and leave everything else to faster component tests.
**How much test coverage should a React project have?**
There is no magic number. Many teams set 70–80% as a floor to catch untested files, but the goal is confidence, not a percentage. Prioritise business logic, forms, money calculations, permission checks and anything that has broken before; presentational wrappers and simple pass-through components need little or no direct testing.`
    },
    {
      heading: "16. Top React Interview Questions on Testing",
      content: `**Q1: Explain the testing pyramid and how it applies to a React application.**
*Answer*: The pyramid has many fast unit tests at the base (pure functions, hooks, reducers), fewer integration tests in the middle (components rendered with React Testing Library and a mocked network) and very few slow end-to-end tests at the top (Playwright driving a real browser). In React the integration layer gives the best confidence per effort, so teams write most tests there and keep E2E for critical user journeys.
**Q2: What is the difference between getBy, queryBy and findBy in React Testing Library?**
*Answer*: \`getBy\` returns the element synchronously and throws if it is missing. \`queryBy\` returns \`null\` instead of throwing, which makes it the right choice for asserting that something is absent. \`findBy\` returns a promise that polls the DOM for up to one second, so it is used for elements that appear after asynchronous work.
**Q3: Why should you prefer user-event over fireEvent?**
*Answer*: \`fireEvent\` dispatches one synthetic DOM event. \`user-event\` simulates the full sequence a browser produces for an interaction (pointer events, focus, key events, input events) and respects browser rules such as not clicking disabled elements or not typing into read-only inputs. Tests written with user-event therefore catch more real bugs.
**Q4: What does the "not wrapped in act(...)" warning mean and how do you fix it properly?**
*Answer*: React is warning that a state update happened outside a test-controlled window, usually because an async effect resolved after the test's last assertion. RTL already wraps render, user-event and findBy in \`act\`, so the proper fix is to make the test wait for the final UI state with \`findBy\` or \`waitFor\`, not to sprinkle manual \`act\` calls.
**Q5: How does Mock Service Worker differ from mocking fetch with vi.fn?**
*Answer*: \`vi.fn\` replaces the \`fetch\` function, so the component's real request code never runs and the mock must mimic the Response object. MSW intercepts at the network layer: the real \`fetch\` executes, the URL, headers, body parsing and error branches are exercised, and the same handlers can be reused in the browser during development and in Storybook.
**Q6: How do you test a component that uses React Router, TanStack Query or a global store?**
*Answer*: Create a custom render function that wraps the component in the required providers: \`MemoryRouter\` with an \`initialEntries\` route, a fresh \`QueryClient\` with \`retry: false\`, and the store provider or a reset Zustand store. Export it from a test-utils module so every test uses the same realistic environment.
**Q7: What are the drawbacks of snapshot testing?**
*Answer*: Snapshots record whatever rendered first, including bugs; they fail on any markup change even when behaviour is unchanged; they encourage reflexive updating with \`-u\`; and they couple tests to implementation details. They are best limited to small, stable, serialisable values, ideally as inline snapshots.
**Q8: How do you test asynchronous hooks like a debounce hook?**
*Answer*: Use \`renderHook\` together with Vitest fake timers. Call \`vi.useFakeTimers()\`, rerender the hook with new values, then advance time with \`vi.advanceTimersByTime(delay)\` inside \`act\` and assert that \`result.current\` changed only after the delay. Restore real timers in \`afterEach\`.
**Q9: How would you make tests catch accessibility regressions?**
*Answer*: Query with \`getByRole\` and \`getByLabelText\` so elements must have accessible names; run axe-core through \`vitest-axe\` on page-level components with \`toHaveNoViolations\`; and write keyboard tests using \`user.tab()\`, \`user.keyboard\` and \`toHaveFocus()\` for focus order, focus trapping in dialogs and Escape-to-close behaviour.
**Q10: When would you choose Playwright over React Testing Library?**
*Answer*: When the behaviour depends on a real browser or the real system: full-page navigation, cookies and sessions, CSS layout and responsiveness, third-party scripts or an actual backend. These are the critical journeys such as login and checkout. Everything that can be verified by rendering a component tree with mocked network should stay in faster RTL tests.`
    },
    {
      heading: "17. Practical Hands-On Exercise: Testing a Product Search Feature with Vitest, RTL and MSW",
      content: `Build and fully test a **product search** feature for an Indian e-commerce page. The component debounces the search box, fetches matching products from the API, shows loading, empty and error states, and lets the user add a product to the cart. The test file exercises every state using the tools from this lecture: MSW handlers with a per-test error override, fake timers for the debounce, \`findBy\` for async results, user-event for typing and clicking, and an axe check.
**Setup:** this exercise assumes the \`vite.config.js\`, \`setup.js\` (with jest-dom, MSW server lifecycle and axe matchers) and \`src/mocks/handlers.js\` from earlier sections. Create the two files below and run \`npx vitest run src/features/search\`.
**Challenges after it passes:**
1. Add a test that the previous results stay visible while a new search is loading (search for "mouse", then "key" and assert "Wireless Mouse" is still on screen until the new results arrive).
2. Add a \`Retry\` button to the error state and test that clicking it refetches successfully after you \`server.resetHandlers()\` inside the test.
3. Convert the fetching logic to TanStack Query's \`useQuery\` and update the tests to use \`renderWithProviders\` from section 9 — the assertions should not need to change, which is the sign of a good behaviour-focused test.`,
      codeSnippet: `// src/features/search/ProductSearch.jsx
import { useEffect, useState } from "react";
import { API } from "../../mocks/handlers";   // in a real app: import.meta.env.VITE_API_URL

const formatINR = (n) => "₹" + n.toLocaleString("en-IN");

export default function ProductSearch({ onAddToCart }) {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [state, setState] = useState({ status: "idle", products: [] });

  useEffect(() => {                                     // 300 ms debounce
    const id = setTimeout(() => setDebounced(query.trim()), 300);
    return () => clearTimeout(id);
  }, [query]);

  useEffect(() => {
    if (!debounced) { setState({ status: "idle", products: [] }); return; }
    let cancelled = false;
    setState((s) => ({ ...s, status: "loading" }));
    fetch(API + "/products?q=" + encodeURIComponent(debounced))
      .then((res) => { if (!res.ok) throw new Error("Server responded with " + res.status); return res.json(); })
      .then((products) => !cancelled && setState({ status: "success", products }))
      .catch((err) => !cancelled && setState({ status: "error", products: [], message: err.message }));
    return () => { cancelled = true; };
  }, [debounced]);

  return (
    <section aria-labelledby="search-heading">
      <h2 id="search-heading">Search products</h2>
      <label htmlFor="q">Search</label>
      <input id="q" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. mouse" />

      {state.status === "loading" && <p role="status">Searching…</p>}
      {state.status === "error" && <p role="alert">Something went wrong: {state.message}</p>}
      {state.status === "success" && state.products.length === 0 && <p>No products match "{debounced}".</p>}

      {state.products.length > 0 && (
        <ul aria-label="Search results">
          {state.products.map((p) => (
            <li key={p.id}>
              <span>{p.name} — {formatINR(p.price)}</span>
              <button onClick={() => onAddToCart(p)} aria-label={"Add " + p.name + " to cart"}>Add</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// src/features/search/ProductSearch.test.jsx
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { axe } from "vitest-axe";
import { server } from "../../mocks/server";
import { API } from "../../mocks/handlers";
import ProductSearch from "./ProductSearch";

function setup(props = {}) {
  const onAddToCart = vi.fn();
  const user = userEvent.setup();
  render(<ProductSearch onAddToCart={onAddToCart} {...props} />);
  return { user, onAddToCart, input: screen.getByRole("searchbox", { name: "Search" }) };
}

describe("ProductSearch", () => {
  it("shows nothing until the user types", () => {
    setup();
    expect(screen.queryByRole("list", { name: "Search results" })).not.toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("shows matching products after the debounce", async () => {
    const { user, input } = setup();
    await user.type(input, "mouse");

    expect(await screen.findByRole("status")).toHaveTextContent("Searching…");
    const list = await screen.findByRole("list", { name: "Search results" });
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveTextContent("Wireless Mouse — ₹899");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("fires only one request for fast typing (debounce)", async () => {
    const requests = [];
    server.use(
      http.get(API + "/products", ({ request }) => {
        requests.push(new URL(request.url).searchParams.get("q"));
        return HttpResponse.json([]);
      })
    );
    const { user, input } = setup();
    await user.type(input, "keyboard");                       // 8 keystrokes, < 300 ms apart
    await screen.findByText('No products match "keyboard".');
    expect(requests).toEqual(["keyboard"]);                   // not ["k", "ke", "key", ...]
  });

  it("adds a product to the cart", async () => {
    const { user, input, onAddToCart } = setup();
    await user.type(input, "key");
    await user.click(await screen.findByRole("button", { name: "Add Mechanical Keyboard to cart" }));
    expect(onAddToCart).toHaveBeenCalledWith(expect.objectContaining({ id: 2, price: 3499 }));
  });

  it("shows an error message when the API fails", async () => {
    server.use(http.get(API + "/products", () => HttpResponse.json({}, { status: 503 })));
    const { user, input } = setup();
    await user.type(input, "mouse");
    expect(await screen.findByRole("alert")).toHaveTextContent("Server responded with 503");
  });

  it("has no accessibility violations with results shown", async () => {
    const { user, input } = setup();
    await user.type(input, "m");
    await screen.findByRole("list", { name: "Search results" });
    expect(await axe(document.body)).toHaveNoViolations();
  });
});

// Expected output: npx vitest run src/features/search
//  ✓ ProductSearch > shows nothing until the user types
//  ✓ ProductSearch > shows matching products after the debounce
//  ✓ ProductSearch > fires only one request for fast typing (debounce)
//  ✓ ProductSearch > adds a product to the cart
//  ✓ ProductSearch > shows an error message when the API fails
//  ✓ ProductSearch > has no accessibility violations with results shown
//  Test Files  1 passed (1)   Tests  6 passed (6)`
    },
    {
      heading: "18. Summary",
      content: `• The **testing pyramid** for React: many unit tests (functions, hooks), a strong middle of **integration tests** rendered with React Testing Library, and a few **E2E** journeys in Playwright.
• **Vitest** is the test runner for Vite projects: set \`environment: "jsdom"\`, \`globals: true\` and a \`setupFiles\` entry that imports jest-dom matchers and starts MSW.
• **React Testing Library** tests behaviour, not implementation. Query in priority order — \`getByRole\` first, \`getByLabelText\`, \`getByText\`, and \`getByTestId\` only as a last resort. Use \`getBy\` for present elements, \`queryBy\` for absence and \`findBy\` for things that appear later.
• **user-event** simulates real interactions: call \`userEvent.setup()\` and \`await\` every \`click\`, \`type\`, \`keyboard\`, \`tab\` and \`selectOptions\`.
• Async UI: \`findBy\`, \`waitFor\` (one assertion inside), \`waitForElementToBeRemoved\`; mock modules with \`vi.mock\` and timers with \`vi.useFakeTimers\`.
• Test hooks with **\`renderHook\`**, reading \`result.current\` and wrapping updates in \`act\`; pass a \`wrapper\` for hooks that need providers.
• **MSW 2** mocks the network at the request level with \`http.get\` / \`HttpResponse.json\`; start it with \`onUnhandledRequest: "error"\`, reset handlers after each test and override per test with \`server.use\`.
• Wrap components in a **custom render** with \`MemoryRouter\`, a fresh \`QueryClient\` (\`retry: false\`) and reset Zustand or Redux state between tests.
• **Snapshots** are for small, stable, serialisable values (prefer inline snapshots); large markup snapshots are brittle and rarely reviewed.
• **Accessibility-driven tests**: role-based queries, \`vitest-axe\` for rule violations, \`toHaveAccessibleName\` and keyboard journeys with \`user.tab()\`.
• **Playwright** covers the few critical journeys in a real browser with auto-waiting locators, \`page.route\` for third-party stubs, traces and an HTML report; run it in CI after the fast suite is green.
**Next lecture:** Styling, Accessibility, Deployment & Capstone Project — CSS strategies for React, building accessible UI from the ground up, shipping a Vite app to production and completing the course capstone.`
    }
  ]
};
