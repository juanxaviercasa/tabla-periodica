import { lazy, Suspense, useEffect, useState } from "react";

function deferModal(loader, exportName) {
  const Modal = lazy(() => loader().then(module => ({ default: module[exportName] })));
  return function DeferredModal(props) {
    const [opened, setOpened] = useState(false);
    useEffect(() => { if (props.isOpen) setOpened(true); }, [props.isOpen]);
    if (!props.isOpen && !opened) return null;
    return <Suspense fallback={<p className="deferred-modal-loading" role="status">Cargando herramienta…</p>}><Modal {...props} /></Suspense>;
  };
}

export const StudyGuideModal = deferModal(() => import("./StudyGuideModal.jsx"), "StudyGuideModal");
export const ElementSpellerModal = deferModal(() => import("./ElementSpellerModal.jsx"), "ElementSpellerModal");
export const LaminasViewerModal = deferModal(() => import("./LaminasViewerModal.jsx"), "LaminasViewerModal");
export const MisconceptionsGuideModal = deferModal(() => import("./MisconceptionsGuideModal.jsx"), "MisconceptionsGuideModal");
