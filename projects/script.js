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

function showProjects(projects) {
    let projectsContainer = document.querySelector(".work .box-container");
    let projectsHTML = "";
    
    projects.forEach(project => {
        // Create tech stack badges
        let techStackHTML = '';
        if (project.tech_stack) {
            project.tech_stack.slice(0, 5).forEach(tech => {
                techStackHTML += `<span class="tech-badge">${tech}</span>`;
            });
        }
        
        projectsHTML += `
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
    });
    
    projectsContainer.innerHTML = projectsHTML;

    // Vanilla tilt.js
    VanillaTilt.init(document.querySelectorAll(".tilt"), {
        max: 15,
        speed: 300,
        glare: true,
        "max-glare": 0.2,
    });

    // Filter buttons functionality
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
        
        // Show/hide projects based on filter
        projectCards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
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
            projectCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

getProjects().then(data => {
    showProjects(data);
})
// fetch projects end

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
