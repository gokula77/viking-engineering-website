const menuToggle = document.querySelector(".menu-toggle");
const siteNavigation = document.querySelector("#site-navigation");
const contactForm = document.querySelector(".contact-form");
const currentYear = document.querySelector("#current-year");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

if (menuToggle && siteNavigation) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
    siteNavigation.classList.toggle("is-open", !isOpen);
  });

  siteNavigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
      siteNavigation.classList.remove("is-open");
    }
  });
}

if (contactForm) {
  const requiredFields = [...contactForm.querySelectorAll("[required]")];
  const status = contactForm.querySelector(".form-status");

  requiredFields.forEach((field) => {
    field.addEventListener("input", () => field.removeAttribute("aria-invalid"));
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const invalidField = requiredFields.find((field) => !field.value.trim() || !field.checkValidity());
    if (invalidField) {
      invalidField.setAttribute("aria-invalid", "true");
      invalidField.focus();
      status.textContent = "Please complete the required fields with a valid email address.";
      return;
    }

    const recipient = contactForm.dataset.recipient.trim();
    if (!recipient) {
      status.textContent = "The enquiry form is not connected yet. Add your business email in the data-recipient field before publishing.";
      return;
    }

    const formData = new FormData(contactForm);
    const subject = "Marine service enquiry — " + formData.get("vessel");
    const body = [
      "Name: " + formData.get("name"),
      "Email: " + formData.get("email"),
      "Vessel / company: " + formData.get("vessel"),
      "Port or location: " + (formData.get("location") || "Not provided"),
      "",
      "System and service required:",
      formData.get("message"),
    ].join("\n");

    window.location.href = "mailto:" + encodeURIComponent(recipient) +
      "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    status.textContent = "Your email app should open with the enquiry details.";
  });
}