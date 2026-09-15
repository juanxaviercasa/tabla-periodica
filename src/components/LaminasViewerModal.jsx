import React, { useState, useEffect } from "react";
import {
  X,
  Download,
  Eye,
  Sparkles,
  ZoomIn,
  ZoomOut,
  QrCode,
  ArrowUpRight,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  MessageCircle
} from "lucide-react";
import { communityUrl, whatsappCommunityUrl } from "../config.js";

const LAMINAS_DATA = [
  {
    id: "completa",
    order: 1,
    title: "Lámina 1: Tabla Periódica Completa",
    tabLabel: "1. Tabla Completa",
    badge: "Lámina 1 · Didáctica Oficial",
    description:
      "Tabla periódica completa con los 118 elementos organizados según el estándar IUPAC. Incluye números atómicos, símbolos, nombres, masas atómicas y familias químicas, optimizada para resolución de problemas y estequiometría.",
    pdfUrl: "/laminas/tabla-periodica-completa.pdf",
    pdfDownloadName: "Tabla_Periodica_Completa_QuimicaZenit.pdf",
    pdfWeight: "218 KB",
    imageUrl: "/laminas/tabla-periodica-completa.png",
    imageDownloadName: "Tabla_Periodica_Completa_HD_QuimicaZenit.png",
    imageWeight: "390 KB",
    previewUrl: "/laminas/tabla-periodica-completa.png",
    orientation: "Horizontal (A4 / A3)",
    highlights: [
      "Los 118 elementos organizados por períodos y grupos IUPAC",
      "Números atómicos (Z) y masas atómicas ponderadas legibles",
      "Clasificación cromática clara de metales, metaloides y no metales",
      "Disponible en PDF para imprimir y en Imagen PNG para tu celular"
    ]
  },
  {
    id: "con-imagenes",
    order: 2,
    title: "Lámina 2: Tabla Periódica con Imágenes",
    tabLabel: "2. Con Imágenes de Elementos",
    badge: "Lámina 2 · Fotos Reales",
    description:
      "Tabla periódica ilustrada donde cada casilla muestra la fotografía real del elemento químico en su estado natural o purificado, permitiendo asociar de inmediato la teoría con la materia real.",
    pdfUrl: "/laminas/tabla-periodica-con-imagenes.pdf",
    pdfDownloadName: "Tabla_Periodica_con_Imagenes_QuimicaZenit.pdf",
    pdfWeight: "614 KB",
    imageUrl: "/laminas/tabla-periodica-con-imagenes.png",
    imageDownloadName: "Tabla_Periodica_con_Imagenes_HD_QuimicaZenit.png",
    imageWeight: "820 KB",
    previewUrl: "/laminas/tabla-periodica-con-imagenes.png",
    orientation: "Horizontal (A4 / A3)",
    highlights: [
      "Fotografías representativas de cada elemento en la naturaleza",
      "Colores, brillos y estados de agregación visibles casillero por casillero",
      "Ideal para fijación visual y nemotécnia durante el estudio",
      "Disponible en PDF para imprimir y en Imagen PNG para tu celular"
    ]
  }
];

