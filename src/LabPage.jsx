import { useMemo, useState } from "react";
import { ArrowLeft, Atom, CheckCircle, Minus, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const presets = [
  { name: "Hidrógeno", symbol: "H", protons: 1, neutrons: 0, electrons: 1 },
  { name: "Carbono-12", symbol: "C", protons: 6, neutrons: 6, electrons: 6 },
  { name: "Sodio", symbol: "Na", protons: 11, neutrons: 12, electrons: 10 }
];

export default function LabPage() {
  const [protons, setProtons] = useState(6);
  const [neutrons, setNeutrons] = useState(6);
  const [electrons, setElectrons] = useState(6);
  const charge = protons - electrons;
  const preset = useMemo(() => presets.find((item) => item.protons === protons && item.neutrons === neutrons && item.electrons === electrons), [protons, neutrons, electrons]);
  const setValue = (setter, value) => setter(Math.max(0, Math.min(30, value)));

  return <main className="lab-page"><Link className="back-button" to="/"><ArrowLeft size={16} /> Volver</Link><div className="lab-hero"><img src="/visuals/lab-atom-builder.jpg" alt="" className="hero-img" loading="lazy" /><div className="hero-content"><span className="eyebrow">Laboratorio de estructura</span><h1>Construye un átomo y observa qué cambia.</h1><p>Protones definen el elemento, neutrones cambian el isótopo y electrones cambian la carga.</p></div></div><section className="lab-workbench"><div className="atom-stage"><div className="atom-orbit orbit-one"><span /></div><div className="atom-orbit orbit-two"><span /></div><div className="atom-nucleus"><strong>{protons}</strong><small>p+</small></div><div className="atom-readout"><strong>{preset?.name ?? (protons ? "Elemento construido" : "Sin elemento")}</strong><span>{protons ? `Z = ${protons} · A = ${protons + neutrons} · ${charge === 0 ? "átomo neutro" : charge > 0 ? `catión ${charge}+` : `anión ${Math.abs(charge)}−`}` : "Añade protones para empezar"}</span></div></div><div className="lab-controls"><h2>Partículas</h2>{[["Protones", protons, setProtons, "Define el elemento"], ["Neutrones", neutrons, setNeutrons, "Define el isótopo"], ["Electrones", electrons, setElectrons, "Define la carga"]].map(([label, value, setter, hint]) => <div className="particle-control" key={label}><div><strong>{label}</strong><small>{hint}</small></div><div className="stepper"><button onClick={() => setValue(setter, value - 1)} aria-label={`Quitar ${label}`}><Minus size={15} /></button><b>{value}</b><button onClick={() => setValue(setter, value + 1)} aria-label={`Añadir ${label}`}><Plus size={15} /></button></div></div>)}<div className="lab-callout"><CheckCircle size={16} /><span>{charge === 0 ? "Tu átomo es eléctricamente neutro." : `Tiene carga ${charge > 0 ? "+" : "−"}${Math.abs(charge)} porque protones y electrones no están equilibrados.`}</span></div></div></section><section className="lab-challenge"><Atom size={20} /><div><strong>Reto rápido</strong><p>Construye un catión de sodio: 11 protones, 12 neutrones y 10 electrones.</p></div></section></main>;
}
