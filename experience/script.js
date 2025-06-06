$(document).ready(function(){

    $('#menu').click(function(){
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    $(window).on('scroll load',function(){
        $('#menu').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        if(window.scrollY>60){
            document.querySelector('#scroll-top').classList.add('active');
        }else{
            document.querySelector('#scroll-top').classList.remove('active');
        }
    });

    // Initialize Lottie animations if available
    if (typeof lottie !== 'undefined') {
        // Check for direct lottie-player elements
        const lottiePlayers = document.querySelectorAll('lottie-player');
        lottiePlayers.forEach(player => {
            // Force reload if needed
            const currentSrc = player.getAttribute('src');
            if (currentSrc) {
                player.load(currentSrc);
            }
        });
    }

    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: false,
        mirror: false,
        offset: 100
    });

    // Add tilt effect to experience cards
    VanillaTilt.init(document.querySelectorAll('.experience-card'), {
        max: 3,
        speed: 400,
        glare: true,
        "max-glare": 0.1
    });

    // Add tilt effect to project items
    VanillaTilt.init(document.querySelectorAll('.project-item'), {
        max: 5,
        speed: 400,
        scale: 1.03,
        transition: true,
        glare: true,
        "max-glare": 0.1
    });
    
    // Add tilt effect to showcase items
    VanillaTilt.init(document.querySelectorAll('.showcase-item'), {
        max: 5,
        speed: 400,
        scale: 1.02,
        transition: true,
        glare: true,
        "max-glare": 0.1
    });

    // Project Request Button Handling
    $('.request-btn').on('click', function() {
        const projectName = $(this).data('project');
        
        Swal.fire({
            title: 'Request a Similar Project',
            html: `
                <form id="project-request-form" class="request-form">
                    <div class="form-group">
                        <label for="name">Your Name</label>
                        <input type="text" id="name" class="swal2-input" placeholder="Enter your name">
                    </div>
                    <div class="form-group">
                        <label for="email">Your Email</label>
                        <input type="email" id="email" class="swal2-input" placeholder="Enter your email">
                    </div>
                    <div class="form-group">
                        <label for="details">Project Details</label>
                        <textarea id="details" class="swal2-textarea" placeholder="Tell me about your project needs...">${projectName} - I'd like to request a similar project...</textarea>
                    </div>
                </form>
            `,
            showCancelButton: true,
            confirmButtonText: 'Submit Request',
            confirmButtonColor: '#0177b5',
            cancelButtonText: 'Cancel',
            focusConfirm: false,
            preConfirm: () => {
                const name = Swal.getPopup().querySelector('#name').value;
                const email = Swal.getPopup().querySelector('#email').value;
                const details = Swal.getPopup().querySelector('#details').value;
                
                if (!name || !email) {
                    Swal.showValidationMessage('Please enter your name and email');
                    return false;
                }
                
                // Here you would normally send this data to a server
                // For demo purposes, we're just returning the values
                return { name, email, details };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // Show success message
                Swal.fire({
                    title: 'Request Sent!',
                    text: 'Thank you for your interest. I will contact you soon!',
                    icon: 'success',
                    confirmButtonColor: '#0177b5'
                });
                
                // In a real application, you would send this data to your backend
                console.log("Project Request:", result.value);
            }
        });
    });
    
    // Project Details Button Handling
    $('.details-btn').on('click', function() {
        const projectName = $(this).data('project');
        
        // Project details content based on the project name
        const projectDetails = {
            "Real Estate Platform": {
                challenge: "Create a scalable real estate platform with AI-driven recommendations and high-performance search.",
                solution: "Implemented a MERN stack application with custom search algorithms and machine learning for property recommendations.",
                timeline: "12 weeks",
                technologies: ["React", "Node.js", "MySQL", "Express", "AWS", "TensorFlow.js"],
                results: "42% increase in user conversions, 65% improvement in search speed, and 30% increase in user engagement time."
            },
            "Fika E-Commerce": {
                challenge: "Build a comprehensive e-commerce platform with multiple sellers, product categories, and secure payment processing.",
                solution: "Developed a full-stack application with React, Node.js, and MongoDB featuring a responsive design and mobile-first approach.",
                timeline: "14 weeks",
                technologies: ["React", "Node.js", "MongoDB", "Express", "AWS S3", "Stripe API", "Redux"],
                results: "55% growth in revenue, 40% increase in average order value, and 28% higher repeat customer rate."
            },
            "Click Mobile App": {
                challenge: "Create a cross-platform mobile application with offline capabilities and secure payment processing.",
                solution: "Built a React Native app with efficient state management, local storage, and integrated payment gateways.",
                timeline: "8 weeks",
                technologies: ["React Native", "Firebase", "Redux", "Stripe API", "Push Notifications"],
                results: "50,000+ downloads, 4.8 star rating, and 32% conversion rate on in-app purchases."
            }
        };
        
        // Get details for the current project
        const details = projectDetails[projectName] || {
            challenge: "Custom project challenge",
            solution: "Tailored solution approach",
            timeline: "Varies",
            technologies: ["Custom Technologies"],
            results: "Measurable outcomes"
        };
        
        // Create technologies HTML
        const techHTML = details.technologies.map(tech => `<span class="detail-tech">${tech}</span>`).join('');
        
        Swal.fire({
            title: projectName,
            html: `
                <div class="project-details">
                    <div class="detail-section">
                        <h4>The Challenge</h4>
                        <p>${details.challenge}</p>
                    </div>
                    <div class="detail-section">
                        <h4>My Solution</h4>
                        <p>${details.solution}</p>
                    </div>
                    <div class="detail-section">
                        <h4>Timeline</h4>
                        <p>${details.timeline}</p>
                    </div>
                    <div class="detail-section">
                        <h4>Technologies Used</h4>
                        <div class="detail-tech-container">
                            ${techHTML}
                        </div>
                    </div>
                    <div class="detail-section">
                        <h4>Results</h4>
                        <p>${details.results}</p>
                    </div>
                </div>
            `,
            width: '600px',
            confirmButtonText: 'Close',
            confirmButtonColor: '#0177b5',
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        });
    });

    // Tech stack particle blast animation function
    function createTechParticle(tech, x, y) {
        const particle = document.createElement('div');
        particle.className = 'tech-particle';
        
        // Map tech names to their logo URLs
        const techLogos = {
            'React': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
            'Node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
            'MongoDB': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
            'Express': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
            'MySQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
            'MySQl': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
            'Redux': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg',
            'Firebase': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
            'React Native': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
            'AWS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg',
            'AI': 'https://img.icons8.com/color/96/000000/artificial-intelligence.png',
            'AI/ML': 'https://img.icons8.com/color/96/000000/artificial-intelligence.png',
            'HTML': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
            'CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
            'JavaScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
            'Material UI': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg',
            'Chart.js': 'https://www.chartjs.org/img/chartjs-logo.svg',
            'Jest': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg',
            'REST APIs': 'https://img.icons8.com/color/96/000000/api-settings.png',
            'Payment Gateway': 'https://img.icons8.com/color/96/000000/card-security.png',
            'UI/UX': 'https://img.icons8.com/color/96/000000/design.png',
            'API Integration': 'https://img.icons8.com/color/96/000000/api.png',
            'Payment Integration': 'https://img.icons8.com/color/96/000000/card-security.png',
            'Debugging Tools': 'https://img.icons8.com/color/96/000000/bug.png',
            'React Testing Library': 'https://testing-library.com/img/octopus-128x128.png',
            'Express.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg'
        };
        
        // Create image or use a default tech icon
        if (techLogos[tech]) {
            const img = document.createElement('img');
            img.src = techLogos[tech];
            img.alt = tech;
            img.style.width = '100%';
            img.style.height = '100%';
            particle.appendChild(img);
        } else {
            // If no matching logo found, add text as fallback
            particle.textContent = tech;
        }
        
        // Add a small lottie animation behind the tech logo
        const lottieBg = document.createElement('div');
        lottieBg.className = 'particle-lottie-bg';
        
        // Choose a random Lottie animation
        const lottieAnimations = [
            'https://assets5.lottiefiles.com/packages/lf20_fcfjwiyb.json',
            'https://assets5.lottiefiles.com/packages/lf20_u4jjb9bd.json',
            'https://assets5.lottiefiles.com/private_files/lf30_nurnmupz.json',
            'https://assets2.lottiefiles.com/packages/lf20_ghfpjlso.json'
        ];
        
        const randomLottie = lottieAnimations[Math.floor(Math.random() * lottieAnimations.length)];
        
        const lottiePlayer = document.createElement('lottie-player');
        lottiePlayer.setAttribute('src', randomLottie);
        lottiePlayer.setAttribute('background', 'transparent');
        lottiePlayer.setAttribute('speed', '1');
        lottiePlayer.setAttribute('style', 'width: 100%; height: 100%;');
        lottiePlayer.setAttribute('loop', '');
        lottiePlayer.setAttribute('autoplay', '');
        
        lottieBg.appendChild(lottiePlayer);
        particle.prepend(lottieBg);
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.zIndex = '1001'; // Ensure high z-index
        
        // Add to container
        document.getElementById('tech-particles-container').appendChild(particle);
        
        // Random position and angle for animation
        const angle = Math.random() * Math.PI * 2; // Random angle in radians
        const distance = 100 + Math.random() * 300; // Random distance
        const finalX = x + Math.cos(angle) * distance;
        const finalY = y + Math.sin(angle) * distance;
        const scale = 0.5 + Math.random() * 0.5;
        const duration = 1000 + Math.random() * 2000; // Random duration
        
        // Animate with anime.js
        anime({
            targets: particle,
            left: finalX,
            top: finalY,
            opacity: [0, 1, 0],
            scale: [0, scale, 0],
            rotate: Math.random() * 360,
            easing: 'easeOutExpo',
            duration: duration,
            complete: function() {
                particle.remove();
            }
        });
        
        return particle;
    }
    
    // Tech stack blast effect on hover
    $('.project-item').on('mouseenter', function(e) {
        const techStack = $(this).attr('data-tech').split(', ');
        const rect = this.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Create particles for each tech
        techStack.forEach((tech, index) => {
            // Delay each particle creation slightly
            setTimeout(() => {
                createTechParticle(tech, centerX, centerY);
            }, index * 100);
        });
        
        // Add blast animation class
        $(this).addClass('tech-blast-active');
        
        // Remove the class after animation completes
        setTimeout(() => {
            $(this).removeClass('tech-blast-active');
        }, 500);
    });

    // Add click event to show tech details using SweetAlert2
    $('.project-item').click(function() {
        const tech = $(this).attr('data-tech');
        const learning = $(this).attr('data-learning');
        const projectName = $(this).find('h4').text();
        
        Swal.fire({
            title: projectName,
            html: `
                <div class="project-details-modal">
                    <div class="tech-stack">
                        <h5>Technologies Used</h5>
                        <p>${tech}</p>
                    </div>
                    <div class="learning">
                        <h5>Key Learnings</h5>
                        <p>${learning}</p>
                    </div>
                </div>
            `,
            confirmButtonText: 'Close',
            confirmButtonColor: '#010136',
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        });
    });
    
    // Create random tech particles occasionally
    function createRandomParticles() {
        // Get all tech stacks from project items
        const allTechs = [];
        $('.project-item').each(function() {
            const techs = $(this).attr('data-tech').split(', ');
            allTechs.push(...techs);
        });
        
        // Get unique techs
        const uniqueTechs = [...new Set(allTechs)];
        
        // Create a random particle occasionally
        if (Math.random() < 0.1 && uniqueTechs.length > 0) {
            const randomTech = uniqueTechs[Math.floor(Math.random() * uniqueTechs.length)];
            const randomX = Math.random() * window.innerWidth;
            const randomY = Math.random() * window.innerHeight;
            
            createTechParticle(randomTech, randomX, randomY);
        }
        
        // Continue the random particles
        setTimeout(createRandomParticles, 2000);
    }
    
    // Start random particles after a delay
    setTimeout(createRandomParticles, 5000);

    // Testimonial Slider functionality
    const testimonialSlider = $('.testimonial-slider');
    const testimonialCards = $('.testimonial-card');
    const dots = $('.dot');
    const prevBtn = $('#prev-testimonial');
    const nextBtn = $('#next-testimonial');
    
    let currentIndex = 0;
    const totalSlides = testimonialCards.length;
    
    // Set first testimonial as active
    $(testimonialCards[0]).addClass('active');
    
    // Function to show testimonial by index
    function showTestimonial(index) {
        // Update current index
        currentIndex = index;
        
        // Calculate scroll position
        const scrollPos = testimonialCards.eq(index).position().left + testimonialSlider.scrollLeft();
        
        // Scroll to position
        testimonialSlider.animate({
            scrollLeft: scrollPos
        }, 500);
        
        // Update active classes
        testimonialCards.removeClass('active');
        testimonialCards.eq(index).addClass('active');
        
        // Update dots
        dots.removeClass('active');
        dots.eq(index).addClass('active');
    }
    
    // Next button click
    nextBtn.on('click', function() {
        let nextIndex = currentIndex + 1;
        if (nextIndex >= totalSlides) {
            nextIndex = 0;
        }
        showTestimonial(nextIndex);
    });
    
    // Previous button click
    prevBtn.on('click', function() {
        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) {
            prevIndex = totalSlides - 1;
        }
        showTestimonial(prevIndex);
    });
    
    // Dot click
    dots.on('click', function() {
        const index = $(this).index();
        showTestimonial(index);
    });
    
    // Auto slide
    let autoSlideInterval;
    
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= totalSlides) {
                nextIndex = 0;
            }
            showTestimonial(nextIndex);
        }, 5000); // Change slide every 5 seconds
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    // Start auto slide
    startAutoSlide();
    
    // Pause auto slide on hover
    testimonialSlider.hover(stopAutoSlide, startAutoSlide);
    
    // Also add scroll reveal for testimonials
    srtop.reveal('.testimonial-card', { interval: 200 });
});

