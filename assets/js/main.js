(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var navToggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("nav");
  var body = document.body;
  var WHATSAPP_NUMBER = "5511999990000";

  function setMenu(open) {
    body.classList.toggle("nav-open", open);
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Fechar menu de navegação" : "Abrir menu de navegação");
    }
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      setMenu(!body.classList.contains("nav-open"));
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenu(false);
      });
    });

    document.addEventListener("click", function (event) {
      if (body.classList.contains("nav-open") && !event.target.closest(".site-header")) {
        setMenu(false);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setMenu(false);
      }
    });

    var desktopQuery = window.matchMedia("(min-width: 1025px)");
    var handleDesktop = function (event) {
      if (event.matches) {
        setMenu(false);
      }
    };
    if (desktopQuery.addEventListener) {
      desktopQuery.addEventListener("change", handleDesktop);
    } else {
      desktopQuery.addListener(handleDesktop);
    }
  }

  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav a"));
  var trackedSections = ["inicio", "seguros", "sobre", "seguradoras", "contato"]
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);

  function updateHeader() {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 10);
    }
  }

  function updateActiveLink() {
    if (!trackedSections.length) {
      return;
    }
    var offset = window.scrollY + 140;
    var current = trackedSections[0].id;
    trackedSections.forEach(function (section) {
      if (section.offsetTop <= offset) {
        current = section.id;
      }
    });
    navLinks.forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("href") === "#" + current);
    });
  }

  var ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateHeader();
        updateActiveLink();
        ticking = false;
      });
      ticking = true;
    }
  }

  updateHeader();
  updateActiveLink();
  window.addEventListener("scroll", onScroll, { passive: true });

  var revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealElements.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    revealElements.forEach(function (element) {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach(function (element) {
      element.classList.add("is-visible");
    });
  }

  var insuranceSelect = document.getElementById("tipo");
  document.querySelectorAll("[data-insurance]").forEach(function (link) {
    link.addEventListener("click", function () {
      if (!insuranceSelect) {
        return;
      }
      var value = link.getAttribute("data-insurance");
      var optionExists = Array.prototype.some.call(insuranceSelect.options, function (option) {
        return option.value === value;
      });
      if (optionExists) {
        insuranceSelect.value = value;
      }
    });
  });

  var phoneInput = document.getElementById("telefone");

  function formatPhone(value) {
    var digits = value.replace(/\D/g, "").slice(0, 11);
    if (!digits) {
      return "";
    }
    if (digits.length < 3) {
      return "(" + digits;
    }
    var area = digits.slice(0, 2);
    var rest = digits.slice(2);
    if (rest.length <= 4) {
      return "(" + area + ") " + rest;
    }
    var split = rest.length > 8 ? 5 : 4;
    var first = rest.slice(0, split);
    var second = rest.slice(split);
    return "(" + area + ") " + first + (second ? "-" + second : "");
  }

  if (phoneInput) {
    phoneInput.addEventListener("input", function () {
      phoneInput.value = formatPhone(phoneInput.value);
    });
  }

  var form = document.getElementById("contact-form");
  var successMessage = document.getElementById("form-success");

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var data = new FormData(form);
      var name = String(data.get("nome") || "").trim();
      var email = String(data.get("email") || "").trim();
      var phone = String(data.get("telefone") || "").trim();
      var insurance = String(data.get("tipo") || "").trim();
      var notes = String(data.get("mensagem") || "").trim();

      var message = "Olá! Gostaria de solicitar uma cotação.\n\n";
      message += "Nome: " + name + "\n";
      message += "E-mail: " + email + "\n";
      message += "Telefone: " + phone + "\n";
      message += "Seguro de interesse: " + insurance;
      if (notes) {
        message += "\nMensagem: " + notes;
      }
      message += "\n\nAutorizo o contato conforme a Política de Privacidade.";

      var whatsappUrl = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
      window.open(whatsappUrl, "_blank", "noopener");

      if (successMessage) {
        successMessage.hidden = false;
        window.setTimeout(function () {
          successMessage.hidden = true;
        }, 12000);
      }

      form.reset();
    });
  }

  var yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }
})();
