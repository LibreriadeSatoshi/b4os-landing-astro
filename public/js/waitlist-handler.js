// Handler para el formulario de waitlist
(function () {
  "use strict";

  const waitlistForm = document.getElementById("waitlistForm");

  if (!waitlistForm) {
    return; // No hay formulario de waitlist en esta página
  }

  // Función para mostrar notificación
  function showNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close" aria-label="Cerrar">&times;</button>
            </div>
        `;

    document.body.appendChild(notification);

    // Cerrar al hacer clic en X
    notification
      .querySelector(".notification-close")
      .addEventListener("click", () => {
        notification.remove();
      });

    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  // Función para mostrar estado de éxito en el formulario
  function showSuccessState(form) {
    const translations = globalThis.waitlistTranslations || {};

    form.innerHTML = `
            <div class="success-state">
                <svg class="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9 12l2 2 4-4"></path>
                </svg>
                <h4>${translations.success_title || "Listo"}</h4>
                <p>${translations.success_message || "Te avisaremos cuando abramos inscripciones"}</p>
            </div>
        `;
  }

  // Manejar envío del formulario
  waitlistForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitButton = waitlistForm.querySelector('button[type="submit"]');
    const emailInput = waitlistForm.querySelector('input[name="email"]');
    const email = emailInput.value.trim();

    // Validación básica
    if (!email) {
      const translations = globalThis.waitlistTranslations || {};
      showNotification(
        translations.email_required || "Por favor ingresa tu email",
        "error",
      );
      return;
    }

    // Deshabilitar formulario mientras se envía
    submitButton.disabled = true;
    submitButton.textContent = "Enviando...";
    emailInput.disabled = true;

    try {
      const response = await fetch("/.netlify/functions/waitlist-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Éxito
        showNotification(
          data.message || "Listo. Te avisaremos cuando abramos el registro.",
          "success",
        );
        showSuccessState(waitlistForm);

        // Analytics (si existe)
        if (typeof gtag !== "undefined") {
          gtag("event", "waitlist_signup", {
            event_category: "engagement",
            event_label: "registration_closed",
          });
        }
      } else {
        // Error del servidor
        throw new Error(data.message || "Error al procesar tu solicitud");
      }
    } catch (error) {
      console.error("Waitlist submission error:", error);
      const translations = globalThis.waitlistTranslations || {};
      showNotification(
        translations.error_message ||
          "Hubo un problema. Por favor intenta nuevamente",
        "error",
      );

      // Rehabilitar formulario
      submitButton.disabled = false;
      submitButton.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                Notificarme
            `;
      emailInput.disabled = false;
    }
  });

  // Analytics: Track cuando ven el overlay
  if (typeof gtag !== "undefined") {
    gtag("event", "view_waitlist_form", {
      event_category: "engagement",
      event_label: "registration_closed",
    });
  }
})();
