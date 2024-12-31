// 'DOMContentLoaded ensures our code runs only after the page finishes loading
// querySelectorAll is to select all navigation links
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault(); // Stop default jump behavior
            
            // Get the target section's ID from the link's href
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Get navbar height for offset
            const navHeight = document.querySelector('.navbar').offsetHeight;
            
            // Calculate the final scroll position
            const finalPosition = targetSection.offsetTop - navHeight;
            
            // Smooth scroll to section
            window.scrollTo({
                top: finalPosition,
                behavior: 'smooth'
            });
        });
    });
});

function highlightActiveSection() {
    const scrollPosition = window.scrollY;
    const navHeight = document.querySelector('.navbar').offsetHeight;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight;
        const sectionBottom = sectionTop + section.offsetHeight;

        //Find corresponding navigation link
        const correspondingLink = document.
        querySelector(`.nav-links a[href="#${section.id}"]`);

        //Check if section is in viewport
        if(scroll >= sectionTop && scrollPosition < sectionBottom) {
            correspondingLink.classList.add('active');
        } else {
            correspondingLink.classList.remove('active');
        }
    });
}

//Run on scroll and page load

window.addEventListener('scroll', highlightActiveSection);
highlightActiveSection(); //Run once on page load
