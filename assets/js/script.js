$(document).ready(function () {

    $('#menu').click(function () {
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    $(window).on('scroll load', function () {
        $('#menu').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        if (window.scrollY > 60) {
            document.querySelector('#scroll-top').classList.add('active');
        } else {
            document.querySelector('#scroll-top').classList.remove('active');
        }

        // scroll spy
        $('section').each(function () {
            let height = $(this).height();
            let offset = $(this).offset().top - 200;
            let top = $(window).scrollTop();
            let id = $(this).attr('id');

            if (top > offset && top < offset + height) {
                $('.navbar ul li a').removeClass('active');
                $('.navbar').find(`[href="#${id}"]`).addClass('active');
            }
        });
    });

    // smooth scrolling
    $('a[href*="#"]').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top,
        }, 500, 'linear')
    });

    // <!-- emailjs to mail contact form data -->
    $("#contact-form").submit(function (event) {
        emailjs.init("zTFWPDbeW-A6PcfZM");

        emailjs.sendForm('service_50h2ntf', 'template_w65rzn5', '#contact-form')
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);
                document.getElementById("contact-form").reset();
                alert("Form Submitted Successfully");
            }, function (error) {
                console.log('FAILED...', error);
                alert("Form Submission Failed! Try Again");
            });
        event.preventDefault();
    });
    // <!-- emailjs to mail contact form data -->

});
document.addEventListener('visibilitychange',
    function () {
        if (document.visibilityState === "visible") {
            document.title = "Portfolio | Ashish Pathak";
            $("#favicon").attr("href", "assets/images/favicon.png");
        }
        else {
            document.title = "Come Back To Portfolio";
            $("#favicon").attr("href", "assets/images/favhand.png");
        }
    });


// <!-- typed js effect starts -->
var typed = new Typed(".typing-text", {
    strings: ["frontend development", "backend development", "web designing", "web development", "Machine Learning"],
    loop: true,
    typeSpeed: 50,
    backSpeed: 25,
    backDelay: 500,
});
// <!-- typed js effect ends -->

async function fetchData(type = "skills") {
    let response
    type === "skills" ?
        response = await fetch("skills.json")
        :
        response = await fetch("./projects/projects.json")
    const data = await response.json();
    return data;
}

function showSkills(skills) {
    // We're no longer displaying the skills with images
    // Instead, we're using the categorizeSkills function to display skills with icons
    
    // This function is kept for backward compatibility
    // but will be replaced by categorizeSkills
    console.log("Skills loaded and categorized");
}

