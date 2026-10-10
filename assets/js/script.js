'use strict';

// Based on the vCard template by codewithsadee (MIT License, see LICENSE-vcard.txt)

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }


// sidebar toggle functionality for mobile
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });


// portfolio filter (custom select on mobile, buttons on larger screens)
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === "all" || selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
}

select.addEventListener("click", function () { elementToggleFunc(this); });

for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    const selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}

let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    const selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
}


// contact form: no backend, so open the visitor's email app with a pre-filled message
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const name = form.elements.fullname.value.trim();
  const email = form.elements.email.value.trim();
  const message = form.elements.message.value.trim();
  const subject = "Hello from " + name;
  const body = message + "\n\n" + name + " <" + email + ">";
  window.location.href = "mailto:cuinc99@gmail.com?subject=" +
    encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
});


// page navigation (also supports #about, #resume, #portfolio, #contact in the URL)
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

const showPage = function (pageName, scroll) {
  let found = false;
  for (let i = 0; i < pages.length; i++) {
    if (pages[i].dataset.page === pageName) found = true;
  }
  if (!found) return;

  for (let i = 0; i < pages.length; i++) {
    const isActive = pages[i].dataset.page === pageName;
    pages[i].classList.toggle("active", isActive);
  }
  for (let i = 0; i < navigationLinks.length; i++) {
    const isActive = navigationLinks[i].innerText.trim().toLowerCase() === pageName;
    navigationLinks[i].classList.toggle("active", isActive);
  }
  if (scroll) window.scrollTo(0, 0);
}

for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    const pageName = this.innerText.trim().toLowerCase();
    showPage(pageName, true);
    history.replaceState(null, "", pageName === "about" ? location.pathname : "#" + pageName);
  });
}

const pageFromHash = function () {
  const hash = location.hash.replace("#", "").toLowerCase();
  if (hash) showPage(hash, false);
}

window.addEventListener("hashchange", pageFromHash);
pageFromHash();


// theme toggle (dark / light); initial theme is set by the inline script in <head>
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeMeta = document.querySelector('meta[name="theme-color"]');

const applyTheme = function (theme) {
  document.documentElement.setAttribute("data-theme", theme);
  if (themeMeta) themeMeta.setAttribute("content", theme === "light" ? "#f6f3ee" : "#121212");
  const next = theme === "light" ? "dark" : "light";
  themeToggle.setAttribute("aria-label", "Switch to " + next + " theme");
  themeToggle.setAttribute("title", "Switch to " + next + " theme");
}

applyTheme(document.documentElement.getAttribute("data-theme") || "dark");

themeToggle.addEventListener("click", function () {
  const theme = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
  applyTheme(theme);
  try { localStorage.setItem("theme", theme); } catch (e) {}
});

// follow system changes only while the visitor hasn't picked a theme
if (window.matchMedia) {
  const mq = window.matchMedia("(prefers-color-scheme: light)");
  const onSystemChange = function (e) {
    let saved = null;
    try { saved = localStorage.getItem("theme"); } catch (err) {}
    if (!saved) applyTheme(e.matches ? "light" : "dark");
  };
  if (mq.addEventListener) mq.addEventListener("change", onSystemChange);
}
