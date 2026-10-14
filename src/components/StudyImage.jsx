import variants from "../data/imageVariants.json";
export const hasStudyImage = src => Boolean(variants[src]);

export function StudyImage({ src, sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 640px", ...props }) {
  const image = variants[src];
  if (src?.startsWith("/real-elements/") && !image) return null;
  return <img
    src={image?.variants.at(-1).src ?? src}
    srcSet={image?.variants.map(item => `${item.src} ${item.width}w`).join(", ")}
    sizes={image ? sizes : undefined}
    width={image?.width}
    height={image?.height}
    decoding="async"
    loading="lazy"
    {...props}
  />;
}
