import Image from "next/image";

export default function About() {
  return (
    <section className="about" id="about">
      <h2 className="heading">
        <i className="fas fa-user-alt"></i> About <span>Me</span>
      </h2>

      <div className="row">
        <div className="image">
          <img
            draggable="false"
            className="tilt"
            src="/assets/images/Ravindraprofile.jpeg"
            alt="Ravindra Nath Jha"
          />
        </div>
        <div className="content">
          <h3>I'm Ravindra Nath Jha</h3>
          <span className="tag">
            Team Lead & Full Stack Development Specialist
          </span>

          <p>
            As a Team Lead at Townmanor Technology and former Senior Software Engineer, I've built extensive experience across diverse technology domains. My career spans leadership roles in established companies and startups, including significant contributions to "Puja Karo" where I helped build innovative solutions from the ground up. I've successfully delivered numerous projects spanning MERN stack, Python, PHP, and mobile development using React Native, Flutter, and Expo. My specialty lies in creating comprehensive e-commerce platforms, food delivery applications, and CRM systems with integrated AI capabilities using OpenAI and Gemini APIs. With expertise in cloud deployment (AWS EC2, Lambda, S3, Firebase, Azure), I focus on building scalable, high-performance applications that drive business growth through cutting-edge technology and SEO optimization.
          </p>

          <div className="box-container">
            <div className="box">
              <p>
                <span> email : </span> ravindranathjha76@gmail.com
              </p>
              <p>
                <span> place : </span> Faridabad, India - 121003
              </p>
            </div>
          </div>

          <div className="resumebtn">
            <a
              href="https://drive.google.com/file/d/1PGb6PrPcNRpGS68vi10P8psISD2H-Wx2/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
              className="btn"
            >
              <span>Resume</span>
              <i className="fas fa-chevron-right"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
