document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("page-ready");
    const navbar = document.getElementById("navbar");
    const hero = document.querySelector(".hero");
    const heroContent = document.querySelector(".hero-content");
    const navToggle = document.querySelector(".nav-toggle");
    const navPanel = document.getElementById("primary-navigation");
    const revealItems = document.querySelectorAll(".section-reveal, .reveal-card");
    const galleryItems = document.querySelectorAll(".gallery-item");
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxClose = document.getElementById("lightboxClose");
    const testimonialCards = Array.from(document.querySelectorAll(".testimonial-card"));
    const prevButton = document.getElementById("prevTestimonial");
    const nextButton = document.getElementById("nextTestimonial");
    const contactForm = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");
    const internalLinks = Array.from(document.querySelectorAll("a[href]"));

    internalLinks.forEach((link) => {
        const href = link.getAttribute("href") || "";

        if (
            href.startsWith("#") ||
            href.startsWith("mailto:") ||
            href.startsWith("tel:") ||
            href.startsWith("javascript:") ||
            link.target === "_blank"
        ) {
            return;
        }

        link.addEventListener("click", (event) => {
            const targetUrl = new URL(href, window.location.href);
            const currentUrl = new URL(window.location.href);

            if (targetUrl.origin !== currentUrl.origin) {
                return;
            }

            if (targetUrl.pathname === currentUrl.pathname && targetUrl.hash === currentUrl.hash) {
                return;
            }

            event.preventDefault();
            document.body.classList.add("page-leaving");
            window.setTimeout(() => {
                window.location.href = targetUrl.href;
            }, 220);
        });
    });

    if (hero && !hero.querySelector(".hero-particles")) {
        const particles = document.createElement("div");
        particles.className = "hero-particles";
        const particleCount = window.matchMedia("(max-width: 540px)").matches ? 10 : 18;

        for (let index = 0; index < particleCount; index += 1) {
            const particle = document.createElement("span");
            const size = 3 + (index % 5);
            particle.style.setProperty("--x", `${Math.random() * 100}%`);
            particle.style.setProperty("--y", `${Math.random() * 100}%`);
            particle.style.setProperty("--size", `${size}px`);
            particle.style.setProperty("--duration", `${8 + Math.random() * 8}s`);
            particle.style.setProperty("--delay", `${-Math.random() * 10}s`);
            particle.style.setProperty("--dx", `${(Math.random() * 240 - 120).toFixed(0)}px`);
            particle.style.setProperty("--dy", `${(Math.random() * -220 - 80).toFixed(0)}px`);
            particles.appendChild(particle);
        }

        hero.prepend(particles);
    }

    const syncHeroMotion = () => {
        if (!hero) return;
        const progress = Math.min(window.scrollY, window.innerHeight) / Math.max(window.innerHeight, 1);
        const parallax = Math.round(progress * -60);
        const floatOffset = `${Math.round(progress * 18)}px`;
        hero.style.setProperty("--hero-parallax", `${parallax}px`);
        hero.style.setProperty("--hero-float", floatOffset);

        if (heroContent) {
            heroContent.style.transform = `translate3d(0, ${Math.round(progress * 16)}px, 0)`;
        }
    };

    const setNavbarState = () => {
        if (!navbar) return;
        navbar.classList.toggle("scrolled", window.scrollY > 20);
    };

    setNavbarState();
    syncHeroMotion();
    window.addEventListener("scroll", setNavbarState, { passive: true });
    window.addEventListener("scroll", syncHeroMotion, { passive: true });
    window.addEventListener("resize", syncHeroMotion, { passive: true });

    if (navToggle && navPanel) {
        navToggle.addEventListener("click", () => {
            const expanded = navToggle.getAttribute("aria-expanded") === "true";
            navToggle.setAttribute("aria-expanded", String(!expanded));
            navPanel.classList.toggle("open");
        });

        navPanel.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                navPanel.classList.remove("open");
                navToggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealItems.forEach((item, index) => {
            item.style.transitionDelay = `${Math.min(index % 9, 6) * 0.08}s`;
            observer.observe(item);
        });
    } else {
        revealItems.forEach((item) => item.classList.add("is-visible"));
    }

    if (lightbox && lightboxImage && lightboxClose) {
        const closeLightbox = () => {
            lightbox.classList.remove("open");
            lightbox.setAttribute("aria-hidden", "true");
            lightboxImage.removeAttribute("src");
            lightboxImage.removeAttribute("alt");
        };

        galleryItems.forEach((item) => {
            item.addEventListener("click", () => {
                const fullImage = item.getAttribute("data-full");
                const altText = item.getAttribute("data-alt") || "Gallery image";
                if (!fullImage) return;
                lightboxImage.src = fullImage;
                lightboxImage.alt = altText;
                lightbox.classList.add("open");
                lightbox.setAttribute("aria-hidden", "false");
            });
        });

        lightboxClose.addEventListener("click", closeLightbox);
        lightbox.addEventListener("click", (event) => {
            if (event.target === lightbox) closeLightbox();
        });
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") closeLightbox();
        });
    }

    if (testimonialCards.length > 0) {
        let currentIndex = 0;

        const showTestimonial = (index) => {
            testimonialCards.forEach((card, cardIndex) => {
                card.classList.toggle("active", cardIndex === index);
            });
        };

        const nextTestimonial = () => {
            currentIndex = (currentIndex + 1) % testimonialCards.length;
            showTestimonial(currentIndex);
        };

        const previousTestimonial = () => {
            currentIndex = (currentIndex - 1 + testimonialCards.length) % testimonialCards.length;
            showTestimonial(currentIndex);
        };

        if (prevButton) prevButton.addEventListener("click", previousTestimonial);
        if (nextButton) nextButton.addEventListener("click", nextTestimonial);
        setInterval(nextTestimonial, 5000);
    }

    if (contactForm && formStatus) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();
            formStatus.textContent = "Thanks. Your enquiry has been received.";
            contactForm.reset();
        });
    }
});