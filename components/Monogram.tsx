type MonogramProps = {
  className?: string;
};

export default function Monogram({ className = "" }: MonogramProps) {
  return (
    <div className={`flex items-center justify-center gap-2 text-gold ${className}`}>
      <span aria-hidden="true" className="gold-divider w-6" />
      <span className="font-script text-4xl leading-none">JW</span>
      <span aria-hidden="true" className="gold-divider w-6" />
    </div>
  );
}
