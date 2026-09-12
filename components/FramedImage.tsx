import Image from "next/image";

type FramedImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

export default function FramedImage({ src, alt, className = "", priority = false }: FramedImageProps) {
  return (
    <div className={`watercolor-frame relative aspect-[4/5] overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 90vw, 480px"
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}
