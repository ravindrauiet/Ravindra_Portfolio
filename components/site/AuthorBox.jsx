import Image from "next/image";
import Link from "next/link";

// Author card shown under articles, templates and prompts so readers (and reviewers) can see who wrote them
export default function AuthorBox({ label = "Written by" }) {
  return (
    <aside className="author-box" aria-label="About the author">
      <Image
        src="/assets/images/Ravindraprofile.jpeg"
        alt="Ravindra Nath Jha"
        width={96}
        height={96}
        className="author-box-photo"
      />
      <div>
        <span className="author-box-label">{label}</span>
        <p className="author-box-name">
          <Link href="/about">Ravindra Nath Jha</Link>
        </p>
        <p className="author-box-bio">
          Full stack developer and team lead at Townmanor Technology, with an M.Tech in Artificial Intelligence from IIT
          Jodhpur. I build web, mobile and AI products with React, Next.js, Node.js and Python, and I write these notes from
          that day-to-day work.
        </p>
        <p className="author-box-links">
          <Link href="/about">More about me</Link>
          <a href="https://www.linkedin.com/in/ravindra-jha75/" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href="https://github.com/ravindrauiet" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <Link href="/contact">Report an error</Link>
        </p>
      </div>
    </aside>
  );
}