export function LaminasViewerModal({ isOpen, onClose, initialLaminaId = "completa" }) {
  const [activeId, setActiveId] = useState(initialLaminaId);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (initialLaminaId) {
      setActiveId(initialLaminaId);
    }
  }, [initialLaminaId, isOpen]);

  // Keyboard navigation: Escape to close, arrows to switch sheets
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        setActiveId((prev) => (prev === "completa" ? "con-imagenes" : "completa"));
        setIsZoomed(false);
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentLamina = LAMINAS_DATA.find((l) => l.id === activeId) || LAMINAS_DATA[0];

  return (
    <div
      className="laminas-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="laminas-modal-title"
    >
      <div
        className="laminas-modal-window"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <header className="laminas-modal-header">
          <div className="laminas-modal-title-wrap">
            <span className="laminas-gift-tag">
              <Sparkles size={14} className="text-amber" aria-hidden="true" />
              <span>Material Didáctico Descargable</span>
            </span>
            <h2 id="laminas-modal-title">Láminas de la Tabla Periódica</h2>
          </div>

          <div className="laminas-modal-top-actions">
            {/* Sheet Tabs */}
            <div className="laminas-tab-switcher" role="tablist" aria-label="Seleccionar lámina">
              {LAMINAS_DATA.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={activeId === item.id}
                  className={`lamina-tab-btn ${activeId === item.id ? "active" : ""}`}
                  onClick={() => {
                    setActiveId(item.id);
                    setIsZoomed(false);
                  }}
                >
                  <span>{item.tabLabel}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              className="laminas-close-btn"
              onClick={onClose}
              aria-label="Cerrar visor de láminas"
              title="Cerrar ventana (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        {/* Modal Body: Left Canvas Viewport & Right Content Sidebar */}
        <div className="laminas-modal-body">
          {/* Main Visual Display */}
          <section className="laminas-canvas-section" aria-label="Visor de lámina">
            <div className={`laminas-canvas-viewport ${isZoomed ? "zoomed" : ""}`}>
              <img
                src={currentLamina.previewUrl}
                alt={currentLamina.title}
                className="lamina-preview-img"
                onClick={() => setIsZoomed(!isZoomed)}
                title="Haz clic para acercar o alejar"
                loading="lazy"
              />
            </div>

            {/* Quick Canvas Controls (Zoom & Orientation only) */}
            <div className="laminas-canvas-controls">
              <button
                type="button"
                className="canvas-ctrl-btn"
                onClick={() => setIsZoomed(!isZoomed)}
                title={isZoomed ? "Ajustar tamaño a ventana" : "Ampliar zoom"}
              >
                {isZoomed ? <ZoomOut size={15} /> : <ZoomIn size={15} />}
                <span>{isZoomed ? "Ajustar a ventana" : "Ampliar con zoom"}</span>
              </button>

              <span className="canvas-orientation-tag">
                📐 Formato Horizontal (A4 / A3)
              </span>
            </div>
          </section>

          {/* Right Sidebar: Sheet Details, Two Clean Download Options & Skool QR */}
          <aside className="laminas-sidebar" aria-label="Detalles de descarga y comunidad">
            {/* Sheet Card Info */}
            <div className="lamina-info-card">
              <span className="lamina-badge-pill">{currentLamina.badge}</span>
              <h3 className="lamina-card-title">{currentLamina.title}</h3>
              <p className="lamina-card-desc">{currentLamina.description}</p>

              <div className="lamina-specs-list">
                <div className="lamina-spec-row">
                  <span>Orientación:</span>
                  <strong>{currentLamina.orientation}</strong>
                </div>
                <div className="lamina-spec-row">
                  <span>Formatos disponibles:</span>
                  <strong>PDF Vectorial &amp; PNG HD</strong>
                </div>
              </div>

              {/* Orderly, Non-Saturating Download Options */}
              <div className="lamina-download-group" aria-label="Opciones de descarga">
                <span className="download-group-label">Elige tu formato de descarga:</span>

                {/* Option 1: PDF Download */}
                <a
                  href={currentLamina.pdfUrl}
                  download={currentLamina.pdfDownloadName}
                  className="modal-download-card pdf-format"
                  title={`Descargar ${currentLamina.title} en PDF`}
                >
                  <div className="modal-download-icon">
                    <FileText size={20} />
                  </div>
                  <div className="modal-download-info">
                    <strong className="format-name">Descargar PDF</strong>
                    <span className="format-desc">Vectorial para imprimir ({currentLamina.pdfWeight})</span>
                  </div>
                  <Download size={16} className="modal-download-arrow" />
                </a>

                {/* Option 2: Image HD Download */}
                <a
                  href={currentLamina.imageUrl}
                  download={currentLamina.imageDownloadName}
                  className="modal-download-card image-format"
                  title={`Descargar ${currentLamina.title} en imagen PNG`}
                >
                  <div className="modal-download-icon">
                    <ImageIcon size={20} />
                  </div>
                  <div className="modal-download-info">
                    <strong className="format-name">Descargar Imagen HD</strong>
                    <span className="format-desc">PNG para celular o tablet ({currentLamina.imageWeight})</span>
                  </div>
                  <Download size={16} className="modal-download-arrow" />
                </a>
              </div>

              {/* Highlights */}
              <div className="lamina-highlights-list">
                {currentLamina.highlights.map((h, i) => (
                  <div key={i} className="lamina-highlight-item">
                    <CheckCircle2 size={14} className="text-emerald" aria-hidden="true" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic WhatsApp Free Admission Classes Card */}
            <div className="modal-whatsapp-card">
              <div className="whatsapp-card-badge">
                <MessageCircle size={13} className="whatsapp-icon" aria-hidden="true" />
                <span>Clases en Vivo Gratuitas</span>
              </div>
              <h4 className="modal-whatsapp-heading">
                ¿Quieres repasar ejercicios tipo examen con clases en vivo?
              </h4>
              <p className="modal-whatsapp-desc">
                Únete a la comunidad de postulantes en WhatsApp. Compartimos enlaces a clases gratuitas, solucionarios y tips de admisión.
              </p>
              <a
                href={whatsappCommunityUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-whatsapp-btn"
                title="Unirme al grupo de WhatsApp de clases gratuitas"
              >
                <MessageCircle size={16} />
                <span>Unirme al Grupo de WhatsApp</span>
                <ArrowUpRight size={14} />
              </a>
            </div>

            {/* Strategic Skool Community QR Card */}
            <div className="laminas-skool-card">
              <div className="skool-card-badge">
                <Sparkles size={13} aria-hidden="true" />
                <span>Preparación Preuniversitaria</span>
              </div>
              <h4 className="skool-card-heading">
                ¿Postulas a la UNI o San Marcos?
              </h4>
              <p className="skool-card-lead">
                Estas láminas te ayudarán con la teoría. Si deseas resolver bancos oficiales, simulacros y prepararte con clases especializadas, conéctate a la <strong>Comunidad Química Zenit en Skool</strong>.
              </p>

              {/* QR Code */}
              <div className="skool-qr-container">
                <div className="skool-qr-frame">
                  <img
                    src="/visuals/qr-skool-community.svg"
                    alt="Código QR de la comunidad Química Zenit en Skool"
                    className="skool-qr-image"
                  />
                </div>
                <div className="skool-qr-caption">
                  <QrCode size={14} aria-hidden="true" />
                  <span>Escanea con tu celular</span>
                </div>
              </div>

              <a
                href={communityUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="skool-community-link-btn"
                title="Abrir enlace a la comunidad de Química Zenit en Skool"
              >
                <span>Acceder a Química Zenit en Skool</span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>

              <small className="skool-card-note">
                Bancos de preguntas resueltos · Clases intensivas · Simulacros de examen
              </small>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
