/* Particles.js config — Dark Neon Cyan Theme */
particlesJS('particles-js', {
  "particles": {
    "number": { "value": 55, "density": { "enable": true, "value_area": 900 } },
    "color": { "value": ["#00f2fe", "#4facfe", "#ffffff"] },
    "shape": {
      "type": ["circle", "triangle"],
      "stroke": { "width": 0, "color": "#000" }
    },
    "opacity": {
      "value": 0.45,
      "random": true,
      "anim": { "enable": true, "speed": 0.8, "opacity_min": 0.1, "sync": false }
    },
    "size": {
      "value": 3,
      "random": true,
      "anim": { "enable": true, "speed": 2, "size_min": 0.5, "sync": false }
    },
    "line_linked": {
      "enable": true,
      "distance": 140,
      "color": "#00f2fe",
      "opacity": 0.15,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 1.8,
      "direction": "none",
      "random": true,
      "straight": false,
      "out_mode": "out",
      "attract": { "enable": true, "rotateX": 600, "rotateY": 1200 }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": { "enable": true, "mode": "grab" },
      "onclick": { "enable": true, "mode": "push" },
      "resize": true
    },
    "modes": {
      "grab": { "distance": 180, "line_linked": { "opacity": 0.7 } },
      "bubble": { "distance": 300, "size": 8, "duration": 2, "opacity": 0.8, "speed": 3 },
      "repulse": { "distance": 150 },
      "push": { "particles_nb": 3 },
      "remove": { "particles_nb": 2 }
    }
  },
  "retina_detect": true
});