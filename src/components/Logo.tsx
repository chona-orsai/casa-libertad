type LogoProps = {
  className?: string;
  showSubtitle?: boolean;
  style?: React.CSSProperties;
};

export function Logo({ className = "", showSubtitle = true, style }: LogoProps) {
  return (
    <span className={`logo-chalk ${className}`.trim()} style={style}>
      Casa Liber
      {showSubtitle && <small>Asociación Civil Casa Libertad</small>}
    </span>
  );
}