function showProjects(projects) {
    let projectsContainer = document.querySelector("#work .box-container");
    let projectHTML = "";
    
    // Store all projects for filtering
    window.allProjects = projects;
    
    // Function to create project card HTML
    function createProjectCard(project) {
        let techStackHTML = '';
        if (project.tech_stack) {
            project.tech_stack.slice(0, 5).forEach(tech => {
                techStackHTML += `<span class="tech-badge">${tech}</span>`;
            });
        }
        
        return `
        <div class="project-card tilt" data-category="${project.category}">
            <div class="project-image">
                <img draggable="false" src="/assets/images/projects/${project.image}.png" alt="${project.name}" onerror="this.src='https://via.placeholder.com/800x500/2a2a2a/ffffff?text=${project.name}'"/>
                <div class="project-overlay">
                    <div class="overlay-btns">
                        <a href="${project.links.view}" class="overlay-btn" target="_blank"><i class="fas fa-eye"></i> View</a>
                        <a href="${project.links.code}" class="overlay-btn" target="_blank"><i class="fas fa-code"></i> Code</a>
                    </div>
                </div>
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.name}</h3>
                <p class="project-description">${project.desc}</p>
                <div class="tech-stack">
                    ${techStackHTML}
                    ${project.tech_stack && project.tech_stack.length > 5 ? `<span class="tech-badge more">+${project.tech_stack.length - 5} more</span>` : ''}
                </div>
                <div class="project-footer">
                    <span class="project-category"><i class="fas fa-folder"></i> ${project.category.toUpperCase()}</span>
                    <div class="project-links">
                        <a href="${project.links.view}" title="View Live" target="_blank"><i class="fas fa-external-link-alt"></i></a>
                        <a href="${project.links.code}" title="View Code" target="_blank"><i class="fab fa-github"></i></a>
                    </div>
                </div>
            </div>
        </div>`;
    }

    // Display initial 4 projects
    projects.slice(0, 4).forEach(project => {
        projectHTML += createProjectCard(project);
    });
    projectsContainer.innerHTML = projectHTML;

    // Filter buttons functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Add event listeners to filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            let filteredProjects = window.allProjects;
            
            // Filter projects based on category
            if (filter !== 'all') {
                filteredProjects = window.allProjects.filter(project => project.category === filter);
            }
            
            // Only show first 4 of filtered projects
            let filteredHTML = "";
            filteredProjects.slice(0, 4).forEach(project => {
                filteredHTML += createProjectCard(project);
            });
            
            projectsContainer.innerHTML = filteredHTML;
            
            // Reinitialize tilt effect for new cards
            VanillaTilt.init(document.querySelectorAll(".tilt"), {
                max: 15,
                speed: 300,
                glare: true,
                "max-glare": 0.2,
            });
        });
    });

    // Tilt effect for initial cards
    VanillaTilt.init(document.querySelectorAll(".tilt"), {
        max: 15,
        speed: 300,
        glare: true,
        "max-glare": 0.2,
    });

    // Scroll reveal animation
    const srtop = ScrollReveal({
        origin: 'bottom',
        distance: '80px',
        duration: 1000,
        reset: true
    });

    srtop.reveal('.project-card', { interval: 200 });
}

// Initialize everything when the DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
    // Initialize Lottie animations
    initLottieAnimations();
    
    // Fetch and categorize skills
    fetchData().then(data => {
        categorizeSkills(data);
    });
    
    // Fetch and display projects
    fetchData("projects").then(data => {
        showProjects(data);
    });
});

// <!-- tilt js effect starts -->
VanillaTilt.init(document.querySelectorAll(".tilt"), {
    max: 15,
});
// <!-- tilt js effect ends -->


// pre loader start
// function loader() {
//     document.querySelector('.loader-container').classList.add('fade-out');
// }
// function fadeOut() {
//     setInterval(loader, 500);
// }
// window.onload = fadeOut;
// pre loader end

// disable developer mode
document.onkeydown = function (e) {
    if (e.keyCode == 123) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
        return false;
    }
}

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



/* ===== SCROLL REVEAL ANIMATION ===== */
const srtop = ScrollReveal({
    origin: 'top',
    distance: '80px',
    duration: 1000,
    reset: true
});

/* SCROLL HOME */
srtop.reveal('.home .content h3', { delay: 200 });
srtop.reveal('.home .content p', { delay: 200 });
srtop.reveal('.home .content .btn', { delay: 200 });

srtop.reveal('.home .image', { delay: 400 });
srtop.reveal('.home .linkedin', { interval: 600 });
srtop.reveal('.home .github', { interval: 800 });
srtop.reveal('.home .twitter', { interval: 1000 });
srtop.reveal('.home .telegram', { interval: 600 });
srtop.reveal('.home .instagram', { interval: 600 });
srtop.reveal('.home .dev', { interval: 600 });

/* SCROLL ABOUT */
srtop.reveal('.about .content h3', { delay: 200 });
srtop.reveal('.about .content .tag', { delay: 200 });
srtop.reveal('.about .content p', { delay: 200 });
srtop.reveal('.about .content .box-container', { delay: 200 });
srtop.reveal('.about .content .resumebtn', { delay: 200 });


/* SCROLL SKILLS */
srtop.reveal('.skills .container', { interval: 200 });
srtop.reveal('.skills .container .bar', { delay: 400 });

/* SCROLL EDUCATION */
srtop.reveal('.education .box', { interval: 200 });

/* SCROLL PROJECTS */
srtop.reveal('.work .box', { interval: 200 });

