document.addEventListener("DOMContentLoaded", function () {
    
    // 1. Grid Interaction Categories Engine
    const filterButtons = document.querySelectorAll(".filter-button-group button");
    const galleryItems = document.querySelectorAll(".gallery-item");

    if(filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener("click", function () {
                filterButtons.forEach(btn => btn.classList.remove("active"));
                this.classList.add("active");

                const filterValue = this.getAttribute("data-filter");

                galleryItems.forEach(item => {
                    const category = item.getAttribute("data-category");
                    if (filterValue === "all" || category === filterValue) {
                        item.classList.remove("hide");
                    } else {
                        item.classList.add("hide");
                    }
                });
            });
        });
    }

    // 2. Formspree Endpoint Deployment Handler for f/mrednygz
    const form = document.getElementById("contactForm");
    const status = document.getElementById("formStatus");
    const submitBtn = document.getElementById("submitBtn");
    const shootTypeSelect = document.getElementById("shootType");
    const otherShootContainer = document.getElementById("otherShootContainer");
    const otherShootInput = document.getElementById("otherShootInput");

    const toggleOtherShootField = () => {
        if (shootTypeSelect && otherShootContainer && otherShootInput) {
            const isOther = shootTypeSelect.value === "other";
            otherShootContainer.classList.toggle("d-none", !isOther);
            otherShootInput.required = isOther;
            if (!isOther) {
                otherShootInput.value = "";
            }
        }
    };

    if (shootTypeSelect) {
        shootTypeSelect.addEventListener("change", toggleOtherShootField);
        toggleOtherShootField();
    }

    if (form) {
        form.setAttribute("action", "https://formspree.io/f/mrednygz");
        form.setAttribute("method", "POST");

        form.addEventListener("submit", async function (event) {
            event.preventDefault(); // Intercept redirect sequence
            
            submitBtn.disabled = true;
            submitBtn.innerText = "Sending Request...";
            status.classList.remove("d-none", "text-success", "text-danger");
            status.classList.add("text-secondary", "small");
            status.innerText = "Processing booking package info...";

            const data = new FormData(event.target);
            let response;

            try {
                response = await fetch(form.action, {
                    method: form.method,
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    // Success validation using requested copy structure text block
                    status.classList.remove("text-secondary", "small", "text-danger");
                    status.classList.add("text-light", "p-4", "border", "border-secondary", "bg-black-50");
                    status.innerHTML = `
                        <h5 class="fw-bold mb-2">Thank you for booking Presh Visuals 🤍</h5>
                        <p class="small text-secondary mb-0">You’ll receive a response shortly to confirm your session and next steps.</p>
                    `;
                    form.reset();
                    submitBtn.classList.add("d-none"); // Hide button on definitive capture success
                } else {
                    const responseData = await response.json();
                    status.classList.remove("text-secondary");
                    status.classList.add("text-danger", "small");
                    status.innerText = responseData.errors ? responseData.errors.map(err => err.message).join(", ") : "Oops! There was a problem submitting your form.";
                }
            } catch (error) {
                status.classList.remove("text-secondary");
                status.classList.add("text-danger", "small");
                status.innerText = "Connection error. Please verify your internet connection or try again.";
            } finally {
                if (!response || !response.ok) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = "Submit Booking Request";
                }
            }
        });
    }
});