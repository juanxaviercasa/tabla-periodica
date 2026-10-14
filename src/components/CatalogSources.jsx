import { getCatalogSources } from "../data/catalogSources.js";

export function CatalogSources({ element }) {
  return <section className="bento-card span-full catalog-sources" aria-labelledby="catalog-sources-title">
    <h2 id="catalog-sources-title">Fuentes y alcance de los datos</h2>
    <p>Referencias para contrastar los datos de {element.name}. Son fuentes de consulta; no implican aval oficial de esta aplicación ni verificación individual de todos los valores heredados.</p>
    <dl>{getCatalogSources(element).map(item => <div key={item.property}>
      <dt>{item.property}</dt><dd><a href={item.url} target="_blank" rel="noreferrer">{item.source}</a><p>{item.note}</p></dd>
    </div>)}</dl>
    {element.number >= 104 && <p className="model-note">Elemento superpesado: sus propiedades pueden ser predichas o desconocidas. Las visualizaciones son modelos educativos.</p>}
  </section>;
}
