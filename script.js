// 'DOMContentLoaded' ensures our code runs only after the page finishes loading
// querySelectorAll is used to select all navigation links
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault(); // Stop the default "jump to" behavior of anchor tags
            
            // Get the target section's ID from the link's href attribute
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Get the height of the navbar for correct scroll offset
            const navHeight = document.querySelector('.navbar').offsetHeight;
            
            // Calculate the final scroll position, subtracting navbar height to avoid overlap
            const finalPosition = targetSection.offsetTop - navHeight;
            
            // Smooth scroll to the calculated final position
            window.scrollTo({
                top: finalPosition, // Scroll to the section
                behavior: 'smooth' // Ensure smooth scrolling

                
            });
        });
    });
    initializeSkillBars();
    initializeSkillCategories();
    initializeSkillDescriptions();


});

// Function to highlight the active section in the navigation bar based on scroll position
function highlightActiveSection() {
    const scrollPosition = window.scrollY; // Get the current scroll position of the page
    const navHeight = document.querySelector('.navbar').offsetHeight; // Get navbar height for offset calculation

    // Select all sections in the document
    const sections = document.querySelectorAll('section');

    // Loop through each section and check if it's within the viewport
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight; // Get the top position of the section relative to the viewport
        const sectionBottom = sectionTop + section.offsetHeight; // Get the bottom position of the section

        // Find the corresponding navigation link based on the section's ID
        const correspondingLink = document.querySelector(`.nav-links a[href="#${section.id}"]`);

        // Check if the section is within the viewport (is being viewed)
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            correspondingLink.classList.add('active'); // Add 'active' class to the link
        } else {
            correspondingLink.classList.remove('active'); // Remove 'active' class if section is not in view
        }
    });
}

// Run the highlightActiveSection function on scroll and page load
window.addEventListener('scroll', highlightActiveSection);
highlightActiveSection(); // Run once on page load to highlight the section already in view

function initializeSkillBars() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const level = skillBar.getAttribute('data-level');
                
                // Set the custom property for the animation
                skillBar.style.setProperty('--skill-level', `${level / 100}`);
                
                // Add the animation class
                skillBar.classList.add('animate');
                
                // Optional: Add a staggered delay for multiple bars
                const skillItems = entry.target.closest('.skill-bar-container')
                    .querySelectorAll('.skill-bar');
                
                Array.from(skillItems).forEach((bar, index) => {
                    bar.style.animationDelay = `${index * 0.2}s`;
                });

                observer.unobserve(skillBar);
            }
        });
    }, { threshold: 0.5 });

    // Observe all skill bars
    const skillBars = document.querySelectorAll('.skill-bar');
    skillBars.forEach(bar => observer.observe(bar));
}

// Add hover effect for skill categories
function initializeSkillCategories() {
    const categories = document.querySelectorAll('.skill-category');
    
    categories.forEach(category => {
        category.addEventListener('mouseenter', () => {
            category.classList.add('category-hover');
        });
        
        category.addEventListener('mouseleave', () => {
            category.classList.remove('category-hover');
        });
    });
}

function initializeSkillDescriptions() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    });

    document.querySelectorAll('.skill-item').forEach(item => {
        observer.observe(item);
    });
}