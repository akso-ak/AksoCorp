async function onLoad() {
    let form = document.getElementById("my-form");
    if (form) {
        form.addEventListener("submit", handleSubmit)
    }

    // Function to show a specific section and hide others
    function showSection(sectionId) {
        // Get all content sections that are part of the routing
        const contentSections = document.querySelectorAll('section[id]');
        contentSections.forEach(section => {
            section.style.display = 'none'; // Hide all content sections
        });

        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.style.display = 'block'; // Show the target section
            targetSection.scrollIntoView({
                behavior: 'smooth'
            }); // Smooth scroll to it
        }
    }

    // Handle initial load
    const initialHash = window.location.hash.substring(1); // Remove '#'
    if (initialHash && document.getElementById(initialHash)) {
        showSection(initialHash);
    } else {
        // Default to showing the 'home' section if no hash or invalid hash
        showSection('home');
    }

    // Handle hash changes
    window.addEventListener('hashchange', () => {
        const newHash = window.location.hash.substring(1);
        if (newHash && document.getElementById(newHash)) {
            showSection(newHash);
        } else {
            // If hash is empty or invalid, default to 'home'
            showSection('home');
        }
    });

    // Modify navigation links to update hash instead of direct scrollIntoView
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            if (targetId === 'page-top') { // Special case for 'page-top' to scroll to the very top
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                window.location.hash = targetId; // Update hash, which will trigger hashchange event
            }
        });
    });
}
                                    
async function handleSubmit(event) {
    event.preventDefault();

    let form = document.getElementById("my-form")
    let status = document.getElementById("my-form-status");
    let data = new FormData(event.target);

    if (!data.get('g-recaptcha-response')) {
        status.style.color = "red";
        status.innerHTML = "Please complete the reCAPTCHA before submitting."
        return;
    }

    fetch(event.target.action, {
        method: form.method,
        body: data,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            status.style.color = "green";
            status.innerHTML = "Thanks for your submission!";
            form.reset();
        } else {
            response.json().then(data => {
                if (Object.hasOwn(data, 'errors')) {
                    status.innerHTML = data["errors"].map(error => error["message"]).join(", ")
                } else {
                    status.style.color = "red";
                    status.innerHTML = "Oops! There was a problem submitting your form."
                }
            })
        }
    }).catch(error => {
        status.style.color = "red";
        status.innerHTML = "Oops! There was a problem submitting your form."
    }).finally(() => {
        if (typeof grecaptcha !== 'undefined') {
            grecaptcha.reset();
        }
    });
}

onLoad();