type LogoProps = {
  className?: string;
  showSubtitle?: boolean;
  style?: React.CSSProperties;
};

export function Logo({ className = "", showSubtitle = true, style }: LogoProps) {
  return (
    <span
      className={`logo-chalk inline-block rotate-[-1.5deg] font-chalk text-[1.6rem] leading-none font-bold tracking-[0.5px] text-verde sm:text-[1.75rem] min-[861px]:text-[2.1rem] ${className}`.trim()}
      style={style}
    >
      Casa Liber
      {showSubtitle && (
        <small className="mt-0.5 block font-sans text-[0.55rem] font-semibold tracking-[2px] text-tierra uppercase sm:text-[0.62rem] sm:tracking-[2.5px] [filter:none] [text-shadow:none] [transform:none]">
          Asociación Civil Casa Libertad
        </small>
      )}
    </span>
  );
}
