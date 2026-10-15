export default function JsonLd() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Ravindra Nath Jha",
    "alternateName": "Ravindra Jha",
    "url": "https://ravindranathjha.in",
    "image": "https://ravindranathjha.in/assets/images/Ravindraprofile.jpeg",
    "jobTitle": "Full Stack Developer, AI Engineer & Team Lead",
    "description": "Full Stack Developer, AI Engineer and Team Lead with an M.Tech in Artificial Intelligence from the Indian Institute of Technology (IIT) Jodhpur.",
    "alumniOf": [
      {
        "@type": "CollegeOrUniversity",
        "name": "Indian Institute of Technology Jodhpur",
        "alternateName": ["IIT Jodhpur", "IITJ"],
        "url": "https://www.iitj.ac.in",
        "sameAs": "https://en.wikipedia.org/wiki/Indian_Institute_of_Technology_Jodhpur"
      },
      {
        "@type": "CollegeOrUniversity",
        "name": "University Institute of Engineering and Technology, Maharshi Dayanand University",
        "alternateName": ["UIET MDU Rohtak"],
        "url": "https://mdu.ac.in"
      }
    ],
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "name": "Master of Technology (M.Tech) in Artificial Intelligence",
        "credentialCategory": "degree",
        "educationalLevel": "Postgraduate",
        "recognizedBy": { "@type": "CollegeOrUniversity", "name": "Indian Institute of Technology Jodhpur" }
      },
      {
        "@type": "EducationalOccupationalCredential",
        "name": "Bachelor of Technology (B.Tech) in Computer Science Engineering",
        "credentialCategory": "degree",
        "educationalLevel": "Undergraduate",
        "recognizedBy": { "@type": "CollegeOrUniversity", "name": "Maharshi Dayanand University" }
      }
    ],
    "telephone": "+919354156323",
    "worksFor": {
      "@type": "Organization",
      "name": "Townmanor Technology"
    },
    "sameAs": [
      "https://www.linkedin.com/in/ravindra-jha75/",
      "https://github.com/ravindrauiet",
      "https://wa.me/919354156323"
    ],
    "knowsAbout": [
      "React.js",
      "Next.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "React Native",
      "Full Stack Development",
      "MERN Stack",
      "Python",
      "AWS Cloud Deployment",
      "REST APIs",
      "Artificial Intelligence",
      "Machine Learning",
      "Deep Learning",
      "Large Language Models",
      "Generative AI",
      "Prompt Engineering"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Faridabad",
      "addressRegion": "Haryana",
      "addressCountry": "India"
    },
    "email": "mailto:ravindranathjha76@gmail.com"
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Ravindra Nath Jha Portfolio",
    "url": "https://ravindranathjha.in",
    "author": {
      "@type": "Person",
      "name": "Ravindra Nath Jha"
    },
    "description": "Official portfolio of Ravindra Nath Jha (M.Tech AI, IIT Jodhpur) showcasing full stack web and mobile apps, AI projects, freelancing services, free coding notes, UI templates and AI prompts."
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Ravindra Nath Jha - Freelance Full Stack Development",
    "image": "https://ravindranathjha.in/assets/images/Ravindraprofile.jpeg",
    "url": "https://ravindranathjha.in",
    "telephone": "+919354156323",
    "email": "ravindranathjha76@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Faridabad",
      "addressRegion": "Haryana",
      "addressCountry": "India"
    },
    "priceRange": "$$",
    "knowsAbout": [
      "Web & Mobile App Development",
      "MERN Stack Solutions",
      "AI & Smart Integration",
      "API & Backend Architecture",
      "Cloud & DevOps"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
