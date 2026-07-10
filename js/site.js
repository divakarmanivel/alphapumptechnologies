(function () {
  "use strict";

  var NAV_MAIN = [
    { href: "index.html", label: "Home", id: "home" },
    { href: "about-us.html", label: "About", id: "about" },
    { href: "products.html", label: "Products", id: "products", hasDropdown: true },
    { href: "contact-us.html", label: "Contact", id: "contact" },
  ];

  var PRODUCT_LINKS = [
    { href: "monoblock-pump.html", label: "Monoblock Pumps", desc: "Centrifugal & continuous duty", id: "monoblock" },
    { href: "submersible-pump.html", label: "Openwell Submersible Pumps", desc: "Openwell, 4\", 6\" & booster range", id: "submersible" },
    { href: "self-priming-pumps.html", label: "Self Priming Pumps", desc: "Regenerative & DMS monoblock", id: "self-priming" },
    { href: "jet-pumps.html", label: "Jet Pumps", desc: "Bore well & domestic water supply", id: "jet-pumps" },
  ];

  var PRODUCT_PAGE_IDS = ["jet-pumps", "monoblock", "submersible", "self-priming"];

  function getCurrentPage() {
    return document.body.getAttribute("data-page") || "home";
  }

  function isProductsActive() {
    var page = getCurrentPage();
    return page === "products" || PRODUCT_PAGE_IDS.indexOf(page) !== -1;
  }

  function renderDesktopNav() {
    var current = getCurrentPage();
    var productsActive = isProductsActive();
    var html = "";

    NAV_MAIN.forEach(function (item) {
      if (item.hasDropdown) {
        var active = productsActive ? " floating-nav-link-active" : "";
        html +=
          '<div class="nav-dropdown group relative">' +
          '<a href="products.html" class="floating-nav-link flex items-center gap-1' + active + '">' +
          item.label +
          '<svg class="h-3.5 w-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>' +
          "</a>" +
          '<div class="nav-dropdown-panel invisible absolute left-1/2 top-full z-50 min-w-[280px] -translate-x-1/2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">' +
          '<div class="overflow-hidden rounded-xl border border-slate-200 bg-white py-2 shadow-xl">' +
          PRODUCT_LINKS.map(function (p) {
            var subActive = current === p.id ? " bg-accent/5 text-accent font-semibold" : " text-slate-700 hover:bg-slate-50";
            return (
              '<a href="' + p.href + '" class="block px-4 py-3 transition' + subActive + '">' +
              '<span class="block text-sm font-medium">' + p.label + "</span>" +
              '<span class="mt-0.5 block text-xs text-steel">' + p.desc + "</span>" +
              "</a>"
            );
          }).join("") +
          "</div></div></div>";
        return;
      }

      var active = current === item.id ? " floating-nav-link-active" : "";
      html += '<a href="' + item.href + '" class="floating-nav-link' + active + '">' + item.label + "</a>";
    });

    return html;
  }

  function renderMobileNav() {
    var current = getCurrentPage();
    var html = "";

    NAV_MAIN.forEach(function (item) {
      var active = item.hasDropdown
        ? isProductsActive() ? " mobile-nav-link-active" : ""
        : current === item.id ? " mobile-nav-link-active" : "";
      html += '<a href="' + item.href + '" class="mobile-nav-link' + active + '">' + item.label + "</a>";
    });

    html += '<div class="my-4 border-t border-white/10 pt-4">';
    html += '<p class="mb-3 text-xs font-semibold uppercase tracking-widest text-accent-light">Product Lines</p>';
    PRODUCT_LINKS.forEach(function (p) {
      var active = current === p.id ? " mobile-nav-sublink-active" : "";
      html +=
        '<a href="' + p.href + '" class="mobile-nav-sublink' + active + '">' +
        '<span class="block font-medium">' + p.label + "</span>" +
        '<span class="block text-sm text-slate-400">' + p.desc + "</span>" +
        "</a>";
    });
    html += "</div>";

    html += '<a href="mailto:alpha_pumptech@yahoo.in" class="mt-6 block text-center text-sm text-slate-400 hover:text-accent-light">alpha_pumptech@yahoo.in</a>';

    return html;
  }

  function renderHeader() {
    return (
      '<header id="site-header-root" class="fixed top-0 z-50 w-full">' +
      '<div id="header-bar" class="site-header-shell transition-all duration-300">' +
      '<div class="container-main site-header-inner">' +
      '<a href="index.html" class="header-logo header-logo-mobile lg:hidden">' +
      '<img src="assets/apex-logo.webp" alt="Alpha Pump Technologies" class="header-logo-image" width="120" height="48">' +
      "</a>" +
      '<nav class="floating-nav" aria-label="Main navigation">' +
      '<div class="floating-nav-pill">' +
      '<a href="index.html" class="header-logo">' +
      '<img src="assets/apex-logo.webp" alt="Alpha Pump Technologies" class="header-logo-image" width="120" height="48">' +
      "</a>" +
      '<span class="floating-nav-divider" aria-hidden="true"></span>' +
      '<div class="floating-nav-links">' +
      renderDesktopNav() +
      "</div>" +
      "</div>" +
      "</nav>" +
      '<button id="mobile-menu-btn" type="button" class="mobile-menu-toggle ml-auto shrink-0 lg:hidden" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu-panel">' +
      '<span class="mobile-menu-bar"></span>' +
      '<span class="mobile-menu-bar"></span>' +
      '<span class="mobile-menu-bar"></span>' +
      "</button>" +
      "</div></div>" +
      '<div id="mobile-menu-panel" class="mobile-menu-panel lg:hidden" aria-hidden="true">' +
      '<div class="mobile-menu-backdrop" id="mobile-menu-backdrop"></div>' +
      '<nav class="mobile-menu-content" aria-label="Mobile navigation">' +
      '<div class="mb-6 flex items-center justify-between">' +
      '<span class="text-xs font-semibold uppercase tracking-widest text-accent-light">Menu</span>' +
      '<button type="button" id="mobile-menu-close" class="flex h-11 w-11 items-center justify-center rounded-lg text-white hover:bg-white/10" aria-label="Close menu">' +
      '<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>' +
      "</button></div>" +
      renderMobileNav() +
      "</nav></div></header>"
    );
  }

  function renderFooter() {
    return (
      '<footer class="site-footer">' +
      '<div class="container-main footer-grid">' +
      '<div class="footer-brand">' +
      '<a href="index.html" class="inline-flex"><img src="assets/apex-logo.webp" alt="Alpha Pump Technologies" class="h-10 w-auto" width="120" height="48"></a>' +
      '<p class="footer-brand-desc">Manufacturing pumps &amp; motors under the FINE ALPHA brand since 2004. Established 1987 in Coimbatore, Tamil Nadu.</p>' +
      "</div>" +
      '<div><p class="footer-heading">Company</p><ul class="footer-links">' +
      '<li><a href="index.html">Home</a></li>' +
      '<li><a href="about-us.html">About Us</a></li>' +
      '<li><a href="products.html">Products</a></li>' +
      '<li><a href="contact-us.html">Contact</a></li>' +
      "</ul></div>" +
      '<div><p class="footer-heading">Product Lines</p><ul class="footer-links">' +
      PRODUCT_LINKS.map(function (p) {
        return '<li><a href="' + p.href + '">' + p.label + "</a></li>";
      }).join("") +
      "</ul></div>" +
      '<div><p class="footer-heading">Get In Touch</p><ul class="footer-contact">' +
      "<li>259, VOC Nagar, Edayarpalayam<br>Coimbatore - 641025, Tamil Nadu</li>" +
      '<li><a href="tel:+919894732239">+91 98947 32239</a></li>' +
      '<li><a href="tel:+919791355444">+91 97913 55444</a></li>' +
      '<li><a href="mailto:alpha_pumptech@yahoo.in">alpha_pumptech@yahoo.in</a></li>' +
      "</ul></div>" +
      "</div>" +
      '<div class="footer-bottom"><div class="container-main footer-bottom-inner">' +
      "<p>© 2026 Alpha Pump Technologies. All Rights Reserved.</p>" +
      '<p class="footer-brand-line">FINE ALPHA · Pumps &amp; Motors</p>' +
      "</div></div></footer>"
    );
  }

  function updateHeaderHeight() {
    var header = document.getElementById("site-header-root");
    if (!header) return;
    var h = header.offsetHeight;
    document.documentElement.style.setProperty("--header-h", h + "px");
    var spacer = document.getElementById("header-spacer");
    if (spacer) {
      spacer.style.height = "0px";
    }
  }

  function injectLayout() {
    var headerEl = document.getElementById("site-header");
    var footerEl = document.getElementById("site-footer");
    if (headerEl) {
      headerEl.innerHTML = renderHeader();
      var spacer = document.createElement("div");
      spacer.id = "header-spacer";
      spacer.setAttribute("aria-hidden", "true");
      headerEl.insertAdjacentElement("afterend", spacer);
    }
    if (footerEl) footerEl.innerHTML = renderFooter();
    updateHeaderHeight();
  }

  function initMobileNav() {
    var btn = document.getElementById("mobile-menu-btn");
    var closeBtn = document.getElementById("mobile-menu-close");
    var panel = document.getElementById("mobile-menu-panel");
    var backdrop = document.getElementById("mobile-menu-backdrop");
    if (!btn || !panel) return;

    function setOpen(open) {
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      panel.setAttribute("aria-hidden", open ? "false" : "true");
      panel.classList.toggle("is-open", open);
      btn.classList.toggle("is-open", open);
      document.body.classList.toggle("mobile-menu-open", open);
    }

    btn.addEventListener("click", function () {
      setOpen(!panel.classList.contains("is-open"));
    });
    if (closeBtn) closeBtn.addEventListener("click", function () { setOpen(false); });
    if (backdrop) backdrop.addEventListener("click", function () { setOpen(false); });

    panel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setOpen(false); });
    });
  }

  function initStickyHeader() {
    var bar = document.getElementById("header-bar");
    if (!bar) return;

    function onScroll() {
      bar.classList.toggle("header-scrolled", window.scrollY > 12);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initHeroCarousel() {
    var carousel = document.getElementById("hero-carousel");
    if (!carousel) return;

    var slides = carousel.querySelectorAll(".hero-slide");
    var dotsContainer = document.getElementById("hero-dots");
    var dots = dotsContainer ? dotsContainer.querySelectorAll(".hero-dot-btn") : [];
    if (!slides.length) return;

    var current = 0;
    var timer = null;
    var paused = false;

    function goTo(index) {
      slides[current].classList.remove("active");
      if (dots[current]) {
        dots[current].classList.remove("active");
        var dotInner = dots[current].querySelector(".hero-dot");
        if (dotInner) dotInner.classList.remove("active");
      }
      current = (index + slides.length) % slides.length;
      slides[current].classList.add("active");
      if (dots[current]) {
        dots[current].classList.add("active");
        var dotInnerActive = dots[current].querySelector(".hero-dot");
        if (dotInnerActive) dotInnerActive.classList.add("active");
      }
    }

    function next() {
      if (!paused) goTo(current + 1);
    }

    function startTimer() {
      if (timer) clearInterval(timer);
      timer = setInterval(next, 5000);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        goTo(i);
        startTimer();
      });
    });

    carousel.addEventListener("mouseenter", function () { paused = true; });
    carousel.addEventListener("mouseleave", function () { paused = false; });
    carousel.addEventListener("touchstart", function () { paused = true; }, { passive: true });
    carousel.addEventListener("touchend", function () {
      setTimeout(function () { paused = false; }, 3000);
    }, { passive: true });

    goTo(0);
    startTimer();
  }

  function initScrollReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!els.length || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("visible"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -32px 0px" }
    );

    els.forEach(function (el) { observer.observe(el); });
  }

  function init() {
    injectLayout();
    initMobileNav();
    initStickyHeader();
    initHeroCarousel();
    initScrollReveal();
    window.addEventListener("resize", updateHeaderHeight, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
