document.addEventListener("DOMContentLoaded", () => {
  // Mobile Navigation Toggle
  const burgerMenu = document.getElementById("burgerMenu");
  const mobileNav = document.getElementById("mobileNav");
  const mobileNavOverlay = document.getElementById("mobileNavOverlay");

  burgerMenu.addEventListener("click", () => {
    mobileNav.classList.toggle("active");
    mobileNavOverlay.classList.toggle("active");
  });

  mobileNavOverlay.addEventListener("click", () => {
    mobileNav.classList.remove("active");
    mobileNavOverlay.classList.remove("active");
  });

  // Close mobile nav when clicking on a link
  const mobileNavLinks = mobileNav.querySelectorAll("a");
  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("active");
      mobileNavOverlay.classList.remove("active");
    });
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Image modal for project previews
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("imageModalImg");
  const modalCaption = document.getElementById("imageModalCaption");
  const modalClose = document.getElementById("imageModalClose");
  const modalOverlay = document.getElementById("imageModalOverlay");
  const modalPrev = document.getElementById("imageModalPrev");
  const modalNext = document.getElementById("imageModalNext");
  const modalCounter = document.getElementById("imageModalCounter");

  let currentImages = [];
  let currentIndex = 0;

  const updateModalView = () => {
    if (!currentImages.length) return;
    const { src, caption } = currentImages[currentIndex];
    modalImg.src = src;
    modalImg.alt = caption || "";
    modalCaption.textContent = caption || "";
    modalCounter.textContent = `${currentIndex + 1}/${currentImages.length}`;

    // Show/hide arrows for single vs multiple images
    if (currentImages.length <= 1) {
      modalPrev?.classList.add("hidden");
      modalNext?.classList.add("hidden");
    } else {
      modalPrev?.classList.remove("hidden");
      modalNext?.classList.remove("hidden");
    }
  };

  const openModal = (images, startIndex = 0) => {
    currentImages = images;
    currentIndex = Math.max(0, Math.min(startIndex, images.length - 1));
    updateModalView();
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  const showPrev = () => {
    if (!currentImages.length) return;
    currentIndex =
      (currentIndex - 1 + currentImages.length) % currentImages.length;
    updateModalView();
  };

  const showNext = () => {
    if (!currentImages.length) return;
    currentIndex = (currentIndex + 1) % currentImages.length;
    updateModalView();
  };

  document.querySelectorAll(".project-card").forEach((card) => {
    const img = card.querySelector(".project-image");
    if (!img) return;

    const gallery = card.dataset.images
      ? card.dataset.images
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const images = (gallery.length ? gallery : [img.src]).map((src) => ({
      src,
      caption: img.alt || card.querySelector("h3")?.textContent || "",
    }));

    // Add click handler to image or wrapper
    const clickTarget = img.closest(".project-image-wrapper") || img;
    clickTarget.style.cursor = "pointer";
    clickTarget.addEventListener("click", () => openModal(images, 0));
  });

  modalClose?.addEventListener("click", closeModal);
  modalOverlay?.addEventListener("click", closeModal);
  modalPrev?.addEventListener("click", showPrev);
  modalNext?.addEventListener("click", showNext);

  // Click zones on image halves
  modalImg?.addEventListener("click", (e) => {
    if (currentImages.length <= 1) return;
    const rect = modalImg.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const imageWidth = rect.width;

    // Left 40% triggers previous, right 40% triggers next
    if (clickX < imageWidth * 0.4) {
      showPrev();
    } else if (clickX > imageWidth * 0.6) {
      showNext();
    }
  });

  // Touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  modalImg?.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  modalImg?.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    },
    { passive: true }
  );

  const handleSwipe = () => {
    if (currentImages.length <= 1) return;
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiped left - show next
        showNext();
      } else {
        // Swiped right - show previous
        showPrev();
      }
    }
  };

  window.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("active")) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") showPrev();
    if (e.key === "ArrowRight") showNext();
  });
});