/* SCROLL EXPERIENCE */
srtop.reveal('.experience .timeline', { delay: 400 });
srtop.reveal('.experience .timeline .container', { interval: 400 });

/* SCROLL CONTACT */
srtop.reveal('.contact .container', { delay: 400 });
srtop.reveal('.contact .container .form-group', { delay: 400 });

// Categorize and display skills
function categorizeSkills(skills) {
    const categories = {
        frontend: ['ReactJS', 'HTML5', 'CSS3', 'JavaScript', 'MaterialUI', 'TailwindCSS', 'Bootstrap', 'jQuery', 'Redux', 'React Native', 'Flutter'],
        backend: ['NodeJS', 'ExpressJS', 'Python', 'C++', 'RESTful APIs', 'JWT', 'Socket.io'],
        database: ['MongoDB', 'MySQL', 'Firebase'],
        other: ['Git VCS', 'GitHub', 'WordPress', 'AWS EC2', 'AWS S3', 'CI/CD', 'GitHub Actions', 'Google Cloud', 'Docker']
    };

    // Technology-specific icons
    const techIcons = {
        'ReactJS': 'fab fa-react',
        'HTML5': 'fab fa-html5',
        'CSS3': 'fab fa-css3-alt',
        'JavaScript': 'fab fa-js-square',
        'MaterialUI': 'fas fa-palette',
        'TailwindCSS': 'fas fa-wind',
        'Bootstrap': 'fab fa-bootstrap',
        'jQuery': 'fab fa-js',
        'Redux': 'fas fa-database',
        'NodeJS': 'fab fa-node-js',
        'ExpressJS': 'fab fa-node',
        'Python': 'fab fa-python',
        'C++': 'fas fa-code',
        'MongoDB': 'fas fa-database',
        'MySQL': 'fas fa-server',
        'Git VCS': 'fab fa-git-alt',
        'GitHub': 'fab fa-github',
        'WordPress': 'fab fa-wordpress',
        'React Native': 'fab fa-react',
        'Flutter': 'fas fa-mobile-alt',
        'RESTful APIs': 'fas fa-code',
        'JWT': 'fas fa-shield-alt',
        'Socket.io': 'fas fa-plug',
        'Firebase': 'fas fa-fire',
        'AWS EC2': 'fab fa-aws',
        'AWS S3': 'fab fa-aws',
        'CI/CD': 'fas fa-code-branch',
        'GitHub Actions': 'fab fa-github',
        'Google Cloud': 'fab fa-google',
        'Docker': 'fab fa-docker'
    };

    // Project counts and links for each skill
    const skillProjects = {
        'ReactJS': { count: 5, link: '/projects?tech=react' },
        'HTML5': { count: 8, link: '/projects?tech=html' },
        'CSS3': { count: 8, link: '/projects?tech=css' },
        'JavaScript': { count: 7, link: '/projects?tech=javascript' },
        'MaterialUI': { count: 3, link: '/projects?tech=materialui' },
        'TailwindCSS': { count: 4, link: '/projects?tech=tailwind' },
        'Bootstrap': { count: 6, link: '/projects?tech=bootstrap' },
        'jQuery': { count: 2, link: '/projects?tech=jquery' },
        'Redux': { count: 2, link: '/projects?tech=redux' },
        'NodeJS': { count: 4, link: '/projects?tech=nodejs' },
        'ExpressJS': { count: 4, link: '/projects?tech=express' },
        'Python': { count: 2, link: '/projects?tech=python' },
        'C++': { count: 1, link: '/projects?tech=cpp' },
        'MongoDB': { count: 3, link: '/projects?tech=mongodb' },
        'MySQL': { count: 2, link: '/projects?tech=mysql' },
        'Git VCS': { count: 10, link: '/projects?tech=git' },
        'GitHub': { count: 10, link: '/projects?tech=github' },
        'WordPress': { count: 1, link: '/projects?tech=wordpress' },
        'React Native': { count: 3, link: '/projects?tech=react-native' },
        'Flutter': { count: 1, link: '/projects?tech=flutter' },
        'RESTful APIs': { count: 4, link: '/projects?tech=api' },
        'JWT': { count: 3, link: '/projects?tech=jwt' },
        'Socket.io': { count: 2, link: '/projects?tech=socket' },
        'Firebase': { count: 2, link: '/projects?tech=firebase' },
        'AWS EC2': { count: 1, link: '/projects?tech=aws' },
        'AWS S3': { count: 1, link: '/projects?tech=aws' },
        'CI/CD': { count: 1, link: '/projects?tech=cicd' },
        'GitHub Actions': { count: 1, link: '/projects?tech=github-actions' },
        'Google Cloud': { count: 1, link: '/projects?tech=gcp' },
        'Docker': { count: 1, link: '/projects?tech=docker' }
    };

    // Calculate max projects for percentage calculation
    const maxProjects = Math.max(...Object.values(skillProjects).map(p => p.count));

    // Load skills into their respective categories
    skills.forEach(skill => {
        let category = 'other';
        for (const [cat, skills] of Object.entries(categories)) {
            if (skills.includes(skill.name)) {
                category = cat;
                break;
            }
        }

        const projectInfo = skillProjects[skill.name] || { count: 0, link: '/projects' };
        // Calculate progress percentage based on project count
        const progressPercentage = (projectInfo.count / maxProjects) * 100;
        
        const skillElement = `
            <div class="skill-card" title="${skill.name}">
                <div class="skill-info">
                    <i class="${techIcons[skill.name] || 'fas fa-code'}"></i>
                    <span class="skill-name">${skill.name}</span>
                </div>
                <div class="skill-level">
                    <div class="skill-progress" data-width="${progressPercentage}%" data-projects="${projectInfo.count}"></div>
                </div>
                <a href="${projectInfo.link}" class="project-count" title="View ${projectInfo.count} projects using ${skill.name}">
                    <i class="fas fa-project-diagram"></i>
                    <span>${projectInfo.count} Projects</span>
                </a>
            </div>
        `;

        document.getElementById(`${category}Skills`).innerHTML += skillElement;
    });

    // Animate skill progress bars when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.getAttribute('data-width');
                progressBar.style.width = width;
                observer.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.skill-progress').forEach(progress => {
        progress.style.width = '0';
        observer.observe(progress);
    });
}

