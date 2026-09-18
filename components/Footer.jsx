import Link from "next/link";

export default function Footer() {
  return (
    <section className="footer">
      <div className="box-container">
        <div className="box">
          <h3>Ravindra Nath Jha's Portfolio</h3>
          <p>
            Thank you for visiting my personal portfolio website. Connect with me over social media platforms!
            <br />
            <br />
            Keep Rising 🚀. Connect with me over live chat!
          </p>
        </div>

        <div className="box">
          <h3>Quick Links</h3>
          <Link href="/#home">
            <i className="fas fa-chevron-circle-right"></i> Home
          </Link>
          <Link href="/#about">
            <i className="fas fa-chevron-circle-right"></i> About
          </Link>
          <Link href="/skills">
            <i className="fas fa-chevron-circle-right"></i> Skills
          </Link>
          <Link href="/projects">
            <i className="fas fa-chevron-circle-right"></i> Work
          </Link>
          <Link href="/experience">
            <i className="fas fa-chevron-circle-right"></i> Experience
          </Link>
        </div>

        <div className="box">
          <h3>Contact Info</h3>
          <p>
            <i className="fas fa-envelope"></i> ravindranathjha76@gmail.com
          </p>
          <p>
            <i className="fas fa-map-marked-alt"></i> Faridabad, India - 121003
          </p>
          <div className="share">
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

      <h1 className="credit">
        Designed with <i className="fa fa-heart pulse"></i> by{" "}
        <a href="https://www.linkedin.com/in/ravindra-jha75/">Ravindra Nath Jha</a>
      </h1>
    </section>
  );
}
