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
    });
});

document.addEventListener('visibilitychange',
    function () {
        if (document.visibilityState === "visible") {
            document.title = "Projects | Portfolio Ravindra Nath Jha";
            $("#favicon").attr("href", "/assets/images/favicon.png");
        }
        else {
            document.title = "Come Back To Portfolio";
            $("#favicon").attr("href", "/assets/images/favhand.png");
        }
    });


// fetch projects start
function getProjects() {
    return fetch("projects.json")
        .then(response => response.json())
        .then(data => {
            return data
        });
}

// Parse URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Map tech parameter to filter category
function mapTechToFilter(tech) {
    const techMap = {
        'react': 'mern',
        'react-native': 'android',
        'flutter': 'android',
        'nodejs': 'mern',
        'express': 'mern',
        'mongodb': 'mern',
        'mysql': 'mern',
        'firebase': 'mern',
        'aws': 'aws',
        'cicd': 'aws',
        'github-actions': 'aws',
        'gcp': 'aws',
        'docker': 'aws',
        'ai': 'ai',
        'python': 'ai',
        'html': 'basicweb',
        'css': 'basicweb',
        'javascript': 'basicweb',
        'bootstrap': 'basicweb',
        'tailwind': 'basicweb',
        'materialui': 'mern'
    };
    
    return techMap[tech] || 'all';
}

