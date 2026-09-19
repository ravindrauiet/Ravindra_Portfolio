export default function manifest() {
  return {
    name: "Ravindra Nath Jha - Full Stack Developer Portfolio",
    short_name: "Ravindra Portfolio",
    description:
      "Portfolio of Ravindra Nath Jha, Full Stack Developer & Team Lead specializing in React.js, Node.js, and Mobile App Development.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2506ad",
    icons: [
      {
        src: "/assets/images/favicon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/assets/images/favicon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
