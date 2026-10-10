import CopyButton from "@/components/library/CopyButton";

/* ---------- prose ---------- */

// **bold** (which may wrap `code`) or `inline code`
const INLINE = /(\*\*(?:`[^`]*`|[^*`]|\*(?!\*))+?\*\*|`[^`\n]+`)/g;

function inline(text) {
  return text.split(INLINE).map((part, index) => {
    if (!part) return null;
    if (part.length > 4 && part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{inline(part.slice(2, -2))}</strong>;
    }
    if (part.length > 2 && part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={index} className="lec-code">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

const BULLET = /^\s*[•\-–]\s+/;
const NUMBERED = /^\s*(\d+)[.)]\s+/;
const TABLE_ROW = /^\s*\|.*\|\s*$/;
const TABLE_RULE = /^\s*\|[\s:\-|]+\|\s*$/;
const TREE = /^\s*[├└│]/;
const HEADING = /^#{1,4}\s+/;
const CALLOUT = /^(⚠️|💡|📌)\s*/;

const cells = (row) =>
  row
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((cell) => cell.trim());

// Turns the plain-text lecture format into paragraphs, lists, tables, file trees and callouts
function renderBlocks(text, stackSlug) {
  const lines = text.split("\n");
  const blocks = [];
  let i = 0;

  // Collect consecutive lines that match a test
  const take = (test) => {
    const group = [];
    while (i < lines.length && test(lines[i])) {
      group.push(lines[i]);
      i += 1;
    }
    return group;
  };

  while (i < lines.length) {
    const line = lines[i];
    const key = blocks.length;

    if (!line.trim()) {
      i += 1;
    } else if (line.trim().startsWith("```")) {
      // Fenced code block written inside the prose: everything up to the closing fence
      i += 1;
      const code = take((l) => !l.trim().startsWith("```")).join("\n");
      i += 1;
      if (code.trim()) blocks.push(<LectureCode key={key} code={code} stackSlug={stackSlug} />);
    } else if (TREE.test(line)) {
      const group = take((l) => TREE.test(l));
      blocks.push(
        <pre key={key} className="lec-tree">
          {group.map((l, index) => (
            <span key={index}>
              {inline(l)}
              {"\n"}
            </span>
          ))}
        </pre>
      );
    } else if (TABLE_ROW.test(line)) {
      const rows = take((l) => TABLE_ROW.test(l)).filter((l) => !TABLE_RULE.test(l));
      const [head, ...body] = rows.map(cells);
      blocks.push(
        <div key={key} className="lec-table">
          <table>
            <thead>
              <tr>
                {head.map((cell, index) => (
                  <th key={index}>{inline(cell)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, index) => (
                    <td key={index}>{inline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (BULLET.test(line)) {
      const group = take((l) => BULLET.test(l));
      blocks.push(
        <ul key={key}>
          {group.map((l, index) => (
            <li key={index}>{inline(l.replace(BULLET, ""))}</li>
          ))}
        </ul>
      );
    } else if (NUMBERED.test(line)) {
      const start = Number(line.match(NUMBERED)[1]);
      const group = take((l) => NUMBERED.test(l));
      blocks.push(
        <ol key={key} start={start}>
          {group.map((l, index) => (
            <li key={index}>{inline(l.replace(NUMBERED, ""))}</li>
          ))}
        </ol>
      );
    } else if (HEADING.test(line)) {
      blocks.push(<h3 key={key}>{inline(line.replace(HEADING, ""))}</h3>);
      i += 1;
    } else if (CALLOUT.test(line)) {
      blocks.push(
        <p key={key} className="lec-callout">
          {inline(line.replace(CALLOUT, ""))}
        </p>
      );
      i += 1;
    } else {
      blocks.push(<p key={key}>{inline(line)}</p>);
      i += 1;
    }
  }

  return blocks;
}

export function LectureProse({ text, stackSlug }) {
  if (!text) return null;
  return <div className="lec-prose">{renderBlocks(text, stackSlug)}</div>;
}

/* ---------- code ---------- */

const KEYWORDS = new Set(
  (
    "const let var function return if else for while do import from export default async await class extends new " +
    "try catch finally throw switch case break continue typeof instanceof this super static yield of in " +
    "null undefined true false void delete " +
    "public private protected final abstract interface implements package int long double float boolean char byte short " +
    "throws enum record sealed permits " +
    "def elif lambda with as pass raise except global nonlocal assert and or not is None True False"
  ).split(" ")
);

const SHELL_START = /^(#!|\$ |npm |npx |pnpm |yarn |bun |pip |pip3 |python |python3 |uv |cd |git |mkdir |curl |java |javac |mvn |gradle |\.\/|docker |node |touch |export |source )/;

const LANG_LABELS = { js: "JavaScript", java: "Java", python: "Python", shell: "Terminal" };

function detectLanguage(code, stackSlug) {
  const firstLine = code.split("\n").find((line) => line.trim()) ?? "";
  if (SHELL_START.test(firstLine.trim()) || /^#\s/.test(firstLine)) return "shell";
  if (stackSlug === "python" || stackSlug === "ai") return "python";
  if (stackSlug === "java") return "java";
  return "js";
}

// "// app/blog/[slug]/page.js  →  /blog/:slug" -> "app/blog/[slug]/page.js"
function fileNameOf(code) {
  const firstLine = code.split("\n")[0] ?? "";
  const match = firstLine.match(/^\s*(?:\/\/|#|\/\*|<!--)\s*([\w@.\-/[\]()]+\.[A-Za-z]{1,5})(?=\s|$)/);
  return match ? match[1] : null;
}

// 1 triple-quoted string, 2 block comment, 3 line comment, 4 string, 5 number, 6 word
const TOKENS_SLASH =
  /("""[\s\S]*?"""|'''[\s\S]*?''')|(\/\*[\s\S]*?\*\/)|((?<![:\w])\/\/[^\n]*)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|(\b\d[\d_]*(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)/g;
// Same, but "#" starts a comment (Python, shell, .env, YAML)
const TOKENS_HASH =
  /("""[\s\S]*?"""|'''[\s\S]*?''')|(\/\*[\s\S]*?\*\/)|((?:^|(?<=\s))#[^\n]*)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|(\b\d[\d_]*(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)/gm;

// A small tokenizer for colouring only: text is never changed, just wrapped in spans
function highlight(code, language) {
  const pattern = language === "python" || language === "shell" ? TOKENS_HASH : TOKENS_SLASH;
  pattern.lastIndex = 0;

  const out = [];
  let last = 0;
  let match;

  while ((match = pattern.exec(code)) !== null) {
    if (match[0] === "") {
      pattern.lastIndex += 1;
      continue;
    }
    if (match.index > last) out.push(code.slice(last, match.index));

    const [text, triple, block, lineComment, string, number, word] = match;
    let className = null;
    if (block || lineComment) className = "tok-c";
    else if (triple || string) className = "tok-s";
    else if (number) className = "tok-n";
    else if (word) {
      if (KEYWORDS.has(word)) className = "tok-k";
      else if (code[pattern.lastIndex] === "(") className = "tok-f";
      else if (/^[A-Z][A-Za-z0-9]*[a-z]/.test(word)) className = "tok-t";
    }

    out.push(
      className ? (
        <span key={match.index} className={className}>
          {text}
        </span>
      ) : (
        text
      )
    );
    last = pattern.lastIndex;
  }

  if (last < code.length) out.push(code.slice(last));
  return out;
}

export function LectureCode({ code, stackSlug }) {
  const language = detectLanguage(code, stackSlug);
  const fileName = fileNameOf(code);

  return (
    <figure className="lec-codeblock">
      <figcaption>
        <span className="lec-codeblock-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="lec-codeblock-name">{fileName ?? LANG_LABELS[language]}</span>
        <CopyButton text={code} label="Copy" className="lib-copy-dark" />
      </figcaption>
      <pre tabIndex={0}>
        <code>{highlight(code, language)}</code>
      </pre>
    </figure>
  );
}
