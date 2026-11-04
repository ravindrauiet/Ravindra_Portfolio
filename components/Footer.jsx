import Link from "next/link";

export default function Footer() {
  return (
    <section className="footer">
      <div className="box-container">
        <div className="box">
          <h3>Ravindra Nath Jha</h3>
          <p>
            Free, in-depth programming notes, UI templates, parallax website demos and AI prompts for developers. Written
            and maintained by Ravindra Nath Jha, full stack developer (M.Tech AI, IIT Jodhpur).
            <br />
            <br />
            Found an error or have a question? <Link href="/contact">Get in touch</Link>.
          </p>
        </div>

        <div className="box">
          <h3>Quick Links</h3>
          <Link href="/">
            <i className="fas fa-chevron-circle-right"></i> Home
          </Link>
          <Link href="/skills">
            <i className="fas fa-chevron-circle-right"></i> Skills
          </Link>
          <Link href="/notes">
            <i className="fas fa-chevron-circle-right"></i> Notes
          </Link>
          <Link href="/templates">
            <i className="fas fa-chevron-circle-right"></i> Templates
          </Link>
          <Link href="/prompts">
            <i className="fas fa-chevron-circle-right"></i> Prompts
          </Link>
          <Link href="/projects">
            <i className="fas fa-chevron-circle-right"></i> Work
          </Link>
          <Link href="/experience">
            <i className="fas fa-chevron-circle-right"></i> Experience
          </Link>
          <Link href="/about">
            <i className="fas fa-chevron-circle-right"></i> About
          </Link>
          <Link href="/contact">
            <i className="fas fa-chevron-circle-right"></i> Contact
          </Link>
          <Link href="/privacy-policy">
            <i className="fas fa-chevron-circle-right"></i> Privacy Policy
          </Link>
          <Link href="/terms">
            <i className="fas fa-chevron-circle-right"></i> Terms of Use
          </Link>
          <Link href="/disclaimer">
            <i className="fas fa-chevron-circle-right"></i> Disclaimer
          </Link>
        </div>

        <div className="box">
          <h3>Contact Info</h3>
          <p>
            <i className="fas fa-phone-alt"></i>{" "}
            <a href="tel:9354156323" style={{ color: "inherit", textDecoration: "none" }}>
              +91 9354156323
            </a>
          </p>
          <p>
            <i className="fas fa-envelope"></i>{" "}
            <a href="mailto:ravindranathjha76@gmail.com" style={{ color: "inherit", textDecoration: "none" }}>
              ravindranathjha76@gmail.com
            </a>
          </p>
          <p>
            <i className="fas fa-map-marked-alt"></i> Faridabad, India - 121003
          </p>
          <div className="share">
            <a
              href="https://wa.me/919354156323"
              className="fab fa-whatsapp"
              aria-label="WhatsApp"
              target="_blank"
              rel="noreferrer"
            ></a>
            <a
              href="https://www.linkedin.com/in/ravindra-jha75/"
              className="fab fa-linkedin"
              aria-label="LinkedIn"
              target="_blank"
              rel="noreferrer"
            ></a>
            <a
              href="https://github.com/ravindrauiet"
              className="fab fa-github"
              aria-label="GitHub"
              target="_blank"
              rel="noreferrer"
            ></a>
            <a
              href="mailto:ravindranathjha76@gmail.com"
              className="fas fa-envelope"
              aria-label="Mail"
              target="_blank"
              rel="noreferrer"
            ></a>
          </div>
        </div>
      </div>

      <p className="credit">
        Designed with <i className="fa fa-heart pulse"></i> by{" "}
        <a href="https://www.linkedin.com/in/ravindra-jha75/">Ravindra Nath Jha</a>
      </p>
    </section>
  );
}