// Add styles for project details modal
const projectDetailStyles = `
.project-details {
    text-align: left;
    padding: 1rem;
}
.detail-section {
    margin-bottom: 1.5rem;
}
.detail-section h4 {
    color: #0177b5;
    font-size: 1.6rem;
    margin-bottom: 0.5rem;
}
.detail-section p {
    font-size: 1.4rem;
    color: #333;
    line-height: 1.5;
}
.detail-tech-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
}
.detail-tech {
    background: #e3f2fd;
    color: #0177b5;
    padding: 0.3rem 0.8rem;
    border-radius: 15px;
    font-size: 1.2rem;
}
.request-form {
    text-align: left;
}
.form-group {
    margin-bottom: 1.5rem;
}
.form-group label {
    display: block;
    font-size: 1.4rem;
    margin-bottom: 0.5rem;
    color: #333;
}
`;

// Add the styles to the document
(function() {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = projectDetailStyles;
    document.head.appendChild(styleSheet);
})();

/* ===== SCROLL REVEAL ANIMATION ===== */
const srtop = ScrollReveal({
    origin: 'top',
    distance: '80px',
    duration: 1000,
    reset: true
});

/* SCROLL EXPERIENCE */
srtop.reveal('.experience .timeline',{delay: 400});
srtop.reveal('.experience .timeline .container',{interval: 400}); 
srtop.reveal('.showcase-item',{interval: 200}); 


