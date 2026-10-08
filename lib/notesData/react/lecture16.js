export const lecture16 = {
  slug: "lecture-16",
  number: 16,
  title: "Complete React Course — Module 5: Lecture 16: Forms in React — Controlled Inputs, Validation & React 19 Form Actions",
  summary: "Build forms the React way: controlled vs uncontrolled inputs, every input type (text, checkbox, radio, select, textarea, file), one change handler for many fields, hand-written client validation, React Hook Form with Zod, and React 19 form actions with useActionState and useFormStatus, plus accessible labels and error messages.",
  readTime: "30 min read",
  difficulty: "Intermediate",
  date: "2026-10-08",
  sections: [
    {
      heading: "1. Why Forms Deserve Their Own Lecture",
      content: `Almost every real app is a pile of forms: login, sign-up, checkout, search, profile settings, a feedback box. Forms look simple, but they combine many things at once: user input, state, validation, error messages, loading states, network requests and accessibility.
In the previous lecture you used \`useRef\` to reach into the DOM. In this lecture you will see that React gives you **two ways** to read form data:
• **Controlled inputs** — React state is the single source of truth, and the input shows whatever state says.
• **Uncontrolled inputs** — the browser DOM keeps the value, and you read it when you need it (with a ref, or with \`FormData\` on submit).
Then we will go further: validating input by hand, using **React Hook Form + Zod** for large forms, and using **React 19 form actions** (\`<form action={fn}>\`, \`useActionState\`, \`useFormStatus\`) which remove most of the loading and error boilerplate.
**Goal of this lecture:** after reading it, you should be able to pick the right approach for any form and build it so it is correct, fast and usable with a keyboard and screen reader.`
    },
    {
      heading: "2. Controlled vs Uncontrolled Inputs",
      content: `A **controlled input** has its \`value\` prop set from state and an \`onChange\` handler that updates that state. Every keystroke goes: user types → \`onChange\` → \`setState\` → re-render → input shows the new value. Because the value lives in state, you can transform it instantly (uppercase a PAN number, strip non-digits from a phone number), show live character counts, or disable the submit button until the form is valid.
An **uncontrolled input** has no \`value\` prop. You can give it a starting value with \`defaultValue\` (or \`defaultChecked\` for checkboxes), and the browser keeps track of changes. You read the value with a ref or from \`FormData\` when the form is submitted.
When to use which:
• **Controlled** — when the UI must react to every keystroke: live validation, dependent fields, formatting, search-as-you-type.
• **Uncontrolled** — when you only need the values on submit. Less code, fewer re-renders. React 19 form actions and React Hook Form both lean on this style.
**Golden rule:** never switch an input between controlled and uncontrolled during its life. If \`value\` starts as \`undefined\` and later becomes a string, React warns: "A component is changing an uncontrolled input to be controlled". Always initialise controlled text fields with \`""\`, not \`undefined\` or \`null\`.`,
      codeSnippet: `// src/NameInputs.jsx
import { useState, useRef } from "react";

export function ControlledName() {
  const [name, setName] = useState(""); // start with "" not undefined

  return (
    <label>
      Name (controlled):
      <input
        value={name}
        onChange={(e) => setName(e.target.value.toUpperCase())}
      />
      <small>{name.length}/40 characters</small>
    </label>
  );
}

export function UncontrolledName() {
  const inputRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    alert("Hello, " + inputRef.current.value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name (uncontrolled):
        <input ref={inputRef} defaultValue="Ravindra" />
      </label>
      <button type="submit">Greet</button>
    </form>
  );
}`
    },
    {
      heading: "3. Every Input Type, the React Way",
      content: `Each HTML form element has a slightly different "value" prop in React. Memorise this list; it prevents most beginner bugs:
• **Text, email, password, number, date, tel** — \`value\` + \`onChange\`, read \`e.target.value\`. Note that \`e.target.value\` is **always a string**, even for \`type="number"\`. Convert it with \`Number()\` when you need a number.
• **Textarea** — in React, \`<textarea>\` takes a \`value\` prop (not children), exactly like an input.
• **Select** — put \`value\` on the \`<select>\`, not \`selected\` on an \`<option>\`. For \`multiple\`, \`value\` is an array, and you read \`Array.from(e.target.selectedOptions, (o) => o.value)\`.
• **Checkbox** — use \`checked\` (boolean) and read \`e.target.checked\`. Using \`value\` here is a classic bug.
• **Radio group** — every radio shares the same \`name\`; each one is \`checked={choice === "upi"}\`, and \`onChange\` sets the choice to that radio's value.
• **File** — \`<input type="file">\` is **always uncontrolled** because its value is read-only for security. Read \`e.target.files\` (a \`FileList\`), or get the file from \`FormData\` on submit.`,
      codeSnippet: `// src/AllInputs.jsx
import { useState } from "react";

export default function AllInputs() {
  const [city, setCity] = useState("Delhi");
  const [bio, setBio] = useState("");
  const [agree, setAgree] = useState(false);
  const [payment, setPayment] = useState("upi");
  const [skills, setSkills] = useState(["react"]);
  const [resume, setResume] = useState(null);

  return (
    <form>
      <select value={city} onChange={(e) => setCity(e.target.value)}>
        <option value="Delhi">Delhi</option>
        <option value="Mumbai">Mumbai</option>
        <option value="Bengaluru">Bengaluru</option>
      </select>

      <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />

      <label>
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
        I accept the terms
      </label>

      {["upi", "card", "cod"].map((method) => (
        <label key={method}>
          <input
            type="radio"
            name="payment"
            value={method}
            checked={payment === method}
            onChange={(e) => setPayment(e.target.value)}
          />
          {method.toUpperCase()}
        </label>
      ))}

      <select
        multiple
        value={skills}
        onChange={(e) => setSkills(Array.from(e.target.selectedOptions, (o) => o.value))}
      >
        <option value="react">React</option>
        <option value="node">Node.js</option>
        <option value="sql">SQL</option>
      </select>

      {/* File inputs are always uncontrolled: no value prop */}
      <input type="file" accept=".pdf" onChange={(e) => setResume(e.target.files[0] ?? null)} />
      {resume && <p>Selected: {resume.name} ({Math.round(resume.size / 1024)} KB)</p>}
    </form>
  );
}`
    },
    {
      heading: "4. One Change Handler for Many Fields",
      content: `Writing a separate \`useState\` and handler for each of 10 fields gets tiring. The standard pattern is **one object in state** and **one handler** that uses the input's \`name\` attribute as the key.
How it works:
1. Give every input a \`name\` that matches a key in your state object.
2. In the handler, read \`name\`, \`type\`, \`value\` and \`checked\` from \`e.target\`.
3. Pick \`checked\` for checkboxes and \`value\` for everything else.
4. Update state immutably with a **computed property name**: \`{ ...prev, [name]: newValue }\`.
This is the object-state pattern from Lecture 11, applied to forms. Use the updater form \`setForm(prev => ...)\` so fast typing never loses an update.`,
      codeSnippet: `// src/SignupForm.jsx
import { useState } from "react";

const initialForm = { fullName: "", email: "", city: "Pune", newsletter: false };

export default function SignupForm() {
  const [form, setForm] = useState(initialForm);

  function handleChange(e) {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Submitting", form);
    setForm(initialForm); // reset after submit
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full name" />
      <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" />
      <select name="city" value={form.city} onChange={handleChange}>
        <option>Pune</option>
        <option>Hyderabad</option>
        <option>Kolkata</option>
      </select>
      <label>
        <input name="newsletter" type="checkbox" checked={form.newsletter} onChange={handleChange} />
        Send me the weekly newsletter
      </label>
      <button type="submit">Sign up</button>
    </form>
  );
}`
    },
    {
      heading: "5. Reading Uncontrolled Forms with FormData",
      content: `If you only need the values on submit, skip the state entirely. The browser's built-in \`FormData\` object collects every named field of a form for you.
• \`new FormData(e.currentTarget)\` — build it from the form element in \`onSubmit\`.
• \`formData.get("email")\` — one value (a string, or a \`File\` for file inputs).
• \`formData.getAll("skills")\` — all values for checkboxes or multi-selects that share a name.
• \`Object.fromEntries(formData)\` — a quick plain object (keeps only the last value for repeated names).
An unchecked checkbox is simply **missing** from \`FormData\`, so \`formData.get("newsletter")\` returns \`null\`. A checked one sends its \`value\` (\`"on"\` by default).
This style is fast (no re-render per keystroke) and is exactly what React 19 form actions hand you, so it is worth getting comfortable with.`,
      codeSnippet: `// src/FeedbackForm.jsx
export default function FeedbackForm() {
  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload = {
      name: formData.get("name"),
      rating: Number(formData.get("rating")),
      topics: formData.getAll("topics"),       // ["hooks", "forms"]
      subscribe: formData.get("subscribe") === "on",
    };
    console.log(payload);
    e.currentTarget.reset(); // clear the uncontrolled fields
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" defaultValue="" required />
      <input name="rating" type="number" min="1" max="5" defaultValue="5" />
      <label><input type="checkbox" name="topics" value="hooks" /> Hooks</label>
      <label><input type="checkbox" name="topics" value="forms" /> Forms</label>
      <label><input type="checkbox" name="subscribe" /> Subscribe</label>
      <button type="submit">Send feedback</button>
    </form>
  );
}`
    },
    {
      heading: "6. Client-Side Validation by Hand",
      content: `Validation tells the user what is wrong **before** they wait for a server round trip. Start with the free option: HTML attributes like \`required\`, \`minLength\`, \`maxLength\`, \`min\`, \`max\`, \`pattern\` and \`type="email"\`. The browser blocks submission and shows its own message.
For custom messages and styling, write a \`validate(values)\` function that returns an **errors object** (\`{ email: "Enter a valid email" }\`). An empty object means the form is valid.
A good user experience pattern:
• Validate on **submit** for all fields.
• Track which fields were **touched** (blurred) and only show their errors after that, so the user isn't shouted at before typing.
• Re-validate on change once a field has an error, so the message disappears as soon as it is fixed.
• Add \`noValidate\` to the form when you show your own messages, so browser bubbles and your messages don't appear together.
**Important:** client validation is for user experience only. Anyone can bypass it with DevTools or a direct API call. **Always validate again on the server.**`,
      codeSnippet: `// src/validateSignup.js
export function validateSignup(values) {
  const errors = {};
  if (!values.fullName.trim()) {
    errors.fullName = "Full name is required";
  } else if (values.fullName.trim().length < 3) {
    errors.fullName = "Name must be at least 3 characters";
  }
  if (!/^\\S+@\\S+\\.\\S+$/.test(values.email)) {
    errors.email = "Enter a valid email address";
  }
  if (!/^[6-9]\\d{9}$/.test(values.phone)) {
    errors.phone = "Enter a 10-digit Indian mobile number";
  }
  if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }
  if (values.confirm !== values.password) {
    errors.confirm = "Passwords do not match";
  }
  return errors;
}

// Usage inside a component:
// const errors = validateSignup(form);
// const isValid = Object.keys(errors).length === 0;
// {touched.email && errors.email && <p role="alert">{errors.email}</p>}`
    },
    {
      heading: "7. Accessible Forms and Error Messages",
      content: `A form that only works with a mouse and good eyesight is a broken form. These rules cost little and help everyone, including keyboard users and screen reader users:
• **Every input needs a label.** Wrap the input in \`<label>\`, or connect them with \`htmlFor\` (React's name for \`for\`). A placeholder is **not** a label; it disappears when you type.
• **Generate ids with \`useId\`**, not hard-coded strings, so two copies of a component on one page never clash.
• **Mark invalid fields** with \`aria-invalid="true"\` and link the message with \`aria-describedby\` pointing at the error element's id. Screen readers then read the error when the field is focused.
• **Announce errors** with \`role="alert"\` (or an \`aria-live\` region) so they are read out when they appear.
• **Don't rely on colour alone.** Red borders need a text message too.
• **Move focus to the first invalid field** on a failed submit (a ref plus \`.focus()\`, from Lecture 15).
• **Use real \`<button type="submit">\`** elements, and \`<fieldset>\` with \`<legend>\` to group radio buttons.
• **Use the right \`type\` and \`autoComplete\`** (\`type="email"\`, \`autoComplete="email"\`, \`inputMode="numeric"\`) so mobile keyboards and password managers help the user.`,
      codeSnippet: `// src/TextField.jsx — a reusable, accessible field
import { useId } from "react";

export default function TextField({ label, error, ...inputProps }) {
  const id = useId();
  const errorId = id + "-error";

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? errorId : undefined}
        {...inputProps}
      />
      {error && (
        <p id={errorId} role="alert" className="error">
          {error}
        </p>
      )}
    </div>
  );
}

// <TextField label="Email" name="email" type="email" autoComplete="email" error={errors.email} />`
    },
    {
      heading: "8. React Hook Form + Zod for Large Forms",
      content: `Hand-written validation is fine for three fields. For a 20-field KYC or checkout form, use a library. The most popular pairing is **React Hook Form** (form state) with **Zod** (schema validation).
Why this combination works well:
• **React Hook Form** registers inputs as **uncontrolled**, so typing does not re-render the whole form. It tracks errors, touched fields and submission state for you.
• **Zod** describes the shape of valid data once, as a schema. The same schema can run on the server, and \`z.infer\` gives TypeScript types for free.
• The **\`zodResolver\`** from \`@hookform/resolvers\` connects the two.
Install: \`npm install react-hook-form zod @hookform/resolvers\`.
Key APIs:
• \`useForm({ resolver, defaultValues })\` returns \`register\`, \`handleSubmit\` and \`formState\`.
• \`{...register("email")}\` spreads \`name\`, \`onChange\`, \`onBlur\` and \`ref\` onto an input.
• \`handleSubmit(onValid)\` validates first and calls your function only with clean, parsed data.
• \`formState.errors.email?.message\` holds the message from the schema; \`formState.isSubmitting\` is true while an async \`onValid\` runs.
Zod's API changed between versions 3 and 4 (for example, version 4 adds top-level helpers like \`z.email()\`), so check the version you install against the Zod docs. Passing a plain string as the error message, as below, works in both.`,
      codeSnippet: `// src/CheckoutForm.jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z
  .object({
    name: z.string().trim().min(3, "Name must be at least 3 characters"),
    email: z.string().trim().email("Enter a valid email"),
    pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit PIN code"),
    quantity: z.number({ message: "Quantity is required" }).int().min(1, "At least 1").max(10, "At most 10"),
    payment: z.enum(["upi", "card", "cod"], { message: "Choose a payment method" }),
  })
  .refine((d) => !(d.payment === "cod" && d.quantity > 5), {
    message: "Cash on delivery is limited to 5 items",
    path: ["payment"],
  });

export default function CheckoutForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", pincode: "", quantity: 1, payment: "upi" },
  });

  async function onValid(data) {
    await new Promise((r) => setTimeout(r, 1000)); // pretend API call
    console.log("Order placed", data);
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onValid)} noValidate>
      <input {...register("name")} placeholder="Name" aria-invalid={!!errors.name} />
      {errors.name && <p role="alert">{errors.name.message}</p>}

      <input {...register("email")} type="email" placeholder="Email" aria-invalid={!!errors.email} />
      {errors.email && <p role="alert">{errors.email.message}</p>}

      <input {...register("pincode")} inputMode="numeric" placeholder="PIN code" />
      {errors.pincode && <p role="alert">{errors.pincode.message}</p>}

      {/* valueAsNumber turns the string into a number before Zod sees it */}
      <input {...register("quantity", { valueAsNumber: true })} type="number" />
      {errors.quantity && <p role="alert">{errors.quantity.message}</p>}

      <select {...register("payment")}>
        <option value="upi">UPI</option>
        <option value="card">Card</option>
        <option value="cod">Cash on delivery</option>
      </select>
      {errors.payment && <p role="alert">{errors.payment.message}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Placing order..." : "Place order"}
      </button>
    </form>
  );
}`
    },
    {
      heading: "9. React 19 Form Actions: <form action={fn}>",
      content: `React 19 made forms a first-class feature. Instead of \`onSubmit\` + \`e.preventDefault()\`, you can pass a **function** to the form's \`action\` prop:
• React calls your function with the form's **\`FormData\`** when the form is submitted. No \`preventDefault\` needed.
• The function can be **async**. React runs it inside a **transition**, so the UI stays responsive while it waits.
• When the action finishes without throwing, React **automatically resets** the form's uncontrolled fields. This happens even if your action returned validation errors, because returning a value still counts as success. (If you need to reset at another time, \`requestFormReset\` from \`react-dom\` exists.)
• The same \`formAction\` prop works on a \`<button>\` or \`<input type="submit">\`, so one form can have two buttons that do different things (for example "Save draft" and "Publish").
This works in any React 19 app, including a plain Vite client app; the function simply runs in the browser. In a framework with **Server Functions** (such as Next.js with \`"use server"\`), the same \`action\` prop can call code on the server, and the form can even submit before JavaScript has loaded.`,
      codeSnippet: `// src/NewsletterForm.jsx
async function subscribe(formData) {
  const email = formData.get("email");
  await new Promise((r) => setTimeout(r, 800)); // pretend API call
  console.log("Subscribed:", email);
}

async function saveDraft(formData) {
  console.log("Draft saved:", formData.get("email"));
}

export default function NewsletterForm() {
  return (
    <form action={subscribe}>
      <label htmlFor="nl-email">Email</label>
      <input id="nl-email" name="email" type="email" required />
      <button type="submit">Subscribe</button>
      {/* A different action for this button only */}
      <button formAction={saveDraft}>Save for later</button>
    </form>
  );
}`
    },
    {
      heading: "10. useActionState: Results, Errors and Pending State",
      content: `A bare action cannot show "Thanks!" or "Email already registered". **\`useActionState\`** adds state that comes back from the action.
Signature: \`const [state, formAction, isPending] = useActionState(action, initialState)\`.
• Your action now receives **two arguments**: \`(previousState, formData)\`. This is the most common mistake: the \`FormData\` is the **second** argument.
• Whatever the action **returns** becomes the new \`state\`. Return errors, a success message, or the submitted values.
• \`formAction\` is what you pass to \`<form action>\`.
• \`isPending\` is \`true\` while the action runs, perfect for disabling the button.
• Import it from \`react\`. (In early React 19 canaries it was called \`useFormState\` in \`react-dom\`; that name is gone, so ignore old tutorials that use it.)
Because the form resets whenever the action completes (even when it returns errors), return the submitted values on **error** and use them as \`defaultValue\`, so the user doesn't lose what they typed.`,
      codeSnippet: `// src/RegisterForm.jsx
import { useActionState } from "react";

const takenEmails = ["ravi@example.com", "priya@example.com"];

async function registerAction(prevState, formData) {
  const values = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
  };
  const errors = {};
  if (values.name.length < 3) errors.name = "Name must be at least 3 characters";
  if (!values.email.includes("@")) errors.email = "Enter a valid email";

  await new Promise((r) => setTimeout(r, 800)); // pretend server check
  if (!errors.email && takenEmails.includes(values.email)) {
    errors.email = "This email is already registered";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors, values }; // keep values so fields can be refilled
  }
  return { ok: true, message: "Welcome aboard, " + values.name + "!", errors: {}, values: {} };
}

const initialState = { ok: false, errors: {}, values: {} };

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} noValidate>
      <label htmlFor="r-name">Name</label>
      <input id="r-name" name="name" defaultValue={state.values.name}
        aria-invalid={!!state.errors.name} aria-describedby="r-name-err" />
      <p id="r-name-err" role="alert">{state.errors.name}</p>

      <label htmlFor="r-email">Email</label>
      <input id="r-email" name="email" type="email" defaultValue={state.values.email}
        aria-invalid={!!state.errors.email} aria-describedby="r-email-err" />
      <p id="r-email-err" role="alert">{state.errors.email}</p>

      <button type="submit" disabled={isPending}>
        {isPending ? "Registering..." : "Register"}
      </button>
      {state.ok && <p role="status">{state.message}</p>}
    </form>
  );
}`
    },
    {
      heading: "11. useFormStatus: A Smart Submit Button",
      content: `Passing \`isPending\` down through props to every submit button is tedious. **\`useFormStatus\`** (imported from **\`react-dom\`**, not \`react\`) lets any component read the status of the form it sits inside.
It returns \`{ pending, data, method, action }\`:
• \`pending\` — \`true\` while the parent form is submitting.
• \`data\` — the \`FormData\` being submitted (or \`null\`), handy for showing "Sending message to Ananya...".
• \`method\` and \`action\` — the form's method and the action being run.
**The catch:** \`useFormStatus\` only reports on a \`<form>\` that is an **ancestor** of the component calling it. If you call it in the same component that renders the \`<form>\`, \`pending\` is always \`false\`. Put it in a child component, like \`SubmitButton\` below, and reuse that button in every form.`,
      codeSnippet: `// src/SubmitButton.jsx
import { useFormStatus } from "react-dom";

export default function SubmitButton({ children, pendingText = "Saving..." }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-busy={pending}>
      {pending ? pendingText : children}
    </button>
  );
}

// src/ContactForm.jsx
import SubmitButton from "./SubmitButton";

async function sendMessage(formData) {
  await new Promise((r) => setTimeout(r, 1000));
  console.log("Message from", formData.get("name"));
}

export default function ContactForm() {
  return (
    <form action={sendMessage}>
      <input name="name" aria-label="Your name" required />
      <textarea name="message" aria-label="Message" required />
      <SubmitButton pendingText="Sending...">Send message</SubmitButton>
    </form>
  );
}`
    },
    {
      heading: "12. Choosing the Right Approach",
      content: `There is no single "correct" way to build forms in React. Use this decision guide:
• **Small form, values needed only on submit** (search box, newsletter, contact): uncontrolled inputs + a React 19 form action. Add \`useActionState\` for messages and \`useFormStatus\` for the button.
• **Live UI on every keystroke** (character counter, password strength meter, dependent dropdowns like State → City): controlled inputs with \`useState\` and a single change handler.
• **Large or complex forms** (multi-step onboarding, KYC, checkout with many rules, dynamic field arrays): React Hook Form + Zod.
• **Full-stack framework with Server Functions**: form actions calling the server, validated on the server with the same Zod schema, plus progressive enhancement.
You can mix them. A form action form can still have one controlled field for a live counter, and React Hook Form can submit to an API inside \`handleSubmit\`.
**Remember:** whichever approach you use, the server must validate again, and every field must have a label and accessible error messages.`
    },
    {
      heading: "13. Common Mistakes with Forms",
      content: `1. **Forgetting \`e.preventDefault()\` in \`onSubmit\`** — the browser does a full page reload and your state is lost. (Not needed with \`<form action={fn}>\`.)
2. **\`value\` without \`onChange\`** — the input becomes read-only and React warns. Use \`defaultValue\` if you don't want to control it, or add \`readOnly\` on purpose.
3. **Switching between uncontrolled and controlled** — \`useState()\` with no initial value, or \`value={user.name}\` where \`name\` is undefined at first. Initialise with \`""\`.
4. **Using \`value\` on a checkbox** — use \`checked\` and \`e.target.checked\`.
5. **Treating number inputs as numbers** — \`e.target.value\` is a string, so \`"2" + 1\` becomes \`"21"\`. Convert with \`Number()\` or \`valueAsNumber\`.
6. **Trying to control a file input** — \`value={file}\` throws errors. File inputs are always uncontrolled.
7. **Wrong \`useActionState\` argument order** — writing \`async function action(formData)\` gives you the previous state, not the form data. It's \`(prevState, formData)\`.
8. **Calling \`useFormStatus\` in the component that renders the form** — \`pending\` stays \`false\`. Move it into a child component.
9. **Fields without \`name\`** — \`FormData\`, form actions and React Hook Form's native fallback all depend on \`name\`.
10. **Placeholder as the only label, or errors shown only in red** — inaccessible. Use labels, text messages and \`aria-describedby\`.
11. **Trusting client validation** — always re-validate on the server.`
    },
    {
      heading: "14. Top React Interview Questions on Forms",
      content: `**Q1. What is the difference between controlled and uncontrolled components?**
A controlled input takes its value from React state via \`value\` and updates it through \`onChange\`, so React is the source of truth. An uncontrolled input keeps its own value in the DOM; you set an initial value with \`defaultValue\` and read it with a ref or \`FormData\`.
**Q2. Why is a file input always uncontrolled?**
Browsers do not let JavaScript set a file input's value (that would let a page pick files from your disk). You can only read the user's choice from \`files\`.
**Q3. How do you handle many inputs with one handler?**
Store values in one object, give each input a \`name\`, and update with \`setForm(prev => ({ ...prev, [name]: value }))\`, using \`checked\` for checkboxes.
**Q4. What does \`useActionState\` return, and what arguments does the action receive?**
It returns \`[state, formAction, isPending]\`. The action receives \`(previousState, formData)\`, and its return value becomes the new state.
**Q5. Why might \`useFormStatus\` always return \`pending: false\`?**
It reads the status of a parent \`<form>\`. Called in the same component that renders the form, there is no parent form, so it never sees the submission.
**Q6. What happens to form fields after a React 19 form action succeeds?**
React resets the form's uncontrolled fields automatically as long as the action did not throw, even if it returned errors. That is why you return the submitted values and feed them back as \`defaultValue\`. Controlled fields keep whatever state says.
**Q7. Why do React Hook Form forms perform well?**
They register inputs as uncontrolled and subscribe only to the form state you read, so typing does not re-render the whole form on every keystroke.
**Q8. Is client-side validation enough?**
No. It improves user experience but can be bypassed. The server must validate every request; sharing one Zod schema between client and server keeps both in sync.
**Q9. How do you make error messages accessible?**
Associate labels with \`htmlFor\`/\`useId\`, set \`aria-invalid\` on the field, link the message with \`aria-describedby\`, announce it with \`role="alert"\`, and move focus to the first invalid field on submit.`
    },
    {
      heading: "15. Practical Hands-On Exercise: Course Enrolment Form",
      content: `Build a complete enrolment form for a coding bootcamp that combines everything from this lecture without any extra libraries. Requirements:
1. Fields: full name, email, mobile number, city (select), batch (radio: weekday / weekend), "I agree" checkbox, and an optional message (textarea) with a live 200-character counter.
2. Use a React 19 action with \`useActionState\` to validate and "submit" (simulate a 1-second API call).
3. Return field errors and the submitted values on failure so the inputs are refilled with \`defaultValue\`.
4. Use a separate \`SubmitButton\` with \`useFormStatus\`.
5. Make every field accessible: \`useId\`-based labels, \`aria-invalid\`, \`aria-describedby\` and \`role="alert"\` messages.
Copy the code below into \`src/App.jsx\` of a Vite React 19 project and run \`npm run dev\`. Then try these extensions: reject the email "test@test.com" as "already enrolled"; focus the first invalid field after a failed submit; rebuild the same form with React Hook Form + Zod and compare the amount of code.`,
      codeSnippet: `// src/App.jsx
import { useActionState, useId, useState } from "react";
import { useFormStatus } from "react-dom";

const CITIES = ["Delhi", "Mumbai", "Bengaluru", "Hyderabad", "Chennai", "Kolkata"];

async function enrolAction(prevState, formData) {
  const values = {
    fullName: String(formData.get("fullName") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    mobile: String(formData.get("mobile") ?? "").trim(),
    city: String(formData.get("city") ?? ""),
    batch: String(formData.get("batch") ?? ""),
    agree: formData.get("agree") === "on",
    message: String(formData.get("message") ?? ""),
  };

  const errors = {};
  if (values.fullName.length < 3) errors.fullName = "Enter your full name (at least 3 characters)";
  if (!/^\\S+@\\S+\\.\\S+$/.test(values.email)) errors.email = "Enter a valid email address";
  if (!/^[6-9]\\d{9}$/.test(values.mobile)) errors.mobile = "Enter a 10-digit mobile number starting with 6-9";
  if (!CITIES.includes(values.city)) errors.city = "Choose your city";
  if (!["weekday", "weekend"].includes(values.batch)) errors.batch = "Choose a batch";
  if (!values.agree) errors.agree = "You must accept the terms";
  if (values.message.length > 200) errors.message = "Message must be 200 characters or fewer";

  if (Object.keys(errors).length > 0) return { status: "error", errors, values };

  await new Promise((r) => setTimeout(r, 1000)); // simulate API call
  return { status: "success", errors: {}, values: {}, name: values.fullName };
}

const initialState = { status: "idle", errors: {}, values: {} };

function Field({ label, error, children }) {
  const id = useId();
  const errorId = id + "-error";
  return (
    <div style={{ marginBottom: 14 }}>
      <label htmlFor={id} style={{ display: "block", fontWeight: 600, marginBottom: 4 }}>{label}</label>
      {children({ id, "aria-invalid": error ? "true" : "false", "aria-describedby": error ? errorId : undefined })}
      {error && <p id={errorId} role="alert" style={{ color: "#b91c1c", margin: "4px 0 0" }}>{error}</p>}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      style={{ background: "#2506ad", color: "#fff", border: "none", padding: "10px 18px", borderRadius: 6, fontWeight: "bold" }}>
      {pending ? "Submitting..." : "Enrol now"}
    </button>
  );
}

function MessageField({ defaultValue, error }) {
  const [count, setCount] = useState(defaultValue?.length ?? 0);
  return (
    <Field label="Message (optional)" error={error}>
      {(a11y) => (
        <>
          <textarea {...a11y} name="message" rows={3} defaultValue={defaultValue}
            onChange={(e) => setCount(e.target.value.length)} style={inputStyle} />
          <small style={{ color: count > 200 ? "#b91c1c" : "#64748b" }}>{count}/200</small>
        </>
      )}
    </Field>
  );
}

const inputStyle = { width: "100%", padding: 8, borderRadius: 6, border: "1px solid #cbd5e1", boxSizing: "border-box" };

export default function App() {
  const [state, formAction] = useActionState(enrolAction, initialState);
  const v = state.values;
  const e = state.errors;

  if (state.status === "success") {
    return <p role="status" style={{ maxWidth: 520, margin: "30px auto" }}>Thank you, {state.name}! Your seat is reserved.</p>;
  }

  return (
    <form action={formAction} noValidate
      style={{ maxWidth: 520, margin: "30px auto", padding: 24, border: "1px solid #cbd5e1", borderRadius: 16 }}>
      <h2 style={{ color: "#002057" }}>Lecture 16: Bootcamp Enrolment</h2>

      <Field label="Full name" error={e.fullName}>
        {(a11y) => <input {...a11y} name="fullName" autoComplete="name" defaultValue={v.fullName} style={inputStyle} />}
      </Field>
      <Field label="Email" error={e.email}>
        {(a11y) => <input {...a11y} name="email" type="email" autoComplete="email" defaultValue={v.email} style={inputStyle} />}
      </Field>
      <Field label="Mobile number" error={e.mobile}>
        {(a11y) => <input {...a11y} name="mobile" type="tel" inputMode="numeric" defaultValue={v.mobile} style={inputStyle} />}
      </Field>
      <Field label="City" error={e.city}>
        {(a11y) => (
          <select {...a11y} name="city" defaultValue={v.city ?? ""} style={inputStyle}>
            <option value="" disabled>Select a city</option>
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
      </Field>

      <fieldset aria-describedby={e.batch ? "batch-error" : undefined} style={{ marginBottom: 14 }}>
        <legend>Batch</legend>
        <label><input type="radio" name="batch" value="weekday" defaultChecked={v.batch === "weekday"} /> Weekday (Mon–Fri)</label>{" "}
        <label><input type="radio" name="batch" value="weekend" defaultChecked={v.batch === "weekend"} /> Weekend (Sat–Sun)</label>
        {e.batch && <p id="batch-error" role="alert" style={{ color: "#b91c1c" }}>{e.batch}</p>}
      </fieldset>

      <MessageField key={state.status + (v.message ?? "")} defaultValue={v.message} error={e.message} />

      <label style={{ display: "block", marginBottom: 14 }}>
        <input type="checkbox" name="agree" defaultChecked={v.agree} aria-invalid={e.agree ? "true" : "false"} /> I agree to the terms and fee policy (₹4,999)
        {e.agree && <span role="alert" style={{ color: "#b91c1c", display: "block" }}>{e.agree}</span>}
      </label>

      <SubmitButton />
    </form>
  );
}`
    },
    {
      heading: "16. Summary",
      content: `• **Controlled inputs** use \`value\` + \`onChange\` with state as the source of truth; **uncontrolled inputs** use \`defaultValue\` and are read with a ref or \`FormData\`. Never switch between the two.
• Each element has its own value prop: \`value\` for text, textarea and select (an array for \`multiple\`), \`checked\` for checkboxes and radios, and file inputs are always uncontrolled.
• One object in state plus one handler using \`[name]\` keys manages many fields cleanly.
• Client validation returns an errors object, shows messages after a field is touched, and never replaces server validation.
• Accessible forms need real labels (\`htmlFor\` + \`useId\`), \`aria-invalid\`, \`aria-describedby\`, \`role="alert"\` messages and focus management.
• **React Hook Form + Zod** suits large forms: uncontrolled performance, schema-based rules, and the \`zodResolver\` bridge.
• **React 19 form actions** pass \`FormData\` to a function, run it as a transition and reset the form on success.
• **\`useActionState\`** returns \`[state, formAction, isPending]\`, and the action receives \`(prevState, formData)\`.
• **\`useFormStatus\`** from \`react-dom\` gives a child component the parent form's \`pending\` status.
**Next lecture:** Lifting State Up, Composition & Reusable Component Patterns`
    }
  ]
};
