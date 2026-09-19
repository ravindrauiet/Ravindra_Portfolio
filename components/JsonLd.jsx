export default function JsonLd() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Ravindra Nath Jha",
    "alternateName": "Ravindra Jha",
    "url": "https://ravindranathjha.in",
    "image": "https://ravindranathjha.in/assets/images/Ravindraprofile.jpeg",
    "jobTitle": "Full Stack Developer & Team Lead",
    "worksFor": {
      "@type": "Organization",
      "name": "Townmanor Technology"
    },
    "sameAs": [
      "https://www.linkedin.com/in/ravindra-jha75/",
      "https://github.com/ravindrauiet"
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
      "REST APIs"
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
    "description": "Official portfolio of Ravindra Nath Jha showcasing Full Stack Web & Mobile Apps, Freelancing Services, Skills, and Work Experience."
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Ravindra Nath Jha - Freelance Full Stack Development",
    "image": "https://ravindranathjha.in/assets/images/Ravindraprofile.jpeg",
    "url": "https://ravindranathjha.in",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </>
  );
}
