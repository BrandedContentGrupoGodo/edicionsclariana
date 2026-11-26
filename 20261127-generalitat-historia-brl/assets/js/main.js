const items = document.querySelectorAll(".reveal");

if (items.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        }
    });

    items.forEach((item) => observer.observe(item));
}