// Start of Tawk.to Live Chat
var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
(function () {
    var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/64ed3c17b2d3e13950eca106/1h8vb5hie';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    s0.parentNode.insertBefore(s1, s0);
})();
// End of Tawk.to Live Chat


// disable developer mode
document.onkeydown = function(e) {
  if(e.keyCode == 123) {
     return false;
  }
  if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
     return false;
  }
  if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
     return false;
  }
  if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
     return false;
  }
  if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
     return false;
  }
}

document.addEventListener('visibilitychange',
function(){
    if(document.visibilityState === "visible"){
        document.title = "Experience | Portfolio Ravindra Nath Jha";
        $("#favicon").attr("href","/assets/images/favicon.png");
    }
    else {
        document.title = "Come Back To Portfolio";
        $("#favicon").attr("href","/assets/images/favhand.png");
    }
});

// scroll top button
let scrollTop = document.querySelector('#scroll-top');

scrollTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// Portfolio Download functionality
$(document).ready(function() {
    $('#download-portfolio').on('click', function(e) {
        e.preventDefault();
        
        // Show loading state
        Swal.fire({
            title: 'Preparing Portfolio PDF',
            html: 'Please wait while we generate your download...',
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
                
                // Simulate PDF generation (would be server-side in production)
                setTimeout(() => {
                    Swal.close();
                    
                    // Show success and download options
                    Swal.fire({
                        title: 'Portfolio Ready!',
                        html: `
                            <p style="font-size: 1.6rem; margin-bottom: 2rem;">Your portfolio download is ready. Choose a format:</p>
                            <div class="download-options">
                                <button id="download-pdf" class="download-option">
                                    <i class="fas fa-file-pdf" style="font-size: 2.5rem; color: #e74c3c; margin-bottom: 1rem;"></i>
                                    <span>PDF Format</span>
                                </button>
                                <button id="download-doc" class="download-option">
                                    <i class="fas fa-file-word" style="font-size: 2.5rem; color: #3498db; margin-bottom: 1rem;"></i>
                                    <span>DOCX Format</span>
                                </button>
                            </div>
                        `,
                        showConfirmButton: false,
                        showCloseButton: true
                    });
                    
                    // Add styles for download options
                    const style = document.createElement('style');
                    style.innerHTML = `
                        .download-options {
                            display: flex;
                            justify-content: center;
                            gap: 2rem;
                            margin-top: 1rem;
                        }
                        .download-option {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            padding: 2rem;
                            border-radius: 10px;
                            background: #f8f9fa;
                            border: none;
                            cursor: pointer;
                            transition: all 0.3s ease;
                        }
                        .download-option:hover {
                            background: #e3f2fd;
                            transform: translateY(-5px);
                            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                        }
                        .download-option span {
                            font-size: 1.4rem;
                            font-weight: 600;
                            color: #2c3e50;
                        }
                    `;
                    document.head.appendChild(style);
                    
                    // Handle PDF download click
                    document.getElementById('download-pdf').addEventListener('click', function() {
                        // In production, this would be a real PDF download
                        // For demo, we'll just redirect to a sample PDF
                        window.open('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '_blank');
                        Swal.close();
                    });
                    
                    // Handle DOCX download click
                    document.getElementById('download-doc').addEventListener('click', function() {
                        // In production, this would be a real DOCX download
                        // For demo, we'll just simulate with a message
                        Swal.fire({
                            title: 'Download Started',
                            text: 'Your DOCX file is downloading...',
                            icon: 'success',
                            timer: 2000,
                            showConfirmButton: false
                        });
                    });
                    
                }, 2000); // Simulate 2 seconds of "generation time"
            }
        });
    });
});