// Initialize Lottie Animations
function initLottieAnimations() {
    console.log("Initializing Lottie animations...");
    
    // Check if Lottie is available
    if (typeof lottie === 'undefined') {
        console.error("Lottie library not loaded!");
        return;
    }
    
    // Check if containers exist
    const projectsContainer = document.getElementById('projects-lottie-container');
    if (!projectsContainer) {
        console.error("Projects Lottie container not found!");
    } else {
        console.log("Projects container found, loading animation...");
    }
    
    // Hero section lottie
    try {
        lottie.loadAnimation({
            container: document.getElementById('hero-lottie-container'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'https://assets8.lottiefiles.com/private_files/lf30_WdTEui.json'
        });
        console.log("Hero Lottie loaded");
    } catch (e) {
        console.error("Error loading hero lottie:", e);
    }

    // Skills section lottie
    try {
        lottie.loadAnimation({
            container: document.getElementById('skills-lottie-container'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'https://assets3.lottiefiles.com/packages/lf20_vi7vibep.json'
        });
        console.log("Skills Lottie loaded");
    } catch (e) {
        console.error("Error loading skills lottie:", e);
    }

    // Projects section lottie
    try {
        lottie.loadAnimation({
            container: document.getElementById('projects-lottie-container'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'https://assets1.lottiefiles.com/packages/lf20_o6spyjnc.json' // Updated to a reliable project animation
        });
        console.log("Projects Lottie loaded");
    } catch (e) {
        console.error("Error loading projects lottie:", e);
    }

    // Services section lottie
    try {
        lottie.loadAnimation({
            container: document.getElementById('services-lottie-container'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'https://assets3.lottiefiles.com/packages/lf20_QKHhrP.json'
        });
        console.log("Services Lottie loaded");
    } catch (e) {
        console.error("Error loading services lottie:", e);
    }
}