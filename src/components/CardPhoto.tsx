export type CardPhotoKey =
  | "service-fumigation"
  | "service-cleaning"
  | "service-waste-collection"
  | "service-landscaping"
  | "service-consultancy"
  | "audience-organisation"
  | "audience-household";

/** Responsive decorative 16:10 AVIF/WebP/JPEG card photograph with lazy loading and surface fallback. */
export function CardPhoto({ photo, sizes }: { photo: CardPhotoKey; sizes: string }) {
  return (
    <picture className="block size-full">
      <source
        type="image/avif"
        srcSet={`/cards/${photo}-1x.avif 640w, /cards/${photo}-2x.avif 960w`}
        sizes={sizes}
      />
      <source
        type="image/webp"
        srcSet={`/cards/${photo}-1x.webp 640w, /cards/${photo}-2x.webp 960w`}
        sizes={sizes}
      />
      <img
        src={`/cards/${photo}-1x.jpg`}
        alt=""
        width={640}
        height={400}
        loading="lazy"
        decoding="async"
        className="card-photo-img size-full object-cover"
      />
    </picture>
  );
}