// Debug function to verify container elements
function debugLottieContainers() {
    const containers = {
        'web-lottie-container': document.getElementById('web-lottie-container'),
        'ai-lottie-container': document.getElementById('ai-lottie-container'),
        'app-lottie-container': document.getElementById('app-lottie-container'),
        'cloud-lottie-container': document.getElementById('cloud-lottie-container')
    };
    
    console.log("=== Debugging Lottie Containers ===");
    Object.entries(containers).forEach(([name, element]) => {
        console.log(`${name}: ${element ? 'Found ✅' : 'Missing ❌'}`);
        if (element) {
            console.log(`- Position: ${getComputedStyle(element).position}`);
            console.log(`- Dimensions: ${element.offsetWidth}px × ${element.offsetHeight}px`);
            console.log(`- Visibility: ${getComputedStyle(element).visibility}`);
            console.log(`- Display: ${getComputedStyle(element).display}`);
        }
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
    
    // Debug containers before loading
    debugLottieContainers();
    
    // Web Development Lottie
    try {
        if (!document.getElementById('web-lottie-container')) {
            throw new Error('Web container element not found!');
        }
        
        lottie.loadAnimation({
            container: document.getElementById('web-lottie-container'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'https://assets1.lottiefiles.com/packages/lf20_o6spyjnc.json' // Projects animation from main site
        });
        console.log("Web Lottie loaded");
    } catch (e) {
        console.error("Error loading web lottie:", e);
    }
    
    // AI Lottie
    try {
        if (!document.getElementById('ai-lottie-container')) {
            throw new Error('AI container element not found!');
        }
        
        lottie.loadAnimation({
            container: document.getElementById('ai-lottie-container'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'https://assets8.lottiefiles.com/private_files/lf30_WdTEui.json' // Hero animation from main site
        });
        console.log("AI Lottie loaded");
    } catch (e) {
        console.error("Error loading AI lottie:", e);
    }
    
    // App Development Lottie
    try {
        if (!document.getElementById('app-lottie-container')) {
            throw new Error('App container element not found!');
        }
        
        const appAnimation = lottie.loadAnimation({
            container: document.getElementById('app-lottie-container'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'https://assets3.lottiefiles.com/datafiles/fab7172a9302d416bcdb8ac7e1c71123/data.json' // Mobile app animation
        });
        
        // Add event listeners for app animation
        appAnimation.addEventListener('data_ready', () => console.log('App animation data loaded successfully'));
        appAnimation.addEventListener('error', (error) => console.error('App animation error:', error));
        
        console.log("App Lottie loaded");
    } catch (e) {
        console.error("Error loading App lottie:", e);
    }
    
    // Cloud & DevOps Lottie
    try {
        if (!document.getElementById('cloud-lottie-container')) {
            throw new Error('Cloud container element not found!');
        }
        
        const cloudAnimation = lottie.loadAnimation({
            container: document.getElementById('cloud-lottie-container'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'https://assets1.lottiefiles.com/packages/lf20_q77jpypy.json' // Cloud animation
        });
        
        // Add event listeners for cloud animation
        cloudAnimation.addEventListener('data_ready', () => console.log('Cloud animation data loaded successfully'));
        cloudAnimation.addEventListener('error', (error) => console.error('Cloud animation error:', error));
        
        console.log("Cloud Lottie loaded");
    } catch (e) {
        console.error("Error loading Cloud lottie:", e);
    }
}

function showProjects(projects) {
    // Create project cards
    function createProjectCard(project) {
        // Create tech stack badges
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
    
    // Populate each category section with relevant projects
    const projectContainers = document.querySelectorAll('.projects-container');
    
    projectContainers.forEach(container => {
        const categories = container.dataset.category.split(' ');
        const relevantProjects = projects.filter(project => 
            categories.includes(project.category)
        );
        
        // Create HTML for projects
        let projectsHTML = '';
        relevantProjects.forEach(project => {
            projectsHTML += createProjectCard(project);
        });
        
        // If no projects match this category, show a message
        if (relevantProjects.length === 0) {
            projectsHTML = `
            <div class="no-projects">
                <i class="fas fa-folder-open"></i>
                <p>No projects in this category yet.</p>
            </div>`;
        }
        
        container.innerHTML = projectsHTML;
    });
    
    // Initialize Vanilla Tilt on all project cards
    VanillaTilt.init(document.querySelectorAll(".tilt"), {
        max: 15,
        speed: 300,
        glare: true,
        "max-glare": 0.2,
    });
    
    // Set up scroll reveal animation
    const srtop = ScrollReveal({
        origin: 'bottom',
        distance: '80px',
        duration: 1000,
        reset: true
    });
    
    srtop.reveal('.project-card', { interval: 200 });
    
    // Handle filter buttons
    setupFilters(projects);
}

function setupFilters(projects) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    // Check if there's a tech filter in the URL
    const techParam = getUrlParameter('tech');
    if (techParam) {
        const filter = mapTechToFilter(techParam);
        
        // Set the appropriate filter button as active
        filterBtns.forEach(btn => {
            if (btn.getAttribute('data-filter') === filter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Show all sections by default
        document.querySelectorAll('.category-section').forEach(section => {
            section.style.display = 'block';
        });
        
        // If filter is specific, scroll to that section
        if (filter !== 'all') {
            setTimeout(() => {
                let targetSection;
                
                switch(filter) {
                    case 'basicweb':
                    case 'mern':
                        targetSection = document.getElementById('web-projects');
                        break;
                    case 'android':
                        targetSection = document.getElementById('app-projects');
                        break;
                    case 'ai':
                        targetSection = document.getElementById('ai-projects');
                        break;
                    case 'aws':
                        targetSection = document.getElementById('cloud-projects');
                        break;
                }
                
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 500);
        }
    }
    
    // Add event listeners to filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            // Show/hide projects based on filter
            if (filter === 'all') {
                // Show all sections
                document.querySelectorAll('.category-section').forEach(section => {
                    section.style.display = 'block';
                });
                
                // Show all projects
                projectCards.forEach(card => {
                    card.style.display = 'flex';
                });
            } else {
                // Show only relevant sections
                document.querySelectorAll('.category-section').forEach(section => {
                    if (section.querySelector(`.projects-container[data-category*="${filter}"]`)) {
                        section.style.display = 'block';
                    } else {
                        section.style.display = 'none';
                    }
                });
                
                // Show only projects matching the filter
                projectCards.forEach(card => {
                    if (card.dataset.category === filter) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                // Scroll to the first visible section
                setTimeout(() => {
                    const visibleSection = document.querySelector('.category-section[style="display: block;"]');
                    if (visibleSection) {
                        visibleSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
            }
        });
    });
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded");
    
    // Debug container elements
    console.log("Checking container elements...");
    debugLottieContainers();
    
    // Initialize Lottie animations
    console.log("Starting Lottie animation initialization...");
    initLottieAnimations();
    
    // Fetch and display projects
    getProjects().then(data => {
        showProjects(data);
    }).catch(err => {
        console.error("Error loading projects:", err);
    });
    
    // Scroll to top button functionality
    document.getElementById('scroll-top').addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

/// Start of Tawk.to Live Chat
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
