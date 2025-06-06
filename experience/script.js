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

    // Add tilt effect to project cards
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
});

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