(() => {
  const phone = "51925475034";
  const message = "Hola, quiero el material de química para admisión";
  const link = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  const createBar = () => {
    if (document.querySelector("[data-whatsapp-bar]")) return;

    const bar = document.createElement("aside");
    bar.setAttribute("data-whatsapp-bar", "true");
    bar.setAttribute("aria-label", "Material de química por WhatsApp");
    bar.innerHTML = `
      <span>¿Quieres todo el material?</span>
      <a href="${link}" target="_blank" rel="noopener noreferrer">
        Recibe todo por WhatsApp
      </a>
    `;

    const style = document.createElement("style");
    style.textContent = `
      [data-whatsapp-bar] {
        display: none;
      }

      @media (max-width: 640px) {
        [data-whatsapp-bar] {
          position: fixed;
          right: 12px;
          bottom: 12px;
          left: 12px;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 10px 12px 10px 14px;
          border: 1px solid rgba(107, 45, 140, 0.2);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 0 8px 24px rgba(39, 23, 49, 0.16);
          color: #34243d;
          font-family: "IBM Plex Sans", sans-serif;
          font-size: 12px;
        }

        [data-whatsapp-bar] a {
          flex: 0 0 auto;
          padding: 9px 12px;
          border-radius: 8px;
          background: #6b2d8c;
          color: #fff;
          font-family: "IBM Plex Mono", monospace;
          font-size: 11px;
          font-weight: 600;
          text-decoration: none;
        }

        [data-whatsapp-bar] a:focus-visible {
          outline: 3px solid rgba(107, 45, 140, 0.35);
          outline-offset: 2px;
        }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(bar);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createBar, { once: true });
  } else {
    createBar();
  }
})();
